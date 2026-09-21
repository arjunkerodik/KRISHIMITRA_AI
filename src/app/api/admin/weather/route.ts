import { NextRequest, NextResponse } from "next/server";
import { getAdminWeatherTelemetry, flushWeatherCache } from "@/lib/services/weatherService";
import {
  getAlertRulesList,
  updateAlertRule,
  getDeliveryLogsList,
} from "@/lib/services/weatherAlertService";

export async function GET(req: NextRequest) {
  try {
    const rules = getAlertRulesList();
    const logs = getDeliveryLogsList();
    const stats = getAdminWeatherTelemetry(rules.length);

    stats.alert_rules = rules;
    stats.delivery_logs = logs;

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin weather telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === "flush_cache") {
      flushWeatherCache();
      return NextResponse.json({
        success: true,
        message: "Weather in-memory cache flushed successfully.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Admin weather action failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { rule_id, updates } = body;

    if (!rule_id || !updates) {
      return NextResponse.json(
        { success: false, error: "rule_id and updates are required" },
        { status: 400 }
      );
    }

    const updatedRule = updateAlertRule(rule_id, updates);
    if (!updatedRule) {
      return NextResponse.json({ success: false, error: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Weather alert rule updated successfully",
      data: updatedRule,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update alert rule" },
      { status: 500 }
    );
  }
}
