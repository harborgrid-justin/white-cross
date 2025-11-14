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
exports.ClinicalProtocol = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const protocol_status_enum_1 = require("../../services/clinical/enums/protocol-status.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let ClinicalProtocol = class ClinicalProtocol extends sequelize_typescript_1.Model {
    name;
    code;
    category;
    description;
    indications;
    contraindications;
    steps;
    decisionPoints;
    requiredEquipment;
    medications;
    status;
    createdBy;
    approvedBy;
    approvedDate;
    effectiveDate;
    reviewDate;
    references;
    tags;
    isActive() {
        if (this.status !== protocol_status_enum_1.ProtocolStatus.ACTIVE)
            return false;
        if (this.effectiveDate && new Date() < this.effectiveDate)
            return false;
        return true;
    }
    needsReview() {
        if (!this.reviewDate)
            return false;
        return new Date() >= this.reviewDate;
    }
    getStepCount() {
        return this.steps.length;
    }
    getRequiredSteps() {
        return this.steps.filter((step) => step.required);
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ClinicalProtocol', instance);
    }
};
exports.ClinicalProtocol = ClinicalProtocol;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        unique: true,
    }),
    (0, sequelize_typescript_1.Index)({ unique: true }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "indications", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "contraindications", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "steps", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "decisionPoints", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "requiredEquipment", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "medications", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(protocol_status_enum_1.ProtocolStatus)],
        },
        allowNull: false,
        defaultValue: protocol_status_enum_1.ProtocolStatus.DRAFT,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ClinicalProtocol.prototype, "approvedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ClinicalProtocol.prototype, "approvedDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], ClinicalProtocol.prototype, "effectiveDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], ClinicalProtocol.prototype, "reviewDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "references", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalProtocol.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicalProtocol.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicalProtocol.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicalProtocol]),
    __metadata("design:returntype", Promise)
], ClinicalProtocol, "auditPHIAccess", null);
exports.ClinicalProtocol = ClinicalProtocol = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'clinical_protocols',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['name'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['category'],
            },
            {
                fields: ['code'],
                unique: true,
            },
            {
                fields: ['createdAt'],
                name: 'idx_clinical_protocol_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_clinical_protocol_updated_at',
            },
        ],
    })
], ClinicalProtocol);
//# sourceMappingURL=clinical-protocol.model.js.map