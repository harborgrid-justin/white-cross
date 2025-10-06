import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreatePurchaseOrderData {
  vendorId: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
  expectedDate?: Date;
  notes?: string;
  tax?: number;
  shipping?: number;
}

export interface UpdatePurchaseOrderData {
  status?: 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
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

export class PurchaseOrderService {
  /**
   * Get purchase orders with filters
   */
  static async getPurchaseOrders(
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: string;
      vendorId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const where: Prisma.PurchaseOrderWhereInput = {};
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.vendorId) {
        where.vendorId = filters.vendorId;
      }
      
      if (filters.startDate || filters.endDate) {
        where.orderDate = {};
        if (filters.startDate) where.orderDate.gte = filters.startDate;
        if (filters.endDate) where.orderDate.lte = filters.endDate;
      }
      
      const [orders, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where,
          include: {
            vendor: true,
            items: true
          },
          skip,
          take: limit,
          orderBy: { orderDate: 'desc' }
        }),
        prisma.purchaseOrder.count({ where })
      ]);

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
   * Get purchase order by ID
   */
  static async getPurchaseOrderById(id: string) {
    try {
      const order = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          vendor: true,
          items: true
        }
      });

      if (!order) {
        throw new Error('Purchase order not found');
      }

      // Enrich items with inventory item details
      const enrichedItems = await Promise.all(
        order.items.map(async (item) => {
          const inventoryItem = await prisma.inventoryItem.findUnique({
            where: { id: item.inventoryItemId }
          });
          return {
            ...item,
            inventoryItem
          };
        })
      );

      return {
        ...order,
        items: enrichedItems
      };
    } catch (error) {
      logger.error('Error fetching purchase order:', error);
      throw error;
    }
  }

  /**
   * Create purchase order
   */
  static async createPurchaseOrder(data: CreatePurchaseOrderData) {
    try {
      // Verify vendor exists
      const vendor = await prisma.vendor.findUnique({
        where: { id: data.vendorId }
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Verify all inventory items exist and calculate totals
      let subtotal = 0;
      const itemsData = [];

      for (const item of data.items) {
        const inventoryItem = await prisma.inventoryItem.findUnique({
          where: { id: item.inventoryItemId }
        });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${item.inventoryItemId}`);
        }

        const totalCost = item.quantity * item.unitCost;
        subtotal += totalCost;

        itemsData.push({
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost
        });
      }

      const tax = data.tax || 0;
      const shipping = data.shipping || 0;
      const total = subtotal + tax + shipping;

      // Generate unique order number
      const orderNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          orderNumber,
          vendorId: data.vendorId,
          expectedDate: data.expectedDate,
          notes: data.notes,
          subtotal,
          tax,
          shipping,
          total,
          items: {
            create: itemsData
          }
        },
        include: {
          vendor: true,
          items: true
        }
      });

      logger.info(`Purchase order created: ${orderNumber} for ${vendor.name}`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error creating purchase order:', error);
      throw error;
    }
  }

  /**
   * Update purchase order
   */
  static async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderData) {
    try {
      const updateData: Prisma.PurchaseOrderUpdateInput = { ...data };

      // If approving, set approval timestamp
      if (data.status === 'APPROVED' && !data.approvedBy) {
        updateData.approvedAt = new Date();
      }

      const order = await prisma.purchaseOrder.update({
        where: { id },
        data: updateData,
        include: {
          vendor: true,
          items: true
        }
      });

      logger.info(`Purchase order updated: ${order.orderNumber} - Status: ${order.status}`);
      return order;
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
      const order = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy,
          approvedAt: new Date()
        },
        include: {
          vendor: true,
          items: true
        }
      });

      logger.info(`Purchase order approved: ${order.orderNumber} by ${approvedBy}`);
      return order;
    } catch (error) {
      logger.error('Error approving purchase order:', error);
      throw error;
    }
  }

  /**
   * Receive items from purchase order
   */
  static async receiveItems(id: string, data: ReceiveItemsData, performedBy: string) {
    try {
      const order = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!order) {
        throw new Error('Purchase order not found');
      }

      // Update received quantities and create inventory transactions
      for (const receivedItem of data.items) {
        const poItem = order.items.find((item) => item.id === receivedItem.purchaseOrderItemId);
        
        if (!poItem) {
          throw new Error(`Purchase order item not found: ${receivedItem.purchaseOrderItemId}`);
        }

        // Update purchase order item
        await prisma.purchaseOrderItem.update({
          where: { id: receivedItem.purchaseOrderItemId },
          data: {
            receivedQty: {
              increment: receivedItem.receivedQty
            }
          }
        });

        // Create inventory transaction
        await prisma.inventoryTransaction.create({
          data: {
            inventoryItemId: poItem.inventoryItemId,
            type: 'PURCHASE',
            quantity: receivedItem.receivedQty,
            unitCost: poItem.unitCost,
            reason: `Received from PO ${order.orderNumber}`,
            performedById: performedBy
          }
        });
      }

      // Check if all items are fully received
      const updatedOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });

      const allReceived = updatedOrder!.items.every((item) => item.receivedQty >= item.quantity);
      const partiallyReceived = updatedOrder!.items.some((item) => item.receivedQty > 0);

      const newStatus = allReceived ? 'RECEIVED' : partiallyReceived ? 'PARTIALLY_RECEIVED' : order.status;

      const finalOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: newStatus,
          receivedDate: allReceived ? new Date() : undefined
        },
        include: {
          vendor: true,
          items: true
        }
      });

      logger.info(`Items received for PO ${order.orderNumber}. Status: ${newStatus}`);
      return finalOrder;
    } catch (error) {
      logger.error('Error receiving items:', error);
      throw error;
    }
  }

  /**
   * Cancel purchase order
   */
  static async cancelPurchaseOrder(id: string, reason?: string) {
    try {
      const order = await prisma.purchaseOrder.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          notes: reason ? `CANCELLED: ${reason}` : undefined
        },
        include: {
          vendor: true,
          items: true
        }
      });

      logger.info(`Purchase order cancelled: ${order.orderNumber}`);
      return order;
    } catch (error) {
      logger.error('Error cancelling purchase order:', error);
      throw error;
    }
  }

  /**
   * Get items needing reorder
   */
  static async getItemsNeedingReorder() {
    try {
      const items = await prisma.$queryRaw`
        SELECT 
          i.*,
          COALESCE(stock.totalQuantity, 0) as currentStock,
          i."reorderQuantity" as suggestedOrderQty
        FROM inventory_items i
        LEFT JOIN (
          SELECT 
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        AND COALESCE(stock.totalQuantity, 0) <= i."reorderLevel"
        ORDER BY COALESCE(stock.totalQuantity, 0) ASC
      `;

      return items;
    } catch (error) {
      logger.error('Error getting items needing reorder:', error);
      throw error;
    }
  }
}
