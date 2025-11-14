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
exports.District = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let District = class District extends sequelize_typescript_1.Model {
    name;
    code;
    address;
    city;
    state;
    zipCode;
    phone;
    email;
    isActive;
    static async auditAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('District', instance);
    }
};
exports.District = District;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], District.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
        comment: 'Name of the district',
    }),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        unique: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], District.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Physical address of the district',
    }),
    __metadata("design:type", String)
], District.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'City where the district is located',
    }),
    __metadata("design:type", String)
], District.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(2),
        allowNull: true,
        comment: 'State code (2-letter abbreviation)',
    }),
    __metadata("design:type", String)
], District.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        comment: 'ZIP code of the district',
    }),
    __metadata("design:type", String)
], District.prototype, "zipCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        comment: 'Primary phone number for the district',
    }),
    __metadata("design:type", String)
], District.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Primary email address for the district',
    }),
    __metadata("design:type", String)
], District.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the district is active',
    }),
    __metadata("design:type", Boolean)
], District.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the district was created',
    }),
    __metadata("design:type", Date)
], District.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the district was last updated',
    }),
    __metadata("design:type", Date)
], District.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./school.model').School, {
        foreignKey: 'districtId',
        as: 'schools',
    }),
    __metadata("design:type", Array)
], District.prototype, "schools", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./license.model').License, {
        foreignKey: 'districtId',
        as: 'licenses',
    }),
    __metadata("design:type", Array)
], District.prototype, "licenses", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [District]),
    __metadata("design:returntype", Promise)
], District, "auditAccess", null);
exports.District = District = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
                deletedAt: null,
            },
            order: [['name', 'ASC']],
        },
        byState: (state) => ({
            where: { state, isActive: true },
            order: [['name', 'ASC']],
        }),
        byCity: (city) => ({
            where: { city, isActive: true },
            order: [['name', 'ASC']],
        }),
        withSchools: {
            include: [
                {
                    association: 'schools',
                    where: { isActive: true },
                    required: false,
                },
            ],
            order: [['name', 'ASC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'districts',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            { fields: ['code'], unique: true },
            { fields: ['isActive'] },
            { fields: ['state', 'city'], name: 'idx_districts_state_city' },
            { fields: ['createdAt'], name: 'idx_districts_created_at' },
            { fields: ['updatedAt'], name: 'idx_districts_updated_at' },
        ],
    })
], District);
//# sourceMappingURL=district.model.js.map