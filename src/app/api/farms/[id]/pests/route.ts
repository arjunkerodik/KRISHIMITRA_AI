import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_PESTS } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const pests = IN_MEMORY_PESTS[id] || [];

    return NextResponse.json({
      success: true,
      count: pests.length,
      pest_observations: pests,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/pests error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve pest scouting logs.", details: error.message },
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
      crop_plot_id,
      observation_type = "Pest",
      pest_or_disease_name,
      affected_area_pct = 10,
      severity = "Moderate",
      image_url,
      observation_notes,
      observation_date,
      is_ai_assisted = false,
      ai_confidence,
      treatment_recommendation,
    } = body;

    if (!pest_or_disease_name || !pest_or_disease_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Pest / Disease name or symptom description is required." },
        { status: 400 }
      );
    }

    const newObservation = {
      id: `pest_${Date.now()}`,
      farm_id: id,
      crop_plot_id: crop_plot_id || null,
      observation_type,
      pest_or_disease_name: pest_or_disease_name.trim(),
      affected_area_pct: parseFloat(affected_area_pct) || 0,
      severity,
      image_url: image_url || null,
      observation_notes: observation_notes?.trim() || null,
      observation_date: observation_date || new Date().toISOString().split("T")[0],
      is_ai_assisted: Boolean(is_ai_assisted),
      ai_confidence: ai_confidence ? parseFloat(ai_confidence) : null,
      treatment_recommendation: treatment_recommendation?.trim() || null,
      assessment_label: is_ai_assisted ? "AI-assisted assessment" : "Field Scout Observation",
      created_at: new Date().toISOString(),
    };

    if (!IN_MEMORY_PESTS[id]) {
      IN_MEMORY_PESTS[id] = [];
    }
    IN_MEMORY_PESTS[id].unshift(newObservation);

    return NextResponse.json(
      {
        success: true,
        message: "Pest / Disease scout observation logged successfully.",
        observation: newObservation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/pests error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record observation.", details: error.message },
      { status: 500 }
    );
  }
}
