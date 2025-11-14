"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnWithDefaults = addColumnWithDefaults;
exports.removeColumnSafely = removeColumnSafely;
exports.modifyColumnType = modifyColumnType;
exports.renameColumnUniversal = renameColumnUniversal;
exports.checkColumnExists = checkColumnExists;
exports.addColumnZeroDowntime = addColumnZeroDowntime;
exports.removeColumnZeroDowntime = removeColumnZeroDowntime;
exports.renameColumnExpandContract = renameColumnExpandContract;
exports.modifyColumnTypeZeroDowntime = modifyColumnTypeZeroDowntime;
exports.backfillMissingData = backfillMissingData;
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
//# sourceMappingURL=column-operations.service.js.map