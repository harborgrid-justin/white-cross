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
exports.BackupLog = exports.BackupStatus = exports.BackupType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var BackupType;
(function (BackupType) {
    BackupType["AUTOMATIC"] = "AUTOMATIC";
    BackupType["MANUAL"] = "MANUAL";
    BackupType["SCHEDULED"] = "SCHEDULED";
})(BackupType || (exports.BackupType = BackupType = {}));
var BackupStatus;
(function (BackupStatus) {
    BackupStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BackupStatus["COMPLETED"] = "COMPLETED";
    BackupStatus["FAILED"] = "FAILED";
})(BackupStatus || (exports.BackupStatus = BackupStatus = {}));
let BackupLog = class BackupLog extends sequelize_typescript_1.Model {
    type;
    status;
    fileName;
    fileSize;
    location;
    triggeredBy;
    error;
    startedAt;
    completedAt;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('BackupLog', instance);
    }
};
exports.BackupLog = BackupLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], BackupLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(BackupType)],
        },
        allowNull: false,
        comment: 'Type of backup operation',
    }),
    __metadata("design:type", String)
], BackupLog.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(BackupStatus)],
        },
        allowNull: false,
        comment: 'Current status of the backup',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], BackupLog.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Name of the backup file',
    }),
    __metadata("design:type", String)
], BackupLog.prototype, "fileName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: true,
        comment: 'Size of the backup file in bytes',
    }),
    __metadata("design:type", Number)
], BackupLog.prototype, "fileSize", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Location/path where the backup is stored',
    }),
    __metadata("design:type", String)
], BackupLog.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the user who triggered the backup',
    }),
    __metadata("design:type", String)
], BackupLog.prototype, "triggeredBy", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Error message if the backup failed',
    }),
    __metadata("design:type", String)
], BackupLog.prototype, "error", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Timestamp when the backup started',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], BackupLog.prototype, "startedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Timestamp when the backup completed',
    }),
    __metadata("design:type", Date)
], BackupLog.prototype, "completedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the backup log was created',
    }),
    __metadata("design:type", Date)
], BackupLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the backup log was last updated',
    }),
    __metadata("design:type", Date)
], BackupLog.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BackupLog]),
    __metadata("design:returntype", Promise)
], BackupLog, "auditPHIAccess", null);
exports.BackupLog = BackupLog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'backup_logs',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['status'] },
            { fields: ['startedAt'] },
            { fields: ['type'] },
            {
                fields: ['createdAt'],
                name: 'idx_backup_log_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_backup_log_updated_at',
            },
        ],
    })
], BackupLog);
//# sourceMappingURL=backup-log.model.js.map