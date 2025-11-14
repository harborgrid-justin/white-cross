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
exports.SyncSession = exports.SyncDirection = exports.SyncStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "PENDING";
    SyncStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SyncStatus["COMPLETED"] = "COMPLETED";
    SyncStatus["PARTIAL"] = "PARTIAL";
    SyncStatus["FAILED"] = "FAILED";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
var SyncDirection;
(function (SyncDirection) {
    SyncDirection["PULL"] = "PULL";
    SyncDirection["PUSH"] = "PUSH";
    SyncDirection["BIDIRECTIONAL"] = "BIDIRECTIONAL";
})(SyncDirection || (exports.SyncDirection = SyncDirection = {}));
let SyncSession = class SyncSession extends sequelize_typescript_1.Model {
    configId;
    startedAt;
    completedAt;
    status;
    direction;
    stats;
    entities;
    recordsProcessed;
    recordsSuccessful;
    recordsFailed;
    triggeredBy;
    completionMessage;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('SyncSession', instance);
    }
};
exports.SyncSession = SyncSession;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SyncSession.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Reference to the sync configuration used',
    }),
    __metadata("design:type", String)
], SyncSession.prototype, "configId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'When the sync session started',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], SyncSession.prototype, "startedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the sync session completed',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], SyncSession.prototype, "completedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncStatus)],
        },
        allowNull: false,
        defaultValue: SyncStatus.PENDING,
        comment: 'Current status of the sync session',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncSession.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SyncDirection)],
        },
        allowNull: false,
        comment: 'Direction of the sync operation',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncSession.prototype, "direction", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        comment: 'Statistics about the sync operation',
    }),
    __metadata("design:type", Object)
], SyncSession.prototype, "stats", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
        comment: 'Types of entities being synchronized',
    }),
    __metadata("design:type", Array)
], SyncSession.prototype, "entities", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total number of records processed',
    }),
    __metadata("design:type", Number)
], SyncSession.prototype, "recordsProcessed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of records processed successfully',
    }),
    __metadata("design:type", Number)
], SyncSession.prototype, "recordsSuccessful", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of records that failed processing',
    }),
    __metadata("design:type", Number)
], SyncSession.prototype, "recordsFailed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        comment: 'User or system that triggered the sync',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SyncSession.prototype, "triggeredBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Completion message or error details',
    }),
    __metadata("design:type", String)
], SyncSession.prototype, "completionMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'When the sync session was created',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], SyncSession.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the sync session was last updated',
    }),
    __metadata("design:type", Date)
], SyncSession.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./sis-sync-conflict.model').SISSyncConflict, {
        foreignKey: 'sessionId',
        as: 'conflicts',
    }),
    __metadata("design:type", Array)
], SyncSession.prototype, "conflicts", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SyncSession]),
    __metadata("design:returntype", Promise)
], SyncSession, "auditPHIAccess", null);
exports.SyncSession = SyncSession = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'sync_sessions',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['status'] },
            { fields: ['direction'] },
            { fields: ['startedAt'] },
            { fields: ['completedAt'] },
            { fields: ['triggeredBy'] },
            { fields: ['createdAt'] },
            {
                fields: ['createdAt'],
                name: 'idx_sync_session_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_sync_session_updated_at',
            },
        ],
    })
], SyncSession);
//# sourceMappingURL=sync-session.model.js.map