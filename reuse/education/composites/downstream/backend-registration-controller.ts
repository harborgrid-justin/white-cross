/**
 * LOC: EDU-DOWN-REGISTRATION-CTRL-002
 * File: /reuse/education/composites/downstream/backend-registration-controller.ts
 *
 * Purpose: Backend Registration REST Controller - Production-grade HTTP endpoints
 * Handles student registration, course registration, and batch registration operations
 *
 * Upstream: BackendRegistrationService, StudentRegistrationComposite
 * Downstream: REST API clients, Registration systems, Reporting tools
 * Dependencies: NestJS 10.x, Swagger/OpenAPI, class-validator
 */

import { Sequelize, Model, DataTypes } from 'sequelize';
import {
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
import {
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
import { BackendRegistrationService } from './backend-registration-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Backend Registration Controller
 * Provides REST API endpoints for registration operations
 */
@ApiTags('Registration Management')
@Controller('api/v1/registration')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for BackendRegistrationControllerRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createBackendRegistrationControllerRecord = (sequelize: Sequelize) => {
  class BackendRegistrationControllerRecord extends Model {
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

  BackendRegistrationControllerRecord.init(
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
      tableName: 'backend_registration_controller_records',
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
        beforeCreate: async (record: BackendRegistrationControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_BackendREgistrationCoNtroller',
                  tableName: 'backend_registration_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: BackendRegistrationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendRegistrationControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: BackendRegistrationControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_BackendREgistrationCoNtroller',
                  tableName: 'backend_registration_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: BackendRegistrationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendRegistrationControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: BackendRegistrationControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_BackendREgistrationCoNtroller',
                  tableName: 'backend_registration_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: BackendRegistrationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendRegistrationControllerRecord deleted: ${record.id}`);
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

  return BackendRegistrationControllerRecord;
};


@Injectable()
export class BackendRegistrationController {
  private readonly logger = new Logger(BackendRegistrationController.name);

  constructor(private readonly registrationService: BackendRegistrationService) {}

  /**
   * Get all registrations with pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all registrations',
    description: 'Retrieve paginated list of course registrations',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'termId', required: false, type: String })
  @ApiQuery({ name: 'studentId', required: false, type: String })
  @ApiOkResponse({
    description: 'Registrations retrieved successfully',
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
    @Query('termId') termId?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.registrationService.findAll({
      page,
      limit,
      termId,
      studentId,
    });
  }

  /**
   * Get registration by ID
   */
  @Get(':registrationId')
  @ApiOperation({
    summary: 'Get registration by ID',
    description: 'Retrieve a specific course registration record',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Registration found' })
  @ApiNotFoundResponse({ description: 'Registration not found' })
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
  async findOne(@Param('registrationId', ParseUUIDPipe) registrationId: string) {
    return this.registrationService.findOne(registrationId);
  }

  /**
   * Register student for course
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create course registration',
    description: 'Register a student for a specific course',
  })
  @ApiBody({
    description: 'Registration data',
    schema: {
      properties: {
        studentId: { type: 'string' },
        courseId: { type: 'string' },
        termId: { type: 'string' },
        section: { type: 'string' },
        credits: { type: 'number' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Registration created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid registration data' })
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
    createRegistrationDto: any,
  ) {
    this.logger.log(`Registering student: ${createRegistrationDto.studentId}`);
    return this.registrationService.create(createRegistrationDto);
  }

  /**
   * Update registration
   */
  @Put(':registrationId')
  @ApiOperation({
    summary: 'Update registration',
    description: 'Update an existing course registration',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Registration updated successfully' })
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
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateRegistrationDto: any,
  ) {
    this.logger.log(`Updating registration: ${registrationId}`);
    return this.registrationService.update(registrationId, updateRegistrationDto);
  }

  /**
   * Drop course registration
   */
  @Delete(':registrationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Drop course registration',
    description: 'Remove student from course registration',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Registration dropped successfully' })
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
  async delete(@Param('registrationId', ParseUUIDPipe) registrationId: string) {
    this.logger.log(`Dropping registration: ${registrationId}`);
    return this.registrationService.delete(registrationId);
  }

  /**
   * Process batch registration
   */
  @Post('batch/process')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process batch registration',
    description: 'Register multiple students for courses in batch mode',
  })
  @ApiBody({
    description: 'Batch registration data',
    schema: {
      properties: {
        registrations: { type: 'array' },
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
    this.logger.log(`Processing batch registration with ${batchData.registrations.length} records`);
    return this.registrationService.processBatch(batchData);
  }

  /**
   * Check course availability
   */
  @Get('course/:courseId/availability')
  @ApiOperation({
    summary: 'Check course availability',
    description: 'Check if course has available seats',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiQuery({ name: 'termId', required: false })
  @ApiOkResponse({ description: 'Availability information retrieved' })
  @ApiOperation({ summary: 'checkAvailability', description: 'Execute checkAvailability operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'checkAvailability', description: 'Execute checkAvailability operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async checkAvailability(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query('termId') termId?: string,
  ) {
    return this.registrationService.checkAvailability(courseId, termId);
  }

  /**
   * Add course to waitlist
   */
  @Post(':registrationId/waitlist')
  @ApiOperation({
    summary: 'Add to waitlist',
    description: 'Add student to course waitlist if course is full',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Added to waitlist successfully' })
  @ApiOperation({ summary: 'addToWaitlist', description: 'Execute addToWaitlist operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'addToWaitlist', description: 'Execute addToWaitlist operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async addToWaitlist(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body() waitlistData: any,
  ) {
    return this.registrationService.addToWaitlist(registrationId, waitlistData);
  }

  /**
   * Get student's registrations
   */
  @Get('student/:studentId/courses')
  @ApiOperation({
    summary: 'Get student course registrations',
    description: 'Retrieve all courses registered by a student',
  })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiQuery({ name: 'termId', required: false })
  @ApiOkResponse({ description: 'Registrations retrieved successfully' })
  @ApiOperation({ summary: 'getStudentRegistrations', description: 'Execute getStudentRegistrations operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStudentRegistrations', description: 'Execute getStudentRegistrations operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStudentRegistrations(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('termId') termId?: string,
  ) {
    return this.registrationService.getStudentRegistrations(studentId, termId);
  }

  /**
   * Verify registration prerequisites
   */
  @Post(':registrationId/verify-prerequisites')
  @ApiOperation({
    summary: 'Verify prerequisites',
    description: 'Check if student meets course prerequisites',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Prerequisite verification completed' })
  @ApiOperation({ summary: 'verifyPrerequisites', description: 'Execute verifyPrerequisites operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'verifyPrerequisites', description: 'Execute verifyPrerequisites operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async verifyPrerequisites(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
  ) {
    return this.registrationService.verifyPrerequisites(registrationId);
  }

  /**
   * Get registration holds
   */
  @Get(':registrationId/holds')
  @ApiOperation({
    summary: 'Get registration holds',
    description: 'Check for holds preventing registration',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Holds information retrieved' })
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
  async getHolds(@Param('registrationId', ParseUUIDPipe) registrationId: string) {
    return this.registrationService.getHolds(registrationId);
  }

  /**
   * Export registrations
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export registrations',
    description: 'Export registration data in specified format',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiQuery({ name: 'termId', required: false })
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
    @Query('termId') termId?: string,
  ) {
    this.logger.log(`Exporting registrations in ${format} format`);
    return this.registrationService.export(format, termId);
  }

  /**
   * Get registration statistics
   */
  @Get('analytics/statistics')
  @ApiOperation({
    summary: 'Get registration statistics',
    description: 'Retrieve registration analytics and statistics',
  })
  @ApiQuery({ name: 'termId', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiOkResponse({ description: 'Statistics retrieved successfully' })
  @ApiOperation({ summary: 'getStatistics', description: 'Execute getStatistics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStatistics', description: 'Execute getStatistics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStatistics(
    @Query('termId') termId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.registrationService.getStatistics({ termId, departmentId });
  }

  /**
   * Swap course sections
   */
  @Patch(':registrationId/swap-section')
  @ApiOperation({
    summary: 'Swap course section',
    description: 'Change student to different section of same course',
  })
  @ApiParam({ name: 'registrationId', description: 'Registration UUID' })
  @ApiOkResponse({ description: 'Section swap completed successfully' })
  @ApiOperation({ summary: 'swapSection', description: 'Execute swapSection operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'swapSection', description: 'Execute swapSection operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async swapSection(
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body() swapData: any,
  ) {
    return this.registrationService.swapSection(registrationId, swapData);
  }

  /**
   * Get course roster
   */
  @Get('course/:courseId/roster')
  @ApiOperation({
    summary: 'Get course roster',
    description: 'Retrieve list of registered students for a course',
  })
  @ApiParam({ name: 'courseId', description: 'Course UUID' })
  @ApiQuery({ name: 'termId', required: false })
  @ApiOkResponse({ description: 'Roster retrieved successfully' })
  @ApiOperation({ summary: 'getCourseRoster', description: 'Execute getCourseRoster operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getCourseRoster', description: 'Execute getCourseRoster operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getCourseRoster(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Query('termId') termId?: string,
  ) {
    return this.registrationService.getCourseRoster(courseId, termId);
  }
}
