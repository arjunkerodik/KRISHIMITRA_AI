import { NextRequest, NextResponse } from "next/server";
import { getFarmerDocuments, uploadFarmerDocument } from "@/lib/services/supportService";
import { DocumentType } from "@/lib/types/support";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_farmer_default";
    const type = (searchParams.get("type") as DocumentType) || undefined;
    const farmId = searchParams.get("farmId") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "date";

    const docs = await getFarmerDocuments(userId, { type, farmId, search, sortBy });
    return NextResponse.json({ success: true, data: docs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user_farmer_default";

    if (!body.document_name || !body.document_type) {
      return NextResponse.json(
        { success: false, error: "Document name and type are required" },
        { status: 400 }
      );
    }

    // Validate MIME types and Size
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const mime = body.mime_type || "application/pdf";
    if (!allowedMimes.includes(mime)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Supported: PDF, JPG, PNG, WEBP, DOCX" },
        { status: 400 }
      );
    }

    const size = Number(body.file_size) || 1024 * 50; // default 50KB if simulation
    if (size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 15MB limit" },
        { status: 400 }
      );
    }

    const filePath = body.file_path || `farmer-documents/${userId}/${Date.now()}_${body.document_name.replace(/\s+/g, "_")}`;

    const newDoc = await uploadFarmerDocument(userId, {
      farm_id: body.farm_id,
      document_type: body.document_type,
      document_name: body.document_name,
      file_path: filePath,
      file_size: size,
      mime_type: mime,
    });

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}
