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
exports.SystemConfig = exports.ConfigScope = exports.ConfigValueType = exports.ConfigCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var ConfigCategory;
(function (ConfigCategory) {
    ConfigCategory["GENERAL"] = "GENERAL";
    ConfigCategory["SECURITY"] = "SECURITY";
    ConfigCategory["NOTIFICATION"] = "NOTIFICATION";
    ConfigCategory["INTEGRATION"] = "INTEGRATION";
    ConfigCategory["BACKUP"] = "BACKUP";
    ConfigCategory["PERFORMANCE"] = "PERFORMANCE";
    ConfigCategory["HEALTHCARE"] = "HEALTHCARE";
    ConfigCategory["MEDICATION"] = "MEDICATION";
    ConfigCategory["APPOINTMENTS"] = "APPOINTMENTS";
    ConfigCategory["UI"] = "UI";
    ConfigCategory["QUERY"] = "QUERY";
    ConfigCategory["FILE_UPLOAD"] = "FILE_UPLOAD";
    ConfigCategory["RATE_LIMITING"] = "RATE_LIMITING";
    ConfigCategory["SESSION"] = "SESSION";
    ConfigCategory["EMAIL"] = "EMAIL";
})(ConfigCategory || (exports.ConfigCategory = ConfigCategory = {}));
var ConfigValueType;
(function (ConfigValueType) {
    ConfigValueType["STRING"] = "STRING";
    ConfigValueType["NUMBER"] = "NUMBER";
    ConfigValueType["BOOLEAN"] = "BOOLEAN";
    ConfigValueType["JSON"] = "JSON";
    ConfigValueType["ARRAY"] = "ARRAY";
    ConfigValueType["DATE"] = "DATE";
    ConfigValueType["TIME"] = "TIME";
    ConfigValueType["DATETIME"] = "DATETIME";
    ConfigValueType["EMAIL"] = "EMAIL";
    ConfigValueType["URL"] = "URL";
    ConfigValueType["COLOR"] = "COLOR";
    ConfigValueType["ENUM"] = "ENUM";
})(ConfigValueType || (exports.ConfigValueType = ConfigValueType = {}));
var ConfigScope;
(function (ConfigScope) {
    ConfigScope["SYSTEM"] = "SYSTEM";
    ConfigScope["DISTRICT"] = "DISTRICT";
    ConfigScope["SCHOOL"] = "SCHOOL";
    ConfigScope["USER"] = "USER";
})(ConfigScope || (exports.ConfigScope = ConfigScope = {}));
let SystemConfig = class SystemConfig extends sequelize_typescript_1.Model {
    key;
    value;
    category;
    valueType;
    subCategory;
    description;
    defaultValue;
    validValues;
    minValue;
    maxValue;
    isPublic;
    isEditable;
    requiresRestart;
    scope;
    scopeId;
    tags;
    sortOrder;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('SystemConfig', instance);
    }
};
exports.SystemConfig = SystemConfig;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SystemConfig.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'Unique configuration key',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SystemConfig.prototype, "key", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        comment: 'Configuration value as string',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ConfigCategory.GENERAL),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConfigCategory)],
        },
        allowNull: false,
        defaultValue: ConfigCategory.GENERAL,
        comment: 'Configuration category',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SystemConfig.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ConfigValueType.STRING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConfigValueType)],
        },
        allowNull: false,
        defaultValue: ConfigValueType.STRING,
        comment: 'Data type of the configuration value',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "valueType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'Sub-category for further organization',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "subCategory", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Human-readable description of the configuration',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Default value for the configuration',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "defaultValue", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: true,
        comment: 'Array of valid values for enum-type configurations',
    }),
    __metadata("design:type", Array)
], SystemConfig.prototype, "validValues", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum allowed value for numeric configurations',
    }),
    __metadata("design:type", Number)
], SystemConfig.prototype, "minValue", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum allowed value for numeric configurations',
    }),
    __metadata("design:type", Number)
], SystemConfig.prototype, "maxValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this configuration is publicly accessible',
    }),
    __metadata("design:type", Boolean)
], SystemConfig.prototype, "isPublic", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether this configuration can be edited',
    }),
    __metadata("design:type", Boolean)
], SystemConfig.prototype, "isEditable", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether changing this configuration requires a system restart',
    }),
    __metadata("design:type", Boolean)
], SystemConfig.prototype, "requiresRestart", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ConfigScope.SYSTEM),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ConfigScope)],
        },
        allowNull: false,
        defaultValue: ConfigScope.SYSTEM,
        comment: 'Scope of the configuration (system, district, school, user)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], SystemConfig.prototype, "scope", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the scope entity (district, school, or user)',
    }),
    __metadata("design:type", String)
], SystemConfig.prototype, "scopeId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: true,
        comment: 'Tags for categorization and filtering',
    }),
    __metadata("design:type", Array)
], SystemConfig.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Sort order for display purposes',
    }),
    __metadata("design:type", Number)
], SystemConfig.prototype, "sortOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the configuration was created',
    }),
    __metadata("design:type", Date)
], SystemConfig.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the configuration was last updated',
    }),
    __metadata("design:type", Date)
], SystemConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./configuration-history.model').ConfigurationHistory, {
        foreignKey: 'configurationId',
        as: 'history',
    }),
    __metadata("design:type", Array)
], SystemConfig.prototype, "history", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SystemConfig]),
    __metadata("design:returntype", Promise)
], SystemConfig, "auditPHIAccess", null);
exports.SystemConfig = SystemConfig = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'system_configurations',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['key'], unique: true },
            { fields: ['category'] },
            { fields: ['scope'] },
            {
                fields: ['createdAt'],
                name: 'idx_system_config_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_system_config_updated_at',
            },
        ],
    })
], SystemConfig);
//# sourceMappingURL=system-config.model.js.map