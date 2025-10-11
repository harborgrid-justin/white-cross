import { Op, QueryTypes } from 'sequelize';
import { logger } from '../utils/logger';
import {
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  BudgetCategory,
  BudgetTransaction,
  User,
  sequelize
} from '../database/models';
import { InventoryTransactionType, MaintenanceType, PurchaseOrderStatus } from '../database/types/enums';

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
  type: InventoryTransactionType;
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
  type: MaintenanceType;
  description: string;
  performedBy: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  vendor?: string;
  notes?: string;
}

export interface CreateVendorData {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
}

export interface CreatePurchaseOrderData {
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDate?: Date;
  notes?: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
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

interface StockQueryResult {
  id: string;
  name: string;
  category: string;
  description: string | null;
  sku: string | null;
  supplier: string | null;
  unitCost: number | null;
  reorderLevel: number;
  reorderQuantity: number;
  location: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentStock: number;
  isLowStock: boolean;
  earliestExpiration: Date | null;
  nextMaintenanceDate?: Date | null;
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
      const offset = (page - 1) * limit;

      // Build SQL conditions dynamically
      const conditions: string[] = ['1=1'];
      const replacements: any = { limit, offset };

      if (filters.category) {
        conditions.push('i.category = :category');
        replacements.category = filters.category;
      }

      if (filters.supplier) {
        conditions.push('i.supplier ILIKE :supplier');
        replacements.supplier = `%${filters.supplier}%`;
      }

      if (filters.location) {
        conditions.push('i.location ILIKE :location');
        replacements.location = `%${filters.location}%`;
      }

      if (filters.isActive !== undefined) {
        conditions.push('i."isActive" = :isActive');
        replacements.isActive = filters.isActive;
      }

      if (filters.lowStock) {
        conditions.push('COALESCE(stock.totalQuantity, 0) <= i."reorderLevel"');
      }

      const whereClause = conditions.join(' AND ');

