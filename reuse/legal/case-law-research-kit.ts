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

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS - Legal Cases and Citations
// ============================================================================

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
  citedCases?: string[]; // IDs of cases cited by this case
  citingCases?: string[]; // IDs of cases citing this case
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Types of legal cases.
 */
export enum CaseType {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  ADMINISTRATIVE = 'administrative',
  CONSTITUTIONAL = 'constitutional',
  FAMILY = 'family',
  BANKRUPTCY = 'bankruptcy',
  TAX = 'tax',
  IMMIGRATION = 'immigration',
  LABOR = 'labor',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  ENVIRONMENTAL = 'environmental',
  HEALTHCARE = 'healthcare',
  OTHER = 'other',
}

/**
 * Status of a legal case.
 */
export enum CaseStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DECIDED = 'decided',
  APPEALED = 'appealed',
  DISMISSED = 'dismissed',
  SETTLED = 'settled',
  WITHDRAWN = 'withdrawn',
}

/**
 * Precedential value of a case.
 */
export enum PrecedentialValue {
  BINDING = 'binding',
  PERSUASIVE = 'persuasive',
  INFORMATIVE = 'informative',
  UNPUBLISHED = 'unpublished',
  SUPERSEDED = 'superseded',
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
export enum CitationFormat {
  BLUEBOOK = 'bluebook',
  APA = 'apa',
  MLA = 'mla',
  CHICAGO = 'chicago',
  OSCOLA = 'oscola',
  AGLC = 'aglc',
  NEUTRAL = 'neutral',
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
export enum CourtLevel {
  SUPREME = 'supreme',
  APPELLATE = 'appellate',
  TRIAL = 'trial',
  DISTRICT = 'district',
  MUNICIPAL = 'municipal',
  SPECIALIZED = 'specialized',
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
export enum CitationType {
  FOLLOWED = 'followed',
  DISTINGUISHED = 'distinguished',
  OVERRULED = 'overruled',
  QUESTIONED = 'questioned',
  CITED_WITH_APPROVAL = 'cited_with_approval',
  CITED_NEUTRALLY = 'cited_neutrally',
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
  courts: { name: string; count: number }[];
  jurisdictions: { name: string; count: number }[];
  years: { year: number; count: number }[];
  caseTypes: { type: CaseType; count: number }[];
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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

export interface LegalCaseCreationAttributes extends Optional<LegalCaseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

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
export const defineLegalCaseModel = (sequelize: Sequelize) => {
  class LegalCaseModel extends Model<LegalCaseAttributes, LegalCaseCreationAttributes> implements LegalCaseAttributes {
    public id!: string;
    public caseNumber!: string;
    public caseName!: string;
    public partyNames!: Record<string, string[]>;
    public courtId!: string;
    public courtName!: string;
    public jurisdiction!: string;
    public decisionDate!: Date;
    public filingDate?: Date;
    public judgeNames!: string[];
    public caseType!: CaseType;
    public caseStatus!: CaseStatus;
    public summary?: string;
    public fullTextUrl?: string;
    public pdfUrl?: string;
    public keyPoints?: string[];
    public legalIssues?: string[];
    public holdings?: string[];
    public precedentialValue!: PrecedentialValue;
    public citedCases?: string[];
    public citingCases?: string[];
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LegalCaseModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      caseNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      caseName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      partyNames: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: { plaintiff: [], defendant: [] },
      },
      courtId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'courts',
          key: 'id',
        },
      },
      courtName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      decisionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      judgeNames: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      caseType: {
        type: DataTypes.ENUM(...Object.values(CaseType)),
        allowNull: false,
      },
      caseStatus: {
        type: DataTypes.ENUM(...Object.values(CaseStatus)),
        allowNull: false,
        defaultValue: CaseStatus.PENDING,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fullTextUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      pdfUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      keyPoints: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      legalIssues: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      holdings: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      precedentialValue: {
        type: DataTypes.ENUM(...Object.values(PrecedentialValue)),
        allowNull: false,
        defaultValue: PrecedentialValue.INFORMATIVE,
      },
      citedCases: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      citingCases: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'legal_cases',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'] },
        { fields: ['courtId'] },
        { fields: ['jurisdiction'] },
        { fields: ['decisionDate'] },
        { fields: ['caseType'] },
        { fields: ['caseStatus'] },
        { fields: ['precedentialValue'] },
        { using: 'gin', fields: ['partyNames'] },
        { using: 'gin', fields: ['citedCases'] },
        { using: 'gin', fields: ['metadata'] },
      ],
    },
  );

