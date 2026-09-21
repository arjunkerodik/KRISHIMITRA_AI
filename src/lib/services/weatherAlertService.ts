// ============================================================
// KRISHIMITRA AI — SMART WEATHER ALERT ENGINE & ACTIVITY PLANNER
// Configurable Rules, Crop-Aware Advisories & Notification Pipeline
// ============================================================

import {
  WeatherAlert,
  WeatherAlertRule,
  FarmActivityType,
  FarmActivityCheck,
  NotificationPreference,
  AppNotification,
  NotificationDeliveryLog,
  WeatherCacheRecord,
} from "@/lib/types/weather";
import { Farm } from "@/lib/demo-data";

// In-Memory Storage (Realistic, Starts with clean zero-fake states for users)
const inMemoryAlertRules: WeatherAlertRule[] = [
  {
    id: "rule_heavy_rain_hr",
    rule_name: "Heavy Convective Rainfall Rate",
    rule_type: "HEAVY_RAIN",
    threshold: 15.0,
    unit: "mm/h",
    operator: ">=",
    severity: "WARNING",
    enabled: true,
    description: "Triggers when forecast rainfall rate exceeds 15mm in a single hour, alerting for soil erosion and furrow waterlogging.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_extreme_rain_day",
    rule_name: "Excessive 24-Hour Precipitation",
    rule_type: "HEAVY_RAIN",
    threshold: 45.0,
    unit: "mm/day",
    operator: ">=",
    severity: "SEVERE",
    enabled: true,
    description: "Triggers when 24h accumulated rainfall exceeds 45mm, requiring immediate ditch drainage.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_strong_wind",
    rule_name: "Foliar Spraying Wind Risk",
    rule_type: "STRONG_WIND",
    threshold: 22.0,
    unit: "km/h",
    operator: ">=",
    severity: "ADVISORY",
    enabled: true,
    description: "Triggers when wind gusts exceed 22 km/h, preventing pesticide spray drift and uneven application.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_extreme_heat",
    rule_name: "Daytime Thermal Stress Warning",
    rule_type: "EXTREME_HEAT",
    threshold: 35.5,
    unit: "°C",
    operator: ">=",
    severity: "WARNING",
    enabled: true,
    description: "Triggers when temperature exceeds 35.5°C, warning for flower abortion and soil moisture depletion.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_cold_wave",
    rule_name: "Low Night Temperature Advisory",
    rule_type: "COLD_WAVE",
    threshold: 10.0,
    unit: "°C",
    operator: "<=",
    severity: "ADVISORY",
    enabled: true,
    description: "Triggers when night minimum drops below 10°C, alerting for vegetable chilling stress.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_high_humidity",
    rule_name: "Fungal Spore Sporulation Alert",
    rule_type: "HIGH_HUMIDITY",
    threshold: 88.0,
    unit: "%",
    operator: ">=",
    severity: "ADVISORY",
    enabled: true,
    description: "Triggers when relative humidity exceeds 88%, warning of early/late blight spore propagation.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule_irrigation_hold",
    rule_name: "Smart Irrigation Postponement",
    rule_type: "IRRIGATION_HOLD",
    threshold: 8.0,
    unit: "mm/day",
    operator: ">=",
    severity: "INFO",
    enabled: true,
    description: "Advises farmers to hold scheduled irrigation cycles when meaningful precipitation is forecast.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let inMemoryActiveAlerts: WeatherAlert[] = [];
const inMemoryAlertHistory: WeatherAlert[] = [];
const inMemoryNotifications: AppNotification[] = [];
const inMemoryDeliveryLogs: NotificationDeliveryLog[] = [];
const inMemoryPreferences = new Map<string, NotificationPreference>();

// ------------------------------------------------------------
// 1. EVALUATE WEATHER CONDITIONS AGAINST ACTIVE RULES
// ------------------------------------------------------------
export function evaluateWeatherConditions(
  weatherRecord: WeatherCacheRecord,
  farm?: Farm,
  userId = "demo_farmer_01"
): WeatherAlert[] {
  const generatedAlerts: WeatherAlert[] = [];
  const current = weatherRecord.current_weather;
  const hourly = weatherRecord.hourly_forecast;
  const daily = weatherRecord.daily_forecast;
  const rainfall = weatherRecord.rainfall_intelligence;
  const now = new Date();

  // 1. Check Heavy Rain Rules
  const rainDayRule = inMemoryAlertRules.find((r) => r.rule_type === "HEAVY_RAIN" && r.enabled && r.unit === "mm/day");
  if (rainDayRule && rainfall.expected_rainfall_next_24h >= rainDayRule.threshold) {
    generatedAlerts.push({
      id: `alt_rain_24h_${farm?.id || "global"}_${Date.now()}`,
      user_id: userId,
      farm_id: farm?.id || null,
      farm_name: farm?.name || `${current.district} Plot`,
      category: "RAIN_ALERT",
      severity: rainDayRule.severity,
      title: `Heavy Rainfall Forecast (${Math.round(rainfall.expected_rainfall_next_24h)}mm in 24h)`,
      title_kn: `ಭಾರೀ ಮಳೆಯ ಮುನ್ಸೂಚನೆ (24 ಗಂಟೆಗಳಲ್ಲಿ ${Math.round(rainfall.expected_rainfall_next_24h)}ಮಿಮೀ)`,
      message: `Meteorological models forecast ${Math.round(rainfall.expected_rainfall_next_24h)}mm accumulated precipitation over the next 24 hours in ${current.district}. Ensure field drainage channels are clear to prevent waterlogging.`,
      message_kn: `${current.district} ಪ್ರದೇಶದಲ್ಲಿ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ${Math.round(rainfall.expected_rainfall_next_24h)}ಮಿಮೀ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.`,
      crop_affected: farm?.currentCrop || "All Field Crops",
      crop_stage: farm?.cropStage || "Active Growth",
      action_required: "Inspect furrow drainage; hold scheduled drip irrigation.",
      action_required_kn: "ಬಸಿಗಾಲುವೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ; ನಿಗದಿತ ಹನಿ ನೀರಾವರಿಯನ್ನು ತಡೆಹಿಡಿಯಿರಿ.",
      action_href: "/weather",
      source: current.source,
      source_url: current.source_url,
      affected_area: current.district,
      issued_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 24 * 3600000).toISOString(),
      is_active: true,
      status: "ACTIVE",
      created_at: now.toISOString(),
    });
  }

  // 2. Check Strong Wind (Spraying Hazard)
  const maxForecastWind = Math.max(current.wind_speed, ...(hourly.slice(0, 12).map((h) => h.wind_speed)));
  const windRule = inMemoryAlertRules.find((r) => r.rule_type === "STRONG_WIND" && r.enabled);
  if (windRule && maxForecastWind >= windRule.threshold) {
    generatedAlerts.push({
      id: `alt_wind_${farm?.id || "global"}_${Date.now()}`,
      user_id: userId,
      farm_id: farm?.id || null,
      farm_name: farm?.name || `${current.district} Plot`,
      category: "WIND_ALERT",
      severity: windRule.severity,
      title: `High Wind Speed Alert (${Math.round(maxForecastWind)} km/h)`,
      title_kn: `ತೀವ್ರ ಗಾಳಿಯ ವೇಗದ ಎಚ್ಚರಿಕೆ (${Math.round(maxForecastWind)} ಕಿಮೀ/ಗಂ)`,
      message: `Gusty winds of ${Math.round(maxForecastWind)} km/h detected in the forecast. Avoid pesticide, bio-stimulant, and herbicide foliar spraying to prevent spray drift and chemical loss.`,
      message_kn: `ಮುನ್ಸೂಚನೆಯಲ್ಲಿ ${Math.round(maxForecastWind)} ಕಿಮೀ/ಗಂ ವೇಗದ ಬಿರುಗಾಳಿ ಕಂಡುಬಂದಿದೆ. ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ.`,
      crop_affected: farm?.currentCrop || "Foliar Crops",
      crop_stage: farm?.cropStage,
      action_required: "Postpone spraying until wind drops below 15 km/h.",
      action_required_kn: "ಗಾಳಿಯ ವೇಗ 15 ಕಿಮೀ/ಗಂ ಗಿಂತ ಕಡಿಮೆಯಾಗುವವರೆಗೆ ಸಿಂಪಡಿಸಬೇಡಿ.",
      action_href: "/weather",
      source: current.source,
      source_url: current.source_url,
      affected_area: current.district,
      issued_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 12 * 3600000).toISOString(),
      is_active: true,
      status: "ACTIVE",
      created_at: now.toISOString(),
    });
  }

  // 3. Check Thermal Stress (Extreme Heat)
  const maxForecastTemp = Math.max(current.temperature, daily[0]?.temp_max ?? 0, daily[1]?.temp_max ?? 0);
  const heatRule = inMemoryAlertRules.find((r) => r.rule_type === "EXTREME_HEAT" && r.enabled);
  if (heatRule && maxForecastTemp >= heatRule.threshold) {
    generatedAlerts.push({
      id: `alt_heat_${farm?.id || "global"}_${Date.now()}`,
      user_id: userId,
      farm_id: farm?.id || null,
      farm_name: farm?.name || `${current.district} Plot`,
      category: "HEAT_ALERT",
      severity: heatRule.severity,
      title: `High Thermal Stress Advisory (Max ${Math.round(maxForecastTemp)}°C)`,
      title_kn: `ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಮತ್ತು ಉಷ್ಣತೆಯ ಎಚ್ಚರಿಕೆ (ಗರಿಷ್ಠ ${Math.round(maxForecastTemp)}°C)`,
      message: `Daytime temperatures are forecast to reach ${Math.round(maxForecastTemp)}°C. High heat increases evapotranspiration and flower abortion risk in ${farm?.currentCrop || "vegetable crops"}.`,
      message_kn: `ಹಗಲಿನ ತಾಪಮಾನ ${Math.round(maxForecastTemp)}°C ತಲುಪುವ ಸಾಧ್ಯತೆಯಿದೆ. ಹೂವು ಉದುರುವುದನ್ನು ತಡೆಯಲು ಬೆಳಿಗ್ಗೆಯೇ ಹನಿ ನೀರಾವರಿ ನೀಡಿ.`,
      crop_affected: farm?.currentCrop || "Vegetable & Horticulture Crops",
      crop_stage: farm?.cropStage || "Flowering / Fruit Setting",
      action_required: "Apply morning drip irrigation before 8:30 AM; check mulch coverage.",
      action_required_kn: "ಬೆಳಿಗ್ಗೆ 8:30 ರ ಮೊದಲು ನೀರುಣಿಸಿ; ಹೊದಿಕೆಯನ್ನು (ಮಲ್ಚಿಂಗ್) ಪರಿಶೀಲಿಸಿ.",
      action_href: "/weather",
      source: current.source,
      source_url: current.source_url,
      affected_area: current.district,
      issued_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 24 * 3600000).toISOString(),
      is_active: true,
      status: "ACTIVE",
      created_at: now.toISOString(),
    });
  }

  // 4. Check Smart Irrigation Advisory
  const irriRule = inMemoryAlertRules.find((r) => r.rule_type === "IRRIGATION_HOLD" && r.enabled);
  if (irriRule && rainfall.expected_rainfall_next_24h >= irriRule.threshold) {
    generatedAlerts.push({
      id: `alt_irri_${farm?.id || "global"}_${Date.now()}`,
      user_id: userId,
      farm_id: farm?.id || null,
      farm_name: farm?.name || `${current.district} Plot`,
      category: "IRRIGATION_ALERT",
      severity: "INFO",
      title: `Smart Irrigation Hold Advisory (${Math.round(rainfall.expected_rainfall_next_24h)}mm Rain Forecast)`,
      title_kn: `ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಮುಂದೂಡುವಿಕೆ ಸಲಹೆ (${Math.round(rainfall.expected_rainfall_next_24h)}ಮಿಮೀ ಮಳೆ ನಿರೀಕ್ಷೆ)`,
      message: `Rain of ${Math.round(rainfall.expected_rainfall_next_24h)}mm is forecast within 24 hours with ${rainfall.rain_probability_today}% probability. Review and pause scheduled irrigation cycles to save pump electricity and groundwater.`,
      message_kn: `ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ${Math.round(rainfall.expected_rainfall_next_24h)}ಮಿಮೀ ಮಳೆ ಸಾಧ್ಯತೆಯಿದೆ. ವಿದ್ಯುತ್ ಮತ್ತು ಅಂತರ್ಜಲ ಉಳಿಸಲು ನೀರುಣಿಸುವುದನ್ನು ಮುಂದೂಡಿ.`,
      crop_affected: farm?.currentCrop || "All Farm Plots",
      crop_stage: farm?.cropStage,
      action_required: "Hold drip irrigation valve timer for 24-36 hours.",
      action_required_kn: "24-36 ಗಂಟೆಗಳ ಕಾಲ ಹನಿ ನೀರಾವರಿ ಸ್ಥಗಿತಗೊಳಿಸಿ.",
      action_href: "/weather",
      source: current.source,
      source_url: current.source_url,
      affected_area: current.district,
      issued_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 24 * 3600000).toISOString(),
      is_active: true,
      status: "ACTIVE",
      created_at: now.toISOString(),
    });
  }

  // 5. Check High Humidity Disease Spore Risk
  const maxHumidity = Math.max(current.humidity, ...(hourly.slice(0, 12).map((h) => h.humidity)));
  const humidRule = inMemoryAlertRules.find((r) => r.rule_type === "HIGH_HUMIDITY" && r.enabled);
  if (humidRule && maxHumidity >= humidRule.threshold && current.temperature < 32) {
    generatedAlerts.push({
      id: `alt_humid_${farm?.id || "global"}_${Date.now()}`,
      user_id: userId,
      farm_id: farm?.id || null,
      farm_name: farm?.name || `${current.district} Plot`,
      category: "WEATHER_ALERT",
      severity: "ADVISORY",
      title: `High Humidity Disease Risk Alert (${maxHumidity}% RH)`,
      title_kn: `ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆಯಿಂದ ಶಿಲೀಂಧ್ರ ರೋಗದ ಎಚ್ಚರಿಕೆ (${maxHumidity}% ತೇವಾಂಶ)`,
      message: `Continuous microclimate relative humidity > 88% creates favorable conditions for fungal spore germination (Early/Late Blight in ${farm?.currentCrop || "crops"}). Scout lower foliage.`,
      message_kn: `88% ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆಯು ಶಿಲೀಂಧ್ರ ರೋಗಾಣುಗಳ ಹರಡುವಿಕೆಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ. ಕೆಳಭಾಗದ ಎಲೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.`,
      crop_affected: farm?.currentCrop || "Solanaceous / Leafy Crops",
      crop_stage: farm?.cropStage,
      action_required: "Scout for leaf spots; ensure air circulation in raised beds.",
      action_required_kn: "ಎಲೆಗಳ ಮೇಲೆ ಕಲೆಗಳಿವೆಯೇ ಪರಿಶೀಲಿಸಿ; ಗಾಳಿಯಾಡುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.",
      action_href: "/agricare",
      source: current.source,
      source_url: current.source_url,
      affected_area: current.district,
      issued_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 36 * 3600000).toISOString(),
      is_active: true,
      status: "ACTIVE",
      created_at: now.toISOString(),
    });
  }

  // Update in-memory active alerts store
  inMemoryActiveAlerts = generatedAlerts;

  // Sync to notifications if user preferences allow
  for (const alt of generatedAlerts) {
    syncAlertToNotification(alt, userId);
  }

  return generatedAlerts;
}

