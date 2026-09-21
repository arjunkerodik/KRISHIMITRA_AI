// ============================================================
// KRISHIMITRA AI — WEATHER & SMART ALERTS TYPES & INTERFACES
// Hyperlocal Observed Conditions, Forecasts, Decision Support & Alerts
// ============================================================

export type WeatherConditionCode =
  | "clear"
  | "mainly_clear"
  | "partly_cloudy"
  | "overcast"
  | "fog"
  | "depositing_rime_fog"
  | "light_drizzle"
  | "moderate_drizzle"
  | "dense_drizzle"
  | "slight_rain"
  | "moderate_rain"
  | "heavy_rain"
  | "thunderstorm"
  | "thunderstorm_hail"
  | "unknown";

export interface CurrentWeather {
  temperature: number; // °C
  apparent_temperature: number; // °C ("feels like")
  humidity: number; // %
  wind_speed: number; // km/h
  wind_direction: number; // degrees
  wind_direction_cardinal: string; // N, NE, E, SE, S, SW, W, NW
  precipitation: number; // mm in current hour
  rain: number; // mm
  surface_pressure?: number; // hPa
  cloud_cover?: number; // %
  visibility_km?: number; // km
  uv_index?: number; // 0-12
  weather_code: number;
  condition: string;
  condition_kn?: string;
  is_day: boolean;
  source: string; // e.g., "Open-Meteo (WMO / ECMWF / GFS)"
  source_url?: string;
  last_updated: string; // ISO timestamp
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  is_cached: boolean;
}

export interface HourlyForecastItem {
  time: string; // ISO string or format "10:00 AM"
  timestamp: string;
  temperature: number; // °C
  apparent_temperature: number; // °C
  humidity: number; // %
  precipitation_probability: number; // %
  precipitation: number; // mm
  rain: number; // mm
  wind_speed: number; // km/h
  wind_direction: number; // degrees
  weather_code: number;
  condition: string;
  condition_kn?: string;
  uv_index?: number;
  is_day: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  day_name: string; // "Today", "Mon", "Tue", etc.
  day_name_kn?: string;
  temp_max: number; // °C
  temp_min: number; // °C
  apparent_temp_max?: number;
  apparent_temp_min?: number;
  precipitation_sum: number; // mm
  precipitation_hours: number;
  precipitation_probability_max: number; // %
  wind_speed_max: number; // km/h
  wind_direction_dominant: number;
  weather_code: number;
  condition: string;
  condition_kn?: string;
  uv_index_max?: number;
  sunrise?: string;
  sunset?: string;
}

export interface RainfallIntelligence {
  expected_rainfall_next_24h: number; // mm
  expected_rainfall_next_7d: number; // mm
  rain_probability_today: number; // %
  rain_probability_tomorrow: number; // %
  recent_rainfall_24h?: number; // mm
  rainfall_trend: "increasing" | "decreasing" | "stable" | "none";
  soil_moisture_estimate_status?: "dry" | "optimal" | "saturated" | "waterlogged";
  irrigation_advisory: string;
  irrigation_advisory_kn?: string;
}

export type AlertSeverity = "INFO" | "ADVISORY" | "WARNING" | "SEVERE";

export type AlertCategory =
  | "WEATHER_ALERT"
  | "RAIN_ALERT"
  | "HEAT_ALERT"
  | "WIND_ALERT"
  | "COLD_ALERT"
  | "IRRIGATION_ALERT"
  | "FARM_ACTIVITY_ALERT"
  | "OFFICIAL_WARNING"
  | "SYSTEM_NOTIFICATION";

export interface WeatherAlert {
  id: string;
  user_id?: string;
  farm_id?: string | null;
  farm_name?: string | null;
  alert_id?: string;
  provider_alert_id?: string | null;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  title_kn?: string;
  message: string;
  message_kn?: string;
  crop_affected?: string | null;
  crop_stage?: string | null;
  action_required?: string | null;
  action_required_kn?: string | null;
  action_href?: string | null;
  source: string;
  source_url?: string;
  affected_area?: string | null;
  issued_at: string; // ISO
  expires_at: string; // ISO
  is_active: boolean;
  status: "ACTIVE" | "EXPIRED" | "RESOLVED";
  created_at: string;
}

export interface WeatherAlertRule {
  id: string;
  rule_name: string;
  rule_type: "HEAVY_RAIN" | "STRONG_WIND" | "EXTREME_HEAT" | "COLD_WAVE" | "HIGH_HUMIDITY" | "IRRIGATION_HOLD" | "OFFICIAL_WARNING";
  threshold: number;
  unit: string; // "mm/h", "mm/day", "km/h", "°C", "%"
  operator: ">" | ">=" | "<" | "<=" | "==";
  severity: AlertSeverity;
  enabled: boolean;
  applicable_crop_types?: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export type FarmActivityType =
  | "sowing"
  | "irrigation"
  | "fertilizer"
  | "spraying"
  | "harvesting"
  | "drying"
  | "land_preparation";

export interface FarmActivityCheck {
  activity_type: FarmActivityType;
  activity_label: string;
  activity_label_kn?: string;
  planned_date: string;
  planned_time?: string;
  status: "Suitable" | "Caution" | "Weather Risk";
  status_kn?: string;
  risk_score: number; // 0-100
  reason: string;
  reason_kn?: string;
  advisory: string;
  advisory_kn?: string;
  weather_condition: string;
  rain_probability: number;
  expected_precipitation_mm: number;
  wind_speed_kmh: number;
  temperature_c: number;
  source: string;
  forecast_timestamp: string;
}

export interface NotificationPreference {
  user_id: string;
  weather_alerts: boolean;
  rain_alerts: boolean;
  extreme_temp_alerts: boolean;
  wind_alerts: boolean;
  irrigation_alerts: boolean;
  official_warnings: boolean;
  farm_activity_alerts: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string; // "22:00"
  quiet_hours_end: string; // "06:00"
  updated_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  farm_id?: string | null;
  alert_id?: string | null;
  type: AlertCategory;
  title: string;
  title_kn?: string;
  message: string;
  message_kn?: string;
  severity: AlertSeverity;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
  expires_at?: string | null;
  action_href?: string | null;
}

export interface NotificationDeliveryLog {
  id: string;
  notification_id: string;
  channel: "in_app" | "push" | "sms" | "whatsapp";
  status: "QUEUED" | "SENT" | "DELIVERED" | "FAILED";
  provider_response?: string | null;
  sent_at: string;
  delivered_at?: string | null;
  failure_reason?: string | null;
}

export interface WeatherCacheRecord {
  location_key: string; // "lat_lng" e.g. "13.1367_78.1291"
  latitude: number;
  longitude: number;
  district: string;
  state: string;
  current_weather: CurrentWeather;
  hourly_forecast: HourlyForecastItem[];
  daily_forecast: DailyForecastItem[];
  rainfall_intelligence: RainfallIntelligence;
  fetched_at: string;
  expires_at: string;
  provider: string;
}

export interface AdminWeatherStats {
  api_status: "HEALTHY" | "DEGRADED" | "DOWN";
  provider: string;
  last_successful_fetch: string | null;
  last_failed_fetch: string | null;
  api_response_time_ms: number;
  cache_hits: number;
  cache_misses: number;
  cached_locations_count: number;
  total_active_alerts: number;
  total_expired_alerts: number;
  total_notifications_sent: number;
  failed_notifications_count: number;
  alert_rules: WeatherAlertRule[];
  delivery_logs: NotificationDeliveryLog[];
}
