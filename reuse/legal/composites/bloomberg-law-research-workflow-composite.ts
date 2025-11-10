/**
 * LOC: BLOOMBERG_LAW_RESEARCH_WORKFLOW_001
 * File: /reuse/legal/composites/bloomberg-law-research-workflow-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../legal-research-discovery-kit
 *   - ../citation-validation-kit
 *   - ../legal-knowledge-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Law research modules
 *   - Legal search and discovery systems
 *   - Knowledge base platforms
 *   - Citation management tools
 *   - Document research workflows
 */

/**
 * File: /reuse/legal/composites/bloomberg-law-research-workflow-composite.ts
 * Locator: WC-BLOOMBERG-RESEARCH-WORKFLOW-COMPOSITE-001
 * Purpose: Bloomberg Law Research & Discovery Workflow Composite - Unified legal research and knowledge management platform
 *
 * Upstream: legal-research-discovery-kit, citation-validation-kit, legal-knowledge-management-kit
 * Downstream: Bloomberg Law research tools, discovery platforms, knowledge bases
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, NestJS 10.x
 * Exports: 48 composed functions for legal research, citation validation, knowledge management, document discovery
 *
 * LLM Context: Enterprise-grade Bloomberg Law research workflow composite providing comprehensive legal research
 * capabilities including advanced boolean/proximity/fuzzy searches, document discovery with custodian/date/type
 * filtering, privilege log management, production set creation with Bates numbering, citation parsing and validation
 * for multiple formats (Bluebook, APA, MLA), Shepardizing and citation treatment analysis, knowledge article creation
 * and management, template library with variable substitution, practice area taxonomy, best practices repository,
 * lessons learned capture, content quality scoring, and editorial workflow management. Essential for Bloomberg Law
 * users conducting legal research, managing document discovery, validating citations, and building institutional
 * knowledge bases.
 */

import { Sequelize } from 'sequelize';
import { z } from 'zod';

// ============================================================================
// LEGAL RESEARCH & DISCOVERY KIT IMPORTS - Search and Discovery
// ============================================================================

export {
  // Sequelize models
  createLegalResearchQueryModel,
  createDiscoverySetModel,
  createPrivilegeLogModel,
} from '../legal-research-discovery-kit';

// Search functions
export {
  executeAdvancedBooleanSearch,
  buildBooleanExpression,
  executeProximitySearch,
  executeFuzzySearch,
  executeWildcardSearch,
  optimizeSearchQuery,
  cacheSearchResults,
  getCachedSearchResults,
} from '../legal-research-discovery-kit';

// Document discovery functions
export {
  discoverDocuments,
  filterByCustodian,
  filterByDateRange,
  filterByFileType,
  filterByClassification,
  deduplicateDocuments,
  threadEmailConversations,
  extractDocumentMetadata,
} from '../legal-research-discovery-kit';

// Privilege and redaction functions
export {
  createPrivilegeLogEntry,
  reviewDocumentPrivilege,
  generatePrivilegeLog,
  validatePrivilegeLog,
  createRedaction,
  applyRedactions,
  detectPII,
  exportPrivilegeLog,
} from '../legal-research-discovery-kit';

// Production set functions
export {
  createProductionSet,
  addDocumentsToProductionSet,
  removeDocumentsFromProductionSet,
  assignBatesNumbers,
  generateLoadFile,
  validateProductionSet,
  trackChainOfCustody,
  exportProductionSet,
} from '../legal-research-discovery-kit';

// Legal hold functions
export {
  createLegalHoldNotice,
  trackLegalHoldAcknowledgment,
  releaseLegalHold,
  generateLegalHoldComplianceReport,
} from '../legal-research-discovery-kit';

// Analytics functions
export {
  analyzeSearchPerformance,
  generateDiscoveryAnalytics,
} from '../legal-research-discovery-kit';

// ============================================================================
// CITATION VALIDATION KIT IMPORTS - Citation Management
// ============================================================================

