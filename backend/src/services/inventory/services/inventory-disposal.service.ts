/**
 * Inventory Disposal Service
 *
 * Handles expired medication disposal workflow
 * Extracted from inventory-maintenance.processor.ts for better modularity
 */
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize, QueryTypes } from 'sequelize';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { InventoryNotificationService, DisposalRecord } from './inventory-notification.service';

@Injectable()
export class InventoryDisposalService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly notificationService: InventoryNotificationService,
  ) {
    super(requestContext);
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

    this.logger.log(`Found ${expiredItems.length} expired inventory items to mark for disposal`);

    if (expiredItems.length === 0) {
      return 0;
    }

    // Create disposal records for each expired item
    const disposalRecords: DisposalRecord[] = [];
    for (const item of expiredItems) {
      try {
        /**
         * DISPOSAL RECORD CREATION
         *
         * Current Implementation:
         * - Creates in-memory disposal records for tracking and notification
         * - Records are logged and sent to administrators for manual processing
         *
         * Future Enhancement (when DisposalRecord model is implemented):
         * The DisposalRecord model should include:
         * - id: UUID primary key
         * - medicationId: Foreign key to medications table
         * - inventoryId: Foreign key to medication_inventory table
         * - batchNumber: String - batch number of medication
         * - quantity: Number - quantity to be disposed
         * - reason: Enum - EXPIRED, DAMAGED, RECALLED, OBSOLETE
         * - status: Enum - PENDING_DISPOSAL, IN_PROGRESS, DISPOSED, CANCELLED
         * - markedAt: Timestamp - when marked for disposal
         * - markedBy: Foreign key to users table
         * - disposedAt: Timestamp - when disposal completed (nullable)
         * - disposedBy: Foreign key to users table (nullable)
         * - witnessedBy: Foreign key to users table (nullable) - for controlled substances
         * - disposalMethod: String - method used (incinerator, authorized vendor, etc.)
         * - deaFormNumber: String - DEA 41 form number for controlled substances (nullable)
         * - notes: Text - additional disposal notes
         * - organizationId: Foreign key to organizations table
         * - createdAt: Timestamp
         * - updatedAt: Timestamp
         *
         * Example model creation code:
         * ```typescript
         * await DisposalRecord.create({
         *   medicationId: item.medication_id,
         *   inventoryId: item.id,
         *   batchNumber: item.batch_number,
         *   quantity: item.quantity,
         *   reason: DisposalReason.EXPIRED,
         *   status: DisposalStatus.PENDING_DISPOSAL,
         *   markedAt: new Date(),
         *   markedBy: 'system', // or admin user ID
         *   organizationId: item.organization_id,
         * });
         * ```
         *
         * Additional Features to implement:
         * - Disposal workflow with approval steps
         * - Integration with DEA reporting for controlled substances
         * - Automatic inventory quantity adjustment after disposal
         * - Disposal audit trail
         * - Cost tracking for disposed inventory
         */

        // Create in-memory record for notification and tracking
        const disposalRecord: DisposalRecord = {
          medicationId: item.medication_id,
          medicationName: item.medication_name,
          batchNumber: item.batch_number,
          quantity: item.quantity,
          reason: 'EXPIRED',
          status: 'PENDING_DISPOSAL',
          markedAt: new Date(),
        };

        disposalRecords.push(disposalRecord);

        this.logger.log(
          `Marked for disposal: ${item.medication_name} (Batch: ${item.batch_number}), Qty: ${item.quantity}`,
          {
            medicationId: item.medication_id,
            batchNumber: item.batch_number,
            quantity: item.quantity,
            expirationDate: item.expiration_date,
            disposalStatus: 'PENDING_DISPOSAL',
          },
        );
      } catch (error) {
        this.logger.error(`Failed to mark item for disposal: ${item.medication_name}`, {
          error: error instanceof Error ? error.message : String(error),
          medicationId: item.medication_id,
          batchNumber: item.batch_number,
        });
      }
    }

    // Log disposal workflow initiation
    this.logger.log(`Disposal workflow initiated for ${disposalRecords.length} expired items`, {
      totalQuantity: disposalRecords.reduce((sum, r) => sum + r.quantity, 0),
      medications: disposalRecords.map((r) => r.medicationName).join(', '),
    });

    // Send notification to administrators about disposal requirements
    await this.notificationService.sendDisposalNotification(disposalRecords);

    return disposalRecords.length;
  }
}
