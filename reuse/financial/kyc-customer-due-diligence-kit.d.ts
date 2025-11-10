/**
 * LOC: KYC-CDD-001
 * File: /reuse/financial/kyc-customer-due-diligence-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/kyc-verification.service.ts
 *   - backend/onboarding/customer-onboarding.service.ts
 *   - backend/compliance/risk-assessment.service.ts
 *   - backend/controllers/kyc.controller.ts
 */
/**
 * File: /reuse/financial/kyc-customer-due-diligence-kit.ts
 * Locator: WC-KYC-CDD-001
 * Purpose: Production-ready KYC/Customer Due Diligence - identity verification, document validation, risk assessment, onboarding workflows
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: KYC services, compliance controllers, onboarding processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 40 production-ready functions for comprehensive KYC/CDD compliance
 *
 * LLM Context: Enterprise-grade KYC/Customer Due Diligence utilities for regulatory compliance.
 * Provides identity verification, document validation, risk categorization, onboarding workflows,
 * ongoing monitoring, risk scoring, address verification, wealth documentation, transaction volume assessment,
 * profile updates, adverse media screening, and lifecycle management.
 */
import { Sequelize } from 'sequelize';
interface KYCVerificationRequest {
    customerId: string;
    customerName: string;
    dateOfBirth: Date;
    nationalId: string;
    documentType: string;
    documentNumber: string;
    documentExpiryDate: Date;
    address: string;
    country: string;
    metadata?: Record<string, any>;
}
interface IdentityVerificationResult {
    customerId: string;
    verificationId: string;
    status: 'verified' | 'pending' | 'failed' | 'manual_review';
    matchScore: number;
    documentValidation: boolean;
    livelinessCheck: boolean;
    biometricMatch: boolean;
    failureReasons?: string[];
    verifiedAt?: Date;
    expiresAt?: Date;
}
interface DocumentValidation {
    documentId: string;
    customerId: string;
    documentType: 'passport' | 'driver_license' | 'national_id' | 'utility_bill' | 'bank_statement' | 'tax_return';
    documentNumber: string;
    issueDate: Date;
    expiryDate: Date;
    issuingCountry: string;
    isValid: boolean;
    ocrScore: number;
    securityFeaturesVerified: boolean;
    metadata?: Record<string, any>;
}
interface RiskAssessment {
    customerId: string;
    assessmentId: string;
    riskCategory: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    pep: boolean;
    adverseMedia: boolean;
    sanctionsList: boolean;
    countryRisk: number;
    businessTypeRisk: number;
    assessedAt: Date;
    validUntil: Date;
    reviewNotes?: string;
}
interface OnboardingWorkflow {
    customerId: string;
    workflowId: string;
    stage: 'initiated' | 'identity_verification' | 'document_collection' | 'risk_assessment' | 'approval' | 'activation' | 'rejected';
    startDate: Date;
    expectedCompletionDate: Date;
    completionDate?: Date;
    currentStep: number;
    totalSteps: number;
    status: 'active' | 'completed' | 'suspended' | 'cancelled';
    metadata?: Record<string, any>;
}
interface AddressVerification {
    customerId: string;
    verificationId: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    verified: boolean;
    verificationMethod: 'document' | 'utility_bill' | 'postal' | 'online' | 'bank_statement';
    verifiedAt?: Date;
    expiresAt?: Date;
    riskLevel: 'low' | 'medium' | 'high';
}
interface WealthDocumentation {
    customerId: string;
    documentId: string;
    documentType: 'bank_statement' | 'investment_statement' | 'property_deed' | 'tax_return' | 'pension_document';
    sourceOfFunds: string;
    verificationStatus: 'pending' | 'verified' | 'failed';
    documentDate: Date;
    uploadedAt: Date;
    metadata?: Record<string, any>;
}
interface RiskScoringResult {
    customerId: string;
    scoringId: string;
    baseRiskScore: number;
    verificationRisk: number;
    behavioralRisk: number;
    geographicRisk: number;
    countryRisk: number;
    pepRisk: number;
    sanctionsRisk: number;
    compositeRiskScore: number;
    riskCategory: 'low' | 'medium' | 'high' | 'critical';
    scoredAt: Date;
    validUntil: Date;
}
interface MonitoringRecord {
    customerId: string;
    recordId: string;
    monitoringType: 'periodic' | 'ongoing' | 'triggered' | 'enhanced';
    status: 'active' | 'inactive' | 'escalated';
    lastReviewDate: Date;
    nextReviewDate: Date;
    findings?: string[];
    actionsTaken?: string[];
    metadata?: Record<string, any>;
}
interface AdverseMediaScreening {
    customerId: string;
    screeningId: string;
    matches: Array<{
        source: string;
        matchType: 'name' | 'entity' | 'related_entity';
        description: string;
        severity: 'low' | 'medium' | 'high';
        matchDate: Date;
    }>;
    overallMatch: boolean;
    screenedAt: Date;
    expiresAt: Date;
}
/**
 * KYC Verification model for storing identity verification records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} KYCVerification model
 *
 * @example
 * ```typescript
 * const KYCModel = createKYCVerificationModel(sequelize);
 * const verification = await KYCModel.create({
 *   customerId: 'CUST123',
 *   customerName: 'John Doe',
 *   status: 'verified',
 *   matchScore: 98.5
 * });
 * ```
 */
