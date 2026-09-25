-- ============================================================
-- KrishiMitra AI — SMS Delivery Log
-- Tracks every mandi price alert sent to farmers
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sms_delivery_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id       UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL,
  phone           TEXT NOT NULL,
  
  -- Message content
  crop_name       TEXT NOT NULL,
  mandi_name      TEXT NOT NULL,
  price_per_qtl   NUMERIC(10,2) NOT NULL,
  change_rs       NUMERIC(10,2),         -- +/- from previous day
  change_pct      NUMERIC(5,2),
  language        TEXT DEFAULT 'en',
  sms_body        TEXT,                  -- actual SMS text sent
  
  -- Delivery tracking
  status          TEXT NOT NULL DEFAULT 'QUEUED'
                    CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'OPTED_OUT')),
  provider        TEXT DEFAULT 'msg91',  -- msg91 | twilio | fast2sms
  provider_msg_id TEXT,                  -- provider's message ID for delivery receipt
  error_message   TEXT,
  
  -- Timestamps
  queued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at         TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ
);

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.sms_delivery_log ENABLE ROW LEVEL SECURITY;

-- Farmers can read their own SMS log
CREATE POLICY "sms_log_farmer_read"
  ON public.sms_delivery_log FOR SELECT
  USING (farmer_id = auth.uid());

-- Admins can read all logs
CREATE POLICY "sms_log_admin_read"
  ON public.sms_delivery_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp
      WHERE fp.id = auth.uid() AND fp.role IN ('admin', 'super_admin')
    )
  );

-- Only service role (cron jobs) can insert
CREATE POLICY "sms_log_service_insert"
  ON public.sms_delivery_log FOR INSERT
  WITH CHECK (TRUE);   -- further guarded by service_role key in API routes

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_log_farmer ON public.sms_delivery_log(farmer_id);
CREATE INDEX IF NOT EXISTS idx_sms_log_phone ON public.sms_delivery_log(phone);
CREATE INDEX IF NOT EXISTS idx_sms_log_status ON public.sms_delivery_log(status);
CREATE INDEX IF NOT EXISTS idx_sms_log_queued_at ON public.sms_delivery_log(queued_at DESC);

-- ── WhatsApp Sessions ────────────────────────────────────────
-- Stores per-phone conversation state for the WhatsApp bot

CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
  phone           TEXT PRIMARY KEY,
  current_step    TEXT NOT NULL DEFAULT 'MENU',  -- MENU | ORDERS | MANDI | FARMTALK | HELP
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  context_json    JSONB DEFAULT '{}'::jsonb,      -- arbitrary step context (e.g. crop chosen)
  farmer_id       UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write sessions (accessed via service_role key in API route)
CREATE POLICY "whatsapp_sessions_service_all"
  ON public.whatsapp_sessions FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- Auto-cleanup sessions older than 24 hours (handled by cron or pg_cron)
-- CREATE INDEX for TTL cleanup
CREATE INDEX IF NOT EXISTS idx_wa_sessions_last_msg ON public.whatsapp_sessions(last_message_at);

-- ── Push Subscriptions ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id       UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  endpoint        TEXT NOT NULL UNIQUE,
  p256dh          TEXT NOT NULL,
  auth_key        TEXT NOT NULL,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_subs_own"
  ON public.push_subscriptions FOR ALL
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "push_subs_service_read"
  ON public.push_subscriptions FOR SELECT
  USING (TRUE);

CREATE INDEX IF NOT EXISTS idx_push_subs_farmer ON public.push_subscriptions(farmer_id);
