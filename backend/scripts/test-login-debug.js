#!/usr/bin/env node

/**
 * Test Login with Full Debug
 * Tests the login directly using our built backend
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

async function testLoginDebug() {
  console.log('🔍 Testing login with full debugging...\n');

  let app;
  try {
    // Create NestJS application
    console.log('🚀 Starting NestJS application...');
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });
    
    console.log('✅ NestJS application started');

    // Get AuthService
    const AuthService = require('../dist/services/auth/auth.service').AuthService;
    const authService = app.get(AuthService);
    console.log('✅ AuthService retrieved');

    console.log('\n📧 Testing login with admin credentials:');
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
    console.log(`👤 User: ${result.user.email} (${result.user.role})`);

  } catch (error) {
    console.error('\n❌ Login failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Type: ${error.constructor.name}`);
    
    if (error.stack) {
      console.error('\n📚 Stack trace:');
      console.error(error.stack);
    }
  } finally {
    if (app) {
      console.log('\n🛑 Closing application...');
      await app.close();
    }
    console.log('👋 Test complete');
  }
}

// Run if called directly
if (require.main === module) {
  testLoginDebug().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testLoginDebug };