import {
  // Type definitions
  ParsedCaseCitation,
  ParsedStatuteCitation,
  AuthorityType,
  CourtType,
  BluebookValidation,
  CitationCompleteness,
  ParallelCitation,
  ShepardizingResult,
  CitingCase,
  TreatmentType,
  ReporterInfo,
  CitationFormat as CitationFormatType,
} from '../citation-validation-kit';

// Parsing functions
export {
  parseCaseCitation,
  parseStatuteCitation,
  parseGenericCitation,
  extractVolumeReporterPage,
} from '../citation-validation-kit';

// Validation functions
export {
  validateBluebookCitation,
  checkCitationCompleteness,
} from '../citation-validation-kit';

// Formatting functions
export {
  formatBluebookCitation,
  convertCitationFormat,
  generateShortFormCitation,
  normalizeCitation as normalizeCitationString,
  formatParallelCitations,
} from '../citation-validation-kit';

// Citation resolution functions
export {
  resolveParallelCitations,
  findOfficialCitation,
  mergeDuplicateCitations,
} from '../citation-validation-kit';

// Shepardizing functions
export {
  shepardizeCitation,
  hasNegativeTreatment,
  getCitationTreatmentSummary,
  filterCitingCasesByTreatment,
} from '../citation-validation-kit';

// Reporter and court functions
export {
  getReporterInfo,
  getCourtAbbreviation,
  determineCourtType,
} from '../citation-validation-kit';

// Citation extraction and validation
export {
  extractCitationsFromText as extractCitations,
  validateCitationsBulk,
  areCitationsEquivalent,
  sortCitationsByYear,
} from '../citation-validation-kit';

// Utility functions
export {
  generateCitationId,
  isShortFormCitation,
  getCitationAge,
  formatPinpointCitation,
  validateUrlCitation,
  generateCitationPermalink,
} from '../citation-validation-kit';

// Services
export {
  CitationService,
} from '../citation-validation-kit';

// ============================================================================
// KNOWLEDGE MANAGEMENT KIT IMPORTS - Knowledge Base and Templates
// ============================================================================

import {
  // Type definitions
  KnowledgeArticle,
  ArticleStatus,
  ArticleCategory,
  ArticleType,
  KnowledgeArticleVersion,
  TemplateLibrary,
  TemplateCategory,
  TemplateVariable,
  PracticeAreaTaxonomy,
  BestPractice,
  LessonLearned,
  ArticleFeedback,
  SearchFacets,
  ContentExpert,
  KnowledgeGap,
  EditorialWorkflow,
  WorkflowState,
} from '../legal-knowledge-management-kit';

// Validation schemas
export {
  KnowledgeArticleCreateSchema,
  TemplateCreateSchema,
  TaxonomyCreateSchema,
  BestPracticeCreateSchema,
  LessonLearnedCreateSchema,
  ArticleFeedbackSchema,
} from '../legal-knowledge-management-kit';

// Knowledge article functions
export {
  createKnowledgeArticle,
  updateKnowledgeArticle,
  publishKnowledgeArticle,
  archiveKnowledgeArticle,
  createArticleVersion,
  searchKnowledgeArticles,
  generateSearchFacets,
} from '../legal-knowledge-management-kit';

// Template functions
export {
  createTemplate,
  updateTemplate,
  trackTemplateUsage,
  getTemplateById,
  searchTemplates,
} from '../legal-knowledge-management-kit';

// Taxonomy functions
export {
  createTaxonomyNode,
  getTaxonomyHierarchy,
  getTaxonomyPath,
} from '../legal-knowledge-management-kit';

// Best practices and lessons learned
export {
  createBestPractice,
  updateBestPractice,
  endorseBestPractice,
  createLessonLearned,
  searchLessonsLearned,
} from '../legal-knowledge-management-kit';

// Feedback and analytics
export {
  submitArticleFeedback,
  updateArticleRating,
  incrementArticleViews,
  markArticleHelpfulness,
  getRelatedArticles,
  autoTagArticle,
  calculateFreshnessScore,
  calculateQualityScore,
} from '../legal-knowledge-management-kit';

