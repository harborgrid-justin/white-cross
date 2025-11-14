"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bcrypt = __importStar(require("bcrypt"));
async function createSimpleAdminUser() {
    console.log('🔄 Creating admin user...');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        const sequelize = app.get('SEQUELIZE');
        console.log('📋 Checking for existing admin user...');
        const [existingAdmin] = await sequelize.query(`
      SELECT id, email, firstName, lastName, role, isActive
      FROM users
      WHERE email = :email
      AND "deletedAt" IS NULL
    `, {
            replacements: { email: 'admin@whitecross.health' },
        });
        if (existingAdmin.length > 0) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email: admin@whitecross.health');
            console.log('👤 User ID:', existingAdmin[0].id);
            console.log('🔄 Updating password to: admin123');
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await sequelize.query(`
        UPDATE users
        SET password = :password, "updatedAt" = NOW()
        WHERE email = :email
      `, {
                replacements: {
                    password: hashedPassword,
                    email: 'admin@whitecross.health',
                },
            });
            console.log('✅ Admin password updated successfully!');
        }
        else {
            console.log('📝 Creating new admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await sequelize.query(`
        INSERT INTO users (
          id, email, password, "firstName", "lastName", role,
          "isActive", "emailVerified", "mustChangePassword",
          "failedLoginAttempts", "twoFactorEnabled", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          :email,
          :password,
          :firstName,
          :lastName,
          :role,
          :isActive,
          :emailVerified,
          :mustChangePassword,
          :failedLoginAttempts,
          :twoFactorEnabled,
          NOW(),
          NOW()
        )
      `, {
                replacements: {
                    email: 'admin@whitecross.health',
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'ADMIN',
                    isActive: true,
                    emailVerified: true,
                    mustChangePassword: false,
                    failedLoginAttempts: 0,
                    twoFactorEnabled: false,
                },
            });
            console.log('✅ Admin user created successfully!');
        }
        console.log('📧 Email: admin@whitecross.health');
        console.log('🔑 Password: admin123');
        console.log('');
        console.log('🎯 You can now log in to the frontend!');
        await app.close();
    }
    catch (error) {
        console.error('❌ Admin user creation failed:', error.message);
        process.exit(1);
    }
}
createSimpleAdminUser();
//# sourceMappingURL=create-simple-admin.js.map