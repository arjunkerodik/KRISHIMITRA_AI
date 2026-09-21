import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_FARMS, IN_MEMORY_SOIL } from "@/lib/farmStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const soilRecords = IN_MEMORY_SOIL[id] || [];

    return NextResponse.json({
      success: true,
      count: soilRecords.length,
      soil_records: soilRecords,
    });
  } catch (error: any) {
    console.error("GET /api/farms/[id]/soil error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve soil records.", details: error.message },
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
      soil_type,
      test_date,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organic_carbon,
      electrical_conductivity,
      moisture,
      document_url,
      notes,
    } = body;

    if (!soil_type || !soil_type.trim()) {
      return NextResponse.json(
        { success: false, error: "Soil Type is required." },
        { status: 400 }
      );
    }

    const newRecord = {
      id: `soil_${Date.now()}`,
      farm_id: id,
      soil_type: soil_type.trim(),
      test_date: test_date || new Date().toISOString().split("T")[0],
      ph: ph !== undefined && ph !== "" ? parseFloat(ph) : null,
      nitrogen: nitrogen !== undefined && nitrogen !== "" ? parseFloat(nitrogen) : null,
      phosphorus: phosphorus !== undefined && phosphorus !== "" ? parseFloat(phosphorus) : null,
      potassium: potassium !== undefined && potassium !== "" ? parseFloat(potassium) : null,
      organic_carbon: organic_carbon !== undefined && organic_carbon !== "" ? parseFloat(organic_carbon) : null,
      electrical_conductivity: electrical_conductivity !== undefined && electrical_conductivity !== "" ? parseFloat(electrical_conductivity) : null,
      moisture: moisture !== undefined && moisture !== "" ? parseFloat(moisture) : null,
      document_url: document_url || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
    };

    if (!IN_MEMORY_SOIL[id]) {
      IN_MEMORY_SOIL[id] = [];
    }
    IN_MEMORY_SOIL[id].unshift(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Soil test record added successfully.",
        soil_record: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/farms/[id]/soil error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add soil record.", details: error.message },
      { status: 500 }
    );
  }
}
