/**
 * LOC: LEGAL-CIT-001
 * File: /reuse/legal/citation-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal document management modules
 *   - Case management systems
 *   - Citation tracking services
 */
import { Model } from 'sequelize-typescript';
/**
 * Citation format types supported by the system
 */
export declare enum CitationFormat {
    BLUEBOOK = "bluebook",
    ALWD = "alwd",
    APA = "apa",
    MLA = "mla",
    CHICAGO = "chicago",
    OSCOLA = "oscola",
    AGLC = "aglc"
}
/**
 * Types of legal authorities that can be cited
 */
export declare enum AuthorityType {
    CASE = "case",
    STATUTE = "statute",
    REGULATION = "regulation",
    CONSTITUTION = "constitution",
    TREATISE = "treatise",
    LAW_REVIEW = "law_review",
    ADMINISTRATIVE = "administrative",
    LEGISLATIVE_HISTORY = "legislative_history",
    SECONDARY_SOURCE = "secondary_source",
    FOREIGN_LAW = "foreign_law",
    INTERNATIONAL = "international"
}
/**
 * Court types for case citations
 */
export declare enum CourtType {
    US_SUPREME_COURT = "us_supreme_court",
    US_COURT_APPEALS = "us_court_appeals",
    US_DISTRICT_COURT = "us_district_court",
    STATE_SUPREME_COURT = "state_supreme_court",
    STATE_APPELLATE_COURT = "state_appellate_court",
    STATE_TRIAL_COURT = "state_trial_court",
    SPECIALIZED_COURT = "specialized_court"
}
/**
 * Citation validity status
 */
export declare enum CitationStatus {
    VALID = "valid",
    INVALID = "invalid",
    INCOMPLETE = "incomplete",
    AMBIGUOUS = "ambiguous",
    NEEDS_UPDATE = "needs_update",
    OVERRULED = "overruled",
    SUPERSEDED = "superseded"
}
/**
 * Shepard's treatment codes
 */
export declare enum ShepardsCode {
    WARNING = "warning",// Red flag - negative treatment
    QUESTIONED = "questioned",// Orange flag - validity questioned
    CAUTION = "caution",// Yellow flag - possible negative treatment
    POSITIVE = "positive",// Green plus - positive treatment
    CITED = "cited",// Blue circle - cited by
    NEUTRAL = "neutral"
}
/**
 * Parsed case citation structure
 */
export interface ParsedCaseCitation {
    caseName: string;
    volume: string;
    reporter: string;
    page: string;
    pinpoint?: string;
    court?: string;
    year: string;
    parallel?: ParallelCitation[];
}
/**
 * Parallel citation information
 */
export interface ParallelCitation {
    volume: string;
    reporter: string;
    page: string;
    isOfficial: boolean;
}
/**
 * Parsed statute citation structure
 */
export interface ParsedStatuteCitation {
    title: string;
    code: string;
    section: string;
    subsection?: string;
    year?: string;
    supplement?: string;
}
/**
 * Citation completeness analysis
 */
export interface CitationCompleteness {
    isComplete: boolean;
    missingElements: string[];
    warnings: string[];
    suggestions: string[];
    confidence: number;
}
/**
 * Bluebook validation result
 */
export interface BluebookValidation {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    formattedCitation: string;
    rule: string;
}
/**
 * Validation error structure
 */
export interface ValidationError {
    field: string;
    message: string;
    rule: string;
    severity: 'error' | 'warning' | 'info';
}
/**
 * Validation warning structure
 */
export interface ValidationWarning {
    field: string;
    message: string;
    suggestion: string;
}
/**
 * Shepardizing result
 */
export interface ShepardizingResult {
    citationId: string;
    status: ShepardsCode;
    treatments: CitationTreatment[];
    citingCases: CitingCase[];
    history: CaseHistory[];
    lastChecked: Date;
}
/**
 * Citation treatment information
 */
export interface CitationTreatment {
    type: 'distinguished' | 'followed' | 'overruled' | 'questioned' | 'explained' | 'cited';
    citingCase: string;
    court: string;
    year: string;
    headnote?: string;
}
/**
 * Citing case information
 */
export interface CitingCase {
    citation: string;
    caseName: string;
    court: string;
    year: string;
    treatment: string;
    depth: number;
}
/**
 * Case history information
 */
export interface CaseHistory {
    citation: string;
    court: string;
    decision: string;
    date: Date;
    relationship: 'affirmed' | 'reversed' | 'remanded' | 'vacated' | 'modified';
}
/**
 * Citation conversion options
 */
export interface CitationConversionOptions {
    sourceFormat: CitationFormat;
    targetFormat: CitationFormat;
    preserveParallels: boolean;
    includeUrl: boolean;
    shortFormAllowed: boolean;
}
/**
 * Reporter abbreviation mapping
 */
export interface ReporterInfo {
    abbreviation: string;
    fullName: string;
    type: 'official' | 'unofficial' | 'regional' | 'specialized';
    startYear?: number;
    endYear?: number;
    jurisdiction?: string;
}
/**
 * Citation model - stores legal citations
 */
