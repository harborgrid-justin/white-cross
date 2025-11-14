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
exports.PurchaseOrderItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let PurchaseOrderItem = class PurchaseOrderItem extends sequelize_typescript_1.Model {
    purchaseOrderId;
    inventoryItemId;
    quantity;
    unitCost;
    totalCost;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('PurchaseOrderItem', instance);
    }
};
exports.PurchaseOrderItem = PurchaseOrderItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./purchase-order.model').PurchaseOrder),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./inventory-item.model').InventoryItem),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], PurchaseOrderItem.prototype, "inventoryItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "unitCost", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PurchaseOrderItem.prototype, "totalCost", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], PurchaseOrderItem.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./purchase-order.model').PurchaseOrder),
    __metadata("design:type", Object)
], PurchaseOrderItem.prototype, "purchaseOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./inventory-item.model').InventoryItem),
    __metadata("design:type", Object)
], PurchaseOrderItem.prototype, "inventoryItem", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PurchaseOrderItem]),
    __metadata("design:returntype", Promise)
], PurchaseOrderItem, "auditPHIAccess", null);
exports.PurchaseOrderItem = PurchaseOrderItem = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'purchase_order_items',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['purchaseOrderId'],
            },
            {
                fields: ['inventoryItemId'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_purchase_order_item_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_purchase_order_item_updated_at',
            },
        ],
    })
], PurchaseOrderItem);
//# sourceMappingURL=purchase-order-item.model.js.map