import { NextRequest, NextResponse } from "next/server";
import {
  getFarmerServiceRequests,
  submitServiceRequest,
} from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const requests = await getFarmerServiceRequests(userId);
    return NextResponse.json({ success: true, data: requests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch service requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user_farmer_default";

    if (!body.service_id || !body.service_name || !body.location || !body.requested_date) {
      return NextResponse.json(
        { success: false, error: "Service, location, and requested date are required" },
        { status: 400 }
      );
    }

    const newReq = await submitServiceRequest(userId, {
      farm_id: body.farm_id,
      farm_name: body.farm_name,
      service_id: body.service_id,
      service_name: body.service_name,
      provider_id: body.provider_id,
      provider_name: body.provider_name,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude,
      requested_date: body.requested_date,
      quantity: body.quantity,
      description: body.description || "Agricultural service booking",
      priority: body.priority || "NORMAL",
    });

    return NextResponse.json({ success: true, data: newReq }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit service request" },
      { status: 500 }
    );
  }
}
