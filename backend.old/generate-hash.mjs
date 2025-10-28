/**
 * Generate bcrypt hash using backend environment
 */

import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'password123';
  const saltRounds = 12;
  
  console.log('Generating hash for:', password);
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);
    
    // Test the hash
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Verification test:', isMatch ? 'PASS' : 'FAIL');
    
    // SQL statement to update user
    console.log('\nSQL to update user:');
    console.log(`UPDATE users SET password = '${hash}' WHERE email = 'nurse@test.com';`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateHash();