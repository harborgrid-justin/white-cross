/**
 * @fileoverview Enterprise Revenue Recognition Kit - Production-Grade ASC 606/IFRS 15 Compliance
 *
 * @module RevenueRecognitionKit
 * @description Comprehensive revenue recognition system implementing ASC 606 and IFRS 15 standards
 * for contract-based revenue management, deferred revenue tracking, and performance obligation allocation.
 *
 * Features:
 * - ASC 606 / IFRS 15 full compliance framework
 * - Contract identification and management
 * - Performance obligation tracking and allocation
 * - Transaction price determination and allocation
 * - Multiple recognition methods (straight-line, milestone, percentage completion)
 * - Deferred and unbilled revenue management
 * - Multi-element arrangement handling
 * - Variable consideration and constraint analysis
 * - Contract modification tracking
 * - Revenue forecasting and projections
 * - Comprehensive audit trails and compliance reporting
 * - Automated revenue schedules and waterfall calculations
 * - SSP (Standalone Selling Price) estimation
 * - Revenue reallocation for contract changes
 * - Cancellation and refund processing
 *
 * Competes with: Zuora RevPro, NetSuite SuiteBilling, SAP RAR, Oracle RMCS
 *
 * Standards Compliance:
 * - ASC 606: Revenue from Contracts with Customers
 * - IFRS 15: Revenue from Contracts with Customers
 * - SOX Controls: Automated revenue recognition controls
 * - GAAP: Generally Accepted Accounting Principles
 *
 * Architecture:
 * - NestJS 10.x Injectable Services
 * - Sequelize 6.x ORM with PostgreSQL
 * - TypeScript 5.x strict mode
 * - Decimal.js for precise financial calculations
 * - Bull Queue for async revenue processing
 * - Redis caching for performance optimization
 *
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 * @since 2025-Q1
 * @license MIT
 *
 * @requires @nestjs/common ^10.0.0
 * @requires sequelize ^6.0.0
 * @requires sequelize-typescript ^2.1.0
 * @requires @nestjs/swagger ^7.0.0
 * @requires decimal.js ^10.4.0
 * @requires date-fns ^2.30.0
 *
 * LOC: FIN-REVR-001
 *
 * @example Basic Usage
 * ```typescript
 * // Inject the service
 * constructor(private readonly revenueService: RevenueRecognitionService) {}
 *
 * // Create a contract with performance obligations
 * const contract = await this.revenueService.createRevenueContract({
 *   customerId: 'CUST-001',
 *   contractNumber: 'CONTRACT-2025-001',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   totalContractValue: new Decimal('120000.00'),
 *   currency: 'USD'
 * });
 *
 * // Add performance obligations
 * const obligation = await this.revenueService.addPerformanceObligation(contract.id, {
 *   description: 'Software License',
 *   allocatedAmount: new Decimal('80000.00'),
 *   recognitionMethod: 'STRAIGHT_LINE',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * });
 *
 * // Generate revenue schedule
 * const schedule = await this.revenueService.generateRevenueSchedule(obligation.id);
 *
 * // Recognize revenue for the period
 * const recognized = await this.revenueService.recognizeRevenueForPeriod(
 *   contract.id,
 *   new Date('2025-01-31')
 * );
 * ```
 *
 * @example Multi-Element Arrangement
 * ```typescript
 * // Create multi-element contract
 * const multiContract = await this.revenueService.createMultiElementContract({
 *   customerId: 'CUST-002',
 *   elements: [
 *     { description: 'Software', price: 100000, ssp: 120000 },
 *     { description: 'Implementation', price: 50000, ssp: 60000 },
 *     { description: 'Support', price: 30000, ssp: 35000 }
 *   ]
 * });
 *
 * // Allocate transaction price using relative SSP
 * const allocation = await this.revenueService.allocateTransactionPrice(
 *   multiContract.id,
 *   'RELATIVE_SSP'
 * );
 * ```
 *
 * @example Variable Consideration
 * ```typescript
 * // Handle variable consideration with constraint
 * const variable = await this.revenueService.calculateVariableConsideration({
 *   contractId: contract.id,
 *   baseAmount: new Decimal('100000'),
 *   variableElements: [
 *     { type: 'BONUS', estimatedAmount: 20000, probability: 0.7 },
 *     { type: 'PENALTY', estimatedAmount: -5000, probability: 0.3 }
 *   ],
 *   constraintMethod: 'MOST_LIKELY'
 * });
 * ```
 */

import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, Transaction, Op, Sequelize } from 'sequelize';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import Decimal from 'decimal.js';
import {
  addMonths,
  addDays,
  differenceInDays,
  differenceInMonths,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  isWithinInterval,
  format,
  parseISO
} from 'date-fns';

// ============================================================================
// TypeScript Types and Interfaces
// ============================================================================

/**
 * Revenue recognition method types per ASC 606
 */
export enum RecognitionMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',           // Ratably over time
  MILESTONE = 'MILESTONE',                   // Milestone-based recognition
  PERCENTAGE_COMPLETION = 'PERCENTAGE_COMPLETION', // Percentage of completion
  POINT_IN_TIME = 'POINT_IN_TIME',          // One-time recognition
  OUTPUT_METHOD = 'OUTPUT_METHOD',           // Output-based (units delivered)
  INPUT_METHOD = 'INPUT_METHOD',             // Input-based (costs incurred)
  USAGE_BASED = 'USAGE_BASED',              // Consumption-based
  SUBSCRIPTION = 'SUBSCRIPTION',             // Recurring subscription
  CUSTOM = 'CUSTOM'                          // Custom recognition logic
}

/**
 * Contract status enumeration
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  AMENDED = 'AMENDED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED'
}

/**
 * Performance obligation status
 */
export enum ObligationStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PARTIALLY_SATISFIED = 'PARTIALLY_SATISFIED',
  SATISFIED = 'SATISFIED',
  CANCELLED = 'CANCELLED'
}

/**
 * Revenue schedule entry status
 */
export enum ScheduleEntryStatus {
  SCHEDULED = 'SCHEDULED',
  RECOGNIZED = 'RECOGNIZED',
  DEFERRED = 'DEFERRED',
  REVERSED = 'REVERSED',
  ADJUSTED = 'ADJUSTED'
}

/**
 * Transaction price allocation method
 */
export enum AllocationMethod {
  RELATIVE_SSP = 'RELATIVE_SSP',           // Relative standalone selling price
  ADJUSTED_MARKET = 'ADJUSTED_MARKET',     // Adjusted market assessment
  EXPECTED_COST_PLUS = 'EXPECTED_COST_PLUS', // Expected cost plus margin
  RESIDUAL = 'RESIDUAL',                   // Residual approach
  CONTRACTED_PRICE = 'CONTRACTED_PRICE'    // Contracted price (no allocation)
}

/**
 * Variable consideration estimation method
 */
export enum VariableEstimationMethod {
  EXPECTED_VALUE = 'EXPECTED_VALUE',       // Probability-weighted amount
  MOST_LIKELY = 'MOST_LIKELY',            // Single most likely amount
  CONSERVATIVE = 'CONSERVATIVE'            // Most conservative estimate
}

/**
 * Contract modification type
 */
export enum ModificationType {
  SEPARATE_CONTRACT = 'SEPARATE_CONTRACT', // Separate new contract
  TERMINATION_NEW = 'TERMINATION_NEW',    // Terminate and create new
  PROSPECTIVE = 'PROSPECTIVE',             // Prospective adjustment
  CUMULATIVE_CATCHUP = 'CUMULATIVE_CATCHUP', // Cumulative catch-up
  RETROSPECTIVE = 'RETROSPECTIVE'          // Retrospective restatement
}

/**
 * Revenue contract model
 */
export interface RevenueContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  description?: string;
  contractDate: Date;
  startDate: Date;
  endDate: Date;
  totalContractValue: Decimal;
  allocatedValue: Decimal;
  recognizedRevenue: Decimal;
  deferredRevenue: Decimal;
  unbilledRevenue: Decimal;
  currency: string;
  status: ContractStatus;
  parentContractId?: string;
  modificationCount: number;
  lastModifiedDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Performance obligation model
 */
export interface PerformanceObligation {
  id: string;
  contractId: string;
  obligationNumber: string;
  description: string;
  allocatedAmount: Decimal;
  recognizedAmount: Decimal;
  remainingAmount: Decimal;
  percentComplete: number;
  recognitionMethod: RecognitionMethod;
  startDate: Date;
  endDate: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  status: ObligationStatus;
  standaloneSellingPrice?: Decimal;
  isSeparate: boolean;
  parentObligationId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Revenue schedule entry
 */
export interface RevenueScheduleEntry {
  id: string;
  obligationId: string;
  contractId: string;
  scheduleDate: Date;
  periodStartDate: Date;
  periodEndDate: Date;
  scheduledAmount: Decimal;
  recognizedAmount: Decimal;
  deferredAmount: Decimal;
  cumulativeRecognized: Decimal;
  status: ScheduleEntryStatus;
  recognitionDate?: Date;
  journalEntryId?: string;
  reversalEntryId?: string;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Revenue schedule summary
 */
export interface RevenueSchedule {
  obligationId: string;
  contractId: string;
  totalScheduled: Decimal;
  totalRecognized: Decimal;
  totalDeferred: Decimal;
  totalRemaining: Decimal;
  scheduleEntries: RevenueScheduleEntry[];
  recognitionMethod: RecognitionMethod;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
}

/**
 * Transaction price allocation result
 */
export interface TransactionPriceAllocation {
  contractId: string;
  totalTransactionPrice: Decimal;
  allocationMethod: AllocationMethod;
  allocations: Array<{
    obligationId: string;
    description: string;
    standaloneSellingPrice: Decimal;
    allocationPercentage: number;
    allocatedAmount: Decimal;
  }>;
  residualAmount?: Decimal;
  allocationDate: Date;
}

/**
 * Variable consideration calculation
 */
export interface VariableConsideration {
  contractId: string;
  baseAmount: Decimal;
  variableAmount: Decimal;
  constrainedAmount: Decimal;
  estimationMethod: VariableEstimationMethod;
  constraintApplied: boolean;
  constraintReason?: string;
  variableElements: Array<{
    type: string;
    description: string;
    estimatedAmount: Decimal;
    probability?: number;
    constraintFactor?: number;
  }>;
  calculatedAt: Date;
}

/**
 * Contract modification record
 */
export interface ContractModification {
  id: string;
  contractId: string;
  modificationNumber: string;
  modificationType: ModificationType;
  modificationDate: Date;
  effectiveDate: Date;
  description: string;
  originalValue: Decimal;
  modifiedValue: Decimal;
  valueChange: Decimal;
  impactedObligations: string[];
  reallocationRequired: boolean;
  cumulativeAdjustment?: Decimal;
  approvedBy: string;
  approvedAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Deferred revenue summary
 */
export interface DeferredRevenueSummary {
  contractId?: string;
  customerId?: string;
  totalDeferred: Decimal;
  currentPeriodDeferred: Decimal;
  longTermDeferred: Decimal;
  deferredByContract: Array<{
    contractId: string;
    contractNumber: string;
    deferredAmount: Decimal;
    startDate: Date;
    endDate: Date;
  }>;
  deferredByRecognitionMethod: Map<RecognitionMethod, Decimal>;
  asOfDate: Date;
}

/**
 * Revenue forecast
 */
export interface RevenueForecast {
  forecastId: string;
  contractId?: string;
  customerId?: string;
  forecastPeriod: {
    startDate: Date;
    endDate: Date;
  };
  forecastedRevenue: Decimal;
  recognizedToDate: Decimal;
  remainingToRecognize: Decimal;
  confidenceLevel: number;
  monthlyForecasts: Array<{
    month: string;
    forecastedAmount: Decimal;
    probability: number;
  }>;
  assumptions: string[];
  risks: string[];
  generatedAt: Date;
}

/**
 * Revenue audit trail entry
 */
export interface RevenueAuditEntry {
  id: string;
  entityType: 'CONTRACT' | 'OBLIGATION' | 'SCHEDULE' | 'MODIFICATION';
  entityId: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  changes: Record<string, { old: any; new: any }>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * SSP estimation result
 */
export interface SSPEstimation {
  obligationId: string;
  description: string;
  estimatedSSP: Decimal;
  estimationMethod: 'MARKET_RATE' | 'COST_PLUS' | 'HISTORICAL' | 'RESIDUAL';
  dataPoints: number;
  confidenceLevel: number;
  adjustments: Array<{
    reason: string;
    adjustment: Decimal;
  }>;
  estimatedAt: Date;
}

/**
 * Revenue waterfall calculation
 */
export interface RevenueWaterfall {
  contractId: string;
  periodStart: Date;
  periodEnd: Date;
  openingDeferred: Decimal;
  billedAmount: Decimal;
  recognizedRevenue: Decimal;
  closingDeferred: Decimal;
  unbilledRevenue: Decimal;
  steps: Array<{
    step: string;
    description: string;
    amount: Decimal;
    runningBalance: Decimal;
  }>;
  calculatedAt: Date;
}

// ============================================================================
// NestJS Injectable Service
// ============================================================================

@Injectable()
@ApiTags('Revenue Recognition')
export class RevenueRecognitionService {
  private readonly logger = new Logger(RevenueRecognitionService.name);

