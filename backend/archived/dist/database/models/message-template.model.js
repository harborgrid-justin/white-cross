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
exports.MessageTemplate = exports.MessageCategory = exports.MessageType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var MessageType;
(function (MessageType) {
    MessageType["EMAIL"] = "EMAIL";
    MessageType["SMS"] = "SMS";
    MessageType["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    MessageType["VOICE"] = "VOICE";
})(MessageType || (exports.MessageType = MessageType = {}));
var MessageCategory;
(function (MessageCategory) {
    MessageCategory["APPOINTMENT"] = "APPOINTMENT";
    MessageCategory["MEDICATION"] = "MEDICATION";
    MessageCategory["EMERGENCY"] = "EMERGENCY";
    MessageCategory["NOTIFICATION"] = "NOTIFICATION";
    MessageCategory["REMINDER"] = "REMINDER";
})(MessageCategory || (exports.MessageCategory = MessageCategory = {}));
let MessageTemplate = class MessageTemplate extends sequelize_typescript_1.Model {
    name;
    subject;
    content;
    type;
    variables;
    isActive;
    createdById;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('MessageTemplate', instance);
    }
};
exports.MessageTemplate = MessageTemplate;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MessageTemplate.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageTemplate.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], MessageTemplate.prototype, "subject", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageTemplate.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MessageType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageTemplate.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MessageCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", Object)
], MessageTemplate.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], MessageTemplate.prototype, "variables", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], MessageTemplate.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MessageTemplate.prototype, "createdById", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'createdById',
        as: 'createdBy',
    }),
    __metadata("design:type", Object)
], MessageTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], MessageTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], MessageTemplate.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MessageTemplate]),
    __metadata("design:returntype", Promise)
], MessageTemplate, "auditPHIAccess", null);
exports.MessageTemplate = MessageTemplate = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'message_templates',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_message_template_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_message_template_updated_at',
            },
        ],
    })
], MessageTemplate);
//# sourceMappingURL=message-template.model.js.map