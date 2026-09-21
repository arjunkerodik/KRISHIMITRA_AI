import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district") || undefined;
    const market = searchParams.get("market") || undefined;
    const commodity = searchParams.get("commodity") || undefined;
    const date = searchParams.get("date") || undefined;

    const prices = await marketDataService.fetchLatestPrices({
      district,
      market,
      commodity,
      date,
    });

    if (prices.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No market prices found matching the specified filters.",
        data: [],
      });
    }

    // Format output matching Section 9 specification
    const formattedData = prices.map((p) => ({
      id: p.id,
      market: p.market_name,
      district: p.district,
      commodity: p.commodity_name,
      variety: p.variety,
      grade: p.grade,
      min_price: p.min_price,
      max_price: p.max_price,
      modal_price: p.modal_price,
      unit: p.unit,
      arrival_quantity: p.arrival_quantity,
      price_date: p.price_date,
      freshness_status: p.freshness_status,
      source: p.source_name,
      source_url: p.source_url,
      fetched_at: p.fetched_at,
    }));

    return NextResponse.json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error: any) {
    console.error("GET /api/prices/latest error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Market price is currently unavailable. Please try again later.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
