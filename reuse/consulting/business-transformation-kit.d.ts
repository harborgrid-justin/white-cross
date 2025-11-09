/**
 * LOC: CONSTRANS12345
 * File: /reuse/consulting/business-transformation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend transformation services
 *   - Change management controllers
 *   - Digital transformation engines
 *   - Process improvement dashboards
 */
/**
 * File: /reuse/consulting/business-transformation-kit.ts
 * Locator: WC-CONSULTING-TRANSFORM-001
 * Purpose: Comprehensive Business Transformation & Change Management - McKinsey/BCG-level transformation methodologies
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Transformation controllers, change management services, digital transformation platforms
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for Kotter's 8-Step, ADKAR, Lean Six Sigma, digital transformation, process improvement
 *
 * LLM Context: Enterprise-grade business transformation system competing with McKinsey/BCG/Bain transformation practices.
 * Provides comprehensive change management frameworks including Kotter's 8-Step Change Model, ADKAR methodology,
 * Lean Six Sigma process improvement, digital transformation roadmaps, organizational change management,
 * transformation readiness assessment, stakeholder engagement, change resistance mitigation, capability building,
 * process reengineering, technology adoption, culture transformation, and comprehensive change impact analysis.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Transformation framework types
 */
export declare enum TransformationFramework {
    KOTTER_8_STEP = "kotter_8_step",
    ADKAR = "adkar",
    LEAN_SIX_SIGMA = "lean_six_sigma",
    AGILE_TRANSFORMATION = "agile_transformation",
    DIGITAL_TRANSFORMATION = "digital_transformation",
    PROCESS_REENGINEERING = "process_reengineering",
    CULTURE_CHANGE = "culture_change",
    ORGANIZATIONAL_RESTRUCTURING = "organizational_restructuring"
}
/**
 * Change management stages
 */
export declare enum ChangeStage {
    AWARENESS = "awareness",
    DESIRE = "desire",
    KNOWLEDGE = "knowledge",
    ABILITY = "ability",
    REINFORCEMENT = "reinforcement"
}
/**
 * Transformation status
 */
export declare enum TransformationStatus {
    PLANNING = "planning",
    INITIATING = "initiating",
    EXECUTING = "executing",
    STABILIZING = "stabilizing",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    AT_RISK = "at_risk"
}
/**
 * Change resistance levels
 */
export declare enum ResistanceLevel {
    STRONG_SUPPORT = "strong_support",
    SUPPORT = "support",
    NEUTRAL = "neutral",
    RESISTANCE = "resistance",
    STRONG_RESISTANCE = "strong_resistance"
}
/**
 * Readiness levels
 */
export declare enum ReadinessLevel {
    VERY_READY = "very_ready",
    READY = "ready",
    SOMEWHAT_READY = "somewhat_ready",
    NOT_READY = "not_ready",
    VERY_NOT_READY = "very_not_ready"
}
/**
 * Transformation priority
 */
export declare enum TransformationPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Process maturity levels
 */
export declare enum ProcessMaturityLevel {
    INITIAL = "initial",
    MANAGED = "managed",
    DEFINED = "defined",
    QUANTITATIVELY_MANAGED = "quantitatively_managed",
    OPTIMIZING = "optimizing"
}
/**
 * Digital maturity levels
 */
export declare enum DigitalMaturityLevel {
    TRADITIONAL = "traditional",
    EMERGING = "emerging",
    CONNECTED = "connected",
    MULTI_MOMENT = "multi_moment",
    FULLY_DIGITAL = "fully_digital"
}
/**
 * Six Sigma belt levels
 */
export declare enum SixSigmaBelt {
    WHITE_BELT = "white_belt",
    YELLOW_BELT = "yellow_belt",
    GREEN_BELT = "green_belt",
    BLACK_BELT = "black_belt",
    MASTER_BLACK_BELT = "master_black_belt"
}
/**
 * Transformation context
 */
export interface TransformationContext {
    organizationId: string;
    userId: string;
    timestamp: string;
    framework: TransformationFramework;
    transformationId?: string;
    metadata?: Record<string, any>;
}
/**
 * Kotter's 8-Step Change Model
 */
