/**
 * Entity Risk Assessment Kit
 *
 * Comprehensive production-grade TypeScript module for enterprise entity risk management,
 * featuring 40 specialized functions for risk profiling, corporate structure analysis,
 * ownership verification, regulatory compliance, and financial health assessment.
 *
 * Integration: Sequelize ORM, type-safe database operations, event-driven architecture
 *
 * @module entity-risk-assessment-kit
 * @version 1.0.0
 * @author Financial Risk Engineering Team
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Risk severity levels with ordinal ranking
 */
export declare enum RiskSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    MINIMAL = "MINIMAL"
}
/**
 * Entity classification types for regulatory and operational categorization
 */
export declare enum EntityType {
    INDIVIDUAL = "INDIVIDUAL",
    SOLE_PROPRIETOR = "SOLE_PROPRIETOR",
    PARTNERSHIP = "PARTNERSHIP",
    CORPORATION = "CORPORATION",
    LLC = "LLC",
    TRUST = "TRUST",
    FOUNDATION = "FOUNDATION",
    NON_PROFIT = "NON_PROFIT",
    GOVERNMENT = "GOVERNMENT",
    FINANCIAL_INSTITUTION = "FINANCIAL_INSTITUTION"
}
/**
 * Risk tier classifications for tiered risk management strategies
 */
export declare enum RiskTier {
    TIER_1_CRITICAL = "TIER_1_CRITICAL",
    TIER_2_HIGH = "TIER_2_HIGH",
    TIER_3_MEDIUM = "TIER_3_MEDIUM",
    TIER_4_LOW = "TIER_4_LOW",
    TIER_5_MINIMAL = "TIER_5_MINIMAL"
}
/**
 * Industry sector classifications for sector-specific risk analysis
 */
export declare enum IndustrySector {
    FINANCIAL_SERVICES = "FINANCIAL_SERVICES",
    HEALTHCARE = "HEALTHCARE",
    TECHNOLOGY = "TECHNOLOGY",
    ENERGY = "ENERGY",
    MANUFACTURING = "MANUFACTURING",
    REAL_ESTATE = "REAL_ESTATE",
    RETAIL = "RETAIL",
    HOSPITALITY = "HOSPITALITY",
    TRANSPORTATION = "TRANSPORTATION",
    MINING = "MINING",
    AGRICULTURE = "AGRICULTURE",
    DEFENSE = "DEFENSE",
    CHEMICALS = "CHEMICALS",
    PHARMACEUTICALS = "PHARMACEUTICALS",
    TELECOMMUNICATIONS = "TELECOMMUNICATIONS"
}
/**
 * Compliance status indicators for regulatory tracking
 */
export declare enum ComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    PARTIAL_COMPLIANCE = "PARTIAL_COMPLIANCE",
    UNDER_REVIEW = "UNDER_REVIEW",
    EXEMPTED = "EXEMPTED"
}
/**
 * Comprehensive entity risk profile interface
 */
export interface IEntityRiskProfile {
    entityId: string;
    riskScore: number;
    riskSeverity: RiskSeverity;
    riskTier: RiskTier;
    lastAssessmentDate: Date;
    nextReviewDate: Date;
    riskFactors: RiskFactor[];
    mitigationStrategies: string[];
    approvalRequired: boolean;
}
/**
 * Individual risk factor with weighting and scoring
 */
export interface RiskFactor {
    factorName: string;
    weight: number;
    score: number;
    impact: number;
    contributionPercentage: number;
    status: 'ACTIVE' | 'RESOLVED' | 'MONITORING';
}
/**
 * Corporate structure hierarchy representation
 */
export interface CorporateStructure {
    entityId: string;
    parentEntityId?: string;
    subsidiaries: string[];
    ownershipPercentage: number;
    structureType: 'PARENT' | 'SUBSIDIARY' | 'JOINT_VENTURE' | 'BRANCH';
    complexityScore: number;
    depth: number;
}
/**
 * Ultimate beneficial owner identification record
 */
export interface UltimatebeneficialOwner {
    uboBeneficiaryId: string;
    entityId: string;
    ownershipPercentage: number;
    controllingInterest: boolean;
    verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
    verificationDate?: Date;
    pep: boolean;
    sanctioned: boolean;
}
/**
 * Business activity and operational profile
 */
export interface BusinessActivityProfile {
    entityId: string;
    primaryActivities: string[];
    secondaryActivities: string[];
    geographicPresence: string[];
    employeeCount: number;
    annualRevenue: number;
    operationalRisk: number;
    complianceHistory: ComplianceStatus;
}
/**
 * Industry risk metrics and benchmarks
 */
export interface IndustryRiskMetrics {
    sector: IndustrySector;
    riskScore: number;
    regulatoryComplexity: number;
    amlRisk: number;
    sanctionsRisk: number;
    reputationalRisk: number;
    operationalRisk: number;
    lastUpdated: Date;
}
/**
 * Entity relationship and connection mapping
 */