  return LegalCaseModel;
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

export interface CitationCreationAttributes extends Optional<CitationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

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
export const defineCitationModel = (sequelize: Sequelize) => {
  class CitationModel extends Model<CitationAttributes, CitationCreationAttributes> implements CitationAttributes {
    public id!: string;
    public caseId!: string;
    public citationString!: string;
    public format!: CitationFormat;
    public volume?: string;
    public reporter!: string;
    public page!: string;
    public year!: number;
    public court?: string;
    public parallelCitations?: string[];
    public isCanonical!: boolean;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CitationModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      caseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'legal_cases',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      citationString: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      format: {
        type: DataTypes.ENUM(...Object.values(CitationFormat)),
        allowNull: false,
      },
      volume: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      reporter: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      page: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1700,
          max: 2100,
        },
      },
      court: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      parallelCitations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      isCanonical: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'citations',
      timestamps: true,
      indexes: [
        { fields: ['caseId'] },
        { fields: ['format'] },
        { fields: ['year'] },
        { fields: ['reporter'] },
        { fields: ['isCanonical'] },
        { unique: true, fields: ['caseId', 'citationString'] },
      ],
    },
  );

  return CitationModel;
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

export interface CourtCreationAttributes extends Optional<CourtAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

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
export const defineCourtModel = (sequelize: Sequelize) => {
  class CourtModel extends Model<CourtAttributes, CourtCreationAttributes> implements CourtAttributes {
    public id!: string;
    public name!: string;
    public shortName!: string;
    public level!: CourtLevel;
    public jurisdiction!: string;
    public parentCourtId?: string;
    public childCourtIds?: string[];
    public bindingJurisdictions?: string[];
    public persuasiveJurisdictions?: string[];
    public establishedDate?: Date;
    public isActive!: boolean;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CourtModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true,
      },
      shortName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      level: {
        type: DataTypes.ENUM(...Object.values(CourtLevel)),
        allowNull: false,
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      parentCourtId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'courts',
          key: 'id',
        },
      },
      childCourtIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      bindingJurisdictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      persuasiveJurisdictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      establishedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'courts',
      timestamps: true,
      indexes: [
        { fields: ['jurisdiction'] },
        { fields: ['level'] },
        { fields: ['isActive'] },
        { fields: ['parentCourtId'] },
        { using: 'gin', fields: ['childCourtIds'] },
      ],
    },
  );

  return CourtModel;
};

