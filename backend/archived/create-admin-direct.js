const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection (matching backend config from .env)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'postgresql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Raw SQL to insert admin user
    const [results, metadata] = await sequelize.query(`
      INSERT INTO users (
          id, 
          email, 
          password, 
          "firstName", 
          "lastName", 
          role, 
          "isActive", 
          "emailVerified", 
          "mustChangePassword", 
          "failedLoginAttempts", 
          "twoFactorEnabled",
          "createdAt", 
          "updatedAt"
      ) VALUES (
          gen_random_uuid(),
          'admin@whitecross.health',
          '${hashedPassword}',
          'Admin',
          'User',
          'ADMIN',
          true,
          true,
          false,
          0,
          false,
          NOW(),
          NOW()
      ) ON CONFLICT (email) DO UPDATE SET
          password = EXCLUDED.password,
          "firstName" = EXCLUDED."firstName",
          "lastName" = EXCLUDED."lastName",
          role = EXCLUDED.role,
          "isActive" = EXCLUDED."isActive",
          "emailVerified" = EXCLUDED."emailVerified",
          "mustChangePassword" = EXCLUDED."mustChangePassword",
          "failedLoginAttempts" = EXCLUDED."failedLoginAttempts",
          "twoFactorEnabled" = EXCLUDED."twoFactorEnabled",
          "updatedAt" = NOW()
      RETURNING id, email, "firstName", "lastName", role;
    `);

    console.log('Admin user created/updated successfully:', results[0]);

    // Verify the user exists
    const [verifyResults] = await sequelize.query(`
      SELECT id, email, "firstName", "lastName", role, "isActive", "emailVerified" 
      FROM users 
      WHERE email = 'admin@whitecross.health'
    `);

    console.log('Verification - User found:', verifyResults[0]);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser();