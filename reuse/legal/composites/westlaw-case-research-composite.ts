/**
 * LOC: WLCR1234567
 * File: /reuse/legal/composites/westlaw-case-research-composite.ts
 *
 * UPSTREAM (imports from):
 *   - reuse/legal/case-law-research-kit.ts
 *   - reuse/legal/precedent-analysis-kit.ts
 *   - reuse/legal/citation-validation-kit.ts
 *   - reuse/legal/legal-research-discovery-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Westlaw case research services
 *   - Legal research platforms
 *   - Citation management systems
 */

/**
 * File: /reuse/legal/composites/westlaw-case-research-composite.ts
 * Locator: WC-CMP-WLCR-001
 * Purpose: Westlaw Case Research Composite - Advanced case law research and analysis
 *
 * Upstream: Composes case-law-research-kit, precedent-analysis-kit, citation-validation-kit, legal-research-discovery-kit
 * Downstream: Westlaw backend services, Legal research APIs, Citation management systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 composed functions for comprehensive case research and citation management
 *
 * LLM Context: Production-ready Westlaw case research composite providing comprehensive case law research,
 * precedent analysis, citation validation, and legal discovery capabilities. Integrates multiple legal research
 * kits into a unified service layer with proper NestJS dependency injection, configuration management, and
 * error handling. Essential for enterprise legal research platforms requiring robust case law analysis.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

// Import from case-law-research-kit
import {
  LegalCase,
  Citation,
  Court,
  CitationFormat,
  ParsedCitation,
  CitationValidationResult,
  CaseLawSearchQuery,
  CitationNetwork,
  defineLegalCaseModel,
  defineCitationModel,
  defineCourtModel,
  parseBluebookCitation,
  parseAPACitation,
  validateCitation,
  generateCitationSuggestions,
  normalizeCitation,
  extractCitationsFromText,
  formatCitation,
  calculateCaseSimilarity,
  findSimilarCases,
  calculateTemporalRelevance,
  scoreCaseRelevance,
  isBindingPrecedent,
  getCourtHierarchy,
  determinePrecedentialWeight,
  getCourtsInJurisdiction,
  getSubordinateCourts,
  buildCitationNetwork,
} from '../case-law-research-kit';

// Import from precedent-analysis-kit
import {
  LegalPrecedent,
  CourtLevel,
  AuthorityType,
  PrecedentStatus,
  AuthorityClassification,
  BindingLevel,
  PrecedentStrengthAnalysis,
  PrecedentRelationship,
  Holding,
  defineLegalPrecedentModel,
  definePrecedentRelationshipModel,
  identifyRelevantPrecedents,
  findPrecedentsByHolding,
  identifyLandmarkPrecedents,
  identifyRecentPrecedents,
  classifyPrecedentAuthority,
  determineBindingLevel,
  evaluateJurisdictionalReach,
  compareAuthorityStrength,
  calculatePrecedentStrength,
  calculateCitationScore,
  calculateCourtAuthorityScore,
  calculateTemporalRelevance as calculatePrecedentTemporalRelevance,
  calculateTreatmentScore,
  calculateConsistencyScore,
  detectOverruling,
  identifyHoldingOverrule,
  analyzeOverrulingScope,
  trackOverrulingHistory,
} from '../precedent-analysis-kit';

// Import from citation-validation-kit
import {
  Citation as CitationEntity,
  LegalAuthority,
  CreateCitationDto,
  ValidateCitationDto,
  ConvertCitationDto,
  ShepardizeCitationDto,
  ResolveParallelCitationDto,
  parseCaseCitation,
  parseStatuteCitation,
  parseGenericCitation,
  extractVolumeReporterPage,
  validateBluebookCitation,
  checkCitationCompleteness,
  formatBluebookCitation,
  convertCitationFormat,
  generateShortFormCitation,
  normalizeCitation as normalizeCitationAdvanced,
  formatParallelCitations,
  resolveParallelCitations,
  findOfficialCitation,
} from '../citation-validation-kit';

// Import from legal-research-discovery-kit
import {
  createLegalResearchQueryModel,
  createDiscoverySetModel,
  createPrivilegeLogModel,
  executeAdvancedBooleanSearch,
  buildBooleanExpression,
  executeProximitySearch,
  executeFuzzySearch,
  executeWildcardSearch,
  optimizeSearchQuery,
  cacheSearchResults,
  getCachedSearchResults,
  discoverDocuments,
  filterByCustodian,
  filterByDateRange,
  filterByFileType,
  filterByClassification,
  deduplicateDocuments,
  threadEmailConversations,
  extractDocumentMetadata,
  createPrivilegeLogEntry,
} from '../legal-research-discovery-kit';

/**
 * Westlaw Case Research Service
 * Production-ready NestJS service integrating comprehensive case research capabilities
 */
