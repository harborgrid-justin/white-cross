/**
 * LOC: EDU-DOWN-GRADUATION-CTRL-003
 * File: /reuse/education/composites/downstream/backend-graduation-controller.ts
 *
 * Purpose: Backend Graduation REST Controller - Production-grade HTTP endpoints
 * Handles graduation processing, degree audit, commencement, and diploma operations
 *
 * Upstream: BackendGraduationService, StudentGraduationComposite
 * Downstream: REST API clients, Graduation systems, Commencement planning tools
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
import { BackendGraduationService } from './backend-graduation-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Backend Graduation Controller
 * Provides REST API endpoints for graduation operations
 */
@ApiTags('Graduation Management')
@Controller('api/v1/graduation')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for BackendGraduationControllerRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createBackendGraduationControllerRecord = (sequelize: Sequelize) => {
  class BackendGraduationControllerRecord extends Model {
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

  BackendGraduationControllerRecord.init(
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
      tableName: 'backend_graduation_controller_records',
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
        beforeCreate: async (record: BackendGraduationControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_BackendGRaduationCoNtroller',
                  tableName: 'backend_graduation_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: BackendGraduationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendGraduationControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: BackendGraduationControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_BackendGRaduationCoNtroller',
                  tableName: 'backend_graduation_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: BackendGraduationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendGraduationControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: BackendGraduationControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_BackendGRaduationCoNtroller',
                  tableName: 'backend_graduation_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: BackendGraduationControllerRecord, options: any) => {
          console.log(`[AUDIT] BackendGraduationControllerRecord deleted: ${record.id}`);
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

  return BackendGraduationControllerRecord;
};


@Injectable()
export class BackendGraduationController {
  private readonly logger = new Logger(BackendGraduationController.name);

  constructor(private readonly graduationService: BackendGraduationService) {}

  /**
   * Get all graduation records
   */
  @Get()
  @ApiOperation({
    summary: 'Get all graduation records',
    description: 'Retrieve paginated list of graduation records',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiOkResponse({
    description: 'Graduation records retrieved successfully',
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
  ) {
    return this.graduationService.findAll({
      page,
      limit,
      status,
    });
  }

  /**
   * Get graduation record by ID
   */
  @Get(':graduationId')
  @ApiOperation({
    summary: 'Get graduation record by ID',
    description: 'Retrieve a specific graduation record',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Graduation record found' })
  @ApiNotFoundResponse({ description: 'Graduation record not found' })
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
  async findOne(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.findOne(graduationId);
  }

  /**
   * Create graduation record
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create graduation record',
    description: 'Create a new student graduation record',
  })
  @ApiBody({
    description: 'Graduation data',
    schema: {
      properties: {
        studentId: { type: 'string' },
        degreeType: { type: 'string' },
        major: { type: 'string' },
        minor: { type: 'string' },
        expectedGraduationDate: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Graduation record created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid graduation data' })
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
    createGraduationDto: any,
  ) {
    this.logger.log(`Creating graduation record for student: ${createGraduationDto.studentId}`);
    return this.graduationService.create(createGraduationDto);
  }

  /**
   * Update graduation record
   */
  @Put(':graduationId')
  @ApiOperation({
    summary: 'Update graduation record',
    description: 'Update an existing graduation record',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Graduation record updated successfully' })
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
    @Param('graduationId', ParseUUIDPipe) graduationId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateGraduationDto: any,
  ) {
    this.logger.log(`Updating graduation record: ${graduationId}`);
    return this.graduationService.update(graduationId, updateGraduationDto);
  }

  /**
   * Delete graduation record
   */
  @Delete(':graduationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete graduation record',
    description: 'Delete a graduation record',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Graduation record deleted successfully' })
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
  async delete(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    this.logger.log(`Deleting graduation record: ${graduationId}`);
    return this.graduationService.delete(graduationId);
  }

  /**
   * Check graduation eligibility
   */
  @Post(':graduationId/check-eligibility')
  @ApiOperation({
    summary: 'Check graduation eligibility',
    description: 'Verify if student meets graduation requirements',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Eligibility check completed' })
  @ApiOperation({ summary: 'checkEligibility', description: 'Execute checkEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'checkEligibility', description: 'Execute checkEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async checkEligibility(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.checkEligibility(graduationId);
  }

  /**
   * Perform degree audit
   */
  @Post(':graduationId/degree-audit')
  @ApiOperation({
    summary: 'Perform degree audit',
    description: 'Run comprehensive audit of degree requirements',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Degree audit completed' })
  @ApiOperation({ summary: 'degreeAudit', description: 'Execute degreeAudit operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'degreeAudit', description: 'Execute degreeAudit operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async degreeAudit(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.degreeAudit(graduationId);
  }

  /**
   * Order diploma
   */
  @Post(':graduationId/diploma/order')
  @ApiOperation({
    summary: 'Order diploma',
    description: 'Place order for official diploma',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Diploma order placed successfully' })
  @ApiOperation({ summary: 'orderDiploma', description: 'Execute orderDiploma operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'orderDiploma', description: 'Execute orderDiploma operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async orderDiploma(
    @Param('graduationId', ParseUUIDPipe) graduationId: string,
    @Body() diplomaOrderData: any,
  ) {
    return this.graduationService.orderDiploma(graduationId, diplomaOrderData);
  }

  /**
   * Get diploma status
   */
  @Get(':graduationId/diploma/status')
  @ApiOperation({
    summary: 'Get diploma status',
    description: 'Check status of diploma order',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Diploma status retrieved' })
  @ApiOperation({ summary: 'getDiplomaStatus', description: 'Execute getDiplomaStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getDiplomaStatus', description: 'Execute getDiplomaStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getDiplomaStatus(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.getDiplomaStatus(graduationId);
  }

  /**
   * Register for commencement
   */
  @Post(':graduationId/commencement/register')
  @ApiOperation({
    summary: 'Register for commencement',
    description: 'Register student for graduation commencement ceremony',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Commencement registration successful' })
  @ApiOperation({ summary: 'registerCommencement', description: 'Execute registerCommencement operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'registerCommencement', description: 'Execute registerCommencement operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async registerCommencement(
    @Param('graduationId', ParseUUIDPipe) graduationId: string,
    @Body() commencementData: any,
  ) {
    return this.graduationService.registerCommencement(graduationId, commencementData);
  }

  /**
   * Get commencement information
   */
  @Get(':graduationId/commencement/info')
  @ApiOperation({
    summary: 'Get commencement information',
    description: 'Retrieve commencement ceremony details and registration status',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Commencement information retrieved' })
  @ApiOperation({ summary: 'getCommencementInfo', description: 'Execute getCommencementInfo operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getCommencementInfo', description: 'Execute getCommencementInfo operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getCommencementInfo(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.getCommencementInfo(graduationId);
  }

  /**
   * Get graduation statistics
   */
  @Get('analytics/statistics')
  @ApiOperation({
    summary: 'Get graduation statistics',
    description: 'Retrieve graduation analytics and statistics',
  })
  @ApiQuery({ name: 'term', required: false })
  @ApiQuery({ name: 'department', required: false })
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
    @Query('term') term?: string,
    @Query('department') department?: string,
  ) {
    return this.graduationService.getStatistics({ term, department });
  }

  /**
   * Export graduation records
   */
  @Get('export/:format')
  @ApiOperation({
    summary: 'Export graduation records',
    description: 'Export graduation data in specified format',
  })
  @ApiParam({ name: 'format', enum: ['csv', 'xlsx', 'pdf'] })
  @ApiQuery({ name: 'filters', required: false })
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
    this.logger.log(`Exporting graduation records in ${format} format`);
    return this.graduationService.export(format, filters);
  }

  /**
   * Submit for graduation
   */
  @Patch(':graduationId/submit')
  @ApiOperation({
    summary: 'Submit for graduation',
    description: 'Submit student graduation application',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Graduation application submitted' })
  @ApiOperation({ summary: 'submit', description: 'Execute submit operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'submit', description: 'Execute submit operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async submit(
    @Param('graduationId', ParseUUIDPipe) graduationId: string,
    @Body() submissionData: any,
  ) {
    return this.graduationService.submit(graduationId, submissionData);
  }

  /**
   * Get graduation checklist
   */
  @Get(':graduationId/checklist')
  @ApiOperation({
    summary: 'Get graduation checklist',
    description: 'Retrieve graduation requirement checklist',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Graduation checklist retrieved' })
  @ApiOperation({ summary: 'getChecklist', description: 'Execute getChecklist operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getChecklist', description: 'Execute getChecklist operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getChecklist(@Param('graduationId', ParseUUIDPipe) graduationId: string) {
    return this.graduationService.getChecklist(graduationId);
  }

  /**
   * Confer degree
   */
  @Post(':graduationId/confer-degree')
  @ApiOperation({
    summary: 'Confer degree',
    description: 'Officially confer degree to student',
  })
  @ApiParam({ name: 'graduationId', description: 'Graduation UUID' })
  @ApiOkResponse({ description: 'Degree conferred successfully' })
  @ApiOperation({ summary: 'conferDegree', description: 'Execute conferDegree operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'conferDegree', description: 'Execute conferDegree operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async conferDegree(
    @Param('graduationId', ParseUUIDPipe) graduationId: string,
    @Body() conferData: any,
  ) {
    return this.graduationService.conferDegree(graduationId, conferData);
  }
}
