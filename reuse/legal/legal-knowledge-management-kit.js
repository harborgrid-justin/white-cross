"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeManagementConfig = exports.KnowledgeManagementModule = exports.knowledgeManagementProviders = exports.KnowledgeSearchFiltersDto = exports.LessonLearnedDto = exports.BestPracticeDto = exports.PracticeAreaTaxonomyDto = exports.CreateTemplateDto = exports.TemplateLibraryDto = exports.CreateKnowledgeArticleDto = exports.KnowledgeArticleDto = exports.KnowledgeManagementService = exports.KnowledgeGapModel = exports.EditorialWorkflowModel = exports.TemplateUsageModel = exports.ArticleFeedbackModel = exports.ArticleVersionModel = exports.LessonLearnedModel = exports.BestPracticeModel = exports.PracticeAreaTaxonomyModel = exports.TemplateLibraryModel = exports.KnowledgeArticleModel = exports.ArticleFeedbackSchema = exports.LessonLearnedCreateSchema = exports.BestPracticeCreateSchema = exports.TaxonomyCreateSchema = exports.TemplateCreateSchema = exports.KnowledgeArticleCreateSchema = exports.EditorialWorkflowState = exports.TaxonomyNodeType = exports.QualityRating = exports.ContentVisibility = exports.PracticeArea = exports.TemplateType = exports.KnowledgeArticleType = exports.KnowledgeArticleStatus = void 0;
exports.createKnowledgeArticle = createKnowledgeArticle;
exports.updateKnowledgeArticle = updateKnowledgeArticle;
exports.publishKnowledgeArticle = publishKnowledgeArticle;
exports.archiveKnowledgeArticle = archiveKnowledgeArticle;
exports.createArticleVersion = createArticleVersion;
exports.searchKnowledgeArticles = searchKnowledgeArticles;
exports.generateSearchFacets = generateSearchFacets;
exports.createTemplate = createTemplate;
exports.updateTemplate = updateTemplate;
exports.trackTemplateUsage = trackTemplateUsage;
exports.getTemplateById = getTemplateById;
exports.searchTemplates = searchTemplates;
exports.createTaxonomyNode = createTaxonomyNode;
exports.getTaxonomyHierarchy = getTaxonomyHierarchy;
exports.getTaxonomyPath = getTaxonomyPath;
exports.createBestPractice = createBestPractice;
exports.updateBestPractice = updateBestPractice;
exports.endorseBestPractice = endorseBestPractice;
exports.createLessonLearned = createLessonLearned;
exports.searchLessonsLearned = searchLessonsLearned;
exports.submitArticleFeedback = submitArticleFeedback;
exports.updateArticleRating = updateArticleRating;
exports.incrementArticleViews = incrementArticleViews;
exports.markArticleHelpfulness = markArticleHelpfulness;
exports.getRelatedArticles = getRelatedArticles;
exports.autoTagArticle = autoTagArticle;
exports.calculateFreshnessScore = calculateFreshnessScore;
exports.calculateQualityScore = calculateQualityScore;
exports.identifyContentExperts = identifyContentExperts;
exports.analyzeKnowledgeGaps = analyzeKnowledgeGaps;
exports.createEditorialWorkflow = createEditorialWorkflow;
exports.transitionWorkflowState = transitionWorkflowState;
exports.addWorkflowComment = addWorkflowComment;
exports.generateSlug = generateSlug;
exports.validateTemplateVariables = validateTemplateVariables;
exports.substituteTemplateVariables = substituteTemplateVariables;
exports.formatTemplateValue = formatTemplateValue;
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
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Knowledge article status lifecycle
 */
var KnowledgeArticleStatus;
(function (KnowledgeArticleStatus) {
    KnowledgeArticleStatus["DRAFT"] = "draft";
    KnowledgeArticleStatus["IN_REVIEW"] = "in_review";
    KnowledgeArticleStatus["APPROVED"] = "approved";
    KnowledgeArticleStatus["PUBLISHED"] = "published";
    KnowledgeArticleStatus["ARCHIVED"] = "archived";
    KnowledgeArticleStatus["DEPRECATED"] = "deprecated";
    KnowledgeArticleStatus["UNDER_REVISION"] = "under_revision";
})(KnowledgeArticleStatus || (exports.KnowledgeArticleStatus = KnowledgeArticleStatus = {}));
/**
 * Knowledge article types
 */
var KnowledgeArticleType;
(function (KnowledgeArticleType) {
    KnowledgeArticleType["LEGAL_GUIDE"] = "legal_guide";
    KnowledgeArticleType["CASE_SUMMARY"] = "case_summary";
    KnowledgeArticleType["STATUTE_ANALYSIS"] = "statute_analysis";
    KnowledgeArticleType["PRACTICE_NOTE"] = "practice_note";
    KnowledgeArticleType["PROCEDURAL_GUIDE"] = "procedural_guide";
    KnowledgeArticleType["BEST_PRACTICE"] = "best_practice";
    KnowledgeArticleType["LESSON_LEARNED"] = "lesson_learned";
    KnowledgeArticleType["HOW_TO"] = "how_to";
    KnowledgeArticleType["FAQ"] = "faq";
    KnowledgeArticleType["CHECKLIST"] = "checklist";
    KnowledgeArticleType["PLAYBOOK"] = "playbook";
    KnowledgeArticleType["LEGAL_MEMO"] = "legal_memo";
    KnowledgeArticleType["RESEARCH_NOTE"] = "research_note";
    KnowledgeArticleType["COMPLIANCE_GUIDE"] = "compliance_guide";
    KnowledgeArticleType["RISK_ASSESSMENT"] = "risk_assessment";
    KnowledgeArticleType["OTHER"] = "other";
})(KnowledgeArticleType || (exports.KnowledgeArticleType = KnowledgeArticleType = {}));
/**
 * Template types for legal documents
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["CONTRACT"] = "contract";
    TemplateType["MOTION"] = "motion";
    TemplateType["PLEADING"] = "pleading";
    TemplateType["BRIEF"] = "brief";
    TemplateType["LETTER"] = "letter";
    TemplateType["MEMORANDUM"] = "memorandum";
    TemplateType["AGREEMENT"] = "agreement";
    TemplateType["NOTICE"] = "notice";
    TemplateType["CONSENT_FORM"] = "consent_form";
    TemplateType["POLICY_DOCUMENT"] = "policy_document";
    TemplateType["COMPLIANCE_FORM"] = "compliance_form";
    TemplateType["DISCLOSURE"] = "disclosure";
    TemplateType["WAIVER"] = "waiver";
    TemplateType["AFFIDAVIT"] = "affidavit";
    TemplateType["DECLARATION"] = "declaration";
    TemplateType["WORKSHEET"] = "worksheet";
    TemplateType["OTHER"] = "other";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
/**
 * Practice area categories
 */
var PracticeArea;
(function (PracticeArea) {
    PracticeArea["HEALTHCARE_LAW"] = "healthcare_law";
    PracticeArea["MEDICAL_MALPRACTICE"] = "medical_malpractice";
    PracticeArea["HIPAA_COMPLIANCE"] = "hipaa_compliance";
    PracticeArea["PATIENT_RIGHTS"] = "patient_rights";
    PracticeArea["HEALTHCARE_TRANSACTIONS"] = "healthcare_transactions";
    PracticeArea["REGULATORY_COMPLIANCE"] = "regulatory_compliance";
    PracticeArea["EMPLOYMENT_LAW"] = "employment_law";
    PracticeArea["CORPORATE_LAW"] = "corporate_law";
    PracticeArea["CONTRACT_LAW"] = "contract_law";
    PracticeArea["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    PracticeArea["LITIGATION"] = "litigation";
    PracticeArea["INSURANCE_LAW"] = "insurance_law";
    PracticeArea["REAL_ESTATE"] = "real_estate";
    PracticeArea["TAX_LAW"] = "tax_law";
    PracticeArea["PRIVACY_LAW"] = "privacy_law";
    PracticeArea["CYBERSECURITY_LAW"] = "cybersecurity_law";
    PracticeArea["ADMINISTRATIVE_LAW"] = "administrative_law";
    PracticeArea["GENERAL_COUNSEL"] = "general_counsel";
    PracticeArea["OTHER"] = "other";
})(PracticeArea || (exports.PracticeArea = PracticeArea = {}));
/**
 * Content visibility and access levels
 */
var ContentVisibility;
(function (ContentVisibility) {
    ContentVisibility["PUBLIC"] = "public";
    ContentVisibility["INTERNAL"] = "internal";
    ContentVisibility["RESTRICTED"] = "restricted";
    ContentVisibility["CONFIDENTIAL"] = "confidential";
    ContentVisibility["PRACTICE_GROUP_ONLY"] = "practice_group_only";
})(ContentVisibility || (exports.ContentVisibility = ContentVisibility = {}));
/**
 * Article quality ratings
 */
var QualityRating;
(function (QualityRating) {
    QualityRating[QualityRating["NEEDS_IMPROVEMENT"] = 1] = "NEEDS_IMPROVEMENT";
    QualityRating[QualityRating["FAIR"] = 2] = "FAIR";
    QualityRating[QualityRating["GOOD"] = 3] = "GOOD";
    QualityRating[QualityRating["VERY_GOOD"] = 4] = "VERY_GOOD";
    QualityRating[QualityRating["EXCELLENT"] = 5] = "EXCELLENT";
})(QualityRating || (exports.QualityRating = QualityRating = {}));
/**
 * Taxonomy node types
 */
var TaxonomyNodeType;
(function (TaxonomyNodeType) {
    TaxonomyNodeType["CATEGORY"] = "category";
    TaxonomyNodeType["SUBCATEGORY"] = "subcategory";
    TaxonomyNodeType["TOPIC"] = "topic";
    TaxonomyNodeType["SUBTOPIC"] = "subtopic";
    TaxonomyNodeType["TAG"] = "tag";
})(TaxonomyNodeType || (exports.TaxonomyNodeType = TaxonomyNodeType = {}));
/**
 * Editorial workflow states
 */
var EditorialWorkflowState;
(function (EditorialWorkflowState) {
    EditorialWorkflowState["AUTHORING"] = "authoring";
    EditorialWorkflowState["PEER_REVIEW"] = "peer_review";
    EditorialWorkflowState["EDITORIAL_REVIEW"] = "editorial_review";
    EditorialWorkflowState["LEGAL_REVIEW"] = "legal_review";
    EditorialWorkflowState["COMPLIANCE_REVIEW"] = "compliance_review";
    EditorialWorkflowState["APPROVED_FOR_PUBLISH"] = "approved_for_publish";
    EditorialWorkflowState["PUBLISHED"] = "published";
    EditorialWorkflowState["REJECTED"] = "rejected";
})(EditorialWorkflowState || (exports.EditorialWorkflowState = EditorialWorkflowState = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Knowledge article creation schema
 */
exports.KnowledgeArticleCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    summary: zod_1.z.string().min(10).max(1000),
    content: zod_1.z.string().min(1),
    articleType: zod_1.z.nativeEnum(KnowledgeArticleType),
    visibility: zod_1.z.nativeEnum(ContentVisibility).default(ContentVisibility.INTERNAL),
    practiceAreas: zod_1.z.array(zod_1.z.nativeEnum(PracticeArea)).min(1),
    taxonomyIds: zod_1.z.array(zod_1.z.string()).default([]),
    searchKeywords: zod_1.z.array(zod_1.z.string()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    jurisdiction: zod_1.z.string().optional(),
    effectiveDate: zod_1.z.date().optional(),
    nextReviewDate: zod_1.z.date().optional(),
    citations: zod_1.z.array(zod_1.z.object({
        citationType: zod_1.z.enum(['case', 'statute', 'regulation', 'article', 'book', 'internal']),
        citation: zod_1.z.string(),
        url: zod_1.z.string().url().optional(),
        description: zod_1.z.string().optional(),
        relevance: zod_1.z.enum(['primary', 'secondary', 'supporting']).optional(),
    })).default([]),
    metadata: zod_1.z.object({
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
        language: zod_1.z.string().default('en'),
        format: zod_1.z.enum(['text', 'html', 'markdown', 'rich_text']).default('rich_text'),
        sources: zod_1.z.array(zod_1.z.string()).default([]),
        expertReviewed: zod_1.z.boolean().default(false),
        peerReviewed: zod_1.z.boolean().default(false),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
    }).optional(),
});
/**
 * Template creation schema
 */
exports.TemplateCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    templateType: zod_1.z.nativeEnum(TemplateType),
    practiceAreas: zod_1.z.array(zod_1.z.nativeEnum(PracticeArea)).min(1),
    content: zod_1.z.string().min(1),
    variables: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        label: zod_1.z.string().min(1),
        type: zod_1.z.enum(['string', 'number', 'date', 'boolean', 'select', 'multiselect', 'text']),
        required: zod_1.z.boolean(),
        defaultValue: zod_1.z.any().optional(),
        options: zod_1.z.array(zod_1.z.string()).optional(),
        validation: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        placeholder: zod_1.z.string().optional(),
    })).default([]),
    jurisdiction: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    metadata: zod_1.z.object({
        fileFormat: zod_1.z.enum(['docx', 'pdf', 'html', 'markdown', 'rtf', 'txt']).default('docx'),
        complexity: zod_1.z.enum(['simple', 'moderate', 'complex']).default('moderate'),
        requiredInformation: zod_1.z.array(zod_1.z.string()).default([]),
        optionalInformation: zod_1.z.array(zod_1.z.string()).default([]),
        instructions: zod_1.z.string().optional(),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
    }).optional(),
});
/**
 * Taxonomy creation schema
 */
