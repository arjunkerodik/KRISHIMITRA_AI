import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_ACTIVITIES } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const activities = IN_MEMORY_ACTIVITIES[id] || [];

    return NextResponse.json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/activities error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve farm activities.", details: error.message },
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
      activity_type,
      activity_date,
      crop_plot_id,
      quantity,
      unit,
      cost_inr,
      notes,
    } = body;

    if (!activity_type || !activity_type.trim()) {
      return NextResponse.json(
        { success: false, error: "Activity Type is required." },
        { status: 400 }
      );
    }

    const newActivity = {
      id: `act_${Date.now()}`,
      farm_id: id,
      crop_plot_id: crop_plot_id || null,
      activity_type: activity_type.trim(),
      activity_date: activity_date || new Date().toISOString().split("T")[0],
      quantity: quantity !== undefined && quantity !== "" ? parseFloat(quantity) : null,
      unit: unit || null,
      cost_inr: cost_inr !== undefined && cost_inr !== "" ? Math.max(0, parseFloat(cost_inr)) : 0,
      notes: notes?.trim() || null,
      created_at: new Date().toISOString(),
    };

    if (!IN_MEMORY_ACTIVITIES[id]) {
      IN_MEMORY_ACTIVITIES[id] = [];
    }
    IN_MEMORY_ACTIVITIES[id].unshift(newActivity);

    return NextResponse.json(
      {
        success: true,
        message: "Activity logged to digital farm journal.",
        activity: newActivity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/activities error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record activity.", details: error.message },
      { status: 500 }
    );
  }
}
