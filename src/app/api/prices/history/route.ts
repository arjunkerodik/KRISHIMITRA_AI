import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const market = searchParams.get("market") || undefined;
    const commodity = searchParams.get("commodity") || undefined;
    const fromDate = searchParams.get("from_date") || undefined;
    const toDate = searchParams.get("to_date") || undefined;

    const history = await marketDataService.fetchHistoricalPrices({
      market,
      commodity,
      from_date: fromDate,
      to_date: toDate,
    });

    return NextResponse.json({
      success: true,
      market: market || "All Markets",
      commodity: commodity || "All Commodities",
      count: history.length,
      history: history.map((h) => ({
        price_date: h.price_date,
        min_price: h.min_price,
        max_price: h.max_price,
        modal_price: h.modal_price,
        source_name: h.source_name,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/prices/history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve price history data. Please try again later.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