export interface EntityRelationship {
    sourceEntityId: string;
    targetEntityId: string;
    relationshipType: 'OWNERSHIP' | 'CONTROL' | 'BOARD_MEMBER' | 'BUSINESS_ASSOCIATE' | 'SUBSIDIARY' | 'PARENT' | 'AFFILIATE';
    strength: number;
    conflictOfInterest: boolean;
    riskImplication: string;
}
/**
 * Third-party/vendor risk assessment result
 */
export interface ThirdPartyRiskAssessment {
    vendorId: string;
    riskScore: number;
    complianceStatus: ComplianceStatus;
    auditStatus: 'PASSED' | 'FAILED' | 'PENDING' | 'IN_PROGRESS';
    lastAuditDate: Date;
    dueDiligenceComplete: boolean;
    certifications: string[];
}
/**
 * Counterparty credit and financial risk
 */
export interface CounterpartyRisk {
    counterpartyId: string;
    creditScore: number;
    creditRating: string;
    defaultProbability: number;
    exposureAmount: number;
    collateralValue: number;
    riskMitigationTools: string[];
}
/**
 * Periodic risk review scheduling and execution record
 */
export interface RiskReviewSchedule {
    reviewId: string;
    entityId: string;
    reviewType: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'AD_HOC';
    scheduledDate: Date;
    completedDate?: Date;
    findingsCount: number;
    remediationRequired: boolean;
    nextScheduledReview: Date;
}
/**
 * Adverse media screening record
 */
export interface AdverseMediaRecord {
    recordId: string;
    entityId: string;
    source: string;
    content: string;
    severity: RiskSeverity;
    detectedDate: Date;
    verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'FALSE_POSITIVE';
    riskImpact: number;
}
/**
 * Sanctions screening integration record
 */
export interface SanctionsScreeningResult {
    screeningId: string;
    entityId: string;
    matchFound: boolean;
    matchScore: number;
    watchlistType: string;
    screeningDate: Date;
    nextScreeningDue: Date;
    investigationStatus: string;
}
/**
 * Financial health indicators for entity assessment
 */
export interface FinancialHealthMetrics {
    entityId: string;
    currentRatio: number;
    debtToEquity: number;
    profitMargin: number;
    roa: number;
    roe: number;
    operatingCashFlow: number;
    financialStability: 'STABLE' | 'DECLINING' | 'AT_RISK' | 'CRITICAL';
    lastUpdated: Date;
}
/**
 * Entity Risk Profile Model
 * Core persistence layer for entity risk assessments
 */
