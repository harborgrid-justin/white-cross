/**
 * LOC: LGPA1234567
 * File: /reuse/legal/precedent-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal services and controllers
 *   - Precedent analysis modules
 *   - Stare decisis systems
 */

/**
 * File: /reuse/legal/precedent-analysis-kit.ts
 * Locator: WC-UTL-LGPA-001
 * Purpose: Comprehensive Legal Precedent Analysis Utilities - Precedent identification, authority classification, strength scoring
 *
 * Upstream: Independent utility module for legal precedent research
 * Downstream: ../backend/*, Legal services, Citation validators, Court hierarchy systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, @nestjs/*, class-validator
 * Exports: 41 utility functions for precedent analysis, authority classification, overruling detection, stare decisis
 *
 * LLM Context: Comprehensive legal precedent analysis utilities for precedent identification, binding vs persuasive
 * authority classification, precedent strength scoring, overruling detection, stare decisis analysis, and legal
 * precedent relationship tracking. Essential for legal research systems requiring robust precedent analysis and
 * authority evaluation capabilities. Supports multiple jurisdictions, court hierarchies, and precedential relationships.
 */

import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS - Legal Precedents and Authority
// ============================================================================

/**
 * Represents a legal precedent with comprehensive analysis metadata.
 */
export interface LegalPrecedent {
  id: string;
  caseId: string;
  caseName: string;
  citation: string;
  decisionDate: Date;
  courtId: string;
  courtName: string;
  jurisdiction: string;
  courtLevel: CourtLevel;
  authorityType: AuthorityType;
  precedentStrength: number; // 0-100 score
  holdings: Holding[];
  keyPrinciples: string[];
  factPattern: string;
  overruledBy?: string; // Case ID that overruled this precedent
  overrulingDate?: Date;
  distinguishedBy?: string[]; // Case IDs that distinguished this precedent
  followedBy?: string[]; // Case IDs that followed this precedent
  citationCount: number;
  positiveCitations: number;
  negativeCitations: number;
  neutralCitations: number;
  bindingJurisdictions: string[];
  persuasiveJurisdictions: string[];
  status: PrecedentStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Court hierarchy levels.
 */
export enum CourtLevel {
  SUPREME_COURT = 'supreme_court',
  APPELLATE_COURT = 'appellate_court',
  SUPERIOR_COURT = 'superior_court',
  DISTRICT_COURT = 'district_court',
  TRIAL_COURT = 'trial_court',
  MUNICIPAL_COURT = 'municipal_court',
  SPECIALIZED_COURT = 'specialized_court',
}

/**
 * Types of legal authority.
 */
export enum AuthorityType {
  BINDING = 'binding',
  PERSUASIVE = 'persuasive',
  INFORMATIVE = 'informative',
  SUPERSEDED = 'superseded',
  OVERRULED = 'overruled',
  QUESTIONED = 'questioned',
}

/**
 * Status of a precedent.
 */
export enum PrecedentStatus {
  ACTIVE = 'active',
  OVERRULED = 'overruled',
  MODIFIED = 'modified',
  SUPERSEDED = 'superseded',
  QUESTIONED = 'questioned',
  DISTINGUISHED = 'distinguished',
  LIMITED = 'limited',
}

/**
 * Represents a legal holding from a case.
 */
export interface Holding {
  id: string;
  precedentId: string;
  statement: string;
  legalPrinciple: string;
  applicableArea: string; // Area of law
  scope: HoldingScope;
  confidence: number; // 0-100
  citations?: string[];
}

/**
 * Scope of a legal holding.
 */
export enum HoldingScope {
  BROAD = 'broad',
  MODERATE = 'moderate',
  NARROW = 'narrow',
  DICTA = 'dicta',
}

/**
 * Precedent relationship between cases.
 */
export interface PrecedentRelationship {
  id: string;
  sourceCaseId: string;
  targetCaseId: string;
  relationshipType: RelationshipType;
  strength: number; // 0-100
  description?: string;
  identifiedDate: Date;
  verifiedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Types of precedent relationships.
 */
export enum RelationshipType {
  FOLLOWS = 'follows',
  DISTINGUISHES = 'distinguishes',
  OVERRULES = 'overrules',
  MODIFIES = 'modifies',
  SUPERSEDES = 'supersedes',
  QUESTIONS = 'questions',
  AFFIRMS = 'affirms',
  REVERSES = 'reverses',
  CITES_APPROVINGLY = 'cites_approvingly',
  CITES_CRITICALLY = 'cites_critically',
  CITES_NEUTRALLY = 'cites_neutrally',
}

/**
 * Authority classification result.
 */
export interface AuthorityClassification {
  precedentId: string;
  targetJurisdiction: string;
  targetCourt: string;
  authorityType: AuthorityType;
  bindingReason?: string;
  applicabilityScore: number; // 0-100
  hierarchyDistance: number; // Distance in court hierarchy
  jurisdictionalAlignment: number; // 0-100
  temporalRelevance: number; // 0-100
  overallStrength: number; // 0-100
}

/**
 * Precedent strength analysis result.
 */
export interface PrecedentStrengthAnalysis {
  precedentId: string;
  overallStrength: number; // 0-100
  citationScore: number; // 0-100
  courtAuthorityScore: number; // 0-100
  temporalScore: number; // 0-100
  treatmentScore: number; // 0-100 (positive vs negative treatment)
  consistencyScore: number; // 0-100
  factors: StrengthFactor[];
  weaknesses: string[];
  strengths: string[];
}

/**
 * Individual strength factor.
 */
export interface StrengthFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

/**
 * Overruling detection result.
 */
export interface OverrulingDetection {
  precedentId: string;
  isOverruled: boolean;
  overrulingCaseId?: string;
  overrulingCaseName?: string;
  overrulingDate?: Date;
  overrulingScope: OverrulingScope;
  confidence: number; // 0-100
  reasoning: string;
  partialOverruling?: PartialOverruling[];
}

/**
 * Scope of overruling.
 */
export enum OverrulingScope {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
  IMPLICIT = 'implicit',
  PROSPECTIVE = 'prospective',
  NONE = 'none',
}

/**
 * Represents partial overruling of specific holdings.
 */
export interface PartialOverruling {
  holdingId: string;
  overrulingStatement: string;
  newPrinciple?: string;
}

/**
 * Stare decisis analysis result.
 */
export interface StareDecisisAnalysis {
  precedentId: string;
  currentCaseId: string;
  shouldFollow: boolean;
  bindingLevel: BindingLevel;
  factorsSimilarity: number; // 0-100
  legalIssuesSimilarity: number; // 0-100
  jurisdictionalBinding: boolean;
  distinguishingFactors: string[];
  supportingFactors: string[];
  recommendation: StareDecisisRecommendation;
}

/**
 * Level of binding precedent.
 */
export enum BindingLevel {
  STRICTLY_BINDING = 'strictly_binding',
  PRESUMPTIVELY_BINDING = 'presumptively_binding',
  PERSUASIVE = 'persuasive',
  NOT_BINDING = 'not_binding',
}

/**
 * Recommendation for applying stare decisis.
 */
export enum StareDecisisRecommendation {
  FOLLOW_PRECEDENT = 'follow_precedent',
  DISTINGUISH_PRECEDENT = 'distinguish_precedent',
  OVERRULE_PRECEDENT = 'overrule_precedent',
  MODIFY_PRECEDENT = 'modify_precedent',
  CONSIDER_PERSUASIVE = 'consider_persuasive',
}

/**
 * Precedent search query.
 */
export interface PrecedentSearchQuery {
  query?: string;
  jurisdiction?: string[];
  courtLevel?: CourtLevel[];
  authorityType?: AuthorityType[];
  legalIssues?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  minStrength?: number;
  status?: PrecedentStatus[];
  excludeOverruled?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Precedent search result.
 */
export interface PrecedentSearchResult {
  precedents: LegalPrecedent[];
  total: number;
  page: number;
  pageSize: number;
  facets?: PrecedentFacets;
}

/**
 * Search result facets for precedent filtering.
 */
export interface PrecedentFacets {
  jurisdictions: { name: string; count: number }[];
  courts: { name: string; count: number }[];
  authorityTypes: { type: AuthorityType; count: number }[];
  years: { year: number; count: number }[];
}

/**
 * Citation treatment analysis.
 */
export interface CitationTreatment {
  precedentId: string;
  totalCitations: number;
  positiveTreatment: number;
  negativeTreatment: number;
  neutralTreatment: number;
  treatmentHistory: TreatmentEvent[];
  overallSentiment: CitationSentiment;
}

/**
 * Citation sentiment.
 */
export enum CitationSentiment {
  STRONGLY_POSITIVE = 'strongly_positive',
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  STRONGLY_NEGATIVE = 'strongly_negative',
}

/**
 * Individual treatment event.
 */
export interface TreatmentEvent {
  citingCaseId: string;
  citingCaseName: string;
  date: Date;
  treatment: RelationshipType;
  context?: string;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model attributes for LegalPrecedent.
 */
export interface LegalPrecedentAttributes {
  id: string;
  caseId: string;
  caseName: string;
  citation: string;
  decisionDate: Date;
  courtId: string;
  courtName: string;
  jurisdiction: string;
  courtLevel: CourtLevel;
  authorityType: AuthorityType;
  precedentStrength: number;
  holdings: Record<string, any>[];
  keyPrinciples: string[];
  factPattern: string;
  overruledBy?: string;
  overrulingDate?: Date;
  distinguishedBy?: string[];
  followedBy?: string[];
  citationCount: number;
  positiveCitations: number;
  negativeCitations: number;
  neutralCitations: number;
  bindingJurisdictions: string[];
  persuasiveJurisdictions: string[];
  status: PrecedentStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalPrecedentCreationAttributes
  extends Optional<LegalPrecedentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Defines Sequelize model for legal precedents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Legal precedent model
 *
 * @example
 * ```typescript
 * const PrecedentModel = defineLegalPrecedentModel(sequelize);
 * const precedent = await PrecedentModel.create({
 *   caseId: 'case-123',
 *   caseName: 'Marbury v. Madison',
 *   citation: '5 U.S. 137 (1803)',
 *   // ... other fields
 * });
 * ```
 */
export const defineLegalPrecedentModel = (sequelize: Sequelize) => {
  class LegalPrecedentModel
    extends Model<LegalPrecedentAttributes, LegalPrecedentCreationAttributes>
    implements LegalPrecedentAttributes
  {
    public id!: string;
    public caseId!: string;
    public caseName!: string;
    public citation!: string;
    public decisionDate!: Date;
    public courtId!: string;
    public courtName!: string;
    public jurisdiction!: string;
    public courtLevel!: CourtLevel;
    public authorityType!: AuthorityType;
    public precedentStrength!: number;
    public holdings!: Record<string, any>[];
    public keyPrinciples!: string[];
    public factPattern!: string;
    public overruledBy?: string;
    public overrulingDate?: Date;
    public distinguishedBy?: string[];
    public followedBy?: string[];
    public citationCount!: number;
    public positiveCitations!: number;
    public negativeCitations!: number;
    public neutralCitations!: number;
    public bindingJurisdictions!: string[];
    public persuasiveJurisdictions!: string[];
    public status!: PrecedentStatus;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LegalPrecedentModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      caseId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'legal_cases',
          key: 'id',
        },
      },
      caseName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      citation: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      decisionDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
      courtLevel: {
        type: DataTypes.ENUM(...Object.values(CourtLevel)),
        allowNull: false,
      },
      authorityType: {
        type: DataTypes.ENUM(...Object.values(AuthorityType)),
        allowNull: false,
        defaultValue: AuthorityType.BINDING,
      },
      precedentStrength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        validate: {
          min: 0,
          max: 100,
        },
      },
      holdings: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      keyPrinciples: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      factPattern: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      overruledBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'legal_cases',
          key: 'id',
        },
      },
      overrulingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      distinguishedBy: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      followedBy: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      citationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      positiveCitations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      negativeCitations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      neutralCitations: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      bindingJurisdictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      persuasiveJurisdictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PrecedentStatus)),
        allowNull: false,
        defaultValue: PrecedentStatus.ACTIVE,
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
      tableName: 'legal_precedents',
      timestamps: true,
      indexes: [
        { fields: ['caseId'] },
        { fields: ['jurisdiction'] },
        { fields: ['courtLevel'] },
        { fields: ['authorityType'] },
        { fields: ['status'] },
        { fields: ['decisionDate'] },
        { fields: ['precedentStrength'] },
        { using: 'gin', fields: ['keyPrinciples'] },
        { using: 'gin', fields: ['bindingJurisdictions'] },
      ],
    },
  );

  return LegalPrecedentModel;
};

