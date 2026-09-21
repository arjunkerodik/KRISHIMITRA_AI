-- =====================================================================
-- KRISHIMITRA AI — SUPABASE / POSTGRESQL SEED DATA
-- District: Kolar, Karnataka (Zone 5 Eastern Dry Zone)
-- =====================================================================

-- 1. Insert Farmer Profile
INSERT INTO public.farmers (
    id, full_name, phone_number, email, language_preference, aadhaar_hash,
    village, taluk, district, state, pincode, total_land_acres, kyc_status
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Ramesh Gowda',
    '+919845012345',
    'ramesh.gowda@krishimitra.demo',
    'kn',
    '$2a$12$e8qW7V1nJc5f...',
    'Vemagal / Narasapura',
    'Kolar',
    'Kolar',
    'Karnataka',
    '563133',
    4.0,
    'verified'
) ON CONFLICT (phone_number) DO NOTHING;

-- 2. Insert Farm Plots
INSERT INTO public.farms (
    id, farmer_id, farm_name, village, taluk, district, state,
    total_area_acres, primary_soil_type, primary_water_source,
    irrigation_system, center_latitude, center_longitude
) VALUES (
    'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Sri Lakshmi Farm - Plot 1',
    'Narasapura',
    'Kolar',
    'Kolar',
    'Karnataka',
    2.5,
    'Red Sandy Loam',
    'Borewell (350 ft - 120 LPM)',
    'Drip Irrigation',
    13.1367,
    78.1348
),
(
    'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Cauvery Greens - Plot 2',
    'Narasapura',
    'Kolar',
    'Kolar',
    'Karnataka',
    1.5,
    'Clay Loam',
    'Farm Pond + Canal',
    'Micro-Sprinkler',
    13.1390,
    78.1370
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Standing Crops
INSERT INTO public.farm_plots (
    id, farm_id, plot_label, area_acres, current_crop, crop_variety,
    sowing_date, expected_harvest_date, current_stage, health_score, risk_score
) VALUES (
    'p1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01',
    'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    'Plot 1 - North Block',
    2.5,
    'Tomato',
    'Arka Rakshak (F1 Hybrid)',
    '2024-08-08',
    '2024-10-22',
    'Flowering & Fruit Set (Day 33)',
    88,
    28
),
(
    'p2eebc99-9c0b-4ef8-bb6d-6bb9bd380c02',
    'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380b02',
    'Plot 2 - South Block',
    1.5,
    'Groundnut',
    'TMV-2',
    '2024-08-25',
    '2024-12-10',
    'Vegetative / Pegging (Day 16)',
    92,
    22
) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Soil Test Report
INSERT INTO public.soil_tests (
    id, farm_id, test_date, testing_agency, lab_name,
    nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha,
    ph_level, organic_carbon_percent, electrical_conductivity,
    overall_health_score, stoichiometric_advisory
) VALUES (
    's1eebc99-9c0b-4ef8-bb6d-6bb9bd380d01',
    'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
    '2024-07-14',
    'ICAR-KVK Kolar',
    'District Soil Testing Laboratory Tamaka',
    210.0,
    18.0,
    290.0,
    6.8,
    0.52,
    0.42,
    78,
    'Apply 3 split doses of Neem Coated Urea (70 kg total) and 35 kg DAP as basal.'
) ON CONFLICT (id) DO NOTHING;

-- 5. Insert APMC Mandi Prices
INSERT INTO public.mandi_prices (
    id, mandi_name, district, state, commodity_name, variety_name,
    min_price_per_qtl, max_price_per_qtl, modal_price_per_qtl,
    arrivals_tonnes, distance_km_from_cluster, transport_cost_per_qtl, net_realization_per_qtl
) VALUES 
('m1', 'Yeshwanthpur APMC', 'Bengaluru Urban', 'Karnataka', 'Tomato', 'Hybrid', 2100, 2600, 2350, 1250, 68, 146, 2054),
('m2', 'Kolar APMC Market', 'Kolar', 'Karnataka', 'Tomato', 'Hybrid', 1950, 2450, 2200, 840, 14, 46, 2004),
('m3', 'Madanapalle APMC', 'Annamayya', 'Andhra Pradesh', 'Tomato', 'Hybrid', 2250, 2750, 2500, 2100, 84, 175, 2175),
('m4', 'Chintamani APMC', 'Chikkaballapur', 'Karnataka', 'Tomato', 'Hybrid', 1800, 2250, 2050, 450, 36, 87, 1813)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Government Schemes
INSERT INTO public.schemes (
    id, scheme_code, scheme_name, ministry_name, category,
    max_subsidy_amount, subsidy_percentage, eligibility_summary
) VALUES 
('sc-1', 'PM-KISAN', 'PM-KISAN Samman Nidhi', 'Ministry of Agriculture & Farmers Welfare', 'Direct Benefit Transfer', 6000, 100, 'Landholding small and marginal farmers with Aadhaar-linked bank accounts.'),
('sc-2', 'PMKSY-PDMC', 'PMKSY - Per Drop More Crop (Drip)', 'DAC&FW', 'Irrigation Infrastructure', 48500, 90, 'Farmers with functional water source seeking drip irrigation installation.'),
('sc-3', 'PM-KUSUM', 'PM-KUSUM Component B (Solar Agri Pump)', 'MNRE', 'Renewable Energy', 185000, 60, 'Grid-deficient farming plots requiring 5-7.5 HP standalone solar water pumps.')
ON CONFLICT (id) DO NOTHING;
