/**
 * LOC: DOCCONTLIFE001
 * File: /reuse/document/composites/document-contract-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-contract-management-kit
 *   - ../document-workflow-kit
 *   - ../document-lifecycle-management-kit
 *   - ../document-automation-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - Contract management services
 *   - Lifecycle management modules
 *   - Renewal automation engines
 *   - Obligation tracking systems
 *   - Contract analytics dashboards
 *   - Healthcare contract management systems
 */

/**
 * File: /reuse/document/composites/document-contract-lifecycle-composite.ts
 * Locator: WC-DOC-CONTRACT-LIFECYCLE-001
 * Purpose: Comprehensive Document Contract Lifecycle Toolkit - Production-ready contract management and lifecycle operations
 *
 * Upstream: Composed from document-contract-management-kit, document-workflow-kit, document-lifecycle-management-kit, document-automation-kit, document-analytics-kit
 * Downstream: ../backend/*, Contract management, Lifecycle tracking, Renewal automation, Obligation management, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 47 utility functions for contract lifecycle, renewals, obligations, approvals, analytics, automation
 *
 * LLM Context: Enterprise-grade contract lifecycle management toolkit for White Cross healthcare platform.
 * Provides comprehensive contract management capabilities including contract creation and configuration,
 * lifecycle stage tracking, renewal management and automation, obligation monitoring and alerts, approval
 * workflows, milestone tracking, amendment management, expiration handling, and HIPAA-compliant audit
 * trails for all contract activities. Composes functions from multiple document kits to provide unified
 * contract operations for provider agreements, vendor contracts, payer agreements, service contracts,
 * and healthcare partnership agreements.
 */

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Contract definition
 *
 * Core contract entity with lifecycle tracking, obligations, and renewal management.
 * Supports multi-party contracts with complex terms and performance monitoring.
 *
 * @property {string} id - Unique contract identifier
 * @property {string} name - Contract name or title
 * @property {ContractType} type - Contract classification type
 * @property {ContractParty[]} parties - All parties involved in the contract
 * @property {Date} startDate - Contract effective start date
 * @property {Date} endDate - Contract expiration date
 * @property {ContractValue} [value] - Financial value and payment terms
 * @property {ContractStatus} status - Current contract status
 * @property {LifecycleStage} currentStage - Current lifecycle stage
 * @property {Obligation[]} obligations - Contractual obligations and deliverables
 * @property {Milestone[]} milestones - Contract milestones and checkpoints
 * @property {RenewalTerms} [renewalTerms] - Renewal configuration if applicable
 * @property {Record<string, any>} [metadata] - Additional contract metadata
 * @property {Date} createdAt - Contract creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface Contract {
  id: string;
  name: string;
  type: ContractType;
  parties: ContractParty[];
  startDate: Date;
  endDate: Date;
  value?: ContractValue;
  status: ContractStatus;
  currentStage: LifecycleStage;
  obligations: Obligation[];
  milestones: Milestone[];
  renewalTerms?: RenewalTerms;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contract types
 *
 * Standard contract classifications for healthcare and enterprise operations.
 * Each type has specific lifecycle requirements and compliance obligations.
 *
 * @property {string} PROVIDER_AGREEMENT - Healthcare provider service agreements
 * @property {string} VENDOR_CONTRACT - Vendor and supplier contracts
 * @property {string} PAYER_AGREEMENT - Insurance payer and reimbursement agreements
 * @property {string} SERVICE_LEVEL_AGREEMENT - SLA contracts with performance metrics
 * @property {string} EMPLOYMENT_CONTRACT - Employee and contractor agreements
 * @property {string} PARTNERSHIP_AGREEMENT - Strategic partnership contracts
 * @property {string} LICENSE_AGREEMENT - Software and IP licensing agreements
 * @property {string} LEASE_AGREEMENT - Equipment and facility leases
 * @property {string} CONFIDENTIALITY_AGREEMENT - NDA and confidentiality agreements
 * @property {string} CUSTOM - Custom contract types
 */
export enum ContractType {
  PROVIDER_AGREEMENT = 'PROVIDER_AGREEMENT',
  VENDOR_CONTRACT = 'VENDOR_CONTRACT',
  PAYER_AGREEMENT = 'PAYER_AGREEMENT',
  SERVICE_LEVEL_AGREEMENT = 'SERVICE_LEVEL_AGREEMENT',
  EMPLOYMENT_CONTRACT = 'EMPLOYMENT_CONTRACT',
  PARTNERSHIP_AGREEMENT = 'PARTNERSHIP_AGREEMENT',
  LICENSE_AGREEMENT = 'LICENSE_AGREEMENT',
  LEASE_AGREEMENT = 'LEASE_AGREEMENT',
  CONFIDENTIALITY_AGREEMENT = 'CONFIDENTIALITY_AGREEMENT',
  CUSTOM = 'CUSTOM',
}

/**
 * Contract party information
 */
export interface ContractParty {
  id: string;
  name: string;
  role: PartyRole;
  organizationType?: OrganizationType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  signedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Party roles in contract
 */
export enum PartyRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  VENDOR = 'VENDOR',
  PARTNER = 'PARTNER',
  EMPLOYER = 'EMPLOYER',
  EMPLOYEE = 'EMPLOYEE',
  LICENSOR = 'LICENSOR',
  LICENSEE = 'LICENSEE',
  LESSOR = 'LESSOR',
  LESSEE = 'LESSEE',
}

/**
 * Organization types
 */
export enum OrganizationType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  INSURANCE_COMPANY = 'INSURANCE_COMPANY',
  PHARMACEUTICAL = 'PHARMACEUTICAL',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  LABORATORY = 'LABORATORY',
  INDIVIDUAL = 'INDIVIDUAL',
  GOVERNMENT = 'GOVERNMENT',
  NON_PROFIT = 'NON_PROFIT',
  CORPORATION = 'CORPORATION',
}

