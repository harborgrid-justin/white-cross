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
exports.SyncQueueItem = exports.ConflictResolution = exports.SyncPriority = exports.SyncEntityType = exports.SyncActionType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var SyncActionType;
(function (SyncActionType) {
    SyncActionType["CREATE"] = "CREATE";
    SyncActionType["UPDATE"] = "UPDATE";
    SyncActionType["DELETE"] = "DELETE";
    SyncActionType["READ"] = "READ";
})(SyncActionType || (exports.SyncActionType = SyncActionType = {}));
var SyncEntityType;
(function (SyncEntityType) {
    SyncEntityType["STUDENT"] = "STUDENT";
    SyncEntityType["HEALTH_RECORD"] = "HEALTH_RECORD";
    SyncEntityType["MEDICATION"] = "MEDICATION";
    SyncEntityType["INCIDENT"] = "INCIDENT";
    SyncEntityType["VACCINATION"] = "VACCINATION";
    SyncEntityType["APPOINTMENT"] = "APPOINTMENT";
    SyncEntityType["SCREENING"] = "SCREENING";
    SyncEntityType["ALLERGY"] = "ALLERGY";
    SyncEntityType["CHRONIC_CONDITION"] = "CHRONIC_CONDITION";
})(SyncEntityType || (exports.SyncEntityType = SyncEntityType = {}));
var SyncPriority;
(function (SyncPriority) {
    SyncPriority["HIGH"] = "HIGH";
    SyncPriority["NORMAL"] = "NORMAL";
    SyncPriority["LOW"] = "LOW";
})(SyncPriority || (exports.SyncPriority = SyncPriority = {}));
var ConflictResolution;
(function (ConflictResolution) {
    ConflictResolution["CLIENT_WINS"] = "CLIENT_WINS";
    ConflictResolution["SERVER_WINS"] = "SERVER_WINS";
    ConflictResolution["NEWEST_WINS"] = "NEWEST_WINS";
    ConflictResolution["MERGE"] = "MERGE";
    ConflictResolution["MANUAL"] = "MANUAL";
})(ConflictResolution || (exports.ConflictResolution = ConflictResolution = {}));
let SyncQueueItem = class SyncQueueItem extends sequelize_typescript_1.Model {
    deviceId;
    userId;
    actionType;
    entityType;
    entityId;
    data;
    timestamp;
    syncedAt;
    synced;
    attempts;
    maxAttempts;
    lastError;
    conflictDetected;
    conflictResolution;
    priority;
    requiresOnline;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('SyncQueueItem', instance);
    }
};
exports.SyncQueueItem = SyncQueueItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncQueueItem.prototype, "deviceId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncQueueItem.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncActionType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "actionType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncEntityType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "entityType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "entityId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], SyncQueueItem.prototype, "data", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], SyncQueueItem.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], SyncQueueItem.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], SyncQueueItem.prototype, "syncedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], SyncQueueItem.prototype, "synced", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], SyncQueueItem.prototype, "attempts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 3,
    }),
    __metadata("design:type", Number)
], SyncQueueItem.prototype, "maxAttempts", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "lastError", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], SyncQueueItem.prototype, "conflictDetected", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConflictResolution)],
        },
    }),
    __metadata("design:type", String)
], SyncQueueItem.prototype, "conflictResolution", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncPriority)],
        },
        allowNull: false,
        defaultValue: SyncPriority.NORMAL,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncQueueItem.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], SyncQueueItem.prototype, "requiresOnline", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], SyncQueueItem.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SyncQueueItem]),
    __metadata("design:returntype", Promise)
], SyncQueueItem, "auditPHIAccess", null);
exports.SyncQueueItem = SyncQueueItem = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'sync_queue_items',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['deviceId'],
            },
            {
                fields: ['userId'],
            },
            {
                fields: ['synced'],
            },
            {
                fields: ['priority'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_sync_queue_item_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_sync_queue_item_updated_at',
            },
        ],
    })
], SyncQueueItem);
//# sourceMappingURL=sync-queue-item.model.js.map