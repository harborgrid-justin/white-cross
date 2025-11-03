/**
 * Create Admin User Script
 * Creates an admin user for testing login functionality
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User, UserRole } from './database/models/user.model';
import * as bcrypt from 'bcrypt';

async function createAdminUser() {
  console.log('🔄 Creating admin user...');
  
  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });
    
    console.log('📋 Creating admin user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@whitecross.health',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      twoFactorEnabled: false
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