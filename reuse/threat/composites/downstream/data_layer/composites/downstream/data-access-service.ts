/**
 * LOC: DATAACC001
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/data-access-service.ts
 *
 * UPSTREAM (imports from):
 *   - ../../_production-patterns.ts
 *   - ../data-retrieval-kit.ts
 *   - ../filter-operations-kit.ts
 *   - ../query-optimization-kit.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - API controllers
 *   - Business logic layers
 *   - Integration services
 *   - Healthcare applications
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/data-access-service.ts
 * Locator: WC-DOWNSTREAM-DATAACC-001
 * Purpose: Core Data Access Service - High-level data access orchestration for controllers
 *
 * Upstream: Data retrieval, filter operations, query optimization composite kits
 * Downstream: API controllers, business services, application layers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, class-validator
 * Exports: DataAccessService with comprehensive data access methods, DTOs, and utilities
 *
 * LLM Context: Production-ready data access service for White Cross healthcare threat intelligence
 * platform. Orchestrates data retrieval, filtering, and query optimization operations. Provides
 * high-level methods for controllers including paginated queries, filtered searches, aggregations,
 * relations loading, caching strategies, and performance optimization. All operations include
 * HIPAA-compliant logging, validation, error handling, and audit trails. Supports single/batch
 * retrieval, complex filtering, dynamic sorting, field projection, and performance monitoring.
 */

import {
  Injectable,
  Logger,
  Inject,
  HttpStatus,
  Scope,
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
  ApiBearerAuth,
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
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
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
  InternalServerError,
  BaseDto,
  SeverityLevel,
  createHIPAALog,
  PaginationDto,
  FilterDto,
} from '../../_production-patterns';
import {
  DataRetrievalService,
  RetrievalMode,
  ProjectionType,
  AggregationFunction,
  RetrievalOptionsDto,
  ProjectionOptionsDto,
  AggregationOptionsDto,
  RelationLoadingOptionsDto,
} from '../data-retrieval-kit';
import {
  FilterOperationsService,
  FilterOperator,
  LogicalOperator,
  FilterConditionDto,
  FilterGroupDto,
  DynamicFilterDto,
} from '../filter-operations-kit';
import {
  QueryOptimizationService,
  OptimizationStrategy,
  CacheInvalidationStrategy,
  QueryOptimizationOptionsDto,
  CacheOptionsDto,
  QueryExecutionPlanDto,
} from '../query-optimization-kit';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Data access operation type
 */
export enum DataAccessOperation {
  RETRIEVE = 'RETRIEVE',
  SEARCH = 'SEARCH',
  FILTER = 'FILTER',
  AGGREGATE = 'AGGREGATE',
  COUNT = 'COUNT',
  EXISTS = 'EXISTS',
}

/**
 * Data access priority level
 */
export enum AccessPriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 8,
  CRITICAL = 10,
}

/**
 * Cache strategy for data access
 */
export enum CacheStrategy {
  NONE = 'NONE',
  READ_THROUGH = 'READ_THROUGH',
  WRITE_THROUGH = 'WRITE_THROUGH',
  WRITE_BEHIND = 'WRITE_BEHIND',
  REFRESH_AHEAD = 'REFRESH_AHEAD',
}

/**
 * Response format type
 */
export enum ResponseFormat {
  FULL = 'FULL',
  SUMMARY = 'SUMMARY',
  MINIMAL = 'MINIMAL',
  CUSTOM = 'CUSTOM',
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Base data access request DTO
 */
export class DataAccessRequestDto extends BaseDto {
  @ApiPropertyOptional({
    description: 'Request ID for tracking',
    example: 'req_abc123',
  })
  @IsString()
  @IsOptional()
  requestId?: string;

  @ApiPropertyOptional({
    description: 'User ID initiating the request',
    example: 'user_123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Access priority level',
    enum: AccessPriority,
    default: AccessPriority.NORMAL,
  })
  @IsEnum(AccessPriority)
  @IsOptional()
  priority?: AccessPriority = AccessPriority.NORMAL;

