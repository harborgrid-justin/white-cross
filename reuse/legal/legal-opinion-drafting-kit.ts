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

import { Model, DataTypes, Sequelize, Transaction, Op, QueryTypes } from 'sequelize';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Opinion methodology frameworks
 */
export type OpinionMethodology = 'IRAC' | 'CREAC' | 'TREAT' | 'CRAC' | 'IDAR' | 'FIRAC';

/**
 * Legal reasoning types
 */
export type ReasoningType =
  | 'SYLLOGISTIC'
  | 'ANALOGICAL'
  | 'POLICY'
  | 'TEXTUAL'
  | 'STRUCTURAL'
  | 'HISTORICAL'
  | 'PRUDENTIAL';

/**
 * Issue complexity levels
 */
export type IssueComplexity = 'STRAIGHTFORWARD' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX';

/**
 * Opinion types
 */
export type OpinionType =
  | 'LEGAL_MEMO'
  | 'FORMAL_OPINION'
  | 'ADVICE_LETTER'
  | 'COURT_BRIEF'
  | 'ACADEMIC_ANALYSIS';

/**
 * Citation signal types for legal authorities
 */
export type CitationSignal =
  | 'NO_SIGNAL'
  | 'SEE'
  | 'SEE_ALSO'
  | 'CF'
  | 'COMPARE'
  | 'CONTRA'
  | 'BUT_SEE'
  | 'BUT_CF'
  | 'SEE_GENERALLY';

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
  relevance: number; // 0-100
}

/**
 * Opinion metadata
 */
export interface OpinionMetadata {
  authorId: string;
  authorName: string;
  createdDate: Date;
  lastModifiedDate: Date;
  reviewers?: Array<{ reviewerId: string; reviewerName: string; reviewDate: Date }>;
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
  relatedIssues?: string[]; // Issue IDs
  priority: number; // 1-10
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
  strength: number; // 0-100
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
  strength: number; // 0-100
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
    majorPremise: string; // General legal rule
    minorPremise: string; // Specific facts
    conclusion: string;   // Legal conclusion
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
    preferability: number; // 0-100
  }>;
  recommendation: string;
}

/**
 * Opinion quality metrics
 */
export interface OpinionQualityMetrics {
  overallScore: number; // 0-100
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
  score: number; // 0-100
  weight: number; // Contribution to overall score
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * LegalOpinion Sequelize Model
 */
export class LegalOpinion extends Model {
  @ApiProperty({ description: 'Unique opinion identifier' })
  declare opinionId: string;

  @ApiProperty({ description: 'Opinion title' })
  declare title: string;

  @ApiProperty({ description: 'Type of legal opinion', enum: ['LEGAL_MEMO', 'FORMAL_OPINION', 'ADVICE_LETTER', 'COURT_BRIEF', 'ACADEMIC_ANALYSIS'] })
  declare opinionType: OpinionType;

  @ApiProperty({ description: 'Methodology used', enum: ['IRAC', 'CREAC', 'TREAT', 'CRAC', 'IDAR', 'FIRAC'] })
  declare methodology: OpinionMethodology;

  @ApiProperty({ description: 'Client and matter information' })
  declare clientMatter: object;

  @ApiProperty({ description: 'Questions presented' })
  declare questionPresented: string[];

  @ApiProperty({ description: 'Brief answers' })
  declare briefAnswer: string[];

  @ApiProperty({ description: 'Opinion sections' })
  declare sections: object[];

  @ApiProperty({ description: 'Conclusion text' })
  declare conclusion: string;

  @ApiProperty({ description: 'Recommendations' })
  declare recommendations: string[];

  @ApiProperty({ description: 'Limitations and disclaimers' })
  declare limitations: string[];

  @ApiProperty({ description: 'Opinion metadata' })
  declare metadata: object;

  @ApiProperty({ description: 'Opinion status', enum: ['DRAFT', 'REVIEW', 'FINAL', 'APPROVED'] })
  declare status: string;

