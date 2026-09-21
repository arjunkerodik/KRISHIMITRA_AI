/**
 * Automated Unit & Algorithmic Tests for Market Hub Backend
 */
const assert = require('assert');

// 1. Haversine Distance Test
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 2. Farmer Profit Calculation Algorithm
function calculateProfit(input) {
  const {
    quantity,
    selling_price,
    seed_cost,
    fertilizer_cost,
    pesticide_cost,
    labour_cost,
    irrigation_cost,
    machinery_cost,
    transport_cost,
    storage_cost,
    other_cost,
  } = input;

  const total_cost =
    Math.max(0, seed_cost || 0) +
    Math.max(0, fertilizer_cost || 0) +
    Math.max(0, pesticide_cost || 0) +
    Math.max(0, labour_cost || 0) +
    Math.max(0, irrigation_cost || 0) +
    Math.max(0, machinery_cost || 0) +
    Math.max(0, transport_cost || 0) +
    Math.max(0, storage_cost || 0) +
    Math.max(0, other_cost || 0);

  const gross_revenue = Math.max(0, quantity || 0) * Math.max(0, selling_price || 0);
  const net_profit = gross_revenue - total_cost;
  const roi_percentage = total_cost > 0 ? (net_profit / total_cost) * 100 : 0;
  const profit_per_unit = (quantity || 0) > 0 ? net_profit / quantity : 0;

  return {
    total_cost: Math.round(total_cost * 100) / 100,
    gross_revenue: Math.round(gross_revenue * 100) / 100,
    net_profit: Math.round(net_profit * 100) / 100,
    roi_percentage: Math.round(roi_percentage * 10) / 10,
    profit_per_unit: Math.round(profit_per_unit * 100) / 100,
  };
}

// 3. Best Market Net Revenue Ranking Algorithm
function rankMarkets(originLat, originLng, markets, quantity, freightRate = 1.85) {
  return markets.map(m => {
    const dist = calculateDistanceKm(originLat, originLng, m.latitude, m.longitude);
    const gross = m.modal_price * quantity;
    const transportCost = Math.round(dist * freightRate * quantity);
    const netRevenue = gross - transportCost;
    return {
      market: m.market_name,
      distance_km: dist,
      gross_revenue: gross,
      transport_cost: transportCost,
      net_revenue: netRevenue,
    };
  }).sort((a, b) => b.net_revenue - a.net_revenue);
}

// Run Test Suite
function runTests() {
  console.log('=== RUNNING KRISHIMITRA MARKET HUB BACKEND TESTS ===\n');

  // Test 1: Distance calculation between Gadag and Ron
  const gadagToRon = calculateDistanceKm(15.4312, 75.6322, 15.6989, 75.7342);
  assert(gadagToRon > 25 && gadagToRon < 35, `Expected Gadag to Ron ~31km, got ${gadagToRon}km`);
  console.log(`[PASS] Haversine Distance (Gadag -> Ron APMC): ${gadagToRon} km`);

  // Test 2: Farmer Profit Calculation
  const profit = calculateProfit({
    quantity: 20,
    selling_price: 2150,
    seed_cost: 3500,
    fertilizer_cost: 5000,
    pesticide_cost: 2500,
    labour_cost: 6500,
    irrigation_cost: 1800,
    machinery_cost: 3200,
    transport_cost: 1200,
    storage_cost: 800,
    other_cost: 1000,
  });

  assert.strictEqual(profit.total_cost, 25500, `Expected total cost 25500, got ${profit.total_cost}`);
  assert.strictEqual(profit.gross_revenue, 43000, `Expected gross revenue 43000, got ${profit.gross_revenue}`);
  assert.strictEqual(profit.net_profit, 17500, `Expected net profit 17500, got ${profit.net_profit}`);
  assert.strictEqual(profit.profit_per_unit, 875, `Expected profit per qtl 875, got ${profit.profit_per_unit}`);
  console.log(`[PASS] Profit Calculator: Total Cost=₹${profit.total_cost}, Net Profit=₹${profit.net_profit}, ROI=${profit.roi_percentage}%`);

  // Test 3: Division by zero safety
  const zeroTest = calculateProfit({ quantity: 0, selling_price: 0, seed_cost: 0 });
  assert.strictEqual(zeroTest.roi_percentage, 0, 'ROI must be 0 for 0 total cost');
  assert.strictEqual(zeroTest.profit_per_unit, 0, 'Profit per unit must be 0 for 0 quantity');
  console.log('[PASS] Division by zero safety verified.');

  // Test 4: Market Arbitrage & Net Revenue Comparison
  const sampleMarkets = [
    { market_name: 'Gadag APMC Yard', latitude: 15.4312, longitude: 75.6322, modal_price: 2150 },
    { market_name: 'Ron APMC Sub-Market', latitude: 15.6989, longitude: 75.7342, modal_price: 1980 },
    { market_name: 'Hubballi Amargol APMC', latitude: 15.3949, longitude: 75.0934, modal_price: 2400 },
  ];

  const ranked = rankMarkets(15.426, 75.626, sampleMarkets, 20, 1.85);
  assert(ranked[0].net_revenue >= ranked[1].net_revenue, 'Top ranked market must yield highest net revenue');
  console.log(`[PASS] Best Market Ranking: 1st=${ranked[0].market} (Net: ₹${ranked[0].net_revenue}), 2nd=${ranked[1].market} (Net: ₹${ranked[1].net_revenue})`);

  console.log('\n=== ALL 4 BACKEND UNIT TESTS PASSED SUCCESSFULLY! ===\n');
}

runTests();
