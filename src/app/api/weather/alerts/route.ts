import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi } from "@/lib/services/weatherService";
import { evaluateWeatherConditions } from "@/lib/services/weatherAlertService";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farm_id") || "farm_001";
    const userId = searchParams.get("userId") || "demo_farmer_01";
    let lat = Number(searchParams.get("lat"));
    let lng = Number(searchParams.get("lng"));

    const farm = DEMO_FARMS.find((f) => f.id === farmId);
    if (farm) {
      lat = farm.latitude;
      lng = farm.longitude;
    } else if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      lat = 13.1367;
      lng = 78.1291;
    }

    // 1. Fetch live meteorological metrics
    const weatherData = await fetchLiveWeatherFromApi(lat, lng);

    // 2. Evaluate rules-based alert engine
    const alerts = evaluateWeatherConditions(weatherData, farm, userId);

    return NextResponse.json({
      success: true,
      count: alerts.length,
      data: alerts,
      source: weatherData.provider,
      evaluated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Alert engine evaluation error" },
      { status: 500 }
    );
  }
}
