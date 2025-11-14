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
const database_1 = require("./database");
const bcrypt = __importStar(require("bcrypt"));
async function testPassword() {
    console.log('🔍 Testing password for admin user...\n');
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
        console.log(`👤 User ID: ${adminUser.id}`);
        console.log(`🔐 Stored password hash: ${adminUser.password.substring(0, 20)}...`);
        console.log('');
        const testPassword = 'admin123';
        console.log(`🔑 Testing password: ${testPassword}`);
        const isValid = await adminUser.comparePassword(testPassword);
        console.log(`✅ Password comparison result: ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
        console.log('');
        const directCompare = await bcrypt.compare(testPassword, adminUser.password);
        console.log(`🔬 Direct bcrypt comparison: ${directCompare ? 'VALID ✓' : 'INVALID ✗'}`);
        console.log('');
        console.log('👤 User Status:');
        console.log(`   Active: ${adminUser.isActive}`);
        console.log(`   Email Verified: ${adminUser.emailVerified}`);
        console.log(`   Failed Login Attempts: ${adminUser.failedLoginAttempts}`);
        console.log(`   Locked: ${adminUser.isAccountLocked ? adminUser.isAccountLocked() : 'N/A'}`);
        await app.close();
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}
testPassword();
//# sourceMappingURL=test-password.js.map