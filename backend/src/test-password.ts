/**
 * Test Password Script
 * Tests if the password comparison works correctly
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './database/models/user.model';
import * as bcrypt from 'bcrypt';

async function testPassword() {
  console.log('🔍 Testing password for admin user...\n');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });

    // Find admin user
    const adminUser = await User.findOne({
      where: { email: 'admin@whitecross.health' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      await app.close();
      process.exit(1);
    }

    console.log(`📧 Found user: ${adminUser.email}`);
    console.log(`👤 User ID: ${adminUser.id}`);
    console.log(
      `🔐 Stored password hash: ${adminUser.password.substring(0, 20)}...`,
    );
    console.log('');

    // Test password comparison
    const testPassword = 'admin123';
    console.log(`🔑 Testing password: ${testPassword}`);

    const isValid = await adminUser.comparePassword(testPassword);
    console.log(
      `✅ Password comparison result: ${isValid ? 'VALID ✓' : 'INVALID ✗'}`,
    );
    console.log('');

    // Also test direct bcrypt comparison
    const directCompare = await bcrypt.compare(
      testPassword,
      adminUser.password,
    );
    console.log(
      `🔬 Direct bcrypt comparison: ${directCompare ? 'VALID ✓' : 'INVALID ✗'}`,
    );
    console.log('');

    // Show user status
    console.log('👤 User Status:');
    console.log(`   Active: ${adminUser.isActive}`);
    console.log(`   Email Verified: ${adminUser.emailVerified}`);
    console.log(`   Failed Login Attempts: ${adminUser.failedLoginAttempts}`);
    console.log(
      `   Locked: ${adminUser.isAccountLocked ? adminUser.isAccountLocked() : 'N/A'}`,
    );

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testPassword();
