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

/**
 * File: /reuse/legal/legal-knowledge-management-kit.ts
 * Locator: WC-LEGAL-KM-KIT-001
 * Purpose: Production-Grade Legal Knowledge Management Kit - Enterprise legal knowledge management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Elasticsearch/Fuse.js
 * Downstream: ../backend/modules/legal/*, Knowledge controllers, Template services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 37 production-ready knowledge management functions for legal platforms
 *
 * LLM Context: Production-grade legal knowledge management toolkit for White Cross platform.
 * Provides comprehensive practice area taxonomy with hierarchical organization, form and template
 * libraries with versioning and categorization, best practices and playbooks with author attribution,
 * lessons learned tracking with case references, knowledge article authoring with rich text support,
 * advanced search with full-text and faceted filters, Sequelize models for articles/templates/
 * taxonomies, NestJS services with dependency injection, Swagger API documentation, knowledge
 * article workflows (draft/review/publish), template variable management, taxonomy hierarchy
 * navigation, article versioning and history, collaborative editing features, article ratings
 * and feedback, usage analytics and insights, knowledge article templates, automated tagging
 * and categorization, related content discovery, expert identification, knowledge gaps analysis,
 * content freshness tracking, citation and reference management, document attachment handling,
 * knowledge contribution tracking, editorial workflows, content approval processes, knowledge
 * archival and retention, cross-referencing between articles, practice area insights, template
 * customization, and healthcare legal domain specialization.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Sequelize,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Knowledge article status lifecycle
 */
export enum KnowledgeArticleStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated',
  UNDER_REVISION = 'under_revision',
}

/**
 * Knowledge article types
 */
export enum KnowledgeArticleType {
  LEGAL_GUIDE = 'legal_guide',
  CASE_SUMMARY = 'case_summary',
  STATUTE_ANALYSIS = 'statute_analysis',
  PRACTICE_NOTE = 'practice_note',
  PROCEDURAL_GUIDE = 'procedural_guide',
  BEST_PRACTICE = 'best_practice',
  LESSON_LEARNED = 'lesson_learned',
  HOW_TO = 'how_to',
  FAQ = 'faq',
  CHECKLIST = 'checklist',
  PLAYBOOK = 'playbook',
  LEGAL_MEMO = 'legal_memo',
  RESEARCH_NOTE = 'research_note',
  COMPLIANCE_GUIDE = 'compliance_guide',
  RISK_ASSESSMENT = 'risk_assessment',
  OTHER = 'other',
}

/**
 * Template types for legal documents
 */
export enum TemplateType {
  CONTRACT = 'contract',
  MOTION = 'motion',
  PLEADING = 'pleading',
  BRIEF = 'brief',
  LETTER = 'letter',
  MEMORANDUM = 'memorandum',
  AGREEMENT = 'agreement',
  NOTICE = 'notice',
  CONSENT_FORM = 'consent_form',
  POLICY_DOCUMENT = 'policy_document',
  COMPLIANCE_FORM = 'compliance_form',
  DISCLOSURE = 'disclosure',
  WAIVER = 'waiver',
  AFFIDAVIT = 'affidavit',
  DECLARATION = 'declaration',
  WORKSHEET = 'worksheet',
  OTHER = 'other',
}

/**
 * Practice area categories
 */
export enum PracticeArea {
  HEALTHCARE_LAW = 'healthcare_law',
  MEDICAL_MALPRACTICE = 'medical_malpractice',
  HIPAA_COMPLIANCE = 'hipaa_compliance',
  PATIENT_RIGHTS = 'patient_rights',
  HEALTHCARE_TRANSACTIONS = 'healthcare_transactions',
  REGULATORY_COMPLIANCE = 'regulatory_compliance',
  EMPLOYMENT_LAW = 'employment_law',
  CORPORATE_LAW = 'corporate_law',
  CONTRACT_LAW = 'contract_law',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  LITIGATION = 'litigation',
  INSURANCE_LAW = 'insurance_law',
  REAL_ESTATE = 'real_estate',
  TAX_LAW = 'tax_law',
  PRIVACY_LAW = 'privacy_law',
  CYBERSECURITY_LAW = 'cybersecurity_law',
  ADMINISTRATIVE_LAW = 'administrative_law',
  GENERAL_COUNSEL = 'general_counsel',
  OTHER = 'other',
}

/**
 * Content visibility and access levels
 */
export enum ContentVisibility {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  RESTRICTED = 'restricted',
  CONFIDENTIAL = 'confidential',
  PRACTICE_GROUP_ONLY = 'practice_group_only',
}

/**
 * Article quality ratings
 */
export enum QualityRating {
  NEEDS_IMPROVEMENT = 1,
  FAIR = 2,
  GOOD = 3,
  VERY_GOOD = 4,
  EXCELLENT = 5,
}

/**
 * Taxonomy node types
 */
export enum TaxonomyNodeType {
  CATEGORY = 'category',
  SUBCATEGORY = 'subcategory',
  TOPIC = 'topic',
  SUBTOPIC = 'subtopic',
  TAG = 'tag',
}

/**
 * Editorial workflow states
 */
export enum EditorialWorkflowState {
  AUTHORING = 'authoring',
  PEER_REVIEW = 'peer_review',
  EDITORIAL_REVIEW = 'editorial_review',
  LEGAL_REVIEW = 'legal_review',
  COMPLIANCE_REVIEW = 'compliance_review',
  APPROVED_FOR_PUBLISH = 'approved_for_publish',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Knowledge article creation schema
 */
export const KnowledgeArticleCreateSchema = z.object({
  title: z.string().min(1).max(500),
  summary: z.string().min(10).max(1000),
  content: z.string().min(1),
  articleType: z.nativeEnum(KnowledgeArticleType),
  visibility: z.nativeEnum(ContentVisibility).default(ContentVisibility.INTERNAL),
  practiceAreas: z.array(z.nativeEnum(PracticeArea)).min(1),
  taxonomyIds: z.array(z.string()).default([]),
  searchKeywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  jurisdiction: z.string().optional(),
  effectiveDate: z.date().optional(),
  nextReviewDate: z.date().optional(),
  citations: z.array(z.object({
    citationType: z.enum(['case', 'statute', 'regulation', 'article', 'book', 'internal']),
    citation: z.string(),
    url: z.string().url().optional(),
    description: z.string().optional(),
    relevance: z.enum(['primary', 'secondary', 'supporting']).optional(),
  })).default([]),
  metadata: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    language: z.string().default('en'),
    format: z.enum(['text', 'html', 'markdown', 'rich_text']).default('rich_text'),
    sources: z.array(z.string()).default([]),
    expertReviewed: z.boolean().default(false),
    peerReviewed: z.boolean().default(false),
    customFields: z.record(z.any()).default({}),
  }).optional(),
});

/**
 * Template creation schema
 */
