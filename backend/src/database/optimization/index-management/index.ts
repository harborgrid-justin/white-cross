/**
 * Database Index Management
 *
 * Functions for managing database indexes, analyzing usage,
 * and optimizing index performance in the White Cross healthcare platform.
 */

import { Sequelize, QueryInterface, QueryTypes } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import {
  IndexInfo,
  IndexUsageStats,
  IndexRecommendation,
  DatabaseOptimizationContext
} from '../types';

@Injectable()
export class DatabaseIndexManagementService {
  private readonly logger = new Logger(DatabaseIndexManagementService.name);

  /**
   * Lists all indexes in the database with detailed information
   */
  async listAllIndexes(
    context: DatabaseOptimizationContext,
    tableName?: string,
  ): Promise<IndexInfo[]> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const whereClause = tableName ? `AND t.relname = :tableName` : '';

      const [results] = await sequelize.query(
        `
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
      `,
        {
          replacements: { tableName },
          type: QueryTypes.SELECT,
        }
      );

      return results as IndexInfo[];
    } else if (dialect === 'mysql') {
      const whereClause = tableName ? `WHERE TABLE_NAME = :tableName` : '';

      const [results] = await sequelize.query(
        `
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
      `,
        {
          replacements: { tableName },
          type: QueryTypes.SELECT,
        }
      );

      // Group by index name
      const indexMap = new Map<string, any>();
      for (const row of results as any[]) {
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

  /**
   * Analyzes index usage and identifies unused indexes
   */
  async analyzeIndexUsage(
    context: DatabaseOptimizationContext,
    minScans: number = 10,
  ): Promise<IndexUsageStats[]> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const [results] = await sequelize.query(
        `
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
      `,
        {
          replacements: { minScans },
          type: QueryTypes.SELECT,
        }
      );

      return results as IndexUsageStats[];
    }

    return [];
  }

  /**
   * Creates an optimized index with automatic type selection
   */
  async createOptimizedIndex(
    queryInterface: QueryInterface,
    tableName: string,
    columns: string[],
    options: {
      unique?: boolean;
      name?: string;
      type?: 'btree' | 'hash' | 'gin' | 'gist' | 'brin';
      where?: string;
      concurrently?: boolean;
      operator?: string;
    } = {}
  ): Promise<void> {
    const {
      unique = false,
      name,
      type = 'btree',
      where,
      concurrently = true,
      operator,
    } = options;

    const sequelize = queryInterface.sequelize;
    const dialect = sequelize.getDialect();

    const indexName = name || `idx_${tableName}_${columns.join('_')}`;

    if (dialect === 'postgres') {
      const uniqueClause = unique ? 'UNIQUE' : '';
      const concurrentlyClause = concurrently ? 'CONCURRENTLY' : '';
      const columnList = columns.map(col =>
        operator ? `${col} ${operator}` : col
      ).join(', ');
      const whereClause = where ? `WHERE ${where}` : '';

      await sequelize.query(
        `CREATE ${uniqueClause} INDEX ${concurrentlyClause} "${indexName}"
         ON "${tableName}" USING ${type} (${columnList}) ${whereClause}`,
        { raw: true }
      );
    } else {
      await queryInterface.addIndex(tableName, columns, {
        name: indexName,
        unique,
        type: type === 'btree' ? undefined : type,
        where: where ? { [where]: true } : undefined,
      });
    }
  }

  /**
   * Rebuilds an index to reclaim space and improve performance
   */
  async rebuildIndex(
    context: DatabaseOptimizationContext,
    indexName: string,
    concurrent: boolean = true
  ): Promise<void> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const concurrentlyClause = concurrent ? 'CONCURRENTLY' : '';
      await sequelize.query(`REINDEX INDEX ${concurrentlyClause} "${indexName}"`, {
        raw: true,
      });
    } else if (dialect === 'mysql') {
      // MySQL doesn't support concurrent index rebuild
      // Need to get table name first
      const [results] = await sequelize.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.STATISTICS
         WHERE INDEX_NAME = :indexName AND TABLE_SCHEMA = DATABASE() LIMIT 1`,
        {
          replacements: { indexName },
          type: QueryTypes.SELECT,
        }
      );

      if (results.length > 0) {
        const tableName = (results[0] as any).TABLE_NAME;
        await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``);
        // Note: Would need index definition to recreate
      }
    }
  }

  /**
   * Analyzes table and updates statistics for query optimizer
   */
  async analyzeTable(
    context: DatabaseOptimizationContext,
    tableName: string,
    columns?: string[],
  ): Promise<void> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const columnClause = columns ? `(${columns.join(', ')})` : '';
      await sequelize.query(`ANALYZE "${tableName}" ${columnClause}`, { raw: true });
    } else if (dialect === 'mysql') {
      const columnClause = columns ? `(${columns.join(', ')})` : '';
      await sequelize.query(`ANALYZE TABLE \`${tableName}\` ${columnClause}`);
    }
  }

  /**
   * Finds duplicate indexes that can be consolidated
   */
  async findDuplicateIndexes(
    context: DatabaseOptimizationContext,
  ): Promise<Array<{ tableName: string; indexes: string[]; reason: string }>> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    if (dialect === 'postgres') {
      const [results] = await sequelize.query(
        `
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
      `,
        { type: QueryTypes.SELECT }
      );

      return results as Array<{ tableName: string; indexes: string[]; reason: string }>;
    }

    return [];
  }

  /**
   * Calculates optimal column order for composite indexes
   */
  async calculateIndexColumnOrder(
    context: DatabaseOptimizationContext,
    tableName: string,
    columns: string[],
  ): Promise<{ orderedColumns: string[]; reasoning: string }> {
    const { sequelize } = context;

    // Analyze column selectivity and correlation
    const columnStats: Array<{ column: string; selectivity: number; correlation: number }> = [];

    for (const column of columns) {
      try {
        const [stats] = await sequelize.query(
          `
          SELECT
            n_distinct,
            correlation,
            (SELECT reltuples FROM pg_class WHERE oid = attrelid) as total_rows
          FROM pg_stats
          WHERE tablename = :tableName AND attname = :column
        `,
          {
            replacements: { tableName, column },
            type: QueryTypes.SELECT,
          }
        );

        if (stats && stats.length > 0) {
          const stat = stats[0] as any;
          const selectivity = stat.n_distinct > 0 ? stat.n_distinct / stat.total_rows : 0;
          columnStats.push({
            column,
            selectivity,
            correlation: stat.correlation || 0,
          });
        }
      } catch (error) {
        this.logger.warn(`Could not get stats for column ${column}:`, error);
      }
    }

    // Order by selectivity (highest first), then by correlation
    columnStats.sort((a, b) => {
      if (Math.abs(a.selectivity - b.selectivity) > 0.1) {
        return b.selectivity - a.selectivity; // Higher selectivity first
      }
      return Math.abs(a.correlation) - Math.abs(b.correlation); // Lower correlation first
    });

    const orderedColumns = columnStats.map((stat) => stat.column);
    const reasoning = `Ordered by selectivity (${columnStats.map((s) => `${s.column}:${s.selectivity.toFixed(2)}`).join(', ')})`;

    return { orderedColumns, reasoning };
  }

  /**
   * Estimates the size of a potential index
   */
  async estimateIndexSize(
    context: DatabaseOptimizationContext,
    tableName: string,
    columns: string[],
  ): Promise<{ estimatedSize: number; rowCount: number; reasoning: string }> {
    const { sequelize } = context;

    try {
      const [tableStats] = await sequelize.query(
        `SELECT reltuples as row_count FROM pg_class WHERE relname = :tableName`,
        {
          replacements: { tableName },
          type: QueryTypes.SELECT,
        }
      );

      const rowCount = (tableStats[0] as any)?.row_count || 0;

      // Rough estimation: assume 8 bytes per row per column + overhead
      const estimatedSize = rowCount * columns.length * 8 + 4096; // 4KB overhead

      return {
        estimatedSize: Math.round(estimatedSize),
        rowCount,
        reasoning: `Estimated ${columns.length} columns × ${rowCount} rows × 8 bytes + 4KB overhead`
      };
    } catch (error) {
      this.logger.error('Error estimating index size:', error);
      return { estimatedSize: 0, rowCount: 0, reasoning: 'Could not estimate size' };
    }
  }

  /**
   * Validates index integrity and checks for corruption
   */
  async validateIndexIntegrity(
    context: DatabaseOptimizationContext,
    indexName: string,
  ): Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }> {
    const { sequelize } = context;
    const dialect = sequelize.getDialect();

    const issues: string[] = [];
    const recommendations: string[] = [];

    if (dialect === 'postgres') {
      try {
        // Check if index exists and is valid
        const [indexCheck] = await sequelize.query(
          `SELECT indisvalid, indisready FROM pg_index WHERE indexrelid = (
            SELECT oid FROM pg_class WHERE relname = :indexName
          )`,
          {
            replacements: { indexName },
            type: QueryTypes.SELECT,
          }
        );

        if (indexCheck && indexCheck.length > 0) {
          const index = indexCheck[0] as any;
          if (!index.indisvalid) {
            issues.push('Index is marked as invalid');
            recommendations.push('Rebuild the index to fix corruption');
          }
          if (!index.indisready) {
            issues.push('Index is not ready for use');
            recommendations.push('Wait for index build to complete or rebuild');
          }
        } else {
          issues.push('Index does not exist');
          recommendations.push('Create the index if needed');
        }
      } catch (error) {
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

  /**
   * Generates index recommendations based on query patterns
   */
  async generateIndexRecommendations(
    context: DatabaseOptimizationContext,
    queryLogs?: Array<{ query: string; executionTime: number }>,
  ): Promise<IndexRecommendation[]> {
    const recommendations: IndexRecommendation[] = [];

    if (!queryLogs || queryLogs.length === 0) {
      return recommendations;
    }

    // Analyze slow queries for missing indexes
    for (const log of queryLogs.filter((log) => log.executionTime > 1000)) { // > 1 second
      try {
        const { sequelize } = context;

        // Simple WHERE clause analysis
        const whereMatch = log.query.match(/WHERE\s+(.+?)(?:\s+(?:ORDER|GROUP|LIMIT|$))/i);
        if (whereMatch) {
          const whereClause = whereMatch[1];

          // Extract column references
          const columnMatches = whereClause.match(/\b(\w+)\s*[=<>!]+\s*[^=<>!]/g);
          if (columnMatches) {
            const columns = columnMatches.map(match => match.split(/\s*[=<>!]+\s*/)[0].trim());

            // Check if these columns would benefit from an index
            if (columns.length > 0) {
              recommendations.push({
                tableName: 'unknown', // Would need table extraction from query
                columns,
                reason: `Slow query (${log.executionTime}ms) with WHERE on ${columns.join(', ')}`,
                estimatedImprovement: Math.min(log.executionTime * 0.8, 5000), // Estimate 80% improvement
                priority: log.executionTime > 5000 ? 'high' : 'medium',
                indexType: 'btree',
                createStatement: `CREATE INDEX idx_${columns.join('_')} ON table (${columns.join(', ')});`
              });
            }
          }
        }
      } catch (error) {
        this.logger.warn('Error analyzing query for index recommendation:', error);
      }
    }

    return recommendations;
  }
}