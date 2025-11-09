/**
 * LOC: INS-FRAUD-001
 * File: /reuse/insurance/fraud-detection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance claims processing services
 *   - Special Investigation Unit (SIU) modules
 *   - Anti-fraud detection systems
 *   - Claims adjudication workflows
 */
/**
 * File: /reuse/insurance/fraud-detection-kit.ts
 * Locator: WC-UTL-INSFRAUD-001
 * Purpose: Insurance Fraud Detection & Investigation Kit - Comprehensive fraud detection and prevention utilities
 *
 * Upstream: Independent utility module for insurance fraud detection operations
 * Downstream: ../backend/*, Insurance services, Claims processors, SIU tools, Investigation management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, ML fraud models
 * Exports: 40 utility functions for claims fraud detection, application fraud, social network analysis, anomaly detection, SIU case management, fraud scoring, investigation workflows
 *
 * LLM Context: Production-ready insurance fraud detection utilities for White Cross healthcare platform.
 * Provides comprehensive fraud detection including claims pattern recognition, application fraud screening,
 * social network analysis for fraud rings, anomaly detection algorithms, red flag identification and scoring,
 * SIU case management, fraud referral workflows, provider fraud detection, staged accident detection,
 * exaggerated claims identification, identity verification, investigation documentation, fraud recovery tracking,
 * anti-fraud analytics, and external fraud database integration (NICB, ISO). Essential for protecting against
 * healthcare insurance fraud while maintaining HIPAA compliance and ensuring legitimate claims are processed.
 */
import { Sequelize } from 'sequelize';
/**
 * Fraud detection confidence level
 */
export type FraudConfidenceLevel = 'low' | 'medium' | 'high' | 'critical';
/**
 * Fraud type classification
 */
export type FraudType = 'claims_fraud' | 'application_fraud' | 'provider_fraud' | 'identity_fraud' | 'staged_accident' | 'exaggerated_claim' | 'billing_fraud' | 'kickback_scheme' | 'phantom_billing' | 'upcoding' | 'unbundling' | 'duplicate_claim' | 'false_diagnosis' | 'unnecessary_treatment';
/**
 * Investigation status
 */
export type InvestigationStatus = 'pending' | 'in_progress' | 'under_review' | 'escalated' | 'closed_confirmed' | 'closed_unconfirmed' | 'closed_insufficient_evidence';
/**
 * Fraud detection result
 */
export interface FraudDetectionResult {
    claimId: string;
    fraudScore: number;
    confidenceLevel: FraudConfidenceLevel;
    fraudTypes: FraudType[];
    redFlags: RedFlag[];
    recommendedAction: 'approve' | 'review' | 'investigate' | 'deny';
    reasoning: string;
    detectedAt: Date;
}
/**
 * Red flag indicator
 */
export interface RedFlag {
    code: string;
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence: any;
    weight: number;
    wcagReference?: string;
}
/**
 * Claims fraud pattern
 */
export interface ClaimsFraudPattern {
    patternId: string;
    patternType: string;
    description: string;
    indicators: string[];
    matchScore: number;
    historicalAccuracy: number;
    examples: any[];
}
/**
 * Social network node
 */
export interface SocialNetworkNode {
    id: string;
    type: 'claimant' | 'provider' | 'witness' | 'attorney' | 'employer';
    name: string;
    connections: string[];
    suspicionScore: number;
    metadata: Record<string, any>;
}
/**
 * Fraud ring detection result
 */
export interface FraudRingResult {
    ringId: string;
    members: SocialNetworkNode[];
    connectionStrength: number;
    suspiciousPatterns: string[];
    estimatedLoss: number;
    timeframe: {
        start: Date;
        end: Date;
    };
    confidence: number;
}
/**
 * Anomaly detection result
 */
export interface AnomalyDetectionResult {
    anomalyType: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    deviationScore: number;
    expectedValue: any;
    actualValue: any;
    statisticalSignificance: number;
}
/**
 * SIU case
 */
export interface SIUCase {
    caseId: string;
    claimId: string;
    status: InvestigationStatus;
    assignedTo?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    fraudTypes: FraudType[];
    estimatedLoss: number;
    openedAt: Date;
    closedAt?: Date;
    findings?: string;
    outcome?: 'fraud_confirmed' | 'no_fraud' | 'inconclusive';
}
/**
 * Fraud referral
 */
export interface FraudReferral {
    referralId: string;
    claimId: string;
    referredBy: string;
    referredTo: 'siu' | 'law_enforcement' | 'regulatory' | 'external_investigator';
    reason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
}
/**
 * Provider fraud indicators
 */
