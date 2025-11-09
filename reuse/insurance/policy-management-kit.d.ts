/**
 * LOC: INS-POLICY-001
 * File: /reuse/insurance/policy-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Policy administration modules
 *   - Underwriting services
 *   - Agency management systems
 */
import { Transaction, Sequelize } from 'sequelize';
/**
 * Policy status
 */
export declare enum PolicyStatus {
    QUOTE = "quote",
    QUOTED = "quoted",
    BOUND = "bound",
    ISSUED = "issued",
    ACTIVE = "active",
    PENDING_RENEWAL = "pending_renewal",
    RENEWED = "renewed",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
    LAPSED = "lapsed",
    SUSPENDED = "suspended",
    REINSTATED = "reinstated",
    TERMINATED = "terminated",
    PENDING_CANCELLATION = "pending_cancellation"
}
/**
 * Policy type
 */
export declare enum PolicyType {
    AUTO = "auto",
    HOME = "home",
    RENTERS = "renters",
    CONDO = "condo",
    LIFE = "life",
    HEALTH = "health",
    DISABILITY = "disability",
    UMBRELLA = "umbrella",
    COMMERCIAL_AUTO = "commercial_auto",
    COMMERCIAL_PROPERTY = "commercial_property",
    GENERAL_LIABILITY = "general_liability",
    WORKERS_COMP = "workers_comp",
    PROFESSIONAL_LIABILITY = "professional_liability",
    CYBER = "cyber",
    BUNDLE = "bundle"
}
/**
 * Cancellation reason
 */
export declare enum CancellationReason {
    NON_PAYMENT = "non_payment",
    CUSTOMER_REQUEST = "customer_request",
    UNDERWRITING_DECISION = "underwriting_decision",
    MATERIAL_MISREPRESENTATION = "material_misrepresentation",
    FRAUD = "fraud",
    INSURED_DECEASED = "insured_deceased",
    ASSET_SOLD = "asset_sold",
    REPLACED = "replaced",
    REGULATORY = "regulatory",
    REWRITE = "rewrite"
}
/**
 * Payment frequency
 */
export declare enum PaymentFrequency {
    ANNUAL = "annual",
    SEMI_ANNUAL = "semi_annual",
    QUARTERLY = "quarterly",
    MONTHLY = "monthly",
    PAY_IN_FULL = "pay_in_full"
}
/**
 * Insured type
 */
export declare enum InsuredType {
    NAMED_INSURED = "named_insured",
    ADDITIONAL_INSURED = "additional_insured",
    LOSS_PAYEE = "loss_payee",
    MORTGAGEE = "mortgagee",
    LIENHOLDER = "lienholder",
    CERTIFICATE_HOLDER = "certificate_holder"
}
/**
 * Policy version reason
 */
export declare enum VersionReason {
    NEW_BUSINESS = "new_business",
    RENEWAL = "renewal",
    ENDORSEMENT = "endorsement",
    MIDTERM_CHANGE = "midterm_change",
    CORRECTION = "correction",
    REINSTATEMENT = "reinstatement",
    CANCELLATION = "cancellation",
    REWRITE = "rewrite"
}
/**
 * Document type
 */
export declare enum PolicyDocumentType {
    DECLARATION = "declaration",
    POLICY_FORM = "policy_form",
    ENDORSEMENT = "endorsement",
    CERTIFICATE = "certificate",
    BINDER = "binder",
    ID_CARD = "id_card",
    CANCELLATION_NOTICE = "cancellation_notice",
    RENEWAL_NOTICE = "renewal_notice",
    BILLING_STATEMENT = "billing_statement"
}
/**
 * Policy search criteria
 */
export interface PolicySearchCriteria {
    policyNumber?: string;
    policyHolderName?: string;
    policyHolderId?: string;
    status?: PolicyStatus[];
    type?: PolicyType[];
    effectiveDateFrom?: Date;
    effectiveDateTo?: Date;
    expirationDateFrom?: Date;
    expirationDateTo?: Date;
    agentId?: string;
    agencyId?: string;
    state?: string;
    zip?: string;
    bindDateFrom?: Date;
    bindDateTo?: Date;
}
/**
 * Policy creation data
 */
