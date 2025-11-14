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
exports.WitnessStatement = exports.WitnessType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var WitnessType;
(function (WitnessType) {
    WitnessType["STAFF"] = "STAFF";
    WitnessType["STUDENT"] = "STUDENT";
    WitnessType["PARENT"] = "PARENT";
    WitnessType["GUARDIAN"] = "GUARDIAN";
    WitnessType["VISITOR"] = "VISITOR";
    WitnessType["OTHER"] = "OTHER";
})(WitnessType || (exports.WitnessType = WitnessType = {}));
let WitnessStatement = class WitnessStatement extends sequelize_typescript_1.Model {
    incidentReportId;
    witnessName;
    witnessType;
    witnessContact;
    statement;
    verified;
    verifiedBy;
    verifiedAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('WitnessStatement', instance);
    }
};
exports.WitnessStatement = WitnessStatement;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], WitnessStatement.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./incident-report.model').IncidentReport),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], WitnessStatement.prototype, "incidentReportId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], WitnessStatement.prototype, "witnessName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(WitnessType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], WitnessStatement.prototype, "witnessType", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], WitnessStatement.prototype, "witnessContact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], WitnessStatement.prototype, "statement", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], WitnessStatement.prototype, "verified", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], WitnessStatement.prototype, "verifiedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], WitnessStatement.prototype, "verifiedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], WitnessStatement.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], WitnessStatement.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./incident-report.model').IncidentReport, {
        foreignKey: 'incidentReportId',
        as: 'incidentReport',
    }),
    __metadata("design:type", Object)
], WitnessStatement.prototype, "incidentReport", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WitnessStatement]),
    __metadata("design:returntype", Promise)
], WitnessStatement, "auditPHIAccess", null);
exports.WitnessStatement = WitnessStatement = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'witness_statements',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['incidentReportId', 'verified'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_witness_statement_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_witness_statement_updated_at',
            },
        ],
    })
], WitnessStatement);
//# sourceMappingURL=witness-statement.model.js.map