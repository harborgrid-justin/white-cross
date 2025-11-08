import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog } from '@/database';
import { AuditLogService } from './services/audit-log.service';
import { AuditQueryService } from './services/audit-query.service';
import { AuditStatisticsService } from './services/audit-statistics.service';
import { AuditUtilsService } from './services/audit-utils.service';
import { ComplianceReportingService } from './services/compliance-reporting.service';
import { PHIAccessService } from './services/phi-access.service';
import { SecurityAnalysisService } from './services/security-analysis.service';
import { AuditInterceptor } from './interceptors/audit.interceptor';

/**
 * Audit Module
 *
 * Comprehensive audit logging and compliance reporting module for HIPAA compliance.
 * Provides audit trail for all system actions and PHI access tracking.
 *
 * Features:
 * - Fail-safe audit logging
 * - PHI access tracking (HIPAA compliant)
 * - Advanced querying and filtering
 * - Compliance reporting
 * - Security analysis and threat detection
 * - Audit statistics and dashboards
 *
 * Exports:
 * - AuditService: Main service for use by other modules
 * - AuditInterceptor: For automatic audit logging
 */
@Module({
  imports: [SequelizeModule.forFeature([AuditLog])],
  providers: [
    // Main facade service
    AuditService,
    // Specialized services
    AuditLogService,
    PHIAccessService,
    AuditQueryService,
    ComplianceReportingService,
    AuditStatisticsService,
    SecurityAnalysisService,
    AuditUtilsService,
    // Interceptor
    AuditInterceptor,
  ],
  controllers: [AuditController],
  exports: [AuditService, AuditInterceptor],
})
export class AuditModule {}
