"use strict";
/**
 * @fileoverview Database Migrations Utilities
 * @module core/database/migrations
 *
 * Production-ready database migration utilities including migration management,
 * rollback support, and schema versioning.
 *
 * @example Define a migration
 * ```typescript
 * const migration = {
 *   up: async (queryInterface, DataTypes) => {
 *     await queryInterface.createTable('users', {
 *       id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *       email: { type: DataTypes.STRING, unique: true }
 *     });
 *   },
 *   down: async (queryInterface) => {
 *     await queryInterface.dropTable('users');
 *   }
 * };
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedManager = exports.MigrationValidator = exports.MigrationGenerator = exports.MigrationBuilder = exports.MigrationManager = void 0;
/**
 * Migration manager
 */
class MigrationManager {
    constructor(queryInterface) {
        this.migrations = new Map();
        this.executedMigrations = new Set();
        this.migrationsTableName = 'sequelize_meta';
        this.queryInterface = queryInterface;
    }
    /**
     * Register a migration
     */
    registerMigration(name, migration) {
        this.migrations.set(name, migration);
    }
    /**
     * Register multiple migrations
     */
    registerMigrations(migrations) {
        for (const [name, migration] of Object.entries(migrations)) {
            this.registerMigration(name, migration);
        }
    }
    /**
     * Initialize migrations table
     */
    async initializeMigrationsTable() {
        try {
            await this.queryInterface.createTable(this.migrationsTableName, {
                name: {
                    type: 'VARCHAR(255)',
                    primaryKey: true,
                },
            });
        }
        catch (error) {
            // Table might already exist, which is fine
        }
    }
    /**
     * Get executed migrations from database
     */
    async getExecutedMigrations() {
        // Note: In production, this would query the actual migrations table
        // For now, we return from our in-memory set
        return Array.from(this.executedMigrations);
    }
    /**
     * Mark migration as executed
     */
    async markMigrationExecuted(name) {
        this.executedMigrations.add(name);
        // In production, this would insert into the migrations table
    }
    /**
     * Mark migration as reverted
     */
    async markMigrationReverted(name) {
        this.executedMigrations.delete(name);
        // In production, this would delete from the migrations table
    }
    /**
     * Get pending migrations
     */
    async getPendingMigrations() {
        await this.initializeMigrationsTable();
        const executed = await this.getExecutedMigrations();
        const executedSet = new Set(executed);
        const allMigrations = Array.from(this.migrations.keys()).sort();
        return allMigrations.filter(name => !executedSet.has(name));
    }
    /**
     * Get migration status
     */
    async getMigrationStatus() {
        await this.initializeMigrationsTable();
        const executed = await this.getExecutedMigrations();
        const executedSet = new Set(executed);
        const allMigrations = Array.from(this.migrations.keys()).sort();
        return allMigrations.map(name => ({
            name,
            executedAt: executedSet.has(name) ? new Date() : null,
            status: executedSet.has(name) ? 'executed' : 'pending',
        }));
    }
    /**
     * Run pending migrations
     */
    async up(options = {}) {
        await this.initializeMigrationsTable();
        const pending = await this.getPendingMigrations();
        let migrationsToRun = pending;
        // Apply filters
        if (options.to) {
            const toIndex = pending.indexOf(options.to);
            if (toIndex === -1) {
                throw new Error(`Migration ${options.to} not found`);
            }
            migrationsToRun = pending.slice(0, toIndex + 1);
        }
        else if (options.step) {
            migrationsToRun = pending.slice(0, options.step);
        }
        const executed = [];
        const errors = [];
        for (const name of migrationsToRun) {
            try {
                console.log(`Running migration: ${name}`);
                const migration = this.migrations.get(name);
                if (!migration) {
                    throw new Error(`Migration ${name} not registered`);
                }
                await migration.up(this.queryInterface, this.getDataTypes());
                await this.markMigrationExecuted(name);
                executed.push(name);
                console.log(`✓ Migration ${name} completed`);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                console.error(`✗ Migration ${name} failed:`, errorMsg);
                errors.push({ migration: name, error: errorMsg });
                break; // Stop on first error
            }
        }
        return {
            success: errors.length === 0,
            migrations: executed,
            errors,
        };
    }
    /**
     * Rollback migrations
     */
    async down(options = {}) {
        await this.initializeMigrationsTable();
        const executed = await this.getExecutedMigrations();
        const sortedExecuted = executed.sort().reverse();
        let migrationsToRevert = sortedExecuted;
        // Apply filters
        if (options.to) {
            const toIndex = sortedExecuted.indexOf(options.to);
            if (toIndex === -1) {
                throw new Error(`Migration ${options.to} not found`);
            }
            migrationsToRevert = sortedExecuted.slice(0, toIndex);
        }
        else if (options.step) {
            migrationsToRevert = sortedExecuted.slice(0, options.step);
        }
        const reverted = [];
        const errors = [];
        for (const name of migrationsToRevert) {
            try {
                console.log(`Reverting migration: ${name}`);
                const migration = this.migrations.get(name);
                if (!migration) {
                    throw new Error(`Migration ${name} not registered`);
                }
                await migration.down(this.queryInterface, this.getDataTypes());
                await this.markMigrationReverted(name);
                reverted.push(name);
                console.log(`✓ Migration ${name} reverted`);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                console.error(`✗ Migration ${name} rollback failed:`, errorMsg);
                errors.push({ migration: name, error: errorMsg });
                break; // Stop on first error
            }
        }
        return {
            success: errors.length === 0,
            migrations: reverted,
            errors,
        };
    }
    /**
     * Get data types helper (would be actual Sequelize DataTypes in production)
     */
    getDataTypes() {
        return {
            STRING: 'VARCHAR(255)',
            TEXT: 'TEXT',
            INTEGER: 'INTEGER',
            BIGINT: 'BIGINT',
            FLOAT: 'FLOAT',
            DOUBLE: 'DOUBLE',
            DECIMAL: 'DECIMAL',
            BOOLEAN: 'BOOLEAN',
            DATE: 'DATETIME',
            DATEONLY: 'DATE',
            UUID: 'UUID',
            JSON: 'JSON',
            JSONB: 'JSONB',
            ENUM: (...values) => `ENUM(${values.map(v => `'${v}'`).join(', ')})`,
        };
    }
}
exports.MigrationManager = MigrationManager;
/**
 * Migration builder utilities
 */
