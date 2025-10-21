/**
 * LOC: 414A4DDD72
 * WC-GEN-272 | alertsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/inventory/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - inventoryService.ts (services/inventoryService.ts)
 */

/**
 * WC-GEN-272 | alertsService.ts - General utility functions and operations
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
 * Inventory Alerts Service
 *
 * Handles inventory monitoring and alert generation.
 * Provides functionality for low stock, expiration, and maintenance alerts.
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { sequelize } from '../../database/models';
import { InventoryAlert, StockQueryResult } from './types';

export class AlertsService {
  /**
   * Get all inventory alerts
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
   * Get critical alerts only
   */
  static async getCriticalAlerts(): Promise<InventoryAlert[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter(alert => alert.severity === 'CRITICAL');
    } catch (error) {
      logger.error('Error getting critical alerts:', error);
      throw error;
    }
  }

  /**
   * Get alerts by type
   */
  static async getAlertsByType(type: InventoryAlert['type']): Promise<InventoryAlert[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter(alert => alert.type === type);
    } catch (error) {
      logger.error('Error getting alerts by type:', error);
      throw error;
    }
  }

  /**
   * Get alerts by severity
   */
  static async getAlertsBySeverity(severity: InventoryAlert['severity']): Promise<InventoryAlert[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter(alert => alert.severity === severity);
    } catch (error) {
      logger.error('Error getting alerts by severity:', error);
      throw error;
    }
  }

  /**
   * Get expiring items within specified days
   */
  static async getExpiringItems(days: number = 30): Promise<InventoryAlert[]> {
    try {
      const alerts: InventoryAlert[] = [];
      const now = new Date();
      const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const expiringItems = await sequelize.query<{
        id: string;
        name: string;
        earliestExpiration: Date;
      }>(`
        SELECT
          i.id,
          i.name,
          MIN(t."expirationDate") as "earliestExpiration"
        FROM inventory_items i
        INNER JOIN inventory_transactions t ON i.id = t."inventoryItemId"
        WHERE i."isActive" = true
        AND t."expirationDate" IS NOT NULL
        AND t."expirationDate" BETWEEN NOW() AND :targetDate
        GROUP BY i.id, i.name
        ORDER BY MIN(t."expirationDate") ASC
      `, {
        replacements: { targetDate },
        type: QueryTypes.SELECT
      });

      for (const item of expiringItems) {
        const expirationDate = new Date(item.earliestExpiration);
        const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        alerts.push({
          id: `expiring_${item.id}`,
          type: 'NEAR_EXPIRY',
          severity: daysUntilExpiration <= 7 ? 'HIGH' : 'MEDIUM',
          message: `${item.name} expires in ${daysUntilExpiration} days`,
          itemId: item.id,
          itemName: item.name,
          daysUntilAction: daysUntilExpiration
        });
      }

      return alerts;
    } catch (error) {
      logger.error('Error getting expiring items:', error);
      throw error;
    }
  }

  /**
   * Get maintenance due items within specified days
   */
  static async getMaintenanceDueItems(days: number = 30): Promise<InventoryAlert[]> {
    try {
      const alerts: InventoryAlert[] = [];
      const now = new Date();
      const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const maintenanceItems = await sequelize.query<{
        id: string;
        name: string;
        nextMaintenanceDate: Date;
      }>(`
        SELECT
          i.id,
          i.name,
          MIN(ml."nextMaintenanceDate") as "nextMaintenanceDate"
        FROM inventory_items i
        INNER JOIN maintenance_logs ml ON i.id = ml."inventoryItemId"
        WHERE i."isActive" = true
        AND ml."nextMaintenanceDate" IS NOT NULL
        AND ml."nextMaintenanceDate" BETWEEN NOW() AND :targetDate
        GROUP BY i.id, i.name
        ORDER BY MIN(ml."nextMaintenanceDate") ASC
      `, {
        replacements: { targetDate },
        type: QueryTypes.SELECT
      });

      for (const item of maintenanceItems) {
        const maintenanceDate = new Date(item.nextMaintenanceDate);
        const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        alerts.push({
          id: `maintenance_${item.id}`,
          type: 'MAINTENANCE_DUE',
          severity: daysUntilMaintenance <= 7 ? 'HIGH' : 'MEDIUM',
          message: `${item.name} maintenance due in ${daysUntilMaintenance} days`,
          itemId: item.id,
          itemName: item.name,
          daysUntilAction: daysUntilMaintenance
        });
      }

      return alerts;
    } catch (error) {
      logger.error('Error getting maintenance due items:', error);
      throw error;
    }
  }

  /**
   * Get alert counts by type and severity
   */
  static async getAlertCounts() {
    try {
      const alerts = await this.getInventoryAlerts();

      const counts = {
        total: alerts.length,
        byType: {
          LOW_STOCK: alerts.filter(a => a.type === 'LOW_STOCK').length,
          OUT_OF_STOCK: alerts.filter(a => a.type === 'OUT_OF_STOCK').length,
          EXPIRED: alerts.filter(a => a.type === 'EXPIRED').length,
          NEAR_EXPIRY: alerts.filter(a => a.type === 'NEAR_EXPIRY').length,
          MAINTENANCE_DUE: alerts.filter(a => a.type === 'MAINTENANCE_DUE').length
        },
        bySeverity: {
          CRITICAL: alerts.filter(a => a.severity === 'CRITICAL').length,
          HIGH: alerts.filter(a => a.severity === 'HIGH').length,
          MEDIUM: alerts.filter(a => a.severity === 'MEDIUM').length,
          LOW: alerts.filter(a => a.severity === 'LOW').length
        }
      };

      return counts;
    } catch (error) {
      logger.error('Error getting alert counts:', error);
      throw error;
    }
  }

  /**
   * Check if specific item has alerts
   */
  static async getItemAlerts(inventoryItemId: string): Promise<InventoryAlert[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter(alert => alert.itemId === inventoryItemId);
    } catch (error) {
      logger.error('Error getting item alerts:', error);
      throw error;
    }
  }

  /**
   * Generate summary report of all alerts
   */
  static async generateAlertSummary() {
    try {
      const alerts = await this.getInventoryAlerts();
      const counts = await this.getAlertCounts();

      const summary = {
        timestamp: new Date(),
        totalAlerts: counts.total,
        criticalCount: counts.bySeverity.CRITICAL,
        highCount: counts.bySeverity.HIGH,
        mediumCount: counts.bySeverity.MEDIUM,
        lowCount: counts.bySeverity.LOW,
        typeBreakdown: counts.byType,
        topAlerts: alerts.slice(0, 10), // Top 10 most critical
        recommendations: this.generateRecommendations(alerts)
      };

      return summary;
    } catch (error) {
      logger.error('Error generating alert summary:', error);
      throw error;
    }
  }

  /**
   * Generate recommendations based on alerts
   */
  private static generateRecommendations(alerts: InventoryAlert[]): string[] {
    const recommendations: string[] = [];

    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
    const outOfStockAlerts = alerts.filter(a => a.type === 'OUT_OF_STOCK');
    const expiredAlerts = alerts.filter(a => a.type === 'EXPIRED');
    const lowStockAlerts = alerts.filter(a => a.type === 'LOW_STOCK');

    if (criticalAlerts.length > 0) {
      recommendations.push(`Address ${criticalAlerts.length} critical alert(s) immediately`);
    }

    if (outOfStockAlerts.length > 0) {
      recommendations.push(`Reorder ${outOfStockAlerts.length} out-of-stock item(s) urgently`);
    }

    if (expiredAlerts.length > 0) {
      recommendations.push(`Remove ${expiredAlerts.length} expired item(s) from inventory`);
    }

    if (lowStockAlerts.length > 5) {
      recommendations.push(`Review reorder levels for ${lowStockAlerts.length} low-stock items`);
    }

    if (recommendations.length === 0) {
      recommendations.push('All inventory levels are within acceptable ranges');
    }

    return recommendations;
  }
}
