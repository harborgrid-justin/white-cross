/**
 * LOC: CONS-ORG-DES-001
 * File: /reuse/server/consulting/organizational-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/org-design.service.ts
 *   - backend/consulting/org-structure.controller.ts
 *   - backend/consulting/workforce-planning.service.ts
 */
/**
 * File: /reuse/server/consulting/organizational-design-kit.ts
 * Locator: WC-CONS-ORGDES-001
 * Purpose: Enterprise-grade Organizational Design Kit - span of control, RACI matrices, organization archetypes, reporting structures
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, org design controllers, workforce planning processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for organizational design competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive organizational design utilities for production-ready management consulting applications.
 * Provides org structure design, span of control analysis, RACI matrix generation, organization archetypes,
 * reporting structure optimization, headcount planning, role definition, competency frameworks, governance models,
 * decision rights allocation, organizational health metrics, and transformation roadmaps.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Organization archetype patterns
 */
export declare enum OrganizationArchetype {
    FUNCTIONAL = "functional",
    DIVISIONAL = "divisional",
    MATRIX = "matrix",
    FLAT = "flat",
    NETWORK = "network",
    HOLACRACY = "holacracy",
    TEAM_BASED = "team_based",
    PROJECT_BASED = "project_based"
}
/**
 * Decision rights authority levels
 */
export declare enum DecisionAuthority {
    DECIDE = "decide",
    RECOMMEND = "recommend",
    CONSULT = "consult",
    INFORM = "inform",
    EXECUTE = "execute"
}
/**
 * RACI responsibility types
 */
export declare enum RACIRole {
    RESPONSIBLE = "responsible",
    ACCOUNTABLE = "accountable",
    CONSULTED = "consulted",
    INFORMED = "informed"
}
/**
 * Organizational layer levels
 */
export declare enum OrganizationalLayer {
    EXECUTIVE = "executive",
    SENIOR_MANAGEMENT = "senior_management",
    MIDDLE_MANAGEMENT = "middle_management",
    FRONTLINE_MANAGEMENT = "frontline_management",
    INDIVIDUAL_CONTRIBUTOR = "individual_contributor"
}
/**
 * Governance model types
 */
export declare enum GovernanceModel {
    CENTRALIZED = "centralized",
    DECENTRALIZED = "decentralized",
    FEDERATED = "federated",
    HYBRID = "hybrid"
}
/**
 * Reporting relationship types
 */
export declare enum ReportingType {
    DIRECT = "direct",
    DOTTED_LINE = "dotted_line",
    FUNCTIONAL = "functional",
    ADMINISTRATIVE = "administrative"
}
/**
 * Organization design status
 */
export declare enum DesignStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    IMPLEMENTED = "implemented",
    ARCHIVED = "archived"
}
/**
 * Organizational health dimensions
 */
