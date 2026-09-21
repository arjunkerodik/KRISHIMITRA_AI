import { NextRequest, NextResponse } from "next/server";
import { getVerifiedOfficialNotices } from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const district = searchParams.get("district") || undefined;
    const state = searchParams.get("state") || "Karnataka";

    const notices = await getVerifiedOfficialNotices({ category, district, state });
    return NextResponse.json({ success: true, count: notices.length, data: notices });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
