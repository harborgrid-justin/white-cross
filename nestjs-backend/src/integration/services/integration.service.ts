import { Injectable } from '@nestjs/common';
import { IntegrationConfigService } from './integration-config.service';
import { IntegrationTestService } from './integration-test.service';
import { IntegrationSyncService } from './integration-sync.service';
import { IntegrationLogService } from './integration-log.service';
import { IntegrationStatisticsService } from './integration-statistics.service';
import { IntegrationValidationService } from './integration-validation.service';
import { IntegrationEncryptionService } from './integration-encryption.service';

/**
 * Main Integration Service (Facade Pattern)
 * Provides a unified interface to all integration functionality
 */
@Injectable()
export class IntegrationService {
  constructor(
    private readonly configService: IntegrationConfigService,
    private readonly testService: IntegrationTestService,
    private readonly syncService: IntegrationSyncService,
    private readonly logService: IntegrationLogService,
    private readonly statisticsService: IntegrationStatisticsService,
    private readonly validationService: IntegrationValidationService,
    private readonly encryptionService: IntegrationEncryptionService,
  ) {}

  // Configuration Management
  getAllIntegrations(type?: string) {
    return this.configService.findAll(type);
  }

  getIntegrationById(id: string, includeSensitive: boolean = false) {
    return this.configService.findById(id, includeSensitive);
  }

  createIntegration(data: any) {
    return this.configService.create(data);
  }

  updateIntegration(id: string, data: any) {
    return this.configService.update(id, data);
  }

  deleteIntegration(id: string) {
    return this.configService.delete(id);
  }

  // Integration Operations
  testConnection(id: string) {
    return this.testService.testConnection(id);
  }

  syncIntegration(id: string) {
    return this.syncService.sync(id);
  }

  // Logs
  getIntegrationLogs(integrationId?: string, type?: string, page?: number, limit?: number) {
    return this.logService.findAll(integrationId, type, page, limit);
  }

  // Statistics
  getIntegrationStatistics() {
    return this.statisticsService.getStatistics();
  }
}
