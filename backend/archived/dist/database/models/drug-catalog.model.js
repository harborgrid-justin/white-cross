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
exports.DrugCatalog = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let DrugCatalog = class DrugCatalog extends sequelize_typescript_1.Model {
    rxnormId;
    rxnormCode;
    genericName;
    brandNames;
    drugClass;
    fdaApproved;
    commonDoses;
    sideEffects;
    contraindications;
    warnings;
    isActive;
    interactionsAsDrug1;
    interactionsAsDrug2;
    allergies;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('DrugCatalog', instance);
    }
};
exports.DrugCatalog = DrugCatalog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DrugCatalog.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        unique: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugCatalog.prototype, "rxnormId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        unique: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugCatalog.prototype, "rxnormCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugCatalog.prototype, "genericName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "brandNames", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DrugCatalog.prototype, "drugClass", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], DrugCatalog.prototype, "fdaApproved", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
    }),
    __metadata("design:type", Object)
], DrugCatalog.prototype, "commonDoses", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "sideEffects", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "contraindications", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "warnings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], DrugCatalog.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DrugCatalog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DrugCatalog.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./drug-interaction.model').DrugInteraction, {
        foreignKey: 'drug1Id',
        as: 'interactionsAsDrug1',
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "interactionsAsDrug1", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./drug-interaction.model').DrugInteraction, {
        foreignKey: 'drug2Id',
        as: 'interactionsAsDrug2',
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "interactionsAsDrug2", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./student-drug-allergy.model').StudentDrugAllergy, {
        foreignKey: 'drugId',
        as: 'allergies',
    }),
    __metadata("design:type", Array)
], DrugCatalog.prototype, "allergies", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DrugCatalog]),
    __metadata("design:returntype", Promise)
], DrugCatalog, "auditPHIAccess", null);
exports.DrugCatalog = DrugCatalog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'drug_catalog',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['rxnormId'],
                unique: true,
                where: {
                    rxnormId: {
                        [sequelize_1.Op.ne]: null,
                    },
                },
            },
            {
                fields: ['rxnormCode'],
                unique: true,
                where: {
                    rxnormCode: {
                        [sequelize_1.Op.ne]: null,
                    },
                },
            },
            {
                fields: ['genericName'],
            },
            {
                fields: ['drugClass'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_drug_catalog_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_drug_catalog_updated_at',
            },
        ],
    })
], DrugCatalog);
//# sourceMappingURL=drug-catalog.model.js.map