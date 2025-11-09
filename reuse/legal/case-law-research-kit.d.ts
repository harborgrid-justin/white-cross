/**
 * LOC: LGCL1234567
 * File: /reuse/legal/case-law-research-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal services and controllers
 *   - Case law research modules
 *   - Citation validation systems
 */
/**
 * File: /reuse/legal/case-law-research-kit.ts
 * Locator: WC-UTL-LGCL-001
 * Purpose: Comprehensive Case Law Research Utilities - Legal case management, citation validation, precedent analysis
 *
 * Upstream: Independent utility module for legal case research
 * Downstream: ../backend/*, Legal services, Citation validators, Court hierarchy systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, @nestjs/*, class-validator
 * Exports: 45 utility functions for case law research, citation parsing, precedent analysis, court hierarchy
 *
 * LLM Context: Comprehensive case law research utilities for legal citation management, case similarity analysis,
 * court hierarchy handling, citation format validation (Bluebook, APA, etc.), precedent matching, and legal
 * citation graph analysis. Essential for legal research systems requiring robust case law management and citation
 * validation capabilities. Supports multiple citation formats, court jurisdictions, and legal precedent tracking.
 */
import { Sequelize, Optional } from 'sequelize';
/**
 * Represents a legal case with comprehensive metadata.
 */
