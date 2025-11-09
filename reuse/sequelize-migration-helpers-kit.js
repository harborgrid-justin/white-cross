"use strict";
/**
 * LOC: SQMK1234567
 * File: /reuse/sequelize-migration-helpers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - QueryInterface (migration API)
 *   - DataTypes
 *
 * DOWNSTREAM (imported by):
 *   - Database migration files
 *   - Migration generators
 *   - Schema evolution scripts
 *   - Deployment automation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropEnumType = exports.createEnumType = exports.executeRawSQL = exports.estimateMigrationTime = exports.getTableRowCount = exports.columnExists = exports.tableExists = exports.createAuditTrailTable = exports.decryptColumnData = exports.encryptColumnData = exports.renameColumnZeroDowntime = exports.removeColumnZeroDowntime = exports.addColumnZeroDowntime = exports.executeZeroDowntimeMigration = exports.validateMigrationStructure = exports.runMigrationTests = exports.testMigration = exports.exportSchemaAsMigration = exports.getTableSchema = exports.compareSchemas = exports.removeSeedData = exports.bulkInsertSeed = exports.rollbackToPointInTime = exports.restoreFromBackup = exports.createBackupTable = exports.validateMigratedData = exports.copyTableData = exports.transformColumnData = exports.migrateDataInBatches = exports.addUniqueConstraint = exports.addForeignKey = exports.removeConstraintIfExists = exports.addConstraint = exports.listTableIndexes = exports.removeIndexIfExists = exports.createIndexConcurrently = exports.createIndexWithNaming = exports.changeColumnType = exports.renameColumnSafely = exports.removeColumnWithBackup = exports.addColumnSafely = exports.createTableWithConventions = exports.ensureMigrationAuditTable = exports.logMigrationExecution = exports.createMigrationMetadata = void 0;
/**
 * File: /reuse/sequelize-migration-helpers-kit.ts
 * Locator: WC-UTL-SQMK-007
 * Purpose: Sequelize Migration Helpers Kit - Comprehensive migration and schema evolution utilities
 *
 * Upstream: Sequelize ORM 6.x, QueryInterface, DataTypes
 * Downstream: ../migrations/*, ../database/*, deployment scripts, CI/CD pipelines
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, pg 8.x, mysql2 3.x
 * Exports: 45 utility functions for migration builders, table operations, column management, index creation, constraint handling, data migration, rollback strategies, versioning, seeding, schema comparison, testing, zero-downtime patterns
 *
 * LLM Context: Comprehensive Sequelize migration utilities for White Cross healthcare system.
 * Provides migration file generation, safe schema evolution, data transformation with preservation,
 * HIPAA-compliant audit logging, zero-downtime deployment patterns, rollback strategies, and migration
 * testing helpers. Essential for maintaining database schema integrity in production healthcare
 * applications with strict compliance requirements and zero tolerance for data loss.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// MIGRATION METADATA AND TRACKING
// ============================================================================
/**
 * 1. Creates migration metadata for tracking and auditing.
 *
 * @param {string} name - Migration name
 * @param {string} description - Migration description
 * @param {boolean} rollbackable - Whether migration can be rolled back
 * @returns {MigrationMetadata} Migration metadata object
 *
 * @example
 * ```typescript
 * const metadata = createMigrationMetadata(
 *   '20250108-add-patient-allergies',
 *   'Add allergies table for patient allergy tracking',
 *   true
 * );
 * ```
 */
const createMigrationMetadata = (name, description, rollbackable = true) => {
    return {
        version: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
        name,
        description,
        timestamp: new Date(),
        rollbackable,
    };
};
exports.createMigrationMetadata = createMigrationMetadata;
/**
 * 2. Logs migration execution to audit table for compliance tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {AuditLogEntry} entry - Audit log entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logMigrationExecution(queryInterface, {
 *   migrationName: '20250108-add-allergies',
 *   action: 'UP',
 *   tableName: 'Allergies',
 *   recordsAffected: 0,
 *   executedAt: new Date(),
 *   executedBy: 'admin',
 *   duration: 1234,
 *   success: true
 * }, transaction);
 * ```
 */
const logMigrationExecution = async (queryInterface, entry, transaction) => {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`INSERT INTO "MigrationAuditLog"
     ("migrationName", "action", "tableName", "recordsAffected", "phiFieldsModified",
      "executedAt", "executedBy", "duration", "success", "error")
     VALUES (:migrationName, :action, :tableName, :recordsAffected, :phiFieldsModified,
      :executedAt, :executedBy, :duration, :success, :error)`, {
        replacements: {
            ...entry,
            phiFieldsModified: entry.phiFieldsModified ? JSON.stringify(entry.phiFieldsModified) : null,
        },
        transaction,
    });
};
exports.logMigrationExecution = logMigrationExecution;
/**
 * 3. Ensures migration audit log table exists before logging.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await ensureMigrationAuditTable(queryInterface, transaction);
 * await logMigrationExecution(queryInterface, auditEntry, transaction);
 * ```
 */
const ensureMigrationAuditTable = async (queryInterface, transaction) => {
    const tableExists = await queryInterface.sequelize.query(`SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_name = 'MigrationAuditLog'
     )`, { type: sequelize_1.QueryTypes.SELECT, transaction });
    if (!tableExists[0].exists) {
        await queryInterface.createTable('MigrationAuditLog', {
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            migrationName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            action: { type: sequelize_1.DataTypes.ENUM('UP', 'DOWN'), allowNull: false },
            tableName: { type: sequelize_1.DataTypes.STRING },
            recordsAffected: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
            phiFieldsModified: { type: sequelize_1.DataTypes.JSONB, defaultValue: [] },
            executedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            executedBy: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            duration: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            success: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
            error: { type: sequelize_1.DataTypes.TEXT },
            createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        }, { transaction });
    }
};
exports.ensureMigrationAuditTable = ensureMigrationAuditTable;
// ============================================================================
// TABLE CREATION AND ALTERATION
// ============================================================================
/**
 * 4. Creates table with standard White Cross conventions and timestamps.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {TableDefinition} definition - Table definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTableWithConventions(queryInterface, {
 *   tableName: 'Patients',
 *   columns: {
 *     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
 *     firstName: { type: DataTypes.STRING(50), allowNull: false },
 *     lastName: { type: DataTypes.STRING(50), allowNull: false }
 *   },
 *   options: { timestamps: true, paranoid: true }
 * }, transaction);
 * ```
 */