@Injectable()
export class WestlawCaseResearchService {
  private readonly logger = new Logger(WestlawCaseResearchService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {
    this.logger.log('WestlawCaseResearchService initialized');
  }

  /**
   * Initialize all database models for case research
   */
  async initializeModels(): Promise<void> {
    try {
      defineLegalCaseModel(this.sequelize);
      defineCitationModel(this.sequelize);
      defineCourtModel(this.sequelize);
      defineLegalPrecedentModel(this.sequelize);
      definePrecedentRelationshipModel(this.sequelize);
      createLegalResearchQueryModel(this.sequelize);
      createDiscoverySetModel(this.sequelize);
      createPrivilegeLogModel(this.sequelize);

      this.logger.log('All case research models initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize case research models', error.stack);
      throw error;
    }
  }

  /**
   * Parse citation in Bluebook format
   */
  parseBluebook(citation: string): ParsedCitation | null {
    try {
      return parseBluebookCitation(citation);
    } catch (error) {
      this.logger.error(`Failed to parse Bluebook citation: ${citation}`, error.stack);
      return null;
    }
  }

  /**
   * Parse citation in APA format
   */
  parseAPA(citation: string): ParsedCitation | null {
    try {
      return parseAPACitation(citation);
    } catch (error) {
      this.logger.error(`Failed to parse APA citation: ${citation}`, error.stack);
      return null;
    }
  }

  /**
   * Validate citation against specified format
   */
  validateCitationFormat(citation: string, format: CitationFormat): CitationValidationResult {
    try {
      return validateCitation(citation, format);
    } catch (error) {
      this.logger.error(`Failed to validate citation: ${citation}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate citation correction suggestions
   */
  getCitationSuggestions(citation: string, format: CitationFormat): string[] {
    try {
      return generateCitationSuggestions(citation, format);
    } catch (error) {
      this.logger.error(`Failed to generate suggestions for: ${citation}`, error.stack);
      return [];
    }
  }

  /**
   * Normalize citation to standard format
   */
  normalizeCitationString(citation: string, targetFormat: CitationFormat): string {
    try {
      return normalizeCitation(citation, targetFormat);
    } catch (error) {
      this.logger.error(`Failed to normalize citation: ${citation}`, error.stack);
      throw error;
    }
  }

  /**
   * Extract all citations from legal text
   */
  extractCitations(text: string, format: CitationFormat): ParsedCitation[] {
    try {
      return extractCitationsFromText(text, format);
    } catch (error) {
      this.logger.error('Failed to extract citations from text', error.stack);
      return [];
    }
  }

  /**
   * Format parsed citation to specific format
   */
  formatCitationString(parsed: ParsedCitation, format: CitationFormat): string {
    try {
      return formatCitation(parsed, format);
    } catch (error) {
      this.logger.error('Failed to format citation', error.stack);
      throw error;
    }
  }

  /**
   * Calculate similarity between two cases
   */
  getCaseSimilarity(case1: LegalCase, case2: LegalCase): number {
    try {
      return calculateCaseSimilarity(case1, case2);
    } catch (error) {
      this.logger.error('Failed to calculate case similarity', error.stack);
      return 0;
    }
  }

  /**
   * Find similar cases based on query
   */
  async findSimilarCasesAsync(
    targetCase: LegalCase,
    candidateCases: LegalCase[],
    threshold: number,
  ): Promise<Array<{ case: LegalCase; similarity: number }>> {
    try {
      return findSimilarCases(targetCase, candidateCases, threshold);
    } catch (error) {
      this.logger.error('Failed to find similar cases', error.stack);
      return [];
    }
  }

  /**
   * Calculate temporal relevance of case
   */
  getTemporalRelevance(date1: Date, date2: Date): number {
    try {
      return calculateTemporalRelevance(date1, date2);
    } catch (error) {
      this.logger.error('Failed to calculate temporal relevance', error.stack);
      return 0;
    }
  }

  /**
   * Score case relevance against search query
   */
  scoreCaseRelevanceScore(legalCase: LegalCase, query: CaseLawSearchQuery): number {
    try {
      return scoreCaseRelevance(legalCase, query);
    } catch (error) {
      this.logger.error('Failed to score case relevance', error.stack);
      return 0;
    }
  }

  /**
   * Determine if precedent is binding
   */
  isBindingPrecedentCheck(superiorCourt: Court, inferiorCourt: Court): boolean {
    try {
      return isBindingPrecedent(superiorCourt, inferiorCourt);
    } catch (error) {
      this.logger.error('Failed to check binding precedent', error.stack);
      return false;
    }
  }

  /**
   * Get court hierarchy
   */
  getCourtHierarchyChain(court: Court, courtMap: Map<string, Court>): Court[] {
    try {
      return getCourtHierarchy(court, courtMap);
    } catch (error) {
      this.logger.error('Failed to get court hierarchy', error.stack);
      return [];
    }
  }

  /**
   * Determine precedential weight
   */
  getPrecedentialWeight(
    precedent: LegalPrecedent,
    court: Court,
    jurisdiction: string,
  ): number {
    try {
      return determinePrecedentialWeight(precedent, court, jurisdiction);
    } catch (error) {
      this.logger.error('Failed to determine precedential weight', error.stack);
      return 0;
    }
  }

  /**
   * Get all courts in jurisdiction
   */
  getJurisdictionCourts(jurisdiction: string, courts: Court[]): Court[] {
    try {
      return getCourtsInJurisdiction(jurisdiction, courts);
    } catch (error) {
      this.logger.error('Failed to get jurisdiction courts', error.stack);
      return [];
    }
  }

  /**
   * Get subordinate courts
   */
  getSubordinateCourtsList(court: Court, courtMap: Map<string, Court>): Court[] {
    try {
      return getSubordinateCourts(court, courtMap);
    } catch (error) {
      this.logger.error('Failed to get subordinate courts', error.stack);
      return [];
    }
  }

  /**
   * Build citation network graph
   */
  buildCitationGraph(cases: LegalCase[]): CitationNetwork {
    try {
      return buildCitationNetwork(cases);
    } catch (error) {
      this.logger.error('Failed to build citation network', error.stack);
      throw error;
    }
  }

  /**
   * Identify relevant precedents
   */
  findRelevantPrecedents(
    query: string,
    jurisdiction: string,
    precedents: LegalPrecedent[],
  ): LegalPrecedent[] {
    try {
      return identifyRelevantPrecedents(query, jurisdiction, precedents);
    } catch (error) {
      this.logger.error('Failed to identify relevant precedents', error.stack);
      return [];
    }
  }

  /**
   * Find precedents by holding
   */
  searchPrecedentsByHolding(holding: string, precedents: LegalPrecedent[]): LegalPrecedent[] {
    try {
      return findPrecedentsByHolding(holding, precedents);
    } catch (error) {
      this.logger.error('Failed to find precedents by holding', error.stack);
      return [];
    }
  }

  /**
   * Identify landmark precedents
   */
  getLandmarkPrecedents(precedents: LegalPrecedent[], minCitationCount: number): LegalPrecedent[] {
    try {
      return identifyLandmarkPrecedents(precedents, minCitationCount);
    } catch (error) {
      this.logger.error('Failed to identify landmark precedents', error.stack);
      return [];
    }
  }

  /**
   * Identify recent precedents
   */
  getRecentPrecedents(precedents: LegalPrecedent[], monthsBack: number): LegalPrecedent[] {
    try {
      return identifyRecentPrecedents(precedents, monthsBack);
    } catch (error) {
      this.logger.error('Failed to identify recent precedents', error.stack);
      return [];
    }
  }

  /**
   * Classify precedent authority
   */
  classifyAuthority(
    precedent: LegalPrecedent,
    jurisdiction: string,
    courtLevel: CourtLevel,
  ): AuthorityClassification {
    try {
      return classifyPrecedentAuthority(precedent, jurisdiction, courtLevel);
    } catch (error) {
      this.logger.error('Failed to classify precedent authority', error.stack);
      throw error;
    }
  }

  /**
   * Determine binding level
   */
  getBindingLevel(classification: AuthorityClassification): BindingLevel {
    try {
      return determineBindingLevel(classification);
    } catch (error) {
      this.logger.error('Failed to determine binding level', error.stack);
      throw error;
    }
  }

  /**
   * Evaluate jurisdictional reach
   */
  evaluateJurisdictionalReachScope(precedent: LegalPrecedent): string[] {
    try {
      return evaluateJurisdictionalReach(precedent);
    } catch (error) {
      this.logger.error('Failed to evaluate jurisdictional reach', error.stack);
      return [];
    }
  }

  /**
   * Compare authority strength
   */
  compareAuthorities(
    precedent1: LegalPrecedent,
    precedent2: LegalPrecedent,
  ): { stronger: LegalPrecedent; weaker: LegalPrecedent } | null {
    try {
      return compareAuthorityStrength(precedent1, precedent2);
    } catch (error) {
      this.logger.error('Failed to compare authority strength', error.stack);
      return null;
    }
  }

  /**
   * Calculate precedent strength
   */
  getPrecedentStrength(precedent: LegalPrecedent): PrecedentStrengthAnalysis {
    try {
      return calculatePrecedentStrength(precedent);
    } catch (error) {
      this.logger.error('Failed to calculate precedent strength', error.stack);
      throw error;
    }
  }

  /**
   * Calculate citation score
   */
  getCitationScore(precedent: LegalPrecedent): number {
    try {
      return calculateCitationScore(precedent);
    } catch (error) {
      this.logger.error('Failed to calculate citation score', error.stack);
      return 0;
    }
  }

  /**
   * Calculate court authority score
   */
  getCourtAuthorityScore(courtLevel: CourtLevel): number {
    try {
      return calculateCourtAuthorityScore(courtLevel);
    } catch (error) {
      this.logger.error('Failed to calculate court authority score', error.stack);
      return 0;
    }
  }

  /**
   * Calculate precedent temporal relevance
   */
  getPrecedentTemporalRelevance(decisionDate: Date): number {
    try {
      return calculatePrecedentTemporalRelevance(decisionDate);
    } catch (error) {
      this.logger.error('Failed to calculate precedent temporal relevance', error.stack);
      return 0;
    }
  }

  /**
   * Calculate treatment score
   */
  getTreatmentScore(precedent: LegalPrecedent): number {
    try {
      return calculateTreatmentScore(precedent);
    } catch (error) {
      this.logger.error('Failed to calculate treatment score', error.stack);
      return 0;
    }
  }

  /**
   * Calculate consistency score
   */
  getConsistencyScore(precedent: LegalPrecedent): number {
    try {
      return calculateConsistencyScore(precedent);
    } catch (error) {
      this.logger.error('Failed to calculate consistency score', error.stack);
      return 0;
    }
  }

  /**
   * Detect overruling relationships
   */
  detectOverrulingRelationships(
    precedent: LegalPrecedent,
    relationships: PrecedentRelationship[],
  ): string[] {
    try {
      return detectOverruling(precedent, relationships);
    } catch (error) {
      this.logger.error('Failed to detect overruling', error.stack);
      return [];
    }
  }

  /**
   * Identify holding overrule
   */
  findHoldingOverrule(holding: Holding, relationships: PrecedentRelationship[]): string[] {
    try {
      return identifyHoldingOverrule(holding, relationships);
    } catch (error) {
      this.logger.error('Failed to identify holding overrule', error.stack);
      return [];
    }
  }

  /**
   * Analyze overruling scope
   */
  getOverrulingScope(overrulingCaseId: string, relationships: PrecedentRelationship[]): any {
    try {
      return analyzeOverrulingScope(overrulingCaseId, relationships);
    } catch (error) {
      this.logger.error('Failed to analyze overruling scope', error.stack);
      throw error;
    }
  }

  /**
   * Track overruling history
   */
  getOverrulingHistory(precedentId: string, relationships: PrecedentRelationship[]): any[] {
    try {
      return trackOverrulingHistory(precedentId, relationships);
    } catch (error) {
      this.logger.error('Failed to track overruling history', error.stack);
      return [];
    }
  }

  /**
   * Parse case citation
   */
  parseCaseCitationString(citation: string): any {
    try {
      return parseCaseCitation(citation);
    } catch (error) {
      this.logger.error('Failed to parse case citation', error.stack);
      return null;
    }
  }

  /**
   * Parse statute citation
   */
  parseStatuteCitationString(citation: string): any {
    try {
      return parseStatuteCitation(citation);
    } catch (error) {
      this.logger.error('Failed to parse statute citation', error.stack);
      return null;
    }
  }

  /**
   * Parse generic citation
   */
  parseGenericCitationString(citation: string, authorityType: any): any {
    try {
      return parseGenericCitation(citation, authorityType);
    } catch (error) {
      this.logger.error('Failed to parse generic citation', error.stack);
      return null;
    }
  }

  /**
   * Extract volume, reporter, and page
   */
  extractVolumeReporterPageInfo(citation: string): any {
    try {
      return extractVolumeReporterPage(citation);
    } catch (error) {
      this.logger.error('Failed to extract volume/reporter/page', error.stack);
      return null;
    }
  }

  /**
   * Validate Bluebook citation
   */
  validateBluebookCitationFormat(citation: string, authorityType: any): any {
    try {
      return validateBluebookCitation(citation, authorityType);
    } catch (error) {
      this.logger.error('Failed to validate Bluebook citation', error.stack);
      throw error;
    }
  }

  /**
   * Check citation completeness
   */
  checkCitationCompletenessStatus(citation: string, authorityType: any): any {
    try {
      return checkCitationCompleteness(citation, authorityType);
    } catch (error) {
      this.logger.error('Failed to check citation completeness', error.stack);
      throw error;
    }
  }

  /**
   * Format Bluebook citation
   */
  formatBluebookCitationString(parsed: any, authorityType: any): string {
    try {
      return formatBluebookCitation(parsed, authorityType);
    } catch (error) {
      this.logger.error('Failed to format Bluebook citation', error.stack);
      throw error;
    }
  }

  /**
   * Convert citation format
   */
  convertCitationFormatString(citation: string, fromFormat: string, toFormat: string): string {
    try {
      return convertCitationFormat(citation, fromFormat, toFormat);
    } catch (error) {
      this.logger.error('Failed to convert citation format', error.stack);
      throw error;
    }
  }

  /**
   * Generate short form citation
   */
  generateShortForm(fullCitation: string, authorityType: any): string {
    try {
      return generateShortFormCitation(fullCitation, authorityType);
    } catch (error) {
      this.logger.error('Failed to generate short form citation', error.stack);
      throw error;
    }
  }

  /**
   * Normalize citation advanced
   */
  normalizeCitationAdvancedString(citation: string): string {
    try {
      return normalizeCitationAdvanced(citation);
    } catch (error) {
      this.logger.error('Failed to normalize citation (advanced)', error.stack);
      throw error;
    }
  }

  /**
   * Format parallel citations
   */
  formatParallelCitationsString(primary: string, parallels: any[]): string {
    try {
      return formatParallelCitations(primary, parallels);
    } catch (error) {
      this.logger.error('Failed to format parallel citations', error.stack);
      throw error;
    }
  }

  /**
   * Resolve parallel citations
   */
  resolveParallelCitationsList(citation: string): any[] {
    try {
      return resolveParallelCitations(citation);
    } catch (error) {
      this.logger.error('Failed to resolve parallel citations', error.stack);
      return [];
    }
  }

  /**
   * Find official citation
   */
  findOfficialCitationString(citations: string[]): string | null {
    try {
      return findOfficialCitation(citations);
    } catch (error) {
      this.logger.error('Failed to find official citation', error.stack);
      return null;
    }
  }

  /**
   * Execute advanced boolean search
   */
  async executeAdvancedSearch(query: string, options: any): Promise<any[]> {
    try {
      return await executeAdvancedBooleanSearch(query, options);
    } catch (error) {
      this.logger.error('Failed to execute advanced search', error.stack);
      return [];
    }
  }

  /**
   * Build boolean expression
   */
  async buildSearchExpression(terms: string[], operator: string): Promise<string> {
    try {
      return await buildBooleanExpression(terms, operator);
    } catch (error) {
      this.logger.error('Failed to build boolean expression', error.stack);
      throw error;
    }
  }

  /**
   * Execute proximity search
   */
  async executeProximitySearchQuery(term1: string, term2: string, distance: number): Promise<any[]> {
    try {
      return await executeProximitySearch(term1, term2, distance);
    } catch (error) {
      this.logger.error('Failed to execute proximity search', error.stack);
      return [];
    }
  }

  /**
   * Execute fuzzy search
   */
  async executeFuzzySearchQuery(term: string, threshold: number): Promise<any[]> {
    try {
      return await executeFuzzySearch(term, threshold);
    } catch (error) {
      this.logger.error('Failed to execute fuzzy search', error.stack);
      return [];
    }
  }

  /**
   * Execute wildcard search
   */
  async executeWildcardSearchQuery(pattern: string): Promise<any[]> {
    try {
      return await executeWildcardSearch(pattern);
    } catch (error) {
      this.logger.error('Failed to execute wildcard search', error.stack);
      return [];
    }
  }

  /**
   * Optimize search query
   */
  async optimizeQuery(query: string): Promise<string> {
    try {
      return await optimizeSearchQuery(query);
    } catch (error) {
      this.logger.error('Failed to optimize search query', error.stack);
      return query;
    }
  }

  /**
   * Cache search results
   */
  async cacheResults(queryId: string, results: any[]): Promise<void> {
    try {
      await cacheSearchResults(queryId, results);
    } catch (error) {
      this.logger.error('Failed to cache search results', error.stack);
    }
  }

  /**
   * Get cached search results
   */
  async getCachedResults(queryId: string): Promise<any[] | null> {
    try {
      return await getCachedSearchResults(queryId);
    } catch (error) {
      this.logger.error('Failed to get cached search results', error.stack);
      return null;
    }
  }

  /**
   * Discover documents
   */
  async discoverDocumentsInSet(criteria: any): Promise<any[]> {
    try {
      return await discoverDocuments(criteria);
    } catch (error) {
      this.logger.error('Failed to discover documents', error.stack);
      return [];
    }
  }

  /**
   * Filter by custodian
   */
  async filterDocumentsByCustodian(documents: any[], custodian: string): Promise<any[]> {
    try {
      return await filterByCustodian(documents, custodian);
    } catch (error) {
      this.logger.error('Failed to filter by custodian', error.stack);
      return [];
    }
  }

  /**
   * Filter by date range
   */
  async filterDocumentsByDateRange(documents: any[], startDate: Date, endDate: Date): Promise<any[]> {
    try {
      return await filterByDateRange(documents, startDate, endDate);
    } catch (error) {
      this.logger.error('Failed to filter by date range', error.stack);
      return [];
    }
  }

  /**
   * Filter by file type
   */
  async filterDocumentsByFileType(documents: any[], fileType: string): Promise<any[]> {
    try {
      return await filterByFileType(documents, fileType);
    } catch (error) {
      this.logger.error('Failed to filter by file type', error.stack);
      return [];
    }
  }

  /**
   * Filter by classification
   */
  async filterDocumentsByClassification(documents: any[], classification: string): Promise<any[]> {
    try {
      return await filterByClassification(documents, classification);
    } catch (error) {
      this.logger.error('Failed to filter by classification', error.stack);
      return [];
    }
  }

  /**
   * Deduplicate documents
   */
  async deduplicateDocumentSet(documents: any[]): Promise<any[]> {
    try {
      return await deduplicateDocuments(documents);
    } catch (error) {
      this.logger.error('Failed to deduplicate documents', error.stack);
      return [];
    }
  }

  /**
   * Thread email conversations
   */
  async threadEmails(emailDocumentIds: string[]): Promise<any[]> {
    try {
      return await threadEmailConversations(emailDocumentIds);
    } catch (error) {
      this.logger.error('Failed to thread email conversations', error.stack);
      return [];
    }
  }

  /**
   * Extract document metadata
   */
  async extractMetadata(documentId: string): Promise<any> {
    try {
      return await extractDocumentMetadata(documentId);
    } catch (error) {
      this.logger.error('Failed to extract document metadata', error.stack);
      throw error;
    }
  }

  /**
   * Create privilege log entry
   */
  async createPrivilegeLog(data: any): Promise<any> {
    try {
      return await createPrivilegeLogEntry(data);
    } catch (error) {
      this.logger.error('Failed to create privilege log entry', error.stack);
      throw error;
    }
  }
}

// Re-export all types for external use
export {
  // Case law research types
  LegalCase,
  Citation,
  Court,
  CitationFormat,
  ParsedCitation,
  CitationValidationResult,
  CaseLawSearchQuery,
  CitationNetwork,

  // Precedent analysis types
  LegalPrecedent,
  CourtLevel,
  AuthorityType,
  PrecedentStatus,
  AuthorityClassification,
  BindingLevel,
  PrecedentStrengthAnalysis,
  PrecedentRelationship,
  Holding,

  // Citation validation types
  CitationEntity,
  LegalAuthority,
  CreateCitationDto,
  ValidateCitationDto,
  ConvertCitationDto,
  ShepardizeCitationDto,
  ResolveParallelCitationDto,
};

// Re-export the service as default
export default WestlawCaseResearchService;
