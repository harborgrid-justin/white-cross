/**
 * LOC: LEGALOPN1234567
 * File: /reuse/legal/legal-opinion-drafting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ./citation-validation-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend legal opinion services
 *   - Legal writing controllers
 *   - Opinion analysis endpoints
 */
/**
 * File: /reuse/legal/legal-opinion-drafting-kit.ts
 * Locator: WC-LEGAL-OPNDFT-001
 * Purpose: Comprehensive Legal Opinion Writing & Analysis System - Enterprise-grade legal opinion drafting
 *
 * Upstream: Error handling, validation, citation validation utilities
 * Downstream: ../backend/*, Legal opinion controllers, analysis services, writing platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 35+ utility functions for opinion templates, issue spotting, legal reasoning, quality scoring
 *
 * LLM Context: Enterprise legal opinion writing system for law firms, corporate legal departments,
 * and legal education. Provides IRAC, CREAC, and TREAT methodology templates, advanced issue spotting,
 * legal reasoning frameworks (syllogistic, analogical, policy-based), citation integration, quality
 * assessment, and comprehensive opinion management with structured analysis and review capabilities.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Opinion methodology frameworks
 */
export type OpinionMethodology = 'IRAC' | 'CREAC' | 'TREAT' | 'CRAC' | 'IDAR' | 'FIRAC';
/**
 * Legal reasoning types
 */
export type ReasoningType = 'SYLLOGISTIC' | 'ANALOGICAL' | 'POLICY' | 'TEXTUAL' | 'STRUCTURAL' | 'HISTORICAL' | 'PRUDENTIAL';
/**
 * Issue complexity levels
 */
export type IssueComplexity = 'STRAIGHTFORWARD' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX';
/**
 * Opinion types
 */
export type OpinionType = 'LEGAL_MEMO' | 'FORMAL_OPINION' | 'ADVICE_LETTER' | 'COURT_BRIEF' | 'ACADEMIC_ANALYSIS';
/**
 * Citation signal types for legal authorities
 */
export type CitationSignal = 'NO_SIGNAL' | 'SEE' | 'SEE_ALSO' | 'CF' | 'COMPARE' | 'CONTRA' | 'BUT_SEE' | 'BUT_CF' | 'SEE_GENERALLY';
/**
 * Comprehensive legal opinion structure
 */
export interface LegalOpinionStructure {
    opinionId: string;
    title: string;
    opinionType: OpinionType;
    methodology: OpinionMethodology;
    clientMatter: {
        clientId: string;
        clientName: string;
        matterNumber: string;
        matterDescription: string;
    };
    questionPresented: string[];
    briefAnswer: string[];
    sections: OpinionSection[];
    conclusion: string;
    recommendations?: string[];
    limitations?: string[];
    metadata: OpinionMetadata;
    status: 'DRAFT' | 'REVIEW' | 'FINAL' | 'APPROVED';
    version: number;
}
/**
 * Opinion section with structured content
 */
export interface OpinionSection {
    sectionId: string;
    sectionType: 'FACTS' | 'ISSUE' | 'RULE' | 'ANALYSIS' | 'CONCLUSION' | 'COUNTERARGUMENT';
    heading: string;
    content: string;
    subsections?: OpinionSection[];
    citations: CitationReference[];
    footnotes?: Footnote[];
    order: number;
}
/**
 * Citation reference in opinion context
 */
export interface CitationReference {
    citationId: string;
    signal: CitationSignal;
    authority: {
        type: 'CASE' | 'STATUTE' | 'REGULATION' | 'TREATISE' | 'ARTICLE' | 'RESTATEMENT';
        citation: string;
        shortForm?: string;
    };
    parentheticalExplanation?: string;
    quotation?: {
        text: string;
        pinCite?: string;
    };
    weight: 'BINDING' | 'PERSUASIVE' | 'SECONDARY';
    relevance: number;
}
/**
 * Opinion metadata
 */
