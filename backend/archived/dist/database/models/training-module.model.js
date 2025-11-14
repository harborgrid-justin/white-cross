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
exports.TrainingModule = exports.TrainingCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var TrainingCategory;
(function (TrainingCategory) {
    TrainingCategory["HIPAA_COMPLIANCE"] = "HIPAA_COMPLIANCE";
    TrainingCategory["MEDICATION_MANAGEMENT"] = "MEDICATION_MANAGEMENT";
    TrainingCategory["EMERGENCY_PROCEDURES"] = "EMERGENCY_PROCEDURES";
    TrainingCategory["SYSTEM_TRAINING"] = "SYSTEM_TRAINING";
    TrainingCategory["SAFETY_PROTOCOLS"] = "SAFETY_PROTOCOLS";
    TrainingCategory["DATA_SECURITY"] = "DATA_SECURITY";
})(TrainingCategory || (exports.TrainingCategory = TrainingCategory = {}));
let TrainingModule = class TrainingModule extends sequelize_typescript_1.Model {
    title;
    description;
    content;
    duration;
    category;
    isRequired;
    order;
    attachments;
    completionCount;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('TrainingModule', instance);
    }
};
exports.TrainingModule = TrainingModule;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], TrainingModule.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        comment: 'Title of the training module',
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Description of the training module',
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'Content/body of the training module',
    }),
    __metadata("design:type", String)
], TrainingModule.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Estimated duration in minutes',
    }),
    __metadata("design:type", Number)
], TrainingModule.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(TrainingCategory)],
        },
        allowNull: false,
        comment: 'Category of the training module',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], TrainingModule.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether completion of this module is required',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], TrainingModule.prototype, "isRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Display order of the training module',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Number)
], TrainingModule.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: true,
        comment: 'Array of attachment file paths',
    }),
    __metadata("design:type", Array)
], TrainingModule.prototype, "attachments", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times this module has been completed',
    }),
    __metadata("design:type", Number)
], TrainingModule.prototype, "completionCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the training module was created',
    }),
    __metadata("design:type", Date)
], TrainingModule.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the training module was last updated',
    }),
    __metadata("design:type", Date)
], TrainingModule.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrainingModule]),
    __metadata("design:returntype", Promise)
], TrainingModule, "auditPHIAccess", null);
exports.TrainingModule = TrainingModule = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'training_modules',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['category'] },
            { fields: ['isRequired'] },
            { fields: ['order'] },
            {
                fields: ['createdAt'],
                name: 'idx_training_module_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_training_module_updated_at',
            },
        ],
    })
], TrainingModule);
//# sourceMappingURL=training-module.model.js.map