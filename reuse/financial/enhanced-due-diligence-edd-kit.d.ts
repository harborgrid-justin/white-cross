/**
 * Enhanced Due Diligence (EDD) Kit
 *
 * Enterprise-grade Enhanced Due Diligence system for high-risk customer onboarding,
 * ongoing monitoring, and compliance workflows. Provides comprehensive functions for
 * managing EDD triggers, verification processes, approvals, and risk assessments.
 *
 * Features:
 * - EDD trigger identification and management
 * - Enhanced information collection and validation
 * - Independent source verification workflows
 * - Senior management approval processes
 * - Account purpose documentation
 * - Source of funds and wealth verification
 * - Beneficial ownership identification
 * - Control person verification
 * - Enhanced ongoing monitoring
 * - Transaction scrutiny and pattern analysis
 * - Relationship review frequency management
 * - Third-party information requests
 * - Public records research integration
 * - Financial statement analysis
 * - High-risk customer management
 *
 * @module enhanced-due-diligence-edd-kit
 */
/**
 * EDD Trigger ID (unique identifier for EDD event)
 */
export type EDDTriggerId = string & {
    readonly __brand: 'EDDTriggerId';
};
/**
 * EDD Record ID (unique identifier for EDD record)
 */
export type EDDRecordId = string & {
    readonly __brand: 'EDDRecordId';
};
/**
 * Beneficial Owner ID
 */
export type BeneficialOwnerId = string & {
    readonly __brand: 'BeneficialOwnerId';
};
/**
 * EDD Risk Score (0-100, where 100 is highest risk)
 */
export type EDDRiskScore = number & {
    readonly __brand: 'EDDRiskScore';
};
/**
 * EDD trigger reason enumeration
 */
export declare enum EDDTriggerReason {
    HighRiskJurisdiction = "HIGH_RISK_JURISDICTION",
    ComplexOwnership = "COMPLEX_OWNERSHIP",
    PoliticallyExposedPerson = "PEP",
    SanctionedActivity = "SANCTIONED_ACTIVITY",
    UnusualTransactionPattern = "UNUSUAL_TRANSACTION_PATTERN",
    HighNetWorthIndividual = "HIGH_NET_WORTH",
    CustomerRequestedProduct = "CUSTOMER_REQUESTED_PRODUCT",
    RegulatoryRemittance = "REGULATORY_REMITTANCE",
    CashIntensiveAActivity = "CASH_INTENSIVE_ACTIVITY",
    ThirdPartyAlert = "THIRD_PARTY_ALERT",
    RepeatViolation = "REPEAT_VIOLATION",
    ChainedOwnership = "CHAINED_OWNERSHIP"
}
/**
 * EDD status enumeration
 */
export declare enum EDDStatus {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    UnderReview = "UNDER_REVIEW",
    AwaitingApproval = "AWAITING_APPROVAL",
    Completed = "COMPLETED",
    Rejected = "REJECTED",
    Escalated = "ESCALATED",
    OnHold = "ON_HOLD"
}
/**
 * Verification method enumeration
 */
export declare enum VerificationMethod {
    GovernmentIssuedDocument = "GOVERNMENT_ISSUED_DOCUMENT",
    BankReference = "BANK_REFERENCE",
    TaxReturn = "TAX_RETURN",
    AuditedFinancialStatement = "AUDITED_FINANCIAL_STATEMENT",
    CreditReport = "CREDIT_REPORT",
    ThirdPartyDatabaseCheck = "THIRD_PARTY_DATABASE_CHECK",
    PhysicalInspection = "PHYSICAL_INSPECTION",
    PublicRecordsResearch = "PUBLIC_RECORDS_RESEARCH",
    InterviewWithCustomer = "INTERVIEW_WITH_CUSTOMER",
    IndustryPublication = "INDUSTRY_PUBLICATION"
}
/**
 * Source of funds/wealth category enumeration
 */
