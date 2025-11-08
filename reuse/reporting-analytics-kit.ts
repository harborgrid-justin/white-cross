/**
 * LOC: REPAN1234567
 * File: /reuse/reporting-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Analytics services
 *   - Dashboard controllers
 *   - Reporting services
 *   - Backend analytics modules
 */

/**
 * File: /reuse/reporting-analytics-kit.ts
 * Locator: WC-UTL-REPAN-001
 * Purpose: Comprehensive Reporting & Analytics Utilities - metrics, KPIs, dashboards, time-series, statistics, visualization
 *
 * Upstream: Independent utility module for reporting and analytics
 * Downstream: ../backend/*, Analytics services, Dashboard services, Report generators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for aggregation, metrics, statistics, visualization, reporting, real-time analytics
 *
 * LLM Context: Comprehensive reporting and analytics utilities for building production-ready analytics systems.
 * Provides aggregation builders, time-series analysis, pivot tables, dashboard metrics, KPI tracking, statistical
 * calculations, trend analysis, chart data formatting, funnel analysis, and real-time updates. Essential for
 * data-driven applications with complex reporting requirements.
 */

import { Model, DataTypes, Sequelize, Op, QueryTypes, Transaction } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AggregationConfig {
  model: typeof Model;
  groupBy: string[];
  metrics: MetricDefinition[];
  filters?: WhereClause;
  dateRange?: DateRange;
  timezone?: string;
}

interface MetricDefinition {
  name: string;
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct' | 'percentile';
  percentile?: number;
  alias?: string;
}

interface WhereClause {
  [key: string]: any;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface TimeSeriesConfig {
  model: typeof Model;
  dateField: string;
  valueField: string;
  interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  dateRange: DateRange;
  timezone?: string;
  fillGaps?: boolean;
  groupBy?: string[];
}

interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
  label: string;
  metadata?: Record<string, any>;
}

interface PivotTableConfig {
  model: typeof Model;
  rows: string[];
  columns: string[];
  values: MetricDefinition[];
  filters?: WhereClause;
  totals?: boolean;
}

interface PivotTableResult {
  data: Record<string, any>[];
  rowTotals?: Record<string, any>;
  columnTotals?: Record<string, any>;
  grandTotal?: Record<string, number>;
}

interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  threshold?: ThresholdConfig;
}

interface ThresholdConfig {
  warning: number;
  critical: number;
  comparison: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
}

interface KPIDefinition {
  id: string;
  name: string;
  description: string;
  query: string | (() => Promise<number>);
  target?: number;
  unit?: string;
  format?: string;
  refreshInterval?: number;
  tags?: string[];
}

interface KPIResult {
  id: string;
  value: number;
  target?: number;
  achievement?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend?: TrendData;
  lastUpdated: Date;
}

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  velocity?: number;
  confidence?: number;
}

interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  type: 'tabular' | 'chart' | 'pivot' | 'custom';
  dataSource: string;
  query: any;
  parameters?: ReportParameter[];
  schedule?: ScheduleConfig;
  format?: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  recipients?: string[];
}

interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'list';
  required?: boolean;
  defaultValue?: any;
  options?: any[];
}

interface ScheduleConfig {
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone?: string;
  enabled: boolean;
}

interface ChartDataConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'funnel';
  data: any[];
  xField?: string;
  yField?: string;
  seriesField?: string;
  colorScheme?: string[];
  annotations?: ChartAnnotation[];
}

interface ChartAnnotation {
  type: 'line' | 'region' | 'point' | 'text';
  value: any;
  label?: string;
  color?: string;
}

interface StatisticalSummary {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  percentiles: Record<number, number>;
  skewness?: number;
  kurtosis?: number;
}

interface FunnelStage {
  name: string;
  count: number;
  percentage?: number;
  dropoff?: number;
  dropoffPercent?: number;
  conversionRate?: number;
  averageTime?: number;
}

interface FunnelAnalysis {
  stages: FunnelStage[];
  totalEntries: number;
  totalConversions: number;
  overallConversionRate: number;
  averageTimeToConvert?: number;
  bottleneck?: string;
}

interface CacheStrategy {
  key: string;
  ttl: number;
  refreshInterval?: number;
  invalidationTriggers?: string[];
  compression?: boolean;
}

interface RealtimeUpdate {
  metric: string;
  value: any;
  timestamp: Date;
  delta?: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS (1-4)
// ============================================================================

/**
 * Sequelize model for Report Templates with metadata and scheduling.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ReportTemplate model
 *
 * @example
 * ```typescript
 * const ReportTemplate = createReportTemplateModel(sequelize);
 * const report = await ReportTemplate.create({
 *   name: 'Monthly Revenue Report',
 *   type: 'tabular',
 *   query: { model: 'Order', aggregation: 'sum' },
 *   schedule: { frequency: 'monthly', dayOfMonth: 1 }
 * });
 * ```
 */
export const createReportTemplateModel = (sequelize: Sequelize) => {
  class ReportTemplate extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public type!: string;
    public category!: string;
    public dataSource!: string;
    public query!: Record<string, any>;
    public parameters!: Record<string, any>[];
    public schedule!: Record<string, any> | null;
    public format!: string;
    public recipients!: string[];
    public enabled!: boolean;
    public lastRun!: Date | null;
    public nextRun!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ReportTemplate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Report template name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Report description',
      },
      type: {
        type: DataTypes.ENUM('tabular', 'chart', 'pivot', 'custom', 'dashboard'),
        allowNull: false,
        defaultValue: 'tabular',
        comment: 'Report type',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Report category for organization',
      },
      dataSource: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Data source identifier',
      },
      query: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Query configuration',
      },
      parameters: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Report parameters definition',
      },
      schedule: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Schedule configuration',
      },
      format: {
        type: DataTypes.ENUM('pdf', 'excel', 'csv', 'json', 'html'),
        allowNull: false,
        defaultValue: 'pdf',
        comment: 'Output format',
      },
      recipients: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Email recipients list',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether report is active',
      },
      lastRun: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last execution timestamp',
      },
      nextRun: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next scheduled execution',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'report_templates',
      timestamps: true,
      indexes: [
        { fields: ['type'] },
        { fields: ['category'] },
        { fields: ['enabled'] },
        { fields: ['nextRun'] },
      ],
    },
  );

  return ReportTemplate;
};

/**
 * Sequelize model for Dashboard Configurations with widgets and layout.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Dashboard model
 *
 * @example
 * ```typescript
 * const Dashboard = createDashboardModel(sequelize);
 * const dashboard = await Dashboard.create({
 *   name: 'Executive Dashboard',
 *   widgets: [
 *     { type: 'metric', metric: 'revenue', position: { x: 0, y: 0 } },
 *     { type: 'chart', chartType: 'line', position: { x: 1, y: 0 } }
 *   ]
 * });
 * ```
 */
export const createDashboardModel = (sequelize: Sequelize) => {
  class Dashboard extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public category!: string;
    public widgets!: Record<string, any>[];
    public layout!: Record<string, any>;
    public filters!: Record<string, any>;
    public refreshInterval!: number;
    public isPublic!: boolean;
    public sharedWith!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Dashboard.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Dashboard name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Dashboard description',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Dashboard category',
      },
      widgets: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Dashboard widget configurations',
      },
      layout: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: { columns: 12, rows: 'auto' },
        comment: 'Dashboard layout configuration',
      },
      filters: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Global dashboard filters',
      },
      refreshInterval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 300000,
        comment: 'Auto-refresh interval in milliseconds',
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether dashboard is publicly accessible',
      },
      sharedWith: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'User IDs with access',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'dashboards',
      timestamps: true,
      indexes: [
        { fields: ['category'] },
        { fields: ['isPublic'] },
      ],
    },
  );

  return Dashboard;
};

/**
 * Sequelize model for Metrics with historical tracking and thresholds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Metric model
 *
 * @example
 * ```typescript
 * const Metric = createMetricModel(sequelize);
 * const metric = await Metric.create({
 *   name: 'daily_revenue',
 *   category: 'financial',
 *   value: 15000,
 *   target: 20000,
 *   unit: 'USD'
 * });
 * ```
 */