export declare enum HealthDimension {
    DIRECTION = "direction",
    LEADERSHIP = "leadership",
    CULTURE = "culture",
    ACCOUNTABILITY = "accountability",
    COORDINATION = "coordination",
    CAPABILITIES = "capabilities",
    MOTIVATION = "motivation",
    INNOVATION = "innovation",
    EXTERNAL_ORIENTATION = "external_orientation"
}
interface OrganizationStructureData {
    organizationId: string;
    name: string;
    archetype: OrganizationArchetype;
    description: string;
    effectiveDate: Date;
    endDate?: Date;
    headcount: number;
    layers: number;
    spanOfControl: number;
    designPrinciples: string[];
    status: DesignStatus;
    metadata?: Record<string, any>;
}
interface OrganizationalUnitData {
    unitId: string;
    organizationId: string;
    parentUnitId?: string;
    name: string;
    description: string;
    unitType: 'division' | 'department' | 'team' | 'function';
    layer: OrganizationalLayer;
    headId?: string;
    headcount: number;
    budget?: number;
    costCenter?: string;
    location?: string;
    isActive: boolean;
}
interface PositionData {
    positionId: string;
    organizationId: string;
    unitId: string;
    title: string;
    level: string;
    layer: OrganizationalLayer;
    reportsToPositionId?: string;
    reportingType: ReportingType;
    directReports: number;
    totalReports: number;
    isFilled: boolean;
    incumbentId?: string;
    salaryGrade?: string;
    fte: number;
}
interface SpanOfControlMetrics {
    positionId: string;
    directReports: number;
    indirectReports: number;
    totalSpan: number;
    optimalMin: number;
    optimalMax: number;
    isOptimal: boolean;
    variance: number;
    recommendation: string;
    healthScore: number;
}
interface RACIMatrixEntry {
    processId: string;
    activityName: string;
    roleId: string;
    roleName: string;
    responsibility: RACIRole;
    notes?: string;
}
interface RACIMatrix {
    matrixId: string;
    organizationId: string;
    processName: string;
    description: string;
    activities: string[];
    roles: string[];
    entries: RACIMatrixEntry[];
    validationStatus: 'valid' | 'conflicts' | 'gaps';
    conflicts?: string[];
    gaps?: string[];
}
interface DecisionRightsAllocation {
    decisionId: string;
    organizationId: string;
    decisionType: string;
    decisionName: string;
    description: string;
    authority: DecisionAuthority;
    ownerId: string;
    ownerRole: string;
    stakeholders: string[];
    escalationPath: string[];
    frequency: string;
    impact: 'low' | 'medium' | 'high' | 'strategic';
}
interface ReportingStructure {
    structureId: string;
    organizationId: string;
    positions: PositionData[];
    relationships: ReportingRelationship[];
    layers: number;
    averageSpan: number;
    totalHeadcount: number;
    hierarchyHealth: number;
}
interface ReportingRelationship {
    relationshipId: string;
    subordinatePositionId: string;
    supervisorPositionId: string;
    relationshipType: ReportingType;
    effectiveDate: Date;
    endDate?: Date;
}
interface HeadcountPlan {
    planId: string;
    organizationId: string;
    unitId?: string;
    planningPeriod: string;
    currentHeadcount: number;
    plannedHeadcount: number;
    variance: number;
    newHires: number;
    transfers: number;
    promotions: number;
    attrition: number;
    budgetImpact: number;
    justification: string;
}
interface RoleDefinition {
    roleId: string;
    organizationId: string;
    title: string;
    level: string;
    layer: OrganizationalLayer;
    purpose: string;
    keyResponsibilities: string[];
    decisionAuthority: string[];
    requiredCompetencies: string[];
    experience: string;
    education: string;
    reportingRelationship: string;
    successMetrics: string[];
}
interface CompetencyFramework {
    frameworkId: string;
    organizationId: string;
    name: string;
    description: string;
    competencies: CompetencyDefinition[];
    proficiencyLevels: string[];
    effectiveDate: Date;
}
interface CompetencyDefinition {
    competencyId: string;
    name: string;
    description: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'functional';
    requiredForRoles: string[];
    proficiencyDescriptions: Record<string, string>;
}
interface GovernanceStructure {
    governanceId: string;
    organizationId: string;
    model: GovernanceModel;
    governanceBodies: GovernanceBody[];
    decisionFramework: string;
    escalationPaths: Record<string, string[]>;
    meetingCadence: Record<string, string>;
}
interface GovernanceBody {
    bodyId: string;
    name: string;
    purpose: string;
    members: string[];
    chairId: string;
    decisionAuthority: string[];
    meetingFrequency: string;
    quorumRequirement: number;
}
interface OrganizationalHealthMetrics {
    organizationId: string;
    assessmentDate: Date;
    overallScore: number;
    dimensionScores: Record<HealthDimension, number>;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    benchmarkPercentile: number;
}
interface TransformationRoadmap {
    roadmapId: string;
    organizationId: string;
    currentState: string;
    targetState: string;
    transformationType: 'restructure' | 'merger' | 'acquisition' | 'spinoff' | 'optimization';
    phases: TransformationPhase[];
    totalDuration: number;
    totalCost: number;
    riskLevel: 'low' | 'medium' | 'high';
    stakeholders: string[];
}
interface TransformationPhase {
    phaseId: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    activities: string[];
    dependencies: string[];
    milestones: string[];
    budget: number;
    successCriteria: string[];
}
/**
 * Create Organization Structure DTO
 */
export declare class CreateOrganizationStructureDto {
    name: string;
    archetype: OrganizationArchetype;
    description: string;
    effectiveDate: Date;
    headcount: number;
    layers: number;
    designPrinciples: string[];
    metadata?: Record<string, any>;
}
/**
 * Create Organizational Unit DTO
 */
export declare class CreateOrganizationalUnitDto {
    organizationId: string;
    parentUnitId?: string;
    name: string;
    description: string;
    unitType: 'division' | 'department' | 'team' | 'function';
    layer: OrganizationalLayer;
    headcount: number;
    budget?: number;
}
/**
 * Create Position DTO
 */
export declare class CreatePositionDto {
    organizationId: string;
    unitId: string;
    title: string;
    level: string;
    layer: OrganizationalLayer;
    reportsToPositionId?: string;
    reportingType: ReportingType;
    fte: number;
    salaryGrade?: string;
}
/**
 * Create RACI Matrix DTO
 */
export declare class CreateRACIMatrixDto {
    organizationId: string;
    processName: string;
    description: string;
    activities: string[];
    roles: string[];
}
/**
 * RACI Matrix Entry DTO
 */
export declare class RACIMatrixEntryDto {
    activityName: string;
    roleName: string;
    responsibility: RACIRole;
    notes?: string;
}
/**
 * Create Decision Rights Allocation DTO
 */
export declare class CreateDecisionRightsDto {
    organizationId: string;
    decisionType: string;
    decisionName: string;
    description: string;
    authority: DecisionAuthority;
    ownerRole: string;
    impact: 'low' | 'medium' | 'high' | 'strategic';
    stakeholders: string[];
}
/**
 * Create Headcount Plan DTO
 */
