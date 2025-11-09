/**
 * LOC: STKMGMT12345
 * File: /reuse/consulting/stakeholder-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend consulting services
 *   - Stakeholder engagement controllers
 *   - Communication planning engines
 *   - Influence mapping services
 */
/**
 * File: /reuse/consulting/stakeholder-management-kit.ts
 * Locator: WC-CONS-STKMGMT-001
 * Purpose: Comprehensive Stakeholder Management & Engagement Utilities - McKinsey/BCG-level stakeholder strategy
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Consulting controllers, stakeholder services, engagement tracking, communication management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for stakeholder analysis, power-interest grids, influence mapping, communication planning, engagement tracking
 *
 * LLM Context: Enterprise-grade stakeholder management system competing with McKinsey and BCG consulting practices.
 * Provides stakeholder identification and analysis, power-interest grid mapping, influence network analysis, RACI matrix generation,
 * communication planning and execution, stakeholder engagement tracking, resistance management, coalition building, stakeholder personas,
 * escalation management, feedback collection, sentiment analysis, relationship scoring, engagement metrics, stakeholder journey mapping,
 * meeting management, action item tracking, stakeholder surveys, executive sponsorship management.
 */
import { Sequelize } from 'sequelize';
/**
 * Stakeholder power levels
 */
export declare enum StakeholderPowerLevel {
    VERY_LOW = "very_low",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high"
}
/**
 * Stakeholder interest levels
 */
export declare enum StakeholderInterestLevel {
    VERY_LOW = "very_low",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high"
}
/**
 * Stakeholder influence types
 */
export declare enum InfluenceType {
    FORMAL = "formal",
    EXPERT = "expert",
    POLITICAL = "political",
    COALITION = "coalition",
    FINANCIAL = "financial",
    TECHNICAL = "technical"
}
/**
 * Stakeholder attitude
 */
export declare enum StakeholderAttitude {
    CHAMPION = "champion",
    SUPPORTER = "supporter",
    NEUTRAL = "neutral",
    SKEPTIC = "skeptic",
    BLOCKER = "blocker"
}
/**
 * Communication frequency
 */
export declare enum CommunicationFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    AS_NEEDED = "as_needed"
}
/**
 * Communication channel
 */
export declare enum CommunicationChannel {
    EMAIL = "email",
    MEETING = "meeting",
    WORKSHOP = "workshop",
    PHONE = "phone",
    VIDEO_CALL = "video_call",
    PRESENTATION = "presentation",
    REPORT = "report",
    NEWSLETTER = "newsletter",
    PORTAL = "portal"
}
/**
 * RACI role types
 */
export declare enum RACIRole {
    RESPONSIBLE = "responsible",
    ACCOUNTABLE = "accountable",
    CONSULTED = "consulted",
    INFORMED = "informed"
}
/**
 * Engagement status
 */
export declare enum EngagementStatus {
    NOT_ENGAGED = "not_engaged",
    INITIAL_CONTACT = "initial_contact",
    ENGAGED = "engaged",
    HIGHLY_ENGAGED = "highly_engaged",
    DISENGAGED = "disengaged"
}
/**
 * Resistance level
 */
