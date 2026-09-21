import { NextRequest, NextResponse } from "next/server";
import {
  getAdminSupportStats,
  adminVerifyProvider,
  adminCreateOfficialNotice,
  adminCreateImportantDate,
  adminUpdateServiceRequestStatus,
} from "@/lib/services/supportService";

export async function GET(req: NextRequest) {
  try {
    const stats = await getAdminSupportStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminId = body.adminId || "admin_user_01";
    const action = body.action;

    if (action === "create_notice") {
      const notice = await adminCreateOfficialNotice(adminId, body.notice);
      return NextResponse.json({ success: true, data: notice }, { status: 201 });
    }

    if (action === "create_date") {
      const dateObj = await adminCreateImportantDate(adminId, body.date);
      return NextResponse.json({ success: true, data: dateObj }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const adminId = body.adminId || "admin_user_01";
    const action = body.action;

    if (action === "update_request_status" || body.request_id) {
      if (!body.request_id || !body.status) {
        return NextResponse.json(
          { success: false, error: "request_id and status are required" },
          { status: 400 }
        );
      }
      const updated = await adminUpdateServiceRequestStatus(
        adminId,
        body.request_id,
        body.status,
        body.remarks
      );
      if (!updated) {
        return NextResponse.json({ success: false, error: "Service request not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (!body.provider_id || !body.status) {
      return NextResponse.json(
        { success: false, error: "provider_id and status are required" },
        { status: 400 }
      );
    }

    const updated = await adminVerifyProvider(adminId, body.provider_id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
