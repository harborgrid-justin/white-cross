import { Injectable, Logger } from '@nestjs/common';
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
import { BaseService } from '@/common/base';
import {
  WaitlistEntry,
  RecurringTemplate,
  ReminderSchedule,
  ReminderPreferences,
  EvidenceFile,
  WitnessStatement,
  InsuranceClaim,
  HIPAAComplianceCheck,
  RegulationUpdate,
  ConsentForm,
  MessageTemplate,
  BulkMessage,
  ReportDefinition,
  DashboardMetric,
  HealthTrendData,
} from './enterprise-features-interfaces';

/**
 * Enterprise Features Service - Main Facade
 * Delegates operations to specialized services for better organization
 * Maintains backward compatibility with existing API
 */
@Injectable()
export class EnterpriseFeaturesService extends BaseService {
  constructor(
    private readonly waitlistService: WaitlistManagementService,
    private readonly recurringAppointmentsService: RecurringAppointmentsService,
    private readonly reminderService: ReminderSchedulerService,
    private readonly evidenceService: PhotoVideoEvidenceService,
    private readonly witnessStatementService: WitnessStatementService,
    private readonly insuranceClaimService: InsuranceClaimService,
    private readonly hipaaComplianceService: HipaaComplianceService,
    private readonly regulationTrackingService: RegulationTrackingService,
    private readonly consentFormService: ConsentFormManagementService,
    private readonly messageTemplateService: MessageTemplateLibraryService,
    private readonly bulkMessagingService: BulkMessagingService,
    private readonly translationService: LanguageTranslationService,
    private readonly reportBuilderService: CustomReportBuilderService,
    private readonly analyticsService: AnalyticsDashboardService,
  ) {
    this.logInfo('Enterprise Features Service initialized with all specialized services');
  }

  // ============================================
  // Feature 17: Intelligent Waitlist Management
  // ============================================

  async addToWaitlist(
    studentId: string,
    appointmentType: string,
    priority: 'routine' | 'urgent' = 'routine',
  ): Promise<WaitlistEntry> {
    return this.waitlistService.addToWaitlist(studentId, appointmentType, priority);
  }

  async autoFillFromWaitlist(appointmentSlot: Date, appointmentType: string): Promise<boolean> {
    return this.waitlistService.autoFillFromWaitlist(appointmentSlot, appointmentType);
  }

  async getWaitlistByPriority(): Promise<{ high: WaitlistEntry[]; routine: WaitlistEntry[]; totalCount: number }> {
    return this.waitlistService.getWaitlistByPriority();
  }

  async getWaitlistStatus(studentId: string): Promise<{ waitlists: WaitlistEntry[] }> {
    return this.waitlistService.getWaitlistStatus(studentId);
  }

  // ============================================
  // Feature 18: Recurring Appointment Templates
  // ============================================

  async createRecurringTemplate(data: Omit<RecurringTemplate, 'id'>): Promise<RecurringTemplate> {
    return this.recurringAppointmentsService.createRecurringTemplate(data);
  }

  private async generateAppointmentsFromTemplate(template: RecurringTemplate): Promise<void> {
    return this.recurringAppointmentsService.generateAppointmentsFromTemplate(template.id);
  }

  async cancelRecurringSeries(templateId: string): Promise<boolean> {
    return this.recurringAppointmentsService.cancelRecurringSeries(templateId, 'system', 'API cancellation');
  }

  // ============================================
  // Feature 19: Appointment Reminder Automation
  // ============================================

  async scheduleReminders(appointmentId: string): Promise<ReminderSchedule> {
    return this.reminderService.scheduleReminders(appointmentId);
  }

  async sendDueReminders(): Promise<number> {
    return this.reminderService.sendDueReminders();
  }

  async customizeReminderPreferences(studentId: string, preferences: ReminderPreferences): Promise<boolean> {
    return this.reminderService.updatePreferences(studentId, preferences);
  }

  // ============================================
  // Feature 20: Photo/Video Evidence Management
  // ============================================

  async uploadEvidence(
    incidentId: string,
    fileData: string,
    type: 'photo' | 'video',
    uploadedBy: string,
  ): Promise<EvidenceFile> {
    return this.evidenceService.uploadEvidence(incidentId, fileData, type, uploadedBy);
  }

  async getEvidenceWithAudit(evidenceId: string, accessedBy: string): Promise<EvidenceFile | null> {
    return this.evidenceService.getEvidenceWithAudit(evidenceId, accessedBy);
  }

  async deleteEvidence(evidenceId: string, deletedBy: string, reason: string): Promise<boolean> {
    return this.evidenceService.deleteEvidence(evidenceId, deletedBy, reason);
  }

  // ============================================
  // Feature 21: Witness Statement Digital Capture
  // ============================================

  async captureStatement(
    data: Omit<WitnessStatement, 'id' | 'timestamp' | 'verified'>,
  ): Promise<WitnessStatement> {
    return this.witnessStatementService.captureStatement(data);
  }

  async verifyStatement(statementId: string, verifiedBy: string): Promise<boolean> {
    return this.witnessStatementService.verifyStatement(statementId, verifiedBy);
  }

  async transcribeVoiceStatement(audioData: string): Promise<string> {
    return this.witnessStatementService.transcribeVoiceStatement(audioData);
  }

  // ============================================
  // Feature 22: Insurance Claim Export
  // ============================================

  async generateClaim(incidentId: string, studentId: string): Promise<InsuranceClaim> {
    return this.insuranceClaimService.createClaim(incidentId, studentId);
  }

  async exportClaimToFormat(claimId: string, format: 'pdf' | 'xml' | 'edi'): Promise<string> {
    return this.insuranceClaimService.exportClaim(claimId, format);
  }