      // Get items with current stock levels using raw SQL for complex aggregation
      const items = await sequelize.query<StockQueryResult>(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock",
          CASE
            WHEN COALESCE(stock.totalQuantity, 0) <= i."reorderLevel" THEN true
            ELSE false
          END as "isLowStock",
          stock.earliestExpiration as "earliestExpiration"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE ${whereClause}
        ORDER BY i.name
        LIMIT :limit
        OFFSET :offset
      `, {
        replacements,
        type: QueryTypes.SELECT
      });

      // Count total for pagination
      const [countResult] = await sequelize.query<{ count: number }>(`
        SELECT COUNT(*)::integer as count
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE ${whereClause}
      `, {
        replacements,
        type: QueryTypes.SELECT
      });

      const total = countResult?.count || 0;

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
      const existingItem = await InventoryItem.findOne({
        where: {
          name: data.name,
          isActive: true
        }
      });

      if (existingItem) {
        throw new Error('Inventory item with this name already exists');
      }

      const item = await InventoryItem.create(data);

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
      const existingItem = await InventoryItem.findByPk(id);

      if (!existingItem) {
        throw new Error('Inventory item not found');
      }

      await existingItem.update(data);

      logger.info(`Inventory item updated: ${existingItem.name}`);
      return existingItem;
    } catch (error) {
      logger.error('Error updating inventory item:', error);
      throw error;
    }
  }

  /**
   * Create inventory transaction with comprehensive validation
   */
  static async createInventoryTransaction(data: CreateInventoryTransactionData) {
    const dbTransaction = await sequelize.transaction();

    try {
      // Verify inventory item exists and is active
      const item = await InventoryItem.findByPk(data.inventoryItemId, { transaction: dbTransaction });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      if (!item.isActive) {
        throw new Error('Cannot create transaction for inactive inventory item');
      }

      // Validate quantity
      if (!data.quantity || data.quantity === 0) {
        throw new Error('Quantity must be a non-zero value');
      }

      // For usage and disposal, make quantity negative
      let quantity = data.quantity;
      if ([InventoryTransactionType.USAGE, InventoryTransactionType.DISPOSAL].includes(data.type) && quantity > 0) {
        quantity = -quantity;
      }

      // For usage and disposal, ensure we have enough stock
      if (quantity < 0) {
        const currentStock = await this.getCurrentStock(data.inventoryItemId);
        const newStock = currentStock + quantity;

        if (newStock < 0) {
          throw new Error(
            `Insufficient stock. Current stock: ${currentStock}, ` +
            `requested: ${Math.abs(quantity)}, available: ${currentStock}`
          );
        }
      }

      // Validate expiration date for purchases
      if (data.type === InventoryTransactionType.PURCHASE && data.expirationDate) {
        const expirationDate = new Date(data.expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expirationDate < today) {
          throw new Error('Cannot add inventory with an expiration date in the past');
        }
      }

      // Validate batch number format if provided
      if (data.batchNumber && !/^[A-Za-z0-9-_]+$/.test(data.batchNumber)) {
        throw new Error('Batch number can only contain alphanumeric characters, hyphens, and underscores');
      }

      // Require reason for adjustments and disposals
      if ([InventoryTransactionType.ADJUSTMENT, InventoryTransactionType.DISPOSAL].includes(data.type)) {
        if (!data.reason || data.reason.trim().length === 0) {
          throw new Error(`Reason is required for ${data.type.toLowerCase()} transactions`);
        }
      }

      const transaction = await InventoryTransaction.create({
        inventoryItemId: data.inventoryItemId,
        type: data.type,
        quantity,
        unitCost: data.unitCost,
        reason: data.reason,
        batchNumber: data.batchNumber,
        expirationDate: data.expirationDate,
        notes: data.notes,
        performedById: data.performedBy
      }, { transaction: dbTransaction });

      await dbTransaction.commit();

      // Reload with associations
      await transaction.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Inventory transaction created: ${data.type} ${Math.abs(quantity)} of ${item.name}`);
      return transaction;
    } catch (error) {
      await dbTransaction.rollback();
      logger.error('Error creating inventory transaction:', error);
      throw error;
    }
  }

  /**
   * Get current stock level for an item
   */
  static async getCurrentStock(inventoryItemId: string): Promise<number> {
    try {
      const result = await InventoryTransaction.findOne({
        where: { inventoryItemId },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
        ],
        raw: true
      }) as any;

      return Number(result?.totalQuantity) || 0;
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
      const items = await sequelize.query<StockQueryResult>(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock",
          stock.earliestExpiration as "earliestExpiration",
          maint.nextMaintenanceDate as "nextMaintenanceDate"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM inventory_transactions
          WHERE "expirationDate" IS NOT NULL
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            MIN("nextMaintenanceDate") as nextMaintenanceDate
          FROM maintenance_logs
          WHERE "nextMaintenanceDate" IS NOT NULL
          AND "nextMaintenanceDate" > NOW()
          GROUP BY "inventoryItemId"
        ) maint ON i.id = maint."inventoryItemId"
        WHERE i."isActive" = true
      `, {
        type: QueryTypes.SELECT
      });

      for (const item of items) {
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
      const item = await InventoryItem.findByPk(data.inventoryItemId);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      const maintenanceLog = await MaintenanceLog.create({
        inventoryItemId: data.inventoryItemId,
        type: data.type,
        description: data.description,
        cost: data.cost,
        nextMaintenanceDate: data.nextMaintenanceDate,
        vendor: data.vendor,
        notes: data.notes,
        performedById: data.performedBy
      });

      // Reload with associations
      await maintenanceLog.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
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
      const maintenanceDue = await MaintenanceLog.findAll({
        where: {
          nextMaintenanceDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category', 'location']
          }
        ],
        order: [['nextMaintenanceDate', 'ASC']]
      });

      return maintenanceDue;
    } catch (error) {
      logger.error('Error getting maintenance schedule:', error);
      throw error;
    }
  }

  /**
   * Create purchase order with comprehensive validation and budget checking
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

      const purchaseOrder = {
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
   * Get inventory valuation
   */
  static async getInventoryValuation() {
    try {
      const valuation = await sequelize.query(`
        SELECT
          i.category,
          COUNT(i.id)::integer as "itemCount",
          COALESCE(SUM(stock.totalQuantity * i."unitCost"), 0)::numeric as "totalValue",
          COALESCE(SUM(stock.totalQuantity), 0)::integer as "totalQuantity"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        GROUP BY i.category
        ORDER BY "totalValue" DESC
      `, {
        type: QueryTypes.SELECT
      });

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
      const analytics = await sequelize.query(`
        SELECT
          i.name,
          i.category,
          COUNT(t.id)::integer as "transactionCount",
          SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END)::integer as "totalUsage",
          AVG(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE NULL END)::numeric as "averageUsage",
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity ELSE 0 END)::integer as "totalPurchased"
        FROM inventory_items i
        LEFT JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE t."createdAt" BETWEEN :startDate AND :endDate
        GROUP BY i.id, i.name, i.category
        HAVING COUNT(t.id) > 0
        ORDER BY "totalUsage" DESC
      `, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });

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
      const performance = await sequelize.query(`
        SELECT
          i.supplier,
          COUNT(DISTINCT i.id)::integer as "itemCount",
          AVG(i."unitCost")::numeric as "averageUnitCost",
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity ELSE 0 END)::integer as "totalPurchased",
          SUM(CASE WHEN t.type = 'PURCHASE' THEN t.quantity * i."unitCost" ELSE 0 END)::numeric as "totalSpent"
        FROM inventory_items i
        LEFT JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE i.supplier IS NOT NULL
        AND i."isActive" = true
        GROUP BY i.supplier
        ORDER BY "totalSpent" DESC
      `, {
        type: QueryTypes.SELECT
      });

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
      const items = await InventoryItem.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { category: { [Op.iLike]: `%${query}%` } },
            { sku: { [Op.iLike]: `%${query}%` } },
            { supplier: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit,
        order: [['name', 'ASC']]
      });

      return items;
    } catch (error) {
      logger.error('Error searching inventory items:', error);
      throw error;
    }
  }

  /**
   * Get single inventory item by ID
   */
  static async getInventoryItem(id: string) {
    try {
      const item = await InventoryItem.findByPk(id, {
        include: [
          {
            model: InventoryTransaction,
            as: 'transactions',
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'performedBy',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          },
          {
            model: MaintenanceLog,
            as: 'maintenanceLogs',
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'performedBy',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          }
        ]
      });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Calculate current stock
      const currentStock = await this.getCurrentStock(id);

      return {
        ...item.get({ plain: true }),
        currentStock
      };
    } catch (error) {
      logger.error('Error getting inventory item:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  static async deleteInventoryItem(id: string) {
    try {
      const item = await InventoryItem.findByPk(id);

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Soft delete by setting isActive to false
      await item.update({ isActive: false });

      logger.info(`Inventory item deleted: ${item.name}`);
      return item;
    } catch (error) {
      logger.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  /**
   * Adjust stock with audit trail and transaction support
   */
  static async adjustStock(
    id: string,
    quantity: number,
    reason: string,
    performedBy: string
  ) {
    const transaction = await sequelize.transaction();

    try {
      const item = await InventoryItem.findByPk(id, { transaction });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Get current stock before adjustment
      const currentStock = await this.getCurrentStock(id);

      // Create adjustment transaction
      const inventoryTransaction = await InventoryTransaction.create({
        inventoryItemId: id,
        type: InventoryTransactionType.ADJUSTMENT,
        quantity,
        reason,
        notes: `Stock adjusted from ${currentStock} to ${currentStock + quantity}. Reason: ${reason}`,
        performedById: performedBy
      }, { transaction });

      await transaction.commit();

      // Reload with associations
      await inventoryTransaction.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      const newStock = currentStock + quantity;

      logger.info(
        `Stock adjusted for ${item.name}: ${currentStock} -> ${newStock} (${quantity > 0 ? '+' : ''}${quantity}) by ${performedBy}`
      );

      return {
        transaction: inventoryTransaction,
        previousStock: currentStock,
        newStock,
        adjustment: quantity
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error adjusting stock:', error);
      throw error;
    }
  }

  /**
   * Get stock history for an item
   */
  static async getStockHistory(
    inventoryItemId: string,
    page: number = 1,
    limit: number = 50
  ) {
    try {
      const offset = (page - 1) * limit;

      const { rows: transactions, count: total } = await InventoryTransaction.findAndCountAll({
        where: { inventoryItemId },
        include: [
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true
      });

      // Calculate running stock totals
      const history = [];
      let runningTotal = 0;

      // Get all transactions in chronological order to calculate running totals
      const allTransactions = await InventoryTransaction.findAll({
        where: { inventoryItemId },
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'quantity']
      });

      // Build running total map
      const runningTotals = new Map<string, number>();
      for (const txn of allTransactions) {
        runningTotal += txn.quantity;
        runningTotals.set(txn.id, runningTotal);
      }

      // Add running totals to paginated results
      for (const txn of transactions) {
        history.push({
          ...txn.get({ plain: true }),
          stockAfterTransaction: runningTotals.get(txn.id) || 0
        });
      }

      return {
        history,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting stock history:', error);
      throw error;
    }
  }

  /**
   * Get inventory statistics
   */
  static async getInventoryStats() {
    try {
      const [
        totalItems,
        activeItems,
        totalValue,
        lowStockItems,
        outOfStockItems,
        categoryStats
      ] = await Promise.all([
        // Total items count
        InventoryItem.count(),

        // Active items count
        InventoryItem.count({
          where: { isActive: true }
        }),

        // Total inventory value
        sequelize.query<{ totalValue: number }>(`
          SELECT
            COALESCE(SUM(stock.totalQuantity * i."unitCost"), 0)::numeric as "totalValue"
          FROM inventory_items i
          LEFT JOIN (
            SELECT
              "inventoryItemId",
              SUM(quantity) as totalQuantity
            FROM inventory_transactions
            GROUP BY "inventoryItemId"
          ) stock ON i.id = stock."inventoryItemId"
          WHERE i."isActive" = true
        `, {
          type: QueryTypes.SELECT
        }),

        // Low stock items
        sequelize.query<{ count: number }>(`
          SELECT COUNT(*)::integer as count
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
          AND COALESCE(stock.totalQuantity, 0) > 0
        `, {
          type: QueryTypes.SELECT
        }),

        // Out of stock items
        sequelize.query<{ count: number }>(`
          SELECT COUNT(*)::integer as count
          FROM inventory_items i
          LEFT JOIN (
            SELECT
              "inventoryItemId",
              SUM(quantity) as totalQuantity
            FROM inventory_transactions
            GROUP BY "inventoryItemId"
          ) stock ON i.id = stock."inventoryItemId"
          WHERE i."isActive" = true
          AND COALESCE(stock.totalQuantity, 0) = 0
        `, {
          type: QueryTypes.SELECT
        }),

        // Category statistics
        sequelize.query(`
          SELECT
            i.category,
            COUNT(i.id)::integer as "itemCount",
            COALESCE(SUM(stock.totalQuantity), 0)::integer as "totalQuantity",
            COALESCE(SUM(stock.totalQuantity * i."unitCost"), 0)::numeric as "totalValue"
          FROM inventory_items i
          LEFT JOIN (
            SELECT
              "inventoryItemId",
              SUM(quantity) as totalQuantity
            FROM inventory_transactions
            GROUP BY "inventoryItemId"
          ) stock ON i.id = stock."inventoryItemId"
          WHERE i."isActive" = true
          GROUP BY i.category
          ORDER BY "totalValue" DESC
        `, {
          type: QueryTypes.SELECT
        })
      ]);

      const alerts = await this.getInventoryAlerts();

      return {
        overview: {
          totalItems,
          activeItems,
          inactiveItems: totalItems - activeItems,
          totalValue: Number(totalValue[0]?.totalValue || 0),
          lowStockItems: Number(lowStockItems[0]?.count || 0),
          outOfStockItems: Number(outOfStockItems[0]?.count || 0),
          criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL').length,
          highAlerts: alerts.filter(a => a.severity === 'HIGH').length,
          mediumAlerts: alerts.filter(a => a.severity === 'MEDIUM').length
        },
        categoryBreakdown: categoryStats,
        recentActivity: await this.getRecentActivity(),
        topUsedItems: await this.getTopUsedItems()
      };
    } catch (error) {
      logger.error('Error getting inventory stats:', error);
      throw error;
    }
  }

  /**
   * Get recent activity (last 10 transactions)
   */
  private static async getRecentActivity() {
    try {
      const recentTransactions = await InventoryTransaction.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category']
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      return recentTransactions;
    } catch (error) {
      logger.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Get top 10 most used items (by usage count)
   */
  private static async getTopUsedItems() {
    try {
      const topItems = await sequelize.query(`
        SELECT
          i.id,
          i.name,
          i.category,
          COUNT(t.id)::integer as "usageCount",
          SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END)::integer as "totalUsed"
        FROM inventory_items i
        INNER JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE i."isActive" = true
        AND t.type = 'USAGE'
        AND t."createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY i.id, i.name, i.category
        ORDER BY "totalUsed" DESC
        LIMIT 10
      `, {
        type: QueryTypes.SELECT
      });

      return topItems;
    } catch (error) {
      logger.error('Error getting top used items:', error);
      return [];
    }
  }

  /**
   * Create vendor
   */
  static async createVendor(data: CreateVendorData) {
    try {
      const vendor = await Vendor.create(data);

      logger.info(`Vendor created: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error creating vendor:', error);
      throw error;
    }
  }

  /**
   * Get all vendors
   */
  static async getVendors(isActive?: boolean) {
    try {
      const whereClause: any = {};

      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }

      const vendors = await Vendor.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
      });

      return vendors;
    } catch (error) {
      logger.error('Error getting vendors:', error);
      throw error;
    }
  }

  /**
   * Update vendor
   */
  static async updateVendor(id: string, data: Partial<CreateVendorData>) {
    try {
      const vendor = await Vendor.findByPk(id);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      await vendor.update(data);

      logger.info(`Vendor updated: ${vendor.name}`);
      return vendor;
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  /**
   * Get purchase orders
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
   * Update purchase order status with workflow validation
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
          receivedDate: status === PurchaseOrderStatus.RECEIVED ? (receivedDate || new Date()) : null
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
}