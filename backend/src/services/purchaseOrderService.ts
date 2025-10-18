/**
 * WC-GEN-290 | purchaseOrderService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../utils/logger';
import {
  PurchaseOrder,
  PurchaseOrderItem,
  Vendor,
  InventoryItem,
  InventoryTransaction,
  sequelize
} from '../database/models';
import { PurchaseOrderStatus, InventoryTransactionType } from '../database/types/enums';

export interface CreatePurchaseOrderData {
  vendorId: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
    notes?: string;
  }>;
  expectedDate?: Date;
  notes?: string;
  tax?: number;
  shipping?: number;
}

export interface UpdatePurchaseOrderData {
  status?: PurchaseOrderStatus;
  expectedDate?: Date;
  receivedDate?: Date;
  notes?: string;
  approvedBy?: string;
}

export interface ReceiveItemsData {
  items: Array<{
    purchaseOrderItemId: string;
    receivedQty: number;
  }>;
}

export interface PurchaseOrderFilters {
  status?: PurchaseOrderStatus;
  vendorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class PurchaseOrderService {
  /**
   * Get purchase orders with filters and pagination
   */
  static async getPurchaseOrders(
    page: number = 1,
    limit: number = 20,
    filters: PurchaseOrderFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.vendorId) {
        whereClause.vendorId = filters.vendorId;
      }

      if (filters.startDate || filters.endDate) {
        whereClause.orderDate = {};
        if (filters.startDate) {
          whereClause.orderDate[Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.orderDate[Op.lte] = filters.endDate;
        }
      }

      const { rows: orders, count: total } = await PurchaseOrder.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Vendor,
            as: 'vendor',
            attributes: ['id', 'name', 'contactName', 'email', 'phone']
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem',
                attributes: ['id', 'name', 'sku', 'category']
              }
            ]
          }
        ],
        offset,
        limit,
        order: [['orderDate', 'DESC']],
        distinct: true
      });

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching purchase orders:', error);
      throw new Error('Failed to fetch purchase orders');
    }
  }

  /**
   * Get purchase order by ID with full details
   */
  static async getPurchaseOrderById(id: string) {
    try {
      const order = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      if (!order) {
        throw new Error('Purchase order not found');
      }

      return order;
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      throw error;
    }
  }

  /**
   * Create purchase order with transaction handling
   */
  static async createPurchaseOrder(data: CreatePurchaseOrderData) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      // Verify vendor exists
      const vendor = await Vendor.findByPk(data.vendorId, { transaction });

      if (!vendor) {
        await transaction.rollback();
        throw new Error('Vendor not found');
      }

      // Verify all inventory items exist and calculate totals
      let subtotal = 0;
      const itemsData = [];

      for (const item of data.items) {
        const inventoryItem = await InventoryItem.findByPk(item.inventoryItemId, { transaction });

        if (!inventoryItem) {
          await transaction.rollback();
          throw new Error(`Inventory item not found: ${item.inventoryItemId}`);
        }

        const totalCost = item.quantity * item.unitCost;
        subtotal += totalCost;

        itemsData.push({
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost,
          notes: item.notes
        });
      }

      const tax = data.tax || 0;
      const shipping = data.shipping || 0;
      const total = subtotal + tax + shipping;

      // Generate unique order number with date prefix
      const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const orderNumber = `PO-${datePrefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      // Create purchase order
      const purchaseOrder = await PurchaseOrder.create(
        {
          orderNumber,
          vendorId: data.vendorId,
          expectedDate: data.expectedDate,
          notes: data.notes,
          subtotal,
          tax,
          shipping,
          total,
          status: PurchaseOrderStatus.PENDING
        },
        { transaction }
      );

      // Create purchase order items
      for (const itemData of itemsData) {
        await PurchaseOrderItem.create(
          {
            purchaseOrderId: purchaseOrder.id,
            ...itemData
          },
          { transaction }
        );
      }

      await transaction.commit();

      // Reload with associations
      await purchaseOrder.reload({
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      logger.info(`Purchase order created: ${orderNumber} for ${vendor.name}`);
      return purchaseOrder;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating purchase order:', error);
      throw error;
    }
  }

  /**
   * Update purchase order
   */
  static async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderData) {
    try {
      const existingOrder = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: Vendor,
            as: 'vendor'
          }
        ]
      });

      if (!existingOrder) {
        throw new Error('Purchase order not found');
      }

      const updateData: any = { ...data };

      // If approving, set approval timestamp
      if (data.status === PurchaseOrderStatus.APPROVED && !existingOrder.approvedAt) {
        updateData.approvedAt = new Date();
      }

      await existingOrder.update(updateData);

      // Reload with full associations
      await existingOrder.reload({
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      logger.info(`Purchase order updated: ${existingOrder.orderNumber} - Status: ${existingOrder.status}`);
      return existingOrder;
    } catch (error) {
      logger.error('Error updating purchase order:', error);
      throw error;
    }
  }

  /**
   * Approve purchase order
   */
  static async approvePurchaseOrder(id: string, approvedBy: string) {
    try {
      const order = await PurchaseOrder.findByPk(id);

      if (!order) {
        throw new Error('Purchase order not found');
      }

      if (order.status !== PurchaseOrderStatus.PENDING) {
        throw new Error(`Cannot approve order with status: ${order.status}`);
      }

      await order.update({
        status: PurchaseOrderStatus.APPROVED,
        approvedBy,
        approvedAt: new Date()
      });

      // Reload with associations
      await order.reload({
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      logger.info(`Purchase order approved: ${order.orderNumber} by ${approvedBy}`);
      return order;
    } catch (error) {
      logger.error('Error approving purchase order:', error);
      throw error;
    }
  }

  /**
   * Receive items from purchase order with transaction handling
   */
  static async receiveItems(id: string, data: ReceiveItemsData, performedBy: string) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const order = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: PurchaseOrderItem,
            as: 'items'
          }
        ],
        transaction
      });

      if (!order) {
        await transaction.rollback();
        throw new Error('Purchase order not found');
      }

      if (order.status !== PurchaseOrderStatus.APPROVED && order.status !== PurchaseOrderStatus.ORDERED && order.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
        await transaction.rollback();
        throw new Error(`Cannot receive items for order with status: ${order.status}`);
      }

      // Update received quantities and create inventory transactions
      if (!order.items || order.items.length === 0) {
        await transaction.rollback();
        throw new Error('Purchase order has no items');
      }

      for (const receivedItem of data.items) {
        const poItem = order.items.find((item: any) => item.id === receivedItem.purchaseOrderItemId);

        if (!poItem) {
          await transaction.rollback();
          throw new Error(`Purchase order item not found: ${receivedItem.purchaseOrderItemId}`);
        }

        // Validate received quantity
        const newReceivedQty = poItem.receivedQty + receivedItem.receivedQty;
        if (newReceivedQty > poItem.quantity) {
          await transaction.rollback();
          throw new Error(`Received quantity (${newReceivedQty}) exceeds ordered quantity (${poItem.quantity}) for item`);
        }

        // Update purchase order item
        await PurchaseOrderItem.update(
          {
            receivedQty: newReceivedQty
          },
          {
            where: { id: receivedItem.purchaseOrderItemId },
            transaction
          }
        );

        // Create inventory transaction
        await InventoryTransaction.create(
          {
            inventoryItemId: poItem.inventoryItemId,
            type: InventoryTransactionType.PURCHASE,
            quantity: receivedItem.receivedQty,
            unitCost: poItem.unitCost,
            reason: `Received from PO ${order.orderNumber}`,
            performedById: performedBy
          },
          { transaction }
        );
      }

      // Check if all items are fully received
      const updatedOrder = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: PurchaseOrderItem,
            as: 'items'
          }
        ],
        transaction
      });

      if (!updatedOrder || !updatedOrder.items || updatedOrder.items.length === 0) {
        await transaction.rollback();
        throw new Error('Updated order has no items');
      }

      const allReceived = updatedOrder.items.every((item: any) => item.receivedQty >= item.quantity);
      const partiallyReceived = updatedOrder.items.some((item: any) => item.receivedQty > 0);

      let newStatus: PurchaseOrderStatus = order.status;
      if (allReceived) {
        newStatus = PurchaseOrderStatus.RECEIVED;
      } else if (partiallyReceived) {
        newStatus = PurchaseOrderStatus.PARTIALLY_RECEIVED;
      }

      const updateData: any = { status: newStatus };
      if (allReceived) {
        updateData.receivedDate = new Date();
      }

      await order.update(updateData, { transaction });

      await transaction.commit();

      // Reload with full associations
      await order.reload({
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      logger.info(`Items received for PO ${order.orderNumber}. Status: ${newStatus}`);
      return order;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error receiving items:', error);
      throw error;
    }
  }

  /**
   * Cancel purchase order
   */
  static async cancelPurchaseOrder(id: string, reason?: string) {
    try {
      const order = await PurchaseOrder.findByPk(id);

      if (!order) {
        throw new Error('Purchase order not found');
      }

      if (order.status === PurchaseOrderStatus.RECEIVED || order.status === PurchaseOrderStatus.CANCELLED) {
        throw new Error(`Cannot cancel order with status: ${order.status}`);
      }

      const updateData: any = {
        status: PurchaseOrderStatus.CANCELLED
      };

      if (reason) {
        updateData.notes = order.notes ? `${order.notes}\n\nCANCELLED: ${reason}` : `CANCELLED: ${reason}`;
      }

      await order.update(updateData);

      // Reload with associations
      await order.reload({
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem'
              }
            ]
          }
        ]
      });

      logger.info(`Purchase order cancelled: ${order.orderNumber}${reason ? ` - Reason: ${reason}` : ''}`);
      return order;
    } catch (error) {
      logger.error('Error cancelling purchase order:', error);
      throw error;
    }
  }

  /**
   * Get items needing reorder based on current stock levels
   */
  static async getItemsNeedingReorder() {
    try {
      // Get all active inventory items with their transaction totals
      const items = await InventoryItem.findAll({
        where: {
          isActive: true
        },
        include: [
          {
            model: InventoryTransaction,
            as: 'transactions',
            attributes: []
          }
        ],
        attributes: [
          'id',
          'name',
          'category',
          'description',
          'sku',
          'supplier',
          'unitCost',
          'reorderLevel',
          'reorderQuantity',
          'location',
          [
            sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('transactions.quantity')), 0),
            'currentStock'
          ]
        ],
        group: ['InventoryItem.id'],
        having: sequelize.where(
          sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('transactions.quantity')), 0),
          Op.lte,
          sequelize.col('InventoryItem.reorderLevel')
        ),
        order: [[sequelize.literal('currentStock'), 'ASC']],
        raw: true
      });

      // Format the results
      const formattedItems = items.map((item: any) => ({
        ...item,
        currentStock: parseInt(item.currentStock || '0', 10),
        suggestedOrderQty: item.reorderQuantity
      }));

      return formattedItems;
    } catch (error) {
      logger.error('Error getting items needing reorder:', error);
      throw error;
    }
  }

  /**
   * Delete purchase order (admin only, for draft orders)
   */
  static async deletePurchaseOrder(id: string) {
    try {
      const order = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: PurchaseOrderItem,
            as: 'items'
          }
        ]
      });

      if (!order) {
        throw new Error('Purchase order not found');
      }

      if (order.status !== PurchaseOrderStatus.PENDING) {
        throw new Error(`Cannot delete order with status: ${order.status}. Only PENDING orders can be deleted.`);
      }

      await order.destroy();

      logger.info(`Purchase order deleted: ${order.orderNumber}`);
      return { success: true, message: 'Purchase order deleted successfully' };
    } catch (error) {
      logger.error('Error deleting purchase order:', error);
      throw error;
    }
  }

  /**
   * Get purchase order statistics
   */
  static async getPurchaseOrderStatistics() {
    try {
      const [
        totalOrders,
        pendingOrders,
        approvedOrders,
        partiallyReceivedOrders,
        totalValue,
        recentOrders
      ] = await Promise.all([
        PurchaseOrder.count(),
        PurchaseOrder.count({
          where: {
            status: PurchaseOrderStatus.PENDING
          }
        }),
        PurchaseOrder.count({
          where: {
            status: PurchaseOrderStatus.APPROVED
          }
        }),
        PurchaseOrder.count({
          where: {
            status: PurchaseOrderStatus.PARTIALLY_RECEIVED
          }
        }),
        PurchaseOrder.sum('total', {
          where: {
            status: {
              [Op.in]: [PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.ORDERED, PurchaseOrderStatus.PARTIALLY_RECEIVED, PurchaseOrderStatus.RECEIVED]
            }
          }
        }),
        PurchaseOrder.count({
          where: {
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        })
      ]);

      const statistics = {
        totalOrders,
        pendingOrders,
        approvedOrders,
        partiallyReceivedOrders,
        totalValue: totalValue || 0,
        recentOrders
      };

      logger.info('Retrieved purchase order statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting purchase order statistics:', error);
      throw error;
    }
  }

  /**
   * Get vendor purchase order history
   */
  static async getVendorPurchaseHistory(vendorId: string, limit: number = 10) {
    try {
      const vendor = await Vendor.findByPk(vendorId);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      const orders = await PurchaseOrder.findAll({
        where: {
          vendorId
        },
        include: [
          {
            model: PurchaseOrderItem,
            as: 'items',
            include: [
              {
                model: InventoryItem,
                as: 'inventoryItem',
                attributes: ['id', 'name', 'sku']
              }
            ]
          }
        ],
        order: [['orderDate', 'DESC']],
        limit
      });

      return {
        vendor,
        orders,
        totalOrders: orders.length
      };
    } catch (error) {
      logger.error('Error fetching vendor purchase history:', error);
      throw error;
    }
  }
}
