/**
 * LOC: S1C2H3E4M5
 * File: /reuse/sequelize-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - fs (native)
 *   - path (native)
 *
 * DOWNSTREAM (imported by):
 *   - Migration generators
 *   - Schema validators
 *   - Database introspection tools
 */
/**
 * File: /reuse/sequelize-schema-kit.ts
 * Locator: WC-UTL-SEQ-SKIT-001
 * Purpose: Sequelize Schema Kit - Advanced schema generation and introspection utilities
 *
 * Upstream: sequelize v6.x, fs, path
 * Downstream: All migrations, schema generators, database introspection, and DDL utilities
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 schema utilities for generation, validation, introspection, and DDL operations
 *
 * LLM Context: Production-grade Sequelize v6.x schema toolkit for White Cross healthcare platform.
 * Provides advanced helpers for schema generation, table creation, column definitions, migration helpers,
 * schema validation, data type conversions, schema introspection, table utilities, constraint management,
 * and DDL operations. HIPAA-compliant with comprehensive audit trails and data integrity enforcement.
 */
import { QueryInterface, Sequelize, Transaction, Model, ModelStatic, DataType } from 'sequelize';
/**
 * Schema metadata
 */
export interface SchemaMetadata {
    name: string;
    owner?: string;
    comment?: string;
    created?: Date;
    modified?: Date;
}
/**
 * Table definition
 */
export interface TableDefinition {
    tableName: string;
    schema?: string;
    columns: ColumnDefinition[];
    indexes?: IndexDefinition[];
    constraints?: ConstraintDefinition[];
    options?: TableOptions;
}
/**
 * Column definition
 */
export interface ColumnDefinition {
    name: string;
    type: string;
    allowNull?: boolean;
    defaultValue?: any;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    unique?: boolean;
    references?: {
        table: string;
        key: string;
    };
    onUpdate?: string;
    onDelete?: string;
    comment?: string;
}
/**
 * Index definition
 */
export interface IndexDefinition {
    name?: string;
    fields: (string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    })[];
    unique?: boolean;
    type?: string;
    where?: any;
    concurrently?: boolean;
    comment?: string;
}
/**
 * Constraint definition
 */
export interface ConstraintDefinition {
    name: string;
    type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'EXCLUSION';
    fields: string[];
    references?: {
        table: string;
        fields: string[];
    };
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    condition?: string;
    deferrable?: boolean;
}
/**
 * Table options
 */
export interface TableOptions {
    engine?: string;
    charset?: string;
    collate?: string;
    comment?: string;
    rowFormat?: string;
}
/**
 * Schema comparison result
 */
export interface SchemaComparison {
    added: {
        tables: string[];
        columns: Array<{
            table: string;
            column: string;
        }>;
        indexes: Array<{
            table: string;
            index: string;
        }>;
    };
    removed: {
        tables: string[];
        columns: Array<{
            table: string;
            column: string;
        }>;
        indexes: Array<{
            table: string;
            index: string;
        }>;
    };
    modified: {
        columns: Array<{
            table: string;
            column: string;
            changes: any;
        }>;
        indexes: Array<{
            table: string;
            index: string;
            changes: any;
        }>;
    };
}
/**
 * Migration operation
 */
export interface MigrationOperation {
    type: 'CREATE_TABLE' | 'DROP_TABLE' | 'ADD_COLUMN' | 'REMOVE_COLUMN' | 'CHANGE_COLUMN' | 'ADD_INDEX' | 'REMOVE_INDEX';
    table: string;
    details: any;
}
/**
 * Data type mapping
 */
export interface DataTypeMapping {
    sequelize: string;
    mysql?: string;
    postgres?: string;
    sqlite?: string;
    mssql?: string;
}
/**
 * Schema introspection result
 */
export interface IntrospectionResult {
    tables: TableIntrospection[];
    views: ViewIntrospection[];
    sequences: SequenceIntrospection[];
    functions: FunctionIntrospection[];
}
/**
 * Table introspection details
 */
