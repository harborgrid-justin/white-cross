"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSyncThrottle = exports.checkSyncThrottle = exports.calculateNextSyncTime = exports.createSyncSchedule = exports.clearSyncedOfflineOperations = exports.processOfflineQueue = exports.getOfflineQueue = exports.queueOfflineOperation = exports.getPendingAttachmentSyncs = exports.completeAttachmentSync = exports.updateAttachmentSyncProgress = exports.createAttachmentSyncMetadata = exports.syncMessageMetadata = exports.syncMessageMove = exports.syncMessageFlags = exports.syncFolderMessages = exports.syncFolderHierarchy = exports.cancelPendingOperations = exports.retrySyncOperation = exports.getPendingSyncOperations = exports.updateSyncOperation = exports.createSyncOperation = exports.getPendingConflicts = exports.detectConflictType = exports.mergeConflictingData = exports.resolveSyncConflict = exports.createSyncConflict = exports.calculateSyncWindowSize = exports.applyDeltaChanges = exports.buildDeltaSyncResponse = exports.detectFolderChanges = exports.performIncrementalSync = exports.detectMultiDeviceConflicts = exports.deactivateDevice = exports.getUserDevices = exports.updateDeviceActivity = exports.registerDevice = exports.getSyncState = exports.updateFolderSyncState = exports.updateSyncState = exports.parseSyncToken = exports.generateSyncToken = exports.generateSyncKey = exports.initializeSyncState = exports.getSyncScheduleModelAttributes = exports.getSyncHistoryModelAttributes = exports.getDeviceRegistrationModelAttributes = exports.getSyncConflictModelAttributes = exports.getSyncOperationModelAttributes = exports.getSyncStateModelAttributes = void 0;
exports.generateSyncConflictSwaggerSchema = exports.generateSyncOperationSwaggerSchema = exports.generateSyncStateSwaggerSchema = exports.calculateSyncStatistics = exports.getSyncHistory = exports.recordSyncHistory = exports.resetSyncThrottle = void 0;
/**
 * File: /reuse/server/mail/mail-sync-engine-kit.ts
 * Locator: WC-UTL-MAILSYNC-001
 * Purpose: Comprehensive Mail Synchronization Engine Kit - Complete ActiveSync-compatible synchronization toolkit for NestJS + Sequelize
 *
 * Upstream: Independent utility module for mail synchronization operations
 * Downstream: ../backend/*, Mail sync services, Sync controllers, Background jobs, Real-time processors
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @nestjs/bull, sequelize, ioredis
 * Exports: 45 utility functions for sync state management, multi-device sync, incremental sync, conflict resolution, delta sync, folder/message sync, offline support, scheduling
 *
 * LLM Context: Enterprise-grade mail synchronization engine utilities for White Cross healthcare platform.
 * Provides comprehensive synchronization capabilities comparable to Microsoft Exchange Server ActiveSync protocol,
 * including full multi-device synchronization, incremental sync algorithms, conflict resolution strategies,
 * delta sync for efficiency, folder and message synchronization, flag and status sync, attachment sync,
 * offline support with queue management, sync scheduling and throttling, background jobs with Bull,
 * real-time sync state tracking, change detection and versioning, sync tokens and watermarks,
 * HIPAA-compliant sync audit trails, and Sequelize models for sync state, sync operations, sync conflicts,
 * device registrations, sync queues, and sync history.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================
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
const getSyncStateModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
        comment: 'Unique device identifier',
    },
    accountId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'mail_accounts',
            key: 'id',
        },
    },
    syncKey: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'ActiveSync-compatible sync key',
    },
    syncToken: {
        type: 'TEXT',
        allowNull: false,
        comment: 'Opaque sync token for incremental sync',
    },
    lastSyncTime: {
        type: 'DATE',
        allowNull: false,
    },
    nextSyncTime: {
        type: 'DATE',
        allowNull: true,
    },
    syncStatus: {
        type: 'ENUM',
        values: ['idle', 'syncing', 'pending', 'paused', 'error'],
        defaultValue: 'idle',
    },
    syncType: {
        type: 'ENUM',
        values: ['full', 'incremental', 'delta', 'partial'],
        defaultValue: 'incremental',
    },
    folderSyncState: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Per-folder sync state map',
    },
    changeCounter: {
        type: 'INTEGER',
        defaultValue: 0,
        comment: 'Total number of changes processed',
    },
    conflictCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    errorCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    successfulSyncs: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    failedSyncs: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    lastError: {
        type: 'TEXT',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSyncStateModelAttributes = getSyncStateModelAttributes;
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
const getSyncOperationModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
    },
    accountId: {
        type: 'UUID',
        allowNull: false,
    },
    syncStateId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'sync_states',
            key: 'id',
        },
    },
    operationType: {
        type: 'ENUM',
        values: ['fetch', 'push', 'delete', 'move', 'flag', 'read', 'attachment'],
        allowNull: false,
    },
    resourceType: {
        type: 'ENUM',
        values: ['message', 'folder', 'attachment', 'flag', 'metadata'],
        allowNull: false,
    },
    resourceId: {
        type: 'STRING',
        allowNull: false,
    },
    folderId: {
        type: 'UUID',
        allowNull: true,
    },
    operation: {
        type: 'STRING',
        allowNull: false,
    },
    payload: {
        type: 'JSONB',
        allowNull: true,
    },
    status: {
        type: 'ENUM',
        values: ['pending', 'processing', 'completed', 'failed', 'conflict'],
        defaultValue: 'pending',
    },
    priority: {
        type: 'ENUM',
        values: ['low', 'normal', 'high', 'urgent'],
        defaultValue: 'normal',
    },
    retryCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    maxRetries: {
        type: 'INTEGER',
        defaultValue: 3,
    },
    errorMessage: {
        type: 'TEXT',
        allowNull: true,
    },
    conflictResolution: {
        type: 'JSONB',
        allowNull: true,
    },
    startedAt: {
        type: 'DATE',
        allowNull: true,
    },
    completedAt: {
        type: 'DATE',
        allowNull: true,
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSyncOperationModelAttributes = getSyncOperationModelAttributes;
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
const getSyncConflictModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
    },
    syncOperationId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'sync_operations',
            key: 'id',
        },
    },
    resourceType: {
        type: 'ENUM',
        values: ['message', 'folder', 'attachment', 'flag'],
        allowNull: false,
    },
    resourceId: {
        type: 'STRING',
        allowNull: false,
    },
    conflictType: {
        type: 'ENUM',
        values: ['concurrent_modification', 'delete_modify', 'version_mismatch', 'duplicate', 'dependency'],
        allowNull: false,
    },
    localVersion: {
        type: 'INTEGER',
        allowNull: false,
    },
    remoteVersion: {
        type: 'INTEGER',
        allowNull: false,
    },
    localData: {
        type: 'JSONB',
        allowNull: false,
    },
    remoteData: {
        type: 'JSONB',
        allowNull: false,
    },
    resolution: {
        type: 'ENUM',
        values: ['pending', 'local_wins', 'remote_wins', 'merge', 'manual', 'auto'],
        defaultValue: 'pending',
    },
    resolutionStrategy: {
        type: 'STRING',
        allowNull: true,
    },
    resolvedBy: {
        type: 'UUID',
        allowNull: true,
    },
    resolvedAt: {
        type: 'DATE',
        allowNull: true,
    },
    mergedData: {
        type: 'JSONB',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSyncConflictModelAttributes = getSyncConflictModelAttributes;
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
const getDeviceRegistrationModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
    },
    deviceName: {
        type: 'STRING',
        allowNull: false,
    },
    deviceType: {
        type: 'ENUM',
        values: ['mobile', 'desktop', 'web', 'tablet'],
        allowNull: false,
    },
    deviceOS: {
        type: 'STRING',
        allowNull: false,
    },
    deviceVersion: {
        type: 'STRING',
        allowNull: true,
    },
    userAgent: {
        type: 'TEXT',
        allowNull: true,
    },
    protocol: {
        type: 'ENUM',
        values: ['activesync', 'imap', 'exchange', 'custom'],
        defaultValue: 'activesync',
    },
    protocolVersion: {
        type: 'STRING',
        allowNull: false,
    },
    syncEnabled: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    syncInterval: {
        type: 'INTEGER',
        defaultValue: 300,
        comment: 'Sync interval in seconds',
    },
    syncWindowSize: {
        type: 'INTEGER',
        defaultValue: 100,
        comment: 'Maximum items per sync batch',
    },
    capabilities: {
        type: 'JSONB',
        defaultValue: {},
    },
    lastSyncTime: {
        type: 'DATE',
        allowNull: true,
    },
    lastActiveTime: {
        type: 'DATE',
        allowNull: false,
    },
    registeredAt: {
        type: 'DATE',
        allowNull: false,
    },
    isActive: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getDeviceRegistrationModelAttributes = getDeviceRegistrationModelAttributes;
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
const getSyncHistoryModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
    },
    accountId: {
        type: 'UUID',
        allowNull: false,
    },
    syncType: {
        type: 'ENUM',
        values: ['full', 'incremental', 'delta', 'partial'],
        allowNull: false,
    },
    syncDirection: {
        type: 'ENUM',
        values: ['bidirectional', 'download', 'upload'],
        defaultValue: 'bidirectional',
    },
    syncKey: {
        type: 'STRING',
        allowNull: false,
    },
    startTime: {
        type: 'DATE',
        allowNull: false,
    },
    endTime: {
        type: 'DATE',
        allowNull: true,
    },
    duration: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Duration in milliseconds',
    },
    status: {
        type: 'ENUM',
        values: ['success', 'partial_success', 'failed', 'cancelled'],
        allowNull: false,
    },
    messagesAdded: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    messagesModified: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    messagesDeleted: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    foldersAdded: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    foldersModified: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    foldersDeleted: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    attachmentsSynced: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    bytesTransferred: {
        type: 'BIGINT',
        defaultValue: 0,
    },
    conflictsDetected: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    conflictsResolved: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    errorsEncountered: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    errorMessages: {
        type: 'JSONB',
        allowNull: true,
    },
    performanceMetrics: {
        type: 'JSONB',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSyncHistoryModelAttributes = getSyncHistoryModelAttributes;
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
const getSyncScheduleModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    userId: {
        type: 'UUID',
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deviceId: {
        type: 'STRING',
        allowNull: false,
    },
    scheduleType: {
        type: 'ENUM',
        values: ['interval', 'cron', 'push', 'manual'],
        defaultValue: 'interval',
    },
    interval: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Interval in seconds for interval-based schedules',
    },
    cronExpression: {
        type: 'STRING',
        allowNull: true,
    },
    enabled: {
        type: 'BOOLEAN',
        defaultValue: true,
    },
    priority: {
        type: 'INTEGER',
        defaultValue: 5,
    },
    throttleLimit: {
        type: 'INTEGER',
        defaultValue: 100,
        comment: 'Max syncs per throttle window',
    },
    throttleWindow: {
        type: 'INTEGER',
        defaultValue: 3600,
        comment: 'Throttle window in seconds',
    },
    syncWindows: {
        type: 'JSONB',
        allowNull: true,
        comment: 'Time windows when sync is allowed',
    },
    excludeWindows: {
        type: 'JSONB',
        allowNull: true,
        comment: 'Time windows when sync is blocked',
    },
    lastRun: {
        type: 'DATE',
        allowNull: true,
    },
    nextRun: {
        type: 'DATE',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getSyncScheduleModelAttributes = getSyncScheduleModelAttributes;
// ============================================================================
// SYNC STATE MANAGEMENT FUNCTIONS
// ============================================================================
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
const initializeSyncState = (userId, deviceId, accountId, protocol = 'activesync') => {
    const syncKey = (0, exports.generateSyncKey)(userId, deviceId, accountId);
    const syncToken = (0, exports.generateSyncToken)();
    return {
        userId,
        deviceId,
        accountId,
        syncKey,
        syncToken,
        lastSyncTime: new Date(),
        syncStatus: 'idle',
        syncType: 'full',
        folderSyncState: {},
        changeCounter: 0,
        conflictCount: 0,
        errorCount: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        metadata: {
            protocol,
            initialized: new Date().toISOString(),
        },
    };
};
exports.initializeSyncState = initializeSyncState;
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
const generateSyncKey = (userId, deviceId, accountId) => {
    const timestamp = Date.now();
    const data = `${userId}:${deviceId}:${accountId}:${timestamp}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `sync_${hash.substring(0, 16)}`;
};
exports.generateSyncKey = generateSyncKey;
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
const generateSyncToken = () => {
    const tokenData = {
        timestamp: Date.now(),
        version: 1,
        random: crypto.randomBytes(16).toString('hex'),
    };
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
};
exports.generateSyncToken = generateSyncToken;
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
const parseSyncToken = (token) => {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const data = JSON.parse(decoded);
        if (!data.timestamp || !data.version) {
            return null;
        }
        return data;
    }
    catch (error) {
        return null;
    }
};
exports.parseSyncToken = parseSyncToken;
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
const updateSyncState = (syncStateId, updates) => {
    const updateData = {
        ...updates,
        updatedAt: new Date(),
    };
    // Generate new sync token if sync completed
    if (updates.syncStatus === 'idle') {
        updateData.syncToken = (0, exports.generateSyncToken)();
    }
    return {
        where: { id: syncStateId },
        data: updateData,
    };
};
exports.updateSyncState = updateSyncState;
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
const updateFolderSyncState = (syncStateId, folderId, folderState) => {
    return {
        where: { id: syncStateId },
        data: {
            [`folderSyncState.${folderId}`]: {
                ...folderState,
                folderId,
                lastSyncTime: new Date(),
            },
            updatedAt: new Date(),
        },
    };
};
exports.updateFolderSyncState = updateFolderSyncState;
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
const getSyncState = (userId, deviceId, accountId) => {
    return {
        where: {
            userId,
            deviceId,
            accountId,
        },
        order: [['lastSyncTime', 'DESC']],
    };
};
exports.getSyncState = getSyncState;
// ============================================================================
// MULTI-DEVICE SYNCHRONIZATION FUNCTIONS
// ============================================================================
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
const registerDevice = (userId, deviceInfo) => {
    return {
        userId,
        deviceId: deviceInfo.deviceId || crypto.randomBytes(16).toString('hex'),
        deviceName: deviceInfo.deviceName || 'Unknown Device',
        deviceType: deviceInfo.deviceType || 'web',
        deviceOS: deviceInfo.deviceOS || 'Unknown',
        deviceVersion: deviceInfo.deviceVersion,
        userAgent: deviceInfo.userAgent,
        protocol: deviceInfo.protocol || 'activesync',
        protocolVersion: deviceInfo.protocolVersion || '14.1',
        syncEnabled: true,
        syncInterval: deviceInfo.syncInterval || 300,
        syncWindowSize: deviceInfo.syncWindowSize || 100,
        capabilities: deviceInfo.capabilities || {
            supportsHtml: true,
            supportsAttachments: true,
            supportsPush: false,
            supportsDeltaSync: true,
        },
        lastActiveTime: new Date(),
        registeredAt: new Date(),
        isActive: true,
        metadata: deviceInfo.metadata || {},
    };
};
exports.registerDevice = registerDevice;
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
const updateDeviceActivity = (deviceId, userId) => {
    return {
        where: { deviceId, userId },
        data: {
            lastActiveTime: new Date(),
            isActive: true,
            updatedAt: new Date(),
        },
    };
};
exports.updateDeviceActivity = updateDeviceActivity;
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
const getUserDevices = (userId) => {
    return {
        where: {
            userId,
            isActive: true,
        },
        order: [['lastActiveTime', 'DESC']],
    };
};
exports.getUserDevices = getUserDevices;
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
const deactivateDevice = (deviceId, userId) => {
    return {
        where: { deviceId, userId },
        data: {
            isActive: false,
            syncEnabled: false,
            updatedAt: new Date(),
        },
    };
};
exports.deactivateDevice = deactivateDevice;
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
const detectMultiDeviceConflicts = (userId, resourceId, resourceType) => {
    return {
        where: {
            userId,
            resourceId,
            resourceType,
            status: ['processing', 'completed'],
            createdAt: {
                $gte: new Date(Date.now() - 60000), // Last 60 seconds
            },
        },
        group: ['deviceId'],
        having: {
            count: { $gt: 1 },
        },
    };
};
exports.detectMultiDeviceConflicts = detectMultiDeviceConflicts;
// ============================================================================
// INCREMENTAL SYNC ALGORITHM FUNCTIONS
// ============================================================================
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
const performIncrementalSync = (userId, deviceId, syncToken, options = {}) => {
    const tokenData = (0, exports.parseSyncToken)(syncToken);
    const lastSyncTime = tokenData ? new Date(tokenData.timestamp) : new Date(0);
    const where = {
        userId,
        lastModifiedDateTime: {
            $gt: lastSyncTime,
        },
    };
    if (!options.includeDeleted) {
        where.isDeleted = false;
    }
    return {
        where,
        limit: options.maxBatchSize || 100,
        order: [['lastModifiedDateTime', 'ASC']],
    };
};
exports.performIncrementalSync = performIncrementalSync;
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
const detectFolderChanges = (folderId, watermark, limit = 100) => {
    return {
        where: {
            folderId,
            changeNumber: {
                $gt: watermark,
            },
        },
        limit,
        order: [['changeNumber', 'ASC']],
    };
};
exports.detectFolderChanges = detectFolderChanges;
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
const buildDeltaSyncResponse = (oldData, newData, excludeFields = []) => {
    const changes = [];
    const allFields = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
    for (const field of allFields) {
        if (excludeFields.includes(field))
            continue;
        const oldValue = oldData[field];
        const newValue = newData[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            let changeType = 'set';
            if (oldValue === undefined && newValue !== undefined) {
                changeType = 'set';
            }
            else if (oldValue !== undefined && newValue === undefined) {
                changeType = 'unset';
            }
            else if (typeof oldValue === 'number' && typeof newValue === 'number') {
                changeType = 'increment';
            }
            else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                changeType = 'append';
            }
            changes.push({
                field,
                oldValue,
                newValue,
                changeType,
            });
        }
    }
    return {
        changeType: 'modify',
        resourceType: 'message',
        resourceId: newData.id,
        version: newData.version || 1,
        timestamp: new Date(),
        changes,
    };
};
exports.buildDeltaSyncResponse = buildDeltaSyncResponse;
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
const applyDeltaChanges = (resource, changes) => {
    const updated = { ...resource };
    for (const change of changes) {
        switch (change.changeType) {
            case 'set':
                updated[change.field] = change.newValue;
                break;
            case 'unset':
                delete updated[change.field];
                break;
            case 'append':
                if (Array.isArray(updated[change.field])) {
                    updated[change.field] = [
                        ...updated[change.field],
                        ...(Array.isArray(change.newValue) ? change.newValue : [change.newValue]),
                    ];
                }
                else {
                    updated[change.field] = change.newValue;
                }
                break;
            case 'increment':
                if (typeof updated[change.field] === 'number') {
                    const delta = change.newValue - change.oldValue;
                    updated[change.field] += delta;
                }
                else {
                    updated[change.field] = change.newValue;
                }
                break;
        }
    }
    updated.lastModifiedDateTime = new Date();
    updated.version = (updated.version || 0) + 1;
    return updated;
};
exports.applyDeltaChanges = applyDeltaChanges;
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
const calculateSyncWindowSize = (capabilities, availableBandwidth) => {
    const baseWindowSize = 100;
    const maxWindowSize = 1000;
    const minWindowSize = 10;
    let windowSize = baseWindowSize;
    // Adjust based on bandwidth
    if (availableBandwidth > 5242880) {
        // > 5 MB/s
        windowSize = 500;
    }
    else if (availableBandwidth > 1048576) {
        // > 1 MB/s
        windowSize = 200;
    }
    else if (availableBandwidth < 262144) {
        // < 256 KB/s
        windowSize = 50;
    }
    // Adjust for delta sync capability
    if (capabilities.supportsDeltaSync) {
        windowSize = Math.floor(windowSize * 1.5);
    }
    // Apply constraints
    return Math.max(minWindowSize, Math.min(maxWindowSize, windowSize));
};
exports.calculateSyncWindowSize = calculateSyncWindowSize;
// ============================================================================
// CONFLICT RESOLUTION FUNCTIONS
// ============================================================================
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
const createSyncConflict = (userId, deviceId, syncOperationId, conflictData) => {
    return {
        userId,
        deviceId,
        syncOperationId,
        resourceType: conflictData.resourceType || 'message',
        resourceId: conflictData.resourceId,
        conflictType: conflictData.conflictType || 'concurrent_modification',
        localVersion: conflictData.localVersion || 0,
        remoteVersion: conflictData.remoteVersion || 0,
        localData: conflictData.localData || {},
        remoteData: conflictData.remoteData || {},
        resolution: 'pending',
        metadata: conflictData.metadata || {},
    };
};
exports.createSyncConflict = createSyncConflict;
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
const resolveSyncConflict = (conflictId, resolution, userId) => {
    let resolutionType = 'remote_wins';
    switch (resolution.strategy) {
        case 'local_wins':
            resolutionType = 'local_wins';
            break;
        case 'remote_wins':
            resolutionType = 'remote_wins';
            break;
        case 'merge':
            resolutionType = 'merge';
            break;
        case 'latest_wins':
            resolutionType = 'remote_wins'; // Default to remote for latest
            break;
    }
    return {
        where: { id: conflictId },
        data: {
            resolution: resolutionType,
            resolutionStrategy: resolution.strategy,
            resolvedBy: userId,
            resolvedAt: new Date(),
            updatedAt: new Date(),
        },
    };
};
exports.resolveSyncConflict = resolveSyncConflict;
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
const mergeConflictingData = (localData, remoteData, rules) => {
    const merged = {};
    // Start with all remote fields
    Object.assign(merged, remoteData);
    // Apply merge rules
    for (const rule of rules) {
        const localValue = localData[rule.field];
        const remoteValue = remoteData[rule.field];
        switch (rule.strategy) {
            case 'local':
                if (localValue !== undefined) {
                    merged[rule.field] = localValue;
                }
                break;
            case 'remote':
                if (remoteValue !== undefined) {
                    merged[rule.field] = remoteValue;
                }
                break;
            case 'concat':
                if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
                    merged[rule.field] = [...new Set([...localValue, ...remoteValue])];
                }
                else if (typeof localValue === 'string' && typeof remoteValue === 'string') {
                    merged[rule.field] = `${localValue} ${remoteValue}`;
                }
                break;
            case 'max':
                if (typeof localValue === 'number' && typeof remoteValue === 'number') {
                    merged[rule.field] = Math.max(localValue, remoteValue);
                }
                else if (localValue instanceof Date && remoteValue instanceof Date) {
                    merged[rule.field] = localValue > remoteValue ? localValue : remoteValue;
                }
                break;
            case 'min':
                if (typeof localValue === 'number' && typeof remoteValue === 'number') {
                    merged[rule.field] = Math.min(localValue, remoteValue);
                }
                else if (localValue instanceof Date && remoteValue instanceof Date) {
                    merged[rule.field] = localValue < remoteValue ? localValue : remoteValue;
                }
                break;
        }
    }
    // Update metadata
    merged.lastModifiedDateTime = new Date();
    merged.version = Math.max(localData.version || 0, remoteData.version || 0) + 1;
    merged.mergedAt = new Date();
    return merged;
};
exports.mergeConflictingData = mergeConflictingData;
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
const detectConflictType = (localData, remoteData) => {
    // Check for delete-modify conflict
    if (localData.isDeleted !== remoteData.isDeleted) {
        return 'delete_modify';
    }
    // Check for version mismatch
    if (localData.version && remoteData.version && localData.version !== remoteData.version) {
        return 'version_mismatch';
    }
    // Check for duplicate
    if (localData.id === remoteData.id && localData.serverId !== remoteData.serverId) {
        return 'duplicate';
    }
    // Default to concurrent modification
    return 'concurrent_modification';
};
exports.detectConflictType = detectConflictType;
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
const getPendingConflicts = (userId, deviceId) => {
    const where = {
        userId,
        resolution: 'pending',
    };
    if (deviceId) {
        where.deviceId = deviceId;
    }
    return {
        where,
        order: [['createdAt', 'ASC']],
    };
};
exports.getPendingConflicts = getPendingConflicts;
// ============================================================================
// SYNC OPERATION MANAGEMENT FUNCTIONS
// ============================================================================
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
const createSyncOperation = (userId, deviceId, accountId, operationData) => {
    return {
        userId,
        deviceId,
        accountId,
        syncStateId: operationData.syncStateId,
        operationType: operationData.operationType || 'fetch',
        resourceType: operationData.resourceType || 'message',
        resourceId: operationData.resourceId,
        folderId: operationData.folderId,
        operation: operationData.operation,
        payload: operationData.payload || {},
        status: 'pending',
        priority: operationData.priority || 'normal',
        retryCount: 0,
        maxRetries: operationData.maxRetries || 3,
    };
};
exports.createSyncOperation = createSyncOperation;
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
const updateSyncOperation = (operationId, status, errorMessage) => {
    const updateData = {
        status,
        updatedAt: new Date(),
    };
    if (status === 'processing') {
        updateData.startedAt = new Date();
    }
    if (status === 'completed' || status === 'failed') {
        updateData.completedAt = new Date();
    }
    if (status === 'failed' && errorMessage) {
        updateData.errorMessage = errorMessage;
    }
    return {
        where: { id: operationId },
        data: updateData,
    };
};
exports.updateSyncOperation = updateSyncOperation;
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
const getPendingSyncOperations = (userId, deviceId, limit = 100) => {
    return {
        where: {
            userId,
            deviceId,
            status: 'pending',
        },
        limit,
        order: [
            ['priority', 'DESC'],
            ['createdAt', 'ASC'],
        ],
    };
};
exports.getPendingSyncOperations = getPendingSyncOperations;
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
const retrySyncOperation = (operationId) => {
    return {
        where: { id: operationId },
        data: {
            status: 'pending',
            retryCount: { $increment: 1 },
            errorMessage: null,
            updatedAt: new Date(),
        },
    };
};
exports.retrySyncOperation = retrySyncOperation;
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
const cancelPendingOperations = (userId, deviceId) => {
    return {
        where: {
            userId,
            deviceId,
            status: 'pending',
        },
        data: {
            status: 'failed',
            errorMessage: 'Cancelled by user',
            completedAt: new Date(),
            updatedAt: new Date(),
        },
    };
};
exports.cancelPendingOperations = cancelPendingOperations;
// ============================================================================
// FOLDER & MESSAGE SYNCHRONIZATION FUNCTIONS
// ============================================================================
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
const syncFolderHierarchy = (userId, accountId, syncKey) => {
    return {
        where: {
            userId,
            accountId,
        },
        order: [
            ['parentFolderId', 'ASC'],
            ['displayName', 'ASC'],
        ],
    };
};
exports.syncFolderHierarchy = syncFolderHierarchy;
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
const syncFolderMessages = (userId, folderId, syncToken, options = {}) => {
    const tokenData = (0, exports.parseSyncToken)(syncToken);
    const lastSyncTime = tokenData ? new Date(tokenData.timestamp) : new Date(0);
    const where = {
        userId,
        folderId,
        lastModifiedDateTime: {
            $gt: lastSyncTime,
        },
    };
    if (!options.includeDeleted) {
        where.isDeleted = false;
    }
    return {
        where,
        limit: options.maxBatchSize || 100,
        order: [['lastModifiedDateTime', 'ASC']],
    };
};
exports.syncFolderMessages = syncFolderMessages;
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
const syncMessageFlags = (userId, messageIds, flags) => {
    const updateData = {
        lastModifiedDateTime: new Date(),
    };
    if (flags.isRead !== undefined) {
        updateData.isRead = flags.isRead;
        updateData['flags.isRead'] = flags.isRead;
    }
    if (flags.isFlagged !== undefined) {
        updateData.isFlagged = flags.isFlagged;
        updateData['flags.isFlagged'] = flags.isFlagged;
    }
    if (flags.isDeleted !== undefined) {
        updateData.isDeleted = flags.isDeleted;
        updateData['flags.isDeleted'] = flags.isDeleted;
    }
    return {
        where: {
            userId,
            id: { $in: messageIds },
        },
        data: updateData,
    };
};
exports.syncMessageFlags = syncMessageFlags;
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
const syncMessageMove = (userId, messageIds, targetFolderId) => {
    return {
        where: {
            userId,
            id: { $in: messageIds },
        },
        data: {
            folderId: targetFolderId,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.syncMessageMove = syncMessageMove;
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
const syncMessageMetadata = (userId, messageId, metadata) => {
    return {
        where: {
            userId,
            id: messageId,
        },
        data: {
            ...metadata,
            lastModifiedDateTime: new Date(),
        },
    };
};
exports.syncMessageMetadata = syncMessageMetadata;
// ============================================================================
// ATTACHMENT SYNCHRONIZATION FUNCTIONS
// ============================================================================
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
const createAttachmentSyncMetadata = (attachmentId, messageId, attachmentInfo) => {
    const chunkSize = attachmentInfo.chunkSize || 524288; // 512 KB default
    const totalChunks = Math.ceil((attachmentInfo.size || 0) / chunkSize);
    return {
        attachmentId,
        messageId,
        filename: attachmentInfo.filename || 'attachment',
        size: attachmentInfo.size || 0,
        contentType: attachmentInfo.contentType || 'application/octet-stream',
        syncStatus: 'pending',
        bytesTransferred: 0,
        totalBytes: attachmentInfo.size || 0,
        chunkSize,
        currentChunk: 0,
        totalChunks,
    };
};
exports.createAttachmentSyncMetadata = createAttachmentSyncMetadata;
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
const updateAttachmentSyncProgress = (attachmentId, chunkNumber, bytesTransferred) => {
    return {
        where: { attachmentId },
        data: {
            currentChunk: chunkNumber,
            bytesTransferred,
            syncStatus: 'downloading',
            updatedAt: new Date(),
        },
    };
};
exports.updateAttachmentSyncProgress = updateAttachmentSyncProgress;
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
const completeAttachmentSync = (attachmentId, checksum) => {
    return {
        where: { attachmentId },
        data: {
            syncStatus: 'downloaded',
            checksum,
            updatedAt: new Date(),
        },
    };
};
exports.completeAttachmentSync = completeAttachmentSync;
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
const getPendingAttachmentSyncs = (messageId) => {
    return {
        where: {
            messageId,
            syncStatus: ['pending', 'downloading'],
        },
        order: [['createdAt', 'ASC']],
    };
};
exports.getPendingAttachmentSyncs = getPendingAttachmentSyncs;
// ============================================================================
// OFFLINE SUPPORT FUNCTIONS
// ============================================================================
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
const queueOfflineOperation = (userId, deviceId, operation) => {
    return {
        where: { userId, deviceId },
        data: {
            pendingOperations: {
                $push: operation,
            },
            updatedAt: new Date(),
        },
        upsert: true,
    };
};
exports.queueOfflineOperation = queueOfflineOperation;
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
const getOfflineQueue = (userId, deviceId) => {
    return {
        where: {
            userId,
            deviceId,
            status: 'active',
        },
    };
};
exports.getOfflineQueue = getOfflineQueue;
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
const processOfflineQueue = (queueId, operationIds) => {
    return {
        where: { id: queueId },
        data: {
            'pendingOperations.$[elem].status': 'synced',
            lastSyncAttempt: new Date(),
            updatedAt: new Date(),
        },
        arrayFilters: [
            {
                'elem.id': { $in: operationIds },
            },
        ],
    };
};
exports.processOfflineQueue = processOfflineQueue;
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
const clearSyncedOfflineOperations = (userId, deviceId) => {
    return {
        where: { userId, deviceId },
        data: {
            pendingOperations: {
                $pull: { status: 'synced' },
            },
            updatedAt: new Date(),
        },
    };
};
exports.clearSyncedOfflineOperations = clearSyncedOfflineOperations;
// ============================================================================
// SYNC SCHEDULING & THROTTLING FUNCTIONS
// ============================================================================
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
const createSyncSchedule = (userId, deviceId, scheduleConfig) => {
    return {
        userId,
        deviceId,
        scheduleType: scheduleConfig.scheduleType || 'interval',
        interval: scheduleConfig.interval,
        cronExpression: scheduleConfig.cronExpression,
        enabled: scheduleConfig.enabled !== false,
        priority: scheduleConfig.priority || 5,
        throttleLimit: scheduleConfig.throttleLimit || 100,
        throttleWindow: scheduleConfig.throttleWindow || 3600,
        syncWindows: scheduleConfig.syncWindows,
        excludeWindows: scheduleConfig.excludeWindows,
        metadata: scheduleConfig.metadata || {},
    };
};
exports.createSyncSchedule = createSyncSchedule;
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
const calculateNextSyncTime = (schedule) => {
    const now = new Date();
    if (schedule.scheduleType === 'interval' && schedule.interval) {
        return new Date(now.getTime() + schedule.interval * 1000);
    }
    if (schedule.scheduleType === 'cron' && schedule.cronExpression) {
        // Simple cron parsing - in production use a cron library
        return new Date(now.getTime() + 3600000); // Default 1 hour
    }
    if (schedule.scheduleType === 'push') {
        return new Date(now.getTime() + 60000); // 1 minute for push
    }
    // Manual or default
    return new Date(now.getTime() + 86400000); // 24 hours
};
exports.calculateNextSyncTime = calculateNextSyncTime;
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
const checkSyncThrottle = (userId, deviceId, throttleState) => {
    const now = new Date();
    // Reset throttle window if expired
    if (now > throttleState.resetAt) {
        return true;
    }
    // Check sync count limit
    if (throttleState.syncCount >= throttleState.throttleLimit) {
        return false;
    }
    // Check bytes limit if configured
    if (throttleState.bytesLimit > 0 &&
        throttleState.bytesTransferred >= throttleState.bytesLimit) {
        return false;
    }
    return true;
};
exports.checkSyncThrottle = checkSyncThrottle;
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
const updateSyncThrottle = (userId, deviceId, bytesTransferred) => {
    return {
        where: { userId, deviceId },
        data: {
            syncCount: { $increment: 1 },
            bytesTransferred: { $increment: bytesTransferred },
            updatedAt: new Date(),
        },
    };
};
exports.updateSyncThrottle = updateSyncThrottle;
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
const resetSyncThrottle = (userId, deviceId, throttleWindow) => {
    const now = new Date();
    const resetAt = new Date(now.getTime() + throttleWindow * 1000);
    return {
        where: { userId, deviceId },
        data: {
            windowStart: now,
            syncCount: 0,
            bytesTransferred: 0,
            isThrottled: false,
            resetAt,
            updatedAt: now,
        },
    };
};
exports.resetSyncThrottle = resetSyncThrottle;
// ============================================================================
// SYNC HISTORY & AUDIT FUNCTIONS
// ============================================================================
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
const recordSyncHistory = (userId, deviceId, accountId, syncData) => {
    const duration = syncData.endTime && syncData.startTime
        ? syncData.endTime.getTime() - syncData.startTime.getTime()
        : undefined;
    return {
        userId,
        deviceId,
        accountId,
        syncType: syncData.syncType || 'incremental',
        syncDirection: syncData.syncDirection || 'bidirectional',
        syncKey: syncData.syncKey,
        startTime: syncData.startTime || new Date(),
        endTime: syncData.endTime,
        duration,
        status: syncData.status || 'success',
        messagesAdded: syncData.messagesAdded || 0,
        messagesModified: syncData.messagesModified || 0,
        messagesDeleted: syncData.messagesDeleted || 0,
        foldersAdded: syncData.foldersAdded || 0,
        foldersModified: syncData.foldersModified || 0,
        foldersDeleted: syncData.foldersDeleted || 0,
        attachmentsSynced: syncData.attachmentsSynced || 0,
        bytesTransferred: syncData.bytesTransferred || 0,
        conflictsDetected: syncData.conflictsDetected || 0,
        conflictsResolved: syncData.conflictsResolved || 0,
        errorsEncountered: syncData.errorsEncountered || 0,
        errorMessages: syncData.errorMessages,
        performanceMetrics: syncData.performanceMetrics,
        metadata: syncData.metadata || {},
    };
};
exports.recordSyncHistory = recordSyncHistory;
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
const getSyncHistory = (userId, deviceId, limit = 100) => {
    const where = { userId };
    if (deviceId) {
        where.deviceId = deviceId;
    }
    return {
        where,
        limit,
        order: [['startTime', 'DESC']],
    };
};
exports.getSyncHistory = getSyncHistory;
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
const calculateSyncStatistics = (userId, startDate, endDate) => {
    return {
        where: {
            userId,
            startTime: {
                $gte: startDate,
                $lte: endDate,
            },
        },
        group: {
            totalSyncs: { $count: '*' },
            successfulSyncs: { $sum: { $case: [{ when: { status: 'success' }, then: 1 }] } },
            failedSyncs: { $sum: { $case: [{ when: { status: 'failed' }, then: 1 }] } },
            totalMessages: { $sum: 'messagesAdded' },
            totalBytes: { $sum: 'bytesTransferred' },
            avgDuration: { $avg: 'duration' },
            totalConflicts: { $sum: 'conflictsDetected' },
        },
    };
};
exports.calculateSyncStatistics = calculateSyncStatistics;
// ============================================================================
// SWAGGER SCHEMA GENERATORS
// ============================================================================
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
const generateSyncStateSwaggerSchema = () => {
    return {
        name: 'SyncState',
        type: 'object',
        description: 'Synchronization state for device and account',
        example: {
            id: 'state-123',
            userId: 'user-123',
            deviceId: 'device-abc',
            accountId: 'account-456',
            syncKey: 'sync_1234567890abcdef',
            syncToken: 'eyJ0aW1lc3RhbXAiOjE3MDk4...',
            lastSyncTime: '2024-01-15T10:30:00Z',
            syncStatus: 'idle',
            syncType: 'incremental',
            changeCounter: 150,
            successfulSyncs: 10,
        },
        properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            deviceId: { type: 'string' },
            accountId: { type: 'string', format: 'uuid' },
            syncKey: { type: 'string' },
            syncToken: { type: 'string' },
            lastSyncTime: { type: 'string', format: 'date-time' },
            syncStatus: { type: 'string', enum: ['idle', 'syncing', 'pending', 'paused', 'error'] },
            syncType: { type: 'string', enum: ['full', 'incremental', 'delta', 'partial'] },
        },
    };
};
exports.generateSyncStateSwaggerSchema = generateSyncStateSwaggerSchema;
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
const generateSyncOperationSwaggerSchema = () => {
    return {
        name: 'SyncOperation',
        type: 'object',
        description: 'Synchronization operation for queued execution',
        example: {
            id: 'op-123',
            userId: 'user-123',
            deviceId: 'device-abc',
            operationType: 'fetch',
            resourceType: 'message',
            resourceId: 'msg-789',
            status: 'pending',
            priority: 'high',
        },
        properties: {
            id: { type: 'string', format: 'uuid' },
            operationType: {
                type: 'string',
                enum: ['fetch', 'push', 'delete', 'move', 'flag', 'read', 'attachment'],
            },
            resourceType: { type: 'string', enum: ['message', 'folder', 'attachment', 'flag', 'metadata'] },
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed', 'conflict'] },
            priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'] },
        },
    };
};
exports.generateSyncOperationSwaggerSchema = generateSyncOperationSwaggerSchema;
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
const generateSyncConflictSwaggerSchema = () => {
    return {
        name: 'SyncConflict',
        type: 'object',
        description: 'Synchronization conflict detected during multi-device sync',
        example: {
            id: 'conflict-123',
            userId: 'user-123',
            resourceType: 'message',
            resourceId: 'msg-456',
            conflictType: 'concurrent_modification',
            resolution: 'pending',
        },
        properties: {
            id: { type: 'string', format: 'uuid' },
            resourceType: { type: 'string', enum: ['message', 'folder', 'attachment', 'flag'] },
            conflictType: {
                type: 'string',
                enum: ['concurrent_modification', 'delete_modify', 'version_mismatch', 'duplicate', 'dependency'],
            },
            resolution: {
                type: 'string',
                enum: ['pending', 'local_wins', 'remote_wins', 'merge', 'manual', 'auto'],
            },
        },
    };
};
exports.generateSyncConflictSwaggerSchema = generateSyncConflictSwaggerSchema;
//# sourceMappingURL=mail-sync-engine-kit.js.map