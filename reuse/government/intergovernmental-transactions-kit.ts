/**
 * LOC: GOV-IGT-TRX-001
 * File: /reuse/government/intergovernmental-transactions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *
 * DOWNSTREAM (imported by):
 *   - Intergovernmental transaction services
 *   - Revenue sharing controllers
 *   - Joint venture management modules
 *   - Regional authority integration
 */

/**
 * File: /reuse/government/intergovernmental-transactions-kit.ts
 * Locator: WC-GOV-IGT-TRX-001
 * Purpose: Intergovernmental Transactions Kit - Comprehensive intergovernmental financial operations
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, class-validator
 * Downstream: Intergovernmental services, revenue sharing, joint ventures, regional authorities, cost allocation
 * Dependencies: Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 * Exports: 50+ functions for intergovernmental transactions, revenue sharing, transfers, billing, cost allocation, consortium management
 *
 * LLM Context: Enterprise-grade intergovernmental transactions for government entities managing federal, state, and local transfers.
 * Provides utilities for intergovernmental revenue tracking, shared revenue allocation, grant pass-through, revenue sharing formulas,
 * intergovernmental billing, cost allocation between entities, joint venture accounting, consortium management, state aid calculations,
 * federal reimbursement tracking, regional service agreements, inter-entity loans, collaborative project funding, cross-jurisdictional
 * reporting, intergovernmental reconciliation, multi-entity budget consolidation, and shared service cost allocation.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
} from 'sequelize';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, Min, Max, IsString } from 'class-validator';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Entity type enumeration
 */
export enum EntityType {
  FEDERAL = 'FEDERAL',
  STATE = 'STATE',
  COUNTY = 'COUNTY',
  CITY = 'CITY',
  TOWNSHIP = 'TOWNSHIP',
  SCHOOL_DISTRICT = 'SCHOOL_DISTRICT',
  SPECIAL_DISTRICT = 'SPECIAL_DISTRICT',
  REGIONAL_AUTHORITY = 'REGIONAL_AUTHORITY',
  CONSORTIUM = 'CONSORTIUM',
}

/**
 * Transfer type enumeration
 */
export enum TransferType {
  REVENUE_SHARING = 'REVENUE_SHARING',
  GRANT_PASSTHROUGH = 'GRANT_PASSTHROUGH',
  REIMBURSEMENT = 'REIMBURSEMENT',
  STATE_AID = 'STATE_AID',
  FEDERAL_AID = 'FEDERAL_AID',
  PAYMENT_IN_LIEU = 'PAYMENT_IN_LIEU',
  SHARED_SERVICE = 'SHARED_SERVICE',
  JOINT_VENTURE = 'JOINT_VENTURE',
  LOAN_PAYMENT = 'LOAN_PAYMENT',
  RECIPROCAL_BILLING = 'RECIPROCAL_BILLING',
}

/**
 * Transfer status enumeration
 */
export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  REVERSED = 'REVERSED',
}

/**
 * Agreement status enumeration
 */
export enum AgreementStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
}

/**
 * Distribution method enumeration
 */
export enum DistributionMethod {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  FORMULA = 'FORMULA',
  PER_CAPITA = 'PER_CAPITA',
  ASSESSED_VALUE = 'ASSESSED_VALUE',
  USAGE_BASED = 'USAGE_BASED',
  COST_BASED = 'COST_BASED',
}

/**
 * Billing cycle enumeration
 */
export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  ANNUAL = 'ANNUAL',
  ON_DEMAND = 'ON_DEMAND',
}

/**
 * Intergovernmental entity interface
 */
