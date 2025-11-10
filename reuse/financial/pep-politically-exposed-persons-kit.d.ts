/**
 * LOC: FINPEP1234567
 * File: /reuse/financial/pep-politically-exposed-persons-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - AML/KYC compliance controllers
 *   - Customer onboarding services
 *   - Risk assessment modules
 *   - Compliance reporting systems
 */
/**
 * File: /reuse/financial/pep-politically-exposed-persons-kit.ts
 * Locator: WC-FIN-PEP-001
 * Purpose: USACE CEFMS-Level PEP Screening - Politically Exposed Persons identification, classification, monitoring, and enhanced due diligence
 *
 * Upstream: Independent PEP compliance utility module
 * Downstream: ../backend/*, AML controllers, KYC services, Compliance modules, Risk assessment systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for PEP screening, classification, relationship mapping, due diligence, monitoring, declassification
 *
 * LLM Context: Enterprise-grade PEP (Politically Exposed Persons) screening and management system.
 * Provides comprehensive PEP identification, classification (domestic/foreign/international), family member and close associate
 * linking, position-based risk assessment, enhanced due diligence workflows, senior management approval processes,
 * ongoing monitoring, source of wealth verification, transaction monitoring, PEP status change tracking, declassification
 * procedures, international organization official screening, state-owned enterprise executive identification, and integrated
 * compliance reporting for regulatory requirements (FATF, FinCEN, EU directives).
 */
