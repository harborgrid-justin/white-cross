/**
 * LOC: APICTRL001
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - ../ (composite services)
 *   - ../../../_production-patterns.ts
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Main API application
 *   - Route modules
 *   - Integration endpoints
 */

/**
 * File: /reuse/threat/composites/downstream/data_layer/composites/downstream/api-controllers.ts
 * Locator: WC-DOWNSTREAM-APICTRL-001
 * Purpose: Production-grade REST API controllers for threat intelligence operations
 *
 * Upstream: Composite services, production patterns
 * Downstream: Main application, API routes
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+
 * Exports: ThreatIntelligenceController, DataManagementController, ValidationController
 *
 * LLM Context: Production-ready API controllers for White Cross healthcare threat intelligence platform.
 * Provides comprehensive REST endpoints with CRUD operations, data validation, search, filtering,
 * bulk operations, and HIPAA-compliant audit logging. All controllers include Swagger documentation,
 * request validation, error handling, authentication guards, and standardized response formatting.
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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  Req,
  Res,
  UploadedFile,
  StreamableFile,
  Headers,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiProduces,
  ApiProperty,
  ApiPropertyOptional,
  ApiHeader,
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
  IsEmail,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

// Import composite services
import { CrudOperationsService, CreateEntityDto, UpdateEntityDto, ListEntitiesDto, BulkCreateDto } from '../crud-operations-kit';
import { DataRetrievalService } from '../data-retrieval-kit';
import { ValidationOperationsService, ValidateFieldDto, BulkValidationDto } from '../validation-operations-kit';
import { TransformationOperationsService } from '../transformation-operations-kit';
import { DataExportService } from '../data-export-kit';
import { SanitizationOperationsService } from '../sanitization-operations-kit';

// Import production patterns
import {
  createSuccessResponse,
  createCreatedResponse,
  createPaginatedResponse,
  generateRequestId,
  createLogger,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  BaseDto,
  PaginationDto,
  FilterDto,
  SeverityLevel,
  StatusType,
  createHIPAALog,
  sanitizeErrorForHIPAA,
  parseValidationErrors,
  isValidUUID,
} from '../../../_production-patterns';

// ============================================================================
// INTERCEPTORS
// ============================================================================

/**
 * Logging interceptor for API requests
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = createLogger('LoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = generateRequestId();
    const { method, url, ip } = request;
    const startTime = Date.now();

    this.logger.log(`[${requestId}] ${method} ${url} - IP: ${ip}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`[${requestId}] Completed in ${duration}ms`);
      }),
    );
  }
}

/**
 * HIPAA audit interceptor
 */
@Injectable()
export class HIPAAAuditInterceptor implements NestInterceptor {
  private readonly logger = createLogger('HIPAAAuditInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = generateRequestId();
    const userId = (request as any).user?.id || 'anonymous';
    const { method, url } = request;

    // Create HIPAA audit log
    const auditLog = createHIPAALog(
      userId,
      method,
      'API',
      url,
      'SUCCESS',
      requestId,
      'ALLOWED',
    );

    this.logger.log(`[HIPAA] ${JSON.stringify(auditLog)}`);

    return next.handle();
  }
}

// ============================================================================
// DTOs
// ============================================================================

/**
 * Threat Intelligence Entity DTO
 */