export interface ProviderFraudIndicators {
    providerId: string;
    providerName: string;
    indicators: {
        billingAnomalies: number;
        patternDeviations: number;
        complaintCount: number;
        licensureIssues: number;
        networkConnections: number;
    };
    overallRiskScore: number;
    recommendedAction: string;
}
/**
 * Identity verification result
 */
export interface IdentityVerificationResult {
    verified: boolean;
    confidence: number;
    checks: {
        documentVerification: boolean;
        biometricMatch: boolean;
        addressVerification: boolean;
        ssnValidation: boolean;
        databaseCrossCheck: boolean;
    };
    discrepancies: string[];
    riskLevel: 'low' | 'medium' | 'high';
}
/**
 * Fraud recovery tracking
 */
export interface FraudRecovery {
    recoveryId: string;
    caseId: string;
    fraudAmount: number;
    recoveredAmount: number;
    recoveryMethod: 'restitution' | 'subrogation' | 'offset' | 'legal_settlement';
    status: 'pending' | 'in_progress' | 'completed' | 'written_off';
    milestones: Array<{
        date: Date;
        action: string;
        amount: number;
    }>;
}
/**
 * External fraud database query
 */
export interface ExternalFraudQuery {
    database: 'NICB' | 'ISO' | 'NMVTIS' | 'LexisNexis' | 'Custom';
    queryType: string;
    parameters: Record<string, any>;
    results: any[];
    queryDate: Date;
}
/**
 * Fraud analytics report
 */
export interface FraudAnalyticsReport {
    period: {
        start: Date;
        end: Date;
    };
    totalCasesDetected: number;
    totalAmountAtRisk: number;
    totalRecovered: number;
    detectionRate: number;
    falsePositiveRate: number;
    fraudTypeBreakdown: Record<FraudType, number>;
    topPatterns: ClaimsFraudPattern[];
    trends: Array<{
        date: Date;
        count: number;
        amount: number;
    }>;
}
/**
 * Fraud investigation model attributes
 */
export interface FraudInvestigationAttributes {
    id: string;
    caseId: string;
    claimId: string;
    status: InvestigationStatus;
    fraudScore: number;
    fraudTypes: FraudType[];
    assignedTo?: string;
    priority: string;
    redFlags: any;
    estimatedLoss: number;
    openedAt: Date;
    closedAt?: Date;
    findings?: string;
    outcome?: string;
    recoveredAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates FraudInvestigation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FraudInvestigationAttributes>>} FraudInvestigation model
 *
 * @example
 * ```typescript
 * const InvestigationModel = createFraudInvestigationModel(sequelize);
 * const investigation = await InvestigationModel.create({
 *   caseId: 'CASE-123',
 *   claimId: 'CLM-456',
 *   status: 'in_progress',
 *   fraudScore: 85.5,
 *   fraudTypes: ['exaggerated_claim']
 * });
 * ```
 */
export declare const createFraudInvestigationModel: (sequelize: Sequelize) => any;
/**
 * Fraud detection log model attributes
 */
export interface FraudDetectionLogAttributes {
    id: string;
    claimId: string;
    detectionMethod: string;
    fraudScore: number;
    confidenceLevel: string;
    fraudTypes: string[];
    redFlagCount: number;
    detectedAt: Date;
    actionTaken: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates FraudDetectionLog model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FraudDetectionLogAttributes>>} FraudDetectionLog model
 *
 * @example
 * ```typescript
 * const LogModel = createFraudDetectionLogModel(sequelize);
 * const log = await LogModel.create({
 *   claimId: 'CLM-456',
 *   detectionMethod: 'pattern_analysis',
 *   fraudScore: 75.5,
 *   confidenceLevel: 'high'
 * });
 * ```
 */
export declare const createFraudDetectionLogModel: (sequelize: Sequelize) => any;
/**
 * 1. Analyzes claim for fraud patterns.
 *
 * @param {string} claimId - Claim identifier
 * @param {any} claimData - Claim data object
 * @returns {Promise<FraudDetectionResult>} Fraud detection result
 *
 * @example
 * ```typescript
 * const result = await analyzeClaimForFraud('CLM-123', claimData);
 * if (result.fraudScore > 70) {
 *   console.log('High fraud risk detected');
 * }
 * ```
 */