export interface OpinionMetadata {
    authorId: string;
    authorName: string;
    createdDate: Date;
    lastModifiedDate: Date;
    reviewers?: Array<{
        reviewerId: string;
        reviewerName: string;
        reviewDate: Date;
    }>;
    jurisdiction: string;
    practiceArea: string;
    confidentialityLevel: 'PUBLIC' | 'CONFIDENTIAL' | 'PRIVILEGED' | 'HIGHLY_CONFIDENTIAL';
    workProduct: boolean;
    attorneyClientPrivilege: boolean;
}
/**
 * Legal issue structure for analysis
 */
export interface LegalIssue {
    issueId: string;
    issueStatement: string;
    issueCategory: string;
    complexity: IssueComplexity;
    elements: IssueElement[];
    governingLaw: {
        jurisdiction: string;
        primaryAuthority: string[];
        secondaryAuthority?: string[];
    };
    factsRelevant: string[];
    relatedIssues?: string[];
    priority: number;
    disposition: 'FAVORABLE' | 'UNFAVORABLE' | 'UNCERTAIN' | 'NOT_REACHED';
}
/**
 * Issue element for detailed analysis
 */
export interface IssueElement {
    elementId: string;
    elementName: string;
    description: string;
    legalStandard: string;
    factsSupporting: string[];
    factsOpposing: string[];
    analysis: string;
    conclusion: 'SATISFIED' | 'NOT_SATISFIED' | 'LIKELY_SATISFIED' | 'UNCLEAR';
    strength: number;
}
/**
 * IRAC methodology template
 */
export interface IRACTemplate {
    issue: {
        statement: string;
        narrowIssue: string;
        broadIssue: string;
    };
    rule: {
        primaryRule: string;
        exceptions?: string[];
        elements?: string[];
        sources: CitationReference[];
    };
    application: {
        factsToLaw: Array<{
            fact: string;
            legalElement: string;
            analysis: string;
        }>;
        analogies?: Analogy[];
        distinctions?: Distinction[];
    };
    conclusion: {
        holding: string;
        reasoning: string;
        confidence: 'HIGH' | 'MODERATE' | 'LOW';
    };
}
/**
 * CREAC methodology template (Conclusion, Rule, Explanation, Application, Conclusion)
 */
export interface CREACTemplate {
    initialConclusion: {
        statement: string;
        roadmap: string;
    };
    rule: {
        blackLetterLaw: string;
        elements: string[];
        sources: CitationReference[];
    };
    explanation: {
        ruleExplanation: string;
        caseIllustrations: CaseIllustration[];
        synthesis: string;
    };
    application: {
        factsAnalysis: string;
        elementByElementAnalysis: Array<{
            element: string;
            analysis: string;
            conclusion: string;
        }>;
        counterArguments?: string[];
    };
    finalConclusion: {
        holding: string;
        implications: string[];
    };
}
/**
 * TREAT methodology template (Thesis, Rule, Explanation, Application, Thesis restated)
 */
export interface TREATTemplate {
    thesis: {
        statement: string;
        scope: string;
    };
    rule: {
        statement: string;
        components: string[];
        authorities: CitationReference[];
    };
    explanation: {
        ruleExplanation: string;
        illustrativeCases: CaseIllustration[];
        policyRationale?: string;
    };
    application: {
        factsToRule: string;
        detailedAnalysis: string;
        analogicalReasoning?: Analogy[];
    };
    thesisRestated: {
        conclusion: string;
        synthesis: string;
    };
}
/**
 * Case illustration for rule explanation
 */
export interface CaseIllustration {
    caseName: string;
    citation: string;
    facts: string;
    holding: string;
    reasoning: string;
    relevance: string;
    outcome: 'PLAINTIFF_PREVAILED' | 'DEFENDANT_PREVAILED' | 'MIXED';
}
/**
 * Analogical reasoning structure
 */
export interface Analogy {
    analogyId: string;
    sourceCase: {
        name: string;
        citation: string;
        keyFacts: string[];
        holding: string;
    };
    targetCase: {
        keyFacts: string[];
        predictedOutcome: string;
    };
    similarities: Array<{
        aspect: string;
        sourceFactPattern: string;
        targetFactPattern: string;
        significance: 'HIGH' | 'MODERATE' | 'LOW';
    }>;
    strength: number;
}
/**
 * Distinction from precedent
 */
