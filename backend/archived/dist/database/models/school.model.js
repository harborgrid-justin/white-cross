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
exports.School = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let School = class School extends sequelize_typescript_1.Model {
    name;
    code;
    districtId;
    address;
    city;
    state;
    zipCode;
    phone;
    email;
    principal;
    totalEnrollment;
    isActive;
    static async auditAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('School', instance);
    }
};
exports.School = School;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], School.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
        comment: 'Name of the school',
    }),
    __metadata("design:type", String)
], School.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        unique: true,
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], School.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./district.model').District),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'ID of the district this school belongs to',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], School.prototype, "districtId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Physical address of the school',
    }),
    __metadata("design:type", String)
], School.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
        comment: 'City where the school is located',
    }),
    __metadata("design:type", String)
], School.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(2),
        allowNull: true,
        comment: 'State code (2-letter abbreviation)',
    }),
    __metadata("design:type", String)
], School.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: true,
        comment: 'ZIP code of the school',
    }),
    __metadata("design:type", String)
], School.prototype, "zipCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        comment: 'Primary phone number for the school',
    }),
    __metadata("design:type", String)
], School.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'Primary email address for the school',
    }),
    __metadata("design:type", String)
], School.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
        comment: 'Name of the school principal',
    }),
    __metadata("design:type", String)
], School.prototype, "principal", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        comment: 'Total number of enrolled students',
    }),
    __metadata("design:type", Number)
], School.prototype, "totalEnrollment", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the school is active',
    }),
    __metadata("design:type", Boolean)
], School.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the school was created',
    }),
    __metadata("design:type", Date)
], School.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the school was last updated',
    }),
    __metadata("design:type", Date)
], School.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./district.model').District, {
        foreignKey: 'districtId',
        as: 'district',
    }),
    __metadata("design:type", Function)
], School.prototype, "district", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./user.model').User, {
        foreignKey: 'schoolId',
        as: 'users',
    }),
    __metadata("design:type", Array)
], School.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./student.model').Student, {
        foreignKey: 'schoolId',
        as: 'students',
    }),
    __metadata("design:type", Array)
], School.prototype, "students", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./alert.model').Alert, {
        foreignKey: 'schoolId',
        as: 'alerts',
    }),
    __metadata("design:type", Array)
], School.prototype, "alerts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./incident-report.model').IncidentReport, {
        foreignKey: 'schoolId',
        as: 'incidentReports',
        constraints: false,
    }),
    __metadata("design:type", Array)
], School.prototype, "incidentReports", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [School]),
    __metadata("design:returntype", Promise)
], School, "auditAccess", null);
exports.School = School = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
                deletedAt: null,
            },
            order: [['name', 'ASC']],
        },
        byDistrict: (districtId) => ({
            where: { districtId, isActive: true },
            order: [['name', 'ASC']],
        }),
        byState: (state) => ({
            where: { state, isActive: true },
            order: [
                ['city', 'ASC'],
                ['name', 'ASC'],
            ],
        }),
        byCity: (city) => ({
            where: { city, isActive: true },
            order: [['name', 'ASC']],
        }),
        withStudents: {
            include: [
                {
                    association: 'students',
                    where: { isActive: true },
                    required: false,
                },
            ],
            order: [['name', 'ASC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'schools',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            { fields: ['code'], unique: true },
            { fields: ['districtId'] },
            { fields: ['isActive'] },
            { fields: ['createdAt'], name: 'idx_schools_created_at' },
            { fields: ['updatedAt'], name: 'idx_schools_updated_at' },
            { fields: ['state', 'city'], name: 'idx_schools_state_city' },
        ],
    })
], School);
//# sourceMappingURL=school.model.js.map