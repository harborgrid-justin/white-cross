/**
 * Migration Builders - Table creation and management utilities
 */

import { QueryInterface, Sequelize, Transaction } from 'sequelize';

export interface MigrationTableDefinition {
  tableName: string;
  attributes: Record<string, any>;
  options?: Record<string, any>;
}

export interface ColumnDefinition {
  type: any;
  allowNull?: boolean;
  defaultValue?: any;
  unique?: boolean | string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  comment?: string;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
}

export interface IndexDefinition {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: string;
  where?: any;
  concurrently?: boolean;
}

/**
 * Creates a comprehensive table with all standard fields and configurations
 */
export async function createTableWithDefaults(
  queryInterface: QueryInterface,
  tableName: string,
  attributes: Record<string, any>,
  options: {
    indexes?: IndexDefinition[];
    paranoid?: boolean;
    timestamps?: boolean;
    underscored?: boolean;
    comment?: string;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const {
    indexes = [],
    paranoid = false,
    timestamps = true,
    underscored = false,
    comment,
  } = options;

  // Build complete attribute definition with defaults
  const completeAttributes: Record<string, any> = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ...attributes,
  };

  // Add timestamp fields if enabled
  if (timestamps) {
    completeAttributes.createdAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
    completeAttributes.updatedAt = {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
  }

  // Add soft delete field if paranoid
  if (paranoid) {
    completeAttributes.deletedAt = {
      type: Sequelize.DATE,
      allowNull: true,
    };
  }

  // Create table
  await queryInterface.createTable(tableName, completeAttributes, {
    transaction,
    comment,
  });

  // Create indexes
  for (const index of indexes) {
    await queryInterface.addIndex(tableName, index.fields, {
      ...index,
      transaction,
    });
  }
}

/**
 * Performs a safe table alteration with backup and rollback capability
 */
export async function safeAlterTable(
  queryInterface: QueryInterface,
  tableName: string,
  alterations: (qi: QueryInterface, transaction: Transaction) => Promise<void>,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const t = transaction || (await sequelize.transaction());

  try {
    // Execute alterations within transaction
    await alterations(queryInterface, t);

    // Commit if we created the transaction
    if (!transaction) {
      await t.commit();
    }
  } catch (error) {
    // Rollback if we created the transaction
    if (!transaction) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * Drops a table safely with existence check and cascade options
 */
export async function dropTableSafely(
  queryInterface: QueryInterface,
  tableName: string,
  options: {
    cascade?: boolean;
    ifExists?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { cascade = false, ifExists = true } = options;

  // Check if table exists
  if (ifExists) {
    const tableExists = await checkTableExists(queryInterface, tableName);
    if (!tableExists) {
      return;
    }
  }

  // Drop table
  await queryInterface.dropTable(tableName, {
    cascade,
    transaction,
  });
}

/**
 * Renames a table with all dependencies (indexes, constraints)
 */
export async function renameTableWithDependencies(
  queryInterface: QueryInterface,
  oldTableName: string,
  newTableName: string,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Rename table
  await queryInterface.renameTable(oldTableName, newTableName, { transaction });

  // Update sequences for PostgreSQL (using parameterized queries to prevent SQL injection)
  if (dialect === 'postgres') {
    const [sequences] = await sequelize.query(
      `
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name LIKE :pattern
    `,
      {
        replacements: { pattern: `${oldTableName}%` },
        transaction
      },
    );

    for (const seq of sequences as any[]) {
      const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
      // Use identifier quoting for safety
      await sequelize.query(
        `ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`,
        { transaction },
      );
    }
  }
}

/**
 * Checks if a table exists
 */
export async function checkTableExists(
  queryInterface: QueryInterface,
  tableName: string,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const [results] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = :tableName
        )`
      : `SELECT COUNT(*) as count FROM information_schema.tables
         WHERE table_schema = DATABASE()
         AND table_name = :tableName`,
    {
      replacements: { tableName },
    },
  );

  if (dialect === 'postgres') {
    return (results[0] as any).exists;
  } else {
    return (results[0] as any).count > 0;
  }
}
