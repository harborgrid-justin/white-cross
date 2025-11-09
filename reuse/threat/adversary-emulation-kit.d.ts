/**
 * LOC: ADVEMUL001
 * File: /reuse/threat/adversary-emulation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Red team operation services
 *   - Purple team collaboration modules
 *   - Security testing frameworks
 *   - Attack simulation engines
 *   - Detection validation services
 *   - Threat emulation platforms
 */
/**
 * Attack simulation framework configuration
 */
export interface AttackSimulationFramework {
    id: string;
    name: string;
    description: string;
    version: string;
    frameworkType: 'mitre_attack' | 'kill_chain' | 'diamond_model' | 'custom';
    status: 'active' | 'paused' | 'completed' | 'archived';
    scope: {
        targetSystems: string[];
        targetNetworks: string[];
        excludedSystems: string[];
        timeWindows: Array<{
            dayOfWeek: number;
            startTime: string;
            endTime: string;
        }>;
        maxConcurrentAttacks: number;
    };
    safetyControls: {
        enabled: boolean;
        breakOnDetection: boolean;
        maxSystemImpact: number;
        emergencyStopEnabled: boolean;
        rollbackOnFailure: boolean;
    };
    techniques: string[];
    attackChains: AttackChain[];
    createdBy: string;
    createdAt: Date;
    lastRunAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * MITRE ATT&CK technique emulation
 */
export interface MITRETechniqueEmulation {
    id: string;
    techniqueId: string;
    techniqueName: string;
    tactic: string;
    subtechnique?: string;
    platform: 'windows' | 'linux' | 'macos' | 'cloud' | 'network' | 'containers';
    emulationScript: {
        language: 'powershell' | 'bash' | 'python' | 'atomic' | 'caldera';
        scriptPath: string;
        scriptHash: string;
        parameters: Record<string, any>;
        prerequisites: string[];
        cleanup: string;
    };
    detectionSignatures: Array<{
        signatureType: 'sigma' | 'yara' | 'snort' | 'suricata' | 'custom';
        signature: string;
        expectedDetection: boolean;
    }>;
    validationCriteria: {
        successIndicators: string[];
        failureIndicators: string[];
        timeout: number;
        retryAttempts: number;
    };
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impact: {
        confidentiality: 'none' | 'low' | 'medium' | 'high';
        integrity: 'none' | 'low' | 'medium' | 'high';
        availability: 'none' | 'low' | 'medium' | 'high';
    };
    metadata?: Record<string, any>;
}
/**
 * Purple team exercise configuration
 */
export interface PurpleTeamExercise {
    id: string;
    name: string;
    description: string;
    objectives: string[];
    status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
    teams: {
        redTeam: {
            members: string[];
            lead: string;
            objectives: string[];
        };
        blueTeam: {
            members: string[];
            lead: string;
            defensiveTasks: string[];
        };
    };
    schedule: {
        startDate: Date;
        endDate: Date;
        phases: Array<{
            phaseName: string;
            duration: number;
            activities: string[];
            deliverables: string[];
        }>;
    };
    attackScenarios: string[];
    detectionGoals: Array<{
        techniqueId: string;
        currentDetectionRate: number;
        targetDetectionRate: number;
        improvementActions: string[];
    }>;
    collaboration: {
        communicationChannels: string[];
        sharedDocuments: string[];
        realTimeMonitoring: boolean;
        feedbackLoops: Array<{
            frequency: string;
            participants: string[];
            topics: string[];
        }>;
    };
    results?: PurpleTeamResults;
    lessonsLearned: string[];
    metadata?: Record<string, any>;
}
/**
 * Purple team exercise results
 */
export interface PurpleTeamResults {
    executionId: string;
    completionDate: Date;
    attacksExecuted: number;
    attacksDetected: number;
    detectionRate: number;
    meanTimeToDetect: number;
    meanTimeToRespond: number;
    controlsValidated: number;
    controlsImproved: number;
    gapsIdentified: Array<{
        category: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        description: string;
        recommendation: string;
    }>;
    detectionImprovements: Array<{
        techniqueId: string;
        beforeRate: number;
        afterRate: number;
        improvementPercent: number;
    }>;
    metrics: Record<string, number>;
}
/**
 * Attack chain definition
 */
export interface AttackChain {
    id: string;
    name: string;
    description: string;
    killChainPhases: Array<{
        phase: 'reconnaissance' | 'weaponization' | 'delivery' | 'exploitation' | 'installation' | 'command_control' | 'actions_on_objectives';
        techniques: string[];
        order: number;
        dependencies?: string[];
    }>;
    executionMode: 'sequential' | 'parallel' | 'conditional';
    conditionalLogic?: Record<string, any>;
    successCriteria: {
        minimumSuccessRate: number;
        criticalTechniques: string[];
        earlyStopOnFailure: boolean;
    };
    estimatedDuration: number;
    metadata?: Record<string, any>;
}
/**
 * Attack path simulation
 */
export interface AttackPathSimulation {
    id: string;
    campaignId: string;
    pathName: string;
    initialCompromise: {
        vector: string;
        targetAsset: string;
        techniqueId: string;
    };
    lateralMovement: Array<{
        sourceAsset: string;
        targetAsset: string;
        techniqueId: string;
        credentials?: string;
        exploitUsed?: string;
    }>;
    privilegeEscalation: Array<{
        asset: string;
        fromPrivilege: string;
        toPrivilege: string;
        techniqueId: string;
    }>;
    dataExfiltration?: {
        targetData: string;
        exfiltrationMethod: string;
        volume: number;
        detected: boolean;
    };
    timeline: Array<{
        timestamp: Date;
        event: string;
        asset: string;
        techniqueId: string;
        detected: boolean;
        responded: boolean;
    }>;
    graphRepresentation: {
        nodes: Array<{
            id: string;
            type: 'asset' | 'technique' | 'data';
            properties: Record<string, any>;
        }>;
        edges: Array<{
            source: string;
            target: string;
            type: string;
            properties: Record<string, any>;
        }>;
    };
    metadata?: Record<string, any>;
}
/**
 * Detection rule validation
 */
export interface DetectionRuleValidation {
    id: string;
    ruleId: string;
    ruleName: string;
    ruleType: 'sigma' | 'yara' | 'snort' | 'suricata' | 'siem_query' | 'custom';
    ruleContent: string;
    validationStatus: 'pending' | 'in_progress' | 'passed' | 'failed' | 'needs_tuning';
    techniquesCovered: string[];
    testCases: Array<{
        testId: string;
        testName: string;
        techniqueId: string;
        expectedOutcome: 'detect' | 'no_detect';
        actualOutcome?: 'detect' | 'no_detect';
        truePositive?: boolean;
        falsePositive?: boolean;
        falseNegative?: boolean;
        executionTime?: Date;
    }>;
    metrics: {
        totalTests: number;
        passed: number;
        failed: number;
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
    };
    falsePositiveAnalysis: Array<{
        scenario: string;
        frequency: number;
        recommendation: string;
    }>;
    tuningRecommendations: string[];
    validatedBy: string;
    validatedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Security control testing
 */
export interface SecurityControlTest {
    id: string;
    controlId: string;
    controlName: string;
    controlType: 'preventive' | 'detective' | 'corrective' | 'deterrent' | 'compensating';
    controlFramework: 'nist' | 'cis' | 'iso27001' | 'hipaa' | 'custom';
    testObjective: string;
    testScenarios: Array<{
        scenarioId: string;
        name: string;
        attackTechnique: string;
        expectedBehavior: string;
        actualBehavior?: string;
        controlEffectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_tested';
        bypassAttempts?: Array<{
            method: string;
            successful: boolean;
            notes: string;
        }>;
    }>;
    coverage: {
        techniquesAddressed: string[];
        threatActorsCovered: string[];
        attackVectorsCovered: string[];
    };
    results: {
        overallEffectiveness: number;
        gapsIdentified: string[];
        strengthsIdentified: string[];
        improvementRecommendations: string[];
    };
    compliance: {
        requirementsMet: string[];
        requirementsNotMet: string[];
        evidenceCollected: string[];
    };
    testedBy: string;
    testedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Emulation campaign
 */
export interface EmulationCampaign {
    id: string;
    name: string;
    description: string;
    campaignType: 'continuous' | 'scheduled' | 'on_demand';
    status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
    schedule?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
        startDate: Date;
        endDate?: Date;
        executionWindows: Array<{
            dayOfWeek: number;
            startTime: string;
            endTime: string;
        }>;
    };
    objectives: string[];
    scope: {
        environments: string[];
        systems: string[];
        excludedSystems: string[];
    };
    simulations: string[];
    attackChains: string[];
    detectionValidations: string[];
    controlTests: string[];
    automation: {
        enabled: boolean;
        orchestrationPlatform?: string;
        continuousValidation: boolean;
        autoRemediation: boolean;
    };
    notifications: {
        startNotification: boolean;
        progressUpdates: boolean;
        completionNotification: boolean;
        recipients: string[];
    };
    executionHistory: Array<{
        executionId: string;
        startedAt: Date;
        completedAt?: Date;
        status: 'success' | 'partial' | 'failed';
        results: EmulationResults;
    }>;
    createdBy: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Emulation execution results
 */
export interface EmulationResults {
    executionId: string;
    campaignId: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    techniquesExecuted: number;
    techniquesSuccessful: number;
    techniquesDetected: number;
    detectionRate: number;
    controlsValidated: number;
    controlsPassed: number;
    controlsFailed: number;
    attackPathsSimulated: number;
    attackPathsBlocked: number;
    findings: Array<{
        findingId: string;
        severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
        category: string;
        title: string;
        description: string;
        affectedAssets: string[];
        recommendation: string;
        mitreMapping: string[];
    }>;
    performanceMetrics: {
        meanTimeToDetect: number;
        meanTimeToRespond: number;
        falsePositiveRate: number;
        falseNegativeRate: number;
        detectionAccuracy: number;
    };
    summary: string;
    metadata?: Record<string, any>;
}
/**
 * Emulation report configuration
 */
export interface EmulationReport {
    id: string;
    reportType: 'executive' | 'technical' | 'compliance' | 'purple_team' | 'custom';
    campaignId: string;
    executionId?: string;
    generatedAt: Date;
    timeRange: {
        startDate: Date;
        endDate: Date;
    };
    sections: Array<{
        sectionId: string;
        title: string;
        content: string;
        visualizations?: Array<{
            type: 'chart' | 'graph' | 'heatmap' | 'timeline';
            data: any;
        }>;
    }>;
    executiveSummary: string;
    keyFindings: string[];
    recommendations: Array<{
        priority: 'critical' | 'high' | 'medium' | 'low';
        recommendation: string;
        rationale: string;
        estimatedEffort: string;
        expectedImpact: string;
    }>;
    attackCoverage: {
        totalTechniques: number;
        techniquesValidated: number;
        coveragePercentage: number;
        gapsByTactic: Record<string, string[]>;
    };
    detectionMaturity: {
        currentLevel: number;
        targetLevel: number;
        improvementActions: string[];
    };
    complianceMapping?: {
        framework: string;
        controlsTested: number;
        controlsPassed: number;
        complianceScore: number;
    };
    appendices: Array<{
        title: string;
        content: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Microservices message patterns
 */
export interface EmulationMessage {
    messageId: string;
    messageType: 'emulation_start' | 'emulation_complete' | 'technique_executed' | 'detection_triggered' | 'control_validated';
    timestamp: Date;
    correlationId: string;
    payload: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Event-driven emulation event
 */
export interface EmulationEvent {
    eventId: string;
    eventType: string;
    campaignId: string;
    executionId?: string;
    timestamp: Date;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    data: Record<string, any>;
    source: string;
    correlatedEvents?: string[];
}
export declare const AttackSimulationFrameworkModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        version: {
            type: string;
            allowNull: boolean;
        };
        frameworkType: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            defaultValue: string;
        };
        scope: {
            type: string;
            allowNull: boolean;
        };
        safetyControls: {
            type: string;
            allowNull: boolean;
        };
        techniques: {
            type: string;
            allowNull: boolean;
        };
        attackChains: {
            type: string;
            allowNull: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
        };
        lastRunAt: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const MITRETechniqueEmulationModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        techniqueId: {
            type: string;
            allowNull: boolean;
        };
        techniqueName: {
            type: string;
            allowNull: boolean;
        };
        tactic: {
            type: string;
            allowNull: boolean;
        };
        subtechnique: {
            type: string;
            allowNull: boolean;
        };
        platform: {
            type: string;
            allowNull: boolean;
        };
        emulationScript: {
            type: string;
            allowNull: boolean;
        };
        detectionSignatures: {
            type: string;
            allowNull: boolean;
        };
        validationCriteria: {
            type: string;
            allowNull: boolean;
        };
        riskLevel: {
            type: string;
            allowNull: boolean;
        };
        impact: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
export declare const PurpleTeamExerciseModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        objectives: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            defaultValue: string;
        };
        teams: {
            type: string;
            allowNull: boolean;
        };
        schedule: {
            type: string;
            allowNull: boolean;
        };
        attackScenarios: {
            type: string;
            allowNull: boolean;
        };
        detectionGoals: {
            type: string;
            allowNull: boolean;
        };
        collaboration: {
            type: string;
            allowNull: boolean;
        };
        results: {
            type: string;
            allowNull: boolean;
        };
        lessonsLearned: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const DetectionRuleValidationModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        ruleId: {
            type: string;
            allowNull: boolean;
        };
        ruleName: {
            type: string;
            allowNull: boolean;
        };
        ruleType: {
            type: string;
            allowNull: boolean;
        };
        ruleContent: {
            type: string;
            allowNull: boolean;
        };
        validationStatus: {
            type: string;
            defaultValue: string;
        };
        techniquesCovered: {
            type: string;
            allowNull: boolean;
        };
        testCases: {
            type: string;
            allowNull: boolean;
        };
        metrics: {
            type: string;
            allowNull: boolean;
        };
        falsePositiveAnalysis: {
            type: string;
            allowNull: boolean;
        };
        tuningRecommendations: {
            type: string;
            allowNull: boolean;
        };
        validatedBy: {
            type: string;
            allowNull: boolean;
        };
        validatedAt: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const EmulationCampaignModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        campaignType: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            defaultValue: string;
        };
        schedule: {
            type: string;
            allowNull: boolean;
        };
        objectives: {
            type: string;
            allowNull: boolean;
        };
        scope: {
            type: string;
            allowNull: boolean;
        };
        simulations: {
            type: string;
            allowNull: boolean;
        };
        attackChains: {
            type: string;
            allowNull: boolean;
        };
        detectionValidations: {
            type: string;
            allowNull: boolean;
        };
        controlTests: {
            type: string;
            allowNull: boolean;
        };
        automation: {
            type: string;
            allowNull: boolean;
        };
        notifications: {
            type: string;
            allowNull: boolean;
        };
        executionHistory: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        createdBy: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Creates a new attack simulation framework
 * @param config - Framework configuration
 * @returns Created framework
 */
export declare function createAttackSimulationFramework(config: Partial<AttackSimulationFramework>): AttackSimulationFramework;
/**
 * Validates framework configuration for safety
 * @param framework - Framework to validate
 * @returns Validation result
 */
export declare function validateFrameworkSafety(framework: AttackSimulationFramework): {
    valid: boolean;
    warnings: string[];
    errors: string[];
};
/**
 * Schedules framework execution
 * @param frameworkId - Framework ID
 * @param schedule - Execution schedule
 * @returns Scheduled execution
 */
export declare function scheduleFrameworkExecution(frameworkId: string, schedule: {
    startTime: Date;
    endTime?: Date;
    recurrence?: string;
}): {
    executionId: string;
    scheduledAt: Date;
    status: string;
};
/**
 * Executes attack simulation framework
 * @param framework - Framework to execute
 * @param options - Execution options
 * @returns Execution results
 */
export declare function executeAttackSimulationFramework(framework: AttackSimulationFramework, options?: {
    dryRun?: boolean;
    parallelExecution?: boolean;
    notifyOnCompletion?: boolean;
}): Promise<EmulationResults>;
/**
 * Creates MITRE ATT&CK technique emulation
 * @param config - Emulation configuration
 * @returns Created emulation
 */
export declare function createMITRETechniqueEmulation(config: Partial<MITRETechniqueEmulation>): MITRETechniqueEmulation;
/**
 * Maps MITRE ATT&CK technique to healthcare threats
 * @param techniqueId - MITRE technique ID
 * @returns Healthcare-specific threat mapping
 */
export declare function mapTechniqueToHealthcareThreats(techniqueId: string): {
    healthcareRelevance: string;
    targetedAssets: string[];
    hipaaImpact: string[];
    realWorldExamples: string[];
};
/**
 * Generates atomic test for MITRE technique
 * @param technique - Technique emulation
 * @returns Atomic test definition
 */
export declare function generateAtomicTest(technique: MITRETechniqueEmulation): {
    testId: string;
    testName: string;
    description: string;
    commands: string[];
    cleanup: string[];
    prerequisites: string[];
};
/**
 * Executes MITRE technique emulation
 * @param emulation - Technique emulation
 * @param target - Target system
 * @returns Execution result
 */
export declare function executeMITRETechniqueEmulation(emulation: MITRETechniqueEmulation, target: {
    systemId: string;
    platform: string;
    credentials?: Record<string, string>;
}): Promise<{
    executionId: string;
    techniqueId: string;
    success: boolean;
    detected: boolean;
    executionTime: number;
    artifacts: string[];
    detectionEvents: Array<{
        timestamp: Date;
        detector: string;
        confidence: number;
    }>;
}>;
/**
 * Validates technique detection coverage
 * @param techniqueId - MITRE technique ID
 * @param detectors - Available detection systems
 * @returns Coverage analysis
 */
export declare function validateTechniqueDetectionCoverage(techniqueId: string, detectors: Array<{
    name: string;
    type: string;
    capabilities: string[];
}>): {
    covered: boolean;
    coveragePercentage: number;
    detectorsCapable: string[];
    gaps: string[];
};
/**
 * Creates purple team exercise
 * @param config - Exercise configuration
 * @returns Created exercise
 */
export declare function createPurpleTeamExercise(config: Partial<PurpleTeamExercise>): PurpleTeamExercise;
/**
 * Coordinates red and blue team activities
 * @param exerciseId - Exercise ID
 * @param phase - Current phase
 * @returns Coordination plan
 */
export declare function coordinateTeamActivities(exerciseId: string, phase: string): {
    redTeamTasks: Array<{
        task: string;
        timing: string;
        expectedDetection: boolean;
    }>;
    blueTeamTasks: Array<{
        task: string;
        timing: string;
        monitoringFocus: string;
    }>;
    synchronizationPoints: Array<{
        time: string;
        activity: string;
    }>;
};
/**
 * Tracks purple team exercise progress
 * @param exerciseId - Exercise ID
 * @returns Progress metrics
 */
export declare function trackPurpleTeamProgress(exerciseId: string): {
    overallProgress: number;
    phasesCompleted: number;
    totalPhases: number;
    attacksExecuted: number;
    detectionsValidated: number;
    improvementsMade: number;
    currentPhase: string;
};
/**
 * Generates purple team collaboration report
 * @param exercise - Purple team exercise
 * @returns Collaboration report
 */
export declare function generatePurpleTeamReport(exercise: PurpleTeamExercise): {
    exerciseSummary: string;
    teamPerformance: Record<string, any>;
    detectionImprovements: Array<{
        before: number;
        after: number;
        improvement: number;
    }>;
    recommendedActions: string[];
};
/**
 * Facilitates real-time purple team communication
 * @param exerciseId - Exercise ID
 * @param message - Communication message
 * @returns Message delivery status
 */
export declare function facilitatePurpleTeamCommunication(exerciseId: string, message: {
    from: string;
    to: string[];
    content: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}): {
    messageId: string;
    delivered: boolean;
    timestamp: Date;
};
/**
 * Creates attack path simulation
 * @param config - Path configuration
 * @returns Created simulation
 */
export declare function createAttackPathSimulation(config: Partial<AttackPathSimulation>): AttackPathSimulation;
/**
 * Simulates multi-stage attack path
 * @param path - Attack path definition
 * @returns Simulation results
 */
export declare function simulateAttackPath(path: AttackPathSimulation): Promise<{
    pathId: string;
    stagesCompleted: number;
    totalStages: number;
    detectedAt?: string;
    blockedAt?: string;
    timeline: Array<{
        stage: string;
        timestamp: Date;
        success: boolean;
        detected: boolean;
    }>;
}>;
/**
 * Analyzes attack path effectiveness
 * @param path - Attack path
 * @param results - Simulation results
 * @returns Effectiveness analysis
 */
export declare function analyzeAttackPathEffectiveness(path: AttackPathSimulation, results: any): {
    effectiveness: number;
    bottlenecks: string[];
    evasionSuccess: number;
    recommendations: string[];
};
/**
 * Generates attack graph visualization
 * @param path - Attack path
 * @returns Graph data for visualization
 */
export declare function generateAttackGraph(path: AttackPathSimulation): {
    nodes: Array<{
        id: string;
        label: string;
        type: string;
        compromised: boolean;
    }>;
    edges: Array<{
        from: string;
        to: string;
        technique: string;
        detected: boolean;
    }>;
};
/**
 * Creates detection rule validation
 * @param config - Validation configuration
 * @returns Created validation
 */
export declare function createDetectionRuleValidation(config: Partial<DetectionRuleValidation>): DetectionRuleValidation;
/**
 * Validates detection rule against emulated attacks
 * @param rule - Detection rule
 * @param testCases - Test attack scenarios
 * @returns Validation results
 */
export declare function validateDetectionRule(rule: DetectionRuleValidation, testCases: Array<{
    techniqueId: string;
    shouldDetect: boolean;
}>): Promise<{
    totalTests: number;
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
}>;
/**
 * Tunes detection rule based on validation results
 * @param rule - Detection rule
 * @param validationResults - Validation metrics
 * @returns Tuning recommendations
 */
export declare function tuneDetectionRule(rule: DetectionRuleValidation, validationResults: any): {
    recommendations: string[];
    suggestedThresholds: Record<string, number>;
    excludePatterns: string[];
};
/**
 * Analyzes false positives for detection rule
 * @param ruleId - Rule ID
 * @param period - Analysis period
 * @returns False positive analysis
 */
export declare function analyzeFalsePositives(ruleId: string, period: {
    start: Date;
    end: Date;
}): {
    totalFalsePositives: number;
    commonPatterns: Array<{
        pattern: string;
        frequency: number;
        examples: string[];
    }>;
    rootCauses: string[];
    mitigationSteps: string[];
};
/**
 * Creates security control test
 * @param config - Test configuration
 * @returns Created test
 */
export declare function createSecurityControlTest(config: Partial<SecurityControlTest>): SecurityControlTest;
/**
 * Tests security control effectiveness
 * @param control - Control test definition
 * @param attacks - Attack scenarios to test against
 * @returns Test results
 */
export declare function testSecurityControl(control: SecurityControlTest, attacks: Array<{
    techniqueId: string;
    severity: string;
}>): Promise<{
    controlEffectiveness: number;
    scenarioResults: Array<{
        scenario: string;
        blocked: boolean;
        detected: boolean;
        responseTime?: number;
    }>;
    gaps: string[];
    strengths: string[];
}>;
/**
 * Validates HIPAA compliance through control testing
 * @param controlTests - Array of control tests
 * @returns HIPAA compliance validation
 */
export declare function validateHIPAACompliance(controlTests: SecurityControlTest[]): {
    compliant: boolean;
    requirementsCovered: string[];
    requirementsMissing: string[];
    evidenceGaps: string[];
    complianceScore: number;
};
/**
 * Generates control bypass scenarios
 * @param control - Security control
 * @returns Bypass test scenarios
 */
export declare function generateControlBypassScenarios(control: SecurityControlTest): Array<{
    scenarioId: string;
    bypassMethod: string;
    techniqueUsed: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prerequisites: string[];
}>;
/**
 * Creates emulation campaign
 * @param config - Campaign configuration
 * @returns Created campaign
 */
export declare function createEmulationCampaign(config: Partial<EmulationCampaign>): EmulationCampaign;
/**
 * Executes emulation campaign
 * @param campaign - Campaign to execute
 * @returns Execution results
 */
export declare function executeEmulationCampaign(campaign: EmulationCampaign): Promise<EmulationResults>;
/**
 * Monitors campaign execution in real-time
 * @param executionId - Execution ID
 * @returns Current execution status
 */
export declare function monitorCampaignExecution(executionId: string): {
    status: string;
    progress: number;
    currentPhase: string;
    techniquesCompleted: number;
    techniquesRemaining: number;
    estimatedCompletion: Date;
    recentEvents: Array<{
        timestamp: Date;
        event: string;
        severity: string;
    }>;
};
/**
 * Pauses or resumes campaign execution
 * @param executionId - Execution ID
 * @param action - Pause or resume
 * @returns Action result
 */
export declare function controlCampaignExecution(executionId: string, action: 'pause' | 'resume' | 'cancel'): {
    success: boolean;
    newStatus: string;
    message: string;
};
/**
 * Generates comprehensive emulation report
 * @param results - Emulation results
 * @param reportType - Type of report
 * @returns Generated report
 */
export declare function generateEmulationReport(results: EmulationResults, reportType?: 'executive' | 'technical' | 'compliance'): EmulationReport;
/**
 * Generates MITRE ATT&CK coverage heatmap
 * @param results - Emulation results
 * @returns Heatmap data
 */
export declare function generateMITRECoverageHeatmap(results: EmulationResults): {
    tactics: string[];
    techniques: Array<{
        id: string;
        tactic: string;
        tested: boolean;
        detected: boolean;
        effectiveness: number;
    }>;
    coverageByTactic: Record<string, number>;
};
/**
 * Exports emulation results to multiple formats
 * @param results - Emulation results
 * @param format - Export format
 * @returns Exported data
 */
export declare function exportEmulationResults(results: EmulationResults, format: 'json' | 'csv' | 'pdf' | 'stix'): {
    format: string;
    data: string;
    filename: string;
};
/**
 * Compares multiple campaign executions
 * @param executionIds - Array of execution IDs
 * @returns Comparison analysis
 */
export declare function compareEmulationCampaigns(executionIds: string[]): {
    executions: Array<{
        id: string;
        detectionRate: number;
        controlsPassed: number;
        findings: number;
    }>;
    trends: {
        detectionRateTrend: 'improving' | 'declining' | 'stable';
        controlEffectivenessTrend: 'improving' | 'declining' | 'stable';
    };
    improvements: string[];
    regressions: string[];
};
/**
 * Publishes emulation event to message queue
 * @param event - Emulation event
 * @param queue - Target queue
 * @returns Publish result
 */
export declare function publishEmulationEvent(event: EmulationEvent, queue?: 'redis' | 'rabbitmq' | 'kafka'): {
    messageId: string;
    queue: string;
    published: boolean;
    timestamp: Date;
};
/**
 * Subscribes to emulation events
 * @param eventTypes - Event types to subscribe to
 * @param handler - Event handler function
 * @returns Subscription ID
 */
export declare function subscribeToEmulationEvents(eventTypes: string[], handler: (event: EmulationEvent) => void): {
    subscriptionId: string;
    eventTypes: string[];
    active: boolean;
};
/**
 * Orchestrates distributed emulation campaign
 * @param campaign - Campaign configuration
 * @param workers - Worker node configurations
 * @returns Orchestration result
 */
export declare function orchestrateDistributedEmulation(campaign: EmulationCampaign, workers: Array<{
    workerId: string;
    capabilities: string[];
    capacity: number;
}>): {
    orchestrationId: string;
    workDistribution: Array<{
        workerId: string;
        assignedTechniques: string[];
        estimatedDuration: number;
    }>;
    coordinationPlan: {
        synchronizationPoints: Array<{
            timestamp: Date;
            action: string;
        }>;
    };
};
/**
 * Aggregates results from distributed emulation
 * @param workerResults - Results from each worker
 * @returns Aggregated results
 */
export declare function aggregateDistributedResults(workerResults: Array<{
    workerId: string;
    results: Partial<EmulationResults>;
}>): EmulationResults;
/**
 * @swagger
 * /api/emulation/frameworks:
 *   post:
 *     summary: Create attack simulation framework
 *     tags: [Adversary Emulation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttackSimulationFramework'
 *     responses:
 *       201:
 *         description: Framework created successfully
 *       400:
 *         description: Invalid framework configuration
 */
/**
 * @swagger
 * /api/emulation/techniques/{techniqueId}/execute:
 *   post:
 *     summary: Execute MITRE ATT&CK technique emulation
 *     tags: [Adversary Emulation]
 *     parameters:
 *       - in: path
 *         name: techniqueId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technique executed successfully
 *       404:
 *         description: Technique not found
 */
/**
 * @swagger
 * /api/emulation/purple-team/exercises:
 *   get:
 *     summary: List purple team exercises
 *     tags: [Purple Team]
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurpleTeamExercise'
 */
/**
 * @swagger
 * /api/emulation/campaigns/{campaignId}/execute:
 *   post:
 *     summary: Execute emulation campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign execution started
 *       404:
 *         description: Campaign not found
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AttackSimulationFramework:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         frameworkType:
 *           type: string
 *           enum: [mitre_attack, kill_chain, diamond_model, custom]
 *         status:
 *           type: string
 *           enum: [active, paused, completed, archived]
 */
declare const _default: {
    createAttackSimulationFramework: typeof createAttackSimulationFramework;
    validateFrameworkSafety: typeof validateFrameworkSafety;
    scheduleFrameworkExecution: typeof scheduleFrameworkExecution;
    executeAttackSimulationFramework: typeof executeAttackSimulationFramework;
    createMITRETechniqueEmulation: typeof createMITRETechniqueEmulation;
    mapTechniqueToHealthcareThreats: typeof mapTechniqueToHealthcareThreats;
    generateAtomicTest: typeof generateAtomicTest;
    executeMITRETechniqueEmulation: typeof executeMITRETechniqueEmulation;
    validateTechniqueDetectionCoverage: typeof validateTechniqueDetectionCoverage;
    createPurpleTeamExercise: typeof createPurpleTeamExercise;
    coordinateTeamActivities: typeof coordinateTeamActivities;
    trackPurpleTeamProgress: typeof trackPurpleTeamProgress;
    generatePurpleTeamReport: typeof generatePurpleTeamReport;
    facilitatePurpleTeamCommunication: typeof facilitatePurpleTeamCommunication;
    createAttackPathSimulation: typeof createAttackPathSimulation;
    simulateAttackPath: typeof simulateAttackPath;
    analyzeAttackPathEffectiveness: typeof analyzeAttackPathEffectiveness;
    generateAttackGraph: typeof generateAttackGraph;
    createDetectionRuleValidation: typeof createDetectionRuleValidation;
    validateDetectionRule: typeof validateDetectionRule;
    tuneDetectionRule: typeof tuneDetectionRule;
    analyzeFalsePositives: typeof analyzeFalsePositives;
    createSecurityControlTest: typeof createSecurityControlTest;
    testSecurityControl: typeof testSecurityControl;
    validateHIPAACompliance: typeof validateHIPAACompliance;
    generateControlBypassScenarios: typeof generateControlBypassScenarios;
    createEmulationCampaign: typeof createEmulationCampaign;
    executeEmulationCampaign: typeof executeEmulationCampaign;
    monitorCampaignExecution: typeof monitorCampaignExecution;
    controlCampaignExecution: typeof controlCampaignExecution;
    generateEmulationReport: typeof generateEmulationReport;
    generateMITRECoverageHeatmap: typeof generateMITRECoverageHeatmap;
    exportEmulationResults: typeof exportEmulationResults;
    compareEmulationCampaigns: typeof compareEmulationCampaigns;
    publishEmulationEvent: typeof publishEmulationEvent;
    subscribeToEmulationEvents: typeof subscribeToEmulationEvents;
    orchestrateDistributedEmulation: typeof orchestrateDistributedEmulation;
    aggregateDistributedResults: typeof aggregateDistributedResults;
};
export default _default;
//# sourceMappingURL=adversary-emulation-kit.d.ts.map