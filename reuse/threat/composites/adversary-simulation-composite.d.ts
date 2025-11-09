/**
 * LOC: ADVSIM001
 * File: /reuse/threat/composites/adversary-simulation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../adversary-emulation-kit
 *   - ../penetration-testing-kit
 *   - ../threat-hunting-kit
 *   - ../threat-hunting-operations-kit
 *   - ../threat-modeling-kit
 *
 * DOWNSTREAM (imported by):
 *   - Red team operation services
 *   - Attack simulation platforms
 *   - Security testing frameworks
 *   - Adversary emulation engines
 *   - Penetration testing services
 */
import { Sequelize, Transaction } from 'sequelize';
import { PurpleTeamExercise, AttackPathSimulation, AttackChain } from '../adversary-emulation-kit';
/**
 * Red team operation campaign
 */
export interface RedTeamCampaign {
    id: string;
    name: string;
    description: string;
    campaignType: 'full_scope' | 'objective_based' | 'assumed_breach' | 'purple_team';
    objectives: OperationObjective[];
    status: 'planning' | 'approved' | 'executing' | 'completed' | 'terminated';
    redTeam: TeamComposition;
    targetEnvironment: TargetEnvironment;
    rules_of_engagement: RulesOfEngagement;
    attackChains: AttackChain[];
    stealthLevel: 'loud' | 'moderate' | 'stealth' | 'silent';
    timeline: OperationTimeline;
    findings: OperationFinding[];
    metrics: CampaignMetrics;
    createdAt: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Red team operation objective
 */
export interface OperationObjective {
    id: string;
    objectiveType: 'access' | 'persistence' | 'exfiltration' | 'impact' | 'discovery';
    description: string;
    targetAssets: string[];
    successCriteria: string[];
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'achieved' | 'failed';
    achievedAt?: Date;
    evidence: string[];
}
/**
 * Red team composition
 */
export interface TeamComposition {
    teamLead: string;
    operators: string[];
    specializations: string[];
    toolsAuthorized: string[];
    communicationChannels: string[];
}
/**
 * Target environment configuration
 */
export interface TargetEnvironment {
    scope: EnvironmentScope[];
    excludedSystems: string[];
    criticalSystems: string[];
    businessHours: BusinessHours;
    sensitiveDataLocations: string[];
    complianceRequirements: string[];
}
/**
 * Environment scope definition
 */
export interface EnvironmentScope {
    scopeType: 'network' | 'application' | 'cloud' | 'physical' | 'social';
    targets: string[];
    constraints: string[];
}
/**
 * Business hours configuration
 */
export interface BusinessHours {
    timezone: string;
    workingDays: number[];
    workingHours: {
        start: string;
        end: string;
    };
    maintenanceWindows: Array<{
        start: Date;
        end: Date;
    }>;
}
/**
 * Rules of engagement
 */
export interface RulesOfEngagement {
    authorizedActions: string[];
    prohibitedActions: string[];
    escalationProcedures: string[];
    emergencyContacts: Array<{
        role: string;
        contact: string;
    }>;
    dataHandling: DataHandlingRules;
    reportingRequirements: ReportingRequirements;
    safetyControls: SafetyControls;
}
/**
 * Data handling rules
 */
export interface DataHandlingRules {
    allowDataExfiltration: boolean;
    encryptionRequired: boolean;
    dataRetentionDays: number;
    destructionMethod: string;
    complianceLabels: string[];
}
/**
 * Reporting requirements
 */
export interface ReportingRequirements {
    dailyUpdates: boolean;
    criticalFindingNotification: 'immediate' | 'end_of_day' | 'end_of_engagement';
    finalReportDeadline: number;
    reportFormat: string[];
}
/**
 * Safety controls
 */
export interface SafetyControls {
    enableKillSwitch: boolean;
    maxSystemImpact: number;
    backupRequired: boolean;
    rollbackProcedures: string[];
    monitoringRequired: boolean;
}
/**
 * Operation timeline
 */
export interface OperationTimeline {
    startDate: Date;
    endDate: Date;
    phases: OperationPhase[];
    milestones: Milestone[];
}
/**
 * Operation phase
 */
export interface OperationPhase {
    phaseName: string;
    phaseType: 'reconnaissance' | 'initial_access' | 'execution' | 'persistence' | 'privilege_escalation' | 'defense_evasion' | 'credential_access' | 'discovery' | 'lateral_movement' | 'collection' | 'exfiltration' | 'impact';
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    activities: string[];
    findings: string[];
}
/**
 * Campaign milestone
 */
export interface Milestone {
    name: string;
    description: string;
    targetDate: Date;
    achieved: boolean;
    achievedDate?: Date;
}
/**
 * Operation finding
 */
export interface OperationFinding {
    id: string;
    findingType: 'vulnerability' | 'misconfiguration' | 'policy_violation' | 'detection_gap' | 'control_bypass';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    title: string;
    description: string;
    affectedSystems: string[];
    exploitationSteps: string[];
    businessImpact: string;
    remediationSteps: string[];
    cvssScore?: number;
    mitreMapping: string[];
    evidence: Evidence[];
    discoveredAt: Date;
    discoveredBy: string;
    status: 'new' | 'validated' | 'reported' | 'remediated';
}
/**
 * Evidence data
 */
export interface Evidence {
    evidenceType: 'screenshot' | 'log_file' | 'pcap' | 'file' | 'credential' | 'command_output';
    description: string;
    filePath?: string;
    timestamp: Date;
    hash: string;
}
/**
 * Campaign metrics
 */
export interface CampaignMetrics {
    totalObjectives: number;
    achievedObjectives: number;
    totalFindings: number;
    criticalFindings: number;
    detectionRate: number;
    daysToObjective: number;
    techniquesCovered: number;
    stealthScore: number;
}
/**
 * Attack scenario configuration
 */
export interface AttackScenario {
    id: string;
    scenarioName: string;
    scenarioType: 'ransomware' | 'data_breach' | 'insider_threat' | 'supply_chain' | 'apt' | 'ddos';
    adversaryProfile: AdversaryProfile;
    attackFlow: AttackFlow;
    expectedOutcome: string;
    detectionPoints: DetectionPoint[];
    estimatedDuration: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Adversary profile
 */
export interface AdversaryProfile {
    adversaryType: 'script_kiddie' | 'cybercriminal' | 'hacktivist' | 'insider' | 'nation_state' | 'apt';
    sophisticationLevel: 'low' | 'medium' | 'high' | 'advanced';
    motivation: string[];
    capabilities: string[];
    ttps: string[];
    toolsUsed: string[];
}
/**
 * Attack flow definition
 */
export interface AttackFlow {
    initialAccess: string;
    executionSteps: AttackStep[];
    persistence: string[];
    exfiltration: string[];
    impact: string[];
}
/**
 * Attack step
 */
export interface AttackStep {
    stepNumber: number;
    technique: string;
    mitreId: string;
    description: string;
    tools: string[];
    successIndicators: string[];
    detectionProbability: number;
    estimatedTime: number;
}
/**
 * Detection point
 */
export interface DetectionPoint {
    stepNumber: number;
    detectionMethod: string;
    detectionRule?: string;
    alertSeverity: 'critical' | 'high' | 'medium' | 'low';
    expectedDetection: boolean;
}
/**
 * Breach simulation result
 */
export interface BreachSimulationResult {
    id: string;
    scenarioId: string;
    executionId: string;
    startTime: Date;
    endTime: Date;
    status: 'success' | 'partial_success' | 'failed' | 'detected';
    objectivesAchieved: string[];
    detectionsTriggered: string[];
    stepsCompleted: number;
    totalSteps: number;
    dwell_time: number;
    evidenceCollected: Evidence[];
    findings: OperationFinding[];
    metrics: SimulationMetrics;
}
/**
 * Simulation metrics
 */
export interface SimulationMetrics {
    executionTime: number;
    stealthScore: number;
    detectionRate: number;
    successRate: number;
    complexityScore: number;
}
/**
 * Lateral movement path
 */
export interface LateralMovementPath {
    id: string;
    sourceSystem: string;
    targetSystem: string;
    pathSteps: LateralMovementStep[];
    totalHops: number;
    estimatedTime: number;
    detectionRisk: 'low' | 'medium' | 'high';
    privilegesRequired: string[];
}
/**
 * Lateral movement step
 */
export interface LateralMovementStep {
    stepNumber: number;
    fromSystem: string;
    toSystem: string;
    technique: string;
    mitreId: string;
    credentialsUsed?: string;
    toolsUsed: string[];
    detectionProbability: number;
}
/**
 * Exfiltration simulation
 */
export interface ExfiltrationSimulation {
    id: string;
    dataType: string;
    dataVolume: number;
    exfiltrationMethod: string;
    destination: string;
    encryptionUsed: boolean;
    chunking: boolean;
    chunkSize?: number;
    bandwidth: number;
    estimatedDuration: number;
    detectionProbability: number;
}
/**
 * Create comprehensive red team campaign
 * Orchestrates full red team operation planning
 */
export declare const createRedTeamCampaign: (campaignData: Partial<RedTeamCampaign>, sequelize: Sequelize, transaction?: Transaction) => Promise<RedTeamCampaign>;
/**
 * Generate attack chains from threat model
 * Creates realistic attack paths from threat analysis
 */
export declare const generateAttackChainsFromThreatModel: (threatModelId: string, campaignObjectives: OperationObjective[], sequelize: Sequelize, transaction?: Transaction) => Promise<AttackChain[]>;
/**
 * Execute red team campaign with full orchestration
 * Runs complete red team operation
 */
export declare const executeRedTeamCampaign: (campaignId: string, campaign: RedTeamCampaign, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    campaignId: string;
    status: "success" | "partial" | "failed";
    objectivesAchieved: string[];
    findings: OperationFinding[];
    metrics: CampaignMetrics;
    recommendations: string[];
}>;
/**
 * Create attack scenario from adversary profile
 * Builds realistic attack scenarios
 */
export declare const createAttackScenarioFromAdversary: (adversaryProfile: AdversaryProfile, targetObjective: string) => AttackScenario;
/**
 * Simulate breach and attack scenario
 * Full breach simulation execution
 */
export declare const simulateBreachScenario: (scenario: AttackScenario, targetEnvironment: TargetEnvironment, sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
/**
 * Simulate lateral movement across network
 * Models and tests lateral movement paths
 */
export declare const simulateLateralMovement: (sourceSystem: string, targetSystem: string, allowedSystems: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<LateralMovementPath>;
/**
 * Simulate data exfiltration
 * Tests data exfiltration techniques
 */
export declare const simulateDataExfiltration: (exfiltrationConfig: Partial<ExfiltrationSimulation>, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    simulation: ExfiltrationSimulation;
    result: {
        success: boolean;
        detected: boolean;
        transferTime: number;
        detectionEvents: string[];
    };
}>;
/**
 * Generate comprehensive red team report
 * Creates executive and technical reports
 */
export declare const generateRedTeamReport: (campaign: RedTeamCampaign, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    executiveSummary: string;
    technicalFindings: OperationFinding[];
    metrics: CampaignMetrics;
    recommendations: string[];
    mitreCoverage: any;
    timeline: any[];
}>;
/**
 * Create assumed breach scenario
 * Starts from compromised state
 */
export declare const createAssumedBreachScenario: (initialCompromise: {
    asset: string;
    accessLevel: string;
    credentials?: string[];
}, objective: string) => RedTeamCampaign;
/**
 * Simulate ransomware attack
 * Healthcare-specific ransomware simulation
 */
export declare const simulateRansomwareAttack: (targetSystems: string[], encryptionScope: "test" | "simulation" | "demonstration", sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
/**
 * Analyze campaign effectiveness
 * Measures red team campaign success
 */
export declare const analyzeCampaignEffectiveness: (campaign: RedTeamCampaign) => {
    overallScore: number;
    objectiveCompletion: number;
    stealthScore: number;
    findingQuality: number;
    detectionEvasion: number;
    recommendations: string[];
};
/**
 * Generate attack simulation metrics dashboard
 * Comprehensive metrics visualization data
 */
export declare const generateSimulationMetricsDashboard: (campaigns: RedTeamCampaign[], simulations: BreachSimulationResult[]) => {
    summary: {
        totalCampaigns: number;
        totalSimulations: number;
        avgSuccessRate: number;
        avgDetectionRate: number;
        avgStealthScore: number;
    };
    trends: {
        campaignsByType: Record<string, number>;
        findingsBySeverity: Record<string, number>;
        techniquesCovered: number;
    };
    topFindings: OperationFinding[];
    coverageGaps: string[];
};
/**
 * Coordinate multi-team exercise
 * Orchestrates complex red/blue/purple team exercises
 */
export declare const coordinateMultiTeamExercise: (exerciseName: string, redTeamCampaign: RedTeamCampaign, blueTeamObjectives: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
    exercise: PurpleTeamExercise;
    redTeamResults: any;
    blueTeamMetrics: any;
    collaborationScore: number;
    lessonsLearned: string[];
}>;
/**
 * Generate penetration test plan from threat model
 * Creates comprehensive pen test scope
 */
export declare const generatePenTestPlanFromThreatModel: (threatModelId: string, testType: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    planId: string;
    scope: any;
    methodology: string;
    phases: any[];
    timeline: any;
}>;
/**
 * Execute automated attack simulation
 * Runs automated attack sequences
 */
export declare const executeAutomatedAttackSimulation: (simulationConfig: {
    techniques: string[];
    targetSystems: string[];
    automation: boolean;
}, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    simulationId: string;
    status: "completed" | "failed";
    results: any[];
    metrics: any;
}>;
/**
 * Create custom adversary profile
 * Builds adversary TTPs and capabilities
 */
export declare const createCustomAdversaryProfile: (adversaryData: {
    name: string;
    sophistication: string;
    motivation: string[];
    targetSectors: string[];
}) => AdversaryProfile;
/**
 * Simulate insider threat scenario
 * Models malicious insider activities
 */
export declare const simulateInsiderThreatScenario: (insiderProfile: {
    accessLevel: string;
    motivation: string;
    targetData: string[];
}, sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
/**
 * Create supply chain attack simulation
 * Models supply chain compromise
 */
export declare const createSupplyChainAttackSimulation: (targetVendor: string, compromisedComponent: string) => AttackScenario;
/**
 * Simulate privilege escalation paths
 * Tests privilege escalation techniques
 */
export declare const simulatePrivilegeEscalationPaths: (startingPrivilege: string, targetPrivilege: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    paths: Array<{
        pathId: string;
        steps: any[];
        successProbability: number;
    }>;
    recommendedPath: string;
}>;
/**
 * Generate attack narrative report
 * Creates storytelling-style attack report
 */
export declare const generateAttackNarrativeReport: (campaign: RedTeamCampaign, simulationResults: BreachSimulationResult[]) => {
    narrative: string;
    timeline: any[];
    keyMoments: any[];
    lessonsLearned: string[];
};
/**
 * Calculate adversary dwell time
 * Measures time before detection
 */
export declare const calculateAdversaryDwellTime: (simulationResults: BreachSimulationResult[]) => {
    averageDwellTime: number;
    median: number;
    minDwellTime: number;
    maxDwellTime: number;
    byScenario: Map<string, number>;
};
/**
 * Simulate phishing campaign
 * Tests phishing susceptibility
 */
export declare const simulatePhishingCampaign: (campaignConfig: {
    targetUsers: number;
    phishingType: "spear" | "generic" | "whaling";
    payload: string;
}, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    campaignId: string;
    clickRate: number;
    credentialHarvestRate: number;
    reportedRate: number;
    compromisedAccounts: number;
}>;
/**
 * Create detection evasion test
 * Tests stealth and evasion techniques
 */
export declare const createDetectionEvasionTest: (evasionTechniques: string[]) => {
    testId: string;
    techniques: Array<{
        techniqueId: string;
        evasionMethod: string;
        effectivenessScore: number;
    }>;
    overallStealthScore: number;
};
/**
 * Generate adversary capability matrix
 * Maps adversary capabilities to defenses
 */
export declare const generateAdversaryCapabilityMatrix: (adversaryProfile: AdversaryProfile) => {
    capabilities: Array<{
        capability: string;
        defenses: string[];
        gapScore: number;
    }>;
    overallReadiness: number;
};
/**
 * Simulate credential dumping attack
 * Tests credential theft defenses
 */
export declare const simulateCredentialDumpingAttack: (targetSystem: string, technique: "mimikatz" | "lsass" | "sam", sequelize: Sequelize, transaction?: Transaction) => Promise<{
    attackId: string;
    credentialsObtained: number;
    detectionTriggered: boolean;
    stealthScore: number;
    recommendations: string[];
}>;
/**
 * Create objective-based testing framework
 * Focuses on specific objectives
 */
export declare const createObjectiveBasedTestingFramework: (objectives: OperationObjective[]) => {
    frameworkId: string;
    testSuites: Array<{
        objective: string;
        tests: string[];
        successCriteria: string[];
    }>;
    estimatedDuration: number;
};
/**
 * Analyze attack surface from simulations
 * Identifies exposed attack surface
 */
export declare const analyzeAttackSurfaceFromSimulations: (simulationResults: BreachSimulationResult[]) => {
    exposedAssets: string[];
    vulnerableEndpoints: string[];
    criticalPaths: string[];
    riskScore: number;
    recommendations: string[];
};
/**
 * Generate attack path visualization data
 * Creates data for attack path diagrams
 */
export declare const generateAttackPathVisualizationData: (attackPath: AttackPathSimulation, executionResult: any) => {
    nodes: Array<{
        id: string;
        type: string;
        label: string;
        status: string;
    }>;
    edges: Array<{
        from: string;
        to: string;
        technique: string;
    }>;
    metadata: any;
};
/**
 * Create tabletop exercise scenario
 * Generates discussion-based exercise
 */
export declare const createTabletopExerciseScenario: (scenarioType: "ransomware" | "data_breach" | "ddos" | "insider", participants: string[]) => {
    exerciseId: string;
    scenario: string;
    injects: string[];
    discussionPoints: string[];
    objectives: string[];
};
/**
 * Simulate command and control communication
 * Tests C2 detection capabilities
 */
export declare const simulateCommandAndControlCommunication: (c2Config: {
    protocol: "https" | "dns" | "icmp";
    domain: string;
    beaconInterval: number;
}, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    c2Id: string;
    beaconsSent: number;
    detectionsTriggered: number;
    stealthScore: number;
}>;
/**
 * Generate adversary emulation playbook
 * Creates reusable attack playbooks
 */
export declare const generateAdversaryEmulationPlaybook: (adversaryName: string, ttps: string[]) => {
    playbookId: string;
    adversary: string;
    phases: Array<{
        phaseName: string;
        techniques: string[];
        tools: string[];
        expectedOutcome: string;
    }>;
    estimatedDuration: number;
};
/**
 * Calculate campaign return on investment
 * Measures value of red team operations
 */
export declare const calculateCampaignROI: (campaign: RedTeamCampaign, costs: {
    tooling: number;
    personnel: number;
    duration: number;
}, value: {
    findingsValue: number;
    breachPrevention: number;
}) => {
    totalCost: number;
    totalValue: number;
    roi: number;
    findings: any;
};
/**
 * Create adversary simulation roadmap
 * Plans long-term simulation strategy
 */
export declare const createAdversarySimulationRoadmap: (currentCapabilities: string[], targetCapabilities: string[]) => {
    roadmapId: string;
    currentState: string[];
    targetState: string[];
    phases: Array<{
        quarter: string;
        objectives: string[];
        capabilities: string[];
    }>;
    estimatedCompletion: Date;
};
/**
 * Generate simulation findings report
 * Comprehensive findings documentation
 */
export declare const generateSimulationFindingsReport: (simulations: BreachSimulationResult[]) => {
    executiveSummary: string;
    findingsBySeverity: Map<string, OperationFinding[]>;
    topRecommendations: string[];
    remediationPriorities: any[];
    technicalDetails: any[];
};
/**
 * Simulate persistence mechanisms
 * Tests persistence technique detection
 */
export declare const simulatePersistenceMechanisms: (techniques: string[], targetSystem: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    persistenceId: string;
    successfulTechniques: string[];
    detectedTechniques: string[];
    recommendations: string[];
}>;
/**
 * Create adversary tactics timeline
 * Maps tactics to timeline
 */
export declare const createAdversaryTacticsTimeline: (campaign: RedTeamCampaign) => {
    timelineId: string;
    tactics: Array<{
        tactic: string;
        timestamp: Date;
        duration: number;
        techniques: string[];
    }>;
    totalDuration: number;
};
/**
 * Generate attack success probability
 * Calculates likelihood of attack success
 */
export declare const generateAttackSuccessProbability: (attackScenario: AttackScenario, defenses: string[]) => {
    overallProbability: number;
    stepProbabilities: Map<number, number>;
    criticalFactors: string[];
};
/**
 * Simulate defense evasion techniques
 * Tests evasion capability detection
 */
export declare const simulateDefenseEvasionTechniques: (evasionTechniques: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
    evasionId: string;
    successfulEvasions: string[];
    failedEvasions: string[];
    evasionScore: number;
}>;
/**
 * Generate campaign lessons learned
 * Extracts actionable lessons
 */
export declare const generateCampaignLessonsLearned: (campaign: RedTeamCampaign, simulationResults: BreachSimulationResult[]) => {
    lessonsId: string;
    tactical: string[];
    operational: string[];
    strategic: string[];
    improvements: string[];
};
/**
 * Create simulation execution report
 * Detailed execution documentation
 */
export declare const createSimulationExecutionReport: (simulation: BreachSimulationResult) => {
    reportId: string;
    executionSummary: string;
    timeline: any[];
    keyEvents: any[];
    technicalDetails: any;
    artifacts: any[];
};
/**
 * Validate adversary simulation compliance
 * Ensures simulations meet compliance requirements
 */
export declare const validateAdversarySimulationCompliance: (campaign: RedTeamCampaign, complianceFramework: "HIPAA" | "PCI-DSS" | "SOC2") => {
    compliant: boolean;
    violations: string[];
    recommendations: string[];
    attestation: any;
};
declare const _default: {
    createRedTeamCampaign: (campaignData: Partial<RedTeamCampaign>, sequelize: Sequelize, transaction?: Transaction) => Promise<RedTeamCampaign>;
    generateAttackChainsFromThreatModel: (threatModelId: string, campaignObjectives: OperationObjective[], sequelize: Sequelize, transaction?: Transaction) => Promise<AttackChain[]>;
    executeRedTeamCampaign: (campaignId: string, campaign: RedTeamCampaign, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        campaignId: string;
        status: "success" | "partial" | "failed";
        objectivesAchieved: string[];
        findings: OperationFinding[];
        metrics: CampaignMetrics;
        recommendations: string[];
    }>;
    generateRedTeamReport: (campaign: RedTeamCampaign, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        executiveSummary: string;
        technicalFindings: OperationFinding[];
        metrics: CampaignMetrics;
        recommendations: string[];
        mitreCoverage: any;
        timeline: any[];
    }>;
    analyzeCampaignEffectiveness: (campaign: RedTeamCampaign) => {
        overallScore: number;
        objectiveCompletion: number;
        stealthScore: number;
        findingQuality: number;
        detectionEvasion: number;
        recommendations: string[];
    };
    createAttackScenarioFromAdversary: (adversaryProfile: AdversaryProfile, targetObjective: string) => AttackScenario;
    simulateBreachScenario: (scenario: AttackScenario, targetEnvironment: TargetEnvironment, sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
    createAssumedBreachScenario: (initialCompromise: {
        asset: string;
        accessLevel: string;
        credentials?: string[];
    }, objective: string) => RedTeamCampaign;
    simulateRansomwareAttack: (targetSystems: string[], encryptionScope: "test" | "simulation" | "demonstration", sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
    simulateInsiderThreatScenario: (insiderProfile: {
        accessLevel: string;
        motivation: string;
        targetData: string[];
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<BreachSimulationResult>;
    createSupplyChainAttackSimulation: (targetVendor: string, compromisedComponent: string) => AttackScenario;
    simulateLateralMovement: (sourceSystem: string, targetSystem: string, allowedSystems: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<LateralMovementPath>;
    simulateDataExfiltration: (exfiltrationConfig: Partial<ExfiltrationSimulation>, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        simulation: ExfiltrationSimulation;
        result: {
            success: boolean;
            detected: boolean;
            transferTime: number;
            detectionEvents: string[];
        };
    }>;
    simulatePrivilegeEscalationPaths: (startingPrivilege: string, targetPrivilege: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        paths: Array<{
            pathId: string;
            steps: any[];
            successProbability: number;
        }>;
        recommendedPath: string;
    }>;
    simulatePhishingCampaign: (campaignConfig: {
        targetUsers: number;
        phishingType: "spear" | "generic" | "whaling";
        payload: string;
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        campaignId: string;
        clickRate: number;
        credentialHarvestRate: number;
        reportedRate: number;
        compromisedAccounts: number;
    }>;
    simulateCredentialDumpingAttack: (targetSystem: string, technique: "mimikatz" | "lsass" | "sam", sequelize: Sequelize, transaction?: Transaction) => Promise<{
        attackId: string;
        credentialsObtained: number;
        detectionTriggered: boolean;
        stealthScore: number;
        recommendations: string[];
    }>;
    simulateCommandAndControlCommunication: (c2Config: {
        protocol: "https" | "dns" | "icmp";
        domain: string;
        beaconInterval: number;
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        c2Id: string;
        beaconsSent: number;
        detectionsTriggered: number;
        stealthScore: number;
    }>;
    coordinateMultiTeamExercise: (exerciseName: string, redTeamCampaign: RedTeamCampaign, blueTeamObjectives: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
        exercise: PurpleTeamExercise;
        redTeamResults: any;
        blueTeamMetrics: any;
        collaborationScore: number;
        lessonsLearned: string[];
    }>;
    generateSimulationMetricsDashboard: (campaigns: RedTeamCampaign[], simulations: BreachSimulationResult[]) => {
        summary: {
            totalCampaigns: number;
            totalSimulations: number;
            avgSuccessRate: number;
            avgDetectionRate: number;
            avgStealthScore: number;
        };
        trends: {
            campaignsByType: Record<string, number>;
            findingsBySeverity: Record<string, number>;
            techniquesCovered: number;
        };
        topFindings: OperationFinding[];
        coverageGaps: string[];
    };
    generateAttackNarrativeReport: (campaign: RedTeamCampaign, simulationResults: BreachSimulationResult[]) => {
        narrative: string;
        timeline: any[];
        keyMoments: any[];
        lessonsLearned: string[];
    };
    calculateAdversaryDwellTime: (simulationResults: BreachSimulationResult[]) => {
        averageDwellTime: number;
        median: number;
        minDwellTime: number;
        maxDwellTime: number;
        byScenario: Map<string, number>;
    };
    analyzeAttackSurfaceFromSimulations: (simulationResults: BreachSimulationResult[]) => {
        exposedAssets: string[];
        vulnerableEndpoints: string[];
        criticalPaths: string[];
        riskScore: number;
        recommendations: string[];
    };
    generateAttackPathVisualizationData: (attackPath: AttackPathSimulation, executionResult: any) => {
        nodes: Array<{
            id: string;
            type: string;
            label: string;
            status: string;
        }>;
        edges: Array<{
            from: string;
            to: string;
            technique: string;
        }>;
        metadata: any;
    };
    calculateCampaignROI: (campaign: RedTeamCampaign, costs: {
        tooling: number;
        personnel: number;
        duration: number;
    }, value: {
        findingsValue: number;
        breachPrevention: number;
    }) => {
        totalCost: number;
        totalValue: number;
        roi: number;
        findings: any;
    };
    generatePenTestPlanFromThreatModel: (threatModelId: string, testType: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        planId: string;
        scope: any;
        methodology: string;
        phases: any[];
        timeline: any;
    }>;
    executeAutomatedAttackSimulation: (simulationConfig: {
        techniques: string[];
        targetSystems: string[];
        automation: boolean;
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        simulationId: string;
        status: "completed" | "failed";
        results: any[];
        metrics: any;
    }>;
    createObjectiveBasedTestingFramework: (objectives: OperationObjective[]) => {
        frameworkId: string;
        testSuites: Array<{
            objective: string;
            tests: string[];
            successCriteria: string[];
        }>;
        estimatedDuration: number;
    };
    createDetectionEvasionTest: (evasionTechniques: string[]) => {
        testId: string;
        techniques: Array<{
            techniqueId: string;
            evasionMethod: string;
            effectivenessScore: number;
        }>;
        overallStealthScore: number;
    };
    createTabletopExerciseScenario: (scenarioType: "ransomware" | "data_breach" | "ddos" | "insider", participants: string[]) => {
        exerciseId: string;
        scenario: string;
        injects: string[];
        discussionPoints: string[];
        objectives: string[];
    };
    createCustomAdversaryProfile: (adversaryData: {
        name: string;
        sophistication: string;
        motivation: string[];
        targetSectors: string[];
    }) => AdversaryProfile;
    generateAdversaryCapabilityMatrix: (adversaryProfile: AdversaryProfile) => {
        capabilities: Array<{
            capability: string;
            defenses: string[];
            gapScore: number;
        }>;
        overallReadiness: number;
    };
    generateAdversaryEmulationPlaybook: (adversaryName: string, ttps: string[]) => {
        playbookId: string;
        adversary: string;
        phases: Array<{
            phaseName: string;
            techniques: string[];
            tools: string[];
            expectedOutcome: string;
        }>;
        estimatedDuration: number;
    };
    createAdversarySimulationRoadmap: (currentCapabilities: string[], targetCapabilities: string[]) => {
        roadmapId: string;
        currentState: string[];
        targetState: string[];
        phases: Array<{
            quarter: string;
            objectives: string[];
            capabilities: string[];
        }>;
        estimatedCompletion: Date;
    };
    generateSimulationFindingsReport: (simulations: BreachSimulationResult[]) => {
        executiveSummary: string;
        findingsBySeverity: Map<string, OperationFinding[]>;
        topRecommendations: string[];
        remediationPriorities: any[];
        technicalDetails: any[];
    };
    simulatePersistenceMechanisms: (techniques: string[], targetSystem: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        persistenceId: string;
        successfulTechniques: string[];
        detectedTechniques: string[];
        recommendations: string[];
    }>;
    createAdversaryTacticsTimeline: (campaign: RedTeamCampaign) => {
        timelineId: string;
        tactics: Array<{
            tactic: string;
            timestamp: Date;
            duration: number;
            techniques: string[];
        }>;
        totalDuration: number;
    };
    generateAttackSuccessProbability: (attackScenario: AttackScenario, defenses: string[]) => {
        overallProbability: number;
        stepProbabilities: Map<number, number>;
        criticalFactors: string[];
    };
    simulateDefenseEvasionTechniques: (evasionTechniques: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
        evasionId: string;
        successfulEvasions: string[];
        failedEvasions: string[];
        evasionScore: number;
    }>;
    generateCampaignLessonsLearned: (campaign: RedTeamCampaign, simulationResults: BreachSimulationResult[]) => {
        lessonsId: string;
        tactical: string[];
        operational: string[];
        strategic: string[];
        improvements: string[];
    };
    createSimulationExecutionReport: (simulation: BreachSimulationResult) => {
        reportId: string;
        executionSummary: string;
        timeline: any[];
        keyEvents: any[];
        technicalDetails: any;
        artifacts: any[];
    };
    validateAdversarySimulationCompliance: (campaign: RedTeamCampaign, complianceFramework: "HIPAA" | "PCI-DSS" | "SOC2") => {
        compliant: boolean;
        violations: string[];
        recommendations: string[];
        attestation: any;
    };
};
export default _default;
//# sourceMappingURL=adversary-simulation-composite.d.ts.map