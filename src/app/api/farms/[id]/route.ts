import { NextRequest, NextResponse } from "next/server";
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
} from "@/lib/farmStore";
import { farmDecisionService } from "@/lib/services/farmDecisionService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farm = IN_MEMORY_FARMS.find((f) => f.id === id);

    if (!farm) {
      return NextResponse.json(
        { success: false, error: "Farm not found with the specified ID." },
        { status: 404 }
      );
    }

    const completeness = farmDecisionService.calculateDataCompleteness({
      farm,
      location: IN_MEMORY_LOCATIONS[id],
      soil: IN_MEMORY_SOIL[id]?.[0],
      water: IN_MEMORY_WATER[id],
      crops: IN_MEMORY_CROPS[id],
      expenses: IN_MEMORY_EXPENSES[id],
      activities: IN_MEMORY_ACTIVITIES[id],
    });

    return NextResponse.json({
      success: true,
      farm: {
        ...farm,
        location: IN_MEMORY_LOCATIONS[id] || null,
        boundary: IN_MEMORY_BOUNDARIES[id] || null,
        soil: IN_MEMORY_SOIL[id] || [],
        water: IN_MEMORY_WATER[id] || null,
        crops: IN_MEMORY_CROPS[id] || [],
        activities: IN_MEMORY_ACTIVITIES[id] || [],
        expenses: IN_MEMORY_EXPENSES[id] || [],
        sales: IN_MEMORY_SALES[id] || [],
        pests: IN_MEMORY_PESTS[id] || [],
        completeness,
      },
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve farm details.", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farmIndex = IN_MEMORY_FARMS.findIndex((f) => f.id === id);

    if (farmIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Farm not found for update." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const current = IN_MEMORY_FARMS[farmIndex];

    const updated = {
      ...current,
      farm_name: body.farm_name?.trim() || current.farm_name,
      total_area: body.total_area !== undefined ? parseFloat(body.total_area) : current.total_area,
      area_unit: body.area_unit || current.area_unit,
      ownership_type: body.ownership_type || current.ownership_type,
      address: body.address !== undefined ? body.address : current.address,
      district: body.district?.trim() || current.district,
      taluk: body.taluk?.trim() || current.taluk,
      village: body.village !== undefined ? body.village : current.village,
      pincode: body.pincode !== undefined ? body.pincode : current.pincode,
      updated_at: new Date().toISOString(),
    };

    IN_MEMORY_FARMS[farmIndex] = updated;

    return NextResponse.json({
      success: true,
      message: "Farm details updated successfully.",
      farm: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/farms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update farm.", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farmIndex = IN_MEMORY_FARMS.findIndex((f) => f.id === id);

    if (farmIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Farm not found for deletion." },
        { status: 404 }
      );
    }

    // Remove from in-memory arrays and clean up sub-entities
    IN_MEMORY_FARMS.splice(farmIndex, 1);
    delete IN_MEMORY_LOCATIONS[id];
    delete IN_MEMORY_BOUNDARIES[id];
    delete IN_MEMORY_SOIL[id];
    delete IN_MEMORY_WATER[id];
    delete IN_MEMORY_CROPS[id];
    delete IN_MEMORY_ACTIVITIES[id];
    delete IN_MEMORY_EXPENSES[id];
    delete IN_MEMORY_SALES[id];
    delete IN_MEMORY_PESTS[id];

    return NextResponse.json({
      success: true,
      message: "Farm and associated records deleted successfully.",
      deleted_farm_id: id,
    });
  } catch (error: any) {
    console.error("DELETE /api/farms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete farm.", details: error.message },
      { status: 500 }
    );
  }
}
