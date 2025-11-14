/**
 * Test Login Response
 * Checks the exact response from the login endpoint
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './services/auth';

async function testLoginResponse() {
  console.log('🔍 Testing login response structure...\n');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });
    const authService = app.get(AuthService);

    const result = await authService.login({
      email: 'admin@whitecross.health',
      password: 'admin123',
    });

    console.log('✅ Login Response Structure:');
    console.log(JSON.stringify(result, null, 2));
    console.log('');
    console.log('Response Keys:', Object.keys(result));
    console.log('');
    console.log('Has accessToken?', !!result.accessToken);
    console.log('Has refreshToken?', !!result.refreshToken);
    console.log('Has user?', !!result.user);
    console.log('Has tokenType?', !!result.tokenType);
    console.log('Has expiresIn?', !!result.expiresIn);
    console.log('');

    if (result.user) {
      console.log('User object keys:', Object.keys(result.user));
      console.log('User structure:', JSON.stringify(result.user, null, 2));
    }

    await app.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLoginResponse();
