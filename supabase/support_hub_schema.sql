-- ============================================================
-- KRISHIMITRA AI — SUPPORT HUB POSTGRESQL & SUPABASE SCHEMA
-- Comprehensive Farmer Services, Document Vault, Scheme Tracker,
-- Verified Government Service Locator, and Audit Logs
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. FARMER DOCUMENTS (Private Secure Document Vault)
-- ------------------------------------------------------------
create table if not exists public.farmer_documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  farm_id uuid references public.farms(id) on delete set null,
  document_type text not null check (document_type in ('soil_report', 'land_record_rtc', 'crop_record', 'insurance_policy', 'scheme_doc', 'receipt_invoice', 'certificate', 'other')),
  document_name text not null,
  file_path text not null, -- Private storage path in 'farmer-documents' bucket
  file_size integer not null default 0, -- bytes
  mime_type text not null default 'application/pdf',
  uploaded_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.farmer_documents enable row level security;

create policy "Farmer can manage own documents" on public.farmer_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 2. GOVERNMENT SCHEME APPLICATIONS & HISTORY
-- ------------------------------------------------------------
create table if not exists public.scheme_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scheme_id text not null,
  scheme_name text not null,
  farm_id uuid references public.farms(id) on delete set null,
  application_reference_number text not null unique,
  submission_date date default current_date,
  status text not null default 'SUBMITTED' check (status in ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_REQUIRED', 'APPROVED', 'REJECTED', 'WITHDRAWN', 'COMPLETED')),
  last_updated timestamptz default now(),
  remarks text,
  required_action text,
  documents jsonb default '[]'::jsonb, -- Array of attached document paths
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.scheme_applications enable row level security;

create policy "Farmer can view and manage own applications" on public.scheme_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.scheme_application_history (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.scheme_applications(id) on delete cascade not null,
  status text not null,
  remarks text,
  changed_by text not null default 'System',
  changed_at timestamptz default now()
);

alter table public.scheme_application_history enable row level security;

create policy "Farmer can view history of own applications" on public.scheme_application_history
  for select using (
    exists (
      select 1 from public.scheme_applications a
      where a.id = scheme_application_history.application_id and a.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 3. FARMER BENEFITS & SUBSIDIES TRACKER
-- ------------------------------------------------------------
create table if not exists public.farmer_benefits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scheme_id text not null,
  scheme_name text not null,
  application_id uuid references public.scheme_applications(id) on delete set null,
  benefit_type text not null,
  expected_amount numeric(12,2),
  approved_amount numeric(12,2),
  status text not null default 'APPLIED' check (status in ('APPLIED', 'UNDER_PROCESS', 'APPROVED', 'RECEIVED', 'REJECTED')),
  approval_date date,
  benefit_date date,
  source text not null default 'Karnataka Dept of Agriculture / DBT',
  updated_at timestamptz default now()
);

alter table public.farmer_benefits enable row level security;

create policy "Farmer can view own benefits" on public.farmer_benefits
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. OFFICIAL FARMER NOTICES (Verified Govt Announcements)
-- ------------------------------------------------------------
create table if not exists public.official_notices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_kn text,
  description text not null,
  description_kn text,
  category text not null check (category in ('Advisory', 'Announcement', 'Weather', 'Scheme', 'CropNotice', 'General')),
  state text not null default 'Karnataka',
  district text,
  published_at timestamptz default now(),
  valid_from date not null default current_date,
  valid_until date not null,
  source_name text not null,
  source_url text not null,
  verification_status text not null default 'VERIFIED' check (verification_status in ('VERIFIED', 'UNVERIFIED', 'ARCHIVED')),
  verified_at timestamptz default now(),
  verified_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.official_notices enable row level security;

create policy "Anyone authenticated can view verified notices" on public.official_notices
  for select using (verification_status = 'VERIFIED');

-- ------------------------------------------------------------
-- 5. AGRICULTURAL IMPORTANT DATES & DEADLINES
-- ------------------------------------------------------------
create table if not exists public.important_dates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  title_kn text,
  description text not null,
  description_kn text,
  category text not null check (category in ('SchemeDeadline', 'InsuranceDeadline', 'ApplicationWindow', 'CropDeadline', 'Camp')),
  state text not null default 'Karnataka',
  district text,
  start_date date not null default current_date,
  deadline date not null,
  source_name text not null,
  source_url text not null,
  verification_status text not null default 'VERIFIED' check (verification_status in ('VERIFIED', 'UNVERIFIED')),
  verified_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.important_dates enable row level security;

create policy "Anyone authenticated can view verified important dates" on public.important_dates
  for select using (verification_status = 'VERIFIED');

-- ------------------------------------------------------------
-- 6. SUPPORT SERVICES & VERIFIED SERVICE PROVIDERS
-- ------------------------------------------------------------
create table if not exists public.support_services (
  id text primary key,
  name text not null,
  name_kn text,
  category text not null,
  description text not null,
  description_kn text,
  is_active boolean default true
);

create table if not exists public.service_providers (
  id uuid primary key default uuid_generate_v4(),
  organization_name text not null,
  provider_type text not null check (provider_type in ('Government', 'FPO', 'PrivateVerified', 'University', 'KVK')),
  district text not null,
  taluk text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  phone text,
  email text,
  website text,
  verification_status text not null default 'VERIFIED' check (verification_status in ('PENDING', 'VERIFIED', 'SUSPENDED')),
  verified_at timestamptz default now(),
  verified_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.service_providers enable row level security;

create policy "Anyone authenticated can view verified providers" on public.service_providers
  for select using (verification_status = 'VERIFIED');

create table if not exists public.provider_services (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references public.service_providers(id) on delete cascade not null,
  service_id text references public.support_services(id) on delete cascade not null,
  rate numeric(10,2),
  rate_unit text,
  availability_status text default 'Available'
);

-- ------------------------------------------------------------
-- 7. SERVICE REQUESTS & HISTORY
-- ------------------------------------------------------------
create table if not exists public.service_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  farm_id uuid references public.farms(id) on delete set null,
  farm_name text,
  service_id text references public.support_services(id) on delete restrict not null,
  service_name text not null,
  provider_id uuid references public.service_providers(id) on delete set null,
  provider_name text,
  location text not null,
  latitude double precision,
  longitude double precision,
  requested_date date not null default current_date,
  quantity text,
  description text not null,
  attachment_url text,
  priority text not null default 'NORMAL' check (priority in ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  status text not null default 'REQUESTED' check (status in ('REQUESTED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.service_requests enable row level security;

create policy "Farmer can view and manage own requests" on public.service_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.service_request_history (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.service_requests(id) on delete cascade not null,
  status text not null,
  remarks text,
  changed_by text not null default 'System',
  changed_at timestamptz default now()
);

alter table public.service_request_history enable row level security;

create policy "Farmer can view own request history" on public.service_request_history
  for select using (
    exists (
      select 1 from public.service_requests r
      where r.id = service_request_history.request_id and r.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 8. SERVICE FEEDBACK
-- ------------------------------------------------------------
create table if not exists public.service_feedback (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.service_requests(id) on delete cascade not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider_id uuid references public.service_providers(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  feedback text not null,
  created_at timestamptz default now()
);

alter table public.service_feedback enable row level security;

create policy "Farmer can submit and view feedback for own requests" on public.service_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 9. NOTIFICATIONS & DEADLINE REMINDERS
-- ------------------------------------------------------------
create table if not exists public.support_notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('application', 'service_request', 'notice', 'deadline', 'document')),
  title text not null,
  message text not null,
  reference_type text,
  reference_id text,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.support_notifications enable row level security;

create policy "Farmer can manage own notifications" on public.support_notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 10. SUPPORT AUDIT LOGS
-- ------------------------------------------------------------
create table if not exists public.support_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id text not null,
  actor_role text not null default 'farmer',
  action text not null,
  entity_type text not null,
  entity_id text not null,
  timestamp timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

alter table public.support_audit_logs enable row level security;

create policy "Only admin can view audit logs" on public.support_audit_logs
  for select using (auth.jwt() ->> 'role' = 'admin');

-- ------------------------------------------------------------
-- 11. INITIAL SEED FOR VERIFIED GOVERNMENT & EXTENSION SERVICES
-- ------------------------------------------------------------
insert into public.support_services (id, name, name_kn, category, description, description_kn) values
('dept_agri', 'Agriculture Department Office', 'ಕೃಷಿ ಇಲಾಖೆ ಕಚೇರಿ', 'Agriculture Department', 'District and Taluk Assistant Director of Agriculture offices for input subsidies and farmer schemes.', 'ರೈತ ಯೋಜನೆಗಳು ಮತ್ತು ಸಹಾಯಧನಗಳಿಗಾಗಿ ಸಹಾಯಕ ಕೃಷಿ ನಿರ್ದೇಶಕರ ಕಚೇರಿ.'),
('soil_testing', 'Official Soil Testing Laboratory', 'ಅಧಿಕೃತ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯ', 'Soil Testing', 'Government certified laboratory for macronutrient, micronutrient, and Soil Health Card generation.', 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಮತ್ತು ಆರೋಗ್ಯ ಪತ್ರಿಕೆಗಾಗಿ ಸರ್ಕಾರಿ ಪ್ರಮಾಣೀಕೃತ ಲ್ಯಾಬ್.'),
('rsk_center', 'Raitha Samparka Kendra (RSK)', 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK)', 'Agricultural Extension', 'Panchayat level nodal centre for subsidized certified seeds, bio-fertilizers, and technical advisory.', 'ರಿಯಾಯಿತಿ ದರದ ಬೀಜ, ರಸಗೊಬ್ಬರ ಮತ್ತು ತಾಂತ್ರಿಕ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರ.'),
('kvk_centre', 'Krishi Vigyan Kendra (ICAR-KVK)', 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (ICAR-KVK)', 'Agricultural Extension', 'Frontline ICAR extension centre for farm demonstrations, pest clinics, and scientist consultations.', 'ಕೃಷಿ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಮತ್ತು ವಿಜ್ಞಾನಿಗಳ ನೇರ ಸಮಾಲೋಚನಾ ಕೇಂದ್ರ.'),
('apmc_mandi', 'APMC Mandi Yard & e-NAM Counter', 'ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಇ-ನ್ಯಾಮ್', 'APMC-related services', 'Regulated market yard for electronic trading, assaying, weighing, and instant auction realization.', 'ವಿದ್ಯುನ್ಮಾನ ಬೆಳೆ ಹರಾಜು, ತೂಕ ಮತ್ತು ನೇರ ಮಾರಾಟ ಮಾರುಕಟ್ಟೆ.'),
('chc_machinery', 'Custom Hiring Centre (CHC)', 'ಕೃಷಿ ಯಂತ್ರಧಾರೆ ಕೇಂದ್ರ (CHC)', 'Farm Machinery', 'Government supported shared farm equipment hiring centre for tractors, rotavators, and harvesters.', 'ಕಡಿಮೆ ಬಾಡಿಗೆ ದರದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ಟರ್ ಮತ್ತು ಸುಗ್ಗಿಯಂತ್ರ ಒದಗಿಸುವ ಕೇಂದ್ರ.')
on conflict (id) do nothing;
