import { Module } from '@nestjs/common';
import { IntegrationConfigService } from './services/integration-config.service';
import { IntegrationTestService } from './services/integration-test.service';
import { IntegrationSyncService } from './services/integration-sync.service';
import { IntegrationController } from './integration.controller';
import { IntegrationEncryptionService } from './services/integration-encryption.service';
import { IntegrationValidationService } from './services/integration-validation.service';
import { IntegrationLogService } from './services/integration-log.service';
import { IntegrationStatisticsService } from './services/integration-statistics.service';
import { SisIntegrationService } from './services/sis-integration.service';

@Module({
  providers: [IntegrationConfigService, IntegrationTestService, IntegrationSyncService, IntegrationEncryptionService, IntegrationValidationService, IntegrationLogService, IntegrationStatisticsService, SisIntegrationService],
  controllers: [IntegrationController]
})
export class IntegrationModule {}