export interface KotterChangeModel {
    id: string;
    organizationId: string;
    transformationName: string;
    startDate: string;
    targetCompletionDate: string;
    step1_CreateUrgency: KotterStep;
    step2_BuildCoalition: KotterStep;
    step3_FormVision: KotterStep;
    step4_CommunicateVision: KotterStep;
    step5_EmpowerAction: KotterStep;
    step6_CreateWins: KotterStep;
    step7_BuildOnChange: KotterStep;
    step8_AnchorChange: KotterStep;
    overallProgress: number;
    status: TransformationStatus;
    stakeholders: Stakeholder[];
    risks: TransformationRisk[];
    successMetrics: SuccessMetric[];
    metadata: Record<string, any>;
}
/**
 * Kotter step details
 */
export interface KotterStep {
    stepNumber: number;
    stepName: string;
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    activities: Activity[];
    keyMilestones: Milestone[];
    completionCriteria: string[];
    actualCompletionDate?: string;
    notes: string;
}
/**
 * ADKAR Change Model
 */
export interface ADKARChangeModel {
    id: string;
    organizationId: string;
    changeName: string;
    targetAudience: string[];
    awareness: ADKARPhase;
    desire: ADKARPhase;
    knowledge: ADKARPhase;
    ability: ADKARPhase;
    reinforcement: ADKARPhase;
    overallReadiness: number;
    status: TransformationStatus;
    barriers: ChangeBarrier[];
    interventions: ChangeIntervention[];
    assessments: ReadinessAssessment[];
    metadata: Record<string, any>;
}
/**
 * ADKAR phase details
 */
export interface ADKARPhase {
    phase: ChangeStage;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    activities: Activity[];
    communicationPlan: CommunicationActivity[];
    trainingPlan?: TrainingActivity[];
    completionCriteria: string[];
    assessmentResults?: AssessmentResult[];
}
/**
 * Lean Six Sigma project
 */
export interface LeanSixSigmaProject {
    id: string;
    organizationId: string;
    projectName: string;
    projectType: 'DMAIC' | 'DMADV';
    problemStatement: string;
    goalStatement: string;
    scope: ProjectScope;
    define: DMAICPhase;
    measure: DMAICPhase;
    analyze: DMAICPhase;
    improve: DMAICPhase;
    control: DMAICPhase;
    projectCharter: ProjectCharter;
    team: ProjectTeam;
    financialImpact: FinancialImpact;
    timeline: ProjectTimeline;
    status: TransformationStatus;
    metadata: Record<string, any>;
}
/**
 * DMAIC phase
 */
export interface DMAICPhase {
    phaseName: 'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control';
    status: 'not_started' | 'in_progress' | 'completed';
    progress: number;
    tools: string[];
    deliverables: Deliverable[];
    findings: string[];
    actions: Action[];
    completedDate?: string;
}
/**
 * Digital transformation roadmap
 */
export interface DigitalTransformationRoadmap {
    id: string;
    organizationId: string;
    visionStatement: string;
    currentMaturity: DigitalMaturityAssessment;
    targetMaturity: DigitalMaturityLevel;
    transformationPillars: TransformationPillar[];
    initiatives: DigitalInitiative[];
    technologyStack: TechnologyStack;
    capabilityGaps: CapabilityGap[];
    investmentPlan: InvestmentPlan;
    changeManagementPlan: ChangeManagementPlan;
    governanceModel: GovernanceModel;
    timeline: TransformationTimeline;
    status: TransformationStatus;
    metadata: Record<string, any>;
}
/**
 * Digital maturity assessment
 */
export interface DigitalMaturityAssessment {
    overallMaturity: DigitalMaturityLevel;
    dimensions: MaturityDimension[];
    strengths: string[];
    weaknesses: string[];
    assessmentDate: string;
    recommendations: string[];
}
/**
 * Maturity dimension
 */
export interface MaturityDimension {
    dimension: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: TransformationPriority;
    initiatives: string[];
}
/**
 * Transformation pillar
 */
export interface TransformationPillar {
    id: string;
    pillarName: string;
    description: string;
    objectives: string[];
    initiatives: string[];
    owner: string;
    budget: number;
    expectedBenefits: string[];
    risks: string[];
    dependencies: string[];
}
/**
 * Digital initiative
 */
export interface DigitalInitiative {
    id: string;
    initiativeName: string;
    description: string;
    pillar: string;
    priority: TransformationPriority;
    businessValue: number;
    complexity: number;
    effort: number;
    dependencies: string[];
    startDate: string;
    endDate: string;
    status: TransformationStatus;
    outcomes: InitiativeOutcome[];
    metrics: PerformanceMetric[];
}
/**
 * Change readiness assessment
 */
