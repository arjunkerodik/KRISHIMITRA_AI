import { NextRequest, NextResponse } from "next/server";
import { markAllNotificationsRead } from "@/lib/services/weatherAlertService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || "demo_farmer_01";

    const count = markAllNotificationsRead(userId);
    return NextResponse.json({
      success: true,
      message: `Marked ${count} notifications as read.`,
      updated_count: count,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to mark notifications read" },
      { status: 500 }
    );
  }
}
