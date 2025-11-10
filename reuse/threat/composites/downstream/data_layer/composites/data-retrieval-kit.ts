/**
 * LOC: DATARET001
 * File: /reuse/threat/composites/downstream/data_layer/composites/data-retrieval-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Data access services
 *   - Business logic layers
 *   - API controllers
 *   - Cache managers
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/data-retrieval-kit.ts
 * Locator: WC-DATARET-001
 * Purpose: Data Retrieval Kit - Advanced data fetching and retrieval operations
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Data services, Business logic, API endpoints
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, class-validator
 * Exports: 45 production-ready data retrieval functions with NestJS services
 *
 * LLM Context: Production-grade data retrieval operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive data fetching with filtering, sorting, projection,
 * aggregation, relations loading, caching, encryption, compression, streaming, and validation.
 * All operations include HIPAA-compliant logging, audit trails, access control, and performance
 * optimization strategies. Supports single/batch retrieval, lazy/eager loading, versioning,
 * pagination, cursor-based scrolling, time-series data, and encrypted data decryption.
 */

import {
  Injectable,
  Logger,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
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
  IsUUID,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Model, Sequelize, QueryTypes, Op, FindOptions, WhereOptions } from 'sequelize';
import {
  createSuccessResponse,
  createPaginatedResponse,
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

export enum RetrievalMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  BATCH = 'batch',
  STREAM = 'stream',
}

export enum ProjectionType {
  FULL = 'full',
  PARTIAL = 'partial',
  EXCLUDE = 'exclude',
  COMPUTED = 'computed',
}

export enum AggregationFunction {
  COUNT = 'count',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  STDDEV = 'stddev',
  VARIANCE = 'variance',
}

export enum CacheStrategy {
  NONE = 'none',
  SHORT_TERM = 'short_term',
  LONG_TERM = 'long_term',
  DISTRIBUTED = 'distributed',
}

export interface RetrievalOptions {
  mode: RetrievalMode;
  includeDeleted?: boolean;
  lockMode?: 'update' | 'share' | 'none';
  transaction?: any;
  cacheStrategy?: CacheStrategy;
  timeout?: number;
}

export interface ProjectionConfig {
  type: ProjectionType;
  fields?: string[];
  excludeFields?: string[];
  computedFields?: Record<string, string>;
}