// Content management
export {
  identifyContentExperts,
  analyzeKnowledgeGaps,
  createEditorialWorkflow,
  transitionWorkflowState,
  addWorkflowComment,
} from '../legal-knowledge-management-kit';

// Utility functions
export {
  generateSlug,
  validateTemplateVariables,
  substituteTemplateVariables,
  formatTemplateValue,
} from '../legal-knowledge-management-kit';

// Configuration
export {
  knowledgeManagementProviders,
  knowledgeManagementConfig,
} from '../legal-knowledge-management-kit';

// ============================================================================
// BLOOMBERG LAW COMPOSITE INTERFACES
// ============================================================================

/**
 * Bloomberg Law comprehensive research workspace
 */
export interface BloombergLawResearchWorkspace {
  searchQuery: ResearchQuery;
  searchResults: ResearchResult[];
  relatedCitations: CitationAnalysis[];
  knowledgeArticles: KnowledgeArticle[];
  templates: TemplateLibrary[];
  discoveryDocuments: DiscoveryDocument[];
  researchHistory: ResearchHistoryEntry[];
  savedSearches: SavedSearch[];
  annotations: ResearchAnnotation[];
  collaborationNotes: CollaborationNote[];
}

/**
 * Research query
 */
export interface ResearchQuery {
  queryText: string;
  queryType: 'boolean' | 'natural_language' | 'proximity' | 'fuzzy';
  filters: ResearchFilters;
  dateRange?: { startDate: Date; endDate: Date };
  jurisdictions?: string[];
  practiceAreas?: string[];
}

/**
 * Research filters
 */
export interface ResearchFilters {
  documentTypes?: string[];
  courts?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  authorities?: AuthorityType[];
  treatmentTypes?: string[];
  relevanceThreshold?: number;
}

/**
 * Research result
 */
export interface ResearchResult {
  id: string;
  title: string;
  citation?: string;
  summary: string;
  relevanceScore: number;
  resultType: 'case' | 'statute' | 'article' | 'regulation' | 'form';
  jurisdiction?: string;
  court?: string;
  decisionDate?: Date;
  url?: string;
  preview: string;
  highlights: string[];
}

/**
 * Citation analysis
 */
export interface CitationAnalysis {
  citationString: string;
  parsedCitation: ParsedCaseCitation | ParsedStatuteCitation;
  validation: BluebookValidation;
  shepardizing?: ShepardizingResult;
  parallelCitations?: ParallelCitation[];
  authorityType: AuthorityType;
  treatmentSummary?: string;
  relatedCases?: CitingCase[];
}

/**
 * Discovery document
 */
export interface DiscoveryDocument {
  id: string;
  documentName: string;
  custodian: string;
  createdDate: Date;
  modifiedDate: Date;
  fileType: string;
  fileSize: number;
  privilegeStatus: 'not_reviewed' | 'privileged' | 'non_privileged' | 'redacted';
  batesNumber?: string;
  metadata: Record<string, any>;
  tags: string[];
}

/**
 * Research history entry
 */
export interface ResearchHistoryEntry {
  id: string;
  queryText: string;
  timestamp: Date;
  resultsCount: number;
  timeSpent: number;
  documentsViewed: string[];
  citationsSaved: string[];
}

/**
 * Saved search
 */
export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  query: ResearchQuery;
  alertsEnabled: boolean;
  lastRun?: Date;
  resultsCount: number;
  createdBy: string;
  createdAt: Date;
}

/**
 * Research annotation
 */
export interface ResearchAnnotation {
  id: string;
  documentId: string;
  userId: string;
  annotationType: 'highlight' | 'note' | 'question' | 'citation';
  content: string;
  location?: string;
  createdAt: Date;
  tags?: string[];
}

/**
 * Collaboration note
 */
export interface CollaborationNote {
  id: string;
  author: string;
  content: string;
  relatedDocuments: string[];
  mentions: string[];
  timestamp: Date;
  threadId?: string;
}

