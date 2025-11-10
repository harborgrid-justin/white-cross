/**
 * LOC: WLPM1234567
 * File: /reuse/legal/composites/westlaw-practice-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - reuse/legal/legal-project-management-kit.ts
 *   - reuse/legal/legal-billing-timekeeping-kit.ts
 *   - reuse/legal/conflict-check-kit.ts
 *   - reuse/legal/legal-entity-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Westlaw practice management services
 *   - Law firm management platforms
 *   - Legal billing systems
 */

/**
 * File: /reuse/legal/composites/westlaw-practice-management-composite.ts
 * Locator: WC-CMP-WLPM-001
 * Purpose: Westlaw Practice Management Composite - Law firm practice and operations management
 *
 * Upstream: Composes legal-project-management-kit, legal-billing-timekeeping-kit, conflict-check-kit, legal-entity-management-kit
 * Downstream: Westlaw backend services, Practice management APIs, Billing systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod
 * Exports: 50 composed functions for comprehensive practice management
 *
 * LLM Context: Production-ready Westlaw practice management composite providing comprehensive law firm
 * operations including project management, billing and timekeeping, conflict checking, and entity management.
 * Integrates multiple legal practice kits into a unified service layer with proper NestJS dependency injection,
 * configuration management, and error handling. Essential for enterprise legal practice platforms.
 */

