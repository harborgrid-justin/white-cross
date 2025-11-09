/**
 * LOC: DIGSTRAT12345
 * File: /reuse/consulting/digital-strategy-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Digital transformation controllers
 *   - Strategy assessment engines
 *   - Technology roadmap services
 */
/**
 * File: /reuse/consulting/digital-strategy-kit.ts
 * Locator: WC-CONS-DIGSTRAT-001
 * Purpose: Comprehensive Digital Strategy & Transformation Utilities - McKinsey Digital-level consulting capabilities
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, strategy services, transformation engines, roadmap generators
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for digital maturity assessment, technology roadmaps, platform selection, API strategy, digital transformation
 *
 * LLM Context: Enterprise-grade digital strategy and transformation system competing with McKinsey Digital.
 * Provides digital maturity assessments, technology roadmap planning, platform evaluation and selection, API strategy development,
 * digital transformation program management, capability gap analysis, technology stack optimization, cloud migration strategy,
 * digital operating model design, agile transformation, data strategy, AI/ML readiness assessment, cybersecurity strategy,
 * digital culture assessment, change management planning, ROI modeling, vendor evaluation, proof-of-concept management.
 */
import { Sequelize } from 'sequelize';
/**
 * Digital maturity levels based on McKinsey Digital Quotient
 */
export declare enum DigitalMaturityLevel {
    NASCENT = "nascent",
    EMERGING = "emerging",
    CONNECTED = "connected",
    MULTI_MODAL = "multi_modal",
    INNOVATIVE = "innovative"
}
/**
 * Digital capability dimensions
 */
export declare enum CapabilityDimension {
    STRATEGY = "strategy",
    CULTURE = "culture",
    ORGANIZATION = "organization",
    TECHNOLOGY = "technology",
    DATA = "data",
    OPERATIONS = "operations",
    INNOVATION = "innovation",
    CUSTOMER_EXPERIENCE = "customer_experience"
}
/**
 * Technology stack categories
 */
export declare enum TechnologyStackCategory {
    FRONTEND = "frontend",
    BACKEND = "backend",
    DATABASE = "database",
    INFRASTRUCTURE = "infrastructure",
    SECURITY = "security",
    ANALYTICS = "analytics",
    INTEGRATION = "integration",
    DEVOPS = "devops"
}
/**
 * Transformation program status
 */
export declare enum TransformationProgramStatus {
    PLANNING = "planning",
    ASSESSMENT = "assessment",
    DESIGN = "design",
    PILOT = "pilot",
    ROLLOUT = "rollout",
    OPTIMIZATION = "optimization",
    SUSTAIN = "sustain"
}
/**
 * Platform evaluation criteria
 */
export declare enum PlatformEvaluationCriteria {
    FUNCTIONALITY = "functionality",
    SCALABILITY = "scalability",
    SECURITY = "security",
    COST = "cost",
    VENDOR_STABILITY = "vendor_stability",
    INTEGRATION = "integration",
    USER_EXPERIENCE = "user_experience",
    SUPPORT = "support"
}
/**
 * API strategy type
 */
export declare enum APIStrategyType {
    INTERNAL = "internal",
    PARTNER = "partner",
    PUBLIC = "public",
    HYBRID = "hybrid"
}
/**
 * Cloud migration strategy
 */
export declare enum CloudMigrationStrategy {
    REHOST = "rehost",
    REPLATFORM = "replatform",
    REFACTOR = "refactor",
    REBUILD = "rebuild",
    REPLACE = "replace",
    RETIRE = "retire"
}
/**
 * Digital maturity assessment interface
 */