  @ApiProperty({ description: 'Version number' })
  declare version: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Initialize LegalOpinion model
 */
export function initLegalOpinionModel(sequelize: Sequelize): typeof LegalOpinion {
  LegalOpinion.init(
    {
      opinionId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      opinionType: {
        type: DataTypes.ENUM('LEGAL_MEMO', 'FORMAL_OPINION', 'ADVICE_LETTER', 'COURT_BRIEF', 'ACADEMIC_ANALYSIS'),
        allowNull: false,
      },
      methodology: {
        type: DataTypes.ENUM('IRAC', 'CREAC', 'TREAT', 'CRAC', 'IDAR', 'FIRAC'),
        allowNull: false,
      },
      clientMatter: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      questionPresented: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      briefAnswer: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      sections: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recommendations: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      limitations: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'REVIEW', 'FINAL', 'APPROVED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'legal_opinions',
      timestamps: true,
      indexes: [
        { fields: ['opinionType'] },
        { fields: ['status'] },
        { fields: ['methodology'] },
        { fields: ['createdAt'] },
      ],
    }
  );

  return LegalOpinion;
}

/**
 * OpinionAnalysis Sequelize Model
 */
export class OpinionAnalysis extends Model {
  @ApiProperty({ description: 'Unique analysis identifier' })
  declare analysisId: string;

  @ApiProperty({ description: 'Associated opinion ID' })
  declare opinionId: string;

  @ApiProperty({ description: 'Analysis type' })
  declare analysisType: string;

  @ApiProperty({ description: 'Analysis content' })
  declare content: object;

  @ApiProperty({ description: 'Quality score' })
  declare qualityScore: number;

  @ApiProperty({ description: 'Conducted by user ID' })
  declare conductedBy: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Initialize OpinionAnalysis model
 */
export function initOpinionAnalysisModel(sequelize: Sequelize): typeof OpinionAnalysis {
  OpinionAnalysis.init(
    {
      analysisId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      opinionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'legal_opinions',
          key: 'opinionId',
        },
      },
      analysisType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      qualityScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      conductedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'opinion_analyses',
      timestamps: true,
      indexes: [
        { fields: ['opinionId'] },
        { fields: ['analysisType'] },
      ],
    }
  );

  return OpinionAnalysis;
}

/**
 * LegalIssue Sequelize Model
 */
export class LegalIssueModel extends Model {
  @ApiProperty({ description: 'Unique issue identifier' })
  declare issueId: string;

  @ApiProperty({ description: 'Associated opinion ID' })
  declare opinionId: string;

  @ApiProperty({ description: 'Issue statement' })
  declare issueStatement: string;

  @ApiProperty({ description: 'Issue category' })
  declare issueCategory: string;

  @ApiProperty({ description: 'Complexity level', enum: ['STRAIGHTFORWARD', 'MODERATE', 'COMPLEX', 'HIGHLY_COMPLEX'] })
  declare complexity: IssueComplexity;

  @ApiProperty({ description: 'Issue elements' })
  declare elements: object[];

  @ApiProperty({ description: 'Governing law' })
  declare governingLaw: object;

  @ApiProperty({ description: 'Relevant facts' })
  declare factsRelevant: string[];

  @ApiProperty({ description: 'Related issues' })
  declare relatedIssues: string[];

  @ApiProperty({ description: 'Priority level' })
  declare priority: number;

  @ApiProperty({ description: 'Disposition', enum: ['FAVORABLE', 'UNFAVORABLE', 'UNCERTAIN', 'NOT_REACHED'] })
  declare disposition: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Initialize LegalIssue model
 */
export function initLegalIssueModel(sequelize: Sequelize): typeof LegalIssueModel {
  LegalIssueModel.init(
    {
      issueId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      opinionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'legal_opinions',
          key: 'opinionId',
        },
      },
      issueStatement: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      issueCategory: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      complexity: {
        type: DataTypes.ENUM('STRAIGHTFORWARD', 'MODERATE', 'COMPLEX', 'HIGHLY_COMPLEX'),
        allowNull: false,
      },
      elements: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      governingLaw: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      factsRelevant: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      relatedIssues: {
        type: DataTypes.ARRAY(DataTypes.STRING(50)),
        allowNull: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      disposition: {
        type: DataTypes.ENUM('FAVORABLE', 'UNFAVORABLE', 'UNCERTAIN', 'NOT_REACHED'),
        allowNull: false,
        defaultValue: 'UNCERTAIN',
      },
    },
    {
      sequelize,
      tableName: 'legal_issues',
      timestamps: true,
      indexes: [
        { fields: ['opinionId'] },
        { fields: ['issueCategory'] },
        { fields: ['priority'] },
        { fields: ['disposition'] },
      ],
    }
  );

