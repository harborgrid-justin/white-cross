/**
 * Reset Admin Password Script
 * Resets the admin user password to a known value
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './database/models/user.model';

async function resetAdminPassword() {
  console.log('🔄 Resetting admin password...\n');

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
    console.log(`👤 User ID: ${adminUser.id}\n`);

    // Update password - the @BeforeUpdate hook will hash it
    adminUser.password = 'admin123';
    await adminUser.save();

    console.log('✅ Password reset successfully!');
    console.log('📧 Email: admin@whitecross.health');
    console.log('🔑 Password: admin123\n');

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    process.exit(1);
  }
}

// Run the reset
resetAdminPassword();
