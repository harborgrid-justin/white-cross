/**
 * LOC: ORD-CNT-001
 * File: /reuse/order/contract-agreement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Pricing services
 *   - Customer services
 *   - Contract management
 */
import { Model } from 'sequelize-typescript';
/**
 * Contract status
 */
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED",
    RENEWED = "RENEWED",
    AMENDED = "AMENDED"
}
/**
 * Contract types
 */
export declare enum ContractType {
    MASTER_AGREEMENT = "MASTER_AGREEMENT",
    PRICING_AGREEMENT = "PRICING_AGREEMENT",
    VOLUME_COMMITMENT = "VOLUME_COMMITMENT",
    BLANKET_ORDER = "BLANKET_ORDER",
    CONSIGNMENT = "CONSIGNMENT",
    REBATE_AGREEMENT = "REBATE_AGREEMENT",
    SERVICE_LEVEL = "SERVICE_LEVEL",
    EXCLUSIVE_SUPPLIER = "EXCLUSIVE_SUPPLIER",
    FRAMEWORK_AGREEMENT = "FRAMEWORK_AGREEMENT"
}
/**
 * Contract pricing type
 */
export declare enum ContractPricingType {
    FIXED_PRICE = "FIXED_PRICE",
    TIERED_PRICING = "TIERED_PRICING",
    VOLUME_DISCOUNT = "VOLUME_DISCOUNT",
    COST_PLUS = "COST_PLUS",
    INDEX_BASED = "INDEX_BASED",
    NEGOTIATED = "NEGOTIATED",
    MARKET_RATE = "MARKET_RATE"
}
/**
 * Renewal type
 */
export declare enum RenewalType {
    MANUAL = "MANUAL",
    AUTO_RENEW = "AUTO_RENEW",
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL",
    ONE_TIME_ONLY = "ONE_TIME_ONLY"
}
/**
 * Amendment type
 */
export declare enum AmendmentType {
    PRICING_CHANGE = "PRICING_CHANGE",
    TERM_EXTENSION = "TERM_EXTENSION",
    VOLUME_CHANGE = "VOLUME_CHANGE",
    PRODUCT_ADDITION = "PRODUCT_ADDITION",
    PRODUCT_REMOVAL = "PRODUCT_REMOVAL",
    TERMS_CHANGE = "TERMS_CHANGE",
    PARTY_CHANGE = "PARTY_CHANGE"
}
/**
 * Commitment type
 */
export declare enum CommitmentType {
    MINIMUM_QUANTITY = "MINIMUM_QUANTITY",
    MINIMUM_VALUE = "MINIMUM_VALUE",
    MAXIMUM_QUANTITY = "MAXIMUM_QUANTITY",
    MAXIMUM_VALUE = "MAXIMUM_VALUE",
    TARGET_QUANTITY = "TARGET_QUANTITY",
    TARGET_VALUE = "TARGET_VALUE"
}
/**
 * Commitment period
 */
export declare enum CommitmentPeriod {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY",
    CONTRACT_TERM = "CONTRACT_TERM"
}
/**
 * Penalty type for non-compliance
 */
export declare enum PenaltyType {
    PERCENTAGE_FEE = "PERCENTAGE_FEE",
    FIXED_FEE = "FIXED_FEE",
    PRICE_ADJUSTMENT = "PRICE_ADJUSTMENT",
    REBATE_REDUCTION = "REBATE_REDUCTION",
    CONTRACT_TERMINATION = "CONTRACT_TERMINATION",
    WARNING_ONLY = "WARNING_ONLY"
}
/**
 * Approval status
 */
export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REQUIRES_REVISION = "REQUIRES_REVISION"
}
/**
 * Performance metric type
 */
export declare enum PerformanceMetricType {
    PURCHASE_VOLUME = "PURCHASE_VOLUME",
    PURCHASE_VALUE = "PURCHASE_VALUE",
    DELIVERY_PERFORMANCE = "DELIVERY_PERFORMANCE",
    QUALITY_METRICS = "QUALITY_METRICS",
    COMPLIANCE_RATE = "COMPLIANCE_RATE",
    SAVINGS_ACHIEVED = "SAVINGS_ACHIEVED",
    ORDER_FREQUENCY = "ORDER_FREQUENCY"
}
/**
 * Contract pricing tier
 */
export interface ContractPricingTier {
    tierId: string;
    minQuantity: number;
    maxQuantity?: number;
    unitPrice: number;
    discountPercent?: number;
    effectiveDate?: Date;
    expirationDate?: Date;
}
/**
 * Volume commitment details
 */
