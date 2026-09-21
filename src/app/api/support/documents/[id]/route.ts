import { NextRequest, NextResponse } from "next/server";
import {
  renameFarmerDocument,
  deleteFarmerDocument,
  getFarmerDocuments,
} from "@/lib/services/supportService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const docs = await getFarmerDocuments(userId);
    const doc = docs.find((d) => d.id === id);

    if (!doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc });
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
    const userId = body.userId || "user_farmer_default";

    if (!body.newName) {
      return NextResponse.json({ success: false, error: "newName is required" }, { status: 400 });
    }

    const updated = await renameFarmerDocument(userId, id, body.newName);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";

    const deleted = await deleteFarmerDocument(userId, id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
