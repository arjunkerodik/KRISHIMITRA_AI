import { createClient } from "@supabase/supabase-js";

// Supabase Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://krishimitra.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// TypeScript Interfaces for Supabase Schema
// ============================================================

export interface Profile {
  id: string;
  full_name: string;
  phone_number?: string | null;
  village?: string | null;
  district?: string | null;
  state: string;
  language_preference: string;
  created_at?: string;
  updated_at?: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  farm_name: string;
  total_area_acres: number;
  latitude?: number | null;
  longitude?: number | null;
  boundary_geojson?: any | null;
  created_at?: string;
}

export interface Field {
  id: string;
  farm_id: string;
  field_name: string;
  area_acres: number;
  soil_type?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
}

export type SensorType = "soil_moisture" | "temperature" | "humidity" | "ph" | "rainfall" | "light" | "npk";

export interface Sensor {
  id: string;
  field_id: string;
  sensor_type: SensorType;
  device_code: string;
  is_active: boolean;
  installed_at?: string;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  reading_value: number;
  unit?: string | null;
  recorded_at: string;
}

export interface Crop {
  id: string;
  crop_name: string;
  crop_category?: string | null;
  ideal_temp_min?: number | null;
  ideal_temp_max?: number | null;
  ideal_soil_ph_min?: number | null;
  ideal_soil_ph_max?: number | null;
  growth_duration_days?: number | null;
}

export interface CropCycle {
  id: string;
  field_id: string;
  crop_id: string;
  sowing_date?: string | null;
  expected_harvest_date?: string | null;
  actual_harvest_date?: string | null;
  yield_kg?: number | null;
  status: "active" | "harvested" | "failed";
  created_at?: string;
}

export interface SoilRecord {
  id: string;
  field_id: string;
  ph_level?: number | null;
  nitrogen_ppm?: number | null;
  phosphorus_ppm?: number | null;
  potassium_ppm?: number | null;
  organic_carbon_pct?: number | null;
  tested_at: string;
  created_at?: string;
}

export interface WeatherRecord {
  id: string;
  farm_id: string;
  temperature_c?: number | null;
  humidity_pct?: number | null;
  rainfall_mm?: number | null;
  wind_speed_kmph?: number | null;
  recorded_at?: string;
}

// ============================================================
// Helper Data Fetchers
// ============================================================

export async function fetchFarmerFarms(ownerId: string): Promise<Farm[]> {
  try {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .eq("owner_id", ownerId);
    if (error) {
      console.warn("Supabase fetchFarmerFarms notice:", error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchFarmFields(farmId: string): Promise<Field[]> {
  try {
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("farm_id", farmId);
    if (error) {
      console.warn("Supabase fetchFarmFields notice:", error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchCropsMaster(): Promise<Crop[]> {
  try {
    const { data, error } = await supabase
      .from("crops")
      .select("*")
      .order("crop_name");
    if (error) {
      console.warn("Supabase fetchCropsMaster notice:", error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function fetchFieldLatestSoil(fieldId: string): Promise<SoilRecord | null> {
  try {
    const { data, error } = await supabase
      .from("soil_records")
      .select("*")
      .eq("field_id", fieldId)
      .order("tested_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("Supabase fetchFieldLatestSoil notice:", error.message);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function fetchLatestSensorReadings(fieldId: string): Promise<SensorReading[]> {
  try {
    const { data, error } = await supabase
      .from("sensors")
      .select(`
        id,
        sensor_type,
        device_code,
        sensor_readings (
          id,
          reading_value,
          unit,
          recorded_at
        )
      `)
      .eq("field_id", fieldId);
    if (error) {
      console.warn("Supabase fetchLatestSensorReadings notice:", error.message);
      return [];
    }
    return data ? (data.flatMap((s: any) => s.sensor_readings) as SensorReading[]) : [];
  } catch {
    return [];
  }
}