export interface ChangeReadinessAssessment {
    id: string;
    organizationId: string;
    assessmentName: string;
    assessmentDate: string;
    scope: string;
    overallReadiness: ReadinessLevel;
    readinessScore: number;
    dimensions: ReadinessDimension[];
    stakeholderReadiness: StakeholderReadiness[];
    culturalReadiness: CulturalReadiness;
    technicalReadiness: TechnicalReadiness;
    financialReadiness: FinancialReadiness;
    recommendations: ReadinessRecommendation[];
    actionPlan: ReadinessAction[];
    metadata: Record<string, any>;
}
/**
 * Readiness dimension
 */
export interface ReadinessDimension {
    dimension: string;
    score: number;
    level: ReadinessLevel;
    indicators: ReadinessIndicator[];
    gaps: string[];
    actions: string[];
}
/**
 * Readiness indicator
 */
export interface ReadinessIndicator {
    indicator: string;
    currentState: string;
    desiredState: string;
    gap: string;
    impact: 'high' | 'medium' | 'low';
}
/**
 * Stakeholder readiness
 */
export interface StakeholderReadiness {
    stakeholderGroup: string;
    readinessLevel: ReadinessLevel;
    readinessScore: number;
    resistanceLevel: ResistanceLevel;
    influenceLevel: 'high' | 'medium' | 'low';
    impactLevel: 'high' | 'medium' | 'low';
    engagementStrategy: string;
    communicationPlan: CommunicationActivity[];
}
/**
 * Cultural readiness
 */
export interface CulturalReadiness {
    currentCulture: CultureProfile;
    targetCulture: CultureProfile;
    culturalGaps: CulturalGap[];
    changeChampions: number;
    changeResistance: number;
    overallAlignment: number;
}
/**
 * Culture profile
 */
export interface CultureProfile {
    values: string[];
    behaviors: string[];
    norms: string[];
    leadership: string;
    collaboration: number;
    innovation: number;
    agility: number;
}
/**
 * Technical readiness
 */
export interface TechnicalReadiness {
    infrastructureReadiness: number;
    systemsReadiness: number;
    dataReadiness: number;
    securityReadiness: number;
    integrationReadiness: number;
    gaps: TechnicalGap[];
    requiredInvestments: TechnicalInvestment[];
}
/**
 * Financial readiness
 */
export interface FinancialReadiness {
    budgetAvailable: number;
    budgetRequired: number;
    fundingGap: number;
    roiProjection: number;
    paybackPeriod: number;
    approvalStatus: 'approved' | 'pending' | 'rejected';
    fundingSources: FundingSource[];
}
/**
 * Process improvement initiative
 */
export interface ProcessImprovementInitiative {
    id: string;
    organizationId: string;
    processName: string;
    processOwner: string;
    currentState: ProcessState;
    futureState: ProcessState;
    improvementOpportunities: ImprovementOpportunity[];
    implementationPlan: ImplementationPlan;
    changeImpact: ChangeImpact;
    benefits: ProcessBenefit[];
    risks: ProcessRisk[];
    status: TransformationStatus;
    metadata: Record<string, any>;
}
/**
 * Process state
 */
export interface ProcessState {
    processMap: string;
    steps: ProcessStep[];
    inputs: string[];
    outputs: string[];
    controls: string[];
    enablers: string[];
    cycleTime: number;
    costPerExecution: number;
    defectRate: number;
    automationLevel: number;
    maturityLevel: ProcessMaturityLevel;
}
/**
 * Process step
 */
export interface ProcessStep {
    stepNumber: number;
    stepName: string;
    description: string;
    duration: number;
    costDriver: boolean;
    painPoint: boolean;
    automationCandidate: boolean;
    responsibleRole: string;
}
/**
 * Improvement opportunity
 */
export interface ImprovementOpportunity {
    id: string;
    opportunityType: 'eliminate' | 'simplify' | 'automate' | 'integrate' | 'standardize';
    description: string;
    currentProcess: string;
    proposedSolution: string;
    estimatedSavings: number;
    implementationCost: number;
    roi: number;
    effort: number;
    priority: TransformationPriority;
    dependencies: string[];
}
/**
 * Stakeholder
 */
export interface Stakeholder {
    id: string;
    name: string;
    role: string;
    department: string;
    influenceLevel: 'high' | 'medium' | 'low';
    impactLevel: 'high' | 'medium' | 'low';
    currentStance: ResistanceLevel;
    desiredStance: ResistanceLevel;
    engagementStrategy: string;
    communicationFrequency: string;
}
/**
 * Activity
 */
