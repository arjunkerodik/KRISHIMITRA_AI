import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude, commodity_id, quantity, cost_per_km } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude and Longitude are required to calculate transport distances.",
        },
        { status: 400 }
      );
    }

    if (!commodity_id) {
      return NextResponse.json(
        { success: false, error: "Commodity ID is required for market comparison." },
        { status: 400 }
      );
    }

    const qty = parseFloat(quantity) || 10;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const freightRate = cost_per_km ? parseFloat(cost_per_km) : 1.85;

    const rankedMarkets = await marketDataService.compareMarkets({
      latitude: lat,
      longitude: lng,
      commodity_id,
      quantity: qty,
      cost_per_km: freightRate,
    });

    if (rankedMarkets.length === 0) {
      return NextResponse.json({
        success: true,
        best_market: null,
        comparisons: [],
        message: "No active APMC market prices found within 150 km for this crop.",
      });
    }

    const bestMarket = rankedMarkets[0];

    return NextResponse.json({
      success: true,
      query: {
        latitude: lat,
        longitude: lng,
        commodity_id,
        quantity_qtl: qty,
        freight_rate_per_km: freightRate,
      },
      best_market: {
        market: bestMarket.market,
        district: bestMarket.district,
        price: bestMarket.modal_price,
        distance_km: bestMarket.distance_km,
        gross_revenue: bestMarket.gross_revenue,
        estimated_transport_cost: bestMarket.estimated_transport_cost,
        expected_net_revenue: bestMarket.net_revenue,
        freshness_status: bestMarket.freshness_status,
        price_date: bestMarket.price_date,
        source: bestMarket.source_name,
      },
      comparisons: rankedMarkets.map((m) => ({
        market_id: m.market_id,
        market: m.market,
        district: m.district,
        distance_km: m.distance_km,
        modal_price: m.modal_price,
        gross_revenue: m.gross_revenue,
        transport_cost: m.estimated_transport_cost,
        net_revenue: m.net_revenue,
        price_date: m.price_date,
        freshness_status: m.freshness_status,
        source: m.source_name,
        cost_label: "ESTIMATED (Govt Karnataka Freight Index ₹1.85/km/qtl)",
      })),
    });
  } catch (error: any) {
    console.error("POST /api/markets/compare error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to compare markets. Please try again later.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
