import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog } from '@/database';
import {
  AuditLogService,
  AuditQueryService,
  AuditStatisticsService,
  AuditUtilsService,
  ComplianceReportingService,
  PHIAccessService,
  SecurityAnalysisService,
} from './services';
import { AuditInterceptor } from './interceptors';

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
