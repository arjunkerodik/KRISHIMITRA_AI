import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_LOCATIONS } from "@/lib/farmStore";

export async function POST(
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

    const body = await req.json();
    const { latitude, longitude, address } = body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { success: false, error: "Valid latitude (-90 to 90) and longitude (-180 to 180) are required." },
        { status: 400 }
      );
    }

    const locRecord = {
      id: `loc_${Date.now()}`,
      farm_id: id,
      latitude: lat,
      longitude: lng,
      reverse_geocoded_address: address || `${farm.taluk}, ${farm.district}, Karnataka`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    IN_MEMORY_LOCATIONS[id] = locRecord;

    return NextResponse.json({
      success: true,
      message: "Farm location saved securely.",
      location: locRecord,
    });
  } catch (error: any) {
    console.error("POST /api/farms/[id]/location error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update location.", details: error.message },
      { status: 500 }
    );
  }
}
