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
exports.DrugInteraction = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const interaction_severity_enum_1 = require("../../services/clinical/enums/interaction-severity.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let DrugInteraction = class DrugInteraction extends sequelize_typescript_1.Model {
    drug1Id;
    drug2Id;
    severity;
    description;
    clinicalEffects;
    management;
    references;
    evidenceLevel;
    drug1;
    drug2;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('DrugInteraction', instance);
    }
};
exports.DrugInteraction = DrugInteraction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DrugInteraction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./drug-catalog.model').DrugCatalog),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugInteraction.prototype, "drug1Id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./drug-catalog.model').DrugCatalog),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugInteraction.prototype, "drug2Id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(interaction_severity_enum_1.InteractionSeverity)],
        },
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugInteraction.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], DrugInteraction.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], DrugInteraction.prototype, "clinicalEffects", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], DrugInteraction.prototype, "management", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], DrugInteraction.prototype, "references", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
    }),
    __metadata("design:type", String)
], DrugInteraction.prototype, "evidenceLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DrugInteraction.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DrugInteraction.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./drug-catalog.model').DrugCatalog, {
        foreignKey: 'drug1Id',
        as: 'drug1',
    }),
    __metadata("design:type", Object)
], DrugInteraction.prototype, "drug1", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./drug-catalog.model').DrugCatalog, {
        foreignKey: 'drug2Id',
        as: 'drug2',
    }),
    __metadata("design:type", Object)
], DrugInteraction.prototype, "drug2", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DrugInteraction]),
    __metadata("design:returntype", Promise)
], DrugInteraction, "auditPHIAccess", null);
exports.DrugInteraction = DrugInteraction = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'drug_interactions',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['drug1Id', 'drug2Id'],
                unique: true,
            },
            {
                fields: ['severity'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_drug_interaction_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_drug_interaction_updated_at',
            },
        ],
    })
], DrugInteraction);
//# sourceMappingURL=drug-interaction.model.js.map