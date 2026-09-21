const http = require('http');

const routes = [
  '/',
  '/dashboard',
  '/agricare',
  '/farmtalk',
  '/farm-to-market',
  '/support',
  '/resources',
  '/alerts',
  '/farm',
  '/map',
  '/schemes',
  '/schemes/pm-kisan',
  '/market',
  '/market/recommendation',
  '/marketplace',
  '/offers',
  '/orders',
  '/credits',
  '/rewards',
  '/transparency',
  '/admin',
  '/machinery',
  '/labour',
  '/soil',
  '/crops/recommendation',
  '/crop-calendar',
  '/voice-assistant',
  '/digital-twin',
  '/satellite',
  '/weather',
  '/disease/analyze',
  '/finance',
  '/api/market/prices',
  '/api/ai/farm-plan'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ route, status: 0, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing KrishiMitra AI SIH26197 Endpoints on http://localhost:3000...\n');
  let passed = 0;
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.status === 200) {
      console.log(`[PASS] ${res.route.padEnd(30)} -> HTTP ${res.status} (${(res.length / 1024).toFixed(1)} KB)`);
      passed++;
    } else {
      console.log(`[FAIL] ${res.route.padEnd(30)} -> Status ${res.status} Error: ${res.error || ''}`);
    }
  }
  console.log(`\nResults: ${passed} / ${routes.length} routes verified successfully.`);
}

run();
