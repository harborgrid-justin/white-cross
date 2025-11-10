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
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Schedule status enum
 */
export declare enum ScheduleStatus {
    DRAFT = "draft",
    PENDING = "pending",
    PUBLISHED = "published",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
/**
 * Day of week enum
 */
export declare enum DayOfWeek {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday"
}
/**
 * Class type enum
 */
export declare enum ClassType {
    LECTURE = "lecture",
    LAB = "lab",
    SEMINAR = "seminar",
    WORKSHOP = "workshop",
    TUTORIAL = "tutorial",
    EXAM = "exam",
    ONLINE = "online",
    HYBRID = "hybrid"
}
/**
 * Room type enum
 */
export declare enum RoomType {
    CLASSROOM = "classroom",
    LABORATORY = "laboratory",
    LECTURE_HALL = "lecture_hall",
    SEMINAR_ROOM = "seminar_room",
    COMPUTER_LAB = "computer_lab",
    AUDITORIUM = "auditorium",
    VIRTUAL = "virtual"
}
/**
 * Conflict type enum
 */
export declare enum ConflictType {
    TIME_CONFLICT = "time_conflict",
    ROOM_CONFLICT = "room_conflict",
    FACULTY_CONFLICT = "faculty_conflict",
    STUDENT_CONFLICT = "student_conflict",
    CAPACITY_CONFLICT = "capacity_conflict",
    RESOURCE_CONFLICT = "resource_conflict"
}
/**
 * Conflict severity enum
 */
export declare enum ConflictSeverity {
    CRITICAL = "critical",
    WARNING = "warning",
    INFO = "info"
}
/**
 * Recurrence pattern enum
 */
export declare enum RecurrencePattern {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    BI_WEEKLY = "bi_weekly",
    MONTHLY = "monthly"
}
/**
 * ClassSchedule model - Core scheduling information
 */
export declare class ClassSchedule extends Model {
    id: string;
    course_id: string;
    section: string;
    academic_year: string;
    semester: string;
    room_id: string;
    room: Room;
    faculty_id: string;
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
    start_date: Date;
    end_date: Date;
    class_type: ClassType;
    recurrence_pattern: RecurrencePattern;
    max_enrollment: number;
    current_enrollment: number;
    waitlist_count: number;
    status: ScheduleStatus;
    is_online: boolean;
    meeting_url: string;
    notes: string;
    conflicts: ScheduleConflict[];
}
/**
 * Room model - Classroom and facility information
 */
export declare class Room extends Model {
    id: string;
    room_number: string;
    building_id: string;
    building_name: string;
    floor: number;
    room_type: RoomType;
    capacity: number;
    equipment: string[];
    features: {
        has_projector?: boolean;
        has_whiteboard?: boolean;
        has_computers?: boolean;
        computer_count?: number;
        has_audio_visual?: boolean;
        is_accessible?: boolean;
        has_recording?: boolean;
    };
    is_available: boolean;
    maintenance_schedule: Array<{
        start_date: string;
        end_date: string;
        reason: string;
    }>;
    schedules: ClassSchedule[];
}
/**
 * TimeBlock model - Standardized time slots
 */
export declare class TimeBlock extends Model {
    id: string;
    institution_id: string;
    name: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    applicable_days: DayOfWeek[];
    is_active: boolean;
    display_order: number;
}
/**
 * ScheduleConflict model - Detected scheduling conflicts
 */
export declare class ScheduleConflict extends Model {
    id: string;
    schedule_id: string;
    schedule: ClassSchedule;
    conflicting_schedule_id: string;
    conflict_type: ConflictType;
    severity: ConflictSeverity;
    description: string;
    affected_resources: {
        room_id?: string;
        faculty_id?: string;
        student_ids?: string[];
    };
    is_resolved: boolean;
    resolution_notes: string;
    resolved_by: string;
    resolved_at: Date;
}
/**
 * Schedule creation schema
 */
export declare const CreateScheduleSchema: any;
/**
 * Schedule update schema
 */
export declare const UpdateScheduleSchema: any;
/**
 * Room creation schema
 */
export declare const CreateRoomSchema: any;
/**
 * Time block creation schema
 */
export declare const CreateTimeBlockSchema: any;
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
export declare class ClassSchedulingService {
    private readonly logger;
    /**
     * Function 1: Create class schedule
     * POST /api/v1/schedules
     * Status: 201 Created, 400 Bad Request, 409 Conflict
     */
    createSchedule(data: z.infer<typeof CreateScheduleSchema>): Promise<ClassSchedule>;
    /**
     * Function 2: Get schedule by ID
     * GET /api/v1/schedules/:id
     * Status: 200 OK, 404 Not Found
     */
    getScheduleById(id: string, options?: {
        includeRoom?: boolean;
        includeConflicts?: boolean;
    }): Promise<ClassSchedule>;
    /**
     * Function 3: List schedules with pagination
     * GET /api/v1/schedules?page=1&limit=20&sort=start_time&order=asc
     * Status: 200 OK
     */
    listSchedules(params: {
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
    }): Promise<PaginatedResponse<ClassSchedule>>;
    /**
     * Function 4: Update schedule
     * PUT /api/v1/schedules/:id or PATCH /api/v1/schedules/:id
     * Status: 200 OK, 404 Not Found, 400 Bad Request, 409 Conflict
     */
    updateSchedule(id: string, data: z.infer<typeof UpdateScheduleSchema>): Promise<ClassSchedule>;
    /**
     * Function 5: Delete schedule
     * DELETE /api/v1/schedules/:id
     * Status: 204 No Content, 404 Not Found
     */
    deleteSchedule(id: string, softDelete?: boolean): Promise<void>;
    /**
     * Function 6: Bulk schedule creation
     * POST /api/v1/schedules/bulk
     * Status: 201 Created, 400 Bad Request
     */
    bulkCreateSchedules(schedules: z.infer<typeof CreateScheduleSchema>[]): Promise<{
        created: ClassSchedule[];
        errors: Array<{
            index: number;
            error: string;
        }>;
    }>;
    /**
     * Function 7: Search schedules
     * GET /api/v1/schedules/search?q=searchterm
     * Status: 200 OK
     */
    searchSchedules(query: string, limit?: number): Promise<ClassSchedule[]>;
    /**
     * Function 8: Filter schedules by criteria
     * GET /api/v1/schedules/filter
     * Status: 200 OK
     */
    filterSchedules(criteria: {
        academic_years?: string[];
        semesters?: string[];
        faculty_ids?: string[];
        room_ids?: string[];
        statuses?: ScheduleStatus[];
        class_types?: ClassType[];
        days?: DayOfWeek[];
        time_range?: {
            start: string;
            end: string;
        };
    }): Promise<ClassSchedule[]>;
    /**
     * Function 9: Sort schedules
     * GET /api/v1/schedules?sort=field&order=asc|desc
     * Status: 200 OK
     */
    sortSchedules(sortField?: string, sortOrder?: 'asc' | 'desc', filters?: any): Promise<ClassSchedule[]>;
    /**
     * Function 10: Export schedule data
     * GET /api/v1/schedules/export?format=json|csv
     * Status: 200 OK
     */
    exportScheduleData(format?: 'json' | 'csv', filters?: any): Promise<any>;
    /**
     * Function 11: Create room
     * POST /api/v1/rooms
     * Status: 201 Created, 400 Bad Request
     */
    createRoom(data: z.infer<typeof CreateRoomSchema>): Promise<Room>;
    /**
     * Function 12: Update room details
     * PATCH /api/v1/rooms/:id
     * Status: 200 OK, 404 Not Found
     */
    updateRoom(id: string, data: Partial<z.infer<typeof CreateRoomSchema>>): Promise<Room>;
    /**
     * Function 13: Get room availability
     * GET /api/v1/rooms/:id/availability?date=YYYY-MM-DD
     * Status: 200 OK
     */
    getRoomAvailability(roomId: string, date: Date, dayOfWeek: DayOfWeek): Promise<{
        room: Room;
        available_slots: Array<{
            start: string;
            end: string;
        }>;
        occupied_slots: Array<{
            start: string;
            end: string;
            schedule_id: string;
        }>;
    }>;
    /**
     * Function 14: Assign room to class
     * POST /api/v1/schedules/:scheduleId/assign-room
     * Status: 200 OK, 404 Not Found, 409 Conflict
     */
    assignRoomToClass(scheduleId: string, roomId: string): Promise<ClassSchedule>;
    /**
     * Function 15: Room capacity check
     * GET /api/v1/rooms/:id/capacity-check?enrollment=30
     * Status: 200 OK
     */
    checkRoomCapacity(roomId: string, requiredCapacity: number): Promise<{
        room: Room;
        has_capacity: boolean;
        available_capacity: number;
        utilization_percentage: number;
    }>;
    /**
     * Function 16: List available rooms
     * GET /api/v1/rooms/available?day=monday&start_time=09:00&end_time=10:30
     * Status: 200 OK
     */
    listAvailableRooms(dayOfWeek: DayOfWeek, startTime: string, endTime: string, minCapacity?: number): Promise<Room[]>;
    /**
     * Function 17: Room utilization report
     * GET /api/v1/rooms/:id/utilization?academic_year=2024-2025&semester=fall
     * Status: 200 OK
     */
    getRoomUtilization(roomId: string, academicYear: string, semester: string): Promise<{
        room: Room;
        total_hours_scheduled: number;
        total_hours_available: number;
        utilization_percentage: number;
        schedules_count: number;
    }>;
    /**
     * Function 18: Room maintenance scheduling
     * POST /api/v1/rooms/:id/maintenance
     * Status: 200 OK, 404 Not Found
     */
    scheduleRoomMaintenance(roomId: string, maintenance: {
        start_date: string;
        end_date: string;
        reason: string;
    }): Promise<Room>;
    /**
     * Function 19: Detect time conflicts
     * GET /api/v1/schedules/:id/conflicts/time
     * Status: 200 OK
     */
    detectTimeConflicts(scheduleId: string): Promise<ScheduleConflict[]>;
    /**
     * Function 20: Detect room conflicts
     * GET /api/v1/schedules/:id/conflicts/room
     * Status: 200 OK
     */
    detectRoomConflicts(scheduleId: string, roomId?: string): Promise<ScheduleConflict[]>;
    /**
     * Function 21: Detect faculty conflicts
     * GET /api/v1/schedules/:id/conflicts/faculty
     * Status: 200 OK
     */
    detectFacultyConflicts(scheduleId: string): Promise<ScheduleConflict[]>;
    /**
     * Function 22: Student enrollment conflicts
     * GET /api/v1/schedules/:id/conflicts/students
     * Status: 200 OK
     */
    detectStudentConflicts(scheduleId: string, studentIds: string[]): Promise<{
        conflicts: Array<{
            student_id: string;
            conflicting_schedules: string[];
        }>;
    }>;
    /**
     * Function 23: Check all conflicts
     * GET /api/v1/schedules/:id/conflicts/all
     * Status: 200 OK
     */
    detectAllConflicts(schedule: ClassSchedule): Promise<{
        critical: ScheduleConflict[];
        warnings: ScheduleConflict[];
        info: ScheduleConflict[];
    }>;
    /**
     * Function 24: Resolve conflicts
     * POST /api/v1/conflicts/:id/resolve
     * Status: 200 OK, 404 Not Found
     */
    resolveConflict(conflictId: string, resolutionNotes: string, resolvedBy: string): Promise<ScheduleConflict>;
    /**
     * Function 25: Conflict history
     * GET /api/v1/schedules/:id/conflicts/history
     * Status: 200 OK
     */
    getConflictHistory(scheduleId: string): Promise<ScheduleConflict[]>;
    /**
     * Function 26: Conflict notifications
     * POST /api/v1/conflicts/:id/notify
     * Status: 200 OK
     */
    sendConflictNotification(conflictId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Function 27: Optimize room usage
     * POST /api/v1/schedules/optimize/rooms
     * Status: 200 OK
     */
    optimizeRoomUsage(academicYear: string, semester: string): Promise<{
        recommendations: Array<{
            schedule_id: string;
            current_room_id: string;
            recommended_room_id: string;
            reason: string;
        }>;
    }>;
    /**
     * Function 28: Balance faculty load
     * POST /api/v1/schedules/optimize/faculty-load
     * Status: 200 OK
     */
    balanceFacultyLoad(departmentId: string, academicYear: string, semester: string): Promise<{
        analysis: Array<{
            faculty_id: string;
            class_count: number;
            total_hours: number;
            status: 'underloaded' | 'balanced' | 'overloaded';
        }>;
    }>;
    /**
     * Function 29: Minimize conflicts
     * POST /api/v1/schedules/optimize/minimize-conflicts
     * Status: 200 OK
     */
    minimizeConflicts(academicYear: string, semester: string): Promise<{
        total_conflicts: number;
        resolvable_conflicts: number;
        suggestions: Array<{
            conflict_id: string;
            suggestion: string;
        }>;
    }>;
    /**
     * Function 30: Gap analysis
     * GET /api/v1/schedules/optimize/gaps
     * Status: 200 OK
     */
    analyzeScheduleGaps(academicYear: string, semester: string): Promise<{
        gaps: Array<{
            day: DayOfWeek;
            time_slot: string;
            available_rooms: number;
        }>;
    }>;
    /**
     * Function 31: Utilization optimization
     * GET /api/v1/schedules/optimize/utilization
     * Status: 200 OK
     */
    optimizeUtilization(academicYear: string, semester: string): Promise<{
        overall_utilization: number;
        peak_hours: string[];
        underutilized_hours: string[];
    }>;
    /**
     * Function 32: Cost optimization
     * GET /api/v1/schedules/optimize/cost
     * Status: 200 OK
     */
    optimizeCost(academicYear: string, semester: string): Promise<{
        potential_savings: number;
        recommendations: string[];
    }>;
    /**
     * Function 33: Create time blocks
     * POST /api/v1/time-blocks
     * Status: 201 Created
     */
    createTimeBlock(data: z.infer<typeof CreateTimeBlockSchema>): Promise<TimeBlock>;
    /**
     * Function 34: Standard time patterns
     * GET /api/v1/time-blocks/patterns/standard
     * Status: 200 OK
     */
    getStandardTimePatterns(): Promise<{
        patterns: Array<{
            name: string;
            start_time: string;
            end_time: string;
            duration_minutes: number;
        }>;
    }>;
    /**
     * Function 35: Custom time blocks
     * POST /api/v1/time-blocks/custom
     * Status: 201 Created
     */
    createCustomTimeBlock(institutionId: string, name: string, startTime: string, endTime: string, days: DayOfWeek[]): Promise<TimeBlock>;
    /**
     * Function 36: Block validation
     * POST /api/v1/time-blocks/validate
     * Status: 200 OK
     */
    validateTimeBlock(startTime: string, endTime: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * Function 37: Time block templates
     * GET /api/v1/time-blocks/templates
     * Status: 200 OK
     */
    getTimeBlockTemplates(institutionId: string): Promise<TimeBlock[]>;
    /**
     * Function 38: Schedule lab sessions
     * POST /api/v1/schedules/labs
     * Status: 201 Created
     */
    scheduleLabSession(labData: z.infer<typeof CreateScheduleSchema> & {
        required_equipment: string[];
        lab_capacity: number;
    }): Promise<ClassSchedule>;
    /**
     * Function 39: Assign lab resources
     * POST /api/v1/schedules/:id/lab-resources
     * Status: 200 OK
     */
    assignLabResources(scheduleId: string, resources: {
        equipment: string[];
        software: string[];
        special_requirements: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Function 40: Schedule exams
     * POST /api/v1/schedules/exams
     * Status: 201 Created
     */
    scheduleExam(examData: {
        course_id: string;
        academic_year: string;
        semester: string;
        exam_type: 'midterm' | 'final';
        date: Date;
        start_time: string;
        duration_minutes: number;
        students_count: number;
    }): Promise<ClassSchedule>;
    /**
     * Function 41: Exam room assignment
     * POST /api/v1/exams/:examId/assign-room
     * Status: 200 OK
     */
    assignExamRoom(examId: string, roomId: string): Promise<ClassSchedule>;
    /**
     * Function 42: Conflict-free exam slots
     * GET /api/v1/exams/available-slots
     * Status: 200 OK
     */
    findConflictFreeExamSlots(date: Date, durationMinutes: number): Promise<{
        available_slots: Array<{
            start_time: string;
            end_time: string;
            available_rooms: number;
        }>;
    }>;
    /**
     * Function 43: Publish schedule
     * POST /api/v1/schedules/:id/publish
     * Status: 200 OK, 404 Not Found, 409 Conflict
     */
    publishSchedule(scheduleId: string): Promise<ClassSchedule>;
    /**
     * Function 44: Handle schedule changes
     * POST /api/v1/schedules/:id/changes
     * Status: 200 OK
     */
    handleScheduleChange(scheduleId: string, changes: Partial<z.infer<typeof UpdateScheduleSchema>>, changeReason: string): Promise<{
        schedule: ClassSchedule;
        affected_students: number;
        notifications_sent: boolean;
    }>;
    /**
     * Function 45: Change notifications
     * POST /api/v1/schedules/:id/notify-changes
     * Status: 200 OK
     */
    notifyScheduleChanges(scheduleId: string, changeDetails: {
        change_type: string;
        old_value: any;
        new_value: any;
        effective_date: Date;
    }): Promise<{
        notifications_sent: number;
        notification_method: string[];
    }>;
}
/**
 * API version constant
 */
export declare const API_VERSION = "v1";
/**
 * API base path
 */
export declare const API_BASE_PATH = "/api/v1";
/**
 * Export all models for external use
 */
export declare const SchedulingModels: {
    ClassSchedule: typeof ClassSchedule;
    Room: typeof Room;
    TimeBlock: typeof TimeBlock;
    ScheduleConflict: typeof ScheduleConflict;
};
/**
 * Export all schemas for validation
 */
export declare const SchedulingSchemas: {
    CreateScheduleSchema: any;
    UpdateScheduleSchema: any;
    CreateRoomSchema: any;
    CreateTimeBlockSchema: any;
};
/**
 * Export all enums
 */
export declare const SchedulingEnums: {
    ScheduleStatus: typeof ScheduleStatus;
    DayOfWeek: typeof DayOfWeek;
    ClassType: typeof ClassType;
    RoomType: typeof RoomType;
    ConflictType: typeof ConflictType;
    ConflictSeverity: typeof ConflictSeverity;
    RecurrencePattern: typeof RecurrencePattern;
};
/**
 * Type exports for TypeScript consumers
 */
export type CreateScheduleDto = z.infer<typeof CreateScheduleSchema>;
export type UpdateScheduleDto = z.infer<typeof UpdateScheduleSchema>;
export type CreateRoomDto = z.infer<typeof CreateRoomSchema>;
export type CreateTimeBlockDto = z.infer<typeof CreateTimeBlockSchema>;
//# sourceMappingURL=class-scheduling-kit.d.ts.map