export interface TableIntrospection {
    name: string;
    schema?: string;
    columns: ColumnIntrospection[];
    indexes: IndexIntrospection[];
    constraints: ConstraintIntrospection[];
    rowCount?: number;
    size?: string;
}
/**
 * Column introspection details
 */
export interface ColumnIntrospection {
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: any;
    isPrimaryKey: boolean;
    isAutoIncrement: boolean;
    comment?: string;
}
/**
 * Index introspection details
 */
export interface IndexIntrospection {
    name: string;
    columns: string[];
    unique: boolean;
    type?: string;
    condition?: string;
}
/**
 * Constraint introspection details
 */
export interface ConstraintIntrospection {
    name: string;
    type: string;
    columns: string[];
    referencedTable?: string;
    referencedColumns?: string[];
    onUpdate?: string;
    onDelete?: string;
}
/**
 * View introspection details
 */
export interface ViewIntrospection {
    name: string;
    schema?: string;
    definition: string;
    columns: string[];
}
/**
 * Sequence introspection details
 */
export interface SequenceIntrospection {
    name: string;
    schema?: string;
    startValue: number;
    incrementBy: number;
    minValue?: number;
    maxValue?: number;
    currentValue?: number;
}
/**
 * Function introspection details
 */
export interface FunctionIntrospection {
    name: string;
    schema?: string;
    returnType: string;
    parameters: Array<{
        name: string;
        type: string;
    }>;
    definition: string;
}
/**
 * Generates a complete database schema from models.
 * Creates all tables, indexes, and constraints.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ModelStatic<any>[]} models - Models to generate schema for
 * @param {object} options - Generation options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateSchema(sequelize, [User, Post, Comment], {
 *   force: false,
 *   alter: true
 * });
 * ```
 */
export declare function generateSchema(sequelize: Sequelize, models: ModelStatic<any>[], options?: {
    force?: boolean;
    alter?: boolean;
}): Promise<void>;
/**
 * Generates DDL statements for a model.
 * Returns SQL CREATE TABLE statement.
 *
 * @param {ModelStatic<T>} model - Model to generate DDL for
 * @param {QueryInterface} queryInterface - Query interface
 * @returns {Promise<string>} DDL statement
 *
 * @example
 * ```typescript
 * const ddl = await generateModelDDL(User, sequelize.getQueryInterface());
 * console.log(ddl); // CREATE TABLE users (...)
 * ```
 */
export declare function generateModelDDL<T extends Model>(model: ModelStatic<T>, queryInterface: QueryInterface): Promise<string>;
/**
 * Generates a migration file from schema changes.
 * Creates timestamped migration file.
 *
 * @param {string} migrationName - Migration name
 * @param {MigrationOperation[]} operations - Migration operations
 * @param {string} migrationsDir - Migrations directory
 * @returns {Promise<string>} Generated file path
 *
 * @example
 * ```typescript
 * const filePath = await generateMigrationFile('add-users-table', [
 *   { type: 'CREATE_TABLE', table: 'users', details: {...} }
 * ], './migrations');
 * ```
 */
export declare function generateMigrationFile(migrationName: string, operations: MigrationOperation[], migrationsDir: string): Promise<string>;
/**
 * Generates code for a migration operation.
 * Creates queryInterface method calls.
 *
 * @param {MigrationOperation} operation - Migration operation
 * @param {string} direction - 'up' or 'down'
 * @returns {string} Generated code
 *
 * @example
 * ```typescript
 * const code = generateOperationCode({
 *   type: 'ADD_COLUMN',
 *   table: 'users',
 *   details: { name: 'email', type: DataTypes.STRING }
 * }, 'up');
 * ```
 */
export declare function generateOperationCode(operation: MigrationOperation, direction: 'up' | 'down'): string;
/**
 * Generates schema documentation in Markdown format.
 * Creates comprehensive schema reference.
 *
 * @param {ModelStatic<any>[]} models - Models to document
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateSchemaDocumentation([User, Post, Comment]);
 * await fs.promises.writeFile('SCHEMA.md', docs);
 * ```
 */
