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
exports.PolicyAcknowledgment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let PolicyAcknowledgment = class PolicyAcknowledgment extends sequelize_typescript_1.Model {
    policyId;
    userId;
    acknowledgedAt;
    ipAddress;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PolicyAcknowledgment', instance);
    }
};
exports.PolicyAcknowledgment = PolicyAcknowledgment;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PolicyAcknowledgment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./policy-document.model').PolicyDocument),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PolicyAcknowledgment.prototype, "policyId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PolicyAcknowledgment.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], PolicyAcknowledgment.prototype, "acknowledgedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(45)),
    __metadata("design:type", String)
], PolicyAcknowledgment.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./policy-document.model').PolicyDocument),
    __metadata("design:type", Object)
], PolicyAcknowledgment.prototype, "policy", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PolicyAcknowledgment]),
    __metadata("design:returntype", Promise)
], PolicyAcknowledgment, "auditPHIAccess", null);
exports.PolicyAcknowledgment = PolicyAcknowledgment = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'policy_acknowledgments',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['policyId', 'userId'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_policy_acknowledgment_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_policy_acknowledgment_updated_at',
            },
        ],
    })
], PolicyAcknowledgment);
//# sourceMappingURL=policy-acknowledgment.model.js.map