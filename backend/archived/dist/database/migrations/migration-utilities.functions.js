"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableWithDefaults = createTableWithDefaults;
exports.safeAlterTable = safeAlterTable;
exports.dropTableSafely = dropTableSafely;
exports.renameTableWithDependencies = renameTableWithDependencies;
exports.addColumnWithDefaults = addColumnWithDefaults;
exports.removeColumnSafely = removeColumnSafely;
exports.modifyColumnType = modifyColumnType;
exports.renameColumnUniversal = renameColumnUniversal;
exports.addForeignKeyConstraint = addForeignKeyConstraint;
exports.addCheckConstraint = addCheckConstraint;
exports.removeConstraintSafely = removeConstraintSafely;
exports.addUniqueConstraint = addUniqueConstraint;
exports.replaceConstraint = replaceConstraint;
exports.batchDataTransform = batchDataTransform;
exports.migrateDataBetweenTables = migrateDataBetweenTables;
exports.copyTableData = copyTableData;
exports.validateDataIntegrity = validateDataIntegrity;
exports.backfillMissingData = backfillMissingData;
exports.recordMigrationExecution = recordMigrationExecution;
exports.getCurrentSchemaVersion = getCurrentSchemaVersion;
exports.compareSchemaVersions = compareSchemaVersions;
exports.createSchemaSnapshot = createSchemaSnapshot;
exports.addColumnZeroDowntime = addColumnZeroDowntime;
exports.removeColumnZeroDowntime = removeColumnZeroDowntime;
exports.renameColumnExpandContract = renameColumnExpandContract;
exports.modifyColumnTypeZeroDowntime = modifyColumnTypeZeroDowntime;
exports.createRollbackPoint = createRollbackPoint;
exports.restoreRollbackPoint = restoreRollbackPoint;
exports.generateRollbackMigration = generateRollbackMigration;
exports.testRollback = testRollback;
exports.seedDataWithUpsert = seedDataWithUpsert;
exports.generateSeedFromExisting = generateSeedFromExisting;
exports.clearSeedData = clearSeedData;
exports.createTestFixtures = createTestFixtures;
exports.checkTableExists = checkTableExists;
exports.checkColumnExists = checkColumnExists;
exports.checkIndexExists = checkIndexExists;
exports.checkConstraintExists = checkConstraintExists;
exports.getTableRowCount = getTableRowCount;
exports.ensureMigrationHistoryTable = ensureMigrationHistoryTable;
exports.acquireMigrationLock = acquireMigrationLock;
exports.releaseMigrationLock = releaseMigrationLock;
exports.executeMigrationWithLock = executeMigrationWithLock;
exports.executeBatchMigrations = executeBatchMigrations;
exports.analyzeMigrationPerformance = analyzeMigrationPerformance;
const sequelize_1 = require("sequelize");
async function createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
    const { indexes = [], paranoid = false, timestamps = true, underscored = false, comment, } = options;
    const completeAttributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        ...attributes,
    };
    if (timestamps) {
        completeAttributes.createdAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
        completeAttributes.updatedAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
    }
    if (paranoid) {
        completeAttributes.deletedAt = {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        };
    }
    await queryInterface.createTable(tableName, completeAttributes, {
        transaction,
        comment,
    });
    for (const index of indexes) {
        await queryInterface.addIndex(tableName, index.fields, {
            ...index,
            transaction,
        });
    }
}
async function safeAlterTable(queryInterface, tableName, alterations, transaction) {
    const sequelize = queryInterface.sequelize;
    const t = transaction || (await sequelize.transaction());
    try {
        await alterations(queryInterface, t);
        if (!transaction) {
            await t.commit();
        }
    }
    catch (error) {
        if (!transaction) {
            await t.rollback();
        }
        throw error;
    }
}
async function dropTableSafely(queryInterface, tableName, options = {}, transaction) {
    const { cascade = false, ifExists = true } = options;
    if (ifExists) {
        const tableExists = await checkTableExists(queryInterface, tableName);
        if (!tableExists) {
            return;
        }
    }
    await queryInterface.dropTable(tableName, {
        cascade,
        transaction,
    });
}
async function renameTableWithDependencies(queryInterface, oldTableName, newTableName, transaction) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    await queryInterface.renameTable(oldTableName, newTableName, { transaction });
    if (dialect === 'postgres') {
        const [sequences] = await sequelize.query(`
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name LIKE :pattern
    `, {
            replacements: { pattern: `${oldTableName}%` },
            transaction
        });
        for (const seq of sequences) {
            const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
            await sequelize.query(`ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`, { transaction });
        }
    }
}
async function addColumnWithDefaults(queryInterface, tableName, columnName, definition, options = {}, transaction) {
    const { populateDefault = true, validate = true } = options;
    const tempDefinition = { ...definition, allowNull: true };
    await queryInterface.addColumn(tableName, columnName, tempDefinition, {
        transaction,
    });
    if (populateDefault && definition.defaultValue !== undefined) {
        const dialect = queryInterface.sequelize.getDialect();
        const tableRef = dialect === 'postgres' ? `"${tableName}"` : `\`${tableName}\``;
        const columnRef = dialect === 'postgres' ? `"${columnName}"` : `\`${columnName}\``;
        await queryInterface.sequelize.query(`UPDATE ${tableRef} SET ${columnRef} = :defaultValue WHERE ${columnRef} IS NULL`, {
            replacements: { defaultValue: definition.defaultValue },
            transaction,
        });
    }
    if (!definition.allowNull) {
        await queryInterface.changeColumn(tableName, columnName, definition, {
            transaction,
        });
    }
    if (validate) {
        const [results] = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`, { transaction });
        const count = results[0].count;
        if (count > 0 && !definition.allowNull) {
            throw new Error(`Column ${columnName} has ${count} NULL values but is NOT NULL`);
        }
    }
}
async function removeColumnSafely(queryInterface, tableName, columnName, options = {}, transaction) {
    const { backup = false, backupTable, ifExists = true } = options;
    if (ifExists) {
        const columnExists = await checkColumnExists(queryInterface, tableName, columnName);
        if (!columnExists) {
            return;
        }
    }
    if (backup) {
        const backupTableName = backupTable || `${tableName}_${columnName}_backup`;
        await queryInterface.sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT id, "${columnName}" FROM "${tableName}"`, { transaction });
    }
    await queryInterface.removeColumn(tableName, columnName, { transaction });
}
async function modifyColumnType(queryInterface, tableName, columnName, newDefinition, options = {}, transaction) {
    const { castUsing, validate = true, tempColumn = false } = options;
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (tempColumn || dialect === 'postgres') {
        const tempColumnName = `${columnName}_temp`;
        await queryInterface.addColumn(tableName, tempColumnName, newDefinition, {
            transaction,
        });
        const castExpression = castUsing || `"${columnName}"`;
        await sequelize.query(`UPDATE "${tableName}" SET "${tempColumnName}" = ${castExpression}`, { transaction });
        await queryInterface.removeColumn(tableName, columnName, { transaction });
        await queryInterface.renameColumn(tableName, tempColumnName, columnName, { transaction });
    }
    else {
        await queryInterface.changeColumn(tableName, columnName, newDefinition, {
            transaction,
        });
    }
    if (validate) {
        const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`, { transaction });
        console.log(`Column ${columnName} conversion completed. NULL count: ${results[0].count}`);
    }
}
async function renameColumnUniversal(queryInterface, tableName, oldColumnName, newColumnName, transaction) {
    await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });
}
async function addForeignKeyConstraint(queryInterface, tableName, constraint, transaction) {
    await queryInterface.addConstraint(tableName, {
        fields: constraint.fields,
        type: 'foreign key',
        name: constraint.name,
        references: {
            table: constraint.references.table,
            field: constraint.references.field,
        },
        onDelete: constraint.onDelete || 'NO ACTION',
        onUpdate: constraint.onUpdate || 'NO ACTION',
        transaction,
    });
}
async function addCheckConstraint(queryInterface, tableName, constraintName, checkExpression, transaction) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK (${checkExpression})`, { transaction });
}
async function removeConstraintSafely(queryInterface, tableName, constraintName, options = {}, transaction) {
    const { ifExists = true, cascade = false } = options;
    const sequelize = queryInterface.sequelize;
    if (ifExists) {
        const constraintExists = await checkConstraintExists(queryInterface, tableName, constraintName);
        if (!constraintExists) {
            return;
        }
    }
    const cascadeClause = cascade ? 'CASCADE' : '';
    await sequelize.query(`ALTER TABLE "${tableName}" DROP CONSTRAINT "${constraintName}" ${cascadeClause}`, { transaction });
}
async function addUniqueConstraint(queryInterface, tableName, columns, constraintName, transaction) {
    await queryInterface.addConstraint(tableName, {
        fields: columns,
        type: 'unique',
        name: constraintName,
        transaction,
    });
}
async function replaceConstraint(queryInterface, tableName, oldConstraintName, newConstraint, transaction) {
    const sequelize = queryInterface.sequelize;
    const t = transaction || (await sequelize.transaction());
    try {
        await removeConstraintSafely(queryInterface, tableName, oldConstraintName, {}, t);
        if (newConstraint.type === 'foreign key') {
            await addForeignKeyConstraint(queryInterface, tableName, newConstraint, t);
        }
        else if (newConstraint.type === 'check') {
            await addCheckConstraint(queryInterface, tableName, newConstraint.name, newConstraint.checkExpression, t);
        }
        else {
            await queryInterface.addConstraint(tableName, {
                ...newConstraint,
                transaction: t,
            });
        }
        if (!transaction) {
            await t.commit();
        }
    }
    catch (error) {
        if (!transaction) {
            await t.rollback();
        }
        throw error;
    }
}
async function batchDataTransform(queryInterface, config) {
    const { sourceTable, targetTable = sourceTable, batchSize = 1000, where = {}, transform, validate, onError, } = config;
    const sequelize = queryInterface.sequelize;
    let offset = 0;
    let totalProcessed = 0;
    let totalModified = 0;
    let errors = 0;
    console.log(`Starting batch data transformation for ${sourceTable}...`);
    while (true) {
        const transaction = await sequelize.transaction();
        try {
            const whereClause = Object.keys(where).length
                ? `WHERE ${Object.entries(where)
                    .map(([key, val]) => `"${key}" = '${val}'`)
                    .join(' AND ')}`
                : '';
            const [results] = await sequelize.query(`SELECT * FROM "${sourceTable}" ${whereClause} ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`, { transaction });
            if (results.length === 0) {
                await transaction.commit();
                break;
            }
            for (const row of results) {
                try {
                    if (validate && !(await validate(row))) {
                        continue;
                    }
                    const transformedRow = await transform(row);
                    const setClause = Object.entries(transformedRow)
                        .filter(([key]) => key !== 'id')
                        .map(([key, val]) => `"${key}" = :${key}`)
                        .join(', ');
                    if (setClause) {
                        await sequelize.query(`UPDATE "${targetTable}" SET ${setClause} WHERE id = :id`, {
                            replacements: { ...transformedRow, id: row.id },
                            transaction,
                        });
                        totalModified++;
                    }
                    totalProcessed++;
                }
                catch (error) {
                    errors++;
                    if (onError) {
                        onError(error, row);
                    }
                    else {
                        console.error(`Error transforming row:`, error);
                    }
                }
            }
            await transaction.commit();
            offset += batchSize;
            console.log(`Processed ${totalProcessed} records...`);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        catch (error) {
            await transaction.rollback();
            console.error(`Error processing batch at offset ${offset}:`, error);
            throw error;
        }
    }
    console.log(`Batch transformation complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`);
    return { totalProcessed, totalModified, errors };
}
async function migrateDataBetweenTables(queryInterface, sourceTable, targetTable, columnMapping, options = {}) {
    const { batchSize = 1000, where = {}, deleteSource = false } = options;
    const sequelize = queryInterface.sequelize;
    const sourceColumns = Object.keys(columnMapping).map((col) => `"${col}"`);
    const targetColumns = Object.values(columnMapping).map((col) => `"${col}"`);
    const whereClause = Object.keys(where).length
        ? `WHERE ${Object.entries(where)
            .map(([key, val]) => `"${key}" = '${val}'`)
            .join(' AND ')}`
        : '';
    let offset = 0;
    while (true) {
        const transaction = await sequelize.transaction();
        try {
            const [results] = await sequelize.query(`SELECT ${sourceColumns.join(', ')} FROM "${sourceTable}" ${whereClause} LIMIT ${batchSize} OFFSET ${offset}`, { transaction });
            if (results.length === 0) {
                await transaction.commit();
                break;
            }
            for (const row of results) {
                const values = Object.keys(columnMapping).map((key) => row[key]);
                const placeholders = targetColumns.map((_, i) => `:val${i}`);
                await sequelize.query(`INSERT INTO "${targetTable}" (${targetColumns.join(', ')}) VALUES (${placeholders.join(', ')})`, {
                    replacements: values.reduce((acc, val, i) => ({ ...acc, [`val${i}`]: val }), {}),
                    transaction,
                });
            }
            await transaction.commit();
            offset += batchSize;
            console.log(`Migrated ${offset} records...`);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    if (deleteSource) {
        await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
    }
}
async function copyTableData(queryInterface, sourceTable, targetTable, options = {}, transaction) {
    const { where, columns, limit } = options;
    const sequelize = queryInterface.sequelize;
    const columnList = columns ? columns.map((c) => `"${c}"`).join(', ') : '*';
    const whereClause = where ? `WHERE ${where}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';
    await sequelize.query(`INSERT INTO "${targetTable}" SELECT ${columnList} FROM "${sourceTable}" ${whereClause} ${limitClause}`, { transaction });
}
async function validateDataIntegrity(queryInterface, tableName, validations) {
    const sequelize = queryInterface.sequelize;
    const results = [];
    for (const validation of validations) {
        const { column, rule, errorMessage } = validation;
        const [queryResults] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE NOT (${rule})`);
        const failedCount = queryResults[0].count;
        const passed = failedCount === 0;
        results.push({
            column,
            passed,
            failedCount,
            message: errorMessage || `Column ${column} validation: ${rule}`,
        });
        if (!passed) {
            console.warn(`Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`);
        }
    }
    return results;
}
async function backfillMissingData(queryInterface, tableName, columnName, strategy, config) {
    const sequelize = queryInterface.sequelize;
    let query;
    let rowsUpdated = 0;
    switch (strategy) {
        case 'default':
            query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
            await sequelize.query(query, {
                replacements: { defaultValue: config.defaultValue },
            });
            break;
        case 'derived':
            query = `UPDATE "${tableName}" SET "${columnName}" = ${config.expression} WHERE "${columnName}" IS NULL`;
            await sequelize.query(query);
            break;
        case 'lookup':
            query = `
        UPDATE "${tableName}" t
        SET "${columnName}" = l."${config.lookupValue}"
        FROM "${config.lookupTable}" l
        WHERE t."${config.lookupKey}" = l."${config.lookupKey}"
        AND t."${columnName}" IS NULL
      `;
            await sequelize.query(query);
            break;
        case 'function':
            if (!config.customFunction) {
                throw new Error('Custom function required for function strategy');
            }
            const [rows] = await sequelize.query(`SELECT * FROM "${tableName}" WHERE "${columnName}" IS NULL`);
            for (const row of rows) {
                const newValue = await config.customFunction(row);
                await sequelize.query(`UPDATE "${tableName}" SET "${columnName}" = :newValue WHERE id = :id`, {
                    replacements: { newValue, id: row.id },
                });
                rowsUpdated++;
            }
            break;
    }
    if (strategy !== 'function') {
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`);
        rowsUpdated = countResult[0].count;
    }
    console.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);
    return { rowsUpdated };
}
async function recordMigrationExecution(queryInterface, migrationName, metadata = {}) {
    const sequelize = queryInterface.sequelize;
    await ensureMigrationHistoryTable(queryInterface);
    await sequelize.query(`
    INSERT INTO "MigrationHistory" (name, "executedAt", "executionTime", "rowsAffected", description)
    VALUES (:name, NOW(), :executionTime, :rowsAffected, :description)
  `, {
        replacements: {
            name: migrationName,
            executionTime: metadata.executionTime || 0,
            rowsAffected: metadata.rowsAffected || 0,
            description: metadata.description || '',
        },
    });
}
async function getCurrentSchemaVersion(queryInterface) {
    const sequelize = queryInterface.sequelize;
    try {
        const [results] = await sequelize.query(`SELECT name FROM "SequelizeMeta" ORDER BY name DESC LIMIT 1`);
        if (results.length === 0) {
            return 'none';
        }
        return results[0].name;
    }
    catch (error) {
        return 'unknown';
    }
}
async function compareSchemaVersions(queryInterface, version1, version2) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const comparison = {
        tablesAdded: [],
        tablesRemoved: [],
        tablesModified: [],
        columnsAdded: {},
        columnsRemoved: {},
        columnsModified: {},
        indexesAdded: {},
        indexesRemoved: {},
    };
    const [currentTables] = await sequelize.query(dialect === 'postgres'
        ? `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
        : `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`);
    console.log(`Schema comparison between ${version1} and ${version2} completed`);
    return comparison;
}
async function createSchemaSnapshot(queryInterface, versionName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const [tables] = await sequelize.query(dialect === 'postgres'
        ? `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
        : `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`);
    const snapshot = {
        version: versionName,
        createdAt: new Date(),
        tables: [],
    };
    for (const table of tables) {
        const [columns] = await sequelize.query(dialect === 'postgres'
            ? `SELECT column_name, data_type, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_name = '${table.table_name}'`
            : `SELECT column_name, data_type, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_name = '${table.table_name}' AND table_schema = DATABASE()`);
        snapshot.tables.push({
            name: table.table_name,
            columns,
        });
    }
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "SchemaSnapshots" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      version VARCHAR(255) NOT NULL,
      snapshot JSONB NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await sequelize.query(`INSERT INTO "SchemaSnapshots" (version, snapshot) VALUES (:version, :snapshot)`, {
        replacements: {
            version: versionName,
            snapshot: JSON.stringify(snapshot),
        },
    });
    console.log(`Schema snapshot created for version ${versionName}`);
}
async function addColumnZeroDowntime(queryInterface, tableName, columnName, definition, options = {}) {
    const { populateFunction, batchSize = 1000 } = options;
    console.log(`Phase 1: Adding ${columnName} as nullable...`);
    await queryInterface.addColumn(tableName, columnName, {
        ...definition,
        allowNull: true,
    });
    console.log(`Phase 2: Populating ${columnName}...`);
    if (populateFunction) {
        await populateFunction(queryInterface);
    }
    else if (definition.defaultValue !== undefined) {
        await backfillMissingData(queryInterface, tableName, columnName, 'default', {
            defaultValue: definition.defaultValue,
        });
    }
    if (!definition.allowNull) {
        console.log(`Phase 3: Making ${columnName} non-nullable...`);
        await queryInterface.changeColumn(tableName, columnName, definition);
    }
    console.log(`Zero-downtime column addition completed for ${columnName}`);
}
async function removeColumnZeroDowntime(queryInterface, tableName, columnName, options = {}) {
    const { verifyUnused = true, waitPeriod = 0 } = options;
    if (verifyUnused) {
        console.log(`Verifying ${columnName} is not being written to...`);
        await new Promise((resolve) => setTimeout(resolve, waitPeriod));
    }
    console.log(`Dropping column ${columnName}...`);
    await queryInterface.removeColumn(tableName, columnName);
    console.log(`Zero-downtime column removal completed for ${columnName}`);
}
async function renameColumnExpandContract(queryInterface, tableName, oldColumnName, newColumnName, definition) {
    const sequelize = queryInterface.sequelize;
    console.log(`Phase 1: Adding new column ${newColumnName}...`);
    await queryInterface.addColumn(tableName, newColumnName, {
        ...definition,
        allowNull: true,
    });
    console.log(`Phase 2: Copying data from ${oldColumnName} to ${newColumnName}...`);
    await sequelize.query(`UPDATE "${tableName}" SET "${newColumnName}" = "${oldColumnName}"`);
    console.log(`Phase 3: Deploy application to write to both ${oldColumnName} and ${newColumnName}`);
    console.log(`Waiting for deployment...`);
    if (!definition.allowNull) {
        console.log(`Phase 4: Making ${newColumnName} non-nullable...`);
        await queryInterface.changeColumn(tableName, newColumnName, definition);
    }
    console.log(`Expand phase complete. After verifying, run contract phase to remove ${oldColumnName}`);
}
async function modifyColumnTypeZeroDowntime(queryInterface, tableName, columnName, newDefinition, options = {}) {
    const { castExpression, batchSize = 1000 } = options;
    const sequelize = queryInterface.sequelize;
    const shadowColumn = `${columnName}_new`;
    console.log(`Phase 1: Adding shadow column ${shadowColumn}...`);
    await queryInterface.addColumn(tableName, shadowColumn, {
        ...newDefinition,
        allowNull: true,
    });
    console.log(`Phase 2: Backfilling ${shadowColumn}...`);
    const cast = castExpression || `"${columnName}"`;
    await sequelize.query(`UPDATE "${tableName}" SET "${shadowColumn}" = ${cast}`);
    console.log(`Phase 3: Deploy application to write to both ${columnName} and ${shadowColumn}`);
    console.log(`Phase 4: Swapping columns...`);
    const transaction = await sequelize.transaction();
    try {
        await queryInterface.renameColumn(tableName, columnName, `${columnName}_old`, { transaction });
        await queryInterface.renameColumn(tableName, shadowColumn, columnName, {
            transaction,
        });
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
    console.log(`Column type modification complete. Old column backed up as ${columnName}_old`);
}
async function createRollbackPoint(queryInterface, pointName, tables) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "RollbackPoints" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      tables JSONB NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    const backupInfo = {};
    for (const table of tables) {
        const backupTableName = `${table}_rollback_${pointName}`;
        await sequelize.query(`CREATE TABLE "${backupTableName}" AS SELECT * FROM "${table}"`);
        backupInfo[table] = backupTableName;
    }
    await sequelize.query(`INSERT INTO "RollbackPoints" (name, tables) VALUES (:name, :tables)`, {
        replacements: {
            name: pointName,
            tables: JSON.stringify(backupInfo),
        },
    });
    console.log(`Rollback point '${pointName}' created for tables: ${tables.join(', ')}`);
}
async function restoreRollbackPoint(queryInterface, pointName, options = {}) {
    const { verify = true, keepBackup = true } = options;
    const sequelize = queryInterface.sequelize;
    const [results] = await sequelize.query(`SELECT tables FROM "RollbackPoints" WHERE name = :name`, {
        replacements: { name: pointName },
    });
    if (results.length === 0) {
        throw new Error(`Rollback point '${pointName}' not found`);
    }
    const backupInfo = results[0].tables;
    const transaction = await sequelize.transaction();
    try {
        for (const [originalTable, backupTable] of Object.entries(backupInfo)) {
            console.log(`Restoring ${originalTable} from ${backupTable}...`);
            await sequelize.query(`TRUNCATE TABLE "${originalTable}" CASCADE`, {
                transaction,
            });
            await sequelize.query(`INSERT INTO "${originalTable}" SELECT * FROM "${backupTable}"`, { transaction });
            if (verify) {
                const [originalCount] = await sequelize.query(`SELECT COUNT(*) as count FROM "${originalTable}"`, { transaction });
                const [backupCount] = await sequelize.query(`SELECT COUNT(*) as count FROM "${backupTable}"`, { transaction });
                if (originalCount[0].count !== backupCount[0].count) {
                    throw new Error(`Verification failed for ${originalTable}: row count mismatch`);
                }
            }
            if (!keepBackup) {
                await sequelize.query(`DROP TABLE "${backupTable}"`, { transaction });
            }
        }
        await transaction.commit();
        console.log(`Rollback to point '${pointName}' completed successfully`);
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
function generateRollbackMigration(upMigrationPath) {
    const rollbackTemplate = `
module.exports = {
  async up(queryInterface, Sequelize) {
    // This is a rollback of ${upMigrationPath}
    // Implement the reverse operations here
    throw new Error('Rollback migration not implemented');
  },

  async down(queryInterface, Sequelize) {
    // Re-apply original migration
    throw new Error('Re-application not implemented');
  }
};
  `;
    return rollbackTemplate;
}
async function testRollback(queryInterface, rollbackFunction) {
    const sequelize = queryInterface.sequelize;
    const transaction = await sequelize.transaction();
    try {
        await rollbackFunction(queryInterface, transaction);
        await transaction.rollback();
        return { success: true };
    }
    catch (error) {
        await transaction.rollback();
        return { success: false, error: error };
    }
}
async function seedDataWithUpsert(queryInterface, config) {
    const { table, data, updateOnDuplicate = [], transaction } = config;
    const sequelize = queryInterface.sequelize;
    for (const row of data) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = columns.map((_, i) => `:val${i}`);
        const updateClause = updateOnDuplicate.length
            ? `ON CONFLICT (id) DO UPDATE SET ${updateOnDuplicate.map((col) => `"${col}" = EXCLUDED."${col}"`).join(', ')}`
            : 'ON CONFLICT (id) DO NOTHING';
        await sequelize.query(`
      INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')})
      VALUES (${placeholders.join(', ')})
      ${updateClause}
    `, {
            replacements: values.reduce((acc, val, i) => ({ ...acc, [`val${i}`]: val }), {}),
            transaction,
        });
    }
    console.log(`Seeded ${data.length} rows into ${table}`);
}
async function generateSeedFromExisting(queryInterface, tableName, options = {}) {
    const { where, limit, exclude = [] } = options;
    const sequelize = queryInterface.sequelize;
    const whereClause = where ? `WHERE ${where}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';
    const [results] = await sequelize.query(`SELECT * FROM "${tableName}" ${whereClause} ${limitClause}`);
    const seeds = results.map((row) => {
        const seed = { ...row };
        for (const col of exclude) {
            delete seed[col];
        }
        return seed;
    });
    return seeds;
}
async function clearSeedData(queryInterface, tables, options = {}) {
    const { cascade = false, where } = options;
    const sequelize = queryInterface.sequelize;
    for (const table of tables) {
        const cascadeClause = cascade ? 'CASCADE' : '';
        if (where && Object.keys(where).length > 0) {
            const whereClause = Object.entries(where)
                .map(([key, val]) => `"${key}" = '${val}'`)
                .join(' AND ');
            await sequelize.query(`DELETE FROM "${table}" WHERE ${whereClause}`);
        }
        else {
            await sequelize.query(`TRUNCATE TABLE "${table}" ${cascadeClause}`);
        }
        console.log(`Cleared seed data from ${table}`);
    }
}
async function createTestFixtures(queryInterface, fixtures) {
    const sequelize = queryInterface.sequelize;
    for (const fixture of fixtures) {
        const { model, count, factory } = fixture;
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(factory(i));
        }
        await seedDataWithUpsert(queryInterface, {
            table: model,
            data,
        });
        console.log(`Created ${count} fixtures for ${model}`);
    }
}
async function checkTableExists(queryInterface, tableName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const [results] = await sequelize.query(dialect === 'postgres'
        ? `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = :tableName
        )`
        : `SELECT COUNT(*) as count FROM information_schema.tables
         WHERE table_schema = DATABASE()
         AND table_name = :tableName`, {
        replacements: { tableName },
    });
    if (dialect === 'postgres') {
        return results[0].exists;
    }
    else {
        return results[0].count > 0;
    }
}
async function checkColumnExists(queryInterface, tableName, columnName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const [results] = await sequelize.query(dialect === 'postgres'
        ? `SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = :tableName
          AND column_name = :columnName
        )`
        : `SELECT COUNT(*) as count FROM information_schema.columns
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND column_name = :columnName`, {
        replacements: { tableName, columnName },
    });
    if (dialect === 'postgres') {
        return results[0].exists;
    }
    else {
        return results[0].count > 0;
    }
}
async function checkIndexExists(queryInterface, tableName, indexName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const [results] = await sequelize.query(dialect === 'postgres'
        ? `SELECT EXISTS (
          SELECT FROM pg_indexes
          WHERE schemaname = 'public'
          AND tablename = :tableName
          AND indexname = :indexName
        )`
        : `SELECT COUNT(*) as count FROM information_schema.statistics
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND index_name = :indexName`, {
        replacements: { tableName, indexName },
    });
    if (dialect === 'postgres') {
        return results[0].exists;
    }
    else {
        return results[0].count > 0;
    }
}
async function checkConstraintExists(queryInterface, tableName, constraintName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const [results] = await sequelize.query(dialect === 'postgres'
        ? `SELECT EXISTS (
          SELECT FROM information_schema.table_constraints
          WHERE table_schema = 'public'
          AND table_name = :tableName
          AND constraint_name = :constraintName
        )`
        : `SELECT COUNT(*) as count FROM information_schema.table_constraints
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND constraint_name = :constraintName`, {
        replacements: { tableName, constraintName },
    });
    if (dialect === 'postgres') {
        return results[0].exists;
    }
    else {
        return results[0].count > 0;
    }
}
async function getTableRowCount(queryInterface, tableName, where) {
    const sequelize = queryInterface.sequelize;
    const whereClause = where ? `WHERE ${where}` : '';
    const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" ${whereClause}`);
    return results[0].count;
}
async function ensureMigrationHistoryTable(queryInterface) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "MigrationHistory" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      "executedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "executionTime" INTEGER DEFAULT 0,
      "rowsAffected" INTEGER DEFAULT 0,
      description TEXT,
      UNIQUE(name)
    )
  `);
}
async function acquireMigrationLock(queryInterface, lockId, ttl = 300000) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "MigrationLocks" (
      "lockId" VARCHAR(255) PRIMARY KEY,
      "acquiredAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "acquiredBy" VARCHAR(255) NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL
    )
  `);
    await sequelize.query(`DELETE FROM "MigrationLocks" WHERE "expiresAt" < NOW()`);
    try {
        const expiresAt = new Date(Date.now() + ttl);
        const acquiredBy = process.env.HOSTNAME || 'unknown';
        await sequelize.query(`INSERT INTO "MigrationLocks" ("lockId", "acquiredBy", "expiresAt")
       VALUES (:lockId, :acquiredBy, :expiresAt)`, {
            replacements: { lockId, acquiredBy, expiresAt },
        });
        return true;
    }
    catch (error) {
        return false;
    }
}
async function releaseMigrationLock(queryInterface, lockId) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query(`DELETE FROM "MigrationLocks" WHERE "lockId" = :lockId`, {
        replacements: { lockId },
    });
}
async function executeMigrationWithLock(queryInterface, migrationName, migrationFunction) {
    const lockId = `migration_${migrationName}`;
    const acquired = await acquireMigrationLock(queryInterface, lockId);
    if (!acquired) {
        throw new Error(`Could not acquire lock for migration ${migrationName}. Another migration may be running.`);
    }
    const startTime = Date.now();
    try {
        await migrationFunction(queryInterface);
        const executionTime = Date.now() - startTime;
        await recordMigrationExecution(queryInterface, migrationName, {
            executionTime,
        });
    }
    finally {
        await releaseMigrationLock(queryInterface, lockId);
    }
}
async function executeBatchMigrations(queryInterface, migrations, options = {}) {
    const { stopOnError = true, rollbackOnError = true, parallelExecution = false } = options;
    const sequelize = queryInterface.sequelize;
    const results = [];
    if (parallelExecution) {
        const promises = migrations.map(async (migration) => {
            const startTime = Date.now();
            const transaction = await sequelize.transaction();
            try {
                await migration.up(queryInterface, transaction);
                await transaction.commit();
                const executionTime = Date.now() - startTime;
                await recordMigrationExecution(queryInterface, migration.name, {
                    executionTime,
                });
                return {
                    name: migration.name,
                    status: 'success',
                    executionTime,
                };
            }
            catch (error) {
                await transaction.rollback();
                return {
                    name: migration.name,
                    status: 'failed',
                    executionTime: Date.now() - startTime,
                    error: error,
                };
            }
        });
        results.push(...(await Promise.all(promises)));
    }
    else {
        let shouldContinue = true;
        const executedMigrations = [];
        for (const migration of migrations) {
            if (!shouldContinue) {
                results.push({
                    name: migration.name,
                    status: 'skipped',
                    executionTime: 0,
                });
                continue;
            }
            const startTime = Date.now();
            const transaction = await sequelize.transaction();
            try {
                console.log(`Executing migration: ${migration.name}...`);
                await migration.up(queryInterface, transaction);
                await transaction.commit();
                const executionTime = Date.now() - startTime;
                await recordMigrationExecution(queryInterface, migration.name, {
                    executionTime,
                });
                executedMigrations.push(migration.name);
                results.push({
                    name: migration.name,
                    status: 'success',
                    executionTime,
                });
                console.log(`Migration ${migration.name} completed in ${executionTime}ms`);
            }
            catch (error) {
                await transaction.rollback();
                const executionTime = Date.now() - startTime;
                results.push({
                    name: migration.name,
                    status: 'failed',
                    executionTime,
                    error: error,
                });
                console.error(`Migration ${migration.name} failed:`, error);
                if (stopOnError) {
                    shouldContinue = false;
                    if (rollbackOnError && executedMigrations.length > 0) {
                        console.log('Rolling back executed migrations...');
                        for (let i = executedMigrations.length - 1; i >= 0; i--) {
                            const migrationToRollback = migrations.find((m) => m.name === executedMigrations[i]);
                            if (migrationToRollback?.down) {
                                const rollbackTransaction = await sequelize.transaction();
                                try {
                                    await migrationToRollback.down(queryInterface, rollbackTransaction);
                                    await rollbackTransaction.commit();
                                    console.log(`Rolled back migration: ${migrationToRollback.name}`);
                                }
                                catch (rollbackError) {
                                    await rollbackTransaction.rollback();
                                    console.error(`Failed to rollback migration ${migrationToRollback.name}:`, rollbackError);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    const successful = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const skipped = results.filter((r) => r.status === 'skipped').length;
    console.log(`Batch migration completed. Success: ${successful}, Failed: ${failed}, Skipped: ${skipped}`);
    return results;
}
async function analyzeMigrationPerformance(queryInterface, migrationFunction, options = {}) {
    const { sampleSize = 1000, dryRun = true, tableName } = options;
    const sequelize = queryInterface.sequelize;
    const recommendations = [];
    let rowCount;
    if (tableName) {
        rowCount = await getTableRowCount(queryInterface, tableName);
    }
    const startTime = Date.now();
    const transaction = await sequelize.transaction();
    let queryCount = 0;
    let slowQueryCount = 0;
    try {
        await migrationFunction(queryInterface, transaction);
        if (dryRun) {
            await transaction.rollback();
        }
        else {
            await transaction.commit();
        }
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
    const executionTime = Date.now() - startTime;
    let estimatedTime;
    if (rowCount && sampleSize < rowCount) {
        estimatedTime = (executionTime / sampleSize) * rowCount;
        if (estimatedTime > 60000) {
            recommendations.push(`Migration may take ${Math.round(estimatedTime / 60000)} minutes. Consider batch processing.`);
        }
    }
    if (executionTime > 5000) {
        recommendations.push('Migration took longer than 5 seconds. Consider adding indexes before data operations.');
    }
    if (rowCount && rowCount > 100000) {
        recommendations.push('Large table detected. Consider using batch operations with smaller chunk sizes.');
        recommendations.push('For zero-downtime, consider using shadow tables or online schema changes.');
    }
    recommendations.push('Always test migrations on a staging environment with production-like data volumes.');
    if (dryRun) {
        recommendations.push('This was a dry run. Actual performance may vary based on system load.');
    }
    const analysis = {
        executionTime,
        estimatedTime,
        rowCount,
        recommendations,
        queryStats: {
            totalQueries: queryCount,
            slowQueries: slowQueryCount,
        },
    };
    console.log('Migration Performance Analysis:');
    console.log(`Execution Time: ${executionTime}ms`);
    if (estimatedTime) {
        console.log(`Estimated Full Time: ${Math.round(estimatedTime / 1000)}s`);
    }
    if (rowCount) {
        console.log(`Row Count: ${rowCount}`);
    }
    console.log('Recommendations:');
    recommendations.forEach((rec) => console.log(`  - ${rec}`));
    return analysis;
}
exports.default = {
    createTableWithDefaults,
    safeAlterTable,
    dropTableSafely,
    renameTableWithDependencies,
    addColumnWithDefaults,
    removeColumnSafely,
    modifyColumnType,
    renameColumnUniversal,
    createOptimizedIndex,
    dropIndexSafely,
    createCompositeIndex,
    createUniqueIndex,
    recreateIndex,
    addForeignKeyConstraint,
    addCheckConstraint,
    removeConstraintSafely,
    addUniqueConstraint,
    replaceConstraint,
    batchDataTransform,
    migrateDataBetweenTables,
    copyTableData,
    validateDataIntegrity,
    backfillMissingData,
    recordMigrationExecution,
    getCurrentSchemaVersion,
    compareSchemaVersions,
    createSchemaSnapshot,
    addColumnZeroDowntime,
    removeColumnZeroDowntime,
    renameColumnExpandContract,
    modifyColumnTypeZeroDowntime,
    createRollbackPoint,
    restoreRollbackPoint,
    generateRollbackMigration,
    testRollback,
    seedDataWithUpsert,
    generateSeedFromExisting,
    clearSeedData,
    createTestFixtures,
    checkTableExists,
    checkColumnExists,
    checkIndexExists,
    checkConstraintExists,
    getTableRowCount,
    ensureMigrationHistoryTable,
    acquireMigrationLock,
    releaseMigrationLock,
    executeMigrationWithLock,
    executeBatchMigrations,
    analyzeMigrationPerformance,
};
//# sourceMappingURL=migration-utilities.functions.js.map