export const createMetricModel = (sequelize: Sequelize) => {
  class Metric extends Model {
    public id!: number;
    public name!: string;
    public displayName!: string;
    public description!: string;
    public category!: string;
    public value!: number;
    public previousValue!: number | null;
    public target!: number | null;
    public unit!: string;
    public format!: string;
    public threshold!: Record<string, any> | null;
    public tags!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Metric.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique metric identifier',
      },
      displayName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Human-readable metric name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Metric description',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Metric category',
      },
      value: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: false,
        comment: 'Current metric value',
      },
      previousValue: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: true,
        comment: 'Previous metric value for comparison',
      },
      target: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: true,
        comment: 'Target value',
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'count',
        comment: 'Unit of measurement',
      },
      format: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'number',
        comment: 'Display format (number, currency, percentage, duration)',
      },
      threshold: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Threshold configuration',
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Metric tags for filtering',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'metrics',
      timestamps: true,
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['category'] },
        { fields: ['tags'], using: 'gin' },
      ],
    },
  );

  return Metric;
};

/**
 * Sequelize model for Analytics Events for tracking and funnel analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AnalyticsEvent model
 *
 * @example
 * ```typescript
 * const AnalyticsEvent = createAnalyticsEventModel(sequelize);
 * const event = await AnalyticsEvent.create({
 *   eventType: 'page_view',
 *   userId: 123,
 *   sessionId: 'abc-123',
 *   properties: { page: '/products', duration: 45 }
 * });
 * ```
 */
export const createAnalyticsEventModel = (sequelize: Sequelize) => {
  class AnalyticsEvent extends Model {
    public id!: number;
    public eventType!: string;
    public eventName!: string;
    public userId!: number | null;
    public sessionId!: string;
    public timestamp!: Date;
    public properties!: Record<string, any>;
    public context!: Record<string, any>;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AnalyticsEvent.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Event type/category',
      },
      eventName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Event name',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'User ID if authenticated',
      },
      sessionId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Session identifier',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Event timestamp',
      },
      properties: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Event properties',
      },
      context: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Event context (device, location, etc.)',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'analytics_events',
      timestamps: true,
      indexes: [
        { fields: ['eventType'] },
        { fields: ['eventName'] },
        { fields: ['userId'] },
        { fields: ['sessionId'] },
        { fields: ['timestamp'] },
        { fields: ['eventType', 'timestamp'] },
      ],
    },
  );

  return AnalyticsEvent;
};

// ============================================================================
// AGGREGATION QUERY BUILDERS (5-9)
// ============================================================================

/**
 * Builds aggregation query with grouping and multiple metrics.
 *
 * @param {AggregationConfig} config - Aggregation configuration
 * @returns {Promise<any[]>} Aggregated results
 *
 * @example
 * ```typescript
 * const results = await buildAggregationQuery({
 *   model: Order,
 *   groupBy: ['status', 'category'],
 *   metrics: [
 *     { name: 'total_revenue', field: 'amount', aggregation: 'sum' },
 *     { name: 'order_count', field: 'id', aggregation: 'count' }
 *   ],
 *   filters: { createdAt: { [Op.gte]: startDate } }
 * });
 * ```
 */
export const buildAggregationQuery = async (
  config: AggregationConfig,
): Promise<any[]> => {
  const { model, groupBy, metrics, filters, dateRange } = config;

  const attributes: any[] = [...groupBy];

  metrics.forEach(metric => {
    const alias = metric.alias || metric.name;
    if (metric.aggregation === 'distinct') {
      attributes.push([
        Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col(metric.field))),
        alias,
      ]);
    } else if (metric.aggregation === 'percentile') {
      // PostgreSQL specific percentile calculation
      const percentile = metric.percentile || 50;
      attributes.push([
        Sequelize.fn(
          'PERCENTILE_CONT',
          percentile / 100,
          Sequelize.literal(`WITHIN GROUP (ORDER BY "${metric.field}")`),
        ),
        alias,
      ]);
    } else {
      attributes.push([
        Sequelize.fn(metric.aggregation.toUpperCase(), Sequelize.col(metric.field)),
        alias,
      ]);
    }
  });

  const where: WhereClause = filters ? { ...filters } : {};

  if (dateRange) {
    where.createdAt = {
      [Op.between]: [dateRange.start, dateRange.end],
    };
  }

  const results = await model.findAll({
    attributes,
    where,
    group: groupBy,
    raw: true,
  });

  return results;
};

/**
 * Creates dynamic aggregation builder with fluent interface.
 *
 * @param {typeof Model} model - Sequelize model
 * @returns {object} Builder with fluent methods
 *
 * @example
 * ```typescript
 * const results = await createAggregationBuilder(Order)
 *   .groupBy('category')
 *   .sum('amount', 'total')
 *   .avg('amount', 'average')
 *   .count('id', 'orders')
 *   .where({ status: 'completed' })
 *   .execute();
 * ```
 */
export const createAggregationBuilder = (model: typeof Model) => {
  const state: {
    attributes: any[];
    groupByFields: string[];
    whereClause: WhereClause;
    having?: any;
    order?: any[];
  } = {
    attributes: [],
    groupByFields: [],
    whereClause: {},
  };

  return {
    groupBy(...fields: string[]) {
      state.groupByFields.push(...fields);
      state.attributes.push(...fields);
      return this;
    },

    sum(field: string, alias: string) {
      state.attributes.push([Sequelize.fn('SUM', Sequelize.col(field)), alias]);
      return this;
    },

    avg(field: string, alias: string) {
      state.attributes.push([Sequelize.fn('AVG', Sequelize.col(field)), alias]);
      return this;
    },

    count(field: string, alias: string) {
      state.attributes.push([Sequelize.fn('COUNT', Sequelize.col(field)), alias]);
      return this;
    },

    countDistinct(field: string, alias: string) {
      state.attributes.push([
        Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col(field))),
        alias,
      ]);
      return this;
    },

    min(field: string, alias: string) {
      state.attributes.push([Sequelize.fn('MIN', Sequelize.col(field)), alias]);
      return this;
    },

    max(field: string, alias: string) {
      state.attributes.push([Sequelize.fn('MAX', Sequelize.col(field)), alias]);
      return this;
    },

    where(conditions: WhereClause) {
      state.whereClause = { ...state.whereClause, ...conditions };
      return this;
    },

    having(conditions: any) {
      state.having = conditions;
      return this;
    },

    orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC') {
      if (!state.order) state.order = [];
      state.order.push([field, direction]);
      return this;
    },

    async execute(): Promise<any[]> {
      const query: any = {
        attributes: state.attributes,
        where: state.whereClause,
        raw: true,
      };

      if (state.groupByFields.length > 0) {
        query.group = state.groupByFields;
      }

      if (state.having) {
        query.having = state.having;
      }

      if (state.order) {
        query.order = state.order;
      }

      return await model.findAll(query);
    },
  };
};

/**
 * Performs multi-dimensional aggregation (rollup/cube).
 *
 * @param {typeof Model} model - Sequelize model
 * @param {string[]} dimensions - Dimension fields
 * @param {MetricDefinition[]} metrics - Metrics to aggregate
 * @param {WhereClause} [filters] - Optional filters
 * @returns {Promise<any[]>} Multi-dimensional aggregation results
 *
 * @example
 * ```typescript
 * const results = await buildMultiDimensionalAggregation(
 *   Order,
 *   ['year', 'quarter', 'month'],
 *   [{ name: 'revenue', field: 'amount', aggregation: 'sum' }],
 *   { status: 'completed' }
 * );
 * ```
 */
export const buildMultiDimensionalAggregation = async (
  model: typeof Model,
  dimensions: string[],
  metrics: MetricDefinition[],
  filters?: WhereClause,
): Promise<any[]> => {
  const results: any[] = [];

  // Generate all combinations of dimensions (cube operation)
  const dimensionCombinations: string[][] = [];

  for (let i = 0; i <= dimensions.length; i++) {
    if (i === 0) {
      dimensionCombinations.push([]);
    } else {
      for (let j = 0; j <= dimensions.length - i; j++) {
        dimensionCombinations.push(dimensions.slice(j, j + i));
      }
    }
  }

  for (const combo of dimensionCombinations) {
    const result = await buildAggregationQuery({
      model,
      groupBy: combo.length > 0 ? combo : ['1'],
      metrics,
      filters,
    });

    results.push({
      dimensions: combo,
      level: combo.length,
      data: result,
    });
  }

  return results;
};

/**
 * Builds window function aggregation for running totals and rankings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {object} config - Window function configuration
 * @returns {Promise<any[]>} Results with window calculations
 *
 * @example
 * ```typescript
 * const results = await buildWindowAggregation(sequelize, 'orders', {
 *   partitionBy: ['category'],
 *   orderBy: [['created_at', 'ASC']],
 *   windowFunctions: [
 *     { function: 'ROW_NUMBER', alias: 'row_num' },
 *     { function: 'SUM', field: 'amount', alias: 'running_total' }
 *   ]
 * });
 * ```
 */