export declare class Citation extends Model {
    id: number;
    citationText: string;
    authorityType: AuthorityType;
    format: CitationFormat;
    parsedData?: ParsedCaseCitation | ParsedStatuteCitation;
    normalizedCitation?: string;
    status: CitationStatus;
    validationResult?: BluebookValidation;
    parallelCitations?: ParallelCitation[];
    authorityId?: number;
    authority?: LegalAuthority;
    volume?: string;
    reporter?: string;
    page?: string;
    year?: string;
    court?: string;
    shepardizingData?: ShepardizingResult;
    lastShepardized?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Legal Authority model - stores information about legal authorities
 */
export declare class LegalAuthority extends Model {
    id: number;
    authorityType: AuthorityType;
    name: string;
    courtType?: CourtType;
    jurisdiction?: string;
    year?: number;
    officialCitation?: string;
    alternateCitations?: string[];
    westlawCitation?: string;
    lexisCitation?: string;
    url?: string;
    summary?: string;
    headnotes?: string[];
    citations?: Citation[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DTO for creating a citation
 */
export declare class CreateCitationDto {
    citationText: string;
    authorityType: AuthorityType;
    format: CitationFormat;
    authorityId?: number;
}
/**
 * DTO for validating a citation
 */
export declare class ValidateCitationDto {
    citationText: string;
    format: CitationFormat;
    authorityType: AuthorityType;
    strict?: boolean;
}
/**
 * DTO for converting citation format
 */
export declare class ConvertCitationDto {
    sourceCitation: string;
    sourceFormat: CitationFormat;
    targetFormat: CitationFormat;
    preserveParallels?: boolean;
    includeUrl?: boolean;
}
/**
 * DTO for shepardizing a citation
 */
export declare class ShepardizeCitationDto {
    citation: string;
    includeHistory?: boolean;
    maxDepth?: number;
}
/**
 * DTO for parallel citation resolution
 */
export declare class ResolveParallelCitationDto {
    primaryCitation: string;
    includeUnofficial?: boolean;
    includeRegional?: boolean;
}
/**
 * Parse a case citation into structured components
 */
export declare function parseCaseCitation(citation: string): ParsedCaseCitation | null;
/**
 * Parse a statute citation into structured components
 */
export declare function parseStatuteCitation(citation: string): ParsedStatuteCitation | null;
/**
 * Parse any citation type and return structured data
 */
export declare function parseGenericCitation(citation: string, authorityType: AuthorityType): ParsedCaseCitation | ParsedStatuteCitation | null;
/**
 * Extract volume, reporter, and page from citation
 */
export declare function extractVolumeReporterPage(citation: string): {
    volume: string;
    reporter: string;
    page: string;
} | null;
/**
 * Validate citation against Bluebook rules
 */
export declare function validateBluebookCitation(citation: string, authorityType: AuthorityType): BluebookValidation;
/**
 * Validate citation completeness
 */
export declare function checkCitationCompleteness(citation: string, authorityType: AuthorityType): CitationCompleteness;
/**
 * Format citation according to Bluebook rules
 */
export declare function formatBluebookCitation(parsed: ParsedCaseCitation | ParsedStatuteCitation, authorityType: AuthorityType): string;
/**
 * Convert citation from one format to another
 */
export declare function convertCitationFormat(citation: string, sourceFormat: CitationFormat, targetFormat: CitationFormat, authorityType: AuthorityType): string;
/**
 * Generate short form citation
 */
export declare function generateShortFormCitation(fullCitation: string, authorityType: AuthorityType): string;
/**
 * Normalize citation for comparison
 */
export declare function normalizeCitation(citation: string): string;
/**
 * Format parallel citations
 */
export declare function formatParallelCitations(primary: string, parallels: ParallelCitation[]): string;
/**
 * Resolve parallel citations for a case
 */
export declare function resolveParallelCitations(citation: string): ParallelCitation[];
/**
 * Find official citation from parallel citations
 */
export declare function findOfficialCitation(citations: string[]): string | null;
/**
 * Merge duplicate citations
 */
export declare function mergeDuplicateCitations(citations: string[]): string[];
/**
 * Shepardize a citation (check treatment by subsequent cases)
 */
export declare function shepardizeCitation(citation: string): Promise<ShepardizingResult>;
/**
 * Check if citation has negative treatment
 */
export declare function hasNegativeTreatment(shepardResult: ShepardizingResult): boolean;
/**
 * Get citation treatment summary
 */
export declare function getCitationTreatmentSummary(shepardResult: ShepardizingResult): string;
/**
 * Filter citing cases by treatment type
 */
export declare function filterCitingCasesByTreatment(citingCases: CitingCase[], treatment: string): CitingCase[];
/**
 * Get reporter information
 */
export declare function getReporterInfo(abbreviation: string): ReporterInfo | null;
/**
 * Get court abbreviation for Bluebook
 */
export declare function getCourtAbbreviation(courtType: CourtType, jurisdiction?: string): string;
/**
 * Determine court type from citation
 */
export declare function determineCourtType(citation: string): CourtType | null;
/**
 * Extract all citations from text
 */
export declare function extractCitationsFromText(text: string): string[];
/**
 * Validate multiple citations in bulk
 */
export declare function validateCitationsBulk(citations: string[], authorityType: AuthorityType): Map<string, BluebookValidation>;
/**
 * Compare two citations for equivalence
 */
export declare function areCitationsEquivalent(citation1: string, citation2: string): boolean;
/**
 * Sort citations by year
 */
export declare function sortCitationsByYear(citations: string[], ascending?: boolean): string[];
/**
 * Citation validation and management service
 */
export declare class CitationService {
    /**
     * Validate a citation
     */
    validateCitation(dto: ValidateCitationDto): Promise<BluebookValidation>;
    /**
     * Convert citation format
     */
    convertCitation(dto: ConvertCitationDto): Promise<string>;
    /**
     * Check citation completeness
     */
    checkCompleteness(citation: string, authorityType: AuthorityType): Promise<CitationCompleteness>;
    /**
     * Shepardize citation
     */
    shepardize(dto: ShepardizeCitationDto): Promise<ShepardizingResult>;
    /**
     * Resolve parallel citations
     */
    resolveParallels(dto: ResolveParallelCitationDto): Promise<ParallelCitation[]>;
    /**
     * Create citation record
     */
    createCitation(dto: CreateCitationDto): Promise<Citation>;
    /**
     * Extract citations from document text
     */
    extractCitations(text: string): Promise<string[]>;
    /**
     * Batch validate citations
     */
    batchValidate(citations: string[], authorityType: AuthorityType): Promise<Map<string, BluebookValidation>>;
}
/**
 * Generate citation ID from components
 */
export declare function generateCitationId(volume: string, reporter: string, page: string): string;
/**
 * Check if citation is a short form
 */
export declare function isShortFormCitation(citation: string): boolean;
/**
 * Get citation age in years
 */
export declare function getCitationAge(citation: string): number | null;
/**
 * Format pinpoint citation
 */
export declare function formatPinpointCitation(baseCitation: string, pages: number[]): string;
/**
 * Validate URL citation format
 */
export declare function validateUrlCitation(url: string): boolean;
/**
 * Generate permalink for citation
 */
export declare function generateCitationPermalink(citation: string, service: 'westlaw' | 'lexis' | 'google'): string;
declare const _default: {
    Citation: typeof Citation;
    LegalAuthority: typeof LegalAuthority;
    CreateCitationDto: typeof CreateCitationDto;
    ValidateCitationDto: typeof ValidateCitationDto;
    ConvertCitationDto: typeof ConvertCitationDto;
    ShepardizeCitationDto: typeof ShepardizeCitationDto;
    ResolveParallelCitationDto: typeof ResolveParallelCitationDto;
    CitationService: typeof CitationService;
    parseCaseCitation: typeof parseCaseCitation;
    parseStatuteCitation: typeof parseStatuteCitation;
    parseGenericCitation: typeof parseGenericCitation;
    extractVolumeReporterPage: typeof extractVolumeReporterPage;
    validateBluebookCitation: typeof validateBluebookCitation;
    checkCitationCompleteness: typeof checkCitationCompleteness;
    validateCitationsBulk: typeof validateCitationsBulk;
    formatBluebookCitation: typeof formatBluebookCitation;
    convertCitationFormat: typeof convertCitationFormat;
    generateShortFormCitation: typeof generateShortFormCitation;
    normalizeCitation: typeof normalizeCitation;
    formatParallelCitations: typeof formatParallelCitations;
    formatPinpointCitation: typeof formatPinpointCitation;
    resolveParallelCitations: typeof resolveParallelCitations;
    findOfficialCitation: typeof findOfficialCitation;
    mergeDuplicateCitations: typeof mergeDuplicateCitations;
    shepardizeCitation: typeof shepardizeCitation;
    hasNegativeTreatment: typeof hasNegativeTreatment;
    getCitationTreatmentSummary: typeof getCitationTreatmentSummary;
    filterCitingCasesByTreatment: typeof filterCitingCasesByTreatment;
    getReporterInfo: typeof getReporterInfo;
    getCourtAbbreviation: typeof getCourtAbbreviation;
    determineCourtType: typeof determineCourtType;
    extractCitationsFromText: typeof extractCitationsFromText;
    areCitationsEquivalent: typeof areCitationsEquivalent;
    sortCitationsByYear: typeof sortCitationsByYear;
    generateCitationId: typeof generateCitationId;
    isShortFormCitation: typeof isShortFormCitation;
    getCitationAge: typeof getCitationAge;
    validateUrlCitation: typeof validateUrlCitation;
    generateCitationPermalink: typeof generateCitationPermalink;
};
export default _default;
//# sourceMappingURL=citation-validation-kit.d.ts.map