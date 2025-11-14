"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableWithDefaults = createTableWithDefaults;
exports.safeAlterTable = safeAlterTable;
exports.dropTableSafely = dropTableSafely;
exports.renameTableWithDependencies = renameTableWithDependencies;
exports.checkTableExists = checkTableExists;
exports.getTableRowCount = getTableRowCount;
exports.createTableBackup = createTableBackup;
exports.restoreTableFromBackup = restoreTableFromBackup;
exports.compareTableStructures = compareTableStructures;
const sequelize_1 = require("sequelize");
const table_attributes_builder_1 = require("./table-attributes-builder");
async function createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
    const { indexes = [], paranoid = false, timestamps = true, underscored = false, comment, } = options;
    const completeAttributes = (0, table_attributes_builder_1.buildTableAttributes)(attributes, { timestamps, paranoid });
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
            transaction,
        });
        for (const seq of sequences) {
            const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
            await sequelize.query(`ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`, { transaction });
        }
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
async function getTableRowCount(queryInterface, tableName, where) {
    const sequelize = queryInterface.sequelize;
    const whereClause = where ? `WHERE ${where}` : '';
    const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}" ${whereClause}`);
    return results[0].count;
}
async function createTableBackup(queryInterface, sourceTable, backupTable, options = {}, transaction) {
    const { includeData = true, where } = options;
    const sequelize = queryInterface.sequelize;
    if (includeData) {
        const whereClause = where ? `WHERE ${where}` : '';
        await sequelize.query(`CREATE TABLE "${backupTable}" AS SELECT * FROM "${sourceTable}" ${whereClause}`, { transaction });
    }
    else {
        await sequelize.query(`CREATE TABLE "${backupTable}" AS SELECT * FROM "${sourceTable}" WHERE 1=0`, { transaction });
    }
    console.log(`Table backup created: ${backupTable}`);
}
async function restoreTableFromBackup(queryInterface, targetTable, backupTable, options = {}, transaction) {
    const { truncateFirst = true, verify = true } = options;
    const sequelize = queryInterface.sequelize;
    if (truncateFirst) {
        await sequelize.query(`TRUNCATE TABLE "${targetTable}" CASCADE`, {
            transaction,
        });
    }
    await sequelize.query(`INSERT INTO "${targetTable}" SELECT * FROM "${backupTable}"`, { transaction });
    if (verify) {
        const [targetCount] = await sequelize.query(`SELECT COUNT(*) as count FROM "${targetTable}"`, { transaction });
        const [backupCount] = await sequelize.query(`SELECT COUNT(*) as count FROM "${backupTable}"`, { transaction });
        if (targetCount[0].count !==
            backupCount[0].count) {
            throw new Error(`Restore verification failed: row count mismatch for ${targetTable}`);
        }
    }
    console.log(`Table restored from backup: ${targetTable}`);
}
async function compareTableStructures(queryInterface, table1, table2) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const differences = [];
    const [table1Columns] = await sequelize.query(dialect === 'postgres'
        ? `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName
         ORDER BY ordinal_position`
        : `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName AND table_schema = DATABASE()
         ORDER BY ordinal_position`, { replacements: { tableName: table1 } });
    const [table2Columns] = await sequelize.query(dialect === 'postgres'
        ? `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName
         ORDER BY ordinal_position`
        : `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName AND table_schema = DATABASE()
         ORDER BY ordinal_position`, { replacements: { tableName: table2 } });
    if (table1Columns.length !== table2Columns.length) {
        differences.push(`Column count mismatch: ${table1} has ${table1Columns.length} columns, ${table2} has ${table2Columns.length} columns`);
    }
    const table1ColumnMap = new Map(table1Columns.map((col) => [
        col.column_name,
        col,
    ]));
    const table2ColumnMap = new Map(table2Columns.map((col) => [
        col.column_name,
        col,
    ]));
    for (const [columnName, columnInfo] of table1ColumnMap) {
        if (!table2ColumnMap.has(columnName)) {
            differences.push(`Column '${columnName}' exists in ${table1} but not in ${table2}`);
        }
        else {
            const table2Column = table2ColumnMap.get(columnName);
            if (columnInfo.data_type !== table2Column.data_type) {
                differences.push(`Column '${columnName}' type mismatch: ${columnInfo.data_type} vs ${table2Column.data_type}`);
            }
            if (columnInfo.is_nullable !== table2Column.is_nullable) {
                differences.push(`Column '${columnName}' nullable mismatch: ${columnInfo.is_nullable} vs ${table2Column.is_nullable}`);
            }
        }
    }
    for (const columnName of table2ColumnMap.keys()) {
        if (!table1ColumnMap.has(columnName)) {
            differences.push(`Column '${columnName}' exists in ${table2} but not in ${table1}`);
        }
    }
    return {
        identical: differences.length === 0,
        differences,
    };
}
//# sourceMappingURL=table-operations.service.js.map