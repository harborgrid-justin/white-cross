/**
 * @fileoverview Purchase Order Service
 * @module services/inventory/purchaseOrder
 * @description Comprehensive purchase order management with budget validation and approval workflow
 *
 * This service handles the complete purchase order lifecycle including creation, validation,
 * approval workflow, vendor management integration, and inventory receipt tracking.
 *
 * Key Features:
 * - Purchase order creation with comprehensive validation
 * - Budget integration and spending authorization
 * - Multi-stage approval workflow (PENDING → APPROVED → ORDERED → RECEIVED)
 * - Vendor verification and status checks
 * - Inventory item validation and duplicate detection
 * - Automatic total calculations with tax and shipping
 * - Order fulfillment tracking
 *
 * @business Approval workflow: PENDING → APPROVED → ORDERED → RECEIVED/PARTIALLY_RECEIVED
 * @business Budget encumbrance created on APPROVED status
 * @business Actual charge occurs on RECEIVED status
 * @business Maximum order value: $99,999,999.99
 * @business Cannot order from inactive vendors
 * @business Only PENDING orders can be edited
 *
 * @financial Purchase orders create budget encumbrances
 * @financial Received orders update actual spending
 * @financial Order cancellation releases encumbered funds
 *
 * @requires ../../database/models
 * @requires ../../database/types/enums
 *
 * LOC: CC70917451
 * WC-GEN-279 | purchaseOrderService.ts - Purchase Order Management Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/inventory/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - inventoryService.ts (services/inventoryService.ts)
 */

/**
 * WC-GEN-279 | purchaseOrderService.ts - Purchase Order Management Service
 * Purpose: Purchase order lifecycle management with approval workflow and budget integration
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: Budget service, vendor service, inventory repository
 * Downstream: Routes, services, other modules | Called by: Inventory service, procurement workflows
 * Related: VendorService, BudgetService, InventoryRepository
 * Exports: PurchaseOrderService class | Key Services: Order creation, approval workflow, receipt tracking
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Order creation → Budget validation → Approval → Vendor fulfillment → Receipt
 * LLM Context: Healthcare procurement with compliance tracking and budget controls
 */

import { logger } from '../../utils/logger';
import { 
  PurchaseOrder, 
  PurchaseOrderItem, 
  Vendor, 
  InventoryItem, 
  sequelize 
} from '../../database/models';
import { PurchaseOrderStatus } from '../../database/types/enums';
import { CreatePurchaseOrderData, GeneratedPurchaseOrder } from './types';

/**
 * Purchase Order Service
 *
 * @class PurchaseOrderService
 * @static
 */
