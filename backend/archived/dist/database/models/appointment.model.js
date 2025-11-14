"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = exports.AppointmentStatus = exports.AppointmentType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const sequelize_1 = require("sequelize");
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["ROUTINE_CHECKUP"] = "ROUTINE_CHECKUP";
    AppointmentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    AppointmentType["INJURY_ASSESSMENT"] = "INJURY_ASSESSMENT";
    AppointmentType["ILLNESS_EVALUATION"] = "ILLNESS_EVALUATION";
    AppointmentType["FOLLOW_UP"] = "FOLLOW_UP";
    AppointmentType["SCREENING"] = "SCREENING";
    AppointmentType["EMERGENCY"] = "EMERGENCY";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "SCHEDULED";
    AppointmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["NO_SHOW"] = "NO_SHOW";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
let Appointment = class Appointment extends sequelize_typescript_1.Model {
    studentId;
    nurseId;
    type;
    get appointmentType() {
        return this.type;
    }
    set appointmentType(value) {
        this.type = value;
    }
    scheduledAt;
    get appointmentDate() {
        return this.scheduledAt;
    }
    set appointmentDate(value) {
        this.scheduledAt = value;
    }
    duration;
    status;
    reason;
    notes;
    recurringGroupId;
    recurringFrequency;
    recurringEndDate;
    get isUpcoming() {
        return (this.scheduledAt > new Date() &&
            [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(this.status));
    }
    get isToday() {
        const today = new Date();
        const apptDate = new Date(this.scheduledAt);
        return apptDate.toDateString() === today.toDateString();
    }
    get minutesUntil() {
        return Math.floor((this.scheduledAt.getTime() - Date.now()) / (1000 * 60));
    }
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('Appointment', instance.id, action, changedFields, options?.transaction);
        }
    }
    static async validateScheduledDate(instance) {
        if (instance.status === AppointmentStatus.SCHEDULED &&
            instance.scheduledAt < new Date()) {
            throw new Error('Cannot schedule appointment in the past');
        }
    }
    static async validateRecurringData(instance) {
        if (instance.recurringGroupId && !instance.recurringFrequency) {
            throw new Error('Recurring appointments must have a frequency');
        }
        if (instance.recurringEndDate &&
            instance.recurringEndDate < instance.scheduledAt) {
            throw new Error('Recurring end date must be after scheduled date');
        }
    }
};
exports.Appointment = Appointment;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Foreign key to students table - appointment patient',
        references: {
            model: 'students',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], Appointment.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Foreign key to users table - assigned nurse',
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", String)
], Appointment.prototype, "nurseId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'nurseId',
        as: 'nurse',
        constraints: true,
    }),
    __metadata("design:type", Function)
], Appointment.prototype, "nurse", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
        constraints: true,
    }),
    __metadata("design:type", Function)
], Appointment.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AppointmentType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Appointment.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Appointment.prototype, "scheduledAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: {
            min: 15,
            max: 120,
        },
        comment: 'Duration in minutes',
    }),
    __metadata("design:type", Number)
], Appointment.prototype, "duration", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AppointmentStatus)],
        },
        allowNull: false,
        defaultValue: AppointmentStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
        validate: {
            len: [3, 500],
        },
    }),
    __metadata("design:type", String)
], Appointment.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        validate: {
            len: [0, 5000],
        },
    }),
    __metadata("design:type", String)
], Appointment.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Group ID for recurring appointments',
    }),
    __metadata("design:type", String)
], Appointment.prototype, "recurringGroupId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        comment: 'Frequency: DAILY, WEEKLY, MONTHLY, YEARLY',
    }),
    __metadata("design:type", String)
], Appointment.prototype, "recurringFrequency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'End date for recurring appointments',
    }),
    __metadata("design:type", Date)
], Appointment.prototype, "recurringEndDate", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./appointment-reminder.model').AppointmentReminder, {
        foreignKey: 'appointmentId',
        as: 'reminders'
    }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Array)
], Appointment.prototype, "reminders", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Appointment, Object]),
    __metadata("design:returntype", Promise)
], Appointment, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Appointment]),
    __metadata("design:returntype", Promise)
], Appointment, "validateScheduledDate", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Appointment]),
    __metadata("design:returntype", Promise)
], Appointment, "validateRecurringData", null);
exports.Appointment = Appointment = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        upcoming: {
            where: {
                scheduledAt: {
                    [sequelize_1.Op.gte]: new Date(),
                },
                status: {
                    [sequelize_1.Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
                },
            },
            order: [['scheduledAt', 'ASC']],
        },
        past: {
            where: {
                scheduledAt: {
                    [sequelize_1.Op.lt]: new Date(),
                },
            },
            order: [['scheduledAt', 'DESC']],
        },
        today: {
            where: {
                scheduledAt: {
                    [sequelize_1.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                    [sequelize_1.Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
            order: [['scheduledAt', 'ASC']],
        },
        byStatus: (status) => ({
            where: { status },
            order: [['scheduledAt', 'DESC']],
        }),
        byNurse: (nurseId) => ({
            where: { nurseId },
            order: [['scheduledAt', 'ASC']],
        }),
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['scheduledAt', 'DESC']],
        }),
        emergency: {
            where: {
                type: AppointmentType.EMERGENCY,
                status: {
                    [sequelize_1.Op.ne]: AppointmentStatus.CANCELLED,
                },
            },
            order: [['scheduledAt', 'DESC']],
        },
        recurring: {
            where: {
                recurringGroupId: {
                    [sequelize_1.Op.ne]: null,
                },
            },
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'appointments',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'scheduledAt'],
                name: 'idx_appointments_student_scheduled',
            },
            {
                fields: ['nurseId', 'scheduledAt'],
                name: 'idx_appointments_nurse_scheduled',
            },
            {
                fields: ['status', 'scheduledAt'],
                name: 'idx_appointments_status_scheduled',
            },
            {
                fields: ['studentId', 'status', 'scheduledAt'],
                name: 'idx_appointments_student_status_scheduled',
            },
            {
                fields: ['type', 'status', 'scheduledAt'],
                name: 'idx_appointments_type_status_scheduled',
            },
            {
                fields: ['recurringGroupId'],
                name: 'idx_appointments_recurring_group',
            },
            {
                fields: ['nurseId', 'scheduledAt', 'status'],
                name: 'idx_appointments_nurse_scheduled_status',
            },
            {
                fields: ['createdAt'],
                name: 'idx_appointments_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_appointments_updated_at',
            },
        ],
    })
], Appointment);
//# sourceMappingURL=appointment.model.js.map