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
import { Model, Sequelize, Transaction } from 'sequelize';
import Decimal from 'decimal.js';
/**
 * @enum LeaseType
 * @description Types of lease agreements
 */
export declare enum LeaseType {
    COMMERCIAL = "COMMERCIAL",
    RETAIL = "RETAIL",
    INDUSTRIAL = "INDUSTRIAL",
    OFFICE = "OFFICE",
    WAREHOUSE = "WAREHOUSE",
    MIXED_USE = "MIXED_USE",
    GROUND_LEASE = "GROUND_LEASE",
    SUBLEASE = "SUBLEASE"
}
/**
 * @enum LeaseStatus
 * @description Current status of lease
 */
export declare enum LeaseStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED",
    RENEWED = "RENEWED",
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION",
    ON_HOLD = "ON_HOLD"
}
/**
 * @enum EscalationType
 * @description Rent escalation methods
 */
export declare enum EscalationType {
    FIXED_PERCENTAGE = "FIXED_PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    CPI_INDEXED = "CPI_INDEXED",
    PERCENTAGE_RENT = "PERCENTAGE_RENT",
    STEPPED = "STEPPED",
    MARKET_REVIEW = "MARKET_REVIEW",
    NO_ESCALATION = "NO_ESCALATION"
}
/**
 * @enum RenewalStatus
 * @description Status of lease renewal process
 */
export declare enum RenewalStatus {
    NOT_ELIGIBLE = "NOT_ELIGIBLE",
    OPTION_AVAILABLE = "OPTION_AVAILABLE",
    NOTICE_PENDING = "NOTICE_PENDING",
    NOTICE_SENT = "NOTICE_SENT",
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION",
    RENEWED = "RENEWED",
    DECLINED = "DECLINED"
}
/**
 * @enum ChargeType
 * @description Types of lease charges
 */
export declare enum ChargeType {
    BASE_RENT = "BASE_RENT",
    CAM = "CAM",// Common Area Maintenance
    INSURANCE = "INSURANCE",
    PROPERTY_TAX = "PROPERTY_TAX",
    UTILITIES = "UTILITIES",
    PARKING = "PARKING",
    SIGNAGE = "SIGNAGE",
    PERCENTAGE_RENT = "PERCENTAGE_RENT",
    LATE_FEE = "LATE_FEE",
    OTHER = "OTHER"
}
/**
 * @enum ComplianceStatus
 * @description Lease compliance status
 */
export declare enum ComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    PENDING_REVIEW = "PENDING_REVIEW",
    GRACE_PERIOD = "GRACE_PERIOD",
    VIOLATION = "VIOLATION"
}
/**
 * @enum NotificationPriority
 * @description Priority levels for lease notifications
 */
