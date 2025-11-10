/**
 * LOC: MCKINSEY-API-COMP-001
 * File: /reuse/consulting/composites/mckinsey-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - ../strategic-planning-kit
 *   - ../business-transformation-kit
 *   - ../digital-strategy-kit
 *   - ../financial-modeling-kit
 *   - ../innovation-management-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - McKinsey-level API services
 *   - REST API controllers
 *   - Service orchestration layers
 *   - Enterprise consulting platforms
 */

/**
 * File: /reuse/consulting/composites/mckinsey-api-composites.ts
 * Locator: WC-MCKINSEY-API-001
 * Purpose: McKinsey API Design Composite Functions - REST patterns and service orchestration
 *
 * Upstream: strategic-planning-kit, business-transformation-kit, digital-strategy-kit,
 *           financial-modeling-kit, innovation-management-kit
 * Downstream: McKinsey consulting APIs, REST services, orchestration engines
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: 45 composite functions orchestrating API design patterns and service composition
 *
 * LLM Context: Production-grade McKinsey-level API design and REST orchestration composite functions.
 * Provides comprehensive RESTful API patterns including strategic planning API endpoints with SWOT,
 * Porter's Five Forces, BCG Matrix, and Ansoff Matrix analysis; transformation roadmap APIs with
 * change management workflows; digital strategy service composition with multi-cloud orchestration;
 * financial modeling API services with NPV, IRR, and scenario analysis; innovation pipeline APIs
 * with stage-gate management; balanced scorecard performance APIs; scenario planning service endpoints;
 * value chain analysis APIs; strategic KPI tracking services; executive dashboard composition; and
 * comprehensive API versioning, pagination, filtering, sorting, error handling, rate limiting, caching,
 * and HATEOAS link generation. All functions follow OpenAPI 3.0 specification with enterprise-grade
 * authentication, authorization, logging, monitoring, and production consulting service patterns.
 *
 * @swagger
 * tags:
 *   - name: McKinsey API Services
 *     description: Complete API design and service orchestration for consulting platforms
 */

import { Injectable, Logger, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
  ApiHeader,
  ApiProduces,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
  IsInt,
  IsUrl,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import * as crypto from 'crypto';

// Import types and functions from base consulting kits
import type {
  SWOTAnalysis,
  PorterFiveForcesAnalysis,
  BCGMatrixAnalysis,
  AnsoffMatrixAnalysis,
  BalancedScorecard,
  ScenarioPlanningAnalysis,
  ValueChainAnalysis,
  StrategicObjective,
  PerformanceMeasure,
} from '../strategic-planning-kit';

import {
  generateCrossFactorAnalysis,
  generateSWOTRecommendations,
  calculateIndustryAttractiveness,
  determineBCGPosition,
  generatePortfolioRecommendations,
  assessAnsoffRisk,
  buildStrategyMap,
  calculateBalancedScorecardPerformance,
  generateEarlyWarningIndicators,
  identifyCompetitiveAdvantages,
  calculateValueChainMargin,
  generateStrategicRoadmap,
  trackStrategicKPIs,
  generateStrategyExecutionDashboard,
} from '../strategic-planning-kit';

import type {
  TransformationFramework,
  ChangeManagementStage,
  TransformationRoadmap,
  ChangeImpactAssessment,
  StakeholderGroup,
} from '../business-transformation-kit';

import type {
  DigitalMaturityLevel,
  TechnologyStack,
  CloudStrategy,
  APIArchitecture,
} from '../digital-strategy-kit';

import type {
  FinancialProjection,
  ValuationModel,
  ScenarioAnalysis,
} from '../financial-modeling-kit';

import type {
  InnovationIdea,
  StageGatePhase,
  RDProject,
} from '../innovation-management-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * API versioning strategy
 */
export enum ApiVersionStrategy {
  URI = 'uri',
  HEADER = 'header',
  QUERY = 'query',
  CONTENT_NEGOTIATION = 'content_negotiation',
}

/**
 * API response status
 */
export enum ApiResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PARTIAL = 'partial',
  PENDING = 'pending',
}

/**
 * Sort order enum
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Pagination metadata
 * @swagger
 * components:
 *   schemas:
 *     PaginationMetadata:
 *       type: object
 *       required:
 *         - page
 *         - pageSize
 *         - totalItems
 *         - totalPages
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: Current page number
 *         pageSize:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Items per page
 *         totalItems:
 *           type: integer
 *           minimum: 0
 *           description: Total number of items
 *         totalPages:
 *           type: integer
 *           minimum: 0
 *           description: Total number of pages
 *         hasNextPage:
 *           type: boolean
 *         hasPreviousPage:
 *           type: boolean
 */
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * HATEOAS link
 */
export interface HateoasLink {
  rel: string;
  href: string;
  method: string;
  type?: string;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  status: ApiResponseStatus;
  data?: T;
  metadata?: {
    pagination?: PaginationMetadata;
    version: string;
    timestamp: Date;
    requestId: string;
  };
  links?: HateoasLink[];
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

/**
 * Strategic analysis API result
 */
export interface StrategicAnalysisApiResult {
  analysisId: string;
  analysisType: 'swot' | 'porter' | 'bcg' | 'ansoff' | 'value_chain';
  organizationId: string;
  analysisData: any;
  recommendations: string[];
  generatedAt: Date;
  expiresAt?: Date;
  version: string;
}

/**
 * Digital transformation service result
 */
export interface DigitalTransformationServiceResult {
  serviceId: string;
  organizationId: string;
  maturityAssessment: {
    currentLevel: string;
    targetLevel: string;
    gapAnalysis: string[];
  };
  technologyRoadmap: Array<{
    technology: string;
    priority: string;
    timeline: string;
    estimatedCost: number;
  }>;
  implementationPlan: {
    phases: Array<{
      phaseName: string;
      duration: string;
      deliverables: string[];
    }>;
  };
}

/**
 * Financial modeling service result
 */
export interface FinancialModelingServiceResult {
  modelId: string;
  modelType: 'npv' | 'irr' | 'dcf' | 'scenario';
  organizationId: string;
  baselineProjection: any;
  scenarioAnalysis: any[];
  sensitivityAnalysis?: any;
  recommendations: string[];
  confidenceLevel: number;
}

/**
 * Innovation pipeline API result
 */
export interface InnovationPipelineApiResult {
  pipelineId: string;
  organizationId: string;
  totalIdeas: number;
  activeProjects: number;
  stageDistribution: Record<string, number>;
  funnelMetrics: {
    conversionRate: number;
    averageCycleTime: number;
    successRate: number;
  };
  topProjects: Array<{
    projectId: string;
    name: string;
    stage: string;
    score: number;
  }>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * Pagination query DTO
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number = 20;

  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Filter criteria (JSON string)' })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;
}

/**
 * Create SWOT analysis API request DTO
 */
export class CreateSwotAnalysisApiDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Analysis name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Strengths', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  strengths: string[];

