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
exports.ConversationParticipant = exports.ParticipantRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const conversation_model_1 = require("./conversation.model");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["OWNER"] = "OWNER";
    ParticipantRole["ADMIN"] = "ADMIN";
    ParticipantRole["MEMBER"] = "MEMBER";
    ParticipantRole["VIEWER"] = "VIEWER";
})(ParticipantRole || (exports.ParticipantRole = ParticipantRole = {}));
let ConversationParticipant = class ConversationParticipant extends sequelize_typescript_1.Model {
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ConversationParticipant', instance);
    }
};
exports.ConversationParticipant = ConversationParticipant;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => conversation_model_1.Conversation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "conversationId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'User ID who is a participant',
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ParticipantRole)],
        },
        allowNull: false,
        defaultValue: ParticipantRole.MEMBER,
        comment: 'Role determining permissions in conversation',
    }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when user joined the conversation',
    }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "joinedAt", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Timestamp of last message read by this participant',
    }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "lastReadAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether notifications are muted for this conversation',
    }),
    __metadata("design:type", Boolean)
], ConversationParticipant.prototype, "isMuted", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether conversation is pinned to top of list',
    }),
    __metadata("design:type", Boolean)
], ConversationParticipant.prototype, "isPinned", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Custom display name for this participant in the conversation',
    }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "customName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('ALL', 'MENTIONS', 'NONE'),
        allowNull: false,
        defaultValue: 'ALL',
        comment: 'Notification preference for this conversation',
    }),
    __metadata("design:type", String)
], ConversationParticipant.prototype, "notificationPreference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Extensible metadata field',
    }),
    __metadata("design:type", Object)
], ConversationParticipant.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => conversation_model_1.Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation',
    }),
    __metadata("design:type", conversation_model_1.Conversation)
], ConversationParticipant.prototype, "conversation", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'userId',
        as: 'user',
    }),
    __metadata("design:type", Object)
], ConversationParticipant.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], ConversationParticipant.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ConversationParticipant]),
    __metadata("design:returntype", Promise)
], ConversationParticipant, "auditPHIAccess", null);
exports.ConversationParticipant = ConversationParticipant = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'conversation_participants',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                unique: true,
                fields: ['conversationId', 'userId'],
                name: 'conversation_participants_conversation_user_unique',
            },
            {
                fields: ['createdAt'],
                name: 'idx_conversation_participant_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_conversation_participant_updated_at',
            },
        ],
    })
], ConversationParticipant);
//# sourceMappingURL=conversation-participant.model.js.map