export declare const createKYCVerificationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        verificationId: string;
        status: string;
        matchScore: number;
        documentValidation: boolean;
        livelinessCheck: boolean;
        biometricMatch: boolean;
        failureReasons: string[] | null;
        verifiedAt: Date | null;
        expiresAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Document Validation model for storing document verification records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DocumentValidation model
 */
export declare const createDocumentValidationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        documentId: string;
        documentType: string;
        documentNumber: string;
        issueDate: Date;
        expiryDate: Date;
        issuingCountry: string;
        isValid: boolean;
        ocrScore: number;
        securityFeaturesVerified: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Risk Assessment model for storing customer risk assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskAssessment model
 */
export declare const createRiskAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        assessmentId: string;
        riskCategory: string;
        riskScore: number;
        pep: boolean;
        adverseMedia: boolean;
        sanctionsList: boolean;
        countryRisk: number;
        businessTypeRisk: number;
        assessedAt: Date;
        validUntil: Date;
        reviewNotes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Onboarding Workflow model for tracking customer onboarding progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OnboardingWorkflow model
 */
export declare const createOnboardingWorkflowModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        workflowId: string;
        stage: string;
        startDate: Date;
        expectedCompletionDate: Date;
        completionDate: Date | null;
        currentStep: number;
        totalSteps: number;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Monitoring Record model for ongoing customer monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MonitoringRecord model
 */
export declare const createMonitoringRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        recordId: string;
        monitoringType: string;
        status: string;
        lastReviewDate: Date;
        nextReviewDate: Date;
        findings: string[] | null;
        actionsTaken: string[] | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Initiates identity verification for a customer.
 *
 * @param {KYCVerificationRequest} request - Verification request
 * @param {any} KYCModel - KYC model
 * @returns {Promise<IdentityVerificationResult>} Verification result
 *
 * @example
 * ```typescript
 * const result = await initiateIdentityVerification(request, KYCModel);
 * console.log(`Verification status: ${result.status}`);
 * ```
 */
export declare const initiateIdentityVerification: (request: KYCVerificationRequest, KYCModel: any) => Promise<IdentityVerificationResult>;
/**
 * Validates biometric data against submitted documents.
 *
 * @param {string} customerId - Customer ID
 * @param {any} biometricData - Biometric data
 * @returns {Promise<{ valid: boolean; score: number }>} Validation result
 */
export declare const validateBiometricData: (customerId: string, biometricData: any) => Promise<{
    valid: boolean;
    score: number;
}>;
/**
 * Performs liveliness detection check.
 *
 * @param {string} customerId - Customer ID
 * @param {any} videoData - Video/image data
 * @returns {Promise<{ passed: boolean; confidence: number }>} Liveliness result
 */
export declare const performLivelinessDetection: (customerId: string, videoData: any) => Promise<{
    passed: boolean;
    confidence: number;
}>;
/**
 * Checks customer against PEP (Politically Exposed Person) databases.
 *
 * @param {string} customerId - Customer ID
 * @param {string} customerName - Customer name
 * @returns {Promise<{ isPEP: boolean; pepLevel: string; details?: any }>} PEP check result
 */