export declare enum SourceOfFundsCategory {
    Employment = "EMPLOYMENT",
    Business = "BUSINESS",
    Investment = "INVESTMENT",
    RealEstate = "REAL_ESTATE",
    Inheritance = "INHERITANCE",
    Gift = "GIFT",
    Loan = "LOAN",
    Cryptocurrency = "CRYPTOCURRENCY",
    RoyaltyLicensing = "ROYALTY_LICENSING",
    PensionRetirement = "PENSION_RETIREMENT",
    Unknown = "UNKNOWN"
}
/**
 * Beneficial owner type enumeration
 */
export declare enum BeneficialOwnerType {
    Individual = "INDIVIDUAL",
    Corporate = "CORPORATE",
    Trust = "TRUST",
    Foundation = "FOUNDATION",
    LimitedPartnership = "LIMITED_PARTNERSHIP",
    GeneralPartnership = "GENERAL_PARTNERSHIP",
    Other = "OTHER"
}
/**
 * Control person role enumeration
 */
export declare enum ControlPersonRole {
    Director = "DIRECTOR",
    Officer = "OFFICER",
    Manager = "MANAGER",
    Partner = "PARTNER",
    Beneficiary = "BENEFICIARY",
    Trustee = "TRUSTEE",
    Other = "OTHER"
}
/**
 * EDD trigger record
 */
export interface EDDTrigger {
    triggerId: EDDTriggerId;
    customerId: string;
    triggerReason: EDDTriggerReason;
    triggerDate: Date;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: EDDStatus;
    relatedTransactionIds?: string[];
    relatedAlertIds?: string[];
}
/**
 * Enhanced information collection record
 */
export interface EnhancedInformationCollection {
    collectionId: string;
    customerId: string;
    informationType: string;
    informationDetail: Record<string, unknown>;
    collectionDate: Date;
    collectionMethod: string;
    verificationStatus: 'Pending' | 'Verified' | 'Failed';
    collectorName: string;
    comments: string;
}
/**
 * Verification record
 */
export interface VerificationRecord {
    verificationId: string;
    customerId: string;
    method: VerificationMethod;
    verificationDate: Date;
    verificationStatus: 'Passed' | 'Failed' | 'Inconclusive';
    verifier: string;
    sourceDocumentId: string;
    findings: string;
    riskScore: EDDRiskScore;
}
/**
 * Senior management approval record
 */
export interface SeniorMgmtApproval {
    approvalId: string;
    eddRecordId: EDDRecordId;
    approvalDate: Date;
    approverName: string;
    approverTitle: string;
    approverDepartment: string;
    decision: 'Approved' | 'Approved with Conditions' | 'Rejected';
    conditions?: string[];
    rationale: string;
    escalationJustification?: string;
}
/**
 * Account purpose documentation record
 */
export interface AccountPurposeDocumentation {
    purposeDocId: string;
    customerId: string;
    primaryPurpose: string;
    secondaryPurposes?: string[];
    expectedTransactionTypes: string[];
    expectedAnnualVolume: number;
    expectedAnnualValue: number;
    countryiesOfOperation: string[];
    documentationDate: Date;
    verificationStatus: 'Not Verified' | 'Verified' | 'Rejected';
}
/**
 * Source of funds/wealth verification record
 */
export interface SourceOfFundsVerification {
    sofvId: string;
    customerId: string;
    category: SourceOfFundsCategory;
    sourceDescription: string;
    estimatedValue: number;
    verificationMethod: VerificationMethod;
    supportingDocumentIds: string[];
    verificationDate: Date;
    verificationResult: 'Confirmed' | 'Unable to Confirm' | 'Rejected';
    verifierNotes: string;
}
/**
 * Beneficial ownership information
 */
export interface BeneficialOwnershipInfo {
    boId: BeneficialOwnerId;
    customerId: string;
    ownerType: BeneficialOwnerType;
    ownerName: string;
    percentageOwned: number;
    ownershipStructure: 'Direct' | 'Indirect' | 'Layered';
    ownershipLayers?: number;
    identificationMethod: VerificationMethod;
    identificationDate: Date;
    sanctions: boolean;
    pepStatus: boolean;
    pepDetails?: string;
    countryOfResidence: string;
}
/**
 * Control person verification record
 */
