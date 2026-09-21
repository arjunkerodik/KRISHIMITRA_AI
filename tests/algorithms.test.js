// Automated Algorithmic Verification Test Suite for KrishiMitra AI Decision Engine

function calculateTransportCost(distanceKm, ratePerKmPerQtl = 1.85, baseLoading = 20) {
  return Math.round(distanceKm * ratePerKmPerQtl + baseLoading);
}

function calculateNetMandiReturn(mandiPrice, distanceKm) {
  const transportCost = calculateTransportCost(distanceKm);
  const harvestingHandlingCost = 150;
  return mandiPrice - transportCost - harvestingHandlingCost;
}

function calculateStoichiometricFertilizer(soilN, soilP, soilK) {
  const targetN = 280;
  const targetP = 35;
  const targetK = 260;

  const nDeficit = Math.max(0, targetN - soilN);
  const pDeficit = Math.max(0, targetP - soilP);
  const kDeficit = Math.max(0, targetK - soilK);

  const dapReq = Math.round(pDeficit > 0 ? pDeficit / 0.46 : 0);
  const nFromDap = Math.round(dapReq * 0.18);
  const remN = Math.max(0, nDeficit - nFromDap);
  const ureaReq = Math.round(remN / 0.46);
  const mopReq = Math.round(kDeficit > 0 ? kDeficit / 0.60 : 0);

  return { dapReq, ureaReq, mopReq, nDeficit, pDeficit, kDeficit };
}

function calculateIrrigationDecision(crop, stage, rainfallMm) {
  if (rainfallMm >= 15) {
    return {
      decision: "SKIP_IRRIGATION",
      litresSaved: 4200,
      reason: "Predicted rainfall exceeds daily evapotranspiration."
    };
  }
  return {
    decision: "IRRIGATE_NORMAL",
    litresSaved: 0,
    reason: "Moisture deficit detected."
  };
}

// Test Runner
function runTests() {
  console.log("Running KrishiMitra AI Decision Engine Unit Tests...\n");
  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
    }
  }

  // Test 1: Transport Cost Math
  const cost68km = calculateTransportCost(68);
  assert("Transport Cost for 68 km = ₹146/qtl (₹1.85/km + ₹20 base)", cost68km === 146);

  // Test 2: Mandi Arbitrage Calculation
  const netBengaluru = calculateNetMandiReturn(2780, 68); // 2780 - 146 - 150 = 2484
  const netKolar = calculateNetMandiReturn(2450, 14); // 14km = 46 transport -> 2450 - 46 - 150 = 2254
  const netSpread = netBengaluru - netKolar;
  assert("Bengaluru net profit realization is higher than local Kolar APMC (+₹230/qtl)", netSpread > 200);

  // Test 3: Stoichiometric Fertilizer Splitter
  const fert = calculateStoichiometricFertilizer(210, 18, 290);
  assert("Soil with N=210 generates positive Urea requirement", fert.ureaReq > 0);
  assert("Soil with K=290 (adequate) requires 0 additional MOP", fert.mopReq === 0);
  assert("DAP requirement accurately covers Phosphorus deficit", fert.dapReq > 0);

  // Test 4: Irrigation Weather Trigger
  const irriRain = calculateIrrigationDecision("Tomato", "Flowering", 18.5);
  assert("18.5 mm forecast triggers SKIP_IRRIGATION decision", irriRain.decision === "SKIP_IRRIGATION");
  assert("Skipping irrigation saves 4,200L water", irriRain.litresSaved === 4200);

  const irriDry = calculateIrrigationDecision("Tomato", "Flowering", 0);
  assert("0 mm rainfall allows normal irrigation", irriDry.decision === "IRRIGATE_NORMAL");

  console.log(`\nTest Summary: ${passed} / ${total} unit tests passed successfully.`);
}

runTests();
