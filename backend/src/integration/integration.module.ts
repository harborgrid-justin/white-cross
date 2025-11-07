import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

// Models
import { IntegrationConfig } from '../database/models/integration-config.model';
import { IntegrationLog } from '../database/models/integration-log.model';

// Services
import { IntegrationService } from './services/integration.service';
import { IntegrationConfigService } from './services/integration-config.service';
import { IntegrationTestService } from './services/integration-test.service';
import { IntegrationSyncService } from './services/integration-sync.service';
import { IntegrationEncryptionService } from './services/integration-encryption.service';
import { IntegrationValidationService } from './services/integration-validation.service';
import { IntegrationLogService } from './services/integration-log.service';
import { IntegrationStatisticsService } from './services/integration-statistics.service';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { RateLimiterService } from './services/rate-limiter.service';

// Controller
import { IntegrationController } from './integration.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([IntegrationConfig, IntegrationLog]),
    ConfigModule,
  ],
  providers: [
    // Main service
    IntegrationService,

    // Core services
    IntegrationConfigService,
    IntegrationTestService,
    IntegrationSyncService,
    IntegrationEncryptionService,
    IntegrationValidationService,
    IntegrationLogService,
    IntegrationStatisticsService,

    // Infrastructure services
    CircuitBreakerService,
    RateLimiterService,
  ],
  controllers: [IntegrationController],
  exports: [IntegrationService, CircuitBreakerService, RateLimiterService],
})
export class IntegrationModule {}