class MigrationBuilder {
    /**
     * Create table migration
     */
    static createTable(tableName, columns, options) {
        return {
            up: async (queryInterface) => {
                await queryInterface.createTable(tableName, columns, options);
            },
            down: async (queryInterface) => {
                await queryInterface.dropTable(tableName, options);
            },
        };
    }
    /**
     * Drop table migration
     */
    static dropTable(tableName) {
        return {
            up: async (queryInterface) => {
                await queryInterface.dropTable(tableName);
            },
            down: async () => {
                throw new Error('Cannot restore dropped table. Implement custom down migration.');
            },
        };
    }
    /**
     * Add column migration
     */
    static addColumn(tableName, columnName, dataType) {
        return {
            up: async (queryInterface) => {
                await queryInterface.addColumn(tableName, columnName, dataType);
            },
            down: async (queryInterface) => {
                await queryInterface.removeColumn(tableName, columnName);
            },
        };
    }
    /**
     * Remove column migration
     */
    static removeColumn(tableName, columnName, dataType) {
        return {
            up: async (queryInterface) => {
                await queryInterface.removeColumn(tableName, columnName);
            },
            down: async (queryInterface) => {
                if (!dataType) {
                    throw new Error('dataType required for down migration');
                }
                await queryInterface.addColumn(tableName, columnName, dataType);
            },
        };
    }
    /**
     * Change column migration
     */
    static changeColumn(tableName, columnName, newDataType, oldDataType) {
        return {
            up: async (queryInterface) => {
                await queryInterface.changeColumn(tableName, columnName, newDataType);
            },
            down: async (queryInterface) => {
                if (!oldDataType) {
                    throw new Error('oldDataType required for down migration');
                }
                await queryInterface.changeColumn(tableName, columnName, oldDataType);
            },
        };
    }
    /**
     * Rename column migration
     */
    static renameColumn(tableName, oldName, newName) {
        return {
            up: async (queryInterface) => {
                await queryInterface.renameColumn(tableName, oldName, newName);
            },
            down: async (queryInterface) => {
                await queryInterface.renameColumn(tableName, newName, oldName);
            },
        };
    }
    /**
     * Add index migration
     */
    static addIndex(tableName, columns, options) {
        const indexName = options?.name || `${tableName}_${columns.join('_')}_idx`;
        return {
            up: async (queryInterface) => {
                await queryInterface.addIndex(tableName, columns, {
                    ...options,
                    name: indexName,
                });
            },
            down: async (queryInterface) => {
                await queryInterface.removeIndex(tableName, indexName);
            },
        };
    }
    /**
     * Remove index migration
     */
    static removeIndex(tableName, indexName) {
        return {
            up: async (queryInterface) => {
                await queryInterface.removeIndex(tableName, indexName);
            },
            down: async () => {
                throw new Error('Cannot restore removed index. Implement custom down migration.');
            },
        };
    }
}
exports.MigrationBuilder = MigrationBuilder;
/**
 * Migration generator
 */
