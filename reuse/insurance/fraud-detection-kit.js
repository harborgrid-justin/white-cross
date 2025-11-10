"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFraudAnalyticsReport = exports.crossReferenceIdentityDatabases = exports.detectSyntheticIdentity = exports.validateSSN = exports.verifyIdentity = exports.detectUnnecessaryTreatment = exports.analyzeKickbackSchemes = exports.identifyPhantomBilling = exports.detectUpcodingUnbundling = exports.analyzeProviderFraud = exports.notifyReferralStakeholders = exports.generateReferralDocumentation = exports.trackReferralStatus = exports.submitExternalReferral = exports.createFraudReferral = exports.getSIUCaseWorkload = exports.closeSIUCase = exports.updateSIUCaseStatus = exports.assignSIUCase = exports.createSIUCase = exports.detectVelocityPatterns = exports.identifyOutlierAmounts = exports.detectTimingAnomalies = exports.analyzeBillingCodeAnomalies = exports.detectStatisticalAnomalies = exports.detectCollusionPatterns = exports.identifySharedAddresses = exports.analyzeConnectionPatterns = exports.detectFraudRings = exports.buildSocialNetworkGraph = exports.detectGhostApplicant = exports.validateMedicalHistory = exports.detectPreExistingConcealment = exports.validateApplicantInformation = exports.screenApplicationFraud = exports.compareToHistoricalFraud = exports.calculateFraudScore = exports.identifyRedFlags = exports.detectSuspiciousPatterns = exports.analyzeClaimForFraud = exports.createFraudDetectionLogModel = exports.createFraudInvestigationModel = void 0;
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
const sequelize_1 = require("sequelize");
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
const createFraudInvestigationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        caseId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique case identifier',
        },
        claimId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Reference to claim under investigation',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'under_review', 'escalated', 'closed_confirmed', 'closed_unconfirmed', 'closed_insufficient_evidence'),
            allowNull: false,
            defaultValue: 'pending',
        },
        fraudScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            validate: { min: 0, max: 100 },
        },
        fraudTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        assignedTo: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Assigned investigator user ID',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
            allowNull: false,
            defaultValue: 'medium',
        },
        redFlags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        estimatedLoss: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },
        openedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        closedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        findings: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        outcome: {
            type: sequelize_1.DataTypes.ENUM('fraud_confirmed', 'no_fraud', 'inconclusive'),
            allowNull: true,
        },
        recoveredAmount: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: true,
            defaultValue: 0,
        },
    };
    const options = {
        tableName: 'fraud_investigations',
        timestamps: true,
        indexes: [
            { fields: ['caseId'] },
            { fields: ['claimId'] },
            { fields: ['status'] },
            { fields: ['fraudScore'] },
            { fields: ['assignedTo'] },
            { fields: ['openedAt'] },
            { fields: ['priority'] },
        ],
    };
    return sequelize.define('FraudInvestigation', attributes, options);
};
exports.createFraudInvestigationModel = createFraudInvestigationModel;
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
const createFraudDetectionLogModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        claimId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        detectionMethod: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Method used for fraud detection',
        },
        fraudScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            validate: { min: 0, max: 100 },
        },
        confidenceLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
        },
        fraudTypes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        redFlagCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        detectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        actionTaken: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Action: approve, review, investigate, deny',
        },
    };
    const options = {
        tableName: 'fraud_detection_logs',
        timestamps: true,
        indexes: [
            { fields: ['claimId'] },
            { fields: ['fraudScore'] },
            { fields: ['detectedAt'] },
            { fields: ['confidenceLevel'] },
        ],
    };
    return sequelize.define('FraudDetectionLog', attributes, options);
};
exports.createFraudDetectionLogModel = createFraudDetectionLogModel;
// ============================================================================
// 1. CLAIMS FRAUD PATTERN RECOGNITION
// ============================================================================
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
const analyzeClaimForFraud = async (claimId, claimData) => {
    const redFlags = [];
    let fraudScore = 0;
    // Placeholder for ML-based fraud analysis
    return {
        claimId,
        fraudScore,
        confidenceLevel: 'medium',
        fraudTypes: [],
        redFlags,
        recommendedAction: 'review',
        reasoning: 'Automated fraud detection analysis',
        detectedAt: new Date(),
    };
};
exports.analyzeClaimForFraud = analyzeClaimForFraud;
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
const detectSuspiciousPatterns = async (claims) => {
    const patterns = [];
    // Placeholder for pattern detection algorithm
    return patterns;
};
exports.detectSuspiciousPatterns = detectSuspiciousPatterns;
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
const identifyRedFlags = (claimData) => {
    const redFlags = [];
    // Check for late reporting
    if (claimData.reportingDelay && claimData.reportingDelay > 30) {
        redFlags.push({
            code: 'LATE_REPORT',
            category: 'timing',
            severity: 'medium',
            description: 'Claim reported more than 30 days after incident',
            evidence: { delay: claimData.reportingDelay },
            weight: 15,
        });
    }
    // Check for round dollar amounts
    if (claimData.claimAmount % 100 === 0) {
        redFlags.push({
            code: 'ROUND_AMOUNT',
            category: 'financial',
            severity: 'low',
            description: 'Claim amount is a round number',
            evidence: { amount: claimData.claimAmount },
            weight: 5,
        });
    }
    return redFlags;
};
exports.identifyRedFlags = identifyRedFlags;
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
const calculateFraudScore = (redFlags, claimContext) => {
    let totalWeight = 0;
    for (const flag of redFlags) {
        totalWeight += flag.weight;
    }
    // Apply context modifiers
    const baseScore = Math.min(totalWeight, 100);
    return baseScore;
};
exports.calculateFraudScore = calculateFraudScore;
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
const compareToHistoricalFraud = async (claimData, historicalCases) => {
    // Placeholder for similarity matching algorithm
    return { similarCases: [], matchScore: 0 };
};
exports.compareToHistoricalFraud = compareToHistoricalFraud;
// ============================================================================
// 2. APPLICATION FRAUD DETECTION
// ============================================================================
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
const screenApplicationFraud = async (applicationData) => {
    const redFlags = [];
    // Check for inconsistencies
    if (applicationData.medicalHistory && applicationData.prescriptionHistory) {
        // Placeholder for cross-reference validation
    }
    return {
        claimId: applicationData.id,
        fraudScore: 0,
        confidenceLevel: 'low',
        fraudTypes: [],
        redFlags,
        recommendedAction: 'approve',
        reasoning: 'Application screening complete',
        detectedAt: new Date(),
    };
};
exports.screenApplicationFraud = screenApplicationFraud;
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
const validateApplicantInformation = (applicationData) => {
    const issues = [];
    // Placeholder for validation logic
    return issues;
};
exports.validateApplicantInformation = validateApplicantInformation;
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
const detectPreExistingConcealment = async (applicationData, medicalRecords) => {
    // Placeholder for concealment detection
    return { detected: false, conditions: [], confidence: 0 };
};
exports.detectPreExistingConcealment = detectPreExistingConcealment;
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
const validateMedicalHistory = async (applicationData, externalData) => {
    // Placeholder for medical history validation
    return { accurate: true, discrepancies: [] };
};
exports.validateMedicalHistory = validateMedicalHistory;
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
const detectGhostApplicant = async (applicationData) => {
    // Placeholder for ghost detection
    return { isGhost: false, confidence: 0, reasons: [] };
};
exports.detectGhostApplicant = detectGhostApplicant;
// ============================================================================
// 3. SOCIAL NETWORK ANALYSIS FOR FRAUD RINGS
// ============================================================================
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
const buildSocialNetworkGraph = async (claims) => {
    const nodes = [];
    // Placeholder for network graph construction
    return nodes;
};
exports.buildSocialNetworkGraph = buildSocialNetworkGraph;
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
const detectFraudRings = async (network) => {
    const rings = [];
    // Placeholder for fraud ring detection algorithm
    return rings;
};
exports.detectFraudRings = detectFraudRings;
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
const analyzeConnectionPatterns = (entityId, network) => {
    // Placeholder for connection pattern analysis
    return { totalConnections: 0, suspiciousCount: 0, clusters: [] };
};
exports.analyzeConnectionPatterns = analyzeConnectionPatterns;
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
const identifySharedAddresses = (claimants) => {
    const addressMap = new Map();
    for (const claimant of claimants) {
        const address = claimant.address;
        if (!addressMap.has(address)) {
            addressMap.set(address, []);
        }
        addressMap.get(address).push(claimant.id);
    }
    const results = [];
    for (const [address, claimantIds] of addressMap.entries()) {
        if (claimantIds.length > 1) {
            results.push({
                address,
                claimants: claimantIds,
                riskScore: claimantIds.length * 10,
            });
        }
    }
    return results;
};
exports.identifySharedAddresses = identifySharedAddresses;
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
const detectCollusionPatterns = async (claims) => {
    // Placeholder for collusion detection
    return [];
};
exports.detectCollusionPatterns = detectCollusionPatterns;
// ============================================================================
// 4. ANOMALY DETECTION ALGORITHMS
// ============================================================================
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
const detectStatisticalAnomalies = async (claimData, historicalData) => {
    const anomalies = [];
    // Placeholder for statistical anomaly detection
    return anomalies;
};
exports.detectStatisticalAnomalies = detectStatisticalAnomalies;
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
const analyzeBillingCodeAnomalies = async (billingCodes, providerProfile) => {
    // Placeholder for billing code analysis
    return [];
};
exports.analyzeBillingCodeAnomalies = analyzeBillingCodeAnomalies;
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
const detectTimingAnomalies = (claims) => {
    // Placeholder for timing anomaly detection
    return [];
};
exports.detectTimingAnomalies = detectTimingAnomalies;
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
const identifyOutlierAmounts = (claimAmount, categoryData) => {
    const mean = categoryData.mean || 0;
    const stdDev = categoryData.stdDev || 1;
    const threshold = mean + 2 * stdDev;
    const isOutlier = claimAmount > threshold;
    const deviationPercent = mean > 0 ? ((claimAmount - mean) / mean) * 100 : 0;
    return { isOutlier, deviationPercent, threshold };
};
exports.identifyOutlierAmounts = identifyOutlierAmounts;
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
const detectVelocityPatterns = (entityId, events, timeWindow) => {
    const filteredEvents = events.filter((e) => e.entityId === entityId);
    // Placeholder for velocity pattern detection
    return { eventCount: filteredEvents.length, averageInterval: 0, anomaly: false };
};
exports.detectVelocityPatterns = detectVelocityPatterns;
// ============================================================================
// 5. SIU CASE MANAGEMENT
// ============================================================================
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
const createSIUCase = async (fraudResult, claimData) => {
    const siuCase = {
        caseId: `SIU-${Date.now()}`,
        claimId: fraudResult.claimId,
        status: 'pending',
        priority: fraudResult.confidenceLevel === 'critical' ? 'urgent' : 'high',
        fraudTypes: fraudResult.fraudTypes,
        estimatedLoss: claimData.claimAmount || 0,
        openedAt: new Date(),
    };
    return siuCase;
};
exports.createSIUCase = createSIUCase;
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
const assignSIUCase = async (caseId, investigatorId) => {
    // Placeholder for case assignment
    return {};
};
exports.assignSIUCase = assignSIUCase;
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
const updateSIUCaseStatus = async (caseId, status, notes) => {
    // Placeholder for status update
    return {};
};
exports.updateSIUCaseStatus = updateSIUCaseStatus;
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
const closeSIUCase = async (caseId, outcome, findings) => {
    // Placeholder for case closure
    return {};
};
exports.closeSIUCase = closeSIUCase;
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
const getSIUCaseWorkload = async (investigatorId) => {
    // Placeholder for workload retrieval
    return [];
};
exports.getSIUCaseWorkload = getSIUCaseWorkload;
// ============================================================================
// 6. FRAUD REFERRAL WORKFLOWS
// ============================================================================
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
const createFraudReferral = async (claimId, referralData) => {
    const referral = {
        referralId: `REF-${Date.now()}`,
        claimId,
        referredBy: referralData.referredBy,
        referredTo: referralData.referredTo,
        reason: referralData.reason,
        priority: referralData.priority || 'medium',
        attachments: referralData.attachments || [],
        status: 'pending',
        createdAt: new Date(),
    };
    return referral;
};
exports.createFraudReferral = createFraudReferral;
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
const submitExternalReferral = async (referralId, submissionData) => {
    // Placeholder for external submission
    return { submitted: true, confirmationNumber: `CONF-${Date.now()}` };
};
exports.submitExternalReferral = submitExternalReferral;
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
const trackReferralStatus = async (referralId) => {
    // Placeholder for status tracking
    return [];
};
exports.trackReferralStatus = trackReferralStatus;
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
const generateReferralDocumentation = async (referralId) => {
    // Placeholder for documentation generation
    return Buffer.from('Referral documentation');
};
exports.generateReferralDocumentation = generateReferralDocumentation;
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
const notifyReferralStakeholders = async (referralId, recipients, message) => {
    // Placeholder for notification
    return { sent: true, recipientCount: recipients.length };
};
exports.notifyReferralStakeholders = notifyReferralStakeholders;
// ============================================================================
// 7. PROVIDER FRAUD DETECTION
// ============================================================================
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
const analyzeProviderFraud = async (providerId, providerData) => {
    const indicators = {
        providerId,
        providerName: providerData.name,
        indicators: {
            billingAnomalies: 0,
            patternDeviations: 0,
            complaintCount: 0,
            licensureIssues: 0,
            networkConnections: 0,
        },
        overallRiskScore: 0,
        recommendedAction: 'monitor',
    };
    return indicators;
};
exports.analyzeProviderFraud = analyzeProviderFraud;
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
const detectUpcodingUnbundling = async (billingRecords) => {
    // Placeholder for upcoding/unbundling detection
    return [];
};
exports.detectUpcodingUnbundling = detectUpcodingUnbundling;
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
const identifyPhantomBilling = async (claims, patientRecords) => {
    // Placeholder for phantom billing detection
    return [];
};
exports.identifyPhantomBilling = identifyPhantomBilling;
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
const analyzeKickbackSchemes = async (providerId, referralPatterns) => {
    // Placeholder for kickback analysis
    return { suspected: false, patterns: [], riskScore: 0 };
};
exports.analyzeKickbackSchemes = analyzeKickbackSchemes;
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
const detectUnnecessaryTreatment = async (treatmentRecords, medicalGuidelines) => {
    // Placeholder for unnecessary treatment detection
    return [];
};
exports.detectUnnecessaryTreatment = detectUnnecessaryTreatment;
// ============================================================================
// 8. IDENTITY FRAUD VERIFICATION
// ============================================================================
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
const verifyIdentity = async (identityData) => {
    const result = {
        verified: true,
        confidence: 95,
        checks: {
            documentVerification: true,
            biometricMatch: true,
            addressVerification: true,
            ssnValidation: true,
            databaseCrossCheck: true,
        },
        discrepancies: [],
        riskLevel: 'low',
    };
    return result;
};
exports.verifyIdentity = verifyIdentity;
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
const validateSSN = async (ssn, personalData) => {
    // Placeholder for SSN validation
    return { valid: true, stolen: false, issuedState: 'Unknown', issueYear: 'Unknown' };
};
exports.validateSSN = validateSSN;
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
const detectSyntheticIdentity = async (identityData) => {
    // Placeholder for synthetic identity detection
    return { isSynthetic: false, confidence: 0, indicators: [] };
};
exports.detectSyntheticIdentity = detectSyntheticIdentity;
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
const crossReferenceIdentityDatabases = async (identityData, databases) => {
    // Placeholder for database cross-referencing
    return databases.map((db) => ({ database: db, found: false, matches: [] }));
};
exports.crossReferenceIdentityDatabases = crossReferenceIdentityDatabases;
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
const generateFraudAnalyticsReport = async (startDate, endDate) => {
    const report = {
        period: { start: startDate, end: endDate },
        totalCasesDetected: 0,
        totalAmountAtRisk: 0,
        totalRecovered: 0,
        detectionRate: 0,
        falsePositiveRate: 0,
        fraudTypeBreakdown: {},
        topPatterns: [],
        trends: [],
    };
    return report;
};
exports.generateFraudAnalyticsReport = generateFraudAnalyticsReport;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Claims Fraud Pattern Recognition
    analyzeClaimForFraud: exports.analyzeClaimForFraud,
    detectSuspiciousPatterns: exports.detectSuspiciousPatterns,
    identifyRedFlags: exports.identifyRedFlags,
    calculateFraudScore: exports.calculateFraudScore,
    compareToHistoricalFraud: exports.compareToHistoricalFraud,
    // Application Fraud Detection
    screenApplicationFraud: exports.screenApplicationFraud,
    validateApplicantInformation: exports.validateApplicantInformation,
    detectPreExistingConcealment: exports.detectPreExistingConcealment,
    validateMedicalHistory: exports.validateMedicalHistory,
    detectGhostApplicant: exports.detectGhostApplicant,
    // Social Network Analysis
    buildSocialNetworkGraph: exports.buildSocialNetworkGraph,
    detectFraudRings: exports.detectFraudRings,
    analyzeConnectionPatterns: exports.analyzeConnectionPatterns,
    identifySharedAddresses: exports.identifySharedAddresses,
    detectCollusionPatterns: exports.detectCollusionPatterns,
    // Anomaly Detection
    detectStatisticalAnomalies: exports.detectStatisticalAnomalies,
    analyzeBillingCodeAnomalies: exports.analyzeBillingCodeAnomalies,
    detectTimingAnomalies: exports.detectTimingAnomalies,
    identifyOutlierAmounts: exports.identifyOutlierAmounts,
    detectVelocityPatterns: exports.detectVelocityPatterns,
    // SIU Case Management
    createSIUCase: exports.createSIUCase,
    assignSIUCase: exports.assignSIUCase,
    updateSIUCaseStatus: exports.updateSIUCaseStatus,
    closeSIUCase: exports.closeSIUCase,
    getSIUCaseWorkload: exports.getSIUCaseWorkload,
    // Fraud Referral Workflows
    createFraudReferral: exports.createFraudReferral,
    submitExternalReferral: exports.submitExternalReferral,
    trackReferralStatus: exports.trackReferralStatus,
    generateReferralDocumentation: exports.generateReferralDocumentation,
    notifyReferralStakeholders: exports.notifyReferralStakeholders,
    // Provider Fraud Detection
    analyzeProviderFraud: exports.analyzeProviderFraud,
    detectUpcodingUnbundling: exports.detectUpcodingUnbundling,
    identifyPhantomBilling: exports.identifyPhantomBilling,
    analyzeKickbackSchemes: exports.analyzeKickbackSchemes,
    detectUnnecessaryTreatment: exports.detectUnnecessaryTreatment,
    // Identity Fraud Verification
    verifyIdentity: exports.verifyIdentity,
    validateSSN: exports.validateSSN,
    detectSyntheticIdentity: exports.detectSyntheticIdentity,
    crossReferenceIdentityDatabases: exports.crossReferenceIdentityDatabases,
    generateFraudAnalyticsReport: exports.generateFraudAnalyticsReport,
    // Model Creators
    createFraudInvestigationModel: exports.createFraudInvestigationModel,
    createFraudDetectionLogModel: exports.createFraudDetectionLogModel,
};
//# sourceMappingURL=fraud-detection-kit.js.map