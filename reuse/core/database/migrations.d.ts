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
import type { QueryInterface } from './sequelize';
/**
 * Migration interface
 */
export interface Migration {
    up: (queryInterface: QueryInterface, DataTypes: any) => Promise<void>;
    down: (queryInterface: QueryInterface, DataTypes: any) => Promise<void>;
}
/**
 * Migration metadata
 */
export interface MigrationMetadata {
    name: string;
    timestamp: number;
    version: string;
    description?: string;
}
/**
 * Migration status
 */
export interface MigrationStatus {
    name: string;
    executedAt: Date | null;
    status: 'pending' | 'executed' | 'failed';
    error?: string;
}
/**
 * Migration execution result
 */
export interface MigrationResult {
    success: boolean;
    migrations: string[];
    errors: Array<{
        migration: string;
        error: string;
    }>;
}
/**
 * Migration manager
 */
export declare class MigrationManager {
    private queryInterface;
    private migrations;
    private executedMigrations;
    private migrationsTableName;
    constructor(queryInterface: QueryInterface);
    /**
     * Register a migration
     */
    registerMigration(name: string, migration: Migration): void;
    /**
     * Register multiple migrations
     */
    registerMigrations(migrations: Record<string, Migration>): void;
    /**
     * Initialize migrations table
     */
    private initializeMigrationsTable;
    /**
     * Get executed migrations from database
     */
    private getExecutedMigrations;
    /**
     * Mark migration as executed
     */
    private markMigrationExecuted;
    /**
     * Mark migration as reverted
     */
    private markMigrationReverted;
    /**
     * Get pending migrations
     */
    getPendingMigrations(): Promise<string[]>;
    /**
     * Get migration status
     */
    getMigrationStatus(): Promise<MigrationStatus[]>;
    /**
     * Run pending migrations
     */
    up(options?: {
        to?: string;
        step?: number;
    }): Promise<MigrationResult>;
    /**
     * Rollback migrations
     */
    down(options?: {
        to?: string;
        step?: number;
    }): Promise<MigrationResult>;
    /**
     * Get data types helper (would be actual Sequelize DataTypes in production)
     */
    private getDataTypes;
}
/**
 * Migration builder utilities
 */
export declare class MigrationBuilder {
    /**
     * Create table migration
     */
    static createTable(tableName: string, columns: Record<string, any>, options?: any): Migration;
    /**
     * Drop table migration
     */
    static dropTable(tableName: string): Migration;
    /**
     * Add column migration
     */
    static addColumn(tableName: string, columnName: string, dataType: any): Migration;
    /**
     * Remove column migration
     */
    static removeColumn(tableName: string, columnName: string, dataType?: any): Migration;
    /**
     * Change column migration
     */
    static changeColumn(tableName: string, columnName: string, newDataType: any, oldDataType?: any): Migration;
    /**
     * Rename column migration
     */
    static renameColumn(tableName: string, oldName: string, newName: string): Migration;
    /**
     * Add index migration
     */
    static addIndex(tableName: string, columns: string[], options?: any): Migration;
    /**
     * Remove index migration
     */
    static removeIndex(tableName: string, indexName: string): Migration;
}
/**
 * Migration generator
 */
export declare class MigrationGenerator {
    /**
     * Generate migration name with timestamp
     */
    static generateName(description: string): string;
    /**
     * Generate migration template
     */
    static generateTemplate(name: string, description?: string): string;
}
/**
 * Migration validator
 */
export declare class MigrationValidator {
    /**
     * Validate migration structure
     */
    static validate(migration: any): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Validate migration order
     */
    static validateOrder(migrations: string[]): {
        valid: boolean;
        errors: string[];
    };
}
/**
 * Seed manager for database seeding
 */
export declare class SeedManager {
    private queryInterface;
    private seeds;
    constructor(queryInterface: QueryInterface);
    /**
     * Register a seed
     */
    registerSeed(name: string, seedFn: (qi: QueryInterface) => Promise<void>): void;
    /**
     * Run all seeds
     */
    runAll(): Promise<{
        success: boolean;
        executed: string[];
        errors: any[];
    }>;
    /**
     * Run specific seed
     */
    run(name: string): Promise<void>;
}
//# sourceMappingURL=migrations.d.ts.map