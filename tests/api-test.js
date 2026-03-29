const http = require('http');

async function testRoute(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting API Validation ---');
  
  try {
    // 1. Test Services API
    console.log('\nTesting /api/services...');
    const services = await testRoute('http://localhost:3000/api/services');
    console.log(`Status: ${services.status}`);
    if (services.status === 200) {
      console.log(`Success: Found ${services.data.length} services`);
    } else {
      console.error(`Error: ${JSON.stringify(services.data)}`);
    }

    // 2. Test Auth API (Mock Login)
    console.log('\nTesting /api/auth (Login Admin)...');
    const auth = await testRoute('http://localhost:3000/api/auth', 'POST', {
      action: 'login',
      identifier: 'Admin Admin'
    });
    console.log(`Status: ${auth.status}`);
    if (auth.status === 200) {
      console.log(`Success: Admin user authenticated`);
    } else if (auth.status === 404) {
      console.log('Warning: Admin user not found in DB (expected if not seeded)');
    } else {
      console.error(`Error: ${JSON.stringify(auth.data)}`);
    }

    // 3. Test Favorites persistence (Logic check)
    // Client-side only in this app, so skipping server test

    console.log('\n--- API Validation Complete ---');
  } catch (err) {
    console.error('Test script failed:', err);
  }
}

runTests();
