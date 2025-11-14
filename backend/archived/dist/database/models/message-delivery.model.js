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
exports.MessageDelivery = exports.DeliveryChannelType = exports.DeliveryStatus = exports.RecipientType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var RecipientType;
(function (RecipientType) {
    RecipientType["NURSE"] = "NURSE";
    RecipientType["PARENT"] = "PARENT";
    RecipientType["GUARDIAN"] = "GUARDIAN";
    RecipientType["EMERGENCY_CONTACT"] = "EMERGENCY_CONTACT";
    RecipientType["STUDENT"] = "STUDENT";
    RecipientType["STAFF"] = "STAFF";
    RecipientType["ADMINISTRATOR"] = "ADMINISTRATOR";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["SENT"] = "SENT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["FAILED"] = "FAILED";
    DeliveryStatus["BOUNCED"] = "BOUNCED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
var DeliveryChannelType;
(function (DeliveryChannelType) {
    DeliveryChannelType["EMAIL"] = "EMAIL";
    DeliveryChannelType["SMS"] = "SMS";
    DeliveryChannelType["PUSH"] = "PUSH";
    DeliveryChannelType["IN_APP"] = "IN_APP";
})(DeliveryChannelType || (exports.DeliveryChannelType = DeliveryChannelType = {}));
let MessageDelivery = class MessageDelivery extends sequelize_typescript_1.Model {
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('MessageDelivery', instance);
    }
};
exports.MessageDelivery = MessageDelivery;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MessageDelivery.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RecipientType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "recipientType", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "recipientId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DeliveryChannelType)],
        },
        allowNull: false,
        defaultValue: DeliveryChannelType.IN_APP,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "channel", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DeliveryStatus)],
        },
        allowNull: false,
        defaultValue: DeliveryStatus.PENDING,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "contactInfo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], MessageDelivery.prototype, "sentAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], MessageDelivery.prototype, "deliveredAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "failureReason", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "externalId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./message.model').Message),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'messages',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], MessageDelivery.prototype, "messageId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./message.model').Message, {
        foreignKey: 'messageId',
        as: 'message',
    }),
    __metadata("design:type", Function)
], MessageDelivery.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], MessageDelivery.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], MessageDelivery.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MessageDelivery]),
    __metadata("design:returntype", Promise)
], MessageDelivery, "auditPHIAccess", null);
exports.MessageDelivery = MessageDelivery = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'message_deliveries',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['messageId', 'recipientType', 'recipientId', 'channel'],
                name: 'message_deliveries_message_recipient_channel_unique',
            },
            {
                fields: ['createdAt'],
                name: 'idx_message_delivery_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_message_delivery_updated_at',
            },
        ],
    })
], MessageDelivery);
//# sourceMappingURL=message-delivery.model.js.map