import { Sequelize, Transaction } from 'sequelize';
interface PEPProfile {
    id: string;
    entityId: string;
    personName: string;
    pepStatus: 'active' | 'inactive' | 'declassified' | 'pending-review';
    pepType: 'domestic' | 'foreign' | 'international-organization' | 'close-associate' | 'family-member';
    identificationDate: Date;
    lastReviewDate: Date;
    nextReviewDate: Date;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    requiresEDD: boolean;
    approvalStatus: 'pending' | 'approved' | 'rejected' | 'escalated';
    approvedBy?: string;
    approvalDate?: Date;
    declassificationDate?: Date;
    declassificationReason?: string;
    isActive: boolean;
}
interface PEPPosition {
    id: string;
    pepId: string;
    positionTitle: string;
    positionCategory: 'head-of-state' | 'senior-politician' | 'senior-government-official' | 'judicial-official' | 'military-official' | 'soe-executive' | 'international-org-official' | 'political-party-official' | 'diplomat' | 'central-bank-official' | 'regulatory-official';
    organization: string;
    country: string;
    jurisdiction: string;
    startDate: Date;
    endDate?: Date;
    isCurrentPosition: boolean;
    influenceLevel: 'national' | 'regional' | 'local' | 'international';
    authorityLevel: 'executive' | 'legislative' | 'judicial' | 'regulatory' | 'advisory';
    riskWeight: number;
    publicProfile: boolean;
    verificationSource: string;
    verificationDate: Date;
    lastUpdated: Date;
}
interface PEPRelationship {
    id: string;
    pepId: string;
    relatedPersonId: string;
    relatedPersonName: string;
    relationshipType: 'spouse' | 'child' | 'parent' | 'sibling' | 'close-associate' | 'business-partner' | 'beneficial-owner' | 'other-family';
    relationshipStatus: 'active' | 'inactive' | 'historical';
    identificationDate: Date;
    verificationDate: Date;
    verificationSource: string;
    riskInheritance: boolean;
    requiresEDD: boolean;
    notes?: string;
    lastReviewDate: Date;
    isActive: boolean;
}
interface PEPScreeningResult {
    id: string;
    screeningDate: Date;
    entityId: string;
    screeningType: 'onboarding' | 'periodic' | 'event-driven' | 'transaction-based';
    databasesSearched: string[];
    matchesFound: number;
    matches: PEPMatch[];
    overallRisk: 'no-match' | 'low' | 'medium' | 'high' | 'critical';
    requiresReview: boolean;
    reviewedBy?: string;
    reviewDate?: Date;
    reviewDecision?: 'accept' | 'reject' | 'escalate' | 'request-info';
    screeningDuration: number;
    falsePositiveRate: number;
}
interface PEPMatch {
    matchId: string;
    matchScore: number;
    matchConfidence: 'low' | 'medium' | 'high' | 'exact';
    matchedName: string;
    matchedDOB?: Date;
    matchedCountry?: string;
    matchedPosition?: string;
    pepType: string;
    source: string;
    sourceDatabase: string;
    adverseMedia: boolean;
    sanctionsList: boolean;
    lastUpdated: Date;
    requiresInvestigation: boolean;
}
interface PEPDatabaseSource {
    id: string;
    databaseName: string;
    provider: string;
    coverageType: 'global' | 'regional' | 'national';
    lastUpdateDate: Date;
    recordCount: number;
    jurisdictions: string[];
    dataQuality: 'high' | 'medium' | 'low';
    apiEndpoint?: string;
    isActive: boolean;
    subscriptionStatus: 'active' | 'expired' | 'trial';
}
interface EnhancedDueDiligence {
    id: string;
    pepId: string;
    entityId: string;
    initiationDate: Date;
    completionDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'escalated';
    assignedTo: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    sourceOfWealth: SourceOfWealthVerification;
    sourceOfFunds: SourceOfFundsVerification;
    businessPurpose: string;
    anticipatedActivity: string;
    documentationCollected: EDDDocument[];
    findingsAndRisks: string[];
    mitigatingFactors: string[];
    recommendation: 'approve' | 'approve-with-conditions' | 'reject' | 'ongoing-monitoring';
    approvalRequired: string[];
    approvals: Approval[];
    finalDecision?: string;
    finalDecisionDate?: Date;
    nextReviewDate?: Date;
}
interface SourceOfWealthVerification {
    verificationStatus: 'pending' | 'verified' | 'unverified' | 'insufficient';
    wealthSources: WealthSource[];
    estimatedNetWorth?: number;
    netWorthCurrency?: string;
    estimatedAnnualIncome?: number;
    documentationProvided: string[];
    verificationMethod: string;
    verifiedBy?: string;
    verificationDate?: Date;
    riskAssessment: 'low' | 'medium' | 'high';
    concerns: string[];
}
interface WealthSource {
    sourceType: 'employment' | 'business-ownership' | 'inheritance' | 'investments' | 'real-estate' | 'pension' | 'gifts' | 'other';
    description: string;
    amount?: number;
    currency?: string;
    percentage?: number;
    verificationDocuments: string[];
    verified: boolean;
}
interface SourceOfFundsVerification {
    transactionId?: string;
    fundsSources: FundsSource[];
    totalAmount: number;
    currency: string;
    documentationProvided: string[];
    verificationStatus: 'pending' | 'verified' | 'unverified' | 'insufficient';
    verifiedBy?: string;
    verificationDate?: Date;
    concerns: string[];
}
interface FundsSource {
    sourceType: 'salary' | 'business-revenue' | 'sale-of-assets' | 'loan' | 'investment-returns' | 'gift' | 'other';
    description: string;
    amount: number;
    currency: string;
    originatingAccount?: string;
    documentationRef: string[];
    verified: boolean;
}
interface EDDDocument {
    documentId: string;
    documentType: string;
    documentName: string;
    uploadDate: Date;
    uploadedBy: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    verifiedBy?: string;
    verificationDate?: Date;
    expiryDate?: Date;
    notes?: string;
}
interface Approval {
    approverRole: string;
    approverName: string;
    approvalDate: Date;
    decision: 'approved' | 'rejected' | 'conditional';
    conditions?: string[];
    comments?: string;
}
interface PEPMonitoringAlert {
    id: string;
    pepId: string;
    entityId: string;
    alertDate: Date;
    alertType: 'position-change' | 'adverse-media' | 'transaction-anomaly' | 'relationship-change' | 'jurisdiction-change' | 'risk-escalation' | 'review-overdue' | 'status-change';
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    description: string;
    details: Record<string, any>;
    source: string;
    status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'false-positive';
    assignedTo?: string;
    acknowledgedBy?: string;
    acknowledgedDate?: Date;
    resolution?: string;
    resolutionDate?: Date;
    requiresAction: boolean;
    actionTaken?: string;
}
interface PEPTransactionMonitoring {
    id: string;
    pepId: string;
    entityId: string;
    transactionId: string;
    transactionDate: Date;
    transactionType: string;
    amount: number;
    currency: string;
    counterparty?: string;
    counterpartyCountry?: string;
    riskScore: number;
    riskFactors: string[];
    thresholdExceeded: boolean;
    requiresReview: boolean;
    reviewStatus: 'pending' | 'cleared' | 'suspicious' | 'reported';
    reviewedBy?: string;
    reviewDate?: Date;
    reviewNotes?: string;
    sarFiled?: boolean;
    sarFilingDate?: Date;
}
interface PEPRiskAssessment {
    id: string;
    pepId: string;
    entityId: string;
    assessmentDate: Date;
    assessorName: string;
    riskFactors: RiskFactor[];
    overallRiskScore: number;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    mitigatingFactors: string[];
    aggravatingFactors: string[];
    recommendedActions: string[];
    enhancedMonitoringRequired: boolean;
    eddRequired: boolean;
    seniorApprovalRequired: boolean;
    transactionLimits?: TransactionLimits;
    reviewFrequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
    nextReviewDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
}
interface RiskFactor {
    factorType: 'position-level' | 'jurisdiction' | 'wealth-source' | 'transaction-pattern' | 'relationship' | 'adverse-media' | 'sanctions-proximity' | 'corruption-index';
    factorName: string;
    description: string;
    score: number;
    weight: number;
    evidenceSource: string;
}
interface TransactionLimits {
    dailyLimit?: number;
    weeklyLimit?: number;
    monthlyLimit?: number;
    perTransactionLimit?: number;
    currency: string;
    requiresApprovalAbove?: number;
    restrictedCountries?: string[];
    restrictedTransactionTypes?: string[];
}
interface PEPDeclassification {
    id: string;
    pepId: string;
    entityId: string;
    requestDate: Date;
    requestedBy: string;
    declassificationReason: 'position-ended' | 'time-elapsed' | 'risk-reassessment' | 'death' | 'other';
    positionEndDate?: Date;
    coolingOffPeriod: number;
    coolingOffEndDate: Date;
    riskReassessment: PEPRiskAssessment;
    approvalRequired: string[];
    approvals: Approval[];
    finalDecision?: 'approved' | 'rejected' | 'deferred';
    finalDecisionDate?: Date;
    decisionMaker?: string;
    postDeclassificationMonitoring: boolean;
    monitoringPeriod?: number;
    notes?: string;
}
interface StateOwnedEnterpriseExecutive {
    id: string;
    executiveId: string;
    executiveName: string;
    soeId: string;
    soeName: string;
    soeCountry: string;
    governmentOwnershipPercentage: number;
    positionTitle: string;
    boardMember: boolean;
    executiveCommittee: boolean;
    appointmentDate: Date;
    appointedBy: string;
    seniorityLevel: 'c-level' | 'senior-vp' | 'vp' | 'director' | 'board-member';
    politicalAppointment: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    pepClassification: boolean;
    lastVerificationDate: Date;
}
interface InternationalOrganizationOfficial {
    id: string;
    officialId: string;
    officialName: string;
    organizationName: string;
    organizationType: 'un-agency' | 'imf' | 'world-bank' | 'regional-bank' | 'ecb' | 'bis' | 'wto' | 'other-igo';
    positionTitle: string;
    seniorityLevel: 'director-general' | 'deputy-director' | 'senior-management' | 'management' | 'senior-official';
    appointmentDate: Date;
    termEnd?: Date;
    nationality: string;
    headquartersLocation: string;
    budgetaryAuthority: boolean;
    policyMakingRole: boolean;
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    pepClassification: boolean;
    lastVerificationDate: Date;
}
interface PEPAuditTrail {
    id: string;
    pepId: string;
    timestamp: Date;
    action: 'created' | 'updated' | 'screened' | 'risk-assessed' | 'edd-initiated' | 'approved' | 'rejected' | 'monitored' | 'declassified' | 'status-changed';
    performedBy: string;
    changes?: Record<string, {
        old: any;
        new: any;
    }>;
    reason?: string;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
interface PEPComplianceReport {
    id: string;
    reportDate: Date;
    reportPeriod: {
        start: Date;
        end: Date;
    };
    totalPEPs: number;
    pepsByType: Record<string, number>;
    pepsByRisk: Record<string, number>;
    newPEPsIdentified: number;
    declassifiedPEPs: number;
    eddCasesOpened: number;
    eddCasesClosed: number;
    alertsGenerated: number;
    alertsResolved: number;
    transactionsReviewed: number;
    suspiciousActivityReports: number;
    reviewsCompleted: number;
    overdueReviews: number;
    complianceRate: number;
    keyFindings: string[];
    recommendations: string[];
    generatedBy: string;
}
/**
 * Identifies potential PEP based on name and basic information
 */
export declare function identifyPotentialPEP(personName: string, dateOfBirth: Date | null, nationality: string, jurisdiction: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    isPotentialPEP: boolean;
    confidence: 'low' | 'medium' | 'high';
    matches: PEPMatch[];
    recommendedAction: string;
}>;
/**
 * Classifies PEP type based on position and jurisdiction
 */
export declare function classifyPEPType(position: PEPPosition, personNationality: string, businessJurisdiction: string): 'domestic' | 'foreign' | 'international-organization';
/**
 * Determines if a position qualifies as PEP
 */
export declare function isPositionPEPQualifying(positionTitle: string, positionCategory: string, seniorityLevel: string, budgetaryAuthority: boolean, influenceLevel: string): boolean;
/**
 * Creates a new PEP profile
 */
export declare function createPEPProfile(profile: Omit<PEPProfile, 'id'>, sequelize: Sequelize, transaction?: Transaction): Promise<PEPProfile>;
/**
 * Updates PEP classification based on new information
 */
export declare function updatePEPClassification(pepId: string, newClassification: PEPProfile['pepType'], riskRating: PEPProfile['riskRating'], reason: string, updatedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Calculates PEP risk rating based on multiple factors
 */
export declare function calculatePEPRiskRating(pepType: PEPProfile['pepType'], positions: PEPPosition[], jurisdiction: string, sourceOfWealthRisk: 'low' | 'medium' | 'high', adverseMedia: boolean, relationshipCount: number): 'low' | 'medium' | 'high' | 'critical';
/**
 * Links family member to PEP
 */
export declare function linkFamilyMemberToPEP(pepId: string, familyMemberData: {
    relatedPersonId: string;
    relatedPersonName: string;
    relationshipType: PEPRelationship['relationshipType'];
    verificationSource: string;
}, sequelize: Sequelize, transaction?: Transaction): Promise<PEPRelationship>;
/**
 * Identifies close associates based on business relationships
 */
export declare function identifyCloseAssociates(pepId: string, entityId: string, lookbackPeriodMonths: number, sequelize: Sequelize, transaction?: Transaction): Promise<PEPRelationship[]>;
/**
 * Determines if relationship type should inherit PEP risk
 */
export declare function shouldInheritPEPRisk(relationshipType: PEPRelationship['relationshipType']): boolean;
/**
 * Determines if relationship requires enhanced due diligence
 */
export declare function shouldRequireEDD(relationshipType: PEPRelationship['relationshipType']): boolean;
/**
 * Maps relationship network for PEP
 */
export declare function mapPEPRelationshipNetwork(pepId: string, maxDegrees: number, sequelize: Sequelize, transaction?: Transaction): Promise<{
    nodes: Array<{
        id: string;
        name: string;
        type: string;
        risk: string;
    }>;
    edges: Array<{
        from: string;
        to: string;
        relationshipType: string;
    }>;
    totalRelationships: number;
    highRiskRelationships: number;
}>;
/**
 * Updates relationship status (e.g., divorce, business dissolution)
 */
export declare function updateRelationshipStatus(relationshipId: string, newStatus: PEPRelationship['relationshipStatus'], effectiveDate: Date, reason: string, updatedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Performs comprehensive PEP database screening
 */
export declare function performPEPDatabaseScreening(entityData: {
    entityId: string;
    name: string;
    dateOfBirth?: Date;
    nationality?: string;
    identificationNumber?: string;
}, screeningType: PEPScreeningResult['screeningType'], sequelize: Sequelize, transaction?: Transaction): Promise<PEPScreeningResult>;
/**
 * Validates screening match against false positives
 */
export declare function validateScreeningMatch(matchId: string, entityData: any, additionalVerificationData: Record<string, any>, reviewedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    isValidMatch: boolean;
    confidence: 'low' | 'medium' | 'high';
    reasoning: string[];
    recommendedAction: string;
}>;
/**
 * Configures and manages PEP database sources
 */
export declare function configurePEPDatabase(databaseConfig: Omit<PEPDatabaseSource, 'id'>, sequelize: Sequelize, transaction?: Transaction): Promise<PEPDatabaseSource>;
/**
 * Performs batch screening of multiple entities
 */
export declare function batchScreenEntities(entities: Array<{
    entityId: string;
    name: string;
    dateOfBirth?: Date;
    nationality?: string;
}>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    totalScreened: number;
    matchesFound: number;
    results: PEPScreeningResult[];
    processingTime: number;
}>;
/**
 * Assesses risk level of a PEP position
 */
export declare function assessPositionRisk(position: PEPPosition): {
    riskWeight: number;
    riskFactors: string[];
    requiresEDD: boolean;
    requiresSeniorApproval: boolean;
};
/**
 * Adds position to PEP profile
 */
export declare function addPEPPosition(pepId: string, position: Omit<PEPPosition, 'id'>, sequelize: Sequelize, transaction?: Transaction): Promise<PEPPosition>;
/**
 * Updates position end date when PEP leaves office
 */
export declare function endPEPPosition(positionId: string, pepId: string, endDate: Date, reason: string, updatedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Calculates position tenure duration
 */
export declare function calculatePositionTenure(startDate: Date, endDate?: Date): {
    totalMonths: number;
    totalYears: number;
    isActive: boolean;
    formattedDuration: string;
};
/**
 * Initiates enhanced due diligence process
 */
export declare function initiateEnhancedDueDiligence(pepId: string, entityId: string, priority: EnhancedDueDiligence['priority'], assignedTo: string, dueInDays: number, sequelize: Sequelize, transaction?: Transaction): Promise<EnhancedDueDiligence>;
/**
 * Adds source of wealth information to EDD
 */
export declare function addSourceOfWealth(eddId: string, wealthSource: WealthSource, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Verifies source of wealth documentation
 */
export declare function verifySourceOfWealth(eddId: string, wealthSources: WealthSource[], verifiedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    verificationStatus: 'verified' | 'unverified' | 'insufficient';
    riskAssessment: 'low' | 'medium' | 'high';
    concerns: string[];
    recommendations: string[];
}>;
/**
 * Adds source of funds for specific transaction
 */
export declare function addSourceOfFunds(eddId: string, fundsSource: FundsSource, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Uploads EDD documentation
 */
export declare function uploadEDDDocument(eddId: string, document: Omit<EDDDocument, 'documentId' | 'uploadDate' | 'verificationStatus'>, sequelize: Sequelize, transaction?: Transaction): Promise<EDDDocument>;
/**
 * Completes EDD process with recommendation
 */
export declare function completeEDD(eddId: string, recommendation: EnhancedDueDiligence['recommendation'], findings: string[], mitigatingFactors: string[], completedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Submits PEP for senior management approval
 */
export declare function submitForSeniorApproval(pepId: string, entityId: string, eddId: string, submittedBy: string, approvalRequired: string[], sequelize: Sequelize, transaction?: Transaction): Promise<{
    approvalWorkflowId: string;
    approvers: string[];
    deadline: Date;
    currentStatus: string;
}>;
/**
 * Records approval decision
 */
export declare function recordApprovalDecision(eddId: string, pepId: string, approval: Approval, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Checks if all required approvals are obtained
 */
export declare function checkApprovalStatus(requiredApprovers: string[], approvals: Approval[]): {
    isFullyApproved: boolean;
    pendingApprovers: string[];
    approvedBy: string[];
    rejectedBy: string[];
    conditionalApprovals: number;
};
/**
 * Escalates approval to higher authority
 */
export declare function escalateApproval(pepId: string, eddId: string, currentApprovers: string[], escalationReason: string, escalatedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<string[]>;
/**
 * Schedules periodic PEP reviews
 */
export declare function schedulePEPReview(pepId: string, reviewFrequency: PEPRiskAssessment['reviewFrequency'], lastReviewDate: Date, sequelize: Sequelize, transaction?: Transaction): Promise<Date>;
/**
 * Performs periodic PEP review
 */
export declare function performPeriodicPEPReview(pepId: string, reviewedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    reviewDate: Date;
    statusChanged: boolean;
    riskRatingChanged: boolean;
    findingsAndActions: string[];
    nextReviewDate: Date;
}>;
/**
 * Monitors PEP for status changes
 */
export declare function monitorPEPStatusChanges(pepId: string, sequelize: Sequelize, transaction?: Transaction): Promise<PEPMonitoringAlert[]>;
/**
 * Creates monitoring alert for PEP
 */
export declare function createPEPAlert(pepId: string, entityId: string, alertData: Omit<PEPMonitoringAlert, 'id' | 'alertDate' | 'status'>, sequelize: Sequelize, transaction?: Transaction): Promise<PEPMonitoringAlert>;
/**
 * Acknowledges and processes alert
 */
export declare function acknowledgeAlert(alertId: string, acknowledgedBy: string, assignedTo: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Resolves monitoring alert
 */
export declare function resolveAlert(alertId: string, resolution: string, actionTaken: string, resolvedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Monitors transaction for PEP-related risks
 */
export declare function monitorPEPTransaction(transactionData: {
    transactionId: string;
    pepId: string;
    entityId: string;
    transactionDate: Date;
    transactionType: string;
    amount: number;
    currency: string;
    counterparty?: string;
    counterpartyCountry?: string;
}, pepRiskRating: 'low' | 'medium' | 'high' | 'critical', sequelize: Sequelize, transaction?: Transaction): Promise<PEPTransactionMonitoring>;
/**
 * Reviews flagged PEP transaction
 */
export declare function reviewPEPTransaction(monitoringId: string, reviewedBy: string, decision: 'cleared' | 'suspicious' | 'reported', notes: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Files Suspicious Activity Report for PEP transaction
 */
export declare function fileSARForPEPTransaction(monitoringId: string, pepId: string, transactionId: string, filedBy: string, suspiciousActivity: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    sarId: string;
    filingDate: Date;
    status: string;
}>;
/**
 * Initiates PEP declassification process
 */
export declare function initiatePEPDeclassification(pepId: string, entityId: string, reason: PEPDeclassification['declassificationReason'], positionEndDate: Date | undefined, requestedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<PEPDeclassification>;
/**
 * Checks if cooling-off period has elapsed
 */
export declare function isCoolingOffPeriodComplete(positionEndDate: Date, coolingOffMonths: number): {
    isComplete: boolean;
    endDate: Date;
    monthsRemaining: number;
};
/**
 * Performs risk reassessment for declassification
 */
export declare function performDeclassificationRiskAssessment(pepId: string, entityId: string, assessorName: string, sequelize: Sequelize, transaction?: Transaction): Promise<PEPRiskAssessment>;
/**
 * Approves or rejects declassification
 */
export declare function decideDeclassification(declassificationId: string, pepId: string, decision: 'approved' | 'rejected' | 'deferred', decisionMaker: string, reasoning: string, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Identifies if entity is a state-owned enterprise
 */
export declare function isStateOwnedEnterprise(governmentOwnershipPercentage: number, threshold?: number): boolean;
/**
 * Registers SOE executive as PEP
 */
export declare function registerSOEExecutive(executiveData: Omit<StateOwnedEnterpriseExecutive, 'id' | 'lastVerificationDate'>, sequelize: Sequelize, transaction?: Transaction): Promise<StateOwnedEnterpriseExecutive>;
/**
 * Assesses SOE executive PEP risk
 */
export declare function assessSOEExecutiveRisk(executive: StateOwnedEnterpriseExecutive): 'low' | 'medium' | 'high' | 'critical';
/**
 * Registers international organization official
 */
export declare function registerInternationalOrgOfficial(officialData: Omit<InternationalOrganizationOfficial, 'id' | 'lastVerificationDate'>, sequelize: Sequelize, transaction?: Transaction): Promise<InternationalOrganizationOfficial>;
/**
 * Assesses international organization official risk
 */
export declare function assessInternationalOfficialRisk(official: InternationalOrganizationOfficial): 'low' | 'medium' | 'high' | 'critical';
/**
 * Generates comprehensive PEP compliance report
 */
export declare function generatePEPComplianceReport(reportPeriod: {
    start: Date;
    end: Date;
}, generatedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<PEPComplianceReport>;
/**
 * Exports PEP data for regulatory reporting
 */
export declare function exportPEPDataForRegulatory(format: 'xml' | 'json' | 'csv', includeRelationships: boolean, includeTransactions: boolean, sequelize: Sequelize, transaction?: Transaction): Promise<{
    exportId: string;
    format: string;
    recordCount: number;
    exportDate: Date;
    fileSize: number;
    downloadUrl: string;
}>;
/**
 * Logs PEP-related actions for audit trail
 */
export declare function logPEPAction(pepId: string, action: PEPAuditTrail['action'], performedBy: string, changes?: Record<string, {
    old: any;
    new: any;
}>, reason?: string, sequelize?: Sequelize, transaction?: Transaction): Promise<PEPAuditTrail>;
/**
 * Retrieves audit trail for PEP
 */
export declare function getPEPAuditTrail(pepId: string, startDate?: Date, endDate?: Date, sequelize?: Sequelize, transaction?: Transaction): Promise<PEPAuditTrail[]>;
/**
 * Validates PEP data integrity
 */
export declare function validatePEPDataIntegrity(pepId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}>;
export {};
//# sourceMappingURL=pep-politically-exposed-persons-kit.d.ts.map