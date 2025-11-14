import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';
import { AppointmentType } from './create-appointment.dto';
import { AppointmentStatus } from './update-appointment.dto';
import { UserResponseDto } from '@/services/user/dto/user-response.dto';

/**
 * Lightweight Student Summary DTO for Appointment Associations
 *
 * Provides minimal student information needed in appointment responses
 * without circular dependencies or excessive data transfer.
 *
 * @remarks
 * This DTO is used to prevent over-fetching when including student data
 * in appointment responses. It contains only essential identification
 * and display information.
 *
 * @example
 * ```typescript
 * const studentSummary: StudentSummaryDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   gradeLevel: '10',
 *   studentId: 'STU-2024-001'
 * };
 * ```
 */
@Exclude()
export class StudentSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student first name',
    example: 'John',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
  })
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student grade level',
    example: '10',
  })
  gradeLevel?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student identification number',
    example: 'STU-2024-001',
  })
  studentId?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student date of birth',
    example: '2010-05-15T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  dateOfBirth?: Date;
}

/**
 * Comprehensive Appointment Response DTO
 *
 * Full representation of an appointment with all base fields, computed virtual
 * fields, associations, and metadata. Used for detailed appointment views and
 * single appointment retrieval.
 *
 * @remarks
 * This DTO includes:
 * - All base appointment fields (id, studentId, nurseId, type, etc.)
 * - Virtual computed fields (isUpcoming, isToday, minutesUntil)
 * - Recurring appointment metadata
 * - Associated entities (student, nurse)
 * - Audit timestamps (createdAt, updatedAt)
 *
 * Virtual fields are computed on the server and provide convenient
 * client-side information without additional calculations.
 *
 * @example
 * ```typescript
 * const appointment: AppointmentResponseDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   studentId: '987fcdeb-51a2-43d1-b456-426614174001',
 *   nurseId: 'abc12345-6789-0def-ghij-klmnopqrstuv',
 *   type: AppointmentType.ROUTINE_CHECKUP,
 *   scheduledAt: new Date('2025-11-15T10:30:00Z'),
 *   duration: 30,
 *   status: AppointmentStatus.SCHEDULED,
 *   reason: 'Annual physical examination',
 *   isUpcoming: true,
 *   isToday: false,
 *   minutesUntil: 1440,
 *   createdAt: new Date('2025-11-14T08:00:00Z'),
 *   updatedAt: new Date('2025-11-14T08:00:00Z')
 * };
 * ```
 */
