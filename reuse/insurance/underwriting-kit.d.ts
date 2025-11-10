/**
 * LOC: INS-UW-001
 * File: /reuse/insurance/underwriting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance policy services
 *   - Underwriting workflow modules
 *   - Risk assessment engines
 *   - Policy issuance services
 */
/**
 * File: /reuse/insurance/underwriting-kit.ts
 * Locator: WC-UTL-UNDERWRT-001
 * Purpose: Insurance Underwriting Operations Kit - Comprehensive underwriting utilities for enterprise insurance
 *
 * Upstream: Independent utility module for insurance underwriting operations
 * Downstream: ../backend/*, Insurance services, Policy processors, Risk engines, Underwriting workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator, class-transformer
 * Exports: 42 utility functions for underwriting guidelines, risk classification, decision automation, manual workflows,
 *          referrals, declinations, questionnaires, medical underwriting, property inspection, loss history,
 *          credit scoring, occupation classification, capacity management, binding authority, profitability analysis
 *
 * LLM Context: Production-ready insurance underwriting utilities for White Cross healthcare platform.
 * Provides comprehensive underwriting decision support, automated risk assessment, manual underwriting workflows,
 * declination management, medical underwriting for life/health insurance, property inspections, loss history analysis,
 * credit-based insurance scoring, occupation risk classification, underwriting capacity management, binding authority
 * rules, and profitability analysis. Essential for insurance policy issuance and risk management operations.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Underwriting decision types
 */
export type UnderwritingDecision = 'approve' | 'decline' | 'refer' | 'pending' | 'counteroffer';
/**
 * Risk classification levels
 */
export type RiskClassification = 'preferred' | 'standard' | 'substandard' | 'declined' | 'uninsurable';
/**
 * Underwriting status
 */
export type UnderwritingStatus = 'new' | 'in_progress' | 'awaiting_info' | 'completed' | 'cancelled';
/**
 * Declination reason categories
 */
export type DeclinationCategory = 'health' | 'financial' | 'occupation' | 'lifestyle' | 'claims_history' | 'fraud' | 'other';
/**
 * Inspection requirement types
 */
export type InspectionType = 'property' | 'medical' | 'financial' | 'vehicle' | 'business';
/**
 * Occupation hazard levels
 */
export type OccupationHazard = 'low' | 'medium' | 'high' | 'very_high' | 'prohibited';
/**
 * Underwriting guideline result
 */
export interface UnderwritingGuidelineResult {
    guidelineId: string;
    guidelineName: string;
    passed: boolean;
    score?: number;
    riskFactors: RiskFactor[];
    recommendations: string[];
    automationEligible: boolean;
}
/**
 * Risk factor
 */
export interface RiskFactor {
    factorId: string;
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: number;
    mitigation?: string;
}
/**
 * Underwriting decision result
 */
export interface UnderwritingDecisionResult {
    decision: UnderwritingDecision;
    riskClassification: RiskClassification;
    premiumAdjustment?: number;
    conditions?: string[];
    exclusions?: string[];
    referralReasons?: string[];
    declinationReasons?: string[];
    approvedCoverage?: number;
    requiresManualReview: boolean;
    confidenceScore: number;
    decisionDate: Date;
    validUntil?: Date;
}
/**
 * Manual underwriting assignment
 */
export interface ManualUnderwritingAssignment {
    assignmentId: string;
    underwriterId: string;
    applicationId: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedAt: Date;
    dueDate?: Date;
    complexity: number;
    estimatedHours?: number;
}
/**
 * Underwriting referral
 */
export interface UnderwritingReferral {
    referralId: string;
    applicationId: string;
    referredBy: string;
    referredTo: string;
    reasons: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
    additionalInfo?: Record<string, any>;
    referredAt: Date;
    resolvedAt?: Date;
    resolution?: string;
}
/**
 * Declination information
 */
export interface DeclinationInfo {
    declinationId: string;
    applicationId: string;
    category: DeclinationCategory;
    reasons: DeclinationReason[];
    alternativeOptions?: string[];
    appealEligible: boolean;
    declinedAt: Date;
    declinedBy: string;
    notificationSent: boolean;
}
/**
 * Declination reason
 */
export interface DeclinationReason {
    reasonCode: string;
    description: string;
    category: DeclinationCategory;
    regulatory: boolean;
    adverseActionRequired: boolean;
}
/**
 * Underwriting questionnaire
 */
