// ============================================================
// KRISHIMITRA AI — WEATHER DATA SERVICE
// Live Meteorological Data Engine with Caching & Rate Limiting
// ============================================================

import {
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  RainfallIntelligence,
  WeatherCacheRecord,
  AdminWeatherStats,
} from "@/lib/types/weather";

// In-Memory Cache Store (Fast Redis-like in-process TTL cache)
const memoryCache = new Map<string, WeatherCacheRecord>();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes cache TTL

// Admin & Telemetry Stats
let totalCacheHits = 0;
let totalCacheMisses = 0;
let lastSuccessfulFetch: string | null = null;
let lastFailedFetch: string | null = null;
let lastApiResponseTimeMs = 0;
let lastApiStatus: "HEALTHY" | "DEGRADED" | "DOWN" = "HEALTHY";

// ------------------------------------------------------------
// 1. WMO WEATHER CODE MAPPINGS (ENGLISH & KANNADA)
// ------------------------------------------------------------
export function interpretWmoCode(code: number): { condition: string; condition_kn: string; icon: string } {
  switch (code) {
    case 0:
      return { condition: "Clear Sky", condition_kn: "ಸ್ವಚ್ಛ ಆಕಾಶ", icon: "Sun" };
    case 1:
      return { condition: "Mainly Clear", condition_kn: "ಹೆಚ್ಚಾಗಿ ಸ್ಪಷ್ಟ", icon: "SunDim" };
    case 2:
      return { condition: "Partly Cloudy", condition_kn: "ಭಾಗಶಃ ಮೋಡ ಕವಿದ", icon: "CloudSun" };
    case 3:
      return { condition: "Overcast", condition_kn: "ಮೋಡ ಕವಿದ ವಾತಾವರಣ", icon: "Cloud" };
    case 45:
    case 48:
      return { condition: "Fog & Mist", condition_kn: "ಮಂಜು ಮುಸುಕಿದ ವಾತಾವರಣ", icon: "CloudFog" };
    case 51:
      return { condition: "Light Drizzle", condition_kn: "ಲಘು ತುಂತುರು ಮಳೆ", icon: "CloudDrizzle" };
    case 53:
      return { condition: "Moderate Drizzle", condition_kn: "ಮಧ್ಯಮ ತುಂತುರು ಮಳೆ", icon: "CloudDrizzle" };
    case 55:
      return { condition: "Dense Drizzle", condition_kn: "ದಟ್ಟ ತುಂತುರು ಮಳೆ", icon: "CloudDrizzle" };
    case 61:
      return { condition: "Slight Rain", condition_kn: "ಲಘು ಮಳೆ", icon: "CloudRain" };
    case 63:
      return { condition: "Moderate Rain", condition_kn: "ಮಧ್ಯಮ ಮಳೆ", icon: "CloudRain" };
    case 65:
      return { condition: "Heavy Rain", condition_kn: "ಭಾರೀ ಮಳೆ", icon: "CloudRain" };
    case 71:
    case 73:
    case 75:
      return { condition: "Snow / Frost", condition_kn: "ಹಿಮಪಾತ / ಮಂಜುಗಡ್ಡೆ", icon: "Snowflake" };
    case 80:
      return { condition: "Slight Rain Showers", condition_kn: "ಲಘು ಮಳೆ ಸುರಿತ", icon: "CloudRain" };
    case 81:
      return { condition: "Moderate Showers", condition_kn: "ಮಧ್ಯಮ ಮಳೆ ಸುರಿತ", icon: "CloudRain" };
    case 82:
      return { condition: "Violent Rain Showers", condition_kn: "ತೀವ್ರ ಮಳೆ ಸುರಿತ", icon: "CloudLightning" };
    case 95:
      return { condition: "Thunderstorm", condition_kn: "ಗುಡುಗು ಸಹಿತ ಮಳೆ", icon: "CloudLightning" };
    case 96:
    case 99:
      return { condition: "Severe Thunderstorm with Hail", condition_kn: "ಆಲಿಕಲ್ಲು ಸಹಿತ ತೀವ್ರ ಗುಡುಗು ಮಳೆ", icon: "CloudLightning" };
    default:
      return { condition: "Scattered Clouds", condition_kn: "ಚದುರಿದ ಮೋಡಗಳು", icon: "Cloud" };
  }
}

export function degreesToCardinal(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index % 16];
}

