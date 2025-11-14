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
exports.InventoryPurchaseOrderService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
const models_4 = require("../../../database/models");
let InventoryPurchaseOrderService = class InventoryPurchaseOrderService extends base_1.BaseService {
    requestContext;
    purchaseOrderModel;
    purchaseOrderItemModel;
    vendorModel;
    inventoryItemModel;
    sequelize;
    constructor(requestContext, purchaseOrderModel, purchaseOrderItemModel, vendorModel, inventoryItemModel, sequelize) {
        super("InventoryPurchaseOrderService");
        this.requestContext = requestContext;
        this.purchaseOrderModel = purchaseOrderModel;
        this.purchaseOrderItemModel = purchaseOrderItemModel;
        this.vendorModel = vendorModel;
        this.inventoryItemModel = inventoryItemModel;
        this.sequelize = sequelize;
    }
    async createPurchaseOrder(data) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            const vendor = await this.vendorModel.findByPk(data.vendorId, {
                transaction,
            });
            if (!vendor) {
                throw new common_1.NotFoundException('Vendor not found');
            }
            if (!vendor.isActive) {
                throw new common_1.BadRequestException('Cannot create purchase order for inactive vendor');
            }
            const existingOrder = await this.purchaseOrderModel.findOne({
                where: { orderNumber: data.orderNumber },
                transaction,
            });
            if (existingOrder) {
                throw new common_1.BadRequestException(`Purchase order with number ${data.orderNumber} already exists`);
            }
            if (!data.items || data.items.length === 0) {
                throw new common_1.BadRequestException('Purchase order must contain at least one item');
            }
            let subtotal = 0;
            const orderItems = [];
            const itemIds = new Set();
            for (const item of data.items) {
                if (itemIds.has(item.inventoryItemId)) {
                    throw new common_1.BadRequestException('Purchase order cannot contain duplicate items');
                }
                itemIds.add(item.inventoryItemId);
                const inventoryItem = await this.inventoryItemModel.findByPk(item.inventoryItemId, { transaction });
                if (!inventoryItem) {
                    throw new common_1.NotFoundException(`Inventory item not found: ${item.inventoryItemId}`);
                }
                if (!inventoryItem.isActive) {
                    throw new common_1.BadRequestException(`Cannot order inactive inventory item: ${inventoryItem.name}`);
                }
                const itemTotal = item.unitCost * item.quantity;
                subtotal += itemTotal;
                orderItems.push({
                    inventoryItemId: item.inventoryItemId,
                    quantity: item.quantity,
                    unitCost: item.unitCost,
                    totalCost: itemTotal,
                });
            }
            const purchaseOrder = await this.purchaseOrderModel.create({
                orderNumber: data.orderNumber,
                vendorId: data.vendorId,
                orderDate: new Date(data.orderDate),
                expectedDate: data.expectedDate
                    ? new Date(data.expectedDate)
                    : undefined,
                notes: data.notes,
                subtotal,
                tax: 0,
                shipping: 0,
                total: subtotal,
                status: models_1.PurchaseOrderStatus.PENDING,
            }, { transaction });
            for (const item of orderItems) {
                await this.purchaseOrderItemModel.create({
                    ...item,
                    purchaseOrderId: purchaseOrder.id,
                }, { transaction });
            }
            const completeOrder = await this.purchaseOrderModel.findByPk(purchaseOrder.id, {
                include: [
                    { model: models_3.Vendor, as: 'vendor' },
                    {
                        model: models_2.PurchaseOrderItem,
                        as: 'items',
                        include: [{ model: models_4.InventoryItem, as: 'inventoryItem' }],
                    },
                ],
                transaction,
            });
            if (!completeOrder) {
                throw new Error('Failed to reload purchase order after creation');
            }
            await transaction.commit();
            this.logger.log(`Purchase order created: ${completeOrder.orderNumber} (${orderItems.length} items, $${subtotal.toFixed(2)})`);
            return completeOrder;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error creating purchase order:', error);
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Failed to create purchase order. Please try again.');
        }
    }
    async getPurchaseOrders(status, vendorId) {
        try {
            const where = {};
            if (status) {
                where.status = status;
            }
            if (vendorId) {
                where.vendorId = vendorId;
            }
            const purchaseOrders = await this.purchaseOrderModel.findAll({
                where,
                include: [
                    { model: models_3.Vendor, as: 'vendor' },
                    { model: models_2.PurchaseOrderItem, as: 'items' },
                ],
                order: [['orderDate', 'DESC']],
            });
            return purchaseOrders;
        }
        catch (error) {
            this.logger.error('Error getting purchase orders:', error);
            throw error;
        }
    }
    async getPurchaseOrderById(id) {
        try {
            const purchaseOrder = await this.purchaseOrderModel.findByPk(id, {
                include: [
                    { model: models_3.Vendor, as: 'vendor' },
                    {
                        model: models_2.PurchaseOrderItem,
                        as: 'items',
                        include: [{ model: models_4.InventoryItem, as: 'inventoryItem' }],
                    },
                ],
            });
            if (!purchaseOrder) {
                throw new common_1.NotFoundException('Purchase order not found');
            }
            return purchaseOrder;
        }
        catch (error) {
            this.logger.error('Error getting purchase order by ID:', error);
            throw error;
        }
    }
    async updatePurchaseOrderStatus(id, status, receivedDate) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_2.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            const purchaseOrder = await this.purchaseOrderModel.findByPk(id, {
                include: [{ model: models_2.PurchaseOrderItem, as: 'items' }],
                transaction,
            });
            if (!purchaseOrder) {
                throw new common_1.NotFoundException('Purchase order not found');
            }
            const validTransitions = {
                [models_1.PurchaseOrderStatus.PENDING]: [
                    models_1.PurchaseOrderStatus.APPROVED,
                    models_1.PurchaseOrderStatus.CANCELLED,
                ],
                [models_1.PurchaseOrderStatus.APPROVED]: [
                    models_1.PurchaseOrderStatus.ORDERED,
                    models_1.PurchaseOrderStatus.CANCELLED,
                ],
                [models_1.PurchaseOrderStatus.ORDERED]: [
                    models_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
                    models_1.PurchaseOrderStatus.RECEIVED,
                    models_1.PurchaseOrderStatus.CANCELLED,
                ],
                [models_1.PurchaseOrderStatus.PARTIALLY_RECEIVED]: [
                    models_1.PurchaseOrderStatus.RECEIVED,
                    models_1.PurchaseOrderStatus.CANCELLED,
                ],
                [models_1.PurchaseOrderStatus.RECEIVED]: [],
                [models_1.PurchaseOrderStatus.CANCELLED]: [],
            };
            const currentStatus = purchaseOrder.status;
            if (!validTransitions[currentStatus].includes(status)) {
                throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${status}`);
            }
            purchaseOrder.status = status;
            if ([
                models_1.PurchaseOrderStatus.RECEIVED,
                models_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
            ].includes(status)) {
                purchaseOrder.receivedDate = receivedDate || new Date();
            }
            const updatedOrder = await purchaseOrder.save({ transaction });
            await transaction.commit();
            this.logger.log(`Purchase order ${purchaseOrder.orderNumber} status updated: ${currentStatus} -> ${status}`);
            return updatedOrder;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error updating purchase order status:', error);
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Failed to update purchase order status. Please try again.');
        }
    }
};
exports.InventoryPurchaseOrderService = InventoryPurchaseOrderService;
exports.InventoryPurchaseOrderService = InventoryPurchaseOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.PurchaseOrder)),
    __param(2, (0, sequelize_1.InjectModel)(models_2.PurchaseOrderItem)),
    __param(3, (0, sequelize_1.InjectModel)(models_3.Vendor)),
    __param(4, (0, sequelize_1.InjectModel)(models_4.InventoryItem)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], InventoryPurchaseOrderService);
//# sourceMappingURL=purchase-order.service.js.map