export interface ControlPersonVerification {
    cpvId: string;
    customerId: string;
    personName: string;
    personRole: ControlPersonRole;
    responsibilities: string[];
    verificationDate: Date;
    verificationMethod: VerificationMethod;
    identificationDocument: string;
    sanctionsCheck: boolean;
    pepStatus: boolean;
    countryOfResidence: string;
    isPrimaryContact: boolean;
}
/**
 * Enhanced monitoring event
 */
export interface EnhancedMonitoringEvent {
    monitoringId: string;
    customerId: string;
    eventType: string;
    eventDate: Date;
    riskIndicators: string[];
    riskScore: EDDRiskScore;
    requiredAction: string;
    escalationRequired: boolean;
    actionTaken: string;
    actionDate?: Date;
}
/**
 * Transaction scrutiny record
 */
export interface TransactionScrutinyRecord {
    scrutinyId: string;
    transactionId: string;
    customerId: string;
    scrutinyDate: Date;
    transactionAmount: number;
    currency: string;
    counterpartyCountry: string;
    anomalyFlags: string[];
    riskScore: EDDRiskScore;
    investigationStatus: 'Not Started' | 'In Progress' | 'Completed';
    investigationFindings: string;
}
/**
 * Relationship review record
 */
export interface RelationshipReviewRecord {
    reviewId: string;
    customerId: string;
    reviewDate: Date;
    nextReviewDate: Date;
    reviewFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'Annually';
    updatedRiskProfile: EDDRiskScore;
    complianceStatus: 'Compliant' | 'Non-Compliant' | 'Needs Review';
    reviewerName: string;
    recommendations: string[];
}
/**
 * Third-party information request record
 */
export interface ThirdPartyInfoRequest {
    requestId: string;
    customerId: string;
    requestDate: Date;
    requestedParty: string;
    informationType: string;
    requestStatus: 'Pending' | 'Received' | 'Incomplete' | 'Rejected';
    responseDate?: Date;
    responseContent?: string;
}
/**
 * Public records research record
 */
export interface PublicRecordsResearch {
    researchId: string;
    customerId: string;
    researchDate: Date;
    recordTypes: string[];
    jurisdictions: string[];
    findingsSummary: string;
    redFlags: string[];
    riskAdjustment: number;
}
/**
 * Financial statement analysis record
 */
export interface FinancialStatementAnalysis {
    analysisId: string;
    customerId: string;
    statementYear: number;
    analysisDate: Date;
    totalAssets: number;
    totalRevenue: number;
    netIncome: number;
    liquidityRatio: number;
    debtToEquityRatio: number;
    consistencyCheck: boolean;
    riskIndicators: string[];
    analyzerNotes: string;
}
/**
 * High-risk customer profile
 */
export interface HighRiskCustomerProfile {
    hrCustomerId: string;
    customerId: string;
    overallRiskScore: EDDRiskScore;
    riskFactors: string[];
    primaryRiskDriver: string;
    managementStrategy: string;
    monitoringFrequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
    escalationThreshold: number;
    designatedOverseer: string;
    lastReviewDate: Date;
    nextReviewDate: Date;
}
/**
 * Create a valid EDDTriggerId
 * @param id - Unique identifier string
 * @returns EDDTriggerId branded type
 * @throws Error if id is empty
 */
export declare function createEDDTriggerId(id: string): EDDTriggerId;
/**
 * Create a valid EDDRecordId
 * @param id - Unique identifier string
 * @returns EDDRecordId branded type
 * @throws Error if id is empty
 */
export declare function createEDDRecordId(id: string): EDDRecordId;
/**
 * Create a valid EDDRiskScore
 * @param score - Numeric score (0-100)
 * @returns EDDRiskScore branded type
 * @throws Error if score is not in valid range
 */
export declare function createEDDRiskScore(score: number): EDDRiskScore;
/**
 * Generate EDD trigger for high-risk jurisdiction
 * @param customerId - Customer identifier
 * @param jurisdiction - Risk jurisdiction code
 * @param description - Detailed trigger description
 * @returns EDDTrigger record
 */
export declare function generateEDDTriggerForHighRiskJurisdiction(customerId: string, jurisdiction: string, description: string): EDDTrigger;
/**
 * Generate EDD trigger for complex ownership structure
 * @param customerId - Customer identifier
 * @param ownershipLayers - Number of ownership layers
 * @param jurisdictions - Number of involved jurisdictions
 * @returns EDDTrigger record
 */
