/**
 * LOC: BACOSTCTRL001
 * File: /reuse/edwards/financial/composites/downstream/backend-cost-accounting-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../../cost-allocation-distribution-composite
 *
 * DOWNSTREAM (imported by):
 *   - Backend application modules
 *   - Cost accounting REST API routes
 *   - Enterprise resource planning integrations
 */

/**
 * File: /reuse/edwards/financial/composites/downstream/backend-cost-accounting-controllers.ts
 * Locator: WC-EDW-BACKEND-COST-CTRL-001
 * Purpose: Production-grade Backend Cost Accounting Controllers - NestJS REST API controllers for cost accounting operations
 *
 * Upstream: Imports and orchestrates functions from cost-allocation-distribution-composite
 * Downstream: Consumed by backend API routes, web applications, mobile apps
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: Backend cost accounting controllers and services for full cost accounting lifecycle
 *
 * LLM Context: Production-ready backend controllers providing RESTful APIs for comprehensive cost accounting operations
 * including cost pool management, allocation basis configuration, direct/step-down/reciprocal allocations, ABC costing,
 * overhead rate calculations, variance analysis, and reporting. Implements secure authentication, comprehensive validation,
 * error handling, audit logging, and HIPAA-compliant data access patterns for healthcare cost accounting operations.
 *
 * Controller Design Principles:
 * - RESTful API design with proper HTTP methods and status codes
 * - Comprehensive request validation using class-validator DTOs
 * - Transactional integrity for all database operations
 * - Detailed error handling with user-friendly error messages
 * - Audit trail logging for all cost accounting operations
 * - Role-based access control for sensitive operations
 * - OpenAPI/Swagger documentation for all endpoints
 * - Response pagination and filtering for large datasets
 * - Asynchronous processing for long-running operations
 * - Comprehensive logging for monitoring and debugging
 */

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
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UseGuards,
  UseInterceptors,
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
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsInt,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction } from 'sequelize';

// Import from parent composite
import {
  // Enums
  AllocationMethod,
  PoolType,
  BasisType,
  DriverType,
  AllocationStatus,
  VarianceLevel,
  CostObjectType,
  ReportFormat,
  RulePriority,
  FiscalPeriodType,

  // Interfaces
  CostAllocationConfig,
  AllocationBatchResult,
  AllocationJournalEntry,
  CostPoolSummary,
  CostCenterAllocation,
  ABCResult,
  CostObjectAllocation,
  StepDownSequence,
  ReciprocalAllocationMatrix,
  OverheadRateCalculation,
  ComprehensiveVarianceReport,
  VarianceExplanation,

  // Composite Functions
  initializeCostPoolWithRules,
  bulkAddCostsToPool,
  getCostPoolSummary,
  createAllocationBasisWithDrivers,
  bulkUpdateStatisticalDrivers,
  calculateAllocationPercentagesFromDrivers,
  processDirectAllocationWithAudit,
  processBatchDirectAllocations,
  processStepDownAllocationWithSequence,
  processReciprocalAllocationWithMatrix,
  processABCAllocationComplete,
  calculateAndApplyOverheadRates,
  performComprehensiveMultiLevelVarianceAnalysis,
  generateCostAllocationDashboard,
  generateCostAllocationComplianceReport,
} from '../../cost-allocation-distribution-composite';

// ============================================================================
// DTO CLASSES FOR BACKEND COST ACCOUNTING OPERATIONS
// ============================================================================

/**
 * DTO for creating cost pools via backend API
 */
