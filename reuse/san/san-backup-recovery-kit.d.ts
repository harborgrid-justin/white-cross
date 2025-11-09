/**
 * SAN Backup and Recovery Kit
 *
 * Comprehensive backup and recovery operations for Storage Area Network (SAN) environments.
 * Provides 43 production-ready functions for enterprise-grade backup, recovery, and disaster recovery.
 *
 * Features:
 * - Snapshot-based backups (full, incremental, differential)
 * - Point-in-time recovery (PITR)
 * - Bare-metal recovery (BMR)
 * - Backup verification and testing
 * - RPO/RTO management and monitoring
 * - Backup scheduling and orchestration
 * - Retention policy management
 * - Deduplication and compression
 *
 * @module san-backup-recovery-kit
 * @version 1.0.0
 */
/**
 * Backup job status enum
 */
export declare enum BackupStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    VERIFYING = "VERIFYING",
    VERIFIED = "VERIFIED"
}
/**
 * Backup type classification
 */
export declare enum BackupType {
    FULL = "FULL",
    INCREMENTAL = "INCREMENTAL",
    DIFFERENTIAL = "DIFFERENTIAL",
    SNAPSHOT = "SNAPSHOT",
    SYNTHETIC_FULL = "SYNTHETIC_FULL",
    MIRROR = "MIRROR"
}
/**
 * Recovery type classification
 */
export declare enum RecoveryType {
    POINT_IN_TIME = "POINT_IN_TIME",
    BARE_METAL = "BARE_METAL",
    FILE_LEVEL = "FILE_LEVEL",
    VOLUME_LEVEL = "VOLUME_LEVEL",
    APPLICATION_CONSISTENT = "APPLICATION_CONSISTENT",
    CRASH_CONSISTENT = "CRASH_CONSISTENT"
}
/**
 * Backup priority levels
 */
export declare enum BackupPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Compression algorithm options
 */
export declare enum CompressionAlgorithm {
    NONE = "NONE",
    GZIP = "GZIP",
    LZ4 = "LZ4",
    ZSTD = "ZSTD",
    BZIP2 = "BZIP2"
}
/**
 * Backup job configuration and metadata
 */
export interface BackupJob {
    jobId: string;
    jobName: string;
    backupType: BackupType;
    status: BackupStatus;
    priority: BackupPriority;
    sourceVolumes: string[];
    targetLocation: string;
    scheduleId?: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    bytesProcessed: number;
    bytesTransferred: number;
    compressionRatio?: number;
    deduplicationRatio?: number;
    errorCount: number;
    warningCount: number;
    retryCount: number;
    maxRetries: number;
    parentJobId?: string;
    metadata: Record<string, any>;
    tags: string[];
    createdBy: string;
    lastModified: Date;
}
/**
 * Backup schedule configuration
 */
