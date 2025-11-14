"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const waitlist_management_service_1 = require("./waitlist-management.service");
const recurring_appointments_service_1 = require("./recurring-appointments.service");
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
const base_1 = require("../common/base");
let EnterpriseFeaturesService = class EnterpriseFeaturesService extends base_1.BaseService {
    waitlistService;
    recurringAppointmentsService;
    reminderService;
    evidenceService;
    witnessStatementService;
    insuranceClaimService;
    hipaaComplianceService;
    regulationTrackingService;
    consentFormService;
    messageTemplateService;
    bulkMessagingService;
    translationService;
    reportBuilderService;
    analyticsService;
    constructor(waitlistService, recurringAppointmentsService, reminderService, evidenceService, witnessStatementService, insuranceClaimService, hipaaComplianceService, regulationTrackingService, consentFormService, messageTemplateService, bulkMessagingService, translationService, reportBuilderService, analyticsService) {
        super("EnterpriseFeaturesService");
        this.waitlistService = waitlistService;
        this.recurringAppointmentsService = recurringAppointmentsService;
        this.reminderService = reminderService;
        this.evidenceService = evidenceService;
        this.witnessStatementService = witnessStatementService;
        this.insuranceClaimService = insuranceClaimService;
        this.hipaaComplianceService = hipaaComplianceService;
        this.regulationTrackingService = regulationTrackingService;
        this.consentFormService = consentFormService;
        this.messageTemplateService = messageTemplateService;
        this.bulkMessagingService = bulkMessagingService;
        this.translationService = translationService;
        this.reportBuilderService = reportBuilderService;
        this.analyticsService = analyticsService;
        this.logInfo('Enterprise Features Service initialized with all specialized services');
    }
    async addToWaitlist(studentId, appointmentType, priority = 'routine') {
        return this.waitlistService.addToWaitlist(studentId, appointmentType, priority);
    }
    async autoFillFromWaitlist(appointmentSlot, appointmentType) {
        return this.waitlistService.autoFillFromWaitlist(appointmentSlot, appointmentType);
    }
    async getWaitlistByPriority() {
        return this.waitlistService.getWaitlistByPriority();
    }
    async getWaitlistStatus(studentId) {
        return this.waitlistService.getWaitlistStatus(studentId);
    }
    async createRecurringTemplate(data) {
        return this.recurringAppointmentsService.createRecurringTemplate(data);
    }
    async generateAppointmentsFromTemplate(template) {
        return this.recurringAppointmentsService.generateAppointmentsFromTemplate(template.id);
    }
    async cancelRecurringSeries(templateId) {
        return this.recurringAppointmentsService.cancelRecurringSeries(templateId, 'system', 'API cancellation');
    }
    async scheduleReminders(appointmentId) {
        return this.reminderService.scheduleReminders(appointmentId);
    }
    async sendDueReminders() {
        return this.reminderService.sendDueReminders();
    }
    async customizeReminderPreferences(studentId, preferences) {
        return this.reminderService.updatePreferences(studentId, preferences);
    }
    async uploadEvidence(incidentId, fileData, type, uploadedBy) {
        return this.evidenceService.uploadEvidence(incidentId, fileData, type, uploadedBy);
    }
    async getEvidenceWithAudit(evidenceId, accessedBy) {
        return this.evidenceService.getEvidenceWithAudit(evidenceId, accessedBy);
    }
    async deleteEvidence(evidenceId, deletedBy, reason) {
        return this.evidenceService.deleteEvidence(evidenceId, deletedBy, reason);
    }
    async captureStatement(data) {
        return this.witnessStatementService.captureStatement(data);
    }
    async verifyStatement(statementId, verifiedBy) {
        return this.witnessStatementService.verifyStatement(statementId, verifiedBy);
    }
    async transcribeVoiceStatement(audioData) {
        return this.witnessStatementService.transcribeVoiceStatement(audioData);
    }
    async generateClaim(incidentId, studentId) {
        return this.insuranceClaimService.createClaim(incidentId, studentId);
    }
    async exportClaimToFormat(claimId, format) {
        return this.insuranceClaimService.exportClaim(claimId, format);
    }
    async submitClaimElectronically(claimId) {
        return this.insuranceClaimService.submitClaimElectronically(claimId);
    }
    async performComplianceAudit() {
        return this.hipaaComplianceService.performComplianceAudit();
    }
    async generateComplianceReport(startDate, endDate) {
        return this.hipaaComplianceService.generateComplianceReport(startDate, endDate);
    }
    async trackRegulationChanges(state) {
        return this.regulationTrackingService.trackRegulationChanges(state);
    }
    async assessImpact(regulationId) {
        return this.regulationTrackingService.assessImpact(regulationId);
    }
    async createConsentForm(studentId, formType, content, expiresAt) {
        return this.consentFormService.createConsentForm(studentId, formType, content, expiresAt);
    }
    async signForm(formId, signedBy, signature, ipAddress, userAgent) {
        return this.consentFormService.signForm(formId, signedBy, signature, ipAddress, userAgent);
    }
    async verifySignature(formId, signature) {
        return this.consentFormService.verifySignature(formId, signature);
    }
    async revokeConsent(formId, revokedBy, reason) {
        return this.consentFormService.revokeConsent(formId, revokedBy, reason);
    }
    async checkFormsExpiringSoon(days = 30) {
        return this.consentFormService.checkFormsExpiringSoon(days);
    }
    async renewConsentForm(formId, extendedBy, additionalYears = 1) {
        return this.consentFormService.renewConsentForm(formId, extendedBy, additionalYears);
    }
    async getConsentFormsByStudent(studentId, status) {
        return this.consentFormService.getConsentFormsByStudent(studentId, status);
    }
    async getConsentFormHistory(formId) {
        return this.consentFormService.getConsentFormHistory(formId);
    }
    async sendReminderForUnsignedForms() {
        return this.consentFormService.sendReminderForUnsignedForms();
    }
    async generateConsentFormTemplate(formType, studentId) {
        return this.consentFormService.generateConsentFormTemplate(formType, studentId);
    }
    async createTemplate(data) {
        return this.messageTemplateService.createMessageTemplate(data.name, data.category, data.subject, data.body, data.variables, data.language, data.createdBy);
    }
    async renderTemplate(templateId, variables) {
        return this.messageTemplateService.renderMessageTemplate(templateId, variables);
    }
    async getTemplatesByCategory(category) {
        return this.messageTemplateService.getMessageTemplatesByCategory(category);
    }
    async sendBulkMessage(data) {
        return this.bulkMessagingService.sendBulkMessage(data.subject, data.body, data.recipients, data.channels);
    }
    async trackDelivery(messageId) {
        return this.bulkMessagingService.getDeliveryStats(messageId);
    }
    async translateMessage(text, targetLanguage) {
        return this.translationService.translateText(text, targetLanguage);
    }
    async detectLanguage(text) {
        return this.translationService.detectLanguage(text);
    }
    async translateBulkMessages(messages, targetLanguage) {
        return this.translationService.translateBulk(messages, targetLanguage);
    }
    async createReportDefinition(data) {
        return this.reportBuilderService.createReport(data);
    }
    async executeReport(reportId) {
        return this.reportBuilderService.executeReport(reportId);
    }
    async exportReport(reportId, format) {
        return this.reportBuilderService.exportReport(reportId, format);
    }
    async getRealtimeMetrics() {
        return this.analyticsService.getRealtimeMetrics();
    }
    async getHealthTrends(period) {
        return this.analyticsService.getHealthTrends(period);
    }
};
exports.EnterpriseFeaturesService = EnterpriseFeaturesService;
exports.EnterpriseFeaturesService = EnterpriseFeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [waitlist_management_service_1.WaitlistManagementService,
        recurring_appointments_service_1.RecurringAppointmentsService,
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
        analytics_dashboard_service_1.AnalyticsDashboardService])
], EnterpriseFeaturesService);
//# sourceMappingURL=enterprise-features.service.js.map