export interface UnderwritingQuestionnaire {
    questionnaireId: string;
    name: string;
    version: string;
    productType: string;
    questions: QuestionnaireQuestion[];
    scoringRules?: ScoringRule[];
    requiredFor?: string[];
}
/**
 * Questionnaire question
 */
export interface QuestionnaireQuestion {
    questionId: string;
    text: string;
    type: 'yes_no' | 'text' | 'numeric' | 'date' | 'multiple_choice' | 'multi_select';
    required: boolean;
    options?: string[];
    validationRules?: Record<string, any>;
    riskWeighting?: number;
    followUpQuestions?: QuestionnaireQuestion[];
}
/**
 * Scoring rule
 */
export interface ScoringRule {
    ruleId: string;
    condition: string;
    points: number;
    riskLevel: string;
    action?: string;
}
/**
 * Medical underwriting assessment
 */
export interface MedicalUnderwritingAssessment {
    assessmentId: string;
    applicantId: string;
    medicalHistory: MedicalCondition[];
    medications: Medication[];
    familyHistory?: MedicalCondition[];
    lifestyle: LifestyleFactors;
    examResults?: MedicalExamResults;
    riskScore: number;
    ratingClass: string;
    requiresPhysician?: boolean;
    recommendedAction: string;
}
/**
 * Medical condition
 */
export interface MedicalCondition {
    conditionCode: string;
    description: string;
    diagnosedDate?: Date;
    severity: 'mild' | 'moderate' | 'severe';
    controlled: boolean;
    treatment?: string;
    riskImpact: number;
}
/**
 * Medication
 */
export interface Medication {
    name: string;
    purpose: string;
    dosage?: string;
    startDate?: Date;
    riskIndicator: boolean;
}
/**
 * Lifestyle factors
 */
export interface LifestyleFactors {
    smoker: boolean;
    alcoholUse?: 'none' | 'light' | 'moderate' | 'heavy';
    exerciseFrequency?: 'none' | 'occasional' | 'regular' | 'frequent';
    hazardousActivities?: string[];
    bmi?: number;
    riskScore: number;
}
/**
 * Medical exam results
 */
export interface MedicalExamResults {
    bloodPressure?: string;
    cholesterol?: number;
    glucose?: number;
    height?: number;
    weight?: number;
    bmi?: number;
    additionalTests?: Record<string, any>;
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
}
/**
 * Property inspection requirement
 */
export interface PropertyInspectionRequirement {
    requirementId: string;
    propertyId: string;
    inspectionType: InspectionType;
    priority: 'low' | 'medium' | 'high';
    requiredBy?: Date;
    inspector?: string;
    scheduledDate?: Date;
    completed: boolean;
    report?: InspectionReport;
}
/**
 * Inspection report
 */
export interface InspectionReport {
    reportId: string;
    inspectionDate: Date;
    inspector: string;
    findings: InspectionFinding[];
    photos?: string[];
    overallCondition: 'excellent' | 'good' | 'fair' | 'poor';
    replacementCost?: number;
    recommendedActions?: string[];
    approvable: boolean;
}
/**
 * Inspection finding
 */
export interface InspectionFinding {
    findingId: string;
    category: string;
    description: string;
    severity: 'informational' | 'minor' | 'major' | 'critical';
    requiresCorrection: boolean;
    estimatedCost?: number;
}
/**
 * Loss history analysis
 */
export interface LossHistoryAnalysis {
    applicantId: string;
    period: {
        start: Date;
        end: Date;
    };
    claims: ClaimHistory[];
    totalLosses: number;
    claimCount: number;
    lossRatio: number;
    frequencyScore: number;
    severityScore: number;
    trend: 'improving' | 'stable' | 'worsening';
    riskIndicators: string[];
    recommendedAction: string;
}
/**
 * Claim history
 */
export interface ClaimHistory {
    claimId: string;
    claimDate: Date;
    lossType: string;
    amount: number;
    status: string;
    atFault?: boolean;
    description?: string;
}
/**
 * Credit-based insurance score
 */
export interface CreditInsuranceScore {
    applicantId: string;
    score: number;
    tier: 'excellent' | 'good' | 'fair' | 'poor';
    factors: CreditFactor[];
    premiumImpact: number;
    calculatedAt: Date;
    expiresAt: Date;
}
/**
 * Credit factor
 */
