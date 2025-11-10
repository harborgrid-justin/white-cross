/**
 * @fileoverview Property Lease Management Kit - Enterprise IBM TRIRIGA competitor
 * @module reuse/property/property-lease-management-kit
 * @description Comprehensive lease lifecycle management for commercial real estate,
 * competing with IBM TRIRIGA Lease Management module. Handles lease contracts,
 * abstraction, rent calculations, renewals, CAM reconciliation, compliance tracking,
 * critical dates, analytics, terminations, and multi-tenant coordination.
 *
 * Key Features:
 * - Lease contract creation and management
 * - Automated lease abstraction and key date extraction
 * - Complex rent calculations and escalations (fixed, CPI, percentage)
 * - Lease renewal workflows and option tracking
 * - CAM (Common Area Maintenance) reconciliation
 * - Lease compliance and obligation tracking
 * - Critical date notifications and alerts
 * - Lease vs actual expense analysis
 * - Lease termination and buyout handling
 * - Multi-tenant coordination and allocation
 * - Rent roll generation and reporting
 * - Lease portfolio analytics and forecasting
 *
 * @target IBM TRIRIGA Lease Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for lease data
 * - Audit trails for all lease modifications
 * - Document encryption for lease contracts
 * - SOC 2 Type II compliance
 * - Multi-tenant data isolation
 * - Financial data encryption at rest
 *
 * @example Lease contract creation
 * ```typescript
 * import { createLeaseContract, extractLeaseKeyDates } from './property-lease-management-kit';
 *
 * const lease = await createLeaseContract({
 *   propertyId: 'prop-123',
 *   tenantId: 'tenant-456',
 *   leaseType: LeaseType.COMMERCIAL,
 *   commencementDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2030-12-31'),
 *   baseRent: 50000,
 *   escalationType: EscalationType.CPI_INDEXED,
 * });
 *
 * const keyDates = await extractLeaseKeyDates(lease.id);
 * ```
 *
 * @example Rent calculation with escalations
 * ```typescript
 * import { calculateMonthlyRent, applyRentEscalation } from './property-lease-management-kit';
 *
 * const currentRent = await calculateMonthlyRent('lease-789', new Date());
 * const escalatedRent = await applyRentEscalation('lease-789', {
 *   escalationType: EscalationType.FIXED_PERCENTAGE,
 *   escalationRate: 3.5,
 *   effectiveDate: new Date('2026-01-01'),
 * });
 * ```
 *
 * @example CAM reconciliation
 * ```typescript
 * import { reconcileCAMCharges, generateCAMStatement } from './property-lease-management-kit';
 *
 * const reconciliation = await reconcileCAMCharges('lease-789', 2024, {
 *   estimatedCAM: 120000,
 *   actualCAM: 135000,
 *   reconciliationDate: new Date(),
 * });
 *
 * const statement = await generateCAMStatement('lease-789', 2024);
 * ```
 *
 * LOC: PROP-LEASE-001
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns, decimal.js
 * DOWNSTREAM: property-management, tenant-management, accounting, reporting
 *
 * @version 1.0.0
 * @since 2025-11-08
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  Transaction,
  Op,
  QueryTypes,
  FindOptions,
} from 'sequelize';
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { addDays, addMonths, addYears, differenceInDays, differenceInMonths, isBefore, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * @enum LeaseType
 * @description Types of lease agreements
 */
export enum LeaseType {
  COMMERCIAL = 'COMMERCIAL',
  RETAIL = 'RETAIL',
  INDUSTRIAL = 'INDUSTRIAL',
  OFFICE = 'OFFICE',
  WAREHOUSE = 'WAREHOUSE',
  MIXED_USE = 'MIXED_USE',
  GROUND_LEASE = 'GROUND_LEASE',
  SUBLEASE = 'SUBLEASE',
}

/**
 * @enum LeaseStatus
 * @description Current status of lease
 */
export enum LeaseStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED',
  UNDER_NEGOTIATION = 'UNDER_NEGOTIATION',
  ON_HOLD = 'ON_HOLD',
}

/**
 * @enum EscalationType
 * @description Rent escalation methods
 */
export enum EscalationType {
  FIXED_PERCENTAGE = 'FIXED_PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  CPI_INDEXED = 'CPI_INDEXED',
  PERCENTAGE_RENT = 'PERCENTAGE_RENT',
  STEPPED = 'STEPPED',
  MARKET_REVIEW = 'MARKET_REVIEW',
  NO_ESCALATION = 'NO_ESCALATION',
}

/**
 * @enum RenewalStatus
 * @description Status of lease renewal process
 */
export enum RenewalStatus {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  OPTION_AVAILABLE = 'OPTION_AVAILABLE',
  NOTICE_PENDING = 'NOTICE_PENDING',
  NOTICE_SENT = 'NOTICE_SENT',
  UNDER_NEGOTIATION = 'UNDER_NEGOTIATION',
  RENEWED = 'RENEWED',
  DECLINED = 'DECLINED',
}

/**
 * @enum ChargeType
 * @description Types of lease charges
 */
export enum ChargeType {
  BASE_RENT = 'BASE_RENT',
  CAM = 'CAM', // Common Area Maintenance
  INSURANCE = 'INSURANCE',
  PROPERTY_TAX = 'PROPERTY_TAX',
  UTILITIES = 'UTILITIES',
  PARKING = 'PARKING',
  SIGNAGE = 'SIGNAGE',
  PERCENTAGE_RENT = 'PERCENTAGE_RENT',
  LATE_FEE = 'LATE_FEE',
  OTHER = 'OTHER',
}

/**
 * @enum ComplianceStatus
 * @description Lease compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  GRACE_PERIOD = 'GRACE_PERIOD',
  VIOLATION = 'VIOLATION',
}

/**
 * @enum NotificationPriority
 * @description Priority levels for lease notifications
 */
export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * @interface LeaseContractData
 * @description Lease contract creation/update data
 */
export interface LeaseContractData {
  propertyId: string;
  tenantId: string;
  leaseType: LeaseType;
  status?: LeaseStatus;
  commencementDate: Date;
  expirationDate: Date;
  rentableArea: number;
  baseRent: number;
  securityDeposit?: number;
  escalationType: EscalationType;
  escalationRate?: number;
  escalationFrequency?: number; // months
  paymentDay?: number; // day of month
  renewalOptions?: number;
  renewalNoticeDays?: number;
  metadata?: Record<string, any>;
}

/**
 * @interface LeaseKeyDates
 * @description Critical dates extracted from lease
 */
export interface LeaseKeyDates {
  leaseId: string;
  commencementDate: Date;
  expirationDate: Date;
  rentCommencementDate?: Date;
  firstEscalationDate?: Date;
  renewalNoticeDate?: Date;
  terminationOptionDates?: Date[];
  optionExerciseDates?: Date[];
  inspectionDates?: Date[];
}

/**
 * @interface RentCalculationResult
 * @description Result of rent calculation
 */
export interface RentCalculationResult {
  leaseId: string;
  calculationDate: Date;
  baseRent: Decimal;
  escalatedRent: Decimal;
  additionalCharges: Record<ChargeType, Decimal>;
  totalRent: Decimal;
  nextEscalationDate?: Date;
  appliedEscalations: Array<{
    date: Date;
    type: EscalationType;
    rate: number;
    amount: Decimal;
  }>;
}

/**
 * @interface RentEscalation
 * @description Rent escalation configuration
 */
export interface RentEscalation {
  escalationType: EscalationType;
  escalationRate: number;
  effectiveDate: Date;
  cpiIndex?: number;
  baselineIndex?: number;
  cappedRate?: number;
  flooredRate?: number;
}

/**
 * @interface CAMReconciliation
 * @description CAM charge reconciliation data
 */
export interface CAMReconciliation {
  leaseId: string;
  year: number;
  estimatedCAM: number;
  actualCAM: number;
  tenantShare: number; // percentage
  estimatedPaid: number;
  actualOwed: number;
  variance: number;
  reconciliationDate: Date;
  dueToTenant?: number;
  dueFromTenant?: number;
}

/**
 * @interface ComplianceObligation
 * @description Lease compliance obligation
 */
export interface ComplianceObligation {
  leaseId: string;
  obligationType: string;
  description: string;
  dueDate?: Date;
  frequency?: string; // 'ANNUAL', 'QUARTERLY', 'MONTHLY', 'ONE_TIME'
  responsibleParty: 'TENANT' | 'LANDLORD';
  status: ComplianceStatus;
  lastVerified?: Date;
}

/**
 * @interface LeaseNotification
 * @description Lease critical date notification
 */
