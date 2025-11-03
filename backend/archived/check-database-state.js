/**
 * Check Database State
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkDatabaseState() {
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DATABASE_URL.includes('sslmode=require') ? {
        ssl: { require: true, rejectUnauthorized: false }
      } : {},
    });

    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const [tables] = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    if (tables.length === 0) {
      console.log('   (No tables found - database is empty)');
    } else {
      tables.forEach(t => console.log('  -', t.table_name));
    }
    
    if (tables.some(t => t.table_name === 'users')) {
      const [userCount] = await sequelize.query(`SELECT COUNT(*) as count FROM users`);
      console.log(`\n👥 Users in database: ${userCount[0].count}`);
      
      if (userCount[0].count > 0) {
        const [users] = await sequelize.query(`
          SELECT id, email, "firstName", "lastName", role, "isActive" 
          FROM users 
          LIMIT 5
        `);
        console.log('\n📄 Existing users:');
        users.forEach(u => console.log(`   - ${u.email} (${u.role})`));
      }
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabaseState().catch(console.error);