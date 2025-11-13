import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IntegrationConfig, IntegrationStatus } from '@/database/models';
import { IntegrationConfigService } from './integration-config.service';
import { IntegrationLogService } from './integration-log.service';

import { BaseService } from '@/common/base';
export interface IntegrationSyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number;
  errors?: string[];
}

/**
 * Integration Sync Service
 * Manages data synchronization between White Cross and external systems
 */
@Injectable()
export class IntegrationSyncService extends BaseService {
  constructor(
    @InjectModel(IntegrationConfig)
    private readonly configModel: typeof IntegrationConfig,
    private readonly configService: IntegrationConfigService,
    private readonly logService: IntegrationLogService,
  ) {}

  /**
   * Trigger integration sync
   */
  async sync(id: string): Promise<IntegrationSyncResult> {
    const startTime = Date.now();

    try {
      const integration = await this.configService.findById(id, true);

      if (!integration.isActive) {
        throw new Error('Integration is not active');
      }

      // Update status to SYNCING
      await this.configModel.update(
        { status: IntegrationStatus.SYNCING },
        { where: { id } },
      );

      // Perform the sync operation
      const syncResult = await this.performSync();

      const duration = Date.now() - startTime;

      // Update integration with sync results
      await this.configModel.update(
        {
          status: syncResult.success
            ? IntegrationStatus.ACTIVE
            : IntegrationStatus.ERROR,
          lastSyncAt: new Date(),
          lastSyncStatus: syncResult.success ? 'success' : 'failed',
        },
        { where: { id } },
      );

      // Log the sync
      await this.logService.create({
        integrationId: id,
        integrationType: integration.type,
        action: 'sync',
        status: syncResult.success ? 'success' : 'failed',
        recordsProcessed: syncResult.recordsProcessed,
        recordsSucceeded: syncResult.recordsSucceeded,
        recordsFailed: syncResult.recordsFailed,
        duration,
        errorMessage: syncResult.errors?.join('; '),
        details: syncResult.errors?.map((error, index) => ({
          code: 'SYNC_ERROR',
          message: error,
          field: `record_${index}`,
        })),
      });

      this.logInfo(
        `Sync ${syncResult.success ? 'completed' : 'failed'} for ${integration.name}`,
      );

      return {
        ...syncResult,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      await this.configModel.update(
        {
          status: IntegrationStatus.ERROR,
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed',
        },
        { where: { id } },
      );

      this.logError('Error syncing integration', error);

      return {
        success: false,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        duration,
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Perform actual sync operation
   * Mock implementation - in production, this would perform real data synchronization
   */
  private async performSync(): Promise<IntegrationSyncResult> {
    // Simulate processing records
    const recordsProcessed = Math.floor(Math.random() * 100) + 50;
    const recordsFailed = Math.floor(Math.random() * 5);
    const recordsSucceeded = recordsProcessed - recordsFailed;

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const errors: string[] = [];
    if (recordsFailed > 0) {
      for (let i = 0; i < Math.min(recordsFailed, 3); i++) {
        errors.push(
          `Record ${i + 1}: Validation error - missing required field`,
        );
      }
      if (recordsFailed > 3) {
        errors.push(`... and ${recordsFailed - 3} more errors`);
      }
    }

    return {
      success: recordsFailed === 0,
      recordsProcessed,
      recordsSucceeded,
      recordsFailed,
      duration: 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