export const buildWindowAggregation = async (
  sequelize: Sequelize,
  tableName: string,
  config: {
    partitionBy?: string[];
    orderBy: [string, string][];
    windowFunctions: Array<{ function: string; field?: string; alias: string }>;
    filters?: WhereClause;
  },
): Promise<any[]> => {
  const { partitionBy, orderBy, windowFunctions, filters } = config;

  const windowClauses = windowFunctions.map(wf => {
    const partitionClause = partitionBy ? `PARTITION BY ${partitionBy.join(', ')}` : '';
    const orderClause = `ORDER BY ${orderBy.map(([field, dir]) => `${field} ${dir}`).join(', ')}`;

    if (wf.field) {
      return `${wf.function}(${wf.field}) OVER (${partitionClause} ${orderClause}) AS ${wf.alias}`;
    } else {
      return `${wf.function}() OVER (${partitionClause} ${orderClause}) AS ${wf.alias}`;
    }
  });

  let whereClause = '';
  if (filters && Object.keys(filters).length > 0) {
    const conditions = Object.entries(filters)
      .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
      .join(' AND ');
    whereClause = `WHERE ${conditions}`;
  }

  const query = `
    SELECT *, ${windowClauses.join(', ')}
    FROM ${tableName}
    ${whereClause}
  `;

  const results = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  return results;
};

/**
 * Creates cohort analysis aggregation for retention tracking.
 *
 * @param {typeof Model} model - Sequelize model
 * @param {object} config - Cohort configuration
 * @returns {Promise<any[]>} Cohort analysis results
 *
 * @example
 * ```typescript
 * const cohorts = await buildCohortAggregation(User, {
 *   cohortField: 'createdAt',
 *   activityField: 'lastLoginAt',
 *   cohortInterval: 'month',
 *   periods: 12
 * });
 * ```
 */
export const buildCohortAggregation = async (
  model: typeof Model,
  config: {
    cohortField: string;
    activityField: string;
    cohortInterval: 'day' | 'week' | 'month';
    periods: number;
    filters?: WhereClause;
  },
): Promise<any[]> => {
  const { cohortField, activityField, cohortInterval, periods, filters } = config;

  const intervalMap = {
    day: '1 day',
    week: '1 week',
    month: '1 month',
  };

  const query = `
    WITH cohorts AS (
      SELECT
        id,
        DATE_TRUNC('${cohortInterval}', ${cohortField}) as cohort_period,
        DATE_TRUNC('${cohortInterval}', ${activityField}) as activity_period
      FROM ${model.tableName}
      ${filters ? `WHERE ${Object.entries(filters).map(([k, v]) => `${k} = '${v}'`).join(' AND ')}` : ''}
    ),
    cohort_sizes AS (
      SELECT
        cohort_period,
        COUNT(DISTINCT id) as cohort_size
      FROM cohorts
      GROUP BY cohort_period
    ),
    cohort_activity AS (
      SELECT
        cohort_period,
        activity_period,
        COUNT(DISTINCT id) as active_users,
        EXTRACT(EPOCH FROM (activity_period - cohort_period)) / EXTRACT(EPOCH FROM INTERVAL '${intervalMap[cohortInterval]}') as period_number
      FROM cohorts
      WHERE activity_period >= cohort_period
      GROUP BY cohort_period, activity_period
    )
    SELECT
      cs.cohort_period,
      cs.cohort_size,
      ca.period_number,
      ca.active_users,
      ROUND((ca.active_users::DECIMAL / cs.cohort_size) * 100, 2) as retention_rate
    FROM cohort_sizes cs
    JOIN cohort_activity ca ON cs.cohort_period = ca.cohort_period
    WHERE ca.period_number <= ${periods}
    ORDER BY cs.cohort_period, ca.period_number
  `;

  const results = await model.sequelize!.query(query, {
    type: QueryTypes.SELECT,
  });

  return results;
};

// ============================================================================
// TIME-SERIES DATA AGGREGATION (10-13)
// ============================================================================

/**
 * Aggregates time-series data with automatic interval bucketing.
 *
 * @param {TimeSeriesConfig} config - Time-series configuration
 * @returns {Promise<TimeSeriesDataPoint[]>} Time-series data points
 *
 * @example
 * ```typescript
 * const timeSeries = await aggregateTimeSeries({
 *   model: Order,
 *   dateField: 'createdAt',
 *   valueField: 'amount',
 *   interval: 'day',
 *   aggregation: 'sum',
 *   dateRange: { start: startDate, end: endDate },
 *   fillGaps: true
 * });
 * ```
 */
export const aggregateTimeSeries = async (
  config: TimeSeriesConfig,
): Promise<TimeSeriesDataPoint[]> => {
  const {
    model,
    dateField,
    valueField,
    interval,
    aggregation,
    dateRange,
    timezone = 'UTC',
    fillGaps = false,
    groupBy = [],
  } = config;

  const intervalMap = {
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    quarter: 'quarter',
    year: 'year',
  };

  const timeGroup = Sequelize.fn(
    'DATE_TRUNC',
    intervalMap[interval],
    Sequelize.col(dateField),
  );

  const attributes: any[] = [[timeGroup, 'timestamp'], ...groupBy];

  if (aggregation === 'count') {
    attributes.push([Sequelize.fn('COUNT', Sequelize.col(valueField)), 'value']);
  } else {
    attributes.push([
      Sequelize.fn(aggregation.toUpperCase(), Sequelize.col(valueField)),
      'value',
    ]);
  }

  const results = await model.findAll({
    attributes,
    where: {
      [dateField]: {
        [Op.between]: [dateRange.start, dateRange.end],
      },
    },
    group: ['timestamp', ...groupBy],
    order: [['timestamp', 'ASC']],
    raw: true,
  });

  if (!fillGaps) {
    return results.map((r: any) => ({
      timestamp: r.timestamp,
      value: parseFloat(r.value) || 0,
      label: formatTimeSeriesLabel(r.timestamp, interval),
      metadata: groupBy.reduce((acc, field) => ({ ...acc, [field]: r[field] }), {}),
    }));
  }

  // Fill gaps with zero values
  const filledResults: TimeSeriesDataPoint[] = [];
  let currentDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  while (currentDate <= endDate) {
    const existing = results.find(
      (r: any) => new Date(r.timestamp).getTime() === currentDate.getTime(),
    );

    filledResults.push({
      timestamp: new Date(currentDate),
      value: existing ? parseFloat(existing.value) : 0,
      label: formatTimeSeriesLabel(currentDate, interval),
      metadata: existing || {},
    });

    currentDate = addInterval(currentDate, interval);
  }

  return filledResults;
};

/**
 * Calculates moving average for time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {number} window - Window size for moving average
 * @returns {TimeSeriesDataPoint[]} Data with moving average
 *
 * @example
 * ```typescript
 * const smoothedData = calculateMovingAverage(timeSeries, 7); // 7-day MA
 * ```
 */
export const calculateMovingAverage = (
  data: TimeSeriesDataPoint[],
  window: number,
): TimeSeriesDataPoint[] => {
  return data.map((point, index) => {
    const start = Math.max(0, index - window + 1);
    const windowData = data.slice(start, index + 1);
    const average =
      windowData.reduce((sum, p) => sum + p.value, 0) / windowData.length;

    return {
      ...point,
      value: average,
      metadata: {
        ...point.metadata,
        originalValue: point.value,
        windowSize: windowData.length,
      },
    };
  });
};

/**
 * Detects trends and anomalies in time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} config - Anomaly detection configuration
 * @returns {object} Trend and anomaly analysis
 *
 * @example
 * ```typescript
 * const analysis = detectTimeSeriesAnomalies(timeSeries, {
 *   stdDevThreshold: 2.5,
 *   minDataPoints: 30
 * });
 * ```
 */
export const detectTimeSeriesAnomalies = (
  data: TimeSeriesDataPoint[],
  config: {
    stdDevThreshold?: number;
    minDataPoints?: number;
  } = {},
): {
  trend: 'increasing' | 'decreasing' | 'stable';
  anomalies: Array<{ index: number; point: TimeSeriesDataPoint; zScore: number }>;
  statistics: { mean: number; stdDev: number };
} => {
  const { stdDevThreshold = 2, minDataPoints = 10 } = config;

  if (data.length < minDataPoints) {
    return {
      trend: 'stable',
      anomalies: [],
      statistics: { mean: 0, stdDev: 0 },
    };
  }

  const values = data.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Detect anomalies using z-score
  const anomalies = data
    .map((point, index) => ({
      index,
      point,
      zScore: Math.abs((point.value - mean) / stdDev),
    }))
    .filter(item => item.zScore > stdDevThreshold);

  // Detect trend using linear regression
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  data.forEach((point, index) => {
    sumX += index;
    sumY += point.value;
    sumXY += index * point.value;
    sumX2 += index * index;
  });

  const n = data.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  let trend: 'increasing' | 'decreasing' | 'stable';
  if (slope > mean * 0.01) trend = 'increasing';
  else if (slope < -mean * 0.01) trend = 'decreasing';
  else trend = 'stable';

  return {
    trend,
    anomalies,
    statistics: { mean, stdDev },
  };
};

