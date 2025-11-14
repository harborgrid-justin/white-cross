"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addForeignKeyConstraint = addForeignKeyConstraint;
exports.addCheckConstraint = addCheckConstraint;
exports.removeConstraintSafely = removeConstraintSafely;
exports.addUniqueConstraint = addUniqueConstraint;
exports.replaceConstraint = replaceConstraint;
exports.checkConstraintExists = checkConstraintExists;
exports.createOptimizedIndex = createOptimizedIndex;
exports.dropIndexSafely = dropIndexSafely;
exports.createCompositeIndex = createCompositeIndex;
exports.createUniqueIndex = createUniqueIndex;
exports.recreateIndex = recreateIndex;
exports.checkIndexExists = checkIndexExists;
exports.analyzeIndexUsage = analyzeIndexUsage;
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
async function createOptimizedIndex(queryInterface, tableName, indexDefinition, transaction) {
    const { name, fields, unique = false, concurrently = false } = indexDefinition;
    if (concurrently && queryInterface.sequelize.getDialect() === 'postgres') {
        const uniqueClause = unique ? 'UNIQUE' : '';
        const fieldsClause = fields
            .map((field) => (typeof field === 'string' ? `"${field}"` : `"${field.name}"`))
            .join(', ');
        await queryInterface.sequelize.query(`CREATE ${uniqueClause} INDEX CONCURRENTLY "${name}" ON "${tableName}" (${fieldsClause})`, { transaction });
    }
    else {
        await queryInterface.addIndex(tableName, fields, {
            ...indexDefinition,
            transaction,
        });
    }
}
async function dropIndexSafely(queryInterface, tableName, indexName, options = {}, transaction) {
    const { ifExists = true, concurrently = false } = options;
    const sequelize = queryInterface.sequelize;
    if (ifExists) {
        const indexExists = await checkIndexExists(queryInterface, tableName, indexName);
        if (!indexExists) {
            return;
        }
    }
    if (concurrently && sequelize.getDialect() === 'postgres') {
        await sequelize.query(`DROP INDEX CONCURRENTLY "${indexName}"`, { transaction });
    }
    else {
        await queryInterface.removeIndex(tableName, indexName, { transaction });
    }
}
async function createCompositeIndex(queryInterface, tableName, columns, indexName, options = {}, transaction) {
    await createOptimizedIndex(queryInterface, tableName, {
        name: indexName,
        fields: columns,
        unique: options.unique,
        where: options.where,
        concurrently: options.concurrently,
    }, transaction);
}
async function createUniqueIndex(queryInterface, tableName, columns, indexName, options = {}, transaction) {
    await createOptimizedIndex(queryInterface, tableName, {
        name: indexName,
        fields: columns,
        unique: true,
        where: options.where,
        concurrently: options.concurrently,
    }, transaction);
}
async function recreateIndex(queryInterface, tableName, indexName, indexDefinition, transaction) {
    const sequelize = queryInterface.sequelize;
    const t = transaction || (await sequelize.transaction());
    try {
        await dropIndexSafely(queryInterface, tableName, indexName, { ifExists: true }, t);
        await createOptimizedIndex(queryInterface, tableName, { ...indexDefinition, name: indexName }, t);
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
async function analyzeIndexUsage(queryInterface, tableName) {
    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();
    const recommendations = [];
    let indexes = [];
    if (dialect === 'postgres') {
        const [results] = await sequelize.query(`
      SELECT 
        i.indexname as name,
        array_agg(a.attname ORDER BY a.attnum) as columns,
        i.indexdef LIKE '%UNIQUE%' as unique,
        pg_size_pretty(pg_relation_size(i.indexname::regclass)) as size,
        s.idx_scan as usage
      FROM pg_indexes i
      JOIN pg_class c ON c.relname = i.tablename
      JOIN pg_index idx ON idx.indexrelid = (i.schemaname||'.'||i.indexname)::regclass::oid
      JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(idx.indkey)
      LEFT JOIN pg_stat_user_indexes s ON s.indexrelname = i.indexname
      WHERE i.tablename = :tableName
        AND i.schemaname = 'public'
      GROUP BY i.indexname, i.indexdef, s.idx_scan
    `, {
            replacements: { tableName },
        });
        indexes = results.map((row) => ({
            name: row.name,
            columns: row.columns,
            unique: row.unique,
            size: row.size,
            usage: row.usage,
        }));
        indexes.forEach((index) => {
            if (index.usage === 0) {
                recommendations.push(`Consider dropping unused index: ${index.name}`);
            }
            if (index.columns.length > 4) {
                recommendations.push(`Index ${index.name} has many columns, consider if all are needed`);
            }
        });
    }
    else {
        const [results] = await sequelize.query(`
      SELECT 
        INDEX_NAME as name,
        GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as columns,
        NON_UNIQUE = 0 as unique
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
      GROUP BY INDEX_NAME, NON_UNIQUE
    `, {
            replacements: { tableName },
        });
        indexes = results.map((row) => ({
            name: row.name,
            columns: row.columns.split(','),
            unique: row.unique,
        }));
    }
    if (indexes.length === 0) {
        recommendations.push('No indexes found. Consider adding indexes on frequently queried columns.');
    }
    if (indexes.filter((idx) => idx.unique).length === 0) {
        recommendations.push('No unique indexes found. Consider adding unique constraints where appropriate.');
    }
    return { indexes, recommendations };
}
//# sourceMappingURL=constraint-operations.service.js.map