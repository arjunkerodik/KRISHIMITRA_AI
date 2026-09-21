import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") || "Karnataka";
    const district = searchParams.get("district") || "";
    const commodity = searchParams.get("commodity") || "Tomato";
    const variety = searchParams.get("variety") || "";

    const prices = await marketDataService.fetchLatestPrices({
      district: district || undefined,
      commodity: commodity || undefined,
    });

    return NextResponse.json({
      success: true,
      data_source: "e-NAM (https://enam.gov.in) & AGMARKNET (https://agmarknet.gov.in)",
      disclaimer: "Verified daily arrival records from official APMC trading yards. Prices reflect modal trading auction settle rates.",
      timestamp: new Date().toISOString(),
      filters_applied: { state, district, commodity, variety },
      total_records: prices.length,
      records: prices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
