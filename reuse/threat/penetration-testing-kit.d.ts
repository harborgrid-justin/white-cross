/**
 * LOC: THREATPENTEST89012
 * File: /reuse/threat/penetration-testing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Security testing services
 *   - Vulnerability management controllers
 *   - Red team exercise modules
 *   - Security reporting services
 */
/**
 * File: /reuse/threat/penetration-testing-kit.ts
 * Locator: WC-THREAT-PENTEST-001
 * Purpose: Enterprise Penetration Testing & Red Team Operations - OWASP, PTES, NIST 800-115 compliant
 *
 * Upstream: Independent penetration testing utility module
 * Downstream: ../backend/*, Security testing controllers, Red team services, Vulnerability management, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 46+ utility functions for pen test planning, vulnerability tracking, exploitation management, remediation verification, red team exercises
 *
 * LLM Context: Enterprise-grade penetration testing framework compliant with PTES, OWASP Testing Guide, NIST 800-115.
 * Provides comprehensive pen test planning and scoping, vulnerability discovery and exploitation tracking, penetration test report generation,
 * remediation tracking and verification, red team exercise management, purple team coordination, security testing metrics and KPIs,
 * attack simulation frameworks, threat modeling integration, vulnerability scoring (CVSS), exploit database integration,
 * security testing automation, compliance validation testing, web application testing (OWASP Top 10), network penetration testing,
 * social engineering campaigns, physical security testing, wireless security assessment, and integrated security testing workflows.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
export declare enum PenTestMethodology {
    PTES = "ptes",
    OWASP = "owasp",
    NIST_800_115 = "nist-800-115",
    OSSTMM = "osstmm",
    ISSAF = "issaf",
    CUSTOM = "custom"
}
export declare enum PenTestType {
    BLACK_BOX = "black-box",
    GRAY_BOX = "gray-box",
    WHITE_BOX = "white-box",
    RED_TEAM = "red-team",
    PURPLE_TEAM = "purple-team",
    BUG_BOUNTY = "bug-bounty"
}
export declare enum PenTestScope {
    WEB_APPLICATION = "web-application",
    MOBILE_APPLICATION = "mobile-application",
    NETWORK_INFRASTRUCTURE = "network-infrastructure",
    WIRELESS = "wireless",
    SOCIAL_ENGINEERING = "social-engineering",
    PHYSICAL_SECURITY = "physical-security",
    CLOUD_INFRASTRUCTURE = "cloud-infrastructure",
    API = "api",
    IOT = "iot"
}
export declare enum PenTestPhase {
    PRE_ENGAGEMENT = "pre-engagement",
    INTELLIGENCE_GATHERING = "intelligence-gathering",
    THREAT_MODELING = "threat-modeling",
    VULNERABILITY_ANALYSIS = "vulnerability-analysis",
    EXPLOITATION = "exploitation",
    POST_EXPLOITATION = "post-exploitation",
    REPORTING = "reporting",
    REMEDIATION_VERIFICATION = "remediation-verification"
}
export declare enum VulnerabilitySeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFORMATIONAL = "informational"
}
export declare enum VulnerabilityStatus {
    DISCOVERED = "discovered",
    EXPLOITED = "exploited",
    REPORTED = "reported",
    REMEDIATION_IN_PROGRESS = "remediation-in-progress",
    REMEDIATED = "remediated",
    VERIFIED = "verified",
    ACCEPTED = "accepted",
    FALSE_POSITIVE = "false-positive"
}
export declare enum ExploitComplexity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare enum AttackVector {
    NETWORK = "network",
    ADJACENT_NETWORK = "adjacent-network",
    LOCAL = "local",
    PHYSICAL = "physical"
}
export declare enum RedTeamObjective {
    DATA_EXFILTRATION = "data-exfiltration",
    PRIVILEGE_ESCALATION = "privilege-escalation",
    LATERAL_MOVEMENT = "lateral-movement",
    PERSISTENCE = "persistence",
    CREDENTIAL_HARVESTING = "credential-harvesting",
    DENIAL_OF_SERVICE = "denial-of-service",
    INFRASTRUCTURE_COMPROMISE = "infrastructure-compromise"
}
export declare enum RemediationStatus {
    NOT_STARTED = "not-started",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
    VERIFIED = "verified",
    FAILED_VERIFICATION = "failed-verification",
    DEFERRED = "deferred"
}
export declare class CreatePenTestDto {
    name: string;
    description?: string;
    methodology: PenTestMethodology;
    type: PenTestType;
    scopes: PenTestScope[];
    startDate: Date;
    endDate: Date;
    targetUrls: string[];
    targetNetworks?: string[];
    teamMembers?: string;
    metadata?: Record<string, any>;
}
export declare class CreateVulnerabilityDto {
    title: string;
    description: string;
    severity: VulnerabilitySeverity;
    cvssScore: number;
    cvssVector?: string;
    cweId?: string;
    attackVector: AttackVector;
    exploitComplexity: ExploitComplexity;
    affectedUrl?: string;
    proofOfConcept?: Record<string, any>;
    remediation?: string;
}
export declare class CreateRedTeamExerciseDto {
    codeName: string;
    description: string;
    objectives: RedTeamObjective[];
    startDate: Date;
    endDate: Date;
    targetSystems: string[];
    blueTeamNotified?: boolean;
    metadata?: Record<string, any>;
}
export declare class CreateRemediationTaskDto {
    title: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: VulnerabilitySeverity;
    metadata?: Record<string, any>;
}
export declare class PurpleTeamActivityDto {
    activity: string;
    description: string;
    scheduledTime: Date;
    participants: string;
    metadata?: Record<string, any>;
}
export declare class PenetrationTest extends Model {
    id: string;
    name: string;
    description: string;
    methodology: PenTestMethodology;
    type: PenTestType;
    scopes: PenTestScope[];
    currentPhase: PenTestPhase;
    startDate: Date;
    endDate: Date;
    targetUrls: string[];
    targetNetworks: string[];
    teamMembers: string;
    findingsCount: number;
    criticalFindings: number;
    highFindings: number;
    mediumFindings: number;
    lowFindings: number;
    reportUrl: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
}
export declare class Vulnerability extends Model {
    id: string;
    penTestId: string;
    title: string;
    description: string;
    severity: VulnerabilitySeverity;
    cvssScore: number;
    cvssVector: string;
    cweId: string;
    attackVector: AttackVector;
    exploitComplexity: ExploitComplexity;
    affectedUrl: string;
    proofOfConcept: Record<string, any>;
    remediation: string;
    status: VulnerabilityStatus;
    discoveredAt: Date;
    reportedAt: Date;
    remediatedAt: Date;
    verifiedAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RedTeamExercise extends Model {
    id: string;
    codeName: string;
    description: string;
    objectives: RedTeamObjective[];
    startDate: Date;
    endDate: Date;
    targetSystems: string[];
    blueTeamNotified: boolean;
    objectivesAchieved: number;
    detectionRate: number;
    meanTimeToDetect: number;
    compromisedSystems: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
}
export declare class RemediationTask extends Model {
    id: string;
    vulnerabilityId: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    priority: VulnerabilitySeverity;
    status: RemediationStatus;
    completedAt: Date;
    verificationNotes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Initialize Penetration Test model
 * @param sequelize Sequelize instance
 * @returns PenetrationTest model
 */
