"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_1 = require("./services/auth");
async function testLogin() {
    console.log('🔍 Testing login API...\n');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        const authService = app.get(auth_1.AuthService);
        console.log('📧 Attempting login with:');
        console.log('   Email: admin@whitecross.health');
        console.log('   Password: admin123\n');
        const result = await authService.login({
            email: 'admin@whitecross.health',
            password: 'admin123',
        });
        console.log('✅ Login successful!');
        console.log(`🎫 Access Token: ${result.accessToken.substring(0, 30)}...`);
        console.log(`🔄 Refresh Token: ${result.refreshToken.substring(0, 30)}...`);
        console.log(`👤 User: ${result.user.email} (${result.user.role})`);
        console.log('');
        await app.close();
    }
    catch (error) {
        console.error('❌ Login failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}
testLogin();
//# sourceMappingURL=test-login.js.map