"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const database_1 = require("./database");
async function resetAdminPassword() {
    console.log('🔄 Resetting admin password...\n');
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
        console.log(`👤 User ID: ${adminUser.id}\n`);
        adminUser.password = 'admin123';
        await adminUser.save();
        console.log('✅ Password reset successfully!');
        console.log('📧 Email: admin@whitecross.health');
        console.log('🔑 Password: admin123\n');
        await app.close();
    }
    catch (error) {
        console.error('❌ Password reset failed:', error);
        process.exit(1);
    }
}
resetAdminPassword();
//# sourceMappingURL=reset-admin-password.js.map