export interface Activity {
    id: string;
    activityName: string;
    description: string;
    owner: string;
    startDate: string;
    endDate: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    dependencies: string[];
    deliverables: string[];
    progress: number;
}
/**
 * Milestone
 */
export interface Milestone {
    id: string;
    milestoneName: string;
    description: string;
    targetDate: string;
    achieved: boolean;
    achievedDate?: string;
    criteria: string[];
}
/**
 * Transformation risk
 */
export interface TransformationRisk {
    id: string;
    riskDescription: string;
    category: 'strategic' | 'operational' | 'financial' | 'technical' | 'people';
    probability: number;
    impact: number;
    riskScore: number;
    mitigationStrategy: string;
    owner: string;
    status: 'open' | 'mitigating' | 'closed';
}
/**
 * Success metric
 */
export interface SuccessMetric {
    id: string;
    metricName: string;
    description: string;
    baseline: number;
    target: number;
    current?: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    owner: string;
    status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
}
/**
 * Change barrier
 */
export interface ChangeBarrier {
    id: string;
    barrierType: 'awareness' | 'desire' | 'knowledge' | 'ability' | 'reinforcement';
    description: string;
    affectedGroups: string[];
    severity: 'high' | 'medium' | 'low';
    rootCause: string;
    impact: string;
}
/**
 * Change intervention
 */
export interface ChangeIntervention {
    id: string;
    interventionType: 'communication' | 'training' | 'coaching' | 'incentive' | 'structural';
    targetBarriers: string[];
    targetAudience: string[];
    description: string;
    activities: Activity[];
    expectedOutcome: string;
    successCriteria: string[];
    owner: string;
    budget: number;
}
/**
 * Communication activity
 */
export interface CommunicationActivity {
    id: string;
    message: string;
    audience: string[];
    channel: string;
    frequency: string;
    owner: string;
    startDate: string;
    endDate?: string;
    effectiveness?: number;
}
/**
 * Training activity
 */
export interface TrainingActivity {
    id: string;
    trainingName: string;
    description: string;
    targetAudience: string[];
    duration: number;
    deliveryMethod: 'classroom' | 'online' | 'hybrid' | 'on-the-job';
    trainers: string[];
    schedule: string;
    capacity: number;
    enrolled: number;
    completed: number;
    assessmentRequired: boolean;
}
/**
 * Project charter
 */
export interface ProjectCharter {
    projectName: string;
    businessCase: string;
    problemStatement: string;
    goalStatement: string;
    scope: ProjectScope;
    outOfScope: string[];
    successCriteria: string[];
    sponsor: string;
    champion: string;
    approvalDate: string;
    approvedBy: string;
}
/**
 * Project scope
 */
export interface ProjectScope {
    departments: string[];
    processes: string[];
    systems: string[];
    locations: string[];
    estimatedImpactedUsers: number;
}
/**
 * Project team
 */
export interface ProjectTeam {
    projectLead: string;
    sixSigmaBelt?: SixSigmaBelt;
    teamMembers: TeamMember[];
    sponsors: string[];
    stakeholders: string[];
}
/**
 * Team member
 */
export interface TeamMember {
    name: string;
    role: string;
    belt?: SixSigmaBelt;
    allocation: number;
    skills: string[];
}
/**
 * Financial impact
 */
export interface FinancialImpact {
    hardSavings: number;
    softSavings: number;
    costAvoidance: number;
    revenueIncrease: number;
    investmentRequired: number;
    netBenefit: number;
    roi: number;
    paybackPeriod: number;
    npv: number;
}
/**
 * Deliverable
 */
export interface Deliverable {
    deliverableName: string;
    description: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
    owner: string;
}
/**
 * Action
 */
