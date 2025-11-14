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
exports.ComplianceChecklistItem = exports.ChecklistItemStatus = exports.ComplianceCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ComplianceCategory;
(function (ComplianceCategory) {
    ComplianceCategory["HIPAA_PRIVACY"] = "HIPAA_PRIVACY";
    ComplianceCategory["HIPAA_SECURITY"] = "HIPAA_SECURITY";
    ComplianceCategory["FERPA"] = "FERPA";
    ComplianceCategory["MEDICATION"] = "MEDICATION";
    ComplianceCategory["SAFETY"] = "SAFETY";
    ComplianceCategory["TRAINING"] = "TRAINING";
    ComplianceCategory["DOCUMENTATION"] = "DOCUMENTATION";
})(ComplianceCategory || (exports.ComplianceCategory = ComplianceCategory = {}));
var ChecklistItemStatus;
(function (ChecklistItemStatus) {
    ChecklistItemStatus["PENDING"] = "PENDING";
    ChecklistItemStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ChecklistItemStatus["COMPLETED"] = "COMPLETED";
    ChecklistItemStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    ChecklistItemStatus["FAILED"] = "FAILED";
})(ChecklistItemStatus || (exports.ChecklistItemStatus = ChecklistItemStatus = {}));
let ComplianceChecklistItem = class ComplianceChecklistItem extends sequelize_typescript_1.Model {
    requirement;
    description;
    category;
    status;
    evidence;
    notes;
    dueDate;
    completedAt;
    completedBy;
    reportId;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ComplianceChecklistItem', instance);
    }
};
exports.ComplianceChecklistItem = ComplianceChecklistItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "requirement", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ChecklistItemStatus)],
        },
        allowNull: false,
        defaultValue: ChecklistItemStatus.PENDING,
    }),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "evidence", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceChecklistItem.prototype, "dueDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceChecklistItem.prototype, "completedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "completedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./compliance-report.model').ComplianceReport),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceChecklistItem.prototype, "reportId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./compliance-report.model').ComplianceReport),
    __metadata("design:type", Object)
], ComplianceChecklistItem.prototype, "report", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceChecklistItem.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceChecklistItem.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ComplianceChecklistItem]),
    __metadata("design:returntype", Promise)
], ComplianceChecklistItem, "auditPHIAccess", null);
exports.ComplianceChecklistItem = ComplianceChecklistItem = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'compliance_checklist_items',
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
                fields: ['dueDate'],
            },
            {
                fields: ['completedAt'],
            },
            {
                fields: ['reportId'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_compliance_checklist_item_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_compliance_checklist_item_updated_at',
            },
        ],
    })
], ComplianceChecklistItem);
//# sourceMappingURL=compliance-checklist-item.model.js.map