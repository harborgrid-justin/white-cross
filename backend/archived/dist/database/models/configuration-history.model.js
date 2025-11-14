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
exports.ConfigurationHistory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let ConfigurationHistory = class ConfigurationHistory extends sequelize_typescript_1.Model {
    configKey;
    oldValue;
    newValue;
    changedBy;
    configurationId;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('ConfigurationHistory', instance);
    }
};
exports.ConfigurationHistory = ConfigurationHistory;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'Configuration key that was changed',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "configKey", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Previous value before the change',
    }),
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "oldValue", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'New value after the change',
    }),
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "newValue", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'ID of the user who made the change',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "changedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./system-config.model').SystemConfig),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'ID of the system configuration that was changed',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], ConfigurationHistory.prototype, "configurationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the configuration change was made',
    }),
    __metadata("design:type", Date)
], ConfigurationHistory.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./system-config.model').SystemConfig, {
        foreignKey: 'configurationId',
        as: 'configuration',
    }),
    __metadata("design:type", Object)
], ConfigurationHistory.prototype, "configuration", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ConfigurationHistory]),
    __metadata("design:returntype", Promise)
], ConfigurationHistory, "auditPHIAccess", null);
exports.ConfigurationHistory = ConfigurationHistory = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'configuration_history',
        timestamps: true,
        updatedAt: false,
        underscored: false,
        indexes: [
            { fields: ['configKey'] },
            { fields: ['changedBy'] },
            { fields: ['configurationId'] },
            {
                fields: ['createdAt'],
                name: 'idx_configuration_history_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_configuration_history_updated_at',
            },
        ],
    })
], ConfigurationHistory);
//# sourceMappingURL=configuration-history.model.js.map