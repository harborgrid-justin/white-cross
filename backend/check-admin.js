const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

async function checkAdmins() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const [results] = await sequelize.query(
      "SELECT id, email, \"firstName\", \"lastName\", role, \"isActive\" FROM users WHERE role = 'ADMIN'"
    );

    console.log('\n📋 Admin users in database:');
    console.log(JSON.stringify(results, null, 2));

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmins();