/**
 * Sequelize model attributes for PrecedentRelationship.
 */
export interface PrecedentRelationshipAttributes {
  id: string;
  sourceCaseId: string;
  targetCaseId: string;
  relationshipType: RelationshipType;
  strength: number;
  description?: string;
  identifiedDate: Date;
  verifiedBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrecedentRelationshipCreationAttributes
  extends Optional<PrecedentRelationshipAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Defines Sequelize model for precedent relationships.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Precedent relationship model
 *
 * @example
 * ```typescript
 * const RelationshipModel = definePrecedentRelationshipModel(sequelize);
 * const relationship = await RelationshipModel.create({
 *   sourceCaseId: 'case-123',
 *   targetCaseId: 'case-456',
 *   relationshipType: RelationshipType.FOLLOWS
 * });
 * ```
 */
export const definePrecedentRelationshipModel = (sequelize: Sequelize) => {
  class PrecedentRelationshipModel
    extends Model<PrecedentRelationshipAttributes, PrecedentRelationshipCreationAttributes>
    implements PrecedentRelationshipAttributes
  {
    public id!: string;
    public sourceCaseId!: string;
    public targetCaseId!: string;
    public relationshipType!: RelationshipType;
    public strength!: number;
    public description?: string;
    public identifiedDate!: Date;
    public verifiedBy?: string;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PrecedentRelationshipModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sourceCaseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'legal_cases',
          key: 'id',
        },
      },
      targetCaseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'legal_cases',
          key: 'id',
        },
      },
      relationshipType: {
        type: DataTypes.ENUM(...Object.values(RelationshipType)),
        allowNull: false,
      },
      strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        validate: {
          min: 0,
          max: 100,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      verifiedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
      tableName: 'precedent_relationships',
      timestamps: true,
      indexes: [
        { fields: ['sourceCaseId'] },
        { fields: ['targetCaseId'] },
        { fields: ['relationshipType'] },
        { fields: ['identifiedDate'] },
      ],
    },
  );

  return PrecedentRelationshipModel;
};

