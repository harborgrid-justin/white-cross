import { Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import {
  InventoryAlertDto,
  AlertType,
  AlertSeverity,
  AlertSummaryDto,
} from '../dto/inventory-alert.dto';

interface StockQueryResult {
  id: string;
  name: string;
  category: string;
  reorder_level: number;
  current_stock: number;
  earliest_expiration: Date | null;
  next_maintenance_date: Date | null;
}

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Get all inventory alerts with priority sorting
   *
   * Business rules:
   * - Out of stock items = CRITICAL severity
   * - Expired items = CRITICAL severity
   * - Items expiring in <= 7 days = HIGH severity
   * - Items expiring in 8-30 days = MEDIUM severity
   * - Low stock (above 0) = HIGH severity
   * - Maintenance overdue = HIGH severity
   * - Maintenance due in <= 7 days = MEDIUM severity
   */
  async getInventoryAlerts(): Promise<InventoryAlertDto[]> {
    try {
      const alerts: InventoryAlertDto[] = [];
      const now = new Date();
      const thirtyDaysFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );

      // Get items with current stock and expiration info
      const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as current_stock,
          stock.earliest_expiration,
          maint.next_maintenance_date
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity)::integer as total_quantity,
            MIN(expiration_date) as earliest_expiration
          FROM inventory_transactions
          WHERE expiration_date IS NOT NULL
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        LEFT JOIN (
          SELECT
            inventory_item_id,
            MIN(next_maintenance_date) as next_maintenance_date
          FROM maintenance_logs
          WHERE next_maintenance_date IS NOT NULL
          AND next_maintenance_date > NOW()
          GROUP BY inventory_item_id
        ) maint ON i.id = maint.inventory_item_id
        WHERE i.is_active = true
      `;

      const [results] = await this.sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      const items: StockQueryResult[] = results as StockQueryResult[];

      for (const item of items) {
        // Low stock alerts
        if (item.current_stock <= item.reorder_level) {
          alerts.push({
            id: `low_stock_${item.id}`,
            type:
              item.current_stock === 0
                ? AlertType.OUT_OF_STOCK
                : AlertType.LOW_STOCK,
            severity:
              item.current_stock === 0
                ? AlertSeverity.CRITICAL
                : AlertSeverity.HIGH,
            message:
              item.current_stock === 0
                ? `${item.name} is out of stock`
                : `${item.name} is low in stock (${item.current_stock} remaining, reorder at ${item.reorder_level})`,
            itemId: item.id,
            itemName: item.name,
          });
        }

        // Expiration alerts
        if (item.earliest_expiration) {
          const expirationDate = new Date(item.earliest_expiration);
          const daysUntilExpiration = Math.ceil(
            (expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
          );

          if (expirationDate <= now) {
            alerts.push({
              id: `expired_${item.id}`,
              type: AlertType.EXPIRED,
              severity: AlertSeverity.CRITICAL,
              message: `${item.name} has expired items`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilExpiration,
            });
          } else if (expirationDate <= thirtyDaysFromNow) {
            alerts.push({
              id: `near_expiry_${item.id}`,
              type: AlertType.NEAR_EXPIRY,
              severity:
                daysUntilExpiration <= 7
                  ? AlertSeverity.HIGH
                  : AlertSeverity.MEDIUM,
              message: `${item.name} expires in ${daysUntilExpiration} days`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilExpiration,
            });
          }
        }

        // Maintenance alerts
        if (item.next_maintenance_date) {
          const maintenanceDate = new Date(item.next_maintenance_date);
          const daysUntilMaintenance = Math.ceil(
            (maintenanceDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
          );

          if (maintenanceDate <= now) {
            alerts.push({
              id: `maintenance_overdue_${item.id}`,
              type: AlertType.MAINTENANCE_DUE,
              severity: AlertSeverity.HIGH,
              message: `${item.name} maintenance is overdue`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilMaintenance,
            });
          } else if (daysUntilMaintenance <= 7) {
            alerts.push({
              id: `maintenance_due_${item.id}`,
              type: AlertType.MAINTENANCE_DUE,
              severity: AlertSeverity.MEDIUM,
              message: `${item.name} maintenance due in ${daysUntilMaintenance} days`,
              itemId: item.id,
              itemName: item.name,
              daysUntilAction: daysUntilMaintenance,
            });
          }
        }
      }

      // Sort by severity (CRITICAL first, then HIGH, MEDIUM, LOW)
      const severityOrder = {
        [AlertSeverity.CRITICAL]: 0,
        [AlertSeverity.HIGH]: 1,
        [AlertSeverity.MEDIUM]: 2,
        [AlertSeverity.LOW]: 3,
      };
      alerts.sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
      );

      return alerts;
    } catch (error) {
      this.logger.error('Error getting inventory alerts:', error);
      throw error;
    }
  }

  /**
   * Get critical alerts only
   */
  async getCriticalAlerts(): Promise<InventoryAlertDto[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter(
        (alert) => alert.severity === AlertSeverity.CRITICAL,
      );
    } catch (error) {
      this.logger.error('Error getting critical alerts:', error);
      throw error;
    }
  }

  /**
   * Get alerts by type
   */
  async getAlertsByType(type: AlertType): Promise<InventoryAlertDto[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter((alert) => alert.type === type);
    } catch (error) {
      this.logger.error('Error getting alerts by type:', error);
      throw error;
    }
  }

  /**
   * Get alerts by severity
   */
  async getAlertsBySeverity(
    severity: AlertSeverity,
  ): Promise<InventoryAlertDto[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter((alert) => alert.severity === severity);
    } catch (error) {
      this.logger.error('Error getting alerts by severity:', error);
      throw error;
    }
  }

  /**
   * Get alert counts by type and severity
   */
  async getAlertCounts() {
    try {
      const alerts = await this.getInventoryAlerts();

      const counts = {
        total: alerts.length,
        byType: {
          LOW_STOCK: alerts.filter((a) => a.type === AlertType.LOW_STOCK)
            .length,
          OUT_OF_STOCK: alerts.filter((a) => a.type === AlertType.OUT_OF_STOCK)
            .length,
          EXPIRED: alerts.filter((a) => a.type === AlertType.EXPIRED).length,
          NEAR_EXPIRY: alerts.filter((a) => a.type === AlertType.NEAR_EXPIRY)
            .length,
          MAINTENANCE_DUE: alerts.filter(
            (a) => a.type === AlertType.MAINTENANCE_DUE,
          ).length,
        },
        bySeverity: {
          CRITICAL: alerts.filter((a) => a.severity === AlertSeverity.CRITICAL)
            .length,
          HIGH: alerts.filter((a) => a.severity === AlertSeverity.HIGH).length,
          MEDIUM: alerts.filter((a) => a.severity === AlertSeverity.MEDIUM)
            .length,
          LOW: alerts.filter((a) => a.severity === AlertSeverity.LOW).length,
        },
      };

      return counts;
    } catch (error) {
      this.logger.error('Error getting alert counts:', error);
      throw error;
    }
  }

  /**
   * Check if specific item has alerts
   */
  async getItemAlerts(inventoryItemId: string): Promise<InventoryAlertDto[]> {
    try {
      const allAlerts = await this.getInventoryAlerts();
      return allAlerts.filter((alert) => alert.itemId === inventoryItemId);
    } catch (error) {
      this.logger.error('Error getting item alerts:', error);
      throw error;
    }
  }

  /**
   * Generate summary report of all alerts
   */
  async generateAlertSummary(): Promise<AlertSummaryDto> {
    try {
      const alerts = await this.getInventoryAlerts();
      const counts = await this.getAlertCounts();

      const summary: AlertSummaryDto = {
        timestamp: new Date(),
        totalAlerts: counts.total,
        criticalCount: counts.bySeverity.CRITICAL,
        highCount: counts.bySeverity.HIGH,
        mediumCount: counts.bySeverity.MEDIUM,
        lowCount: counts.bySeverity.LOW,
        typeBreakdown: counts.byType,
        topAlerts: alerts.slice(0, 10), // Top 10 most critical
        recommendations: this.generateRecommendations(alerts),
      };

      return summary;
    } catch (error) {
      this.logger.error('Error generating alert summary:', error);
      throw error;
    }
  }

  /**
   * Generate recommendations based on alerts
   */
  private generateRecommendations(alerts: InventoryAlertDto[]): string[] {
    const recommendations: string[] = [];

    const criticalAlerts = alerts.filter(
      (a) => a.severity === AlertSeverity.CRITICAL,
    );
    const outOfStockAlerts = alerts.filter(
      (a) => a.type === AlertType.OUT_OF_STOCK,
    );
    const expiredAlerts = alerts.filter((a) => a.type === AlertType.EXPIRED);
    const lowStockAlerts = alerts.filter((a) => a.type === AlertType.LOW_STOCK);

    if (criticalAlerts.length > 0) {
      recommendations.push(
        `Address ${criticalAlerts.length} critical alert(s) immediately`,
      );
    }

    if (outOfStockAlerts.length > 0) {
      recommendations.push(
        `Reorder ${outOfStockAlerts.length} out-of-stock item(s) urgently`,
      );
    }

    if (expiredAlerts.length > 0) {
      recommendations.push(
        `Remove ${expiredAlerts.length} expired item(s) from inventory`,
      );
    }

    if (lowStockAlerts.length > 5) {
      recommendations.push(
        `Review reorder levels for ${lowStockAlerts.length} low-stock items`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('All inventory levels are within acceptable ranges');
    }

    return recommendations;
  }
}
