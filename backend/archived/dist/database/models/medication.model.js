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
exports.Medication = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
let Medication = class Medication extends sequelize_typescript_1.Model {
    name;
    genericName;
    dosageForm;
    strength;
    manufacturer;
    ndc;
    isControlled;
    deaSchedule;
    requiresWitness;
    isActive;
    deletedBy;
    static async auditAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('Medication', instance.id, action, changedFields, options?.transaction);
        }
    }
    static async validateControlledSchedule(instance) {
        if (instance.isControlled && !instance.deaSchedule) {
            throw new Error('Controlled medications must have a DEA schedule');
        }
        if (!instance.isControlled && instance.deaSchedule) {
            throw new Error('Non-controlled medications cannot have a DEA schedule');
        }
    }
    static async setWitnessRequirement(instance) {
        if (instance.isControlled &&
            ['II', 'III'].includes(instance.deaSchedule || '')) {
            instance.requiresWitness = true;
        }
    }
};
exports.Medication = Medication;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Medication.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Medication.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Medication.prototype, "genericName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Medication.prototype, "dosageForm", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Medication.prototype, "strength", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ name: 'idx_medications_manufacturer' }),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Medication.prototype, "manufacturer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        unique: true,
        validate: {
            is: {
                args: /^(\d{4}-\d{4}-\d{2}|\d{5}-\d{3}-\d{2}|\d{5}-\d{4}-\d{1}|\d{10}|\d{11})$/,
                msg: 'NDC must be in valid format: 4-4-2 (1234-5678-90), 5-3-2 (12345-678-90), 5-4-1 (12345-6789-0), 10 digits (1234567890), or 11 digits (12345678901)',
            },
            len: {
                args: [10, 14],
                msg: 'NDC must be 10-14 characters (including hyphens)',
            },
        },
    }),
    __metadata("design:type", String)
], Medication.prototype, "ndc", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Medication.prototype, "isControlled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('I', 'II', 'III', 'IV', 'V'),
    }),
    __metadata("design:type", String)
], Medication.prototype, "deaSchedule", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Medication.prototype, "requiresWitness", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Medication.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Medication.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Medication.prototype, "deletedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Medication.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Medication.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./student-medication.model').StudentMedication, {
        foreignKey: 'medicationId',
        as: 'studentMedications',
    }),
    __metadata("design:type", Array)
], Medication.prototype, "studentMedications", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./medication-log.model').MedicationLog, {
        foreignKey: 'medicationId',
        as: 'medicationLogs',
    }),
    __metadata("design:type", Array)
], Medication.prototype, "medicationLogs", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Medication, Object]),
    __metadata("design:returntype", Promise)
], Medication, "auditAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Medication]),
    __metadata("design:returntype", Promise)
], Medication, "validateControlledSchedule", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Medication]),
    __metadata("design:returntype", Promise)
], Medication, "setWitnessRequirement", null);
exports.Medication = Medication = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
                deletedAt: null,
            },
            order: [['name', 'ASC']],
        },
        controlled: {
            where: {
                isControlled: true,
                isActive: true,
            },
            order: [
                ['deaSchedule', 'ASC'],
                ['name', 'ASC'],
            ],
        },
        byDEASchedule: (schedule) => ({
            where: {
                deaSchedule: schedule,
                isActive: true,
            },
            order: [['name', 'ASC']],
        }),
        byDosageForm: (form) => ({
            where: {
                dosageForm: form,
                isActive: true,
            },
            order: [['name', 'ASC']],
        }),
        requiresWitness: {
            where: {
                requiresWitness: true,
                isActive: true,
            },
            order: [['name', 'ASC']],
        },
        byManufacturer: (manufacturer) => ({
            where: {
                manufacturer,
                isActive: true,
            },
            order: [['name', 'ASC']],
        }),
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'medications',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['name'],
                name: 'idx_medications_name',
            },
            {
                fields: ['genericName'],
                name: 'idx_medications_generic_name',
            },
            {
                fields: ['ndc'],
                unique: true,
                name: 'idx_medications_ndc_unique',
            },
            {
                fields: ['isControlled'],
                name: 'idx_medications_controlled',
            },
            {
                fields: ['isActive'],
                name: 'idx_medications_active',
            },
            {
                fields: ['isActive', 'name'],
                name: 'idx_medications_active_name',
            },
            {
                fields: ['isControlled', 'deaSchedule'],
                name: 'idx_medications_controlled_schedule',
            },
            {
                fields: ['dosageForm', 'isActive'],
                name: 'idx_medications_form_active',
            },
            {
                fields: ['createdAt'],
                name: 'idx_medications_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_medications_updated_at',
            },
            {
                fields: ['manufacturer'],
                name: 'idx_medications_manufacturer',
            },
        ],
    })
], Medication);
//# sourceMappingURL=medication.model.js.map