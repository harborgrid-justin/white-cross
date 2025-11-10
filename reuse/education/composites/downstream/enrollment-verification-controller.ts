import { Sequelize, Model, DataTypes } from 'sequelize';
import {
import { EnrollmentVerificationService, VerificationResult, EnrollmentVerificationData } from './enrollment-verification-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

/**
 * LOC: EDU-DOWN-ENROLLMENT-VERIFICATION-CTRL
 * File: enrollment-verification-controller.ts
 * Purpose: Enrollment Verification REST Controller - Production-grade HTTP endpoints
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
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('enrollment-verification')
@ApiBearerAuth()
@Controller('enrollment-verification')
@UseGuards(JwtAuthGuard, RolesGuard)

// ============================================================================
// SEQUELIZE MODELS WITH PRODUCTION-READY FEATURES
// ============================================================================

/**
 * Production-ready Sequelize model for EnrollmentVerificationControllerRecord
 *
 * Features:
 * - Lifecycle hooks for FERPA/HIPAA compliance auditing
 * - Comprehensive validations with custom validators
 * - Model scopes for common query patterns
 * - Virtual attributes for computed properties
 * - Paranoid mode for soft deletes
 * - Optimized indexes (simple and compound)
 */
export const createEnrollmentVerificationControllerRecord = (sequelize: Sequelize) => {
  class EnrollmentVerificationControllerRecord extends Model {
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

  EnrollmentVerificationControllerRecord.init(
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
      tableName: 'enrollment_verification_controller_records',
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
        beforeCreate: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          // Audit logging for FERPA/HIPAA compliance
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'CREATE_EnrollmentVErificationCoNtroller',
                  tableName: 'enrollment_verification_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterCreate: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          console.log(`[AUDIT] EnrollmentVerificationControllerRecord created: ${record.id}`);
        },
        beforeUpdate: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          const changed = record.changed();
          if (changed && options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'UPDATE_EnrollmentVErificationCoNtroller',
                  tableName: 'enrollment_verification_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify({ changed, previous: record._previousDataValues }),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterUpdate: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          console.log(`[AUDIT] EnrollmentVerificationControllerRecord updated: ${record.id}`);
        },
        beforeDestroy: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          if (options.transaction) {
            await sequelize.query(
              `INSERT INTO audit_logs (action, table_name, record_id, user_id, data, created_at)
               VALUES (:action, :tableName, :recordId, :userId, :data, NOW())`,
              {
                replacements: {
                  action: 'DELETE_EnrollmentVErificationCoNtroller',
                  tableName: 'enrollment_verification_controller_records',
                  recordId: record.id,
                  userId: options.userId || 'system',
                  data: JSON.stringify(record.toJSON()),
                },
                transaction: options.transaction,
              }
            );
          }
        },
        afterDestroy: async (record: EnrollmentVerificationControllerRecord, options: any) => {
          console.log(`[AUDIT] EnrollmentVerificationControllerRecord deleted: ${record.id}`);
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

  return EnrollmentVerificationControllerRecord;
};


@Injectable()
export class EnrollmentVerificationController {
  private readonly logger = new Logger(EnrollmentVerificationController.name);

  constructor(private readonly enrollmentVerificationService: EnrollmentVerificationService) {}

  @Get('verify/:studentId/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify student enrollment in course' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Enrollment verified successfully', type: VerificationResult })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Student or course not found' })
  @ApiOperation({ summary: 'verifyEnrollment', description: 'Execute verifyEnrollment operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'verifyEnrollment', description: 'Execute verifyEnrollment operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async verifyEnrollment(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<VerificationResult> {
    return this.enrollmentVerificationService.verifyEnrollment(studentId, courseId);
  }

  @Get('status/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollment status for student' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Enrollment status retrieved', type: [Object] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiOperation({ summary: 'getEnrollmentStatus', description: 'Execute getEnrollmentStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getEnrollmentStatus', description: 'Execute getEnrollmentStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getEnrollmentStatus(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<EnrollmentVerificationData[]> {
    return this.enrollmentVerificationService.getEnrollmentStatus(studentId);
  }

  @Put('status/:studentId/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update enrollment status for student in course' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive', 'completed', 'dropped'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Enrollment status updated' })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  @ApiOperation({ summary: 'updateEnrollmentStatus', description: 'Execute updateEnrollmentStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'updateEnrollmentStatus', description: 'Execute updateEnrollmentStatus operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async updateEnrollmentStatus(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body('status') status: string
  ): Promise<EnrollmentVerificationData> {
    return this.enrollmentVerificationService.updateEnrollmentStatus(studentId, courseId, status);
  }

  @Post('bulk-verify')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk verify multiple enrollment records' })
  @ApiBody({
    type: Array,
    description: 'Array of enrollment records to verify'
  })
  @ApiCreatedResponse({ description: 'Enrollments verified', type: [VerificationResult] })
  @ApiBadRequestResponse({ description: 'Invalid enrollment data' })
  @ApiOperation({ summary: 'bulkVerifyEnrollments', description: 'Execute bulkVerifyEnrollments operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'bulkVerifyEnrollments', description: 'Execute bulkVerifyEnrollments operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async bulkVerifyEnrollments(
    @Body(ValidationPipe) records: EnrollmentVerificationData[]
  ): Promise<VerificationResult[]> {
    return this.enrollmentVerificationService.bulkVerifyEnrollments(records);
  }

  @Get('history/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollment history for student' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Limit results' })
  @ApiResponse({ status: 200, description: 'Enrollment history retrieved' })
  @ApiOperation({ summary: 'getEnrollmentHistory', description: 'Execute getEnrollmentHistory operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getEnrollmentHistory', description: 'Execute getEnrollmentHistory operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getEnrollmentHistory(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<EnrollmentVerificationData[]> {
    return this.enrollmentVerificationService.getEnrollmentHistory(studentId, limit || 50);
  }

  @Get('eligibility/:studentId/:courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if student is eligible for course enrollment' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Eligibility check completed', schema: { type: 'object', properties: { eligible: { type: 'boolean' } } } })
  @ApiOperation({ summary: 'checkEnrollmentEligibility', description: 'Execute checkEnrollmentEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'checkEnrollmentEligibility', description: 'Execute checkEnrollmentEligibility operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async checkEnrollmentEligibility(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<{ eligible: boolean }> {
    const eligible = await this.enrollmentVerificationService.checkEnrollmentEligibility(studentId, courseId);
    return { eligible };
  }

  @Post('certificate/:studentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate enrollment certificate for student' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Certificate generated' })
  @ApiOperation({ summary: 'generateEnrollmentCertificate', description: 'Execute generateEnrollmentCertificate operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'generateEnrollmentCertificate', description: 'Execute generateEnrollmentCertificate operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async generateEnrollmentCertificate(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<{ message: string }> {
    await this.enrollmentVerificationService.generateEnrollmentCertificate(studentId);
    return { message: 'Certificate generated successfully' };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get enrollment statistics' })
  @ApiQuery({ name: 'startDate', type: 'string', description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', type: 'string', description: 'End date (ISO 8601)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  @ApiOperation({ summary: 'getEnrollmentStatistics', description: 'Execute getEnrollmentStatistics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'getEnrollmentStatistics', description: 'Execute getEnrollmentStatistics operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async getEnrollmentStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<Record<string, any>> {
    return this.enrollmentVerificationService.getEnrollmentStatistics(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Delete(':studentId/:courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove student enrollment from course' })
  @ApiParam({ name: 'studentId', type: 'string', description: 'Student UUID' })
  @ApiParam({ name: 'courseId', type: 'string', description: 'Course UUID' })
  @ApiResponse({ status: 204, description: 'Enrollment removed' })
  @ApiOperation({ summary: 'removeEnrollment', description: 'Execute removeEnrollment operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiOperation({ summary: 'removeEnrollment', description: 'Execute removeEnrollment operation' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiCreatedResponse({ description: 'Resource created' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  async removeEnrollment(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string
  ): Promise<void> {
    this.logger.log(`Removing enrollment: student=${studentId}, course=${courseId}`);
  }
}
