/**
 * @fileoverview Inventory Analytics Service
 * @module services/inventory/analytics
 * @description Comprehensive analytics and reporting for inventory management and financial tracking
 *
 * This service provides advanced analytics, reporting, and business intelligence for
 * inventory operations including valuation, usage patterns, supplier performance,
 * turnover rates, cost analysis, and seasonal trends.
 *
 * Key Features:
 * - Inventory valuation by category
 * - Usage analytics and consumption patterns
 * - Supplier performance metrics
 * - Inventory turnover rate calculations
 * - ABC analysis (Pareto principle for inventory)
 * - Expiration analysis and waste tracking
 * - Cost analysis by category
 * - Monthly transaction trends
 * - Seasonal usage patterns
 * - Comprehensive reporting dashboards
 *
 * @business Inventory valuation = currentStock * unitCost per item
 * @business Turnover rate = totalUsed / averageStock
 * @business ABC Analysis: A items = 80% of value, B = 15%, C = 5%
 * @business Usage trends identify high-consumption items
 * @business Supplier performance tracks reliability and value
 *
 * @financial Total inventory value for balance sheet reporting
 * @financial Cost analysis for budget planning
 * @financial Supplier spending for vendor negotiations
 *
 * @requires ../../database/models
 *
 * LOC: 260E28F914
 * WC-GEN-273 | analyticsService.ts - Inventory Analytics Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - inventoryService.ts (services/inventoryService.ts)
 *   - reporting routes (for dashboards)
 */

/**
 * WC-GEN-273 | analyticsService.ts - Inventory Analytics and Reporting Service
 * Purpose: Business intelligence and analytics for inventory management
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: Sequelize aggregations, complex queries
 * Downstream: Dashboard routes, reporting endpoints | Called by: Inventory service, administrative reporting
 * Related: StockService, FinancialReporting, BudgetService
 * Exports: AnalyticsService class | Key Services: Valuation, usage analytics, ABC analysis, trends
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Data aggregation → Analysis → Visualization → Decision support
 * LLM Context: School health inventory with financial reporting and operational insights
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { sequelize } from '../../database/models';

/**
 * Inventory Analytics Service
 *
 * @class AnalyticsService
 * @static
 */
export class AnalyticsService {
  /**
   * Get inventory valuation by category
   *
   * @method getInventoryValuation
   * @static
   * @async
   * @returns {Promise<Array<Object>>} Valuation breakdown by category
   * @returns {Promise<Array<Object>.category>} Inventory category
   * @returns {Promise<Array<Object>.itemCount>} Number of items in category
   * @returns {Promise<Array<Object>.totalValue>} Total value (stock * unit cost)
   * @returns {Promise<Array<Object>.totalQuantity>} Total units in stock
   *
   * @business Valuation = SUM(currentStock * unitCost) per category
   * @business Only active items included in valuation
   * @business Sorted by total value descending (highest value first)
   * @business Used for financial reporting and insurance purposes
   *
   * @financial Total inventory asset value for balance sheet
   * @financial Category breakdown for budget allocation planning
   *
   * @example
   * const valuation = await AnalyticsService.getInventoryValuation();
   * // Returns: [
   * //   { category: 'MEDICATION', itemCount: 45, totalValue: 12500.00, totalQuantity: 2500 },
   * //   { category: 'EQUIPMENT', itemCount: 23, totalValue: 8900.50, totalQuantity: 125 },
   * //   { category: 'SUPPLIES', itemCount: 67, totalValue: 3200.25, totalQuantity: 5400 }
   * // ]
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
   *
   * @param {number} days - Number of days to analyze (default: 30)
   * @returns {Promise<Array>} Top 10 most used items with usage statistics
   * @throws {Error} If days parameter is invalid
   *
   * @security SQL injection vulnerability fixed - uses parameterized query
   * @security Input validation ensures days is a valid number between 1 and 365
   */
  static async getTopUsedItems(days: number = 30) {
    try {
      // Input validation to prevent SQL injection
      if (typeof days !== 'number' || days < 1 || days > 365 || !Number.isInteger(days)) {
        throw new Error('Invalid days parameter: must be an integer between 1 and 365');
      }

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
        AND t."createdAt" >= NOW() - INTERVAL '1 day' * :days
        GROUP BY i.id, i.name, i.category
        ORDER BY "totalUsed" DESC
        LIMIT 10
      `, {
        replacements: { days },
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
   *
   * @param {number} months - Number of months to analyze (default: 12)
   * @returns {Promise<Array>} Monthly transaction trends by type
   * @throws {Error} If months parameter is invalid
   *
   * @security SQL injection vulnerability fixed - uses parameterized query
   * @security Input validation ensures months is a valid number between 1 and 24
   */
  static async getMonthlyTransactionTrends(months: number = 12) {
    try {
      // Input validation to prevent SQL injection
      if (typeof months !== 'number' || months < 1 || months > 24 || !Number.isInteger(months)) {
        throw new Error('Invalid months parameter: must be an integer between 1 and 24');
      }

      const trends = await sequelize.query(`
        SELECT
          DATE_TRUNC('month', t."createdAt") as month,
          t.type,
          COUNT(t.id)::integer as "transactionCount",
          SUM(ABS(t.quantity))::integer as "totalQuantity"
        FROM inventory_transactions t
        WHERE t."createdAt" >= NOW() - INTERVAL '1 month' * :months
        GROUP BY DATE_TRUNC('month', t."createdAt"), t.type
        ORDER BY month DESC, t.type
      `, {
        replacements: { months },
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
