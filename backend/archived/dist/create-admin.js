"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const database_1 = require("./database");
async function createAdminUser() {
    console.log('🔄 Creating admin user...');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        console.log('📋 Checking for existing admin user...');
        const existingAdmin = await database_1.User.findOne({
            where: { email: 'admin@whitecross.health' },
        });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@whitecross.health');
            console.log('👤 User ID:', existingAdmin.id);
            console.log('ℹ️  If you need to reset the password, delete the user first.');
            await app.close();
            return;
        }
        console.log('📝 Creating new admin user...');
        const adminUser = await database_1.User.create({
            email: 'admin@whitecross.health',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: database_1.UserRole.ADMIN,
            isActive: true,
            emailVerified: true,
            mustChangePassword: false,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
        });
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@whitecross.health');
        console.log('🔑 Password: admin123');
        console.log('👤 User ID:', adminUser.id);
        await app.close();
    }
    catch (error) {
        console.error('❌ Admin user creation failed:', error);
        process.exit(1);
    }
}
createAdminUser();
//# sourceMappingURL=create-admin.js.map