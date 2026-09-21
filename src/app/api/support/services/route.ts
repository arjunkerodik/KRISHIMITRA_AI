import { NextRequest, NextResponse } from "next/server";
import { MASTER_SUPPORT_SERVICES, VERIFIED_SERVICE_PROVIDERS } from "@/lib/services/governmentDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let services = MASTER_SUPPORT_SERVICES;
    if (category && category !== "All") {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: {
        services,
        providers: VERIFIED_SERVICE_PROVIDERS,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