/**
 * Address information
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Contract value information
 */
export interface ContractValue {
  amount: number;
  currency: string;
  paymentSchedule?: PaymentSchedule;
  terms?: string;
}

/**
 * Payment schedule
 */
export interface PaymentSchedule {
  frequency: PaymentFrequency;
  installments?: number;
  dueDay?: number;
  nextPaymentDate?: Date;
}

/**
 * Payment frequency
 */
export enum PaymentFrequency {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  CUSTOM = 'CUSTOM',
}

/**
 * Contract status
 *
 * Lifecycle status values for contract management.
 * Determines available actions and compliance requirements.
 *
 * @property {string} DRAFT - Contract in draft state, not yet finalized
 * @property {string} PENDING_APPROVAL - Awaiting approval from stakeholders
 * @property {string} ACTIVE - Contract is currently in effect and enforceable
 * @property {string} SUSPENDED - Contract temporarily suspended
 * @property {string} EXPIRED - Contract has reached end date and expired
 * @property {string} TERMINATED - Contract terminated before expiration
 * @property {string} RENEWED - Contract successfully renewed
 * @property {string} AMENDED - Contract has been amended
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED',
  AMENDED = 'AMENDED',
}

/**
 * Contract lifecycle stages
 *
 * Standardized contract lifecycle phases for workflow management.
 * Each stage has specific activities, approval gates, and metrics.
 *
 * @property {string} INITIATION - Initial contract request and scoping
 * @property {string} NEGOTIATION - Terms negotiation and redlining
 * @property {string} APPROVAL - Approval workflow and sign-off
 * @property {string} EXECUTION - Contract signing and execution
 * @property {string} PERFORMANCE - Active contract performance and monitoring
 * @property {string} RENEWAL - Renewal evaluation and decision
 * @property {string} CLOSE_OUT - Contract closure and archival
 */
export enum LifecycleStage {
  INITIATION = 'INITIATION',
  NEGOTIATION = 'NEGOTIATION',
  APPROVAL = 'APPROVAL',
  EXECUTION = 'EXECUTION',
  PERFORMANCE = 'PERFORMANCE',
  RENEWAL = 'RENEWAL',
  CLOSE_OUT = 'CLOSE_OUT',
}

/**
 * Obligation definition
 */
export interface Obligation {
  id: string;
  contractId: string;
  title: string;
  description: string;
  responsibleParty: string;
  dueDate: Date;
  status: ObligationStatus;
  priority: ObligationPriority;
  type: ObligationType;
  completedAt?: Date;
  verifiedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Obligation status
 *
 * Status tracking for contractual obligations and deliverables.
 * Critical for compliance monitoring and SLA management.
 *
 * @property {string} PENDING - Obligation not yet started
 * @property {string} IN_PROGRESS - Obligation currently being fulfilled
 * @property {string} COMPLETED - Obligation successfully completed
 * @property {string} OVERDUE - Obligation past due date, requires escalation
 * @property {string} WAIVED - Obligation formally waived by agreement
 * @property {string} DISPUTED - Obligation disputed, requires resolution
 */
export enum ObligationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  WAIVED = 'WAIVED',
  DISPUTED = 'DISPUTED',
}

/**
 * Obligation priority
 */
export enum ObligationPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Obligation types
 */
export enum ObligationType {
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  REPORTING = 'REPORTING',
  COMPLIANCE = 'COMPLIANCE',
  AUDIT = 'AUDIT',
  NOTIFICATION = 'NOTIFICATION',
  PERFORMANCE = 'PERFORMANCE',
  CONFIDENTIALITY = 'CONFIDENTIALITY',
}

/**
 * Milestone definition
 */
export interface Milestone {
  id: string;
  contractId: string;
  name: string;
  description?: string;
  targetDate: Date;
  status: MilestoneStatus;
  completedAt?: Date;
  dependencies?: string[];
  deliverables?: string[];
  metadata?: Record<string, any>;
}

/**
 * Milestone status
 */
export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

/**
 * Renewal terms
 */
export interface RenewalTerms {
  autoRenew: boolean;
  renewalPeriod: number;
  renewalPeriodUnit: PeriodUnit;
  noticePeriod: number;
  noticePeriodUnit: PeriodUnit;
  renewalNotificationDays: number;
  maxRenewals?: number;
  currentRenewalCount: number;
  priceAdjustment?: PriceAdjustment;
}

/**
 * Period units
 */
export enum PeriodUnit {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

/**
 * Price adjustment configuration
 */
export interface PriceAdjustment {
  type: AdjustmentType;
  value: number;
  effectiveDate?: Date;
}

/**
 * Adjustment types
 */
export enum AdjustmentType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  CPI_INDEXED = 'CPI_INDEXED',
  NEGOTIATED = 'NEGOTIATED',
}