export declare const analyzeClaimForFraud: (claimId: string, claimData: any) => Promise<FraudDetectionResult>;
/**
 * 2. Detects suspicious claim patterns.
 *
 * @param {any[]} claims - Array of claims to analyze
 * @returns {Promise<ClaimsFraudPattern[]>} Detected fraud patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectSuspiciousPatterns(recentClaims);
 * console.log(`Found ${patterns.length} suspicious patterns`);
 * ```
 */
export declare const detectSuspiciousPatterns: (claims: any[]) => Promise<ClaimsFraudPattern[]>;
/**
 * 3. Identifies red flags in claim.
 *
 * @param {any} claimData - Claim data
 * @returns {RedFlag[]} Array of red flags
 *
 * @example
 * ```typescript
 * const flags = identifyRedFlags(claimData);
 * const critical = flags.filter(f => f.severity === 'critical');
 * ```
 */
export declare const identifyRedFlags: (claimData: any) => RedFlag[];
/**
 * 4. Calculates fraud risk score.
 *
 * @param {RedFlag[]} redFlags - Array of red flags
 * @param {any} claimContext - Additional claim context
 * @returns {number} Fraud risk score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateFraudScore(redFlags, claimContext);
 * if (score > 80) {
 *   await escalateToSIU(claimId);
 * }
 * ```
 */
export declare const calculateFraudScore: (redFlags: RedFlag[], claimContext: any) => number;
/**
 * 5. Compares claim against historical fraud cases.
 *
 * @param {any} claimData - Claim data
 * @param {any[]} historicalCases - Historical fraud cases
 * @returns {Promise<{ similarCases: any[]; matchScore: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareToHistoricalFraud(claim, historicalDatabase);
 * if (comparison.matchScore > 0.8) {
 *   console.log('High similarity to known fraud cases');
 * }
 * ```
 */
export declare const compareToHistoricalFraud: (claimData: any, historicalCases: any[]) => Promise<{
    similarCases: any[];
    matchScore: number;
}>;
/**
 * 6. Screens insurance application for fraud.
 *
 * @param {any} applicationData - Application data
 * @returns {Promise<FraudDetectionResult>} Application fraud result
 *
 * @example
 * ```typescript
 * const result = await screenApplicationFraud(application);
 * if (result.recommendedAction === 'deny') {
 *   await rejectApplication(applicationId);
 * }
 * ```
 */
export declare const screenApplicationFraud: (applicationData: any) => Promise<FraudDetectionResult>;
/**
 * 7. Validates applicant information consistency.
 *
 * @param {any} applicationData - Application data
 * @returns {Array<{ field: string; issue: string; severity: string }>} Validation issues
 *
 * @example
 * ```typescript
 * const issues = validateApplicantInformation(application);
 * const critical = issues.filter(i => i.severity === 'critical');
 * ```
 */
export declare const validateApplicantInformation: (applicationData: any) => Array<{
    field: string;
    issue: string;
    severity: string;
}>;
/**
 * 8. Detects pre-existing condition concealment.
 *
 * @param {any} applicationData - Application data
 * @param {any} medicalRecords - Medical records
 * @returns {Promise<{ detected: boolean; conditions: string[]; confidence: number }>} Detection result
 *
 * @example
 * ```typescript
 * const result = await detectPreExistingConcealment(app, records);
 * if (result.detected) {
 *   console.log('Concealed conditions:', result.conditions);
 * }
 * ```
 */
export declare const detectPreExistingConcealment: (applicationData: any, medicalRecords: any) => Promise<{
    detected: boolean;
    conditions: string[];
    confidence: number;
}>;
/**
 * 9. Validates medical history accuracy.
 *
 * @param {any} applicationData - Application data
 * @param {any} externalData - External medical data sources
 * @returns {Promise<{ accurate: boolean; discrepancies: any[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMedicalHistory(app, externalSources);
 * if (!validation.accurate) {
 *   await flagForReview(applicationId);
 * }
 * ```
 */
export declare const validateMedicalHistory: (applicationData: any, externalData: any) => Promise<{
    accurate: boolean;
    discrepancies: any[];
}>;
/**
 * 10. Detects ghost applicants (fake identities).
 *
 * @param {any} applicationData - Application data
 * @returns {Promise<{ isGhost: boolean; confidence: number; reasons: string[] }>} Ghost detection result
 *
 * @example
 * ```typescript
 * const result = await detectGhostApplicant(application);
 * if (result.isGhost && result.confidence > 0.8) {
 *   await denyApplication(applicationId);
 * }
 * ```
 */
