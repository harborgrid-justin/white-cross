/**
 * LOC: REMEDIAUTOM001
 * File: /reuse/threat/composites/remediation-automation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../remediation-tracking-kit
 *   - ../incident-containment-kit
 *   - ../automated-threat-response-kit
 *   - ../response-automation-kit
 *   - ../threat-intelligence-orchestration-kit
 *   - ../threat-intelligence-automation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Remediation automation services
 *   - Recovery orchestration engines
 *   - Patch management systems
 *   - Configuration management services
 *   - System recovery coordinators
 */
/**
 * Remediation automation context
 */
export interface RemediationContext {
    remediationId: string;
    incidentId?: string;
    remediationType: 'patch' | 'configuration' | 'containment' | 'recovery' | 'prevention';
    priority: 'critical' | 'high' | 'medium' | 'low';
    affectedSystems: string[];
    targetCompletionDate?: Date;
    businessImpactLevel: 'high' | 'medium' | 'low';
    maintenanceWindow?: MaintenanceWindow;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    metadata?: Record<string, any>;
}
/**
 * Maintenance window configuration
 */
export interface MaintenanceWindow {
    id: string;
    startTime: Date;
    endTime: Date;
    allowedOperations: string[];
    notificationRecipients: string[];
    rollbackWindow: number;
}
/**
 * Recovery plan structure
 */
export interface RecoveryPlan {
    id: string;
    incidentId: string;
    name: string;
    phases: RecoveryPhase[];
    estimatedDuration: number;
    businessContinuityPlan?: string;
    validationChecks: ValidationCheck[];
    rollbackProcedures: RollbackProcedure[];
    stakeholders: string[];
    createdAt: Date;
}
/**
 * Recovery phase
 */
export interface RecoveryPhase {
    id: string;
    name: string;
    order: number;
    type: 'preparation' | 'execution' | 'validation' | 'verification';
    tasks: RecoveryTask[];
    dependencies: string[];
    estimatedDuration: number;
    criticalPath: boolean;
}
/**
 * Recovery task
 */
export interface RecoveryTask {
    id: string;
    title: string;
    description: string;
    type: string;
    automated: boolean;
    executionScript?: string;
    validationScript?: string;
    rollbackScript?: string;
    timeout: number;
    priority: string;
}
/**
 * Validation check
 */
export interface ValidationCheck {
    id: string;
    name: string;
    type: 'functional' | 'security' | 'performance' | 'compliance';
    automated: boolean;
    checkScript?: string;
    expectedResult: any;
    criticalCheck: boolean;
}
/**
 * Rollback procedure
 */
export interface RollbackProcedure {
    id: string;
    name: string;
    condition: string;
    automated: boolean;
    steps: RollbackStep[];
    estimatedDuration: number;
}
/**
 * Rollback step
 */
export interface RollbackStep {
    order: number;
    action: string;
    parameters: Record<string, any>;
    validation?: string;
}
/**
 * Remediation result
 */
export interface RemediationResult {
    remediationId: string;
    status: 'success' | 'partial_success' | 'failed' | 'rolled_back';
    startTime: Date;
    endTime: Date;
    duration: number;
    tasksCompleted: number;
    tasksFailed: number;
    systemsRemediated: number;
    validationResults: any[];
    errors: RemediationError[];
    metrics: RemediationMetrics;
}
/**
 * Remediation error
 */
export interface RemediationError {
    system: string;
    task: string;
    timestamp: Date;
    error: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    recovered: boolean;
}
/**
 * Remediation metrics
 */
export interface RemediationMetrics {
    totalSystems: number;
    systemsRemediated: number;
    systemsFailed: number;
    averageRemediationTime: number;
    successRate: number;
    rollbacksExecuted: number;
    businessImpactReduced: boolean;
    complianceRestored: boolean;
}
export declare class RemediationAutomationService {
    private readonly config;
    private readonly maintenanceWindows;
    private readonly logger;
    constructor(config: any, maintenanceWindows: MaintenanceWindow[]);
    /**
     * Execute comprehensive automated remediation workflow
     */
    executeComprehensiveRemediationWorkflow(context: RemediationContext): Promise<RemediationResult>;
    /**
     * Create comprehensive remediation plan
     */
    private createComprehensiveRemediationPlan;
    /**
     * Generate remediation tasks
     */
    private generateRemediationTasks;
    /**
     * Capture system snapshots
     */
    private captureSystemSnapshots;
    /**
     * Request remediation approval
     */
    private requestRemediationApproval;
    /**
     * Execute remediation tasks
     */
    private executeRemediationTasks;
    /**
     * Execute patch remediation
     */
    private executePatchRemediation;
    /**
     * Execute configuration remediation
     */
    private executeConfigurationRemediation;
    /**
     * Execute containment remediation
     */
    private executeContainmentRemediation;
    /**
     * Execute recovery remediation
     */
    private executeRecoveryRemediation;
    /**
     * Validate remediation effectiveness
     */
    private validateRemediationEffectiveness;
    /**
     * Verify system recovery
     */
    private verifySystemRecovery;
    /**
     * Collect remediation metrics
     */
    private collectRemediationMetrics;
    /**
     * Execute remediation rollback
     */
    private executeRemediationRollback;
}
/**
 * 1. Execute automated patch deployment workflow
 */