export interface Action {
    actionDescription: string;
    owner: string;
    dueDate: string;
    status: 'open' | 'in_progress' | 'completed';
    completedDate?: string;
}
export interface ReadinessAssessment {
    assessmentId: string;
    assessmentDate: string;
    overallScore: number;
    dimensionScores: Record<string, number>;
    respondents: number;
}
export interface AssessmentResult {
    metric: string;
    score: number;
    benchmark: number;
    gap: number;
}
export interface ProjectTimeline {
    startDate: string;
    plannedEndDate: string;
    actualEndDate?: string;
    phases: TimelinePhase[];
}
export interface TimelinePhase {
    phaseName: string;
    startDate: string;
    endDate: string;
    duration: number;
    dependencies: string[];
}
export interface TechnologyStack {
    platforms: TechnologyComponent[];
    applications: TechnologyComponent[];
    infrastructure: TechnologyComponent[];
    dataAndAnalytics: TechnologyComponent[];
    security: TechnologyComponent[];
}
export interface TechnologyComponent {
    name: string;
    category: string;
    vendor: string;
    status: 'current' | 'planned' | 'decommission';
    maturity: 'pilot' | 'production' | 'sunset';
    criticality: 'mission_critical' | 'important' | 'supporting';
}
export interface CapabilityGap {
    capability: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: TransformationPriority;
    closureApproach: string;
    timeline: string;
    owner: string;
}
export interface InvestmentPlan {
    totalInvestment: number;
    phasing: InvestmentPhase[];
    fundingSource: string[];
    approvalStatus: 'approved' | 'pending' | 'rejected';
    contingency: number;
}
export interface InvestmentPhase {
    phase: string;
    amount: number;
    period: string;
    categories: InvestmentCategory[];
}
export interface InvestmentCategory {
    category: 'technology' | 'people' | 'process' | 'change_management';
    amount: number;
    percentage: number;
}
export interface ChangeManagementPlan {
    approach: string;
    stakeholderStrategy: StakeholderStrategy[];
    communicationPlan: CommunicationActivity[];
    trainingPlan: TrainingActivity[];
    resistanceManagement: ResistanceStrategy[];
    reinforcementActivities: ReinforcementActivity[];
}
export interface StakeholderStrategy {
    stakeholderGroup: string;
    currentState: ResistanceLevel;
    targetState: ResistanceLevel;
    tactics: string[];
    owner: string;
}
export interface ResistanceStrategy {
    resistanceType: string;
    affectedGroups: string[];
    mitigationApproach: string;
    actions: string[];
    owner: string;
}
export interface ReinforcementActivity {
    activityType: string;
    description: string;
    frequency: string;
    startDate: string;
    owner: string;
}
export interface GovernanceModel {
    steeringCommittee: GovernanceBody;
    workingGroups: GovernanceBody[];
    decisionRights: DecisionRight[];
    escalationPath: EscalationLevel[];
    reportingCadence: string;
}
export interface GovernanceBody {
    name: string;
    purpose: string;
    members: string[];
    chair: string;
    meetingFrequency: string;
    responsibilities: string[];
}
export interface DecisionRight {
    decision: string;
    authority: string;
    escalationCriteria: string;
}
export interface EscalationLevel {
    level: number;
    authority: string;
    responseTime: string;
    criteria: string[];
}
export interface TransformationTimeline {
    phases: TransformationPhase[];
    totalDuration: number;
    startDate: string;
    targetEndDate: string;
    actualEndDate?: string;
}
export interface TransformationPhase {
    phaseName: string;
    startDate: string;
    endDate: string;
    duration: number;
    objectives: string[];
    deliverables: string[];
    milestones: Milestone[];
    status: TransformationStatus;
}
export interface InitiativeOutcome {
    outcome: string;
    metric: string;
    baseline: number;
    target: number;
    actual?: number;
    achievementDate?: string;
}
export interface PerformanceMetric {
    metricName: string;
    category: 'business' | 'operational' | 'technical' | 'user';
    unit: string;
    frequency: string;
    target: number;
    current?: number;
}
export interface ReadinessRecommendation {
    area: string;
    recommendation: string;
    priority: TransformationPriority;
    effort: string;
    expectedImpact: string;
}
export interface ReadinessAction {
    action: string;
    owner: string;
    dueDate: string;
    status: 'not_started' | 'in_progress' | 'completed';
}
export interface CulturalGap {
    dimension: string;
    currentState: string;
    desiredState: string;
    gapDescription: string;
    closureStrategy: string;
}
export interface TechnicalGap {
    area: string;
    currentCapability: string;
    requiredCapability: string;
    gap: string;
    priority: TransformationPriority;
}
export interface TechnicalInvestment {
    area: string;
    description: string;
    estimatedCost: number;
    timeline: string;
    priority: TransformationPriority;
}
export interface FundingSource {
    source: string;
    amount: number;
    availability: string;
    constraints: string[];
}
export interface ImplementationPlan {
    phases: ImplementationPhase[];
    resources: ResourceRequirement[];
    dependencies: string[];
    risks: ProcessRisk[];
    timeline: string;
}
export interface ImplementationPhase {
    phaseName: string;
    activities: Activity[];
    duration: number;
    milestones: Milestone[];
}
export interface ResourceRequirement {
    resourceType: string;
    quantity: number;
    duration: number;
    cost: number;
}
export interface ChangeImpact {
    impactedStakeholders: ImpactedStakeholder[];
    processChanges: string[];
    systemChanges: string[];
    organizationalChanges: string[];
    overallImpactLevel: 'high' | 'medium' | 'low';
    changeManagementRequired: boolean;
}
export interface ImpactedStakeholder {
    group: string;
    impactLevel: 'high' | 'medium' | 'low';
    impactDescription: string;
    mitigationStrategy: string;
}
export interface ProcessBenefit {
    benefitType: 'cost_reduction' | 'time_savings' | 'quality_improvement' | 'capacity_increase';
    description: string;
    quantification: number;
    unit: string;
    realizationDate: string;
}
export interface ProcessRisk {
    riskDescription: string;
    probability: number;
    impact: number;
    mitigationStrategy: string;
    owner: string;
}
/**
 * DTO for creating Kotter Change Model
 */