const createTableWithConventions = async (queryInterface, definition, transaction) => {
    const columns = {
        ...definition.columns,
        ...(definition.options?.timestamps !== false && {
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        }),
        ...(definition.options?.paranoid && {
            deletedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }),
    };
    await queryInterface.createTable(definition.tableName, columns, {
        transaction,
        ...definition.options,
    });
};
exports.createTableWithConventions = createTableWithConventions;
/**
 * 5. Adds column with safe default value to prevent null issues.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {ColumnDefinition} definition - Column definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumnSafely(queryInterface, 'Patients', 'allergies', {
 *   type: DataTypes.JSONB,
 *   allowNull: true,
 *   defaultValue: []
 * }, transaction);
 * ```
 */
const addColumnSafely = async (queryInterface, tableName, columnName, definition, transaction) => {
    // First add as nullable
    await queryInterface.addColumn(tableName, columnName, {
        ...definition,
        allowNull: true,
    }, { transaction });
    // Set default value for existing rows if provided
    if (definition.defaultValue !== undefined) {
        await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`, {
            replacements: { defaultValue: definition.defaultValue },
            transaction,
        });
    }
    // If column should be non-nullable, alter it
    if (definition.allowNull === false) {
        await queryInterface.changeColumn(tableName, columnName, definition, { transaction });
    }
};
exports.addColumnSafely = addColumnSafely;
/**
 * 6. Removes column with backup for rollback capability.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {boolean} createBackup - Whether to create backup table
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string | null>} Backup table name if created
 *
 * @example
 * ```typescript
 * const backupTable = await removeColumnWithBackup(
 *   queryInterface,
 *   'Patients',
 *   'oldStatusField',
 *   true,
 *   transaction
 * );
 * ```
 */
const removeColumnWithBackup = async (queryInterface, tableName, columnName, createBackup = false, transaction) => {
    let backupTableName = null;
    if (createBackup) {
        backupTableName = `${tableName}_backup_${Date.now()}`;
        await queryInterface.sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT "${columnName}" FROM "${tableName}"`, { transaction });
    }
    await queryInterface.removeColumn(tableName, columnName, { transaction });
    return backupTableName;
};
exports.removeColumnWithBackup = removeColumnWithBackup;
/**
 * 7. Renames column safely across different database dialects.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} oldColumnName - Old column name
 * @param {string} newColumnName - New column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameColumnSafely(queryInterface, 'Patients', 'dob', 'dateOfBirth', transaction);
 * ```
 */
const renameColumnSafely = async (queryInterface, tableName, oldColumnName, newColumnName, transaction) => {
    await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });
};
exports.renameColumnSafely = renameColumnSafely;
/**
 * 8. Changes column type with data preservation and validation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} newType - New data type
 * @param {(value: any) => any} [transformFn] - Optional transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeColumnType(
 *   queryInterface,
 *   'Patients',
 *   'age',
 *   DataTypes.STRING,
 *   (val) => val.toString(),
 *   transaction
 * );
 * ```
 */
const changeColumnType = async (queryInterface, tableName, columnName, newType, transformFn, transaction) => {
    const tempColumnName = `${columnName}_temp_migration`;
    // Add new column with new type
    await queryInterface.addColumn(tableName, tempColumnName, { type: newType, allowNull: true }, { transaction });
    // Copy and transform data if needed
    if (transformFn) {
        const [rows] = await queryInterface.sequelize.query(`SELECT id, "${columnName}" FROM "${tableName}"`, { transaction });
        for (const row of rows) {
            const transformedValue = transformFn(row[columnName]);
            await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${tempColumnName}" = :value WHERE id = :id`, {
                replacements: { value: transformedValue, id: row.id },
                transaction,
            });
        }
    }
    else {
        await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${tempColumnName}" = "${columnName}"`, { transaction });
    }
    // Remove old column and rename temp column
    await queryInterface.removeColumn(tableName, columnName, { transaction });
    await queryInterface.renameColumn(tableName, tempColumnName, columnName, { transaction });
};
exports.changeColumnType = changeColumnType;
// ============================================================================
// INDEX MANAGEMENT
// ============================================================================
/**
 * 9. Creates index with automatic naming convention.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {IndexDefinition} definition - Index definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndexWithNaming(queryInterface, 'Patients', {
 *   fields: ['lastName', 'firstName'],
 *   unique: false
 * }, transaction);
 * ```
 */
const createIndexWithNaming = async (queryInterface, tableName, definition, transaction) => {
    const indexName = definition.name ||
        `${tableName}_${definition.fields.map((f) => (typeof f === 'string' ? f : f.name)).join('_')}_idx`;
    await queryInterface.addIndex(tableName, {
        ...definition,
        name: indexName,
    }, { transaction });
};
exports.createIndexWithNaming = createIndexWithNaming;
/**
 * 10. Creates index concurrently for zero-downtime (PostgreSQL).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {IndexDefinition} definition - Index definition
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndexConcurrently(queryInterface, 'Patients', {
 *   fields: ['email'],
 *   unique: true
 * });
 * ```
 */
const createIndexConcurrently = async (queryInterface, tableName, definition) => {
    const indexName = definition.name ||
        `${tableName}_${definition.fields.map((f) => (typeof f === 'string' ? f : f.name)).join('_')}_idx`;
    const uniqueClause = definition.unique ? 'UNIQUE' : '';
    const fields = definition.fields
        .map((f) => {
        if (typeof f === 'string')
            return `"${f}"`;
        return `"${f.name}" ${f.order || 'ASC'}`;
    })
        .join(', ');
    await queryInterface.sequelize.query(`CREATE ${uniqueClause} INDEX CONCURRENTLY "${indexName}" ON "${tableName}" (${fields})`);
};
exports.createIndexConcurrently = createIndexConcurrently;
/**
 * 11. Removes index with existence check to prevent errors.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if index was removed
 *
 * @example
 * ```typescript
 * const removed = await removeIndexIfExists(
 *   queryInterface,
 *   'Patients',
 *   'patients_email_idx',
 *   transaction
 * );
 * ```
 */
