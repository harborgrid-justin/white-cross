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
exports.Alert = exports.AlertStatus = exports.AlertCategory = exports.AlertSeverity = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["INFO"] = "INFO";
    AlertSeverity["LOW"] = "LOW";
    AlertSeverity["MEDIUM"] = "MEDIUM";
    AlertSeverity["HIGH"] = "HIGH";
    AlertSeverity["CRITICAL"] = "CRITICAL";
    AlertSeverity["EMERGENCY"] = "EMERGENCY";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
var AlertCategory;
(function (AlertCategory) {
    AlertCategory["HEALTH"] = "HEALTH";
    AlertCategory["SAFETY"] = "SAFETY";
    AlertCategory["COMPLIANCE"] = "COMPLIANCE";
    AlertCategory["SYSTEM"] = "SYSTEM";
    AlertCategory["MEDICATION"] = "MEDICATION";
    AlertCategory["APPOINTMENT"] = "APPOINTMENT";
})(AlertCategory || (exports.AlertCategory = AlertCategory = {}));
var AlertStatus;
(function (AlertStatus) {
    AlertStatus["ACTIVE"] = "ACTIVE";
    AlertStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    AlertStatus["RESOLVED"] = "RESOLVED";
    AlertStatus["EXPIRED"] = "EXPIRED";
    AlertStatus["DISMISSED"] = "DISMISSED";
})(AlertStatus || (exports.AlertStatus = AlertStatus = {}));
let Alert = class Alert extends sequelize_typescript_1.Model {
    definitionId;
    severity;
    category;
    title;
    message;
    studentId;
    userId;
    schoolId;
    status;
    metadata;
    createdBy;
    acknowledgedAt;
    acknowledgedBy;
    resolvedAt;
    resolvedBy;
    expiresAt;
    autoEscalateAfter;
    escalationLevel;
    requiresAcknowledgment;
    isExpired() {
        if (!this.expiresAt) {
            return false;
        }
        return new Date() > this.expiresAt;
    }
    needsEscalation() {
        if (!this.autoEscalateAfter ||
            this.status !== AlertStatus.ACTIVE ||
            this.acknowledgedAt) {
            return false;
        }
        const minutesSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60);
        return minutesSinceCreation >= this.autoEscalateAfter;
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('Alert', instance);
    }
};
exports.Alert = Alert;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Alert.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./alert-rule.model').AlertRule),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "definitionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./alert-rule.model').AlertRule, {
        foreignKey: 'definitionId',
        as: 'definition',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "definition", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AlertSeverity)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alert.prototype, "severity", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AlertCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alert.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alert.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alert.prototype, "message", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'userId',
        as: 'user',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./school.model').School),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./school.model').School, {
        foreignKey: 'schoolId',
        as: 'school',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "school", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AlertStatus)],
        },
        allowNull: false,
        defaultValue: AlertStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Alert.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], Alert.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Alert.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'createdBy',
        as: 'creator',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Alert.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "acknowledgedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'acknowledgedBy',
        as: 'acknowledger',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "acknowledger", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Alert.prototype, "resolvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Alert.prototype, "resolvedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'resolvedBy',
        as: 'resolver',
    }),
    __metadata("design:type", Object)
], Alert.prototype, "resolver", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Alert.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Alert.prototype, "autoEscalateAfter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Alert.prototype, "escalationLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Alert.prototype, "requiresAcknowledgment", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Alert.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Alert]),
    __metadata("design:returntype", Promise)
], Alert, "auditPHIAccess", null);
exports.Alert = Alert = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                status: AlertStatus.ACTIVE,
            },
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'DESC'],
            ],
        },
        critical: {
            where: {
                severity: {
                    [sequelize_1.Op.in]: [AlertSeverity.CRITICAL, AlertSeverity.EMERGENCY],
                },
                status: {
                    [sequelize_1.Op.in]: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED],
                },
            },
            order: [['createdAt', 'DESC']],
        },
        byPriority: (severity) => ({
            where: { severity },
            order: [['createdAt', 'DESC']],
        }),
        bySeverity: (severity) => ({
            where: { severity },
            order: [['createdAt', 'DESC']],
        }),
        byCategory: (category) => ({
            where: { category },
            order: [['createdAt', 'DESC']],
        }),
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['createdAt', 'DESC']],
        }),
        byUser: (userId) => ({
            where: { userId },
            order: [['createdAt', 'DESC']],
        }),
        bySchool: (schoolId) => ({
            where: { schoolId },
            order: [['createdAt', 'DESC']],
        }),
        unacknowledged: {
            where: {
                status: AlertStatus.ACTIVE,
                requiresAcknowledgment: true,
                acknowledgedAt: null,
            },
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'ASC'],
            ],
        },
        needsEscalation: {
            where: {
                status: AlertStatus.ACTIVE,
                autoEscalateAfter: {
                    [sequelize_1.Op.ne]: null,
                },
                acknowledgedAt: null,
            },
        },
        recent: {
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'alerts',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['severity'],
                name: 'alerts_severity_idx',
            },
            {
                fields: ['status'],
                name: 'alerts_status_idx',
            },
            {
                fields: ['category'],
                name: 'alerts_category_idx',
            },
            {
                fields: ['userId'],
                name: 'alerts_user_id_idx',
            },
            {
                fields: ['studentId'],
                name: 'alerts_student_id_idx',
            },
            {
                fields: ['schoolId'],
                name: 'alerts_school_id_idx',
            },
            {
                fields: ['createdAt'],
                name: 'alerts_created_at_idx',
            },
            {
                fields: ['status', 'severity', 'createdAt'],
                name: 'alerts_status_severity_created_idx',
            },
            {
                fields: ['createdAt'],
                name: 'idx_alert_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_alert_updated_at',
            },
        ],
    })
], Alert);
//# sourceMappingURL=alert.model.js.map