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
exports.PerformanceMetric = exports.MetricType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var MetricType;
(function (MetricType) {
    MetricType["CPU_USAGE"] = "CPU_USAGE";
    MetricType["MEMORY_USAGE"] = "MEMORY_USAGE";
    MetricType["DISK_USAGE"] = "DISK_USAGE";
    MetricType["API_RESPONSE_TIME"] = "API_RESPONSE_TIME";
    MetricType["DATABASE_QUERY_TIME"] = "DATABASE_QUERY_TIME";
    MetricType["ACTIVE_USERS"] = "ACTIVE_USERS";
    MetricType["ERROR_RATE"] = "ERROR_RATE";
    MetricType["REQUEST_COUNT"] = "REQUEST_COUNT";
})(MetricType || (exports.MetricType = MetricType = {}));
let PerformanceMetric = class PerformanceMetric extends sequelize_typescript_1.Model {
    metricType;
    value;
    unit;
    tags;
    recordedAt;
    static async auditPHIAccess(instance) {
        await createModelAuditHook('PerformanceMetric', instance);
    }
};
exports.PerformanceMetric = PerformanceMetric;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PerformanceMetric.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MetricType)],
        },
        allowNull: false,
        comment: 'Type of performance metric being recorded',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], PerformanceMetric.prototype, "metricType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Numerical value of the metric',
    }),
    __metadata("design:type", Number)
], PerformanceMetric.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        comment: 'Unit of measurement (e.g., %, ms, GB)',
    }),
    __metadata("design:type", String)
], PerformanceMetric.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Additional tags for categorizing the metric',
    }),
    __metadata("design:type", Object)
], PerformanceMetric.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Timestamp when the metric was recorded',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], PerformanceMetric.prototype, "recordedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
        comment: 'Timestamp when the metric record was created',
    }),
    __metadata("design:type", Date)
], PerformanceMetric.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PerformanceMetric]),
    __metadata("design:returntype", Promise)
], PerformanceMetric, "auditPHIAccess", null);
exports.PerformanceMetric = PerformanceMetric = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'performance_metrics',
        timestamps: true,
        updatedAt: false,
        underscored: false,
        indexes: [
            { fields: ['metricType'] },
            { fields: ['recordedAt'] },
            {
                fields: ['createdAt'],
                name: 'idx_performance_metric_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_performance_metric_updated_at',
            },
        ],
    })
], PerformanceMetric);
//# sourceMappingURL=performance-metric.model.js.map