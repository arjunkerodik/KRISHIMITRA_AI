import { NextRequest, NextResponse } from "next/server";
import { executeAgentTurn } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = "en", activeFarm, history = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call our agent engine with deterministic agricultural RAG fallback
    const result = await executeAgentTurn(message, language, activeFarm, history);

    return NextResponse.json({
      success: true,
      reply: result.reply,
      toolsUsed: result.toolsUsed,
      citations: result.citations,
      data: result.data
    });
  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}
