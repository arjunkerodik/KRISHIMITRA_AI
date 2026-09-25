-- ============================================================
-- KrishiMitra AI — Farmer Profiles Migration
-- Run this in the Supabase SQL Editor under your project
-- ============================================================

-- Farmer profiles table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity
  full_name      TEXT,
  phone          TEXT UNIQUE,
  
  -- Role & Access
  role           TEXT NOT NULL DEFAULT 'farmer'
                   CHECK (role IN ('farmer', 'expert', 'admin', 'super_admin')),
  
  -- Location
  village        TEXT,
  taluk          TEXT,
  district       TEXT,
  state          TEXT DEFAULT 'Karnataka',
  pincode        TEXT,
  
  -- Farm details (collected progressively)
  land_size_acres     NUMERIC(6,2),
  ownership_type      TEXT CHECK (ownership_type IN ('owned', 'leased', 'shared', NULL)),
  irrigation_type     TEXT CHECK (irrigation_type IN ('rain-fed', 'borewell', 'canal', 'drip', 'sprinkler', NULL)),
  primary_crops       TEXT[],          -- e.g. ['tomato', 'paddy']
  social_category     TEXT CHECK (social_category IN ('general', 'sc', 'st', 'obc', NULL)),
  
  -- Communication preferences
  preferred_language  TEXT NOT NULL DEFAULT 'en'
                        CHECK (preferred_language IN ('en', 'hi', 'kn', 'te', 'ta', 'mr')),
  sms_opt_in          BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_opt_in     BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Onboarding tracking (for progressive profile completion)
  onboarding_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  profile_completion_pct  INTEGER NOT NULL DEFAULT 0,    -- 0-100
  
  -- Meta
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS farmer_profiles_updated_at ON public.farmer_profiles;
CREATE TRIGGER farmer_profiles_updated_at
  BEFORE UPDATE ON public.farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create a minimal profile row when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.farmer_profiles (id, phone, role)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Farmers can only read/update their own row
CREATE POLICY "farmer_profiles_own_read"
  ON public.farmer_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "farmer_profiles_own_update"
  ON public.farmer_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "farmer_profiles_admin_read"
  ON public.farmer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp
      WHERE fp.id = auth.uid() AND fp.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update any profile (for support/moderation)
CREATE POLICY "farmer_profiles_admin_update"
  ON public.farmer_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp
      WHERE fp.id = auth.uid() AND fp.role IN ('admin', 'super_admin')
    )
  );

-- ── Indexes ───────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_farmer_profiles_phone ON public.farmer_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_district ON public.farmer_profiles(district);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_sms_opt_in ON public.farmer_profiles(sms_opt_in) WHERE sms_opt_in = TRUE;