export declare class CreateHeadcountPlanDto {
    organizationId: string;
    unitId?: string;
    planningPeriod: string;
    currentHeadcount: number;
    plannedHeadcount: number;
    newHires: number;
    attrition: number;
    budgetImpact: number;
    justification: string;
}
/**
 * Create Role Definition DTO
 */
export declare class CreateRoleDefinitionDto {
    organizationId: string;
    title: string;
    level: string;
    layer: OrganizationalLayer;
    purpose: string;
    keyResponsibilities: string[];
    requiredCompetencies: string[];
    experience: string;
    education: string;
}
/**
 * Create Competency Framework DTO
 */
export declare class CreateCompetencyFrameworkDto {
    organizationId: string;
    name: string;
    description: string;
    proficiencyLevels: string[];
    effectiveDate: Date;
}
/**
 * Competency Definition DTO
 */
export declare class CompetencyDefinitionDto {
    name: string;
    description: string;
    category: 'technical' | 'leadership' | 'behavioral' | 'functional';
    requiredForRoles: string[];
}
/**
 * Create Governance Structure DTO
 */
export declare class CreateGovernanceStructureDto {
    organizationId: string;
    model: GovernanceModel;
    decisionFramework: string;
}
/**
 * Governance Body DTO
 */
export declare class GovernanceBodyDto {
    name: string;
    purpose: string;
    members: string[];
    chairId: string;
    meetingFrequency: string;
    quorumRequirement: number;
}
/**
 * Create Transformation Roadmap DTO
 */
export declare class CreateTransformationRoadmapDto {
    organizationId: string;
    currentState: string;
    targetState: string;
    transformationType: 'restructure' | 'merger' | 'acquisition' | 'spinoff' | 'optimization';
    totalDuration: number;
    totalCost: number;
    riskLevel: 'low' | 'medium' | 'high';
    stakeholders: string[];
}
/**
 * Transformation Phase DTO
 */
export declare class TransformationPhaseDto {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    activities: string[];
    budget: number;
    successCriteria: string[];
}
/**
 * Organization Structure Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     OrganizationStructure:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         organizationId:
 *           type: string
 *         name:
 *           type: string
 *         archetype:
 *           type: string
 *           enum: [functional, divisional, matrix, flat, network, holacracy, team_based, project_based]
 *         headcount:
 *           type: number
 *         layers:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrganizationStructure model
 *
 * @example
 * ```typescript
 * const OrgStructure = createOrganizationStructureModel(sequelize);
 * const structure = await OrgStructure.create({
 *   organizationId: 'ORG001',
 *   name: 'Healthcare Corp',
 *   archetype: 'matrix',
 *   headcount: 5000,
 *   layers: 5,
 *   status: 'approved'
 * });
 * ```
 */
export declare const createOrganizationStructureModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        organizationId: string;
        name: string;
        archetype: string;
        description: string;
        effectiveDate: Date;
        endDate: Date | null;
        headcount: number;
        layers: number;
        spanOfControl: number;
        designPrinciples: string[];
        status: string;
        approvedBy: string | null;
        approvalDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Organizational Unit Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     OrganizationalUnit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         organizationId:
 *           type: string
 *         name:
 *           type: string
 *         unitType:
 *           type: string
 *           enum: [division, department, team, function]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrganizationalUnit model
 */
export declare const createOrganizationalUnitModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        unitId: string;
        organizationId: string;
        parentUnitId: string | null;
        name: string;
        description: string;
        unitType: string;
        layer: string;
        headId: string | null;
        headcount: number;
        budget: number | null;
        costCenter: string | null;
        location: string | null;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Position Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         level:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Position model
 */
export declare const createPositionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        positionId: string;
        organizationId: string;
        unitId: string;
        title: string;
        level: string;
        layer: string;
        reportsToPositionId: string | null;
        reportingType: string;
        directReports: number;
        totalReports: number;
        isFilled: boolean;
        incumbentId: string | null;
        salaryGrade: string | null;
        fte: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * RACI Matrix Sequelize model.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     RACIMatrix:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         processName:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RACIMatrix model
 */
export declare const createRACIMatrixModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        matrixId: string;
        organizationId: string;
        processName: string;
        description: string;
        activities: string[];
        roles: string[];
        entries: any[];
        validationStatus: string;
        conflicts: string[];
        gaps: string[];
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new organization structure design.
 *
 * @swagger
 * @openapi
 * /api/org-design/structures:
 *   post:
 *     tags:
 *       - Organizational Design
 *     summary: Create organization structure
 *     description: Creates a new organization structure design with specified archetype and parameters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationStructureDto'
 *     responses:
 *       201:
 *         description: Organization structure created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationStructure'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 *
 * @param {CreateOrganizationStructureDto} data - Organization structure data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<OrganizationStructureData>} Created organization structure
 *
 * @example
 * ```typescript
 * const structure = await createOrganizationStructure({
 *   name: 'Healthcare Corp',
 *   archetype: OrganizationArchetype.MATRIX,
 *   description: 'Matrix organization for integrated care delivery',
 *   effectiveDate: new Date('2024-01-01'),
 *   headcount: 5000,
 *   layers: 5,
 *   designPrinciples: ['Customer-centric', 'Agile decision-making']
 * });
 * ```
 */