export interface Distinction {
    distinctionId: string;
    precedentCase: {
        name: string;
        citation: string;
        keyFacts: string[];
        holding: string;
    };
    currentCase: {
        keyFacts: string[];
    };
    differences: Array<{
        aspect: string;
        precedentFactPattern: string;
        currentFactPattern: string;
        materialDifference: boolean;
        significance: string;
    }>;
    impact: 'UNDERMINES_PRECEDENT' | 'LIMITS_PRECEDENT' | 'DISTINGUISHES_CLEARLY';
}
/**
 * Legal reasoning framework
 */
export interface ReasoningFramework {
    frameworkId: string;
    reasoningType: ReasoningType;
    majorPremise: string;
    minorPremise: string;
    conclusion: string;
    supportingAuthorities: CitationReference[];
    logicalStructure: string;
    validity: 'VALID' | 'INVALID' | 'QUESTIONABLE';
    soundness: 'SOUND' | 'UNSOUND' | 'UNCERTAIN';
}
/**
 * Syllogistic reasoning structure
 */
export interface SyllogisticReasoning extends ReasoningFramework {
    reasoningType: 'SYLLOGISTIC';
    syllogism: {
        majorPremise: string;
        minorPremise: string;
        conclusion: string;
        form: 'MODUS_PONENS' | 'MODUS_TOLLENS' | 'HYPOTHETICAL' | 'DISJUNCTIVE';
    };
}
/**
 * Policy-based reasoning
 */
export interface PolicyReasoning {
    policyId: string;
    policyGoals: string[];
    policyAnalysis: {
        socialBenefit: string;
        economicImpact: string;
        judicialEfficiency?: string;
        fairnessConsiderations: string;
    };
    alternativeOutcomes: Array<{
        outcome: string;
        policyImplications: string;
        preferability: number;
    }>;
    recommendation: string;
}
/**
 * Opinion quality metrics
 */
export interface OpinionQualityMetrics {
    overallScore: number;
    dimensions: {
        legalAnalysis: QualityDimension;
        organization: QualityDimension;
        writingClarity: QualityDimension;
        citationAccuracy: QualityDimension;
        completeness: QualityDimension;
        persuasiveness: QualityDimension;
    };
    strengths: string[];
    weaknesses: string[];
    improvementSuggestions: ImprovementSuggestion[];
    readabilityScore: {
        fleschReadingEase: number;
        fleschKincaidGrade: number;
        averageSentenceLength: number;
        complexWordPercentage: number;
    };
}
/**
 * Quality dimension scoring
 */
export interface QualityDimension {
    score: number;
    weight: number;
    criteria: Array<{
        criterion: string;
        met: boolean;
        notes?: string;
    }>;
    feedback: string;
}
/**
 * Improvement suggestion
 */
export interface ImprovementSuggestion {
    suggestionId: string;
    category: 'ANALYSIS' | 'ORGANIZATION' | 'WRITING' | 'CITATIONS' | 'COMPLETENESS';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    specificLocation?: string;
    suggestedRevision?: string;
    rationale: string;
}
/**
 * Footnote structure
 */
export interface Footnote {
    footnoteNumber: number;
    content: string;
    citations?: CitationReference[];
}
/**
 * Counter-argument structure
 */
export interface CounterArgument {
    argumentId: string;
    argumentStatement: string;
    supportingReasoning: string;
    supportingAuthorities: CitationReference[];
    rebuttal: {
        rebuttalStatement: string;
        reasoning: string;
        authorities: CitationReference[];
        effectiveness: 'STRONG' | 'MODERATE' | 'WEAK';
    };
}
/**
 * LegalOpinion Sequelize Model
 */
