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
exports.PhiDisclosure = exports.RecipientType = exports.DisclosureMethod = exports.DisclosurePurpose = exports.DisclosureType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var DisclosureType;
(function (DisclosureType) {
    DisclosureType["TREATMENT"] = "TREATMENT";
    DisclosureType["PAYMENT"] = "PAYMENT";
    DisclosureType["HEALTHCARE_OPERATIONS"] = "HEALTHCARE_OPERATIONS";
    DisclosureType["AUTHORIZATION"] = "AUTHORIZATION";
    DisclosureType["REQUIRED_BY_LAW"] = "REQUIRED_BY_LAW";
    DisclosureType["PUBLIC_HEALTH"] = "PUBLIC_HEALTH";
    DisclosureType["RESEARCH"] = "RESEARCH";
})(DisclosureType || (exports.DisclosureType = DisclosureType = {}));
var DisclosurePurpose;
(function (DisclosurePurpose) {
    DisclosurePurpose["TREATMENT"] = "TREATMENT";
    DisclosurePurpose["PAYMENT"] = "PAYMENT";
    DisclosurePurpose["OPERATIONS"] = "OPERATIONS";
    DisclosurePurpose["LEGAL_REQUIREMENT"] = "LEGAL_REQUIREMENT";
    DisclosurePurpose["PUBLIC_HEALTH"] = "PUBLIC_HEALTH";
    DisclosurePurpose["RESEARCH"] = "RESEARCH";
    DisclosurePurpose["PATIENT_REQUEST"] = "PATIENT_REQUEST";
})(DisclosurePurpose || (exports.DisclosurePurpose = DisclosurePurpose = {}));
var DisclosureMethod;
(function (DisclosureMethod) {
    DisclosureMethod["VERBAL"] = "VERBAL";
    DisclosureMethod["WRITTEN"] = "WRITTEN";
    DisclosureMethod["ELECTRONIC"] = "ELECTRONIC";
    DisclosureMethod["FAX"] = "FAX";
    DisclosureMethod["PHONE"] = "PHONE";
})(DisclosureMethod || (exports.DisclosureMethod = DisclosureMethod = {}));
var RecipientType;
(function (RecipientType) {
    RecipientType["HEALTHCARE_PROVIDER"] = "HEALTHCARE_PROVIDER";
    RecipientType["INSURANCE"] = "INSURANCE";
    RecipientType["PARENT_GUARDIAN"] = "PARENT_GUARDIAN";
    RecipientType["SCHOOL_OFFICIAL"] = "SCHOOL_OFFICIAL";
    RecipientType["GOVERNMENT_AGENCY"] = "GOVERNMENT_AGENCY";
    RecipientType["RESEARCHER"] = "RESEARCHER";
    RecipientType["OTHER"] = "OTHER";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
let PhiDisclosure = class PhiDisclosure extends sequelize_typescript_1.Model {
    studentId;
    disclosureType;
    purpose;
    method;
    disclosureDate;
    informationDisclosed;
    minimumNecessary;
    recipientType;
    recipientName;
    recipientOrganization;
    recipientAddress;
    recipientPhone;
    recipientEmail;
    authorizationObtained;
    authorizationDate;
    authorizationExpiryDate;
    patientRequested;
    disclosedBy;
    followUpRequired;
    followUpCompleted;
    followUpDate;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PhiDisclosure', instance);
    }
};
exports.PhiDisclosure = PhiDisclosure;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DisclosureType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "disclosureType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DisclosurePurpose)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "purpose", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DisclosureMethod)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "method", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "disclosureDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], PhiDisclosure.prototype, "informationDisclosed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "minimumNecessary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RecipientType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientOrganization", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientAddress", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientPhone", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "recipientEmail", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], PhiDisclosure.prototype, "authorizationObtained", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "authorizationDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "authorizationExpiryDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], PhiDisclosure.prototype, "patientRequested", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "disclosedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], PhiDisclosure.prototype, "followUpRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], PhiDisclosure.prototype, "followUpCompleted", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "followUpDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PhiDisclosure.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PhiDisclosure.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PhiDisclosure]),
    __metadata("design:returntype", Promise)
], PhiDisclosure, "auditPHIAccess", null);
exports.PhiDisclosure = PhiDisclosure = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'phi_disclosures',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['studentId', 'disclosureDate'],
            },
            {
                fields: ['purpose', 'disclosureDate'],
            },
            {
                fields: ['studentId'],
            },
            {
                fields: ['purpose'],
            },
            {
                fields: ['disclosureDate'],
            },
            {
                fields: ['followUpDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_phi_disclosure_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_phi_disclosure_updated_at',
            },
        ],
    })
], PhiDisclosure);
//# sourceMappingURL=phi-disclosure.model.js.map