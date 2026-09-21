import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

/**
 * Scheduled Cron Job for Automatic APMC Mandi Market Price Sync
 * Can be triggered via Vercel Cron, GitHub Actions, or internal scheduler
 * Periodic frequency: Daily at 05:00 IST / 17:00 IST when APMC registers publish official prices
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_SECRET_KEY;

    // Verify cron authorization if secret is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const urlSecret = new URL(req.url).searchParams.get("key");
      if (urlSecret !== cronSecret) {
        return NextResponse.json(
          { success: false, error: "Unauthorized cron trigger." },
          { status: 401 }
        );
      }
    }

    const syncResult = await marketDataService.syncMarketPrices();

    return NextResponse.json({
      success: true,
      job: "AUTOMATIC_MARKET_PRICE_SYNC",
      status: "COMPLETED",
      details: {
        synced_count: syncResult.syncedCount,
        source: syncResult.source,
        timestamp: syncResult.timestamp,
        errors: syncResult.errors || [],
      },
    });
  } catch (error: any) {
    console.error("CRON /api/cron/market-sync error:", error);
    return NextResponse.json(
      {
        success: false,
        job: "AUTOMATIC_MARKET_PRICE_SYNC",
        status: "FAILED",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