/**
 * Forecasts future time-series values using simple exponential smoothing.
 *
 * @param {TimeSeriesDataPoint[]} data - Historical time-series data
 * @param {number} periods - Number of periods to forecast
 * @param {number} [alpha=0.3] - Smoothing factor (0-1)
 * @returns {TimeSeriesDataPoint[]} Forecasted data points
 *
 * @example
 * ```typescript
 * const forecast = forecastTimeSeries(historicalData, 30, 0.3);
 * ```
 */
export const forecastTimeSeries = (
  data: TimeSeriesDataPoint[],
  periods: number,
  alpha = 0.3,
): TimeSeriesDataPoint[] => {
  if (data.length === 0) return [];

  const forecast: TimeSeriesDataPoint[] = [];
  let lastValue = data[0].value;

  // Calculate smoothed values for historical data
  data.forEach(point => {
    lastValue = alpha * point.value + (1 - alpha) * lastValue;
  });

  // Generate forecast
  const lastTimestamp = data[data.length - 1].timestamp;
  const interval = detectInterval(data);

  for (let i = 1; i <= periods; i++) {
    const forecastTimestamp = addInterval(new Date(lastTimestamp), interval, i);
    forecast.push({
      timestamp: forecastTimestamp,
      value: lastValue,
      label: formatTimeSeriesLabel(forecastTimestamp, interval),
      metadata: { forecasted: true, confidence: 1 - i * 0.02 },
    });
  }

  return forecast;
};

// ============================================================================
// PIVOT TABLE GENERATION (14-15)
// ============================================================================

/**
 * Generates pivot table from query results.
 *
 * @param {PivotTableConfig} config - Pivot table configuration
 * @returns {Promise<PivotTableResult>} Pivot table data
 *
 * @example
 * ```typescript
 * const pivot = await generatePivotTable({
 *   model: Sales,
 *   rows: ['region', 'product'],
 *   columns: ['quarter'],
 *   values: [{ name: 'revenue', field: 'amount', aggregation: 'sum' }],
 *   totals: true
 * });
 * ```
 */
export const generatePivotTable = async (
  config: PivotTableConfig,
): Promise<PivotTableResult> => {
  const { model, rows, columns, values, filters, totals = false } = config;

  // Get aggregated data
  const aggregated = await buildAggregationQuery({
    model,
    groupBy: [...rows, ...columns],
    metrics: values,
    filters,
  });

  // Transform to pivot structure
  const pivotData: Record<string, any>[] = [];
  const columnValues = new Set<string>();
  const rowMap = new Map<string, any>();

  aggregated.forEach((row: any) => {
    const rowKey = rows.map(r => row[r]).join('|');
    const colKey = columns.map(c => row[c]).join('|');
    columnValues.add(colKey);

    if (!rowMap.has(rowKey)) {
      const newRow: any = {};
      rows.forEach(r => (newRow[r] = row[r]));
      rowMap.set(rowKey, newRow);
    }

    const pivotRow = rowMap.get(rowKey);
    values.forEach(v => {
      const valueKey = `${colKey}_${v.alias || v.name}`;
      pivotRow![valueKey] = row[v.alias || v.name];
    });
  });

  pivotData.push(...rowMap.values());

  const result: PivotTableResult = { data: pivotData };

  if (totals) {
    // Calculate row totals
    result.rowTotals = {};
    values.forEach(v => {
      const metricAlias = v.alias || v.name;
      result.rowTotals![metricAlias] = pivotData.reduce(
        (sum, row) =>
          sum +
          Object.keys(row)
            .filter(k => k.endsWith(`_${metricAlias}`))
            .reduce((s, k) => s + (row[k] || 0), 0),
        0,
      );
    });

    // Calculate column totals
    result.columnTotals = {};
    Array.from(columnValues).forEach(colKey => {
      values.forEach(v => {
        const valueKey = `${colKey}_${v.alias || v.name}`;
        result.columnTotals![valueKey] = pivotData.reduce(
          (sum, row) => sum + (row[valueKey] || 0),
          0,
        );
      });
    });

    // Calculate grand total
    result.grandTotal = {};
    values.forEach(v => {
      const metricAlias = v.alias || v.name;
      result.grandTotal![metricAlias] = pivotData.reduce(
        (sum, row) =>
          sum +
          Object.keys(row)
            .filter(k => k.endsWith(`_${metricAlias}`))
            .reduce((s, k) => s + (row[k] || 0), 0),
        0,
      );
    });
  }

  return result;
};

/**
 * Exports pivot table to various formats.
 *
 * @param {PivotTableResult} pivotData - Pivot table data
 * @param {string} format - Export format ('csv' | 'json' | 'html')
 * @returns {string} Formatted output
 *
 * @example
 * ```typescript
 * const csv = exportPivotTable(pivotData, 'csv');
 * ```
 */
export const exportPivotTable = (
  pivotData: PivotTableResult,
  format: 'csv' | 'json' | 'html',
): string => {
  if (format === 'json') {
    return JSON.stringify(pivotData, null, 2);
  }

  if (format === 'csv') {
    const { data } = pivotData;
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
  }

  if (format === 'html') {
    const { data } = pivotData;
    if (data.length === 0) return '<table></table>';

    const headers = Object.keys(data[0])
      .map(h => `<th>${h}</th>`)
      .join('');
    const rows = data
      .map(
        row =>
          `<tr>${Object.values(row)
            .map(v => `<td>${v}</td>`)
            .join('')}</tr>`,
      )
      .join('');

    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  return '';
};

// ============================================================================
// DASHBOARD METRICS CALCULATION (16-19)
// ============================================================================

/**
 * Calculates dashboard metric with trend comparison.
 *
 * @param {object} config - Metric calculation configuration
 * @returns {Promise<DashboardMetric>} Dashboard metric with trend
 *
 * @example
 * ```typescript
 * const metric = await calculateDashboardMetric({
 *   id: 'revenue',
 *   name: 'Total Revenue',
 *   query: async () => Order.sum('amount', { where: { status: 'completed' } }),
 *   previousQuery: async () => Order.sum('amount', { where: { status: 'completed', createdAt: { [Op.lt]: lastWeek } } }),
 *   format: 'currency'
 * });
 * ```
 */
export const calculateDashboardMetric = async (config: {
  id: string;
  name: string;
  query: () => Promise<number>;
  previousQuery?: () => Promise<number>;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  threshold?: ThresholdConfig;
}): Promise<DashboardMetric> => {
  const { id, name, query, previousQuery, format = 'number', threshold } = config;

  const value = await query();
  let previousValue: number | undefined;
  let change: number | undefined;
  let changePercent: number | undefined;
  let trend: 'up' | 'down' | 'stable' | undefined;

  if (previousQuery) {
    previousValue = await previousQuery();
    change = value - previousValue;
    changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

    if (Math.abs(changePercent) < 1) {
      trend = 'stable';
    } else {
      trend = change > 0 ? 'up' : 'down';
    }
  }

  return {
    id,
    name,
    value,
    previousValue,
    change,
    changePercent,
    trend,
    format,
    threshold,
  };
};

/**
 * Calculates multiple dashboard metrics in parallel.
 *
 * @param {Array} metricConfigs - Array of metric configurations
 * @returns {Promise<DashboardMetric[]>} Array of calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateDashboardMetrics([
 *   { id: 'users', name: 'Total Users', query: async () => User.count() },
 *   { id: 'revenue', name: 'Revenue', query: async () => Order.sum('amount') }
 * ]);
 * ```
 */
export const calculateDashboardMetrics = async (
  metricConfigs: Array<{
    id: string;
    name: string;
    query: () => Promise<number>;
    previousQuery?: () => Promise<number>;
    format?: 'number' | 'currency' | 'percentage' | 'duration';
    threshold?: ThresholdConfig;
  }>,
): Promise<DashboardMetric[]> => {
  const metrics = await Promise.all(
    metricConfigs.map(config => calculateDashboardMetric(config)),
  );
  return metrics;
};

/**
 * Evaluates metric against thresholds.
 *
 * @param {number} value - Metric value
 * @param {ThresholdConfig} threshold - Threshold configuration
 * @returns {object} Threshold evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluateMetricThreshold(95, {
 *   warning: 80,
 *   critical: 90,
 *   comparison: 'gte'
 * });
 * // { status: 'critical', breached: true }
 * ```
 */
export const evaluateMetricThreshold = (
  value: number,
  threshold: ThresholdConfig,
): { status: 'ok' | 'warning' | 'critical'; breached: boolean; message?: string } => {
  const { warning, critical, comparison } = threshold;

  let breachedWarning = false;
  let breachedCritical = false;

  switch (comparison) {
    case 'gt':
      breachedWarning = value > warning;
      breachedCritical = value > critical;
      break;
    case 'gte':
      breachedWarning = value >= warning;
      breachedCritical = value >= critical;
      break;
    case 'lt':
      breachedWarning = value < warning;
      breachedCritical = value < critical;
      break;
    case 'lte':
      breachedWarning = value <= warning;
      breachedCritical = value <= critical;
      break;
    case 'eq':
      breachedWarning = value === warning;
      breachedCritical = value === critical;
      break;
  }

  if (breachedCritical) {
    return {
      status: 'critical',
      breached: true,
      message: `Metric value ${value} breached critical threshold ${critical}`,
    };
  }

  if (breachedWarning) {
    return {
      status: 'warning',
      breached: true,
      message: `Metric value ${value} breached warning threshold ${warning}`,
    };
  }

  return { status: 'ok', breached: false };
};

/**
 * Formats metric value based on format type.
 *
 * @param {number | string} value - Metric value
 * @param {string} format - Format type
 * @param {object} [options] - Formatting options
 * @returns {string} Formatted value
 *
 * @example
 * ```typescript
 * formatMetricValue(1234567, 'currency', { currency: 'USD' }); // '$1,234,567.00'
 * formatMetricValue(0.75, 'percentage'); // '75%'
 * formatMetricValue(3600, 'duration'); // '1h 0m'
 * ```
 */
export const formatMetricValue = (
  value: number | string,
  format: 'number' | 'currency' | 'percentage' | 'duration',
  options?: { currency?: string; decimals?: number; locale?: string },
): string => {
  const { currency = 'USD', decimals = 2, locale = 'en-US' } = options || {};

  if (typeof value === 'string') return value;

  switch (format) {
    case 'number':
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);

    case 'currency':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);

    case 'percentage':
      return `${(value * 100).toFixed(decimals)}%`;

    case 'duration':
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = Math.floor(value % 60);
      return `${hours}h ${minutes}m ${seconds}s`;

    default:
      return String(value);
  }
};

