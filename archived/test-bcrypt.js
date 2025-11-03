/**
 * Generate a proper bcrypt hash for the password
 */

const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  const password = 'password123';
  const saltRounds = 12;
  
  console.log('Generating bcrypt hash for:', password);
  console.log('Salt rounds:', saltRounds);
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:', hash);
    
    // Test the hash by comparing it with the original password
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Hash verification test:', isMatch ? '✅ PASS' : '❌ FAIL');
    
    // Test with the hash I used earlier
    const oldHash = '$2b$12$LQv3c1yqBwlVHpPiOCJAEOvOtfDAMWC0G.SA.JOVOqxzb90Faw1/u';
    const oldHashTest = await bcrypt.compare(password, oldHash);
    console.log('Old hash verification test:', oldHashTest ? '✅ PASS' : '❌ FAIL');
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();