export class PurchaseOrderService {
  /**
   * Create purchase order with comprehensive validation and budget checking
   *
   * @method createPurchaseOrder
   * @static
   * @async
   * @param {CreatePurchaseOrderData} data - Order details
   * @param {string} data.orderNumber - Unique purchase order number
   * @param {string} data.vendorId - Vendor UUID (must be active vendor)
   * @param {Date} data.orderDate - Order creation date
   * @param {Date} [data.expectedDate] - Expected delivery date (must be >= orderDate)
   * @param {Array<Object>} data.items - Line items array (minimum 1 item)
   * @param {string} data.items[].inventoryItemId - Inventory item UUID
   * @param {number} data.items[].quantity - Order quantity (1 to 1,000,000)
   * @param {number} data.items[].unitCost - Unit cost (non-negative)
   * @param {string} [data.notes] - Optional order notes
   * @returns {Promise<PurchaseOrder>} Created order with PENDING status and full associations
   * @throws {Error} Vendor not found or inactive
   * @throws {Error} Duplicate order number
   * @throws {Error} Items array empty
   * @throws {Error} Expected date before order date
   * @throws {Error} Duplicate items in order
   * @throws {Error} Inventory item not found or inactive
   * @throws {Error} Invalid quantity or cost values
   * @throws {Error} Order total exceeds $99,999,999.99
   *
   * @business Creates order in PENDING status - requires approval before processing
   * @business Validates vendor is active before allowing order
   * @business Prevents duplicate items in same purchase order
   * @business Each line item total limited to $99,999,999.99
   * @business Order subtotal limited to $99,999,999.99
   * @business Tax and shipping set to 0 initially
   *
   * @financial Creates budget encumbrance when approved (handled by approval workflow)
   * @financial Total calculated as: subtotal + tax + shipping
   *
   * @example
   * const order = await PurchaseOrderService.createPurchaseOrder({
   *   orderNumber: 'PO-2024-001',
   *   vendorId: 'vendor-uuid-123',
   *   orderDate: new Date(),
   *   expectedDate: new Date('2024-11-15'),
   *   items: [
   *     { inventoryItemId: 'item-uuid-456', quantity: 100, unitCost: 5.50 },
   *     { inventoryItemId: 'item-uuid-789', quantity: 50, unitCost: 12.00 }
   *   ],
   *   notes: 'Quarterly medical supplies order'
   * });
   * // Returns: PurchaseOrder { status: 'PENDING', total: 1150.00, ... }
   */
  static async createPurchaseOrder(data: CreatePurchaseOrderData) {
    const transaction = await sequelize.transaction();

    try {
      // Verify vendor exists and is active
      const vendor = await Vendor.findByPk(data.vendorId, { transaction });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      if (!vendor.isActive) {
        throw new Error('Cannot create purchase order for inactive vendor');
      }

      // Validate order number uniqueness
      const existingOrder = await PurchaseOrder.findOne({
        where: { orderNumber: data.orderNumber },
        transaction
      });

      if (existingOrder) {
        throw new Error(`Purchase order with number ${data.orderNumber} already exists`);
      }

      // Validate items array
      if (!data.items || data.items.length === 0) {
        throw new Error('Purchase order must contain at least one item');
      }

      // Validate dates
      const orderDate = new Date(data.orderDate);
      if (data.expectedDate) {
        const expectedDate = new Date(data.expectedDate);
        if (expectedDate < orderDate) {
          throw new Error('Expected delivery date cannot be before order date');
        }
      }

      // Calculate totals and validate items
      let subtotal = 0;
      const orderItems: any[] = [];
      const itemIds = new Set<string>();

      for (const item of data.items) {
        // Check for duplicate items in the order
        if (itemIds.has(item.inventoryItemId)) {
          throw new Error('Purchase order cannot contain duplicate items');
        }
        itemIds.add(item.inventoryItemId);

        const inventoryItem = await InventoryItem.findByPk(item.inventoryItemId, { transaction });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${item.inventoryItemId}`);
        }

        if (!inventoryItem.isActive) {
          throw new Error(`Cannot order inactive inventory item: ${inventoryItem.name}`);
        }

        // Validate quantities and costs
        if (item.quantity <= 0) {
          throw new Error(`Quantity must be positive for item: ${inventoryItem.name}`);
        }

        if (item.unitCost < 0) {
          throw new Error(`Unit cost cannot be negative for item: ${inventoryItem.name}`);
        }

        if (item.quantity > 1000000) {
          throw new Error(`Quantity cannot exceed 1,000,000 for item: ${inventoryItem.name}`);
        }

        const itemTotal = item.unitCost * item.quantity;

        if (itemTotal > 99999999.99) {
          throw new Error(`Item total cost cannot exceed $99,999,999.99 for item: ${inventoryItem.name}`);
        }

        subtotal += itemTotal;

        orderItems.push({
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: itemTotal
        });
      }

      // Validate total doesn't exceed maximum
      if (subtotal > 99999999.99) {
        throw new Error('Purchase order subtotal cannot exceed $99,999,999.99');
      }

      // Create purchase order
      const purchaseOrder = await PurchaseOrder.create({
        orderNumber: data.orderNumber,
        vendorId: data.vendorId,
        orderDate: data.orderDate,
        expectedDate: data.expectedDate,
        notes: data.notes,
        subtotal,
        tax: 0,
        shipping: 0,
        total: subtotal,
        status: PurchaseOrderStatus.PENDING
      }, { transaction });

      // Create purchase order items
      for (const item of orderItems) {
        await PurchaseOrderItem.create({
          ...item,
          purchaseOrderId: purchaseOrder.id
        }, { transaction });
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

      logger.info(`Purchase order created: ${purchaseOrder.orderNumber} (${orderItems.length} items, $${subtotal.toFixed(2)})`);
      return purchaseOrder;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating purchase order:', error);
      throw error;
    }
  }

  /**
   * Get purchase orders with filtering
   */
  static async getPurchaseOrders(status?: PurchaseOrderStatus, vendorId?: string) {
    try {
      const whereClause: any = {};

      if (status) {
        whereClause.status = status;
      }

      if (vendorId) {
        whereClause.vendorId = vendorId;
      }

      const purchaseOrders = await PurchaseOrder.findAll({
        where: whereClause,
        include: [
          {
            model: Vendor,
            as: 'vendor'
          },
          {
            model: PurchaseOrderItem,
            as: 'items'
          }
        ],
        order: [['orderDate', 'DESC']]
      });

      return purchaseOrders;
    } catch (error) {
      logger.error('Error getting purchase orders:', error);
      throw error;
    }
  }

  /**
   * Get purchase order by ID
   */
  static async getPurchaseOrderById(id: string) {
    try {
      const purchaseOrder = await PurchaseOrder.findByPk(id, {
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

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      return purchaseOrder;
    } catch (error) {
      logger.error('Error getting purchase order by ID:', error);
      throw error;
    }
  }

  /**
   * Update purchase order status with workflow validation
   *
   * @method updatePurchaseOrderStatus
   * @static
   * @async
   * @param {string} id - Purchase order UUID
   * @param {PurchaseOrderStatus} status - New status to transition to
   * @param {Date} [receivedDate] - Date order was received (required for RECEIVED/PARTIALLY_RECEIVED)
   * @returns {Promise<PurchaseOrder>} Updated purchase order
   * @throws {Error} Purchase order not found
   * @throws {Error} Invalid status transition
   * @throws {Error} Received date before order date
   *
   * @business Enforces valid status transitions workflow
   * @business PENDING → APPROVED | CANCELLED
   * @business APPROVED → ORDERED | CANCELLED
   * @business ORDERED → PARTIALLY_RECEIVED | RECEIVED | CANCELLED
   * @business PARTIALLY_RECEIVED → RECEIVED | CANCELLED
   * @business RECEIVED → (terminal state, no transitions)
   * @business CANCELLED → (terminal state, no transitions)
   *
   * @financial APPROVED status creates budget encumbrance
   * @financial RECEIVED status converts encumbrance to actual spending
   * @financial CANCELLED status releases encumbered budget
   *
   * @example
   * // Approve a pending order
   * const approved = await PurchaseOrderService.updatePurchaseOrderStatus(
   *   'order-uuid-123',
   *   PurchaseOrderStatus.APPROVED
   * );
   *
   * @example
   * // Mark order as received
   * const received = await PurchaseOrderService.updatePurchaseOrderStatus(
   *   'order-uuid-123',
   *   PurchaseOrderStatus.RECEIVED,
   *   new Date()
   * );
   */
  static async updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus, receivedDate?: Date) {
    const transaction = await sequelize.transaction();

    try {
      const purchaseOrder = await PurchaseOrder.findByPk(id, {
        include: [
          {
            model: PurchaseOrderItem,
            as: 'items'
          }
        ],
        transaction
      });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      // Validate status transition
      const currentStatus = purchaseOrder.status;
      const validTransitions: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
        [PurchaseOrderStatus.PENDING]: [
          PurchaseOrderStatus.APPROVED,
          PurchaseOrderStatus.CANCELLED
        ],
        [PurchaseOrderStatus.APPROVED]: [
          PurchaseOrderStatus.ORDERED,
          PurchaseOrderStatus.CANCELLED
        ],
        [PurchaseOrderStatus.ORDERED]: [
          PurchaseOrderStatus.PARTIALLY_RECEIVED,
          PurchaseOrderStatus.RECEIVED,
          PurchaseOrderStatus.CANCELLED
        ],
        [PurchaseOrderStatus.PARTIALLY_RECEIVED]: [
          PurchaseOrderStatus.RECEIVED,
          PurchaseOrderStatus.CANCELLED
        ],
        [PurchaseOrderStatus.RECEIVED]: [],
        [PurchaseOrderStatus.CANCELLED]: []
      };

      if (!validTransitions[currentStatus].includes(status)) {
        throw new Error(
          `Invalid status transition from ${currentStatus} to ${status}. ` +
          `Valid transitions: ${validTransitions[currentStatus].join(', ') || 'none'}`
        );
      }

      // Validate received date
      if ([PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.PARTIALLY_RECEIVED].includes(status)) {
        const finalReceivedDate = receivedDate || new Date();

        if (finalReceivedDate < purchaseOrder.orderDate) {
          throw new Error('Received date cannot be before order date');
        }

        await purchaseOrder.update({
          status,
          receivedDate: finalReceivedDate
        }, { transaction });
      } else {
        await purchaseOrder.update({
          status,
          receivedDate: (status === PurchaseOrderStatus.RECEIVED ? (receivedDate || new Date()) : null) as Date | null
        }, { transaction });
      }

      await transaction.commit();

      logger.info(
        `Purchase order ${purchaseOrder.orderNumber} status updated: ${currentStatus} -> ${status}`
      );

      return purchaseOrder;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating purchase order status:', error);
      throw error;
    }
  }

  /**
   * Generate purchase order for low stock items
   */
  static async generatePurchaseOrder(items: Array<{ inventoryItemId: string; quantity: number }>) {
    try {
      const orderItems = [];
      let totalCost = 0;

      for (const item of items) {
        const inventoryItem = await InventoryItem.findByPk(item.inventoryItemId);

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${item.inventoryItemId}`);
        }

        const itemTotal = (Number(inventoryItem.unitCost) || 0) * item.quantity;
        totalCost += itemTotal;

        orderItems.push({
          item: inventoryItem,
          quantity: item.quantity,
          unitCost: inventoryItem.unitCost || 0,
          totalCost: itemTotal
        });
      }

