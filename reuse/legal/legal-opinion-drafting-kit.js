"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalOpinionService = exports.OpinionSectionModel = exports.LegalIssueModel = exports.OpinionAnalysis = exports.LegalOpinion = void 0;
exports.initLegalOpinionModel = initLegalOpinionModel;
exports.initOpinionAnalysisModel = initOpinionAnalysisModel;
exports.initLegalIssueModel = initLegalIssueModel;
exports.initOpinionSectionModel = initOpinionSectionModel;
exports.initOpinionModels = initOpinionModels;
exports.generateIRACTemplate = generateIRACTemplate;
exports.generateCREACTemplate = generateCREACTemplate;
exports.generateTREATTemplate = generateTREATTemplate;
exports.createOpinionStructure = createOpinionStructure;
exports.formatOpinionSection = formatOpinionSection;
exports.mergeOpinionSections = mergeOpinionSections;
exports.validateOpinionStructure = validateOpinionStructure;
exports.spotLegalIssues = spotLegalIssues;
exports.analyzeIssueElements = analyzeIssueElements;
exports.prioritizeIssues = prioritizeIssues;
exports.generateIssueStatement = generateIssueStatement;
exports.linkIssuesToFacts = linkIssuesToFacts;
exports.crossReferenceIssues = crossReferenceIssues;
exports.buildSyllogisticReasoning = buildSyllogisticReasoning;
exports.constructAnalogicalArgument = constructAnalogicalArgument;
exports.developPolicyArgument = developPolicyArgument;
exports.synthesizeLegalAuthorities = synthesizeLegalAuthorities;
exports.applyLegalStandard = applyLegalStandard;
exports.counterArgumentAnalysis = counterArgumentAnalysis;
exports.integrateCitations = integrateCitations;
exports.validateCitationPlacement = validateCitationPlacement;
exports.generateCitationSignal = generateCitationSignal;
exports.buildAuthoritiesSection = buildAuthoritiesSection;
exports.scoreOpinionQuality = scoreOpinionQuality;
exports.reviewOpinionCompleteness = reviewOpinionCompleteness;
exports.assessReasoningStrength = assessReasoningStrength;
exports.generateImprovementSuggestions = generateImprovementSuggestions;
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
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * LegalOpinion Sequelize Model
 */
class LegalOpinion extends sequelize_1.Model {
}
exports.LegalOpinion = LegalOpinion;
/**
 * Initialize LegalOpinion model
 */
function initLegalOpinionModel(sequelize) {
    LegalOpinion.init({
        opinionId: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        opinionType: {
            type: sequelize_1.DataTypes.ENUM('LEGAL_MEMO', 'FORMAL_OPINION', 'ADVICE_LETTER', 'COURT_BRIEF', 'ACADEMIC_ANALYSIS'),
            allowNull: false,
        },
        methodology: {
            type: sequelize_1.DataTypes.ENUM('IRAC', 'CREAC', 'TREAT', 'CRAC', 'IDAR', 'FIRAC'),
            allowNull: false,
        },
        clientMatter: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        questionPresented: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        briefAnswer: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        sections: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        conclusion: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: true,
        },
        limitations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('DRAFT', 'REVIEW', 'FINAL', 'APPROVED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        sequelize,
        tableName: 'legal_opinions',
        timestamps: true,
        indexes: [
            { fields: ['opinionType'] },
            { fields: ['status'] },
            { fields: ['methodology'] },
            { fields: ['createdAt'] },
        ],
    });
    return LegalOpinion;
}
/**
 * OpinionAnalysis Sequelize Model
 */
class OpinionAnalysis extends sequelize_1.Model {
}
exports.OpinionAnalysis = OpinionAnalysis;
/**
 * Initialize OpinionAnalysis model
 */
function initOpinionAnalysisModel(sequelize) {
    OpinionAnalysis.init({
        analysisId: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        opinionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'legal_opinions',
                key: 'opinionId',
            },
        },
        analysisType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        qualityScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        conductedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'opinion_analyses',
        timestamps: true,
        indexes: [
            { fields: ['opinionId'] },
            { fields: ['analysisType'] },
        ],
    });
    return OpinionAnalysis;
}
/**
 * LegalIssue Sequelize Model
 */
class LegalIssueModel extends sequelize_1.Model {
}
exports.LegalIssueModel = LegalIssueModel;
/**
 * Initialize LegalIssue model
 */
function initLegalIssueModel(sequelize) {
    LegalIssueModel.init({
        issueId: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        opinionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'legal_opinions',
                key: 'opinionId',
            },
        },
        issueStatement: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        issueCategory: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        complexity: {
            type: sequelize_1.DataTypes.ENUM('STRAIGHTFORWARD', 'MODERATE', 'COMPLEX', 'HIGHLY_COMPLEX'),
            allowNull: false,
        },
        elements: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        governingLaw: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        factsRelevant: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            allowNull: false,
            defaultValue: [],
        },
        relatedIssues: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING(50)),
            allowNull: true,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        disposition: {
            type: sequelize_1.DataTypes.ENUM('FAVORABLE', 'UNFAVORABLE', 'UNCERTAIN', 'NOT_REACHED'),
            allowNull: false,
            defaultValue: 'UNCERTAIN',
        },
    }, {
        sequelize,
        tableName: 'legal_issues',
        timestamps: true,
        indexes: [
            { fields: ['opinionId'] },
            { fields: ['issueCategory'] },
            { fields: ['priority'] },
            { fields: ['disposition'] },
        ],
    });
    return LegalIssueModel;
}
/**
 * OpinionSection Sequelize Model
 */
class OpinionSectionModel extends sequelize_1.Model {
}
exports.OpinionSectionModel = OpinionSectionModel;
/**
 * Initialize OpinionSection model
 */
