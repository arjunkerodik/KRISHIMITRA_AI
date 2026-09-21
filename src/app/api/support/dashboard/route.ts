import { NextRequest, NextResponse } from "next/server";
import { getSupportDashboardSummary } from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const summary = await getSupportDashboardSummary(userId);
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
