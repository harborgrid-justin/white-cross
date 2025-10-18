/**
 * WC-GEN-274 | inventoryQueriesService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Inventory Queries Service
 *
 * Handles complex queries and data retrieval for inventory items.
 * Provides paginated queries, filtering, and search functionality.
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { 
  InventoryItem, 
  InventoryTransaction, 
  MaintenanceLog, 
  User, 
  sequelize 
} from '../../database/models';
import { InventoryFilters, PaginatedInventoryItems, StockQueryResult } from './types';
import { StockService } from './stockService';

export class InventoryQueriesService {
  /**
   * Get inventory items with pagination and filters
   */
  static async getInventoryItems(
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilters = {}
  ): Promise<PaginatedInventoryItems> {
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
   * Get single inventory item by ID with detailed information
   */
  static async getInventoryItemDetails(id: string) {
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
      const currentStock = await StockService.getCurrentStock(id);

      return {
        ...item.get({ plain: true }),
        currentStock
      };
    } catch (error) {
      logger.error('Error getting inventory item details:', error);
      throw error;
    }
  }

  /**
   * Get inventory items by category
   */
  static async getInventoryItemsByCategory(category: string, page: number = 1, limit: number = 20) {
    try {
      const filters: InventoryFilters = { category, isActive: true };
      return await this.getInventoryItems(page, limit, filters);
    } catch (error) {
      logger.error('Error getting inventory items by category:', error);
      throw error;
    }
  }

  /**
   * Get inventory items by supplier
   */
  static async getInventoryItemsBySupplier(supplier: string, page: number = 1, limit: number = 20) {
    try {
      const filters: InventoryFilters = { supplier, isActive: true };
      return await this.getInventoryItems(page, limit, filters);
    } catch (error) {
      logger.error('Error getting inventory items by supplier:', error);
      throw error;
    }
  }

  /**
   * Get inventory items by location
   */
  static async getInventoryItemsByLocation(location: string, page: number = 1, limit: number = 20) {
    try {
      const filters: InventoryFilters = { location, isActive: true };
      return await this.getInventoryItems(page, limit, filters);
    } catch (error) {
      logger.error('Error getting inventory items by location:', error);
      throw error;
    }
  }

  /**
   * Get low stock items
   */
  static async getLowStockItems(page: number = 1, limit: number = 20) {
    try {
      const filters: InventoryFilters = { lowStock: true, isActive: true };
      return await this.getInventoryItems(page, limit, filters);
    } catch (error) {
      logger.error('Error getting low stock items:', error);
      throw error;
    }
  }

  /**
   * Get items that need maintenance
   */
  static async getItemsNeedingMaintenance() {
    try {
      const items = await sequelize.query<StockQueryResult>(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock",
          false as "isLowStock",
          stock.earliestExpiration as "earliestExpiration",
          ml."nextMaintenanceDate"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity)::integer as totalQuantity,
            MIN("expirationDate") as earliestExpiration
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        INNER JOIN maintenance_logs ml ON i.id = ml."inventoryItemId"
        WHERE i."isActive" = true
        AND ml."nextMaintenanceDate" <= NOW() + INTERVAL '7 days'
        AND ml."nextMaintenanceDate" IS NOT NULL
        ORDER BY ml."nextMaintenanceDate" ASC
      `, {
        type: QueryTypes.SELECT
      });

      return items;
    } catch (error) {
      logger.error('Error getting items needing maintenance:', error);
      throw error;
    }
  }

  /**
   * Get items expiring soon
   */
  static async getItemsExpiringSoon(days: number = 30) {
    try {
      const items = await sequelize.query(`
        SELECT
          i.id,
          i.name,
          i.category,
          i.location,
          t."expirationDate",
          t.quantity,
          t."batchNumber",
          EXTRACT(DAY FROM (t."expirationDate" - NOW())) as "daysUntilExpiration"
        FROM inventory_items i
        INNER JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE i."isActive" = true
        AND t."expirationDate" IS NOT NULL
        AND t."expirationDate" <= NOW() + INTERVAL '${days} days'
        AND t.quantity > 0
        ORDER BY t."expirationDate" ASC
      `, {
        type: QueryTypes.SELECT
      });

      return items;
    } catch (error) {
      logger.error('Error getting items expiring soon:', error);
      throw error;
    }
  }

  /**
   * Get inventory items with stock levels
   */
  static async getInventoryItemsWithStock() {
    try {
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
        WHERE i."isActive" = true
        ORDER BY i.name
      `, {
        type: QueryTypes.SELECT
      });

      return items;
    } catch (error) {
      logger.error('Error getting inventory items with stock:', error);
      throw error;
    }
  }

  /**
   * Search inventory items with advanced filtering
   */
  static async searchInventoryItems(
    searchTerm: string,
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      // Build search conditions
      const searchConditions = [
        'i.name ILIKE :searchTerm',
        'i.description ILIKE :searchTerm',
        'i.category ILIKE :searchTerm',
        'i.sku ILIKE :searchTerm',
        'i.supplier ILIKE :searchTerm'
      ];

      const conditions: string[] = [`(${searchConditions.join(' OR ')})`];
      const replacements: any = { 
        searchTerm: `%${searchTerm}%`,
        limit,
        offset 
      };

      // Add additional filters
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
        ORDER BY 
          CASE WHEN i.name ILIKE :searchTerm THEN 1 ELSE 2 END,
          i.name
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
      logger.error('Error searching inventory items:', error);
      throw error;
    }
  }

  /**
   * Get inventory categories
   */
  static async getInventoryCategories() {
    try {
      const categories = await sequelize.query(`
        SELECT
          category,
          COUNT(*)::integer as "itemCount",
          COUNT(CASE WHEN "isActive" = true THEN 1 END)::integer as "activeItems"
        FROM inventory_items
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY "itemCount" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return categories;
    } catch (error) {
      logger.error('Error getting inventory categories:', error);
      throw error;
    }
  }

  /**
   * Get inventory suppliers
   */
  static async getInventorySuppliers() {
    try {
      const suppliers = await sequelize.query(`
        SELECT
          supplier,
          COUNT(*)::integer as "itemCount",
          COUNT(CASE WHEN "isActive" = true THEN 1 END)::integer as "activeItems"
        FROM inventory_items
        WHERE supplier IS NOT NULL
        GROUP BY supplier
        ORDER BY "itemCount" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return suppliers;
    } catch (error) {
      logger.error('Error getting inventory suppliers:', error);
      throw error;
    }
  }

  /**
   * Get inventory locations
   */
  static async getInventoryLocations() {
    try {
      const locations = await sequelize.query(`
        SELECT
          location,
          COUNT(*)::integer as "itemCount",
          COUNT(CASE WHEN "isActive" = true THEN 1 END)::integer as "activeItems"
        FROM inventory_items
        WHERE location IS NOT NULL
        GROUP BY location
        ORDER BY "itemCount" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return locations;
    } catch (error) {
      logger.error('Error getting inventory locations:', error);
      throw error;
    }
  }

  /**
   * Get items by batch number
   */
  static async getItemsByBatch(batchNumber: string) {
    try {
      const items = await sequelize.query(`
        SELECT
          i.id,
          i.name,
          i.category,
          t."batchNumber",
          t.quantity,
          t."expirationDate",
          t."createdAt" as "receivedDate"
        FROM inventory_items i
        INNER JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE t."batchNumber" = :batchNumber
        AND t.quantity > 0
        ORDER BY t."createdAt" DESC
      `, {
        replacements: { batchNumber },
        type: QueryTypes.SELECT
      });

      return items;
    } catch (error) {
      logger.error('Error getting items by batch:', error);
      throw error;
    }
  }

  /**
   * Get items by date range
   */
  static async getItemsByDateRange(startDate: Date, endDate: Date) {
    try {
      const items = await sequelize.query(`
        SELECT
          i.*,
          t."createdAt" as "transactionDate",
          t.type as "transactionType",
          t.quantity
        FROM inventory_items i
        INNER JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE t."createdAt" BETWEEN :startDate AND :endDate
        AND i."isActive" = true
        ORDER BY t."createdAt" DESC
      `, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });

      return items;
    } catch (error) {
      logger.error('Error getting items by date range:', error);
      throw error;
    }
  }

  /**
   * Get recent activity across all inventory items
   */
  static async getRecentActivity(limit: number = 50) {
    try {
      const activity = await sequelize.query(`
        SELECT
          i.id as "itemId",
          i.name as "itemName",
          i.category,
          t.type,
          t.quantity,
          t."createdAt",
          t.reason,
          t.notes,
          u."firstName",
          u."lastName",
          u.email
        FROM inventory_transactions t
        INNER JOIN inventory_items i ON t."inventoryItemId" = i.id
        LEFT JOIN users u ON t."performedById" = u.id
        WHERE i."isActive" = true
        ORDER BY t."createdAt" DESC
        LIMIT :limit
      `, {
        replacements: { limit },
        type: QueryTypes.SELECT
      });

      return activity;
    } catch (error) {
      logger.error('Error getting recent activity:', error);
      throw error;
    }
  }
}
