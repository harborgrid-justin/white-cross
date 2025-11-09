/**
 * LOC: S1A2N3C4T5
 * File: /reuse/san/san-api-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - SAN Volume Controllers
 *   - SAN LUN Controllers
 *   - SAN Snapshot Controllers
 *   - SAN Replication Controllers
 */
/**
 * SAN Volume types
 */
export declare enum VolumeType {
    THICK = "THICK",
    THIN = "THIN",
    DEDUP = "DEDUP",
    COMPRESSED = "COMPRESSED"
}
/**
 * Volume status enumeration
 */
export declare enum VolumeStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    DEGRADED = "DEGRADED",
    FAILED = "FAILED",
    CREATING = "CREATING",
    DELETING = "DELETING",
    MIGRATING = "MIGRATING"
}
/**
 * LUN protocol types
 */
export declare enum LunProtocol {
    ISCSI = "ISCSI",
    FC = "FC",
    FCOE = "FCOE",
    NVME = "NVME"
}
/**
 * Snapshot status
 */
export declare enum SnapshotStatus {
    ACTIVE = "ACTIVE",
    CREATING = "CREATING",
    DELETING = "DELETING",
    FAILED = "FAILED"
}
/**
 * Replication status
 */
export declare enum ReplicationStatus {
    SYNCING = "SYNCING",
    SYNCHRONIZED = "SYNCHRONIZED",
    PAUSED = "PAUSED",
    FAILED = "FAILED",
    INITIALIZING = "INITIALIZING"
}
/**
 * Replication mode
 */
export declare enum ReplicationMode {
    SYNCHRONOUS = "SYNCHRONOUS",
    ASYNCHRONOUS = "ASYNCHRONOUS",
    SEMI_SYNCHRONOUS = "SEMI_SYNCHRONOUS"
}
/**
 * Storage tier for tiered storage
 */
export declare enum StorageTier {
    TIER_0 = "TIER_0",// NVMe/Flash
    TIER_1 = "TIER_1",// SSD
    TIER_2 = "TIER_2",// SAS
    TIER_3 = "TIER_3"
}
/**
 * RAID level configuration
 */
export declare enum RaidLevel {
    RAID_0 = "RAID_0",
    RAID_1 = "RAID_1",
    RAID_5 = "RAID_5",
    RAID_6 = "RAID_6",
    RAID_10 = "RAID_10",
    RAID_50 = "RAID_50"
}
/**
 * Base SAN audit metadata
 */
export declare class SanAuditMetadata {
    userId?: string;
    organizationId?: string;
    requestId?: string;
    ipAddress?: string;
    reason?: string;
}
/**
 * Create Volume DTO
 */
export declare class CreateVolumeDto extends SanAuditMetadata {
    name: string;
    sizeGB: number;
    type: VolumeType;
    tier?: StorageTier;
    raidLevel?: RaidLevel;
    encrypted?: boolean;
    compressed?: boolean;
    deduplication?: boolean;
    description?: string;
    tags?: Record<string, string>;
}
/**
 * Update Volume DTO
 */
export declare class UpdateVolumeDto {
    name?: string;
    sizeGB?: number;
    description?: string;
    tags?: Record<string, string>;
    tier?: StorageTier;
}
/**
 * Create LUN DTO
 */
export declare class CreateLunDto extends SanAuditMetadata {
    name: string;
    volumeId: string;
    sizeGB: number;
    protocol: LunProtocol;
    lunId?: number;
    hostGroups: string[];
    writeCache?: boolean;
    readCache?: boolean;
    description?: string;
}
/**
 * Update LUN DTO
 */
export declare class UpdateLunDto {
    name?: string;
    sizeGB?: number;
    hostGroups?: string[];
    writeCache?: boolean;
    readCache?: boolean;
    description?: string;
}
/**
 * Create Snapshot DTO
 */