export declare class CreateKotterChangeDto {
    organizationId: string;
    transformationName: string;
    startDate: string;
    targetCompletionDate: string;
    stakeholders?: Stakeholder[];
    metadata?: Record<string, any>;
}
/**
 * DTO for creating ADKAR Change Model
 */
export declare class CreateADKARChangeDto {
    organizationId: string;
    changeName: string;
    targetAudience: string[];
    awareness: ADKARPhaseDto;
    desire: ADKARPhaseDto;
    knowledge: ADKARPhaseDto;
    ability: ADKARPhaseDto;
    reinforcement: ADKARPhaseDto;
}
/**
 * DTO for ADKAR phase
 */
export declare class ADKARPhaseDto {
    phase: ChangeStage;
    currentLevel: number;
    targetLevel: number;
    activities?: Activity[];
    completionCriteria: string[];
}
/**
 * DTO for creating Lean Six Sigma project
 */
export declare class CreateLeanSixSigmaDto {
    organizationId: string;
    projectName: string;
    projectType: 'DMAIC' | 'DMADV';
    problemStatement: string;
    goalStatement: string;
    projectCharter: ProjectCharterDto;
    team: ProjectTeamDto;
}
/**
 * DTO for project charter
 */
export declare class ProjectCharterDto {
    businessCase: string;
    sponsor: string;
    champion: string;
    successCriteria: string[];
}
/**
 * DTO for project team
 */
export declare class ProjectTeamDto {
    projectLead: string;
    sixSigmaBelt?: SixSigmaBelt;
    teamMembers: TeamMemberDto[];
}
/**
 * DTO for team member
 */
export declare class TeamMemberDto {
    name: string;
    role: string;
    allocation: number;
    skills: string[];
}
/**
 * DTO for creating digital transformation roadmap
 */
export declare class CreateDigitalTransformationDto {
    organizationId: string;
    visionStatement: string;
    targetMaturity: DigitalMaturityLevel;
    transformationPillars: TransformationPillarDto[];
    initiatives: DigitalInitiativeDto[];
}
/**
 * DTO for transformation pillar
 */
export declare class TransformationPillarDto {
    pillarName: string;
    description: string;
    objectives: string[];
    owner: string;
    budget: number;
}
/**
 * DTO for digital initiative
 */
export declare class DigitalInitiativeDto {
    initiativeName: string;
    description: string;
    pillar: string;
    priority: TransformationPriority;
    businessValue: number;
    complexity: number;
    effort: number;
    startDate: string;
    endDate: string;
}
/**
 * DTO for creating change readiness assessment
 */
export declare class CreateReadinessAssessmentDto {
    organizationId: string;
    assessmentName: string;
    assessmentDate: string;
    scope: string;
    dimensions: ReadinessDimensionDto[];
    stakeholderReadiness: StakeholderReadinessDto[];
}
/**
 * DTO for readiness dimension
 */
export declare class ReadinessDimensionDto {
    dimension: string;
    score: number;
    level: ReadinessLevel;
    gaps: string[];
    actions: string[];
}
/**
 * DTO for stakeholder readiness
 */
export declare class StakeholderReadinessDto {
    stakeholderGroup: string;
    readinessLevel: ReadinessLevel;
    readinessScore: number;
    resistanceLevel: ResistanceLevel;
    engagementStrategy: string;
}
/**
 * Kotter Change Model
 * Stores Kotter's 8-Step change management data
 */