export declare function createOrganizationStructure(data: Partial<OrganizationStructureData>, transaction?: Transaction): Promise<OrganizationStructureData>;
/**
 * Calculates optimal span of control for a position.
 *
 * @swagger
 * @openapi
 * /api/org-design/span-of-control/{positionId}:
 *   get:
 *     tags:
 *       - Organizational Design
 *     summary: Calculate span of control
 *     description: Analyzes span of control metrics for a position and provides optimization recommendations
 *     parameters:
 *       - in: path
 *         name: positionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Span of control metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 directReports:
 *                   type: number
 *                 optimalMin:
 *                   type: number
 *                 optimalMax:
 *                   type: number
 *                 isOptimal:
 *                   type: boolean
 *                 recommendation:
 *                   type: string
 *
 * @param {string} positionId - Position identifier
 * @param {PositionData} positionData - Position data
 * @param {OrganizationalLayer} layer - Organizational layer
 * @returns {Promise<SpanOfControlMetrics>} Span of control analysis
 *
 * @example
 * ```typescript
 * const spanMetrics = await calculateSpanOfControl('POS123', positionData, OrganizationalLayer.MIDDLE_MANAGEMENT);
 * console.log(`Direct reports: ${spanMetrics.directReports}, Optimal: ${spanMetrics.isOptimal}`);
 * ```
 */
export declare function calculateSpanOfControl(positionId: string, positionData: Partial<PositionData>, layer: OrganizationalLayer): Promise<SpanOfControlMetrics>;
/**
 * Generates a complete RACI matrix for a business process.
 *
 * @swagger
 * @openapi
 * /api/org-design/raci-matrix:
 *   post:
 *     tags:
 *       - Organizational Design
 *     summary: Generate RACI matrix
 *     description: Creates a RACI matrix for a business process with validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRACIMatrixDto'
 *     responses:
 *       201:
 *         description: RACI matrix created
 *       400:
 *         description: Validation errors found
 *
 * @param {Partial<RACIMatrix>} data - RACI matrix configuration
 * @returns {Promise<RACIMatrix>} Generated and validated RACI matrix
 *
 * @example
 * ```typescript
 * const raciMatrix = await generateRACIMatrix({
 *   organizationId: 'ORG001',
 *   processName: 'Budget Planning',
 *   activities: ['Prepare budget', 'Review budget', 'Approve budget'],
 *   roles: ['CFO', 'Finance Manager', 'Department Head'],
 *   entries: [...]
 * });
 * ```
 */
export declare function generateRACIMatrix(data: Partial<RACIMatrix>): Promise<RACIMatrix>;
/**
 * Analyzes reporting structure for optimization opportunities.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions in the organization
 * @returns {Promise<ReportingStructure>} Reporting structure analysis
 *
 * @example
 * ```typescript
 * const structure = await analyzeReportingStructure('ORG001', positions);
 * console.log(`Total layers: ${structure.layers}, Health: ${structure.hierarchyHealth}`);
 * ```
 */
export declare function analyzeReportingStructure(organizationId: string, positions: PositionData[]): Promise<ReportingStructure>;
/**
 * Creates decision rights allocation framework.
 *
 * @param {Partial<DecisionRightsAllocation>} data - Decision rights data
 * @returns {Promise<DecisionRightsAllocation>} Created decision rights allocation
 *
 * @example
 * ```typescript
 * const decisionRights = await createDecisionRightsAllocation({
 *   organizationId: 'ORG001',
 *   decisionType: 'Financial',
 *   decisionName: 'Capital Expenditure > $100K',
 *   authority: DecisionAuthority.DECIDE,
 *   ownerRole: 'CFO',
 *   impact: 'strategic'
 * });
 * ```
 */
export declare function createDecisionRightsAllocation(data: Partial<DecisionRightsAllocation>): Promise<DecisionRightsAllocation>;
/**
 * Generates headcount planning recommendations.
 *
 * @param {Partial<HeadcountPlan>} data - Headcount plan data
 * @returns {Promise<HeadcountPlan>} Headcount plan with variance analysis
 *
 * @example
 * ```typescript
 * const plan = await generateHeadcountPlan({
 *   organizationId: 'ORG001',
 *   currentHeadcount: 250,
 *   plannedHeadcount: 275,
 *   newHires: 30,
 *   attrition: 5
 * });
 * ```
 */
