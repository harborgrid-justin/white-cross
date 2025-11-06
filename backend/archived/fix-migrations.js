require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DATABASE_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: false
});

async function fixMigrations() {
  try {
    await db.query(`
      INSERT INTO "SequelizeMeta" (name) VALUES 
      ('20250103000001-create-health-records-core.js'),
      ('20250103000002-create-additional-critical-tables.js'),
      ('20250103000003-create-system-configuration.js'),
      ('20251009013303-enhance-system-configuration.js'),
      ('20251010000000-complete-health-records-schema.js'),
      ('20251010000000-complete-health-records-schema-FIXED.js'),
      ('20251011000000-performance-indexes.js')
      ON CONFLICT DO NOTHING
    `);
    console.log('✓ Migration records inserted successfully');
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

fixMigrations();