export declare class LegalOpinion extends Model {
    opinionId: string;
    title: string;
    opinionType: OpinionType;
    methodology: OpinionMethodology;
    clientMatter: object;
    questionPresented: string[];
    briefAnswer: string[];
    sections: object[];
    conclusion: string;
    recommendations: string[];
    limitations: string[];
    metadata: object;
    status: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize LegalOpinion model
 */
export declare function initLegalOpinionModel(sequelize: Sequelize): typeof LegalOpinion;
/**
 * OpinionAnalysis Sequelize Model
 */
export declare class OpinionAnalysis extends Model {
    analysisId: string;
    opinionId: string;
    analysisType: string;
    content: object;
    qualityScore: number;
    conductedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize OpinionAnalysis model
 */
export declare function initOpinionAnalysisModel(sequelize: Sequelize): typeof OpinionAnalysis;
/**
 * LegalIssue Sequelize Model
 */
export declare class LegalIssueModel extends Model {
    issueId: string;
    opinionId: string;
    issueStatement: string;
    issueCategory: string;
    complexity: IssueComplexity;
    elements: object[];
    governingLaw: object;
    factsRelevant: string[];
    relatedIssues: string[];
    priority: number;
    disposition: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize LegalIssue model
 */
export declare function initLegalIssueModel(sequelize: Sequelize): typeof LegalIssueModel;
/**
 * OpinionSection Sequelize Model
 */
export declare class OpinionSectionModel extends Model {
    sectionId: string;
    opinionId: string;
    parentSectionId: string | null;
    sectionType: string;
    heading: string;
    content: string;
    citations: object[];
    footnotes: object[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize OpinionSection model
 */
export declare function initOpinionSectionModel(sequelize: Sequelize): typeof OpinionSectionModel;
/**
 * Initialize all opinion models and associations
 */
export declare function initOpinionModels(sequelize: Sequelize): {
    LegalOpinion: typeof LegalOpinion;
    OpinionAnalysis: typeof OpinionAnalysis;
    LegalIssueModel: typeof LegalIssueModel;
    OpinionSectionModel: typeof OpinionSectionModel;
};
/**
 * Generate IRAC methodology template
 *
 * @param issue - Issue statement or legal question
 * @param jurisdiction - Applicable jurisdiction
 * @returns Complete IRAC template structure
 *
 * @example
 * ```typescript
 * const iracTemplate = generateIRACTemplate(
 *   'Whether the contract was validly formed under state law',
 *   'California'
 * );
 * ```
 */
export declare function generateIRACTemplate(issue: string, jurisdiction: string): IRACTemplate;
/**
 * Generate CREAC methodology template
 *
 * @param conclusion - Initial conclusion/thesis
 * @param rule - Legal rule to be explained and applied
 * @returns Complete CREAC template structure
 *
 * @example
 * ```typescript
 * const creacTemplate = generateCREACTemplate(
 *   'The contract is likely enforceable',
 *   'A valid contract requires offer, acceptance, and consideration'
 * );
 * ```
 */
export declare function generateCREACTemplate(conclusion: string, rule: string): CREACTemplate;
/**
 * Generate TREAT methodology template
 *
 * @param thesis - Main thesis/argument
 * @param rule - Applicable legal rule
 * @returns Complete TREAT template structure
 *
 * @example
 * ```typescript
 * const treatTemplate = generateTREATTemplate(
 *   'Defendant is liable for negligence',
 *   'Negligence requires duty, breach, causation, and damages'
 * );
 * ```
 */
export declare function generateTREATTemplate(thesis: string, rule: string): TREATTemplate;
/**
 * Create comprehensive opinion structure
 *
 * @param params - Opinion creation parameters
 * @returns Complete legal opinion structure
 *
 * @example
 * ```typescript
 * const opinion = createOpinionStructure({
 *   title: 'Contract Enforceability Analysis',
 *   opinionType: 'LEGAL_MEMO',
 *   methodology: 'CREAC',
 *   clientMatter: { clientId: 'C123', clientName: 'Acme Corp', matterNumber: 'M456', matterDescription: 'Contract dispute' },
 *   authorId: 'ATT001',
 *   authorName: 'Jane Doe',
 *   jurisdiction: 'California',
 *   practiceArea: 'Commercial Litigation'
 * });
 * ```
 */
export declare function createOpinionStructure(params: {
    title: string;
    opinionType: OpinionType;
    methodology: OpinionMethodology;
    clientMatter: LegalOpinionStructure['clientMatter'];
    authorId: string;
    authorName: string;
    jurisdiction: string;
    practiceArea: string;
}): LegalOpinionStructure;
/**
 * Format opinion section with proper structure
 *
 * @param sectionType - Type of section
 * @param heading - Section heading
 * @param content - Section content
 * @param citations - Citations to include
 * @returns Formatted opinion section
 */
export declare function formatOpinionSection(sectionType: OpinionSection['sectionType'], heading: string, content: string, citations?: CitationReference[]): OpinionSection;
/**
 * Merge multiple opinion sections into a cohesive structure
 *
 * @param sections - Array of sections to merge
 * @param parentHeading - Optional parent heading for grouped sections
 * @returns Merged opinion section with subsections
 */
export declare function mergeOpinionSections(sections: OpinionSection[], parentHeading?: string): OpinionSection;
/**
 * Validate opinion structure for completeness
 *
 * @param opinion - Opinion structure to validate
 * @returns Validation result with errors and warnings
 */
export declare function validateOpinionStructure(opinion: LegalOpinionStructure): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Spot legal issues from fact pattern
 *
 * @param facts - Array of facts to analyze
 * @param jurisdiction - Applicable jurisdiction
 * @param practiceArea - Area of law
 * @returns Array of identified legal issues
 *
 * @example
 * ```typescript
 * const issues = spotLegalIssues(
 *   ['Party A made oral promise', 'Party B relied on promise', 'No written agreement'],
 *   'California',
 *   'Contract Law'
 * );
 * ```
 */
export declare function spotLegalIssues(facts: string[], jurisdiction: string, practiceArea: string): LegalIssue[];
/**
 * Analyze issue elements in detail
 *
 * @param issue - Legal issue to analyze
 * @param facts - Relevant facts
 * @returns Issue with detailed element analysis
 */
export declare function analyzeIssueElements(issue: LegalIssue, facts: string[]): LegalIssue;
/**
 * Prioritize issues by importance and complexity
 *
 * @param issues - Array of legal issues
 * @returns Issues sorted by priority
 */
export declare function prioritizeIssues(issues: LegalIssue[]): LegalIssue[];
/**
 * Generate clear issue statement
 *
 * @param issue - Legal issue
 * @param format - Statement format
 * @returns Formatted issue statement
 */
export declare function generateIssueStatement(issue: LegalIssue, format?: 'WHETHER' | 'UNDER_DOES' | 'QUESTION'): string;
/**
 * Link issues to specific facts
 *
 * @param issue - Legal issue
 * @param allFacts - All available facts
 * @returns Issue with linked facts
 */
export declare function linkIssuesToFacts(issue: LegalIssue, allFacts: string[]): LegalIssue;
/**
 * Cross-reference related issues
 *
 * @param issues - Array of legal issues
 * @returns Issues with cross-references
 */
export declare function crossReferenceIssues(issues: LegalIssue[]): LegalIssue[];
/**
 * Build syllogistic reasoning structure
 *
 * @param majorPremise - General legal rule
 * @param minorPremise - Specific facts
 * @param conclusion - Legal conclusion
 * @returns Syllogistic reasoning framework
 *
 * @example
 * ```typescript
 * const reasoning = buildSyllogisticReasoning(
 *   'All contracts require consideration',
 *   'This agreement lacks consideration',
 *   'This agreement is not a valid contract'
 * );
 * ```
 */
export declare function buildSyllogisticReasoning(majorPremise: string, minorPremise: string, conclusion: string): SyllogisticReasoning;
/**
 * Construct analogical argument
 *
 * @param sourceCase - Precedent case
 * @param targetFacts - Current case facts
 * @param similarities - Key similarities
 * @returns Analogy structure
 */
export declare function constructAnalogicalArgument(sourceCase: {
    name: string;
    citation: string;
    facts: string[];
    holding: string;
}, targetFacts: string[], similarities: Array<{
    aspect: string;
    significance: 'HIGH' | 'MODERATE' | 'LOW';
}>): Analogy;
/**
 * Develop policy-based argument
 *
 * @param policyGoals - Relevant policy objectives
 * @param proposedOutcome - Proposed legal outcome
 * @returns Policy reasoning structure
 */
export declare function developPolicyArgument(policyGoals: string[], proposedOutcome: string): PolicyReasoning;
/**
 * Synthesize multiple legal authorities
 *
 * @param authorities - Array of legal authorities
 * @param synthesisGoal - Goal of synthesis (e.g., 'establish rule', 'show trend')
 * @returns Synthesized legal principle
 */
export declare function synthesizeLegalAuthorities(authorities: Array<{
    citation: string;
    holding: string;
    reasoning: string;
}>, synthesisGoal: string): {
    synthesizedPrinciple: string;
    supportingAuthorities: string[];
    minorityView?: string;
    trend?: string;
};
/**
 * Apply legal standard to facts
 *
 * @param standard - Legal standard or test
 * @param facts - Facts to which standard applies
 * @param burden - Burden of proof
 * @returns Application result
 */
export declare function applyLegalStandard(standard: string, facts: string[], burden: 'PREPONDERANCE' | 'CLEAR_AND_CONVINCING' | 'BEYOND_REASONABLE_DOUBT' | 'REASONABLE_BASIS'): {
    standardMet: boolean;
    confidence: 'HIGH' | 'MODERATE' | 'LOW';
    analysis: string;
    supportingFacts: string[];
    opposingFacts: string[];
};
/**
 * Analyze counter-arguments
 *
 * @param mainArgument - Primary legal argument
 * @param possibleCounters - Potential counter-arguments
 * @returns Counter-argument analysis
 */
export declare function counterArgumentAnalysis(mainArgument: string, possibleCounters: string[]): CounterArgument[];
/**
 * Integrate citations into opinion text
 *
 * @param text - Opinion text
 * @param citations - Citations to integrate
 * @param style - Citation style (Bluebook, etc.)
 * @returns Text with integrated citations
 */
export declare function integrateCitations(text: string, citations: CitationReference[], style?: 'BLUEBOOK' | 'ALWD' | 'APA'): string;
/**
 * Validate citation placement
 *
 * @param section - Opinion section
 * @returns Validation result
 */
export declare function validateCitationPlacement(section: OpinionSection): {
    valid: boolean;
    issues: string[];
    suggestions: string[];
};
/**
 * Generate appropriate citation signals
 *
 * @param relationship - Relationship between proposition and authority
 * @returns Appropriate citation signal
 */
export declare function generateCitationSignal(relationship: 'DIRECTLY_SUPPORTS' | 'INDIRECTLY_SUPPORTS' | 'BACKGROUND' | 'COMPARE' | 'CONTRAST'): CitationSignal;
/**
 * Build table of authorities section
 *
 * @param opinion - Legal opinion
 * @returns Formatted table of authorities
 */
export declare function buildAuthoritiesSection(opinion: LegalOpinionStructure): {
    cases: Array<{
        name: string;
        citation: string;
        pages: number[];
    }>;
    statutes: Array<{
        name: string;
        citation: string;
        pages: number[];
    }>;
    secondarySources: Array<{
        name: string;
        citation: string;
        pages: number[];
    }>;
};
/**
 * Score opinion quality across multiple dimensions
 *
 * @param opinion - Legal opinion to score
 * @returns Comprehensive quality metrics
 *
 * @example
 * ```typescript
 * const quality = scoreOpinionQuality(opinion);
 * console.log(`Overall score: ${quality.overallScore}/100`);
 * ```
 */
export declare function scoreOpinionQuality(opinion: LegalOpinionStructure): OpinionQualityMetrics;
/**
 * Review opinion for completeness
 *
 * @param opinion - Legal opinion to review
 * @returns Completeness review results
 */
export declare function reviewOpinionCompleteness(opinion: LegalOpinionStructure): {
    complete: boolean;
    missingElements: string[];
    recommendations: string[];
};
/**
 * Assess strength of legal reasoning
 *
 * @param reasoning - Reasoning framework to assess
 * @returns Strength assessment
 */
export declare function assessReasoningStrength(reasoning: ReasoningFramework): {
    strength: 'STRONG' | 'MODERATE' | 'WEAK';
    score: number;
    analysis: string;
    improvements: string[];
};
/**
 * Generate improvement suggestions for opinion
 *
 * @param opinion - Legal opinion
 * @param qualityMetrics - Quality assessment results
 * @returns Array of prioritized improvement suggestions
 */
export declare function generateImprovementSuggestions(opinion: LegalOpinionStructure, qualityMetrics: OpinionQualityMetrics): ImprovementSuggestion[];
/**
 * Legal Opinion Service for NestJS
 * Provides comprehensive opinion drafting and management operations
 */
export declare class LegalOpinionService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    /**
     * Create new legal opinion
     */
    createOpinion(opinionData: Partial<LegalOpinionStructure>, transaction?: Transaction): Promise<LegalOpinion>;
    /**
     * Generate opinion using specified methodology
     */
    generateOpinionWithMethodology(methodology: OpinionMethodology, params: any): Promise<IRACTemplate | CREACTemplate | TREATTemplate>;
    /**
     * Analyze opinion quality
     */
    analyzeOpinionQuality(opinionId: string): Promise<OpinionQualityMetrics>;
    /**
     * Spot legal issues in fact pattern
     */
    spotIssues(facts: string[], jurisdiction: string, practiceArea: string): Promise<LegalIssue[]>;
    /**
     * Get opinion with full analysis
     */
    getOpinionWithAnalysis(opinionId: string): Promise<{
        opinion: LegalOpinion;
        analyses: OpinionAnalysis[];
        issues: LegalIssueModel[];
        sections: OpinionSectionModel[];
    }>;
}
declare const _default: {
    LegalOpinion: typeof LegalOpinion;
    OpinionAnalysis: typeof OpinionAnalysis;
    LegalIssueModel: typeof LegalIssueModel;
    OpinionSectionModel: typeof OpinionSectionModel;
    initLegalOpinionModel: typeof initLegalOpinionModel;
    initOpinionAnalysisModel: typeof initOpinionAnalysisModel;
    initLegalIssueModel: typeof initLegalIssueModel;
    initOpinionSectionModel: typeof initOpinionSectionModel;
    initOpinionModels: typeof initOpinionModels;
    generateIRACTemplate: typeof generateIRACTemplate;
    generateCREACTemplate: typeof generateCREACTemplate;
    generateTREATTemplate: typeof generateTREATTemplate;
    createOpinionStructure: typeof createOpinionStructure;
    formatOpinionSection: typeof formatOpinionSection;
    mergeOpinionSections: typeof mergeOpinionSections;
    validateOpinionStructure: typeof validateOpinionStructure;
    spotLegalIssues: typeof spotLegalIssues;
    analyzeIssueElements: typeof analyzeIssueElements;
    prioritizeIssues: typeof prioritizeIssues;
    generateIssueStatement: typeof generateIssueStatement;
    linkIssuesToFacts: typeof linkIssuesToFacts;
    crossReferenceIssues: typeof crossReferenceIssues;
    buildSyllogisticReasoning: typeof buildSyllogisticReasoning;
    constructAnalogicalArgument: typeof constructAnalogicalArgument;
    developPolicyArgument: typeof developPolicyArgument;
    synthesizeLegalAuthorities: typeof synthesizeLegalAuthorities;
    applyLegalStandard: typeof applyLegalStandard;
    counterArgumentAnalysis: typeof counterArgumentAnalysis;
    integrateCitations: typeof integrateCitations;
    validateCitationPlacement: typeof validateCitationPlacement;
    generateCitationSignal: typeof generateCitationSignal;
    buildAuthoritiesSection: typeof buildAuthoritiesSection;
    scoreOpinionQuality: typeof scoreOpinionQuality;
    reviewOpinionCompleteness: typeof reviewOpinionCompleteness;
    assessReasoningStrength: typeof assessReasoningStrength;
    generateImprovementSuggestions: typeof generateImprovementSuggestions;
    LegalOpinionService: typeof LegalOpinionService;
};
export default _default;
//# sourceMappingURL=legal-opinion-drafting-kit.d.ts.map