// ============================================================================
// KPI TRACKING (20-22)
// ============================================================================

/**
 * Tracks and calculates KPI with target achievement.
 *
 * @param {KPIDefinition} definition - KPI definition
 * @returns {Promise<KPIResult>} KPI result with achievement
 *
 * @example
 * ```typescript
 * const kpi = await trackKPI({
 *   id: 'customer_satisfaction',
 *   name: 'Customer Satisfaction Score',
 *   query: async () => Survey.avg('rating'),
 *   target: 4.5,
 *   unit: 'rating'
 * });
 * ```
 */
export const trackKPI = async (definition: KPIDefinition): Promise<KPIResult> => {
  const { id, query, target, format } = definition;

  let value: number;
  if (typeof query === 'string') {
    // Execute raw SQL query
    const sequelize = new Sequelize('');
    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    value = results[0] ? Object.values(results[0])[0] as number : 0;
  } else {
    value = await query();
  }

  const achievement = target ? (value / target) * 100 : 100;

  let status: 'excellent' | 'good' | 'warning' | 'critical';
  if (achievement >= 100) status = 'excellent';
  else if (achievement >= 80) status = 'good';
  else if (achievement >= 60) status = 'warning';
  else status = 'critical';

  return {
    id,
    value,
    target,
    achievement,
    status,
    lastUpdated: new Date(),
  };
};

/**
 * Tracks multiple KPIs and generates scorecard.
 *
 * @param {KPIDefinition[]} definitions - Array of KPI definitions
 * @returns {Promise<object>} Scorecard with all KPI results
 *
 * @example
 * ```typescript
 * const scorecard = await generateKPIScorecard([
 *   { id: 'revenue', name: 'Monthly Revenue', query: getRevenue, target: 100000 },
 *   { id: 'nps', name: 'Net Promoter Score', query: getNPS, target: 50 }
 * ]);
 * ```
 */
export const generateKPIScorecard = async (
  definitions: KPIDefinition[],
): Promise<{
  kpis: KPIResult[];
  overallScore: number;
  summary: { excellent: number; good: number; warning: number; critical: number };
}> => {
  const kpis = await Promise.all(definitions.map(def => trackKPI(def)));

  const summary = {
    excellent: kpis.filter(k => k.status === 'excellent').length,
    good: kpis.filter(k => k.status === 'good').length,
    warning: kpis.filter(k => k.status === 'warning').length,
    critical: kpis.filter(k => k.status === 'critical').length,
  };

  const overallScore =
    kpis.reduce((sum, k) => sum + (k.achievement || 0), 0) / kpis.length;

  return { kpis, overallScore, summary };
};

/**
 * Calculates KPI trend over time periods.
 *
 * @param {KPIDefinition} definition - KPI definition
 * @param {Date[]} periods - Array of period timestamps
 * @returns {Promise<object>} KPI trend analysis
 *
 * @example
 * ```typescript
 * const trend = await calculateKPITrend(kpiDefinition, [
 *   new Date('2024-01-01'),
 *   new Date('2024-02-01'),
 *   new Date('2024-03-01')
 * ]);
 * ```
 */
export const calculateKPITrend = async (
  definition: KPIDefinition,
  periods: Date[],
): Promise<{
  periods: Array<{ date: Date; value: number; achievement: number }>;
  trend: TrendData;
}> => {
  const results: Array<{ date: Date; value: number; achievement: number }> = [];

  for (const period of periods) {
    const kpi = await trackKPI(definition);
    results.push({
      date: period,
      value: kpi.value,
      achievement: kpi.achievement || 0,
    });
  }

  // Calculate trend
  const values = results.map(r => r.value);
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const change = lastValue - firstValue;
  const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(changePercent) < 1) direction = 'stable';
  else direction = change > 0 ? 'up' : 'down';

  return {
    periods: results,
    trend: {
      direction,
      change,
      changePercent,
      velocity: change / (periods.length - 1),
    },
  };
};

// ============================================================================
// STATISTICAL CALCULATIONS (23-27)
// ============================================================================

/**
 * Calculates comprehensive statistical summary.
 *
 * @param {number[]} values - Array of numeric values
 * @param {number[]} [percentiles=[25,50,75,90,95,99]] - Percentiles to calculate
 * @returns {StatisticalSummary} Statistical summary
 *
 * @example
 * ```typescript
 * const stats = calculateStatisticalSummary([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 * // Returns: { mean: 5.5, median: 5.5, mode: [], min: 1, max: 10, ... }
 * ```
 */
export const calculateStatisticalSummary = (
  values: number[],
  percentiles: number[] = [25, 50, 75, 90, 95, 99],
): StatisticalSummary => {
  if (values.length === 0) {
    throw new Error('Cannot calculate statistics on empty array');
  }

  const sorted = [...values].sort((a, b) => a - b);
  const count = values.length;
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;

  // Median
  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

  // Mode
  const frequency: Record<number, number> = {};
  values.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = Object.entries(frequency)
    .filter(([_, freq]) => freq === maxFreq && maxFreq > 1)
    .map(([val, _]) => Number(val));

  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Variance and standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const standardDeviation = Math.sqrt(variance);

  // Quartiles
  const q1 = calculatePercentile(sorted, 25);
  const q2 = median;
  const q3 = calculatePercentile(sorted, 75);

  // Custom percentiles
  const percentileResults: Record<number, number> = {};
  percentiles.forEach(p => {
    percentileResults[p] = calculatePercentile(sorted, p);
  });

  return {
    count,
    sum,
    mean,
    median,
    mode,
    min,
    max,
    range,
    variance,
    standardDeviation,
    quartiles: { q1, q2, q3 },
    percentiles: percentileResults,
  };
};

/**
 * Calculates specific percentile from dataset.
 *
 * @param {number[]} sortedValues - Sorted array of values
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} Percentile value
 *
 * @example
 * ```typescript
 * const p95 = calculatePercentile([1,2,3,4,5], 95);
 * ```
 */
export const calculatePercentile = (sortedValues: number[], percentile: number): number => {
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100');
  }

  const index = (percentile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sortedValues[lower];
  }

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
};

