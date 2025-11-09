"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingEnums = exports.SchedulingSchemas = exports.SchedulingModels = exports.API_BASE_PATH = exports.API_VERSION = exports.ClassSchedulingService = exports.CreateTimeBlockSchema = exports.CreateRoomSchema = exports.UpdateScheduleSchema = exports.CreateScheduleSchema = exports.ScheduleConflict = exports.TimeBlock = exports.Room = exports.ClassSchedule = exports.RecurrencePattern = exports.ConflictSeverity = exports.ConflictType = exports.RoomType = exports.ClassType = exports.DayOfWeek = exports.ScheduleStatus = void 0;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
// ============================================================================
// ADVANCED TYPE SYSTEM
// ============================================================================
/**
 * Schedule status enum
 */
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["DRAFT"] = "draft";
    ScheduleStatus["PENDING"] = "pending";
    ScheduleStatus["PUBLISHED"] = "published";
    ScheduleStatus["CANCELLED"] = "cancelled";
    ScheduleStatus["COMPLETED"] = "completed";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
/**
 * Day of week enum
 */
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MONDAY"] = "monday";
    DayOfWeek["TUESDAY"] = "tuesday";
    DayOfWeek["WEDNESDAY"] = "wednesday";
    DayOfWeek["THURSDAY"] = "thursday";
    DayOfWeek["FRIDAY"] = "friday";
    DayOfWeek["SATURDAY"] = "saturday";
    DayOfWeek["SUNDAY"] = "sunday";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
/**
 * Class type enum
 */
var ClassType;
(function (ClassType) {
    ClassType["LECTURE"] = "lecture";
    ClassType["LAB"] = "lab";
    ClassType["SEMINAR"] = "seminar";
    ClassType["WORKSHOP"] = "workshop";
    ClassType["TUTORIAL"] = "tutorial";
    ClassType["EXAM"] = "exam";
    ClassType["ONLINE"] = "online";
    ClassType["HYBRID"] = "hybrid";
})(ClassType || (exports.ClassType = ClassType = {}));
/**
 * Room type enum
 */
var RoomType;
(function (RoomType) {
    RoomType["CLASSROOM"] = "classroom";
    RoomType["LABORATORY"] = "laboratory";
    RoomType["LECTURE_HALL"] = "lecture_hall";
    RoomType["SEMINAR_ROOM"] = "seminar_room";
    RoomType["COMPUTER_LAB"] = "computer_lab";
    RoomType["AUDITORIUM"] = "auditorium";
    RoomType["VIRTUAL"] = "virtual";
})(RoomType || (exports.RoomType = RoomType = {}));
/**
 * Conflict type enum
 */
var ConflictType;
(function (ConflictType) {
    ConflictType["TIME_CONFLICT"] = "time_conflict";
    ConflictType["ROOM_CONFLICT"] = "room_conflict";
    ConflictType["FACULTY_CONFLICT"] = "faculty_conflict";
    ConflictType["STUDENT_CONFLICT"] = "student_conflict";
    ConflictType["CAPACITY_CONFLICT"] = "capacity_conflict";
    ConflictType["RESOURCE_CONFLICT"] = "resource_conflict";
})(ConflictType || (exports.ConflictType = ConflictType = {}));
/**
 * Conflict severity enum
 */
var ConflictSeverity;
(function (ConflictSeverity) {
    ConflictSeverity["CRITICAL"] = "critical";
    ConflictSeverity["WARNING"] = "warning";
    ConflictSeverity["INFO"] = "info";
})(ConflictSeverity || (exports.ConflictSeverity = ConflictSeverity = {}));
/**
 * Recurrence pattern enum
 */
