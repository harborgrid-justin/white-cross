/**
 * Create Admin User Script
 * Creates an admin user for testing login functionality
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User, UserRole } from '@/database';

async function createAdminUser() {
  console.log('🔄 Creating admin user...');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });

    console.log('📋 Checking for existing admin user...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@whitecross.health' },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: admin@whitecross.health');
      console.log('👤 User ID:', existingAdmin.id);
      console.log('ℹ️  If you need to reset the password, delete the user first.');
      await app.close();
      return;
    }

    console.log('📝 Creating new admin user...');

    // Create admin user - password will be hashed by @BeforeCreate hook
    const adminUser = await User.create({
      email: 'admin@whitecross.health',
      password: 'admin123', // Will be hashed by the model's @BeforeCreate hook
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@whitecross.health');
    console.log('🔑 Password: admin123');
    console.log('👤 User ID:', adminUser.id);

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Admin user creation failed:', error);
    process.exit(1);
  }
}

// Run the creation
createAdminUser();
