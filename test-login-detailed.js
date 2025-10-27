// Test the exact API call that's failing in the browser
const https = require('https');
const http = require('http');
const querystring = require('querystring');

async function testLoginAPI() {
  console.log('🧪 Testing Exact Login API Call\n');
  
  // Test data (similar to what the frontend would send)
  const testCredentials = {
    email: 'test@example.com',
    password: 'testpassword123'
  };

  console.log('1️⃣  Testing POST request to login endpoint...\n');
  
  const postData = JSON.stringify(testCredentials);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'White-Cross-Test/1.0',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'http://localhost:3000',
      'Referer': 'http://localhost:3000/login'
    },
    timeout: 10000
  };

  console.log('Request Options:', JSON.stringify(options, null, 2));
  console.log('Request Data:', postData);
  console.log('\nSending request...\n');

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      console.log(`✅ Response Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📄 Response Body:');
        try {
          const jsonResponse = JSON.parse(data);
          console.log(JSON.stringify(jsonResponse, null, 2));
        } catch (e) {
          console.log(data);
        }
        
        if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 400) {
          console.log('\n✅ SUCCESS: API endpoint is accessible and responding');
          console.log('   The network connectivity is working correctly!');
        } else if (res.statusCode === 404) {
          console.log('\n⚠️  WARNING: Login endpoint not found (404)');
          console.log('   Check if the backend route is configured correctly');
        } else {
          console.log(`\n❌ UNEXPECTED STATUS: ${res.statusCode}`);
        }
        
        resolve(true);
      });
    });

    req.on('error', (error) => {
      console.log(`❌ REQUEST FAILED: ${error.message}`);
      console.log('\nThis indicates a network connectivity issue:');
      console.log('- Backend may not be running on localhost:3001');
      console.log('- Firewall may be blocking connections');  
      console.log('- Backend may not be binding to the correct interface');
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ REQUEST TIMED OUT');
      console.log('Backend is not responding within 10 seconds');
      req.destroy();
      resolve(false);
    });

    // Send the request data
    req.write(postData);
    req.end();
  });
}

// Also test a simple GET to see basic connectivity
async function testBasicConnectivity() {
  console.log('2️⃣  Testing basic backend connectivity...\n');
  
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/api/v1/health', {
      timeout: 5000,
      headers: {
        'User-Agent': 'White-Cross-Test/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Health Check Status: ${res.statusCode}`);
        console.log(`📄 Response: ${data.substring(0, 100)}...\n`);
        resolve(true);
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Health Check Failed: ${error.message}\n`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔍 Debugging Authentication Network Error\n');
  console.log('This test simulates the exact API calls made by the Next.js frontend\n');
  console.log('=' .repeat(60) + '\n');
  
  const healthCheck = await testBasicConnectivity();
  const loginTest = await testLoginAPI();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY:');
  console.log(`   Health Check: ${healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Login API: ${loginTest ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE'}`);
  
  if (healthCheck && loginTest) {
    console.log('\n🎉 CONCLUSION: Backend API is accessible!');
    console.log('   The network error might be:');
    console.log('   - CORS configuration issue');
    console.log('   - Authentication header issue');
    console.log('   - Request format issue');
    console.log('   - Frontend API client configuration issue');
  } else {
    console.log('\n❌ CONCLUSION: Network connectivity issue confirmed');
    console.log('   Backend is not accessible from localhost:3001');
  }
}

main().catch(console.error);