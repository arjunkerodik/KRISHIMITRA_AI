import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

// Map of Karnataka district centroids
const KARNATAKA_DISTRICTS: { name: string; lat: number; lng: number }[] = [
  { name: "Gadag", lat: 15.426, lng: 75.626 },
  { name: "Dharwad", lat: 15.4589, lng: 75.0078 },
  { name: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { name: "Bagalkote", lat: 16.1818, lng: 75.6961 },
  { name: "Vijayapura", lat: 16.8302, lng: 75.71 },
  { name: "Koppal", lat: 15.3456, lng: 76.1554 },
  { name: "Ballari", lat: 15.1394, lng: 76.9214 },
  { name: "Haveri", lat: 14.7972, lng: 75.3995 },
  { name: "Shivamogga", lat: 13.9299, lng: 75.5681 },
  { name: "Davanagere", lat: 14.4644, lng: 75.9218 },
  { name: "Chitradurga", lat: 14.2251, lng: 76.398 },
  { name: "Tumakuru", lat: 13.3379, lng: 77.101 },
  { name: "Kolar", lat: 13.1367, lng: 78.134 },
  { name: "Chikkaballapura", lat: 13.4325, lng: 77.7275 },
  { name: "Bengaluru Urban", lat: 12.9716, lng: 77.5946 },
  { name: "Bengaluru Rural", lat: 13.2847, lng: 77.545 },
  { name: "Ramanagara", lat: 12.7159, lng: 77.2814 },
  { name: "Mandya", lat: 12.5218, lng: 76.8951 },
  { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { name: "Chamarajanagara", lat: 11.9261, lng: 76.9437 },
  { name: "Hassan", lat: 13.0033, lng: 76.1004 },
  { name: "Kodagu", lat: 12.3375, lng: 75.8069 },
  { name: "Dakshina Kannada", lat: 12.8703, lng: 74.8806 },
  { name: "Udupi", lat: 13.3409, lng: 74.7421 },
  { name: "Uttara Kannada", lat: 14.795, lng: 74.6869 },
  { name: "Raichur", lat: 16.2076, lng: 77.3463 },
  { name: "Kalaburagi", lat: 17.3297, lng: 76.8343 },
  { name: "Yadgir", lat: 16.7701, lng: 77.1376 },
  { name: "Bidar", lat: 17.9104, lng: 77.5199 },
  { name: "Chikkamagaluru", lat: 13.3161, lng: 75.772 },
];

function haversineDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: "Latitude and longitude are required." },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: "Invalid coordinate numbers." },
        { status: 400 }
      );
    }

    // Find closest Karnataka district
    let closestDistrict = KARNATAKA_DISTRICTS[0];
    let minDistance = Infinity;

    for (const dist of KARNATAKA_DISTRICTS) {
      const d = haversineDist(lat, lng, dist.lat, dist.lng);
      if (d < minDistance) {
        minDistance = d;
        closestDistrict = dist;
      }
    }

    // Find nearby APMCs
    const nearbyMarkets = await marketDataService.getNearbyMarkets(lat, lng, 100);

    return NextResponse.json({
      success: true,
      resolved_location: {
        state: "Karnataka",
        district: closestDistrict.name,
        distance_to_district_center_km: minDistance,
        nearest_market: nearbyMarkets.length > 0 ? nearbyMarkets[0].market_name : "Gadag APMC Yard",
        nearest_market_distance_km: nearbyMarkets.length > 0 ? nearbyMarkets[0].distance_km : 0,
      },
      nearby_markets_count: nearbyMarkets.length,
    });
  } catch (error: any) {
    console.error("POST /api/location/resolve error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to resolve location.", details: error.message },
      { status: 500 }
    );
  }
}