export declare enum NotificationPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
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
    escalationFrequency?: number;
    paymentDay?: number;
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
    tenantShare: number;
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
    frequency?: string;
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
export declare const createLeaseContract: (data: LeaseContractData, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const updateLeaseContract: (leaseId: string, updates: Partial<LeaseContractData>, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const getLeaseContract: (leaseId: string, sequelize: Sequelize) => Promise<Model>;
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
export declare const archiveLeaseContract: (leaseId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const extractLeaseKeyDates: (leaseId: string, sequelize: Sequelize) => Promise<LeaseKeyDates>;
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
export declare const generateLeaseAbstract: (leaseId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
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
export declare const monitorCriticalDates: (leaseId: string, sequelize: Sequelize) => Promise<Array<{
    date: Date;
    description: string;
    daysUntil: number;
}>>;
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
export declare const calculateMonthlyRent: (leaseId: string, calculationDate: Date, sequelize: Sequelize) => Promise<RentCalculationResult>;
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
export declare const applyRentEscalation: (leaseId: string, escalation: RentEscalation, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const calculatePercentageRent: (leaseId: string, grossSales: number, breakpoint: number, percentageRate: number, sequelize: Sequelize) => Promise<Decimal>;
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
export declare const projectFutureEscalations: (leaseId: string, sequelize: Sequelize) => Promise<Array<{
    date: Date;
    rent: Decimal;
}>>;
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
export declare const checkRenewalEligibility: (leaseId: string, sequelize: Sequelize) => Promise<{
    eligible: boolean;
    status: RenewalStatus;
    daysUntilNotice?: number;
}>;
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
export declare const initiateLeaseRenewal: (leaseId: string, renewalTermMonths: number, renewalTerms: Partial<LeaseContractData>, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const sendRenewalNotice: (leaseId: string, recipientEmail: string, sequelize: Sequelize) => Promise<LeaseNotification>;
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
export declare const exerciseRenewalOption: (leaseId: string, renewalId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const reconcileCAMCharges: (leaseId: string, year: number, data: Partial<CAMReconciliation>, sequelize: Sequelize, transaction?: Transaction) => Promise<CAMReconciliation>;
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
export declare const generateCAMStatement: (leaseId: string, year: number, sequelize: Sequelize) => Promise<Record<string, any>>;
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
export declare const calculateProRataShare: (leaseId: string, totalPropertyArea: number, sequelize: Sequelize) => Promise<number>;
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
export declare const createComplianceObligation: (obligation: ComplianceObligation, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const checkLeaseCompliance: (leaseId: string, sequelize: Sequelize) => Promise<Array<ComplianceObligation>>;
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
export declare const updateComplianceStatus: (obligationId: string, status: ComplianceStatus, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const generateComplianceReport: (leaseId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
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
export declare const createCriticalDateNotification: (notification: LeaseNotification, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const getPendingNotifications: (leaseId: string | undefined, sequelize: Sequelize) => Promise<Array<LeaseNotification>>;
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
export declare const acknowledgeNotification: (notificationId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const generateAutomatedNotifications: (daysAhead: number, sequelize: Sequelize) => Promise<number>;
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
export declare const compareLeaseVsActual: (leaseId: string, period: string, sequelize: Sequelize) => Promise<LeaseVsActual>;
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
export declare const generateVarianceReport: (leaseIds: string[], period: string, sequelize: Sequelize) => Promise<Array<LeaseVsActual>>;
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
export declare const identifyBudgetVariances: (thresholdPercentage: number, period: string, sequelize: Sequelize) => Promise<Array<LeaseVsActual>>;
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
export declare const initiateLeaseTermination: (termination: LeaseTermination, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
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
export declare const calculateTerminationBuyout: (leaseId: string, terminationDate: Date, sequelize: Sequelize) => Promise<Decimal>;
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
export declare const processFinalReconciliation: (leaseId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<Record<string, any>>;
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
export declare const allocateSharedExpenses: (propertyId: string, period: string, totalExpense: number, allocationType: "PRO_RATA" | "EQUAL" | "CUSTOM", sequelize: Sequelize) => Promise<MultiTenantAllocation>;
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
export declare const generateRentRoll: (propertyId: string, asOfDate: Date, sequelize: Sequelize) => Promise<Array<RentRollEntry>>;
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
export declare const calculatePortfolioMetrics: (propertyIds: string[], sequelize: Sequelize) => Promise<LeasePortfolioMetrics>;
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
export declare const coordinateMultiTenantCAM: (propertyId: string, year: number, totalCAMExpense: number, sequelize: Sequelize, transaction?: Transaction) => Promise<Array<CAMReconciliation>>;
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
export declare const validateLeaseData: (leaseId: string, sequelize: Sequelize) => Promise<{
    valid: boolean;
    errors: string[];
}>;
declare const _default: {
    createLeaseContract: (data: LeaseContractData, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    updateLeaseContract: (leaseId: string, updates: Partial<LeaseContractData>, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    getLeaseContract: (leaseId: string, sequelize: Sequelize) => Promise<Model>;
    archiveLeaseContract: (leaseId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    extractLeaseKeyDates: (leaseId: string, sequelize: Sequelize) => Promise<LeaseKeyDates>;
    generateLeaseAbstract: (leaseId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    monitorCriticalDates: (leaseId: string, sequelize: Sequelize) => Promise<Array<{
        date: Date;
        description: string;
        daysUntil: number;
    }>>;
    calculateMonthlyRent: (leaseId: string, calculationDate: Date, sequelize: Sequelize) => Promise<RentCalculationResult>;
    applyRentEscalation: (leaseId: string, escalation: RentEscalation, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    calculatePercentageRent: (leaseId: string, grossSales: number, breakpoint: number, percentageRate: number, sequelize: Sequelize) => Promise<Decimal>;
    projectFutureEscalations: (leaseId: string, sequelize: Sequelize) => Promise<Array<{
        date: Date;
        rent: Decimal;
    }>>;
    checkRenewalEligibility: (leaseId: string, sequelize: Sequelize) => Promise<{
        eligible: boolean;
        status: RenewalStatus;
        daysUntilNotice?: number;
    }>;
    initiateLeaseRenewal: (leaseId: string, renewalTermMonths: number, renewalTerms: Partial<LeaseContractData>, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    sendRenewalNotice: (leaseId: string, recipientEmail: string, sequelize: Sequelize) => Promise<LeaseNotification>;
    exerciseRenewalOption: (leaseId: string, renewalId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    reconcileCAMCharges: (leaseId: string, year: number, data: Partial<CAMReconciliation>, sequelize: Sequelize, transaction?: Transaction) => Promise<CAMReconciliation>;
    generateCAMStatement: (leaseId: string, year: number, sequelize: Sequelize) => Promise<Record<string, any>>;
    calculateProRataShare: (leaseId: string, totalPropertyArea: number, sequelize: Sequelize) => Promise<number>;
    createComplianceObligation: (obligation: ComplianceObligation, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    checkLeaseCompliance: (leaseId: string, sequelize: Sequelize) => Promise<Array<ComplianceObligation>>;
    updateComplianceStatus: (obligationId: string, status: ComplianceStatus, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    generateComplianceReport: (leaseId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    createCriticalDateNotification: (notification: LeaseNotification, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    getPendingNotifications: (leaseId: string | undefined, sequelize: Sequelize) => Promise<Array<LeaseNotification>>;
    acknowledgeNotification: (notificationId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    generateAutomatedNotifications: (daysAhead: number, sequelize: Sequelize) => Promise<number>;
    compareLeaseVsActual: (leaseId: string, period: string, sequelize: Sequelize) => Promise<LeaseVsActual>;
    generateVarianceReport: (leaseIds: string[], period: string, sequelize: Sequelize) => Promise<Array<LeaseVsActual>>;
    identifyBudgetVariances: (thresholdPercentage: number, period: string, sequelize: Sequelize) => Promise<Array<LeaseVsActual>>;
    initiateLeaseTermination: (termination: LeaseTermination, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    calculateTerminationBuyout: (leaseId: string, terminationDate: Date, sequelize: Sequelize) => Promise<Decimal>;
    processFinalReconciliation: (leaseId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<Record<string, any>>;
    allocateSharedExpenses: (propertyId: string, period: string, totalExpense: number, allocationType: "PRO_RATA" | "EQUAL" | "CUSTOM", sequelize: Sequelize) => Promise<MultiTenantAllocation>;
    generateRentRoll: (propertyId: string, asOfDate: Date, sequelize: Sequelize) => Promise<Array<RentRollEntry>>;
    calculatePortfolioMetrics: (propertyIds: string[], sequelize: Sequelize) => Promise<LeasePortfolioMetrics>;
    coordinateMultiTenantCAM: (propertyId: string, year: number, totalCAMExpense: number, sequelize: Sequelize, transaction?: Transaction) => Promise<Array<CAMReconciliation>>;
    validateLeaseData: (leaseId: string, sequelize: Sequelize) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
};
export default _default;
//# sourceMappingURL=property-lease-management-kit.d.ts.map