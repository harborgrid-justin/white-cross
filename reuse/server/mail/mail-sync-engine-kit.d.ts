/**
 * LOC: MAILSYNC1234567
 * File: /reuse/server/mail/mail-sync-engine-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS mail synchronization services
 *   - Multi-device sync controllers
 *   - Background sync jobs
 *   - Real-time sync processors
 *   - Conflict resolution services
 *   - Sequelize models
 */
interface SyncState {
    id: string;
    userId: string;
    deviceId: string;
    accountId: string;
    syncKey: string;
    syncToken: string;
    lastSyncTime: Date;
    nextSyncTime?: Date;
    syncStatus: 'idle' | 'syncing' | 'pending' | 'paused' | 'error';
    syncType: 'full' | 'incremental' | 'delta' | 'partial';
    folderSyncState: Record<string, FolderSyncState>;
    changeCounter: number;
    conflictCount: number;
    errorCount: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastError?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface FolderSyncState {
    folderId: string;
    folderName: string;
    syncToken: string;
    watermark: number;
    lastSyncTime: Date;
    messageCount: number;
    unreadCount: number;
    syncedMessageCount: number;
    pendingChanges: number;
    lastChangeType?: 'add' | 'modify' | 'delete';
    hasMoreChanges: boolean;
}
interface SyncOperation {
    id: string;
    userId: string;
    deviceId: string;
    accountId: string;
    syncStateId: string;
    operationType: 'fetch' | 'push' | 'delete' | 'move' | 'flag' | 'read' | 'attachment';
    resourceType: 'message' | 'folder' | 'attachment' | 'flag' | 'metadata';
    resourceId: string;
    folderId?: string;
    operation: string;
    payload?: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    retryCount: number;
    maxRetries: number;
    errorMessage?: string;
    conflictResolution?: ConflictResolution;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface SyncConflict {
    id: string;
    userId: string;
    deviceId: string;
    syncOperationId: string;
    resourceType: 'message' | 'folder' | 'attachment' | 'flag';
    resourceId: string;
    conflictType: 'concurrent_modification' | 'delete_modify' | 'version_mismatch' | 'duplicate' | 'dependency';
    localVersion: number;
    remoteVersion: number;
    localData: Record<string, any>;
    remoteData: Record<string, any>;
    resolution: 'pending' | 'local_wins' | 'remote_wins' | 'merge' | 'manual' | 'auto';
    resolutionStrategy?: string;
    resolvedBy?: string;
    resolvedAt?: Date;
    mergedData?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface ConflictResolution {
    strategy: 'local_wins' | 'remote_wins' | 'latest_wins' | 'merge' | 'custom';
    customResolver?: string;
    mergeRules?: MergeRule[];
    priority?: 'local' | 'remote' | 'timestamp';
}
interface MergeRule {
    field: string;
    strategy: 'local' | 'remote' | 'concat' | 'max' | 'min' | 'custom';
    customFunction?: string;
}
interface DeviceRegistration {
    id: string;
    userId: string;
    deviceId: string;
    deviceName: string;
    deviceType: 'mobile' | 'desktop' | 'web' | 'tablet';
    deviceOS: string;
    deviceVersion?: string;
    userAgent?: string;
    protocol: 'activesync' | 'imap' | 'exchange' | 'custom';
    protocolVersion: string;
    syncEnabled: boolean;
    syncInterval: number;
    syncWindowSize: number;
    capabilities: DeviceCapabilities;
    lastSyncTime?: Date;
    lastActiveTime: Date;
    registeredAt: Date;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface DeviceCapabilities {
    maxMessageSize?: number;
    maxAttachmentSize?: number;
    supportedFormats: string[];
    supportsHtml: boolean;
    supportsRichText: boolean;
    supportsAttachments: boolean;
    supportsInlineImages: boolean;
    supportsPush: boolean;
    supportsPartialSync: boolean;
    supportsDeltaSync: boolean;
    supportsConflictResolution: boolean;
    maxFolderDepth?: number;
}
interface SyncHistory {
    id: string;
    userId: string;
    deviceId: string;
    accountId: string;
    syncType: 'full' | 'incremental' | 'delta' | 'partial';
    syncDirection: 'bidirectional' | 'download' | 'upload';
    syncKey: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    status: 'success' | 'partial_success' | 'failed' | 'cancelled';
    messagesAdded: number;
    messagesModified: number;
    messagesDeleted: number;
    foldersAdded: number;
    foldersModified: number;
    foldersDeleted: number;
    attachmentsSynced: number;
    bytesTransferred: number;
    conflictsDetected: number;
    conflictsResolved: number;
    errorsEncountered: number;
    errorMessages?: string[];
    performanceMetrics?: SyncPerformanceMetrics;
    metadata?: Record<string, any>;
    createdAt: Date;
}
interface SyncPerformanceMetrics {
    networkLatency: number;
    serverProcessingTime: number;
    clientProcessingTime: number;
    databaseQueryTime: number;
    compressionRatio?: number;
    deduplicationSavings?: number;
    bandwidthSaved?: number;
    cacheHitRate?: number;
}
interface DeltaSyncChange {
    changeType: 'add' | 'modify' | 'delete' | 'move' | 'copy';
    resourceType: 'message' | 'folder' | 'attachment' | 'flag';
    resourceId: string;
    serverId?: string;
    clientId?: string;
    parentId?: string;
    newParentId?: string;
    version: number;
    timestamp: Date;
    data?: Partial<any>;
    changes?: FieldChange[];
    metadata?: Record<string, any>;
}
interface FieldChange {
    field: string;
    oldValue: any;
    newValue: any;
    changeType: 'set' | 'unset' | 'append' | 'increment';
}
interface SyncOptions {
    includeAttachments?: boolean;
    attachmentSizeLimit?: number;
    compressionEnabled?: boolean;
    deduplicationEnabled?: boolean;
    conflictResolution?: ConflictResolution;
    maxBatchSize?: number;
    truncateBody?: number;
    includeDeleted?: boolean;
    mimeSupport?: 'text' | 'html' | 'mime';
}
interface PendingOperation {
    id: string;
    timestamp: Date;
    operation: 'create' | 'update' | 'delete' | 'move' | 'flag';
    resourceType: 'message' | 'folder' | 'attachment';
    resourceId: string;
    data: Record<string, any>;
    dependencies?: string[];
    status: 'pending' | 'synced' | 'conflict';
}
interface SyncSchedule {
    id: string;
    userId: string;
    deviceId: string;
    scheduleType: 'interval' | 'cron' | 'push' | 'manual';
    interval?: number;
    cronExpression?: string;
    enabled: boolean;
    priority: number;
    throttleLimit: number;
    throttleWindow: number;
    syncWindows?: TimeWindow[];
    excludeWindows?: TimeWindow[];
    lastRun?: Date;
    nextRun?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface TimeWindow {
    dayOfWeek?: number[];
    startTime: string;
    endTime: string;
    timezone?: string;
}
interface SyncThrottleState {
    userId: string;
    deviceId: string;
    windowStart: Date;
    syncCount: number;
    bytesTransferred: number;
    throttleLimit: number;
    bytesLimit: number;
    isThrottled: boolean;
    resetAt: Date;
}
interface AttachmentSyncMetadata {
    attachmentId: string;
    messageId: string;
    filename: string;
    size: number;
    contentType: string;
    syncStatus: 'pending' | 'downloading' | 'downloaded' | 'uploaded' | 'failed';
    bytesTransferred: number;
    totalBytes: number;
    chunkSize: number;
    currentChunk: number;
    totalChunks: number;
    checksum?: string;
    compressionUsed?: boolean;
    originalSize?: number;
    encryptionUsed?: boolean;
    downloadUrl?: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface SwaggerSyncSchema {
    name: string;
    type: string;
    description: string;
    example: any;
    required?: boolean;
    properties?: Record<string, any>;
}
/**
 * Sequelize SyncState model attributes for sync_states table.
 *
 * @example
 * ```typescript
 * class SyncState extends Model {}
 * SyncState.init(getSyncStateModelAttributes(), {
 *   sequelize,
 *   tableName: 'sync_states',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'deviceId', 'accountId'], unique: true },
 *     { fields: ['syncKey'] },
 *     { fields: ['syncStatus'] }
 *   ]
 * });
 * ```
 */
export declare const getSyncStateModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    accountId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    syncKey: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    syncToken: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    lastSyncTime: {
        type: string;
        allowNull: boolean;
    };
    nextSyncTime: {
        type: string;
        allowNull: boolean;
    };
    syncStatus: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    syncType: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    folderSyncState: {
        type: string;
        defaultValue: {};
        comment: string;
    };
    changeCounter: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    conflictCount: {
        type: string;
        defaultValue: number;
    };
    errorCount: {
        type: string;
        defaultValue: number;
    };
    successfulSyncs: {
        type: string;
        defaultValue: number;
    };
    failedSyncs: {
        type: string;
        defaultValue: number;
    };
    lastError: {
        type: string;
        allowNull: boolean;
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
 * Sequelize SyncOperation model attributes for sync_operations table.
 *
 * @example
 * ```typescript
 * class SyncOperation extends Model {}
 * SyncOperation.init(getSyncOperationModelAttributes(), {
 *   sequelize,
 *   tableName: 'sync_operations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'deviceId'] },
 *     { fields: ['syncStateId'] },
 *     { fields: ['status', 'priority'] },
 *     { fields: ['resourceType', 'resourceId'] }
 *   ]
 * });
 * ```
 */
export declare const getSyncOperationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    accountId: {
        type: string;
        allowNull: boolean;
    };
    syncStateId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    operationType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    resourceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    resourceId: {
        type: string;
        allowNull: boolean;
    };
    folderId: {
        type: string;
        allowNull: boolean;
    };
    operation: {
        type: string;
        allowNull: boolean;
    };
    payload: {
        type: string;
        allowNull: boolean;
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    priority: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    retryCount: {
        type: string;
        defaultValue: number;
    };
    maxRetries: {
        type: string;
        defaultValue: number;
    };
    errorMessage: {
        type: string;
        allowNull: boolean;
    };
    conflictResolution: {
        type: string;
        allowNull: boolean;
    };
    startedAt: {
        type: string;
        allowNull: boolean;
    };
    completedAt: {
        type: string;
        allowNull: boolean;
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
 * Sequelize SyncConflict model attributes for sync_conflicts table.
 *
 * @example
 * ```typescript
 * class SyncConflict extends Model {}
 * SyncConflict.init(getSyncConflictModelAttributes(), {
 *   sequelize,
 *   tableName: 'sync_conflicts',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'deviceId'] },
 *     { fields: ['syncOperationId'] },
 *     { fields: ['resourceType', 'resourceId'] },
 *     { fields: ['resolution'] }
 *   ]
 * });
 * ```
 */
export declare const getSyncConflictModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    syncOperationId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    resourceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    resourceId: {
        type: string;
        allowNull: boolean;
    };
    conflictType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    localVersion: {
        type: string;
        allowNull: boolean;
    };
    remoteVersion: {
        type: string;
        allowNull: boolean;
    };
    localData: {
        type: string;
        allowNull: boolean;
    };
    remoteData: {
        type: string;
        allowNull: boolean;
    };
    resolution: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    resolutionStrategy: {
        type: string;
        allowNull: boolean;
    };
    resolvedBy: {
        type: string;
        allowNull: boolean;
    };
    resolvedAt: {
        type: string;
        allowNull: boolean;
    };
    mergedData: {
        type: string;
        allowNull: boolean;
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
 * Sequelize DeviceRegistration model attributes for device_registrations table.
 *
 * @example
 * ```typescript
 * class DeviceRegistration extends Model {}
 * DeviceRegistration.init(getDeviceRegistrationModelAttributes(), {
 *   sequelize,
 *   tableName: 'device_registrations',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'deviceId'], unique: true },
 *     { fields: ['isActive'] },
 *     { fields: ['lastActiveTime'] }
 *   ]
 * });
 * ```
 */
export declare const getDeviceRegistrationModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    deviceName: {
        type: string;
        allowNull: boolean;
    };
    deviceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    deviceOS: {
        type: string;
        allowNull: boolean;
    };
    deviceVersion: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    protocol: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    protocolVersion: {
        type: string;
        allowNull: boolean;
    };
    syncEnabled: {
        type: string;
        defaultValue: boolean;
    };
    syncInterval: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    syncWindowSize: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    capabilities: {
        type: string;
        defaultValue: {};
    };
    lastSyncTime: {
        type: string;
        allowNull: boolean;
    };
    lastActiveTime: {
        type: string;
        allowNull: boolean;
    };
    registeredAt: {
        type: string;
        allowNull: boolean;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
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
 * Sequelize SyncHistory model attributes for sync_history table.
 *
 * @example
 * ```typescript
 * class SyncHistory extends Model {}
 * SyncHistory.init(getSyncHistoryModelAttributes(), {
 *   sequelize,
 *   tableName: 'sync_history',
 *   timestamps: false,
 *   indexes: [
 *     { fields: ['userId', 'deviceId'] },
 *     { fields: ['startTime'] },
 *     { fields: ['status'] }
 *   ]
 * });
 * ```
 */
export declare const getSyncHistoryModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    accountId: {
        type: string;
        allowNull: boolean;
    };
    syncType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    syncDirection: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    syncKey: {
        type: string;
        allowNull: boolean;
    };
    startTime: {
        type: string;
        allowNull: boolean;
    };
    endTime: {
        type: string;
        allowNull: boolean;
    };
    duration: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    status: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    messagesAdded: {
        type: string;
        defaultValue: number;
    };
    messagesModified: {
        type: string;
        defaultValue: number;
    };
    messagesDeleted: {
        type: string;
        defaultValue: number;
    };
    foldersAdded: {
        type: string;
        defaultValue: number;
    };
    foldersModified: {
        type: string;
        defaultValue: number;
    };
    foldersDeleted: {
        type: string;
        defaultValue: number;
    };
    attachmentsSynced: {
        type: string;
        defaultValue: number;
    };
    bytesTransferred: {
        type: string;
        defaultValue: number;
    };
    conflictsDetected: {
        type: string;
        defaultValue: number;
    };
    conflictsResolved: {
        type: string;
        defaultValue: number;
    };
    errorsEncountered: {
        type: string;
        defaultValue: number;
    };
    errorMessages: {
        type: string;
        allowNull: boolean;
    };
    performanceMetrics: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize SyncSchedule model attributes for sync_schedules table.
 *
 * @example
 * ```typescript
 * class SyncSchedule extends Model {}
 * SyncSchedule.init(getSyncScheduleModelAttributes(), {
 *   sequelize,
 *   tableName: 'sync_schedules',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'deviceId'] },
 *     { fields: ['enabled'] },
 *     { fields: ['nextRun'] }
 *   ]
 * });
 * ```
 */
export declare const getSyncScheduleModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    scheduleType: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    interval: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    cronExpression: {
        type: string;
        allowNull: boolean;
    };
    enabled: {
        type: string;
        defaultValue: boolean;
    };
    priority: {
        type: string;
        defaultValue: number;
    };
    throttleLimit: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    throttleWindow: {
        type: string;
        defaultValue: number;
        comment: string;
    };
    syncWindows: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    excludeWindows: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    lastRun: {
        type: string;
        allowNull: boolean;
    };
    nextRun: {
        type: string;
        allowNull: boolean;
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
 * Initializes sync state for a new device or account.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} accountId - Mail account ID
 * @param {string} protocol - Sync protocol (activesync, imap, etc.)
 * @returns {object} Sync state creation object
 *
 * @example
 * ```typescript
 * const syncState = initializeSyncState(
 *   'user-123',
 *   'device-abc',
 *   'account-456',
 *   'activesync'
 * );
 * await SyncState.create(syncState);
 * ```
 */
export declare const initializeSyncState: (userId: string, deviceId: string, accountId: string, protocol?: string) => Record<string, any>;
/**
 * Generates a unique sync key compatible with ActiveSync protocol.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} accountId - Account ID
 * @returns {string} Unique sync key
 *
 * @example
 * ```typescript
 * const syncKey = generateSyncKey('user-123', 'device-abc', 'account-456');
 * console.log(syncKey); // "sync_1234567890abcdef"
 * ```
 */
export declare const generateSyncKey: (userId: string, deviceId: string, accountId: string) => string;
/**
 * Generates an opaque sync token for incremental synchronization.
 *
 * @returns {string} Base64-encoded sync token
 *
 * @example
 * ```typescript
 * const token = generateSyncToken();
 * console.log(token); // "eyJ0aW1lc3RhbXAiOjE3MDk4..."
 * ```
 */
export declare const generateSyncToken: () => string;
/**
 * Parses and validates a sync token.
 *
 * @param {string} token - Sync token to parse
 * @returns {object | null} Parsed token data or null if invalid
 *
 * @example
 * ```typescript
 * const tokenData = parseSyncToken('eyJ0aW1lc3RhbXAiOjE3MDk4...');
 * if (tokenData) {
 *   console.log('Token timestamp:', tokenData.timestamp);
 * }
 * ```
 */
export declare const parseSyncToken: (token: string) => Record<string, any> | null;
/**
 * Updates sync state after a successful sync operation.
 *
 * @param {string} syncStateId - Sync state ID
 * @param {object} updates - Updates to apply
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = updateSyncState('state-123', {
 *   syncStatus: 'idle',
 *   lastSyncTime: new Date(),
 *   successfulSyncs: 5,
 *   changeCounter: 150
 * });
 * await SyncState.update(update.data, { where: update.where });
 * ```
 */
export declare const updateSyncState: (syncStateId: string, updates: Partial<SyncState>) => Record<string, any>;
/**
 * Updates folder-specific sync state within a sync state.
 *
 * @param {string} syncStateId - Sync state ID
 * @param {string} folderId - Folder ID
 * @param {FolderSyncState} folderState - Folder sync state updates
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = updateFolderSyncState('state-123', 'folder-456', {
 *   syncToken: 'token-abc',
 *   watermark: 1234,
 *   lastSyncTime: new Date(),
 *   messageCount: 50,
 *   syncedMessageCount: 50,
 *   hasMoreChanges: false
 * });
 * ```
 */
export declare const updateFolderSyncState: (syncStateId: string, folderId: string, folderState: Partial<FolderSyncState>) => Record<string, any>;
/**
 * Retrieves sync state for a device and account.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} accountId - Account ID
 * @returns {object} Query object for sync state retrieval
 *
 * @example
 * ```typescript
 * const query = getSyncState('user-123', 'device-abc', 'account-456');
 * const syncState = await SyncState.findOne(query);
 * ```
 */
export declare const getSyncState: (userId: string, deviceId: string, accountId: string) => Record<string, any>;
/**
 * Registers a new device for synchronization.
 *
 * @param {string} userId - User ID
 * @param {object} deviceInfo - Device information
 * @returns {object} Device registration object
 *
 * @example
 * ```typescript
 * const device = registerDevice('user-123', {
 *   deviceId: 'device-abc',
 *   deviceName: 'iPhone 13',
 *   deviceType: 'mobile',
 *   deviceOS: 'iOS 17.2',
 *   protocol: 'activesync',
 *   protocolVersion: '14.1',
 *   capabilities: {
 *     supportsHtml: true,
 *     supportsAttachments: true,
 *     supportsPush: true,
 *     supportsDeltaSync: true
 *   }
 * });
 * await DeviceRegistration.create(device);
 * ```
 */
export declare const registerDevice: (userId: string, deviceInfo: Partial<DeviceRegistration>) => Record<string, any>;
/**
 * Updates device last active time and sync status.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} userId - User ID
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = updateDeviceActivity('device-abc', 'user-123');
 * await DeviceRegistration.update(update.data, { where: update.where });
 * ```
 */
export declare const updateDeviceActivity: (deviceId: string, userId: string) => Record<string, any>;
/**
 * Retrieves all active devices for a user.
 *
 * @param {string} userId - User ID
 * @returns {object} Query object for device retrieval
 *
 * @example
 * ```typescript
 * const query = getUserDevices('user-123');
 * const devices = await DeviceRegistration.findAll(query);
 * console.log(`User has ${devices.length} active devices`);
 * ```
 */
export declare const getUserDevices: (userId: string) => Record<string, any>;
/**
 * Deactivates a device and prevents future syncs.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} userId - User ID
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = deactivateDevice('device-abc', 'user-123');
 * await DeviceRegistration.update(update.data, { where: update.where });
 * ```
 */
export declare const deactivateDevice: (deviceId: string, userId: string) => Record<string, any>;
/**
 * Detects conflicts between multiple device sync operations.
 *
 * @param {string} userId - User ID
 * @param {string} resourceId - Resource identifier (message, folder, etc.)
 * @param {string} resourceType - Type of resource
 * @returns {object} Query to find conflicting operations
 *
 * @example
 * ```typescript
 * const query = detectMultiDeviceConflicts('user-123', 'msg-456', 'message');
 * const conflicts = await SyncOperation.findAll(query);
 * if (conflicts.length > 1) {
 *   console.log('Multiple devices modified the same resource');
 * }
 * ```
 */
export declare const detectMultiDeviceConflicts: (userId: string, resourceId: string, resourceType: string) => Record<string, any>;
/**
 * Performs incremental sync by detecting changes since last sync.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} syncToken - Last sync token
 * @param {object} options - Sync options
 * @returns {object} Query for incremental changes
 *
 * @example
 * ```typescript
 * const query = performIncrementalSync(
 *   'user-123',
 *   'device-abc',
 *   'token-xyz',
 *   { windowSize: 100, includeDeleted: true }
 * );
 * const changes = await MailMessage.findAll(query);
 * ```
 */
export declare const performIncrementalSync: (userId: string, deviceId: string, syncToken: string, options?: Partial<SyncOptions>) => Record<string, any>;
/**
 * Detects changes in a folder since last sync using watermark.
 *
 * @param {string} folderId - Folder ID
 * @param {number} watermark - Last watermark value
 * @param {number} limit - Maximum changes to return
 * @returns {object} Query for folder changes
 *
 * @example
 * ```typescript
 * const query = detectFolderChanges('folder-123', 5000, 50);
 * const changes = await MailMessage.findAll(query);
 * console.log(`Detected ${changes.length} changes`);
 * ```
 */
export declare const detectFolderChanges: (folderId: string, watermark: number, limit?: number) => Record<string, any>;
/**
 * Builds a delta sync response with only changed fields.
 *
 * @param {any} oldData - Previous version of data
 * @param {any} newData - Current version of data
 * @param {string[]} excludeFields - Fields to exclude from delta
 * @returns {DeltaSyncChange} Delta change object
 *
 * @example
 * ```typescript
 * const delta = buildDeltaSyncResponse(
 *   { subject: 'Old', isRead: false },
 *   { subject: 'Old', isRead: true },
 *   ['createdAt', 'updatedAt']
 * );
 * console.log(delta.changes); // [{ field: 'isRead', oldValue: false, newValue: true }]
 * ```
 */
export declare const buildDeltaSyncResponse: (oldData: Record<string, any>, newData: Record<string, any>, excludeFields?: string[]) => DeltaSyncChange;
/**
 * Applies delta changes to a resource.
 *
 * @param {Record<string, any>} resource - Resource to update
 * @param {FieldChange[]} changes - Changes to apply
 * @returns {Record<string, any>} Updated resource
 *
 * @example
 * ```typescript
 * const updated = applyDeltaChanges(message, [
 *   { field: 'isRead', oldValue: false, newValue: true, changeType: 'set' },
 *   { field: 'categories', oldValue: [], newValue: ['urgent'], changeType: 'append' }
 * ]);
 * ```
 */
export declare const applyDeltaChanges: (resource: Record<string, any>, changes: FieldChange[]) => Record<string, any>;
/**
 * Calculates sync window size based on bandwidth and device capabilities.
 *
 * @param {DeviceCapabilities} capabilities - Device capabilities
 * @param {number} availableBandwidth - Available bandwidth in bytes/sec
 * @returns {number} Optimal window size
 *
 * @example
 * ```typescript
 * const windowSize = calculateSyncWindowSize(
 *   { maxMessageSize: 10485760, supportsDeltaSync: true },
 *   1048576 // 1 MB/s
 * );
 * console.log(`Optimal window size: ${windowSize}`);
 * ```
 */
export declare const calculateSyncWindowSize: (capabilities: DeviceCapabilities, availableBandwidth: number) => number;
/**
 * Creates a sync conflict record when concurrent modifications are detected.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} syncOperationId - Sync operation ID
 * @param {object} conflictData - Conflict details
 * @returns {object} Sync conflict object
 *
 * @example
 * ```typescript
 * const conflict = createSyncConflict('user-123', 'device-abc', 'op-456', {
 *   resourceType: 'message',
 *   resourceId: 'msg-789',
 *   conflictType: 'concurrent_modification',
 *   localVersion: 2,
 *   remoteVersion: 3,
 *   localData: { isRead: true, subject: 'Local' },
 *   remoteData: { isRead: false, subject: 'Remote' }
 * });
 * await SyncConflict.create(conflict);
 * ```
 */
export declare const createSyncConflict: (userId: string, deviceId: string, syncOperationId: string, conflictData: Partial<SyncConflict>) => Record<string, any>;
/**
 * Resolves a conflict using specified strategy.
 *
 * @param {string} conflictId - Conflict ID
 * @param {ConflictResolution} resolution - Resolution strategy
 * @param {string} userId - User ID resolving the conflict
 * @returns {object} Resolution result
 *
 * @example
 * ```typescript
 * const result = await resolveSyncConflict('conflict-123', {
 *   strategy: 'latest_wins',
 *   priority: 'timestamp'
 * }, 'user-123');
 * ```
 */
export declare const resolveSyncConflict: (conflictId: string, resolution: ConflictResolution, userId: string) => Record<string, any>;
/**
 * Merges local and remote data according to merge rules.
 *
 * @param {Record<string, any>} localData - Local version
 * @param {Record<string, any>} remoteData - Remote version
 * @param {MergeRule[]} rules - Merge rules
 * @returns {Record<string, any>} Merged data
 *
 * @example
 * ```typescript
 * const merged = mergeConflictingData(
 *   { subject: 'Local', isRead: true, categories: ['urgent'] },
 *   { subject: 'Remote', isRead: false, categories: ['followup'] },
 *   [
 *     { field: 'subject', strategy: 'remote' },
 *     { field: 'isRead', strategy: 'local' },
 *     { field: 'categories', strategy: 'concat' }
 *   ]
 * );
 * ```
 */
export declare const mergeConflictingData: (localData: Record<string, any>, remoteData: Record<string, any>, rules: MergeRule[]) => Record<string, any>;
/**
 * Detects conflict type between local and remote versions.
 *
 * @param {Record<string, any>} localData - Local version
 * @param {Record<string, any>} remoteData - Remote version
 * @returns {string} Conflict type
 *
 * @example
 * ```typescript
 * const conflictType = detectConflictType(
 *   { id: 'msg-1', isDeleted: false, version: 2 },
 *   { id: 'msg-1', isDeleted: true, version: 3 }
 * );
 * console.log(conflictType); // 'delete_modify'
 * ```
 */
export declare const detectConflictType: (localData: Record<string, any>, remoteData: Record<string, any>) => string;
/**
 * Retrieves all pending conflicts for a user/device.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {object} Query for pending conflicts
 *
 * @example
 * ```typescript
 * const query = getPendingConflicts('user-123', 'device-abc');
 * const conflicts = await SyncConflict.findAll(query);
 * console.log(`${conflicts.length} conflicts need resolution`);
 * ```
 */
export declare const getPendingConflicts: (userId: string, deviceId?: string) => Record<string, any>;
/**
 * Creates a sync operation for queued execution.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} accountId - Account ID
 * @param {object} operationData - Operation details
 * @returns {object} Sync operation object
 *
 * @example
 * ```typescript
 * const operation = createSyncOperation('user-123', 'device-abc', 'account-456', {
 *   operationType: 'fetch',
 *   resourceType: 'message',
 *   resourceId: 'msg-789',
 *   folderId: 'folder-111',
 *   operation: 'download_message',
 *   priority: 'high',
 *   payload: { includeAttachments: true }
 * });
 * await SyncOperation.create(operation);
 * ```
 */
export declare const createSyncOperation: (userId: string, deviceId: string, accountId: string, operationData: Partial<SyncOperation>) => Record<string, any>;
/**
 * Updates sync operation status and retry count.
 *
 * @param {string} operationId - Operation ID
 * @param {string} status - New status
 * @param {string} errorMessage - Error message if failed
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = updateSyncOperation('op-123', 'failed', 'Network timeout');
 * await SyncOperation.update(update.data, { where: update.where });
 * ```
 */
export declare const updateSyncOperation: (operationId: string, status: string, errorMessage?: string) => Record<string, any>;
/**
 * Retrieves pending sync operations ordered by priority.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {number} limit - Maximum operations to retrieve
 * @returns {object} Query for pending operations
 *
 * @example
 * ```typescript
 * const query = getPendingSyncOperations('user-123', 'device-abc', 20);
 * const operations = await SyncOperation.findAll(query);
 * ```
 */
export declare const getPendingSyncOperations: (userId: string, deviceId: string, limit?: number) => Record<string, any>;
/**
 * Marks sync operation for retry with exponential backoff.
 *
 * @param {string} operationId - Operation ID
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = retrySyncOperation('op-123');
 * await SyncOperation.update(update.data, { where: update.where });
 * ```
 */
export declare const retrySyncOperation: (operationId: string) => Record<string, any>;
/**
 * Cancels pending sync operations for a device.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = cancelPendingOperations('user-123', 'device-abc');
 * await SyncOperation.update(update.data, { where: update.where });
 * ```
 */
export declare const cancelPendingOperations: (userId: string, deviceId: string) => Record<string, any>;
/**
 * Synchronizes folder hierarchy from server.
 *
 * @param {string} userId - User ID
 * @param {string} accountId - Account ID
 * @param {string} syncKey - Sync key
 * @returns {object} Query for folder sync
 *
 * @example
 * ```typescript
 * const query = syncFolderHierarchy('user-123', 'account-456', 'sync-key-abc');
 * const folders = await MailFolder.findAll(query);
 * ```
 */
export declare const syncFolderHierarchy: (userId: string, accountId: string, syncKey: string) => Record<string, any>;
/**
 * Synchronizes messages in a specific folder.
 *
 * @param {string} userId - User ID
 * @param {string} folderId - Folder ID
 * @param {string} syncToken - Folder sync token
 * @param {object} options - Sync options
 * @returns {object} Query for message sync
 *
 * @example
 * ```typescript
 * const query = syncFolderMessages('user-123', 'folder-456', 'token-abc', {
 *   windowSize: 50,
 *   includeDeleted: false
 * });
 * const messages = await MailMessage.findAll(query);
 * ```
 */
export declare const syncFolderMessages: (userId: string, folderId: string, syncToken: string, options?: Partial<SyncOptions>) => Record<string, any>;
/**
 * Synchronizes message flags (read, flagged, etc.).
 *
 * @param {string} userId - User ID
 * @param {string[]} messageIds - Message IDs to sync
 * @param {Record<string, any>} flags - Flags to update
 * @returns {object} Bulk update query
 *
 * @example
 * ```typescript
 * const update = syncMessageFlags('user-123', ['msg-1', 'msg-2'], {
 *   isRead: true,
 *   isFlagged: false
 * });
 * await MailMessage.update(update.data, { where: update.where });
 * ```
 */
export declare const syncMessageFlags: (userId: string, messageIds: string[], flags: Record<string, any>) => Record<string, any>;
/**
 * Moves messages between folders during sync.
 *
 * @param {string} userId - User ID
 * @param {string[]} messageIds - Message IDs
 * @param {string} targetFolderId - Target folder ID
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = syncMessageMove('user-123', ['msg-1', 'msg-2'], 'folder-archive');
 * await MailMessage.update(update.data, { where: update.where });
 * ```
 */
export declare const syncMessageMove: (userId: string, messageIds: string[], targetFolderId: string) => Record<string, any>;
/**
 * Synchronizes message metadata (categories, importance, etc.).
 *
 * @param {string} userId - User ID
 * @param {string} messageId - Message ID
 * @param {Record<string, any>} metadata - Metadata updates
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = syncMessageMetadata('user-123', 'msg-456', {
 *   categories: ['patient-care', 'urgent'],
 *   importance: 'high',
 *   sensitivity: 'confidential'
 * });
 * ```
 */
export declare const syncMessageMetadata: (userId: string, messageId: string, metadata: Record<string, any>) => Record<string, any>;
/**
 * Creates attachment sync metadata for chunked download.
 *
 * @param {string} attachmentId - Attachment ID
 * @param {string} messageId - Message ID
 * @param {object} attachmentInfo - Attachment information
 * @returns {object} Attachment sync metadata
 *
 * @example
 * ```typescript
 * const metadata = createAttachmentSyncMetadata('att-123', 'msg-456', {
 *   filename: 'report.pdf',
 *   size: 5242880,
 *   contentType: 'application/pdf',
 *   chunkSize: 524288
 * });
 * await AttachmentSyncMetadata.create(metadata);
 * ```
 */
export declare const createAttachmentSyncMetadata: (attachmentId: string, messageId: string, attachmentInfo: Partial<AttachmentSyncMetadata>) => Record<string, any>;
/**
 * Updates attachment sync progress.
 *
 * @param {string} attachmentId - Attachment ID
 * @param {number} chunkNumber - Completed chunk number
 * @param {number} bytesTransferred - Bytes transferred
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = updateAttachmentSyncProgress('att-123', 5, 2621440);
 * await AttachmentSyncMetadata.update(update.data, { where: update.where });
 * ```
 */
export declare const updateAttachmentSyncProgress: (attachmentId: string, chunkNumber: number, bytesTransferred: number) => Record<string, any>;
/**
 * Marks attachment sync as complete.
 *
 * @param {string} attachmentId - Attachment ID
 * @param {string} checksum - File checksum for verification
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = completeAttachmentSync('att-123', 'sha256-abcdef...');
 * await AttachmentSyncMetadata.update(update.data, { where: update.where });
 * ```
 */
export declare const completeAttachmentSync: (attachmentId: string, checksum: string) => Record<string, any>;
/**
 * Retrieves pending attachment syncs for a message.
 *
 * @param {string} messageId - Message ID
 * @returns {object} Query for pending attachments
 *
 * @example
 * ```typescript
 * const query = getPendingAttachmentSyncs('msg-456');
 * const attachments = await AttachmentSyncMetadata.findAll(query);
 * ```
 */
export declare const getPendingAttachmentSyncs: (messageId: string) => Record<string, any>;
/**
 * Queues an operation for offline execution.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {PendingOperation} operation - Operation to queue
 * @returns {object} Offline queue update
 *
 * @example
 * ```typescript
 * const queue = queueOfflineOperation('user-123', 'device-abc', {
 *   id: 'op-1',
 *   timestamp: new Date(),
 *   operation: 'update',
 *   resourceType: 'message',
 *   resourceId: 'msg-456',
 *   data: { isRead: true },
 *   status: 'pending'
 * });
 * ```
 */
export declare const queueOfflineOperation: (userId: string, deviceId: string, operation: PendingOperation) => Record<string, any>;
/**
 * Retrieves offline queue for synchronization.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {object} Query for offline queue
 *
 * @example
 * ```typescript
 * const query = getOfflineQueue('user-123', 'device-abc');
 * const queue = await OfflineSyncQueue.findOne(query);
 * ```
 */
export declare const getOfflineQueue: (userId: string, deviceId: string) => Record<string, any>;
/**
 * Processes offline queue and marks operations as synced.
 *
 * @param {string} queueId - Queue ID
 * @param {string[]} operationIds - Synced operation IDs
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = processOfflineQueue('queue-123', ['op-1', 'op-2']);
 * await OfflineSyncQueue.update(update.data, { where: update.where });
 * ```
 */
export declare const processOfflineQueue: (queueId: string, operationIds: string[]) => Record<string, any>;
/**
 * Clears synced operations from offline queue.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {object} Update query object
 *
 * @example
 * ```typescript
 * const update = clearSyncedOfflineOperations('user-123', 'device-abc');
 * await OfflineSyncQueue.update(update.data, { where: update.where });
 * ```
 */
export declare const clearSyncedOfflineOperations: (userId: string, deviceId: string) => Record<string, any>;
/**
 * Creates a sync schedule for periodic synchronization.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {object} scheduleConfig - Schedule configuration
 * @returns {object} Sync schedule object
 *
 * @example
 * ```typescript
 * const schedule = createSyncSchedule('user-123', 'device-abc', {
 *   scheduleType: 'interval',
 *   interval: 300,
 *   enabled: true,
 *   throttleLimit: 100,
 *   throttleWindow: 3600
 * });
 * await SyncSchedule.create(schedule);
 * ```
 */
export declare const createSyncSchedule: (userId: string, deviceId: string, scheduleConfig: Partial<SyncSchedule>) => Record<string, any>;
/**
 * Calculates next sync time based on schedule.
 *
 * @param {SyncSchedule} schedule - Sync schedule
 * @returns {Date} Next sync time
 *
 * @example
 * ```typescript
 * const nextSync = calculateNextSyncTime(schedule);
 * console.log('Next sync at:', nextSync);
 * ```
 */
export declare const calculateNextSyncTime: (schedule: SyncSchedule) => Date;
/**
 * Checks if sync is allowed based on throttle limits.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {SyncThrottleState} throttleState - Current throttle state
 * @returns {boolean} Whether sync is allowed
 *
 * @example
 * ```typescript
 * const allowed = checkSyncThrottle('user-123', 'device-abc', throttleState);
 * if (!allowed) {
 *   console.log('Sync throttled - too many requests');
 * }
 * ```
 */
export declare const checkSyncThrottle: (userId: string, deviceId: string, throttleState: SyncThrottleState) => boolean;
/**
 * Updates throttle state after sync operation.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {number} bytesTransferred - Bytes transferred in sync
 * @returns {object} Throttle state update
 *
 * @example
 * ```typescript
 * const update = updateSyncThrottle('user-123', 'device-abc', 1048576);
 * await SyncThrottleState.update(update.data, { where: update.where });
 * ```
 */
export declare const updateSyncThrottle: (userId: string, deviceId: string, bytesTransferred: number) => Record<string, any>;
/**
 * Resets throttle state after window expiration.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {number} throttleWindow - Window duration in seconds
 * @returns {object} Throttle state reset
 *
 * @example
 * ```typescript
 * const reset = resetSyncThrottle('user-123', 'device-abc', 3600);
 * await SyncThrottleState.update(reset.data, { where: reset.where });
 * ```
 */
export declare const resetSyncThrottle: (userId: string, deviceId: string, throttleWindow: number) => Record<string, any>;
/**
 * Records sync history entry for audit trail.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {string} accountId - Account ID
 * @param {object} syncData - Sync details
 * @returns {object} Sync history object
 *
 * @example
 * ```typescript
 * const history = recordSyncHistory('user-123', 'device-abc', 'account-456', {
 *   syncType: 'incremental',
 *   syncDirection: 'bidirectional',
 *   syncKey: 'sync-key-abc',
 *   startTime: new Date(),
 *   status: 'success',
 *   messagesAdded: 5,
 *   messagesModified: 10,
 *   bytesTransferred: 1048576
 * });
 * await SyncHistory.create(history);
 * ```
 */
export declare const recordSyncHistory: (userId: string, deviceId: string, accountId: string, syncData: Partial<SyncHistory>) => Record<string, any>;
/**
 * Retrieves sync history for a user/device.
 *
 * @param {string} userId - User ID
 * @param {string} deviceId - Device identifier
 * @param {number} limit - Maximum records to retrieve
 * @returns {object} Query for sync history
 *
 * @example
 * ```typescript
 * const query = getSyncHistory('user-123', 'device-abc', 50);
 * const history = await SyncHistory.findAll(query);
 * ```
 */
export declare const getSyncHistory: (userId: string, deviceId?: string, limit?: number) => Record<string, any>;
/**
 * Calculates sync statistics for analytics.
 *
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {object} Query for sync statistics
 *
 * @example
 * ```typescript
 * const query = calculateSyncStatistics(
 *   'user-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * const stats = await SyncHistory.aggregate(query);
 * ```
 */
export declare const calculateSyncStatistics: (userId: string, startDate: Date, endDate: Date) => Record<string, any>;
/**
 * Generates Swagger schema for SyncState model.
 *
 * @returns {SwaggerSyncSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = generateSyncStateSwaggerSchema();
 * // Use in @ApiProperty decorators
 * ```
 */
export declare const generateSyncStateSwaggerSchema: () => SwaggerSyncSchema;
/**
 * Generates Swagger schema for SyncOperation model.
 *
 * @returns {SwaggerSyncSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = generateSyncOperationSwaggerSchema();
 * // Use in @ApiProperty decorators
 * ```
 */
export declare const generateSyncOperationSwaggerSchema: () => SwaggerSyncSchema;
/**
 * Generates Swagger schema for SyncConflict model.
 *
 * @returns {SwaggerSyncSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = generateSyncConflictSwaggerSchema();
 * // Use in @ApiProperty decorators
 * ```
 */
export declare const generateSyncConflictSwaggerSchema: () => SwaggerSyncSchema;
export {};
//# sourceMappingURL=mail-sync-engine-kit.d.ts.map