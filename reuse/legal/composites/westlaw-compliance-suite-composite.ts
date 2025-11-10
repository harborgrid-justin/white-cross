/**
 * LOC: WLCS1234567
 * File: /reuse/legal/composites/westlaw-compliance-suite-composite.ts
 *
 * UPSTREAM (imports from):
 *   - reuse/legal/regulatory-compliance-kit.ts
 *   - reuse/legal/legal-ethics-compliance-kit.ts
 *   - reuse/legal/legal-hold-preservation-kit.ts
 *   - reuse/legal/privilege-review-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Westlaw compliance services
 *   - Regulatory compliance platforms
 *   - Legal ethics systems
 */

/**
 * File: /reuse/legal/composites/westlaw-compliance-suite-composite.ts
 * Locator: WC-CMP-WLCS-001
 * Purpose: Westlaw Compliance Suite Composite - Regulatory compliance, ethics, legal holds, and privilege review
 *
 * Upstream: Composes regulatory-compliance-kit, legal-ethics-compliance-kit, legal-hold-preservation-kit, privilege-review-kit
 * Downstream: Westlaw backend services, Compliance management APIs, Ethics tracking systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod
 * Exports: 50 composed functions for comprehensive compliance management
 *
 * LLM Context: Production-ready Westlaw compliance suite composite providing comprehensive regulatory compliance,
 * legal ethics tracking, legal hold management, and privilege review capabilities. Integrates multiple compliance-
 * focused kits into a unified service layer with proper NestJS dependency injection, configuration management,
 * and error handling. Essential for enterprise legal compliance platforms.
 */

