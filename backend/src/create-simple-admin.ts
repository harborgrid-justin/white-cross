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

    // SECURITY FIX: Parameterized query prevents SQL injection
    // Raw query to check if admin user exists
    const [existingAdmin] = await sequelize.query(
      `
      SELECT id, email, firstName, lastName, role, isActive
      FROM users
      WHERE email = :email
      AND "deletedAt" IS NULL
    `,
      {
        replacements: { email: 'admin@whitecross.health' },
      },
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@whitecross.health');
      console.log('👤 User ID:', existingAdmin[0].id);
      console.log('🔄 Updating password to: admin123');

      // SECURITY FIX: Parameterized password update
      // Update password with proper hashing
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await sequelize.query(
        `
        UPDATE users
        SET password = :password, "updatedAt" = NOW()
        WHERE email = :email
      `,
        {
          replacements: {
            password: hashedPassword,
            email: 'admin@whitecross.health',
          },
        },
      );

      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('📝 Creating new admin user...');

      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 12);

      // SECURITY FIX: Fully parameterized INSERT query
      // Create admin user with raw query to avoid model hooks
      await sequelize.query(
        `
        INSERT INTO users (
          id, email, password, "firstName", "lastName", role,
          "isActive", "emailVerified", "mustChangePassword",
          "failedLoginAttempts", "twoFactorEnabled", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          :email,
          :password,
          :firstName,
          :lastName,
          :role,
          :isActive,
          :emailVerified,
          :mustChangePassword,
          :failedLoginAttempts,
          :twoFactorEnabled,
          NOW(),
          NOW()
        )
      `,
        {
          replacements: {
            email: 'admin@whitecross.health',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isActive: true,
            emailVerified: true,
            mustChangePassword: false,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
          },
        },
      );

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
