const http = require('http');

async function testEndpoint(name, path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const url = new URL(`http://localhost:3000${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`[PASS] ${name} (${res.statusCode}):`, json.success !== undefined ? `success=${json.success}` : 'status ok');
          resolve({ ok: res.statusCode < 400, data: json });
        } catch (e) {
          console.log(`[WARN] ${name} (${res.statusCode}): Output not JSON -`, data.slice(0, 100));
          resolve({ ok: res.statusCode < 400, data });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`[FAIL] ${name}:`, err.message);
      resolve({ ok: false, error: err.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing KrishiMitra Market Hub Endpoints ---');

  // 1. GET /api/markets/nearby
  await testEndpoint(
    'GET /api/markets/nearby?lat=15.426&lng=75.626',
    '/api/markets/nearby?lat=15.426&lng=75.626&radius=100'
  );

  // 2. GET /api/prices/latest
  await testEndpoint(
    'GET /api/prices/latest?district=Gadag&commodity=Onion',
    '/api/prices/latest?district=Gadag&commodity=Onion'
  );

  // 3. GET /api/prices/history
  await testEndpoint(
    'GET /api/prices/history?commodity=Onion',
    '/api/prices/history?commodity=Onion'
  );

  // 4. POST /api/markets/compare
  await testEndpoint(
    'POST /api/markets/compare',
    '/api/markets/compare',
    'POST',
    {
      latitude: 15.426,
      longitude: 75.626,
      commodity_id: '22222222-2222-2222-2222-222222222201',
      quantity: 20,
      cost_per_km: 1.85,
    }
  );

  // 5. POST /api/profit/calculate
  await testEndpoint(
    'POST /api/profit/calculate',
    '/api/profit/calculate',
    'POST',
    {
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
    }
  );

  // 6. GET /api/admin/market-sync
  await testEndpoint(
    'GET /api/admin/market-sync',
    '/api/admin/market-sync'
  );

  // 7. POST /api/location/resolve
  await testEndpoint(
    'POST /api/location/resolve',
    '/api/location/resolve',
    'POST',
    {
      latitude: 15.426,
      longitude: 75.626,
    }
  );

  console.log('--- All tests executed ---');
}

runTests();