export declare function generateEDDTriggerForComplexOwnership(customerId: string, ownershipLayers: number, jurisdictions: number): EDDTrigger;
/**
 * Collect enhanced customer information
 * @param customerId - Customer identifier
 * @param informationType - Type of information being collected
 * @param informationDetail - Detailed information
 * @param collectionMethod - How information was collected
 * @param collectorName - Name of person collecting information
 * @returns EnhancedInformationCollection record
 */
export declare function collectEnhancedCustomerInformation(customerId: string, informationType: string, informationDetail: Record<string, unknown>, collectionMethod: string, collectorName: string): EnhancedInformationCollection;
/**
 * Validate collected information completeness
 * @param collection - Information collection record
 * @returns Validation result with any missing required fields
 */
export declare function validateInformationCompleteness(collection: EnhancedInformationCollection): {
    valid: boolean;
    missingFields: string[];
};
/**
 * Mark information collection as verified
 * @param collection - Information collection record
 * @param verificationNotes - Additional verification notes
 * @returns Updated EnhancedInformationCollection record
 */
export declare function markInformationAsVerified(collection: EnhancedInformationCollection, verificationNotes: string): EnhancedInformationCollection;
/**
 * Initiate independent source verification
 * @param customerId - Customer identifier
 * @param verificationMethod - Method of verification
 * @param sourceDocument - Source document identifier
 * @param verifier - Person performing verification
 * @returns VerificationRecord
 */
export declare function initiateIndependentVerification(customerId: string, verificationMethod: VerificationMethod, sourceDocument: string, verifier: string): VerificationRecord;
/**
 * Cross-reference verification with third-party database
 * @param customerId - Customer identifier
 * @param databaseSource - Third-party database name
 * @param verificationData - Data to verify
 * @returns Verification result with match status and risk assessment
 */
export declare function crossReferenceThirdPartyDatabase(customerId: string, databaseSource: string, verificationData: Record<string, unknown>): {
    matched: boolean;
    riskScore: EDDRiskScore;
    findings: string;
};
/**
 * Consolidate multiple verification results
 * @param verifications - Array of verification records
 * @returns Consolidated verification status and overall risk
 */
export declare function consolidateVerificationResults(verifications: VerificationRecord[]): {
    overallStatus: string;
    aggregateRiskScore: EDDRiskScore;
    passCount: number;
    failCount: number;
};
/**
 * Prepare EDD record for senior management approval
 * @param eddRecordId - EDD record identifier
 * @param riskSummary - Summary of identified risks
 * @param recommendedConditions - Recommended approval conditions
 * @returns Prepared approval request object
 */
export declare function prepareForSeniorMgmtApproval(eddRecordId: EDDRecordId, riskSummary: string, recommendedConditions: string[]): {
    recordId: EDDRecordId;
    riskSummary: string;
    conditions: string[];
    preparedDate: Date;
};
/**
 * Record senior management approval decision
 * @param eddRecordId - EDD record identifier
 * @param approverName - Name of approver
 * @param approverTitle - Title of approver
 * @param decision - Approval decision
 * @param rationale - Decision rationale
 * @returns SeniorMgmtApproval record
 */
export declare function recordSeniorMgmtApprovalDecision(eddRecordId: EDDRecordId, approverName: string, approverTitle: string, decision: 'Approved' | 'Approved with Conditions' | 'Rejected', rationale: string): SeniorMgmtApproval;
/**
 * Escalate EDD case for additional senior review
 * @param eddRecordId - EDD record identifier
 * @param escalationReason - Reason for escalation
 * @param targetOverseer - Name of target overseer
 * @returns Escalation record
 */
export declare function escalateEDDCaseForSeniorReview(eddRecordId: EDDRecordId, escalationReason: string, targetOverseer: string): {
    escalationId: string;
    eddRecordId: EDDRecordId;
    reason: string;
    overseer: string;
    escalatedAt: Date;
};
/**
 * Document customer account purpose
 * @param customerId - Customer identifier
 * @param primaryPurpose - Primary purpose of account
 * @param expectedTransactionTypes - Expected transaction types
 * @param expectedAnnualVolume - Expected annual transaction volume
 * @param expectedAnnualValue - Expected annual transaction value
 * @returns AccountPurposeDocumentation record
 */
