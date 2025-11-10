import { Sequelize, Model, DataTypes } from 'sequelize';
import {
import { BackendEnrollmentService } from './backend-enrollment-service';

/**
 * LOC: EDU-DOWN-ENROLLMENT-CTRL-001
 * File: /reuse/education/composites/downstream/backend-enrollment-controller.ts
 *
 * Purpose: Backend Enrollment REST Controller - Production-grade HTTP endpoints
 * Handles student enrollment operations, batch processing, and enrollment management
 *
 * Upstream: BackendEnrollmentService, StudentEnrollmentLifecycleComposite
 * Downstream: REST API clients, Enrollment systems, Reporting tools
 * Dependencies: NestJS 10.x, Swagger/OpenAPI, class-validator
 */

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for BackendEnrollmentControllerRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createBackendEnrollmentControllerRecordModel = (sequelize: Sequelize) => {
  class BackendEnrollmentControllerRecord extends Model {
    public id!: string;
    public status!: string;
    public data!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    // Virtual attributes
    get isActive(): boolean {
      return this.status === 'active';
    }

    get isPending(): boolean {
      return this.status === 'pending';
    }

    get isCompleted(): boolean {
      return this.status === 'completed';
    }

    get statusLabel(): string {
      return this.status.replace('_', ' ').toUpperCase();
    }
  }

  BackendEnrollmentControllerRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
          isUUID: 4,
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Record status',
        validate: {
          isIn: [['active', 'inactive', 'pending', 'completed', 'cancelled']],
          notEmpty: true,
        },
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Comprehensive record data',
        validate: {
          isValidData(value: any) {
            if (typeof value !== 'object' || value === null) {
              throw new Error('data must be a valid object');
            }
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'backend_enrollment_controller_records',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['created_at'] },
        { fields: ['updated_at'] },
        { fields: ['deleted_at'] },
        { fields: ['status', 'created_at'] },
      ],
      hooks: {
        beforeCreate: async (record: BackendEnrollmentControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_BACKENDENROLLMENTCONTROLLER',
                  tableName: 'backend_enrollment_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: BackendEnrollmentControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendEnrollmentControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: BackendEnrollmentControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_BACKENDENROLLMENTCONTROLLER',
                  tableName: 'backend_enrollment_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: BackendEnrollmentControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendEnrollmentControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: BackendEnrollmentControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_BACKENDENROLLMENTCONTROLLER',
                  tableName: 'backend_enrollment_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: BackendEnrollmentControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendEnrollmentControllerRecord deleted: ${record.id}`);
        },
      },
      scopes: {
        defaultScope: {
          attributes: { exclude: ['deletedAt'] },
        },
        active: {
          where: { status: 'active' },
        },
        pending: {
          where: { status: 'pending' },
        },
        completed: {
          where: { status: 'completed' },
        },
        recent: {
          order: [['createdAt', 'DESC']],
          limit: 100,
        },
        withData: {
          attributes: {
            include: ['id', 'status', 'data', 'createdAt', 'updatedAt'],
          },
        },
      },
    },
  );

  return BackendEnrollmentControllerRecord;
};

  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

// Guard and Interceptor imports (ensure these exist in your NestJS setup)
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Backend Enrollment Controller
 * Provides REST API endpoints for enrollment operations
 */
@ApiTags('Enrollment Management')
@Controller('api/v1/enrollment')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
@Injectable()
export class BackendEnrollmentController {
  private readonly logger = new Logger(BackendEnrollmentController.name);

  constructor(private readonly enrollmentService: BackendEnrollmentService) {}