import { Injectable, Logger, Inject, Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

// Import from legal-project-management-kit
import {
  CreateMatterSchema,
  UpdateMatterSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateMilestoneSchema,
  UpdateMilestoneSchema,
  CreateResourceAllocationSchema,
  UpdateResourceAllocationSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
  CreateStatusReportSchema,
  CreateMatterDto,
  UpdateMatterDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateResourceAllocationDto,
  UpdateResourceAllocationDto,
  CreateBudgetDto,
} from '../legal-project-management-kit';

// Import from legal-billing-timekeeping-kit
import {
  TimeEntryCreateSchema,
  BillingRateCreateSchema,
  InvoiceCreateSchema,
  ExpenseCreateSchema,
  TrustTransactionCreateSchema,
  PaymentCreateSchema,
  TimeEntryModel,
  BillingRateModel,
  InvoiceModel,
  InvoiceLineItemModel,
  ExpenseModel,
  TrustAccountModel,
  TrustTransactionModel,
  WIPEntryModel,
  PaymentModel,
  registerBillingConfig,
  createBillingConfigModule,
  calculateBillingAmount,
  calculateInvoiceTotal,
  BillingTimekeepingService,
} from '../legal-billing-timekeeping-kit';

// Import from conflict-check-kit
import {
  OpposingPartySchema,
  RelatedEntitySchema,
  ConflictCheckRequestSchema,
  ConflictDetailSchema,
  WaiverDocumentSchema,
  EthicalWallSchema,
  PriorMatterSchema,
  LateralHireCheckSchema,
  ConflictCheckRequestModel,
  ConflictDetailModel,
  WaiverDocumentModel,
  EthicalWallModel,
  LateralHireCheckModel,
  ConflictNotificationModel,
  ConflictScreeningService,
  WaiverManagementService,
  EthicalWallService,
  LateralHireService,
  ConflictReportingService,
  conflictCheckConfig,
} from '../conflict-check-kit';

// Import from legal-entity-management-kit
import {
  EntityAddressSchema,
  EntityFormationRequestSchema,
  ComplianceEventSchema,
  EntitySearchCriteriaSchema,
  LegalEntityModel,
  EntityRelationshipModel,
  OwnershipStakeModel,
  EntityOfficerModel,
  ComplianceEventModel,
  LegalEntityManagementService,
  legalEntityManagementConfig,
  LegalEntityManagementModule,
  CreateEntityDto,
  EntityResponseDto,
  ComplianceEventDto,
} from '../legal-entity-management-kit';

/**
 * Westlaw Practice Management Service
 * Production-ready NestJS service integrating comprehensive practice management capabilities
 */
@Injectable()
export class WestlawPracticeManagementService {
  private readonly logger = new Logger(WestlawPracticeManagementService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly billingTimekeepingService: BillingTimekeepingService,
    private readonly conflictScreeningService: ConflictScreeningService,
    private readonly waiverManagementService: WaiverManagementService,
    private readonly ethicalWallService: EthicalWallService,
    private readonly lateralHireService: LateralHireService,
    private readonly conflictReportingService: ConflictReportingService,
    private readonly legalEntityManagementService: LegalEntityManagementService,
  ) {
    this.logger.log('WestlawPracticeManagementService initialized');
  }

  /**
   * Initialize all database models for practice management
   */
  async initializeModels(): Promise<void> {
    try {
      // Initialize billing and timekeeping models
      TimeEntryModel.init(this.sequelize);
      BillingRateModel.init(this.sequelize);
      InvoiceModel.init(this.sequelize);
      InvoiceLineItemModel.init(this.sequelize);
      ExpenseModel.init(this.sequelize);
      TrustAccountModel.init(this.sequelize);
      TrustTransactionModel.init(this.sequelize);
      WIPEntryModel.init(this.sequelize);
      PaymentModel.init(this.sequelize);

      // Initialize conflict check models
      ConflictCheckRequestModel.init(this.sequelize);
      ConflictDetailModel.init(this.sequelize);
      WaiverDocumentModel.init(this.sequelize);
      EthicalWallModel.init(this.sequelize);
      LateralHireCheckModel.init(this.sequelize);
      ConflictNotificationModel.init(this.sequelize);

      // Initialize entity management models
      LegalEntityModel.init(this.sequelize);
      EntityRelationshipModel.init(this.sequelize);
      OwnershipStakeModel.init(this.sequelize);
      EntityOfficerModel.init(this.sequelize);
      ComplianceEventModel.init(this.sequelize);

      this.logger.log('All practice management models initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize practice management models', error.stack);
      throw error;
    }
  }

  /**
   * Validate matter creation data
   */
  validateMatterData(data: unknown): CreateMatterDto {
    try {
      return CreateMatterSchema.parse(data) as CreateMatterDto;
    } catch (error) {
      this.logger.error('Matter data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate matter update data
   */
  validateMatterUpdateData(data: unknown): UpdateMatterDto {
    try {
      return UpdateMatterSchema.parse(data) as UpdateMatterDto;
    } catch (error) {
      this.logger.error('Matter update data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate task creation data
   */
  validateTaskData(data: unknown): CreateTaskDto {
    try {
      return CreateTaskSchema.parse(data) as CreateTaskDto;
    } catch (error) {
      this.logger.error('Task data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate task update data
   */
  validateTaskUpdateData(data: unknown): UpdateTaskDto {
    try {
      return UpdateTaskSchema.parse(data) as UpdateTaskDto;
    } catch (error) {
      this.logger.error('Task update data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate milestone creation data
   */
  validateMilestoneData(data: unknown): CreateMilestoneDto {
    try {
      return CreateMilestoneSchema.parse(data) as CreateMilestoneDto;
    } catch (error) {
      this.logger.error('Milestone data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate milestone update data
   */
  validateMilestoneUpdateData(data: unknown): UpdateMilestoneDto {
    try {
      return UpdateMilestoneSchema.parse(data) as UpdateMilestoneDto;
    } catch (error) {
      this.logger.error('Milestone update data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate resource allocation data
   */
  validateResourceAllocationData(data: unknown): CreateResourceAllocationDto {
    try {
      return CreateResourceAllocationSchema.parse(data) as CreateResourceAllocationDto;
    } catch (error) {
      this.logger.error('Resource allocation data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate resource allocation update data
   */
  validateResourceAllocationUpdateData(data: unknown): UpdateResourceAllocationDto {
    try {
      return UpdateResourceAllocationSchema.parse(data) as UpdateResourceAllocationDto;
    } catch (error) {
      this.logger.error('Resource allocation update data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate budget creation data
   */
  validateBudgetData(data: unknown): CreateBudgetDto {
    try {
      return CreateBudgetSchema.parse(data) as CreateBudgetDto;
    } catch (error) {
      this.logger.error('Budget data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate status report data
   */
  validateStatusReportData(data: unknown): any {
    try {
      return CreateStatusReportSchema.parse(data);
    } catch (error) {
      this.logger.error('Status report data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate time entry data
   */
  validateTimeEntryData(data: unknown): any {
    try {
      return TimeEntryCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Time entry data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate billing rate data
   */
  validateBillingRateData(data: unknown): any {
    try {
      return BillingRateCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Billing rate data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate invoice data
   */
  validateInvoiceData(data: unknown): any {
    try {
      return InvoiceCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Invoice data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate expense data
   */
  validateExpenseData(data: unknown): any {
    try {
      return ExpenseCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Expense data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate trust transaction data
   */
  validateTrustTransactionData(data: unknown): any {
    try {
      return TrustTransactionCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Trust transaction data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate payment data
   */
  validatePaymentData(data: unknown): any {
    try {
      return PaymentCreateSchema.parse(data);
    } catch (error) {
      this.logger.error('Payment data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Calculate billing amount
   */
  calculateBilling(timeEntry: any, rate: any): number {
    try {
      return calculateBillingAmount(timeEntry, rate);
    } catch (error) {
      this.logger.error('Failed to calculate billing amount', error.stack);
      throw error;
    }
  }

  /**
   * Calculate invoice total
   */
  calculateTotal(invoice: any): any {
    try {
      return calculateInvoiceTotal(invoice);
    } catch (error) {
      this.logger.error('Failed to calculate invoice total', error.stack);
      throw error;
    }
  }

  /**
   * Register billing configuration
   */
  registerBillingConfiguration(): void {
    try {
      registerBillingConfig();
      this.logger.log('Billing configuration registered successfully');
    } catch (error) {
      this.logger.error('Failed to register billing configuration', error.stack);
      throw error;
    }
  }

  /**
   * Create billing configuration module
   */
  createBillingModule(): DynamicModule {
    try {
      return createBillingConfigModule();
    } catch (error) {
      this.logger.error('Failed to create billing config module', error.stack);
      throw error;
    }
  }

  /**
   * Validate opposing party data
   */
  validateOpposingPartyData(data: unknown): any {
    try {
      return OpposingPartySchema.parse(data);
    } catch (error) {
      this.logger.error('Opposing party data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate related entity data
   */
  validateRelatedEntityData(data: unknown): any {
    try {
      return RelatedEntitySchema.parse(data);
    } catch (error) {
      this.logger.error('Related entity data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate conflict check request data
   */
  validateConflictCheckData(data: unknown): any {
    try {
      return ConflictCheckRequestSchema.parse(data);
    } catch (error) {
      this.logger.error('Conflict check request data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate conflict detail data
   */
  validateConflictDetailData(data: unknown): any {
    try {
      return ConflictDetailSchema.parse(data);
    } catch (error) {
      this.logger.error('Conflict detail data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate waiver document data
   */
  validateWaiverDocumentData(data: unknown): any {
    try {
      return WaiverDocumentSchema.parse(data);
    } catch (error) {
      this.logger.error('Waiver document data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate ethical wall data
   */
  validateEthicalWallData(data: unknown): any {
    try {
      return EthicalWallSchema.parse(data);
    } catch (error) {
      this.logger.error('Ethical wall data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate prior matter data
   */
  validatePriorMatterData(data: unknown): any {
    try {
      return PriorMatterSchema.parse(data);
    } catch (error) {
      this.logger.error('Prior matter data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate lateral hire check data
   */
  validateLateralHireCheckData(data: unknown): any {
    try {
      return LateralHireCheckSchema.parse(data);
    } catch (error) {
      this.logger.error('Lateral hire check data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Get conflict check configuration
   */
  getConflictCheckConfig(): any {
    try {
      return conflictCheckConfig();
    } catch (error) {
      this.logger.error('Failed to get conflict check config', error.stack);
      throw error;
    }
  }

  /**
   * Screen conflicts using service
   */
  async screenConflicts(requestData: any): Promise<any> {
    try {
      return await this.conflictScreeningService.screenConflicts(requestData);
    } catch (error) {
      this.logger.error('Failed to screen conflicts', error.stack);
      throw error;
    }
  }

  /**
   * Manage waivers using service
   */
  async manageWaivers(waiverData: any): Promise<any> {
    try {
      return await this.waiverManagementService.createWaiver(waiverData);
    } catch (error) {
      this.logger.error('Failed to manage waivers', error.stack);
      throw error;
    }
  }

  /**
   * Manage ethical walls using service
   */
  async manageEthicalWalls(wallData: any): Promise<any> {
    try {
      return await this.ethicalWallService.createEthicalWall(wallData);
    } catch (error) {
      this.logger.error('Failed to manage ethical walls', error.stack);
      throw error;
    }
  }

  /**
   * Process lateral hire checks using service
   */
  async processLateralHireCheck(checkData: any): Promise<any> {
    try {
      return await this.lateralHireService.conductCheck(checkData);
    } catch (error) {
      this.logger.error('Failed to process lateral hire check', error.stack);
      throw error;
    }
  }

  /**
   * Generate conflict reports using service
   */
  async generateConflictReport(reportParams: any): Promise<any> {
    try {
      return await this.conflictReportingService.generateReport(reportParams);
    } catch (error) {
      this.logger.error('Failed to generate conflict report', error.stack);
      throw error;
    }
  }

  /**
   * Validate entity address data
   */
  validateEntityAddressData(data: unknown): any {
    try {
      return EntityAddressSchema.parse(data);
    } catch (error) {
      this.logger.error('Entity address data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate entity formation request data
   */
  validateEntityFormationData(data: unknown): any {
    try {
      return EntityFormationRequestSchema.parse(data);
    } catch (error) {
      this.logger.error('Entity formation request data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate compliance event data
   */
  validateComplianceEventData(data: unknown): ComplianceEventDto {
    try {
      return ComplianceEventSchema.parse(data) as ComplianceEventDto;
    } catch (error) {
      this.logger.error('Compliance event data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Validate entity search criteria data
   */
  validateEntitySearchCriteriaData(data: unknown): any {
    try {
      return EntitySearchCriteriaSchema.parse(data);
    } catch (error) {
      this.logger.error('Entity search criteria data validation failed', error.stack);
      throw error;
    }
  }

  /**
   * Get legal entity management configuration
   */
  getLegalEntityManagementConfig(): any {
    try {
      return legalEntityManagementConfig();
    } catch (error) {
      this.logger.error('Failed to get legal entity management config', error.stack);
      throw error;
    }
  }

  /**
   * Create legal entity using service
   */
  async createLegalEntity(entityData: CreateEntityDto): Promise<EntityResponseDto> {
    try {
      return await this.legalEntityManagementService.createEntity(entityData);
    } catch (error) {
      this.logger.error('Failed to create legal entity', error.stack);
      throw error;
    }
  }

  /**
   * Get legal entity using service
   */
  async getLegalEntity(entityId: string): Promise<EntityResponseDto> {
    try {
      return await this.legalEntityManagementService.getEntity(entityId);
    } catch (error) {
      this.logger.error('Failed to get legal entity', error.stack);
      throw error;
    }
  }

  /**
   * Update legal entity using service
   */
  async updateLegalEntity(entityId: string, updateData: Partial<CreateEntityDto>): Promise<EntityResponseDto> {
    try {
      return await this.legalEntityManagementService.updateEntity(entityId, updateData);
    } catch (error) {
      this.logger.error('Failed to update legal entity', error.stack);
      throw error;
    }
  }

  /**
   * Delete legal entity using service
   */
  async deleteLegalEntity(entityId: string): Promise<void> {
    try {
      await this.legalEntityManagementService.deleteEntity(entityId);
    } catch (error) {
      this.logger.error('Failed to delete legal entity', error.stack);
      throw error;
    }
  }

  /**
   * Search legal entities using service
   */
  async searchLegalEntities(criteria: any): Promise<EntityResponseDto[]> {
    try {
      return await this.legalEntityManagementService.searchEntities(criteria);
    } catch (error) {
      this.logger.error('Failed to search legal entities', error.stack);
      return [];
    }
  }

  /**
   * Track compliance events using service
   */
  async trackComplianceEvent(eventData: ComplianceEventDto): Promise<any> {
    try {
      return await this.legalEntityManagementService.trackComplianceEvent(eventData);
    } catch (error) {
      this.logger.error('Failed to track compliance event', error.stack);
      throw error;
    }
  }

  /**
   * Get entity relationships using service
   */
  async getEntityRelationships(entityId: string): Promise<any[]> {
    try {
      return await this.legalEntityManagementService.getRelationships(entityId);
    } catch (error) {
      this.logger.error('Failed to get entity relationships', error.stack);
      return [];
    }
  }

  /**
   * Get entity ownership structure using service
   */
  async getOwnershipStructure(entityId: string): Promise<any> {
    try {
      return await this.legalEntityManagementService.getOwnershipStructure(entityId);
    } catch (error) {
      this.logger.error('Failed to get ownership structure', error.stack);
      throw error;
    }
  }

  /**
   * Get entity officers using service
   */
  async getEntityOfficers(entityId: string): Promise<any[]> {
    try {
      return await this.legalEntityManagementService.getOfficers(entityId);
    } catch (error) {
      this.logger.error('Failed to get entity officers', error.stack);
      return [];
    }
  }

  /**
   * Get comprehensive billing metrics
   */
  async getBillingMetrics(matterId: string): Promise<any> {
    try {
      return await this.billingTimekeepingService.getBillingMetrics(matterId);
    } catch (error) {
      this.logger.error('Failed to get billing metrics', error.stack);
      throw error;
    }
  }

  /**
   * Generate time entry report
   */
  async generateTimeEntryReport(params: any): Promise<any> {
    try {
      return await this.billingTimekeepingService.generateTimeReport(params);
    } catch (error) {
      this.logger.error('Failed to generate time entry report', error.stack);
      throw error;
    }
  }

  /**
   * Process trust account transaction
   */
  async processTrustTransaction(transactionData: any): Promise<any> {
    try {
      return await this.billingTimekeepingService.processTrustTransaction(transactionData);
    } catch (error) {
      this.logger.error('Failed to process trust transaction', error.stack);
      throw error;
    }
  }

  /**
   * Get work-in-progress summary
   */
  async getWIPSummary(matterId: string): Promise<any> {
    try {
      return await this.billingTimekeepingService.getWIPSummary(matterId);
    } catch (error) {
      this.logger.error('Failed to get WIP summary', error.stack);
      throw error;
    }
  }

  /**
   * Process invoice payment
   */
  async processPayment(invoiceId: string, paymentData: any): Promise<any> {
    try {
      return await this.billingTimekeepingService.processPayment(invoiceId, paymentData);
    } catch (error) {
      this.logger.error('Failed to process payment', error.stack);
      throw error;
    }
  }
}

/**
 * Westlaw Practice Management Module
 * NestJS module that provides practice management services
 */
@Module({
  providers: [
    WestlawPracticeManagementService,
    BillingTimekeepingService,
    ConflictScreeningService,
    WaiverManagementService,
    EthicalWallService,
    LateralHireService,
    ConflictReportingService,
    LegalEntityManagementService,
  ],
  exports: [WestlawPracticeManagementService],
})
export class WestlawPracticeManagementModule {}

// Re-export all types for external use
export {
  // Project management types
  CreateMatterDto,
  UpdateMatterDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateResourceAllocationDto,
  UpdateResourceAllocationDto,
  CreateBudgetDto,

  // Billing and timekeeping types
  TimeEntryModel,
  BillingRateModel,
  InvoiceModel,
  InvoiceLineItemModel,
  ExpenseModel,
  TrustAccountModel,
  TrustTransactionModel,
  WIPEntryModel,
  PaymentModel,

  // Conflict check types
  ConflictCheckRequestModel,
  ConflictDetailModel,
  WaiverDocumentModel,
  EthicalWallModel,
  LateralHireCheckModel,
  ConflictNotificationModel,

  // Entity management types
  LegalEntityModel,
  EntityRelationshipModel,
  OwnershipStakeModel,
  EntityOfficerModel,
  ComplianceEventModel,
  CreateEntityDto,
  EntityResponseDto,
  ComplianceEventDto,
};

// Re-export the service as default
export default WestlawPracticeManagementService;