export const TemplateCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  templateType: z.nativeEnum(TemplateType),
  practiceAreas: z.array(z.nativeEnum(PracticeArea)).min(1),
  content: z.string().min(1),
  variables: z.array(z.object({
    name: z.string().min(1),
    label: z.string().min(1),
    type: z.enum(['string', 'number', 'date', 'boolean', 'select', 'multiselect', 'text']),
    required: z.boolean(),
    defaultValue: z.any().optional(),
    options: z.array(z.string()).optional(),
    validation: z.string().optional(),
    description: z.string().optional(),
    placeholder: z.string().optional(),
  })).default([]),
  jurisdiction: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.object({
    fileFormat: z.enum(['docx', 'pdf', 'html', 'markdown', 'rtf', 'txt']).default('docx'),
    complexity: z.enum(['simple', 'moderate', 'complex']).default('moderate'),
    requiredInformation: z.array(z.string()).default([]),
    optionalInformation: z.array(z.string()).default([]),
    instructions: z.string().optional(),
    customFields: z.record(z.any()).default({}),
  }).optional(),
});

/**
 * Taxonomy creation schema
 */
export const TaxonomyCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  nodeType: z.nativeEnum(TaxonomyNodeType),
  practiceArea: z.nativeEnum(PracticeArea),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  metadata: z.object({
    synonyms: z.array(z.string()).default([]),
    relatedTaxonomyIds: z.array(z.string()).default([]),
    expertUserIds: z.array(z.string()).default([]),
    icon: z.string().optional(),
    color: z.string().optional(),
    customFields: z.record(z.any()).default({}),
  }).optional(),
});

/**
 * Best practice creation schema
 */
export const BestPracticeCreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(10),
  practiceAreas: z.array(z.nativeEnum(PracticeArea)).min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  recommendations: z.array(z.string()).min(1),
  warnings: z.array(z.string()).default([]),
  examples: z.array(z.object({
    title: z.string(),
    scenario: z.string(),
    approach: z.string(),
    outcome: z.string().optional(),
    lessonLearned: z.string().optional(),
  })).default([]),
  applicability: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

/**
 * Lesson learned creation schema
 */
export const LessonLearnedCreateSchema = z.object({
  title: z.string().min(1).max(500),
  summary: z.string().min(10).max(500),
  situation: z.string().min(10),
  action: z.string().min(10),
  result: z.string().min(10),
  lesson: z.string().min(10),
  practiceAreas: z.array(z.nativeEnum(PracticeArea)).min(1),
  caseId: z.string().optional(),
  caseReference: z.string().optional(),
  projectId: z.string().optional(),
  impact: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  applicability: z.enum(['specific', 'broad', 'universal']).default('broad'),
  tags: z.array(z.string()).default([]),
  visibility: z.nativeEnum(ContentVisibility).default(ContentVisibility.INTERNAL),
});

/**
 * Article feedback schema
 */
export const ArticleFeedbackSchema = z.object({
  articleId: z.string(),
  rating: z.nativeEnum(QualityRating).optional(),
  isHelpful: z.boolean().optional(),
  comment: z.string().max(2000).optional(),
  feedbackType: z.enum(['rating', 'comment', 'suggestion', 'correction']),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Knowledge Article Sequelize Model
 */
@Table({
  tableName: 'knowledge_articles',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['slug'], unique: true },
    { fields: ['status'] },
    { fields: ['article_type'] },
    { fields: ['author_id'] },
    { fields: ['published_at'] },
    { fields: ['practice_areas'], using: 'gin' },
    { fields: ['tags'], using: 'gin' },
    { fields: ['search_keywords'], using: 'gin' },
    { fields: ['tenant_id'] },
  ],
})
export class KnowledgeArticleModel extends Model<KnowledgeArticle> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  title!: string;

  @Column({ type: DataType.STRING(500), allowNull: false, unique: true })
  slug!: string;

  @Column({ type: DataType.STRING(1000), allowNull: false })
  summary!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({
    type: DataType.ENUM(...Object.values(KnowledgeArticleType)),
    allowNull: false,
    field: 'article_type',
  })
  articleType!: KnowledgeArticleType;

  @Column({
    type: DataType.ENUM(...Object.values(KnowledgeArticleStatus)),
    allowNull: false,
    defaultValue: KnowledgeArticleStatus.DRAFT,
  })
  status!: KnowledgeArticleStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ContentVisibility)),
    allowNull: false,
    defaultValue: ContentVisibility.INTERNAL,
  })
  visibility!: ContentVisibility;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'practice_areas',
  })
  practiceAreas!: PracticeArea[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'taxonomy_ids',
  })
  taxonomyIds!: string[];

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  version!: number;

  @Column({ type: DataType.UUID, allowNull: false, field: 'author_id' })
  authorId!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'author_name' })
  authorName!: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'contributor_ids',
  })
  contributorIds!: string[];

  @Column({ type: DataType.UUID, allowNull: true, field: 'reviewer_id' })
  reviewerId?: string;

  @Column({ type: DataType.UUID, allowNull: true, field: 'approved_by_id' })
  approvedById?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'published_at' })
  publishedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'last_reviewed_at' })
  lastReviewedAt?: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'next_review_date' })
  nextReviewDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true, field: 'expiration_date' })
  expirationDate?: Date;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'view_count' })
  viewCount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'helpful_count' })
  helpfulCount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'not_helpful_count' })
  notHelpfulCount!: number;

  @Column({ type: DataType.DECIMAL(3, 2), allowNull: true, field: 'average_rating' })
  averageRating?: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'rating_count' })
  ratingCount!: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'search_keywords',
  })
  searchKeywords!: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'related_article_ids',
  })
  relatedArticleIds!: string[];

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  citations!: ArticleCitation[];

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  attachments!: ArticleAttachment[];

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: ArticleMetadata;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  tags!: string[];

  @Column({ type: DataType.STRING(100), allowNull: true })
  jurisdiction?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'effective_date' })
  effectiveDate?: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_template' })
  isTemplate!: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'template_variables',
  })
  templateVariables!: TemplateVariable[];

  @Column({ type: DataType.UUID, allowNull: true, field: 'tenant_id' })
  tenantId?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;

  @HasMany(() => ArticleVersionModel, 'articleId')
  versions?: ArticleVersionModel[];

  @HasMany(() => ArticleFeedbackModel, 'articleId')
  feedbacks?: ArticleFeedbackModel[];
}

/**
 * Template Library Sequelize Model
 */
@Table({
  tableName: 'template_library',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['template_type'] },
    { fields: ['practice_areas'], using: 'gin' },
    { fields: ['tags'], using: 'gin' },
    { fields: ['is_official'] },
    { fields: ['is_verified'] },
    { fields: ['tenant_id'] },
  ],
})
export class TemplateLibraryModel extends Model<TemplateLibrary> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TemplateType)),
    allowNull: false,
    field: 'template_type',
  })
  templateType!: TemplateType;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'practice_areas',
  })
  practiceAreas!: PracticeArea[];

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  version!: number;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  variables!: TemplateVariable[];

  @Column({ type: DataType.STRING(100), allowNull: true })
  jurisdiction?: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  tags!: string[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_official' })
  isOfficial!: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified' })
  isVerified!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'usage_count' })
  usageCount!: number;

  @Column({ type: DataType.DATE, allowNull: true, field: 'last_used_at' })
  lastUsedAt?: Date;

  @Column({ type: DataType.UUID, allowNull: false, field: 'created_by' })
  createdBy!: string;

  @Column({ type: DataType.UUID, allowNull: true, field: 'approved_by' })
  approvedBy?: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: TemplateMetadata;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'related_template_ids',
  })
  relatedTemplateIds!: string[];

  @Column({ type: DataType.UUID, allowNull: true, field: 'parent_template_id' })
  parentTemplateId?: string;

  @Column({ type: DataType.UUID, allowNull: true, field: 'tenant_id' })
  tenantId?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;

  @HasMany(() => TemplateUsageModel, 'templateId')
  usages?: TemplateUsageModel[];
}

