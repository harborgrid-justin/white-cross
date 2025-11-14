"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const models_1 = require("./database/models");
const sequelize_1 = require("sequelize");
async function unlockUsers() {
    console.log('🔓 Unlocking user accounts...\n');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        const lockedUsers = await models_1.User.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { failedLoginAttempts: { [sequelize_1.Op.gt]: 0 } },
                    { lockoutUntil: { [sequelize_1.Op.not]: null } }
                ]
            },
            attributes: ['id', 'email', 'failedLoginAttempts', 'lockoutUntil']
        });
        if (lockedUsers.length === 0) {
            console.log('✅ No locked users found');
            await app.close();
            return;
        }
        console.log(`📋 Found ${lockedUsers.length} users with login issues:\n`);
        for (const user of lockedUsers) {
            console.log(`📧 User: ${user.email}`);
            console.log(`❌ Failed attempts: ${user.failedLoginAttempts}`);
            console.log(`🔒 Locked until: ${user.lockoutUntil || 'Not locked'}`);
            await user.resetFailedLoginAttempts();
            console.log(`✅ ${user.email} unlocked and reset\n`);
        }
        console.log(`🎉 Successfully unlocked ${lockedUsers.length} accounts`);
        await app.close();
    }
    catch (error) {
        console.error('❌ Unlock failed:', error);
        process.exit(1);
    }
}
unlockUsers();
//# sourceMappingURL=unlock-users.js.map