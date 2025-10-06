// Simple Node.js script to test the exact same request as the frontend
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with exact credentials...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'nurse@school.edu',
      password: 'NursePassword123!'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('Success!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testLogin();