exports.TaxonomyCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(1000).optional(),
    nodeType: zod_1.z.nativeEnum(TaxonomyNodeType),
    practiceArea: zod_1.z.nativeEnum(PracticeArea),
    parentId: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().min(0).default(0),
    metadata: zod_1.z.object({
        synonyms: zod_1.z.array(zod_1.z.string()).default([]),
        relatedTaxonomyIds: zod_1.z.array(zod_1.z.string()).default([]),
        expertUserIds: zod_1.z.array(zod_1.z.string()).default([]),
        icon: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        customFields: zod_1.z.record(zod_1.z.any()).default({}),
    }).optional(),
});
/**
 * Best practice creation schema
 */
exports.BestPracticeCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    description: zod_1.z.string().min(10),
    practiceAreas: zod_1.z.array(zod_1.z.nativeEnum(PracticeArea)).min(1),
    category: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    recommendations: zod_1.z.array(zod_1.z.string()).min(1),
    warnings: zod_1.z.array(zod_1.z.string()).default([]),
    examples: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        scenario: zod_1.z.string(),
        approach: zod_1.z.string(),
        outcome: zod_1.z.string().optional(),
        lessonLearned: zod_1.z.string().optional(),
    })).default([]),
    applicability: zod_1.z.array(zod_1.z.string()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
/**
 * Lesson learned creation schema
 */
exports.LessonLearnedCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500),
    summary: zod_1.z.string().min(10).max(500),
    situation: zod_1.z.string().min(10),
    action: zod_1.z.string().min(10),
    result: zod_1.z.string().min(10),
    lesson: zod_1.z.string().min(10),
    practiceAreas: zod_1.z.array(zod_1.z.nativeEnum(PracticeArea)).min(1),
    caseId: zod_1.z.string().optional(),
    caseReference: zod_1.z.string().optional(),
    projectId: zod_1.z.string().optional(),
    impact: zod_1.z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
    applicability: zod_1.z.enum(['specific', 'broad', 'universal']).default('broad'),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    visibility: zod_1.z.nativeEnum(ContentVisibility).default(ContentVisibility.INTERNAL),
});
/**
 * Article feedback schema
 */
