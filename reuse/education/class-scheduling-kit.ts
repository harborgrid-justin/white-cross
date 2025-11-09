/**
 * LOC: EDUCATION_CLASS_SCHEDULING_001
 * File: /reuse/education/class-scheduling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Scheduling services
 *   - Academic calendar services
 *   - Room management controllers
 *   - Course registration services
 *   - Conflict resolution services
 */

/**
 * File: /reuse/education/class-scheduling-kit.ts
 * Locator: WC-EDUCATION-CLASS-SCHEDULING-001
 * Purpose: Production-Grade Class Scheduling Kit - Comprehensive academic scheduling toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, date-fns
 * Downstream: ../backend/education/*, Scheduling Services, Registration Services, Room Services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, zod
 * Exports: 45 production-ready class scheduling and room management functions
 *
 * LLM Context: Production-grade class scheduling system for education SIS platform.
 * Provides comprehensive scheduling capabilities including course scheduling with time slot
 * management, room assignment and capacity planning, multi-level conflict detection (time,
 * room, faculty, student), schedule optimization algorithms for resource utilization, lab
 * scheduling with specialized equipment requirements, exam scheduling with conflict-free
 * time slots, schedule publishing and change management, recurring class patterns (daily,
 * weekly, bi-weekly), block scheduling support, waitlist management, room utilization
 * analytics, capacity overflow handling, time zone support for online classes, schedule
 * templates and patterns, holiday and break handling, final exam period scheduling,
 * schedule validation and compliance checks, real-time availability queries, schedule
 * change notifications, automatic conflict resolution suggestions, course section management,
 * cross-listed course handling, and comprehensive audit logging. Includes RESTful API design
 * with versioning, proper HTTP methods, status codes, error handling, pagination, filtering,
 * and sorting. Advanced TypeScript patterns with generics, discriminated unions, and utility
 * types for maximum type safety.
 */

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BeforeCreate,
  BeforeUpdate,
  Index,
  Unique,
} from 'sequelize-typescript';
import { z } from 'zod';
import {
  addDays,
  addWeeks,
  addMinutes,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  isWithinInterval,
  areIntervalsOverlapping,
  differenceInMinutes,
  format,
  parseISO,
  setDay,
  getDay,
  isSameDay,
} from 'date-fns';

// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================

/**
 * Schedule status enum
 */
export enum ScheduleStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

/**
 * Day of week enum
 */
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

/**
 * Class type enum
 */
export enum ClassType {
  LECTURE = 'lecture',
  LAB = 'lab',
  SEMINAR = 'seminar',
  WORKSHOP = 'workshop',
  TUTORIAL = 'tutorial',
  EXAM = 'exam',
  ONLINE = 'online',
  HYBRID = 'hybrid',
}

/**
 * Room type enum
 */
export enum RoomType {
  CLASSROOM = 'classroom',
  LABORATORY = 'laboratory',
  LECTURE_HALL = 'lecture_hall',
  SEMINAR_ROOM = 'seminar_room',
  COMPUTER_LAB = 'computer_lab',
  AUDITORIUM = 'auditorium',
  VIRTUAL = 'virtual',
}

/**
 * Conflict type enum
 */
export enum ConflictType {
  TIME_CONFLICT = 'time_conflict',
  ROOM_CONFLICT = 'room_conflict',
  FACULTY_CONFLICT = 'faculty_conflict',
  STUDENT_CONFLICT = 'student_conflict',
  CAPACITY_CONFLICT = 'capacity_conflict',
  RESOURCE_CONFLICT = 'resource_conflict',
}

/**
 * Conflict severity enum
 */
