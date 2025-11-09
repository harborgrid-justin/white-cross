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
import { Model } from 'sequelize-typescript';
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
export declare enum ContractType {
    PROVIDER_AGREEMENT = "PROVIDER_AGREEMENT",
    VENDOR_CONTRACT = "VENDOR_CONTRACT",
    PAYER_AGREEMENT = "PAYER_AGREEMENT",
    SERVICE_LEVEL_AGREEMENT = "SERVICE_LEVEL_AGREEMENT",
    EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
    PARTNERSHIP_AGREEMENT = "PARTNERSHIP_AGREEMENT",
    LICENSE_AGREEMENT = "LICENSE_AGREEMENT",
    LEASE_AGREEMENT = "LEASE_AGREEMENT",
    CONFIDENTIALITY_AGREEMENT = "CONFIDENTIALITY_AGREEMENT",
    CUSTOM = "CUSTOM"
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
export declare enum PartyRole {
    CLIENT = "CLIENT",
    PROVIDER = "PROVIDER",
    VENDOR = "VENDOR",
    PARTNER = "PARTNER",
    EMPLOYER = "EMPLOYER",
    EMPLOYEE = "EMPLOYEE",
    LICENSOR = "LICENSOR",
    LICENSEE = "LICENSEE",
    LESSOR = "LESSOR",
    LESSEE = "LESSEE"
}
/**
 * Organization types
 */
export declare enum OrganizationType {
    HOSPITAL = "HOSPITAL",
    CLINIC = "CLINIC",
    INSURANCE_COMPANY = "INSURANCE_COMPANY",
    PHARMACEUTICAL = "PHARMACEUTICAL",
    MEDICAL_DEVICE = "MEDICAL_DEVICE",
    LABORATORY = "LABORATORY",
    INDIVIDUAL = "INDIVIDUAL",
    GOVERNMENT = "GOVERNMENT",
    NON_PROFIT = "NON_PROFIT",
    CORPORATION = "CORPORATION"
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
export declare enum PaymentFrequency {
    ONE_TIME = "ONE_TIME",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY",
    CUSTOM = "CUSTOM"
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
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED",
    RENEWED = "RENEWED",
    AMENDED = "AMENDED"
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
export declare enum LifecycleStage {
    INITIATION = "INITIATION",
    NEGOTIATION = "NEGOTIATION",
    APPROVAL = "APPROVAL",
    EXECUTION = "EXECUTION",
    PERFORMANCE = "PERFORMANCE",
    RENEWAL = "RENEWAL",
    CLOSE_OUT = "CLOSE_OUT"
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
export declare enum ObligationStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    OVERDUE = "OVERDUE",
    WAIVED = "WAIVED",
    DISPUTED = "DISPUTED"
}
/**
 * Obligation priority
 */
export declare enum ObligationPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Obligation types
 */
export declare enum ObligationType {
    PAYMENT = "PAYMENT",
    DELIVERY = "DELIVERY",
    REPORTING = "REPORTING",
    COMPLIANCE = "COMPLIANCE",
    AUDIT = "AUDIT",
    NOTIFICATION = "NOTIFICATION",
    PERFORMANCE = "PERFORMANCE",
    CONFIDENTIALITY = "CONFIDENTIALITY"
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
export declare enum MilestoneStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    DELAYED = "DELAYED",
    CANCELLED = "CANCELLED"
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
export declare enum PeriodUnit {
    DAYS = "DAYS",
    WEEKS = "WEEKS",
    MONTHS = "MONTHS",
    YEARS = "YEARS"
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
export declare enum AdjustmentType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    CPI_INDEXED = "CPI_INDEXED",
    NEGOTIATED = "NEGOTIATED"
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
export declare enum AmendmentStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EFFECTIVE = "EFFECTIVE"
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
export declare enum NotificationType {
    RENEWAL_DUE = "RENEWAL_DUE",
    EXPIRATION_WARNING = "EXPIRATION_WARNING",
    OBLIGATION_DUE = "OBLIGATION_DUE",
    MILESTONE_DUE = "MILESTONE_DUE",
    PAYMENT_DUE = "PAYMENT_DUE",
    APPROVAL_REQUIRED = "APPROVAL_REQUIRED"
}
/**
 * Notification status
 */
export declare enum NotificationStatus {
    SCHEDULED = "SCHEDULED",
    SENT = "SENT",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
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
/**
 * Contract Model
 * Stores contract definitions
 */
export declare class ContractModel extends Model {
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
}
/**
 * Contract Amendment Model
 * Stores contract amendments
 */
export declare class ContractAmendmentModel extends Model {
    id: string;
    contractId: string;
    amendmentNumber: number;
    title: string;
    description: string;
    changes: AmendmentChange[];
    effectiveDate: Date;
    status: AmendmentStatus;
    approvedBy?: string[];
    metadata?: Record<string, any>;
}
/**
 * Renewal Notification Model
 * Stores renewal notifications
 */
export declare class RenewalNotificationModel extends Model {
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
export declare const createContract: (name: string, type: ContractType, parties: ContractParty[], startDate: Date, endDate: Date, options?: Partial<Contract>) => Contract;
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
export declare const addPartyToContract: (contract: Contract, party: ContractParty) => Contract;
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
export declare const createContractParty: (name: string, role: PartyRole, options?: Partial<ContractParty>) => ContractParty;
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
export declare const transitionLifecycleStage: (contract: Contract, newStage: LifecycleStage, triggeredBy: string) => {
    contract: Contract;
    transition: LifecycleTransition;
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
export declare const activateContract: (contract: Contract) => Contract;
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
export declare const createObligation: (contractId: string, title: string, responsibleParty: string, dueDate: Date, options?: Partial<Obligation>) => Obligation;
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
export declare const addObligationToContract: (contract: Contract, obligation: Obligation) => Contract;
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
export declare const completeObligation: (obligation: Obligation, verifiedBy: string) => Obligation;
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
export declare const getOverdueObligations: (contract: Contract) => Obligation[];
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
export declare const createMilestone: (contractId: string, name: string, targetDate: Date, options?: Partial<Milestone>) => Milestone;
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
export declare const addMilestoneToContract: (contract: Contract, milestone: Milestone) => Contract;
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
export declare const completeMilestone: (milestone: Milestone) => Milestone;
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
export declare const createRenewalTerms: (autoRenew: boolean, renewalPeriod: number, renewalPeriodUnit: PeriodUnit, options?: Partial<RenewalTerms>) => RenewalTerms;
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
export declare const isEligibleForRenewal: (contract: Contract) => boolean;
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
export declare const renewContract: (contract: Contract) => Contract;
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
export declare const convertPeriodToMilliseconds: (value: number, unit: PeriodUnit) => number;
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
export declare const calculateDaysUntilExpiration: (contract: Contract) => number;
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
export declare const isContractExpiringSoon: (contract: Contract, thresholdDays?: number) => boolean;
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
export declare const createContractAmendment: (contractId: string, amendmentNumber: number, title: string, changes: AmendmentChange[], effectiveDate: Date, options?: Partial<ContractAmendment>) => ContractAmendment;
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
export declare const applyAmendmentToContract: (contract: Contract, amendment: ContractAmendment) => Contract;
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
export declare const createRenewalNotification: (contractId: string, type: NotificationType, recipientEmails: string[], scheduledDate: Date, message: string) => RenewalNotification;
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
export declare const scheduleRenewalNotifications: (contract: Contract, recipientEmails: string[]) => RenewalNotification[];
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
export declare const terminateContract: (contract: Contract, reason: string) => Contract;
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
export declare const calculateAdjustedContractValue: (value: ContractValue, adjustment: PriceAdjustment) => ContractValue;
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
export declare const generateContractAnalytics: (contracts: Contract[]) => ContractAnalytics;
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
export declare const validateContractConfiguration: (contract: Contract) => string[];
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
export declare const exportContractToJSON: (contract: Contract) => string;
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
export declare const filterContractsByStatus: (contracts: Contract[], status: ContractStatus) => Contract[];
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
export declare const filterContractsByType: (contracts: Contract[], type: ContractType) => Contract[];
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
export declare const searchContractsByParty: (contracts: Contract[], partyName: string) => Contract[];
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
export declare const calculateContractPerformance: (contract: Contract) => Record<string, any>;
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
export declare const generateContractSummary: (contract: Contract) => Record<string, any>;
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
export declare const cloneContract: (contract: Contract, newName: string) => Contract;
/**
 * Contract Lifecycle Service
 * Production-ready NestJS service for contract lifecycle management
 */
export declare class ContractLifecycleService {
    /**
     * Creates and validates a new contract
     */
    createNewContract(name: string, type: ContractType, parties: ContractParty[], startDate: Date, endDate: Date): Promise<Contract>;
    /**
     * Processes contract renewal
     */
    processRenewal(contractId: string): Promise<Contract>;
}
declare const _default: {
    ContractModel: typeof ContractModel;
    ContractAmendmentModel: typeof ContractAmendmentModel;
    RenewalNotificationModel: typeof RenewalNotificationModel;
    createContract: (name: string, type: ContractType, parties: ContractParty[], startDate: Date, endDate: Date, options?: Partial<Contract>) => Contract;
    addPartyToContract: (contract: Contract, party: ContractParty) => Contract;
    createContractParty: (name: string, role: PartyRole, options?: Partial<ContractParty>) => ContractParty;
    transitionLifecycleStage: (contract: Contract, newStage: LifecycleStage, triggeredBy: string) => {
        contract: Contract;
        transition: LifecycleTransition;
    };
    activateContract: (contract: Contract) => Contract;
    createObligation: (contractId: string, title: string, responsibleParty: string, dueDate: Date, options?: Partial<Obligation>) => Obligation;
    addObligationToContract: (contract: Contract, obligation: Obligation) => Contract;
    completeObligation: (obligation: Obligation, verifiedBy: string) => Obligation;
    getOverdueObligations: (contract: Contract) => Obligation[];
    createMilestone: (contractId: string, name: string, targetDate: Date, options?: Partial<Milestone>) => Milestone;
    addMilestoneToContract: (contract: Contract, milestone: Milestone) => Contract;
    completeMilestone: (milestone: Milestone) => Milestone;
    createRenewalTerms: (autoRenew: boolean, renewalPeriod: number, renewalPeriodUnit: PeriodUnit, options?: Partial<RenewalTerms>) => RenewalTerms;
    isEligibleForRenewal: (contract: Contract) => boolean;
    renewContract: (contract: Contract) => Contract;
    convertPeriodToMilliseconds: (value: number, unit: PeriodUnit) => number;
    calculateDaysUntilExpiration: (contract: Contract) => number;
    isContractExpiringSoon: (contract: Contract, thresholdDays?: number) => boolean;
    createContractAmendment: (contractId: string, amendmentNumber: number, title: string, changes: AmendmentChange[], effectiveDate: Date, options?: Partial<ContractAmendment>) => ContractAmendment;
    applyAmendmentToContract: (contract: Contract, amendment: ContractAmendment) => Contract;
    createRenewalNotification: (contractId: string, type: NotificationType, recipientEmails: string[], scheduledDate: Date, message: string) => RenewalNotification;
    scheduleRenewalNotifications: (contract: Contract, recipientEmails: string[]) => RenewalNotification[];
    terminateContract: (contract: Contract, reason: string) => Contract;
    calculateAdjustedContractValue: (value: ContractValue, adjustment: PriceAdjustment) => ContractValue;
    generateContractAnalytics: (contracts: Contract[]) => ContractAnalytics;
    validateContractConfiguration: (contract: Contract) => string[];
    exportContractToJSON: (contract: Contract) => string;
    filterContractsByStatus: (contracts: Contract[], status: ContractStatus) => Contract[];
    filterContractsByType: (contracts: Contract[], type: ContractType) => Contract[];
    searchContractsByParty: (contracts: Contract[], partyName: string) => Contract[];
    calculateContractPerformance: (contract: Contract) => Record<string, any>;
    generateContractSummary: (contract: Contract) => Record<string, any>;
    cloneContract: (contract: Contract, newName: string) => Contract;
    ContractLifecycleService: typeof ContractLifecycleService;
};
export default _default;
//# sourceMappingURL=document-contract-lifecycle-composite.d.ts.map