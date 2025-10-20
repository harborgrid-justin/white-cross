require('dotenv').config();
const { Client } = require('pg');

async function testSeededUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    console.log('Verifying Seeded Users:');
    console.log('');

    const testUsers = [
      'admin@whitecross.health',
      'nurse@school.edu', 
      'admin@school.edu'
    ];

    for (const email of testUsers) {
      try {
        const result = await client.query(
          'SELECT email, "firstName", "lastName", role, "isActive" FROM users WHERE email = $1',
          [email]
        );

        if (result.rows.length > 0) {
          const user = result.rows[0];
          
          console.log(`✓ ${email}`);
          console.log(`  Name: ${user.firstName} ${user.lastName}`);
          console.log(`  Role: ${user.role}`);
          console.log(`  Active: ${user.isActive}`);
          console.log('');
        } else {
          console.log(`✗ ${email} - User not found`);
        }
      } catch (error) {
        console.log(`✗ ${email} - Error: ${error.message}`);
      }
    }

    // Show summary of all users
    const allUsers = await client.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role'
    );
    
    console.log('Summary of all seeded users:');
    allUsers.rows.forEach(row => {
      console.log(`- ${row.role}: ${row.count} users`);
    });

  } catch (error) {
    console.error('Connection error:', error.message);
  } finally {
    await client.end();
  }
}

testSeededUsers();