export interface DigitalMaturityAssessment {
    id: string;
    assessmentName: string;
    organizationId: string;
    organizationName: string;
    assessmentDate: Date;
    overallMaturityLevel: DigitalMaturityLevel;
    overallScore: number;
    dimensionScores: Record<CapabilityDimension, number>;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    recommendations: string[];
    benchmarkIndustry?: string;
    benchmarkScore?: number;
    previousAssessmentId?: string;
    progressSinceLastAssessment?: number;
    assessedBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Technology roadmap interface
 */
export interface TechnologyRoadmap {
    id: string;
    roadmapName: string;
    organizationId: string;
    timeHorizon: number;
    startDate: Date;
    endDate: Date;
    currentState: string;
    targetState: string;
    initiatives: RoadmapInitiative[];
    dependencies: RoadmapDependency[];
    milestones: RoadmapMilestone[];
    totalInvestment: number;
    expectedROI: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
    ownerId: string;
    approvedBy?: string;
    approvedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Roadmap initiative interface
 */
export interface RoadmapInitiative {
    id: string;
    initiativeName: string;
    description: string;
    category: TechnologyStackCategory;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    startQuarter: string;
    endQuarter: string;
    estimatedCost: number;
    estimatedBenefit: number;
    resources: string[];
    dependencies: string[];
    risks: string[];
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}
/**
 * Roadmap dependency interface
 */
export interface RoadmapDependency {
    id: string;
    fromInitiativeId: string;
    toInitiativeId: string;
    dependencyType: 'BLOCKING' | 'RELATED' | 'INFORMATIONAL';
    description: string;
}
/**
 * Roadmap milestone interface
 */
export interface RoadmapMilestone {
    id: string;
    milestoneName: string;
    targetDate: Date;
    relatedInitiatives: string[];
    successCriteria: string[];
    status: 'PENDING' | 'ACHIEVED' | 'MISSED' | 'CANCELLED';
}
/**
 * Platform evaluation interface
 */
export interface PlatformEvaluation {
    id: string;
    evaluationName: string;
    platformName: string;
    vendorName: string;
    category: TechnologyStackCategory;
    evaluationDate: Date;
    criteriaScores: Record<PlatformEvaluationCriteria, number>;
    overallScore: number;
    ranking: number;
    pros: string[];
    cons: string[];
    estimatedCost: number;
    implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendationStatus: 'RECOMMENDED' | 'CONDITIONAL' | 'NOT_RECOMMENDED';
    alternativePlatforms: string[];
    evaluatedBy: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * API strategy interface
 */
export interface APIStrategy {
    id: string;
    strategyName: string;
    organizationId: string;
    strategyType: APIStrategyType;
    businessObjectives: string[];
    targetAudience: string[];
    apiArchitecture: 'REST' | 'GRAPHQL' | 'GRPC' | 'SOAP' | 'HYBRID';
    governanceModel: string;
    securityRequirements: string[];
    scalabilityTargets: Record<string, number>;
    monetizationStrategy?: string;
    partnerEcosystem: string[];
    developmentStandards: string[];
    monitoringApproach: string;
    status: 'DRAFT' | 'APPROVED' | 'IMPLEMENTED';
    ownerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Digital transformation program interface
 */
export interface TransformationProgram {
    id: string;
    programName: string;
    organizationId: string;
    visionStatement: string;
    strategicObjectives: string[];
    currentMaturityLevel: DigitalMaturityLevel;
    targetMaturityLevel: DigitalMaturityLevel;
    programDuration: number;
    startDate: Date;
    targetEndDate: Date;
    totalBudget: number;
    spentBudget: number;
    programStatus: TransformationProgramStatus;
    workstreams: TransformationWorkstream[];
    kpis: TransformationKPI[];
    risks: TransformationRisk[];
    stakeholders: string[];
    executiveSponsor: string;
    programManager: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Transformation workstream interface
 */
export interface TransformationWorkstream {
    id: string;
    workstreamName: string;
    description: string;
    category: CapabilityDimension;
    leadId: string;
    budget: number;
    progress: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
    deliverables: string[];
    dependencies: string[];
}
/**
 * Transformation KPI interface
 */
export interface TransformationKPI {
    id: string;
    kpiName: string;
    kpiCategory: string;
    baselineValue: number;
    currentValue: number;
    targetValue: number;
    unit: string;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
}
/**
 * Transformation risk interface
 */
export interface TransformationRisk {
    id: string;
    riskName: string;
    description: string;
    category: string;
    probability: 'LOW' | 'MEDIUM' | 'HIGH';
    impact: 'LOW' | 'MEDIUM' | 'HIGH';
    riskScore: number;
    mitigationStrategy: string;
    owner: string;
    status: 'OPEN' | 'MITIGATED' | 'CLOSED';
}
/**
 * Capability gap analysis interface
 */
export interface CapabilityGapAnalysis {
    id: string;
    analysisName: string;
    organizationId: string;
    dimension: CapabilityDimension;
    currentCapabilityLevel: number;
    requiredCapabilityLevel: number;
    gapSize: number;
    criticalGaps: CapabilityGap[];
    recommendations: string[];
    estimatedInvestment: number;
    estimatedTimeToClose: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    analyzedBy: string;
    analyzedAt: Date;
    metadata: Record<string, any>;
}
/**
 * Capability gap interface
 */
export interface CapabilityGap {
    capabilityName: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    remediationActions: string[];
}
/**
 * Cloud migration assessment interface
 */
export interface CloudMigrationAssessment {
    id: string;
    assessmentName: string;
    organizationId: string;
    totalApplications: number;
    applicationsAssessed: number;
    migrationStrategies: Record<CloudMigrationStrategy, number>;
    totalEstimatedCost: number;
    estimatedDuration: number;
    migrationWaves: MigrationWave[];
    risks: string[];
    dependencies: string[];
    recommendedCloudProvider: string;
    alternativeProviders: string[];
    assessedBy: string;
    assessmentDate: Date;
    metadata: Record<string, any>;
}
/**
 * Migration wave interface
 */
export interface MigrationWave {
    waveNumber: number;
    waveName: string;
    applications: string[];
    startDate: Date;
    endDate: Date;
    estimatedCost: number;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    dependencies: string[];
}
/**
 * Create digital maturity assessment DTO
 */
export declare class CreateDigitalMaturityAssessmentDto {
    assessmentName: string;
    organizationId: string;
    organizationName: string;
    assessmentDate: Date;
    benchmarkIndustry?: string;
    assessedBy: string;
}
/**
 * Update digital maturity assessment DTO
 */
export declare class UpdateDigitalMaturityAssessmentDto {
    overallMaturityLevel?: DigitalMaturityLevel;
    overallScore?: number;
    dimensionScores?: Record<CapabilityDimension, number>;
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    recommendations?: string[];
}
/**
 * Create technology roadmap DTO
 */
export declare class CreateTechnologyRoadmapDto {
    roadmapName: string;
    organizationId: string;
    timeHorizon: number;
    startDate: Date;
    currentState: string;
    targetState: string;
    totalInvestment: number;
    ownerId: string;
}
/**
 * Create roadmap initiative DTO
 */
export declare class CreateRoadmapInitiativeDto {
    initiativeName: string;
    description: string;
    category: TechnologyStackCategory;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    startQuarter: string;
    endQuarter: string;
    estimatedCost: number;
    estimatedBenefit: number;
}
/**
 * Create platform evaluation DTO
 */
export declare class CreatePlatformEvaluationDto {
    evaluationName: string;
    platformName: string;
    vendorName: string;
    category: TechnologyStackCategory;
    evaluationDate: Date;
    estimatedCost: number;
    evaluatedBy: string[];
}
/**
 * Create API strategy DTO
 */
export declare class CreateAPIStrategyDto {
    strategyName: string;
    organizationId: string;
    strategyType: APIStrategyType;
    businessObjectives: string[];
    targetAudience: string[];
    apiArchitecture: 'REST' | 'GRAPHQL' | 'GRPC' | 'SOAP' | 'HYBRID';
    ownerId: string;
}
/**
 * Create transformation program DTO
 */
export declare class CreateTransformationProgramDto {
    programName: string;
    organizationId: string;
    visionStatement: string;
    strategicObjectives: string[];
    currentMaturityLevel: DigitalMaturityLevel;
    targetMaturityLevel: DigitalMaturityLevel;
    programDuration: number;
    totalBudget: number;
    executiveSponsor: string;
    programManager: string;
}
/**
 * Digital maturity dimension score DTO
 */
export declare class DimensionScoreDto {
    dimension: CapabilityDimension;
    score: number;
    notes?: string;
}
/**
 * Sequelize model for Digital Maturity Assessments
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DigitalMaturityAssessment model
 *
 * @example
 * ```typescript
 * const AssessmentModel = createDigitalMaturityAssessmentModel(sequelize);
 * const assessment = await AssessmentModel.create({
 *   assessmentName: 'Q1 2025 Digital Assessment',
 *   organizationId: 'org-123',
 *   overallMaturityLevel: DigitalMaturityLevel.EMERGING
 * });
 * ```
 */
export declare const createDigitalMaturityAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        assessmentName: string;
        organizationId: string;
        organizationName: string;
        assessmentDate: Date;
        overallMaturityLevel: DigitalMaturityLevel;
        overallScore: number;
        dimensionScores: Record<string, number>;
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        recommendations: string[];
        benchmarkIndustry: string | null;
        benchmarkScore: number | null;
        previousAssessmentId: string | null;
        progressSinceLastAssessment: number | null;
        assessedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Technology Roadmaps
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TechnologyRoadmap model
 *
 * @example
 * ```typescript
 * const RoadmapModel = createTechnologyRoadmapModel(sequelize);
 * const roadmap = await RoadmapModel.create({
 *   roadmapName: '2025 Technology Transformation Roadmap',
 *   organizationId: 'org-123',
 *   timeHorizon: 24
 * });
 * ```
 */
export declare const createTechnologyRoadmapModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        roadmapName: string;
        organizationId: string;
        timeHorizon: number;
        startDate: Date;
        endDate: Date;
        currentState: string;
        targetState: string;
        initiatives: any[];
        dependencies: any[];
        milestones: any[];
        totalInvestment: number;
        expectedROI: number;
        riskLevel: string;
        status: string;
        ownerId: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Platform Evaluations
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PlatformEvaluation model
 *
 * @example
 * ```typescript
 * const EvaluationModel = createPlatformEvaluationModel(sequelize);
 * const evaluation = await EvaluationModel.create({
 *   evaluationName: 'CRM Platform Evaluation 2025',
 *   platformName: 'Salesforce',
 *   vendorName: 'Salesforce Inc.'
 * });
 * ```
 */
export declare const createPlatformEvaluationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        evaluationName: string;
        platformName: string;
        vendorName: string;
        category: TechnologyStackCategory;
        evaluationDate: Date;
        criteriaScores: Record<string, number>;
        overallScore: number;
        ranking: number;
        pros: string[];
        cons: string[];
        estimatedCost: number;
        implementationComplexity: string;
        recommendationStatus: string;
        alternativePlatforms: string[];
        evaluatedBy: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Conducts comprehensive digital maturity assessment across all capability dimensions.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} organizationName - Organization name
 * @param {string} assessedBy - User conducting assessment
 * @param {Record<CapabilityDimension, number>} dimensionScores - Scores by dimension
 * @returns {Promise<DigitalMaturityAssessment>} Assessment results
 *
 * @example
 * ```typescript
 * const assessment = await conductDigitalMaturityAssessment(
 *   'org-123',
 *   'Acme Corp',
 *   'consultant-456',
 *   {
 *     strategy: 75,
 *     culture: 60,
 *     technology: 80,
 *     data: 70,
 *     operations: 65,
 *     organization: 55,
 *     innovation: 50,
 *     customer_experience: 70
 *   }
 * );
 * ```
 */
export declare const conductDigitalMaturityAssessment: (organizationId: string, organizationName: string, assessedBy: string, dimensionScores: Record<CapabilityDimension, number>) => Promise<DigitalMaturityAssessment>;
/**
 * Calculates digital maturity score for a specific capability dimension.
 *
 * @param {CapabilityDimension} dimension - Capability dimension
 * @param {Record<string, number>} assessmentData - Assessment data points
 * @returns {Promise<number>} Dimension maturity score (0-100)
 *
 * @example
 * ```typescript
 * const strategyScore = await calculateDimensionMaturityScore(
 *   CapabilityDimension.STRATEGY,
 *   {
 *     digital_vision: 80,
 *     strategic_alignment: 75,
 *     roadmap_clarity: 70,
 *     executive_commitment: 85
 *   }
 * );
 * ```
 */
export declare const calculateDimensionMaturityScore: (dimension: CapabilityDimension, assessmentData: Record<string, number>) => Promise<number>;
/**
 * Benchmarks organization against industry standards for digital maturity.
 *
 * @param {DigitalMaturityAssessment} assessment - Assessment to benchmark
 * @param {string} industry - Industry code (e.g., 'FINANCE', 'HEALTHCARE')
 * @returns {Promise<{ percentileRank: number; industryAverage: number; gap: number }>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkDigitalMaturity(assessment, 'FINANCE');
 * console.log(`Organization is at ${benchmark.percentileRank}th percentile`);
 * ```
 */
export declare const benchmarkDigitalMaturity: (assessment: DigitalMaturityAssessment, industry: string) => Promise<{
    percentileRank: number;
    industryAverage: number;
    gap: number;
}>;
/**
 * Identifies critical capability gaps that need immediate attention.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @param {number} threshold - Threshold score below which gaps are critical
 * @returns {Promise<CapabilityGap[]>} Critical capability gaps
 *
 * @example
 * ```typescript
 * const criticalGaps = await identifyCriticalCapabilityGaps(assessment, 50);
 * ```
 */
export declare const identifyCriticalCapabilityGaps: (assessment: DigitalMaturityAssessment, threshold?: number) => Promise<CapabilityGap[]>;
/**
 * Generates digital transformation roadmap based on maturity assessment.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @param {number} targetScore - Target maturity score
 * @param {number} timeHorizonMonths - Time horizon in months
 * @returns {Promise<TechnologyRoadmap>} Generated transformation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await generateTransformationRoadmap(assessment, 80, 24);
 * ```
 */
export declare const generateTransformationRoadmap: (assessment: DigitalMaturityAssessment, targetScore: number, timeHorizonMonths: number) => Promise<TechnologyRoadmap>;
/**
 * Tracks digital maturity progress over time by comparing assessments.
 *
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Start date for comparison
 * @param {Date} endDate - End date for comparison
 * @returns {Promise<{ assessments: DigitalMaturityAssessment[]; progressTrend: number }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackMaturityProgress('org-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
export declare const trackMaturityProgress: (organizationId: string, startDate: Date, endDate: Date) => Promise<{
    assessments: DigitalMaturityAssessment[];
    progressTrend: number;
}>;
/**
 * Generates executive summary report from maturity assessment.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @returns {Promise<{ summary: string; keyFindings: string[]; recommendations: string[] }>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateMaturityExecutiveSummary(assessment);
 * ```
 */
export declare const generateMaturityExecutiveSummary: (assessment: DigitalMaturityAssessment) => Promise<{
    summary: string;
    keyFindings: string[];
    recommendations: string[];
}>;
/**
 * Exports maturity assessment results to various formats.
 *
 * @param {DigitalMaturityAssessment} assessment - Assessment to export
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'JSON')
 * @returns {Promise<Buffer>} Exported assessment data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportMaturityAssessment(assessment, 'PDF');
 * ```
 */
export declare const exportMaturityAssessment: (assessment: DigitalMaturityAssessment, format: string) => Promise<Buffer>;
/**
 * Calculates digital quotient (DQ) score for organization.
 *
 * @param {DigitalMaturityAssessment} assessment - Maturity assessment
 * @returns {Promise<{ dqScore: number; category: string; interpretation: string }>} Digital quotient results
 *
 * @example
 * ```typescript
 * const dq = await calculateDigitalQuotient(assessment);
 * console.log(`DQ Score: ${dq.dqScore} - ${dq.interpretation}`);
 * ```
 */
export declare const calculateDigitalQuotient: (assessment: DigitalMaturityAssessment) => Promise<{
    dqScore: number;
    category: string;
    interpretation: string;
}>;
/**
 * Creates comprehensive technology roadmap with initiatives and milestones.
 *
 * @param {CreateTechnologyRoadmapDto} roadmapData - Roadmap creation data
 * @returns {Promise<TechnologyRoadmap>} Created technology roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createTechnologyRoadmap({
 *   roadmapName: '2025 Digital Infrastructure Roadmap',
 *   organizationId: 'org-123',
 *   timeHorizon: 24,
 *   startDate: new Date('2025-01-01'),
 *   currentState: 'Legacy systems',
 *   targetState: 'Cloud-native architecture',
 *   totalInvestment: 5000000,
 *   ownerId: 'cto-456'
 * });
 * ```
 */
export declare const createTechnologyRoadmap: (roadmapData: CreateTechnologyRoadmapDto) => Promise<TechnologyRoadmap>;
/**
 * Adds initiative to technology roadmap with dependencies and constraints.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @param {CreateRoadmapInitiativeDto} initiativeData - Initiative data
 * @returns {Promise<RoadmapInitiative>} Added initiative
 *
 * @example
 * ```typescript
 * const initiative = await addRoadmapInitiative('roadmap-123', {
 *   initiativeName: 'Cloud Migration Phase 1',
 *   description: 'Migrate tier-1 applications to AWS',
 *   category: TechnologyStackCategory.INFRASTRUCTURE,
 *   priority: 'CRITICAL',
 *   startQuarter: '2025-Q1',
 *   endQuarter: '2025-Q3',
 *   estimatedCost: 1500000,
 *   estimatedBenefit: 3000000
 * });
 * ```
 */
export declare const addRoadmapInitiative: (roadmapId: string, initiativeData: CreateRoadmapInitiativeDto) => Promise<RoadmapInitiative>;
/**
 * Optimizes roadmap sequencing based on dependencies and resource constraints.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @param {object} constraints - Resource and timeline constraints
 * @returns {Promise<TechnologyRoadmap>} Optimized roadmap
 *
 * @example
 * ```typescript
 * const optimized = await optimizeRoadmapSequencing(roadmap, {
 *   maxParallelInitiatives: 5,
 *   budgetPerQuarter: 500000,
 *   availableResources: 20
 * });
 * ```
 */
export declare const optimizeRoadmapSequencing: (roadmap: TechnologyRoadmap, constraints: any) => Promise<TechnologyRoadmap>;
/**
 * Validates roadmap feasibility against organizational constraints.
 *
 * @param {TechnologyRoadmap} roadmap - Roadmap to validate
 * @param {object} organizationCapabilities - Organization capabilities and limits
 * @returns {Promise<{ feasible: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateRoadmapFeasibility(roadmap, {
 *   annualBudget: 10000000,
 *   technicalStaff: 50,
 *   changeCapacity: 'MEDIUM'
 * });
 * ```
 */
export declare const validateRoadmapFeasibility: (roadmap: TechnologyRoadmap, organizationCapabilities: any) => Promise<{
    feasible: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Calculates ROI for technology roadmap initiatives.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @param {number} discountRate - Discount rate for NPV calculation
 * @returns {Promise<{ totalROI: number; npv: number; paybackPeriod: number }>} ROI calculations
 *
 * @example
 * ```typescript
 * const roi = await calculateRoadmapROI(roadmap, 0.08);
 * console.log(`Expected ROI: ${roi.totalROI}%`);
 * ```
 */
export declare const calculateRoadmapROI: (roadmap: TechnologyRoadmap, discountRate?: number) => Promise<{
    totalROI: number;
    npv: number;
    paybackPeriod: number;
}>;
/**
 * Identifies critical path through roadmap initiatives.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @returns {Promise<{ criticalPath: RoadmapInitiative[]; totalDuration: number }>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await identifyRoadmapCriticalPath(roadmap);
 * ```
 */
export declare const identifyRoadmapCriticalPath: (roadmap: TechnologyRoadmap) => Promise<{
    criticalPath: RoadmapInitiative[];
    totalDuration: number;
}>;
/**
 * Generates roadmap visualization data for Gantt charts and timelines.
 *
 * @param {TechnologyRoadmap} roadmap - Technology roadmap
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const vizData = await generateRoadmapVisualization(roadmap);
 * ```
 */
export declare const generateRoadmapVisualization: (roadmap: TechnologyRoadmap) => Promise<any>;
/**
 * Tracks roadmap execution progress and milestone achievement.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @returns {Promise<{ overallProgress: number; completedInitiatives: number; milestoneStatus: any[] }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackRoadmapProgress('roadmap-123');
 * console.log(`Overall progress: ${progress.overallProgress}%`);
 * ```
 */
export declare const trackRoadmapProgress: (roadmapId: string) => Promise<{
    overallProgress: number;
    completedInitiatives: number;
    milestoneStatus: any[];
}>;
/**
 * Updates roadmap based on actual execution results and changes.
 *
 * @param {string} roadmapId - Roadmap identifier
 * @param {object} updates - Update data
 * @returns {Promise<TechnologyRoadmap>} Updated roadmap
 *
 * @example
 * ```typescript
 * const updated = await updateRoadmapProgress('roadmap-123', {
 *   completedInitiatives: ['init-1', 'init-2'],
 *   budgetAdjustments: { 'init-3': 200000 }
 * });
 * ```
 */
export declare const updateRoadmapProgress: (roadmapId: string, updates: any) => Promise<TechnologyRoadmap>;
/**
 * Conducts comprehensive platform evaluation against defined criteria.
 *
 * @param {CreatePlatformEvaluationDto} evaluationData - Evaluation data
 * @param {Record<PlatformEvaluationCriteria, number>} criteriaWeights - Criteria weights
 * @returns {Promise<PlatformEvaluation>} Platform evaluation results
 *
 * @example
 * ```typescript
 * const evaluation = await evaluatePlatform(
 *   {
 *     evaluationName: 'CRM Selection 2025',
 *     platformName: 'Salesforce',
 *     vendorName: 'Salesforce Inc.',
 *     category: TechnologyStackCategory.BACKEND,
 *     evaluationDate: new Date(),
 *     estimatedCost: 500000,
 *     evaluatedBy: ['cto-123', 'architect-456']
 *   },
 *   {
 *     functionality: 0.25,
 *     scalability: 0.20,
 *     security: 0.20,
 *     cost: 0.15,
 *     vendor_stability: 0.10,
 *     integration: 0.05,
 *     user_experience: 0.03,
 *     support: 0.02
 *   }
 * );
 * ```
 */
export declare const evaluatePlatform: (evaluationData: CreatePlatformEvaluationDto, criteriaWeights: Record<PlatformEvaluationCriteria, number>) => Promise<PlatformEvaluation>;
/**
 * Compares multiple platform alternatives side-by-side.
 *
 * @param {PlatformEvaluation[]} evaluations - Platform evaluations to compare
 * @returns {Promise<{ comparison: any[]; recommendedPlatform: string; costBenefit: any }>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await comparePlatformAlternatives([salesforceEval, msD365Eval, hubspotEval]);
 * ```
 */
export declare const comparePlatformAlternatives: (evaluations: PlatformEvaluation[]) => Promise<{
    comparison: any[];
    recommendedPlatform: string;
    costBenefit: any;
}>;
/**
 * Performs vendor risk assessment for platform selection.
 *
 * @param {string} vendorName - Vendor name
 * @param {string} platformName - Platform name
 * @returns {Promise<{ riskScore: number; riskFactors: any[]; mitigation: string[] }>} Vendor risk assessment
 *
 * @example
 * ```typescript
 * const vendorRisk = await assessVendorRisk('Salesforce Inc.', 'Salesforce CRM');
 * ```
 */
export declare const assessVendorRisk: (vendorName: string, platformName: string) => Promise<{
    riskScore: number;
    riskFactors: any[];
    mitigation: string[];
}>;
/**
 * Calculates total cost of ownership (TCO) for platform over lifecycle.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {number} yearsOfOperation - Years of operation
 * @param {object} additionalCosts - Additional cost factors
 * @returns {Promise<{ tco: number; breakdown: any; annualizedCost: number }>} TCO analysis
 *
 * @example
 * ```typescript
 * const tco = await calculatePlatformTCO(evaluation, 5, {
 *   training: 50000,
 *   customization: 200000,
 *   annualMaintenance: 100000
 * });
 * ```
 */
export declare const calculatePlatformTCO: (evaluation: PlatformEvaluation, yearsOfOperation: number, additionalCosts: any) => Promise<{
    tco: number;
    breakdown: any;
    annualizedCost: number;
}>;
/**
 * Generates proof-of-concept (POC) plan for platform validation.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {string[]} useCases - Use cases to validate
 * @param {number} durationWeeks - POC duration in weeks
 * @returns {Promise<object>} POC plan
 *
 * @example
 * ```typescript
 * const pocPlan = await generatePOCPlan(evaluation, [
 *   'Customer data import',
 *   'Sales workflow automation',
 *   'Reporting dashboard'
 * ], 8);
 * ```
 */
export declare const generatePOCPlan: (evaluation: PlatformEvaluation, useCases: string[], durationWeeks: number) => Promise<any>;
/**
 * Assesses platform integration complexity with existing systems.
 *
 * @param {string} platformName - Platform name
 * @param {string[]} existingSystems - List of existing systems
 * @returns {Promise<{ complexity: string; integrationPoints: any[]; estimatedEffort: number }>} Integration assessment
 *
 * @example
 * ```typescript
 * const integration = await assessIntegrationComplexity('Salesforce', ['SAP ERP', 'Azure AD', 'Marketo']);
 * ```
 */
export declare const assessIntegrationComplexity: (platformName: string, existingSystems: string[]) => Promise<{
    complexity: string;
    integrationPoints: any[];
    estimatedEffort: number;
}>;
/**
 * Evaluates platform scalability for future growth.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {object} growthProjections - Growth projections
 * @returns {Promise<{ scalable: boolean; limitations: string[]; recommendations: string[] }>} Scalability assessment
 *
 * @example
 * ```typescript
 * const scalability = await evaluatePlatformScalability(evaluation, {
 *   userGrowth: 3.0,
 *   dataGrowth: 5.0,
 *   transactionGrowth: 4.0
 * });
 * ```
 */
export declare const evaluatePlatformScalability: (evaluation: PlatformEvaluation, growthProjections: any) => Promise<{
    scalable: boolean;
    limitations: string[];
    recommendations: string[];
}>;
/**
 * Performs security assessment for platform.
 *
 * @param {PlatformEvaluation} evaluation - Platform evaluation
 * @param {string[]} securityRequirements - Security requirements
 * @returns {Promise<{ compliant: boolean; gaps: string[]; certifications: string[] }>} Security assessment
 *
 * @example
 * ```typescript
 * const security = await assessPlatformSecurity(evaluation, ['SOC 2', 'ISO 27001', 'GDPR']);
 * ```
 */
export declare const assessPlatformSecurity: (evaluation: PlatformEvaluation, securityRequirements: string[]) => Promise<{
    compliant: boolean;
    gaps: string[];
    certifications: string[];
}>;
/**
 * Generates platform selection recommendation report.
 *
 * @param {PlatformEvaluation[]} evaluations - All platform evaluations
 * @param {object} organizationPriorities - Organization priorities
 * @returns {Promise<{ recommendedPlatform: string; rationale: string; implementation: any }>} Recommendation report
 *
 * @example
 * ```typescript
 * const recommendation = await generatePlatformRecommendation(evaluations, {
 *   budgetPriority: 'HIGH',
 *   timeToValue: 'MEDIUM',
 *   scalability: 'HIGH'
 * });
 * ```
 */
export declare const generatePlatformRecommendation: (evaluations: PlatformEvaluation[], organizationPriorities: any) => Promise<{
    recommendedPlatform: string;
    rationale: string;
    implementation: any;
}>;
/**
 * Develops comprehensive API strategy aligned with business objectives.
 *
 * @param {CreateAPIStrategyDto} strategyData - API strategy data
 * @returns {Promise<APIStrategy>} Developed API strategy
 *
 * @example
 * ```typescript
 * const apiStrategy = await developAPIStrategy({
 *   strategyName: 'Enterprise API Strategy 2025',
 *   organizationId: 'org-123',
 *   strategyType: APIStrategyType.HYBRID,
 *   businessObjectives: ['Revenue growth', 'Partner ecosystem', 'Innovation'],
 *   targetAudience: ['Internal teams', 'Partners', 'Developers'],
 *   apiArchitecture: 'REST',
 *   ownerId: 'cto-456'
 * });
 * ```
 */
export declare const developAPIStrategy: (strategyData: CreateAPIStrategyDto) => Promise<APIStrategy>;
/**
 * Designs API governance framework and policies.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} governanceModel - Governance model type
 * @returns {Promise<object>} API governance framework
 *
 * @example
 * ```typescript
 * const governance = await designAPIGovernance('org-123', 'FEDERATED');
 * ```
 */
export declare const designAPIGovernance: (organizationId: string, governanceModel: string) => Promise<any>;
/**
 * Defines API security architecture and authentication patterns.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {string[]} securityRequirements - Security requirements
 * @returns {Promise<object>} API security architecture
 *
 * @example
 * ```typescript
 * const security = await defineAPISecurity(apiStrategy, ['OAuth 2.0', 'mTLS', 'API Keys']);
 * ```
 */
export declare const defineAPISecurity: (strategy: APIStrategy, securityRequirements: string[]) => Promise<any>;
/**
 * Plans API monetization strategy for revenue generation.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {object} pricingModel - Pricing model parameters
 * @returns {Promise<object>} Monetization strategy
 *
 * @example
 * ```typescript
 * const monetization = await planAPIMonetization(apiStrategy, {
 *   model: 'TIERED',
 *   freeTier: { calls: 1000, rateLimit: 10 },
 *   paidTiers: [...]
 * });
 * ```
 */
export declare const planAPIMonetization: (strategy: APIStrategy, pricingModel: any) => Promise<any>;
/**
 * Designs API gateway architecture and configuration.
 *
 * @param {APIStrategy} strategy - API strategy
 * @param {object} requirements - Gateway requirements
 * @returns {Promise<object>} API gateway design
 *
 * @example
 * ```typescript
 * const gateway = await designAPIGateway(apiStrategy, {
 *   scalability: 'HIGH',
 *   availability: '99.99%',
 *   regions: ['us-east-1', 'eu-west-1']
 * });
 * ```
 */
export declare const designAPIGateway: (strategy: APIStrategy, requirements: any) => Promise<any>;
/**
 * Generates API documentation standards and templates.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Documentation standards
 *
 * @example
 * ```typescript
 * const docStandards = await generateAPIDocStandards(apiStrategy);
 * ```
 */
export declare const generateAPIDocStandards: (strategy: APIStrategy) => Promise<any>;
/**
 * Defines API versioning and lifecycle management strategy.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Versioning strategy
 *
 * @example
 * ```typescript
 * const versioning = await defineAPIVersioning(apiStrategy);
 * ```
 */
export declare const defineAPIVersioning: (strategy: APIStrategy) => Promise<any>;
/**
 * Plans API developer experience and ecosystem.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Developer experience plan
 *
 * @example
 * ```typescript
 * const devEx = await planAPIDeveloperExperience(apiStrategy);
 * ```
 */
export declare const planAPIDeveloperExperience: (strategy: APIStrategy) => Promise<any>;
/**
 * Designs API analytics and monitoring framework.
 *
 * @param {APIStrategy} strategy - API strategy
 * @returns {Promise<object>} Analytics framework
 *
 * @example
 * ```typescript
 * const analytics = await designAPIAnalytics(apiStrategy);
 * ```
 */
export declare const designAPIAnalytics: (strategy: APIStrategy) => Promise<any>;
/**
 * Assesses applications for cloud migration readiness.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} applicationIds - Application IDs to assess
 * @returns {Promise<CloudMigrationAssessment>} Migration assessment
 *
 * @example
 * ```typescript
 * const assessment = await assessCloudMigrationReadiness('org-123', ['app-1', 'app-2', 'app-3']);
 * ```
 */
export declare const assessCloudMigrationReadiness: (organizationId: string, applicationIds: string[]) => Promise<CloudMigrationAssessment>;
/**
 * Categorizes applications by migration strategy (6Rs).
 *
 * @param {string[]} applicationIds - Application IDs
 * @returns {Promise<Record<CloudMigrationStrategy, string[]>>} Applications by strategy
 *
 * @example
 * ```typescript
 * const categorization = await categorizeApplicationsByStrategy(['app-1', 'app-2', ...]);
 * ```
 */
export declare const categorizeApplicationsByStrategy: (applicationIds: string[]) => Promise<Record<CloudMigrationStrategy, string[]>>;
/**
 * Plans migration waves based on dependencies and priorities.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {number} maxWaveDuration - Maximum wave duration in months
 * @returns {Promise<MigrationWave[]>} Planned migration waves
 *
 * @example
 * ```typescript
 * const waves = await planMigrationWaves(assessment, 3);
 * ```
 */
export declare const planMigrationWaves: (assessment: CloudMigrationAssessment, maxWaveDuration: number) => Promise<MigrationWave[]>;
/**
 * Estimates cloud migration costs including hidden costs.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {object} costFactors - Cost factors
 * @returns {Promise<{ totalCost: number; breakdown: any; hiddenCosts: any }>} Cost estimation
 *
 * @example
 * ```typescript
 * const costs = await estimateMigrationCosts(assessment, {
 *   laborRatePerHour: 150,
 *   cloudPremium: 1.2,
 *   trainingBudget: 100000
 * });
 * ```
 */
export declare const estimateMigrationCosts: (assessment: CloudMigrationAssessment, costFactors: any) => Promise<{
    totalCost: number;
    breakdown: any;
    hiddenCosts: any;
}>;
/**
 * Develops cloud cost optimization strategy.
 *
 * @param {string} cloudProvider - Cloud provider
 * @param {object} usageProjections - Usage projections
 * @returns {Promise<object>} Cost optimization strategy
 *
 * @example
 * ```typescript
 * const optimization = await developCloudCostOptimization('AWS', {
 *   computeHours: 50000,
 *   storageGB: 100000,
 *   dataTransferGB: 10000
 * });
 * ```
 */
export declare const developCloudCostOptimization: (cloudProvider: string, usageProjections: any) => Promise<any>;
/**
 * Designs cloud landing zone architecture.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string} cloudProvider - Cloud provider
 * @param {object} requirements - Architecture requirements
 * @returns {Promise<object>} Landing zone design
 *
 * @example
 * ```typescript
 * const landingZone = await designCloudLandingZone('org-123', 'AWS', {
 *   multiAccount: true,
 *   regions: ['us-east-1', 'eu-west-1'],
 *   compliance: ['SOC2', 'HIPAA']
 * });
 * ```
 */
export declare const designCloudLandingZone: (organizationId: string, cloudProvider: string, requirements: any) => Promise<any>;
/**
 * Plans data migration strategy and execution.
 *
 * @param {string[]} dataSourceIds - Data source IDs
 * @param {string} targetCloud - Target cloud environment
 * @returns {Promise<object>} Data migration plan
 *
 * @example
 * ```typescript
 * const dataMigration = await planDataMigration(['db-1', 'db-2'], 'AWS RDS');
 * ```
 */
export declare const planDataMigration: (dataSourceIds: string[], targetCloud: string) => Promise<any>;
/**
 * Identifies cloud migration risks and mitigation strategies.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @returns {Promise<Array<{ risk: string; impact: string; probability: string; mitigation: string }>>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await identifyMigrationRisks(assessment);
 * ```
 */
export declare const identifyMigrationRisks: (assessment: CloudMigrationAssessment) => Promise<Array<{
    risk: string;
    impact: string;
    probability: string;
    mitigation: string;
}>>;
/**
 * Generates cloud migration project plan with timeline and resources.
 *
 * @param {CloudMigrationAssessment} assessment - Migration assessment
 * @param {MigrationWave[]} waves - Migration waves
 * @returns {Promise<object>} Project plan
 *
 * @example
 * ```typescript
 * const projectPlan = await generateMigrationProjectPlan(assessment, waves);
 * ```
 */
export declare const generateMigrationProjectPlan: (assessment: CloudMigrationAssessment, waves: MigrationWave[]) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createDigitalMaturityAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            assessmentName: string;
            organizationId: string;
            organizationName: string;
            assessmentDate: Date;
            overallMaturityLevel: DigitalMaturityLevel;
            overallScore: number;
            dimensionScores: Record<string, number>;
            strengths: string[];
            weaknesses: string[];
            opportunities: string[];
            recommendations: string[];
            benchmarkIndustry: string | null;
            benchmarkScore: number | null;
            previousAssessmentId: string | null;
            progressSinceLastAssessment: number | null;
            assessedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTechnologyRoadmapModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            roadmapName: string;
            organizationId: string;
            timeHorizon: number;
            startDate: Date;
            endDate: Date;
            currentState: string;
            targetState: string;
            initiatives: any[];
            dependencies: any[];
            milestones: any[];
            totalInvestment: number;
            expectedROI: number;
            riskLevel: string;
            status: string;
            ownerId: string;
            approvedBy: string | null;
            approvedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPlatformEvaluationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            evaluationName: string;
            platformName: string;
            vendorName: string;
            category: TechnologyStackCategory;
            evaluationDate: Date;
            criteriaScores: Record<string, number>;
            overallScore: number;
            ranking: number;
            pros: string[];
            cons: string[];
            estimatedCost: number;
            implementationComplexity: string;
            recommendationStatus: string;
            alternativePlatforms: string[];
            evaluatedBy: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    conductDigitalMaturityAssessment: (organizationId: string, organizationName: string, assessedBy: string, dimensionScores: Record<CapabilityDimension, number>) => Promise<DigitalMaturityAssessment>;
    calculateDimensionMaturityScore: (dimension: CapabilityDimension, assessmentData: Record<string, number>) => Promise<number>;
    benchmarkDigitalMaturity: (assessment: DigitalMaturityAssessment, industry: string) => Promise<{
        percentileRank: number;
        industryAverage: number;
        gap: number;
    }>;
    identifyCriticalCapabilityGaps: (assessment: DigitalMaturityAssessment, threshold?: number) => Promise<CapabilityGap[]>;
    generateTransformationRoadmap: (assessment: DigitalMaturityAssessment, targetScore: number, timeHorizonMonths: number) => Promise<TechnologyRoadmap>;
    trackMaturityProgress: (organizationId: string, startDate: Date, endDate: Date) => Promise<{
        assessments: DigitalMaturityAssessment[];
        progressTrend: number;
    }>;
    generateMaturityExecutiveSummary: (assessment: DigitalMaturityAssessment) => Promise<{
        summary: string;
        keyFindings: string[];
        recommendations: string[];
    }>;
    exportMaturityAssessment: (assessment: DigitalMaturityAssessment, format: string) => Promise<Buffer>;
    calculateDigitalQuotient: (assessment: DigitalMaturityAssessment) => Promise<{
        dqScore: number;
        category: string;
        interpretation: string;
    }>;
    createTechnologyRoadmap: (roadmapData: CreateTechnologyRoadmapDto) => Promise<TechnologyRoadmap>;
    addRoadmapInitiative: (roadmapId: string, initiativeData: CreateRoadmapInitiativeDto) => Promise<RoadmapInitiative>;
    optimizeRoadmapSequencing: (roadmap: TechnologyRoadmap, constraints: any) => Promise<TechnologyRoadmap>;
    validateRoadmapFeasibility: (roadmap: TechnologyRoadmap, organizationCapabilities: any) => Promise<{
        feasible: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    calculateRoadmapROI: (roadmap: TechnologyRoadmap, discountRate?: number) => Promise<{
        totalROI: number;
        npv: number;
        paybackPeriod: number;
    }>;
    identifyRoadmapCriticalPath: (roadmap: TechnologyRoadmap) => Promise<{
        criticalPath: RoadmapInitiative[];
        totalDuration: number;
    }>;
    generateRoadmapVisualization: (roadmap: TechnologyRoadmap) => Promise<any>;
    trackRoadmapProgress: (roadmapId: string) => Promise<{
        overallProgress: number;
        completedInitiatives: number;
        milestoneStatus: any[];
    }>;
    updateRoadmapProgress: (roadmapId: string, updates: any) => Promise<TechnologyRoadmap>;
    evaluatePlatform: (evaluationData: CreatePlatformEvaluationDto, criteriaWeights: Record<PlatformEvaluationCriteria, number>) => Promise<PlatformEvaluation>;
    comparePlatformAlternatives: (evaluations: PlatformEvaluation[]) => Promise<{
        comparison: any[];
        recommendedPlatform: string;
        costBenefit: any;
    }>;
    assessVendorRisk: (vendorName: string, platformName: string) => Promise<{
        riskScore: number;
        riskFactors: any[];
        mitigation: string[];
    }>;
    calculatePlatformTCO: (evaluation: PlatformEvaluation, yearsOfOperation: number, additionalCosts: any) => Promise<{
        tco: number;
        breakdown: any;
        annualizedCost: number;
    }>;
    generatePOCPlan: (evaluation: PlatformEvaluation, useCases: string[], durationWeeks: number) => Promise<any>;
    assessIntegrationComplexity: (platformName: string, existingSystems: string[]) => Promise<{
        complexity: string;
        integrationPoints: any[];
        estimatedEffort: number;
    }>;
    evaluatePlatformScalability: (evaluation: PlatformEvaluation, growthProjections: any) => Promise<{
        scalable: boolean;
        limitations: string[];
        recommendations: string[];
    }>;
    assessPlatformSecurity: (evaluation: PlatformEvaluation, securityRequirements: string[]) => Promise<{
        compliant: boolean;
        gaps: string[];
        certifications: string[];
    }>;
    generatePlatformRecommendation: (evaluations: PlatformEvaluation[], organizationPriorities: any) => Promise<{
        recommendedPlatform: string;
        rationale: string;
        implementation: any;
    }>;
    developAPIStrategy: (strategyData: CreateAPIStrategyDto) => Promise<APIStrategy>;
    designAPIGovernance: (organizationId: string, governanceModel: string) => Promise<any>;
    defineAPISecurity: (strategy: APIStrategy, securityRequirements: string[]) => Promise<any>;
    planAPIMonetization: (strategy: APIStrategy, pricingModel: any) => Promise<any>;
    designAPIGateway: (strategy: APIStrategy, requirements: any) => Promise<any>;
    generateAPIDocStandards: (strategy: APIStrategy) => Promise<any>;
    defineAPIVersioning: (strategy: APIStrategy) => Promise<any>;
    planAPIDeveloperExperience: (strategy: APIStrategy) => Promise<any>;
    designAPIAnalytics: (strategy: APIStrategy) => Promise<any>;
    assessCloudMigrationReadiness: (organizationId: string, applicationIds: string[]) => Promise<CloudMigrationAssessment>;
    categorizeApplicationsByStrategy: (applicationIds: string[]) => Promise<Record<CloudMigrationStrategy, string[]>>;
    planMigrationWaves: (assessment: CloudMigrationAssessment, maxWaveDuration: number) => Promise<MigrationWave[]>;
    estimateMigrationCosts: (assessment: CloudMigrationAssessment, costFactors: any) => Promise<{
        totalCost: number;
        breakdown: any;
        hiddenCosts: any;
    }>;
    developCloudCostOptimization: (cloudProvider: string, usageProjections: any) => Promise<any>;
    designCloudLandingZone: (organizationId: string, cloudProvider: string, requirements: any) => Promise<any>;
    planDataMigration: (dataSourceIds: string[], targetCloud: string) => Promise<any>;
    identifyMigrationRisks: (assessment: CloudMigrationAssessment) => Promise<Array<{
        risk: string;
        impact: string;
        probability: string;
        mitigation: string;
    }>>;
    generateMigrationProjectPlan: (assessment: CloudMigrationAssessment, waves: MigrationWave[]) => Promise<any>;
};
export default _default;
//# sourceMappingURL=digital-strategy-kit.d.ts.map