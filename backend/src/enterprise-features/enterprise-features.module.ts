import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EnterpriseFeaturesController } from './enterprise-features.controller';
import { WaitlistController } from './controllers/waitlist.controller';
import { RecurringAppointmentsController } from './controllers/recurring-appointments.controller';
import { RemindersController } from './controllers/reminders.controller';
import { EvidenceController } from './controllers/evidence.controller';
import { WitnessStatementsController } from './controllers/witness-statements.controller';
import { InsuranceClaimsController } from './controllers/insurance-claims.controller';
import { ComplianceController } from './controllers/compliance.controller';
import { ConsentFormsController } from './controllers/consent-forms.controller';
import { MessageTemplatesController } from './controllers/message-templates.controller';
import { BulkMessagingController } from './controllers/bulk-messaging.controller';
import { TranslationController } from './controllers/translation.controller';
import { CustomReportsController } from './controllers/custom-reports.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { EnterpriseFeaturesService } from './enterprise-features.service';
import { WaitlistManagementService } from './waitlist-management.service';
import { RecurringAppointmentsService } from './recurring-appointments.service';
import { RecurringTemplateService } from './services/recurring/recurring-template.service';
import { RecurringGenerationService } from './services/recurring/recurring-generation.service';
import { RecurringStatisticsService } from './services/recurring/recurring-statistics.service';
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
import { MetricsService } from './services/analytics/metrics.service';
import { StatisticsService } from './services/analytics/statistics.service';
import { ComplianceService } from './services/analytics/compliance.service';
import { ExportService } from './services/analytics/export.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [
    EnterpriseFeaturesController,
    WaitlistController,
    RecurringAppointmentsController,
    RemindersController,
    EvidenceController,
    WitnessStatementsController,
    InsuranceClaimsController,
    ComplianceController,
    ConsentFormsController,
    MessageTemplatesController,
    BulkMessagingController,
    TranslationController,
    CustomReportsController,
    AnalyticsController,
  ],
  providers: [
    EnterpriseFeaturesService,
    WaitlistManagementService,
    RecurringAppointmentsService,
    RecurringTemplateService,
    RecurringGenerationService,
    RecurringStatisticsService,
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
    MetricsService,
    StatisticsService,
    ComplianceService,
    ExportService,
  ],
  exports: [
    EnterpriseFeaturesService,
    WaitlistManagementService,
    RecurringAppointmentsService,
    RecurringTemplateService,
    RecurringGenerationService,
    RecurringStatisticsService,
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
    MetricsService,
    StatisticsService,
    ComplianceService,
    ExportService,
  ],
})
export class EnterpriseFeaturesModule {}