export declare function documentAccountPurpose(customerId: string, primaryPurpose: string, expectedTransactionTypes: string[], expectedAnnualVolume: number, expectedAnnualValue: number): AccountPurposeDocumentation;
/**
 * Validate account purpose against customer profile
 * @param purpose - Account purpose documentation
 * @param customerProfile - Customer profile data
 * @returns Validation result and any inconsistencies
 */
export declare function validateAccountPurposeAlignment(purpose: AccountPurposeDocumentation, customerProfile: Record<string, unknown>): {
    aligned: boolean;
    inconsistencies: string[];
};
/**
 * Verify and approve account purpose documentation
 * @param purpose - Account purpose documentation
 * @param verifierName - Name of verifier
 * @returns Updated AccountPurposeDocumentation with verified status
 */
export declare function verifyAccountPurposeDocumentation(purpose: AccountPurposeDocumentation, verifierName: string): AccountPurposeDocumentation;
/**
 * Initiate source of funds verification
 * @param customerId - Customer identifier
 * @param category - Source of funds category
 * @param sourceDescription - Description of source
 * @param estimatedValue - Estimated value of funds
 * @returns SourceOfFundsVerification record
 */
export declare function initiateSourceOfFundsVerification(customerId: string, category: SourceOfFundsCategory, sourceDescription: string, estimatedValue: number): SourceOfFundsVerification;
/**
 * Verify source of wealth through documentation analysis
 * @param customerId - Customer identifier
 * @param documentIds - Array of supporting document IDs
 * @param wealthCategory - Wealth source category
 * @returns Verification result with confidence level
 */
export declare function verifySourceOfWealthThroughDocumentation(customerId: string, documentIds: string[], wealthCategory: SourceOfFundsCategory): {
    verified: boolean;
    confidenceLevel: number;
    recommendations: string[];
};
/**
 * Document source of wealth discrepancies
 * @param customerId - Customer identifier
 * @param claimedWealth - Customer-claimed wealth
 * @param verifiedWealth - Verified wealth amount
 * @param discrepancyPercentage - Percentage discrepancy threshold
 * @returns Discrepancy report
 */
export declare function documentSourceOfWealthDiscrepancies(customerId: string, claimedWealth: number, verifiedWealth: number, discrepancyPercentage: number): {
    discrepancyFound: boolean;
    variance: number;
    riskFlag: boolean;
    investigationNeeded: boolean;
};
/**
 * Identify beneficial owner
 * @param customerId - Customer identifier
 * @param ownerName - Name of beneficial owner
 * @param ownerType - Type of beneficial owner
 * @param percentageOwned - Percentage ownership
 * @param countryOfResidence - Country of residence
 * @returns BeneficialOwnershipInfo record
 */
export declare function identifyBeneficialOwner(customerId: string, ownerName: string, ownerType: BeneficialOwnerType, percentageOwned: number, countryOfResidence: string): BeneficialOwnershipInfo;
/**
 * Trace beneficial ownership through corporate structure
 * @param customerId - Customer identifier
 * @param structureLayers - Number of ownership layers
 * @param jurisdictions - Array of involved jurisdictions
 * @returns Beneficial ownership chain
 */
export declare function traceBeneficialOwnershipChain(customerId: string, structureLayers: number, jurisdictions: string[]): {
    chainComplexity: 'Simple' | 'Moderate' | 'Complex';
    layerCount: number;
    requiresEDD: boolean;
};
/**
 * Verify beneficial owner against sanctions lists
 * @param ownerName - Name of beneficial owner
 * @param countryOfResidence - Country of residence
 * @returns Sanctions check result
 */
export declare function verifyBeneficialOwnerAgainstSanctionsList(ownerName: string, countryOfResidence: string): {
    sanctioned: boolean;
    pepStatus: boolean;
    matchConfidence: number;
    requiredAction: string;
};
/**
 * Verify control person
 * @param customerId - Customer identifier
 * @param personName - Name of control person
 * @param personRole - Role of control person
 * @param countryOfResidence - Country of residence
 * @returns ControlPersonVerification record
 */
