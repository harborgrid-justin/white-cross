/**
 * LOC: LEGAL_KM_KIT_001
 * File: /reuse/legal/legal-knowledge-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - elasticsearch (optional)
 *   - fuse.js (for local search)
 *
 * DOWNSTREAM (imported by):
 *   - Legal knowledge modules
 *   - Knowledge management controllers
 *   - Template library services
 *   - Practice area services
 *   - Legal research services
 */
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
/**
 * Knowledge article status lifecycle
 */
export declare enum KnowledgeArticleStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    DEPRECATED = "deprecated",
    UNDER_REVISION = "under_revision"
}
/**
 * Knowledge article types
 */
export declare enum KnowledgeArticleType {
    LEGAL_GUIDE = "legal_guide",
    CASE_SUMMARY = "case_summary",
    STATUTE_ANALYSIS = "statute_analysis",
    PRACTICE_NOTE = "practice_note",
    PROCEDURAL_GUIDE = "procedural_guide",
    BEST_PRACTICE = "best_practice",
    LESSON_LEARNED = "lesson_learned",
    HOW_TO = "how_to",
    FAQ = "faq",
    CHECKLIST = "checklist",
    PLAYBOOK = "playbook",
    LEGAL_MEMO = "legal_memo",
    RESEARCH_NOTE = "research_note",
    COMPLIANCE_GUIDE = "compliance_guide",
    RISK_ASSESSMENT = "risk_assessment",
    OTHER = "other"
}
/**
 * Template types for legal documents
 */
export declare enum TemplateType {
    CONTRACT = "contract",
    MOTION = "motion",
    PLEADING = "pleading",
    BRIEF = "brief",
    LETTER = "letter",
    MEMORANDUM = "memorandum",
    AGREEMENT = "agreement",
    NOTICE = "notice",
    CONSENT_FORM = "consent_form",
    POLICY_DOCUMENT = "policy_document",
    COMPLIANCE_FORM = "compliance_form",
    DISCLOSURE = "disclosure",
    WAIVER = "waiver",
    AFFIDAVIT = "affidavit",
    DECLARATION = "declaration",
    WORKSHEET = "worksheet",
    OTHER = "other"
}
/**
 * Practice area categories
 */
export declare enum PracticeArea {
    HEALTHCARE_LAW = "healthcare_law",
    MEDICAL_MALPRACTICE = "medical_malpractice",
    HIPAA_COMPLIANCE = "hipaa_compliance",
    PATIENT_RIGHTS = "patient_rights",
    HEALTHCARE_TRANSACTIONS = "healthcare_transactions",
    REGULATORY_COMPLIANCE = "regulatory_compliance",
    EMPLOYMENT_LAW = "employment_law",
    CORPORATE_LAW = "corporate_law",
    CONTRACT_LAW = "contract_law",
    INTELLECTUAL_PROPERTY = "intellectual_property",
    LITIGATION = "litigation",
    INSURANCE_LAW = "insurance_law",
    REAL_ESTATE = "real_estate",
    TAX_LAW = "tax_law",
    PRIVACY_LAW = "privacy_law",
    CYBERSECURITY_LAW = "cybersecurity_law",
    ADMINISTRATIVE_LAW = "administrative_law",
    GENERAL_COUNSEL = "general_counsel",
    OTHER = "other"
}
/**
 * Content visibility and access levels
 */
export declare enum ContentVisibility {
    PUBLIC = "public",
    INTERNAL = "internal",
    RESTRICTED = "restricted",
    CONFIDENTIAL = "confidential",
    PRACTICE_GROUP_ONLY = "practice_group_only"
}
/**
 * Article quality ratings
 */
export declare enum QualityRating {
    NEEDS_IMPROVEMENT = 1,
    FAIR = 2,
    GOOD = 3,
    VERY_GOOD = 4,
    EXCELLENT = 5
}
/**
 * Taxonomy node types
 */
