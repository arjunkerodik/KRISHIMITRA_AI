import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi } from "@/lib/services/weatherService";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farm_id");
    let lat = Number(searchParams.get("lat"));
    let lng = Number(searchParams.get("lng"));

    if (farmId) {
      const farm = DEMO_FARMS.find((f) => f.id === farmId);
      if (farm) {
        lat = farm.latitude;
        lng = farm.longitude;
      }
    }

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      lat = 13.1367;
      lng = 78.1291;
    }

    const weatherData = await fetchLiveWeatherFromApi(lat, lng);
    return NextResponse.json({
      success: true,
      count: weatherData.daily_forecast.length,
      data: weatherData.daily_forecast,
      rainfall_intelligence: weatherData.rainfall_intelligence,
      source: weatherData.provider,
      last_updated: weatherData.fetched_at,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "7-day weather forecast unavailable" },
      { status: 500 }
    );
  }
}