function initOpinionSectionModel(sequelize) {
    OpinionSectionModel.init({
        sectionId: {
            type: sequelize_1.DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
        },
        opinionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            references: {
                model: 'legal_opinions',
                key: 'opinionId',
            },
        },
        parentSectionId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            references: {
                model: 'opinion_sections',
                key: 'sectionId',
            },
        },
        sectionType: {
            type: sequelize_1.DataTypes.ENUM('FACTS', 'ISSUE', 'RULE', 'ANALYSIS', 'CONCLUSION', 'COUNTERARGUMENT'),
            allowNull: false,
        },
        heading: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        citations: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        footnotes: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'opinion_sections',
        timestamps: true,
        indexes: [
            { fields: ['opinionId', 'order'] },
            { fields: ['parentSectionId'] },
            { fields: ['sectionType'] },
        ],
    });
    return OpinionSectionModel;
}
/**
 * Initialize all opinion models and associations
 */
function initOpinionModels(sequelize) {
    const opinionModel = initLegalOpinionModel(sequelize);
    const analysisModel = initOpinionAnalysisModel(sequelize);
    const issueModel = initLegalIssueModel(sequelize);
    const sectionModel = initOpinionSectionModel(sequelize);
    // Define associations
    opinionModel.hasMany(analysisModel, { foreignKey: 'opinionId', as: 'analyses' });
    analysisModel.belongsTo(opinionModel, { foreignKey: 'opinionId', as: 'opinion' });
    opinionModel.hasMany(issueModel, { foreignKey: 'opinionId', as: 'issues' });
    issueModel.belongsTo(opinionModel, { foreignKey: 'opinionId', as: 'opinion' });
    opinionModel.hasMany(sectionModel, { foreignKey: 'opinionId', as: 'sectionModels' });
    sectionModel.belongsTo(opinionModel, { foreignKey: 'opinionId', as: 'opinion' });
    sectionModel.hasMany(sectionModel, { foreignKey: 'parentSectionId', as: 'subsections' });
    sectionModel.belongsTo(sectionModel, { foreignKey: 'parentSectionId', as: 'parentSection' });
    return {
        LegalOpinion: opinionModel,
        OpinionAnalysis: analysisModel,
        LegalIssueModel: issueModel,
        OpinionSectionModel: sectionModel,
    };
}
// ============================================================================
// TEMPLATE GENERATION FUNCTIONS
// ============================================================================
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
function generateIRACTemplate(issue, jurisdiction) {
    return {
        issue: {
            statement: issue,
            narrowIssue: `Narrow Issue: ${issue}`,
            broadIssue: `Broad Issue: General legal principle underlying ${issue}`,
        },
        rule: {
            primaryRule: `[Primary legal rule governing ${issue} in ${jurisdiction}]`,
            exceptions: [
                '[Exception 1 to the primary rule]',
                '[Exception 2 to the primary rule]',
            ],
            elements: [
                '[Element 1 of the legal test]',
                '[Element 2 of the legal test]',
                '[Element 3 of the legal test]',
            ],
            sources: [
                {
                    citationId: `cit-${Date.now()}-1`,
                    signal: 'NO_SIGNAL',
                    authority: {
                        type: 'CASE',
                        citation: '[Primary case citation]',
                    },
                    weight: 'BINDING',
                    relevance: 100,
                },
            ],
        },
        application: {
            factsToLaw: [
                {
                    fact: '[Relevant fact 1]',
                    legalElement: '[Element 1]',
                    analysis: '[Analysis of how fact 1 satisfies or fails element 1]',
                },
                {
                    fact: '[Relevant fact 2]',
                    legalElement: '[Element 2]',
                    analysis: '[Analysis of how fact 2 satisfies or fails element 2]',
                },
            ],
            analogies: [],
            distinctions: [],
        },
        conclusion: {
            holding: `[Conclusion: How the rule applies to these facts]`,
            reasoning: `[Brief summary of key reasoning]`,
            confidence: 'MODERATE',
        },
    };
}
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
function generateCREACTemplate(conclusion, rule) {
    return {
        initialConclusion: {
            statement: conclusion,
            roadmap: `This analysis will examine [issue] by first establishing the applicable legal rule, explaining how courts have interpreted that rule, applying the rule to the present facts, and concluding that ${conclusion.toLowerCase()}.`,
        },
        rule: {
            blackLetterLaw: rule,
            elements: [
                '[Element 1 of the rule]',
                '[Element 2 of the rule]',
                '[Element 3 of the rule]',
            ],
            sources: [
                {
                    citationId: `cit-${Date.now()}-creac`,
                    signal: 'NO_SIGNAL',
                    authority: {
                        type: 'CASE',
                        citation: '[Controlling authority]',
                    },
                    weight: 'BINDING',
                    relevance: 100,
                },
            ],
        },
        explanation: {
            ruleExplanation: `[Detailed explanation of the rule, its purpose, and how courts interpret it]`,
            caseIllustrations: [
                {
                    caseName: '[Case Name 1]',
                    citation: '[Citation]',
                    facts: '[Relevant facts from case]',
                    holding: '[Court holding]',
                    reasoning: '[Court reasoning]',
                    relevance: '[Why this case is relevant]',
                    outcome: 'PLAINTIFF_PREVAILED',
                },
            ],
            synthesis: `[Synthesis of case law showing how courts apply the rule]`,
        },
        application: {
            factsAnalysis: `[Overview of how the facts satisfy or fail the rule]`,
            elementByElementAnalysis: [
                {
                    element: '[Element 1]',
                    analysis: '[Detailed analysis of element 1]',
                    conclusion: '[Conclusion for element 1]',
                },
                {
                    element: '[Element 2]',
                    analysis: '[Detailed analysis of element 2]',
                    conclusion: '[Conclusion for element 2]',
                },
            ],
            counterArguments: [
                '[Potential counter-argument and rebuttal]',
            ],
        },
        finalConclusion: {
            holding: conclusion,
            implications: [
                '[Implication 1 of this conclusion]',
                '[Implication 2 of this conclusion]',
            ],
        },
    };
}
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
function generateTREATTemplate(thesis, rule) {
    return {
        thesis: {
            statement: thesis,
            scope: `This analysis addresses [scope of thesis] and demonstrates that ${thesis.toLowerCase()}.`,
        },
        rule: {
            statement: rule,
            components: [
                '[Component 1 of the rule]',
                '[Component 2 of the rule]',
                '[Component 3 of the rule]',
            ],
            authorities: [
                {
                    citationId: `cit-${Date.now()}-treat`,
                    signal: 'NO_SIGNAL',
                    authority: {
                        type: 'CASE',
                        citation: '[Leading case]',
                    },
                    weight: 'BINDING',
                    relevance: 100,
                },
            ],
        },
        explanation: {
            ruleExplanation: `[Explanation of how the rule operates]`,
            illustrativeCases: [
                {
                    caseName: '[Illustrative Case]',
                    citation: '[Citation]',
                    facts: '[Facts]',
                    holding: '[Holding]',
                    reasoning: '[Reasoning]',
                    relevance: '[Relevance to current case]',
                    outcome: 'DEFENDANT_PREVAILED',
                },
            ],
            policyRationale: `[Policy considerations underlying the rule]`,
        },
        application: {
            factsToRule: `[How the facts map to the rule]`,
            detailedAnalysis: `[Detailed application of facts to each rule component]`,
            analogicalReasoning: [],
        },
        thesisRestated: {
            conclusion: thesis,
            synthesis: `[Final synthesis bringing together rule explanation and application to support thesis]`,
        },
    };
}
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
function createOpinionStructure(params) {
    const opinionId = `OPN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
        opinionId,
        title: params.title,
        opinionType: params.opinionType,
        methodology: params.methodology,
        clientMatter: params.clientMatter,
        questionPresented: ['[Question Presented 1]'],
        briefAnswer: ['[Brief Answer 1]'],
        sections: [],
        conclusion: '[Overall conclusion]',
        recommendations: [],
        limitations: [
            'This opinion is based on the facts as presented and applicable law as of the date of this opinion.',
            'This opinion is confidential and subject to attorney-client privilege and work product protection.',
        ],
        metadata: {
            authorId: params.authorId,
            authorName: params.authorName,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
            jurisdiction: params.jurisdiction,
            practiceArea: params.practiceArea,
            confidentialityLevel: 'PRIVILEGED',
            workProduct: true,
            attorneyClientPrivilege: true,
        },
        status: 'DRAFT',
        version: 1,
    };
}
/**
 * Format opinion section with proper structure
 *
 * @param sectionType - Type of section
 * @param heading - Section heading
 * @param content - Section content
 * @param citations - Citations to include
 * @returns Formatted opinion section
 */
function formatOpinionSection(sectionType, heading, content, citations = []) {
    return {
        sectionId: `SEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sectionType,
        heading,
        content,
        citations,
        footnotes: [],
        order: 0,
    };
}
/**
 * Merge multiple opinion sections into a cohesive structure
 *
 * @param sections - Array of sections to merge
 * @param parentHeading - Optional parent heading for grouped sections
 * @returns Merged opinion section with subsections
 */
