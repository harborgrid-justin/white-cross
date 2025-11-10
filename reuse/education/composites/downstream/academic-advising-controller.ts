import {
import { AcademicAdvisingControllersService } from './academic-advising-service';
import type {
import { DATABASE_CONNECTION } from './common/tokens/database.tokens';

/**
 * LOC: EDU-DOWN-ADVISING-CTRL-001
 * File: /reuse/education/composites/downstream/academic-advising-controller.ts
 *
 * Purpose: Academic Advising REST Controller - Production-grade HTTP endpoints for advising operations
 *
 * Upstream: AcademicAdvisingControllersService
 * Downstream: REST API clients, Student portals, Advisor dashboards
 * Dependencies: NestJS 10.x, Swagger/OpenAPI
 */

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
  AdvisingSessionData,
  AdvisorCaseload,
  ProgressSummary,
  EarlyAlert,
  StudentHold,
  InterventionPlan,
  RiskLevel,
} from './academic-advising-service';

// Import guards and interceptors (these should exist in your NestJS setup)
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';

@ApiTags('Academic Advising')
@Controller('advising')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)


// ============================================================================
// PRODUCTION-READY SEQUELIZE MODELS
// ============================================================================

/**
 * Production-ready Sequelize model for AcademicAdvisingControllerRecord
 * Features: lifecycle hooks, validations, scopes, virtual attributes, paranoid mode, indexes
 */
export const createAcademicAdvisingControllerRecordModel = (sequelize: Sequelize) => {
  class AcademicAdvisingControllerRecord extends Model {
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

    get statusLabel(): string {
      return this.status.toUpperCase();
    }
  }

  AcademicAdvisingControllerRecord.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: { isUUID: 4 },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['active', 'inactive', 'pending', 'completed', 'cancelled']],
          notEmpty: true,
        },
      },
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
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
      tableName: 'academic_advising_controller_records',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['created_at'] },
        { fields: ['status', 'created_at'] },
      ],
      hooks: {
        beforeCreate: async (record: AcademicAdvisingControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_ACADEMICADVISINGCONTROLLER',
                  tableName: 'academic_advising_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: AcademicAdvisingControllerRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvisingControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: AcademicAdvisingControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_ACADEMICADVISINGCONTROLLER',
                  tableName: 'academic_advising_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: AcademicAdvisingControllerRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvisingControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: AcademicAdvisingControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_ACADEMICADVISINGCONTROLLER',
                  tableName: 'academic_advising_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: AcademicAdvisingControllerRecord, options: any) => {
          console.log(`[AUDIT] AcademicAdvisingControllerRecord deleted: ${record.id}`);
        },
      },
      scopes: {
        defaultScope: { attributes: { exclude: ['deletedAt'] } },
        active: { where: { status: 'active' } },
        pending: { where: { status: 'pending' } },
        completed: { where: { status: 'completed' } },
        recent: { order: [['createdAt', 'DESC']], limit: 100 },
      },
    },
  );

  return AcademicAdvisingControllerRecord;
};

@Injectable()
export class AcademicAdvisingController {
  constructor(
    private readonly advisingService: AcademicAdvisingControllersService) {}

