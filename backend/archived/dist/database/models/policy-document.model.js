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
exports.PolicyDocument = exports.PolicyStatus = exports.PolicyCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var PolicyCategory;
(function (PolicyCategory) {
    PolicyCategory["HIPAA_PRIVACY"] = "HIPAA_PRIVACY";
    PolicyCategory["HIPAA_SECURITY"] = "HIPAA_SECURITY";
    PolicyCategory["FERPA"] = "FERPA";
    PolicyCategory["DATA_RETENTION"] = "DATA_RETENTION";
    PolicyCategory["INCIDENT_RESPONSE"] = "INCIDENT_RESPONSE";
    PolicyCategory["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    PolicyCategory["TRAINING"] = "TRAINING";
})(PolicyCategory || (exports.PolicyCategory = PolicyCategory = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus["DRAFT"] = "DRAFT";
    PolicyStatus["ACTIVE"] = "ACTIVE";
    PolicyStatus["ARCHIVED"] = "ARCHIVED";
    PolicyStatus["SUPERSEDED"] = "SUPERSEDED";
})(PolicyStatus || (exports.PolicyStatus = PolicyStatus = {}));
let PolicyDocument = class PolicyDocument extends sequelize_typescript_1.Model {
    title;
    category;
    content;
    effectiveDate;
    reviewDate;
    status;
    approvedBy;
    approvedAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PolicyDocument', instance);
    }
};
exports.PolicyDocument = PolicyDocument;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PolicyDocument.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], PolicyDocument.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(PolicyCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], PolicyDocument.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PolicyDocument.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        defaultValue: '1.0',
    }),
    __metadata("design:type", String)
], PolicyDocument.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], PolicyDocument.prototype, "effectiveDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PolicyDocument.prototype, "reviewDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(PolicyStatus)],
        },
        allowNull: false,
        defaultValue: PolicyStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PolicyDocument.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PolicyDocument.prototype, "approvedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PolicyDocument.prototype, "approvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PolicyDocument.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PolicyDocument.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PolicyDocument]),
    __metadata("design:returntype", Promise)
], PolicyDocument, "auditPHIAccess", null);
exports.PolicyDocument = PolicyDocument = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'policy_documents',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['category'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['effectiveDate'],
            },
            {
                fields: ['reviewDate'],
            },
            {
                fields: ['approvedBy'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_policy_document_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_policy_document_updated_at',
            },
        ],
    })
], PolicyDocument);
//# sourceMappingURL=policy-document.model.js.map