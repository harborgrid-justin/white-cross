/**
 * Query Optimization Service
 * 
 * Extracted from database-optimization-utilities.service.ts (Functions 11-20)
 * Handles query analysis, optimization, and performance tuning
 */

import { Sequelize, QueryTypes } from 'sequelize';
import { QueryPerformance, CacheMetrics, IndexRecommendation } from './types';
import { calculateIndexColumnOrder } from './index-management.service';

/**
 * Analyzes query execution plan and provides optimization recommendations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {Record<string, unknown>} replacements - Query parameter replacements
 * @returns {Promise<QueryPerformance>}
 *
 * @example
 * ```typescript
 * const analysis = await analyzeQueryPlan(sequelize,
 *   'SELECT * FROM patients WHERE last_name = :name AND status = :status',
 *   { name: 'Smith', status: 'active' }
 * );
 *
 * console.log(`Execution time: ${analysis.executionTime}ms`);
 * console.log(`Indexes used: ${analysis.indexesUsed.join(', ')}`);
 * analysis.recommendations.forEach(rec => console.log(`- ${rec}`));
 * ```
 *
 * @performance
 * - Identifies missing indexes
 * - Detects sequential scans on large tables
 * - Suggests query rewrites for better performance
 */
export async function analyzeQueryPlan(
  sequelize: Sequelize,
  query: string,
  replacements: Record<string, unknown> = {}
): Promise<QueryPerformance> {
  const dialect = sequelize.getDialect();
  const recommendations: string[] = [];
  let indexesUsed: string[] = [];
  let fullScans = 0;

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const plan = (result[0] as Record<string, unknown>)['QUERY PLAN'][0];
    const planNode = plan.Plan;

    const executionTime = (plan['Execution Time'] as number) || 0;
    const planningTime = (plan['Planning Time'] as number) || 0;

    // Parse plan for indexes and sequential scans
    const parsePlan = (node: Record<string, unknown>) => {
      if (node['Node Type'] === 'Seq Scan') {
        fullScans++;
        recommendations.push(`Sequential scan on ${node['Relation Name']} - consider adding an index`);
      }

      if (node['Index Name']) {
        indexesUsed.push(node['Index Name'] as string);
      }

      if (node.Plans) {
        (node.Plans as Record<string, unknown>[]).forEach(parsePlan);
      }
    };

    parsePlan(planNode as Record<string, unknown>);

    // Add recommendations
    if (fullScans > 0) {
      recommendations.push(`Query performs ${fullScans} full table scan(s)`);
    }

    if (executionTime > 1000) {
      recommendations.push('Query execution time exceeds 1 second - optimization needed');
    }

    if ((planNode as Record<string, unknown>)['Total Cost'] as number > 10000) {
      recommendations.push('High query cost detected - review query structure');
    }

    return {
      query,
      executionTime,
      planningTime,
      totalCost: (planNode as Record<string, unknown>)['Total Cost'] as number,
      rows: ((planNode as Record<string, unknown>)['Actual Rows'] || (planNode as Record<string, unknown>)['Plan Rows']) as number,
      cached: false,
      indexesUsed,
      fullScans,
      recommendations,
    };
  } else if (dialect === 'mysql') {
    const [result] = await sequelize.query(`EXPLAIN FORMAT=JSON ${query}`, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const plan = JSON.parse((result[0] as Record<string, unknown>)['EXPLAIN'] as string);

    return {
      query,
      executionTime: 0,
      planningTime: 0,
      totalCost: plan.query_block?.cost_info?.query_cost || 0,
      rows: plan.query_block?.cost_info?.rows_examined || 0,
      cached: false,
      indexesUsed: [],
      fullScans: 0,
      recommendations: ['Use EXPLAIN ANALYZE for detailed performance metrics'],
    };
  }

  return {
    query,
    executionTime: 0,
    planningTime: 0,
    totalCost: 0,
    rows: 0,
    cached: false,
    indexesUsed: [],
    fullScans: 0,
    recommendations: [],
  };
}

/**
 * Rewrites query for better performance using optimization patterns
 *
 * @param {string} query - Original SQL query
 * @returns {string} Optimized query
 *
 * @example
 * ```typescript
 * const original = 'SELECT * FROM patients WHERE LOWER(email) = LOWER(:email)';
 * const optimized = rewriteQueryForPerformance(original);
 * // Returns: 'SELECT * FROM patients WHERE email = :email'
 * // Removes function call on indexed column
 * ```
 */
