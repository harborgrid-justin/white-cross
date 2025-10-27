/**
 * Test NextJS authentication against the backend
 */

const API_BASE = 'http://localhost:3001/api/v1';

async function testNextJSAuth() {
  console.log('Testing NextJS authentication against backend...');
  
  try {
    // Test the same credentials that were created earlier
    const loginData = {
      email: 'nurse@test.com',
      password: 'password123'
    };

    console.log('Attempting login with:', { email: loginData.email });

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('Raw response:', data);

    if (response.ok) {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Authentication successful!');
        console.log('Response data:', jsonData);
        
        if (jsonData.success && jsonData.data) {
          console.log('User:', jsonData.data.user);
          console.log('Token present:', !!jsonData.data.token);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
      }
    } else {
      console.error('❌ Authentication failed');
      console.error('Error response:', data);
    }

  } catch (error) {
    console.error('❌ Network or request error:', error.message);
  }
}

// Run the test
testNextJSAuth();