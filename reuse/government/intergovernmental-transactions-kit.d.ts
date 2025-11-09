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
import { Sequelize } from 'sequelize';
/**
 * Entity type enumeration
 */
export declare enum EntityType {
    FEDERAL = "FEDERAL",
    STATE = "STATE",
    COUNTY = "COUNTY",
    CITY = "CITY",
    TOWNSHIP = "TOWNSHIP",
    SCHOOL_DISTRICT = "SCHOOL_DISTRICT",
    SPECIAL_DISTRICT = "SPECIAL_DISTRICT",
    REGIONAL_AUTHORITY = "REGIONAL_AUTHORITY",
    CONSORTIUM = "CONSORTIUM"
}
/**
 * Transfer type enumeration
 */
export declare enum TransferType {
    REVENUE_SHARING = "REVENUE_SHARING",
    GRANT_PASSTHROUGH = "GRANT_PASSTHROUGH",
    REIMBURSEMENT = "REIMBURSEMENT",
    STATE_AID = "STATE_AID",
    FEDERAL_AID = "FEDERAL_AID",
    PAYMENT_IN_LIEU = "PAYMENT_IN_LIEU",
    SHARED_SERVICE = "SHARED_SERVICE",
    JOINT_VENTURE = "JOINT_VENTURE",
    LOAN_PAYMENT = "LOAN_PAYMENT",
    RECIPROCAL_BILLING = "RECIPROCAL_BILLING"
}
/**
 * Transfer status enumeration
 */
export declare enum TransferStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    REVERSED = "REVERSED"
}
/**
 * Agreement status enumeration
 */
export declare enum AgreementStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED"
}
/**
 * Distribution method enumeration
 */
export declare enum DistributionMethod {
    EQUAL = "EQUAL",
    PERCENTAGE = "PERCENTAGE",
    FORMULA = "FORMULA",
    PER_CAPITA = "PER_CAPITA",
    ASSESSED_VALUE = "ASSESSED_VALUE",
    USAGE_BASED = "USAGE_BASED",
    COST_BASED = "COST_BASED"
}
/**
 * Billing cycle enumeration
 */
