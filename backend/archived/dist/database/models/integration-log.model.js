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
exports.IntegrationLog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let IntegrationLog = class IntegrationLog extends sequelize_typescript_1.Model {
    integrationId;
    integrationType;
    action;
    status;
    recordsProcessed;
    recordsSucceeded;
    recordsFailed;
    startedAt;
    completedAt;
    duration;
    errorMessage;
    details;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('IntegrationLog', instance);
    }
};
exports.IntegrationLog = IntegrationLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], IntegrationLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./integration-config.model').IntegrationConfig),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Reference to the integration configuration',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationLog.prototype, "integrationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        comment: 'Type of integration (SIS, EHR, etc.)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationLog.prototype, "integrationType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        comment: 'Action performed (sync, test, etc.)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationLog.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        comment: 'Status of the operation (success, error, etc.)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationLog.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Total number of records processed',
    }),
    __metadata("design:type", Number)
], IntegrationLog.prototype, "recordsProcessed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Number of records processed successfully',
    }),
    __metadata("design:type", Number)
], IntegrationLog.prototype, "recordsSucceeded", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Number of records that failed processing',
    }),
    __metadata("design:type", Number)
], IntegrationLog.prototype, "recordsFailed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the operation started',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], IntegrationLog.prototype, "startedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the operation completed',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], IntegrationLog.prototype, "completedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Duration of the operation in milliseconds',
    }),
    __metadata("design:type", Number)
], IntegrationLog.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Error message if operation failed',
    }),
    __metadata("design:type", String)
], IntegrationLog.prototype, "errorMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Additional details about the operation',
    }),
    __metadata("design:type", Object)
], IntegrationLog.prototype, "details", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'When this log entry was created',
    }),
    __metadata("design:type", Date)
], IntegrationLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When this log entry was last updated',
    }),
    __metadata("design:type", Date)
], IntegrationLog.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./integration-config.model').IntegrationConfig, {
        foreignKey: 'integrationId',
        as: 'integration',
    }),
    __metadata("design:type", Object)
], IntegrationLog.prototype, "integration", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IntegrationLog]),
    __metadata("design:returntype", Promise)
], IntegrationLog, "auditPHIAccess", null);
exports.IntegrationLog = IntegrationLog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'integration_logs',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['integrationId'] },
            { fields: ['integrationType'] },
            { fields: ['action'] },
            { fields: ['status'] },
            { fields: ['startedAt'] },
            { fields: ['completedAt'] },
            { fields: ['createdAt'] },
            {
                fields: ['createdAt'],
                name: 'idx_integration_log_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_integration_log_updated_at',
            },
        ],
    })
], IntegrationLog);
//# sourceMappingURL=integration-log.model.js.map