import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnterpriseFeaturesService } from './enterprise-features.service';
import {
  AddToWaitlistDto,
  AutoFillFromWaitlistDto,
  BulkMessageResponseDto,
  CaptureStatementDto,
  ConsentFormResponseDto,
  CreateConsentFormDto,
  CreateMessageTemplateDto,
  CreateRecurringTemplateDto,
  CreateReportDefinitionDto,
  CustomizeReminderPreferencesDto,
  DashboardMetricResponseDto,
  DeleteEvidenceDto,
  DetectLanguageDto,
  EvidenceFileResponseDto,
  GenerateClaimDto,
  GenerateComplianceReportDto,
  HIPAAComplianceCheckResponseDto,
  InsuranceClaimResponseDto,
  MessageTemplateResponseDto,
  RecurringTemplateResponseDto,
  RegulationUpdateResponseDto,
  ReminderScheduleResponseDto,
  RenderTemplateDto,
  RenewConsentFormDto,
  ReportDefinitionResponseDto,
  RevokeConsentDto,
  ScheduleRemindersDto,
  SendBulkMessageDto,
  SignFormDto,
  TranscribeVoiceStatementDto,
  TranslateBulkMessagesDto,
  TranslateMessageDto,
  UploadEvidenceDto,
  VerifySignatureDto,
  VerifyStatementDto,
  WaitlistEntryResponseDto,
  WitnessStatementResponseDto,
} from './dto';

@ApiTags('Enterprise Features')
@Controller('enterprise-features')
@ApiBearerAuth()
export class EnterpriseFeaturesController {
  constructor(
    private readonly enterpriseFeaturesService: EnterpriseFeaturesService,
  ) {}

  // ============================================
  // Feature 17: Intelligent Waitlist Management
  // ============================================

