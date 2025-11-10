/**
 * LOC: TDETVAL001
 * File: /reuse/threat/composites/threat-detection-validation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../adversary-emulation-kit
 *   - ../penetration-testing-kit
 *   - ../threat-hunting-kit
 *   - ../threat-hunting-operations-kit
 *   - ../threat-modeling-kit
 *
 * DOWNSTREAM (imported by):
 *   - Detection validation services
 *   - Security testing frameworks
 *   - Quality assurance platforms
 *   - Purple team collaboration tools
 *   - Detection engineering services
 */
import { Sequelize, Transaction } from 'sequelize';
import { PurpleTeamExercise } from '../adversary-emulation-kit';
/**
 * Detection validation framework configuration
 */
export interface DetectionValidationFramework {
    id: string;
    name: string;
    description: string;
    validationType: 'continuous' | 'periodic' | 'on_demand' | 'purple_team';
    status: 'active' | 'paused' | 'completed';
    detectionRules: string[];
    validationTests: DetectionValidationTest[];
    attackSimulations: string[];
    qualityMetrics: QualityMetrics;
    coverageRequirements: CoverageRequirements;
    schedule?: ValidationSchedule;
    createdAt: Date;
    lastRunAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Detection validation test configuration
 */
export interface DetectionValidationTest {
    id: string;
    testName: string;
    testType: 'atomic' | 'composite' | 'scenario' | 'campaign';
    detectionRuleId: string;
    mitreId: string;
    attackTechniques: string[];
    testData: {
        simulationType: 'emulation' | 'replay' | 'synthetic';
        testPayload: any;
        expectedBehavior: string;
        successCriteria: ValidationCriteria[];
    };
    automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
    runCount: number;
    successRate: number;
    lastRunAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Validation criteria for detection tests
 */
export interface ValidationCriteria {
    metric: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'matches_regex';
    expectedValue: any;
    actualValue?: any;
    passed?: boolean;
    weight: number;
}
/**
 * Quality metrics for detection validation
 */
export interface QualityMetrics {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    truePositiveRate: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
    precision: number;
    recall: number;
    f1Score: number;
    meanTimeToDetect: number;
    detectionCoverage: number;
    ruleCoverage: number;
    lastCalculatedAt: Date;
}
/**
 * Coverage requirements configuration
 */
export interface CoverageRequirements {
    mitreCoveragePct: number;
    criticalTechniquesPct: number;
    platformCoverage: string[];
    assetCoverage: string[];
    minimumDetectionRate: number;
    maximumFalsePositiveRate: number;
}
/**
 * Validation schedule configuration
 */
export interface ValidationSchedule {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    hourOfDay?: number;
    nextRun: Date;
    enabled: boolean;
}
/**
 * Detection validation result
 */
export interface DetectionValidationResult {
    id: string;
    frameworkId: string;
    testId: string;
    executionId: string;
    status: 'passed' | 'failed' | 'inconclusive' | 'error';
    detectionRuleId: string;
    attackTechnique: string;
    detectionTriggered: boolean;
    detectionLatency: number;
    alertQuality: AlertQualityScore;
    falsePositive: boolean;
    validationCriteria: ValidationCriteria[];
    evidence: ValidationEvidence[];
    recommendations: string[];
    executedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Alert quality scoring
 */
export interface AlertQualityScore {
    accuracy: number;
    completeness: number;
    actionability: number;
    contextRichness: number;
    overallScore: number;
}
/**
 * Validation evidence
 */
export interface ValidationEvidence {
    evidenceType: 'log' | 'alert' | 'network_traffic' | 'endpoint_telemetry' | 'siem_event';
    source: string;
    timestamp: Date;
    data: Record<string, any>;
    relevanceScore: number;
}
/**
 * Detection coverage gap
 */
export interface DetectionCoverageGap {
    id: string;
    gapType: 'technique' | 'tactic' | 'platform' | 'asset' | 'attack_path';
    severity: 'critical' | 'high' | 'medium' | 'low';
    mitreId?: string;
    description: string;
    affectedAssets: string[];
    riskScore: number;
    recommendations: string[];
    status: 'open' | 'remediation_planned' | 'remediated';
    identifiedAt: Date;
}
/**
 * Continuous validation pipeline
 */
export interface ContinuousValidationPipeline {
    id: string;
    name: string;
    stages: ValidationStage[];
    triggers: PipelineTrigger[];
    status: 'running' | 'paused' | 'failed';
    metrics: PipelineMetrics;
}
/**
 * Validation pipeline stage
 */
export interface ValidationStage {
    stageName: string;
    order: number;
    tests: string[];
    parallelExecution: boolean;
    continueOnFailure: boolean;
    timeoutMinutes: number;
}
/**
 * Pipeline trigger configuration
 */
export interface PipelineTrigger {
    triggerType: 'schedule' | 'rule_update' | 'threat_intel' | 'manual';
    condition: Record<string, any>;
    enabled: boolean;
}
/**
 * Pipeline execution metrics
 */
export interface PipelineMetrics {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageDuration: number;
    lastRunStatus: string;
    lastRunAt?: Date;
}
/**
 * Create a comprehensive detection validation framework
 * Composes threat modeling, attack simulation, and validation rules
 */
export declare const createDetectionValidationFramework: (frameworkData: Partial<DetectionValidationFramework>, sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationFramework>;
/**
 * Generate validation tests from threat model
 * Maps threat scenarios to detection validation tests
 */
export declare const generateValidationTestsFromThreatModel: (threatModelId: string, detectionRules: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationTest[]>;
/**
 * Execute comprehensive detection validation test suite
 * Orchestrates attack simulation and detection validation
 */
export declare const executeDetectionValidationSuite: (frameworkId: string, tests: DetectionValidationTest[], sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationResult[]>;
/**
 * Validate detection rule coverage against MITRE ATT&CK
 * Analyzes detection coverage gaps
 */
export declare const validateDetectionCoverageAgainstMITRE: (detectionRules: string[], targetCoveragePct: number, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    coverage: number;
    gaps: DetectionCoverageGap[];
    recommendations: string[];
}>;
/**
 * Create and execute purple team validation exercise
 * Coordinates red and blue team activities for detection validation
 */
export declare const executePurpleTeamValidationExercise: (exerciseName: string, detectionRules: string[], attackScenarios: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
    exercise: PurpleTeamExercise;
    validationResults: DetectionValidationResult[];
    improvements: string[];
}>;
/**
 * Calculate detection quality metrics
 * Comprehensive quality scoring for detection rules
 */
export declare const calculateDetectionQualityMetrics: (validationResults: DetectionValidationResult[]) => QualityMetrics;
/**
 * Identify and analyze false positives
 * Reduces false positive rate through analysis
 */
export declare const analyzeFalsePositives: (validationResults: DetectionValidationResult[], detectionRuleId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    falsePositives: DetectionValidationResult[];
    patterns: string[];
    recommendations: string[];
}>;
/**
 * Identify and analyze false negatives
 * Improves detection coverage by analyzing missed detections
 */
export declare const analyzeFalseNegatives: (validationResults: DetectionValidationResult[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
    falseNegatives: DetectionValidationResult[];
    rootCauses: string[];
    recommendations: string[];
}>;
/**
 * Create continuous validation pipeline
 * Automates ongoing detection validation
 */
export declare const createContinuousValidationPipeline: (pipelineName: string, validationFramework: DetectionValidationFramework) => ContinuousValidationPipeline;
/**
 * Execute continuous validation pipeline
 * Runs automated validation workflow
 */
export declare const executeContinuousValidationPipeline: (pipeline: ContinuousValidationPipeline, frameworkId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    status: "success" | "failed" | "partial";
    stageResults: Record<string, any>;
    metrics: QualityMetrics;
    duration: number;
}>;
/**
 * Generate detection validation report
 * Comprehensive reporting for detection quality
 */
export declare const generateDetectionValidationReport: (frameworkId: string, validationResults: DetectionValidationResult[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
    summary: string;
    metrics: QualityMetrics;
    coverageAnalysis: any;
    recommendations: string[];
    detailedFindings: any[];
}>;
/**
 * Benchmark detection performance
 * Compares detection performance across time
 */
export declare const benchmarkDetectionPerformance: (currentMetrics: QualityMetrics, historicalMetrics: QualityMetrics[]) => {
    trend: "improving" | "stable" | "declining";
    improvements: string[];
    regressions: string[];
    percentageChange: Record<string, number>;
};
/**
 * Validate detection rule syntax and logic
 * Static analysis of detection rules
 */
export declare const validateDetectionRuleSyntax: (ruleDefinition: any) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
};
/**
 * Generate test cases from detection rule
 * Automatic test case generation
 */
export declare const generateTestCasesFromRule: (ruleDefinition: any, testCount?: number) => DetectionValidationTest[];
/**
 * Create detection regression test suite
 * Prevents detection quality regression
 */
export declare const createDetectionRegressionSuite: (previousResults: DetectionValidationResult[], currentRules: string[]) => DetectionValidationFramework;
/**
 * Analyze detection rule effectiveness over time
 * Tracks rule performance trends
 */
export declare const analyzeDetectionRuleEffectiveness: (ruleId: string, validationHistory: DetectionValidationResult[]) => {
    ruleId: string;
    totalExecutions: number;
    successRate: number;
    averageLatency: number;
    falsePositiveRate: number;
    trend: "improving" | "stable" | "declining";
    recommendations: string[];
};
/**
 * Compare detection rules performance
 * Benchmarks multiple rules
 */
export declare const compareDetectionRules: (validationResults: DetectionValidationResult[]) => Array<{
    ruleId: string;
    performance: number;
    ranking: number;
}>;
/**
 * Generate detection tuning recommendations
 * ML-based tuning suggestions
 */
export declare const generateDetectionTuningRecommendations: (validationResults: DetectionValidationResult[]) => Array<{
    ruleId: string;
    issue: string;
    recommendation: string;
    priority: "critical" | "high" | "medium" | "low";
    estimatedImpact: number;
}>;
/**
 * Create validation baseline
 * Establishes performance baseline
 */
export declare const createValidationBaseline: (validationResults: DetectionValidationResult[]) => {
    baselineMetrics: QualityMetrics;
    baselineDate: Date;
    ruleBaselines: Map<string, any>;
};
/**
 * Track validation SLA compliance
 * Monitors SLA adherence
 */
export declare const trackValidationSLACompliance: (validationResults: DetectionValidationResult[], slaRequirements: {
    maxLatencyMs: number;
    minDetectionRate: number;
    maxFalsePositiveRate: number;
}) => {
    compliant: boolean;
    violations: string[];
    complianceScore: number;
};
/**
 * Orchestrate automated validation workflow
 * End-to-end validation automation
 */
export declare const orchestrateAutomatedValidationWorkflow: (frameworkId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    workflowId: string;
    status: "completed" | "failed";
    stages: string[];
    results: any;
}>;
/**
 * Integrate with threat hunting operations
 * Combines validation with hunt campaigns
 */
export declare const integrateWithThreatHunting: (validationFrameworkId: string, huntCampaignId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    integrationId: string;
    validationFindings: any[];
    huntFindings: any[];
    correlatedFindings: any[];
}>;
/**
 * Generate detection maturity assessment
 * Evaluates detection program maturity
 */
export declare const generateDetectionMaturityAssessment: (validationHistory: DetectionValidationResult[]) => {
    maturityLevel: "initial" | "managed" | "defined" | "quantitatively_managed" | "optimizing";
    score: number;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
};
/**
 * Create test data generators
 * Generates synthetic test data
 */
export declare const createTestDataGenerators: (attackTechniques: string[]) => Array<{
    techniqueId: string;
    generator: () => any;
}>;
/**
 * Validate detection rule dependencies
 * Checks rule dependency chains
 */
export declare const validateDetectionRuleDependencies: (rules: Array<{
    id: string;
    dependencies: string[];
}>) => {
    valid: boolean;
    circularDependencies: string[][];
    missingDependencies: string[];
};
/**
 * Optimize validation test execution order
 * Determines optimal test sequence
 */
export declare const optimizeValidationTestExecutionOrder: (tests: DetectionValidationTest[]) => DetectionValidationTest[];
/**
 * Generate validation test coverage heatmap
 * Visualizes test coverage across dimensions
 */
export declare const generateValidationCoverageHeatmap: (validationResults: DetectionValidationResult[]) => {
    byTechnique: Map<string, number>;
    byPlatform: Map<string, number>;
    bySeverity: Map<string, number>;
    byStatus: Map<string, number>;
};
/**
 * Calculate detection ROI
 * Measures return on investment for detection validation
 */
export declare const calculateDetectionROI: (validationCosts: {
    toolingCost: number;
    laborHours: number;
    laborRate: number;
}, findingsValue: {
    criticalFindingsAvoided: number;
    costPerBreach: number;
}) => {
    totalCost: number;
    totalValue: number;
    roi: number;
    paybackPeriod: number;
};
/**
 * Create validation test templates
 * Generates reusable test templates
 */
export declare const createValidationTestTemplates: (testScenarios: string[]) => Array<{
    templateId: string;
    scenario: string;
    template: DetectionValidationTest;
}>;
/**
 * Perform validation test impact analysis
 * Analyzes impact of test changes
 */
export declare const performValidationTestImpactAnalysis: (originalTests: DetectionValidationTest[], modifiedTests: DetectionValidationTest[]) => {
    added: DetectionValidationTest[];
    removed: DetectionValidationTest[];
    modified: DetectionValidationTest[];
    impactScore: number;
};
/**
 * Generate validation test execution plan
 * Creates optimized execution plan
 */
export declare const generateValidationTestExecutionPlan: (tests: DetectionValidationTest[], constraints: {
    maxParallelTests: number;
    timeWindow: number;
    priorityOrder: string[];
}) => {
    phases: Array<{
        phaseNumber: number;
        tests: DetectionValidationTest[];
        estimatedDuration: number;
    }>;
    totalDuration: number;
};
/**
 * Track validation test reliability
 * Monitors test flakiness and reliability
 */
export declare const trackValidationTestReliability: (testHistory: Array<{
    testId: string;
    executions: Array<{
        success: boolean;
        timestamp: Date;
    }>;
}>) => Map<string, {
    testId: string;
    reliability: number;
    flakiness: number;
    consecutiveFailures: number;
    recommendation: string;
}>;
/**
 * Generate detection coverage roadmap
 * Creates strategic coverage improvement plan
 */
export declare const generateDetectionCoverageRoadmap: (currentCoverage: any, targetCoverage: number, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    currentState: number;
    targetState: number;
    gap: number;
    phases: Array<{
        phaseName: string;
        duration: number;
        objectives: string[];
        deliverables: string[];
    }>;
    estimatedCompletion: Date;
}>;
/**
 * Validate detection alert quality
 * Assesses alert actionability and quality
 */
export declare const validateDetectionAlertQuality: (alerts: Array<{
    alertId: string;
    severity: string;
    details: any;
    context: any;
}>) => Array<{
    alertId: string;
    qualityScore: AlertQualityScore;
    improvementSuggestions: string[];
}>;
/**
 * Create detection validation dashboard data
 * Generates dashboard visualization data
 */
export declare const createDetectionValidationDashboardData: (validationResults: DetectionValidationResult[], timeRange: {
    start: Date;
    end: Date;
}) => {
    summary: any;
    trends: any;
    topIssues: any[];
    recommendations: string[];
};
/**
 * Orchestrate multi-stage validation campaign
 * Runs complex multi-stage validation
 */
export declare const orchestrateMultiStageValidationCampaign: (campaignConfig: {
    stages: string[];
    objectives: string[];
    duration: number;
}, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    campaignId: string;
    status: "completed" | "in_progress" | "failed";
    stageResults: any[];
    overallMetrics: QualityMetrics;
}>;
/**
 * Generate compliance validation report
 * Creates compliance-focused validation reports
 */
export declare const generateComplianceValidationReport: (validationResults: DetectionValidationResult[], complianceFramework: "HIPAA" | "PCI-DSS" | "SOC2" | "NIST") => {
    framework: string;
    compliant: boolean;
    controlsCovered: number;
    controlsTotal: number;
    findings: any[];
    recommendations: string[];
};
/**
 * Perform detection coverage gap prioritization
 * Prioritizes gaps by risk and impact
 */
export declare const performDetectionCoverageGapPrioritization: (gaps: DetectionCoverageGap[]) => Array<DetectionCoverageGap & {
    priority: number;
    estimatedEffort: "low" | "medium" | "high";
    businessImpact: "low" | "medium" | "high" | "critical";
}>;
/**
 * Create validation test execution schedule
 * Schedules validation tests over time
 */
export declare const createValidationTestExecutionSchedule: (tests: DetectionValidationTest[], scheduleConfig: {
    startDate: Date;
    frequency: "daily" | "weekly" | "monthly";
    distributionStrategy: "even" | "priority" | "random";
}) => Array<{
    date: Date;
    tests: DetectionValidationTest[];
    estimatedDuration: number;
}>;
/**
 * Analyze detection validation trends
 * Identifies trends in validation results
 */
export declare const analyzeDetectionValidationTrends: (historicalResults: Array<{
    date: Date;
    results: DetectionValidationResult[];
}>) => {
    trends: {
        successRate: "improving" | "stable" | "declining";
        coverage: "improving" | "stable" | "declining";
        quality: "improving" | "stable" | "declining";
    };
    insights: string[];
    predictions: string[];
};
/**
 * Generate validation executive briefing
 * Creates executive summary for leadership
 */
export declare const generateValidationExecutiveBriefing: (validationResults: DetectionValidationResult[], timeframe: string) => {
    summary: string;
    keyMetrics: any;
    criticalFindings: string[];
    businessImpact: string;
    investmentRecommendations: string[];
};
declare const _default: {
    createDetectionValidationFramework: (frameworkData: Partial<DetectionValidationFramework>, sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationFramework>;
    generateValidationTestsFromThreatModel: (threatModelId: string, detectionRules: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationTest[]>;
    executeDetectionValidationSuite: (frameworkId: string, tests: DetectionValidationTest[], sequelize: Sequelize, transaction?: Transaction) => Promise<DetectionValidationResult[]>;
    validateDetectionCoverageAgainstMITRE: (detectionRules: string[], targetCoveragePct: number, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        coverage: number;
        gaps: DetectionCoverageGap[];
        recommendations: string[];
    }>;
    executePurpleTeamValidationExercise: (exerciseName: string, detectionRules: string[], attackScenarios: string[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
        exercise: PurpleTeamExercise;
        validationResults: DetectionValidationResult[];
        improvements: string[];
    }>;
    calculateDetectionQualityMetrics: (validationResults: DetectionValidationResult[]) => QualityMetrics;
    analyzeFalsePositives: (validationResults: DetectionValidationResult[], detectionRuleId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        falsePositives: DetectionValidationResult[];
        patterns: string[];
        recommendations: string[];
    }>;
    analyzeFalseNegatives: (validationResults: DetectionValidationResult[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
        falseNegatives: DetectionValidationResult[];
        rootCauses: string[];
        recommendations: string[];
    }>;
    benchmarkDetectionPerformance: (currentMetrics: QualityMetrics, historicalMetrics: QualityMetrics[]) => {
        trend: "improving" | "stable" | "declining";
        improvements: string[];
        regressions: string[];
        percentageChange: Record<string, number>;
    };
    createContinuousValidationPipeline: (pipelineName: string, validationFramework: DetectionValidationFramework) => ContinuousValidationPipeline;
    executeContinuousValidationPipeline: (pipeline: ContinuousValidationPipeline, frameworkId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        status: "success" | "failed" | "partial";
        stageResults: Record<string, any>;
        metrics: QualityMetrics;
        duration: number;
    }>;
    generateDetectionValidationReport: (frameworkId: string, validationResults: DetectionValidationResult[], sequelize: Sequelize, transaction?: Transaction) => Promise<{
        summary: string;
        metrics: QualityMetrics;
        coverageAnalysis: any;
        recommendations: string[];
        detailedFindings: any[];
    }>;
    validateDetectionRuleSyntax: (ruleDefinition: any) => {
        isValid: boolean;
        errors: string[];
        warnings: string[];
        suggestions: string[];
    };
    generateTestCasesFromRule: (ruleDefinition: any, testCount?: number) => DetectionValidationTest[];
    createDetectionRegressionSuite: (previousResults: DetectionValidationResult[], currentRules: string[]) => DetectionValidationFramework;
    analyzeDetectionRuleEffectiveness: (ruleId: string, validationHistory: DetectionValidationResult[]) => {
        ruleId: string;
        totalExecutions: number;
        successRate: number;
        averageLatency: number;
        falsePositiveRate: number;
        trend: "improving" | "stable" | "declining";
        recommendations: string[];
    };
    compareDetectionRules: (validationResults: DetectionValidationResult[]) => Array<{
        ruleId: string;
        performance: number;
        ranking: number;
    }>;
    generateDetectionTuningRecommendations: (validationResults: DetectionValidationResult[]) => Array<{
        ruleId: string;
        issue: string;
        recommendation: string;
        priority: "critical" | "high" | "medium" | "low";
        estimatedImpact: number;
    }>;
    createValidationBaseline: (validationResults: DetectionValidationResult[]) => {
        baselineMetrics: QualityMetrics;
        baselineDate: Date;
        ruleBaselines: Map<string, any>;
    };
    trackValidationSLACompliance: (validationResults: DetectionValidationResult[], slaRequirements: {
        maxLatencyMs: number;
        minDetectionRate: number;
        maxFalsePositiveRate: number;
    }) => {
        compliant: boolean;
        violations: string[];
        complianceScore: number;
    };
    orchestrateAutomatedValidationWorkflow: (frameworkId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        workflowId: string;
        status: "completed" | "failed";
        stages: string[];
        results: any;
    }>;
    integrateWithThreatHunting: (validationFrameworkId: string, huntCampaignId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        integrationId: string;
        validationFindings: any[];
        huntFindings: any[];
        correlatedFindings: any[];
    }>;
    generateDetectionMaturityAssessment: (validationHistory: DetectionValidationResult[]) => {
        maturityLevel: "initial" | "managed" | "defined" | "quantitatively_managed" | "optimizing";
        score: number;
        strengths: string[];
        weaknesses: string[];
        roadmap: string[];
    };
    createTestDataGenerators: (attackTechniques: string[]) => Array<{
        techniqueId: string;
        generator: () => any;
    }>;
    validateDetectionRuleDependencies: (rules: Array<{
        id: string;
        dependencies: string[];
    }>) => {
        valid: boolean;
        circularDependencies: string[][];
        missingDependencies: string[];
    };
    optimizeValidationTestExecutionOrder: (tests: DetectionValidationTest[]) => DetectionValidationTest[];
    generateValidationCoverageHeatmap: (validationResults: DetectionValidationResult[]) => {
        byTechnique: Map<string, number>;
        byPlatform: Map<string, number>;
        bySeverity: Map<string, number>;
        byStatus: Map<string, number>;
    };
    calculateDetectionROI: (validationCosts: {
        toolingCost: number;
        laborHours: number;
        laborRate: number;
    }, findingsValue: {
        criticalFindingsAvoided: number;
        costPerBreach: number;
    }) => {
        totalCost: number;
        totalValue: number;
        roi: number;
        paybackPeriod: number;
    };
    createValidationTestTemplates: (testScenarios: string[]) => Array<{
        templateId: string;
        scenario: string;
        template: DetectionValidationTest;
    }>;
    performValidationTestImpactAnalysis: (originalTests: DetectionValidationTest[], modifiedTests: DetectionValidationTest[]) => {
        added: DetectionValidationTest[];
        removed: DetectionValidationTest[];
        modified: DetectionValidationTest[];
        impactScore: number;
    };
    generateValidationTestExecutionPlan: (tests: DetectionValidationTest[], constraints: {
        maxParallelTests: number;
        timeWindow: number;
        priorityOrder: string[];
    }) => {
        phases: Array<{
            phaseNumber: number;
            tests: DetectionValidationTest[];
            estimatedDuration: number;
        }>;
        totalDuration: number;
    };
    trackValidationTestReliability: (testHistory: Array<{
        testId: string;
        executions: Array<{
            success: boolean;
            timestamp: Date;
        }>;
    }>) => Map<string, {
        testId: string;
        reliability: number;
        flakiness: number;
        consecutiveFailures: number;
        recommendation: string;
    }>;
    generateDetectionCoverageRoadmap: (currentCoverage: any, targetCoverage: number, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        currentState: number;
        targetState: number;
        gap: number;
        phases: Array<{
            phaseName: string;
            duration: number;
            objectives: string[];
            deliverables: string[];
        }>;
        estimatedCompletion: Date;
    }>;
    validateDetectionAlertQuality: (alerts: Array<{
        alertId: string;
        severity: string;
        details: any;
        context: any;
    }>) => Array<{
        alertId: string;
        qualityScore: AlertQualityScore;
        improvementSuggestions: string[];
    }>;
    createDetectionValidationDashboardData: (validationResults: DetectionValidationResult[], timeRange: {
        start: Date;
        end: Date;
    }) => {
        summary: any;
        trends: any;
        topIssues: any[];
        recommendations: string[];
    };
    orchestrateMultiStageValidationCampaign: (campaignConfig: {
        stages: string[];
        objectives: string[];
        duration: number;
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        campaignId: string;
        status: "completed" | "in_progress" | "failed";
        stageResults: any[];
        overallMetrics: QualityMetrics;
    }>;
    generateComplianceValidationReport: (validationResults: DetectionValidationResult[], complianceFramework: "HIPAA" | "PCI-DSS" | "SOC2" | "NIST") => {
        framework: string;
        compliant: boolean;
        controlsCovered: number;
        controlsTotal: number;
        findings: any[];
        recommendations: string[];
    };
    performDetectionCoverageGapPrioritization: (gaps: DetectionCoverageGap[]) => Array<DetectionCoverageGap & {
        priority: number;
        estimatedEffort: "low" | "medium" | "high";
        businessImpact: "low" | "medium" | "high" | "critical";
    }>;
    createValidationTestExecutionSchedule: (tests: DetectionValidationTest[], scheduleConfig: {
        startDate: Date;
        frequency: "daily" | "weekly" | "monthly";
        distributionStrategy: "even" | "priority" | "random";
    }) => Array<{
        date: Date;
        tests: DetectionValidationTest[];
        estimatedDuration: number;
    }>;
    analyzeDetectionValidationTrends: (historicalResults: Array<{
        date: Date;
        results: DetectionValidationResult[];
    }>) => {
        trends: {
            successRate: "improving" | "stable" | "declining";
            coverage: "improving" | "stable" | "declining";
            quality: "improving" | "stable" | "declining";
        };
        insights: string[];
        predictions: string[];
    };
    generateValidationExecutiveBriefing: (validationResults: DetectionValidationResult[], timeframe: string) => {
        summary: string;
        keyMetrics: any;
        criticalFindings: string[];
        businessImpact: string;
        investmentRecommendations: string[];
    };
};
export default _default;
//# sourceMappingURL=threat-detection-validation-composite.d.ts.map