export interface CreditFactor {
    factorType: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
}
/**
 * Occupation classification
 */
export interface OccupationClassification {
    occupationCode: string;
    title: string;
    industry: string;
    hazardLevel: OccupationHazard;
    riskScore: number;
    premiumModifier: number;
    restrictions?: string[];
    specialRequirements?: string[];
    acceptable: boolean;
}
/**
 * Underwriting capacity
 */
export interface UnderwritingCapacity {
    lineOfBusiness: string;
    totalCapacity: number;
    usedCapacity: number;
    availableCapacity: number;
    pendingCapacity: number;
    utilizationRate: number;
    thresholds: CapacityThreshold[];
    alertLevel: 'green' | 'yellow' | 'orange' | 'red';
}
/**
 * Capacity threshold
 */
export interface CapacityThreshold {
    level: string;
    threshold: number;
    action: string;
}
/**
 * Binding authority rule
 */
export interface BindingAuthorityRule {
    ruleId: string;
    underwriterLevel: string;
    maxCoverage: number;
    maxPremium?: number;
    allowedProducts: string[];
    riskClassRestrictions?: RiskClassification[];
    conditions: BindingCondition[];
    active: boolean;
}
/**
 * Binding condition
 */
export interface BindingCondition {
    conditionType: string;
    parameter: string;
    operator: string;
    value: any;
    required: boolean;
}
/**
 * Underwriting profitability metrics
 */
export interface UnderwritingProfitability {
    period: {
        start: Date;
        end: Date;
    };
    lossRatio: number;
    expenseRatio: number;
    combinedRatio: number;
    premiumVolume: number;
    claimsIncurred: number;
    underwritingProfit: number;
    profitMargin: number;
    targetMetrics: Record<string, number>;
    performance: 'excellent' | 'good' | 'fair' | 'poor';
}
/**
 * Underwriting application model attributes
 */
export interface UnderwritingApplicationAttributes {
    id: string;
    applicationNumber: string;
    applicantId: string;
    productType: string;
    coverageAmount: number;
    status: string;
    decision?: string;
    riskClassification?: string;
    premiumRate?: number;
    submittedAt: Date;
    assignedTo?: string;
    assignedAt?: Date;
    completedAt?: Date;
    requiresManualReview: boolean;
    automationScore?: number;
    guidelines: any;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates UnderwritingApplication model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<UnderwritingApplicationAttributes>>} UnderwritingApplication model
 *
 * @example
 * ```typescript
 * const ApplicationModel = createUnderwritingApplicationModel(sequelize);
 * const application = await ApplicationModel.create({
 *   applicationNumber: 'UW-2025-001234',
 *   applicantId: 'applicant-123',
 *   productType: 'term_life',
 *   coverageAmount: 500000,
 *   status: 'new'
 * });
 * ```
 */
export declare const createUnderwritingApplicationModel: (sequelize: Sequelize) => any;
/**
 * Underwriting decision model attributes
 */
export interface UnderwritingDecisionAttributes {
    id: string;
    applicationId: string;
    decision: string;
    riskClassification: string;
    premiumAdjustment?: number;
    conditions?: any;
    exclusions?: any;
    decisionRationale: string;
    confidenceScore: number;
    decisionMaker: string;
    decisionType: string;
    approvedCoverage?: number;
    effectiveDate?: Date;
    expiryDate?: Date;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates UnderwritingDecision model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<UnderwritingDecisionAttributes>>} UnderwritingDecision model
 */
export declare const createUnderwritingDecisionModel: (sequelize: Sequelize) => any;
/**
 * Underwriting referral model attributes
 */
