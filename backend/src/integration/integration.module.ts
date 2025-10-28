import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { IntegrationConfig } from './entities/integration-config.entity';
import { IntegrationLog } from './entities/integration-log.entity';

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
    TypeOrmModule.forFeature([IntegrationConfig, IntegrationLog]),
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
  exports: [
    IntegrationService,
    CircuitBreakerService,
    RateLimiterService,
  ],
})
export class IntegrationModule {}
