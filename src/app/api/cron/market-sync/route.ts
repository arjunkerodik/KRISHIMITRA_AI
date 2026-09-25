import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";
import { createClient } from "@supabase/supabase-js";

/**
 * Scheduled Cron Job for Automatic APMC Mandi Market Price Sync
 * Can be triggered via Vercel Cron, GitHub Actions, or internal scheduler
 * Periodic frequency: Daily at 05:00 IST / 17:00 IST when APMC registers publish official prices
 *
 * After syncing prices, triggers SMS alerts for farmers with sms_opt_in = true.
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

    // ── Trigger SMS alerts after sync ────────────────────────
    let smsQueued = 0;
    let smsErrors = 0;

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Query all farmers opted into SMS alerts
      const { data: optedInFarmers } = await supabase
        .from("farmer_profiles")
        .select("id, phone, preferred_language, primary_crops, district")
        .eq("sms_opt_in", true)
        .not("phone", "is", null);

      const farmers = optedInFarmers || [];
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://krishimitra.vercel.app";
      const isMorningReport = new Date().getHours() === 7; // 7 AM IST morning report

      // Fire SMS alerts asynchronously (non-blocking)
      const alertPromises = farmers.map(async (farmer: any) => {
        const primaryCrop = farmer.primary_crops?.[0];
        if (!primaryCrop) return;

        // In production: compare today's price vs yesterday's for this crop/district
        // Send morning report (7 AM) to all opted-in farmers
        if (!isMorningReport) return;

        try {
          await fetch(`${baseUrl}/api/sms/send-mandi-alert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cronSecret || ""}`,
            },
            body: JSON.stringify({
              phone: farmer.phone,
              farmerId: farmer.id,
              cropName: primaryCrop,
              mandiName: `${farmer.district || "Local"} APMC`,
              // TODO: Replace with real price lookup from syncResult
              pricePerQtl: 2500 + Math.floor(Math.random() * 500),
              changeRs: Math.floor(Math.random() * 200) - 100,
              language: farmer.preferred_language || "en",
            }),
          });
          smsQueued++;
        } catch {
          smsErrors++;
        }
      });

      await Promise.allSettled(alertPromises);
    } catch (smsErr: any) {
      console.warn("SMS alert trigger failed (non-critical):", smsErr.message);
    }

    return NextResponse.json({
      success: true,
      job: "AUTOMATIC_MARKET_PRICE_SYNC",
      status: "COMPLETED",
      details: {
        synced_count: syncResult.syncedCount,
        source: syncResult.source,
        timestamp: syncResult.timestamp,
        errors: syncResult.errors || [],
        sms_alerts_queued: smsQueued,
        sms_alert_errors: smsErrors,
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
