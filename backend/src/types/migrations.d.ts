/**
 * Sequelize Migration Type Definitions
 *
 * Provides TypeScript type definitions for Sequelize migration files.
 * These types ensure type safety when working with database migrations.
 *
 * @module types/migrations
 */

import { QueryInterface, Sequelize, DataTypes, Transaction } from 'sequelize';

/**
 * Sequelize QueryInterface for migrations
 */
export type MigrationQueryInterface = QueryInterface;

/**
 * Sequelize instance passed to migrations
 */
export type MigrationSequelize = typeof Sequelize;

/**
 * DataTypes available in migrations
 */
export type MigrationDataTypes = typeof DataTypes;

/**
 * Transaction options for migration operations
 */
export interface MigrationTransactionOptions {
  /**
   * Transaction instance for atomic operations
   */
  transaction?: Transaction;
}

/**
 * Migration context passed to up/down functions
 */
export interface MigrationContext {
  /**
   * Sequelize query interface
   */
  queryInterface: QueryInterface;

  /**
   * Sequelize constructor
   */
  Sequelize: typeof Sequelize;
}

/**
 * Standard migration module export
 */
export interface Migration {
  /**
   * Apply migration (forward)
   *
   * @param queryInterface - Sequelize query interface
   * @param Sequelize - Sequelize constructor
   * @returns Promise that resolves when migration is complete
   */
  up(queryInterface: QueryInterface, Sequelize: typeof Sequelize): Promise<void>;

  /**
   * Revert migration (rollback)
   *
   * @param queryInterface - Sequelize query interface
   * @param Sequelize - Sequelize constructor
   * @returns Promise that resolves when rollback is complete
   */
  down(queryInterface: QueryInterface, Sequelize: typeof Sequelize): Promise<void>;
}

/**
 * Table column definition for migrations
 */
export interface MigrationColumnDefinition {
  type: any;
  allowNull?: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean | string;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
  comment?: string;
  validate?: Record<string, any>;
}

/**
 * Table definition for creating tables in migrations
 */
export interface MigrationTableDefinition {
  [columnName: string]: MigrationColumnDefinition;
}

/**
 * Index options for creating indexes
 */
export interface MigrationIndexOptions {
  name?: string;
  unique?: boolean;
  concurrently?: boolean;
  using?: string;
  where?: Record<string, any>;
  fields: Array<string | { name: string; length?: number; order?: 'ASC' | 'DESC' }>;
}

/**
 * Foreign key constraint options
 */
export interface MigrationForeignKeyOptions {
  type: 'foreign key';
  name?: string;
  references: {
    table: string;
    field: string;
  };
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}