/**
 * Calculates correlation coefficient between two datasets.
 *
 * @param {number[]} x - First dataset
 * @param {number[]} y - Second dataset
 * @returns {number} Pearson correlation coefficient (-1 to 1)
 *
 * @example
 * ```typescript
 * const correlation = calculateCorrelation([1,2,3,4,5], [2,4,6,8,10]);
 * // Returns: 1 (perfect positive correlation)
 * ```
 */
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) {
    throw new Error('Arrays must have equal non-zero length');
  }

  const n = x.length;
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
  const sumY2 = y.reduce((acc, val) => acc + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;
  return numerator / denominator;
};

/**
 * Performs linear regression analysis.
 *
 * @param {number[]} x - Independent variable
 * @param {number[]} y - Dependent variable
 * @returns {object} Regression analysis results
 *
 * @example
 * ```typescript
 * const regression = performLinearRegression([1,2,3,4,5], [2,4,5,4,5]);
 * // Returns: { slope, intercept, r2, predict: (x) => y }
 * ```
 */
export const performLinearRegression = (
  x: number[],
  y: number[],
): {
  slope: number;
  intercept: number;
  r2: number;
  predict: (xValue: number) => number;
} => {
  if (x.length !== y.length || x.length === 0) {
    throw new Error('Arrays must have equal non-zero length');
  }

  const n = x.length;
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const correlation = calculateCorrelation(x, y);
  const r2 = correlation * correlation;

  const predict = (xValue: number) => slope * xValue + intercept;

  return { slope, intercept, r2, predict };
};

/**
 * Calculates distribution histogram with bins.
 *
 * @param {number[]} values - Array of values
 * @param {number} [bins=10] - Number of bins
 * @returns {Array<{min: number, max: number, count: number, percentage: number}>} Histogram data
 *
 * @example
 * ```typescript
 * const histogram = calculateHistogram([1,2,3,4,5,6,7,8,9,10], 5);
 * ```
 */
export const calculateHistogram = (
  values: number[],
  bins = 10,
): Array<{ min: number; max: number; count: number; percentage: number }> => {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;

  const histogram: Array<{ min: number; max: number; count: number; percentage: number }> =
    [];

  for (let i = 0; i < bins; i++) {
    const binMin = min + i * binSize;
    const binMax = i === bins - 1 ? max : binMin + binSize;
    const count = values.filter(v => v >= binMin && v < binMax).length;
    const percentage = (count / values.length) * 100;

    histogram.push({ min: binMin, max: binMax, count, percentage });
  }

  return histogram;
};

// ============================================================================
// CHART DATA FORMATTING (28-31)
// ============================================================================

/**
 * Formats data for chart visualization.
 *
 * @param {ChartDataConfig} config - Chart configuration
 * @returns {object} Formatted chart data
 *
 * @example
 * ```typescript
 * const chartData = formatChartData({
 *   type: 'line',
 *   data: salesData,
 *   xField: 'date',
 *   yField: 'revenue',
 *   seriesField: 'category'
 * });
 * ```
 */
export const formatChartData = (config: ChartDataConfig): object => {
  const { type, data, xField, yField, seriesField, colorScheme, annotations } = config;

  const baseConfig: any = {
    data,
    xField,
    yField,
  };

  if (seriesField) {
    baseConfig.seriesField = seriesField;
  }

  if (colorScheme) {
    baseConfig.color = colorScheme;
  }

  if (annotations) {
    baseConfig.annotations = annotations;
  }

  switch (type) {
    case 'line':
      return {
        ...baseConfig,
        smooth: true,
        point: { size: 3 },
      };

    case 'bar':
      return {
        ...baseConfig,
        columnStyle: { radius: [4, 4, 0, 0] },
      };

    case 'pie':
      return {
        data,
        angleField: yField,
        colorField: xField,
        radius: 0.8,
        label: { type: 'outer' },
      };

    case 'scatter':
      return {
        ...baseConfig,
        size: 4,
        shape: 'circle',
      };

    case 'area':
      return {
        ...baseConfig,
        areaStyle: { fillOpacity: 0.6 },
      };

    default:
      return baseConfig;
  }
};

/**
 * Converts time-series data to chart format.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} [options] - Formatting options
 * @returns {Array} Chart-ready data
 *
 * @example
 * ```typescript
 * const chartData = formatTimeSeriesForChart(timeSeries, {
 *   dateFormat: 'YYYY-MM-DD',
 *   valueName: 'revenue'
 * });
 * ```
 */
export const formatTimeSeriesForChart = (
  data: TimeSeriesDataPoint[],
  options?: { dateFormat?: string; valueName?: string },
): Array<{ date: string; value: number; [key: string]: any }> => {
  const { dateFormat = 'YYYY-MM-DD', valueName = 'value' } = options || {};

  return data.map(point => ({
    date: formatDate(point.timestamp, dateFormat),
    [valueName]: point.value,
    ...point.metadata,
  }));
};

/**
 * Generates heatmap data from matrix.
 *
 * @param {number[][]} matrix - 2D array of values
 * @param {string[]} rowLabels - Row labels
 * @param {string[]} columnLabels - Column labels
 * @returns {Array} Heatmap data
 *
 * @example
 * ```typescript
 * const heatmap = generateHeatmapData(
 *   [[1,2,3], [4,5,6]],
 *   ['Row1', 'Row2'],
 *   ['Col1', 'Col2', 'Col3']
 * );
 * ```
 */
export const generateHeatmapData = (
  matrix: number[][],
  rowLabels: string[],
  columnLabels: string[],
): Array<{ x: string; y: string; value: number }> => {
  const heatmapData: Array<{ x: string; y: string; value: number }> = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      heatmapData.push({
        x: columnLabels[colIndex],
        y: rowLabels[rowIndex],
        value,
      });
    });
  });

  return heatmapData;
};

/**
 * Formats funnel chart data with conversion rates.
 *
 * @param {FunnelAnalysis} funnelData - Funnel analysis data
 * @returns {Array} Funnel chart data
 *
 * @example
 * ```typescript
 * const chartData = formatFunnelChartData(funnelAnalysis);
 * ```
 */
export const formatFunnelChartData = (
  funnelData: FunnelAnalysis,
): Array<{ stage: string; value: number; conversionRate: number }> => {
  return funnelData.stages.map(stage => ({
    stage: stage.name,
    value: stage.count,
    conversionRate: stage.conversionRate || 0,
  }));
};

// ============================================================================
// FUNNEL ANALYSIS (32-33)
// ============================================================================

/**
 * Analyzes conversion funnel with dropoff rates.
 *
 * @param {typeof Model} model - Analytics event model
 * @param {string[]} stages - Funnel stage event names
 * @param {object} config - Funnel configuration
 * @returns {Promise<FunnelAnalysis>} Funnel analysis results
 *
 * @example
 * ```typescript
 * const funnel = await analyzeFunnel(AnalyticsEvent, [
 *   'page_view',
 *   'add_to_cart',
 *   'checkout',
 *   'purchase'
 * ], { dateRange: { start, end } });
 * ```
 */
export const analyzeFunnel = async (
  model: typeof Model,
  stages: string[],
  config: {
    dateRange?: DateRange;
    filters?: WhereClause;
    sessionField?: string;
  },
): Promise<FunnelAnalysis> => {
  const { dateRange, filters = {}, sessionField = 'sessionId' } = config;

  const where: WhereClause = { ...filters };
  if (dateRange) {
    where.timestamp = { [Op.between]: [dateRange.start, dateRange.end] };
  }

  const funnelStages: FunnelStage[] = [];
  let previousCount = 0;

  for (let i = 0; i < stages.length; i++) {
    const stageName = stages[i];
    const stageWhere = { ...where, eventName: stageName };

    const count = await model.count({
      where: stageWhere,
      distinct: true,
      col: sessionField,
    });

    const percentage = i === 0 ? 100 : (count / funnelStages[0].count) * 100;
    const dropoff = i === 0 ? 0 : previousCount - count;
    const dropoffPercent = i === 0 ? 0 : (dropoff / previousCount) * 100;
    const conversionRate = i === 0 ? 100 : (count / previousCount) * 100;

    funnelStages.push({
      name: stageName,
      count,
      percentage,
      dropoff,
      dropoffPercent,
      conversionRate,
    });

    previousCount = count;
  }

  const totalEntries = funnelStages[0]?.count || 0;
  const totalConversions = funnelStages[funnelStages.length - 1]?.count || 0;
  const overallConversionRate =
    totalEntries > 0 ? (totalConversions / totalEntries) * 100 : 0;

  // Find bottleneck (stage with largest dropoff)
  const bottleneck = funnelStages.reduce((max, stage) =>
    (stage.dropoffPercent || 0) > (max.dropoffPercent || 0) ? stage : max,
  ).name;

  return {
    stages: funnelStages,
    totalEntries,
    totalConversions,
    overallConversionRate,
    bottleneck,
  };
};

