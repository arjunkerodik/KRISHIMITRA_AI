import { NextRequest, NextResponse } from "next/server";
import { getVerifiedImportantDates } from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const dates = await getVerifiedImportantDates();
    return NextResponse.json({ success: true, count: dates.length, data: dates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
