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
exports.Message = exports.MessageCategory = exports.MessagePriority = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var MessagePriority;
(function (MessagePriority) {
    MessagePriority["LOW"] = "LOW";
    MessagePriority["MEDIUM"] = "MEDIUM";
    MessagePriority["HIGH"] = "HIGH";
    MessagePriority["URGENT"] = "URGENT";
})(MessagePriority || (exports.MessagePriority = MessagePriority = {}));
var MessageCategory;
(function (MessageCategory) {
    MessageCategory["EMERGENCY"] = "EMERGENCY";
    MessageCategory["HEALTH_UPDATE"] = "HEALTH_UPDATE";
    MessageCategory["APPOINTMENT_REMINDER"] = "APPOINTMENT_REMINDER";
    MessageCategory["MEDICATION_REMINDER"] = "MEDICATION_REMINDER";
    MessageCategory["GENERAL"] = "GENERAL";
    MessageCategory["INCIDENT_NOTIFICATION"] = "INCIDENT_NOTIFICATION";
    MessageCategory["COMPLIANCE"] = "COMPLIANCE";
})(MessageCategory || (exports.MessageCategory = MessageCategory = {}));
let Message = class Message extends sequelize_typescript_1.Model {
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('Message', instance);
    }
};
exports.Message = Message;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./conversation.model').Conversation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Conversation this message belongs to (for chat messages)',
        references: {
            model: 'conversations',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], Message.prototype, "conversationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Message subject (for broadcast messages)',
    }),
    __metadata("design:type", String)
], Message.prototype, "subject", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'Plain text message content',
    }),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Encrypted message content for E2E encryption',
    }),
    __metadata("design:type", String)
], Message.prototype, "encryptedContent", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the message content is encrypted (E2E encryption)',
    }),
    __metadata("design:type", Boolean)
], Message.prototype, "isEncrypted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Encryption metadata including algorithm, IV, auth tag, and key ID',
    }),
    __metadata("design:type", Object)
], Message.prototype, "encryptionMetadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        comment: 'Encryption version for backward compatibility (e.g., "1.0.0")',
    }),
    __metadata("design:type", String)
], Message.prototype, "encryptionVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MessagePriority)],
        },
        allowNull: false,
        defaultValue: MessagePriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Message.prototype, "priority", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MessageCategory)],
        },
        allowNull: false,
        defaultValue: MessageCategory.GENERAL,
    }),
    __metadata("design:type", String)
], Message.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of recipients for broadcast messages',
    }),
    __metadata("design:type", Number)
], Message.prototype, "recipientCount", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Scheduled delivery time for future messages',
    }),
    __metadata("design:type", Date)
], Message.prototype, "scheduledAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
        defaultValue: [],
        comment: 'Array of attachment URLs',
    }),
    __metadata("design:type", Array)
], Message.prototype, "attachments", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'User who sent the message',
    }),
    __metadata("design:type", String)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'senderId',
        as: 'sender',
    }),
    __metadata("design:type", Function)
], Message.prototype, "sender", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./conversation.model').Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation',
    }),
    __metadata("design:type", Function)
], Message.prototype, "conversation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./message-read.model').MessageRead, {
        foreignKey: 'messageId',
        as: 'messageReads',
    }),
    __metadata("design:type", Array)
], Message.prototype, "messageReads", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./message-reaction.model').MessageReaction, {
        foreignKey: 'messageId',
        as: 'messageReactions',
    }),
    __metadata("design:type", Array)
], Message.prototype, "messageReactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./message-delivery.model').MessageDelivery, {
        foreignKey: 'messageId',
        as: 'messageDeliveries',
    }),
    __metadata("design:type", Array)
], Message.prototype, "messageDeliveries", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Template ID if using a message template',
    }),
    __metadata("design:type", String)
], Message.prototype, "templateId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Parent message ID for threaded replies',
    }),
    __metadata("design:type", String)
], Message.prototype, "parentId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Thread root message ID for grouping related messages',
    }),
    __metadata("design:type", String)
], Message.prototype, "threadId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the message has been edited',
    }),
    __metadata("design:type", Boolean)
], Message.prototype, "isEdited", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Timestamp of last edit',
    }),
    __metadata("design:type", Date)
], Message.prototype, "editedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Extensible metadata field for additional properties',
    }),
    __metadata("design:type", Object)
], Message.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp for data retention',
    }),
    __metadata("design:type", Date)
], Message.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message]),
    __metadata("design:returntype", Promise)
], Message, "auditPHIAccess", null);
exports.Message = Message = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'messages',
        timestamps: true,
        paranoid: true,
        underscored: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_message_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_message_updated_at',
            },
        ],
    })
], Message);
//# sourceMappingURL=message.model.js.map