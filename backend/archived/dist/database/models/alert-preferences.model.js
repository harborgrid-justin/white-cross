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
exports.AlertPreferences = exports.DeliveryChannel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const alert_model_1 = require("./alert.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var DeliveryChannel;
(function (DeliveryChannel) {
    DeliveryChannel["WEBSOCKET"] = "WEBSOCKET";
    DeliveryChannel["EMAIL"] = "EMAIL";
    DeliveryChannel["SMS"] = "SMS";
    DeliveryChannel["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
})(DeliveryChannel || (exports.DeliveryChannel = DeliveryChannel = {}));
let AlertPreferences = class AlertPreferences extends sequelize_typescript_1.Model {
    userId;
    schoolId;
    channels;
    severityFilter;
    categoryFilter;
    quietHoursStart;
    quietHoursEnd;
    isActive;
    isQuietHours() {
        if (!this.quietHoursStart || !this.quietHoursEnd) {
            return false;
        }
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [startHour, startMin] = this.quietHoursStart.split(':').map(Number);
        const [endHour, endMin] = this.quietHoursEnd.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        if (startTime < endTime) {
            return currentTime >= startTime && currentTime <= endTime;
        }
        else {
            return currentTime >= startTime || currentTime <= endTime;
        }
    }
    matchesFilters(severity, category) {
        return (this.severityFilter.includes(severity) &&
            this.categoryFilter.includes(category));
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('AlertPreferences', instance);
    }
};
exports.AlertPreferences = AlertPreferences;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AlertPreferences.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AlertPreferences.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'userId',
        as: 'user',
    }),
    __metadata("design:type", Object)
], AlertPreferences.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./school.model').School),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AlertPreferences.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./school.model').School, {
        foreignKey: 'schoolId',
        as: 'school',
    }),
    __metadata("design:type", Object)
], AlertPreferences.prototype, "school", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(DeliveryChannel))),
        allowNull: false,
        defaultValue: [DeliveryChannel.WEBSOCKET, DeliveryChannel.EMAIL],
    }),
    __metadata("design:type", Array)
], AlertPreferences.prototype, "channels", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(alert_model_1.AlertSeverity))),
        allowNull: false,
        defaultValue: Object.values(alert_model_1.AlertSeverity),
    }),
    __metadata("design:type", Array)
], AlertPreferences.prototype, "severityFilter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.ENUM(...Object.values(alert_model_1.AlertCategory))),
        allowNull: false,
        defaultValue: Object.values(alert_model_1.AlertCategory),
    }),
    __metadata("design:type", Array)
], AlertPreferences.prototype, "categoryFilter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(5),
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
    }),
    __metadata("design:type", String)
], AlertPreferences.prototype, "quietHoursStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(5),
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
    }),
    __metadata("design:type", String)
], AlertPreferences.prototype, "quietHoursEnd", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], AlertPreferences.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], AlertPreferences.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], AlertPreferences.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AlertPreferences]),
    __metadata("design:returntype", Promise)
], AlertPreferences, "auditPHIAccess", null);
exports.AlertPreferences = AlertPreferences = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'alert_preferences',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['userId'],
                name: 'alert_preferences_user_id_idx',
            },
            {
                fields: ['schoolId'],
                name: 'alert_preferences_school_id_idx',
            },
            {
                fields: ['isActive'],
                name: 'alert_preferences_is_active_idx',
            },
            {
                fields: ['userId', 'schoolId'],
                name: 'alert_preferences_user_school_idx',
                unique: true,
            },
            {
                fields: ['createdAt'],
                name: 'idx_alert_preferences_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_alert_preferences_updated_at',
            },
        ],
    })
], AlertPreferences);
//# sourceMappingURL=alert-preferences.model.js.map