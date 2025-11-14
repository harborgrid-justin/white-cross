"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOptimizedIndex = createOptimizedIndex;
exports.dropIndexSafely = dropIndexSafely;
exports.createCompositeIndex = createCompositeIndex;
exports.createUniqueIndex = createUniqueIndex;
exports.recreateIndex = recreateIndex;
exports.checkIndexExists = checkIndexExists;
async function createOptimizedIndex(queryInterface, tableName, indexDefinition, transaction) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const { concurrently = false, ...indexOptions } = indexDefinition;
    if (dialect === 'postgres' && concurrently && !transaction) {
        const indexName = indexDefinition.name ||
            `${tableName}_${indexDefinition.fields.join('_')}_idx`;
        const fields = indexDefinition.fields
            .map((f) => (typeof f === 'string' ? `"${f}"` : `"${f.name}"`))
            .join(', ');
        const unique = indexDefinition.unique ? 'UNIQUE' : '';
        const where = indexDefinition.where
            ? `WHERE ${JSON.stringify(indexDefinition.where)}`
            : '';
        await sequelize.query(`CREATE ${unique} INDEX CONCURRENTLY "${indexName}" ON "${tableName}" (${fields}) ${where}`);
    }
    else {
        await queryInterface.addIndex(tableName, indexDefinition.fields, {
            ...indexOptions,
            transaction,
        });
    }
}
async function dropIndexSafely(queryInterface, tableName, indexName, options = {}, transaction) {
    const { ifExists = true, concurrently = false } = options;
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (ifExists) {
        const indexExists = await checkIndexExists(queryInterface, tableName, indexName);
        if (!indexExists) {
            return;
        }
    }
    if (dialect === 'postgres' && concurrently && !transaction) {
        await sequelize.query(`DROP INDEX CONCURRENTLY IF EXISTS "${indexName}"`);
    }
    else {
        await queryInterface.removeIndex(tableName, indexName, { transaction });
    }
}
async function createCompositeIndex(queryInterface, tableName, columns, options = {}, transaction) {
    const indexName = options.name || `${tableName}_${columns.map((c) => c.name).join('_')}_idx`;
    await queryInterface.addIndex(tableName, columns, {
        name: indexName,
        unique: options.unique || false,
        where: options.where,
        transaction,
    });
}
async function createUniqueIndex(queryInterface, tableName, columnName, options = {}, transaction) {
    const indexName = options.name || `${tableName}_${columnName}_unique`;
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres' && options.nullsNotDistinct) {
        await sequelize.query(`CREATE UNIQUE INDEX "${indexName}" ON "${tableName}" ("${columnName}") NULLS NOT DISTINCT`, { transaction });
    }
    else {
        await queryInterface.addIndex(tableName, [columnName], {
            name: indexName,
            unique: true,
            where: options.where,
            transaction,
        });
    }
}
async function recreateIndex(queryInterface, tableName, indexName, indexDefinition, transaction) {
    await dropIndexSafely(queryInterface, tableName, indexName, {}, transaction);
    await createOptimizedIndex(queryInterface, tableName, { ...indexDefinition, name: indexName }, transaction);
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
//# sourceMappingURL=index-management.js.map