import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_CROPS, IN_MEMORY_STAGE_HISTORY } from "@/lib/farmStore";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { stage, notes } = body;

    if (!stage || !stage.trim()) {
      return NextResponse.json(
        { success: false, error: "Crop stage name is required." },
        { status: 400 }
      );
    }

    let targetCrop: any = null;
    for (const crops of Object.values(IN_MEMORY_CROPS) as any[][]) {
      const c = crops.find((item: any) => item.id === id);
      if (c) {
        targetCrop = c;
        break;
      }
    }

    if (!targetCrop) {
      return NextResponse.json(
        { success: false, error: "Crop plot not found." },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    targetCrop.current_stage = stage.trim();
    targetCrop.stage_updated_at = now;

    if (!IN_MEMORY_STAGE_HISTORY[id]) {
      IN_MEMORY_STAGE_HISTORY[id] = [];
    }

    const historyEntry = {
      id: `stage_hist_${Date.now()}`,
      crop_plot_id: id,
      stage: stage.trim(),
      notes: notes?.trim() || null,
      updated_at: now,
    };

    IN_MEMORY_STAGE_HISTORY[id].unshift(historyEntry);

    return NextResponse.json({
      success: true,
      message: `Crop stage updated to ${stage.trim()}.`,
      current_stage: targetCrop.current_stage,
      stage_history: IN_MEMORY_STAGE_HISTORY[id],
    });
  } catch (error: any) {
    console.error("POST /api/crops/[id]/stage error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update crop stage.", details: error.message },
      { status: 500 }
    );
  }
}
