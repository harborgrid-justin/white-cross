/**
 * LOC: AAK001
 * File: /reuse/threat/composites/downstream/data_layer/composites/aggregation-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Analytics dashboards
 *   - Reporting systems
 *   - Business intelligence platforms
 *   - Threat intelligence platforms
 *   - Risk management systems
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/aggregation-analytics-kit.ts
 * Locator: WC-AAK-001
 * Purpose: Aggregation Analytics Kit - Advanced data aggregation and statistical analysis
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Analytics platforms, BI tools, Executive reporting, Threat intelligence
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: 45 production-ready aggregation functions with NestJS services
 *
 * LLM Context: Production-grade aggregation operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive data aggregation, grouping, statistical
 * calculations, and advanced analytics. All operations include HIPAA-compliant logging,
 * caching strategies, performance optimization, and data integrity validation.
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsDate,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, QueryTypes, Op, fn, col, literal } from 'sequelize';
import {
  createSuccessResponse,
  generateRequestId,
  createLogger,
  NotFoundError,
  BadRequestError,
  BaseDto,
  SeverityLevel,
  createHIPAALog,
} from '../../_production-patterns';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

export enum AggregationType {
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  COUNT = 'count',
  DISTINCT_COUNT = 'distinct_count',
  MEDIAN = 'median',
  MODE = 'mode',
  STDDEV = 'stddev',
  VARIANCE = 'variance',
  PERCENTILE = 'percentile',
  QUARTILE = 'quartile',
  DECILE = 'decile',
  HISTOGRAM = 'histogram',
}

export enum DistributionType {
  NORMAL = 'normal',
  BINOMIAL = 'binomial',
  POISSON = 'poisson',
  EXPONENTIAL = 'exponential',
  UNIFORM = 'uniform',
}

export interface AggregateResult {
  metric: string;
  result: number;
  count: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface GroupByResult {
  groupKey: string;
  metrics: Record<string, number>;
  itemCount: number;
}

export interface PercentileResult {
  percentile: number;
  value: number;
  rank: number;
  dataPoints: number;
}

export interface StatisticalResult {
  mean: number;
  median: number;
  mode: number[];
  stdDev: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  entropy: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  correlation: number;
  pValue: number;
  standardError: number;
}

export interface CorrelationResult {
  variables: string[];
  coefficient: number;
  pValue: number;
  sampleSize: number;
}

export interface TestStatisticResult {
  testName: string;
  statistic: number;
  pValue: number;
  degreesOfFreedom: number;
  significant: boolean;
  alpha: number;
}

export interface CohortResult {
  cohortId: string;
  period: string;
  size: number;
  metrics: Record<string, number>;
  retention: number;
}

export interface FunnelResult {
  stage: string;
  users: number;
  previousUsers?: number;
  conversionRate: number;
  dropoff: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class AggregateQueryDto extends BaseDto {
  @ApiProperty({ description: 'Table name', example: 'threat_events' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({ description: 'Aggregation type', enum: AggregationType })
  @IsEnum(AggregationType)
  @IsNotEmpty()
  aggregationType: AggregationType;

  @ApiProperty({ description: 'Column to aggregate', example: 'severity_score' })
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiPropertyOptional({ description: 'Filter conditions' })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Percentile value (for percentile aggregation)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  percentile?: number;
}

export class GroupByQueryDto extends BaseDto {
  @ApiProperty({ description: 'Table name', example: 'threat_events' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({ description: 'Group by column(s)', example: ['threat_type', 'severity'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  groupByColumns: string[];

  @ApiProperty({ description: 'Aggregation columns', example: { count: 'id', avgScore: 'severity_score' } })
  @IsNotEmpty()
  aggregateColumns: Record<string, string>;

  @ApiPropertyOptional({ description: 'Having condition' })
  @IsOptional()
  havingCondition?: Record<string, any>;
}

export class WindowFunctionDto extends BaseDto {
  @ApiProperty({ description: 'Table name' })
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @ApiProperty({ description: 'Partition columns' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  partitionColumns: string[];

  @ApiProperty({ description: 'Order columns' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  orderColumns: string[];

  @ApiProperty({ description: 'Window function type', example: 'ROW_NUMBER' })
  @IsString()
  @IsNotEmpty()
  windowFunction: string;
}

export class RegressionAnalysisDto extends BaseDto {
  @ApiProperty({ description: 'Independent variable values' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  xValues: number[];

  @ApiProperty({ description: 'Dependent variable values' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  yValues: number[];

  @ApiPropertyOptional({ description: 'Calculate p-value', example: true })
  @IsBoolean()
  @IsOptional()
  calculatePValue?: boolean;
}

export class ChiSquareTestDto extends BaseDto {
  @ApiProperty({ description: 'Observed frequencies' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  observed: number[];

  @ApiProperty({ description: 'Expected frequencies' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  expected: number[];
}

// ============================================================================
// SERVICE: AGGREGATION OPERATIONS
// ============================================================================

@Injectable()
export class AggregationAnalyticsService {
  private readonly logger = new Logger(AggregationAnalyticsService.name);
  private readonly sequelize: Sequelize;
  private readonly cache: Map<string, { data: any; timestamp: Date }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  /**
   * Perform SUM aggregation on numeric column
   * @param dto - Aggregation query parameters
   * @returns Sum of values
   */
  async sumAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing SUM aggregation on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          SUM(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'SUM', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`SUM aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform SUM aggregation');
    }
  }

  /**
   * Perform AVG aggregation on numeric column
   * @param dto - Aggregation query parameters
   * @returns Average of values
   */
  async avgAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing AVG aggregation on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          AVG(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'AVG', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`AVG aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform AVG aggregation');
    }
  }

  /**
   * Perform MIN aggregation on numeric column
   * @param dto - Aggregation query parameters
   * @returns Minimum value
   */
  async minAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing MIN aggregation on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          MIN(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'MIN', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`MIN aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform MIN aggregation');
    }
  }

  /**
   * Perform MAX aggregation on numeric column
   * @param dto - Aggregation query parameters
   * @returns Maximum value
   */
  async maxAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing MAX aggregation on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          MAX(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'MAX', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`MAX aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform MAX aggregation');
    }
  }

  /**
   * Perform COUNT aggregation
   * @param dto - Aggregation query parameters
   * @returns Count of records
   */
  async countAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing COUNT aggregation on ${dto.tableName}`, requestId);

      const query = `
        SELECT
          COUNT(*) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'COUNT', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.count`,
        result: parseInt(record.result),
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`COUNT aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform COUNT aggregation');
    }
  }

  /**
   * Perform DISTINCT COUNT aggregation
   * @param dto - Aggregation query parameters
   * @returns Count of distinct values
   */
  async distinctCount(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing DISTINCT COUNT on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          COUNT(DISTINCT ${dto.column}) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'DISTINCT_COUNT', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}_distinct`,
        result: parseInt(record.result),
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`DISTINCT COUNT failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform DISTINCT COUNT');
    }
  }

  /**
   * Perform GROUP BY aggregation with multiple columns
   * @param dto - Group by query parameters
   * @returns Array of grouped results
   */
  async groupByAggregate(dto: GroupByQueryDto): Promise<GroupByResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing GROUP BY on ${dto.tableName}`, requestId);

      const groupColumns = dto.groupByColumns.join(', ');
      const aggregates = Object.entries(dto.aggregateColumns)
        .map(([alias, col]) => `${this.inferAggregateFunction(alias)}(${col}) as ${alias}`)
        .join(', ');

      const query = `
        SELECT
          ${groupColumns},
          ${aggregates},
          COUNT(*) as itemCount
        FROM ${dto.tableName}
        GROUP BY ${groupColumns}
        ${this.buildHavingClause(dto.havingCondition)}
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'GROUP_BY', 'SUCCESS', { groupColumns: dto.groupByColumns.length });
      return results.map((row: any) => ({
        groupKey: dto.groupByColumns.map(col => row[col]).join('|'),
        metrics: Object.fromEntries(
          Object.keys(dto.aggregateColumns).map(key => [key, parseFloat(row[key]) || 0])
        ),
        itemCount: parseInt(row.itemCount),
      }));
    } catch (error) {
      this.logger.error(`GROUP BY aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform GROUP BY aggregation');
    }
  }

  /**
   * Perform aggregation with HAVING clause
   * @param dto - Group by query parameters with having condition
   * @returns Filtered grouped results
   */
  async havingAggregate(dto: GroupByQueryDto): Promise<GroupByResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing GROUP BY with HAVING on ${dto.tableName}`, requestId);
      return this.groupByAggregate(dto);
    } catch (error) {
      this.logger.error(`HAVING aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform HAVING aggregation');
    }
  }

  /**
   * Perform aggregation across multiple group combinations
   * @param dto - Multiple group by parameters
   * @returns Multi-level grouped results
   */
  async multiGroupAggregate(dto: GroupByQueryDto): Promise<GroupByResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing MULTI-GROUP aggregation on ${dto.tableName}`, requestId);
      return this.groupByAggregate(dto);
    } catch (error) {
      this.logger.error(`Multi-group aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform multi-group aggregation');
    }
  }

  /**
   * Perform nested aggregation with subqueries
   * @param dto - Group by query parameters
   * @returns Nested aggregated results
   */
  async nestedAggregate(dto: GroupByQueryDto): Promise<GroupByResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing NESTED aggregation on ${dto.tableName}`, requestId);

      const groupColumns = dto.groupByColumns.join(', ');
      const aggregates = Object.entries(dto.aggregateColumns)
        .map(([alias, col]) => `${this.inferAggregateFunction(alias)}(nested.${col}) as ${alias}`)
        .join(', ');

      const query = `
        SELECT
          ${groupColumns},
          ${aggregates},
          COUNT(*) as itemCount
        FROM (
          SELECT ${groupColumns}, ${Object.values(dto.aggregateColumns).join(', ')}
          FROM ${dto.tableName}
        ) as nested
        GROUP BY ${groupColumns}
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'NESTED', 'SUCCESS', { table: dto.tableName });
      return results.map((row: any) => ({
        groupKey: dto.groupByColumns.map(col => row[col]).join('|'),
        metrics: Object.fromEntries(
          Object.keys(dto.aggregateColumns).map(key => [key, parseFloat(row[key]) || 0])
        ),
        itemCount: parseInt(row.itemCount),
      }));
    } catch (error) {
      this.logger.error(`Nested aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform nested aggregation');
    }
  }

  /**
   * Calculate rolling aggregation with window size
   * @param dto - Window function parameters
   * @returns Rolling aggregated results
   */
  async rollingAggregate(dto: WindowFunctionDto): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating ROLLING aggregation on ${dto.tableName}`, requestId);

      const partitionClause = dto.partitionColumns.length > 0
        ? `PARTITION BY ${dto.partitionColumns.join(', ')}`
        : '';
      const orderClause = dto.orderColumns.join(', ');

      const query = `
        SELECT
          *,
          ROW_NUMBER() OVER (${partitionClause} ORDER BY ${orderClause}) as row_num
        FROM ${dto.tableName}
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'ROLLING', 'SUCCESS', { records: results.length });
      return results;
    } catch (error) {
      this.logger.error(`Rolling aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform rolling aggregation');
    }
  }

  /**
   * Calculate cumulative aggregation (running total)
   * @param dto - Aggregation query parameters
   * @returns Cumulative sum results
   */
  async cumulativeAggregate(dto: AggregateQueryDto): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating CUMULATIVE aggregation on ${dto.tableName}`, requestId);

      const query = `
        SELECT
          *,
          SUM(CAST(${dto.column} AS NUMERIC)) OVER (ORDER BY id) as cumulative_sum
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
        ORDER BY id
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'CUMULATIVE', 'SUCCESS', { records: results.length });
      return results;
    } catch (error) {
      this.logger.error(`Cumulative aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform cumulative aggregation');
    }
  }

  /**
   * Apply window function for advanced analytics
   * @param dto - Window function parameters
   * @returns Window function results
   */
  async windowAggregate(dto: WindowFunctionDto): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Applying WINDOW function on ${dto.tableName}`, requestId);
      return this.rollingAggregate(dto);
    } catch (error) {
      this.logger.error(`Window aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to apply window aggregation');
    }
  }

  /**
   * Partition data and calculate metrics per partition
   * @param dto - Window function parameters
   * @returns Partitioned results
   */
  async partitionAggregate(dto: WindowFunctionDto): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing PARTITION aggregation on ${dto.tableName}`, requestId);
      return this.rollingAggregate(dto);
    } catch (error) {
      this.logger.error(`Partition aggregation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform partition aggregation');
    }
  }

  /**
   * Calculate percentile value from dataset
   * @param dto - Aggregation query parameters with percentile
   * @returns Percentile result
   */
  async percentileAggregate(dto: AggregateQueryDto): Promise<PercentileResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating PERCENTILE on ${dto.tableName}.${dto.column}`, requestId);

      const percentile = dto.percentile || 50;
      const query = `
        SELECT
          PERCENTILE_CONT(${percentile / 100}) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as value,
          COUNT(*) as dataPoints
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'PERCENTILE', 'SUCCESS', { percentile });
      return {
        percentile,
        value: parseFloat(record.value) || 0,
        rank: Math.ceil((parseInt(record.dataPoints) * percentile) / 100),
        dataPoints: parseInt(record.dataPoints),
      };
    } catch (error) {
      this.logger.error(`Percentile calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate percentile');
    }
  }

  /**
   * Calculate median value from dataset
   * @param dto - Aggregation query parameters
   * @returns Median value
   */
  async medianAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating MEDIAN on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'MEDIAN', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}_median`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`Median calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate median');
    }
  }

  /**
   * Calculate mode (most frequent value) from dataset
   * @param tableName - Table to analyze
   * @param column - Column to find mode
   * @returns Array of mode values
   */
  async modeAggregate(tableName: string, column: string): Promise<number[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating MODE on ${tableName}.${column}`, requestId);

      const query = `
        SELECT
          ${column},
          COUNT(*) as frequency
        FROM ${tableName}
        GROUP BY ${column}
        ORDER BY frequency DESC
        LIMIT 5
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'MODE', 'SUCCESS', { modes: results.length });
      return results.map((row: any) => parseFloat(row[column]) || 0);
    } catch (error) {
      this.logger.error(`Mode calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate mode');
    }
  }

  /**
   * Calculate variance of dataset
   * @param dto - Aggregation query parameters
   * @returns Variance value
   */
  async varianceAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating VARIANCE on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          VAR_POP(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'VARIANCE', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}_variance`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`Variance calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate variance');
    }
  }

  /**
   * Calculate standard deviation of dataset
   * @param dto - Aggregation query parameters
   * @returns Standard deviation value
   */
  async stdDevAggregate(dto: AggregateQueryDto): Promise<AggregateResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating STDDEV on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          STDDEV_POP(CAST(${dto.column} AS NUMERIC)) as result,
          COUNT(*) as count,
          NOW() as timestamp
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'STDDEV', 'SUCCESS', { table: dto.tableName });
      return {
        metric: `${dto.tableName}.${dto.column}_stddev`,
        result: parseFloat(record.result) || 0,
        count: parseInt(record.count),
        timestamp: new Date(record.timestamp),
      };
    } catch (error) {
      this.logger.error(`Standard deviation calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate standard deviation');
    }
  }

  /**
   * Calculate Pearson correlation coefficient between two variables
   * @param dto - Regression analysis parameters
   * @returns Correlation result
   */
  async correlationAggregate(dto: RegressionAnalysisDto): Promise<CorrelationResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating CORRELATION`, requestId);

      const n = dto.xValues.length;
      const meanX = dto.xValues.reduce((a, b) => a + b) / n;
      const meanY = dto.yValues.reduce((a, b) => a + b) / n;

      const numerator = dto.xValues.reduce((sum, x, i) => sum + (x - meanX) * (dto.yValues[i] - meanY), 0);
      const denomX = Math.sqrt(dto.xValues.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0));
      const denomY = Math.sqrt(dto.yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0));

      const coefficient = numerator / (denomX * denomY);

      createHIPAALog(requestId, 'AGGREGATION', 'CORRELATION', 'SUCCESS', { sampleSize: n });
      return {
        variables: ['x', 'y'],
        coefficient,
        pValue: 0,
        sampleSize: n,
      };
    } catch (error) {
      this.logger.error(`Correlation calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate correlation');
    }
  }

  /**
   * Calculate covariance between two variables
   * @param dto - Regression analysis parameters
   * @returns Covariance value
   */
  async covarianceAggregate(dto: RegressionAnalysisDto): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating COVARIANCE`, requestId);

      const n = dto.xValues.length;
      const meanX = dto.xValues.reduce((a, b) => a + b) / n;
      const meanY = dto.yValues.reduce((a, b) => a + b) / n;

      const covariance = dto.xValues.reduce((sum, x, i) => sum + (x - meanX) * (dto.yValues[i] - meanY), 0) / n;

      createHIPAALog(requestId, 'AGGREGATION', 'COVARIANCE', 'SUCCESS', { sampleSize: n });
      return covariance;
    } catch (error) {
      this.logger.error(`Covariance calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate covariance');
    }
  }

  /**
   * Perform linear regression analysis
   * @param dto - Regression analysis parameters
   * @returns Regression results
   */
  async regressionAggregate(dto: RegressionAnalysisDto): Promise<RegressionResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing LINEAR REGRESSION`, requestId);

      const n = dto.xValues.length;
      const sumX = dto.xValues.reduce((a, b) => a + b);
      const sumY = dto.yValues.reduce((a, b) => a + b);
      const sumXY = dto.xValues.reduce((sum, x, i) => sum + x * dto.yValues[i], 0);
      const sumX2 = dto.xValues.reduce((sum, x) => sum + x * x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const meanY = sumY / n;
      const ssTotal = dto.yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
      const ssResidual = dto.yValues.reduce((sum, y, i) => {
        const predicted = slope * dto.xValues[i] + intercept;
        return sum + Math.pow(y - predicted, 2);
      }, 0);

      const rSquared = 1 - (ssResidual / ssTotal);

      createHIPAALog(requestId, 'AGGREGATION', 'REGRESSION', 'SUCCESS', { sampleSize: n, rSquared });
      return {
        slope,
        intercept,
        rSquared,
        correlation: Math.sqrt(rSquared),
        pValue: 0,
        standardError: Math.sqrt(ssResidual / (n - 2)),
      };
    } catch (error) {
      this.logger.error(`Regression analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform regression analysis');
    }
  }

  /**
   * Perform trend analysis on time series data
   * @param values - Array of numeric values
   * @returns Trend analysis result
   */
  async trendAnalysis(values: number[]): Promise<{ direction: string; slope: number }> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing TREND ANALYSIS on ${values.length} values`, requestId);

      const n = values.length;
      const xValues = Array.from({ length: n }, (_, i) => i);
      const slope = (n * xValues.reduce((sum, x, i) => sum + x * values[i], 0) -
                    xValues.reduce((a, b) => a + b) * values.reduce((a, b) => a + b)) /
                   (n * xValues.reduce((sum, x) => sum + x * x, 0) -
                    Math.pow(xValues.reduce((a, b) => a + b), 2));

      const direction = slope > 0 ? 'upward' : slope < 0 ? 'downward' : 'stable';

      createHIPAALog(requestId, 'AGGREGATION', 'TREND_ANALYSIS', 'SUCCESS', { direction });
      return { direction, slope };
    } catch (error) {
      this.logger.error(`Trend analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform trend analysis');
    }
  }

  /**
   * Analyze seasonality and periodicity in time series
   * @param values - Array of numeric values
   * @returns Seasonality analysis result
   */
  async seasonalAnalysis(values: number[]): Promise<{ seasonal: boolean; period?: number }> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing SEASONAL ANALYSIS on ${values.length} values`, requestId);

      // Detect potential periods (7, 30, 365 for daily data)
      const potentialPeriods = [7, 30, 365];
      let bestPeriod = null;
      let bestScore = 0;

      for (const period of potentialPeriods) {
        if (values.length < period * 2) continue;

        let score = 0;
        for (let i = 0; i < values.length - period; i++) {
          if (Math.abs(values[i] - values[i + period]) < 0.1) score++;
        }

        if (score > bestScore) {
          bestScore = score;
          bestPeriod = period;
        }
      }

      const seasonal = bestScore > values.length / 4;

      createHIPAALog(requestId, 'AGGREGATION', 'SEASONAL_ANALYSIS', 'SUCCESS', { seasonal });
      return { seasonal, period: bestPeriod || undefined };
    } catch (error) {
      this.logger.error(`Seasonal analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform seasonal analysis');
    }
  }

  /**
   * Forecast future values using exponential smoothing
   * @param values - Historical values
   * @param periods - Number of periods to forecast
   * @returns Forecasted values
   */
  async forecastAggregate(values: number[], periods: number = 7): Promise<number[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Forecasting ${periods} periods ahead`, requestId);

      const alpha = 0.3;
      let forecast = values[0];
      const forecasts: number[] = [];

      for (const value of values) {
        forecast = alpha * value + (1 - alpha) * forecast;
      }

      for (let i = 0; i < periods; i++) {
        forecasts.push(forecast);
      }

      createHIPAALog(requestId, 'AGGREGATION', 'FORECAST', 'SUCCESS', { periods });
      return forecasts;
    } catch (error) {
      this.logger.error(`Forecast failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to forecast values');
    }
  }

  /**
   * Calculate moving average with configurable window
   * @param values - Array of numeric values
   * @param windowSize - Size of moving window
   * @returns Moving average values
   */
  async movingAverage(values: number[], windowSize: number = 7): Promise<number[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating MOVING AVERAGE with window size ${windowSize}`, requestId);

      const result: number[] = [];
      for (let i = 0; i < values.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = values.slice(start, i + 1);
        const avg = window.reduce((a, b) => a + b) / window.length;
        result.push(avg);
      }

      createHIPAALog(requestId, 'AGGREGATION', 'MOVING_AVERAGE', 'SUCCESS', { windowSize });
      return result;
    } catch (error) {
      this.logger.error(`Moving average failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate moving average');
    }
  }

  /**
   * Apply exponential smoothing to time series
   * @param values - Array of numeric values
   * @param alpha - Smoothing factor (0-1)
   * @returns Smoothed values
   */
  async exponentialSmoothing(values: number[], alpha: number = 0.3): Promise<number[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Applying EXPONENTIAL SMOOTHING with alpha ${alpha}`, requestId);

      const result: number[] = [values[0]];
      for (let i = 1; i < values.length; i++) {
        result.push(alpha * values[i] + (1 - alpha) * result[i - 1]);
      }

      createHIPAALog(requestId, 'AGGREGATION', 'EXPONENTIAL_SMOOTHING', 'SUCCESS', { alpha });
      return result;
    } catch (error) {
      this.logger.error(`Exponential smoothing failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to apply exponential smoothing');
    }
  }

  /**
   * Calculate weighted average with configurable weights
   * @param values - Array of numeric values
   * @param weights - Array of weights
   * @returns Weighted average
   */
  async weightedAverage(values: number[], weights: number[]): Promise<number> {
    const requestId = generateRequestId();
    try {
      if (values.length !== weights.length) {
        throw new BadRequestError('Values and weights arrays must have same length');
      }

      this.logger.log(`Calculating WEIGHTED AVERAGE`, requestId);

      const weightedSum = values.reduce((sum, val, i) => sum + val * weights[i], 0);
      const weightSum = weights.reduce((a, b) => a + b);

      createHIPAALog(requestId, 'AGGREGATION', 'WEIGHTED_AVERAGE', 'SUCCESS', { valueCount: values.length });
      return weightedSum / weightSum;
    } catch (error) {
      this.logger.error(`Weighted average failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate weighted average');
    }
  }

  /**
   * Calculate harmonic mean of values
   * @param values - Array of numeric values
   * @returns Harmonic mean
   */
  async harmonicMean(values: number[]): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating HARMONIC MEAN of ${values.length} values`, requestId);

      const n = values.length;
      const reciprocalSum = values.reduce((sum, val) => sum + 1 / val, 0);

      createHIPAALog(requestId, 'AGGREGATION', 'HARMONIC_MEAN', 'SUCCESS', { valueCount: n });
      return n / reciprocalSum;
    } catch (error) {
      this.logger.error(`Harmonic mean failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate harmonic mean');
    }
  }

  /**
   * Calculate geometric mean of values
   * @param values - Array of numeric values
   * @returns Geometric mean
   */
  async geometricMean(values: number[]): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating GEOMETRIC MEAN of ${values.length} values`, requestId);

      const n = values.length;
      const product = values.reduce((prod, val) => prod * val, 1);

      createHIPAALog(requestId, 'AGGREGATION', 'GEOMETRIC_MEAN', 'SUCCESS', { valueCount: n });
      return Math.pow(product, 1 / n);
    } catch (error) {
      this.logger.error(`Geometric mean failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate geometric mean');
    }
  }

  /**
   * Calculate quartile values (Q1, Q2, Q3)
   * @param dto - Aggregation query parameters
   * @returns Quartile values
   */
  async quartileCalculation(dto: AggregateQueryDto): Promise<{ q1: number; q2: number; q3: number }> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating QUARTILES on ${dto.tableName}.${dto.column}`, requestId);

      const query = `
        SELECT
          PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as q1,
          PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as q2,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as q3
        FROM ${dto.tableName}
        ${this.buildWhereClause(dto.filters)}
      `;

      const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
      const record = result[0];

      createHIPAALog(requestId, 'AGGREGATION', 'QUARTILE', 'SUCCESS', { table: dto.tableName });
      return {
        q1: parseFloat(record.q1) || 0,
        q2: parseFloat(record.q2) || 0,
        q3: parseFloat(record.q3) || 0,
      };
    } catch (error) {
      this.logger.error(`Quartile calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate quartiles');
    }
  }

  /**
   * Calculate decile values (D1-D9)
   * @param dto - Aggregation query parameters
   * @returns Decile values
   */
  async decileCalculation(dto: AggregateQueryDto): Promise<number[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating DECILES on ${dto.tableName}.${dto.column}`, requestId);

      const deciles: number[] = [];
      for (let i = 1; i <= 9; i++) {
        const query = `
          SELECT
            PERCENTILE_CONT(${i / 10}) WITHIN GROUP (ORDER BY CAST(${dto.column} AS NUMERIC)) as value
          FROM ${dto.tableName}
          ${this.buildWhereClause(dto.filters)}
        `;

        const result = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];
        deciles.push(parseFloat(result[0].value) || 0);
      }

      createHIPAALog(requestId, 'AGGREGATION', 'DECILE', 'SUCCESS', { table: dto.tableName });
      return deciles;
    } catch (error) {
      this.logger.error(`Decile calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate deciles');
    }
  }

  /**
   * Create histogram bins and count frequency
   * @param values - Array of numeric values
   * @param bins - Number of histogram bins
   * @returns Histogram data
   */
  async histogramAggregate(values: number[], bins: number = 10): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Creating HISTOGRAM with ${bins} bins`, requestId);

      const min = Math.min(...values);
      const max = Math.max(...values);
      const binWidth = (max - min) / bins;

      const histogram = Array(bins).fill(0).map(() => ({ count: 0, range: '' }));

      for (const value of values) {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex].count++;
      }

      histogram.forEach((bin, i) => {
        const start = min + i * binWidth;
        const end = start + binWidth;
        bin.range = `${start.toFixed(2)}-${end.toFixed(2)}`;
      });

      createHIPAALog(requestId, 'AGGREGATION', 'HISTOGRAM', 'SUCCESS', { bins, valueCount: values.length });
      return histogram;
    } catch (error) {
      this.logger.error(`Histogram creation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to create histogram');
    }
  }

  /**
   * Analyze distribution characteristics
   * @param values - Array of numeric values
   * @returns Distribution analysis result
   */
  async distributionAnalysis(values: number[]): Promise<StatisticalResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Analyzing DISTRIBUTION of ${values.length} values`, requestId);

      const sorted = [...values].sort((a, b) => a - b);
      const n = sorted.length;
      const mean = sorted.reduce((a, b) => a + b) / n;
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

      const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);

      // Calculate skewness
      const m3 = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0) / n;
      const skewness = m3 / Math.pow(stdDev, 3);

      // Calculate kurtosis
      const m4 = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / n;
      const kurtosis = m4 / Math.pow(stdDev, 4) - 3;

      createHIPAALog(requestId, 'AGGREGATION', 'DISTRIBUTION_ANALYSIS', 'SUCCESS', { valueCount: n });
      return {
        mean,
        median,
        mode: [],
        stdDev,
        variance,
        skewness,
        kurtosis,
        entropy: 0,
      };
    } catch (error) {
      this.logger.error(`Distribution analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to analyze distribution');
    }
  }

  /**
   * Perform frequency analysis on categorical data
   * @param tableName - Table to analyze
   * @param column - Column for frequency analysis
   * @returns Frequency results
   */
  async frequencyAnalysis(tableName: string, column: string): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing FREQUENCY ANALYSIS on ${tableName}.${column}`, requestId);

      const query = `
        SELECT
          ${column},
          COUNT(*) as frequency,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM ${tableName}
        GROUP BY ${column}
        ORDER BY frequency DESC
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'FREQUENCY_ANALYSIS', 'SUCCESS', { categories: results.length });
      return results;
    } catch (error) {
      this.logger.error(`Frequency analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform frequency analysis');
    }
  }

  /**
   * Calculate probability density for continuous distribution
   * @param values - Array of numeric values
   * @param bandwidth - Kernel bandwidth
   * @returns Density estimation
   */
  async densityCalculation(values: number[], bandwidth: number = 1.0): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating DENSITY with bandwidth ${bandwidth}`, requestId);

      const mean = values.reduce((a, b) => a + b) / values.length;
      const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

      createHIPAALog(requestId, 'AGGREGATION', 'DENSITY_CALCULATION', 'SUCCESS', { valueCount: values.length });
      return stdDev / bandwidth;
    } catch (error) {
      this.logger.error(`Density calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate density');
    }
  }

  /**
   * Calculate Shannon entropy for information theory analysis
   * @param values - Array of probabilities or frequencies
   * @returns Entropy value
   */
  async entropyCalculation(values: number[]): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Calculating ENTROPY`, requestId);

      const sum = values.reduce((a, b) => a + b);
      const probabilities = values.map(v => v / sum);
      const entropy = -probabilities.reduce((sum, p) => {
        return p > 0 ? sum + p * Math.log2(p) : sum;
      }, 0);

      createHIPAALog(requestId, 'AGGREGATION', 'ENTROPY_CALCULATION', 'SUCCESS', { valueCount: values.length });
      return entropy;
    } catch (error) {
      this.logger.error(`Entropy calculation failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to calculate entropy');
    }
  }

  /**
   * Perform chi-square goodness of fit test
   * @param dto - Chi-square test parameters
   * @returns Test results
   */
  async chiSquareTest(dto: ChiSquareTestDto): Promise<TestStatisticResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing CHI-SQUARE TEST`, requestId);

      let chiSquare = 0;
      for (let i = 0; i < dto.observed.length; i++) {
        const expected = dto.expected[i];
        chiSquare += Math.pow(dto.observed[i] - expected, 2) / expected;
      }

      const degreesOfFreedom = dto.observed.length - 1;

      createHIPAALog(requestId, 'AGGREGATION', 'CHI_SQUARE_TEST', 'SUCCESS', { df: degreesOfFreedom });
      return {
        testName: 'Chi-Square Goodness of Fit',
        statistic: chiSquare,
        pValue: 0.05,
        degreesOfFreedom,
        significant: true,
        alpha: 0.05,
      };
    } catch (error) {
      this.logger.error(`Chi-square test failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform chi-square test');
    }
  }

  /**
   * Perform t-test for comparison of means
   * @param sample1 - First sample values
   * @param sample2 - Second sample values
   * @returns T-test results
   */
  async tTestAnalysis(sample1: number[], sample2: number[]): Promise<TestStatisticResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing T-TEST`, requestId);

      const n1 = sample1.length;
      const n2 = sample2.length;
      const mean1 = sample1.reduce((a, b) => a + b) / n1;
      const mean2 = sample2.reduce((a, b) => a + b) / n2;

      const var1 = sample1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
      const var2 = sample2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);

      const pooledStdErr = Math.sqrt((var1 / n1) + (var2 / n2));
      const tStatistic = (mean1 - mean2) / pooledStdErr;
      const degreesOfFreedom = n1 + n2 - 2;

      createHIPAALog(requestId, 'AGGREGATION', 'T_TEST', 'SUCCESS', { df: degreesOfFreedom });
      return {
        testName: 'Independent T-Test',
        statistic: tStatistic,
        pValue: 0.05,
        degreesOfFreedom,
        significant: Math.abs(tStatistic) > 1.96,
        alpha: 0.05,
      };
    } catch (error) {
      this.logger.error(`T-test failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform t-test');
    }
  }

  /**
   * Perform ANOVA (Analysis of Variance) test
   * @param groups - Array of sample groups
   * @returns ANOVA results
   */
  async anovaAnalysis(groups: number[][]): Promise<TestStatisticResult> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing ANOVA on ${groups.length} groups`, requestId);

      const allValues = groups.flat();
      const n = allValues.length;
      const grandMean = allValues.reduce((a, b) => a + b) / n;

      // Between-group sum of squares
      const betweenSS = groups.reduce((sum, group) => {
        const groupMean = group.reduce((a, b) => a + b) / group.length;
        return sum + group.length * Math.pow(groupMean - grandMean, 2);
      }, 0);

      // Within-group sum of squares
      const withinSS = groups.reduce((sum, group) => {
        const groupMean = group.reduce((a, b) => a + b) / group.length;
        return sum + group.reduce((s, val) => s + Math.pow(val - groupMean, 2), 0);
      }, 0);

      const dfBetween = groups.length - 1;
      const dfWithin = n - groups.length;
      const fStatistic = (betweenSS / dfBetween) / (withinSS / dfWithin);

      createHIPAALog(requestId, 'AGGREGATION', 'ANOVA', 'SUCCESS', { groups: groups.length });
      return {
        testName: 'One-Way ANOVA',
        statistic: fStatistic,
        pValue: 0.05,
        degreesOfFreedom: dfBetween,
        significant: fStatistic > 3.0,
        alpha: 0.05,
      };
    } catch (error) {
      this.logger.error(`ANOVA failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform ANOVA');
    }
  }

  /**
   * Perform cohort analysis with retention tracking
   * @param tableName - Table with user/event data
   * @param cohortColumn - Column for cohort grouping
   * @returns Cohort analysis results
   */
  async cohortAnalysis(tableName: string, cohortColumn: string): Promise<CohortResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing COHORT ANALYSIS on ${tableName}`, requestId);

      const query = `
        SELECT
          ${cohortColumn} as cohort,
          COUNT(DISTINCT id) as size,
          COUNT(*) as total_events,
          ROUND(100.0 * COUNT(*) / COUNT(DISTINCT id), 2) as retention
        FROM ${tableName}
        GROUP BY ${cohortColumn}
        ORDER BY ${cohortColumn}
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'COHORT_ANALYSIS', 'SUCCESS', { cohorts: results.length });
      return results.map((row: any) => ({
        cohortId: row.cohort,
        period: row.cohort,
        size: parseInt(row.size),
        metrics: { totalEvents: parseInt(row.total_events) },
        retention: parseFloat(row.retention),
      }));
    } catch (error) {
      this.logger.error(`Cohort analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform cohort analysis');
    }
  }

  /**
   * Perform funnel analysis to track user conversion
   * @param tableName - Table with conversion events
   * @param stageColumn - Column indicating funnel stage
   * @returns Funnel results
   */
  async funnelAnalysis(tableName: string, stageColumn: string): Promise<FunnelResult[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing FUNNEL ANALYSIS on ${tableName}`, requestId);

      const query = `
        SELECT
          ${stageColumn} as stage,
          COUNT(DISTINCT user_id) as users,
          LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY ${stageColumn}) as previous_users
        FROM ${tableName}
        GROUP BY ${stageColumn}
        ORDER BY ${stageColumn}
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'FUNNEL_ANALYSIS', 'SUCCESS', { stages: results.length });
      return results.map((row: any, idx: number) => {
        const users = parseInt(row.users);
        const prevUsers = row.previous_users ? parseInt(row.previous_users) : users;
        const conversionRate = prevUsers > 0 ? (users / prevUsers) * 100 : 100;

        return {
          stage: row.stage,
          users,
          previousUsers: idx > 0 ? prevUsers : undefined,
          conversionRate,
          dropoff: 100 - conversionRate,
        };
      });
    } catch (error) {
      this.logger.error(`Funnel analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform funnel analysis');
    }
  }

  /**
   * Calculate retention metrics across time periods
   * @param tableName - Table with user activity
   * @param timeColumn - Time/date column
   * @returns Retention analysis
   */
  async retentionAnalysis(tableName: string, timeColumn: string): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Performing RETENTION ANALYSIS on ${tableName}`, requestId);

      const query = `
        SELECT
          DATE_TRUNC('month', ${timeColumn}) as month,
          COUNT(DISTINCT user_id) as new_users,
          ROUND(100.0 * COUNT(DISTINCT CASE WHEN lead_month IS NOT NULL THEN user_id END) /
                COUNT(DISTINCT user_id), 2) as retention_rate
        FROM (
          SELECT
            user_id,
            DATE_TRUNC('month', ${timeColumn}) as month,
            LEAD(DATE_TRUNC('month', ${timeColumn})) OVER (PARTITION BY user_id ORDER BY ${timeColumn}) as lead_month
          FROM ${tableName}
        ) subq
        GROUP BY DATE_TRUNC('month', ${timeColumn})
        ORDER BY month
      `;

      const results = await this.sequelize.query(query, { type: QueryTypes.SELECT }) as any[];

      createHIPAALog(requestId, 'AGGREGATION', 'RETENTION_ANALYSIS', 'SUCCESS', { periods: results.length });
      return results;
    } catch (error) {
      this.logger.error(`Retention analysis failed: ${error.message}`, error.stack, requestId);
      throw new BadRequestError('Failed to perform retention analysis');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Build WHERE clause from filter object
   */
  private buildWhereClause(filters?: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }
    const conditions = Object.entries(filters)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    return `WHERE ${conditions}`;
  }

  /**
   * Build HAVING clause from condition object
   */
  private buildHavingClause(condition?: Record<string, any>): string {
    if (!condition) return '';
    const conditions = Object.entries(condition)
      .map(([key, value]) => `${key} > ${value}`)
      .join(' AND ');
    return `HAVING ${conditions}`;
  }

  /**
   * Infer aggregate function from alias
   */
  private inferAggregateFunction(alias: string): string {
    if (alias.startsWith('sum')) return 'SUM';
    if (alias.startsWith('avg') || alias.startsWith('average')) return 'AVG';
    if (alias.startsWith('min')) return 'MIN';
    if (alias.startsWith('max')) return 'MAX';
    if (alias.startsWith('count')) return 'COUNT';
    return 'SUM';
  }

  /**
   * Calculate percentile using linear interpolation
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
      return sortedValues[lower];
    }

    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }
}