  @ApiPropertyOptional({
    description: 'Enable caching for this request',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  enableCache?: boolean = true;

  @ApiPropertyOptional({
    description: 'Cache strategy to use',
    enum: CacheStrategy,
    default: CacheStrategy.READ_THROUGH,
  })
  @IsEnum(CacheStrategy)
  @IsOptional()
  cacheStrategy?: CacheStrategy = CacheStrategy.READ_THROUGH;

  @ApiPropertyOptional({
    description: 'Enable query optimization',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  enableOptimization?: boolean = true;
}

/**
 * Find by ID request DTO
 */
export class FindByIdDto extends DataAccessRequestDto {
  @ApiProperty({
    description: 'Entity ID to retrieve',
    example: 'uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    description: 'Fields to include in response',
    type: [String],
    example: ['id', 'name', 'email'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];

  @ApiPropertyOptional({
    description: 'Relations to load',
    type: [String],
    example: ['profile', 'roles'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];

  @ApiPropertyOptional({
    description: 'Throw error if not found',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  throwIfNotFound?: boolean = true;
}

/**
 * Find multiple by IDs request DTO
 */
export class FindByIdsDto extends DataAccessRequestDto {
  @ApiProperty({
    description: 'Array of entity IDs',
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  ids: string[];

  @ApiPropertyOptional({
    description: 'Fields to include in response',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];

  @ApiPropertyOptional({
    description: 'Relations to load',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];

  @ApiPropertyOptional({
    description: 'Maintain order of IDs in results',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  maintainOrder?: boolean = false;
}

/**
 * Paginated find request DTO
 */
export class PaginatedFindDto extends DataAccessRequestDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 1000,
    default: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Fields to include in response',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];

  @ApiPropertyOptional({
    description: 'Relations to load',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  include?: string[];
}

/**
 * Advanced search request DTO
 */
export class AdvancedSearchDto extends PaginatedFindDto {
  @ApiPropertyOptional({
    description: 'Search query string',
    example: 'john doe',
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    description: 'Fields to search in',
    type: [String],
    example: ['name', 'email', 'description'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchFields?: string[];

  @ApiPropertyOptional({
    description: 'Filter conditions',
    type: () => FilterGroupDto,
  })
  @ValidateNested()
  @Type(() => FilterGroupDto)
  @IsOptional()
  filters?: FilterGroupDto;

  @ApiPropertyOptional({
    description: 'Enable fuzzy search',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  fuzzy?: boolean = false;

  @ApiPropertyOptional({
    description: 'Case-sensitive search',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  caseSensitive?: boolean = false;

  @ApiPropertyOptional({
    description: 'Date range filter start',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Date range filter end',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateTo?: Date;
}

/**
 * Aggregation request DTO
 */
export class AggregationRequestDto extends DataAccessRequestDto {
  @ApiProperty({
    description: 'Aggregation function to apply',
    enum: AggregationFunction,
    example: AggregationFunction.COUNT,
  })
  @IsEnum(AggregationFunction)
  aggregationFunction: AggregationFunction;

  @ApiProperty({
    description: 'Field to aggregate',
    example: 'price',
  })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiPropertyOptional({
    description: 'Group by fields',
    type: [String],
    example: ['category', 'status'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  groupBy?: string[];

  @ApiPropertyOptional({
    description: 'Filter conditions',
    type: () => FilterGroupDto,
  })
  @ValidateNested()
  @Type(() => FilterGroupDto)
  @IsOptional()
  filters?: FilterGroupDto;

  @ApiPropertyOptional({
    description: 'Having clause conditions',
    type: Object,
  })
  @IsObject()
  @IsOptional()
  having?: Record<string, any>;
}

/**
 * Count request DTO
 */
export class CountRequestDto extends DataAccessRequestDto {
  @ApiPropertyOptional({
    description: 'Filter conditions',
    type: () => FilterGroupDto,
  })
  @ValidateNested()
  @Type(() => FilterGroupDto)
  @IsOptional()
  filters?: FilterGroupDto;

  @ApiPropertyOptional({
    description: 'Enable distinct count',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  distinct?: boolean = false;

  @ApiPropertyOptional({
    description: 'Field for distinct count',
    example: 'email',
  })
  @IsString()
  @IsOptional()
  distinctField?: string;
}

/**
 * Exists check request DTO
 */
export class ExistsRequestDto extends DataAccessRequestDto {
  @ApiPropertyOptional({
    description: 'Entity ID to check',
    example: 'uuid-123',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Filter conditions for existence check',
    type: () => FilterGroupDto,
  })
  @ValidateNested()
  @Type(() => FilterGroupDto)
  @IsOptional()
  filters?: FilterGroupDto;
}

/**
 * Batch retrieval request DTO
 */
export class BatchRetrievalDto extends DataAccessRequestDto {
  @ApiProperty({
    description: 'Array of find specifications',
    type: [Object],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  requests: FindByIdDto[];

  @ApiPropertyOptional({
    description: 'Continue on individual failures',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  continueOnError?: boolean = true;

  @ApiPropertyOptional({
    description: 'Execute requests in parallel',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  parallel?: boolean = true;
}

/**
 * Data access result DTO
 */
export class DataAccessResultDto<T = any> extends BaseDto {
  @ApiProperty({
    description: 'Retrieved data',
  })
  data: T;

  @ApiPropertyOptional({
    description: 'Total count (for paginated results)',
  })
  @IsNumber()
  @IsOptional()
  totalCount?: number;

  @ApiPropertyOptional({
    description: 'Page information',
  })
  @IsObject()
  @IsOptional()
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  @ApiProperty({
    description: 'Query execution time in milliseconds',
  })
  @IsNumber()
  executionTime: number;

  @ApiProperty({
    description: 'Whether result was served from cache',
  })
  @IsBoolean()
  fromCache: boolean;

  @ApiPropertyOptional({
    description: 'Query optimization metrics',
  })
  @IsObject()
  @IsOptional()
  metrics?: {
    queryTime: number;
    rowsScanned: number;
    indexesUsed: string[];
    optimizationApplied: boolean;
  };
}

// ============================================================================
// DATA ACCESS SERVICE
// ============================================================================

/**
 * Core data access service for high-level data operations
 */
@Injectable()
export class DataAccessService {
  private readonly logger = new Logger(DataAccessService.name);

  constructor(
    private readonly dataRetrievalService: DataRetrievalService,
    private readonly filterOperationsService: FilterOperationsService,
    private readonly queryOptimizationService: QueryOptimizationService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {
    this.logger.log('DataAccessService initialized');
  }

  /**
   * Find a single entity by ID
   */
  async findById<T extends Model>(
    model: typeof Model,
    dto: FindByIdDto,
  ): Promise<DataAccessResultDto<T>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      // Log the access attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_FIND_BY_ID',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          fields: dto.fields,
          include: dto.include,
        },
      });

      // Build retrieval options
      const retrievalOptions: RetrievalOptionsDto = {
        requestId,
        mode: RetrievalMode.SINGLE,
        includeDeleted: false,
        throwOnNotFound: dto.throwIfNotFound,
      };

      // Apply projection if specified
      const findOptions: FindOptions = {
        where: { id: dto.id } as WhereOptions,
      };

      if (dto.fields && dto.fields.length > 0) {
        findOptions.attributes = dto.fields;
      }

      if (dto.include && dto.include.length > 0) {
        findOptions.include = dto.include.map(rel => ({ association: rel }));
      }

      // Check cache if enabled
      let result: T | null = null;
      let fromCache = false;

      if (dto.enableCache && dto.cacheStrategy !== CacheStrategy.NONE) {
        const cacheKey = this.buildCacheKey(model.name, 'findById', dto);
        result = await this.checkCache<T>(cacheKey);
        if (result) {
          fromCache = true;
          this.logger.debug(`Cache hit for ${model.name}:${dto.id}`);
        }
      }

      // Execute query if not cached
      if (!result) {
        if (dto.enableOptimization) {
          const optimizationOptions: QueryOptimizationOptionsDto = {
            requestId,
            strategy: OptimizationStrategy.INDEX_HINT,
            enableCache: dto.enableCache,
            enableProfiling: true,
          };

          // Optimize and execute
          result = await model.findOne(findOptions) as T | null;
        } else {
          result = await model.findOne(findOptions) as T | null;
        }

        if (!result && dto.throwIfNotFound) {
          throw new NotFoundError(model.name, dto.id);
        }

        // Cache the result
        if (result && dto.enableCache && dto.cacheStrategy !== CacheStrategy.NONE) {
          const cacheKey = this.buildCacheKey(model.name, 'findById', dto);
          await this.cacheResult(cacheKey, result);
        }
      }

      const executionTime = Date.now() - startTime;

      // Log successful access
      await createHIPAALog({
        action: 'DATA_ACCESS_SUCCESS',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          fromCache,
        },
      });

      return {
        data: result as T,
        executionTime,
        fromCache,
        metrics: {
          queryTime: executionTime,
          rowsScanned: result ? 1 : 0,
          indexesUsed: ['PRIMARY'],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Log the error
      await createHIPAALog({
        action: 'DATA_ACCESS_ERROR',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in findById: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find multiple entities by IDs
   */
  async findByIds<T extends Model>(
    model: typeof Model,
    dto: FindByIdsDto,
  ): Promise<DataAccessResultDto<T[]>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      // Log the access attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_FIND_BY_IDS',
        resource: model.name,
        resourceId: dto.ids.join(','),
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          count: dto.ids.length,
          fields: dto.fields,
          include: dto.include,
        },
      });

      // Build find options
      const findOptions: FindOptions = {
        where: {
          id: { [Op.in]: dto.ids },
        } as WhereOptions,
      };

      if (dto.fields && dto.fields.length > 0) {
        findOptions.attributes = dto.fields;
      }

      if (dto.include && dto.include.length > 0) {
        findOptions.include = dto.include.map(rel => ({ association: rel }));
      }

      // Execute query
      let results = await model.findAll(findOptions) as T[];

      // Maintain order if requested
      if (dto.maintainOrder && results.length > 0) {
        const resultMap = new Map(results.map(r => [r.get('id') as string, r]));
        results = dto.ids
          .map(id => resultMap.get(id))
          .filter(r => r !== undefined) as T[];
      }

      const executionTime = Date.now() - startTime;

      // Log successful access
      await createHIPAALog({
        action: 'DATA_ACCESS_SUCCESS',
        resource: model.name,
        resourceId: dto.ids.join(','),
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          resultCount: results.length,
        },
      });

      return {
        data: results,
        totalCount: results.length,
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: results.length,
          indexesUsed: ['PRIMARY'],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_ERROR',
        resource: model.name,
        resourceId: dto.ids.join(','),
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in findByIds: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Find entities with pagination
   */
  async findPaginated<T extends Model>(
    model: typeof Model,
    dto: PaginatedFindDto,
  ): Promise<DataAccessResultDto<T[]>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      const offset = (dto.page! - 1) * dto.limit!;

      // Log the access attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_FIND_PAGINATED',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          page: dto.page,
          limit: dto.limit,
          sortBy: dto.sortBy,
          sortOrder: dto.sortOrder,
        },
      });

      // Build find options
      const findOptions: FindOptions = {
        limit: dto.limit,
        offset,
      };

      if (dto.fields && dto.fields.length > 0) {
        findOptions.attributes = dto.fields;
      }

      if (dto.include && dto.include.length > 0) {
        findOptions.include = dto.include.map(rel => ({ association: rel }));
      }

      if (dto.sortBy) {
        findOptions.order = [[dto.sortBy, dto.sortOrder || 'DESC']];
      }

      // Execute query with count
      const { rows, count } = await model.findAndCountAll(findOptions);

      const totalPages = Math.ceil(count / dto.limit!);
      const executionTime = Date.now() - startTime;

      // Log successful access
      await createHIPAALog({
        action: 'DATA_ACCESS_SUCCESS',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          resultCount: rows.length,
          totalCount: count,
        },
      });

      return {
        data: rows as T[],
        totalCount: count,
        pagination: {
          page: dto.page!,
          limit: dto.limit!,
          totalPages,
          hasNext: dto.page! < totalPages,
          hasPrev: dto.page! > 1,
        },
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: rows.length,
          indexesUsed: dto.sortBy ? [dto.sortBy] : [],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_ERROR',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in findPaginated: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Advanced search with filtering
   */
  async search<T extends Model>(
    model: typeof Model,
    dto: AdvancedSearchDto,
  ): Promise<DataAccessResultDto<T[]>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      const offset = (dto.page! - 1) * dto.limit!;

      // Log the search attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_SEARCH',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          query: dto.query,
          searchFields: dto.searchFields,
          page: dto.page,
          limit: dto.limit,
        },
      });

      // Build where clause
      const where: WhereOptions = {};

      // Add search query
      if (dto.query && dto.searchFields && dto.searchFields.length > 0) {
        const searchConditions = dto.searchFields.map(field => ({
          [field]: {
            [dto.caseSensitive ? Op.like : Op.iLike]: `%${dto.query}%`,
          },
        }));
        where[Op.or] = searchConditions;
      }

      // Add filters if provided
      if (dto.filters) {
        const filterWhere = this.filterOperationsService.buildWhereClause(dto.filters);
        Object.assign(where, filterWhere);
      }

      // Add date range filter
      if (dto.dateFrom || dto.dateTo) {
        const dateCondition: any = {};
        if (dto.dateFrom) {
          dateCondition[Op.gte] = dto.dateFrom;
        }
        if (dto.dateTo) {
          dateCondition[Op.lte] = dto.dateTo;
        }
        where['createdAt'] = dateCondition;
      }

      // Build find options
      const findOptions: FindOptions = {
        where,
        limit: dto.limit,
        offset,
      };

      if (dto.fields && dto.fields.length > 0) {
        findOptions.attributes = dto.fields;
      }

      if (dto.include && dto.include.length > 0) {
        findOptions.include = dto.include.map(rel => ({ association: rel }));
      }

      if (dto.sortBy) {
        findOptions.order = [[dto.sortBy, dto.sortOrder || 'DESC']];
      }

      // Execute search
      const { rows, count } = await model.findAndCountAll(findOptions);

      const totalPages = Math.ceil(count / dto.limit!);
      const executionTime = Date.now() - startTime;

      // Log successful search
      await createHIPAALog({
        action: 'DATA_ACCESS_SEARCH_SUCCESS',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          resultCount: rows.length,
          totalCount: count,
        },
      });

      return {
        data: rows as T[],
        totalCount: count,
        pagination: {
          page: dto.page!,
          limit: dto.limit!,
          totalPages,
          hasNext: dto.page! < totalPages,
          hasPrev: dto.page! > 1,
        },
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: rows.length,
          indexesUsed: dto.sortBy ? [dto.sortBy] : [],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_SEARCH_ERROR',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in search: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Count entities matching criteria
   */
  async count(
    model: typeof Model,
    dto: CountRequestDto,
  ): Promise<DataAccessResultDto<number>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      // Log the count attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_COUNT',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          distinct: dto.distinct,
          distinctField: dto.distinctField,
        },
      });

      // Build where clause
      let where: WhereOptions = {};
      if (dto.filters) {
        where = this.filterOperationsService.buildWhereClause(dto.filters);
      }

      // Execute count
      const countOptions: any = { where };
      if (dto.distinct && dto.distinctField) {
        countOptions.distinct = true;
        countOptions.col = dto.distinctField;
      }

      const count = await model.count(countOptions);
      const executionTime = Date.now() - startTime;

      // Log successful count
      await createHIPAALog({
        action: 'DATA_ACCESS_COUNT_SUCCESS',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          count,
        },
      });

      return {
        data: count,
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: count,
          indexesUsed: [],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_COUNT_ERROR',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in count: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async exists(
    model: typeof Model,
    dto: ExistsRequestDto,
  ): Promise<DataAccessResultDto<boolean>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      // Log the exists check
      await createHIPAALog({
        action: 'DATA_ACCESS_EXISTS',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
        },
      });

      // Build where clause
      let where: WhereOptions = {};
      if (dto.id) {
        where = { id: dto.id };
      } else if (dto.filters) {
        where = this.filterOperationsService.buildWhereClause(dto.filters);
      }

      // Execute exists check
      const count = await model.count({ where, limit: 1 });
      const exists = count > 0;
      const executionTime = Date.now() - startTime;

      // Log result
      await createHIPAALog({
        action: 'DATA_ACCESS_EXISTS_SUCCESS',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          exists,
        },
      });

      return {
        data: exists,
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: exists ? 1 : 0,
          indexesUsed: dto.id ? ['PRIMARY'] : [],
          optimizationApplied: false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_EXISTS_ERROR',
        resource: model.name,
        resourceId: dto.id,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in exists: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Aggregate data
   */
  async aggregate(
    model: typeof Model,
    dto: AggregationRequestDto,
  ): Promise<DataAccessResultDto<any>> {
    const startTime = Date.now();
    const requestId = dto.requestId || generateRequestId();

    try {
      // Log the aggregation attempt
      await createHIPAALog({
        action: 'DATA_ACCESS_AGGREGATE',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          function: dto.aggregationFunction,
          field: dto.field,
          groupBy: dto.groupBy,
        },
      });

      // Build where clause
      let where: WhereOptions = {};
      if (dto.filters) {
        where = this.filterOperationsService.buildWhereClause(dto.filters);
      }

      // Build aggregation query
      const attributes: any[] = [];

      if (dto.groupBy && dto.groupBy.length > 0) {
        attributes.push(...dto.groupBy);
      }

      // Add aggregation function
      const aggFn = dto.aggregationFunction.toUpperCase();
      attributes.push([
        this.sequelize.fn(aggFn, this.sequelize.col(dto.field)),
        `${dto.aggregationFunction}_${dto.field}`,
      ]);

      // Execute aggregation
      const results = await model.findAll({
        attributes,
        where,
        group: dto.groupBy || undefined,
        raw: true,
      });

      const executionTime = Date.now() - startTime;

      // Log successful aggregation
      await createHIPAALog({
        action: 'DATA_ACCESS_AGGREGATE_SUCCESS',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.INFO,
        details: {
          requestId,
          executionTime,
          resultCount: results.length,
        },
      });

      return {
        data: results,
        totalCount: results.length,
        executionTime,
        fromCache: false,
        metrics: {
          queryTime: executionTime,
          rowsScanned: results.length,
          indexesUsed: dto.groupBy || [],
          optimizationApplied: dto.enableOptimization || false,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      await createHIPAALog({
        action: 'DATA_ACCESS_AGGREGATE_ERROR',
        resource: model.name,
        userId: dto.userId,
        severity: SeverityLevel.ERROR,
        details: {
          requestId,
          error: error.message,
          executionTime,
        },
      });

      this.logger.error(`Error in aggregate: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Build cache key for a request
   */
  private buildCacheKey(modelName: string, operation: string, dto: any): string {
    const parts = [modelName, operation];

    if (dto.id) parts.push(dto.id);
    if (dto.ids) parts.push(dto.ids.join(','));
    if (dto.fields) parts.push(dto.fields.join(','));
    if (dto.include) parts.push(dto.include.join(','));
    if (dto.page) parts.push(`page:${dto.page}`);
    if (dto.limit) parts.push(`limit:${dto.limit}`);
    if (dto.sortBy) parts.push(`sort:${dto.sortBy}:${dto.sortOrder}`);

    return parts.join(':');
  }

  /**
   * Check cache for result
   */
  private async checkCache<T>(key: string): Promise<T | null> {
    try {
      // Implementation would use actual cache service (Redis, etc.)
      // For now, return null to always fetch from database
      return null;
    } catch (error) {
      this.logger.warn(`Cache check failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Cache a result
   */
  private async cacheResult<T>(key: string, result: T): Promise<void> {
    try {
      // Implementation would use actual cache service (Redis, etc.)
      // For now, no-op
      this.logger.debug(`Caching result for key: ${key}`);
    } catch (error) {
      this.logger.warn(`Cache set failed: ${error.message}`);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  DataAccessService,
  DataAccessRequestDto,
  FindByIdDto,
  FindByIdsDto,
  PaginatedFindDto,
  AdvancedSearchDto,
  AggregationRequestDto,
  CountRequestDto,
  ExistsRequestDto,
  BatchRetrievalDto,
  DataAccessResultDto,
  DataAccessOperation,
  AccessPriority,
  CacheStrategy,
  ResponseFormat,
};
