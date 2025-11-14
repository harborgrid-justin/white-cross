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
exports.AuditLog = exports.AuditSeverity = exports.ComplianceType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const database_enums_1 = require("../types/database.enums");
const logger_service_1 = require("../../common/logging/logger.service");
var ComplianceType;
(function (ComplianceType) {
    ComplianceType["HIPAA"] = "HIPAA";
    ComplianceType["FERPA"] = "FERPA";
    ComplianceType["GDPR"] = "GDPR";
    ComplianceType["GENERAL"] = "GENERAL";
})(ComplianceType || (exports.ComplianceType = ComplianceType = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
let AuditLog = class AuditLog extends sequelize_typescript_1.Model {
    action;
    entityType;
    entityId;
    userId;
    userName;
    changes;
    previousValues;
    newValues;
    ipAddress;
    userAgent;
    requestId;
    sessionId;
    isPHI;
    complianceType;
    severity;
    success;
    errorMessage;
    metadata;
    tags;
    toExportObject(includeFullDetails = false) {
        const data = this.get({ plain: true });
        if (!includeFullDetails) {
            return {
                id: data.id,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                userId: data.userId,
                userName: data.userName,
                isPHI: data.isPHI,
                complianceType: data.complianceType,
                severity: data.severity,
                success: data.success,
                createdAt: data.createdAt,
                tags: data.tags,
            };
        }
        return data;
    }
    shouldRetain(retentionDate) {
        const retentionYears = this.complianceType === ComplianceType.HIPAA
            ? 7
            : this.complianceType === ComplianceType.FERPA
                ? 5
                : this.isPHI
                    ? 7
                    : 3;
        const expirationDate = new Date(this.createdAt);
        expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);
        return expirationDate > retentionDate;
    }
    getDescription() {
        const user = this.userName || this.userId || 'SYSTEM';
        const entity = this.entityId
            ? `${this.entityType}:${this.entityId}`
            : this.entityType;
        return `${user} performed ${this.action} on ${entity}`;
    }
};
exports.AuditLog = AuditLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(database_enums_1.AuditAction)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'Type of entity affected (Student, HealthRecord, User, etc.)',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the entity affected (null for bulk operations)',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of user who performed the action (null for system operations)',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        comment: 'Name of user who performed the action (denormalized for reporting)',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "userName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Complete change data (for backward compatibility)',
    }),
    __metadata("design:type", Object)
], AuditLog.prototype, "changes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Previous values before the change (for UPDATE operations)',
    }),
    __metadata("design:type", Object)
], AuditLog.prototype, "previousValues", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'New values after the change (for CREATE/UPDATE operations)',
    }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newValues", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: true,
        comment: 'IP address of the client making the request',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'User agent string of the client',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'Request correlation ID for tracing related operations',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "requestId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'Session ID for grouping operations by user session',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "sessionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Flag indicating if this audit log involves Protected Health Information',
    }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "isPHI", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceType)],
        },
        allowNull: false,
        defaultValue: ComplianceType.GENERAL,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "complianceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AuditSeverity)],
        },
        allowNull: false,
        defaultValue: AuditSeverity.LOW,
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the operation completed successfully',
    }),
    __metadata("design:type", Boolean)
], AuditLog.prototype, "success", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Error message if operation failed',
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "errorMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Additional metadata for context (query params, filter criteria, etc.)',
    }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
        defaultValue: [],
        comment: 'Tags for categorization and filtering',
    }),
    __metadata("design:type", Array)
], AuditLog.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the action was performed',
    }),
    __metadata("design:type", Date)
], AuditLog.prototype, "createdAt", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'audit_logs',
        timestamps: true,
        updatedAt: false,
        underscored: false,
        indexes: [
            { fields: ['userId'] },
            { fields: ['entityType'] },
            { fields: ['entityId'] },
            { fields: ['action'] },
            { fields: ['createdAt'] },
            { fields: ['isPHI'] },
            { fields: ['complianceType'] },
            { fields: ['severity'] },
            { fields: ['success'] },
            { fields: ['sessionId'] },
            { fields: ['requestId'] },
            { fields: ['entityType', 'entityId', 'createdAt'] },
            { fields: ['userId', 'createdAt'] },
            { fields: ['action', 'entityType', 'createdAt'] },
            { fields: ['isPHI', 'createdAt'] },
            { fields: ['complianceType', 'createdAt'] },
            { fields: ['severity', 'createdAt'] },
            { fields: ['tags'], using: 'gin' },
            { fields: ['metadata'], using: 'gin' },
            { fields: ['changes'], using: 'gin' },
            {
                fields: ['createdAt'],
                name: 'idx_audit_log_created_at',
            },
        ],
        hooks: {
            beforeCreate: (instance) => {
                if (!instance.createdAt) {
                    instance.createdAt = new Date();
                }
            },
            beforeUpdate: (instance) => {
                if (instance.changed()) {
                    const changedFields = instance.changed();
                    const logger = new logger_service_1.LoggerService();
                    logger.setContext('AuditLog');
                    logger.warn(`AuditLog ${instance.id} modified at ${new Date().toISOString()}`);
                    logger.warn(`Changed fields: ${changedFields.join(', ')}`);
                }
            },
        },
    })
], AuditLog);
//# sourceMappingURL=audit-log.model.js.map