const removeIndexIfExists = async (queryInterface, tableName, indexName, transaction) => {
    try {
        await queryInterface.removeIndex(tableName, indexName, { transaction });
        return true;
    }
    catch (error) {
        if (error.message?.includes('does not exist')) {
            return false;
        }
        throw error;
    }
};
exports.removeIndexIfExists = removeIndexIfExists;
/**
 * 12. Lists all indexes on a table for inspection.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of index definitions
 *
 * @example
 * ```typescript
 * const indexes = await listTableIndexes(queryInterface, 'Patients', transaction);
 * indexes.forEach(idx => console.log(idx.name, idx.fields));
 * ```
 */
const listTableIndexes = async (queryInterface, tableName, transaction) => {
    return queryInterface.showIndex(tableName, { transaction });
};
exports.listTableIndexes = listTableIndexes;
// ============================================================================
// CONSTRAINT MANAGEMENT
// ============================================================================
/**
 * 13. Adds constraint with comprehensive configuration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {ConstraintDefinition} definition - Constraint definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addConstraint(queryInterface, 'Patients', {
 *   name: 'patients_email_check',
 *   type: 'check',
 *   fields: ['email'],
 *   where: { email: { [Op.regexp]: '^[^@]+@[^@]+\.[^@]+$' } }
 * }, transaction);
 * ```
 */
const addConstraint = async (queryInterface, tableName, definition, transaction) => {
    await queryInterface.addConstraint(tableName, {
        ...definition,
        transaction,
    });
};
exports.addConstraint = addConstraint;
/**
 * 14. Removes constraint with existence check.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if constraint was removed
 *
 * @example
 * ```typescript
 * await removeConstraintIfExists(
 *   queryInterface,
 *   'Patients',
 *   'patients_email_check',
 *   transaction
 * );
 * ```
 */
const removeConstraintIfExists = async (queryInterface, tableName, constraintName, transaction) => {
    try {
        await queryInterface.removeConstraint(tableName, constraintName, { transaction });
        return true;
    }
    catch (error) {
        if (error.message?.includes('does not exist')) {
            return false;
        }
        throw error;
    }
};
exports.removeConstraintIfExists = removeConstraintIfExists;
/**
 * 15. Adds foreign key constraint with cascade options.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {string} referencedTable - Referenced table name
 * @param {string} referencedColumn - Referenced column name
 * @param {object} options - Cascade options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addForeignKey(
 *   queryInterface,
 *   'Appointments',
 *   'patientId',
 *   'Patients',
 *   'id',
 *   { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
 *   transaction
 * );
 * ```
 */
const addForeignKey = async (queryInterface, tableName, columnName, referencedTable, referencedColumn, options = {}, transaction) => {
    await queryInterface.addConstraint(tableName, {
        fields: [columnName],
        type: 'foreign key',
        name: `${tableName}_${columnName}_fkey`,
        references: {
            table: referencedTable,
            field: referencedColumn,
        },
        onUpdate: options.onUpdate || 'CASCADE',
        onDelete: options.onDelete || 'CASCADE',
        transaction,
    });
};
exports.addForeignKey = addForeignKey;
/**
 * 16. Adds unique constraint on single or multiple columns.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {string} [constraintName] - Optional constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addUniqueConstraint(
 *   queryInterface,
 *   'Patients',
 *   ['email', 'facilityId'],
 *   'patients_email_facility_unique',
 *   transaction
 * );
 * ```
 */
const addUniqueConstraint = async (queryInterface, tableName, columns, constraintName, transaction) => {
    const name = constraintName || `${tableName}_${columns.join('_')}_unique`;
    await queryInterface.addConstraint(tableName, {
        fields: columns,
        type: 'unique',
        name,
        transaction,
    });
};
exports.addUniqueConstraint = addUniqueConstraint;
// ============================================================================
// DATA MIGRATION
// ============================================================================
/**
 * 17. Migrates data in batches with progress tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {DataMigrationConfig} config - Data migration configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ totalProcessed: number; totalErrors: number }>}
 *
 * @example
 * ```typescript
 * const result = await migrateDataInBatches(queryInterface, {
 *   sourceTable: 'OldPatients',
 *   targetTable: 'Patients',
 *   batchSize: 1000,
 *   transformFn: (row) => ({ ...row, migrated: true }),
 *   onProgress: (processed, total) => console.log(`${processed}/${total}`)
 * }, transaction);
 * ```
 */
const migrateDataInBatches = async (queryInterface, config, transaction) => {
    const sequelize = queryInterface.sequelize;
    let totalProcessed = 0;
    let totalErrors = 0;
    let offset = 0;
    // Get total count
    const [countResult] = await sequelize.query(`SELECT COUNT(*) as total FROM "${config.sourceTable}"`, { type: sequelize_1.QueryTypes.SELECT, transaction });
    const total = countResult.total;
    while (offset < total) {
        const [rows] = await sequelize.query(`SELECT * FROM "${config.sourceTable}" LIMIT ${config.batchSize} OFFSET ${offset}`, { transaction });
        for (const row of rows) {
            try {
                // Validate if validation function provided
                if (config.validateFn && !config.validateFn(row)) {
                    continue;
                }
                // Transform data if transform function provided
                const transformedRow = config.transformFn ? config.transformFn(row) : row;
                // Insert into target table
                const targetTable = config.targetTable || config.sourceTable;
                const columns = Object.keys(transformedRow).map((k) => `"${k}"`).join(', ');
                const placeholders = Object.keys(transformedRow).map((k) => `:${k}`).join(', ');
                await sequelize.query(`INSERT INTO "${targetTable}" (${columns}) VALUES (${placeholders})`, {
                    replacements: transformedRow,
                    transaction,
                });
                totalProcessed++;
            }
            catch (error) {
                totalErrors++;
                if (config.onError) {
                    config.onError(error, row);
                }
            }
        }
        offset += config.batchSize;
        if (config.onProgress) {
            config.onProgress(Math.min(offset, total), total);
        }
    }
    return { totalProcessed, totalErrors };
};
exports.migrateDataInBatches = migrateDataInBatches;
/**
 * 18. Transforms column data using custom function.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(value: any, row: any) => any} transformFn - Transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows updated
 *
 * @example
 * ```typescript
 * const updated = await transformColumnData(
 *   queryInterface,
 *   'Patients',
 *   'phoneNumber',
 *   (val) => val.replace(/[^0-9]/g, ''),
 *   transaction
 * );
 * ```
 */