export declare function initPenetrationTestModel(sequelize: Sequelize): typeof PenetrationTest;
/**
 * Initialize Vulnerability model
 * @param sequelize Sequelize instance
 * @returns Vulnerability model
 */
export declare function initVulnerabilityModel(sequelize: Sequelize): typeof Vulnerability;
/**
 * Initialize Red Team Exercise model
 * @param sequelize Sequelize instance
 * @returns RedTeamExercise model
 */
export declare function initRedTeamExerciseModel(sequelize: Sequelize): typeof RedTeamExercise;
/**
 * Initialize Remediation Task model
 * @param sequelize Sequelize instance
 * @returns RemediationTask model
 */
export declare function initRemediationTaskModel(sequelize: Sequelize): typeof RemediationTask;
/**
 * Create a new penetration test
 * @param data Pen test data
 * @param transaction Optional transaction
 * @returns Created penetration test
 */
export declare function createPenetrationTest(data: CreatePenTestDto, transaction?: Transaction): Promise<PenetrationTest>;
/**
 * Update penetration test phase
 * @param penTestId Penetration test ID
 * @param phase New phase
 * @param transaction Optional transaction
 * @returns Updated penetration test
 */
export declare function updatePenTestPhase(penTestId: string, phase: PenTestPhase, transaction?: Transaction): Promise<PenetrationTest>;
/**
 * Calculate penetration test scope metrics
 * @param penTest Penetration test
 * @returns Scope metrics
 */