@Exclude()
export class AppointmentResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique appointment identifier (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student UUID - references the patient for this appointment',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Nurse/healthcare provider UUID - assigned staff member',
    example: 'abc12345-6789-0def-ghij-klmnopqrstuv',
    format: 'uuid',
  })
  nurseId: string;

  @Expose()
  @ApiProperty({
    description: 'Type of appointment being conducted',
    enum: AppointmentType,
    enumName: 'AppointmentType',
    example: AppointmentType.ROUTINE_CHECKUP,
    examples: {
      routine: {
        value: AppointmentType.ROUTINE_CHECKUP,
        description: 'Regular scheduled health checkup',
      },
      medication: {
        value: AppointmentType.MEDICATION_ADMINISTRATION,
        description: 'Medication administration or prescription refill',
      },
      injury: {
        value: AppointmentType.INJURY_ASSESSMENT,
        description: 'Assessment of physical injury',
      },
      illness: {
        value: AppointmentType.ILLNESS_EVALUATION,
        description: 'Evaluation of illness symptoms',
      },
      followUp: {
        value: AppointmentType.FOLLOW_UP,
        description: 'Follow-up appointment for previous visit',
      },
      screening: {
        value: AppointmentType.SCREENING,
        description: 'Health screening (vision, hearing, etc.)',
      },
      emergency: {
        value: AppointmentType.EMERGENCY,
        description: 'Urgent or emergency care',
      },
    },
  })
  type: AppointmentType;

  @Expose()
  @ApiProperty({
    description: 'Scheduled date and time for the appointment (ISO 8601 format)',
    example: '2025-11-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  scheduledAt: Date;

  @Expose()
  @ApiProperty({
    description:
      'Duration of appointment in minutes. Must be between 15 and 120 minutes. Default is 30 minutes.',
    example: 30,
    minimum: 15,
    maximum: 120,
    default: 30,
    type: 'integer',
  })
  duration: number;

  @Expose()
  @ApiProperty({
    description: 'Current status of the appointment in its lifecycle',
    enum: AppointmentStatus,
    enumName: 'AppointmentStatus',
    example: AppointmentStatus.SCHEDULED,
    examples: {
      scheduled: {
        value: AppointmentStatus.SCHEDULED,
        description: 'Appointment is scheduled and confirmed',
      },
      inProgress: {
        value: AppointmentStatus.IN_PROGRESS,
        description: 'Appointment is currently in progress',
      },
      completed: {
        value: AppointmentStatus.COMPLETED,
        description: 'Appointment has been completed',
      },
      cancelled: {
        value: AppointmentStatus.CANCELLED,
        description: 'Appointment was cancelled',
      },
      noShow: {
        value: AppointmentStatus.NO_SHOW,
        description: 'Student did not show up for the appointment',
      },
    },
  })
  status: AppointmentStatus;

  @Expose()
  @ApiProperty({
    description:
      'Reason for the appointment. Must be between 3 and 500 characters.',
    example: 'Annual physical examination and immunization review',
    minLength: 3,
    maxLength: 500,
  })
  reason: string;

  @Expose()
  @ApiPropertyOptional({
    description:
      'Additional notes or instructions for the appointment. Maximum 5000 characters.',
    example:
      'Student has documented fear of needles. Please use distraction techniques and provide extra reassurance.',
    maxLength: 5000,
    nullable: true,
  })
  notes?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description:
      'Recurring group identifier - groups related recurring appointments together',
    example: 'rec-123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    nullable: true,
  })
  recurringGroupId?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description:
      'Frequency of recurring appointments (DAILY, WEEKLY, MONTHLY, YEARLY)',
    example: 'WEEKLY',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    nullable: true,
  })
  recurringFrequency?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description:
      'End date for recurring appointments - recurring instances stop after this date',
    example: '2026-06-30T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  recurringEndDate?: Date | null;

  @Expose()
  @ApiProperty({
    description:
      'Virtual field: Indicates if appointment is upcoming (scheduled in the future and not cancelled/completed)',
    example: true,
    type: 'boolean',
  })
  isUpcoming: boolean;

  @Expose()
  @ApiProperty({
    description:
      "Virtual field: Indicates if appointment is scheduled for today's date",
    example: false,
    type: 'boolean',
  })
  isToday: boolean;

  @Expose()
  @ApiProperty({
    description:
      'Virtual field: Number of minutes until appointment. Negative if appointment is in the past.',
    example: 1440,
    type: 'integer',
  })
  minutesUntil: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated student information (when included)',
    type: () => StudentSummaryDto,
    nullable: true,
  })
  @Type(() => StudentSummaryDto)
  student?: StudentSummaryDto | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated nurse/healthcare provider information (when included)',
    type: () => UserResponseDto,
    nullable: true,
  })
  @Type(() => UserResponseDto)
  nurse?: UserResponseDto | null;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the appointment record was created',
    example: '2025-11-14T08:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the appointment record was last updated',
    example: '2025-11-14T09:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

/**
 * Appointment Summary DTO
 *
 * Lightweight appointment representation for use in associations and list views
 * where full appointment details are not required. Optimized for minimal
 * data transfer while providing essential appointment information.
 *
 * @remarks
 * This DTO is ideal for:
 * - Embedding in other entity responses (e.g., student.upcomingAppointments)
 * - Dashboard widgets showing appointment counts
 * - Quick reference lists
 * - Association previews
 *
 * Excludes heavy fields like notes, recurring metadata, and nested associations.
 *
 * @example
 * ```typescript
 * const summary: AppointmentSummaryDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   type: AppointmentType.ROUTINE_CHECKUP,
 *   scheduledAt: new Date('2025-11-15T10:30:00Z'),
 *   duration: 30,
 *   status: AppointmentStatus.SCHEDULED,
 *   reason: 'Annual physical'
 * };
 * ```
 */
@Exclude()
export class AppointmentSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Appointment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student UUID',
    example: '987fcdeb-51a2-43d1-b456-426614174001',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Nurse UUID',
    example: 'abc12345-6789-0def-ghij-klmnopqrstuv',
    format: 'uuid',
  })
  nurseId: string;

  @Expose()
  @ApiProperty({
    description: 'Appointment type',
    enum: AppointmentType,
    example: AppointmentType.ROUTINE_CHECKUP,
  })
  type: AppointmentType;

  @Expose()
  @ApiProperty({
    description: 'Scheduled date and time',
    example: '2025-11-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  scheduledAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Duration in minutes',
    example: 30,
    minimum: 15,
    maximum: 120,
  })
  duration: number;

  @Expose()
  @ApiProperty({
    description: 'Appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Expose()
  @ApiProperty({
    description: 'Reason for appointment',
    example: 'Annual physical examination',
    maxLength: 500,
  })
  reason: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student first and last name (when included)',
    example: 'John Doe',
    nullable: true,
  })
  studentName?: string | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Nurse first and last name (when included)',
    example: 'Jane Smith',
    nullable: true,
  })
  nurseName?: string | null;
}

