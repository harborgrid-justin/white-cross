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
exports.Allergy = exports.AllergySeverity = exports.AllergyType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
var AllergyType;
(function (AllergyType) {
    AllergyType["FOOD"] = "FOOD";
    AllergyType["MEDICATION"] = "MEDICATION";
    AllergyType["ENVIRONMENTAL"] = "ENVIRONMENTAL";
    AllergyType["INSECT"] = "INSECT";
    AllergyType["LATEX"] = "LATEX";
    AllergyType["OTHER"] = "OTHER";
})(AllergyType || (exports.AllergyType = AllergyType = {}));
var AllergySeverity;
(function (AllergySeverity) {
    AllergySeverity["MILD"] = "MILD";
    AllergySeverity["MODERATE"] = "MODERATE";
    AllergySeverity["SEVERE"] = "SEVERE";
    AllergySeverity["LIFE_THREATENING"] = "LIFE_THREATENING";
})(AllergySeverity || (exports.AllergySeverity = AllergySeverity = {}));
let Allergy = class Allergy extends sequelize_typescript_1.Model {
    studentId;
    allergen;
    allergyType;
    severity;
    symptoms;
    reactions;
    treatment;
    emergencyProtocol;
    onsetDate;
    diagnosedDate;
    diagnosedBy;
    verified;
    verifiedBy;
    verificationDate;
    active;
    notes;
    epiPenRequired;
    epiPenLocation;
    epiPenExpiration;
    healthRecordId;
    createdBy;
    updatedBy;
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('Allergy', instance.id, action, changedFields, options?.transaction);
        }
    }
    static async validateVerification(instance) {
        if (instance.changed('verified') && instance.verified) {
            if (!instance.verifiedBy) {
                throw new Error('verifiedBy is required when marking allergy as verified');
            }
            instance.verificationDate = new Date();
        }
    }
    static async validateEpiPen(instance) {
        if (instance.epiPenRequired && !instance.epiPenLocation) {
            throw new Error('epiPenLocation is required when EpiPen is required');
        }
        if (instance.epiPenExpiration && instance.epiPenExpiration < new Date()) {
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            await logModelPHIAccess('Allergy', instance.id, 'UPDATE', ['epiPenExpiration - EXPIRED'], undefined);
        }
    }
    static async setInitialVerification(instance) {
        if (!instance.verified && instance.verifiedBy) {
            instance.verified = true;
            instance.verificationDate = new Date();
        }
    }
    isEpiPenExpired() {
        if (!this.epiPenRequired || !this.epiPenExpiration) {
            return false;
        }
        return this.epiPenExpiration < new Date();
    }
    getDaysUntilEpiPenExpiration() {
        if (!this.epiPenRequired || !this.epiPenExpiration) {
            return null;
        }
        const diff = this.epiPenExpiration.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
};
exports.Allergy = Allergy;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Allergy.prototype, "id", void 0);
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
    __metadata("design:type", String)
], Allergy.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "allergen", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(AllergyType.OTHER),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AllergyType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "allergyType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(AllergySeverity)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Allergy.prototype, "symptoms", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], Allergy.prototype, "reactions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Allergy.prototype, "treatment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "emergencyProtocol", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "onsetDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ name: 'idx_allergy_diagnosed_date' }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "diagnosedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Allergy.prototype, "diagnosedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Allergy.prototype, "verified", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "verifiedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "verificationDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Allergy.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Allergy.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Allergy.prototype, "epiPenRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Allergy.prototype, "epiPenLocation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "epiPenExpiration", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "healthRecordId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Allergy.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Allergy.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student),
    __metadata("design:type", Object)
], Allergy.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Allergy, Object]),
    __metadata("design:returntype", Promise)
], Allergy, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Allergy]),
    __metadata("design:returntype", Promise)
], Allergy, "validateVerification", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Allergy]),
    __metadata("design:returntype", Promise)
], Allergy, "validateEpiPen", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Allergy]),
    __metadata("design:returntype", Promise)
], Allergy, "setInitialVerification", null);
exports.Allergy = Allergy = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                active: true,
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
        byStudent: (studentId) => ({
            where: { studentId, active: true },
            order: [
                ['severity', 'DESC'],
                ['allergen', 'ASC'],
            ],
        }),
        byType: (allergyType) => ({
            where: { allergyType, active: true },
            order: [['severity', 'DESC']],
        }),
        bySeverity: (severity) => ({
            where: { severity, active: true },
            order: [['allergen', 'ASC']],
        }),
        severe: {
            where: {
                severity: {
                    [sequelize_1.Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
                },
                active: true,
            },
            order: [
                ['severity', 'DESC'],
                ['allergen', 'ASC'],
            ],
        },
        requiresEpiPen: {
            where: {
                epiPenRequired: true,
                active: true,
            },
            order: [['epiPenExpiration', 'ASC']],
        },
        expiredEpiPen: {
            where: {
                epiPenRequired: true,
                epiPenExpiration: {
                    [sequelize_1.Op.lt]: new Date(),
                },
                active: true,
            },
            order: [['epiPenExpiration', 'ASC']],
        },
        unverified: {
            where: {
                verified: false,
                active: true,
            },
            order: [
                ['severity', 'DESC'],
                ['createdAt', 'ASC'],
            ],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'allergies',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'active'],
            },
            {
                fields: ['allergyType', 'severity'],
            },
            {
                fields: ['epiPenExpiration'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_allergy_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_allergy_updated_at',
            },
            {
                fields: ['diagnosedDate'],
                name: 'idx_allergy_diagnosed_date',
            },
        ],
    })
], Allergy);
//# sourceMappingURL=allergy.model.js.map