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
exports.ClinicalNote = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const note_type_enum_1 = require("../../services/clinical/enums/note-type.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let ClinicalNote = class ClinicalNote extends sequelize_typescript_1.Model {
    studentId;
    visitId;
    type;
    createdBy;
    title;
    content;
    subjective;
    objective;
    assessment;
    plan;
    tags;
    isConfidential;
    isSigned;
    signedAt;
    amended;
    amendmentReason;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ClinicalNote', instance);
    }
    static async validateSOAPNote(instance) {
        if (instance.type === note_type_enum_1.NoteType.SOAP) {
            if (instance.isSigned &&
                (!instance.subjective ||
                    !instance.objective ||
                    !instance.assessment ||
                    !instance.plan)) {
                throw new Error('SOAP note must have all four components (S.O.A.P) before signing');
            }
        }
    }
    static async validateAmendment(instance) {
        if (instance.changed('amended') &&
            instance.amended &&
            !instance.amendmentReason) {
            throw new Error('amendmentReason is required when marking note as amended');
        }
    }
    static async validateSignature(instance) {
        if (instance.changed('isSigned') && instance.isSigned) {
            instance.signedAt = new Date();
        }
    }
    isSOAPNote() {
        return this.type === note_type_enum_1.NoteType.SOAP;
    }
    isSOAPComplete() {
        if (!this.isSOAPNote())
            return false;
        return !!(this.subjective &&
            this.objective &&
            this.assessment &&
            this.plan);
    }
    sign() {
        this.isSigned = true;
        this.signedAt = new Date();
    }
    markAsAmended(reason) {
        this.amended = true;
        this.amendmentReason = reason;
    }
};
exports.ClinicalNote = ClinicalNote;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ClinicalNote.prototype, "id", void 0);
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
], ClinicalNote.prototype, "studentId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./clinic-visit.model').ClinicVisit),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "visitId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./clinic-visit.model').ClinicVisit, {
        foreignKey: 'visitId',
        as: 'visit',
    }),
    __metadata("design:type", Object)
], ClinicalNote.prototype, "visit", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Object)
], ClinicalNote.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'createdBy',
        as: 'author',
    }),
    __metadata("design:type", Object)
], ClinicalNote.prototype, "author", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(note_type_enum_1.NoteType)],
        },
        allowNull: false,
        defaultValue: note_type_enum_1.NoteType.GENERAL,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "type", void 0);
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
], ClinicalNote.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "subjective", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "objective", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "assessment", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "plan", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], ClinicalNote.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], ClinicalNote.prototype, "isConfidential", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], ClinicalNote.prototype, "isSigned", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ClinicalNote.prototype, "signedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], ClinicalNote.prototype, "amended", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], ClinicalNote.prototype, "amendmentReason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicalNote.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ClinicalNote.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicalNote]),
    __metadata("design:returntype", Promise)
], ClinicalNote, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicalNote]),
    __metadata("design:returntype", Promise)
], ClinicalNote, "validateSOAPNote", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicalNote]),
    __metadata("design:returntype", Promise)
], ClinicalNote, "validateAmendment", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClinicalNote]),
    __metadata("design:returntype", Promise)
], ClinicalNote, "validateSignature", null);
exports.ClinicalNote = ClinicalNote = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['createdAt', 'DESC']],
        }),
        byType: (type) => ({
            where: { type },
            order: [['createdAt', 'DESC']],
        }),
        byAuthor: (createdBy) => ({
            where: { createdBy },
            order: [['createdAt', 'DESC']],
        }),
        confidential: {
            where: {
                isConfidential: true,
            },
            order: [['createdAt', 'DESC']],
        },
        unsigned: {
            where: {
                isSigned: false,
            },
            order: [['createdAt', 'ASC']],
        },
        signed: {
            where: {
                isSigned: true,
            },
            order: [['signedAt', 'DESC']],
        },
        amended: {
            where: {
                amended: true,
            },
            order: [['updatedAt', 'DESC']],
        },
        recent: {
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            order: [['createdAt', 'DESC']],
        },
        soapNotes: {
            where: {
                type: note_type_enum_1.NoteType.SOAP,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'clinical_notes',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'type'],
            },
            {
                fields: ['visitId'],
            },
            {
                fields: ['createdBy'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_clinical_note_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_clinical_note_updated_at',
            },
        ],
    })
], ClinicalNote);
//# sourceMappingURL=clinical-note.model.js.map