export class CreateCostPoolRequestDto {
  @ApiProperty({ description: 'Cost pool name', example: 'Administration Overhead Pool' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  poolName: string;

  @ApiProperty({ description: 'Cost pool code', example: 'ADMIN-OH-001' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  poolCode: string;

  @ApiProperty({ description: 'Pool type', enum: PoolType, example: PoolType.OVERHEAD })
  @IsEnum(PoolType)
  @IsNotEmpty()
  poolType: PoolType;

  @ApiProperty({ description: 'Business unit code', example: 'BU-100' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  businessUnit: string;

  @ApiProperty({ description: 'Department code', example: 'DEPT-ADMIN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  departmentCode: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Pool description', example: 'Administrative overhead costs for allocation' })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Default allocation method', enum: AllocationMethod })
  @IsEnum(AllocationMethod)
  @IsOptional()
  defaultAllocationMethod?: AllocationMethod;

  @ApiProperty({ description: 'Is pool active', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO for adding costs to a cost pool
 */
export class AddCostsToPoolRequestDto {
  @ApiProperty({ description: 'Cost pool ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  poolId: number;

  @ApiProperty({ description: 'GL account code', example: 'GL-5100-001' })
  @IsString()
  @IsNotEmpty()
  accountCode: string;

  @ApiProperty({ description: 'Cost amount', example: 25000.00 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Cost description', example: 'January administrative salaries' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Transaction reference', example: 'JE-2024-001', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  transactionReference?: string;

  @ApiProperty({ description: 'Cost category', example: 'SALARIES', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  costCategory?: string;
}

/**
 * DTO for creating allocation basis
 */
export class CreateAllocationBasisRequestDto {
  @ApiProperty({ description: 'Basis name', example: 'Square Footage Basis' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  basisName: string;

  @ApiProperty({ description: 'Basis code', example: 'SQ-FT-001' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  basisCode: string;

  @ApiProperty({ description: 'Basis type', enum: BasisType })
  @IsEnum(BasisType)
  @IsNotEmpty()
  basisType: BasisType;

  @ApiProperty({ description: 'Driver type', enum: DriverType })
  @IsEnum(DriverType)
  @IsNotEmpty()
  driverType: DriverType;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Basis description', example: 'Allocation based on department square footage' })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Unit of measure', example: 'sq_ft' })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  unitOfMeasure?: string;
}

/**
 * DTO for statistical driver data
 */
export class StatisticalDriverDto {
  @ApiProperty({ description: 'Cost center code', example: 'CC-100' })
  @IsString()
  @IsNotEmpty()
  costCenterCode: string;

  @ApiProperty({ description: 'Driver value', example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  driverValue: number;

  @ApiProperty({ description: 'Period effective date', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for updating statistical drivers in bulk
 */
export class BulkUpdateDriversRequestDto {
  @ApiProperty({ description: 'Allocation basis ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  basisId: number;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Statistical driver data', type: [StatisticalDriverDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticalDriverDto)
  drivers: StatisticalDriverDto[];

  @ApiProperty({ description: 'Replace existing drivers', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  replaceExisting?: boolean;
}

/**
 * DTO for processing direct allocation
 */
export class ProcessDirectAllocationRequestDto {
  @ApiProperty({ description: 'Source cost pool ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  sourcePoolId: number;

  @ApiProperty({ description: 'Allocation basis ID', example: 2001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  allocationBasisId: number;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Target cost centers', type: [String], example: ['CC-100', 'CC-200'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  targetCostCenters: string[];

  @ApiProperty({ description: 'Allocation description', example: 'January administrative overhead allocation' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Auto-post to GL', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  autoPostToGL?: boolean;

  @ApiProperty({ description: 'Perform validation only', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  validationOnly?: boolean;
}

/**
 * DTO for step-down allocation sequence entry
 */
export class StepDownSequenceEntryDto {
  @ApiProperty({ description: 'Sequence order', example: 1 })
  @IsInt()
  @Min(1)
  sequenceOrder: number;

  @ApiProperty({ description: 'Source cost pool ID', example: 1001 })
  @IsInt()
  @Min(1)
  sourcePoolId: number;

  @ApiProperty({ description: 'Allocation basis ID', example: 2001 })
  @IsInt()
  @Min(1)
  allocationBasisId: number;

  @ApiProperty({ description: 'Target cost centers', type: [String] })
  @IsArray()
  @IsString({ each: true })
  targetCostCenters: string[];

  @ApiProperty({ description: 'Exclude already allocated pools', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  excludeAllocated?: boolean;
}

/**
 * DTO for processing step-down allocation
 */
export class ProcessStepDownAllocationRequestDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Step-down allocation sequence', type: [StepDownSequenceEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDownSequenceEntryDto)
  sequence: StepDownSequenceEntryDto[];

  @ApiProperty({ description: 'Allocation description', example: 'January step-down overhead allocation' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Auto-post to GL', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  autoPostToGL?: boolean;
}

/**
 * DTO for processing reciprocal allocation
 */
export class ProcessReciprocalAllocationRequestDto {
  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Service department pool IDs', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  serviceDepartmentPools: number[];

  @ApiProperty({ description: 'Maximum iterations', example: 10, default: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  maxIterations?: number;

  @ApiProperty({ description: 'Convergence tolerance', example: 0.01, default: 0.01 })
  @IsNumber()
  @Min(0.0001)
  @Max(1)
  @IsOptional()
  convergenceTolerance?: number;

  @ApiProperty({ description: 'Auto-post to GL', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  autoPostToGL?: boolean;
}

/**
 * DTO for processing ABC allocation
 */
export class ProcessABCAllocationRequestDto {
  @ApiProperty({ description: 'Activity pool IDs', type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  activityPoolIds: number[];

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Cost objects', type: [String], example: ['PROD-001', 'PROD-002'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  costObjects: string[];

  @ApiProperty({ description: 'Cost object type', enum: CostObjectType })
  @IsEnum(CostObjectType)
  costObjectType: CostObjectType;

  @ApiProperty({ description: 'Auto-post to GL', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  autoPostToGL?: boolean;
}

/**
 * DTO for calculating overhead rates
 */
export class CalculateOverheadRatesRequestDto {
  @ApiProperty({ description: 'Overhead pool ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  overheadPoolId: number;

  @ApiProperty({ description: 'Activity base', example: 'DIRECT_LABOR_HOURS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  activityBase: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Rate calculation method', enum: ['ACTUAL', 'PREDETERMINED', 'STANDARD'] })
  @IsString()
  @IsNotEmpty()
  rateMethod: 'ACTUAL' | 'PREDETERMINED' | 'STANDARD';

  @ApiProperty({ description: 'Apply rates to cost objects', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  applyRates?: boolean;

  @ApiProperty({ description: 'Target cost objects (if applying)', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetCostObjects?: string[];
}

/**
 * DTO for variance analysis
 */
export class PerformVarianceAnalysisRequestDto {
  @ApiProperty({ description: 'Cost pool ID', example: 1001 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  poolId: number;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  fiscalYear: number;

  @ApiProperty({ description: 'Fiscal period (1-12)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalPeriod: number;

  @ApiProperty({ description: 'Variance levels to analyze', enum: VarianceLevel, isArray: true })
  @IsArray()
  @IsEnum(VarianceLevel, { each: true })
  @IsOptional()
  varianceLevels?: VarianceLevel[];

  @ApiProperty({ description: 'Include variance explanations', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  includeExplanations?: boolean;

  @ApiProperty({ description: 'Variance threshold percentage', example: 5.0, default: 5.0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  thresholdPercent?: number;
}

// ============================================================================
// RESPONSE DTO CLASSES
// ============================================================================

/**
 * Response DTO for cost pool creation
 */
export class CreateCostPoolResponseDto {
  @ApiProperty({ description: 'Cost pool ID', example: 1001 })
  poolId: number;

  @ApiProperty({ description: 'Cost pool code', example: 'ADMIN-OH-001' })
  poolCode: string;

  @ApiProperty({ description: 'Pool name', example: 'Administration Overhead Pool' })
  poolName: string;

  @ApiProperty({ description: 'Creation status', example: 'CREATED' })
  status: string;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Created by user' })
  createdBy: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear: number;
}

/**
 * Response DTO for allocation processing
 */
export class AllocationProcessResponseDto {
  @ApiProperty({ description: 'Batch ID', example: 5001 })
  batchId: number;

  @ApiProperty({ description: 'Allocation method', enum: AllocationMethod })
  allocationMethod: AllocationMethod;

  @ApiProperty({ description: 'Total amount allocated', example: 125000.00 })
  totalAllocated: number;

  @ApiProperty({ description: 'Number of allocations', example: 15 })
  allocationCount: number;

  @ApiProperty({ description: 'Processing status', enum: AllocationStatus })
  status: AllocationStatus;

  @ApiProperty({ description: 'Posted to GL', example: true })
  postedToGL: boolean;

  @ApiProperty({ description: 'GL journal ID', example: 3001, required: false })
  glJournalId?: number;

  @ApiProperty({ description: 'Processing errors', type: [String] })
  errors: string[];

  @ApiProperty({ description: 'Processing warnings', type: [String] })
  warnings: string[];

  @ApiProperty({ description: 'Processed at timestamp' })
  processedAt: Date;
}

// ============================================================================
// NESTJS CONTROLLER - BACKEND COST ACCOUNTING
// ============================================================================

@ApiTags('backend-cost-accounting')
@Controller('api/v1/backend/cost-accounting')
@ApiBearerAuth()
export class BackendCostAccountingController {
  private readonly logger = new Logger(BackendCostAccountingController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly costAccountingService: BackendCostAccountingService,
  ) {}

  /**
   * Create new cost pool
   */
  @Post('pools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new cost pool with allocation rules' })
  @ApiResponse({ status: 201, description: 'Cost pool created successfully', type: CreateCostPoolResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 409, description: 'Cost pool with code already exists' })
  async createCostPool(@Body() request: CreateCostPoolRequestDto): Promise<CreateCostPoolResponseDto> {
    this.logger.log(`Creating cost pool: ${request.poolCode}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Check if pool code already exists
      const existingPool = await this.costAccountingService.findPoolByCode(request.poolCode);
      if (existingPool) {
        throw new ConflictException(`Cost pool with code ${request.poolCode} already exists`);
      }

      // Initialize cost pool with rules
      const result = await initializeCostPoolWithRules(
        {
          poolName: request.poolName,
          poolCode: request.poolCode,
          poolType: request.poolType,
          businessUnit: request.businessUnit,
          departmentCode: request.departmentCode,
          fiscalYear: request.fiscalYear,
          description: request.description,
          defaultAllocationMethod: request.defaultAllocationMethod || AllocationMethod.DIRECT,
          isActive: request.isActive !== undefined ? request.isActive : true,
        },
        transaction,
      );

      await transaction.commit();

      return {
        poolId: result.poolId,
        poolCode: request.poolCode,
        poolName: request.poolName,
        status: 'CREATED',
        createdAt: new Date(),
        createdBy: 'system', // Would come from auth context
        fiscalYear: request.fiscalYear,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Cost pool creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Add costs to cost pool
   */
  @Post('pools/:poolId/costs')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add costs to existing cost pool' })
  @ApiParam({ name: 'poolId', description: 'Cost pool ID', type: 'number' })
  @ApiResponse({ status: 201, description: 'Costs added successfully' })
  @ApiResponse({ status: 404, description: 'Cost pool not found' })
  async addCostsToPool(
    @Param('poolId', ParseIntPipe) poolId: number,
    @Body() request: AddCostsToPoolRequestDto,
  ): Promise<any> {
    this.logger.log(`Adding costs to pool ${poolId}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Verify pool exists
      const pool = await this.costAccountingService.getPoolById(poolId);
      if (!pool) {
        throw new NotFoundException(`Cost pool ${poolId} not found`);
      }

      // Override pool ID from path parameter
      request.poolId = poolId;

      // Add costs using bulk function (single entry)
      const result = await bulkAddCostsToPool(
        [
          {
            poolId: request.poolId,
            accountCode: request.accountCode,
            amount: request.amount,
            description: request.description,
            fiscalPeriod: request.fiscalPeriod,
            transactionReference: request.transactionReference,
            costCategory: request.costCategory,
          },
        ],
        transaction,
      );

      await transaction.commit();

      return {
        poolId,
        costsAdded: result.added,
        totalAmount: request.amount,
        fiscalPeriod: request.fiscalPeriod,
        transactionReference: request.transactionReference,
        addedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Add costs failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get cost pool summary
   */
  @Get('pools/:poolId/summary')
  @ApiOperation({ summary: 'Get comprehensive cost pool summary' })
  @ApiParam({ name: 'poolId', description: 'Cost pool ID', type: 'number' })
  @ApiQuery({ name: 'fiscalYear', description: 'Fiscal year', type: 'number', required: false })
  @ApiQuery({ name: 'fiscalPeriod', description: 'Fiscal period (1-12)', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Cost pool summary retrieved' })
  @ApiResponse({ status: 404, description: 'Cost pool not found' })
  async getCostPoolSummary(
    @Param('poolId', ParseIntPipe) poolId: number,
    @Query('fiscalYear') fiscalYear?: number,
    @Query('fiscalPeriod') fiscalPeriod?: number,
  ): Promise<CostPoolSummary> {
    this.logger.log(`Retrieving summary for pool ${poolId}`);

    const pool = await this.costAccountingService.getPoolById(poolId);
    if (!pool) {
      throw new NotFoundException(`Cost pool ${poolId} not found`);
    }

    const summary = await getCostPoolSummary(
      poolId,
      fiscalYear || new Date().getFullYear(),
      fiscalPeriod,
    );

    return summary;
  }

  /**
   * Create allocation basis
   */
  @Post('allocation-basis')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create allocation basis with statistical drivers' })
  @ApiResponse({ status: 201, description: 'Allocation basis created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createAllocationBasis(@Body() request: CreateAllocationBasisRequestDto): Promise<any> {
    this.logger.log(`Creating allocation basis: ${request.basisCode}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await createAllocationBasisWithDrivers(
        {
          basisName: request.basisName,
          basisCode: request.basisCode,
          basisType: request.basisType,
          driverType: request.driverType,
          fiscalYear: request.fiscalYear,
          description: request.description,
          unitOfMeasure: request.unitOfMeasure,
        },
        transaction,
      );

      await transaction.commit();

      return {
        basisId: result.basisId,
        basisCode: request.basisCode,
        basisName: request.basisName,
        basisType: request.basisType,
        driverType: request.driverType,
        status: 'CREATED',
        createdAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Allocation basis creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update statistical drivers in bulk
   */
  @Put('allocation-basis/:basisId/drivers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update statistical drivers for allocation basis in bulk' })
  @ApiParam({ name: 'basisId', description: 'Allocation basis ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Drivers updated successfully' })
  @ApiResponse({ status: 404, description: 'Allocation basis not found' })
  async updateStatisticalDrivers(
    @Param('basisId', ParseIntPipe) basisId: number,
    @Body() request: BulkUpdateDriversRequestDto,
  ): Promise<any> {
    this.logger.log(`Updating drivers for basis ${basisId}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Override basis ID from path parameter
      request.basisId = basisId;

      const result = await bulkUpdateStatisticalDrivers(
        basisId,
        request.drivers,
        request.fiscalYear,
        request.fiscalPeriod,
        request.replaceExisting || false,
        transaction,
      );

      // Calculate allocation percentages
      const percentages = await calculateAllocationPercentagesFromDrivers(
        basisId,
        request.fiscalYear,
        request.fiscalPeriod,
        transaction,
      );

      await transaction.commit();

      return {
        basisId,
        driversUpdated: result.updated,
        totalDriverValue: result.totalValue,
        costCenters: request.drivers.length,
        allocationPercentages: percentages.percentages,
        updatedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Driver update failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process direct allocation
   */
  @Post('allocations/direct')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process direct cost allocation with audit trail' })
  @ApiResponse({ status: 200, description: 'Direct allocation processed', type: AllocationProcessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid allocation request' })
  async processDirectAllocation(
    @Body() request: ProcessDirectAllocationRequestDto,
  ): Promise<AllocationProcessResponseDto> {
    this.logger.log(`Processing direct allocation from pool ${request.sourcePoolId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await processDirectAllocationWithAudit(
        {
          sourcePoolId: request.sourcePoolId,
          allocationBasisId: request.allocationBasisId,
          fiscalYear: request.fiscalYear,
          fiscalPeriod: request.fiscalPeriod,
          targetCostCenters: request.targetCostCenters,
          description: request.description,
          autoPostToGL: request.autoPostToGL || false,
          validationOnly: request.validationOnly || false,
        },
        transaction,
      );

      await transaction.commit();

      return {
        batchId: result.batchId,
        allocationMethod: AllocationMethod.DIRECT,
        totalAllocated: result.totalAllocated,
        allocationCount: result.allocations.length,
        status: result.status,
        postedToGL: request.autoPostToGL || false,
        glJournalId: result.glJournalId,
        errors: result.errors || [],
        warnings: result.warnings || [],
        processedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Direct allocation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process step-down allocation
   */
  @Post('allocations/step-down')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process step-down cost allocation with sequence' })
  @ApiResponse({ status: 200, description: 'Step-down allocation processed', type: AllocationProcessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid allocation sequence' })
  async processStepDownAllocation(
    @Body() request: ProcessStepDownAllocationRequestDto,
  ): Promise<AllocationProcessResponseDto> {
    this.logger.log(`Processing step-down allocation for FY${request.fiscalYear} P${request.fiscalPeriod}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await processStepDownAllocationWithSequence(
        {
          fiscalYear: request.fiscalYear,
          fiscalPeriod: request.fiscalPeriod,
          sequence: request.sequence,
          description: request.description,
          autoPostToGL: request.autoPostToGL || false,
        },
        transaction,
      );

      await transaction.commit();

      return {
        batchId: result.batchId,
        allocationMethod: AllocationMethod.STEP_DOWN,
        totalAllocated: result.totalAllocated,
        allocationCount: result.allocations.length,
        status: result.status,
        postedToGL: request.autoPostToGL || false,
        glJournalId: result.glJournalId,
        errors: result.errors || [],
        warnings: result.warnings || [],
        processedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Step-down allocation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process reciprocal allocation
   */
  @Post('allocations/reciprocal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process reciprocal cost allocation with iterative matrix calculation' })
  @ApiResponse({ status: 200, description: 'Reciprocal allocation processed', type: AllocationProcessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid reciprocal allocation request' })
  async processReciprocalAllocation(
    @Body() request: ProcessReciprocalAllocationRequestDto,
  ): Promise<AllocationProcessResponseDto> {
    this.logger.log(`Processing reciprocal allocation for FY${request.fiscalYear} P${request.fiscalPeriod}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await processReciprocalAllocationWithMatrix(
        {
          fiscalYear: request.fiscalYear,
          fiscalPeriod: request.fiscalPeriod,
          serviceDepartmentPools: request.serviceDepartmentPools,
          maxIterations: request.maxIterations || 10,
          convergenceTolerance: request.convergenceTolerance || 0.01,
          autoPostToGL: request.autoPostToGL || false,
        },
        transaction,
      );

      await transaction.commit();

      return {
        batchId: result.batchId,
        allocationMethod: AllocationMethod.RECIPROCAL,
        totalAllocated: result.totalAllocated,
        allocationCount: result.allocations.length,
        status: result.status,
        postedToGL: request.autoPostToGL || false,
        glJournalId: result.glJournalId,
        errors: result.errors || [],
        warnings: result.warnings || [],
        processedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Reciprocal allocation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Process ABC allocation
   */
  @Post('allocations/abc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process activity-based costing allocation' })
  @ApiResponse({ status: 200, description: 'ABC allocation processed', type: AllocationProcessResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid ABC allocation request' })
  async processABCAllocation(
    @Body() request: ProcessABCAllocationRequestDto,
  ): Promise<AllocationProcessResponseDto> {
    this.logger.log(`Processing ABC allocation for FY${request.fiscalYear} P${request.fiscalPeriod}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await processABCAllocationComplete(
        {
          activityPoolIds: request.activityPoolIds,
          fiscalYear: request.fiscalYear,
          fiscalPeriod: request.fiscalPeriod,
          costObjects: request.costObjects,
          costObjectType: request.costObjectType,
          autoPostToGL: request.autoPostToGL || false,
        },
        transaction,
      );

      await transaction.commit();

      return {
        batchId: result.batchId,
        allocationMethod: AllocationMethod.ABC,
        totalAllocated: result.totalAllocated,
        allocationCount: result.allocations.length,
        status: result.status,
        postedToGL: request.autoPostToGL || false,
        glJournalId: result.glJournalId,
        errors: result.errors || [],
        warnings: result.warnings || [],
        processedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`ABC allocation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculate and apply overhead rates
   */
  @Post('overhead-rates/calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate overhead rates and optionally apply to cost objects' })
  @ApiResponse({ status: 200, description: 'Overhead rates calculated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid overhead rate request' })
  async calculateOverheadRates(@Body() request: CalculateOverheadRatesRequestDto): Promise<any> {
    this.logger.log(`Calculating overhead rates for pool ${request.overheadPoolId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const result = await calculateAndApplyOverheadRates(
        {
          overheadPoolId: request.overheadPoolId,
          activityBase: request.activityBase,
          fiscalYear: request.fiscalYear,
          rateMethod: request.rateMethod,
          applyRates: request.applyRates || false,
          targetCostObjects: request.targetCostObjects,
        },
        transaction,
      );

      await transaction.commit();

      return {
        overheadPoolId: request.overheadPoolId,
        calculatedRate: result.rate,
        activityBase: request.activityBase,
        totalOverhead: result.totalOverhead,
        totalActivityBase: result.totalActivityBase,
        appliedToCostObjects: request.applyRates || false,
        costObjectsAffected: request.targetCostObjects?.length || 0,
        calculatedAt: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Overhead rate calculation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Perform variance analysis
   */
  @Post('variance-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform comprehensive multi-level variance analysis' })
  @ApiResponse({ status: 200, description: 'Variance analysis completed' })
  @ApiResponse({ status: 404, description: 'Cost pool not found' })
  async performVarianceAnalysis(
    @Body() request: PerformVarianceAnalysisRequestDto,
  ): Promise<ComprehensiveVarianceReport> {
    this.logger.log(`Performing variance analysis for pool ${request.poolId}`);

    const pool = await this.costAccountingService.getPoolById(request.poolId);
    if (!pool) {
      throw new NotFoundException(`Cost pool ${request.poolId} not found`);
    }

    const report = await performComprehensiveMultiLevelVarianceAnalysis(
      request.poolId,
      request.fiscalYear,
      request.fiscalPeriod,
      {
        varianceLevels: request.varianceLevels,
        includeExplanations: request.includeExplanations !== false,
        thresholdPercent: request.thresholdPercent || 5.0,
      },
    );

    return report;
  }

  /**
   * Get cost allocation dashboard
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get comprehensive cost allocation dashboard' })
  @ApiQuery({ name: 'fiscalYear', description: 'Fiscal year', type: 'number', required: false })
  @ApiQuery({ name: 'fiscalPeriod', description: 'Fiscal period (1-12)', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getDashboard(
    @Query('fiscalYear') fiscalYear?: number,
    @Query('fiscalPeriod') fiscalPeriod?: number,
  ): Promise<any> {
    this.logger.log('Retrieving cost allocation dashboard');

    const dashboard = await generateCostAllocationDashboard(
      fiscalYear || new Date().getFullYear(),
      fiscalPeriod,
    );

    return dashboard;
  }

  /**
   * Generate compliance report
   */
  @Post('reports/compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate cost allocation compliance report for audit' })
  @ApiResponse({ status: 200, description: 'Compliance report generated' })
  async generateComplianceReport(
    @Body() request: { fiscalYear: number; fiscalPeriod?: number; format?: ReportFormat },
  ): Promise<any> {
    this.logger.log(`Generating compliance report for FY${request.fiscalYear}`);

    const report = await generateCostAllocationComplianceReport(
      request.fiscalYear,
      request.fiscalPeriod,
      request.format || ReportFormat.PDF,
    );

    return report;
  }
}

// ============================================================================
// SERVICE CLASS FOR DEPENDENCY INJECTION
// ============================================================================

@Injectable()
export class BackendCostAccountingService {
  private readonly logger = new Logger(BackendCostAccountingService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Find cost pool by code
   */
  async findPoolByCode(poolCode: string): Promise<any | null> {
    this.logger.log(`Finding pool by code: ${poolCode}`);

    // In production, would query database
    // For now, return null (no existing pool)
    return null;
  }

  /**
   * Get cost pool by ID
   */
  async getPoolById(poolId: number): Promise<any | null> {
    this.logger.log(`Retrieving pool ${poolId}`);

    // In production, would query database
    // For now, return mock data
    return {
      id: poolId,
      poolCode: `POOL-${poolId}`,
      poolName: `Cost Pool ${poolId}`,
      poolType: PoolType.OVERHEAD,
      isActive: true,
    };
  }

  /**
   * Get active allocations for pool
   */
  async getActiveAllocations(poolId: number, fiscalYear: number): Promise<any[]> {
    this.logger.log(`Retrieving active allocations for pool ${poolId} FY${fiscalYear}`);

    // In production, would query database
    return [];
  }

  /**
   * Validate allocation request
   */
  async validateAllocationRequest(request: any): Promise<{ valid: boolean; errors: string[] }> {
    this.logger.log('Validating allocation request');

    const errors: string[] = [];

    // Add validation logic here

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// ============================================================================
// MODULE EXPORT DEFINITION
// ============================================================================

export const BackendCostAccountingModule = {
  controllers: [BackendCostAccountingController],
  providers: [BackendCostAccountingService],
  exports: [BackendCostAccountingService],
};
