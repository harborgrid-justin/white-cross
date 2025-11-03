/**
 * Create Admin User Script
 * Creates the initial admin user for the White Cross system
 */
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function createAdminUser() {
  console.log('👤 Creating admin user...');
  
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

    // First, check if users table exists
    const [tables] = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);

    if (tables.length === 0) {
      console.log('❌ Users table does not exist. Please run database sync first.');
      console.log('   Run: npm run start:dev (in backend directory)');
      console.log('   Or: node sync-database.js');
      process.exit(1);
    }

    // Check if admin user already exists
    const [existingUsers] = await sequelize.query(`
      SELECT id, email FROM users WHERE email = 'admin@whitecross.health'
    `);

    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists. Use reset-admin-password.js to reset password.');
      console.log('   Existing user:', existingUsers[0]);
      process.exit(0);
    }

    // Hash the password
    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminId = uuidv4();

    // Create admin user
    await sequelize.query(`
      INSERT INTO users (
        id, 
        email, 
        password, 
        "firstName", 
        "lastName", 
        role, 
        "isActive", 
        "emailVerified", 
        "createdAt", 
        "updatedAt"
      ) VALUES (
        :id,
        :email,
        :password,
        :firstName,
        :lastName,
        :role,
        true,
        true,
        NOW(),
        NOW()
      )
    `, {
      replacements: {
        id: adminId,
        email: 'admin@whitecross.health',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('   🌐 URL: http://localhost:3000/login');
    console.log('   📧 Email: admin@whitecross.health');
    console.log('   🔑 Password: Admin123!');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');

    await sequelize.close();
    console.log('🎉 Setup complete! You can now log in to the application.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

createAdminUser().catch(console.error);