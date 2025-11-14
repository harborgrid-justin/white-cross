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
exports.IntegrationConfig = exports.IntegrationStatus = exports.IntegrationType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var IntegrationType;
(function (IntegrationType) {
    IntegrationType["SIS"] = "SIS";
    IntegrationType["EHR"] = "EHR";
    IntegrationType["PHARMACY"] = "PHARMACY";
    IntegrationType["LABORATORY"] = "LABORATORY";
    IntegrationType["INSURANCE"] = "INSURANCE";
    IntegrationType["PARENT_PORTAL"] = "PARENT_PORTAL";
    IntegrationType["HEALTH_APP"] = "HEALTH_APP";
    IntegrationType["GOVERNMENT_REPORTING"] = "GOVERNMENT_REPORTING";
})(IntegrationType || (exports.IntegrationType = IntegrationType = {}));
var IntegrationStatus;
(function (IntegrationStatus) {
    IntegrationStatus["INACTIVE"] = "INACTIVE";
    IntegrationStatus["ACTIVE"] = "ACTIVE";
    IntegrationStatus["TESTING"] = "TESTING";
    IntegrationStatus["SYNCING"] = "SYNCING";
    IntegrationStatus["ERROR"] = "ERROR";
})(IntegrationStatus || (exports.IntegrationStatus = IntegrationStatus = {}));
let IntegrationConfig = class IntegrationConfig extends sequelize_typescript_1.Model {
    name;
    type;
    status;
    endpoint;
    apiKey;
    username;
    password;
    settings;
    authentication;
    syncFrequency;
    isActive;
    lastSyncAt;
    lastSyncStatus;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('IntegrationConfig', instance);
    }
};
exports.IntegrationConfig = IntegrationConfig;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'Human-readable name for this integration',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(IntegrationType)],
        },
        allowNull: false,
        comment: 'Type of external system being integrated',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationConfig.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(IntegrationStatus)],
        },
        allowNull: false,
        defaultValue: IntegrationStatus.INACTIVE,
        comment: 'Current status of the integration',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], IntegrationConfig.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'API endpoint URL for the external system',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "endpoint", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'API key for authentication',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "apiKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'Username for basic authentication',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Password for basic authentication',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Additional configuration settings',
    }),
    __metadata("design:type", Object)
], IntegrationConfig.prototype, "settings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Authentication configuration details',
    }),
    __metadata("design:type", Object)
], IntegrationConfig.prototype, "authentication", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Sync frequency in minutes',
    }),
    __metadata("design:type", Number)
], IntegrationConfig.prototype, "syncFrequency", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this integration is active',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], IntegrationConfig.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'When the last sync operation occurred',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "lastSyncAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        comment: 'Status of the last sync operation',
    }),
    __metadata("design:type", String)
], IntegrationConfig.prototype, "lastSyncStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'When this integration was configured',
    }),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'When this integration was last updated',
    }),
    __metadata("design:type", Date)
], IntegrationConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./integration-log.model').IntegrationLog, {
        foreignKey: 'integrationId',
        as: 'logs',
    }),
    __metadata("design:type", Array)
], IntegrationConfig.prototype, "logs", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IntegrationConfig]),
    __metadata("design:returntype", Promise)
], IntegrationConfig, "auditPHIAccess", null);
exports.IntegrationConfig = IntegrationConfig = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'integration_configs',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['isActive'] },
            { fields: ['lastSyncAt'] },
            { fields: ['createdAt'] },
            {
                fields: ['createdAt'],
                name: 'idx_integration_config_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_integration_config_updated_at',
            },
        ],
    })
], IntegrationConfig);
//# sourceMappingURL=integration-config.model.js.map