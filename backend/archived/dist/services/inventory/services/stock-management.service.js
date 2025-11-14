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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryStockManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
let InventoryStockManagementService = class InventoryStockManagementService extends base_1.BaseService {
    requestContext;
    inventoryItemModel;
    transactionModel;
    sequelize;
    constructor(requestContext, inventoryItemModel, transactionModel, sequelize) {
        super(requestContext);
        this.requestContext = requestContext;
        this.inventoryItemModel = inventoryItemModel;
        this.transactionModel = transactionModel;
        this.sequelize = sequelize;
    }
    async getCurrentStock(inventoryItemId) {
        try {
            const result = await this.transactionModel.sum('quantity', {
                where: { inventoryItemId },
            });
            return Number(result) || 0;
        }
        catch (error) {
            this.logger.error('Error getting current stock:', error);
            throw error;
        }
    }
    async adjustStock(id, adjustmentData) {
        const sequelizeTransaction = await this.sequelize.transaction();
        try {
            const item = await this.inventoryItemModel.findByPk(id);
            if (!item) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
            const currentStock = await this.getCurrentStock(id);
            const transaction = await this.transactionModel.create({
                inventoryItemId: id,
                type: models_1.InventoryTransactionType.ADJUSTMENT,
                quantity: adjustmentData.quantity,
                reason: adjustmentData.reason,
                notes: `Stock adjusted from ${currentStock} to ${currentStock + adjustmentData.quantity}. Reason: ${adjustmentData.reason}`,
                performedById: adjustmentData.performedById,
            }, { transaction: sequelizeTransaction });
            await sequelizeTransaction.commit();
            const newStock = currentStock + adjustmentData.quantity;
            this.logger.log(`Stock adjusted for ${item.name}: ${currentStock} -> ${newStock} (${adjustmentData.quantity > 0 ? '+' : ''}${adjustmentData.quantity}) by ${adjustmentData.performedById}`);
            return {
                transaction,
                previousStock: currentStock,
                newStock,
                adjustment: adjustmentData.quantity,
            };
        }
        catch (error) {
            await sequelizeTransaction.rollback();
            this.logger.error('Error adjusting stock:', error);
            throw error;
        }
    }
    async getStockHistory(inventoryItemId, page = 1, limit = 50) {
        try {
            const offset = (page - 1) * limit;
            const { rows: transactions, count: total } = await this.transactionModel.findAndCountAll({
                where: { inventoryItemId },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
            const history = [];
            const allTransactions = await this.transactionModel.findAll({
                where: { inventoryItemId },
                order: [['createdAt', 'ASC']],
                attributes: ['id', 'quantity'],
            });
            const runningTotals = new Map();
            let runningTotal = 0;
            for (const txn of allTransactions) {
                runningTotal += txn.quantity;
                runningTotals.set(txn.id, runningTotal);
            }
            for (const txn of transactions) {
                history.push({
                    ...txn.get({ plain: true }),
                    stockAfterTransaction: runningTotals.get(txn.id) || 0,
                });
            }
            return {
                history,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logger.error('Error getting stock history:', error);
            throw error;
        }
    }
    async isLowStock(inventoryItemId) {
        try {
            const item = await this.inventoryItemModel.findByPk(inventoryItemId);
            if (!item) {
                throw new common_1.NotFoundException('Inventory item not found');
            }
            const currentStock = await this.getCurrentStock(inventoryItemId);
            return currentStock <= item.reorderLevel;
        }
        catch (error) {
            this.logger.error('Error checking low stock:', error);
            throw error;
        }
    }
    async isOutOfStock(inventoryItemId) {
        try {
            const currentStock = await this.getCurrentStock(inventoryItemId);
            return currentStock === 0;
        }
        catch (error) {
            this.logger.error('Error checking out of stock:', error);
            throw error;
        }
    }
    async getLowStockItems() {
        try {
            const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity) as total_quantity
          FROM inventory_transactions
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        WHERE i.is_active = true
        AND COALESCE(stock.total_quantity, 0) <= i.reorder_level
        AND COALESCE(stock.total_quantity, 0) > 0
        ORDER BY COALESCE(stock.total_quantity, 0) ASC
      `;
            const [lowStockItems] = await this.sequelize.query(query, {
                type: sequelize_2.QueryTypes.SELECT,
            });
            return lowStockItems;
        }
        catch (error) {
            this.logger.error('Error getting low stock items:', error);
            throw error;
        }
    }
    async getOutOfStockItems() {
        try {
            const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity) as total_quantity
          FROM inventory_transactions
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        WHERE i.is_active = true
        AND COALESCE(stock.total_quantity, 0) = 0
        ORDER BY i.name ASC
      `;
            const [outOfStockItems] = await this.sequelize.query(query, {
                type: sequelize_2.QueryTypes.SELECT,
            });
            return outOfStockItems;
        }
        catch (error) {
            this.logger.error('Error getting out of stock items:', error);
            throw error;
        }
    }
};
exports.InventoryStockManagementService = InventoryStockManagementService;
exports.InventoryStockManagementService = InventoryStockManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.InventoryItem)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.InventoryTransaction)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, sequelize_typescript_1.Sequelize])
], InventoryStockManagementService);
//# sourceMappingURL=stock-management.service.js.map