/**
 * Paginated Appointment List Response DTO
 *
 * Standard paginated response for appointment list endpoints. Wraps an array
 * of AppointmentResponseDto with pagination metadata.
 *
 * @remarks
 * This DTO uses the standard PaginatedResponseDto pattern for consistency
 * across all list endpoints in the application. It provides:
 * - Array of appointments for the current page
 * - Comprehensive pagination metadata (page, limit, total, hasNext, etc.)
 *
 * The pagination metadata enables proper client-side pagination controls
 * and helps prevent over-fetching of large datasets.
 *
 * @example
 * ```typescript
 * const response: AppointmentListResponseDto = {
 *   data: [appointment1, appointment2, ...],
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 150,
 *     pages: 8,
 *     hasNext: true,
 *     hasPrev: false,
 *     nextPage: 2,
 *     prevPage: null
 *   }
 * };
 * ```
 *
 * @see {@link PaginatedResponseDto} for pagination implementation details
 * @see {@link AppointmentResponseDto} for individual appointment structure
 */
export class AppointmentListResponseDto extends PaginatedResponseDto<AppointmentResponseDto> {
  @ApiProperty({
    description: 'Array of appointments for the current page',
    type: [AppointmentResponseDto],
    isArray: true,
  })
  @Type(() => AppointmentResponseDto)
  declare data: AppointmentResponseDto[];
}

/**
 * Appointment Statistics DTO
 *
 * Aggregated metrics and statistics for appointment data. Provides counts,
 * percentages, and trend information for dashboards and reporting.
 *
 * @remarks
 * This DTO aggregates appointment data to provide actionable insights:
 * - Status distribution (scheduled, completed, cancelled, etc.)
 * - Type distribution (routine checkups, emergencies, etc.)
 * - Time-based metrics (today's appointments, upcoming counts)
 * - Utilization rates and trends
 *
 * Statistics can be filtered by date range, nurse, student, or other criteria
 * using the StatisticsFiltersDto query parameters.
 *
 * @example
 * ```typescript
 * const stats: AppointmentStatisticsDto = {
 *   totalAppointments: 1500,
 *   scheduledCount: 45,
 *   completedCount: 1200,
 *   cancelledCount: 180,
 *   noShowCount: 75,
 *   inProgressCount: 3,
 *   todayCount: 12,
 *   upcomingCount: 45,
 *   completionRate: 80.0,
 *   noShowRate: 5.0,
 *   cancellationRate: 12.0,
 *   averageDuration: 32.5,
 *   byType: {
 *     ROUTINE_CHECKUP: 800,
 *     MEDICATION_ADMINISTRATION: 350,
 *     INJURY_ASSESSMENT: 150,
 *     ILLNESS_EVALUATION: 120,
 *     FOLLOW_UP: 50,
 *     SCREENING: 25,
 *     EMERGENCY: 5
 *   },
 *   byStatus: {
 *     SCHEDULED: 45,
 *     IN_PROGRESS: 3,
 *     COMPLETED: 1200,
 *     CANCELLED: 180,
 *     NO_SHOW: 75
 *   }
 * };
 * ```
 */
export class AppointmentStatisticsDto {
  @ApiProperty({
    description: 'Total number of appointments in the filtered dataset',
    example: 1500,
    type: 'integer',
    minimum: 0,
  })
  totalAppointments: number;

  @ApiProperty({
    description: 'Number of appointments with SCHEDULED status',
    example: 45,
    type: 'integer',
    minimum: 0,
  })
  scheduledCount: number;

  @ApiProperty({
    description: 'Number of appointments with COMPLETED status',
    example: 1200,
    type: 'integer',
    minimum: 0,
  })
  completedCount: number;

  @ApiProperty({
    description: 'Number of appointments with CANCELLED status',
    example: 180,
    type: 'integer',
    minimum: 0,
  })
  cancelledCount: number;

  @ApiProperty({
    description: 'Number of appointments with NO_SHOW status',
    example: 75,
    type: 'integer',
    minimum: 0,
  })
  noShowCount: number;

