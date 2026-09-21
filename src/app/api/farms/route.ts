import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { farmDecisionService } from "@/lib/services/farmDecisionService";

import {
  IN_MEMORY_FARMS,
  IN_MEMORY_LOCATIONS,
  IN_MEMORY_BOUNDARIES,
  IN_MEMORY_SOIL,
  IN_MEMORY_WATER,
  IN_MEMORY_CROPS,
  IN_MEMORY_ACTIVITIES,
  IN_MEMORY_EXPENSES,
  IN_MEMORY_SALES,
  IN_MEMORY_PESTS,
  IN_MEMORY_STAGE_HISTORY,
} from "@/lib/farmStore";



export async function GET(req: NextRequest) {
  try {
    // Attempt Supabase database query first
    const { data: dbFarms, error } = await supabase
      .from("farms")
      .select(`
        *,
        farm_locations (*),
        crop_plots (*)
      `)
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(dbFarms) && dbFarms.length > 0) {
      return NextResponse.json({
        success: true,
        count: dbFarms.length,
        farms: dbFarms,
      });
    }

    // Return runtime in-memory farms (starts empty as requested)
    return NextResponse.json({
      success: true,
      count: IN_MEMORY_FARMS.length,
      farms: IN_MEMORY_FARMS,
    });
  } catch (error: any) {
    console.error("GET /api/farms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve farms.", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      farm_name,
      total_area,
      area_unit = "Acres",
      ownership_type = "Owned",
      address,
      location,
      boundary,
      soil,
      water,
      crops,
      initial_crop,
    } = body;

    const resolvedState = (body.state || location?.state || "Karnataka").trim();
    const resolvedDistrict = (body.district || location?.district || "").trim();
    const resolvedTaluk = (body.taluk || location?.taluk || resolvedDistrict).trim();
    const resolvedVillage = (body.village || location?.village || "").trim();
    const resolvedPincode = (body.pincode || location?.pincode || "").trim();

    // Server-side validation
    if (!farm_name || !farm_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Farm Name is required." },
        { status: 400 }
      );
    }

    const areaNum = parseFloat(total_area);
    if (isNaN(areaNum) || areaNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid total farm area (> 0) is required." },
        { status: 400 }
      );
    }

    if (!resolvedDistrict) {
      return NextResponse.json(
        { success: false, error: "District is required." },
        { status: 400 }
      );
    }

    const farmId = `farm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const newFarm = {
      id: farmId,
      owner_id: "authenticated_farmer_user",
      farm_name: farm_name.trim(),
      total_area: areaNum,
      area_unit,
      ownership_type,
      address: address?.trim() || null,
      state: resolvedState,
      district: resolvedDistrict,
      taluk: resolvedTaluk,
      village: resolvedVillage || null,
      pincode: resolvedPincode || null,
      created_at: now,
      updated_at: now,
    };

    // Save to runtime store
    IN_MEMORY_FARMS.unshift(newFarm);

    // 1. Handle Location if provided
    if (location && location.latitude !== undefined && location.longitude !== undefined) {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        IN_MEMORY_LOCATIONS[farmId] = {
          id: `loc_${Date.now()}`,
          farm_id: farmId,
          latitude: lat,
          longitude: lng,
          reverse_geocoded_address: location.address || `${newFarm.village || ""}, ${newFarm.taluk}, ${newFarm.district}, Karnataka`,
          created_at: now,
        };
      }
    }

    // 2. Handle Boundary if provided
    if (boundary && boundary.boundary_geojson) {
      IN_MEMORY_BOUNDARIES[farmId] = {
        id: `bound_${Date.now()}`,
        farm_id: farmId,
        boundary_geojson: boundary.boundary_geojson,
        calculated_area: boundary.calculated_area || areaNum,
        calculated_perimeter: boundary.calculated_perimeter || 0,
        created_at: now,
      };
    }

    // 3. Handle Soil if provided
    if (soil && soil.soil_type) {
      IN_MEMORY_SOIL[farmId] = [
        {
          id: `soil_${Date.now()}`,
          farm_id: farmId,
          soil_type: soil.soil_type,
          test_date: soil.test_date || now.split("T")[0],
          ph: soil.ph ?? (soil.ph_level !== undefined ? parseFloat(soil.ph_level) : null),
          nitrogen: soil.nitrogen ?? (soil.nitrogen_ppm !== undefined ? parseFloat(soil.nitrogen_ppm) : null),
          phosphorus: soil.phosphorus ?? (soil.phosphorus_ppm !== undefined ? parseFloat(soil.phosphorus_ppm) : null),
          potassium: soil.potassium ?? (soil.potassium_ppm !== undefined ? parseFloat(soil.potassium_ppm) : null),
          organic_carbon: soil.organic_carbon ?? (soil.organic_carbon_pct !== undefined ? parseFloat(soil.organic_carbon_pct) : null),
          electrical_conductivity: soil.electrical_conductivity ? parseFloat(soil.electrical_conductivity) : null,
          moisture: soil.moisture ? parseFloat(soil.moisture) : null,
          document_url: soil.document_url || null,
          created_at: now,
        },
      ];
    } else {
      IN_MEMORY_SOIL[farmId] = [];
    }

    // 4. Handle Water if provided
    const resolvedWaterSource = water?.water_source || water?.primary_source;
    if (water && resolvedWaterSource) {
      IN_MEMORY_WATER[farmId] = {
        id: `water_${Date.now()}`,
        farm_id: farmId,
        water_source: resolvedWaterSource,
        irrigation_method: water.irrigation_method || water.irrigation_type || "Rainfed",
        irrigation_availability: water.irrigation_availability || water.water_availability_status || "Adequate",
        storage_capacity: parseFloat(water.storage_capacity) || 0,
        borewell_depth_ft: parseFloat(water.borewell_depth_ft) || 0,
        drip_sprinkler_type: water.drip_sprinkler_type || null,
        created_at: now,
      };
    }

    // 5. Handle Crops (Array or single initial_crop)
    IN_MEMORY_CROPS[farmId] = [];
    const cropsList = Array.isArray(crops) ? crops : initial_crop && initial_crop.crop_name ? [initial_crop] : [];
    for (const c of cropsList) {
      if (c && c.crop_name) {
        const cropId = `crop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const cropRecord = {
          id: cropId,
          farm_id: farmId,
          crop_name: c.crop_name,
          variety: c.variety || "Local / Hybrid",
          sowing_date: c.sowing_date || now.split("T")[0],
          expected_harvest_date: c.expected_harvest_date || null,
          current_stage: c.current_stage || "Sowing / Seedling",
          stage_updated_at: now,
          area_acres: Math.min(areaNum, parseFloat(c.area_acres) || areaNum),
          seed_source: c.seed_source || null,
          farming_practice: c.farming_practice || "Conventional",
          created_at: now,
        };
        IN_MEMORY_CROPS[farmId].push(cropRecord);
        IN_MEMORY_STAGE_HISTORY[cropId] = [
          {
            id: `hist_${Date.now()}`,
            crop_plot_id: cropId,
            stage: cropRecord.current_stage,
            notes: "Initial crop registration",
            updated_at: now,
          },
        ];
      }
    }

    // Initialize clean empty collections for this farm
    IN_MEMORY_ACTIVITIES[farmId] = [];
    IN_MEMORY_EXPENSES[farmId] = [];
    IN_MEMORY_SALES[farmId] = [];
    IN_MEMORY_PESTS[farmId] = [];

    // Calculate initial data completeness
    const completeness = farmDecisionService.calculateDataCompleteness({
      farm: newFarm,
      location: IN_MEMORY_LOCATIONS[farmId],
      soil: IN_MEMORY_SOIL[farmId]?.[0],
      water: IN_MEMORY_WATER[farmId],
      crops: IN_MEMORY_CROPS[farmId],
      expenses: IN_MEMORY_EXPENSES[farmId],
      activities: IN_MEMORY_ACTIVITIES[farmId],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Farm profile registered successfully.",
        farm: {
          ...newFarm,
          location: IN_MEMORY_LOCATIONS[farmId] || null,
          soil: IN_MEMORY_SOIL[farmId]?.[0] || null,
          water: IN_MEMORY_WATER[farmId] || null,
          crops: IN_MEMORY_CROPS[farmId] || [],
          completeness,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register farm.", details: error.message },
      { status: 500 }
    );
  }
}