export declare class CreateSnapshotDto extends SanAuditMetadata {
    name: string;
    sourceId: string;
    sourceType: 'volume' | 'lun';
    description?: string;
    retentionDays?: number;
    tags?: Record<string, string>;
}
/**
 * Create Replication DTO
 */
export declare class CreateReplicationDto extends SanAuditMetadata {
    name: string;
    sourceVolumeId: string;
    targetVolumeId: string;
    mode: ReplicationMode;
    targetArrayId: string;
    syncIntervalMinutes?: number;
    compressionEnabled?: boolean;
    description?: string;
}
/**
 * Volume query/filter DTO
 */
export declare class VolumeQueryDto {
    page?: number;
    limit?: number;
    status?: VolumeStatus;
    type?: VolumeType;
    tier?: StorageTier;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Performance metrics query DTO
 */
export declare class PerformanceQueryDto {
    startTime?: string;
    endTime?: string;
    intervalSeconds?: number;
    metrics?: string[];
}
/**
 * Volume response DTO
 */
export declare class VolumeResponseDto {
    id: string;
    name: string;
    sizeGB: number;
    usedGB: number;
    type: VolumeType;
    status: VolumeStatus;
    tier: StorageTier;
    raidLevel: RaidLevel;
    encrypted: boolean;
    compressed: boolean;
    deduplication: boolean;
    description?: string;
    tags?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
}
/**
 * LUN response DTO
 */
export declare class LunResponseDto {
    id: string;
    name: string;
    lunId: number;
    volumeId: string;
    sizeGB: number;
    protocol: LunProtocol;
    status: string;
    hostGroups: string[];
    writeCache: boolean;
    readCache: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Snapshot response DTO
 */
export declare class SnapshotResponseDto {
    id: string;
    name: string;
    sourceId: string;
    sourceType: 'volume' | 'lun';
    sizeGB: number;
    status: SnapshotStatus;
    retentionDays: number;
    expiresAt: Date;
    description?: string;
    tags?: Record<string, string>;
    createdAt: Date;
    createdBy?: string;
}
/**
 * Replication response DTO
 */
export declare class ReplicationResponseDto {
    id: string;
    name: string;
    sourceVolumeId: string;
    targetVolumeId: string;
    targetArrayId: string;
    mode: ReplicationMode;
    status: ReplicationStatus;
    syncIntervalMinutes?: number;
    compressionEnabled: boolean;
    lastSyncAt?: Date;
    nextSyncAt?: Date;
    bytesTransferred: number;
    syncProgress: number;
    description?: string;
    createdAt: Date;
}
/**
 * Paginated response wrapper
 */
export declare class PaginatedResponseDto<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
/**
 * Performance metrics response DTO
 */
export declare class PerformanceMetricsDto {
    resourceId: string;
    resourceType: string;
    timestamp: Date;
    iopsRead: number;
    iopsWrite: number;
    throughputReadMBps: number;
    throughputWriteMBps: number;
    latencyReadMs: number;
    latencyWriteMs: number;
    queueDepth: number;
    cpuUtilization: number;
}
/**
 * Capacity report DTO
 */
export declare class CapacityReportDto {
    totalCapacityGB: number;
    usedCapacityGB: number;
    availableCapacityGB: number;
    utilizationPercent: number;
    projectedDaysUntilFull: number;
    capacityByTier: Record<StorageTier, {
        total: number;
        used: number;
        available: number;
    }>;
    capacityByType: Record<VolumeType, {
        total: number;
        used: number;
        available: number;
    }>;
}
/**
 * Extracts SAN audit context from request
 */
export declare const SanAuditContext: any;
/**
 * Extracts storage array ID from headers
 */
export declare const StorageArrayId: any;
/**
 * Decorator for SAN controller endpoints with audit logging
 */
export declare function SanApiOperation(summary: string, description?: string): MethodDecorator;
/**
 * Decorator for volume management endpoints
 */
export declare function VolumeEndpoint(summary: string): MethodDecorator;
/**
 * Decorator for LUN management endpoints
 */
export declare function LunEndpoint(summary: string): MethodDecorator;
/**
 * Decorator for snapshot management endpoints
 */
export declare function SnapshotEndpoint(summary: string): MethodDecorator;
/**
 * Decorator for replication management endpoints
 */
export declare function ReplicationEndpoint(summary: string): MethodDecorator;
/**
 * 1. Creates paginated response for SAN resources
 */
export declare function createSanPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponseDto<T>;
/**
 * 2. Validates volume creation parameters
 */
export declare function validateVolumeCreation(dto: CreateVolumeDto): void;
/**
 * 3. Validates volume expansion request
 */
export declare function validateVolumeExpansion(currentSizeGB: number, newSizeGB: number, maxSizeGB?: number): void;
/**
 * 4. Validates LUN creation parameters
 */
export declare function validateLunCreation(dto: CreateLunDto): void;
/**
 * 5. Validates LUN mapping to host groups
 */
export declare function validateLunMapping(hostGroups: string[], availableGroups: string[]): void;
/**
 * 6. Validates snapshot creation parameters
 */
export declare function validateSnapshotCreation(dto: CreateSnapshotDto): void;
/**
 * 7. Calculates snapshot expiration date
 */
export declare function calculateSnapshotExpiration(createdAt: Date, retentionDays: number): Date;
/**
 * 8. Validates replication configuration
 */
export declare function validateReplicationConfig(dto: CreateReplicationDto): void;
/**
 * 9. Calculates replication next sync time
 */
export declare function calculateNextSyncTime(lastSyncAt: Date, intervalMinutes: number): Date;
/**
 * 10. Validates storage tier migration
 */
export declare function validateTierMigration(currentTier: StorageTier, targetTier: StorageTier, volumeType: VolumeType): void;
/**
 * 11. Calculates volume utilization percentage
 */
export declare function calculateVolumeUtilization(usedGB: number, totalGB: number): number;
/**
 * 12. Generates volume health status
 */
export declare function determineVolumeHealth(status: VolumeStatus, utilizationPercent: number, performanceMetrics?: PerformanceMetricsDto): 'healthy' | 'warning' | 'critical' | 'failed';
/**
 * 13. Validates performance metrics query
 */
export declare function validatePerformanceQuery(dto: PerformanceQueryDto): void;
/**
 * 14. Calculates average performance metrics
 */
export declare function calculateAverageMetrics(metrics: PerformanceMetricsDto[]): PerformanceMetricsDto | null;
/**
 * 15. Generates capacity forecast
 */
export declare function generateCapacityForecast(currentUsedGB: number, totalGB: number, dailyGrowthGB: number): number;
/**
 * 16. Validates RAID level for volume size
 */
export declare function validateRaidForVolumeSize(raidLevel: RaidLevel, sizeGB: number, diskCount: number): void;
/**
 * 17. Calculates RAID usable capacity
 */
export declare function calculateRaidUsableCapacity(raidLevel: RaidLevel, diskSizeGB: number, diskCount: number): number;
/**
 * 18. Validates snapshot restore operation
 */
export declare function validateSnapshotRestore(snapshotStatus: SnapshotStatus, targetVolumeStatus: VolumeStatus): void;
/**
 * 19. Calculates snapshot space savings
 */
export declare function calculateSnapshotSavings(originalSizeGB: number, actualSizeGB: number): {
    savingsGB: number;
    savingsPercent: number;
};
/**
 * 20. Validates volume deletion
 */
export declare function validateVolumeDeletion(volumeStatus: VolumeStatus, hasSnapshots: boolean, hasLuns: boolean, hasReplications: boolean): void;
/**
 * 21. Generates SAN audit log entry
 */
export declare function createSanAuditLog(operation: string, resourceType: 'volume' | 'lun' | 'snapshot' | 'replication', resourceId: string, metadata: SanAuditMetadata, success: boolean, errorMessage?: string): {
    operation: string;
    resourceType: string;
    resourceId: string;
    userId: string;
    organizationId?: string;
    requestId: string;
    ipAddress: string;
    success: boolean;
    errorMessage?: string;
    timestamp: Date;
};
/**
 * 22. Validates storage array connectivity
 */
export declare function validateStorageArrayConnection(arrayId: string, availableArrays: string[]): void;
/**
 * 23. Calculates replication bandwidth requirements
 */
export declare function calculateReplicationBandwidth(volumeSizeGB: number, changeRatePercent: number, syncIntervalMinutes: number): {
    requiredMBps: number;
    dailyDataGB: number;
};
/**
 * 24. Validates thin provisioning over-commitment
 */
export declare function validateThinProvisioningRatio(totalProvisionedGB: number, totalPhysicalGB: number, maxRatio?: number): void;
/**
 * 25. Generates storage efficiency report
 */
export declare function generateEfficiencyReport(totalPhysicalGB: number, totalUsedGB: number, deduplicationSavingsGB: number, compressionSavingsGB: number): {
    physicalUsage: number;
    logicalUsage: number;
    deduplicationRatio: number;
    compressionRatio: number;
    overallEfficiency: number;
};
/**
 * 26. Validates QoS (Quality of Service) settings
 */
export declare function validateQoSSettings(minIOPS: number, maxIOPS: number, minThroughputMBps: number, maxThroughputMBps: number): void;
/**
 * 27. Generates volume clone validation
 */
export declare function validateVolumeClone(sourceVolumeId: string, sourceStatus: VolumeStatus, targetName: string, existingVolumeNames: string[]): void;
/**
 * 28. Calculates optimal snapshot schedule
 */
export declare function calculateSnapshotSchedule(changeRateGB: number, availableSnapshotSpaceGB: number, retentionDays: number): {
    intervalHours: number;
    maxSnapshots: number;
};
/**
 * 29. Validates multipath configuration
 */
export declare function validateMultipathConfig(pathCount: number, protocol: LunProtocol): void;
/**
 * 30. Generates disaster recovery readiness score
 */
export declare function calculateDRReadiness(hasReplication: boolean, replicationStatus: ReplicationStatus, snapshotCount: number, lastBackupAge: number): {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
};
/**
 * 31. Validates storage migration plan
 */
export declare function validateMigrationPlan(sourceVolumeSize: number, targetArrayCapacity: number, estimatedMigrationHours: number, allowedDowntime: number): void;
/**
 * 32. Calculates storage TCO (Total Cost of Ownership)
 */
export declare function calculateStorageTCO(capacityGB: number, tier: StorageTier, years: number): {
    hardwareCost: number;
    maintenanceCost: number;
    powerCost: number;
    totalCost: number;
    costPerGBPerYear: number;
};
/**
 * 33. Validates storage array firmware version
 */
export declare function validateFirmwareVersion(currentVersion: string, minimumVersion: string, operation: string): void;
/**
 * 34. Generates storage health check report
 */
export declare function generateHealthCheckReport(volumes: Array<{
    id: string;
    status: VolumeStatus;
    utilization: number;
}>, performanceIssues: number, capacityWarnings: number, failedComponents: number): {
    overallHealth: 'healthy' | 'degraded' | 'critical';
    volumeHealth: number;
    performanceHealth: number;
    capacityHealth: number;
    recommendations: string[];
};
/**
 * 35. Validates and sanitizes volume name
 */
export declare function sanitizeVolumeName(name: string, maxLength?: number): string;
declare const _default: {
    VolumeType: typeof VolumeType;
    VolumeStatus: typeof VolumeStatus;
    LunProtocol: typeof LunProtocol;
    SnapshotStatus: typeof SnapshotStatus;
    ReplicationStatus: typeof ReplicationStatus;
    ReplicationMode: typeof ReplicationMode;
    StorageTier: typeof StorageTier;
    RaidLevel: typeof RaidLevel;
    CreateVolumeDto: typeof CreateVolumeDto;
    UpdateVolumeDto: typeof UpdateVolumeDto;
    CreateLunDto: typeof CreateLunDto;
    UpdateLunDto: typeof UpdateLunDto;
    CreateSnapshotDto: typeof CreateSnapshotDto;
    CreateReplicationDto: typeof CreateReplicationDto;
    VolumeQueryDto: typeof VolumeQueryDto;
    PerformanceQueryDto: typeof PerformanceQueryDto;
    VolumeResponseDto: typeof VolumeResponseDto;
    LunResponseDto: typeof LunResponseDto;
    SnapshotResponseDto: typeof SnapshotResponseDto;
    ReplicationResponseDto: typeof ReplicationResponseDto;
    PaginatedResponseDto: typeof PaginatedResponseDto;
    PerformanceMetricsDto: typeof PerformanceMetricsDto;
    CapacityReportDto: typeof CapacityReportDto;
    SanAuditContext: any;
    StorageArrayId: any;
    VolumeEndpoint: typeof VolumeEndpoint;
    LunEndpoint: typeof LunEndpoint;
    SnapshotEndpoint: typeof SnapshotEndpoint;
    ReplicationEndpoint: typeof ReplicationEndpoint;
    SanApiOperation: typeof SanApiOperation;
    createSanPaginatedResponse: typeof createSanPaginatedResponse;
    validateVolumeCreation: typeof validateVolumeCreation;
    validateVolumeExpansion: typeof validateVolumeExpansion;
    validateLunCreation: typeof validateLunCreation;
    validateLunMapping: typeof validateLunMapping;
    validateSnapshotCreation: typeof validateSnapshotCreation;
    calculateSnapshotExpiration: typeof calculateSnapshotExpiration;
    validateReplicationConfig: typeof validateReplicationConfig;
    calculateNextSyncTime: typeof calculateNextSyncTime;
    validateTierMigration: typeof validateTierMigration;
    calculateVolumeUtilization: typeof calculateVolumeUtilization;
    determineVolumeHealth: typeof determineVolumeHealth;
    validatePerformanceQuery: typeof validatePerformanceQuery;
    calculateAverageMetrics: typeof calculateAverageMetrics;
    generateCapacityForecast: typeof generateCapacityForecast;
    validateRaidForVolumeSize: typeof validateRaidForVolumeSize;
    calculateRaidUsableCapacity: typeof calculateRaidUsableCapacity;
    validateSnapshotRestore: typeof validateSnapshotRestore;
    calculateSnapshotSavings: typeof calculateSnapshotSavings;
    validateVolumeDeletion: typeof validateVolumeDeletion;
    createSanAuditLog: typeof createSanAuditLog;
    validateStorageArrayConnection: typeof validateStorageArrayConnection;
    calculateReplicationBandwidth: typeof calculateReplicationBandwidth;
    validateThinProvisioningRatio: typeof validateThinProvisioningRatio;
    generateEfficiencyReport: typeof generateEfficiencyReport;
    validateQoSSettings: typeof validateQoSSettings;
    validateVolumeClone: typeof validateVolumeClone;
    calculateSnapshotSchedule: typeof calculateSnapshotSchedule;
    validateMultipathConfig: typeof validateMultipathConfig;
    calculateDRReadiness: typeof calculateDRReadiness;
    validateMigrationPlan: typeof validateMigrationPlan;
    calculateStorageTCO: typeof calculateStorageTCO;
    validateFirmwareVersion: typeof validateFirmwareVersion;
    generateHealthCheckReport: typeof generateHealthCheckReport;
    sanitizeVolumeName: typeof sanitizeVolumeName;
};
export default _default;
//# sourceMappingURL=san-api-controllers-kit.d.ts.map