"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseIndexManagementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseIndexManagementService = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
let DatabaseIndexManagementService = DatabaseIndexManagementService_1 = class DatabaseIndexManagementService {
    logger = new common_1.Logger(DatabaseIndexManagementService_1.name);
    async listAllIndexes(context, tableName) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const whereClause = tableName ? `AND t.relname = :tableName` : '';
            const [results] = await sequelize.query(`
        SELECT
          i.relname AS name,
          t.relname AS "tableName",
          array_agg(a.attname ORDER BY a.attnum) AS "columnNames",
          ix.indisunique AS unique,
          am.amname AS type,
          pg_relation_size(i.oid) AS size,
          COALESCE(s.idx_scan, 0) AS scans,
          COALESCE(s.idx_tup_read, 0) AS "tuples_read",
          COALESCE(s.idx_tup_fetch, 0) AS "tuples_fetched",
          pg_get_indexdef(i.oid) AS "indexDef",
          ix.indisvalid AS "isValid"
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        JOIN pg_am am ON i.relam = am.oid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
        LEFT JOIN pg_stat_user_indexes s ON s.indexrelid = i.oid
        WHERE t.relkind = 'r'
          AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
          ${whereClause}
        GROUP BY i.relname, t.relname, ix.indisunique, am.amname, i.oid,
                 s.idx_scan, s.idx_tup_read, s.idx_tup_fetch, ix.indisvalid
        ORDER BY t.relname, i.relname
      `, {
                replacements: { tableName },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return results;
        }
        else if (dialect === 'mysql') {
            const whereClause = tableName ? `WHERE TABLE_NAME = :tableName` : '';
            const [results] = await sequelize.query(`
        SELECT
          INDEX_NAME AS name,
          TABLE_NAME AS tableName,
          COLUMN_NAME AS columnName,
          NON_UNIQUE = 0 AS \`unique\`,
          INDEX_TYPE AS type,
          CARDINALITY AS scans
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          ${whereClause}
        ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
      `, {
                replacements: { tableName },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const indexMap = new Map();
            for (const row of results) {
                if (!indexMap.has(row.name)) {
                    indexMap.set(row.name, {
                        name: row.name,
                        tableName: row.tableName,
                        columnNames: [],
                        unique: row.unique,
                        type: row.type.toLowerCase(),
                        size: 0,
                        scans: row.scans || 0,
                        tuples_read: 0,
                        tuples_fetched: 0,
                        indexDef: '',
                        isValid: true,
                    });
                }
                indexMap.get(row.name).columnNames.push(row.columnName);
            }
            return Array.from(indexMap.values());
        }
        return [];
    }
    async analyzeIndexUsage(context, minScans = 10) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const [results] = await sequelize.query(`
        SELECT
          schemaname AS "schemaName",
          tablename AS "tableName",
          indexname AS "indexName",
          idx_scan AS "indexScans",
          idx_tup_read AS "tuplesRead",
          idx_tup_fetch AS "tuplesFetched",
          pg_relation_size(indexrelid) AS "sizeBytes",
          CASE
            WHEN idx_scan = 0 THEN 'Never used'
            WHEN idx_scan < :minScans THEN 'Rarely used'
            ELSE NULL
          END AS "unusedReason"
        FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
          AND idx_scan < :minScans
          AND indexname NOT LIKE '%_pkey'
        ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC
      `, {
                replacements: { minScans },
                type: sequelize_1.QueryTypes.SELECT,
            });
            return results;
        }
        return [];
    }
    async createOptimizedIndex(queryInterface, tableName, columns, options = {}) {
        const { unique = false, name, type = 'btree', where, concurrently = true, operator, } = options;
        const sequelize = queryInterface.sequelize;
        const dialect = sequelize.getDialect();
        const indexName = name || `idx_${tableName}_${columns.join('_')}`;
        if (dialect === 'postgres') {
            const uniqueClause = unique ? 'UNIQUE' : '';
            const concurrentlyClause = concurrently ? 'CONCURRENTLY' : '';
            const columnList = columns.map(col => operator ? `${col} ${operator}` : col).join(', ');
            const whereClause = where ? `WHERE ${where}` : '';
            await sequelize.query(`CREATE ${uniqueClause} INDEX ${concurrentlyClause} "${indexName}"
         ON "${tableName}" USING ${type} (${columnList}) ${whereClause}`, { raw: true });
        }
        else {
            await queryInterface.addIndex(tableName, columns, {
                name: indexName,
                unique,
                type: type === 'btree' ? undefined : type,
                where: where ? { [where]: true } : undefined,
            });
        }
    }
    async rebuildIndex(context, indexName, concurrent = true) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const concurrentlyClause = concurrent ? 'CONCURRENTLY' : '';
            await sequelize.query(`REINDEX INDEX ${concurrentlyClause} "${indexName}"`, {
                raw: true,
            });
        }
        else if (dialect === 'mysql') {
            const [results] = await sequelize.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.STATISTICS
         WHERE INDEX_NAME = :indexName AND TABLE_SCHEMA = DATABASE() LIMIT 1`, {
                replacements: { indexName },
                type: sequelize_1.QueryTypes.SELECT,
            });
            if (results.length > 0) {
                const tableName = results[0].TABLE_NAME;
                await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
            }
        }
    }
    async analyzeTable(context, tableName, columns) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const columnClause = columns ? `(${columns.join(', ')})` : '';
            await sequelize.query(`ANALYZE "${tableName}" ${columnClause}`, { raw: true });
        }
        else if (dialect === 'mysql') {
            const columnClause = columns ? `(${columns.join(', ')})` : '';
            await sequelize.query(`ANALYZE TABLE \`${tableName}\` ${columnClause}`);
        }
    }
    async findDuplicateIndexes(context) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        if (dialect === 'postgres') {
            const [results] = await sequelize.query(`
        SELECT
          t.relname AS "tableName",
          array_agg(i.relname ORDER BY i.relname) AS indexes,
          'Duplicate column sets found' AS reason
        FROM pg_class t
        JOIN pg_index ix ON t.oid = ix.indrelid
        JOIN pg_class i ON i.oid = ix.indexrelid
        WHERE t.relkind = 'r'
          AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        GROUP BY t.relname, ix.indkey
        HAVING COUNT(*) > 1
        ORDER BY t.relname
      `, { type: sequelize_1.QueryTypes.SELECT });
            return results;
        }
        return [];
    }
    async calculateIndexColumnOrder(context, tableName, columns) {
        const { sequelize } = context;
        const columnStats = [];
        for (const column of columns) {
            try {
                const [stats] = await sequelize.query(`
          SELECT
            n_distinct,
            correlation,
            (SELECT reltuples FROM pg_class WHERE oid = attrelid) as total_rows
          FROM pg_stats
          WHERE tablename = :tableName AND attname = :column
        `, {
                    replacements: { tableName, column },
                    type: sequelize_1.QueryTypes.SELECT,
                });
                if (stats && stats.length > 0) {
                    const stat = stats[0];
                    const selectivity = stat.n_distinct > 0 ? stat.n_distinct / stat.total_rows : 0;
                    columnStats.push({
                        column,
                        selectivity,
                        correlation: stat.correlation || 0,
                    });
                }
            }
            catch (error) {
                this.logger.warn(`Could not get stats for column ${column}:`, error);
            }
        }
        columnStats.sort((a, b) => {
            if (Math.abs(a.selectivity - b.selectivity) > 0.1) {
                return b.selectivity - a.selectivity;
            }
            return Math.abs(a.correlation) - Math.abs(b.correlation);
        });
        const orderedColumns = columnStats.map((stat) => stat.column);
        const reasoning = `Ordered by selectivity (${columnStats.map((s) => `${s.column}:${s.selectivity.toFixed(2)}`).join(', ')})`;
        return { orderedColumns, reasoning };
    }
    async estimateIndexSize(context, tableName, columns) {
        const { sequelize } = context;
        try {
            const [tableStats] = await sequelize.query(`SELECT reltuples as row_count FROM pg_class WHERE relname = :tableName`, {
                replacements: { tableName },
                type: sequelize_1.QueryTypes.SELECT,
            });
            const rowCount = tableStats[0]?.row_count || 0;
            const estimatedSize = rowCount * columns.length * 8 + 4096;
            return {
                estimatedSize: Math.round(estimatedSize),
                rowCount,
                reasoning: `Estimated ${columns.length} columns × ${rowCount} rows × 8 bytes + 4KB overhead`
            };
        }
        catch (error) {
            this.logger.error('Error estimating index size:', error);
            return { estimatedSize: 0, rowCount: 0, reasoning: 'Could not estimate size' };
        }
    }
    async validateIndexIntegrity(context, indexName) {
        const { sequelize } = context;
        const dialect = sequelize.getDialect();
        const issues = [];
        const recommendations = [];
        if (dialect === 'postgres') {
            try {
                const [indexCheck] = await sequelize.query(`SELECT indisvalid, indisready FROM pg_index WHERE indexrelid = (
            SELECT oid FROM pg_class WHERE relname = :indexName
          )`, {
                    replacements: { indexName },
                    type: sequelize_1.QueryTypes.SELECT,
                });
                if (indexCheck && indexCheck.length > 0) {
                    const index = indexCheck[0];
                    if (!index.indisvalid) {
                        issues.push('Index is marked as invalid');
                        recommendations.push('Rebuild the index to fix corruption');
                    }
                    if (!index.indisready) {
                        issues.push('Index is not ready for use');
                        recommendations.push('Wait for index build to complete or rebuild');
                    }
                }
                else {
                    issues.push('Index does not exist');
                    recommendations.push('Create the index if needed');
                }
            }
            catch (error) {
                issues.push(`Error checking index: ${error}`);
                recommendations.push('Manually verify index integrity');
            }
        }
        return {
            isValid: issues.length === 0,
            issues,
            recommendations,
        };
    }
    async generateIndexRecommendations(context, queryLogs) {
        const recommendations = [];
        if (!queryLogs || queryLogs.length === 0) {
            return recommendations;
        }
        for (const log of queryLogs.filter((log) => log.executionTime > 1000)) {
            try {
                const { sequelize } = context;
                const whereMatch = log.query.match(/WHERE\s+(.+?)(?:\s+(?:ORDER|GROUP|LIMIT|$))/i);
                if (whereMatch) {
                    const whereClause = whereMatch[1];
                    const columnMatches = whereClause.match(/\b(\w+)\s*[=<>!]+\s*[^=<>!]/g);
                    if (columnMatches) {
                        const columns = columnMatches.map(match => match.split(/\s*[=<>!]+\s*/)[0].trim());
                        if (columns.length > 0) {
                            recommendations.push({
                                tableName: 'unknown',
                                columns,
                                reason: `Slow query (${log.executionTime}ms) with WHERE on ${columns.join(', ')}`,
                                estimatedImprovement: Math.min(log.executionTime * 0.8, 5000),
                                priority: log.executionTime > 5000 ? 'high' : 'medium',
                                indexType: 'btree',
                                createStatement: `CREATE INDEX idx_${columns.join('_')} ON table (${columns.join(', ')});`
                            });
                        }
                    }
                }
            }
            catch (error) {
                this.logger.warn('Error analyzing query for index recommendation:', error);
            }
        }
        return recommendations;
    }
};
exports.DatabaseIndexManagementService = DatabaseIndexManagementService;
exports.DatabaseIndexManagementService = DatabaseIndexManagementService = DatabaseIndexManagementService_1 = __decorate([
    (0, common_1.Injectable)()
], DatabaseIndexManagementService);
//# sourceMappingURL=index.js.map