export interface PolicyCreationData {
    policyType: PolicyType;
    policyHolderId: string;
    effectiveDate: Date;
    expirationDate: Date;
    premiumAmount: number;
    paymentFrequency: PaymentFrequency;
    agentId?: string;
    agencyId?: string;
    underwriterId?: string;
    state: string;
    coverages: PolicyCoverage[];
    deductibles?: PolicyDeductible[];
    limits?: PolicyLimit[];
    discounts?: PolicyDiscount[];
    surcharges?: PolicySurcharge[];
    billingAddress?: Address;
    mailingAddress?: Address;
    metadata?: Record<string, any>;
}
/**
 * Policy coverage
 */
export interface PolicyCoverage {
    coverageCode: string;
    coverageName: string;
    limit: number;
    deductible?: number;
    premium: number;
    description?: string;
    optional: boolean;
}
/**
 * Policy deductible
 */
export interface PolicyDeductible {
    type: string;
    amount: number;
    appliesToCoverages: string[];
}
/**
 * Policy limit
 */
export interface PolicyLimit {
    type: string;
    amount: number;
    perOccurrence?: number;
    aggregate?: number;
}
/**
 * Policy discount
 */
export interface PolicyDiscount {
    discountCode: string;
    discountName: string;
    discountAmount: number;
    discountPercentage?: number;
    reason: string;
}
/**
 * Policy surcharge
 */
export interface PolicySurcharge {
    surchargeCode: string;
    surchargeName: string;
    surchargeAmount: number;
    surchargePercentage?: number;
    reason: string;
}
/**
 * Address
 */
export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
}
/**
 * Policy modification data
 */
export interface PolicyModificationData {
    policyId: string;
    effectiveDate: Date;
    reason: VersionReason;
    changes: PolicyChange[];
    requestedBy: string;
    notes?: string;
}
/**
 * Policy change
 */
export interface PolicyChange {
    field: string;
    oldValue: any;
    newValue: any;
    premiumImpact?: number;
}
/**
 * Policy holder data
 */
export interface PolicyHolderData {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    ssn?: string;
    email: string;
    phone: string;
    mailingAddress: Address;
    driversLicenseNumber?: string;
    driversLicenseState?: string;
    occupation?: string;
    maritalStatus?: string;
}
/**
 * Named insured data
 */
export interface NamedInsuredData {
    policyId: string;
    insuredType: InsuredType;
    isPrimary: boolean;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    address?: Address;
    relationship?: string;
    effectiveDate: Date;
    expirationDate?: Date;
}
/**
 * Bundle configuration
 */
export interface BundleConfiguration {
    bundleName: string;
    policyHolderId: string;
    policies: BundlePolicy[];
    bundleDiscount?: number;
    bundleDiscountPercentage?: number;
    effectiveDate: Date;
    expirationDate: Date;
}
/**
 * Bundle policy
 */
export interface BundlePolicy {
    policyType: PolicyType;
    policyData: PolicyCreationData;
    bundleSequence: number;
}
/**
 * Renewal configuration
 */
export interface RenewalConfiguration {
    policyId: string;
    newEffectiveDate: Date;
    newExpirationDate: Date;
    premiumAmount?: number;
    autoRenew: boolean;
    renewalOfferDate?: Date;
    renewalChanges?: PolicyChange[];
}
/**
 * Transfer data
 */
export interface TransferData {
    policyId: string;
    newPolicyHolderId: string;
    transferDate: Date;
    transferReason: string;
    transferredBy: string;
    transferNotes?: string;
}
/**
 * Reinstatement data
 */
export interface ReinstatementData {
    policyId: string;
    reinstatementDate: Date;
    reinstatementReason: string;
    reinstatementFee?: number;
    backPremiumDue?: number;
    requestedBy: string;
    approvedBy?: string;
    notes?: string;
}
/**
 * Policy model attributes
 */
