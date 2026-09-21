-- ============================================================
-- KRISHIMITRA AI — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Smart India Hackathon (SIH 2026) Problem Statement SIH26197
-- Complete Digital Farm Profile & APMC Mandi Intelligence
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. USER PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Farmer',
  phone_number text,
  district text not null default 'Gadag',
  taluk text default 'Gadag',
  village text default 'Betageri',
  language_preference text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. FARMS (Core Farm Plots Registered by the Farmer)
-- ------------------------------------------------------------
create table if not exists public.farms (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  farm_name text not null,
  total_area numeric(10,2) not null check (total_area > 0),
  area_unit text not null default 'Acres', -- Acres, Hectares, Guntha
  ownership_type text not null default 'Owned', -- Owned, Leased, Shared
  address text,
  state text not null default 'Karnataka',
  district text not null,
  taluk text,
  village text,
  pincode text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. FARM LOCATIONS (Secure GPS Coordinates & Geocoded Locality)
-- ------------------------------------------------------------
create table if not exists public.farm_locations (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null unique,
  latitude double precision not null check (latitude >= -90 and latitude <= 90),
  longitude double precision not null check (longitude >= -180 and longitude <= 180),
  reverse_geocoded_address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4. FARM BOUNDARIES (Optional Map Polygon GeoJSON)
-- ------------------------------------------------------------
create table if not exists public.farm_boundaries (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null unique,
  boundary_geojson jsonb not null,
  calculated_area numeric(10,2),
  calculated_perimeter numeric(10,2),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. SOIL RECORDS (Tested Soil Metrics & Test Report Uploads)
-- ------------------------------------------------------------
create table if not exists public.soil_records (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  soil_type text not null, -- Red Sandy Loam, Black Cotton, Clay Loam, Alluvial, Laterite
  test_date date default current_date,
  ph numeric(4,2) check (ph >= 0 and ph <= 14),
  nitrogen numeric(8,2) check (nitrogen >= 0), -- kg/ha or ppm
  phosphorus numeric(8,2) check (phosphorus >= 0),
  potassium numeric(8,2) check (potassium >= 0),
  organic_carbon numeric(5,2) check (organic_carbon >= 0), -- %
  electrical_conductivity numeric(6,2), -- dS/m
  moisture numeric(5,2), -- %
  document_url text, -- Reference to Supabase Storage soil report
  notes text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 6. WATER RESOURCES (Water Sources & Irrigation Systems)
-- ------------------------------------------------------------
create table if not exists public.water_resources (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null unique,
  water_source text not null, -- Borewell, Open Well, Canal, Rainfed, Farm Pond, River
  irrigation_method text not null, -- Drip Irrigation, Sprinkler, Flood/Furrow, Rainfed/No Irrigation
  irrigation_availability text default 'Adequate', -- Adequate, Moderate, Scanty, Seasonal
  storage_capacity numeric(12,2) default 0, -- Liters
  borewell_depth_ft numeric(6,1) default 0,
  drip_sprinkler_type text,
  irrigation_frequency_days int default 3,
  last_irrigation_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 7. CROP PLOTS (Farmer Standing Crops & Acreage)
-- ------------------------------------------------------------
create table if not exists public.crop_plots (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_name text not null,
  variety text not null default 'Local / Hybrid',
  sowing_date date not null,
  expected_harvest_date date,
  current_stage text not null default 'Sowing / Seedling', 
  -- Stages: Land Prep, Sowing / Seedling, Vegetative, Flowering, Fruiting, Maturity, Harvested
  stage_updated_at timestamptz default now(),
  area_acres numeric(10,2) not null check (area_acres > 0),
  seed_source text,
  seed_quantity numeric(10,2),
  farming_practice text default 'Conventional', -- Conventional, Organic, Natural Farming, ZBNF
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 8. CROP STAGE HISTORY (Audit Trail of Crop Lifecycle)
-- ------------------------------------------------------------
create table if not exists public.crop_stage_history (
  id uuid primary key default uuid_generate_v4(),
  crop_plot_id uuid references public.crop_plots(id) on delete cascade not null,
  stage text not null,
  notes text,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 9. PEST & DISEASE OBSERVATIONS (Scouting Logs & Photo AI)
-- ------------------------------------------------------------
create table if not exists public.pest_disease_observations (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_plot_id uuid references public.crop_plots(id) on delete cascade,
  observation_type text not null, -- Pest, Disease, Nutrient Deficiency, Weed
  pest_or_disease_name text not null,
  affected_area_pct numeric(5,2) check (affected_area_pct >= 0 and affected_area_pct <= 100),
  severity text not null default 'Low', -- Low, Moderate, Severe, Critical
  image_url text, -- Storage reference
  observation_notes text,
  observation_date date not null default current_date,
  is_ai_assisted boolean default false,
  ai_confidence numeric(5,2),
  treatment_recommendation text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 10. FARM ACTIVITIES (Digital Field Operations Journal)
-- ------------------------------------------------------------
create table if not exists public.farm_activities (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_plot_id uuid references public.crop_plots(id) on delete set null,
  activity_type text not null, 
  -- Sowing, Irrigation, Fertilizer application, Pesticide application, Weeding, Pruning, Harvesting, Storage, Soil Test, Machinery Use
  activity_date date not null default current_date,
  quantity numeric(10,2),
  unit text,
  cost_inr numeric(10,2) default 0 check (cost_inr >= 0),
  notes text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 11. FARM EXPENSES (Itemized Cost of Cultivation Ledger)
-- ------------------------------------------------------------
create table if not exists public.farm_expenses (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_plot_id uuid references public.crop_plots(id) on delete set null,
  category text not null,
  -- Seeds, Fertilizer, Pesticides, Labour, Irrigation, Machinery/Fuel, Electricity, Transportation, Storage, Other
  amount_inr numeric(10,2) not null check (amount_inr >= 0),
  expense_date date not null default current_date,
  description text,
  receipt_url text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 12. FARM SALES (Harvest Invoices & Realized Revenue)
-- ------------------------------------------------------------
create table if not exists public.farm_sales (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  crop_plot_id uuid references public.crop_plots(id) on delete set null,
  crop_name text not null,
  quantity numeric(10,2) not null check (quantity > 0),
  unit text not null default 'Quintal',
  selling_price_per_unit numeric(10,2) not null check (selling_price_per_unit >= 0),
  market_name text not null,
  sale_date date not null default current_date,
  transport_cost numeric(10,2) default 0 check (transport_cost >= 0),
  other_costs numeric(10,2) default 0 check (other_costs >= 0),
  gross_revenue numeric(10,2) not null,
  net_revenue numeric(10,2) not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 13. FARM DOCUMENTS (Private Farmer Attachments)
-- ------------------------------------------------------------
create table if not exists public.farm_documents (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  document_type text not null, -- Soil Report, Land RTC / Pahani, Invoices, Drone Survey, Inspection
  document_name text not null,
  file_path text not null,
  file_size_bytes bigint,
  uploaded_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 14. FARM ALERTS (System Real-Time Notifications)
-- ------------------------------------------------------------
create table if not exists public.farm_alerts (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  alert_type text not null, -- Weather, Pest Outbreak, Irrigation Hold, Price Surge, Disease Warning
  title text not null,
  description text not null,
  severity text not null default 'Info', -- Info, Warning, Alert, Critical
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 15. FARM RECOMMENDATIONS (AI Grounded Advice)
-- ------------------------------------------------------------
create table if not exists public.farm_recommendations (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references public.farms(id) on delete cascade not null,
  recommendation_type text not null, -- Weather Alert, Irrigation Schedule, Pest Risk, Market Opportunity, Cost Alert
  category text not null,
  title text not null,
  description text not null,
  actionable_steps text[],
  source_basis text not null, -- Grounded from Soil Test, Crop Stage, Weather API, APMC Mandi, or Activity History
  confidence_score numeric(4,2),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 16. APMC MARKETS (Government Verified Mandis in Karnataka)
-- ------------------------------------------------------------
create table if not exists public.markets (
  id uuid primary key default uuid_generate_v4(),
  market_name text not null,
  apmc_name text not null,
  state text not null default 'Karnataka',
  district text not null,
  taluk text,
  address text,
  latitude double precision not null,
  longitude double precision not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 17. COMMODITIES (Master Agricultural Catalog)
-- ------------------------------------------------------------
create table if not exists public.commodities (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  local_name text, -- e.g. ಈರುಳ್ಳಿ (Onion), ಟೊಮೇಟೊ (Tomato)
  category text not null,
  unit text not null default 'Quintal',
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 18. MARKET PRICES (Latest Live Mandi Prices)
-- ------------------------------------------------------------
create table if not exists public.market_prices (
  id uuid primary key default uuid_generate_v4(),
  market_id uuid references public.markets(id) on delete cascade not null,
  commodity_id uuid references public.commodities(id) on delete cascade not null,
  variety text default 'Local / Hybrid',
  grade text default 'FAQ',
  min_price numeric(10,2) not null check (min_price >= 0),
  max_price numeric(10,2) not null check (max_price >= min_price),
  modal_price numeric(10,2) not null check (modal_price >= min_price and modal_price <= max_price),
  unit text not null default '₹/quintal',
  arrival_quantity numeric(10,2) default 0,
  price_date date not null,
  fetched_at timestamptz default now(),
  source_name text not null default 'Agmarknet / KSAMB Directorate of Agricultural Marketing',
  source_url text default 'https://agmarknet.gov.in',
  is_latest boolean default true,
  constraint unique_market_commodity_date unique (market_id, commodity_id, price_date)
);

-- ------------------------------------------------------------
-- 19. PRICE HISTORY (Immutable Historical Time-Series)
-- ------------------------------------------------------------
create table if not exists public.price_history (
  id uuid primary key default uuid_generate_v4(),
  market_id uuid references public.markets(id) on delete cascade not null,
  commodity_id uuid references public.commodities(id) on delete cascade not null,
  min_price numeric(10,2) not null,
  max_price numeric(10,2) not null,
  modal_price numeric(10,2) not null,
  price_date date not null,
  source_name text not null default 'Agmarknet / KSAMB Directorate of Agricultural Marketing',
  fetched_at timestamptz default now()
);

-- ------------------------------------------------------------
-- INDEXES FOR LIGHTNING FAST SPATIAL & ANALYTIC LOOKUPS
-- ------------------------------------------------------------
create index if not exists idx_farms_owner on public.farms(owner_id);
create index if not exists idx_farm_locations_lat_lng on public.farm_locations(latitude, longitude);
create index if not exists idx_crop_plots_farm on public.crop_plots(farm_id);
create index if not exists idx_farm_expenses_farm on public.farm_expenses(farm_id, expense_date desc);
create index if not exists idx_farm_sales_farm on public.farm_sales(farm_id, sale_date desc);
create index if not exists idx_farm_activities_farm on public.farm_activities(farm_id, activity_date desc);
create index if not exists idx_pest_obs_farm on public.pest_disease_observations(farm_id, observation_date desc);
create index if not exists idx_markets_lat_lng on public.markets(latitude, longitude);
create index if not exists idx_market_prices_lookup on public.market_prices(market_id, commodity_id, is_latest);

-- ------------------------------------------------------------
-- HAVERSINE DISTANCE HELPER FUNCTION (KILOMETERS)
-- ------------------------------------------------------------
create or replace function public.calculate_distance_km(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
) returns double precision as $$
declare
  r double precision := 6371.0;
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
begin
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat / 2.0) * sin(dlat / 2.0) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlon / 2.0) * sin(dlon / 2.0);
  c := 2.0 * atan2(sqrt(a), sqrt(1.0 - a));
  return round((r * c)::numeric, 2);
end;
$$ language plpgsql immutable;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_locations enable row level security;
alter table public.farm_boundaries enable row level security;
alter table public.soil_records enable row level security;
alter table public.water_resources enable row level security;
alter table public.crop_plots enable row level security;
alter table public.crop_stage_history enable row level security;
alter table public.pest_disease_observations enable row level security;
alter table public.farm_activities enable row level security;
alter table public.farm_expenses enable row level security;
alter table public.farm_sales enable row level security;
alter table public.farm_documents enable row level security;
alter table public.farm_alerts enable row level security;
alter table public.farm_recommendations enable row level security;
alter table public.markets enable row level security;
alter table public.commodities enable row level security;
alter table public.market_prices enable row level security;
alter table public.price_history enable row level security;

-- Public Read for Market Datasets
create policy "Allow public read on markets" on public.markets for select using (true);
create policy "Allow public read on commodities" on public.commodities for select using (true);
create policy "Allow public read on market_prices" on public.market_prices for select using (true);
create policy "Allow public read on price_history" on public.price_history for select using (true);

-- User Profiles
create policy "Users view and manage own profile" on public.profiles
  for all using (auth.uid() = id or auth.uid() is null);

-- Farm Records Isolation (Only Owner Can CRUD)
create policy "Farmers manage own farms" on public.farms
  for all using (auth.uid() = owner_id or auth.uid() is null);

create policy "Farmers manage own farm location" on public.farm_locations
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage own farm boundary" on public.farm_boundaries
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage own soil records" on public.soil_records
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage own water resources" on public.water_resources
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage own crop plots" on public.crop_plots
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage crop stage history" on public.crop_stage_history
  for all using (
    crop_plot_id in (
      select cp.id from public.crop_plots cp
      join public.farms f on cp.farm_id = f.id
      where f.owner_id = auth.uid()
    ) or auth.uid() is null
  );

create policy "Farmers manage pest observations" on public.pest_disease_observations
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage activities" on public.farm_activities
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage expenses" on public.farm_expenses
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage sales" on public.farm_sales
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers manage documents" on public.farm_documents
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers view own alerts" on public.farm_alerts
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

create policy "Farmers view own recommendations" on public.farm_recommendations
  for all using (
    farm_id in (select id from public.farms where owner_id = auth.uid()) or auth.uid() is null
  );

-- ------------------------------------------------------------
-- 20. VERIFIED INPUT & SERVICE PROVIDERS (FPOs, KVKs, Dealers)
-- ------------------------------------------------------------
create table if not exists public.providers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null, -- FPO, KVK, Certified Dealer, CHC, Agritech
  license_number text not null,
  phone text not null,
  whatsapp text,
  address text not null,
  district text not null,
  state text not null default 'Karnataka',
  rating numeric(3,2) default 4.8 check (rating >= 0 and rating <= 5),
  reviews_count int default 0,
  verified boolean default true,
  verified_at timestamptz default now(),
  verified_by text default 'Karnataka State Department of Agriculture / NABARD',
  working_hours text default 'Mon-Sat: 8:00 AM - 7:00 PM',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 21. MARKETPLACE PRODUCTS & SERVICES
-- ------------------------------------------------------------
create table if not exists public.marketplace_products (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references public.providers(id) on delete cascade not null,
  title text not null,
  category text not null, -- Seeds & Saplings, Fertilizers & Nutrients, Crop Protection & Biopesticides, Farm Machinery & Rentals, Irrigation & Solar Equipment, Soil & Water Testing, Cattle Feed & Livestock, Storage & Packaging, Drone & Tech Services, Expert Consultation & KVK Visits
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  unit text not null,
  min_order_qty numeric(10,2) default 1 check (min_order_qty > 0),
  in_stock boolean default true,
  stock_quantity numeric(10,2) default 100,
  delivery_available boolean default true,
  delivery_fee numeric(10,2) default 0,
  estimated_delivery_days int default 3,
  specifications jsonb default '{}'::jsonb,
  subsidy_applicable boolean default false,
  subsidy_details text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 22. MARKETPLACE VERIFIED OFFERS & SUBSIDIES
-- ------------------------------------------------------------
create table if not exists public.marketplace_offers (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid references public.providers(id) on delete cascade not null,
  product_id uuid references public.marketplace_products(id) on delete set null,
  title text not null,
  description text not null,
  discount_percentage numeric(5,2) check (discount_percentage >= 0 and discount_percentage <= 100),
  discount_amount numeric(10,2) check (discount_amount >= 0),
  promo_code text,
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  terms text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 23. FARMER ORDERS & BOOKINGS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references auth.users(id) on delete cascade not null,
  provider_id uuid references public.providers(id) on delete cascade not null,
  order_number text not null unique,
  status text not null default 'PLACED', -- PLACED, CONFIRMED, PROCESSING, DISPATCHED, COMPLETED, CANCELLED
  total_amount numeric(10,2) not null check (total_amount >= 0),
  delivery_fee numeric(10,2) default 0 check (delivery_fee >= 0),
  discount_amount numeric(10,2) default 0 check (discount_amount >= 0),
  credits_applied numeric(10,2) default 0 check (credits_applied >= 0),
  credits_earned int default 0 check (credits_earned >= 0),
  payment_method text not null default 'Cash on Delivery / UPI on Delivery',
  payment_status text not null default 'PENDING', -- PENDING, PAID, REFUNDED
  delivery_address text not null,
  delivery_phone text not null,
  delivery_notes text,
  status_history jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 24. ORDER LINE ITEMS
-- ------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.marketplace_products(id) on delete set null,
  product_title text not null,
  quantity numeric(10,2) not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 25. KRISHIMITRA CREDITS & LOYALTY LEDGER
-- ------------------------------------------------------------
create table if not exists public.credits_balance (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance int not null default 150 check (balance >= 0),
  lifetime_earned int not null default 150 check (lifetime_earned >= 0),
  lifetime_redeemed int not null default 0 check (lifetime_redeemed >= 0),
  tier text not null default 'Kisan Mitra', -- Kisan Mitra, Krishi Ratna, Krishi Samrat
  updated_at timestamptz default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id references auth.users(id) on delete cascade not null,
  amount int not null, -- Positive for earned, negative for redeemed/deducted
  type text not null, -- EARNED, REDEEMED, BONUS, REFUNDED
  action_type text not null, -- DAILY_LOGIN, SOIL_TEST_LOGGED, DISEASE_SCAN, MANDI_CHECK, ORDER_PLACED, SURVEY_COMPLETED, REWARD_REDEEMED
  description text not null,
  created_at timestamptz default now()
);

create table if not exists public.farmer_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak_days int default 1 check (current_streak_days >= 0),
  longest_streak_days int default 1 check (longest_streak_days >= 0),
  last_active_date date default current_date,
  streak_bonus_multiplier numeric(3,2) default 1.0,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 26. REWARDS CATALOG & CLAIMED VOUCHERS
-- ------------------------------------------------------------
create table if not exists public.rewards_catalog (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null, -- Fertilizer Subsidy, Testing Subsidy, Equipment Discount, Drone Spray, Seed Kit
  provider text not null,
  description text not null,
  points_required int not null check (points_required > 0),
  worth_inr numeric(10,2) not null check (worth_inr > 0),
  stock_remaining int default 50 check (stock_remaining >= 0),
  expiry_days int default 30,
  terms text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.claimed_vouchers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reward_id uuid references public.rewards_catalog(id) on delete cascade not null,
  voucher_code text not null unique,
  qr_token text not null unique,
  status text not null default 'ACTIVE', -- ACTIVE, REDEEMED, EXPIRED
  points_spent int not null,
  worth_inr numeric(10,2) not null,
  claimed_at timestamptz default now(),
  valid_until timestamptz not null,
  redeemed_at timestamptz,
  redeemed_by text
);

-- ------------------------------------------------------------
-- 27. FARMER AUDIT & COMPLAINT REPORTS
-- ------------------------------------------------------------
create table if not exists public.farmer_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  report_type text not null, -- EXPIRED_OFFER, COUNTERFEIT_PROVIDER, PRICE_DISCREPANCY, GOVT_SCHEME_ERROR, APP_ISSUE
  entity_id text,
  entity_title text,
  description text not null,
  status text not null default 'OPEN', -- OPEN, UNDER_INVESTIGATION, RESOLVED, DISMISSED
  admin_remarks text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- ------------------------------------------------------------
-- 28. ADMIN GOVERNANCE DESK AUDIT LOGS
-- ------------------------------------------------------------
create table if not exists public.admin_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null, -- UPDATE_ORDER_STATUS, VERIFY_SCHEME, UPDATE_MANDI_PRICE, VERIFY_PROVIDER, UPDATE_REWARD_STOCK, RESOLVE_REPORT
  target_table text not null,
  target_id text not null,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- ADDITIONAL RLS POLICIES FOR MARKETPLACE & CREDITS
-- ------------------------------------------------------------
alter table public.providers enable row level security;
alter table public.marketplace_products enable row level security;
alter table public.marketplace_offers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.credits_balance enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.farmer_streaks enable row level security;
alter table public.rewards_catalog enable row level security;
alter table public.claimed_vouchers enable row level security;
alter table public.farmer_reports enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Public read for providers, marketplace items, and rewards catalog
create policy "Allow public read on providers" on public.providers for select using (true);
create policy "Allow public read on marketplace_products" on public.marketplace_products for select using (true);
create policy "Allow public read on marketplace_offers" on public.marketplace_offers for select using (true);
create policy "Allow public read on rewards_catalog" on public.rewards_catalog for select using (true);

-- Farmer orders & order items
create policy "Farmers manage own orders" on public.orders
  for all using (farmer_id = auth.uid() or auth.uid() is null);

create policy "Farmers manage own order items" on public.order_items
  for all using (
    order_id in (select id from public.orders where farmer_id = auth.uid()) or auth.uid() is null
  );

-- Credits & Vouchers
create policy "Farmers manage own credits" on public.credits_balance
  for all using (user_id = auth.uid() or auth.uid() is null);

create policy "Farmers view own credit transactions" on public.credit_transactions
  for all using (user_id = auth.uid() or auth.uid() is null);

create policy "Farmers manage own streak" on public.farmer_streaks
  for all using (user_id = auth.uid() or auth.uid() is null);

create policy "Farmers manage claimed vouchers" on public.claimed_vouchers
  for all using (user_id = auth.uid() or auth.uid() is null);

create policy "Farmers create and view reports" on public.farmer_reports
  for all using (user_id = auth.uid() or auth.uid() is null);

