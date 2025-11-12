/**
 * Health Record Module
 *
 * Comprehensive HIPAA-compliant health management system providing unified access
 * to health records, allergies, vaccinations, chronic conditions, vital signs,
 * search, import/export, and statistics.
 *
 * Enhanced with Enterprise Patterns:
 * - HIPAA-compliant audit logging with correlation IDs
 * - Performance monitoring for PHI access patterns
 * - Intelligent caching with compliance-aware TTL
 * - Security-focused rate limiting with escalation
 * - Comprehensive compliance dashboard and reporting
 *
 * HIPAA CRITICAL - This module manages Protected Health Information (PHI)
 *
 * @module HealthRecordModule
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthRecordService } from './health-record.service';
import { HealthRecordCrudController, HealthRecordComplianceController } from './controllers';

// Specialized Services (Refactored from main service)
import { HealthRecordCrudService } from './services/health-record-crud.service';
import { HealthRecordAllergyService } from './services/health-record-allergy.service';
import { HealthRecordChronicConditionService } from './services/health-record-chronic-condition.service';
import { HealthRecordVaccinationService } from './services/health-record-vaccination.service';
import { HealthRecordVitalsService } from './services/health-record-vitals.service';
import { HealthRecordSummaryService } from './services/health-record-summary.service';
import { HealthRecordBatchService } from './services/health-record-batch.service';

// Enterprise Pattern Services
import { PHIAccessLogger } from './services/phi-access-logger.service';
import { HealthRecordMetricsService } from './services/health-record-metrics.service';

// Analytics Optimization Services (Phase 4)
import { CacheStrategyService } from './services/cache-strategy.service';
import { QueryPerformanceAnalyzer } from './services/query-performance-analyzer.service';
import { IntelligentCacheInvalidationService } from './services/intelligent-cache-invalidation.service';
import { ResourceOptimizationService } from './services/resource-optimization.service';

// Enterprise Pattern Interceptors
import { HealthRecordAuditInterceptor } from './interceptors/health-record-audit.interceptor';
import { HealthRecordCacheInterceptor } from './interceptors/health-record-cache.interceptor';

// Enterprise Pattern Guards
import { HealthRecordRateLimitGuard } from './guards/health-record-rate-limit.guard';

// Sub-modules
import { VaccinationModule } from './vaccination/vaccination.module';
import { VitalsModule } from './vitals/vitals.module';
import { SearchModule } from './search/search.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ImportExportModule } from './import-export/import-export.module';
import { ChronicConditionModule } from './chronic-condition/chronic-condition.module';
import { ValidationModule } from './validation/validation.module';
import { AllergyModule } from './allergy/allergy.module';
import { MedicationModule } from './medication/medication.module';
import { ScreeningModule } from './screening/screening.module';

// Models
import { HealthRecord   } from "../../database/models";
import { Allergy   } from "../../database/models";
import { Student   } from "../../database/models";
import { ChronicCondition   } from "../../database/models";
import { Vaccination   } from "../../database/models";
import { Medication   } from "../../database/models";
import { CacheEntry   } from "../../database/models";

/**
 * Health Record Module
 *
 * Integrates enterprise patterns for HIPAA-compliant PHI management:
 *
 * 🔒 Security & Compliance:
 * - PHI Access Logger: Structured audit logging with correlation IDs
 * - Rate Limit Guard: Tiered rate limiting based on operation sensitivity
 * - Audit Interceptor: HIPAA-compliant audit trails for all operations
 *
 * 📊 Performance & Monitoring:
 * - Metrics Service: Comprehensive PHI access pattern monitoring
 * - Cache Interceptor: Intelligent caching with compliance-aware TTL
 * - Prometheus integration for external monitoring systems
 *
 * 📋 Compliance Dashboard:
 * - Real-time PHI access statistics
 * - Security incident monitoring
 * - Compliance reporting and audit trails
 * - Health status monitoring with compliance checks
 */
@Module({
  imports: [
    // Cache configuration for health record operations
    CacheModule.register({
      ttl: 300, // Default TTL: 5 minutes (300 seconds)
      max: 200, // Maximum number of items in cache (higher for health records)
      isGlobal: false,
    }),

    SequelizeModule.forFeature([
      HealthRecord,
      Allergy,
      Student,
      ChronicCondition,
      Vaccination,
      Medication,
      CacheEntry,
    ]),
    VaccinationModule,
    VitalsModule,
    SearchModule,
    StatisticsModule,
    ImportExportModule,
    ChronicConditionModule,
    ValidationModule,
    AllergyModule,
    MedicationModule,
    ScreeningModule,
  ],
  providers: [
    // Core Service
    HealthRecordService,

    // Specialized Services (Refactored from main service)
    HealthRecordCrudService,
    HealthRecordAllergyService,
    HealthRecordChronicConditionService,
    HealthRecordVaccinationService,
    HealthRecordVitalsService,
    HealthRecordSummaryService,
    HealthRecordBatchService,

    // Enterprise Pattern Services
    PHIAccessLogger,
    HealthRecordMetricsService,

    // Analytics Optimization Services (Phase 4)
    CacheStrategyService,
    QueryPerformanceAnalyzer,
    IntelligentCacheInvalidationService,
    ResourceOptimizationService,

    // Enterprise Pattern Interceptors
    HealthRecordAuditInterceptor,
    HealthRecordCacheInterceptor,

    // Enterprise Pattern Guards
    HealthRecordRateLimitGuard,
  ],
  controllers: [HealthRecordCrudController, HealthRecordComplianceController],
  exports: [
    HealthRecordService,
    PHIAccessLogger,
    HealthRecordMetricsService,
    HealthRecordAuditInterceptor,
    HealthRecordCacheInterceptor,
    HealthRecordRateLimitGuard,
    AllergyModule, // Export AllergyModule to make AllergyService available

    // Analytics Optimization Services (Phase 4)
    CacheStrategyService,
    QueryPerformanceAnalyzer,
    IntelligentCacheInvalidationService,
    ResourceOptimizationService,
  ],
})
export class HealthRecordModule {}