export declare function generateHeadcountPlan(data: Partial<HeadcountPlan>): Promise<HeadcountPlan>;
/**
 * Creates a comprehensive role definition.
 *
 * @param {Partial<RoleDefinition>} data - Role definition data
 * @returns {Promise<RoleDefinition>} Created role definition
 *
 * @example
 * ```typescript
 * const role = await createRoleDefinition({
 *   organizationId: 'ORG001',
 *   title: 'Senior Clinical Manager',
 *   layer: OrganizationalLayer.MIDDLE_MANAGEMENT,
 *   purpose: 'Lead clinical operations',
 *   keyResponsibilities: ['Manage staff', 'Ensure quality']
 * });
 * ```
 */
export declare function createRoleDefinition(data: Partial<RoleDefinition>): Promise<RoleDefinition>;
/**
 * Develops a competency framework for the organization.
 *
 * @param {Partial<CompetencyFramework>} data - Competency framework data
 * @returns {Promise<CompetencyFramework>} Created competency framework
 *
 * @example
 * ```typescript
 * const framework = await developCompetencyFramework({
 *   organizationId: 'ORG001',
 *   name: 'Leadership Competencies',
 *   competencies: [...]
 * });
 * ```
 */
export declare function developCompetencyFramework(data: Partial<CompetencyFramework>): Promise<CompetencyFramework>;
/**
 * Designs governance structure for the organization.
 *
 * @param {Partial<GovernanceStructure>} data - Governance structure data
 * @returns {Promise<GovernanceStructure>} Created governance structure
 *
 * @example
 * ```typescript
 * const governance = await designGovernanceStructure({
 *   organizationId: 'ORG001',
 *   model: GovernanceModel.FEDERATED,
 *   governanceBodies: [...]
 * });
 * ```
 */
export declare function designGovernanceStructure(data: Partial<GovernanceStructure>): Promise<GovernanceStructure>;
/**
 * Assesses organizational health across multiple dimensions.
 *
 * @param {string} organizationId - Organization identifier
 * @param {Record<HealthDimension, number>} dimensionScores - Scores by dimension (0-100)
 * @returns {Promise<OrganizationalHealthMetrics>} Health assessment results
 *
 * @example
 * ```typescript
 * const health = await assessOrganizationalHealth('ORG001', {
 *   [HealthDimension.DIRECTION]: 85,
 *   [HealthDimension.LEADERSHIP]: 90,
 *   ...
 * });
 * ```
 */
export declare function assessOrganizationalHealth(organizationId: string, dimensionScores: Record<HealthDimension, number>): Promise<OrganizationalHealthMetrics>;
/**
 * Creates organizational transformation roadmap.
 *
 * @param {Partial<TransformationRoadmap>} data - Transformation roadmap data
 * @returns {Promise<TransformationRoadmap>} Created transformation roadmap
 *
 * @example
 * ```typescript
 * const roadmap = await createTransformationRoadmap({
 *   organizationId: 'ORG001',
 *   currentState: 'Functional silos',
 *   targetState: 'Agile matrix',
 *   transformationType: 'restructure',
 *   phases: [...]
 * });
 * ```
 */
export declare function createTransformationRoadmap(data: Partial<TransformationRoadmap>): Promise<TransformationRoadmap>;
/**
 * Validates organization design against best practices.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @returns {Promise<{ isValid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateOrganizationDesign(structure);
 * if (!validation.isValid) {
 *   console.log('Issues found:', validation.issues);
 * }
 * ```
 */
export declare function validateOrganizationDesign(structure: OrganizationStructureData): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Generates organization chart data for visualization.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ nodes: any[]; edges: any[] }>} Chart data
 *
 * @example
 * ```typescript
 * const chartData = await generateOrganizationChart('ORG001', positions);
 * ```
 */
export declare function generateOrganizationChart(organizationId: string, positions: PositionData[]): Promise<{
    nodes: any[];
    edges: any[];
}>;
/**
 * Calculates organization design metrics.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Design metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateOrganizationMetrics('ORG001', positions);
 * ```
 */
export declare function calculateOrganizationMetrics(organizationId: string, positions: PositionData[]): Promise<Record<string, number>>;
/**
 * Identifies organization design patterns and archetypes.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ archetype: OrganizationArchetype; confidence: number; characteristics: string[] }>} Pattern analysis
 *
 * @example
 * ```typescript
 * const pattern = await identifyOrganizationPattern(structure, positions);
 * ```
 */
export declare function identifyOrganizationPattern(structure: OrganizationStructureData, positions: PositionData[]): Promise<{
    archetype: OrganizationArchetype;
    confidence: number;
    characteristics: string[];
}>;
/**
 * Generates succession planning recommendations.
 *
 * @param {string} positionId - Position identifier
 * @param {PositionData} position - Position data
 * @returns {Promise<{ criticalityScore: number; successors: string[]; developmentNeeds: string[] }>} Succession plan
 *
 * @example
 * ```typescript
 * const succession = await generateSuccessionPlan('POS123', position);
 * ```
 */