// ============================================================================
// PRECEDENT IDENTIFICATION FUNCTIONS
// ============================================================================

/**
 * Identifies potential precedents for a given legal issue.
 *
 * @param {string} legalIssue - Legal issue description
 * @param {string} jurisdiction - Target jurisdiction
 * @param {LegalPrecedent[]} candidatePrecedents - Pool of candidate precedents
 * @returns {LegalPrecedent[]} Identified relevant precedents sorted by relevance
 *
 * @example
 * ```typescript
 * const precedents = identifyRelevantPrecedents(
 *   'Fourth Amendment search and seizure',
 *   'federal',
 *   allPrecedents
 * );
 * ```
 */
export const identifyRelevantPrecedents = (
  legalIssue: string,
  jurisdiction: string,
  candidatePrecedents: LegalPrecedent[],
): LegalPrecedent[] => {
  const issueTokens = legalIssue.toLowerCase().split(/\s+/);

  return candidatePrecedents
    .filter((p) => p.jurisdiction === jurisdiction || p.bindingJurisdictions.includes(jurisdiction))
    .map((precedent) => {
      const principleText = precedent.keyPrinciples.join(' ').toLowerCase();
      const matchCount = issueTokens.filter((token) => principleText.includes(token)).length;
      const relevanceScore = (matchCount / issueTokens.length) * 100;

      return { precedent, relevanceScore };
    })
    .filter((item) => item.relevanceScore > 20)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map((item) => item.precedent);
};

/**
 * Finds precedents by specific holdings.
 *
 * @param {string} holdingQuery - Holding search query
 * @param {LegalPrecedent[]} precedents - Precedents to search
 * @returns {Array<{precedent: LegalPrecedent; matchingHoldings: Holding[]}>} Matching precedents with holdings
 *
 * @example
 * ```typescript
 * const matches = findPrecedentsByHolding('reasonable expectation of privacy', precedents);
 * ```
 */
export const findPrecedentsByHolding = (
  holdingQuery: string,
  precedents: LegalPrecedent[],
): Array<{ precedent: LegalPrecedent; matchingHoldings: Holding[] }> => {
  const queryLower = holdingQuery.toLowerCase();

  return precedents
    .map((precedent) => {
      const matchingHoldings = precedent.holdings.filter(
        (h) =>
          h.statement?.toLowerCase().includes(queryLower) ||
          h.legalPrinciple?.toLowerCase().includes(queryLower),
      );

      return { precedent, matchingHoldings };
    })
    .filter((item) => item.matchingHoldings.length > 0);
};

/**
 * Identifies landmark precedents in a jurisdiction.
 *
 * @param {string} jurisdiction - Target jurisdiction
 * @param {LegalPrecedent[]} precedents - All precedents
 * @param {number} minCitations - Minimum citation count (default: 100)
 * @returns {LegalPrecedent[]} Landmark precedents sorted by importance
 *
 * @example
 * ```typescript
 * const landmarks = identifyLandmarkPrecedents('federal', allPrecedents, 500);
 * ```
 */
export const identifyLandmarkPrecedents = (
  jurisdiction: string,
  precedents: LegalPrecedent[],
  minCitations: number = 100,
): LegalPrecedent[] => {
  return precedents
    .filter((p) => p.jurisdiction === jurisdiction && p.citationCount >= minCitations && p.status === PrecedentStatus.ACTIVE)
    .sort((a, b) => b.citationCount - a.citationCount);
};