export declare enum BillingCycle {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMI_ANNUAL = "SEMI_ANNUAL",
    ANNUAL = "ANNUAL",
    ON_DEMAND = "ON_DEMAND"
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
export declare function createIntergovernmentalEntity(sequelize: Sequelize, entityCode: string, entityName: string, entityType: EntityType, jurisdiction: string, fipsCode: string | null, contactName: string, contactEmail: string, contactPhone: string, address: string): Promise<IIntergovernmentalEntity>;
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
export declare function getActiveEntities(sequelize: Sequelize, entityType?: EntityType): Promise<IIntergovernmentalEntity[]>;
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
export declare function updateEntityContact(sequelize: Sequelize, entityId: string, contactName: string, contactEmail: string, contactPhone: string): Promise<IIntergovernmentalEntity>;
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
export declare function createIntergovernmentalAgreement(sequelize: Sequelize, agreementNumber: string, agreementName: string, agreementType: TransferType, parties: string[], leadEntityId: string, effectiveDate: Date, expirationDate: Date | null, autoRenew: boolean, terms: string, totalAmount: number | null): Promise<IIntergovernmentalAgreement>;
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
export declare function getEntityAgreements(sequelize: Sequelize, entityId: string): Promise<IIntergovernmentalAgreement[]>;
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
export declare function terminateAgreement(sequelize: Sequelize, agreementId: string, reason: string): Promise<IIntergovernmentalAgreement>;
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
export declare function getExpiringAgreements(sequelize: Sequelize, daysAhead: number): Promise<IIntergovernmentalAgreement[]>;
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
export declare function createIntergovernmentalTransfer(sequelize: Sequelize, transferNumber: string, transferType: TransferType, fromEntityId: string, toEntityId: string, agreementId: string | null, amount: number, fiscalYear: number, period: string, description: string, transferDate: Date): Promise<IIntergovernmentalTransfer>;
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
export declare function approveTransfer(sequelize: Sequelize, transferId: string, approvedBy: string): Promise<IIntergovernmentalTransfer>;
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
export declare function completeTransfer(sequelize: Sequelize, transferId: string, referenceNumber: string): Promise<IIntergovernmentalTransfer>;
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
export declare function getEntityTransfers(sequelize: Sequelize, entityId: string, fiscalYear: number, direction: 'SENT' | 'RECEIVED'): Promise<IIntergovernmentalTransfer[]>;
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
export declare function calculateTotalTransfers(sequelize: Sequelize, entityId: string, fiscalYear: number, transferType: TransferType): Promise<number>;
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
export declare function createRevenueSharing(sequelize: Sequelize, sharingProgramId: string, programName: string, revenueSource: string, fiscalYear: number, totalRevenue: number, distributionMethod: DistributionMethod, distributionFormula: string | null, allocations: IRevenueAllocation[], distributionDate: Date): Promise<IRevenueSharing>;
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
export declare function calculatePerCapitaSharing(sequelize: Sequelize, totalRevenue: number, entities: Array<{
    entityId: string;
    entityName: string;
    population: number;
}>): Promise<IRevenueAllocation[]>;
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
export declare function calculatePercentageSharing(sequelize: Sequelize, totalRevenue: number, entities: Array<{
    entityId: string;
    entityName: string;
    percentage: number;
}>): Promise<IRevenueAllocation[]>;
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
export declare function approveRevenueSharing(sequelize: Sequelize, sharingId: string, approvedBy: string): Promise<IRevenueSharing>;
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
export declare function createGrantPassThrough(sequelize: Sequelize, passthroughNumber: string, primaryGrantId: string, primeRecipientId: string, subRecipientId: string, passthroughAmount: number, federalShare: number, stateShare: number, localMatch: number, cfda: string | null, programName: string, periodStart: Date, periodEnd: Date): Promise<IGrantPassThrough>;
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
export declare function getSubRecipientPassThroughs(sequelize: Sequelize, subRecipientId: string): Promise<IGrantPassThrough[]>;
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
export declare function calculateTotalPassThrough(sequelize: Sequelize, primeRecipientId: string, primaryGrantId: string): Promise<number>;
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
export declare function createIntergovernmentalInvoice(sequelize: Sequelize, invoiceNumber: string, billingEntityId: string, billedEntityId: string, billingCycle: BillingCycle, serviceDescription: string, periodStart: Date, periodEnd: Date, lineItems: IBillingLineItem[], adjustments: number, dueDate: Date): Promise<IIntergovernmentalBilling>;
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
export declare function recordInvoicePayment(sequelize: Sequelize, invoiceId: string, paidDate: Date, paymentReference: string): Promise<IIntergovernmentalBilling>;
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
export declare function getOutstandingInvoices(sequelize: Sequelize, billedEntityId: string): Promise<IIntergovernmentalBilling[]>;
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
export declare function createCostAllocation(sequelize: Sequelize, allocationId: string, costPoolName: string, totalCost: number, allocationMethod: DistributionMethod, allocationBasis: string, fiscalYear: number, period: string, allocations: ICostAllocationDetail[]): Promise<ICostAllocation>;
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
export declare function calculateUsageBasedAllocation(sequelize: Sequelize, totalCost: number, entities: Array<{
    entityId: string;
    entityName: string;
    usage: number;
    accountCode: string;
}>): Promise<ICostAllocationDetail[]>;
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
export declare function approveCostAllocation(sequelize: Sequelize, allocationId: string, approvedBy: string): Promise<ICostAllocation>;
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
export declare function createJointVenture(sequelize: Sequelize, ventureName: string, ventureNumber: string, participants: IJointVentureParticipant[], purposeDescription: string, totalBudget: number, fiscalYear: number, startDate: Date, endDate: Date | null, fiscalAgent: string | null): Promise<IJointVenture>;
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
export declare function addJointVentureParticipant(sequelize: Sequelize, ventureId: string, participant: IJointVentureParticipant): Promise<IJointVenture>;
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
export declare function createConsortium(sequelize: Sequelize, consortiumName: string, consortiumNumber: string, consortiumType: string, members: IConsortiumMember[], chairEntityId: string, foundedDate: Date, fiscalAgent: string, services: string[]): Promise<IConsortium>;
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
export declare function addConsortiumMember(sequelize: Sequelize, consortiumId: string, member: IConsortiumMember): Promise<IConsortium>;
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
export declare function createInterEntityLoan(sequelize: Sequelize, loanNumber: string, lenderEntityId: string, borrowerEntityId: string, principalAmount: number, interestRate: number, originationDate: Date, maturityDate: Date, paymentSchedule: ILoanPayment[]): Promise<IInterEntityLoan>;
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
export declare function recordLoanPayment(sequelize: Sequelize, loanId: string, paymentNumber: number, paidDate: Date, paidAmount: number): Promise<IInterEntityLoan>;
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
export declare function calculateLoanBalance(sequelize: Sequelize, loanId: string): Promise<{
    principal: number;
    interest: number;
    total: number;
}>;
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
export declare function createStateAidCalculation(sequelize: Sequelize, calculationId: string, aidProgramName: string, recipientEntityId: string, fiscalYear: number, calculationMethod: string, baseAmount: number, adjustments: IAidAdjustment[], distributionSchedule: Date[]): Promise<IStateAidCalculation>;
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
export declare function approveStateAid(sequelize: Sequelize, calculationId: string, approvedAmount: number, approvedBy: string): Promise<IStateAidCalculation>;
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
export declare function createFederalReimbursement(sequelize: Sequelize, reimbursementNumber: string, federalProgramId: string, programName: string, cfda: string, recipientEntityId: string, requestedAmount: number, federalShare: number, stateShare: number, localShare: number): Promise<IFederalReimbursement>;
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
export declare function approveFederalReimbursement(sequelize: Sequelize, reimbursementId: string, approvedAmount: number, approvalDate: Date): Promise<IFederalReimbursement>;
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
export declare function createCollaborativeProject(sequelize: Sequelize, projectNumber: string, projectName: string, projectDescription: string, projectType: string, partners: IProjectPartner[], totalBudget: number, fundingSources: IProjectFunding[], startDate: Date, endDate: Date, projectManager: string): Promise<ICollaborativeProject>;
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
export declare function createIntergovernmentalReconciliation(sequelize: Sequelize, reconciliationId: string, reconciliationDate: Date, entity1Id: string, entity2Id: string, periodStart: Date, periodEnd: Date, entity1Balance: number, entity2Balance: number, reconcilingItems: IReconcilingItem[]): Promise<IIntergovernmentalReconciliation>;
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
export declare function resolveReconciliation(sequelize: Sequelize, reconciliationId: string, resolvedDate: Date): Promise<IIntergovernmentalReconciliation>;
declare const _default: {
    createIntergovernmentalEntity: typeof createIntergovernmentalEntity;
    getActiveEntities: typeof getActiveEntities;
    updateEntityContact: typeof updateEntityContact;
    createIntergovernmentalAgreement: typeof createIntergovernmentalAgreement;
    getEntityAgreements: typeof getEntityAgreements;
    terminateAgreement: typeof terminateAgreement;
    getExpiringAgreements: typeof getExpiringAgreements;
    createIntergovernmentalTransfer: typeof createIntergovernmentalTransfer;
    approveTransfer: typeof approveTransfer;
    completeTransfer: typeof completeTransfer;
    getEntityTransfers: typeof getEntityTransfers;
    calculateTotalTransfers: typeof calculateTotalTransfers;
    createRevenueSharing: typeof createRevenueSharing;
    calculatePerCapitaSharing: typeof calculatePerCapitaSharing;
    calculatePercentageSharing: typeof calculatePercentageSharing;
    approveRevenueSharing: typeof approveRevenueSharing;
    createGrantPassThrough: typeof createGrantPassThrough;
    getSubRecipientPassThroughs: typeof getSubRecipientPassThroughs;
    calculateTotalPassThrough: typeof calculateTotalPassThrough;
    createIntergovernmentalInvoice: typeof createIntergovernmentalInvoice;
    recordInvoicePayment: typeof recordInvoicePayment;
    getOutstandingInvoices: typeof getOutstandingInvoices;
    createCostAllocation: typeof createCostAllocation;
    calculateUsageBasedAllocation: typeof calculateUsageBasedAllocation;
    approveCostAllocation: typeof approveCostAllocation;
    createJointVenture: typeof createJointVenture;
    addJointVentureParticipant: typeof addJointVentureParticipant;
    createConsortium: typeof createConsortium;
    addConsortiumMember: typeof addConsortiumMember;
    createInterEntityLoan: typeof createInterEntityLoan;
    recordLoanPayment: typeof recordLoanPayment;
    calculateLoanBalance: typeof calculateLoanBalance;
    createStateAidCalculation: typeof createStateAidCalculation;
    approveStateAid: typeof approveStateAid;
    createFederalReimbursement: typeof createFederalReimbursement;
    approveFederalReimbursement: typeof approveFederalReimbursement;
    createCollaborativeProject: typeof createCollaborativeProject;
    createIntergovernmentalReconciliation: typeof createIntergovernmentalReconciliation;
    resolveReconciliation: typeof resolveReconciliation;
};
export default _default;
//# sourceMappingURL=intergovernmental-transactions-kit.d.ts.map