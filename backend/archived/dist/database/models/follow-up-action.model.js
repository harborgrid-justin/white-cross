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
exports.FollowUpAction = exports.ActionPriority = exports.ActionStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ActionStatus;
(function (ActionStatus) {
    ActionStatus["PENDING"] = "PENDING";
    ActionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ActionStatus["COMPLETED"] = "COMPLETED";
    ActionStatus["CANCELLED"] = "CANCELLED";
})(ActionStatus || (exports.ActionStatus = ActionStatus = {}));
var ActionPriority;
(function (ActionPriority) {
    ActionPriority["LOW"] = "LOW";
    ActionPriority["MEDIUM"] = "MEDIUM";
    ActionPriority["HIGH"] = "HIGH";
    ActionPriority["URGENT"] = "URGENT";
})(ActionPriority || (exports.ActionPriority = ActionPriority = {}));
let FollowUpAction = class FollowUpAction extends sequelize_typescript_1.Model {
    incidentReportId;
    action;
    dueDate;
    priority;
    status;
    assignedTo;
    completedAt;
    completedBy;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('FollowUpAction', instance);
    }
};
exports.FollowUpAction = FollowUpAction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], FollowUpAction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./incident-report.model').IncidentReport),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'ID of the incident report this action belongs to',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAction.prototype, "incidentReportId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'Description of the follow-up action to be taken',
    }),
    __metadata("design:type", String)
], FollowUpAction.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Date and time when this action is due',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], FollowUpAction.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ActionPriority.MEDIUM),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ActionPriority)],
        },
        allowNull: false,
        defaultValue: ActionPriority.MEDIUM,
        comment: 'Priority level of the action',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAction.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ActionStatus.PENDING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ActionStatus)],
        },
        allowNull: false,
        defaultValue: ActionStatus.PENDING,
        comment: 'Current status of the action',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAction.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the user assigned to complete this action',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], FollowUpAction.prototype, "assignedTo", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Date and time when the action was completed',
    }),
    __metadata("design:type", Date)
], FollowUpAction.prototype, "completedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the user who completed the action',
    }),
    __metadata("design:type", String)
], FollowUpAction.prototype, "completedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Additional notes about the action or completion',
    }),
    __metadata("design:type", String)
], FollowUpAction.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the action was created',
    }),
    __metadata("design:type", Date)
], FollowUpAction.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the action was last updated',
    }),
    __metadata("design:type", Date)
], FollowUpAction.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./incident-report.model').IncidentReport, {
        foreignKey: 'incidentReportId',
        as: 'incidentReport',
    }),
    __metadata("design:type", Object)
], FollowUpAction.prototype, "incidentReport", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FollowUpAction]),
    __metadata("design:returntype", Promise)
], FollowUpAction, "auditPHIAccess", null);
exports.FollowUpAction = FollowUpAction = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'follow_up_actions',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['incidentReportId', 'status'] },
            { fields: ['assignedTo', 'status'] },
            { fields: ['dueDate', 'status'] },
            {
                fields: ['createdAt'],
                name: 'idx_follow_up_action_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_follow_up_action_updated_at',
            },
        ],
    })
], FollowUpAction);
//# sourceMappingURL=follow-up-action.model.js.map