/**
 * Identifies recent precedents within a time window.
 *
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @param {LegalPrecedent[]} precedents - All precedents
 * @returns {LegalPrecedent[]} Recent precedents
 *
 * @example
 * ```typescript
 * const recent = identifyRecentPrecedents(
 *   new Date('2020-01-01'),
 *   new Date('2024-12-31'),
 *   allPrecedents
 * );
 * ```
 */
export const identifyRecentPrecedents = (
  fromDate: Date,
  toDate: Date,
  precedents: LegalPrecedent[],
): LegalPrecedent[] => {
  return precedents
    .filter((p) => p.decisionDate >= fromDate && p.decisionDate <= toDate)
    .sort((a, b) => b.decisionDate.getTime() - a.decisionDate.getTime());
};

// ============================================================================
// AUTHORITY CLASSIFICATION FUNCTIONS
// ============================================================================

/**
 * Classifies whether a precedent is binding or persuasive for a jurisdiction.
 *
 * @param {LegalPrecedent} precedent - Precedent to classify
 * @param {string} targetJurisdiction - Target jurisdiction
 * @param {string} targetCourtId - Target court ID
 * @returns {AuthorityClassification} Authority classification result
 *
 * @example
 * ```typescript
 * const classification = classifyPrecedentAuthority(precedent, 'california', 'ca-supreme-court');
 * ```
 */
export const classifyPrecedentAuthority = (
  precedent: LegalPrecedent,
  targetJurisdiction: string,
  targetCourtId: string,
): AuthorityClassification => {
  const isBindingJurisdiction = precedent.bindingJurisdictions.includes(targetJurisdiction);
  const isPersuasiveJurisdiction = precedent.persuasiveJurisdictions.includes(targetJurisdiction);
  const isSameJurisdiction = precedent.jurisdiction === targetJurisdiction;

  let authorityType: AuthorityType;
  let bindingReason: string | undefined;
  let applicabilityScore = 0;

  if (isBindingJurisdiction) {
    authorityType = AuthorityType.BINDING;
    bindingReason = 'Precedent from superior court in same jurisdiction';
    applicabilityScore = 90;
  } else if (isSameJurisdiction) {
    authorityType = AuthorityType.PERSUASIVE;
    bindingReason = 'Same jurisdiction, different court level';
    applicabilityScore = 70;
  } else if (isPersuasiveJurisdiction) {
    authorityType = AuthorityType.PERSUASIVE;
    applicabilityScore = 50;
  } else {
    authorityType = AuthorityType.INFORMATIVE;
    applicabilityScore = 30;
  }

  const hierarchyDistance = calculateHierarchyDistance(precedent.courtLevel);
  const jurisdictionalAlignment = isSameJurisdiction ? 100 : isPersuasiveJurisdiction ? 60 : 20;
  const temporalRelevance = calculateTemporalRelevance(precedent.decisionDate);
  const overallStrength = (applicabilityScore + jurisdictionalAlignment + temporalRelevance) / 3;

  return {
    precedentId: precedent.id,
    targetJurisdiction,
    targetCourt: targetCourtId,
    authorityType,
    bindingReason,
    applicabilityScore,
    hierarchyDistance,
    jurisdictionalAlignment,
    temporalRelevance,
    overallStrength,
  };
};

/**
 * Determines binding authority level for a precedent.
 *
 * @param {AuthorityClassification} classification - Authority classification
 * @returns {BindingLevel} Binding level
 *
 * @example
 * ```typescript
 * const bindingLevel = determineBindingLevel(classification);
 * ```
 */
export const determineBindingLevel = (classification: AuthorityClassification): BindingLevel => {
  if (classification.authorityType === AuthorityType.BINDING && classification.applicabilityScore >= 85) {
    return BindingLevel.STRICTLY_BINDING;
  } else if (classification.authorityType === AuthorityType.BINDING) {
    return BindingLevel.PRESUMPTIVELY_BINDING;
  } else if (classification.authorityType === AuthorityType.PERSUASIVE) {
    return BindingLevel.PERSUASIVE;
  } else {
    return BindingLevel.NOT_BINDING;
  }
};

/**
 * Evaluates jurisdictional reach of a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to evaluate
 * @returns {string[]} List of jurisdictions where precedent has authority
 *
 * @example
 * ```typescript
 * const reach = evaluateJurisdictionalReach(precedent);
 * // Result: ['federal', 'california', 'ninth-circuit']
 * ```
 */
export const evaluateJurisdictionalReach = (precedent: LegalPrecedent): string[] => {
  const reach = new Set<string>();

  reach.add(precedent.jurisdiction);
  precedent.bindingJurisdictions.forEach((j) => reach.add(j));
  precedent.persuasiveJurisdictions.forEach((j) => reach.add(j));

  return Array.from(reach);
};

/**
 * Compares authority strength between multiple precedents.
 *
 * @param {LegalPrecedent[]} precedents - Precedents to compare
 * @param {string} targetJurisdiction - Target jurisdiction
 * @returns {Array<{precedent: LegalPrecedent; authorityScore: number}>} Ranked precedents
 *
 * @example
 * ```typescript
 * const ranked = compareAuthorityStrength(precedents, 'california');
 * ```
 */
export const compareAuthorityStrength = (
  precedents: LegalPrecedent[],
  targetJurisdiction: string,
): Array<{ precedent: LegalPrecedent; authorityScore: number }> => {
  return precedents
    .map((precedent) => {
      const classification = classifyPrecedentAuthority(precedent, targetJurisdiction, '');
      return {
        precedent,
        authorityScore: classification.overallStrength,
      };
    })
    .sort((a, b) => b.authorityScore - a.authorityScore);
};

// ============================================================================
// PRECEDENT STRENGTH SCORING FUNCTIONS
// ============================================================================

/**
 * Calculates comprehensive precedent strength score.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @returns {PrecedentStrengthAnalysis} Detailed strength analysis
 *
 * @example
 * ```typescript
 * const analysis = calculatePrecedentStrength(precedent);
 * // Result: { overallStrength: 85, citationScore: 90, ... }
 * ```
 */
