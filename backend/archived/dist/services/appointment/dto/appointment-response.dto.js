"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentStatisticsDto = exports.AppointmentListResponseDto = exports.AppointmentSummaryDto = exports.AppointmentResponseDto = exports.StudentSummaryDto = void 0;
exports.mapAppointmentToResponseDto = mapAppointmentToResponseDto;
exports.mapAppointmentToSummaryDto = mapAppointmentToSummaryDto;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const paginated_response_dto_1 = require("../../../common/dto/paginated-response.dto");
const create_appointment_dto_1 = require("./create-appointment.dto");
const update_appointment_dto_1 = require("./update-appointment.dto");
const user_response_dto_1 = require("../../user/dto/user-response.dto");
let StudentSummaryDto = class StudentSummaryDto {
    id;
    firstName;
    lastName;
    gradeLevel;
    studentId;
    dateOfBirth;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, gradeLevel: { required: false, type: () => String }, studentId: { required: false, type: () => String }, dateOfBirth: { required: false, type: () => Date } };
    }
};
exports.StudentSummaryDto = StudentSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'John',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "firstName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student grade level',
        example: '10',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student identification number',
        example: 'STU-2024-001',
    }),
    __metadata("design:type", String)
], StudentSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student date of birth',
        example: '2010-05-15T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], StudentSummaryDto.prototype, "dateOfBirth", void 0);
exports.StudentSummaryDto = StudentSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], StudentSummaryDto);
let AppointmentResponseDto = class AppointmentResponseDto {
    id;
    studentId;
    nurseId;
    type;
    scheduledAt;
    duration;
    status;
    reason;
    notes;
    recurringGroupId;
    recurringFrequency;
    recurringEndDate;
    isUpcoming;
    isToday;
    minutesUntil;
    student;
    nurse;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, nurseId: { required: true, type: () => String }, type: { required: true, enum: require("./create-appointment.dto").AppointmentType }, scheduledAt: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, status: { required: true, enum: require("./update-appointment.dto").AppointmentStatus }, reason: { required: true, type: () => String }, notes: { required: false, type: () => String, nullable: true }, recurringGroupId: { required: false, type: () => String, nullable: true }, recurringFrequency: { required: false, type: () => String, nullable: true }, recurringEndDate: { required: false, type: () => Date, nullable: true }, isUpcoming: { required: true, type: () => Boolean }, isToday: { required: true, type: () => Boolean }, minutesUntil: { required: true, type: () => Number }, student: { required: false, type: () => require("./appointment-response.dto").StudentSummaryDto, nullable: true }, nurse: { required: false, type: () => require("../../user/dto/user-response.dto").UserResponseDto, nullable: true }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AppointmentResponseDto = AppointmentResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Unique appointment identifier (UUID v4)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID - references the patient for this appointment',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nurse/healthcare provider UUID - assigned staff member',
        example: 'abc12345-6789-0def-ghij-klmnopqrstuv',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "nurseId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Type of appointment being conducted',
        enum: create_appointment_dto_1.AppointmentType,
        enumName: 'AppointmentType',
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
        examples: {
            routine: {
                value: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
                description: 'Regular scheduled health checkup',
            },
            medication: {
                value: create_appointment_dto_1.AppointmentType.MEDICATION_ADMINISTRATION,
                description: 'Medication administration or prescription refill',
            },
            injury: {
                value: create_appointment_dto_1.AppointmentType.INJURY_ASSESSMENT,
                description: 'Assessment of physical injury',
            },
            illness: {
                value: create_appointment_dto_1.AppointmentType.ILLNESS_EVALUATION,
                description: 'Evaluation of illness symptoms',
            },
            followUp: {
                value: create_appointment_dto_1.AppointmentType.FOLLOW_UP,
                description: 'Follow-up appointment for previous visit',
            },
            screening: {
                value: create_appointment_dto_1.AppointmentType.SCREENING,
                description: 'Health screening (vision, hearing, etc.)',
            },
            emergency: {
                value: create_appointment_dto_1.AppointmentType.EMERGENCY,
                description: 'Urgent or emergency care',
            },
        },
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time for the appointment (ISO 8601 format)',
        example: '2025-11-15T10:30:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AppointmentResponseDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Duration of appointment in minutes. Must be between 15 and 120 minutes. Default is 30 minutes.',
        example: 30,
        minimum: 15,
        maximum: 120,
        default: 30,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AppointmentResponseDto.prototype, "duration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Current status of the appointment in its lifecycle',
        enum: update_appointment_dto_1.AppointmentStatus,
        enumName: 'AppointmentStatus',
        example: update_appointment_dto_1.AppointmentStatus.SCHEDULED,
        examples: {
            scheduled: {
                value: update_appointment_dto_1.AppointmentStatus.SCHEDULED,
                description: 'Appointment is scheduled and confirmed',
            },
            inProgress: {
                value: update_appointment_dto_1.AppointmentStatus.IN_PROGRESS,
                description: 'Appointment is currently in progress',
            },
            completed: {
                value: update_appointment_dto_1.AppointmentStatus.COMPLETED,
                description: 'Appointment has been completed',
            },
            cancelled: {
                value: update_appointment_dto_1.AppointmentStatus.CANCELLED,
                description: 'Appointment was cancelled',
            },
            noShow: {
                value: update_appointment_dto_1.AppointmentStatus.NO_SHOW,
                description: 'Student did not show up for the appointment',
            },
        },
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the appointment. Must be between 3 and 500 characters.',
        example: 'Annual physical examination and immunization review',
        minLength: 3,
        maxLength: 500,
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "reason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes or instructions for the appointment. Maximum 5000 characters.',
        example: 'Student has documented fear of needles. Please use distraction techniques and provide extra reassurance.',
        maxLength: 5000,
        nullable: true,
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Recurring group identifier - groups related recurring appointments together',
        example: 'rec-123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
        nullable: true,
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "recurringGroupId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Frequency of recurring appointments (DAILY, WEEKLY, MONTHLY, YEARLY)',
        example: 'WEEKLY',
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        nullable: true,
    }),
    __metadata("design:type", String)
], AppointmentResponseDto.prototype, "recurringFrequency", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for recurring appointments - recurring instances stop after this date',
        example: '2026-06-30T00:00:00.000Z',
        type: 'string',
        format: 'date-time',
        nullable: true,
    }),
    __metadata("design:type", Date)
], AppointmentResponseDto.prototype, "recurringEndDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Virtual field: Indicates if appointment is upcoming (scheduled in the future and not cancelled/completed)',
        example: true,
        type: 'boolean',
    }),
    __metadata("design:type", Boolean)
], AppointmentResponseDto.prototype, "isUpcoming", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "Virtual field: Indicates if appointment is scheduled for today's date",
        example: false,
        type: 'boolean',
    }),
    __metadata("design:type", Boolean)
], AppointmentResponseDto.prototype, "isToday", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Virtual field: Number of minutes until appointment. Negative if appointment is in the past.',
        example: 1440,
        type: 'integer',
    }),
    __metadata("design:type", Number)
], AppointmentResponseDto.prototype, "minutesUntil", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated student information (when included)',
        type: () => StudentSummaryDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => StudentSummaryDto),
    __metadata("design:type", StudentSummaryDto)
], AppointmentResponseDto.prototype, "student", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated nurse/healthcare provider information (when included)',
        type: () => user_response_dto_1.UserResponseDto,
        nullable: true,
    }),
    (0, class_transformer_1.Type)(() => user_response_dto_1.UserResponseDto),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], AppointmentResponseDto.prototype, "nurse", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the appointment record was created',
        example: '2025-11-14T08:00:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AppointmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the appointment record was last updated',
        example: '2025-11-14T09:30:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AppointmentResponseDto.prototype, "updatedAt", void 0);