// ------------------------------------------------------------
// 2. SYNC ALERT TO IN-APP NOTIFICATIONS & DELIVERY LOGS
// ------------------------------------------------------------
export function syncAlertToNotification(alert: WeatherAlert, userId: string): AppNotification | null {
  const pref = getUserNotificationPreferences(userId);

  // Check category preferences
  if (alert.category === "RAIN_ALERT" && !pref.rain_alerts) return null;
  if (alert.category === "HEAT_ALERT" && !pref.extreme_temp_alerts) return null;
  if (alert.category === "WIND_ALERT" && !pref.wind_alerts) return null;
  if (alert.category === "IRRIGATION_ALERT" && !pref.irrigation_alerts) return null;

  // Check if notification already exists for this alert
  const existing = inMemoryNotifications.find((n) => n.alert_id === alert.id && n.user_id === userId);
  if (existing) return existing;

  const notif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    farm_id: alert.farm_id,
    alert_id: alert.id,
    type: alert.category,
    title: alert.title,
    title_kn: alert.title_kn,
    message: alert.message,
    message_kn: alert.message_kn,
    severity: alert.severity,
    is_read: false,
    created_at: new Date().toISOString(),
    expires_at: alert.expires_at,
    action_href: alert.action_href || "/weather",
  };

  inMemoryNotifications.unshift(notif);

  // Record Delivery Log
  inMemoryDeliveryLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    notification_id: notif.id,
    channel: "in_app",
    status: "DELIVERED",
    sent_at: new Date().toISOString(),
    delivered_at: new Date().toISOString(),
  });

  return notif;
}