/**
 * Compares multiple funnels side by side.
 *
 * @param {Array} funnelConfigs - Array of funnel configurations
 * @returns {Promise<Array>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareFunnels([
 *   { name: 'Mobile', model: AnalyticsEvent, stages: [...], filters: { device: 'mobile' } },
 *   { name: 'Desktop', model: AnalyticsEvent, stages: [...], filters: { device: 'desktop' } }
 * ]);
 * ```
 */
export const compareFunnels = async (
  funnelConfigs: Array<{
    name: string;
    model: typeof Model;
    stages: string[];
    config: {
      dateRange?: DateRange;
      filters?: WhereClause;
      sessionField?: string;
    };
  }>,
): Promise<
  Array<{
    name: string;
    funnel: FunnelAnalysis;
  }>
> => {
  const results = await Promise.all(
    funnelConfigs.map(async fc => ({
      name: fc.name,
      funnel: await analyzeFunnel(fc.model, fc.stages, fc.config),
    })),
  );

  return results;
};

// ============================================================================
// REPORT BUILDERS & SCHEDULING (34-37)
// ============================================================================

/**
 * Executes report template with parameters.
 *
 * @param {ReportDefinition} definition - Report definition
 * @param {Record<string, any>} parameters - Report parameters
 * @returns {Promise<any>} Report execution result
 *
 * @example
 * ```typescript
 * const report = await executeReport(reportDef, {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   category: 'sales'
 * });
 * ```
 */
export const executeReport = async (
  definition: ReportDefinition,
  parameters: Record<string, any>,
): Promise<any> => {
  const { type, query, format } = definition;

  // Validate required parameters
  const requiredParams = definition.parameters?.filter(p => p.required) || [];
  for (const param of requiredParams) {
    if (!(param.name in parameters)) {
      throw new Error(`Required parameter '${param.name}' is missing`);
    }
  }

  // Execute query based on type
  let results: any;
  switch (type) {
    case 'tabular':
      results = await buildAggregationQuery({
        ...query,
        filters: { ...query.filters, ...parameters },
      });
      break;

    case 'pivot':
      results = await generatePivotTable({
        ...query,
        filters: { ...query.filters, ...parameters },
      });
      break;

    case 'chart':
      const chartData = await buildAggregationQuery({
        ...query,
        filters: { ...query.filters, ...parameters },
      });
      results = formatChartData({
        type: query.chartType,
        data: chartData,
        ...query.chartConfig,
      });
      break;

    default:
      results = { error: 'Unsupported report type' };
  }

  return {
    definition,
    parameters,
    results,
    executedAt: new Date(),
    format,
  };
};

/**
 * Schedules report for automatic execution.
 *
 * @param {ReportDefinition} definition - Report definition
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {object} Scheduled report configuration
 *
 * @example
 * ```typescript
 * const scheduled = scheduleReport(reportDef, {
 *   frequency: 'daily',
 *   time: '09:00',
 *   timezone: 'America/New_York',
 *   enabled: true
 * });
 * ```
 */
export const scheduleReport = (
  definition: ReportDefinition,
  schedule: ScheduleConfig,
): {
  reportId: string;
  schedule: ScheduleConfig;
  nextRun: Date;
} => {
  const nextRun = calculateNextRun(schedule);

  return {
    reportId: definition.id,
    schedule,
    nextRun,
  };
};

/**
 * Calculates next report execution time.
 *
 * @param {ScheduleConfig} schedule - Schedule configuration
 * @returns {Date} Next execution timestamp
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRun({
 *   frequency: 'weekly',
 *   dayOfWeek: 1,
 *   time: '10:00'
 * });
 * ```
 */
export const calculateNextRun = (schedule: ScheduleConfig): Date => {
  const { frequency, time, dayOfWeek, dayOfMonth } = schedule;
  const now = new Date();
  let nextRun = new Date(now);

  switch (frequency) {
    case 'hourly':
      nextRun.setHours(nextRun.getHours() + 1, 0, 0, 0);
      break;

    case 'daily':
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        nextRun.setHours(hours, minutes, 0, 0);
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
      }
      break;

    case 'weekly':
      if (dayOfWeek !== undefined && time) {
        const [hours, minutes] = time.split(':').map(Number);
        nextRun.setHours(hours, minutes, 0, 0);
        const currentDay = nextRun.getDay();
        const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
        nextRun.setDate(nextRun.getDate() + (daysUntilTarget || 7));
      }
      break;

    case 'monthly':
      if (dayOfMonth && time) {
        const [hours, minutes] = time.split(':').map(Number);
        nextRun.setDate(dayOfMonth);
        nextRun.setHours(hours, minutes, 0, 0);
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1);
        }
      }
      break;

    case 'once':
      // Already set, no recurrence
      break;
  }

  return nextRun;
};

/**
 * Validates report parameters against definition.
 *
 * @param {ReportParameter[]} paramDefs - Parameter definitions
 * @param {Record<string, any>} values - Parameter values
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReportParameters(
 *   [{ name: 'startDate', type: 'date', required: true }],
 *   { startDate: '2024-01-01' }
 * );
 * ```
 */