  /**
   * Retrieve all enrollments with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get all enrollments',
    description: 'Retrieve paginated list of enrollments with optional filtering',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'studentId', required: false, type: String, description: 'Filter by student' })
  @ApiOkResponse({
    description: 'Enrollments retrieved successfully',
    schema: {
      properties: {
        data: { type: 'array' },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiOperation({ summary: 'findAll', description: 'Execute findAll operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'findAll', description: 'Execute findAll operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.enrollmentService.findAll({
      page,
      limit,
      status,
      studentId,
    });
  }

  /**
   * Get enrollment by ID
   */
  @Get(':enrollmentId')
  @ApiOperation({
    summary: 'Get enrollment by ID',
    description: 'Retrieve a specific enrollment record',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Enrollment found' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiOperation({ summary: 'findOne', description: 'Execute findOne operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'findOne', description: 'Execute findOne operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async findOne(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
    return this.enrollmentService.findOne(enrollmentId);
  }

  /**
   * Create new enrollment
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create enrollment',
    description: 'Create a new student enrollment record',
  })
  @ApiBody({
    description: 'Enrollment data',
    schema: {
      properties: {
        studentId: { type: 'string' },
        termId: { type: 'string' },
        courseIds: { type: 'array', items: { type: 'string' } },
        credits: { type: 'number' },
        status: { type: 'string', enum: ['pending', 'active', 'completed', 'withdrawn'] },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Enrollment created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid enrollment data' })
  @ApiOperation({ summary: 'create', description: 'Execute create operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'create', description: 'Execute create operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createEnrollmentDto: any,
  ) {
    this.logger.log(`Creating enrollment for student: ${createEnrollmentDto.studentId}`);
    return this.enrollmentService.create(createEnrollmentDto);
  }

  /**
   * Update enrollment
   */
  @Put(':enrollmentId')
  @ApiOperation({
    summary: 'Update enrollment',
    description: 'Update an existing enrollment record',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Enrollment updated successfully' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiOperation({ summary: 'update', description: 'Execute update operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'update', description: 'Execute update operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async update(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateEnrollmentDto: any,
  ) {
    this.logger.log(`Updating enrollment: ${enrollmentId}`);
    return this.enrollmentService.update(enrollmentId, updateEnrollmentDto);
  }

  /**
   * Delete enrollment
   */
  @Delete(':enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete enrollment',
    description: 'Delete an enrollment record',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Enrollment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiOperation({ summary: 'delete', description: 'Execute delete operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'delete', description: 'Execute delete operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async delete(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
    this.logger.log(`Deleting enrollment: ${enrollmentId}`);
    return this.enrollmentService.delete(enrollmentId);
  }

  /**
   * Process enrollment batch
   */
  @Post('batch/process')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process enrollment batch',
    description: 'Process multiple enrollments in batch mode',
  })
  @ApiBody({
    description: 'Batch enrollment data',
    schema: {
      properties: {
        enrollments: { type: 'array' },
        termId: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Batch processing started' })
  @ApiOperation({ summary: 'processBatch', description: 'Execute processBatch operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'processBatch', description: 'Execute processBatch operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async processBatch(@Body() batchData: any) {
    this.logger.log(`Processing enrollment batch with ${batchData.enrollments.length} records`);
    return this.enrollmentService.processBatch(batchData);
  }

  /**
   * Verify enrollment eligibility
   */
  @Post(':enrollmentId/verify')
  @ApiOperation({
    summary: 'Verify enrollment eligibility',
    description: 'Check if student meets enrollment requirements',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Verification completed' })
  @ApiOperation({ summary: 'verifyEligibility', description: 'Execute verifyEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'verifyEligibility', description: 'Execute verifyEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async verifyEligibility(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
    return this.enrollmentService.verifyEligibility(enrollmentId);
  }

  /**
   * Get enrollment analytics
   */
  @Get('analytics/summary')
  @ApiOperation({
    summary: 'Get enrollment analytics',
    description: 'Retrieve enrollment statistics and analytics',
  })
  @ApiOkResponse({ description: 'Analytics retrieved successfully' })
  @ApiOperation({ summary: 'getAnalytics', description: 'Execute getAnalytics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getAnalytics', description: 'Execute getAnalytics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getAnalytics(
    @Query('termId') termId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.enrollmentService.getAnalytics({
      termId,
      startDate,
      endDate,
    });
  }

  /**
   * Export enrollments
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export enrollments',
    description: 'Export enrollment data in specified format (csv, xlsx, pdf)',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiOkResponse({ description: 'Export generated successfully' })
  @ApiOperation({ summary: 'export', description: 'Execute export operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'export', description: 'Execute export operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async export(
    @Param('format') format: 'csv' | 'xlsx' | 'pdf',
    @Query('filters') filters?: string,
  ) {
    this.logger.log(`Exporting enrollments in ${format} format`);
    return this.enrollmentService.export(format, filters);
  }

  /**
   * Withdraw enrollment
   */
  @Patch(':enrollmentId/withdraw')
  @ApiOperation({
    summary: 'Withdraw enrollment',
    description: 'Withdraw a student from enrollment',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Enrollment withdrawn successfully' })
  @ApiOperation({ summary: 'withdraw', description: 'Execute withdraw operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'withdraw', description: 'Execute withdraw operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async withdraw(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Body() withdrawalData: any,
  ) {
    this.logger.log(`Withdrawing enrollment: ${enrollmentId}`);
    return this.enrollmentService.withdraw(enrollmentId, withdrawalData);
  }

  /**
   * Get enrollment by student and term
   */
  @Get('student/:studentId/term/:termId')
  @ApiOperation({
    summary: 'Get enrollment by student and term',
    description: 'Retrieve enrollment record for specific student and term',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiParam({ name: 'termId', description: 'Term identifier' })
  @ApiOkResponse({ description: 'Enrollment found' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiOperation({ summary: 'findByStudentAndTerm', description: 'Execute findByStudentAndTerm operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'findByStudentAndTerm', description: 'Execute findByStudentAndTerm operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async findByStudentAndTerm(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('termId') termId: string,
  ) {
    return this.enrollmentService.findByStudentAndTerm(studentId, termId);
  }

  /**
   * Get enrollment holds
   */
  @Get(':enrollmentId/holds')
  @ApiOperation({
    summary: 'Get enrollment holds',
    description: 'Retrieve any holds preventing enrollment',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Holds retrieved successfully' })
  @ApiOperation({ summary: 'getHolds', description: 'Execute getHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getHolds', description: 'Execute getHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getHolds(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
    return this.enrollmentService.getHolds(enrollmentId);
  }

  /**
   * Clear enrollment holds
   */
  @Patch(':enrollmentId/holds/clear')
  @ApiOperation({
    summary: 'Clear enrollment holds',
    description: 'Clear holds preventing enrollment',
  })
  @ApiParam({ name: 'enrollmentId', description: 'Enrollment UUID' })
  @ApiOkResponse({ description: 'Holds cleared successfully' })
  @ApiOperation({ summary: 'clearHolds', description: 'Execute clearHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'clearHolds', description: 'Execute clearHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async clearHolds(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Body() clearData: any,
  ) {
    return this.enrollmentService.clearHolds(enrollmentId, clearData);
  }

  /**
   * Get enrollment capacity
   */
  @Get('capacity/check')
  @ApiOperation({
    summary: 'Check capacity',
    description: 'Check system capacity for enrollments',
  })
  @ApiOkResponse({ description: 'Capacity information retrieved' })
  @ApiOperation({ summary: 'checkCapacity', description: 'Execute checkCapacity operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'checkCapacity', description: 'Execute checkCapacity operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async checkCapacity(
    @Query('termId') termId: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentService.checkCapacity(termId, courseId);
  }
}
