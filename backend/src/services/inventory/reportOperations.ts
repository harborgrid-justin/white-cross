/**
 * Inventory Reporting Operations Module
 *
 * Handles reporting and analytics including:
 * - Inventory valuation reports
 * - Usage analytics
 * - Inventory statistics dashboard
 * - Recent activity tracking
 * - Top used items analytics
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  InventoryItem,
  InventoryTransaction,
  User,
  sequelize
} from '../../database/models';

export class ReportOperations {
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

      return {
        overview: {
          totalItems,
          activeItems,
          inactiveItems: totalItems - activeItems,
          totalValue: Number(totalValue[0]?.totalValue || 0),
          lowStockItems: Number(lowStockItems[0]?.count || 0),
          outOfStockItems: Number(outOfStockItems[0]?.count || 0)
        },
        categoryBreakdown: categoryStats
      };
    } catch (error) {
      logger.error('Error getting inventory stats:', error);
      throw error;
    }
  }

  /**
   * Get recent activity (last 10 transactions)
   */
  static async getRecentActivity() {
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
  static async getTopUsedItems() {
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
}