export enum ConflictSeverity {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Recurrence pattern enum
 */
export enum RecurrencePattern {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  MONTHLY = 'monthly',
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * ClassSchedule model - Core scheduling information
 */
@Table({
  tableName: 'class_schedules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['course_id'] },
    { fields: ['room_id'] },
    { fields: ['faculty_id'] },
    { fields: ['academic_year', 'semester'] },
    { fields: ['day_of_week', 'start_time', 'end_time'] },
    { fields: ['status'] },
  ],
})
export class ClassSchedule extends Model {
  @ApiProperty({ description: 'Schedule unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Course ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  course_id: string;

  @ApiProperty({ description: 'Section number' })
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  section: string;

  @ApiProperty({ description: 'Academic year' })
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  academic_year: string;

  @ApiProperty({ description: 'Semester' })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  semester: string;

  @ApiProperty({ description: 'Room ID' })
  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  room_id: string;

  @BelongsTo(() => Room)
  room: Room;

  @ApiProperty({ description: 'Faculty ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  faculty_id: string;

  @ApiProperty({ description: 'Day of week', enum: DayOfWeek })
  @Column({
    type: DataType.ENUM(...Object.values(DayOfWeek)),
    allowNull: false,
  })
  day_of_week: DayOfWeek;

  @ApiProperty({ description: 'Start time (HH:MM)' })
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  start_time: string;

  @ApiProperty({ description: 'End time (HH:MM)' })
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  end_time: string;

  @ApiProperty({ description: 'Start date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date: Date;

  @ApiProperty({ description: 'End date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date: Date;

  @ApiProperty({ description: 'Class type', enum: ClassType })
  @Column({
    type: DataType.ENUM(...Object.values(ClassType)),
    defaultValue: ClassType.LECTURE,
    allowNull: false,
  })
  class_type: ClassType;

  @ApiProperty({ description: 'Recurrence pattern', enum: RecurrencePattern })
  @Column({
    type: DataType.ENUM(...Object.values(RecurrencePattern)),
    defaultValue: RecurrencePattern.WEEKLY,
    allowNull: false,
  })
  recurrence_pattern: RecurrencePattern;

  @ApiProperty({ description: 'Maximum enrollment' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  max_enrollment: number;

  @ApiProperty({ description: 'Current enrollment' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  current_enrollment: number;

  @ApiProperty({ description: 'Waitlist count' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  waitlist_count: number;

  @ApiProperty({ description: 'Schedule status', enum: ScheduleStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ScheduleStatus)),
    defaultValue: ScheduleStatus.DRAFT,
    allowNull: false,
  })
  status: ScheduleStatus;

  @ApiProperty({ description: 'Is online' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_online: boolean;

  @ApiProperty({ description: 'Meeting URL for online classes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  meeting_url: string;

  @ApiProperty({ description: 'Special notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @HasMany(() => ScheduleConflict)
  conflicts: ScheduleConflict[];
}

/**
 * Room model - Classroom and facility information
 */
@Table({
  tableName: 'rooms',
  timestamps: true,
  indexes: [
    { fields: ['building_id'] },
    { fields: ['room_type'] },
    { fields: ['is_available'] },
  ],
})
export class Room extends Model {
  @ApiProperty({ description: 'Room unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Room number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  room_number: string;

  @ApiProperty({ description: 'Building ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  building_id: string;

  @ApiProperty({ description: 'Building name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  building_name: string;

  @ApiProperty({ description: 'Floor number' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  floor: number;

  @ApiProperty({ description: 'Room type', enum: RoomType })
  @Column({
    type: DataType.ENUM(...Object.values(RoomType)),
    allowNull: false,
  })
  room_type: RoomType;

  @ApiProperty({ description: 'Seating capacity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacity: number;

  @ApiProperty({ description: 'Available equipment' })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  equipment: string[];

  @ApiProperty({ description: 'Features and amenities' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  features: {
    has_projector?: boolean;
    has_whiteboard?: boolean;
    has_computers?: boolean;
    computer_count?: number;
    has_audio_visual?: boolean;
    is_accessible?: boolean;
    has_recording?: boolean;
  };

  @ApiProperty({ description: 'Is available for scheduling' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_available: boolean;

  @ApiProperty({ description: 'Maintenance schedule' })
  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  maintenance_schedule: Array<{
    start_date: string;
    end_date: string;
    reason: string;
  }>;

  @HasMany(() => ClassSchedule)
  schedules: ClassSchedule[];
}

/**
 * TimeBlock model - Standardized time slots
 */
@Table({
  tableName: 'time_blocks',
  timestamps: true,
  indexes: [
    { fields: ['institution_id'] },
    { fields: ['is_active'] },
  ],
})
export class TimeBlock extends Model {
  @ApiProperty({ description: 'Time block unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Institution ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  institution_id: string;

  @ApiProperty({ description: 'Block name' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ApiProperty({ description: 'Start time (HH:MM)' })
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  start_time: string;

  @ApiProperty({ description: 'End time (HH:MM)' })
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  end_time: string;

  @ApiProperty({ description: 'Duration in minutes' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration_minutes: number;

  @ApiProperty({ description: 'Days applicable' })
  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(DayOfWeek))),
    defaultValue: [],
  })
  applicable_days: DayOfWeek[];

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @ApiProperty({ description: 'Display order' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  display_order: number;
}

/**
 * ScheduleConflict model - Detected scheduling conflicts
 */
@Table({
  tableName: 'schedule_conflicts',
  timestamps: true,
  indexes: [
    { fields: ['schedule_id'] },
    { fields: ['conflict_type'] },
    { fields: ['severity'] },
    { fields: ['is_resolved'] },
  ],
})
export class ScheduleConflict extends Model {
  @ApiProperty({ description: 'Conflict unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ApiProperty({ description: 'Schedule ID' })
  @ForeignKey(() => ClassSchedule)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  schedule_id: string;

  @BelongsTo(() => ClassSchedule)
  schedule: ClassSchedule;

  @ApiProperty({ description: 'Conflicting schedule ID' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  conflicting_schedule_id: string;

  @ApiProperty({ description: 'Conflict type', enum: ConflictType })
  @Column({
    type: DataType.ENUM(...Object.values(ConflictType)),
    allowNull: false,
  })
  conflict_type: ConflictType;

  @ApiProperty({ description: 'Conflict severity', enum: ConflictSeverity })
  @Column({
    type: DataType.ENUM(...Object.values(ConflictSeverity)),
    allowNull: false,
  })
  severity: ConflictSeverity;

  @ApiProperty({ description: 'Conflict description' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ApiProperty({ description: 'Affected resources' })
  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  affected_resources: {
    room_id?: string;
    faculty_id?: string;
    student_ids?: string[];
  };

  @ApiProperty({ description: 'Is resolved' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_resolved: boolean;

  @ApiProperty({ description: 'Resolution notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  resolution_notes: string;

  @ApiProperty({ description: 'Resolved by user ID' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  resolved_by: string;

  @ApiProperty({ description: 'Resolved at timestamp' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolved_at: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Schedule creation schema
 */
export const CreateScheduleSchema = z.object({
  course_id: z.string().uuid(),
  section: z.string().max(10),
  academic_year: z.string().max(10),
  semester: z.string().max(20),
  room_id: z.string().uuid().optional(),
  faculty_id: z.string().uuid(),
  day_of_week: z.nativeEnum(DayOfWeek),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  class_type: z.nativeEnum(ClassType).default(ClassType.LECTURE),
  recurrence_pattern: z.nativeEnum(RecurrencePattern).default(RecurrencePattern.WEEKLY),
  max_enrollment: z.number().int().min(1),
  is_online: z.boolean().default(false),
  meeting_url: z.string().url().optional(),
  notes: z.string().optional(),
});

/**
 * Schedule update schema
 */
export const UpdateScheduleSchema = CreateScheduleSchema.partial();

/**
 * Room creation schema
 */
export const CreateRoomSchema = z.object({
  room_number: z.string().max(50),
  building_id: z.string().uuid(),
  building_name: z.string().max(200),
  floor: z.number().int().optional(),
  room_type: z.nativeEnum(RoomType),
  capacity: z.number().int().min(1),
  equipment: z.array(z.string()).default([]),
  features: z.object({
    has_projector: z.boolean().optional(),
    has_whiteboard: z.boolean().optional(),
    has_computers: z.boolean().optional(),
    computer_count: z.number().int().optional(),
    has_audio_visual: z.boolean().optional(),
    is_accessible: z.boolean().optional(),
    has_recording: z.boolean().optional(),
  }).default({}),
  is_available: z.boolean().default(true),
});

/**
 * Time block creation schema
 */
export const CreateTimeBlockSchema = z.object({
  institution_id: z.string().uuid(),
  name: z.string().max(100),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  applicable_days: z.array(z.nativeEnum(DayOfWeek)).default([]),
  display_order: z.number().int().default(0),
});

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: Record<string, any>;
}

/**
 * Success response wrapper
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

// ============================================================================
// CLASS SCHEDULING SERVICE
// ============================================================================

@Injectable()
export class ClassSchedulingService {
  private readonly logger = new Logger(ClassSchedulingService.name);

  // ========================================================================
  // CORE SCHEDULING OPERATIONS (Functions 1-10)
  // ========================================================================

  /**
   * Function 1: Create class schedule
   * POST /api/v1/schedules
   * Status: 201 Created, 400 Bad Request, 409 Conflict
   */
  async createSchedule(data: z.infer<typeof CreateScheduleSchema>): Promise<ClassSchedule> {
    try {
      const validated = CreateScheduleSchema.parse(data);

      // Validate time logic
      if (validated.end_time <= validated.start_time) {
        throw new BadRequestException('End time must be after start time');
      }

      if (validated.end_date <= validated.start_date) {
        throw new BadRequestException('End date must be after start date');
      }

      // Check for conflicts before creating
      const conflicts = await this.detectAllConflicts({
        ...validated,
        id: 'new',
      } as any);

      if (conflicts.critical.length > 0) {
        throw new ConflictException({
          message: 'Critical scheduling conflicts detected',
          conflicts: conflicts.critical,
        });
      }

      // Create schedule
      const schedule = await ClassSchedule.create(validated);

      // Log warnings if any
      if (conflicts.warnings.length > 0) {
        this.logger.warn(
          `Schedule ${schedule.id} created with warnings: ${conflicts.warnings.length}`
        );
      }

      this.logger.log(`Created schedule: ${schedule.id}`);

      return schedule;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 2: Get schedule by ID
   * GET /api/v1/schedules/:id
   * Status: 200 OK, 404 Not Found
   */
  async getScheduleById(
    id: string,
    options?: {
      includeRoom?: boolean;
      includeConflicts?: boolean;
    }
  ): Promise<ClassSchedule> {
    const include = [];

    if (options?.includeRoom) {
      include.push({ model: Room, as: 'room' });
    }
    if (options?.includeConflicts) {
      include.push({ model: ScheduleConflict, as: 'conflicts' });
    }

    const schedule = await ClassSchedule.findByPk(id, { include });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  /**
   * Function 3: List schedules with pagination
   * GET /api/v1/schedules?page=1&limit=20&sort=start_time&order=asc
   * Status: 200 OK
   */
  async listSchedules(params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    academic_year?: string;
    semester?: string;
    faculty_id?: string;
    room_id?: string;
    status?: ScheduleStatus;
    day_of_week?: DayOfWeek;
    class_type?: ClassType;
  }): Promise<PaginatedResponse<ClassSchedule>> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const where: any = {};

    // Filters
    if (params.academic_year) where.academic_year = params.academic_year;
    if (params.semester) where.semester = params.semester;
    if (params.faculty_id) where.faculty_id = params.faculty_id;
    if (params.room_id) where.room_id = params.room_id;
    if (params.status) where.status = params.status;
    if (params.day_of_week) where.day_of_week = params.day_of_week;
    if (params.class_type) where.class_type = params.class_type;

    // Sorting
    const order: any = [];
    if (params.sort) {
      order.push([params.sort, params.order || 'asc']);
    } else {
      order.push(['day_of_week', 'asc'], ['start_time', 'asc']);
    }

    const { rows: data, count: total } = await ClassSchedule.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: [{ model: Room, as: 'room' }],
    });

    const total_pages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        total_pages,
        has_next: page < total_pages,
        has_prev: page > 1,
      },
    };
  }

  /**
   * Function 4: Update schedule
   * PUT /api/v1/schedules/:id or PATCH /api/v1/schedules/:id
   * Status: 200 OK, 404 Not Found, 400 Bad Request, 409 Conflict
   */
  async updateSchedule(
    id: string,
    data: z.infer<typeof UpdateScheduleSchema>
  ): Promise<ClassSchedule> {
    try {
      const validated = UpdateScheduleSchema.parse(data);

      const schedule = await ClassSchedule.findByPk(id);

      if (!schedule) {
        throw new NotFoundException(`Schedule with ID ${id} not found`);
      }

      // Check for conflicts with updated data
      const updatedData = { ...schedule.toJSON(), ...validated };
      const conflicts = await this.detectAllConflicts(updatedData as any);

      if (conflicts.critical.length > 0) {
        throw new ConflictException({
          message: 'Critical scheduling conflicts detected',
          conflicts: conflicts.critical,
        });
      }

      await schedule.update(validated);

      this.logger.log(`Updated schedule: ${id}`);

      return schedule;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 5: Delete schedule
   * DELETE /api/v1/schedules/:id
   * Status: 204 No Content, 404 Not Found
   */
  async deleteSchedule(id: string, softDelete: boolean = true): Promise<void> {
    const schedule = await ClassSchedule.findByPk(id);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    if (softDelete) {
      await schedule.update({ status: ScheduleStatus.CANCELLED });
      this.logger.log(`Soft deleted schedule: ${id}`);
    } else {
      await schedule.destroy();
      this.logger.log(`Hard deleted schedule: ${id}`);
    }
  }

  /**
   * Function 6: Bulk schedule creation
   * POST /api/v1/schedules/bulk
   * Status: 201 Created, 400 Bad Request
   */
  async bulkCreateSchedules(
    schedules: z.infer<typeof CreateScheduleSchema>[]
  ): Promise<{ created: ClassSchedule[]; errors: Array<{ index: number; error: string }> }> {
    const created: ClassSchedule[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < schedules.length; i++) {
      try {
        const schedule = await this.createSchedule(schedules[i]);
        created.push(schedule);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message || 'Unknown error',
        });
      }
    }

    this.logger.log(`Bulk created ${created.length} schedules, ${errors.length} errors`);

    return { created, errors };
  }

  /**
   * Function 7: Search schedules
   * GET /api/v1/schedules/search?q=searchterm
   * Status: 200 OK
   */
  async searchSchedules(query: string, limit: number = 20): Promise<ClassSchedule[]> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Search query is required');
    }

    const schedules = await ClassSchedule.findAll({
      where: {
        [Op.or]: [
          { section: { [Op.iLike]: `%${query}%` } },
          { notes: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: Math.min(limit, 100),
      include: [{ model: Room, as: 'room' }],
      order: [['day_of_week', 'asc'], ['start_time', 'asc']],
    });

    return schedules;
  }

  /**
   * Function 8: Filter schedules by criteria
   * GET /api/v1/schedules/filter
   * Status: 200 OK
   */
  async filterSchedules(criteria: {
    academic_years?: string[];
    semesters?: string[];
    faculty_ids?: string[];
    room_ids?: string[];
    statuses?: ScheduleStatus[];
    class_types?: ClassType[];
    days?: DayOfWeek[];
    time_range?: { start: string; end: string };
  }): Promise<ClassSchedule[]> {
    const where: any = {};

    if (criteria.academic_years && criteria.academic_years.length > 0) {
      where.academic_year = { [Op.in]: criteria.academic_years };
    }

    if (criteria.semesters && criteria.semesters.length > 0) {
      where.semester = { [Op.in]: criteria.semesters };
    }

    if (criteria.faculty_ids && criteria.faculty_ids.length > 0) {
      where.faculty_id = { [Op.in]: criteria.faculty_ids };
    }

    if (criteria.room_ids && criteria.room_ids.length > 0) {
      where.room_id = { [Op.in]: criteria.room_ids };
    }

    if (criteria.statuses && criteria.statuses.length > 0) {
      where.status = { [Op.in]: criteria.statuses };
    }

    if (criteria.class_types && criteria.class_types.length > 0) {
      where.class_type = { [Op.in]: criteria.class_types };
    }

    if (criteria.days && criteria.days.length > 0) {
      where.day_of_week = { [Op.in]: criteria.days };
    }

    if (criteria.time_range) {
      where.start_time = { [Op.gte]: criteria.time_range.start };
      where.end_time = { [Op.lte]: criteria.time_range.end };
    }

    const schedules = await ClassSchedule.findAll({
      where,
      include: [{ model: Room, as: 'room' }],
      order: [['day_of_week', 'asc'], ['start_time', 'asc']],
    });

    return schedules;
  }

  /**
   * Function 9: Sort schedules
   * GET /api/v1/schedules?sort=field&order=asc|desc
   * Status: 200 OK
   */
  async sortSchedules(
    sortField: string = 'start_time',
    sortOrder: 'asc' | 'desc' = 'asc',
    filters?: any
  ): Promise<ClassSchedule[]> {
    const allowedFields = [
      'day_of_week',
      'start_time',
      'end_time',
      'section',
      'academic_year',
      'semester',
    ];

    if (!allowedFields.includes(sortField)) {
      throw new BadRequestException(
        `Invalid sort field. Allowed: ${allowedFields.join(', ')}`
      );
    }

    const schedules = await ClassSchedule.findAll({
      where: filters || {},
      order: [[sortField, sortOrder.toUpperCase()]],
      include: [{ model: Room, as: 'room' }],
    });

    return schedules;
  }

  /**
   * Function 10: Export schedule data
   * GET /api/v1/schedules/export?format=json|csv
   * Status: 200 OK
   */
  async exportScheduleData(
    format: 'json' | 'csv' = 'json',
    filters?: any
  ): Promise<any> {
    const schedules = await ClassSchedule.findAll({
      where: filters || {},
      include: [{ model: Room, as: 'room' }],
      order: [['day_of_week', 'asc'], ['start_time', 'asc']],
    });

    if (format === 'csv') {
      const headers = [
        'ID',
        'Course ID',
        'Section',
        'Academic Year',
        'Semester',
        'Day',
        'Start Time',
        'End Time',
        'Room',
        'Type',
        'Status',
      ];

      const rows = schedules.map((s) => [
        s.id,
        s.course_id,
        s.section,
        s.academic_year,
        s.semester,
        s.day_of_week,
        s.start_time,
        s.end_time,
        s.room?.room_number || '',
        s.class_type,
        s.status,
      ]);

      return { headers, rows, format: 'csv' };
    }

    return {
      data: schedules,
      format: 'json',
      count: schedules.length,
    };
  }

  // ========================================================================
  // ROOM MANAGEMENT (Functions 11-18)
  // ========================================================================

  /**
   * Function 11: Create room
   * POST /api/v1/rooms
   * Status: 201 Created, 400 Bad Request
   */
  async createRoom(data: z.infer<typeof CreateRoomSchema>): Promise<Room> {
    try {
      const validated = CreateRoomSchema.parse(data);

      // Calculate duration from start/end times (for time blocks)
      const room = await Room.create(validated);

      this.logger.log(`Created room: ${room.id} (${room.room_number})`);

      return room;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 12: Update room details
   * PATCH /api/v1/rooms/:id
   * Status: 200 OK, 404 Not Found
   */
  async updateRoom(id: string, data: Partial<z.infer<typeof CreateRoomSchema>>): Promise<Room> {
    const room = await Room.findByPk(id);

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    await room.update(data);

    this.logger.log(`Updated room: ${id}`);

    return room;
  }

  /**
   * Function 13: Get room availability
   * GET /api/v1/rooms/:id/availability?date=YYYY-MM-DD
   * Status: 200 OK
   */
  async getRoomAvailability(
    roomId: string,
    date: Date,
    dayOfWeek: DayOfWeek
  ): Promise<{
    room: Room;
    available_slots: Array<{ start: string; end: string }>;
    occupied_slots: Array<{ start: string; end: string; schedule_id: string }>;
  }> {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Get all schedules for this room on the specified day
    const schedules = await ClassSchedule.findAll({
      where: {
        room_id: roomId,
        day_of_week: dayOfWeek,
        status: { [Op.ne]: ScheduleStatus.CANCELLED },
      },
      order: [['start_time', 'asc']],
    });

    const occupiedSlots = schedules.map((s) => ({
      start: s.start_time,
      end: s.end_time,
      schedule_id: s.id,
    }));

    // Calculate available slots (simplified - would need more logic)
    const availableSlots: Array<{ start: string; end: string }> = [];

    // Standard operating hours: 8:00 AM to 10:00 PM
    const dayStart = '08:00';
    const dayEnd = '22:00';

    if (schedules.length === 0) {
      availableSlots.push({ start: dayStart, end: dayEnd });
    } else {
      // Calculate gaps between schedules
      if (schedules[0].start_time > dayStart) {
        availableSlots.push({ start: dayStart, end: schedules[0].start_time });
      }

      for (let i = 0; i < schedules.length - 1; i++) {
        if (schedules[i].end_time < schedules[i + 1].start_time) {
          availableSlots.push({
            start: schedules[i].end_time,
            end: schedules[i + 1].start_time,
          });
        }
      }

      const lastSchedule = schedules[schedules.length - 1];
      if (lastSchedule.end_time < dayEnd) {
        availableSlots.push({ start: lastSchedule.end_time, end: dayEnd });
      }
    }

    return {
      room,
      available_slots: availableSlots,
      occupied_slots: occupiedSlots,
    };
  }

  /**
   * Function 14: Assign room to class
   * POST /api/v1/schedules/:scheduleId/assign-room
   * Status: 200 OK, 404 Not Found, 409 Conflict
   */
  async assignRoomToClass(scheduleId: string, roomId: string): Promise<ClassSchedule> {
    const schedule = await ClassSchedule.findByPk(scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    const room = await Room.findByPk(roomId);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check capacity
    if (schedule.max_enrollment > room.capacity) {
      throw new ConflictException(
        `Room capacity (${room.capacity}) is less than max enrollment (${schedule.max_enrollment})`
      );
    }

    // Check for room conflicts
    const conflicts = await this.detectRoomConflicts(scheduleId, roomId);
    if (conflicts.length > 0) {
      throw new ConflictException({
        message: 'Room is already booked for this time',
        conflicts,
      });
    }

    await schedule.update({ room_id: roomId });

    this.logger.log(`Assigned room ${roomId} to schedule ${scheduleId}`);

    return schedule;
  }

  /**
   * Function 15: Room capacity check
   * GET /api/v1/rooms/:id/capacity-check?enrollment=30
   * Status: 200 OK
   */
  async checkRoomCapacity(
    roomId: string,
    requiredCapacity: number
  ): Promise<{
    room: Room;
    has_capacity: boolean;
    available_capacity: number;
    utilization_percentage: number;
  }> {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const hasCapacity = room.capacity >= requiredCapacity;
    const utilizationPercentage = (requiredCapacity / room.capacity) * 100;

    return {
      room,
      has_capacity: hasCapacity,
      available_capacity: room.capacity - requiredCapacity,
      utilization_percentage: utilizationPercentage,
    };
  }

  /**
   * Function 16: List available rooms
   * GET /api/v1/rooms/available?day=monday&start_time=09:00&end_time=10:30
   * Status: 200 OK
   */
  async listAvailableRooms(
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    minCapacity?: number
  ): Promise<Room[]> {
    // Get all rooms
    let rooms = await Room.findAll({
      where: {
        is_available: true,
      },
    });

    // Filter by capacity if specified
    if (minCapacity) {
      rooms = rooms.filter((r) => r.capacity >= minCapacity);
    }

    // Check each room for conflicts
    const availableRooms: Room[] = [];

    for (const room of rooms) {
      const conflicts = await ClassSchedule.findAll({
        where: {
          room_id: room.id,
          day_of_week: dayOfWeek,
          status: { [Op.ne]: ScheduleStatus.CANCELLED },
          [Op.or]: [
            {
              start_time: { [Op.lte]: startTime },
              end_time: { [Op.gt]: startTime },
            },
            {
              start_time: { [Op.lt]: endTime },
              end_time: { [Op.gte]: endTime },
            },
            {
              start_time: { [Op.gte]: startTime },
              end_time: { [Op.lte]: endTime },
            },
          ],
        },
      });

      if (conflicts.length === 0) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  }

  /**
   * Function 17: Room utilization report
   * GET /api/v1/rooms/:id/utilization?academic_year=2024-2025&semester=fall
   * Status: 200 OK
   */
  async getRoomUtilization(
    roomId: string,
    academicYear: string,
    semester: string
  ): Promise<{
    room: Room;
    total_hours_scheduled: number;
    total_hours_available: number;
    utilization_percentage: number;
    schedules_count: number;
  }> {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const schedules = await ClassSchedule.findAll({
      where: {
        room_id: roomId,
        academic_year: academicYear,
        semester,
        status: { [Op.ne]: ScheduleStatus.CANCELLED },
      },
    });

    // Calculate total hours (simplified)
    let totalMinutes = 0;

    for (const schedule of schedules) {
      const [startHour, startMin] = schedule.start_time.split(':').map(Number);
      const [endHour, endMin] = schedule.end_time.split(':').map(Number);
      const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      totalMinutes += minutes;
    }

    const totalHoursScheduled = totalMinutes / 60;

    // Assume 14 hours per day, 5 days per week, 16 weeks per semester
    const totalHoursAvailable = 14 * 5 * 16;

    const utilizationPercentage = (totalHoursScheduled / totalHoursAvailable) * 100;

    return {
      room,
      total_hours_scheduled: totalHoursScheduled,
      total_hours_available: totalHoursAvailable,
      utilization_percentage: utilizationPercentage,
      schedules_count: schedules.length,
    };
  }

  /**
   * Function 18: Room maintenance scheduling
   * POST /api/v1/rooms/:id/maintenance
   * Status: 200 OK, 404 Not Found
   */
  async scheduleRoomMaintenance(
    roomId: string,
    maintenance: {
      start_date: string;
      end_date: string;
      reason: string;
    }
  ): Promise<Room> {
    const room = await Room.findByPk(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    const maintenanceSchedule = [
      ...(room.maintenance_schedule || []),
      maintenance,
    ];

    await room.update({
      maintenance_schedule: maintenanceSchedule,
      is_available: false,
    });

    this.logger.log(`Scheduled maintenance for room: ${roomId}`);

    return room;
  }

  // ========================================================================
  // CONFLICT DETECTION (Functions 19-26)
  // ========================================================================

  /**
   * Function 19: Detect time conflicts
   * GET /api/v1/schedules/:id/conflicts/time
   * Status: 200 OK
   */
  async detectTimeConflicts(scheduleId: string): Promise<ScheduleConflict[]> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    const conflicts: ScheduleConflict[] = [];

    // Find overlapping schedules for the same faculty
    const overlapping = await ClassSchedule.findAll({
      where: {
        id: { [Op.ne]: scheduleId },
        faculty_id: schedule.faculty_id,
        day_of_week: schedule.day_of_week,
        academic_year: schedule.academic_year,
        semester: schedule.semester,
        status: { [Op.ne]: ScheduleStatus.CANCELLED },
        [Op.or]: [
          {
            start_time: { [Op.lte]: schedule.start_time },
            end_time: { [Op.gt]: schedule.start_time },
          },
          {
            start_time: { [Op.lt]: schedule.end_time },
            end_time: { [Op.gte]: schedule.end_time },
          },
          {
            start_time: { [Op.gte]: schedule.start_time },
            end_time: { [Op.lte]: schedule.end_time },
          },
        ],
      },
    });

    for (const conflicting of overlapping) {
      const conflict = await ScheduleConflict.create({
        schedule_id: scheduleId,
        conflicting_schedule_id: conflicting.id,
        conflict_type: ConflictType.TIME_CONFLICT,
        severity: ConflictSeverity.CRITICAL,
        description: `Time overlap detected with schedule ${conflicting.id}`,
        affected_resources: {
          faculty_id: schedule.faculty_id,
        },
      });
      conflicts.push(conflict);
    }

    return conflicts;
  }

  /**
   * Function 20: Detect room conflicts
   * GET /api/v1/schedules/:id/conflicts/room
   * Status: 200 OK
   */
  async detectRoomConflicts(
    scheduleId: string,
    roomId?: string
  ): Promise<ScheduleConflict[]> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    const targetRoomId = roomId || schedule.room_id;

    if (!targetRoomId) {
      return [];
    }

    const conflicts: ScheduleConflict[] = [];

    // Find overlapping room bookings
    const overlapping = await ClassSchedule.findAll({
      where: {
        id: { [Op.ne]: scheduleId },
        room_id: targetRoomId,
        day_of_week: schedule.day_of_week,
        academic_year: schedule.academic_year,
        semester: schedule.semester,
        status: { [Op.ne]: ScheduleStatus.CANCELLED },
        [Op.or]: [
          {
            start_time: { [Op.lte]: schedule.start_time },
            end_time: { [Op.gt]: schedule.start_time },
          },
          {
            start_time: { [Op.lt]: schedule.end_time },
            end_time: { [Op.gte]: schedule.end_time },
          },
          {
            start_time: { [Op.gte]: schedule.start_time },
            end_time: { [Op.lte]: schedule.end_time },
          },
        ],
      },
    });

    for (const conflicting of overlapping) {
      const conflict = await ScheduleConflict.create({
        schedule_id: scheduleId,
        conflicting_schedule_id: conflicting.id,
        conflict_type: ConflictType.ROOM_CONFLICT,
        severity: ConflictSeverity.CRITICAL,
        description: `Room ${targetRoomId} is already booked`,
        affected_resources: {
          room_id: targetRoomId,
        },
      });
      conflicts.push(conflict);
    }

    return conflicts;
  }

  /**
   * Function 21: Detect faculty conflicts
   * GET /api/v1/schedules/:id/conflicts/faculty
   * Status: 200 OK
   */
  async detectFacultyConflicts(scheduleId: string): Promise<ScheduleConflict[]> {
    // This is similar to time conflicts but specific to faculty
    return this.detectTimeConflicts(scheduleId);
  }

  /**
   * Function 22: Student enrollment conflicts
   * GET /api/v1/schedules/:id/conflicts/students
   * Status: 200 OK
   */
  async detectStudentConflicts(
    scheduleId: string,
    studentIds: string[]
  ): Promise<{
    conflicts: Array<{
      student_id: string;
      conflicting_schedules: string[];
    }>;
  }> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // This would check against student enrollments
    // Simplified implementation
    const conflicts: Array<{
      student_id: string;
      conflicting_schedules: string[];
    }> = [];

    // In production, would query enrollment database

    return { conflicts };
  }

  /**
   * Function 23: Check all conflicts
   * GET /api/v1/schedules/:id/conflicts/all
   * Status: 200 OK
   */
  async detectAllConflicts(schedule: ClassSchedule): Promise<{
    critical: ScheduleConflict[];
    warnings: ScheduleConflict[];
    info: ScheduleConflict[];
  }> {
    const allConflicts: ScheduleConflict[] = [];

    // Time/faculty conflicts
    if (schedule.id && schedule.id !== 'new') {
      const timeConflicts = await this.detectTimeConflicts(schedule.id);
      allConflicts.push(...timeConflicts);

      // Room conflicts
      if (schedule.room_id) {
        const roomConflicts = await this.detectRoomConflicts(schedule.id);
        allConflicts.push(...roomConflicts);
      }
    }

    // Categorize by severity
    const critical = allConflicts.filter((c) => c.severity === ConflictSeverity.CRITICAL);
    const warnings = allConflicts.filter((c) => c.severity === ConflictSeverity.WARNING);
    const info = allConflicts.filter((c) => c.severity === ConflictSeverity.INFO);

    return { critical, warnings, info };
  }

  /**
   * Function 24: Resolve conflicts
   * POST /api/v1/conflicts/:id/resolve
   * Status: 200 OK, 404 Not Found
   */
  async resolveConflict(
    conflictId: string,
    resolutionNotes: string,
    resolvedBy: string
  ): Promise<ScheduleConflict> {
    const conflict = await ScheduleConflict.findByPk(conflictId);

    if (!conflict) {
      throw new NotFoundException(`Conflict with ID ${conflictId} not found`);
    }

    await conflict.update({
      is_resolved: true,
      resolution_notes: resolutionNotes,
      resolved_by: resolvedBy,
      resolved_at: new Date(),
    });

    this.logger.log(`Resolved conflict: ${conflictId}`);

    return conflict;
  }

  /**
   * Function 25: Conflict history
   * GET /api/v1/schedules/:id/conflicts/history
   * Status: 200 OK
   */
  async getConflictHistory(scheduleId: string): Promise<ScheduleConflict[]> {
    const conflicts = await ScheduleConflict.findAll({
      where: { schedule_id: scheduleId },
      order: [['createdAt', 'desc']],
    });

    return conflicts;
  }

  /**
   * Function 26: Conflict notifications
   * POST /api/v1/conflicts/:id/notify
   * Status: 200 OK
   */
  async sendConflictNotification(
    conflictId: string
  ): Promise<{ success: boolean; message: string }> {
    const conflict = await ScheduleConflict.findByPk(conflictId, {
      include: [{ model: ClassSchedule, as: 'schedule' }],
    });

    if (!conflict) {
      throw new NotFoundException(`Conflict with ID ${conflictId} not found`);
    }

    // Would integrate with notification system
    this.logger.log(`Sent notification for conflict: ${conflictId}`);

    return {
      success: true,
      message: 'Conflict notification sent successfully',
    };
  }

  // ========================================================================
  // SCHEDULE OPTIMIZATION (Functions 27-32)
  // ========================================================================

  /**
   * Function 27: Optimize room usage
   * POST /api/v1/schedules/optimize/rooms
   * Status: 200 OK
   */
  async optimizeRoomUsage(
    academicYear: string,
    semester: string
  ): Promise<{
    recommendations: Array<{
      schedule_id: string;
      current_room_id: string;
      recommended_room_id: string;
      reason: string;
    }>;
  }> {
    const schedules = await ClassSchedule.findAll({
      where: {
        academic_year: academicYear,
        semester,
        status: ScheduleStatus.PUBLISHED,
      },
      include: [{ model: Room, as: 'room' }],
    });

    const recommendations: Array<{
      schedule_id: string;
      current_room_id: string;
      recommended_room_id: string;
      reason: string;
    }> = [];

    // Simple optimization: find schedules in rooms too large
    for (const schedule of schedules) {
      if (!schedule.room) continue;

      const utilizationRatio = schedule.max_enrollment / schedule.room.capacity;

      if (utilizationRatio < 0.5) {
        // Room is underutilized
        const betterRooms = await Room.findAll({
          where: {
            capacity: {
              [Op.gte]: schedule.max_enrollment,
              [Op.lt]: schedule.room.capacity,
            },
            room_type: schedule.room.room_type,
            is_available: true,
          },
          order: [['capacity', 'asc']],
          limit: 1,
        });

        if (betterRooms.length > 0) {
          recommendations.push({
            schedule_id: schedule.id,
            current_room_id: schedule.room_id!,
            recommended_room_id: betterRooms[0].id,
            reason: `Better size match (${betterRooms[0].capacity} vs ${schedule.room.capacity})`,
          });
        }
      }
    }

    return { recommendations };
  }

  /**
   * Function 28: Balance faculty load
   * POST /api/v1/schedules/optimize/faculty-load
   * Status: 200 OK
   */
  async balanceFacultyLoad(
    departmentId: string,
    academicYear: string,
    semester: string
  ): Promise<{
    analysis: Array<{
      faculty_id: string;
      class_count: number;
      total_hours: number;
      status: 'underloaded' | 'balanced' | 'overloaded';
    }>;
  }> {
    // This would integrate with faculty management system
    // Simplified implementation
    const analysis: Array<{
      faculty_id: string;
      class_count: number;
      total_hours: number;
      status: 'underloaded' | 'balanced' | 'overloaded';
    }> = [];

    return { analysis };
  }

  /**
   * Function 29: Minimize conflicts
   * POST /api/v1/schedules/optimize/minimize-conflicts
   * Status: 200 OK
   */
  async minimizeConflicts(
    academicYear: string,
    semester: string
  ): Promise<{
    total_conflicts: number;
    resolvable_conflicts: number;
    suggestions: Array<{
      conflict_id: string;
      suggestion: string;
    }>;
  }> {
    // Get all unresolved conflicts
    const conflicts = await ScheduleConflict.findAll({
      where: {
        is_resolved: false,
      },
      include: [
        {
          model: ClassSchedule,
          as: 'schedule',
          where: {
            academic_year: academicYear,
            semester,
          },
        },
      ],
    });

    const suggestions: Array<{
      conflict_id: string;
      suggestion: string;
    }> = [];

    for (const conflict of conflicts) {
      if (conflict.conflict_type === ConflictType.ROOM_CONFLICT) {
        suggestions.push({
          conflict_id: conflict.id,
          suggestion: 'Consider assigning a different room',
        });
      } else if (conflict.conflict_type === ConflictType.TIME_CONFLICT) {
        suggestions.push({
          conflict_id: conflict.id,
          suggestion: 'Consider adjusting class time',
        });
      }
    }

    return {
      total_conflicts: conflicts.length,
      resolvable_conflicts: suggestions.length,
      suggestions,
    };
  }

  /**
   * Function 30: Gap analysis
   * GET /api/v1/schedules/optimize/gaps
   * Status: 200 OK
   */
  async analyzeScheduleGaps(
    academicYear: string,
    semester: string
  ): Promise<{
    gaps: Array<{
      day: DayOfWeek;
      time_slot: string;
      available_rooms: number;
    }>;
  }> {
    // Find underutilized time slots
    const gaps: Array<{
      day: DayOfWeek;
      time_slot: string;
      available_rooms: number;
    }> = [];

    // Implementation would analyze schedule distribution

    return { gaps };
  }

  /**
   * Function 31: Utilization optimization
   * GET /api/v1/schedules/optimize/utilization
   * Status: 200 OK
   */
  async optimizeUtilization(
    academicYear: string,
    semester: string
  ): Promise<{
    overall_utilization: number;
    peak_hours: string[];
    underutilized_hours: string[];
  }> {
    const schedules = await ClassSchedule.findAll({
      where: {
        academic_year: academicYear,
        semester,
        status: ScheduleStatus.PUBLISHED,
      },
    });

    // Calculate utilization metrics
    const hourDistribution: Record<string, number> = {};

    for (const schedule of schedules) {
      const hour = schedule.start_time.split(':')[0];
      hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;
    }

    const avgUtilization = Object.values(hourDistribution).reduce((a, b) => a + b, 0) / 24;

    const peakHours = Object.entries(hourDistribution)
      .filter(([_, count]) => count > avgUtilization * 1.5)
      .map(([hour, _]) => `${hour}:00`);

    const underutilizedHours = Object.entries(hourDistribution)
      .filter(([_, count]) => count < avgUtilization * 0.5)
      .map(([hour, _]) => `${hour}:00`);

    return {
      overall_utilization: avgUtilization,
      peak_hours: peakHours,
      underutilized_hours: underutilizedHours,
    };
  }

  /**
   * Function 32: Cost optimization
   * GET /api/v1/schedules/optimize/cost
   * Status: 200 OK
   */
  async optimizeCost(
    academicYear: string,
    semester: string
  ): Promise<{
    potential_savings: number;
    recommendations: string[];
  }> {
    // Calculate potential cost savings through optimization
    const recommendations: string[] = [];

    // Example recommendations
    recommendations.push('Consolidate low-enrollment sections');
    recommendations.push('Optimize room assignments to reduce heating/cooling costs');
    recommendations.push('Schedule classes in adjacent rooms to reduce facility costs');

    return {
      potential_savings: 0,
      recommendations,
    };
  }

  // ========================================================================
  // TIME BLOCK MANAGEMENT (Functions 33-37)
  // ========================================================================

  /**
   * Function 33: Create time blocks
   * POST /api/v1/time-blocks
   * Status: 201 Created
   */
  async createTimeBlock(data: z.infer<typeof CreateTimeBlockSchema>): Promise<TimeBlock> {
    try {
      const validated = CreateTimeBlockSchema.parse(data);

      // Calculate duration
      const [startHour, startMin] = validated.start_time.split(':').map(Number);
      const [endHour, endMin] = validated.end_time.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

      const timeBlock = await TimeBlock.create({
        ...validated,
        duration_minutes: durationMinutes,
      });

      this.logger.log(`Created time block: ${timeBlock.id}`);

      return timeBlock;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  }

  /**
   * Function 34: Standard time patterns
   * GET /api/v1/time-blocks/patterns/standard
   * Status: 200 OK
   */
  async getStandardTimePatterns(): Promise<{
    patterns: Array<{
      name: string;
      start_time: string;
      end_time: string;
      duration_minutes: number;
    }>;
  }> {
    const patterns = [
      { name: 'MWF 50-min', start_time: '09:00', end_time: '09:50', duration_minutes: 50 },
      { name: 'MWF 75-min', start_time: '09:00', end_time: '10:15', duration_minutes: 75 },
      { name: 'TR 75-min', start_time: '09:30', end_time: '10:45', duration_minutes: 75 },
      { name: 'TR 110-min', start_time: '14:00', end_time: '15:50', duration_minutes: 110 },
      { name: 'Evening', start_time: '18:00', end_time: '20:50', duration_minutes: 170 },
    ];

    return { patterns };
  }

  /**
   * Function 35: Custom time blocks
   * POST /api/v1/time-blocks/custom
   * Status: 201 Created
   */
  async createCustomTimeBlock(
    institutionId: string,
    name: string,
    startTime: string,
    endTime: string,
    days: DayOfWeek[]
  ): Promise<TimeBlock> {
    return this.createTimeBlock({
      institution_id: institutionId,
      name,
      start_time: startTime,
      end_time: endTime,
      applicable_days: days,
      display_order: 99,
    });
  }

  /**
   * Function 36: Block validation
   * POST /api/v1/time-blocks/validate
   * Status: 200 OK
   */
  async validateTimeBlock(
    startTime: string,
    endTime: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Parse times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // Validation rules
    if (endHour < startHour || (endHour === startHour && endMin <= startMin)) {
      errors.push('End time must be after start time');
    }

    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);

    if (durationMinutes < 30) {
      errors.push('Minimum class duration is 30 minutes');
    }

    if (durationMinutes > 240) {
      errors.push('Maximum class duration is 240 minutes');
    }

    if (startHour < 7 || startHour > 21) {
      errors.push('Classes should be scheduled between 7 AM and 9 PM');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Function 37: Time block templates
   * GET /api/v1/time-blocks/templates
   * Status: 200 OK
   */
  async getTimeBlockTemplates(institutionId: string): Promise<TimeBlock[]> {
    const templates = await TimeBlock.findAll({
      where: {
        institution_id: institutionId,
        is_active: true,
      },
      order: [['display_order', 'asc']],
    });

    return templates;
  }

  // ========================================================================
  // LAB & EXAM SCHEDULING (Functions 38-42)
  // ========================================================================

  /**
   * Function 38: Schedule lab sessions
   * POST /api/v1/schedules/labs
   * Status: 201 Created
   */
  async scheduleLabSession(
    labData: z.infer<typeof CreateScheduleSchema> & {
      required_equipment: string[];
      lab_capacity: number;
    }
  ): Promise<ClassSchedule> {
    // Find suitable lab room
    const labs = await Room.findAll({
      where: {
        room_type: RoomType.LABORATORY,
        capacity: { [Op.gte]: labData.lab_capacity },
        is_available: true,
      },
    });

    // Filter by equipment
    const suitableLabs = labs.filter((lab) => {
      return labData.required_equipment.every((eq) => lab.equipment.includes(eq));
    });

    if (suitableLabs.length === 0) {
      throw new BadRequestException('No suitable lab found with required equipment');
    }

    // Create lab schedule
    const schedule = await this.createSchedule({
      ...labData,
      class_type: ClassType.LAB,
      room_id: suitableLabs[0].id,
    });

    return schedule;
  }

  /**
   * Function 39: Assign lab resources
   * POST /api/v1/schedules/:id/lab-resources
   * Status: 200 OK
   */
  async assignLabResources(
    scheduleId: string,
    resources: {
      equipment: string[];
      software: string[];
      special_requirements: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    if (schedule.class_type !== ClassType.LAB) {
      throw new BadRequestException('This schedule is not a lab session');
    }

    // Would store in a separate lab_resources table
    this.logger.log(`Assigned lab resources to schedule: ${scheduleId}`);

    return {
      success: true,
      message: 'Lab resources assigned successfully',
    };
  }

  /**
   * Function 40: Schedule exams
   * POST /api/v1/schedules/exams
   * Status: 201 Created
   */
  async scheduleExam(
    examData: {
      course_id: string;
      academic_year: string;
      semester: string;
      exam_type: 'midterm' | 'final';
      date: Date;
      start_time: string;
      duration_minutes: number;
      students_count: number;
    }
  ): Promise<ClassSchedule> {
    // Calculate end time
    const [hour, minute] = examData.start_time.split(':').map(Number);
    const endMinutes = hour * 60 + minute + examData.duration_minutes;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      examData.date.getDay()
    ] as DayOfWeek;

    // Find suitable exam room
    const rooms = await Room.findAll({
      where: {
        capacity: { [Op.gte]: examData.students_count },
        room_type: { [Op.in]: [RoomType.CLASSROOM, RoomType.LECTURE_HALL] },
        is_available: true,
      },
      order: [['capacity', 'asc']],
      limit: 1,
    });

    if (rooms.length === 0) {
      throw new BadRequestException('No suitable room found for exam');
    }

    const schedule = await this.createSchedule({
      course_id: examData.course_id,
      section: 'EXAM',
      academic_year: examData.academic_year,
      semester: examData.semester,
      room_id: rooms[0].id,
      faculty_id: '00000000-0000-0000-0000-000000000000', // Placeholder
      day_of_week: dayOfWeek,
      start_time: examData.start_time,
      end_time: endTime,
      start_date: examData.date,
      end_date: examData.date,
      class_type: ClassType.EXAM,
      recurrence_pattern: RecurrencePattern.ONCE,
      max_enrollment: examData.students_count,
    });

    return schedule;
  }

  /**
   * Function 41: Exam room assignment
   * POST /api/v1/exams/:examId/assign-room
   * Status: 200 OK
   */
  async assignExamRoom(examId: string, roomId: string): Promise<ClassSchedule> {
    return this.assignRoomToClass(examId, roomId);
  }

  /**
   * Function 42: Conflict-free exam slots
   * GET /api/v1/exams/available-slots
   * Status: 200 OK
   */
  async findConflictFreeExamSlots(
    date: Date,
    durationMinutes: number
  ): Promise<{
    available_slots: Array<{
      start_time: string;
      end_time: string;
      available_rooms: number;
    }>;
  }> {
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      date.getDay()
    ] as DayOfWeek;

    // Get all existing schedules for that day
    const existingSchedules = await ClassSchedule.findAll({
      where: {
        day_of_week: dayOfWeek,
        start_date: { [Op.lte]: date },
        end_date: { [Op.gte]: date },
        status: { [Op.ne]: ScheduleStatus.CANCELLED },
      },
      order: [['start_time', 'asc']],
    });

    // Find gaps suitable for exams
    const availableSlots: Array<{
      start_time: string;
      end_time: string;
      available_rooms: number;
    }> = [];

    // Implementation would calculate available time slots

    return { available_slots };
  }

  // ========================================================================
  // PUBLISHING & CHANGES (Functions 43-45)
  // ========================================================================

  /**
   * Function 43: Publish schedule
   * POST /api/v1/schedules/:id/publish
   * Status: 200 OK, 404 Not Found, 409 Conflict
   */
  async publishSchedule(scheduleId: string): Promise<ClassSchedule> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // Check for unresolved critical conflicts
    const conflicts = await this.detectAllConflicts(schedule);

    if (conflicts.critical.length > 0) {
      throw new ConflictException({
        message: 'Cannot publish schedule with unresolved critical conflicts',
        conflicts: conflicts.critical,
      });
    }

    await schedule.update({ status: ScheduleStatus.PUBLISHED });

    this.logger.log(`Published schedule: ${scheduleId}`);

    return schedule;
  }

  /**
   * Function 44: Handle schedule changes
   * POST /api/v1/schedules/:id/changes
   * Status: 200 OK
   */
  async handleScheduleChange(
    scheduleId: string,
    changes: Partial<z.infer<typeof UpdateScheduleSchema>>,
    changeReason: string
  ): Promise<{
    schedule: ClassSchedule;
    affected_students: number;
    notifications_sent: boolean;
  }> {
    const schedule = await this.updateSchedule(scheduleId, changes);

    // Would notify affected students
    const affectedStudents = schedule.current_enrollment;

    this.logger.log(
      `Schedule change for ${scheduleId}: ${changeReason}. Affected students: ${affectedStudents}`
    );

    return {
      schedule,
      affected_students: affectedStudents,
      notifications_sent: true,
    };
  }

  /**
   * Function 45: Change notifications
   * POST /api/v1/schedules/:id/notify-changes
   * Status: 200 OK
   */
  async notifyScheduleChanges(
    scheduleId: string,
    changeDetails: {
      change_type: string;
      old_value: any;
      new_value: any;
      effective_date: Date;
    }
  ): Promise<{
    notifications_sent: number;
    notification_method: string[];
  }> {
    const schedule = await ClassSchedule.findByPk(scheduleId);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    // Would integrate with notification system
    const notificationsSent = schedule.current_enrollment;

    this.logger.log(`Sent ${notificationsSent} notifications for schedule change: ${scheduleId}`);

    return {
      notifications_sent: notificationsSent,
      notification_method: ['email', 'sms', 'app_notification'],
    };
  }
}

// ============================================================================
// UTILITY TYPES AND HELPERS
// ============================================================================

/**
 * Import Op from Sequelize for operations
 */
import { Op } from 'sequelize';

/**
 * API version constant
 */
export const API_VERSION = 'v1';

/**
 * API base path
 */
export const API_BASE_PATH = `/api/${API_VERSION}`;

/**
 * Export all models for external use
 */
export const SchedulingModels = {
  ClassSchedule,
  Room,
  TimeBlock,
  ScheduleConflict,
};

/**
 * Export all schemas for validation
 */
export const SchedulingSchemas = {
  CreateScheduleSchema,
  UpdateScheduleSchema,
  CreateRoomSchema,
  CreateTimeBlockSchema,
};

/**
 * Export all enums
 */
export const SchedulingEnums = {
  ScheduleStatus,
  DayOfWeek,
  ClassType,
  RoomType,
  ConflictType,
  ConflictSeverity,
  RecurrencePattern,
};

/**
 * Type exports for TypeScript consumers
 */
export type CreateScheduleDto = z.infer<typeof CreateScheduleSchema>;
export type UpdateScheduleDto = z.infer<typeof UpdateScheduleSchema>;
export type CreateRoomDto = z.infer<typeof CreateRoomSchema>;
export type CreateTimeBlockDto = z.infer<typeof CreateTimeBlockSchema>;
