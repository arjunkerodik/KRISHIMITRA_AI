import { NextRequest, NextResponse } from "next/server";
import { DEMO_SOIL_REPORT } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { n = 210, p = 18, k = 290, ph = 6.8, oc = 0.52, crop = "Tomato" } = body;

    // Stoichiometric NPK deficit computation for standard Tomato yield 28t/ac
    const targetN = 280;
    const targetP = 35;
    const targetK = 260;

    const nDeficit = Math.max(0, targetN - n);
    const pDeficit = Math.max(0, targetP - p);
    const kDeficit = Math.max(0, targetK - k);

    const dapReq = Math.round(pDeficit > 0 ? pDeficit / 0.46 : 0);
    const nFromDap = Math.round(dapReq * 0.18);
    const remN = Math.max(0, nDeficit - nFromDap);
    const ureaReq = Math.round(remN / 0.46);
    const mopReq = Math.round(kDeficit > 0 ? kDeficit / 0.60 : 0);

    return NextResponse.json({
      success: true,
      soilHealthScore: 78,
      fertilityClass: "Medium Fertile (Low N, Moderate P, Adequate K)",
      deficits: {
        nitrogenKgHa: nDeficit,
        phosphorusKgHa: pDeficit,
        potashKgHa: kDeficit
      },
      prescriptions: [
        { fertilizer: "Neem Coated Urea (46% N)", dosagePerAcreKg: ureaReq, split: "30% Basal + 35% at 30d + 35% at 50d" },
        { fertilizer: "Di-Ammonium Phosphate (DAP 18:46:0)", dosagePerAcreKg: dapReq, split: "100% Basal at transplanting" },
        { fertilizer: "Muriate of Potash (MOP 60% K2O)", dosagePerAcreKg: mopReq, split: "50% Basal + 50% at flowering" },
        { fertilizer: "Farm Yard Manure (FYM) / Vermicompost", dosagePerAcreKg: 2000, split: "Basal land preparation" }
      ]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
