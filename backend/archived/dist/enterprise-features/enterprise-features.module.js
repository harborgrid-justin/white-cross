"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseFeaturesModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const enterprise_features_controller_1 = require("./enterprise-features.controller");
const waitlist_controller_1 = require("./controllers/waitlist.controller");
const recurring_appointments_controller_1 = require("./controllers/recurring-appointments.controller");
const reminders_controller_1 = require("./controllers/reminders.controller");
const evidence_controller_1 = require("./controllers/evidence.controller");
const witness_statements_controller_1 = require("./controllers/witness-statements.controller");
const insurance_claims_controller_1 = require("./controllers/insurance-claims.controller");
const compliance_controller_1 = require("./controllers/compliance.controller");
const consent_forms_controller_1 = require("./controllers/consent-forms.controller");
const message_templates_controller_1 = require("./controllers/message-templates.controller");
const bulk_messaging_controller_1 = require("./controllers/bulk-messaging.controller");
const translation_controller_1 = require("./controllers/translation.controller");
const custom_reports_controller_1 = require("./controllers/custom-reports.controller");
const analytics_controller_1 = require("./controllers/analytics.controller");
const enterprise_features_service_1 = require("./enterprise-features.service");
const waitlist_management_service_1 = require("./waitlist-management.service");
const recurring_appointments_service_1 = require("./recurring-appointments.service");
const recurring_template_service_1 = require("./services/recurring/recurring-template.service");
const recurring_generation_service_1 = require("./services/recurring/recurring-generation.service");
const recurring_statistics_service_1 = require("./services/recurring/recurring-statistics.service");
const reminder_scheduler_service_1 = require("./reminder-scheduler.service");
const photo_video_evidence_service_1 = require("./photo-video-evidence.service");
const witness_statement_service_1 = require("./witness-statement.service");
const insurance_claim_service_1 = require("./insurance-claim.service");
const hipaa_compliance_service_1 = require("./hipaa-compliance.service");
const regulation_tracking_service_1 = require("./regulation-tracking.service");
const consent_form_management_service_1 = require("./consent-form-management.service");
const message_template_library_service_1 = require("./message-template-library.service");
const bulk_messaging_service_1 = require("./bulk-messaging.service");
const language_translation_service_1 = require("./language-translation.service");
const custom_report_builder_service_1 = require("./custom-report-builder.service");
const analytics_dashboard_service_1 = require("./analytics-dashboard.service");
const metrics_service_1 = require("./services/analytics/metrics.service");
const statistics_service_1 = require("./services/analytics/statistics.service");
const compliance_service_1 = require("./services/analytics/compliance.service");
const export_service_1 = require("./services/analytics/export.service");
let EnterpriseFeaturesModule = class EnterpriseFeaturesModule {
};
exports.EnterpriseFeaturesModule = EnterpriseFeaturesModule;
exports.EnterpriseFeaturesModule = EnterpriseFeaturesModule = __decorate([
    (0, common_1.Module)({
        imports: [event_emitter_1.EventEmitterModule.forRoot()],
        controllers: [
            enterprise_features_controller_1.EnterpriseFeaturesController,
            waitlist_controller_1.WaitlistController,
            recurring_appointments_controller_1.RecurringAppointmentsController,
            reminders_controller_1.RemindersController,
            evidence_controller_1.EvidenceController,
            witness_statements_controller_1.WitnessStatementsController,
            insurance_claims_controller_1.InsuranceClaimsController,
            compliance_controller_1.ComplianceController,
            consent_forms_controller_1.ConsentFormsController,
            message_templates_controller_1.MessageTemplatesController,
            bulk_messaging_controller_1.BulkMessagingController,
            translation_controller_1.TranslationController,
            custom_reports_controller_1.CustomReportsController,
            analytics_controller_1.AnalyticsController,
        ],
        providers: [
            enterprise_features_service_1.EnterpriseFeaturesService,
            waitlist_management_service_1.WaitlistManagementService,
            recurring_appointments_service_1.RecurringAppointmentsService,
            recurring_template_service_1.RecurringTemplateService,
            recurring_generation_service_1.RecurringGenerationService,
            recurring_statistics_service_1.RecurringStatisticsService,
            reminder_scheduler_service_1.ReminderSchedulerService,
            photo_video_evidence_service_1.PhotoVideoEvidenceService,
            witness_statement_service_1.WitnessStatementService,
            insurance_claim_service_1.InsuranceClaimService,
            hipaa_compliance_service_1.HipaaComplianceService,
            regulation_tracking_service_1.RegulationTrackingService,
            consent_form_management_service_1.ConsentFormManagementService,
            message_template_library_service_1.MessageTemplateLibraryService,
            bulk_messaging_service_1.BulkMessagingService,
            language_translation_service_1.LanguageTranslationService,
            custom_report_builder_service_1.CustomReportBuilderService,
            analytics_dashboard_service_1.AnalyticsDashboardService,
            metrics_service_1.MetricsService,
            statistics_service_1.StatisticsService,
            compliance_service_1.ComplianceService,
            export_service_1.ExportService,
        ],
        exports: [
            enterprise_features_service_1.EnterpriseFeaturesService,
            waitlist_management_service_1.WaitlistManagementService,
            recurring_appointments_service_1.RecurringAppointmentsService,
            recurring_template_service_1.RecurringTemplateService,
            recurring_generation_service_1.RecurringGenerationService,
            recurring_statistics_service_1.RecurringStatisticsService,
            reminder_scheduler_service_1.ReminderSchedulerService,
            photo_video_evidence_service_1.PhotoVideoEvidenceService,
            witness_statement_service_1.WitnessStatementService,
            insurance_claim_service_1.InsuranceClaimService,
            hipaa_compliance_service_1.HipaaComplianceService,
            regulation_tracking_service_1.RegulationTrackingService,
            consent_form_management_service_1.ConsentFormManagementService,
            message_template_library_service_1.MessageTemplateLibraryService,
            bulk_messaging_service_1.BulkMessagingService,
            language_translation_service_1.LanguageTranslationService,
            custom_report_builder_service_1.CustomReportBuilderService,
            analytics_dashboard_service_1.AnalyticsDashboardService,
            metrics_service_1.MetricsService,
            statistics_service_1.StatisticsService,
            compliance_service_1.ComplianceService,
            export_service_1.ExportService,
        ],
    })
], EnterpriseFeaturesModule);
//# sourceMappingURL=enterprise-features.module.js.map