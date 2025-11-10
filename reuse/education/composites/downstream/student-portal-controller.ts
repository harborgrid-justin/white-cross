import { Sequelize, Model, DataTypes } from 'sequelize';
import {
import { StudentPortalControllersCompositeService } from './student-portal-service';
import type { ServiceData, Status } from './student-portal-service';

/**
 * LOC: EDU-COMP-DOWNSTREAM-CTRL-012
 * File: /reuse/education/composites/downstream/student-portal-controller.ts
 *
 * Purpose: Student Portal REST Controller - Production-grade HTTP endpoints for student portal operations
 *
 * Upstream: StudentPortalControllersCompositeService
 * Downstream: REST API clients, Student portals, Mobile apps
 * Dependencies: NestJS 10.x, Swagger/OpenAPI
 */

  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
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
} from '@nestjs/swagger';

@ApiTags('Student Portal')
@Controller('portal')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for StudentPortalControllerRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createStudentPortalControllerRecord = (sequelize: Sequelize) => {
  class StudentPortalControllerRecord extends Model {
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

  StudentPortalControllerRecord.init(
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
      tableName: 'student_portal_controller_records',
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
        beforeCreate: async (record: StudentPortalControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_StudentPOrtalCoNtroller',
                  tableName: 'student_portal_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: StudentPortalControllerRecord, options: any) => {
          console.log(`[AUDIT] StudentPortalControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: StudentPortalControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_StudentPOrtalCoNtroller',
                  tableName: 'student_portal_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: StudentPortalControllerRecord, options: any) => {
          console.log(`[AUDIT] StudentPortalControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: StudentPortalControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_StudentPOrtalCoNtroller',
                  tableName: 'student_portal_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: StudentPortalControllerRecord, options: any) => {
          console.log(`[AUDIT] StudentPortalControllerRecord deleted: ${record.id}`);
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

  return StudentPortalControllerRecord;
};


@Injectable()
export class StudentPortalController {
  constructor(
    private readonly portalService: StudentPortalControllersCompositeService) {}

  // ============================================================================
  // DASHBOARD & PROFILE
  // ============================================================================

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get student dashboard',
    description: 'Retrieves comprehensive dashboard data including courses, grades, notifications, and upcoming deadlines',
  })
  @ApiOkResponse({ description: 'Dashboard data retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiOperation({ summary: 'getDashboard', description: 'Execute getDashboard operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getDashboard(): Promise<any> {
    this.logger.log('Retrieving student dashboard');
    return this.portalService.operation1();
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get student profile',
    description: 'Retrieves complete student profile information',
  })
  @ApiOkResponse({ description: 'Profile retrieved successfully' })
  @ApiOperation({ summary: 'getProfile', description: 'Execute getProfile operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getProfile(): Promise<any> {
    this.logger.log('Retrieving student profile');
    return this.portalService.operation2();
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Update student profile',
    description: 'Updates student profile information including contact details and preferences',
  })
  @ApiBody({ description: 'Profile update data' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid profile data' })
  @ApiOperation({ summary: 'updateProfile', description: 'Execute updateProfile operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async updateProfile(@Body(ValidationPipe) profileData: any): Promise<any> {
    this.logger.log('Updating student profile');
    return this.portalService.operation3();
  }

  // ============================================================================
  // COURSE REGISTRATION & SCHEDULE
  // ============================================================================

  @Get('schedule')
  @ApiOperation({
    summary: 'Get course schedule',
    description: 'Retrieves current course schedule with meeting times and locations',
  })
  @ApiQuery({ name: 'term', description: 'Academic term', required: false })
  @ApiOkResponse({ description: 'Schedule retrieved successfully' })
  @ApiOperation({ summary: 'getSchedule', description: 'Execute getSchedule operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getSchedule(@Query('term') term?: string): Promise<any> {
    this.logger.log(`Retrieving schedule for term: ${term || 'current'}`);
    return this.portalService.dataOp1();
  }

  @Get('courses/registered')
  @ApiOperation({
    summary: 'Get registered courses',
    description: 'Retrieves list of courses student is currently registered for',
  })
  @ApiOkResponse({ description: 'Registered courses retrieved successfully' })
  @ApiOperation({ summary: 'getRegisteredCourses', description: 'Execute getRegisteredCourses operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getRegisteredCourses(): Promise<any> {
    this.logger.log('Retrieving registered courses');
    return this.portalService.dataOp2();
  }

  @Post('courses/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register for courses',
    description: 'Registers student for specified courses',
  })
  @ApiBody({
    description: 'Course registration data',
    schema: {
      type: 'object',
      required: ['courseIds'],
      properties: {
        courseIds: { type: 'array', items: { type: 'string' } },
        termId: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Courses registered successfully' })
  @ApiBadRequestResponse({ description: 'Registration failed' })
  @ApiOperation({ summary: 'registerCourses', description: 'Execute registerCourses operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async registerCourses(@Body(ValidationPipe) registrationData: { courseIds: string[]; termId: string }): Promise<any> {
    this.logger.log(`Registering for ${registrationData.courseIds.length} courses`);
    return this.portalService.operation4();
  }

  @Delete('courses/:courseId/drop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Drop course',
    description: 'Drops student from specified course',
  })
  @ApiParam({ name: 'courseId', description: 'Course identifier' })
  @ApiOkResponse({ description: 'Course dropped successfully' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiOperation({ summary: 'dropCourse', description: 'Execute dropCourse operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async dropCourse(@Param('courseId') courseId: string): Promise<any> {
    this.logger.log(`Dropping course ${courseId}`);
    return this.portalService.operation5();
  }

  // ============================================================================
  // GRADES & ACADEMIC PERFORMANCE
  // ============================================================================

  @Get('grades')
  @ApiOperation({
    summary: 'Get student grades',
    description: 'Retrieves grades for all courses across all terms',
  })
  @ApiQuery({ name: 'term', description: 'Filter by academic term', required: false })
  @ApiOkResponse({ description: 'Grades retrieved successfully' })
  @ApiOperation({ summary: 'getGrades', description: 'Execute getGrades operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getGrades(@Query('term') term?: string): Promise<any> {
    this.logger.log(`Retrieving grades for term: ${term || 'all'}`);
    return this.portalService.dataOp3();
  }

  @Get('transcript')
  @ApiOperation({
    summary: 'Get official transcript',
    description: 'Retrieves official academic transcript with all course history',
  })
  @ApiOkResponse({ description: 'Transcript retrieved successfully' })
  @ApiOperation({ summary: 'getTranscript', description: 'Execute getTranscript operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getTranscript(): Promise<any> {
    this.logger.log('Retrieving official transcript');
    return this.portalService.dataOp4();
  }

  @Get('gpa')
  @ApiOperation({
    summary: 'Get GPA information',
    description: 'Retrieves cumulative and term GPA information',
  })
  @ApiOkResponse({ description: 'GPA information retrieved successfully' })
  @ApiOperation({ summary: 'getGPA', description: 'Execute getGPA operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getGPA(): Promise<any> {
    this.logger.log('Retrieving GPA information');
    return this.portalService.analytics1();
  }

  // ============================================================================
  // FINANCIAL INFORMATION
  // ============================================================================

  @Get('financial/account')
  @ApiOperation({
    summary: 'Get financial account summary',
    description: 'Retrieves student financial account summary including balance and payments',
  })
  @ApiOkResponse({ description: 'Financial account retrieved successfully' })
  @ApiOperation({ summary: 'getFinancialAccount', description: 'Execute getFinancialAccount operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getFinancialAccount(): Promise<any> {
    this.logger.log('Retrieving financial account');
    return this.portalService.dataOp5();
  }

  @Get('financial/aid')
  @ApiOperation({
    summary: 'Get financial aid information',
    description: 'Retrieves financial aid awards and status',
  })
  @ApiOkResponse({ description: 'Financial aid information retrieved successfully' })
  @ApiOperation({ summary: 'getFinancialAid', description: 'Execute getFinancialAid operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getFinancialAid(): Promise<any> {
    this.logger.log('Retrieving financial aid information');
    return this.portalService.dataOp6();
  }

  @Post('financial/payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Make payment',
    description: 'Processes a payment toward student account balance',
  })
  @ApiBody({ description: 'Payment information' })
  @ApiCreatedResponse({ description: 'Payment processed successfully' })
  @ApiBadRequestResponse({ description: 'Payment failed' })
  @ApiOperation({ summary: 'makePayment', description: 'Execute makePayment operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async makePayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log('Processing payment');
    return this.portalService.process1();
  }

  // ============================================================================
  // DOCUMENTS & REQUESTS
  // ============================================================================

  @Get('documents')
  @ApiOperation({
    summary: 'Get student documents',
    description: 'Retrieves list of available student documents',
  })
  @ApiOkResponse({ description: 'Documents retrieved successfully' })
  @ApiOperation({ summary: 'getDocuments', description: 'Execute getDocuments operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getDocuments(): Promise<any> {
    this.logger.log('Retrieving student documents');
    return this.portalService.dataOp7();
  }

  @Post('documents/request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request document',
    description: 'Submits request for official documents (transcripts, enrollment verification, etc.)',
  })
  @ApiBody({
    description: 'Document request details',
    schema: {
      type: 'object',
      required: ['documentType'],
      properties: {
        documentType: { type: 'string', enum: ['transcript', 'enrollment_verification', 'degree_verification', 'letter'] },
        deliveryMethod: { type: 'string', enum: ['email', 'mail', 'pickup'] },
        recipientInfo: { type: 'object' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Document request submitted successfully' })
  @ApiOperation({ summary: 'requestDocument', description: 'Execute requestDocument operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async requestDocument(@Body(ValidationPipe) requestData: any): Promise<any> {
    this.logger.log(`Requesting document: ${requestData.documentType}`);
    return this.portalService.process2();
  }

  // ============================================================================
  // NOTIFICATIONS & MESSAGES
  // ============================================================================

  @Get('notifications')
  @ApiOperation({
    summary: 'Get notifications',
    description: 'Retrieves student notifications and alerts',
  })
  @ApiQuery({ name: 'unreadOnly', description: 'Filter unread notifications', required: false, type: Boolean })
  @ApiOkResponse({ description: 'Notifications retrieved successfully' })
  @ApiOperation({ summary: 'getNotifications', description: 'Execute getNotifications operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getNotifications(@Query('unreadOnly') unreadOnly?: boolean): Promise<any> {
    this.logger.log(`Retrieving notifications (unreadOnly: ${unreadOnly})`);
    return this.portalService.integration1();
  }

  @Put('notifications/:notificationId/read')
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Marks a specific notification as read',
  })
  @ApiParam({ name: 'notificationId', description: 'Notification identifier' })
  @ApiOkResponse({ description: 'Notification marked as read' })
  @ApiOperation({ summary: 'markNotificationRead', description: 'Execute markNotificationRead operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async markNotificationRead(@Param('notificationId', ParseUUIDPipe) notificationId: string): Promise<any> {
    this.logger.log(`Marking notification ${notificationId} as read`);
    return this.portalService.integration2();
  }

  // ============================================================================
  // DEGREE PROGRESS & PLANNING
  // ============================================================================

  @Get('degree-progress')
  @ApiOperation({
    summary: 'Get degree progress',
    description: 'Retrieves comprehensive degree progress including completed requirements',
  })
  @ApiOkResponse({ description: 'Degree progress retrieved successfully' })
  @ApiOperation({ summary: 'getDegreeProgress', description: 'Execute getDegreeProgress operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getDegreeProgress(): Promise<any> {
    this.logger.log('Retrieving degree progress');
    return this.portalService.analytics2();
  }

  @Get('degree-audit')
  @ApiOperation({
    summary: 'Get degree audit',
    description: 'Generates detailed degree audit showing all requirements and completion status',
  })
  @ApiOkResponse({ description: 'Degree audit generated successfully' })
  @ApiOperation({ summary: 'getDegreeAudit', description: 'Execute getDegreeAudit operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getDegreeAudit(): Promise<any> {
    this.logger.log('Generating degree audit');
    return this.portalService.report1();
  }

  // ============================================================================
  // REPORTING & EXPORT
  // ============================================================================

  @Get('reports/comprehensive')
  @ApiOperation({
    summary: 'Generate comprehensive report',
    description: 'Generates comprehensive report including all student academic and financial data',
  })
  @ApiOkResponse({ description: 'Report generated successfully' })
  @ApiOperation({ summary: 'generateComprehensiveReport', description: 'Execute generateComprehensiveReport operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async generateComprehensiveReport(): Promise<any> {
    this.logger.log('Generating comprehensive report');
    return this.portalService.generateComprehensiveReport();
  }

  @Post('data/export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Export student data',
    description: 'Exports student data in specified format',
  })
  @ApiBody({
    description: 'Export options',
    schema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['pdf', 'csv', 'json'] },
        dataTypes: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiOkResponse({ description: 'Data exported successfully' })
  @ApiOperation({ summary: 'exportData', description: 'Execute exportData operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async exportData(@Body(ValidationPipe) exportOptions: any): Promise<any> {
    this.logger.log(`Exporting data in format: ${exportOptions.format}`);
    return this.portalService.export1();
  }
}