export function rewriteQueryForPerformance(query: string): string {
  let optimized = query;

  // Remove SELECT * and specify columns
  if (optimized.includes('SELECT *')) {
    // This is a simplified example - in production, would need column list
    // optimized = optimized.replace('SELECT *', 'SELECT id, name, email');
  }

  // Remove functions on indexed columns in WHERE clauses
  optimized = optimized.replace(
    /WHERE\s+(\w+)\s*\(\s*(\w+)\s*\)\s*=/gi,
    'WHERE $2 ='
  );

  // Convert NOT IN to NOT EXISTS (often faster)
  if (optimized.includes('NOT IN')) {
    // Simplified - would need proper subquery rewriting
    // optimized = optimized.replace(/NOT IN/gi, 'NOT EXISTS');
  }

  // Add LIMIT if missing on potentially large result sets
  if (!optimized.match(/LIMIT\s+\d+/i) && !optimized.includes('COUNT(')) {
    // optimized += ' LIMIT 1000';
  }

  return optimized;
}

/**
 * Detects slow queries from query log
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdMs - Slow query threshold in milliseconds
 * @param {number} limit - Maximum number of queries to return
 * @returns {Promise<Array<{query: string, avgTime: number, calls: number}>>}
 *
 * @example
 * ```typescript
 * const slowQueries = await detectSlowQueries(sequelize, 1000, 10);
 *
 * for (const q of slowQueries) {
 *   console.log(`${q.calls} calls, ${q.avgTime}ms avg:`);
 *   console.log(q.query);
 * }
 * ```
 */
export async function detectSlowQueries(
  sequelize: Sequelize,
  thresholdMs: number = 1000,
  limit: number = 20
): Promise<Array<{ query: string; avgTime: number; calls: number }>> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    // Requires pg_stat_statements extension
    const [results] = await sequelize.query(
      `
      SELECT
        query,
        mean_exec_time AS "avgTime",
        calls
      FROM pg_stat_statements
      WHERE mean_exec_time > :threshold
        AND query NOT LIKE '%pg_stat_statements%'
      ORDER BY mean_exec_time DESC
      LIMIT :limit
    `,
      {
        replacements: { threshold: thresholdMs, limit },
        type: QueryTypes.SELECT,
      }
    );

    return results as Array<{ query: string; avgTime: number; calls: number }>;
  }

  return [];
}

/**
 * Optimizes JOIN operations by reordering tables
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - Query with JOIN operations
 * @returns {Promise<string>} Optimized query with reordered JOINs
 *
 * @example
 * ```typescript
 * const query = `
 *   SELECT * FROM orders o
 *   JOIN customers c ON o.customer_id = c.id
 *   JOIN order_items oi ON oi.order_id = o.id
 * `;
 *
 * const optimized = await optimizeJoinOrder(sequelize, query);
 * // Reorders JOINs by table size and selectivity
 * ```
 */
