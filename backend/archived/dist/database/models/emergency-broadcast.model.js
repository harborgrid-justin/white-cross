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
exports.EmergencyBroadcast = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
const emergency_broadcast_enums_1 = require("../../services/communication/emergency-broadcast/emergency-broadcast.enums");
let EmergencyBroadcast = class EmergencyBroadcast extends sequelize_typescript_1.Model {
    type;
    priority;
    title;
    message;
    audience;
    schoolId;
    gradeLevel;
    classId;
    groupIds;
    channels;
    requiresAcknowledgment;
    expiresAt;
    sentBy;
    sentAt;
    status;
    totalRecipients;
    deliveredCount;
    failedCount;
    acknowledgedCount;
    followUpRequired;
    followUpMessage;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('EmergencyBroadcast', instance);
    }
};
exports.EmergencyBroadcast = EmergencyBroadcast;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(emergency_broadcast_enums_1.EmergencyType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(emergency_broadcast_enums_1.EmergencyPriority)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], EmergencyBroadcast.prototype, "audience", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "gradeLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "classId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], EmergencyBroadcast.prototype, "groupIds", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], EmergencyBroadcast.prototype, "channels", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], EmergencyBroadcast.prototype, "requiresAcknowledgment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], EmergencyBroadcast.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "sentBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], EmergencyBroadcast.prototype, "sentAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(emergency_broadcast_enums_1.BroadcastStatus)],
        },
        allowNull: false,
        defaultValue: emergency_broadcast_enums_1.BroadcastStatus.DRAFT,
    }),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EmergencyBroadcast.prototype, "totalRecipients", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EmergencyBroadcast.prototype, "deliveredCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EmergencyBroadcast.prototype, "failedCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EmergencyBroadcast.prototype, "acknowledgedCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], EmergencyBroadcast.prototype, "followUpRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], EmergencyBroadcast.prototype, "followUpMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], EmergencyBroadcast.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], EmergencyBroadcast.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmergencyBroadcast]),
    __metadata("design:returntype", Promise)
], EmergencyBroadcast, "auditPHIAccess", null);
exports.EmergencyBroadcast = EmergencyBroadcast = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'emergency_broadcasts',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['type'],
            },
            {
                fields: ['priority'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['schoolId'],
            },
            {
                fields: ['sentAt'],
            },
            {
                fields: ['expiresAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_emergency_broadcast_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_emergency_broadcast_updated_at',
            },
        ],
    })
], EmergencyBroadcast);
//# sourceMappingURL=emergency-broadcast.model.js.map