export declare enum ResistanceLevel {
    NONE = "none",
    LOW = "low",
    MODERATE = "moderate",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Stakeholder interface
 */
export interface Stakeholder {
    id: string;
    stakeholderName: string;
    role: string;
    department: string;
    organizationLevel: string;
    email: string;
    phone?: string;
    powerLevel: StakeholderPowerLevel;
    interestLevel: StakeholderInterestLevel;
    attitude: StakeholderAttitude;
    influenceTypes: InfluenceType[];
    impactScore: number;
    engagementStatus: EngagementStatus;
    resistanceLevel: ResistanceLevel;
    communicationPreferences: CommunicationChannel[];
    objectives: string[];
    concerns: string[];
    wins: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Power-interest grid position
 */
export interface PowerInterestPosition {
    stakeholderId: string;
    stakeholderName: string;
    power: number;
    interest: number;
    quadrant: 'MANAGE_CLOSELY' | 'KEEP_SATISFIED' | 'KEEP_INFORMED' | 'MONITOR';
    strategy: string;
}
/**
 * Influence network interface
 */
export interface InfluenceNetwork {
    id: string;
    networkName: string;
    projectId: string;
    nodes: InfluenceNode[];
    edges: InfluenceEdge[];
    clusters: InfluenceCluster[];
    keyInfluencers: string[];
    bottlenecks: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Influence node interface
 */
export interface InfluenceNode {
    stakeholderId: string;
    centralityScore: number;
    betweennessScore: number;
    clusterMembership: string[];
    connections: number;
}
/**
 * Influence edge interface
 */
export interface InfluenceEdge {
    fromStakeholderId: string;
    toStakeholderId: string;
    influenceStrength: number;
    influenceType: InfluenceType;
    bidirectional: boolean;
}
/**
 * Influence cluster interface
 */
export interface InfluenceCluster {
    clusterId: string;
    clusterName: string;
    members: string[];
    clusterLeader: string;
    cohesion: number;
}
/**
 * Communication plan interface
 */
export interface CommunicationPlan {
    id: string;
    planName: string;
    projectId: string;
    startDate: Date;
    endDate: Date;
    audiences: CommunicationAudience[];
    messages: CommunicationMessage[];
    channels: CommunicationChannelPlan[];
    calendar: CommunicationEvent[];
    metrics: CommunicationMetric[];
    status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
    ownerId: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Communication audience interface
 */
export interface CommunicationAudience {
    audienceId: string;
    audienceName: string;
    stakeholderIds: string[];
    segmentCriteria: Record<string, any>;
    preferredChannels: CommunicationChannel[];
    frequency: CommunicationFrequency;
}
/**
 * Communication message interface
 */
export interface CommunicationMessage {
    messageId: string;
    messageTitle: string;
    content: string;
    keyPoints: string[];
    targetAudiences: string[];
    tone: string;
    callToAction?: string;
}
/**
 * Communication channel plan interface
 */
export interface CommunicationChannelPlan {
    channel: CommunicationChannel;
    purpose: string;
    frequency: CommunicationFrequency;
    owner: string;
    metrics: string[];
}
/**
 * Communication event interface
 */
export interface CommunicationEvent {
    eventId: string;
    eventName: string;
    eventType: CommunicationChannel;
    scheduledDate: Date;
    duration: number;
    targetAudience: string[];
    message: string;
    preparationRequired: string[];
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    outcomes?: string[];
}
/**
 * Communication metric interface
 */
export interface CommunicationMetric {
    metricName: string;
    metricType: string;
    targetValue: number;
    currentValue: number;
    unit: string;
}
/**
 * RACI matrix interface
 */
export interface RACIMatrix {
    id: string;
    matrixName: string;
    projectId: string;
    activities: RACIActivity[];
    stakeholders: string[];
    completeness: number;
    conflicts: RACIConflict[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * RACI activity interface
 */
export interface RACIActivity {
    activityId: string;
    activityName: string;
    description: string;
    assignments: Record<string, RACIRole[]>;
    missingRoles: RACIRole[];
}
/**
 * RACI conflict interface
 */
export interface RACIConflict {
    activityId: string;
    conflictType: string;
    description: string;
    affectedStakeholders: string[];
    resolution?: string;
}
/**
 * Stakeholder engagement record interface
 */
export interface EngagementRecord {
    id: string;
    stakeholderId: string;
    engagementType: string;
    engagementDate: Date;
    duration: number;
    channel: CommunicationChannel;
    topics: string[];
    outcomes: string[];
    actionItems: ActionItem[];
    sentiment: number;
    notes: string;
    conductedBy: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Action item interface
 */
export interface ActionItem {
    actionId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    completedDate?: Date;
}
/**
 * Stakeholder persona interface
 */
export interface StakeholderPersona {
    id: string;
    personaName: string;
    description: string;
    typicalRoles: string[];
    motivations: string[];
    concerns: string[];
    communicationPreferences: CommunicationChannel[];
    decisionFactors: string[];
    engagementStrategy: string;
    exampleStakeholders: string[];
    metadata: Record<string, any>;
}
/**
 * Resistance assessment interface
 */
export interface ResistanceAssessment {
    id: string;
    stakeholderId: string;
    assessmentDate: Date;
    resistanceLevel: ResistanceLevel;
    rootCauses: string[];
    symptoms: string[];
    mitigationStrategies: string[];
    progress: number;
    reassessmentDate: Date;
    assessedBy: string;
    metadata: Record<string, any>;
}
/**
 * Coalition interface
 */
export interface Coalition {
    id: string;
    coalitionName: string;
    purpose: string;
    members: string[];
    leader: string;
    formationDate: Date;
    strength: number;
    influence: number;
    objectives: string[];
    activities: string[];
    status: 'FORMING' | 'ACTIVE' | 'DISSOLVING' | 'DISSOLVED';
    metadata: Record<string, any>;
}
/**
 * Create stakeholder DTO
 */
export declare class CreateStakeholderDto {
    stakeholderName: string;
    role: string;
    department: string;
    organizationLevel: string;
    email: string;
    phone?: string;
    powerLevel: StakeholderPowerLevel;
    interestLevel: StakeholderInterestLevel;
}
/**
 * Update stakeholder DTO
 */
export declare class UpdateStakeholderDto {
    powerLevel?: StakeholderPowerLevel;
    interestLevel?: StakeholderInterestLevel;
    attitude?: StakeholderAttitude;
    engagementStatus?: EngagementStatus;
    objectives?: string[];
    concerns?: string[];
}
/**
 * Create communication plan DTO
 */
export declare class CreateCommunicationPlanDto {
    planName: string;
    projectId: string;
    startDate: Date;
    endDate: Date;
    ownerId: string;
}
/**
 * Create engagement record DTO
 */
export declare class CreateEngagementRecordDto {
    stakeholderId: string;
    engagementType: string;
    engagementDate: Date;
    duration: number;
    channel: CommunicationChannel;
    topics: string[];
    conductedBy: string;
}
/**
 * Create action item DTO
 */
export declare class CreateActionItemDto {
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
/**
 * Create RACI matrix DTO
 */
export declare class CreateRACIMatrixDto {
    matrixName: string;
    projectId: string;
    stakeholders: string[];
}
/**
 * Power-interest mapping DTO
 */
export declare class PowerInterestMappingDto {
    power: number;
    interest: number;
}
/**
 * Sequelize model for Stakeholders
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Stakeholder model
 *
 * @example
 * ```typescript
 * const StakeholderModel = createStakeholderModel(sequelize);
 * const stakeholder = await StakeholderModel.create({
 *   stakeholderName: 'John Smith',
 *   role: 'CTO',
 *   powerLevel: StakeholderPowerLevel.HIGH,
 *   interestLevel: StakeholderInterestLevel.HIGH
 * });
 * ```
 */
export declare const createStakeholderModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        stakeholderName: string;
        role: string;
        department: string;
        organizationLevel: string;
        email: string;
        phone: string | null;
        powerLevel: StakeholderPowerLevel;
        interestLevel: StakeholderInterestLevel;
        attitude: StakeholderAttitude;
        influenceTypes: string[];
        impactScore: number;
        engagementStatus: EngagementStatus;
        resistanceLevel: ResistanceLevel;
        communicationPreferences: string[];
        objectives: string[];
        concerns: string[];
        wins: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Communication Plans
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CommunicationPlan model
 *
 * @example
 * ```typescript
 * const CommunicationPlanModel = createCommunicationPlanModel(sequelize);
 * const plan = await CommunicationPlanModel.create({
 *   planName: 'Q1 2025 Stakeholder Communications',
 *   projectId: 'project-123',
 *   status: 'DRAFT'
 * });
 * ```
 */
export declare const createCommunicationPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        planName: string;
        projectId: string;
        startDate: Date;
        endDate: Date;
        audiences: any[];
        messages: any[];
        channels: any[];
        calendar: any[];
        metrics: any[];
        status: string;
        ownerId: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Engagement Records
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EngagementRecord model
 *
 * @example
 * ```typescript
 * const EngagementRecordModel = createEngagementRecordModel(sequelize);
 * const record = await EngagementRecordModel.create({
 *   stakeholderId: 'stakeholder-123',
 *   engagementType: 'One-on-One Meeting',
 *   engagementDate: new Date(),
 *   sentiment: 75
 * });
 * ```
 */
export declare const createEngagementRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        stakeholderId: string;
        engagementType: string;
        engagementDate: Date;
        duration: number;
        channel: CommunicationChannel;
        topics: string[];
        outcomes: string[];
        actionItems: any[];
        sentiment: number;
        notes: string;
        conductedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Identifies and catalogs stakeholders for a project or initiative.
 *
 * @param {string} projectId - Project identifier
 * @param {object} identificationCriteria - Criteria for stakeholder identification
 * @returns {Promise<Stakeholder[]>} Identified stakeholders
 *
 * @example
 * ```typescript
 * const stakeholders = await identifyStakeholders('project-123', {
 *   includeExecutives: true,
 *   departmentFilter: ['IT', 'Finance', 'Operations'],
 *   minimumImpact: 'MEDIUM'
 * });
 * ```
 */
export declare const identifyStakeholders: (projectId: string, identificationCriteria: any) => Promise<Stakeholder[]>;
/**
 * Analyzes stakeholder power and interest levels.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {object} analysisFactors - Factors to consider in analysis
 * @returns {Promise<{ power: number; interest: number; justification: string }>} Power-interest analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeStakeholderPowerInterest('stakeholder-123', {
 *   formalAuthority: 8,
 *   budgetControl: 9,
 *   expertise: 7,
 *   affectedByOutcome: 8
 * });
 * ```
 */
export declare const analyzeStakeholderPowerInterest: (stakeholderId: string, analysisFactors: any) => Promise<{
    power: number;
    interest: number;
    justification: string;
}>;
/**
 * Calculates stakeholder impact score based on multiple dimensions.
 *
 * @param {Stakeholder} stakeholder - Stakeholder data
 * @returns {Promise<number>} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impactScore = await calculateStakeholderImpact(stakeholder);
 * ```
 */
export declare const calculateStakeholderImpact: (stakeholder: Stakeholder) => Promise<number>;
/**
 * Generates comprehensive stakeholder profile.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<object>} Comprehensive stakeholder profile
 *
 * @example
 * ```typescript
 * const profile = await generateStakeholderProfile('stakeholder-123');
 * ```
 */
export declare const generateStakeholderProfile: (stakeholderId: string) => Promise<any>;
/**
 * Segments stakeholders into groups based on characteristics.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {string} segmentationCriteria - Criteria for segmentation
 * @returns {Promise<Record<string, Stakeholder[]>>} Stakeholder segments
 *
 * @example
 * ```typescript
 * const segments = await segmentStakeholders(stakeholders, 'POWER_INTEREST');
 * ```
 */
export declare const segmentStakeholders: (stakeholders: Stakeholder[], segmentationCriteria: string) => Promise<Record<string, Stakeholder[]>>;
/**
 * Assesses stakeholder attitude and sentiment toward initiative.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {object} indicators - Attitude indicators
 * @returns {Promise<{ attitude: StakeholderAttitude; confidence: number; indicators: string[] }>} Attitude assessment
 *
 * @example
 * ```typescript
 * const attitude = await assessStakeholderAttitude('stakeholder-123', {
 *   verbalSupport: 8,
 *   actionAlignment: 7,
 *   resourceCommitment: 6
 * });
 * ```
 */
export declare const assessStakeholderAttitude: (stakeholderId: string, indicators: any) => Promise<{
    attitude: StakeholderAttitude;
    confidence: number;
    indicators: string[];
}>;
/**
 * Identifies key decision makers and influencers.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<{ decisionMakers: Stakeholder[]; influencers: Stakeholder[] }>} Key stakeholders
 *
 * @example
 * ```typescript
 * const keyStakeholders = await identifyKeyStakeholders(stakeholders);
 * ```
 */
export declare const identifyKeyStakeholders: (stakeholders: Stakeholder[]) => Promise<{
    decisionMakers: Stakeholder[];
    influencers: Stakeholder[];
}>;
/**
 * Analyzes stakeholder interdependencies and relationships.
 *
 * @param {string[]} stakeholderIds - Stakeholder identifiers
 * @returns {Promise<{ relationships: any[]; dependencies: any[] }>} Relationship analysis
 *
 * @example
 * ```typescript
 * const relationships = await analyzeStakeholderRelationships(['stakeholder-1', 'stakeholder-2', 'stakeholder-3']);
 * ```
 */
export declare const analyzeStakeholderRelationships: (stakeholderIds: string[]) => Promise<{
    relationships: any[];
    dependencies: any[];
}>;
/**
 * Generates stakeholder register document.
 *
 * @param {string} projectId - Project identifier
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<Buffer>} Stakeholder register document
 *
 * @example
 * ```typescript
 * const register = await generateStakeholderRegister('project-123', stakeholders);
 * ```
 */
export declare const generateStakeholderRegister: (projectId: string, stakeholders: Stakeholder[]) => Promise<Buffer>;
/**
 * Maps stakeholders onto power-interest grid.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<PowerInterestPosition[]>} Grid positions
 *
 * @example
 * ```typescript
 * const gridMapping = await mapPowerInterestGrid(stakeholders);
 * ```
 */
export declare const mapPowerInterestGrid: (stakeholders: Stakeholder[]) => Promise<PowerInterestPosition[]>;
/**
 * Generates engagement strategy based on power-interest position.
 *
 * @param {PowerInterestPosition} position - Grid position
 * @returns {Promise<object>} Engagement strategy
 *
 * @example
 * ```typescript
 * const strategy = await generateEngagementStrategy(position);
 * ```
 */
export declare const generateEngagementStrategy: (position: PowerInterestPosition) => Promise<any>;
/**
 * Tracks stakeholder movement across power-interest grid over time.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {Date} startDate - Start date for tracking
 * @param {Date} endDate - End date for tracking
 * @returns {Promise<{ trajectory: any[]; trend: string }>} Movement tracking
 *
 * @example
 * ```typescript
 * const movement = await trackStakeholderMovement('stakeholder-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
export declare const trackStakeholderMovement: (stakeholderId: string, startDate: Date, endDate: Date) => Promise<{
    trajectory: any[];
    trend: string;
}>;
/**
 * Identifies stakeholders at risk of becoming blockers.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<Stakeholder[]>} At-risk stakeholders
 *
 * @example
 * ```typescript
 * const atRisk = await identifyAtRiskStakeholders(stakeholders);
 * ```
 */
export declare const identifyAtRiskStakeholders: (stakeholders: Stakeholder[]) => Promise<Stakeholder[]>;
/**
 * Prioritizes stakeholder engagement efforts based on impact.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} constraints - Resource constraints
 * @returns {Promise<{ priority: string; stakeholders: Stakeholder[] }[]>} Prioritized stakeholders
 *
 * @example
 * ```typescript
 * const priorities = await prioritizeStakeholderEngagement(stakeholders, { teamCapacity: 10 });
 * ```
 */
export declare const prioritizeStakeholderEngagement: (stakeholders: Stakeholder[], constraints: any) => Promise<{
    priority: string;
    stakeholders: Stakeholder[];
}[]>;
/**
 * Generates power-interest grid visualization data.
 *
 * @param {PowerInterestPosition[]} positions - Grid positions
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const vizData = await generateGridVisualization(positions);
 * ```
 */
export declare const generateGridVisualization: (positions: PowerInterestPosition[]) => Promise<any>;
/**
 * Analyzes optimal stakeholder portfolio composition.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @returns {Promise<{ balance: string; recommendations: string[] }>} Portfolio analysis
 *
 * @example
 * ```typescript
 * const portfolio = await analyzeStakeholderPortfolio(stakeholders);
 * ```
 */
export declare const analyzeStakeholderPortfolio: (stakeholders: Stakeholder[]) => Promise<{
    balance: string;
    recommendations: string[];
}>;
/**
 * Simulates impact of stakeholder position changes.
 *
 * @param {Stakeholder[]} stakeholders - Current stakeholders
 * @param {object} scenario - Scenario to simulate
 * @returns {Promise<{ projectedOutcome: string; risks: string[]; opportunities: string[] }>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateStakeholderScenario(stakeholders, {
 *   changeAttitude: { 'stakeholder-123': 'CHAMPION' }
 * });
 * ```
 */
export declare const simulateStakeholderScenario: (stakeholders: Stakeholder[], scenario: any) => Promise<{
    projectedOutcome: string;
    risks: string[];
    opportunities: string[];
}>;
/**
 * Exports power-interest grid analysis to presentation format.
 *
 * @param {PowerInterestPosition[]} positions - Grid positions
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported analysis
 *
 * @example
 * ```typescript
 * const pptx = await exportPowerInterestAnalysis(positions, 'POWERPOINT');
 * ```
 */
export declare const exportPowerInterestAnalysis: (positions: PowerInterestPosition[], format: string) => Promise<Buffer>;
/**
 * Maps stakeholder influence networks and relationships.
 *
 * @param {string} projectId - Project identifier
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} relationshipData - Relationship data
 * @returns {Promise<InfluenceNetwork>} Influence network
 *
 * @example
 * ```typescript
 * const network = await mapInfluenceNetwork('project-123', stakeholders, relationshipData);
 * ```
 */
export declare const mapInfluenceNetwork: (projectId: string, stakeholders: Stakeholder[], relationshipData: any) => Promise<InfluenceNetwork>;
/**
 * Calculates network centrality metrics for stakeholders.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<{ degree: number; betweenness: number; closeness: number; eigenvector: number }>} Centrality metrics
 *
 * @example
 * ```typescript
 * const centrality = await calculateNetworkCentrality(network, 'stakeholder-123');
 * ```
 */
export declare const calculateNetworkCentrality: (network: InfluenceNetwork, stakeholderId: string) => Promise<{
    degree: number;
    betweenness: number;
    closeness: number;
    eigenvector: number;
}>;
/**
 * Identifies influence clusters and coalitions.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<InfluenceCluster[]>} Identified clusters
 *
 * @example
 * ```typescript
 * const clusters = await identifyInfluenceClusters(network);
 * ```
 */
export declare const identifyInfluenceClusters: (network: InfluenceNetwork) => Promise<InfluenceCluster[]>;
/**
 * Finds key influencers who can sway others.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {number} topN - Number of top influencers to return
 * @returns {Promise<Stakeholder[]>} Key influencers
 *
 * @example
 * ```typescript
 * const influencers = await findKeyInfluencers(network, 5);
 * ```
 */
export declare const findKeyInfluencers: (network: InfluenceNetwork, topN?: number) => Promise<Stakeholder[]>;
/**
 * Analyzes influence paths between stakeholders.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} fromStakeholderId - Source stakeholder
 * @param {string} toStakeholderId - Target stakeholder
 * @returns {Promise<{ paths: any[]; shortestPath: any; influence: number }>} Path analysis
 *
 * @example
 * ```typescript
 * const paths = await analyzeInfluencePaths(network, 'stakeholder-1', 'stakeholder-5');
 * ```
 */
export declare const analyzeInfluencePaths: (network: InfluenceNetwork, fromStakeholderId: string, toStakeholderId: string) => Promise<{
    paths: any[];
    shortestPath: any;
    influence: number;
}>;
/**
 * Identifies opinion leaders and gatekeepers.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<{ opinionLeaders: string[]; gatekeepers: string[] }>} Leaders and gatekeepers
 *
 * @example
 * ```typescript
 * const leaders = await identifyOpinionLeaders(network);
 * ```
 */
export declare const identifyOpinionLeaders: (network: InfluenceNetwork) => Promise<{
    opinionLeaders: string[];
    gatekeepers: string[];
}>;
/**
 * Simulates influence cascade through network.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @param {string} seedStakeholderId - Initial stakeholder
 * @param {string} message - Message being spread
 * @returns {Promise<{ reach: number; timeline: any[]; adoption: number }>} Cascade simulation
 *
 * @example
 * ```typescript
 * const cascade = await simulateInfluenceCascade(network, 'stakeholder-1', 'Support for initiative');
 * ```
 */
export declare const simulateInfluenceCascade: (network: InfluenceNetwork, seedStakeholderId: string, message: string) => Promise<{
    reach: number;
    timeline: any[];
    adoption: number;
}>;
/**
 * Generates influence network visualization.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<object>} Visualization data
 *
 * @example
 * ```typescript
 * const viz = await generateInfluenceNetworkVisualization(network);
 * ```
 */
export declare const generateInfluenceNetworkVisualization: (network: InfluenceNetwork) => Promise<any>;
/**
 * Assesses network resilience and vulnerability.
 *
 * @param {InfluenceNetwork} network - Influence network
 * @returns {Promise<{ resilience: number; vulnerabilities: string[]; recommendations: string[] }>} Resilience assessment
 *
 * @example
 * ```typescript
 * const resilience = await assessNetworkResilience(network);
 * ```
 */
export declare const assessNetworkResilience: (network: InfluenceNetwork) => Promise<{
    resilience: number;
    vulnerabilities: string[];
    recommendations: string[];
}>;
/**
 * Creates comprehensive stakeholder communication plan.
 *
 * @param {CreateCommunicationPlanDto} planData - Plan creation data
 * @param {Stakeholder[]} stakeholders - Target stakeholders
 * @returns {Promise<CommunicationPlan>} Communication plan
 *
 * @example
 * ```typescript
 * const plan = await createCommunicationPlan({
 *   planName: 'Q1 2025 Digital Transformation Communications',
 *   projectId: 'project-123',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31'),
 *   ownerId: 'pm-456'
 * }, stakeholders);
 * ```
 */
export declare const createCommunicationPlan: (planData: CreateCommunicationPlanDto, stakeholders: Stakeholder[]) => Promise<CommunicationPlan>;
/**
 * Defines target audiences and segments for communications.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {string} segmentationApproach - Segmentation approach
 * @returns {Promise<CommunicationAudience[]>} Communication audiences
 *
 * @example
 * ```typescript
 * const audiences = await defineTargetAudiences(stakeholders, 'ROLE_BASED');
 * ```
 */
export declare const defineTargetAudiences: (stakeholders: Stakeholder[], segmentationApproach: string) => Promise<CommunicationAudience[]>;
/**
 * Crafts key messages for different stakeholder audiences.
 *
 * @param {CommunicationAudience} audience - Target audience
 * @param {object} messageParameters - Message parameters
 * @returns {Promise<CommunicationMessage>} Crafted message
 *
 * @example
 * ```typescript
 * const message = await craftKeyMessage(executiveAudience, {
 *   topic: 'Digital Transformation Progress',
 *   tone: 'Professional',
 *   focus: 'Business value'
 * });
 * ```
 */
export declare const craftKeyMessage: (audience: CommunicationAudience, messageParameters: any) => Promise<CommunicationMessage>;
/**
 * Generates communication calendar with scheduled touchpoints.
 *
 * @param {CommunicationPlan} plan - Communication plan
 * @param {CommunicationFrequency} defaultFrequency - Default frequency
 * @returns {Promise<CommunicationEvent[]>} Communication calendar
 *
 * @example
 * ```typescript
 * const calendar = await generateCommunicationCalendar(plan, CommunicationFrequency.WEEKLY);
 * ```
 */
export declare const generateCommunicationCalendar: (plan: CommunicationPlan, defaultFrequency: CommunicationFrequency) => Promise<CommunicationEvent[]>;
/**
 * Selects optimal communication channels for each stakeholder group.
 *
 * @param {CommunicationAudience} audience - Target audience
 * @param {object} constraints - Channel constraints
 * @returns {Promise<CommunicationChannel[]>} Recommended channels
 *
 * @example
 * ```typescript
 * const channels = await selectCommunicationChannels(audience, { budget: 10000, timeAvailable: 'LIMITED' });
 * ```
 */
export declare const selectCommunicationChannels: (audience: CommunicationAudience, constraints: any) => Promise<CommunicationChannel[]>;
/**
 * Tracks communication plan execution and effectiveness.
 *
 * @param {string} planId - Communication plan ID
 * @returns {Promise<{ completionRate: number; effectiveness: number; issues: string[] }>} Execution tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackCommunicationExecution('plan-123');
 * ```
 */
export declare const trackCommunicationExecution: (planId: string) => Promise<{
    completionRate: number;
    effectiveness: number;
    issues: string[];
}>;
/**
 * Measures communication effectiveness through metrics.
 *
 * @param {string} planId - Communication plan ID
 * @param {CommunicationMetric[]} metrics - Metrics to measure
 * @returns {Promise<Record<string, number>>} Measurement results
 *
 * @example
 * ```typescript
 * const results = await measureCommunicationEffectiveness('plan-123', metrics);
 * ```
 */
export declare const measureCommunicationEffectiveness: (planId: string, metrics: CommunicationMetric[]) => Promise<Record<string, number>>;
/**
 * Adjusts communication plan based on feedback and results.
 *
 * @param {string} planId - Communication plan ID
 * @param {object} adjustments - Plan adjustments
 * @returns {Promise<CommunicationPlan>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await adjustCommunicationPlan('plan-123', {
 *   increaseFrequency: ['executives'],
 *   addChannel: { audience: 'managers', channel: CommunicationChannel.WORKSHOP }
 * });
 * ```
 */
export declare const adjustCommunicationPlan: (planId: string, adjustments: any) => Promise<CommunicationPlan>;
/**
 * Generates communication templates for common scenarios.
 *
 * @param {string} scenarioType - Scenario type
 * @param {object} parameters - Template parameters
 * @returns {Promise<{ subject: string; body: string; tone: string }>} Communication template
 *
 * @example
 * ```typescript
 * const template = await generateCommunicationTemplate('PROJECT_UPDATE', {
 *   projectName: 'Digital Transformation',
 *   progress: 75
 * });
 * ```
 */
export declare const generateCommunicationTemplate: (scenarioType: string, parameters: any) => Promise<{
    subject: string;
    body: string;
    tone: string;
}>;
/**
 * Records stakeholder engagement interaction.
 *
 * @param {CreateEngagementRecordDto} recordData - Engagement record data
 * @returns {Promise<EngagementRecord>} Created engagement record
 *
 * @example
 * ```typescript
 * const record = await recordStakeholderEngagement({
 *   stakeholderId: 'stakeholder-123',
 *   engagementType: 'One-on-One Meeting',
 *   engagementDate: new Date(),
 *   duration: 60,
 *   channel: CommunicationChannel.MEETING,
 *   topics: ['Progress update', 'Concerns discussion'],
 *   conductedBy: 'pm-456'
 * });
 * ```
 */
export declare const recordStakeholderEngagement: (recordData: CreateEngagementRecordDto) => Promise<EngagementRecord>;
/**
 * Analyzes stakeholder sentiment from engagement history.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @returns {Promise<{ averageSentiment: number; trend: string; insights: string[] }>} Sentiment analysis
 *
 * @example
 * ```typescript
 * const sentiment = await analyzeStakeholderSentiment('stakeholder-123', new Date('2024-01-01'), new Date('2025-01-01'));
 * ```
 */
export declare const analyzeStakeholderSentiment: (stakeholderId: string, startDate: Date, endDate: Date) => Promise<{
    averageSentiment: number;
    trend: string;
    insights: string[];
}>;
/**
 * Tracks action items from stakeholder engagements.
 *
 * @param {string[]} actionItemIds - Action item identifiers
 * @returns {Promise<{ completed: number; overdue: number; inProgress: number }>} Action item status
 *
 * @example
 * ```typescript
 * const status = await trackActionItems(['action-1', 'action-2', 'action-3']);
 * ```
 */
export declare const trackActionItems: (actionItemIds: string[]) => Promise<{
    completed: number;
    overdue: number;
    inProgress: number;
}>;
/**
 * Generates stakeholder engagement scorecard.
 *
 * @param {string} stakeholderId - Stakeholder identifier
 * @returns {Promise<object>} Engagement scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateEngagementScorecard('stakeholder-123');
 * ```
 */
export declare const generateEngagementScorecard: (stakeholderId: string) => Promise<any>;
/**
 * Identifies engagement gaps and opportunities.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} targetEngagementLevels - Target engagement levels
 * @returns {Promise<{ gaps: any[]; opportunities: any[] }>} Gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await identifyEngagementGaps(stakeholders, { highPowerStakeholders: 'WEEKLY' });
 * ```
 */
export declare const identifyEngagementGaps: (stakeholders: Stakeholder[], targetEngagementLevels: any) => Promise<{
    gaps: any[];
    opportunities: any[];
}>;
/**
 * Creates RACI matrix for project activities.
 *
 * @param {CreateRACIMatrixDto} matrixData - RACI matrix data
 * @param {string[]} activities - List of activities
 * @returns {Promise<RACIMatrix>} RACI matrix
 *
 * @example
 * ```typescript
 * const raci = await createRACIMatrix({
 *   matrixName: 'Digital Transformation RACI',
 *   projectId: 'project-123',
 *   stakeholders: ['stakeholder-1', 'stakeholder-2']
 * }, ['Requirements gathering', 'Design approval', 'Implementation']);
 * ```
 */
export declare const createRACIMatrix: (matrixData: CreateRACIMatrixDto, activities: string[]) => Promise<RACIMatrix>;
/**
 * Validates RACI matrix for completeness and conflicts.
 *
 * @param {RACIMatrix} matrix - RACI matrix to validate
 * @returns {Promise<{ valid: boolean; issues: string[]; recommendations: string[] }>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateRACIMatrix(raciMatrix);
 * ```
 */
export declare const validateRACIMatrix: (matrix: RACIMatrix) => Promise<{
    valid: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Builds stakeholder coalitions to support initiatives.
 *
 * @param {Stakeholder[]} stakeholders - List of stakeholders
 * @param {object} coalitionPurpose - Coalition purpose and goals
 * @returns {Promise<Coalition>} Created coalition
 *
 * @example
 * ```typescript
 * const coalition = await buildStakeholderCoalition(champions, {
 *   purpose: 'Support digital transformation',
 *   objectives: ['Build support', 'Address resistance']
 * });
 * ```
 */
export declare const buildStakeholderCoalition: (stakeholders: Stakeholder[], coalitionPurpose: any) => Promise<Coalition>;
/**
 * Generates comprehensive stakeholder engagement report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} reportingPeriodStart - Reporting period start
 * @param {Date} reportingPeriodEnd - Reporting period end
 * @returns {Promise<Buffer>} Engagement report
 *
 * @example
 * ```typescript
 * const report = await generateStakeholderReport('project-123', new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const generateStakeholderReport: (projectId: string, reportingPeriodStart: Date, reportingPeriodEnd: Date) => Promise<Buffer>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createStakeholderModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            stakeholderName: string;
            role: string;
            department: string;
            organizationLevel: string;
            email: string;
            phone: string | null;
            powerLevel: StakeholderPowerLevel;
            interestLevel: StakeholderInterestLevel;
            attitude: StakeholderAttitude;
            influenceTypes: string[];
            impactScore: number;
            engagementStatus: EngagementStatus;
            resistanceLevel: ResistanceLevel;
            communicationPreferences: string[];
            objectives: string[];
            concerns: string[];
            wins: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCommunicationPlanModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            planName: string;
            projectId: string;
            startDate: Date;
            endDate: Date;
            audiences: any[];
            messages: any[];
            channels: any[];
            calendar: any[];
            metrics: any[];
            status: string;
            ownerId: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createEngagementRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            stakeholderId: string;
            engagementType: string;
            engagementDate: Date;
            duration: number;
            channel: CommunicationChannel;
            topics: string[];
            outcomes: string[];
            actionItems: any[];
            sentiment: number;
            notes: string;
            conductedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    identifyStakeholders: (projectId: string, identificationCriteria: any) => Promise<Stakeholder[]>;
    analyzeStakeholderPowerInterest: (stakeholderId: string, analysisFactors: any) => Promise<{
        power: number;
        interest: number;
        justification: string;
    }>;
    calculateStakeholderImpact: (stakeholder: Stakeholder) => Promise<number>;
    generateStakeholderProfile: (stakeholderId: string) => Promise<any>;
    segmentStakeholders: (stakeholders: Stakeholder[], segmentationCriteria: string) => Promise<Record<string, Stakeholder[]>>;
    assessStakeholderAttitude: (stakeholderId: string, indicators: any) => Promise<{
        attitude: StakeholderAttitude;
        confidence: number;
        indicators: string[];
    }>;
    identifyKeyStakeholders: (stakeholders: Stakeholder[]) => Promise<{
        decisionMakers: Stakeholder[];
        influencers: Stakeholder[];
    }>;
    analyzeStakeholderRelationships: (stakeholderIds: string[]) => Promise<{
        relationships: any[];
        dependencies: any[];
    }>;
    generateStakeholderRegister: (projectId: string, stakeholders: Stakeholder[]) => Promise<Buffer>;
    mapPowerInterestGrid: (stakeholders: Stakeholder[]) => Promise<PowerInterestPosition[]>;
    generateEngagementStrategy: (position: PowerInterestPosition) => Promise<any>;
    trackStakeholderMovement: (stakeholderId: string, startDate: Date, endDate: Date) => Promise<{
        trajectory: any[];
        trend: string;
    }>;
    identifyAtRiskStakeholders: (stakeholders: Stakeholder[]) => Promise<Stakeholder[]>;
    prioritizeStakeholderEngagement: (stakeholders: Stakeholder[], constraints: any) => Promise<{
        priority: string;
        stakeholders: Stakeholder[];
    }[]>;
    generateGridVisualization: (positions: PowerInterestPosition[]) => Promise<any>;
    analyzeStakeholderPortfolio: (stakeholders: Stakeholder[]) => Promise<{
        balance: string;
        recommendations: string[];
    }>;
    simulateStakeholderScenario: (stakeholders: Stakeholder[], scenario: any) => Promise<{
        projectedOutcome: string;
        risks: string[];
        opportunities: string[];
    }>;
    exportPowerInterestAnalysis: (positions: PowerInterestPosition[], format: string) => Promise<Buffer>;
    mapInfluenceNetwork: (projectId: string, stakeholders: Stakeholder[], relationshipData: any) => Promise<InfluenceNetwork>;
    calculateNetworkCentrality: (network: InfluenceNetwork, stakeholderId: string) => Promise<{
        degree: number;
        betweenness: number;
        closeness: number;
        eigenvector: number;
    }>;
    identifyInfluenceClusters: (network: InfluenceNetwork) => Promise<InfluenceCluster[]>;
    findKeyInfluencers: (network: InfluenceNetwork, topN?: number) => Promise<Stakeholder[]>;
    analyzeInfluencePaths: (network: InfluenceNetwork, fromStakeholderId: string, toStakeholderId: string) => Promise<{
        paths: any[];
        shortestPath: any;
        influence: number;
    }>;
    identifyOpinionLeaders: (network: InfluenceNetwork) => Promise<{
        opinionLeaders: string[];
        gatekeepers: string[];
    }>;
    simulateInfluenceCascade: (network: InfluenceNetwork, seedStakeholderId: string, message: string) => Promise<{
        reach: number;
        timeline: any[];
        adoption: number;
    }>;
    generateInfluenceNetworkVisualization: (network: InfluenceNetwork) => Promise<any>;
    assessNetworkResilience: (network: InfluenceNetwork) => Promise<{
        resilience: number;
        vulnerabilities: string[];
        recommendations: string[];
    }>;
    createCommunicationPlan: (planData: CreateCommunicationPlanDto, stakeholders: Stakeholder[]) => Promise<CommunicationPlan>;
    defineTargetAudiences: (stakeholders: Stakeholder[], segmentationApproach: string) => Promise<CommunicationAudience[]>;
    craftKeyMessage: (audience: CommunicationAudience, messageParameters: any) => Promise<CommunicationMessage>;
    generateCommunicationCalendar: (plan: CommunicationPlan, defaultFrequency: CommunicationFrequency) => Promise<CommunicationEvent[]>;
    selectCommunicationChannels: (audience: CommunicationAudience, constraints: any) => Promise<CommunicationChannel[]>;
    trackCommunicationExecution: (planId: string) => Promise<{
        completionRate: number;
        effectiveness: number;
        issues: string[];
    }>;
    measureCommunicationEffectiveness: (planId: string, metrics: CommunicationMetric[]) => Promise<Record<string, number>>;
    adjustCommunicationPlan: (planId: string, adjustments: any) => Promise<CommunicationPlan>;
    generateCommunicationTemplate: (scenarioType: string, parameters: any) => Promise<{
        subject: string;
        body: string;
        tone: string;
    }>;
    recordStakeholderEngagement: (recordData: CreateEngagementRecordDto) => Promise<EngagementRecord>;
    analyzeStakeholderSentiment: (stakeholderId: string, startDate: Date, endDate: Date) => Promise<{
        averageSentiment: number;
        trend: string;
        insights: string[];
    }>;
    trackActionItems: (actionItemIds: string[]) => Promise<{
        completed: number;
        overdue: number;
        inProgress: number;
    }>;
    generateEngagementScorecard: (stakeholderId: string) => Promise<any>;
    identifyEngagementGaps: (stakeholders: Stakeholder[], targetEngagementLevels: any) => Promise<{
        gaps: any[];
        opportunities: any[];
    }>;
    createRACIMatrix: (matrixData: CreateRACIMatrixDto, activities: string[]) => Promise<RACIMatrix>;
    validateRACIMatrix: (matrix: RACIMatrix) => Promise<{
        valid: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    buildStakeholderCoalition: (stakeholders: Stakeholder[], coalitionPurpose: any) => Promise<Coalition>;
    generateStakeholderReport: (projectId: string, reportingPeriodStart: Date, reportingPeriodEnd: Date) => Promise<Buffer>;
};
export default _default;
//# sourceMappingURL=stakeholder-management-kit.d.ts.map