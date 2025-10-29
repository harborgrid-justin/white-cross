const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

async function resetAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const newPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Reset password and unlock the account
    const [result] = await sequelize.query(
      `UPDATE users
       SET password = :hashedPassword,
           "failedLoginAttempts" = 0,
           "lockoutUntil" = NULL
       WHERE email = 'admin@whitecross.health'
       RETURNING id, email, "firstName", "lastName", role`,
      {
        replacements: { hashedPassword }
      }
    );

    if (result && result.length > 0) {
      console.log('\n✅ Admin account password reset and unlocked successfully!');
      console.log('📋 Account details:');
      console.log(JSON.stringify(result[0], null, 2));
      console.log('\n🔑 Login credentials:');
      console.log('   Email: admin@whitecross.health');
      console.log('   Password: Admin123!');
      console.log('\n⚠️  Make sure to copy the password exactly (no extra characters)');
    } else {
      console.log('❌ Admin account not found');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