export declare const detectGhostApplicant: (applicationData: any) => Promise<{
    isGhost: boolean;
    confidence: number;
    reasons: string[];
}>;
/**
 * 11. Builds social network graph from claims data.
 *
 * @param {any[]} claims - Claims data
 * @returns {Promise<SocialNetworkNode[]>} Network graph nodes
 *
 * @example
 * ```typescript
 * const network = await buildSocialNetworkGraph(allClaims);
 * console.log(`Network has ${network.length} nodes`);
 * ```
 */
export declare const buildSocialNetworkGraph: (claims: any[]) => Promise<SocialNetworkNode[]>;
/**
 * 12. Detects potential fraud rings.
 *
 * @param {SocialNetworkNode[]} network - Social network graph
 * @returns {Promise<FraudRingResult[]>} Detected fraud rings
 *
 * @example
 * ```typescript
 * const rings = await detectFraudRings(socialNetwork);
 * for (const ring of rings) {
 *   console.log(`Ring ${ring.ringId}: ${ring.members.length} members`);
 * }
 * ```
 */
export declare const detectFraudRings: (network: SocialNetworkNode[]) => Promise<FraudRingResult[]>;
/**
 * 13. Analyzes connection patterns between entities.
 *
 * @param {string} entityId - Entity identifier
 * @param {SocialNetworkNode[]} network - Network graph
 * @returns {Object} Connection analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeConnectionPatterns('CLAIMANT-123', network);
 * console.log('Suspicious connections:', analysis.suspiciousCount);
 * ```
 */
export declare const analyzeConnectionPatterns: (entityId: string, network: SocialNetworkNode[]) => {
    totalConnections: number;
    suspiciousCount: number;
    clusters: string[];
};
/**
 * 14. Identifies shared addresses among claimants.
 *
 * @param {any[]} claimants - Array of claimants
 * @returns {Array<{ address: string; claimants: string[]; riskScore: number }>} Shared address analysis
 *
 * @example
 * ```typescript
 * const sharedAddresses = identifySharedAddresses(claimants);
 * const suspicious = sharedAddresses.filter(a => a.claimants.length > 3);
 * ```
 */
export declare const identifySharedAddresses: (claimants: any[]) => Array<{
    address: string;
    claimants: string[];
    riskScore: number;
}>;
/**
 * 15. Detects collusion between claimants and providers.
 *
 * @param {any[]} claims - Claims data
 * @returns {Promise<Array<{ claimantId: string; providerId: string; suspicionScore: number }>>} Collusion detection
 *
 * @example
 * ```typescript
 * const collusion = await detectCollusionPatterns(claims);
 * for (const case of collusion) {
 *   if (case.suspicionScore > 80) {
 *     await createSIUCase(case);
 *   }
 * }
 * ```
 */
export declare const detectCollusionPatterns: (claims: any[]) => Promise<Array<{
    claimantId: string;
    providerId: string;
    suspicionScore: number;
}>>;
/**
 * 16. Detects statistical anomalies in claims.
 *
 * @param {any} claimData - Claim data
 * @param {any} historicalData - Historical claims data
 * @returns {Promise<AnomalyDetectionResult[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectStatisticalAnomalies(claim, historical);
 * const significant = anomalies.filter(a => a.severity === 'high');
 * ```
 */
export declare const detectStatisticalAnomalies: (claimData: any, historicalData: any) => Promise<AnomalyDetectionResult[]>;
/**
 * 17. Analyzes billing code anomalies.
 *
 * @param {any[]} billingCodes - Billing codes
 * @param {any} providerProfile - Provider profile
 * @returns {Promise<AnomalyDetectionResult[]>} Billing anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await analyzeBillingCodeAnomalies(codes, provider);
 * console.log(`Found ${anomalies.length} billing anomalies`);
 * ```
 */
export declare const analyzeBillingCodeAnomalies: (billingCodes: any[], providerProfile: any) => Promise<AnomalyDetectionResult[]>;
/**
 * 18. Detects unusual claim timing patterns.
 *
 * @param {any[]} claims - Claims data
 * @returns {Array<{ pattern: string; occurrences: number; suspicionLevel: number }>} Timing anomalies
 *
 * @example
 * ```typescript
 * const timingAnomalies = detectTimingAnomalies(claims);
 * const suspicious = timingAnomalies.filter(t => t.suspicionLevel > 70);
 * ```
 */
