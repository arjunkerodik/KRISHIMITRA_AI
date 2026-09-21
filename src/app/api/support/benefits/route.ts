import { NextRequest, NextResponse } from "next/server";
import { getFarmerBenefits } from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const benefits = await getFarmerBenefits(userId);
    return NextResponse.json({ success: true, count: benefits.length, data: benefits });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
