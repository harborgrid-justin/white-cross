"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaccination = exports.ComplianceStatus = exports.RouteOfAdministration = exports.SiteOfAdministration = exports.VaccineType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
var VaccineType;
(function (VaccineType) {
    VaccineType["COVID_19"] = "COVID_19";
    VaccineType["FLU"] = "FLU";
    VaccineType["MEASLES"] = "MEASLES";
    VaccineType["MUMPS"] = "MUMPS";
    VaccineType["RUBELLA"] = "RUBELLA";
    VaccineType["MMR"] = "MMR";
    VaccineType["POLIO"] = "POLIO";
    VaccineType["HEPATITIS_A"] = "HEPATITIS_A";
    VaccineType["HEPATITIS_B"] = "HEPATITIS_B";
    VaccineType["VARICELLA"] = "VARICELLA";
    VaccineType["TETANUS"] = "TETANUS";
    VaccineType["DIPHTHERIA"] = "DIPHTHERIA";
    VaccineType["PERTUSSIS"] = "PERTUSSIS";
    VaccineType["TDAP"] = "TDAP";
    VaccineType["DTAP"] = "DTAP";
    VaccineType["HIB"] = "HIB";
    VaccineType["PNEUMOCOCCAL"] = "PNEUMOCOCCAL";
    VaccineType["ROTAVIRUS"] = "ROTAVIRUS";
    VaccineType["MENINGOCOCCAL"] = "MENINGOCOCCAL";
    VaccineType["HPV"] = "HPV";
    VaccineType["OTHER"] = "OTHER";
})(VaccineType || (exports.VaccineType = VaccineType = {}));
var SiteOfAdministration;
(function (SiteOfAdministration) {
    SiteOfAdministration["ARM_LEFT"] = "ARM_LEFT";
    SiteOfAdministration["ARM_RIGHT"] = "ARM_RIGHT";
    SiteOfAdministration["THIGH_LEFT"] = "THIGH_LEFT";
    SiteOfAdministration["THIGH_RIGHT"] = "THIGH_RIGHT";
    SiteOfAdministration["DELTOID_LEFT"] = "DELTOID_LEFT";
    SiteOfAdministration["DELTOID_RIGHT"] = "DELTOID_RIGHT";
    SiteOfAdministration["BUTTOCK_LEFT"] = "BUTTOCK_LEFT";
    SiteOfAdministration["BUTTOCK_RIGHT"] = "BUTTOCK_RIGHT";
    SiteOfAdministration["ORAL"] = "ORAL";
    SiteOfAdministration["NASAL"] = "NASAL";
    SiteOfAdministration["OTHER"] = "OTHER";
})(SiteOfAdministration || (exports.SiteOfAdministration = SiteOfAdministration = {}));
var RouteOfAdministration;
(function (RouteOfAdministration) {
    RouteOfAdministration["INTRAMUSCULAR"] = "INTRAMUSCULAR";
    RouteOfAdministration["SUBCUTANEOUS"] = "SUBCUTANEOUS";
    RouteOfAdministration["INTRADERMAL"] = "INTRADERMAL";
    RouteOfAdministration["ORAL"] = "ORAL";
    RouteOfAdministration["INTRANASAL"] = "INTRANASAL";
    RouteOfAdministration["INTRAVENOUS"] = "INTRAVENOUS";
    RouteOfAdministration["OTHER"] = "OTHER";
})(RouteOfAdministration || (exports.RouteOfAdministration = RouteOfAdministration = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["OVERDUE"] = "OVERDUE";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "PARTIALLY_COMPLIANT";
    ComplianceStatus["EXEMPT"] = "EXEMPT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
let Vaccination = class Vaccination extends sequelize_typescript_1.Model {
    studentId;
    healthRecordId;
    vaccineName;
    vaccineType;
    manufacturer;
    lotNumber;
    cvxCode;
    ndcCode;
    doseNumber;
    totalDoses;
    seriesComplete;
    administrationDate;
    administeredBy;
    administeredByRole;
    facility;
    siteOfAdministration;
    routeOfAdministration;
    dosageAmount;
    expirationDate;
    nextDueDate;
    reactions;
    adverseEvents;
    exemptionStatus;
    exemptionReason;
    exemptionDocument;
    complianceStatus;
    vfcEligibility;
    visProvided;
    visDate;
    consentObtained;
    consentBy;
    notes;
    createdBy;
    updatedBy;
    student;
    healthRecord;
    isOverdue() {
        if (!this.nextDueDate || this.seriesComplete) {
            return false;
        }
        return new Date() > this.nextDueDate;
    }
    getDaysUntilNextDose() {
        if (!this.nextDueDate || this.seriesComplete) {
            return null;
        }
        const diff = this.nextDueDate.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    getSeriesCompletionPercentage() {
        if (!this.totalDoses || !this.doseNumber) {
            return null;
        }
        return Math.round((this.doseNumber / this.totalDoses) * 100);
    }
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('Vaccination', instance.id, action, changedFields, options?.transaction);
        }
    }
};
exports.Vaccination = Vaccination;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Vaccination.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Vaccination.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./health-record.model').HealthRecord),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "healthRecordId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "vaccineName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(VaccineType)],
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Vaccination.prototype, "vaccineType", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "manufacturer", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "lotNumber", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        validate: {
            is: {
                args: /^\d{1,3}$/,
                msg: 'CVX code must be 1-3 digits (e.g., 03, 21, 208)',
            },
        },
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "cvxCode", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "ndcCode", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Vaccination.prototype, "doseNumber", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Vaccination.prototype, "totalDoses", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Vaccination.prototype, "seriesComplete", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], Vaccination.prototype, "administrationDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "administeredBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "administeredByRole", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "facility", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(SiteOfAdministration)],
        },
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "siteOfAdministration", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RouteOfAdministration)],
        },
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "routeOfAdministration", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "dosageAmount", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], Vaccination.prototype, "expirationDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], Vaccination.prototype, "nextDueDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "reactions", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
    }),
    __metadata("design:type", Object)
], Vaccination.prototype, "adverseEvents", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Vaccination.prototype, "exemptionStatus", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "exemptionReason", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "exemptionDocument", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceStatus)],
        },
        allowNull: false,
        defaultValue: ComplianceStatus.COMPLIANT,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Vaccination.prototype, "complianceStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Vaccination.prototype, "vfcEligibility", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Vaccination.prototype, "visProvided", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], Vaccination.prototype, "visDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Vaccination.prototype, "consentObtained", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "consentBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Vaccination.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Vaccination.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Vaccination.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Vaccination.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], Vaccination.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./health-record.model').HealthRecord, {
        foreignKey: 'healthRecordId',
        as: 'healthRecord',
    }),
    __metadata("design:type", Object)
], Vaccination.prototype, "healthRecord", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vaccination, Object]),
    __metadata("design:returntype", Promise)
], Vaccination, "auditPHIAccess", null);
exports.Vaccination = Vaccination = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'vaccinations',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'administrationDate'],
            },
            {
                fields: ['vaccineType', 'complianceStatus'],
            },
            {
                fields: ['nextDueDate'],
            },
            {
                fields: ['expirationDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_vaccination_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_vaccination_updated_at',
            },
        ],
    })
], Vaccination);
//# sourceMappingURL=vaccination.model.js.map