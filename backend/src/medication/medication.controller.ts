import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { HealthRecordAuditInterceptor } from '../health-record/interceptors/health-record-audit.interceptor';
import { MedicationService } from './services/medication.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { DeactivateMedicationDto } from './dto/deactivate-medication.dto';
import { ListMedicationsQueryDto } from './dto/list-medications-query.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

/**
 * Medication Controller
 *
 * Handles HTTP endpoints for medication management in the healthcare platform.
 * Provides comprehensive medication CRUD operations with pagination, search,
 * and filtering capabilities.
 *
 * Endpoints:
 * - GET /medications - List all medications with pagination and filters
 * - POST /medications - Create new medication record
 * - GET /medications/:id - Get medication details by ID
 * - PUT /medications/:id - Update medication information
 * - POST /medications/:id/deactivate - Deactivate medication (soft delete)
 * - POST /medications/:id/activate - Reactivate medication
 * - GET /medications/student/:studentId - Get all medications for a student
 *
 * Security:
 * - All endpoints require JWT authentication (configured at module level)
 * - PHI-protected endpoints with audit logging
 * - RBAC: NURSE or ADMIN roles required for create/update/delete operations
 *
 * HIPAA Compliance:
 * - All medication access is logged for audit trail
 * - Soft deletion preserves historical records
 * - Student medication access restricted by role and assignment
 */
@ApiTags('medications')
@Controller('medications')
@ApiBearerAuth()
export class MedicationController {
  private readonly logger = new Logger(MedicationController.name);

  constructor(private readonly medicationService: MedicationService) {}

  /**
   * List all medications with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get all medications',
    description:
      'Retrieve a paginated list of medications with optional filtering by search term, student ID, and active status. ' +
      'Supports full-text search on medication names. All access is logged for HIPAA compliance.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20, max: 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for medication name (case-insensitive)',
    example: 'ibuprofen',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    type: String,
    description: 'Filter by student UUID',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Medications retrieved successfully with pagination metadata',
    schema: {
      type: 'object',
      properties: {
        medications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              dosage: { type: 'string' },
              frequency: { type: 'string' },
              route: { type: 'string' },
              prescribedBy: { type: 'string' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time', nullable: true },
              status: { type: 'string' },
              studentId: { type: 'string', format: 'uuid' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - Database or system failure',
  })
  async list(@Query() query: ListMedicationsQueryDto) {
    this.logger.log(
      `GET /medications - page=${query.page}, limit=${query.limit}, search=${query.search}`,
    );
    return this.medicationService.getMedications(query);
  }

  /**
   * Get medication statistics
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Get medication statistics',
    description:
      'Retrieve aggregated statistics about medications across the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication statistics retrieved successfully',
  })
  async getStats() {
    this.logger.log('GET /medications/stats');
    return this.medicationService.getMedicationStats();
  }

  /**
   * Create a new medication record
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new medication',
    description:
      'Create a new medication record with complete prescribing information, dosage instructions, and student assignment. ' +
      'Requires NURSE or ADMIN role. All creations are logged for HIPAA audit trail.',
  })
  @ApiBody({ type: CreateMedicationDto })
  @ApiResponse({
    status: 201,
    description: 'Medication created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        dosage: { type: 'string' },
        frequency: { type: 'string' },
        route: { type: 'string' },
        prescribedBy: { type: 'string' },
        startDate: { type: 'string', format: 'date-time' },
        studentId: { type: 'string', format: 'uuid' },
        status: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Validation error (missing required fields or invalid format)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description:
      'Student not found - Cannot create medication for non-existent student',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createDto: CreateMedicationDto) {
    this.logger.log(
      `POST /medications - Creating medication: ${createDto.medicationName}`,
    );
    return this.medicationService.createMedication(createDto);
  }

  /**
   * Get a medication by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get medication by ID',
    description:
      'Retrieve detailed information for a specific medication including prescribing details, dosage instructions, and student information. ' +
      'Access is logged for HIPAA compliance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found - Invalid medication ID',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`GET /medications/${id}`);
    return this.medicationService.getMedicationById(id);
  }

  /**
   * Update a medication
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update medication',
    description:
      'Update medication information such as dosage, frequency, route, or instructions. ' +
      'At least one field must be provided. Requires NURSE or ADMIN role. All updates are logged for HIPAA compliance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateMedicationDto })
  @ApiResponse({
    status: 200,
    description: 'Medication updated successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Validation error or at least one field must be provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateDto: UpdateMedicationDto,
  ) {
    this.logger.log(`PUT /medications/${id}`);
    return this.medicationService.updateMedication(id, updateDto);
  }

  /**
   * Deactivate a medication (soft delete)
   */
  @Post(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate medication',
    description:
      'Deactivate a medication (soft delete) while preserving historical record for audit trail. ' +
      'Requires detailed reason and deactivation type. Sets status to DISCONTINUED and records end date. ' +
      'Requires NURSE or ADMIN role. All deactivations are logged for HIPAA compliance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: DeactivateMedicationDto })
  @ApiResponse({
    status: 200,
    description:
      'Medication deactivated successfully - Historical record preserved',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Deactivation reason and type required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() deactivateDto: DeactivateMedicationDto,
  ) {
    this.logger.log(
      `POST /medications/${id}/deactivate - Reason: ${deactivateDto.reason}`,
    );
    return this.medicationService.deactivateMedication(id, deactivateDto);
  }

  /**
   * Activate a medication (restore from soft delete)
   */
  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate medication',
    description:
      'Reactivate a previously deactivated medication by setting status back to ACTIVE and clearing end date. ' +
      'Requires NURSE or ADMIN role. All activations are logged for HIPAA compliance.',
  })
  @ApiParam({
    name: 'id',
    description: 'Medication UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication activated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires NURSE or ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Medication not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async activate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`POST /medications/${id}/activate`);
    return this.medicationService.activateMedication(id);
  }

  /**
   * Get all medications for a student
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get medications for a student',
    description:
      'Retrieve a paginated list of all medications (active and inactive) for a specific student. ' +
      'Returns complete medication history including discontinued medications for medical record keeping. ' +
      'This is a highly sensitive PHI endpoint - all access is logged for HIPAA audit trail.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Student medications retrieved successfully with pagination',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Cannot view medications for students outside your scope',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found - Invalid student ID',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseInterceptors(HealthRecordAuditInterceptor)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async getByStudent(
    @Param('studentId', new ParseUUIDPipe({ version: '4' })) studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    this.logger.log(
      `GET /medications/student/${studentId} - page=${page}, limit=${limit}`,
    );
    return this.medicationService.getMedicationsByStudent(
      studentId,
      Number(page),
      Number(limit),
    );
  }
}
