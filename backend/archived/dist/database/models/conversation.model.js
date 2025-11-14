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
exports.Conversation = exports.ConversationType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const conversation_participant_model_1 = require("./conversation-participant.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ConversationType;
(function (ConversationType) {
    ConversationType["DIRECT"] = "DIRECT";
    ConversationType["GROUP"] = "GROUP";
    ConversationType["CHANNEL"] = "CHANNEL";
})(ConversationType || (exports.ConversationType = ConversationType = {}));
let Conversation = class Conversation extends sequelize_typescript_1.Model {
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('Conversation', instance);
    }
};
exports.Conversation = Conversation;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConversationType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Conversation.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Display name for group conversations and channels',
    }),
    __metadata("design:type", String)
], Conversation.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Description for group conversations and channels',
    }),
    __metadata("design:type", String)
], Conversation.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
        comment: 'Avatar/profile image URL',
    }),
    __metadata("design:type", String)
], Conversation.prototype, "avatarUrl", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Tenant ID for multi-tenant isolation',
    }),
    __metadata("design:type", String)
], Conversation.prototype, "tenantId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'User who created the conversation',
    }),
    __metadata("design:type", String)
], Conversation.prototype, "createdById", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Timestamp of last message for sorting',
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Extensible metadata field for additional properties',
    }),
    __metadata("design:type", Object)
], Conversation.prototype, "metadata", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the conversation is archived',
    }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "isArchived", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => conversation_participant_model_1.ConversationParticipant, {
        foreignKey: 'conversationId',
        as: 'participants',
    }),
    __metadata("design:type", Array)
], Conversation.prototype, "participants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./message.model').Message, {
        foreignKey: 'conversationId',
        as: 'messages',
    }),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp',
    }),
    __metadata("design:type", Date)
], Conversation.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Conversation]),
    __metadata("design:returntype", Promise)
], Conversation, "auditPHIAccess", null);
exports.Conversation = Conversation = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'conversations',
        timestamps: true,
        paranoid: true,
        underscored: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_conversation_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_conversation_updated_at',
            },
        ],
    })
], Conversation);
//# sourceMappingURL=conversation.model.js.map