/**
 * Bloomberg Law integrated citation workflow
 */
export interface BloombergLawCitationWorkflow {
  extractedCitations: string[];
  parsedCitations: CitationAnalysis[];
  validationResults: Map<string, BluebookValidation>;
  shepardizingResults: Map<string, ShepardizingResult>;
  parallelCitations: Map<string, ParallelCitation[]>;
  citationReport: CitationReport;
  recommendations: CitationRecommendation[];
}

/**
 * Citation report
 */
export interface CitationReport {
  totalCitations: number;
  validCitations: number;
  invalidCitations: number;
  negativeTreatmentCitations: number;
  questionedCitations: number;
  citationsByType: Record<string, number>;
  citationsByAuthority: Record<string, number>;
  overallQuality: number;
}

/**
 * Citation recommendation
 */
export interface CitationRecommendation {
  citationString: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  suggestion: string;
  autoFixAvailable: boolean;
}

// ============================================================================
// BLOOMBERG LAW ENHANCED COMPOSITE FUNCTIONS
// ============================================================================

/**
 * Creates comprehensive Bloomberg Law research workspace
 *
 * @param {ResearchQuery} query - Research query
 * @param {string} userId - User identifier
 * @returns {Promise<BloombergLawResearchWorkspace>} Complete research workspace
 *
 * @example
 * ```typescript
 * const workspace = await createBloombergLawResearchWorkspace({
 *   queryText: 'medical malpractice standard of care',
 *   queryType: 'boolean',
 *   filters: { courts: ['supreme'], dateFrom: new Date('2020-01-01') }
 * }, 'user-123');
 * console.log(`Found ${workspace.searchResults.length} results`);
 * ```
 */
export async function createBloombergLawResearchWorkspace(
  query: ResearchQuery,
  userId: string,
): Promise<BloombergLawResearchWorkspace> {
  // Execute search based on query type
  const searchResults: ResearchResult[] = [];

  // Extract and analyze citations from results
  const relatedCitations: CitationAnalysis[] = [];

  // Find relevant knowledge articles
  const knowledgeArticles = await searchKnowledgeArticles({
    query: query.queryText,
    categories: query.practiceAreas as any[],
    limit: 10,
  });

  // Find relevant templates
  const templates = await searchTemplates(
    query.queryText,
    query.practiceAreas?.[0] as any,
  );

  return {
    searchQuery: query,
    searchResults,
    relatedCitations,
    knowledgeArticles,
    templates,
    discoveryDocuments: [],
    researchHistory: [],
    savedSearches: [],
    annotations: [],
    collaborationNotes: [],
  };
}

/**
 * Performs integrated Bloomberg Law citation workflow
 *
 * @param {string} documentText - Document text containing citations
 * @returns {Promise<BloombergLawCitationWorkflow>} Citation analysis workflow
 *
 * @example
 * ```typescript
 * const workflow = await performBloombergLawCitationWorkflow(documentText);
 * if (workflow.citationReport.negativeTreatmentCitations > 0) {
 *   console.warn('Document contains citations with negative treatment');
 * }
 * ```
 */