export declare function generateSchemaDocumentation(models: ModelStatic<any>[]): string;
/**
 * Creates a table with comprehensive configuration.
 * Supports all table options and constraints.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {TableDefinition} definition - Table definition
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTable(queryInterface, {
 *   tableName: 'users',
 *   columns: [
 *     { name: 'id', type: 'UUID', primaryKey: true },
 *     { name: 'email', type: 'STRING', unique: true }
 *   ]
 * }, transaction);
 * ```
 */
export declare function createTable(queryInterface: QueryInterface, definition: TableDefinition, transaction?: Transaction): Promise<void>;
/**
 * Creates a table if it doesn't exist.
 * Checks for existence before creation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {any} attributes - Table attributes
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<boolean>} Whether table was created
 *
 * @example
 * ```typescript
 * const created = await createTableIfNotExists(
 *   queryInterface,
 *   'users',
 *   { id: { type: DataTypes.UUID, primaryKey: true } },
 *   transaction
 * );
 * ```
 */
export declare function createTableIfNotExists(queryInterface: QueryInterface, tableName: string, attributes: any, transaction?: Transaction): Promise<boolean>;
/**
 * Drops a table if it exists.
 * Safely drops table without errors.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<boolean>} Whether table was dropped
 *
 * @example
 * ```typescript
 * const dropped = await dropTableIfExists(queryInterface, 'old_users', transaction);
 * ```
 */
export declare function dropTableIfExists(queryInterface: QueryInterface, tableName: string, transaction?: Transaction): Promise<boolean>;
/**
 * Renames a table atomically.
 * Preserves data and constraints.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} oldName - Old table name
 * @param {string} newName - New table name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameTable(queryInterface, 'users', 'app_users', transaction);
 * ```
 */
export declare function renameTable(queryInterface: QueryInterface, oldName: string, newName: string, transaction?: Transaction): Promise<void>;
/**
 * Copies a table structure (without data).
 * Creates a new table with the same schema.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} sourceTable - Source table name
 * @param {string} targetTable - Target table name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyTableStructure(queryInterface, 'users', 'users_backup', transaction);
 * ```
 */
export declare function copyTableStructure(queryInterface: QueryInterface, sourceTable: string, targetTable: string, transaction?: Transaction): Promise<void>;
/**
 * Clones a table with data.
 * Creates exact copy including all rows.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTable - Source table name
 * @param {string} targetTable - Target table name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<number>} Number of rows copied
 *
 * @example
 * ```typescript
 * const rowCount = await cloneTable(sequelize, 'users', 'users_archive', transaction);
 * ```
 */
export declare function cloneTable(sequelize: Sequelize, sourceTable: string, targetTable: string, transaction?: Transaction): Promise<number>;
/**
 * Adds a column to an existing table.
 * Supports all column attributes.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {ColumnDefinition} column - Column definition
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumn(queryInterface, 'users', {
 *   name: 'phone',
 *   type: 'STRING',
 *   allowNull: true
 * }, transaction);
 * ```
 */
export declare function addColumn(queryInterface: QueryInterface, tableName: string, column: ColumnDefinition, transaction?: Transaction): Promise<void>;
/**
 * Adds multiple columns to a table.
 * Batch column addition for efficiency.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {ColumnDefinition[]} columns - Column definitions
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumns(queryInterface, 'users', [
 *   { name: 'firstName', type: 'STRING' },
 *   { name: 'lastName', type: 'STRING' }
 * ], transaction);
 * ```
 */
export declare function addColumns(queryInterface: QueryInterface, tableName: string, columns: ColumnDefinition[], transaction?: Transaction): Promise<void>;
/**
 * Removes a column from a table.
 * Safely drops column and related constraints.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeColumn(queryInterface, 'users', 'oldField', transaction);
 * ```
 */
export declare function removeColumn(queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction): Promise<void>;
/**
 * Renames a column.
 * Preserves data type and constraints.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} oldName - Old column name
 * @param {string} newName - New column name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameColumn(queryInterface, 'users', 'name', 'fullName', transaction);
 * ```
 */
