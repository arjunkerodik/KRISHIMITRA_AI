import { NextRequest, NextResponse } from "next/server";
import { submitServiceFeedback } from "@/lib/services/supportService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user_farmer_default";

    if (!body.request_id || !body.provider_id || !body.rating || !body.feedback) {
      return NextResponse.json(
        { success: false, error: "request_id, provider_id, rating, and feedback are required" },
        { status: 400 }
      );
    }

    const rating = Math.min(5, Math.max(1, Number(body.rating)));

    const fb = await submitServiceFeedback(userId, {
      request_id: body.request_id,
      provider_id: body.provider_id,
      rating,
      feedback: body.feedback,
    });

    if (!fb) {
      return NextResponse.json(
        { success: false, error: "Invalid request or request does not belong to user" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: fb }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