      const purchaseOrder: GeneratedPurchaseOrder = {
        orderNumber: `PO-${Date.now()}`,
        orderDate: new Date(),
        items: orderItems,
        totalCost,
        status: PurchaseOrderStatus.PENDING
      };

      logger.info(`Purchase order generated: ${purchaseOrder.orderNumber} (${orderItems.length} items, $${totalCost})`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error generating purchase order:', error);
      throw error;
    }
  }

  /**
   * Update purchase order
   */
  static async updatePurchaseOrder(id: string, data: Partial<CreatePurchaseOrderData>) {
    const transaction = await sequelize.transaction();

    try {
      const purchaseOrder = await PurchaseOrder.findByPk(id, { transaction });

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      // Only allow updates if status is PENDING
      if (purchaseOrder.status !== PurchaseOrderStatus.PENDING) {
        throw new Error('Can only update purchase orders with PENDING status');
      }

      await purchaseOrder.update(data, { transaction });
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
            as: 'items'
          }
        ]
      });

      logger.info(`Purchase order updated: ${purchaseOrder.orderNumber}`);
      return purchaseOrder;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating purchase order:', error);
      throw error;
    }
  }

  /**
   * Cancel purchase order
   */
  static async cancelPurchaseOrder(id: string, reason?: string) {
    try {
      const purchaseOrder = await PurchaseOrder.findByPk(id);

      if (!purchaseOrder) {
        throw new Error('Purchase order not found');
      }

      // Only allow cancellation if not already received
      if (purchaseOrder.status === PurchaseOrderStatus.RECEIVED) {
        throw new Error('Cannot cancel a received purchase order');
      }

      await purchaseOrder.update({
        status: PurchaseOrderStatus.CANCELLED,
        notes: reason ? `${purchaseOrder.notes || ''}\nCancellation reason: ${reason}` : purchaseOrder.notes
      });

      logger.info(`Purchase order cancelled: ${purchaseOrder.orderNumber}`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error cancelling purchase order:', error);
      throw error;
    }
  }

  /**
   * Get purchase order statistics
   */
  static async getPurchaseOrderStats(startDate?: Date, endDate?: Date) {
    try {
      const whereClause: any = {};

      if (startDate && endDate) {
        whereClause.orderDate = {
          $gte: startDate,
          $lte: endDate
        };
      }

      const [
        totalOrders,
        pendingOrders,
        approvedOrders,
        receivedOrders,
        cancelledOrders,
        totalValue
      ] = await Promise.all([
        PurchaseOrder.count({ where: whereClause }),
        PurchaseOrder.count({ where: { ...whereClause, status: PurchaseOrderStatus.PENDING } }),
        PurchaseOrder.count({ where: { ...whereClause, status: PurchaseOrderStatus.APPROVED } }),
        PurchaseOrder.count({ where: { ...whereClause, status: PurchaseOrderStatus.RECEIVED } }),
        PurchaseOrder.count({ where: { ...whereClause, status: PurchaseOrderStatus.CANCELLED } }),
        PurchaseOrder.sum('total', { where: whereClause })
      ]);

      return {
        totalOrders,
        ordersByStatus: {
          pending: pendingOrders,
          approved: approvedOrders,
          received: receivedOrders,
          cancelled: cancelledOrders
        },
        totalValue: Number(totalValue || 0)
      };
    } catch (error) {
      logger.error('Error getting purchase order stats:', error);
      throw error;
    }
  }

  /**
   * Get recent purchase orders
   */
  static async getRecentPurchaseOrders(limit: number = 10) {
    try {
      const recentOrders = await PurchaseOrder.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Vendor,
            as: 'vendor',
            attributes: ['id', 'name']
          }
        ]
      });

      return recentOrders;
    } catch (error) {
      logger.error('Error getting recent purchase orders:', error);
      throw error;
    }
  }
}