export declare function renameColumn(queryInterface: QueryInterface, tableName: string, oldName: string, newName: string, transaction?: Transaction): Promise<void>;
/**
 * Changes column type and attributes.
 * Modifies existing column definition.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {ColumnDefinition} column - New column definition
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeColumn(queryInterface, 'users', {
 *   name: 'email',
 *   type: 'STRING',
 *   allowNull: false,
 *   unique: true
 * }, transaction);
 * ```
 */
export declare function changeColumn(queryInterface: QueryInterface, tableName: string, column: ColumnDefinition, transaction?: Transaction): Promise<void>;
/**
 * Adds a column if it doesn't exist.
 * Idempotent column addition.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {ColumnDefinition} column - Column definition
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<boolean>} Whether column was added
 *
 * @example
 * ```typescript
 * const added = await addColumnIfNotExists(queryInterface, 'users', {
 *   name: 'phone',
 *   type: 'STRING'
 * }, transaction);
 * ```
 */
export declare function addColumnIfNotExists(queryInterface: QueryInterface, tableName: string, column: ColumnDefinition, transaction?: Transaction): Promise<boolean>;
/**
 * Removes a column if it exists.
 * Idempotent column removal.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<boolean>} Whether column was removed
 *
 * @example
 * ```typescript
 * const removed = await removeColumnIfExists(queryInterface, 'users', 'oldField', transaction);
 * ```
 */
export declare function removeColumnIfExists(queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction): Promise<boolean>;
/**
 * Creates a reversible migration operation.
 * Ensures migrations can be rolled back.
 *
 * @param {Function} upFn - Migration up function
 * @param {Function} downFn - Migration down function
 * @returns {object} Migration object
 *
 * @example
 * ```typescript
 * const migration = createReversibleMigration(
 *   async (qi, t) => await qi.createTable('users', {...}, { transaction: t }),
 *   async (qi, t) => await qi.dropTable('users', { transaction: t })
 * );
 * ```
 */
export declare function createReversibleMigration(upFn: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>, downFn: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>): {
    up(queryInterface: QueryInterface, transaction: Transaction): Promise<void>;
    down(queryInterface: QueryInterface, transaction: Transaction): Promise<void>;
};
/**
 * Executes a migration safely within a transaction.
 * Rolls back on error.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} migrationFn - Migration function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeSafeMigration(sequelize, async (qi, t) => {
 *   await qi.createTable('users', {...}, { transaction: t });
 *   await qi.addIndex('users', ['email'], { transaction: t });
 * });
 * ```
 */
export declare function executeSafeMigration(sequelize: Sequelize, migrationFn: (queryInterface: QueryInterface, transaction: Transaction) => Promise<void>): Promise<void>;
/**
 * Creates a batch migration for multiple operations.
 * Executes all operations in a single transaction.
 *
 * @param {MigrationOperation[]} operations - Migration operations
 * @returns {object} Batch migration object
 *
 * @example
 * ```typescript
 * const migration = createBatchMigration([
 *   { type: 'CREATE_TABLE', table: 'users', details: {...} },
 *   { type: 'ADD_INDEX', table: 'users', details: {...} }
 * ]);
 * ```
 */
export declare function createBatchMigration(operations: MigrationOperation[]): {
    up(queryInterface: QueryInterface, transaction: Transaction): Promise<void>;
    down(queryInterface: QueryInterface, transaction: Transaction): Promise<void>;
};
/**
 * Executes a single migration operation.
 * Handles operation type and direction.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {MigrationOperation} operation - Migration operation
 * @param {string} direction - 'up' or 'down'
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeMigrationOperation(
 *   queryInterface,
 *   { type: 'ADD_COLUMN', table: 'users', details: {...} },
 *   'up',
 *   transaction
 * );
 * ```
 */
export declare function executeMigrationOperation(queryInterface: QueryInterface, operation: MigrationOperation, direction: 'up' | 'down', transaction: Transaction): Promise<void>;
/**
 * Validates table definition.
 * Checks for errors and inconsistencies.
 *
 * @param {TableDefinition} definition - Table definition
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateTableDefinition({
 *   tableName: 'users',
 *   columns: [...]
 * });
 * if (errors.length > 0) console.error('Invalid table:', errors);
 * ```
 */