export declare function verifyControlPerson(customerId: string, personName: string, personRole: ControlPersonRole, countryOfResidence: string): ControlPersonVerification;
/**
 * Validate control person identity documents
 * @param documentType - Type of identification document
 * @param documentIssuingCountry - Country issuing document
 * @param expirationDate - Document expiration date
 * @returns Validation result
 */
export declare function validateControlPersonIdentityDocuments(documentType: string, documentIssuingCountry: string, expirationDate: Date): {
    valid: boolean;
    issues: string[];
};
/**
 * Assess control person risk profile
 * @param controlPerson - Control person verification record
 * @returns Risk score and assessment
 */
export declare function assessControlPersonRiskProfile(controlPerson: ControlPersonVerification): {
    riskScore: EDDRiskScore;
    riskFactors: string[];
    requiresEnhancedMonitoring: boolean;
};
/**
 * Initiate enhanced ongoing monitoring
 * @param customerId - Customer identifier
 * @param monitoringType - Type of monitoring
 * @param monitoringFrequency - Monitoring frequency
 * @returns Enhanced monitoring event
 */
export declare function initiateEnhancedOngoingMonitoring(customerId: string, monitoringType: string, monitoringFrequency: string): EnhancedMonitoringEvent;
/**
 * Analyze customer activity for anomalies
 * @param customerId - Customer identifier
 * @param recentTransactions - Array of recent transaction amounts
 * @param baselineAverage - Customer baseline transaction average
 * @returns Anomaly detection result
 */
export declare function analyzeCustomerActivityForAnomalies(customerId: string, recentTransactions: number[], baselineAverage: number): {
    anomaliesDetected: boolean;
    outliers: number[];
    riskScore: EDDRiskScore;
};
/**
 * Generate enhanced monitoring report
 * @param customerId - Customer identifier
 * @param monitoringEvents - Array of monitoring events
 * @param reportPeriod - Report period (start and end dates)
 * @returns Monitoring summary report
 */
export declare function generateEnhancedMonitoringReport(customerId: string, monitoringEvents: EnhancedMonitoringEvent[], reportPeriod: {
    start: Date;
    end: Date;
}): {
    reportId: string;
    eventCount: number;
    escalationsRequired: number;
    averageRiskScore: EDDRiskScore;
    recommendations: string[];
};
/**
 * Perform detailed transaction scrutiny
 * @param transactionId - Transaction identifier
 * @param customerId - Customer identifier
 * @param amount - Transaction amount
 * @param counterpartyCountry - Counterparty country
 * @returns TransactionScrutinyRecord
 */
export declare function performDetailedTransactionScrutiny(transactionId: string, customerId: string, amount: number, counterpartyCountry: string): TransactionScrutinyRecord;
/**
 * Identify transaction anomalies against baseline
 * @param transactionAmount - Current transaction amount
 * @param customerAverageTransaction - Customer average transaction size
 * @param customerMaxTransaction - Customer maximum historical transaction
 * @returns Anomaly flags and risk assessment
 */
export declare function identifyTransactionAnomalies(transactionAmount: number, customerAverageTransaction: number, customerMaxTransaction: number): {
    anomalyFlags: string[];
    riskScore: EDDRiskScore;
    investigationRequired: boolean;
};
/**
 * Investigate suspicious transaction patterns
 * @param customerId - Customer identifier
 * @param transactionPattern - Pattern description
 * @param frequencyOfOccurrence - How often pattern occurs
 * @returns Investigation recommendation
 */
export declare function investigateSuspiciousTransactionPatterns(customerId: string, transactionPattern: string, frequencyOfOccurrence: string): {
    investigationRating: 'Low' | 'Medium' | 'High' | 'Critical';
    recommendedActions: string[];
};
/**
 * Schedule relationship review
 * @param customerId - Customer identifier
 * @param lastReviewDate - Date of last review
 * @param riskTier - Customer risk tier
 * @returns RelationshipReviewRecord
 */
