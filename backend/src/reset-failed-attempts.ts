/**
 * Reset Failed Login Attempts
 * Resets failed login attempts for admin user
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './database/models/user.model';

async function resetFailedAttempts() {
  console.log('🔄 Resetting failed login attempts...\n');

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
    console.log(`❌ Failed login attempts: ${adminUser.failedLoginAttempts}`);
    console.log(
      `🔒 Lockout until: ${adminUser.lockoutUntil || 'Not locked'}\n`,
    );

    // Reset failed attempts
    await adminUser.resetFailedLoginAttempts();

    console.log('✅ Failed login attempts reset to 0');
    console.log('🔓 Account unlocked\n');

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

// Run the reset
resetFailedAttempts();
