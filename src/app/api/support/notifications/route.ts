import { NextRequest, NextResponse } from "next/server";
import { getFarmerNotifications } from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const notifications = await getFarmerNotifications(userId);
    return NextResponse.json({ success: true, count: notifications.length, data: notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