export const validateReportParameters = (
  paramDefs: ReportParameter[],
  values: Record<string, any>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  paramDefs.forEach(param => {
    const value = values[param.name];

    if (param.required && (value === undefined || value === null)) {
      errors.push(`Parameter '${param.name}' is required`);
      return;
    }

    if (value === undefined || value === null) return;

    switch (param.type) {
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push(`Parameter '${param.name}' must be a number`);
        }
        break;

      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          errors.push(`Parameter '${param.name}' must be a valid date`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Parameter '${param.name}' must be a boolean`);
        }
        break;

      case 'list':
        if (param.options && !param.options.includes(value)) {
          errors.push(
            `Parameter '${param.name}' must be one of: ${param.options.join(', ')}`,
          );
        }
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// REPORT CACHING (38-40)
// ============================================================================

/**
 * Generates cache key for report results.
 *
 * @param {string} reportId - Report identifier
 * @param {Record<string, any>} parameters - Report parameters
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = generateReportCacheKey('monthly-sales', { month: '2024-01' });
 * ```
 */
export const generateReportCacheKey = (
  reportId: string,
  parameters: Record<string, any>,
): string => {
  const sortedParams = Object.keys(parameters)
    .sort()
    .map(key => `${key}:${JSON.stringify(parameters[key])}`)
    .join('|');

  return `report:${reportId}:${Buffer.from(sortedParams).toString('base64')}`;
};

/**
 * Determines cache strategy for report.
 *
 * @param {ReportDefinition} definition - Report definition
 * @returns {CacheStrategy} Cache strategy configuration
 *
 * @example
 * ```typescript
 * const strategy = getCacheStrategy(reportDef);
 * // Returns: { key: 'report:...', ttl: 3600, ... }
 * ```
 */
export const getCacheStrategy = (definition: ReportDefinition): CacheStrategy => {
  const { id, schedule } = definition;

  let ttl = 3600; // Default 1 hour
  let refreshInterval: number | undefined;

  if (schedule) {
    switch (schedule.frequency) {
      case 'hourly':
        ttl = 3600;
        refreshInterval = 3600;
        break;
      case 'daily':
        ttl = 86400;
        refreshInterval = 86400;
        break;
      case 'weekly':
        ttl = 604800;
        refreshInterval = 604800;
        break;
      case 'monthly':
        ttl = 2592000;
        refreshInterval = 2592000;
        break;
    }
  }

  return {
    key: `report:${id}`,
    ttl,
    refreshInterval,
    compression: true,
  };
};

/**
 * Invalidates cached report results.
 *
 * @param {string} reportId - Report identifier
 * @param {Record<string, any>} [parameters] - Optional specific parameters
 * @returns {string[]} Invalidated cache keys
 *
 * @example
 * ```typescript
 * const invalidated = invalidateReportCache('monthly-sales');
 * // Returns array of invalidated cache keys
 * ```
 */
export const invalidateReportCache = (
  reportId: string,
  parameters?: Record<string, any>,
): string[] => {
  if (parameters) {
    return [generateReportCacheKey(reportId, parameters)];
  }

  // Invalidate all cache entries for this report
  return [`report:${reportId}:*`];
};

// ============================================================================
// REAL-TIME ANALYTICS (41-43)
// ============================================================================

/**
 * Tracks real-time metric update.
 *
 * @param {string} metric - Metric name
 * @param {any} value - Metric value
 * @param {Record<string, any>} [metadata] - Optional metadata
 * @returns {RealtimeUpdate} Real-time update object
 *
 * @example
 * ```typescript
 * const update = trackRealtimeMetric('active_users', 1523, {
 *   region: 'us-east',
 *   source: 'web'
 * });
 * ```
 */
export const trackRealtimeMetric = (
  metric: string,
  value: any,
  metadata?: Record<string, any>,
): RealtimeUpdate => {
  return {
    metric,
    value,
    timestamp: new Date(),
    metadata,
  };
};

/**
 * Aggregates real-time events into time windows.
 *
 * @param {Array} events - Array of real-time events
 * @param {number} windowSeconds - Window size in seconds
 * @returns {Array} Aggregated windows
 *
 * @example
 * ```typescript
 * const windows = aggregateRealtimeEvents(events, 60); // 1-minute windows
 * ```
 */
export const aggregateRealtimeEvents = (
  events: Array<{ timestamp: Date; value: number; [key: string]: any }>,
  windowSeconds: number,
): Array<{
  windowStart: Date;
  windowEnd: Date;
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
}> => {
  if (events.length === 0) return [];

  const sorted = [...events].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  const windows: Array<{
    windowStart: Date;
    windowEnd: Date;
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
  }> = [];

  const firstTimestamp = sorted[0].timestamp.getTime();
  const lastTimestamp = sorted[sorted.length - 1].timestamp.getTime();
  const windowMs = windowSeconds * 1000;

  for (
    let windowStart = firstTimestamp;
    windowStart <= lastTimestamp;
    windowStart += windowMs
  ) {
    const windowEnd = windowStart + windowMs;
    const windowEvents = sorted.filter(
      e => e.timestamp.getTime() >= windowStart && e.timestamp.getTime() < windowEnd,
    );

    if (windowEvents.length > 0) {
      const values = windowEvents.map(e => e.value);
      windows.push({
        windowStart: new Date(windowStart),
        windowEnd: new Date(windowEnd),
        count: windowEvents.length,
        sum: values.reduce((acc, v) => acc + v, 0),
        avg: values.reduce((acc, v) => acc + v, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      });
    }
  }

  return windows;
};

/**
 * Detects real-time metric spikes and anomalies.
 *
 * @param {Array} recentValues - Recent metric values
 * @param {number} currentValue - Current value
 * @param {object} config - Detection configuration
 * @returns {object} Anomaly detection result
 *
 * @example
 * ```typescript
 * const result = detectRealtimeAnomaly(
 *   [100, 105, 98, 103],
 *   250,
 *   { threshold: 2.0 }
 * );
 * // Returns: { isAnomaly: true, severity: 'high', ... }
 * ```
 */
export const detectRealtimeAnomaly = (
  recentValues: number[],
  currentValue: number,
  config: { threshold?: number; minSamples?: number } = {},
): {
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high' | null;
  zScore: number;
  threshold: number;
} => {
  const { threshold = 3, minSamples = 10 } = config;

  if (recentValues.length < minSamples) {
    return { isAnomaly: false, severity: null, zScore: 0, threshold };
  }

  const stats = calculateStatisticalSummary(recentValues);
  const zScore = Math.abs((currentValue - stats.mean) / stats.standardDeviation);

  const isAnomaly = zScore > threshold;
  let severity: 'low' | 'medium' | 'high' | null = null;

  if (isAnomaly) {
    if (zScore > threshold * 2) severity = 'high';
    else if (zScore > threshold * 1.5) severity = 'medium';
    else severity = 'low';
  }

  return { isAnomaly, severity, zScore, threshold };
};

// ============================================================================
// TREND ANALYSIS (44-45)
// ============================================================================

/**
 * Analyzes trend direction and velocity.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {object} [options] - Analysis options
 * @returns {TrendData} Trend analysis result
 *
 * @example
 * ```typescript
 * const trend = analyzeTrend(timeSeries, { smoothing: true });
 * // Returns: { direction: 'up', change: 150, changePercent: 15, velocity: 5 }
 * ```
 */
export const analyzeTrend = (
  data: TimeSeriesDataPoint[],
  options?: { smoothing?: boolean; confidenceLevel?: number },
): TrendData => {
  const { smoothing = false, confidenceLevel = 0.95 } = options || {};

  let values = data.map(d => d.value);

  if (smoothing && values.length >= 7) {
    const smoothed = calculateMovingAverage(data, 7);
    values = smoothed.map(d => d.value);
  }

  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const change = lastValue - firstValue;
  const changePercent = firstValue !== 0 ? (change / firstValue) * 100 : 0;

  // Calculate velocity (rate of change)
  const regression = performLinearRegression(
    values.map((_, i) => i),
    values,
  );
  const velocity = regression.slope;
  const confidence = regression.r2;

  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(changePercent) < 1) direction = 'stable';
  else direction = change > 0 ? 'up' : 'down';

  return {
    direction,
    change,
    changePercent,
    velocity,
    confidence,
  };
};

/**
 * Identifies seasonal patterns in time-series data.
 *
 * @param {TimeSeriesDataPoint[]} data - Time-series data
 * @param {number} seasonLength - Length of one season in data points
 * @returns {object} Seasonal analysis result
 *
 * @example
 * ```typescript
 * const seasonal = identifySeasonalPatterns(monthlyData, 12); // Annual seasonality
 * ```
 */
export const identifySeasonalPatterns = (
  data: TimeSeriesDataPoint[],
  seasonLength: number,
): {
  hasSeasonality: boolean;
  strength: number;
  pattern: number[];
  peaks: number[];
  troughs: number[];
} => {
  if (data.length < seasonLength * 2) {
    return {
      hasSeasonality: false,
      strength: 0,
      pattern: [],
      peaks: [],
      troughs: [],
    };
  }

  const values = data.map(d => d.value);

  // Calculate seasonal pattern
  const pattern: number[] = new Array(seasonLength).fill(0);
  const counts: number[] = new Array(seasonLength).fill(0);

  values.forEach((value, index) => {
    const seasonIndex = index % seasonLength;
    pattern[seasonIndex] += value;
    counts[seasonIndex]++;
  });

  pattern.forEach((sum, i) => {
    pattern[i] = sum / counts[i];
  });

  // Calculate seasonality strength
  const overallMean = values.reduce((acc, v) => acc + v, 0) / values.length;
  const seasonalVariance = pattern.reduce(
    (acc, v) => acc + Math.pow(v - overallMean, 2),
    0,
  );
  const totalVariance = values.reduce((acc, v) => acc + Math.pow(v - overallMean, 2), 0);
  const strength = totalVariance > 0 ? seasonalVariance / totalVariance : 0;

  // Identify peaks and troughs
  const peaks: number[] = [];
  const troughs: number[] = [];

  pattern.forEach((value, index) => {
    const prev = pattern[(index - 1 + seasonLength) % seasonLength];
    const next = pattern[(index + 1) % seasonLength];

    if (value > prev && value > next) {
      peaks.push(index);
    } else if (value < prev && value < next) {
      troughs.push(index);
    }
  });

  return {
    hasSeasonality: strength > 0.1,
    strength,
    pattern,
    peaks,
    troughs,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatTimeSeriesLabel(
  timestamp: Date,
  interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
): string {
  switch (interval) {
    case 'hour':
      return timestamp.toISOString().slice(0, 13) + ':00';
    case 'day':
      return timestamp.toISOString().slice(0, 10);
    case 'week':
      return `Week of ${timestamp.toISOString().slice(0, 10)}`;
    case 'month':
      return timestamp.toISOString().slice(0, 7);
    case 'quarter':
      const quarter = Math.floor(timestamp.getMonth() / 3) + 1;
      return `Q${quarter} ${timestamp.getFullYear()}`;
    case 'year':
      return String(timestamp.getFullYear());
  }
}

function addInterval(
  date: Date,
  interval: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year',
  count = 1,
): Date {
  const result = new Date(date);

  switch (interval) {
    case 'hour':
      result.setHours(result.getHours() + count);
      break;
    case 'day':
      result.setDate(result.getDate() + count);
      break;
    case 'week':
      result.setDate(result.getDate() + 7 * count);
      break;
    case 'month':
      result.setMonth(result.getMonth() + count);
      break;
    case 'quarter':
      result.setMonth(result.getMonth() + 3 * count);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() + count);
      break;
  }

  return result;
}

function detectInterval(
  data: TimeSeriesDataPoint[],
): 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' {
  if (data.length < 2) return 'day';

  const diffMs = data[1].timestamp.getTime() - data[0].timestamp.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 2) return 'hour';
  if (diffHours < 48) return 'day';
  if (diffHours < 336) return 'week';
  if (diffHours < 1440) return 'month';
  if (diffHours < 4380) return 'quarter';
  return 'year';
}

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}
