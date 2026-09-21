import { NextRequest, NextResponse } from "next/server";
import { generateDeterministicPlan } from "@/lib/ai-engine";
import { DEMO_ACTIONS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plotId = searchParams.get("plotId") || "farm_001";
    const language = searchParams.get("lang") || "en";

    const actions = generateDeterministicPlan(plotId);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      plotId,
      language,
      actions: actions || DEMO_ACTIONS
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