export declare const checkPEPStatus: (customerId: string, customerName: string) => Promise<{
    isPEP: boolean;
    pepLevel: string;
    details?: any;
}>;
/**
 * Verifies identity with government databases.
 *
 * @param {string} customerId - Customer ID
 * @param {string} nationalId - National ID
 * @param {string} country - ISO country code
 * @returns {Promise<{ verified: boolean; score: number; source: string }>} Verification result
 */
export declare const verifyWithGovernmentDatabase: (customerId: string, nationalId: string, country: string) => Promise<{
    verified: boolean;
    score: number;
    source: string;
}>;
/**
 * Re-verifies customer identity after specified period.
 *
 * @param {string} customerId - Customer ID
 * @param {any} KYCModel - KYC model
 * @returns {Promise<IdentityVerificationResult>} Re-verification result
 */
export declare const reverifyCustomerIdentity: (customerId: string, KYCModel: any) => Promise<IdentityVerificationResult>;
/**
 * Validates document authenticity and integrity.
 *
 * @param {string} customerId - Customer ID
 * @param {any} documentImage - Document image data
 * @param {string} documentType - Document type
 * @returns {Promise<DocumentValidation>} Document validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDocumentAuthenticity(customerId, image, 'passport');
 * console.log(`Document valid: ${validation.isValid}`);
 * ```
 */
export declare const validateDocumentAuthenticity: (customerId: string, documentImage: any, documentType: string) => Promise<DocumentValidation>;
/**
 * Performs OCR on document to extract data.
 *
 * @param {any} documentImage - Document image
 * @returns {Promise<{ text: string; score: number; fields: Record<string, any> }>} OCR result
 */
export declare const performDocumentOCR: (documentImage: any) => Promise<{
    text: string;
    score: number;
    fields: Record<string, any>;
}>;
/**
 * Checks document expiration status.
 *
 * @param {Date} expiryDate - Document expiry date
 * @returns {Promise<{ expired: boolean; daysRemaining: number }>} Expiration check
 */
export declare const checkDocumentExpiration: (expiryDate: Date) => Promise<{
    expired: boolean;
    daysRemaining: number;
}>;
/**
 * Verifies document security features against known patterns.
 *
 * @param {string} documentType - Document type
 * @param {any} documentImage - Document image
 * @returns {Promise<{ verified: boolean; features: string[] }>} Security verification result
 */
export declare const verifyDocumentSecurityFeatures: (documentType: string, documentImage: any) => Promise<{
    verified: boolean;
    features: string[];
}>;
/**
 * Detects document tampering or forgery.
 *
 * @param {any} documentImage - Document image
 * @returns {Promise<{ tampered: boolean; confidence: number; indicators: string[] }>} Tampering detection
 */
export declare const detectDocumentTampering: (documentImage: any) => Promise<{
    tampered: boolean;
    confidence: number;
    indicators: string[];
}>;
/**
 * Categorizes customer into risk tiers.
 *
 * @param {any} customerProfile - Customer profile
 * @returns {Promise<RiskAssessment>} Risk assessment
 *
 * @example
 * ```typescript
 * const assessment = await categorizeCustomerRisk(profile);
 * console.log(`Risk category: ${assessment.riskCategory}`);
 * ```
 */
export declare const categorizeCustomerRisk: (customerProfile: any) => Promise<RiskAssessment>;
/**
 * Evaluates business type risk factors.
 *
 * @param {string} businessType - Business type
 * @param {string} country - Country
 * @returns {Promise<{ riskScore: number; riskFactors: string[] }>} Business type risk
 */
export declare const evaluateBusinessTypeRisk: (businessType: string, country: string) => Promise<{
    riskScore: number;
    riskFactors: string[];
}>;
/**
 * Assesses country and jurisdiction risk.
 *
 * @param {string} country - ISO country code
 * @returns {Promise<{ riskScore: number; riskLevel: string; factors: string[] }>} Country risk assessment
 */