export interface UnderwritingReferralAttributes {
    id: string;
    applicationId: string;
    referredBy: string;
    referredTo: string;
    reasons: any;
    urgency: string;
    additionalInfo?: any;
    status: string;
    referredAt: Date;
    resolvedAt?: Date;
    resolution?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates UnderwritingReferral model for Sequelize.
 */
export declare const createUnderwritingReferralModel: (sequelize: Sequelize) => any;
/**
 * Medical underwriting assessment model attributes
 */
export interface MedicalUnderwritingAssessmentAttributes {
    id: string;
    applicationId: string;
    applicantId: string;
    medicalHistory: any;
    medications: any;
    familyHistory?: any;
    lifestyle: any;
    examResults?: any;
    riskScore: number;
    ratingClass: string;
    requiresPhysician: boolean;
    recommendedAction: string;
    assessedAt: Date;
    assessedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates MedicalUnderwritingAssessment model for Sequelize.
 */
export declare const createMedicalUnderwritingAssessmentModel: (sequelize: Sequelize) => any;
/**
 * Property inspection model attributes
 */
export interface PropertyInspectionAttributes {
    id: string;
    applicationId: string;
    propertyId: string;
    inspectionType: string;
    priority: string;
    status: string;
    requiredBy?: Date;
    inspector?: string;
    scheduledDate?: Date;
    completedDate?: Date;
    report?: any;
    findings: any;
    overallCondition?: string;
    approvable?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates PropertyInspection model for Sequelize.
 */
export declare const createPropertyInspectionModel: (sequelize: Sequelize) => any;
/**
 * 1. Evaluates underwriting guidelines for an application.
 *
 * @param {string} applicationId - Application identifier
 * @param {Record<string, any>} applicationData - Application data to evaluate
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingGuidelineResult>} Guideline evaluation result
 *
 * @example
 * ```typescript
 * const result = await evaluateUnderwritingGuidelines('app-123', {
 *   age: 35,
 *   coverageAmount: 500000,
 *   health: 'good'
 * });
 * console.log('Automation eligible:', result.automationEligible);
 * ```
 */
export declare const evaluateUnderwritingGuidelines: (applicationId: string, applicationData: Record<string, any>, transaction?: Transaction) => Promise<UnderwritingGuidelineResult>;
/**
 * 2. Validates application against product-specific guidelines.
 *
 * @param {string} productType - Insurance product type
 * @param {Record<string, any>} applicationData - Application data
 * @returns {Promise<{ valid: boolean; violations: string[] }>} Validation result
 */
export declare const validateProductGuidelines: (productType: string, applicationData: Record<string, any>) => Promise<{
    valid: boolean;
    violations: string[];
}>;
/**
 * 3. Retrieves applicable underwriting guidelines for a product.
 *
 * @param {string} productType - Insurance product type
 * @param {string} [version] - Optional guideline version
 * @returns {Promise<Record<string, any>>} Underwriting guidelines
 */
export declare const getUnderwritingGuidelines: (productType: string, version?: string) => Promise<Record<string, any>>;
/**
 * 4. Classifies risk level for an applicant.
 *
 * @param {string} applicantId - Applicant identifier
 * @param {Record<string, any>} riskFactors - Risk assessment factors
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<RiskClassification>} Risk classification
 */
export declare const classifyRisk: (applicantId: string, riskFactors: Record<string, any>, transaction?: Transaction) => Promise<RiskClassification>;
/**
 * 5. Calculates risk score based on multiple factors.
 *
 * @param {RiskFactor[]} riskFactors - Array of risk factors
 * @returns {Promise<number>} Overall risk score (0-100)
 */
export declare const calculateRiskScore: (riskFactors: RiskFactor[]) => Promise<number>;
/**
 * 6. Determines premium rating based on risk classification.
 *
 * @param {RiskClassification} riskClass - Risk classification
 * @param {number} basePremium - Base premium amount
 * @returns {Promise<number>} Adjusted premium rate
 */
export declare const determinePremiumRating: (riskClass: RiskClassification, basePremium: number) => Promise<number>;
/**
 * 7. Identifies risk factors from application data.
 *
 * @param {Record<string, any>} applicationData - Application data
 * @returns {Promise<RiskFactor[]>} Identified risk factors
 */
export declare const identifyRiskFactors: (applicationData: Record<string, any>) => Promise<RiskFactor[]>;
/**
 * 8. Compares risk across multiple applicants.
 *
 * @param {string[]} applicantIds - Array of applicant identifiers
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<string, RiskClassification>>} Risk comparison results
 */
export declare const compareApplicantRisks: (applicantIds: string[], transaction?: Transaction) => Promise<Record<string, RiskClassification>>;
/**
 * 9. Makes automated underwriting decision.
 *
 * @param {string} applicationId - Application identifier
 * @param {Record<string, any>} applicationData - Complete application data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingDecisionResult>} Automated decision result
 */
export declare const makeAutomatedDecision: (applicationId: string, applicationData: Record<string, any>, transaction?: Transaction) => Promise<UnderwritingDecisionResult>;
/**
 * 10. Determines if application is eligible for automation.
 *
 * @param {Record<string, any>} applicationData - Application data
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Automation eligibility
 */
export declare const checkAutomationEligibility: (applicationData: Record<string, any>) => Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * 11. Applies decision rules engine.
 *
 * @param {string} ruleSetId - Rule set identifier
 * @param {Record<string, any>} data - Data to evaluate
 * @returns {Promise<{ decision: string; triggeredRules: string[] }>} Rules evaluation result
 */
export declare const applyDecisionRules: (ruleSetId: string, data: Record<string, any>) => Promise<{
    decision: string;
    triggeredRules: string[];
}>;
/**
 * 12. Calculates decision confidence score.
 *
 * @param {Record<string, any>} decisionFactors - Factors influencing decision
 * @returns {Promise<number>} Confidence score (0-100)
 */
export declare const calculateDecisionConfidence: (decisionFactors: Record<string, any>) => Promise<number>;
/**
 * 13. Assigns application to underwriter.
 *
 * @param {string} applicationId - Application identifier
 * @param {string} underwriterId - Underwriter identifier
 * @param {number} priority - Assignment priority (1-5)
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<ManualUnderwritingAssignment>} Assignment details
 */
export declare const assignToUnderwriter: (applicationId: string, underwriterId: string, priority: number, transaction?: Transaction) => Promise<ManualUnderwritingAssignment>;
/**
 * 14. Retrieves underwriter workload.
 *
 * @param {string} underwriterId - Underwriter identifier
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ activeCount: number; avgCompletionTime: number }>} Workload metrics
 */
export declare const getUnderwriterWorkload: (underwriterId: string, transaction?: Transaction) => Promise<{
    activeCount: number;
    avgCompletionTime: number;
}>;
/**
 * 15. Balances workload across underwriting team.
 *
 * @param {string[]} underwriterIds - Array of underwriter identifiers
 * @param {string[]} applicationIds - Applications to distribute
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<string, string[]>>} Assignment distribution
 */
export declare const balanceUnderwriterWorkload: (underwriterIds: string[], applicationIds: string[], transaction?: Transaction) => Promise<Record<string, string[]>>;
/**
 * 16. Tracks manual underwriting progress.
 *
 * @param {string} applicationId - Application identifier
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ status: string; completionPercentage: number; timeElapsed: number }>} Progress metrics
 */
export declare const trackUnderwritingProgress: (applicationId: string, transaction?: Transaction) => Promise<{
    status: string;
    completionPercentage: number;
    timeElapsed: number;
}>;
/**
 * 17. Creates underwriting referral.
 *
 * @param {UnderwritingReferral} referralData - Referral information
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingReferral>} Created referral
 */
export declare const createUnderwritingReferral: (referralData: Partial<UnderwritingReferral>, transaction?: Transaction) => Promise<UnderwritingReferral>;
/**
 * 18. Processes referral response.
 *
 * @param {string} referralId - Referral identifier
 * @param {string} resolution - Referral resolution
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ resolved: boolean; decision?: string }>} Resolution result
 */
export declare const processReferralResponse: (referralId: string, resolution: string, transaction?: Transaction) => Promise<{
    resolved: boolean;
    decision?: string;
}>;
/**
 * 19. Escalates underwriting exception.
 *
 * @param {string} applicationId - Application identifier
 * @param {string} exceptionReason - Reason for exception
 * @param {string} escalationLevel - Escalation level (1-3)
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ escalationId: string; assignedTo: string }>} Escalation details
 */
export declare const escalateException: (applicationId: string, exceptionReason: string, escalationLevel: string, transaction?: Transaction) => Promise<{
    escalationId: string;
    assignedTo: string;
}>;
/**
 * 20. Retrieves pending referrals for an underwriter.
 *
 * @param {string} underwriterId - Underwriter identifier
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingReferral[]>} Pending referrals
 */
export declare const getPendingReferrals: (underwriterId: string, transaction?: Transaction) => Promise<UnderwritingReferral[]>;
/**
 * 21. Creates declination record.
 *
 * @param {string} applicationId - Application identifier
 * @param {DeclinationReason[]} reasons - Declination reasons
 * @param {DeclinationCategory} category - Primary declination category
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<DeclinationInfo>} Declination information
 */
export declare const createDeclination: (applicationId: string, reasons: DeclinationReason[], category: DeclinationCategory, transaction?: Transaction) => Promise<DeclinationInfo>;
/**
 * 22. Generates adverse action notice.
 *
 * @param {string} declinationId - Declination identifier
 * @returns {Promise<{ noticeId: string; content: string; requiredDisclosures: string[] }>} Notice details
 */
export declare const generateAdverseActionNotice: (declinationId: string) => Promise<{
    noticeId: string;
    content: string;
    requiredDisclosures: string[];
}>;
/**
 * 23. Processes declination appeal.
 *
 * @param {string} declinationId - Declination identifier
 * @param {Record<string, any>} appealData - Appeal information
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ appealId: string; status: string }>} Appeal processing result
 */
export declare const processDeclinationAppeal: (declinationId: string, appealData: Record<string, any>, transaction?: Transaction) => Promise<{
    appealId: string;
    status: string;
}>;
/**
 * 24. Retrieves declination statistics.
 *
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<Record<DeclinationCategory, number>>} Declination statistics by category
 */
export declare const getDeclinationStatistics: (startDate: Date, endDate: Date, transaction?: Transaction) => Promise<Record<DeclinationCategory, number>>;
/**
 * 25. Generates dynamic underwriting questionnaire.
 *
 * @param {string} productType - Insurance product type
 * @param {Record<string, any>} applicantProfile - Applicant profile data
 * @returns {Promise<UnderwritingQuestionnaire>} Generated questionnaire
 */
export declare const generateUnderwritingQuestionnaire: (productType: string, applicantProfile: Record<string, any>) => Promise<UnderwritingQuestionnaire>;
/**
 * 26. Validates questionnaire responses.
 *
 * @param {string} questionnaireId - Questionnaire identifier
 * @param {Record<string, any>} responses - Applicant responses
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 */
export declare const validateQuestionnaireResponses: (questionnaireId: string, responses: Record<string, any>) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * 27. Scores questionnaire responses.
 *
 * @param {UnderwritingQuestionnaire} questionnaire - Questionnaire definition
 * @param {Record<string, any>} responses - Applicant responses
 * @returns {Promise<{ score: number; riskLevel: string; triggeredRules: string[] }>} Scoring result
 */
export declare const scoreQuestionnaireResponses: (questionnaire: UnderwritingQuestionnaire, responses: Record<string, any>) => Promise<{
    score: number;
    riskLevel: string;
    triggeredRules: string[];
}>;
/**
 * 28. Determines required follow-up questions.
 *
 * @param {Record<string, any>} initialResponses - Initial questionnaire responses
 * @returns {Promise<QuestionnaireQuestion[]>} Follow-up questions
 */
export declare const determineFollowUpQuestions: (initialResponses: Record<string, any>) => Promise<QuestionnaireQuestion[]>;
/**
 * 29. Performs medical underwriting assessment.
 *
 * @param {string} applicantId - Applicant identifier
 * @param {Record<string, any>} medicalData - Medical information
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<MedicalUnderwritingAssessment>} Medical assessment result
 */
export declare const performMedicalAssessment: (applicantId: string, medicalData: Record<string, any>, transaction?: Transaction) => Promise<MedicalUnderwritingAssessment>;
/**
 * 30. Evaluates medical conditions impact.
 *
 * @param {MedicalCondition[]} conditions - Array of medical conditions
 * @returns {Promise<{ overallRisk: number; criticalConditions: string[] }>} Conditions evaluation
 */
export declare const evaluateMedicalConditions: (conditions: MedicalCondition[]) => Promise<{
    overallRisk: number;
    criticalConditions: string[];
}>;
/**
 * 31. Calculates lifestyle risk score.
 *
 * @param {LifestyleFactors} lifestyle - Lifestyle factors
 * @returns {Promise<number>} Lifestyle risk score
 */
export declare const calculateLifestyleRisk: (lifestyle: LifestyleFactors) => Promise<number>;
/**
 * 32. Determines if medical exam is required.
 *
 * @param {number} coverageAmount - Requested coverage amount
 * @param {number} applicantAge - Applicant age
 * @param {Record<string, any>} healthProfile - Health profile data
 * @returns {Promise<{ required: boolean; examType: string; reasons: string[] }>} Exam requirement
 */
export declare const determineMedicalExamRequirement: (coverageAmount: number, applicantAge: number, healthProfile: Record<string, any>) => Promise<{
    required: boolean;
    examType: string;
    reasons: string[];
}>;
/**
 * 33. Determines property inspection requirements.
 *
 * @param {string} propertyId - Property identifier
 * @param {Record<string, any>} propertyData - Property information
 * @returns {Promise<PropertyInspectionRequirement>} Inspection requirements
 */
export declare const determineInspectionRequirements: (propertyId: string, propertyData: Record<string, any>) => Promise<PropertyInspectionRequirement>;
/**
 * 34. Schedules property inspection.
 *
 * @param {string} requirementId - Inspection requirement identifier
 * @param {string} inspectorId - Inspector identifier
 * @param {Date} scheduledDate - Scheduled inspection date
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ scheduled: boolean; confirmationNumber: string }>} Scheduling result
 */
export declare const schedulePropertyInspection: (requirementId: string, inspectorId: string, scheduledDate: Date, transaction?: Transaction) => Promise<{
    scheduled: boolean;
    confirmationNumber: string;
}>;
/**
 * 35. Processes inspection report.
 *
 * @param {string} inspectionId - Inspection identifier
 * @param {InspectionReport} report - Inspection report data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ processed: boolean; underwritingImpact: string }>} Processing result
 */
export declare const processInspectionReport: (inspectionId: string, report: InspectionReport, transaction?: Transaction) => Promise<{
    processed: boolean;
    underwritingImpact: string;
}>;
/**
 * 36. Validates inspection findings.
 *
 * @param {InspectionFinding[]} findings - Inspection findings
 * @returns {Promise<{ critical: number; major: number; minor: number; approvable: boolean }>} Findings summary
 */
export declare const validateInspectionFindings: (findings: InspectionFinding[]) => Promise<{
    critical: number;
    major: number;
    minor: number;
    approvable: boolean;
}>;
/**
 * 37. Analyzes applicant loss history.
 *
 * @param {string} applicantId - Applicant identifier
 * @param {number} yearsBack - Number of years to analyze
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<LossHistoryAnalysis>} Loss history analysis
 */
export declare const analyzeLossHistory: (applicantId: string, yearsBack: number, transaction?: Transaction) => Promise<LossHistoryAnalysis>;
/**
 * 38. Calculates credit-based insurance score.
 *
 * @param {string} applicantId - Applicant identifier
 * @param {Record<string, any>} creditData - Credit information
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<CreditInsuranceScore>} Insurance score
 */
export declare const calculateCreditInsuranceScore: (applicantId: string, creditData: Record<string, any>, transaction?: Transaction) => Promise<CreditInsuranceScore>;
/**
 * 39. Classifies occupation risk.
 *
 * @param {string} occupationCode - Occupation code or title
 * @param {string} industry - Industry sector
 * @returns {Promise<OccupationClassification>} Occupation classification
 */
export declare const classifyOccupation: (occupationCode: string, industry: string) => Promise<OccupationClassification>;
/**
 * 40. Checks underwriting capacity.
 *
 * @param {string} lineOfBusiness - Line of business
 * @param {number} requestedAmount - Requested coverage amount
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingCapacity>} Capacity information
 */
export declare const checkUnderwritingCapacity: (lineOfBusiness: string, requestedAmount: number, transaction?: Transaction) => Promise<UnderwritingCapacity>;
/**
 * 41. Validates binding authority.
 *
 * @param {string} underwriterId - Underwriter identifier
 * @param {Record<string, any>} applicationData - Application data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ authorized: boolean; reasons: string[]; requiresApproval: boolean }>} Authority validation
 */
export declare const validateBindingAuthority: (underwriterId: string, applicationData: Record<string, any>, transaction?: Transaction) => Promise<{
    authorized: boolean;
    reasons: string[];
    requiresApproval: boolean;
}>;
/**
 * 42. Analyzes underwriting profitability.
 *
 * @param {string} lineOfBusiness - Line of business
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<UnderwritingProfitability>} Profitability metrics
 */
export declare const analyzeUnderwritingProfitability: (lineOfBusiness: string, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<UnderwritingProfitability>;
//# sourceMappingURL=underwriting-kit.d.ts.map