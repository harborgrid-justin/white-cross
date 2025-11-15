#!/usr/bin/env node

/**
 * Test Authentication API
 * Tests the AuthService.login method directly through NestJS
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

async function testLogin() {
  console.log('🔍 Testing login API directly...\n');

  let app;
  try {
    // Create NestJS application
    console.log('🚀 Starting NestJS application...');
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    // Get AuthService
    const { AuthService } = require('../dist/services/auth/auth.service');
    const authService = app.get(AuthService);

    console.log('✅ NestJS application started');
    console.log('✅ AuthService retrieved');

    console.log('\n📧 Attempting login with:');
    console.log('   Email: admin@whitecross.health');
    console.log('   Password: Admin!123\n');

    // Test login
    const loginDto = {
      email: 'admin@whitecross.health',
      password: 'Admin!123',
    };

    console.log('🔐 Calling authService.login()...');
    const result = await authService.login(loginDto);

    console.log('\n🎉 Login successful!');
    console.log(`🎫 Access Token: ${result.accessToken.substring(0, 30)}...`);
    console.log(`🔄 Refresh Token: ${result.refreshToken.substring(0, 30)}...`);
    console.log(`👤 User: ${result.user.email} (${result.user.role})`);
    console.log(`⏰ Expires in: ${result.expiresIn} seconds`);

  } catch (error) {
    console.error('\n❌ Login failed:');
    console.error(`   Error type: ${error.constructor.name}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`   HTTP status: ${error.response.statusCode}`);
      console.error(`   Error details:`, error.response.message);
    }
    
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
  } finally {
    if (app) {
      console.log('\n🛑 Closing NestJS application...');
      await app.close();
    }
    console.log('👋 Test complete');
  }
}

// Run if called directly
if (require.main === module) {
  testLogin().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testLogin };