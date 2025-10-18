/**
 * WC-GEN-273 | analyticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Analytics Service
 *
 * Provides comprehensive analytics, reporting, and statistics for inventory.
 * Handles valuation, usage analytics, supplier performance, and trends.
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { sequelize } from '../../database/models';

export class AnalyticsService {
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
   * Get usage analytics for a date range
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
   * Get supplier performance analytics
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
   * Get inventory statistics overview
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
        sequelize.query<{ count: number }>(`
          SELECT COUNT(*)::integer as count FROM inventory_items
        `, { type: QueryTypes.SELECT }),

        // Active items count
        sequelize.query<{ count: number }>(`
          SELECT COUNT(*)::integer as count FROM inventory_items WHERE "isActive" = true
        `, { type: QueryTypes.SELECT }),

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
        `, { type: QueryTypes.SELECT }),

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
        `, { type: QueryTypes.SELECT }),

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
        `, { type: QueryTypes.SELECT }),

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
        `, { type: QueryTypes.SELECT })
      ]);

      return {
        overview: {
          totalItems: totalItems[0]?.count || 0,
          activeItems: activeItems[0]?.count || 0,
          inactiveItems: (totalItems[0]?.count || 0) - (activeItems[0]?.count || 0),
          totalValue: Number(totalValue[0]?.totalValue || 0),
          lowStockItems: lowStockItems[0]?.count || 0,
          outOfStockItems: outOfStockItems[0]?.count || 0
        },
        categoryBreakdown: categoryStats
      };
    } catch (error) {
      logger.error('Error getting inventory stats:', error);
      throw error;
    }
  }

  /**
   * Get top 10 most used items by usage count
   */
  static async getTopUsedItems(days: number = 30) {
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
        AND t."createdAt" >= NOW() - INTERVAL '${days} days'
        GROUP BY i.id, i.name, i.category
        ORDER BY "totalUsed" DESC
        LIMIT 10
      `, {
        type: QueryTypes.SELECT
      });

      return topItems;
    } catch (error) {
      logger.error('Error getting top used items:', error);
      throw error;
    }
  }

  /**
   * Get inventory turnover rate
   */
  static async getInventoryTurnover(startDate: Date, endDate: Date) {
    try {
      const turnover = await sequelize.query(`
        SELECT
          i.id,
          i.name,
          i.category,
          COALESCE(AVG(stock.totalQuantity), 0)::numeric as "averageStock",
          COALESCE(SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END), 0)::integer as "totalUsed",
          CASE 
            WHEN AVG(stock.totalQuantity) > 0 
            THEN (SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END) / AVG(stock.totalQuantity))::numeric
            ELSE 0
          END as "turnoverRate"
        FROM inventory_items i
        LEFT JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        AND t."createdAt" BETWEEN :startDate AND :endDate
        GROUP BY i.id, i.name, i.category
        HAVING SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END) > 0
        ORDER BY "turnoverRate" DESC
      `, {
        replacements: { startDate, endDate },
        type: QueryTypes.SELECT
      });

      return turnover;
    } catch (error) {
      logger.error('Error getting inventory turnover:', error);
      throw error;
    }
  }

  /**
   * Get cost analysis by category
   */
  static async getCostAnalysisByCategory() {
    try {
      const costAnalysis = await sequelize.query(`
        SELECT
          i.category,
          COUNT(i.id)::integer as "itemCount",
          MIN(i."unitCost")::numeric as "minCost",
          MAX(i."unitCost")::numeric as "maxCost",
          AVG(i."unitCost")::numeric as "averageCost",
          SUM(stock.totalQuantity * i."unitCost")::numeric as "totalValue"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        AND i."unitCost" IS NOT NULL
        GROUP BY i.category
        ORDER BY "totalValue" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return costAnalysis;
    } catch (error) {
      logger.error('Error getting cost analysis by category:', error);
      throw error;
    }
  }

  /**
   * Get monthly transaction trends
   */
  static async getMonthlyTransactionTrends(months: number = 12) {
    try {
      const trends = await sequelize.query(`
        SELECT
          DATE_TRUNC('month', t."createdAt") as month,
          t.type,
          COUNT(t.id)::integer as "transactionCount",
          SUM(ABS(t.quantity))::integer as "totalQuantity"
        FROM inventory_transactions t
        WHERE t."createdAt" >= NOW() - INTERVAL '${months} months'
        GROUP BY DATE_TRUNC('month', t."createdAt"), t.type
        ORDER BY month DESC, t.type
      `, {
        type: QueryTypes.SELECT
      });

      return trends;
    } catch (error) {
      logger.error('Error getting monthly transaction trends:', error);
      throw error;
    }
  }

  /**
   * Get seasonal usage patterns
   */
  static async getSeasonalUsagePatterns() {
    try {
      const patterns = await sequelize.query(`
        SELECT
          EXTRACT(QUARTER FROM t."createdAt") as quarter,
          i.category,
          SUM(CASE WHEN t.type = 'USAGE' THEN ABS(t.quantity) ELSE 0 END)::integer as "totalUsage",
          COUNT(DISTINCT i.id)::integer as "uniqueItems"
        FROM inventory_transactions t
        INNER JOIN inventory_items i ON t."inventoryItemId" = i.id
        WHERE t.type = 'USAGE'
        AND t."createdAt" >= NOW() - INTERVAL '2 years'
        GROUP BY EXTRACT(QUARTER FROM t."createdAt"), i.category
        ORDER BY quarter, "totalUsage" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return patterns;
    } catch (error) {
      logger.error('Error getting seasonal usage patterns:', error);
      throw error;
    }
  }

  /**
   * Get ABC analysis (Pareto analysis) of inventory
   */
  static async getABCAnalysis() {
    try {
      const analysis = await sequelize.query(`
        WITH item_values AS (
          SELECT
            i.id,
            i.name,
            i.category,
            (COALESCE(stock.totalQuantity, 0) * COALESCE(i."unitCost", 0)) as "itemValue"
          FROM inventory_items i
          LEFT JOIN (
            SELECT
              "inventoryItemId",
              SUM(quantity) as totalQuantity
            FROM inventory_transactions
            GROUP BY "inventoryItemId"
          ) stock ON i.id = stock."inventoryItemId"
          WHERE i."isActive" = true
        ),
        total_value AS (
          SELECT SUM("itemValue") as "totalValue"
          FROM item_values
        ),
        cumulative_analysis AS (
          SELECT
            *,
            ("itemValue" / (SELECT "totalValue" FROM total_value)) * 100 as "valuePercentage",
            SUM("itemValue") OVER (ORDER BY "itemValue" DESC) / (SELECT "totalValue" FROM total_value) * 100 as "cumulativePercentage"
          FROM item_values
          ORDER BY "itemValue" DESC
        )
        SELECT
          *,
          CASE
            WHEN "cumulativePercentage" <= 80 THEN 'A'
            WHEN "cumulativePercentage" <= 95 THEN 'B'
            ELSE 'C'
          END as "abcCategory"
        FROM cumulative_analysis
        ORDER BY "itemValue" DESC
      `, {
        type: QueryTypes.SELECT
      });

      return analysis;
    } catch (error) {
      logger.error('Error getting ABC analysis:', error);
      throw error;
    }
  }

  /**
   * Get expiration analysis
   */
  static async getExpirationAnalysis() {
    try {
      const analysis = await sequelize.query(`
        SELECT
          i.name,
          i.category,
          t."expirationDate",
          t.quantity,
          CASE
            WHEN t."expirationDate" < NOW() THEN 'Expired'
            WHEN t."expirationDate" < NOW() + INTERVAL '30 days' THEN 'Expiring Soon'
            WHEN t."expirationDate" < NOW() + INTERVAL '90 days' THEN 'Expiring Later'
            ELSE 'Good'
          END as "expirationStatus",
          (t."expirationDate" - NOW()::date) as "daysUntilExpiration"
        FROM inventory_transactions t
        INNER JOIN inventory_items i ON t."inventoryItemId" = i.id
        WHERE t."expirationDate" IS NOT NULL
        AND t.quantity > 0
        AND i."isActive" = true
        ORDER BY t."expirationDate" ASC
      `, {
        type: QueryTypes.SELECT
      });

      return analysis;
    } catch (error) {
      logger.error('Error getting expiration analysis:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive analytics report
   */
  static async generateComprehensiveReport(startDate: Date, endDate: Date) {
    try {
      const [
        inventoryStats,
        usageAnalytics,
        supplierPerformance,
        topUsedItems,
        inventoryTurnover,
        monthlyTrends,
        abcAnalysis,
        expirationAnalysis
      ] = await Promise.all([
        this.getInventoryStats(),
        this.getUsageAnalytics(startDate, endDate),
        this.getSupplierPerformance(),
        this.getTopUsedItems(30),
        this.getInventoryTurnover(startDate, endDate),
        this.getMonthlyTransactionTrends(6),
        this.getABCAnalysis(),
        this.getExpirationAnalysis()
      ]);

      const report = {
        generatedAt: new Date(),
        period: {
          startDate,
          endDate
        },
        inventoryOverview: inventoryStats,
        usageAnalytics: usageAnalytics.slice(0, 20), // Top 20
        supplierPerformance: supplierPerformance.slice(0, 10), // Top 10
        topUsedItems,
        inventoryTurnover: inventoryTurnover.slice(0, 15), // Top 15
        monthlyTrends,
        abcAnalysis: {
          aItems: abcAnalysis.filter((item: any) => item.abcCategory === 'A').length,
          bItems: abcAnalysis.filter((item: any) => item.abcCategory === 'B').length,
          cItems: abcAnalysis.filter((item: any) => item.abcCategory === 'C').length,
          details: abcAnalysis.slice(0, 20) // Top 20 by value
        },
        expirationAnalysis: {
          expired: expirationAnalysis.filter((item: any) => item.expirationStatus === 'Expired').length,
          expiringSoon: expirationAnalysis.filter((item: any) => item.expirationStatus === 'Expiring Soon').length,
          expiringLater: expirationAnalysis.filter((item: any) => item.expirationStatus === 'Expiring Later').length,
          details: expirationAnalysis.slice(0, 20) // Next 20 to expire
        }
      };

      logger.info(`Comprehensive analytics report generated for period ${startDate} to ${endDate}`);
      return report;
    } catch (error) {
      logger.error('Error generating comprehensive report:', error);
      throw error;
    }
  }
}
