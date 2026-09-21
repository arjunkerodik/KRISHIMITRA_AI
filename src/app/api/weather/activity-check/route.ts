import { NextRequest, NextResponse } from "next/server";
import { fetchLiveWeatherFromApi } from "@/lib/services/weatherService";
import { evaluateFarmActivity } from "@/lib/services/weatherAlertService";
import { FarmActivityType } from "@/lib/types/weather";
import { DEMO_FARMS } from "@/lib/demo-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmId = searchParams.get("farm_id") || "farm_001";
    const activityType = (searchParams.get("activity_type") || "spraying") as FarmActivityType;
    const plannedDate = searchParams.get("planned_date") || new Date().toISOString().split("T")[0];
    const plannedTime = searchParams.get("planned_time") || "10:00 AM";

    const farm = DEMO_FARMS.find((f) => f.id === farmId) || DEMO_FARMS[0];
    const weatherData = await fetchLiveWeatherFromApi(farm.latitude, farm.longitude);

    const result = evaluateFarmActivity(activityType, plannedDate, plannedTime, weatherData, farm);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Activity check failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const farmId = body.farm_id || "farm_001";
    const activityType = (body.activity_type || "spraying") as FarmActivityType;
    const plannedDate = body.planned_date || new Date().toISOString().split("T")[0];
    const plannedTime = body.planned_time || "10:00 AM";

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

    const weatherData = await fetchLiveWeatherFromApi(lat, lng);
    const result = evaluateFarmActivity(activityType, plannedDate, plannedTime, weatherData, farm);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Activity check failed" },
      { status: 500 }
    );
  }
}
