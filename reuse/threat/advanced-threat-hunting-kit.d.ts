/**
 * LOC: ADVTHRHUNT001
 * File: /reuse/threat/advanced-threat-hunting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat hunting services
 *   - Security analytics modules
 *   - Hunt campaign managers
 *   - Investigation platforms
 *   - Evidence collection systems
 *   - Threat detection engines
 */
interface HuntCampaign {
    id: string;
    name: string;
    description: string;
    campaignType: 'hypothesis_driven' | 'ioc_driven' | 'behavior_driven' | 'threat_actor_driven' | 'vulnerability_driven';
    status: 'planning' | 'active' | 'paused' | 'completed' | 'archived';
    priority: 'critical' | 'high' | 'medium' | 'low';
    hypothesis: string;
    scope: {
        timeRange: {
            start: Date;
            end: Date;
        };
        targets: string[];
        dataSource: string[];
        excludePatterns?: string[];
    };
    huntingQueries: string[];
    iocs: string[];
    findings: string[];
    threatActors?: string[];
    mitreAttackTechniques: string[];
    assignedHunters: Array<{
        hunterId: string;
        role: string;
        assignedAt: Date;
    }>;
    collaborators: string[];
    metrics: {
        queriesExecuted: number;
        dataPointsAnalyzed: number;
        findingsIdentified: number;
        falsePositives: number;
        truePositives: number;
        hoursSpent: number;
    };
    timeline: Array<{
        timestamp: Date;
        event: string;
        hunter: string;
        details: Record<string, any>;
    }>;
    startedAt: Date;
    completedAt?: Date;
    createdBy: string;
    metadata?: Record<string, any>;
}
interface HuntHypothesis {
    id: string;
    campaignId?: string;
    title: string;
    description: string;
    category: string;
    threatType: string;
    confidence: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: 'draft' | 'active' | 'validated' | 'refuted' | 'inconclusive';
    assumptions: string[];
    expectedIndicators: Array<{
        type: string;
        indicator: string;
        rationale: string;
    }>;
    testingCriteria: Array<{
        criterion: string;
        validationMethod: string;
        threshold?: any;
    }>;
    dataSourcesRequired: string[];
    queriesGenerated: string[];
    validationResults: Array<{
        query: string;
        executedAt: Date;
        resultsFound: number;
        matchesCriteria: boolean;
        notes?: string;
    }>;
    mitreAttackMapping: string[];
    relatedHypotheses: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
interface HuntQuery {
    id: string;
    name: string;
    description: string;
    queryType: 'siem' | 'edr' | 'network' | 'log_analysis' | 'endpoint' | 'cloud' | 'custom';
    dataSource: string;
    queryLanguage: 'kql' | 'spl' | 'sql' | 'lucene' | 'sigma' | 'yara' | 'custom';
    queryText: string;
    parameters: Record<string, any>;
    timeRange: {
        start: Date;
        end: Date;
        timezone?: string;
    };
    filters: Array<{
        field: string;
        operator: string;
        value: any;
    }>;
    aggregations?: Array<{
        field: string;
        function: string;
        groupBy?: string[];
    }>;
    expectedResults: {
        minResults?: number;
        maxResults?: number;
        alertThreshold?: number;
    };
    executionHistory: Array<{
        executedAt: Date;
        executedBy: string;
        resultsCount: number;
        executionTime: number;
        success: boolean;
        error?: string;
    }>;
    tags: string[];
    isReusable: boolean;
    isTemplate: boolean;
    metadata?: Record<string, any>;
}
interface IOCPivot {
    id: string;
    sourceIOC: {
        type: string;
        value: string;
        confidence: number;
    };
    pivotType: 'expansion' | 'enrichment' | 'correlation' | 'attribution';
    relatedIOCs: Array<{
        type: string;
        value: string;
        relationship: string;
        confidence: number;
        source: string;
        firstSeen?: Date;
        lastSeen?: Date;
    }>;
    threatContext: {
        threatActors?: string[];
        campaigns?: string[];
        malwareFamilies?: string[];
        attackTechniques?: string[];
    };
    enrichmentData: Record<string, any>;
    pivotPath: Array<{
        step: number;
        from: string;
        to: string;
        relationship: string;
    }>;
    discoveredAt: Date;
    discoveredBy: string;
    metadata?: Record<string, any>;
}
interface HuntTimeline {
    id: string;
    campaignId: string;
    name: string;
    description: string;
    timelineType: 'attack_reconstruction' | 'lateral_movement' | 'data_exfiltration' | 'persistence' | 'general';
    events: Array<{
        id: string;
        timestamp: Date;
        eventType: string;
        source: string;
        actor?: string;
        target?: string;
        action: string;
        details: Record<string, any>;
        iocs?: string[];
        confidence: number;
        verified: boolean;
    }>;
    keyMilestones: Array<{
        timestamp: Date;
        milestone: string;
        significance: string;
    }>;
    attackPhases: Array<{
        phase: string;
        startTime: Date;
        endTime?: Date;
        techniques: string[];
        events: string[];
    }>;
    gaps: Array<{
        startTime: Date;
        endTime: Date;
        reason: string;
        investigationNeeded: boolean;
    }>;
    visualizationData?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
interface HuntEvidence {
    id: string;
    campaignId: string;
    evidenceType: 'log' | 'file' | 'memory' | 'network' | 'registry' | 'artifact' | 'screenshot' | 'metadata';
    source: string;
    collectedAt: Date;
    collectedBy: string;
    preservationHash: string;
    chainOfCustody: Array<{
        timestamp: Date;
        custodian: string;
        action: string;
        notes?: string;
    }>;
    storageLocation: string;
    isEncrypted: boolean;
    retentionPolicy: {
        retainUntil: Date;
        autoDelete: boolean;
        legalHold: boolean;
    };
    relatedIOCs: string[];
    relatedEvents: string[];
    analysisResults?: Array<{
        analyzedAt: Date;
        analyzedBy: string;
        tool: string;
        findings: Record<string, any>;
    }>;
    tags: string[];
    metadata?: Record<string, any>;
}
interface HuntMetrics {
    campaignId: string;
    period: {
        start: Date;
        end: Date;
    };
    productivity: {
        queriesExecuted: number;
        dataPointsAnalyzed: number;
        hoursInvested: number;
        findingsPerHour: number;
    };
    effectiveness: {
        totalFindings: number;
        truePositives: number;
        falsePositives: number;
        precision: number;
        recall?: number;
    };
    coverage: {
        dataSourcesCovered: string[];
        attackTechniquesCovered: string[];
        coveragePercentage: number;
    };
    collaboration: {
        huntersInvolved: number;
        notesShared: number;
        queriesShared: number;
        crossTeamCollaboration: number;
    };
    outcomes: {
        threatsNeutralized: number;
        vulnerabilitiesFixed: number;
        controlsImproved: number;
        processEnhancements: number;
    };
}
interface HuntNote {
    id: string;
    campaignId: string;
    noteType: 'observation' | 'hypothesis' | 'question' | 'conclusion' | 'action_item';
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    relatedQueries?: string[];
    relatedIOCs?: string[];
    relatedEvidence?: string[];
    isShared: boolean;
    mentions?: string[];
    metadata?: Record<string, any>;
}
/**
 * Sequelize HuntCampaign model attributes for threat hunting campaigns.
 *
 * @example
 * ```typescript
 * import { DataTypes, Model } from 'sequelize';
 *
 * class HuntCampaign extends Model {
 *   declare id: string;
 *   declare name: string;
 *   declare hypothesis: string;
 * }
 *
 * HuntCampaign.init(getHuntCampaignModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_campaigns',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status', 'priority'] },
 *     { fields: ['campaignType'] },
 *     { fields: ['createdBy'] },
 *     { fields: ['mitreAttackTechniques'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getHuntCampaignModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    campaignType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    priority: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    hypothesis: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    scope: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    huntingQueries: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    iocs: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    findings: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    threatActors: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    mitreAttackTechniques: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    assignedHunters: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    collaborators: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    metrics: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    timeline: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize HuntHypothesis model attributes for hunting hypotheses.
 *
 * @example
 * ```typescript
 * class HuntHypothesis extends Model {}
 * HuntHypothesis.init(getHuntHypothesisModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_hypotheses',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['status', 'priority'] },
 *     { fields: ['threatType'] },
 *     { fields: ['confidence'] },
 *     { fields: ['mitreAttackMapping'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getHuntHypothesisModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    campaignId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    title: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    category: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    threatType: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    priority: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    assumptions: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    expectedIndicators: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    testingCriteria: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    dataSourcesRequired: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    queriesGenerated: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    validationResults: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    mitreAttackMapping: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    relatedHypotheses: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize HuntQuery model attributes for hunting queries.
 *
 * @example
 * ```typescript
 * class HuntQuery extends Model {}
 * HuntQuery.init(getHuntQueryModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_queries',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['queryType', 'dataSource'] },
 *     { fields: ['isReusable', 'isTemplate'] },
 *     { fields: ['tags'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getHuntQueryModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    name: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    queryType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    dataSource: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    queryLanguage: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    queryText: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    parameters: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    timeRange: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    filters: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    aggregations: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    expectedResults: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    executionHistory: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    tags: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    isReusable: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    isTemplate: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize IOCPivot model attributes for IOC pivot analysis.
 *
 * @example
 * ```typescript
 * class IOCPivot extends Model {}
 * IOCPivot.init(getIOCPivotModelAttributes(), {
 *   sequelize,
 *   tableName: 'ioc_pivots',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['pivotType'] },
 *     { fields: ['discoveredBy'] },
 *     { fields: ['relatedIOCs'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getIOCPivotModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    sourceIOC: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    pivotType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    relatedIOCs: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    threatContext: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    enrichmentData: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    pivotPath: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    discoveredAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    discoveredBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize HuntTimeline model attributes for attack timelines.
 *
 * @example
 * ```typescript
 * class HuntTimeline extends Model {}
 * HuntTimeline.init(getHuntTimelineModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_timelines',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['campaignId'] },
 *     { fields: ['timelineType'] },
 *     { fields: ['events'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getHuntTimelineModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    campaignId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    name: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    timelineType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    events: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    keyMilestones: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    attackPhases: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    gaps: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    visualizationData: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize HuntEvidence model attributes for evidence preservation.
 *
 * @example
 * ```typescript
 * class HuntEvidence extends Model {}
 * HuntEvidence.init(getHuntEvidenceModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_evidence',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['campaignId'] },
 *     { fields: ['evidenceType'] },
 *     { fields: ['collectedBy'] },
 *     { fields: ['preservationHash'] }
 *   ]
 * });
 * ```
 */
export declare const getHuntEvidenceModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    campaignId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    evidenceType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    source: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    collectedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    collectedBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    preservationHash: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    chainOfCustody: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    storageLocation: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    isEncrypted: {
        type: string;
        defaultValue: boolean;
        comment: string;
    };
    retentionPolicy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    relatedIOCs: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    relatedEvents: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    analysisResults: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    tags: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize HuntFinding model attributes for hunt findings.
 *
 * @example
 * ```typescript
 * class HuntFinding extends Model {}
 * HuntFinding.init(getHuntFindingModelAttributes(), {
 *   sequelize,
 *   tableName: 'hunt_findings',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['campaignId'] },
 *     { fields: ['severity', 'validationStatus'] },
 *     { fields: ['findingType'] },
 *     { fields: ['mitreAttackTechniques'], using: 'gin' }
 *   ]
 * });
 * ```
 */
export declare const getHuntFindingModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    campaignId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    findingType: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    severity: {
        type: string;
        values: string[];
        allowNull: boolean;
        comment: string;
    };
    title: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    description: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
        comment: string;
    };
    validationStatus: {
        type: string;
        values: string[];
        defaultValue: string;
        comment: string;
    };
    affectedAssets: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    iocs: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    mitreAttackTechniques: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    timeline: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    evidence: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    rootCause: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    impact: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    remediation: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    discoveredAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    discoveredBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    validatedAt: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    validatedBy: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates a new threat hunting campaign with hypothesis and scope.
 *
 * @param {Partial<HuntCampaign>} campaignData - Campaign configuration
 * @returns {HuntCampaign} Created hunt campaign
 *
 * @example
 * ```typescript
 * const campaign = createHuntCampaign({
 *   name: 'APT29 Lateral Movement Hunt',
 *   campaignType: 'threat_actor_driven',
 *   priority: 'critical',
 *   hypothesis: 'APT29 may be using WMI for lateral movement in our environment',
 *   scope: {
 *     timeRange: {
 *       start: new Date('2024-01-01'),
 *       end: new Date('2024-01-31')
 *     },
 *     targets: ['windows_hosts', 'domain_controllers'],
 *     dataSource: ['siem', 'edr', 'windows_logs']
 *   },
 *   mitreAttackTechniques: ['T1047', 'T1021'],
 *   assignedHunters: [
 *     { hunterId: 'hunter-123', role: 'lead', assignedAt: new Date() }
 *   ]
 * });
 * console.log('Campaign created:', campaign.id);
 * ```
 */
export declare const createHuntCampaign: (campaignData: Partial<HuntCampaign>) => HuntCampaign;
/**
 * Updates hunt campaign status and metrics.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {Partial<HuntCampaign>} updates - Campaign updates
 * @returns {Promise<HuntCampaign>} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = await updateHuntCampaign('campaign-123', {
 *   status: 'active',
 *   metrics: {
 *     queriesExecuted: 25,
 *     dataPointsAnalyzed: 1500000,
 *     findingsIdentified: 3
 *   }
 * });
 * console.log('Campaign status:', updated.status);
 * ```
 */
export declare const updateHuntCampaign: (campaignId: string, updates: Partial<HuntCampaign>) => Promise<HuntCampaign>;
/**
 * Archives a completed hunt campaign with final report.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {Record<string, any>} finalReport - Campaign final report
 * @returns {Promise<HuntCampaign>} Archived campaign
 *
 * @example
 * ```typescript
 * const archived = await archiveHuntCampaign('campaign-123', {
 *   summary: 'Successfully identified 3 instances of APT29 lateral movement',
 *   recommendations: ['Implement WMI monitoring', 'Review credential hygiene'],
 *   lessonsLearned: ['Need better EDR coverage on legacy systems']
 * });
 * console.log('Campaign archived:', archived.status);
 * ```
 */
export declare const archiveHuntCampaign: (campaignId: string, finalReport: Record<string, any>) => Promise<HuntCampaign>;
/**
 * Retrieves active hunt campaigns for a specific hunter.
 *
 * @param {string} hunterId - Hunter user identifier
 * @returns {Promise<HuntCampaign[]>} Active campaigns
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveCampaigns('hunter-123');
 * console.log('Active campaigns:', campaigns.length);
 * campaigns.forEach(campaign => {
 *   console.log(`- ${campaign.name} (${campaign.priority})`);
 * });
 * ```
 */
export declare const getActiveCampaigns: (hunterId: string) => Promise<HuntCampaign[]>;
/**
 * Adds a finding to a hunt campaign.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {string} findingId - Finding identifier
 * @returns {Promise<HuntCampaign>} Updated campaign
 *
 * @example
 * ```typescript
 * const campaign = await addFindingToCampaign('campaign-123', 'finding-456');
 * console.log('Total findings:', campaign.findings.length);
 * ```
 */
export declare const addFindingToCampaign: (campaignId: string, findingId: string) => Promise<HuntCampaign>;
/**
 * Collaborates on a hunt campaign by adding hunters.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} hunterIds - Hunter identifiers to add
 * @returns {Promise<HuntCampaign>} Updated campaign
 *
 * @example
 * ```typescript
 * const campaign = await addCampaignCollaborators(
 *   'campaign-123',
 *   ['hunter-456', 'hunter-789']
 * );
 * console.log('Collaborators:', campaign.collaborators.length);
 * ```
 */
export declare const addCampaignCollaborators: (campaignId: string, hunterIds: string[]) => Promise<HuntCampaign>;
/**
 * Generates campaign progress report with metrics.
 *
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<object>} Campaign progress report
 *
 * @example
 * ```typescript
 * const report = await generateCampaignReport('campaign-123');
 * console.log('Progress:', report.progressPercentage);
 * console.log('Findings:', report.findings);
 * console.log('Time invested:', report.hoursInvested);
 * ```
 */
export declare const generateCampaignReport: (campaignId: string) => Promise<{
    campaignId: string;
    status: string;
    progressPercentage: number;
    findings: number;
    truePositiveRate: number;
    hoursInvested: number;
    efficiency: number;
    recommendations: string[];
}>;
/**
 * Creates a hunting hypothesis with testing criteria.
 *
 * @param {Partial<HuntHypothesis>} hypothesisData - Hypothesis configuration
 * @returns {HuntHypothesis} Created hypothesis
 *
 * @example
 * ```typescript
 * const hypothesis = createHuntHypothesis({
 *   title: 'Credential Dumping via LSASS',
 *   category: 'Credential Access',
 *   threatType: 'credential_theft',
 *   confidence: 0.7,
 *   priority: 'high',
 *   assumptions: [
 *     'Attackers target LSASS for credential extraction',
 *     'Uncommon processes accessing LSASS indicate suspicious activity'
 *   ],
 *   expectedIndicators: [
 *     {
 *       type: 'process',
 *       indicator: 'procdump.exe accessing lsass.exe',
 *       rationale: 'Common tool for LSASS dumping'
 *     }
 *   ],
 *   dataSourcesRequired: ['edr', 'sysmon', 'windows_security_logs'],
 *   mitreAttackMapping: ['T1003.001']
 * });
 * console.log('Hypothesis created:', hypothesis.id);
 * ```
 */
export declare const createHuntHypothesis: (hypothesisData: Partial<HuntHypothesis>) => HuntHypothesis;
/**
 * Validates a hypothesis against collected data.
 *
 * @param {string} hypothesisId - Hypothesis identifier
 * @param {Array<object>} validationData - Validation test results
 * @returns {Promise<HuntHypothesis>} Updated hypothesis
 *
 * @example
 * ```typescript
 * const validated = await validateHypothesis('hypothesis-123', [
 *   {
 *     query: 'LSASS access query',
 *     executedAt: new Date(),
 *     resultsFound: 15,
 *     matchesCriteria: true
 *   }
 * ]);
 * console.log('Hypothesis status:', validated.status);
 * console.log('Confidence:', validated.confidence);
 * ```
 */
export declare const validateHypothesis: (hypothesisId: string, validationData: Array<any>) => Promise<HuntHypothesis>;
/**
 * Generates hunting queries from hypothesis criteria.
 *
 * @param {string} hypothesisId - Hypothesis identifier
 * @returns {Promise<HuntQuery[]>} Generated queries
 *
 * @example
 * ```typescript
 * const queries = await generateQueriesFromHypothesis('hypothesis-123');
 * console.log('Generated queries:', queries.length);
 * queries.forEach(query => {
 *   console.log(`- ${query.name} (${query.queryType})`);
 * });
 * ```
 */
export declare const generateQueriesFromHypothesis: (hypothesisId: string) => Promise<HuntQuery[]>;
/**
 * Links related hypotheses for correlation.
 *
 * @param {string} hypothesisId - Primary hypothesis identifier
 * @param {string[]} relatedHypothesisIds - Related hypothesis identifiers
 * @returns {Promise<HuntHypothesis>} Updated hypothesis
 *
 * @example
 * ```typescript
 * const linked = await linkRelatedHypotheses(
 *   'hypothesis-123',
 *   ['hypothesis-456', 'hypothesis-789']
 * );
 * console.log('Related hypotheses:', linked.relatedHypotheses.length);
 * ```
 */
export declare const linkRelatedHypotheses: (hypothesisId: string, relatedHypothesisIds: string[]) => Promise<HuntHypothesis>;
/**
 * Refines hypothesis based on investigation results.
 *
 * @param {string} hypothesisId - Hypothesis identifier
 * @param {Record<string, any>} refinements - Hypothesis refinements
 * @returns {Promise<HuntHypothesis>} Refined hypothesis
 *
 * @example
 * ```typescript
 * const refined = await refineHypothesis('hypothesis-123', {
 *   assumptions: ['Updated assumption based on findings'],
 *   confidence: 0.85,
 *   expectedIndicators: [
 *     { type: 'network', indicator: 'C2 beacon pattern', rationale: 'New finding' }
 *   ]
 * });
 * console.log('Refined confidence:', refined.confidence);
 * ```
 */
export declare const refineHypothesis: (hypothesisId: string, refinements: Record<string, any>) => Promise<HuntHypothesis>;
/**
 * Exports hypothesis for sharing with other teams.
 *
 * @param {string} hypothesisId - Hypothesis identifier
 * @param {string} format - Export format (json, markdown, pdf)
 * @returns {Promise<string>} Exported hypothesis content
 *
 * @example
 * ```typescript
 * const exported = await exportHypothesis('hypothesis-123', 'json');
 * fs.writeFileSync('hypothesis-export.json', exported);
 * ```
 */
export declare const exportHypothesis: (hypothesisId: string, format: string) => Promise<string>;
/**
 * Builds a hunting query with advanced filters and aggregations.
 *
 * @param {Partial<HuntQuery>} queryData - Query configuration
 * @returns {HuntQuery} Built query
 *
 * @example
 * ```typescript
 * const query = buildHuntQuery({
 *   name: 'PowerShell Download Cradle Detection',
 *   queryType: 'siem',
 *   dataSource: 'splunk',
 *   queryLanguage: 'spl',
 *   queryText: 'sourcetype=powershell | search "DownloadString" OR "DownloadFile"',
 *   timeRange: {
 *     start: new Date(Date.now() - 86400000),
 *     end: new Date()
 *   },
 *   filters: [
 *     { field: 'EventCode', operator: '==', value: 4104 }
 *   ],
 *   expectedResults: {
 *     alertThreshold: 5
 *   }
 * });
 * console.log('Query built:', query.id);
 * ```
 */
export declare const buildHuntQuery: (queryData: Partial<HuntQuery>) => HuntQuery;
/**
 * Executes a hunting query and records results.
 *
 * @param {string} queryId - Query identifier
 * @param {string} executedBy - Hunter executing query
 * @returns {Promise<object>} Query execution results
 *
 * @example
 * ```typescript
 * const results = await executeHuntQuery('query-123', 'hunter-456');
 * console.log('Results found:', results.resultsCount);
 * console.log('Execution time:', results.executionTime);
 * console.log('Data:', results.data);
 * ```
 */
export declare const executeHuntQuery: (queryId: string, executedBy: string) => Promise<{
    queryId: string;
    executedBy: string;
    executedAt: Date;
    resultsCount: number;
    executionTime: number;
    success: boolean;
    data: any[];
    error?: string;
}>;
/**
 * Optimizes hunting query for better performance.
 *
 * @param {string} queryId - Query identifier
 * @returns {Promise<HuntQuery>} Optimized query
 *
 * @example
 * ```typescript
 * const optimized = await optimizeQuery('query-123');
 * console.log('Optimized query text:', optimized.queryText);
 * console.log('Performance improvement:', optimized.metadata.optimizationGain);
 * ```
 */
export declare const optimizeQuery: (queryId: string) => Promise<HuntQuery>;
/**
 * Creates query template for reuse across campaigns.
 *
 * @param {string} queryId - Source query identifier
 * @param {string} templateName - Template name
 * @returns {Promise<HuntQuery>} Created query template
 *
 * @example
 * ```typescript
 * const template = await createQueryTemplate('query-123', 'PowerShell Cradle Template');
 * console.log('Template created:', template.id);
 * console.log('Is template:', template.isTemplate);
 * ```
 */
export declare const createQueryTemplate: (queryId: string, templateName: string) => Promise<HuntQuery>;
/**
 * Validates query syntax before execution.
 *
 * @param {HuntQuery} query - Query to validate
 * @returns {object} Validation results
 *
 * @example
 * ```typescript
 * const validation = validateQuerySyntax(query);
 * if (!validation.valid) {
 *   console.error('Syntax errors:', validation.errors);
 * }
 * ```
 */
export declare const validateQuerySyntax: (query: HuntQuery) => {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Retrieves query execution history and statistics.
 *
 * @param {string} queryId - Query identifier
 * @param {number} limit - Maximum history records
 * @returns {Promise<any[]>} Execution history
 *
 * @example
 * ```typescript
 * const history = await getQueryExecutionHistory('query-123', 10);
 * console.log('Executions:', history.length);
 * console.log('Average execution time:', history.reduce((a, b) => a + b.executionTime, 0) / history.length);
 * ```
 */
export declare const getQueryExecutionHistory: (queryId: string, limit: number) => Promise<any[]>;
/**
 * Shares query with hunt team or other campaigns.
 *
 * @param {string} queryId - Query identifier
 * @param {string[]} recipientIds - Recipient user/campaign identifiers
 * @returns {Promise<object>} Share results
 *
 * @example
 * ```typescript
 * const result = await shareQuery('query-123', ['hunter-456', 'campaign-789']);
 * console.log('Query shared with:', result.sharedWith.length);
 * ```
 */
export declare const shareQuery: (queryId: string, recipientIds: string[]) => Promise<{
    queryId: string;
    sharedWith: string[];
    sharedAt: Date;
    success: boolean;
}>;
/**
 * Pivots from a known IOC to discover related indicators.
 *
 * @param {string} iocType - IOC type (ip, domain, hash, etc.)
 * @param {string} iocValue - IOC value
 * @param {string} pivotType - Type of pivot to perform
 * @returns {Promise<IOCPivot>} Pivot results
 *
 * @example
 * ```typescript
 * const pivot = await pivotFromIOC(
 *   'ip',
 *   '192.168.1.100',
 *   'expansion'
 * );
 * console.log('Related IOCs found:', pivot.relatedIOCs.length);
 * console.log('Threat actors:', pivot.threatContext.threatActors);
 * ```
 */
export declare const pivotFromIOC: (iocType: string, iocValue: string, pivotType: string) => Promise<IOCPivot>;
/**
 * Expands IOC set using threat intelligence feeds.
 *
 * @param {string[]} iocIds - IOC identifiers to expand
 * @returns {Promise<IOCPivot[]>} Expansion results
 *
 * @example
 * ```typescript
 * const expansions = await expandIOCSet(['ioc-123', 'ioc-456']);
 * console.log('Total related IOCs discovered:', expansions.reduce((sum, p) => sum + p.relatedIOCs.length, 0));
 * ```
 */
export declare const expandIOCSet: (iocIds: string[]) => Promise<IOCPivot[]>;
/**
 * Enriches IOC with threat intelligence data.
 *
 * @param {string} iocId - IOC identifier
 * @param {string[]} enrichmentSources - Sources to use for enrichment
 * @returns {Promise<IOCPivot>} Enriched IOC data
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOC('ioc-123', ['virustotal', 'alienvault', 'shodan']);
 * console.log('Enrichment data:', enriched.enrichmentData);
 * console.log('Threat context:', enriched.threatContext);
 * ```
 */
export declare const enrichIOC: (iocId: string, enrichmentSources: string[]) => Promise<IOCPivot>;
/**
 * Correlates IOCs across multiple data sources.
 *
 * @param {string[]} iocIds - IOC identifiers to correlate
 * @returns {Promise<object>} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = await correlateIOCs(['ioc-123', 'ioc-456', 'ioc-789']);
 * console.log('Correlation clusters:', correlation.clusters.length);
 * console.log('Common threat actors:', correlation.commonThreatActors);
 * ```
 */
export declare const correlateIOCs: (iocIds: string[]) => Promise<{
    correlationId: string;
    iocIds: string[];
    clusters: Array<{
        clusterName: string;
        iocs: string[];
        sharedAttributes: Record<string, any>;
    }>;
    commonThreatActors: string[];
    commonCampaigns: string[];
    relationshipGraph: Record<string, string[]>;
}>;
/**
 * Attributes IOCs to threat actors or campaigns.
 *
 * @param {string} iocId - IOC identifier
 * @returns {Promise<object>} Attribution results
 *
 * @example
 * ```typescript
 * const attribution = await attributeIOC('ioc-123');
 * console.log('Primary attribution:', attribution.primaryAttribution);
 * console.log('Confidence:', attribution.confidence);
 * console.log('Supporting evidence:', attribution.evidence);
 * ```
 */
export declare const attributeIOC: (iocId: string) => Promise<{
    iocId: string;
    primaryAttribution: string;
    alternativeAttributions: string[];
    confidence: number;
    evidence: Array<{
        source: string;
        finding: string;
        weight: number;
    }>;
    mitreAttackTechniques: string[];
}>;
/**
 * Visualizes IOC relationships as a graph.
 *
 * @param {string[]} iocIds - IOC identifiers to visualize
 * @returns {Promise<object>} Graph visualization data
 *
 * @example
 * ```typescript
 * const graph = await visualizeIOCGraph(['ioc-123', 'ioc-456', 'ioc-789']);
 * console.log('Nodes:', graph.nodes.length);
 * console.log('Edges:', graph.edges.length);
 * ```
 */
export declare const visualizeIOCGraph: (iocIds: string[]) => Promise<{
    nodes: Array<{
        id: string;
        type: string;
        label: string;
        attributes: Record<string, any>;
    }>;
    edges: Array<{
        from: string;
        to: string;
        relationship: string;
        weight: number;
    }>;
    clusters: string[][];
}>;
/**
 * Creates attack timeline from hunting events.
 *
 * @param {Partial<HuntTimeline>} timelineData - Timeline configuration
 * @returns {HuntTimeline} Created timeline
 *
 * @example
 * ```typescript
 * const timeline = createAttackTimeline({
 *   campaignId: 'campaign-123',
 *   name: 'Ransomware Attack Reconstruction',
 *   timelineType: 'attack_reconstruction',
 *   events: [
 *     {
 *       id: 'event-1',
 *       timestamp: new Date('2024-01-15T08:30:00Z'),
 *       eventType: 'initial_access',
 *       source: 'edr',
 *       action: 'Phishing email opened',
 *       details: { user: 'john.doe', file: 'invoice.pdf' },
 *       confidence: 0.95
 *     }
 *   ]
 * });
 * console.log('Timeline created:', timeline.id);
 * ```
 */
export declare const createAttackTimeline: (timelineData: Partial<HuntTimeline>) => HuntTimeline;
/**
 * Adds events to existing timeline with automatic ordering.
 *
 * @param {string} timelineId - Timeline identifier
 * @param {Array<object>} events - Events to add
 * @returns {Promise<HuntTimeline>} Updated timeline
 *
 * @example
 * ```typescript
 * const updated = await addTimelineEvents('timeline-123', [
 *   {
 *     id: 'event-5',
 *     timestamp: new Date(),
 *     eventType: 'lateral_movement',
 *     source: 'network_logs',
 *     action: 'SMB connection to DC',
 *     details: {},
 *     confidence: 0.88
 *   }
 * ]);
 * console.log('Total events:', updated.events.length);
 * ```
 */
export declare const addTimelineEvents: (timelineId: string, events: Array<any>) => Promise<HuntTimeline>;
/**
 * Identifies gaps in timeline requiring investigation.
 *
 * @param {string} timelineId - Timeline identifier
 * @returns {Promise<HuntTimeline>} Timeline with identified gaps
 *
 * @example
 * ```typescript
 * const analyzed = await identifyTimelineGaps('timeline-123');
 * console.log('Gaps found:', analyzed.gaps.length);
 * analyzed.gaps.forEach(gap => {
 *   console.log(`Gap: ${gap.startTime} to ${gap.endTime} - ${gap.reason}`);
 * });
 * ```
 */
export declare const identifyTimelineGaps: (timelineId: string) => Promise<HuntTimeline>;
/**
 * Maps timeline events to MITRE ATT&CK phases.
 *
 * @param {string} timelineId - Timeline identifier
 * @returns {Promise<HuntTimeline>} Timeline with ATT&CK phase mapping
 *
 * @example
 * ```typescript
 * const mapped = await mapTimelineToMitrePhases('timeline-123');
 * console.log('Attack phases:', mapped.attackPhases.length);
 * mapped.attackPhases.forEach(phase => {
 *   console.log(`${phase.phase}: ${phase.techniques.length} techniques`);
 * });
 * ```
 */
export declare const mapTimelineToMitrePhases: (timelineId: string) => Promise<HuntTimeline>;
/**
 * Exports timeline for reporting and visualization.
 *
 * @param {string} timelineId - Timeline identifier
 * @param {string} format - Export format (json, csv, pdf)
 * @returns {Promise<string>} Exported timeline content
 *
 * @example
 * ```typescript
 * const exported = await exportTimeline('timeline-123', 'json');
 * fs.writeFileSync('attack-timeline.json', exported);
 * ```
 */
export declare const exportTimeline: (timelineId: string, format: string) => Promise<string>;
/**
 * Collects and preserves evidence with chain of custody.
 *
 * @param {Partial<HuntEvidence>} evidenceData - Evidence configuration
 * @returns {Promise<HuntEvidence>} Collected evidence record
 *
 * @example
 * ```typescript
 * const evidence = await collectEvidence({
 *   campaignId: 'campaign-123',
 *   evidenceType: 'log',
 *   source: 'windows-server-01',
 *   collectedBy: 'hunter-456',
 *   storageLocation: 's3://evidence-bucket/case-123/log-001.evtx',
 *   retentionPolicy: {
 *     retainUntil: new Date('2025-01-15'),
 *     autoDelete: false,
 *     legalHold: true
 *   }
 * });
 * console.log('Evidence collected:', evidence.id);
 * console.log('Preservation hash:', evidence.preservationHash);
 * ```
 */
export declare const collectEvidence: (evidenceData: Partial<HuntEvidence>) => Promise<HuntEvidence>;
/**
 * Verifies evidence integrity using preservation hash.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} currentHash - Current hash to verify
 * @returns {Promise<object>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyEvidenceIntegrity('evidence-123', hashValue);
 * if (verification.valid) {
 *   console.log('Evidence integrity verified');
 * } else {
 *   console.error('Evidence tampering detected!');
 * }
 * ```
 */
export declare const verifyEvidenceIntegrity: (evidenceId: string, currentHash: string) => Promise<{
    evidenceId: string;
    valid: boolean;
    originalHash: string;
    currentHash: string;
    verifiedAt: Date;
    chainOfCustodyValid: boolean;
}>;
/**
 * Updates chain of custody for evidence transfer.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} newCustodian - New custodian identifier
 * @param {string} action - Custody action
 * @param {string} notes - Transfer notes
 * @returns {Promise<HuntEvidence>} Updated evidence
 *
 * @example
 * ```typescript
 * const updated = await updateChainOfCustody(
 *   'evidence-123',
 *   'analyst-789',
 *   'transferred',
 *   'Transferred to forensics team for deep analysis'
 * );
 * console.log('Chain of custody entries:', updated.chainOfCustody.length);
 * ```
 */
export declare const updateChainOfCustody: (evidenceId: string, newCustodian: string, action: string, notes?: string) => Promise<HuntEvidence>;
/**
 * Analyzes evidence using specified tools.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} tool - Analysis tool name
 * @param {string} analyzedBy - Analyst identifier
 * @returns {Promise<HuntEvidence>} Evidence with analysis results
 *
 * @example
 * ```typescript
 * const analyzed = await analyzeEvidence(
 *   'evidence-123',
 *   'volatility',
 *   'analyst-456'
 * );
 * console.log('Analysis results:', analyzed.analysisResults);
 * ```
 */
export declare const analyzeEvidence: (evidenceId: string, tool: string, analyzedBy: string) => Promise<HuntEvidence>;
/**
 * Retrieves evidence with access logging.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} accessedBy - User accessing evidence
 * @param {string} purpose - Access purpose
 * @returns {Promise<HuntEvidence>} Retrieved evidence
 *
 * @example
 * ```typescript
 * const evidence = await retrieveEvidence(
 *   'evidence-123',
 *   'analyst-456',
 *   'Forensic analysis for incident IR-2024-001'
 * );
 * console.log('Evidence retrieved:', evidence.id);
 * ```
 */
export declare const retrieveEvidence: (evidenceId: string, accessedBy: string, purpose: string) => Promise<HuntEvidence>;
/**
 * Calculates hunt campaign metrics and KPIs.
 *
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<HuntMetrics>} Campaign metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateHuntMetrics('campaign-123');
 * console.log('Precision:', metrics.effectiveness.precision);
 * console.log('Findings per hour:', metrics.productivity.findingsPerHour);
 * console.log('Coverage:', metrics.coverage.coveragePercentage);
 * ```
 */
export declare const calculateHuntMetrics: (campaignId: string) => Promise<HuntMetrics>;
/**
 * Generates hunt team performance report.
 *
 * @param {string[]} hunterIds - Hunter identifiers
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Team performance report
 *
 * @example
 * ```typescript
 * const report = await generateTeamPerformanceReport(
 *   ['hunter-123', 'hunter-456', 'hunter-789'],
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log('Team metrics:', report.teamMetrics);
 * console.log('Top performers:', report.topPerformers);
 * ```
 */
export declare const generateTeamPerformanceReport: (hunterIds: string[], startDate: Date, endDate: Date) => Promise<{
    period: {
        start: Date;
        end: Date;
    };
    teamMetrics: {
        totalCampaigns: number;
        totalFindings: number;
        averageConfidence: number;
        collaborationScore: number;
    };
    hunterMetrics: Array<{
        hunterId: string;
        campaignsLed: number;
        findingsDiscovered: number;
        queriesCreated: number;
        hoursInvested: number;
    }>;
    topPerformers: string[];
}>;
/**
 * Tracks hunting hypothesis success rates.
 *
 * @param {string[]} hypothesisIds - Hypothesis identifiers
 * @returns {Promise<object>} Hypothesis success metrics
 *
 * @example
 * ```typescript
 * const stats = await trackHypothesisSuccessRates(['hyp-123', 'hyp-456']);
 * console.log('Overall success rate:', stats.overallSuccessRate);
 * console.log('By category:', stats.successByCategory);
 * ```
 */
export declare const trackHypothesisSuccessRates: (hypothesisIds: string[]) => Promise<{
    totalHypotheses: number;
    validated: number;
    refuted: number;
    inconclusive: number;
    overallSuccessRate: number;
    successByCategory: Record<string, number>;
    averageValidationTime: number;
}>;
/**
 * Benchmarks hunt efficiency against industry standards.
 *
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<object>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkHuntEfficiency('campaign-123');
 * console.log('Efficiency score:', benchmark.efficiencyScore);
 * console.log('Industry comparison:', benchmark.industryComparison);
 * ```
 */
export declare const benchmarkHuntEfficiency: (campaignId: string) => Promise<{
    campaignId: string;
    efficiencyScore: number;
    industryComparison: {
        metric: string;
        yourValue: number;
        industryAverage: number;
        percentile: number;
    }[];
    recommendations: string[];
}>;
/**
 * Exports hunt findings for executive reporting.
 *
 * @param {string} campaignId - Campaign identifier
 * @param {string} format - Report format (pdf, pptx, html)
 * @returns {Promise<object>} Executive report data
 *
 * @example
 * ```typescript
 * const report = await exportHuntFindings('campaign-123', 'pdf');
 * console.log('Executive summary:', report.executiveSummary);
 * console.log('Key findings:', report.keyFindings.length);
 * ```
 */
export declare const exportHuntFindings: (campaignId: string, format: string) => Promise<{
    campaignId: string;
    format: string;
    executiveSummary: string;
    keyFindings: Array<{
        title: string;
        severity: string;
        impact: string;
        recommendation: string;
    }>;
    metrics: Record<string, any>;
    generatedAt: Date;
}>;
/**
 * Creates and shares hunt notes with team members.
 *
 * @param {Partial<HuntNote>} noteData - Note configuration
 * @returns {HuntNote} Created hunt note
 *
 * @example
 * ```typescript
 * const note = createHuntNote({
 *   campaignId: 'campaign-123',
 *   noteType: 'observation',
 *   title: 'Unusual PowerShell Activity',
 *   content: 'Observed encoded PowerShell commands with suspicious patterns...',
 *   author: 'hunter-456',
 *   tags: ['powershell', 'suspicious'],
 *   relatedQueries: ['query-789'],
 *   isShared: true
 * });
 * console.log('Note created:', note.id);
 * ```
 */
export declare const createHuntNote: (noteData: Partial<HuntNote>) => HuntNote;
/**
 * Retrieves shared notes for a hunt campaign.
 *
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<HuntNote[]>} Shared hunt notes
 *
 * @example
 * ```typescript
 * const notes = await getSharedHuntNotes('campaign-123');
 * console.log('Shared notes:', notes.length);
 * notes.forEach(note => {
 *   console.log(`- ${note.title} by ${note.author} (${note.noteType})`);
 * });
 * ```
 */
export declare const getSharedHuntNotes: (campaignId: string) => Promise<HuntNote[]>;
/**
 * Mentions team members in hunt notes for collaboration.
 *
 * @param {string} noteId - Note identifier
 * @param {string[]} userIds - User identifiers to mention
 * @returns {Promise<HuntNote>} Updated note with mentions
 *
 * @example
 * ```typescript
 * const note = await mentionHunters('note-123', ['hunter-456', 'hunter-789']);
 * console.log('Mentioned hunters:', note.mentions);
 * ```
 */
export declare const mentionHunters: (noteId: string, userIds: string[]) => Promise<HuntNote>;
/**
 * Uses hunt template to start new campaign quickly.
 *
 * @param {string} templateId - Template identifier
 * @param {Record<string, any>} parameters - Template parameters
 * @returns {Promise<HuntCampaign>} Campaign created from template
 *
 * @example
 * ```typescript
 * const campaign = await useHuntTemplate('template-123', {
 *   targetEnvironment: 'production',
 *   timeRange: '30_days',
 *   priority: 'high'
 * });
 * console.log('Campaign created from template:', campaign.id);
 * console.log('Pre-configured queries:', campaign.huntingQueries.length);
 * ```
 */
export declare const useHuntTemplate: (templateId: string, parameters: Record<string, any>) => Promise<HuntCampaign>;
export {};
//# sourceMappingURL=advanced-threat-hunting-kit.d.ts.map