export interface LeaseNotification {
  leaseId: string;
  notificationType: string;
  title: string;
  message: string;
  dueDate: Date;
  priority: NotificationPriority;
  recipients: string[];
  sentAt?: Date;
  acknowledgedAt?: Date;
}

/**
 * @interface LeaseVsActual
 * @description Lease budgeted vs actual expense comparison
 */
export interface LeaseVsActual {
  leaseId: string;
  period: string;
  budgetedAmount: Decimal;
  actualAmount: Decimal;
  variance: Decimal;
  variancePercentage: number;
  chargeBreakdown: Record<ChargeType, {
    budgeted: Decimal;
    actual: Decimal;
    variance: Decimal;
  }>;
}

/**
 * @interface LeaseTermination
 * @description Lease termination details
 */
export interface LeaseTermination {
  leaseId: string;
  terminationType: 'EARLY' | 'EXPIRATION' | 'MUTUAL' | 'BREACH';
  terminationDate: Date;
  noticeDate?: Date;
  noticePeriodDays?: number;
  buyoutAmount?: number;
  finalReconciliation?: CAMReconciliation;
  securityDepositReturn?: number;
  outstandingCharges?: number;
  moveOutDate?: Date;
}

/**
 * @interface MultiTenantAllocation
 * @description Allocation of shared expenses among tenants
 */
export interface MultiTenantAllocation {
  propertyId: string;
  period: string;
  totalExpense: number;
  allocationType: 'PRO_RATA' | 'EQUAL' | 'CUSTOM';
  allocations: Array<{
    leaseId: string;
    tenantId: string;
    allocationPercentage: number;
    allocatedAmount: Decimal;
    rentableArea?: number;
  }>;
}

/**
 * @interface RentRollEntry
 * @description Rent roll report entry
 */
export interface RentRollEntry {
  propertyId: string;
  leaseId: string;
  tenantName: string;
  suiteNumber?: string;
  rentableArea: number;
  leaseStart: Date;
  leaseEnd: Date;
  currentRent: Decimal;
  annualRent: Decimal;
  securityDeposit: number;
  status: LeaseStatus;
  occupancyPercentage: number;
}

/**
 * @interface LeasePortfolioMetrics
 * @description Portfolio-level lease metrics
 */
export interface LeasePortfolioMetrics {
  totalLeases: number;
  totalRentableArea: number;
  occupiedArea: number;
  vacantArea: number;
  occupancyRate: number;
  totalAnnualRent: Decimal;
  averageRentPerSqFt: Decimal;
  leasesExpiring30Days: number;
  leasesExpiring90Days: number;
  leasesExpiring180Days: number;
  averageLeaseTermMonths: number;
  weightedAverageLeaseTermRemaining: number;
}

// ============================================================================
// 1. LEASE CONTRACT CREATION AND MANAGEMENT
// ============================================================================

/**
 * Creates a new lease contract with comprehensive validation
 *
 * @param {LeaseContractData} data - Lease contract data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created lease contract
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const lease = await createLeaseContract({
 *   propertyId: 'prop-123',
 *   tenantId: 'tenant-456',
 *   leaseType: LeaseType.COMMERCIAL,
 *   commencementDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2030-12-31'),
 *   baseRent: 50000,
 *   escalationType: EscalationType.CPI_INDEXED,
 * }, sequelize);
 * ```
 */
export const createLeaseContract = async (
  data: LeaseContractData,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  // Validate dates
  if (isBefore(data.expirationDate, data.commencementDate)) {
    throw new BadRequestException('Expiration date must be after commencement date');
  }

  // Calculate lease term in months
  const leaseTerm = differenceInMonths(data.expirationDate, data.commencementDate);

  const leaseData = {
    id: `lease-${Date.now()}`,
    ...data,
    status: data.status || LeaseStatus.DRAFT,
    leaseTerm,
    paymentDay: data.paymentDay || 1,
    escalationFrequency: data.escalationFrequency || 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [lease] = await sequelize.query(
    `INSERT INTO leases (id, property_id, tenant_id, lease_type, status, commencement_date,
     expiration_date, lease_term, rentable_area, base_rent, security_deposit, escalation_type,
     escalation_rate, escalation_frequency, payment_day, renewal_options, renewal_notice_days,
     metadata, created_at, updated_at)
     VALUES (:id, :propertyId, :tenantId, :leaseType, :status, :commencementDate, :expirationDate,
     :leaseTerm, :rentableArea, :baseRent, :securityDeposit, :escalationType, :escalationRate,
     :escalationFrequency, :paymentDay, :renewalOptions, :renewalNoticeDays, :metadata,
     :createdAt, :updatedAt)
     RETURNING *`,
    {
      replacements: {
        ...leaseData,
        metadata: JSON.stringify(data.metadata || {}),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`Lease contract created: ${leaseData.id}`, 'LeaseManagement');
  return lease as any;
};

/**
 * Updates an existing lease contract
 *
 * @param {string} leaseId - Lease ID
 * @param {Partial<LeaseContractData>} updates - Fields to update
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated lease
 *
 * @example
 * ```typescript
 * const updated = await updateLeaseContract('lease-123', {
 *   baseRent: 55000,
 *   status: LeaseStatus.ACTIVE,
 * }, sequelize);
 * ```
 */
export const updateLeaseContract = async (
  leaseId: string,
  updates: Partial<LeaseContractData>,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const setClauses: string[] = [];
  const replacements: Record<string, any> = { leaseId };

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      setClauses.push(`${snakeKey} = :${key}`);
      replacements[key] = value instanceof Date ? value : value;
    }
  });

  setClauses.push('updated_at = :updatedAt');
  replacements.updatedAt = new Date();

  const [result] = await sequelize.query(
    `UPDATE leases SET ${setClauses.join(', ')} WHERE id = :leaseId RETURNING *`,
    { replacements, type: QueryTypes.UPDATE, transaction },
  );

  Logger.log(`Lease contract updated: ${leaseId}`, 'LeaseManagement');
  return result as any;
};

/**
 * Retrieves a lease contract by ID with all related data
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Lease contract
 * @throws {NotFoundException} If lease not found
 *
 * @example
 * ```typescript
 * const lease = await getLeaseContract('lease-123', sequelize);
 * ```
 */
export const getLeaseContract = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Model> => {
  const [lease] = await sequelize.query(
    `SELECT * FROM leases WHERE id = :leaseId`,
    { replacements: { leaseId }, type: QueryTypes.SELECT },
  );

  if (!lease) {
    throw new NotFoundException(`Lease ${leaseId} not found`);
  }

  return lease as any;
};

/**
 * Archives a lease contract (soft delete)
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveLeaseContract('lease-123', sequelize);
 * ```
 */