export declare function calculateScopeMetrics(penTest: PenetrationTest): {
    targetCount: number;
    scopeCount: number;
    estimatedDuration: number;
    complexityScore: number;
};
/**
 * Generate penetration test scope document
 * @param penTest Penetration test
 * @returns Scope document
 */
export declare function generateScopeDocument(penTest: PenetrationTest): {
    overview: string;
    objectives: string[];
    inScope: string[];
    outOfScope: string[];
    assumptions: string[];
    constraints: string[];
};
/**
 * Calculate CVSS base score from components
 * @param attackVector Attack vector
 * @param attackComplexity Attack complexity
 * @param privilegesRequired Privileges required
 * @param userInteraction User interaction required
 * @param scope Scope change
 * @param confidentialityImpact Confidentiality impact
 * @param integrityImpact Integrity impact
 * @param availabilityImpact Availability impact
 * @returns CVSS base score
 */
export declare function calculateCVSSScore(params: {
    attackVector: 'N' | 'A' | 'L' | 'P';
    attackComplexity: 'L' | 'H';
    privilegesRequired: 'N' | 'L' | 'H';
    userInteraction: 'N' | 'R';
    scope: 'U' | 'C';
    confidentialityImpact: 'N' | 'L' | 'H';
    integrityImpact: 'N' | 'L' | 'H';
    availabilityImpact: 'N' | 'L' | 'H';
}): number;
/**
 * Create a new vulnerability
 * @param data Vulnerability data
 * @param transaction Optional transaction
 * @returns Created vulnerability
 */
export declare function createVulnerability(data: CreateVulnerabilityDto & {
    penTestId: string;
}, transaction?: Transaction): Promise<Vulnerability>;
/**
 * Update vulnerability status
 * @param vulnerabilityId Vulnerability ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
export declare function updateVulnerabilityStatus(vulnerabilityId: string, status: VulnerabilityStatus, transaction?: Transaction): Promise<Vulnerability>;
/**
 * Update pen test statistics based on vulnerabilities
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 */
export declare function updatePenTestStatistics(penTestId: string, transaction?: Transaction): Promise<void>;
/**
 * Track vulnerability exploitation attempt
 * @param vulnerabilityId Vulnerability ID
 * @param success Whether exploitation was successful
 * @param notes Exploitation notes
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
export declare function trackExploitationAttempt(vulnerabilityId: string, success: boolean, notes: string, transaction?: Transaction): Promise<Vulnerability>;
/**
 * Get vulnerabilities by severity
 * @param penTestId Penetration test ID
 * @param severity Severity level
 * @param transaction Optional transaction
 * @returns Vulnerabilities
 */
export declare function getVulnerabilitiesBySeverity(penTestId: string, severity: VulnerabilitySeverity, transaction?: Transaction): Promise<Vulnerability[]>;
/**
 * Generate executive summary for pen test report
 * @param penTest Penetration test
 * @param vulnerabilities Vulnerabilities found
 * @returns Executive summary
 */
export declare function generateExecutiveSummary(penTest: PenetrationTest, vulnerabilities: Vulnerability[]): {
    overview: string;
    keyFindings: string[];
    riskLevel: string;
    recommendations: string[];
    statistics: Record<string, number>;
};
/**
 * Generate detailed vulnerability report
 * @param vulnerability Vulnerability
 * @returns Detailed report
 */
export declare function generateVulnerabilityReport(vulnerability: Vulnerability): {
    title: string;
    severity: string;
    cvssScore: number;
    description: string;
    impact: string;
    remediation: string;
    references: string[];
};
/**
 * Calculate remediation timeline
 * @param vulnerabilities Vulnerabilities
 * @returns Timeline by severity
 */
export declare function calculateRemediationTimeline(vulnerabilities: Vulnerability[]): {
    critical: number;
    high: number;
    medium: number;
    low: number;
    totalDays: number;
};
/**
 * Generate OWASP Top 10 mapping
 * @param vulnerabilities Vulnerabilities
 * @returns OWASP Top 10 mapping
 */
export declare function mapToOWASPTop10(vulnerabilities: Vulnerability[]): Map<string, Vulnerability[]>;
/**
 * Create remediation task
 * @param data Remediation task data
 * @param transaction Optional transaction
 * @returns Created remediation task
 */
