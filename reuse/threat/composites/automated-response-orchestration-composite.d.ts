/**
 * LOC: AUTORESPORCH001
 * File: /reuse/threat/composites/automated-response-orchestration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../automated-threat-response-kit
 *   - ../response-automation-kit
 *   - ../remediation-tracking-kit
 *   - ../incident-containment-kit
 *   - ../threat-intelligence-orchestration-kit
 *   - ../threat-intelligence-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - SOAR platform services
 *   - Security orchestration engines
 *   - Automated response services
 *   - Incident response coordinators
 *   - Security operations centers
 */
/**
 * Orchestrated response execution context
 */
export interface OrchestrationContext {
    executionId: string;
    incidentId?: string;
    threatType: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedAssets: string[];
    triggeredBy: string;
    timestamp: Date;
    autoApproved: boolean;
    metadata?: Record<string, any>;
}
/**
 * SOAR integration configuration
 */
export interface SOARIntegrationConfig {
    platform: 'splunk_soar' | 'palo_alto_cortex' | 'ibm_resilient' | 'servicenow' | 'custom';
    apiEndpoint: string;
    authentication: {
        type: 'api_key' | 'oauth2' | 'basic' | 'certificate';
        credentials: Record<string, any>;
    };
    enabled: boolean;
    syncInterval?: number;
    retryPolicy: RetryPolicy;
}
/**
 * Retry policy configuration
 */