// ------------------------------------------------------------
// 3. FARM ACTIVITY WEATHER PLANNER
// ------------------------------------------------------------
export function evaluateFarmActivity(
  activityType: FarmActivityType,
  plannedDate: string,
  plannedTime: string | undefined,
  weatherRecord: WeatherCacheRecord,
  farm?: Farm
): FarmActivityCheck {
  const current = weatherRecord.current_weather;
  const hourly = weatherRecord.hourly_forecast;
  const daily = weatherRecord.daily_forecast;

  // Find target day forecast or default to today
  const targetDay = daily.find((d) => d.date === plannedDate) || daily[0];
  const maxRain = targetDay?.precipitation_sum ?? current.precipitation;
  const rainProb = targetDay?.precipitation_probability_max ?? weatherRecord.rainfall_intelligence.rain_probability_today;
  const maxWind = targetDay?.wind_speed_max ?? current.wind_speed;
  const tempMax = targetDay?.temp_max ?? current.temperature;

  let status: "Suitable" | "Caution" | "Weather Risk" = "Suitable";
  let statusKn = "ಸೂಕ್ತವಾಗಿದೆ";
  let riskScore = 10;
  let reason = "Weather conditions are optimal for this field operation.";
  let reasonKn = "ಈ ಕೃಷಿ ಚಟುವಟಿಕೆಗೆ ಹವಾಮಾನವು ಸೂಕ್ತವಾಗಿದೆ.";
  let advisory = "Proceed as per standard agronomic schedule.";
  let advisoryKn = "ನಿಗದಿತ ವೇಳಾಪಟ್ಟಿಯಂತೆ ಮುಂದುವರಿಯಿರಿ.";

  switch (activityType) {
    case "spraying": {
      if (maxWind >= 22.0) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 85;
        reason = `Forecast wind speed (${Math.round(maxWind)} km/h) exceeds safe spraying threshold (20 km/h).`;
        reasonKn = `ನಿರೀಕ್ಷಿತ ಗಾಳಿಯ ವೇಗ (${Math.round(maxWind)} ಕಿಮೀ/ಗಂ) ಸುರಕ್ಷಿತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ.`;
        advisory = "Postpone foliar pesticide/fungicide spraying to prevent severe drift and chemical loss.";
        advisoryKn = "ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ; ಗಾಳಿಯಿಂದ ಔಷಧ ವ್ಯರ್ಥವಾಗುವುದನ್ನು ತಡೆಯಿರಿ.";
      } else if (rainProb >= 60 || maxRain >= 5.0) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 80;
        reason = `High rain probability (${rainProb}%, ~${maxRain}mm) will wash off sprayed chemicals.`;
        reasonKn = `ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ (${rainProb}%) ಹೆಚ್ಚಿದ್ದು, ಸಿಂಪಡಿಸಿದ ಔಷಧ ತೊಳೆದುಹೋಗುತ್ತದೆ.`;
        advisory = "Spray only when at least 4-6 hours of dry rain-free window is guaranteed.";
        advisoryKn = "ಕನಿಷ್ಠ 4-6 ಗಂಟೆಗಳ ಕಾಲ ಮಳೆಯಾಗದಿದ್ದರೆ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.";
      } else if (tempMax >= 35.0) {
        status = "Caution";
        statusKn = "ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ";
        riskScore = 45;
        reason = `High temperature (${tempMax}°C) causes rapid droplet evaporation and leaf scorch risk.`;
        reasonKn = `ಹೆಚ್ಚಿನ ತಾಪಮಾನದಿಂದಾಗಿ (${tempMax}°C) ದ್ರವ ಬೇಗನೆ ಆವಿಯಾಗುತ್ತದೆ.`;
        advisory = "Spray strictly during cool early morning (6:30 AM - 9:00 AM) or late evening.";
        advisoryKn = "ಬೆಳಗಿನ ಜಾವ (6:30 - 9:00) ಅಥವಾ ಸಂಜೆ ತಂಪಾದ ವೇಳೆಯಲ್ಲಿ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.";
      }
      break;
    }

    case "fertilizer": {
      if (maxRain >= 20.0) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 90;
        reason = `Heavy precipitation (${maxRain}mm) will cause severe nutrient runoff and nitrogen leaching.`;
        reasonKn = `ಭಾರೀ ಮಳೆಯಿಂದಾಗಿ (${maxRain}ಮಿಮೀ) ರಸಗೊಬ್ಬರ ಕೊಚ್ಚಿಹೋಗುತ್ತದೆ.`;
        advisory = "Delay soil broadcasting of urea/complex fertilizer until rain intensity diminishes.";
        advisoryKn = "ಭಾರೀ ಮಳೆ ನಿಲ್ಲುವವರೆಗೆ ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ಮುಂದೂಡಿ.";
      } else if (maxRain >= 5.0 && maxRain < 20.0) {
        status = "Suitable";
        statusKn = "ಸೂಕ್ತವಾಗಿದೆ";
        riskScore = 15;
        reason = `Light to moderate moisture (${maxRain}mm) helps dissolve granular fertilizer into root zone.`;
        reasonKn = `ಮಧ್ಯಮ ಮಳೆಯು (${maxRain}ಮಿಮೀ) ಗೊಬ್ಬರ ಕರಗಿ ಬೇರುಗಳಿಗೆ ತಲುಪಲು ಸಹಾಯಕವಾಗಿದೆ.`;
        advisory = "Apply top-dressing fertilizer just before light showers for optimal uptake.";
        advisoryKn = "ಲಘು ಮಳೆಗೆ ಮುನ್ನ ಮೇಲುಗೊಬ್ಬರ ಹಾಕುವುದು ಅತ್ಯಂತ ಉಪಯುಕ್ತ.";
      }
      break;
    }

    case "irrigation": {
      if (maxRain >= 10.0 || rainProb >= 70) {
        status = "Caution";
        statusKn = "ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ";
        riskScore = 65;
        reason = `Upcoming rain (${Math.round(maxRain)}mm, ${rainProb}% chance) will provide adequate soil moisture.`;
        reasonKn = `ಮುಂದಿನ ಮಳೆಯು (${Math.round(maxRain)}ಮಿಮೀ) ಮಣ್ಣಿಗೆ ಅಗತ್ಯ ತೇವಾಂಶವನ್ನು ಒದಗಿಸುತ್ತದೆ.`;
        advisory = "Hold planned drip irrigation cycle to conserve water and prevent soil saturation.";
        advisoryKn = "ನೀರು ಮತ್ತು ವಿದ್ಯುತ್ ಉಳಿಸಲು ನಿಗದಿತ ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.";
      }
      break;
    }

    case "harvesting": {
      if (maxRain >= 5.0 || rainProb >= 50) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 85;
        reason = `Rain during harvest causes crop wetting, mold infection, and post-harvest storage losses.`;
        reasonKn = `ಕೊಯ್ಲಿನ ಸಮಯದಲ್ಲಿ ಮಳೆಯಾದರೆ ಬೆಳೆ ಕೊಳೆತು ಹಾಳಾಗುವ ಅಪಾಯವಿದೆ.`;
        advisory = "Wait for a clear dry spell before harvesting mature tomato, maize, or pulses.";
        advisoryKn = "ಮಳೆ ಸಂಪೂರ್ಣವಾಗಿ ನಿಂತು ಒಣ ಹವೆ ಇರುವಾಗ ಮಾತ್ರ ಕೊಯ್ಲು ಮಾಡಿ.";
      }
      break;
    }

    case "drying": {
      if (maxRain > 0.5 || rainProb >= 30 || current.humidity >= 75) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 90;
        reason = `Damp air / rain probability hinders open-yard grain or seed drying.`;
        reasonKn = `ತೇವಾಂಶ ಮತ್ತು ಮಳೆಯ ಸಾಧ್ಯತೆಯಿಂದಾಗಿ ಧಾನ್ಯ ಒಣಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.`;
        advisory = "Keep harvested produce under waterproof tarp cover. Avoid open-yard spreading.";
        advisoryKn = "ಧಾನ್ಯಗಳನ್ನು ಟಾರ್ಪಲಿನ್ ಹೊದಿಕೆಯಡಿ ಸುರಕ್ಷಿತವಾಗಿಡಿ.";
      }
      break;
    }

    case "sowing": {
      if (maxRain >= 35.0) {
        status = "Weather Risk";
        statusKn = "ಹವಾಮಾನದ ಅಪಾಯವಿದೆ";
        riskScore = 80;
        reason = `Torrential rainfall will wash away sown seeds and form a hard soil surface crust.`;
        reasonKn = `ಭಾರೀ ಮಳೆಯು ಬಿತ್ತಿದ ಬೀಜಗಳನ್ನು ಕೊಚ್ಚಿ ಹಾಕಬಹುದು ಅಥವಾ ಮಣ್ಣು ಗಟ್ಟಿಯಾಗಬಹುದು.`;
        advisory = "Wait for soil moisture to reach optimal field capacity before drilling seeds.";
        advisoryKn = "ಮಣ್ಣು ಹದವಾಗಿರುವಾಗ (ಆರ್ದ್ರತೆ ಸರಿಯಾದಾಗ) ಮಾತ್ರ ಬಿತ್ತನೆ ಮಾಡಿ.";
      } else if (tempMax >= 38.0) {
        status = "Caution";
        statusKn = "ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ";
        riskScore = 50;
        reason = `High soil surface temperature can desiccate tender emerging plumules.`;
        reasonKn = `ಹೆಚ್ಚಿನ ಶಾಖದಿಂದ ಬೀಜದ ಮೊಳಕೆ ಒಣಗಿಹೋಗುವ ಅಪಾಯವಿದೆ.`;
        advisory = "Sow in the late afternoon and provide light starter irrigation.";
        advisoryKn = "ಸಂಜೆ ವೇಳೆ ಬಿತ್ತನೆ ಮಾಡಿ ಲಘು ನೀರುಣಿಸಿ.";
      }
      break;
    }

    default:
      break;
  }

  const activityLabels: Record<FarmActivityType, { en: string; kn: string }> = {
    spraying: { en: "Foliar Spraying", kn: "ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ" },
    fertilizer: { en: "Fertilizer Application", kn: "ರಸಗೊಬ್ಬರ ಬಳಕೆ" },
    irrigation: { en: "Irrigation Scheduling", kn: "ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ" },
    harvesting: { en: "Crop Harvesting", kn: "ಬೆಳೆ ಕೊಯ್ಲು" },
    drying: { en: "Open Sun Drying", kn: "ಧಾನ್ಯ ಒಣಗಿಸುವಿಕೆ" },
    sowing: { en: "Seed Sowing", kn: "ಬೀಜ ಬಿತ್ತನೆ" },
    land_preparation: { en: "Land Preparation / Ploughing", kn: "ಭೂಮಿ ಸಿದ್ಧತೆ / ಉಳುಮೆ" },
  };

  return {
    activity_type: activityType,
    activity_label: activityLabels[activityType]?.en || activityType,
    activity_label_kn: activityLabels[activityType]?.kn,
    planned_date: plannedDate,
    planned_time: plannedTime,
    status,
    status_kn: statusKn,
    risk_score: riskScore,
    reason,
    reason_kn: reasonKn,
    advisory,
    advisory_kn: advisoryKn,
    weather_condition: targetDay.condition,
    rain_probability: rainProb,
    expected_precipitation_mm: maxRain,
    wind_speed_kmh: maxWind,
    temperature_c: tempMax,
    source: current.source,
    forecast_timestamp: new Date().toISOString(),
  };
}

