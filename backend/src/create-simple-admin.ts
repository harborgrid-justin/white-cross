/**
 * Simple Admin User Creation Script
 * Creates an admin user without complex audit logging to avoid import issues
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';

async function createSimpleAdminUser() {
  console.log('🔄 Creating admin user...');
  
  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });
    
    // Get the Sequelize instance
    const sequelize = app.get('SEQUELIZE');
    
    console.log('📋 Checking for existing admin user...');
    
    // Raw query to check if admin user exists
    const [existingAdmin] = await sequelize.query(`
      SELECT id, email, firstName, lastName, role, isActive
      FROM users 
      WHERE email = 'admin@whitecross.health' 
      AND "deletedAt" IS NULL
    `);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@whitecross.health');
      console.log('👤 User ID:', existingAdmin[0].id);
      console.log('🔄 Updating password to: admin123');
      
      // Update password with proper hashing
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await sequelize.query(`
        UPDATE users 
        SET password = :password, "updatedAt" = NOW()
        WHERE email = 'admin@whitecross.health'
      `, {
        replacements: { password: hashedPassword }
      });
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('📝 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // Create admin user with raw query to avoid model hooks
      await sequelize.query(`
        INSERT INTO users (
          id, email, password, "firstName", "lastName", role, 
          "isActive", "emailVerified", "mustChangePassword", 
          "failedLoginAttempts", "twoFactorEnabled", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          'admin@whitecross.health',
          :password,
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
        )
      `, {
        replacements: { password: hashedPassword }
      });
      
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('📧 Email: admin@whitecross.health');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('🎯 You can now log in to the frontend!');
    
    // Close the application
    await app.close();
    
  } catch (error) {
    console.error('❌ Admin user creation failed:', error.message);
    process.exit(1);
  }
}

// Run the creation
createSimpleAdminUser();