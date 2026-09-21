import { NextRequest, NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/services/weatherAlertService";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo_farmer_01";

    const ok = markNotificationRead(userId, id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}