  constructor(
    @InjectModel('RevenueContract')
    private readonly contractModel: typeof Model,
    @InjectModel('PerformanceObligation')
    private readonly obligationModel: typeof Model,
    @InjectModel('RevenueScheduleEntry')
    private readonly scheduleModel: typeof Model,
    @InjectModel('ContractModification')
    private readonly modificationModel: typeof Model,
    @InjectModel('RevenueAuditEntry')
    private readonly auditModel: typeof Model,
    private readonly sequelize: Sequelize
  ) {
    // Configure Decimal.js for financial precision
    Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN });
  }

  // ============================================================================
  // Contract Management Functions
  // ============================================================================

  /**
   * Creates a new revenue contract
   * @param contractData Contract creation data
   * @returns Created revenue contract
   */
  async createRevenueContract(contractData: {
    contractNumber: string;
    customerId: string;
    customerName: string;
    description?: string;
    contractDate: Date;
    startDate: Date;
    endDate: Date;
    totalContractValue: Decimal;
    currency: string;
    metadata?: Record<string, any>;
    createdBy: string;
  }): Promise<RevenueContract> {
    this.logger.log(`Creating revenue contract: ${contractData.contractNumber}`);

    const transaction = await this.sequelize.transaction();

    try {
      // Validate dates
      if (isAfter(contractData.startDate, contractData.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }

      // Check for duplicate contract number
      const existing = await this.contractModel.findOne({
        where: { contractNumber: contractData.contractNumber },
        transaction
      });

      if (existing) {
        throw new ConflictException(`Contract number ${contractData.contractNumber} already exists`);
      }

      const contract = await this.contractModel.create({
        ...contractData,
        totalContractValue: contractData.totalContractValue.toString(),
        allocatedValue: '0',
        recognizedRevenue: '0',
        deferredRevenue: contractData.totalContractValue.toString(),
        unbilledRevenue: '0',
        status: ContractStatus.DRAFT,
        modificationCount: 0
      }, { transaction });

      // Create audit entry
      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contract.id,
        action: 'CREATE_CONTRACT',
        performedBy: contractData.createdBy,
        performedAt: new Date(),
        changes: { contract: { old: null, new: contract.toJSON() } }
      }, transaction);

      await transaction.commit();

      this.logger.log(`Revenue contract created: ${contract.id}`);
      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create revenue contract: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a revenue contract by ID
   * @param contractId Contract identifier
   * @returns Revenue contract
   */
  async getRevenueContract(contractId: string): Promise<RevenueContract> {
    const contract = await this.contractModel.findByPk(contractId, {
      include: [{ model: this.obligationModel, as: 'obligations' }]
    });

    if (!contract) {
      throw new NotFoundException(`Revenue contract ${contractId} not found`);
    }

    return this.mapToRevenueContract(contract);
  }

  /**
   * Updates revenue contract status
   * @param contractId Contract identifier
   * @param status New status
   * @param userId User performing the update
   * @returns Updated contract
   */
  async updateContractStatus(
    contractId: string,
    status: ContractStatus,
    userId: string
  ): Promise<RevenueContract> {
    this.logger.log(`Updating contract ${contractId} status to ${status}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      const oldStatus = contract.status;

      // Validate status transition
      this.validateStatusTransition(oldStatus, status);

      await contract.update({
        status,
        updatedBy: userId
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'UPDATE_STATUS',
        performedBy: userId,
        performedAt: new Date(),
        changes: { status: { old: oldStatus, new: status } }
      }, transaction);

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Searches revenue contracts by criteria
   * @param criteria Search criteria
   * @returns List of matching contracts
   */
  async searchContracts(criteria: {
    customerId?: string;
    status?: ContractStatus;
    startDateFrom?: Date;
    startDateTo?: Date;
    minValue?: Decimal;
    maxValue?: Decimal;
    limit?: number;
    offset?: number;
  }): Promise<{ contracts: RevenueContract[]; total: number }> {
    const where: any = {};

    if (criteria.customerId) where.customerId = criteria.customerId;
    if (criteria.status) where.status = criteria.status;
    if (criteria.startDateFrom || criteria.startDateTo) {
      where.startDate = {};
      if (criteria.startDateFrom) where.startDate[Op.gte] = criteria.startDateFrom;
      if (criteria.startDateTo) where.startDate[Op.lte] = criteria.startDateTo;
    }
    if (criteria.minValue) {
      where.totalContractValue = { [Op.gte]: criteria.minValue.toString() };
    }
    if (criteria.maxValue) {
      where.totalContractValue = {
        ...where.totalContractValue,
        [Op.lte]: criteria.maxValue.toString()
      };
    }

    const { rows, count } = await this.contractModel.findAndCountAll({
      where,
      limit: criteria.limit || 100,
      offset: criteria.offset || 0,
      order: [['createdAt', 'DESC']]
    });

    return {
      contracts: rows.map(row => this.mapToRevenueContract(row)),
      total: count
    };
  }

  /**
   * Activates a contract and begins revenue recognition
   * @param contractId Contract identifier
   * @param userId User activating the contract
   * @returns Activated contract
   */
  async activateContract(contractId: string, userId: string): Promise<RevenueContract> {
    this.logger.log(`Activating contract ${contractId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      if (contract.status !== ContractStatus.DRAFT) {
        throw new BadRequestException('Only draft contracts can be activated');
      }

      // Verify all obligations have been allocated
      const obligations = await this.obligationModel.findAll({
        where: { contractId },
        transaction
      });

      if (obligations.length === 0) {
        throw new BadRequestException('Contract must have at least one performance obligation');
      }

      const totalAllocated = obligations.reduce(
        (sum, obl) => sum.plus(new Decimal(obl.allocatedAmount)),
        new Decimal(0)
      );

      if (!totalAllocated.equals(new Decimal(contract.totalContractValue))) {
        throw new BadRequestException(
          `Total allocated (${totalAllocated}) must equal contract value (${contract.totalContractValue})`
        );
      }

      await contract.update({
        status: ContractStatus.ACTIVE,
        updatedBy: userId
      }, { transaction });

      // Generate revenue schedules for all obligations
      for (const obligation of obligations) {
        await this.generateRevenueScheduleInternal(obligation.id, transaction);
      }

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'ACTIVATE_CONTRACT',
        performedBy: userId,
        performedAt: new Date(),
        changes: { status: { old: ContractStatus.DRAFT, new: ContractStatus.ACTIVE } }
      }, transaction);

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ============================================================================
  // Performance Obligation Management
  // ============================================================================

  /**
   * Adds a performance obligation to a contract
   * @param contractId Contract identifier
   * @param obligationData Obligation data
   * @returns Created performance obligation
   */
  async addPerformanceObligation(
    contractId: string,
    obligationData: {
      description: string;
      allocatedAmount: Decimal;
      recognitionMethod: RecognitionMethod;
      startDate: Date;
      endDate: Date;
      standaloneSellingPrice?: Decimal;
      isSeparate?: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<PerformanceObligation> {
    this.logger.log(`Adding performance obligation to contract ${contractId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      // Generate obligation number
      const obligationCount = await this.obligationModel.count({
        where: { contractId },
        transaction
      });
      const obligationNumber = `${contract.contractNumber}-OBL-${String(obligationCount + 1).padStart(3, '0')}`;

      // Verify total allocation doesn't exceed contract value
      const existingAllocations = await this.obligationModel.sum('allocatedAmount', {
        where: { contractId },
        transaction
      }) || 0;

      const totalAllocated = new Decimal(existingAllocations).plus(obligationData.allocatedAmount);
      if (totalAllocated.greaterThan(new Decimal(contract.totalContractValue))) {
        throw new BadRequestException(
          `Total allocated amount (${totalAllocated}) exceeds contract value (${contract.totalContractValue})`
        );
      }

      const obligation = await this.obligationModel.create({
        contractId,
        obligationNumber,
        description: obligationData.description,
        allocatedAmount: obligationData.allocatedAmount.toString(),
        recognizedAmount: '0',
        remainingAmount: obligationData.allocatedAmount.toString(),
        percentComplete: 0,
        recognitionMethod: obligationData.recognitionMethod,
        startDate: obligationData.startDate,
        endDate: obligationData.endDate,
        status: ObligationStatus.NOT_STARTED,
        standaloneSellingPrice: obligationData.standaloneSellingPrice?.toString(),
        isSeparate: obligationData.isSeparate ?? true,
        metadata: obligationData.metadata
      }, { transaction });

      // Update contract allocated value
      await contract.update({
        allocatedValue: totalAllocated.toString()
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'OBLIGATION',
        entityId: obligation.id,
        action: 'CREATE_OBLIGATION',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: { obligation: { old: null, new: obligation.toJSON() } }
      }, transaction);

      await transaction.commit();

      return this.mapToPerformanceObligation(obligation);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Retrieves performance obligations for a contract
   * @param contractId Contract identifier
   * @returns List of performance obligations
   */
  async getPerformanceObligations(contractId: string): Promise<PerformanceObligation[]> {
    const obligations = await this.obligationModel.findAll({
      where: { contractId },
      order: [['obligationNumber', 'ASC']]
    });

    return obligations.map(obl => this.mapToPerformanceObligation(obl));
  }

  /**
   * Updates performance obligation completion status
   * @param obligationId Obligation identifier
   * @param percentComplete Completion percentage (0-100)
   * @returns Updated obligation
   */
  async updateObligationProgress(
    obligationId: string,
    percentComplete: number
  ): Promise<PerformanceObligation> {
    this.logger.log(`Updating obligation ${obligationId} progress to ${percentComplete}%`);

    if (percentComplete < 0 || percentComplete > 100) {
      throw new BadRequestException('Percent complete must be between 0 and 100');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
      if (!obligation) {
        throw new NotFoundException(`Obligation ${obligationId} not found`);
      }

      const oldPercent = obligation.percentComplete;
      const oldStatus = obligation.status;

      // Determine new status
      let newStatus = obligation.status;
      if (percentComplete === 0) {
        newStatus = ObligationStatus.NOT_STARTED;
      } else if (percentComplete === 100) {
        newStatus = ObligationStatus.SATISFIED;
      } else if (percentComplete > 0 && percentComplete < 100) {
        newStatus = ObligationStatus.PARTIALLY_SATISFIED;
      }

      // Calculate recognized amount based on completion
      const allocatedAmount = new Decimal(obligation.allocatedAmount);
      const recognizedAmount = allocatedAmount.times(percentComplete).dividedBy(100);
      const remainingAmount = allocatedAmount.minus(recognizedAmount);

      await obligation.update({
        percentComplete,
        status: newStatus,
        recognizedAmount: recognizedAmount.toString(),
        remainingAmount: remainingAmount.toString(),
        actualCompletionDate: percentComplete === 100 ? new Date() : null
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'OBLIGATION',
        entityId: obligationId,
        action: 'UPDATE_PROGRESS',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: {
          percentComplete: { old: oldPercent, new: percentComplete },
          status: { old: oldStatus, new: newStatus }
        }
      }, transaction);

      await transaction.commit();

      return this.mapToPerformanceObligation(obligation);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Marks a performance obligation as satisfied
   * @param obligationId Obligation identifier
   * @param userId User marking as satisfied
   * @returns Updated obligation
   */
  async satisfyPerformanceObligation(
    obligationId: string,
    userId: string
  ): Promise<PerformanceObligation> {
    return this.updateObligationProgress(obligationId, 100);
  }

  // ============================================================================
  // Transaction Price Allocation
  // ============================================================================

  /**
   * Allocates transaction price across performance obligations
   * @param contractId Contract identifier
   * @param method Allocation method
   * @returns Allocation result
   */
  async allocateTransactionPrice(
    contractId: string,
    method: AllocationMethod
  ): Promise<TransactionPriceAllocation> {
    this.logger.log(`Allocating transaction price for contract ${contractId} using ${method}`);

    const contract = await this.contractModel.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract ${contractId} not found`);
    }

    const obligations = await this.obligationModel.findAll({
      where: { contractId }
    });

    if (obligations.length === 0) {
      throw new BadRequestException('Contract must have at least one performance obligation');
    }

    const totalTransactionPrice = new Decimal(contract.totalContractValue);
    const allocations: TransactionPriceAllocation['allocations'] = [];

    switch (method) {
      case AllocationMethod.RELATIVE_SSP:
        return this.allocateByRelativeSSP(contractId, totalTransactionPrice, obligations);

      case AllocationMethod.CONTRACTED_PRICE:
        return this.allocateByContractedPrice(contractId, totalTransactionPrice, obligations);

      case AllocationMethod.RESIDUAL:
        return this.allocateByResidual(contractId, totalTransactionPrice, obligations);

      default:
        throw new BadRequestException(`Allocation method ${method} not supported`);
    }
  }

  /**
   * Allocates price using relative standalone selling price method
   * @private
   */
  private async allocateByRelativeSSP(
    contractId: string,
    totalPrice: Decimal,
    obligations: any[]
  ): Promise<TransactionPriceAllocation> {
    const transaction = await this.sequelize.transaction();

    try {
      // Calculate total SSP
      const totalSSP = obligations.reduce((sum, obl) => {
        const ssp = obl.standaloneSellingPrice
          ? new Decimal(obl.standaloneSellingPrice)
          : new Decimal(obl.allocatedAmount);
        return sum.plus(ssp);
      }, new Decimal(0));

      if (totalSSP.isZero()) {
        throw new BadRequestException('Total standalone selling price cannot be zero');
      }

      const allocations = [];

      for (const obligation of obligations) {
        const ssp = obligation.standaloneSellingPrice
          ? new Decimal(obligation.standaloneSellingPrice)
          : new Decimal(obligation.allocatedAmount);

        const allocationPercentage = ssp.dividedBy(totalSSP).times(100).toNumber();
        const allocatedAmount = totalPrice.times(ssp).dividedBy(totalSSP);

        // Update obligation
        await obligation.update({
          allocatedAmount: allocatedAmount.toString(),
          remainingAmount: allocatedAmount.toString()
        }, { transaction });

        allocations.push({
          obligationId: obligation.id,
          description: obligation.description,
          standaloneSellingPrice: ssp,
          allocationPercentage,
          allocatedAmount
        });
      }

      await transaction.commit();

      return {
        contractId,
        totalTransactionPrice: totalPrice,
        allocationMethod: AllocationMethod.RELATIVE_SSP,
        allocations,
        allocationDate: new Date()
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Allocates price using contracted prices (no allocation)
   * @private
   */
  private async allocateByContractedPrice(
    contractId: string,
    totalPrice: Decimal,
    obligations: any[]
  ): Promise<TransactionPriceAllocation> {
    const allocations = obligations.map(obl => ({
      obligationId: obl.id,
      description: obl.description,
      standaloneSellingPrice: new Decimal(obl.allocatedAmount),
      allocationPercentage: new Decimal(obl.allocatedAmount)
        .dividedBy(totalPrice)
        .times(100)
        .toNumber(),
      allocatedAmount: new Decimal(obl.allocatedAmount)
    }));

    return {
      contractId,
      totalTransactionPrice: totalPrice,
      allocationMethod: AllocationMethod.CONTRACTED_PRICE,
      allocations,
      allocationDate: new Date()
    };
  }

  /**
   * Allocates price using residual approach
   * @private
   */
  private async allocateByResidual(
    contractId: string,
    totalPrice: Decimal,
    obligations: any[]
  ): Promise<TransactionPriceAllocation> {
    const transaction = await this.sequelize.transaction();

    try {
      // Sort obligations: those with observable SSP first, residual last
      const withSSP = obligations.filter(obl => obl.standaloneSellingPrice);
      const withoutSSP = obligations.filter(obl => !obl.standaloneSellingPrice);

      if (withoutSSP.length !== 1) {
        throw new BadRequestException('Residual approach requires exactly one obligation without SSP');
      }

      // Allocate known SSPs first
      let remainingPrice = totalPrice;
      const allocations = [];

      for (const obligation of withSSP) {
        const ssp = new Decimal(obligation.standaloneSellingPrice);
        const allocatedAmount = ssp.lessThanOrEqualTo(remainingPrice) ? ssp : remainingPrice;

        await obligation.update({
          allocatedAmount: allocatedAmount.toString(),
          remainingAmount: allocatedAmount.toString()
        }, { transaction });

        allocations.push({
          obligationId: obligation.id,
          description: obligation.description,
          standaloneSellingPrice: ssp,
          allocationPercentage: allocatedAmount.dividedBy(totalPrice).times(100).toNumber(),
          allocatedAmount
        });

        remainingPrice = remainingPrice.minus(allocatedAmount);
      }

      // Allocate residual to final obligation
      const residualObligation = withoutSSP[0];
      await residualObligation.update({
        allocatedAmount: remainingPrice.toString(),
        remainingAmount: remainingPrice.toString(),
        standaloneSellingPrice: remainingPrice.toString()
      }, { transaction });

      allocations.push({
        obligationId: residualObligation.id,
        description: residualObligation.description,
        standaloneSellingPrice: remainingPrice,
        allocationPercentage: remainingPrice.dividedBy(totalPrice).times(100).toNumber(),
        allocatedAmount: remainingPrice
      });

      await transaction.commit();

      return {
        contractId,
        totalTransactionPrice: totalPrice,
        allocationMethod: AllocationMethod.RESIDUAL,
        allocations,
        residualAmount: remainingPrice,
        allocationDate: new Date()
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Estimates standalone selling price for an obligation
   * @param obligationId Obligation identifier
   * @param method Estimation method
   * @returns SSP estimation
   */
  async estimateStandaloneSellingPrice(
    obligationId: string,
    method: SSPEstimation['estimationMethod']
  ): Promise<SSPEstimation> {
    const obligation = await this.obligationModel.findByPk(obligationId);
    if (!obligation) {
      throw new NotFoundException(`Obligation ${obligationId} not found`);
    }

    let estimatedSSP: Decimal;
    const adjustments: Array<{ reason: string; adjustment: Decimal }> = [];
    let dataPoints = 0;
    let confidenceLevel = 0;

    switch (method) {
      case 'MARKET_RATE':
        // Simulate market rate lookup
        estimatedSSP = new Decimal(obligation.allocatedAmount).times(1.15);
        adjustments.push({ reason: 'Market premium', adjustment: estimatedSSP.times(0.15) });
        dataPoints = 10;
        confidenceLevel = 0.85;
        break;

      case 'COST_PLUS':
        // Simulate cost-plus calculation
        estimatedSSP = new Decimal(obligation.allocatedAmount).times(1.30);
        adjustments.push({ reason: 'Cost-plus margin (30%)', adjustment: estimatedSSP.times(0.30) });
        dataPoints = 5;
        confidenceLevel = 0.75;
        break;

      case 'HISTORICAL':
        // Use historical pricing
        estimatedSSP = new Decimal(obligation.allocatedAmount);
        dataPoints = 20;
        confidenceLevel = 0.90;
        break;

      default:
        estimatedSSP = new Decimal(obligation.allocatedAmount);
        confidenceLevel = 0.50;
    }

    return {
      obligationId,
      description: obligation.description,
      estimatedSSP,
      estimationMethod: method,
      dataPoints,
      confidenceLevel,
      adjustments,
      estimatedAt: new Date()
    };
  }

  // ============================================================================
  // Revenue Recognition Schedule Generation
  // ============================================================================

  /**
   * Generates revenue recognition schedule for an obligation
   * @param obligationId Obligation identifier
   * @returns Revenue schedule
   */
  async generateRevenueSchedule(obligationId: string): Promise<RevenueSchedule> {
    const transaction = await this.sequelize.transaction();

    try {
      const schedule = await this.generateRevenueScheduleInternal(obligationId, transaction);
      await transaction.commit();
      return schedule;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Internal schedule generation with transaction support
   * @private
   */
  private async generateRevenueScheduleInternal(
    obligationId: string,
    transaction: Transaction
  ): Promise<RevenueSchedule> {
    const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
    if (!obligation) {
      throw new NotFoundException(`Obligation ${obligationId} not found`);
    }

    // Delete existing schedule entries
    await this.scheduleModel.destroy({
      where: { obligationId },
      transaction
    });

    const allocatedAmount = new Decimal(obligation.allocatedAmount);
    const entries: RevenueScheduleEntry[] = [];

    switch (obligation.recognitionMethod) {
      case RecognitionMethod.STRAIGHT_LINE:
        entries.push(...await this.generateStraightLineSchedule(
          obligation,
          allocatedAmount,
          transaction
        ));
        break;

      case RecognitionMethod.MILESTONE:
        entries.push(...await this.generateMilestoneSchedule(
          obligation,
          allocatedAmount,
          transaction
        ));
        break;

      case RecognitionMethod.PERCENTAGE_COMPLETION:
        entries.push(...await this.generatePercentageCompletionSchedule(
          obligation,
          allocatedAmount,
          transaction
        ));
        break;

      case RecognitionMethod.POINT_IN_TIME:
        entries.push(...await this.generatePointInTimeSchedule(
          obligation,
          allocatedAmount,
          transaction
        ));
        break;

      case RecognitionMethod.SUBSCRIPTION:
        entries.push(...await this.generateSubscriptionSchedule(
          obligation,
          allocatedAmount,
          transaction
        ));
        break;

      default:
        throw new BadRequestException(
          `Recognition method ${obligation.recognitionMethod} not supported`
        );
    }

    const totalScheduled = entries.reduce(
      (sum, entry) => sum.plus(entry.scheduledAmount),
      new Decimal(0)
    );

    return {
      obligationId,
      contractId: obligation.contractId,
      totalScheduled,
      totalRecognized: new Decimal(0),
      totalDeferred: totalScheduled,
      totalRemaining: totalScheduled,
      scheduleEntries: entries,
      recognitionMethod: obligation.recognitionMethod,
      startDate: obligation.startDate,
      endDate: obligation.endDate,
      generatedAt: new Date()
    };
  }

  /**
   * Generates straight-line recognition schedule
   * @private
   */
  private async generateStraightLineSchedule(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    const entries: RevenueScheduleEntry[] = [];
    const startDate = new Date(obligation.startDate);
    const endDate = new Date(obligation.endDate);

    // Calculate number of periods (months)
    const periods = differenceInMonths(endDate, startDate) + 1;
    const monthlyAmount = totalAmount.dividedBy(periods);

    let currentDate = startOfMonth(startDate);
    let cumulativeAmount = new Decimal(0);

    for (let i = 0; i < periods; i++) {
      const periodStart = currentDate;
      const periodEnd = endOfMonth(currentDate);

      // Adjust last period to match exactly
      const scheduledAmount = i === periods - 1
        ? totalAmount.minus(cumulativeAmount)
        : monthlyAmount;

      const entry = await this.scheduleModel.create({
        obligationId: obligation.id,
        contractId: obligation.contractId,
        scheduleDate: periodEnd,
        periodStartDate: periodStart,
        periodEndDate: periodEnd > endDate ? endDate : periodEnd,
        scheduledAmount: scheduledAmount.toString(),
        recognizedAmount: '0',
        deferredAmount: scheduledAmount.toString(),
        cumulativeRecognized: '0',
        status: ScheduleEntryStatus.SCHEDULED
      }, { transaction });

      cumulativeAmount = cumulativeAmount.plus(scheduledAmount);

      entries.push({
        id: entry.id,
        obligationId: obligation.id,
        contractId: obligation.contractId,
        scheduleDate: periodEnd,
        periodStartDate: periodStart,
        periodEndDate: periodEnd > endDate ? endDate : periodEnd,
        scheduledAmount,
        recognizedAmount: new Decimal(0),
        deferredAmount: scheduledAmount,
        cumulativeRecognized: new Decimal(0),
        status: ScheduleEntryStatus.SCHEDULED,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      });

      currentDate = addMonths(currentDate, 1);
    }

    return entries;
  }

  /**
   * Generates milestone-based recognition schedule
   * @private
   */
  private async generateMilestoneSchedule(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    // Get milestones from metadata
    const milestones = obligation.metadata?.milestones || [];

    if (milestones.length === 0) {
      // Default to quarterly milestones
      return this.generateDefaultMilestones(obligation, totalAmount, transaction);
    }

    const entries: RevenueScheduleEntry[] = [];
    let cumulativeAmount = new Decimal(0);

    for (const milestone of milestones) {
      const amount = new Decimal(milestone.amount);

      const entry = await this.scheduleModel.create({
        obligationId: obligation.id,
        contractId: obligation.contractId,
        scheduleDate: new Date(milestone.date),
        periodStartDate: obligation.startDate,
        periodEndDate: new Date(milestone.date),
        scheduledAmount: amount.toString(),
        recognizedAmount: '0',
        deferredAmount: amount.toString(),
        cumulativeRecognized: '0',
        status: ScheduleEntryStatus.SCHEDULED,
        metadata: { milestoneDescription: milestone.description }
      }, { transaction });

      cumulativeAmount = cumulativeAmount.plus(amount);

      entries.push(this.mapToScheduleEntry(entry));
    }

    return entries;
  }

  /**
   * Generates percentage completion schedule
   * @private
   */
  private async generatePercentageCompletionSchedule(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    // For percentage completion, create monthly recognition opportunities
    const entries: RevenueScheduleEntry[] = [];
    const startDate = new Date(obligation.startDate);
    const endDate = new Date(obligation.endDate);

    const periods = differenceInMonths(endDate, startDate) + 1;
    let currentDate = startOfMonth(startDate);

    for (let i = 0; i < periods; i++) {
      const periodEnd = endOfMonth(currentDate);

      const entry = await this.scheduleModel.create({
        obligationId: obligation.id,
        contractId: obligation.contractId,
        scheduleDate: periodEnd,
        periodStartDate: currentDate,
        periodEndDate: periodEnd > endDate ? endDate : periodEnd,
        scheduledAmount: '0', // Determined by actual completion
        recognizedAmount: '0',
        deferredAmount: '0',
        cumulativeRecognized: '0',
        status: ScheduleEntryStatus.SCHEDULED
      }, { transaction });

      entries.push(this.mapToScheduleEntry(entry));
      currentDate = addMonths(currentDate, 1);
    }

    return entries;
  }

  /**
   * Generates point-in-time recognition schedule
   * @private
   */
  private async generatePointInTimeSchedule(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    const entry = await this.scheduleModel.create({
      obligationId: obligation.id,
      contractId: obligation.contractId,
      scheduleDate: obligation.endDate,
      periodStartDate: obligation.startDate,
      periodEndDate: obligation.endDate,
      scheduledAmount: totalAmount.toString(),
      recognizedAmount: '0',
      deferredAmount: totalAmount.toString(),
      cumulativeRecognized: '0',
      status: ScheduleEntryStatus.SCHEDULED
    }, { transaction });

    return [this.mapToScheduleEntry(entry)];
  }

  /**
   * Generates subscription-based schedule
   * @private
   */
  private async generateSubscriptionSchedule(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    // Similar to straight-line but with monthly billing periods
    return this.generateStraightLineSchedule(obligation, totalAmount, transaction);
  }

  /**
   * Generates default quarterly milestones
   * @private
   */
  private async generateDefaultMilestones(
    obligation: any,
    totalAmount: Decimal,
    transaction: Transaction
  ): Promise<RevenueScheduleEntry[]> {
    const entries: RevenueScheduleEntry[] = [];
    const milestoneAmount = totalAmount.dividedBy(4);
    const startDate = new Date(obligation.startDate);

    for (let i = 0; i < 4; i++) {
      const milestoneDate = addMonths(startDate, (i + 1) * 3);
      const amount = i === 3 ? totalAmount.minus(milestoneAmount.times(3)) : milestoneAmount;

      const entry = await this.scheduleModel.create({
        obligationId: obligation.id,
        contractId: obligation.contractId,
        scheduleDate: milestoneDate,
        periodStartDate: startDate,
        periodEndDate: milestoneDate,
        scheduledAmount: amount.toString(),
        recognizedAmount: '0',
        deferredAmount: amount.toString(),
        cumulativeRecognized: '0',
        status: ScheduleEntryStatus.SCHEDULED,
        metadata: { milestoneDescription: `Q${i + 1} Milestone` }
      }, { transaction });

      entries.push(this.mapToScheduleEntry(entry));
    }

    return entries;
  }

  /**
   * Retrieves revenue schedule for an obligation
   * @param obligationId Obligation identifier
   * @returns Revenue schedule
   */
  async getRevenueSchedule(obligationId: string): Promise<RevenueSchedule> {
    const obligation = await this.obligationModel.findByPk(obligationId);
    if (!obligation) {
      throw new NotFoundException(`Obligation ${obligationId} not found`);
    }

    const entries = await this.scheduleModel.findAll({
      where: { obligationId },
      order: [['scheduleDate', 'ASC']]
    });

    const mappedEntries = entries.map(entry => this.mapToScheduleEntry(entry));

    const totalScheduled = mappedEntries.reduce(
      (sum, entry) => sum.plus(entry.scheduledAmount),
      new Decimal(0)
    );

    const totalRecognized = mappedEntries.reduce(
      (sum, entry) => sum.plus(entry.recognizedAmount),
      new Decimal(0)
    );

    const totalDeferred = mappedEntries.reduce(
      (sum, entry) => sum.plus(entry.deferredAmount),
      new Decimal(0)
    );

    return {
      obligationId,
      contractId: obligation.contractId,
      totalScheduled,
      totalRecognized,
      totalDeferred,
      totalRemaining: totalScheduled.minus(totalRecognized),
      scheduleEntries: mappedEntries,
      recognitionMethod: obligation.recognitionMethod,
      startDate: obligation.startDate,
      endDate: obligation.endDate,
      generatedAt: new Date()
    };
  }

  // ============================================================================
  // Revenue Recognition Execution
  // ============================================================================

  /**
   * Recognizes revenue for a specific period
   * @param contractId Contract identifier
   * @param periodEndDate End date of the recognition period
   * @returns Amount recognized
   */
  async recognizeRevenueForPeriod(
    contractId: string,
    periodEndDate: Date
  ): Promise<{ contractId: string; periodEndDate: Date; amountRecognized: Decimal }> {
    this.logger.log(`Recognizing revenue for contract ${contractId} through ${format(periodEndDate, 'yyyy-MM-dd')}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      if (contract.status !== ContractStatus.ACTIVE) {
        throw new BadRequestException('Contract must be active to recognize revenue');
      }

      // Get all scheduled entries up to period end date
      const scheduledEntries = await this.scheduleModel.findAll({
        where: {
          contractId,
          scheduleDate: { [Op.lte]: periodEndDate },
          status: ScheduleEntryStatus.SCHEDULED
        },
        transaction
      });

      let totalRecognized = new Decimal(0);

      for (const entry of scheduledEntries) {
        const scheduledAmount = new Decimal(entry.scheduledAmount);

        await entry.update({
          recognizedAmount: scheduledAmount.toString(),
          deferredAmount: '0',
          status: ScheduleEntryStatus.RECOGNIZED,
          recognitionDate: new Date()
        }, { transaction });

        totalRecognized = totalRecognized.plus(scheduledAmount);
      }

      // Update contract totals
      const currentRecognized = new Decimal(contract.recognizedRevenue);
      const currentDeferred = new Decimal(contract.deferredRevenue);

      await contract.update({
        recognizedRevenue: currentRecognized.plus(totalRecognized).toString(),
        deferredRevenue: currentDeferred.minus(totalRecognized).toString()
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'RECOGNIZE_REVENUE',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: {
          periodEndDate,
          amountRecognized: totalRecognized.toString(),
          entriesRecognized: scheduledEntries.length
        }
      }, transaction);

      await transaction.commit();

      return {
        contractId,
        periodEndDate,
        amountRecognized: totalRecognized
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Recognizes revenue based on percentage completion
   * @param obligationId Obligation identifier
   * @param percentComplete Current completion percentage
   * @returns Amount recognized
   */
  async recognizeRevenueByCompletion(
    obligationId: string,
    percentComplete: number
  ): Promise<{ obligationId: string; amountRecognized: Decimal }> {
    this.logger.log(`Recognizing revenue by completion for obligation ${obligationId}: ${percentComplete}%`);

    const transaction = await this.sequelize.transaction();

    try {
      const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
      if (!obligation) {
        throw new NotFoundException(`Obligation ${obligationId} not found`);
      }

      if (obligation.recognitionMethod !== RecognitionMethod.PERCENTAGE_COMPLETION) {
        throw new BadRequestException(
          'Obligation must use percentage completion recognition method'
        );
      }

      const allocatedAmount = new Decimal(obligation.allocatedAmount);
      const newRecognizedAmount = allocatedAmount.times(percentComplete).dividedBy(100);
      const previousRecognizedAmount = new Decimal(obligation.recognizedAmount);
      const incrementalRecognition = newRecognizedAmount.minus(previousRecognizedAmount);

      if (incrementalRecognition.lessThan(0)) {
        throw new BadRequestException('Cannot decrease recognized revenue');
      }

      // Update obligation
      await obligation.update({
        recognizedAmount: newRecognizedAmount.toString(),
        remainingAmount: allocatedAmount.minus(newRecognizedAmount).toString(),
        percentComplete
      }, { transaction });

      // Create/update schedule entry for current period
      const currentPeriodEnd = endOfMonth(new Date());

      const [scheduleEntry] = await this.scheduleModel.findOrCreate({
        where: {
          obligationId,
          scheduleDate: currentPeriodEnd
        },
        defaults: {
          contractId: obligation.contractId,
          periodStartDate: startOfMonth(new Date()),
          periodEndDate: currentPeriodEnd,
          scheduledAmount: incrementalRecognition.toString(),
          recognizedAmount: incrementalRecognition.toString(),
          deferredAmount: '0',
          cumulativeRecognized: newRecognizedAmount.toString(),
          status: ScheduleEntryStatus.RECOGNIZED,
          recognitionDate: new Date()
        },
        transaction
      });

      if (!scheduleEntry.isNewRecord) {
        const currentScheduled = new Decimal(scheduleEntry.scheduledAmount);
        const currentRecognized = new Decimal(scheduleEntry.recognizedAmount);

        await scheduleEntry.update({
          scheduledAmount: currentScheduled.plus(incrementalRecognition).toString(),
          recognizedAmount: currentRecognized.plus(incrementalRecognition).toString(),
          cumulativeRecognized: newRecognizedAmount.toString()
        }, { transaction });
      }

      await transaction.commit();

      return {
        obligationId,
        amountRecognized: incrementalRecognition
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Recognizes revenue for a milestone achievement
   * @param obligationId Obligation identifier
   * @param milestoneId Milestone identifier
   * @returns Amount recognized
   */
  async recognizeMilestoneRevenue(
    obligationId: string,
    milestoneId: string
  ): Promise<{ obligationId: string; milestoneId: string; amountRecognized: Decimal }> {
    this.logger.log(`Recognizing milestone revenue for obligation ${obligationId}, milestone ${milestoneId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
      if (!obligation) {
        throw new NotFoundException(`Obligation ${obligationId} not found`);
      }

      if (obligation.recognitionMethod !== RecognitionMethod.MILESTONE) {
        throw new BadRequestException('Obligation must use milestone recognition method');
      }

      // Find the milestone schedule entry
      const scheduleEntry = await this.scheduleModel.findOne({
        where: {
          obligationId,
          id: milestoneId,
          status: ScheduleEntryStatus.SCHEDULED
        },
        transaction
      });

      if (!scheduleEntry) {
        throw new NotFoundException(`Milestone ${milestoneId} not found or already recognized`);
      }

      const milestoneAmount = new Decimal(scheduleEntry.scheduledAmount);

      // Recognize the milestone
      await scheduleEntry.update({
        recognizedAmount: milestoneAmount.toString(),
        deferredAmount: '0',
        status: ScheduleEntryStatus.RECOGNIZED,
        recognitionDate: new Date()
      }, { transaction });

      // Update obligation
      const currentRecognized = new Decimal(obligation.recognizedAmount);
      const newRecognized = currentRecognized.plus(milestoneAmount);

      await obligation.update({
        recognizedAmount: newRecognized.toString(),
        remainingAmount: new Decimal(obligation.allocatedAmount).minus(newRecognized).toString()
      }, { transaction });

      await transaction.commit();

      return {
        obligationId,
        milestoneId,
        amountRecognized: milestoneAmount
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ============================================================================
  // Deferred and Unbilled Revenue Management
  // ============================================================================

  /**
   * Retrieves deferred revenue summary
   * @param criteria Filter criteria
   * @returns Deferred revenue summary
   */
  async getDeferredRevenueSummary(criteria: {
    contractId?: string;
    customerId?: string;
    asOfDate?: Date;
  }): Promise<DeferredRevenueSummary> {
    const asOfDate = criteria.asOfDate || new Date();
    const where: any = {};

    if (criteria.contractId) {
      where.contractId = criteria.contractId;
    }

    if (criteria.customerId) {
      const contracts = await this.contractModel.findAll({
        where: { customerId: criteria.customerId },
        attributes: ['id']
      });
      where.contractId = { [Op.in]: contracts.map(c => c.id) };
    }

    where.scheduleDate = { [Op.lte]: asOfDate };
    where.status = { [Op.in]: [ScheduleEntryStatus.SCHEDULED, ScheduleEntryStatus.DEFERRED] };

    const deferredEntries = await this.scheduleModel.findAll({
      where,
      include: [{
        model: this.contractModel,
        as: 'contract',
        attributes: ['id', 'contractNumber', 'startDate', 'endDate']
      }, {
        model: this.obligationModel,
        as: 'obligation',
        attributes: ['recognitionMethod']
      }]
    });

    let totalDeferred = new Decimal(0);
    let currentPeriodDeferred = new Decimal(0);
    let longTermDeferred = new Decimal(0);

    const oneYearFromNow = addMonths(asOfDate, 12);
    const deferredByContract = new Map<string, any>();
    const deferredByMethod = new Map<RecognitionMethod, Decimal>();

    for (const entry of deferredEntries) {
      const deferredAmount = new Decimal(entry.deferredAmount);
      totalDeferred = totalDeferred.plus(deferredAmount);

      // Classify as current or long-term
      if (isBefore(entry.scheduleDate, oneYearFromNow)) {
        currentPeriodDeferred = currentPeriodDeferred.plus(deferredAmount);
      } else {
        longTermDeferred = longTermDeferred.plus(deferredAmount);
      }

      // Group by contract
      const contractId = entry.contractId;
      if (!deferredByContract.has(contractId)) {
        deferredByContract.set(contractId, {
          contractId,
          contractNumber: entry.contract.contractNumber,
          deferredAmount: new Decimal(0),
          startDate: entry.contract.startDate,
          endDate: entry.contract.endDate
        });
      }
      const contractEntry = deferredByContract.get(contractId);
      contractEntry.deferredAmount = contractEntry.deferredAmount.plus(deferredAmount);

      // Group by recognition method
      const method = entry.obligation.recognitionMethod;
      const methodTotal = deferredByMethod.get(method) || new Decimal(0);
      deferredByMethod.set(method, methodTotal.plus(deferredAmount));
    }

    return {
      contractId: criteria.contractId,
      customerId: criteria.customerId,
      totalDeferred,
      currentPeriodDeferred,
      longTermDeferred,
      deferredByContract: Array.from(deferredByContract.values()),
      deferredByRecognitionMethod: deferredByMethod,
      asOfDate
    };
  }

  /**
   * Records unbilled revenue (contract asset)
   * @param contractId Contract identifier
   * @param amount Unbilled amount
   * @param description Description of unbilled revenue
   * @returns Updated contract
   */
  async recordUnbilledRevenue(
    contractId: string,
    amount: Decimal,
    description: string
  ): Promise<RevenueContract> {
    this.logger.log(`Recording unbilled revenue for contract ${contractId}: ${amount}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      const currentUnbilled = new Decimal(contract.unbilledRevenue);
      const newUnbilled = currentUnbilled.plus(amount);

      await contract.update({
        unbilledRevenue: newUnbilled.toString()
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'RECORD_UNBILLED_REVENUE',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: {
          amount: amount.toString(),
          description,
          unbilledRevenue: { old: currentUnbilled.toString(), new: newUnbilled.toString() }
        }
      }, transaction);

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Converts unbilled revenue to billed (upon invoicing)
   * @param contractId Contract identifier
   * @param amount Amount being billed
   * @returns Updated contract
   */
  async billUnbilledRevenue(
    contractId: string,
    amount: Decimal
  ): Promise<RevenueContract> {
    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      const currentUnbilled = new Decimal(contract.unbilledRevenue);

      if (amount.greaterThan(currentUnbilled)) {
        throw new BadRequestException(
          `Billed amount (${amount}) exceeds unbilled revenue (${currentUnbilled})`
        );
      }

      const newUnbilled = currentUnbilled.minus(amount);

      await contract.update({
        unbilledRevenue: newUnbilled.toString()
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'BILL_UNBILLED_REVENUE',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: {
          amount: amount.toString(),
          unbilledRevenue: { old: currentUnbilled.toString(), new: newUnbilled.toString() }
        }
      }, transaction);

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ============================================================================
  // Variable Consideration
  // ============================================================================

  /**
   * Calculates variable consideration with constraint
   * @param data Variable consideration data
   * @returns Variable consideration calculation
   */
  async calculateVariableConsideration(data: {
    contractId: string;
    baseAmount: Decimal;
    variableElements: Array<{
      type: string;
      description: string;
      estimatedAmount: Decimal;
      probability?: number;
      constraintFactor?: number;
    }>;
    estimationMethod: VariableEstimationMethod;
  }): Promise<VariableConsideration> {
    this.logger.log(`Calculating variable consideration for contract ${data.contractId}`);

    let variableAmount = new Decimal(0);

    switch (data.estimationMethod) {
      case VariableEstimationMethod.EXPECTED_VALUE:
        // Probability-weighted approach
        for (const element of data.variableElements) {
          const probability = element.probability || 0.5;
          const weighted = element.estimatedAmount.times(probability);
          variableAmount = variableAmount.plus(weighted);
        }
        break;

      case VariableEstimationMethod.MOST_LIKELY:
        // Single most likely outcome
        const mostLikely = data.variableElements.reduce((max, element) => {
          const prob = element.probability || 0;
          return prob > (max.probability || 0) ? element : max;
        });
        variableAmount = mostLikely.estimatedAmount;
        break;

      case VariableEstimationMethod.CONSERVATIVE:
        // Most conservative estimate (minimum)
        variableAmount = data.variableElements.reduce((min, element) => {
          return element.estimatedAmount.lessThan(min) ? element.estimatedAmount : min;
        }, new Decimal(Infinity));
        break;
    }

    // Apply constraint (ASC 606 requirement)
    const constraintApplied = this.shouldApplyConstraint(data.variableElements);
    let constrainedAmount = variableAmount;
    let constraintReason: string | undefined;

    if (constraintApplied) {
      // Apply conservative constraint (e.g., 50% reduction)
      constrainedAmount = variableAmount.times(0.5);
      constraintReason = 'High uncertainty in variable consideration - applied 50% constraint per ASC 606';
    }

    return {
      contractId: data.contractId,
      baseAmount: data.baseAmount,
      variableAmount,
      constrainedAmount,
      estimationMethod: data.estimationMethod,
      constraintApplied,
      constraintReason,
      variableElements: data.variableElements.map(el => ({
        type: el.type,
        description: el.description,
        estimatedAmount: el.estimatedAmount,
        probability: el.probability,
        constraintFactor: el.constraintFactor
      })),
      calculatedAt: new Date()
    };
  }

  /**
   * Determines if constraint should be applied to variable consideration
   * @private
   */
  private shouldApplyConstraint(variableElements: any[]): boolean {
    // Apply constraint if:
    // 1. High variability in estimates
    // 2. Low probability of favorable outcomes
    // 3. Limited experience with similar contracts

    const avgProbability = variableElements.reduce(
      (sum, el) => sum + (el.probability || 0.5),
      0
    ) / variableElements.length;

    return avgProbability < 0.7; // Apply constraint if average probability < 70%
  }

  /**
   * Updates contract with variable consideration
   * @param contractId Contract identifier
   * @param variableConsideration Variable consideration calculation
   * @returns Updated contract
   */
  async applyVariableConsideration(
    contractId: string,
    variableConsideration: VariableConsideration
  ): Promise<RevenueContract> {
    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${contractId} not found`);
      }

      const newTotalValue = variableConsideration.baseAmount.plus(
        variableConsideration.constrainedAmount
      );

      await contract.update({
        totalContractValue: newTotalValue.toString(),
        metadata: {
          ...contract.metadata,
          variableConsideration: {
            baseAmount: variableConsideration.baseAmount.toString(),
            variableAmount: variableConsideration.variableAmount.toString(),
            constrainedAmount: variableConsideration.constrainedAmount.toString(),
            appliedAt: new Date()
          }
        }
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'CONTRACT',
        entityId: contractId,
        action: 'APPLY_VARIABLE_CONSIDERATION',
        performedBy: 'SYSTEM',
        performedAt: new Date(),
        changes: {
          variableConsideration: {
            old: null,
            new: variableConsideration
          }
        }
      }, transaction);

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ============================================================================
  // Contract Modifications
  // ============================================================================

  /**
   * Records a contract modification
   * @param modificationData Modification details
   * @returns Contract modification record
   */
  async recordContractModification(modificationData: {
    contractId: string;
    modificationType: ModificationType;
    modificationDate: Date;
    effectiveDate: Date;
    description: string;
    originalValue: Decimal;
    modifiedValue: Decimal;
    impactedObligations: string[];
    approvedBy: string;
    metadata?: Record<string, any>;
  }): Promise<ContractModification> {
    this.logger.log(`Recording contract modification for ${modificationData.contractId}`);

    const transaction = await this.sequelize.transaction();

    try {
      const contract = await this.contractModel.findByPk(modificationData.contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${modificationData.contractId} not found`);
      }

      // Generate modification number
      const modCount = await this.modificationModel.count({
        where: { contractId: modificationData.contractId },
        transaction
      });
      const modificationNumber = `${contract.contractNumber}-MOD-${String(modCount + 1).padStart(3, '0')}`;

      const valueChange = modificationData.modifiedValue.minus(modificationData.originalValue);

      const modification = await this.modificationModel.create({
        contractId: modificationData.contractId,
        modificationNumber,
        modificationType: modificationData.modificationType,
        modificationDate: modificationData.modificationDate,
        effectiveDate: modificationData.effectiveDate,
        description: modificationData.description,
        originalValue: modificationData.originalValue.toString(),
        modifiedValue: modificationData.modifiedValue.toString(),
        valueChange: valueChange.toString(),
        impactedObligations: modificationData.impactedObligations,
        reallocationRequired: valueChange.abs().greaterThan(0),
        approvedBy: modificationData.approvedBy,
        approvedAt: new Date(),
        metadata: modificationData.metadata
      }, { transaction });

      // Update contract
      await contract.update({
        totalContractValue: modificationData.modifiedValue.toString(),
        modificationCount: contract.modificationCount + 1,
        lastModifiedDate: modificationData.modificationDate,
        status: ContractStatus.AMENDED
      }, { transaction });

      await this.createAuditEntry({
        entityType: 'MODIFICATION',
        entityId: modification.id,
        action: 'RECORD_MODIFICATION',
        performedBy: modificationData.approvedBy,
        performedAt: new Date(),
        changes: { modification: { old: null, new: modification.toJSON() } }
      }, transaction);

      await transaction.commit();

      return this.mapToContractModification(modification);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Applies contract modification and reallocates revenue
   * @param modificationId Modification identifier
   * @returns Updated contract
   */
  async applyContractModification(modificationId: string): Promise<RevenueContract> {
    const transaction = await this.sequelize.transaction();

    try {
      const modification = await this.modificationModel.findByPk(modificationId, { transaction });
      if (!modification) {
        throw new NotFoundException(`Modification ${modificationId} not found`);
      }

      const contract = await this.contractModel.findByPk(modification.contractId, { transaction });
      if (!contract) {
        throw new NotFoundException(`Contract ${modification.contractId} not found`);
      }

      const valueChange = new Decimal(modification.valueChange);

      switch (modification.modificationType) {
        case ModificationType.PROSPECTIVE:
          await this.applyProspectiveModification(
            modification,
            contract,
            valueChange,
            transaction
          );
          break;

        case ModificationType.CUMULATIVE_CATCHUP:
          await this.applyCumulativeCatchupModification(
            modification,
            contract,
            valueChange,
            transaction
          );
          break;

        case ModificationType.RETROSPECTIVE:
          await this.applyRetrospectiveModification(
            modification,
            contract,
            valueChange,
            transaction
          );
          break;

        default:
          throw new BadRequestException(
            `Modification type ${modification.modificationType} not yet implemented`
          );
      }

      await transaction.commit();

      return this.mapToRevenueContract(contract);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Applies prospective modification (future periods only)
   * @private
   */
  private async applyProspectiveModification(
    modification: any,
    contract: any,
    valueChange: Decimal,
    transaction: Transaction
  ): Promise<void> {
    const impactedObligations = await this.obligationModel.findAll({
      where: {
        id: { [Op.in]: modification.impactedObligations }
      },
      transaction
    });

    const today = new Date();

    for (const obligation of impactedObligations) {
      // Adjust future schedule entries only
      const futureEntries = await this.scheduleModel.findAll({
        where: {
          obligationId: obligation.id,
          scheduleDate: { [Op.gte]: today },
          status: ScheduleEntryStatus.SCHEDULED
        },
        transaction
      });

      if (futureEntries.length === 0) continue;

      const adjustmentPerEntry = valueChange.dividedBy(futureEntries.length);

      for (const entry of futureEntries) {
        const currentAmount = new Decimal(entry.scheduledAmount);
        const newAmount = currentAmount.plus(adjustmentPerEntry);

        await entry.update({
          scheduledAmount: newAmount.toString(),
          deferredAmount: newAmount.toString()
        }, { transaction });
      }
    }
  }

  /**
   * Applies cumulative catch-up modification
   * @private
   */
  private async applyCumulativeCatchupModification(
    modification: any,
    contract: any,
    valueChange: Decimal,
    transaction: Transaction
  ): Promise<void> {
    // Recognize cumulative adjustment immediately
    const currentRecognized = new Decimal(contract.recognizedRevenue);
    const currentDeferred = new Decimal(contract.deferredRevenue);

    await contract.update({
      recognizedRevenue: currentRecognized.plus(valueChange).toString(),
      deferredRevenue: currentDeferred.minus(valueChange).toString()
    }, { transaction });

    // Record adjustment entry
    await this.scheduleModel.create({
      obligationId: modification.impactedObligations[0], // Primary obligation
      contractId: contract.id,
      scheduleDate: modification.effectiveDate,
      periodStartDate: modification.effectiveDate,
      periodEndDate: modification.effectiveDate,
      scheduledAmount: valueChange.toString(),
      recognizedAmount: valueChange.toString(),
      deferredAmount: '0',
      cumulativeRecognized: currentRecognized.plus(valueChange).toString(),
      status: ScheduleEntryStatus.ADJUSTED,
      metadata: {
        modificationId: modification.id,
        modificationType: 'CUMULATIVE_CATCHUP'
      }
    }, { transaction });

    await contract.update({
      metadata: {
        ...contract.metadata,
        cumulativeAdjustment: valueChange.toString()
      }
    }, { transaction });
  }

  /**
   * Applies retrospective modification (restate prior periods)
   * @private
   */
  private async applyRetrospectiveModification(
    modification: any,
    contract: any,
    valueChange: Decimal,
    transaction: Transaction
  ): Promise<void> {
    // This would require restating all prior period entries
    // Implementation would depend on specific accounting requirements
    throw new BadRequestException('Retrospective modifications require manual accounting review');
  }

  // ============================================================================
  // Revenue Forecasting
  // ============================================================================

  /**
   * Generates revenue forecast for a contract or customer
   * @param criteria Forecast criteria
   * @returns Revenue forecast
   */
  async generateRevenueForecast(criteria: {
    contractId?: string;
    customerId?: string;
    forecastPeriod: { startDate: Date; endDate: Date };
  }): Promise<RevenueForecast> {
    this.logger.log('Generating revenue forecast');

    const where: any = {};

    if (criteria.contractId) {
      where.contractId = criteria.contractId;
    } else if (criteria.customerId) {
      const contracts = await this.contractModel.findAll({
        where: { customerId: criteria.customerId },
        attributes: ['id']
      });
      where.contractId = { [Op.in]: contracts.map(c => c.id) };
    }

    where.scheduleDate = {
      [Op.between]: [criteria.forecastPeriod.startDate, criteria.forecastPeriod.endDate]
    };

    const scheduleEntries = await this.scheduleModel.findAll({ where });

    // Calculate total forecasted revenue
    let forecastedRevenue = new Decimal(0);
    let recognizedToDate = new Decimal(0);

    for (const entry of scheduleEntries) {
      forecastedRevenue = forecastedRevenue.plus(new Decimal(entry.scheduledAmount));
      if (entry.status === ScheduleEntryStatus.RECOGNIZED) {
        recognizedToDate = recognizedToDate.plus(new Decimal(entry.recognizedAmount));
      }
    }

    const remainingToRecognize = forecastedRevenue.minus(recognizedToDate);

    // Generate monthly forecasts
    const monthlyForecasts: RevenueForecast['monthlyForecasts'] = [];
    let currentMonth = startOfMonth(criteria.forecastPeriod.startDate);
    const endMonth = startOfMonth(criteria.forecastPeriod.endDate);

    while (isBefore(currentMonth, endMonth) || currentMonth.getTime() === endMonth.getTime()) {
      const monthEnd = endOfMonth(currentMonth);

      const monthEntries = scheduleEntries.filter(entry =>
        isWithinInterval(entry.scheduleDate, { start: currentMonth, end: monthEnd })
      );

      const monthAmount = monthEntries.reduce(
        (sum, entry) => sum.plus(new Decimal(entry.scheduledAmount)),
        new Decimal(0)
      );

      monthlyForecasts.push({
        month: format(currentMonth, 'yyyy-MM'),
        forecastedAmount: monthAmount,
        probability: this.calculateForecastProbability(currentMonth, monthEntries)
      });

      currentMonth = addMonths(currentMonth, 1);
    }

    // Calculate confidence level
    const confidenceLevel = this.calculateOverallConfidence(scheduleEntries);

    return {
      forecastId: `FORECAST-${Date.now()}`,
      contractId: criteria.contractId,
      customerId: criteria.customerId,
      forecastPeriod: criteria.forecastPeriod,
      forecastedRevenue,
      recognizedToDate,
      remainingToRecognize,
      confidenceLevel,
      monthlyForecasts,
      assumptions: [
        'All performance obligations will be satisfied as scheduled',
        'No contract modifications anticipated',
        'Customer creditworthiness remains stable'
      ],
      risks: [
        'Contract cancellation or modification',
        'Delayed performance obligation satisfaction',
        'Economic conditions affecting customer ability to pay'
      ],
      generatedAt: new Date()
    };
  }

  /**
   * Calculates forecast probability for a specific month
   * @private
   */
  private calculateForecastProbability(month: Date, entries: any[]): number {
    const today = new Date();
    const monthsOut = differenceInMonths(month, today);

    // Near-term forecasts are more certain
    if (monthsOut <= 1) return 0.95;
    if (monthsOut <= 3) return 0.90;
    if (monthsOut <= 6) return 0.85;
    if (monthsOut <= 12) return 0.75;
    return 0.65;
  }

  /**
   * Calculates overall forecast confidence
   * @private
   */
  private calculateOverallConfidence(entries: any[]): number {
    const recognizedCount = entries.filter(
      e => e.status === ScheduleEntryStatus.RECOGNIZED
    ).length;
    const totalCount = entries.length;

    if (totalCount === 0) return 0.5;

    // Higher confidence if more entries already recognized
    const recognizedRatio = recognizedCount / totalCount;
    return 0.7 + (recognizedRatio * 0.3); // 70-100% confidence range
  }

  // ============================================================================
  // Revenue Waterfall and Analytics
  // ============================================================================

  /**
   * Generates revenue waterfall for a period
   * @param contractId Contract identifier
   * @param periodStart Period start date
   * @param periodEnd Period end date
   * @returns Revenue waterfall
   */
  async generateRevenueWaterfall(
    contractId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<RevenueWaterfall> {
    this.logger.log(`Generating revenue waterfall for contract ${contractId}`);

    const contract = await this.contractModel.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract ${contractId} not found`);
    }

    // Get opening deferred balance
    const openingEntries = await this.scheduleModel.findAll({
      where: {
        contractId,
        scheduleDate: { [Op.lt]: periodStart },
        status: { [Op.in]: [ScheduleEntryStatus.SCHEDULED, ScheduleEntryStatus.DEFERRED] }
      }
    });

    const openingDeferred = openingEntries.reduce(
      (sum, entry) => sum.plus(new Decimal(entry.deferredAmount)),
      new Decimal(0)
    );

    // Get period activity
    const periodEntries = await this.scheduleModel.findAll({
      where: {
        contractId,
        scheduleDate: {
          [Op.between]: [periodStart, periodEnd]
        }
      }
    });

    const billedAmount = periodEntries.reduce(
      (sum, entry) => sum.plus(new Decimal(entry.scheduledAmount)),
      new Decimal(0)
    );

    const recognizedRevenue = periodEntries
      .filter(e => e.status === ScheduleEntryStatus.RECOGNIZED)
      .reduce(
        (sum, entry) => sum.plus(new Decimal(entry.recognizedAmount)),
        new Decimal(0)
      );

    // Calculate closing balances
    const closingDeferred = openingDeferred.plus(billedAmount).minus(recognizedRevenue);
    const unbilledRevenue = new Decimal(contract.unbilledRevenue);

    // Build waterfall steps
    const steps = [];
    let runningBalance = openingDeferred;

    steps.push({
      step: '1',
      description: 'Opening Deferred Revenue',
      amount: openingDeferred,
      runningBalance
    });

    runningBalance = runningBalance.plus(billedAmount);
    steps.push({
      step: '2',
      description: 'Add: Billed Revenue',
      amount: billedAmount,
      runningBalance
    });

    runningBalance = runningBalance.minus(recognizedRevenue);
    steps.push({
      step: '3',
      description: 'Less: Revenue Recognized',
      amount: recognizedRevenue.negated(),
      runningBalance
    });

    steps.push({
      step: '4',
      description: 'Closing Deferred Revenue',
      amount: closingDeferred,
      runningBalance
    });

    steps.push({
      step: '5',
      description: 'Unbilled Revenue (Contract Asset)',
      amount: unbilledRevenue,
      runningBalance: runningBalance.plus(unbilledRevenue)
    });

    return {
      contractId,
      periodStart,
      periodEnd,
      openingDeferred,
      billedAmount,
      recognizedRevenue,
      closingDeferred,
      unbilledRevenue,
      steps,
      calculatedAt: new Date()
    };
  }

  /**
   * Generates comprehensive revenue analytics
   * @param criteria Analysis criteria
   * @returns Revenue analytics
   */
  async getRevenueAnalytics(criteria: {
    customerId?: string;
    startDate: Date;
    endDate: Date;
  }): Promise<{
    totalContracts: number;
    totalContractValue: Decimal;
    totalRecognized: Decimal;
    totalDeferred: Decimal;
    recognitionRate: number;
    byRecognitionMethod: Map<RecognitionMethod, { count: number; value: Decimal }>;
    byStatus: Map<ContractStatus, { count: number; value: Decimal }>;
    monthlyTrend: Array<{ month: string; recognized: Decimal; deferred: Decimal }>;
  }> {
    const where: any = {
      startDate: { [Op.lte]: criteria.endDate },
      endDate: { [Op.gte]: criteria.startDate }
    };

    if (criteria.customerId) {
      where.customerId = criteria.customerId;
    }

    const contracts = await this.contractModel.findAll({
      where,
      include: [{
        model: this.obligationModel,
        as: 'obligations'
      }]
    });

    let totalContractValue = new Decimal(0);
    let totalRecognized = new Decimal(0);
    let totalDeferred = new Decimal(0);

    const byRecognitionMethod = new Map<RecognitionMethod, { count: number; value: Decimal }>();
    const byStatus = new Map<ContractStatus, { count: number; value: Decimal }>();

    for (const contract of contracts) {
      const value = new Decimal(contract.totalContractValue);
      totalContractValue = totalContractValue.plus(value);
      totalRecognized = totalRecognized.plus(new Decimal(contract.recognizedRevenue));
      totalDeferred = totalDeferred.plus(new Decimal(contract.deferredRevenue));

      // Group by status
      const statusEntry = byStatus.get(contract.status) || { count: 0, value: new Decimal(0) };
      statusEntry.count++;
      statusEntry.value = statusEntry.value.plus(value);
      byStatus.set(contract.status, statusEntry);

      // Group by recognition method
      for (const obligation of contract.obligations || []) {
        const method = obligation.recognitionMethod;
        const methodEntry = byRecognitionMethod.get(method) || { count: 0, value: new Decimal(0) };
        methodEntry.count++;
        methodEntry.value = methodEntry.value.plus(new Decimal(obligation.allocatedAmount));
        byRecognitionMethod.set(method, methodEntry);
      }
    }

    const recognitionRate = totalContractValue.isZero()
      ? 0
      : totalRecognized.dividedBy(totalContractValue).times(100).toNumber();

    // Generate monthly trend
    const monthlyTrend = [];
    let currentMonth = startOfMonth(criteria.startDate);
    const endMonth = startOfMonth(criteria.endDate);

    while (isBefore(currentMonth, endMonth) || currentMonth.getTime() === endMonth.getTime()) {
      const monthEnd = endOfMonth(currentMonth);

      const monthEntries = await this.scheduleModel.findAll({
        where: {
          contractId: { [Op.in]: contracts.map(c => c.id) },
          scheduleDate: {
            [Op.between]: [currentMonth, monthEnd]
          }
        }
      });

      const recognized = monthEntries
        .filter(e => e.status === ScheduleEntryStatus.RECOGNIZED)
        .reduce((sum, e) => sum.plus(new Decimal(e.recognizedAmount)), new Decimal(0));

      const deferred = monthEntries
        .filter(e => e.status === ScheduleEntryStatus.SCHEDULED)
        .reduce((sum, e) => sum.plus(new Decimal(e.deferredAmount)), new Decimal(0));

      monthlyTrend.push({
        month: format(currentMonth, 'yyyy-MM'),
        recognized,
        deferred
      });

      currentMonth = addMonths(currentMonth, 1);
    }

    return {
      totalContracts: contracts.length,
      totalContractValue,
      totalRecognized,
      totalDeferred,
      recognitionRate,
      byRecognitionMethod,
      byStatus,
      monthlyTrend
    };
  }

  // ============================================================================
  // Audit and Compliance
  // ============================================================================

  /**
   * Creates an audit trail entry
   * @private
   */
  private async createAuditEntry(
    entry: Omit<RevenueAuditEntry, 'id' | 'createdAt'>,
    transaction?: Transaction
  ): Promise<void> {
    await this.auditModel.create(entry, { transaction });
  }

  /**
   * Retrieves audit trail for an entity
   * @param entityType Entity type
   * @param entityId Entity identifier
   * @returns Audit entries
   */
  async getAuditTrail(
    entityType: RevenueAuditEntry['entityType'],
    entityId: string
  ): Promise<RevenueAuditEntry[]> {
    const entries = await this.auditModel.findAll({
      where: { entityType, entityId },
      order: [['performedAt', 'DESC']]
    });

    return entries.map(entry => entry.toJSON() as RevenueAuditEntry);
  }

  /**
   * Validates ASC 606 compliance for a contract
   * @param contractId Contract identifier
   * @returns Compliance validation result
   */
  async validateASC606Compliance(contractId: string): Promise<{
    isCompliant: boolean;
    validations: Array<{
      criterion: string;
      passed: boolean;
      message: string;
    }>;
  }> {
    const contract = await this.contractModel.findByPk(contractId);
    if (!contract) {
      throw new NotFoundException(`Contract ${contractId} not found`);
    }

    const obligations = await this.obligationModel.findAll({
      where: { contractId }
    });

    const validations = [];

    // Step 1: Identify the contract
    validations.push({
      criterion: 'Contract Identification',
      passed: !!contract.contractNumber && !!contract.customerId,
      message: 'Contract properly identified with number and customer'
    });

    // Step 2: Identify performance obligations
    validations.push({
      criterion: 'Performance Obligations',
      passed: obligations.length > 0,
      message: `${obligations.length} performance obligation(s) identified`
    });

    // Step 3: Determine transaction price
    const totalValue = new Decimal(contract.totalContractValue);
    validations.push({
      criterion: 'Transaction Price',
      passed: totalValue.greaterThan(0),
      message: `Transaction price determined: ${totalValue}`
    });

    // Step 4: Allocate transaction price
    const totalAllocated = obligations.reduce(
      (sum, obl) => sum.plus(new Decimal(obl.allocatedAmount)),
      new Decimal(0)
    );
    const allocationMatches = totalValue.equals(totalAllocated);
    validations.push({
      criterion: 'Transaction Price Allocation',
      passed: allocationMatches,
      message: allocationMatches
        ? 'Transaction price fully allocated to performance obligations'
        : `Allocation mismatch: ${totalAllocated} allocated vs ${totalValue} total`
    });

    // Step 5: Recognize revenue when obligations satisfied
    const hasSchedules = await this.scheduleModel.count({
      where: { contractId }
    }) > 0;
    validations.push({
      criterion: 'Revenue Recognition Schedule',
      passed: hasSchedules,
      message: hasSchedules
        ? 'Revenue recognition schedules established'
        : 'No revenue recognition schedules found'
    });

    const isCompliant = validations.every(v => v.passed);

    return { isCompliant, validations };
  }

  /**
   * Generates ASC 606 disclosure report
   * @param criteria Report criteria
   * @returns Disclosure report data
   */
  async generateASC606DisclosureReport(criteria: {
    reportingPeriod: { startDate: Date; endDate: Date };
    customerId?: string;
  }): Promise<{
    reportingPeriod: { startDate: Date; endDate: Date };
    revenueRecognized: Decimal;
    contractAssets: Decimal;
    contractLiabilities: Decimal;
    performanceObligationsSummary: Array<{
      description: string;
      timing: string;
      method: RecognitionMethod;
      allocatedValue: Decimal;
      remainingValue: Decimal;
    }>;
    significantJudgments: string[];
  }> {
    const where: any = {
      startDate: { [Op.lte]: criteria.reportingPeriod.endDate }
    };

    if (criteria.customerId) {
      where.customerId = criteria.customerId;
    }

    const contracts = await this.contractModel.findAll({ where });

    let revenueRecognized = new Decimal(0);
    let contractAssets = new Decimal(0);
    let contractLiabilities = new Decimal(0);

    for (const contract of contracts) {
      revenueRecognized = revenueRecognized.plus(new Decimal(contract.recognizedRevenue));
      contractAssets = contractAssets.plus(new Decimal(contract.unbilledRevenue));
      contractLiabilities = contractLiabilities.plus(new Decimal(contract.deferredRevenue));
    }

    const obligations = await this.obligationModel.findAll({
      where: {
        contractId: { [Op.in]: contracts.map(c => c.id) },
        status: { [Op.ne]: ObligationStatus.SATISFIED }
      }
    });

    const performanceObligationsSummary = obligations.map(obl => ({
      description: obl.description,
      timing: this.getTimingDescription(obl.recognitionMethod),
      method: obl.recognitionMethod,
      allocatedValue: new Decimal(obl.allocatedAmount),
      remainingValue: new Decimal(obl.remainingAmount)
    }));

    return {
      reportingPeriod: criteria.reportingPeriod,
      revenueRecognized,
      contractAssets,
      contractLiabilities,
      performanceObligationsSummary,
      significantJudgments: [
        'Identification of performance obligations in bundled contracts',
        'Estimation of standalone selling prices using residual and market approaches',
        'Determination of variable consideration constraints',
        'Assessment of transfer of control timing for revenue recognition'
      ]
    };
  }

  /**
   * Gets timing description for recognition method
   * @private
   */
  private getTimingDescription(method: RecognitionMethod): string {
    switch (method) {
      case RecognitionMethod.STRAIGHT_LINE:
        return 'Over time - ratably';
      case RecognitionMethod.MILESTONE:
        return 'Over time - milestone-based';
      case RecognitionMethod.PERCENTAGE_COMPLETION:
        return 'Over time - percentage of completion';
      case RecognitionMethod.POINT_IN_TIME:
        return 'Point in time';
      case RecognitionMethod.SUBSCRIPTION:
        return 'Over time - subscription period';
      default:
        return 'Over time';
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Validates contract status transition
   * @private
   */
  private validateStatusTransition(from: ContractStatus, to: ContractStatus): void {
    const validTransitions: Record<ContractStatus, ContractStatus[]> = {
      [ContractStatus.DRAFT]: [ContractStatus.ACTIVE, ContractStatus.CANCELLED],
      [ContractStatus.ACTIVE]: [ContractStatus.AMENDED, ContractStatus.SUSPENDED, ContractStatus.COMPLETED, ContractStatus.TERMINATED],
      [ContractStatus.AMENDED]: [ContractStatus.ACTIVE, ContractStatus.SUSPENDED, ContractStatus.COMPLETED, ContractStatus.TERMINATED],
      [ContractStatus.SUSPENDED]: [ContractStatus.ACTIVE, ContractStatus.TERMINATED],
      [ContractStatus.CANCELLED]: [],
      [ContractStatus.COMPLETED]: [],
      [ContractStatus.TERMINATED]: []
    };

    if (!validTransitions[from]?.includes(to)) {
      throw new BadRequestException(`Invalid status transition from ${from} to ${to}`);
    }
  }

  /**
   * Maps database model to RevenueContract
   * @private
   */
  private mapToRevenueContract(model: any): RevenueContract {
    return {
      id: model.id,
      contractNumber: model.contractNumber,
      customerId: model.customerId,
      customerName: model.customerName,
      description: model.description,
      contractDate: model.contractDate,
      startDate: model.startDate,
      endDate: model.endDate,
      totalContractValue: new Decimal(model.totalContractValue),
      allocatedValue: new Decimal(model.allocatedValue),
      recognizedRevenue: new Decimal(model.recognizedRevenue),
      deferredRevenue: new Decimal(model.deferredRevenue),
      unbilledRevenue: new Decimal(model.unbilledRevenue),
      currency: model.currency,
      status: model.status,
      parentContractId: model.parentContractId,
      modificationCount: model.modificationCount,
      lastModifiedDate: model.lastModifiedDate,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      createdBy: model.createdBy,
      updatedBy: model.updatedBy
    };
  }

  /**
   * Maps database model to PerformanceObligation
   * @private
   */
  private mapToPerformanceObligation(model: any): PerformanceObligation {
    return {
      id: model.id,
      contractId: model.contractId,
      obligationNumber: model.obligationNumber,
      description: model.description,
      allocatedAmount: new Decimal(model.allocatedAmount),
      recognizedAmount: new Decimal(model.recognizedAmount),
      remainingAmount: new Decimal(model.remainingAmount),
      percentComplete: model.percentComplete,
      recognitionMethod: model.recognitionMethod,
      startDate: model.startDate,
      endDate: model.endDate,
      estimatedCompletionDate: model.estimatedCompletionDate,
      actualCompletionDate: model.actualCompletionDate,
      status: model.status,
      standaloneSellingPrice: model.standaloneSellingPrice ? new Decimal(model.standaloneSellingPrice) : undefined,
      isSeparate: model.isSeparate,
      parentObligationId: model.parentObligationId,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  }

  /**
   * Maps database model to RevenueScheduleEntry
   * @private
   */
  private mapToScheduleEntry(model: any): RevenueScheduleEntry {
    return {
      id: model.id,
      obligationId: model.obligationId,
      contractId: model.contractId,
      scheduleDate: model.scheduleDate,
      periodStartDate: model.periodStartDate,
      periodEndDate: model.periodEndDate,
      scheduledAmount: new Decimal(model.scheduledAmount),
      recognizedAmount: new Decimal(model.recognizedAmount),
      deferredAmount: new Decimal(model.deferredAmount),
      cumulativeRecognized: new Decimal(model.cumulativeRecognized),
      status: model.status,
      recognitionDate: model.recognitionDate,
      journalEntryId: model.journalEntryId,
      reversalEntryId: model.reversalEntryId,
      notes: model.notes,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  }

  /**
   * Maps database model to ContractModification
   * @private
   */
  private mapToContractModification(model: any): ContractModification {
    return {
      id: model.id,
      contractId: model.contractId,
      modificationNumber: model.modificationNumber,
      modificationType: model.modificationType,
      modificationDate: model.modificationDate,
      effectiveDate: model.effectiveDate,
      description: model.description,
      originalValue: new Decimal(model.originalValue),
      modifiedValue: new Decimal(model.modifiedValue),
      valueChange: new Decimal(model.valueChange),
      impactedObligations: model.impactedObligations,
      reallocationRequired: model.reallocationRequired,
      cumulativeAdjustment: model.cumulativeAdjustment ? new Decimal(model.cumulativeAdjustment) : undefined,
      approvedBy: model.approvedBy,
      approvedAt: model.approvedAt,
      metadata: model.metadata,
      createdAt: model.createdAt
    };
  }
}