  @Post('waitlist')
  @ApiOperation({
    summary: 'Add student to waitlist',
    description:
      'Adds a student to the intelligent waitlist system with priority scoring based on medical urgency and appointment type.',
  })
  @ApiBody({ type: AddToWaitlistDto })
  @ApiResponse({
    status: 201,
    description: 'Student added to waitlist successfully',
    type: WaitlistEntryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async addToWaitlist(@Body() dto: AddToWaitlistDto) {
    return this.enterpriseFeaturesService.addToWaitlist(
      dto.studentId,
      dto.appointmentType,
      dto.priority,
    );
  }

  @Post('waitlist/auto-fill')
  @ApiOperation({ summary: 'Auto-fill appointment from waitlist' })
  @ApiResponse({
    status: 200,
    description: 'Appointment auto-filled from waitlist',
  })
  async autoFillFromWaitlist(@Body() dto: AutoFillFromWaitlistDto) {
    return this.enterpriseFeaturesService.autoFillFromWaitlist(
      new Date(dto.appointmentSlot),
      dto.appointmentType,
    );
  }

  @Get('waitlist')
  @ApiOperation({ summary: 'Get waitlist by priority' })
  @ApiResponse({
    status: 200,
    description: 'Waitlist retrieved by priority',
    type: [WaitlistEntryResponseDto],
  })
  async getWaitlistByPriority() {
    return this.enterpriseFeaturesService.getWaitlistByPriority();
  }

  @Get('waitlist/:studentId')
  @ApiOperation({ summary: 'Get waitlist status for student' })
  @ApiResponse({ status: 200, description: 'Waitlist status retrieved' })
  async getWaitlistStatus(@Param('studentId') studentId: string) {
    return this.enterpriseFeaturesService.getWaitlistStatus(studentId);
  }

  // ============================================
  // Feature 18: Recurring Appointment Templates
  // ============================================

  @Post('recurring-appointments')
  @ApiOperation({ summary: 'Create recurring appointment template' })
  @ApiResponse({
    status: 201,
    description: 'Recurring template created',
    type: RecurringTemplateResponseDto,
  })
  async createRecurringTemplate(@Body() dto: CreateRecurringTemplateDto) {
    return this.enterpriseFeaturesService.createRecurringTemplate({
      studentId: dto.studentId,
      appointmentType: dto.appointmentType,
      frequency: dto.frequency,
      dayOfWeek: dto.dayOfWeek,
      timeOfDay: dto.timeOfDay,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdBy: dto.createdBy,
    });
  }

  @Delete('recurring-appointments/:templateId')
  @ApiOperation({ summary: 'Cancel recurring appointment series' })
  @ApiResponse({
    status: 200,
    description: 'Recurring series cancelled successfully',
  })
  @HttpCode(HttpStatus.OK)
  async cancelRecurringSeries(@Param('templateId') templateId: string) {
    return this.enterpriseFeaturesService.cancelRecurringSeries(templateId);
  }

  // ============================================
  // Feature 19: Appointment Reminder Automation
  // ============================================

  @Post('reminders/schedule')
  @ApiOperation({ summary: 'Schedule reminders for appointment' })
  @ApiResponse({
    status: 201,
    description: 'Reminders scheduled',
    type: ReminderScheduleResponseDto,
  })
  async scheduleReminders(@Body() dto: ScheduleRemindersDto) {
    return this.enterpriseFeaturesService.scheduleReminders(dto.appointmentId);
  }

  @Post('reminders/send-due')
  @ApiOperation({ summary: 'Send all due reminders' })
  @ApiResponse({ status: 200, description: 'Due reminders sent' })
  async sendDueReminders() {
    return this.enterpriseFeaturesService.sendDueReminders();
  }

  @Put('reminders/preferences/:studentId')
  @ApiOperation({ summary: 'Customize reminder preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async customizeReminderPreferences(
    @Param('studentId') studentId: string,
    @Body() dto: CustomizeReminderPreferencesDto,
  ) {
    return this.enterpriseFeaturesService.customizeReminderPreferences(
      studentId,
      dto.preferences,
    );
  }

  // ============================================
  // Feature 20: Photo/Video Evidence Management
  // ============================================

  @Post('evidence')
  @ApiOperation({ summary: 'Upload evidence file' })
  @ApiResponse({
    status: 201,
    description: 'Evidence uploaded',
    type: EvidenceFileResponseDto,
  })
  async uploadEvidence(@Body() dto: UploadEvidenceDto) {
    return this.enterpriseFeaturesService.uploadEvidence(
      dto.incidentId,
      dto.fileData,
      dto.type,
      dto.uploadedBy,
    );
  }

  @Get('evidence/:evidenceId')
  @ApiOperation({ summary: 'Get evidence with audit trail' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved' })
  async getEvidenceWithAudit(
    @Param('evidenceId') evidenceId: string,
    @Query('accessedBy') accessedBy: string,
  ) {
    return this.enterpriseFeaturesService.getEvidenceWithAudit(
      evidenceId,
      accessedBy,
    );
  }

  @Delete('evidence/:evidenceId')
  @ApiOperation({ summary: 'Delete evidence file' })
  @ApiResponse({ status: 200, description: 'Evidence deleted' })
  @HttpCode(HttpStatus.OK)
  async deleteEvidence(
    @Param('evidenceId') evidenceId: string,
    @Body() dto: DeleteEvidenceDto,
  ) {
    return this.enterpriseFeaturesService.deleteEvidence(
      evidenceId,
      dto.deletedBy,
      dto.reason,
    );
  }

  // ============================================
  // Feature 21: Witness Statement Digital Capture
  // ============================================

  @Post('witness-statements')
  @ApiOperation({ summary: 'Capture witness statement' })
  @ApiResponse({
    status: 201,
    description: 'Statement captured',
    type: WitnessStatementResponseDto,
  })
  async captureStatement(@Body() dto: CaptureStatementDto) {
    return this.enterpriseFeaturesService.captureStatement({
      incidentId: dto.incidentId,
      witnessName: dto.witnessName,
      witnessRole: dto.witnessRole,
      statement: dto.statement,
      captureMethod: dto.captureMethod,
      signature: dto.signature,
    });
  }

  @Put('witness-statements/:statementId/verify')
  @ApiOperation({ summary: 'Verify witness statement' })
  @ApiResponse({ status: 200, description: 'Statement verified' })
  async verifyStatement(
    @Param('statementId') statementId: string,
    @Body() dto: VerifyStatementDto,
  ) {
    return this.enterpriseFeaturesService.verifyStatement(
      statementId,
      dto.verifiedBy,
    );
  }

  @Post('witness-statements/transcribe')
  @ApiOperation({ summary: 'Transcribe voice statement' })
  @ApiResponse({ status: 200, description: 'Audio transcribed' })
  async transcribeVoiceStatement(@Body() dto: TranscribeVoiceStatementDto) {
    return this.enterpriseFeaturesService.transcribeVoiceStatement(
      dto.audioData,
    );
  }

  // ============================================
  // Feature 22: Insurance Claim Export
  // ============================================

  @Post('insurance-claims')
  @ApiOperation({ summary: 'Generate insurance claim' })
  @ApiResponse({
    status: 201,
    description: 'Claim generated',
    type: InsuranceClaimResponseDto,
  })
  async generateClaim(@Body() dto: GenerateClaimDto) {
    return this.enterpriseFeaturesService.generateClaim(
      dto.incidentId,
      dto.studentId,
    );
  }

  @Get('insurance-claims/:claimId/export')
  @ApiOperation({ summary: 'Export insurance claim' })
  @ApiResponse({ status: 200, description: 'Claim exported' })
  async exportClaimToFormat(
    @Param('claimId') claimId: string,
    @Query('format') format: 'pdf' | 'xml' | 'edi',
  ) {
    return this.enterpriseFeaturesService.exportClaimToFormat(claimId, format);
  }

  @Post('insurance-claims/:claimId/submit')
  @ApiOperation({ summary: 'Submit insurance claim electronically' })
  @ApiResponse({ status: 200, description: 'Claim submitted' })
  async submitClaimElectronically(@Param('claimId') claimId: string) {
    return this.enterpriseFeaturesService.submitClaimElectronically(claimId);
  }

  // ============================================
  // Feature 23: HIPAA Compliance Auditing
  // ============================================

  @Get('compliance/audit')
  @ApiOperation({ summary: 'Perform HIPAA compliance audit' })
  @ApiResponse({
    status: 200,
    description: 'Compliance audit completed',
    type: [HIPAAComplianceCheckResponseDto],
  })
  async performComplianceAudit() {
    return this.enterpriseFeaturesService.performComplianceAudit();
  }

  @Get('compliance/report')
  @ApiOperation({ summary: 'Generate compliance report' })
  @ApiResponse({ status: 200, description: 'Compliance report generated' })
  async generateComplianceReport(@Query() dto: GenerateComplianceReportDto) {
    return this.enterpriseFeaturesService.generateComplianceReport(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
  }

  // ============================================
  // Feature 24: State Regulation Change Tracking
  // ============================================

  @Get('regulations/:state')
  @ApiOperation({ summary: 'Track regulation changes for state' })
  @ApiResponse({
    status: 200,
    description: 'Regulation changes retrieved',
    type: [RegulationUpdateResponseDto],
  })
  async trackRegulationChanges(@Param('state') state: string) {
    return this.enterpriseFeaturesService.trackRegulationChanges(state);
  }

  @Get('regulations/:regulationId/impact')
  @ApiOperation({ summary: 'Assess regulation impact' })
  @ApiResponse({ status: 200, description: 'Impact assessment completed' })
  async assessImpact(@Param('regulationId') regulationId: string) {
    return this.enterpriseFeaturesService.assessImpact(regulationId);
  }

  // ============================================
  // Feature 25: Digital Consent Form Management
  // ============================================

  @Post('consent-forms')
  @ApiOperation({ summary: 'Create consent form' })
  @ApiResponse({
    status: 201,
    description: 'Consent form created',
    type: ConsentFormResponseDto,
  })
  async createConsentForm(@Body() dto: CreateConsentFormDto) {
    return this.enterpriseFeaturesService.createConsentForm(
      dto.studentId,
      dto.formType,
      dto.content,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  @Put('consent-forms/:formId/sign')
  @ApiOperation({ summary: 'Sign consent form' })
  @ApiResponse({ status: 200, description: 'Form signed successfully' })
  async signForm(@Param('formId') formId: string, @Body() dto: SignFormDto) {
    return this.enterpriseFeaturesService.signForm(
      formId,
      dto.signedBy,
      dto.signature,
      dto.ipAddress,
      dto.userAgent,
    );
  }

  @Post('consent-forms/:formId/verify')
  @ApiOperation({ summary: 'Verify form signature' })
  @ApiResponse({ status: 200, description: 'Signature verified' })
  async verifySignature(
    @Param('formId') formId: string,
    @Body() dto: VerifySignatureDto,
  ) {
    return this.enterpriseFeaturesService.verifySignature(
      formId,
      dto.signature,
    );
  }

  @Delete('consent-forms/:formId/revoke')
  @ApiOperation({ summary: 'Revoke consent' })
  @ApiResponse({ status: 200, description: 'Consent revoked' })
  @HttpCode(HttpStatus.OK)
  async revokeConsent(
    @Param('formId') formId: string,
    @Body() dto: RevokeConsentDto,
  ) {
    return this.enterpriseFeaturesService.revokeConsent(
      formId,
      dto.revokedBy,
      dto.reason,
    );
  }

  @Post('consent-forms/:formId/renew')
  @ApiOperation({ summary: 'Renew consent form' })
  @ApiResponse({ status: 200, description: 'Form renewed' })
  async renewConsentForm(
    @Param('formId') formId: string,
    @Body() dto: RenewConsentFormDto,
  ) {
    return this.enterpriseFeaturesService.renewConsentForm(
      formId,
      dto.extendedBy,
      dto.additionalYears,
    );
  }

  @Get('consent-forms/student/:studentId')
  @ApiOperation({ summary: 'Get consent forms for student' })
  @ApiResponse({
    status: 200,
    description: 'Consent forms retrieved',
    type: [ConsentFormResponseDto],
  })
  async getConsentFormsByStudent(
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    return this.enterpriseFeaturesService.getConsentFormsByStudent(
      studentId,
      status,
    );
  }

  @Get('consent-forms/:formId/history')
  @ApiOperation({ summary: 'Get consent form history' })
  @ApiResponse({ status: 200, description: 'Form history retrieved' })
  async getConsentFormHistory(@Param('formId') formId: string) {
    return this.enterpriseFeaturesService.getConsentFormHistory(formId);
  }

  @Post('consent-forms/send-reminders')
  @ApiOperation({ summary: 'Send reminders for unsigned forms' })
  @ApiResponse({ status: 200, description: 'Reminders sent' })
  async sendReminderForUnsignedForms() {
    return this.enterpriseFeaturesService.sendReminderForUnsignedForms();
  }

  @Get('consent-forms/template/:formType/:studentId')
  @ApiOperation({ summary: 'Generate consent form template' })
  @ApiResponse({ status: 200, description: 'Template generated' })
  async generateConsentFormTemplate(
    @Param('formType') formType: string,
    @Param('studentId') studentId: string,
  ) {
    return this.enterpriseFeaturesService.generateConsentFormTemplate(
      formType,
      studentId,
    );
  }

  @Get('consent-forms/expiring')
  @ApiOperation({ summary: 'Check forms expiring soon' })
  @ApiResponse({
    status: 200,
    description: 'Expiring forms retrieved',
    type: [ConsentFormResponseDto],
  })
  async checkFormsExpiringSoon(@Query('days') days?: number) {
    return this.enterpriseFeaturesService.checkFormsExpiringSoon(
      days ? parseInt(days.toString()) : 30,
    );
  }

  // ============================================
  // Feature 26: Message Template Library
  // ============================================

  @Post('message-templates')
  @ApiOperation({ summary: 'Create message template' })
  @ApiResponse({
    status: 201,
    description: 'Template created',
    type: MessageTemplateResponseDto,
  })
  async createTemplate(@Body() dto: CreateMessageTemplateDto) {
    return this.enterpriseFeaturesService.createTemplate({
      name: dto.name,
      category: dto.category,
      subject: dto.subject,
      body: dto.body,
      variables: dto.variables,
      language: dto.language,
      createdBy: dto.createdBy,
    });
  }

  @Post('message-templates/:templateId/render')
  @ApiOperation({ summary: 'Render message template' })
  @ApiResponse({ status: 200, description: 'Template rendered' })
  async renderTemplate(
    @Param('templateId') templateId: string,
    @Body() dto: RenderTemplateDto,
  ) {
    return this.enterpriseFeaturesService.renderTemplate(
      templateId,
      dto.variables,
    );
  }

  @Get('message-templates/category/:category')
  @ApiOperation({ summary: 'Get templates by category' })
  @ApiResponse({
    status: 200,
    description: 'Templates retrieved',
    type: [MessageTemplateResponseDto],
  })
  async getTemplatesByCategory(@Param('category') category: string) {
    return this.enterpriseFeaturesService.getTemplatesByCategory(category);
  }

  // ============================================
  // Feature 27: Bulk Messaging with Delivery Tracking
  // ============================================

  @Post('bulk-messages')
  @ApiOperation({ summary: 'Send bulk message' })
  @ApiResponse({
    status: 201,
    description: 'Bulk message sent',
    type: BulkMessageResponseDto,
  })
  async sendBulkMessage(@Body() dto: SendBulkMessageDto) {
    return this.enterpriseFeaturesService.sendBulkMessage({
      subject: dto.subject,
      body: dto.body,
      recipients: dto.recipients,
      channels: dto.channels,
    });
  }

  @Get('bulk-messages/:messageId/tracking')
  @ApiOperation({ summary: 'Track bulk message delivery' })
  @ApiResponse({ status: 200, description: 'Delivery stats retrieved' })
  async trackDelivery(@Param('messageId') messageId: string) {
    return this.enterpriseFeaturesService.trackDelivery(messageId);
  }

  // ============================================
  // Feature 28: Language Translation for Communications
  // ============================================

  @Post('translate')
  @ApiOperation({ summary: 'Translate message' })
  @ApiResponse({ status: 200, description: 'Message translated' })
  async translateMessage(@Body() dto: TranslateMessageDto) {
    return this.enterpriseFeaturesService.translateMessage(
      dto.text,
      dto.targetLanguage,
    );
  }

  @Post('translate/detect')
  @ApiOperation({ summary: 'Detect language of text' })
  @ApiResponse({ status: 200, description: 'Language detected' })
  async detectLanguage(@Body() dto: DetectLanguageDto) {
    return this.enterpriseFeaturesService.detectLanguage(dto.text);
  }

  @Post('translate/bulk')
  @ApiOperation({ summary: 'Translate bulk messages' })
  @ApiResponse({ status: 200, description: 'Messages translated' })
  async translateBulkMessages(@Body() dto: TranslateBulkMessagesDto) {
    return this.enterpriseFeaturesService.translateBulkMessages(
      dto.messages,
      dto.targetLanguage,
    );
  }

  // ============================================
  // Feature 29: Custom Report Builder
  // ============================================

  @Post('custom-reports')
  @ApiOperation({ summary: 'Create custom report definition' })
  @ApiResponse({
    status: 201,
    description: 'Report definition created',
    type: ReportDefinitionResponseDto,
  })
  async createReportDefinition(@Body() dto: CreateReportDefinitionDto) {
    return this.enterpriseFeaturesService.createReportDefinition({
      name: dto.name,
      dataSource: dto.dataSource,
      fields: dto.fields,
      filters: dto.filters,
      grouping: dto.grouping,
      sorting: dto.sorting,
      visualization: dto.visualization,
      schedule: dto.schedule,
    });
  }

  @Post('custom-reports/:reportId/execute')
  @ApiOperation({ summary: 'Execute custom report' })
  @ApiResponse({ status: 200, description: 'Report executed' })
  async executeReport(@Param('reportId') reportId: string) {
    return this.enterpriseFeaturesService.executeReport(reportId);
  }

  @Get('custom-reports/:reportId/export')
  @ApiOperation({ summary: 'Export custom report' })
  @ApiResponse({ status: 200, description: 'Report exported' })
  async exportReport(
    @Param('reportId') reportId: string,
    @Query('format') format: 'pdf' | 'excel' | 'csv',
  ) {
    return this.enterpriseFeaturesService.exportReport(reportId, format);
  }

  // ============================================
  // Feature 30: Real-time Analytics Dashboard
  // ============================================

  @Get('analytics/metrics')
  @ApiOperation({ summary: 'Get real-time dashboard metrics' })
  @ApiResponse({
    status: 200,
    description: 'Metrics retrieved',
    type: [DashboardMetricResponseDto],
  })
  async getRealtimeMetrics() {
    return this.enterpriseFeaturesService.getRealtimeMetrics();
  }

  @Get('analytics/trends')
  @ApiOperation({ summary: 'Get health trends' })
  @ApiResponse({ status: 200, description: 'Trends retrieved' })
  async getHealthTrends(@Query('period') period: 'day' | 'week' | 'month') {
    return this.enterpriseFeaturesService.getHealthTrends(period);
  }
}