// ------------------------------------------------------------
// 2. REVERSE GEOCODING (INDIA DISTRICT RESOLUTION)
// ------------------------------------------------------------
export async function getDistrictFromCoords(lat: number, lng: number): Promise<{ district: string; state: string; village: string }> {
  // Check known regional boundaries (Karnataka & South India focus)
  if (lat >= 12.8 && lat <= 13.6 && lng >= 77.8 && lng <= 78.6) {
    return { district: "Kolar", state: "Karnataka", village: "Vemagal" };
  }
  if (lat >= 13.2 && lat <= 13.8 && lng >= 77.5 && lng <= 78.2) {
    return { district: "Chikkaballapur", state: "Karnataka", village: "Sidlaghatta" };
  }
  if (lat >= 12.7 && lat <= 13.2 && lng >= 77.3 && lng <= 77.9) {
    return { district: "Bengaluru Rural", state: "Karnataka", village: "Hoskote" };
  }
  if (lat >= 12.3 && lat <= 13.0 && lng >= 76.8 && lng <= 77.4) {
    return { district: "Ramanagara", state: "Karnataka", village: "Magadi" };
  }
  if (lat >= 13.0 && lat <= 13.8 && lng >= 76.5 && lng <= 77.4) {
    return { district: "Tumakuru", state: "Karnataka", village: "Kunigal" };
  }

  // Fallback to coordinates
  return {
    district: `District (${lat.toFixed(2)}°N)`,
    state: "Karnataka",
    village: `Plot (${lng.toFixed(2)}°E)`,
  };
}

