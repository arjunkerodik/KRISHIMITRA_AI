import { NextRequest, NextResponse } from "next/server";
import {
  VERIFIED_SERVICE_PROVIDERS,
  calculateHaversineDistanceKm,
  reverseGeocodeCoords,
} from "@/lib/services/governmentDataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get("lat")) || 13.1367;
    const lng = Number(searchParams.get("lng")) || 78.1292;
    const category = searchParams.get("category");
    const district = searchParams.get("district");
    const maxDistanceKm = Number(searchParams.get("maxDistanceKm")) || 100;

    // Reverse geocode to identify user location context
    const locationInfo = await reverseGeocodeCoords(lat, lng);

    // Calculate distance and filter verified providers
    const nearbyProviders = VERIFIED_SERVICE_PROVIDERS.filter((p) => p.verification_status === "VERIFIED")
      .map((provider) => {
        const distance = calculateHaversineDistanceKm(lat, lng, provider.latitude, provider.longitude);
        return {
          ...provider,
          distanceKm: distance,
        };
      })
      .filter((p) => {
        if (p.distanceKm > maxDistanceKm) return false;
        if (district && district !== "All" && p.district.toLowerCase() !== district.toLowerCase()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      userLocation: locationInfo,
      count: nearbyProviders.length,
      data: nearbyProviders,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
