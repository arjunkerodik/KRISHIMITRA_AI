import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_EXPENSES, IN_MEMORY_SALES } from "@/lib/farmStore";
import { farmDecisionService } from "@/lib/services/farmDecisionService";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sales = IN_MEMORY_SALES[id] || [];
    const expenses = IN_MEMORY_EXPENSES[id] || [];

    const profitSummary = farmDecisionService.computeFarmProfit(expenses, sales);

    return NextResponse.json({
      success: true,
      count: sales.length,
      sales,
      profit_summary: profitSummary,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/sales error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve sales records.", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const farm = IN_MEMORY_FARMS.find((f) => f.id === id);

    if (!farm) {
      return NextResponse.json(
        { success: false, error: "Farm not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      crop_plot_id,
      crop_name,
      quantity,
      unit = "Quintal",
      selling_price_per_unit,
      price_per_unit,
      total_amount,
      buyer_name,
      market_name,
      sale_date,
      transport_cost = 0,
      other_costs = 0,
    } = body;

    const qty = parseFloat(quantity);
    const rawPrice = selling_price_per_unit ?? price_per_unit ?? (total_amount && qty ? total_amount / qty : undefined);
    const price = parseFloat(rawPrice);
    const transCost = parseFloat(transport_cost) || 0;
    const othCost = parseFloat(other_costs) || 0;

    const resolvedCropName = (crop_name || body.item_name || "Harvest Produce").trim();

    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid harvest quantity (> 0) is required." },
        { status: 400 }
      );
    }

    if (isNaN(price) || price < 0) {
      return NextResponse.json(
        { success: false, error: "Valid selling price per unit (>= 0) is required." },
        { status: 400 }
      );
    }

    const gross = qty * price;
    const net = gross - (transCost + othCost);

    const newSale = {
      id: `sale_${Date.now()}`,
      farm_id: id,
      crop_plot_id: crop_plot_id || null,
      crop_name: resolvedCropName,
      quantity: qty,
      unit,
      selling_price_per_unit: price,
      market_name: (buyer_name || market_name)?.trim() || "Local Mandi",
      sale_date: sale_date || new Date().toISOString().split("T")[0],
      transport_cost: transCost,
      other_costs: othCost,
      gross_revenue: Math.round(gross * 100) / 100,
      net_revenue: Math.round(net * 100) / 100,
      created_at: new Date().toISOString(),
    };

    if (!IN_MEMORY_SALES[id]) {
      IN_MEMORY_SALES[id] = [];
    }
    IN_MEMORY_SALES[id].unshift(newSale);

    const expenses = IN_MEMORY_EXPENSES[id] || [];
    const profitSummary = farmDecisionService.computeFarmProfit(expenses, IN_MEMORY_SALES[id]);

    return NextResponse.json(
      {
        success: true,
        message: "Harvest sale invoice saved and farm profit computed.",
        sale: newSale,
        profit_summary: profitSummary,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/sales error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record sale.", details: error.message },
      { status: 500 }
    );
  }
}
