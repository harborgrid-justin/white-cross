/**
 * SAN Migration Orchestration Kit
 *
 * Comprehensive toolkit for orchestrating Storage Area Network (SAN) migrations
 * with zero-downtime support, automated cutover, and rollback capabilities.
 *
 * Features:
 * - Live and staged migration orchestration
 * - Automated cutover strategies
 * - Data consistency verification
 * - Performance optimization
 * - Rollback and recovery
 * - Migration validation and testing
 *
 * @module san-migration-orchestration-kit
 */
/**
 * Migration strategy type
 */
export declare enum MigrationStrategy {
    LIVE = "live",
    STAGED = "staged",
    HYBRID = "hybrid",
    SNAPSHOT_BASED = "snapshot_based",
    REPLICATION_BASED = "replication_based"
}
/**
 * Migration phase enumeration
 */
export declare enum MigrationPhase {
    PLANNING = "planning",
    VALIDATION = "validation",
    PREPARATION = "preparation",
    INITIAL_SYNC = "initial_sync",
    DELTA_SYNC = "delta_sync",
    PRE_CUTOVER = "pre_cutover",
    CUTOVER = "cutover",
    POST_CUTOVER = "post_cutover",
    VERIFICATION = "verification",
    CLEANUP = "cleanup",
    COMPLETED = "completed",
    FAILED = "failed",
    ROLLED_BACK = "rolled_back"
}
/**
 * Cutover strategy type
 */
export declare enum CutoverStrategy {
    IMMEDIATE = "immediate",
    SCHEDULED = "scheduled",
    MAINTENANCE_WINDOW = "maintenance_window",
    ROLLING = "rolling",
    BLUE_GREEN = "blue_green",
    CANARY = "canary"
}
/**
 * Migration priority level
 */
export declare enum MigrationPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Data consistency check type
 */
export declare enum ConsistencyCheckType {
    CHECKSUM = "checksum",
    BLOCK_LEVEL = "block_level",
    FILE_LEVEL = "file_level",
    METADATA = "metadata",
    FULL = "full"
}
/**
 * Storage volume information
 */
export interface StorageVolume {
    id: string;
    name: string;
    sanId: string;
    lunId: string;
    sizeBytes: number;
    usedBytes: number;
    blockSize: number;
    filesystem?: string;
    mountPoint?: string;
    hostConnections: string[];
    iops: number;
    throughputMbps: number;
    metadata: Record<string, any>;
}
/**
 * Migration source configuration
 */
export interface MigrationSource {
    sanId: string;
    sanType: string;
    volumes: StorageVolume[];
    connectionString: string;
    credentials: {
        username: string;
        password?: string;
        apiKey?: string;
    };
    capabilities: string[];
    performance: {
        maxIops: number;
        maxThroughputMbps: number;
    };
}
/**
 * Migration destination configuration
 */
export interface MigrationDestination {
    sanId: string;
    sanType: string;
    targetPath: string;
    connectionString: string;
    credentials: {
        username: string;
        password?: string;
        apiKey?: string;
    };
    capabilities: string[];
    performance: {
        maxIops: number;
        maxThroughputMbps: number;
    };
    storagePool?: string;
}
/**
 * Migration configuration
 */
export interface MigrationConfig {
    strategy: MigrationStrategy;
    cutoverStrategy: CutoverStrategy;
    priority: MigrationPriority;
    maxParallelTransfers: number;
    blockSize: number;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    verifyAfterTransfer: boolean;
    retryAttempts: number;
    retryDelayMs: number;
    bandwidthLimitMbps?: number;
    scheduledCutoverTime?: Date;
    maintenanceWindow?: {
        start: Date;
        end: Date;
    };
    rollbackEnabled: boolean;
    snapshotBeforeCutover: boolean;
}
/**
 * Migration phase configuration
 */
export interface PhaseConfig {
    phase: MigrationPhase;
    enabled: boolean;
    timeout: number;
    retryOnFailure: boolean;
    validationRequired: boolean;
    rollbackOnFailure: boolean;
    prerequisites: MigrationPhase[];
    estimatedDuration: number;
}
/**
 * Migration progress information
 */
export interface MigrationProgress {
    totalBytes: number;
    transferredBytes: number;
    remainingBytes: number;
    transferredBlocks: number;
    totalBlocks: number;
    currentPhase: MigrationPhase;
    percentComplete: number;
    throughputMbps: number;
    currentIops: number;
    estimatedCompletionTime: Date;
    startTime: Date;
    elapsedTimeMs: number;
}
/**
 * Migration validation result
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    checkType: ConsistencyCheckType;
    checksumMatch?: boolean;
    blocksMismatch?: number[];
    metadataIssues?: string[];
    validatedAt: Date;
}
/**
 * Rollback configuration
 */
