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
exports.PhiDisclosureAudit = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let PhiDisclosureAudit = class PhiDisclosureAudit extends sequelize_typescript_1.Model {
    disclosureId;
    action;
    changes;
    performedBy;
    ipAddress;
    userAgent;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PhiDisclosureAudit', instance);
    }
};
exports.PhiDisclosureAudit = PhiDisclosureAudit;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./phi-disclosure.model').PhiDisclosure),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "disclosureId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "action", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], PhiDisclosureAudit.prototype, "changes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "performedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(45)),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "ipAddress", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PhiDisclosureAudit.prototype, "userAgent", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./phi-disclosure.model').PhiDisclosure),
    __metadata("design:type", Object)
], PhiDisclosureAudit.prototype, "disclosure", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosureAudit.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PhiDisclosureAudit]),
    __metadata("design:returntype", Promise)
], PhiDisclosureAudit, "auditPHIAccess", null);
exports.PhiDisclosureAudit = PhiDisclosureAudit = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'phi_disclosure_audits',
        timestamps: false,
        indexes: [
            {
                fields: ['disclosureId'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_phi_disclosure_audit_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_phi_disclosure_audit_updated_at',
            },
        ],
    })
], PhiDisclosureAudit);
//# sourceMappingURL=phi-disclosure-audit.model.js.map