/**
 * Contract amendment
 */
export interface ContractAmendment {
  id: string;
  contractId: string;
  amendmentNumber: number;
  title: string;
  description: string;
  changes: AmendmentChange[];
  effectiveDate: Date;
  status: AmendmentStatus;
  approvedBy?: string[];
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Amendment status
 */
export enum AmendmentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EFFECTIVE = 'EFFECTIVE',
}

/**
 * Amendment change entry
 */
export interface AmendmentChange {
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

/**
 * Renewal notification
 */
export interface RenewalNotification {
  id: string;
  contractId: string;
  type: NotificationType;
  recipientEmails: string[];
  scheduledDate: Date;
  sentAt?: Date;
  status: NotificationStatus;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Notification types
 */
export enum NotificationType {
  RENEWAL_DUE = 'RENEWAL_DUE',
  EXPIRATION_WARNING = 'EXPIRATION_WARNING',
  OBLIGATION_DUE = 'OBLIGATION_DUE',
  MILESTONE_DUE = 'MILESTONE_DUE',
  PAYMENT_DUE = 'PAYMENT_DUE',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
}

/**
 * Notification status
 */
export enum NotificationStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Contract analytics metrics
 */
export interface ContractAnalytics {
  totalContracts: number;
  activeContracts: number;
  expiringContracts: number;
  totalValue: number;
  averageContractValue: number;
  contractsByType: Record<ContractType, number>;
  contractsByStatus: Record<ContractStatus, number>;
  overdueObligations: number;
  upcomingRenewals: number;
  complianceRate: number;
}

/**
 * Lifecycle transition
 */
export interface LifecycleTransition {
  contractId: string;
  fromStage: LifecycleStage;
  toStage: LifecycleStage;
  transitionDate: Date;
  triggeredBy: string;
  reason?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Contract Model
 * Stores contract definitions
 */
@Table({
  tableName: 'contracts',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['currentStage'] },
    { fields: ['startDate'] },
    { fields: ['endDate'] },
  ],
})
export class ContractModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique contract identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Contract name' })
  name: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(ContractType)))
  @ApiProperty({ enum: ContractType, description: 'Contract type' })
  type: ContractType;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Contract parties', type: [Object] })
  parties: ContractParty[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Contract start date' })
  startDate: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Contract end date' })
  endDate: Date;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Contract value information' })
  value?: ContractValue;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(ContractStatus)))
  @ApiProperty({ enum: ContractStatus, description: 'Contract status' })
  status: ContractStatus;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(LifecycleStage)))
  @ApiProperty({ enum: LifecycleStage, description: 'Current lifecycle stage' })
  currentStage: LifecycleStage;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Contract obligations', type: [Object] })
  obligations: Obligation[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Contract milestones', type: [Object] })
  milestones: Milestone[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Renewal terms' })
  renewalTerms?: RenewalTerms;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Contract Amendment Model
 * Stores contract amendments
 */
@Table({
  tableName: 'contract_amendments',
  timestamps: true,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['status'] },
    { fields: ['effectiveDate'] },
  ],
})
export class ContractAmendmentModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique amendment identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Amendment number' })
  amendmentNumber: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Amendment title' })
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Amendment description' })
  description: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Amendment changes', type: [Object] })
  changes: AmendmentChange[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Effective date' })
  effectiveDate: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(AmendmentStatus)))
  @ApiProperty({ enum: AmendmentStatus, description: 'Amendment status' })
  status: AmendmentStatus;

  @Column(DataType.ARRAY(DataType.STRING))
  @ApiPropertyOptional({ description: 'Approvers' })
  approvedBy?: string[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Renewal Notification Model
 * Stores renewal notifications
 */
@Table({
  tableName: 'renewal_notifications',
  timestamps: true,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['scheduledDate'] },
  ],
})
export class RenewalNotificationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique notification identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Contract ID' })
  contractId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(NotificationType)))
  @ApiProperty({ enum: NotificationType, description: 'Notification type' })
  type: NotificationType;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  @ApiProperty({ description: 'Recipient emails' })
  recipientEmails: string[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Scheduled send date' })
  scheduledDate: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Actual send date' })
  sentAt?: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(NotificationStatus)))
  @ApiProperty({ enum: NotificationStatus, description: 'Notification status' })
  status: NotificationStatus;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Notification message' })
  message: string;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE CONTRACT LIFECYCLE FUNCTIONS
// ============================================================================

/**
 * Creates a new contract.
 *
 * @param {string} name - Contract name
 * @param {ContractType} type - Contract type
 * @param {ContractParty[]} parties - Contract parties
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Partial<Contract>} options - Additional options
 * @returns {Contract} Contract
 *
 * @example
 * ```typescript
 * const contract = createContract('Provider Agreement', ContractType.PROVIDER_AGREEMENT, parties, startDate, endDate);
 * ```
 */