export declare const detectTimingAnomalies: (claims: any[]) => Array<{
    pattern: string;
    occurrences: number;
    suspicionLevel: number;
}>;
/**
 * 19. Identifies outlier claim amounts.
 *
 * @param {number} claimAmount - Claim amount
 * @param {any} categoryData - Category historical data
 * @returns {Object} Outlier analysis
 *
 * @example
 * ```typescript
 * const analysis = identifyOutlierAmounts(claimAmount, categoryHistory);
 * if (analysis.isOutlier) {
 *   console.log('Claim amount is', analysis.deviationPercent, '% above normal');
 * }
 * ```
 */
export declare const identifyOutlierAmounts: (claimAmount: number, categoryData: any) => {
    isOutlier: boolean;
    deviationPercent: number;
    threshold: number;
};
/**
 * 20. Detects velocity patterns (frequency anomalies).
 *
 * @param {string} entityId - Entity identifier
 * @param {any[]} events - Event history
 * @param {number} timeWindow - Time window in days
 * @returns {Object} Velocity analysis
 *
 * @example
 * ```typescript
 * const velocity = detectVelocityPatterns('CLAIMANT-123', claims, 30);
 * if (velocity.anomaly) {
 *   console.log('Unusual claim frequency detected');
 * }
 * ```
 */
export declare const detectVelocityPatterns: (entityId: string, events: any[], timeWindow: number) => {
    eventCount: number;
    averageInterval: number;
    anomaly: boolean;
};
/**
 * 21. Creates SIU investigation case.
 *
 * @param {FraudDetectionResult} fraudResult - Fraud detection result
 * @param {any} claimData - Claim data
 * @returns {Promise<SIUCase>} Created SIU case
 *
 * @example
 * ```typescript
 * const siuCase = await createSIUCase(fraudResult, claim);
 * console.log('SIU case created:', siuCase.caseId);
 * ```
 */
export declare const createSIUCase: (fraudResult: FraudDetectionResult, claimData: any) => Promise<SIUCase>;
/**
 * 22. Assigns SIU case to investigator.
 *
 * @param {string} caseId - Case identifier
 * @param {string} investigatorId - Investigator user ID
 * @returns {Promise<SIUCase>} Updated case
 *
 * @example
 * ```typescript
 * const updated = await assignSIUCase('SIU-123', 'USER-456');
 * ```
 */
export declare const assignSIUCase: (caseId: string, investigatorId: string) => Promise<SIUCase>;
/**
 * 23. Updates SIU case status.
 *
 * @param {string} caseId - Case identifier
 * @param {InvestigationStatus} status - New status
 * @param {string} [notes] - Status update notes
 * @returns {Promise<SIUCase>} Updated case
 *
 * @example
 * ```typescript
 * await updateSIUCaseStatus('SIU-123', 'in_progress', 'Investigation started');
 * ```
 */
export declare const updateSIUCaseStatus: (caseId: string, status: InvestigationStatus, notes?: string) => Promise<SIUCase>;
/**
 * 24. Closes SIU investigation case.
 *
 * @param {string} caseId - Case identifier
 * @param {string} outcome - Investigation outcome
 * @param {string} findings - Investigation findings
 * @returns {Promise<SIUCase>} Closed case
 *
 * @example
 * ```typescript
 * const closed = await closeSIUCase('SIU-123', 'fraud_confirmed', 'Evidence of staged accident');
 * ```
 */
export declare const closeSIUCase: (caseId: string, outcome: string, findings: string) => Promise<SIUCase>;
/**
 * 25. Retrieves SIU case workload by investigator.
 *
 * @param {string} investigatorId - Investigator user ID
 * @returns {Promise<Array<{ caseId: string; priority: string; daysOpen: number }>>} Case workload
 *
 * @example
 * ```typescript
 * const workload = await getSIUCaseWorkload('USER-456');
 * console.log(`Investigator has ${workload.length} active cases`);
 * ```
 */
export declare const getSIUCaseWorkload: (investigatorId: string) => Promise<Array<{
    caseId: string;
    priority: string;
    daysOpen: number;
}>>;
/**
 * 26. Creates fraud referral.
 *
 * @param {string} claimId - Claim identifier
 * @param {any} referralData - Referral details
 * @returns {Promise<FraudReferral>} Created referral
 *
 * @example
 * ```typescript
 * const referral = await createFraudReferral('CLM-123', {
 *   referredTo: 'law_enforcement',
 *   reason: 'Suspected organized fraud ring'
 * });
 * ```
 */
export declare const createFraudReferral: (claimId: string, referralData: any) => Promise<FraudReferral>;
/**
 * 27. Submits referral to external agency.
 *
 * @param {string} referralId - Referral identifier
 * @param {any} submissionData - Submission details
 * @returns {Promise<{ submitted: boolean; confirmationNumber: string }>} Submission result
 *
 * @example
 * ```typescript
 * const result = await submitExternalReferral('REF-123', submissionData);
 * console.log('Confirmation:', result.confirmationNumber);
 * ```
 */
