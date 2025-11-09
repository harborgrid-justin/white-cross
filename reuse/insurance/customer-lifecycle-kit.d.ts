/**
 * LOC: INS-CLC-001
 * File: /reuse/insurance/customer-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - bcrypt
 *   - validator
 *   - node-schedule
 *
 * DOWNSTREAM (imported by):
 *   - Customer onboarding controllers
 *   - Customer retention services
 *   - CRM integration modules
 *   - Marketing campaign services
 */
/**
 * File: /reuse/insurance/customer-lifecycle-kit.ts
 * Locator: WC-UTL-INSCL-001
 * Purpose: Customer Lifecycle Management Kit - Comprehensive customer journey utilities for insurance operations
 *
 * Upstream: @nestjs/common, sequelize, bcrypt, validator, node-schedule
 * Downstream: Customer controllers, retention services, CRM modules, marketing automation, analytics dashboards
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, bcrypt 5.x, validator 13.x
 * Exports: 42 utility functions for customer onboarding, KYC/AML verification, profile management, household grouping,
 *          preference management, segmentation, retention campaigns, lapse prevention, win-back programs,
 *          lifetime value calculation, cross-sell/upsell, satisfaction tracking, communication preferences,
 *          portal access, data privacy and consent management
 *
 * LLM Context: Production-grade customer lifecycle management utilities for White Cross insurance platform.
 * Provides comprehensive customer journey management from onboarding through retention, including regulatory
 * compliance (KYC/AML), relationship management, predictive analytics for churn prevention, revenue optimization
 * through cross-sell/upsell, and privacy compliance (GDPR, CCPA). Essential for customer acquisition,
 * retention, satisfaction measurement (NPS, CSAT), and lifetime value maximization.
 */
import { Sequelize } from 'sequelize';
/**
 * Customer lifecycle stage
 */
export type LifecycleStage = 'prospect' | 'lead' | 'onboarding' | 'active' | 'at_risk' | 'lapsed' | 'churned' | 'win_back';
/**
 * KYC verification status
 */
export type KYCStatus = 'pending' | 'in_progress' | 'verified' | 'failed' | 'expired' | 'requires_update';
/**
 * AML risk level
 */
export type AMLRiskLevel = 'low' | 'medium' | 'high' | 'prohibited';
/**
 * Customer segment types
 */
export type CustomerSegment = 'high_value' | 'medium_value' | 'low_value' | 'new_customer' | 'loyal' | 'at_risk' | 'price_sensitive' | 'coverage_focused';
/**
 * Communication channel preferences
 */
export type CommunicationChannel = 'email' | 'sms' | 'phone' | 'mail' | 'portal' | 'mobile_app';
/**
 * Consent type
 */
export type ConsentType = 'marketing' | 'data_processing' | 'third_party_sharing' | 'credit_check' | 'automated_decision' | 'profiling';
/**
 * Customer relationship type
 */
export type RelationshipType = 'primary' | 'spouse' | 'dependent' | 'parent' | 'child' | 'sibling' | 'other';
/**
 * Customer onboarding configuration
 */
export interface CustomerOnboardingConfig {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: AddressInfo;
    kycRequired?: boolean;
    amlCheckRequired?: boolean;
    creditCheckRequired?: boolean;
    marketingConsent?: boolean;
    source?: string;
    referralCode?: string;
}
/**
 * Address information
 */
export interface AddressInfo {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType?: 'residential' | 'mailing' | 'business';
}
/**
 * KYC verification request
 */
export interface KYCVerificationRequest {
    customerId: string;
    documentType: string;
    documentNumber: string;
    documentImage?: string;
    issuingCountry: string;
    expirationDate?: Date;
    verificationMethod: 'manual' | 'automated' | 'third_party';
    verifierId?: string;
}
/**
 * AML screening request
 */
export interface AMLScreeningRequest {
    customerId: string;
    fullName: string;
    dateOfBirth: Date;
    nationality: string;
    screeningLists: string[];
    additionalInfo?: Record<string, any>;
}
/**
 * Customer profile update
 */
export interface CustomerProfileUpdate {
    email?: string;
    phone?: string;
    address?: AddressInfo;
    occupation?: string;
    income?: number;
    maritalStatus?: string;
    numberOfDependents?: number;
    metadata?: Record<string, any>;
}
/**
 * Household grouping configuration
 */
export interface HouseholdGrouping {
    householdName: string;
    primaryCustomerId: string;
    memberIds: string[];
    sharedAddress?: AddressInfo;
    combinedPolicies?: boolean;
    billingConsolidated?: boolean;
}
/**
 * Customer preference configuration
 */
export interface CustomerPreferences {
    communicationChannels: CommunicationChannel[];
    contactTimePreference?: string;
    languagePreference?: string;
    paperlessOptIn?: boolean;
    autoRenewalPreference?: boolean;
    notificationPreferences?: Record<string, boolean>;
}
/**
 * Segmentation criteria
 */
