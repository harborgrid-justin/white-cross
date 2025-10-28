/**
 * Compliance Module
 * HIPAA-compliant healthcare operations and regulatory compliance management
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';

// Services
import { AuditService } from './services/audit.service';
import { ConsentService } from './services/consent.service';

// Entities
import {
  AuditLog,
  ConsentForm,
  ConsentSignature,
  PhiDisclosure,
  PhiDisclosureAudit,
} from './entities';

/**
 * ComplianceModule provides comprehensive HIPAA-compliant features:
 *
 * - Audit Logging (45 CFR 164.312(b)): Complete audit trails of PHI access
 * - Consent Management (45 CFR 164.508): Digital consent forms with legal validity
 * - PHI Disclosure Tracking (§164.528): Accounting of disclosures
 * - Compliance Reporting: Regulatory compliance documentation
 * - Policy Management: Policy documents with acknowledgment tracking
 *
 * Additional services to be added:
 * - PHIDisclosureService: PHI disclosure tracking and follow-up management
 * - ComplianceReportService: Compliance report lifecycle management
 * - ChecklistService: Compliance checklist tracking
 * - PolicyService: Policy document management
 * - StatisticsService: Compliance dashboards and analytics
 * - ReportGenerationService: Automated compliance report generation
 *
 * Additional entities to be created:
 * - ComplianceReport: Regulatory compliance reports
 * - ComplianceChecklistItem: Checklist items for compliance tracking
 * - PolicyDocument: Organizational policies
 * - PolicyAcknowledgment: Staff policy acknowledgments
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Current entities
      AuditLog,
      ConsentForm,
      ConsentSignature,
      PhiDisclosure,
      PhiDisclosureAudit,
      // Additional entities to be added:
      // ComplianceReport,
      // ComplianceChecklistItem,
      // PolicyDocument,
      // PolicyAcknowledgment,
    ]),
  ],
  controllers: [ComplianceController],
  providers: [
    ComplianceService,
    AuditService,
    ConsentService,
    // Additional services to be added:
    // PhiDisclosureService,
    // ComplianceReportService,
    // ChecklistService,
    // PolicyService,
    // StatisticsService,
    // ReportGenerationService,
  ],
  exports: [
    ComplianceService,
    AuditService,
    ConsentService,
    // Export additional services for use in other modules
  ],
})
export class ComplianceModule {}
