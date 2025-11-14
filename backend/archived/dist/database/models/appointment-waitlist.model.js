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
exports.AppointmentWaitlist = exports.WaitlistStatus = exports.WaitlistPriority = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const appointment_model_1 = require("./appointment.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var WaitlistPriority;
(function (WaitlistPriority) {
    WaitlistPriority["LOW"] = "LOW";
    WaitlistPriority["NORMAL"] = "NORMAL";
    WaitlistPriority["HIGH"] = "HIGH";
    WaitlistPriority["URGENT"] = "URGENT";
})(WaitlistPriority || (exports.WaitlistPriority = WaitlistPriority = {}));
var WaitlistStatus;
(function (WaitlistStatus) {
    WaitlistStatus["WAITING"] = "WAITING";
    WaitlistStatus["NOTIFIED"] = "NOTIFIED";
    WaitlistStatus["SCHEDULED"] = "SCHEDULED";
    WaitlistStatus["EXPIRED"] = "EXPIRED";
    WaitlistStatus["CANCELLED"] = "CANCELLED";
})(WaitlistStatus || (exports.WaitlistStatus = WaitlistStatus = {}));
let AppointmentWaitlist = class AppointmentWaitlist extends sequelize_typescript_1.Model {
    studentId;
    nurseId;
    type;
    preferredDate;
    duration;
    priority;
    reason;
    notes;
    status;
    notifiedAt;
    expiresAt;
    student;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('AppointmentWaitlist', instance);
    }
};
exports.AppointmentWaitlist = AppointmentWaitlist;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "nurseId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User),
    __metadata("design:type", Object)
], AppointmentWaitlist.prototype, "nurse", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(appointment_model_1.AppointmentType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], AppointmentWaitlist.prototype, "preferredDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 30,
        comment: 'Duration in minutes',
    }),
    __metadata("design:type", Number)
], AppointmentWaitlist.prototype, "duration", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(WaitlistPriority)],
        },
        allowNull: false,
        defaultValue: WaitlistPriority.NORMAL,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(WaitlistStatus)],
        },
        allowNull: false,
        defaultValue: WaitlistStatus.WAITING,
    }),
    __metadata("design:type", String)
], AppointmentWaitlist.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], AppointmentWaitlist.prototype, "notifiedAt", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], AppointmentWaitlist.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AppointmentWaitlist.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AppointmentWaitlist.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AppointmentWaitlist]),
    __metadata("design:returntype", Promise)
], AppointmentWaitlist, "auditPHIAccess", null);
exports.AppointmentWaitlist = AppointmentWaitlist = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'appointment_waitlist',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_appointment_waitlist_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_appointment_waitlist_updated_at',
            },
        ],
    })
], AppointmentWaitlist);
//# sourceMappingURL=appointment-waitlist.model.js.map