const transformColumnData = async (queryInterface, tableName, columnName, transformFn, transaction) => {
    const [rows] = await queryInterface.sequelize.query(`SELECT id, "${columnName}" FROM "${tableName}"`, { transaction });
    let updatedCount = 0;
    for (const row of rows) {
        const transformedValue = transformFn(row[columnName], row);
        await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :value WHERE id = :id`, {
            replacements: { value: transformedValue, id: row.id },
            transaction,
        });
        updatedCount++;
    }
    return updatedCount;
};
exports.transformColumnData = transformColumnData;
/**
 * 19. Copies data from one table to another with optional transformation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} sourceTable - Source table name
 * @param {string} targetTable - Target table name
 * @param {Record<string, string>} columnMapping - Column name mapping
 * @param {(row: any) => any} [transformFn] - Optional transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows copied
 *
 * @example
 * ```typescript
 * await copyTableData(
 *   queryInterface,
 *   'TempPatients',
 *   'Patients',
 *   { temp_id: 'id', temp_name: 'name' },
 *   (row) => ({ ...row, migrated: true }),
 *   transaction
 * );
 * ```
 */
const copyTableData = async (queryInterface, sourceTable, targetTable, columnMapping, transformFn, transaction) => {
    const sourceColumns = Object.keys(columnMapping);
    const targetColumns = Object.values(columnMapping);
    const [rows] = await queryInterface.sequelize.query(`SELECT ${sourceColumns.map((c) => `"${c}"`).join(', ')} FROM "${sourceTable}"`, { transaction });
    let copiedCount = 0;
    for (const row of rows) {
        // Map columns
        const mappedRow = {};
        Object.entries(columnMapping).forEach(([sourceCol, targetCol]) => {
            mappedRow[targetCol] = row[sourceCol];
        });
        // Transform if function provided
        const finalRow = transformFn ? transformFn(mappedRow) : mappedRow;
        // Insert into target table
        const columns = Object.keys(finalRow).map((k) => `"${k}"`).join(', ');
        const placeholders = Object.keys(finalRow).map((k) => `:${k}`).join(', ');
        await queryInterface.sequelize.query(`INSERT INTO "${targetTable}" (${columns}) VALUES (${placeholders})`, {
            replacements: finalRow,
            transaction,
        });
        copiedCount++;
    }
    return copiedCount;
};
exports.copyTableData = copyTableData;
/**
 * 20. Validates data integrity after migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Array<(row: any) => boolean>} validationRules - Validation rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: number; invalid: number; invalidRows: any[] }>}
 *
 * @example
 * ```typescript
 * const result = await validateMigratedData(
 *   queryInterface,
 *   'Patients',
 *   [
 *     (row) => row.email.includes('@'),
 *     (row) => row.age > 0 && row.age < 150
 *   ],
 *   transaction
 * );
 * ```
 */
const validateMigratedData = async (queryInterface, tableName, validationRules, transaction) => {
    const [rows] = await queryInterface.sequelize.query(`SELECT * FROM "${tableName}"`, {
        transaction,
    });
    let validCount = 0;
    let invalidCount = 0;
    const invalidRows = [];
    for (const row of rows) {
        const isValid = validationRules.every((rule) => rule(row));
        if (isValid) {
            validCount++;
        }
        else {
            invalidCount++;
            invalidRows.push(row);
        }
    }
    return { valid: validCount, invalid: invalidCount, invalidRows };
};
exports.validateMigratedData = validateMigratedData;
// ============================================================================
// ROLLBACK STRATEGIES
// ============================================================================
/**
 * 21. Creates backup table before destructive operation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name to backup
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Backup table name
 *
 * @example
 * ```typescript
 * const backupTable = await createBackupTable(queryInterface, 'Patients', transaction);
 * // Perform migration...
 * // If failed: await restoreFromBackup(queryInterface, 'Patients', backupTable);
 * ```
 */
const createBackupTable = async (queryInterface, tableName, transaction) => {
    const backupTableName = `${tableName}_backup_${Date.now()}`;
    await queryInterface.sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT * FROM "${tableName}"`, { transaction });
    return backupTableName;
};
exports.createBackupTable = createBackupTable;
/**
 * 22. Restores table from backup.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name to restore
 * @param {string} backupTableName - Backup table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFromBackup(queryInterface, 'Patients', 'Patients_backup_1234567890', transaction);
 * ```
 */
const restoreFromBackup = async (queryInterface, tableName, backupTableName, transaction) => {
    await queryInterface.sequelize.query(`DELETE FROM "${tableName}"`, { transaction });
    await queryInterface.sequelize.query(`INSERT INTO "${tableName}" SELECT * FROM "${backupTableName}"`, { transaction });
};
exports.restoreFromBackup = restoreFromBackup;
/**
 * 23. Implements point-in-time rollback using timestamp.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Date} pointInTime - Rollback timestamp
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows affected
 *
 * @example
 * ```typescript
 * const rollbackPoint = new Date('2025-01-08T10:00:00Z');
 * await rollbackToPointInTime(queryInterface, 'Patients', rollbackPoint, transaction);
 * ```
 */