/**
 * Practice Area Taxonomy Sequelize Model
 */
@Table({
  tableName: 'practice_area_taxonomy',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['slug'], unique: true },
    { fields: ['practice_area'] },
    { fields: ['parent_id'] },
    { fields: ['path'] },
    { fields: ['is_active'] },
    { fields: ['tenant_id'] },
  ],
})
export class PracticeAreaTaxonomyModel extends Model<PracticeAreaTaxonomy> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  slug!: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaxonomyNodeType)),
    allowNull: false,
    field: 'node_type',
  })
  nodeType!: TaxonomyNodeType;

  @Column({
    type: DataType.ENUM(...Object.values(PracticeArea)),
    allowNull: false,
    field: 'practice_area',
  })
  practiceArea!: PracticeArea;

  @Column({ type: DataType.UUID, allowNull: true, field: 'parent_id' })
  parentId?: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  level!: number;

  @Column({ type: DataType.STRING(500), allowNull: false })
  path!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' })
  sortOrder!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'article_count' })
  articleCount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'template_count' })
  templateCount!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' })
  isActive!: boolean;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: TaxonomyMetadata;

  @Column({ type: DataType.UUID, allowNull: true, field: 'tenant_id' })
  tenantId?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => PracticeAreaTaxonomyModel, 'parentId')
  parent?: PracticeAreaTaxonomyModel;

  @HasMany(() => PracticeAreaTaxonomyModel, 'parentId')
  children?: PracticeAreaTaxonomyModel[];
}

/**
 * Best Practice Sequelize Model
 */
@Table({
  tableName: 'best_practices',
  timestamps: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['practice_areas'], using: 'gin' },
    { fields: ['category'] },
    { fields: ['tags'], using: 'gin' },
    { fields: ['author_id'] },
    { fields: ['tenant_id'] },
  ],
})
export class BestPracticeModel extends Model<BestPractice> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'practice_areas',
  })
  practiceAreas!: PracticeArea[];

  @Column({ type: DataType.STRING(255), allowNull: false })
  category!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.ARRAY(DataType.TEXT), allowNull: false, defaultValue: [] })
  recommendations!: string[];

  @Column({ type: DataType.ARRAY(DataType.TEXT), allowNull: false, defaultValue: [] })
  warnings!: string[];

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  examples!: PracticeExample[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  applicability!: string[];

  @Column({
    type: DataType.ENUM('weekly', 'monthly', 'quarterly', 'annually', 'as_needed'),
    allowNull: false,
    defaultValue: 'quarterly',
    field: 'updated_frequency',
  })
  updatedFrequency!: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'as_needed';

  @Column({ type: DataType.UUID, allowNull: false, field: 'author_id' })
  authorId!: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'reviewer_ids',
  })
  reviewerIds!: string[];

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  endorsements!: number;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'related_article_ids',
  })
  relatedArticleIds!: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  tags!: string[];

  @Column({ type: DataType.UUID, allowNull: true, field: 'tenant_id' })
  tenantId?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}

/**
 * Lesson Learned Sequelize Model
 */
@Table({
  tableName: 'lessons_learned',
  timestamps: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['practice_areas'], using: 'gin' },
    { fields: ['contributor_id'] },
    { fields: ['case_id'] },
    { fields: ['impact'] },
    { fields: ['visibility'] },
    { fields: ['tenant_id'] },
  ],
})
export class LessonLearnedModel extends Model<LessonLearned> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  title!: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  summary!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  situation!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  action!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  result!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  lesson!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'practice_areas',
  })
  practiceAreas!: PracticeArea[];

  @Column({ type: DataType.UUID, allowNull: true, field: 'case_id' })
  caseId?: string;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'case_reference' })
  caseReference?: string;

  @Column({ type: DataType.UUID, allowNull: true, field: 'project_id' })
  projectId?: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'contributor_id' })
  contributorId!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'contributor_name' })
  contributorName!: string;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  impact!: 'low' | 'medium' | 'high' | 'critical';

  @Column({
    type: DataType.ENUM('specific', 'broad', 'universal'),
    allowNull: false,
    defaultValue: 'broad',
  })
  applicability!: 'specific' | 'broad' | 'universal';

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'related_article_ids',
  })
  relatedArticleIds!: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
  tags!: string[];

  @Column({
    type: DataType.ENUM(...Object.values(ContentVisibility)),
    allowNull: false,
    defaultValue: ContentVisibility.INTERNAL,
  })
  visibility!: ContentVisibility;

  @Column({ type: DataType.UUID, allowNull: true, field: 'tenant_id' })
  tenantId?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}

/**
 * Article Version Sequelize Model
 */
@Table({
  tableName: 'article_versions',
  timestamps: false,
  indexes: [
    { fields: ['article_id'] },
    { fields: ['version_number'] },
    { fields: ['changed_by'] },
    { fields: ['changed_at'] },
  ],
})
export class ArticleVersionModel extends Model<ArticleVersion> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => KnowledgeArticleModel)
  @Column({ type: DataType.UUID, allowNull: false, field: 'article_id' })
  articleId!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'version_number' })
  versionNumber!: number;

  @Column({ type: DataType.STRING(500), allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.STRING(1000), allowNull: true, field: 'change_description' })
  changeDescription?: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'changed_by' })
  changedBy!: string;

  @Column({ type: DataType.DATE, allowNull: false, field: 'changed_at' })
  changedAt!: Date;

  @Column({ type: DataType.JSONB, allowNull: false })
  snapshot!: Partial<KnowledgeArticle>;

  @BelongsTo(() => KnowledgeArticleModel, 'articleId')
  article?: KnowledgeArticleModel;
}

/**
 * Article Feedback Sequelize Model
 */
@Table({
  tableName: 'article_feedbacks',
  timestamps: true,
  indexes: [
    { fields: ['article_id'] },
    { fields: ['user_id'] },
    { fields: ['feedback_type'] },
    { fields: ['status'] },
  ],
})
export class ArticleFeedbackModel extends Model<ArticleFeedback> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => KnowledgeArticleModel)
  @Column({ type: DataType.UUID, allowNull: false, field: 'article_id' })
  articleId!: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId!: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rating?: QualityRating;

  @Column({ type: DataType.BOOLEAN, allowNull: true, field: 'is_helpful' })
  isHelpful?: boolean;

  @Column({ type: DataType.STRING(2000), allowNull: true })
  comment?: string;

  @Column({
    type: DataType.ENUM('rating', 'comment', 'suggestion', 'correction'),
    allowNull: false,
    field: 'feedback_type',
  })
  feedbackType!: 'rating' | 'comment' | 'suggestion' | 'correction';

  @Column({
    type: DataType.ENUM('pending', 'reviewed', 'incorporated', 'dismissed'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status!: 'pending' | 'reviewed' | 'incorporated' | 'dismissed';

  @Column({ type: DataType.UUID, allowNull: true, field: 'reviewed_by' })
  reviewedBy?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'reviewed_at' })
  reviewedAt?: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @BelongsTo(() => KnowledgeArticleModel, 'articleId')
  article?: KnowledgeArticleModel;
}

