import { NextRequest, NextResponse } from "next/server";
import {
  getFarmerServiceRequests,
  updateServiceRequestStatus,
} from "@/lib/services/supportService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const reqs = await getFarmerServiceRequests(userId);
    const item = reqs.find((r) => r.id === id);

    if (!item) {
      return NextResponse.json({ success: false, error: "Service request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const actorId = body.actorId || "user_support_desk";
    const actorRole = body.actorRole || "admin";

    if (!body.status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updated = await updateServiceRequestStatus(
      actorId,
      actorRole,
      id,
      body.status,
      body.remarks
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Service request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