export declare function createRemediationTask(data: CreateRemediationTaskDto & {
    vulnerabilityId: string;
}, transaction?: Transaction): Promise<RemediationTask>;
/**
 * Update remediation task status
 * @param taskId Task ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated task
 */
export declare function updateRemediationStatus(taskId: string, status: RemediationStatus, transaction?: Transaction): Promise<RemediationTask>;
/**
 * Verify vulnerability remediation
 * @param vulnerabilityId Vulnerability ID
 * @param verificationNotes Verification notes
 * @param passed Whether verification passed
 * @param transaction Optional transaction
 * @returns Updated vulnerability and task
 */
export declare function verifyRemediation(vulnerabilityId: string, verificationNotes: string, passed: boolean, transaction?: Transaction): Promise<{
    vulnerability: Vulnerability;
    task: RemediationTask | null;
}>;
/**
 * Get overdue remediation tasks
 * @param transaction Optional transaction
 * @returns Overdue tasks
 */
export declare function getOverdueRemediationTasks(transaction?: Transaction): Promise<RemediationTask[]>;
/**
 * Calculate remediation progress
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 * @returns Remediation progress metrics
 */
export declare function calculateRemediationProgress(penTestId: string, transaction?: Transaction): Promise<{
    totalVulnerabilities: number;
    remediated: number;
    verified: number;
    inProgress: number;
    notStarted: number;
    percentComplete: number;
}>;
/**
 * Create red team exercise
 * @param data Exercise data
 * @param transaction Optional transaction
 * @returns Created exercise
 */
export declare function createRedTeamExercise(data: CreateRedTeamExerciseDto, transaction?: Transaction): Promise<RedTeamExercise>;
/**
 * Update red team objective status
 * @param exerciseId Exercise ID
 * @param objectiveIndex Objective index
 * @param achieved Whether objective was achieved
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export declare function updateRedTeamObjective(exerciseId: string, objectiveIndex: number, achieved: boolean, transaction?: Transaction): Promise<RedTeamExercise>;
/**
 * Track system compromise
 * @param exerciseId Exercise ID
 * @param systemName System name
 * @param timestamp Compromise timestamp
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export declare function trackSystemCompromise(exerciseId: string, systemName: string, timestamp: Date, transaction?: Transaction): Promise<RedTeamExercise>;
/**
 * Calculate red team metrics
 * @param exercise Red team exercise
 * @returns Metrics
 */
export declare function calculateRedTeamMetrics(exercise: RedTeamExercise): {
    objectiveSuccessRate: number;
    systemsCompromised: number;
    averageTimeToCompromise: number;
    detectionRate: number;
    effectiveness: string;
};
/**
 * Schedule purple team activity
 * @param exerciseId Red team exercise ID
 * @param activity Activity details
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export declare function schedulePurpleTeamActivity(exerciseId: string, activity: PurpleTeamActivityDto, transaction?: Transaction): Promise<RedTeamExercise>;
/**
 * Record purple team activity results
 * @param exerciseId Exercise ID
 * @param activityIndex Activity index
 * @param detected Whether attack was detected
 * @param timeToDetect Time to detect in minutes
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export declare function recordPurpleTeamResults(exerciseId: string, activityIndex: number, detected: boolean, timeToDetect: number | null, notes: string, transaction?: Transaction): Promise<RedTeamExercise>;
/**
 * Generate purple team collaboration report
 * @param exercise Red team exercise
 * @returns Collaboration report
 */
export declare function generatePurpleTeamReport(exercise: RedTeamExercise): {
    overview: string;
    activitiesCompleted: number;
    detectionRate: number;
    meanTimeToDetect: number;
    improvements: string[];
    gapsIdentified: string[];
};
/**
 * Calculate penetration test coverage metrics
 * @param penTests Penetration tests
 * @returns Coverage metrics
 */
export declare function calculatePenTestCoverage(penTests: PenetrationTest[]): {
    totalTests: number;
    scopesCovered: Set<PenTestScope>;
    averageFindingsPerTest: number;
    criticalFindingsRate: number;
    testsByType: Record<PenTestType, number>;
};
/**
 * Calculate mean time to remediate (MTTR)
 * @param vulnerabilities Vulnerabilities
 * @returns MTTR in days
 */
export declare function calculateMTTR(vulnerabilities: Vulnerability[]): number;
/**
 * Generate security testing KPIs
 * @param penTests Penetration tests
 * @param vulnerabilities All vulnerabilities
 * @returns KPIs
 */
