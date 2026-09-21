import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const radiusStr = searchParams.get("radius");
    const commodityId = searchParams.get("commodity") || undefined;

    if (!latStr || !lngStr) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude (lat) and Longitude (lng) are required query parameters.",
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = radiusStr ? parseFloat(radiusStr) : 120;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: "Invalid latitude or longitude values." },
        { status: 400 }
      );
    }

    const nearbyMarkets = await marketDataService.getNearbyMarkets(
      lat,
      lng,
      radius,
      commodityId
    );

    return NextResponse.json({
      success: true,
      origin: { latitude: lat, longitude: lng },
      radius_km: radius,
      count: nearbyMarkets.length,
      markets: nearbyMarkets.map((m) => ({
        market_id: m.market_id,
        market: m.market_name,
        apmc_name: m.apmc_name,
        district: m.district,
        taluk: m.taluk,
        distance_km: m.distance_km,
        latitude: m.latitude,
        longitude: m.longitude,
        latest_price: m.latest_price
          ? {
              commodity: m.latest_price.commodity_name,
              variety: m.latest_price.variety,
              grade: m.latest_price.grade,
              min_price: m.latest_price.min_price,
              max_price: m.latest_price.max_price,
              modal_price: m.latest_price.modal_price,
              unit: m.latest_price.unit,
              price_date: m.latest_price.price_date,
              freshness_status: m.latest_price.freshness_status,
              source: m.latest_price.source_name,
              fetched_at: m.latest_price.fetched_at,
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/markets/nearby error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve nearby markets. Please try again later.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