export declare function generateSuccessionPlan(positionId: string, position: PositionData): Promise<{
    criticalityScore: number;
    successors: string[];
    developmentNeeds: string[];
}>;
/**
 * Analyzes organizational complexity.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {OrganizationalUnitData[]} units - All organizational units
 * @returns {Promise<{ complexityScore: number; factors: Record<string, number>; recommendations: string[] }>} Complexity analysis
 *
 * @example
 * ```typescript
 * const complexity = await analyzeOrganizationalComplexity(structure, units);
 * ```
 */
export declare function analyzeOrganizationalComplexity(structure: OrganizationStructureData, units: OrganizationalUnitData[]): Promise<{
    complexityScore: number;
    factors: Record<string, number>;
    recommendations: string[];
}>;
/**
 * Creates organizational unit with hierarchy validation.
 *
 * @param {Partial<OrganizationalUnitData>} data - Unit data
 * @param {OrganizationalUnitData[]} existingUnits - Existing units for validation
 * @returns {Promise<OrganizationalUnitData>} Created unit
 *
 * @example
 * ```typescript
 * const unit = await createOrganizationalUnit(unitData, existingUnits);
 * ```
 */
export declare function createOrganizationalUnit(data: Partial<OrganizationalUnitData>, existingUnits: OrganizationalUnitData[]): Promise<OrganizationalUnitData>;
/**
 * Optimizes reporting relationships for efficiency.
 *
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ optimizedRelationships: ReportingRelationship[]; improvements: string[] }>} Optimization results
 *
 * @example
 * ```typescript
 * const optimized = await optimizeReportingRelationships(positions);
 * ```
 */
export declare function optimizeReportingRelationships(positions: PositionData[]): Promise<{
    optimizedRelationships: ReportingRelationship[];
    improvements: string[];
}>;
/**
 * Benchmarks organization design against industry standards.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {string} industry - Industry sector
 * @returns {Promise<{ percentiles: Record<string, number>; gaps: string[] }>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkOrganizationDesign(structure, 'healthcare');
 * ```
 */
export declare function benchmarkOrganizationDesign(structure: OrganizationStructureData, industry: string): Promise<{
    percentiles: Record<string, number>;
    gaps: string[];
}>;
/**
 * Generates change impact analysis for org design changes.
 *
 * @param {OrganizationStructureData} currentStructure - Current structure
 * @param {OrganizationStructureData} proposedStructure - Proposed structure
 * @returns {Promise<{ impactedPositions: number; impactedEmployees: number; risks: string[]; mitigations: string[] }>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeChangeImpact(current, proposed);
 * ```
 */
export declare function analyzeChangeImpact(currentStructure: OrganizationStructureData, proposedStructure: OrganizationStructureData): Promise<{
    impactedPositions: number;
    impactedEmployees: number;
    risks: string[];
    mitigations: string[];
}>;
/**
 * Designs role architecture for the organization.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} jobFamilies - Job families to design
 * @returns {Promise<{ roles: RoleDefinition[]; career paths: Record<string, string[]> }>} Role architecture
 *
 * @example
 * ```typescript
 * const architecture = await designRoleArchitecture('ORG001', ['Clinical', 'Operations']);
 * ```
 */
export declare function designRoleArchitecture(organizationId: string, jobFamilies: string[]): Promise<{
    roles: RoleDefinition[];
    careerPaths: Record<string, string[]>;
}>;
/**
 * Analyzes skills gaps in the organization.
 *
 * @param {CompetencyFramework} framework - Competency framework
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ criticalGaps: string[]; developmentPriorities: string[] }>} Skills gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await analyzeSkillsGaps(framework, positions);
 * ```
 */
export declare function analyzeSkillsGaps(framework: CompetencyFramework, positions: PositionData[]): Promise<{
    criticalGaps: string[];
    developmentPriorities: string[];
}>;
/**
 * Creates workforce segmentation model.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Workforce segments
 *
 * @example
 * ```typescript
 * const segments = await createWorkforceSegmentation('ORG001', positions);
 * ```
 */
export declare function createWorkforceSegmentation(organizationId: string, positions: PositionData[]): Promise<Record<string, number>>;
/**
 * Generates organizational redesign scenarios.
 *
 * @param {OrganizationStructureData} current - Current structure
 * @returns {Promise<{ scenarios: Array<{ name: string; structure: Partial<OrganizationStructureData>; impact: string }> }>} Redesign scenarios
 *
 * @example
 * ```typescript
 * const scenarios = await generateRedesignScenarios(currentStructure);
 * ```
 */
export declare function generateRedesignScenarios(current: OrganizationStructureData): Promise<{
    scenarios: Array<{
        name: string;
        structure: Partial<OrganizationStructureData>;
        impact: string;
    }>;
}>;
/**
 * Validates decision rights framework completeness.
 *
 * @param {DecisionRightsAllocation[]} allocations - All decision rights
 * @returns {Promise<{ coverage: number; gaps: string[]; overlaps: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDecisionRightsFramework(allocations);
 * ```
 */
