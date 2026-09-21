import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_WATER } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const water = IN_MEMORY_WATER[id] || null;

    return NextResponse.json({
      success: true,
      water_resources: water,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/water error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve water resources.", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farm = IN_MEMORY_FARMS.find((f) => f.id === id);

    if (!farm) {
      return NextResponse.json(
        { success: false, error: "Farm not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      water_source,
      irrigation_method,
      irrigation_availability,
      storage_capacity,
      borewell_depth_ft,
      drip_sprinkler_type,
      irrigation_frequency_days,
      last_irrigation_date,
    } = body;

    if (!water_source || !water_source.trim()) {
      return NextResponse.json(
        { success: false, error: "Water Source is required." },
        { status: 400 }
      );
    }

    const waterRecord = {
      id: IN_MEMORY_WATER[id]?.id || `water_${Date.now()}`,
      farm_id: id,
      water_source: water_source.trim(),
      irrigation_method: irrigation_method?.trim() || "Rainfed / No Irrigation",
      irrigation_availability: irrigation_availability?.trim() || "Adequate",
      storage_capacity: storage_capacity ? parseFloat(storage_capacity) : 0,
      borewell_depth_ft: borewell_depth_ft ? parseFloat(borewell_depth_ft) : 0,
      drip_sprinkler_type: drip_sprinkler_type?.trim() || null,
      irrigation_frequency_days: irrigation_frequency_days ? parseInt(irrigation_frequency_days) : 3,
      last_irrigation_date: last_irrigation_date || null,
      updated_at: new Date().toISOString(),
    };

    IN_MEMORY_WATER[id] = waterRecord;

    return NextResponse.json({
      success: true,
      message: "Water resources and irrigation setup saved successfully.",
      water_resources: waterRecord,
    });
  } catch (error: any) {
    console.error("POST /api/farms/[id]/water error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save water resources.", details: error.message },
      { status: 500 }
    );
  }
}
