"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableWithDefaults = createTableWithDefaults;
exports.safeAlterTable = safeAlterTable;
exports.dropTableSafely = dropTableSafely;
exports.renameTableWithDependencies = renameTableWithDependencies;
exports.checkTableExists = checkTableExists;
const sequelize_1 = require("sequelize");
async function createTableWithDefaults(queryInterface, tableName, attributes, options = {}, transaction) {
    const { indexes = [], paranoid = false, timestamps = true, underscored = false, comment, } = options;
    const completeAttributes = {
        id: {
            type: sequelize_1.Sequelize.UUID,
            defaultValue: sequelize_1.Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        ...attributes,
    };
    if (timestamps) {
        completeAttributes.createdAt = {
            type: sequelize_1.Sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
        completeAttributes.updatedAt = {
            type: sequelize_1.Sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
        };
    }
    if (paranoid) {
        completeAttributes.deletedAt = {
            type: sequelize_1.Sequelize.DATE,
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
//# sourceMappingURL=migration-builders.js.map