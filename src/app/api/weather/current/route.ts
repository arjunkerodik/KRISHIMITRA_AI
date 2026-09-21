import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi } from "@/lib/services/weatherService";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farm_id");
    let lat = Number(searchParams.get("lat"));
    let lng = Number(searchParams.get("lng"));

    // If farm_id provided, resolve coordinates from farm
    if (farmId) {
      const farm = DEMO_FARMS.find((f) => f.id === farmId);
      if (farm) {
        lat = farm.latitude;
        lng = farm.longitude;
      }
    }

    // Default to Kolar, Karnataka if invalid coordinates
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      lat = 13.1367;
      lng = 78.1291;
    }

    const weatherData = await fetchLiveWeatherFromApi(lat, lng);
    return NextResponse.json({
      success: true,
      data: weatherData.current_weather,
      rainfall_intelligence: weatherData.rainfall_intelligence,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Weather data unavailable" },
      { status: 500 }
    );
  }
}