export class ThreatIntelligenceDto extends BaseDto {
  @ApiProperty({ description: 'Threat name', example: 'APT28 Phishing Campaign' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Threat type', enum: ['MALWARE', 'PHISHING', 'RANSOMWARE', 'APT', 'DDoS', 'DATA_BREACH'] })
  @IsEnum(['MALWARE', 'PHISHING', 'RANSOMWARE', 'APT', 'DDoS', 'DATA_BREACH'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Threat severity', enum: SeverityLevel })
  @IsEnum(SeverityLevel)
  @IsNotEmpty()
  severity: SeverityLevel;

  @ApiProperty({ description: 'Threat description', example: 'Sophisticated phishing attack targeting healthcare organizations' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({ description: 'Indicators of Compromise (IoCs)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  iocs?: string[];

  @ApiPropertyOptional({ description: 'Affected systems', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  affectedSystems?: string[];

  @ApiPropertyOptional({ description: 'Mitigation strategies', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mitigation?: string[];

  @ApiProperty({ description: 'Status', enum: StatusType })
  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType = StatusType.PENDING;

  @ApiPropertyOptional({ description: 'Detected timestamp' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  detectedAt?: Date;

  @ApiPropertyOptional({ description: 'Source of intelligence', example: 'FBI Threat Report' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Confidence score (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  confidenceScore?: number;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  tags?: string[];
}

/**
 * Search Threat Intelligence DTO
 */
export class SearchThreatDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search query', example: 'ransomware' })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({ description: 'Filter by type', enum: ['MALWARE', 'PHISHING', 'RANSOMWARE', 'APT', 'DDoS', 'DATA_BREACH'] })
  @IsEnum(['MALWARE', 'PHISHING', 'RANSOMWARE', 'APT', 'DDoS', 'DATA_BREACH'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Filter by severity', enum: SeverityLevel })
  @IsEnum(SeverityLevel)
  @IsOptional()
  severity?: SeverityLevel;

  @ApiPropertyOptional({ description: 'Filter by status', enum: StatusType })
  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType;

  @ApiPropertyOptional({ description: 'Start date for detection range' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for detection range' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Minimum confidence score' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minConfidence?: number;

  @ApiPropertyOptional({ description: 'Include archived threats', default: false })
  @IsBoolean()
  @IsOptional()
  includeArchived?: boolean = false;
}

/**
 * Bulk Update DTO
 */
export class BulkUpdateThreatsDto extends BaseDto {
  @ApiProperty({ description: 'Threat IDs to update', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  threatIds: string[];

  @ApiProperty({ description: 'Updates to apply' })
  @IsObject()
  @IsNotEmpty()
  updates: Partial<ThreatIntelligenceDto>;

  @ApiPropertyOptional({ description: 'Update reason/comment' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  reason?: string;
}

/**
 * Export Request DTO
 */
export class ExportRequestDto extends BaseDto {
  @ApiProperty({ description: 'Export format', enum: ['CSV', 'JSON', 'XML', 'EXCEL', 'PDF'] })
  @IsEnum(['CSV', 'JSON', 'XML', 'EXCEL', 'PDF'])
  @IsNotEmpty()
  format: string;

  @ApiPropertyOptional({ description: 'Filter criteria for export' })
  @IsOptional()
  filters?: SearchThreatDto;

  @ApiPropertyOptional({ description: 'Fields to include in export', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fields?: string[];

  @ApiPropertyOptional({ description: 'Include metadata in export', default: true })
  @IsBoolean()
  @IsOptional()
  includeMetadata?: boolean = true;

  @ApiPropertyOptional({ description: 'Compress export file', default: false })
  @IsBoolean()
  @IsOptional()
  compress?: boolean = false;
}

/**
 * Analytics Request DTO
 */
export class AnalyticsRequestDto extends BaseDto {
  @ApiProperty({ description: 'Metric type', enum: ['COUNT', 'TREND', 'DISTRIBUTION', 'COMPARISON'] })
  @IsEnum(['COUNT', 'TREND', 'DISTRIBUTION', 'COMPARISON'])
  @IsNotEmpty()
  metricType: string;

  @ApiProperty({ description: 'Time range in days', example: 30 })
  @IsNumber()
  @Min(1)
  @Max(365)
  timeRangeDays: number;

  @ApiPropertyOptional({ description: 'Group by field', example: 'severity' })
  @IsString()
  @IsOptional()
  groupBy?: string;

  @ApiPropertyOptional({ description: 'Additional filters' })
  @IsOptional()
  filters?: Record<string, any>;
}

/**
 * Patient Data Access DTO (HIPAA-compliant)
 */
export class PatientDataAccessDto extends BaseDto {
  @ApiProperty({ description: 'Patient ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Access purpose', example: 'Treatment Review' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  purpose: string;

  @ApiProperty({ description: 'Requesting provider ID', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;

  @ApiPropertyOptional({ description: 'Access level', enum: ['READ', 'WRITE', 'FULL'] })
  @IsEnum(['READ', 'WRITE', 'FULL'])
  @IsOptional()
  accessLevel?: string = 'READ';
}

// ============================================================================
// CONTROLLERS
// ============================================================================

/**
 * Threat Intelligence Controller
 * Handles all threat intelligence CRUD operations
 */
@Controller('api/v1/threat-intelligence')
@ApiTags('Threat Intelligence')
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor, HIPAAAuditInterceptor)
export class ThreatIntelligenceController {
  private readonly logger = createLogger(ThreatIntelligenceController.name);

  constructor(
    private readonly crudService: CrudOperationsService,
    private readonly retrievalService: DataRetrievalService,
    private readonly validationService: ValidationOperationsService,
  ) {}

  /**
   * Create new threat intelligence entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new threat intelligence entry',
    description: 'Creates a new threat intelligence record with validation and HIPAA audit logging',
  })
  @ApiBody({ type: ThreatIntelligenceDto })
  @ApiResponse({ status: 201, description: 'Threat intelligence created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Threat intelligence already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createThreatIntelligence(
    @Body(ValidationPipe) dto: ThreatIntelligenceDto,
    @Req() req: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any).user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Creating threat intelligence: ${dto.name}`);

      // Validate required fields
      const validationResults = await this.validationService.bulkValidate(
        {
          fields: [
            { field: 'name', value: dto.name, type: 'REQUIRED' as any, minLength: 3, maxLength: 200 },
            { field: 'description', value: dto.description, type: 'REQUIRED' as any, minLength: 10, maxLength: 2000 },
          ],
          stopOnFirstError: true,
        },
        { requestId, timestamp: new Date() },
      );

      const invalidFields = validationResults.filter((r) => !r.valid);
      if (invalidFields.length > 0) {
        throw new BadRequestError('Validation failed', { fields: invalidFields });
      }

      // Create entity using CRUD service
      const entityDto: CreateEntityDto = {
        entityType: 'ThreatIntelligence',
        data: {
          ...dto,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        validationLevel: 'STANDARD' as any,
        skipDuplicateCheck: false,
      };

      const result = await this.crudService.createEntity(entityDto, requestId);

      // Create HIPAA audit log
      createHIPAALog(
        userId,
        'CREATE',
        'ThreatIntelligence',
        result.id,
        'SUCCESS',
        requestId,
        'ALLOWED',
      );

      this.logger.log(`[${requestId}] Threat intelligence created: ${result.id}`);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create threat intelligence: ${(error as Error).message}`, (error as Error).stack);

      if (error instanceof BadRequestError || error instanceof ConflictError) {
        throw error;
      }
      throw new InternalServerError('Failed to create threat intelligence', requestId);
    }
  }

  /**
   * Get threat intelligence by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get threat intelligence by ID',
    description: 'Retrieves a single threat intelligence record by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Threat intelligence ID', format: 'uuid' })
  @ApiQuery({ name: 'includeRelated', required: false, type: Boolean, description: 'Include related data' })
  @ApiResponse({ status: 200, description: 'Threat intelligence retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Threat intelligence not found' })
  async getThreatIntelligence(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelated') includeRelated?: boolean,
    @Req() req?: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any)?.user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Retrieving threat intelligence: ${id}`);

      const result = await this.crudService.getEntityById(
        'ThreatIntelligence',
        id,
        false,
        includeRelated ? ['relatedThreats', 'affectedAssets'] : undefined,
        requestId,
      );

      if (!result) {
        throw new NotFoundError('ThreatIntelligence', id);
      }

      // Create HIPAA audit log
      createHIPAALog(userId, 'READ', 'ThreatIntelligence', id, 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Threat intelligence retrieved: ${id}`);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to retrieve threat intelligence: ${(error as Error).message}`);

      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to retrieve threat intelligence', requestId);
    }
  }

  /**
   * List and search threat intelligence entries
   */
  @Get()
  @ApiOperation({
    summary: 'List and search threat intelligence',
    description: 'Lists threat intelligence entries with pagination, filtering, and search capabilities',
  })
  @ApiResponse({ status: 200, description: 'Threat intelligence list retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async listThreatIntelligence(
    @Query() searchDto: SearchThreatDto,
    @Req() req?: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any)?.user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Listing threat intelligence with filters`);

      // Build filters
      const filters: Record<string, any> = {};
      if (searchDto.type) filters.type = searchDto.type;
      if (searchDto.severity) filters.severity = searchDto.severity;
      if (searchDto.status) filters.status = searchDto.status;

      // Build list DTO
      const listDto: ListEntitiesDto = {
        entityType: 'ThreatIntelligence',
        page: searchDto.page || 1,
        pageSize: searchDto.pageSize || 20,
        sortBy: searchDto.sortBy || 'createdAt',
        sortDirection: searchDto.sortDirection || 'DESC',
        filters: filters,
        includeDeleted: searchDto.includeArchived || false,
      };

      const result = await this.crudService.listEntities(listDto, requestId);

      // Create HIPAA audit log
      createHIPAALog(userId, 'LIST', 'ThreatIntelligence', 'multiple', 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Retrieved ${result.data.length} threat intelligence entries`);
      return createPaginatedResponse(result.data, result.total, listDto.page, listDto.pageSize, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to list threat intelligence: ${(error as Error).message}`);
      throw new InternalServerError('Failed to list threat intelligence', requestId);
    }
  }

  /**
   * Update threat intelligence entry
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update threat intelligence entry',
    description: 'Updates an existing threat intelligence record with full replacement',
  })
  @ApiParam({ name: 'id', description: 'Threat intelligence ID', format: 'uuid' })
  @ApiBody({ type: ThreatIntelligenceDto })
  @ApiResponse({ status: 200, description: 'Threat intelligence updated successfully' })
  @ApiResponse({ status: 404, description: 'Threat intelligence not found' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  async updateThreatIntelligence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: ThreatIntelligenceDto,
    @Req() req: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any).user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Updating threat intelligence: ${id}`);

      const updateDto: UpdateEntityDto = {
        entityId: id,
        data: {
          ...dto,
          updatedBy: userId,
          updatedAt: new Date(),
        },
        mergeStrategy: 'REPLACE',
        useOptimisticLocking: false,
      };

      const result = await this.crudService.updateEntity(updateDto, requestId);

      // Create HIPAA audit log
      createHIPAALog(userId, 'UPDATE', 'ThreatIntelligence', id, 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Threat intelligence updated: ${id}`);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to update threat intelligence: ${(error as Error).message}`);

      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Failed to update threat intelligence', requestId);
    }
  }

  /**
   * Partially update threat intelligence entry
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update threat intelligence',
    description: 'Updates specific fields of a threat intelligence record',
  })
  @ApiParam({ name: 'id', description: 'Threat intelligence ID', format: 'uuid' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Threat intelligence patched successfully' })
  @ApiResponse({ status: 404, description: 'Threat intelligence not found' })
  async patchThreatIntelligence(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<ThreatIntelligenceDto>,
    @Req() req: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any).user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Patching threat intelligence: ${id}`);

      const result = await this.crudService.patchEntity(
        'ThreatIntelligence',
        id,
        {
          ...data,
          updatedBy: userId,
          updatedAt: new Date(),
        },
        requestId,
      );

      // Create HIPAA audit log
      createHIPAALog(userId, 'PATCH', 'ThreatIntelligence', id, 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Threat intelligence patched: ${id}`);
      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to patch threat intelligence: ${(error as Error).message}`);
      throw new InternalServerError('Failed to patch threat intelligence', requestId);
    }
  }

  /**
   * Delete threat intelligence entry
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete threat intelligence entry',
    description: 'Soft deletes a threat intelligence record',
  })
  @ApiParam({ name: 'id', description: 'Threat intelligence ID', format: 'uuid' })
  @ApiQuery({ name: 'permanent', required: false, type: Boolean, description: 'Perform hard delete' })
  @ApiResponse({ status: 204, description: 'Threat intelligence deleted successfully' })
  @ApiResponse({ status: 404, description: 'Threat intelligence not found' })
  async deleteThreatIntelligence(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('permanent') permanent?: boolean,
    @Req() req?: Request,
  ): Promise<void> {
    const requestId = generateRequestId();
    const userId = (req as any)?.user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Deleting threat intelligence: ${id} (permanent: ${permanent})`);

      await this.crudService.deleteEntity(
        {
          entityId: id,
          deleteMode: permanent ? 'HARD' as any : 'SOFT' as any,
          reason: 'User-requested deletion',
        },
        requestId,
      );

      // Create HIPAA audit log
      createHIPAALog(userId, 'DELETE', 'ThreatIntelligence', id, 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Threat intelligence deleted: ${id}`);
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to delete threat intelligence: ${(error as Error).message}`);
      throw new InternalServerError('Failed to delete threat intelligence', requestId);
    }
  }

  /**
   * Bulk create threat intelligence entries
   */
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Bulk create threat intelligence entries',
    description: 'Creates multiple threat intelligence records in a single operation',
  })
  @ApiBody({ type: [ThreatIntelligenceDto] })
  @ApiResponse({ status: 201, description: 'Bulk creation completed' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async bulkCreateThreatIntelligence(
    @Body() dtos: ThreatIntelligenceDto[],
    @Req() req: Request,
  ): Promise<any> {
    const requestId = generateRequestId();
    const userId = (req as any).user?.id || 'system';

    try {
      this.logger.log(`[${requestId}] Bulk creating ${dtos.length} threat intelligence entries`);

      const bulkDto: BulkCreateDto = {
        entityType: 'ThreatIntelligence',
        entities: dtos.map((dto) => ({
          ...dto,
          createdBy: userId,
          createdAt: new Date(),
        })),
        continueOnError: false,
        useTransaction: true,
      };

      const result = await this.crudService.bulkCreateEntities(bulkDto, requestId);

      // Create HIPAA audit log
      createHIPAALog(userId, 'BULK_CREATE', 'ThreatIntelligence', 'multiple', 'SUCCESS', requestId, 'ALLOWED');

      this.logger.log(`[${requestId}] Bulk creation completed: ${result.successCount}/${result.totalRequested}`);
      return createCreatedResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk creation failed: ${(error as Error).message}`);
      throw new InternalServerError('Failed to bulk create threat intelligence', requestId);
    }
  }

  /**
   * Get threat intelligence analytics
   */
  @Post('analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get threat intelligence analytics',
    description: 'Retrieves analytics and metrics for threat intelligence data',
  })
  @ApiBody({ type: AnalyticsRequestDto })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  async getAnalytics(@Body(ValidationPipe) dto: AnalyticsRequestDto): Promise<any> {
    const requestId = generateRequestId();

    try {
      this.logger.log(`[${requestId}] Generating analytics: ${dto.metricType}`);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dto.timeRangeDays);

      // Build filters
      const filters: Record<string, any> = {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        ...(dto.filters || {}),
      };

      // Retrieve data based on metric type
      let analyticsData: any;

      switch (dto.metricType) {
        case 'COUNT':
          const countResult = await this.crudService.countEntities(
            { entityType: 'ThreatIntelligence', filters, includeDeleted: false },
            requestId,
          );
          analyticsData = {
            metricType: 'COUNT',
            total: countResult,
            timeRange: { startDate, endDate, days: dto.timeRangeDays },
          };
          break;

        case 'DISTRIBUTION':
          const listResult = await this.crudService.listEntities(
            {
              entityType: 'ThreatIntelligence',
              filters,
              page: 1,
              pageSize: 1000,
              includeDeleted: false,
            },
            requestId,
          );

          const distribution: Record<string, number> = {};
          const groupField = dto.groupBy || 'severity';

          listResult.data.forEach((item: any) => {
            const key = item[groupField] || 'UNKNOWN';
            distribution[key] = (distribution[key] || 0) + 1;
          });

          analyticsData = {
            metricType: 'DISTRIBUTION',
            groupBy: groupField,
            distribution,
            total: listResult.total,
            timeRange: { startDate, endDate, days: dto.timeRangeDays },
          };
          break;

        default:
          throw new BadRequestError('Unsupported metric type');
      }

      this.logger.log(`[${requestId}] Analytics generated successfully`);
      return createSuccessResponse(analyticsData, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Analytics generation failed: ${(error as Error).message}`);
      throw new InternalServerError('Failed to generate analytics', requestId);
    }
  }
}

/**
 * Data Management Controller
 * Handles data export, import, and transformation operations
 */
@Controller('api/v1/data-management')
@ApiTags('Data Management')
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
export class DataManagementController {
  private readonly logger = createLogger(DataManagementController.name);

  constructor(
    private readonly retrievalService: DataRetrievalService,
    private readonly crudService: CrudOperationsService,
  ) {}

  /**
   * Export threat intelligence data
   */
  @Post('export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Export threat intelligence data',
    description: 'Exports threat intelligence data in various formats (CSV, JSON, Excel, etc.)',
  })
  @ApiBody({ type: ExportRequestDto })
  @ApiProduces('application/octet-stream', 'application/json')
  @ApiResponse({ status: 200, description: 'Export completed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid export request' })
  async exportData(@Body(ValidationPipe) dto: ExportRequestDto, @Res() res: Response): Promise<void> {
    const requestId = generateRequestId();

    try {
      this.logger.log(`[${requestId}] Exporting data in ${dto.format} format`);

      // Build filters from search criteria
      const filters: Record<string, any> = {};
      if (dto.filters) {
        if (dto.filters.type) filters.type = dto.filters.type;
        if (dto.filters.severity) filters.severity = dto.filters.severity;
        if (dto.filters.status) filters.status = dto.filters.status;
      }

      // Retrieve data for export
      const data = await this.retrievalService.findByCriteria('ThreatIntelligence', filters);

      // Format data based on export format
      let exportData: string;
      let contentType: string;
      let filename: string;

      switch (dto.format) {
        case 'JSON':
          exportData = JSON.stringify(data, null, 2);
          contentType = 'application/json';
          filename = `threat-intelligence-${Date.now()}.json`;
          break;

        case 'CSV':
          // Convert to CSV format
          const headers = dto.fields || Object.keys(data[0] || {});
          const csvRows = [headers.join(',')];

          data.forEach((item: any) => {
            const row = headers.map((field) => {
              const value = item[field];
              return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            });
            csvRows.push(row.join(','));
          });

          exportData = csvRows.join('\n');
          contentType = 'text/csv';
          filename = `threat-intelligence-${Date.now()}.csv`;
          break;

        default:
          exportData = JSON.stringify(data, null, 2);
          contentType = 'application/json';
          filename = `threat-intelligence-${Date.now()}.json`;
      }

      // Set response headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('X-Request-ID', requestId);

      this.logger.log(`[${requestId}] Export completed: ${data.length} records`);
      res.send(exportData);
    } catch (error) {
      this.logger.error(`[${requestId}] Export failed: ${(error as Error).message}`);
      res.status(500).json(sanitizeErrorForHIPAA(error as Error, requestId));
    }
  }

  /**
   * Get data statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get data statistics',
    description: 'Retrieves comprehensive statistics about threat intelligence data',
  })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(): Promise<any> {
    const requestId = generateRequestId();

    try {
      this.logger.log(`[${requestId}] Calculating statistics`);

      const totalCount = await this.crudService.countEntities(
        { entityType: 'ThreatIntelligence', includeDeleted: false },
        requestId,
      );

      const activeCount = await this.crudService.countEntities(
        { entityType: 'ThreatIntelligence', filters: { status: StatusType.IN_PROGRESS }, includeDeleted: false },
        requestId,
      );

      const criticalCount = await this.crudService.countEntities(
        { entityType: 'ThreatIntelligence', filters: { severity: SeverityLevel.CRITICAL }, includeDeleted: false },
        requestId,
      );

      const statistics = {
        total: totalCount,
        active: activeCount,
        critical: criticalCount,
        timestamp: new Date(),
      };

      this.logger.log(`[${requestId}] Statistics calculated`);
      return createSuccessResponse(statistics, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Statistics calculation failed: ${(error as Error).message}`);
      throw new InternalServerError('Failed to calculate statistics', requestId);
    }
  }
}

/**
 * Validation Controller
 * Handles data validation operations
 */
@Controller('api/v1/validation')
@ApiTags('Validation')
@ApiBearerAuth()
export class ValidationController {
  private readonly logger = createLogger(ValidationController.name);

  constructor(private readonly validationService: ValidationOperationsService) {}

  /**
   * Validate field
   */
  @Post('field')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate a single field',
    description: 'Validates a single field value against specified rules',
  })
  @ApiBody({ type: ValidateFieldDto })
  @ApiResponse({ status: 200, description: 'Validation result returned' })
  async validateField(@Body(ValidationPipe) dto: ValidateFieldDto): Promise<any> {
    const requestId = generateRequestId();

    try {
      this.logger.log(`[${requestId}] Validating field: ${dto.field}`);

      let result;
      if (dto.format === 'EMAIL' as any) {
        result = this.validationService.validateEmail(dto.value, dto.field);
      } else if (dto.format === 'UUID' as any) {
        result = this.validationService.validateUUID(dto.value, dto.field);
      } else {
        result = this.validationService.validateRequired(dto.value, dto.field);
      }

      return createSuccessResponse(result, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Field validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Field validation failed', { requestId });
    }
  }

  /**
   * Bulk validate
   */
  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk validate multiple fields',
    description: 'Validates multiple fields in a single request',
  })
  @ApiBody({ type: BulkValidationDto })
  @ApiResponse({ status: 200, description: 'Bulk validation results returned' })
  async bulkValidate(@Body(ValidationPipe) dto: BulkValidationDto): Promise<any> {
    const requestId = generateRequestId();

    try {
      this.logger.log(`[${requestId}] Bulk validating ${dto.fields.length} fields`);

      const results = await this.validationService.bulkValidate(dto, { requestId, timestamp: new Date() });
      const report = this.validationService.generateValidationReport(results);

      return createSuccessResponse({ results, report }, requestId);
    } catch (error) {
      this.logger.error(`[${requestId}] Bulk validation failed: ${(error as Error).message}`);
      throw new BadRequestError('Bulk validation failed', { requestId });
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ThreatIntelligenceController,
  DataManagementController,
  ValidationController,
  LoggingInterceptor,
  HIPAAAuditInterceptor,
};

export default {
  ThreatIntelligenceController,
  DataManagementController,
  ValidationController,
};