export interface SegmentationCriteria {
    minLifetimeValue?: number;
    maxLifetimeValue?: number;
    policyCount?: number;
    customerAge?: number;
    tenureMonths?: number;
    riskScore?: number;
    engagementScore?: number;
    customCriteria?: Record<string, any>;
}
/**
 * Retention campaign configuration
 */
export interface RetentionCampaignConfig {
    name: string;
    targetSegment: CustomerSegment[];
    campaignType: 'discount' | 'loyalty_reward' | 'coverage_upgrade' | 'engagement' | 'education';
    startDate: Date;
    endDate: Date;
    offerDetails: Record<string, any>;
    communicationChannels: CommunicationChannel[];
    budget?: number;
    targetCount?: number;
}
/**
 * Lapse prediction result
 */
export interface LapsePrediction {
    customerId: string;
    lapseRisk: number;
    riskFactors: string[];
    recommendedActions: string[];
    predictedLapseDate?: Date;
    confidence: number;
}
/**
 * Win-back campaign target
 */
export interface WinBackTarget {
    customerId: string;
    lapseDate: Date;
    lapseReason?: string;
    previousPolicies: string[];
    lifetimeValue: number;
    winBackScore: number;
    recommendedOffer?: Record<string, any>;
}
/**
 * Customer lifetime value calculation
 */
export interface CLVCalculation {
    customerId: string;
    totalRevenue: number;
    averageAnnualPremium: number;
    expectedTenureYears: number;
    retentionRate: number;
    acquisitionCost: number;
    netLifetimeValue: number;
    calculatedAt: Date;
}
/**
 * Cross-sell opportunity
 */
export interface CrossSellOpportunity {
    customerId: string;
    currentProducts: string[];
    recommendedProducts: string[];
    propensityScore: number;
    reasoning: string[];
    estimatedAdditionalRevenue: number;
    priority: 'high' | 'medium' | 'low';
}
/**
 * NPS survey result
 */
export interface NPSSurveyResult {
    customerId: string;
    score: number;
    category: 'promoter' | 'passive' | 'detractor';
    feedback?: string;
    surveyDate: Date;
    touchpoint?: string;
}
/**
 * CSAT survey result
 */
export interface CSATSurveyResult {
    customerId: string;
    interactionType: string;
    score: number;
    maxScore: number;
    feedback?: string;
    surveyDate: Date;
    agentId?: string;
}
/**
 * Communication log entry
 */
export interface CommunicationLog {
    customerId: string;
    channel: CommunicationChannel;
    direction: 'inbound' | 'outbound';
    subject?: string;
    content?: string;
    timestamp: Date;
    userId?: string;
    campaignId?: string;
    metadata?: Record<string, any>;
}
/**
 * Consent record
 */
export interface ConsentRecord {
    customerId: string;
    consentType: ConsentType;
    granted: boolean;
    grantedAt?: Date;
    revokedAt?: Date;
    expiresAt?: Date;
    version: string;
    ipAddress?: string;
    source?: string;
}
/**
 * Data access request
 */
export interface DataAccessRequest {
    customerId: string;
    requestType: 'access' | 'portability' | 'deletion' | 'rectification' | 'restriction';
    requestDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    completionDate?: Date;
    requestorVerified: boolean;
    metadata?: Record<string, any>;
}
/**
 * Pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
/**
 * Sort parameters
 */
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Filter parameters
 */
export interface FilterParams {
    searchTerm?: string;
    stage?: LifecycleStage;
    segment?: CustomerSegment;
    kycStatus?: KYCStatus;
    createdAfter?: Date;
    createdBefore?: Date;
}
/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    _links?: {
        self: string;
        first: string;
        last: string;
        next?: string;
        previous?: string;
    };
}
/**
 * Customer model attributes
 */