  // ============================================================================
  // ADVISING SESSIONS
  // ============================================================================

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Schedule new advising session',
    description: 'Creates a new advising appointment between student and advisor with specified type and time slot',
  })
  @ApiCreatedResponse({ description: 'Advising session successfully scheduled' })
  @ApiBadRequestResponse({ description: 'Invalid session data provided' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiBody({
    description: 'Advising session details',
    schema: {
      type: 'object',
      required: ['studentId', 'advisorId', 'appointmentType', 'scheduledStart', 'scheduledEnd'],
      properties: {
        studentId: { type: 'string', example: 'STU123' },
        advisorId: { type: 'string', example: 'ADV456' },
        appointmentType: { type: 'string', enum: ['general', 'academic_planning', 'major_declaration', 'registration', 'graduation', 'crisis'] },
        sessionStatus: { type: 'string', enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'] },
        scheduledStart: { type: 'string', format: 'date-time' },
        scheduledEnd: { type: 'string', format: 'date-time' },
        location: { type: 'string' },
        meetingFormat: { type: 'string', enum: ['in_person', 'virtual', 'phone'] },
        topics: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiOperation({ summary: 'scheduleSession', description: 'Execute scheduleSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'scheduleSession', description: 'Execute scheduleSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async scheduleSession(
    @Body(ValidationPipe) sessionData: AdvisingSessionData,
  ): Promise<AdvisingSessionData> {
    this.logger.log(`Scheduling advising session for student ${sessionData.studentId}`);
    return this.advisingService.scheduleAdvisingSession(sessionData);
  }

  @Get('students/:studentId/sessions')
  @ApiOperation({
    summary: 'Get student advising session history',
    description: 'Retrieves complete advising session history for a specific student',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier', example: 'STU123' })
  @ApiOkResponse({ description: 'Session history retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiOperation({ summary: 'getSessionHistory', description: 'Execute getSessionHistory operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getSessionHistory', description: 'Execute getSessionHistory operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getSessionHistory(
    @Param('studentId') studentId: string,
  ): Promise<AdvisingSessionData[]> {
    this.logger.log(`Retrieving session history for student ${studentId}`);
    return this.advisingService.getAdvisingSessionHistory(studentId);
  }

  @Patch('sessions/:sessionId/start')
  @ApiOperation({
    summary: 'Start advising session',
    description: 'Marks an advising session as in progress',
  })
  @ApiParam({ name: 'sessionId', description: 'Session identifier' })
  @ApiOkResponse({ description: 'Session started successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiOperation({ summary: 'startSession', description: 'Execute startSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'startSession', description: 'Execute startSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async startSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<{ started: boolean; session: AdvisingSessionData }> {
    this.logger.log(`Starting advising session ${sessionId}`);
    return this.advisingService.startAdvisingSession(sessionId);
  }

  @Patch('sessions/:sessionId/complete')
  @ApiOperation({
    summary: 'Complete advising session',
    description: 'Marks an advising session as completed and records session notes',
  })
  @ApiParam({ name: 'sessionId', description: 'Session identifier' })
  @ApiBody({
    description: 'Session completion data',
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string' },
        followUpRequired: { type: 'boolean' },
        nextSteps: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiOkResponse({ description: 'Session completed successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiOperation({ summary: 'completeSession', description: 'Execute completeSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'completeSession', description: 'Execute completeSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async completeSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() completionData: { notes: string; followUpRequired?: boolean; nextSteps?: string[] },
  ): Promise<AdvisingSessionData> {
    this.logger.log(`Completing advising session ${sessionId}`);
    return this.advisingService.completeAdvisingSession(sessionId, completionData);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel advising session',
    description: 'Cancels a scheduled advising session',
  })
  @ApiParam({ name: 'sessionId', description: 'Session identifier' })
  @ApiQuery({ name: 'reason', description: 'Cancellation reason', required: false })
  @ApiOkResponse({ description: 'Session cancelled successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiOperation({ summary: 'cancelSession', description: 'Execute cancelSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'cancelSession', description: 'Execute cancelSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async cancelSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Query('reason') reason?: string,
  ): Promise<{ cancelled: boolean; session: AdvisingSessionData }> {
    this.logger.log(`Cancelling advising session ${sessionId}`);
    return this.advisingService.cancelAdvisingSession(sessionId, reason);
  }

  @Patch('sessions/:sessionId/reschedule')
  @ApiOperation({
    summary: 'Reschedule advising session',
    description: 'Changes the scheduled time for an advising session',
  })
  @ApiParam({ name: 'sessionId', description: 'Session identifier' })
  @ApiBody({
    description: 'New schedule times',
    schema: {
      type: 'object',
      required: ['newStart', 'newEnd'],
      properties: {
        newStart: { type: 'string', format: 'date-time' },
        newEnd: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiOkResponse({ description: 'Session rescheduled successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiOperation({ summary: 'rescheduleSession', description: 'Execute rescheduleSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'rescheduleSession', description: 'Execute rescheduleSession operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async rescheduleSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() scheduleData: { newStart: Date; newEnd: Date },
  ): Promise<AdvisingSessionData> {
    this.logger.log(`Rescheduling session ${sessionId}`);
    return this.advisingService.rescheduleAdvisingSession(
      sessionId,
      scheduleData.newStart,
      scheduleData.newEnd,
    );
  }

  @Post('sessions/walk-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Handle walk-in advising session',
    description: 'Creates an immediate advising session for walk-in students',
  })
  @ApiBody({
    description: 'Walk-in session details',
    schema: {
      type: 'object',
      required: ['studentId', 'advisorId'],
      properties: {
        studentId: { type: 'string' },
        advisorId: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Walk-in session created successfully' })
  @ApiOperation({ summary: 'handleWalkIn', description: 'Execute handleWalkIn operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'handleWalkIn', description: 'Execute handleWalkIn operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async handleWalkIn(
    @Body() walkInData: { studentId: string; advisorId: string },
  ): Promise<AdvisingSessionData> {
    this.logger.log(`Handling walk-in session for student ${walkInData.studentId}`);
    return this.advisingService.handleWalkInSession(
      walkInData.studentId,
      walkInData.advisorId,
    );
  }

  // ============================================================================
  // ADVISOR CASELOAD MANAGEMENT
  // ============================================================================

  @Get('advisors/:advisorId/caseload')
  @ApiOperation({
    summary: 'Get advisor caseload',
    description: 'Retrieves complete caseload information for an advisor including assigned students',
  })
  @ApiParam({ name: 'advisorId', description: 'Advisor identifier' })
  @ApiOkResponse({ description: 'Caseload retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Advisor not found' })
  @ApiOperation({ summary: 'getCaseload', description: 'Execute getCaseload operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getCaseload', description: 'Execute getCaseload operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getCaseload(
    @Param('advisorId') advisorId: string,
  ): Promise<AdvisorCaseload> {
    this.logger.log(`Retrieving caseload for advisor ${advisorId}`);
    return this.advisingService.getAdvisorCaseload(advisorId);
  }

  @Get('advisors/:advisorId/appointments')
  @ApiOperation({
    summary: 'Get upcoming appointments for advisor',
    description: 'Retrieves upcoming advising appointments for a specific advisor',
  })
  @ApiParam({ name: 'advisorId', description: 'Advisor identifier' })
  @ApiQuery({
    name: 'days',
    description: 'Number of days to look ahead',
    required: false,
    type: Number,
    example: 7,
  })
  @ApiOkResponse({ description: 'Appointments retrieved successfully' })
  @ApiOperation({ summary: 'getUpcomingAppointments', description: 'Execute getUpcomingAppointments operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getUpcomingAppointments', description: 'Execute getUpcomingAppointments operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getUpcomingAppointments(
    @Param('advisorId') advisorId: string,
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 7,
  ): Promise<AdvisingSessionData[]> {
    this.logger.log(`Retrieving upcoming appointments for advisor ${advisorId}`);
    return this.advisingService.getUpcomingAppointments(advisorId, days);
  }

  @Post('advisors/:advisorId/students')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Assign students to advisor',
    description: 'Assigns multiple students to an advisor\'s caseload',
  })
  @ApiParam({ name: 'advisorId', description: 'Advisor identifier' })
  @ApiBody({
    description: 'Student assignment data',
    schema: {
      type: 'object',
      required: ['studentIds'],
      properties: {
        studentIds: { type: 'array', items: { type: 'string' } },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Students assigned successfully' })
  @ApiOperation({ summary: 'assignStudents', description: 'Execute assignStudents operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'assignStudents', description: 'Execute assignStudents operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async assignStudents(
    @Param('advisorId') advisorId: string,
    @Body() assignmentData: { studentIds: string[]; priority?: string },
  ): Promise<{ assigned: number; caseload: AdvisorCaseload }> {
    this.logger.log(`Assigning ${assignmentData.studentIds.length} students to advisor ${advisorId}`);
    return this.advisingService.assignStudentsToAdvisor(advisorId, assignmentData.studentIds);
  }

  // ============================================================================
  // STUDENT PROGRESS & RISK MONITORING
  // ============================================================================

  @Get('students/at-risk')
  @ApiOperation({
    summary: 'Identify at-risk students',
    description: 'Identifies students who are at risk based on academic performance and engagement metrics',
  })
  @ApiQuery({
    name: 'threshold',
    description: 'Risk threshold (0-1)',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results',
    required: false,
    type: Number,
  })
  @ApiOkResponse({ description: 'At-risk students identified successfully' })
  @ApiOperation({ summary: 'getAtRiskStudents', description: 'Execute getAtRiskStudents operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getAtRiskStudents', description: 'Execute getAtRiskStudents operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getAtRiskStudents(
    @Query('threshold', new ParseIntPipe({ optional: true })) threshold?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<Array<{ studentId: string; riskLevel: RiskLevel; indicators: string[] }>> {
    this.logger.log('Identifying at-risk students');
    return this.advisingService.identifyAtRiskStudents(threshold, limit);
  }

  @Get('students/:studentId/progress')
  @ApiOperation({
    summary: 'Generate student progress summary',
    description: 'Generates comprehensive progress summary including academic standing, degree progress, and milestones',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiOkResponse({ description: 'Progress summary generated successfully' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiOperation({ summary: 'getProgressSummary', description: 'Execute getProgressSummary operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getProgressSummary', description: 'Execute getProgressSummary operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getProgressSummary(
    @Param('studentId') studentId: string,
  ): Promise<ProgressSummary> {
    this.logger.log(`Generating progress summary for student ${studentId}`);
    return this.advisingService.generateProgressSummary(studentId);
  }

  // ============================================================================
  // EARLY ALERTS & INTERVENTIONS
  // ============================================================================

  @Post('alerts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create early alert',
    description: 'Creates an early alert for a student requiring intervention',
  })
  @ApiBody({
    description: 'Early alert data',
    schema: {
      type: 'object',
      required: ['studentId', 'courseId', 'facultyId', 'alertType', 'priority'],
      properties: {
        studentId: { type: 'string' },
        courseId: { type: 'string' },
        facultyId: { type: 'string' },
        alertType: { type: 'string', enum: ['attendance', 'performance', 'behavior', 'participation', 'other'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        description: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Early alert created successfully' })
  @ApiOperation({ summary: 'createAlert', description: 'Execute createAlert operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'createAlert', description: 'Execute createAlert operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async createAlert(
    @Body(ValidationPipe) alertData: EarlyAlert,
  ): Promise<EarlyAlert> {
    this.logger.log(`Creating early alert for student ${alertData.studentId}`);
    return this.advisingService.createEarlyAlert(alertData);
  }

  @Post('students/:studentId/intervention-plan')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create intervention plan',
    description: 'Creates a comprehensive intervention plan for an at-risk student',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiBody({
    description: 'Risk level assessment',
    schema: {
      type: 'object',
      required: ['riskLevel'],
      properties: {
        riskLevel: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Intervention plan created successfully' })
  @ApiOperation({ summary: 'createInterventionPlan', description: 'Execute createInterventionPlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'createInterventionPlan', description: 'Execute createInterventionPlan operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async createInterventionPlan(
    @Param('studentId') studentId: string,
    @Body() riskData: { riskLevel: RiskLevel },
  ): Promise<InterventionPlan> {
    this.logger.log(`Creating intervention plan for student ${studentId}`);
    return this.advisingService.createInterventionPlan(studentId, riskData.riskLevel);
  }

  // ============================================================================
  // STUDENT HOLDS
  // ============================================================================

  @Post('holds')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Place student hold',
    description: 'Places an administrative hold on a student account',
  })
  @ApiBody({
    description: 'Hold data',
    schema: {
      type: 'object',
      required: ['studentId', 'holdType', 'placedBy'],
      properties: {
        studentId: { type: 'string' },
        holdType: { type: 'string', enum: ['academic', 'financial', 'conduct', 'registration', 'immunization', 'administrative'] },
        placedBy: { type: 'string' },
        reason: { type: 'string' },
        notes: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Hold placed successfully' })
  @ApiOperation({ summary: 'placeHold', description: 'Execute placeHold operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'placeHold', description: 'Execute placeHold operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async placeHold(
    @Body(ValidationPipe) holdData: StudentHold,
  ): Promise<StudentHold> {
    this.logger.log(`Placing hold for student ${holdData.studentId}`);
    return this.advisingService.placeStudentHold(holdData);
  }

  @Delete('holds/:holdId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove student hold',
    description: 'Removes an administrative hold from a student account',
  })
  @ApiParam({ name: 'holdId', description: 'Hold identifier' })
  @ApiQuery({ name: 'resolvedBy', description: 'User who resolved the hold', required: false })
  @ApiOkResponse({ description: 'Hold removed successfully' })
  @ApiNotFoundResponse({ description: 'Hold not found' })
  @ApiOperation({ summary: 'removeHold', description: 'Execute removeHold operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'removeHold', description: 'Execute removeHold operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async removeHold(
    @Param('holdId', ParseUUIDPipe) holdId: string,
    @Query('resolvedBy') resolvedBy?: string,
  ): Promise<{ removed: boolean; hold: StudentHold }> {
    this.logger.log(`Removing hold ${holdId}`);
    return this.advisingService.removeStudentHold(holdId, resolvedBy);
  }

  @Get('students/:studentId/holds')
  @ApiOperation({
    summary: 'Get active student holds',
    description: 'Retrieves all active holds for a specific student',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiOkResponse({ description: 'Holds retrieved successfully' })
  @ApiOperation({ summary: 'getStudentHolds', description: 'Execute getStudentHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getStudentHolds', description: 'Execute getStudentHolds operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getStudentHolds(
    @Param('studentId') studentId: string,
  ): Promise<StudentHold[]> {
    this.logger.log(`Retrieving holds for student ${studentId}`);
    return this.advisingService.getActiveStudentHolds(studentId);
  }
}
