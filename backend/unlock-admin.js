const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

async function unlockAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Reset failed login attempts and unlock the account
    const [result] = await sequelize.query(
      `UPDATE users
       SET "failedLoginAttempts" = 0,
           "lockoutUntil" = NULL
       WHERE email = 'admin@whitecross.health'
       RETURNING id, email, "firstName", "lastName", role`
    );

    if (result && result.length > 0) {
      console.log('\n✅ Admin account unlocked successfully!');
      console.log('📋 Account details:');
      console.log(JSON.stringify(result[0], null, 2));
      console.log('\n🔑 Login credentials:');
      console.log('   Email: admin@whitecross.health');
      console.log('   Password: Admin123!');
    } else {
      console.log('❌ Admin account not found');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

unlockAdmin();