export declare function validateDecisionRightsFramework(allocations: DecisionRightsAllocation[]): Promise<{
    coverage: number;
    gaps: string[];
    overlaps: string[];
}>;
/**
 * Creates talent density analysis.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @param {OrganizationalUnitData[]} units - All units
 * @returns {Promise<Record<string, { headcount: number; density: number }>>} Talent density by unit
 *
 * @example
 * ```typescript
 * const density = await analyzeTalentDensity('ORG001', positions, units);
 * ```
 */
export declare function analyzeTalentDensity(organizationId: string, positions: PositionData[], units: OrganizationalUnitData[]): Promise<Record<string, {
    headcount: number;
    density: number;
}>>;
/**
 * Generates organization effectiveness scorecard.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, number>>} Effectiveness metrics
 *
 * @example
 * ```typescript
 * const scorecard = await generateEffectivenessScorecard(structure, positions);
 * ```
 */
export declare function generateEffectivenessScorecard(structure: OrganizationStructureData, positions: PositionData[]): Promise<Record<string, number>>;
/**
 * Designs agile organizational structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {number} squadSize - Target squad size
 * @returns {Promise<{ squads: number; tribes: number; chapters: string[] }>} Agile structure
 *
 * @example
 * ```typescript
 * const agileOrg = await designAgileOrganization('ORG001', 8);
 * ```
 */
export declare function designAgileOrganization(organizationId: string, squadSize: number): Promise<{
    squads: number;
    tribes: number;
    chapters: string[];
}>;
/**
 * Calculates organizational agility index.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @returns {Promise<{ agilityScore: number; factors: Record<string, number> }>} Agility assessment
 *
 * @example
 * ```typescript
 * const agility = await calculateOrganizationalAgility(structure);
 * ```
 */
export declare function calculateOrganizationalAgility(structure: OrganizationStructureData): Promise<{
    agilityScore: number;
    factors: Record<string, number>;
}>;
/**
 * Generates communications architecture.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {Promise<{ channels: string[]; cadence: Record<string, string> }>} Communications plan
 *
 * @example
 * ```typescript
 * const comms = await generateCommunicationsArchitecture(structure, governance);
 * ```
 */
export declare function generateCommunicationsArchitecture(structure: OrganizationStructureData, governance: GovernanceStructure): Promise<{
    channels: string[];
    cadence: Record<string, string>;
}>;
/**
 * Analyzes cross-functional collaboration patterns.
 *
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ collaborationIndex: number; siloRisk: string[] }>} Collaboration analysis
 *
 * @example
 * ```typescript
 * const collab = await analyzeCrossFunctionalCollaboration(positions);
 * ```
 */
export declare function analyzeCrossFunctionalCollaboration(positions: PositionData[]): Promise<{
    collaborationIndex: number;
    siloRisk: string[];
}>;
/**
 * Designs centers of excellence structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} domains - Domain areas
 * @returns {Promise<Array<{ name: string; purpose: string; roles: string[] }>>} CoE structure
 *
 * @example
 * ```typescript
 * const coes = await designCentersOfExcellence('ORG001', ['Data', 'Innovation']);
 * ```
 */
export declare function designCentersOfExcellence(organizationId: string, domains: string[]): Promise<Array<{
    name: string;
    purpose: string;
    roles: string[];
}>>;
/**
 * Validates governance framework completeness.
 *
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {Promise<{ isComplete: boolean; gaps: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateGovernanceFramework(governance);
 * ```
 */
export declare function validateGovernanceFramework(governance: GovernanceStructure): Promise<{
    isComplete: boolean;
    gaps: string[];
}>;
/**
 * Generates role transition plan.
 *
 * @param {string} fromRoleId - Current role
 * @param {string} toRoleId - Target role
 * @returns {Promise<{ duration: number; activities: string[]; milestones: string[] }>} Transition plan
 *
 * @example
 * ```typescript
 * const plan = await generateRoleTransitionPlan('ROLE123', 'ROLE456');
 * ```
 */
export declare function generateRoleTransitionPlan(fromRoleId: string, toRoleId: string): Promise<{
    duration: number;
    activities: string[];
    milestones: string[];
}>;
/**
 * Calculates organizational health index.
 *
 * @param {OrganizationalHealthMetrics} metrics - Health metrics
 * @returns {Promise<{ index: number; rating: string; trend: string }>} Health index
 *
 * @example
 * ```typescript
 * const health = await calculateOrganizationalHealthIndex(metrics);
 * ```
 */
export declare function calculateOrganizationalHealthIndex(metrics: OrganizationalHealthMetrics): Promise<{
    index: number;
    rating: string;
    trend: string;
}>;
/**
 * Designs shared services model.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} services - Services to centralize
 * @returns {Promise<{ model: string; services: Array<{ name: string; savings: number }> }>} Shared services design
 *
 * @example
 * ```typescript
 * const sharedServices = await designSharedServicesModel('ORG001', ['HR', 'Finance']);
 * ```
 */
