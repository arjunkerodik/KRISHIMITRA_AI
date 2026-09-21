import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_BOUNDARIES } from "@/lib/farmStore";

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
    const { boundary_geojson, calculated_area, calculated_perimeter } = body;

    if (!boundary_geojson) {
      return NextResponse.json(
        { success: false, error: "boundary_geojson is required." },
        { status: 400 }
      );
    }

    const boundaryRecord = {
      id: `bound_${Date.now()}`,
      farm_id: id,
      boundary_geojson,
      calculated_area: calculated_area ? parseFloat(calculated_area) : farm.total_area,
      calculated_perimeter: calculated_perimeter ? parseFloat(calculated_perimeter) : 0,
      created_at: new Date().toISOString(),
    };

    IN_MEMORY_BOUNDARIES[id] = boundaryRecord;

    return NextResponse.json({
      success: true,
      message: "Farm boundary polygon saved successfully.",
      boundary: boundaryRecord,
    });
  } catch (error: any) {
    console.error("POST /api/farms/[id]/boundary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save boundary.", details: error.message },
      { status: 500 }
    );
  }
}