export interface PolicyAttributes {
    id: string;
    policyNumber: string;
    policyType: PolicyType;
    status: PolicyStatus;
    policyHolderId: string;
    effectiveDate: Date;
    expirationDate: Date;
    bindDate?: Date;
    issueDate?: Date;
    cancellationDate?: Date;
    cancellationReason?: CancellationReason;
    premiumAmount: number;
    paymentFrequency: PaymentFrequency;
    agentId?: string;
    agencyId?: string;
    underwriterId?: string;
    state: string;
    version: number;
    parentPolicyId?: string;
    bundleId?: string;
    autoRenew: boolean;
    coverages: any;
    deductibles?: any;
    limits?: any;
    discounts?: any;
    surcharges?: any;
    billingAddress?: any;
    mailingAddress?: any;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Creates Policy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Policy model
 */
export declare const createPolicyModel: (sequelize: Sequelize) => any;
/**
 * Policy audit log model attributes
 */
export interface PolicyAuditLogAttributes {
    id: string;
    policyId: string;
    action: string;
    versionReason: VersionReason;
    previousStatus?: PolicyStatus;
    newStatus?: PolicyStatus;
    changes: any;
    performedBy: string;
    performedAt: Date;
    notes?: string;
    createdAt: Date;
}
/**
 * Creates PolicyAuditLog model for Sequelize.
 */
export declare const createPolicyAuditLogModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new insurance policy quote.
 *
 * @param {PolicyCreationData} data - Policy creation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created policy quote
 *
 * @example
 * ```typescript
 * const quote = await createPolicyQuote({
 *   policyType: PolicyType.AUTO,
 *   policyHolderId: 'holder-123',
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2026-01-01'),
 *   premiumAmount: 1200.00,
 *   paymentFrequency: PaymentFrequency.MONTHLY,
 *   state: 'CA',
 *   coverages: [...]
 * });
 * ```
 */
export declare const createPolicyQuote: (data: PolicyCreationData, transaction?: Transaction) => Promise<any>;
/**
 * 2. Binds a policy quote (quote → bound transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} boundBy - User ID who bound the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Bound policy
 */
export declare const bindPolicy: (policyId: string, boundBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 3. Issues a bound policy (bound → issued transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} issuedBy - User ID who issued the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Issued policy
 */
export declare const issuePolicy: (policyId: string, issuedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 4. Activates an issued policy (issued → active transition).
 *
 * @param {string} policyId - Policy ID
 * @param {string} activatedBy - User ID who activated the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Active policy
 */
export declare const activatePolicy: (policyId: string, activatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 5. Modifies an existing policy (creates new version).
 *
 * @param {PolicyModificationData} data - Modification data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Modified policy version
 */
export declare const modifyPolicy: (data: PolicyModificationData, transaction?: Transaction) => Promise<any>;
/**
 * 6. Retrieves policy version history.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Policy version history
 */
export declare const getPolicyVersionHistory: (policyId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 7. Compares two policy versions.
 *
 * @param {string} policyId1 - First policy version ID
 * @param {string} policyId2 - Second policy version ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PolicyChange[]>} Differences between versions
 */
export declare const comparePolicyVersions: (policyId1: string, policyId2: string, transaction?: Transaction) => Promise<PolicyChange[]>;
/**
 * 8. Rolls back to a previous policy version.
 *
 * @param {string} policyId - Current policy ID
 * @param {number} targetVersion - Target version number
 * @param {string} rolledBackBy - User performing rollback
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Rolled back policy
 */
export declare const rollbackPolicyVersion: (policyId: string, targetVersion: number, rolledBackBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 9. Cancels a policy.
 *
 * @param {string} policyId - Policy ID
 * @param {CancellationReason} reason - Cancellation reason
 * @param {Date} cancellationDate - Effective cancellation date
 * @param {string} cancelledBy - User cancelling the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled policy
 */
export declare const cancelPolicy: (policyId: string, reason: CancellationReason, cancellationDate: Date, cancelledBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 10. Reinstates a cancelled or lapsed policy.
 *
 * @param {ReinstatementData} data - Reinstatement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reinstated policy
 */
export declare const reinstatePolicy: (data: ReinstatementData, transaction?: Transaction) => Promise<any>;
/**
 * 11. Suspends a policy temporarily.
 *
 * @param {string} policyId - Policy ID
 * @param {string} reason - Suspension reason
 * @param {string} suspendedBy - User suspending the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Suspended policy
 */
export declare const suspendPolicy: (policyId: string, reason: string, suspendedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 12. Terminates a policy.
 *
 * @param {string} policyId - Policy ID
 * @param {string} reason - Termination reason
 * @param {Date} terminationDate - Effective termination date
 * @param {string} terminatedBy - User terminating the policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Terminated policy
 */
export declare const terminatePolicy: (policyId: string, reason: string, terminationDate: Date, terminatedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 13. Creates a renewal offer for expiring policy.
 *
 * @param {RenewalConfiguration} config - Renewal configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Renewal policy offer
 */
export declare const createRenewalOffer: (config: RenewalConfiguration, transaction?: Transaction) => Promise<any>;
/**
 * 14. Accepts a renewal offer.
 *
 * @param {string} renewalPolicyId - Renewal policy ID
 * @param {string} acceptedBy - User accepting renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Renewed policy
 */
export declare const acceptRenewal: (renewalPolicyId: string, acceptedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 15. Declines a renewal offer.
 *
 * @param {string} renewalPolicyId - Renewal policy ID
 * @param {string} reason - Decline reason
 * @param {string} declinedBy - User declining renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Result
 */
export declare const declineRenewal: (renewalPolicyId: string, reason: string, declinedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 16. Processes automatic renewals.
 *
 * @param {Date} asOfDate - Process renewals as of this date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Processed renewals
 */
export declare const processAutoRenewals: (asOfDate: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * 17. Creates a multi-product policy bundle.
 *
 * @param {BundleConfiguration} config - Bundle configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created bundle with policies
 */
export declare const createPolicyBundle: (config: BundleConfiguration, transaction?: Transaction) => Promise<any>;
/**
 * 18. Adds a policy to an existing bundle.
 *
 * @param {string} bundleId - Bundle ID
 * @param {PolicyCreationData} policyData - New policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bundle
 */
export declare const addPolicyToBundle: (bundleId: string, policyData: PolicyCreationData, transaction?: Transaction) => Promise<any>;
/**
 * 19. Removes a policy from a bundle.
 *
 * @param {string} policyId - Policy ID to remove
 * @param {string} removedBy - User removing policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bundle
 */
export declare const removePolicyFromBundle: (policyId: string, removedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 20. Retrieves all policies in a bundle.
 *
 * @param {string} bundleId - Bundle ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Bundle policies
 */
export declare const getBundlePolicies: (bundleId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 21. Creates a new policy holder.
 *
 * @param {PolicyHolderData} data - Policy holder data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created policy holder
 */
export declare const createPolicyHolder: (data: PolicyHolderData, transaction?: Transaction) => Promise<any>;
/**
 * 22. Updates policy holder information.
 *
 * @param {string} policyHolderId - Policy holder ID
 * @param {Partial<PolicyHolderData>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated policy holder
 */
export declare const updatePolicyHolder: (policyHolderId: string, updates: Partial<PolicyHolderData>, transaction?: Transaction) => Promise<any>;
/**
 * 23. Adds named insured to policy.
 *
 * @param {NamedInsuredData} data - Named insured data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created named insured record
 */
export declare const addNamedInsured: (data: NamedInsuredData, transaction?: Transaction) => Promise<any>;
/**
 * 24. Removes named insured from policy.
 *
 * @param {string} namedInsuredId - Named insured ID
 * @param {string} removedBy - User removing insured
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Result
 */
export declare const removeNamedInsured: (namedInsuredId: string, removedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * 25. Adds additional insured to policy.
 *
 * @param {NamedInsuredData} data - Additional insured data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created additional insured record
 */
export declare const addAdditionalInsured: (data: NamedInsuredData, transaction?: Transaction) => Promise<any>;
/**
 * 26. Calculates coverage period in days.
 *
 * @param {Date} effectiveDate - Policy effective date
 * @param {Date} expirationDate - Policy expiration date
 * @returns {number} Coverage period in days
 */
export declare const calculateCoveragePeriod: (effectiveDate: Date, expirationDate: Date) => number;
/**
 * 27. Calculates pro-rated premium for midterm change.
 *
 * @param {number} annualPremium - Annual premium amount
 * @param {Date} changeDate - Date of change
 * @param {Date} expirationDate - Policy expiration date
 * @returns {number} Pro-rated premium
 */
export declare const calculateProRatedPremium: (annualPremium: number, changeDate: Date, expirationDate: Date) => number;
/**
 * 28. Applies discounts to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {PolicyDiscount[]} discounts - Applicable discounts
 * @returns {number} Premium after discounts
 */
export declare const applyDiscounts: (basePremium: number, discounts: PolicyDiscount[]) => number;
/**
 * 29. Applies surcharges to premium.
 *
 * @param {number} basePremium - Base premium amount
 * @param {PolicySurcharge[]} surcharges - Applicable surcharges
 * @returns {number} Premium after surcharges
 */
export declare const applySurcharges: (basePremium: number, surcharges: PolicySurcharge[]) => number;
/**
 * 30. Calculates total policy premium.
 *
 * @param {number} basePremium - Base premium
 * @param {PolicyDiscount[]} [discounts] - Discounts
 * @param {PolicySurcharge[]} [surcharges] - Surcharges
 * @returns {number} Total premium
 */
export declare const calculateTotalPremium: (basePremium: number, discounts?: PolicyDiscount[], surcharges?: PolicySurcharge[]) => number;
/**
 * 31. Searches policies by criteria.
 *
 * @param {PolicySearchCriteria} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching policies
 */
export declare const searchPolicies: (criteria: PolicySearchCriteria, transaction?: Transaction) => Promise<any[]>;
/**
 * 32. Retrieves policies expiring within date range.
 *
 * @param {Date} startDate - Start of range
 * @param {Date} endDate - End of range
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Expiring policies
 */
export declare const getExpiringPolicies: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * 33. Retrieves policy by policy number.
 *
 * @param {string} policyNumber - Policy number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Policy
 */
export declare const getPolicyByNumber: (policyNumber: string, transaction?: Transaction) => Promise<any>;
/**
 * 34. Retrieves all policies for a policy holder.
 *
 * @param {string} policyHolderId - Policy holder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Policies
 */
export declare const getPoliciesByHolder: (policyHolderId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * 35. Generates policy declaration document.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated PDF document
 */
export declare const generateDeclarationPage: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
/**
 * 36. Generates insurance ID card.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated ID card PDF
 */
export declare const generateInsuranceCard: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
/**
 * 37. Generates policy certificate.
 *
 * @param {string} policyId - Policy ID
 * @param {string} certificateHolderName - Certificate holder name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated certificate PDF
 */
export declare const generateCertificate: (policyId: string, certificateHolderName: string, transaction?: Transaction) => Promise<Buffer>;
/**
 * 38. Generates cancellation notice.
 *
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Buffer>} Generated cancellation notice PDF
 */
export declare const generateCancellationNotice: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
/**
 * 39. Transfers policy ownership.
 *
 * @param {TransferData} data - Transfer data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transferred policy
 */
export declare const transferPolicyOwnership: (data: TransferData, transaction?: Transaction) => Promise<any>;
/**
 * 40. Validates policy transfer eligibility.
 *
 * @param {string} policyId - Policy ID
 * @param {string} newPolicyHolderId - New policy holder ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 */
export declare const validateTransferEligibility: (policyId: string, newPolicyHolderId: string, transaction?: Transaction) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
declare const _default: {
    createPolicyQuote: (data: PolicyCreationData, transaction?: Transaction) => Promise<any>;
    bindPolicy: (policyId: string, boundBy: string, transaction?: Transaction) => Promise<any>;
    issuePolicy: (policyId: string, issuedBy: string, transaction?: Transaction) => Promise<any>;
    activatePolicy: (policyId: string, activatedBy: string, transaction?: Transaction) => Promise<any>;
    modifyPolicy: (data: PolicyModificationData, transaction?: Transaction) => Promise<any>;
    getPolicyVersionHistory: (policyId: string, transaction?: Transaction) => Promise<any[]>;
    comparePolicyVersions: (policyId1: string, policyId2: string, transaction?: Transaction) => Promise<PolicyChange[]>;
    rollbackPolicyVersion: (policyId: string, targetVersion: number, rolledBackBy: string, transaction?: Transaction) => Promise<any>;
    cancelPolicy: (policyId: string, reason: CancellationReason, cancellationDate: Date, cancelledBy: string, transaction?: Transaction) => Promise<any>;
    reinstatePolicy: (data: ReinstatementData, transaction?: Transaction) => Promise<any>;
    suspendPolicy: (policyId: string, reason: string, suspendedBy: string, transaction?: Transaction) => Promise<any>;
    terminatePolicy: (policyId: string, reason: string, terminationDate: Date, terminatedBy: string, transaction?: Transaction) => Promise<any>;
    createRenewalOffer: (config: RenewalConfiguration, transaction?: Transaction) => Promise<any>;
    acceptRenewal: (renewalPolicyId: string, acceptedBy: string, transaction?: Transaction) => Promise<any>;
    declineRenewal: (renewalPolicyId: string, reason: string, declinedBy: string, transaction?: Transaction) => Promise<any>;
    processAutoRenewals: (asOfDate: Date, transaction?: Transaction) => Promise<any[]>;
    createPolicyBundle: (config: BundleConfiguration, transaction?: Transaction) => Promise<any>;
    addPolicyToBundle: (bundleId: string, policyData: PolicyCreationData, transaction?: Transaction) => Promise<any>;
    removePolicyFromBundle: (policyId: string, removedBy: string, transaction?: Transaction) => Promise<any>;
    getBundlePolicies: (bundleId: string, transaction?: Transaction) => Promise<any[]>;
    createPolicyHolder: (data: PolicyHolderData, transaction?: Transaction) => Promise<any>;
    updatePolicyHolder: (policyHolderId: string, updates: Partial<PolicyHolderData>, transaction?: Transaction) => Promise<any>;
    addNamedInsured: (data: NamedInsuredData, transaction?: Transaction) => Promise<any>;
    removeNamedInsured: (namedInsuredId: string, removedBy: string, transaction?: Transaction) => Promise<any>;
    addAdditionalInsured: (data: NamedInsuredData, transaction?: Transaction) => Promise<any>;
    calculateCoveragePeriod: (effectiveDate: Date, expirationDate: Date) => number;
    calculateProRatedPremium: (annualPremium: number, changeDate: Date, expirationDate: Date) => number;
    applyDiscounts: (basePremium: number, discounts: PolicyDiscount[]) => number;
    applySurcharges: (basePremium: number, surcharges: PolicySurcharge[]) => number;
    calculateTotalPremium: (basePremium: number, discounts?: PolicyDiscount[], surcharges?: PolicySurcharge[]) => number;
    searchPolicies: (criteria: PolicySearchCriteria, transaction?: Transaction) => Promise<any[]>;
    getExpiringPolicies: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any[]>;
    getPolicyByNumber: (policyNumber: string, transaction?: Transaction) => Promise<any>;
    getPoliciesByHolder: (policyHolderId: string, transaction?: Transaction) => Promise<any[]>;
    generateDeclarationPage: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
    generateInsuranceCard: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
    generateCertificate: (policyId: string, certificateHolderName: string, transaction?: Transaction) => Promise<Buffer>;
    generateCancellationNotice: (policyId: string, transaction?: Transaction) => Promise<Buffer>;
    transferPolicyOwnership: (data: TransferData, transaction?: Transaction) => Promise<any>;
    validateTransferEligibility: (policyId: string, newPolicyHolderId: string, transaction?: Transaction) => Promise<{
        eligible: boolean;
        reasons: string[];
    }>;
    createPolicyModel: (sequelize: Sequelize) => any;
    createPolicyAuditLogModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=policy-management-kit.d.ts.map