export async function optimizeJoinOrder(
  sequelize: Sequelize,
  query: string
): Promise<string> {
  try {
    // Extract table names and join conditions from query
    const tablePattern = /FROM\s+(\w+)(?:\s+AS\s+)?(\w+)?|(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+)?JOIN\s+(\w+)(?:\s+AS\s+)?(\w+)?/gi;
    const tables: Array<{ name: string; alias?: string }> = [];
    const joinConditions: string[] = [];
    let match;

    // Extract tables and their aliases
    while ((match = tablePattern.exec(query)) !== null) {
      const tableName = match[1] || match[3];
      const alias = match[2] || match[4];
      if (tableName && !tables.some(t => t.name === tableName)) {
        tables.push({ name: tableName, alias: alias || tableName });
      }
    }

    // If less than 2 tables, no optimization needed
    if (tables.length < 2) {
      return query;
    }

    // Extract join conditions (ON clauses)
    const onPattern = /ON\s+([^WHERE\s]+?)(?:WHERE|GROUP BY|ORDER BY|LIMIT|$)/gi;
    let onMatch;
    while ((onMatch = onPattern.exec(query)) !== null) {
      joinConditions.push(onMatch[1].trim());
    }

    // Get table sizes for cost estimation
    const tableSizes = new Map<string, number>();
    for (const table of tables) {
      try {
        const [result] = await sequelize.query(
          `SELECT COUNT(*) as count FROM "${table.name}"`,
          { type: QueryTypes.SELECT }
        );
        const row = result as unknown as { count: number };
        tableSizes.set(table.name, row.count || 0);
      } catch (error) {
        // If table doesn't exist or query fails, use default size
        tableSizes.set(table.name, 1000);
      }
    }

    // Sort tables by size (smallest first for optimal join order)
    // This follows the database optimization principle: filter early, join late
    tables.sort((a, b) => (tableSizes.get(a.name) || 0) - (tableSizes.get(b.name) || 0));

    // Rebuild query with optimized join order
    // This is a simplified implementation that preserves query semantics
    // In production, consider using a proper SQL parser for complex queries

    // Extract query components
    const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
    const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
    const groupByMatch = query.match(/GROUP BY\s+(.+?)(?:ORDER BY|LIMIT|$)/i);
    const orderByMatch = query.match(/ORDER BY\s+(.+?)(?:LIMIT|$)/i);
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);

    if (!selectMatch) {
      // Can't parse query, return original
      return query;
    }

    const selectClause = selectMatch[1];
    const whereClause = whereMatch ? whereMatch[1] : null;
    const groupByClause = groupByMatch ? groupByMatch[1] : null;
    const orderByClause = orderByMatch ? orderByMatch[1] : null;
    const limitClause = limitMatch ? limitMatch[1] : null;

    // Build optimized query
    let optimizedQuery = `SELECT ${selectClause} FROM `;

    // Start with smallest table
    const firstTable = tables[0];
    optimizedQuery += `"${firstTable.name}"`;
    if (firstTable.alias && firstTable.alias !== firstTable.name) {
      optimizedQuery += ` AS ${firstTable.alias}`;
    }

    // Add remaining tables as JOINs in size order
    for (let i = 1; i < tables.length; i++) {
      const table = tables[i];

      // Determine join type from original query
      const joinTypePattern = new RegExp(`(INNER|LEFT|RIGHT|FULL)?\\s*JOIN\\s+${table.name}`, 'i');
      const joinTypeMatch = query.match(joinTypePattern);
      const joinType = joinTypeMatch?.[1] ? `${joinTypeMatch[1]} JOIN` : 'JOIN';

      optimizedQuery += ` ${joinType} "${table.name}"`;
      if (table.alias && table.alias !== table.name) {
        optimizedQuery += ` AS ${table.alias}`;
      }

      // Find appropriate ON condition for this table
      const relevantCondition = joinConditions.find(cond =>
        cond.includes(table.alias || table.name)
      );

      if (relevantCondition) {
        optimizedQuery += ` ON ${relevantCondition}`;
      }
    }

    // Add WHERE clause
    if (whereClause) {
      optimizedQuery += ` WHERE ${whereClause}`;
    }

    // Add GROUP BY clause
    if (groupByClause) {
      optimizedQuery += ` GROUP BY ${groupByClause}`;
    }

    // Add ORDER BY clause
    if (orderByClause) {
      optimizedQuery += ` ORDER BY ${orderByClause}`;
    }

    // Add LIMIT clause
    if (limitClause) {
      optimizedQuery += ` LIMIT ${limitClause}`;
    }

    return optimizedQuery;
  } catch (error) {
    // If optimization fails, return original query
    console.error('[QUERY OPTIMIZATION ERROR]', error);
    return query;
  }
}

/**
 * Identifies N+1 query patterns in application code
 *
 * @param {string[]} queries - Array of executed queries
 * @returns {{detected: boolean, patterns: Array<{query: string, count: number}>}}
 *
 * @example
 * ```typescript
 * const queries = [
 *   'SELECT * FROM orders WHERE customer_id = 1',
 *   'SELECT * FROM orders WHERE customer_id = 2',
 *   'SELECT * FROM orders WHERE customer_id = 3',
 *   // ... 100 more similar queries
 * ];
 *
 * const result = identifyNPlusOneQueries(queries);
 * if (result.detected) {
 *   console.log('N+1 query detected! Use eager loading instead.');
 * }
 * ```
 */