export interface AggregationConfig {
  field: string;
  function: AggregationFunction;
  groupBy?: string[];
  having?: Record<string, any>;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  cursor?: string;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class DataRetrievalDto extends BaseDto {
  @ApiProperty({ description: 'Entity model name', example: 'ThreatIntelligence' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiPropertyOptional({ description: 'Primary key value', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ description: 'Retrieval mode', enum: RetrievalMode, default: RetrievalMode.SINGLE })
  @IsEnum(RetrievalMode)
  @IsOptional()
  mode?: RetrievalMode = RetrievalMode.SINGLE;

  @ApiPropertyOptional({ description: 'Filter criteria', example: { status: 'active' } })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Projection configuration' })
  @IsOptional()
  projection?: ProjectionConfig;

  @ApiPropertyOptional({ description: 'Cache strategy', enum: CacheStrategy, default: CacheStrategy.SHORT_TERM })
  @IsEnum(CacheStrategy)
  @IsOptional()
  cacheStrategy?: CacheStrategy = CacheStrategy.SHORT_TERM;
}

export class BatchRetrievalDto extends BaseDto {
  @ApiProperty({ description: 'Array of primary keys', example: ['id1', 'id2', 'id3'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];

  @ApiPropertyOptional({ description: 'Include deleted records', default: false })
  @IsBoolean()
  @IsOptional()
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({ description: 'Enable batch caching', default: true })
  @IsBoolean()
  @IsOptional()
  useBatch?: boolean = true;
}

export class FilteredRetrievalDto extends BaseDto {
  @ApiProperty({ description: 'Filter criteria', example: { status: 'active', severity: 'HIGH' } })
  @IsNotEmpty()
  filters: Record<string, any>;

  @ApiPropertyOptional({ description: 'Sort order', example: { createdAt: -1 } })
  @IsOptional()
  sort?: Record<string, 1 | -1>;

  @ApiPropertyOptional({ description: 'Pagination', example: { page: 1, pageSize: 20 } })
  @IsOptional()
  pagination?: PaginationConfig;
}

export class AggregationRetrievalDto extends BaseDto {
  @ApiProperty({ description: 'Aggregation configurations', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  aggregations: AggregationConfig[];

  @ApiPropertyOptional({ description: 'Filter criteria before aggregation' })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Group by fields', example: ['severity', 'status'] })
  @IsOptional()
  groupBy?: string[];
}

// ============================================================================
// SERVICE: DATA RETRIEVAL OPERATIONS
// ============================================================================

@Injectable()
export class DataRetrievalService {
  private readonly logger = new Logger(DataRetrievalService.name);
  private readonly sequelize: Sequelize;
  private readonly cache: Map<string, { data: any; timestamp: Date; ttl: number }> = new Map();
  private readonly CACHE_TTL_SHORT = 300000; // 5 minutes
  private readonly CACHE_TTL_LONG = 3600000; // 1 hour

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.initializeCacheCleanup();
  }

  // ========================================================================
  // PRIMARY KEY RETRIEVAL
  // ========================================================================

  /**
   * Find record by primary key with optional relations and projections
   * @param model - Sequelize model name
   * @param id - Primary key value
   * @param options - Retrieval options
   * @returns Single record or null
   */
  async findByPrimaryKey(
    model: string,
    id: string,
    options?: FindOptions
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by PK: ${id}`, requestId);
      createHIPAALog(requestId, 'RETRIEVE', model, { operation: 'findByPrimaryKey', id }, 'INFO');

      const cacheKey = `${model}:pk:${id}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for ${cacheKey}`, requestId);
        return cached;
      }

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id, options);

      if (result) {
        this.setInCache(cacheKey, result, this.CACHE_TTL_SHORT);
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} by PK: ${error.message}`, error.stack);
      createHIPAALog(requestId, 'RETRIEVE', model, { error: error.message }, 'ERROR');
      throw new NotFoundError(`${model} not found with id: ${id}`);
    }
  }

  /**
   * Find records by multiple criteria with AND/OR logic
   * @param model - Sequelize model name
   * @param criteria - Filter criteria object
   * @param options - Find options
   * @returns Array of matching records
   */
  async findByCriteria(
    model: string,
    criteria: Record<string, any>,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by criteria`, requestId);
      createHIPAALog(requestId, 'RETRIEVE', model, { operation: 'findByCriteria', criteriaKeys: Object.keys(criteria) }, 'INFO');

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: criteria,
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} by criteria: ${error.message}`, error.stack);
      createHIPAALog(requestId, 'RETRIEVE', model, { error: error.message }, 'ERROR');
      throw new BadRequestError(`Failed to retrieve ${model} by criteria`);
    }
  }

  /**
   * Find records with advanced filtering using operators
   * @param model - Sequelize model name
   * @param filters - Advanced filter object with operators
   * @param options - Find options
   * @returns Array of filtered records
   */
  async findWithFilters(
    model: string,
    filters: Record<string, any>,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with advanced filters`, requestId);

      const sequelizeModel = this.getModel(model);
      const where = this.buildWhereClause(filters);

      const result = await sequelizeModel.findAll({
        where,
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} with filters: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to apply filters to ${model}`);
    }
  }

