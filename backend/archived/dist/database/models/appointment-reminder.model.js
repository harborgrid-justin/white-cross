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
exports.AppointmentReminder = exports.ReminderStatus = exports.MessageType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
var MessageType;
(function (MessageType) {
    MessageType["EMAIL"] = "EMAIL";
    MessageType["SMS"] = "SMS";
    MessageType["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
})(MessageType || (exports.MessageType = MessageType = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["SCHEDULED"] = "SCHEDULED";
    ReminderStatus["SENT"] = "SENT";
    ReminderStatus["FAILED"] = "FAILED";
    ReminderStatus["CANCELLED"] = "CANCELLED";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
let AppointmentReminder = class AppointmentReminder extends sequelize_typescript_1.Model {
    appointmentId;
    type;
    scheduledFor;
    status;
    sentAt;
    failureReason;
    message;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('AppointmentReminder', instance);
    }
};
exports.AppointmentReminder = AppointmentReminder;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./appointment.model').Appointment),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "appointmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./appointment.model').Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
    }),
    (0, swagger_1.ApiHideProperty)(),
    __metadata("design:type", Object)
], AppointmentReminder.prototype, "appointment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MessageType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AppointmentReminder.prototype, "scheduledFor", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReminderStatus)],
        },
        allowNull: false,
        defaultValue: ReminderStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], AppointmentReminder.prototype, "sentAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "failureReason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentReminder.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AppointmentReminder.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AppointmentReminder.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AppointmentReminder]),
    __metadata("design:returntype", Promise)
], AppointmentReminder, "auditPHIAccess", null);
exports.AppointmentReminder = AppointmentReminder = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'appointment_reminders',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_appointment_reminder_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_appointment_reminder_updated_at',
            },
        ],
    })
], AppointmentReminder);
//# sourceMappingURL=appointment-reminder.model.js.map