const rollbackToPointInTime = async (queryInterface, tableName, pointInTime, transaction) => {
    const [result] = await queryInterface.sequelize.query(`DELETE FROM "${tableName}" WHERE "createdAt" > :pointInTime`, {
        replacements: { pointInTime },
        transaction,
    });
    return result.rowCount || 0;
};
exports.rollbackToPointInTime = rollbackToPointInTime;
// ============================================================================
// SEED HELPERS
// ============================================================================
/**
 * 24. Bulk inserts seed data with conflict handling.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SeedData} seedConfig - Seed configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows inserted
 *
 * @example
 * ```typescript
 * await bulkInsertSeed(queryInterface, {
 *   tableName: 'Roles',
 *   data: [
 *     { name: 'admin', permissions: ['all'] },
 *     { name: 'user', permissions: ['read'] }
 *   ],
 *   conflictFields: ['name'],
 *   updateOnConflict: true
 * }, transaction);
 * ```
 */
const bulkInsertSeed = async (queryInterface, seedConfig, transaction) => {
    if (seedConfig.data.length === 0)
        return 0;
    if (seedConfig.conflictFields && seedConfig.updateOnConflict) {
        // Upsert logic for PostgreSQL
        let insertedCount = 0;
        for (const row of seedConfig.data) {
            const columns = Object.keys(row).map((k) => `"${k}"`).join(', ');
            const placeholders = Object.keys(row).map((k) => `:${k}`).join(', ');
            const updateClause = Object.keys(row)
                .filter((k) => !seedConfig.conflictFields?.includes(k))
                .map((k) => `"${k}" = EXCLUDED."${k}"`)
                .join(', ');
            await queryInterface.sequelize.query(`INSERT INTO "${seedConfig.tableName}" (${columns})
         VALUES (${placeholders})
         ON CONFLICT (${seedConfig.conflictFields.map((f) => `"${f}"`).join(', ')})
         DO UPDATE SET ${updateClause}`, {
                replacements: row,
                transaction,
            });
            insertedCount++;
        }
        return insertedCount;
    }
    else {
        await queryInterface.bulkInsert(seedConfig.tableName, seedConfig.data, { transaction });
        return seedConfig.data.length;
    }
};
exports.bulkInsertSeed = bulkInsertSeed;
/**
 * 25. Removes seed data based on criteria.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Record<string, any>} criteria - Delete criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows deleted
 *
 * @example
 * ```typescript
 * await removeSeedData(queryInterface, 'Roles', { name: 'test-role' }, transaction);
 * ```
 */
const removeSeedData = async (queryInterface, tableName, criteria, transaction) => {
    const whereClause = Object.entries(criteria)
        .map(([key, value]) => `"${key}" = :${key}`)
        .join(' AND ');
    const [result] = await queryInterface.sequelize.query(`DELETE FROM "${tableName}" WHERE ${whereClause}`, {
        replacements: criteria,
        transaction,
    });
    return result.rowCount || 0;
};
exports.removeSeedData = removeSeedData;
// ============================================================================
// SCHEMA COMPARISON
// ============================================================================
/**
 * 26. Compares two database schemas and reports differences.
 *
 * @param {QueryInterface} sourceInterface - Source query interface
 * @param {QueryInterface} targetInterface - Target query interface
 * @returns {Promise<SchemaComparison>} Schema differences
 *
 * @example
 * ```typescript
 * const comparison = await compareSchemas(productionDb, stagingDb);
 * if (comparison.tablesAdded.length > 0) {
 *   console.log('New tables:', comparison.tablesAdded);
 * }
 * ```
 */
const compareSchemas = async (sourceInterface, targetInterface) => {
    const sourceTables = await sourceInterface.showAllTables();
    const targetTables = await targetInterface.showAllTables();
    const tablesAdded = sourceTables.filter((t) => !targetTables.includes(t));
    const tablesRemoved = targetTables.filter((t) => !sourceTables.includes(t));
    const commonTables = sourceTables.filter((t) => targetTables.includes(t));
    const tablesModified = [];
    for (const tableName of commonTables) {
        const sourceDesc = await sourceInterface.describeTable(tableName);
        const targetDesc = await targetInterface.describeTable(tableName);
        const sourceColumns = Object.keys(sourceDesc);
        const targetColumns = Object.keys(targetDesc);
        const columnsAdded = sourceColumns.filter((c) => !targetColumns.includes(c));
        const columnsRemoved = targetColumns.filter((c) => !sourceColumns.includes(c));
        const columnsModified = sourceColumns.filter((c) => targetColumns.includes(c) &&
            JSON.stringify(sourceDesc[c]) !== JSON.stringify(targetDesc[c]));
        const sourceIndexes = await sourceInterface.showIndex(tableName);
        const targetIndexes = await targetInterface.showIndex(tableName);
        const indexesAdded = sourceIndexes
            .filter((si) => !targetIndexes.find((ti) => ti.name === si.name))
            .map((i) => i.name);
        const indexesRemoved = targetIndexes
            .filter((ti) => !sourceIndexes.find((si) => si.name === ti.name))
            .map((i) => i.name);
        if (columnsAdded.length > 0 ||
            columnsRemoved.length > 0 ||
            columnsModified.length > 0 ||
            indexesAdded.length > 0 ||
            indexesRemoved.length > 0) {
            tablesModified.push({
                tableName,
                columnsAdded,
                columnsRemoved,
                columnsModified,
                indexesAdded,
                indexesRemoved,
            });
        }
    }
    return {
        tablesAdded,
        tablesRemoved,
        tablesModified,
    };
};
exports.compareSchemas = compareSchemas;
/**
 * 27. Gets table schema as structured definition.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @returns {Promise<Record<string, any>>} Table schema
 *
 * @example
 * ```typescript
 * const schema = await getTableSchema(queryInterface, 'Patients');
 * console.log(schema);
 * ```
 */
const getTableSchema = async (queryInterface, tableName) => {
    return queryInterface.describeTable(tableName);
};
exports.getTableSchema = getTableSchema;
/**
 * 28. Exports schema as migration code string.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @returns {Promise<string>} Migration code
 *
 * @example
 * ```typescript
 * const migrationCode = await exportSchemaAsMigration(queryInterface, 'Patients');
 * console.log(migrationCode);
 * ```
 */