exports.ArticleFeedbackSchema = zod_1.z.object({
    articleId: zod_1.z.string(),
    rating: zod_1.z.nativeEnum(QualityRating).optional(),
    isHelpful: zod_1.z.boolean().optional(),
    comment: zod_1.z.string().max(2000).optional(),
    feedbackType: zod_1.z.enum(['rating', 'comment', 'suggestion', 'correction']),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Knowledge Article Sequelize Model
 */
let KnowledgeArticleModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _articleType_decorators;
    let _articleType_initializers = [];
    let _articleType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _taxonomyIds_decorators;
    let _taxonomyIds_initializers = [];
    let _taxonomyIds_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _authorId_decorators;
    let _authorId_initializers = [];
    let _authorId_extraInitializers = [];
    let _authorName_decorators;
    let _authorName_initializers = [];
    let _authorName_extraInitializers = [];
    let _contributorIds_decorators;
    let _contributorIds_initializers = [];
    let _contributorIds_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _approvedById_decorators;
    let _approvedById_initializers = [];
    let _approvedById_extraInitializers = [];
    let _publishedAt_decorators;
    let _publishedAt_initializers = [];
    let _publishedAt_extraInitializers = [];
    let _lastReviewedAt_decorators;
    let _lastReviewedAt_initializers = [];
    let _lastReviewedAt_extraInitializers = [];
    let _nextReviewDate_decorators;
    let _nextReviewDate_initializers = [];
    let _nextReviewDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _viewCount_decorators;
    let _viewCount_initializers = [];
    let _viewCount_extraInitializers = [];
    let _helpfulCount_decorators;
    let _helpfulCount_initializers = [];
    let _helpfulCount_extraInitializers = [];
    let _notHelpfulCount_decorators;
    let _notHelpfulCount_initializers = [];
    let _notHelpfulCount_extraInitializers = [];
    let _averageRating_decorators;
    let _averageRating_initializers = [];
    let _averageRating_extraInitializers = [];
    let _ratingCount_decorators;
    let _ratingCount_initializers = [];
    let _ratingCount_extraInitializers = [];
    let _searchKeywords_decorators;
    let _searchKeywords_initializers = [];
    let _searchKeywords_extraInitializers = [];
    let _relatedArticleIds_decorators;
    let _relatedArticleIds_initializers = [];
    let _relatedArticleIds_extraInitializers = [];
    let _citations_decorators;
    let _citations_initializers = [];
    let _citations_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _isTemplate_decorators;
    let _isTemplate_initializers = [];
    let _isTemplate_extraInitializers = [];
    let _templateVariables_decorators;
    let _templateVariables_initializers = [];
    let _templateVariables_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _versions_decorators;
    let _versions_initializers = [];
    let _versions_extraInitializers = [];
    let _feedbacks_decorators;
    let _feedbacks_initializers = [];
    let _feedbacks_extraInitializers = [];
    var KnowledgeArticleModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.slug = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.summary = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
            this.content = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.articleType = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _articleType_initializers, void 0));
            this.status = (__runInitializers(this, _articleType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.visibility = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
            this.practiceAreas = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
            this.taxonomyIds = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _taxonomyIds_initializers, void 0));
            this.version = (__runInitializers(this, _taxonomyIds_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.authorId = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            this.authorName = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _authorName_initializers, void 0));
            this.contributorIds = (__runInitializers(this, _authorName_extraInitializers), __runInitializers(this, _contributorIds_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _contributorIds_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.approvedById = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _approvedById_initializers, void 0));
            this.publishedAt = (__runInitializers(this, _approvedById_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
            this.lastReviewedAt = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _lastReviewedAt_initializers, void 0));
            this.nextReviewDate = (__runInitializers(this, _lastReviewedAt_extraInitializers), __runInitializers(this, _nextReviewDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _nextReviewDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.viewCount = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
            this.helpfulCount = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _helpfulCount_initializers, void 0));
            this.notHelpfulCount = (__runInitializers(this, _helpfulCount_extraInitializers), __runInitializers(this, _notHelpfulCount_initializers, void 0));
            this.averageRating = (__runInitializers(this, _notHelpfulCount_extraInitializers), __runInitializers(this, _averageRating_initializers, void 0));
            this.ratingCount = (__runInitializers(this, _averageRating_extraInitializers), __runInitializers(this, _ratingCount_initializers, void 0));
            this.searchKeywords = (__runInitializers(this, _ratingCount_extraInitializers), __runInitializers(this, _searchKeywords_initializers, void 0));
            this.relatedArticleIds = (__runInitializers(this, _searchKeywords_extraInitializers), __runInitializers(this, _relatedArticleIds_initializers, void 0));
            this.citations = (__runInitializers(this, _relatedArticleIds_extraInitializers), __runInitializers(this, _citations_initializers, void 0));
            this.attachments = (__runInitializers(this, _citations_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tags = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.isTemplate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _isTemplate_initializers, void 0));
            this.templateVariables = (__runInitializers(this, _isTemplate_extraInitializers), __runInitializers(this, _templateVariables_initializers, void 0));
            this.tenantId = (__runInitializers(this, _templateVariables_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.versions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _versions_initializers, void 0));
            this.feedbacks = (__runInitializers(this, _versions_extraInitializers), __runInitializers(this, _feedbacks_initializers, void 0));
            __runInitializers(this, _feedbacks_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KnowledgeArticleModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _slug_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false, unique: true })];
        _summary_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _articleType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(KnowledgeArticleType)),
                allowNull: false,
                field: 'article_type',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(KnowledgeArticleStatus)),
                allowNull: false,
                defaultValue: KnowledgeArticleStatus.DRAFT,
            })];
        _visibility_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContentVisibility)),
                allowNull: false,
                defaultValue: ContentVisibility.INTERNAL,
            })];
        _practiceAreas_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'practice_areas',
            })];
        _taxonomyIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'taxonomy_ids',
            })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 1 })];
        _authorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'author_id' })];
        _authorName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false, field: 'author_name' })];
        _contributorIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'contributor_ids',
            })];
        _reviewerId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'reviewer_id' })];
        _approvedById_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'approved_by_id' })];
        _publishedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'published_at' })];
        _lastReviewedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'last_reviewed_at' })];
        _nextReviewDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'next_review_date' })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'expiration_date' })];
        _viewCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'view_count' })];
        _helpfulCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'helpful_count' })];
        _notHelpfulCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'not_helpful_count' })];
        _averageRating_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(3, 2), allowNull: true, field: 'average_rating' })];
        _ratingCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'rating_count' })];
        _searchKeywords_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'search_keywords',
            })];
        _relatedArticleIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'related_article_ids',
            })];
        _citations_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _attachments_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'effective_date' })];
        _isTemplate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_template' })];
        _templateVariables_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
                defaultValue: [],
                field: 'template_variables',
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'tenant_id' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        _versions_decorators = [(0, sequelize_typescript_1.HasMany)(() => ArticleVersionModel, 'articleId')];
        _feedbacks_decorators = [(0, sequelize_typescript_1.HasMany)(() => ArticleFeedbackModel, 'articleId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _articleType_decorators, { kind: "field", name: "articleType", static: false, private: false, access: { has: obj => "articleType" in obj, get: obj => obj.articleType, set: (obj, value) => { obj.articleType = value; } }, metadata: _metadata }, _articleType_initializers, _articleType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
        __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
        __esDecorate(null, null, _taxonomyIds_decorators, { kind: "field", name: "taxonomyIds", static: false, private: false, access: { has: obj => "taxonomyIds" in obj, get: obj => obj.taxonomyIds, set: (obj, value) => { obj.taxonomyIds = value; } }, metadata: _metadata }, _taxonomyIds_initializers, _taxonomyIds_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: obj => "authorId" in obj, get: obj => obj.authorId, set: (obj, value) => { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _authorName_decorators, { kind: "field", name: "authorName", static: false, private: false, access: { has: obj => "authorName" in obj, get: obj => obj.authorName, set: (obj, value) => { obj.authorName = value; } }, metadata: _metadata }, _authorName_initializers, _authorName_extraInitializers);
        __esDecorate(null, null, _contributorIds_decorators, { kind: "field", name: "contributorIds", static: false, private: false, access: { has: obj => "contributorIds" in obj, get: obj => obj.contributorIds, set: (obj, value) => { obj.contributorIds = value; } }, metadata: _metadata }, _contributorIds_initializers, _contributorIds_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _approvedById_decorators, { kind: "field", name: "approvedById", static: false, private: false, access: { has: obj => "approvedById" in obj, get: obj => obj.approvedById, set: (obj, value) => { obj.approvedById = value; } }, metadata: _metadata }, _approvedById_initializers, _approvedById_extraInitializers);
        __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: obj => "publishedAt" in obj, get: obj => obj.publishedAt, set: (obj, value) => { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
        __esDecorate(null, null, _lastReviewedAt_decorators, { kind: "field", name: "lastReviewedAt", static: false, private: false, access: { has: obj => "lastReviewedAt" in obj, get: obj => obj.lastReviewedAt, set: (obj, value) => { obj.lastReviewedAt = value; } }, metadata: _metadata }, _lastReviewedAt_initializers, _lastReviewedAt_extraInitializers);
        __esDecorate(null, null, _nextReviewDate_decorators, { kind: "field", name: "nextReviewDate", static: false, private: false, access: { has: obj => "nextReviewDate" in obj, get: obj => obj.nextReviewDate, set: (obj, value) => { obj.nextReviewDate = value; } }, metadata: _metadata }, _nextReviewDate_initializers, _nextReviewDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: obj => "viewCount" in obj, get: obj => obj.viewCount, set: (obj, value) => { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
        __esDecorate(null, null, _helpfulCount_decorators, { kind: "field", name: "helpfulCount", static: false, private: false, access: { has: obj => "helpfulCount" in obj, get: obj => obj.helpfulCount, set: (obj, value) => { obj.helpfulCount = value; } }, metadata: _metadata }, _helpfulCount_initializers, _helpfulCount_extraInitializers);
        __esDecorate(null, null, _notHelpfulCount_decorators, { kind: "field", name: "notHelpfulCount", static: false, private: false, access: { has: obj => "notHelpfulCount" in obj, get: obj => obj.notHelpfulCount, set: (obj, value) => { obj.notHelpfulCount = value; } }, metadata: _metadata }, _notHelpfulCount_initializers, _notHelpfulCount_extraInitializers);
        __esDecorate(null, null, _averageRating_decorators, { kind: "field", name: "averageRating", static: false, private: false, access: { has: obj => "averageRating" in obj, get: obj => obj.averageRating, set: (obj, value) => { obj.averageRating = value; } }, metadata: _metadata }, _averageRating_initializers, _averageRating_extraInitializers);
        __esDecorate(null, null, _ratingCount_decorators, { kind: "field", name: "ratingCount", static: false, private: false, access: { has: obj => "ratingCount" in obj, get: obj => obj.ratingCount, set: (obj, value) => { obj.ratingCount = value; } }, metadata: _metadata }, _ratingCount_initializers, _ratingCount_extraInitializers);
        __esDecorate(null, null, _searchKeywords_decorators, { kind: "field", name: "searchKeywords", static: false, private: false, access: { has: obj => "searchKeywords" in obj, get: obj => obj.searchKeywords, set: (obj, value) => { obj.searchKeywords = value; } }, metadata: _metadata }, _searchKeywords_initializers, _searchKeywords_extraInitializers);
        __esDecorate(null, null, _relatedArticleIds_decorators, { kind: "field", name: "relatedArticleIds", static: false, private: false, access: { has: obj => "relatedArticleIds" in obj, get: obj => obj.relatedArticleIds, set: (obj, value) => { obj.relatedArticleIds = value; } }, metadata: _metadata }, _relatedArticleIds_initializers, _relatedArticleIds_extraInitializers);
        __esDecorate(null, null, _citations_decorators, { kind: "field", name: "citations", static: false, private: false, access: { has: obj => "citations" in obj, get: obj => obj.citations, set: (obj, value) => { obj.citations = value; } }, metadata: _metadata }, _citations_initializers, _citations_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _isTemplate_decorators, { kind: "field", name: "isTemplate", static: false, private: false, access: { has: obj => "isTemplate" in obj, get: obj => obj.isTemplate, set: (obj, value) => { obj.isTemplate = value; } }, metadata: _metadata }, _isTemplate_initializers, _isTemplate_extraInitializers);
        __esDecorate(null, null, _templateVariables_decorators, { kind: "field", name: "templateVariables", static: false, private: false, access: { has: obj => "templateVariables" in obj, get: obj => obj.templateVariables, set: (obj, value) => { obj.templateVariables = value; } }, metadata: _metadata }, _templateVariables_initializers, _templateVariables_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _versions_decorators, { kind: "field", name: "versions", static: false, private: false, access: { has: obj => "versions" in obj, get: obj => obj.versions, set: (obj, value) => { obj.versions = value; } }, metadata: _metadata }, _versions_initializers, _versions_extraInitializers);
        __esDecorate(null, null, _feedbacks_decorators, { kind: "field", name: "feedbacks", static: false, private: false, access: { has: obj => "feedbacks" in obj, get: obj => obj.feedbacks, set: (obj, value) => { obj.feedbacks = value; } }, metadata: _metadata }, _feedbacks_initializers, _feedbacks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeArticleModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeArticleModel = _classThis;
})();
exports.KnowledgeArticleModel = KnowledgeArticleModel;
/**
 * Template Library Sequelize Model
 */
let TemplateLibraryModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _isOfficial_decorators;
    let _isOfficial_initializers = [];
    let _isOfficial_extraInitializers = [];
    let _isVerified_decorators;
    let _isVerified_initializers = [];
    let _isVerified_extraInitializers = [];
    let _usageCount_decorators;
    let _usageCount_initializers = [];
    let _usageCount_extraInitializers = [];
    let _lastUsedAt_decorators;
    let _lastUsedAt_initializers = [];
    let _lastUsedAt_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _relatedTemplateIds_decorators;
    let _relatedTemplateIds_initializers = [];
    let _relatedTemplateIds_extraInitializers = [];
    let _parentTemplateId_decorators;
    let _parentTemplateId_initializers = [];
    let _parentTemplateId_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _usages_decorators;
    let _usages_initializers = [];
    let _usages_extraInitializers = [];
    var TemplateLibraryModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.templateType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
            this.practiceAreas = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
            this.content = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.version = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.variables = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _variables_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.tags = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.isOfficial = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _isOfficial_initializers, void 0));
            this.isVerified = (__runInitializers(this, _isOfficial_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
            this.usageCount = (__runInitializers(this, _isVerified_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.lastUsedAt = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _lastUsedAt_initializers, void 0));
            this.createdBy = (__runInitializers(this, _lastUsedAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.relatedTemplateIds = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _relatedTemplateIds_initializers, void 0));
            this.parentTemplateId = (__runInitializers(this, _relatedTemplateIds_extraInitializers), __runInitializers(this, _parentTemplateId_initializers, void 0));
            this.tenantId = (__runInitializers(this, _parentTemplateId_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.usages = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _usages_initializers, void 0));
            __runInitializers(this, _usages_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TemplateLibraryModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: true })];
        _templateType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TemplateType)),
                allowNull: false,
                field: 'template_type',
            })];
        _practiceAreas_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'practice_areas',
            })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _version_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 1 })];
        _variables_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: true })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _isOfficial_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_official' })];
        _isVerified_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified' })];
        _usageCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'usage_count' })];
        _lastUsedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'last_used_at' })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'created_by' })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'approved_by' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _relatedTemplateIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'related_template_ids',
            })];
        _parentTemplateId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'parent_template_id' })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'tenant_id' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        _usages_decorators = [(0, sequelize_typescript_1.HasMany)(() => TemplateUsageModel, 'templateId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
        __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _isOfficial_decorators, { kind: "field", name: "isOfficial", static: false, private: false, access: { has: obj => "isOfficial" in obj, get: obj => obj.isOfficial, set: (obj, value) => { obj.isOfficial = value; } }, metadata: _metadata }, _isOfficial_initializers, _isOfficial_extraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: obj => "isVerified" in obj, get: obj => obj.isVerified, set: (obj, value) => { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _lastUsedAt_decorators, { kind: "field", name: "lastUsedAt", static: false, private: false, access: { has: obj => "lastUsedAt" in obj, get: obj => obj.lastUsedAt, set: (obj, value) => { obj.lastUsedAt = value; } }, metadata: _metadata }, _lastUsedAt_initializers, _lastUsedAt_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _relatedTemplateIds_decorators, { kind: "field", name: "relatedTemplateIds", static: false, private: false, access: { has: obj => "relatedTemplateIds" in obj, get: obj => obj.relatedTemplateIds, set: (obj, value) => { obj.relatedTemplateIds = value; } }, metadata: _metadata }, _relatedTemplateIds_initializers, _relatedTemplateIds_extraInitializers);
        __esDecorate(null, null, _parentTemplateId_decorators, { kind: "field", name: "parentTemplateId", static: false, private: false, access: { has: obj => "parentTemplateId" in obj, get: obj => obj.parentTemplateId, set: (obj, value) => { obj.parentTemplateId = value; } }, metadata: _metadata }, _parentTemplateId_initializers, _parentTemplateId_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _usages_decorators, { kind: "field", name: "usages", static: false, private: false, access: { has: obj => "usages" in obj, get: obj => obj.usages, set: (obj, value) => { obj.usages = value; } }, metadata: _metadata }, _usages_initializers, _usages_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TemplateLibraryModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TemplateLibraryModel = _classThis;
})();
exports.TemplateLibraryModel = TemplateLibraryModel;
/**
 * Practice Area Taxonomy Sequelize Model
 */
let PracticeAreaTaxonomyModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _nodeType_decorators;
    let _nodeType_initializers = [];
    let _nodeType_extraInitializers = [];
    let _practiceArea_decorators;
    let _practiceArea_initializers = [];
    let _practiceArea_extraInitializers = [];
    let _parentId_decorators;
    let _parentId_initializers = [];
    let _parentId_extraInitializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _level_extraInitializers = [];
    let _path_decorators;
    let _path_initializers = [];
    let _path_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _articleCount_decorators;
    let _articleCount_initializers = [];
    let _articleCount_extraInitializers = [];
    let _templateCount_decorators;
    let _templateCount_initializers = [];
    let _templateCount_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _parent_decorators;
    let _parent_initializers = [];
    let _parent_extraInitializers = [];
    let _children_decorators;
    let _children_initializers = [];
    let _children_extraInitializers = [];
    var PracticeAreaTaxonomyModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.description = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.nodeType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _nodeType_initializers, void 0));
            this.practiceArea = (__runInitializers(this, _nodeType_extraInitializers), __runInitializers(this, _practiceArea_initializers, void 0));
            this.parentId = (__runInitializers(this, _practiceArea_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
            this.level = (__runInitializers(this, _parentId_extraInitializers), __runInitializers(this, _level_initializers, void 0));
            this.path = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _path_initializers, void 0));
            this.sortOrder = (__runInitializers(this, _path_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
            this.articleCount = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _articleCount_initializers, void 0));
            this.templateCount = (__runInitializers(this, _articleCount_extraInitializers), __runInitializers(this, _templateCount_initializers, void 0));
            this.isActive = (__runInitializers(this, _templateCount_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.tenantId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.parent = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _parent_initializers, void 0));
            this.children = (__runInitializers(this, _parent_extraInitializers), __runInitializers(this, _children_initializers, void 0));
            __runInitializers(this, _children_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PracticeAreaTaxonomyModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false })];
        _slug_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false, unique: true })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: true })];
        _nodeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TaxonomyNodeType)),
                allowNull: false,
                field: 'node_type',
            })];
        _practiceArea_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PracticeArea)),
                allowNull: false,
                field: 'practice_area',
            })];
        _parentId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'parent_id' })];
        _level_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 })];
        _path_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _sortOrder_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'sort_order' })];
        _articleCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'article_count' })];
        _templateCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'template_count' })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'tenant_id' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _parent_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PracticeAreaTaxonomyModel, 'parentId')];
        _children_decorators = [(0, sequelize_typescript_1.HasMany)(() => PracticeAreaTaxonomyModel, 'parentId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _nodeType_decorators, { kind: "field", name: "nodeType", static: false, private: false, access: { has: obj => "nodeType" in obj, get: obj => obj.nodeType, set: (obj, value) => { obj.nodeType = value; } }, metadata: _metadata }, _nodeType_initializers, _nodeType_extraInitializers);
        __esDecorate(null, null, _practiceArea_decorators, { kind: "field", name: "practiceArea", static: false, private: false, access: { has: obj => "practiceArea" in obj, get: obj => obj.practiceArea, set: (obj, value) => { obj.practiceArea = value; } }, metadata: _metadata }, _practiceArea_initializers, _practiceArea_extraInitializers);
        __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: obj => "parentId" in obj, get: obj => obj.parentId, set: (obj, value) => { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
        __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
        __esDecorate(null, null, _path_decorators, { kind: "field", name: "path", static: false, private: false, access: { has: obj => "path" in obj, get: obj => obj.path, set: (obj, value) => { obj.path = value; } }, metadata: _metadata }, _path_initializers, _path_extraInitializers);
        __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
        __esDecorate(null, null, _articleCount_decorators, { kind: "field", name: "articleCount", static: false, private: false, access: { has: obj => "articleCount" in obj, get: obj => obj.articleCount, set: (obj, value) => { obj.articleCount = value; } }, metadata: _metadata }, _articleCount_initializers, _articleCount_extraInitializers);
        __esDecorate(null, null, _templateCount_decorators, { kind: "field", name: "templateCount", static: false, private: false, access: { has: obj => "templateCount" in obj, get: obj => obj.templateCount, set: (obj, value) => { obj.templateCount = value; } }, metadata: _metadata }, _templateCount_initializers, _templateCount_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _parent_decorators, { kind: "field", name: "parent", static: false, private: false, access: { has: obj => "parent" in obj, get: obj => obj.parent, set: (obj, value) => { obj.parent = value; } }, metadata: _metadata }, _parent_initializers, _parent_extraInitializers);
        __esDecorate(null, null, _children_decorators, { kind: "field", name: "children", static: false, private: false, access: { has: obj => "children" in obj, get: obj => obj.children, set: (obj, value) => { obj.children = value; } }, metadata: _metadata }, _children_initializers, _children_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PracticeAreaTaxonomyModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PracticeAreaTaxonomyModel = _classThis;
})();
exports.PracticeAreaTaxonomyModel = PracticeAreaTaxonomyModel;
/**
 * Best Practice Sequelize Model
 */
let BestPracticeModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _warnings_decorators;
    let _warnings_initializers = [];
    let _warnings_extraInitializers = [];
    let _examples_decorators;
    let _examples_initializers = [];
    let _examples_extraInitializers = [];
    let _applicability_decorators;
    let _applicability_initializers = [];
    let _applicability_extraInitializers = [];
    let _updatedFrequency_decorators;
    let _updatedFrequency_initializers = [];
    let _updatedFrequency_extraInitializers = [];
    let _authorId_decorators;
    let _authorId_initializers = [];
    let _authorId_extraInitializers = [];
    let _reviewerIds_decorators;
    let _reviewerIds_initializers = [];
    let _reviewerIds_extraInitializers = [];
    let _endorsements_decorators;
    let _endorsements_initializers = [];
    let _endorsements_extraInitializers = [];
    let _relatedArticleIds_decorators;
    let _relatedArticleIds_initializers = [];
    let _relatedArticleIds_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var BestPracticeModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.practiceAreas = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
            this.category = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.content = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.recommendations = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.warnings = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _warnings_initializers, void 0));
            this.examples = (__runInitializers(this, _warnings_extraInitializers), __runInitializers(this, _examples_initializers, void 0));
            this.applicability = (__runInitializers(this, _examples_extraInitializers), __runInitializers(this, _applicability_initializers, void 0));
            this.updatedFrequency = (__runInitializers(this, _applicability_extraInitializers), __runInitializers(this, _updatedFrequency_initializers, void 0));
            this.authorId = (__runInitializers(this, _updatedFrequency_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
            this.reviewerIds = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _reviewerIds_initializers, void 0));
            this.endorsements = (__runInitializers(this, _reviewerIds_extraInitializers), __runInitializers(this, _endorsements_initializers, void 0));
            this.relatedArticleIds = (__runInitializers(this, _endorsements_extraInitializers), __runInitializers(this, _relatedArticleIds_initializers, void 0));
            this.tags = (__runInitializers(this, _relatedArticleIds_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.tenantId = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BestPracticeModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _practiceAreas_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'practice_areas',
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _recommendations_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT), allowNull: false, defaultValue: [] })];
        _warnings_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT), allowNull: false, defaultValue: [] })];
        _examples_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _applicability_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _updatedFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('weekly', 'monthly', 'quarterly', 'annually', 'as_needed'),
                allowNull: false,
                defaultValue: 'quarterly',
                field: 'updated_frequency',
            })];
        _authorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'author_id' })];
        _reviewerIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'reviewer_ids',
            })];
        _endorsements_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 })];
        _relatedArticleIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'related_article_ids',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'tenant_id' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _warnings_decorators, { kind: "field", name: "warnings", static: false, private: false, access: { has: obj => "warnings" in obj, get: obj => obj.warnings, set: (obj, value) => { obj.warnings = value; } }, metadata: _metadata }, _warnings_initializers, _warnings_extraInitializers);
        __esDecorate(null, null, _examples_decorators, { kind: "field", name: "examples", static: false, private: false, access: { has: obj => "examples" in obj, get: obj => obj.examples, set: (obj, value) => { obj.examples = value; } }, metadata: _metadata }, _examples_initializers, _examples_extraInitializers);
        __esDecorate(null, null, _applicability_decorators, { kind: "field", name: "applicability", static: false, private: false, access: { has: obj => "applicability" in obj, get: obj => obj.applicability, set: (obj, value) => { obj.applicability = value; } }, metadata: _metadata }, _applicability_initializers, _applicability_extraInitializers);
        __esDecorate(null, null, _updatedFrequency_decorators, { kind: "field", name: "updatedFrequency", static: false, private: false, access: { has: obj => "updatedFrequency" in obj, get: obj => obj.updatedFrequency, set: (obj, value) => { obj.updatedFrequency = value; } }, metadata: _metadata }, _updatedFrequency_initializers, _updatedFrequency_extraInitializers);
        __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: obj => "authorId" in obj, get: obj => obj.authorId, set: (obj, value) => { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
        __esDecorate(null, null, _reviewerIds_decorators, { kind: "field", name: "reviewerIds", static: false, private: false, access: { has: obj => "reviewerIds" in obj, get: obj => obj.reviewerIds, set: (obj, value) => { obj.reviewerIds = value; } }, metadata: _metadata }, _reviewerIds_initializers, _reviewerIds_extraInitializers);
        __esDecorate(null, null, _endorsements_decorators, { kind: "field", name: "endorsements", static: false, private: false, access: { has: obj => "endorsements" in obj, get: obj => obj.endorsements, set: (obj, value) => { obj.endorsements = value; } }, metadata: _metadata }, _endorsements_initializers, _endorsements_extraInitializers);
        __esDecorate(null, null, _relatedArticleIds_decorators, { kind: "field", name: "relatedArticleIds", static: false, private: false, access: { has: obj => "relatedArticleIds" in obj, get: obj => obj.relatedArticleIds, set: (obj, value) => { obj.relatedArticleIds = value; } }, metadata: _metadata }, _relatedArticleIds_initializers, _relatedArticleIds_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BestPracticeModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BestPracticeModel = _classThis;
})();
exports.BestPracticeModel = BestPracticeModel;
/**
 * Lesson Learned Sequelize Model
 */
let LessonLearnedModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _situation_decorators;
    let _situation_initializers = [];
    let _situation_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _lesson_decorators;
    let _lesson_initializers = [];
    let _lesson_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _caseId_decorators;
    let _caseId_initializers = [];
    let _caseId_extraInitializers = [];
    let _caseReference_decorators;
    let _caseReference_initializers = [];
    let _caseReference_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _contributorId_decorators;
    let _contributorId_initializers = [];
    let _contributorId_extraInitializers = [];
    let _contributorName_decorators;
    let _contributorName_initializers = [];
    let _contributorName_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    let _applicability_decorators;
    let _applicability_initializers = [];
    let _applicability_extraInitializers = [];
    let _relatedArticleIds_decorators;
    let _relatedArticleIds_initializers = [];
    let _relatedArticleIds_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _tenantId_decorators;
    let _tenantId_initializers = [];
    let _tenantId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var LessonLearnedModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.summary = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
            this.situation = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _situation_initializers, void 0));
            this.action = (__runInitializers(this, _situation_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.result = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _result_initializers, void 0));
            this.lesson = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _lesson_initializers, void 0));
            this.practiceAreas = (__runInitializers(this, _lesson_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
            this.caseId = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _caseId_initializers, void 0));
            this.caseReference = (__runInitializers(this, _caseId_extraInitializers), __runInitializers(this, _caseReference_initializers, void 0));
            this.projectId = (__runInitializers(this, _caseReference_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.contributorId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _contributorId_initializers, void 0));
            this.contributorName = (__runInitializers(this, _contributorId_extraInitializers), __runInitializers(this, _contributorName_initializers, void 0));
            this.impact = (__runInitializers(this, _contributorName_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
            this.applicability = (__runInitializers(this, _impact_extraInitializers), __runInitializers(this, _applicability_initializers, void 0));
            this.relatedArticleIds = (__runInitializers(this, _applicability_extraInitializers), __runInitializers(this, _relatedArticleIds_initializers, void 0));
            this.tags = (__runInitializers(this, _relatedArticleIds_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.visibility = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
            this.tenantId = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _tenantId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tenantId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LessonLearnedModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _summary_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _situation_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _action_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _result_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _lesson_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _practiceAreas_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'practice_areas',
            })];
        _caseId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'case_id' })];
        _caseReference_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true, field: 'case_reference' })];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'project_id' })];
        _contributorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'contributor_id' })];
        _contributorName_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false, field: 'contributor_name' })];
        _impact_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium',
            })];
        _applicability_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('specific', 'broad', 'universal'),
                allowNull: false,
                defaultValue: 'broad',
            })];
        _relatedArticleIds_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'related_article_ids',
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, defaultValue: [] })];
        _visibility_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContentVisibility)),
                allowNull: false,
                defaultValue: ContentVisibility.INTERNAL,
            })];
        _tenantId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'tenant_id' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
        __esDecorate(null, null, _situation_decorators, { kind: "field", name: "situation", static: false, private: false, access: { has: obj => "situation" in obj, get: obj => obj.situation, set: (obj, value) => { obj.situation = value; } }, metadata: _metadata }, _situation_initializers, _situation_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
        __esDecorate(null, null, _lesson_decorators, { kind: "field", name: "lesson", static: false, private: false, access: { has: obj => "lesson" in obj, get: obj => obj.lesson, set: (obj, value) => { obj.lesson = value; } }, metadata: _metadata }, _lesson_initializers, _lesson_extraInitializers);
        __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
        __esDecorate(null, null, _caseId_decorators, { kind: "field", name: "caseId", static: false, private: false, access: { has: obj => "caseId" in obj, get: obj => obj.caseId, set: (obj, value) => { obj.caseId = value; } }, metadata: _metadata }, _caseId_initializers, _caseId_extraInitializers);
        __esDecorate(null, null, _caseReference_decorators, { kind: "field", name: "caseReference", static: false, private: false, access: { has: obj => "caseReference" in obj, get: obj => obj.caseReference, set: (obj, value) => { obj.caseReference = value; } }, metadata: _metadata }, _caseReference_initializers, _caseReference_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _contributorId_decorators, { kind: "field", name: "contributorId", static: false, private: false, access: { has: obj => "contributorId" in obj, get: obj => obj.contributorId, set: (obj, value) => { obj.contributorId = value; } }, metadata: _metadata }, _contributorId_initializers, _contributorId_extraInitializers);
        __esDecorate(null, null, _contributorName_decorators, { kind: "field", name: "contributorName", static: false, private: false, access: { has: obj => "contributorName" in obj, get: obj => obj.contributorName, set: (obj, value) => { obj.contributorName = value; } }, metadata: _metadata }, _contributorName_initializers, _contributorName_extraInitializers);
        __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
        __esDecorate(null, null, _applicability_decorators, { kind: "field", name: "applicability", static: false, private: false, access: { has: obj => "applicability" in obj, get: obj => obj.applicability, set: (obj, value) => { obj.applicability = value; } }, metadata: _metadata }, _applicability_initializers, _applicability_extraInitializers);
        __esDecorate(null, null, _relatedArticleIds_decorators, { kind: "field", name: "relatedArticleIds", static: false, private: false, access: { has: obj => "relatedArticleIds" in obj, get: obj => obj.relatedArticleIds, set: (obj, value) => { obj.relatedArticleIds = value; } }, metadata: _metadata }, _relatedArticleIds_initializers, _relatedArticleIds_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
        __esDecorate(null, null, _tenantId_decorators, { kind: "field", name: "tenantId", static: false, private: false, access: { has: obj => "tenantId" in obj, get: obj => obj.tenantId, set: (obj, value) => { obj.tenantId = value; } }, metadata: _metadata }, _tenantId_initializers, _tenantId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LessonLearnedModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LessonLearnedModel = _classThis;
})();
exports.LessonLearnedModel = LessonLearnedModel;
/**
 * Article Version Sequelize Model
 */
let ArticleVersionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'article_versions',
            timestamps: false,
            indexes: [
                { fields: ['article_id'] },
                { fields: ['version_number'] },
                { fields: ['changed_by'] },
                { fields: ['changed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _articleId_decorators;
    let _articleId_initializers = [];
    let _articleId_extraInitializers = [];
    let _versionNumber_decorators;
    let _versionNumber_initializers = [];
    let _versionNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _changeDescription_decorators;
    let _changeDescription_initializers = [];
    let _changeDescription_extraInitializers = [];
    let _changedBy_decorators;
    let _changedBy_initializers = [];
    let _changedBy_extraInitializers = [];
    let _changedAt_decorators;
    let _changedAt_initializers = [];
    let _changedAt_extraInitializers = [];
    let _snapshot_decorators;
    let _snapshot_initializers = [];
    let _snapshot_extraInitializers = [];
    let _article_decorators;
    let _article_initializers = [];
    let _article_extraInitializers = [];
    var ArticleVersionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.articleId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _articleId_initializers, void 0));
            this.versionNumber = (__runInitializers(this, _articleId_extraInitializers), __runInitializers(this, _versionNumber_initializers, void 0));
            this.title = (__runInitializers(this, _versionNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.changeDescription = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _changeDescription_initializers, void 0));
            this.changedBy = (__runInitializers(this, _changeDescription_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.changedAt = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _changedAt_initializers, void 0));
            this.snapshot = (__runInitializers(this, _changedAt_extraInitializers), __runInitializers(this, _snapshot_initializers, void 0));
            this.article = (__runInitializers(this, _snapshot_extraInitializers), __runInitializers(this, _article_initializers, void 0));
            __runInitializers(this, _article_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ArticleVersionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _articleId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => KnowledgeArticleModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'article_id' })];
        _versionNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, field: 'version_number' })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _content_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _changeDescription_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: true, field: 'change_description' })];
        _changedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'changed_by' })];
        _changedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'changed_at' })];
        _snapshot_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _article_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => KnowledgeArticleModel, 'articleId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _articleId_decorators, { kind: "field", name: "articleId", static: false, private: false, access: { has: obj => "articleId" in obj, get: obj => obj.articleId, set: (obj, value) => { obj.articleId = value; } }, metadata: _metadata }, _articleId_initializers, _articleId_extraInitializers);
        __esDecorate(null, null, _versionNumber_decorators, { kind: "field", name: "versionNumber", static: false, private: false, access: { has: obj => "versionNumber" in obj, get: obj => obj.versionNumber, set: (obj, value) => { obj.versionNumber = value; } }, metadata: _metadata }, _versionNumber_initializers, _versionNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _changeDescription_decorators, { kind: "field", name: "changeDescription", static: false, private: false, access: { has: obj => "changeDescription" in obj, get: obj => obj.changeDescription, set: (obj, value) => { obj.changeDescription = value; } }, metadata: _metadata }, _changeDescription_initializers, _changeDescription_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _changedAt_decorators, { kind: "field", name: "changedAt", static: false, private: false, access: { has: obj => "changedAt" in obj, get: obj => obj.changedAt, set: (obj, value) => { obj.changedAt = value; } }, metadata: _metadata }, _changedAt_initializers, _changedAt_extraInitializers);
        __esDecorate(null, null, _snapshot_decorators, { kind: "field", name: "snapshot", static: false, private: false, access: { has: obj => "snapshot" in obj, get: obj => obj.snapshot, set: (obj, value) => { obj.snapshot = value; } }, metadata: _metadata }, _snapshot_initializers, _snapshot_extraInitializers);
        __esDecorate(null, null, _article_decorators, { kind: "field", name: "article", static: false, private: false, access: { has: obj => "article" in obj, get: obj => obj.article, set: (obj, value) => { obj.article = value; } }, metadata: _metadata }, _article_initializers, _article_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArticleVersionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArticleVersionModel = _classThis;
})();
exports.ArticleVersionModel = ArticleVersionModel;
/**
 * Article Feedback Sequelize Model
 */
let ArticleFeedbackModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'article_feedbacks',
            timestamps: true,
            indexes: [
                { fields: ['article_id'] },
                { fields: ['user_id'] },
                { fields: ['feedback_type'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _articleId_decorators;
    let _articleId_initializers = [];
    let _articleId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _isHelpful_decorators;
    let _isHelpful_initializers = [];
    let _isHelpful_extraInitializers = [];
    let _comment_decorators;
    let _comment_initializers = [];
    let _comment_extraInitializers = [];
    let _feedbackType_decorators;
    let _feedbackType_initializers = [];
    let _feedbackType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewedAt_decorators;
    let _reviewedAt_initializers = [];
    let _reviewedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _article_decorators;
    let _article_initializers = [];
    let _article_extraInitializers = [];
    var ArticleFeedbackModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.articleId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _articleId_initializers, void 0));
            this.userId = (__runInitializers(this, _articleId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.rating = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.isHelpful = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _isHelpful_initializers, void 0));
            this.comment = (__runInitializers(this, _isHelpful_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
            this.feedbackType = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _feedbackType_initializers, void 0));
            this.status = (__runInitializers(this, _feedbackType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedAt = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _reviewedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.article = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _article_initializers, void 0));
            __runInitializers(this, _article_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ArticleFeedbackModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _articleId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => KnowledgeArticleModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'article_id' })];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'user_id' })];
        _rating_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: true })];
        _isHelpful_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true, field: 'is_helpful' })];
        _comment_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(2000), allowNull: true })];
        _feedbackType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('rating', 'comment', 'suggestion', 'correction'),
                allowNull: false,
                field: 'feedback_type',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'reviewed', 'incorporated', 'dismissed'),
                allowNull: false,
                defaultValue: 'pending',
            })];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'reviewed_by' })];
        _reviewedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'reviewed_at' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _article_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => KnowledgeArticleModel, 'articleId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _articleId_decorators, { kind: "field", name: "articleId", static: false, private: false, access: { has: obj => "articleId" in obj, get: obj => obj.articleId, set: (obj, value) => { obj.articleId = value; } }, metadata: _metadata }, _articleId_initializers, _articleId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _isHelpful_decorators, { kind: "field", name: "isHelpful", static: false, private: false, access: { has: obj => "isHelpful" in obj, get: obj => obj.isHelpful, set: (obj, value) => { obj.isHelpful = value; } }, metadata: _metadata }, _isHelpful_initializers, _isHelpful_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: obj => "comment" in obj, get: obj => obj.comment, set: (obj, value) => { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _feedbackType_decorators, { kind: "field", name: "feedbackType", static: false, private: false, access: { has: obj => "feedbackType" in obj, get: obj => obj.feedbackType, set: (obj, value) => { obj.feedbackType = value; } }, metadata: _metadata }, _feedbackType_initializers, _feedbackType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedAt_decorators, { kind: "field", name: "reviewedAt", static: false, private: false, access: { has: obj => "reviewedAt" in obj, get: obj => obj.reviewedAt, set: (obj, value) => { obj.reviewedAt = value; } }, metadata: _metadata }, _reviewedAt_initializers, _reviewedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _article_decorators, { kind: "field", name: "article", static: false, private: false, access: { has: obj => "article" in obj, get: obj => obj.article, set: (obj, value) => { obj.article = value; } }, metadata: _metadata }, _article_initializers, _article_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArticleFeedbackModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArticleFeedbackModel = _classThis;
})();
exports.ArticleFeedbackModel = ArticleFeedbackModel;
/**
 * Template Usage Sequelize Model
 */
let TemplateUsageModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'template_usages',
            timestamps: false,
            indexes: [
                { fields: ['template_id'] },
                { fields: ['user_id'] },
                { fields: ['used_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _usedAt_decorators;
    let _usedAt_initializers = [];
    let _usedAt_extraInitializers = [];
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _feedback_decorators;
    let _feedback_initializers = [];
    let _feedback_extraInitializers = [];
    let _template_decorators;
    let _template_initializers = [];
    let _template_extraInitializers = [];
    var TemplateUsageModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.templateId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
            this.userId = (__runInitializers(this, _templateId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.usedAt = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _usedAt_initializers, void 0));
            this.context = (__runInitializers(this, _usedAt_extraInitializers), __runInitializers(this, _context_initializers, void 0));
            this.documentId = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.feedback = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
            this.template = (__runInitializers(this, _feedback_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            __runInitializers(this, _template_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TemplateUsageModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _templateId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => TemplateLibraryModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'template_id' })];
        _userId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'user_id' })];
        _usedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'used_at' })];
        _context_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true })];
        _documentId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'document_id' })];
        _feedback_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: true })];
        _template_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => TemplateLibraryModel, 'templateId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _usedAt_decorators, { kind: "field", name: "usedAt", static: false, private: false, access: { has: obj => "usedAt" in obj, get: obj => obj.usedAt, set: (obj, value) => { obj.usedAt = value; } }, metadata: _metadata }, _usedAt_initializers, _usedAt_extraInitializers);
        __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: obj => "feedback" in obj, get: obj => obj.feedback, set: (obj, value) => { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: obj => "template" in obj, get: obj => obj.template, set: (obj, value) => { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TemplateUsageModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TemplateUsageModel = _classThis;
})();
exports.TemplateUsageModel = TemplateUsageModel;
/**
 * Editorial Workflow Sequelize Model
 */
let EditorialWorkflowModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'editorial_workflows',
            timestamps: true,
            indexes: [
                { fields: ['article_id'] },
                { fields: ['current_state'] },
                { fields: ['assigned_to'] },
                { fields: ['due_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _articleId_decorators;
    let _articleId_initializers = [];
    let _articleId_extraInitializers = [];
    let _currentState_decorators;
    let _currentState_initializers = [];
    let _currentState_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _history_decorators;
    let _history_initializers = [];
    let _history_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EditorialWorkflowModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.articleId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _articleId_initializers, void 0));
            this.currentState = (__runInitializers(this, _articleId_extraInitializers), __runInitializers(this, _currentState_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _currentState_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.comments = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.history = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _history_initializers, void 0));
            this.createdAt = (__runInitializers(this, _history_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EditorialWorkflowModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _articleId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: 'article_id' })];
        _currentState_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EditorialWorkflowState)),
                allowNull: false,
                field: 'current_state',
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: 'assigned_to' })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true, field: 'due_date' })];
        _comments_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _history_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: [] })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _articleId_decorators, { kind: "field", name: "articleId", static: false, private: false, access: { has: obj => "articleId" in obj, get: obj => obj.articleId, set: (obj, value) => { obj.articleId = value; } }, metadata: _metadata }, _articleId_initializers, _articleId_extraInitializers);
        __esDecorate(null, null, _currentState_decorators, { kind: "field", name: "currentState", static: false, private: false, access: { has: obj => "currentState" in obj, get: obj => obj.currentState, set: (obj, value) => { obj.currentState = value; } }, metadata: _metadata }, _currentState_initializers, _currentState_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _history_decorators, { kind: "field", name: "history", static: false, private: false, access: { has: obj => "history" in obj, get: obj => obj.history, set: (obj, value) => { obj.history = value; } }, metadata: _metadata }, _history_initializers, _history_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EditorialWorkflowModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EditorialWorkflowModel = _classThis;
})();
exports.EditorialWorkflowModel = EditorialWorkflowModel;
/**
 * Knowledge Gap Sequelize Model
 */
let KnowledgeGapModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'knowledge_gaps',
            timestamps: true,
            indexes: [
                { fields: ['topic'] },
                { fields: ['practice_area'] },
                { fields: ['priority'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _topic_decorators;
    let _topic_initializers = [];
    let _topic_extraInitializers = [];
    let _practiceArea_decorators;
    let _practiceArea_initializers = [];
    let _practiceArea_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    let _searchCount_decorators;
    let _searchCount_initializers = [];
    let _searchCount_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _suggestedExperts_decorators;
    let _suggestedExperts_initializers = [];
    let _suggestedExperts_extraInitializers = [];
    let _relatedTopics_decorators;
    let _relatedTopics_initializers = [];
    let _relatedTopics_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var KnowledgeGapModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.topic = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _topic_initializers, void 0));
            this.practiceArea = (__runInitializers(this, _topic_extraInitializers), __runInitializers(this, _practiceArea_initializers, void 0));
            this.identifiedBy = (__runInitializers(this, _practiceArea_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
            this.searchCount = (__runInitializers(this, _identifiedBy_extraInitializers), __runInitializers(this, _searchCount_initializers, void 0));
            this.priority = (__runInitializers(this, _searchCount_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.suggestedExperts = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _suggestedExperts_initializers, void 0));
            this.relatedTopics = (__runInitializers(this, _suggestedExperts_extraInitializers), __runInitializers(this, _relatedTopics_initializers, void 0));
            this.status = (__runInitializers(this, _relatedTopics_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "KnowledgeGapModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _topic_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false })];
        _practiceArea_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PracticeArea)),
                allowNull: false,
                field: 'practice_area',
            })];
        _identifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'identified_by',
            })];
        _searchCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'search_count' })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium',
            })];
        _suggestedExperts_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
                defaultValue: [],
                field: 'suggested_experts',
            })];
        _relatedTopics_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
                defaultValue: [],
                field: 'related_topics',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('identified', 'assigned', 'in_progress', 'addressed'),
                allowNull: false,
                defaultValue: 'identified',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _topic_decorators, { kind: "field", name: "topic", static: false, private: false, access: { has: obj => "topic" in obj, get: obj => obj.topic, set: (obj, value) => { obj.topic = value; } }, metadata: _metadata }, _topic_initializers, _topic_extraInitializers);
        __esDecorate(null, null, _practiceArea_decorators, { kind: "field", name: "practiceArea", static: false, private: false, access: { has: obj => "practiceArea" in obj, get: obj => obj.practiceArea, set: (obj, value) => { obj.practiceArea = value; } }, metadata: _metadata }, _practiceArea_initializers, _practiceArea_extraInitializers);
        __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
        __esDecorate(null, null, _searchCount_decorators, { kind: "field", name: "searchCount", static: false, private: false, access: { has: obj => "searchCount" in obj, get: obj => obj.searchCount, set: (obj, value) => { obj.searchCount = value; } }, metadata: _metadata }, _searchCount_initializers, _searchCount_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _suggestedExperts_decorators, { kind: "field", name: "suggestedExperts", static: false, private: false, access: { has: obj => "suggestedExperts" in obj, get: obj => obj.suggestedExperts, set: (obj, value) => { obj.suggestedExperts = value; } }, metadata: _metadata }, _suggestedExperts_initializers, _suggestedExperts_extraInitializers);
        __esDecorate(null, null, _relatedTopics_decorators, { kind: "field", name: "relatedTopics", static: false, private: false, access: { has: obj => "relatedTopics" in obj, get: obj => obj.relatedTopics, set: (obj, value) => { obj.relatedTopics = value; } }, metadata: _metadata }, _relatedTopics_initializers, _relatedTopics_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeGapModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeGapModel = _classThis;
})();
exports.KnowledgeGapModel = KnowledgeGapModel;
// ============================================================================
// CORE FUNCTIONS
// ============================================================================
/**
 * Function 1: Create knowledge article
 */
