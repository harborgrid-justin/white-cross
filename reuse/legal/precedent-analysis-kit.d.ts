/**
 * LOC: LGPA1234567
 * File: /reuse/legal/precedent-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal services and controllers
 *   - Precedent analysis modules
 *   - Stare decisis systems
 */
/**
 * File: /reuse/legal/precedent-analysis-kit.ts
 * Locator: WC-UTL-LGPA-001
 * Purpose: Comprehensive Legal Precedent Analysis Utilities - Precedent identification, authority classification, strength scoring
 *
 * Upstream: Independent utility module for legal precedent research
 * Downstream: ../backend/*, Legal services, Citation validators, Court hierarchy systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, @nestjs/*, class-validator
 * Exports: 41 utility functions for precedent analysis, authority classification, overruling detection, stare decisis
 *
 * LLM Context: Comprehensive legal precedent analysis utilities for precedent identification, binding vs persuasive
 * authority classification, precedent strength scoring, overruling detection, stare decisis analysis, and legal
 * precedent relationship tracking. Essential for legal research systems requiring robust precedent analysis and
 * authority evaluation capabilities. Supports multiple jurisdictions, court hierarchies, and precedential relationships.
 */
import { Sequelize, Optional } from 'sequelize';
/**
 * Represents a legal precedent with comprehensive analysis metadata.
 */
