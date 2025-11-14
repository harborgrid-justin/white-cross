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
exports.License = exports.LicenseStatus = exports.LicenseType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var LicenseType;
(function (LicenseType) {
    LicenseType["TRIAL"] = "TRIAL";
    LicenseType["BASIC"] = "BASIC";
    LicenseType["PROFESSIONAL"] = "PROFESSIONAL";
    LicenseType["ENTERPRISE"] = "ENTERPRISE";
})(LicenseType || (exports.LicenseType = LicenseType = {}));
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
    LicenseStatus["CANCELLED"] = "CANCELLED";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
let License = class License extends sequelize_typescript_1.Model {
    licenseKey;
    type;
    status;
    maxUsers;
    maxSchools;
    features;
    issuedTo;
    districtId;
    notes;
    issuedAt;
    activatedAt;
    expiresAt;
    deactivatedAt;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('License', instance);
    }
};
exports.License = License;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], License.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique license key',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], License.prototype, "licenseKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(LicenseType.TRIAL),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(LicenseType)],
        },
        allowNull: false,
        defaultValue: LicenseType.TRIAL,
        comment: 'Type of license',
    }),
    __metadata("design:type", String)
], License.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(LicenseStatus.ACTIVE),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(LicenseStatus)],
        },
        allowNull: false,
        defaultValue: LicenseStatus.ACTIVE,
        comment: 'Current status of the license',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], License.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Maximum number of users allowed',
    }),
    __metadata("design:type", Number)
], License.prototype, "maxUsers", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Maximum number of schools allowed',
    }),
    __metadata("design:type", Number)
], License.prototype, "maxSchools", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(255)),
        allowNull: false,
        comment: 'Array of enabled features',
    }),
    __metadata("design:type", Array)
], License.prototype, "features", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Name of the person/organization the license was issued to',
    }),
    __metadata("design:type", String)
], License.prototype, "issuedTo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./district.model').District),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'ID of the district this license is assigned to',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], License.prototype, "districtId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Additional notes about the license',
    }),
    __metadata("design:type", String)
], License.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Date when the license was issued',
    }),
    __metadata("design:type", Date)
], License.prototype, "issuedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Date when the license was activated',
    }),
    __metadata("design:type", Date)
], License.prototype, "activatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Date when the license expires',
    }),
    __metadata("design:type", Date)
], License.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Date when the license was deactivated',
    }),
    __metadata("design:type", Date)
], License.prototype, "deactivatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the license was created',
    }),
    __metadata("design:type", Date)
], License.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the license was last updated',
    }),
    __metadata("design:type", Date)
], License.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./district.model').District, {
        foreignKey: 'districtId',
        as: 'district',
    }),
    __metadata("design:type", Object)
], License.prototype, "district", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [License]),
    __metadata("design:returntype", Promise)
], License, "auditPHIAccess", null);
exports.License = License = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'licenses',
        timestamps: true,
        underscored: false,
        indexes: [
            { fields: ['licenseKey'], unique: true },
            { fields: ['status'] },
            { fields: ['districtId'] },
            {
                fields: ['createdAt'],
                name: 'idx_license_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_license_updated_at',
            },
        ],
    })
], License);
//# sourceMappingURL=license.model.js.map