import { NextRequest, NextResponse } from "next/server";
import {
  getFarmerApplications,
  submitSchemeApplication,
} from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const applications = await getFarmerApplications(userId);
    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user_farmer_default";

    if (!body.scheme_id || !body.scheme_name) {
      return NextResponse.json(
        { success: false, error: "Scheme ID and Scheme Name are required" },
        { status: 400 }
      );
    }

    const newApp = await submitSchemeApplication(userId, {
      scheme_id: body.scheme_id,
      scheme_name: body.scheme_name,
      farm_id: body.farm_id,
      remarks: body.remarks,
      documents: body.documents,
    });

    return NextResponse.json({ success: true, data: newApp }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