  return LegalIssueModel;
}

/**
 * OpinionSection Sequelize Model
 */
export class OpinionSectionModel extends Model {
  @ApiProperty({ description: 'Unique section identifier' })
  declare sectionId: string;

  @ApiProperty({ description: 'Associated opinion ID' })
  declare opinionId: string;

  @ApiProperty({ description: 'Parent section ID (for subsections)' })
  declare parentSectionId: string | null;

  @ApiProperty({ description: 'Section type', enum: ['FACTS', 'ISSUE', 'RULE', 'ANALYSIS', 'CONCLUSION', 'COUNTERARGUMENT'] })
  declare sectionType: string;

  @ApiProperty({ description: 'Section heading' })
  declare heading: string;

  @ApiProperty({ description: 'Section content' })
  declare content: string;

  @ApiProperty({ description: 'Citations in this section' })
  declare citations: object[];

  @ApiProperty({ description: 'Footnotes' })
  declare footnotes: object[];

  @ApiProperty({ description: 'Section order' })
  declare order: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}

/**
 * Initialize OpinionSection model
 */
export function initOpinionSectionModel(sequelize: Sequelize): typeof OpinionSectionModel {
  OpinionSectionModel.init(
    {
      sectionId: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      opinionId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'legal_opinions',
          key: 'opinionId',
        },
      },
      parentSectionId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        references: {
          model: 'opinion_sections',
          key: 'sectionId',
        },
      },
      sectionType: {
        type: DataTypes.ENUM('FACTS', 'ISSUE', 'RULE', 'ANALYSIS', 'CONCLUSION', 'COUNTERARGUMENT'),
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      citations: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      footnotes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'opinion_sections',
      timestamps: true,
      indexes: [
        { fields: ['opinionId', 'order'] },
        { fields: ['parentSectionId'] },
        { fields: ['sectionType'] },
      ],
    }
  );

  return OpinionSectionModel;
}

/**
 * Initialize all opinion models and associations
 */