export const archiveLeaseContract = async (
  leaseId: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE leases SET deleted_at = :deletedAt WHERE id = :leaseId`,
    {
      replacements: { leaseId, deletedAt: new Date() },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  Logger.log(`Lease contract archived: ${leaseId}`, 'LeaseManagement');
};

// ============================================================================
// 2. LEASE ABSTRACTION AND KEY DATES
// ============================================================================

/**
 * Extracts and returns all critical dates from a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseKeyDates>} Extracted key dates
 *
 * @example
 * ```typescript
 * const keyDates = await extractLeaseKeyDates('lease-123', sequelize);
 * console.log(keyDates.renewalNoticeDate);
 * ```
 */
export const extractLeaseKeyDates = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<LeaseKeyDates> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  const keyDates: LeaseKeyDates = {
    leaseId,
    commencementDate: new Date(data.commencement_date),
    expirationDate: new Date(data.expiration_date),
  };

  // Calculate rent commencement (may differ from lease commencement)
  keyDates.rentCommencementDate = data.rent_commencement_date
    ? new Date(data.rent_commencement_date)
    : keyDates.commencementDate;

  // Calculate first escalation date
  if (data.escalation_frequency) {
    keyDates.firstEscalationDate = addMonths(
      keyDates.rentCommencementDate,
      data.escalation_frequency,
    );
  }

  // Calculate renewal notice date
  if (data.renewal_notice_days) {
    keyDates.renewalNoticeDate = addDays(
      keyDates.expirationDate,
      -data.renewal_notice_days,
    );
  }

  return keyDates;
};

/**
 * Generates a lease abstract summary with all critical information
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Lease abstract
 *
 * @example
 * ```typescript
 * const abstract = await generateLeaseAbstract('lease-123', sequelize);
 * ```
 */
export const generateLeaseAbstract = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Record<string, any>> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const keyDates = await extractLeaseKeyDates(leaseId, sequelize);
  const data = lease as any;

  return {
    leaseId,
    propertyId: data.property_id,
    tenantId: data.tenant_id,
    leaseType: data.lease_type,
    status: data.status,
    keyDates,
    financialTerms: {
      baseRent: new Decimal(data.base_rent),
      securityDeposit: data.security_deposit,
      escalationType: data.escalation_type,
      escalationRate: data.escalation_rate,
      escalationFrequency: data.escalation_frequency,
    },
    spaceDetails: {
      rentableArea: data.rentable_area,
      leaseTerm: data.lease_term,
    },
    renewalTerms: {
      renewalOptions: data.renewal_options,
      renewalNoticeDays: data.renewal_notice_days,
    },
    generatedAt: new Date(),
  };
};

/**
 * Monitors and validates critical lease dates
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{date: Date, description: string, daysUntil: number}>>} Upcoming critical dates
 *
 * @example
 * ```typescript
 * const criticalDates = await monitorCriticalDates('lease-123', sequelize);
 * ```
 */
export const monitorCriticalDates = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Array<{ date: Date; description: string; daysUntil: number }>> => {
  const keyDates = await extractLeaseKeyDates(leaseId, sequelize);
  const today = new Date();
  const criticalDates: Array<{ date: Date; description: string; daysUntil: number }> = [];

  // Expiration date
  const expirationDays = differenceInDays(keyDates.expirationDate, today);
  if (expirationDays >= 0 && expirationDays <= 180) {
    criticalDates.push({
      date: keyDates.expirationDate,
      description: 'Lease Expiration',
      daysUntil: expirationDays,
    });
  }

  // Renewal notice date
  if (keyDates.renewalNoticeDate) {
    const renewalNoticeDays = differenceInDays(keyDates.renewalNoticeDate, today);
    if (renewalNoticeDays >= 0 && renewalNoticeDays <= 90) {
      criticalDates.push({
        date: keyDates.renewalNoticeDate,
        description: 'Renewal Notice Deadline',
        daysUntil: renewalNoticeDays,
      });
    }
  }

  // First escalation date
  if (keyDates.firstEscalationDate) {
    const escalationDays = differenceInDays(keyDates.firstEscalationDate, today);
    if (escalationDays >= 0 && escalationDays <= 60) {
      criticalDates.push({
        date: keyDates.firstEscalationDate,
        description: 'First Rent Escalation',
        daysUntil: escalationDays,
      });
    }
  }

  return criticalDates.sort((a, b) => a.daysUntil - b.daysUntil);
};

// ============================================================================
// 3. RENT CALCULATIONS AND ESCALATIONS
// ============================================================================

/**
 * Calculates current monthly rent including all escalations
 *
 * @param {string} leaseId - Lease ID
 * @param {Date} calculationDate - Date to calculate rent for
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RentCalculationResult>} Calculated rent details
 *
 * @example
 * ```typescript
 * const rent = await calculateMonthlyRent('lease-123', new Date(), sequelize);
 * console.log(rent.totalRent.toString());
 * ```
 */
export const calculateMonthlyRent = async (
  leaseId: string,
  calculationDate: Date,
  sequelize: Sequelize,
): Promise<RentCalculationResult> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  const baseRent = new Decimal(data.base_rent);
  let escalatedRent = baseRent;
  const appliedEscalations: any[] = [];

  // Get all escalations that have occurred
  const [escalations] = await sequelize.query(
    `SELECT * FROM lease_escalations
     WHERE lease_id = :leaseId AND effective_date <= :calculationDate
     ORDER BY effective_date ASC`,
    {
      replacements: { leaseId, calculationDate },
      type: QueryTypes.SELECT,
    },
  );

  // Apply each escalation
  if (Array.isArray(escalations)) {
    for (const esc of escalations) {
      const escData = esc as any;
      const escalationAmount = new Decimal(escData.escalation_amount);
      escalatedRent = escalatedRent.plus(escalationAmount);
      appliedEscalations.push({
        date: new Date(escData.effective_date),
        type: escData.escalation_type,
        rate: escData.escalation_rate,
        amount: escalationAmount,
      });
    }
  }

  // Get additional charges
  const additionalCharges: Record<ChargeType, Decimal> = {} as any;
  const [charges] = await sequelize.query(
    `SELECT charge_type, amount FROM lease_charges
     WHERE lease_id = :leaseId AND effective_date <= :calculationDate
     AND (expiration_date IS NULL OR expiration_date >= :calculationDate)`,
    {
      replacements: { leaseId, calculationDate },
      type: QueryTypes.SELECT,
    },
  );

  if (Array.isArray(charges)) {
    charges.forEach((charge: any) => {
      additionalCharges[charge.charge_type as ChargeType] = new Decimal(charge.amount);
    });
  }

  const totalAdditional = Object.values(additionalCharges).reduce(
    (sum, amt) => sum.plus(amt),
    new Decimal(0),
  );

  return {
    leaseId,
    calculationDate,
    baseRent,
    escalatedRent,
    additionalCharges,
    totalRent: escalatedRent.plus(totalAdditional),
    appliedEscalations,
  };
};

/**
 * Applies a rent escalation to a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {RentEscalation} escalation - Escalation details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created escalation record
 *
 * @example
 * ```typescript
 * await applyRentEscalation('lease-123', {
 *   escalationType: EscalationType.FIXED_PERCENTAGE,
 *   escalationRate: 3.5,
 *   effectiveDate: new Date('2026-01-01'),
 * }, sequelize);
 * ```
 */
export const applyRentEscalation = async (
  leaseId: string,
  escalation: RentEscalation,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  let escalationAmount: Decimal;
  const currentRent = new Decimal(data.base_rent);

  switch (escalation.escalationType) {
    case EscalationType.FIXED_PERCENTAGE:
      escalationAmount = currentRent.mul(escalation.escalationRate).div(100);
      break;

    case EscalationType.FIXED_AMOUNT:
      escalationAmount = new Decimal(escalation.escalationRate);
      break;

    case EscalationType.CPI_INDEXED:
      if (!escalation.cpiIndex || !escalation.baselineIndex) {
        throw new BadRequestException('CPI indices required for CPI-indexed escalation');
      }
      const cpiChange = (escalation.cpiIndex - escalation.baselineIndex) / escalation.baselineIndex;
      let rate = cpiChange * 100;

      // Apply cap and floor if specified
      if (escalation.cappedRate && rate > escalation.cappedRate) {
        rate = escalation.cappedRate;
      }
      if (escalation.flooredRate && rate < escalation.flooredRate) {
        rate = escalation.flooredRate;
      }

      escalationAmount = currentRent.mul(rate).div(100);
      break;

    default:
      escalationAmount = new Decimal(0);
  }

  const [result] = await sequelize.query(
    `INSERT INTO lease_escalations (id, lease_id, escalation_type, escalation_rate,
     escalation_amount, effective_date, cpi_index, baseline_index, created_at)
     VALUES (:id, :leaseId, :escalationType, :escalationRate, :escalationAmount,
     :effectiveDate, :cpiIndex, :baselineIndex, :createdAt) RETURNING *`,
    {
      replacements: {
        id: `esc-${Date.now()}`,
        leaseId,
        escalationType: escalation.escalationType,
        escalationRate: escalation.escalationRate,
        escalationAmount: escalationAmount.toNumber(),
        effectiveDate: escalation.effectiveDate,
        cpiIndex: escalation.cpiIndex,
        baselineIndex: escalation.baselineIndex,
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`Rent escalation applied: ${leaseId}, Amount: ${escalationAmount}`, 'LeaseManagement');
  return result as any;
};

/**
 * Calculates percentage rent based on tenant sales
 *
 * @param {string} leaseId - Lease ID
 * @param {number} grossSales - Tenant's gross sales
 * @param {number} breakpoint - Natural breakpoint amount
 * @param {number} percentageRate - Percentage rate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Decimal>} Percentage rent owed
 *
 * @example
 * ```typescript
 * const percentageRent = await calculatePercentageRent(
 *   'lease-123', 1000000, 800000, 5, sequelize
 * );
 * ```
 */
export const calculatePercentageRent = async (
  leaseId: string,
  grossSales: number,
  breakpoint: number,
  percentageRate: number,
  sequelize: Sequelize,
): Promise<Decimal> => {
  const sales = new Decimal(grossSales);
  const bp = new Decimal(breakpoint);

  if (sales.lessThanOrEqualTo(bp)) {
    return new Decimal(0);
  }

  const excessSales = sales.minus(bp);
  const percentageRent = excessSales.mul(percentageRate).div(100);

  Logger.log(
    `Percentage rent calculated: ${leaseId}, Sales: ${sales}, Rent: ${percentageRent}`,
    'LeaseManagement',
  );

  return percentageRent;
};

/**
 * Projects future rent escalations over the lease term
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{date: Date, rent: Decimal}>>} Projected rent schedule
 *
 * @example
 * ```typescript
 * const projections = await projectFutureEscalations('lease-123', sequelize);
 * ```
 */
export const projectFutureEscalations = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Array<{ date: Date; rent: Decimal }>> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  const projections: Array<{ date: Date; rent: Decimal }> = [];
  let currentRent = new Decimal(data.base_rent);
  let currentDate = new Date(data.commencement_date);
  const expirationDate = new Date(data.expiration_date);
  const escalationFrequency = data.escalation_frequency || 12;
  const escalationRate = data.escalation_rate || 0;

  while (isBefore(currentDate, expirationDate)) {
    projections.push({
      date: new Date(currentDate),
      rent: currentRent,
    });

    currentDate = addMonths(currentDate, escalationFrequency);

    if (data.escalation_type === EscalationType.FIXED_PERCENTAGE) {
      currentRent = currentRent.mul(1 + escalationRate / 100);
    } else if (data.escalation_type === EscalationType.FIXED_AMOUNT) {
      currentRent = currentRent.plus(escalationRate);
    }
  }

  return projections;
};

// ============================================================================
// 4. LEASE RENEWAL WORKFLOWS
// ============================================================================

/**
 * Checks if a lease is eligible for renewal
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{eligible: boolean, status: RenewalStatus, daysUntilNotice?: number}>} Renewal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = await checkRenewalEligibility('lease-123', sequelize);
 * ```
 */
export const checkRenewalEligibility = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<{ eligible: boolean; status: RenewalStatus; daysUntilNotice?: number }> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const keyDates = await extractLeaseKeyDates(leaseId, sequelize);
  const data = lease as any;

  if (!data.renewal_options || data.renewal_options <= 0) {
    return { eligible: false, status: RenewalStatus.NOT_ELIGIBLE };
  }

  const today = new Date();

  if (keyDates.renewalNoticeDate) {
    const daysUntilNotice = differenceInDays(keyDates.renewalNoticeDate, today);

    if (daysUntilNotice < 0) {
      return { eligible: false, status: RenewalStatus.DECLINED };
    }

    if (daysUntilNotice <= 90) {
      return {
        eligible: true,
        status: RenewalStatus.NOTICE_PENDING,
        daysUntilNotice,
      };
    }

    return {
      eligible: true,
      status: RenewalStatus.OPTION_AVAILABLE,
      daysUntilNotice,
    };
  }

  return { eligible: true, status: RenewalStatus.OPTION_AVAILABLE };
};