export declare function validateTableDefinition(definition: TableDefinition): string[];
/**
 * Validates column definition.
 * Ensures column attributes are valid.
 *
 * @param {ColumnDefinition} column - Column definition
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateColumnDefinition({
 *   name: 'email',
 *   type: 'STRING',
 *   unique: true
 * });
 * ```
 */
export declare function validateColumnDefinition(column: ColumnDefinition): string[];
/**
 * Validates index definition.
 * Checks index configuration.
 *
 * @param {IndexDefinition} index - Index definition
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateIndexDefinition({
 *   fields: ['email'],
 *   unique: true
 * });
 * ```
 */
export declare function validateIndexDefinition(index: IndexDefinition): string[];
/**
 * Validates constraint definition.
 * Ensures constraint is properly configured.
 *
 * @param {ConstraintDefinition} constraint - Constraint definition
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateConstraintDefinition({
 *   type: 'FOREIGN KEY',
 *   fields: ['userId'],
 *   references: { table: 'users', fields: ['id'] }
 * });
 * ```
 */
export declare function validateConstraintDefinition(constraint: ConstraintDefinition): string[];
/**
 * Parses a string data type to Sequelize DataType.
 * Converts type strings to DataTypes objects.
 *
 * @param {string} typeString - Data type string
 * @returns {DataType} Sequelize data type
 *
 * @example
 * ```typescript
 * const type = parseDataType('STRING(100)'); // DataTypes.STRING(100)
 * const uuidType = parseDataType('UUID'); // DataTypes.UUID
 * ```
 */
export declare function parseDataType(typeString: string): DataType;
/**
 * Converts Sequelize DataType to database-specific type.
 * Returns native database type string.
 *
 * @param {DataType} dataType - Sequelize data type
 * @param {string} dialect - Database dialect
 * @returns {string} Database type string
 *
 * @example
 * ```typescript
 * const mysqlType = dataTypeToNative(DataTypes.UUID, 'mysql'); // 'CHAR(36)'
 * const pgType = dataTypeToNative(DataTypes.UUID, 'postgres'); // 'UUID'
 * ```
 */
export declare function dataTypeToNative(dataType: DataType, dialect: string): string;
/**
 * Converts a column type from one dialect to another.
 * Useful for database migrations.
 *
 * @param {string} columnType - Source column type
 * @param {string} sourceDialect - Source database dialect
 * @param {string} targetDialect - Target database dialect
 * @returns {string} Converted column type
 *
 * @example
 * ```typescript
 * const pgType = convertColumnType('CHAR(36)', 'mysql', 'postgres'); // 'UUID'
 * ```
 */
export declare function convertColumnType(columnType: string, sourceDialect: string, targetDialect: string): string;
/**
 * Introspects database schema.
 * Returns complete schema information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} schemaName - Schema name (optional)
 * @returns {Promise<IntrospectionResult>} Schema introspection result
 *
 * @example
 * ```typescript
 * const schema = await introspectSchema(sequelize);
 * console.log(schema.tables, schema.views);
 * ```
 */
export declare function introspectSchema(sequelize: Sequelize, schemaName?: string): Promise<IntrospectionResult>;
/**
 * Introspects all tables in database.
 * Returns detailed table information.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} schema - Schema name (optional)
 * @returns {Promise<TableIntrospection[]>} Table introspection results
 *
 * @example
 * ```typescript
 * const tables = await introspectTables(queryInterface);
 * for (const table of tables) {
 *   console.log(table.name, table.columns);
 * }
 * ```
 */
export declare function introspectTables(queryInterface: QueryInterface, schema?: string): Promise<TableIntrospection[]>;
/**
 * Introspects database views.
 * Returns view definitions and metadata.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} schema - Schema name (optional)
 * @returns {Promise<ViewIntrospection[]>} View introspection results
 *
 * @example
 * ```typescript
 * const views = await introspectViews(sequelize);
 * ```
 */
