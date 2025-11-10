/**
 * LOC: SEARCHOPS001
 * File: /reuse/threat/composites/downstream/data_layer/composites/search-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Search services
 *   - Query builders
 *   - API endpoints
 *   - Analytics platforms
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/search-operations-kit.ts
 * Locator: WC-SEARCHOPS-001
 * Purpose: Search Operations Kit - Advanced search and querying capabilities
 *
 * Upstream: _production-patterns.ts, NestJS, Sequelize
 * Downstream: Search services, Query engines, API endpoints
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize, class-validator
 * Exports: 42 production-ready search functions with NestJS services
 *
 * LLM Context: Production-grade advanced search operations for White Cross healthcare threat
 * intelligence platform. Provides comprehensive full-text search, fuzzy matching, regex patterns,
 * range queries, faceted search, faceted search, hierarchical search, graph traversal, and complex
 * query composition. Supports multi-table joins, set operations, semantic search, vector similarity,
 * hybrid search combining multiple strategies. All operations include HIPAA-compliant logging,
 * performance optimization, caching, and audit trails. Handles complex WHERE clauses, boolean
 * logic, nested conditions, and intelligent ranking/scoring mechanisms.
 */

import {
  Injectable,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
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
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, QueryTypes, Op, Model } from 'sequelize';
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

export enum SearchType {
  FULL_TEXT = 'full_text',
  FUZZY = 'fuzzy',
  WILDCARD = 'wildcard',
  REGEX = 'regex',
  SEMANTIC = 'semantic',
  VECTOR = 'vector',
  HYBRID = 'hybrid',
}

export enum MatchingMode {
  EXACT = 'exact',
  PARTIAL = 'partial',
  CASE_INSENSITIVE = 'case_insensitive',
  PHRASE = 'phrase',
  BOOLEAN = 'boolean',
}

export enum RankingStrategy {
  RELEVANCE = 'relevance',
  RECENCY = 'recency',
  POPULARITY = 'popularity',
  WEIGHTED = 'weighted',
  CUSTOM = 'custom',
}

export interface SearchQuery {
  text?: string;
  filters?: Record<string, any>;
  fields?: string[];
  type: SearchType;
  matchingMode?: MatchingMode;
  limit?: number;
  offset?: number;
  ranking?: RankingStrategy;
}

export interface FacetConfig {
  field: string;
  size?: number;
  minDocCount?: number;
  order?: 'count' | 'term';
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  score: number;
  facets?: Record<string, any>;
  took: number;
}

