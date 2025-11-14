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
exports.InventoryTransaction = exports.InventoryTransactionType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var InventoryTransactionType;
(function (InventoryTransactionType) {
    InventoryTransactionType["PURCHASE"] = "PURCHASE";
    InventoryTransactionType["USAGE"] = "USAGE";
    InventoryTransactionType["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryTransactionType["TRANSFER"] = "TRANSFER";
    InventoryTransactionType["RETURN"] = "RETURN";
    InventoryTransactionType["DISPOSAL"] = "DISPOSAL";
})(InventoryTransactionType || (exports.InventoryTransactionType = InventoryTransactionType = {}));
let InventoryTransaction = class InventoryTransaction extends sequelize_typescript_1.Model {
    inventoryItemId;
    type;
    quantity;
    unitCost;
    reason;
    batchNumber;
    expirationDate;
    performedById;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('InventoryTransaction', instance);
    }
};
exports.InventoryTransaction = InventoryTransaction;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./inventory-item.model').InventoryItem),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "inventoryItemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(InventoryTransactionType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], InventoryTransaction.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
    }),
    __metadata("design:type", Number)
], InventoryTransaction.prototype, "unitCost", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "batchNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], InventoryTransaction.prototype, "expirationDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "performedById", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], InventoryTransaction.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], InventoryTransaction.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./inventory-item.model').InventoryItem),
    __metadata("design:type", Object)
], InventoryTransaction.prototype, "inventoryItem", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InventoryTransaction]),
    __metadata("design:returntype", Promise)
], InventoryTransaction, "auditPHIAccess", null);
exports.InventoryTransaction = InventoryTransaction = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'inventory_transactions',
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
                fields: ['createdAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_inventory_transaction_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_inventory_transaction_updated_at',
            },
        ],
    })
], InventoryTransaction);
//# sourceMappingURL=inventory-transaction.model.js.map