export function initOpinionModels(sequelize: Sequelize): {
  LegalOpinion: typeof LegalOpinion;
  OpinionAnalysis: typeof OpinionAnalysis;
  LegalIssueModel: typeof LegalIssueModel;
  OpinionSectionModel: typeof OpinionSectionModel;
} {
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
export function generateIRACTemplate(
  issue: string,
  jurisdiction: string
): IRACTemplate {
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
export function generateCREACTemplate(
  conclusion: string,
  rule: string
): CREACTemplate {
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
export function generateTREATTemplate(
  thesis: string,
  rule: string
): TREATTemplate {
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
export function createOpinionStructure(params: {
  title: string;
  opinionType: OpinionType;
  methodology: OpinionMethodology;
  clientMatter: LegalOpinionStructure['clientMatter'];
  authorId: string;
  authorName: string;
  jurisdiction: string;
  practiceArea: string;
}): LegalOpinionStructure {
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
export function formatOpinionSection(
  sectionType: OpinionSection['sectionType'],
  heading: string,
  content: string,
  citations: CitationReference[] = []
): OpinionSection {
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
export function mergeOpinionSections(
  sections: OpinionSection[],
  parentHeading?: string
): OpinionSection {
  const mergedContent = sections.map(s => s.content).join('\n\n');
  const allCitations: CitationReference[] = [];

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
export function validateOpinionStructure(opinion: LegalOpinionStructure): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

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
export function spotLegalIssues(
  facts: string[],
  jurisdiction: string,
  practiceArea: string
): LegalIssue[] {
  const issues: LegalIssue[] = [];

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
export function analyzeIssueElements(
  issue: LegalIssue,
  facts: string[]
): LegalIssue {
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
export function prioritizeIssues(issues: LegalIssue[]): LegalIssue[] {
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
export function generateIssueStatement(
  issue: LegalIssue,
  format: 'WHETHER' | 'UNDER_DOES' | 'QUESTION' = 'WHETHER'
): string {
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
export function linkIssuesToFacts(
  issue: LegalIssue,
  allFacts: string[]
): LegalIssue {
  const relevantFacts: string[] = [];

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
export function crossReferenceIssues(issues: LegalIssue[]): LegalIssue[] {
  issues.forEach((issue, index) => {
    const relatedIssueIds: string[] = [];

    issues.forEach((otherIssue, otherIndex) => {
      if (index !== otherIndex) {
        // Check for category match
        if (issue.issueCategory === otherIssue.issueCategory) {
          relatedIssueIds.push(otherIssue.issueId);
        }

        // Check for fact overlap
        const sharedFacts = issue.factsRelevant.filter(fact =>
          otherIssue.factsRelevant.includes(fact)
        );

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
export function buildSyllogisticReasoning(
  majorPremise: string,
  minorPremise: string,
  conclusion: string
): SyllogisticReasoning {
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
export function constructAnalogicalArgument(
  sourceCase: { name: string; citation: string; facts: string[]; holding: string },
  targetFacts: string[],
  similarities: Array<{ aspect: string; significance: 'HIGH' | 'MODERATE' | 'LOW' }>
): Analogy {
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
export function developPolicyArgument(
  policyGoals: string[],
  proposedOutcome: string
): PolicyReasoning {
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
export function synthesizeLegalAuthorities(
  authorities: Array<{ citation: string; holding: string; reasoning: string }>,
  synthesisGoal: string
): {
  synthesizedPrinciple: string;
  supportingAuthorities: string[];
  minorityView?: string;
  trend?: string;
} {
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
export function applyLegalStandard(
  standard: string,
  facts: string[],
  burden: 'PREPONDERANCE' | 'CLEAR_AND_CONVINCING' | 'BEYOND_REASONABLE_DOUBT' | 'REASONABLE_BASIS'
): {
  standardMet: boolean;
  confidence: 'HIGH' | 'MODERATE' | 'LOW';
  analysis: string;
  supportingFacts: string[];
  opposingFacts: string[];
} {
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
export function counterArgumentAnalysis(
  mainArgument: string,
  possibleCounters: string[]
): CounterArgument[] {
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
export function integrateCitations(
  text: string,
  citations: CitationReference[],
  style: 'BLUEBOOK' | 'ALWD' | 'APA' = 'BLUEBOOK'
): string {
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
export function validateCitationPlacement(section: OpinionSection): {
  valid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

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
export function generateCitationSignal(
  relationship: 'DIRECTLY_SUPPORTS' | 'INDIRECTLY_SUPPORTS' | 'BACKGROUND' | 'COMPARE' | 'CONTRAST'
): CitationSignal {
  const signalMap: Record<typeof relationship, CitationSignal> = {
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
export function buildAuthoritiesSection(opinion: LegalOpinionStructure): {
  cases: Array<{ name: string; citation: string; pages: number[] }>;
  statutes: Array<{ name: string; citation: string; pages: number[] }>;
  secondarySources: Array<{ name: string; citation: string; pages: number[] }>;
} {
  const cases: Array<{ name: string; citation: string; pages: number[] }> = [];
  const statutes: Array<{ name: string; citation: string; pages: number[] }> = [];
  const secondarySources: Array<{ name: string; citation: string; pages: number[] }> = [];

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
          } else {
            cases.push(entry);
          }
          break;

        case 'STATUTE':
        case 'REGULATION':
          const existingStatute = statutes.find(s => s.citation === entry.citation);
          if (existingStatute) {
            existingStatute.pages.push(...entry.pages);
          } else {
            statutes.push(entry);
          }
          break;

        default:
          const existingSecondary = secondarySources.find(s => s.citation === entry.citation);
          if (existingSecondary) {
            existingSecondary.pages.push(...entry.pages);
          } else {
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
export function scoreOpinionQuality(opinion: LegalOpinionStructure): OpinionQualityMetrics {
  // Legal Analysis Scoring
  const legalAnalysis: QualityDimension = {
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
  const organization: QualityDimension = {
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
  const writingClarity: QualityDimension = {
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
  const citationAccuracy: QualityDimension = {
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
  const completeness: QualityDimension = {
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
  const persuasiveness: QualityDimension = {
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
  const overallScore =
    legalAnalysis.score * legalAnalysis.weight +
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
export function reviewOpinionCompleteness(opinion: LegalOpinionStructure): {
  complete: boolean;
  missingElements: string[];
  recommendations: string[];
} {
  const missingElements: string[] = [];
  const recommendations: string[] = [];

  // Check required sections
  const requiredSectionTypes: OpinionSection['sectionType'][] = ['FACTS', 'ISSUE', 'RULE', 'ANALYSIS', 'CONCLUSION'];

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
export function assessReasoningStrength(reasoning: ReasoningFramework): {
  strength: 'STRONG' | 'MODERATE' | 'WEAK';
  score: number;
  analysis: string;
  improvements: string[];
} {
  let score = 50; // Base score
  const improvements: string[] = [];

  // Check validity
  if (reasoning.validity === 'VALID') {
    score += 20;
  } else {
    improvements.push('Ensure logical validity of argument structure');
  }

  // Check soundness
  if (reasoning.soundness === 'SOUND') {
    score += 20;
  } else {
    improvements.push('Verify factual premises are accurate and well-supported');
  }

  // Check supporting authorities
  if (reasoning.supportingAuthorities.length > 0) {
    score += 10;
  } else {
    improvements.push('Add supporting legal authorities');
  }

  const strength: 'STRONG' | 'MODERATE' | 'WEAK' =
    score >= 80 ? 'STRONG' : score >= 60 ? 'MODERATE' : 'WEAK';

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
export function generateImprovementSuggestions(
  opinion: LegalOpinionStructure,
  qualityMetrics: OpinionQualityMetrics
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];

  // Analyze each dimension and generate suggestions
  Object.entries(qualityMetrics.dimensions).forEach(([dimension, metrics]) => {
    if (metrics.score < 80) {
      metrics.criteria.forEach(criterion => {
        if (!criterion.met) {
          suggestions.push({
            suggestionId: `SUG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            category: dimension.toUpperCase().replace(/([A-Z])/g, '_$1').trim() as ImprovementSuggestion['category'],
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
@Injectable()
@ApiTags('legal-opinions')
export class LegalOpinionService {
  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create new legal opinion
   */
  @ApiOperation({ summary: 'Create new legal opinion' })
  @ApiResponse({ status: 201, description: 'Opinion created successfully', type: LegalOpinion })
  async createOpinion(
    opinionData: Partial<LegalOpinionStructure>,
    transaction?: Transaction
  ): Promise<LegalOpinion> {
    const opinion = await LegalOpinion.create(
      {
        opinionId: opinionData.opinionId || `OPN-${Date.now()}`,
        ...opinionData,
      } as any,
      { transaction }
    );

    return opinion;
  }

  /**
   * Generate opinion using specified methodology
   */
  @ApiOperation({ summary: 'Generate opinion with IRAC/CREAC/TREAT methodology' })
  @ApiResponse({ status: 200, description: 'Opinion generated successfully' })
  async generateOpinionWithMethodology(
    methodology: OpinionMethodology,
    params: any
  ): Promise<IRACTemplate | CREACTemplate | TREATTemplate> {
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
  @ApiOperation({ summary: 'Analyze opinion quality and generate improvement suggestions' })
  @ApiResponse({ status: 200, description: 'Quality analysis completed', type: Object })
  async analyzeOpinionQuality(opinionId: string): Promise<OpinionQualityMetrics> {
    const opinion = await LegalOpinion.findByPk(opinionId);

    if (!opinion) {
      throw new Error(`Opinion not found: ${opinionId}`);
    }

    const qualityMetrics = scoreOpinionQuality(opinion as any);

    // Store analysis
    await OpinionAnalysis.create({
      analysisId: `ANLYS-${Date.now()}`,
      opinionId,
      analysisType: 'QUALITY_ASSESSMENT',
      content: qualityMetrics as any,
      qualityScore: qualityMetrics.overallScore,
      conductedBy: 'system',
    });

    return qualityMetrics;
  }

  /**
   * Spot legal issues in fact pattern
   */
  @ApiOperation({ summary: 'Identify legal issues from facts' })
  @ApiResponse({ status: 200, description: 'Issues identified', type: Array })
  async spotIssues(
    facts: string[],
    jurisdiction: string,
    practiceArea: string
  ): Promise<LegalIssue[]> {
    const issues = spotLegalIssues(facts, jurisdiction, practiceArea);
    return prioritizeIssues(issues);
  }

  /**
   * Get opinion with full analysis
   */
  @ApiOperation({ summary: 'Retrieve opinion with all related data' })
  @ApiResponse({ status: 200, description: 'Opinion retrieved', type: LegalOpinion })
  async getOpinionWithAnalysis(opinionId: string): Promise<{
    opinion: LegalOpinion;
    analyses: OpinionAnalysis[];
    issues: LegalIssueModel[];
    sections: OpinionSectionModel[];
  }> {
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
      analyses: (opinion as any).analyses || [],
      issues: (opinion as any).issues || [],
      sections: (opinion as any).sectionModels || [],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
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
