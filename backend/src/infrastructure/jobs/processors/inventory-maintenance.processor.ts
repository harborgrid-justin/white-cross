/**
 * Inventory Maintenance Job Processor
 *
 * Refactored to use modular services for better maintainability
 * Main responsibilities:
 * - Orchestrate inventory maintenance workflow
 * - Coordinate between specialized services
 * - Handle job processing and error reporting
 */
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { JobType } from '../enums/job-type.enum';
import { InventoryMaintenanceData } from '../interfaces/job-data.interface';
import { CacheService } from '@/common/cache/cache.service';
import { InventoryAlertService } from '@/services/inventory/inventory-alert.service';
import { InventoryNotificationService } from '@/services/inventory/inventory-notification.service';
import { InventoryReorderService } from '@/services/inventory/inventory-reorder.service';
import { InventoryReportService } from '@/services/inventory/inventory-report.service';
import { InventoryDisposalService } from '@/services/inventory/inventory-disposal.service';

/**
 * Cache configuration constants
 */
const CACHE_TAG_INVENTORY = 'inventory';

@Processor(JobType.INVENTORY_MAINTENANCE)
export class InventoryMaintenanceProcessor {
  private readonly logger = new Logger(InventoryMaintenanceProcessor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly alertService: InventoryAlertService,
    private readonly notificationService: InventoryNotificationService,
    private readonly reorderService: InventoryReorderService,
    private readonly reportService: InventoryReportService,
    private readonly disposalService: InventoryDisposalService,
  ) {}

  @Process()
  async processInventoryMaintenance(job: Job<InventoryMaintenanceData>): Promise<any> {
    const { organizationId, forceRefresh } = job.data;

    try {
      this.logger.log('Starting inventory maintenance job', {
        jobId: job.id,
        organizationId,
        forceRefresh,
      });

      const startTime = Date.now();

      // 1. Refresh materialized view
      await this.alertService.refreshMaterializedView();

      // 2. Identify critical alerts
      const alerts = await this.alertService.identifyCriticalAlerts(organizationId);

      // 3. Generate reorder suggestions
      const reorderSuggestions = await this.reorderService.generateReorderSuggestions(organizationId);

      // 4. Send notifications if needed
      if (alerts.length > 0) {
        await this.notificationService.sendAlertNotifications(alerts, reorderSuggestions);
      }

      // 5. Generate and send inventory report if configured
      if (this.configService.get<boolean>('INVENTORY_DAILY_REPORT', false)) {
        await this.reportService.generateAndSendInventoryReport(organizationId);
      }

      // 6. Mark expired items for disposal if any exist
      const expiredCount = await this.disposalService.markExpiredForDisposal();
      if (expiredCount > 0) {
        this.logger.log(`Marked ${expiredCount} expired items for disposal`);
      }

      // 7. Invalidate cache to ensure fresh data
      this.cacheService.invalidateByTag(CACHE_TAG_INVENTORY);
      this.logger.debug('Inventory cache invalidated');

      const duration = Date.now() - startTime;
      this.logger.log(
        `Inventory maintenance completed: ${alerts.length} alerts, ${reorderSuggestions.length} reorder suggestions, ${expiredCount} disposals in ${duration}ms`,
      );

      return {
        alertsIdentified: alerts.length,
        reorderSuggestionsCount: reorderSuggestions.length,
        expiredItemsMarkedForDisposal: expiredCount,
        duration,
        alerts,
        reorderSuggestions,
      };
    } catch (error) {
      this.logger.error('Inventory maintenance job failed', error);
      throw error;
    }
  }
}