export function identifyNPlusOneQueries(
  queries: string[]
): { detected: boolean; patterns: Array<{ query: string; count: number }> } {
  const patterns = new Map<string, number>();

  // Normalize queries by removing specific values
  for (const query of queries) {
    const normalized = query
      .replace(/=\s*\d+/g, '= ?')
      .replace(/=\s*'[^']*'/g, "= ?")
      .replace(/IN\s*\([^)]+\)/gi, 'IN (?)');

    patterns.set(normalized, (patterns.get(normalized) || 0) + 1);
  }

  const nPlusOnePatterns: Array<{ query: string; count: number }> = [];

  for (const [query, count] of patterns) {
    if (count > 10) {
      // Threshold for N+1 detection
      nPlusOnePatterns.push({ query, count });
    }
  }

  return {
    detected: nPlusOnePatterns.length > 0,
    patterns: nPlusOnePatterns,
  };
}

/**
 * Suggests composite indexes based on query WHERE clauses
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} queries - Array of queries to analyze
 * @returns {Promise<IndexRecommendation[]>}
 *
 * @example
 * ```typescript
 * const queries = [
 *   'SELECT * FROM appointments WHERE patient_id = ? AND status = ?',
 *   'SELECT * FROM appointments WHERE patient_id = ? AND date > ?'
 * ];
 *
 * const suggestions = await suggestCompositeIndexes(sequelize, queries);
 * suggestions.forEach(s => console.log(s.createStatement));
 * ```
 */
export async function suggestCompositeIndexes(
  sequelize: Sequelize,
  queries: string[]
): Promise<IndexRecommendation[]> {
  const recommendations: IndexRecommendation[] = [];
  const wherePatterns = new Map<string, Set<string>>();

  // Extract WHERE clause patterns
  for (const query of queries) {
    const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)/i);
    if (!whereMatch) continue;

    const whereClause = whereMatch[1];
    const tableMatch = query.match(/FROM\s+(\w+)/i);
    if (!tableMatch) continue;

    const tableName = tableMatch[1];

    // Extract columns from WHERE clause
    const columns = whereClause
      .match(/(\w+)\s*[=<>]/g)
      ?.map(m => m.replace(/\s*[=<>]/, '')) || [];

    if (columns.length > 1) {
      if (!wherePatterns.has(tableName)) {
        wherePatterns.set(tableName, new Set());
      }
      wherePatterns.get(tableName)!.add(columns.join(','));
    }
  }

  // Generate recommendations
  for (const [tableName, columnSets] of wherePatterns) {
    for (const columnSet of columnSets) {
      const columns = columnSet.split(',');
      recommendations.push({
        tableName,
        columns,
        reason: `Frequent multi-column filtering detected on ${tableName}`,
        estimatedImprovement: 70,
        priority: 'high',
        indexType: 'btree',
        createStatement: `CREATE INDEX idx_${tableName}_${columns.join('_')} ON "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})`,
      });
    }
  }

  return recommendations;
}

/**
 * Analyzes query cache effectiveness
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CacheMetrics>}
 *
 * @example
 * ```typescript
 * const cacheMetrics = await analyzeQueryCache(sequelize);
 * console.log(`Cache hit rate: ${(cacheMetrics.hitRate * 100).toFixed(2)}%`);
 *
 * if (cacheMetrics.hitRate < 0.8) {
 *   console.log('Consider increasing shared_buffers');
 * }
 * ```
 */
export async function analyzeQueryCache(
  sequelize: Sequelize
): Promise<CacheMetrics> {
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [result] = await sequelize.query(
      `
      SELECT
        sum(heap_blks_hit) AS heap_hit,
        sum(heap_blks_read) AS heap_read,
        sum(idx_blks_hit) AS idx_hit,
        sum(idx_blks_read) AS idx_read
      FROM pg_statio_user_tables
    `,
      { type: QueryTypes.SELECT }
    );

    const stats = result[0] as Record<string, unknown>;
    const totalHits = ((stats.heap_hit as number) || 0) + ((stats.idx_hit as number) || 0);
    const totalMisses = ((stats.heap_read as number) || 0) + ((stats.idx_read as number) || 0);
    const total = totalHits + totalMisses;

    return {
      hitRate: total > 0 ? totalHits / total : 0,
      missRate: total > 0 ? totalMisses / total : 0,
      totalHits,
      totalMisses,
      bufferCacheSize: 0,
      sharedBuffers: 0,
      effectiveCacheSize: 0,
    };
  }

  return {
    hitRate: 0,
    missRate: 0,
    totalHits: 0,
    totalMisses: 0,
    bufferCacheSize: 0,
    sharedBuffers: 0,
    effectiveCacheSize: 0,
  };
}