export const calculatePrecedentStrength = (precedent: LegalPrecedent): PrecedentStrengthAnalysis => {
  const citationScore = calculateCitationScore(precedent);
  const courtAuthorityScore = calculateCourtAuthorityScore(precedent.courtLevel);
  const temporalScore = calculateTemporalRelevance(precedent.decisionDate);
  const treatmentScore = calculateTreatmentScore(precedent);
  const consistencyScore = calculateConsistencyScore(precedent);

  const factors: StrengthFactor[] = [
    { name: 'Citation Impact', score: citationScore, weight: 0.25, description: 'Number and quality of citations' },
    { name: 'Court Authority', score: courtAuthorityScore, weight: 0.3, description: 'Level of issuing court' },
    { name: 'Temporal Relevance', score: temporalScore, weight: 0.15, description: 'Recency of decision' },
    { name: 'Treatment History', score: treatmentScore, weight: 0.2, description: 'Positive vs negative treatment' },
    { name: 'Legal Consistency', score: consistencyScore, weight: 0.1, description: 'Consistency with other precedents' },
  ];

  const overallStrength = factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (citationScore > 80) strengths.push('Widely cited and influential');
  if (citationScore < 30) weaknesses.push('Limited citation impact');
  if (courtAuthorityScore > 80) strengths.push('Issued by high-authority court');
  if (treatmentScore > 75) strengths.push('Consistently followed by subsequent courts');
  if (treatmentScore < 40) weaknesses.push('Frequently distinguished or questioned');
  if (temporalScore < 40) weaknesses.push('Dated precedent, may not reflect current law');

  return {
    precedentId: precedent.id,
    overallStrength,
    citationScore,
    courtAuthorityScore,
    temporalScore,
    treatmentScore,
    consistencyScore,
    factors,
    weaknesses,
    strengths,
  };
};

/**
 * Scores precedent based on citation metrics.
 *
 * @param {LegalPrecedent} precedent - Precedent to score
 * @returns {number} Citation score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCitationScore(precedent);
 * ```
 */
export const calculateCitationScore = (precedent: LegalPrecedent): number => {
  const totalCitations = precedent.citationCount;
  const positiveRatio = precedent.positiveCitations / Math.max(totalCitations, 1);

  // Normalize citation count (diminishing returns after 1000 citations)
  const citationComponent = Math.min((totalCitations / 1000) * 70, 70);
  const positivityComponent = positiveRatio * 30;

  return Math.min(citationComponent + positivityComponent, 100);
};

/**
 * Scores precedent based on court authority level.
 *
 * @param {CourtLevel} courtLevel - Court level
 * @returns {number} Court authority score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateCourtAuthorityScore(CourtLevel.SUPREME_COURT);
 * // Result: 100
 * ```
 */
export const calculateCourtAuthorityScore = (courtLevel: CourtLevel): number => {
  const scores: Record<CourtLevel, number> = {
    [CourtLevel.SUPREME_COURT]: 100,
    [CourtLevel.APPELLATE_COURT]: 85,
    [CourtLevel.SUPERIOR_COURT]: 70,
    [CourtLevel.DISTRICT_COURT]: 60,
    [CourtLevel.TRIAL_COURT]: 50,
    [CourtLevel.MUNICIPAL_COURT]: 40,
    [CourtLevel.SPECIALIZED_COURT]: 65,
  };

  return scores[courtLevel] || 50;
};

/**
 * Calculates temporal relevance score based on decision date.
 *
 * @param {Date} decisionDate - Date of decision
 * @returns {number} Temporal relevance score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateTemporalRelevance(new Date('2020-01-01'));
 * ```
 */