export declare const assessCountryRisk: (country: string) => Promise<{
    riskScore: number;
    riskLevel: string;
    factors: string[];
}>;
/**
 * Flags customer for enhanced due diligence.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Flag reason
 * @param {any} RiskModel - Risk model
 * @returns {Promise<RiskAssessment>} Updated risk assessment
 */
export declare const flagCustomerForEDD: (customerId: string, reason: string, RiskModel: any) => Promise<RiskAssessment>;
/**
 * Initiates customer onboarding workflow.
 *
 * @param {string} customerId - Customer ID
 * @param {any} WorkflowModel - Workflow model
 * @returns {Promise<OnboardingWorkflow>} Onboarding workflow
 *
 * @example
 * ```typescript
 * const workflow = await initiateOnboarding(customerId, WorkflowModel);
 * console.log(`Workflow stage: ${workflow.stage}`);
 * ```
 */
export declare const initiateOnboarding: (customerId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
/**
 * Advances onboarding workflow to next stage.
 *
 * @param {string} workflowId - Workflow ID
 * @param {any} WorkflowModel - Workflow model
 * @returns {Promise<OnboardingWorkflow>} Updated workflow
 */
export declare const advanceOnboardingStage: (workflowId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
/**
 * Suspends onboarding workflow.
 *
 * @param {string} workflowId - Workflow ID
 * @param {string} reason - Suspension reason
 * @param {any} WorkflowModel - Workflow model
 * @returns {Promise<OnboardingWorkflow>} Updated workflow
 */
export declare const suspendOnboarding: (workflowId: string, reason: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
/**
 * Completes onboarding workflow and activates customer.
 *
 * @param {string} workflowId - Workflow ID
 * @param {any} WorkflowModel - Workflow model
 * @returns {Promise<OnboardingWorkflow>} Completed workflow
 */
export declare const completeOnboarding: (workflowId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
/**
 * Initiates ongoing customer monitoring.
 *
 * @param {string} customerId - Customer ID
 * @param {string} monitoringType - Monitoring type
 * @param {any} MonitoringModel - Monitoring model
 * @returns {Promise<MonitoringRecord>} Monitoring record
 *
 * @example
 * ```typescript
 * const monitoring = await initiateMonitoring(customerId, 'periodic', MonitoringModel);
 * console.log(`Monitoring status: ${monitoring.status}`);
 * ```
 */
export declare const initiateMonitoring: (customerId: string, monitoringType: string, MonitoringModel: any) => Promise<MonitoringRecord>;
/**
 * Updates customer monitoring status based on new information.
 *
 * @param {string} customerId - Customer ID
 * @param {any} findings - Monitoring findings
 * @param {any} MonitoringModel - Monitoring model
 * @returns {Promise<MonitoringRecord>} Updated monitoring record
 */
export declare const updateMonitoringStatus: (customerId: string, findings: any, MonitoringModel: any) => Promise<MonitoringRecord>;
/**
 * Escalates monitoring to enhanced due diligence.
 *
 * @param {string} customerId - Customer ID
 * @param {any} MonitoringModel - Monitoring model
 * @returns {Promise<MonitoringRecord>} Escalated monitoring record
 */
export declare const escalateMonitoring: (customerId: string, MonitoringModel: any) => Promise<MonitoringRecord>;
/**
 * Calculates comprehensive risk score for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {any} customerData - Customer data
 * @returns {Promise<RiskScoringResult>} Risk scoring result
 *
 * @example
 * ```typescript
 * const score = await calculateComprehensiveRiskScore(customerId, data);
 * console.log(`Risk category: ${score.riskCategory}`);
 * ```
 */
export declare const calculateComprehensiveRiskScore: (customerId: string, customerData: any) => Promise<RiskScoringResult>;
/**
 * Evaluates behavioral risk factors.
 *
 * @param {string} customerId - Customer ID
 * @param {any} transactionHistory - Transaction history
 * @returns {Promise<{ riskScore: number; indicators: string[] }>} Behavioral risk
 */
export declare const evaluateBehavioralRisk: (customerId: string, transactionHistory: any) => Promise<{
    riskScore: number;
    indicators: string[];
}>;
/**
 * Reassesses and updates risk score based on new events.
 *
 * @param {string} customerId - Customer ID
 * @param {any} newEvents - New events/data
 * @returns {Promise<RiskScoringResult>} Updated risk score
 */
export declare const reassessRiskScore: (customerId: string, newEvents: any) => Promise<RiskScoringResult>;
/**
 * Verifies customer address through multiple methods.
 *
 * @param {string} customerId - Customer ID
 * @param {string} address - Address
 * @param {string} country - Country
 * @returns {Promise<AddressVerification>} Address verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyCustomerAddress(customerId, address, country);
 * console.log(`Address verified: ${verification.verified}`);
 * ```
 */
export declare const verifyCustomerAddress: (customerId: string, address: string, country: string) => Promise<AddressVerification>;
/**
 * Validates address against postal services database.
 *
 * @param {string} address - Address
 * @param {string} country - Country
 * @returns {Promise<{ valid: boolean; standardized: string }>} Validation result
 */
export declare const validateAddressPostal: (address: string, country: string) => Promise<{
    valid: boolean;
    standardized: string;
}>;
/**
 * Verifies address matches document.
 *
 * @param {string} addressOnDocument - Address on document
 * @param {string} currentAddress - Current address
 * @returns {Promise<{ matches: boolean; confidence: number }>} Address match result
 */
export declare const verifyAddressMatchesDocument: (addressOnDocument: string, currentAddress: string) => Promise<{
    matches: boolean;
    confidence: number;
}>;
/**
 * Collects and validates wealth documentation.
 *
 * @param {string} customerId - Customer ID
 * @param {string} documentType - Wealth document type
 * @param {any} documentData - Document data
 * @returns {Promise<WealthDocumentation>} Wealth documentation record
 *
 * @example
 * ```typescript
 * const wealth = await collectWealthDocumentation(customerId, 'bank_statement', data);
 * console.log(`Verification status: ${wealth.verificationStatus}`);
 * ```
 */
export declare const collectWealthDocumentation: (customerId: string, documentType: string, documentData: any) => Promise<WealthDocumentation>;
/**
 * Validates source of funds documentation.
 *
 * @param {string} customerId - Customer ID
 * @param {any[]} documents - Wealth documents
 * @returns {Promise<{ valid: boolean; sourcesVerified: string[] }>} Source of funds validation
 */
export declare const validateSourceOfFunds: (customerId: string, documents: any[]) => Promise<{
    valid: boolean;
    sourcesVerified: string[];
}>;
/**
 * Assesses expected transaction volume and patterns.
 *
 * @param {string} customerId - Customer ID
 * @param {any} businessProfile - Business profile
 * @returns {Promise<{ expectedMonthlyVolume: number; expectedAverageTransaction: number; riskLevel: string }>} Volume assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessExpectedTransactionVolume(customerId, profile);
 * console.log(`Expected monthly volume: ${assessment.expectedMonthlyVolume}`);
 * ```
 */
export declare const assessExpectedTransactionVolume: (customerId: string, businessProfile: any) => Promise<{
    expectedMonthlyVolume: number;
    expectedAverageTransaction: number;
    riskLevel: string;
}>;
/**
 * Monitors actual vs expected transaction patterns.
 *
 * @param {string} customerId - Customer ID
 * @param {any} expectedProfile - Expected profile
 * @param {any} actualTransactions - Actual transactions
 * @returns {Promise<{ compliant: boolean; deviations: string[] }>} Pattern monitoring result
 */
export declare const monitorTransactionPatterns: (customerId: string, expectedProfile: any, actualTransactions: any) => Promise<{
    compliant: boolean;
    deviations: string[];
}>;
/**
 * Updates customer profile with new information.
 *
 * @param {string} customerId - Customer ID
 * @param {any} updates - Profile updates
 * @param {any} KYCModel - KYC model
 * @returns {Promise<any>} Updated profile
 *
 * @example
 * ```typescript
 * const updated = await updateCustomerProfile(customerId, updates, KYCModel);
 * console.log('Profile updated');
 * ```
 */
export declare const updateCustomerProfile: (customerId: string, updates: any, KYCModel: any) => Promise<any>;
/**
 * Screens customer against adverse media and news sources.
 *
 * @param {string} customerId - Customer ID
 * @param {string} customerName - Customer name
 * @returns {Promise<AdverseMediaScreening>} Screening result
 *
 * @example
 * ```typescript
 * const screening = await screenAdverseMedia(customerId, name);
 * console.log(`Adverse media found: ${screening.overallMatch}`);
 * ```
 */
export declare const screenAdverseMedia: (customerId: string, customerName: string) => Promise<AdverseMediaScreening>;
/**
 * Suspends customer account for compliance reasons.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Suspension reason
 * @param {any} KYCModel - KYC model
 * @returns {Promise<any>} Updated customer record
 *
 * @example
 * ```typescript
 * const suspended = await suspendCustomerAccount(customerId, 'Enhanced review required', KYCModel);
 * console.log('Account suspended');
 * ```
 */
export declare const suspendCustomerAccount: (customerId: string, reason: string, KYCModel: any) => Promise<any>;
/**
 * Off-boards customer and terminates relationship.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Offboarding reason
 * @param {any} KYCModel - KYC model
 * @returns {Promise<any>} Offboarded customer record
 */
export declare const offboardCustomer: (customerId: string, reason: string, KYCModel: any) => Promise<any>;
/**
 * NestJS service for KYC/CDD operations.
 *
 * @class KYCCustomerDueDiligenceService
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CustomerService {
 *   constructor(private kycService: KYCCustomerDueDiligenceService) {}
 *
 *   async onboardCustomer(request: KYCVerificationRequest) {
 *     return this.kycService.initiateOnboarding(request.customerId);
 *   }
 * }
 * ```
 */
export declare class KYCCustomerDueDiligenceService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    initiateVerification(request: KYCVerificationRequest): Promise<IdentityVerificationResult>;
    validateDocument(customerId: string, documentImage: any, documentType: string): Promise<DocumentValidation>;
    assessRisk(customerProfile: any): Promise<RiskAssessment>;
    initiateOnboarding(customerId: string): Promise<OnboardingWorkflow>;
    getMonitoringStatus(customerId: string): Promise<any>;
    calculateRiskScore(customerId: string, customerData: any): Promise<RiskScoringResult>;
    verifyAddress(customerId: string, address: string, country: string): Promise<AddressVerification>;
    collectWealth(customerId: string, documentType: string, documentData: any): Promise<WealthDocumentation>;
    screenAdverseSources(customerId: string, customerName: string): Promise<AdverseMediaScreening>;
}
/**
 * Default export with all KYC/CDD utilities.
 */
declare const _default: {
    createKYCVerificationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            verificationId: string;
            status: string;
            matchScore: number;
            documentValidation: boolean;
            livelinessCheck: boolean;
            biometricMatch: boolean;
            failureReasons: string[] | null;
            verifiedAt: Date | null;
            expiresAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDocumentValidationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            documentId: string;
            documentType: string;
            documentNumber: string;
            issueDate: Date;
            expiryDate: Date;
            issuingCountry: string;
            isValid: boolean;
            ocrScore: number;
            securityFeaturesVerified: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRiskAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            assessmentId: string;
            riskCategory: string;
            riskScore: number;
            pep: boolean;
            adverseMedia: boolean;
            sanctionsList: boolean;
            countryRisk: number;
            businessTypeRisk: number;
            assessedAt: Date;
            validUntil: Date;
            reviewNotes: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createOnboardingWorkflowModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            workflowId: string;
            stage: string;
            startDate: Date;
            expectedCompletionDate: Date;
            completionDate: Date | null;
            currentStep: number;
            totalSteps: number;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createMonitoringRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            customerId: string;
            recordId: string;
            monitoringType: string;
            status: string;
            lastReviewDate: Date;
            nextReviewDate: Date;
            findings: string[] | null;
            actionsTaken: string[] | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    initiateIdentityVerification: (request: KYCVerificationRequest, KYCModel: any) => Promise<IdentityVerificationResult>;
    validateBiometricData: (customerId: string, biometricData: any) => Promise<{
        valid: boolean;
        score: number;
    }>;
    performLivelinessDetection: (customerId: string, videoData: any) => Promise<{
        passed: boolean;
        confidence: number;
    }>;
    checkPEPStatus: (customerId: string, customerName: string) => Promise<{
        isPEP: boolean;
        pepLevel: string;
        details?: any;
    }>;
    verifyWithGovernmentDatabase: (customerId: string, nationalId: string, country: string) => Promise<{
        verified: boolean;
        score: number;
        source: string;
    }>;
    reverifyCustomerIdentity: (customerId: string, KYCModel: any) => Promise<IdentityVerificationResult>;
    validateDocumentAuthenticity: (customerId: string, documentImage: any, documentType: string) => Promise<DocumentValidation>;
    performDocumentOCR: (documentImage: any) => Promise<{
        text: string;
        score: number;
        fields: Record<string, any>;
    }>;
    checkDocumentExpiration: (expiryDate: Date) => Promise<{
        expired: boolean;
        daysRemaining: number;
    }>;
    verifyDocumentSecurityFeatures: (documentType: string, documentImage: any) => Promise<{
        verified: boolean;
        features: string[];
    }>;
    detectDocumentTampering: (documentImage: any) => Promise<{
        tampered: boolean;
        confidence: number;
        indicators: string[];
    }>;
    categorizeCustomerRisk: (customerProfile: any) => Promise<RiskAssessment>;
    evaluateBusinessTypeRisk: (businessType: string, country: string) => Promise<{
        riskScore: number;
        riskFactors: string[];
    }>;
    assessCountryRisk: (country: string) => Promise<{
        riskScore: number;
        riskLevel: string;
        factors: string[];
    }>;
    flagCustomerForEDD: (customerId: string, reason: string, RiskModel: any) => Promise<RiskAssessment>;
    initiateOnboarding: (customerId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
    advanceOnboardingStage: (workflowId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
    suspendOnboarding: (workflowId: string, reason: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
    completeOnboarding: (workflowId: string, WorkflowModel: any) => Promise<OnboardingWorkflow>;
    initiateMonitoring: (customerId: string, monitoringType: string, MonitoringModel: any) => Promise<MonitoringRecord>;
    updateMonitoringStatus: (customerId: string, findings: any, MonitoringModel: any) => Promise<MonitoringRecord>;
    escalateMonitoring: (customerId: string, MonitoringModel: any) => Promise<MonitoringRecord>;
    calculateComprehensiveRiskScore: (customerId: string, customerData: any) => Promise<RiskScoringResult>;
    evaluateBehavioralRisk: (customerId: string, transactionHistory: any) => Promise<{
        riskScore: number;
        indicators: string[];
    }>;
    reassessRiskScore: (customerId: string, newEvents: any) => Promise<RiskScoringResult>;
    verifyCustomerAddress: (customerId: string, address: string, country: string) => Promise<AddressVerification>;
    validateAddressPostal: (address: string, country: string) => Promise<{
        valid: boolean;
        standardized: string;
    }>;
    verifyAddressMatchesDocument: (addressOnDocument: string, currentAddress: string) => Promise<{
        matches: boolean;
        confidence: number;
    }>;
    collectWealthDocumentation: (customerId: string, documentType: string, documentData: any) => Promise<WealthDocumentation>;
    validateSourceOfFunds: (customerId: string, documents: any[]) => Promise<{
        valid: boolean;
        sourcesVerified: string[];
    }>;
    assessExpectedTransactionVolume: (customerId: string, businessProfile: any) => Promise<{
        expectedMonthlyVolume: number;
        expectedAverageTransaction: number;
        riskLevel: string;
    }>;
    monitorTransactionPatterns: (customerId: string, expectedProfile: any, actualTransactions: any) => Promise<{
        compliant: boolean;
        deviations: string[];
    }>;
    updateCustomerProfile: (customerId: string, updates: any, KYCModel: any) => Promise<any>;
    screenAdverseMedia: (customerId: string, customerName: string) => Promise<AdverseMediaScreening>;
    suspendCustomerAccount: (customerId: string, reason: string, KYCModel: any) => Promise<any>;
    offboardCustomer: (customerId: string, reason: string, KYCModel: any) => Promise<any>;
    KYCCustomerDueDiligenceService: typeof KYCCustomerDueDiligenceService;
};
export default _default;
//# sourceMappingURL=kyc-customer-due-diligence-kit.d.ts.map