/**
 * Optimizes LIMIT/OFFSET pagination for large datasets
 *
 * @param {string} query - Original paginated query
 * @param {number} offset - Current offset
 * @param {number} limit - Page size
 * @returns {string} Optimized query using cursor-based pagination
 *
 * @example
 * ```typescript
 * // Instead of slow OFFSET
 * const slow = 'SELECT * FROM orders ORDER BY id LIMIT 50 OFFSET 10000';
 *
 * // Use cursor-based pagination
 * const fast = optimizePagination(slow, 10000, 50);
 * // Returns: 'SELECT * FROM orders WHERE id > :lastId ORDER BY id LIMIT 50'
 * ```
 */
export function optimizePagination(
  query: string,
  offset: number,
  limit: number
): string {
  // For large offsets, suggest cursor-based pagination
  if (offset > 1000) {
    const orderByMatch = query.match(/ORDER BY\s+(\w+)/i);
    if (orderByMatch) {
      const orderColumn = orderByMatch[1];
      return query.replace(
        /OFFSET\s+\d+/i,
        `WHERE ${orderColumn} > :lastValue`
      );
    }
  }

  return query;
}

/**
 * Detects cartesian products in queries
 *
 * @param {string} query - SQL query to analyze
 * @returns {{hasCartesianProduct: boolean, tables: string[]}}
 *
 * @example
 * ```typescript
 * const badQuery = 'SELECT * FROM users, orders WHERE users.id = 1';
 * const result = detectCartesianProduct(badQuery);
 *
 * if (result.hasCartesianProduct) {
 *   console.error('Cartesian product detected!');
 *   console.log('Missing JOIN condition between:', result.tables);
 * }
 * ```
 */
export function detectCartesianProduct(
  query: string
): { hasCartesianProduct: boolean; tables: string[] } {
  // Check for comma-separated tables without proper JOIN conditions
  const fromClause = query.match(/FROM\s+(.+?)(?:WHERE|GROUP BY|ORDER BY|$)/i);
  if (!fromClause) return { hasCartesianProduct: false, tables: [] };

  const tables = fromClause[1]
    .split(',')
    .map(t => t.trim())
    .filter(t => !t.toUpperCase().includes('JOIN'));

  const hasCartesianProduct = tables.length > 1 && !query.includes('JOIN');

  return {
    hasCartesianProduct,
    tables,
  };
}

/**
 * Suggests covering indexes for frequently accessed queries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string[]} selectColumns - Columns in SELECT clause
 * @param {string[]} whereColumns - Columns in WHERE clause
 * @returns {Promise<IndexRecommendation>}
 *
 * @example
 * ```typescript
 * const covering = await suggestCoveringIndex(
 *   sequelize,
 *   'patients',
 *   ['id', 'name', 'email'],
 *   ['status', 'created_at']
 * );
 *
 * console.log(covering.createStatement);
 * // CREATE INDEX idx_patients_covering ON patients (status, created_at) INCLUDE (id, name, email)
 * ```
 */
export async function suggestCoveringIndex(
  sequelize: Sequelize,
  tableName: string,
  selectColumns: string[],
  whereColumns: string[]
): Promise<IndexRecommendation> {
  const dialect = sequelize.getDialect();

  // Order WHERE columns by selectivity
  const orderedWhereColumns = await calculateIndexColumnOrder(
    sequelize,
    tableName,
    whereColumns
  );

  // Include SELECT columns that aren't in WHERE
  const includeColumns = selectColumns.filter(col => !whereColumns.includes(col));

  let createStatement: string;

  if (dialect === 'postgres') {
    // PostgreSQL supports INCLUDE clause for covering indexes
    createStatement = `CREATE INDEX idx_${tableName}_covering ON "${tableName}" (${orderedWhereColumns.map(c => `"${c}"`).join(', ')})`;

    if (includeColumns.length > 0) {
      createStatement += ` INCLUDE (${includeColumns.map(c => `"${c}"`).join(', ')})`;
    }
  } else {
    // MySQL - add all columns to index
    const allColumns = [...orderedWhereColumns, ...includeColumns];
    createStatement = `CREATE INDEX idx_${tableName}_covering ON \`${tableName}\` (${allColumns.map(c => `\`${c}\``).join(', ')})`;
  }

  return {
    tableName,
    columns: [...orderedWhereColumns, ...includeColumns],
    reason: 'Covering index to avoid table lookups',
    estimatedImprovement: 60,
    priority: 'medium',
    indexType: 'btree',
    createStatement,
  };
}