export interface BackupSchedule {
    scheduleId: string;
    scheduleName: string;
    enabled: boolean;
    backupType: BackupType;
    cronExpression: string;
    timezone: string;
    sourceVolumes: string[];
    targetLocation: string;
    retentionPolicy: RetentionPolicy;
    compressionAlgorithm: CompressionAlgorithm;
    enableDeduplication: boolean;
    enableEncryption: boolean;
    encryptionKeyId?: string;
    priority: BackupPriority;
    maxConcurrentJobs: number;
    bandwidthLimit?: number;
    verifyAfterBackup: boolean;
    notificationEmails: string[];
    preBackupScript?: string;
    postBackupScript?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Recovery point representation
 */
export interface RecoveryPoint {
    recoveryPointId: string;
    backupJobId: string;
    timestamp: Date;
    backupType: BackupType;
    recoveryType: RecoveryType;
    sourceVolumes: string[];
    dataSize: number;
    compressedSize: number;
    isConsistent: boolean;
    isVerified: boolean;
    verificationDate?: Date;
    expirationDate: Date;
    location: string;
    snapshotIds: string[];
    chainDepth: number;
    baseRecoveryPointId?: string;
    metadata: Record<string, any>;
    tags: string[];
    retentionLock: boolean;
    createdAt: Date;
}
/**
 * Retention policy configuration
 */
export interface RetentionPolicy {
    policyId: string;
    policyName: string;
    dailyRetentionDays: number;
    weeklyRetentionWeeks: number;
    monthlyRetentionMonths: number;
    yearlyRetentionYears: number;
    minimumRetentionDays: number;
    maximumRetentionDays?: number;
    retentionLock: boolean;
    archiveAfterDays?: number;
    archiveLocation?: string;
    deleteExpiredBackups: boolean;
}
/**
 * RPO (Recovery Point Objective) configuration
 */
export interface RPOConfig {
    targetRPO: number;
    currentRPO: number;
    maxAllowableDataLoss: number;
    backupFrequency: number;
    measurementWindow: number;
    alertThreshold: number;
    isCompliant: boolean;
    lastBackupTime: Date;
    nextScheduledBackup: Date;
}
/**
 * RTO (Recovery Time Objective) configuration
 */
export interface RTOConfig {
    targetRTO: number;
    estimatedRTO: number;
    maxAllowableDowntime: number;
    averageRecoveryTime: number;
    measurementWindow: number;
    alertThreshold: number;
    isCompliant: boolean;
    lastRecoveryTest: Date;
    nextScheduledTest: Date;
}
/**
 * Backup verification result
 */
export interface BackupVerification {
    verificationId: string;
    recoveryPointId: string;
    verificationTime: Date;
    verificationStatus: 'PASSED' | 'FAILED' | 'WARNING';
    checksumVerified: boolean;
    dataIntegrityVerified: boolean;
    metadataVerified: boolean;
    restorabilityTested: boolean;
    errorMessages: string[];
    warningMessages: string[];
    verificationDuration: number;
    samplingRate: number;
    verifiedBy: string;
}
/**
 * Recovery operation configuration
 */
export interface RecoveryOperation {
    operationId: string;
    operationType: RecoveryType;
    recoveryPointId: string;
    targetVolumes: string[];
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';
    startTime: Date;
    endTime?: Date;
    duration?: number;
    bytesRecovered: number;
    progressPercentage: number;
    errorMessages: string[];
    rollbackAvailable: boolean;
    verifyAfterRecover: boolean;
    overwriteExisting: boolean;
    metadata: Record<string, any>;
    initiatedBy: string;
}
/**
 * Backup statistics and metrics
 */
export interface BackupMetrics {
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
    successRate: number;
    totalDataBackedUp: number;
    totalCompressedSize: number;
    averageCompressionRatio: number;
    averageDeduplicationRatio: number;
    averageBackupDuration: number;
    totalStorageUsed: number;
    oldestRecoveryPoint: Date;
    newestRecoveryPoint: Date;
    recoveryPointCount: number;
    measurementPeriod: {
        start: Date;
        end: Date;
    };
}
/**
 * Snapshot configuration
 */
export interface SnapshotConfig {
    snapshotId: string;
    volumeId: string;
    snapshotName: string;
    description: string;
    timestamp: Date;
    size: number;
    isConsistent: boolean;
    consistencyGroup?: string;
    retentionDays: number;
    isReadOnly: boolean;
    parentSnapshotId?: string;
    metadata: Record<string, any>;
}
/**
 * Deduplication configuration
 */
export interface DeduplicationConfig {
    enabled: boolean;
    algorithm: 'FIXED_BLOCK' | 'VARIABLE_BLOCK' | 'CONTENT_DEFINED';
    blockSize: number;
    hashAlgorithm: 'SHA256' | 'SHA1' | 'MD5';
    inlineDedup: boolean;
    postProcessDedup: boolean;
    dedupRatioThreshold: number;
}
/**
 * 1. Create a SAN volume snapshot
 * Creates a point-in-time snapshot of a SAN volume
 */
export declare function createVolumeSnapshot(volumeId: string, snapshotName: string, consistent?: boolean, metadata?: Record<string, any>): Promise<SnapshotConfig>;
/**
 * 2. Create consistency group snapshot
 * Creates snapshots across multiple volumes atomically
 */
export declare function createConsistencyGroupSnapshot(volumeIds: string[], groupName: string, freezeIO?: boolean): Promise<SnapshotConfig[]>;
/**
 * 3. Clone snapshot to new volume
 * Creates a writable clone from a snapshot
 */
export declare function cloneSnapshotToVolume(snapshotId: string, targetVolumeName: string, size?: number): Promise<string>;
/**
 * 4. Delete expired snapshots
 * Removes snapshots that have exceeded their retention period
 */
export declare function deleteExpiredSnapshots(snapshots: SnapshotConfig[], currentDate?: Date): Promise<string[]>;
/**
 * 5. Validate snapshot integrity
 * Verifies snapshot is healthy and recoverable
 */
export declare function validateSnapshotIntegrity(snapshotId: string, performDeepScan?: boolean): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 6. Create incremental backup
 * Backs up only changed blocks since last backup
 */
export declare function createIncrementalBackup(volumeId: string, baseBackupJobId: string, targetLocation: string): Promise<BackupJob>;
/**
 * 7. Calculate changed blocks for incremental backup
 * Identifies blocks that have changed since last backup
 */
export declare function calculateChangedBlocks(volumeId: string, sinceTimestamp: Date, blockSize?: number): Promise<{
    changedBlocks: number[];
    totalChangedBytes: number;
}>;
/**
 * 8. Merge incremental backups into full backup
 * Creates a synthetic full backup from base + incrementals
 */
export declare function mergeIncrementalBackups(baseBackupJobId: string, incrementalBackupJobIds: string[], targetLocation: string): Promise<BackupJob>;
/**
 * 9. Optimize incremental backup chain
 * Reduces chain depth by creating new base backups
 */
export declare function optimizeBackupChain(volumeId: string, maxChainDepth?: number): Promise<{
    optimized: boolean;
    newBaseJobId?: string;
}>;
/**
 * 10. Create full backup
 * Performs a complete backup of all volume data
 */
export declare function createFullBackup(volumeIds: string[], targetLocation: string, compressionAlgorithm?: CompressionAlgorithm, enableDeduplication?: boolean): Promise<BackupJob>;
/**
 * 11. Create differential backup
 * Backs up changes since last full backup
 */
export declare function createDifferentialBackup(volumeId: string, lastFullBackupJobId: string, targetLocation: string): Promise<BackupJob>;
/**
 * 12. Parallel multi-volume backup
 * Backs up multiple volumes concurrently
 */
export declare function createParallelBackup(volumeIds: string[], targetLocation: string, maxConcurrency?: number): Promise<BackupJob[]>;
/**
 * 13. Estimate backup size and duration
 * Calculates expected backup size and time
 */
export declare function estimateBackupMetrics(volumeIds: string[], backupType: BackupType, compressionAlgorithm: CompressionAlgorithm, enableDeduplication: boolean): Promise<{
    estimatedSize: number;
    estimatedDuration: number;
}>;
/**
 * 14. Create recovery point
 * Registers a verified recovery point
 */
export declare function createRecoveryPoint(backupJobId: string, backupType: BackupType, volumeIds: string[], snapshotIds: string[], retentionDays?: number): Promise<RecoveryPoint>;
/**
 * 15. List available recovery points
 * Retrieves recovery points within a time range
 */
export declare function listRecoveryPoints(volumeIds: string[], startTime: Date, endTime: Date, onlyVerified?: boolean): Promise<RecoveryPoint[]>;
/**
 * 16. Find nearest recovery point
 * Locates the closest recovery point to a target time
 */
export declare function findNearestRecoveryPoint(volumeId: string, targetTime: Date, tolerance?: number): Promise<RecoveryPoint | null>;
/**
 * 17. Perform point-in-time recovery
 * Restores data to a specific point in time
 */
export declare function performPointInTimeRecovery(recoveryPointId: string, targetVolumeIds: string[], overwriteExisting?: boolean, verifyAfterRecover?: boolean): Promise<RecoveryOperation>;
/**
 * 18. Validate recovery point chain
 * Ensures all dependent backups in chain are available
 */
export declare function validateRecoveryPointChain(recoveryPointId: string): Promise<{
    valid: boolean;
    missingDependencies: string[];
    chainLength: number;
}>;
/**
 * 19. Create bare-metal recovery image
 * Creates a bootable recovery image including OS and system state
 */
export declare function createBareMetalRecoveryImage(hostId: string, volumeIds: string[], includeSystemState: boolean | undefined, targetLocation: string): Promise<BackupJob>;
/**
 * 20. Perform bare-metal recovery
 * Restores entire system from bare-metal recovery image
 */
export declare function performBareMetalRecovery(recoveryImageId: string, targetHostId: string, networkConfig?: Record<string, any>): Promise<RecoveryOperation>;
/**
 * 21. Create recovery boot media
 * Generates bootable media for bare-metal recovery
 */
export declare function createRecoveryBootMedia(recoveryImageId: string, mediaType: 'ISO' | 'USB' | 'PXE', outputPath: string): Promise<{
    mediaId: string;
    size: number;
    checksum: string;
}>;
/**
 * 22. Verify bare-metal recovery compatibility
 * Checks if recovery image is compatible with target hardware
 */
export declare function verifyBMRCompatibility(recoveryImageId: string, targetHardwareProfile: Record<string, any>): Promise<{
    compatible: boolean;
    warnings: string[];
    incompatibilities: string[];
}>;
/**
 * 23. Verify backup integrity
 * Validates backup data integrity using checksums
 */
export declare function verifyBackupIntegrity(backupJobId: string, samplingRate?: number): Promise<BackupVerification>;
/**
 * 24. Perform test restore
 * Tests recovery capability by performing actual restore to test environment
 */
export declare function performTestRestore(recoveryPointId: string, testEnvironmentId: string, automatedValidation?: boolean): Promise<{
    success: boolean;
    duration: number;
    validationResults: Record<string, any>;
}>;
/**
 * 25. Schedule automated backup verification
 * Configures periodic verification of backup integrity
 */
export declare function scheduleBackupVerification(scheduleId: string, cronExpression: string, verificationDepth: 'QUICK' | 'STANDARD' | 'DEEP', notifyOnFailure?: boolean): Promise<{
    scheduleId: string;
    nextRun: Date;
}>;
/**
 * 26. Compare backup with source
 * Verifies backup matches current source data
 */
export declare function compareBackupWithSource(backupJobId: string, sourceVolumeId: string, sampleSize?: number): Promise<{
    identical: boolean;
    differences: number;
    sampledBlocks: number;
}>;
/**
 * 27. Generate backup verification report
 * Creates comprehensive report of backup verification results
 */
export declare function generateVerificationReport(verificationIds: string[], format?: 'JSON' | 'PDF' | 'HTML'): Promise<{
    reportId: string;
    summary: Record<string, any>;
    details: any[];
}>;
/**
 * 28. Calculate current RPO
 * Determines actual recovery point objective based on backup frequency
 */
export declare function calculateCurrentRPO(volumeId: string, measurementWindow?: number): Promise<RPOConfig>;
/**
 * 29. Calculate current RTO
 * Determines actual recovery time objective based on restore tests
 */
export declare function calculateCurrentRTO(volumeId: string, measurementWindow?: number): Promise<RTOConfig>;
/**
 * 30. Monitor RPO compliance
 * Continuously monitors and alerts on RPO violations
 */
export declare function monitorRPOCompliance(volumeIds: string[], targetRPO: number, checkInterval?: number): Promise<{
    compliant: boolean;
    violations: Array<{
        volumeId: string;
        currentRPO: number;
    }>;
}>;
/**
 * 31. Optimize backup schedule for RPO
 * Adjusts backup frequency to meet RPO targets
 */
export declare function optimizeBackupScheduleForRPO(volumeId: string, targetRPO: number, currentSchedule: BackupSchedule): Promise<BackupSchedule>;
/**
 * 32. Create backup schedule
 * Configures automated backup schedule
 */
export declare function createBackupSchedule(scheduleName: string, volumeIds: string[], backupType: BackupType, cronExpression: string, retentionPolicy: RetentionPolicy): Promise<BackupSchedule>;
/**
 * 33. Execute scheduled backup
 * Runs a backup based on schedule configuration
 */
export declare function executeScheduledBackup(scheduleId: string, schedule: BackupSchedule): Promise<BackupJob>;
/**
 * 34. Manage backup job queue
 * Prioritizes and schedules backup jobs
 */
export declare function manageBackupQueue(jobs: BackupJob[], maxConcurrent?: number): Promise<{
    queued: BackupJob[];
    running: BackupJob[];
    completed: BackupJob[];
}>;
/**
 * 35. Implement backup throttling
 * Controls backup bandwidth and resource usage
 */
export declare function implementBackupThrottling(jobId: string, bandwidthLimitMbps: number, cpuLimitPercent: number, ioPriority: 'HIGH' | 'NORMAL' | 'LOW'): Promise<{
    throttled: boolean;
    actualBandwidth: number;
    actualCpuUsage: number;
}>;
/**
 * 36. Handle backup job retry
 * Implements intelligent retry logic for failed backups
 */
export declare function handleBackupRetry(job: BackupJob, error: Error): Promise<{
    shouldRetry: boolean;
    retryDelay: number;
    updatedJob: BackupJob;
}>;
/**
 * 37. Apply retention policy
 * Enforces retention rules on recovery points
 */
export declare function applyRetentionPolicy(recoveryPoints: RecoveryPoint[], policy: RetentionPolicy): Promise<{
    retained: RecoveryPoint[];
    expired: RecoveryPoint[];
    archived: RecoveryPoint[];
}>;
/**
 * 38. Archive old backups to cold storage
 * Moves infrequently accessed backups to lower-cost storage
 */
export declare function archiveBackupsToColdstorage(recoveryPointIds: string[], archiveLocation: string, storageClass: 'GLACIER' | 'DEEP_ARCHIVE' | 'TAPE'): Promise<{
    archived: string[];
    failed: string[];
}>;
/**
 * 39. Delete expired backups
 * Permanently removes backups that have exceeded retention
 */
export declare function deleteExpiredBackups(recoveryPointIds: string[], confirmDeletion?: boolean): Promise<{
    deleted: string[];
    failed: string[];
    skipped: string[];
}>;
/**
 * 40. Calculate backup storage usage
 * Computes total storage consumed by backups
 */
export declare function calculateBackupStorageUsage(volumeIds: string[], includeArchived?: boolean): Promise<{
    totalSize: number;
    compressedSize: number;
    deduplicatedSize: number;
    archivedSize: number;
    byBackupType: Record<BackupType, number>;
}>;
/**
 * 41. Configure deduplication settings
 * Sets up deduplication parameters for backup optimization
 */
export declare function configureDeduplication(volumeIds: string[], config: DeduplicationConfig): Promise<{
    configured: boolean;
    estimatedSavings: number;
}>;
/**
 * 42. Analyze deduplication efficiency
 * Measures actual deduplication ratios and savings
 */
export declare function analyzeDeduplicationEfficiency(backupJobIds: string[]): Promise<{
    averageDeduplicationRatio: number;
    totalDataSize: number;
    uniqueDataSize: number;
    savedSpace: number;
    byVolume: Record<string, number>;
}>;
/**
 * 43. Optimize compression for backup workload
 * Selects optimal compression algorithm based on data characteristics
 */
export declare function optimizeCompressionAlgorithm(volumeId: string, sampleSize?: number): Promise<{
    recommendedAlgorithm: CompressionAlgorithm;
    compressionRatio: number;
    compressionSpeed: number;
    decompressionSpeed: number;
    testResults: Array<{
        algorithm: CompressionAlgorithm;
        ratio: number;
        speed: number;
    }>;
}>;
/**
 * Generate comprehensive backup metrics report
 */
export declare function generateBackupMetrics(volumeIds: string[], startDate: Date, endDate: Date): Promise<BackupMetrics>;
/**
 * Export backup configuration
 */
export declare function exportBackupConfiguration(schedules: BackupSchedule[], policies: RetentionPolicy[]): string;
/**
 * Import backup configuration
 */
export declare function importBackupConfiguration(configJson: string): {
    schedules: BackupSchedule[];
    policies: RetentionPolicy[];
};
declare const _default: {
    createVolumeSnapshot: typeof createVolumeSnapshot;
    createConsistencyGroupSnapshot: typeof createConsistencyGroupSnapshot;
    cloneSnapshotToVolume: typeof cloneSnapshotToVolume;
    deleteExpiredSnapshots: typeof deleteExpiredSnapshots;
    validateSnapshotIntegrity: typeof validateSnapshotIntegrity;
    createIncrementalBackup: typeof createIncrementalBackup;
    calculateChangedBlocks: typeof calculateChangedBlocks;
    mergeIncrementalBackups: typeof mergeIncrementalBackups;
    optimizeBackupChain: typeof optimizeBackupChain;
    createFullBackup: typeof createFullBackup;
    createDifferentialBackup: typeof createDifferentialBackup;
    createParallelBackup: typeof createParallelBackup;
    estimateBackupMetrics: typeof estimateBackupMetrics;
    createRecoveryPoint: typeof createRecoveryPoint;
    listRecoveryPoints: typeof listRecoveryPoints;
    findNearestRecoveryPoint: typeof findNearestRecoveryPoint;
    performPointInTimeRecovery: typeof performPointInTimeRecovery;
    validateRecoveryPointChain: typeof validateRecoveryPointChain;
    createBareMetalRecoveryImage: typeof createBareMetalRecoveryImage;
    performBareMetalRecovery: typeof performBareMetalRecovery;
    createRecoveryBootMedia: typeof createRecoveryBootMedia;
    verifyBMRCompatibility: typeof verifyBMRCompatibility;
    verifyBackupIntegrity: typeof verifyBackupIntegrity;
    performTestRestore: typeof performTestRestore;
    scheduleBackupVerification: typeof scheduleBackupVerification;
    compareBackupWithSource: typeof compareBackupWithSource;
    generateVerificationReport: typeof generateVerificationReport;
    calculateCurrentRPO: typeof calculateCurrentRPO;
    calculateCurrentRTO: typeof calculateCurrentRTO;
    monitorRPOCompliance: typeof monitorRPOCompliance;
    optimizeBackupScheduleForRPO: typeof optimizeBackupScheduleForRPO;
    createBackupSchedule: typeof createBackupSchedule;
    executeScheduledBackup: typeof executeScheduledBackup;
    manageBackupQueue: typeof manageBackupQueue;
    implementBackupThrottling: typeof implementBackupThrottling;
    handleBackupRetry: typeof handleBackupRetry;
    applyRetentionPolicy: typeof applyRetentionPolicy;
    archiveBackupsToColdstorage: typeof archiveBackupsToColdstorage;
    deleteExpiredBackups: typeof deleteExpiredBackups;
    calculateBackupStorageUsage: typeof calculateBackupStorageUsage;
    configureDeduplication: typeof configureDeduplication;
    analyzeDeduplicationEfficiency: typeof analyzeDeduplicationEfficiency;
    optimizeCompressionAlgorithm: typeof optimizeCompressionAlgorithm;
    generateBackupMetrics: typeof generateBackupMetrics;
    exportBackupConfiguration: typeof exportBackupConfiguration;
    importBackupConfiguration: typeof importBackupConfiguration;
};
export default _default;
//# sourceMappingURL=san-backup-recovery-kit.d.ts.map