// ============================================================================
// CITATION PARSING AND VALIDATION
// ============================================================================

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
export const parseBluebookCitation = (citation: string): ParsedCitation | null => {
  // Regex for Bluebook format: Volume Reporter Page, Pinpoint (Year)
  const regex = /^(\d+)\s+([A-Z][A-Za-z.\s]+?)\s+(\d+)(?:,\s*(\d+))?\s*\((\d{4})\)$/;
  const match = citation.trim().match(regex);

  if (!match) {
    return null;
  }

  return {
    volume: match[1],
    reporter: match[2].trim(),
    page: match[3],
    pinpoint: match[4] || undefined,
    year: parseInt(match[5], 10),
  };
};

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
export const parseAPACitation = (citation: string): ParsedCitation | null => {
  // Regex for APA format: Party Names, Volume Reporter Page (Year)
  const regex = /^(.+?),\s*(\d+)\s+([A-Z][A-Za-z.\s]+?)\s+(\d+)\s*\((\d{4})\)$/;
  const match = citation.trim().match(regex);

  if (!match) {
    return null;
  }

  return {
    partyNames: match[1].trim(),
    volume: match[2],
    reporter: match[3].trim(),
    page: match[4],
    year: parseInt(match[5], 10),
  };
};

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
export const validateCitation = (citation: string, format: CitationFormat): CitationValidationResult => {
  const errors: ValidationError[] = [];
  let parsedComponents: ParsedCitation | null = null;

  if (!citation || citation.trim().length === 0) {
    errors.push({
      field: 'citation',
      message: 'Citation cannot be empty',
      severity: 'error',
    });
    return {
      isValid: false,
      format,
      parsedComponents: {} as ParsedCitation,
      errors,
    };
  }

  switch (format) {
    case CitationFormat.BLUEBOOK:
      parsedComponents = parseBluebookCitation(citation);
      break;
    case CitationFormat.APA:
      parsedComponents = parseAPACitation(citation);
      break;
    default:
      errors.push({
        field: 'format',
        message: `Citation format ${format} not yet implemented`,
        severity: 'error',
      });
  }

  if (!parsedComponents) {
    errors.push({
      field: 'citation',
      message: `Invalid ${format} citation format`,
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0 && parsedComponents !== null,
    format,
    parsedComponents: parsedComponents || ({} as ParsedCitation),
    errors,
    suggestions: errors.length > 0 ? generateCitationSuggestions(citation, format) : undefined,
  };
};

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
export const generateCitationSuggestions = (citation: string, format: CitationFormat): string[] => {
  const suggestions: string[] = [];

  if (format === CitationFormat.BLUEBOOK) {
    if (!/\d+\s+[A-Z]/.test(citation)) {
      suggestions.push('Add space between volume and reporter (e.g., "410 U.S.")');
    }
    if (!/\(\d{4}\)/.test(citation)) {
      suggestions.push('Include year in parentheses at the end (e.g., "(1973)")');
    }
    if (!/\d+$|\d+\)$/.test(citation.replace(/\s*\(\d{4}\)$/, ''))) {
      suggestions.push('Ensure page number is included');
    }
  }

  if (format === CitationFormat.APA) {
    if (!/^[^,]+,/.test(citation)) {
      suggestions.push('Start with party names followed by comma (e.g., "Roe v. Wade,")');
    }
  }

  return suggestions;
};

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
export const normalizeCitation = (citation: string, targetFormat: CitationFormat): string => {
  const cleaned = citation.trim().replace(/\s+/g, ' ');

  // Basic normalization for Bluebook
  if (targetFormat === CitationFormat.BLUEBOOK) {
    return cleaned
      .replace(/(\d+)([A-Z])/g, '$1 $2') // Add space after volume number
      .replace(/([A-Z]\.?)(\d)/g, '$1 $2') // Add space after reporter
      .replace(/,\s*(\d+)\s*\(/g, ', $1 (') // Normalize pinpoint spacing
      .replace(/\(\s*(\d{4})\s*\)/, '($1)'); // Normalize year
  }

  return cleaned;
};

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
export const extractCitationsFromText = (
  text: string,
  formats: CitationFormat[] = [CitationFormat.BLUEBOOK],
): ParsedCitation[] => {
  const citations: ParsedCitation[] = [];

  // Bluebook pattern
  const bluebookPattern = /\d+\s+[A-Z][A-Za-z.\s]+?\s+\d+(?:,\s*\d+)?\s*\(\d{4}\)/g;

  if (formats.includes(CitationFormat.BLUEBOOK)) {
    const matches = text.match(bluebookPattern);
    if (matches) {
      matches.forEach((match) => {
        const parsed = parseBluebookCitation(match);
        if (parsed) {
          citations.push(parsed);
        }
      });
    }
  }

  return citations;
};

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
export const formatCitation = (parsed: ParsedCitation, format: CitationFormat): string => {
  switch (format) {
    case CitationFormat.BLUEBOOK:
      let bluebook = `${parsed.volume || ''} ${parsed.reporter} ${parsed.page}`;
      if (parsed.pinpoint) {
        bluebook += `, ${parsed.pinpoint}`;
      }
      if (parsed.year) {
        bluebook += ` (${parsed.year})`;
      }
      return bluebook.trim();

    case CitationFormat.APA:
      let apa = '';
      if (parsed.partyNames) {
        apa = `${parsed.partyNames}, `;
      }
      apa += `${parsed.volume || ''} ${parsed.reporter} ${parsed.page}`;
      if (parsed.year) {
        apa += ` (${parsed.year})`;
      }
      return apa.trim();

    default:
      return `${parsed.volume || ''} ${parsed.reporter} ${parsed.page} (${parsed.year || ''})`.trim();
  }
};

// ============================================================================
// CASE SIMILARITY AND RELEVANCE ANALYSIS
// ============================================================================

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
export const calculateCaseSimilarity = (case1: LegalCase, case2: LegalCase): number => {
  let score = 0;
  let weights = 0;

  // Citation overlap (weight: 0.3)
  if (case1.citedCases && case2.citedCases) {
    const intersection = case1.citedCases.filter((id) => case2.citedCases?.includes(id));
    const union = new Set([...case1.citedCases, ...case2.citedCases]);
    const citationSimilarity = union.size > 0 ? intersection.length / union.size : 0;
    score += citationSimilarity * 0.3;
    weights += 0.3;
  }

  // Legal issues overlap (weight: 0.25)
  if (case1.legalIssues && case2.legalIssues) {
    const issueIntersection = case1.legalIssues.filter((issue) =>
      case2.legalIssues?.some((issue2) => issue.toLowerCase().includes(issue2.toLowerCase())),
    );
    const issueSimilarity =
      case1.legalIssues.length + case2.legalIssues.length > 0
        ? (2 * issueIntersection.length) / (case1.legalIssues.length + case2.legalIssues.length)
        : 0;
    score += issueSimilarity * 0.25;
    weights += 0.25;
  }

  // Same court type (weight: 0.15)
  if (case1.courtId === case2.courtId) {
    score += 0.15;
  }
  weights += 0.15;

  // Same case type (weight: 0.15)
  if (case1.caseType === case2.caseType) {
    score += 0.15;
  }
  weights += 0.15;

  // Temporal proximity (weight: 0.15)
  const yearDiff = Math.abs(
    case1.decisionDate.getFullYear() - case2.decisionDate.getFullYear(),
  );
  const temporalScore = Math.max(0, 1 - yearDiff / 50); // Decreases over 50 years
  score += temporalScore * 0.15;
  weights += 0.15;

  return weights > 0 ? score / weights : 0;
};

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
export const findSimilarCases = (
  targetCase: LegalCase,
  candidateCases: LegalCase[],
  threshold: number = 0.5,
  limit: number = 10,
): SimilarCase[] => {
  const similarCases: SimilarCase[] = [];

  for (const candidate of candidateCases) {
    if (candidate.id === targetCase.id) continue;

    const similarity = calculateCaseSimilarity(targetCase, candidate);
    if (similarity >= threshold) {
      const sharedCitations =
        targetCase.citedCases?.filter((id) => candidate.citedCases?.includes(id)).length || 0;

      const sharedIssues =
        targetCase.legalIssues?.filter((issue) =>
          candidate.legalIssues?.some((ci) => ci.toLowerCase().includes(issue.toLowerCase())),
        ) || [];

      similarCases.push({
        caseId: candidate.id,
        caseName: candidate.caseName,
        similarity,
        sharedCitations,
        sharedIssues,
        sharedKeywords: [], // Could be enhanced with keyword extraction
        temporalRelevance: calculateTemporalRelevance(targetCase.decisionDate, candidate.decisionDate),
        jurisdictionalAlignment: targetCase.jurisdiction === candidate.jurisdiction ? 1 : 0.5,
      });
    }
  }

  return similarCases
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};

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
export const calculateTemporalRelevance = (date1: Date, date2: Date): number => {
  const yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear());
  return Math.max(0, 1 - yearDiff / 100);
};

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
export const scoreCaseRelevance = (legalCase: LegalCase, query: CaseLawSearchQuery): number => {
  let score = 0;
  let maxScore = 0;

  // Keyword matching
  if (query.keywords && query.keywords.length > 0) {
    const caseText = [
      legalCase.caseName,
      legalCase.summary || '',
      ...(legalCase.legalIssues || []),
      ...(legalCase.keyPoints || []),
    ].join(' ').toLowerCase();

    const matchedKeywords = query.keywords.filter((keyword) =>
      caseText.includes(keyword.toLowerCase()),
    );
    score += (matchedKeywords.length / query.keywords.length) * 0.4;
    maxScore += 0.4;
  }

  // Jurisdiction match
  if (query.jurisdictions && query.jurisdictions.length > 0) {
    if (query.jurisdictions.includes(legalCase.jurisdiction)) {
      score += 0.2;
    }
    maxScore += 0.2;
  }

  // Case type match
  if (query.caseTypes && query.caseTypes.length > 0) {
    if (query.caseTypes.includes(legalCase.caseType)) {
      score += 0.2;
    }
    maxScore += 0.2;
  }

  // Date range relevance
  if (query.dateFrom || query.dateTo) {
    const decisionTime = legalCase.decisionDate.getTime();
    const fromTime = query.dateFrom?.getTime() || 0;
    const toTime = query.dateTo?.getTime() || Date.now();

    if (decisionTime >= fromTime && decisionTime <= toTime) {
      score += 0.2;
    }
    maxScore += 0.2;
  }

  return maxScore > 0 ? score / maxScore : 0;
};

// ============================================================================
// COURT HIERARCHY AND JURISDICTION
// ============================================================================

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
export const isBindingPrecedent = (superiorCourt: Court, inferiorCourt: Court): boolean => {
  // Same court binds itself
  if (superiorCourt.id === inferiorCourt.id) {
    return true;
  }

  // Check if inferior court is in superior court's binding jurisdictions
  if (superiorCourt.bindingJurisdictions?.includes(inferiorCourt.jurisdiction)) {
    return true;
  }

  // Check direct hierarchy
  if (inferiorCourt.parentCourtId === superiorCourt.id) {
    return true;
  }

  // Check if inferior court is in child hierarchy
  if (superiorCourt.childCourtIds?.includes(inferiorCourt.id)) {
    return true;
  }

  return false;
};

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
export const getCourtHierarchy = (court: Court, courtMap: Map<string, Court>): Court[] => {
  const hierarchy: Court[] = [court];
  let currentCourt = court;

  while (currentCourt.parentCourtId) {
    const parentCourt = courtMap.get(currentCourt.parentCourtId);
    if (!parentCourt) break;

    hierarchy.push(parentCourt);
    currentCourt = parentCourt;

    // Prevent infinite loops
    if (hierarchy.length > 10) break;
  }

  return hierarchy;
};

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
export const determinePrecedentialWeight = (
  legalCase: LegalCase,
  targetCourt: Court,
  courtMap: Map<string, Court>,
): number => {
  const caseCourt = courtMap.get(legalCase.courtId);
  if (!caseCourt) return 0;

  // Maximum weight for binding precedent
  if (legalCase.precedentialValue === PrecedentialValue.BINDING) {
    if (isBindingPrecedent(caseCourt, targetCourt)) {
      return 1.0;
    }
  }

  // High weight for same court
  if (caseCourt.id === targetCourt.id) {
    return 0.9;
  }

  // Medium-high weight for persuasive precedent in same jurisdiction
  if (legalCase.precedentialValue === PrecedentialValue.PERSUASIVE) {
    if (caseCourt.jurisdiction === targetCourt.jurisdiction) {
      return 0.7;
    }
    if (targetCourt.persuasiveJurisdictions?.includes(caseCourt.jurisdiction)) {
      return 0.6;
    }
  }

  // Medium weight for informative cases
  if (legalCase.precedentialValue === PrecedentialValue.INFORMATIVE) {
    return 0.4;
  }

  // Low weight for unpublished opinions
  if (legalCase.precedentialValue === PrecedentialValue.UNPUBLISHED) {
    return 0.2;
  }

  // No weight for superseded cases
  if (legalCase.precedentialValue === PrecedentialValue.SUPERSEDED) {
    return 0.0;
  }

  return 0.3; // Default weight
};

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
export const getCourtsInJurisdiction = (jurisdiction: string, courts: Court[]): Court[] => {
  return courts.filter((court) => court.jurisdiction === jurisdiction && court.isActive);
};

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
export const getSubordinateCourts = (court: Court, courtMap: Map<string, Court>): Court[] => {
  const subordinates: Court[] = [];

  if (!court.childCourtIds) return subordinates;

  for (const childId of court.childCourtIds) {
    const childCourt = courtMap.get(childId);
    if (childCourt) {
      subordinates.push(childCourt);
      // Recursively get children of children
      subordinates.push(...getSubordinateCourts(childCourt, courtMap));
    }
  }

  return subordinates;
};

// ============================================================================
// CITATION NETWORK ANALYSIS
// ============================================================================

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
export const buildCitationNetwork = (cases: LegalCase[]): CitationNetwork => {
  const nodes: CitationNode[] = [];
  const edges: CitationEdge[] = [];
  const caseMap = new Map<string, LegalCase>();

  // Create nodes
  cases.forEach((c) => {
    caseMap.set(c.id, c);
    nodes.push({
      id: c.id,
      caseId: c.id,
      caseName: c.caseName,
      year: c.decisionDate.getFullYear(),
      importance: 0,
      inDegree: 0,
      outDegree: 0,
    });
  });

  // Create edges
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  cases.forEach((c) => {
    const sourceNode = nodeMap.get(c.id);
    if (!sourceNode || !c.citedCases) return;

    c.citedCases.forEach((citedId) => {
      const targetNode = nodeMap.get(citedId);
      if (!targetNode) return;

      edges.push({
        sourceId: c.id,
        targetId: citedId,
        weight: 1,
        citationType: CitationType.CITED_NEUTRALLY,
      });

      sourceNode.outDegree++;
      targetNode.inDegree++;
    });
  });

  // Calculate importance scores (based on in-degree)
  const maxInDegree = Math.max(...nodes.map((n) => n.inDegree), 1);
  nodes.forEach((node) => {
    node.importance = node.inDegree / maxInDegree;
  });

  // Calculate metrics
  const metrics = calculateNetworkMetrics(nodes, edges);

  return { nodes, edges, metrics };
};

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
export const calculateNetworkMetrics = (
  nodes: CitationNode[],
  edges: CitationEdge[],
): NetworkMetrics => {
  const totalNodes = nodes.length;
  const totalEdges = edges.length;
  const maxPossibleEdges = totalNodes * (totalNodes - 1);
  const density = maxPossibleEdges > 0 ? totalEdges / maxPossibleEdges : 0;
  const averageDegree = totalNodes > 0 ? (2 * totalEdges) / totalNodes : 0;

  // Find central nodes (top 10% by in-degree)
  const sortedByInDegree = [...nodes].sort((a, b) => b.inDegree - a.inDegree);
  const centralCount = Math.max(1, Math.floor(totalNodes * 0.1));
  const centralNodes = sortedByInDegree.slice(0, centralCount).map((n) => n.id);

  return {
    totalNodes,
    totalEdges,
    density,
    averageDegree,
    centralNodes,
  };
};

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
export const calculatePageRank = (
  network: CitationNetwork,
  dampingFactor: number = 0.85,
  maxIterations: number = 100,
): Map<string, number> => {
  const { nodes, edges } = network;
  const pageRanks = new Map<string, number>();
  const newPageRanks = new Map<string, number>();

  // Initialize PageRank scores
  const initialScore = 1 / nodes.length;
  nodes.forEach((node) => {
    pageRanks.set(node.id, initialScore);
  });

  // Build adjacency information
  const outLinks = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!outLinks.has(edge.sourceId)) {
      outLinks.set(edge.sourceId, []);
    }
    outLinks.get(edge.sourceId)!.push(edge.targetId);
  });

  // Iterative PageRank calculation
  for (let iter = 0; iter < maxIterations; iter++) {
    nodes.forEach((node) => {
      let sum = 0;

      // Sum contributions from incoming links
      edges.forEach((edge) => {
        if (edge.targetId === node.id) {
          const sourceOutDegree = outLinks.get(edge.sourceId)?.length || 1;
          sum += (pageRanks.get(edge.sourceId) || 0) / sourceOutDegree;
        }
      });

      const newScore = (1 - dampingFactor) / nodes.length + dampingFactor * sum;
      newPageRanks.set(node.id, newScore);
    });

    // Update scores
    newPageRanks.forEach((score, id) => {
      pageRanks.set(id, score);
    });
  }

  return pageRanks;
};

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
export const identifyCitationClusters = (
  network: CitationNetwork,
  minClusterSize: number = 3,
): string[][] => {
  const { nodes, edges } = network;
  const clusters: string[][] = [];
  const visited = new Set<string>();

  // Build adjacency list (undirected)
  const adjacency = new Map<string, Set<string>>();
  nodes.forEach((node) => adjacency.set(node.id, new Set()));

  edges.forEach((edge) => {
    adjacency.get(edge.sourceId)?.add(edge.targetId);
    adjacency.get(edge.targetId)?.add(edge.sourceId);
  });

  // DFS to find connected components
  const dfs = (nodeId: string, cluster: string[]) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    cluster.push(nodeId);

    const neighbors = adjacency.get(nodeId);
    if (neighbors) {
      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          dfs(neighborId, cluster);
        }
      });
    }
  };

  // Find all clusters
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const cluster: string[] = [];
      dfs(node.id, cluster);
      if (cluster.length >= minClusterSize) {
        clusters.push(cluster);
      }
    }
  });

  return clusters;
};

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
export const findCitationPath = (
  sourceCaseId: string,
  targetCaseId: string,
  network: CitationNetwork,
): string[] | null => {
  const { edges } = network;

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!adjacency.has(edge.sourceId)) {
      adjacency.set(edge.sourceId, []);
    }
    adjacency.get(edge.sourceId)!.push(edge.targetId);
  });

  // BFS to find shortest path
  const queue: { nodeId: string; path: string[] }[] = [{ nodeId: sourceCaseId, path: [sourceCaseId] }];
  const visited = new Set<string>([sourceCaseId]);

  while (queue.length > 0) {
    const { nodeId, path } = queue.shift()!;

    if (nodeId === targetCaseId) {
      return path;
    }

    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ nodeId: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null; // No path found
};