// ------------------------------------------------------------
// 4. NOTIFICATION & PREFERENCE HANDLERS
// ------------------------------------------------------------
export function getUserNotificationPreferences(userId: string): NotificationPreference {
  const existing = inMemoryPreferences.get(userId);
  if (existing) return existing;

  const defaultPref: NotificationPreference = {
    user_id: userId,
    weather_alerts: true,
    rain_alerts: true,
    extreme_temp_alerts: true,
    wind_alerts: true,
    irrigation_alerts: true,
    official_warnings: true,
    farm_activity_alerts: true,
    in_app_enabled: true,
    push_enabled: false,
    sms_enabled: true,
    whatsapp_enabled: true,
    quiet_hours_enabled: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "06:00",
    updated_at: new Date().toISOString(),
  };

  inMemoryPreferences.set(userId, defaultPref);
  return defaultPref;
}

export function updateUserNotificationPreferences(
  userId: string,
  updates: Partial<NotificationPreference>
): NotificationPreference {
  const current = getUserNotificationPreferences(userId);
  const updated: NotificationPreference = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  inMemoryPreferences.set(userId, updated);
  return updated;
}

export function getFarmerNotificationsList(userId: string): AppNotification[] {
  return inMemoryNotifications.filter((n) => n.user_id === userId);
}

export function markNotificationRead(userId: string, notifId: string): boolean {
  const notif = inMemoryNotifications.find((n) => n.id === notifId && n.user_id === userId);
  if (!notif) return false;
  notif.is_read = true;
  notif.read_at = new Date().toISOString();
  return true;
}

export function markAllNotificationsRead(userId: string): number {
  let count = 0;
  for (const n of inMemoryNotifications) {
    if (n.user_id === userId && !n.is_read) {
      n.is_read = true;
      n.read_at = new Date().toISOString();
      count++;
    }
  }
  return count;
}

// ------------------------------------------------------------
// 5. ALERT RULES CONFIGURATION (ADMIN)
// ------------------------------------------------------------
export function getAlertRulesList(): WeatherAlertRule[] {
  return inMemoryAlertRules;
}

export function updateAlertRule(
  ruleId: string,
  updates: Partial<WeatherAlertRule>
): WeatherAlertRule | null {
  const rule = inMemoryAlertRules.find((r) => r.id === ruleId);
  if (!rule) return null;
  Object.assign(rule, updates, { updated_at: new Date().toISOString() });
  return rule;
}

export function getDeliveryLogsList(): NotificationDeliveryLog[] {
  return inMemoryDeliveryLogs.slice(0, 50);
}
