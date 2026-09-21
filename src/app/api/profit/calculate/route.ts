import { NextRequest, NextResponse } from "next/server";
import { marketDataService } from "@/lib/services/marketDataService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const quantity = parseFloat(body.quantity);
    const sellingPrice = parseFloat(body.selling_price);

    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid harvest quantity (> 0) is required.",
        },
        { status: 400 }
      );
    }

    if (isNaN(sellingPrice) || sellingPrice < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid market selling price (>= 0) is required.",
        },
        { status: 400 }
      );
    }

    const inputData = {
      quantity,
      selling_price: sellingPrice,
      seed_cost: Math.max(0, parseFloat(body.seed_cost) || 0),
      fertilizer_cost: Math.max(0, parseFloat(body.fertilizer_cost) || 0),
      pesticide_cost: Math.max(0, parseFloat(body.pesticide_cost) || 0),
      labour_cost: Math.max(0, parseFloat(body.labour_cost) || 0),
      irrigation_cost: Math.max(0, parseFloat(body.irrigation_cost) || 0),
      machinery_cost: Math.max(0, parseFloat(body.machinery_cost) || 0),
      transport_cost: Math.max(0, parseFloat(body.transport_cost) || 0),
      storage_cost: Math.max(0, parseFloat(body.storage_cost) || 0),
      other_cost: Math.max(0, parseFloat(body.other_cost) || 0),
    };

    const calculation = marketDataService.calculateProfit(inputData);

    return NextResponse.json({
      success: true,
      inputs: inputData,
      breakdown: {
        total_cost: calculation.total_cost,
        gross_revenue: calculation.gross_revenue,
        net_profit: calculation.net_profit,
        roi_percentage: calculation.roi_percentage,
        profit_per_unit: calculation.profit_per_unit,
        is_profitable: calculation.net_profit > 0,
      },
      currency: "₹ (INR)",
      unit: "Quintal",
    });
  } catch (error: any) {
    console.error("POST /api/profit/calculate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate farm profit and ROI.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