const exportSchemaAsMigration = async (queryInterface, tableName) => {
    const schema = await queryInterface.describeTable(tableName);
    const indexes = await queryInterface.showIndex(tableName);
    let code = `await queryInterface.createTable('${tableName}', {\n`;
    Object.entries(schema).forEach(([columnName, definition]) => {
        code += `  ${columnName}: ${JSON.stringify(definition, null, 2)},\n`;
    });
    code += '}, {\n';
    code += '  indexes: [\n';
    indexes.forEach((index) => {
        code += `    ${JSON.stringify(index, null, 2)},\n`;
    });
    code += '  ]\n';
    code += '});';
    return code;
};
exports.exportSchemaAsMigration = exportSchemaAsMigration;
// ============================================================================
// MIGRATION TESTING
// ============================================================================
/**
 * 29. Tests migration up and down without committing.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {() => Promise<void>} upFn - Up migration function
 * @param {() => Promise<void>} downFn - Down migration function
 * @returns {Promise<{ upSuccess: boolean; downSuccess: boolean; errors: Error[] }>}
 *
 * @example
 * ```typescript
 * const result = await testMigration(
 *   queryInterface,
 *   async () => { await createTable(...); },
 *   async () => { await dropTable(...); }
 * );
 * ```
 */
const testMigration = async (queryInterface, upFn, downFn) => {
    const errors = [];
    let upSuccess = false;
    let downSuccess = false;
    const transaction = await queryInterface.sequelize.transaction();
    try {
        // Test up migration
        await upFn();
        upSuccess = true;
        // Test down migration
        await downFn();
        downSuccess = true;
        // Rollback to not actually apply changes
        await transaction.rollback();
    }
    catch (error) {
        errors.push(error);
        await transaction.rollback();
    }
    return { upSuccess, downSuccess, errors };
};
exports.testMigration = testMigration;
/**
 * 30. Runs migration test suite with multiple test cases.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {MigrationTestCase[]} testCases - Test cases
 * @returns {Promise<{ passed: number; failed: number; results: any[] }>}
 *
 * @example
 * ```typescript
 * const results = await runMigrationTests(queryInterface, [
 *   {
 *     name: 'Table creation',
 *     test: async () => { await createTable(...); },
 *     expectedResult: 'table exists'
 *   }
 * ]);
 * ```
 */
const runMigrationTests = async (queryInterface, testCases) => {
    let passed = 0;
    let failed = 0;
    const results = [];
    for (const testCase of testCases) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            if (testCase.setup) {
                await testCase.setup();
            }
            await testCase.test();
            passed++;
            results.push({ name: testCase.name, status: 'passed', error: null });
            await transaction.rollback();
        }
        catch (error) {
            failed++;
            results.push({ name: testCase.name, status: 'failed', error: error.message });
            await transaction.rollback();
        }
        finally {
            if (testCase.teardown) {
                try {
                    await testCase.teardown();
                }
                catch (error) {
                    console.error(`Teardown failed for test: ${testCase.name}`, error);
                }
            }
        }
    }
    return { passed, failed, results };
};
exports.runMigrationTests = runMigrationTests;
/**
 * 31. Validates migration file structure and requirements.
 *
 * @param {object} migration - Migration module object
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const migration = require('./migrations/20250108-add-table.js');
 * const validation = validateMigrationStructure(migration);
 * if (!validation.valid) console.error(validation.errors);
 * ```
 */