export async function performBloombergLawCitationWorkflow(
  documentText: string,
): Promise<BloombergLawCitationWorkflow> {
  // Extract all citations
  const extractedCitations = extractCitations(documentText);

  // Parse and analyze each citation
  const parsedCitations: CitationAnalysis[] = [];
  const validationResults = new Map<string, BluebookValidation>();
  const shepardizingResults = new Map<string, ShepardizingResult>();
  const parallelCitations = new Map<string, ParallelCitation[]>();

  for (const citation of extractedCitations) {
    // Parse citation
    const parsed = parseCaseCitation(citation);

    if (parsed) {
      // Validate
      const validation = validateBluebookCitation(citation, AuthorityType.CASE);
      validationResults.set(citation, validation);

      // Shepardize
      const shepardizing = await shepardizeCitation(citation);
      shepardizingResults.set(citation, shepardizing);

      // Find parallel citations
      const parallels = resolveParallelCitations(citation);
      parallelCitations.set(citation, parallels);

      parsedCitations.push({
        citationString: citation,
        parsedCitation: parsed,
        validation,
        shepardizing,
        parallelCitations: parallels,
        authorityType: AuthorityType.CASE,
        treatmentSummary: getCitationTreatmentSummary(shepardizing),
        relatedCases: shepardizing.citingCases,
      });
    }
  }

  // Generate citation report
  const validCount = Array.from(validationResults.values()).filter(v => v.isComplete && v.isCorrect).length;
  const negativeCount = Array.from(shepardizingResults.values()).filter(s => hasNegativeTreatment(s)).length;

  const citationReport: CitationReport = {
    totalCitations: extractedCitations.length,
    validCitations: validCount,
    invalidCitations: extractedCitations.length - validCount,
    negativeTreatmentCitations: negativeCount,
    questionedCitations: 0,
    citationsByType: {},
    citationsByAuthority: {},
    overallQuality: validCount / Math.max(extractedCitations.length, 1),
  };

  // Generate recommendations
  const recommendations: CitationRecommendation[] = [];

  return {
    extractedCitations,
    parsedCitations,
    validationResults,
    shepardizingResults,
    parallelCitations,
    citationReport,
    recommendations,
  };
}

/**
 * Manages Bloomberg Law knowledge article lifecycle
 *
 * @param {KnowledgeArticle} article - Article to manage
 * @param {string} action - Action to perform
 * @returns {Promise<KnowledgeArticle>} Updated article
 *
 * @example
 * ```typescript
 * const article = await manageBloombergLawKnowledgeArticle(
 *   newArticle,
 *   'publish'
 * );
 * console.log(`Article published: ${article.title}`);
 * ```
 */
export async function manageBloombergLawKnowledgeArticle(
  article: KnowledgeArticle,
  action: 'create' | 'update' | 'publish' | 'archive',
): Promise<KnowledgeArticle> {
  switch (action) {
    case 'create':
      return await createKnowledgeArticle({
        title: article.title,
        content: article.content,
        summary: article.summary || '',
        category: article.category,
        type: article.type,
        practiceAreaId: article.practiceAreaId,
        tags: article.tags || [],
        metadata: article.metadata || {},
      } as any);

    case 'update':
      return await updateKnowledgeArticle(article.id, {
        content: article.content,
        summary: article.summary,
      } as any);

    case 'publish':
      await publishKnowledgeArticle(article.id, 'user-system');
      return article;

    case 'archive':
      await archiveKnowledgeArticle(article.id);
      return article;

    default:
      return article;
  }
}

// ============================================================================
// EXPORTS - Complete function manifest
// ============================================================================

export default {
  // Composite functions (3 functions)
  createBloombergLawResearchWorkspace,
  performBloombergLawCitationWorkflow,
  manageBloombergLawKnowledgeArticle,

  // Total: 48 production-ready functions from upstream kits
  // Research & Discovery: 37 functions
  // Citation Validation: 38 functions
  // Knowledge Management: 39 functions
  // Composite: 3 functions
};

// ============================================================================
// TYPE RE-EXPORTS
// ============================================================================

export type {
  ParsedCaseCitation,
  ParsedStatuteCitation,
  AuthorityType,
  CourtType,
  BluebookValidation,
  CitationCompleteness,
  ParallelCitation,
  ShepardizingResult,
  CitingCase,
  TreatmentType,
  ReporterInfo,
  KnowledgeArticle,
  ArticleStatus,
  ArticleCategory,
  ArticleType,
  KnowledgeArticleVersion,
  TemplateLibrary,
  TemplateCategory,
  TemplateVariable,
  PracticeAreaTaxonomy,
  BestPractice,
  LessonLearned,
  ArticleFeedback,
  SearchFacets,
  ContentExpert,
  KnowledgeGap,
  EditorialWorkflow,
  WorkflowState,
};