export const calculateTemporalRelevance = (decisionDate: Date): number => {
  const now = new Date();
  const yearsOld = (now.getTime() - decisionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

  if (yearsOld < 5) return 100;
  if (yearsOld < 10) return 90;
  if (yearsOld < 20) return 75;
  if (yearsOld < 30) return 60;
  if (yearsOld < 50) return 45;
  return 30;
};

/**
 * Calculates treatment score based on citation treatment.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @returns {number} Treatment score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateTreatmentScore(precedent);
 * ```
 */
export const calculateTreatmentScore = (precedent: LegalPrecedent): number => {
  const total = precedent.positiveCitations + precedent.negativeCitations + precedent.neutralCitations;

  if (total === 0) return 50; // Default for no treatment data

  const positiveWeight = precedent.positiveCitations * 1.0;
  const neutralWeight = precedent.neutralCitations * 0.5;
  const negativeWeight = precedent.negativeCitations * -1.0;

  const rawScore = (positiveWeight + neutralWeight + negativeWeight) / total;
  return Math.max(0, Math.min(100, (rawScore + 1) * 50)); // Normalize to 0-100
};

/**
 * Evaluates consistency of precedent with related cases.
 *
 * @param {LegalPrecedent} precedent - Precedent to evaluate
 * @returns {number} Consistency score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateConsistencyScore(precedent);
 * ```
 */
export const calculateConsistencyScore = (precedent: LegalPrecedent): number => {
  // Simplified consistency calculation based on status and treatment
  if (precedent.status === PrecedentStatus.OVERRULED) return 0;
  if (precedent.status === PrecedentStatus.QUESTIONED) return 40;
  if (precedent.status === PrecedentStatus.MODIFIED) return 60;
  if (precedent.status === PrecedentStatus.ACTIVE) {
    const positiveRatio = precedent.positiveCitations / Math.max(precedent.citationCount, 1);
    return positiveRatio * 100;
  }
  return 50;
};

// ============================================================================
// OVERRULING DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects if a precedent has been overruled.
 *
 * @param {LegalPrecedent} precedent - Precedent to check
 * @param {PrecedentRelationship[]} relationships - All precedent relationships
 * @returns {OverrulingDetection} Overruling detection result
 *
 * @example
 * ```typescript
 * const detection = detectOverruling(precedent, relationships);
 * ```
 */
export const detectOverruling = (
  precedent: LegalPrecedent,
  relationships: PrecedentRelationship[],
): OverrulingDetection => {
  const overrulingRels = relationships.filter(
    (r) => r.targetCaseId === precedent.caseId && r.relationshipType === RelationshipType.OVERRULES,
  );

  if (overrulingRels.length === 0) {
    return {
      precedentId: precedent.id,
      isOverruled: false,
      overrulingScope: OverrulingScope.NONE,
      confidence: 95,
      reasoning: 'No overruling relationships detected',
    };
  }

  const latestOverruling = overrulingRels.sort(
    (a, b) => b.identifiedDate.getTime() - a.identifiedDate.getTime(),
  )[0];

  const partialOverruling: PartialOverruling[] = [];
  const scope = latestOverruling.strength >= 80 ? OverrulingScope.COMPLETE : OverrulingScope.PARTIAL;

  return {
    precedentId: precedent.id,
    isOverruled: true,
    overrulingCaseId: latestOverruling.sourceCaseId,
    overrulingDate: latestOverruling.identifiedDate,
    overrulingScope: scope,
    confidence: latestOverruling.strength,
    reasoning: latestOverruling.description || 'Explicitly overruled by subsequent decision',
    partialOverruling: partialOverruling.length > 0 ? partialOverruling : undefined,
  };
};

/**
 * Identifies cases that have overruled a specific holding.
 *
 * @param {Holding} holding - Holding to check
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {string[]} Case IDs that overruled the holding
 *
 * @example
 * ```typescript
 * const overrulers = identifyHoldingOverrule(holding, relationships);
 * ```
 */
export const identifyHoldingOverrule = (holding: Holding, relationships: PrecedentRelationship[]): string[] => {
  return relationships
    .filter(
      (r) =>
        r.targetCaseId === holding.precedentId &&
        (r.relationshipType === RelationshipType.OVERRULES || r.relationshipType === RelationshipType.MODIFIES),
    )
    .map((r) => r.sourceCaseId);
};

/**
 * Analyzes the scope of overruling (complete vs partial).
 *
 * @param {LegalPrecedent} precedent - Overruled precedent
 * @param {string} overrulingCaseId - Case that overruled
 * @param {PrecedentRelationship} relationship - Relationship details
 * @returns {OverrulingScope} Scope of overruling
 *
 * @example
 * ```typescript
 * const scope = analyzeOverrulingScope(precedent, 'case-123', relationship);
 * ```
 */
export const analyzeOverrulingScope = (
  precedent: LegalPrecedent,
  overrulingCaseId: string,
  relationship: PrecedentRelationship,
): OverrulingScope => {
  if (relationship.strength >= 90) return OverrulingScope.COMPLETE;
  if (relationship.strength >= 60) return OverrulingScope.PARTIAL;
  if (relationship.strength >= 40) return OverrulingScope.IMPLICIT;
  return OverrulingScope.NONE;
};

/**
 * Tracks overruling history of a precedent over time.
 *
 * @param {LegalPrecedent} precedent - Precedent to track
 * @param {PrecedentRelationship[]} relationships - Historical relationships
 * @returns {TreatmentEvent[]} Timeline of overruling events
 *
 * @example
 * ```typescript
 * const history = trackOverrulingHistory(precedent, relationships);
 * ```
 */
export const trackOverrulingHistory = (
  precedent: LegalPrecedent,
  relationships: PrecedentRelationship[],
): TreatmentEvent[] => {
  return relationships
    .filter((r) => r.targetCaseId === precedent.caseId && r.relationshipType === RelationshipType.OVERRULES)
    .map((r) => ({
      citingCaseId: r.sourceCaseId,
      citingCaseName: '', // Would be populated from case data
      date: r.identifiedDate,
      treatment: r.relationshipType,
      context: r.description,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

// ============================================================================
// STARE DECISIS ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyzes whether stare decisis requires following a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {string} currentCaseId - Current case ID
 * @param {string} currentJurisdiction - Current jurisdiction
 * @param {string[]} currentFactors - Current case fact pattern
 * @returns {StareDecisisAnalysis} Stare decisis analysis result
 *
 * @example
 * ```typescript
 * const analysis = analyzeStareDecisis(precedent, 'case-123', 'california', factPattern);
 * ```
 */
export const analyzeStareDecisis = (
  precedent: LegalPrecedent,
  currentCaseId: string,
  currentJurisdiction: string,
  currentFactors: string[],
): StareDecisisAnalysis => {
  const jurisdictionalBinding = precedent.bindingJurisdictions.includes(currentJurisdiction);
  const classification = classifyPrecedentAuthority(precedent, currentJurisdiction, '');
  const bindingLevel = determineBindingLevel(classification);

  const factorsSimilarity = calculateFactorSimilarity(precedent.factPattern, currentFactors.join(' '));
  const legalIssuesSimilarity = 75; // Simplified

  const distinguishingFactors: string[] = [];
  const supportingFactors: string[] = [];

  if (factorsSimilarity < 50) {
    distinguishingFactors.push('Significant factual differences exist');
  } else {
    supportingFactors.push('Factual patterns are substantially similar');
  }

  if (!jurisdictionalBinding) {
    distinguishingFactors.push('Different jurisdiction - not binding');
  } else {
    supportingFactors.push('Same jurisdiction - binding authority');
  }

  let recommendation: StareDecisisRecommendation;
  const shouldFollow = bindingLevel === BindingLevel.STRICTLY_BINDING && factorsSimilarity > 60;

  if (shouldFollow) {
    recommendation = StareDecisisRecommendation.FOLLOW_PRECEDENT;
  } else if (factorsSimilarity < 50) {
    recommendation = StareDecisisRecommendation.DISTINGUISH_PRECEDENT;
  } else if (bindingLevel === BindingLevel.PERSUASIVE) {
    recommendation = StareDecisisRecommendation.CONSIDER_PERSUASIVE;
  } else {
    recommendation = StareDecisisRecommendation.DISTINGUISH_PRECEDENT;
  }

  return {
    precedentId: precedent.id,
    currentCaseId,
    shouldFollow,
    bindingLevel,
    factorsSimilarity,
    legalIssuesSimilarity,
    jurisdictionalBinding,
    distinguishingFactors,
    supportingFactors,
    recommendation,
  };
};

/**
 * Evaluates factors for distinguishing a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to distinguish
 * @param {string} currentFactPattern - Current case fact pattern
 * @returns {string[]} List of distinguishing factors
 *
 * @example
 * ```typescript
 * const factors = evaluateDistinguishingFactors(precedent, currentFacts);
 * ```
 */
export const evaluateDistinguishingFactors = (
  precedent: LegalPrecedent,
  currentFactPattern: string,
): string[] => {
  const factors: string[] = [];

  const similarity = calculateFactorSimilarity(precedent.factPattern, currentFactPattern);

  if (similarity < 40) {
    factors.push('Materially different fact patterns');
  }

  if (precedent.status === PrecedentStatus.QUESTIONED) {
    factors.push('Precedent has been questioned by subsequent courts');
  }

  if (precedent.status === PrecedentStatus.LIMITED) {
    factors.push('Precedent has been limited to specific circumstances');
  }

  const age = calculateTemporalRelevance(precedent.decisionDate);
  if (age < 40) {
    factors.push('Precedent may be outdated given legal developments');
  }

  return factors;
};

/**
 * Determines if a precedent should be followed based on stare decisis principles.
 *
 * @param {StareDecisisAnalysis} analysis - Stare decisis analysis
 * @returns {boolean} Whether precedent should be followed
 *
 * @example
 * ```typescript
 * const shouldFollow = shouldFollowPrecedent(analysis);
 * ```
 */
export const shouldFollowPrecedent = (analysis: StareDecisisAnalysis): boolean => {
  return (
    analysis.shouldFollow &&
    analysis.bindingLevel === BindingLevel.STRICTLY_BINDING &&
    analysis.factorsSimilarity > 60
  );
};

/**
 * Generates recommendation for applying precedent.
 *
 * @param {StareDecisisAnalysis} analysis - Stare decisis analysis
 * @returns {string} Detailed recommendation
 *
 * @example
 * ```typescript
 * const recommendation = generatePrecedentRecommendation(analysis);
 * ```
 */
export const generatePrecedentRecommendation = (analysis: StareDecisisAnalysis): string => {
  switch (analysis.recommendation) {
    case StareDecisisRecommendation.FOLLOW_PRECEDENT:
      return `This precedent is binding and factually similar (${analysis.factorsSimilarity.toFixed(0)}% similarity). The court should follow this precedent under stare decisis principles.`;
    case StareDecisisRecommendation.DISTINGUISH_PRECEDENT:
      return `This precedent can be distinguished based on: ${analysis.distinguishingFactors.join(', ')}. The court may decline to follow.`;
    case StareDecisisRecommendation.CONSIDER_PERSUASIVE:
      return `This precedent is persuasive but not binding. The court should consider its reasoning but is not required to follow.`;
    case StareDecisisRecommendation.OVERRULE_PRECEDENT:
      return `Sufficient grounds exist to consider overruling this precedent. Analysis of distinguishing factors suggests reconsideration.`;
    case StareDecisisRecommendation.MODIFY_PRECEDENT:
      return `This precedent should be followed with modifications to account for changed circumstances or factual distinctions.`;
    default:
      return 'Further analysis required to determine precedent applicability.';
  }
};

// ============================================================================
// CITATION TREATMENT ANALYSIS
// ============================================================================

/**
 * Analyzes how a precedent has been treated by subsequent cases.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {CitationTreatment} Citation treatment analysis
 *
 * @example
 * ```typescript
 * const treatment = analyzeCitationTreatment(precedent, relationships);
 * ```
 */
export const analyzeCitationTreatment = (
  precedent: LegalPrecedent,
  relationships: PrecedentRelationship[],
): CitationTreatment => {
  const treatmentHistory = relationships
    .filter((r) => r.targetCaseId === precedent.caseId)
    .map((r) => ({
      citingCaseId: r.sourceCaseId,
      citingCaseName: '', // Would be populated
      date: r.identifiedDate,
      treatment: r.relationshipType,
      context: r.description,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const positiveTreatment = treatmentHistory.filter(
    (t) => t.treatment === RelationshipType.FOLLOWS || t.treatment === RelationshipType.CITES_APPROVINGLY,
  ).length;

  const negativeTreatment = treatmentHistory.filter(
    (t) =>
      t.treatment === RelationshipType.OVERRULES ||
      t.treatment === RelationshipType.DISTINGUISHES ||
      t.treatment === RelationshipType.CITES_CRITICALLY,
  ).length;

  const neutralTreatment = treatmentHistory.filter((t) => t.treatment === RelationshipType.CITES_NEUTRALLY).length;

  let overallSentiment: CitationSentiment;
  const positiveRatio = positiveTreatment / Math.max(treatmentHistory.length, 1);

  if (positiveRatio > 0.8) {
    overallSentiment = CitationSentiment.STRONGLY_POSITIVE;
  } else if (positiveRatio > 0.6) {
    overallSentiment = CitationSentiment.POSITIVE;
  } else if (positiveRatio > 0.4) {
    overallSentiment = CitationSentiment.NEUTRAL;
  } else if (positiveRatio > 0.2) {
    overallSentiment = CitationSentiment.NEGATIVE;
  } else {
    overallSentiment = CitationSentiment.STRONGLY_NEGATIVE;
  }

  return {
    precedentId: precedent.id,
    totalCitations: treatmentHistory.length,
    positiveTreatment,
    negativeTreatment,
    neutralTreatment,
    treatmentHistory,
    overallSentiment,
  };
};

/**
 * Identifies negative treatment of a precedent.
 *
 * @param {LegalPrecedent} precedent - Precedent to analyze
 * @param {PrecedentRelationship[]} relationships - All relationships
 * @returns {TreatmentEvent[]} Negative treatment events
 *
 * @example
 * ```typescript
 * const negativeTreatment = identifyNegativeTreatment(precedent, relationships);
 * ```
 */
export const identifyNegativeTreatment = (
  precedent: LegalPrecedent,
  relationships: PrecedentRelationship[],
): TreatmentEvent[] => {
  const negativeTypes = [
    RelationshipType.OVERRULES,
    RelationshipType.DISTINGUISHES,
    RelationshipType.QUESTIONS,
    RelationshipType.CITES_CRITICALLY,
  ];

  return relationships
    .filter((r) => r.targetCaseId === precedent.caseId && negativeTypes.includes(r.relationshipType))
    .map((r) => ({
      citingCaseId: r.sourceCaseId,
      citingCaseName: '',
      date: r.identifiedDate,
      treatment: r.relationshipType,
      context: r.description,
    }));
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates hierarchy distance for a court level.
 *
 * @param {CourtLevel} level - Court level
 * @returns {number} Hierarchy distance (0-6)
 */
const calculateHierarchyDistance = (level: CourtLevel): number => {
  const distances: Record<CourtLevel, number> = {
    [CourtLevel.SUPREME_COURT]: 0,
    [CourtLevel.APPELLATE_COURT]: 1,
    [CourtLevel.SUPERIOR_COURT]: 2,
    [CourtLevel.DISTRICT_COURT]: 3,
    [CourtLevel.TRIAL_COURT]: 4,
    [CourtLevel.MUNICIPAL_COURT]: 5,
    [CourtLevel.SPECIALIZED_COURT]: 2,
  };
  return distances[level] || 3;
};

/**
 * Calculates similarity between two fact patterns.
 *
 * @param {string} pattern1 - First fact pattern
 * @param {string} pattern2 - Second fact pattern
 * @returns {number} Similarity score (0-100)
 */
const calculateFactorSimilarity = (pattern1: string, pattern2: string): number => {
  const tokens1 = pattern1.toLowerCase().split(/\s+/);
  const tokens2 = pattern2.toLowerCase().split(/\s+/);

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return (intersection.size / union.size) * 100;
};

// ============================================================================
// SWAGGER/OPENAPI SCHEMA DEFINITIONS
// ============================================================================

/**
 * Creates Swagger schema for LegalPrecedent.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createLegalPrecedentSwaggerSchema();
 * ```
 */
export const createLegalPrecedentSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Unique precedent identifier' },
      caseId: { type: 'string', format: 'uuid', description: 'Associated case ID' },
      caseName: { type: 'string', description: 'Case name' },
      citation: { type: 'string', description: 'Legal citation' },
      decisionDate: { type: 'string', format: 'date-time' },
      courtLevel: { type: 'string', enum: Object.values(CourtLevel) },
      authorityType: { type: 'string', enum: Object.values(AuthorityType) },
      precedentStrength: { type: 'integer', minimum: 0, maximum: 100 },
      status: { type: 'string', enum: Object.values(PrecedentStatus) },
      holdings: { type: 'array', items: { type: 'object' } },
      citationCount: { type: 'integer' },
      bindingJurisdictions: { type: 'array', items: { type: 'string' } },
    },
  };
};

/**
 * Creates Swagger schema for PrecedentStrengthAnalysis.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createPrecedentStrengthSwaggerSchema();
 * ```
 */
export const createPrecedentStrengthSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      precedentId: { type: 'string', format: 'uuid' },
      overallStrength: { type: 'number', minimum: 0, maximum: 100 },
      citationScore: { type: 'number', minimum: 0, maximum: 100 },
      courtAuthorityScore: { type: 'number', minimum: 0, maximum: 100 },
      temporalScore: { type: 'number', minimum: 0, maximum: 100 },
      treatmentScore: { type: 'number', minimum: 0, maximum: 100 },
      consistencyScore: { type: 'number', minimum: 0, maximum: 100 },
      factors: { type: 'array', items: { type: 'object' } },
      strengths: { type: 'array', items: { type: 'string' } },
      weaknesses: { type: 'array', items: { type: 'string' } },
    },
  };
};

/**
 * Creates Swagger schema for StareDecisisAnalysis.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createStareDecisisSwaggerSchema();
 * ```
 */
export const createStareDecisisSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      precedentId: { type: 'string', format: 'uuid' },
      currentCaseId: { type: 'string', format: 'uuid' },
      shouldFollow: { type: 'boolean' },
      bindingLevel: { type: 'string', enum: Object.values(BindingLevel) },
      factorsSimilarity: { type: 'number', minimum: 0, maximum: 100 },
      legalIssuesSimilarity: { type: 'number', minimum: 0, maximum: 100 },
      jurisdictionalBinding: { type: 'boolean' },
      distinguishingFactors: { type: 'array', items: { type: 'string' } },
      supportingFactors: { type: 'array', items: { type: 'string' } },
      recommendation: { type: 'string', enum: Object.values(StareDecisisRecommendation) },
    },
  };
};