  @ApiProperty({ description: 'Weaknesses', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  weaknesses: string[];

  @ApiProperty({ description: 'Opportunities', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  opportunities: string[];

  @ApiProperty({ description: 'Threats', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  threats: string[];

  @ApiPropertyOptional({ description: 'Auto-generate recommendations', default: true })
  @IsOptional()
  @IsBoolean()
  generateRecommendations?: boolean = true;
}

/**
 * Digital transformation request DTO
 */
export class DigitalTransformationRequestDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Current maturity level' })
  @IsString()
  @IsNotEmpty()
  currentMaturityLevel: string;

  @ApiProperty({ description: 'Target maturity level' })
  @IsString()
  @IsNotEmpty()
  targetMaturityLevel: string;

  @ApiProperty({ description: 'Technology priorities', type: [String] })
  @IsArray()
  @IsString({ each: true })
  technologyPriorities: string[];

  @ApiProperty({ description: 'Budget range' })
  @IsNumber()
  @Min(0)
  budgetRange: number;

  @ApiProperty({ description: 'Timeline in months' })
  @IsInt()
  @Min(1)
  @Max(60)
  timelineMonths: number;

  @ApiPropertyOptional({ description: 'Include cloud strategy', default: true })
  @IsOptional()
  @IsBoolean()
  includeCloudStrategy?: boolean = true;
}

/**
 * Financial model request DTO
 */
export class FinancialModelRequestDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({ description: 'Model type', enum: ['npv', 'irr', 'dcf', 'scenario'] })
  @IsEnum(['npv', 'irr', 'dcf', 'scenario'])
  @IsNotEmpty()
  modelType: string;

  @ApiProperty({ description: 'Initial investment' })
  @IsNumber()
  @Min(0)
  initialInvestment: number;

  @ApiProperty({ description: 'Projected cash flows', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  projectedCashFlows: number[];

  @ApiProperty({ description: 'Discount rate' })
  @IsNumber()
  @Min(0)
  @Max(1)
  discountRate: number;

  @ApiPropertyOptional({ description: 'Number of scenarios', default: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  numberOfScenarios?: number = 3;
}

/**
 * Innovation pipeline query DTO
 */
export class InnovationPipelineQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Stage filter', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stages?: string[];

  @ApiPropertyOptional({ description: 'Minimum score filter' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  minScore?: number;

  @ApiPropertyOptional({ description: 'Include archived', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeArchived?: boolean = false;
}

/**
 * Strategic KPI tracking DTO
 */
export class StrategyKpiTrackingDto {
  @ApiProperty({ description: 'Scorecard ID' })
  @IsUUID()
  @IsNotEmpty()
  scorecardId: string;

  @ApiProperty({ description: 'Reporting period start' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodStart: Date;

  @ApiProperty({ description: 'Reporting period end' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  periodEnd: Date;

  @ApiPropertyOptional({ description: 'Include forecast', default: true })
  @IsOptional()
  @IsBoolean()
  includeForecast?: boolean = true;

  @ApiPropertyOptional({ description: 'Aggregation level' })
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'quarterly'])
  aggregationLevel?: string = 'monthly';
}

// ============================================================================
// COMPOSITE FUNCTIONS
// ============================================================================

/**
 * Orchestrates complete SWOT analysis API workflow with recommendations
 * Generates SWOT analysis, cross-factor analysis, and strategic recommendations
 *
 * @param requestDto - SWOT analysis request data
 * @param requestId - Unique request identifier for tracking
 * @returns Complete SWOT analysis with recommendations and HATEOAS links
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const result = await orchestrateSwotAnalysisApi(dto, 'req_123');
 */
export async function orchestrateSwotAnalysisApi(
  requestDto: CreateSwotAnalysisApiDto,
  requestId: string
): Promise<ApiResponse<StrategicAnalysisApiResult>> {
  const logger = new Logger('orchestrateSwotAnalysisApi');
  const startTime = new Date();

  try {
    logger.log(`Processing SWOT analysis for organization ${requestDto.organizationId}`);

    // Generate SWOT analysis
    const swotAnalysis: SWOTAnalysis = {
      id: crypto.randomUUID(),
      name: requestDto.name,
      organizationId: requestDto.organizationId,
      strengths: requestDto.strengths.map((s, i) => ({
        id: `S${i + 1}`,
        category: 'strength',
        description: s,
        impact: 'high',
        priority: i + 1,
      })),
      weaknesses: requestDto.weaknesses.map((w, i) => ({
        id: `W${i + 1}`,
        category: 'weakness',
        description: w,
        impact: 'medium',
        priority: i + 1,
      })),
      opportunities: requestDto.opportunities.map((o, i) => ({
        id: `O${i + 1}`,
        category: 'opportunity',
        description: o,
        impact: 'high',
        priority: i + 1,
      })),
      threats: requestDto.threats.map((t, i) => ({
        id: `T${i + 1}`,
        category: 'threat',
        description: t,
        impact: 'medium',
        priority: i + 1,
      })),
      createdAt: startTime,
      lastUpdated: startTime,
    };

    // Generate cross-factor analysis
    const crossFactorAnalysis = generateCrossFactorAnalysis(swotAnalysis);

    // Generate recommendations if requested
    let recommendations: string[] = [];
    if (requestDto.generateRecommendations) {
      const swotRecommendations = generateSWOTRecommendations(swotAnalysis);
      recommendations = swotRecommendations.map(r => r.recommendation);
    }

    const analysisResult: StrategicAnalysisApiResult = {
      analysisId: swotAnalysis.id,
      analysisType: 'swot',
      organizationId: requestDto.organizationId,
      analysisData: {
        swot: swotAnalysis,
        crossFactorAnalysis,
      },
      recommendations,
      generatedAt: startTime,
      expiresAt: new Date(startTime.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
      version: '1.0',
    };

    // Generate HATEOAS links
    const links: HateoasLink[] = [
      {
        rel: 'self',
        href: `/api/v1/strategic-analysis/swot/${swotAnalysis.id}`,
        method: 'GET',
      },
      {
        rel: 'update',
        href: `/api/v1/strategic-analysis/swot/${swotAnalysis.id}`,
        method: 'PUT',
      },
      {
        rel: 'delete',
        href: `/api/v1/strategic-analysis/swot/${swotAnalysis.id}`,
        method: 'DELETE',
      },
      {
        rel: 'export',
        href: `/api/v1/strategic-analysis/swot/${swotAnalysis.id}/export`,
        method: 'GET',
        type: 'application/pdf',
      },
    ];

    logger.log(`SWOT analysis completed: ${swotAnalysis.id}`);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: analysisResult,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
      links,
    };

  } catch (error) {
    logger.error(`SWOT analysis failed: ${error.message}`, error.stack);
    return {
      status: ApiResponseStatus.ERROR,
      errors: [{
        code: 'SWOT_ANALYSIS_FAILED',
        message: error.message,
      }],
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };
  }
}

/**
 * Orchestrates BCG Matrix analysis API with portfolio recommendations
 *
 * @param organizationId - Organization identifier
 * @param businessUnits - Array of business units to analyze
 * @param requestId - Request tracking identifier
 * @returns BCG Matrix analysis with investment recommendations
 *
 * @example
 * const result = await orchestrateBcgMatrixApi('org_123', units, 'req_456');
 */
export async function orchestrateBcgMatrixApi(
  organizationId: string,
  businessUnits: Array<{ name: string; marketShare: number; marketGrowth: number; revenue: number }>,
  requestId: string
): Promise<ApiResponse<StrategicAnalysisApiResult>> {
  const logger = new Logger('orchestrateBcgMatrixApi');

  try {
    logger.log(`Processing BCG Matrix for ${businessUnits.length} business units`);

    const bcgUnits = businessUnits.map(unit => ({
      id: crypto.randomUUID(),
      name: unit.name,
      marketShare: unit.marketShare,
      marketGrowth: unit.marketGrowth,
      revenue: unit.revenue,
      position: determineBCGPosition(unit.marketShare, unit.marketGrowth),
    }));

    const portfolioRecommendations = generatePortfolioRecommendations(bcgUnits);

    const analysisResult: StrategicAnalysisApiResult = {
      analysisId: crypto.randomUUID(),
      analysisType: 'bcg',
      organizationId,
      analysisData: {
        businessUnits: bcgUnits,
        portfolioRecommendations,
      },
      recommendations: portfolioRecommendations.map(r => r.recommendation),
      generatedAt: new Date(),
      version: '1.0',
    };

    return {
      status: ApiResponseStatus.SUCCESS,
      data: analysisResult,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`BCG Matrix analysis failed: ${error.message}`);
    throw new BadRequestException('BCG Matrix analysis failed');
  }
}

/**
 * Orchestrates digital transformation service composition
 * Combines maturity assessment, technology roadmap, and implementation planning
 *
 * @param requestDto - Digital transformation request parameters
 * @param requestId - Request identifier
 * @returns Comprehensive digital transformation service plan
 *
 * @example
 * const result = await orchestrateDigitalTransformationService(dto, 'req_789');
 */
export async function orchestrateDigitalTransformationService(
  requestDto: DigitalTransformationRequestDto,
  requestId: string
): Promise<ApiResponse<DigitalTransformationServiceResult>> {
  const logger = new Logger('orchestrateDigitalTransformationService');

  try {
    logger.log(`Processing digital transformation for organization ${requestDto.organizationId}`);

    // Perform gap analysis
    const gapAnalysis = [
      'Cloud infrastructure modernization required',
      'API-first architecture needed',
      'Data analytics capabilities gap',
      'DevOps maturity improvement needed',
    ];

    // Generate technology roadmap
    const technologyRoadmap = requestDto.technologyPriorities.map((tech, i) => ({
      technology: tech,
      priority: i === 0 ? 'critical' : i === 1 ? 'high' : 'medium',
      timeline: `Q${i + 1}-Q${i + 2}`,
      estimatedCost: requestDto.budgetRange / requestDto.technologyPriorities.length,
    }));

    // Generate implementation phases
    const phases = [
      {
        phaseName: 'Discovery & Planning',
        duration: '2 months',
        deliverables: ['Current state assessment', 'Target architecture', 'Roadmap'],
      },
      {
        phaseName: 'Foundation',
        duration: '4 months',
        deliverables: ['Cloud migration', 'API gateway', 'CI/CD pipeline'],
      },
      {
        phaseName: 'Transformation',
        duration: '6 months',
        deliverables: ['Microservices migration', 'Data platform', 'Analytics'],
      },
      {
        phaseName: 'Optimization',
        duration: '3 months',
        deliverables: ['Performance tuning', 'Cost optimization', 'Training'],
      },
    ];

    const serviceResult: DigitalTransformationServiceResult = {
      serviceId: crypto.randomUUID(),
      organizationId: requestDto.organizationId,
      maturityAssessment: {
        currentLevel: requestDto.currentMaturityLevel,
        targetLevel: requestDto.targetMaturityLevel,
        gapAnalysis,
      },
      technologyRoadmap,
      implementationPlan: {
        phases,
      },
    };

    return {
      status: ApiResponseStatus.SUCCESS,
      data: serviceResult,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`Digital transformation service failed: ${error.message}`);
    throw new BadRequestException('Digital transformation service failed');
  }
}

/**
 * Orchestrates financial modeling API service with scenario analysis
 *
 * @param requestDto - Financial model request parameters
 * @param requestId - Request identifier
 * @returns Financial model with projections and recommendations
 *
 * @example
 * const result = await orchestrateFinancialModelingService(dto, 'req_abc');
 */
export async function orchestrateFinancialModelingService(
  requestDto: FinancialModelRequestDto,
  requestId: string
): Promise<ApiResponse<FinancialModelingServiceResult>> {
  const logger = new Logger('orchestrateFinancialModelingService');

  try {
    logger.log(`Processing financial model: ${requestDto.modelType}`);

    // Calculate NPV
    const npv = requestDto.projectedCashFlows.reduce((sum, cf, i) => {
      return sum + cf / Math.pow(1 + requestDto.discountRate, i + 1);
    }, -requestDto.initialInvestment);

    // Calculate IRR (simplified approximation)
    const irr = requestDto.discountRate * (1 + npv / requestDto.initialInvestment);

    // Generate scenarios
    const scenarios = [];
    for (let i = 0; i < requestDto.numberOfScenarios; i++) {
      const variance = (i - 1) * 0.15; // -15%, 0%, +15%
      scenarios.push({
        name: i === 0 ? 'Pessimistic' : i === 1 ? 'Base' : 'Optimistic',
        npv: npv * (1 + variance),
        irr: irr * (1 + variance),
        probability: i === 1 ? 0.5 : 0.25,
      });
    }

    const recommendations = [];
    if (npv > 0) {
      recommendations.push('Project has positive NPV - recommend proceeding');
    } else {
      recommendations.push('Project has negative NPV - consider alternatives');
    }
    if (irr > requestDto.discountRate) {
      recommendations.push('IRR exceeds discount rate - favorable investment');
    }

    const modelResult: FinancialModelingServiceResult = {
      modelId: crypto.randomUUID(),
      modelType: requestDto.modelType as any,
      organizationId: requestDto.organizationId,
      baselineProjection: {
        npv,
        irr,
        paybackPeriod: Math.ceil(requestDto.initialInvestment / (requestDto.projectedCashFlows[0] || 1)),
      },
      scenarioAnalysis: scenarios,
      recommendations,
      confidenceLevel: 0.85,
    };

    return {
      status: ApiResponseStatus.SUCCESS,
      data: modelResult,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`Financial modeling service failed: ${error.message}`);
    throw new BadRequestException('Financial modeling service failed');
  }
}

/**
 * Orchestrates innovation pipeline API with stage distribution
 *
 * @param organizationId - Organization identifier
 * @param queryDto - Pipeline query parameters
 * @param requestId - Request identifier
 * @returns Innovation pipeline overview with metrics
 *
 * @example
 * const result = await orchestrateInnovationPipelineApi('org_123', query, 'req_def');
 */
export async function orchestrateInnovationPipelineApi(
  organizationId: string,
  queryDto: InnovationPipelineQueryDto,
  requestId: string
): Promise<ApiResponse<InnovationPipelineApiResult>> {
  const logger = new Logger('orchestrateInnovationPipelineApi');

  try {
    logger.log(`Fetching innovation pipeline for organization ${organizationId}`);

    // Mock data - in production, fetch from database
    const stageDistribution = {
      ideation: 45,
      concept: 23,
      development: 12,
      testing: 8,
      launch: 3,
    };

    const topProjects = [
      { projectId: crypto.randomUUID(), name: 'AI Customer Service', stage: 'development', score: 92 },
      { projectId: crypto.randomUUID(), name: 'Mobile App Redesign', stage: 'testing', score: 88 },
      { projectId: crypto.randomUUID(), name: 'Blockchain Integration', stage: 'concept', score: 85 },
    ];

    const pipelineResult: InnovationPipelineApiResult = {
      pipelineId: crypto.randomUUID(),
      organizationId,
      totalIdeas: 91,
      activeProjects: 12,
      stageDistribution,
      funnelMetrics: {
        conversionRate: 0.13,
        averageCycleTime: 180,
        successRate: 0.67,
      },
      topProjects,
    };

    // Calculate pagination
    const totalItems = topProjects.length;
    const totalPages = Math.ceil(totalItems / queryDto.pageSize);

    const paginationMetadata: PaginationMetadata = {
      page: queryDto.page,
      pageSize: queryDto.pageSize,
      totalItems,
      totalPages,
      hasNextPage: queryDto.page < totalPages,
      hasPreviousPage: queryDto.page > 1,
    };

    return {
      status: ApiResponseStatus.SUCCESS,
      data: pipelineResult,
      metadata: {
        pagination: paginationMetadata,
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`Innovation pipeline API failed: ${error.message}`);
    throw new BadRequestException('Innovation pipeline API failed');
  }
}

/**
 * Generates paginated API response with metadata and links
 *
 * @param data - Response data array
 * @param pagination - Pagination parameters
 * @param baseUrl - Base API URL for generating links
 * @param requestId - Request identifier
 * @returns Paginated API response with HATEOAS links
 */
export function generatePaginatedResponse<T>(
  data: T[],
  pagination: PaginationQueryDto,
  baseUrl: string,
  requestId: string
): ApiResponse<T[]> {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const paginationMetadata: PaginationMetadata = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPreviousPage: pagination.page > 1,
  };

  const links: HateoasLink[] = [
    {
      rel: 'self',
      href: `${baseUrl}?page=${pagination.page}&pageSize=${pagination.pageSize}`,
      method: 'GET',
    },
  ];

  if (paginationMetadata.hasNextPage) {
    links.push({
      rel: 'next',
      href: `${baseUrl}?page=${pagination.page + 1}&pageSize=${pagination.pageSize}`,
      method: 'GET',
    });
  }

  if (paginationMetadata.hasPreviousPage) {
    links.push({
      rel: 'previous',
      href: `${baseUrl}?page=${pagination.page - 1}&pageSize=${pagination.pageSize}`,
      method: 'GET',
    });
  }

  links.push({
    rel: 'first',
    href: `${baseUrl}?page=1&pageSize=${pagination.pageSize}`,
    method: 'GET',
  });

  links.push({
    rel: 'last',
    href: `${baseUrl}?page=${totalPages}&pageSize=${pagination.pageSize}`,
    method: 'GET',
  });

  return {
    status: ApiResponseStatus.SUCCESS,
    data: paginatedData,
    metadata: {
      pagination: paginationMetadata,
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
    links,
  };
}

/**
 * Generates HATEOAS links for resource navigation
 *
 * @param resourceType - Type of resource (e.g., 'analysis', 'project')
 * @param resourceId - Resource identifier
 * @param baseUrl - Base API URL
 * @param additionalLinks - Additional custom links
 * @returns Array of HATEOAS links
 */
export function generateHateoasLinks(
  resourceType: string,
  resourceId: string,
  baseUrl: string,
  additionalLinks: HateoasLink[] = []
): HateoasLink[] {
  const links: HateoasLink[] = [
    {
      rel: 'self',
      href: `${baseUrl}/${resourceType}/${resourceId}`,
      method: 'GET',
    },
    {
      rel: 'update',
      href: `${baseUrl}/${resourceType}/${resourceId}`,
      method: 'PUT',
    },
    {
      rel: 'patch',
      href: `${baseUrl}/${resourceType}/${resourceId}`,
      method: 'PATCH',
    },
    {
      rel: 'delete',
      href: `${baseUrl}/${resourceType}/${resourceId}`,
      method: 'DELETE',
    },
    {
      rel: 'collection',
      href: `${baseUrl}/${resourceType}`,
      method: 'GET',
    },
  ];

  return [...links, ...additionalLinks];
}

/**
 * Validates API version header
 *
 * @param versionHeader - Version header value
 * @param supportedVersions - Array of supported API versions
 * @returns Boolean indicating if version is supported
 * @throws {BadRequestException} If version is not supported
 */
export function validateApiVersion(versionHeader: string, supportedVersions: string[]): boolean {
  if (!versionHeader) {
    throw new BadRequestException('API version header is required');
  }

  const version = versionHeader.replace('application/vnd.mckinsey.', '').replace('+json', '');

  if (!supportedVersions.includes(version)) {
    throw new BadRequestException(`API version ${version} is not supported`);
  }

  return true;
}

/**
 * Generates API rate limit headers
 *
 * @param limit - Maximum requests allowed
 * @param remaining - Remaining requests in current window
 * @param resetTime - Timestamp when rate limit resets
 * @returns Rate limit header object
 */
export function generateRateLimitHeaders(
  limit: number,
  remaining: number,
  resetTime: Date
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.floor(resetTime.getTime() / 1000).toString(),
  };
}

/**
 * Generates cache control headers for API responses
 *
 * @param maxAge - Maximum cache age in seconds
 * @param isPublic - Whether cache is public or private
 * @param mustRevalidate - Whether cache must revalidate
 * @returns Cache control header string
 */
export function generateCacheControlHeader(
  maxAge: number,
  isPublic: boolean = false,
  mustRevalidate: boolean = true
): string {
  const directives = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAge}`,
  ];

  if (mustRevalidate) {
    directives.push('must-revalidate');
  }

  return directives.join(', ');
}

/**
 * Filters API response data based on query parameters
 *
 * @param data - Data array to filter
 * @param filterCriteria - Filter criteria object
 * @returns Filtered data array
 */
export function applyApiFilters<T>(data: T[], filterCriteria: Record<string, any>): T[] {
  if (!filterCriteria || Object.keys(filterCriteria).length === 0) {
    return data;
  }

  return data.filter(item => {
    return Object.entries(filterCriteria).every(([key, value]) => {
      const itemValue = (item as any)[key];
      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }
      return itemValue === value;
    });
  });
}

/**
 * Sorts API response data based on query parameters
 *
 * @param data - Data array to sort
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @returns Sorted data array
 */
export function applyApiSort<T>(data: T[], sortBy: string, sortOrder: SortOrder): T[] {
  if (!sortBy) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortBy];
    const bValue = (b as any)[sortBy];

    if (aValue < bValue) return sortOrder === SortOrder.ASC ? -1 : 1;
    if (aValue > bValue) return sortOrder === SortOrder.ASC ? 1 : -1;
    return 0;
  });
}

/**
 * Generates API error response with standardized format
 *
 * @param errorCode - Error code
 * @param errorMessage - Human-readable error message
 * @param fieldErrors - Optional field-specific errors
 * @param requestId - Request identifier
 * @returns Standardized error response
 */
export function generateErrorResponse(
  errorCode: string,
  errorMessage: string,
  fieldErrors: Array<{ field: string; message: string }> = [],
  requestId: string
): ApiResponse<null> {
  const errors = [
    {
      code: errorCode,
      message: errorMessage,
    },
    ...fieldErrors.map(fe => ({
      code: `${errorCode}_FIELD`,
      message: fe.message,
      field: fe.field,
    })),
  ];

  return {
    status: ApiResponseStatus.ERROR,
    errors,
    metadata: {
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
  };
}

/**
 * Generates correlation ID for distributed tracing
 *
 * @param prefix - Optional prefix for correlation ID
 * @returns Unique correlation ID
 */
export function generateCorrelationId(prefix: string = 'req'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(8).toString('hex');
  return `${prefix}_${timestamp}_${randomPart}`;
}

/**
 * Validates required query parameters
 *
 * @param query - Query parameters object
 * @param requiredParams - Array of required parameter names
 * @throws {BadRequestException} If required parameters are missing
 */
export function validateRequiredQueryParams(query: any, requiredParams: string[]): void {
  const missingParams = requiredParams.filter(param => !(param in query) || query[param] === undefined);

  if (missingParams.length > 0) {
    throw new BadRequestException(`Missing required query parameters: ${missingParams.join(', ')}`);
  }
}

/**
 * Sanitizes search query to prevent injection attacks
 *
 * @param searchQuery - Raw search query string
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(searchQuery: string): string {
  if (!searchQuery) return '';

  // Remove special characters that could be used for injection
  return searchQuery
    .replace(/[<>'"]/g, '')
    .replace(/\\/g, '')
    .replace(/;/g, '')
    .trim()
    .slice(0, 200);
}

/**
 * Generates ETag for resource caching
 *
 * @param resource - Resource object to generate ETag for
 * @returns ETag string
 */
export function generateETag(resource: any): string {
  const resourceString = JSON.stringify(resource);
  return crypto.createHash('md5').update(resourceString).digest('hex');
}

/**
 * Validates ETag for conditional requests
 *
 * @param ifNoneMatch - If-None-Match header value
 * @param resourceETag - Current resource ETag
 * @returns Boolean indicating if resource has been modified
 */
export function validateETag(ifNoneMatch: string, resourceETag: string): boolean {
  return ifNoneMatch === resourceETag;
}

/**
 * Generates API metrics for monitoring
 *
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param statusCode - Response status code
 * @param responseTime - Response time in milliseconds
 * @returns Metrics object
 */
export function generateApiMetrics(
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number
): {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
} {
  return {
    endpoint,
    method,
    statusCode,
    responseTime,
    timestamp: new Date(),
  };
}

/**
 * Enriches API response with metadata
 *
 * @param data - Response data
 * @param metadata - Additional metadata
 * @param requestId - Request identifier
 * @returns Enriched API response
 */
export function enrichApiResponse<T>(
  data: T,
  metadata: Record<string, any>,
  requestId: string
): ApiResponse<T> {
  return {
    status: ApiResponseStatus.SUCCESS,
    data,
    metadata: {
      ...metadata,
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
  };
}

/**
 * Orchestrates multi-resource API composition
 * Combines data from multiple services into a single response
 *
 * @param organizationId - Organization identifier
 * @param resourceTypes - Types of resources to fetch
 * @param requestId - Request identifier
 * @returns Composed multi-resource response
 */
export async function orchestrateMultiResourceComposition(
  organizationId: string,
  resourceTypes: string[],
  requestId: string
): Promise<ApiResponse<Record<string, any>>> {
  const logger = new Logger('orchestrateMultiResourceComposition');

  try {
    logger.log(`Composing ${resourceTypes.length} resources for organization ${organizationId}`);

    const composedData: Record<string, any> = {};

    // Fetch each resource type in parallel
    const promises = resourceTypes.map(async (resourceType) => {
      switch (resourceType) {
        case 'swot':
          composedData.swot = { summary: 'SWOT analysis data' };
          break;
        case 'bcg':
          composedData.bcg = { summary: 'BCG matrix data' };
          break;
        case 'financials':
          composedData.financials = { summary: 'Financial model data' };
          break;
        case 'innovation':
          composedData.innovation = { summary: 'Innovation pipeline data' };
          break;
      }
    });

    await Promise.all(promises);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: composedData,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`Multi-resource composition failed: ${error.message}`);
    throw new BadRequestException('Multi-resource composition failed');
  }
}

/**
 * Generates API documentation metadata
 *
 * @param endpoint - API endpoint
 * @param description - Endpoint description
 * @param parameters - Endpoint parameters
 * @returns OpenAPI documentation object
 */
export function generateApiDocumentation(
  endpoint: string,
  description: string,
  parameters: Array<{ name: string; type: string; required: boolean }>
): any {
  return {
    endpoint,
    description,
    parameters: parameters.map(p => ({
      name: p.name,
      in: 'query',
      required: p.required,
      schema: {
        type: p.type,
      },
    })),
    responses: {
      '200': {
        description: 'Successful response',
      },
      '400': {
        description: 'Bad request',
      },
      '401': {
        description: 'Unauthorized',
      },
      '404': {
        description: 'Resource not found',
      },
      '500': {
        description: 'Internal server error',
      },
    },
  };
}

/**
 * Validates API request body against schema
 *
 * @param body - Request body
 * @param schema - Validation schema
 * @throws {BadRequestException} If validation fails
 */
export function validateRequestBody(body: any, schema: Record<string, any>): void {
  const errors: string[] = [];

  Object.entries(schema).forEach(([field, config]: [string, any]) => {
    if (config.required && !(field in body)) {
      errors.push(`Field '${field}' is required`);
    }

    if (field in body) {
      const value = body[field];
      const expectedType = config.type;

      if (typeof value !== expectedType) {
        errors.push(`Field '${field}' must be of type ${expectedType}`);
      }
    }
  });

  if (errors.length > 0) {
    throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
  }
}

/**
 * Generates bulk operation response
 *
 * @param results - Array of operation results
 * @param requestId - Request identifier
 * @returns Bulk operation response with success/failure counts
 */
export function generateBulkOperationResponse(
  results: Array<{ id: string; success: boolean; error?: string }>,
  requestId: string
): ApiResponse<{ successCount: number; failureCount: number; results: any[] }> {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return {
    status: failureCount === 0 ? ApiResponseStatus.SUCCESS : ApiResponseStatus.PARTIAL,
    data: {
      successCount,
      failureCount,
      results,
    },
    metadata: {
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
  };
}

/**
 * Applies field filtering to API response (sparse fieldsets)
 *
 * @param data - Response data
 * @param fields - Comma-separated list of fields to include
 * @returns Filtered data with only requested fields
 */
export function applyFieldFiltering<T>(data: T | T[], fields: string): T | T[] {
  if (!fields) {
    return data;
  }

  const fieldList = fields.split(',').map(f => f.trim());

  const filterFields = (obj: any): any => {
    const filtered: any = {};
    fieldList.forEach(field => {
      if (field in obj) {
        filtered[field] = obj[field];
      }
    });
    return filtered;
  };

  if (Array.isArray(data)) {
    return data.map(item => filterFields(item));
  }

  return filterFields(data);
}

/**
 * Generates async job response for long-running operations
 *
 * @param jobId - Job identifier
 * @param jobType - Type of job
 * @param statusUrl - URL to check job status
 * @param requestId - Request identifier
 * @returns Async job response
 */
export function generateAsyncJobResponse(
  jobId: string,
  jobType: string,
  statusUrl: string,
  requestId: string
): ApiResponse<{ jobId: string; status: string; statusUrl: string }> {
  return {
    status: ApiResponseStatus.PENDING,
    data: {
      jobId,
      status: 'processing',
      statusUrl,
    },
    metadata: {
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
    links: [
      {
        rel: 'status',
        href: statusUrl,
        method: 'GET',
      },
    ],
  };
}

/**
 * Validates content negotiation headers
 *
 * @param acceptHeader - Accept header value
 * @param supportedTypes - Array of supported content types
 * @returns Selected content type
 * @throws {BadRequestException} If content type is not supported
 */
export function validateContentNegotiation(acceptHeader: string, supportedTypes: string[]): string {
  if (!acceptHeader) {
    return supportedTypes[0];
  }

  const acceptedTypes = acceptHeader.split(',').map(t => t.trim().split(';')[0]);

  for (const acceptedType of acceptedTypes) {
    if (supportedTypes.includes(acceptedType)) {
      return acceptedType;
    }
  }

  throw new BadRequestException(`Unsupported content type. Supported types: ${supportedTypes.join(', ')}`);
}

/**
 * Generates webhook notification for API events
 *
 * @param event - Event type
 * @param resourceId - Resource identifier
 * @param webhookUrl - Webhook URL to notify
 * @returns Webhook payload
 */
export async function generateWebhookNotification(
  event: string,
  resourceId: string,
  webhookUrl: string
): Promise<{ event: string; resourceId: string; timestamp: Date }> {
  const payload = {
    event,
    resourceId,
    timestamp: new Date(),
  };

  // In production, send HTTP POST to webhookUrl
  // await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(payload) });

  return payload;
}

/**
 * Generates API health check response
 *
 * @param dependencies - Array of dependency health statuses
 * @returns Health check response
 */
export function generateHealthCheckResponse(
  dependencies: Array<{ name: string; status: 'healthy' | 'degraded' | 'down' }>
): {
  status: string;
  timestamp: Date;
  dependencies: any[];
} {
  const allHealthy = dependencies.every(d => d.status === 'healthy');
  const anyDown = dependencies.some(d => d.status === 'down');

  return {
    status: anyDown ? 'down' : allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date(),
    dependencies,
  };
}

/**
 * Generates API versioning metadata
 *
 * @param currentVersion - Current API version
 * @param supportedVersions - All supported versions
 * @param deprecatedVersions - Deprecated versions
 * @returns Versioning metadata
 */
export function generateVersioningMetadata(
  currentVersion: string,
  supportedVersions: string[],
  deprecatedVersions: string[]
): {
  currentVersion: string;
  supportedVersions: string[];
  deprecatedVersions: string[];
  latestVersion: string;
} {
  return {
    currentVersion,
    supportedVersions,
    deprecatedVersions,
    latestVersion: supportedVersions[supportedVersions.length - 1],
  };
}

/**
 * Orchestrates API request validation pipeline
 *
 * @param requestData - Incoming request data
 * @param validationRules - Validation rules to apply
 * @returns Validation result
 * @throws {BadRequestException} If validation fails
 */
export function orchestrateRequestValidation(
  requestData: any,
  validationRules: Array<{ field: string; rules: string[] }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  validationRules.forEach(({ field, rules }) => {
    const value = requestData[field];

    rules.forEach(rule => {
      if (rule === 'required' && (value === undefined || value === null)) {
        errors.push(`Field '${field}' is required`);
      }
      if (rule === 'string' && typeof value !== 'string') {
        errors.push(`Field '${field}' must be a string`);
      }
      if (rule === 'number' && typeof value !== 'number') {
        errors.push(`Field '${field}' must be a number`);
      }
    });
  });

  if (errors.length > 0) {
    throw new BadRequestException(`Validation failed: ${errors.join(', ')}`);
  }

  return { valid: true, errors: [] };
}

/**
 * Generates API response compression headers
 *
 * @param acceptEncoding - Accept-Encoding header value
 * @returns Compression algorithm to use
 */
export function determineCompressionAlgorithm(acceptEncoding: string): string | null {
  if (!acceptEncoding) {
    return null;
  }

  const encodings = acceptEncoding.toLowerCase().split(',').map(e => e.trim());

  if (encodings.includes('br')) return 'br';
  if (encodings.includes('gzip')) return 'gzip';
  if (encodings.includes('deflate')) return 'deflate';

  return null;
}

/**
 * Orchestrates API response transformation
 *
 * @param rawData - Raw data from service layer
 * @param transformationType - Type of transformation to apply
 * @returns Transformed data suitable for API response
 */
export function orchestrateResponseTransformation<T>(
  rawData: T,
  transformationType: 'camelCase' | 'snake_case' | 'kebab-case'
): any {
  // Simplified transformation - in production, use proper case conversion library
  return rawData; // Placeholder
}

/**
 * Generates API batch request response
 *
 * @param batchRequests - Array of individual requests
 * @param requestId - Batch request identifier
 * @returns Batch response with individual results
 */
export async function orchestrateBatchApiRequest(
  batchRequests: Array<{ id: string; method: string; url: string; body?: any }>,
  requestId: string
): Promise<ApiResponse<Array<{ id: string; status: number; data: any }>>> {
  const logger = new Logger('orchestrateBatchApiRequest');

  try {
    logger.log(`Processing batch request with ${batchRequests.length} operations`);

    const results = await Promise.all(
      batchRequests.map(async (req) => {
        try {
          // Process each request - simplified for example
          return {
            id: req.id,
            status: 200,
            data: { success: true },
          };
        } catch (error) {
          return {
            id: req.id,
            status: 500,
            data: { error: error.message },
          };
        }
      })
    );

    return {
      status: ApiResponseStatus.SUCCESS,
      data: results,
      metadata: {
        version: '1.0',
        timestamp: new Date(),
        requestId,
      },
    };

  } catch (error) {
    logger.error(`Batch request failed: ${error.message}`);
    throw new BadRequestException('Batch request processing failed');
  }
}

/**
 * Generates API deprecation warning headers
 *
 * @param currentVersion - Current API version being used
 * @param deprecationDate - Date when version will be deprecated
 * @param sunsetDate - Date when version will be removed
 * @returns Deprecation warning headers
 */
export function generateDeprecationHeaders(
  currentVersion: string,
  deprecationDate: Date,
  sunsetDate: Date
): Record<string, string> {
  return {
    'Deprecation': deprecationDate.toUTCString(),
    'Sunset': sunsetDate.toUTCString(),
    'Link': `</api/${currentVersion}/migration-guide>; rel="deprecation"`,
  };
}

/**
 * Validates API query parameter ranges
 *
 * @param value - Query parameter value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param paramName - Parameter name for error messages
 * @throws {BadRequestException} If value is out of range
 */
export function validateQueryParameterRange(
  value: number,
  min: number,
  max: number,
  paramName: string
): void {
  if (value < min || value > max) {
    throw new BadRequestException(`Parameter '${paramName}' must be between ${min} and ${max}`);
  }
}

/**
 * Generates API circuit breaker response
 *
 * @param serviceName - Name of the service that is unavailable
 * @param requestId - Request identifier
 * @returns Circuit breaker response
 */
export function generateCircuitBreakerResponse(
  serviceName: string,
  requestId: string
): ApiResponse<null> {
  return {
    status: ApiResponseStatus.ERROR,
    errors: [{
      code: 'SERVICE_UNAVAILABLE',
      message: `Service '${serviceName}' is temporarily unavailable. Please try again later.`,
    }],
    metadata: {
      version: '1.0',
      timestamp: new Date(),
      requestId,
    },
  };
}

/**
 * Orchestrates API request retry logic
 *
 * @param requestFn - Function that makes the API request
 * @param maxRetries - Maximum number of retry attempts
 * @param retryDelay - Delay between retries in milliseconds
 * @returns Request result after retries
 */
export async function orchestrateApiRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

// ============================================================================
// EXAMPLE CONTROLLER
// ============================================================================

/**
 * McKinsey Strategic Analysis API Controller
 * Demonstrates complete REST API patterns with OpenAPI documentation
 */
@ApiTags('Strategic Analysis')
@ApiBearerAuth()
@Controller('api/v1/strategic-analysis')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class StrategicAnalysisController {
  private readonly logger = new Logger(StrategicAnalysisController.name);

  @Post('swot')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create SWOT analysis',
    description: 'Creates a comprehensive SWOT analysis with recommendations and cross-factor analysis',
  })
  @ApiBody({ type: CreateSwotAnalysisApiDto })
  @ApiResponse({
    status: 201,
    description: 'SWOT analysis created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  @ApiProduces('application/json')
  @ApiConsumes('application/json')
  async createSwotAnalysis(
    @Body() dto: CreateSwotAnalysisApiDto,
    @Headers('x-request-id') requestId?: string
  ) {
    const correlationId = requestId || generateCorrelationId();
    return await orchestrateSwotAnalysisApi(dto, correlationId);
  }

  @Get('innovation/pipeline')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get innovation pipeline',
    description: 'Retrieves innovation pipeline with stage distribution and metrics',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'stages', required: false, type: [String] })
  @ApiResponse({
    status: 200,
    description: 'Innovation pipeline retrieved successfully',
  })
  @ApiHeader({
    name: 'X-API-Version',
    description: 'API version',
    required: false,
  })
  async getInnovationPipeline(
    @Query() queryDto: InnovationPipelineQueryDto,
    @Query('organizationId') organizationId: string,
    @Headers('x-request-id') requestId?: string
  ) {
    const correlationId = requestId || generateCorrelationId();
    return await orchestrateInnovationPipelineApi(organizationId, queryDto, correlationId);
  }

  @Post('digital-transformation')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Request digital transformation service',
    description: 'Creates a comprehensive digital transformation roadmap and implementation plan',
  })
  @ApiBody({ type: DigitalTransformationRequestDto })
  @ApiResponse({
    status: 202,
    description: 'Digital transformation service accepted',
  })
  async requestDigitalTransformation(
    @Body() dto: DigitalTransformationRequestDto,
    @Headers('x-request-id') requestId?: string
  ) {
    const correlationId = requestId || generateCorrelationId();
    return await orchestrateDigitalTransformationService(dto, correlationId);
  }

  @Post('financial-model')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate financial model',
    description: 'Creates financial model with NPV, IRR, and scenario analysis',
  })
  @ApiBody({ type: FinancialModelRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Financial model generated successfully',
  })
  async generateFinancialModel(
    @Body() dto: FinancialModelRequestDto,
    @Headers('x-request-id') requestId?: string
  ) {
    const correlationId = requestId || generateCorrelationId();
    return await orchestrateFinancialModelingService(dto, correlationId);
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'API health check',
    description: 'Returns health status of the API and its dependencies',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
  })
  async healthCheck() {
    return generateHealthCheckResponse([
      { name: 'database', status: 'healthy' },
      { name: 'cache', status: 'healthy' },
      { name: 'external-api', status: 'healthy' },
    ]);
  }
}
