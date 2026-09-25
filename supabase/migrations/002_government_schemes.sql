-- ============================================================
-- KrishiMitra AI — Government Schemes Table
-- Allows admins to add/edit schemes without a code deploy
-- ============================================================

CREATE TABLE IF NOT EXISTS public.government_schemes (
  id                TEXT PRIMARY KEY,  -- e.g. "sch_pmkisan"
  title             TEXT NOT NULL,
  code_name         TEXT,
  ministry          TEXT,
  department        TEXT,
  level             TEXT CHECK (level IN ('Central', 'State')),
  state_applicability TEXT[],
  category          TEXT,
  short_description TEXT,
  eligibility       TEXT[],
  benefits          TEXT,
  subsidy_percentage INTEGER,
  max_financial_assistance TEXT,
  documents_required TEXT[],
  application_process TEXT[],
  last_verified     DATE,
  official_portal   TEXT,
  official_application_url TEXT,
  myscheme_url      TEXT,
  helpline_phone    TEXT,
  helpline_email    TEXT,
  is_verified_official BOOLEAN DEFAULT TRUE,
  status            TEXT CHECK (status IN ('Active', 'Upcoming', 'Closing Soon')) DEFAULT 'Active',
  deadline_text     TEXT,
  deadline_date     DATE,   -- for deadline proximity alerts
  
  -- Structured eligibility matching (replaces free-text filtering)
  match_criteria    JSONB DEFAULT '{}'::jsonb,
  -- Shape: {
  --   maxLandAcres: number,
  --   minLandAcres: number,
  --   eligibleStates: string[],
  --   eligibleCrops: string[],
  --   eligibleSoilTypes: string[],
  --   irrigationType: string[],
  --   eligibleCategories: string[],  -- ["sc", "st", "obc", "general"]
  --   ownershipType: string[]        -- ["owned", "leased"]
  -- }
  
  -- Admin tracking
  created_by        UUID REFERENCES auth.users(id),
  updated_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS government_schemes_updated_at ON public.government_schemes;
CREATE TRIGGER government_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read schemes
CREATE POLICY "schemes_public_read"
  ON public.government_schemes FOR SELECT
  TO authenticated
  USING (TRUE);

-- Only admins can insert/update/delete
CREATE POLICY "schemes_admin_write"
  ON public.government_schemes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp
      WHERE fp.id = auth.uid() AND fp.role IN ('admin', 'super_admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schemes_status ON public.government_schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_level ON public.government_schemes(level);
CREATE INDEX IF NOT EXISTS idx_schemes_match_criteria ON public.government_schemes USING GIN(match_criteria);
CREATE INDEX IF NOT EXISTS idx_schemes_deadline ON public.government_schemes(deadline_date) WHERE deadline_date IS NOT NULL;