export interface VolumeCommitment {
    commitmentId: string;
    commitmentType: CommitmentType;
    period: CommitmentPeriod;
    targetQuantity?: number;
    targetValue?: number;
    minQuantity?: number;
    minValue?: number;
    maxQuantity?: number;
    maxValue?: number;
    penaltyType?: PenaltyType;
    penaltyAmount?: number;
}
/**
 * Contract terms and conditions
 */
export interface ContractTerms {
    paymentTerms: string;
    deliveryTerms: string;
    warrantyPeriodDays?: number;
    returnPolicy?: string;
    lateFeePercent?: number;
    earlyPaymentDiscountPercent?: number;
    disputeResolution?: string;
    governingLaw?: string;
    exclusivityClause?: boolean;
    nonCompeteClause?: boolean;
    confidentialityClause?: boolean;
    forcemajeure?: string;
    customClauses?: Record<string, string>;
}
/**
 * Pricing schedule entry
 */
export interface PricingScheduleEntry {
    entryId: string;
    productId: string;
    productSku: string;
    effectiveDate: Date;
    expirationDate?: Date;
    unitPrice: number;
    currency: string;
    uom: string;
    minOrderQuantity?: number;
    leadTimeDays?: number;
}
/**
 * Contract performance metrics
 */
export interface ContractPerformanceMetrics {
    metricType: PerformanceMetricType;
    targetValue: number;
    actualValue: number;
    achievementPercent: number;
    periodStart: Date;
    periodEnd: Date;
    status: 'MEETING' | 'EXCEEDING' | 'BELOW_TARGET' | 'CRITICAL';
}
/**
 * Renewal notification
 */
export interface RenewalNotification {
    notificationId: string;
    recipientEmail: string;
    recipientName: string;
    scheduledDate: Date;
    sent: boolean;
    sentDate?: Date;
}
/**
 * Contract compliance check result
 */
export interface ComplianceCheckResult {
    checkId: string;
    checkType: string;
    passed: boolean;
    actualValue: number;
    requiredValue: number;
    variance: number;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
    timestamp: Date;
}
/**
 * Create contract DTO
 */
export declare class CreateContractDto {
    contractName: string;
    contractType: ContractType;
    customerId: string;
    supplierId?: string;
    startDate: Date;
    endDate: Date;
    pricingType: ContractPricingType;
    renewalType?: RenewalType;
    renewalNoticeDays?: number;
    terms?: ContractTerms;
    volumeCommitments?: VolumeCommitment[];
    description?: string;
    customFields?: Record<string, unknown>;
}
/**
 * Create contract pricing DTO
 */
export declare class CreateContractPricingDto {
    contractId: string;
    productId: string;
    baseUnitPrice: number;
    currency: string;
    uom?: string;
    pricingTiers?: ContractPricingTier[];
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    leadTimeDays?: number;
}
/**
 * Create contract amendment DTO
 */
export declare class CreateContractAmendmentDto {
    contractId: string;
    amendmentType: AmendmentType;
    description: string;
    effectiveDate: Date;
    previousValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    requiresApproval?: boolean;
}
/**
 * Renew contract DTO
 */
export declare class RenewContractDto {
    contractId: string;
    newStartDate: Date;
    newEndDate: Date;
    priceAdjustmentPercent?: number;
    copyPricing?: boolean;
    copyCommitments?: boolean;
    notes?: string;
}
/**
 * Contract compliance check DTO
 */
export declare class ContractComplianceCheckDto {
    contractId: string;
    periodStart: Date;
    periodEnd: Date;
    includeWarnings?: boolean;
}
/**
 * Contract model
 */
export declare class Contract extends Model {
    contractId: string;
    contractNumber: string;
    contractName: string;
    contractType: ContractType;
    status: ContractStatus;
    customerId: string;
    supplierId: string;
    startDate: Date;
    endDate: Date;
    totalValue: number;
    currency: string;
    pricingType: ContractPricingType;
    renewalType: RenewalType;
    renewalNoticeDays: number;
    renewalDate: Date;
    parentContractId: string;
    terms: ContractTerms;
    volumeCommitments: VolumeCommitment[];
    description: string;
    approvalStatus: ApprovalStatus;
    approvedBy: string;
    approvedDate: Date;
    documentUrl: string;
    customFields: Record<string, unknown>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    contractPricing: ContractPricing[];
    amendments: ContractAmendment[];
}
/**
 * Contract pricing model
 */
