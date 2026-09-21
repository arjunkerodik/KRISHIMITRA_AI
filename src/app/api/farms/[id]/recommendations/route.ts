import { NextRequest, NextResponse } from "next/server";
import {
  IN_MEMORY_FARMS,
  IN_MEMORY_LOCATIONS,
  IN_MEMORY_SOIL,
  IN_MEMORY_WATER,
  IN_MEMORY_CROPS,
  IN_MEMORY_EXPENSES,
  IN_MEMORY_PESTS,
} from "@/lib/farmStore";
import { farmDecisionService } from "@/lib/services/farmDecisionService";
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
    const soil = IN_MEMORY_SOIL[id]?.[0];
    const water = IN_MEMORY_WATER[id];
    const pests = IN_MEMORY_PESTS[id] || [];
    const expenses = IN_MEMORY_EXPENSES[id] || [];

    // Optional nearby market comparison
    let nearbyMarkets: any[] = [];
    if (loc && loc.latitude && loc.longitude) {
      nearbyMarkets = await marketDataService.compareMarkets({
        latitude: loc.latitude,
        longitude: loc.longitude,
        commodity_id: "22222222-2222-2222-2222-222222222201",
        quantity: 20,
      });
    }

    // Weather fallback telemetry
    const weather = {
      rainfall_mm: 0,
      humidity_pct: 68,
      temp_c: 28,
    };

    const recommendations = farmDecisionService.generateFarmRecommendations({
      farm,
      soil,
      water,
      crops,
      pests,
      weather,
      expenses,
      nearbyMarkets,
    });

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/recommendations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations.", details: error.message },
      { status: 500 }
    );
  }
}
