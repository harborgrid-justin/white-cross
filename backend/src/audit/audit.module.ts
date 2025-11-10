import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PHIAccessLogger } from '../health-record/services/phi-access-logger.service';
import { HealthRecordAuditInterceptor } from '../health-record/interceptors/health-record-audit.interceptor';
import { AuditLog } from '../database/models/audit-log.model';
import { PhiDisclosureAudit } from '../database/models/phi-disclosure-audit.model';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogService } from './services/audit-log.service';
import { AuditQueryService } from './services/audit-query.service';
import { AuditStatisticsService } from './services/audit-statistics.service';
import { AuditUtilsService } from './services/audit-utils.service';
import { ComplianceReportingService } from './services/compliance-reporting.service';
import { PHIAccessService } from './services/phi-access.service';
import { SecurityAnalysisService } from './services/security-analysis.service';

/**
 * Audit Module
 *
 * Provides HIPAA-compliant audit logging services that can be shared across modules
 * without creating circular dependencies.
 *
 * This module exports:
 * - AuditService: Main audit service facade
 * - PHIAccessLogger: Service for logging PHI access events
 * - HealthRecordAuditInterceptor: Interceptor for automatic audit logging
 */
@Module({
  imports: [SequelizeModule.forFeature([AuditLog, PhiDisclosureAudit])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditLogService,
    AuditQueryService,
    AuditStatisticsService,
    AuditUtilsService,
    ComplianceReportingService,
    PHIAccessService,
    SecurityAnalysisService,
    PHIAccessLogger,
    HealthRecordAuditInterceptor,
  ],
  exports: [
    AuditService,
    PHIAccessLogger,
    HealthRecordAuditInterceptor,
  ],
})
export class AuditModule {}
