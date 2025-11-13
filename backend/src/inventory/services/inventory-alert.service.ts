/**
 * Inventory Alert Service
 *
 * Handles inventory alert identification and processing
 * Extracted from inventory-maintenance.processor.ts for better modularity
 */
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from "../../common/base";

export interface InventoryAlert {
  type: 'EXPIRED' | 'NEAR_EXPIRY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantity: number;
  reorderLevel?: number;
  expirationDate?: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface InventoryStatus {
  total_items: number;
  expired_items: number;
  near_expiry_items: number;
  low_stock_items: number;
  ok_items: number;
}

@Injectable()
export class InventoryAlertService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {
    super(requestContext);
  }

  /**
   * Identify critical alerts that need immediate attention
   */
  async identifyCriticalAlerts(organizationId?: string): Promise<InventoryAlert[]> {
    const alerts: InventoryAlert[] = [];

    try {
      const whereClause = organizationId ? `AND organization_id = '${organizationId}'` : '';

      const criticalItems = await this.sequelize.query<{
        id: string;
        medication_id: string;
        medication_name: string;
        batch_number: string;
        quantity: number;
        reorder_level: number;
        expiration_date: Date;
        expiry_status: string;
        stock_status: string;
        days_until_expiry: number;
      }>(
        `
        SELECT *
        FROM medication_inventory_alerts
        WHERE (expiry_status = 'EXPIRED'
           OR (expiry_status = 'NEAR_EXPIRY' AND days_until_expiry <= 7)
           OR stock_status = 'LOW_STOCK'
           OR quantity = 0)
           ${whereClause}
        ORDER BY
          CASE expiry_status WHEN 'EXPIRED' THEN 1 WHEN 'NEAR_EXPIRY' THEN 2 ELSE 3 END,
          CASE stock_status WHEN 'LOW_STOCK' THEN 1 WHEN 'WARNING' THEN 2 ELSE 3 END
      `,
        {
          type: QueryTypes.SELECT,
        },
      );

      // Parse and categorize alerts
      for (const item of criticalItems) {
        // Expired items
        if (item.expiry_status === 'EXPIRED') {
          alerts.push({
            type: 'EXPIRED',
            medicationId: item.medication_id,
            medicationName: item.medication_name,
            batchNumber: item.batch_number,
            quantity: item.quantity,
            expirationDate: item.expiration_date,
            severity: 'CRITICAL',
          });
        }

        // Near expiry (within 7 days)
        if (item.expiry_status === 'NEAR_EXPIRY' && item.days_until_expiry <= 7) {
          alerts.push({
            type: 'NEAR_EXPIRY',
            medicationId: item.medication_id,
            medicationName: item.medication_name,
            batchNumber: item.batch_number,
            quantity: item.quantity,
            expirationDate: item.expiration_date,
            severity: 'HIGH',
          });
        }

        // Out of stock
        if (item.quantity === 0) {
          alerts.push({
            type: 'OUT_OF_STOCK',
            medicationId: item.medication_id,
            medicationName: item.medication_name,
            batchNumber: item.batch_number,
            quantity: 0,
            reorderLevel: item.reorder_level,
            severity: 'CRITICAL',
          });
        }
        // Low stock
        else if (item.stock_status === 'LOW_STOCK') {
          alerts.push({
            type: 'LOW_STOCK',
            medicationId: item.medication_id,
            medicationName: item.medication_name,
            batchNumber: item.batch_number,
            quantity: item.quantity,
            reorderLevel: item.reorder_level,
            severity: item.quantity <= item.reorder_level * 0.5 ? 'HIGH' : 'MEDIUM',
          });
        }
      }

      this.logger.debug(`Identified ${alerts.length} critical inventory alerts`);
    } catch (error) {
      this.logger.error('Failed to identify critical alerts', error);
    }

    return alerts;
  }

  /**
   * Get current inventory status
   */
  async getInventoryStatus(): Promise<InventoryStatus> {
    const status = await this.sequelize.query<InventoryStatus>(
      `
      SELECT
        COUNT(*) as total_items,
        SUM(CASE WHEN expiry_status = 'EXPIRED' THEN 1 ELSE 0 END) as expired_items,
        SUM(CASE WHEN expiry_status = 'NEAR_EXPIRY' THEN 1 ELSE 0 END) as near_expiry_items,
        SUM(CASE WHEN stock_status = 'LOW_STOCK' THEN 1 ELSE 0 END) as low_stock_items,
        SUM(CASE WHEN expiry_status = 'OK' AND stock_status = 'OK' THEN 1 ELSE 0 END) as ok_items
      FROM medication_inventory_alerts
    `,
      {
        type: QueryTypes.SELECT,
      },
    );

    return status[0];
  }

  /**
   * Get expiring items for reports
   */
  async getExpiringItems(organizationId?: string): Promise<
    Array<{
      medicationName: string;
      batchNumber: string;
      quantity: number;
      expirationDate: Date;
      daysUntilExpiry: number;
    }>
  > {
    const expiringItems = await this.sequelize.query<{
      medication_name: string;
      batch_number: string;
      quantity: number;
      expiration_date: Date;
      days_until_expiry: number;
    }>(
      `
      SELECT
        medication_name,
        batch_number,
        quantity,
        expiration_date,
        days_until_expiry
      FROM medication_inventory_alerts
      WHERE expiry_status IN ('NEAR_EXPIRY', 'EXPIRED')
        ${organizationId ? 'AND organization_id = :organizationId' : ''}
      ORDER BY days_until_expiry ASC
    `,
      {
        replacements: organizationId ? { organizationId } : {},
        type: QueryTypes.SELECT,
      },
    );

    return expiringItems.map((item) => ({
      medicationName: item.medication_name,
      batchNumber: item.batch_number,
      quantity: item.quantity,
      expirationDate: item.expiration_date,
      daysUntilExpiry: item.days_until_expiry,
    }));
  }

  /**
   * Refresh the materialized view for inventory alerts
   */
  async refreshMaterializedView(): Promise<void> {
    try {
      await this.sequelize.query(
        'REFRESH MATERIALIZED VIEW CONCURRENTLY medication_inventory_alerts',
        {
          type: QueryTypes.RAW,
        },
      );
      this.logger.debug('Inventory alerts materialized view refreshed');
    } catch (error) {
      this.logger.error('Failed to refresh materialized view', error);
      throw error;
    }
  }
}