export interface RollbackConfig {
    enabled: boolean;
    automaticTriggers: string[];
    preserveSnapshots: boolean;
    maxRollbackTime: number;
    notifyOnRollback: boolean;
    rollbackToPhase?: MigrationPhase;
}
/**
 * Cutover execution plan
 */
export interface CutoverPlan {
    strategy: CutoverStrategy;
    scheduledTime?: Date;
    prerequisites: string[];
    steps: CutoverStep[];
    rollbackPlan: RollbackConfig;
    estimatedDowntime: number;
    impactedSystems: string[];
    notificationTargets: string[];
}
/**
 * Individual cutover step
 */
export interface CutoverStep {
    id: string;
    name: string;
    description: string;
    order: number;
    estimatedDuration: number;
    action: () => Promise<void>;
    validation: () => Promise<boolean>;
    rollback: () => Promise<void>;
    dependencies: string[];
}
/**
 * Migration performance metrics
 */
export interface PerformanceMetrics {
    averageThroughputMbps: number;
    peakThroughputMbps: number;
    averageIops: number;
    peakIops: number;
    latencyMs: {
        min: number;
        max: number;
        avg: number;
        p95: number;
        p99: number;
    };
    errorRate: number;
    retryCount: number;
    networkUtilization: number;
    cpuUtilization: number;
    memoryUtilization: number;
}
/**
 * Complete migration plan
 */
export interface MigrationPlan {
    id: string;
    name: string;
    description: string;
    source: MigrationSource;
    destination: MigrationDestination;
    config: MigrationConfig;
    phases: PhaseConfig[];
    cutoverPlan: CutoverPlan;
    rollbackConfig: RollbackConfig;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    status: MigrationPhase;
    progress?: MigrationProgress;
    metrics?: PerformanceMetrics;
    validationResults: ValidationResult[];
}
/**
 * Migration snapshot
 */
export interface MigrationSnapshot {
    id: string;
    migrationId: string;
    phase: MigrationPhase;
    timestamp: Date;
    volumeSnapshots: VolumeSnapshot[];
    metadata: Record<string, any>;
}
/**
 * Volume snapshot information
 */
export interface VolumeSnapshot {
    volumeId: string;
    snapshotId: string;
    sizeBytes: number;
    checksum: string;
    timestamp: Date;
    retentionDays: number;
}
/**
 * Migration event
 */
export interface MigrationEvent {
    id: string;
    migrationId: string;
    timestamp: Date;
    phase: MigrationPhase;
    eventType: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    metadata?: Record<string, any>;
}
/**
 * Consistency verification result
 */
export interface ConsistencyReport {
    migrationId: string;
    verificationType: ConsistencyCheckType;
    totalBlocks: number;
    verifiedBlocks: number;
    mismatchedBlocks: number;
    mismatchDetails: BlockMismatch[];
    checksumSource: string;
    checksumDestination: string;
    isConsistent: boolean;
    verifiedAt: Date;
    duration: number;
}
/**
 * Block mismatch information
 */
export interface BlockMismatch {
    blockNumber: number;
    offset: number;
    sizeBytes: number;
    sourceChecksum: string;
    destinationChecksum: string;
}
/**
 * Creates a new migration plan
 */
export declare function createMigrationPlan(name: string, description: string, source: MigrationSource, destination: MigrationDestination, config: MigrationConfig, createdBy: string): MigrationPlan;
/**
 * Validates a migration plan for feasibility
 */
export declare function validateMigrationPlan(plan: MigrationPlan): ValidationResult;
/**
 * Estimates migration duration based on plan parameters
 */
export declare function estimateMigrationDuration(plan: MigrationPlan): number;
/**
 * Optimizes migration plan for performance
 */
export declare function optimizeMigrationPlan(plan: MigrationPlan): MigrationPlan;
/**
 * Generates migration phases based on strategy
 */
export declare function generateDefaultPhases(strategy: MigrationStrategy): PhaseConfig[];
/**
 * Initializes live migration with continuous replication
 */
export declare function initializeLiveMigration(plan: MigrationPlan): Promise<{
    sessionId: string;
    replicationEnabled: boolean;
}>;
/**
 * Performs initial full sync for live migration
 */
export declare function performInitialSync(plan: MigrationPlan, sessionId: string): Promise<MigrationProgress>;
/**
 * Synchronizes delta changes during live migration
 */
export declare function synchronizeDeltaChanges(plan: MigrationPlan, sessionId: string): Promise<{
    changesSynced: number;
    bytesTransferred: number;
}>;
/**
 * Monitors replication lag for live migration
 */
export declare function monitorReplicationLag(sessionId: string): {
    lagSeconds: number;
    lagBytes: number;
    isAcceptable: boolean;
};
/**
 * Pauses live replication temporarily
 */
