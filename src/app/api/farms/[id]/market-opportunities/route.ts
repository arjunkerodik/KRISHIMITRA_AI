import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_LOCATIONS, IN_MEMORY_CROPS } from "@/lib/farmStore";
import { marketDataService } from "@/lib/services/marketDataService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farm = IN_MEMORY_FARMS.find((f) => f.id === id);

    if (!farm) {
      return NextResponse.json(
        { success: false, error: "Farm not found." },
        { status: 404 }
      );
    }

    const loc = IN_MEMORY_LOCATIONS[id];
    const crops = IN_MEMORY_CROPS[id] || [];

    if (!loc) {
      return NextResponse.json({
        success: true,
        available: false,
        message: "Farm location is not set. Add GPS coordinates to compare nearby APMC mandis.",
        markets: [],
      });
    }

    const primaryCrop = crops.length > 0 ? crops[0] : null;
    const cropName = primaryCrop?.crop_name || "Onion";
    const quantity = primaryCrop?.area_acres ? Math.round(primaryCrop.area_acres * 15) : 20;

    // Use marketDataService to compare real Karnataka mandis
    const comparisons = await marketDataService.compareMarkets({
      latitude: loc.latitude,
      longitude: loc.longitude,
      commodity_id: "22222222-2222-2222-2222-222222222201",
      quantity,
      cost_per_km: 1.85,
    });

    return NextResponse.json({
      success: true,
      available: true,
      crop: cropName,
      estimated_harvest_quantity_qtl: quantity,
      origin: { latitude: loc.latitude, longitude: loc.longitude, district: farm.district },
      best_market: comparisons[0] || null,
      market_opportunities: comparisons.map((m) => ({
        market_id: m.market_id,
        market: m.market,
        district: m.district,
        distance_km: m.distance_km,
        modal_price: m.modal_price,
        gross_revenue: m.gross_revenue,
        estimated_transport_cost: m.estimated_transport_cost,
        expected_net_revenue: m.net_revenue,
        price_date: m.price_date,
        freshness_status: m.freshness_status,
        source: m.source_name,
        cost_label: "ESTIMATED (Govt Karnataka Freight Index ₹1.85/km/qtl)",
      })),
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/market-opportunities error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve market opportunities.", details: error.message },
      { status: 500 }
    );
  }
}
