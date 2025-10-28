const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to database');
    console.log('Clearing existing seeded data...');
    
    // Clear data in reverse order of dependencies (ignore errors for non-existent tables)
    try {
      await client.query('DELETE FROM role_permissions;');
      console.log('✓ Cleared role_permissions');
    } catch (e) { console.log('- role_permissions table does not exist'); }
    
    try {
      await client.query('DELETE FROM user_role_assignments;');
      console.log('✓ Cleared user_role_assignments');
    } catch (e) { console.log('- user_role_assignments table does not exist'); }
    
    try {
      await client.query('DELETE FROM roles;');
      console.log('✓ Cleared roles');
    } catch (e) { console.log('- roles table does not exist'); }
    
    try {
      await client.query('DELETE FROM permissions;');
      console.log('✓ Cleared permissions');
    } catch (e) { console.log('- permissions table does not exist'); }
    
    try {
      await client.query('DELETE FROM schools;');
      console.log('✓ Cleared schools');
    } catch (e) { console.log('- schools table does not exist'); }
    
    try {
      await client.query('DELETE FROM districts;');
      console.log('✓ Cleared districts');
    } catch (e) { console.log('- districts table does not exist'); }
    
    console.log('✓ Successfully cleared all seeded data');
  } catch (error) {
    console.error('Error clearing data:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