export declare const submitExternalReferral: (referralId: string, submissionData: any) => Promise<{
    submitted: boolean;
    confirmationNumber: string;
}>;
/**
 * 28. Tracks referral status updates.
 *
 * @param {string} referralId - Referral identifier
 * @returns {Promise<Array<{ date: Date; status: string; notes: string }>>} Status history
 *
 * @example
 * ```typescript
 * const history = await trackReferralStatus('REF-123');
 * console.log('Latest status:', history[history.length - 1]);
 * ```
 */
export declare const trackReferralStatus: (referralId: string) => Promise<Array<{
    date: Date;
    status: string;
    notes: string;
}>>;
/**
 * 29. Generates referral documentation package.
 *
 * @param {string} referralId - Referral identifier
 * @returns {Promise<Buffer>} PDF documentation package
 *
 * @example
 * ```typescript
 * const docPackage = await generateReferralDocumentation('REF-123');
 * await saveFile(docPackage, 'referral-123.pdf');
 * ```
 */
export declare const generateReferralDocumentation: (referralId: string) => Promise<Buffer>;
/**
 * 30. Notifies stakeholders of referral status.
 *
 * @param {string} referralId - Referral identifier
 * @param {string[]} recipients - Recipient user IDs
 * @param {string} message - Notification message
 * @returns {Promise<{ sent: boolean; recipientCount: number }>} Notification result
 *
 * @example
 * ```typescript
 * await notifyReferralStakeholders('REF-123', ['USER-1', 'USER-2'], 'Referral accepted');
 * ```
 */
export declare const notifyReferralStakeholders: (referralId: string, recipients: string[], message: string) => Promise<{
    sent: boolean;
    recipientCount: number;
}>;
/**
 * 31. Analyzes provider fraud indicators.
 *
 * @param {string} providerId - Provider identifier
 * @param {any} providerData - Provider data
 * @returns {Promise<ProviderFraudIndicators>} Provider fraud analysis
 *
 * @example
 * ```typescript
 * const indicators = await analyzeProviderFraud('PROV-123', providerData);
 * if (indicators.overallRiskScore > 75) {
 *   await flagProviderForReview(providerId);
 * }
 * ```
 */
export declare const analyzeProviderFraud: (providerId: string, providerData: any) => Promise<ProviderFraudIndicators>;
/**
 * 32. Detects upcoding and unbundling schemes.
 *
 * @param {any[]} billingRecords - Billing records
 * @returns {Promise<Array<{ type: 'upcoding' | 'unbundling'; confidence: number; evidence: any }>>} Detection results
 *
 * @example
 * ```typescript
 * const schemes = await detectUpcodingUnbundling(providerBilling);
 * for (const scheme of schemes) {
 *   console.log(`${scheme.type} detected with ${scheme.confidence}% confidence`);
 * }
 * ```
 */
export declare const detectUpcodingUnbundling: (billingRecords: any[]) => Promise<Array<{
    type: "upcoding" | "unbundling";
    confidence: number;
    evidence: any;
}>>;
/**
 * 33. Identifies phantom billing (services not rendered).
 *
 * @param {any[]} claims - Claims data
 * @param {any} patientRecords - Patient records
 * @returns {Promise<Array<{ claimId: string; service: string; probability: number }>>} Phantom billing detection
 *
 * @example
 * ```typescript
 * const phantomBilling = await identifyPhantomBilling(claims, records);
 * const highProbability = phantomBilling.filter(p => p.probability > 0.8);
 * ```
 */
export declare const identifyPhantomBilling: (claims: any[], patientRecords: any) => Promise<Array<{
    claimId: string;
    service: string;
    probability: number;
}>>;
/**
 * 34. Analyzes provider kickback schemes.
 *
 * @param {string} providerId - Provider identifier
 * @param {any[]} referralPatterns - Referral pattern data
 * @returns {Promise<{ suspected: boolean; patterns: string[]; riskScore: number }>} Kickback analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeKickbackSchemes('PROV-123', referrals);
 * if (analysis.suspected) {
 *   console.log('Kickback patterns:', analysis.patterns);
 * }
 * ```
 */