export declare class EntityRiskProfileModel extends Model {
    entityId: string;
    riskScore: number;
    riskSeverity: RiskSeverity;
    riskTier: RiskTier;
    lastAssessmentDate: Date;
    nextReviewDate: Date;
    riskFactors: RiskFactor[];
    mitigationStrategies: string[];
    approvalRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Corporate Structure Model
 * Tracks entity hierarchy and organizational relationships
 */
export declare class CorporateStructureModel extends Model {
    entityId: string;
    parentEntityId?: string;
    subsidiaries: string[];
    ownershipPercentage: number;
    structureType: string;
    complexityScore: number;
    depth: number;
}
/**
 * Beneficial Ownership Model
 * Ultimate beneficial owner tracking and verification
 */
export declare class BeneficialOwnershipModel extends Model {
    uboBeneficiaryId: string;
    entityId: string;
    ownershipPercentage: number;
    controllingInterest: boolean;
    verificationStatus: string;
    verificationDate?: Date;
    pep: boolean;
    sanctioned: boolean;
}
/**
 * Entity Relationship Model
 * Maps connections and dependencies between entities
 */
export declare class EntityRelationshipModel extends Model {
    sourceEntityId: string;
    targetEntityId: string;
    relationshipType: string;
    strength: number;
    conflictOfInterest: boolean;
    riskImplication: string;
}
/**
 * Industry Risk Model
 * Sector-specific risk metrics and benchmarks
 */
export declare class IndustryRiskModel extends Model {
    sector: IndustrySector;
    riskScore: number;
    regulatoryComplexity: number;
    amlRisk: number;
    sanctionsRisk: number;
    reputationalRisk: number;
    operationalRisk: number;
    lastUpdated: Date;
}
/**
 * Risk Review Schedule Model
 * Manages periodic review scheduling and execution
 */
export declare class RiskReviewScheduleModel extends Model {
    reviewId: string;
    entityId: string;
    reviewType: string;
    scheduledDate: Date;
    completedDate?: Date;
    findingsCount: number;
    remediationRequired: boolean;
    nextScheduledReview: Date;
}
/**
 * Adverse Media Model
 * Tracks adverse media screening results
 */
export declare class AdverseMediaModel extends Model {
    recordId: string;
    entityId: string;
    source: string;
    content: string;
    severity: RiskSeverity;
    detectedDate: Date;
    verificationStatus: string;
    riskImpact: number;
}
/**
 * Sanctions Screening Model
 * Stores sanctions database screening results
 */
export declare class SanctionsScreeningModel extends Model {
    screeningId: string;
    entityId: string;
    matchFound: boolean;
    matchScore: number;
    watchlistType: string;
    screeningDate: Date;
    nextScreeningDue: Date;
    investigationStatus: string;
}
/**
 * Financial Health Model
 * Stores and tracks financial health metrics
 */
export declare class FinancialHealthModel extends Model {
    entityId: string;
    currentRatio: number;
    debtToEquity: number;
    profitMargin: number;
    roa: number;
    roe: number;
    operatingCashFlow: number;
    financialStability: string;
    lastUpdated: Date;
}
/**
 * Initialize all models for entity risk assessment
 *
 * @param sequelize - Sequelize instance
 * @returns Object containing all initialized models
 * @throws Error if database initialization fails
 *
 * @example
 * const sequelize = new Sequelize(...);
 * const models = initializeEntityRiskModels(sequelize);
 */
export declare function initializeEntityRiskModels(sequelize: Sequelize): {
    EntityRiskProfileModel: typeof EntityRiskProfileModel;
    CorporateStructureModel: typeof CorporateStructureModel;
    BeneficialOwnershipModel: typeof BeneficialOwnershipModel;
    EntityRelationshipModel: typeof EntityRelationshipModel;
    IndustryRiskModel: typeof IndustryRiskModel;
    RiskReviewScheduleModel: typeof RiskReviewScheduleModel;
    AdverseMediaModel: typeof AdverseMediaModel;
    SanctionsScreeningModel: typeof SanctionsScreeningModel;
    FinancialHealthModel: typeof FinancialHealthModel;
};
/**
 * Create a new entity risk profile with initial assessment
 *
 * Initializes comprehensive risk profile for entity with baseline risk factors
 * and mitigation strategy framework
 *
 * @param entityId - Unique entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Created entity risk profile
 * @throws Error if entity already has active profile
 *
 * @example
 * const profile = await createEntityRiskProfile('ENT-123', sequelize);
 */
export declare function createEntityRiskProfile(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<IEntityRiskProfile>;
/**
 * Update entity risk profile with recalculated metrics
 *
 * Recalculates risk score, severity, and tier based on current risk factors
 * and assessment results
 *
 * @param entityId - Entity identifier
 * @param riskFactors - Updated risk factors array
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Updated entity risk profile
 * @throws Error if entity profile not found
 *
 * @example
 * const updated = await updateEntityRiskProfile('ENT-123', factors, sequelize);
 */
export declare function updateEntityRiskProfile(entityId: string, riskFactors: RiskFactor[], sequelize: Sequelize, transaction?: Transaction): Promise<IEntityRiskProfile>;
/**
 * Retrieve entity risk profile with full assessment history
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Complete entity risk profile
 * @throws Error if entity profile not found
 *
 * @example
 * const profile = await getEntityRiskProfile('ENT-123', sequelize);
 */
export declare function getEntityRiskProfile(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<IEntityRiskProfile>;
/**
 * Calculate composite risk score from all risk factors
 *
 * Computes weighted risk score based on individual factor weights,
 * scores, and impact assessments
 *
 * @param riskFactors - Array of risk factors with weights and scores
 * @returns Calculated risk score (0-100)
 *
 * @example
 * const score = calculateWeightedRiskScore([...factors]);
 */
export declare function calculateWeightedRiskScore(riskFactors: RiskFactor[]): number;
/**
 * Reassess entity risk profile with impact analysis
 *
 * Performs comprehensive reassessment considering all risk dimensions,
 * generates impact analysis, and recommends mitigation actions
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Reassessed risk profile with impact metrics
 * @throws Error if reassessment fails
 *
 * @example
 * const reassessed = await reassessEntityRiskProfile('ENT-123', sequelize);
 */
export declare function reassessEntityRiskProfile(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<IEntityRiskProfile & {
    impactAnalysis: Record<string, number>;
}>;
/**
 * Analyze corporate structure and hierarchy
 *
 * Maps organizational hierarchy, identifies parent-subsidiary relationships,
 * measures structural complexity
 *
 * @param entityId - Root entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Corporate structure analysis
 * @throws Error if analysis fails
 *
 * @example
 * const structure = await analyzeCorporateStructure('ENT-123', sequelize);
 */
export declare function analyzeCorporateStructure(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<CorporateStructure>;
/**
 * Map complete corporate hierarchy tree
 *
 * Creates comprehensive hierarchical map of all parent entities,
 * subsidiaries, and ownership chains
 *
 * @param rootEntityId - Root entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Hierarchical structure tree
 * @throws Error if hierarchy mapping fails
 *
 * @example
 * const tree = await mapCorporateHierarchy('ENT-123', sequelize);
 */
export declare function mapCorporateHierarchy(rootEntityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    root: CorporateStructure;
    children: CorporateStructure[];
}>;
/**
 * Identify ultimate beneficial owners (UBOs) in corporate structure
 *
 * Traces ownership chains to identify natural persons or entities
 * with ultimate beneficial interest, with verification status
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Array of identified UBOs
 * @throws Error if UBO identification fails
 *
 * @example
 * const ubos = await identifyUltimateBeneficialOwners('ENT-123', sequelize);
 */
export declare function identifyUltimateBeneficialOwners(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<UltimatebeneficialOwner[]>;
/**
 * Validate corporate structure integrity and consistency
 *
 * Verifies structural soundness, detects circular ownership,
 * validates chain continuity
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Validation result with findings
 * @throws Error if validation fails
 *
 * @example
 * const result = await validateCorporateStructure('ENT-123', sequelize);
 */
export declare function validateCorporateStructure(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    valid: boolean;
    issues: string[];
    circularOwnership: boolean;
}>;
/**
 * Get corporate structure analysis with metrics
 *
 * Comprehensive analysis including hierarchy depth, subsidiary count,
 * complexity metrics
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Structure analysis with metrics
 * @throws Error if analysis fails
 *
 * @example
 * const analysis = await getCorporateStructureAnalysis('ENT-123', sequelize);
 */
export declare function getCorporateStructureAnalysis(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<CorporateStructure & {
    subsidiaryCount: number;
}>;
/**
 * Assess business activities and operational profile
 *
 * Evaluates primary/secondary activities, geographic presence,
 * operational complexity
 *
 * @param entityId - Entity identifier
 * @param activities - Business activity details
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Business activity assessment
 * @throws Error if assessment fails
 *
 * @example
 * const assessment = await assessBusinessActivities('ENT-123', activities, sequelize);
 */
export declare function assessBusinessActivities(entityId: string, activities: string[], sequelize: Sequelize, transaction?: Transaction): Promise<BusinessActivityProfile>;
/**
 * Categorize business operations and classify activities
 *
 * Classifies operations into regulatory categories with risk assessment
 * for each category
 *
 * @param entityId - Entity identifier
 * @param operationalData - Operational data for classification
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Operational classification with risk per category
 * @throws Error if categorization fails
 *
 * @example
 * const categories = await categorizeBusinessOperations('ENT-123', data, sequelize);
 */
export declare function categorizeBusinessOperations(entityId: string, operationalData: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<Record<string, number>>;
/**
 * Analyze operational geography and jurisdictional exposure
 *
 * Identifies geographic footprint, regulatory jurisdictions,
 * cross-border risk implications
 *
 * @param entityId - Entity identifier
 * @param geographicData - Geographic operational data
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Geographic risk profile
 * @throws Error if analysis fails
 *
 * @example
 * const geoRisk = await analyzeOperationalGeography('ENT-123', geoData, sequelize);
 */
export declare function analyzeOperationalGeography(entityId: string, geographicData: string[], sequelize: Sequelize, transaction?: Transaction): Promise<{
    jurisdictions: string[];
    riskByJurisdiction: Record<string, number>;
    crossBorderRisk: number;
}>;
/**
 * Validate business model coherence and sustainability
 *
 * Validates consistency between stated activities, business model,
 * and regulatory permissions
 *
 * @param entityId - Entity identifier
 * @param businessModel - Business model details
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Validation result
 * @throws Error if validation fails
 *
 * @example
 * const valid = await validateBusinessModel('ENT-123', model, sequelize);
 */
export declare function validateBusinessModel(entityId: string, businessModel: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    valid: boolean;
    inconsistencies: string[];
}>;
/**
 * Verify complete ownership chain with documentation
 *
 * Traces full ownership chain from entity to ultimate beneficial owners
 * with documentation verification
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Ownership chain verification result
 * @throws Error if verification fails
 *
 * @example
 * const chain = await verifyOwnershipChain('ENT-123', sequelize);
 */
export declare function verifyOwnershipChain(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    verified: boolean;
    chainLength: number;
    documentationComplete: boolean;
    ubos: UltimatebeneficialOwner[];
}>;
/**
 * Validate ultimate beneficial owners against watchlists
 *
 * Screens UBOs against PEP, sanctions, and adverse media lists
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns UBO validation results with findings
 * @throws Error if validation fails
 *
 * @example
 * const validation = await validateUltimateBeneficialOwners('ENT-123', sequelize);
 */
export declare function validateUltimateBeneficialOwners(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<Array<UltimatebeneficialOwner & {
    watchlistMatches: boolean;
}>>;
/**
 * Detect ownership conflicts and related party transactions
 *
 * Identifies potential conflicts of interest, related party relationships,
 * and circular ownership scenarios
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Conflict detection results
 * @throws Error if detection fails
 *
 * @example
 * const conflicts = await detectOwnershipConflicts('ENT-123', sequelize);
 */
export declare function detectOwnershipConflicts(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    conflictsFound: boolean;
    conflicts: Array<{
        type: string;
        entities: string[];
        risk: number;
    }>;
}>;
/**
 * Analyze ownership changes and transfer history
 *
 * Tracks ownership changes over time, identifies unusual patterns,
 * flags rapid ownership transfers
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Ownership change analysis
 * @throws Error if analysis fails
 *
 * @example
 * const changes = await analyzeOwnershipChanges('ENT-123', sequelize);
 */
export declare function analyzeOwnershipChanges(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    changeCount: number;
    rapidTransfers: boolean;
    lastChangeDate?: Date;
    pattern: 'STABLE' | 'VOLATILE' | 'CONSOLIDATING';
}>;
/**
 * Score industry risk based on sector classification
 *
 * Calculates baseline industry risk score considering regulatory
 * complexity, AML risk, sanction exposure
 *
 * @param sector - Industry sector
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Industry risk score and metrics
 * @throws Error if scoring fails
 *
 * @example
 * const risk = await scoreIndustryRisk(IndustrySector.FINANCIAL_SERVICES, sequelize);
 */
export declare function scoreIndustryRisk(sector: IndustrySector, sequelize: Sequelize, transaction?: Transaction): Promise<IndustryRiskMetrics>;
/**
 * Evaluate industry regulations and compliance requirements
 *
 * Identifies applicable regulations, compliance obligations,
 * and audit requirements for sector
 *
 * @param sector - Industry sector
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Industry regulations and requirements
 * @throws Error if evaluation fails
 *
 * @example
 * const regs = await evaluateIndustryRegulations(IndustrySector.FINANCIAL_SERVICES, sequelize);
 */
export declare function evaluateIndustryRegulations(sector: IndustrySector, sequelize: Sequelize, transaction?: Transaction): Promise<{
    sector: IndustrySector;
    applicableRegulations: string[];
    complianceRequirements: string[];
    auditFrequency: string;
}>;
/**
 * Assess entity risk against industry benchmarks
 *
 * Compares entity-specific risk profile against industry sector
 * benchmarks and identifies outliers
 *
 * @param entityId - Entity identifier
 * @param sector - Industry sector
 * @param entityRiskScore - Entity's calculated risk score
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Benchmark comparison results
 * @throws Error if assessment fails
 *
 * @example
 * const benchmark = await benchmarkAgainstIndustry('ENT-123', FINANCIAL_SERVICES, 65, sequelize);
 */
export declare function benchmarkAgainstIndustry(entityId: string, sector: IndustrySector, entityRiskScore: number, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityScore: number;
    industryBenchmark: number;
    percentile: number;
    isOutlier: boolean;
    recommendation: string;
}>;
/**
 * Map all entity relationships and interdependencies
 *
 * Creates comprehensive map of entity connections, ownership chains,
 * business relationships
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Entity relationship map
 * @throws Error if mapping fails
 *
 * @example
 * const map = await mapEntityRelationships('ENT-123', sequelize);
 */
export declare function mapEntityRelationships(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entity: string;
    inbound: EntityRelationship[];
    outbound: EntityRelationship[];
    networkSize: number;
}>;
/**
 * Identify all related parties and connected entities
 *
 * Discovers indirect relationships, multi-hop connections,
 * network clusters
 *
 * @param entityId - Entity identifier
 * @param maxHops - Maximum relationship hops to traverse (default 3)
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Related parties and connection strength
 * @throws Error if identification fails
 *
 * @example
 * const related = await identifyRelatedParties('ENT-123', 3, sequelize);
 */
export declare function identifyRelatedParties(entityId: string, maxHops: number | undefined, sequelize: Sequelize, transaction?: Transaction): Promise<Array<{
    entityId: string;
    connectionStrength: number;
    hops: number;
}>>;
/**
 * Analyze relationship strength and interdependencies
 *
 * Quantifies relationship strength, identifies critical dependencies,
 * single points of failure
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Relationship strength analysis
 * @throws Error if analysis fails
 *
 * @example
 * const strength = await analyzeRelationshipStrength('ENT-123', sequelize);
 */
export declare function analyzeRelationshipStrength(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    criticalDependencies: string[];
    averageStrength: number;
    strongestLink: {
        entityId: string;
        strength: number;
    } | null;
    concentrationRisk: number;
}>;
/**
 * Evaluate third-party entity risk
 *
 * Comprehensive risk assessment for third-party vendors, suppliers,
 * service providers
 *
 * @param vendorId - Vendor identifier
 * @param riskProfile - Vendor risk profile data
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Third-party risk assessment
 * @throws Error if evaluation fails
 *
 * @example
 * const risk = await evaluateThirdPartyRisk('VENDOR-123', profile, sequelize);
 */
export declare function evaluateThirdPartyRisk(vendorId: string, riskProfile: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<ThirdPartyRiskAssessment>;
/**
 * Assess supply chain risk for vendors and suppliers
 *
 * Evaluates supply chain complexity, dependency risks, vendor
 * concentration
 *
 * @param entityId - Entity identifier
 * @param vendors - Vendor list
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Supply chain risk assessment
 * @throws Error if assessment fails
 *
 * @example
 * const scRisk = await assessSupplyChainRisk('ENT-123', vendors, sequelize);
 */
export declare function assessSupplyChainRisk(entityId: string, vendors: string[], sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorCount: number;
    concentrationRisk: number;
    singleSourceRisks: string[];
    overallSupplyChainRisk: number;
}>;
/**
 * Analyze vendor performance and compliance track record
 *
 * Reviews vendor performance metrics, compliance history,
 * incident tracking
 *
 * @param vendorId - Vendor identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Vendor performance analysis
 * @throws Error if analysis fails
 *
 * @example
 * const perf = await analyzeVendorPerformance('VENDOR-123', sequelize);
 */
export declare function analyzeVendorPerformance(vendorId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    performanceScore: number;
    complianceIncidents: number;
    reliabilityIndex: number;
    recommendedAction: string;
}>;
/**
 * Monitor third-party changes and update status
 *
 * Tracks changes in vendor status, ownership, compliance status,
 * and triggers reassessment
 *
 * @param vendorId - Vendor identifier
 * @param changeData - Change notification data
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Monitoring update result
 * @throws Error if monitoring fails
 *
 * @example
 * const monitor = await monitorThirdPartyChanges('VENDOR-123', changes, sequelize);
 */
export declare function monitorThirdPartyChanges(vendorId: string, changeData: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    changesDetected: boolean;
    reassessmentRequired: boolean;
    changes: string[];
}>;
/**
 * Conduct comprehensive vendor due diligence
 *
 * Executes full due diligence process: background checks, financial
 * review, reference verification, compliance screening
 *
 * @param vendorId - Vendor identifier
 * @param vendorData - Complete vendor information
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Due diligence completion result
 * @throws Error if due diligence fails
 *
 * @example
 * const dd = await conductVendorDueDiligence('VENDOR-123', data, sequelize);
 */
export declare function conductVendorDueDiligence(vendorId: string, vendorData: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    dueDiligenceComplete: boolean;
    overallRisk: RiskSeverity;
    findings: string[];
    approval: boolean;
}>;
/**
 * Validate vendor credentials and certifications
 *
 * Verifies licenses, certifications, insurance, regulatory approvals
 *
 * @param vendorId - Vendor identifier
 * @param credentials - Credential data for validation
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Credential validation result
 * @throws Error if validation fails
 *
 * @example
 * const cred = await validateVendorCredentials('VENDOR-123', creds, sequelize);
 */
export declare function validateVendorCredentials(vendorId: string, credentials: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    allCredentialsValid: boolean;
    validCredentials: string[];
    expiredCredentials: string[];
}>;
/**
 * Assess vendor compliance with regulatory requirements
 *
 * Reviews vendor's compliance posture against applicable regulations,
 * standards, and internal policies
 *
 * @param vendorId - Vendor identifier
 * @param applicableRegulations - Regulations to assess
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Compliance assessment
 * @throws Error if assessment fails
 *
 * @example
 * const comp = await assessVendorCompliance('VENDOR-123', regs, sequelize);
 */
export declare function assessVendorCompliance(vendorId: string, applicableRegulations: string[], sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    complianceStatus: ComplianceStatus;
    compliantRegulations: string[];
    gapAreas: string[];
    remediationPlan: string[];
}>;
/**
 * Monitor vendor compliance status continuously
 *
 * Tracks vendor compliance updates, triggering alerts on changes,
 * expirations, or violations
 *
 * @param vendorId - Vendor identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Current compliance monitoring status
 * @throws Error if monitoring fails
 *
 * @example
 * const status = await monitorVendorStatus('VENDOR-123', sequelize);
 */
export declare function monitorVendorStatus(vendorId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    vendorId: string;
    currentStatus: ComplianceStatus;
    lastAssessmentDate: Date;
    nextAssessmentDue: Date;
    alertsTriggered: string[];
}>;
/**
 * Evaluate counterparty credit and default risk
 *
 * Assesses counterparty creditworthiness, default probability,
 * loss exposure
 *
 * @param counterpartyId - Counterparty identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Counterparty risk assessment
 * @throws Error if evaluation fails
 *
 * @example
 * const risk = await evaluateCounterpartyRisk('CP-123', sequelize);
 */
export declare function evaluateCounterpartyRisk(counterpartyId: string, sequelize: Sequelize, transaction?: Transaction): Promise<CounterpartyRisk>;
/**
 * Update counterparty credit rating and monitoring
 *
 * Revises counterparty credit assessment based on financial updates,
 * market conditions, peer changes
 *
 * @param counterpartyId - Counterparty identifier
 * @param creditScore - Updated credit score
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Updated counterparty risk rating
 * @throws Error if update fails
 *
 * @example
 * const updated = await updateCounterpartyRating('CP-123', 720, sequelize);
 */
export declare function updateCounterpartyRating(counterpartyId: string, creditScore: number, sequelize: Sequelize, transaction?: Transaction): Promise<CounterpartyRisk>;
/**
 * Classify entity into regulatory/operational categories
 *
 * Determines entity type, classification for compliance, risk tier
 *
 * @param entityId - Entity identifier
 * @param entityData - Entity data for classification
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Entity classification result
 * @throws Error if classification fails
 *
 * @example
 * const classification = await classifyEntity('ENT-123', data, sequelize);
 */
export declare function classifyEntity(entityId: string, entityData: Record<string, unknown>, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    entityType: EntityType;
    riskClassification: string;
    regulatoryCategory: string;
}>;
/**
 * Assign risk tier based on comprehensive risk assessment
 *
 * Maps overall risk score to tier (1-5), determines management
 * approach and approval requirements
 *
 * @param entityId - Entity identifier
 * @param riskScore - Calculated risk score
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Assigned risk tier with management implications
 * @throws Error if assignment fails
 *
 * @example
 * const tier = await assignRiskTier('ENT-123', 65, sequelize);
 */
export declare function assignRiskTier(entityId: string, riskScore: number, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    riskTier: RiskTier;
    managementApproach: string;
    reviewFrequency: string;
    escalationRequired: boolean;
}>;
/**
 * Schedule periodic risk review for entity
 *
 * Creates scheduled review task based on risk tier and regulatory
 * requirements
 *
 * @param entityId - Entity identifier
 * @param riskTier - Assigned risk tier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Scheduled review details
 * @throws Error if scheduling fails
 *
 * @example
 * const scheduled = await scheduleRiskReview('ENT-123', TIER_2_HIGH, sequelize);
 */
export declare function scheduleRiskReview(entityId: string, riskTier: RiskTier, sequelize: Sequelize, transaction?: Transaction): Promise<RiskReviewSchedule>;
/**
 * Execute scheduled risk review and document findings
 *
 * Performs risk review, documents findings, determines remediation
 * requirements
 *
 * @param reviewId - Review identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Review execution result
 * @throws Error if execution fails
 *
 * @example
 * const executed = await executeRiskReview('REV-ENT-123', sequelize);
 */
export declare function executeRiskReview(reviewId: string, sequelize: Sequelize, transaction?: Transaction): Promise<RiskReviewSchedule>;
/**
 * Calculate risk factor weights based on impact and likelihood
 *
 * Determines optimal weighting for each risk factor considering
 * impact, likelihood, and correlation
 *
 * @param riskFactors - Raw risk factors without weights
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Risk factors with calculated weights
 * @throws Error if calculation fails
 *
 * @example
 * const weighted = await calculateRiskFactorWeights(factors, sequelize);
 */
export declare function calculateRiskFactorWeights(riskFactors: Omit<RiskFactor, 'weight'>[], sequelize: Sequelize, transaction?: Transaction): Promise<RiskFactor[]>;
/**
 * Adjust risk factor weights based on policy and business context
 *
 * Fine-tunes factor weights per organizational risk appetite,
 * business strategy, regulatory focus
 *
 * @param entityId - Entity identifier
 * @param riskFactors - Factors to adjust
 * @param policyWeights - Policy-defined weight adjustments
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Policy-adjusted risk factors
 * @throws Error if adjustment fails
 *
 * @example
 * const adjusted = await adjustRiskFactorWeights('ENT-123', factors, policy, sequelize);
 */
export declare function adjustRiskFactorWeights(entityId: string, riskFactors: RiskFactor[], policyWeights: Record<string, number>, sequelize: Sequelize, transaction?: Transaction): Promise<RiskFactor[]>;
/**
 * Screen entity against adverse media and news sources
 *
 * Searches public media, news, and specialized databases for adverse
 * information about entity
 *
 * @param entityId - Entity identifier
 * @param entityName - Entity legal name
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Adverse media screening results
 * @throws Error if screening fails
 *
 * @example
 * const media = await screenAdverseMedia('ENT-123', 'Acme Corp', sequelize);
 */
export declare function screenAdverseMedia(entityId: string, entityName: string, sequelize: Sequelize, transaction?: Transaction): Promise<AdverseMediaRecord[]>;
/**
 * Manage entity through lifecycle from onboarding to exit
 *
 * Tracks entity through acquisition, monitoring, suspension, termination
 * phases with appropriate controls
 *
 * @param entityId - Entity identifier
 * @param lifecyclePhase - Current lifecycle phase
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Entity lifecycle status
 * @throws Error if management fails
 *
 * @example
 * const lifecycle = await manageEntityLifecycle('ENT-123', 'ACTIVE', sequelize);
 */
export declare function manageEntityLifecycle(entityId: string, lifecyclePhase: 'ONBOARDING' | 'ACTIVE' | 'MONITORING' | 'SUSPENDED' | 'TERMINATED', sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    currentPhase: string;
    phaseStartDate: Date;
    requiredActions: string[];
    nextPhaseEligible: boolean;
}>;
/**
 * Check entity regulatory compliance status
 *
 * Verifies compliance with applicable regulations, licenses, approvals,
 * and regulatory submissions
 *
 * @param entityId - Entity identifier
 * @param applicableRegulations - List of applicable regulations
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Compliance status per regulation
 * @throws Error if check fails
 *
 * @example
 * const compliance = await checkRegulatoryCompliance('ENT-123', regs, sequelize);
 */
export declare function checkRegulatoryCompliance(entityId: string, applicableRegulations: string[], sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    overallStatus: ComplianceStatus;
    regulationStatus: Record<string, ComplianceStatus>;
    lastReviewDate: Date;
    nextReviewDue: Date;
    remediationNeeded: boolean;
}>;
/**
 * Monitor regulatory compliance changes and update status
 *
 * Tracks regulatory environment changes, new regulations, compliance
 * deadline updates
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Regulatory monitoring updates
 * @throws Error if monitoring fails
 *
 * @example
 * const monitoring = await monitorRegulatoryCompliance('ENT-123', sequelize);
 */
export declare function monitorRegulatoryCompliance(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    regulatoryChanges: string[];
    newRegulations: string[];
    updatedDeadlines: Record<string, Date>;
    immediateAction: string[];
}>;
/**
 * Integrate with external sanctions database and screen entity
 *
 * Performs real-time screening against OFAC, UN, EU, and other
 * international sanctions lists
 *
 * @param entityId - Entity identifier
 * @param entityName - Entity legal name
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Sanctions screening result
 * @throws Error if screening fails
 *
 * @example
 * const sanctions = await integrateWithSanctionsDatabase('ENT-123', 'Acme', sequelize);
 */
export declare function integrateWithSanctionsDatabase(entityId: string, entityName: string, sequelize: Sequelize, transaction?: Transaction): Promise<SanctionsScreeningResult>;
/**
 * Assess entity financial health and stability
 *
 * Analyzes financial statements, key ratios, liquidity, solvency,
 * profitability
 *
 * @param entityId - Entity identifier
 * @param financialData - Financial metrics and statements
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Financial health assessment
 * @throws Error if assessment fails
 *
 * @example
 * const health = await assessFinancialHealth('ENT-123', data, sequelize);
 */
export declare function assessFinancialHealth(entityId: string, financialData: Record<string, number>, sequelize: Sequelize, transaction?: Transaction): Promise<FinancialHealthMetrics>;
/**
 * Monitor financial health trends and trigger alerts
 *
 * Tracks financial metric changes, identifies deterioration,
 * triggers review escalation
 *
 * @param entityId - Entity identifier
 * @param sequelize - Database connection
 * @param transaction - Optional transaction context
 * @returns Financial health monitoring status
 * @throws Error if monitoring fails
 *
 * @example
 * const monitoring = await monitorFinancialHealth('ENT-123', sequelize);
 */
export declare function monitorFinancialHealth(entityId: string, sequelize: Sequelize, transaction?: Transaction): Promise<{
    entityId: string;
    currentStability: 'STABLE' | 'DECLINING' | 'AT_RISK' | 'CRITICAL';
    metricsAlert: boolean;
    concernAreas: string[];
    recommendedAction: string;
}>;
declare const _default: {
    initializeEntityRiskModels: typeof initializeEntityRiskModels;
    createEntityRiskProfile: typeof createEntityRiskProfile;
    updateEntityRiskProfile: typeof updateEntityRiskProfile;
    getEntityRiskProfile: typeof getEntityRiskProfile;
    calculateWeightedRiskScore: typeof calculateWeightedRiskScore;
    reassessEntityRiskProfile: typeof reassessEntityRiskProfile;
    analyzeCorporateStructure: typeof analyzeCorporateStructure;
    mapCorporateHierarchy: typeof mapCorporateHierarchy;
    identifyUltimateBeneficialOwners: typeof identifyUltimateBeneficialOwners;
    validateCorporateStructure: typeof validateCorporateStructure;
    getCorporateStructureAnalysis: typeof getCorporateStructureAnalysis;
    assessBusinessActivities: typeof assessBusinessActivities;
    categorizeBusinessOperations: typeof categorizeBusinessOperations;
    analyzeOperationalGeography: typeof analyzeOperationalGeography;
    validateBusinessModel: typeof validateBusinessModel;
    verifyOwnershipChain: typeof verifyOwnershipChain;
    validateUltimateBeneficialOwners: typeof validateUltimateBeneficialOwners;
    detectOwnershipConflicts: typeof detectOwnershipConflicts;
    analyzeOwnershipChanges: typeof analyzeOwnershipChanges;
    scoreIndustryRisk: typeof scoreIndustryRisk;
    evaluateIndustryRegulations: typeof evaluateIndustryRegulations;
    benchmarkAgainstIndustry: typeof benchmarkAgainstIndustry;
    mapEntityRelationships: typeof mapEntityRelationships;
    identifyRelatedParties: typeof identifyRelatedParties;
    analyzeRelationshipStrength: typeof analyzeRelationshipStrength;
    evaluateThirdPartyRisk: typeof evaluateThirdPartyRisk;
    assessSupplyChainRisk: typeof assessSupplyChainRisk;
    analyzeVendorPerformance: typeof analyzeVendorPerformance;
    monitorThirdPartyChanges: typeof monitorThirdPartyChanges;
    conductVendorDueDiligence: typeof conductVendorDueDiligence;
    validateVendorCredentials: typeof validateVendorCredentials;
    assessVendorCompliance: typeof assessVendorCompliance;
    monitorVendorStatus: typeof monitorVendorStatus;
    evaluateCounterpartyRisk: typeof evaluateCounterpartyRisk;
    updateCounterpartyRating: typeof updateCounterpartyRating;
    classifyEntity: typeof classifyEntity;
    assignRiskTier: typeof assignRiskTier;
    scheduleRiskReview: typeof scheduleRiskReview;
    executeRiskReview: typeof executeRiskReview;
    calculateRiskFactorWeights: typeof calculateRiskFactorWeights;
    adjustRiskFactorWeights: typeof adjustRiskFactorWeights;
    screenAdverseMedia: typeof screenAdverseMedia;
    manageEntityLifecycle: typeof manageEntityLifecycle;
    checkRegulatoryCompliance: typeof checkRegulatoryCompliance;
    monitorRegulatoryCompliance: typeof monitorRegulatoryCompliance;
    integrateWithSanctionsDatabase: typeof integrateWithSanctionsDatabase;
    assessFinancialHealth: typeof assessFinancialHealth;
    monitorFinancialHealth: typeof monitorFinancialHealth;
};
export default _default;
//# sourceMappingURL=entity-risk-assessment-kit.d.ts.map