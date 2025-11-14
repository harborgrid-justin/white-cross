"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const sequelize_typescript_1 = require("sequelize-typescript");
const database_1 = require("./database");
async function syncUsersOnly() {
    console.log('🔄 Starting minimal database sync (users only)...');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: false });
        const sequelize = app.get(sequelize_typescript_1.Sequelize);
        console.log('📋 Syncing users table only...');
        await database_1.User.sync({
            force: true,
            logging: console.log,
        });
        console.log('✅ Users table sync completed successfully!');
        await app.close();
    }
    catch (error) {
        console.error('❌ Users table sync failed:', error);
        process.exit(1);
    }
}
syncUsersOnly();
//# sourceMappingURL=sync-users.js.map