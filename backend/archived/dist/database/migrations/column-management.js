"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnWithDefaults = addColumnWithDefaults;
exports.removeColumnSafely = removeColumnSafely;
exports.modifyColumnType = modifyColumnType;
exports.renameColumnUniversal = renameColumnUniversal;
exports.checkColumnExists = checkColumnExists;
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
//# sourceMappingURL=column-management.js.map