export declare function pauseLiveReplication(sessionId: string): Promise<void>;
/**
 * Resumes paused live replication
 */
export declare function resumeLiveReplication(sessionId: string): Promise<void>;
/**
 * Creates migration stages for large-scale migration
 */
export declare function createMigrationStages(plan: MigrationPlan, maxStageSize: number): Array<{
    stageId: string;
    volumes: StorageVolume[];
    priority: number;
}>;
/**
 * Executes a single migration stage
 */
export declare function executeMigrationStage(stage: {
    stageId: string;
    volumes: StorageVolume[];
    priority: number;
}, destination: MigrationDestination, config: MigrationConfig): Promise<{
    success: boolean;
    transferredBytes: number;
    duration: number;
}>;
/**
 * Coordinates multi-stage migration execution
 */
export declare function executeMultiStageMigration(plan: MigrationPlan, stages: Array<{
    stageId: string;
    volumes: StorageVolume[];
    priority: number;
}>): Promise<{
    completedStages: number;
    totalBytes: number;
    success: boolean;
}>;
/**
 * Generates automated cutover plan
 */
export declare function generateCutoverPlan(strategy: CutoverStrategy): CutoverPlan;
/**
 * Validates cutover prerequisites
 */
export declare function validateCutoverPrerequisites(plan: MigrationPlan): Promise<ValidationResult>;
/**
 * Executes automated cutover process
 */
export declare function executeAutomatedCutover(plan: MigrationPlan): Promise<{
    success: boolean;
    downtimeMs: number;
    steps: number;
}>;
/**
 * Performs blue-green cutover
 */
export declare function performBlueGreenCutover(plan: MigrationPlan): Promise<{
    success: boolean;
    switchTime: number;
}>;
/**
 * Performs canary cutover with gradual traffic shift
 */
export declare function performCanaryCutover(plan: MigrationPlan, canaryPercentage: number[]): Promise<{
    success: boolean;
    phases: number;
}>;
/**
 * Performs comprehensive data consistency check
 */
export declare function verifyDataConsistency(plan: MigrationPlan, checkType: ConsistencyCheckType): Promise<ConsistencyReport>;
/**
 * Validates migration completion
 */
export declare function validateMigrationCompletion(plan: MigrationPlan): Promise<ValidationResult>;
/**
 * Verifies application connectivity to new storage
 */
export declare function verifyApplicationConnectivity(destination: MigrationDestination): Promise<boolean>;
/**
 * Validates performance meets migration requirements
 */
export declare function verifyPerformanceRequirements(plan: MigrationPlan): Promise<{
    meetsRequirements: boolean;
    details: string;
}>;
/**
 * Executes migration rollback to previous state
 */
export declare function executeRollback(plan: MigrationPlan, rollbackToPhase: MigrationPhase): Promise<{
    success: boolean;
    restoredPhase: MigrationPhase;
}>;
/**
 * Creates rollback snapshot at current phase
 */
export declare function createRollbackSnapshot(plan: MigrationPlan, phase: MigrationPhase): Promise<MigrationSnapshot>;
/**
 * Tests rollback procedure without executing
 */
export declare function testRollbackProcedure(plan: MigrationPlan): Promise<ValidationResult>;
/**
 * Optimizes transfer performance dynamically
 */
export declare function optimizeTransferPerformance(plan: MigrationPlan, currentMetrics: PerformanceMetrics): Promise<MigrationConfig>;
/**
 * Implements adaptive bandwidth throttling
 */
export declare function implementAdaptiveBandwidth(currentThroughput: number, targetThroughput: number, networkUtilization: number): number;
/**
 * Optimizes I/O operations for migration
 */
export declare function optimizeIOOperations(volume: StorageVolume, config: MigrationConfig): Promise<{
    optimalQueueDepth: number;
    optimalBlockSize: number;
}>;
/**
 * Monitors and adjusts migration performance
 */
export declare function monitorAndAdjustPerformance(plan: MigrationPlan, sessionId: string): Promise<PerformanceMetrics>;
/**
 * Generates comprehensive migration progress report
 */
export declare function generateProgressReport(plan: MigrationPlan): {
    summary: string;
    progress: MigrationProgress;
    metrics: PerformanceMetrics;
    issues: string[];
};
/**
 * Tracks migration events for audit trail
 */
export declare function logMigrationEvent(migrationId: string, phase: MigrationPhase, eventType: string, severity: 'info' | 'warning' | 'error' | 'critical', message: string, metadata?: Record<string, any>): Promise<MigrationEvent>;
/**
 * Generates migration completion summary
 */
export declare function generateCompletionSummary(plan: MigrationPlan): {
    totalDuration: number;
    totalBytesTransferred: number;
    averageThroughput: number;
    downtime: number;
    issuesEncountered: number;
};
//# sourceMappingURL=san-migration-orchestration-kit.d.ts.map