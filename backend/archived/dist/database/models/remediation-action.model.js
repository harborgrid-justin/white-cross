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
exports.RemediationAction = exports.RemediationStatus = exports.RemediationPriority = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var RemediationPriority;
(function (RemediationPriority) {
    RemediationPriority["LOW"] = "LOW";
    RemediationPriority["MEDIUM"] = "MEDIUM";
    RemediationPriority["HIGH"] = "HIGH";
    RemediationPriority["URGENT"] = "URGENT";
})(RemediationPriority || (exports.RemediationPriority = RemediationPriority = {}));
var RemediationStatus;
(function (RemediationStatus) {
    RemediationStatus["PLANNED"] = "PLANNED";
    RemediationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RemediationStatus["COMPLETED"] = "COMPLETED";
    RemediationStatus["VERIFIED"] = "VERIFIED";
    RemediationStatus["DEFERRED"] = "DEFERRED";
})(RemediationStatus || (exports.RemediationStatus = RemediationStatus = {}));
let RemediationAction = class RemediationAction extends sequelize_typescript_1.Model {
    violationId;
    action;
    priority;
    status;
    assignedTo;
    dueDate;
    implementationNotes;
    verificationNotes;
    completedAt;
    verifiedBy;
    verifiedAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('RemediationAction', instance);
    }
};
exports.RemediationAction = RemediationAction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], RemediationAction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RemediationAction.prototype, "violationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RemediationAction.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RemediationPriority)],
        },
        allowNull: false,
        defaultValue: RemediationPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], RemediationAction.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RemediationStatus)],
        },
        allowNull: false,
        defaultValue: RemediationStatus.PLANNED,
    }),
    __metadata("design:type", String)
], RemediationAction.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RemediationAction.prototype, "assignedTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], RemediationAction.prototype, "dueDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], RemediationAction.prototype, "implementationNotes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], RemediationAction.prototype, "verificationNotes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RemediationAction.prototype, "completedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], RemediationAction.prototype, "verifiedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RemediationAction.prototype, "verifiedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RemediationAction.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], RemediationAction.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemediationAction]),
    __metadata("design:returntype", Promise)
], RemediationAction, "auditPHIAccess", null);
exports.RemediationAction = RemediationAction = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'remediation_actions',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['violationId'],
            },
            {
                fields: ['priority'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['assignedTo'],
            },
            {
                fields: ['dueDate'],
            },
            {
                fields: ['completedAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_remediation_action_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_remediation_action_updated_at',
            },
        ],
    })
], RemediationAction);
//# sourceMappingURL=remediation-action.model.js.map