const http = require('http');

// Test configuration
const tests = [
  {
    name: 'Next.js Application',
    host: 'localhost',
    port: 3000,
    path: '/',
    expected: 'White Cross Healthcare Platform'
  },
  {
    name: 'Backend API Health',
    host: 'backend',
    port: 3001,
    path: '/api/v1/health',
    expected: 'connected'
  },
  {
    name: 'Backend GraphQL',
    host: 'backend',
    port: 3001,
    path: '/graphql',
    expected: 'GraphQL'
  }
];

console.log(' Final Network Connectivity Validation\n');

async function runTest(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: test.host,
      port: test.port,
      path: test.path,
      method: 'GET',
      timeout: 5000,
      headers: {
        'User-Agent': 'White-Cross-Test/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = data.includes(test.expected);
        resolve({
          ...test,
          success,
          status: res.statusCode,
          response: data.substring(0, 100) + (data.length > 100 ? '...' : '')
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

async function main() {
  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await runTest(test);
    
    if (result.success) {
      console.log( \: PASS (\));
      console.log(   Response: \);
      passed++;
    } else {
      console.log( \: FAIL);
      console.log(   Error: \);
      if (result.response) {
        console.log(   Response: \);
      }
    }
    console.log('');
  }

  console.log( Test Results: \/\ tests passed\n);

  if (passed === total) {
    console.log(' All connectivity tests PASSED!');
    console.log(' Network issues have been resolved');
    console.log(' Next.js  Backend communication is working');
    console.log(' Your containerized stack is ready for development!');
  } else {
    console.log('  Some tests failed - check the logs above');
  }
}

main().catch(console.error);
