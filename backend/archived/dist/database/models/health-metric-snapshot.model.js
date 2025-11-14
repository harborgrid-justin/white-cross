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
exports.HealthMetricSnapshot = exports.TrendDirection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var TrendDirection;
(function (TrendDirection) {
    TrendDirection["INCREASING"] = "INCREASING";
    TrendDirection["DECREASING"] = "DECREASING";
    TrendDirection["STABLE"] = "STABLE";
    TrendDirection["FLUCTUATING"] = "FLUCTUATING";
})(TrendDirection || (exports.TrendDirection = TrendDirection = {}));
let HealthMetricSnapshot = class HealthMetricSnapshot extends sequelize_typescript_1.Model {
    schoolId;
    metricName;
    value;
    unit;
    category;
    trend;
    metadata;
    snapshotDate;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('HealthMetricSnapshot', instance);
    }
};
exports.HealthMetricSnapshot = HealthMetricSnapshot;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "metricName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HealthMetricSnapshot.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "unit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(TrendDirection)],
        },
    }),
    __metadata("design:type", String)
], HealthMetricSnapshot.prototype, "trend", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], HealthMetricSnapshot.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], HealthMetricSnapshot.prototype, "snapshotDate", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], HealthMetricSnapshot.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HealthMetricSnapshot]),
    __metadata("design:returntype", Promise)
], HealthMetricSnapshot, "auditPHIAccess", null);
exports.HealthMetricSnapshot = HealthMetricSnapshot = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'health_metric_snapshots',
        timestamps: false,
        indexes: [
            {
                fields: ['schoolId', 'snapshotDate'],
            },
            {
                fields: ['metricName', 'snapshotDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_health_metric_snapshot_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_health_metric_snapshot_updated_at',
            },
        ],
    })
], HealthMetricSnapshot);
//# sourceMappingURL=health-metric-snapshot.model.js.map