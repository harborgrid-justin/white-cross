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
exports.VitalSigns = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
let VitalSigns = class VitalSigns extends sequelize_typescript_1.Model {
    studentId;
    measurementDate;
    temperature;
    temperatureUnit;
    heartRate;
    respiratoryRate;
    bloodPressureSystolic;
    bloodPressureDiastolic;
    oxygenSaturation;
    weight;
    weightUnit;
    height;
    heightUnit;
    bmi;
    pain;
    isAbnormal;
    abnormalFlags;
    measuredBy;
    notes;
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('VitalSigns', instance.id || 'pending', action, changedFields, options?.transaction);
        }
    }
    static async calculateBMI(instance) {
        if (instance.height &&
            instance.weight &&
            instance.heightUnit &&
            instance.weightUnit) {
            let heightM = instance.height;
            let weightKg = instance.weight;
            if (instance.heightUnit === 'inches') {
                heightM = instance.height * 0.0254;
            }
            else if (instance.heightUnit === 'cm') {
                heightM = instance.height / 100;
            }
            if (instance.weightUnit === 'lbs') {
                weightKg = instance.weight * 0.453592;
            }
            instance.bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(2));
        }
    }
    static async checkAbnormalVitals(instance) {
        const abnormalFlags = [];
        if (instance.temperature) {
            if (instance.temperature < 95 || instance.temperature > 100.4) {
                abnormalFlags.push('temperature');
            }
        }
        if (instance.heartRate) {
            if (instance.heartRate < 60 || instance.heartRate > 100) {
                abnormalFlags.push('heartRate');
            }
        }
        if (instance.respiratoryRate) {
            if (instance.respiratoryRate < 12 || instance.respiratoryRate > 20) {
                abnormalFlags.push('respiratoryRate');
            }
        }
        if (instance.bloodPressureSystolic && instance.bloodPressureDiastolic) {
            if (instance.bloodPressureSystolic < 90 ||
                instance.bloodPressureSystolic > 140) {
                abnormalFlags.push('bloodPressure');
            }
            if (instance.bloodPressureDiastolic < 60 ||
                instance.bloodPressureDiastolic > 90) {
                abnormalFlags.push('bloodPressure');
            }
        }
        if (instance.oxygenSaturation) {
            if (instance.oxygenSaturation < 95) {
                abnormalFlags.push('oxygenSaturation');
            }
        }
        instance.abnormalFlags = abnormalFlags;
        instance.isAbnormal = abnormalFlags.length > 0;
    }
};
exports.VitalSigns = VitalSigns;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], VitalSigns.prototype, "id", void 0);
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
], VitalSigns.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], VitalSigns.prototype, "measurementDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], VitalSigns.prototype, "temperature", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('F'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('F', 'C')),
    __metadata("design:type", String)
], VitalSigns.prototype, "temperatureUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VitalSigns.prototype, "heartRate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VitalSigns.prototype, "respiratoryRate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VitalSigns.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VitalSigns.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], VitalSigns.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], VitalSigns.prototype, "weight", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('lbs'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('lbs', 'kg')),
    __metadata("design:type", String)
], VitalSigns.prototype, "weightUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], VitalSigns.prototype, "height", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('inches'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('inches', 'cm')),
    __metadata("design:type", String)
], VitalSigns.prototype, "heightUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], VitalSigns.prototype, "bmi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        validate: {
            min: 0,
            max: 10,
        },
    }),
    __metadata("design:type", Number)
], VitalSigns.prototype, "pain", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], VitalSigns.prototype, "isAbnormal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Array)
], VitalSigns.prototype, "abnormalFlags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], VitalSigns.prototype, "measuredBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], VitalSigns.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], VitalSigns.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], VitalSigns.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], VitalSigns.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VitalSigns, Object]),
    __metadata("design:returntype", Promise)
], VitalSigns, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VitalSigns]),
    __metadata("design:returntype", Promise)
], VitalSigns, "calculateBMI", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VitalSigns]),
    __metadata("design:returntype", Promise)
], VitalSigns, "checkAbnormalVitals", null);
exports.VitalSigns = VitalSigns = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['measurementDate', 'DESC']],
        },
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['measurementDate', 'DESC']],
        }),
        abnormal: {
            where: {
                isAbnormal: true,
            },
            order: [['measurementDate', 'DESC']],
        },
        recent: {
            where: {
                measurementDate: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            order: [['measurementDate', 'DESC']],
        },
        withFlag: (flag) => ({
            where: {
                abnormalFlags: {
                    [sequelize_1.Op.contains]: [flag],
                },
            },
            order: [['measurementDate', 'DESC']],
        }),
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'vital_signs',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['measurementDate'],
            },
            {
                fields: ['isAbnormal'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_vital_signs_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_vital_signs_updated_at',
            },
        ],
    })
], VitalSigns);
//# sourceMappingURL=vital-signs.model.js.map