  @ApiProperty({
    description: 'Number of appointments with IN_PROGRESS status',
    example: 3,
    type: 'integer',
    minimum: 0,
  })
  inProgressCount: number;

  @ApiProperty({
    description: "Number of appointments scheduled for today's date",
    example: 12,
    type: 'integer',
    minimum: 0,
  })
  todayCount: number;

  @ApiProperty({
    description:
      'Number of upcoming appointments (future dates with SCHEDULED or IN_PROGRESS status)',
    example: 45,
    type: 'integer',
    minimum: 0,
  })
  upcomingCount: number;

  @ApiProperty({
    description:
      'Percentage of appointments completed successfully (completed / (total - cancelled))',
    example: 80.0,
    type: 'number',
    format: 'float',
    minimum: 0,
    maximum: 100,
  })
  completionRate: number;

  @ApiProperty({
    description:
      'Percentage of appointments where student did not show (no-shows / total)',
    example: 5.0,
    type: 'number',
    format: 'float',
    minimum: 0,
    maximum: 100,
  })
  noShowRate: number;

  @ApiProperty({
    description: 'Percentage of appointments that were cancelled (cancelled / total)',
    example: 12.0,
    type: 'number',
    format: 'float',
    minimum: 0,
    maximum: 100,
  })
  cancellationRate: number;