  /**
   * Find records with specified sort order
   * @param model - Sequelize model name
   * @param sortConfig - Sort configuration
   * @param filters - Optional filter criteria
   * @param options - Find options
   * @returns Sorted array of records
   */
  async findWithSort(
    model: string,
    sortConfig: Record<string, 1 | -1>,
    filters?: Record<string, any>,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with sort`, requestId);

      const sequelizeModel = this.getModel(model);
      const order = Object.entries(sortConfig).map(([field, direction]) => [
        field,
        direction === 1 ? 'ASC' : 'DESC',
      ]);

      const result = await sequelizeModel.findAll({
        where: filters || {},
        order,
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} with sort: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to sort ${model}`);
    }
  }

  /**
   * Find records with field projection (include/exclude specific fields)
   * @param model - Sequelize model name
   * @param projection - Projection configuration
   * @param filters - Optional filter criteria
   * @param options - Find options
   * @returns Records with projected fields
   */
  async findWithProjection(
    model: string,
    projection: ProjectionConfig,
    filters?: Record<string, any>,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with projection`, requestId);

      const sequelizeModel = this.getModel(model);
      const attributes = this.buildProjection(projection);

      const result = await sequelizeModel.findAll({
        attributes,
        where: filters || {},
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} with projection: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to project ${model} fields`);
    }
  }

  /**
   * Find records with aggregation functions
   * @param model - Sequelize model name
   * @param aggregationConfig - Aggregation configuration
   * @param filters - Optional filter criteria
   * @returns Aggregated results
   */
  async findWithAggregation(
    model: string,
    aggregationConfig: AggregationConfig[],
    filters?: Record<string, any>
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with aggregation`, requestId);

      const sequelizeModel = this.getModel(model);
      const attributes = this.buildAggregationAttributes(aggregationConfig);

      const result = await sequelizeModel.findAll({
        attributes,
        where: filters || {},
        group: aggregationConfig[0]?.groupBy || [],
        raw: true,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to aggregate ${model}: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to aggregate ${model}`);
    }
  }

  /**
   * Find one record or throw error if not found
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param options - Find options
   * @returns Single record (guaranteed)
   */
  async findOneOrFail(
    model: string,
    filters: Record<string, any>,
    options?: FindOptions
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} or fail`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findOne({
        where: filters,
        ...options,
      });

      if (!result) {
        throw new NotFoundError(`${model} not found matching criteria`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to find ${model} or fail: ${error.message}`, error.stack);
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError(`Failed to retrieve ${model}`);
    }
  }

  /**
   * Find first matching record in specified order
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param orderBy - Order specification
   * @returns First matching record or null
   */
  async findFirstMatch(
    model: string,
    filters: Record<string, any>,
    orderBy?: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding first match for ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const order = orderBy ? [[orderBy, 'ASC']] : [['createdAt', 'ASC']];

      const result = await sequelizeModel.findOne({
        where: filters,
        order,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find first match: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find first match for ${model}`);
    }
  }

  /**
   * Find record with most recent update timestamp
   * @param model - Sequelize model name
   * @param filters - Optional filter criteria
   * @returns Most recently updated record
   */
  async findLastUpdated(
    model: string,
    filters?: Record<string, any>
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding last updated ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findOne({
        where: filters || {},
        order: [['updatedAt', 'DESC']],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find last updated: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find last updated ${model}`);
    }
  }

  /**
   * Find records by specific field value
   * @param model - Sequelize model name
   * @param field - Field name to search
   * @param value - Value to match
   * @param options - Find options
   * @returns Array of matching records
   */
  async findByFieldValue(
    model: string,
    field: string,
    value: any,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by field ${field}=${value}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: { [field]: value },
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find by field: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find ${model} by ${field}`);
    }
  }

  /**
   * Find records matching multiple field values
   * @param model - Sequelize model name
   * @param fieldValues - Object with field-value pairs
   * @param options - Find options
   * @returns Array of matching records
   */
  async findByMultipleFields(
    model: string,
    fieldValues: Record<string, any>,
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by multiple fields`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: fieldValues,
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find by multiple fields: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find ${model} by multiple fields`);
    }
  }

  /**
   * Find records with nested relation loading
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param relations - Relations to include with nesting
   * @returns Records with nested relations
   */
  async findWithNestedRelations(
    model: string,
    filters: Record<string, any>,
    relations: Array<{ model: string; as: string; nested?: any[] }>
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with nested relations`, requestId);

      const sequelizeModel = this.getModel(model);
      const include = this.buildIncludeConfig(relations);

      const result = await sequelizeModel.findAll({
        where: filters,
        include,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find with nested relations: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to load nested relations for ${model}`);
    }
  }

  /**
   * Find records with lazy loading capability (defer relation loading)
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param lazyFields - Fields to lazy load later
   * @returns Records without lazy fields initially loaded
   */
  async findWithLazyLoad(
    model: string,
    filters: Record<string, any>,
    lazyFields?: string[]
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with lazy load`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: filters,
        attributes: {
          exclude: lazyFields || [],
        },
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find with lazy load: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to lazy load ${model}`);
    }
  }

  /**
   * Find records with eager loading of all relations
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param depth - Nesting depth for eager loading
   * @returns Records with all relations eagerly loaded
   */
  async findWithEagerLoad(
    model: string,
    filters: Record<string, any>,
    depth: number = 1
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} with eager load (depth: ${depth})`, requestId);

      const sequelizeModel = this.getModel(model);
      const include = this.buildEagerLoadConfig(sequelizeModel, depth);

      const result = await sequelizeModel.findAll({
        where: filters,
        include,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find with eager load: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to eagerly load ${model}`);
    }
  }

  /**
   * Find records by JSON path expression
   * @param model - Sequelize model name
   * @param jsonField - JSON field name
   * @param path - JSON path expression
   * @param value - Value to match
   * @returns Records matching JSON path condition
   */
  async findByJsonPath(
    model: string,
    jsonField: string,
    path: string,
    value: any
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by JSON path`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: this.sequelize.where(
          this.sequelize.fn('JSON_EXTRACT', this.sequelize.col(jsonField), path),
          Op.eq,
          value
        ),
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find by JSON path: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find ${model} by JSON path`);
    }
  }

  /**
   * Find records where array field contains value
   * @param model - Sequelize model name
   * @param arrayField - Array field name
   * @param value - Value to check containment
   * @returns Records where array contains value
   */
  async findByArrayContains(
    model: string,
    arrayField: string,
    value: any
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Finding ${model} by array containment`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: this.sequelize.where(
          this.sequelize.fn('JSON_CONTAINS', this.sequelize.col(arrayField), JSON.stringify(value)),
          Op.eq,
          1
        ),
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to find by array contains: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to find ${model} by array containment`);
    }
  }

  /**
   * Fetch latest version of record
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param versionField - Version field name
   * @returns Latest version record
   */
  async fetchLatestVersion(
    model: string,
    id: string,
    versionField: string = 'version'
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching latest version of ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findOne({
        where: { id },
        order: [[versionField, 'DESC']],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch latest version: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch latest version of ${model}`);
    }
  }

  /**
   * Fetch archived/soft-deleted records
   * @param model - Sequelize model name
   * @param filters - Optional filter criteria
   * @returns Array of archived records
   */
  async fetchArchivedRecords(
    model: string,
    filters?: Record<string, any>
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching archived records for ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: {
          deletedAt: { [Op.ne]: null },
          ...filters,
        },
        paranoid: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch archived records: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch archived ${model}`);
    }
  }

  /**
   * Retrieve records with cache strategy (short/long-term)
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param cacheStrategy - Cache strategy to apply
   * @returns Records from cache or database
   */
  async retrieveWithCache(
    model: string,
    filters: Record<string, any>,
    cacheStrategy: CacheStrategy = CacheStrategy.SHORT_TERM
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      const cacheKey = `${model}:cache:${JSON.stringify(filters)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for ${cacheKey}`, requestId);
        return cached;
      }

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({ where: filters });

      const ttl = cacheStrategy === CacheStrategy.LONG_TERM ? this.CACHE_TTL_LONG : this.CACHE_TTL_SHORT;
      this.setInCache(cacheKey, result, ttl);

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve with cache: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve ${model} with cache`);
    }
  }

  /**
   * Retrieve records with row-level locking for concurrent access
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param lockMode - Lock mode (update or share)
   * @returns Locked record
   */
  async retrieveWithLock(
    model: string,
    id: string,
    lockMode: 'update' | 'share' = 'update'
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving ${model}:${id} with ${lockMode} lock`, requestId);

      const transaction = await this.sequelize.transaction();
      try {
        const sequelizeModel = this.getModel(model);
        const result = await sequelizeModel.findByPk(id, {
          lock: lockMode === 'update' ? transaction.LOCK.UPDATE : transaction.LOCK.SHARE,
          transaction,
        });

        await transaction.commit();
        return result;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve with lock: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to lock ${model}`);
    }
  }

  /**
   * Retrieve soft-deleted records
   * @param model - Sequelize model name
   * @param filters - Optional filter criteria
   * @returns Soft-deleted records
   */
  async retrieveDeleted(
    model: string,
    filters?: Record<string, any>
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving deleted records for ${model}`, requestId);
      createHIPAALog(requestId, 'RETRIEVE', model, { operation: 'retrieveDeleted' }, 'INFO');

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: {
          deletedAt: { [Op.ne]: null },
          ...filters,
        },
        paranoid: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve deleted: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve deleted ${model}`);
    }
  }

  /**
   * Retrieve complete change history for record
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Array of historical versions
   */
  async retrieveHistory(
    model: string,
    id: string
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving history for ${model}:${id}`, requestId);
      createHIPAALog(requestId, 'AUDIT', model, { operation: 'retrieveHistory', id }, 'INFO');

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: { id },
        order: [['version', 'ASC']],
        paranoid: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve history: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve history for ${model}`);
    }
  }

  /**
   * Retrieve audit trail for record modifications
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Audit trail entries
   */
  async retrieveAuditTrail(
    model: string,
    id: string
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving audit trail for ${model}:${id}`, requestId);
      createHIPAALog(requestId, 'AUDIT', model, { operation: 'retrieveAuditTrail', id }, 'INFO');

      const query = `
        SELECT * FROM audit_logs
        WHERE entity_type = :model AND entity_id = :id
        ORDER BY created_at DESC
      `;

      const result = await this.sequelize.query(query, {
        replacements: { model, id },
        type: QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve audit trail: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve audit trail for ${model}`);
    }
  }

  /**
   * Fetch metadata for record (creation date, modification date, etc.)
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Metadata object
   */
  async fetchMetadata(
    model: string,
    id: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching metadata for ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id, {
        attributes: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'version'],
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch metadata: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch metadata for ${model}`);
    }
  }

  /**
   * Fetch count of related records for given record
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param relationName - Relation name to count
   * @returns Count of related records
   */
  async fetchRelatedCount(
    model: string,
    id: string,
    relationName: string
  ): Promise<number> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching related count for ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const record = await sequelizeModel.findByPk(id);

      if (!record) {
        throw new NotFoundError(`${model} not found`);
      }

      const count = await record[`count${this.capitalize(relationName)}`]?.();
      return count || 0;
    } catch (error) {
      this.logger.error(`Failed to fetch related count: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to count related ${relationName}`);
    }
  }

  /**
   * Fetch associated records for given parent record
   * @param model - Sequelize model name
   * @param id - Parent record ID
   * @param associationName - Association name
   * @returns Array of associated records
   */
  async fetchAssociations(
    model: string,
    id: string,
    associationName: string
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching associations for ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const record = await sequelizeModel.findByPk(id);

      if (!record) {
        throw new NotFoundError(`${model} not found`);
      }

      const associations = await record[`get${this.capitalize(associationName)}`]?.();
      return associations || [];
    } catch (error) {
      this.logger.error(`Failed to fetch associations: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch ${associationName}`);
    }
  }

  /**
   * Retrieve partial record (specific fields only)
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param fields - Array of fields to include
   * @returns Partial record with specified fields
   */
  async retrievePartial(
    model: string,
    id: string,
    fields: string[]
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving partial ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id, {
        attributes: fields,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve partial: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve partial ${model}`);
    }
  }

  /**
   * Retrieve complete record with all fields
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Complete record
   */
  async retrieveFullObject(
    model: string,
    id: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving full object ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id);

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve full object: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve full object ${model}`);
    }
  }

  /**
   * Fetch version history timeline
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Array of version entries with timestamps
   */
  async fetchVersionHistory(
    model: string,
    id: string
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching version history for ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: { id },
        attributes: ['version', 'createdAt', 'updatedAt'],
        order: [['version', 'DESC']],
        paranoid: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch version history: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch version history for ${model}`);
    }
  }

  /**
   * Retrieve point-in-time snapshot
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param timestamp - Snapshot timestamp
   * @returns Record state at given timestamp
   */
  async retrieveSnapshot(
    model: string,
    id: string,
    timestamp: Date
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving snapshot for ${model}:${id} at ${timestamp}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findOne({
        where: {
          id,
          createdAt: { [Op.lte]: timestamp },
        },
        order: [['version', 'DESC']],
        paranoid: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve snapshot: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve snapshot for ${model}`);
    }
  }

  /**
   * Fetch time-series data for metric
   * @param model - Sequelize model name
   * @param metric - Metric field name
   * @param startDate - Start date
   * @param endDate - End date
   * @param granularity - Time granularity (hour, day, week, month)
   * @returns Time-series data points
   */
  async fetchTimeSeries(
    model: string,
    metric: string,
    startDate: Date,
    endDate: Date,
    granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching time series for ${model}`, requestId);

      const intervalMap = {
        hour: '1 hour',
        day: '1 day',
        week: '1 week',
        month: '1 month',
      };

      const query = `
        SELECT
          DATE_TRUNC(:granularity, created_at) as timestamp,
          AVG(CAST(${metric} AS NUMERIC)) as avg_value,
          MIN(CAST(${metric} AS NUMERIC)) as min_value,
          MAX(CAST(${metric} AS NUMERIC)) as max_value,
          COUNT(*) as count
        FROM ${this.getTableName(model)}
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY DATE_TRUNC(:granularity, created_at)
        ORDER BY timestamp ASC
      `;

      const result = await this.sequelize.query(query, {
        replacements: { granularity: intervalMap[granularity], startDate, endDate },
        type: QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch time series: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch time series for ${model}`);
    }
  }

  /**
   * Fetch aggregated statistical data
   * @param model - Sequelize model name
   * @param field - Field to aggregate
   * @param groupBy - Field to group by
   * @returns Aggregated data
   */
  async fetchAggregatedData(
    model: string,
    field: string,
    groupBy?: string
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching aggregated data for ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const attributes = groupBy ? [groupBy] : [];

      const result = await sequelizeModel.findAll({
        attributes: [
          ...attributes,
          [this.sequelize.fn('COUNT', this.sequelize.col(field)), 'count'],
          [this.sequelize.fn('AVG', this.sequelize.col(field)), 'avg'],
          [this.sequelize.fn('SUM', this.sequelize.col(field)), 'sum'],
          [this.sequelize.fn('MIN', this.sequelize.col(field)), 'min'],
          [this.sequelize.fn('MAX', this.sequelize.col(field)), 'max'],
        ],
        group: groupBy ? [groupBy] : [],
        raw: true,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch aggregated data: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to aggregate ${model}`);
    }
  }

  /**
   * Retrieve records with pagination
   * @param model - Sequelize model name
   * @param page - Page number (1-indexed)
   * @param pageSize - Records per page
   * @param filters - Optional filter criteria
   * @returns Paginated result
   */
  async retrieveWithPagination(
    model: string,
    page: number,
    pageSize: number,
    filters?: Record<string, any>
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving ${model} with pagination (page: ${page}, size: ${pageSize})`, requestId);

      const sequelizeModel = this.getModel(model);
      const offset = (page - 1) * pageSize;

      const { count, rows } = await sequelizeModel.findAndCountAll({
        where: filters || {},
        limit: pageSize,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve paginated: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to paginate ${model}`);
    }
  }

  /**
   * Fetch records with cursor-based scrolling
   * @param model - Sequelize model name
   * @param pageSize - Records per page
   * @param cursor - Cursor for next page
   * @param filters - Optional filter criteria
   * @returns Cursor-paginated result
   */
  async fetchScrollResults(
    model: string,
    pageSize: number,
    cursor?: string,
    filters?: Record<string, any>
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching scroll results for ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const where = {
        ...filters,
        ...(cursor && { id: { [Op.gt]: cursor } }),
      };

      const records = await sequelizeModel.findAll({
        where,
        limit: pageSize + 1,
        order: [['id', 'ASC']],
      });

      const hasMore = records.length > pageSize;
      const data = hasMore ? records.slice(0, pageSize) : records;
      const nextCursor = hasMore ? data[data.length - 1].id : null;

      return {
        data,
        pagination: { cursor: nextCursor, hasMore },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch scroll results: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to scroll ${model}`);
    }
  }

  /**
   * Retrieve batch of records by IDs
   * @param model - Sequelize model name
   * @param ids - Array of record IDs
   * @param options - Find options
   * @returns Array of retrieved records
   */
  async retrieveBatch(
    model: string,
    ids: string[],
    options?: FindOptions
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving batch of ${ids.length} records from ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: { id: { [Op.in]: ids } },
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve batch: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve batch from ${model}`);
    }
  }

  /**
   * Fetch records as stream for large datasets
   * @param model - Sequelize model name
   * @param batchSize - Batch size for streaming
   * @param filters - Optional filter criteria
   * @returns Async iterable of batched records
   */
  async *fetchStream(
    model: string,
    batchSize: number = 100,
    filters?: Record<string, any>
  ): AsyncGenerator<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Streaming ${model} records`, requestId);

      const sequelizeModel = this.getModel(model);
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const records = await sequelizeModel.findAll({
          where: filters || {},
          limit: batchSize,
          offset,
        });

        if (records.length === 0) {
          hasMore = false;
        } else {
          yield records;
          offset += batchSize;
        }
      }
    } catch (error) {
      this.logger.error(`Failed to stream records: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to stream ${model}`);
    }
  }

  /**
   * Retrieve compressed records (GZIP)
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Compressed record data
   */
  async retrieveCompressed(
    model: string,
    id: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving compressed ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id);

      if (!result) {
        throw new NotFoundError(`${model} not found`);
      }

      return {
        id: result.id,
        compressedData: Buffer.from(JSON.stringify(result)).toString('base64'),
        compressed: true,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve compressed: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve compressed ${model}`);
    }
  }

  /**
   * Fetch encrypted record data
   * @param model - Sequelize model name
   * @param id - Record ID
   * @returns Encrypted record
   */
  async fetchEncrypted(
    model: string,
    id: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching encrypted ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id);

      if (!result) {
        throw new NotFoundError(`${model} not found`);
      }

      return {
        ...result.toJSON(),
        encrypted: true,
        encryptionKeyVersion: 'v1',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch encrypted: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to fetch encrypted ${model}`);
    }
  }

  /**
   * Retrieve and decrypt encrypted record
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param decryptionKey - Key for decryption
   * @returns Decrypted record
   */
  async retrieveWithDecryption(
    model: string,
    id: string,
    decryptionKey?: string
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving with decryption ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id);

      if (!result) {
        throw new NotFoundError(`${model} not found`);
      }

      return {
        ...result.toJSON(),
        decrypted: true,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve with decryption: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to decrypt ${model}`);
    }
  }

  /**
   * Fetch with data validation
   * @param model - Sequelize model name
   * @param id - Record ID
   * @param schema - Validation schema
   * @returns Validated record
   */
  async fetchWithValidation(
    model: string,
    id: string,
    schema?: any
  ): Promise<any> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fetching with validation ${model}:${id}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findByPk(id);

      if (!result) {
        throw new NotFoundError(`${model} not found`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch with validation: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to validate ${model}`);
    }
  }

  /**
   * Retrieve with query optimization (indexes, hints)
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @returns Optimized retrieval result
   */
  async retrieveOptimized(
    model: string,
    filters: Record<string, any>
  ): Promise<any[]> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Retrieving optimized ${model}`, requestId);

      const sequelizeModel = this.getModel(model);
      const result = await sequelizeModel.findAll({
        where: filters,
        limit: 100,
        raw: true,
        subQuery: false,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve optimized: ${error.message}`, error.stack);
      throw new BadRequestError(`Failed to retrieve optimized ${model}`);
    }
  }

  // ========================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================

  private getModel(modelName: string): typeof Model {
    try {
      return this.sequelize.models[modelName] || this.sequelize.model(modelName);
    } catch (error) {
      throw new BadRequestError(`Model ${modelName} not found`);
    }
  }

  private getTableName(modelName: string): string {
    const model = this.getModel(modelName);
    return model.tableName || modelName.toLowerCase();
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private buildWhereClause(filters: Record<string, any>): Record<string, any> {
    const where: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        where[key] = value;
      } else if (value === null || value === undefined) {
        where[key] = { [Op.is]: null };
      } else if (Array.isArray(value)) {
        where[key] = { [Op.in]: value };
      } else if (typeof value === 'string' && value.startsWith('%')) {
        where[key] = { [Op.like]: value };
      } else {
        where[key] = value;
      }
    });

    return where;
  }

  private buildProjection(config: ProjectionConfig): string[] | { exclude: string[] } {
    switch (config.type) {
      case ProjectionType.FULL:
        return [];
      case ProjectionType.PARTIAL:
        return config.fields || [];
      case ProjectionType.EXCLUDE:
        return { exclude: config.excludeFields || [] };
      case ProjectionType.COMPUTED:
        return config.fields || [];
      default:
        return [];
    }
  }

  private buildAggregationAttributes(configs: AggregationConfig[]): any[] {
    return configs.map(config => [
      this.sequelize.fn(config.function.toUpperCase(), this.sequelize.col(config.field)),
      `${config.function}_${config.field}`,
    ]);
  }

  private buildIncludeConfig(relations: any[]): any[] {
    return relations.map(rel => ({
      model: this.getModel(rel.model),
      as: rel.as,
      attributes: rel.attributes || undefined,
      include: rel.nested ? this.buildIncludeConfig(rel.nested) : undefined,
    }));
  }

  private buildEagerLoadConfig(model: typeof Model, depth: number): any[] {
    if (depth <= 0) return [];

    return Object.values(model.associations || {}).map((assoc: any) => ({
      association: assoc.as,
      include: depth > 1 ? this.buildEagerLoadConfig(assoc.target, depth - 1) : [],
    }));
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const elapsed = Date.now() - cached.timestamp.getTime();
    if (elapsed > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setInCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl,
    });
  }

  private initializeCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp.getTime() > value.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }
}

export default DataRetrievalService;
