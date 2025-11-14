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
exports.PushNotification = exports.DeliveryStatus = exports.NotificationStatus = exports.NotificationCategory = exports.NotificationPriority = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["CRITICAL"] = "CRITICAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["LOW"] = "LOW";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["MEDICATION"] = "MEDICATION";
    NotificationCategory["APPOINTMENT"] = "APPOINTMENT";
    NotificationCategory["INCIDENT"] = "INCIDENT";
    NotificationCategory["SCREENING"] = "SCREENING";
    NotificationCategory["IMMUNIZATION"] = "IMMUNIZATION";
    NotificationCategory["MESSAGE"] = "MESSAGE";
    NotificationCategory["EMERGENCY"] = "EMERGENCY";
    NotificationCategory["REMINDER"] = "REMINDER";
    NotificationCategory["ALERT"] = "ALERT";
    NotificationCategory["SYSTEM"] = "SYSTEM";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SCHEDULED"] = "SCHEDULED";
    NotificationStatus["SENDING"] = "SENDING";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["FAILED"] = "FAILED";
    NotificationStatus["EXPIRED"] = "EXPIRED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["SUCCESS"] = "SUCCESS";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["INVALID_TOKEN"] = "INVALID_TOKEN";
    DeliveryStatus["RATE_LIMITED"] = "RATE_LIMITED";
    DeliveryStatus["TIMEOUT"] = "TIMEOUT";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
let PushNotification = class PushNotification extends sequelize_typescript_1.Model {
    userIds;
    deviceTokens;
    title;
    body;
    category;
    priority;
    data;
    actions;
    imageUrl;
    iconUrl;
    sound;
    badge;
    ttl;
    collapseKey;
    requireInteraction;
    silent;
    scheduledFor;
    expiresAt;
    status;
    sentAt;
    deliveredAt;
    failedAt;
    deliveryResults;
    totalRecipients;
    successfulDeliveries;
    failedDeliveries;
    clickedCount;
    dismissedCount;
    retryCount;
    maxRetries;
    nextRetryAt;
    createdBy;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PushNotification', instance);
    }
};
exports.PushNotification = PushNotification;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PushNotification.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], PushNotification.prototype, "userIds", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], PushNotification.prototype, "deviceTokens", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "body", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(NotificationCategory)],
        },
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], PushNotification.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(NotificationPriority)],
        },
        allowNull: false,
        defaultValue: NotificationPriority.NORMAL,
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "priority", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], PushNotification.prototype, "data", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], PushNotification.prototype, "actions", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "imageUrl", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "iconUrl", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], PushNotification.prototype, "sound", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PushNotification.prototype, "badge", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PushNotification.prototype, "ttl", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "collapseKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], PushNotification.prototype, "requireInteraction", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], PushNotification.prototype, "silent", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "scheduledFor", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(NotificationStatus)],
        },
        allowNull: false,
        defaultValue: NotificationStatus.PENDING,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], PushNotification.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "sentAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "deliveredAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "failedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], PushNotification.prototype, "deliveryResults", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "totalRecipients", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "successfulDeliveries", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "failedDeliveries", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "clickedCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "dismissedCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "retryCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 3,
    }),
    __metadata("design:type", Number)
], PushNotification.prototype, "maxRetries", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], PushNotification.prototype, "nextRetryAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PushNotification.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PushNotification.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PushNotification.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PushNotification]),
    __metadata("design:returntype", Promise)
], PushNotification, "auditPHIAccess", null);
exports.PushNotification = PushNotification = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'push_notifications',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['status'],
            },
            {
                fields: ['category'],
            },
            {
                fields: ['createdAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_push_notification_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_push_notification_updated_at',
            },
        ],
    })
], PushNotification);
//# sourceMappingURL=push-notification.model.js.map