export declare function designSharedServicesModel(organizationId: string, services: string[]): Promise<{
    model: string;
    services: Array<{
        name: string;
        savings: number;
    }>;
}>;
/**
 * Analyzes decision-making velocity.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {DecisionRightsAllocation[]} decisions - Decision rights
 * @returns {Promise<{ velocityScore: number; bottlenecks: string[] }>} Velocity analysis
 *
 * @example
 * ```typescript
 * const velocity = await analyzeDecisionVelocity(structure, decisions);
 * ```
 */
export declare function analyzeDecisionVelocity(structure: OrganizationStructureData, decisions: DecisionRightsAllocation[]): Promise<{
    velocityScore: number;
    bottlenecks: string[];
}>;
/**
 * Generates organization transformation timeline.
 *
 * @param {TransformationRoadmap} roadmap - Transformation roadmap
 * @returns {Promise<{ timeline: string[]; criticalPath: string[] }>} Timeline visualization
 *
 * @example
 * ```typescript
 * const timeline = await generateTransformationTimeline(roadmap);
 * ```
 */
export declare function generateTransformationTimeline(roadmap: TransformationRoadmap): Promise<{
    timeline: string[];
    criticalPath: string[];
}>;
/**
 * Designs innovation organizational model.
 *
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<{ model: string; structure: string[]; principles: string[] }>} Innovation model
 *
 * @example
 * ```typescript
 * const innovation = await designInnovationModel('ORG001');
 * ```
 */
export declare function designInnovationModel(organizationId: string): Promise<{
    model: string;
    structure: string[];
    principles: string[];
}>;
/**
 * Calculates role clarity index.
 *
 * @param {RoleDefinition[]} roles - All role definitions
 * @param {RACIMatrix[]} matrices - RACI matrices
 * @returns {Promise<{ clarityScore: number; ambiguities: string[] }>} Role clarity assessment
 *
 * @example
 * ```typescript
 * const clarity = await calculateRoleClarity(roles, matrices);
 * ```
 */
export declare function calculateRoleClarity(roles: RoleDefinition[], matrices: RACIMatrix[]): Promise<{
    clarityScore: number;
    ambiguities: string[];
}>;
/**
 * Generates workforce analytics dashboard.
 *
 * @param {string} organizationId - Organization identifier
 * @param {PositionData[]} positions - All positions
 * @param {HeadcountPlan[]} plans - Headcount plans
 * @returns {Promise<Record<string, any>>} Analytics dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateWorkforceDashboard('ORG001', positions, plans);
 * ```
 */
export declare function generateWorkforceDashboard(organizationId: string, positions: PositionData[], plans: HeadcountPlan[]): Promise<Record<string, any>>;
/**
 * Designs matrix organization structure.
 *
 * @param {string} organizationId - Organization identifier
 * @param {string[]} functionalAreas - Functional areas
 * @param {string[]} productLines - Product lines
 * @returns {Promise<{ grid: string[][]; dualReporting: number }>} Matrix structure
 *
 * @example
 * ```typescript
 * const matrix = await designMatrixStructure('ORG001', ['Eng', 'Sales'], ['Product A', 'Product B']);
 * ```
 */
export declare function designMatrixStructure(organizationId: string, functionalAreas: string[], productLines: string[]): Promise<{
    grid: string[][];
    dualReporting: number;
}>;
/**
 * Analyzes organizational resilience.
 *
 * @param {OrganizationStructureData} structure - Organization structure
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<{ resilienceScore: number; vulnerabilities: string[] }>} Resilience analysis
 *
 * @example
 * ```typescript
 * const resilience = await analyzeOrganizationalResilience(structure, positions);
 * ```
 */
export declare function analyzeOrganizationalResilience(structure: OrganizationStructureData, positions: PositionData[]): Promise<{
    resilienceScore: number;
    vulnerabilities: string[];
}>;
/**
 * Generates capability heat map.
 *
 * @param {CompetencyFramework} framework - Competency framework
 * @param {PositionData[]} positions - All positions
 * @returns {Promise<Record<string, { strength: string; gap: number }>>} Capability heat map
 *
 * @example
 * ```typescript
 * const heatMap = await generateCapabilityHeatMap(framework, positions);
 * ```
 */
export declare function generateCapabilityHeatMap(framework: CompetencyFramework, positions: PositionData[]): Promise<Record<string, {
    strength: string;
    gap: number;
}>>;
/**
 * Creates organizational network analysis.
 *
 * @param {PositionData[]} positions - All positions
 * @param {ReportingRelationship[]} relationships - Reporting relationships
 * @returns {Promise<{ centrality: Record<string, number>; clusters: string[][] }>} Network analysis
 *
 * @example
 * ```typescript
 * const network = await analyzeOrganizationalNetwork(positions, relationships);
 * ```
 */
export declare function analyzeOrganizationalNetwork(positions: PositionData[], relationships: ReportingRelationship[]): Promise<{
    centrality: Record<string, number>;
    clusters: string[][];
}>;
export {};
//# sourceMappingURL=organizational-design-kit.d.ts.map