  @ApiProperty({
    description:
      'Average duration of appointments in minutes across the filtered dataset',
    example: 32.5,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  averageDuration: number;

  @ApiProperty({
    description: 'Appointment counts by type',
    example: {
      ROUTINE_CHECKUP: 800,
      MEDICATION_ADMINISTRATION: 350,
      INJURY_ASSESSMENT: 150,
      ILLNESS_EVALUATION: 120,
      FOLLOW_UP: 50,
      SCREENING: 25,
      EMERGENCY: 5,
    },
    type: 'object',
    additionalProperties: {
      type: 'integer',
      minimum: 0,
    },
  })
  byType: Record<AppointmentType, number>;

  @ApiProperty({
    description: 'Appointment counts by status',
    example: {
      SCHEDULED: 45,
      IN_PROGRESS: 3,
      COMPLETED: 1200,
      CANCELLED: 180,
      NO_SHOW: 75,
    },
    type: 'object',
    additionalProperties: {
      type: 'integer',
      minimum: 0,
    },
  })
  byStatus: Record<AppointmentStatus, number>;

  @ApiPropertyOptional({
    description: 'Monthly trend data (count per month) for the filtered period',
    example: [
      { month: '2025-01', count: 120 },
      { month: '2025-02', count: 135 },
      { month: '2025-03', count: 142 },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        month: {
          type: 'string',
          description: 'Month in YYYY-MM format',
          example: '2025-01',
        },
        count: {
          type: 'integer',
          description: 'Number of appointments in that month',
          example: 120,
          minimum: 0,
        },
      },
    },
    nullable: true,
  })
  monthlyTrend?: Array<{ month: string; count: number }> | null;

  @ApiPropertyOptional({
    description: 'Busiest hours of the day (hour: count mapping)',
    example: {
      '08': 25,
      '09': 45,
      '10': 52,
      '11': 48,
      '13': 38,
      '14': 42,
      '15': 35,
    },
    type: 'object',
    additionalProperties: {
      type: 'integer',
      minimum: 0,
    },
    nullable: true,
  })
  busiestHours?: Record<string, number> | null;
}

/**
 * Maps a Sequelize Appointment model instance to AppointmentResponseDto
 *
 * Converts the raw Sequelize model data into a properly typed DTO with all
 * fields, computed virtual attributes, and nested associations.
 *
 * @template Appointment - Sequelize Appointment model type
 * @param {Appointment} appointment - The Sequelize Appointment model instance
 * @returns {AppointmentResponseDto} Fully populated response DTO
 *
 * @remarks
 * This mapper function:
 * - Extracts all base fields from the model
 * - Computes virtual fields (isUpcoming, isToday, minutesUntil)
 * - Maps nested associations (student, nurse) if loaded
 * - Handles optional/nullable fields properly
 * - Ensures type safety for all enum fields
 *
 * Virtual fields are computed based on the appointment's scheduledAt date
 * and current status. The calculations are performed server-side to maintain
 * consistency across all clients.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const appointment = await Appointment.findByPk(id);
 * const dto = mapAppointmentToResponseDto(appointment);
 *
 * // With associations
 * const appointment = await Appointment.findByPk(id, {
 *   include: [
 *     { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
 *     { association: 'nurse', attributes: ['id', 'firstName', 'lastName', 'email'] }
 *   ]
 * });
 * const dto = mapAppointmentToResponseDto(appointment);
 * // dto.student and dto.nurse will be populated
 * ```
 *
 * @throws {TypeError} If appointment parameter is null or undefined
 *
 * @see {@link AppointmentResponseDto} for the return type structure
 */
export function mapAppointmentToResponseDto(appointment: any): AppointmentResponseDto {
  if (!appointment) {
    throw new TypeError('Appointment parameter cannot be null or undefined');
  }

  const dto = new AppointmentResponseDto();

  // Base fields
  dto.id = appointment.id;
  dto.studentId = appointment.studentId;
  dto.nurseId = appointment.nurseId;
  dto.type = appointment.type;
  dto.scheduledAt = appointment.scheduledAt;
  dto.duration = appointment.duration;
  dto.status = appointment.status;
  dto.reason = appointment.reason;
  dto.notes = appointment.notes ?? null;

  // Recurring appointment fields
  dto.recurringGroupId = appointment.recurringGroupId ?? null;
  dto.recurringFrequency = appointment.recurringFrequency ?? null;
  dto.recurringEndDate = appointment.recurringEndDate ?? null;

  // Virtual computed fields
  dto.isUpcoming =
    appointment.scheduledAt > new Date() &&
    [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(
      appointment.status,
    );

  const today = new Date();
  const apptDate = new Date(appointment.scheduledAt);
  dto.isToday = apptDate.toDateString() === today.toDateString();

  dto.minutesUntil = Math.floor(
    (appointment.scheduledAt.getTime() - Date.now()) / (1000 * 60),
  );

  // Timestamps
  dto.createdAt = appointment.createdAt;
  dto.updatedAt = appointment.updatedAt;

  // Map nested associations if loaded
  if (appointment.student) {
    const student = new StudentSummaryDto();
    student.id = appointment.student.id;
    student.firstName = appointment.student.firstName;
    student.lastName = appointment.student.lastName;
    student.gradeLevel = appointment.student.gradeLevel ?? undefined;
    student.studentId = appointment.student.studentId ?? undefined;
    student.dateOfBirth = appointment.student.dateOfBirth ?? undefined;
    dto.student = student;
  }

  if (appointment.nurse) {
    // UserResponseDto should be mapped separately if available
    // For now, we'll just assign it directly assuming proper structure
    dto.nurse = appointment.nurse;
  }

  return dto;
}

/**
 * Maps a Sequelize Appointment model instance to AppointmentSummaryDto
 *
 * Converts the raw Sequelize model data into a lightweight summary DTO
 * optimized for list views and associations.
 *
 * @template Appointment - Sequelize Appointment model type
 * @param {Appointment} appointment - The Sequelize Appointment model instance
 * @returns {AppointmentSummaryDto} Lightweight summary DTO
 *
 * @remarks
 * This mapper creates a minimal representation by:
 * - Including only essential appointment fields
 * - Omitting notes, recurring metadata, and full associations
 * - Optionally including formatted student/nurse names if associations loaded
 * - Reducing payload size for list endpoints
 *
 * @example
 * ```typescript
 * const appointments = await Appointment.findAll({
 *   include: [
 *     { association: 'student', attributes: ['firstName', 'lastName'] },
 *     { association: 'nurse', attributes: ['firstName', 'lastName'] }
 *   ]
 * });
 *
 * const summaries = appointments.map(mapAppointmentToSummaryDto);
 * // Each summary contains core fields + studentName and nurseName
 * ```
 *
 * @throws {TypeError} If appointment parameter is null or undefined
 *
 * @see {@link AppointmentSummaryDto} for the return type structure
 */
export function mapAppointmentToSummaryDto(appointment: any): AppointmentSummaryDto {
  if (!appointment) {
    throw new TypeError('Appointment parameter cannot be null or undefined');
  }

  const dto = new AppointmentSummaryDto();

  dto.id = appointment.id;
  dto.studentId = appointment.studentId;
  dto.nurseId = appointment.nurseId;
  dto.type = appointment.type;
  dto.scheduledAt = appointment.scheduledAt;
  dto.duration = appointment.duration;
  dto.status = appointment.status;
  dto.reason = appointment.reason;

  // Include formatted names if associations are loaded
  if (appointment.student) {
    dto.studentName = `${appointment.student.firstName} ${appointment.student.lastName}`;
  }

  if (appointment.nurse) {
    dto.nurseName = `${appointment.nurse.firstName} ${appointment.nurse.lastName}`;
  }

  return dto;
}
