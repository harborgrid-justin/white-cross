import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EnterpriseFeaturesController } from './enterprise-features.controller';
import { EnterpriseFeaturesService } from './enterprise-features.service';
import { WaitlistManagementService } from './waitlist-management.service';
import { RecurringAppointmentsService } from './recurring-appointments.service';
import { ReminderSchedulerService } from './reminder-scheduler.service';
import { PhotoVideoEvidenceService } from './photo-video-evidence.service';
import { WitnessStatementService } from './witness-statement.service';
import { InsuranceClaimService } from './insurance-claim.service';
import { HipaaComplianceService } from './hipaa-compliance.service';
import { RegulationTrackingService } from './regulation-tracking.service';
import { ConsentFormManagementService } from './consent-form-management.service';
import { MessageTemplateLibraryService } from './message-template-library.service';
import { BulkMessagingService } from './bulk-messaging.service';
import { LanguageTranslationService } from './language-translation.service';
import { CustomReportBuilderService } from './custom-report-builder.service';
import { AnalyticsDashboardService } from './analytics-dashboard.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [EnterpriseFeaturesController],
  providers: [
    EnterpriseFeaturesService,
    WaitlistManagementService,
    RecurringAppointmentsService,
    ReminderSchedulerService,
    PhotoVideoEvidenceService,
    WitnessStatementService,
    InsuranceClaimService,
    HipaaComplianceService,
    RegulationTrackingService,
    ConsentFormManagementService,
    MessageTemplateLibraryService,
    BulkMessagingService,
    LanguageTranslationService,
    CustomReportBuilderService,
    AnalyticsDashboardService,
  ],
  exports: [
    EnterpriseFeaturesService,
    WaitlistManagementService,
    RecurringAppointmentsService,
    ReminderSchedulerService,
    PhotoVideoEvidenceService,
    WitnessStatementService,
    InsuranceClaimService,
    HipaaComplianceService,
    RegulationTrackingService,
    ConsentFormManagementService,
    MessageTemplateLibraryService,
    BulkMessagingService,
    LanguageTranslationService,
    CustomReportBuilderService,
    AnalyticsDashboardService,
  ],
})
export class EnterpriseFeaturesModule {}