export interface IIntergovernmentalEntity {
  id: string;
  entityCode: string;
  entityName: string;
  entityType: EntityType;
  jurisdiction: string;
  fipsCode?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Intergovernmental agreement interface
 */
export interface IIntergovernmentalAgreement {
  id: string;
  agreementNumber: string;
  agreementName: string;
  agreementType: TransferType;
  parties: string[];
  leadEntityId: string;
  effectiveDate: Date;
  expirationDate?: Date;
  autoRenew: boolean;
  terms: string;
  totalAmount?: number;
  status: AgreementStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Intergovernmental transfer interface
 */
export interface IIntergovernmentalTransfer {
  id: string;
  transferNumber: string;
  transferType: TransferType;
  fromEntityId: string;
  toEntityId: string;
  agreementId?: string;
  amount: number;
  fiscalYear: number;
  period: string;
  description: string;
  transferDate: Date;
  status: TransferStatus;
  referenceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Revenue sharing allocation interface
 */
export interface IRevenueSharing {
  id: string;
  sharingProgramId: string;
  programName: string;
  revenueSource: string;
  fiscalYear: number;
  totalRevenue: number;
  distributionMethod: DistributionMethod;
  distributionFormula?: string;
  allocations: IRevenueAllocation[];
  distributionDate: Date;
  status: 'CALCULATED' | 'APPROVED' | 'DISTRIBUTED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Revenue allocation interface
 */
export interface IRevenueAllocation {
  entityId: string;
  entityName: string;
  allocationBasis: string;
  allocationPercent: number;
  allocatedAmount: number;
  adjustments: number;
  finalAmount: number;
}

/**
 * Grant pass-through interface
 */
export interface IGrantPassThrough {
  id: string;
  passthroughNumber: string;
  primaryGrantId: string;
  primeRecipientId: string;
  subRecipientId: string;
  passthroughAmount: number;
  federalShare: number;
  stateShare: number;
  localMatch: number;
  cfda?: string;
  programName: string;
  periodStart: Date;
  periodEnd: Date;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Intergovernmental billing interface
 */
export interface IIntergovernmentalBilling {
  id: string;
  invoiceNumber: string;
  billingEntityId: string;
  billedEntityId: string;
  billingCycle: BillingCycle;
  serviceDescription: string;
  periodStart: Date;
  periodEnd: Date;
  lineItems: IBillingLineItem[];
  subtotal: number;
  adjustments: number;
  totalAmount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Billing line item interface
 */
export interface IBillingLineItem {
  lineNumber: number;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  costCenter?: string;
}

/**
 * Cost allocation interface
 */
export interface ICostAllocation {
  id: string;
  allocationId: string;
  costPoolName: string;
  totalCost: number;
  allocationMethod: DistributionMethod;
  allocationBasis: string;
  fiscalYear: number;
  period: string;
  allocations: ICostAllocationDetail[];
  status: 'DRAFT' | 'APPROVED' | 'POSTED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cost allocation detail interface
 */
export interface ICostAllocationDetail {
  entityId: string;
  entityName: string;
  allocationBasis: number;
  allocationPercent: number;
  allocatedCost: number;
  accountCode: string;
}

/**
 * Joint venture interface
 */
export interface IJointVenture {
  id: string;
  ventureName: string;
  ventureNumber: string;
  participants: IJointVentureParticipant[];
  purposeDescription: string;
  totalBudget: number;
  fiscalYear: number;
  startDate: Date;
  endDate?: Date;
  fiscalAgent?: string;
  status: AgreementStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Joint venture participant interface
 */
export interface IJointVentureParticipant {
  entityId: string;
  entityName: string;
  participationPercent: number;
  contributionAmount: number;
  votingRights: number;
  isPrimaryContact: boolean;
}

/**
 * Consortium interface
 */
export interface IConsortium {
  id: string;
  consortiumName: string;
  consortiumNumber: string;
  consortiumType: string;
  members: IConsortiumMember[];
  chairEntityId: string;
  foundedDate: Date;
  fiscalAgent: string;
  services: string[];
  status: AgreementStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Consortium member interface
 */
export interface IConsortiumMember {
  entityId: string;
  entityName: string;
  membershipDate: Date;
  membershipFee: number;
  votingWeight: number;
  isExecutiveBoard: boolean;
}

/**
 * Inter-entity loan interface
 */
export interface IInterEntityLoan {
  id: string;
  loanNumber: string;
  lenderEntityId: string;
  borrowerEntityId: string;
  principalAmount: number;
  interestRate: number;
  originationDate: Date;
  maturityDate: Date;
  paymentSchedule: ILoanPayment[];
  outstandingPrincipal: number;
  outstandingInterest: number;
  status: 'ACTIVE' | 'PAID' | 'DEFAULT' | 'RESTRUCTURED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Loan payment interface
 */
export interface ILoanPayment {
  paymentNumber: number;
  dueDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalPayment: number;
  paidDate?: Date;
  paidAmount?: number;
  status: 'SCHEDULED' | 'PAID' | 'LATE' | 'MISSED';
}

/**
 * State aid calculation interface
 */
export interface IStateAidCalculation {
  id: string;
  calculationId: string;
  aidProgramName: string;
  recipientEntityId: string;
  fiscalYear: number;
  calculationMethod: string;
  baseAmount: number;
  adjustments: IAidAdjustment[];
  calculatedAmount: number;
  approvedAmount: number;
  distributionSchedule: Date[];
  status: 'CALCULATED' | 'APPROVED' | 'DISTRIBUTED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aid adjustment interface
 */
export interface IAidAdjustment {
  adjustmentType: string;
  description: string;
  amount: number;
  reason: string;
}

/**
 * Federal reimbursement interface
 */
export interface IFederalReimbursement {
  id: string;
  reimbursementNumber: string;
  federalProgramId: string;
  programName: string;
  cfda: string;
  recipientEntityId: string;
  requestedAmount: number;
  eligibleAmount: number;
  approvedAmount: number;
  federalShare: number;
  stateShare: number;
  localShare: number;
  requestDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  status: TransferStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Regional service agreement interface
 */
export interface IRegionalServiceAgreement {
  id: string;
  agreementNumber: string;
  serviceName: string;
  serviceType: string;
  providerEntityId: string;
  recipientEntities: string[];
  serviceLevel: string;
  costStructure: string;
  annualCost: number;
  effectiveDate: Date;
  expirationDate: Date;
  status: AgreementStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Collaborative project interface
 */
export interface ICollaborativeProject {
  id: string;
  projectNumber: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  partners: IProjectPartner[];
  totalBudget: number;
  fundingSources: IProjectFunding[];
  startDate: Date;
  endDate: Date;
  projectManager: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project partner interface
 */
export interface IProjectPartner {
  entityId: string;
  entityName: string;
  role: string;
  contributionAmount: number;
  contributionType: 'CASH' | 'IN_KIND' | 'BOTH';
  responsibilities: string[];
}

/**
 * Project funding interface
 */
export interface IProjectFunding {
  fundingSource: string;
  fundingType: TransferType;
  amount: number;
  receivedDate?: Date;
}

/**
 * Cross-jurisdictional report interface
 */
export interface ICrossJurisdictionalReport {
  id: string;
  reportId: string;
  reportName: string;
  reportingPeriod: string;
  fiscalYear: number;
  participatingEntities: string[];
  reportType: string;
  consolidatedData: Record<string, any>;
  generatedDate: Date;
  submittedDate?: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Intergovernmental reconciliation interface
 */
export interface IIntergovernmentalReconciliation {
  id: string;
  reconciliationId: string;
  reconciliationDate: Date;
  entity1Id: string;
  entity2Id: string;
  periodStart: Date;
  periodEnd: Date;
  entity1Balance: number;
  entity2Balance: number;
  reconcilingItems: IReconcilingItem[];
  variance: number;
  resolved: boolean;
  resolvedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Reconciling item interface
 */
export interface IReconcilingItem {
  description: string;
  amount: number;
  itemType: 'TIMING' | 'ERROR' | 'RECLASSIFICATION' | 'OUTSTANDING';
  entitySource: string;
  resolution?: string;
}

// ============================================================================
// INTERGOVERNMENTAL ENTITY MANAGEMENT
// ============================================================================

/**
 * Creates an intergovernmental entity record.
 * Registers a government entity for intergovernmental transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityCode - Unique entity code
 * @param {string} entityName - Entity name
 * @param {EntityType} entityType - Type of entity
 * @param {string} jurisdiction - Jurisdiction area
 * @param {string} fipsCode - FIPS code (if applicable)
 * @param {string} contactName - Primary contact name
 * @param {string} contactEmail - Contact email
 * @param {string} contactPhone - Contact phone
 * @param {string} address - Entity address
 * @returns {Promise<IIntergovernmentalEntity>} Created entity
 *
 * @example
 * ```typescript
 * const entity = await createIntergovernmentalEntity(sequelize,
 *   'STATE-CA', 'State of California', EntityType.STATE,
 *   'California', '06', 'John Doe', 'john@ca.gov',
 *   '916-555-1234', '1315 10th Street, Sacramento, CA 95814');
 * ```
 */
export async function createIntergovernmentalEntity(
  sequelize: Sequelize,
  entityCode: string,
  entityName: string,
  entityType: EntityType,
  jurisdiction: string,
  fipsCode: string | null,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  address: string,
): Promise<IIntergovernmentalEntity> {
  const Entity = getIntergovernmentalEntityModel(sequelize);

  const entity = await Entity.create({
    entityCode,
    entityName,
    entityType,
    jurisdiction,
    fipsCode,
    contactName,
    contactEmail,
    contactPhone,
    address,
    status: 'ACTIVE',
  });

  return entity.toJSON() as IIntergovernmentalEntity;
}

/**
 * Retrieves all active intergovernmental entities.
 * Returns entities available for transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EntityType} entityType - Optional entity type filter
 * @returns {Promise<IIntergovernmentalEntity[]>} Active entities
 *
 * @example
 * ```typescript
 * const entities = await getActiveEntities(sequelize, EntityType.COUNTY);
 * ```
 */
export async function getActiveEntities(
  sequelize: Sequelize,
  entityType?: EntityType,
): Promise<IIntergovernmentalEntity[]> {
  const Entity = getIntergovernmentalEntityModel(sequelize);

  const where: WhereOptions = { status: 'ACTIVE' };
  if (entityType) {
    where.entityType = entityType;
  }

  const entities = await Entity.findAll({ where });
  return entities.map(e => e.toJSON() as IIntergovernmentalEntity);
}

/**
 * Updates entity contact information.
 * Modifies entity contact details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {string} contactName - Contact name
 * @param {string} contactEmail - Contact email
 * @param {string} contactPhone - Contact phone
 * @returns {Promise<IIntergovernmentalEntity>} Updated entity
 *
 * @example
 * ```typescript
 * const updated = await updateEntityContact(sequelize, 'entity-001',
 *   'Jane Smith', 'jane@ca.gov', '916-555-5678');
 * ```
 */
export async function updateEntityContact(
  sequelize: Sequelize,
  entityId: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
): Promise<IIntergovernmentalEntity> {
  const Entity = getIntergovernmentalEntityModel(sequelize);

  const entity = await Entity.findByPk(entityId);
  if (!entity) {
    throw new Error(`Entity ${entityId} not found`);
  }

  entity.contactName = contactName;
  entity.contactEmail = contactEmail;
  entity.contactPhone = contactPhone;
  await entity.save();

  return entity.toJSON() as IIntergovernmentalEntity;
}

// ============================================================================
// INTERGOVERNMENTAL AGREEMENTS
// ============================================================================

/**
 * Creates an intergovernmental agreement.
 * Establishes formal agreement between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} agreementNumber - Agreement number
 * @param {string} agreementName - Agreement name
 * @param {TransferType} agreementType - Type of agreement
 * @param {string[]} parties - Participating entity IDs
 * @param {string} leadEntityId - Lead entity ID
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @param {boolean} autoRenew - Auto-renewal flag
 * @param {string} terms - Agreement terms
 * @param {number} totalAmount - Total agreement amount
 * @returns {Promise<IIntergovernmentalAgreement>} Created agreement
 *
 * @example
 * ```typescript
 * const agreement = await createIntergovernmentalAgreement(sequelize,
 *   'IGA-2024-001', 'Regional Transit Authority Agreement',
 *   TransferType.SHARED_SERVICE, ['entity-001', 'entity-002'],
 *   'entity-001', new Date('2024-01-01'), new Date('2029-12-31'),
 *   true, 'Terms and conditions...', 10000000);
 * ```
 */
export async function createIntergovernmentalAgreement(
  sequelize: Sequelize,
  agreementNumber: string,
  agreementName: string,
  agreementType: TransferType,
  parties: string[],
  leadEntityId: string,
  effectiveDate: Date,
  expirationDate: Date | null,
  autoRenew: boolean,
  terms: string,
  totalAmount: number | null,
): Promise<IIntergovernmentalAgreement> {
  const Agreement = getIntergovernmentalAgreementModel(sequelize);

  const agreement = await Agreement.create({
    agreementNumber,
    agreementName,
    agreementType,
    parties,
    leadEntityId,
    effectiveDate,
    expirationDate,
    autoRenew,
    terms,
    totalAmount,
    status: AgreementStatus.ACTIVE,
  });

  return agreement.toJSON() as IIntergovernmentalAgreement;
}

/**
 * Retrieves active agreements for an entity.
 * Returns all active agreements involving the entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @returns {Promise<IIntergovernmentalAgreement[]>} Active agreements
 *
 * @example
 * ```typescript
 * const agreements = await getEntityAgreements(sequelize, 'entity-001');
 * ```
 */
export async function getEntityAgreements(
  sequelize: Sequelize,
  entityId: string,
): Promise<IIntergovernmentalAgreement[]> {
  const Agreement = getIntergovernmentalAgreementModel(sequelize);

  const agreements = await Agreement.findAll({
    where: {
      status: AgreementStatus.ACTIVE,
      [Op.or]: [
        { parties: { [Op.contains]: [entityId] } },
        { leadEntityId: entityId },
      ],
    },
  });

  return agreements.map(a => a.toJSON() as IIntergovernmentalAgreement);
}

/**
 * Terminates an intergovernmental agreement.
 * Ends agreement before expiration date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} agreementId - Agreement ID
 * @param {string} reason - Termination reason
 * @returns {Promise<IIntergovernmentalAgreement>} Terminated agreement
 *
 * @example
 * ```typescript
 * const terminated = await terminateAgreement(sequelize, 'agreement-001',
 *   'Budget constraints');
 * ```
 */
export async function terminateAgreement(
  sequelize: Sequelize,
  agreementId: string,
  reason: string,
): Promise<IIntergovernmentalAgreement> {
  const Agreement = getIntergovernmentalAgreementModel(sequelize);

  const agreement = await Agreement.findByPk(agreementId);
  if (!agreement) {
    throw new Error(`Agreement ${agreementId} not found`);
  }

  agreement.status = AgreementStatus.TERMINATED;
  await agreement.save();

  return agreement.toJSON() as IIntergovernmentalAgreement;
}

/**
 * Retrieves expiring agreements.
 * Identifies agreements expiring within timeframe.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<IIntergovernmentalAgreement[]>} Expiring agreements
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringAgreements(sequelize, 90);
 * ```
 */
export async function getExpiringAgreements(
  sequelize: Sequelize,
  daysAhead: number,
): Promise<IIntergovernmentalAgreement[]> {
  const Agreement = getIntergovernmentalAgreementModel(sequelize);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const agreements = await Agreement.findAll({
    where: {
      status: AgreementStatus.ACTIVE,
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
      autoRenew: false,
    },
  });

  return agreements.map(a => a.toJSON() as IIntergovernmentalAgreement);
}

// ============================================================================
// INTERGOVERNMENTAL TRANSFERS
// ============================================================================

/**
 * Creates an intergovernmental transfer.
 * Records transfer between government entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferNumber - Transfer number
 * @param {TransferType} transferType - Type of transfer
 * @param {string} fromEntityId - Sending entity ID
 * @param {string} toEntityId - Receiving entity ID
 * @param {string} agreementId - Related agreement ID
 * @param {number} amount - Transfer amount
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Period (e.g., 'Q1', 'Q2')
 * @param {string} description - Transfer description
 * @param {Date} transferDate - Transfer date
 * @returns {Promise<IIntergovernmentalTransfer>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createIntergovernmentalTransfer(sequelize,
 *   'TRF-2024-0001', TransferType.STATE_AID, 'state-001',
 *   'city-001', 'agreement-001', 500000, 2024, 'Q1',
 *   'State aid payment Q1', new Date());
 * ```
 */
export async function createIntergovernmentalTransfer(
  sequelize: Sequelize,
  transferNumber: string,
  transferType: TransferType,
  fromEntityId: string,
  toEntityId: string,
  agreementId: string | null,
  amount: number,
  fiscalYear: number,
  period: string,
  description: string,
  transferDate: Date,
): Promise<IIntergovernmentalTransfer> {
  const Transfer = getIntergovernmentalTransferModel(sequelize);

  const transfer = await Transfer.create({
    transferNumber,
    transferType,
    fromEntityId,
    toEntityId,
    agreementId,
    amount,
    fiscalYear,
    period,
    description,
    transferDate,
    status: TransferStatus.PENDING,
  });

  return transfer.toJSON() as IIntergovernmentalTransfer;
}

/**
 * Approves an intergovernmental transfer.
 * Authorizes transfer for processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IIntergovernmentalTransfer>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveTransfer(sequelize, 'transfer-001',
 *   'user-123');
 * ```
 */
export async function approveTransfer(
  sequelize: Sequelize,
  transferId: string,
  approvedBy: string,
): Promise<IIntergovernmentalTransfer> {
  const Transfer = getIntergovernmentalTransferModel(sequelize);

  const transfer = await Transfer.findByPk(transferId);
  if (!transfer) {
    throw new Error(`Transfer ${transferId} not found`);
  }

  if (transfer.status !== TransferStatus.PENDING) {
    throw new Error(`Transfer cannot be approved from status ${transfer.status}`);
  }

  transfer.status = TransferStatus.APPROVED;
  await transfer.save();

  return transfer.toJSON() as IIntergovernmentalTransfer;
}

/**
 * Completes an intergovernmental transfer.
 * Marks transfer as completed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} referenceNumber - Payment reference number
 * @returns {Promise<IIntergovernmentalTransfer>} Completed transfer
 *
 * @example
 * ```typescript
 * const completed = await completeTransfer(sequelize, 'transfer-001',
 *   'ACH-20240115-001');
 * ```
 */
export async function completeTransfer(
  sequelize: Sequelize,
  transferId: string,
  referenceNumber: string,
): Promise<IIntergovernmentalTransfer> {
  const Transfer = getIntergovernmentalTransferModel(sequelize);

  const transfer = await Transfer.findByPk(transferId);
  if (!transfer) {
    throw new Error(`Transfer ${transferId} not found`);
  }

  transfer.status = TransferStatus.COMPLETED;
  transfer.referenceNumber = referenceNumber;
  await transfer.save();

  return transfer.toJSON() as IIntergovernmentalTransfer;
}

/**
 * Retrieves transfers for an entity.
 * Returns transfers sent or received by entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} direction - 'SENT' or 'RECEIVED'
 * @returns {Promise<IIntergovernmentalTransfer[]>} Transfers
 *
 * @example
 * ```typescript
 * const received = await getEntityTransfers(sequelize, 'entity-001',
 *   2024, 'RECEIVED');
 * ```
 */
export async function getEntityTransfers(
  sequelize: Sequelize,
  entityId: string,
  fiscalYear: number,
  direction: 'SENT' | 'RECEIVED',
): Promise<IIntergovernmentalTransfer[]> {
  const Transfer = getIntergovernmentalTransferModel(sequelize);

  const where: WhereOptions = {
    fiscalYear,
    [direction === 'SENT' ? 'fromEntityId' : 'toEntityId']: entityId,
  };

  const transfers = await Transfer.findAll({ where });
  return transfers.map(t => t.toJSON() as IIntergovernmentalTransfer);
}

/**
 * Calculates total transfers by type.
 * Sums transfers by transfer type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {TransferType} transferType - Transfer type
 * @returns {Promise<number>} Total transfer amount
 *
 * @example
 * ```typescript
 * const totalAid = await calculateTotalTransfers(sequelize,
 *   'entity-001', 2024, TransferType.STATE_AID);
 * console.log(`Total state aid: $${totalAid}`);
 * ```
 */
export async function calculateTotalTransfers(
  sequelize: Sequelize,
  entityId: string,
  fiscalYear: number,
  transferType: TransferType,
): Promise<number> {
  const Transfer = getIntergovernmentalTransferModel(sequelize);

  const transfers = await Transfer.findAll({
    where: {
      toEntityId: entityId,
      fiscalYear,
      transferType,
      status: TransferStatus.COMPLETED,
    },
  });

  return transfers.reduce((sum, t) => sum + parseFloat(t.amount as any), 0);
}

// ============================================================================
// REVENUE SHARING
// ============================================================================

/**
 * Creates a revenue sharing distribution.
 * Allocates shared revenue among entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sharingProgramId - Sharing program ID
 * @param {string} programName - Program name
 * @param {string} revenueSource - Revenue source
 * @param {number} fiscalYear - Fiscal year
 * @param {number} totalRevenue - Total revenue to share
 * @param {DistributionMethod} distributionMethod - Distribution method
 * @param {string} distributionFormula - Formula description
 * @param {IRevenueAllocation[]} allocations - Revenue allocations
 * @param {Date} distributionDate - Distribution date
 * @returns {Promise<IRevenueSharing>} Created revenue sharing
 *
 * @example
 * ```typescript
 * const sharing = await createRevenueSharing(sequelize,
 *   'PROG-001', 'Sales Tax Revenue Sharing', 'Sales Tax',
 *   2024, 10000000, DistributionMethod.PER_CAPITA,
 *   'Distributed based on population', allocations, new Date());
 * ```
 */
export async function createRevenueSharing(
  sequelize: Sequelize,
  sharingProgramId: string,
  programName: string,
  revenueSource: string,
  fiscalYear: number,
  totalRevenue: number,
  distributionMethod: DistributionMethod,
  distributionFormula: string | null,
  allocations: IRevenueAllocation[],
  distributionDate: Date,
): Promise<IRevenueSharing> {
  const RevenueSharing = getRevenueSharingModel(sequelize);

  const sharing = await RevenueSharing.create({
    sharingProgramId,
    programName,
    revenueSource,
    fiscalYear,
    totalRevenue,
    distributionMethod,
    distributionFormula,
    allocations,
    distributionDate,
    status: 'CALCULATED',
  });

  return sharing.toJSON() as IRevenueSharing;
}

/**
 * Calculates per capita revenue sharing.
 * Distributes revenue based on population.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalRevenue - Total revenue to distribute
 * @param {Array<{entityId: string, entityName: string, population: number}>} entities - Entities with population
 * @returns {Promise<IRevenueAllocation[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculatePerCapitaSharing(sequelize,
 *   1000000, [{entityId: 'city-001', entityName: 'City A', population: 50000}]);
 * ```
 */
export async function calculatePerCapitaSharing(
  sequelize: Sequelize,
  totalRevenue: number,
  entities: Array<{ entityId: string; entityName: string; population: number }>,
): Promise<IRevenueAllocation[]> {
  const totalPopulation = entities.reduce((sum, e) => sum + e.population, 0);
  const perCapitaAmount = totalRevenue / totalPopulation;

  return entities.map(entity => ({
    entityId: entity.entityId,
    entityName: entity.entityName,
    allocationBasis: `${entity.population} residents`,
    allocationPercent: (entity.population / totalPopulation) * 100,
    allocatedAmount: entity.population * perCapitaAmount,
    adjustments: 0,
    finalAmount: entity.population * perCapitaAmount,
  }));
}

/**
 * Calculates percentage-based revenue sharing.
 * Distributes revenue by fixed percentages.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalRevenue - Total revenue to distribute
 * @param {Array<{entityId: string, entityName: string, percentage: number}>} entities - Entities with percentages
 * @returns {Promise<IRevenueAllocation[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculatePercentageSharing(sequelize,
 *   1000000, [{entityId: 'city-001', entityName: 'City A', percentage: 40}]);
 * ```
 */
export async function calculatePercentageSharing(
  sequelize: Sequelize,
  totalRevenue: number,
  entities: Array<{ entityId: string; entityName: string; percentage: number }>,
): Promise<IRevenueAllocation[]> {
  const totalPercent = entities.reduce((sum, e) => sum + e.percentage, 0);

  if (Math.abs(totalPercent - 100) > 0.01) {
    throw new Error(`Percentages must total 100%, got ${totalPercent}%`);
  }

  return entities.map(entity => ({
    entityId: entity.entityId,
    entityName: entity.entityName,
    allocationBasis: `${entity.percentage}% share`,
    allocationPercent: entity.percentage,
    allocatedAmount: (totalRevenue * entity.percentage) / 100,
    adjustments: 0,
    finalAmount: (totalRevenue * entity.percentage) / 100,
  }));
}

/**
 * Approves revenue sharing distribution.
 * Authorizes revenue distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sharingId - Revenue sharing ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IRevenueSharing>} Approved revenue sharing
 *
 * @example
 * ```typescript
 * const approved = await approveRevenueSharing(sequelize,
 *   'sharing-001', 'user-123');
 * ```
 */
export async function approveRevenueSharing(
  sequelize: Sequelize,
  sharingId: string,
  approvedBy: string,
): Promise<IRevenueSharing> {
  const RevenueSharing = getRevenueSharingModel(sequelize);

  const sharing = await RevenueSharing.findByPk(sharingId);
  if (!sharing) {
    throw new Error(`Revenue sharing ${sharingId} not found`);
  }

  sharing.status = 'APPROVED';
  await sharing.save();

  return sharing.toJSON() as IRevenueSharing;
}

// ============================================================================
// GRANT PASS-THROUGH
// ============================================================================

/**
 * Creates a grant pass-through record.
 * Establishes sub-award from prime recipient to sub-recipient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} passthroughNumber - Pass-through number
 * @param {string} primaryGrantId - Primary grant ID
 * @param {string} primeRecipientId - Prime recipient entity ID
 * @param {string} subRecipientId - Sub-recipient entity ID
 * @param {number} passthroughAmount - Pass-through amount
 * @param {number} federalShare - Federal share
 * @param {number} stateShare - State share
 * @param {number} localMatch - Local match
 * @param {string} cfda - CFDA number
 * @param {string} programName - Program name
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<IGrantPassThrough>} Created pass-through
 *
 * @example
 * ```typescript
 * const passthrough = await createGrantPassThrough(sequelize,
 *   'PT-2024-001', 'grant-001', 'state-001', 'city-001',
 *   500000, 400000, 75000, 25000, '93.558',
 *   'TANF Block Grant', new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export async function createGrantPassThrough(
  sequelize: Sequelize,
  passthroughNumber: string,
  primaryGrantId: string,
  primeRecipientId: string,
  subRecipientId: string,
  passthroughAmount: number,
  federalShare: number,
  stateShare: number,
  localMatch: number,
  cfda: string | null,
  programName: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<IGrantPassThrough> {
  const GrantPassThrough = getGrantPassThroughModel(sequelize);

  const passthrough = await GrantPassThrough.create({
    passthroughNumber,
    primaryGrantId,
    primeRecipientId,
    subRecipientId,
    passthroughAmount,
    federalShare,
    stateShare,
    localMatch,
    cfda,
    programName,
    periodStart,
    periodEnd,
    status: 'ACTIVE',
  });

  return passthrough.toJSON() as IGrantPassThrough;
}

/**
 * Retrieves pass-through grants for sub-recipient.
 * Returns all pass-through awards to entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} subRecipientId - Sub-recipient entity ID
 * @returns {Promise<IGrantPassThrough[]>} Pass-through grants
 *
 * @example
 * ```typescript
 * const passthroughs = await getSubRecipientPassThroughs(sequelize,
 *   'city-001');
 * ```
 */
export async function getSubRecipientPassThroughs(
  sequelize: Sequelize,
  subRecipientId: string,
): Promise<IGrantPassThrough[]> {
  const GrantPassThrough = getGrantPassThroughModel(sequelize);

  const passthroughs = await GrantPassThrough.findAll({
    where: {
      subRecipientId,
      status: 'ACTIVE',
    },
  });

  return passthroughs.map(p => p.toJSON() as IGrantPassThrough);
}

/**
 * Calculates total pass-through funding.
 * Sums all pass-through amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} primeRecipientId - Prime recipient ID
 * @param {string} primaryGrantId - Primary grant ID
 * @returns {Promise<number>} Total pass-through amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalPassThrough(sequelize,
 *   'state-001', 'grant-001');
 * console.log(`Total pass-through: $${total}`);
 * ```
 */
export async function calculateTotalPassThrough(
  sequelize: Sequelize,
  primeRecipientId: string,
  primaryGrantId: string,
): Promise<number> {
  const GrantPassThrough = getGrantPassThroughModel(sequelize);

  const passthroughs = await GrantPassThrough.findAll({
    where: {
      primeRecipientId,
      primaryGrantId,
      status: 'ACTIVE',
    },
  });

  return passthroughs.reduce((sum, p) => sum + parseFloat(p.passthroughAmount as any), 0);
}

// ============================================================================
// INTERGOVERNMENTAL BILLING
// ============================================================================

/**
 * Creates an intergovernmental invoice.
 * Bills one entity for services provided by another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} invoiceNumber - Invoice number
 * @param {string} billingEntityId - Billing entity ID
 * @param {string} billedEntityId - Billed entity ID
 * @param {BillingCycle} billingCycle - Billing cycle
 * @param {string} serviceDescription - Service description
 * @param {Date} periodStart - Billing period start
 * @param {Date} periodEnd - Billing period end
 * @param {IBillingLineItem[]} lineItems - Line items
 * @param {number} adjustments - Total adjustments
 * @param {Date} dueDate - Payment due date
 * @returns {Promise<IIntergovernmentalBilling>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createIntergovernmentalInvoice(sequelize,
 *   'INV-2024-001', 'county-001', 'city-001',
 *   BillingCycle.QUARTERLY, 'Emergency Services',
 *   new Date('2024-01-01'), new Date('2024-03-31'),
 *   lineItems, 0, new Date('2024-04-30'));
 * ```
 */
export async function createIntergovernmentalInvoice(
  sequelize: Sequelize,
  invoiceNumber: string,
  billingEntityId: string,
  billedEntityId: string,
  billingCycle: BillingCycle,
  serviceDescription: string,
  periodStart: Date,
  periodEnd: Date,
  lineItems: IBillingLineItem[],
  adjustments: number,
  dueDate: Date,
): Promise<IIntergovernmentalBilling> {
  const Billing = getIntergovernmentalBillingModel(sequelize);

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalAmount = subtotal + adjustments;

  const invoice = await Billing.create({
    invoiceNumber,
    billingEntityId,
    billedEntityId,
    billingCycle,
    serviceDescription,
    periodStart,
    periodEnd,
    lineItems,
    subtotal,
    adjustments,
    totalAmount,
    dueDate,
    status: 'ISSUED',
  });

  return invoice.toJSON() as IIntergovernmentalBilling;
}

/**
 * Records invoice payment.
 * Marks invoice as paid.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} invoiceId - Invoice ID
 * @param {Date} paidDate - Payment date
 * @param {string} paymentReference - Payment reference
 * @returns {Promise<IIntergovernmentalBilling>} Paid invoice
 *
 * @example
 * ```typescript
 * const paid = await recordInvoicePayment(sequelize, 'invoice-001',
 *   new Date(), 'CHK-20240115-001');
 * ```
 */
export async function recordInvoicePayment(
  sequelize: Sequelize,
  invoiceId: string,
  paidDate: Date,
  paymentReference: string,
): Promise<IIntergovernmentalBilling> {
  const Billing = getIntergovernmentalBillingModel(sequelize);

  const invoice = await Billing.findByPk(invoiceId);
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  invoice.status = 'PAID';
  invoice.paidDate = paidDate;
  await invoice.save();

  return invoice.toJSON() as IIntergovernmentalBilling;
}

/**
 * Retrieves outstanding invoices.
 * Returns unpaid invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billedEntityId - Billed entity ID
 * @returns {Promise<IIntergovernmentalBilling[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoices(sequelize, 'city-001');
 * ```
 */
export async function getOutstandingInvoices(
  sequelize: Sequelize,
  billedEntityId: string,
): Promise<IIntergovernmentalBilling[]> {
  const Billing = getIntergovernmentalBillingModel(sequelize);

  const invoices = await Billing.findAll({
    where: {
      billedEntityId,
      status: {
        [Op.in]: ['ISSUED', 'OVERDUE'],
      },
    },
  });

  return invoices.map(i => i.toJSON() as IIntergovernmentalBilling);
}

// ============================================================================
// COST ALLOCATION
// ============================================================================

/**
 * Creates a cost allocation.
 * Allocates shared costs among entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allocationId - Allocation ID
 * @param {string} costPoolName - Cost pool name
 * @param {number} totalCost - Total cost to allocate
 * @param {DistributionMethod} allocationMethod - Allocation method
 * @param {string} allocationBasis - Allocation basis
 * @param {number} fiscalYear - Fiscal year
 * @param {string} period - Period
 * @param {ICostAllocationDetail[]} allocations - Cost allocations
 * @returns {Promise<ICostAllocation>} Created cost allocation
 *
 * @example
 * ```typescript
 * const allocation = await createCostAllocation(sequelize,
 *   'ALLOC-2024-001', 'IT Services', 500000,
 *   DistributionMethod.USAGE_BASED, 'User count',
 *   2024, 'Q1', allocationDetails);
 * ```
 */
export async function createCostAllocation(
  sequelize: Sequelize,
  allocationId: string,
  costPoolName: string,
  totalCost: number,
  allocationMethod: DistributionMethod,
  allocationBasis: string,
  fiscalYear: number,
  period: string,
  allocations: ICostAllocationDetail[],
): Promise<ICostAllocation> {
  const CostAllocation = getCostAllocationModel(sequelize);

  const allocation = await CostAllocation.create({
    allocationId,
    costPoolName,
    totalCost,
    allocationMethod,
    allocationBasis,
    fiscalYear,
    period,
    allocations,
    status: 'DRAFT',
  });

  return allocation.toJSON() as ICostAllocation;
}

/**
 * Calculates usage-based cost allocation.
 * Allocates costs based on usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} totalCost - Total cost to allocate
 * @param {Array<{entityId: string, entityName: string, usage: number, accountCode: string}>} entities - Entities with usage
 * @returns {Promise<ICostAllocationDetail[]>} Calculated allocations
 *
 * @example
 * ```typescript
 * const allocations = await calculateUsageBasedAllocation(sequelize,
 *   100000, [{entityId: 'city-001', entityName: 'City A', usage: 500, accountCode: '5000'}]);
 * ```
 */
export async function calculateUsageBasedAllocation(
  sequelize: Sequelize,
  totalCost: number,
  entities: Array<{ entityId: string; entityName: string; usage: number; accountCode: string }>,
): Promise<ICostAllocationDetail[]> {
  const totalUsage = entities.reduce((sum, e) => sum + e.usage, 0);

  if (totalUsage === 0) {
    throw new Error('Total usage cannot be zero');
  }

  return entities.map(entity => ({
    entityId: entity.entityId,
    entityName: entity.entityName,
    allocationBasis: entity.usage,
    allocationPercent: (entity.usage / totalUsage) * 100,
    allocatedCost: (totalCost * entity.usage) / totalUsage,
    accountCode: entity.accountCode,
  }));
}

/**
 * Approves cost allocation.
 * Authorizes cost allocation posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allocationId - Cost allocation ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<ICostAllocation>} Approved allocation
 *
 * @example
 * ```typescript
 * const approved = await approveCostAllocation(sequelize,
 *   'alloc-001', 'user-123');
 * ```
 */
export async function approveCostAllocation(
  sequelize: Sequelize,
  allocationId: string,
  approvedBy: string,
): Promise<ICostAllocation> {
  const CostAllocation = getCostAllocationModel(sequelize);

  const allocation = await CostAllocation.findByPk(allocationId);
  if (!allocation) {
    throw new Error(`Cost allocation ${allocationId} not found`);
  }

  allocation.status = 'APPROVED';
  await allocation.save();

  return allocation.toJSON() as ICostAllocation;
}

// ============================================================================
// JOINT VENTURES
// ============================================================================

/**
 * Creates a joint venture.
 * Establishes joint venture between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ventureName - Venture name
 * @param {string} ventureNumber - Venture number
 * @param {IJointVentureParticipant[]} participants - Participants
 * @param {string} purposeDescription - Purpose description
 * @param {number} totalBudget - Total budget
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} fiscalAgent - Fiscal agent entity ID
 * @returns {Promise<IJointVenture>} Created joint venture
 *
 * @example
 * ```typescript
 * const venture = await createJointVenture(sequelize,
 *   'Regional Water Authority', 'JV-2024-001',
 *   participants, 'Water infrastructure project',
 *   5000000, 2024, new Date('2024-01-01'),
 *   new Date('2029-12-31'), 'county-001');
 * ```
 */
export async function createJointVenture(
  sequelize: Sequelize,
  ventureName: string,
  ventureNumber: string,
  participants: IJointVentureParticipant[],
  purposeDescription: string,
  totalBudget: number,
  fiscalYear: number,
  startDate: Date,
  endDate: Date | null,
  fiscalAgent: string | null,
): Promise<IJointVenture> {
  const JointVenture = getJointVentureModel(sequelize);

  const venture = await JointVenture.create({
    ventureName,
    ventureNumber,
    participants,
    purposeDescription,
    totalBudget,
    fiscalYear,
    startDate,
    endDate,
    fiscalAgent,
    status: AgreementStatus.ACTIVE,
  });

  return venture.toJSON() as IJointVenture;
}

/**
 * Adds participant to joint venture.
 * Includes new entity in existing venture.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ventureId - Joint venture ID
 * @param {IJointVentureParticipant} participant - New participant
 * @returns {Promise<IJointVenture>} Updated joint venture
 *
 * @example
 * ```typescript
 * const updated = await addJointVentureParticipant(sequelize,
 *   'venture-001', participant);
 * ```
 */
export async function addJointVentureParticipant(
  sequelize: Sequelize,
  ventureId: string,
  participant: IJointVentureParticipant,
): Promise<IJointVenture> {
  const JointVenture = getJointVentureModel(sequelize);

  const venture = await JointVenture.findByPk(ventureId);
  if (!venture) {
    throw new Error(`Joint venture ${ventureId} not found`);
  }

  const participants = venture.participants as IJointVentureParticipant[];
  participants.push(participant);
  venture.participants = participants;
  await venture.save();

  return venture.toJSON() as IJointVenture;
}

// ============================================================================
// CONSORTIUM MANAGEMENT
// ============================================================================

/**
 * Creates a consortium.
 * Establishes multi-entity consortium.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consortiumName - Consortium name
 * @param {string} consortiumNumber - Consortium number
 * @param {string} consortiumType - Consortium type
 * @param {IConsortiumMember[]} members - Initial members
 * @param {string} chairEntityId - Chair entity ID
 * @param {Date} foundedDate - Founded date
 * @param {string} fiscalAgent - Fiscal agent entity ID
 * @param {string[]} services - Services provided
 * @returns {Promise<IConsortium>} Created consortium
 *
 * @example
 * ```typescript
 * const consortium = await createConsortium(sequelize,
 *   'Regional Planning Consortium', 'CONS-2024-001',
 *   'Planning', members, 'county-001', new Date('2024-01-01'),
 *   'county-001', ['Planning', 'Development']);
 * ```
 */
export async function createConsortium(
  sequelize: Sequelize,
  consortiumName: string,
  consortiumNumber: string,
  consortiumType: string,
  members: IConsortiumMember[],
  chairEntityId: string,
  foundedDate: Date,
  fiscalAgent: string,
  services: string[],
): Promise<IConsortium> {
  const Consortium = getConsortiumModel(sequelize);

  const consortium = await Consortium.create({
    consortiumName,
    consortiumNumber,
    consortiumType,
    members,
    chairEntityId,
    foundedDate,
    fiscalAgent,
    services,
    status: AgreementStatus.ACTIVE,
  });

  return consortium.toJSON() as IConsortium;
}

/**
 * Adds consortium member.
 * Includes new entity in consortium.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consortiumId - Consortium ID
 * @param {IConsortiumMember} member - New member
 * @returns {Promise<IConsortium>} Updated consortium
 *
 * @example
 * ```typescript
 * const updated = await addConsortiumMember(sequelize,
 *   'consortium-001', member);
 * ```
 */
export async function addConsortiumMember(
  sequelize: Sequelize,
  consortiumId: string,
  member: IConsortiumMember,
): Promise<IConsortium> {
  const Consortium = getConsortiumModel(sequelize);

  const consortium = await Consortium.findByPk(consortiumId);
  if (!consortium) {
    throw new Error(`Consortium ${consortiumId} not found`);
  }

  const members = consortium.members as IConsortiumMember[];
  members.push(member);
  consortium.members = members;
  await consortium.save();

  return consortium.toJSON() as IConsortium;
}

// ============================================================================
// INTER-ENTITY LOANS
// ============================================================================

/**
 * Creates an inter-entity loan.
 * Establishes loan between government entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanNumber - Loan number
 * @param {string} lenderEntityId - Lender entity ID
 * @param {string} borrowerEntityId - Borrower entity ID
 * @param {number} principalAmount - Principal amount
 * @param {number} interestRate - Annual interest rate
 * @param {Date} originationDate - Origination date
 * @param {Date} maturityDate - Maturity date
 * @param {ILoanPayment[]} paymentSchedule - Payment schedule
 * @returns {Promise<IInterEntityLoan>} Created loan
 *
 * @example
 * ```typescript
 * const loan = await createInterEntityLoan(sequelize,
 *   'LOAN-2024-001', 'county-001', 'city-001',
 *   1000000, 2.5, new Date('2024-01-01'),
 *   new Date('2034-01-01'), paymentSchedule);
 * ```
 */
export async function createInterEntityLoan(
  sequelize: Sequelize,
  loanNumber: string,
  lenderEntityId: string,
  borrowerEntityId: string,
  principalAmount: number,
  interestRate: number,
  originationDate: Date,
  maturityDate: Date,
  paymentSchedule: ILoanPayment[],
): Promise<IInterEntityLoan> {
  const InterEntityLoan = getInterEntityLoanModel(sequelize);

  const loan = await InterEntityLoan.create({
    loanNumber,
    lenderEntityId,
    borrowerEntityId,
    principalAmount,
    interestRate,
    originationDate,
    maturityDate,
    paymentSchedule,
    outstandingPrincipal: principalAmount,
    outstandingInterest: 0,
    status: 'ACTIVE',
  });

  return loan.toJSON() as IInterEntityLoan;
}

/**
 * Records loan payment.
 * Applies payment to loan balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanId - Loan ID
 * @param {number} paymentNumber - Payment number
 * @param {Date} paidDate - Payment date
 * @param {number} paidAmount - Amount paid
 * @returns {Promise<IInterEntityLoan>} Updated loan
 *
 * @example
 * ```typescript
 * const updated = await recordLoanPayment(sequelize, 'loan-001',
 *   1, new Date(), 10000);
 * ```
 */
export async function recordLoanPayment(
  sequelize: Sequelize,
  loanId: string,
  paymentNumber: number,
  paidDate: Date,
  paidAmount: number,
): Promise<IInterEntityLoan> {
  const InterEntityLoan = getInterEntityLoanModel(sequelize);

  const loan = await InterEntityLoan.findByPk(loanId);
  if (!loan) {
    throw new Error(`Loan ${loanId} not found`);
  }

  const schedule = loan.paymentSchedule as ILoanPayment[];
  const payment = schedule.find(p => p.paymentNumber === paymentNumber);

  if (!payment) {
    throw new Error(`Payment ${paymentNumber} not found in schedule`);
  }

  payment.paidDate = paidDate;
  payment.paidAmount = paidAmount;
  payment.status = 'PAID';

  loan.outstandingPrincipal -= payment.principalAmount;
  loan.outstandingInterest -= payment.interestAmount;
  loan.paymentSchedule = schedule;
  await loan.save();

  return loan.toJSON() as IInterEntityLoan;
}

/**
 * Calculates outstanding loan balance.
 * Returns total outstanding principal and interest.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} loanId - Loan ID
 * @returns {Promise<{principal: number, interest: number, total: number}>} Outstanding balance
 *
 * @example
 * ```typescript
 * const balance = await calculateLoanBalance(sequelize, 'loan-001');
 * console.log(`Outstanding: $${balance.total}`);
 * ```
 */
export async function calculateLoanBalance(
  sequelize: Sequelize,
  loanId: string,
): Promise<{ principal: number; interest: number; total: number }> {
  const InterEntityLoan = getInterEntityLoanModel(sequelize);

  const loan = await InterEntityLoan.findByPk(loanId);
  if (!loan) {
    throw new Error(`Loan ${loanId} not found`);
  }

  const principal = parseFloat(loan.outstandingPrincipal as any);
  const interest = parseFloat(loan.outstandingInterest as any);

  return {
    principal,
    interest,
    total: principal + interest,
  };
}

// ============================================================================
// STATE AID CALCULATIONS
// ============================================================================

/**
 * Creates a state aid calculation.
 * Calculates state aid for recipient entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} calculationId - Calculation ID
 * @param {string} aidProgramName - Aid program name
 * @param {string} recipientEntityId - Recipient entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {string} calculationMethod - Calculation method
 * @param {number} baseAmount - Base amount
 * @param {IAidAdjustment[]} adjustments - Adjustments
 * @param {Date[]} distributionSchedule - Distribution schedule
 * @returns {Promise<IStateAidCalculation>} Created calculation
 *
 * @example
 * ```typescript
 * const calculation = await createStateAidCalculation(sequelize,
 *   'CALC-2024-001', 'School Aid Formula', 'district-001',
 *   2024, 'Per-pupil allocation', 5000000, adjustments, dates);
 * ```
 */
export async function createStateAidCalculation(
  sequelize: Sequelize,
  calculationId: string,
  aidProgramName: string,
  recipientEntityId: string,
  fiscalYear: number,
  calculationMethod: string,
  baseAmount: number,
  adjustments: IAidAdjustment[],
  distributionSchedule: Date[],
): Promise<IStateAidCalculation> {
  const StateAidCalculation = getStateAidCalculationModel(sequelize);

  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  const calculatedAmount = baseAmount + totalAdjustments;

  const calculation = await StateAidCalculation.create({
    calculationId,
    aidProgramName,
    recipientEntityId,
    fiscalYear,
    calculationMethod,
    baseAmount,
    adjustments,
    calculatedAmount,
    approvedAmount: calculatedAmount,
    distributionSchedule,
    status: 'CALCULATED',
  });

  return calculation.toJSON() as IStateAidCalculation;
}

/**
 * Approves state aid calculation.
 * Authorizes state aid distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} calculationId - Calculation ID
 * @param {number} approvedAmount - Approved amount
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<IStateAidCalculation>} Approved calculation
 *
 * @example
 * ```typescript
 * const approved = await approveStateAid(sequelize, 'calc-001',
 *   5000000, 'user-123');
 * ```
 */
export async function approveStateAid(
  sequelize: Sequelize,
  calculationId: string,
  approvedAmount: number,
  approvedBy: string,
): Promise<IStateAidCalculation> {
  const StateAidCalculation = getStateAidCalculationModel(sequelize);

  const calculation = await StateAidCalculation.findByPk(calculationId);
  if (!calculation) {
    throw new Error(`State aid calculation ${calculationId} not found`);
  }

  calculation.approvedAmount = approvedAmount;
  calculation.status = 'APPROVED';
  await calculation.save();

  return calculation.toJSON() as IStateAidCalculation;
}

// ============================================================================
// FEDERAL REIMBURSEMENT TRACKING
// ============================================================================

/**
 * Creates a federal reimbursement request.
 * Requests federal reimbursement for eligible expenses.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementNumber - Reimbursement number
 * @param {string} federalProgramId - Federal program ID
 * @param {string} programName - Program name
 * @param {string} cfda - CFDA number
 * @param {string} recipientEntityId - Recipient entity ID
 * @param {number} requestedAmount - Requested amount
 * @param {number} federalShare - Federal share percent
 * @param {number} stateShare - State share percent
 * @param {number} localShare - Local share percent
 * @returns {Promise<IFederalReimbursement>} Created reimbursement request
 *
 * @example
 * ```typescript
 * const reimbursement = await createFederalReimbursement(sequelize,
 *   'FR-2024-001', 'prog-001', 'Medicaid', '93.778',
 *   'state-001', 1000000, 75, 15, 10);
 * ```
 */
export async function createFederalReimbursement(
  sequelize: Sequelize,
  reimbursementNumber: string,
  federalProgramId: string,
  programName: string,
  cfda: string,
  recipientEntityId: string,
  requestedAmount: number,
  federalShare: number,
  stateShare: number,
  localShare: number,
): Promise<IFederalReimbursement> {
  const FederalReimbursement = getFederalReimbursementModel(sequelize);

  const federalAmount = (requestedAmount * federalShare) / 100;
  const stateAmount = (requestedAmount * stateShare) / 100;
  const localAmount = (requestedAmount * localShare) / 100;

  const reimbursement = await FederalReimbursement.create({
    reimbursementNumber,
    federalProgramId,
    programName,
    cfda,
    recipientEntityId,
    requestedAmount,
    eligibleAmount: requestedAmount,
    approvedAmount: 0,
    federalShare: federalAmount,
    stateShare: stateAmount,
    localShare: localAmount,
    requestDate: new Date(),
    status: TransferStatus.PENDING,
  });

  return reimbursement.toJSON() as IFederalReimbursement;
}

/**
 * Approves federal reimbursement.
 * Authorizes federal reimbursement payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementId - Reimbursement ID
 * @param {number} approvedAmount - Approved amount
 * @param {Date} approvalDate - Approval date
 * @returns {Promise<IFederalReimbursement>} Approved reimbursement
 *
 * @example
 * ```typescript
 * const approved = await approveFederalReimbursement(sequelize,
 *   'reimb-001', 950000, new Date());
 * ```
 */
export async function approveFederalReimbursement(
  sequelize: Sequelize,
  reimbursementId: string,
  approvedAmount: number,
  approvalDate: Date,
): Promise<IFederalReimbursement> {
  const FederalReimbursement = getFederalReimbursementModel(sequelize);

  const reimbursement = await FederalReimbursement.findByPk(reimbursementId);
  if (!reimbursement) {
    throw new Error(`Federal reimbursement ${reimbursementId} not found`);
  }

  reimbursement.approvedAmount = approvedAmount;
  reimbursement.approvalDate = approvalDate;
  reimbursement.status = TransferStatus.APPROVED;
  await reimbursement.save();

  return reimbursement.toJSON() as IFederalReimbursement;
}

// ============================================================================
// COLLABORATIVE PROJECTS
// ============================================================================

/**
 * Creates a collaborative project.
 * Establishes multi-entity collaborative project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} projectNumber - Project number
 * @param {string} projectName - Project name
 * @param {string} projectDescription - Project description
 * @param {string} projectType - Project type
 * @param {IProjectPartner[]} partners - Project partners
 * @param {number} totalBudget - Total budget
 * @param {IProjectFunding[]} fundingSources - Funding sources
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} projectManager - Project manager
 * @returns {Promise<ICollaborativeProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createCollaborativeProject(sequelize,
 *   'PROJ-2024-001', 'Regional Infrastructure',
 *   'Joint infrastructure improvements', 'Infrastructure',
 *   partners, 10000000, funding, new Date('2024-01-01'),
 *   new Date('2026-12-31'), 'user-123');
 * ```
 */
export async function createCollaborativeProject(
  sequelize: Sequelize,
  projectNumber: string,
  projectName: string,
  projectDescription: string,
  projectType: string,
  partners: IProjectPartner[],
  totalBudget: number,
  fundingSources: IProjectFunding[],
  startDate: Date,
  endDate: Date,
  projectManager: string,
): Promise<ICollaborativeProject> {
  const CollaborativeProject = getCollaborativeProjectModel(sequelize);

  const project = await CollaborativeProject.create({
    projectNumber,
    projectName,
    projectDescription,
    projectType,
    partners,
    totalBudget,
    fundingSources,
    startDate,
    endDate,
    projectManager,
    status: 'ACTIVE',
  });

  return project.toJSON() as ICollaborativeProject;
}

// ============================================================================
// INTERGOVERNMENTAL RECONCILIATION
// ============================================================================

/**
 * Creates an intergovernmental reconciliation.
 * Reconciles transactions between two entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reconciliationId - Reconciliation ID
 * @param {Date} reconciliationDate - Reconciliation date
 * @param {string} entity1Id - First entity ID
 * @param {string} entity2Id - Second entity ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} entity1Balance - Entity 1 balance
 * @param {number} entity2Balance - Entity 2 balance
 * @param {IReconcilingItem[]} reconcilingItems - Reconciling items
 * @returns {Promise<IIntergovernmentalReconciliation>} Created reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await createIntergovernmentalReconciliation(
 *   sequelize, 'RECON-2024-001', new Date(), 'entity-001',
 *   'entity-002', new Date('2024-01-01'), new Date('2024-03-31'),
 *   100000, 99500, reconcilingItems);
 * ```
 */
export async function createIntergovernmentalReconciliation(
  sequelize: Sequelize,
  reconciliationId: string,
  reconciliationDate: Date,
  entity1Id: string,
  entity2Id: string,
  periodStart: Date,
  periodEnd: Date,
  entity1Balance: number,
  entity2Balance: number,
  reconcilingItems: IReconcilingItem[],
): Promise<IIntergovernmentalReconciliation> {
  const Reconciliation = getIntergovernmentalReconciliationModel(sequelize);

  const variance = Math.abs(entity1Balance - entity2Balance);

  const reconciliation = await Reconciliation.create({
    reconciliationId,
    reconciliationDate,
    entity1Id,
    entity2Id,
    periodStart,
    periodEnd,
    entity1Balance,
    entity2Balance,
    reconcilingItems,
    variance,
    resolved: variance === 0,
  });

  return reconciliation.toJSON() as IIntergovernmentalReconciliation;
}

/**
 * Resolves reconciliation.
 * Marks reconciliation as resolved.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reconciliationId - Reconciliation ID
 * @param {Date} resolvedDate - Resolved date
 * @returns {Promise<IIntergovernmentalReconciliation>} Resolved reconciliation
 *
 * @example
 * ```typescript
 * const resolved = await resolveReconciliation(sequelize,
 *   'recon-001', new Date());
 * ```
 */
export async function resolveReconciliation(
  sequelize: Sequelize,
  reconciliationId: string,
  resolvedDate: Date,
): Promise<IIntergovernmentalReconciliation> {
  const Reconciliation = getIntergovernmentalReconciliationModel(sequelize);

  const reconciliation = await Reconciliation.findByPk(reconciliationId);
  if (!reconciliation) {
    throw new Error(`Reconciliation ${reconciliationId} not found`);
  }

  reconciliation.resolved = true;
  reconciliation.resolvedDate = resolvedDate;
  await reconciliation.save();

  return reconciliation.toJSON() as IIntergovernmentalReconciliation;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

function getIntergovernmentalEntityModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IntergovernmentalEntity) return sequelize.models.IntergovernmentalEntity;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    entityCode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    entityName: { type: DataTypes.STRING(200), allowNull: false },
    entityType: { type: DataTypes.ENUM(...Object.values(EntityType)), allowNull: false },
    jurisdiction: { type: DataTypes.STRING(200), allowNull: false },
    fipsCode: { type: DataTypes.STRING(10), allowNull: true },
    contactName: { type: DataTypes.STRING(200), allowNull: false },
    contactEmail: { type: DataTypes.STRING(200), allowNull: false },
    contactPhone: { type: DataTypes.STRING(20), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
  };

