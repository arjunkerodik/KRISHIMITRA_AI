/**
 * Automated Test Suite for KrishiMitra "My Farm" Backend & Decision Engine
 */
const assert = require('assert');

// Farm Decision Engine Simulation
function calculateDataCompleteness(data) {
  const hasBasic = Boolean(data.farm?.farm_name && data.farm?.total_area > 0 && data.farm?.district);
  const hasLoc = Boolean(data.location?.latitude && data.location?.longitude);
  const hasSoil = Boolean(data.soil?.soil_type && (data.soil?.ph || data.soil?.nitrogen || data.soil?.document_url));
  const hasWater = Boolean(data.water?.water_source && data.water?.irrigation_method);
  const hasCrops = Boolean(Array.isArray(data.crops) && data.crops.length > 0);
  const hasExpenses = Boolean(
    (Array.isArray(data.expenses) && data.expenses.length > 0) ||
    (Array.isArray(data.activities) && data.activities.length > 0)
  );

  let score = 0;
  if (hasBasic) score += 20;
  if (hasLoc) score += 15;
  if (hasSoil) score += 15;
  if (hasWater) score += 15;
  if (hasCrops) score += 20;
  if (hasExpenses) score += 15;

  return {
    overallPercentage: Math.min(100, score),
    sections: {
      basicDetails: hasBasic,
      location: hasLoc,
      soil: hasSoil,
      water: hasWater,
      crops: hasCrops,
      expenses: hasExpenses,
    },
  };
}

function computeFarmProfit(expenses = [], sales = []) {
  if (expenses.length === 0 && sales.length === 0) {
    return {
      hasSufficientData: false,
      netProfit: 0,
      roiPercentage: 0,
      message: "Profit cannot be calculated yet. Add your expenses and sales.",
    };
  }

  let totalProdExpenses = 0;
  for (const exp of expenses) {
    totalProdExpenses += Math.max(0, Number(exp.amount_inr) || 0);
  }

  let totalSalesRevenue = 0;
  let totalLogistics = 0;
  for (const sale of sales) {
    const gross = Math.max(0, Number(sale.gross_revenue) || (Number(sale.quantity) * Number(sale.selling_price_per_unit)) || 0);
    const transport = Math.max(0, Number(sale.transport_cost) || 0);
    const other = Math.max(0, Number(sale.other_costs) || 0);
    totalSalesRevenue += gross;
    totalLogistics += (transport + other);
  }

  const totalCost = totalProdExpenses + totalLogistics;
  const netProfit = totalSalesRevenue - totalCost;
  const roiPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    hasSufficientData: true,
    totalSalesRevenue,
    totalCost,
    netProfit,
    roiPercentage: Math.round(roiPercentage * 10) / 10,
  };
}

function runTests() {
  console.log('=== RUNNING "MY FARM" BACKEND & DECISION ENGINE TESTS ===\n');

  // Test 1: Empty state data completeness = 0%
  const emptyComp = calculateDataCompleteness({});
  assert.strictEqual(emptyComp.overallPercentage, 0, 'Empty farm data must have 0% completeness');
  assert.strictEqual(emptyComp.sections.basicDetails, false);
  console.log('[PASS] Empty initial farm state correctly evaluates to 0% completeness');

  // Test 2: Partial Farm Data Completeness
  const partialComp = calculateDataCompleteness({
    farm: { farm_name: 'Holur East Plot', total_area: 4.5, district: 'Gadag' },
    location: { latitude: 15.426, longitude: 75.626 },
    crops: [{ crop_name: 'Onion', area_acres: 4.0 }],
  });
  assert.strictEqual(partialComp.overallPercentage, 55, `Expected 55%, got ${partialComp.overallPercentage}%`);
  console.log(`[PASS] Partial Farm Completeness: ${partialComp.overallPercentage}% (Basic: 20% + Loc: 15% + Crop: 20%)`);

  // Test 3: Complete Farm Profile = 100%
  const fullComp = calculateDataCompleteness({
    farm: { farm_name: 'Holur East Plot', total_area: 4.5, district: 'Gadag' },
    location: { latitude: 15.426, longitude: 75.626 },
    soil: { soil_type: 'Red Sandy Loam', ph: 6.8 },
    water: { water_source: 'Borewell', irrigation_method: 'Drip' },
    crops: [{ crop_name: 'Onion', area_acres: 4.0 }],
    expenses: [{ category: 'Seeds', amount_inr: 3500 }],
  });
  assert.strictEqual(fullComp.overallPercentage, 100, `Expected 100%, got ${fullComp.overallPercentage}%`);
  console.log('[PASS] Full Farm Profile correctly reaches 100% completeness');

  // Test 4: Profit calculation with zero data returns hasSufficientData: false
  const emptyProfit = computeFarmProfit([], []);
  assert.strictEqual(emptyProfit.hasSufficientData, false, 'Empty ledger must flag hasSufficientData = false');
  console.log('[PASS] Zero-expense/zero-sales ledger correctly reports: "' + emptyProfit.message + '"');

  // Test 5: Realized Profit Calculation
  const sampleExpenses = [
    { category: 'Seeds', amount_inr: 3500 },
    { category: 'Fertilizer', amount_inr: 5000 },
    { category: 'Labour', amount_inr: 6500 },
  ];
  const sampleSales = [
    { crop_name: 'Onion', quantity: 20, selling_price_per_unit: 2150, gross_revenue: 43000, transport_cost: 1000 },
  ];
  const profit = computeFarmProfit(sampleExpenses, sampleSales);
  assert.strictEqual(profit.hasSufficientData, true);
  assert.strictEqual(profit.totalSalesRevenue, 43000);
  assert.strictEqual(profit.totalCost, 16000); // 15000 prod + 1000 transport
  assert.strictEqual(profit.netProfit, 27000); // 43000 - 16000
  console.log(`[PASS] Profit calculation: Revenue=₹${profit.totalSalesRevenue}, Cost=₹${profit.totalCost}, Net Profit=₹${profit.netProfit}, ROI=${profit.roiPercentage}%`);

  console.log('\n=== ALL "MY FARM" UNIT & ALGORITHMIC TESTS PASSED! ===\n');
}

runTests();