// ------------------------------------------------------------
// 3. CORE FETCH FROM OPEN-METEO WEATHER API
// ------------------------------------------------------------
export async function fetchLiveWeatherFromApi(
  lat: number,
  lng: number,
  forceRefresh = false
): Promise<WeatherCacheRecord> {
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
  const now = Date.now();

  // Check memory cache
  const cached = memoryCache.get(cacheKey);
  if (!forceRefresh && cached && new Date(cached.expires_at).getTime() > now) {
    totalCacheHits++;
    return {
      ...cached,
      current_weather: {
        ...cached.current_weather,
        is_cached: true,
      },
    };
  }

  totalCacheMisses++;

  const locationInfo = await getDistrictFromCoords(lat, lng);
  const startTime = Date.now();

  // Construct official Open-Meteo URL (or custom configured provider)
  const baseUrl = process.env.WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast";
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,is_day",
    hourly: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "7",
  });

  if (process.env.WEATHER_API_KEY) {
    params.append("apikey", process.env.WEATHER_API_KEY);
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "KrishiMitra-AI/1.0 (Agriculture Decision Support)" },
      cache: "no-store",
    });

    lastApiResponseTimeMs = Date.now() - startTime;

    if (!res.ok) {
      throw new Error(`Weather Provider HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    lastSuccessfulFetch = new Date().toISOString();
    lastApiStatus = "HEALTHY";

    // 1. Parse Current Weather
    const current = data.current || {};
    const currentWmo = interpretWmoCode(current.weather_code ?? 0);
    const currentWeather: CurrentWeather = {
      temperature: Math.round((current.temperature_2m ?? 26) * 10) / 10,
      apparent_temperature: Math.round((current.apparent_temperature ?? current.temperature_2m ?? 27) * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      wind_speed: Math.round((current.wind_speed_10m ?? 12) * 10) / 10,
      wind_direction: current.wind_direction_10m ?? 90,
      wind_direction_cardinal: degreesToCardinal(current.wind_direction_10m ?? 90),
      precipitation: current.precipitation ?? 0,
      rain: current.rain ?? 0,
      surface_pressure: current.surface_pressure ? Math.round(current.surface_pressure) : undefined,
      cloud_cover: current.cloud_cover ? Math.round(current.cloud_cover) : undefined,
      visibility_km: 10,
      uv_index: data.hourly?.uv_index ? Math.round(data.hourly.uv_index[0] ?? 5) : 5,
      weather_code: current.weather_code ?? 0,
      condition: currentWmo.condition,
      condition_kn: currentWmo.condition_kn,
      is_day: current.is_day === 1,
      source: "Open-Meteo (WMO / ECMWF / GFS Models)",
      source_url: "https://open-meteo.com",
      last_updated: new Date().toISOString(),
      location_name: `${locationInfo.village}, ${locationInfo.district}`,
      district: locationInfo.district,
      state: locationInfo.state,
      latitude: lat,
      longitude: lng,
      is_cached: false,
    };

    // 2. Parse Hourly Forecast (next 24 hours)
    const hourlyList: HourlyForecastItem[] = [];
    if (data.hourly && Array.isArray(data.hourly.time)) {
      const times: string[] = data.hourly.time;
      const count = Math.min(times.length, 24);
      for (let i = 0; i < count; i++) {
        const itemWmo = interpretWmoCode(data.hourly.weather_code?.[i] ?? 0);
        const isoTime = times[i];
        const dateObj = new Date(isoTime);
        const timeLabel = dateObj.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        hourlyList.push({
          time: timeLabel,
          timestamp: isoTime,
          temperature: Math.round((data.hourly.temperature_2m?.[i] ?? 25) * 10) / 10,
          apparent_temperature: Math.round((data.hourly.apparent_temperature?.[i] ?? 26) * 10) / 10,
          humidity: Math.round(data.hourly.relative_humidity_2m?.[i] ?? 60),
          precipitation_probability: Math.round(data.hourly.precipitation_probability?.[i] ?? 0),
          precipitation: Math.round((data.hourly.precipitation?.[i] ?? 0) * 10) / 10,
          rain: Math.round((data.hourly.rain?.[i] ?? 0) * 10) / 10,
          wind_speed: Math.round((data.hourly.wind_speed_10m?.[i] ?? 10) * 10) / 10,
          wind_direction: data.hourly.wind_direction_10m?.[i] ?? 0,
          weather_code: data.hourly.weather_code?.[i] ?? 0,
          condition: itemWmo.condition,
          condition_kn: itemWmo.condition_kn,
          uv_index: data.hourly.uv_index?.[i] ? Math.round(data.hourly.uv_index[i]) : undefined,
          is_day: data.hourly.is_day?.[i] === 1,
        });
      }
    }

    // 3. Parse Daily Forecast (7 Days)
    const dailyList: DailyForecastItem[] = [];
    if (data.daily && Array.isArray(data.daily.time)) {
      const days: string[] = data.daily.time;
      const dayNamesKn = ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"];

      for (let i = 0; i < days.length; i++) {
        const itemWmo = interpretWmoCode(data.daily.weather_code?.[i] ?? 0);
        const dateObj = new Date(days[i]);
        const isToday = i === 0;
        const dayName = isToday
          ? "Today"
          : dateObj.toLocaleDateString([], { weekday: "short" });
        const dayNameKn = isToday ? "ಇಂದು" : dayNamesKn[dateObj.getDay()];

        dailyList.push({
          date: days[i],
          day_name: dayName,
          day_name_kn: dayNameKn,
          temp_max: Math.round(data.daily.temperature_2m_max?.[i] ?? 30),
          temp_min: Math.round(data.daily.temperature_2m_min?.[i] ?? 20),
          apparent_temp_max: data.daily.apparent_temperature_max?.[i] ? Math.round(data.daily.apparent_temperature_max[i]) : undefined,
          apparent_temp_min: data.daily.apparent_temperature_min?.[i] ? Math.round(data.daily.apparent_temperature_min[i]) : undefined,
          precipitation_sum: Math.round((data.daily.precipitation_sum?.[i] ?? 0) * 10) / 10,
          precipitation_hours: Math.round((data.daily.precipitation_hours?.[i] ?? 0) * 10) / 10,
          precipitation_probability_max: Math.round(data.daily.precipitation_probability_max?.[i] ?? 0),
          wind_speed_max: Math.round((data.daily.wind_speed_10m_max?.[i] ?? 15) * 10) / 10,
          wind_direction_dominant: data.daily.wind_direction_10m_dominant?.[i] ?? 0,
          weather_code: data.daily.weather_code?.[i] ?? 0,
          condition: itemWmo.condition,
          condition_kn: itemWmo.condition_kn,
          uv_index_max: data.daily.uv_index_max?.[i] ? Math.round(data.daily.uv_index_max[i]) : undefined,
          sunrise: data.daily.sunrise?.[i],
          sunset: data.daily.sunset?.[i],
        });
      }
    }

    // 4. Compute Rainfall Intelligence
    const next24hRain = hourlyList.slice(0, 24).reduce((acc, h) => acc + h.precipitation, 0);
    const next7dRain = dailyList.reduce((acc, d) => acc + d.precipitation_sum, 0);
    const todayRainProb = dailyList[0]?.precipitation_probability_max ?? 0;
    const tomorrowRainProb = dailyList[1]?.precipitation_probability_max ?? 0;

    let rainfallTrend: "increasing" | "decreasing" | "stable" | "none" = "none";
    if (next7dRain > 0) {
      if (tomorrowRainProb > todayRainProb + 15) rainfallTrend = "increasing";
      else if (todayRainProb > tomorrowRainProb + 15) rainfallTrend = "decreasing";
      else rainfallTrend = "stable";
    }

    let irrigationAdvisory = "Regular drip irrigation recommended. Monitor soil surface moisture.";
    let irrigationAdvisoryKn = "ನಿಯಮಿತ ಹನಿ ನೀರಾವರಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಗಮನಿಸಿ.";

    if (next24hRain >= 12.0 || todayRainProb >= 70) {
      irrigationAdvisory = `🌧️ Rain expected (${Math.round(next24hRain)}mm, ${todayRainProb}% prob). Hold planned drip irrigation to save electricity and prevent root waterlogging.`;
      irrigationAdvisoryKn = `🌧️ ಮಳೆಯ ಸಾಧ್ಯತೆ (${Math.round(next24hRain)}ಮಿಮೀ, ${todayRainProb}%). ವಿದ್ಯುತ್ ಉಳಿಸಲು ಮತ್ತು ನೀರು ನಿಲ್ಲುವುದನ್ನು ತಡೆಯಲು ನಿಗದಿತ ಹನಿ ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.`;
    } else if (currentWeather.temperature > 34.0) {
      irrigationAdvisory = "🌡️ High daytime temperature. Apply early morning drip pulse to maintain root turgor and suppress thermal stress.";
      irrigationAdvisoryKn = "🌡️ ಹೆಚ್ಚಿನ ಹಗಲಿನ ತಾಪಮಾನ. ಬೇರುಗಳ ಆರೋಗ್ಯ ಕಾಪಾಡಲು ಮುಂಜಾನೆಯೇ ಹನಿ ನೀರುಣಿಸಿ.";
    }

    const rainfallIntelligence: RainfallIntelligence = {
      expected_rainfall_next_24h: Math.round(next24hRain * 10) / 10,
      expected_rainfall_next_7d: Math.round(next7dRain * 10) / 10,
      rain_probability_today: todayRainProb,
      rain_probability_tomorrow: tomorrowRainProb,
      rainfall_trend: rainfallTrend,
      soil_moisture_estimate_status: next24hRain > 25 ? "waterlogged" : next24hRain > 10 ? "saturated" : "optimal",
      irrigation_advisory: irrigationAdvisory,
      irrigation_advisory_kn: irrigationAdvisoryKn,
    };

    const record: WeatherCacheRecord = {
      location_key: cacheKey,
      latitude: lat,
      longitude: lng,
      district: locationInfo.district,
      state: locationInfo.state,
      current_weather: currentWeather,
      hourly_forecast: hourlyList,
      daily_forecast: dailyList,
      rainfall_intelligence: rainfallIntelligence,
      fetched_at: new Date().toISOString(),
      expires_at: new Date(now + CACHE_TTL_MS).toISOString(),
      provider: "Open-Meteo (WMO / ECMWF / GFS)",
    };

    memoryCache.set(cacheKey, record);
    return record;
  } catch (err: any) {
    lastFailedFetch = new Date().toISOString();
    lastApiStatus = memoryCache.size > 0 ? "DEGRADED" : "DOWN";

    // If cache has stale record for this location, return it with warning
    if (cached) {
      return {
        ...cached,
        current_weather: {
          ...cached.current_weather,
          is_cached: true,
          source: `${cached.provider} (Cached fallback)`,
        },
      };
    }

    throw new Error(`Weather API Fetch Error: ${err.message || "Failed to contact weather provider"}`);
  }
}

// ------------------------------------------------------------
// 4. ADMIN & TELEMETRY ACCESSOR
// ------------------------------------------------------------
export function getAdminWeatherTelemetry(alertRulesCount = 7, activeAlertsCount = 0): AdminWeatherStats {
  return {
    api_status: lastApiStatus,
    provider: "Open-Meteo (WMO / ECMWF / GFS)",
    last_successful_fetch: lastSuccessfulFetch,
    last_failed_fetch: lastFailedFetch,
    api_response_time_ms: lastApiResponseTimeMs,
    cache_hits: totalCacheHits,
    cache_misses: totalCacheMisses,
    cached_locations_count: memoryCache.size,
    total_active_alerts: activeAlertsCount,
    total_expired_alerts: 0,
    total_notifications_sent: 0,
    failed_notifications_count: 0,
    alert_rules: [],
    delivery_logs: [],
  };
}

export function flushWeatherCache(): void {
  memoryCache.clear();
}