  async submitClaimElectronically(claimId: string): Promise<boolean> {
    return this.insuranceClaimService.submitClaimElectronically(claimId);
  }

  // ============================================
  // Feature 23: HIPAA Compliance Auditing
  // ============================================

  async performComplianceAudit(): Promise<HIPAAComplianceCheck[]> {
    return this.hipaaComplianceService.performComplianceAudit();
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<{
    period: { startDate: Date; endDate: Date };
    overallStatus: string;
    checks: HIPAAComplianceCheck[];
  }> {
    return this.hipaaComplianceService.generateComplianceReport(startDate, endDate);
  }

  // ============================================
  // Feature 24: State Regulation Change Tracking
  // ============================================

  async trackRegulationChanges(state: string): Promise<RegulationUpdate[]> {
    return this.regulationTrackingService.trackRegulationChanges(state);
  }

  async assessImpact(regulationId: string): Promise<string[]> {
    return this.regulationTrackingService.assessImpact(regulationId);
  }

  // ============================================
  // Feature 25: Digital Consent Form Management
  // ============================================

  async createConsentForm(
    studentId: string,
    formType: string,
    content: string,
    expiresAt?: Date,
  ): Promise<ConsentForm> {
    return this.consentFormService.createConsentForm(studentId, formType, content, expiresAt);
  }

  async signForm(
    formId: string,
    signedBy: string,
    signature: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    return this.consentFormService.signForm(formId, signedBy, signature, ipAddress, userAgent);
  }

  async verifySignature(formId: string, signature: string): Promise<boolean> {
    return this.consentFormService.verifySignature(formId, signature);
  }

  async revokeConsent(formId: string, revokedBy: string, reason: string): Promise<boolean> {
    return this.consentFormService.revokeConsent(formId, revokedBy, reason);
  }

  async checkFormsExpiringSoon(days: number = 30): Promise<ConsentForm[]> {
    return this.consentFormService.checkFormsExpiringSoon(days);
  }

  async renewConsentForm(
    formId: string,
    extendedBy: string,
    additionalYears: number = 1,
  ): Promise<ConsentForm | null> {
    return this.consentFormService.renewConsentForm(formId, extendedBy, additionalYears);
  }

  async getConsentFormsByStudent(studentId: string, status?: string): Promise<ConsentForm[]> {
    return this.consentFormService.getConsentFormsByStudent(studentId, status);
  }

  async getConsentFormHistory(formId: string): Promise<Array<Record<string, unknown>>> {
    return this.consentFormService.getConsentFormHistory(formId);
  }

  async sendReminderForUnsignedForms(): Promise<number> {
    return this.consentFormService.sendReminderForUnsignedForms();
  }

  async generateConsentFormTemplate(
    formType: string,
    studentId: string,
  ): Promise<{ html: string; variables: Record<string, string> }> {
    return this.consentFormService.generateConsentFormTemplate(formType, studentId);
  }

  // ============================================
  // Feature 26: Message Template Library
  // ============================================

  async createTemplate(data: Omit<MessageTemplate, 'id' | 'createdAt'>): Promise<MessageTemplate> {
    return this.messageTemplateService.createMessageTemplate(
      data.name,
      data.category,
      data.subject,
      data.body,
      data.variables,
      data.language,
      data.createdBy,
    );
  }

  async renderTemplate(templateId: string, variables: Record<string, string>): Promise<string> {
    return this.messageTemplateService.renderMessageTemplate(templateId, variables);
  }

  async getTemplatesByCategory(category: string): Promise<MessageTemplate[]> {
    return this.messageTemplateService.getMessageTemplatesByCategory(category);
  }

  // ============================================
  // Feature 27: Bulk Messaging with Delivery Tracking
  // ============================================

  async sendBulkMessage(
    data: Omit<BulkMessage, 'id' | 'status' | 'deliveryStats'>,
  ): Promise<BulkMessage> {
    return this.bulkMessagingService.sendBulkMessage(data.subject, data.body, data.recipients, data.channels);
  }

  async trackDelivery(messageId: string): Promise<{ delivered: number; failed: number; opened: number }> {
    return this.bulkMessagingService.getDeliveryStats(messageId);
  }

  // ============================================
  // Feature 28: Language Translation for Communications
  // ============================================

  async translateMessage(text: string, targetLanguage: string): Promise<string> {
    return this.translationService.translateText(text, targetLanguage);
  }

  async detectLanguage(text: string): Promise<string> {
    return this.translationService.detectLanguage(text);
  }

  async translateBulkMessages(messages: string[], targetLanguage: string): Promise<string[]> {
    return this.translationService.translateBulk(messages, targetLanguage);
  }

  // ============================================
  // Feature 29: Custom Report Builder
  // ============================================

  async createReportDefinition(data: Omit<ReportDefinition, 'id'>): Promise<ReportDefinition> {
    return this.reportBuilderService.createReport(data);
  }

  async executeReport(reportId: string): Promise<{ data: Record<string, unknown>[]; metadata: Record<string, unknown> }> {
    return this.reportBuilderService.executeReport(reportId);
  }

  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<string> {
    return this.reportBuilderService.exportReport(reportId, format);
  }

  // ============================================
  // Feature 30: Real-time Analytics Dashboard
  // ============================================

  async getRealtimeMetrics(): Promise<DashboardMetric[]> {
    return this.analyticsService.getRealtimeMetrics();
  }

  async getHealthTrends(period: 'day' | 'week' | 'month'): Promise<HealthTrendData> {
    return this.analyticsService.getHealthTrends(period);
  }
}