export interface LegalPrecedent {
    id: string;
    caseId: string;
    caseName: string;
    citation: string;
    decisionDate: Date;
    courtId: string;
    courtName: string;
    jurisdiction: string;
    courtLevel: CourtLevel;
    authorityType: AuthorityType;
    precedentStrength: number;
    holdings: Holding[];
    keyPrinciples: string[];
    factPattern: string;
    overruledBy?: string;
    overrulingDate?: Date;
    distinguishedBy?: string[];
    followedBy?: string[];
    citationCount: number;
    positiveCitations: number;
    negativeCitations: number;
    neutralCitations: number;
    bindingJurisdictions: string[];
    persuasiveJurisdictions: string[];
    status: PrecedentStatus;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Court hierarchy levels.
 */
export declare enum CourtLevel {
    SUPREME_COURT = "supreme_court",
    APPELLATE_COURT = "appellate_court",
    SUPERIOR_COURT = "superior_court",
    DISTRICT_COURT = "district_court",
    TRIAL_COURT = "trial_court",
    MUNICIPAL_COURT = "municipal_court",
    SPECIALIZED_COURT = "specialized_court"
}
/**
 * Types of legal authority.
 */
export declare enum AuthorityType {
    BINDING = "binding",
    PERSUASIVE = "persuasive",
    INFORMATIVE = "informative",
    SUPERSEDED = "superseded",
    OVERRULED = "overruled",
    QUESTIONED = "questioned"
}
/**
 * Status of a precedent.
 */
export declare enum PrecedentStatus {
    ACTIVE = "active",
    OVERRULED = "overruled",
    MODIFIED = "modified",
    SUPERSEDED = "superseded",
    QUESTIONED = "questioned",
    DISTINGUISHED = "distinguished",
    LIMITED = "limited"
}
/**
 * Represents a legal holding from a case.
 */
export interface Holding {
    id: string;
    precedentId: string;
    statement: string;
    legalPrinciple: string;
    applicableArea: string;
    scope: HoldingScope;
    confidence: number;
    citations?: string[];
}
/**
 * Scope of a legal holding.
 */
export declare enum HoldingScope {
    BROAD = "broad",
    MODERATE = "moderate",
    NARROW = "narrow",
    DICTA = "dicta"
}
/**
 * Precedent relationship between cases.
 */
export interface PrecedentRelationship {
    id: string;
    sourceCaseId: string;
    targetCaseId: string;
    relationshipType: RelationshipType;
    strength: number;
    description?: string;
    identifiedDate: Date;
    verifiedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Types of precedent relationships.
 */
export declare enum RelationshipType {
    FOLLOWS = "follows",
    DISTINGUISHES = "distinguishes",
    OVERRULES = "overrules",
    MODIFIES = "modifies",
    SUPERSEDES = "supersedes",
    QUESTIONS = "questions",
    AFFIRMS = "affirms",
    REVERSES = "reverses",
    CITES_APPROVINGLY = "cites_approvingly",
    CITES_CRITICALLY = "cites_critically",
    CITES_NEUTRALLY = "cites_neutrally"
}
/**
 * Authority classification result.
 */
export interface AuthorityClassification {
    precedentId: string;
    targetJurisdiction: string;
    targetCourt: string;
    authorityType: AuthorityType;
    bindingReason?: string;
    applicabilityScore: number;
    hierarchyDistance: number;
    jurisdictionalAlignment: number;
    temporalRelevance: number;
    overallStrength: number;
}
/**
 * Precedent strength analysis result.
 */
export interface PrecedentStrengthAnalysis {
    precedentId: string;
    overallStrength: number;
    citationScore: number;
    courtAuthorityScore: number;
    temporalScore: number;
    treatmentScore: number;
    consistencyScore: number;
    factors: StrengthFactor[];
    weaknesses: string[];
    strengths: string[];
}
/**
 * Individual strength factor.
 */
export interface StrengthFactor {
    name: string;
    score: number;
    weight: number;
    description: string;
}
/**
 * Overruling detection result.
 */
export interface OverrulingDetection {
    precedentId: string;
    isOverruled: boolean;
    overrulingCaseId?: string;
    overrulingCaseName?: string;
    overrulingDate?: Date;
    overrulingScope: OverrulingScope;
    confidence: number;
    reasoning: string;
    partialOverruling?: PartialOverruling[];
}
/**
 * Scope of overruling.
 */
export declare enum OverrulingScope {
    COMPLETE = "complete",
    PARTIAL = "partial",
    IMPLICIT = "implicit",
    PROSPECTIVE = "prospective",
    NONE = "none"
}
/**
 * Represents partial overruling of specific holdings.
 */
export interface PartialOverruling {
    holdingId: string;
    overrulingStatement: string;
    newPrinciple?: string;
}
/**
 * Stare decisis analysis result.
 */
export interface StareDecisisAnalysis {
    precedentId: string;
    currentCaseId: string;
    shouldFollow: boolean;
    bindingLevel: BindingLevel;
    factorsSimilarity: number;
    legalIssuesSimilarity: number;
    jurisdictionalBinding: boolean;
    distinguishingFactors: string[];
    supportingFactors: string[];
    recommendation: StareDecisisRecommendation;
}
/**
 * Level of binding precedent.
 */
export declare enum BindingLevel {
    STRICTLY_BINDING = "strictly_binding",
    PRESUMPTIVELY_BINDING = "presumptively_binding",
    PERSUASIVE = "persuasive",
    NOT_BINDING = "not_binding"
}
/**
 * Recommendation for applying stare decisis.
 */
export declare enum StareDecisisRecommendation {
    FOLLOW_PRECEDENT = "follow_precedent",
    DISTINGUISH_PRECEDENT = "distinguish_precedent",
    OVERRULE_PRECEDENT = "overrule_precedent",
    MODIFY_PRECEDENT = "modify_precedent",
    CONSIDER_PERSUASIVE = "consider_persuasive"
}
/**
 * Precedent search query.
 */
export interface PrecedentSearchQuery {
    query?: string;
    jurisdiction?: string[];
    courtLevel?: CourtLevel[];
    authorityType?: AuthorityType[];
    legalIssues?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    minStrength?: number;
    status?: PrecedentStatus[];
    excludeOverruled?: boolean;
    limit?: number;
    offset?: number;
}
/**
 * Precedent search result.
 */
export interface PrecedentSearchResult {
    precedents: LegalPrecedent[];
    total: number;
    page: number;
    pageSize: number;
    facets?: PrecedentFacets;
}
/**
 * Search result facets for precedent filtering.
 */
export interface PrecedentFacets {
    jurisdictions: {
        name: string;
        count: number;
    }[];
    courts: {
        name: string;
        count: number;
    }[];
    authorityTypes: {
        type: AuthorityType;
        count: number;
    }[];
    years: {
        year: number;
        count: number;
    }[];
}
/**
 * Citation treatment analysis.
 */
export interface CitationTreatment {
    precedentId: string;
    totalCitations: number;
    positiveTreatment: number;
    negativeTreatment: number;
    neutralTreatment: number;
    treatmentHistory: TreatmentEvent[];
    overallSentiment: CitationSentiment;
}
/**
 * Citation sentiment.
 */
export declare enum CitationSentiment {
    STRONGLY_POSITIVE = "strongly_positive",
    POSITIVE = "positive",
    NEUTRAL = "neutral",
    NEGATIVE = "negative",
    STRONGLY_NEGATIVE = "strongly_negative"
}
/**
 * Individual treatment event.
 */
export interface TreatmentEvent {
    citingCaseId: string;
    citingCaseName: string;
    date: Date;
    treatment: RelationshipType;
    context?: string;
}
/**
 * Sequelize model attributes for LegalPrecedent.
 */
export interface LegalPrecedentAttributes {
    id: string;
    caseId: string;
    caseName: string;
    citation: string;
    decisionDate: Date;
    courtId: string;
    courtName: string;
    jurisdiction: string;
    courtLevel: CourtLevel;
    authorityType: AuthorityType;
    precedentStrength: number;
    holdings: Record<string, any>[];
    keyPrinciples: string[];
    factPattern: string;
    overruledBy?: string;
    overrulingDate?: Date;
    distinguishedBy?: string[];
    followedBy?: string[];
    citationCount: number;
    positiveCitations: number;
    negativeCitations: number;
    neutralCitations: number;
    bindingJurisdictions: string[];
    persuasiveJurisdictions: string[];
    status: PrecedentStatus;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface LegalPrecedentCreationAttributes extends Optional<LegalPrecedentAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Defines Sequelize model for legal precedents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Legal precedent model
 *
 * @example
 * ```typescript
 * const PrecedentModel = defineLegalPrecedentModel(sequelize);
 * const precedent = await PrecedentModel.create({
 *   caseId: 'case-123',
 *   caseName: 'Marbury v. Madison',
 *   citation: '5 U.S. 137 (1803)',
 *   // ... other fields
 * });
 * ```
 */
export declare const defineLegalPrecedentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        caseId: string;
        caseName: string;
        citation: string;
        decisionDate: Date;
        courtId: string;
        courtName: string;
        jurisdiction: string;
        courtLevel: CourtLevel;
        authorityType: AuthorityType;
        precedentStrength: number;
        holdings: Record<string, any>[];
        keyPrinciples: string[];
        factPattern: string;
        overruledBy?: string;
        overrulingDate?: Date;
        distinguishedBy?: string[];
        followedBy?: string[];
        citationCount: number;
        positiveCitations: number;
        negativeCitations: number;
        neutralCitations: number;
        bindingJurisdictions: string[];
        persuasiveJurisdictions: string[];
        status: PrecedentStatus;
        metadata?: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model attributes for PrecedentRelationship.
 */
export interface PrecedentRelationshipAttributes {
    id: string;
    sourceCaseId: string;
    targetCaseId: string;
    relationshipType: RelationshipType;
    strength: number;
    description?: string;
    identifiedDate: Date;
    verifiedBy?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface PrecedentRelationshipCreationAttributes extends Optional<PrecedentRelationshipAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Defines Sequelize model for precedent relationships.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Precedent relationship model
 *
 * @example
 * ```typescript
 * const RelationshipModel = definePrecedentRelationshipModel(sequelize);
 * const relationship = await RelationshipModel.create({
 *   sourceCaseId: 'case-123',
 *   targetCaseId: 'case-456',
 *   relationshipType: RelationshipType.FOLLOWS
 * });
 * ```
 */
export declare const definePrecedentRelationshipModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        sourceCaseId: string;
        targetCaseId: string;
        relationshipType: RelationshipType;
        strength: number;
        description?: string;
        identifiedDate: Date;
        verifiedBy?: string;
        metadata?: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Identifies potential precedents for a given legal issue.
 *
 * @param {string} legalIssue - Legal issue description
 * @param {string} jurisdiction - Target jurisdiction
 * @param {LegalPrecedent[]} candidatePrecedents - Pool of candidate precedents
 * @returns {LegalPrecedent[]} Identified relevant precedents sorted by relevance
 *
 * @example
 * ```typescript
 * const precedents = identifyRelevantPrecedents(
 *   'Fourth Amendment search and seizure',
 *   'federal',
 *   allPrecedents
 * );
 * ```
 */
export declare const identifyRelevantPrecedents: (legalIssue: string, jurisdiction: string, candidatePrecedents: LegalPrecedent[]) => LegalPrecedent[];
/**
 * Finds precedents by specific holdings.
 *
 * @param {string} holdingQuery - Holding search query
 * @param {LegalPrecedent[]} precedents - Precedents to search
 * @returns {Array<{precedent: LegalPrecedent; matchingHoldings: Holding[]}>} Matching precedents with holdings
 *
 * @example
 * ```typescript
 * const matches = findPrecedentsByHolding('reasonable expectation of privacy', precedents);
 * ```
 */
export declare const findPrecedentsByHolding: (holdingQuery: string, precedents: LegalPrecedent[]) => Array<{
    precedent: LegalPrecedent;
    matchingHoldings: Holding[];
}>;
/**
 * Identifies landmark precedents in a jurisdiction.
 *
 * @param {string} jurisdiction - Target jurisdiction
 * @param {LegalPrecedent[]} precedents - All precedents
 * @param {number} minCitations - Minimum citation count (default: 100)
 * @returns {LegalPrecedent[]} Landmark precedents sorted by importance
 *
 * @example
 * ```typescript
 * const landmarks = identifyLandmarkPrecedents('federal', allPrecedents, 500);
 * ```
 */
export declare const identifyLandmarkPrecedents: (jurisdiction: string, precedents: LegalPrecedent[], minCitations?: number) => LegalPrecedent[];
/**
 * Identifies recent precedents within a time window.
 *
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {LegalPrecedent[]} precedents - All precedents
 * @returns {LegalPrecedent[]} Recent precedents
 *
 * @example
 * ```typescript
 * const recent = identifyRecentPrecedents(
 *   new Date('2020-01-01'),
 *   new Date('2024-12-31'),
 *   allPrecedents
 * );
 * ```
 */
export declare const identifyRecentPrecedents: (fromDate: Date, toDate: Date, precedents: LegalPrecedent[]) => LegalPrecedent[];
/**
 * Classifies whether a precedent is binding or persuasive for a jurisdiction.
 *
 * @param {LegalPrecedent} precedent - Precedent to classify
 * @param {string} targetJurisdiction - Target jurisdiction
 * @param {string} targetCourtId - Target court ID
 * @returns {AuthorityClassification} Authority classification result
 *
 * @example
 * ```typescript
 * const classification = classifyPrecedentAuthority(precedent, 'california', 'ca-supreme-court');
 * ```
 */
export declare const classifyPrecedentAuthority: (precedent: LegalPrecedent, targetJurisdiction: string, targetCourtId: string) => AuthorityClassification;
/**
 * Determines binding authority level for a precedent.
 *
 * @param {AuthorityClassification} classification - Authority classification
 * @returns {BindingLevel} Binding level
 *
 * @example
 * ```typescript
 * const bindingLevel = determineBindingLevel(classification);
 * ```
 */
export declare const determineBindingLevel: (classification: AuthorityClassification) => BindingLevel;
/**
 * Evaluates jurisdictional reach of a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to evaluate
 * @returns {string[]} List of jurisdictions where precedent has authority
 *
 * @example
 * ```typescript
 * const reach = evaluateJurisdictionalReach(precedent);
 * // Result: ['federal', 'california', 'ninth-circuit']
 * ```
 */
export declare const evaluateJurisdictionalReach: (precedent: LegalPrecedent) => string[];
/**
 * Compares authority strength between multiple precedents.
 *
 * @param {LegalPrecedent[]} precedents - Precedents to compare
 * @param {string} targetJurisdiction - Target jurisdiction
 * @returns {Array<{precedent: LegalPrecedent; authorityScore: number}>} Ranked precedents
 *
 * @example
 * ```typescript
 * const ranked = compareAuthorityStrength(precedents, 'california');
 * ```
 */
export declare const compareAuthorityStrength: (precedents: LegalPrecedent[], targetJurisdiction: string) => Array<{
    precedent: LegalPrecedent;
    authorityScore: number;
}>;
/**
 * Calculates comprehensive precedent strength score.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @returns {PrecedentStrengthAnalysis} Detailed strength analysis
 *
 * @example
 * ```typescript
 * const analysis = calculatePrecedentStrength(precedent);
 * // Result: { overallStrength: 85, citationScore: 90, ... }
 * ```
 */
export declare const calculatePrecedentStrength: (precedent: LegalPrecedent) => PrecedentStrengthAnalysis;
/**
 * Scores precedent based on citation metrics.
 *
 * @param {LegalPrecedent} precedent - Precedent to score
 * @returns {number} Citation score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCitationScore(precedent);
 * ```
 */
export declare const calculateCitationScore: (precedent: LegalPrecedent) => number;
/**
 * Scores precedent based on court authority level.
 *
 * @param {CourtLevel} courtLevel - Court level
 * @returns {number} Court authority score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCourtAuthorityScore(CourtLevel.SUPREME_COURT);
 * // Result: 100
 * ```
 */
export declare const calculateCourtAuthorityScore: (courtLevel: CourtLevel) => number;
/**
 * Calculates temporal relevance score based on decision date.
 *
 * @param {Date} decisionDate - Date of decision
 * @returns {number} Temporal relevance score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateTemporalRelevance(new Date('2020-01-01'));
 * ```
 */
export declare const calculateTemporalRelevance: (decisionDate: Date) => number;
/**
 * Calculates treatment score based on citation treatment.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @returns {number} Treatment score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateTreatmentScore(precedent);
 * ```
 */
export declare const calculateTreatmentScore: (precedent: LegalPrecedent) => number;
/**
 * Evaluates consistency of precedent with related cases.
 *
 * @param {LegalPrecedent} precedent - Precedent to evaluate
 * @returns {number} Consistency score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateConsistencyScore(precedent);
 * ```
 */
export declare const calculateConsistencyScore: (precedent: LegalPrecedent) => number;
/**
 * Detects if a precedent has been overruled.
 *
 * @param {LegalPrecedent} precedent - Precedent to check
 * @param {PrecedentRelationship[]} relationships - All precedent relationships
 * @returns {OverrulingDetection} Overruling detection result
 *
 * @example
 * ```typescript
 * const detection = detectOverruling(precedent, relationships);
 * ```
 */
export declare const detectOverruling: (precedent: LegalPrecedent, relationships: PrecedentRelationship[]) => OverrulingDetection;
/**
 * Identifies cases that have overruled a specific holding.
 *
 * @param {Holding} holding - Holding to check
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {string[]} Case IDs that overruled the holding
 *
 * @example
 * ```typescript
 * const overrulers = identifyHoldingOverrule(holding, relationships);
 * ```
 */
export declare const identifyHoldingOverrule: (holding: Holding, relationships: PrecedentRelationship[]) => string[];
/**
 * Analyzes the scope of overruling (complete vs partial).
 *
 * @param {LegalPrecedent} precedent - Overruled precedent
 * @param {string} overrulingCaseId - Case that overruled
 * @param {PrecedentRelationship} relationship - Relationship details
 * @returns {OverrulingScope} Scope of overruling
 *
 * @example
 * ```typescript
 * const scope = analyzeOverrulingScope(precedent, 'case-123', relationship);
 * ```
 */
export declare const analyzeOverrulingScope: (precedent: LegalPrecedent, overrulingCaseId: string, relationship: PrecedentRelationship) => OverrulingScope;
/**
 * Tracks overruling history of a precedent over time.
 *
 * @param {LegalPrecedent} precedent - Precedent to track
 * @param {PrecedentRelationship[]} relationships - Historical relationships
 * @returns {TreatmentEvent[]} Timeline of overruling events
 *
 * @example
 * ```typescript
 * const history = trackOverrulingHistory(precedent, relationships);
 * ```
 */
export declare const trackOverrulingHistory: (precedent: LegalPrecedent, relationships: PrecedentRelationship[]) => TreatmentEvent[];
/**
 * Analyzes whether stare decisis requires following a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {string} currentCaseId - Current case ID
 * @param {string} currentJurisdiction - Current jurisdiction
 * @param {string[]} currentFactors - Current case fact pattern
 * @returns {StareDecisisAnalysis} Stare decisis analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeStareDecisis(precedent, 'case-123', 'california', factPattern);
 * ```
 */
export declare const analyzeStareDecisis: (precedent: LegalPrecedent, currentCaseId: string, currentJurisdiction: string, currentFactors: string[]) => StareDecisisAnalysis;
/**
 * Evaluates factors for distinguishing a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to distinguish
 * @param {string} currentFactPattern - Current case fact pattern
 * @returns {string[]} List of distinguishing factors
 *
 * @example
 * ```typescript
 * const factors = evaluateDistinguishingFactors(precedent, currentFacts);
 * ```
 */
export declare const evaluateDistinguishingFactors: (precedent: LegalPrecedent, currentFactPattern: string) => string[];
/**
 * Determines if a precedent should be followed based on stare decisis principles.
 *
 * @param {StareDecisisAnalysis} analysis - Stare decisis analysis
 * @returns {boolean} Whether precedent should be followed
 *
 * @example
 * ```typescript
 * const shouldFollow = shouldFollowPrecedent(analysis);
 * ```
 */
export declare const shouldFollowPrecedent: (analysis: StareDecisisAnalysis) => boolean;
/**
 * Generates recommendation for applying precedent.
 *
 * @param {StareDecisisAnalysis} analysis - Stare decisis analysis
 * @returns {string} Detailed recommendation
 *
 * @example
 * ```typescript
 * const recommendation = generatePrecedentRecommendation(analysis);
 * ```
 */
export declare const generatePrecedentRecommendation: (analysis: StareDecisisAnalysis) => string;
/**
 * Analyzes how a precedent has been treated by subsequent cases.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {CitationTreatment} Citation treatment analysis
 *
 * @example
 * ```typescript
 * const treatment = analyzeCitationTreatment(precedent, relationships);
 * ```
 */
export declare const analyzeCitationTreatment: (precedent: LegalPrecedent, relationships: PrecedentRelationship[]) => CitationTreatment;
/**
 * Identifies negative treatment of a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {TreatmentEvent[]} Negative treatment events
 *
 * @example
 * ```typescript
 * const negativeTreatment = identifyNegativeTreatment(precedent, relationships);
 * ```
 */
export declare const identifyNegativeTreatment: (precedent: LegalPrecedent, relationships: PrecedentRelationship[]) => TreatmentEvent[];
/**
 * Creates Swagger schema for LegalPrecedent.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createLegalPrecedentSwaggerSchema();
 * ```
 */
export declare const createLegalPrecedentSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger schema for PrecedentStrengthAnalysis.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createPrecedentStrengthSwaggerSchema();
 * ```
 */
export declare const createPrecedentStrengthSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger schema for StareDecisisAnalysis.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createStareDecisisSwaggerSchema();
 * ```
 */
export declare const createStareDecisisSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger schema for OverrulingDetection.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createOverrulingDetectionSwaggerSchema();
 * ```
 */
export declare const createOverrulingDetectionSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger operation for precedent search endpoint.
 *
 * @returns {Record<string, any>} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = createPrecedentSearchSwaggerOperation();
 * ```
 */
export declare const createPrecedentSearchSwaggerOperation: () => Record<string, any>;
//# sourceMappingURL=precedent-analysis-kit.d.ts.map