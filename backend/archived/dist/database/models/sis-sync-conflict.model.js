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
exports.SISSyncConflict = exports.ConflictResolution = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var ConflictResolution;
(function (ConflictResolution) {
    ConflictResolution["KEEP_LOCAL"] = "KEEP_LOCAL";
    ConflictResolution["KEEP_SIS"] = "KEEP_SIS";
})(ConflictResolution || (exports.ConflictResolution = ConflictResolution = {}));
let SISSyncConflict = class SISSyncConflict extends sequelize_typescript_1.Model {
    sessionId;
    studentId;
    field;
    localValue;
    sisValue;
    resolution;
    resolvedAt;
    resolvedBy;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('SISSyncConflict', instance);
    }
};
exports.SISSyncConflict = SISSyncConflict;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SISSyncConflict.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./sync-session.model').SyncSession),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Reference to the sync session that detected this conflict',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SISSyncConflict.prototype, "sessionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'ID of the student with the conflicting data',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SISSyncConflict.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'The field name that has conflicting values',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SISSyncConflict.prototype, "field", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        comment: 'Value from the local system',
    }),
    __metadata("design:type", Object)
], SISSyncConflict.prototype, "localValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        comment: 'Value from the SIS system',
    }),
    __metadata("design:type", Object)
], SISSyncConflict.prototype, "sisValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConflictResolution)],
        },
        allowNull: true,
        comment: 'How the conflict was resolved',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SISSyncConflict.prototype, "resolution", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the conflict was resolved',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], SISSyncConflict.prototype, "resolvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'User who resolved the conflict',
    }),
    __metadata("design:type", String)
], SISSyncConflict.prototype, "resolvedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'When the conflict was detected',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], SISSyncConflict.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the conflict was last updated',
    }),
    __metadata("design:type", Date)
], SISSyncConflict.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./sync-session.model').SyncSession, {
        foreignKey: 'sessionId',
        as: 'session',
    }),
    __metadata("design:type", Object)
], SISSyncConflict.prototype, "session", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SISSyncConflict]),
    __metadata("design:returntype", Promise)
], SISSyncConflict, "auditPHIAccess", null);
exports.SISSyncConflict = SISSyncConflict = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'sis_sync_conflicts',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['sessionId'] },
            { fields: ['studentId'] },
            { fields: ['field'] },
            { fields: ['resolution'] },
            { fields: ['resolvedAt'] },
            { fields: ['createdAt'] },
            {
                fields: ['createdAt'],
                name: 'idx_sis_sync_conflict_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_sis_sync_conflict_updated_at',
            },
        ],
    })
], SISSyncConflict);
//# sourceMappingURL=sis-sync-conflict.model.js.map