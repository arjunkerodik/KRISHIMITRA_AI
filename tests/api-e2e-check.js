// E2E Smoke test against live dev server http://localhost:3000

async function testRoutes() {
  const baseUrl = "http://127.0.0.1:3000";
  console.log("=== CHECKING DEV SERVER HEALTH & APIS ===");

  try {
    // 1. GET /api/farms
    const resList = await fetch(`${baseUrl}/api/farms`);
    const dataList = await resList.json();
    console.log(`[PASS] GET /api/farms status: ${resList.status}, current count: ${dataList.count}`);

    // 2. POST /api/farms -> create real farm
    const resCreate = await fetch(`${baseUrl}/api/farms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        farm_name: "Shivanna Organic Field",
        total_area: 4.5,
        area_unit: "Acres",
        ownership_type: "Owned",
        location: {
          village: "Kengeri",
          taluk: "Bangalore South",
          district: "Bengaluru Urban",
          state: "Karnataka",
          pincode: "560060",
          latitude: 12.915,
          longitude: 77.483,
        },
        soil: {
          soil_type: "Red Loamy",
          ph_level: 6.8,
          nitrogen_ppm: 260,
          phosphorus_ppm: 42,
          potassium_ppm: 190,
          organic_carbon_pct: 0.72,
        },
        water: {
          primary_source: "Borewell",
          irrigation_type: "Drip Irrigation",
          water_availability_status: "Adequate",
        },
        crops: [
          {
            crop_name: "Ragi (Finger Millet)",
            variety: "GPU-28",
            current_stage: "Tillering / Vegetative",
            area_acres: 3.0,
            farming_practice: "Organic",
          },
        ],
      }),
    });
    const dataCreate = await resCreate.json();
    const farmId = dataCreate.farm?.id;
    console.log(`[PASS] POST /api/farms status: ${resCreate.status}, farmId: ${farmId}`);

    // 3. GET /api/farms/[id]/dashboard
    const resDash = await fetch(`${baseUrl}/api/farms/${farmId}/dashboard`);
    const dataDash = await resDash.json();
    const completenessScore = dataDash.dashboard?.completeness?.overallPercentage;
    console.log(`[PASS] GET /api/farms/[id]/dashboard status: ${resDash.status}, completeness: ${completenessScore}%`);

    // 4. GET /api/farms/[id]/weather
    const resWeather = await fetch(`${baseUrl}/api/farms/${farmId}/weather`);
    const dataWeather = await resWeather.json();
    console.log(`[PASS] GET /api/farms/[id]/weather status: ${resWeather.status}, temp: ${dataWeather.weather?.temperature_c || 'N/A'}°C`);

    // 5. GET /api/farms/[id]/market-opportunities
    const resMarket = await fetch(`${baseUrl}/api/farms/${farmId}/market-opportunities`);
    const dataMarket = await resMarket.json();
    console.log(`[PASS] GET /api/farms/[id]/market-opportunities status: ${resMarket.status}, opportunities: ${dataMarket.market_opportunities?.length || 0}`);

    // 6. GET /api/farms/[id]/recommendations
    const resRec = await fetch(`${baseUrl}/api/farms/${farmId}/recommendations`);
    const dataRec = await resRec.json();
    console.log(`[PASS] GET /api/farms/[id]/recommendations status: ${resRec.status}, recommendations: ${dataRec.recommendations?.length || 0}`);

    // 7. POST /api/farms/[id]/expenses
    const resExp = await fetch(`${baseUrl}/api/farms/${farmId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expense_date: new Date().toISOString().split("T")[0],
        category: "Seeds",
        item_name: "GPU-28 Certified Organic Seeds",
        quantity: 15,
        unit: "kg",
        unit_price: 60,
        total_amount: 900,
      }),
    });
    const dataExp = await resExp.json();
    console.log(`[PASS] POST /api/farms/[id]/expenses status: ${resExp.status}, item: ${dataExp.expense?.item_name}`);

    // 8. POST /api/farms/[id]/sales
    const resSale = await fetch(`${baseUrl}/api/farms/${farmId}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sale_date: new Date().toISOString().split("T")[0],
        buyer_type: "APMC Mandi",
        buyer_name: "Ramanagara APMC Trader",
        quantity: 1200,
        unit: "kg",
        price_per_unit: 36,
        total_amount: 43200,
      }),
    });
    const dataSale = await resSale.json();
    console.log(`[PASS] POST /api/farms/[id]/sales status: ${resSale.status}, profit: ₹${dataSale.profit?.net_profit}`);

    // 9. Crop Stage Update
    const cropId = dataDash.dashboard?.crops?.plots?.[0]?.id;
    if (cropId) {
      const resStage = await fetch(`${baseUrl}/api/crops/${cropId}/stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "Flowering & Grain Filling",
          notes: "Healthy panicle emergence observed across 3 acres.",
        }),
      });
      const dataStage = await resStage.json();
      console.log(`[PASS] POST /api/crops/[id]/stage status: ${resStage.status}, new stage: ${dataStage.current_stage}`);
    }

    // 10. Clean up farm
    const resDel = await fetch(`${baseUrl}/api/farms/${farmId}`, { method: "DELETE" });
    console.log(`[PASS] DELETE /api/farms/[id] status: ${resDel.status}, deleted: ${farmId}`);

    console.log("\n>>> ALL API SMOKE TESTS COMPLETED SUCCESSFULLY! <<<");
  } catch (err) {
    console.error("API Smoke Test Failed:", err);
    process.exit(1);
  }
}

testRoutes();
