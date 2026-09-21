import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_CROPS, IN_MEMORY_STAGE_HISTORY } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const crops = IN_MEMORY_CROPS[id] || [];

    return NextResponse.json({
      success: true,
      count: crops.length,
      crop_plots: crops,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/crops error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve crop plots.", details: error.message },
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
      crop_name,
      variety,
      sowing_date,
      expected_harvest_date,
      current_stage,
      area_acres,
      seed_source,
      seed_quantity,
      farming_practice,
    } = body;

    if (!crop_name || !crop_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Crop Name is required." },
        { status: 400 }
      );
    }

    const area = parseFloat(area_acres);
    if (isNaN(area) || area <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid crop area (> 0) is required." },
        { status: 400 }
      );
    }

    // Validation: crop area cannot exceed total farm area
    if (area > farm.total_area) {
      return NextResponse.json(
        {
          success: false,
          error: `Crop area (${area} ${farm.area_unit}) cannot exceed total farm size (${farm.total_area} ${farm.area_unit}).`,
        },
        { status: 400 }
      );
    }

    const cropId = `crop_${Date.now()}`;
    const now = new Date().toISOString();

    const newCrop = {
      id: cropId,
      farm_id: id,
      crop_name: crop_name.trim(),
      variety: variety?.trim() || "Local / Hybrid",
      sowing_date: sowing_date || now.split("T")[0],
      expected_harvest_date: expected_harvest_date || null,
      current_stage: current_stage || "Sowing / Seedling",
      stage_updated_at: now,
      area_acres: area,
      seed_source: seed_source?.trim() || null,
      seed_quantity: seed_quantity ? parseFloat(seed_quantity) : null,
      farming_practice: farming_practice?.trim() || "Conventional",
      created_at: now,
    };

    if (!IN_MEMORY_CROPS[id]) {
      IN_MEMORY_CROPS[id] = [];
    }
    IN_MEMORY_CROPS[id].push(newCrop);

    IN_MEMORY_STAGE_HISTORY[cropId] = [
      {
        id: `hist_${Date.now()}`,
        crop_plot_id: cropId,
        stage: newCrop.current_stage,
        notes: "Crop plot initialized",
        updated_at: now,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        message: "Crop plot added successfully.",
        crop_plot: newCrop,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/crops error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add crop plot.", details: error.message },
      { status: 500 }
    );
  }
}
