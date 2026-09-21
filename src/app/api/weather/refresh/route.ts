import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi, flushWeatherCache } from "@/lib/services/weatherService";
import { evaluateWeatherConditions } from "@/lib/services/weatherAlertService";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const farmId = body.farm_id || "farm_001";
    let lat = Number(body.lat);
    let lng = Number(body.lng);

    const farm = DEMO_FARMS.find((f) => f.id === farmId);
    if (farm) {
      lat = farm.latitude;
      lng = farm.longitude;
    } else if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      lat = 13.1367;
      lng = 78.1291;
    }

    // Force flush and re-fetch from live provider
    const freshRecord = await fetchLiveWeatherFromApi(lat, lng, true);
    const freshAlerts = evaluateWeatherConditions(freshRecord, farm);

    return NextResponse.json({
      success: true,
      message: "Weather cache refreshed successfully from live meteorological API.",
      data: freshRecord.current_weather,
      alerts_count: freshAlerts.length,
      refreshed_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to refresh weather data" },
      { status: 500 }
    );
  }
}
