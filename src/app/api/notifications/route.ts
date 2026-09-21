import { NextRequest, NextResponse } from "next/server";
import { getFarmerNotificationsList } from "@/lib/services/weatherAlertService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo_farmer_01";
    const type = searchParams.get("type");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    let list = getFarmerNotificationsList(userId);

    if (unreadOnly) {
      list = list.filter((n) => !n.is_read);
    }

    if (type && type !== "ALL") {
      list = list.filter((n) => n.type === type);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      unread_count: list.filter((n) => !n.is_read).length,
      data: list,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load notifications" },
      { status: 500 }
    );
  }
}
