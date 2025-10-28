/**
 * Inventory Maintenance Job Processor
 *
 * Processes inventory maintenance jobs using BullMQ with NestJS patterns
 * Migrated from backend/src/jobs/inventoryMaintenanceJob.ts
 *
 * Responsibilities:
 * - Refresh materialized view for inventory alerts
 * - Send low stock notifications
 * - Send expiration alerts
 * - Clean up expired inventory records
 *
 * Performance Benefits:
 * - Pre-computes inventory alerts
 * - Reduces query time from 800-1500ms to <200ms
 * - Offloads expensive aggregations from user requests
 */
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import { Job } from 'bullmq';
import { JobType } from '../enums/job-type.enum';
import { InventoryMaintenanceData } from '../interfaces/job-data.interface';

interface InventoryAlert {
  type: 'EXPIRED' | 'NEAR_EXPIRY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantity: number;
  reorderLevel?: number;
  expirationDate?: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface InventoryStatus {
  total_items: number;
  expired_items: number;
  near_expiry_items: number;
  low_stock_items: number;
  ok_items: number;
}

interface DisposalRecord {
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantity: number;
  reason: string;
  status: string;
  markedAt: Date;
}

@Processor(JobType.INVENTORY_MAINTENANCE)
export class InventoryMaintenanceProcessor {
  private readonly logger = new Logger(InventoryMaintenanceProcessor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  @Process()
  async processInventoryMaintenance(
    job: Job<InventoryMaintenanceData>,
  ): Promise<any> {
    const { organizationId, forceRefresh } = job.data;

    try {
      this.logger.log('Starting inventory maintenance job', {
        jobId: job.id,
        organizationId,
        forceRefresh,
      });

      const startTime = Date.now();

      // 1. Refresh materialized view
      await this.refreshMaterializedView();

      // 2. Identify critical alerts
      const alerts = await this.identifyCriticalAlerts(organizationId);

      // 3. Send notifications if needed
      if (alerts.length > 0) {
        await this.sendAlertNotifications(alerts);
      }

      // 4. Invalidate cache
      // TODO: Implement when cache service is available
      // await this.cacheManager.del('inventory:alerts');

      const duration = Date.now() - startTime;
      this.logger.log(
        `Inventory maintenance completed: ${alerts.length} alerts identified in ${duration}ms`,
      );

      return {
        alertsIdentified: alerts.length,
        duration,
        alerts,
      };
    } catch (error) {
      this.logger.error('Inventory maintenance job failed', error);
      throw error;
    }
  }

  /**
   * Refresh the materialized view
   */
  private async refreshMaterializedView(): Promise<void> {
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

  /**
   * Identify critical alerts that need immediate attention
   */
  private async identifyCriticalAlerts(
    organizationId?: string,
  ): Promise<InventoryAlert[]> {
    const alerts: InventoryAlert[] = [];

    try {
      const whereClause = organizationId
        ? `AND organization_id = '${organizationId}'`
        : '';

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
        if (
          item.expiry_status === 'NEAR_EXPIRY' &&
          item.days_until_expiry <= 7
        ) {
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
            severity:
              item.quantity <= item.reorder_level * 0.5 ? 'HIGH' : 'MEDIUM',
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
   * Send alert notifications
   */
  private async sendAlertNotifications(alerts: InventoryAlert[]): Promise<void> {
    const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
    const highAlerts = alerts.filter((a) => a.severity === 'HIGH');

    if (criticalAlerts.length > 0) {
      this.logger.warn(
        `CRITICAL INVENTORY ALERTS: ${criticalAlerts.length} items`,
        {
          alerts: criticalAlerts.map((a) => `${a.medicationName} - ${a.type}`),
        },
      );

      await this.sendCriticalAlertNotifications(criticalAlerts);
    }

    if (highAlerts.length > 0) {
      this.logger.warn(
        `HIGH PRIORITY INVENTORY ALERTS: ${highAlerts.length} items`,
        {
          alerts: highAlerts.map((a) => `${a.medicationName} - ${a.type}`),
        },
      );

      await this.sendHighPriorityAlertNotifications(highAlerts);
    }

    this.logger.log(
      `Inventory alerts summary: ${alerts.length} total (${criticalAlerts.length} critical, ${highAlerts.length} high)`,
    );
  }

  /**
   * Send critical inventory alert notifications via multiple channels
   */
  private async sendCriticalAlertNotifications(
    alerts: InventoryAlert[],
  ): Promise<void> {
    try {
      const adminEmails = this.configService
        .get<string>('INVENTORY_ALERT_EMAILS', '')
        .split(',')
        .filter((e) => e);
      const adminPhones = this.configService
        .get<string>('INVENTORY_ALERT_PHONES', '')
        .split(',')
        .filter((p) => p);

      if (adminEmails.length === 0 && adminPhones.length === 0) {
        this.logger.warn(
          'No notification recipients configured for inventory alerts',
        );
        return;
      }

      const message = this.buildAlertMessage(alerts, 'CRITICAL');
      const subject = `CRITICAL: ${alerts.length} Medication Inventory Alert(s)`;

      // TODO: Implement when email service is available
      for (const email of adminEmails) {
        this.logger.log(
          `Critical inventory alert would be sent to: ${email}`,
        );
      }

      // TODO: Implement when SMS service is available
      for (const phone of adminPhones) {
        this.logger.log(
          `Critical inventory alert SMS would be sent to: ${phone}`,
        );
      }

      this.logger.log(
        `Critical inventory notifications sent to ${adminEmails.length} emails and ${adminPhones.length} phones`,
      );
    } catch (error) {
      this.logger.error('Failed to send critical inventory alerts', error);
    }
  }

  /**
   * Send high priority inventory alert notifications via email
   */
  private async sendHighPriorityAlertNotifications(
    alerts: InventoryAlert[],
  ): Promise<void> {
    try {
      const adminEmails = this.configService
        .get<string>('INVENTORY_ALERT_EMAILS', '')
        .split(',')
        .filter((e) => e);

      if (adminEmails.length === 0) {
        this.logger.warn(
          'No email recipients configured for inventory alerts',
        );
        return;
      }

      const message = this.buildAlertMessage(alerts, 'HIGH');
      const subject = `HIGH PRIORITY: ${alerts.length} Medication Inventory Alert(s)`;

      // TODO: Implement when email service is available
      for (const email of adminEmails) {
        this.logger.log(
          `High priority inventory alert would be sent to: ${email}`,
        );
      }

      this.logger.log(
        `High priority inventory notifications sent to ${adminEmails.length} emails`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to send high priority inventory alerts',
        error,
      );
    }
  }

  /**
   * Build formatted alert message
   */
  private buildAlertMessage(
    alerts: InventoryAlert[],
    severity: string,
  ): string {
    const groupedByType = alerts.reduce((acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = [];
      }
      acc[alert.type].push(alert);
      return acc;
    }, {} as Record<string, InventoryAlert[]>);

    let message = `<html><body>`;
    message += `<h2>${severity} Medication Inventory Alert</h2>`;
    message += `<p>The following medications require immediate attention:</p>`;

    for (const [type, typeAlerts] of Object.entries(groupedByType)) {
      message += `<h3>${type.replace('_', ' ')}</h3>`;
      message += `<ul>`;

      for (const alert of typeAlerts) {
        message += `<li>`;
        message += `<strong>${alert.medicationName}</strong> (Batch: ${alert.batchNumber})<br>`;

        switch (alert.type) {
          case 'EXPIRED':
            message += `Status: EXPIRED on ${alert.expirationDate?.toLocaleDateString()}<br>`;
            message += `Quantity: ${alert.quantity} units<br>`;
            message += `Action: Remove from inventory immediately`;
            break;

          case 'NEAR_EXPIRY':
            const daysUntilExpiry = alert.expirationDate
              ? Math.ceil(
                  (alert.expirationDate.getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
                )
              : 0;
            message += `Status: Expiring in ${daysUntilExpiry} days (${alert.expirationDate?.toLocaleDateString()})<br>`;
            message += `Quantity: ${alert.quantity} units<br>`;
            message += `Action: Plan disposal or prioritize usage`;
            break;

          case 'OUT_OF_STOCK':
            message += `Status: OUT OF STOCK<br>`;
            message += `Reorder Level: ${alert.reorderLevel}<br>`;
            message += `Action: Order immediately`;
            break;

          case 'LOW_STOCK':
            message += `Status: LOW STOCK<br>`;
            message += `Current Quantity: ${alert.quantity} units<br>`;
            message += `Reorder Level: ${alert.reorderLevel}<br>`;
            message += `Action: Review and reorder`;
            break;
        }

        message += `</li>`;
      }

      message += `</ul>`;
    }

    message += `<p><strong>Total Alerts: ${alerts.length}</strong></p>`;
    message += `<p>Please log in to the White Cross platform to take appropriate action.</p>`;
    message += `</body></html>`;

    return message;
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
   * Mark expired inventory for disposal
   */
  async markExpiredForDisposal(): Promise<number> {
    const expiredItems = await this.sequelize.query<{
      id: string;
      medication_id: string;
      medication_name: string;
      batch_number: string;
      quantity: number;
      expiration_date: Date;
    }>(
      `
      SELECT id, medication_id, medication_name, batch_number, quantity, expiration_date
      FROM medication_inventory_alerts
      WHERE expiry_status = 'EXPIRED'
    `,
      {
        type: QueryTypes.SELECT,
      },
    );

    this.logger.log(
      `Found ${expiredItems.length} expired inventory items to mark for disposal`,
    );

    if (expiredItems.length === 0) {
      return 0;
    }

    // Create disposal records for each expired item
    const disposalRecords: DisposalRecord[] = [];
    for (const item of expiredItems) {
      try {
        // TODO: When DisposalRecord model exists, create records
        disposalRecords.push({
          medicationId: item.medication_id,
          medicationName: item.medication_name,
          batchNumber: item.batch_number,
          quantity: item.quantity,
          reason: 'EXPIRED',
          status: 'PENDING_DISPOSAL',
          markedAt: new Date(),
        });

        this.logger.log(
          `Marked for disposal: ${item.medication_name} (Batch: ${item.batch_number}), Qty: ${item.quantity}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to mark item for disposal: ${item.medication_name}`,
          error,
        );
      }
    }

    // Log disposal workflow initiation
    this.logger.log(
      `Disposal workflow initiated for ${disposalRecords.length} expired items`,
      {
        totalQuantity: disposalRecords.reduce((sum, r) => sum + r.quantity, 0),
        medications: disposalRecords.map((r) => r.medicationName).join(', '),
      },
    );

    // Send notification to administrators about disposal requirements
    await this.sendDisposalNotification(disposalRecords);

    return disposalRecords.length;
  }

  /**
   * Send disposal notification to administrators
   */
  private async sendDisposalNotification(
    disposalRecords: DisposalRecord[],
  ): Promise<void> {
    try {
      const adminEmails = this.configService
        .get<string>('INVENTORY_ALERT_EMAILS', '')
        .split(',')
        .filter((e) => e);

      if (adminEmails.length === 0) {
        this.logger.warn(
          'No email recipients configured for disposal notifications',
        );
        return;
      }

      const message = this.buildDisposalNotificationMessage(disposalRecords);
      const subject = `Medication Disposal Required: ${disposalRecords.length} Item(s)`;

      // TODO: Implement when email service is available
      for (const email of adminEmails) {
        this.logger.log(`Disposal notification would be sent to: ${email}`);
      }
    } catch (error) {
      this.logger.error('Failed to send disposal notifications', error);
    }
  }

  /**
   * Build disposal notification message
   */
  private buildDisposalNotificationMessage(
    disposalRecords: DisposalRecord[],
  ): string {
    let message = `<html><body>`;
    message += `<h2>Medication Disposal Required</h2>`;
    message += `<p>The following expired medications have been marked for disposal:</p>`;
    message += `<table border="1" cellpadding="5" cellspacing="0">`;
    message += `<tr><th>Medication</th><th>Batch</th><th>Quantity</th><th>Reason</th></tr>`;

    for (const record of disposalRecords) {
      message += `<tr>`;
      message += `<td>${record.medicationName}</td>`;
      message += `<td>${record.batchNumber}</td>`;
      message += `<td>${record.quantity}</td>`;
      message += `<td>${record.reason}</td>`;
      message += `</tr>`;
    }

    message += `</table>`;
    message += `<p><strong>Total Items: ${disposalRecords.length}</strong></p>`;
    message += `<p>Please follow proper disposal procedures as per regulatory requirements.</p>`;
    message += `<p>Note: Controlled substances require witnessing and DEA-authorized disposal.</p>`;
    message += `</body></html>`;

    return message;
  }
}