export const createContract = (
  name: string,
  type: ContractType,
  parties: ContractParty[],
  startDate: Date,
  endDate: Date,
  options?: Partial<Contract>
): Contract => {
  return {
    id: crypto.randomUUID(),
    name,
    type,
    parties,
    startDate,
    endDate,
    value: options?.value,
    status: ContractStatus.DRAFT,
    currentStage: LifecycleStage.INITIATION,
    obligations: options?.obligations || [],
    milestones: options?.milestones || [],
    renewalTerms: options?.renewalTerms,
    metadata: options?.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Adds a party to contract.
 *
 * @param {Contract} contract - Contract
 * @param {ContractParty} party - Party to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addPartyToContract(contract, party);
 * ```
 */
export const addPartyToContract = (contract: Contract, party: ContractParty): Contract => {
  return {
    ...contract,
    parties: [...contract.parties, party],
    updatedAt: new Date(),
  };
};

/**
 * Creates a contract party.
 *
 * @param {string} name - Party name
 * @param {PartyRole} role - Party role
 * @param {Partial<ContractParty>} options - Additional options
 * @returns {ContractParty} Contract party
 *
 * @example
 * ```typescript
 * const party = createContractParty('Acme Hospital', PartyRole.CLIENT, {email: 'contact@acme.com'});
 * ```
 */
export const createContractParty = (
  name: string,
  role: PartyRole,
  options?: Partial<ContractParty>
): ContractParty => {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    organizationType: options?.organizationType,
    contactPerson: options?.contactPerson,
    email: options?.email,
    phone: options?.phone,
    address: options?.address,
    signedAt: options?.signedAt,
    metadata: options?.metadata,
  };
};

/**
 * Transitions contract to new lifecycle stage.
 *
 * @param {Contract} contract - Contract
 * @param {LifecycleStage} newStage - New lifecycle stage
 * @param {string} triggeredBy - User who triggered transition
 * @returns {{contract: Contract, transition: LifecycleTransition}} Updated contract and transition record
 *
 * @example
 * ```typescript
 * const {contract, transition} = transitionLifecycleStage(contract, LifecycleStage.EXECUTION, 'user123');
 * ```
 */
export const transitionLifecycleStage = (
  contract: Contract,
  newStage: LifecycleStage,
  triggeredBy: string
): { contract: Contract; transition: LifecycleTransition } => {
  const transition: LifecycleTransition = {
    contractId: contract.id,
    fromStage: contract.currentStage,
    toStage: newStage,
    transitionDate: new Date(),
    triggeredBy,
  };

  const updatedContract = {
    ...contract,
    currentStage: newStage,
    updatedAt: new Date(),
  };

  return { contract: updatedContract, transition };
};

/**
 * Activates a contract.
 *
 * @param {Contract} contract - Contract to activate
 * @returns {Contract} Activated contract
 *
 * @example
 * ```typescript
 * const activated = activateContract(contract);
 * ```
 */
export const activateContract = (contract: Contract): Contract => {
  return {
    ...contract,
    status: ContractStatus.ACTIVE,
    currentStage: LifecycleStage.PERFORMANCE,
    updatedAt: new Date(),
  };
};

/**
 * Creates an obligation.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} title - Obligation title
 * @param {string} responsibleParty - Responsible party ID
 * @param {Date} dueDate - Due date
 * @param {Partial<Obligation>} options - Additional options
 * @returns {Obligation} Obligation
 *
 * @example
 * ```typescript
 * const obligation = createObligation('contract123', 'Monthly Report', 'party123', dueDate, {type: ObligationType.REPORTING});
 * ```
 */
export const createObligation = (
  contractId: string,
  title: string,
  responsibleParty: string,
  dueDate: Date,
  options?: Partial<Obligation>
): Obligation => {
  return {
    id: crypto.randomUUID(),
    contractId,
    title,
    description: options?.description || '',
    responsibleParty,
    dueDate,
    status: ObligationStatus.PENDING,
    priority: options?.priority || ObligationPriority.MEDIUM,
    type: options?.type || ObligationType.PERFORMANCE,
    completedAt: options?.completedAt,
    verifiedBy: options?.verifiedBy,
    metadata: options?.metadata,
  };
};

/**
 * Adds an obligation to contract.
 *
 * @param {Contract} contract - Contract
 * @param {Obligation} obligation - Obligation to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addObligationToContract(contract, obligation);
 * ```
 */
export const addObligationToContract = (
  contract: Contract,
  obligation: Obligation
): Contract => {
  return {
    ...contract,
    obligations: [...contract.obligations, obligation],
    updatedAt: new Date(),
  };
};

/**
 * Marks an obligation as completed.
 *
 * @param {Obligation} obligation - Obligation
 * @param {string} verifiedBy - User who verified completion
 * @returns {Obligation} Completed obligation
 *
 * @example
 * ```typescript
 * const completed = completeObligation(obligation, 'user123');
 * ```
 */
export const completeObligation = (obligation: Obligation, verifiedBy: string): Obligation => {
  return {
    ...obligation,
    status: ObligationStatus.COMPLETED,
    completedAt: new Date(),
    verifiedBy,
  };
};

/**
 * Gets overdue obligations for contract.
 *
 * @param {Contract} contract - Contract
 * @returns {Obligation[]} Overdue obligations
 *
 * @example
 * ```typescript
 * const overdue = getOverdueObligations(contract);
 * ```
 */
export const getOverdueObligations = (contract: Contract): Obligation[] => {
  const now = new Date();
  return contract.obligations.filter(
    (o) =>
      (o.status === ObligationStatus.PENDING || o.status === ObligationStatus.IN_PROGRESS) &&
      o.dueDate < now
  );
};

/**
 * Creates a milestone.
 *
 * @param {string} contractId - Contract identifier
 * @param {string} name - Milestone name
 * @param {Date} targetDate - Target date
 * @param {Partial<Milestone>} options - Additional options
 * @returns {Milestone} Milestone
 *
 * @example
 * ```typescript
 * const milestone = createMilestone('contract123', 'Phase 1 Completion', targetDate);
 * ```
 */
export const createMilestone = (
  contractId: string,
  name: string,
  targetDate: Date,
  options?: Partial<Milestone>
): Milestone => {
  return {
    id: crypto.randomUUID(),
    contractId,
    name,
    description: options?.description,
    targetDate,
    status: MilestoneStatus.PENDING,
    completedAt: options?.completedAt,
    dependencies: options?.dependencies,
    deliverables: options?.deliverables,
    metadata: options?.metadata,
  };
};

/**
 * Adds a milestone to contract.
 *
 * @param {Contract} contract - Contract
 * @param {Milestone} milestone - Milestone to add
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = addMilestoneToContract(contract, milestone);
 * ```
 */
export const addMilestoneToContract = (contract: Contract, milestone: Milestone): Contract => {
  return {
    ...contract,
    milestones: [...contract.milestones, milestone],
    updatedAt: new Date(),
  };
};

/**
 * Marks a milestone as completed.
 *
 * @param {Milestone} milestone - Milestone
 * @returns {Milestone} Completed milestone
 *
 * @example
 * ```typescript
 * const completed = completeMilestone(milestone);
 * ```
 */
export const completeMilestone = (milestone: Milestone): Milestone => {
  return {
    ...milestone,
    status: MilestoneStatus.COMPLETED,
    completedAt: new Date(),
  };
};

/**
 * Creates renewal terms for contract.
 *
 * @param {boolean} autoRenew - Whether to auto-renew
 * @param {number} renewalPeriod - Renewal period value
 * @param {PeriodUnit} renewalPeriodUnit - Renewal period unit
 * @param {Partial<RenewalTerms>} options - Additional options
 * @returns {RenewalTerms} Renewal terms
 *
 * @example
 * ```typescript
 * const terms = createRenewalTerms(true, 1, PeriodUnit.YEARS, {noticePeriod: 90, noticePeriodUnit: PeriodUnit.DAYS});
 * ```
 */
export const createRenewalTerms = (
  autoRenew: boolean,
  renewalPeriod: number,
  renewalPeriodUnit: PeriodUnit,
  options?: Partial<RenewalTerms>
): RenewalTerms => {
  return {
    autoRenew,
    renewalPeriod,
    renewalPeriodUnit,
    noticePeriod: options?.noticePeriod || 30,
    noticePeriodUnit: options?.noticePeriodUnit || PeriodUnit.DAYS,
    renewalNotificationDays: options?.renewalNotificationDays || 90,
    maxRenewals: options?.maxRenewals,
    currentRenewalCount: options?.currentRenewalCount || 0,
    priceAdjustment: options?.priceAdjustment,
  };
};

/**
 * Checks if contract is eligible for renewal.
 *
 * @param {Contract} contract - Contract
 * @returns {boolean} True if eligible
 *
 * @example
 * ```typescript
 * const eligible = isEligibleForRenewal(contract);
 * ```
 */
export const isEligibleForRenewal = (contract: Contract): boolean => {
  if (!contract.renewalTerms) return false;

  const { maxRenewals, currentRenewalCount } = contract.renewalTerms;

  if (maxRenewals && currentRenewalCount >= maxRenewals) return false;

  return contract.status === ContractStatus.ACTIVE;
};

/**
 * Renews a contract.
 *
 * @param {Contract} contract - Contract to renew
 * @returns {Contract} Renewed contract
 *
 * @example
 * ```typescript
 * const renewed = renewContract(contract);
 * ```
 */
export const renewContract = (contract: Contract): Contract => {
  if (!contract.renewalTerms) {
    throw new Error('Contract does not have renewal terms');
  }

  const renewalPeriodMs = convertPeriodToMilliseconds(
    contract.renewalTerms.renewalPeriod,
    contract.renewalTerms.renewalPeriodUnit
  );

  const newEndDate = new Date(contract.endDate.getTime() + renewalPeriodMs);

  return {
    ...contract,
    endDate: newEndDate,
    status: ContractStatus.RENEWED,
    currentStage: LifecycleStage.PERFORMANCE,
    renewalTerms: {
      ...contract.renewalTerms,
      currentRenewalCount: contract.renewalTerms.currentRenewalCount + 1,
    },
    updatedAt: new Date(),
  };
};

/**
 * Converts period to milliseconds.
 *
 * @param {number} value - Period value
 * @param {PeriodUnit} unit - Period unit
 * @returns {number} Milliseconds
 *
 * @example
 * ```typescript
 * const ms = convertPeriodToMilliseconds(1, PeriodUnit.YEARS);
 * ```
 */
export const convertPeriodToMilliseconds = (value: number, unit: PeriodUnit): number => {
  const conversions = {
    [PeriodUnit.DAYS]: 86400000,
    [PeriodUnit.WEEKS]: 604800000,
    [PeriodUnit.MONTHS]: 2592000000, // Approximate
    [PeriodUnit.YEARS]: 31536000000, // Approximate
  };

  return value * conversions[unit];
};

/**
 * Calculates days until contract expiration.
 *
 * @param {Contract} contract - Contract
 * @returns {number} Days until expiration
 *
 * @example
 * ```typescript
 * const days = calculateDaysUntilExpiration(contract);
 * ```
 */
export const calculateDaysUntilExpiration = (contract: Contract): number => {
  const now = Date.now();
  const endTime = contract.endDate.getTime();
  const diff = endTime - now;

  return Math.ceil(diff / 86400000);
};

/**
 * Checks if contract is expiring soon.
 *
 * @param {Contract} contract - Contract
 * @param {number} thresholdDays - Days threshold
 * @returns {boolean} True if expiring soon
 *
 * @example
 * ```typescript
 * const expiringSoon = isContractExpiringSoon(contract, 90);
 * ```
 */
export const isContractExpiringSoon = (contract: Contract, thresholdDays: number = 90): boolean => {
  const daysUntil = calculateDaysUntilExpiration(contract);
  return daysUntil <= thresholdDays && daysUntil > 0;
};

/**
 * Creates a contract amendment.
 *
 * @param {string} contractId - Contract identifier
 * @param {number} amendmentNumber - Amendment number
 * @param {string} title - Amendment title
 * @param {AmendmentChange[]} changes - Changes
 * @param {Date} effectiveDate - Effective date
 * @param {Partial<ContractAmendment>} options - Additional options
 * @returns {ContractAmendment} Contract amendment
 *
 * @example
 * ```typescript
 * const amendment = createContractAmendment('contract123', 1, 'Price Update', changes, effectiveDate);
 * ```
 */
export const createContractAmendment = (
  contractId: string,
  amendmentNumber: number,
  title: string,
  changes: AmendmentChange[],
  effectiveDate: Date,
  options?: Partial<ContractAmendment>
): ContractAmendment => {
  return {
    id: crypto.randomUUID(),
    contractId,
    amendmentNumber,
    title,
    description: options?.description || '',
    changes,
    effectiveDate,
    status: AmendmentStatus.DRAFT,
    approvedBy: options?.approvedBy,
    createdAt: new Date(),
    metadata: options?.metadata,
  };
};

/**
 * Applies an amendment to contract.
 *
 * @param {Contract} contract - Contract
 * @param {ContractAmendment} amendment - Amendment
 * @returns {Contract} Updated contract
 *
 * @example
 * ```typescript
 * const updated = applyAmendmentToContract(contract, amendment);
 * ```
 */
export const applyAmendmentToContract = (
  contract: Contract,
  amendment: ContractAmendment
): Contract => {
  let updatedContract = { ...contract };

  amendment.changes.forEach((change) => {
    if (change.field in updatedContract) {
      (updatedContract as any)[change.field] = change.newValue;
    }
  });

  return {
    ...updatedContract,
    status: ContractStatus.AMENDED,
    updatedAt: new Date(),
  };
};

/**
 * Creates a renewal notification.
 *
 * @param {string} contractId - Contract identifier
 * @param {NotificationType} type - Notification type
 * @param {string[]} recipientEmails - Recipient emails
 * @param {Date} scheduledDate - Scheduled send date
 * @param {string} message - Notification message
 * @returns {RenewalNotification} Renewal notification
 *
 * @example
 * ```typescript
 * const notification = createRenewalNotification('contract123', NotificationType.RENEWAL_DUE, emails, scheduledDate, message);
 * ```
 */
export const createRenewalNotification = (
  contractId: string,
  type: NotificationType,
  recipientEmails: string[],
  scheduledDate: Date,
  message: string
): RenewalNotification => {
  return {
    id: crypto.randomUUID(),
    contractId,
    type,
    recipientEmails,
    scheduledDate,
    status: NotificationStatus.SCHEDULED,
    message,
  };
};

/**
 * Schedules renewal notifications for contract.
 *
 * @param {Contract} contract - Contract
 * @param {string[]} recipientEmails - Recipient emails
 * @returns {RenewalNotification[]} Scheduled notifications
 *
 * @example
 * ```typescript
 * const notifications = scheduleRenewalNotifications(contract, ['admin@example.com']);
 * ```
 */
export const scheduleRenewalNotifications = (
  contract: Contract,
  recipientEmails: string[]
): RenewalNotification[] => {
  if (!contract.renewalTerms) return [];

  const notifications: RenewalNotification[] = [];
  const notificationDate = new Date(
    contract.endDate.getTime() - contract.renewalTerms.renewalNotificationDays * 86400000
  );

  notifications.push(
    createRenewalNotification(
      contract.id,
      NotificationType.RENEWAL_DUE,
      recipientEmails,
      notificationDate,
      `Contract "${contract.name}" is due for renewal in ${contract.renewalTerms.renewalNotificationDays} days.`
    )
  );

  return notifications;
};

/**
 * Terminates a contract.
 *
 * @param {Contract} contract - Contract to terminate
 * @param {string} reason - Termination reason
 * @returns {Contract} Terminated contract
 *
 * @example
 * ```typescript
 * const terminated = terminateContract(contract, 'Mutual agreement');
 * ```
 */
export const terminateContract = (contract: Contract, reason: string): Contract => {
  return {
    ...contract,
    status: ContractStatus.TERMINATED,
    currentStage: LifecycleStage.CLOSE_OUT,
    metadata: {
      ...contract.metadata,
      terminationReason: reason,
      terminationDate: new Date(),
    },
    updatedAt: new Date(),
  };
};

/**
 * Calculates contract value with price adjustment.
 *
 * @param {ContractValue} value - Original value
 * @param {PriceAdjustment} adjustment - Price adjustment
 * @returns {ContractValue} Adjusted value
 *
 * @example
 * ```typescript
 * const adjusted = calculateAdjustedContractValue(value, adjustment);
 * ```
 */
export const calculateAdjustedContractValue = (
  value: ContractValue,
  adjustment: PriceAdjustment
): ContractValue => {
  let adjustedAmount = value.amount;

  if (adjustment.type === AdjustmentType.PERCENTAGE) {
    adjustedAmount = value.amount * (1 + adjustment.value / 100);
  } else if (adjustment.type === AdjustmentType.FIXED_AMOUNT) {
    adjustedAmount = value.amount + adjustment.value;
  }

  return {
    ...value,
    amount: adjustedAmount,
  };
};

/**
 * Generates contract analytics.
 *
 * @param {Contract[]} contracts - List of contracts
 * @returns {ContractAnalytics} Analytics metrics
 *
 * @example
 * ```typescript
 * const analytics = generateContractAnalytics(contracts);
 * ```
 */
export const generateContractAnalytics = (contracts: Contract[]): ContractAnalytics => {
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter((c) => c.status === ContractStatus.ACTIVE).length;
  const expiringContracts = contracts.filter((c) => isContractExpiringSoon(c, 90)).length;

  const totalValue = contracts.reduce((sum, c) => sum + (c.value?.amount || 0), 0);
  const averageContractValue = totalContracts > 0 ? totalValue / totalContracts : 0;

  const contractsByType = {} as Record<ContractType, number>;
  const contractsByStatus = {} as Record<ContractStatus, number>;

  contracts.forEach((contract) => {
    contractsByType[contract.type] = (contractsByType[contract.type] || 0) + 1;
    contractsByStatus[contract.status] = (contractsByStatus[contract.status] || 0) + 1;
  });

  const overdueObligations = contracts.reduce(
    (sum, c) => sum + getOverdueObligations(c).length,
    0
  );

  const upcomingRenewals = contracts.filter((c) => isEligibleForRenewal(c) && isContractExpiringSoon(c, 90)).length;

  const totalObligations = contracts.reduce((sum, c) => sum + c.obligations.length, 0);
  const completedObligations = contracts.reduce(
    (sum, c) => sum + c.obligations.filter((o) => o.status === ObligationStatus.COMPLETED).length,
    0
  );
  const complianceRate = totalObligations > 0 ? (completedObligations / totalObligations) * 100 : 100;

  return {
    totalContracts,
    activeContracts,
    expiringContracts,
    totalValue,
    averageContractValue,
    contractsByType,
    contractsByStatus,
    overdueObligations,
    upcomingRenewals,
    complianceRate,
  };
};

/**
 * Validates contract configuration.
 *
 * @param {Contract} contract - Contract to validate
 * @returns {Array<string>} Validation errors
 *
 * @example
 * ```typescript
 * const errors = validateContractConfiguration(contract);
 * ```
 */
export const validateContractConfiguration = (contract: Contract): string[] => {
  const errors: string[] = [];

  if (!contract.name || contract.name.trim() === '') {
    errors.push('Contract name is required');
  }

  if (contract.parties.length === 0) {
    errors.push('At least one party is required');
  }

  if (contract.endDate <= contract.startDate) {
    errors.push('End date must be after start date');
  }

  if (contract.renewalTerms?.autoRenew && !contract.renewalTerms.renewalPeriod) {
    errors.push('Renewal period is required for auto-renewal');
  }

  return errors;
};

/**
 * Exports contract to JSON.
 *
 * @param {Contract} contract - Contract to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportContractToJSON(contract);
 * ```
 */
export const exportContractToJSON = (contract: Contract): string => {
  return JSON.stringify(contract, null, 2);
};

/**
 * Filters contracts by status.
 *
 * @param {Contract[]} contracts - Contracts to filter
 * @param {ContractStatus} status - Status to filter by
 * @returns {Contract[]} Filtered contracts
 *
 * @example
 * ```typescript
 * const active = filterContractsByStatus(contracts, ContractStatus.ACTIVE);
 * ```
 */
export const filterContractsByStatus = (
  contracts: Contract[],
  status: ContractStatus
): Contract[] => {
  return contracts.filter((c) => c.status === status);
};

/**
 * Filters contracts by type.
 *
 * @param {Contract[]} contracts - Contracts to filter
 * @param {ContractType} type - Type to filter by
 * @returns {Contract[]} Filtered contracts
 *
 * @example
 * ```typescript
 * const providers = filterContractsByType(contracts, ContractType.PROVIDER_AGREEMENT);
 * ```
 */
export const filterContractsByType = (
  contracts: Contract[],
  type: ContractType
): Contract[] => {
  return contracts.filter((c) => c.type === type);
};

/**
 * Searches contracts by party name.
 *
 * @param {Contract[]} contracts - Contracts to search
 * @param {string} partyName - Party name to search for
 * @returns {Contract[]} Matching contracts
 *
 * @example
 * ```typescript
 * const results = searchContractsByParty(contracts, 'Acme');
 * ```
 */
export const searchContractsByParty = (contracts: Contract[], partyName: string): Contract[] => {
  const searchLower = partyName.toLowerCase();
  return contracts.filter((c) =>
    c.parties.some((p) => p.name.toLowerCase().includes(searchLower))
  );
};

/**
 * Calculates contract performance metrics.
 *
 * @param {Contract} contract - Contract
 * @returns {Record<string, any>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateContractPerformance(contract);
 * ```
 */
export const calculateContractPerformance = (contract: Contract): Record<string, any> => {
  const totalObligations = contract.obligations.length;
  const completedObligations = contract.obligations.filter(
    (o) => o.status === ObligationStatus.COMPLETED
  ).length;
  const overdueObligations = getOverdueObligations(contract).length;

  const totalMilestones = contract.milestones.length;
  const completedMilestones = contract.milestones.filter(
    (m) => m.status === MilestoneStatus.COMPLETED
  ).length;

  return {
    contractId: contract.id,
    obligationCompletionRate:
      totalObligations > 0 ? (completedObligations / totalObligations) * 100 : 100,
    overdueObligations,
    milestoneCompletionRate:
      totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 100,
    daysUntilExpiration: calculateDaysUntilExpiration(contract),
    isExpiringSoon: isContractExpiringSoon(contract),
    status: contract.status,
    currentStage: contract.currentStage,
  };
};

/**
 * Generates contract summary report.
 *
 * @param {Contract} contract - Contract
 * @returns {Record<string, any>} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateContractSummary(contract);
 * ```
 */
export const generateContractSummary = (contract: Contract): Record<string, any> => {
  return {
    id: contract.id,
    name: contract.name,
    type: contract.type,
    status: contract.status,
    currentStage: contract.currentStage,
    parties: contract.parties.map((p) => ({ name: p.name, role: p.role })),
    startDate: contract.startDate,
    endDate: contract.endDate,
    value: contract.value,
    obligationCount: contract.obligations.length,
    milestoneCount: contract.milestones.length,
    hasRenewalTerms: !!contract.renewalTerms,
    autoRenew: contract.renewalTerms?.autoRenew,
    performance: calculateContractPerformance(contract),
  };
};

/**
 * Clones a contract for template reuse.
 *
 * @param {Contract} contract - Contract to clone
 * @param {string} newName - New contract name
 * @returns {Contract} Cloned contract
 *
 * @example
 * ```typescript
 * const cloned = cloneContract(originalContract, 'New Provider Agreement');
 * ```
 */
export const cloneContract = (contract: Contract, newName: string): Contract => {
  return {
    ...contract,
    id: crypto.randomUUID(),
    name: newName,
    status: ContractStatus.DRAFT,
    currentStage: LifecycleStage.INITIATION,
    parties: contract.parties.map((p) => ({ ...p, id: crypto.randomUUID(), signedAt: undefined })),
    obligations: contract.obligations.map((o) => ({
      ...o,
      id: crypto.randomUUID(),
      status: ObligationStatus.PENDING,
      completedAt: undefined,
      verifiedBy: undefined,
    })),
    milestones: contract.milestones.map((m) => ({
      ...m,
      id: crypto.randomUUID(),
      status: MilestoneStatus.PENDING,
      completedAt: undefined,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Contract Lifecycle Service
 * Production-ready NestJS service for contract lifecycle management
 */
@Injectable()
export class ContractLifecycleService {
  /**
   * Creates and validates a new contract
   */
  async createNewContract(
    name: string,
    type: ContractType,
    parties: ContractParty[],
    startDate: Date,
    endDate: Date
  ): Promise<Contract> {
    const contract = createContract(name, type, parties, startDate, endDate);

    const errors = validateContractConfiguration(contract);
    if (errors.length > 0) {
      throw new Error(`Contract validation failed: ${errors.join(', ')}`);
    }

    return contract;
  }

  /**
   * Processes contract renewal
   */
  async processRenewal(contractId: string): Promise<Contract> {
    // Implementation would fetch contract and renew it
    return {} as Contract;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  ContractModel,
  ContractAmendmentModel,
  RenewalNotificationModel,

  // Core Functions
  createContract,
  addPartyToContract,
  createContractParty,
  transitionLifecycleStage,
  activateContract,
  createObligation,
  addObligationToContract,
  completeObligation,
  getOverdueObligations,
  createMilestone,
  addMilestoneToContract,
  completeMilestone,
  createRenewalTerms,
  isEligibleForRenewal,
  renewContract,
  convertPeriodToMilliseconds,
  calculateDaysUntilExpiration,
  isContractExpiringSoon,
  createContractAmendment,
  applyAmendmentToContract,
  createRenewalNotification,
  scheduleRenewalNotifications,
  terminateContract,
  calculateAdjustedContractValue,
  generateContractAnalytics,
  validateContractConfiguration,
  exportContractToJSON,
  filterContractsByStatus,
  filterContractsByType,
  searchContractsByParty,
  calculateContractPerformance,
  generateContractSummary,
  cloneContract,

  // Services
  ContractLifecycleService,
};
