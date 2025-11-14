"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_1 = require("./services/auth");
async function testLoginResponse() {
    console.log('🔍 Testing login response structure...\n');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        const authService = app.get(auth_1.AuthService);
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
    }
    catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}
testLoginResponse();
//# sourceMappingURL=test-login-response.js.map