export interface RetryPolicy {
    maxRetries: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
/**
 * Orchestration execution result
 */
export interface OrchestrationResult {
    executionId: string;
    status: 'success' | 'partial_success' | 'failed' | 'cancelled';
    startTime: Date;
    endTime: Date;
    duration: number;
    stepsExecuted: number;
    stepsSucceeded: number;
    stepsFailed: number;
    impactMetrics: ImpactMetrics;
    errors: ExecutionError[];
    artifacts: Record<string, any>;
}
/**
 * Impact metrics
 */
export interface ImpactMetrics {
    threatsBlocked: number;
    assetsProtected: number;
    usersAffected: number;
    servicesImpacted: number;
    estimatedDamageAvoided?: number;
    responseTimeSeconds: number;
}
/**
 * Execution error
 */
export interface ExecutionError {
    step: string;
    timestamp: Date;
    error: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    remediation?: string;
}
/**
 * Multi-stage response plan
 */
export interface MultiStageResponsePlan {
    id: string;
    name: string;
    stages: ResponseStage[];
    dependencies: StageDependency[];
    approvalGates: ApprovalGate[];
    rollbackStrategy: 'full' | 'partial' | 'none';
    maxDuration: number;
    successCriteria: Record<string, any>;
}
/**
 * Response stage
 */
export interface ResponseStage {
    id: string;
    name: string;
    order: number;
    type: 'sequential' | 'parallel' | 'conditional';
    playbooks: string[];
    timeout: number;
    required: boolean;
    conditions?: Record<string, any>;
}
/**
 * Stage dependency
 */
export interface StageDependency {
    stageId: string;
    dependsOn: string[];
    condition?: 'all_success' | 'any_success' | 'custom';
}
/**
 * Approval gate
 */
export interface ApprovalGate {
    stageId: string;
    required: boolean;
    approvers: string[];
    timeout: number;
    autoApproveConditions?: Record<string, any>;
}
export declare class AutomatedResponseOrchestrationService {
    private readonly soarConfig;
    private readonly retryPolicy;
    private readonly logger;
    constructor(soarConfig: SOARIntegrationConfig, retryPolicy: RetryPolicy);
    /**
     * Execute end-to-end automated response orchestration
     */
    executeEndToEndResponseOrchestration(context: OrchestrationContext, playbookIds: string[]): Promise<OrchestrationResult>;
    /**
     * Orchestrate threat intelligence gathering
     */
    private orchestrateThreatIntelligenceGathering;
    /**
     * Orchestrate containment actions
     */
    private orchestrateContainmentActions;
    /**
     * Request approval gate
     */
    private requestApprovalGate;
}
/**
 * 1. Orchestrate comprehensive SOAR workflow
 */
export declare function orchestrateComprehensiveSOARWorkflow(workflowConfig: any, context: OrchestrationContext): Promise<OrchestrationResult>;
/**
 * 2. Execute automated incident response with fallback
 */
export declare function executeAutomatedIncidentResponseWithFallback(incidentId: string, primaryPlaybookId: string, fallbackPlaybookId: string, context: OrchestrationContext): Promise<OrchestrationResult>;
/**
 * 3. Coordinate multi-vendor security tool integration
 */
export declare function coordinateMultiVendorSecurityIntegration(vendors: string[], action: string, parameters: Record<string, any>): Promise<any[]>;
/**
 * 4. Execute adaptive response based on threat intelligence
 */
export declare function executeAdaptiveResponseBasedOnThreatIntel(threatData: any, context: OrchestrationContext): Promise<OrchestrationResult>;
/**
 * 5. Orchestrate parallel playbook execution
 */
export declare function orchestrateParallelPlaybookExecution(playbookIds: string[], context: OrchestrationContext): Promise<OrchestrationResult[]>;
/**
 * 6. Execute sequential response workflow with checkpoints
 */
export declare function executeSequentialResponseWithCheckpoints(stages: ResponseStage[], context: OrchestrationContext): Promise<OrchestrationResult>;
/**
 * 7. Implement automated threat hunting workflow
 */
export declare function implementAutomatedThreatHuntingWorkflow(huntingCriteria: any): Promise<any>;
/**
 * 8. Orchestrate containment and recovery workflow
 */
export declare function orchestrateContainmentAndRecoveryWorkflow(incidentId: string, context: OrchestrationContext): Promise<OrchestrationResult>;
/**
 * 9. Execute automated endpoint protection response
 */
export declare function executeAutomatedEndpointProtectionResponse(endpointId: string, threatType: string, context: OrchestrationContext): Promise<any>;
/**
 * 10. Coordinate automated network security response
 */
export declare function coordinateAutomatedNetworkSecurityResponse(ipAddresses: string[], threatType: string, context: OrchestrationContext): Promise<any>;
/**
 * 11. Execute automated account security response
 */
export declare function executeAutomatedAccountSecurityResponse(userAccounts: string[], threatType: string, context: OrchestrationContext): Promise<any>;
/**
 * 12. Implement automated compliance enforcement workflow
 */
export declare function implementAutomatedComplianceEnforcementWorkflow(complianceRules: any[]): Promise<any>;
/**
 * 13. Orchestrate automated vulnerability response
 */
export declare function orchestrateAutomatedVulnerabilityResponse(vulnerabilities: any[], context: OrchestrationContext): Promise<any>;
/**
 * 14. Execute automated forensics collection workflow
 */
export declare function executeAutomatedForensicsCollectionWorkflow(incidentId: string, targetAssets: string[]): Promise<any>;
/**
 * 15. Coordinate automated incident escalation
 */
export declare function coordinateAutomatedIncidentEscalation(incidentId: string, escalationCriteria: any, context: OrchestrationContext): Promise<any>;
/**
 * 16-45: Additional composite functions for comprehensive orchestration
 */
export declare function implementContinuousResponseMonitoring(executionId: string): Promise<any>;
export declare function orchestrateRollbackProcedure(executionId: string, rollbackStrategy: string): Promise<any>;
export declare function executeConditionalResponseLogic(conditions: any[], playbookId: string): Promise<any>;
export declare function coordinateApprovalWorkflow(workflowId: string, approvers: string[]): Promise<any>;
export declare function implementResponseVersionControl(playbookId: string, version: string): Promise<any>;
export declare function executePlaybookValidationWorkflow(playbookId: string): Promise<any>;
export declare function orchestrateMultiRegionResponse(regions: string[], playbookId: string): Promise<any>;
export declare function implementSmartResponseSelection(threatSignature: any): Promise<any>;
export declare function coordinateThirdPartyIntegrations(integrations: any[]): Promise<any>;
export declare function executeEmergencyShutdownProtocol(severity: string): Promise<any>;
export declare function implementResponseMetricsCollection(executionId: string): Promise<any>;
export declare function orchestrateAutomatedReporting(executionId: string, recipients: string[]): Promise<any>;
export declare function coordinateIncidentCommunication(incidentId: string, stakeholders: string[]): Promise<any>;
export declare function implementAutomatedEvidencePreservation(incidentId: string, evidenceIds: string[]): Promise<any>;
export declare function executePostIncidentAnalysis(incidentId: string): Promise<any>;
export declare function orchestrateRecoveryValidation(incidentId: string): Promise<any>;
export declare function implementLessonsLearnedCapture(executionId: string): Promise<any>;
export declare function coordinatePlaybookOptimization(playbookId: string, metrics: any): Promise<any>;
export declare function executeAutomatedTuning(workflowId: string): Promise<any>;
export declare function implementResponseOrchestrationDashboard(executionIds: string[]): Promise<any>;
/**
 * Export service for NestJS module registration
 */
export declare const AutomatedResponseOrchestrationProvider: {
    provide: typeof AutomatedResponseOrchestrationService;
    useClass: typeof AutomatedResponseOrchestrationService;
};
//# sourceMappingURL=automated-response-orchestration-composite.d.ts.map