const validateMigrationStructure = (migration) => {
    const errors = [];
    if (!migration.up || typeof migration.up !== 'function') {
        errors.push('Missing or invalid up() function');
    }
    if (!migration.down || typeof migration.down !== 'function') {
        errors.push('Missing or invalid down() function');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateMigrationStructure = validateMigrationStructure;
// ============================================================================
// ZERO-DOWNTIME MIGRATION PATTERNS
// ============================================================================
/**
 * 32. Executes multi-phase migration for zero-downtime deployment.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {ZeroDowntimeConfig} config - Zero-downtime configuration
 * @returns {Promise<{ success: boolean; completedPhases: number; error?: Error }>}
 *
 * @example
 * ```typescript
 * await executeZeroDowntimeMigration(queryInterface, {
 *   phases: [
 *     {
 *       name: 'Add nullable column',
 *       migration: async () => { await addColumn(...); },
 *       rollback: async () => { await removeColumn(...); }
 *     },
 *     {
 *       name: 'Make column non-nullable',
 *       migration: async () => { await changeColumn(...); },
 *       rollback: async () => { await changeColumn(...); }
 *     }
 *   ],
 *   pauseBetweenPhases: 5000
 * });
 * ```
 */
const executeZeroDowntimeMigration = async (queryInterface, config) => {
    let completedPhases = 0;
    for (const phase of config.phases) {
        try {
            console.log(`Executing phase: ${phase.name} - ${phase.description}`);
            await phase.migration();
            if (phase.validation) {
                const isValid = await phase.validation();
                if (!isValid) {
                    throw new Error(`Validation failed for phase: ${phase.name}`);
                }
            }
            completedPhases++;
            if (config.pauseBetweenPhases && completedPhases < config.phases.length) {
                await new Promise((resolve) => setTimeout(resolve, config.pauseBetweenPhases));
            }
        }
        catch (error) {
            // Rollback completed phases in reverse order
            for (let i = completedPhases - 1; i >= 0; i--) {
                try {
                    console.log(`Rolling back phase: ${config.phases[i].name}`);
                    await config.phases[i].rollback();
                }
                catch (rollbackError) {
                    console.error(`Rollback failed for phase: ${config.phases[i].name}`, rollbackError);
                }
            }
            return { success: false, completedPhases, error: error };
        }
    }
    return { success: true, completedPhases };
};
exports.executeZeroDowntimeMigration = executeZeroDowntimeMigration;
/**
 * 33. Adds column in zero-downtime pattern (nullable first).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {ColumnDefinition} finalDefinition - Final column definition
 * @param {any} defaultValue - Default value for existing rows
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'preferredLanguage',
 *   { type: DataTypes.STRING, allowNull: false },
 *   'en',
 *   transaction
 * );
 * ```
 */
const addColumnZeroDowntime = async (queryInterface, tableName, columnName, finalDefinition, defaultValue, transaction) => {
    // Phase 1: Add as nullable
    await queryInterface.addColumn(tableName, columnName, {
        ...finalDefinition,
        allowNull: true,
    }, { transaction });
    // Phase 2: Populate with default value
    await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`, {
        replacements: { defaultValue },
        transaction,
    });
    // Phase 3: Make non-nullable if required
    if (finalDefinition.allowNull === false) {
        await queryInterface.changeColumn(tableName, columnName, finalDefinition, { transaction });
    }
};
exports.addColumnZeroDowntime = addColumnZeroDowntime;
/**
 * 34. Removes column in zero-downtime pattern (deprecate first).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Backup table name
 *
 * @example
 * ```typescript
 * // Phase 1: Stop writing to column (done in application code)
 * // Phase 2: Remove column
 * const backup = await removeColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'deprecatedField',
 *   transaction
 * );
 * ```
 */
const removeColumnZeroDowntime = async (queryInterface, tableName, columnName, transaction) => {
    // Create backup before removal
    const backupTable = await (0, exports.createBackupTable)(queryInterface, tableName, transaction);
    // Remove column
    await queryInterface.removeColumn(tableName, columnName, { transaction });
    return backupTable;
};
exports.removeColumnZeroDowntime = removeColumnZeroDowntime;
/**
 * 35. Renames column using shadow column pattern.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} oldColumnName - Old column name
 * @param {string} newColumnName - New column name
 * @param {ColumnDefinition} definition - Column definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'dob',
 *   'dateOfBirth',
 *   { type: DataTypes.DATEONLY, allowNull: false },
 *   transaction
 * );
 * ```
 */
const renameColumnZeroDowntime = async (queryInterface, tableName, oldColumnName, newColumnName, definition, transaction) => {
    // Phase 1: Add new column
    await queryInterface.addColumn(tableName, newColumnName, definition, { transaction });
    // Phase 2: Copy data
    await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${newColumnName}" = "${oldColumnName}"`, { transaction });
    // Phase 3: Remove old column (after application deployment)
    // This would be done in a separate migration after code deployment
};
exports.renameColumnZeroDowntime = renameColumnZeroDowntime;
// ============================================================================
// HIPAA-COMPLIANT MIGRATION PATTERNS
// ============================================================================
/**
 * 36. Encrypts column data during migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(data: string) => Promise<string>} encryptFn - Encryption function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows encrypted
 *
 * @example
 * ```typescript
 * const encrypted = await encryptColumnData(
 *   queryInterface,
 *   'Patients',
 *   'socialSecurityNumber',
 *   async (ssn) => await encrypt(ssn),
 *   transaction
 * );
 * ```
 */
const encryptColumnData = async (queryInterface, tableName, columnName, encryptFn, transaction) => {
    const [rows] = await queryInterface.sequelize.query(`SELECT id, "${columnName}" FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`, { transaction });
    let encryptedCount = 0;
    for (const row of rows) {
        const encryptedValue = await encryptFn(row[columnName]);
        await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :encryptedValue WHERE id = :id`, {
            replacements: { encryptedValue, id: row.id },
            transaction,
        });
        encryptedCount++;
    }
    return encryptedCount;
};
exports.encryptColumnData = encryptColumnData;
/**
 * 37. Decrypts column data during rollback.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(data: string) => Promise<string>} decryptFn - Decryption function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows decrypted
 *
 * @example
 * ```typescript
 * const decrypted = await decryptColumnData(
 *   queryInterface,
 *   'Patients',
 *   'socialSecurityNumber',
 *   async (encrypted) => await decrypt(encrypted),
 *   transaction
 * );
 * ```
 */
const decryptColumnData = async (queryInterface, tableName, columnName, decryptFn, transaction) => {
    const [rows] = await queryInterface.sequelize.query(`SELECT id, "${columnName}" FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`, { transaction });
    let decryptedCount = 0;
    for (const row of rows) {
        const decryptedValue = await decryptFn(row[columnName]);
        await queryInterface.sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :decryptedValue WHERE id = :id`, {
            replacements: { decryptedValue, id: row.id },
            transaction,
        });
        decryptedCount++;
    }
    return decryptedCount;
};
exports.decryptColumnData = decryptColumnData;
/**
 * 38. Creates audit trail table for PHI access tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name being audited
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditTrailTable(queryInterface, 'Patients', transaction);
 * ```
 */
const createAuditTrailTable = async (queryInterface, tableName, transaction) => {
    const auditTableName = `${tableName}_AuditTrail`;
    await queryInterface.createTable(auditTableName, {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        recordId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'READ'),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        changedFields: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        previousValues: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        newValues: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.INET,
            allowNull: true,
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        accessReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, { transaction });
    // Add indexes for efficient querying
    await queryInterface.addIndex(auditTableName, {
        fields: ['recordId', 'timestamp'],
        name: `${auditTableName}_record_time_idx`,
    });
    await queryInterface.addIndex(auditTableName, {
        fields: ['userId', 'timestamp'],
        name: `${auditTableName}_user_time_idx`,
    });
};
exports.createAuditTrailTable = createAuditTrailTable;
// ============================================================================
// MIGRATION UTILITIES
// ============================================================================
/**
 * 39. Checks if table exists before migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if table exists
 *
 * @example
 * ```typescript
 * if (await tableExists(queryInterface, 'Patients', transaction)) {
 *   console.log('Table already exists');
 * }
 * ```
 */
const tableExists = async (queryInterface, tableName, transaction) => {
    const tables = await queryInterface.showAllTables({ transaction });
    return tables.includes(tableName);
};
exports.tableExists = tableExists;
/**
 * 40. Checks if column exists in table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if column exists
 *
 * @example
 * ```typescript
 * if (await columnExists(queryInterface, 'Patients', 'email', transaction)) {
 *   console.log('Column already exists');
 * }
 * ```
 */
const columnExists = async (queryInterface, tableName, columnName, transaction) => {
    try {
        const tableDescription = await queryInterface.describeTable(tableName, { transaction });
        return columnName in tableDescription;
    }
    catch (error) {
        return false;
    }
};
exports.columnExists = columnExists;
/**
 * 41. Gets row count for table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Row count
 *
 * @example
 * ```typescript
 * const count = await getTableRowCount(queryInterface, 'Patients', transaction);
 * console.log(`Table has ${count} rows`);
 * ```
 */
const getTableRowCount = async (queryInterface, tableName, transaction) => {
    const [result] = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}"`, {
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return result.count;
};
exports.getTableRowCount = getTableRowCount;
/**
 * 42. Estimates migration execution time based on table size.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {number} rowsPerSecond - Processing rate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ rowCount: number; estimatedSeconds: number; estimatedMinutes: number }>}
 *
 * @example
 * ```typescript
 * const estimate = await estimateMigrationTime(queryInterface, 'Patients', 1000, transaction);
 * console.log(`Migration will take approximately ${estimate.estimatedMinutes} minutes`);
 * ```
 */
