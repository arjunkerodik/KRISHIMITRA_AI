import { NextRequest, NextResponse } from "next/server";
import { IN_MEMORY_CROPS, IN_MEMORY_STAGE_HISTORY } from "@/lib/farmStore";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    let foundFarmId: string | null = null;
    let foundCropIndex = -1;

    for (const [farmId, crops] of Object.entries(IN_MEMORY_CROPS)) {
      const idx = crops.findIndex((c: any) => c.id === id);
      if (idx !== -1) {
        foundFarmId = farmId;
        foundCropIndex = idx;
        break;
      }
    }

    if (!foundFarmId || foundCropIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Crop plot not found." },
        { status: 404 }
      );
    }

    const currentCrop = IN_MEMORY_CROPS[foundFarmId][foundCropIndex];
    const updated = {
      ...currentCrop,
      crop_name: body.crop_name?.trim() || currentCrop.crop_name,
      variety: body.variety?.trim() || currentCrop.variety,
      sowing_date: body.sowing_date || currentCrop.sowing_date,
      expected_harvest_date: body.expected_harvest_date !== undefined ? body.expected_harvest_date : currentCrop.expected_harvest_date,
      area_acres: body.area_acres !== undefined ? parseFloat(body.area_acres) : currentCrop.area_acres,
      farming_practice: body.farming_practice || currentCrop.farming_practice,
    };

    IN_MEMORY_CROPS[foundFarmId][foundCropIndex] = updated;

    return NextResponse.json({
      success: true,
      message: "Crop plot updated successfully.",
      crop_plot: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/crops/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update crop plot.", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    for (const [farmId, crops] of Object.entries(IN_MEMORY_CROPS)) {
      const idx = crops.findIndex((c: any) => c.id === id);
      if (idx !== -1) {
        crops.splice(idx, 1);
        delete IN_MEMORY_STAGE_HISTORY[id];
        return NextResponse.json({
          success: true,
          message: "Crop plot removed successfully.",
          deleted_crop_id: id,
        });
      }
    }

    return NextResponse.json(
      { success: false, error: "Crop plot not found." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("DELETE /api/crops/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete crop plot.", details: error.message },
      { status: 500 }
    );
  }
}