export declare function generateSecurityTestingKPIs(penTests: PenetrationTest[], vulnerabilities: Vulnerability[]): {
    totalTests: number;
    totalVulnerabilities: number;
    criticalVulnerabilities: number;
    averageMTTR: number;
    remediationRate: number;
    testCadence: number;
    riskTrend: string;
};
/**
 * Generate vulnerability trend analysis
 * @param vulnerabilities Vulnerabilities with timestamps
 * @param periodDays Analysis period in days
 * @returns Trend analysis
 */
export declare function analyzeVulnerabilityTrends(vulnerabilities: Vulnerability[], periodDays?: number): {
    totalDiscovered: number;
    totalRemediated: number;
    averagePerDay: number;
    severityDistribution: Record<VulnerabilitySeverity, number>;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
};
export declare class PenetrationTestingService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createPenTest(data: CreatePenTestDto): Promise<PenetrationTest>;
    createVulnerability(data: CreateVulnerabilityDto & {
        penTestId: string;
    }): Promise<Vulnerability>;
    createRedTeamExercise(data: CreateRedTeamExerciseDto): Promise<RedTeamExercise>;
    generatePenTestReport(penTestId: string): Promise<{
        executiveSummary: ReturnType<typeof generateExecutiveSummary>;
        vulnerabilities: ReturnType<typeof generateVulnerabilityReport>[];
        remediationTimeline: ReturnType<typeof calculateRemediationTimeline>;
    }>;
    getSecurityMetrics(): Promise<ReturnType<typeof generateSecurityTestingKPIs>>;
}
declare const _default: {
    PenetrationTest: typeof PenetrationTest;
    Vulnerability: typeof Vulnerability;
    RedTeamExercise: typeof RedTeamExercise;
    RemediationTask: typeof RemediationTask;
    initPenetrationTestModel: typeof initPenetrationTestModel;
    initVulnerabilityModel: typeof initVulnerabilityModel;
    initRedTeamExerciseModel: typeof initRedTeamExerciseModel;
    initRemediationTaskModel: typeof initRemediationTaskModel;
    createPenetrationTest: typeof createPenetrationTest;
    updatePenTestPhase: typeof updatePenTestPhase;
    calculateScopeMetrics: typeof calculateScopeMetrics;
    generateScopeDocument: typeof generateScopeDocument;
    calculateCVSSScore: typeof calculateCVSSScore;
    createVulnerability: typeof createVulnerability;
    updateVulnerabilityStatus: typeof updateVulnerabilityStatus;
    updatePenTestStatistics: typeof updatePenTestStatistics;
    trackExploitationAttempt: typeof trackExploitationAttempt;
    getVulnerabilitiesBySeverity: typeof getVulnerabilitiesBySeverity;
    generateExecutiveSummary: typeof generateExecutiveSummary;
    generateVulnerabilityReport: typeof generateVulnerabilityReport;
    calculateRemediationTimeline: typeof calculateRemediationTimeline;
    mapToOWASPTop10: typeof mapToOWASPTop10;
    createRemediationTask: typeof createRemediationTask;
    updateRemediationStatus: typeof updateRemediationStatus;
    verifyRemediation: typeof verifyRemediation;
    getOverdueRemediationTasks: typeof getOverdueRemediationTasks;
    calculateRemediationProgress: typeof calculateRemediationProgress;
    createRedTeamExercise: typeof createRedTeamExercise;
    updateRedTeamObjective: typeof updateRedTeamObjective;
    trackSystemCompromise: typeof trackSystemCompromise;
    calculateRedTeamMetrics: typeof calculateRedTeamMetrics;
    schedulePurpleTeamActivity: typeof schedulePurpleTeamActivity;
    recordPurpleTeamResults: typeof recordPurpleTeamResults;
    generatePurpleTeamReport: typeof generatePurpleTeamReport;
    calculatePenTestCoverage: typeof calculatePenTestCoverage;
    calculateMTTR: typeof calculateMTTR;
    generateSecurityTestingKPIs: typeof generateSecurityTestingKPIs;
    analyzeVulnerabilityTrends: typeof analyzeVulnerabilityTrends;
    PenetrationTestingService: typeof PenetrationTestingService;
};
export default _default;
//# sourceMappingURL=penetration-testing-kit.d.ts.map