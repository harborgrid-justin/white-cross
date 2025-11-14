"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const database_1 = require("./database");
async function checkUsers() {
    console.log('🔍 Checking users in database...\n');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        const users = await database_1.User.findAll({
            attributes: [
                'id',
                'email',
                'firstName',
                'lastName',
                'role',
                'isActive',
                'emailVerified',
                'createdAt',
            ],
        });
        if (users.length === 0) {
            console.log('❌ No users found in database\n');
        }
        else {
            console.log(`✅ Found ${users.length} user(s):\n`);
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   ID: ${user.id}`);
                console.log(`   Name: ${user.firstName} ${user.lastName}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Active: ${user.isActive}`);
                console.log(`   Email Verified: ${user.emailVerified}`);
                console.log(`   Created: ${user.createdAt}`);
                console.log('');
            });
        }
        await app.close();
    }
    catch (error) {
        console.error('❌ Error checking users:', error);
        process.exit(1);
    }
}
checkUsers();
//# sourceMappingURL=check-users.js.map