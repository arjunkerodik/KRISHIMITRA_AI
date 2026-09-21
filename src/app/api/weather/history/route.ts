import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi } from "@/lib/services/weatherService";
import { evaluateWeatherConditions } from "@/lib/services/weatherAlertService";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farm_id");
    const severity = searchParams.get("severity");
    const category = searchParams.get("category");
    const userId = searchParams.get("userId") || "demo_farmer_01";

    const farm = DEMO_FARMS.find((f) => f.id === farmId) || DEMO_FARMS[0];
    const weatherData = await fetchLiveWeatherFromApi(farm.latitude, farm.longitude);
    const currentAlerts = evaluateWeatherConditions(weatherData, farm, userId);

    let filtered = currentAlerts;
    if (severity && severity !== "ALL") {
      filtered = filtered.filter((a) => a.severity === severity);
    }
    if (category && category !== "ALL") {
      filtered = filtered.filter((a) => a.category === category);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch alert history" },
      { status: 500 }
    );
  }
}