import { Injectable, Logger, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

// Import from regulatory-compliance-kit
import {
  RegulationMetadataSchema,
  ComplianceRuleSchema,
  ComplianceAuditSchema,
  RegulatoryChangeSchema,
  defineRegulationModel,
  defineComplianceRuleModel,
  defineComplianceAuditModel,
  defineRegulatoryChangeModel,
  defineJurisdictionRequirementModel,
  RegulatoryComplianceService,
} from '../regulatory-compliance-kit';

// Import from legal-ethics-compliance-kit
import {
  EthicsRuleSchema,
  EthicsViolationSchema,
  ConflictCheckSchema,
  FeeArrangementSchema,
  ConfidentialityRecordSchema,
  EthicsRuleModel,
  EthicsViolationModel,
  ConflictCheckModel,
  RemediationPlanModel,
  FeeArrangementComplianceModel,
  ConfidentialityRecordModel,
  EthicsRuleService,
  EthicsViolationService,
  ConflictOfInterestService,
  ClientConfidentialityService,
  FeeArrangementComplianceService,
  ProfessionalConductService,
  LegalEthicsComplianceModule,
  legalEthicsConfig,
  generateEthicsComplianceHash,
} from '../legal-ethics-compliance-kit';

// Import from legal-hold-preservation-kit
import {
  createLegalHoldModel,
  createHoldCustodianModel,
  createHoldDataSourceModel,
  createLegalHoldAuditLogModel,
  createLegalHoldNotice,
  updateLegalHoldNotice,
  validateLegalHoldNotice,
  activateLegalHold,
  getActiveLegalHolds,
  addCustodiansToHold,
  recordCustodianAcknowledgment,
  sendCustodianReminders,
  getPendingAcknowledgments,
  processCustodianExemption,
  identifyDataSources,
  updateDataSourceStatus,
  getDataSourcesByCustodian,
  estimatePreservationVolume,
  markDataSourceFailed,
  definePreservationScope,
} from '../legal-hold-preservation-kit';

// Import from privilege-review-kit
import {
  PrivilegeTagSchema,
  PrivilegeLogEntrySchema,
  ClawbackRequestSchema,
  PrivilegeAssertionSchema,
  QualityControlSchema,
  PrivilegeTag,
  PrivilegeLog,
  PrivilegeAssertion,
  ClawbackRequest,
  PrivilegeReviewService,
  ClawbackManagementService,
  PrivilegeLogService,
  PrivilegeReviewModule,
} from '../privilege-review-kit';

/**
 * Westlaw Compliance Suite Service
 * Production-ready NestJS service integrating comprehensive compliance management capabilities
 */
@Injectable()
export class WestlawComplianceSuiteService {
  private readonly logger = new Logger(WestlawComplianceSuiteService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly regulatoryComplianceService: RegulatoryComplianceService,
    private readonly ethicsRuleService: EthicsRuleService,
    private readonly ethicsViolationService: EthicsViolationService,
    private readonly conflictOfInterestService: ConflictOfInterestService,
    private readonly clientConfidentialityService: ClientConfidentialityService,
    private readonly feeArrangementComplianceService: FeeArrangementComplianceService,
    private readonly professionalConductService: ProfessionalConductService,
    private readonly privilegeReviewService: PrivilegeReviewService,
    private readonly clawbackManagementService: ClawbackManagementService,
    private readonly privilegeLogService: PrivilegeLogService,
  ) {
    this.logger.log('WestlawComplianceSuiteService initialized');
  }

  /**
   * Initialize all database models for compliance suite
   */
  async initializeModels(): Promise<void> {
    try {
      // Initialize regulatory compliance models
      defineRegulationModel(this.sequelize);
      defineComplianceRuleModel(this.sequelize);
      defineComplianceAuditModel(this.sequelize);
      defineRegulatoryChangeModel(this.sequelize);
      defineJurisdictionRequirementModel(this.sequelize);

      // Initialize ethics compliance models
      EthicsRuleModel.init(this.sequelize);
      EthicsViolationModel.init(this.sequelize);
      ConflictCheckModel.init(this.sequelize);
      RemediationPlanModel.init(this.sequelize);
      FeeArrangementComplianceModel.init(this.sequelize);
      ConfidentialityRecordModel.init(this.sequelize);

      // Initialize legal hold models
      createLegalHoldModel(this.sequelize);
      createHoldCustodianModel(this.sequelize);
      createHoldDataSourceModel(this.sequelize);
      createLegalHoldAuditLogModel(this.sequelize);

      // Initialize privilege review models
      PrivilegeTag.init(this.sequelize);
      PrivilegeLog.init(this.sequelize);
      PrivilegeAssertion.init(this.sequelize);
      ClawbackRequest.init(this.sequelize);

      this.logger.log('All compliance suite models initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize compliance suite models', error.stack);
      throw error;
    }
  }

  /**
   * Validate regulation metadata
   */
  validateRegulationMetadata(data: unknown): any {
    try {
      return RegulationMetadataSchema.parse(data);
    } catch (error) {
      this.logger.error('Regulation metadata validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate compliance rule
   */
  validateComplianceRule(data: unknown): any {
    try {
      return ComplianceRuleSchema.parse(data);
    } catch (error) {
      this.logger.error('Compliance rule validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate compliance audit
   */
  validateComplianceAudit(data: unknown): any {
    try {
      return ComplianceAuditSchema.parse(data);
    } catch (error) {
      this.logger.error('Compliance audit validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate regulatory change
   */
  validateRegulatoryChange(data: unknown): any {
    try {
      return RegulatoryChangeSchema.parse(data);
    } catch (error) {
      this.logger.error('Regulatory change validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Check regulatory compliance using service
   */
  async checkRegulatoryCompliance(entityId: string, regulationIds: string[]): Promise<any> {
    try {
      return await this.regulatoryComplianceService.checkCompliance(entityId, regulationIds);
    } catch (error) {
      this.logger.error('Failed to check regulatory compliance', error.stack);
      throw error;
    }
  }

  /**
   * Track regulatory changes using service
   */
  async trackRegulatoryChanges(jurisdictions: string[]): Promise<any[]> {
    try {
      return await this.regulatoryComplianceService.trackChanges(jurisdictions);
    } catch (error) {
      this.logger.error('Failed to track regulatory changes', error.stack);
      return [];
    }
  }

  /**
   * Generate compliance report using service
   */
  async generateComplianceReport(entityId: string, reportType: string): Promise<any> {
    try {
      return await this.regulatoryComplianceService.generateReport(entityId, reportType);
    } catch (error) {
      this.logger.error('Failed to generate compliance report', error.stack);
      throw error;
    }
  }

  /**
   * Audit compliance status using service
   */
  async auditComplianceStatus(entityId: string, auditScope: any): Promise<any> {
    try {
      return await this.regulatoryComplianceService.auditCompliance(entityId, auditScope);
    } catch (error) {
      this.logger.error('Failed to audit compliance status', error.stack);
      throw error;
    }
  }

  /**
   * Validate ethics rule
   */
  validateEthicsRule(data: unknown): any {
    try {
      return EthicsRuleSchema.parse(data);
    } catch (error) {
      this.logger.error('Ethics rule validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate ethics violation
   */
  validateEthicsViolation(data: unknown): any {
    try {
      return EthicsViolationSchema.parse(data);
    } catch (error) {
      this.logger.error('Ethics violation validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate conflict check
   */
  validateConflictCheck(data: unknown): any {
    try {
      return ConflictCheckSchema.parse(data);
    } catch (error) {
      this.logger.error('Conflict check validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate fee arrangement
   */
  validateFeeArrangement(data: unknown): any {
    try {
      return FeeArrangementSchema.parse(data);
    } catch (error) {
      this.logger.error('Fee arrangement validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate confidentiality record
   */
  validateConfidentialityRecord(data: unknown): any {
    try {
      return ConfidentialityRecordSchema.parse(data);
    } catch (error) {
      this.logger.error('Confidentiality record validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Get legal ethics configuration
   */
  getLegalEthicsConfig(): any {
    try {
      return legalEthicsConfig();
    } catch (error) {
      this.logger.error('Failed to get legal ethics config', error.stack);
      throw error;
    }
  }

  /**
   * Generate ethics compliance hash
   */
  generateComplianceHash(data: any): string {
    try {
      return generateEthicsComplianceHash(data);
    } catch (error) {
      this.logger.error('Failed to generate ethics compliance hash', error.stack);
      throw error;
    }
  }

  /**
   * Manage ethics rules using service
   */
  async manageEthicsRules(ruleData: any): Promise<any> {
    try {
      return await this.ethicsRuleService.createRule(ruleData);
    } catch (error) {
      this.logger.error('Failed to manage ethics rules', error.stack);
      throw error;
    }
  }

  /**
   * Report ethics violation using service
   */
  async reportEthicsViolation(violationData: any): Promise<any> {
    try {
      return await this.ethicsViolationService.reportViolation(violationData);
    } catch (error) {
      this.logger.error('Failed to report ethics violation', error.stack);
      throw error;
    }
  }

  /**
   * Check conflicts of interest using service
   */
  async checkConflictsOfInterest(checkData: any): Promise<any> {
    try {
      return await this.conflictOfInterestService.performCheck(checkData);
    } catch (error) {
      this.logger.error('Failed to check conflicts of interest', error.stack);
      throw error;
    }
  }

  /**
   * Manage client confidentiality using service
   */
  async manageClientConfidentiality(confidentialityData: any): Promise<any> {
    try {
      return await this.clientConfidentialityService.trackConfidentiality(confidentialityData);
    } catch (error) {
      this.logger.error('Failed to manage client confidentiality', error.stack);
      throw error;
    }
  }

  /**
   * Ensure fee arrangement compliance using service
   */
  async ensureFeeArrangementCompliance(feeData: any): Promise<any> {
    try {
      return await this.feeArrangementComplianceService.validateFeeArrangement(feeData);
    } catch (error) {
      this.logger.error('Failed to ensure fee arrangement compliance', error.stack);
      throw error;
    }
  }

  /**
   * Monitor professional conduct using service
   */
  async monitorProfessionalConduct(attorneyId: string): Promise<any> {
    try {
      return await this.professionalConductService.monitorConduct(attorneyId);
    } catch (error) {
      this.logger.error('Failed to monitor professional conduct', error.stack);
      throw error;
    }
  }

  /**
   * Create legal hold notice
   */
  async createHoldNotice(noticeData: any): Promise<any> {
    try {
      return await createLegalHoldNotice(noticeData);
    } catch (error) {
      this.logger.error('Failed to create legal hold notice', error.stack);
      throw error;
    }
  }

  /**
   * Update legal hold notice
   */
  async updateHoldNotice(holdId: string, updateData: any): Promise<any> {
    try {
      return await updateLegalHoldNotice(holdId, updateData);
    } catch (error) {
      this.logger.error('Failed to update legal hold notice', error.stack);
      throw error;
    }
  }

  /**
   * Validate legal hold notice
   */
  async validateHoldNotice(holdId: string): Promise<any> {
    try {
      return await validateLegalHoldNotice(holdId);
    } catch (error) {
      this.logger.error('Failed to validate legal hold notice', error.stack);
      throw error;
    }
  }

  /**
   * Activate legal hold
   */
  async activateHold(holdId: string): Promise<any> {
    try {
      return await activateLegalHold(holdId);
    } catch (error) {
      this.logger.error('Failed to activate legal hold', error.stack);
      throw error;
    }
  }

  /**
   * Get active legal holds
   */
  async getActiveHolds(): Promise<any[]> {
    try {
      return await getActiveLegalHolds();
    } catch (error) {
      this.logger.error('Failed to get active legal holds', error.stack);
      return [];
    }
  }

  /**
   * Add custodians to hold
   */
  async addCustodians(holdId: string, custodianIds: string[]): Promise<any> {
    try {
      return await addCustodiansToHold(holdId, custodianIds);
    } catch (error) {
      this.logger.error('Failed to add custodians to hold', error.stack);
      throw error;
    }
  }

  /**
   * Record custodian acknowledgment
   */
  async recordAcknowledgment(holdId: string, custodianId: string, acknowledgmentData: any): Promise<any> {
    try {
      return await recordCustodianAcknowledgment(holdId, custodianId, acknowledgmentData);
    } catch (error) {
      this.logger.error('Failed to record custodian acknowledgment', error.stack);
      throw error;
    }
  }

  /**
   * Send custodian reminders
   */
  async sendReminders(holdId: string): Promise<any> {
    try {
      return await sendCustodianReminders(holdId);
    } catch (error) {
      this.logger.error('Failed to send custodian reminders', error.stack);
      throw error;
    }
  }

  /**
   * Get pending acknowledgments
   */
  async getPendingAcknowledgmentsForHold(holdId: string): Promise<any[]> {
    try {
      return await getPendingAcknowledgments(holdId);
    } catch (error) {
      this.logger.error('Failed to get pending acknowledgments', error.stack);
      return [];
    }
  }

  /**
   * Process custodian exemption
   */
  async processCustodianExemptionRequest(holdId: string, custodianId: string, exemptionData: any): Promise<any> {
    try {
      return await processCustodianExemption(holdId, custodianId, exemptionData);
    } catch (error) {
      this.logger.error('Failed to process custodian exemption', error.stack);
      throw error;
    }
  }

  /**
   * Identify data sources
   */
  async identifyHoldDataSources(holdId: string, custodianId: string): Promise<any[]> {
    try {
      return await identifyDataSources(holdId, custodianId);
    } catch (error) {
      this.logger.error('Failed to identify data sources', error.stack);
      return [];
    }
  }

  /**
   * Update data source status
   */
  async updateDataSourceStatusInfo(dataSourceId: string, status: string): Promise<any> {
    try {
      return await updateDataSourceStatus(dataSourceId, status);
    } catch (error) {
      this.logger.error('Failed to update data source status', error.stack);
      throw error;
    }
  }

  /**
   * Get data sources by custodian
   */
  async getDataSourcesForCustodian(custodianId: string): Promise<any[]> {
    try {
      return await getDataSourcesByCustodian(custodianId);
    } catch (error) {
      this.logger.error('Failed to get data sources by custodian', error.stack);
      return [];
    }
  }

  /**
   * Estimate preservation volume
   */
  async estimatePreservationDataVolume(holdId: string): Promise<any> {
    try {
      return await estimatePreservationVolume(holdId);
    } catch (error) {
      this.logger.error('Failed to estimate preservation volume', error.stack);
      throw error;
    }
  }

  /**
   * Mark data source as failed
   */
  async markDataSourceAsFailed(dataSourceId: string, reason: string): Promise<any> {
    try {
      return await markDataSourceFailed(dataSourceId, reason);
    } catch (error) {
      this.logger.error('Failed to mark data source as failed', error.stack);
      throw error;
    }
  }

  /**
   * Define preservation scope
   */
  async defineHoldPreservationScope(holdId: string, scopeData: any): Promise<any> {
    try {
      return await definePreservationScope(holdId, scopeData);
    } catch (error) {
      this.logger.error('Failed to define preservation scope', error.stack);
      throw error;
    }
  }

  /**
   * Validate privilege tag
   */
  validatePrivilegeTag(data: unknown): any {
    try {
      return PrivilegeTagSchema.parse(data);
    } catch (error) {
      this.logger.error('Privilege tag validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate privilege log entry
   */
  validatePrivilegeLogEntry(data: unknown): any {
    try {
      return PrivilegeLogEntrySchema.parse(data);
    } catch (error) {
      this.logger.error('Privilege log entry validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate clawback request
   */
  validateClawbackRequest(data: unknown): any {
    try {
      return ClawbackRequestSchema.parse(data);
    } catch (error) {
      this.logger.error('Clawback request validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate privilege assertion
   */
  validatePrivilegeAssertion(data: unknown): any {
    try {
      return PrivilegeAssertionSchema.parse(data);
    } catch (error) {
      this.logger.error('Privilege assertion validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate quality control
   */
  validateQualityControl(data: unknown): any {
    try {
      return QualityControlSchema.parse(data);
    } catch (error) {
      this.logger.error('Quality control validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Conduct privilege review using service
   */
  async conductPrivilegeReview(documentSet: any[]): Promise<any> {
    try {
      return await this.privilegeReviewService.reviewDocuments(documentSet);
    } catch (error) {
      this.logger.error('Failed to conduct privilege review', error.stack);
      throw error;
    }
  }

  /**
   * Manage clawback request using service
   */
  async manageClawbackRequest(clawbackData: any): Promise<any> {
    try {
      return await this.clawbackManagementService.processClawback(clawbackData);
    } catch (error) {
      this.logger.error('Failed to manage clawback request', error.stack);
      throw error;
    }
  }

  /**
   * Create privilege log using service
   */
  async createPrivilegeLogEntry(logData: any): Promise<any> {
    try {
      return await this.privilegeLogService.createLogEntry(logData);
    } catch (error) {
      this.logger.error('Failed to create privilege log entry', error.stack);
      throw error;
    }
  }

  /**
   * Get privilege log using service
   */
  async getPrivilegeLog(matterId: string): Promise<any[]> {
    try {
      return await this.privilegeLogService.getLog(matterId);
    } catch (error) {
      this.logger.error('Failed to get privilege log', error.stack);
      return [];
    }
  }

  /**
   * Export privilege log using service
   */
  async exportPrivilegeLog(matterId: string, format: string): Promise<any> {
    try {
      return await this.privilegeLogService.exportLog(matterId, format);
    } catch (error) {
      this.logger.error('Failed to export privilege log', error.stack);
      throw error;
    }
  }

  /**
   * Tag privileged document using service
   */
  async tagPrivilegedDocument(documentId: string, privilegeType: string): Promise<any> {
    try {
      return await this.privilegeReviewService.tagDocument(documentId, privilegeType);
    } catch (error) {
      this.logger.error('Failed to tag privileged document', error.stack);
      throw error;
    }
  }

  /**
   * Assert privilege using service
   */
  async assertPrivilege(documentId: string, assertionData: any): Promise<any> {
    try {
      return await this.privilegeReviewService.assertPrivilege(documentId, assertionData);
    } catch (error) {
      this.logger.error('Failed to assert privilege', error.stack);
      throw error;
    }
  }
}

/**
 * Westlaw Compliance Suite Module
 * NestJS module that provides compliance suite services
 */
@Module({
  providers: [
    WestlawComplianceSuiteService,
    RegulatoryComplianceService,
    EthicsRuleService,
    EthicsViolationService,
    ConflictOfInterestService,
    ClientConfidentialityService,
    FeeArrangementComplianceService,
    ProfessionalConductService,
    PrivilegeReviewService,
    ClawbackManagementService,
    PrivilegeLogService,
  ],
  exports: [WestlawComplianceSuiteService],
})
export class WestlawComplianceSuiteModule {}

// Re-export all types for external use
export {
  // Regulatory compliance types
  RegulatoryComplianceService,

  // Ethics compliance types
  EthicsRuleModel,
  EthicsViolationModel,
  ConflictCheckModel,
  RemediationPlanModel,
  FeeArrangementComplianceModel,
  ConfidentialityRecordModel,
  EthicsRuleService,
  EthicsViolationService,
  ConflictOfInterestService,
  ClientConfidentialityService,
  FeeArrangementComplianceService,
  ProfessionalConductService,

  // Privilege review types
  PrivilegeTag,
  PrivilegeLog,
  PrivilegeAssertion,
  ClawbackRequest,
  PrivilegeReviewService,
  ClawbackManagementService,
  PrivilegeLogService,
};

// Re-export the service as default
export default WestlawComplianceSuiteService;
