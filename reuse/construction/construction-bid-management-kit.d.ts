/**
 * LOC: CONSBID12345
 * File: /reuse/construction/construction-bid-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Procurement controllers
 *   - Bid evaluation engines
 *   - Vendor management services
 */
import { BidSolicitation } from './models/bid-solicitation.model';
import { BidSubmission } from './models/bid-submission.model';
import { VendorPrequalification } from './models/vendor-prequalification.model';
import { ProcurementMethod, AwardMethod } from './types/bid.types';
/**
 * Bid evaluation criteria type
 */
export declare enum EvaluationCriteriaType {
    TECHNICAL = "technical",
    FINANCIAL = "financial",
    PAST_PERFORMANCE = "past_performance",
    EXPERIENCE = "experience",
    SCHEDULE = "schedule",
    SAFETY = "safety",
    QUALITY = "quality"
}
/**
 * Bid evaluation interface
 */
export interface BidEvaluation {
    id: string;
    bidId: string;
    criterionId: string;
    evaluatorId: string;
    evaluatorName: string;
    score: number;
    maxScore: number;
    comments: string;
    strengths: string[];
    weaknesses: string[];
    evaluatedAt: Date;
    metadata: Record<string, any>;
}
/**
 * Bid comparison interface
 */
export interface BidComparison {
    solicitationId: string;
    bids: Array<{
        bidId: string;
        vendorName: string;
        bidAmount: number;
        technicalScore: number;
        totalScore: number;
        rank: number;
        responsive: boolean;
    }>;
    lowestBid: number;
    highestBid: number;
    averageBid: number;
    engineerEstimate?: number;
    recommendation: string;
}
/**
 * Bid bond interface
 */