export declare function scheduleRelationshipReview(customerId: string, lastReviewDate: Date, riskTier: 'Low' | 'Medium' | 'High' | 'Critical'): RelationshipReviewRecord;
/**
 * Determine relationship review frequency based on risk
 * @param currentRiskScore - Current customer risk score
 * @param complianceHistory - Customer compliance history (0-100)
 * @returns Recommended review frequency
 */
export declare function determineRelationshipReviewFrequency(currentRiskScore: EDDRiskScore, complianceHistory: number): {
    frequency: 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'Annually';
    rationale: string;
};
/**
 * Submit third-party information request
 * @param customerId - Customer identifier
 * @param requestedParty - Party from which information is requested
 * @param informationType - Type of information being requested
 * @returns ThirdPartyInfoRequest record
 */
export declare function submitThirdPartyInfoRequest(customerId: string, requestedParty: string, informationType: string): ThirdPartyInfoRequest;
/**
 * Process third-party response
 * @param requestId - Request identifier
 * @param responseContent - Response content from third party
 * @returns Processed response with validation
 */
export declare function processThirdPartyResponse(requestId: string, responseContent: string): {
    processed: boolean;
    completeness: number;
    requiresFollowup: boolean;
};
/**
 * Initiate public records research
 * @param customerId - Customer identifier
 * @param jurisdictions - Array of jurisdictions to research
 * @param recordTypes - Types of records to search
 * @returns PublicRecordsResearch record
 */
export declare function initiatePublicRecordsResearch(customerId: string, jurisdictions: string[], recordTypes: string[]): PublicRecordsResearch;
/**
 * Analyze public records findings
 * @param findings - Summary of public records findings
 * @param redFlagsCount - Number of red flags identified
 * @returns Risk adjustment and recommendations
 */
export declare function analyzePublicRecordsFindings(findings: string, redFlagsCount: number): {
    riskAdjustment: number;
    recommendations: string[];
    escalationNeeded: boolean;
};
/**
 * Analyze customer financial statements
 * @param customerId - Customer identifier
 * @param statementYear - Year of financial statement
 * @param totalAssets - Total assets from statement
 * @param totalRevenue - Total revenue from statement
 * @param netIncome - Net income from statement
 * @returns FinancialStatementAnalysis record
 */
export declare function analyzeCustomerFinancialStatements(customerId: string, statementYear: number, totalAssets: number, totalRevenue: number, netIncome: number): FinancialStatementAnalysis;
/**
 * Identify financial statement red flags
 * @param analysis - Financial statement analysis record
 * @returns Red flags and risk indicators
 */
export declare function identifyFinancialStatementRedFlags(analysis: FinancialStatementAnalysis): {
    redFlags: string[];
    riskScore: EDDRiskScore;
    requiresInvestigation: boolean;
};
/**
 * Create high-risk customer profile
 * @param customerId - Customer identifier
 * @param riskScore - Overall risk score
 * @param riskFactors - Key risk factors
 * @returns HighRiskCustomerProfile record
 */
export declare function createHighRiskCustomerProfile(customerId: string, riskScore: EDDRiskScore, riskFactors: string[]): HighRiskCustomerProfile;
/**
 * Apply enhanced controls for high-risk customers
 * @param customerProfile - High-risk customer profile
 * @returns List of applicable controls
 */
export declare function applyEnhancedControlsForHighRiskCustomers(customerProfile: HighRiskCustomerProfile): {
    applicableControls: string[];
    implementationNotes: string[];
};
/**
 * Generate EDD completion summary
 * @param eddRecordId - EDD record identifier
 * @param verificationResults - Consolidated verification results
 * @param seniorApprovalResult - Senior management approval result
 * @returns EDD completion summary
 */
export declare function generateEDDCompletionSummary(eddRecordId: EDDRecordId, verificationResults: Record<string, unknown>, seniorApprovalResult: SeniorMgmtApproval): {
    summaryId: string;
    eddRecordId: EDDRecordId;
    completionDate: Date;
    overallStatus: string;
    approvalStatus: string;
};
//# sourceMappingURL=enhanced-due-diligence-edd-kit.d.ts.map