async function createKnowledgeArticle(data, userId, userName) {
    const validated = exports.KnowledgeArticleCreateSchema.parse(data);
    const slug = generateSlug(validated.title);
    const id = crypto.randomUUID();
    const article = {
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
async function updateKnowledgeArticle(articleId, updates, userId) {
    const currentDate = new Date();
    const updatedArticle = {
        ...updates,
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
async function publishKnowledgeArticle(articleId, userId) {
    const publishedAt = new Date();
    // Update article status to published
    // Set publishedAt timestamp
    // Set approvedById to userId
}
/**
 * Function 4: Archive knowledge article
 */
async function archiveKnowledgeArticle(articleId) {
    // Update status to archived
    // Optionally set deletedAt for soft delete
}
/**
 * Function 5: Create article version
 */
async function createArticleVersion(articleId, currentArticle, changeDescription, userId) {
    const version = {
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
async function searchKnowledgeArticles(filters) {
    const startTime = Date.now();
    // Build search query
    const whereConditions = {};
    if (filters.query) {
        // Full-text search on title, summary, content, searchKeywords
        whereConditions[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
            { summary: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
            { content: { [sequelize_1.Op.iLike]: `%${filters.query}%` } },
        ];
    }
    if (filters.articleTypes && filters.articleTypes.length > 0) {
        whereConditions.articleType = { [sequelize_1.Op.in]: filters.articleTypes };
    }
    if (filters.practiceAreas && filters.practiceAreas.length > 0) {
        whereConditions.practiceAreas = { [sequelize_1.Op.overlap]: filters.practiceAreas };
    }
    if (filters.status && filters.status.length > 0) {
        whereConditions.status = { [sequelize_1.Op.in]: filters.status };
    }
    if (filters.visibility && filters.visibility.length > 0) {
        whereConditions.visibility = { [sequelize_1.Op.in]: filters.visibility };
    }
    if (filters.tags && filters.tags.length > 0) {
        whereConditions.tags = { [sequelize_1.Op.overlap]: filters.tags };
    }
    if (filters.minRating) {
        whereConditions.averageRating = { [sequelize_1.Op.gte]: filters.minRating };
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
function generateSearchFacets(articles) {
    const facets = {
        practiceAreas: [],
        articleTypes: [],
        tags: [],
        authors: [],
        years: [],
    };
    // Count occurrences for each facet
    const practiceAreaCounts = new Map();
    const typeCounts = new Map();
    const tagCounts = new Map();
    const authorCounts = new Map();
    const yearCounts = new Map();
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
async function createTemplate(data, userId) {
    const validated = exports.TemplateCreateSchema.parse(data);
    const template = {
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
async function updateTemplate(templateId, updates) {
    const updatedTemplate = {
        ...updates,
        id: templateId,
        updatedAt: new Date(),
    };
    return updatedTemplate;
}
/**
 * Function 10: Track template usage
 */
async function trackTemplateUsage(templateId, userId, context, documentId) {
    const usage = {
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
async function getTemplateById(templateId) {
    // Retrieve template from database
    return null;
}
/**
 * Function 12: Search templates
 */
async function searchTemplates(filters) {
    // Build and execute search query
    return [];
}
/**
 * Function 13: Create practice area taxonomy
 */
async function createTaxonomyNode(data) {
    const validated = exports.TaxonomyCreateSchema.parse(data);
    const slug = generateSlug(validated.name);
    let level = 0;
    let path = slug;
    if (validated.parentId) {
        // Get parent node to determine level and path
        level = 1; // Would be parent.level + 1
        path = `parent-path/${slug}`;
    }
    const taxonomy = {
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
async function getTaxonomyHierarchy(practiceArea, rootId) {
    // Retrieve hierarchical taxonomy structure
    return [];
}
/**
 * Function 15: Get taxonomy path
 */
async function getTaxonomyPath(taxonomyId) {
    // Get full path from root to specified node
    return [];
}
/**
 * Function 16: Create best practice
 */
async function createBestPractice(data, userId) {
    const validated = exports.BestPracticeCreateSchema.parse(data);
    const bestPractice = {
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
async function updateBestPractice(practiceId, updates) {
    const updatedPractice = {
        ...updates,
        id: practiceId,
        updatedAt: new Date(),
    };
    return updatedPractice;
}
/**
 * Function 18: Endorse best practice
 */
async function endorseBestPractice(practiceId, userId) {
    // Increment endorsement count
    // Track user endorsement
}
/**
 * Function 19: Create lesson learned
 */
async function createLessonLearned(data, userId, userName) {
    const validated = exports.LessonLearnedCreateSchema.parse(data);
    const lesson = {
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
async function searchLessonsLearned(filters) {
    // Build and execute search query
    return [];
}
/**
 * Function 21: Submit article feedback
 */
async function submitArticleFeedback(data, userId) {
    const validated = exports.ArticleFeedbackSchema.parse(data);
    const feedback = {
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
async function updateArticleRating(articleId, newRating) {
    // Recalculate average rating
    // Update article rating statistics
}
/**
 * Function 23: Increment article view count
 */
async function incrementArticleViews(articleId) {
    // Increment view counter
}
/**
 * Function 24: Mark article helpful/not helpful
 */
async function markArticleHelpfulness(articleId, isHelpful) {
    // Increment appropriate counter
}
/**
 * Function 25: Get related articles
 */
async function getRelatedArticles(articleId, limit = 5) {
    // Find articles with similar tags, practice areas, or taxonomy
    return [];
}
/**
 * Function 26: Auto-tag article
 */
async function autoTagArticle(article) {
    const suggestedTags = [];
    // Extract keywords from title and content
    // Identify legal terms, statutes, cases
    // Suggest relevant tags
    return suggestedTags;
}
/**
 * Function 27: Calculate content freshness score
 */
function calculateFreshnessScore(article) {
    const now = new Date();
    const daysSinceUpdate = Math.floor((now.getTime() - article.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    // Freshness decreases over time
    let score = 100;
    if (daysSinceUpdate > 365) {
        score = 20;
    }
    else if (daysSinceUpdate > 180) {
        score = 50;
    }
    else if (daysSinceUpdate > 90) {
        score = 75;
    }
    else if (daysSinceUpdate > 30) {
        score = 90;
    }
    // Boost if recently reviewed
    if (article.lastReviewedAt) {
        const daysSinceReview = Math.floor((now.getTime() - article.lastReviewedAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceReview < 30) {
            score = Math.min(100, score + 10);
        }
    }
    return score;
}
/**
 * Function 28: Calculate quality score
 */
function calculateQualityScore(article) {
    let score = 0;
    // Has summary
    if (article.summary && article.summary.length > 50)
        score += 10;
    // Has citations
    if (article.citations && article.citations.length > 0)
        score += 15;
    // Has attachments
    if (article.attachments && article.attachments.length > 0)
        score += 10;
    // Expert reviewed
    if (article.metadata.expertReviewed)
        score += 20;
    // Peer reviewed
    if (article.metadata.peerReviewed)
        score += 15;
    // Good ratings
    if (article.averageRating && article.averageRating >= 4)
        score += 15;
    // Usage metrics
    if (article.viewCount > 100)
        score += 10;
    if (article.helpfulCount > article.notHelpfulCount)
        score += 5;
    return Math.min(100, score);
}
/**
 * Function 29: Identify content experts
 */
async function identifyContentExperts(practiceArea) {
    // Find users with highest contribution scores in practice area
    return [];
}
/**
 * Function 30: Analyze knowledge gaps
 */
async function analyzeKnowledgeGaps(searchQueries, practiceArea) {
    const gaps = [];
    // Analyze search queries with no results
    // Identify topics with few articles
    // Suggest areas needing content
    return gaps;
}
/**
 * Function 31: Create editorial workflow
 */
async function createEditorialWorkflow(articleId, assignedTo, dueDate) {
    const workflow = {
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
async function transitionWorkflowState(workflowId, newState, userId, reason) {
    // Update workflow state
    // Add to history
}
/**
 * Function 33: Add workflow comment
 */
async function addWorkflowComment(workflowId, userId, userName, comment) {
    // Add comment to workflow
}
/**
 * Function 34: Generate article slug
 */
function generateSlug(title) {
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
function validateTemplateVariables(variables, values) {
    const errors = [];
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
                    }
                    else {
                        const invalidOptions = value.filter((v) => !variable.options.includes(v));
                        if (invalidOptions.length > 0) {
                            errors.push(`${variable.label} contains invalid options: ${invalidOptions.join(', ')}`);
                        }
                    }
                }
                else if (variable.type === 'select') {
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
function substituteTemplateVariables(template, values) {
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
function formatTemplateValue(value) {
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
let KnowledgeManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var KnowledgeManagementService = _classThis = class {
        constructor(articleRepo, templateRepo, taxonomyRepo, bestPracticeRepo, lessonLearnedRepo, configService) {
            this.articleRepo = articleRepo;
            this.templateRepo = templateRepo;
            this.taxonomyRepo = taxonomyRepo;
            this.bestPracticeRepo = bestPracticeRepo;
            this.lessonLearnedRepo = lessonLearnedRepo;
            this.configService = configService;
            this.logger = new common_1.Logger(KnowledgeManagementService.name);
        }
        /**
         * Create knowledge article
         */
        async createArticle(data, userId, userName) {
            this.logger.log(`Creating knowledge article: ${data.title}`);
            const article = await createKnowledgeArticle(data, userId, userName);
            await this.articleRepo.create(article);
            return article;
        }
        /**
         * Get article by ID
         */
        async getArticleById(id) {
            const article = await this.articleRepo.findByPk(id);
            if (!article) {
                throw new common_1.NotFoundException(`Article ${id} not found`);
            }
            return article.toJSON();
        }
        /**
         * Search articles
         */
        async searchArticles(filters) {
            this.logger.log(`Searching articles with query: ${filters.query}`);
            return searchKnowledgeArticles(filters);
        }
        /**
         * Publish article
         */
        async publishArticle(articleId, userId) {
            this.logger.log(`Publishing article ${articleId}`);
            await publishKnowledgeArticle(articleId, userId);
        }
        /**
         * Create template
         */
        async createTemplate(data, userId) {
            this.logger.log(`Creating template: ${data.name}`);
            const template = await createTemplate(data, userId);
            await this.templateRepo.create(template);
            return template;
        }
        /**
         * Search templates
         */
        async searchTemplates(filters) {
            return searchTemplates(filters);
        }
        /**
         * Track template usage
         */
        async trackUsage(templateId, userId, context) {
            return trackTemplateUsage(templateId, userId, context);
        }
        /**
         * Create taxonomy node
         */
        async createTaxonomy(data) {
            this.logger.log(`Creating taxonomy node: ${data.name}`);
            const taxonomy = await createTaxonomyNode(data);
            await this.taxonomyRepo.create(taxonomy);
            return taxonomy;
        }
        /**
         * Get taxonomy hierarchy
         */
        async getTaxonomyHierarchy(practiceArea) {
            return getTaxonomyHierarchy(practiceArea);
        }
        /**
         * Create best practice
         */
        async createBestPractice(data, userId) {
            this.logger.log(`Creating best practice: ${data.title}`);
            const practice = await createBestPractice(data, userId);
            await this.bestPracticeRepo.create(practice);
            return practice;
        }
        /**
         * Create lesson learned
         */
        async createLesson(data, userId, userName) {
            this.logger.log(`Creating lesson learned: ${data.title}`);
            const lesson = await createLessonLearned(data, userId, userName);
            await this.lessonLearnedRepo.create(lesson);
            return lesson;
        }
        /**
         * Submit feedback
         */
        async submitFeedback(data, userId) {
            return submitArticleFeedback(data, userId);
        }
        /**
         * Get related articles
         */
        async getRelatedArticles(articleId, limit = 5) {
            return getRelatedArticles(articleId, limit);
        }
        /**
         * Analyze knowledge gaps
         */
        async analyzeGaps(queries, practiceArea) {
            return analyzeKnowledgeGaps(queries, practiceArea);
        }
    };
    __setFunctionName(_classThis, "KnowledgeManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeManagementService = _classThis;
})();
exports.KnowledgeManagementService = KnowledgeManagementService;
// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================
/**
 * Knowledge Article DTO
 */
let KnowledgeArticleDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _articleType_decorators;
    let _articleType_initializers = [];
    let _articleType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _publishedAt_decorators;
    let _publishedAt_initializers = [];
    let _publishedAt_extraInitializers = [];
    let _viewCount_decorators;
    let _viewCount_initializers = [];
    let _viewCount_extraInitializers = [];
    let _averageRating_decorators;
    let _averageRating_initializers = [];
    let _averageRating_extraInitializers = [];
    return _a = class KnowledgeArticleDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.slug = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.summary = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.content = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.articleType = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _articleType_initializers, void 0));
                this.status = (__runInitializers(this, _articleType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.visibility = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.version = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.publishedAt = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _publishedAt_initializers, void 0));
                this.viewCount = (__runInitializers(this, _publishedAt_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
                this.averageRating = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _averageRating_initializers, void 0));
                __runInitializers(this, _averageRating_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Article ID' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'HIPAA Privacy Rule Overview', description: 'Article title' })];
            _slug_decorators = [(0, swagger_1.ApiProperty)({ description: 'URL-friendly slug' })];
            _summary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Brief summary of the article' })];
            _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Full article content' })];
            _articleType_decorators = [(0, swagger_1.ApiProperty)({ enum: KnowledgeArticleType, description: 'Article type' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: KnowledgeArticleStatus, description: 'Article status' })];
            _visibility_decorators = [(0, swagger_1.ApiProperty)({ enum: ContentVisibility, description: 'Visibility level' })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ example: 1, description: 'Version number' })];
            _publishedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: Date, description: 'Publication date' })];
            _viewCount_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'View count' })];
            _averageRating_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 4.5, description: 'Average rating' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _articleType_decorators, { kind: "field", name: "articleType", static: false, private: false, access: { has: obj => "articleType" in obj, get: obj => obj.articleType, set: (obj, value) => { obj.articleType = value; } }, metadata: _metadata }, _articleType_initializers, _articleType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _publishedAt_decorators, { kind: "field", name: "publishedAt", static: false, private: false, access: { has: obj => "publishedAt" in obj, get: obj => obj.publishedAt, set: (obj, value) => { obj.publishedAt = value; } }, metadata: _metadata }, _publishedAt_initializers, _publishedAt_extraInitializers);
            __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: obj => "viewCount" in obj, get: obj => obj.viewCount, set: (obj, value) => { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
            __esDecorate(null, null, _averageRating_decorators, { kind: "field", name: "averageRating", static: false, private: false, access: { has: obj => "averageRating" in obj, get: obj => obj.averageRating, set: (obj, value) => { obj.averageRating = value; } }, metadata: _metadata }, _averageRating_initializers, _averageRating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KnowledgeArticleDto = KnowledgeArticleDto;
/**
 * Create Knowledge Article DTO
 */
let CreateKnowledgeArticleDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _articleType_decorators;
    let _articleType_initializers = [];
    let _articleType_extraInitializers = [];
    let _visibility_decorators;
    let _visibility_initializers = [];
    let _visibility_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    return _a = class CreateKnowledgeArticleDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.summary = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.content = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.articleType = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _articleType_initializers, void 0));
                this.visibility = (__runInitializers(this, _articleType_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.tags = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.jurisdiction = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
                __runInitializers(this, _jurisdiction_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'HIPAA Privacy Rule Overview' })];
            _summary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Brief summary (10-1000 chars)' })];
            _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Full article content' })];
            _articleType_decorators = [(0, swagger_1.ApiProperty)({ enum: KnowledgeArticleType })];
            _visibility_decorators = [(0, swagger_1.ApiProperty)({ enum: ContentVisibility, default: ContentVisibility.INTERNAL })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas', isArray: true })];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Tags' })];
            _jurisdiction_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Jurisdiction' })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _articleType_decorators, { kind: "field", name: "articleType", static: false, private: false, access: { has: obj => "articleType" in obj, get: obj => obj.articleType, set: (obj, value) => { obj.articleType = value; } }, metadata: _metadata }, _articleType_initializers, _articleType_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: obj => "visibility" in obj, get: obj => obj.visibility, set: (obj, value) => { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateKnowledgeArticleDto = CreateKnowledgeArticleDto;
/**
 * Template Library DTO
 */
let TemplateLibraryDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _isOfficial_decorators;
    let _isOfficial_initializers = [];
    let _isOfficial_extraInitializers = [];
    let _usageCount_decorators;
    let _usageCount_initializers = [];
    let _usageCount_extraInitializers = [];
    return _a = class TemplateLibraryDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.templateType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.version = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.isOfficial = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _isOfficial_initializers, void 0));
                this.usageCount = (__runInitializers(this, _isOfficial_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
                __runInitializers(this, _usageCount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Template ID' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'HIPAA Authorization Form', description: 'Template name' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Template description' })];
            _templateType_decorators = [(0, swagger_1.ApiProperty)({ enum: TemplateType, description: 'Template type' })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ example: 1, description: 'Version number' })];
            _isOfficial_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Official template flag' })];
            _usageCount_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'Usage count' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _isOfficial_decorators, { kind: "field", name: "isOfficial", static: false, private: false, access: { has: obj => "isOfficial" in obj, get: obj => obj.isOfficial, set: (obj, value) => { obj.isOfficial = value; } }, metadata: _metadata }, _isOfficial_initializers, _isOfficial_extraInitializers);
            __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TemplateLibraryDto = TemplateLibraryDto;
/**
 * Create Template DTO
 */
let CreateTemplateDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _variables_decorators;
    let _variables_initializers = [];
    let _variables_extraInitializers = [];
    return _a = class CreateTemplateDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.templateType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.content = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.variables = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _variables_initializers, void 0));
                __runInitializers(this, _variables_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'HIPAA Authorization Form' })];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Template description' })];
            _templateType_decorators = [(0, swagger_1.ApiProperty)({ enum: TemplateType })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas', isArray: true })];
            _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template content' })];
            _variables_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [Object], description: 'Template variables' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _variables_decorators, { kind: "field", name: "variables", static: false, private: false, access: { has: obj => "variables" in obj, get: obj => obj.variables, set: (obj, value) => { obj.variables = value; } }, metadata: _metadata }, _variables_initializers, _variables_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTemplateDto = CreateTemplateDto;
/**
 * Practice Area Taxonomy DTO
 */
let PracticeAreaTaxonomyDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _nodeType_decorators;
    let _nodeType_initializers = [];
    let _nodeType_extraInitializers = [];
    let _practiceArea_decorators;
    let _practiceArea_initializers = [];
    let _practiceArea_extraInitializers = [];
    let _parentId_decorators;
    let _parentId_initializers = [];
    let _parentId_extraInitializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _level_extraInitializers = [];
    let _articleCount_decorators;
    let _articleCount_initializers = [];
    let _articleCount_extraInitializers = [];
    return _a = class PracticeAreaTaxonomyDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.nodeType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _nodeType_initializers, void 0));
                this.practiceArea = (__runInitializers(this, _nodeType_extraInitializers), __runInitializers(this, _practiceArea_initializers, void 0));
                this.parentId = (__runInitializers(this, _practiceArea_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
                this.level = (__runInitializers(this, _parentId_extraInitializers), __runInitializers(this, _level_initializers, void 0));
                this.articleCount = (__runInitializers(this, _level_extraInitializers), __runInitializers(this, _articleCount_initializers, void 0));
                __runInitializers(this, _articleCount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Taxonomy ID' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Patient Privacy', description: 'Taxonomy name' })];
            _nodeType_decorators = [(0, swagger_1.ApiProperty)({ enum: TaxonomyNodeType, description: 'Node type' })];
            _practiceArea_decorators = [(0, swagger_1.ApiProperty)({ enum: PracticeArea, description: 'Practice area' })];
            _parentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Parent taxonomy ID' })];
            _level_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'Hierarchy level' })];
            _articleCount_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'Article count' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _nodeType_decorators, { kind: "field", name: "nodeType", static: false, private: false, access: { has: obj => "nodeType" in obj, get: obj => obj.nodeType, set: (obj, value) => { obj.nodeType = value; } }, metadata: _metadata }, _nodeType_initializers, _nodeType_extraInitializers);
            __esDecorate(null, null, _practiceArea_decorators, { kind: "field", name: "practiceArea", static: false, private: false, access: { has: obj => "practiceArea" in obj, get: obj => obj.practiceArea, set: (obj, value) => { obj.practiceArea = value; } }, metadata: _metadata }, _practiceArea_initializers, _practiceArea_extraInitializers);
            __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: obj => "parentId" in obj, get: obj => obj.parentId, set: (obj, value) => { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
            __esDecorate(null, null, _level_decorators, { kind: "field", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } }, metadata: _metadata }, _level_initializers, _level_extraInitializers);
            __esDecorate(null, null, _articleCount_decorators, { kind: "field", name: "articleCount", static: false, private: false, access: { has: obj => "articleCount" in obj, get: obj => obj.articleCount, set: (obj, value) => { obj.articleCount = value; } }, metadata: _metadata }, _articleCount_initializers, _articleCount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PracticeAreaTaxonomyDto = PracticeAreaTaxonomyDto;
/**
 * Best Practice DTO
 */
let BestPracticeDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _endorsements_decorators;
    let _endorsements_initializers = [];
    let _endorsements_extraInitializers = [];
    return _a = class BestPracticeDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.category = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.recommendations = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
                this.endorsements = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _endorsements_initializers, void 0));
                __runInitializers(this, _endorsements_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Best practice ID' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'HIPAA Breach Response Protocol', description: 'Title' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas' })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' })];
            _recommendations_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Recommendations' })];
            _endorsements_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'Endorsement count' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
            __esDecorate(null, null, _endorsements_decorators, { kind: "field", name: "endorsements", static: false, private: false, access: { has: obj => "endorsements" in obj, get: obj => obj.endorsements, set: (obj, value) => { obj.endorsements = value; } }, metadata: _metadata }, _endorsements_initializers, _endorsements_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BestPracticeDto = BestPracticeDto;
/**
 * Lesson Learned DTO
 */
let LessonLearnedDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _situation_decorators;
    let _situation_initializers = [];
    let _situation_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _lesson_decorators;
    let _lesson_initializers = [];
    let _lesson_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _impact_decorators;
    let _impact_initializers = [];
    let _impact_extraInitializers = [];
    return _a = class LessonLearnedDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.summary = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
                this.situation = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _situation_initializers, void 0));
                this.action = (__runInitializers(this, _situation_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.result = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _result_initializers, void 0));
                this.lesson = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _lesson_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _lesson_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.impact = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _impact_initializers, void 0));
                __runInitializers(this, _impact_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'uuid', description: 'Lesson ID' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ example: 'Patient Data Breach Response', description: 'Title' })];
            _summary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Brief summary' })];
            _situation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Situation description' })];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action taken' })];
            _result_decorators = [(0, swagger_1.ApiProperty)({ description: 'Result achieved' })];
            _lesson_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lesson learned' })];
            _practiceAreas_decorators = [(0, swagger_1.ApiProperty)({ type: [String], description: 'Practice areas' })];
            _impact_decorators = [(0, swagger_1.ApiProperty)({ enum: ['low', 'medium', 'high', 'critical'], description: 'Impact level' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
            __esDecorate(null, null, _situation_decorators, { kind: "field", name: "situation", static: false, private: false, access: { has: obj => "situation" in obj, get: obj => obj.situation, set: (obj, value) => { obj.situation = value; } }, metadata: _metadata }, _situation_initializers, _situation_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
            __esDecorate(null, null, _lesson_decorators, { kind: "field", name: "lesson", static: false, private: false, access: { has: obj => "lesson" in obj, get: obj => obj.lesson, set: (obj, value) => { obj.lesson = value; } }, metadata: _metadata }, _lesson_initializers, _lesson_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _impact_decorators, { kind: "field", name: "impact", static: false, private: false, access: { has: obj => "impact" in obj, get: obj => obj.impact, set: (obj, value) => { obj.impact = value; } }, metadata: _metadata }, _impact_initializers, _impact_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LessonLearnedDto = LessonLearnedDto;
/**
 * Search Filters DTO
 */
let KnowledgeSearchFiltersDto = (() => {
    var _a;
    let _query_decorators;
    let _query_initializers = [];
    let _query_extraInitializers = [];
    let _articleTypes_decorators;
    let _articleTypes_initializers = [];
    let _articleTypes_extraInitializers = [];
    let _practiceAreas_decorators;
    let _practiceAreas_initializers = [];
    let _practiceAreas_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _minRating_decorators;
    let _minRating_initializers = [];
    let _minRating_extraInitializers = [];
    let _sortBy_decorators;
    let _sortBy_initializers = [];
    let _sortBy_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _offset_decorators;
    let _offset_initializers = [];
    let _offset_extraInitializers = [];
    let _facets_decorators;
    let _facets_initializers = [];
    let _facets_extraInitializers = [];
    return _a = class KnowledgeSearchFiltersDto {
            constructor() {
                this.query = __runInitializers(this, _query_initializers, void 0);
                this.articleTypes = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _articleTypes_initializers, void 0));
                this.practiceAreas = (__runInitializers(this, _articleTypes_extraInitializers), __runInitializers(this, _practiceAreas_initializers, void 0));
                this.tags = (__runInitializers(this, _practiceAreas_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.minRating = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _minRating_initializers, void 0));
                this.sortBy = (__runInitializers(this, _minRating_extraInitializers), __runInitializers(this, _sortBy_initializers, void 0));
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, void 0));
                this.limit = (__runInitializers(this, _sortOrder_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.offset = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _offset_initializers, void 0));
                this.facets = (__runInitializers(this, _offset_extraInitializers), __runInitializers(this, _facets_initializers, void 0));
                __runInitializers(this, _facets_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search query' })];
            _articleTypes_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Article types' })];
            _practiceAreas_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Practice areas' })];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Tags' })];
            _minRating_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum rating' })];
            _sortBy_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['relevance', 'date', 'rating', 'views', 'title'] })];
            _sortOrder_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' })];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 20, description: 'Results per page' })];
            _offset_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Result offset' })];
            _facets_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: false, description: 'Include facets' })];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: obj => "query" in obj, get: obj => obj.query, set: (obj, value) => { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _articleTypes_decorators, { kind: "field", name: "articleTypes", static: false, private: false, access: { has: obj => "articleTypes" in obj, get: obj => obj.articleTypes, set: (obj, value) => { obj.articleTypes = value; } }, metadata: _metadata }, _articleTypes_initializers, _articleTypes_extraInitializers);
            __esDecorate(null, null, _practiceAreas_decorators, { kind: "field", name: "practiceAreas", static: false, private: false, access: { has: obj => "practiceAreas" in obj, get: obj => obj.practiceAreas, set: (obj, value) => { obj.practiceAreas = value; } }, metadata: _metadata }, _practiceAreas_initializers, _practiceAreas_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _minRating_decorators, { kind: "field", name: "minRating", static: false, private: false, access: { has: obj => "minRating" in obj, get: obj => obj.minRating, set: (obj, value) => { obj.minRating = value; } }, metadata: _metadata }, _minRating_initializers, _minRating_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: obj => "sortBy" in obj, get: obj => obj.sortBy, set: (obj, value) => { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _offset_decorators, { kind: "field", name: "offset", static: false, private: false, access: { has: obj => "offset" in obj, get: obj => obj.offset, set: (obj, value) => { obj.offset = value; } }, metadata: _metadata }, _offset_initializers, _offset_extraInitializers);
            __esDecorate(null, null, _facets_decorators, { kind: "field", name: "facets", static: false, private: false, access: { has: obj => "facets" in obj, get: obj => obj.facets, set: (obj, value) => { obj.facets = value; } }, metadata: _metadata }, _facets_initializers, _facets_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KnowledgeSearchFiltersDto = KnowledgeSearchFiltersDto;
// ============================================================================
// NESTJS MODULE
// ============================================================================
/**
 * Knowledge Management Module providers
 */
exports.knowledgeManagementProviders = [
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
let KnowledgeManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [config_1.ConfigModule],
            providers: [...exports.knowledgeManagementProviders, KnowledgeManagementService],
            exports: [KnowledgeManagementService, ...exports.knowledgeManagementProviders],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var KnowledgeManagementModule = _classThis = class {
        static forRoot(config) {
            return {
                module: KnowledgeManagementModule,
                providers: [
                    ...exports.knowledgeManagementProviders,
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
                exports: [KnowledgeManagementService, ...exports.knowledgeManagementProviders],
            };
        }
    };
    __setFunctionName(_classThis, "KnowledgeManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeManagementModule = _classThis;
})();
exports.KnowledgeManagementModule = KnowledgeManagementModule;
/**
 * Configuration factory for knowledge management
 */
exports.knowledgeManagementConfig = (0, config_1.registerAs)('knowledgeManagement', () => ({
    enableFullTextSearch: process.env.KM_ENABLE_FULL_TEXT_SEARCH === 'true',
    enableVersioning: process.env.KM_ENABLE_VERSIONING !== 'false',
    maxVersionsPerArticle: parseInt(process.env.KM_MAX_VERSIONS || '50', 10),
    searchResultsLimit: parseInt(process.env.KM_SEARCH_LIMIT || '50', 10),
    autoArchiveDays: parseInt(process.env.KM_AUTO_ARCHIVE_DAYS || '365', 10),
    reviewReminderDays: parseInt(process.env.KM_REVIEW_REMINDER_DAYS || '90', 10),
}));
//# sourceMappingURL=legal-knowledge-management-kit.js.map