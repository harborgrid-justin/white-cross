"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const database_1 = require("./database");
async function resetFailedAttempts() {
    console.log('🔄 Resetting failed login attempts...\n');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        const adminUser = await database_1.User.findOne({
            where: { email: 'admin@whitecross.health' },
        });
        if (!adminUser) {
            console.log('❌ Admin user not found');
            await app.close();
            process.exit(1);
        }
        console.log(`📧 Found user: ${adminUser.email}`);
        console.log(`❌ Failed login attempts: ${adminUser.failedLoginAttempts}`);
        console.log(`🔒 Lockout until: ${adminUser.lockoutUntil || 'Not locked'}\n`);
        await adminUser.resetFailedLoginAttempts();
        console.log('✅ Failed login attempts reset to 0');
        console.log('🔓 Account unlocked\n');
        await app.close();
    }
    catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
}
resetFailedAttempts();
//# sourceMappingURL=reset-failed-attempts.js.map