export declare enum TaxonomyNodeType {
    CATEGORY = "category",
    SUBCATEGORY = "subcategory",
    TOPIC = "topic",
    SUBTOPIC = "subtopic",
    TAG = "tag"
}
/**
 * Editorial workflow states
 */
export declare enum EditorialWorkflowState {
    AUTHORING = "authoring",
    PEER_REVIEW = "peer_review",
    EDITORIAL_REVIEW = "editorial_review",
    LEGAL_REVIEW = "legal_review",
    COMPLIANCE_REVIEW = "compliance_review",
    APPROVED_FOR_PUBLISH = "approved_for_publish",
    PUBLISHED = "published",
    REJECTED = "rejected"
}
/**
 * Knowledge article entity
 */
export interface KnowledgeArticle {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    articleType: KnowledgeArticleType;
    status: KnowledgeArticleStatus;
    visibility: ContentVisibility;
    practiceAreas: PracticeArea[];
    taxonomyIds: string[];
    version: number;
    authorId: string;
    authorName: string;
    contributorIds: string[];
    reviewerId?: string;
    approvedById?: string;
    publishedAt?: Date;
    lastReviewedAt?: Date;
    nextReviewDate?: Date;
    expirationDate?: Date;
    viewCount: number;
    helpfulCount: number;
    notHelpfulCount: number;
    averageRating?: number;
    ratingCount: number;
    searchKeywords: string[];
    relatedArticleIds: string[];
    citations: ArticleCitation[];
    attachments: ArticleAttachment[];
    metadata: ArticleMetadata;
    tags: string[];
    jurisdiction?: string;
    effectiveDate?: Date;
    isTemplate: boolean;
    templateVariables: TemplateVariable[];
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Article metadata
 */
export interface ArticleMetadata {
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    estimatedReadTime?: number;
    language: string;
    format: 'text' | 'html' | 'markdown' | 'rich_text';
    sources: string[];
    lastFactChecked?: Date;
    freshnessScore?: number;
    qualityScore?: number;
    completenessScore?: number;
    expertReviewed: boolean;
    peerReviewed: boolean;
    externalReferences: ExternalReference[];
    customFields: Record<string, any>;
}
/**
 * External reference
 */
export interface ExternalReference {
    type: 'statute' | 'regulation' | 'case_law' | 'article' | 'website' | 'book' | 'other';
    citation: string;
    url?: string;
    description?: string;
    accessDate?: Date;
}
/**
 * Article citation
 */
export interface ArticleCitation {
    citationType: 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'internal';
    citation: string;
    url?: string;
    description?: string;
    relevance?: 'primary' | 'secondary' | 'supporting';
}
/**
 * Article attachment
 */
export interface ArticleAttachment {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
    description?: string;
    uploadedAt: Date;
    uploadedBy: string;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'text';
    required: boolean;
    defaultValue?: any;
    options?: string[];
    validation?: string;
    description?: string;
    placeholder?: string;
}
/**
 * Template library entity
 */
export interface TemplateLibrary {
    id: string;
    name: string;
    description?: string;
    templateType: TemplateType;
    practiceAreas: PracticeArea[];
    content: string;
    version: number;
    variables: TemplateVariable[];
    jurisdiction?: string;
    tags: string[];
    isOfficial: boolean;
    isVerified: boolean;
    usageCount: number;
    lastUsedAt?: Date;
    createdBy: string;
    approvedBy?: string;
    metadata: TemplateMetadata;
    relatedTemplateIds: string[];
    parentTemplateId?: string;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Template metadata
 */
export interface TemplateMetadata {
    fileFormat: 'docx' | 'pdf' | 'html' | 'markdown' | 'rtf' | 'txt';
    pageCount?: number;
    wordCount?: number;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedCompletionTime?: number;
    requiredInformation: string[];
    optionalInformation: string[];
    instructions?: string;
    customFields: Record<string, any>;
}
/**
 * Practice area taxonomy entity
 */
export interface PracticeAreaTaxonomy {
    id: string;
    name: string;
    slug: string;
    description?: string;
    nodeType: TaxonomyNodeType;
    practiceArea: PracticeArea;
    parentId?: string;
    level: number;
    path: string;
    sortOrder: number;
    articleCount: number;
    templateCount: number;
    isActive: boolean;
    metadata: TaxonomyMetadata;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Taxonomy metadata
 */
export interface TaxonomyMetadata {
    synonyms: string[];
    relatedTaxonomyIds: string[];
    expertUserIds: string[];
    icon?: string;
    color?: string;
    displayOrder?: number;
    customFields: Record<string, any>;
}
/**
 * Best practice entity
 */
export interface BestPractice {
    id: string;
    title: string;
    description: string;
    practiceAreas: PracticeArea[];
    category: string;
    content: string;
    recommendations: string[];
    warnings: string[];
    examples: PracticeExample[];
    applicability: string[];
    updatedFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'as_needed';
    authorId: string;
    reviewerIds: string[];
    endorsements: number;
    relatedArticleIds: string[];
    tags: string[];
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Practice example
 */
export interface PracticeExample {
    title: string;
    scenario: string;
    approach: string;
    outcome?: string;
    lessonLearned?: string;
}
/**
 * Lesson learned entity
 */
export interface LessonLearned {
    id: string;
    title: string;
    summary: string;
    situation: string;
    action: string;
    result: string;
    lesson: string;
    practiceAreas: PracticeArea[];
    caseId?: string;
    caseReference?: string;
    projectId?: string;
    contributorId: string;
    contributorName: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    applicability: 'specific' | 'broad' | 'universal';
    relatedArticleIds: string[];
    tags: string[];
    visibility: ContentVisibility;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Article version history
 */
export interface ArticleVersion {
    id: string;
    articleId: string;
    versionNumber: number;
    title: string;
    content: string;
    changeDescription?: string;
    changedBy: string;
    changedAt: Date;
    snapshot: Partial<KnowledgeArticle>;
}
/**
 * Article feedback
 */
export interface ArticleFeedback {
    id: string;
    articleId: string;
    userId: string;
    rating?: QualityRating;
    isHelpful?: boolean;
    comment?: string;
    feedbackType: 'rating' | 'comment' | 'suggestion' | 'correction';
    status: 'pending' | 'reviewed' | 'incorporated' | 'dismissed';
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
}
/**
 * Knowledge search filters
 */
export interface KnowledgeSearchFilters {
    query?: string;
    articleTypes?: KnowledgeArticleType[];
    practiceAreas?: PracticeArea[];
    status?: KnowledgeArticleStatus[];
    visibility?: ContentVisibility[];
    authorIds?: string[];
    tags?: string[];
    taxonomyIds?: string[];
    jurisdiction?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minRating?: number;
    sortBy?: 'relevance' | 'date' | 'rating' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    facets?: boolean;
}
/**
 * Search results with facets
 */
export interface KnowledgeSearchResults {
    items: KnowledgeArticle[];
    total: number;
    facets?: SearchFacets;
    query?: string;
    executionTime?: number;
}
/**
 * Search facets for filtering
 */
export interface SearchFacets {
    practiceAreas: FacetCount[];
    articleTypes: FacetCount[];
    tags: FacetCount[];
    authors: FacetCount[];
    years: FacetCount[];
}
/**
 * Facet count
 */
export interface FacetCount {
    value: string;
    count: number;
    label?: string;
}
/**
 * Template usage tracking
 */
export interface TemplateUsage {
    id: string;
    templateId: string;
    userId: string;
    usedAt: Date;
    context?: string;
    documentId?: string;
    feedback?: string;
}
/**
 * Knowledge contribution tracking
 */
export interface ContributionStats {
    userId: string;
    userName: string;
    articlesAuthored: number;
    articlesReviewed: number;
    contributionScore: number;
    lastContribution: Date;
    expertise: PracticeArea[];
    badges: string[];
}
/**
 * Editorial workflow
 */
export interface EditorialWorkflow {
    id: string;
    articleId: string;
    currentState: EditorialWorkflowState;
    assignedTo?: string;
    dueDate?: Date;
    comments: WorkflowComment[];
    history: WorkflowStateChange[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Workflow comment
 */
export interface WorkflowComment {
    userId: string;
    userName: string;
    comment: string;
    commentedAt: Date;
    attachments?: string[];
}
/**
 * Workflow state change
 */
export interface WorkflowStateChange {
    fromState: EditorialWorkflowState;
    toState: EditorialWorkflowState;
    changedBy: string;
    changedAt: Date;
    reason?: string;
}
/**
 * Knowledge gap analysis
 */
export interface KnowledgeGap {
    topic: string;
    practiceArea: PracticeArea;
    identifiedBy: string[];
    searchCount: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    suggestedExperts: string[];
    relatedTopics: string[];
    status: 'identified' | 'assigned' | 'in_progress' | 'addressed';
}
/**
 * Knowledge article creation schema
 */
export declare const KnowledgeArticleCreateSchema: any;
/**
 * Template creation schema
 */
export declare const TemplateCreateSchema: any;
/**
 * Taxonomy creation schema
 */
export declare const TaxonomyCreateSchema: any;
/**
 * Best practice creation schema
 */
export declare const BestPracticeCreateSchema: any;
/**
 * Lesson learned creation schema
 */
export declare const LessonLearnedCreateSchema: any;
/**
 * Article feedback schema
 */
export declare const ArticleFeedbackSchema: any;
/**
 * Knowledge Article Sequelize Model
 */
export declare class KnowledgeArticleModel extends Model<KnowledgeArticle> {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    articleType: KnowledgeArticleType;
    status: KnowledgeArticleStatus;
    visibility: ContentVisibility;
    practiceAreas: PracticeArea[];
    taxonomyIds: string[];
    version: number;
    authorId: string;
    authorName: string;
    contributorIds: string[];
    reviewerId?: string;
    approvedById?: string;
    publishedAt?: Date;
    lastReviewedAt?: Date;
    nextReviewDate?: Date;
    expirationDate?: Date;
    viewCount: number;
    helpfulCount: number;
    notHelpfulCount: number;
    averageRating?: number;
    ratingCount: number;
    searchKeywords: string[];
    relatedArticleIds: string[];
    citations: ArticleCitation[];
    attachments: ArticleAttachment[];
    metadata: ArticleMetadata;
    tags: string[];
    jurisdiction?: string;
    effectiveDate?: Date;
    isTemplate: boolean;
    templateVariables: TemplateVariable[];
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    versions?: ArticleVersionModel[];
    feedbacks?: ArticleFeedbackModel[];
}
/**
 * Template Library Sequelize Model
 */
export declare class TemplateLibraryModel extends Model<TemplateLibrary> {
    id: string;
    name: string;
    description?: string;
    templateType: TemplateType;
    practiceAreas: PracticeArea[];
    content: string;
    version: number;
    variables: TemplateVariable[];
    jurisdiction?: string;
    tags: string[];
    isOfficial: boolean;
    isVerified: boolean;
    usageCount: number;
    lastUsedAt?: Date;
    createdBy: string;
    approvedBy?: string;
    metadata: TemplateMetadata;
    relatedTemplateIds: string[];
    parentTemplateId?: string;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    usages?: TemplateUsageModel[];
}
/**
 * Practice Area Taxonomy Sequelize Model
 */
export declare class PracticeAreaTaxonomyModel extends Model<PracticeAreaTaxonomy> {
    id: string;
    name: string;
    slug: string;
    description?: string;
    nodeType: TaxonomyNodeType;
    practiceArea: PracticeArea;
    parentId?: string;
    level: number;
    path: string;
    sortOrder: number;
    articleCount: number;
    templateCount: number;
    isActive: boolean;
    metadata: TaxonomyMetadata;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    parent?: PracticeAreaTaxonomyModel;
    children?: PracticeAreaTaxonomyModel[];
}
/**
 * Best Practice Sequelize Model
 */
export declare class BestPracticeModel extends Model<BestPractice> {
    id: string;
    title: string;
    description: string;
    practiceAreas: PracticeArea[];
    category: string;
    content: string;
    recommendations: string[];
    warnings: string[];
    examples: PracticeExample[];
    applicability: string[];
    updatedFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'as_needed';
    authorId: string;
    reviewerIds: string[];
    endorsements: number;
    relatedArticleIds: string[];
    tags: string[];
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Lesson Learned Sequelize Model
 */
export declare class LessonLearnedModel extends Model<LessonLearned> {
    id: string;
    title: string;
    summary: string;
    situation: string;
    action: string;
    result: string;
    lesson: string;
    practiceAreas: PracticeArea[];
    caseId?: string;
    caseReference?: string;
    projectId?: string;
    contributorId: string;
    contributorName: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    applicability: 'specific' | 'broad' | 'universal';
    relatedArticleIds: string[];
    tags: string[];
    visibility: ContentVisibility;
    tenantId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Article Version Sequelize Model
 */
export declare class ArticleVersionModel extends Model<ArticleVersion> {
    id: string;
    articleId: string;
    versionNumber: number;
    title: string;
    content: string;
    changeDescription?: string;
    changedBy: string;
    changedAt: Date;
    snapshot: Partial<KnowledgeArticle>;
    article?: KnowledgeArticleModel;
}
/**
 * Article Feedback Sequelize Model
 */
export declare class ArticleFeedbackModel extends Model<ArticleFeedback> {
    id: string;
    articleId: string;
    userId: string;
    rating?: QualityRating;
    isHelpful?: boolean;
    comment?: string;
    feedbackType: 'rating' | 'comment' | 'suggestion' | 'correction';
    status: 'pending' | 'reviewed' | 'incorporated' | 'dismissed';
    reviewedBy?: string;
    reviewedAt?: Date;
    createdAt: Date;
    article?: KnowledgeArticleModel;
}
/**
 * Template Usage Sequelize Model
 */
export declare class TemplateUsageModel extends Model<TemplateUsage> {
    id: string;
    templateId: string;
    userId: string;
    usedAt: Date;
    context?: string;
    documentId?: string;
    feedback?: string;
    template?: TemplateLibraryModel;
}
/**
 * Editorial Workflow Sequelize Model
 */
export declare class EditorialWorkflowModel extends Model<EditorialWorkflow> {
    id: string;
    articleId: string;
    currentState: EditorialWorkflowState;
    assignedTo?: string;
    dueDate?: Date;
    comments: WorkflowComment[];
    history: WorkflowStateChange[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Knowledge Gap Sequelize Model
 */
export declare class KnowledgeGapModel extends Model<KnowledgeGap> {
    id: string;
    topic: string;
    practiceArea: PracticeArea;
    identifiedBy: string[];
    searchCount: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    suggestedExperts: string[];
    relatedTopics: string[];
    status: 'identified' | 'assigned' | 'in_progress' | 'addressed';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Function 1: Create knowledge article
 */
export declare function createKnowledgeArticle(data: z.infer<typeof KnowledgeArticleCreateSchema>, userId: string, userName: string): Promise<KnowledgeArticle>;
/**
 * Function 2: Update knowledge article
 */
export declare function updateKnowledgeArticle(articleId: string, updates: Partial<KnowledgeArticle>, userId: string): Promise<KnowledgeArticle>;
/**
 * Function 3: Publish knowledge article
 */
export declare function publishKnowledgeArticle(articleId: string, userId: string): Promise<void>;
/**
 * Function 4: Archive knowledge article
 */
export declare function archiveKnowledgeArticle(articleId: string): Promise<void>;
/**
 * Function 5: Create article version
 */
export declare function createArticleVersion(articleId: string, currentArticle: KnowledgeArticle, changeDescription: string, userId: string): Promise<ArticleVersion>;
/**
 * Function 6: Search knowledge articles
 */
export declare function searchKnowledgeArticles(filters: KnowledgeSearchFilters): Promise<KnowledgeSearchResults>;
/**
 * Function 7: Generate search facets
 */
export declare function generateSearchFacets(articles: KnowledgeArticle[]): SearchFacets;
/**
 * Function 8: Create template
 */
export declare function createTemplate(data: z.infer<typeof TemplateCreateSchema>, userId: string): Promise<TemplateLibrary>;
/**
 * Function 9: Update template
 */
export declare function updateTemplate(templateId: string, updates: Partial<TemplateLibrary>): Promise<TemplateLibrary>;
/**
 * Function 10: Track template usage
 */
export declare function trackTemplateUsage(templateId: string, userId: string, context?: string, documentId?: string): Promise<TemplateUsage>;
/**
 * Function 11: Get template by ID
 */
export declare function getTemplateById(templateId: string): Promise<TemplateLibrary | null>;
/**
 * Function 12: Search templates
 */
export declare function searchTemplates(filters: {
    query?: string;
    templateTypes?: TemplateType[];
    practiceAreas?: PracticeArea[];
    tags?: string[];
    jurisdiction?: string;
    isOfficial?: boolean;
    isVerified?: boolean;
}): Promise<TemplateLibrary[]>;
/**
 * Function 13: Create practice area taxonomy
 */
export declare function createTaxonomyNode(data: z.infer<typeof TaxonomyCreateSchema>): Promise<PracticeAreaTaxonomy>;
/**
 * Function 14: Get taxonomy hierarchy
 */
export declare function getTaxonomyHierarchy(practiceArea?: PracticeArea, rootId?: string): Promise<PracticeAreaTaxonomy[]>;
/**
 * Function 15: Get taxonomy path
 */
export declare function getTaxonomyPath(taxonomyId: string): Promise<PracticeAreaTaxonomy[]>;
/**
 * Function 16: Create best practice
 */
export declare function createBestPractice(data: z.infer<typeof BestPracticeCreateSchema>, userId: string): Promise<BestPractice>;
/**
 * Function 17: Update best practice
 */
export declare function updateBestPractice(practiceId: string, updates: Partial<BestPractice>): Promise<BestPractice>;
/**
 * Function 18: Endorse best practice
 */
export declare function endorseBestPractice(practiceId: string, userId: string): Promise<void>;
/**
 * Function 19: Create lesson learned
 */
export declare function createLessonLearned(data: z.infer<typeof LessonLearnedCreateSchema>, userId: string, userName: string): Promise<LessonLearned>;
/**
 * Function 20: Search lessons learned
 */
export declare function searchLessonsLearned(filters: {
    query?: string;
    practiceAreas?: PracticeArea[];
    impact?: string[];
    tags?: string[];
    caseId?: string;
}): Promise<LessonLearned[]>;
/**
 * Function 21: Submit article feedback
 */
export declare function submitArticleFeedback(data: z.infer<typeof ArticleFeedbackSchema>, userId: string): Promise<ArticleFeedback>;
/**
 * Function 22: Update article rating
 */
export declare function updateArticleRating(articleId: string, newRating: QualityRating): Promise<void>;
/**
 * Function 23: Increment article view count
 */
export declare function incrementArticleViews(articleId: string): Promise<void>;
/**
 * Function 24: Mark article helpful/not helpful
 */
export declare function markArticleHelpfulness(articleId: string, isHelpful: boolean): Promise<void>;
/**
 * Function 25: Get related articles
 */
export declare function getRelatedArticles(articleId: string, limit?: number): Promise<KnowledgeArticle[]>;
/**
 * Function 26: Auto-tag article
 */
export declare function autoTagArticle(article: KnowledgeArticle): Promise<string[]>;
/**
 * Function 27: Calculate content freshness score
 */
export declare function calculateFreshnessScore(article: KnowledgeArticle): number;
/**
 * Function 28: Calculate quality score
 */
export declare function calculateQualityScore(article: KnowledgeArticle): number;
/**
 * Function 29: Identify content experts
 */
export declare function identifyContentExperts(practiceArea: PracticeArea): Promise<ContributionStats[]>;
/**
 * Function 30: Analyze knowledge gaps
 */
export declare function analyzeKnowledgeGaps(searchQueries: string[], practiceArea?: PracticeArea): Promise<KnowledgeGap[]>;
/**
 * Function 31: Create editorial workflow
 */
export declare function createEditorialWorkflow(articleId: string, assignedTo?: string, dueDate?: Date): Promise<EditorialWorkflow>;
/**
 * Function 32: Transition workflow state
 */
export declare function transitionWorkflowState(workflowId: string, newState: EditorialWorkflowState, userId: string, reason?: string): Promise<void>;
/**
 * Function 33: Add workflow comment
 */
export declare function addWorkflowComment(workflowId: string, userId: string, userName: string, comment: string): Promise<void>;
/**
 * Function 34: Generate article slug
 */
export declare function generateSlug(title: string): string;
/**
 * Function 35: Validate template variables
 */
export declare function validateTemplateVariables(variables: TemplateVariable[], values: Record<string, any>): {
    valid: boolean;
    errors: string[];
};
/**
 * Function 36: Substitute template variables
 */
export declare function substituteTemplateVariables(template: string, values: Record<string, any>): string;
/**
 * Function 37: Format template value
 */
export declare function formatTemplateValue(value: any): string;
/**
 * Knowledge Management Service
 */
export declare class KnowledgeManagementService {
    private articleRepo;
    private templateRepo;
    private taxonomyRepo;
    private bestPracticeRepo;
    private lessonLearnedRepo;
    private configService;
    private readonly logger;
    constructor(articleRepo: typeof KnowledgeArticleModel, templateRepo: typeof TemplateLibraryModel, taxonomyRepo: typeof PracticeAreaTaxonomyModel, bestPracticeRepo: typeof BestPracticeModel, lessonLearnedRepo: typeof LessonLearnedModel, configService: ConfigService);
    /**
     * Create knowledge article
     */
    createArticle(data: z.infer<typeof KnowledgeArticleCreateSchema>, userId: string, userName: string): Promise<KnowledgeArticle>;
    /**
     * Get article by ID
     */
    getArticleById(id: string): Promise<KnowledgeArticle>;
    /**
     * Search articles
     */
    searchArticles(filters: KnowledgeSearchFilters): Promise<KnowledgeSearchResults>;
    /**
     * Publish article
     */
    publishArticle(articleId: string, userId: string): Promise<void>;
    /**
     * Create template
     */
    createTemplate(data: z.infer<typeof TemplateCreateSchema>, userId: string): Promise<TemplateLibrary>;
    /**
     * Search templates
     */
    searchTemplates(filters: any): Promise<TemplateLibrary[]>;
    /**
     * Track template usage
     */
    trackUsage(templateId: string, userId: string, context?: string): Promise<TemplateUsage>;
    /**
     * Create taxonomy node
     */
    createTaxonomy(data: z.infer<typeof TaxonomyCreateSchema>): Promise<PracticeAreaTaxonomy>;
    /**
     * Get taxonomy hierarchy
     */
    getTaxonomyHierarchy(practiceArea?: PracticeArea): Promise<PracticeAreaTaxonomy[]>;
    /**
     * Create best practice
     */
    createBestPractice(data: z.infer<typeof BestPracticeCreateSchema>, userId: string): Promise<BestPractice>;
    /**
     * Create lesson learned
     */
    createLesson(data: z.infer<typeof LessonLearnedCreateSchema>, userId: string, userName: string): Promise<LessonLearned>;
    /**
     * Submit feedback
     */
    submitFeedback(data: z.infer<typeof ArticleFeedbackSchema>, userId: string): Promise<ArticleFeedback>;
    /**
     * Get related articles
     */
    getRelatedArticles(articleId: string, limit?: number): Promise<KnowledgeArticle[]>;
    /**
     * Analyze knowledge gaps
     */
    analyzeGaps(queries: string[], practiceArea?: PracticeArea): Promise<KnowledgeGap[]>;
}
/**
 * Knowledge Article DTO
 */
export declare class KnowledgeArticleDto {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    articleType: KnowledgeArticleType;
    status: KnowledgeArticleStatus;
    visibility: ContentVisibility;
    practiceAreas: PracticeArea[];
    version: number;
    publishedAt?: Date;
    viewCount: number;
    averageRating?: number;
}
/**
 * Create Knowledge Article DTO
 */
export declare class CreateKnowledgeArticleDto {
    title: string;
    summary: string;
    content: string;
    articleType: KnowledgeArticleType;
    visibility: ContentVisibility;
    practiceAreas: PracticeArea[];
    tags?: string[];
    jurisdiction?: string;
}
/**
 * Template Library DTO
 */
export declare class TemplateLibraryDto {
    id: string;
    name: string;
    description?: string;
    templateType: TemplateType;
    practiceAreas: PracticeArea[];
    version: number;
    isOfficial: boolean;
    usageCount: number;
}
/**
 * Create Template DTO
 */
export declare class CreateTemplateDto {
    name: string;
    description?: string;
    templateType: TemplateType;
    practiceAreas: PracticeArea[];
    content: string;
    variables?: TemplateVariable[];
}
/**
 * Practice Area Taxonomy DTO
 */
export declare class PracticeAreaTaxonomyDto {
    id: string;
    name: string;
    nodeType: TaxonomyNodeType;
    practiceArea: PracticeArea;
    parentId?: string;
    level: number;
    articleCount: number;
}
/**
 * Best Practice DTO
 */
export declare class BestPracticeDto {
    id: string;
    title: string;
    description: string;
    practiceAreas: PracticeArea[];
    category: string;
    recommendations: string[];
    endorsements: number;
}
/**
 * Lesson Learned DTO
 */
export declare class LessonLearnedDto {
    id: string;
    title: string;
    summary: string;
    situation: string;
    action: string;
    result: string;
    lesson: string;
    practiceAreas: PracticeArea[];
    impact: string;
}
/**
 * Search Filters DTO
 */
export declare class KnowledgeSearchFiltersDto {
    query?: string;
    articleTypes?: KnowledgeArticleType[];
    practiceAreas?: PracticeArea[];
    tags?: string[];
    minRating?: number;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
    facets?: boolean;
}
/**
 * Knowledge Management Module providers
 */
export declare const knowledgeManagementProviders: ({
    provide: string;
    useValue: typeof KnowledgeArticleModel;
} | {
    provide: string;
    useValue: typeof TemplateLibraryModel;
} | {
    provide: string;
    useValue: typeof PracticeAreaTaxonomyModel;
} | {
    provide: string;
    useValue: typeof BestPracticeModel;
} | {
    provide: string;
    useValue: typeof LessonLearnedModel;
})[];
/**
 * Knowledge Management Module
 */
export declare class KnowledgeManagementModule {
    static forRoot(config?: {
        enableFullTextSearch?: boolean;
        enableVersioning?: boolean;
        maxVersionsPerArticle?: number;
    }): DynamicModule;
}
/**
 * Configuration factory for knowledge management
 */
export declare const knowledgeManagementConfig: any;
//# sourceMappingURL=legal-knowledge-management-kit.d.ts.map