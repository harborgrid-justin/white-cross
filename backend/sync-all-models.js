// Sync all Sequelize models to create missing tables
require('dotenv').config();
const db = require('./dist/database/models');

async function syncModels() {
  try {
    console.log('Syncing all Sequelize models to database...\n');

    // Sync all models (this will create any missing tables)
    await db.sequelize.sync({ alter: true });

    console.log('\n✅ All models synced successfully!');
    console.log('All database tables are now up to date.\n');

  } catch (error) {
    console.error('❌ Error syncing models:', error.message);
    console.error(error.stack);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

syncModels();
