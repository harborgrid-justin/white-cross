import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface CreateInventoryItemData {
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
}

export interface UpdateInventoryItemData {
  name?: string;
  category?: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateInventoryTransactionData {
  inventoryItemId: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: Date;
  performedBy: string;
  notes?: string;
}

export interface CreateMaintenanceLogData {
  inventoryItemId: string;
  type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING';
  description: string;
  performedBy: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  vendor?: string;
  notes?: string;
}

export interface InventoryFilters {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
}

export interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'MAINTENANCE_DUE' | 'OUT_OF_STOCK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  itemId: string;
  itemName: string;
  daysUntilAction?: number;
}

export class InventoryService {
  /**
   * Get inventory items with pagination and filters
   */
  static async getInventoryItems(
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilters = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const whereClause: any = {};
      
      if (filters.category) {
        whereClause.category = filters.category;
      }
      
      if (filters.supplier) {
        whereClause.supplier = { contains: filters.supplier, mode: 'insensitive' };
      }
      
      if (filters.location) {
        whereClause.location = { contains: filters.location, mode: 'insensitive' };
      }
      
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
      }
      
      // Handle low stock filter in the query result processing
      let items = await prisma.$queryRaw`
        SELECT 
          i.*,
          COALESCE(stock.totalQuantity, 0) as currentStock,
          CASE 
            WHEN COALESCE(stock.totalQuantity, 0) <= i.reorderLevel THEN true 
            ELSE false 
          END as isLowStock,
          stock.earliestExpiration
        FROM "inventory_items" i
        LEFT JOIN (
          SELECT 
            "inventoryItemId",
            SUM("quantity") as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM "inventory_transactions" 
          WHERE "type" IN ('PURCHASE', 'ADJUSTMENT')
          OR ("type" IN ('USAGE', 'DISPOSAL') AND "quantity" < 0)
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE (${!filters.category} OR i.category = ${filters.category})
        AND (${!filters.supplier} OR i.supplier ILIKE ${'%' + (filters.supplier || '') + '%'})
        AND (${!filters.location} OR i.location ILIKE ${'%' + (filters.location || '') + '%'})
        AND (${filters.isActive === undefined} OR i."isActive" = ${filters.isActive})
        ORDER BY i.name
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      // Apply low stock filter if needed
      if (filters.lowStock) {
        items = (items as any[]).filter((item: any) => item.isLowStock);
      }

      const total = await prisma.inventoryItem.count({ where: whereClause });

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching inventory items:', error);
      throw new Error('Failed to fetch inventory items');
    }
  }

  /**
   * Create new inventory item
   */
  static async createInventoryItem(data: CreateInventoryItemData) {
    try {
      // Check if item with same name already exists
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          name: data.name,
          isActive: true
        }
      });

      if (existingItem) {
        throw new Error('Inventory item with this name already exists');
      }

      const item = await prisma.inventoryItem.create({
        data
      });

      logger.info(`Inventory item created: ${item.name} (${item.category})`);
      return item;
    } catch (error) {
      logger.error('Error creating inventory item:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   */
  static async updateInventoryItem(id: string, data: UpdateInventoryItemData) {
    try {
      const existingItem = await prisma.inventoryItem.findUnique({
        where: { id }
      });

      if (!existingItem) {
        throw new Error('Inventory item not found');
      }

      const item = await prisma.inventoryItem.update({
        where: { id },
        data
      });

      logger.info(`Inventory item updated: ${item.name}`);
      return item;
    } catch (error) {
      logger.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Create inventory transaction
   */
  static async createInventoryTransaction(data: CreateInventoryTransactionData) {
    try {
      // Verify inventory item exists
      const item = await prisma.inventoryItem.findUnique({
        where: { id: data.inventoryItemId }
      });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // For usage and disposal, make quantity negative
      let quantity = data.quantity;
      if (['USAGE', 'DISPOSAL'].includes(data.type) && quantity > 0) {
        quantity = -quantity;
      }

      const transaction = await prisma.inventoryTransaction.create({
        data: {
          ...data,
          quantity
        },
        include: {
          inventoryItem: true,
          performedByUser: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Inventory transaction created: ${data.type} ${Math.abs(quantity)} of ${item.name}`);
      return transaction;
    } catch (error) {
      logger.error('Error creating inventory transaction:', error);
      throw error;
    }
  }

  /**
   * Get current stock level for an item
   */
  static async getCurrentStock(inventoryItemId: string) {
    try {
      const result = await prisma.inventoryTransaction.aggregate({
        where: { inventoryItemId },
        _sum: { quantity: true }
      });

      return result._sum.quantity || 0;
    } catch (error) {
      logger.error('Error getting current stock:', error);
      throw error;
    }
  }

  /**
   * Get inventory alerts
   */
  static async getInventoryAlerts(): Promise<InventoryAlert[]> {
    try {
      const alerts: InventoryAlert[] = [];
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Get items with current stock and expiration info
      const items = await prisma.$queryRaw`
        SELECT 
          i.*,
          COALESCE(stock.totalQuantity, 0) as currentStock,
          stock.earliestExpiration,
          maint.nextMaintenanceDate
        FROM "inventory_items" i
        LEFT JOIN (
          SELECT 
            "inventoryItemId",
            SUM("quantity") as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM "inventory_transactions" 
          WHERE "expirationDate" IS NOT NULL
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        LEFT JOIN (
          SELECT 
            "inventoryItemId",
            MIN("nextMaintenanceDate") as nextMaintenanceDate
          FROM "maintenance_logs"
          WHERE "nextMaintenanceDate" IS NOT NULL
          AND "nextMaintenanceDate" > NOW()
          GROUP BY "inventoryItemId"
        ) maint ON i.id = maint."inventoryItemId"
        WHERE i."isActive" = true
      `;

      for (const item of items as any[]) {
        // Low stock alerts
        if (item.currentStock <= item.reorderLevel) {
          alerts.push({
            id: `low_stock_${item.id}`,
            type: item.currentStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
            severity: item.currentStock === 0 ? 'CRITICAL' : 'HIGH',
            message: item.currentStock === 0 
              ? `${item.name} is out of stock`
              : `${item.name} is low in stock (${item.currentStock} remaining, reorder at ${item.reorderLevel})`,
            itemId: item.id,
            itemName: item.name
          });
        }

        // Expiration alerts
        if (item.earliestExpiration) {
          const expirationDate = new Date(item.earliestExpiration);
          const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

          if (expirationDate <= now) {
            alerts.push({
              id: `expired_${item.id}`,
              type: 'EXPIRED',
              severity: 'CRITICAL',
              message: `${item.name} has expired items`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilExpiration
            });
          } else if (expirationDate <= thirtyDaysFromNow) {
            alerts.push({
              id: `near_expiry_${item.id}`,
              type: 'NEAR_EXPIRY',
              severity: daysUntilExpiration <= 7 ? 'HIGH' : 'MEDIUM',
              message: `${item.name} expires in ${daysUntilExpiration} days`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilExpiration
            });
          }
        }

        // Maintenance alerts
        if (item.nextMaintenanceDate) {
          const maintenanceDate = new Date(item.nextMaintenanceDate);
          const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

          if (maintenanceDate <= now) {
            alerts.push({
              id: `maintenance_overdue_${item.id}`,
              type: 'MAINTENANCE_DUE',
              severity: 'HIGH',
              message: `${item.name} maintenance is overdue`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilMaintenance
            });
          } else if (daysUntilMaintenance <= 7) {
            alerts.push({
              id: `maintenance_due_${item.id}`,
              type: 'MAINTENANCE_DUE',
              severity: 'MEDIUM',
              message: `${item.name} maintenance due in ${daysUntilMaintenance} days`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilMaintenance
            });
          }
        }
      }

      // Sort by severity (CRITICAL first, then HIGH, MEDIUM, LOW)
      const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      return alerts;
    } catch (error) {
      logger.error('Error getting inventory alerts:', error);
      throw error;
    }
  }

  /**
   * Create maintenance log
   */
  static async createMaintenanceLog(data: CreateMaintenanceLogData) {
    try {
      // Verify inventory item exists
      const item = await prisma.inventoryItem.findUnique({
        where: { id: data.inventoryItemId }
      });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      const maintenanceLog = await prisma.maintenanceLog.create({
        data,
        include: {
          inventoryItem: true,
          performedByUser: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info(`Maintenance log created: ${data.type} for ${item.name} by ${data.performedBy}`);
      return maintenanceLog;
    } catch (error) {
      logger.error('Error creating maintenance log:', error);
      throw error;
    }
  }

  /**
   * Get maintenance schedule
   */
  static async getMaintenanceSchedule(startDate: Date, endDate: Date) {
    try {
      const maintenanceDue = await prisma.maintenanceLog.findMany({
        where: {
          nextMaintenanceDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          inventoryItem: {
            select: {
              id: true,
              name: true,
              category: true,
              location: true
            }
          }
        },
        orderBy: { nextMaintenanceDate: 'asc' }
      });

      return maintenanceDue;
    } catch (error) {
      logger.error('Error getting maintenance schedule:', error);
      throw error;
    }
  }

  /**
   * Generate purchase order
   */
  static async generatePurchaseOrder(items: Array<{ inventoryItemId: string; quantity: number }>) {
    try {
      const orderItems = [];
      let totalCost = 0;

      for (const item of items) {
        const inventoryItem = await prisma.inventoryItem.findUnique({
          where: { id: item.inventoryItemId }
        });

        if (!inventoryItem) {
          throw new Error(`Inventory item not found: ${item.inventoryItemId}`);
        }

        const itemTotal = (inventoryItem.unitCost || 0) * item.quantity;
        totalCost += itemTotal;

        orderItems.push({
          item: inventoryItem,
          quantity: item.quantity,
          unitCost: inventoryItem.unitCost || 0,
          totalCost: itemTotal
        });
      }

      const purchaseOrder = {
        orderNumber: `PO-${Date.now()}`,
        orderDate: new Date(),
        items: orderItems,
        totalCost,
        status: 'PENDING'
      };

      logger.info(`Purchase order generated: ${purchaseOrder.orderNumber} (${orderItems.length} items, $${totalCost})`);
      return purchaseOrder;
    } catch (error) {
      logger.error('Error generating purchase order:', error);
      throw error;
    }
  }

  /**
   * Get inventory valuation
   */
  static async getInventoryValuation() {
    try {
      const valuation = await prisma.$queryRaw`
        SELECT 
          i.category,
          COUNT(i.id) as itemCount,
          COALESCE(SUM(stock.totalQuantity * i."unitCost"), 0) as totalValue,
          COALESCE(SUM(stock.totalQuantity), 0) as totalQuantity
        FROM "inventory_items" i
        LEFT JOIN (
          SELECT 
            "inventoryItemId",
            SUM("quantity") as totalQuantity
          FROM "inventory_transactions" 
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        GROUP BY i.category
        ORDER BY totalValue DESC
      `;

      return valuation;
    } catch (error) {
      logger.error('Error getting inventory valuation:', error);
      throw error;
    }
  }

  /**
   * Get usage analytics
   */
  static async getUsageAnalytics(startDate: Date, endDate: Date) {
    try {
      const analytics = await prisma.$queryRaw`
        SELECT 
          i.name,
          i.category,
          COUNT(t.id) as transactionCount,
          SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END) as totalUsage,
          AVG(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE NULL END) as averageUsage,
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity ELSE 0 END) as totalPurchased
        FROM "inventory_items" i
        LEFT JOIN "inventory_transactions" t ON i.id = t."inventoryItemId"
        WHERE t."createdAt" BETWEEN ${startDate} AND ${endDate}
        GROUP BY i.id, i.name, i.category
        HAVING COUNT(t.id) > 0
        ORDER BY totalUsage DESC
      `;

      return analytics;
    } catch (error) {
      logger.error('Error getting usage analytics:', error);
      throw error;
    }
  }

  /**
   * Get supplier performance
   */
  static async getSupplierPerformance() {
    try {
      const performance = await prisma.$queryRaw`
        SELECT 
          i.supplier,
          COUNT(DISTINCT i.id) as itemCount,
          AVG(i."unitCost") as averageUnitCost,
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity ELSE 0 END) as totalPurchased,
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity * i."unitCost" ELSE 0 END) as totalSpent
        FROM "inventory_items" i
        LEFT JOIN "inventory_transactions" t ON i.id = t."inventoryItemId"
        WHERE i.supplier IS NOT NULL
        AND i."isActive" = true
        GROUP BY i.supplier
        ORDER BY totalSpent DESC
      `;

      return performance;
    } catch (error) {
      logger.error('Error getting supplier performance:', error);
      throw error;
    }
  }

  /**
   * Search inventory items
   */
  static async searchInventoryItems(query: string, limit: number = 20) {
    try {
      const items = await prisma.inventoryItem.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { supplier: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { name: 'asc' }
      });

      return items;
    } catch (error) {
      logger.error('Error searching inventory items:', error);
      throw error;
    }
  }
}