export interface BidBond {
    id: string;
    bidId: string;
    bondNumber: string;
    bondProvider: string;
    bondAmount: number;
    bondPercentage: number;
    issueDate: Date;
    expirationDate: Date;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Award recommendation interface
 */
export interface AwardRecommendation {
    id: string;
    solicitationId: string;
    recommendedBidId: string;
    recommendedVendorId: string;
    recommendedAmount: number;
    justification: string;
    analysisNotes: string;
    alternativeConsiderations: string;
    approvals: any[];
    recommendedBy: string;
    recommendedAt: Date;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bid protest interface
 */
export interface BidProtest {
    id: string;
    solicitationId: string;
    protestingVendorId: string;
    protestNumber: string;
    protestGrounds: string;
    protestDescription: string;
    filedDate: Date;
    responseRequired: boolean;
    responseDueDate?: Date;
    response?: string;
    respondedAt?: Date;
    resolution: string;
    resolvedDate?: Date;
    status: 'FILED' | 'UNDER_REVIEW' | 'UPHELD' | 'DENIED' | 'WITHDRAWN';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Solicitation document interface
 */
export interface SolicitationDocument {
    id: string;
    documentType: string;
    documentName: string;
    documentUrl: string;
    version: string;
    uploadedAt: Date;
}
/**
 * Addendum interface
 */
export interface Addendum {
    id: string;
    addendumNumber: string;
    description: string;
    issuedDate: Date;
    documents: SolicitationDocument[];
}
/**
 * Price analysis interface
 */
export interface PriceAnalysis {
    solicitationId: string;
    engineerEstimate: number;
    lowestBid: number;
    varianceFromEstimate: number;
    variancePercentage: number;
    marketAnalysis: string;
    priceReasonableness: boolean;
    recommendations: string[];
}
/**
 * Create bid solicitation DTO
 */
export declare class CreateBidSolicitationDto {
    projectId: string;
    title: string;
    description: string;
    procurementMethod: ProcurementMethod;
    awardMethod: AwardMethod;
    estimatedValue: number;
    openingDate: Date;
    closingDate: Date;
    bondRequirement?: boolean;
}
/**
 * Submit bid DTO
 */
export declare class SubmitBidDto {
    solicitationId: string;
    vendorId: string;
    bidAmount: number;
    scheduleProposed: number;
    bidBondAmount?: number;
}
/**
 * Evaluate bid DTO
 */
export declare class EvaluateBidDto {
    bidId: string;
    criterionId: string;
    score: number;
    comments: string;
    strengths?: string[];
    weaknesses?: string[];
}
/**
 * Create vendor prequalification DTO
 */
export declare class CreateVendorPrequalificationDto {
    vendorId: string;
    workCategories: string[];
    maxProjectValue: number;
    bondingCapacity: number;
    insuranceCoverage: number;
}
/**
 * Creates new bid solicitation with evaluation criteria.
 *
 * @param {object} solicitationData - Solicitation creation data
 * @param {string} userId - User creating solicitation
 * @returns {Promise<BidSolicitation>} Created solicitation
 *
 * @example
 * ```typescript
 * const solicitation = await createBidSolicitation({
 *   projectId: 'proj-123',
 *   title: 'HVAC System Replacement',
 *   description: 'Complete replacement of building HVAC',
 *   procurementMethod: ProcurementMethod.COMPETITIVE_SEALED_BID,
 *   awardMethod: AwardMethod.LOWEST_RESPONSIVE_BID,
 *   estimatedValue: 2500000,
 *   openingDate: new Date('2025-03-01'),
 *   closingDate: new Date('2025-04-15')
 * }, 'admin-456');
 * ```
 */
export declare const createBidSolicitation: (solicitationData: any, userId: string) => Promise<BidSolicitation>;
/**
 * Publishes bid solicitation for vendor access.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User publishing solicitation
 * @returns {Promise<BidSolicitation>} Published solicitation
 *
 * @example
 * ```typescript
 * const published = await publishBidSolicitation('sol-123', 'admin-456');
 * ```
 */
export declare const publishBidSolicitation: (solicitationId: string, userId: string) => Promise<BidSolicitation>;
/**
 * Issues addendum to bid solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {object} addendumData - Addendum details
 * @param {string} userId - User issuing addendum
 * @returns {Promise<Addendum>} Created addendum
 *
 * @example
 * ```typescript
 * const addendum = await issueSolicitationAddendum('sol-123', {
 *   description: 'Clarification on HVAC specifications',
 *   documents: [{ documentName: 'Revised Specs.pdf', documentUrl: '/docs/...' }]
 * }, 'admin-456');
 * ```
 */
export declare const issueSolicitationAddendum: (solicitationId: string, addendumData: any, userId: string) => Promise<Addendum>;
/**
 * Cancels bid solicitation with justification.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling solicitation
 * @returns {Promise<BidSolicitation>} Cancelled solicitation
 *
 * @example
 * ```typescript
 * await cancelBidSolicitation('sol-123', 'Project funding withdrawn', 'admin-456');
 * ```
 */
export declare const cancelBidSolicitation: (solicitationId: string, cancellationReason: string, userId: string) => Promise<BidSolicitation>;
/**
 * Extends bid closing date with notification to vendors.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {Date} newClosingDate - New closing date
 * @param {string} reason - Reason for extension
 * @param {string} userId - User extending deadline
 * @returns {Promise<BidSolicitation>} Updated solicitation
 *
 * @example
 * ```typescript
 * await extendBidClosingDate('sol-123', new Date('2025-05-01'), 'Additional time for site visits', 'admin-456');
 * ```
 */
export declare const extendBidClosingDate: (solicitationId: string, newClosingDate: Date, reason: string, userId: string) => Promise<BidSolicitation>;
/**
 * Creates vendor prequalification application.
 *
 * @param {object} qualificationData - Qualification data
 * @param {string} userId - User creating qualification
 * @returns {Promise<VendorPrequalification>} Created qualification
 *
 * @example
 * ```typescript
 * const qual = await createVendorPrequalification({
 *   vendorId: 'vendor-123',
 *   vendorName: 'ABC Construction',
 *   workCategories: ['General Construction', 'HVAC'],
 *   maxProjectValue: 5000000,
 *   bondingCapacity: 10000000,
 *   insuranceCoverage: 5000000
 * }, 'vendor-user');
 * ```
 */
export declare const createVendorPrequalification: (qualificationData: any, userId: string) => Promise<VendorPrequalification>;
/**
 * Evaluates vendor prequalification application.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {object} evaluation - Evaluation results
 * @param {string} userId - User evaluating qualification
 * @returns {Promise<VendorPrequalification>} Updated qualification
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorPrequalification('qual-123', {
 *   safetyRating: 8.5,
 *   qualityRating: 9.0,
 *   performanceRating: 8.7,
 *   financialStrength: 'GOOD',
 *   status: VendorQualificationStatus.APPROVED
 * }, 'eval-456');
 * ```
 */
export declare const evaluateVendorPrequalification: (qualificationId: string, evaluation: any, userId: string) => Promise<VendorPrequalification>;
/**
 * Verifies vendor certifications and licenses.
 *
 * @param {string} qualificationId - Qualification identifier
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyVendorCredentials('qual-123');
 * ```
 */
export declare const verifyVendorCredentials: (qualificationId: string) => Promise<{
    certificationsValid: boolean;
    licensesValid: boolean;
    invalidItems: string[];
    verifiedAt: Date;
}>;
/**
 * Checks vendor past performance on similar projects.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {string[]} projectCategories - Project categories to check
 * @returns {Promise<object>} Past performance summary
 *
 * @example
 * ```typescript
 * const performance = await checkVendorPastPerformance('vendor-123', ['HVAC', 'Electrical']);
 * ```
 */
export declare const checkVendorPastPerformance: (vendorId: string, projectCategories: string[]) => Promise<{
    totalProjects: number;
    successfulProjects: number;
    averageRating: number;
    onTimeDelivery: number;
    onBudgetDelivery: number;
    recentProjects: any[];
}>;
/**
 * Renews vendor prequalification before expiration.
 *
 * @param {string} qualificationId - Qualification identifier
 * @param {string} userId - User renewing qualification
 * @returns {Promise<VendorPrequalification>} Renewed qualification
 *
 * @example
 * ```typescript
 * const renewed = await renewVendorPrequalification('qual-123', 'admin-456');
 * ```
 */
export declare const renewVendorPrequalification: (qualificationId: string, userId: string) => Promise<VendorPrequalification>;
/**
 * Submits bid for solicitation.
 *
 * @param {object} bidData - Bid submission data
 * @param {string} userId - User submitting bid
 * @returns {Promise<BidSubmission>} Submitted bid
 *
 * @example
 * ```typescript
 * const bid = await submitBid({
 *   solicitationId: 'sol-123',
 *   vendorId: 'vendor-456',
 *   vendorName: 'ABC Construction',
 *   bidAmount: 2350000,
 *   scheduleProposed: 180,
 *   bidBondAmount: 235000,
 *   bidBondProvider: 'Surety Co.'
 * }, 'vendor-user');
 * ```
 */
export declare const submitBid: (bidData: any, userId: string) => Promise<BidSubmission>;
/**
 * Opens bids at designated opening time.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} userId - User opening bids
 * @returns {Promise<object>} Bid opening results
 *
 * @example
 * ```typescript
 * const opening = await openBids('sol-123', 'admin-456');
 * ```
 */
export declare const openBids: (solicitationId: string, userId: string) => Promise<{
    solicitationId: string;
    openedAt: Date;
    openedBy: string;
    totalBids: number;
    bids: Array<{
        bidNumber: string;
        vendorName: string;
        bidAmount: number;
    }>;
}>;
/**
 * Validates bid responsiveness to solicitation requirements.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating bid
 * @returns {Promise<object>} Responsiveness determination
 *
 * @example
 * ```typescript
 * const responsive = await validateBidResponsiveness('bid-123', 'eval-456');
 * ```
 */
export declare const validateBidResponsiveness: (bidId: string, userId: string) => Promise<{
    responsive: boolean;
    deficiencies: string[];
    checklist: Array<{
        item: string;
        compliant: boolean;
    }>;
}>;
/**
 * Validates contractor responsibility determination.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User validating responsibility
 * @returns {Promise<object>} Responsibility determination
 *
 * @example
 * ```typescript
 * const responsible = await validateContractorResponsibility('bid-123', 'eval-456');
 * ```
 */
export declare const validateContractorResponsibility: (bidId: string, userId: string) => Promise<{
    responsible: boolean;
    findings: string[];
    criteria: Array<{
        criterion: string;
        met: boolean;
    }>;
}>;
/**
 * Requests bid clarification from vendor.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} clarificationRequest - Clarification question
 * @param {string} userId - User requesting clarification
 * @returns {Promise<object>} Clarification request
 *
 * @example
 * ```typescript
 * await requestBidClarification('bid-123', 'Please clarify HVAC equipment manufacturer', 'eval-456');
 * ```
 */
export declare const requestBidClarification: (bidId: string, clarificationRequest: string, userId: string) => Promise<{
    clarificationId: string;
    requestedAt: Date;
    responseDue: Date;
}>;
/**
 * Evaluates bid against specific criterion.
 *
 * @param {object} evaluationData - Evaluation data
 * @param {string} userId - User performing evaluation
 * @returns {Promise<BidEvaluation>} Evaluation record
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateBid({
 *   bidId: 'bid-123',
 *   criterionId: 'crit-456',
 *   score: 35,
 *   maxScore: 40,
 *   comments: 'Strong technical approach',
 *   strengths: ['Experienced team', 'Proven methodology'],
 *   weaknesses: ['Schedule somewhat aggressive']
 * }, 'eval-789');
 * ```
 */
export declare const evaluateBid: (evaluationData: any, userId: string) => Promise<BidEvaluation>;
/**
 * Calculates total weighted score for bid.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Score calculation
 *
 * @example
 * ```typescript
 * const scores = await calculateBidScore('bid-123');
 * ```
 */
export declare const calculateBidScore: (bidId: string) => Promise<{
    technicalScore: number;
    financialScore: number;
    totalScore: number;
    breakdown: Array<{
        criterion: string;
        score: number;
        weight: number;
        weightedScore: number;
    }>;
}>;
/**
 * Ranks all bids for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidSubmission[]>} Ranked bids
 *
 * @example
 * ```typescript
 * const ranked = await rankBids('sol-123');
 * ```
 */
export declare const rankBids: (solicitationId: string) => Promise<BidSubmission[]>;
/**
 * Performs consensus evaluation among evaluators.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Consensus results
 *
 * @example
 * ```typescript
 * const consensus = await performConsensusEvaluation('bid-123');
 * ```
 */
export declare const performConsensusEvaluation: (bidId: string) => Promise<{
    consensusReached: boolean;
    finalScore: number;
    evaluatorScores: Array<{
        evaluatorId: string;
        score: number;
    }>;
    variance: number;
}>;
/**
 * Normalizes scores across evaluators.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Normalized scores
 *
 * @example
 * ```typescript
 * const normalized = await normalizeEvaluatorScores('sol-123');
 * ```
 */
export declare const normalizeEvaluatorScores: (solicitationId: string) => Promise<{
    bids: Array<{
        bidId: string;
        originalScore: number;
        normalizedScore: number;
    }>;
    normalizationFactor: number;
}>;
/**
 * Generates comprehensive bid comparison.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidComparison>} Bid comparison
 *
 * @example
 * ```typescript
 * const comparison = await generateBidComparison('sol-123');
 * ```
 */
export declare const generateBidComparison: (solicitationId: string) => Promise<BidComparison>;
/**
 * Analyzes bid price reasonableness.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<PriceAnalysis>} Price analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBidPrice('bid-123');
 * ```
 */
export declare const analyzeBidPrice: (bidId: string) => Promise<PriceAnalysis>;
/**
 * Compares bid to historical pricing data.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Historical comparison
 *
 * @example
 * ```typescript
 * const historical = await compareToHistoricalPricing('bid-123');
 * ```
 */
export declare const compareToHistoricalPricing: (bidId: string) => Promise<{
    similarProjects: number;
    averageHistoricalPrice: number;
    varianceFromHistorical: number;
    trend: "INCREASING" | "DECREASING" | "STABLE";
}>;
/**
 * Evaluates value engineering proposals.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} VE evaluation
 *
 * @example
 * ```typescript
 * const veAnalysis = await evaluateValueEngineeringProposals('bid-123');
 * ```
 */
export declare const evaluateValueEngineeringProposals: (bidId: string) => Promise<{
    totalProposals: number;
    estimatedSavings: number;
    acceptedProposals: number;
    recommendations: string[];
}>;
/**
 * Generates bid tabulation sheet.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Bid tabulation
 *
 * @example
 * ```typescript
 * const tabulation = await generateBidTabulation('sol-123');
 * ```
 */
export declare const generateBidTabulation: (solicitationId: string) => Promise<{
    solicitationNumber: string;
    projectTitle: string;
    openingDate: Date;
    bids: Array<{
        rank: number;
        vendorName: string;
        baseAmount: number;
        alternates: number;
        totalAmount: number;
        responsive: boolean;
    }>;
    engineerEstimate: number;
}>;
/**
 * Validates bid bond requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Bond validation results
 *
 * @example
 * ```typescript
 * const bondValidation = await validateBidBond('bid-123');
 * ```
 */
export declare const validateBidBond: (bidId: string) => Promise<{
    valid: boolean;
    bondAmount: number;
    requiredAmount: number;
    bondProvider: string;
    expirationDate?: Date;
    deficiencies: string[];
}>;
/**
 * Verifies surety company authorization.
 *
 * @param {string} suretyCompany - Surety company name
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verified = await verifySuretyCompany('ABC Surety Co.');
 * ```
 */
export declare const verifySuretyCompany: (suretyCompany: string) => Promise<{
    authorized: boolean;
    treasuryListed: boolean;
    rating: string;
    maximumBond: number;
}>;
/**
 * Checks small business participation compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance check
 *
 * @example
 * ```typescript
 * const sbCompliance = await checkSmallBusinessCompliance('bid-123');
 * ```
 */
export declare const checkSmallBusinessCompliance: (bidId: string) => Promise<{
    compliant: boolean;
    goalPercentage: number;
    proposedPercentage: number;
    smallBusinessParticipants: string[];
}>;
/**
 * Verifies DBE (Disadvantaged Business Enterprise) compliance.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} DBE compliance check
 *
 * @example
 * ```typescript
 * const dbeCompliance = await verifyDBECompliance('bid-123');
 * ```
 */
export declare const verifyDBECompliance: (bidId: string) => Promise<{
    compliant: boolean;
    goalPercentage: number;
    proposedPercentage: number;
    dbeParticipants: string[];
    certifiedDBEs: boolean;
}>;
/**
 * Validates regulatory compliance requirements.
 *
 * @param {string} bidId - Bid identifier
 * @returns {Promise<object>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateRegulatoryCompliance('bid-123');
 * ```
 */
export declare const validateRegulatoryCompliance: (bidId: string) => Promise<{
    compliant: boolean;
    requirements: Array<{
        requirement: string;
        met: boolean;
    }>;
    deficiencies: string[];
}>;
/**
 * Creates award recommendation.
 *
 * @param {object} recommendationData - Recommendation data
 * @param {string} userId - User making recommendation
 * @returns {Promise<AwardRecommendation>} Award recommendation
 *
 * @example
 * ```typescript
 * const recommendation = await createAwardRecommendation({
 *   solicitationId: 'sol-123',
 *   recommendedBidId: 'bid-456',
 *   recommendedVendorId: 'vendor-789',
 *   recommendedAmount: 2350000,
 *   justification: 'Lowest responsive bid',
 *   analysisNotes: 'Vendor meets all requirements'
 * }, 'pm-012');
 * ```
 */
export declare const createAwardRecommendation: (recommendationData: any, userId: string) => Promise<AwardRecommendation>;
/**
 * Processes award recommendation approval.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {object} approval - Approval details
 * @returns {Promise<AwardRecommendation>} Updated recommendation
 *
 * @example
 * ```typescript
 * const approved = await processAwardApproval('rec-123', {
 *   approvedBy: 'director-456',
 *   status: 'APPROVED',
 *   comments: 'Concur with recommendation'
 * });
 * ```
 */
export declare const processAwardApproval: (recommendationId: string, approval: any) => Promise<AwardRecommendation>;
/**
 * Issues notice of award to winning bidder.
 *
 * @param {string} recommendationId - Recommendation identifier
 * @param {string} userId - User issuing award
 * @returns {Promise<object>} Award notice
 *
 * @example
 * ```typescript
 * const notice = await issueAwardNotice('rec-123', 'admin-456');
 * ```
 */
export declare const issueAwardNotice: (recommendationId: string, userId: string) => Promise<{
    awardNumber: string;
    issuedAt: Date;
    contractValue: number;
    awardedVendor: string;
}>;
/**
 * Notifies unsuccessful bidders.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} awardedBidId - Awarded bid identifier
 * @returns {Promise<object>} Notification results
 *
 * @example
 * ```typescript
 * await notifyUnsuccessfulBidders('sol-123', 'bid-456');
 * ```
 */
export declare const notifyUnsuccessfulBidders: (solicitationId: string, awardedBidId: string) => Promise<{
    notifiedCount: number;
    notificationDate: Date;
}>;
/**
 * Conducts debriefing for unsuccessful bidder.
 *
 * @param {string} bidId - Bid identifier
 * @param {string} userId - User conducting debriefing
 * @returns {Promise<object>} Debriefing summary
 *
 * @example
 * ```typescript
 * const debriefing = await conductBidderDebriefing('bid-123', 'pm-456');
 * ```
 */
export declare const conductBidderDebriefing: (bidId: string, userId: string) => Promise<{
    bidId: string;
    debriefingDate: Date;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}>;
/**
 * Files bid protest.
 *
 * @param {object} protestData - Protest data
 * @returns {Promise<BidProtest>} Filed protest
 *
 * @example
 * ```typescript
 * const protest = await fileBidProtest({
 *   solicitationId: 'sol-123',
 *   protestingVendorId: 'vendor-456',
 *   protestGrounds: 'Improper evaluation',
 *   protestDescription: 'Technical scores not properly calculated'
 * });
 * ```
 */
export declare const fileBidProtest: (protestData: any) => Promise<BidProtest>;
/**
 * Responds to bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} response - Response text
 * @param {string} userId - User responding
 * @returns {Promise<BidProtest>} Updated protest
 *
 * @example
 * ```typescript
 * const responded = await respondToBidProtest('protest-123', 'Evaluation was conducted properly...', 'admin-456');
 * ```
 */
export declare const respondToBidProtest: (protestId: string, response: string, userId: string) => Promise<BidProtest>;
/**
 * Reviews and adjudicates bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {object} adjudication - Adjudication decision
 * @param {string} userId - User adjudicating
 * @returns {Promise<BidProtest>} Adjudicated protest
 *
 * @example
 * ```typescript
 * const adjudicated = await adjudicateBidProtest('protest-123', {
 *   decision: 'DENIED',
 *   resolution: 'Evaluation was conducted in accordance with solicitation requirements'
 * }, 'director-789');
 * ```
 */
export declare const adjudicateBidProtest: (protestId: string, adjudication: any, userId: string) => Promise<BidProtest>;
/**
 * Withdraws bid protest.
 *
 * @param {string} protestId - Protest identifier
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<BidProtest>} Withdrawn protest
 *
 * @example
 * ```typescript
 * await withdrawBidProtest('protest-123', 'Issues resolved through clarification');
 * ```
 */
export declare const withdrawBidProtest: (protestId: string, reason: string) => Promise<BidProtest>;
/**
 * Retrieves protest history for solicitation.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<BidProtest[]>} Protest history
 *
 * @example
 * ```typescript
 * const protests = await getProtestHistory('sol-123');
 * ```
 */
export declare const getProtestHistory: (solicitationId: string) => Promise<BidProtest[]>;
/**
 * Generates comprehensive bid evaluation report.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Evaluation report
 *
 * @example
 * ```typescript
 * const report = await generateBidEvaluationReport('sol-123');
 * ```
 */
export declare const generateBidEvaluationReport: (solicitationId: string) => Promise<{
    solicitation: BidSolicitation;
    totalBids: number;
    responsiveBids: number;
    comparison: BidComparison;
    recommendation: AwardRecommendation | null;
}>;
/**
 * Analyzes vendor competition levels.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Competition analysis
 *
 * @example
 * ```typescript
 * const competition = await analyzeVendorCompetition('sol-123');
 * ```
 */
export declare const analyzeVendorCompetition: (solicitationId: string) => Promise<{
    totalBidders: number;
    adequateCompetition: boolean;
    priceSpread: number;
    priceSpreadPercentage: number;
    competitivenessRating: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}>;
/**
 * Tracks bid solicitation performance metrics.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackSolicitationMetrics('sol-123');
 * ```
 */
export declare const trackSolicitationMetrics: (solicitationId: string) => Promise<{
    daysToAward: number;
    evaluationDuration: number;
    responsiveRate: number;
    averageBidToEstimateRatio: number;
    protestsReceived: number;
}>;
/**
 * Generates vendor performance scorecard.
 *
 * @param {string} vendorId - Vendor identifier
 * @returns {Promise<object>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123');
 * ```
 */
export declare const generateVendorScorecard: (vendorId: string) => Promise<{
    vendorId: string;
    totalBids: number;
    successfulBids: number;
    winRate: number;
    averageBidRank: number;
    averageTechnicalScore: number;
    responsiveRate: number;
}>;
/**
 * Exports bid data for compliance reporting.
 *
 * @param {string} solicitationId - Solicitation identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'CSV')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const report = await exportBidData('sol-123', 'PDF');
 * ```
 */
export declare const exportBidData: (solicitationId: string, format: string) => Promise<Buffer>;
/**
 * Bid Management Controller
 * Provides RESTful API endpoints for bid solicitation and management
 */
export declare class BidManagementController {
    createSolicitation(createDto: CreateBidSolicitationDto): Promise<BidSolicitation>;
    getSolicitation(id: string): Promise<BidSolicitation>;
    publishSolicitation(id: string): Promise<BidSolicitation>;
    submitBidEndpoint(submitDto: SubmitBidDto): Promise<BidSubmission>;
    evaluateBidEndpoint(id: string, evaluateDto: EvaluateBidDto): Promise<BidEvaluation>;
    getBidComparison(id: string): Promise<BidComparison>;
    createPrequalification(qualDto: CreateVendorPrequalificationDto): Promise<VendorPrequalification>;
    getEvaluationReport(id: string): Promise<{
        solicitation: BidSolicitation;
        totalBids: number;
        responsiveBids: number;
        comparison: BidComparison;
        recommendation: AwardRecommendation | null;
    }>;
}
declare const _default: {
    createBidSolicitationModel: any;
    createBidSubmissionModel: any;
    createVendorPrequalificationModel: any;
    createBidSolicitation: (solicitationData: any, userId: string) => Promise<BidSolicitation>;
    publishBidSolicitation: (solicitationId: string, userId: string) => Promise<BidSolicitation>;
    issueSolicitationAddendum: (solicitationId: string, addendumData: any, userId: string) => Promise<Addendum>;
    cancelBidSolicitation: (solicitationId: string, cancellationReason: string, userId: string) => Promise<BidSolicitation>;
    extendBidClosingDate: (solicitationId: string, newClosingDate: Date, reason: string, userId: string) => Promise<BidSolicitation>;
    createVendorPrequalification: (qualificationData: any, userId: string) => Promise<VendorPrequalification>;
    evaluateVendorPrequalification: (qualificationId: string, evaluation: any, userId: string) => Promise<VendorPrequalification>;
    verifyVendorCredentials: (qualificationId: string) => Promise<{
        certificationsValid: boolean;
        licensesValid: boolean;
        invalidItems: string[];
        verifiedAt: Date;
    }>;
    checkVendorPastPerformance: (vendorId: string, projectCategories: string[]) => Promise<{
        totalProjects: number;
        successfulProjects: number;
        averageRating: number;
        onTimeDelivery: number;
        onBudgetDelivery: number;
        recentProjects: any[];
    }>;
    renewVendorPrequalification: (qualificationId: string, userId: string) => Promise<VendorPrequalification>;
    submitBid: (bidData: any, userId: string) => Promise<BidSubmission>;
    openBids: (solicitationId: string, userId: string) => Promise<{
        solicitationId: string;
        openedAt: Date;
        openedBy: string;
        totalBids: number;
        bids: Array<{
            bidNumber: string;
            vendorName: string;
            bidAmount: number;
        }>;
    }>;
    validateBidResponsiveness: (bidId: string, userId: string) => Promise<{
        responsive: boolean;
        deficiencies: string[];
        checklist: Array<{
            item: string;
            compliant: boolean;
        }>;
    }>;
    validateContractorResponsibility: (bidId: string, userId: string) => Promise<{
        responsible: boolean;
        findings: string[];
        criteria: Array<{
            criterion: string;
            met: boolean;
        }>;
    }>;
    requestBidClarification: (bidId: string, clarificationRequest: string, userId: string) => Promise<{
        clarificationId: string;
        requestedAt: Date;
        responseDue: Date;
    }>;
    evaluateBid: (evaluationData: any, userId: string) => Promise<BidEvaluation>;
    calculateBidScore: (bidId: string) => Promise<{
        technicalScore: number;
        financialScore: number;
        totalScore: number;
        breakdown: Array<{
            criterion: string;
            score: number;
            weight: number;
            weightedScore: number;
        }>;
    }>;
    rankBids: (solicitationId: string) => Promise<BidSubmission[]>;
    performConsensusEvaluation: (bidId: string) => Promise<{
        consensusReached: boolean;
        finalScore: number;
        evaluatorScores: Array<{
            evaluatorId: string;
            score: number;
        }>;
        variance: number;
    }>;
    normalizeEvaluatorScores: (solicitationId: string) => Promise<{
        bids: Array<{
            bidId: string;
            originalScore: number;
            normalizedScore: number;
        }>;
        normalizationFactor: number;
    }>;
    generateBidComparison: (solicitationId: string) => Promise<BidComparison>;
    analyzeBidPrice: (bidId: string) => Promise<PriceAnalysis>;
    compareToHistoricalPricing: (bidId: string) => Promise<{
        similarProjects: number;
        averageHistoricalPrice: number;
        varianceFromHistorical: number;
        trend: "INCREASING" | "DECREASING" | "STABLE";
    }>;
    evaluateValueEngineeringProposals: (bidId: string) => Promise<{
        totalProposals: number;
        estimatedSavings: number;
        acceptedProposals: number;
        recommendations: string[];
    }>;
    generateBidTabulation: (solicitationId: string) => Promise<{
        solicitationNumber: string;
        projectTitle: string;
        openingDate: Date;
        bids: Array<{
            rank: number;
            vendorName: string;
            baseAmount: number;
            alternates: number;
            totalAmount: number;
            responsive: boolean;
        }>;
        engineerEstimate: number;
    }>;
    validateBidBond: (bidId: string) => Promise<{
        valid: boolean;
        bondAmount: number;
        requiredAmount: number;
        bondProvider: string;
        expirationDate?: Date;
        deficiencies: string[];
    }>;
    verifySuretyCompany: (suretyCompany: string) => Promise<{
        authorized: boolean;
        treasuryListed: boolean;
        rating: string;
        maximumBond: number;
    }>;
    checkSmallBusinessCompliance: (bidId: string) => Promise<{
        compliant: boolean;
        goalPercentage: number;
        proposedPercentage: number;
        smallBusinessParticipants: string[];
    }>;
    verifyDBECompliance: (bidId: string) => Promise<{
        compliant: boolean;
        goalPercentage: number;
        proposedPercentage: number;
        dbeParticipants: string[];
        certifiedDBEs: boolean;
    }>;
    validateRegulatoryCompliance: (bidId: string) => Promise<{
        compliant: boolean;
        requirements: Array<{
            requirement: string;
            met: boolean;
        }>;
        deficiencies: string[];
    }>;
    createAwardRecommendation: (recommendationData: any, userId: string) => Promise<AwardRecommendation>;
    processAwardApproval: (recommendationId: string, approval: any) => Promise<AwardRecommendation>;
    issueAwardNotice: (recommendationId: string, userId: string) => Promise<{
        awardNumber: string;
        issuedAt: Date;
        contractValue: number;
        awardedVendor: string;
    }>;
    notifyUnsuccessfulBidders: (solicitationId: string, awardedBidId: string) => Promise<{
        notifiedCount: number;
        notificationDate: Date;
    }>;
    conductBidderDebriefing: (bidId: string, userId: string) => Promise<{
        bidId: string;
        debriefingDate: Date;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
    }>;
    fileBidProtest: (protestData: any) => Promise<BidProtest>;
    respondToBidProtest: (protestId: string, response: string, userId: string) => Promise<BidProtest>;
    adjudicateBidProtest: (protestId: string, adjudication: any, userId: string) => Promise<BidProtest>;
    withdrawBidProtest: (protestId: string, reason: string) => Promise<BidProtest>;
    getProtestHistory: (solicitationId: string) => Promise<BidProtest[]>;
    generateBidEvaluationReport: (solicitationId: string) => Promise<{
        solicitation: BidSolicitation;
        totalBids: number;
        responsiveBids: number;
        comparison: BidComparison;
        recommendation: AwardRecommendation | null;
    }>;
    analyzeVendorCompetition: (solicitationId: string) => Promise<{
        totalBidders: number;
        adequateCompetition: boolean;
        priceSpread: number;
        priceSpreadPercentage: number;
        competitivenessRating: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
    }>;
    trackSolicitationMetrics: (solicitationId: string) => Promise<{
        daysToAward: number;
        evaluationDuration: number;
        responsiveRate: number;
        averageBidToEstimateRatio: number;
        protestsReceived: number;
    }>;
    generateVendorScorecard: (vendorId: string) => Promise<{
        vendorId: string;
        totalBids: number;
        successfulBids: number;
        winRate: number;
        averageBidRank: number;
        averageTechnicalScore: number;
        responsiveRate: number;
    }>;
    exportBidData: (solicitationId: string, format: string) => Promise<Buffer>;
    BidManagementController: typeof BidManagementController;
};
export default _default;
//# sourceMappingURL=construction-bid-management-kit.d.ts.map