exports.AppointmentResponseDto = AppointmentResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], AppointmentResponseDto);
let AppointmentSummaryDto = class AppointmentSummaryDto {
    id;
    studentId;
    nurseId;
    type;
    scheduledAt;
    duration;
    status;
    reason;
    studentName;
    nurseName;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, nurseId: { required: true, type: () => String }, type: { required: true, enum: require("./create-appointment.dto").AppointmentType }, scheduledAt: { required: true, type: () => Date }, duration: { required: true, type: () => Number }, status: { required: true, enum: require("./update-appointment.dto").AppointmentStatus }, reason: { required: true, type: () => String }, studentName: { required: false, type: () => String, nullable: true }, nurseName: { required: false, type: () => String, nullable: true } };
    }
};
exports.AppointmentSummaryDto = AppointmentSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Appointment UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '987fcdeb-51a2-43d1-b456-426614174001',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nurse UUID',
        example: 'abc12345-6789-0def-ghij-klmnopqrstuv',
        format: 'uuid',
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "nurseId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Appointment type',
        enum: create_appointment_dto_1.AppointmentType,
        example: create_appointment_dto_1.AppointmentType.ROUTINE_CHECKUP,
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time',
        example: '2025-11-15T10:30:00.000Z',
        type: 'string',
        format: 'date-time',
    }),
    __metadata("design:type", Date)
], AppointmentSummaryDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Duration in minutes',
        example: 30,
        minimum: 15,
        maximum: 120,
    }),
    __metadata("design:type", Number)
], AppointmentSummaryDto.prototype, "duration", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Appointment status',
        enum: update_appointment_dto_1.AppointmentStatus,
        example: update_appointment_dto_1.AppointmentStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Reason for appointment',
        example: 'Annual physical examination',
        maxLength: 500,
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "reason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student first and last name (when included)',
        example: 'John Doe',
        nullable: true,
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "studentName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nurse first and last name (when included)',
        example: 'Jane Smith',
        nullable: true,
    }),
    __metadata("design:type", String)
], AppointmentSummaryDto.prototype, "nurseName", void 0);
exports.AppointmentSummaryDto = AppointmentSummaryDto = __decorate([
    (0, class_transformer_1.Exclude)()
], AppointmentSummaryDto);
class AppointmentListResponseDto extends paginated_response_dto_1.PaginatedResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./appointment-response.dto").AppointmentResponseDto] } };
    }
}
exports.AppointmentListResponseDto = AppointmentListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of appointments for the current page',
        type: [AppointmentResponseDto],
        isArray: true,
    }),
    (0, class_transformer_1.Type)(() => AppointmentResponseDto),
    __metadata("design:type", Array)
], AppointmentListResponseDto.prototype, "data", void 0);
class AppointmentStatisticsDto {
    totalAppointments;
    scheduledCount;
    completedCount;
    cancelledCount;
    noShowCount;
    inProgressCount;
    todayCount;
    upcomingCount;
    completionRate;
    noShowRate;
    cancellationRate;
    averageDuration;
    byType;
    byStatus;
    monthlyTrend;
    busiestHours;
    static _OPENAPI_METADATA_FACTORY() {
        return { totalAppointments: { required: true, type: () => Number }, scheduledCount: { required: true, type: () => Number }, completedCount: { required: true, type: () => Number }, cancelledCount: { required: true, type: () => Number }, noShowCount: { required: true, type: () => Number }, inProgressCount: { required: true, type: () => Number }, todayCount: { required: true, type: () => Number }, upcomingCount: { required: true, type: () => Number }, completionRate: { required: true, type: () => Number }, noShowRate: { required: true, type: () => Number }, cancellationRate: { required: true, type: () => Number }, averageDuration: { required: true, type: () => Number }, byType: { required: true, type: () => Object }, byStatus: { required: true, type: () => Object }, monthlyTrend: { required: false, nullable: true }, busiestHours: { required: false, type: () => Object, nullable: true } };
    }
}
exports.AppointmentStatisticsDto = AppointmentStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of appointments in the filtered dataset',
        example: 1500,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "totalAppointments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments with SCHEDULED status',
        example: 45,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "scheduledCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments with COMPLETED status',
        example: 1200,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "completedCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments with CANCELLED status',
        example: 180,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "cancelledCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments with NO_SHOW status',
        example: 75,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "noShowCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of appointments with IN_PROGRESS status',
        example: 3,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "inProgressCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Number of appointments scheduled for today's date",
        example: 12,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "todayCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of upcoming appointments (future dates with SCHEDULED or IN_PROGRESS status)',
        example: 45,
        type: 'integer',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "upcomingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of appointments completed successfully (completed / (total - cancelled))',
        example: 80.0,
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "completionRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of appointments where student did not show (no-shows / total)',
        example: 5.0,
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "noShowRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage of appointments that were cancelled (cancelled / total)',
        example: 12.0,
        type: 'number',
        format: 'float',
        minimum: 0,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "cancellationRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average duration of appointments in minutes across the filtered dataset',
        example: 32.5,
        type: 'number',
        format: 'float',
        minimum: 0,
    }),
    __metadata("design:type", Number)
], AppointmentStatisticsDto.prototype, "averageDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], AppointmentStatisticsDto.prototype, "byType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
    }),
    __metadata("design:type", Object)
], AppointmentStatisticsDto.prototype, "byStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
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
    }),
    __metadata("design:type", Array)
], AppointmentStatisticsDto.prototype, "monthlyTrend", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
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
    }),
    __metadata("design:type", Object)
], AppointmentStatisticsDto.prototype, "busiestHours", void 0);
function mapAppointmentToResponseDto(appointment) {
    if (!appointment) {
        throw new TypeError('Appointment parameter cannot be null or undefined');
    }
    const dto = new AppointmentResponseDto();
    dto.id = appointment.id;
    dto.studentId = appointment.studentId;
    dto.nurseId = appointment.nurseId;
    dto.type = appointment.type;
    dto.scheduledAt = appointment.scheduledAt;
    dto.duration = appointment.duration;
    dto.status = appointment.status;
    dto.reason = appointment.reason;
    dto.notes = appointment.notes ?? null;
    dto.recurringGroupId = appointment.recurringGroupId ?? null;
    dto.recurringFrequency = appointment.recurringFrequency ?? null;
    dto.recurringEndDate = appointment.recurringEndDate ?? null;
    dto.isUpcoming =
        appointment.scheduledAt > new Date() &&
            [update_appointment_dto_1.AppointmentStatus.SCHEDULED, update_appointment_dto_1.AppointmentStatus.IN_PROGRESS].includes(appointment.status);
    const today = new Date();
    const apptDate = new Date(appointment.scheduledAt);
    dto.isToday = apptDate.toDateString() === today.toDateString();
    dto.minutesUntil = Math.floor((appointment.scheduledAt.getTime() - Date.now()) / (1000 * 60));
    dto.createdAt = appointment.createdAt;
    dto.updatedAt = appointment.updatedAt;
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
        dto.nurse = appointment.nurse;
    }
    return dto;
}
function mapAppointmentToSummaryDto(appointment) {
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
    if (appointment.student) {
        dto.studentName = `${appointment.student.firstName} ${appointment.student.lastName}`;
    }
    if (appointment.nurse) {
        dto.nurseName = `${appointment.nurse.firstName} ${appointment.nurse.lastName}`;
    }
    return dto;
}
//# sourceMappingURL=appointment-response.dto.js.map