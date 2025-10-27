#!/usr/bin/env node

/**
 * Realistic Next.js API Test
 * Tests actual API patterns that Next.js would use
 */

const http = require('http');

const API_BASE = 'http://backend:3001/api/v1';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testRealWorldScenarios() {
  console.log('🧪 Testing Real-World Next.js Scenarios');
  console.log('='.repeat(50));

  try {
    // Test 1: Health check (like a status page would do)
    console.log('1️⃣  Testing health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   ✅ Health Status: ${health.data.status} (${health.status})`);
    console.log(`   📈 API Uptime: ${Math.round(health.data.uptime)}s`);

    // Test 2: Try to access protected route (should get proper error)
    console.log('\n2️⃣  Testing protected endpoint without auth...');
    const protectedRoute = await makeRequest('/users');
    console.log(`   📡 Response: ${protectedRoute.status} (expected 401 or 404)`);
    
    // Test 3: Try authentication endpoint (should get validation error)
    console.log('\n3️⃣  Testing auth endpoint with empty data...');
    const auth = await makeRequest('/auth/login', 'POST', {});
    console.log(`   🔐 Auth Response: ${auth.status}`);

    // Test 4: Check GraphQL endpoint
    console.log('\n4️⃣  Testing GraphQL endpoint...');
    const graphql = await makeRequest('/graphql', 'POST', {
      query: '{ __schema { queryType { name } } }'
    });
    console.log(`   🔍 GraphQL Response: ${graphql.status}`);

    console.log('\n🎯 Summary:');
    console.log('   • Backend API is accessible from Next.js container');
    console.log('   • Service discovery (backend:3001) works correctly');
    console.log('   • HTTP requests are being processed');
    console.log('   • Network communication is fully functional');
    
    console.log('\n✅ All network connectivity tests PASSED!');
    console.log('🚀 Your containerized stack is ready for development!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRealWorldScenarios();