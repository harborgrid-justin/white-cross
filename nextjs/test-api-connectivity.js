#!/usr/bin/env node

/**
 * API Connectivity Test Script
 * Tests network communication between Next.js and backend containers
 */

const https = require('http');
const { URL } = require('url');

// Test configuration
const API_BASE = process.env.INTERNAL_API_URL || 'http://backend:3001/api/v1';
const TIMEOUT = 5000;

// Test endpoints
const endpoints = [
  { name: 'Health Check', path: '/health', method: 'GET' },
  { name: 'Auth Login Endpoint', path: '/auth/login', method: 'POST', expectStatus: [400, 422] }, // Should return validation error
  { name: 'Users Endpoint', path: '/users', method: 'GET', expectStatus: [401] }, // Should return unauthorized
  { name: 'Students Endpoint', path: '/students', method: 'GET', expectStatus: [401] }, // Should return unauthorized
];

let passed = 0;
let failed = 0;

/**
 * Make HTTP request to test endpoint
 */
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint.path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Container-Test/1.0'
      },
      timeout: TIMEOUT
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: true,
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });

    // Send request body for POST requests
    if (endpoint.method === 'POST') {
      req.write(JSON.stringify({}));
    }
    
    req.end();
  });
}

/**
 * Run connectivity tests
 */
async function runTests() {
  console.log('🚀 Starting API Connectivity Tests');
  console.log(`📡 Testing against: ${API_BASE}`);
  console.log('='.repeat(60));

  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.name}... `);
    
    try {
      const result = await makeRequest(endpoint);
      
      if (!result.success) {
        console.log(`❌ FAILED - ${result.error}`);
        failed++;
        continue;
      }

      // Check if response status is expected
      const expectedStatuses = endpoint.expectStatus || [200, 201];
      const isValidStatus = expectedStatuses.includes(result.status);
      
      if (isValidStatus) {
        console.log(`✅ PASSED - Status ${result.status}`);
        passed++;
      } else {
        console.log(`⚠️  UNEXPECTED STATUS - Got ${result.status}, expected ${expectedStatuses.join(' or ')}`);
        // Still count as passed for connectivity purposes
        passed++;
      }

      // Show response preview for health endpoint
      if (endpoint.path === '/health' && result.data) {
        try {
          const healthData = JSON.parse(result.data);
          console.log(`   📊 Health: ${healthData.status}, Uptime: ${Math.round(healthData.uptime)}s`);
          console.log(`   🔗 Services: API=${healthData.services?.api}, DB=${healthData.services?.database}`);
        } catch (e) {
          console.log(`   📄 Response: ${result.data.substring(0, 100)}...`);
        }
      }

    } catch (error) {
      console.log(`❌ ERROR - ${error.message}`);
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`📈 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All connectivity tests passed! Network communication is working.');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed. Network issues may exist.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});