export declare class KotterChangeModelDB extends Model {
    id: string;
    organizationId: string;
    transformationName: string;
    startDate: string;
    targetCompletionDate: string;
    step1_CreateUrgency: string;
    step2_BuildCoalition: string;
    step3_FormVision: string;
    step4_CommunicateVision: string;
    step5_EmpowerAction: string;
    step6_CreateWins: string;
    step7_BuildOnChange: string;
    step8_AnchorChange: string;
    overallProgress: number;
    status: TransformationStatus;
    stakeholders: string;
    risks: string;
    successMetrics: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof KotterChangeModelDB;
}
/**
 * ADKAR Change Model
 * Stores ADKAR change management data
 */
export declare class ADKARChangeModelDB extends Model {
    id: string;
    organizationId: string;
    changeName: string;
    targetAudience: string;
    awareness: string;
    desire: string;
    knowledge: string;
    ability: string;
    reinforcement: string;
    overallReadiness: number;
    status: TransformationStatus;
    barriers: string;
    interventions: string;
    assessments: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof ADKARChangeModelDB;
}
/**
 * Lean Six Sigma Project Model
 * Stores DMAIC/DMADV project data
 */
export declare class LeanSixSigmaProjectDB extends Model {
    id: string;
    organizationId: string;
    projectName: string;
    projectType: 'DMAIC' | 'DMADV';
    problemStatement: string;
    goalStatement: string;
    scope: string;
    define: string;
    measure: string;
    analyze: string;
    improve: string;
    control: string;
    projectCharter: string;
    team: string;
    financialImpact: string;
    timeline: string;
    status: TransformationStatus;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof LeanSixSigmaProjectDB;
}
/**
 * Change Readiness Assessment Model
 * Stores comprehensive readiness assessment data
 */
export declare class ChangeReadinessAssessmentDB extends Model {
    id: string;
    organizationId: string;
    assessmentName: string;
    assessmentDate: string;
    scope: string;
    overallReadiness: ReadinessLevel;
    readinessScore: number;
    dimensions: string;
    stakeholderReadiness: string;
    culturalReadiness: string;
    technicalReadiness: string;
    financialReadiness: string;
    recommendations: string;
    actionPlan: string;
    metadata: string;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof ChangeReadinessAssessmentDB;
}
/**
 * Function 1: Initialize Kotter's 8-Step Change Model
 *
 * Creates a comprehensive change management initiative using Kotter's proven
 * 8-step methodology for leading organizational transformation.
 *
 * @param context - Transformation context
 * @param data - Kotter change model data
 * @param transaction - Database transaction
 * @returns Created Kotter change model
 *
 * @example
 * ```typescript
 * const kotterModel = await createKotterChangeModel(
 *   context,
 *   {
 *     organizationId: 'org-123',
 *     transformationName: 'Digital Transformation 2024',
 *     startDate: '2024-01-01',
 *     targetCompletionDate: '2024-12-31',
 *   },
 *   transaction
 * );
 * ```
 */
export declare function createKotterChangeModel(context: TransformationContext, data: Partial<KotterChangeModel>, transaction?: Transaction): Promise<KotterChangeModel>;
/**
 * Function 2: Calculate Kotter overall progress
 * Computes weighted progress across all 8 steps
 */
export declare function calculateKotterProgress(model: KotterChangeModel): number;
/**
 * Function 3: Create ADKAR change model
 * Initializes ADKAR change management framework
 */
export declare function createADKARChangeModel(context: TransformationContext, data: Partial<ADKARChangeModel>, transaction?: Transaction): Promise<ADKARChangeModel>;
/**
 * Function 4: Calculate ADKAR readiness
 * Computes overall change readiness score
 */
export declare function calculateADKARReadiness(model: ADKARChangeModel): number;
/**
 * Function 5: Identify ADKAR barriers
 * Detects barriers in each ADKAR phase
 */
export declare function identifyADKARBarriers(model: ADKARChangeModel): ChangeBarrier[];
/**
 * Function 6: Create Lean Six Sigma DMAIC project
 * Initializes structured process improvement project
 */
export declare function createLeanSixSigmaProject(context: TransformationContext, data: Partial<LeanSixSigmaProject>, transaction?: Transaction): Promise<LeanSixSigmaProject>;
/**
 * Function 7: Calculate Six Sigma process capability
 * Computes Cp, Cpk for process performance
 */
export declare function calculateProcessCapability(data: number[], lowerSpecLimit: number, upperSpecLimit: number): {
    cp: number;
    cpk: number;
    sigma: number;
};
/**
 * Function 8: Calculate defects per million opportunities (DPMO)
 * Computes Six Sigma quality metric
 */
export declare function calculateDPMO(defects: number, units: number, opportunities: number): number;
/**
 * Function 9: Create digital transformation roadmap
 * Builds comprehensive digital transformation plan
 */