export declare function introspectViews(sequelize: Sequelize, schema?: string): Promise<ViewIntrospection[]>;
/**
 * Introspects database sequences.
 * Returns sequence configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} schema - Schema name (optional)
 * @returns {Promise<SequenceIntrospection[]>} Sequence introspection results
 *
 * @example
 * ```typescript
 * const sequences = await introspectSequences(sequelize);
 * ```
 */
export declare function introspectSequences(sequelize: Sequelize, schema?: string): Promise<SequenceIntrospection[]>;
/**
 * Introspects database functions.
 * Returns function definitions and signatures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} schema - Schema name (optional)
 * @returns {Promise<FunctionIntrospection[]>} Function introspection results
 *
 * @example
 * ```typescript
 * const functions = await introspectFunctions(sequelize);
 * ```
 */
export declare function introspectFunctions(sequelize: Sequelize, schema?: string): Promise<FunctionIntrospection[]>;
/**
 * Checks if a table exists in the database.
 * Returns boolean indicating existence.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @returns {Promise<boolean>} Whether table exists
 *
 * @example
 * ```typescript
 * if (await tableExists(queryInterface, 'users')) {
 *   console.log('Users table exists');
 * }
 * ```
 */
export declare function tableExists(queryInterface: QueryInterface, tableName: string): Promise<boolean>;
/**
 * Checks if a column exists in a table.
 * Returns boolean indicating existence.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @returns {Promise<boolean>} Whether column exists
 *
 * @example
 * ```typescript
 * if (await columnExists(queryInterface, 'users', 'email')) {
 *   console.log('Email column exists');
 * }
 * ```
 */
export declare function columnExists(queryInterface: QueryInterface, tableName: string, columnName: string): Promise<boolean>;
/**
 * Checks if an index exists on a table.
 * Returns boolean indicating existence.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @returns {Promise<boolean>} Whether index exists
 *
 * @example
 * ```typescript
 * if (await indexExists(queryInterface, 'users', 'users_email_idx')) {
 *   console.log('Email index exists');
 * }
 * ```
 */
export declare function indexExists(queryInterface: QueryInterface, tableName: string, indexName: string): Promise<boolean>;
/**
 * Gets table row count efficiently.
 * Returns approximate or exact count.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {boolean} exact - Whether to get exact count
 * @returns {Promise<number>} Row count
 *
 * @example
 * ```typescript
 * const count = await getTableRowCount(sequelize, 'users', true);
 * console.log(`Users table has ${count} rows`);
 * ```
 */
export declare function getTableRowCount(sequelize: Sequelize, tableName: string, exact?: boolean): Promise<number>;
/**
 * Gets table size in bytes.
 * Returns table storage size.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @returns {Promise<number>} Table size in bytes
 *
 * @example
 * ```typescript
 * const size = await getTableSize(sequelize, 'users');
 * console.log(`Users table is ${size} bytes`);
 * ```
 */
export declare function getTableSize(sequelize: Sequelize, tableName: string): Promise<number>;
/**
 * Truncates a table efficiently.
 * Removes all rows but preserves structure.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await truncateTable(queryInterface, 'temp_data', transaction);
 * ```
 */
export declare function truncateTable(queryInterface: QueryInterface, tableName: string, transaction?: Transaction): Promise<void>;
/**
 * Compares two schemas and returns differences.
 * Useful for schema synchronization.
 *
 * @param {TableDefinition[]} sourceSchema - Source schema
 * @param {TableDefinition[]} targetSchema - Target schema
 * @returns {SchemaComparison} Schema differences
 *
 * @example
 * ```typescript
 * const diff = compareSchemas(prodSchema, devSchema);
 * console.log('Added tables:', diff.added.tables);
 * ```
 */
export declare function compareSchemas(sourceSchema: TableDefinition[], targetSchema: TableDefinition[]): SchemaComparison;
//# sourceMappingURL=sequelize-schema-kit.d.ts.map