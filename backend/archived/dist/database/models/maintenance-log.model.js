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
exports.MaintenanceLog = exports.MaintenanceType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["CALIBRATION"] = "CALIBRATION";
    MaintenanceType["REPAIR"] = "REPAIR";
    MaintenanceType["INSPECTION"] = "INSPECTION";
    MaintenanceType["CLEANING"] = "CLEANING";
    MaintenanceType["REPLACEMENT"] = "REPLACEMENT";
    MaintenanceType["UPGRADE"] = "UPGRADE";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
let MaintenanceLog = class MaintenanceLog extends sequelize_typescript_1.Model {
    inventoryItemId;
    type;
    description;
    performedById;
    cost;
    nextMaintenanceDate;
    vendor;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('MaintenanceLog', instance);
    }
};
exports.MaintenanceLog = MaintenanceLog;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./inventory-item.model').InventoryItem),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "inventoryItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(MaintenanceType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "performedById", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
    }),
    __metadata("design:type", Number)
], MaintenanceLog.prototype, "cost", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MaintenanceLog.prototype, "nextMaintenanceDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "vendor", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MaintenanceLog.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MaintenanceLog.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./inventory-item.model').InventoryItem),
    __metadata("design:type", Object)
], MaintenanceLog.prototype, "inventoryItem", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MaintenanceLog]),
    __metadata("design:returntype", Promise)
], MaintenanceLog, "auditPHIAccess", null);
exports.MaintenanceLog = MaintenanceLog = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'maintenance_logs',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['inventoryItemId'],
            },
            {
                fields: ['type'],
            },
            {
                fields: ['performedById'],
            },
            {
                fields: ['nextMaintenanceDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_maintenance_log_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_maintenance_log_updated_at',
            },
        ],
    })
], MaintenanceLog);
//# sourceMappingURL=maintenance-log.model.js.map