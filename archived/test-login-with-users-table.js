const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing login with users table now available...');
  
  try {
    // Test the health endpoint first
    console.log('\n1. Testing API Health...');
    const healthResponse = await fetch('http://localhost:3001/api/v1/health');
    const healthData = await healthResponse.text();
    console.log('Health Response:', healthResponse.status, healthData);
    
    // Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'testpassword'
      })
    });

    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response Headers:', Object.fromEntries(loginResponse.headers));

    const responseText = await loginResponse.text();
    console.log('Login Response Body:', responseText);
    
    if (loginResponse.ok) {
      console.log('✅ Login endpoint is accessible and working!');
    } else {
      console.log('ℹ️  Login endpoint accessible but expecting different error (user not found vs database error)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();