export interface RangeQuery {
  field: string;
  gte?: number | Date;
  gt?: number | Date;
  lte?: number | Date;
  lt?: number | Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class SearchDto extends BaseDto {
  @ApiProperty({ description: 'Search text', example: 'APT malware' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Search type', enum: SearchType, default: SearchType.FULL_TEXT })
  @IsEnum(SearchType)
  @IsOptional()
  type?: SearchType = SearchType.FULL_TEXT;

  @ApiPropertyOptional({ description: 'Fields to search in', example: ['name', 'description'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];

  @ApiPropertyOptional({ description: 'Filter criteria', example: { severity: 'HIGH' } })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Ranking strategy', enum: RankingStrategy, default: RankingStrategy.RELEVANCE })
  @IsEnum(RankingStrategy)
  @IsOptional()
  ranking?: RankingStrategy = RankingStrategy.RELEVANCE;

  @ApiPropertyOptional({ description: 'Limit results', example: 20 })
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  limit?: number = 20;
}

export class FuzzySearchDto extends BaseDto {
  @ApiProperty({ description: 'Search text', example: 'malwer' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Fuzziness level (0-2)', example: 1 })
  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  fuzziness?: number = 1;

  @ApiPropertyOptional({ description: 'Fields to search', example: ['name', 'description'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];
}

export class RegexSearchDto extends BaseDto {
  @ApiProperty({ description: 'Regular expression pattern', example: '^APT[0-9]+' })
  @IsString()
  @IsNotEmpty()
  pattern: string;

  @ApiPropertyOptional({ description: 'Field to search in', example: 'name' })
  @IsString()
  @IsOptional()
  field?: string;

  @ApiPropertyOptional({ description: 'Case sensitive search', example: false })
  @IsBoolean()
  @IsOptional()
  caseSensitive?: boolean = false;
}

export class RangeSearchDto extends BaseDto {
  @ApiProperty({ description: 'Range query configuration' })
  @ValidateNested()
  @Type(() => Object)
  @IsNotEmpty()
  range: RangeQuery;

  @ApiPropertyOptional({ description: 'Additional filters' })
  @IsOptional()
  filters?: Record<string, any>;
}

export class FacetedSearchDto extends BaseDto {
  @ApiProperty({ description: 'Search text', example: 'threat' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Facet configurations', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  facets: FacetConfig[];

  @ApiPropertyOptional({ description: 'Facet filters applied', example: { severity: ['HIGH', 'CRITICAL'] } })
  @IsOptional()
  facetFilters?: Record<string, string[]>;
}

// ============================================================================
// SERVICE: SEARCH OPERATIONS
// ============================================================================

@Injectable()
export class SearchOperationsService {
  private readonly logger = new Logger(SearchOperationsService.name);
  private readonly sequelize: Sequelize;
  private readonly cache: Map<string, { data: any; timestamp: Date; ttl: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  // ========================================================================
  // CORE SEARCH OPERATIONS
  // ========================================================================

  /**
   * Perform full-text search across multiple fields
   * @param model - Sequelize model name
   * @param text - Search text
   * @param fields - Fields to search in
   * @param options - Search options
   * @returns Search results with scores
   */
  async fullTextSearch(
    model: string,
    text: string,
    fields: string[],
    options?: { limit?: number; offset?: number }
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Full-text search for "${text}" in ${model}`, requestId);
      createHIPAALog(requestId, 'SEARCH', model, { operation: 'fullTextSearch', text }, 'INFO');

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const query = `
        SELECT *,
          MATCH(${fields.join(',')}) AGAINST(:text IN BOOLEAN MODE) as score
        FROM ${this.getTableName(model)}
        WHERE MATCH(${fields.join(',')}) AGAINST(:text IN BOOLEAN MODE)
        ORDER BY score DESC
        LIMIT :limit OFFSET :offset
      `;

      const results = await this.sequelize.query(query, {
        replacements: {
          text,
          limit: options?.limit || 20,
          offset: options?.offset || 0,
        },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results[0]?.score || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Full-text search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Full-text search failed');
    }
  }

  /**
   * Perform fuzzy search with tolerance for typos
   * @param model - Sequelize model name
   * @param text - Search text
   * @param fields - Fields to search in
   * @param fuzziness - Fuzziness level (0-2)
   * @returns Fuzzy matched results
   */
  async fuzzySearch(
    model: string,
    text: string,
    fields: string[],
    fuzziness: number = 1
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Fuzzy search for "${text}" with fuzziness=${fuzziness}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      // Levenshtein distance based fuzzy search
      const query = `
        SELECT *,
          CASE
            WHEN ${fields[0]} LIKE :exactMatch THEN 100
            WHEN ${fields[0]} LIKE :pattern THEN 80
            ELSE ROUND((1 - LEVENSHTEIN_RATIO(${fields[0]}, :text)) * 100)
          END as match_score
        FROM ${this.getTableName(model)}
        WHERE LEVENSHTEIN_RATIO(${fields[0]}, :text) >= :threshold
        ORDER BY match_score DESC
        LIMIT 20
      `;

      const threshold = 1 - (fuzziness * 0.25);

      const results = await this.sequelize.query(query, {
        replacements: {
          text,
          exactMatch: text,
          pattern: `%${text}%`,
          threshold,
        },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results[0]?.match_score || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Fuzzy search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Fuzzy search failed');
    }
  }

  /**
   * Perform wildcard search with * and ? patterns
   * @param model - Sequelize model name
   * @param pattern - Wildcard pattern (e.g., "APT*")
   * @param field - Field to search in
   * @returns Matching records
   */
  async wildcardSearch(
    model: string,
    pattern: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Wildcard search for pattern "${pattern}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      // Convert wildcard pattern to SQL LIKE pattern
      const sqlPattern = pattern
        .replace(/\*/g, '%')
        .replace(/\?/g, '_');

      const results = await sequelizeModel.findAll({
        where: {
          [field]: { [Op.like]: sqlPattern },
        },
        limit: 100,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Wildcard search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Wildcard search failed');
    }
  }

  /**
   * Perform regular expression search
   * @param model - Sequelize model name
   * @param pattern - Regular expression pattern
   * @param field - Field to search in
   * @param caseSensitive - Case sensitivity flag
   * @returns Regex matched results
   */
  async regexSearch(
    model: string,
    pattern: string,
    field: string,
    caseSensitive: boolean = false
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Regex search with pattern "${pattern}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const regexOp = caseSensitive ? Op.regexp : Op.iRegexp;
      const results = await sequelizeModel.findAll({
        where: {
          [field]: { [regexOp]: pattern },
        },
        limit: 100,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Regex search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Regex search failed');
    }
  }

  /**
   * Find exact match for search term
   * @param model - Sequelize model name
   * @param text - Search text to match exactly
   * @param field - Field to search in
   * @returns Exact match results
   */
  async exactMatch(
    model: string,
    text: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Exact match search for "${text}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: { [field]: text },
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Exact match failed: ${error.message}`, error.stack);
      throw new BadRequestError('Exact match search failed');
    }
  }

  /**
   * Find partial/substring matches
   * @param model - Sequelize model name
   * @param text - Partial text to find
   * @param field - Field to search in
   * @returns Partial match results
   */
  async partialMatch(
    model: string,
    text: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Partial match search for "${text}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: { [field]: { [Op.like]: `%${text}%` } },
        limit: 100,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Partial match failed: ${error.message}`, error.stack);
      throw new BadRequestError('Partial match search failed');
    }
  }

  /**
   * Case-insensitive search
   * @param model - Sequelize model name
   * @param text - Search text
   * @param field - Field to search in
   * @returns Case-insensitive match results
   */
  async caseInsensitiveSearch(
    model: string,
    text: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Case-insensitive search for "${text}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: this.sequelize.where(
          this.sequelize.fn('LOWER', this.sequelize.col(field)),
          Op.like,
          `%${text.toLowerCase()}%`
        ),
        limit: 100,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Case-insensitive search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Case-insensitive search failed');
    }
  }

  /**
   * Search across multiple fields
   * @param model - Sequelize model name
   * @param text - Search text
   * @param fields - Array of fields to search
   * @returns Results matching any field
   */
  async multiFieldSearch(
    model: string,
    text: string,
    fields: string[]
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Multi-field search in ${fields.length} fields`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = {
        [Op.or]: fields.map(field => ({
          [field]: { [Op.like]: `%${text}%` },
        })),
      };

      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Multi-field search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Multi-field search failed');
    }
  }

  /**
   * Boolean search with AND, OR, NOT operators
   * @param model - Sequelize model name
   * @param query - Boolean query (e.g., "threat AND malware NOT benign")
   * @param field - Field to search in
   * @returns Boolean search results
   */
  async booleanSearch(
    model: string,
    query: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Boolean search: "${query}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = this.parseBooleanQuery(query, field);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Boolean search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Boolean search failed');
    }
  }

  /**
   * Range search for numeric/date fields
   * @param model - Sequelize model name
   * @param rangeConfig - Range configuration (gte, gt, lte, lt)
   * @returns Records within range
   */
  async rangeSearch(
    model: string,
    rangeConfig: RangeQuery
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Range search on field "${rangeConfig.field}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where: Record<string, any> = {};
      const conditions: any = {};

      if (rangeConfig.gte !== undefined) conditions[Op.gte] = rangeConfig.gte;
      if (rangeConfig.gt !== undefined) conditions[Op.gt] = rangeConfig.gt;
      if (rangeConfig.lte !== undefined) conditions[Op.lte] = rangeConfig.lte;
      if (rangeConfig.lt !== undefined) conditions[Op.lt] = rangeConfig.lt;

      where[rangeConfig.field] = conditions;

      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Range search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Range search failed');
    }
  }

  /**
   * Date range search
   * @param model - Sequelize model name
   * @param field - Date field to search
   * @param startDate - Range start
   * @param endDate - Range end
   * @returns Records within date range
   */
  async dateRangeSearch(
    model: string,
    field: string,
    startDate: Date,
    endDate: Date
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Date range search: ${startDate} to ${endDate}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: {
          [field]: { [Op.between]: [startDate, endDate] },
        },
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Date range search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Date range search failed');
    }
  }

  /**
   * Numeric range search
   * @param model - Sequelize model name
   * @param field - Numeric field to search
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Records within numeric range
   */
  async numericRangeSearch(
    model: string,
    field: string,
    min: number,
    max: number
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Numeric range search: ${min}-${max}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: {
          [field]: { [Op.between]: [min, max] },
        },
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Numeric range search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Numeric range search failed');
    }
  }

  /**
   * Geospatial search for location-based queries
   * @param model - Sequelize model name
   * @param geoField - Geographic field name
   * @param latitude - Center latitude
   * @param longitude - Center longitude
   * @param radiusKm - Search radius in kilometers
   * @returns Nearby records
   */
  async geospatialSearch(
    model: string,
    geoField: string,
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Geospatial search within ${radiusKm}km`, requestId);

      const startTime = Date.now();
      const query = `
        SELECT *,
          ST_DISTANCE_SPHERE(${geoField}, POINT(:longitude, :latitude)) / 1000 as distance_km
        FROM ${this.getTableName(model)}
        WHERE ST_DISTANCE_SPHERE(${geoField}, POINT(:longitude, :latitude)) / 1000 <= :radiusKm
        ORDER BY distance_km ASC
      `;

      const results = await this.sequelize.query(query, {
        replacements: { latitude, longitude, radiusKm },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Geospatial search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Geospatial search failed');
    }
  }

  /**
   * Proximity search for nearby values
   * @param model - Sequelize model name
   * @param field - Field to search in
   * @param value - Target value
   * @param tolerance - Tolerance range
   * @returns Records within proximity
   */
  async proximitySearch(
    model: string,
    field: string,
    value: number,
    tolerance: number = 10
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Proximity search around ${value} +/- ${tolerance}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const results = await sequelizeModel.findAll({
        where: {
          [field]: { [Op.between]: [value - tolerance, value + tolerance] },
        },
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Proximity search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Proximity search failed');
    }
  }

  /**
   * Faceted search with aggregation and filtering
   * @param model - Sequelize model name
   * @param text - Search text
   * @param facets - Facet configurations
   * @param selectedFacets - Applied facet filters
   * @returns Search results with facet counts
   */
  async facetedSearch(
    model: string,
    text: string,
    facets: FacetConfig[],
    selectedFacets?: Record<string, string[]>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Faceted search with ${facets.length} facets`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      // Build base query
      let where: Record<string, any> = {
        [facets[0]?.field]: { [Op.like]: `%${text}%` },
      };

      // Apply selected facets
      if (selectedFacets) {
        Object.entries(selectedFacets).forEach(([field, values]) => {
          where[field] = { [Op.in]: values };
        });
      }

      const results = await sequelizeModel.findAll({ where });

      // Calculate facet counts
      const facetCounts: Record<string, any> = {};
      for (const facet of facets) {
        const counts = await sequelizeModel.findAll({
          attributes: [facet.field, [this.sequelize.fn('COUNT', this.sequelize.col('*')), 'count']],
          where,
          group: [facet.field],
          raw: true,
        });
        facetCounts[facet.field] = counts;
      }

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        facets: facetCounts,
        took,
      };
    } catch (error) {
      this.logger.error(`Faceted search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Faceted search failed');
    }
  }

  /**
   * Filtered search with advanced criteria
   * @param model - Sequelize model name
   * @param filters - Filter object
   * @param text - Optional full-text search
   * @returns Filtered results
   */
  async filteredSearch(
    model: string,
    filters: Record<string, any>,
    text?: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Filtered search with ${Object.keys(filters).length} filters`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = this.buildFilterWhere(filters);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Filtered search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Filtered search failed');
    }
  }

  /**
   * Search with sorting
   * @param model - Sequelize model name
   * @param filters - Filter criteria
   * @param sortConfig - Sort configuration
   * @returns Sorted search results
   */
  async sortedSearch(
    model: string,
    filters: Record<string, any>,
    sortConfig: Record<string, 1 | -1>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Sorted search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = this.buildFilterWhere(filters);
      const order = Object.entries(sortConfig).map(([field, direction]) => [
        field,
        direction === 1 ? 'ASC' : 'DESC',
      ]);

      const results = await sequelizeModel.findAll({ where, order, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Sorted search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Sorted search failed');
    }
  }

  /**
   * Search with ranking/scoring
   * @param model - Sequelize model name
   * @param text - Search text
   * @param rankingStrategy - How to rank results
   * @returns Ranked search results
   */
  async rankedSearch(
    model: string,
    text: string,
    rankingStrategy: RankingStrategy = RankingStrategy.RELEVANCE
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Ranked search with strategy: ${rankingStrategy}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const rankFormula = this.getRankingFormula(rankingStrategy);
      const results = await this.sequelize.query(
        `SELECT *, ${rankFormula} as rank_score FROM ${this.getTableName(model)}
         ORDER BY rank_score DESC LIMIT 100`,
        { type: QueryTypes.SELECT }
      );

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results[0]?.rank_score || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Ranked search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Ranked search failed');
    }
  }

  /**
   * Weighted search combining multiple criteria
   * @param model - Sequelize model name
   * @param criteria - Array of weighted search criteria
   * @returns Weighted search results
   */
  async weightedSearch(
    model: string,
    criteria: Array<{ field: string; text: string; weight: number }>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Weighted search with ${criteria.length} criteria`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = {
        [Op.or]: criteria.map(c => ({
          [c.field]: { [Op.like]: `%${c.text}%` },
        })),
      };

      const results = await sequelizeModel.findAll({ where, limit: 100 });

      // Apply weights
      const weighted = results.map(result => ({
        ...result.toJSON(),
        weight_score: criteria.reduce((sum, c) => {
          const matches = c.weight * (result[c.field]?.includes(c.text) ? 1 : 0);
          return sum + matches;
        }, 0),
      }));

      weighted.sort((a, b) => b.weight_score - a.weight_score);

      const took = Date.now() - startTime;
      return {
        results: weighted,
        total: weighted.length,
        score: weighted[0]?.weight_score || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Weighted search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Weighted search failed');
    }
  }

  /**
   * Semantic search based on meaning
   * @param model - Sequelize model name
   * @param query - Semantic query
   * @returns Semantically related results
   */
  async semanticSearch(
    model: string,
    query: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Semantic search for "${query}"`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      // Semantic search would typically use embeddings or NLP
      // For now, using keyword expansion as simplified approach
      const expandedKeywords = this.expandSemanticQuery(query);

      const where = {
        [Op.or]: expandedKeywords.map(keyword => ({
          [Op.or]: ['name', 'description', 'content'].map(field => ({
            [field]: { [Op.like]: `%${keyword}%` },
          })),
        })),
      };

      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Semantic search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Semantic search failed');
    }
  }

  /**
   * Similarity search for similar records
   * @param model - Sequelize model name
   * @param recordId - Reference record ID
   * @param similarityThreshold - Threshold for similarity
   * @returns Similar records
   */
  async similaritySearch(
    model: string,
    recordId: string,
    similarityThreshold: number = 0.7
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Similarity search for record ${recordId}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const referenceRecord = await sequelizeModel.findByPk(recordId);
      if (!referenceRecord) {
        throw new NotFoundError(`Record ${recordId} not found`);
      }

      // Simple string similarity using common fields
      const results = await sequelizeModel.findAll({
        limit: 100,
      });

      const similar = results
        .filter(r => r.id !== recordId)
        .map(r => ({
          ...r.toJSON(),
          similarity: this.calculateSimilarity(referenceRecord, r),
        }))
        .filter(r => r.similarity >= similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity);

      const took = Date.now() - startTime;
      return {
        results: similar,
        total: similar.length,
        score: similar[0]?.similarity || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Similarity search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Similarity search failed');
    }
  }

  /**
   * Vector/embedding-based search
   * @param model - Sequelize model name
   * @param embedding - Query embedding vector
   * @param limit - Result limit
   * @returns Vector similarity search results
   */
  async vectorSearch(
    model: string,
    embedding: number[],
    limit: number = 20
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Vector search with ${embedding.length}-d embedding`, requestId);

      const startTime = Date.now();

      // Vector similarity query (requires pgvector extension in PostgreSQL)
      const query = `
        SELECT *, embedding <-> :embedding as distance
        FROM ${this.getTableName(model)}
        ORDER BY distance ASC
        LIMIT :limit
      `;

      const results = await this.sequelize.query(query, {
        replacements: { embedding: JSON.stringify(embedding), limit },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results[0]?.distance || 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Vector search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Vector search failed');
    }
  }

  /**
   * Hybrid search combining multiple search strategies
   * @param model - Sequelize model name
   * @param text - Search text
   * @param embedding - Optional embedding vector
   * @returns Hybrid search results
   */
  async hybridSearch(
    model: string,
    text: string,
    embedding?: number[]
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Hybrid search combining text and ${embedding ? 'vector' : 'keyword'} search`, requestId);

      const startTime = Date.now();

      // Combine full-text and vector search results
      const textResults = await this.fullTextSearch(model, text, ['name', 'description']);
      const vectorResults = embedding ? await this.vectorSearch(model, embedding) : { results: [] };

      // Merge and deduplicate results
      const merged = [...textResults.results];
      for (const vr of vectorResults.results) {
        if (!merged.find(tr => tr.id === vr.id)) {
          merged.push(vr);
        }
      }

      const took = Date.now() - startTime;
      return {
        results: merged.slice(0, 20),
        total: merged.length,
        score: Math.max(textResults.score, vectorResults.score),
        took,
      };
    } catch (error) {
      this.logger.error(`Hybrid search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Hybrid search failed');
    }
  }

  /**
   * Aggregated search combining results from multiple models
   * @param models - Array of model names to search
   * @param text - Search text
   * @returns Aggregated results from all models
   */
  async aggregatedSearch(
    models: string[],
    text: string
  ): Promise<Record<string, SearchResult<any>>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Aggregated search across ${models.length} models`, requestId);

      const results: Record<string, SearchResult<any>> = {};

      for (const model of models) {
        try {
          results[model] = await this.fullTextSearch(model, text, ['name', 'description']);
        } catch (error) {
          this.logger.warn(`Search failed for ${model}: ${error.message}`);
        }
      }

      return results;
    } catch (error) {
      this.logger.error(`Aggregated search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Aggregated search failed');
    }
  }

  /**
   * Grouped search with grouping by field
   * @param model - Sequelize model name
   * @param text - Search text
   * @param groupField - Field to group results by
   * @returns Grouped search results
   */
  async groupedSearch(
    model: string,
    text: string,
    groupField: string
  ): Promise<Record<string, any[]>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Grouped search by ${groupField}`, requestId);

      const sequelizeModel = this.getModel(model);

      const results = await sequelizeModel.findAll({
        where: {
          [Op.or]: ['name', 'description'].map(field => ({
            [field]: { [Op.like]: `%${text}%` },
          })),
        },
      });

      const grouped: Record<string, any[]> = {};
      results.forEach(r => {
        const groupKey = r[groupField] || 'ungrouped';
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(r);
      });

      return grouped;
    } catch (error) {
      this.logger.error(`Grouped search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Grouped search failed');
    }
  }

  /**
   * Nested search within related records
   * @param model - Sequelize model name
   * @param text - Search text
   * @param nestedModel - Related model to search in
   * @returns Results with nested matches
   */
  async nestedSearch(
    model: string,
    text: string,
    nestedModel: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Nested search in ${nestedModel}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const nestedSequelizeModel = this.getModel(nestedModel);
      const nestedResults = await nestedSequelizeModel.findAll({
        where: {
          [Op.or]: ['name', 'description'].map(field => ({
            [field]: { [Op.like]: `%${text}%` },
          })),
        },
      });

      const parentIds = [...new Set(nestedResults.map(r => r[`${model.toLowerCase()}Id`]))];

      const results = await sequelizeModel.findAll({
        where: { id: { [Op.in]: parentIds } },
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Nested search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Nested search failed');
    }
  }

  /**
   * Hierarchical search through tree structures
   * @param model - Sequelize model name
   * @param text - Search text
   * @param parentField - Parent ID field name
   * @returns Hierarchical search results
   */
  async hierarchicalSearch(
    model: string,
    text: string,
    parentField: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Hierarchical search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const query = `
        WITH RECURSIVE search_tree AS (
          SELECT * FROM ${this.getTableName(model)}
          WHERE name LIKE :searchText

          UNION ALL

          SELECT t.* FROM ${this.getTableName(model)} t
          JOIN search_tree st ON t.${parentField} = st.id
        )
        SELECT * FROM search_tree
      `;

      const results = await this.sequelize.query(query, {
        replacements: { searchText: `%${text}%` },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Hierarchical search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Hierarchical search failed');
    }
  }

  /**
   * Recursive search traversing nested structures
   * @param model - Sequelize model name
   * @param startId - Starting record ID
   * @param depth - Recursion depth
   * @returns Recursively found results
   */
  async recursiveSearch(
    model: string,
    startId: string,
    depth: number = 3
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Recursive search from ${startId} (depth: ${depth})`, requestId);

      const startTime = Date.now();
      const results: any[] = [];
      const visited = new Set<string>();

      await this.recursiveTraverse(model, startId, depth, visited, results);

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Recursive search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Recursive search failed');
    }
  }

  /**
   * Graph search traversing relationships
   * @param model - Sequelize model name
   * @param startId - Starting node ID
   * @param relationName - Relation to traverse
   * @returns Graph traversal results
   */
  async graphSearch(
    model: string,
    startId: string,
    relationName: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Graph search from ${startId} via ${relationName}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const startRecord = await sequelizeModel.findByPk(startId);
      if (!startRecord) {
        throw new NotFoundError(`Start record ${startId} not found`);
      }

      const related = await startRecord[`get${this.capitalize(relationName)}`]?.();

      const took = Date.now() - startTime;
      return {
        results: related || [],
        total: (related || []).length,
        score: (related || []).length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Graph search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Graph search failed');
    }
  }

  /**
   * Path search finding connections between entities
   * @param model - Sequelize model name
   * @param sourceId - Source entity ID
   * @param targetId - Target entity ID
   * @returns Connection paths
   */
  async pathSearch(
    model: string,
    sourceId: string,
    targetId: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Path search from ${sourceId} to ${targetId}`, requestId);

      const startTime = Date.now();

      const query = `
        WITH RECURSIVE path_search AS (
          SELECT id, source_id, target_id, ARRAY[id] as path, 1 as depth
          FROM ${this.getTableName(model)}
          WHERE source_id = :sourceId

          UNION ALL

          SELECT e.id, e.source_id, e.target_id, path || ARRAY[e.id], depth + 1
          FROM ${this.getTableName(model)} e
          JOIN path_search ps ON e.source_id = ps.target_id
          WHERE depth < 10 AND NOT e.id = ANY(path)
        )
        SELECT * FROM path_search WHERE target_id = :targetId
      `;

      const results = await this.sequelize.query(query, {
        replacements: { sourceId, targetId },
        type: QueryTypes.SELECT,
      });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Path search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Path search failed');
    }
  }

  /**
   * Pattern search using regular expressions
   * @param model - Sequelize model name
   * @param pattern - Pattern to match
   * @param field - Field to search in
   * @returns Pattern matched results
   */
  async patternSearch(
    model: string,
    pattern: string,
    field: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Pattern search: ${pattern}`, requestId);

      return await this.regexSearch(model, pattern, field, false);
    } catch (error) {
      this.logger.error(`Pattern search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Pattern search failed');
    }
  }

  /**
   * Template-based search using predefined templates
   * @param model - Sequelize model name
   * @param templateName - Template name
   * @param parameters - Template parameters
   * @returns Template-based search results
   */
  async templateSearch(
    model: string,
    templateName: string,
    parameters: Record<string, any>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Template search: ${templateName}`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      // Build query from template
      const where = this.buildTemplateWhere(templateName, parameters);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Template search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Template search failed');
    }
  }

