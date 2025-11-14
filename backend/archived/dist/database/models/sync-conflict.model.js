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
exports.SyncConflict = exports.SyncStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sync_queue_item_model_1 = require("./sync-queue-item.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "PENDING";
    SyncStatus["RESOLVED"] = "RESOLVED";
    SyncStatus["DEFERRED"] = "DEFERRED";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
let SyncConflict = class SyncConflict extends sequelize_typescript_1.Model {
    queueItemId;
    entityType;
    entityId;
    clientVersion;
    serverVersion;
    resolution;
    resolvedAt;
    resolvedBy;
    mergedData;
    status;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('SyncConflict', instance);
    }
};
exports.SyncConflict = SyncConflict;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SyncConflict.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], SyncConflict.prototype, "queueItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(sync_queue_item_model_1.SyncEntityType)],
        },
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncConflict.prototype, "entityType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], SyncConflict.prototype, "entityId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "clientVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "serverVersion", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(sync_queue_item_model_1.ConflictResolution)],
        },
    }),
    __metadata("design:type", String)
], SyncConflict.prototype, "resolution", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], SyncConflict.prototype, "resolvedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], SyncConflict.prototype, "resolvedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], SyncConflict.prototype, "mergedData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncStatus)],
        },
        allowNull: false,
        defaultValue: SyncStatus.PENDING,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncConflict.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], SyncConflict.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SyncConflict]),
    __metadata("design:returntype", Promise)
], SyncConflict, "auditPHIAccess", null);
exports.SyncConflict = SyncConflict = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'sync_conflicts',
        timestamps: false,
        indexes: [
            {
                fields: ['status'],
            },
            {
                fields: ['entityType'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_sync_conflict_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_sync_conflict_updated_at',
            },
        ],
    })
], SyncConflict);
//# sourceMappingURL=sync-conflict.model.js.map