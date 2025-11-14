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
exports.ConsentForm = exports.ConsentType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ConsentType;
(function (ConsentType) {
    ConsentType["MEDICATION_ADMINISTRATION"] = "MEDICATION_ADMINISTRATION";
    ConsentType["PHOTO_RELEASE"] = "PHOTO_RELEASE";
    ConsentType["FIELD_TRIP"] = "FIELD_TRIP";
    ConsentType["EMERGENCY_TREATMENT"] = "EMERGENCY_TREATMENT";
    ConsentType["DATA_SHARING"] = "DATA_SHARING";
    ConsentType["RESEARCH"] = "RESEARCH";
})(ConsentType || (exports.ConsentType = ConsentType = {}));
let ConsentForm = class ConsentForm extends sequelize_typescript_1.Model {
    type;
    title;
    description;
    content;
    isActive;
    expiresAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ConsentForm', instance);
    }
};
exports.ConsentForm = ConsentForm;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ConsentForm.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConsentType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsentForm.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsentForm.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsentForm.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsentForm.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        defaultValue: '1.0',
    }),
    __metadata("design:type", String)
], ConsentForm.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ConsentForm.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ConsentForm.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ConsentForm.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ConsentForm.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ConsentForm]),
    __metadata("design:returntype", Promise)
], ConsentForm, "auditPHIAccess", null);
exports.ConsentForm = ConsentForm = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'consent_forms',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['type'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['expiresAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_consent_form_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_consent_form_updated_at',
            },
        ],
    })
], ConsentForm);
//# sourceMappingURL=consent-form.model.js.map