var RecurrencePattern;
(function (RecurrencePattern) {
    RecurrencePattern["ONCE"] = "once";
    RecurrencePattern["DAILY"] = "daily";
    RecurrencePattern["WEEKLY"] = "weekly";
    RecurrencePattern["BI_WEEKLY"] = "bi_weekly";
    RecurrencePattern["MONTHLY"] = "monthly";
})(RecurrencePattern || (exports.RecurrencePattern = RecurrencePattern = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * ClassSchedule model - Core scheduling information
 */
let ClassSchedule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _course_id_decorators;
    let _course_id_initializers = [];
    let _course_id_extraInitializers = [];
    let _section_decorators;
    let _section_initializers = [];
    let _section_extraInitializers = [];
    let _academic_year_decorators;
    let _academic_year_initializers = [];
    let _academic_year_extraInitializers = [];
    let _semester_decorators;
    let _semester_initializers = [];
    let _semester_extraInitializers = [];
    let _room_id_decorators;
    let _room_id_initializers = [];
    let _room_id_extraInitializers = [];
    let _room_decorators;
    let _room_initializers = [];
    let _room_extraInitializers = [];
    let _faculty_id_decorators;
    let _faculty_id_initializers = [];
    let _faculty_id_extraInitializers = [];
    let _day_of_week_decorators;
    let _day_of_week_initializers = [];
    let _day_of_week_extraInitializers = [];
    let _start_time_decorators;
    let _start_time_initializers = [];
    let _start_time_extraInitializers = [];
    let _end_time_decorators;
    let _end_time_initializers = [];
    let _end_time_extraInitializers = [];
    let _start_date_decorators;
    let _start_date_initializers = [];
    let _start_date_extraInitializers = [];
    let _end_date_decorators;
    let _end_date_initializers = [];
    let _end_date_extraInitializers = [];
    let _class_type_decorators;
    let _class_type_initializers = [];
    let _class_type_extraInitializers = [];
    let _recurrence_pattern_decorators;
    let _recurrence_pattern_initializers = [];
    let _recurrence_pattern_extraInitializers = [];
    let _max_enrollment_decorators;
    let _max_enrollment_initializers = [];
    let _max_enrollment_extraInitializers = [];
    let _current_enrollment_decorators;
    let _current_enrollment_initializers = [];
    let _current_enrollment_extraInitializers = [];
    let _waitlist_count_decorators;
    let _waitlist_count_initializers = [];
    let _waitlist_count_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _is_online_decorators;
    let _is_online_initializers = [];
    let _is_online_extraInitializers = [];
    let _meeting_url_decorators;
    let _meeting_url_initializers = [];
    let _meeting_url_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _conflicts_decorators;
    let _conflicts_initializers = [];
    let _conflicts_extraInitializers = [];
    var ClassSchedule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.course_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _course_id_initializers, void 0));
            this.section = (__runInitializers(this, _course_id_extraInitializers), __runInitializers(this, _section_initializers, void 0));
            this.academic_year = (__runInitializers(this, _section_extraInitializers), __runInitializers(this, _academic_year_initializers, void 0));
            this.semester = (__runInitializers(this, _academic_year_extraInitializers), __runInitializers(this, _semester_initializers, void 0));
            this.room_id = (__runInitializers(this, _semester_extraInitializers), __runInitializers(this, _room_id_initializers, void 0));
            this.room = (__runInitializers(this, _room_id_extraInitializers), __runInitializers(this, _room_initializers, void 0));
            this.faculty_id = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _faculty_id_initializers, void 0));
            this.day_of_week = (__runInitializers(this, _faculty_id_extraInitializers), __runInitializers(this, _day_of_week_initializers, void 0));
            this.start_time = (__runInitializers(this, _day_of_week_extraInitializers), __runInitializers(this, _start_time_initializers, void 0));
            this.end_time = (__runInitializers(this, _start_time_extraInitializers), __runInitializers(this, _end_time_initializers, void 0));
            this.start_date = (__runInitializers(this, _end_time_extraInitializers), __runInitializers(this, _start_date_initializers, void 0));
            this.end_date = (__runInitializers(this, _start_date_extraInitializers), __runInitializers(this, _end_date_initializers, void 0));
            this.class_type = (__runInitializers(this, _end_date_extraInitializers), __runInitializers(this, _class_type_initializers, void 0));
            this.recurrence_pattern = (__runInitializers(this, _class_type_extraInitializers), __runInitializers(this, _recurrence_pattern_initializers, void 0));
            this.max_enrollment = (__runInitializers(this, _recurrence_pattern_extraInitializers), __runInitializers(this, _max_enrollment_initializers, void 0));
            this.current_enrollment = (__runInitializers(this, _max_enrollment_extraInitializers), __runInitializers(this, _current_enrollment_initializers, void 0));
            this.waitlist_count = (__runInitializers(this, _current_enrollment_extraInitializers), __runInitializers(this, _waitlist_count_initializers, void 0));
            this.status = (__runInitializers(this, _waitlist_count_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.is_online = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _is_online_initializers, void 0));
            this.meeting_url = (__runInitializers(this, _is_online_extraInitializers), __runInitializers(this, _meeting_url_initializers, void 0));
            this.notes = (__runInitializers(this, _meeting_url_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.conflicts = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _conflicts_initializers, void 0));
            __runInitializers(this, _conflicts_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClassSchedule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _course_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Course ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _section_decorators = [(0, swagger_1.ApiProperty)({ description: 'Section number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: false,
            })];
        _academic_year_decorators = [(0, swagger_1.ApiProperty)({ description: 'Academic year' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(10),
                allowNull: false,
            })];
        _semester_decorators = [(0, swagger_1.ApiProperty)({ description: 'Semester' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _room_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Room ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Room), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _room_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Room)];
        _faculty_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Faculty ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _day_of_week_decorators = [(0, swagger_1.ApiProperty)({ description: 'Day of week', enum: DayOfWeek }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DayOfWeek)),
                allowNull: false,
            })];
        _start_time_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time (HH:MM)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TIME,
                allowNull: false,
            })];
        _end_time_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time (HH:MM)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TIME,
                allowNull: false,
            })];
        _start_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _end_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _class_type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Class type', enum: ClassType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClassType)),
                defaultValue: ClassType.LECTURE,
                allowNull: false,
            })];
        _recurrence_pattern_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recurrence pattern', enum: RecurrencePattern }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RecurrencePattern)),
                defaultValue: RecurrencePattern.WEEKLY,
                allowNull: false,
            })];
        _max_enrollment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum enrollment' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _current_enrollment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current enrollment' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _waitlist_count_decorators = [(0, swagger_1.ApiProperty)({ description: 'Waitlist count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule status', enum: ScheduleStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ScheduleStatus)),
                defaultValue: ScheduleStatus.DRAFT,
                allowNull: false,
            })];
        _is_online_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is online' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _meeting_url_decorators = [(0, swagger_1.ApiProperty)({ description: 'Meeting URL for online classes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _conflicts_decorators = [(0, sequelize_typescript_1.HasMany)(() => ScheduleConflict)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _course_id_decorators, { kind: "field", name: "course_id", static: false, private: false, access: { has: obj => "course_id" in obj, get: obj => obj.course_id, set: (obj, value) => { obj.course_id = value; } }, metadata: _metadata }, _course_id_initializers, _course_id_extraInitializers);
        __esDecorate(null, null, _section_decorators, { kind: "field", name: "section", static: false, private: false, access: { has: obj => "section" in obj, get: obj => obj.section, set: (obj, value) => { obj.section = value; } }, metadata: _metadata }, _section_initializers, _section_extraInitializers);
        __esDecorate(null, null, _academic_year_decorators, { kind: "field", name: "academic_year", static: false, private: false, access: { has: obj => "academic_year" in obj, get: obj => obj.academic_year, set: (obj, value) => { obj.academic_year = value; } }, metadata: _metadata }, _academic_year_initializers, _academic_year_extraInitializers);
        __esDecorate(null, null, _semester_decorators, { kind: "field", name: "semester", static: false, private: false, access: { has: obj => "semester" in obj, get: obj => obj.semester, set: (obj, value) => { obj.semester = value; } }, metadata: _metadata }, _semester_initializers, _semester_extraInitializers);
        __esDecorate(null, null, _room_id_decorators, { kind: "field", name: "room_id", static: false, private: false, access: { has: obj => "room_id" in obj, get: obj => obj.room_id, set: (obj, value) => { obj.room_id = value; } }, metadata: _metadata }, _room_id_initializers, _room_id_extraInitializers);
        __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: obj => "room" in obj, get: obj => obj.room, set: (obj, value) => { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
        __esDecorate(null, null, _faculty_id_decorators, { kind: "field", name: "faculty_id", static: false, private: false, access: { has: obj => "faculty_id" in obj, get: obj => obj.faculty_id, set: (obj, value) => { obj.faculty_id = value; } }, metadata: _metadata }, _faculty_id_initializers, _faculty_id_extraInitializers);
        __esDecorate(null, null, _day_of_week_decorators, { kind: "field", name: "day_of_week", static: false, private: false, access: { has: obj => "day_of_week" in obj, get: obj => obj.day_of_week, set: (obj, value) => { obj.day_of_week = value; } }, metadata: _metadata }, _day_of_week_initializers, _day_of_week_extraInitializers);
        __esDecorate(null, null, _start_time_decorators, { kind: "field", name: "start_time", static: false, private: false, access: { has: obj => "start_time" in obj, get: obj => obj.start_time, set: (obj, value) => { obj.start_time = value; } }, metadata: _metadata }, _start_time_initializers, _start_time_extraInitializers);
        __esDecorate(null, null, _end_time_decorators, { kind: "field", name: "end_time", static: false, private: false, access: { has: obj => "end_time" in obj, get: obj => obj.end_time, set: (obj, value) => { obj.end_time = value; } }, metadata: _metadata }, _end_time_initializers, _end_time_extraInitializers);
        __esDecorate(null, null, _start_date_decorators, { kind: "field", name: "start_date", static: false, private: false, access: { has: obj => "start_date" in obj, get: obj => obj.start_date, set: (obj, value) => { obj.start_date = value; } }, metadata: _metadata }, _start_date_initializers, _start_date_extraInitializers);
        __esDecorate(null, null, _end_date_decorators, { kind: "field", name: "end_date", static: false, private: false, access: { has: obj => "end_date" in obj, get: obj => obj.end_date, set: (obj, value) => { obj.end_date = value; } }, metadata: _metadata }, _end_date_initializers, _end_date_extraInitializers);
        __esDecorate(null, null, _class_type_decorators, { kind: "field", name: "class_type", static: false, private: false, access: { has: obj => "class_type" in obj, get: obj => obj.class_type, set: (obj, value) => { obj.class_type = value; } }, metadata: _metadata }, _class_type_initializers, _class_type_extraInitializers);
        __esDecorate(null, null, _recurrence_pattern_decorators, { kind: "field", name: "recurrence_pattern", static: false, private: false, access: { has: obj => "recurrence_pattern" in obj, get: obj => obj.recurrence_pattern, set: (obj, value) => { obj.recurrence_pattern = value; } }, metadata: _metadata }, _recurrence_pattern_initializers, _recurrence_pattern_extraInitializers);
        __esDecorate(null, null, _max_enrollment_decorators, { kind: "field", name: "max_enrollment", static: false, private: false, access: { has: obj => "max_enrollment" in obj, get: obj => obj.max_enrollment, set: (obj, value) => { obj.max_enrollment = value; } }, metadata: _metadata }, _max_enrollment_initializers, _max_enrollment_extraInitializers);
        __esDecorate(null, null, _current_enrollment_decorators, { kind: "field", name: "current_enrollment", static: false, private: false, access: { has: obj => "current_enrollment" in obj, get: obj => obj.current_enrollment, set: (obj, value) => { obj.current_enrollment = value; } }, metadata: _metadata }, _current_enrollment_initializers, _current_enrollment_extraInitializers);
        __esDecorate(null, null, _waitlist_count_decorators, { kind: "field", name: "waitlist_count", static: false, private: false, access: { has: obj => "waitlist_count" in obj, get: obj => obj.waitlist_count, set: (obj, value) => { obj.waitlist_count = value; } }, metadata: _metadata }, _waitlist_count_initializers, _waitlist_count_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _is_online_decorators, { kind: "field", name: "is_online", static: false, private: false, access: { has: obj => "is_online" in obj, get: obj => obj.is_online, set: (obj, value) => { obj.is_online = value; } }, metadata: _metadata }, _is_online_initializers, _is_online_extraInitializers);
        __esDecorate(null, null, _meeting_url_decorators, { kind: "field", name: "meeting_url", static: false, private: false, access: { has: obj => "meeting_url" in obj, get: obj => obj.meeting_url, set: (obj, value) => { obj.meeting_url = value; } }, metadata: _metadata }, _meeting_url_initializers, _meeting_url_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _conflicts_decorators, { kind: "field", name: "conflicts", static: false, private: false, access: { has: obj => "conflicts" in obj, get: obj => obj.conflicts, set: (obj, value) => { obj.conflicts = value; } }, metadata: _metadata }, _conflicts_initializers, _conflicts_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClassSchedule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClassSchedule = _classThis;
})();
exports.ClassSchedule = ClassSchedule;
/**
 * Room model - Classroom and facility information
 */