/**
 * Creates Swagger schema for OverrulingDetection.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createOverrulingDetectionSwaggerSchema();
 * ```
 */
export const createOverrulingDetectionSwaggerSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      precedentId: { type: 'string', format: 'uuid' },
      isOverruled: { type: 'boolean' },
      overrulingCaseId: { type: 'string', format: 'uuid', nullable: true },
      overrulingCaseName: { type: 'string', nullable: true },
      overrulingDate: { type: 'string', format: 'date-time', nullable: true },
      overrulingScope: { type: 'string', enum: Object.values(OverrulingScope) },
      confidence: { type: 'number', minimum: 0, maximum: 100 },
      reasoning: { type: 'string' },
    },
  };
};

/**
 * Creates Swagger operation for precedent search endpoint.
 *
 * @returns {Record<string, any>} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = createPrecedentSearchSwaggerOperation();
 * ```
 */
export const createPrecedentSearchSwaggerOperation = (): Record<string, any> => {
  return {
    summary: 'Search legal precedents',
    description: 'Performs comprehensive search across legal precedents with authority classification and strength scoring',
    tags: ['Precedent Analysis'],
    parameters: [
      {
        name: 'query',
        in: 'query',
        description: 'Search query text',
        required: false,
        schema: { type: 'string' },
      },
      {
        name: 'jurisdiction',
        in: 'query',
        description: 'Filter by jurisdiction',
        required: false,
        schema: { type: 'array', items: { type: 'string' } },
      },
      {
        name: 'courtLevel',
        in: 'query',
        description: 'Filter by court level',
        required: false,
        schema: { type: 'array', items: { type: 'string', enum: Object.values(CourtLevel) } },
      },
      {
        name: 'minStrength',
        in: 'query',
        description: 'Minimum precedent strength score',
        required: false,
        schema: { type: 'integer', minimum: 0, maximum: 100 },
      },
    ],
  };
};
