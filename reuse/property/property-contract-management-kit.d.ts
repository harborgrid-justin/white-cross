/**
 * Property Contract Management Kit
 *
 * Comprehensive toolkit for vendor and service contract management in property
 * operations. Provides lifecycle management, SLA monitoring, compliance tracking,
 * vendor performance analytics, payment schedules, and multi-currency support
 * for enterprise property management systems.
 *
 * @module property-contract-management-kit
 * @category Property Management & Vendor Operations
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Contract type enumeration
 */
export type ContractType = 'vendor_service' | 'maintenance' | 'consulting' | 'software_license' | 'equipment_lease' | 'facility_management' | 'security_services' | 'cleaning_services' | 'landscaping' | 'utilities' | 'insurance' | 'construction' | 'professional_services';
/**
 * Contract status enumeration
 */
export type ContractStatus = 'draft' | 'under_review' | 'pending_approval' | 'approved' | 'active' | 'suspended' | 'renewal_pending' | 'expired' | 'terminated' | 'cancelled';
/**
 * Payment frequency enumeration
 */
export type PaymentFrequency = 'one_time' | 'daily' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'milestone_based';
/**
 * SLA compliance status
 */
export type SLAComplianceStatus = 'compliant' | 'warning' | 'breach' | 'critical';
/**
 * Currency codes (ISO 4217)
 */
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CNY';
/**
 * Contract entity with full details
 */
export interface Contract {
    id: string;
    contractNumber: string;
    contractName: string;
    contractType: ContractType;
    status: ContractStatus;
    vendorId: string;
    vendorName: string;
    vendorContact: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    propertyIds: string[];
    departmentId?: string;
    startDate: Date;
    endDate: Date;
    signedDate?: Date;
    effectiveDate?: Date;
    expirationDate: Date;
    noticePeriodDays: number;
    totalValue: number;
    currency: CurrencyCode;
    paymentTerms: string;
    paymentFrequency: PaymentFrequency;
    autoRenew: boolean;
    renewalNoticeDays: number;
    renewalTermMonths?: number;
    documentIds: string[];
    primaryDocumentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Date;
    tags: string[];
    notes?: string;
    customFields: Record<string, unknown>;
}
/**
 * Service Level Agreement definition
 */