export interface CustomerAttributes {
    id: string;
    customerNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: Record<string, any>;
    lifecycleStage: LifecycleStage;
    kycStatus: KYCStatus;
    amlRiskLevel: AMLRiskLevel;
    segment: CustomerSegment;
    lifetimeValue: number;
    acquisitionDate: Date;
    acquisitionSource?: string;
    referralCode?: string;
    householdId?: string;
    preferences: Record<string, any>;
    metadata?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Household model attributes
 */
export interface HouseholdAttributes {
    id: string;
    householdName: string;
    primaryCustomerId: string;
    sharedAddress?: Record<string, any>;
    combinedPolicies: boolean;
    billingConsolidated: boolean;
    totalLifetimeValue: number;
    memberCount: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Customer model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} Customer model
 *
 * @example
 * ```typescript
 * const CustomerModel = createCustomerModel(sequelize);
 * const customer = await CustomerModel.create({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   dateOfBirth: new Date('1985-05-15'),
 *   lifecycleStage: 'active'
 * });
 * ```
 */
export declare const createCustomerModel: (sequelize: Sequelize) => any;
/**
 * Creates Household model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} Household model
 *
 * @example
 * ```typescript
 * const HouseholdModel = createHouseholdModel(sequelize);
 * const household = await HouseholdModel.create({
 *   householdName: 'Doe Family',
 *   primaryCustomerId: 'customer-uuid',
 *   combinedPolicies: true
 * });
 * ```
 */
export declare const createHouseholdModel: (sequelize: Sequelize) => any;
/**
 * 1. Registers a new customer with validation.
 *
 * @param {CustomerOnboardingConfig} config - Customer registration data
 * @returns {Promise<Partial<CustomerAttributes>>} Created customer record
 *
 * @example
 * ```typescript
 * const customer = await registerNewCustomer({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   phone: '+1-555-0100',
 *   dateOfBirth: new Date('1985-05-15'),
 *   address: {
 *     street: '123 Main St',
 *     city: 'Boston',
 *     state: 'MA',
 *     postalCode: '02101',
 *     country: 'USA'
 *   },
 *   kycRequired: true,
 *   marketingConsent: true
 * });
 * ```
 */
export declare const registerNewCustomer: (config: CustomerOnboardingConfig) => Promise<Partial<CustomerAttributes>>;
/**
 * 2. Validates customer registration data.
 *
 * @param {CustomerOnboardingConfig} config - Customer data to validate
 * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCustomerRegistration(customerData);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateCustomerRegistration: (config: CustomerOnboardingConfig) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 3. Initiates customer onboarding workflow.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<{workflowId: string; steps: string[]; currentStep: string}>} Onboarding workflow
 *
 * @example
 * ```typescript
 * const workflow = await initiateOnboardingWorkflow('customer-uuid');
 * console.log('Next step:', workflow.currentStep);
 * ```
 */
export declare const initiateOnboardingWorkflow: (customerId: string) => Promise<{
    workflowId: string;
    steps: string[];
    currentStep: string;
}>;
/**
 * 4. Completes onboarding step.
 *
 * @param {string} workflowId - Onboarding workflow ID
 * @param {string} step - Step to complete
 * @param {Record<string, any>} [data] - Step completion data
 * @returns {Promise<{completed: boolean; nextStep?: string}>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeOnboardingStep('ONB-123', 'email_verification', {
 *   verificationCode: 'ABC123',
 *   verifiedAt: new Date()
 * });
 * ```
 */
export declare const completeOnboardingStep: (workflowId: string, step: string, data?: Record<string, any>) => Promise<{
    completed: boolean;
    nextStep?: string;
}>;
/**
 * 5. Sends welcome communication to new customer.
 *
 * @param {string} customerId - Customer ID
 * @param {CommunicationChannel[]} channels - Communication channels
 * @returns {Promise<{sent: number; failed: number}>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendWelcomeCommunication('customer-uuid', ['email', 'sms']);
 * console.log(`Sent: ${result.sent}, Failed: ${result.failed}`);
 * ```
 */
export declare const sendWelcomeCommunication: (customerId: string, channels: CommunicationChannel[]) => Promise<{
    sent: number;
    failed: number;
}>;
/**
 * 6. Tracks onboarding progress.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<{progress: number; completedSteps: string[]; pendingSteps: string[]}>} Progress report
 *
 * @example
 * ```typescript
 * const progress = await trackOnboardingProgress('customer-uuid');
 * console.log(`${progress.progress}% complete`);
 * ```
 */
export declare const trackOnboardingProgress: (customerId: string) => Promise<{
    progress: number;
    completedSteps: string[];
    pendingSteps: string[];
}>;
/**
 * 7. Initiates KYC verification process.
 *
 * @param {KYCVerificationRequest} request - KYC verification request
 * @returns {Promise<{verificationId: string; status: KYCStatus; estimatedCompletion?: Date}>} Verification status
 *
 * @example
 * ```typescript
 * const verification = await initiateKYCVerification({
 *   customerId: 'customer-uuid',
 *   documentType: 'passport',
 *   documentNumber: 'AB1234567',
 *   issuingCountry: 'USA',
 *   verificationMethod: 'automated'
 * });
 * ```
 */
export declare const initiateKYCVerification: (request: KYCVerificationRequest) => Promise<{
    verificationId: string;
    status: KYCStatus;
    estimatedCompletion?: Date;
}>;
/**
 * 8. Verifies customer identity documents.
 *
 * @param {string} verificationId - Verification ID
 * @param {Record<string, any>} verificationData - Verification result data
 * @returns {Promise<{verified: boolean; confidence: number; issues?: string[]}>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyIdentityDocument('KYC-123', {
 *   documentAuthentic: true,
 *   faceMatch: 0.98,
 *   dataExtracted: { name: 'John Doe', dob: '1985-05-15' }
 * });
 * ```
 */
export declare const verifyIdentityDocument: (verificationId: string, verificationData: Record<string, any>) => Promise<{
    verified: boolean;
    confidence: number;
    issues?: string[];
}>;
/**
 * 9. Performs AML screening.
 *
 * @param {AMLScreeningRequest} request - AML screening request
 * @returns {Promise<{screeningId: string; riskLevel: AMLRiskLevel; matches: number; details?: Record<string, any>}>} Screening result
 *
 * @example
 * ```typescript
 * const screening = await performAMLScreening({
 *   customerId: 'customer-uuid',
 *   fullName: 'John Doe',
 *   dateOfBirth: new Date('1985-05-15'),
 *   nationality: 'USA',
 *   screeningLists: ['OFAC', 'UN', 'EU']
 * });
 * ```
 */
export declare const performAMLScreening: (request: AMLScreeningRequest) => Promise<{
    screeningId: string;
    riskLevel: AMLRiskLevel;
    matches: number;
    details?: Record<string, any>;
}>;
/**
 * 10. Updates KYC status.
 *
 * @param {string} customerId - Customer ID
 * @param {KYCStatus} status - New KYC status
 * @param {string} [reason] - Status change reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateKYCStatus('customer-uuid', 'verified', 'All documents verified successfully');
 * ```
 */
export declare const updateKYCStatus: (customerId: string, status: KYCStatus, reason?: string) => Promise<void>;
/**
 * 11. Checks if KYC re-verification is required.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<{required: boolean; reason?: string; dueDate?: Date}>} Re-verification status
 *
 * @example
 * ```typescript
 * const check = await checkKYCReverification('customer-uuid');
 * if (check.required) {
 *   console.log('Re-verification due:', check.dueDate);
 * }
 * ```
 */
export declare const checkKYCReverification: (customerId: string) => Promise<{
    required: boolean;
    reason?: string;
    dueDate?: Date;
}>;
/**
 * 12. Generates KYC compliance report.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @returns {Promise<{totalCustomers: number; verified: number; pending: number; failed: number; complianceRate: number}>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateKYCComplianceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log(`Compliance rate: ${report.complianceRate}%`);
 * ```
 */
export declare const generateKYCComplianceReport: (startDate: Date, endDate: Date) => Promise<{
    totalCustomers: number;
    verified: number;
    pending: number;
    failed: number;
    complianceRate: number;
}>;
/**
 * 13. Updates customer profile information.
 *
 * @param {string} customerId - Customer ID
 * @param {CustomerProfileUpdate} updates - Profile updates
 * @returns {Promise<Partial<CustomerAttributes>>} Updated customer profile
 *
 * @example
 * ```typescript
 * const updated = await updateCustomerProfile('customer-uuid', {
 *   email: 'newemail@example.com',
 *   phone: '+1-555-0200',
 *   address: { street: '456 Oak Ave', city: 'Cambridge', state: 'MA', postalCode: '02139', country: 'USA' }
 * });
 * ```
 */
export declare const updateCustomerProfile: (customerId: string, updates: CustomerProfileUpdate) => Promise<Partial<CustomerAttributes>>;
/**
 * 14. Retrieves customer profile with related data.
 *
 * @param {string} customerId - Customer ID
 * @param {string[]} [include] - Related data to include
 * @returns {Promise<Record<string, any>>} Customer profile with relations
 *
 * @example
 * ```typescript
 * const profile = await getCustomerProfile('customer-uuid', ['policies', 'claims', 'household']);
 * console.log('Household members:', profile.household?.memberCount);
 * ```
 */
export declare const getCustomerProfile: (customerId: string, include?: string[]) => Promise<Record<string, any>>;
/**
 * 15. Merges duplicate customer records.
 *
 * @param {string} primaryCustomerId - Primary customer to keep
 * @param {string[]} duplicateCustomerIds - Duplicate customers to merge
 * @returns {Promise<{merged: number; primaryId: string}>} Merge result
 *
 * @example
 * ```typescript
 * const result = await mergeDuplicateCustomers('customer-primary', ['customer-dup1', 'customer-dup2']);
 * console.log(`Merged ${result.merged} duplicate records`);
 * ```
 */
export declare const mergeDuplicateCustomers: (primaryCustomerId: string, duplicateCustomerIds: string[]) => Promise<{
    merged: number;
    primaryId: string;
}>;
/**
 * 16. Searches customers with pagination and filters.
 *
 * @param {FilterParams} filters - Search filters
 * @param {PaginationParams} pagination - Pagination parameters
 * @param {SortParams} [sort] - Sort parameters
 * @returns {Promise<PaginatedResponse<Partial<CustomerAttributes>>>} Paginated customers
 *
 * @example
 * ```typescript
 * const results = await searchCustomers(
 *   { stage: 'active', segment: 'high_value' },
 *   { page: 1, limit: 20 },
 *   { sortBy: 'lifetimeValue', sortOrder: 'DESC' }
 * );
 * ```
 */
export declare const searchCustomers: (filters: FilterParams, pagination: PaginationParams, sort?: SortParams) => Promise<PaginatedResponse<Partial<CustomerAttributes>>>;
/**
 * 17. Archives inactive customer records.
 *
 * @param {Date} inactiveSince - Archive customers inactive since this date
 * @returns {Promise<{archived: number; retentionPeriod: number}>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveInactiveCustomers(new Date('2020-01-01'));
 * console.log(`Archived ${result.archived} inactive customers`);
 * ```
 */
export declare const archiveInactiveCustomers: (inactiveSince: Date) => Promise<{
    archived: number;
    retentionPeriod: number;
}>;
/**
 * 18. Creates a household group.
 *
 * @param {HouseholdGrouping} config - Household configuration
 * @returns {Promise<Partial<HouseholdAttributes>>} Created household
 *
 * @example
 * ```typescript
 * const household = await createHousehold({
 *   householdName: 'Doe Family',
 *   primaryCustomerId: 'customer-uuid',
 *   memberIds: ['customer-uuid', 'spouse-uuid', 'child-uuid'],
 *   combinedPolicies: true,
 *   billingConsolidated: true
 * });
 * ```
 */
export declare const createHousehold: (config: HouseholdGrouping) => Promise<Partial<HouseholdAttributes>>;
/**
 * 19. Adds member to household.
 *
 * @param {string} householdId - Household ID
 * @param {string} customerId - Customer ID to add
 * @param {RelationshipType} relationship - Relationship to primary customer
 * @returns {Promise<{added: boolean; memberCount: number}>} Add result
 *
 * @example
 * ```typescript
 * const result = await addHouseholdMember('household-uuid', 'customer-uuid', 'spouse');
 * console.log('Total members:', result.memberCount);
 * ```
 */
export declare const addHouseholdMember: (householdId: string, customerId: string, relationship: RelationshipType) => Promise<{
    added: boolean;
    memberCount: number;
}>;
/**
 * 20. Removes member from household.
 *
 * @param {string} householdId - Household ID
 * @param {string} customerId - Customer ID to remove
 * @returns {Promise<{removed: boolean; memberCount: number}>} Remove result
 *
 * @example
 * ```typescript
 * const result = await removeHouseholdMember('household-uuid', 'customer-uuid');
 * ```
 */
export declare const removeHouseholdMember: (householdId: string, customerId: string) => Promise<{
    removed: boolean;
    memberCount: number;
}>;
/**
 * 21. Calculates household lifetime value.
 *
 * @param {string} householdId - Household ID
 * @returns {Promise<{totalValue: number; memberContributions: Record<string, number>}>} Household value
 *
 * @example
 * ```typescript
 * const value = await calculateHouseholdLifetimeValue('household-uuid');
 * console.log('Total household value:', value.totalValue);
 * ```
 */
export declare const calculateHouseholdLifetimeValue: (householdId: string) => Promise<{
    totalValue: number;
    memberContributions: Record<string, number>;
}>;
/**
 * 22. Updates customer communication preferences.
 *
 * @param {string} customerId - Customer ID
 * @param {CustomerPreferences} preferences - Preference updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCustomerPreferences('customer-uuid', {
 *   communicationChannels: ['email', 'sms'],
 *   languagePreference: 'en-US',
 *   paperlessOptIn: true,
 *   autoRenewalPreference: true
 * });
 * ```
 */
export declare const updateCustomerPreferences: (customerId: string, preferences: CustomerPreferences) => Promise<void>;
/**
 * 23. Segments customers based on criteria.
 *
 * @param {SegmentationCriteria} criteria - Segmentation criteria
 * @returns {Promise<Array<{customerId: string; segment: CustomerSegment; score: number}>>} Segmentation results
 *
 * @example
 * ```typescript
 * const segments = await segmentCustomers({
 *   minLifetimeValue: 10000,
 *   tenureMonths: 12,
 *   policyCount: 2
 * });
 * ```
 */
export declare const segmentCustomers: (criteria: SegmentationCriteria) => Promise<Array<{
    customerId: string;
    segment: CustomerSegment;
    score: number;
}>>;
/**
 * 24. Updates customer segment.
 *
 * @param {string} customerId - Customer ID
 * @param {CustomerSegment} segment - New segment
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCustomerSegment('customer-uuid', 'high_value');
 * ```
 */
export declare const updateCustomerSegment: (customerId: string, segment: CustomerSegment) => Promise<void>;
/**
 * 25. Retrieves segment distribution.
 *
 * @returns {Promise<Record<CustomerSegment, number>>} Segment counts
 *
 * @example
 * ```typescript
 * const distribution = await getSegmentDistribution();
 * console.log('High value customers:', distribution.high_value);
 * ```
 */
export declare const getSegmentDistribution: () => Promise<Record<CustomerSegment, number>>;
/**
 * 26. Calculates customer engagement score.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<{score: number; factors: Record<string, number>; trend: 'increasing' | 'stable' | 'decreasing'}>} Engagement score
 *
 * @example
 * ```typescript
 * const engagement = await calculateEngagementScore('customer-uuid');
 * console.log('Engagement score:', engagement.score, 'Trend:', engagement.trend);
 * ```
 */
export declare const calculateEngagementScore: (customerId: string) => Promise<{
    score: number;
    factors: Record<string, number>;
    trend: "increasing" | "stable" | "decreasing";
}>;
/**
 * 27. Creates retention campaign.
 *
 * @param {RetentionCampaignConfig} config - Campaign configuration
 * @returns {Promise<{campaignId: string; targetedCustomers: number; estimatedCost: number}>} Campaign details
 *
 * @example
 * ```typescript
 * const campaign = await createRetentionCampaign({
 *   name: 'Q4 Loyalty Rewards',
 *   targetSegment: ['loyal', 'high_value'],
 *   campaignType: 'loyalty_reward',
 *   startDate: new Date('2025-10-01'),
 *   endDate: new Date('2025-12-31'),
 *   offerDetails: { discount: 0.15, description: '15% discount on renewal' },
 *   communicationChannels: ['email', 'sms'],
 *   budget: 50000
 * });
 * ```
 */
export declare const createRetentionCampaign: (config: RetentionCampaignConfig) => Promise<{
    campaignId: string;
    targetedCustomers: number;
    estimatedCost: number;
}>;
/**
 * 28. Predicts customer lapse risk.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<LapsePrediction>} Lapse prediction
 *
 * @example
 * ```typescript
 * const prediction = await predictCustomerLapse('customer-uuid');
 * if (prediction.lapseRisk > 0.7) {
 *   console.log('High lapse risk:', prediction.riskFactors);
 * }
 * ```
 */
export declare const predictCustomerLapse: (customerId: string) => Promise<LapsePrediction>;
/**
 * 29. Identifies at-risk customers.
 *
 * @param {number} riskThreshold - Risk score threshold (0-1)
 * @returns {Promise<Array<{customerId: string; riskScore: number; segment: CustomerSegment}>>} At-risk customers
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskCustomers(0.7);
 * console.log(`${atRisk.length} customers at high lapse risk`);
 * ```
 */
export declare const identifyAtRiskCustomers: (riskThreshold: number) => Promise<Array<{
    customerId: string;
    riskScore: number;
    segment: CustomerSegment;
}>>;
/**
 * 30. Executes lapse prevention workflow.
 *
 * @param {string} customerId - Customer ID
 * @param {string[]} interventions - Prevention interventions to execute
 * @returns {Promise<{executed: number; scheduled: number}>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeLapsePreventionWorkflow('customer-uuid', [
 *   'send_retention_email',
 *   'offer_loyalty_discount',
 *   'schedule_courtesy_call'
 * ]);
 * ```
 */
export declare const executeLapsePreventionWorkflow: (customerId: string, interventions: string[]) => Promise<{
    executed: number;
    scheduled: number;
}>;
/**
 * 31. Tracks retention campaign performance.
 *
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<{reached: number; engaged: number; converted: number; roi: number}>} Campaign performance
 *
 * @example
 * ```typescript
 * const performance = await trackRetentionCampaignPerformance('CAMP-123');
 * console.log('ROI:', performance.roi, 'Conversion rate:', (performance.converted / performance.reached) * 100);
 * ```
 */
export declare const trackRetentionCampaignPerformance: (campaignId: string) => Promise<{
    reached: number;
    engaged: number;
    converted: number;
    roi: number;
}>;
/**
 * 32. Identifies win-back campaign targets.
 *
 * @param {number} monthsSinceLapse - Months since customer lapsed
 * @param {number} minLifetimeValue - Minimum lifetime value threshold
 * @returns {Promise<WinBackTarget[]>} Win-back targets
 *
 * @example
 * ```typescript
 * const targets = await identifyWinBackTargets(6, 5000);
 * console.log(`${targets.length} high-value lapsed customers identified`);
 * ```
 */
export declare const identifyWinBackTargets: (monthsSinceLapse: number, minLifetimeValue: number) => Promise<WinBackTarget[]>;
/**
 * 33. Calculates customer lifetime value.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<CLVCalculation>} CLV calculation
 *
 * @example
 * ```typescript
 * const clv = await calculateCustomerLifetimeValue('customer-uuid');
 * console.log('Net CLV:', clv.netLifetimeValue);
 * ```
 */
export declare const calculateCustomerLifetimeValue: (customerId: string) => Promise<CLVCalculation>;
/**
 * 34. Updates customer lifetime value.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCustomerLifetimeValue('customer-uuid');
 * ```
 */
export declare const updateCustomerLifetimeValue: (customerId: string) => Promise<void>;
/**
 * 35. Executes win-back campaign.
 *
 * @param {WinBackTarget[]} targets - Win-back targets
 * @param {Record<string, any>} offerConfig - Win-back offer configuration
 * @returns {Promise<{campaignId: string; sent: number; cost: number}>} Campaign execution result
 *
 * @example
 * ```typescript
 * const result = await executeWinBackCampaign(targets, {
 *   offerType: 'welcome_back_discount',
 *   discount: 0.20,
 *   expirationDays: 30
 * });
 * ```
 */
export declare const executeWinBackCampaign: (targets: WinBackTarget[], offerConfig: Record<string, any>) => Promise<{
    campaignId: string;
    sent: number;
    cost: number;
}>;
/**
 * 36. Tracks win-back campaign success.
 *
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<{reactivated: number; revenue: number; roi: number}>} Success metrics
 *
 * @example
 * ```typescript
 * const success = await trackWinBackSuccess('WINBACK-123');
 * console.log('Reactivated customers:', success.reactivated, 'ROI:', success.roi);
 * ```
 */
export declare const trackWinBackSuccess: (campaignId: string) => Promise<{
    reactivated: number;
    revenue: number;
    roi: number;
}>;
/**
 * 37. Analyzes churn reasons.
 *
 * @param {Date} startDate - Analysis period start
 * @param {Date} endDate - Analysis period end
 * @returns {Promise<Array<{reason: string; count: number; percentage: number}>>} Churn analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeChurnReasons(new Date('2025-01-01'), new Date('2025-12-31'));
 * analysis.forEach(r => console.log(`${r.reason}: ${r.percentage}%`));
 * ```
 */
export declare const analyzeChurnReasons: (startDate: Date, endDate: Date) => Promise<Array<{
    reason: string;
    count: number;
    percentage: number;
}>>;
/**
 * 38. Identifies cross-sell opportunities.
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<CrossSellOpportunity>} Cross-sell opportunity
 *
 * @example
 * ```typescript
 * const opportunity = await identifyCrossSellOpportunities('customer-uuid');
 * console.log('Recommended products:', opportunity.recommendedProducts);
 * console.log('Propensity score:', opportunity.propensityScore);
 * ```
 */
export declare const identifyCrossSellOpportunities: (customerId: string) => Promise<CrossSellOpportunity>;
/**
 * 39. Records NPS survey response.
 *
 * @param {NPSSurveyResult} result - NPS survey result
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordNPSSurvey({
 *   customerId: 'customer-uuid',
 *   score: 9,
 *   category: 'promoter',
 *   feedback: 'Excellent service and competitive rates',
 *   surveyDate: new Date(),
 *   touchpoint: 'policy_renewal'
 * });
 * ```
 */
export declare const recordNPSSurvey: (result: NPSSurveyResult) => Promise<void>;
/**
 * 40. Records CSAT survey response.
 *
 * @param {CSATSurveyResult} result - CSAT survey result
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordCSATSurvey({
 *   customerId: 'customer-uuid',
 *   interactionType: 'claims_support',
 *   score: 4,
 *   maxScore: 5,
 *   feedback: 'Quick resolution, very helpful agent',
 *   surveyDate: new Date(),
 *   agentId: 'agent-123'
 * });
 * ```
 */
export declare const recordCSATSurvey: (result: CSATSurveyResult) => Promise<void>;
/**
 * 41. Calculates NPS score.
 *
 * @param {Date} startDate - Calculation period start
 * @param {Date} endDate - Calculation period end
 * @returns {Promise<{nps: number; promoters: number; passives: number; detractors: number; totalResponses: number}>} NPS metrics
 *
 * @example
 * ```typescript
 * const nps = await calculateNPSScore(new Date('2025-01-01'), new Date('2025-12-31'));
 * console.log('NPS:', nps.nps);
 * ```
 */
export declare const calculateNPSScore: (startDate: Date, endDate: Date) => Promise<{
    nps: number;
    promoters: number;
    passives: number;
    detractors: number;
    totalResponses: number;
}>;
/**
 * 42. Analyzes satisfaction trends.
 *
 * @param {number} months - Number of months to analyze
 * @returns {Promise<Array<{month: string; nps: number; csat: number; responseRate: number}>>} Satisfaction trends
 *
 * @example
 * ```typescript
 * const trends = await analyzeSatisfactionTrends(12);
 * trends.forEach(t => console.log(`${t.month}: NPS ${t.nps}, CSAT ${t.csat}`));
 * ```
 */
export declare const analyzeSatisfactionTrends: (months: number) => Promise<Array<{
    month: string;
    nps: number;
    csat: number;
    responseRate: number;
}>>;
declare const _default: {
    createCustomerModel: (sequelize: Sequelize) => any;
    createHouseholdModel: (sequelize: Sequelize) => any;
    registerNewCustomer: (config: CustomerOnboardingConfig) => Promise<Partial<CustomerAttributes>>;
    validateCustomerRegistration: (config: CustomerOnboardingConfig) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    initiateOnboardingWorkflow: (customerId: string) => Promise<{
        workflowId: string;
        steps: string[];
        currentStep: string;
    }>;
    completeOnboardingStep: (workflowId: string, step: string, data?: Record<string, any>) => Promise<{
        completed: boolean;
        nextStep?: string;
    }>;
    sendWelcomeCommunication: (customerId: string, channels: CommunicationChannel[]) => Promise<{
        sent: number;
        failed: number;
    }>;
    trackOnboardingProgress: (customerId: string) => Promise<{
        progress: number;
        completedSteps: string[];
        pendingSteps: string[];
    }>;
    initiateKYCVerification: (request: KYCVerificationRequest) => Promise<{
        verificationId: string;
        status: KYCStatus;
        estimatedCompletion?: Date;
    }>;
    verifyIdentityDocument: (verificationId: string, verificationData: Record<string, any>) => Promise<{
        verified: boolean;
        confidence: number;
        issues?: string[];
    }>;
    performAMLScreening: (request: AMLScreeningRequest) => Promise<{
        screeningId: string;
        riskLevel: AMLRiskLevel;
        matches: number;
        details?: Record<string, any>;
    }>;
    updateKYCStatus: (customerId: string, status: KYCStatus, reason?: string) => Promise<void>;
    checkKYCReverification: (customerId: string) => Promise<{
        required: boolean;
        reason?: string;
        dueDate?: Date;
    }>;
    generateKYCComplianceReport: (startDate: Date, endDate: Date) => Promise<{
        totalCustomers: number;
        verified: number;
        pending: number;
        failed: number;
        complianceRate: number;
    }>;
    updateCustomerProfile: (customerId: string, updates: CustomerProfileUpdate) => Promise<Partial<CustomerAttributes>>;
    getCustomerProfile: (customerId: string, include?: string[]) => Promise<Record<string, any>>;
    mergeDuplicateCustomers: (primaryCustomerId: string, duplicateCustomerIds: string[]) => Promise<{
        merged: number;
        primaryId: string;
    }>;
    searchCustomers: (filters: FilterParams, pagination: PaginationParams, sort?: SortParams) => Promise<PaginatedResponse<Partial<CustomerAttributes>>>;
    archiveInactiveCustomers: (inactiveSince: Date) => Promise<{
        archived: number;
        retentionPeriod: number;
    }>;
    createHousehold: (config: HouseholdGrouping) => Promise<Partial<HouseholdAttributes>>;
    addHouseholdMember: (householdId: string, customerId: string, relationship: RelationshipType) => Promise<{
        added: boolean;
        memberCount: number;
    }>;
    removeHouseholdMember: (householdId: string, customerId: string) => Promise<{
        removed: boolean;
        memberCount: number;
    }>;
    calculateHouseholdLifetimeValue: (householdId: string) => Promise<{
        totalValue: number;
        memberContributions: Record<string, number>;
    }>;
    updateCustomerPreferences: (customerId: string, preferences: CustomerPreferences) => Promise<void>;
    segmentCustomers: (criteria: SegmentationCriteria) => Promise<Array<{
        customerId: string;
        segment: CustomerSegment;
        score: number;
    }>>;
    updateCustomerSegment: (customerId: string, segment: CustomerSegment) => Promise<void>;
    getSegmentDistribution: () => Promise<Record<CustomerSegment, number>>;
    calculateEngagementScore: (customerId: string) => Promise<{
        score: number;
        factors: Record<string, number>;
        trend: "increasing" | "stable" | "decreasing";
    }>;
    createRetentionCampaign: (config: RetentionCampaignConfig) => Promise<{
        campaignId: string;
        targetedCustomers: number;
        estimatedCost: number;
    }>;
    predictCustomerLapse: (customerId: string) => Promise<LapsePrediction>;
    identifyAtRiskCustomers: (riskThreshold: number) => Promise<Array<{
        customerId: string;
        riskScore: number;
        segment: CustomerSegment;
    }>>;
    executeLapsePreventionWorkflow: (customerId: string, interventions: string[]) => Promise<{
        executed: number;
        scheduled: number;
    }>;
    trackRetentionCampaignPerformance: (campaignId: string) => Promise<{
        reached: number;
        engaged: number;
        converted: number;
        roi: number;
    }>;
    identifyWinBackTargets: (monthsSinceLapse: number, minLifetimeValue: number) => Promise<WinBackTarget[]>;
    calculateCustomerLifetimeValue: (customerId: string) => Promise<CLVCalculation>;
    updateCustomerLifetimeValue: (customerId: string) => Promise<void>;
    executeWinBackCampaign: (targets: WinBackTarget[], offerConfig: Record<string, any>) => Promise<{
        campaignId: string;
        sent: number;
        cost: number;
    }>;
    trackWinBackSuccess: (campaignId: string) => Promise<{
        reactivated: number;
        revenue: number;
        roi: number;
    }>;
    analyzeChurnReasons: (startDate: Date, endDate: Date) => Promise<Array<{
        reason: string;
        count: number;
        percentage: number;
    }>>;
    identifyCrossSellOpportunities: (customerId: string) => Promise<CrossSellOpportunity>;
    recordNPSSurvey: (result: NPSSurveyResult) => Promise<void>;
    recordCSATSurvey: (result: CSATSurveyResult) => Promise<void>;
    calculateNPSScore: (startDate: Date, endDate: Date) => Promise<{
        nps: number;
        promoters: number;
        passives: number;
        detractors: number;
        totalResponses: number;
    }>;
    analyzeSatisfactionTrends: (months: number) => Promise<Array<{
        month: string;
        nps: number;
        csat: number;
        responseRate: number;
    }>>;
};
export default _default;
//# sourceMappingURL=customer-lifecycle-kit.d.ts.map