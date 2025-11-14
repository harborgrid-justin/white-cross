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
exports.FollowUpAppointment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const follow_up_status_enum_1 = require("../../services/clinical/enums/follow-up-status.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let FollowUpAppointment = class FollowUpAppointment extends sequelize_typescript_1.Model {
    studentId;
    originalVisitId;
    scheduledBy;
    scheduledDate;
    durationMinutes;
    reason;
    type;
    status;
    assignedTo;
    reminderSent;
    reminderSentAt;
    confirmedAt;
    completedVisitId;
    completedAt;
    cancelledAt;
    cancellationReason;
    rescheduledFromId;
    rescheduledToId;
    notes;
    priority;
    isPast() {
        return new Date() > this.scheduledDate;
    }
    isUpcoming() {
        return (new Date() < this.scheduledDate &&
            (this.status === follow_up_status_enum_1.FollowUpStatus.SCHEDULED ||
                this.status === follow_up_status_enum_1.FollowUpStatus.CONFIRMED ||
                this.status === follow_up_status_enum_1.FollowUpStatus.REMINDED));
    }
    shouldSendReminder(reminderHours = 24) {
        if (this.reminderSent)
            return false;
        if (this.status !== follow_up_status_enum_1.FollowUpStatus.SCHEDULED)
            return false;
        const reminderTime = new Date(this.scheduledDate.getTime() - reminderHours * 60 * 60 * 1000);
        return new Date() >= reminderTime;
    }
    markReminderSent() {
        this.reminderSent = true;
        this.reminderSentAt = new Date();
        this.status = follow_up_status_enum_1.FollowUpStatus.REMINDED;
    }
    confirm() {
        this.status = follow_up_status_enum_1.FollowUpStatus.CONFIRMED;
        this.confirmedAt = new Date();
    }
    complete(visitId) {
        this.status = follow_up_status_enum_1.FollowUpStatus.COMPLETED;
        this.completedAt = new Date();
        this.completedVisitId = visitId;
    }
    cancel(reason) {
        this.status = follow_up_status_enum_1.FollowUpStatus.CANCELLED;
        this.cancelledAt = new Date();
        this.cancellationReason = reason;
    }
    getEndTime() {
        return new Date(this.scheduledDate.getTime() + this.durationMinutes * 60 * 1000);
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('FollowUpAppointment', instance);
    }
};
exports.FollowUpAppointment = FollowUpAppointment;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./clinic-visit.model').ClinicVisit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "originalVisitId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./clinic-visit.model').ClinicVisit, {
        foreignKey: 'originalVisitId',
        as: 'originalVisit',
    }),
    __metadata("design:type", Object)
], FollowUpAppointment.prototype, "originalVisit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "scheduledBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "scheduledDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 30,
    }),
    __metadata("design:type", Number)
], FollowUpAppointment.prototype, "durationMinutes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(follow_up_status_enum_1.FollowUpStatus)],
        },
        allowNull: false,
        defaultValue: follow_up_status_enum_1.FollowUpStatus.SCHEDULED,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "assignedTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], FollowUpAppointment.prototype, "reminderSent", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "reminderSentAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "confirmedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./clinic-visit.model').ClinicVisit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "completedVisitId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./clinic-visit.model').ClinicVisit, {
        foreignKey: 'completedVisitId',
        as: 'completedVisit',
    }),
    __metadata("design:type", Object)
], FollowUpAppointment.prototype, "completedVisit", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "completedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "cancelledAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "cancellationReason", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "rescheduledFromId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "rescheduledToId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        defaultValue: 'normal',
    }),
    __metadata("design:type", String)
], FollowUpAppointment.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], FollowUpAppointment.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FollowUpAppointment]),
    __metadata("design:returntype", Promise)
], FollowUpAppointment, "auditPHIAccess", null);
exports.FollowUpAppointment = FollowUpAppointment = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'follow_up_appointments',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['studentId', 'status'],
            },
            {
                fields: ['originalVisitId'],
            },
            {
                fields: ['scheduledDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_follow_up_appointment_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_follow_up_appointment_updated_at',
            },
        ],
    })
], FollowUpAppointment);
//# sourceMappingURL=follow-up-appointment.model.js.map