export interface LegalCase {
    id: string;
    caseNumber: string;
    caseName: string;
    partyNames: {
        plaintiff: string[];
        defendant: string[];
    };
    courtId: string;
    courtName: string;
    jurisdiction: string;
    decisionDate: Date;
    filingDate?: Date;
    judgeNames: string[];
    caseType: CaseType;
    caseStatus: CaseStatus;
    summary?: string;
    fullTextUrl?: string;
    pdfUrl?: string;
    keyPoints?: string[];
    legalIssues?: string[];
    holdings?: string[];
    precedentialValue: PrecedentialValue;
    citations: Citation[];
    citedCases?: string[];
    citingCases?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Types of legal cases.
 */
export declare enum CaseType {
    CIVIL = "civil",
    CRIMINAL = "criminal",
    ADMINISTRATIVE = "administrative",
    CONSTITUTIONAL = "constitutional",
    FAMILY = "family",
    BANKRUPTCY = "bankruptcy",
    TAX = "tax",
    IMMIGRATION = "immigration",
    LABOR = "labor",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    ENVIRONMENTAL = "environmental",
    HEALTHCARE = "healthcare",
    OTHER = "other"
}
/**
 * Status of a legal case.
 */
export declare enum CaseStatus {
    PENDING = "pending",
    ACTIVE = "active",
    DECIDED = "decided",
    APPEALED = "appealed",
    DISMISSED = "dismissed",
    SETTLED = "settled",
    WITHDRAWN = "withdrawn"
}
/**
 * Precedential value of a case.
 */
export declare enum PrecedentialValue {
    BINDING = "binding",
    PERSUASIVE = "persuasive",
    INFORMATIVE = "informative",
    UNPUBLISHED = "unpublished",
    SUPERSEDED = "superseded"
}
/**
 * Legal citation with multiple format support.
 */
export interface Citation {
    id: string;
    caseId: string;
    citationString: string;
    format: CitationFormat;
    volume?: string;
    reporter: string;
    page: string;
    year: number;
    court?: string;
    parallelCitations?: string[];
    isCanonical: boolean;
    metadata?: Record<string, any>;
}
/**
 * Supported citation formats.
 */
export declare enum CitationFormat {
    BLUEBOOK = "bluebook",
    APA = "apa",
    MLA = "mla",
    CHICAGO = "chicago",
    OSCOLA = "oscola",
    AGLC = "aglc",
    NEUTRAL = "neutral"
}
/**
 * Court information with hierarchy details.
 */
export interface Court {
    id: string;
    name: string;
    shortName: string;
    level: CourtLevel;
    jurisdiction: string;
    parentCourtId?: string;
    childCourtIds?: string[];
    bindingJurisdictions?: string[];
    persuasiveJurisdictions?: string[];
    establishedDate?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
}
/**
 * Court hierarchy levels.
 */
export declare enum CourtLevel {
    SUPREME = "supreme",
    APPELLATE = "appellate",
    TRIAL = "trial",
    DISTRICT = "district",
    MUNICIPAL = "municipal",
    SPECIALIZED = "specialized"
}
/**
 * Legal precedent analysis result.
 */
export interface PrecedentAnalysis {
    caseId: string;
    relevanceScore: number;
    similarCases: SimilarCase[];
    citationNetwork: CitationNetwork;
    keyDistinctions?: string[];
    applicabilityNotes?: string[];
    recommendedCitations?: Citation[];
}
/**
 * Similar case with similarity metrics.
 */
export interface SimilarCase {
    caseId: string;
    caseName: string;
    similarity: number;
    sharedCitations: number;
    sharedIssues: string[];
    sharedKeywords: string[];
    temporalRelevance: number;
    jurisdictionalAlignment: number;
}
/**
 * Citation network graph structure.
 */
export interface CitationNetwork {
    nodes: CitationNode[];
    edges: CitationEdge[];
    metrics: NetworkMetrics;
}
/**
 * Node in citation graph.
 */
export interface CitationNode {
    id: string;
    caseId: string;
    caseName: string;
    year: number;
    importance: number;
    inDegree: number;
    outDegree: number;
    pageRank?: number;
}
/**
 * Edge in citation graph.
 */
export interface CitationEdge {
    sourceId: string;
    targetId: string;
    weight: number;
    citationType: CitationType;
}
/**
 * Types of citation relationships.
 */
export declare enum CitationType {
    FOLLOWED = "followed",
    DISTINGUISHED = "distinguished",
    OVERRULED = "overruled",
    QUESTIONED = "questioned",
    CITED_WITH_APPROVAL = "cited_with_approval",
    CITED_NEUTRALLY = "cited_neutrally"
}
/**
 * Citation network metrics.
 */
export interface NetworkMetrics {
    totalNodes: number;
    totalEdges: number;
    density: number;
    averageDegree: number;
    centralNodes: string[];
    clusters?: string[][];
}
/**
 * Citation validation result.
 */
export interface CitationValidationResult {
    isValid: boolean;
    format: CitationFormat;
    parsedComponents: ParsedCitation;
    errors: ValidationError[];
    suggestions?: string[];
}
/**
 * Parsed citation components.
 */
export interface ParsedCitation {
    volume?: string;
    reporter: string;
    page: string;
    year?: number;
    court?: string;
    partyNames?: string;
    pinpoint?: string;
}
/**
 * Validation error details.
 */
export interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
/**
 * Search query for case law.
 */
export interface CaseLawSearchQuery {
    query?: string;
    partyNames?: string[];
    judges?: string[];
    courts?: string[];
    jurisdictions?: string[];
    caseTypes?: CaseType[];
    dateFrom?: Date;
    dateTo?: Date;
    keywords?: string[];
    citations?: string[];
    precedentialValue?: PrecedentialValue[];
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'date' | 'citations';
    sortOrder?: 'asc' | 'desc';
}
/**
 * Case law search result.
 */
export interface CaseLawSearchResult {
    cases: LegalCase[];
    total: number;
    page: number;
    pageSize: number;
    facets?: SearchFacets;
}
/**
 * Search result facets for filtering.
 */
export interface SearchFacets {
    courts: {
        name: string;
        count: number;
    }[];
    jurisdictions: {
        name: string;
        count: number;
    }[];
    years: {
        year: number;
        count: number;
    }[];
    caseTypes: {
        type: CaseType;
        count: number;
    }[];
}
/**
 * Sequelize model attributes for LegalCase.
 */
export interface LegalCaseAttributes {
    id: string;
    caseNumber: string;
    caseName: string;
    partyNames: Record<string, string[]>;
    courtId: string;
    courtName: string;
    jurisdiction: string;
    decisionDate: Date;
    filingDate?: Date;
    judgeNames: string[];
    caseType: CaseType;
    caseStatus: CaseStatus;
    summary?: string;
    fullTextUrl?: string;
    pdfUrl?: string;
    keyPoints?: string[];
    legalIssues?: string[];
    holdings?: string[];
    precedentialValue: PrecedentialValue;
    citedCases?: string[];
    citingCases?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface LegalCaseCreationAttributes extends Optional<LegalCaseAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Defines Sequelize model for legal cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Legal case model
 *
 * @example
 * ```typescript
 * const LegalCaseModel = defineLegalCaseModel(sequelize);
 * const newCase = await LegalCaseModel.create({
 *   caseNumber: '2024-CV-1234',
 *   caseName: 'Smith v. Jones',
 *   // ... other fields
 * });
 * ```
 */
export declare const defineLegalCaseModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        caseNumber: string;
        caseName: string;
        partyNames: Record<string, string[]>;
        courtId: string;
        courtName: string;
        jurisdiction: string;
        decisionDate: Date;
        filingDate?: Date;
        judgeNames: string[];
        caseType: CaseType;
        caseStatus: CaseStatus;
        summary?: string;
        fullTextUrl?: string;
        pdfUrl?: string;
        keyPoints?: string[];
        legalIssues?: string[];
        holdings?: string[];
        precedentialValue: PrecedentialValue;
        citedCases?: string[];
        citingCases?: string[];
        metadata?: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model attributes for Citation.
 */
export interface CitationAttributes {
    id: string;
    caseId: string;
    citationString: string;
    format: CitationFormat;
    volume?: string;
    reporter: string;
    page: string;
    year: number;
    court?: string;
    parallelCitations?: string[];
    isCanonical: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CitationCreationAttributes extends Optional<CitationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Defines Sequelize model for legal citations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Citation model
 *
 * @example
 * ```typescript
 * const CitationModel = defineCitationModel(sequelize);
 * const citation = await CitationModel.create({
 *   caseId: 'case-uuid',
 *   citationString: '410 U.S. 113 (1973)',
 *   format: CitationFormat.BLUEBOOK,
 *   reporter: 'U.S.',
 *   page: '113',
 *   year: 1973
 * });
 * ```
 */
export declare const defineCitationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        caseId: string;
        citationString: string;
        format: CitationFormat;
        volume?: string;
        reporter: string;
        page: string;
        year: number;
        court?: string;
        parallelCitations?: string[];
        isCanonical: boolean;
        metadata?: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model attributes for Court.
 */
export interface CourtAttributes {
    id: string;
    name: string;
    shortName: string;
    level: CourtLevel;
    jurisdiction: string;
    parentCourtId?: string;
    childCourtIds?: string[];
    bindingJurisdictions?: string[];
    persuasiveJurisdictions?: string[];
    establishedDate?: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CourtCreationAttributes extends Optional<CourtAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
/**
 * Defines Sequelize model for courts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Court model
 *
 * @example
 * ```typescript
 * const CourtModel = defineCourtModel(sequelize);
 * const court = await CourtModel.create({
 *   name: 'Supreme Court of the United States',
 *   shortName: 'SCOTUS',
 *   level: CourtLevel.SUPREME,
 *   jurisdiction: 'federal',
 *   isActive: true
 * });
 * ```
 */
export declare const defineCourtModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        shortName: string;
        level: CourtLevel;
        jurisdiction: string;
        parentCourtId?: string;
        childCourtIds?: string[];
        bindingJurisdictions?: string[];
        persuasiveJurisdictions?: string[];
        establishedDate?: Date;
        isActive: boolean;
        metadata?: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Parses a Bluebook format citation into components.
 *
 * @param {string} citation - Bluebook citation string
 * @returns {ParsedCitation | null} Parsed citation or null if invalid
 *
 * @example
 * ```typescript
 * const parsed = parseBluebookCitation('410 U.S. 113, 120 (1973)');
 * // Result: { volume: '410', reporter: 'U.S.', page: '113', pinpoint: '120', year: 1973 }
 * ```
 */
export declare const parseBluebookCitation: (citation: string) => ParsedCitation | null;
/**
 * Parses an APA format legal citation.
 *
 * @param {string} citation - APA citation string
 * @returns {ParsedCitation | null} Parsed citation or null if invalid
 *
 * @example
 * ```typescript
 * const parsed = parseAPACitation('Roe v. Wade, 410 U.S. 113 (1973)');
 * // Result: { partyNames: 'Roe v. Wade', volume: '410', reporter: 'U.S.', page: '113', year: 1973 }
 * ```
 */
export declare const parseAPACitation: (citation: string) => ParsedCitation | null;
/**
 * Validates a legal citation against a specific format.
 *
 * @param {string} citation - Citation string to validate
 * @param {CitationFormat} format - Expected citation format
 * @returns {CitationValidationResult} Validation result with errors and suggestions
 *
 * @example
 * ```typescript
 * const result = validateCitation('410 U.S. 113 (1973)', CitationFormat.BLUEBOOK);
 * if (result.isValid) {
 *   console.log('Valid citation:', result.parsedComponents);
 * }
 * ```
 */
export declare const validateCitation: (citation: string, format: CitationFormat) => CitationValidationResult;
/**
 * Generates citation format suggestions based on input.
 *
 * @param {string} citation - Original citation string
 * @param {CitationFormat} format - Target citation format
 * @returns {string[]} Array of suggested corrections
 *
 * @example
 * ```typescript
 * const suggestions = generateCitationSuggestions('410US113', CitationFormat.BLUEBOOK);
 * // Result: ['410 U.S. 113 (Year needed)', 'Add spacing between components']
 * ```
 */
export declare const generateCitationSuggestions: (citation: string, format: CitationFormat) => string[];
/**
 * Normalizes a citation to a standard format.
 *
 * @param {string} citation - Citation to normalize
 * @param {CitationFormat} targetFormat - Target format
 * @returns {string} Normalized citation string
 *
 * @example
 * ```typescript
 * const normalized = normalizeCitation('410US113(1973)', CitationFormat.BLUEBOOK);
 * // Result: '410 U.S. 113 (1973)'
 * ```
 */
export declare const normalizeCitation: (citation: string, targetFormat: CitationFormat) => string;
/**
 * Extracts all citations from a legal document text.
 *
 * @param {string} text - Document text to analyze
 * @param {CitationFormat[]} [formats] - Citation formats to detect
 * @returns {ParsedCitation[]} Array of parsed citations
 *
 * @example
 * ```typescript
 * const text = "As held in 410 U.S. 113 (1973), the court found...";
 * const citations = extractCitationsFromText(text, [CitationFormat.BLUEBOOK]);
 * ```
 */
export declare const extractCitationsFromText: (text: string, formats?: CitationFormat[]) => ParsedCitation[];
/**
 * Formats a parsed citation into a specific citation style.
 *
 * @param {ParsedCitation} parsed - Parsed citation components
 * @param {CitationFormat} format - Target citation format
 * @returns {string} Formatted citation string
 *
 * @example
 * ```typescript
 * const citation = formatCitation({
 *   volume: '410', reporter: 'U.S.', page: '113', year: 1973
 * }, CitationFormat.BLUEBOOK);
 * // Result: '410 U.S. 113 (1973)'
 * ```
 */
export declare const formatCitation: (parsed: ParsedCitation, format: CitationFormat) => string;
/**
 * Calculates similarity score between two legal cases.
 *
 * @param {LegalCase} case1 - First case
 * @param {LegalCase} case2 - Second case
 * @returns {number} Similarity score between 0 and 1
 *
 * @example
 * ```typescript
 * const similarity = calculateCaseSimilarity(caseA, caseB);
 * if (similarity > 0.7) {
 *   console.log('Highly similar cases');
 * }
 * ```
 */
export declare const calculateCaseSimilarity: (case1: LegalCase, case2: LegalCase) => number;
/**
 * Finds similar cases based on various criteria.
 *
 * @param {LegalCase} targetCase - Case to find similarities for
 * @param {LegalCase[]} candidateCases - Pool of cases to compare against
 * @param {number} [threshold=0.5] - Minimum similarity threshold
 * @param {number} [limit=10] - Maximum number of results
 * @returns {SimilarCase[]} Array of similar cases sorted by similarity
 *
 * @example
 * ```typescript
 * const similar = findSimilarCases(myCase, allCases, 0.6, 5);
 * similar.forEach(sc => console.log(`${sc.caseName}: ${sc.similarity}`));
 * ```
 */
export declare const findSimilarCases: (targetCase: LegalCase, candidateCases: LegalCase[], threshold?: number, limit?: number) => SimilarCase[];
/**
 * Calculates temporal relevance between two dates.
 *
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Relevance score between 0 and 1
 *
 * @example
 * ```typescript
 * const relevance = calculateTemporalRelevance(new Date('2020-01-01'), new Date('2021-01-01'));
 * // Result: ~0.98 (recent cases score higher)
 * ```
 */
export declare const calculateTemporalRelevance: (date1: Date, date2: Date) => number;
/**
 * Scores case relevance for a specific legal query.
 *
 * @param {LegalCase} legalCase - Case to score
 * @param {CaseLawSearchQuery} query - Search query criteria
 * @returns {number} Relevance score between 0 and 1
 *
 * @example
 * ```typescript
 * const score = scoreCaseRelevance(myCase, {
 *   keywords: ['negligence', 'medical'],
 *   jurisdictions: ['federal'],
 *   caseTypes: [CaseType.CIVIL]
 * });
 * ```
 */
export declare const scoreCaseRelevance: (legalCase: LegalCase, query: CaseLawSearchQuery) => number;
/**
 * Determines if a court has binding precedent over another court.
 *
 * @param {Court} superiorCourt - Potentially superior court
 * @param {Court} inferiorCourt - Potentially inferior court
 * @returns {boolean} True if superior court binds inferior court
 *
 * @example
 * ```typescript
 * const isBinding = isBindingPrecedent(supremeCourt, districtCourt);
 * if (isBinding) {
 *   console.log('Supreme court decisions bind district court');
 * }
 * ```
 */
export declare const isBindingPrecedent: (superiorCourt: Court, inferiorCourt: Court) => boolean;
/**
 * Gets the court hierarchy path from a court to the supreme court.
 *
 * @param {Court} court - Starting court
 * @param {Map<string, Court>} courtMap - Map of all courts by ID
 * @returns {Court[]} Array of courts from given court to supreme court
 *
 * @example
 * ```typescript
 * const hierarchy = getCourtHierarchy(districtCourt, allCourtsMap);
 * hierarchy.forEach(c => console.log(c.name));
 * // Output: District Court -> Appellate Court -> Supreme Court
 * ```
 */
export declare const getCourtHierarchy: (court: Court, courtMap: Map<string, Court>) => Court[];
/**
 * Determines precedential weight of a case in a jurisdiction.
 *
 * @param {LegalCase} legalCase - Case to evaluate
 * @param {Court} targetCourt - Court where case will be cited
 * @param {Map<string, Court>} courtMap - Map of all courts
 * @returns {number} Precedential weight score (0-1)
 *
 * @example
 * ```typescript
 * const weight = determinePrecedentialWeight(case, targetCourt, courtsMap);
 * if (weight > 0.8) {
 *   console.log('This case has strong binding precedent');
 * }
 * ```
 */
export declare const determinePrecedentialWeight: (legalCase: LegalCase, targetCourt: Court, courtMap: Map<string, Court>) => number;
/**
 * Finds all courts within a jurisdiction.
 *
 * @param {string} jurisdiction - Jurisdiction identifier
 * @param {Court[]} courts - Array of all courts
 * @returns {Court[]} Courts in the jurisdiction
 *
 * @example
 * ```typescript
 * const federalCourts = getCourtsInJurisdiction('federal', allCourts);
 * ```
 */
export declare const getCourtsInJurisdiction: (jurisdiction: string, courts: Court[]) => Court[];
/**
 * Gets all subordinate courts in a hierarchy.
 *
 * @param {Court} court - Superior court
 * @param {Map<string, Court>} courtMap - Map of all courts
 * @returns {Court[]} All subordinate courts
 *
 * @example
 * ```typescript
 * const subordinates = getSubordinateCourts(appealsCourt, courtsMap);
 * ```
 */
export declare const getSubordinateCourts: (court: Court, courtMap: Map<string, Court>) => Court[];
/**
 * Builds a citation network graph from a set of cases.
 *
 * @param {LegalCase[]} cases - Cases to include in network
 * @returns {CitationNetwork} Citation network graph
 *
 * @example
 * ```typescript
 * const network = buildCitationNetwork(relevantCases);
 * console.log(`Network has ${network.metrics.totalNodes} nodes`);
 * ```
 */
export declare const buildCitationNetwork: (cases: LegalCase[]) => CitationNetwork;
/**
 * Calculates network metrics for a citation graph.
 *
 * @param {CitationNode[]} nodes - Graph nodes
 * @param {CitationEdge[]} edges - Graph edges
 * @returns {NetworkMetrics} Calculated network metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateNetworkMetrics(nodes, edges);
 * console.log(`Network density: ${metrics.density}`);
 * ```
 */
export declare const calculateNetworkMetrics: (nodes: CitationNode[], edges: CitationEdge[]) => NetworkMetrics;
/**
 * Calculates PageRank scores for cases in citation network.
 *
 * @param {CitationNetwork} network - Citation network
 * @param {number} [dampingFactor=0.85] - PageRank damping factor
 * @param {number} [maxIterations=100] - Maximum iterations
 * @returns {Map<string, number>} PageRank scores by case ID
 *
 * @example
 * ```typescript
 * const pageRanks = calculatePageRank(network);
 * const topCase = Array.from(pageRanks.entries())
 *   .sort((a, b) => b[1] - a[1])[0];
 * console.log(`Most important case: ${topCase[0]}`);
 * ```
 */
export declare const calculatePageRank: (network: CitationNetwork, dampingFactor?: number, maxIterations?: number) => Map<string, number>;
/**
 * Identifies citation clusters in the network.
 *
 * @param {CitationNetwork} network - Citation network
 * @param {number} [minClusterSize=3] - Minimum cluster size
 * @returns {string[][]} Array of clusters (case ID arrays)
 *
 * @example
 * ```typescript
 * const clusters = identifyCitationClusters(network, 5);
 * console.log(`Found ${clusters.length} citation clusters`);
 * ```
 */
export declare const identifyCitationClusters: (network: CitationNetwork, minClusterSize?: number) => string[][];
/**
 * Finds the shortest citation path between two cases.
 *
 * @param {string} sourceCaseId - Starting case ID
 * @param {string} targetCaseId - Target case ID
 * @param {CitationNetwork} network - Citation network
 * @returns {string[] | null} Array of case IDs representing path, or null if no path
 *
 * @example
 * ```typescript
 * const path = findCitationPath(caseA.id, caseB.id, network);
 * if (path) {
 *   console.log(`Citation path: ${path.join(' -> ')}`);
 * }
 * ```
 */
export declare const findCitationPath: (sourceCaseId: string, targetCaseId: string, network: CitationNetwork) => string[] | null;
/**
 * Creates Swagger schema for legal case response.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createLegalCaseSwaggerSchema();
 * // Use in @ApiResponse decorator
 * ```
 */
export declare const createLegalCaseSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger schema for citation validation response.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createCitationValidationSwaggerSchema();
 * ```
 */
export declare const createCitationValidationSwaggerSchema: () => Record<string, any>;
/**
 * Creates Swagger operation documentation for case search endpoint.
 *
 * @returns {Record<string, any>} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = createCaseSearchSwaggerOperation();
 * // Use with @ApiOperation decorator
 * ```
 */
export declare const createCaseSearchSwaggerOperation: () => Record<string, any>;
/**
 * Creates example legal case for Swagger documentation.
 *
 * @returns {Record<string, any>} Example case object
 *
 * @example
 * ```typescript
 * const example = createLegalCaseExample();
 * // Use in @ApiResponse examples
 * ```
 */
export declare const createLegalCaseExample: () => Record<string, any>;
//# sourceMappingURL=case-law-research-kit.d.ts.map