export declare const analyzeKickbackSchemes: (providerId: string, referralPatterns: any[]) => Promise<{
    suspected: boolean;
    patterns: string[];
    riskScore: number;
}>;
/**
 * 35. Detects unnecessary treatment patterns.
 *
 * @param {any[]} treatmentRecords - Treatment records
 * @param {any} medicalGuidelines - Medical necessity guidelines
 * @returns {Promise<Array<{ treatmentId: string; reason: string; severity: string }>>} Unnecessary treatment detection
 *
 * @example
 * ```typescript
 * const unnecessary = await detectUnnecessaryTreatment(treatments, guidelines);
 * console.log(`Found ${unnecessary.length} potentially unnecessary treatments`);
 * ```
 */
export declare const detectUnnecessaryTreatment: (treatmentRecords: any[], medicalGuidelines: any) => Promise<Array<{
    treatmentId: string;
    reason: string;
    severity: string;
}>>;
/**
 * 36. Performs comprehensive identity verification.
 *
 * @param {any} identityData - Identity data to verify
 * @returns {Promise<IdentityVerificationResult>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyIdentity(applicantData);
 * if (!verification.verified) {
 *   console.log('Identity verification failed:', verification.discrepancies);
 * }
 * ```
 */
export declare const verifyIdentity: (identityData: any) => Promise<IdentityVerificationResult>;
/**
 * 37. Validates SSN and detects stolen identities.
 *
 * @param {string} ssn - Social Security Number
 * @param {any} personalData - Personal data
 * @returns {Promise<{ valid: boolean; stolen: boolean; issuedState: string; issueYear: string }>} SSN validation
 *
 * @example
 * ```typescript
 * const ssnCheck = await validateSSN(ssn, personalInfo);
 * if (ssnCheck.stolen) {
 *   await flagIdentityTheft(claimId);
 * }
 * ```
 */
export declare const validateSSN: (ssn: string, personalData: any) => Promise<{
    valid: boolean;
    stolen: boolean;
    issuedState: string;
    issueYear: string;
}>;
/**
 * 38. Detects synthetic identity fraud.
 *
 * @param {any} identityData - Identity data
 * @returns {Promise<{ isSynthetic: boolean; confidence: number; indicators: string[] }>} Synthetic identity detection
 *
 * @example
 * ```typescript
 * const result = await detectSyntheticIdentity(identityData);
 * if (result.isSynthetic && result.confidence > 0.7) {
 *   await denyApplication(applicationId);
 * }
 * ```
 */
export declare const detectSyntheticIdentity: (identityData: any) => Promise<{
    isSynthetic: boolean;
    confidence: number;
    indicators: string[];
}>;
/**
 * 39. Cross-references identity databases.
 *
 * @param {any} identityData - Identity data
 * @param {string[]} databases - Database identifiers to check
 * @returns {Promise<Array<{ database: string; found: boolean; matches: any[] }>>} Cross-reference results
 *
 * @example
 * ```typescript
 * const results = await crossReferenceIdentityDatabases(data, ['NCIC', 'credit_bureau', 'DMV']);
 * ```
 */
export declare const crossReferenceIdentityDatabases: (identityData: any, databases: string[]) => Promise<Array<{
    database: string;
    found: boolean;
    matches: any[];
}>>;
/**
 * 40. Generates fraud analytics report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<FraudAnalyticsReport>} Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateFraudAnalyticsReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log('Detection rate:', report.detectionRate);
 * console.log('Total recovered:', report.totalRecovered);
 * ```
 */