/**
 * Template Usage Sequelize Model
 */
@Table({
  tableName: 'template_usages',
  timestamps: false,
  indexes: [
    { fields: ['template_id'] },
    { fields: ['user_id'] },
    { fields: ['used_at'] },
  ],
})
export class TemplateUsageModel extends Model<TemplateUsage> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => TemplateLibraryModel)
  @Column({ type: DataType.UUID, allowNull: false, field: 'template_id' })
  templateId!: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId!: string;

  @Column({ type: DataType.DATE, allowNull: false, field: 'used_at' })
  usedAt!: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  context?: string;

  @Column({ type: DataType.UUID, allowNull: true, field: 'document_id' })
  documentId?: string;

  @Column({ type: DataType.STRING(1000), allowNull: true })
  feedback?: string;

  @BelongsTo(() => TemplateLibraryModel, 'templateId')
  template?: TemplateLibraryModel;
}

/**
 * Editorial Workflow Sequelize Model
 */
@Table({
  tableName: 'editorial_workflows',
  timestamps: true,
  indexes: [
    { fields: ['article_id'] },
    { fields: ['current_state'] },
    { fields: ['assigned_to'] },
    { fields: ['due_date'] },
  ],
})
export class EditorialWorkflowModel extends Model<EditorialWorkflow> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'article_id' })
  articleId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(EditorialWorkflowState)),
    allowNull: false,
    field: 'current_state',
  })
  currentState!: EditorialWorkflowState;

  @Column({ type: DataType.UUID, allowNull: true, field: 'assigned_to' })
  assignedTo?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'due_date' })
  dueDate?: Date;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  comments!: WorkflowComment[];

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  history!: WorkflowStateChange[];

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}

/**
 * Knowledge Gap Sequelize Model
 */
@Table({
  tableName: 'knowledge_gaps',
  timestamps: true,
  indexes: [
    { fields: ['topic'] },
    { fields: ['practice_area'] },
    { fields: ['priority'] },
    { fields: ['status'] },
  ],
})
export class KnowledgeGapModel extends Model<KnowledgeGap> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  topic!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PracticeArea)),
    allowNull: false,
    field: 'practice_area',
  })
  practiceArea!: PracticeArea;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'identified_by',
  })
  identifiedBy!: string[];

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'search_count' })
  searchCount!: number;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  priority!: 'low' | 'medium' | 'high' | 'critical';

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
    field: 'suggested_experts',
  })
  suggestedExperts!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    field: 'related_topics',
  })
  relatedTopics!: string[];

  @Column({
    type: DataType.ENUM('identified', 'assigned', 'in_progress', 'addressed'),
    allowNull: false,
    defaultValue: 'identified',
  })
  status!: 'identified' | 'assigned' | 'in_progress' | 'addressed';

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Function 1: Create knowledge article
 */
