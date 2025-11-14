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
exports.DeliveryLog = exports.DeliveryChannel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var DeliveryChannel;
(function (DeliveryChannel) {
    DeliveryChannel["EMAIL"] = "email";
    DeliveryChannel["SMS"] = "sms";
    DeliveryChannel["PUSH"] = "push";
    DeliveryChannel["VOICE"] = "voice";
})(DeliveryChannel || (exports.DeliveryChannel = DeliveryChannel = {}));
let DeliveryLog = class DeliveryLog extends sequelize_typescript_1.Model {
    alertId;
    recipientId;
    success;
    attemptCount;
    lastAttempt;
    deliveredAt;
    errorMessage;
    getBackoffMs() {
        return Math.min(1000 * Math.pow(2, this.attemptCount), 60000);
    }
    isReadyForRetry() {
        if (this.success) {
            return false;
        }
        const timeSinceLastAttempt = Date.now() - this.lastAttempt.getTime();
        return timeSinceLastAttempt >= this.getBackoffMs();
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('DeliveryLog', instance);
    }
};
exports.DeliveryLog = DeliveryLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DeliveryLog.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./alert.model').Alert),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], DeliveryLog.prototype, "alertId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./alert.model').Alert, {
        foreignKey: 'alertId',
        as: 'alert',
    }),
    __metadata("design:type", Object)
], DeliveryLog.prototype, "alert", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DeliveryChannel)],
        },
        allowNull: false,
    }),
    __metadata("design:type", Object)
], DeliveryLog.prototype, "channel", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], DeliveryLog.prototype, "recipientId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'recipientId',
        as: 'recipient',
    }),
    __metadata("design:type", Object)
], DeliveryLog.prototype, "recipient", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], DeliveryLog.prototype, "success", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }),
    __metadata("design:type", Number)
], DeliveryLog.prototype, "attemptCount", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], DeliveryLog.prototype, "lastAttempt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], DeliveryLog.prototype, "deliveredAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], DeliveryLog.prototype, "errorMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], DeliveryLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], DeliveryLog.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeliveryLog]),
    __metadata("design:returntype", Promise)
], DeliveryLog, "auditPHIAccess", null);
exports.DeliveryLog = DeliveryLog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'delivery_logs',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['alertId'],
                name: 'delivery_logs_alert_id_idx',
            },
            {
                fields: ['channel'],
                name: 'delivery_logs_channel_idx',
            },
            {
                fields: ['success'],
                name: 'delivery_logs_success_idx',
            },
            {
                fields: ['lastAttempt'],
                name: 'delivery_logs_last_attempt_idx',
            },
            {
                fields: ['recipientId'],
                name: 'delivery_logs_recipient_id_idx',
            },
            {
                fields: ['alertId', 'channel', 'recipientId'],
                name: 'delivery_logs_alert_channel_recipient_idx',
            },
            {
                fields: ['createdAt'],
                name: 'idx_delivery_log_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_delivery_log_updated_at',
            },
        ],
    })
], DeliveryLog);
//# sourceMappingURL=delivery-log.model.js.map