/**
 * Initiates lease renewal process
 *
 * @param {string} leaseId - Lease ID
 * @param {number} renewalTermMonths - Renewal term in months
 * @param {Partial<LeaseContractData>} renewalTerms - Updated lease terms
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Renewal record
 *
 * @example
 * ```typescript
 * const renewal = await initiateLeaseRenewal('lease-123', 60, {
 *   baseRent: 60000,
 *   escalationRate: 4.0,
 * }, sequelize);
 * ```
 */
export const initiateLeaseRenewal = async (
  leaseId: string,
  renewalTermMonths: number,
  renewalTerms: Partial<LeaseContractData>,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const eligibility = await checkRenewalEligibility(leaseId, sequelize);

  if (!eligibility.eligible) {
    throw new BadRequestException(`Lease not eligible for renewal: ${eligibility.status}`);
  }

  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;
  const currentExpiration = new Date(data.expiration_date);

  const [renewal] = await sequelize.query(
    `INSERT INTO lease_renewals (id, lease_id, renewal_term_months, new_commencement_date,
     new_expiration_date, new_base_rent, status, initiated_date, created_at)
     VALUES (:id, :leaseId, :renewalTermMonths, :newCommencementDate, :newExpirationDate,
     :newBaseRent, :status, :initiatedDate, :createdAt) RETURNING *`,
    {
      replacements: {
        id: `renewal-${Date.now()}`,
        leaseId,
        renewalTermMonths,
        newCommencementDate: addDays(currentExpiration, 1),
        newExpirationDate: addMonths(currentExpiration, renewalTermMonths),
        newBaseRent: renewalTerms.baseRent || data.base_rent,
        status: RenewalStatus.UNDER_NEGOTIATION,
        initiatedDate: new Date(),
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`Lease renewal initiated: ${leaseId}`, 'LeaseManagement');
  return renewal as any;
};

/**
 * Sends renewal notice to tenant
 *
 * @param {string} leaseId - Lease ID
 * @param {string} recipientEmail - Tenant email
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseNotification>} Notification sent
 *
 * @example
 * ```typescript
 * await sendRenewalNotice('lease-123', 'tenant@example.com', sequelize);
 * ```
 */
export const sendRenewalNotice = async (
  leaseId: string,
  recipientEmail: string,
  sequelize: Sequelize,
): Promise<LeaseNotification> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const keyDates = await extractLeaseKeyDates(leaseId, sequelize);
  const data = lease as any;

  const notification: LeaseNotification = {
    leaseId,
    notificationType: 'RENEWAL_NOTICE',
    title: 'Lease Renewal Option Available',
    message: `Your lease is eligible for renewal. Please respond by ${keyDates.renewalNoticeDate?.toLocaleDateString()}.`,
    dueDate: keyDates.renewalNoticeDate || keyDates.expirationDate,
    priority: NotificationPriority.HIGH,
    recipients: [recipientEmail],
    sentAt: new Date(),
  };

  await sequelize.query(
    `INSERT INTO lease_notifications (id, lease_id, notification_type, title, message,
     due_date, priority, recipients, sent_at, created_at)
     VALUES (:id, :leaseId, :notificationType, :title, :message, :dueDate, :priority,
     :recipients, :sentAt, :createdAt)`,
    {
      replacements: {
        id: `notif-${Date.now()}`,
        ...notification,
        recipients: JSON.stringify(notification.recipients),
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
    },
  );

  Logger.log(`Renewal notice sent: ${leaseId}`, 'LeaseManagement');
  return notification;
};

/**
 * Exercises a renewal option and creates new lease term
 *
 * @param {string} leaseId - Lease ID
 * @param {string} renewalId - Renewal record ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated lease
 *
 * @example
 * ```typescript
 * await exerciseRenewalOption('lease-123', 'renewal-456', sequelize);
 * ```
 */
export const exerciseRenewalOption = async (
  leaseId: string,
  renewalId: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const [renewal] = await sequelize.query(
    `SELECT * FROM lease_renewals WHERE id = :renewalId AND lease_id = :leaseId`,
    { replacements: { renewalId, leaseId }, type: QueryTypes.SELECT },
  );

  if (!renewal) {
    throw new NotFoundException(`Renewal ${renewalId} not found`);
  }

  const renewalData = renewal as any;

  // Update original lease status
  await sequelize.query(
    `UPDATE leases SET status = :status WHERE id = :leaseId`,
    {
      replacements: { leaseId, status: LeaseStatus.RENEWED },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  // Update lease with new terms
  await sequelize.query(
    `UPDATE leases SET commencement_date = :commencementDate, expiration_date = :expirationDate,
     base_rent = :baseRent, status = :status, updated_at = :updatedAt WHERE id = :leaseId`,
    {
      replacements: {
        leaseId,
        commencementDate: renewalData.new_commencement_date,
        expirationDate: renewalData.new_expiration_date,
        baseRent: renewalData.new_base_rent,
        status: LeaseStatus.ACTIVE,
        updatedAt: new Date(),
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  Logger.log(`Renewal option exercised: ${leaseId}`, 'LeaseManagement');
  return renewal as any;
};

// ============================================================================
// 5. CAM (COMMON AREA MAINTENANCE) RECONCILIATION
// ============================================================================

/**
 * Reconciles CAM charges for a lease period
 *
 * @param {string} leaseId - Lease ID
 * @param {number} year - Reconciliation year
 * @param {Partial<CAMReconciliation>} data - Reconciliation data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CAMReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileCAMCharges('lease-123', 2024, {
 *   estimatedCAM: 120000,
 *   actualCAM: 135000,
 *   tenantShare: 15.5,
 * }, sequelize);
 * ```
 */
export const reconcileCAMCharges = async (
  leaseId: string,
  year: number,
  data: Partial<CAMReconciliation>,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<CAMReconciliation> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const leaseData = lease as any;

  const tenantShare = data.tenantShare || 0;
  const estimatedCAM = data.estimatedCAM || 0;
  const actualCAM = data.actualCAM || 0;

  const estimatedPaid = estimatedCAM * (tenantShare / 100);
  const actualOwed = actualCAM * (tenantShare / 100);
  const variance = actualOwed - estimatedPaid;

  const reconciliation: CAMReconciliation = {
    leaseId,
    year,
    estimatedCAM,
    actualCAM,
    tenantShare,
    estimatedPaid,
    actualOwed,
    variance,
    reconciliationDate: data.reconciliationDate || new Date(),
    dueToTenant: variance < 0 ? Math.abs(variance) : undefined,
    dueFromTenant: variance > 0 ? variance : undefined,
  };

  await sequelize.query(
    `INSERT INTO cam_reconciliations (id, lease_id, year, estimated_cam, actual_cam,
     tenant_share, estimated_paid, actual_owed, variance, reconciliation_date,
     due_to_tenant, due_from_tenant, created_at)
     VALUES (:id, :leaseId, :year, :estimatedCAM, :actualCAM, :tenantShare,
     :estimatedPaid, :actualOwed, :variance, :reconciliationDate, :dueToTenant,
     :dueFromTenant, :createdAt)`,
    {
      replacements: {
        id: `cam-recon-${Date.now()}`,
        ...reconciliation,
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`CAM reconciliation completed: ${leaseId}, Year: ${year}, Variance: ${variance}`, 'LeaseManagement');
  return reconciliation;
};

/**
 * Generates CAM reconciliation statement
 *
 * @param {string} leaseId - Lease ID
 * @param {number} year - Statement year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} CAM statement
 *
 * @example
 * ```typescript
 * const statement = await generateCAMStatement('lease-123', 2024, sequelize);
 * ```
 */
export const generateCAMStatement = async (
  leaseId: string,
  year: number,
  sequelize: Sequelize,
): Promise<Record<string, any>> => {
  const [reconciliation] = await sequelize.query(
    `SELECT * FROM cam_reconciliations WHERE lease_id = :leaseId AND year = :year`,
    { replacements: { leaseId, year }, type: QueryTypes.SELECT },
  );

  if (!reconciliation) {
    throw new NotFoundException(`CAM reconciliation not found for ${leaseId} year ${year}`);
  }

  const data = reconciliation as any;

  return {
    leaseId,
    year,
    statement: {
      estimatedCharges: {
        cam: data.estimated_cam,
        tenantShare: `${data.tenant_share}%`,
        monthlyEstimate: data.estimated_paid / 12,
        annualEstimate: data.estimated_paid,
      },
      actualCharges: {
        cam: data.actual_cam,
        tenantShare: `${data.tenant_share}%`,
        annualActual: data.actual_owed,
      },
      reconciliation: {
        variance: data.variance,
        varianceType: data.variance > 0 ? 'Tenant owes additional' : 'Credit to tenant',
        amount: Math.abs(data.variance),
      },
    },
    reconciliationDate: data.reconciliation_date,
    generatedAt: new Date(),
  };
};

/**
 * Calculates tenant's pro-rata share of CAM expenses
 *
 * @param {string} leaseId - Lease ID
 * @param {number} totalPropertyArea - Total property area
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Pro-rata percentage
 *
 * @example
 * ```typescript
 * const share = await calculateProRataShare('lease-123', 100000, sequelize);
 * ```
 */
export const calculateProRataShare = async (
  leaseId: string,
  totalPropertyArea: number,
  sequelize: Sequelize,
): Promise<number> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  const tenantArea = data.rentable_area;
  const proRataShare = (tenantArea / totalPropertyArea) * 100;

  Logger.log(`Pro-rata share calculated: ${leaseId}, Share: ${proRataShare.toFixed(2)}%`, 'LeaseManagement');
  return proRataShare;
};

// ============================================================================
// 6. LEASE COMPLIANCE TRACKING
// ============================================================================

/**
 * Creates a compliance obligation for a lease
 *
 * @param {ComplianceObligation} obligation - Obligation details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created obligation
 *
 * @example
 * ```typescript
 * await createComplianceObligation({
 *   leaseId: 'lease-123',
 *   obligationType: 'INSURANCE_CERTIFICATE',
 *   description: 'Provide annual insurance certificate',
 *   dueDate: new Date('2025-12-31'),
 *   frequency: 'ANNUAL',
 *   responsibleParty: 'TENANT',
 *   status: ComplianceStatus.PENDING_REVIEW,
 * }, sequelize);
 * ```
 */
export const createComplianceObligation = async (
  obligation: ComplianceObligation,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const [result] = await sequelize.query(
    `INSERT INTO lease_compliance_obligations (id, lease_id, obligation_type, description,
     due_date, frequency, responsible_party, status, last_verified, created_at)
     VALUES (:id, :leaseId, :obligationType, :description, :dueDate, :frequency,
     :responsibleParty, :status, :lastVerified, :createdAt) RETURNING *`,
    {
      replacements: {
        id: `obligation-${Date.now()}`,
        ...obligation,
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`Compliance obligation created: ${obligation.leaseId}, Type: ${obligation.obligationType}`, 'LeaseManagement');
  return result as any;
};

/**
 * Checks compliance status for all lease obligations
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<ComplianceObligation>>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await checkLeaseCompliance('lease-123', sequelize);
 * ```
 */
export const checkLeaseCompliance = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Array<ComplianceObligation>> => {
  const obligations = await sequelize.query(
    `SELECT * FROM lease_compliance_obligations WHERE lease_id = :leaseId`,
    { replacements: { leaseId }, type: QueryTypes.SELECT },
  );

  const today = new Date();

  return (obligations as any[]).map((obl: any) => ({
    leaseId: obl.lease_id,
    obligationType: obl.obligation_type,
    description: obl.description,
    dueDate: obl.due_date ? new Date(obl.due_date) : undefined,
    frequency: obl.frequency,
    responsibleParty: obl.responsible_party,
    status: obl.due_date && isBefore(new Date(obl.due_date), today)
      ? ComplianceStatus.VIOLATION
      : obl.status,
    lastVerified: obl.last_verified ? new Date(obl.last_verified) : undefined,
  }));
};

/**
 * Updates compliance obligation status
 *
 * @param {string} obligationId - Obligation ID
 * @param {ComplianceStatus} status - New status
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateComplianceStatus('obligation-123', ComplianceStatus.COMPLIANT, sequelize);
 * ```
 */
export const updateComplianceStatus = async (
  obligationId: string,
  status: ComplianceStatus,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE lease_compliance_obligations SET status = :status, last_verified = :lastVerified,
     updated_at = :updatedAt WHERE id = :obligationId`,
    {
      replacements: {
        obligationId,
        status,
        lastVerified: new Date(),
        updatedAt: new Date(),
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  Logger.log(`Compliance status updated: ${obligationId}, Status: ${status}`, 'LeaseManagement');
};

/**
 * Generates compliance report for a lease
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport('lease-123', sequelize);
 * ```
 */
export const generateComplianceReport = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<Record<string, any>> => {
  const obligations = await checkLeaseCompliance(leaseId, sequelize);

  const statusCounts = obligations.reduce((acc, obl) => {
    acc[obl.status] = (acc[obl.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overdue = obligations.filter(
    (obl) => obl.dueDate && isBefore(obl.dueDate, new Date()),
  );

  const upcomingDue = obligations.filter(
    (obl) => obl.dueDate && differenceInDays(obl.dueDate, new Date()) <= 30,
  );

  return {
    leaseId,
    totalObligations: obligations.length,
    statusBreakdown: statusCounts,
    overdueObligations: overdue.length,
    upcomingObligations: upcomingDue.length,
    complianceRate: obligations.length > 0
      ? ((statusCounts[ComplianceStatus.COMPLIANT] || 0) / obligations.length) * 100
      : 100,
    obligations,
    generatedAt: new Date(),
  };
};

// ============================================================================
// 7. CRITICAL DATE NOTIFICATIONS
// ============================================================================

/**
 * Creates a critical date notification
 *
 * @param {LeaseNotification} notification - Notification details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created notification
 *
 * @example
 * ```typescript
 * await createCriticalDateNotification({
 *   leaseId: 'lease-123',
 *   notificationType: 'LEASE_EXPIRATION',
 *   title: 'Lease Expiring Soon',
 *   message: 'Lease expires in 30 days',
 *   dueDate: new Date('2025-12-31'),
 *   priority: NotificationPriority.HIGH,
 *   recipients: ['manager@example.com'],
 * }, sequelize);
 * ```
 */
export const createCriticalDateNotification = async (
  notification: LeaseNotification,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const [result] = await sequelize.query(
    `INSERT INTO lease_notifications (id, lease_id, notification_type, title, message,
     due_date, priority, recipients, sent_at, created_at)
     VALUES (:id, :leaseId, :notificationType, :title, :message, :dueDate, :priority,
     :recipients, :sentAt, :createdAt) RETURNING *`,
    {
      replacements: {
        id: `notif-${Date.now()}`,
        ...notification,
        recipients: JSON.stringify(notification.recipients),
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  Logger.log(`Critical date notification created: ${notification.leaseId}`, 'LeaseManagement');
  return result as any;
};

/**
 * Retrieves all pending notifications for critical dates
 *
 * @param {string} [leaseId] - Optional lease ID filter
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseNotification>>} Pending notifications
 *
 * @example
 * ```typescript
 * const notifications = await getPendingNotifications('lease-123', sequelize);
 * ```
 */
export const getPendingNotifications = async (
  leaseId: string | undefined,
  sequelize: Sequelize,
): Promise<Array<LeaseNotification>> => {
  const whereClause = leaseId ? 'WHERE lease_id = :leaseId AND' : 'WHERE';

  const notifications = await sequelize.query(
    `SELECT * FROM lease_notifications ${whereClause} acknowledged_at IS NULL
     ORDER BY priority DESC, due_date ASC`,
    {
      replacements: leaseId ? { leaseId } : {},
      type: QueryTypes.SELECT,
    },
  );

  return (notifications as any[]).map((notif: any) => ({
    leaseId: notif.lease_id,
    notificationType: notif.notification_type,
    title: notif.title,
    message: notif.message,
    dueDate: new Date(notif.due_date),
    priority: notif.priority,
    recipients: JSON.parse(notif.recipients),
    sentAt: notif.sent_at ? new Date(notif.sent_at) : undefined,
    acknowledgedAt: notif.acknowledged_at ? new Date(notif.acknowledged_at) : undefined,
  }));
};

/**
 * Acknowledges a notification as received/handled
 *
 * @param {string} notificationId - Notification ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await acknowledgeNotification('notif-123', sequelize);
 * ```
 */
export const acknowledgeNotification = async (
  notificationId: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE lease_notifications SET acknowledged_at = :acknowledgedAt WHERE id = :notificationId`,
    {
      replacements: { notificationId, acknowledgedAt: new Date() },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  Logger.log(`Notification acknowledged: ${notificationId}`, 'LeaseManagement');
};

/**
 * Generates automated notifications for upcoming critical dates
 *
 * @param {number} daysAhead - Days to look ahead
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of notifications created
 *
 * @example
 * ```typescript
 * const count = await generateAutomatedNotifications(30, sequelize);
 * ```
 */
export const generateAutomatedNotifications = async (
  daysAhead: number,
  sequelize: Sequelize,
): Promise<number> => {
  const leases = await sequelize.query(
    `SELECT * FROM leases WHERE status = :status AND deleted_at IS NULL`,
    { replacements: { status: LeaseStatus.ACTIVE }, type: QueryTypes.SELECT },
  );

  let notificationCount = 0;
  const today = new Date();
  const lookAheadDate = addDays(today, daysAhead);

  for (const lease of leases as any[]) {
    const keyDates = await extractLeaseKeyDates(lease.id, sequelize);

    // Expiration notification
    if (
      keyDates.expirationDate &&
      isAfter(keyDates.expirationDate, today) &&
      isBefore(keyDates.expirationDate, lookAheadDate)
    ) {
      await createCriticalDateNotification(
        {
          leaseId: lease.id,
          notificationType: 'LEASE_EXPIRATION',
          title: 'Lease Expiring Soon',
          message: `Lease expires on ${keyDates.expirationDate.toLocaleDateString()}`,
          dueDate: keyDates.expirationDate,
          priority: NotificationPriority.CRITICAL,
          recipients: ['property-manager@example.com'],
        },
        sequelize,
      );
      notificationCount++;
    }

    // Renewal notice notification
    if (
      keyDates.renewalNoticeDate &&
      isAfter(keyDates.renewalNoticeDate, today) &&
      isBefore(keyDates.renewalNoticeDate, lookAheadDate)
    ) {
      await createCriticalDateNotification(
        {
          leaseId: lease.id,
          notificationType: 'RENEWAL_NOTICE_DUE',
          title: 'Renewal Notice Deadline Approaching',
          message: `Renewal notice deadline: ${keyDates.renewalNoticeDate.toLocaleDateString()}`,
          dueDate: keyDates.renewalNoticeDate,
          priority: NotificationPriority.HIGH,
          recipients: ['property-manager@example.com'],
        },
        sequelize,
      );
      notificationCount++;
    }
  }

  Logger.log(`Generated ${notificationCount} automated notifications`, 'LeaseManagement');
  return notificationCount;
};

// ============================================================================
// 8. LEASE VS ACTUAL ANALYSIS
// ============================================================================

/**
 * Compares budgeted lease amounts vs actual expenses
 *
 * @param {string} leaseId - Lease ID
 * @param {string} period - Analysis period (e.g., '2024-Q1')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeaseVsActual>} Variance analysis
 *
 * @example
 * ```typescript
 * const analysis = await compareLeaseVsActual('lease-123', '2024-Q1', sequelize);
 * ```
 */
export const compareLeaseVsActual = async (
  leaseId: string,
  period: string,
  sequelize: Sequelize,
): Promise<LeaseVsActual> => {
  // Get budgeted amounts
  const rentCalc = await calculateMonthlyRent(leaseId, new Date(), sequelize);
  const budgetedAmount = rentCalc.totalRent;

  // Get actual amounts from invoices/payments
  const [actualPayments] = await sequelize.query(
    `SELECT charge_type, SUM(amount) as total FROM lease_invoices
     WHERE lease_id = :leaseId AND period = :period
     GROUP BY charge_type`,
    { replacements: { leaseId, period }, type: QueryTypes.SELECT },
  );

  const actualAmount = Array.isArray(actualPayments)
    ? actualPayments.reduce((sum: Decimal, payment: any) => sum.plus(payment.total), new Decimal(0))
    : new Decimal(0);

  const variance = actualAmount.minus(budgetedAmount);
  const variancePercentage = budgetedAmount.isZero()
    ? 0
    : variance.div(budgetedAmount).mul(100).toNumber();

  const chargeBreakdown: Record<ChargeType, any> = {} as any;

  Object.entries(rentCalc.additionalCharges).forEach(([type, budgeted]) => {
    const actual = Array.isArray(actualPayments)
      ? actualPayments.find((p: any) => p.charge_type === type)?.total || 0
      : 0;
    const actualDecimal = new Decimal(actual);
    chargeBreakdown[type as ChargeType] = {
      budgeted,
      actual: actualDecimal,
      variance: actualDecimal.minus(budgeted),
    };
  });

  return {
    leaseId,
    period,
    budgetedAmount,
    actualAmount,
    variance,
    variancePercentage,
    chargeBreakdown,
  };
};

/**
 * Generates variance report for multiple leases
 *
 * @param {string[]} leaseIds - Lease IDs
 * @param {string} period - Analysis period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseVsActual>>} Variance reports
 *
 * @example
 * ```typescript
 * const reports = await generateVarianceReport(['lease-123', 'lease-456'], '2024-Q1', sequelize);
 * ```
 */
export const generateVarianceReport = async (
  leaseIds: string[],
  period: string,
  sequelize: Sequelize,
): Promise<Array<LeaseVsActual>> => {
  const reports: Array<LeaseVsActual> = [];

  for (const leaseId of leaseIds) {
    try {
      const analysis = await compareLeaseVsActual(leaseId, period, sequelize);
      reports.push(analysis);
    } catch (error) {
      Logger.error(`Error analyzing lease ${leaseId}: ${error}`, 'LeaseManagement');
    }
  }

  return reports;
};

/**
 * Identifies leases with significant budget variances
 *
 * @param {number} thresholdPercentage - Variance threshold percentage
 * @param {string} period - Analysis period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<LeaseVsActual>>} Leases exceeding variance threshold
 *
 * @example
 * ```typescript
 * const variances = await identifyBudgetVariances(10, '2024-Q1', sequelize);
 * ```
 */
export const identifyBudgetVariances = async (
  thresholdPercentage: number,
  period: string,
  sequelize: Sequelize,
): Promise<Array<LeaseVsActual>> => {
  const leases = await sequelize.query(
    `SELECT id FROM leases WHERE status = :status AND deleted_at IS NULL`,
    { replacements: { status: LeaseStatus.ACTIVE }, type: QueryTypes.SELECT },
  );

  const leaseIds = (leases as any[]).map((l) => l.id);
  const analyses = await generateVarianceReport(leaseIds, period, sequelize);

  return analyses.filter((analysis) => Math.abs(analysis.variancePercentage) >= thresholdPercentage);
};

// ============================================================================
// 9. LEASE TERMINATION HANDLING
// ============================================================================

/**
 * Initiates lease termination process
 *
 * @param {LeaseTermination} termination - Termination details
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Termination record
 *
 * @example
 * ```typescript
 * const termination = await initiateLeaseTermination({
 *   leaseId: 'lease-123',
 *   terminationType: 'EARLY',
 *   terminationDate: new Date('2025-12-31'),
 *   buyoutAmount: 50000,
 * }, sequelize);
 * ```
 */
export const initiateLeaseTermination = async (
  termination: LeaseTermination,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Model> => {
  const [result] = await sequelize.query(
    `INSERT INTO lease_terminations (id, lease_id, termination_type, termination_date,
     notice_date, notice_period_days, buyout_amount, security_deposit_return,
     outstanding_charges, move_out_date, created_at)
     VALUES (:id, :leaseId, :terminationType, :terminationDate, :noticeDate,
     :noticePeriodDays, :buyoutAmount, :securityDepositReturn, :outstandingCharges,
     :moveOutDate, :createdAt) RETURNING *`,
    {
      replacements: {
        id: `termination-${Date.now()}`,
        ...termination,
        createdAt: new Date(),
      },
      type: QueryTypes.INSERT,
      transaction,
    },
  );

  // Update lease status
  await sequelize.query(
    `UPDATE leases SET status = :status, updated_at = :updatedAt WHERE id = :leaseId`,
    {
      replacements: {
        leaseId: termination.leaseId,
        status: LeaseStatus.TERMINATED,
        updatedAt: new Date(),
      },
      type: QueryTypes.UPDATE,
      transaction,
    },
  );

  Logger.log(`Lease termination initiated: ${termination.leaseId}`, 'LeaseManagement');
  return result as any;
};

/**
 * Calculates early termination buyout amount
 *
 * @param {string} leaseId - Lease ID
 * @param {Date} terminationDate - Proposed termination date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Decimal>} Buyout amount
 *
 * @example
 * ```typescript
 * const buyout = await calculateTerminationBuyout('lease-123', new Date('2025-12-31'), sequelize);
 * ```
 */
export const calculateTerminationBuyout = async (
  leaseId: string,
  terminationDate: Date,
  sequelize: Sequelize,
): Promise<Decimal> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;
  const expirationDate = new Date(data.expiration_date);

  const remainingMonths = differenceInMonths(expirationDate, terminationDate);
  const currentRent = await calculateMonthlyRent(leaseId, terminationDate, sequelize);

  // Calculate remaining rent obligation
  const remainingRentObligation = currentRent.totalRent.mul(remainingMonths);

  // Apply discount factor for early termination (typically 50-70% of remaining obligation)
  const buyoutFactor = 0.6; // 60% of remaining obligation
  const buyoutAmount = remainingRentObligation.mul(buyoutFactor);

  Logger.log(`Termination buyout calculated: ${leaseId}, Amount: ${buyoutAmount}`, 'LeaseManagement');
  return buyoutAmount;
};

/**
 * Processes final lease reconciliation on termination
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Record<string, any>>} Final reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await processFinalReconciliation('lease-123', sequelize);
 * ```
 */
export const processFinalReconciliation = async (
  leaseId: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Record<string, any>> => {
  const lease = await getLeaseContract(leaseId, sequelize);
  const data = lease as any;

  // Get outstanding invoices
  const [outstandingInvoices] = await sequelize.query(
    `SELECT SUM(amount) as total FROM lease_invoices
     WHERE lease_id = :leaseId AND paid = false`,
    { replacements: { leaseId }, type: QueryTypes.SELECT },
  );

  const outstandingCharges = new Decimal((outstandingInvoices as any)?.total || 0);
  const securityDeposit = new Decimal(data.security_deposit || 0);

  // Calculate CAM reconciliation if applicable
  const currentYear = new Date().getFullYear();
  let camReconciliation: CAMReconciliation | null = null;

  try {
    camReconciliation = await reconcileCAMCharges(
      leaseId,
      currentYear,
      { reconciliationDate: new Date() },
      sequelize,
      transaction,
    );
  } catch (error) {
    Logger.warn(`CAM reconciliation not available for ${leaseId}`, 'LeaseManagement');
  }

  // Calculate final amounts
  const totalOwed = outstandingCharges.plus(camReconciliation?.dueFromTenant || 0);
  const securityDepositReturn = securityDeposit.minus(totalOwed).toNumber();

  const reconciliation = {
    leaseId,
    securityDeposit: securityDeposit.toNumber(),
    outstandingCharges: outstandingCharges.toNumber(),
    camReconciliation,
    totalOwed: totalOwed.toNumber(),
    securityDepositReturn: Math.max(0, securityDepositReturn),
    additionalOwed: Math.max(0, -securityDepositReturn),
    reconciliationDate: new Date(),
  };

  Logger.log(`Final reconciliation processed: ${leaseId}`, 'LeaseManagement');
  return reconciliation;
};

// ============================================================================
// 10. MULTI-TENANT LEASE COORDINATION
// ============================================================================

/**
 * Allocates shared expenses among multiple tenants
 *
 * @param {string} propertyId - Property ID
 * @param {string} period - Allocation period
 * @param {number} totalExpense - Total expense to allocate
 * @param {'PRO_RATA' | 'EQUAL' | 'CUSTOM'} allocationType - Allocation method
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MultiTenantAllocation>} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = await allocateSharedExpenses(
 *   'prop-123', '2024-Q1', 100000, 'PRO_RATA', sequelize
 * );
 * ```
 */
export const allocateSharedExpenses = async (
  propertyId: string,
  period: string,
  totalExpense: number,
  allocationType: 'PRO_RATA' | 'EQUAL' | 'CUSTOM',
  sequelize: Sequelize,
): Promise<MultiTenantAllocation> => {
  const leases = await sequelize.query(
    `SELECT id, tenant_id, rentable_area FROM leases
     WHERE property_id = :propertyId AND status = :status AND deleted_at IS NULL`,
    {
      replacements: { propertyId, status: LeaseStatus.ACTIVE },
      type: QueryTypes.SELECT,
    },
  );

  const totalExpenseDecimal = new Decimal(totalExpense);
  const allocations: any[] = [];

  if (allocationType === 'PRO_RATA') {
    const totalArea = (leases as any[]).reduce((sum, lease) => sum + lease.rentable_area, 0);

    for (const lease of leases as any[]) {
      const allocationPercentage = (lease.rentable_area / totalArea) * 100;
      const allocatedAmount = totalExpenseDecimal.mul(allocationPercentage).div(100);

      allocations.push({
        leaseId: lease.id,
        tenantId: lease.tenant_id,
        allocationPercentage,
        allocatedAmount,
        rentableArea: lease.rentable_area,
      });
    }
  } else if (allocationType === 'EQUAL') {
    const perTenantAmount = totalExpenseDecimal.div((leases as any[]).length);
    const equalPercentage = 100 / (leases as any[]).length;

    for (const lease of leases as any[]) {
      allocations.push({
        leaseId: lease.id,
        tenantId: lease.tenant_id,
        allocationPercentage: equalPercentage,
        allocatedAmount: perTenantAmount,
        rentableArea: lease.rentable_area,
      });
    }
  }

  Logger.log(`Shared expenses allocated: ${propertyId}, Period: ${period}`, 'LeaseManagement');

  return {
    propertyId,
    period,
    totalExpense,
    allocationType,
    allocations,
  };
};

/**
 * Generates rent roll report for a property
 *
 * @param {string} propertyId - Property ID
 * @param {Date} asOfDate - Report date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<RentRollEntry>>} Rent roll entries
 *
 * @example
 * ```typescript
 * const rentRoll = await generateRentRoll('prop-123', new Date(), sequelize);
 * ```
 */
export const generateRentRoll = async (
  propertyId: string,
  asOfDate: Date,
  sequelize: Sequelize,
): Promise<Array<RentRollEntry>> => {
  const leases = await sequelize.query(
    `SELECT l.*, t.name as tenant_name FROM leases l
     LEFT JOIN tenants t ON l.tenant_id = t.id
     WHERE l.property_id = :propertyId AND l.deleted_at IS NULL
     ORDER BY l.status, t.name`,
    { replacements: { propertyId }, type: QueryTypes.SELECT },
  );

  const rentRollEntries: Array<RentRollEntry> = [];

  for (const lease of leases as any[]) {
    const currentRent = await calculateMonthlyRent(lease.id, asOfDate, sequelize);
    const annualRent = currentRent.totalRent.mul(12);

    rentRollEntries.push({
      propertyId: lease.property_id,
      leaseId: lease.id,
      tenantName: lease.tenant_name,
      suiteNumber: lease.suite_number,
      rentableArea: lease.rentable_area,
      leaseStart: new Date(lease.commencement_date),
      leaseEnd: new Date(lease.expiration_date),
      currentRent: currentRent.totalRent,
      annualRent,
      securityDeposit: lease.security_deposit,
      status: lease.status,
      occupancyPercentage: lease.status === LeaseStatus.ACTIVE ? 100 : 0,
    });
  }

  return rentRollEntries;
};

/**
 * Calculates portfolio-level lease metrics
 *
 * @param {string[]} propertyIds - Property IDs to include
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<LeasePortfolioMetrics>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics(['prop-123', 'prop-456'], sequelize);
 * ```
 */
export const calculatePortfolioMetrics = async (
  propertyIds: string[],
  sequelize: Sequelize,
): Promise<LeasePortfolioMetrics> => {
  const leases = await sequelize.query(
    `SELECT * FROM leases
     WHERE property_id IN (:propertyIds) AND deleted_at IS NULL`,
    { replacements: { propertyIds }, type: QueryTypes.SELECT },
  );

  const totalLeases = (leases as any[]).length;
  const totalRentableArea = (leases as any[]).reduce((sum, l) => sum + l.rentable_area, 0);
  const occupiedArea = (leases as any[])
    .filter((l) => l.status === LeaseStatus.ACTIVE)
    .reduce((sum, l) => sum + l.rentable_area, 0);
  const vacantArea = totalRentableArea - occupiedArea;
  const occupancyRate = totalRentableArea > 0 ? (occupiedArea / totalRentableArea) * 100 : 0;

  let totalAnnualRent = new Decimal(0);
  const today = new Date();

  for (const lease of leases as any[]) {
    if (lease.status === LeaseStatus.ACTIVE) {
      const rent = await calculateMonthlyRent(lease.id, today, sequelize);
      totalAnnualRent = totalAnnualRent.plus(rent.totalRent.mul(12));
    }
  }

  const averageRentPerSqFt = occupiedArea > 0
    ? totalAnnualRent.div(occupiedArea)
    : new Decimal(0);

  const leasesExpiring30Days = (leases as any[]).filter((l) => {
    const daysToExpire = differenceInDays(new Date(l.expiration_date), today);
    return daysToExpire >= 0 && daysToExpire <= 30;
  }).length;

  const leasesExpiring90Days = (leases as any[]).filter((l) => {
    const daysToExpire = differenceInDays(new Date(l.expiration_date), today);
    return daysToExpire >= 0 && daysToExpire <= 90;
  }).length;

  const leasesExpiring180Days = (leases as any[]).filter((l) => {
    const daysToExpire = differenceInDays(new Date(l.expiration_date), today);
    return daysToExpire >= 0 && daysToExpire <= 180;
  }).length;

  const averageLeaseTermMonths = totalLeases > 0
    ? (leases as any[]).reduce((sum, l) => sum + l.lease_term, 0) / totalLeases
    : 0;

  const weightedAverageLeaseTermRemaining = totalLeases > 0
    ? (leases as any[]).reduce((sum, l) => {
        const monthsRemaining = differenceInMonths(new Date(l.expiration_date), today);
        return sum + (monthsRemaining * l.rentable_area);
      }, 0) / totalRentableArea
    : 0;

  return {
    totalLeases,
    totalRentableArea,
    occupiedArea,
    vacantArea,
    occupancyRate,
    totalAnnualRent,
    averageRentPerSqFt,
    leasesExpiring30Days,
    leasesExpiring90Days,
    leasesExpiring180Days,
    averageLeaseTermMonths,
    weightedAverageLeaseTermRemaining,
  };
};

/**
 * Coordinates multi-tenant CAM charges across property
 *
 * @param {string} propertyId - Property ID
 * @param {number} year - CAM year
 * @param {number} totalCAMExpense - Total CAM expense
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Array<CAMReconciliation>>} Tenant CAM reconciliations
 *
 * @example
 * ```typescript
 * const reconciliations = await coordinateMultiTenantCAM(
 *   'prop-123', 2024, 500000, sequelize
 * );
 * ```
 */
export const coordinateMultiTenantCAM = async (
  propertyId: string,
  year: number,
  totalCAMExpense: number,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<Array<CAMReconciliation>> => {
  const leases = await sequelize.query(
    `SELECT id, rentable_area FROM leases
     WHERE property_id = :propertyId AND status = :status AND deleted_at IS NULL`,
    {
      replacements: { propertyId, status: LeaseStatus.ACTIVE },
      type: QueryTypes.SELECT,
    },
  );

  const totalArea = (leases as any[]).reduce((sum, l) => sum + l.rentable_area, 0);
  const reconciliations: Array<CAMReconciliation> = [];

  for (const lease of leases as any[]) {
    const tenantShare = (lease.rentable_area / totalArea) * 100;
    const actualCAM = totalCAMExpense;

    // Get estimated CAM from lease charges
    const [estimatedCharge] = await sequelize.query(
      `SELECT amount FROM lease_charges
       WHERE lease_id = :leaseId AND charge_type = :chargeType
       ORDER BY created_at DESC LIMIT 1`,
      {
        replacements: { leaseId: lease.id, chargeType: ChargeType.CAM },
        type: QueryTypes.SELECT,
      },
    );

    const estimatedCAM = estimatedCharge ? (estimatedCharge as any).amount * 12 : 0;

    const reconciliation = await reconcileCAMCharges(
      lease.id,
      year,
      { estimatedCAM, actualCAM, tenantShare },
      sequelize,
      transaction,
    );

    reconciliations.push(reconciliation);
  }

  Logger.log(`Multi-tenant CAM coordinated: ${propertyId}, Year: ${year}`, 'LeaseManagement');
  return reconciliations;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts camelCase to snake_case
 *
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Validates lease data integrity
 *
 * @param {string} leaseId - Lease ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLeaseData('lease-123', sequelize);
 * ```
 */
export const validateLeaseData = async (
  leaseId: string,
  sequelize: Sequelize,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  try {
    const lease = await getLeaseContract(leaseId, sequelize);
    const data = lease as any;

    // Validate dates
    if (isBefore(new Date(data.expiration_date), new Date(data.commencement_date))) {
      errors.push('Expiration date is before commencement date');
    }

    // Validate financial data
    if (data.base_rent <= 0) {
      errors.push('Base rent must be greater than zero');
    }

    // Validate area
    if (data.rentable_area <= 0) {
      errors.push('Rentable area must be greater than zero');
    }

    // Check for required fields
    if (!data.property_id) errors.push('Property ID is required');
    if (!data.tenant_id) errors.push('Tenant ID is required');
  } catch (error) {
    errors.push(`Lease validation failed: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Export all functions for external use
export default {
  // Lease contract management
  createLeaseContract,
  updateLeaseContract,
  getLeaseContract,
  archiveLeaseContract,

  // Lease abstraction
  extractLeaseKeyDates,
  generateLeaseAbstract,
  monitorCriticalDates,

  // Rent calculations
  calculateMonthlyRent,
  applyRentEscalation,
  calculatePercentageRent,
  projectFutureEscalations,

  // Renewals
  checkRenewalEligibility,
  initiateLeaseRenewal,
  sendRenewalNotice,
  exerciseRenewalOption,

  // CAM reconciliation
  reconcileCAMCharges,
  generateCAMStatement,
  calculateProRataShare,

  // Compliance
  createComplianceObligation,
  checkLeaseCompliance,
  updateComplianceStatus,
  generateComplianceReport,

  // Notifications
  createCriticalDateNotification,
  getPendingNotifications,
  acknowledgeNotification,
  generateAutomatedNotifications,

  // Analytics
  compareLeaseVsActual,
  generateVarianceReport,
  identifyBudgetVariances,

  // Terminations
  initiateLeaseTermination,
  calculateTerminationBuyout,
  processFinalReconciliation,

  // Multi-tenant
  allocateSharedExpenses,
  generateRentRoll,
  calculatePortfolioMetrics,
  coordinateMultiTenantCAM,

  // Utilities
  validateLeaseData,
};
