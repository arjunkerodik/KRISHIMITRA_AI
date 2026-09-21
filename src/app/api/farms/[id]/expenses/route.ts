import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_EXPENSES } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const expenses = IN_MEMORY_EXPENSES[id] || [];

    const totalAmount = expenses.reduce((sum, e) => sum + (Number(e.amount_inr) || 0), 0);

    return NextResponse.json({
      success: true,
      count: expenses.length,
      total_amount_inr: Math.round(totalAmount * 100) / 100,
      expenses,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/expenses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve expenses.", details: error.message },
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
      category,
      amount_inr,
      total_amount,
      amount: rawAmount,
      expense_date,
      description,
      item_name,
      receipt_url,
    } = body;

    const parsedAmount = parseFloat(amount_inr ?? total_amount ?? rawAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return NextResponse.json(
        { success: false, error: "Valid expense amount (>= 0) is required." },
        { status: 400 }
      );
    }

    if (!category || !category.trim()) {
      return NextResponse.json(
        { success: false, error: "Expense category is required." },
        { status: 400 }
      );
    }

    const newExpense = {
      id: `exp_${Date.now()}`,
      farm_id: id,
      crop_plot_id: crop_plot_id || null,
      category: category.trim(),
      amount_inr: Math.round(parsedAmount * 100) / 100,
      expense_date: expense_date || new Date().toISOString().split("T")[0],
      description: (description || item_name)?.trim() || null,
      receipt_url: receipt_url || null,
      created_at: new Date().toISOString(),
    };

    if (!IN_MEMORY_EXPENSES[id]) {
      IN_MEMORY_EXPENSES[id] = [];
    }
    IN_MEMORY_EXPENSES[id].unshift(newExpense);

    return NextResponse.json(
      {
        success: true,
        message: "Expense recorded in farm ledger.",
        expense: newExpense,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/expenses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record expense.", details: error.message },
      { status: 500 }
    );
  }
}