export interface ServiceLevelAgreement {
    id: string;
    contractId: string;
    slaName: string;
    description: string;
    metricName: string;
    metricType: 'availability' | 'response_time' | 'resolution_time' | 'quality' | 'custom';
    targetValue: number;
    targetUnit: string;
    measurementFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    warningThreshold: number;
    criticalThreshold: number;
    penaltyEnabled: boolean;
    penaltyType: 'fixed' | 'percentage' | 'tiered';
    penaltyAmount?: number;
    penaltyTiers?: Array<{
        minBreach: number;
        maxBreach: number;
        penaltyAmount: number;
    }>;
    isActive: boolean;
    startDate: Date;
    endDate?: Date;
    creditAmount?: number;
    creditCurrency?: CurrencyCode;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * SLA performance measurement
 */
export interface SLAPerformance {
    id: string;
    slaId: string;
    contractId: string;
    measurementPeriod: {
        start: Date;
        end: Date;
    };
    actualValue: number;
    targetValue: number;
    unit: string;
    compliancePercentage: number;
    complianceStatus: SLAComplianceStatus;
    breachCount: number;
    breachDuration?: number;
    breachDetails?: Array<{
        timestamp: Date;
        actualValue: number;
        targetValue: number;
        severity: 'minor' | 'major' | 'critical';
    }>;
    penaltyApplied: boolean;
    penaltyAmount?: number;
    creditIssued?: number;
    trendDirection: 'improving' | 'stable' | 'declining';
    anomaliesDetected: boolean;
    measuredAt: Date;
    reportedBy: string;
}
/**
 * Payment schedule entry
 */
export interface PaymentSchedule {
    id: string;
    contractId: string;
    scheduleNumber: string;
    paymentAmount: number;
    currency: CurrencyCode;
    paymentDueDate: Date;
    description: string;
    status: 'scheduled' | 'pending' | 'processing' | 'paid' | 'overdue' | 'cancelled';
    paidDate?: Date;
    paidAmount?: number;
    invoiceNumber?: string;
    invoiceDate?: Date;
    invoiceUrl?: string;
    approvalRequired: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    paymentMethod?: 'wire_transfer' | 'ach' | 'check' | 'credit_card' | 'other';
    paymentReference?: string;
    lateFee?: number;
    discount?: number;
    adjustments?: Array<{
        type: 'sla_penalty' | 'discount' | 'credit' | 'other';
        amount: number;
        reason: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
    notes?: string;
}
/**
 * Contract amendment record
 */
export interface ContractAmendment {
    id: string;
    contractId: string;
    amendmentNumber: string;
    amendmentType: 'scope_change' | 'term_extension' | 'value_change' | 'sla_modification' | 'vendor_change' | 'other';
    description: string;
    effectiveDate: Date;
    changesSummary: string;
    fieldsModified: Array<{
        fieldName: string;
        oldValue: unknown;
        newValue: unknown;
        changeReason: string;
    }>;
    valueChange?: number;
    newTotalValue?: number;
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'executed';
    requestedBy: string;
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    documentIds: string[];
    amendmentDocumentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Vendor performance metrics
 */
export interface VendorPerformance {
    vendorId: string;
    vendorName: string;
    evaluationPeriod: {
        start: Date;
        end: Date;
    };
    activeContracts: number;
    totalContractValue: number;
    overallSLACompliance: number;
    slaBreachCount: number;
    criticalBreaches: number;
    onTimeDeliveryRate: number;
    qualityScore: number;
    responsiveness: number;
    totalPaid: number;
    paymentsOnTime: number;
    paymentsOverdue: number;
    penaltiesApplied: number;
    creditsIssued: number;
    incidentCount: number;
    criticalIncidents: number;
    averageResolutionTime: number;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    overallRating: number;
    performanceTier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'needs_improvement';
    recommendations: string[];
    actionItems: string[];
    generatedAt: Date;
    generatedBy: string;
}
/**
 * Contract compliance check result
 */
export interface ComplianceCheckResult {
    contractId: string;
    checkType: 'regulatory' | 'insurance' | 'licensing' | 'certification' | 'documentation' | 'performance';
    checkDate: Date;
    isCompliant: boolean;
    complianceScore: number;
    requirementsMet: number;
    requirementsTotal: number;
    issues: Array<{
        severity: 'critical' | 'high' | 'medium' | 'low';
        category: string;
        description: string;
        requirement: string;
        remediation: string;
        dueDate?: Date;
    }>;
    documentsVerified: number;
    documentsExpired: number;
    documentsMissing: number;
    certificationsValid: string[];
    certificationsExpired: string[];
    certificationsRequired: string[];
    nextReviewDate: Date;
    checkedBy: string;
    notes?: string;
}
/**
 * Contract renewal recommendation
 */
export interface RenewalRecommendation {
    contractId: string;
    contractName: string;
    currentEndDate: Date;
    recommendation: 'renew' | 'renew_with_modifications' | 'renegotiate' | 'terminate' | 'replace_vendor';
    confidence: number;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    performanceAnalysis: {
        overallScore: number;
        slaCompliance: number;
        costEffectiveness: number;
        serviceQuality: number;
    };
    costComparison: {
        currentAnnualCost: number;
        projectedRenewalCost: number;
        marketRate: number;
        potentialSavings: number;
    };
    alternativeVendorsAvailable: number;
    marketConditions: 'favorable' | 'neutral' | 'unfavorable';
    suggestedChanges: string[];
    negotiationPoints: string[];
    renewalRisks: string[];
    terminationRisks: string[];
    recommendedActionDate: Date;
    deadlineDate: Date;
    generatedAt: Date;
    generatedBy: string;
}
/**
 * Multi-currency exchange rate
 */
export interface ExchangeRate {
    fromCurrency: CurrencyCode;
    toCurrency: CurrencyCode;
    rate: number;
    effectiveDate: Date;
    source: string;
}
/**
 * Contract document metadata
 */
export interface ContractDocument {
    id: string;
    contractId: string;
    documentType: 'contract' | 'amendment' | 'invoice' | 'sla' | 'certificate' | 'insurance' | 'other';
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageUrl: string;
    version: string;
    isCurrentVersion: boolean;
    previousVersionId?: string;
    uploadedBy: string;
    uploadedAt: Date;
    description?: string;
    tags: string[];
    isConfidential: boolean;
    accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
    checksum?: string;
    digitalSignature?: string;
    verified: boolean;
    expirationDate?: Date;
}
/**
 * Creates a new vendor contract with comprehensive validation
 *
 * @param sequelize - Sequelize instance
 * @param contractData - Contract details
 * @param transaction - Optional transaction
 * @returns Created contract with assigned ID
 *
 * @example
 * ```typescript
 * const contract = await createContract(sequelize, {
 *   contractName: 'Annual HVAC Maintenance',
 *   vendorId: 'vendor-123',
 *   contractType: 'maintenance',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   totalValue: 50000,
 *   currency: 'USD'
 * });
 * ```
 */
export declare function createContract(sequelize: Sequelize, contractData: Partial<Contract>, transaction?: Transaction): Promise<Contract>;
/**
 * Updates an existing contract with change tracking
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param updates - Fields to update
 * @param updatedBy - User making the update
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export declare function updateContract(sequelize: Sequelize, contractId: string, updates: Partial<Contract>, updatedBy: string, transaction?: Transaction): Promise<Contract>;
/**
 * Retrieves a contract by its ID with full details
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns Contract details
 */
export declare function getContractById(sequelize: Sequelize, contractId: string): Promise<Contract>;
/**
 * Lists contracts with advanced filtering and pagination
 *
 * @param sequelize - Sequelize instance
 * @param filters - Filter criteria
 * @param options - Pagination and sorting options
 * @returns List of contracts and total count
 */
export declare function listContracts(sequelize: Sequelize, filters: {
    vendorId?: string;
    propertyId?: string;
    contractType?: ContractType;
    status?: ContractStatus[];
    expiringBefore?: Date;
    searchTerm?: string;
}, options?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}): Promise<{
    contracts: Contract[];
    total: number;
}>;
/**
 * Activates a contract after approval
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param approvedBy - User approving the contract
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export declare function activateContract(sequelize: Sequelize, contractId: string, approvedBy: string, transaction?: Transaction): Promise<Contract>;
/**
 * Terminates a contract with reason tracking
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param reason - Termination reason
 * @param terminatedBy - User terminating the contract
 * @param effectiveDate - When termination takes effect
 * @param transaction - Optional transaction
 * @returns Updated contract
 */
export declare function terminateContract(sequelize: Sequelize, contractId: string, reason: string, terminatedBy: string, effectiveDate?: Date, transaction?: Transaction): Promise<Contract>;
/**
 * Creates a new SLA for a contract
 *
 * @param sequelize - Sequelize instance
 * @param slaData - SLA details
 * @param transaction - Optional transaction
 * @returns Created SLA
 */
export declare function createSLA(sequelize: Sequelize, slaData: Partial<ServiceLevelAgreement>, transaction?: Transaction): Promise<ServiceLevelAgreement>;
/**
 * Records SLA performance measurement
 *
 * @param sequelize - Sequelize instance
 * @param slaId - SLA identifier
 * @param actualValue - Measured value
 * @param measurementPeriod - Time period for measurement
 * @param reportedBy - User recording the measurement
 * @param transaction - Optional transaction
 * @returns Performance record
 */
export declare function recordSLAPerformance(sequelize: Sequelize, slaId: string, actualValue: number, measurementPeriod: {
    start: Date;
    end: Date;
}, reportedBy: string, transaction?: Transaction): Promise<SLAPerformance>;
/**
 * Retrieves SLA compliance summary for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param periodStart - Start of analysis period
 * @param periodEnd - End of analysis period
 * @returns SLA compliance summary
 */
export declare function getSLAComplianceSummary(sequelize: Sequelize, contractId: string, periodStart: Date, periodEnd: Date): Promise<{
    overallCompliance: number;
    slaResults: Array<{
        slaName: string;
        compliance: number;
        status: SLAComplianceStatus;
        breachCount: number;
    }>;
}>;
/**
 * Monitors all active SLAs and generates alerts for breaches
 *
 * @param sequelize - Sequelize instance
 * @returns List of SLA breaches requiring attention
 */
export declare function monitorActiveSLAs(sequelize: Sequelize): Promise<Array<{
    contractId: string;
    contractName: string;
    slaName: string;
    currentStatus: SLAComplianceStatus;
    breachDuration: number;
    actionRequired: string;
}>>;
/**
 * Generates payment schedule for a contract based on payment frequency
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param transaction - Optional transaction
 * @returns Array of created payment schedule entries
 */
export declare function generatePaymentSchedule(sequelize: Sequelize, contractId: string, transaction?: Transaction): Promise<PaymentSchedule[]>;
/**
 * Creates a single payment schedule entry
 *
 * @param sequelize - Sequelize instance
 * @param paymentData - Payment details
 * @param transaction - Optional transaction
 * @returns Created payment schedule entry
 */
export declare function createPaymentScheduleEntry(sequelize: Sequelize, paymentData: Partial<PaymentSchedule>, transaction?: Transaction): Promise<PaymentSchedule>;
/**
 * Records a payment against a schedule entry
 *
 * @param sequelize - Sequelize instance
 * @param paymentId - Payment schedule ID
 * @param paidAmount - Amount paid
 * @param paymentMethod - Method of payment
 * @param paymentReference - Payment reference/confirmation number
 * @param transaction - Optional transaction
 * @returns Updated payment schedule
 */
export declare function recordPayment(sequelize: Sequelize, paymentId: string, paidAmount: number, paymentMethod: string, paymentReference: string, transaction?: Transaction): Promise<PaymentSchedule>;
/**
 * Retrieves upcoming payments requiring attention
 *
 * @param sequelize - Sequelize instance
 * @param daysAhead - Number of days to look ahead
 * @returns List of upcoming payments
 */
export declare function getUpcomingPayments(sequelize: Sequelize, daysAhead?: number): Promise<PaymentSchedule[]>;
/**
 * Identifies overdue payments and applies late fees
 *
 * @param sequelize - Sequelize instance
 * @param lateFeePercentage - Late fee as percentage of payment amount
 * @param transaction - Optional transaction
 * @returns List of payments marked as overdue
 */
export declare function processOverduePayments(sequelize: Sequelize, lateFeePercentage?: number, transaction?: Transaction): Promise<PaymentSchedule[]>;
/**
 * Creates a contract amendment with change tracking
 *
 * @param sequelize - Sequelize instance
 * @param amendmentData - Amendment details
 * @param transaction - Optional transaction
 * @returns Created amendment
 */
export declare function createContractAmendment(sequelize: Sequelize, amendmentData: Partial<ContractAmendment>, transaction?: Transaction): Promise<ContractAmendment>;
/**
 * Approves and executes a contract amendment
 *
 * @param sequelize - Sequelize instance
 * @param amendmentId - Amendment identifier
 * @param approvedBy - User approving the amendment
 * @param transaction - Optional transaction
 * @returns Updated amendment and contract
 */
export declare function approveAndExecuteAmendment(sequelize: Sequelize, amendmentId: string, approvedBy: string, transaction?: Transaction): Promise<{
    amendment: ContractAmendment;
    contract: Contract;
}>;
/**
 * Lists all amendments for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns List of amendments
 */
export declare function getContractAmendments(sequelize: Sequelize, contractId: string): Promise<ContractAmendment[]>;
/**
 * Calculates comprehensive vendor performance metrics
 *
 * @param sequelize - Sequelize instance
 * @param vendorId - Vendor identifier
 * @param evaluationPeriod - Time period for evaluation
 * @returns Vendor performance analysis
 */
export declare function calculateVendorPerformance(sequelize: Sequelize, vendorId: string, evaluationPeriod: {
    start: Date;
    end: Date;
}): Promise<VendorPerformance>;
/**
 * Compares multiple vendors for a specific service type
 *
 * @param sequelize - Sequelize instance
 * @param vendorIds - Array of vendor identifiers
 * @param serviceType - Type of service to compare
 * @param evaluationPeriod - Time period for comparison
 * @returns Comparative vendor analysis
 */
export declare function compareVendors(sequelize: Sequelize, vendorIds: string[], serviceType: ContractType, evaluationPeriod: {
    start: Date;
    end: Date;
}): Promise<{
    serviceType: ContractType;
    vendors: Array<VendorPerformance & {
        rank: number;
    }>;
    recommendation: string;
}>;
/**
 * Performs comprehensive compliance check on a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param checkType - Type of compliance check
 * @param checkedBy - User performing the check
 * @returns Compliance check results
 */
export declare function performComplianceCheck(sequelize: Sequelize, contractId: string, checkType: ComplianceCheckResult['checkType'], checkedBy: string): Promise<ComplianceCheckResult>;
/**
 * Generates compliance report for all contracts
 *
 * @param sequelize - Sequelize instance
 * @param filters - Optional filters
 * @returns Compliance summary across all contracts
 */
export declare function generateComplianceReport(sequelize: Sequelize, filters?: {
    vendorId?: string;
    propertyId?: string;
    contractType?: ContractType;
}): Promise<{
    totalContracts: number;
    compliantContracts: number;
    nonCompliantContracts: number;
    complianceRate: number;
    criticalIssues: number;
    highPriorityIssues: number;
    issuesByCategory: Record<string, number>;
}>;
/**
 * Identifies contracts approaching renewal date
 *
 * @param sequelize - Sequelize instance
 * @param daysAhead - Number of days to look ahead
 * @returns List of contracts requiring renewal action
 */
export declare function getContractsForRenewal(sequelize: Sequelize, daysAhead?: number): Promise<Contract[]>;
/**
 * Generates renewal recommendation based on performance and costs
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @returns Renewal recommendation with analysis
 */
export declare function generateRenewalRecommendation(sequelize: Sequelize, contractId: string): Promise<RenewalRecommendation>;
/**
 * Processes automatic contract renewal
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param transaction - Optional transaction
 * @returns Renewed contract
 */
export declare function processAutoRenewal(sequelize: Sequelize, contractId: string, transaction?: Transaction): Promise<Contract>;
/**
 * Converts amount between currencies using current exchange rates
 *
 * @param sequelize - Sequelize instance
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Converted amount
 */
export declare function convertCurrency(sequelize: Sequelize, amount: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): Promise<number>;
/**
 * Retrieves contract value in a specific currency
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param targetCurrency - Desired currency
 * @returns Contract value in target currency
 */
export declare function getContractValueInCurrency(sequelize: Sequelize, contractId: string, targetCurrency: CurrencyCode): Promise<{
    originalValue: number;
    originalCurrency: CurrencyCode;
    convertedValue: number;
    targetCurrency: CurrencyCode;
}>;
/**
 * Updates exchange rates from external source
 *
 * @param sequelize - Sequelize instance
 * @param rates - Array of exchange rates to update
 * @param transaction - Optional transaction
 * @returns Number of rates updated
 */
export declare function updateExchangeRates(sequelize: Sequelize, rates: ExchangeRate[], transaction?: Transaction): Promise<number>;
/**
 * Uploads and associates a document with a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param documentData - Document metadata
 * @param transaction - Optional transaction
 * @returns Created document record
 */
export declare function uploadContractDocument(sequelize: Sequelize, contractId: string, documentData: Partial<ContractDocument>, transaction?: Transaction): Promise<ContractDocument>;
/**
 * Retrieves all documents for a contract
 *
 * @param sequelize - Sequelize instance
 * @param contractId - Contract identifier
 * @param documentType - Optional filter by document type
 * @returns List of documents
 */
export declare function getContractDocuments(sequelize: Sequelize, contractId: string, documentType?: ContractDocument['documentType']): Promise<ContractDocument[]>;
//# sourceMappingURL=property-contract-management-kit.d.ts.map