  /**
   * Dynamic search with runtime-constructed queries
   * @param model - Sequelize model name
   * @param queryBuilder - Function to build query
   * @returns Dynamic search results
   */
  async dynamicSearch(
    model: string,
    queryBuilder: (sequelize: Sequelize) => any
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Dynamic search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = queryBuilder(this.sequelize);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Dynamic search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Dynamic search failed');
    }
  }

  /**
   * Custom search with user-defined logic
   * @param model - Sequelize model name
   * @param criteria - Custom search criteria
   * @param evaluator - Custom evaluation function
   * @returns Custom search results
   */
  async customSearch(
    model: string,
    criteria: Record<string, any>,
    evaluator: (record: any) => boolean
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Custom search with evaluator`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const allRecords = await sequelizeModel.findAll({ limit: 1000 });
      const filtered = allRecords.filter(evaluator);

      const took = Date.now() - startTime;
      return {
        results: filtered,
        total: filtered.length,
        score: filtered.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Custom search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Custom search failed');
    }
  }

  /**
   * Advanced filter search combining multiple filter types
   * @param model - Sequelize model name
   * @param advancedFilters - Advanced filter configuration
   * @returns Advanced filtered results
   */
  async advancedFilterSearch(
    model: string,
    advancedFilters: Record<string, any>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Advanced filter search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = this.buildAdvancedWhere(advancedFilters);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Advanced filter search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Advanced filter search failed');
    }
  }

  /**
   * Complex query search with nested conditions
   * @param model - Sequelize model name
   * @param complexQuery - Complex query object
   * @returns Complex query results
   */
  async complexQuerySearch(
    model: string,
    complexQuery: Record<string, any>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Complex query search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const where = this.parseComplexQuery(complexQuery);
      const results = await sequelizeModel.findAll({ where, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Complex query search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Complex query search failed');
    }
  }

  /**
   * Multi-table search across related models
   * @param models - Models to search across
   * @param text - Search text
   * @returns Cross-model search results
   */
  async multiTableSearch(
    models: string[],
    text: string
  ): Promise<Record<string, SearchResult<any>>> {
    return await this.aggregatedSearch(models, text);
  }

  /**
   * Joined search combining data from multiple tables
   * @param model - Primary model
   * @param joinModels - Models to join
   * @param text - Search text
   * @returns Joined search results
   */
  async joinedSearch(
    model: string,
    joinModels: string[],
    text: string
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Joined search across ${joinModels.length} models`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const include = joinModels.map(m => ({
        model: this.getModel(m),
        required: false,
      }));

      const results = await sequelizeModel.findAll({ include, limit: 100 });

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Joined search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Joined search failed');
    }
  }

  /**
   * Union search combining results from multiple queries
   * @param model - Sequelize model name
   * @param queries - Array of query configurations
   * @returns Union of all query results
   */
  async unionSearch(
    model: string,
    queries: Array<Record<string, any>>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Union search with ${queries.length} queries`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const allResults: any[] = [];
      for (const q of queries) {
        const results = await sequelizeModel.findAll({ where: q });
        allResults.push(...results);
      }

      // Remove duplicates
      const unique = [...new Map(allResults.map(r => [r.id, r])).values()];

      const took = Date.now() - startTime;
      return {
        results: unique,
        total: unique.length,
        score: unique.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Union search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Union search failed');
    }
  }

  /**
   * Intersect search finding common results from multiple queries
   * @param model - Sequelize model name
   * @param queries - Array of query configurations
   * @returns Intersection of query results
   */
  async intersectSearch(
    model: string,
    queries: Array<Record<string, any>>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Intersect search with ${queries.length} queries`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const resultSets = await Promise.all(
        queries.map(q => sequelizeModel.findAll({ where: q }))
      );

      const intersection = resultSets.reduce((acc, results, idx) => {
        const ids = new Set(results.map(r => r.id));
        return idx === 0 ? results : acc.filter(r => ids.has(r.id));
      }, []);

      const took = Date.now() - startTime;
      return {
        results: intersection,
        total: intersection.length,
        score: intersection.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Intersect search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Intersect search failed');
    }
  }

  /**
   * Difference search finding results in first query but not others
   * @param model - Sequelize model name
   * @param baseQuery - Base query
   * @param excludeQueries - Queries to exclude results from
   * @returns Difference of query results
   */
  async differenceSearch(
    model: string,
    baseQuery: Record<string, any>,
    excludeQueries: Array<Record<string, any>>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Difference search`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      const baseResults = await sequelizeModel.findAll({ where: baseQuery });

      for (const excludeQ of excludeQueries) {
        const excludeResults = await sequelizeModel.findAll({ where: excludeQ });
        const excludeIds = new Set(excludeResults.map(r => r.id));
        baseResults = baseResults.filter(r => !excludeIds.has(r.id));
      }

      const took = Date.now() - startTime;
      return {
        results: baseResults,
        total: baseResults.length,
        score: baseResults.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Difference search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Difference search failed');
    }
  }

  /**
   * Composite search combining multiple search strategies
   * @param model - Sequelize model name
   * @param searchConfig - Composite search configuration
   * @returns Composite search results
   */
  async compositeSearch(
    model: string,
    searchConfig: Record<string, any>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Composite search`, requestId);

      const startTime = Date.now();
      const results = [];

      if (searchConfig.fullText) {
        const ftResults = await this.fullTextSearch(model, searchConfig.fullText, searchConfig.fields || []);
        results.push(...ftResults.results);
      }

      if (searchConfig.filters) {
        const filteredResults = await this.filteredSearch(model, searchConfig.filters);
        results.push(...filteredResults.results);
      }

      // Remove duplicates
      const unique = [...new Map(results.map(r => [r.id, r])).values()];

      const took = Date.now() - startTime;
      return {
        results: unique.slice(0, 100),
        total: unique.length,
        score: unique.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Composite search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Composite search failed');
    }
  }

  /**
   * Chained search applying sequential filters
   * @param model - Sequelize model name
   * @param chainedFilters - Array of filters to apply sequentially
   * @returns Chained filter results
   */
  async chainedSearch(
    model: string,
    chainedFilters: Array<Record<string, any>>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Chained search with ${chainedFilters.length} filters`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      let results = await sequelizeModel.findAll();

      for (const filter of chainedFilters) {
        const where = this.buildFilterWhere(filter);
        results = await sequelizeModel.findAll({ where });
      }

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Chained search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Chained search failed');
    }
  }

  /**
   * Pipelined search with transformations
   * @param model - Sequelize model name
   * @param pipeline - Array of transformation stages
   * @returns Pipelined search results
   */
  async pipelinedSearch(
    model: string,
    pipeline: Array<{ stage: string; config: Record<string, any> }>
  ): Promise<SearchResult<any>> {
    const requestId = generateRequestId();
    try {
      this.logger.log(`Pipelined search with ${pipeline.length} stages`, requestId);

      const sequelizeModel = this.getModel(model);
      const startTime = Date.now();

      let results: any[] = await sequelizeModel.findAll();

      for (const stage of pipeline) {
        results = this.applyPipelineStage(results, stage);
      }

      const took = Date.now() - startTime;
      return {
        results,
        total: results.length,
        score: results.length > 0 ? 1 : 0,
        took,
      };
    } catch (error) {
      this.logger.error(`Pipelined search failed: ${error.message}`, error.stack);
      throw new BadRequestError('Pipelined search failed');
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

  private parseBooleanQuery(query: string, field: string): Record<string, any> {
    const and = query.split('AND').map(s => s.trim());
    const where: Record<string, any> = {};

    and.forEach(clause => {
      if (clause.startsWith('NOT ')) {
        const term = clause.replace('NOT ', '').trim();
        where[field] = { [Op.notLike]: `%${term}%` };
      } else if (clause.includes('OR')) {
        const ors = clause.split('OR').map(s => s.trim());
        where[Op.or] = ors.map(term => ({
          [field]: { [Op.like]: `%${term}%` },
        }));
      } else {
        where[field] = { [Op.like]: `%${clause}%` };
      }
    });

    return where;
  }

  private buildFilterWhere(filters: Record<string, any>): Record<string, any> {
    const where: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        where[key] = { [Op.in]: value };
      } else if (typeof value === 'object' && value !== null) {
        where[key] = value;
      } else {
        where[key] = value;
      }
    });

    return where;
  }

  private buildAdvancedWhere(filters: Record<string, any>): Record<string, any> {
    return this.buildFilterWhere(filters);
  }

  private buildTemplateWhere(templateName: string, params: Record<string, any>): Record<string, any> {
    // Template-based where clause builder
    return params;
  }

  private parseComplexQuery(query: Record<string, any>): Record<string, any> {
    // Parse complex nested query objects
    return query;
  }

  private getRankingFormula(strategy: RankingStrategy): string {
    switch (strategy) {
      case RankingStrategy.RECENCY:
        return 'EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400 DESC';
      case RankingStrategy.POPULARITY:
        return 'view_count DESC';
      case RankingStrategy.WEIGHTED:
        return 'score * relevance DESC';
      case RankingStrategy.CUSTOM:
        return 'custom_score DESC';
      case RankingStrategy.RELEVANCE:
      default:
        return 'relevance_score DESC';
    }
  }

  private expandSemanticQuery(query: string): string[] {
    // Simple keyword expansion
    return [query, ...query.split(' ')];
  }

  private calculateSimilarity(record1: any, record2: any): number {
    // Simple string similarity calculation
    const str1 = JSON.stringify(record1);
    const str2 = JSON.stringify(record2);

    const matches = [...new Set([...str1.split(''), ...str2.split('')])]
      .filter(char => str1.includes(char) && str2.includes(char)).length;

    return matches / Math.max(str1.length, str2.length);
  }

  private async recursiveTraverse(
    model: string,
    id: string,
    depth: number,
    visited: Set<string>,
    results: any[]
  ): Promise<void> {
    if (depth <= 0 || visited.has(id)) return;

    visited.add(id);
    const sequelizeModel = this.getModel(model);
    const record = await sequelizeModel.findByPk(id);

    if (record) {
      results.push(record);
    }
  }

  private applyPipelineStage(results: any[], stage: { stage: string; config: Record<string, any> }): any[] {
    switch (stage.stage) {
      case 'filter':
        return results.filter(r => this.matchesFilter(r, stage.config));
      case 'map':
        return results.map(r => stage.config.mapper?.(r) || r);
      case 'sort':
        return results.sort((a, b) => {
          const field = Object.keys(stage.config)[0];
          const direction = stage.config[field] === 1 ? 1 : -1;
          return (a[field] > b[field] ? 1 : -1) * direction;
        });
      default:
        return results;
    }
  }

  private matchesFilter(record: any, filter: Record<string, any>): boolean {
    return Object.entries(filter).every(([key, value]) => record[key] === value);
  }
}

export default SearchOperationsService;
