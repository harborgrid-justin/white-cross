import { Injectable } from '@nestjs/common';
import { IntegrationConfigService } from './integration-config.service';
import { IntegrationTestService } from './integration-test.service';
import { IntegrationSyncService } from './integration-sync.service';
import { IntegrationLogService } from './integration-log.service';
import { IntegrationStatisticsService } from './integration-statistics.service';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import { UpdateIntegrationDto } from '../dto/update-integration.dto';

import { BaseService } from '../../../common/base';
/**
 * Main Integration Service (Facade Pattern)
 * Provides a unified interface to all integration functionality
 */
@Injectable()
export class IntegrationService extends BaseService {
  constructor(
    private readonly configService: IntegrationConfigService,
    private readonly testService: IntegrationTestService,
    private readonly syncService: IntegrationSyncService,
    private readonly logService: IntegrationLogService,
    private readonly statisticsService: IntegrationStatisticsService,
  ) {}

  // Configuration Management
  getAllIntegrations(type?: string) {
    return this.configService.findAll(type);
  }

  getIntegrationById(id: string, includeSensitive: boolean = false) {
    return this.configService.findById(id, includeSensitive);
  }

  createIntegration(data: CreateIntegrationDto) {
    return this.configService.create(data);
  }

  updateIntegration(id: string, data: UpdateIntegrationDto) {
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
  getIntegrationLogs(
    integrationId?: string,
    type?: string,
    page?: number,
    limit?: number,
  ) {
    return this.logService.findAll(integrationId, type, page, limit);
  }

  // Statistics
  getIntegrationStatistics() {
    return this.statisticsService.getStatistics();
  }
}