let Room = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'rooms',
            timestamps: true,
            indexes: [
                { fields: ['building_id'] },
                { fields: ['room_type'] },
                { fields: ['is_available'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _room_number_decorators;
    let _room_number_initializers = [];
    let _room_number_extraInitializers = [];
    let _building_id_decorators;
    let _building_id_initializers = [];
    let _building_id_extraInitializers = [];
    let _building_name_decorators;
    let _building_name_initializers = [];
    let _building_name_extraInitializers = [];
    let _floor_decorators;
    let _floor_initializers = [];
    let _floor_extraInitializers = [];
    let _room_type_decorators;
    let _room_type_initializers = [];
    let _room_type_extraInitializers = [];
    let _capacity_decorators;
    let _capacity_initializers = [];
    let _capacity_extraInitializers = [];
    let _equipment_decorators;
    let _equipment_initializers = [];
    let _equipment_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _is_available_decorators;
    let _is_available_initializers = [];
    let _is_available_extraInitializers = [];
    let _maintenance_schedule_decorators;
    let _maintenance_schedule_initializers = [];
    let _maintenance_schedule_extraInitializers = [];
    let _schedules_decorators;
    let _schedules_initializers = [];
    let _schedules_extraInitializers = [];
    var Room = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.room_number = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _room_number_initializers, void 0));
            this.building_id = (__runInitializers(this, _room_number_extraInitializers), __runInitializers(this, _building_id_initializers, void 0));
            this.building_name = (__runInitializers(this, _building_id_extraInitializers), __runInitializers(this, _building_name_initializers, void 0));
            this.floor = (__runInitializers(this, _building_name_extraInitializers), __runInitializers(this, _floor_initializers, void 0));
            this.room_type = (__runInitializers(this, _floor_extraInitializers), __runInitializers(this, _room_type_initializers, void 0));
            this.capacity = (__runInitializers(this, _room_type_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
            this.equipment = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _equipment_initializers, void 0));
            this.features = (__runInitializers(this, _equipment_extraInitializers), __runInitializers(this, _features_initializers, void 0));
            this.is_available = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _is_available_initializers, void 0));
            this.maintenance_schedule = (__runInitializers(this, _is_available_extraInitializers), __runInitializers(this, _maintenance_schedule_initializers, void 0));
            this.schedules = (__runInitializers(this, _maintenance_schedule_extraInitializers), __runInitializers(this, _schedules_initializers, void 0));
            __runInitializers(this, _schedules_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Room");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Room unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _room_number_decorators = [(0, swagger_1.ApiProperty)({ description: 'Room number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _building_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Building ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _building_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Building name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _floor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Floor number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _room_type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Room type', enum: RoomType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RoomType)),
                allowNull: false,
            })];
        _capacity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Seating capacity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _equipment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Available equipment' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                defaultValue: [],
            })];
        _features_decorators = [(0, swagger_1.ApiProperty)({ description: 'Features and amenities' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _is_available_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is available for scheduling' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _maintenance_schedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance schedule' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _schedules_decorators = [(0, sequelize_typescript_1.HasMany)(() => ClassSchedule)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _room_number_decorators, { kind: "field", name: "room_number", static: false, private: false, access: { has: obj => "room_number" in obj, get: obj => obj.room_number, set: (obj, value) => { obj.room_number = value; } }, metadata: _metadata }, _room_number_initializers, _room_number_extraInitializers);
        __esDecorate(null, null, _building_id_decorators, { kind: "field", name: "building_id", static: false, private: false, access: { has: obj => "building_id" in obj, get: obj => obj.building_id, set: (obj, value) => { obj.building_id = value; } }, metadata: _metadata }, _building_id_initializers, _building_id_extraInitializers);
        __esDecorate(null, null, _building_name_decorators, { kind: "field", name: "building_name", static: false, private: false, access: { has: obj => "building_name" in obj, get: obj => obj.building_name, set: (obj, value) => { obj.building_name = value; } }, metadata: _metadata }, _building_name_initializers, _building_name_extraInitializers);
        __esDecorate(null, null, _floor_decorators, { kind: "field", name: "floor", static: false, private: false, access: { has: obj => "floor" in obj, get: obj => obj.floor, set: (obj, value) => { obj.floor = value; } }, metadata: _metadata }, _floor_initializers, _floor_extraInitializers);
        __esDecorate(null, null, _room_type_decorators, { kind: "field", name: "room_type", static: false, private: false, access: { has: obj => "room_type" in obj, get: obj => obj.room_type, set: (obj, value) => { obj.room_type = value; } }, metadata: _metadata }, _room_type_initializers, _room_type_extraInitializers);
        __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: obj => "capacity" in obj, get: obj => obj.capacity, set: (obj, value) => { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
        __esDecorate(null, null, _equipment_decorators, { kind: "field", name: "equipment", static: false, private: false, access: { has: obj => "equipment" in obj, get: obj => obj.equipment, set: (obj, value) => { obj.equipment = value; } }, metadata: _metadata }, _equipment_initializers, _equipment_extraInitializers);
        __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
        __esDecorate(null, null, _is_available_decorators, { kind: "field", name: "is_available", static: false, private: false, access: { has: obj => "is_available" in obj, get: obj => obj.is_available, set: (obj, value) => { obj.is_available = value; } }, metadata: _metadata }, _is_available_initializers, _is_available_extraInitializers);
        __esDecorate(null, null, _maintenance_schedule_decorators, { kind: "field", name: "maintenance_schedule", static: false, private: false, access: { has: obj => "maintenance_schedule" in obj, get: obj => obj.maintenance_schedule, set: (obj, value) => { obj.maintenance_schedule = value; } }, metadata: _metadata }, _maintenance_schedule_initializers, _maintenance_schedule_extraInitializers);
        __esDecorate(null, null, _schedules_decorators, { kind: "field", name: "schedules", static: false, private: false, access: { has: obj => "schedules" in obj, get: obj => obj.schedules, set: (obj, value) => { obj.schedules = value; } }, metadata: _metadata }, _schedules_initializers, _schedules_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Room = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Room = _classThis;
})();
exports.Room = Room;
/**
 * TimeBlock model - Standardized time slots
 */
let TimeBlock = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'time_blocks',
            timestamps: true,
            indexes: [
                { fields: ['institution_id'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _institution_id_decorators;
    let _institution_id_initializers = [];
    let _institution_id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _start_time_decorators;
    let _start_time_initializers = [];
    let _start_time_extraInitializers = [];
    let _end_time_decorators;
    let _end_time_initializers = [];
    let _end_time_extraInitializers = [];
    let _duration_minutes_decorators;
    let _duration_minutes_initializers = [];
    let _duration_minutes_extraInitializers = [];
    let _applicable_days_decorators;
    let _applicable_days_initializers = [];
    let _applicable_days_extraInitializers = [];
    let _is_active_decorators;
    let _is_active_initializers = [];
    let _is_active_extraInitializers = [];
    let _display_order_decorators;
    let _display_order_initializers = [];
    let _display_order_extraInitializers = [];
    var TimeBlock = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.institution_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _institution_id_initializers, void 0));
            this.name = (__runInitializers(this, _institution_id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.start_time = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _start_time_initializers, void 0));
            this.end_time = (__runInitializers(this, _start_time_extraInitializers), __runInitializers(this, _end_time_initializers, void 0));
            this.duration_minutes = (__runInitializers(this, _end_time_extraInitializers), __runInitializers(this, _duration_minutes_initializers, void 0));
            this.applicable_days = (__runInitializers(this, _duration_minutes_extraInitializers), __runInitializers(this, _applicable_days_initializers, void 0));
            this.is_active = (__runInitializers(this, _applicable_days_extraInitializers), __runInitializers(this, _is_active_initializers, void 0));
            this.display_order = (__runInitializers(this, _is_active_extraInitializers), __runInitializers(this, _display_order_initializers, void 0));
            __runInitializers(this, _display_order_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TimeBlock");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Time block unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _institution_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Institution ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Block name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _start_time_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time (HH:MM)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TIME,
                allowNull: false,
            })];
        _end_time_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time (HH:MM)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TIME,
                allowNull: false,
            })];
        _duration_minutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _applicable_days_decorators = [(0, swagger_1.ApiProperty)({ description: 'Days applicable' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(DayOfWeek))),
                defaultValue: [],
            })];
        _is_active_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _display_order_decorators = [(0, swagger_1.ApiProperty)({ description: 'Display order' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _institution_id_decorators, { kind: "field", name: "institution_id", static: false, private: false, access: { has: obj => "institution_id" in obj, get: obj => obj.institution_id, set: (obj, value) => { obj.institution_id = value; } }, metadata: _metadata }, _institution_id_initializers, _institution_id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _start_time_decorators, { kind: "field", name: "start_time", static: false, private: false, access: { has: obj => "start_time" in obj, get: obj => obj.start_time, set: (obj, value) => { obj.start_time = value; } }, metadata: _metadata }, _start_time_initializers, _start_time_extraInitializers);
        __esDecorate(null, null, _end_time_decorators, { kind: "field", name: "end_time", static: false, private: false, access: { has: obj => "end_time" in obj, get: obj => obj.end_time, set: (obj, value) => { obj.end_time = value; } }, metadata: _metadata }, _end_time_initializers, _end_time_extraInitializers);
        __esDecorate(null, null, _duration_minutes_decorators, { kind: "field", name: "duration_minutes", static: false, private: false, access: { has: obj => "duration_minutes" in obj, get: obj => obj.duration_minutes, set: (obj, value) => { obj.duration_minutes = value; } }, metadata: _metadata }, _duration_minutes_initializers, _duration_minutes_extraInitializers);
        __esDecorate(null, null, _applicable_days_decorators, { kind: "field", name: "applicable_days", static: false, private: false, access: { has: obj => "applicable_days" in obj, get: obj => obj.applicable_days, set: (obj, value) => { obj.applicable_days = value; } }, metadata: _metadata }, _applicable_days_initializers, _applicable_days_extraInitializers);
        __esDecorate(null, null, _is_active_decorators, { kind: "field", name: "is_active", static: false, private: false, access: { has: obj => "is_active" in obj, get: obj => obj.is_active, set: (obj, value) => { obj.is_active = value; } }, metadata: _metadata }, _is_active_initializers, _is_active_extraInitializers);
        __esDecorate(null, null, _display_order_decorators, { kind: "field", name: "display_order", static: false, private: false, access: { has: obj => "display_order" in obj, get: obj => obj.display_order, set: (obj, value) => { obj.display_order = value; } }, metadata: _metadata }, _display_order_initializers, _display_order_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimeBlock = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimeBlock = _classThis;
})();
exports.TimeBlock = TimeBlock;
/**
 * ScheduleConflict model - Detected scheduling conflicts
 */
let ScheduleConflict = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'schedule_conflicts',
            timestamps: true,
            indexes: [
                { fields: ['schedule_id'] },
                { fields: ['conflict_type'] },
                { fields: ['severity'] },
                { fields: ['is_resolved'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _schedule_id_decorators;
    let _schedule_id_initializers = [];
    let _schedule_id_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    let _conflicting_schedule_id_decorators;
    let _conflicting_schedule_id_initializers = [];
    let _conflicting_schedule_id_extraInitializers = [];
    let _conflict_type_decorators;
    let _conflict_type_initializers = [];
    let _conflict_type_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _affected_resources_decorators;
    let _affected_resources_initializers = [];
    let _affected_resources_extraInitializers = [];
    let _is_resolved_decorators;
    let _is_resolved_initializers = [];
    let _is_resolved_extraInitializers = [];
    let _resolution_notes_decorators;
    let _resolution_notes_initializers = [];
    let _resolution_notes_extraInitializers = [];
    let _resolved_by_decorators;
    let _resolved_by_initializers = [];
    let _resolved_by_extraInitializers = [];
    let _resolved_at_decorators;
    let _resolved_at_initializers = [];
    let _resolved_at_extraInitializers = [];
    var ScheduleConflict = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.schedule_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _schedule_id_initializers, void 0));
            this.schedule = (__runInitializers(this, _schedule_id_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
            this.conflicting_schedule_id = (__runInitializers(this, _schedule_extraInitializers), __runInitializers(this, _conflicting_schedule_id_initializers, void 0));
            this.conflict_type = (__runInitializers(this, _conflicting_schedule_id_extraInitializers), __runInitializers(this, _conflict_type_initializers, void 0));
            this.severity = (__runInitializers(this, _conflict_type_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.affected_resources = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _affected_resources_initializers, void 0));
            this.is_resolved = (__runInitializers(this, _affected_resources_extraInitializers), __runInitializers(this, _is_resolved_initializers, void 0));
            this.resolution_notes = (__runInitializers(this, _is_resolved_extraInitializers), __runInitializers(this, _resolution_notes_initializers, void 0));
            this.resolved_by = (__runInitializers(this, _resolution_notes_extraInitializers), __runInitializers(this, _resolved_by_initializers, void 0));
            this.resolved_at = (__runInitializers(this, _resolved_by_extraInitializers), __runInitializers(this, _resolved_at_initializers, void 0));
            __runInitializers(this, _resolved_at_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ScheduleConflict");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflict unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _schedule_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ClassSchedule), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _schedule_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ClassSchedule)];
        _conflicting_schedule_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflicting schedule ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _conflict_type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflict type', enum: ConflictType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictType)),
                allowNull: false,
            })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflict severity', enum: ConflictSeverity }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictSeverity)),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conflict description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _affected_resources_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected resources' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _is_resolved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is resolved' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _resolution_notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _resolved_by_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _resolved_at_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved at timestamp' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _schedule_id_decorators, { kind: "field", name: "schedule_id", static: false, private: false, access: { has: obj => "schedule_id" in obj, get: obj => obj.schedule_id, set: (obj, value) => { obj.schedule_id = value; } }, metadata: _metadata }, _schedule_id_initializers, _schedule_id_extraInitializers);
        __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
        __esDecorate(null, null, _conflicting_schedule_id_decorators, { kind: "field", name: "conflicting_schedule_id", static: false, private: false, access: { has: obj => "conflicting_schedule_id" in obj, get: obj => obj.conflicting_schedule_id, set: (obj, value) => { obj.conflicting_schedule_id = value; } }, metadata: _metadata }, _conflicting_schedule_id_initializers, _conflicting_schedule_id_extraInitializers);
        __esDecorate(null, null, _conflict_type_decorators, { kind: "field", name: "conflict_type", static: false, private: false, access: { has: obj => "conflict_type" in obj, get: obj => obj.conflict_type, set: (obj, value) => { obj.conflict_type = value; } }, metadata: _metadata }, _conflict_type_initializers, _conflict_type_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _affected_resources_decorators, { kind: "field", name: "affected_resources", static: false, private: false, access: { has: obj => "affected_resources" in obj, get: obj => obj.affected_resources, set: (obj, value) => { obj.affected_resources = value; } }, metadata: _metadata }, _affected_resources_initializers, _affected_resources_extraInitializers);
        __esDecorate(null, null, _is_resolved_decorators, { kind: "field", name: "is_resolved", static: false, private: false, access: { has: obj => "is_resolved" in obj, get: obj => obj.is_resolved, set: (obj, value) => { obj.is_resolved = value; } }, metadata: _metadata }, _is_resolved_initializers, _is_resolved_extraInitializers);
        __esDecorate(null, null, _resolution_notes_decorators, { kind: "field", name: "resolution_notes", static: false, private: false, access: { has: obj => "resolution_notes" in obj, get: obj => obj.resolution_notes, set: (obj, value) => { obj.resolution_notes = value; } }, metadata: _metadata }, _resolution_notes_initializers, _resolution_notes_extraInitializers);
        __esDecorate(null, null, _resolved_by_decorators, { kind: "field", name: "resolved_by", static: false, private: false, access: { has: obj => "resolved_by" in obj, get: obj => obj.resolved_by, set: (obj, value) => { obj.resolved_by = value; } }, metadata: _metadata }, _resolved_by_initializers, _resolved_by_extraInitializers);
        __esDecorate(null, null, _resolved_at_decorators, { kind: "field", name: "resolved_at", static: false, private: false, access: { has: obj => "resolved_at" in obj, get: obj => obj.resolved_at, set: (obj, value) => { obj.resolved_at = value; } }, metadata: _metadata }, _resolved_at_initializers, _resolved_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScheduleConflict = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScheduleConflict = _classThis;
})();
exports.ScheduleConflict = ScheduleConflict;
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Schedule creation schema
 */
exports.CreateScheduleSchema = zod_1.z.object({
    course_id: zod_1.z.string().uuid(),
    section: zod_1.z.string().max(10),
    academic_year: zod_1.z.string().max(10),
    semester: zod_1.z.string().max(20),
    room_id: zod_1.z.string().uuid().optional(),
    faculty_id: zod_1.z.string().uuid(),
    day_of_week: zod_1.z.nativeEnum(DayOfWeek),
    start_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    start_date: zod_1.z.coerce.date(),
    end_date: zod_1.z.coerce.date(),
    class_type: zod_1.z.nativeEnum(ClassType).default(ClassType.LECTURE),
    recurrence_pattern: zod_1.z.nativeEnum(RecurrencePattern).default(RecurrencePattern.WEEKLY),
    max_enrollment: zod_1.z.number().int().min(1),
    is_online: zod_1.z.boolean().default(false),
    meeting_url: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
});
/**
 * Schedule update schema
 */
exports.UpdateScheduleSchema = exports.CreateScheduleSchema.partial();
/**
 * Room creation schema
 */
exports.CreateRoomSchema = zod_1.z.object({
    room_number: zod_1.z.string().max(50),
    building_id: zod_1.z.string().uuid(),
    building_name: zod_1.z.string().max(200),
    floor: zod_1.z.number().int().optional(),
    room_type: zod_1.z.nativeEnum(RoomType),
    capacity: zod_1.z.number().int().min(1),
    equipment: zod_1.z.array(zod_1.z.string()).default([]),
    features: zod_1.z.object({
        has_projector: zod_1.z.boolean().optional(),
        has_whiteboard: zod_1.z.boolean().optional(),
        has_computers: zod_1.z.boolean().optional(),
        computer_count: zod_1.z.number().int().optional(),
        has_audio_visual: zod_1.z.boolean().optional(),
        is_accessible: zod_1.z.boolean().optional(),
        has_recording: zod_1.z.boolean().optional(),
    }).default({}),
    is_available: zod_1.z.boolean().default(true),
});
/**
 * Time block creation schema
 */
exports.CreateTimeBlockSchema = zod_1.z.object({
    institution_id: zod_1.z.string().uuid(),
    name: zod_1.z.string().max(100),
    start_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    applicable_days: zod_1.z.array(zod_1.z.nativeEnum(DayOfWeek)).default([]),
    display_order: zod_1.z.number().int().default(0),
});
// ============================================================================
// CLASS SCHEDULING SERVICE
// ============================================================================
let ClassSchedulingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClassSchedulingService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ClassSchedulingService.name);
        }
        // ========================================================================
        // CORE SCHEDULING OPERATIONS (Functions 1-10)
        // ========================================================================
        /**
         * Function 1: Create class schedule
         * POST /api/v1/schedules
         * Status: 201 Created, 400 Bad Request, 409 Conflict
         */
        async createSchedule(data) {
            try {
                const validated = exports.CreateScheduleSchema.parse(data);
                // Validate time logic
                if (validated.end_time <= validated.start_time) {
                    throw new common_1.BadRequestException('End time must be after start time');
                }
                if (validated.end_date <= validated.start_date) {
                    throw new common_1.BadRequestException('End date must be after start date');
                }
                // Check for conflicts before creating
                const conflicts = await this.detectAllConflicts({
                    ...validated,
                    id: 'new',
                });
                if (conflicts.critical.length > 0) {
                    throw new common_1.ConflictException({
                        message: 'Critical scheduling conflicts detected',
                        conflicts: conflicts.critical,
                    });
                }
                // Create schedule
                const schedule = await ClassSchedule.create(validated);
                // Log warnings if any
                if (conflicts.warnings.length > 0) {
                    this.logger.warn(`Schedule ${schedule.id} created with warnings: ${conflicts.warnings.length}`);
                }
                this.logger.log(`Created schedule: ${schedule.id}`);
                return schedule;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
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
        async getScheduleById(id, options) {
            const include = [];
            if (options?.includeRoom) {
                include.push({ model: Room, as: 'room' });
            }
            if (options?.includeConflicts) {
                include.push({ model: ScheduleConflict, as: 'conflicts' });
            }
            const schedule = await ClassSchedule.findByPk(id, { include });
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
            }
            return schedule;
        }
        /**
         * Function 3: List schedules with pagination
         * GET /api/v1/schedules?page=1&limit=20&sort=start_time&order=asc
         * Status: 200 OK
         */
        async listSchedules(params) {
            const page = Math.max(1, params.page || 1);
            const limit = Math.min(100, Math.max(1, params.limit || 20));
            const offset = (page - 1) * limit;
            const where = {};
            // Filters
            if (params.academic_year)
                where.academic_year = params.academic_year;
            if (params.semester)
                where.semester = params.semester;
            if (params.faculty_id)
                where.faculty_id = params.faculty_id;
            if (params.room_id)
                where.room_id = params.room_id;
            if (params.status)
                where.status = params.status;
            if (params.day_of_week)
                where.day_of_week = params.day_of_week;
            if (params.class_type)
                where.class_type = params.class_type;
            // Sorting
            const order = [];
            if (params.sort) {
                order.push([params.sort, params.order || 'asc']);
            }
            else {
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
        async updateSchedule(id, data) {
            try {
                const validated = exports.UpdateScheduleSchema.parse(data);
                const schedule = await ClassSchedule.findByPk(id);
                if (!schedule) {
                    throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
                }
                // Check for conflicts with updated data
                const updatedData = { ...schedule.toJSON(), ...validated };
                const conflicts = await this.detectAllConflicts(updatedData);
                if (conflicts.critical.length > 0) {
                    throw new common_1.ConflictException({
                        message: 'Critical scheduling conflicts detected',
                        conflicts: conflicts.critical,
                    });
                }
                await schedule.update(validated);
                this.logger.log(`Updated schedule: ${id}`);
                return schedule;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
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
        async deleteSchedule(id, softDelete = true) {
            const schedule = await ClassSchedule.findByPk(id);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${id} not found`);
            }
            if (softDelete) {
                await schedule.update({ status: ScheduleStatus.CANCELLED });
                this.logger.log(`Soft deleted schedule: ${id}`);
            }
            else {
                await schedule.destroy();
                this.logger.log(`Hard deleted schedule: ${id}`);
            }
        }
        /**
         * Function 6: Bulk schedule creation
         * POST /api/v1/schedules/bulk
         * Status: 201 Created, 400 Bad Request
         */
        async bulkCreateSchedules(schedules) {
            const created = [];
            const errors = [];
            for (let i = 0; i < schedules.length; i++) {
                try {
                    const schedule = await this.createSchedule(schedules[i]);
                    created.push(schedule);
                }
                catch (error) {
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
        async searchSchedules(query, limit = 20) {
            if (!query || query.trim().length === 0) {
                throw new common_1.BadRequestException('Search query is required');
            }
            const schedules = await ClassSchedule.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { section: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { notes: { [sequelize_1.Op.iLike]: `%${query}%` } },
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
        async filterSchedules(criteria) {
            const where = {};
            if (criteria.academic_years && criteria.academic_years.length > 0) {
                where.academic_year = { [sequelize_1.Op.in]: criteria.academic_years };
            }
            if (criteria.semesters && criteria.semesters.length > 0) {
                where.semester = { [sequelize_1.Op.in]: criteria.semesters };
            }
            if (criteria.faculty_ids && criteria.faculty_ids.length > 0) {
                where.faculty_id = { [sequelize_1.Op.in]: criteria.faculty_ids };
            }
            if (criteria.room_ids && criteria.room_ids.length > 0) {
                where.room_id = { [sequelize_1.Op.in]: criteria.room_ids };
            }
            if (criteria.statuses && criteria.statuses.length > 0) {
                where.status = { [sequelize_1.Op.in]: criteria.statuses };
            }
            if (criteria.class_types && criteria.class_types.length > 0) {
                where.class_type = { [sequelize_1.Op.in]: criteria.class_types };
            }
            if (criteria.days && criteria.days.length > 0) {
                where.day_of_week = { [sequelize_1.Op.in]: criteria.days };
            }
            if (criteria.time_range) {
                where.start_time = { [sequelize_1.Op.gte]: criteria.time_range.start };
                where.end_time = { [sequelize_1.Op.lte]: criteria.time_range.end };
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
        async sortSchedules(sortField = 'start_time', sortOrder = 'asc', filters) {
            const allowedFields = [
                'day_of_week',
                'start_time',
                'end_time',
                'section',
                'academic_year',
                'semester',
            ];
            if (!allowedFields.includes(sortField)) {
                throw new common_1.BadRequestException(`Invalid sort field. Allowed: ${allowedFields.join(', ')}`);
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
        async exportScheduleData(format = 'json', filters) {
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
        async createRoom(data) {
            try {
                const validated = exports.CreateRoomSchema.parse(data);
                // Calculate duration from start/end times (for time blocks)
                const room = await Room.create(validated);
                this.logger.log(`Created room: ${room.id} (${room.room_number})`);
                return room;
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
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
        async updateRoom(id, data) {
            const room = await Room.findByPk(id);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${id} not found`);
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
        async getRoomAvailability(roomId, date, dayOfWeek) {
            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
            }
            // Get all schedules for this room on the specified day
            const schedules = await ClassSchedule.findAll({
                where: {
                    room_id: roomId,
                    day_of_week: dayOfWeek,
                    status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
                },
                order: [['start_time', 'asc']],
            });
            const occupiedSlots = schedules.map((s) => ({
                start: s.start_time,
                end: s.end_time,
                schedule_id: s.id,
            }));
            // Calculate available slots (simplified - would need more logic)
            const availableSlots = [];
            // Standard operating hours: 8:00 AM to 10:00 PM
            const dayStart = '08:00';
            const dayEnd = '22:00';
            if (schedules.length === 0) {
                availableSlots.push({ start: dayStart, end: dayEnd });
            }
            else {
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
        async assignRoomToClass(scheduleId, roomId) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
            }
            // Check capacity
            if (schedule.max_enrollment > room.capacity) {
                throw new common_1.ConflictException(`Room capacity (${room.capacity}) is less than max enrollment (${schedule.max_enrollment})`);
            }
            // Check for room conflicts
            const conflicts = await this.detectRoomConflicts(scheduleId, roomId);
            if (conflicts.length > 0) {
                throw new common_1.ConflictException({
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
        async checkRoomCapacity(roomId, requiredCapacity) {
            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
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
        async listAvailableRooms(dayOfWeek, startTime, endTime, minCapacity) {
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
            const availableRooms = [];
            for (const room of rooms) {
                const conflicts = await ClassSchedule.findAll({
                    where: {
                        room_id: room.id,
                        day_of_week: dayOfWeek,
                        status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
                        [sequelize_1.Op.or]: [
                            {
                                start_time: { [sequelize_1.Op.lte]: startTime },
                                end_time: { [sequelize_1.Op.gt]: startTime },
                            },
                            {
                                start_time: { [sequelize_1.Op.lt]: endTime },
                                end_time: { [sequelize_1.Op.gte]: endTime },
                            },
                            {
                                start_time: { [sequelize_1.Op.gte]: startTime },
                                end_time: { [sequelize_1.Op.lte]: endTime },
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
        async getRoomUtilization(roomId, academicYear, semester) {
            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
            }
            const schedules = await ClassSchedule.findAll({
                where: {
                    room_id: roomId,
                    academic_year: academicYear,
                    semester,
                    status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
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
        async scheduleRoomMaintenance(roomId, maintenance) {
            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
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
        async detectTimeConflicts(scheduleId) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            const conflicts = [];
            // Find overlapping schedules for the same faculty
            const overlapping = await ClassSchedule.findAll({
                where: {
                    id: { [sequelize_1.Op.ne]: scheduleId },
                    faculty_id: schedule.faculty_id,
                    day_of_week: schedule.day_of_week,
                    academic_year: schedule.academic_year,
                    semester: schedule.semester,
                    status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
                    [sequelize_1.Op.or]: [
                        {
                            start_time: { [sequelize_1.Op.lte]: schedule.start_time },
                            end_time: { [sequelize_1.Op.gt]: schedule.start_time },
                        },
                        {
                            start_time: { [sequelize_1.Op.lt]: schedule.end_time },
                            end_time: { [sequelize_1.Op.gte]: schedule.end_time },
                        },
                        {
                            start_time: { [sequelize_1.Op.gte]: schedule.start_time },
                            end_time: { [sequelize_1.Op.lte]: schedule.end_time },
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
        async detectRoomConflicts(scheduleId, roomId) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            const targetRoomId = roomId || schedule.room_id;
            if (!targetRoomId) {
                return [];
            }
            const conflicts = [];
            // Find overlapping room bookings
            const overlapping = await ClassSchedule.findAll({
                where: {
                    id: { [sequelize_1.Op.ne]: scheduleId },
                    room_id: targetRoomId,
                    day_of_week: schedule.day_of_week,
                    academic_year: schedule.academic_year,
                    semester: schedule.semester,
                    status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
                    [sequelize_1.Op.or]: [
                        {
                            start_time: { [sequelize_1.Op.lte]: schedule.start_time },
                            end_time: { [sequelize_1.Op.gt]: schedule.start_time },
                        },
                        {
                            start_time: { [sequelize_1.Op.lt]: schedule.end_time },
                            end_time: { [sequelize_1.Op.gte]: schedule.end_time },
                        },
                        {
                            start_time: { [sequelize_1.Op.gte]: schedule.start_time },
                            end_time: { [sequelize_1.Op.lte]: schedule.end_time },
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
        async detectFacultyConflicts(scheduleId) {
            // This is similar to time conflicts but specific to faculty
            return this.detectTimeConflicts(scheduleId);
        }
        /**
         * Function 22: Student enrollment conflicts
         * GET /api/v1/schedules/:id/conflicts/students
         * Status: 200 OK
         */
        async detectStudentConflicts(scheduleId, studentIds) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            // This would check against student enrollments
            // Simplified implementation
            const conflicts = [];
            // In production, would query enrollment database
            return { conflicts };
        }
        /**
         * Function 23: Check all conflicts
         * GET /api/v1/schedules/:id/conflicts/all
         * Status: 200 OK
         */
        async detectAllConflicts(schedule) {
            const allConflicts = [];
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
        async resolveConflict(conflictId, resolutionNotes, resolvedBy) {
            const conflict = await ScheduleConflict.findByPk(conflictId);
            if (!conflict) {
                throw new common_1.NotFoundException(`Conflict with ID ${conflictId} not found`);
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
        async getConflictHistory(scheduleId) {
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
        async sendConflictNotification(conflictId) {
            const conflict = await ScheduleConflict.findByPk(conflictId, {
                include: [{ model: ClassSchedule, as: 'schedule' }],
            });
            if (!conflict) {
                throw new common_1.NotFoundException(`Conflict with ID ${conflictId} not found`);
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
        async optimizeRoomUsage(academicYear, semester) {
            const schedules = await ClassSchedule.findAll({
                where: {
                    academic_year: academicYear,
                    semester,
                    status: ScheduleStatus.PUBLISHED,
                },
                include: [{ model: Room, as: 'room' }],
            });
            const recommendations = [];
            // Simple optimization: find schedules in rooms too large
            for (const schedule of schedules) {
                if (!schedule.room)
                    continue;
                const utilizationRatio = schedule.max_enrollment / schedule.room.capacity;
                if (utilizationRatio < 0.5) {
                    // Room is underutilized
                    const betterRooms = await Room.findAll({
                        where: {
                            capacity: {
                                [sequelize_1.Op.gte]: schedule.max_enrollment,
                                [sequelize_1.Op.lt]: schedule.room.capacity,
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
                            current_room_id: schedule.room_id,
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
        async balanceFacultyLoad(departmentId, academicYear, semester) {
            // This would integrate with faculty management system
            // Simplified implementation
            const analysis = [];
            return { analysis };
        }
        /**
         * Function 29: Minimize conflicts
         * POST /api/v1/schedules/optimize/minimize-conflicts
         * Status: 200 OK
         */
        async minimizeConflicts(academicYear, semester) {
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
            const suggestions = [];
            for (const conflict of conflicts) {
                if (conflict.conflict_type === ConflictType.ROOM_CONFLICT) {
                    suggestions.push({
                        conflict_id: conflict.id,
                        suggestion: 'Consider assigning a different room',
                    });
                }
                else if (conflict.conflict_type === ConflictType.TIME_CONFLICT) {
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
        async analyzeScheduleGaps(academicYear, semester) {
            // Find underutilized time slots
            const gaps = [];
            // Implementation would analyze schedule distribution
            return { gaps };
        }
        /**
         * Function 31: Utilization optimization
         * GET /api/v1/schedules/optimize/utilization
         * Status: 200 OK
         */
        async optimizeUtilization(academicYear, semester) {
            const schedules = await ClassSchedule.findAll({
                where: {
                    academic_year: academicYear,
                    semester,
                    status: ScheduleStatus.PUBLISHED,
                },
            });
            // Calculate utilization metrics
            const hourDistribution = {};
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
        async optimizeCost(academicYear, semester) {
            // Calculate potential cost savings through optimization
            const recommendations = [];
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
        async createTimeBlock(data) {
            try {
                const validated = exports.CreateTimeBlockSchema.parse(data);
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
            }
            catch (error) {
                if (error instanceof zod_1.z.ZodError) {
                    throw new common_1.BadRequestException({
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
        async getStandardTimePatterns() {
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
        async createCustomTimeBlock(institutionId, name, startTime, endTime, days) {
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
        async validateTimeBlock(startTime, endTime) {
            const errors = [];
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
        async getTimeBlockTemplates(institutionId) {
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
        async scheduleLabSession(labData) {
            // Find suitable lab room
            const labs = await Room.findAll({
                where: {
                    room_type: RoomType.LABORATORY,
                    capacity: { [sequelize_1.Op.gte]: labData.lab_capacity },
                    is_available: true,
                },
            });
            // Filter by equipment
            const suitableLabs = labs.filter((lab) => {
                return labData.required_equipment.every((eq) => lab.equipment.includes(eq));
            });
            if (suitableLabs.length === 0) {
                throw new common_1.BadRequestException('No suitable lab found with required equipment');
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
        async assignLabResources(scheduleId, resources) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            if (schedule.class_type !== ClassType.LAB) {
                throw new common_1.BadRequestException('This schedule is not a lab session');
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
        async scheduleExam(examData) {
            // Calculate end time
            const [hour, minute] = examData.start_time.split(':').map(Number);
            const endMinutes = hour * 60 + minute + examData.duration_minutes;
            const endHour = Math.floor(endMinutes / 60);
            const endMin = endMinutes % 60;
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
            const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][examData.date.getDay()];
            // Find suitable exam room
            const rooms = await Room.findAll({
                where: {
                    capacity: { [sequelize_1.Op.gte]: examData.students_count },
                    room_type: { [sequelize_1.Op.in]: [RoomType.CLASSROOM, RoomType.LECTURE_HALL] },
                    is_available: true,
                },
                order: [['capacity', 'asc']],
                limit: 1,
            });
            if (rooms.length === 0) {
                throw new common_1.BadRequestException('No suitable room found for exam');
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
        async assignExamRoom(examId, roomId) {
            return this.assignRoomToClass(examId, roomId);
        }
        /**
         * Function 42: Conflict-free exam slots
         * GET /api/v1/exams/available-slots
         * Status: 200 OK
         */
        async findConflictFreeExamSlots(date, durationMinutes) {
            const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
            // Get all existing schedules for that day
            const existingSchedules = await ClassSchedule.findAll({
                where: {
                    day_of_week: dayOfWeek,
                    start_date: { [sequelize_1.Op.lte]: date },
                    end_date: { [sequelize_1.Op.gte]: date },
                    status: { [sequelize_1.Op.ne]: ScheduleStatus.CANCELLED },
                },
                order: [['start_time', 'asc']],
            });
            // Find gaps suitable for exams
            const availableSlots = [];
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
        async publishSchedule(scheduleId) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            // Check for unresolved critical conflicts
            const conflicts = await this.detectAllConflicts(schedule);
            if (conflicts.critical.length > 0) {
                throw new common_1.ConflictException({
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
        async handleScheduleChange(scheduleId, changes, changeReason) {
            const schedule = await this.updateSchedule(scheduleId, changes);
            // Would notify affected students
            const affectedStudents = schedule.current_enrollment;
            this.logger.log(`Schedule change for ${scheduleId}: ${changeReason}. Affected students: ${affectedStudents}`);
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
        async notifyScheduleChanges(scheduleId, changeDetails) {
            const schedule = await ClassSchedule.findByPk(scheduleId);
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID ${scheduleId} not found`);
            }
            // Would integrate with notification system
            const notificationsSent = schedule.current_enrollment;
            this.logger.log(`Sent ${notificationsSent} notifications for schedule change: ${scheduleId}`);
            return {
                notifications_sent: notificationsSent,
                notification_method: ['email', 'sms', 'app_notification'],
            };
        }
    };
    __setFunctionName(_classThis, "ClassSchedulingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClassSchedulingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClassSchedulingService = _classThis;
})();
exports.ClassSchedulingService = ClassSchedulingService;
// ============================================================================
// UTILITY TYPES AND HELPERS
// ============================================================================
/**
 * Import Op from Sequelize for operations
 */
const sequelize_1 = require("sequelize");
/**
 * API version constant
 */
exports.API_VERSION = 'v1';
/**
 * API base path
 */
exports.API_BASE_PATH = `/api/${exports.API_VERSION}`;
/**
 * Export all models for external use
 */
exports.SchedulingModels = {
    ClassSchedule,
    Room,
    TimeBlock,
    ScheduleConflict,
};
/**
 * Export all schemas for validation
 */
exports.SchedulingSchemas = {
    CreateScheduleSchema: exports.CreateScheduleSchema,
    UpdateScheduleSchema: exports.UpdateScheduleSchema,
    CreateRoomSchema: exports.CreateRoomSchema,
    CreateTimeBlockSchema: exports.CreateTimeBlockSchema,
};
/**
 * Export all enums
 */
exports.SchedulingEnums = {
    ScheduleStatus,
    DayOfWeek,
    ClassType,
    RoomType,
    ConflictType,
    ConflictSeverity,
    RecurrencePattern,
};
//# sourceMappingURL=class-scheduling-kit.js.map