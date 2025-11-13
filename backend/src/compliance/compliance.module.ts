/**
 * Compliance Module - Complete HIPAA/FERPA Compliance Management
 * Comprehensive module for audit trails, consent management, policy management,
 * compliance reporting, checklists, PHI disclosures, data retention, and violations
 */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { DatabaseModule } from '../database/database.module';

// Services
import { AuditService } from './services/audit.service';
import { ConsentService } from './services/consent.service';
import { ComplianceReportService } from './services/compliance-report.service';
import { ChecklistService } from './services/checklist.service';
import { PolicyService } from './services/policy.service';
import { DataRetentionService } from './services/data-retention.service';
import { ViolationService } from './services/violation.service';
import { StatisticsService } from './services/statistics.service';

// Database Repositories
import { ComplianceReportRepository } from '../database/repositories/impl/compliance-report.repository';
import { ChecklistRepository } from './repositories/checklist.repository';
import { PolicyRepository } from './repositories/policy.repository';
import { DataRetentionRepository } from './repositories/data-retention.repository';
import { ViolationRepository } from './repositories/violation.repository';

// Models needed for @InjectModel in services
import { AuditLog } from '@/database/models';
import { ConsentForm } from '@/database/models';
import { ConsentSignature } from '@/database/models';
import { ComplianceReport } from '@/database/models';
import { ComplianceChecklistItem } from '@/database/models';
import { PolicyDocument } from '@/database/models';
import { PolicyAcknowledgment } from '@/database/models';
import { DataRetentionPolicy } from '@/database/models';
import { ComplianceViolation } from '@/database/models';
import { RemediationAction } from '@/database/models';

/**
 * ComplianceModule provides comprehensive HIPAA/FERPA-compliant features:
 *
 * Core Features:
 * - Audit Logging (45 CFR 164.312(b)): Complete audit trails of PHI access
 * - Consent Management (45 CFR 164.508): Digital consent forms with legal validity
 * - PHI Disclosure Tracking (§164.528): Accounting of disclosures
 * - Compliance Reporting: HIPAA, FERPA, and regulatory compliance documentation
 * - Policy Management: Policy documents with acknowledgment tracking
 * - Checklist Management: Compliance requirement tracking and verification
 * - Data Retention: Policy-based data retention and archival
 * - Violation Tracking: Compliance violation reporting and remediation
 * - Statistics & Dashboards: Compliance metrics and executive reporting
 *
 * Compliance Coverage:
 * - HIPAA Privacy Rule
 * - HIPAA Security Rule
 * - FERPA Educational Records
 * - Breach Notification
 * - Risk Assessment
 * - Training Compliance
 * - Incident Response
 */
@Module({
  imports: [
    DatabaseModule,
    // Re-register models needed for @InjectModel() in this module's services
    SequelizeModule.forFeature([
      AuditLog,
      ConsentForm,
      ConsentSignature,
      ComplianceReport,
      ComplianceChecklistItem,
      PolicyDocument,
      PolicyAcknowledgment,
      DataRetentionPolicy,
      ComplianceViolation,
      RemediationAction,
    ]),
  ],
  controllers: [ComplianceController],
  providers: [
    // Main service
    ComplianceService,

    // Domain services
    AuditService,
    ConsentService,
    ComplianceReportService,
    ChecklistService,
    PolicyService,
    DataRetentionService,
    ViolationService,
    StatisticsService,

    // Repositories
    {
      provide: 'ComplianceReportRepository',
      useExisting: ComplianceReportRepository, // Use the repository from DatabaseModule
    },
    {
      provide: 'DatabaseComplianceReportRepository',
      useExisting: ComplianceReportRepository, // Use the repository from DatabaseModule
    },
    ChecklistRepository,
    PolicyRepository,
    DataRetentionRepository,
    ViolationRepository,
  ],
  exports: [
    // Export services for use in other modules
    ComplianceService,
    AuditService,
    ConsentService,
    ComplianceReportService,
    ChecklistService,
    PolicyService,
    DataRetentionService,
    ViolationService,
    StatisticsService,
  ],
})
export class ComplianceModule {}