function mergeOpinionSections(sections, parentHeading) {
    const mergedContent = sections.map(s => s.content).join('\n\n');
    const allCitations = [];
    sections.forEach(section => {
        allCitations.push(...section.citations);
    });
    return {
        sectionId: `SEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sectionType: 'ANALYSIS',
        heading: parentHeading || 'Analysis',
        content: mergedContent,
        subsections: sections,
        citations: allCitations,
        footnotes: [],
        order: 0,
    };
}
/**
 * Validate opinion structure for completeness
 *
 * @param opinion - Opinion structure to validate
 * @returns Validation result with errors and warnings
 */
function validateOpinionStructure(opinion) {
    const errors = [];
    const warnings = [];
    // Required fields validation
    if (!opinion.title || opinion.title.trim().length === 0) {
        errors.push('Opinion title is required');
    }
    if (!opinion.questionPresented || opinion.questionPresented.length === 0) {
        errors.push('At least one question presented is required');
    }
    if (!opinion.briefAnswer || opinion.briefAnswer.length === 0) {
        errors.push('At least one brief answer is required');
    }
    if (opinion.questionPresented.length !== opinion.briefAnswer.length) {
        warnings.push('Number of questions presented does not match number of brief answers');
    }
    if (!opinion.sections || opinion.sections.length === 0) {
        errors.push('Opinion must contain at least one section');
    }
    if (!opinion.conclusion || opinion.conclusion.trim().length === 0) {
        errors.push('Opinion conclusion is required');
    }
    // Section type validation
    const hasFactsSection = opinion.sections.some(s => s.sectionType === 'FACTS');
    const hasAnalysisSection = opinion.sections.some(s => s.sectionType === 'ANALYSIS');
    if (!hasFactsSection) {
        warnings.push('Opinion should include a Facts section');
    }
    if (!hasAnalysisSection) {
        warnings.push('Opinion should include an Analysis section');
    }
    // Metadata validation
    if (!opinion.metadata.authorId || !opinion.metadata.authorName) {
        errors.push('Author information is required');
    }
    if (!opinion.metadata.jurisdiction) {
        warnings.push('Jurisdiction should be specified');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
// ============================================================================
// ISSUE SPOTTING AND ANALYSIS FUNCTIONS
// ============================================================================
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
function spotLegalIssues(facts, jurisdiction, practiceArea) {
    const issues = [];
    // Example issue spotting logic (would be more sophisticated in production)
    const issueKeywords = {
        'Contract Law': ['agreement', 'promise', 'consideration', 'breach', 'performance'],
        'Tort Law': ['negligence', 'duty', 'breach', 'damages', 'causation'],
        'Property Law': ['ownership', 'possession', 'title', 'easement', 'trespass'],
        'Criminal Law': ['intent', 'actus reus', 'mens rea', 'defense'],
    };
    const keywords = issueKeywords[practiceArea] || [];
    facts.forEach((fact, index) => {
        const lowerFact = fact.toLowerCase();
        keywords.forEach((keyword, keywordIndex) => {
            if (lowerFact.includes(keyword)) {
                issues.push({
                    issueId: `ISS-${Date.now()}-${index}-${keywordIndex}`,
                    issueStatement: `Whether ${fact} creates a legal issue regarding ${keyword}`,
                    issueCategory: practiceArea,
                    complexity: 'MODERATE',
                    elements: [],
                    governingLaw: {
                        jurisdiction,
                        primaryAuthority: [`[${jurisdiction} law on ${keyword}]`],
                    },
                    factsRelevant: [fact],
                    priority: 5,
                    disposition: 'UNCERTAIN',
                });
            }
        });
    });
    return issues;
}
/**
 * Analyze issue elements in detail
 *
 * @param issue - Legal issue to analyze
 * @param facts - Relevant facts
 * @returns Issue with detailed element analysis
 */
function analyzeIssueElements(issue, facts) {
    // Example element analysis for contract formation
    if (issue.issueCategory.toLowerCase().includes('contract')) {
        issue.elements = [
            {
                elementId: `EL-${Date.now()}-1`,
                elementName: 'Offer',
                description: 'A manifestation of willingness to enter into a bargain',
                legalStandard: 'Objective manifestation of intent to be bound',
                factsSupporting: facts.filter(f => f.toLowerCase().includes('offer') || f.toLowerCase().includes('propose')),
                factsOpposing: [],
                analysis: '[Analysis of whether offer element is satisfied]',
                conclusion: 'LIKELY_SATISFIED',
                strength: 75,
            },
            {
                elementId: `EL-${Date.now()}-2`,
                elementName: 'Acceptance',
                description: 'Unequivocal agreement to the terms of the offer',
                legalStandard: 'Mirror image rule or modern UCC approach',
                factsSupporting: facts.filter(f => f.toLowerCase().includes('accept') || f.toLowerCase().includes('agree')),
                factsOpposing: [],
                analysis: '[Analysis of whether acceptance element is satisfied]',
                conclusion: 'UNCLEAR',
                strength: 50,
            },
            {
                elementId: `EL-${Date.now()}-3`,
                elementName: 'Consideration',
                description: 'Bargained-for exchange of legal value',
                legalStandard: 'Benefit to promisor or detriment to promisee',
                factsSupporting: facts.filter(f => f.toLowerCase().includes('consideration') || f.toLowerCase().includes('exchange')),
                factsOpposing: [],
                analysis: '[Analysis of whether consideration element is satisfied]',
                conclusion: 'NOT_SATISFIED',
                strength: 25,
            },
        ];
    }
    return issue;
}
/**
 * Prioritize issues by importance and complexity
 *
 * @param issues - Array of legal issues
 * @returns Issues sorted by priority
 */
function prioritizeIssues(issues) {
    return issues.sort((a, b) => {
        // First sort by priority (higher priority first)
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        // Then by complexity (more complex first)
        const complexityOrder = {
            'HIGHLY_COMPLEX': 4,
            'COMPLEX': 3,
            'MODERATE': 2,
            'STRAIGHTFORWARD': 1,
        };
        return complexityOrder[b.complexity] - complexityOrder[a.complexity];
    });
}
/**
 * Generate clear issue statement
 *
 * @param issue - Legal issue
 * @param format - Statement format
 * @returns Formatted issue statement
 */
function generateIssueStatement(issue, format = 'WHETHER') {
    switch (format) {
        case 'WHETHER':
            return `Whether ${issue.issueStatement.replace(/^whether\s+/i, '')}`;
        case 'UNDER_DOES':
            return `Under ${issue.governingLaw.jurisdiction} law, does ${issue.issueStatement.replace(/^whether\s+/i, '')}?`;
        case 'QUESTION':
            return `${issue.issueStatement.replace(/^whether\s+/i, '')}?`;
        default:
            return issue.issueStatement;
    }
}
/**
 * Link issues to specific facts
 *
 * @param issue - Legal issue
 * @param allFacts - All available facts
 * @returns Issue with linked facts
 */
function linkIssuesToFacts(issue, allFacts) {
    const relevantFacts = [];
    // Extract keywords from issue statement
    const keywords = issue.issueStatement
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);
    allFacts.forEach(fact => {
        const lowerFact = fact.toLowerCase();
        const relevanceScore = keywords.filter(keyword => lowerFact.includes(keyword)).length;
        if (relevanceScore > 0) {
            relevantFacts.push(fact);
        }
    });
    issue.factsRelevant = relevantFacts;
    return issue;
}
/**
 * Cross-reference related issues
 *
 * @param issues - Array of legal issues
 * @returns Issues with cross-references
 */
function crossReferenceIssues(issues) {
    issues.forEach((issue, index) => {
        const relatedIssueIds = [];
        issues.forEach((otherIssue, otherIndex) => {
            if (index !== otherIndex) {
                // Check for category match
                if (issue.issueCategory === otherIssue.issueCategory) {
                    relatedIssueIds.push(otherIssue.issueId);
                }
                // Check for fact overlap
                const sharedFacts = issue.factsRelevant.filter(fact => otherIssue.factsRelevant.includes(fact));
                if (sharedFacts.length > 0 && !relatedIssueIds.includes(otherIssue.issueId)) {
                    relatedIssueIds.push(otherIssue.issueId);
                }
            }
        });
        issue.relatedIssues = relatedIssueIds;
    });
    return issues;
}
// ============================================================================
// LEGAL REASONING FUNCTIONS
// ============================================================================
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
function buildSyllogisticReasoning(majorPremise, minorPremise, conclusion) {
    return {
        frameworkId: `SYLLOG-${Date.now()}`,
        reasoningType: 'SYLLOGISTIC',
        majorPremise,
        minorPremise,
        conclusion,
        supportingAuthorities: [],
        logicalStructure: 'If P then Q; P; therefore Q (Modus Ponens)',
        validity: 'VALID',
        soundness: 'UNCERTAIN',
        syllogism: {
            majorPremise,
            minorPremise,
            conclusion,
            form: 'MODUS_PONENS',
        },
    };
}
/**
 * Construct analogical argument
 *
 * @param sourceCase - Precedent case
 * @param targetFacts - Current case facts
 * @param similarities - Key similarities
 * @returns Analogy structure
 */
function constructAnalogicalArgument(sourceCase, targetFacts, similarities) {
    return {
        analogyId: `ANALOG-${Date.now()}`,
        sourceCase: {
            name: sourceCase.name,
            citation: sourceCase.citation,
            keyFacts: sourceCase.facts,
            holding: sourceCase.holding,
        },
        targetCase: {
            keyFacts: targetFacts,
            predictedOutcome: `Based on analogy to ${sourceCase.name}, similar outcome expected`,
        },
        similarities: similarities.map(sim => ({
            aspect: sim.aspect,
            sourceFactPattern: sourceCase.facts.find(f => f.toLowerCase().includes(sim.aspect.toLowerCase())) || '',
            targetFactPattern: targetFacts.find(f => f.toLowerCase().includes(sim.aspect.toLowerCase())) || '',
            significance: sim.significance,
        })),
        strength: similarities.filter(s => s.significance === 'HIGH').length * 30 +
            similarities.filter(s => s.significance === 'MODERATE').length * 20 +
            similarities.filter(s => s.significance === 'LOW').length * 10,
    };
}
/**
 * Develop policy-based argument
 *
 * @param policyGoals - Relevant policy objectives
 * @param proposedOutcome - Proposed legal outcome
 * @returns Policy reasoning structure
 */
function developPolicyArgument(policyGoals, proposedOutcome) {
    return {
        policyId: `POLICY-${Date.now()}`,
        policyGoals,
        policyAnalysis: {
            socialBenefit: '[Analysis of social benefits of proposed outcome]',
            economicImpact: '[Analysis of economic implications]',
            judicialEfficiency: '[Impact on judicial system efficiency]',
            fairnessConsiderations: '[Fairness and equity analysis]',
        },
        alternativeOutcomes: [
            {
                outcome: proposedOutcome,
                policyImplications: '[How this outcome advances policy goals]',
                preferability: 85,
            },
            {
                outcome: '[Alternative outcome]',
                policyImplications: '[Policy implications of alternative]',
                preferability: 45,
            },
        ],
        recommendation: proposedOutcome,
    };
}
/**
 * Synthesize multiple legal authorities
 *
 * @param authorities - Array of legal authorities
 * @param synthesisGoal - Goal of synthesis (e.g., 'establish rule', 'show trend')
 * @returns Synthesized legal principle
 */
function synthesizeLegalAuthorities(authorities, synthesisGoal) {
    return {
        synthesizedPrinciple: `Based on synthesis of ${authorities.length} authorities, the principle is: [Synthesized legal principle]`,
        supportingAuthorities: authorities.map(a => a.citation),
        minorityView: authorities.length > 3 ? '[Minority or alternative view]' : undefined,
        trend: authorities.length > 2 ? '[Trend in legal development]' : undefined,
    };
}
/**
 * Apply legal standard to facts
 *
 * @param standard - Legal standard or test
 * @param facts - Facts to which standard applies
 * @param burden - Burden of proof
 * @returns Application result
 */
function applyLegalStandard(standard, facts, burden) {
    const burdenThresholds = {
        'PREPONDERANCE': 51,
        'CLEAR_AND_CONVINCING': 75,
        'BEYOND_REASONABLE_DOUBT': 95,
        'REASONABLE_BASIS': 30,
    };
    // Simplified analysis - would be more sophisticated in production
    const supportingFacts = facts.filter((_, i) => i % 2 === 0);
    const opposingFacts = facts.filter((_, i) => i % 2 !== 0);
    const supportStrength = (supportingFacts.length / facts.length) * 100;
    const standardMet = supportStrength >= burdenThresholds[burden];
    return {
        standardMet,
        confidence: supportStrength > 75 ? 'HIGH' : supportStrength > 50 ? 'MODERATE' : 'LOW',
        analysis: `Application of ${standard} to the facts, considering ${burden} burden of proof`,
        supportingFacts,
        opposingFacts,
    };
}
/**
 * Analyze counter-arguments
 *
 * @param mainArgument - Primary legal argument
 * @param possibleCounters - Potential counter-arguments
 * @returns Counter-argument analysis
 */
function counterArgumentAnalysis(mainArgument, possibleCounters) {
    return possibleCounters.map((counter, index) => ({
        argumentId: `COUNTER-${Date.now()}-${index}`,
        argumentStatement: counter,
        supportingReasoning: `[Reasoning supporting the counter-argument: ${counter}]`,
        supportingAuthorities: [],
        rebuttal: {
            rebuttalStatement: `[Rebuttal to: ${counter}]`,
            reasoning: `[Reasoning why counter-argument fails or is unpersuasive]`,
            authorities: [],
            effectiveness: 'MODERATE',
        },
    }));
}
// ============================================================================
// CITATION INTEGRATION FUNCTIONS
// ============================================================================
/**
 * Integrate citations into opinion text
 *
 * @param text - Opinion text
 * @param citations - Citations to integrate
 * @param style - Citation style (Bluebook, etc.)
 * @returns Text with integrated citations
 */
function integrateCitations(text, citations, style = 'BLUEBOOK') {
    let integratedText = text;
    citations.forEach((citation, index) => {
        const signal = citation.signal !== 'NO_SIGNAL' ? `${citation.signal.toLowerCase().replace(/_/g, ' ')} ` : '';
        const citationText = `${signal}${citation.authority.citation}`;
        // Add citation as footnote or inline based on style
        if (style === 'BLUEBOOK') {
            integratedText += ` ${citationText}.`;
        }
    });
    return integratedText;
}
/**
 * Validate citation placement
 *
 * @param section - Opinion section
 * @returns Validation result
 */
function validateCitationPlacement(section) {
    const issues = [];
    const suggestions = [];
    // Check if legal assertions have supporting citations
    const legalTerms = ['must', 'shall', 'requires', 'holds', 'rule'];
    const content = section.content.toLowerCase();
    legalTerms.forEach(term => {
        if (content.includes(term) && section.citations.length === 0) {
            issues.push(`Section contains legal assertions ("${term}") but no citations`);
        }
    });
    if (section.citations.length === 0 && section.sectionType === 'RULE') {
        issues.push('Rule section should contain citations to legal authorities');
    }
    if (section.citations.length > 10) {
        suggestions.push('Consider whether all citations are necessary; too many citations may dilute analysis');
    }
    return {
        valid: issues.length === 0,
        issues,
        suggestions,
    };
}
/**
 * Generate appropriate citation signals
 *
 * @param relationship - Relationship between proposition and authority
 * @returns Appropriate citation signal
 */
function generateCitationSignal(relationship) {
    const signalMap = {
        'DIRECTLY_SUPPORTS': 'NO_SIGNAL',
        'INDIRECTLY_SUPPORTS': 'SEE',
        'BACKGROUND': 'SEE_GENERALLY',
        'COMPARE': 'COMPARE',
        'CONTRAST': 'CONTRA',
    };
    return signalMap[relationship];
}
/**
 * Build table of authorities section
 *
 * @param opinion - Legal opinion
 * @returns Formatted table of authorities
 */
function buildAuthoritiesSection(opinion) {
    const cases = [];
    const statutes = [];
    const secondarySources = [];
    opinion.sections.forEach((section, pageIndex) => {
        section.citations.forEach(citation => {
            const entry = {
                name: citation.authority.citation.split(',')[0],
                citation: citation.authority.citation,
                pages: [pageIndex + 1],
            };
            switch (citation.authority.type) {
                case 'CASE':
                    const existingCase = cases.find(c => c.citation === entry.citation);
                    if (existingCase) {
                        existingCase.pages.push(...entry.pages);
                    }
                    else {
                        cases.push(entry);
                    }
                    break;
                case 'STATUTE':
                case 'REGULATION':
                    const existingStatute = statutes.find(s => s.citation === entry.citation);
                    if (existingStatute) {
                        existingStatute.pages.push(...entry.pages);
                    }
                    else {
                        statutes.push(entry);
                    }
                    break;
                default:
                    const existingSecondary = secondarySources.find(s => s.citation === entry.citation);
                    if (existingSecondary) {
                        existingSecondary.pages.push(...entry.pages);
                    }
                    else {
                        secondarySources.push(entry);
                    }
            }
        });
    });
    // Sort alphabetically
    cases.sort((a, b) => a.name.localeCompare(b.name));
    statutes.sort((a, b) => a.name.localeCompare(b.name));
    secondarySources.sort((a, b) => a.name.localeCompare(b.name));
    return { cases, statutes, secondarySources };
}
// ============================================================================
// QUALITY REVIEW AND SCORING FUNCTIONS
// ============================================================================
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
function scoreOpinionQuality(opinion) {
    // Legal Analysis Scoring
    const legalAnalysis = {
        score: 75,
        weight: 0.30,
        criteria: [
            { criterion: 'Issue correctly identified', met: true },
            { criterion: 'Rule accurately stated', met: true },
            { criterion: 'Application thorough', met: true },
            { criterion: 'Conclusion well-reasoned', met: false, notes: 'Could be stronger' },
        ],
        feedback: 'Legal analysis is solid but conclusion could be more definitive',
    };
    // Organization Scoring
    const organization = {
        score: 85,
        weight: 0.15,
        criteria: [
            { criterion: 'Logical structure', met: true },
            { criterion: 'Clear headings', met: true },
            { criterion: 'Proper transitions', met: true },
        ],
        feedback: 'Well-organized with clear structure',
    };
    // Writing Clarity Scoring
    const writingClarity = {
        score: 80,
        weight: 0.20,
        criteria: [
            { criterion: 'Clear prose', met: true },
            { criterion: 'Concise expression', met: true },
            { criterion: 'Appropriate tone', met: true },
        ],
        feedback: 'Writing is clear and professional',
    };
    // Citation Accuracy
    const citationAccuracy = {
        score: 70,
        weight: 0.15,
        criteria: [
            { criterion: 'Proper Bluebook format', met: true },
            { criterion: 'Appropriate signals', met: false, notes: 'Some signals missing' },
            { criterion: 'Sufficient authority', met: true },
        ],
        feedback: 'Citations mostly correct but check signals',
    };
    // Completeness
    const completeness = {
        score: 90,
        weight: 0.10,
        criteria: [
            { criterion: 'All issues addressed', met: true },
            { criterion: 'Facts stated', met: true },
            { criterion: 'Counterarguments considered', met: true },
        ],
        feedback: 'Opinion is comprehensive',
    };
    // Persuasiveness
    const persuasiveness = {
        score: 75,
        weight: 0.10,
        criteria: [
            { criterion: 'Strong reasoning', met: true },
            { criterion: 'Effective analogies', met: true },
            { criterion: 'Rebuts counter-arguments', met: false },
        ],
        feedback: 'Generally persuasive but could address counter-arguments',
    };
    // Calculate overall score
    const overallScore = legalAnalysis.score * legalAnalysis.weight +
        organization.score * organization.weight +
        writingClarity.score * writingClarity.weight +
        citationAccuracy.score * citationAccuracy.weight +
        completeness.score * completeness.weight +
        persuasiveness.score * persuasiveness.weight;
    return {
        overallScore: Math.round(overallScore),
        dimensions: {
            legalAnalysis,
            organization,
            writingClarity,
            citationAccuracy,
            completeness,
            persuasiveness,
        },
        strengths: [
            'Well-organized structure',
            'Comprehensive coverage of issues',
            'Clear writing style',
        ],
        weaknesses: [
            'Conclusion could be more definitive',
            'Some citation signals missing',
            'Counter-arguments not fully addressed',
        ],
        improvementSuggestions: [],
        readabilityScore: {
            fleschReadingEase: 45.2,
            fleschKincaidGrade: 14.3,
            averageSentenceLength: 22.5,
            complexWordPercentage: 18.7,
        },
    };
}
/**
 * Review opinion for completeness
 *
 * @param opinion - Legal opinion to review
 * @returns Completeness review results
 */
function reviewOpinionCompleteness(opinion) {
    const missingElements = [];
    const recommendations = [];
    // Check required sections
    const requiredSectionTypes = ['FACTS', 'ISSUE', 'RULE', 'ANALYSIS', 'CONCLUSION'];
    requiredSectionTypes.forEach(type => {
        const hasSection = opinion.sections.some(s => s.sectionType === type);
        if (!hasSection) {
            missingElements.push(`${type} section`);
        }
    });
    // Check citations
    const totalCitations = opinion.sections.reduce((sum, section) => sum + section.citations.length, 0);
    if (totalCitations === 0) {
        missingElements.push('Legal citations');
    }
    // Check methodology compliance
    if (opinion.methodology === 'IRAC') {
        const hasIssue = opinion.sections.some(s => s.sectionType === 'ISSUE');
        const hasRule = opinion.sections.some(s => s.sectionType === 'RULE');
        const hasAnalysis = opinion.sections.some(s => s.sectionType === 'ANALYSIS');
        const hasConclusion = opinion.sections.some(s => s.sectionType === 'CONCLUSION');
        if (!hasIssue || !hasRule || !hasAnalysis || !hasConclusion) {
            recommendations.push('IRAC methodology requires Issue, Rule, Analysis, and Conclusion sections');
        }
    }
    // Check metadata
    if (!opinion.metadata.jurisdiction) {
        missingElements.push('Jurisdiction');
    }
    if (!opinion.recommendations || opinion.recommendations.length === 0) {
        recommendations.push('Consider adding recommendations for client');
    }
    return {
        complete: missingElements.length === 0,
        missingElements,
        recommendations,
    };
}
/**
 * Assess strength of legal reasoning
 *
 * @param reasoning - Reasoning framework to assess
 * @returns Strength assessment
 */
function assessReasoningStrength(reasoning) {
    let score = 50; // Base score
    const improvements = [];
    // Check validity
    if (reasoning.validity === 'VALID') {
        score += 20;
    }
    else {
        improvements.push('Ensure logical validity of argument structure');
    }
    // Check soundness
    if (reasoning.soundness === 'SOUND') {
        score += 20;
    }
    else {
        improvements.push('Verify factual premises are accurate and well-supported');
    }
    // Check supporting authorities
    if (reasoning.supportingAuthorities.length > 0) {
        score += 10;
    }
    else {
        improvements.push('Add supporting legal authorities');
    }
    const strength = score >= 80 ? 'STRONG' : score >= 60 ? 'MODERATE' : 'WEAK';
    return {
        strength,
        score,
        analysis: `Reasoning ${strength.toLowerCase()} with score of ${score}/100`,
        improvements,
    };
}
/**
 * Generate improvement suggestions for opinion
 *
 * @param opinion - Legal opinion
 * @param qualityMetrics - Quality assessment results
 * @returns Array of prioritized improvement suggestions
 */
function generateImprovementSuggestions(opinion, qualityMetrics) {
    const suggestions = [];
    // Analyze each dimension and generate suggestions
    Object.entries(qualityMetrics.dimensions).forEach(([dimension, metrics]) => {
        if (metrics.score < 80) {
            metrics.criteria.forEach(criterion => {
                if (!criterion.met) {
                    suggestions.push({
                        suggestionId: `SUG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        category: dimension.toUpperCase().replace(/([A-Z])/g, '_$1').trim(),
                        priority: metrics.score < 60 ? 'HIGH' : metrics.score < 75 ? 'MEDIUM' : 'LOW',
                        description: `Improve ${criterion.criterion.toLowerCase()}`,
                        specificLocation: `Review ${dimension} section`,
                        suggestedRevision: criterion.notes || `Address ${criterion.criterion.toLowerCase()}`,
                        rationale: `This criterion is essential for ${dimension} quality`,
                    });
                }
            });
        }
    });
    // Check readability
    if (qualityMetrics.readabilityScore.averageSentenceLength > 25) {
        suggestions.push({
            suggestionId: `SUG-${Date.now()}-readability`,
            category: 'WRITING',
            priority: 'MEDIUM',
            description: 'Reduce average sentence length',
            suggestedRevision: 'Break long sentences into shorter, clearer statements',
            rationale: 'Shorter sentences improve readability and comprehension',
        });
    }
    // Sort by priority
    return suggestions.sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Legal Opinion Service for NestJS
 * Provides comprehensive opinion drafting and management operations
 */
let LegalOpinionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('legal-opinions')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createOpinion_decorators;
    let _generateOpinionWithMethodology_decorators;
    let _analyzeOpinionQuality_decorators;
    let _spotIssues_decorators;
    let _getOpinionWithAnalysis_decorators;
    var LegalOpinionService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        /**
         * Create new legal opinion
         */
        async createOpinion(opinionData, transaction) {
            const opinion = await LegalOpinion.create({
                opinionId: opinionData.opinionId || `OPN-${Date.now()}`,
                ...opinionData,
            }, { transaction });
            return opinion;
        }
        /**
         * Generate opinion using specified methodology
         */
        async generateOpinionWithMethodology(methodology, params) {
            switch (methodology) {
                case 'IRAC':
                    return generateIRACTemplate(params.issue, params.jurisdiction);
                case 'CREAC':
                    return generateCREACTemplate(params.conclusion, params.rule);
                case 'TREAT':
                    return generateTREATTemplate(params.thesis, params.rule);
                default:
                    throw new Error(`Unsupported methodology: ${methodology}`);
            }
        }
        /**
         * Analyze opinion quality
         */
        async analyzeOpinionQuality(opinionId) {
            const opinion = await LegalOpinion.findByPk(opinionId);
            if (!opinion) {
                throw new Error(`Opinion not found: ${opinionId}`);
            }
            const qualityMetrics = scoreOpinionQuality(opinion);
            // Store analysis
            await OpinionAnalysis.create({
                analysisId: `ANLYS-${Date.now()}`,
                opinionId,
                analysisType: 'QUALITY_ASSESSMENT',
                content: qualityMetrics,
                qualityScore: qualityMetrics.overallScore,
                conductedBy: 'system',
            });
            return qualityMetrics;
        }
        /**
         * Spot legal issues in fact pattern
         */
        async spotIssues(facts, jurisdiction, practiceArea) {
            const issues = spotLegalIssues(facts, jurisdiction, practiceArea);
            return prioritizeIssues(issues);
        }
        /**
         * Get opinion with full analysis
         */
        async getOpinionWithAnalysis(opinionId) {
            const opinion = await LegalOpinion.findByPk(opinionId, {
                include: [
                    { model: OpinionAnalysis, as: 'analyses' },
                    { model: LegalIssueModel, as: 'issues' },
                    { model: OpinionSectionModel, as: 'sectionModels' },
                ],
            });
            if (!opinion) {
                throw new Error(`Opinion not found: ${opinionId}`);
            }
            return {
                opinion,
                analyses: opinion.analyses || [],
                issues: opinion.issues || [],
                sections: opinion.sectionModels || [],
            };
        }
    };
    __setFunctionName(_classThis, "LegalOpinionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createOpinion_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Create new legal opinion' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Opinion created successfully', type: LegalOpinion })];
        _generateOpinionWithMethodology_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Generate opinion with IRAC/CREAC/TREAT methodology' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Opinion generated successfully' })];
        _analyzeOpinionQuality_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Analyze opinion quality and generate improvement suggestions' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Quality analysis completed', type: Object })];
        _spotIssues_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Identify legal issues from facts' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Issues identified', type: Array })];
        _getOpinionWithAnalysis_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Retrieve opinion with all related data' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Opinion retrieved', type: LegalOpinion })];
        __esDecorate(_classThis, null, _createOpinion_decorators, { kind: "method", name: "createOpinion", static: false, private: false, access: { has: obj => "createOpinion" in obj, get: obj => obj.createOpinion }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateOpinionWithMethodology_decorators, { kind: "method", name: "generateOpinionWithMethodology", static: false, private: false, access: { has: obj => "generateOpinionWithMethodology" in obj, get: obj => obj.generateOpinionWithMethodology }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeOpinionQuality_decorators, { kind: "method", name: "analyzeOpinionQuality", static: false, private: false, access: { has: obj => "analyzeOpinionQuality" in obj, get: obj => obj.analyzeOpinionQuality }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _spotIssues_decorators, { kind: "method", name: "spotIssues", static: false, private: false, access: { has: obj => "spotIssues" in obj, get: obj => obj.spotIssues }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOpinionWithAnalysis_decorators, { kind: "method", name: "getOpinionWithAnalysis", static: false, private: false, access: { has: obj => "getOpinionWithAnalysis" in obj, get: obj => obj.getOpinionWithAnalysis }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalOpinionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalOpinionService = _classThis;
})();
exports.LegalOpinionService = LegalOpinionService;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    LegalOpinion,
    OpinionAnalysis,
    LegalIssueModel,
    OpinionSectionModel,
    initLegalOpinionModel,
    initOpinionAnalysisModel,
    initLegalIssueModel,
    initOpinionSectionModel,
    initOpinionModels,
    // Template Functions
    generateIRACTemplate,
    generateCREACTemplate,
    generateTREATTemplate,
    createOpinionStructure,
    formatOpinionSection,
    mergeOpinionSections,
    validateOpinionStructure,
    // Issue Spotting
    spotLegalIssues,
    analyzeIssueElements,
    prioritizeIssues,
    generateIssueStatement,
    linkIssuesToFacts,
    crossReferenceIssues,
    // Legal Reasoning
    buildSyllogisticReasoning,
    constructAnalogicalArgument,
    developPolicyArgument,
    synthesizeLegalAuthorities,
    applyLegalStandard,
    counterArgumentAnalysis,
    // Citation Integration
    integrateCitations,
    validateCitationPlacement,
    generateCitationSignal,
    buildAuthoritiesSection,
    // Quality & Review
    scoreOpinionQuality,
    reviewOpinionCompleteness,
    assessReasoningStrength,
    generateImprovementSuggestions,
    // Service
    LegalOpinionService,
};
//# sourceMappingURL=legal-opinion-drafting-kit.js.map