  return sequelize.define('IntergovernmentalEntity', attributes, {
    sequelize,
    modelName: 'IntergovernmentalEntity',
    tableName: 'intergovernmental_entities',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['entity_code'], unique: true },
      { fields: ['entity_type'] },
      { fields: ['status'] },
    ],
  });
}

function getIntergovernmentalAgreementModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IntergovernmentalAgreement) return sequelize.models.IntergovernmentalAgreement;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    agreementNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    agreementName: { type: DataTypes.STRING(200), allowNull: false },
    agreementType: { type: DataTypes.ENUM(...Object.values(TransferType)), allowNull: false },
    parties: { type: DataTypes.ARRAY(DataTypes.UUID), allowNull: false },
    leadEntityId: { type: DataTypes.UUID, allowNull: false },
    effectiveDate: { type: DataTypes.DATEONLY, allowNull: false },
    expirationDate: { type: DataTypes.DATEONLY, allowNull: true },
    autoRenew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    terms: { type: DataTypes.TEXT, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
  };

  return sequelize.define('IntergovernmentalAgreement', attributes, {
    sequelize,
    modelName: 'IntergovernmentalAgreement',
    tableName: 'intergovernmental_agreements',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['agreement_number'], unique: true }, { fields: ['status'] }],
  });
}

function getIntergovernmentalTransferModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IntergovernmentalTransfer) return sequelize.models.IntergovernmentalTransfer;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    transferNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    transferType: { type: DataTypes.ENUM(...Object.values(TransferType)), allowNull: false },
    fromEntityId: { type: DataTypes.UUID, allowNull: false },
    toEntityId: { type: DataTypes.UUID, allowNull: false },
    agreementId: { type: DataTypes.UUID, allowNull: true },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    period: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    transferDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(TransferStatus)), allowNull: false },
    referenceNumber: { type: DataTypes.STRING(100), allowNull: true },
  };

