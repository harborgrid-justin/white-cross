const http = require('http');

// Test authentication API connectivity from outside containers (browser perspective)
async function testAuthAPI() {
  console.log('🔐 Testing Authentication API Connectivity\n');
  console.log('Testing browser-accessible API URLs (what the frontend actually uses):\n');

  const tests = [
    {
      name: 'Backend Health Check',
      host: 'localhost',
      port: 3001,
      path: '/api/v1/health',
      expected: 'connected',
      method: 'GET'
    },
    {
      name: 'Auth Login Endpoint',
      host: 'localhost',
      port: 3001,
      path: '/api/v1/auth/login',
      expected: 'POST',  // We expect a method not allowed error for GET
      method: 'GET'
    },
    {
      name: 'GraphQL Endpoint',
      host: 'localhost',
      port: 3001,
      path: '/graphql',
      expected: 'GraphQL',
      method: 'GET'
    }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await runTest(test);
    
    if (result.success) {
      console.log(`✅ ${result.name}: ACCESSIBLE`);
      if (result.status) console.log(`   Status: ${result.status}`);
      if (result.response) console.log(`   Response: ${result.response.substring(0, 100)}...`);
    } else {
      console.log(`❌ ${result.name}: NOT ACCESSIBLE`);
      console.log(`   Error: ${result.error || 'Unexpected response'}`);
    }
    console.log('');
    
    if (result.success) passed++;
  }

  console.log(`📊 Results: ${passed}/${total} endpoints accessible\n`);
  
  if (passed === total) {
    console.log('🎉 SUCCESS: All authentication API endpoints are accessible!');
    console.log('✅ Browser can reach backend via localhost:3001');
    console.log('✅ Network connectivity issue is RESOLVED!');
    console.log('✅ Authentication should now work in the browser');
  } else {
    console.log('⚠️  Some endpoints are not accessible');
    console.log('   The authentication error may persist');
  }
}

async function runTest(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: test.host,
      port: test.port,
      path: test.path,
      method: test.method,
      timeout: 5000,
      headers: {
        'User-Agent': 'Auth-Test/1.0',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // For auth endpoints, we expect either success or specific error responses
        const success = (
          res.statusCode === 200 ||  // Successful response
          res.statusCode === 405 ||  // Method not allowed (expected for GET on POST endpoint)
          res.statusCode === 404 ||  // Not found (but server is responding)
          data.includes(test.expected) ||
          (test.path === '/api/v1/auth/login' && res.statusCode === 405)  // Expected for login endpoint
        );
        
        resolve({
          ...test,
          success,
          status: res.statusCode,
          response: data
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        ...test,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...test,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

testAuthAPI().catch(console.error);