export declare function createDigitalTransformationRoadmap(context: TransformationContext, data: Partial<DigitalTransformationRoadmap>, transaction?: Transaction): Promise<DigitalTransformationRoadmap>;
/**
 * Function 10: Assess digital maturity
 * Evaluates current digital maturity level
 */
export declare function assessDigitalMaturity(dimensions: MaturityDimension[]): DigitalMaturityAssessment;
/**
 * Function 11: Prioritize digital initiatives
 * Ranks initiatives by value vs complexity
 */
export declare function prioritizeDigitalInitiatives(initiatives: DigitalInitiative[]): DigitalInitiative[];
/**
 * Function 12: Create change readiness assessment
 * Comprehensive organizational readiness evaluation
 */
export declare function createChangeReadinessAssessment(context: TransformationContext, data: Partial<ChangeReadinessAssessment>, transaction?: Transaction): Promise<ChangeReadinessAssessment>;
/**
 * Function 13-45: Additional transformation utility functions
 */
export declare function analyzeStakeholderResistance(stakeholders: Stakeholder[]): {
    highResistance: number;
    supportive: number;
    neutral: number;
};
export declare function generateCommunicationPlan(stakeholders: Stakeholder[], transformationPhases: TransformationPhase[]): CommunicationActivity[];
export declare function calculateTransformationROI(financial: FinancialImpact): number;
export declare function assessChangeImpact(initiative: ProcessImprovementInitiative): 'high' | 'medium' | 'low';
export declare function generateTrainingPlan(targetAudience: string[], requiredSkills: string[]): TrainingActivity[];
export declare function trackTransformationRisks(risks: TransformationRisk[]): {
    critical: number;
    high: number;
    open: number;
};
export declare function calculateChangeVelocity(completedMilestones: Milestone[], totalMilestones: number): number;
export declare function identifyQuickWins(opportunities: ImprovementOpportunity[]): ImprovementOpportunity[];
export declare function assessCulturalAlignment(current: CultureProfile, target: CultureProfile): number;
export declare function generateGovernanceReports(model: KotterChangeModel, frequency: 'weekly' | 'monthly'): {
    reportDate: string;
    progress: number;
    risksOpen: number;
    milestonesAchieved: number;
    recommendations: string[];
};
export declare function forecastTransformationTimeline(currentProgress: number, targetDate: string, velocity: number): {
    onTrack: boolean;
    estimatedCompletion: string;
    variance: number;
};
declare const _default: {
    createKotterChangeModel: typeof createKotterChangeModel;
    calculateKotterProgress: typeof calculateKotterProgress;
    createADKARChangeModel: typeof createADKARChangeModel;
    calculateADKARReadiness: typeof calculateADKARReadiness;
    identifyADKARBarriers: typeof identifyADKARBarriers;
    createLeanSixSigmaProject: typeof createLeanSixSigmaProject;
    calculateProcessCapability: typeof calculateProcessCapability;
    calculateDPMO: typeof calculateDPMO;
    createDigitalTransformationRoadmap: typeof createDigitalTransformationRoadmap;
    assessDigitalMaturity: typeof assessDigitalMaturity;
    prioritizeDigitalInitiatives: typeof prioritizeDigitalInitiatives;
    createChangeReadinessAssessment: typeof createChangeReadinessAssessment;
    analyzeStakeholderResistance: typeof analyzeStakeholderResistance;
    generateCommunicationPlan: typeof generateCommunicationPlan;
    calculateTransformationROI: typeof calculateTransformationROI;
    assessChangeImpact: typeof assessChangeImpact;
    generateTrainingPlan: typeof generateTrainingPlan;
    trackTransformationRisks: typeof trackTransformationRisks;
    calculateChangeVelocity: typeof calculateChangeVelocity;
    identifyQuickWins: typeof identifyQuickWins;
    assessCulturalAlignment: typeof assessCulturalAlignment;
    generateGovernanceReports: typeof generateGovernanceReports;
    forecastTransformationTimeline: typeof forecastTransformationTimeline;
    KotterChangeModelDB: typeof KotterChangeModelDB;
    ADKARChangeModelDB: typeof ADKARChangeModelDB;
    LeanSixSigmaProjectDB: typeof LeanSixSigmaProjectDB;
    ChangeReadinessAssessmentDB: typeof ChangeReadinessAssessmentDB;
};
export default _default;
//# sourceMappingURL=business-transformation-kit.d.ts.map