  return sequelize.define('IntergovernmentalTransfer', attributes, {
    sequelize,
    modelName: 'IntergovernmentalTransfer',
    tableName: 'intergovernmental_transfers',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['transfer_number'], unique: true },
      { fields: ['from_entity_id'] },
      { fields: ['to_entity_id'] },
      { fields: ['fiscal_year'] },
    ],
  });
}

function getRevenueSharingModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.RevenueSharing) return sequelize.models.RevenueSharing;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sharingProgramId: { type: DataTypes.STRING(50), allowNull: false },
    programName: { type: DataTypes.STRING(200), allowNull: false },
    revenueSource: { type: DataTypes.STRING(200), allowNull: false },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    totalRevenue: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    distributionMethod: { type: DataTypes.ENUM(...Object.values(DistributionMethod)), allowNull: false },
    distributionFormula: { type: DataTypes.TEXT, allowNull: true },
    allocations: { type: DataTypes.JSON, allowNull: false },
    distributionDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('CALCULATED', 'APPROVED', 'DISTRIBUTED', 'COMPLETED'),
      allowNull: false,
    },
  };

  return sequelize.define('RevenueSharing', attributes, {
    sequelize,
    modelName: 'RevenueSharing',
    tableName: 'revenue_sharing',
    timestamps: true,
    underscored: true,
  });
}

function getGrantPassThroughModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.GrantPassThrough) return sequelize.models.GrantPassThrough;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    passthroughNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    primaryGrantId: { type: DataTypes.UUID, allowNull: false },
    primeRecipientId: { type: DataTypes.UUID, allowNull: false },
    subRecipientId: { type: DataTypes.UUID, allowNull: false },
    passthroughAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    federalShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    stateShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    localMatch: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    cfda: { type: DataTypes.STRING(20), allowNull: true },
    programName: { type: DataTypes.STRING(200), allowNull: false },
    periodStart: { type: DataTypes.DATEONLY, allowNull: false },
    periodEnd: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'CLOSED'), allowNull: false },
  };

  return sequelize.define('GrantPassThrough', attributes, {
    sequelize,
    modelName: 'GrantPassThrough',
    tableName: 'grant_pass_through',
    timestamps: true,
    underscored: true,
  });
}

function getIntergovernmentalBillingModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IntergovernmentalBilling) return sequelize.models.IntergovernmentalBilling;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    invoiceNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    billingEntityId: { type: DataTypes.UUID, allowNull: false },
    billedEntityId: { type: DataTypes.UUID, allowNull: false },
    billingCycle: { type: DataTypes.ENUM(...Object.values(BillingCycle)), allowNull: false },
    serviceDescription: { type: DataTypes.TEXT, allowNull: false },
    periodStart: { type: DataTypes.DATE, allowNull: false },
    periodEnd: { type: DataTypes.DATE, allowNull: false },
    lineItems: { type: DataTypes.JSON, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    adjustments: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    paidDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'),
      allowNull: false,
    },
  };

  return sequelize.define('IntergovernmentalBilling', attributes, {
    sequelize,
    modelName: 'IntergovernmentalBilling',
    tableName: 'intergovernmental_billing',
    timestamps: true,
    underscored: true,
  });
}

function getCostAllocationModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.CostAllocation) return sequelize.models.CostAllocation;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    allocationId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    costPoolName: { type: DataTypes.STRING(200), allowNull: false },
    totalCost: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    allocationMethod: { type: DataTypes.ENUM(...Object.values(DistributionMethod)), allowNull: false },
    allocationBasis: { type: DataTypes.STRING(200), allowNull: false },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    period: { type: DataTypes.STRING(20), allowNull: false },
    allocations: { type: DataTypes.JSON, allowNull: false },
    status: { type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'), allowNull: false },
  };

  return sequelize.define('CostAllocation', attributes, {
    sequelize,
    modelName: 'CostAllocation',
    tableName: 'cost_allocations',
    timestamps: true,
    underscored: true,
  });
}

function getJointVentureModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.JointVenture) return sequelize.models.JointVenture;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ventureName: { type: DataTypes.STRING(200), allowNull: false },
    ventureNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    participants: { type: DataTypes.JSON, allowNull: false },
    purposeDescription: { type: DataTypes.TEXT, allowNull: false },
    totalBudget: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
    fiscalAgent: { type: DataTypes.UUID, allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
  };

  return sequelize.define('JointVenture', attributes, {
    sequelize,
    modelName: 'JointVenture',
    tableName: 'joint_ventures',
    timestamps: true,
    underscored: true,
  });
}

function getConsortiumModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.Consortium) return sequelize.models.Consortium;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    consortiumName: { type: DataTypes.STRING(200), allowNull: false },
    consortiumNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    consortiumType: { type: DataTypes.STRING(100), allowNull: false },
    members: { type: DataTypes.JSON, allowNull: false },
    chairEntityId: { type: DataTypes.UUID, allowNull: false },
    foundedDate: { type: DataTypes.DATEONLY, allowNull: false },
    fiscalAgent: { type: DataTypes.UUID, allowNull: false },
    services: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(AgreementStatus)), allowNull: false },
  };

  return sequelize.define('Consortium', attributes, {
    sequelize,
    modelName: 'Consortium',
    tableName: 'consortiums',
    timestamps: true,
    underscored: true,
  });
}

function getInterEntityLoanModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.InterEntityLoan) return sequelize.models.InterEntityLoan;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    loanNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    lenderEntityId: { type: DataTypes.UUID, allowNull: false },
    borrowerEntityId: { type: DataTypes.UUID, allowNull: false },
    principalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    interestRate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    originationDate: { type: DataTypes.DATEONLY, allowNull: false },
    maturityDate: { type: DataTypes.DATEONLY, allowNull: false },
    paymentSchedule: { type: DataTypes.JSON, allowNull: false },
    outstandingPrincipal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    outstandingInterest: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PAID', 'DEFAULT', 'RESTRUCTURED'),
      allowNull: false,
    },
  };

  return sequelize.define('InterEntityLoan', attributes, {
    sequelize,
    modelName: 'InterEntityLoan',
    tableName: 'inter_entity_loans',
    timestamps: true,
    underscored: true,
  });
}

function getStateAidCalculationModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.StateAidCalculation) return sequelize.models.StateAidCalculation;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    calculationId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    aidProgramName: { type: DataTypes.STRING(200), allowNull: false },
    recipientEntityId: { type: DataTypes.UUID, allowNull: false },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    calculationMethod: { type: DataTypes.STRING(200), allowNull: false },
    baseAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    adjustments: { type: DataTypes.JSON, allowNull: false },
    calculatedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    approvedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    distributionSchedule: { type: DataTypes.ARRAY(DataTypes.DATE), allowNull: false },
    status: {
      type: DataTypes.ENUM('CALCULATED', 'APPROVED', 'DISTRIBUTED'),
      allowNull: false,
    },
  };

  return sequelize.define('StateAidCalculation', attributes, {
    sequelize,
    modelName: 'StateAidCalculation',
    tableName: 'state_aid_calculations',
    timestamps: true,
    underscored: true,
  });
}

function getFederalReimbursementModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.FederalReimbursement) return sequelize.models.FederalReimbursement;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reimbursementNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    federalProgramId: { type: DataTypes.UUID, allowNull: false },
    programName: { type: DataTypes.STRING(200), allowNull: false },
    cfda: { type: DataTypes.STRING(20), allowNull: false },
    recipientEntityId: { type: DataTypes.UUID, allowNull: false },
    requestedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    eligibleAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    approvedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    federalShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    stateShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    localShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    requestDate: { type: DataTypes.DATE, allowNull: false },
    approvalDate: { type: DataTypes.DATE, allowNull: true },
    disbursementDate: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(TransferStatus)), allowNull: false },
  };

  return sequelize.define('FederalReimbursement', attributes, {
    sequelize,
    modelName: 'FederalReimbursement',
    tableName: 'federal_reimbursements',
    timestamps: true,
    underscored: true,
  });
}

function getCollaborativeProjectModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.CollaborativeProject) return sequelize.models.CollaborativeProject;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    projectNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    projectName: { type: DataTypes.STRING(200), allowNull: false },
    projectDescription: { type: DataTypes.TEXT, allowNull: false },
    projectType: { type: DataTypes.STRING(100), allowNull: false },
    partners: { type: DataTypes.JSON, allowNull: false },
    totalBudget: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    fundingSources: { type: DataTypes.JSON, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    projectManager: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
    },
  };

  return sequelize.define('CollaborativeProject', attributes, {
    sequelize,
    modelName: 'CollaborativeProject',
    tableName: 'collaborative_projects',
    timestamps: true,
    underscored: true,
  });
}

function getIntergovernmentalReconciliationModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IntergovernmentalReconciliation)
    return sequelize.models.IntergovernmentalReconciliation;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reconciliationId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    reconciliationDate: { type: DataTypes.DATE, allowNull: false },
    entity1Id: { type: DataTypes.UUID, allowNull: false },
    entity2Id: { type: DataTypes.UUID, allowNull: false },
    periodStart: { type: DataTypes.DATE, allowNull: false },
    periodEnd: { type: DataTypes.DATE, allowNull: false },
    entity1Balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    entity2Balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    reconcilingItems: { type: DataTypes.JSON, allowNull: false },
    variance: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    resolvedDate: { type: DataTypes.DATE, allowNull: true },
  };

  return sequelize.define('IntergovernmentalReconciliation', attributes, {
    sequelize,
    modelName: 'IntergovernmentalReconciliation',
    tableName: 'intergovernmental_reconciliations',
    timestamps: true,
    underscored: true,
  });
}

export default {
  createIntergovernmentalEntity,
  getActiveEntities,
  updateEntityContact,
  createIntergovernmentalAgreement,
  getEntityAgreements,
  terminateAgreement,
  getExpiringAgreements,
  createIntergovernmentalTransfer,
  approveTransfer,
  completeTransfer,
  getEntityTransfers,
  calculateTotalTransfers,
  createRevenueSharing,
  calculatePerCapitaSharing,
  calculatePercentageSharing,
  approveRevenueSharing,
  createGrantPassThrough,
  getSubRecipientPassThroughs,
  calculateTotalPassThrough,
  createIntergovernmentalInvoice,
  recordInvoicePayment,
  getOutstandingInvoices,
  createCostAllocation,
  calculateUsageBasedAllocation,
  approveCostAllocation,
  createJointVenture,
  addJointVentureParticipant,
  createConsortium,
  addConsortiumMember,
  createInterEntityLoan,
  recordLoanPayment,
  calculateLoanBalance,
  createStateAidCalculation,
  approveStateAid,
  createFederalReimbursement,
  approveFederalReimbursement,
  createCollaborativeProject,
  createIntergovernmentalReconciliation,
  resolveReconciliation,
};
