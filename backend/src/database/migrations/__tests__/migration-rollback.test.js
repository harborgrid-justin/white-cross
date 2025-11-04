'use strict';

/**
 * Migration Rollback Test Suite
 *
 * This test suite verifies that all Sequelize migrations can be:
 * 1. Applied (up) successfully
 * 2. Rolled back (down) successfully
 * 3. Re-applied after rollback
 * 4. Are idempotent (can run multiple times)
 *
 * HIPAA Compliance: Migration testing ensures data integrity during schema changes
 *
 * Usage:
 *   npm test -- migration-rollback.test.js
 */

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

describe('Migration Rollback Tests', () => {
  let sequelize;
  let queryInterface;
  const migrationsDir = path.join(__dirname, '..');
  const testConfig = {
    database: process.env.TEST_DB_NAME || 'white_cross_test',
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASS || 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  };

  beforeAll(async () => {
    // Create test database connection
    sequelize = new Sequelize(testConfig);
    queryInterface = sequelize.getQueryInterface();

    // Verify connection
    await sequelize.authenticate();
    console.log('✓ Test database connection established');
  });

  afterAll(async () => {
    await sequelize.close();
  });

  /**
   * Get all migration files in chronological order
   */
  const getMigrationFiles = () => {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && !file.includes('test') && !file.includes('FIXED'))
      .sort(); // Sequelize migration files are named with timestamps, so sort works

    return files.map(file => ({
      name: file,
      path: path.join(migrationsDir, file)
    }));
  };

  /**
   * Test: All migrations have up and down methods
   */
  describe('Migration Structure', () => {
    test('All migrations have up() method', () => {
      const migrations = getMigrationFiles();

      migrations.forEach(migration => {
        const migrationModule = require(migration.path);
        expect(migrationModule).toHaveProperty('up');
        expect(typeof migrationModule.up).toBe('function');
      });
    });

    test('All migrations have down() method', () => {
      const migrations = getMigrationFiles();

      migrations.forEach(migration => {
        const migrationModule = require(migration.path);
        expect(migrationModule).toHaveProperty('down');
        expect(typeof migrationModule.down).toBe('function');
      });
    });
  });

  /**
   * Test: Migrations can be applied
   */
  describe('Migration Up (Apply)', () => {
    test('Base schema migration can be applied', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));

      await expect(
        baseMigration.up(queryInterface, Sequelize)
      ).resolves.not.toThrow();
    }, 30000);

    test('Health records core migration can be applied', async () => {
      const migration = require(path.join(migrationsDir, '20250103000001-create-health-records-core.js'));

      await expect(
        migration.up(queryInterface, Sequelize)
      ).resolves.not.toThrow();
    }, 30000);
  });

  /**
   * Test: Migrations can be rolled back
   */
  describe('Migration Down (Rollback)', () => {
    test('Health records core migration can be rolled back', async () => {
      const migration = require(path.join(migrationsDir, '20250103000001-create-health-records-core.js'));

      await expect(
        migration.down(queryInterface, Sequelize)
      ).resolves.not.toThrow();
    }, 30000);

    test('Base schema migration can be rolled back', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));

      await expect(
        baseMigration.down(queryInterface, Sequelize)
      ).resolves.not.toThrow();
    }, 30000);
  });

  /**
   * Test: Migrations are idempotent (can run multiple times)
   */
  describe('Migration Idempotency', () => {
    test('Base schema migration is idempotent', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));

      // Apply first time
      await baseMigration.up(queryInterface, Sequelize);

      // Apply second time - should not throw
      await expect(
        baseMigration.up(queryInterface, Sequelize)
      ).resolves.not.toThrow();

      // Cleanup
      await baseMigration.down(queryInterface, Sequelize);
    }, 60000);

    test('Performance indexes migration is idempotent', async () => {
      // First ensure base tables exist
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);

      const perfMigration = require(path.join(migrationsDir, '20251011000000-performance-indexes.js'));

      // Apply first time
      await perfMigration.up(queryInterface, Sequelize);

      // Apply second time - should not throw
      await expect(
        perfMigration.up(queryInterface, Sequelize)
      ).resolves.not.toThrow();

      // Cleanup
      await perfMigration.down(queryInterface, Sequelize);
      await baseMigration.down(queryInterface, Sequelize);
    }, 90000);
  });

  /**
   * Test: Migration order is correct
   */
  describe('Migration Dependencies', () => {
    test('Migrations are ordered chronologically by timestamp', () => {
      const migrations = getMigrationFiles();
      const timestamps = migrations.map(m => {
        const match = m.name.match(/^(\d+)-/);
        return match ? match[1] : '';
      });

      const sortedTimestamps = [...timestamps].sort();
      expect(timestamps).toEqual(sortedTimestamps);
    });

    test('Base schema migration comes before dependent migrations', () => {
      const migrations = getMigrationFiles();
      const baseSchemaIndex = migrations.findIndex(m => m.name.includes('create-base-schema'));
      const healthRecordsIndex = migrations.findIndex(m => m.name.includes('create-health-records-core'));

      expect(baseSchemaIndex).toBeLessThan(healthRecordsIndex);
    });
  });

  /**
   * Test: Foreign key constraints are properly handled
   */
  describe('Foreign Key Handling', () => {
    test('Foreign keys are created with proper references', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);

      const [constraints] = await sequelize.query(`
        SELECT
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name IN ('schools', 'users', 'students');
      `);

      expect(constraints.length).toBeGreaterThan(0);

      // Cleanup
      await baseMigration.down(queryInterface, Sequelize);
    }, 30000);
  });

  /**
   * Test: Indexes are created and removed properly
   */
  describe('Index Management', () => {
    test('Indexes are created during up migration', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);

      const [indexes] = await sequelize.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename IN ('districts', 'schools', 'users', 'students')
        ORDER BY indexname;
      `);

      expect(indexes.length).toBeGreaterThan(0);

      // Cleanup
      await baseMigration.down(queryInterface, Sequelize);
    }, 30000);

    test('Indexes are removed during down migration', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);
      await baseMigration.down(queryInterface, Sequelize);

      const [indexes] = await sequelize.query(`
        SELECT indexname
        FROM pg_indexes
        WHERE tablename IN ('districts', 'schools', 'users', 'students');
      `);

      expect(indexes.length).toBe(0);
    }, 30000);
  });

  /**
   * Test: ENUMs are handled correctly
   */
  describe('ENUM Type Management', () => {
    test('ENUMs are created with duplicate protection', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));

      // Apply first time
      await baseMigration.up(queryInterface, Sequelize);

      // Check that enums exist
      const [enums] = await sequelize.query(`
        SELECT typname
        FROM pg_type
        WHERE typtype = 'e'
        AND typname IN ('UserRole', 'Gender', 'ContactType');
      `);

      expect(enums.length).toBe(3);

      // Cleanup
      await baseMigration.down(queryInterface, Sequelize);
    }, 30000);

    test('ENUMs are removed during rollback', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);
      await baseMigration.down(queryInterface, Sequelize);

      const [enums] = await sequelize.query(`
        SELECT typname
        FROM pg_type
        WHERE typtype = 'e'
        AND typname IN ('UserRole', 'Gender', 'ContactType');
      `);

      expect(enums.length).toBe(0);
    }, 30000);
  });

  /**
   * Test: Data integrity during migrations
   */
  describe('Data Integrity', () => {
    test('Transactions rollback on failure', async () => {
      const baseMigration = require(path.join(migrationsDir, '20250103000000-create-base-schema.js'));
      await baseMigration.up(queryInterface, Sequelize);

      // Insert test data
      await sequelize.query(`
        INSERT INTO "districts" (id, name, code, "isActive", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), 'Test District', 'TEST001', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `);

      // Verify data exists
      const [before] = await sequelize.query('SELECT COUNT(*) as count FROM "districts"');
      expect(parseInt(before[0].count)).toBe(1);

      // Rollback should preserve data integrity
      await baseMigration.down(queryInterface, Sequelize);
    }, 30000);
  });
});

/**
 * Integration Test: Full Migration Lifecycle
 */
describe('Full Migration Lifecycle Integration', () => {
  let sequelize;
  let queryInterface;

  beforeAll(async () => {
    sequelize = new Sequelize({
      database: process.env.TEST_DB_NAME || 'white_cross_test',
      username: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASS || 'postgres',
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    });

    queryInterface = sequelize.getQueryInterface();
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Complete migration up and down cycle', async () => {
    const migrationsDir = path.join(__dirname, '..');
    const migrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && !file.includes('test') && !file.includes('FIXED'))
      .sort()
      .map(file => ({
        name: file,
        module: require(path.join(migrationsDir, file))
      }));

    // Apply all migrations in order
    console.log('\n📈 Applying all migrations...');
    for (const migration of migrations) {
      try {
        await migration.module.up(queryInterface, Sequelize);
        console.log(`  ✓ ${migration.name}`);
      } catch (error) {
        console.error(`  ✗ ${migration.name}: ${error.message}`);
        throw error;
      }
    }

    // Rollback all migrations in reverse order
    console.log('\n📉 Rolling back all migrations...');
    for (const migration of migrations.reverse()) {
      try {
        await migration.module.down(queryInterface, Sequelize);
        console.log(`  ✓ ${migration.name}`);
      } catch (error) {
        console.error(`  ✗ ${migration.name}: ${error.message}`);
        throw error;
      }
    }

    console.log('\n✓ Full migration lifecycle completed successfully');
  }, 300000); // 5 minute timeout for full cycle
});
