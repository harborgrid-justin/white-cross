/**
 * Test Login API
 * Tests the login endpoint directly
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function testLogin() {
  console.log('🔍 Testing login API...\n');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    // Get AuthService
    const authService = app.get(AuthService);

    console.log('📧 Attempting login with:');
    console.log('   Email: admin@whitecross.health');
    console.log('   Password: admin123\n');

    // Attempt login
    const result = await authService.login({
      email: 'admin@whitecross.health',
      password: 'admin123',
    });

    console.log('✅ Login successful!');
    console.log(`🎫 Access Token: ${result.accessToken.substring(0, 30)}...`);
    console.log(`🔄 Refresh Token: ${result.refreshToken.substring(0, 30)}...`);
    console.log(`👤 User: ${result.user.email} (${result.user.role})`);
    console.log('');

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testLogin();
