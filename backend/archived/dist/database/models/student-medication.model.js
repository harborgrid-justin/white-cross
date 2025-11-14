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
exports.StudentMedication = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
let StudentMedication = class StudentMedication extends sequelize_typescript_1.Model {
    studentId;
    medicationId;
    dosage;
    frequency;
    route;
    instructions;
    startDate;
    endDate;
    isActive;
    prescribedBy;
    prescriptionNumber;
    refillsRemaining;
    createdBy;
    updatedBy;
    get isCurrentlyActive() {
        const now = new Date();
        const isAfterStart = now >= this.startDate;
        const isBeforeEnd = !this.endDate || now <= this.endDate;
        return this.isActive && isAfterStart && isBeforeEnd;
    }
    get daysRemaining() {
        if (!this.endDate)
            return null;
        const now = new Date();
        const diff = this.endDate.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    static async auditPHIAccess(instance, options) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const action = instance.isNewRecord ? 'CREATE' : 'UPDATE';
            await logModelPHIAccess('StudentMedication', instance.id, action, changedFields, options?.transaction);
        }
    }
};
exports.StudentMedication = StudentMedication;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], StudentMedication.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./medication.model').Medication),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "medicationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "dosage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "frequency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "route", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], StudentMedication.prototype, "instructions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], StudentMedication.prototype, "startDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], StudentMedication.prototype, "endDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], StudentMedication.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "prescribedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "prescriptionNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentMedication.prototype, "refillsRemaining", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], StudentMedication.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], StudentMedication.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], StudentMedication.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student),
    __metadata("design:type", Object)
], StudentMedication.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./medication.model').Medication),
    __metadata("design:type", Object)
], StudentMedication.prototype, "medication", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StudentMedication, Object]),
    __metadata("design:returntype", Promise)
], StudentMedication, "auditPHIAccess", null);
exports.StudentMedication = StudentMedication = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'student_medications',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['medicationId'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['startDate'],
            },
            {
                fields: ['endDate'],
            },
            {
                fields: ['studentId', 'isActive'],
            },
            {
                fields: ['createdBy'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_student_medication_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_student_medication_updated_at',
            },
        ],
    })
], StudentMedication);
//# sourceMappingURL=student-medication.model.js.map