export declare function executeAutomatedPatchDeploymentWorkflow(patchIds: string[], targetSystems: string[], context: RemediationContext): Promise<RemediationResult>;
/**
 * 2. Orchestrate configuration hardening campaign
 */
export declare function orchestrateConfigurationHardeningCampaign(targetSystems: string[], hardeningProfiles: string[], context: RemediationContext): Promise<RemediationResult>;
/**
 * 3. Execute automated system recovery workflow
 */
export declare function executeAutomatedSystemRecoveryWorkflow(failedSystems: string[], recoveryType: 'full' | 'partial' | 'minimal', context: RemediationContext): Promise<RemediationResult>;
/**
 * 4. Coordinate incident containment and eradication
 */
export declare function coordinateIncidentContainmentAndEradication(incidentId: string, affectedAssets: string[], context: RemediationContext): Promise<RemediationResult>;
/**
 * 5. Implement automated vulnerability remediation
 */
export declare function implementAutomatedVulnerabilityRemediation(vulnerabilities: any[], targetSystems: string[], context: RemediationContext): Promise<RemediationResult>;
/**
 * 6. Execute rollback and recovery procedure
 */
export declare function executeRollbackAndRecoveryProcedure(failedRemediationId: string, affectedSystems: string[], rollbackType: 'full' | 'partial'): Promise<RemediationResult>;
/**
 * 7. Orchestrate business continuity recovery
 */
export declare function orchestrateBusinessContinuityRecovery(businessCriticalSystems: string[], recoveryPriority: 'rto' | 'rpo' | 'balanced'): Promise<RemediationResult>;
/**
 * 8-45: Additional composite functions for comprehensive remediation automation
 */
export declare function executeZeroDowntimePatching(clusterNodes: string[], patchIds: string[]): Promise<RemediationResult>;
export declare function coordinateMultiVendorPatchManagement(vendors: string[], patchCriteria: any): Promise<any>;
export declare function implementAutomatedComplianceRemediation(complianceViolations: any[]): Promise<any>;
export declare function executeEmergencyPatchDeployment(criticalCVEs: string[], allSystems: string[]): Promise<any>;
export declare function orchestrateGracefulServiceDegradation(services: string[]): Promise<any>;
export declare function implementAutomatedFailover(primarySystem: string, backupSystem: string): Promise<any>;
export declare function coordinateDisasterRecovery(disasterType: string, affectedSites: string[]): Promise<any>;
export declare function executeAutomatedBackupVerification(backupSets: string[]): Promise<any>;
export declare function implementContinuousSecurityValidation(systems: string[]): Promise<any>;
export declare function orchestratePostRemediationTesting(testSuites: string[]): Promise<any>;
export declare function executeAutomatedRootCauseRemediation(rootCauses: any[]): Promise<any>;
export declare function coordinateRemediationCommunication(stakeholders: string[], updates: any[]): Promise<any>;
export declare function implementRemediationEffectivenessTracking(remediationId: string): Promise<any>;
export declare function orchestrateAutomatedDocumentation(remediationId: string): Promise<any>;
export declare function executeComplianceValidationWorkflow(complianceFrameworks: string[]): Promise<any>;
export declare function coordinateChangeManagementIntegration(changeTickets: string[]): Promise<any>;
export declare function implementAutomatedApprovalWorkflow(approvalRequests: any[]): Promise<any>;
export declare function orchestrateMaintenanceWindowManagement(windows: MaintenanceWindow[]): Promise<any>;
export declare function executeAutomatedImpactAssessment(proposedChanges: any[]): Promise<any>;
export declare function coordinateRemediationPrioritization(tasks: any[]): Promise<any>;
export declare function implementSmartRollbackDecisionEngine(failures: any[]): Promise<any>;
export declare function orchestrateMultiPhaseRemediation(phases: RecoveryPhase[]): Promise<any>;
export declare function executeAutomatedServiceRestoration(services: string[]): Promise<any>;
export declare function coordinateVendorEscalation(vendors: string[], issues: any[]): Promise<any>;
export declare function implementContinuousRemediationMonitoring(remediationId: string): Promise<any>;
export declare function orchestrateRemediationReporting(reportRecipients: string[]): Promise<any>;
export declare function executeAutomatedLessonsLearned(incidents: string[]): Promise<any>;
export declare function coordinateRemediationMetricsCollection(remediationIds: string[]): Promise<any>;
export declare function implementRemediationOptimization(historicalData: any[]): Promise<any>;
export declare function orchestrateRemediationDashboard(remediationIds: string[]): Promise<any>;
/**
 * Export service for NestJS module registration
 */
export declare const RemediationAutomationProvider: {
    provide: typeof RemediationAutomationService;
    useClass: typeof RemediationAutomationService;
};
//# sourceMappingURL=remediation-automation-composite.d.ts.map