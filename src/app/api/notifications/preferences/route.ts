import { NextRequest, NextResponse } from "next/server";
import {
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
} from "@/lib/services/weatherAlertService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "demo_farmer_01";
    const pref = getUserNotificationPreferences(userId);
    return NextResponse.json({ success: true, data: pref });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to get preferences" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "demo_farmer_01";
    const updated = updateUserNotificationPreferences(userId, body.preferences || body);
    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update preferences" },
      { status: 500 }
    );
  }
}
