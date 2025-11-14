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
exports.GrowthTracking = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let GrowthTracking = class GrowthTracking extends sequelize_typescript_1.Model {
    studentId;
    measurementDate;
    height;
    heightUnit;
    weight;
    weightUnit;
    bmi;
    percentileHeight;
    percentileWeight;
    percentileBmi;
    notes;
    measuredBy;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('GrowthTracking', instance);
    }
};
exports.GrowthTracking = GrowthTracking;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], GrowthTracking.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GrowthTracking.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GrowthTracking.prototype, "measurementDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "height", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('inches'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('inches', 'cm')),
    __metadata("design:type", String)
], GrowthTracking.prototype, "heightUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "weight", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('lbs'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('lbs', 'kg')),
    __metadata("design:type", String)
], GrowthTracking.prototype, "weightUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "bmi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "percentileHeight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "percentileWeight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GrowthTracking.prototype, "percentileBmi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], GrowthTracking.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GrowthTracking.prototype, "measuredBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GrowthTracking.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GrowthTracking.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GrowthTracking]),
    __metadata("design:returntype", Promise)
], GrowthTracking, "auditPHIAccess", null);
exports.GrowthTracking = GrowthTracking = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'growth_tracking',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['measurementDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_growth_tracking_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_growth_tracking_updated_at',
            },
        ],
    })
], GrowthTracking);
//# sourceMappingURL=growth-tracking.model.js.map