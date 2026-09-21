-- ============================================================
-- KRISHIMITRA AI — WEATHER & SMART ALERTS SUPABASE SCHEMA
-- Hyperlocal Real Meteorological Data, Smart Alert Engine & Delivery Logs
-- ============================================================

-- 1. WEATHER CACHE TABLE
CREATE TABLE IF NOT EXISTS weather_cache (
    location_key VARCHAR(100) PRIMARY KEY, -- e.g. "13.1367_78.1291"
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    current_weather JSONB NOT NULL,
    hourly_forecast JSONB NOT NULL,
    daily_forecast JSONB NOT NULL,
    rainfall_intelligence JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    provider VARCHAR(100) NOT NULL DEFAULT 'Open-Meteo (WMO / ECMWF / GFS)'
);

CREATE INDEX IF NOT EXISTS idx_weather_cache_expires ON weather_cache (expires_at);

-- 2. WEATHER ALERT RULES (CONFIGURABLE BY ADMIN)
CREATE TABLE IF NOT EXISTS weather_alert_rules (
    id VARCHAR(100) PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(100) NOT NULL,
    threshold NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    operator VARCHAR(10) NOT NULL DEFAULT '>=',
    severity VARCHAR(50) NOT NULL DEFAULT 'WARNING',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    applicable_crop_types TEXT[] DEFAULT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Default Configurable Agricultural Rules
INSERT INTO weather_alert_rules (id, rule_name, rule_type, threshold, unit, operator, severity, enabled, description)
VALUES 
    ('rule_heavy_rain_hr', 'Heavy Convective Rainfall Rate', 'HEAVY_RAIN', 15.0, 'mm/h', '>=', 'WARNING', TRUE, 'Triggers when forecast rainfall rate exceeds 15mm in a single hour, alerting for soil erosion and furrow waterlogging.'),
    ('rule_extreme_rain_day', 'Excessive 24-Hour Precipitation', 'HEAVY_RAIN', 45.0, 'mm/day', '>=', 'SEVERE', TRUE, 'Triggers when 24h accumulated rainfall exceeds 45mm, requiring immediate ditch drainage.'),
    ('rule_strong_wind', 'Foliar Spraying Wind Risk', 'STRONG_WIND', 25.0, 'km/h', '>=', 'ADVISORY', TRUE, 'Triggers when wind gusts exceed 25 km/h, preventing pesticide spray drift.'),
    ('rule_extreme_heat', 'Daytime Thermal Stress Warning', 'EXTREME_HEAT', 36.0, '°C', '>=', 'WARNING', TRUE, 'Triggers when temperature exceeds 36°C, warning for flower abortion and soil moisture depletion.'),
    ('rule_cold_wave', 'Low Night Temperature Advisory', 'COLD_WAVE', 10.0, '°C', '<=', 'ADVISORY', TRUE, 'Triggers when night minimum drops below 10°C, alerting for vegetable chilling stress.'),
    ('rule_high_humidity', 'Fungal Spore Sporulation Alert', 'HIGH_HUMIDITY', 88.0, '%', '>=', 'ADVISORY', TRUE, 'Triggers when relative humidity exceeds 88%, warning of early/late blight spore propagation.'),
    ('rule_irrigation_hold', 'Smart Irrigation Postponement', 'IRRIGATION_HOLD', 8.0, 'mm/day', '>=', 'INFO', TRUE, 'Advises farmers to hold scheduled irrigation cycles when meaningful precipitation is imminent.')
ON CONFLICT (id) DO NOTHING;

-- 3. WEATHER ALERTS TABLE (FARM-SPECIFIC & ACTIVE)
CREATE TABLE IF NOT EXISTS weather_alerts (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    farm_id VARCHAR(100),
    farm_name VARCHAR(255),
    alert_id VARCHAR(100),
    provider_alert_id VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_kn VARCHAR(255),
    message TEXT NOT NULL,
    message_kn TEXT,
    crop_affected VARCHAR(100),
    crop_stage VARCHAR(100),
    action_required TEXT,
    action_required_kn TEXT,
    action_href VARCHAR(255),
    source VARCHAR(150) NOT NULL DEFAULT 'Open-Meteo & Agronomic Engine',
    source_url VARCHAR(255),
    affected_area VARCHAR(255),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_alerts_user ON weather_alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_farm ON weather_alerts (farm_id);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_active ON weather_alerts (is_active, expires_at);

-- 4. WEATHER ALERT HISTORY TABLE
CREATE TABLE IF NOT EXISTS weather_alert_history (
    id VARCHAR(100) PRIMARY KEY,
    alert_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    farm_id VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(150) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_history_user ON weather_alert_history (user_id);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    farm_id VARCHAR(100),
    alert_id VARCHAR(100),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_kn VARCHAR(255),
    message TEXT NOT NULL,
    message_kn TEXT,
    severity VARCHAR(50) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    action_href VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, is_read);

-- 6. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id VARCHAR(100) PRIMARY KEY,
    weather_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    rain_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    extreme_temp_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    wind_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    irrigation_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    official_warnings BOOLEAN NOT NULL DEFAULT TRUE,
    farm_activity_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    quiet_hours_start VARCHAR(10) NOT NULL DEFAULT '22:00',
    quiet_hours_end VARCHAR(10) NOT NULL DEFAULT '06:00',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. NOTIFICATION DELIVERY LOGS TABLE
CREATE TABLE IF NOT EXISTS notification_delivery_logs (
    id VARCHAR(100) PRIMARY KEY,
    notification_id VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SENT',
    provider_response TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    failure_reason TEXT
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Farmer can only access their own alerts
CREATE POLICY "farmer_read_own_alerts"
    ON weather_alerts FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = 'demo_farmer_01');

-- Farmer can only access their own notifications
CREATE POLICY "farmer_read_own_notifications"
    ON notifications FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = 'demo_farmer_01');

CREATE POLICY "farmer_update_own_notifications"
    ON notifications FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = 'demo_farmer_01');

-- Farmer can manage own preferences
CREATE POLICY "farmer_manage_own_preferences"
    ON notification_preferences FOR ALL
    USING (auth.uid()::text = user_id OR user_id = 'demo_farmer_01');
