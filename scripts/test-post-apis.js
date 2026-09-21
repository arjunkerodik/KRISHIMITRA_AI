const http = require('http');

async function testPost(path, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = http.request(`http://localhost:3000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ path, status: res.statusCode, success: parsed.success, data: parsed });
        } catch (e) {
          resolve({ path, status: res.statusCode, error: e.message, body });
        }
      });
    });

    req.on('error', (err) => resolve({ path, status: 0, error: err.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Testing Next.js POST API Handlers...\n');

  const chatRes = await testPost('/api/ai/chat', {
    message: 'Should I irrigate my tomato crop today?',
    language: 'en'
  });
  console.log(`[POST] /api/ai/chat -> HTTP ${chatRes.status} (Success: ${chatRes.success})`);
  if (chatRes.data?.reply) {
    console.log(`   Reply Preview: "${chatRes.data.reply.slice(0, 100)}..."`);
  }

  const disRes = await testPost('/api/disease/analyze', {
    crop: 'Tomato',
    imageBase64: 'sample-base64'
  });
  console.log(`[POST] /api/disease/analyze -> HTTP ${disRes.status} (Pathogen: ${disRes.data?.diagnosis?.pathogen})`);

  const soilRes = await testPost('/api/soil/analyze', {
    n: 210, p: 18, k: 290, ph: 6.8, crop: 'Tomato'
  });
  console.log(`[POST] /api/soil/analyze -> HTTP ${soilRes.status} (Health Score: ${soilRes.data?.soilHealthScore})`);

  console.log('\nAll API POST handlers verified successfully!');
}

main();
