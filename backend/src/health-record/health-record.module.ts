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
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';

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

// Models
import { HealthRecord } from '../database/models/health-record.model';
import { Allergy } from '../database/models/allergy.model';
import { Student } from '../database/models/student.model';
import { ChronicCondition } from '../database/models/chronic-condition.model';
import { Vaccination } from '../database/models/vaccination.model';
import { CacheEntry } from '../database/models/cache-entry.model';

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
    SequelizeModule.forFeature([
      HealthRecord,
      Allergy,
      Student,
      ChronicCondition,
      Vaccination,
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
  ],
  providers: [
    // Core Service
    HealthRecordService,
    
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
  controllers: [HealthRecordController],
  exports: [
    HealthRecordService,
    PHIAccessLogger,
    HealthRecordMetricsService,
    HealthRecordAuditInterceptor,
    HealthRecordCacheInterceptor,
    HealthRecordRateLimitGuard,
    
    // Analytics Optimization Services (Phase 4)
    CacheStrategyService,
    QueryPerformanceAnalyzer,
    IntelligentCacheInvalidationService,
    ResourceOptimizationService,
  ],
})
export class HealthRecordModule {}
