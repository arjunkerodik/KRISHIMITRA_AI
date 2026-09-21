import { NextRequest, NextResponse } from "next/server";
import { analyzeLeafImage } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, crop = "Tomato" } = body;

    const diagnosis = await analyzeLeafImage(imageBase64 || "", crop);

    return NextResponse.json({
      success: true,
      diagnosis
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
