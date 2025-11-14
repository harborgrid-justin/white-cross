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
exports.ChronicCondition = exports.ConditionStatus = exports.AccommodationType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
var enums_1 = require("../../services/chronic-condition/enums");
Object.defineProperty(exports, "AccommodationType", { enumerable: true, get: function () { return enums_1.AccommodationType; } });
var ConditionStatus;
(function (ConditionStatus) {
    ConditionStatus["ACTIVE"] = "ACTIVE";
    ConditionStatus["MANAGED"] = "MANAGED";
    ConditionStatus["RESOLVED"] = "RESOLVED";
    ConditionStatus["MONITORING"] = "MONITORING";
})(ConditionStatus || (exports.ConditionStatus = ConditionStatus = {}));
let ChronicCondition = class ChronicCondition extends sequelize_typescript_1.Model {
    studentId;
    healthRecordId;
    condition;
    icdCode;
    diagnosedDate;
    diagnosedBy;
    status;
    severity;
    notes;
    carePlan;
    medications;
    restrictions;
    triggers;
    accommodations;
    emergencyProtocol;
    lastReviewDate;
    nextReviewDate;
    requiresIEP;
    requires504;
    isActive;
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('ChronicCondition', instance.id, action, changedFields, options?.transaction);
        }
    }
};
exports.ChronicCondition = ChronicCondition;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ChronicCondition.prototype, "id", void 0);
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
], ChronicCondition.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./health-record.model').HealthRecord),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "healthRecordId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "condition", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        validate: {
            is: {
                args: /^[A-Z]\d{2}(\.\d{1,4})?$/,
                msg: 'ICD-10 code must be in format A00 or A00.0 or A00.00 (letter followed by 2 digits, optional decimal and 1-4 digits)',
            },
        },
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "icdCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ChronicCondition.prototype, "diagnosedDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "diagnosedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConditionStatus)],
        },
        allowNull: false,
        defaultValue: ConditionStatus.ACTIVE,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ChronicCondition.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "severity", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "carePlan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfStrings(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Medications must be an array');
                }
                if (!value.every((item) => typeof item === 'string')) {
                    throw new Error('All medication entries must be strings');
                }
            },
        },
    }),
    __metadata("design:type", Array)
], ChronicCondition.prototype, "medications", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfStrings(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Restrictions must be an array');
                }
                if (!value.every((item) => typeof item === 'string')) {
                    throw new Error('All restriction entries must be strings');
                }
            },
        },
    }),
    __metadata("design:type", Array)
], ChronicCondition.prototype, "restrictions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfStrings(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Triggers must be an array');
                }
                if (!value.every((item) => typeof item === 'string')) {
                    throw new Error('All trigger entries must be strings');
                }
            },
        },
    }),
    __metadata("design:type", Array)
], ChronicCondition.prototype, "triggers", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
        validate: {
            isArrayOfStrings(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Accommodations must be an array');
                }
                if (!value.every((item) => typeof item === 'string')) {
                    throw new Error('All accommodation entries must be strings');
                }
            },
        },
    }),
    __metadata("design:type", Array)
], ChronicCondition.prototype, "accommodations", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ChronicCondition.prototype, "emergencyProtocol", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], ChronicCondition.prototype, "lastReviewDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], ChronicCondition.prototype, "nextReviewDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], ChronicCondition.prototype, "requiresIEP", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], ChronicCondition.prototype, "requires504", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], ChronicCondition.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ChronicCondition.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ChronicCondition.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], ChronicCondition.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./health-record.model').HealthRecord, {
        foreignKey: 'healthRecordId',
        as: 'healthRecord',
    }),
    __metadata("design:type", Object)
], ChronicCondition.prototype, "healthRecord", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChronicCondition, Object]),
    __metadata("design:returntype", Promise)
], ChronicCondition, "auditPHIAccess", null);
exports.ChronicCondition = ChronicCondition = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'chronic_conditions',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'isActive'],
            },
            {
                fields: ['status', 'isActive'],
            },
            {
                fields: ['nextReviewDate'],
            },
            {
                fields: ['requiresIEP'],
            },
            {
                fields: ['requires504'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_chronic_condition_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_chronic_condition_updated_at',
            },
        ],
    })
], ChronicCondition);
//# sourceMappingURL=chronic-condition.model.js.map