export declare class ContractPricing extends Model {
    contractPricingId: string;
    contractId: string;
    contract: Contract;
    productId: string;
    productSku: string;
    baseUnitPrice: number;
    currency: string;
    uom: string;
    pricingTiers: ContractPricingTier[];
    minOrderQuantity: number;
    maxOrderQuantity: number;
    leadTimeDays: number;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Contract amendment model
 */
export declare class ContractAmendment extends Model {
    amendmentId: string;
    contractId: string;
    contract: Contract;
    amendmentNumber: string;
    amendmentType: AmendmentType;
    description: string;
    effectiveDate: Date;
    previousValues: Record<string, unknown>;
    newValues: Record<string, unknown>;
    approvalStatus: ApprovalStatus;
    approvedBy: string;
    approvedDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Contract performance tracking model
 */
export declare class ContractPerformance extends Model {
    performanceId: string;
    contractId: string;
    metricType: PerformanceMetricType;
    periodStart: Date;
    periodEnd: Date;
    targetValue: number;
    actualValue: number;
    achievementPercent: number;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create a new contract
 *
 * Creates a new contract with validation and generates a unique contract number.
 *
 * @param contractData - Contract creation data
 * @param userId - User ID creating the contract
 * @returns Created contract
 *
 * @example
 * const contract = await createContract(contractDto, 'user-123');
 */
export declare function createContract(contractData: CreateContractDto, userId: string): Promise<Contract>;
/**
 * Generate unique contract number
 *
 * @param contractType - Contract type
 * @returns Generated contract number
 */
export declare function generateContractNumber(contractType: ContractType): Promise<string>;
/**
 * Add pricing to contract
 *
 * Adds product pricing details to an existing contract.
 *
 * @param pricingData - Contract pricing data
 * @returns Created contract pricing
 *
 * @example
 * const pricing = await addContractPricing(pricingDto);
 */
export declare function addContractPricing(pricingData: CreateContractPricingDto): Promise<ContractPricing>;
/**
 * Get contract by ID
 *
 * @param contractId - Contract ID
 * @param includePricing - Include pricing details
 * @param includeAmendments - Include amendments
 * @returns Contract with optional includes
 *
 * @example
 * const contract = await getContractById('contract-123', true, true);
 */
export declare function getContractById(contractId: string, includePricing?: boolean, includeAmendments?: boolean): Promise<Contract>;
/**
 * Get active contracts for customer
 *
 * Retrieves all active contracts for a specific customer.
 *
 * @param customerId - Customer ID
 * @param includeExpiringSoon - Include contracts expiring within 90 days
 * @returns Array of active contracts
 *
 * @example
 * const contracts = await getActiveContractsForCustomer('CUST-123', true);
 */
export declare function getActiveContractsForCustomer(customerId: string, includeExpiringSoon?: boolean): Promise<Contract[]>;
/**
 * Get contract pricing for product
 *
 * Retrieves contract pricing for a specific product and customer.
 *
 * @param customerId - Customer ID
 * @param productId - Product ID
 * @param quantity - Order quantity (for tiered pricing)
 * @returns Contract pricing or null
 *
 * @example
 * const pricing = await getContractPricingForProduct('CUST-123', 'PROD-001', 100);
 */
export declare function getContractPricingForProduct(customerId: string, productId: string, quantity?: number): Promise<{
    unitPrice: number;
    contractId: string;
    contractNumber: string;
} | null>;
/**
 * Activate contract
 *
 * Activates a contract after approval.
 *
 * @param contractId - Contract ID
 * @param userId - User ID activating the contract
 * @returns Activated contract
 *
 * @example
 * const contract = await activateContract('contract-123', 'user-456');
 */
export declare function activateContract(contractId: string, userId: string): Promise<Contract>;
/**
 * Approve contract
 *
 * Approves a pending contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID approving the contract
 * @param notes - Approval notes
 * @returns Approved contract
 *
 * @example
 * const contract = await approveContract('contract-123', 'user-456', 'Approved by management');
 */
export declare function approveContract(contractId: string, userId: string, notes?: string): Promise<Contract>;
/**
 * Create contract amendment
 *
 * Creates an amendment to an existing contract.
 *
 * @param amendmentData - Amendment data
 * @param userId - User ID creating the amendment
 * @returns Created amendment
 *
 * @example
 * const amendment = await createContractAmendment(amendmentDto, 'user-123');
 */
export declare function createContractAmendment(amendmentData: CreateContractAmendmentDto, userId: string): Promise<ContractAmendment>;
/**
 * Generate amendment number
 *
 * @param contractId - Contract ID
 * @returns Generated amendment number
 */
export declare function generateAmendmentNumber(contractId: string): Promise<string>;
/**
 * Renew contract
 *
 * Creates a new contract based on an expiring contract.
 *
 * @param renewalData - Renewal data
 * @param userId - User ID creating the renewal
 * @returns New contract (renewal)
 *
 * @example
 * const renewedContract = await renewContract(renewalDto, 'user-123');
 */
export declare function renewContract(renewalData: RenewContractDto, userId: string): Promise<Contract>;
/**
 * Get contracts expiring soon
 *
 * Retrieves contracts expiring within specified days.
 *
 * @param daysAhead - Days to look ahead (default 90)
 * @param renewalTypeFilter - Filter by renewal type
 * @returns Array of expiring contracts
 *
 * @example
 * const expiringContracts = await getExpiringContracts(60, RenewalType.AUTO_RENEW);
 */
export declare function getExpiringContracts(daysAhead?: number, renewalTypeFilter?: RenewalType): Promise<Contract[]>;
/**
 * Process auto-renewals
 *
 * Automatically renews contracts marked for auto-renewal that are expiring.
 *
 * @param daysBeforeExpiration - Days before expiration to process
 * @param userId - User ID for audit trail
 * @returns Count of processed renewals
 *
 * @example
 * const count = await processAutoRenewals(30, 'system');
 */
export declare function processAutoRenewals(daysBeforeExpiration?: number, userId?: string): Promise<number>;
/**
 * Check volume commitment compliance
 *
 * Checks if customer is meeting volume commitments in the contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Compliance check results
 *
 * @example
 * const results = await checkVolumeCommitmentCompliance('contract-123', startDate, endDate);
 */
export declare function checkVolumeCommitmentCompliance(contractId: string, periodStart: Date, periodEnd: Date): Promise<ComplianceCheckResult[]>;
/**
 * Calculate contract performance metrics
 *
 * Calculates various performance metrics for a contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Performance metrics
 *
 * @example
 * const metrics = await calculateContractPerformanceMetrics('contract-123', startDate, endDate);
 */
export declare function calculateContractPerformanceMetrics(contractId: string, periodStart: Date, periodEnd: Date): Promise<ContractPerformanceMetrics[]>;
/**
 * Record contract performance
 *
 * Records performance data for a contract period.
 *
 * @param contractId - Contract ID
 * @param metricType - Type of performance metric
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @param targetValue - Target value
 * @param actualValue - Actual value
 * @returns Created performance record
 *
 * @example
 * const perf = await recordContractPerformance('contract-123', PerformanceMetricType.PURCHASE_VOLUME, start, end, 1000, 950);
 */
export declare function recordContractPerformance(contractId: string, metricType: PerformanceMetricType, periodStart: Date, periodEnd: Date, targetValue: number, actualValue: number): Promise<ContractPerformance>;
/**
 * Terminate contract
 *
 * Terminates a contract before its end date.
 *
 * @param contractId - Contract ID
 * @param userId - User ID terminating the contract
 * @param reason - Termination reason
 * @param effectiveDate - Termination effective date
 * @returns Terminated contract
 *
 * @example
 * const contract = await terminateContract('contract-123', 'user-456', 'Customer request', new Date());
 */
export declare function terminateContract(contractId: string, userId: string, reason: string, effectiveDate: Date): Promise<Contract>;
/**
 * Suspend contract
 *
 * Temporarily suspends a contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID suspending the contract
 * @param reason - Suspension reason
 * @returns Suspended contract
 *
 * @example
 * const contract = await suspendContract('contract-123', 'user-456', 'Payment issue');
 */
export declare function suspendContract(contractId: string, userId: string, reason: string): Promise<Contract>;
/**
 * Reactivate suspended contract
 *
 * Reactivates a suspended contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID reactivating the contract
 * @returns Reactivated contract
 *
 * @example
 * const contract = await reactivateContract('contract-123', 'user-456');
 */
export declare function reactivateContract(contractId: string, userId: string): Promise<Contract>;
/**
 * Get contract pricing tiers
 *
 * Retrieves all pricing tiers for a product in a contract.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @returns Pricing tiers array
 *
 * @example
 * const tiers = await getContractPricingTiers('contract-123', 'PROD-001');
 */
export declare function getContractPricingTiers(contractId: string, productId: string): Promise<ContractPricingTier[]>;
/**
 * Calculate tiered contract price
 *
 * Calculates the price based on quantity and pricing tiers.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @param quantity - Order quantity
 * @returns Calculated unit price
 *
 * @example
 * const price = await calculateTieredContractPrice('contract-123', 'PROD-001', 500);
 */
export declare function calculateTieredContractPrice(contractId: string, productId: string, quantity: number): Promise<number | null>;
/**
 * Update contract pricing
 *
 * Updates pricing for a product in a contract.
 *
 * @param contractPricingId - Contract pricing ID
 * @param newPrice - New unit price
 * @param userId - User ID making the update
 * @returns Updated contract pricing
 *
 * @example
 * const pricing = await updateContractPricing('pricing-123', 99.99, 'user-456');
 */
export declare function updateContractPricing(contractPricingId: string, newPrice: number, userId: string): Promise<ContractPricing>;
/**
 * Bulk update contract pricing
 *
 * Updates pricing for multiple products with a percentage adjustment.
 *
 * @param contractId - Contract ID
 * @param adjustmentPercent - Percentage adjustment (positive or negative)
 * @param userId - User ID making the update
 * @returns Count of updated pricing records
 *
 * @example
 * const count = await bulkUpdateContractPricing('contract-123', 5.0, 'user-456');
 */
export declare function bulkUpdateContractPricing(contractId: string, adjustmentPercent: number, userId: string): Promise<number>;
/**
 * Get contract amendments
 *
 * Retrieves all amendments for a contract.
 *
 * @param contractId - Contract ID
 * @param amendmentType - Filter by amendment type
 * @returns Array of amendments
 *
 * @example
 * const amendments = await getContractAmendments('contract-123', AmendmentType.PRICING_CHANGE);
 */
export declare function getContractAmendments(contractId: string, amendmentType?: AmendmentType): Promise<ContractAmendment[]>;
/**
 * Approve contract amendment
 *
 * Approves a pending contract amendment.
 *
 * @param amendmentId - Amendment ID
 * @param userId - User ID approving the amendment
 * @returns Approved amendment
 *
 * @example
 * const amendment = await approveContractAmendment('amendment-123', 'user-456');
 */
export declare function approveContractAmendment(amendmentId: string, userId: string): Promise<ContractAmendment>;
/**
 * Get contract summary
 *
 * Returns a comprehensive summary of contract details.
 *
 * @param contractId - Contract ID
 * @returns Contract summary object
 *
 * @example
 * const summary = await getContractSummary('contract-123');
 */
export declare function getContractSummary(contractId: string): Promise<{
    contract: Contract;
    pricingCount: number;
    amendmentCount: number;
    daysRemaining: number;
    isExpiringSoon: boolean;
    complianceStatus: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
}>;
/**
 * Search contracts
 *
 * Searches contracts with various filters.
 *
 * @param filters - Search filters
 * @returns Array of matching contracts
 *
 * @example
 * const contracts = await searchContracts({ customerId: 'CUST-123', status: ContractStatus.ACTIVE });
 */
export declare function searchContracts(filters: {
    customerId?: string;
    status?: ContractStatus;
    contractType?: ContractType;
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
    searchText?: string;
}): Promise<Contract[]>;
/**
 * Export contract to JSON
 *
 * Exports contract data including pricing and amendments.
 *
 * @param contractId - Contract ID
 * @returns JSON string of contract data
 *
 * @example
 * const json = await exportContractToJson('contract-123');
 */
export declare function exportContractToJson(contractId: string): Promise<string>;
/**
 * Calculate contract savings
 *
 * Calculates total savings achieved through contract pricing vs standard pricing.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Savings summary
 *
 * @example
 * const savings = await calculateContractSavings('contract-123', startDate, endDate);
 */
export declare function calculateContractSavings(contractId: string, periodStart: Date, periodEnd: Date): Promise<{
    totalContractSpend: number;
    estimatedStandardSpend: number;
    totalSavings: number;
    savingsPercent: number;
}>;
/**
 * Send renewal notifications
 *
 * Sends notifications for contracts approaching expiration.
 *
 * @param contractId - Contract ID
 * @param recipients - Array of recipient emails
 * @returns Count of notifications sent
 *
 * @example
 * const count = await sendRenewalNotifications('contract-123', ['user@example.com']);
 */
export declare function sendRenewalNotifications(contractId: string, recipients: string[]): Promise<number>;
/**
 * Get contract analytics
 *
 * Returns analytics and insights for contracts.
 *
 * @param customerId - Customer ID (optional)
 * @param dateFrom - Start date for analytics
 * @param dateTo - End date for analytics
 * @returns Analytics summary
 *
 * @example
 * const analytics = await getContractAnalytics('CUST-123', startDate, endDate);
 */
export declare function getContractAnalytics(customerId?: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalContracts: number;
    activeContracts: number;
    expiringContracts: number;
    totalContractValue: number;
    averageContractDuration: number;
    topContractTypes: Array<{
        type: ContractType;
        count: number;
    }>;
}>;
//# sourceMappingURL=contract-agreement-kit.d.ts.map