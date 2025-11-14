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
exports.AlertRule = exports.AlertCategory = exports.AlertSeverity = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
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
let AlertRule = class AlertRule extends sequelize_typescript_1.Model {
    name;
    description;
    category;
    severity;
    isActive;
    priority;
    triggerConditions;
    notificationChannels;
    targetRoles;
    targetUsers;
    schoolId;
    districtId;
    autoEscalateAfter;
    cooldownPeriod;
    requiresAcknowledgment;
    expiresAfter;
    metadata;
    createdBy;
    updatedBy;
    lastTriggered;
    triggerCount;
    isInCooldown() {
        if (!this.cooldownPeriod || !this.lastTriggered) {
            return false;
        }
        const cooldownMs = this.cooldownPeriod * 60 * 1000;
        const timeSinceLastTrigger = Date.now() - this.lastTriggered.getTime();
        return timeSinceLastTrigger < cooldownMs;
    }
    evaluateConditions(data) {
        return this.triggerConditions.every((condition) => {
            const fieldValue = data[condition.field];
            switch (condition.operator) {
                case 'equals':
                    return fieldValue === condition.value;
                case 'not_equals':
                    return fieldValue !== condition.value;
                case 'greater_than':
                    return fieldValue > condition.value;
                case 'less_than':
                    return fieldValue < condition.value;
                case 'contains':
                    return String(fieldValue).includes(String(condition.value));
                case 'regex':
                    return new RegExp(condition.value).test(String(fieldValue));
                default:
                    return false;
            }
        });
    }
    getEnabledChannels() {
        return this.notificationChannels.filter((channel) => channel.enabled);
    }
    async recordTrigger() {
        this.lastTriggered = new Date();
        this.triggerCount = (this.triggerCount || 0) + 1;
        await this.save();
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('AlertRule', instance);
    }
};
exports.AlertRule = AlertRule;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AlertRule.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], AlertRule.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AlertCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AlertSeverity)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], AlertRule.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], AlertRule.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], AlertRule.prototype, "triggerConditions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], AlertRule.prototype, "notificationChannels", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
    }),
    __metadata("design:type", Array)
], AlertRule.prototype, "targetRoles", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
    }),
    __metadata("design:type", Array)
], AlertRule.prototype, "targetUsers", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "districtId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], AlertRule.prototype, "autoEscalateAfter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], AlertRule.prototype, "cooldownPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], AlertRule.prototype, "requiresAcknowledgment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], AlertRule.prototype, "expiresAfter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], AlertRule.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AlertRule.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AlertRule.prototype, "lastTriggered", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], AlertRule.prototype, "triggerCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AlertRule.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AlertRule.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlertRule]),
    __metadata("design:returntype", Promise)
], AlertRule, "auditPHIAccess", null);
exports.AlertRule = AlertRule = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'alert_rules',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['category'],
                name: 'alert_rules_category_idx',
            },
            {
                fields: ['severity'],
                name: 'alert_rules_severity_idx',
            },
            {
                fields: ['isActive'],
                name: 'alert_rules_is_active_idx',
            },
            {
                fields: ['priority'],
                name: 'alert_rules_priority_idx',
            },
            {
                fields: ['schoolId'],
                name: 'alert_rules_school_id_idx',
            },
            {
                fields: ['districtId'],
                name: 'alert_rules_district_id_idx',
            },
            {
                fields: ['category', 'isActive', 'priority'],
                name: 'alert_rules_active_category_priority_idx',
            },
            {
                fields: ['createdAt'],
                name: 'idx_alert_rule_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_alert_rule_updated_at',
            },
        ],
    })
], AlertRule);
//# sourceMappingURL=alert-rule.model.js.map