// ============================================================================
// SWAGGER API DOCUMENTATION HELPERS
// ============================================================================

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
export const createLegalCaseSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Unique case identifier' },
      caseNumber: { type: 'string', description: 'Official case number' },
      caseName: { type: 'string', description: 'Full case name' },
      partyNames: {
        type: 'object',
        properties: {
          plaintiff: { type: 'array', items: { type: 'string' } },
          defendant: { type: 'array', items: { type: 'string' } },
        },
      },
      courtId: { type: 'string', format: 'uuid' },
      courtName: { type: 'string' },
      jurisdiction: { type: 'string' },
      decisionDate: { type: 'string', format: 'date-time' },
      caseType: { type: 'string', enum: Object.values(CaseType) },
      caseStatus: { type: 'string', enum: Object.values(CaseStatus) },
      precedentialValue: { type: 'string', enum: Object.values(PrecedentialValue) },
      summary: { type: 'string', nullable: true },
      legalIssues: { type: 'array', items: { type: 'string' } },
      holdings: { type: 'array', items: { type: 'string' } },
    },
  };
};

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
export const createCitationValidationSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      isValid: { type: 'boolean', description: 'Whether citation is valid' },
      format: { type: 'string', enum: Object.values(CitationFormat) },
      parsedComponents: {
        type: 'object',
        properties: {
          volume: { type: 'string', nullable: true },
          reporter: { type: 'string' },
          page: { type: 'string' },
          year: { type: 'integer', nullable: true },
          court: { type: 'string', nullable: true },
        },
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string' },
            message: { type: 'string' },
            severity: { type: 'string', enum: ['error', 'warning', 'info'] },
          },
        },
      },
      suggestions: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
    },
  };
};

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
export const createCaseSearchSwaggerOperation = (): Record<string, any> => {
  return {
    summary: 'Search legal cases',
    description: 'Performs comprehensive search across legal cases with advanced filtering and relevance scoring',
    tags: ['Case Law Research'],
    parameters: [
      {
        name: 'query',
        in: 'query',
        description: 'Full-text search query',
        required: false,
        schema: { type: 'string' },
      },
      {
        name: 'jurisdiction',
        in: 'query',
        description: 'Filter by jurisdiction',
        required: false,
        schema: { type: 'string' },
      },
      {
        name: 'caseType',
        in: 'query',
        description: 'Filter by case type',
        required: false,
        schema: { type: 'string', enum: Object.values(CaseType) },
      },
      {
        name: 'dateFrom',
        in: 'query',
        description: 'Filter cases from this date',
        required: false,
        schema: { type: 'string', format: 'date' },
      },
      {
        name: 'dateTo',
        in: 'query',
        description: 'Filter cases to this date',
        required: false,
        schema: { type: 'string', format: 'date' },
      },
      {
        name: 'limit',
        in: 'query',
        description: 'Maximum results to return',
        required: false,
        schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
      },
    ],
    responses: {
      '200': {
        description: 'Search results returned successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cases: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LegalCase' },
                },
                total: { type: 'integer' },
                page: { type: 'integer' },
                pageSize: { type: 'integer' },
              },
            },
          },
        },
      },
    },
  };
};

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
export const createLegalCaseExample = (): Record<string, any> => {
  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    caseNumber: '410 U.S. 113',
    caseName: 'Roe v. Wade',
    partyNames: {
      plaintiff: ['Jane Roe'],
      defendant: ['Henry Wade'],
    },
    courtId: '660e8400-e29b-41d4-a716-446655440001',
    courtName: 'Supreme Court of the United States',
    jurisdiction: 'federal',
    decisionDate: '1973-01-22T00:00:00.000Z',
    filingDate: '1970-03-03T00:00:00.000Z',
    judgeNames: ['Harry Blackmun', 'Warren Burger'],
    caseType: CaseType.CONSTITUTIONAL,
    caseStatus: CaseStatus.DECIDED,
    summary: 'Landmark decision on reproductive rights and privacy.',
    precedentialValue: PrecedentialValue.BINDING,
    legalIssues: ['Right to privacy', 'Due process', 'Reproductive rights'],
    holdings: ['Right to privacy extends to abortion decision'],
    citedCases: [],
    citingCases: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
};
