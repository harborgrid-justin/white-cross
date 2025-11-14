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
exports.Prescription = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const prescription_status_enum_1 = require("../../services/clinical/enums/prescription-status.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let Prescription = class Prescription extends sequelize_typescript_1.Model {
    studentId;
    visitId;
    treatmentPlanId;
    prescribedBy;
    drugName;
    drugCode;
    dosage;
    frequency;
    route;
    quantity;
    quantityFilled;
    refillsAuthorized;
    refillsUsed;
    startDate;
    endDate;
    instructions;
    status;
    pharmacyName;
    filledDate;
    pickedUpDate;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('Prescription', instance);
    }
    static async validateDates(instance) {
        if (instance.endDate && instance.endDate < instance.startDate) {
            throw new Error('End date cannot be before start date');
        }
        if (instance.filledDate && instance.filledDate < instance.startDate) {
            throw new Error('Filled date cannot be before start date');
        }
        if (instance.pickedUpDate &&
            instance.filledDate &&
            instance.pickedUpDate < instance.filledDate) {
            throw new Error('Picked up date cannot be before filled date');
        }
    }
    static async validateRefills(instance) {
        if (instance.refillsUsed > instance.refillsAuthorized) {
            throw new Error('Refills used cannot exceed refills authorized');
        }
        if (instance.quantityFilled > instance.quantity) {
            throw new Error('Quantity filled cannot exceed quantity prescribed');
        }
    }
    static async checkExpiration(instance) {
        if (instance.endDate &&
            new Date() > instance.endDate &&
            instance.status !== prescription_status_enum_1.PrescriptionStatus.EXPIRED) {
            instance.status = prescription_status_enum_1.PrescriptionStatus.EXPIRED;
        }
    }
    isActive() {
        const now = new Date();
        if (this.status === prescription_status_enum_1.PrescriptionStatus.CANCELLED ||
            this.status === prescription_status_enum_1.PrescriptionStatus.EXPIRED) {
            return false;
        }
        if (this.endDate && now > this.endDate) {
            return false;
        }
        return (this.status === prescription_status_enum_1.PrescriptionStatus.FILLED ||
            this.status === prescription_status_enum_1.PrescriptionStatus.PICKED_UP);
    }
    hasRefillsRemaining() {
        return this.refillsUsed < this.refillsAuthorized;
    }
    getRemainingRefills() {
        return Math.max(0, this.refillsAuthorized - this.refillsUsed);
    }
    getDaysSupply() {
        if (!this.endDate)
            return null;
        const diff = this.endDate.getTime() - this.startDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
};
exports.Prescription = Prescription;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Prescription.prototype, "id", void 0);
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
], Prescription.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./clinic-visit.model').ClinicVisit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "visitId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./clinic-visit.model').ClinicVisit, {
        foreignKey: 'visitId',
        as: 'visit',
    }),
    __metadata("design:type", Object)
], Prescription.prototype, "visit", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./treatment-plan.model').TreatmentPlan),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./treatment-plan.model').TreatmentPlan, {
        foreignKey: 'treatmentPlanId',
        as: 'treatmentPlan',
    }),
    __metadata("design:type", Object)
], Prescription.prototype, "treatmentPlan", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], Prescription.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    }),
    __metadata("design:type", String)
], Prescription.prototype, "prescribedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "drugName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        validate: {
            is: {
                args: /^\d{4,5}-\d{4}-\d{1,2}$/,
                msg: 'Drug code must be in NDC format (e.g., 12345-1234-1, 1234-1234-12)',
            },
        },
    }),
    __metadata("design:type", String)
], Prescription.prototype, "drugCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "dosage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "frequency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "route", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Prescription.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Prescription.prototype, "quantityFilled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Prescription.prototype, "refillsAuthorized", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Prescription.prototype, "refillsUsed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Prescription.prototype, "startDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], Prescription.prototype, "endDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "instructions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(prescription_status_enum_1.PrescriptionStatus)],
        },
        allowNull: false,
        defaultValue: prescription_status_enum_1.PrescriptionStatus.PENDING,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Prescription.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Prescription.prototype, "pharmacyName", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Prescription.prototype, "filledDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Prescription.prototype, "pickedUpDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Prescription.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Prescription.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Prescription.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'prescribedBy',
        as: 'prescriber',
    }),
    __metadata("design:type", Object)
], Prescription.prototype, "prescriber", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prescription]),
    __metadata("design:returntype", Promise)
], Prescription, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prescription]),
    __metadata("design:returntype", Promise)
], Prescription, "validateDates", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prescription]),
    __metadata("design:returntype", Promise)
], Prescription, "validateRefills", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Prescription]),
    __metadata("design:returntype", Promise)
], Prescription, "checkExpiration", null);
exports.Prescription = Prescription = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                status: {
                    [sequelize_1.Op.in]: [prescription_status_enum_1.PrescriptionStatus.FILLED, prescription_status_enum_1.PrescriptionStatus.PICKED_UP],
                },
                endDate: {
                    [sequelize_1.Op.or]: [null, { [sequelize_1.Op.gte]: new Date() }],
                },
            },
            order: [['startDate', 'DESC']],
        },
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['startDate', 'DESC']],
        }),
        byStatus: (status) => ({
            where: { status },
            order: [['startDate', 'DESC']],
        }),
        pending: {
            where: {
                status: prescription_status_enum_1.PrescriptionStatus.PENDING,
            },
            order: [['createdAt', 'ASC']],
        },
        needsRefill: {
            where: {
                status: {
                    [sequelize_1.Op.in]: [prescription_status_enum_1.PrescriptionStatus.FILLED, prescription_status_enum_1.PrescriptionStatus.PICKED_UP],
                },
                refillsAuthorized: {
                    [sequelize_1.Op.gt]: (0, sequelize_1.literal)('"refillsUsed"'),
                },
            },
        },
        expired: {
            where: {
                [sequelize_1.Op.or]: [
                    { status: prescription_status_enum_1.PrescriptionStatus.EXPIRED },
                    {
                        endDate: {
                            [sequelize_1.Op.lt]: new Date(),
                        },
                    },
                ],
            },
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'prescriptions',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'status'],
            },
            {
                fields: ['visitId'],
            },
            {
                fields: ['treatmentPlanId'],
            },
            {
                fields: ['status', 'startDate'],
                name: 'idx_prescriptions_status_start_date',
            },
            {
                fields: ['endDate'],
                name: 'idx_prescriptions_end_date',
            },
            {
                fields: ['createdAt'],
                name: 'idx_prescriptions_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_prescriptions_updated_at',
            },
        ],
    })
], Prescription);
//# sourceMappingURL=prescription.model.js.map