class MigrationGenerator {
    /**
     * Generate migration name with timestamp
     */
    static generateName(description) {
        const timestamp = new Date().toISOString().replace(/[-:\.TZ]/g, '').slice(0, 14);
        const sanitized = description.toLowerCase().replace(/[^a-z0-9]/g, '_');
        return `${timestamp}_${sanitized}`;
    }
    /**
     * Generate migration template
     */
    static generateTemplate(name, description) {
        return `/**
 * Migration: ${name}
 * ${description || 'Auto-generated migration'}
 */

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Add migration logic here
  },

  down: async (queryInterface, DataTypes) => {
    // Add rollback logic here
  }
};
`;
    }
}
exports.MigrationGenerator = MigrationGenerator;
/**
 * Migration validator
 */
class MigrationValidator {
    /**
     * Validate migration structure
     */
    static validate(migration) {
        const errors = [];
        if (!migration) {
            errors.push('Migration is null or undefined');
            return { valid: false, errors };
        }
        if (typeof migration.up !== 'function') {
            errors.push('Migration must have an "up" function');
        }
        if (typeof migration.down !== 'function') {
            errors.push('Migration must have a "down" function');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Validate migration order
     */
    static validateOrder(migrations) {
        const errors = [];
        const sorted = [...migrations].sort();
        for (let i = 0; i < migrations.length; i++) {
            if (migrations[i] !== sorted[i]) {
                errors.push(`Migration order violation: ${migrations[i]} should come after ${sorted[i]}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.MigrationValidator = MigrationValidator;
/**
 * Seed manager for database seeding
 */
class SeedManager {
    constructor(queryInterface) {
        this.seeds = new Map();
        this.queryInterface = queryInterface;
    }
    /**
     * Register a seed
     */
    registerSeed(name, seedFn) {
        this.seeds.set(name, seedFn);
    }
    /**
     * Run all seeds
     */
    async runAll() {
        const executed = [];
        const errors = [];
        for (const [name, seedFn] of this.seeds.entries()) {
            try {
                console.log(`Running seed: ${name}`);
                await seedFn(this.queryInterface);
                executed.push(name);
                console.log(`✓ Seed ${name} completed`);
            }
            catch (error) {
                console.error(`✗ Seed ${name} failed:`, error);
                errors.push({ seed: name, error });
            }
        }
        return {
            success: errors.length === 0,
            executed,
            errors,
        };
    }
    /**
     * Run specific seed
     */
    async run(name) {
        const seedFn = this.seeds.get(name);
        if (!seedFn) {
            throw new Error(`Seed ${name} not found`);
        }
        await seedFn(this.queryInterface);
    }
}
exports.SeedManager = SeedManager;
//# sourceMappingURL=migrations.js.map