export declare const generateFraudAnalyticsReport: (startDate: Date, endDate: Date) => Promise<FraudAnalyticsReport>;
declare const _default: {
    analyzeClaimForFraud: (claimId: string, claimData: any) => Promise<FraudDetectionResult>;
    detectSuspiciousPatterns: (claims: any[]) => Promise<ClaimsFraudPattern[]>;
    identifyRedFlags: (claimData: any) => RedFlag[];
    calculateFraudScore: (redFlags: RedFlag[], claimContext: any) => number;
    compareToHistoricalFraud: (claimData: any, historicalCases: any[]) => Promise<{
        similarCases: any[];
        matchScore: number;
    }>;
    screenApplicationFraud: (applicationData: any) => Promise<FraudDetectionResult>;
    validateApplicantInformation: (applicationData: any) => Array<{
        field: string;
        issue: string;
        severity: string;
    }>;
    detectPreExistingConcealment: (applicationData: any, medicalRecords: any) => Promise<{
        detected: boolean;
        conditions: string[];
        confidence: number;
    }>;
    validateMedicalHistory: (applicationData: any, externalData: any) => Promise<{
        accurate: boolean;
        discrepancies: any[];
    }>;
    detectGhostApplicant: (applicationData: any) => Promise<{
        isGhost: boolean;
        confidence: number;
        reasons: string[];
    }>;
    buildSocialNetworkGraph: (claims: any[]) => Promise<SocialNetworkNode[]>;
    detectFraudRings: (network: SocialNetworkNode[]) => Promise<FraudRingResult[]>;
    analyzeConnectionPatterns: (entityId: string, network: SocialNetworkNode[]) => {
        totalConnections: number;
        suspiciousCount: number;
        clusters: string[];
    };
    identifySharedAddresses: (claimants: any[]) => Array<{
        address: string;
        claimants: string[];
        riskScore: number;
    }>;
    detectCollusionPatterns: (claims: any[]) => Promise<Array<{
        claimantId: string;
        providerId: string;
        suspicionScore: number;
    }>>;
    detectStatisticalAnomalies: (claimData: any, historicalData: any) => Promise<AnomalyDetectionResult[]>;
    analyzeBillingCodeAnomalies: (billingCodes: any[], providerProfile: any) => Promise<AnomalyDetectionResult[]>;
    detectTimingAnomalies: (claims: any[]) => Array<{
        pattern: string;
        occurrences: number;
        suspicionLevel: number;
    }>;
    identifyOutlierAmounts: (claimAmount: number, categoryData: any) => {
        isOutlier: boolean;
        deviationPercent: number;
        threshold: number;
    };
    detectVelocityPatterns: (entityId: string, events: any[], timeWindow: number) => {
        eventCount: number;
        averageInterval: number;
        anomaly: boolean;
    };
    createSIUCase: (fraudResult: FraudDetectionResult, claimData: any) => Promise<SIUCase>;
    assignSIUCase: (caseId: string, investigatorId: string) => Promise<SIUCase>;
    updateSIUCaseStatus: (caseId: string, status: InvestigationStatus, notes?: string) => Promise<SIUCase>;
    closeSIUCase: (caseId: string, outcome: string, findings: string) => Promise<SIUCase>;
    getSIUCaseWorkload: (investigatorId: string) => Promise<Array<{
        caseId: string;
        priority: string;
        daysOpen: number;
    }>>;
    createFraudReferral: (claimId: string, referralData: any) => Promise<FraudReferral>;
    submitExternalReferral: (referralId: string, submissionData: any) => Promise<{
        submitted: boolean;
        confirmationNumber: string;
    }>;
    trackReferralStatus: (referralId: string) => Promise<Array<{
        date: Date;
        status: string;
        notes: string;
    }>>;
    generateReferralDocumentation: (referralId: string) => Promise<Buffer>;
    notifyReferralStakeholders: (referralId: string, recipients: string[], message: string) => Promise<{
        sent: boolean;
        recipientCount: number;
    }>;
    analyzeProviderFraud: (providerId: string, providerData: any) => Promise<ProviderFraudIndicators>;
    detectUpcodingUnbundling: (billingRecords: any[]) => Promise<Array<{
        type: "upcoding" | "unbundling";
        confidence: number;
        evidence: any;
    }>>;
    identifyPhantomBilling: (claims: any[], patientRecords: any) => Promise<Array<{
        claimId: string;
        service: string;
        probability: number;
    }>>;
    analyzeKickbackSchemes: (providerId: string, referralPatterns: any[]) => Promise<{
        suspected: boolean;
        patterns: string[];
        riskScore: number;
    }>;
    detectUnnecessaryTreatment: (treatmentRecords: any[], medicalGuidelines: any) => Promise<Array<{
        treatmentId: string;
        reason: string;
        severity: string;
    }>>;
    verifyIdentity: (identityData: any) => Promise<IdentityVerificationResult>;
    validateSSN: (ssn: string, personalData: any) => Promise<{
        valid: boolean;
        stolen: boolean;
        issuedState: string;
        issueYear: string;
    }>;
    detectSyntheticIdentity: (identityData: any) => Promise<{
        isSynthetic: boolean;
        confidence: number;
        indicators: string[];
    }>;
    crossReferenceIdentityDatabases: (identityData: any, databases: string[]) => Promise<Array<{
        database: string;
        found: boolean;
        matches: any[];
    }>>;
    generateFraudAnalyticsReport: (startDate: Date, endDate: Date) => Promise<FraudAnalyticsReport>;
    createFraudInvestigationModel: (sequelize: Sequelize) => any;
    createFraudDetectionLogModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=fraud-detection-kit.d.ts.map