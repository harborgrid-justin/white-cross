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
exports.ClinicVisit = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const visit_disposition_enum_1 = require("../../services/clinical/enums/visit-disposition.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let ClinicVisit = class ClinicVisit extends sequelize_typescript_1.Model {
    studentId;
    checkInTime;
    checkOutTime;
    reasonForVisit;
    symptoms;
    treatment;
    disposition;
    classesMissed;
    minutesMissed;
    attendedBy;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ClinicVisit', instance);
    }
    static async validateTimes(instance) {
        if (instance.checkOutTime && instance.checkOutTime < instance.checkInTime) {
            throw new Error('Check-out time cannot be before check-in time');
        }
        if (instance.checkInTime > new Date()) {
            throw new Error('Check-in time cannot be in the future');
        }
    }
    static async calculateMinutesMissed(instance) {
        if (instance.changed('checkOutTime') && instance.checkOutTime) {
            const duration = Math.floor((instance.checkOutTime.getTime() - instance.checkInTime.getTime()) /
                60000);
            if (!instance.minutesMissed) {
                instance.minutesMissed = duration;
            }
        }
    }
    getDuration() {
        if (!this.checkOutTime)
            return null;
        return Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 60000);
    }
    isStillInClinic() {
        return !this.checkOutTime;
    }
    isLongVisit() {
        const duration = this.getDuration();
        return duration !== null && duration > 30;
    }
};
exports.ClinicVisit = ClinicVisit;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ClinicVisit.prototype, "id", void 0);
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
], ClinicVisit.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], ClinicVisit.prototype, "checkInTime", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], ClinicVisit.prototype, "checkOutTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ClinicVisit.prototype, "reasonForVisit", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicVisit.prototype, "symptoms", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicVisit.prototype, "treatment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(visit_disposition_enum_1.VisitDisposition)],
        },
        allowNull: false,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ClinicVisit.prototype, "disposition", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicVisit.prototype, "classesMissed", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], ClinicVisit.prototype, "minutesMissed", void 0);
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
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ClinicVisit.prototype, "attendedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicVisit.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicVisit.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicVisit.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], ClinicVisit.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'attendedBy',
        as: 'attendingNurse',
    }),
    __metadata("design:type", Object)
], ClinicVisit.prototype, "attendingNurse", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicVisit]),
    __metadata("design:returntype", Promise)
], ClinicVisit, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicVisit]),
    __metadata("design:returntype", Promise)
], ClinicVisit, "validateTimes", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicVisit]),
    __metadata("design:returntype", Promise)
], ClinicVisit, "calculateMinutesMissed", null);
exports.ClinicVisit = ClinicVisit = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                checkOutTime: null,
                deletedAt: null,
            },
            order: [['checkInTime', 'ASC']],
        },
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['checkInTime', 'DESC']],
        }),
        byNurse: (attendedBy) => ({
            where: { attendedBy },
            order: [['checkInTime', 'DESC']],
        }),
        byDisposition: (disposition) => ({
            where: { disposition },
            order: [['checkInTime', 'DESC']],
        }),
        today: {
            where: {
                checkInTime: {
                    [sequelize_1.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
            order: [['checkInTime', 'DESC']],
        },
        thisWeek: {
            where: {
                checkInTime: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
            order: [['checkInTime', 'DESC']],
        },
        completed: {
            where: {
                checkOutTime: {
                    [sequelize_1.Op.ne]: null,
                },
            },
            order: [['checkOutTime', 'DESC']],
        },
        inProgress: {
            where: {
                checkOutTime: null,
            },
            order: [['checkInTime', 'ASC']],
        },
        sentHome: {
            where: {
                disposition: visit_disposition_enum_1.VisitDisposition.SENT_HOME,
            },
            order: [['checkInTime', 'DESC']],
        },
        returnedToClass: {
            where: {
                disposition: visit_disposition_enum_1.VisitDisposition.RETURN_TO_CLASS,
            },
            order: [['checkInTime', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'clinic_visits',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['checkInTime'],
            },
            {
                fields: ['checkOutTime'],
            },
            {
                fields: ['disposition'],
            },
            {
                fields: ['attendedBy'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_clinic_visit_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_clinic_visit_updated_at',
            },
        ],
    })
], ClinicVisit);
//# sourceMappingURL=clinic-visit.model.js.map