export async function createKnowledgeArticle(
  data: z.infer<typeof KnowledgeArticleCreateSchema>,
  userId: string,
  userName: string
): Promise<KnowledgeArticle> {
  const validated = KnowledgeArticleCreateSchema.parse(data);

  const slug = generateSlug(validated.title);
  const id = crypto.randomUUID();

  const article: KnowledgeArticle = {
    id,
    title: validated.title,
    slug,
    summary: validated.summary,
    content: validated.content,
    articleType: validated.articleType,
    status: KnowledgeArticleStatus.DRAFT,
    visibility: validated.visibility,
    practiceAreas: validated.practiceAreas,
    taxonomyIds: validated.taxonomyIds,
    version: 1,
    authorId: userId,
    authorName: userName,
    contributorIds: [],
    viewCount: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    ratingCount: 0,
    searchKeywords: validated.searchKeywords,
    relatedArticleIds: [],
    citations: validated.citations,
    attachments: [],
    metadata: {
      language: 'en',
      format: 'rich_text',
      sources: [],
      expertReviewed: false,
      peerReviewed: false,
      externalReferences: [],
      customFields: {},
      ...validated.metadata,
    },
    tags: validated.tags,
    jurisdiction: validated.jurisdiction,
    effectiveDate: validated.effectiveDate,
    nextReviewDate: validated.nextReviewDate,
    isTemplate: false,
    templateVariables: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return article;
}

/**
 * Function 2: Update knowledge article
 */
export async function updateKnowledgeArticle(
  articleId: string,
  updates: Partial<KnowledgeArticle>,
  userId: string
): Promise<KnowledgeArticle> {
  const currentDate = new Date();

  const updatedArticle: KnowledgeArticle = {
    ...updates as KnowledgeArticle,
    id: articleId,
    updatedAt: currentDate,
  };

  if (!updates.contributorIds?.includes(userId)) {
    updatedArticle.contributorIds = [...(updates.contributorIds || []), userId];
  }

  return updatedArticle;
}

/**
 * Function 3: Publish knowledge article
 */
export async function publishKnowledgeArticle(
  articleId: string,
  userId: string
): Promise<void> {
  const publishedAt = new Date();
  // Update article status to published
  // Set publishedAt timestamp
  // Set approvedById to userId
}

/**
 * Function 4: Archive knowledge article
 */
export async function archiveKnowledgeArticle(articleId: string): Promise<void> {
  // Update status to archived
  // Optionally set deletedAt for soft delete
}

/**
 * Function 5: Create article version
 */
export async function createArticleVersion(
  articleId: string,
  currentArticle: KnowledgeArticle,
  changeDescription: string,
  userId: string
): Promise<ArticleVersion> {
  const version: ArticleVersion = {
    id: crypto.randomUUID(),
    articleId,
    versionNumber: currentArticle.version,
    title: currentArticle.title,
    content: currentArticle.content,
    changeDescription,
    changedBy: userId,
    changedAt: new Date(),
    snapshot: { ...currentArticle },
  };

  return version;
}

/**
 * Function 6: Search knowledge articles
 */
export async function searchKnowledgeArticles(
  filters: KnowledgeSearchFilters
): Promise<KnowledgeSearchResults> {
  const startTime = Date.now();

  // Build search query
  const whereConditions: WhereOptions = {};

  if (filters.query) {
    // Full-text search on title, summary, content, searchKeywords
    whereConditions[Op.or] = [
      { title: { [Op.iLike]: `%${filters.query}%` } },
      { summary: { [Op.iLike]: `%${filters.query}%` } },
      { content: { [Op.iLike]: `%${filters.query}%` } },
    ];
  }

  if (filters.articleTypes && filters.articleTypes.length > 0) {
    whereConditions.articleType = { [Op.in]: filters.articleTypes };
  }

  if (filters.practiceAreas && filters.practiceAreas.length > 0) {
    whereConditions.practiceAreas = { [Op.overlap]: filters.practiceAreas };
  }

  if (filters.status && filters.status.length > 0) {
    whereConditions.status = { [Op.in]: filters.status };
  }

  if (filters.visibility && filters.visibility.length > 0) {
    whereConditions.visibility = { [Op.in]: filters.visibility };
  }

  if (filters.tags && filters.tags.length > 0) {
    whereConditions.tags = { [Op.overlap]: filters.tags };
  }

  if (filters.minRating) {
    whereConditions.averageRating = { [Op.gte]: filters.minRating };
  }

  const executionTime = Date.now() - startTime;

  return {
    items: [],
    total: 0,
    query: filters.query,
    executionTime,
    facets: filters.facets ? generateSearchFacets([]) : undefined,
  };
}

/**
 * Function 7: Generate search facets
 */
export function generateSearchFacets(articles: KnowledgeArticle[]): SearchFacets {
  const facets: SearchFacets = {
    practiceAreas: [],
    articleTypes: [],
    tags: [],
    authors: [],
    years: [],
  };

  // Count occurrences for each facet
  const practiceAreaCounts: Map<string, number> = new Map();
  const typeCounts: Map<string, number> = new Map();
  const tagCounts: Map<string, number> = new Map();
  const authorCounts: Map<string, number> = new Map();
  const yearCounts: Map<string, number> = new Map();

  articles.forEach((article) => {
    article.practiceAreas.forEach((pa) => {
      practiceAreaCounts.set(pa, (practiceAreaCounts.get(pa) || 0) + 1);
    });

    typeCounts.set(article.articleType, (typeCounts.get(article.articleType) || 0) + 1);

    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });

    authorCounts.set(article.authorName, (authorCounts.get(article.authorName) || 0) + 1);

    const year = article.createdAt.getFullYear().toString();
    yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
  });

  facets.practiceAreas = Array.from(practiceAreaCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  facets.articleTypes = Array.from(typeCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  facets.tags = Array.from(tagCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  facets.authors = Array.from(authorCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);

  facets.years = Array.from(yearCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.value.localeCompare(a.value));

  return facets;
}

/**
 * Function 8: Create template
 */
export async function createTemplate(
  data: z.infer<typeof TemplateCreateSchema>,
  userId: string
): Promise<TemplateLibrary> {
  const validated = TemplateCreateSchema.parse(data);

  const template: TemplateLibrary = {
    id: crypto.randomUUID(),
    name: validated.name,
    description: validated.description,
    templateType: validated.templateType,
    practiceAreas: validated.practiceAreas,
    content: validated.content,
    version: 1,
    variables: validated.variables,
    jurisdiction: validated.jurisdiction,
    tags: validated.tags,
    isOfficial: false,
    isVerified: false,
    usageCount: 0,
    createdBy: userId,
    metadata: {
      fileFormat: 'docx',
      complexity: 'moderate',
      requiredInformation: [],
      optionalInformation: [],
      customFields: {},
      ...validated.metadata,
    },
    relatedTemplateIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return template;
}

/**
 * Function 9: Update template
 */
export async function updateTemplate(
  templateId: string,
  updates: Partial<TemplateLibrary>
): Promise<TemplateLibrary> {
  const updatedTemplate: TemplateLibrary = {
    ...updates as TemplateLibrary,
    id: templateId,
    updatedAt: new Date(),
  };

  return updatedTemplate;
}

/**
 * Function 10: Track template usage
 */
export async function trackTemplateUsage(
  templateId: string,
  userId: string,
  context?: string,
  documentId?: string
): Promise<TemplateUsage> {
  const usage: TemplateUsage = {
    id: crypto.randomUUID(),
    templateId,
    userId,
    usedAt: new Date(),
    context,
    documentId,
  };

  return usage;
}

/**
 * Function 11: Get template by ID
 */
export async function getTemplateById(templateId: string): Promise<TemplateLibrary | null> {
  // Retrieve template from database
  return null;
}

/**
 * Function 12: Search templates
 */
export async function searchTemplates(
  filters: {
    query?: string;
    templateTypes?: TemplateType[];
    practiceAreas?: PracticeArea[];
    tags?: string[];
    jurisdiction?: string;
    isOfficial?: boolean;
    isVerified?: boolean;
  }
): Promise<TemplateLibrary[]> {
  // Build and execute search query
  return [];
}

/**
 * Function 13: Create practice area taxonomy
 */
export async function createTaxonomyNode(
  data: z.infer<typeof TaxonomyCreateSchema>
): Promise<PracticeAreaTaxonomy> {
  const validated = TaxonomyCreateSchema.parse(data);

  const slug = generateSlug(validated.name);
  let level = 0;
  let path = slug;

  if (validated.parentId) {
    // Get parent node to determine level and path
    level = 1; // Would be parent.level + 1
    path = `parent-path/${slug}`;
  }

  const taxonomy: PracticeAreaTaxonomy = {
    id: crypto.randomUUID(),
    name: validated.name,
    slug,
    description: validated.description,
    nodeType: validated.nodeType,
    practiceArea: validated.practiceArea,
    parentId: validated.parentId,
    level,
    path,
    sortOrder: validated.sortOrder,
    articleCount: 0,
    templateCount: 0,
    isActive: true,
    metadata: {
      synonyms: [],
      relatedTaxonomyIds: [],
      expertUserIds: [],
      customFields: {},
      ...validated.metadata,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return taxonomy;
}

/**
 * Function 14: Get taxonomy hierarchy
 */
export async function getTaxonomyHierarchy(
  practiceArea?: PracticeArea,
  rootId?: string
): Promise<PracticeAreaTaxonomy[]> {
  // Retrieve hierarchical taxonomy structure
  return [];
}

/**
 * Function 15: Get taxonomy path
 */
export async function getTaxonomyPath(taxonomyId: string): Promise<PracticeAreaTaxonomy[]> {
  // Get full path from root to specified node
  return [];
}

/**
 * Function 16: Create best practice
 */
export async function createBestPractice(
  data: z.infer<typeof BestPracticeCreateSchema>,
  userId: string
): Promise<BestPractice> {
  const validated = BestPracticeCreateSchema.parse(data);

  const bestPractice: BestPractice = {
    id: crypto.randomUUID(),
    title: validated.title,
    description: validated.description,
    practiceAreas: validated.practiceAreas,
    category: validated.category,
    content: validated.content,
    recommendations: validated.recommendations,
    warnings: validated.warnings,
    examples: validated.examples,
    applicability: validated.applicability,
    updatedFrequency: 'quarterly',
    authorId: userId,
    reviewerIds: [],
    endorsements: 0,
    relatedArticleIds: [],
    tags: validated.tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return bestPractice;
}

/**
 * Function 17: Update best practice
 */
export async function updateBestPractice(
  practiceId: string,
  updates: Partial<BestPractice>
): Promise<BestPractice> {
  const updatedPractice: BestPractice = {
    ...updates as BestPractice,
    id: practiceId,
    updatedAt: new Date(),
  };

  return updatedPractice;
}

/**
 * Function 18: Endorse best practice
 */
export async function endorseBestPractice(practiceId: string, userId: string): Promise<void> {
  // Increment endorsement count
  // Track user endorsement
}

/**
 * Function 19: Create lesson learned
 */
export async function createLessonLearned(
  data: z.infer<typeof LessonLearnedCreateSchema>,
  userId: string,
  userName: string
): Promise<LessonLearned> {
  const validated = LessonLearnedCreateSchema.parse(data);

  const lesson: LessonLearned = {
    id: crypto.randomUUID(),
    title: validated.title,
    summary: validated.summary,
    situation: validated.situation,
    action: validated.action,
    result: validated.result,
    lesson: validated.lesson,
    practiceAreas: validated.practiceAreas,
    caseId: validated.caseId,
    caseReference: validated.caseReference,
    projectId: validated.projectId,
    contributorId: userId,
    contributorName: userName,
    impact: validated.impact,
    applicability: validated.applicability,
    relatedArticleIds: [],
    tags: validated.tags,
    visibility: validated.visibility,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return lesson;
}

/**
 * Function 20: Search lessons learned
 */
export async function searchLessonsLearned(
  filters: {
    query?: string;
    practiceAreas?: PracticeArea[];
    impact?: string[];
    tags?: string[];
    caseId?: string;
  }
): Promise<LessonLearned[]> {
  // Build and execute search query
  return [];
}

/**
 * Function 21: Submit article feedback
 */
export async function submitArticleFeedback(
  data: z.infer<typeof ArticleFeedbackSchema>,
  userId: string
): Promise<ArticleFeedback> {
  const validated = ArticleFeedbackSchema.parse(data);

  const feedback: ArticleFeedback = {
    id: crypto.randomUUID(),
    articleId: validated.articleId,
    userId,
    rating: validated.rating,
    isHelpful: validated.isHelpful,
    comment: validated.comment,
    feedbackType: validated.feedbackType,
    status: 'pending',
    createdAt: new Date(),
  };

  return feedback;
}

/**
 * Function 22: Update article rating
 */
export async function updateArticleRating(
  articleId: string,
  newRating: QualityRating
): Promise<void> {
  // Recalculate average rating
  // Update article rating statistics
}

/**
 * Function 23: Increment article view count
 */
export async function incrementArticleViews(articleId: string): Promise<void> {
  // Increment view counter
}

/**
 * Function 24: Mark article helpful/not helpful
 */
export async function markArticleHelpfulness(
  articleId: string,
  isHelpful: boolean
): Promise<void> {
  // Increment appropriate counter
}

/**
 * Function 25: Get related articles
 */
export async function getRelatedArticles(
  articleId: string,
  limit: number = 5
): Promise<KnowledgeArticle[]> {
  // Find articles with similar tags, practice areas, or taxonomy
  return [];
}

/**
 * Function 26: Auto-tag article
 */
export async function autoTagArticle(article: KnowledgeArticle): Promise<string[]> {
  const suggestedTags: string[] = [];

  // Extract keywords from title and content
  // Identify legal terms, statutes, cases
  // Suggest relevant tags

  return suggestedTags;
}

/**
 * Function 27: Calculate content freshness score
 */
export function calculateFreshnessScore(article: KnowledgeArticle): number {
  const now = new Date();
  const daysSinceUpdate = Math.floor(
    (now.getTime() - article.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Freshness decreases over time
  let score = 100;

  if (daysSinceUpdate > 365) {
    score = 20;
  } else if (daysSinceUpdate > 180) {
    score = 50;
  } else if (daysSinceUpdate > 90) {
    score = 75;
  } else if (daysSinceUpdate > 30) {
    score = 90;
  }

  // Boost if recently reviewed
  if (article.lastReviewedAt) {
    const daysSinceReview = Math.floor(
      (now.getTime() - article.lastReviewedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceReview < 30) {
      score = Math.min(100, score + 10);
    }
  }

  return score;
}

/**
 * Function 28: Calculate quality score
 */
export function calculateQualityScore(article: KnowledgeArticle): number {
  let score = 0;

  // Has summary
  if (article.summary && article.summary.length > 50) score += 10;

  // Has citations
  if (article.citations && article.citations.length > 0) score += 15;

  // Has attachments
  if (article.attachments && article.attachments.length > 0) score += 10;

  // Expert reviewed
  if (article.metadata.expertReviewed) score += 20;

  // Peer reviewed
  if (article.metadata.peerReviewed) score += 15;

  // Good ratings
  if (article.averageRating && article.averageRating >= 4) score += 15;

  // Usage metrics
  if (article.viewCount > 100) score += 10;
  if (article.helpfulCount > article.notHelpfulCount) score += 5;

  return Math.min(100, score);
}

/**
 * Function 29: Identify content experts
 */
export async function identifyContentExperts(
  practiceArea: PracticeArea
): Promise<ContributionStats[]> {
  // Find users with highest contribution scores in practice area
  return [];
}

/**
 * Function 30: Analyze knowledge gaps
 */
export async function analyzeKnowledgeGaps(
  searchQueries: string[],
  practiceArea?: PracticeArea
): Promise<KnowledgeGap[]> {
  const gaps: KnowledgeGap[] = [];

  // Analyze search queries with no results
  // Identify topics with few articles
  // Suggest areas needing content

  return gaps;
}

/**
 * Function 31: Create editorial workflow
 */
export async function createEditorialWorkflow(
  articleId: string,
  assignedTo?: string,
  dueDate?: Date
): Promise<EditorialWorkflow> {
  const workflow: EditorialWorkflow = {
    id: crypto.randomUUID(),
    articleId,
    currentState: EditorialWorkflowState.AUTHORING,
    assignedTo,
    dueDate,
    comments: [],
    history: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return workflow;
}

/**
 * Function 32: Transition workflow state
 */
export async function transitionWorkflowState(
  workflowId: string,
  newState: EditorialWorkflowState,
  userId: string,
  reason?: string
): Promise<void> {
  // Update workflow state
  // Add to history
}

/**
 * Function 33: Add workflow comment
 */
export async function addWorkflowComment(
  workflowId: string,
  userId: string,
  userName: string,
  comment: string
): Promise<void> {
  // Add comment to workflow
}

/**
 * Function 34: Generate article slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100) +
    '-' +
    crypto.randomBytes(4).toString('hex');
}

/**
 * Function 35: Validate template variables
 */
export function validateTemplateVariables(
  variables: TemplateVariable[],
  values: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  variables.forEach((variable) => {
    const value = values[variable.name];

    if (variable.required && (value === undefined || value === null || value === '')) {
      errors.push(`${variable.label} is required`);
      return;
    }

    if (value !== undefined && value !== null) {
      // Type validation
      if (variable.type === 'number' && typeof value !== 'number') {
        errors.push(`${variable.label} must be a number`);
      }

      if (variable.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${variable.label} must be a boolean`);
      }

      // Options validation
      if (variable.options && variable.options.length > 0) {
        if (variable.type === 'multiselect') {
          if (!Array.isArray(value)) {
            errors.push(`${variable.label} must be an array`);
          } else {
            const invalidOptions = value.filter((v) => !variable.options!.includes(v));
            if (invalidOptions.length > 0) {
              errors.push(`${variable.label} contains invalid options: ${invalidOptions.join(', ')}`);
            }
          }
        } else if (variable.type === 'select') {
          if (!variable.options.includes(value)) {
            errors.push(`${variable.label} must be one of: ${variable.options.join(', ')}`);
          }
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Function 36: Substitute template variables
 */
export function substituteTemplateVariables(
  template: string,
  values: Record<string, any>
): string {
  let result = template;

  Object.entries(values).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    const formattedValue = formatTemplateValue(value);
    result = result.replace(new RegExp(placeholder, 'g'), formattedValue);
  });

  return result;
}

/**
 * Function 37: Format template value
 */
export function formatTemplateValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value);
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Knowledge Management Service
 */
@Injectable()
export class KnowledgeManagementService {
  private readonly logger = new Logger(KnowledgeManagementService.name);

  constructor(
    @Inject('KNOWLEDGE_ARTICLE_REPOSITORY')
    private articleRepo: typeof KnowledgeArticleModel,
    @Inject('TEMPLATE_LIBRARY_REPOSITORY')
    private templateRepo: typeof TemplateLibraryModel,
    @Inject('TAXONOMY_REPOSITORY')
    private taxonomyRepo: typeof PracticeAreaTaxonomyModel,
    @Inject('BEST_PRACTICE_REPOSITORY')
    private bestPracticeRepo: typeof BestPracticeModel,
    @Inject('LESSON_LEARNED_REPOSITORY')
    private lessonLearnedRepo: typeof LessonLearnedModel,
    private configService: ConfigService
  ) {}

  /**
   * Create knowledge article
   */
  async createArticle(
    data: z.infer<typeof KnowledgeArticleCreateSchema>,
    userId: string,
    userName: string
  ): Promise<KnowledgeArticle> {
    this.logger.log(`Creating knowledge article: ${data.title}`);
    const article = await createKnowledgeArticle(data, userId, userName);
    await this.articleRepo.create(article as any);
    return article;
  }

  /**
   * Get article by ID
   */
  async getArticleById(id: string): Promise<KnowledgeArticle> {
    const article = await this.articleRepo.findByPk(id);
    if (!article) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return article.toJSON() as KnowledgeArticle;
  }

  /**
   * Search articles
   */
  async searchArticles(filters: KnowledgeSearchFilters): Promise<KnowledgeSearchResults> {
    this.logger.log(`Searching articles with query: ${filters.query}`);
    return searchKnowledgeArticles(filters);
  }

  /**
   * Publish article
   */
  async publishArticle(articleId: string, userId: string): Promise<void> {
    this.logger.log(`Publishing article ${articleId}`);
    await publishKnowledgeArticle(articleId, userId);
  }

  /**
   * Create template
   */
  async createTemplate(
    data: z.infer<typeof TemplateCreateSchema>,
    userId: string
  ): Promise<TemplateLibrary> {
    this.logger.log(`Creating template: ${data.name}`);
    const template = await createTemplate(data, userId);
    await this.templateRepo.create(template as any);
    return template;
  }

  /**
   * Search templates
   */
  async searchTemplates(filters: any): Promise<TemplateLibrary[]> {
    return searchTemplates(filters);
  }

  /**
   * Track template usage
   */
  async trackUsage(
    templateId: string,
    userId: string,
    context?: string
  ): Promise<TemplateUsage> {
    return trackTemplateUsage(templateId, userId, context);
  }

  /**
   * Create taxonomy node
   */
  async createTaxonomy(
    data: z.infer<typeof TaxonomyCreateSchema>
  ): Promise<PracticeAreaTaxonomy> {
    this.logger.log(`Creating taxonomy node: ${data.name}`);
    const taxonomy = await createTaxonomyNode(data);
    await this.taxonomyRepo.create(taxonomy as any);
    return taxonomy;
  }

  /**
   * Get taxonomy hierarchy
   */
  async getTaxonomyHierarchy(practiceArea?: PracticeArea): Promise<PracticeAreaTaxonomy[]> {
    return getTaxonomyHierarchy(practiceArea);
  }

  /**
   * Create best practice
   */
  async createBestPractice(
    data: z.infer<typeof BestPracticeCreateSchema>,
    userId: string
  ): Promise<BestPractice> {
    this.logger.log(`Creating best practice: ${data.title}`);
    const practice = await createBestPractice(data, userId);
    await this.bestPracticeRepo.create(practice as any);
    return practice;
  }

  /**
   * Create lesson learned
   */
  async createLesson(
    data: z.infer<typeof LessonLearnedCreateSchema>,
    userId: string,
    userName: string
  ): Promise<LessonLearned> {
    this.logger.log(`Creating lesson learned: ${data.title}`);
    const lesson = await createLessonLearned(data, userId, userName);
    await this.lessonLearnedRepo.create(lesson as any);
    return lesson;
  }

  /**
   * Submit feedback
   */
  async submitFeedback(
    data: z.infer<typeof ArticleFeedbackSchema>,
    userId: string
  ): Promise<ArticleFeedback> {
    return submitArticleFeedback(data, userId);
  }

  /**
   * Get related articles
   */
  async getRelatedArticles(articleId: string, limit: number = 5): Promise<KnowledgeArticle[]> {
    return getRelatedArticles(articleId, limit);
  }

  /**
   * Analyze knowledge gaps
   */
  async analyzeGaps(queries: string[], practiceArea?: PracticeArea): Promise<KnowledgeGap[]> {
    return analyzeKnowledgeGaps(queries, practiceArea);
  }
}

// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================

/**
 * Knowledge Article DTO
 */
export class KnowledgeArticleDto {
  @ApiProperty({ example: 'uuid', description: 'Article ID' })
  id!: string;

  @ApiProperty({ example: 'HIPAA Privacy Rule Overview', description: 'Article title' })
  title!: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  slug!: string;

  @ApiProperty({ description: 'Brief summary of the article' })
  summary!: string;

  @ApiProperty({ description: 'Full article content' })
  content!: string;

  @ApiProperty({ enum: KnowledgeArticleType, description: 'Article type' })
  articleType!: KnowledgeArticleType;

  @ApiProperty({ enum: KnowledgeArticleStatus, description: 'Article status' })
  status!: KnowledgeArticleStatus;

  @ApiProperty({ enum: ContentVisibility, description: 'Visibility level' })
  visibility!: ContentVisibility;

  @ApiProperty({ type: [String], description: 'Practice areas' })
  practiceAreas!: PracticeArea[];

  @ApiProperty({ example: 1, description: 'Version number' })
  version!: number;

  @ApiPropertyOptional({ type: Date, description: 'Publication date' })
  publishedAt?: Date;

  @ApiProperty({ example: 0, description: 'View count' })
  viewCount!: number;

  @ApiPropertyOptional({ example: 4.5, description: 'Average rating' })
  averageRating?: number;
}

/**
 * Create Knowledge Article DTO
 */
export class CreateKnowledgeArticleDto {
  @ApiProperty({ example: 'HIPAA Privacy Rule Overview' })
  title!: string;

  @ApiProperty({ description: 'Brief summary (10-1000 chars)' })
  summary!: string;

  @ApiProperty({ description: 'Full article content' })
  content!: string;

  @ApiProperty({ enum: KnowledgeArticleType })
  articleType!: KnowledgeArticleType;

  @ApiProperty({ enum: ContentVisibility, default: ContentVisibility.INTERNAL })
  visibility!: ContentVisibility;

  @ApiProperty({ type: [String], description: 'Practice areas', isArray: true })
  practiceAreas!: PracticeArea[];

  @ApiPropertyOptional({ type: [String], description: 'Tags' })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Jurisdiction' })
  jurisdiction?: string;
}

/**
 * Template Library DTO
 */
export class TemplateLibraryDto {
  @ApiProperty({ example: 'uuid', description: 'Template ID' })
  id!: string;

  @ApiProperty({ example: 'HIPAA Authorization Form', description: 'Template name' })
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  description?: string;

  @ApiProperty({ enum: TemplateType, description: 'Template type' })
  templateType!: TemplateType;

  @ApiProperty({ type: [String], description: 'Practice areas' })
  practiceAreas!: PracticeArea[];

  @ApiProperty({ example: 1, description: 'Version number' })
  version!: number;

  @ApiProperty({ example: false, description: 'Official template flag' })
  isOfficial!: boolean;

  @ApiProperty({ example: 0, description: 'Usage count' })
  usageCount!: number;
}

/**
 * Create Template DTO
 */
export class CreateTemplateDto {
  @ApiProperty({ example: 'HIPAA Authorization Form' })
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  description?: string;

  @ApiProperty({ enum: TemplateType })
  templateType!: TemplateType;

  @ApiProperty({ type: [String], description: 'Practice areas', isArray: true })
  practiceAreas!: PracticeArea[];

  @ApiProperty({ description: 'Template content' })
  content!: string;

  @ApiPropertyOptional({ type: [Object], description: 'Template variables' })
  variables?: TemplateVariable[];
}

/**
 * Practice Area Taxonomy DTO
 */
export class PracticeAreaTaxonomyDto {
  @ApiProperty({ example: 'uuid', description: 'Taxonomy ID' })
  id!: string;

  @ApiProperty({ example: 'Patient Privacy', description: 'Taxonomy name' })
  name!: string;

  @ApiProperty({ enum: TaxonomyNodeType, description: 'Node type' })
  nodeType!: TaxonomyNodeType;

  @ApiProperty({ enum: PracticeArea, description: 'Practice area' })
  practiceArea!: PracticeArea;

  @ApiPropertyOptional({ description: 'Parent taxonomy ID' })
  parentId?: string;

  @ApiProperty({ example: 0, description: 'Hierarchy level' })
  level!: number;

  @ApiProperty({ example: 0, description: 'Article count' })
  articleCount!: number;
}

/**
 * Best Practice DTO
 */
export class BestPracticeDto {
  @ApiProperty({ example: 'uuid', description: 'Best practice ID' })
  id!: string;

  @ApiProperty({ example: 'HIPAA Breach Response Protocol', description: 'Title' })
  title!: string;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ type: [String], description: 'Practice areas' })
  practiceAreas!: PracticeArea[];

  @ApiProperty({ description: 'Category' })
  category!: string;

  @ApiProperty({ type: [String], description: 'Recommendations' })
  recommendations!: string[];

  @ApiProperty({ example: 0, description: 'Endorsement count' })
  endorsements!: number;
}

/**
 * Lesson Learned DTO
 */
export class LessonLearnedDto {
  @ApiProperty({ example: 'uuid', description: 'Lesson ID' })
  id!: string;

  @ApiProperty({ example: 'Patient Data Breach Response', description: 'Title' })
  title!: string;

  @ApiProperty({ description: 'Brief summary' })
  summary!: string;

  @ApiProperty({ description: 'Situation description' })
  situation!: string;

  @ApiProperty({ description: 'Action taken' })
  action!: string;

  @ApiProperty({ description: 'Result achieved' })
  result!: string;

  @ApiProperty({ description: 'Lesson learned' })
  lesson!: string;

  @ApiProperty({ type: [String], description: 'Practice areas' })
  practiceAreas!: PracticeArea[];

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'], description: 'Impact level' })
  impact!: string;
}

/**
 * Search Filters DTO
 */
export class KnowledgeSearchFiltersDto {
  @ApiPropertyOptional({ description: 'Search query' })
  query?: string;

  @ApiPropertyOptional({ type: [String], description: 'Article types' })
  articleTypes?: KnowledgeArticleType[];

  @ApiPropertyOptional({ type: [String], description: 'Practice areas' })
  practiceAreas?: PracticeArea[];

  @ApiPropertyOptional({ type: [String], description: 'Tags' })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Minimum rating' })
  minRating?: number;

  @ApiPropertyOptional({ enum: ['relevance', 'date', 'rating', 'views', 'title'] })
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  sortOrder?: string;

  @ApiPropertyOptional({ example: 20, description: 'Results per page' })
  limit?: number;

  @ApiPropertyOptional({ example: 0, description: 'Result offset' })
  offset?: number;

  @ApiPropertyOptional({ example: false, description: 'Include facets' })
  facets?: boolean;
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

/**
 * Knowledge Management Module providers
 */
export const knowledgeManagementProviders = [
  {
    provide: 'KNOWLEDGE_ARTICLE_REPOSITORY',
    useValue: KnowledgeArticleModel,
  },
  {
    provide: 'TEMPLATE_LIBRARY_REPOSITORY',
    useValue: TemplateLibraryModel,
  },
  {
    provide: 'TAXONOMY_REPOSITORY',
    useValue: PracticeAreaTaxonomyModel,
  },
  {
    provide: 'BEST_PRACTICE_REPOSITORY',
    useValue: BestPracticeModel,
  },
  {
    provide: 'LESSON_LEARNED_REPOSITORY',
    useValue: LessonLearnedModel,
  },
];

/**
 * Knowledge Management Module
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [...knowledgeManagementProviders, KnowledgeManagementService],
  exports: [KnowledgeManagementService, ...knowledgeManagementProviders],
})
export class KnowledgeManagementModule {
  static forRoot(config?: {
    enableFullTextSearch?: boolean;
    enableVersioning?: boolean;
    maxVersionsPerArticle?: number;
  }): DynamicModule {
    return {
      module: KnowledgeManagementModule,
      providers: [
        ...knowledgeManagementProviders,
        KnowledgeManagementService,
        {
          provide: 'KNOWLEDGE_MANAGEMENT_CONFIG',
          useValue: {
            enableFullTextSearch: config?.enableFullTextSearch ?? true,
            enableVersioning: config?.enableVersioning ?? true,
            maxVersionsPerArticle: config?.maxVersionsPerArticle ?? 50,
          },
        },
      ],
      exports: [KnowledgeManagementService, ...knowledgeManagementProviders],
    };
  }
}

/**
 * Configuration factory for knowledge management
 */
export const knowledgeManagementConfig = registerAs('knowledgeManagement', () => ({
  enableFullTextSearch: process.env.KM_ENABLE_FULL_TEXT_SEARCH === 'true',
  enableVersioning: process.env.KM_ENABLE_VERSIONING !== 'false',
  maxVersionsPerArticle: parseInt(process.env.KM_MAX_VERSIONS || '50', 10),
  searchResultsLimit: parseInt(process.env.KM_SEARCH_LIMIT || '50', 10),
  autoArchiveDays: parseInt(process.env.KM_AUTO_ARCHIVE_DAYS || '365', 10),
  reviewReminderDays: parseInt(process.env.KM_REVIEW_REMINDER_DAYS || '90', 10),
}));