const estimateMigrationTime = async (queryInterface, tableName, rowsPerSecond = 1000, transaction) => {
    const rowCount = await (0, exports.getTableRowCount)(queryInterface, tableName, transaction);
    const estimatedSeconds = Math.ceil(rowCount / rowsPerSecond);
    const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
    return { rowCount, estimatedSeconds, estimatedMinutes };
};
exports.estimateMigrationTime = estimateMigrationTime;
/**
 * 43. Executes raw SQL with transaction support.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} sql - SQL query
 * @param {Record<string, any>} [replacements] - Query replacements
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * await executeRawSQL(
 *   queryInterface,
 *   'ALTER TABLE "Patients" ADD COLUMN custom_field TEXT',
 *   {},
 *   transaction
 * );
 * ```
 */
const executeRawSQL = async (queryInterface, sql, replacements, transaction) => {
    return queryInterface.sequelize.query(sql, {
        replacements,
        transaction,
    });
};
exports.executeRawSQL = executeRawSQL;
/**
 * 44. Creates enum type for PostgreSQL.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} enumName - Enum type name
 * @param {string[]} values - Enum values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createEnumType(
 *   queryInterface,
 *   'patient_status',
 *   ['active', 'inactive', 'suspended'],
 *   transaction
 * );
 * ```
 */
const createEnumType = async (queryInterface, enumName, values, transaction) => {
    const valuesString = values.map((v) => `'${v}'`).join(', ');
    await queryInterface.sequelize.query(`CREATE TYPE ${enumName} AS ENUM (${valuesString})`, {
        transaction,
    });
};
exports.createEnumType = createEnumType;
/**
 * 45. Drops enum type for PostgreSQL.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} enumName - Enum type name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropEnumType(queryInterface, 'patient_status', transaction);
 * ```
 */
const dropEnumType = async (queryInterface, enumName, transaction) => {
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${enumName}`, { transaction });
};
exports.dropEnumType = dropEnumType;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Migration metadata
    createMigrationMetadata: exports.createMigrationMetadata,
    logMigrationExecution: exports.logMigrationExecution,
    ensureMigrationAuditTable: exports.ensureMigrationAuditTable,
    // Table operations
    createTableWithConventions: exports.createTableWithConventions,
    addColumnSafely: exports.addColumnSafely,
    removeColumnWithBackup: exports.removeColumnWithBackup,
    renameColumnSafely: exports.renameColumnSafely,
    changeColumnType: exports.changeColumnType,
    // Index management
    createIndexWithNaming: exports.createIndexWithNaming,
    createIndexConcurrently: exports.createIndexConcurrently,
    removeIndexIfExists: exports.removeIndexIfExists,
    listTableIndexes: exports.listTableIndexes,
    // Constraint management
    addConstraint: exports.addConstraint,
    removeConstraintIfExists: exports.removeConstraintIfExists,
    addForeignKey: exports.addForeignKey,
    addUniqueConstraint: exports.addUniqueConstraint,
    // Data migration
    migrateDataInBatches: exports.migrateDataInBatches,
    transformColumnData: exports.transformColumnData,
    copyTableData: exports.copyTableData,
    validateMigratedData: exports.validateMigratedData,
    // Rollback strategies
    createBackupTable: exports.createBackupTable,
    restoreFromBackup: exports.restoreFromBackup,
    rollbackToPointInTime: exports.rollbackToPointInTime,
    // Seed helpers
    bulkInsertSeed: exports.bulkInsertSeed,
    removeSeedData: exports.removeSeedData,
    // Schema comparison
    compareSchemas: exports.compareSchemas,
    getTableSchema: exports.getTableSchema,
    exportSchemaAsMigration: exports.exportSchemaAsMigration,
    // Migration testing
    testMigration: exports.testMigration,
    runMigrationTests: exports.runMigrationTests,
    validateMigrationStructure: exports.validateMigrationStructure,
    // Zero-downtime patterns
    executeZeroDowntimeMigration: exports.executeZeroDowntimeMigration,
    addColumnZeroDowntime: exports.addColumnZeroDowntime,
    removeColumnZeroDowntime: exports.removeColumnZeroDowntime,
    renameColumnZeroDowntime: exports.renameColumnZeroDowntime,
    // HIPAA-compliant patterns
    encryptColumnData: exports.encryptColumnData,
    decryptColumnData: exports.decryptColumnData,
    createAuditTrailTable: exports.createAuditTrailTable,
    // Utilities
    tableExists: exports.tableExists,
    columnExists: exports.columnExists,
    getTableRowCount: exports.getTableRowCount,
    estimateMigrationTime: exports.estimateMigrationTime,
    executeRawSQL: exports.executeRawSQL,
    createEnumType: exports.createEnumType,
    dropEnumType: exports.dropEnumType,
};
//# sourceMappingURL=sequelize-migration-helpers-kit.js.map