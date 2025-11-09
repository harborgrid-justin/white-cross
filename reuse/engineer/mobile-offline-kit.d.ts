/**
 * LOC: MOBILE_OFFLINE_KIT_001
 * File: /reuse/engineer/mobile-offline-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto (Node.js built-in)
 *   - express
 *   - IndexedDB API (browser)
 *   - Service Worker API (browser)
 *
 * DOWNSTREAM (imported by):
 *   - Mobile application services
 *   - Offline sync managers
 *   - PWA controllers
 *   - Background sync workers
 *   - Mobile authentication services
 *   - Push notification handlers
 */
/**
 * Sync operation status
 */
export declare enum SyncStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CONFLICT = "conflict"
}
/**
 * Conflict resolution strategy
 */
export declare enum ConflictStrategy {
    CLIENT_WINS = "client_wins",
    SERVER_WINS = "server_wins",
    LAST_WRITE_WINS = "last_write_wins",
    MERGE = "merge",
    MANUAL = "manual"
}
/**
 * Network status
 */
export declare enum NetworkStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    SLOW_2G = "slow-2g",
    FAST_3G = "fast-3g",
    FAST_4G = "fast-4g",
    WIFI = "wifi"
}
/**
 * Sync operation record
 */
export interface SyncOperation {
    id: string;
    entityType: string;
    entityId: string;
    operation: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
    status: SyncStatus;
    retryCount: number;
    lastError?: string;
    clientVersion?: string;
    serverVersion?: string;
}
/**
 * Conflict record
 */
export interface DataConflict {
    id: string;
    entityType: string;
    entityId: string;
    clientData: any;
    serverData: any;
    clientTimestamp: number;
    serverTimestamp: number;
    resolvedData?: any;
    strategy?: ConflictStrategy;
    metadata?: Record<string, any>;
}
/**
 * Offline storage configuration
 */
export interface OfflineStorageConfig {
    dbName: string;
    version: number;
    stores: string[];
    maxSize?: number;
    evictionPolicy?: 'lru' | 'fifo' | 'priority';
}
/**
 * Sync queue item
 */
export interface SyncQueueItem {
    id: string;
    priority: number;
    operation: SyncOperation;
    createdAt: number;
    scheduledFor?: number;
}
/**
 * Mobile API response optimization config
 */
export interface MobileResponseConfig {
    compress: boolean;
    minify: boolean;
    fields?: string[];
    maxDepth?: number;
    imageQuality?: 'low' | 'medium' | 'high';
    paginate?: boolean;
    pageSize?: number;
}
/**
 * Push notification payload
 */
export interface PushNotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: Record<string, any>;
    actions?: Array<{
        action: string;
        title: string;
    }>;
    tag?: string;
    requireInteraction?: boolean;
}
/**
 * Mobile auth token
 */
export interface MobileAuthToken {
    accessToken: string;
    refreshToken: string;
    deviceId: string;
    expiresAt: number;
    scope: string[];
    metadata?: Record<string, any>;
}
/**
 * Network condition
 */
export interface NetworkCondition {
    status: NetworkStatus;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
    timestamp: number;
}
/**
 * PWA manifest
 */
export interface PwaManifest {
    name: string;
    shortName: string;
    description: string;
    startUrl: string;
    display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
    backgroundColor: string;
    themeColor: string;
    icons: Array<{
        src: string;
        sizes: string;
        type: string;
    }>;
    orientation?: 'portrait' | 'landscape' | 'any';
}
/**
 * 1. Create sync operation for offline queue
 * @param entityType - Type of entity being synced
 * @param entityId - Entity identifier
 * @param operation - CRUD operation type
 * @param data - Operation data
 * @returns Sync operation object
 */
export declare const createSyncOperation: (entityType: string, entityId: string, operation: "create" | "update" | "delete", data: any) => SyncOperation;
/**
 * 2. Add operation to sync queue with priority
 * @param queue - Current sync queue
 * @param operation - Sync operation to add
 * @param priority - Priority level (higher = more important)
 * @returns Updated queue
 */
export declare const enqueueSyncOperation: (queue: SyncQueueItem[], operation: SyncOperation, priority?: number) => SyncQueueItem[];
/**
 * 3. Process sync queue and sync with server
 * @param queue - Sync queue to process
 * @param syncEndpoint - Server sync endpoint
 * @param batchSize - Number of operations per batch
 * @returns Processing results
 */
export declare const processSyncQueue: (queue: SyncQueueItem[], syncEndpoint: string, batchSize?: number) => Promise<{
    successful: string[];
    failed: string[];
    conflicts: DataConflict[];
}>;
/**
 * 4. Detect data conflicts between client and server
 * @param clientData - Client version of data
 * @param serverData - Server version of data
 * @param entityType - Type of entity
 * @param entityId - Entity identifier
 * @returns Conflict object or null if no conflict
 */
export declare const detectDataConflict: (clientData: any, serverData: any, entityType: string, entityId: string) => DataConflict | null;
/**
 * 5. Resolve data conflict using specified strategy
 * @param conflict - Data conflict to resolve
 * @param strategy - Resolution strategy
 * @returns Resolved data
 */
export declare const resolveDataConflict: (conflict: DataConflict, strategy: ConflictStrategy) => any;
/**
 * 6. Merge two data objects intelligently
 * @param clientData - Client data
 * @param serverData - Server data
 * @returns Merged data
 */
export declare const mergeDataObjects: (clientData: any, serverData: any) => any;
/**
 * 7. Generate version hash for data object
 * @param data - Data to hash
 * @returns Version hash string
 */
export declare const generateVersionHash: (data: any) => string;
/**
 * 8. Implement incremental sync mechanism
 * @param lastSyncTimestamp - Last successful sync timestamp
 * @param syncEndpoint - Server sync endpoint
 * @returns Incremental sync data
 */
export declare const performIncrementalSync: (lastSyncTimestamp: number, syncEndpoint: string) => Promise<{
    updated: any[];
    deleted: string[];
    timestamp: number;
}>;
/**
 * 9. Calculate sync delta between local and remote data
 * @param localData - Local dataset
 * @param remoteData - Remote dataset
 * @returns Sync delta with changes
 */
export declare const calculateSyncDelta: (localData: any[], remoteData: any[]) => {
    toCreate: any[];
    toUpdate: any[];
    toDelete: string[];
};
/**
 * 10. Implement delta compression for sync payload
 * @param previousState - Previous data state
 * @param currentState - Current data state
 * @returns Compressed delta
 */
export declare const compressSyncDelta: (previousState: any, currentState: any) => {
    operations: Array<{
        path: string;
        op: string;
        value?: any;
    }>;
};
/**
 * 11. Initialize offline storage database
 * @param config - Storage configuration
 * @returns Storage initialization status
 */
export declare const initializeOfflineStorage: (config: OfflineStorageConfig) => {
    success: boolean;
    dbName: string;
    stores: string[];
};
/**
 * 12. Store data in offline cache
 * @param storeName - Storage store name
 * @param key - Data key
 * @param data - Data to store
 * @returns Storage operation result
 */
export declare const storeOfflineData: (storeName: string, key: string, data: any) => Promise<{
    success: boolean;
    key: string;
}>;
/**
 * 13. Retrieve data from offline cache
 * @param storeName - Storage store name
 * @param key - Data key
 * @returns Retrieved data or null
 */
export declare const retrieveOfflineData: (storeName: string, key: string) => Promise<any | null>;
/**
 * 14. Clear offline storage for specific entity type
 * @param storeName - Storage store name
 * @param entityType - Entity type to clear
 * @returns Deletion count
 */
export declare const clearOfflineStorage: (storeName: string, entityType?: string) => Promise<{
    cleared: number;
}>;
/**
 * 15. Implement LRU cache eviction policy
 * @param storeName - Storage store name
 * @param maxSize - Maximum cache size
 * @returns Evicted items count
 */
export declare const evictLruCacheItems: (storeName: string, maxSize: number) => Promise<{
    evicted: number;
}>;
/**
 * 16. Calculate offline storage usage
 * @param storeName - Storage store name
 * @returns Storage usage statistics
 */
export declare const calculateStorageUsage: (storeName: string) => Promise<{
    used: number;
    available: number;
    percentage: number;
}>;
/**
 * 17. Optimize API response for mobile clients
 * @param data - Original response data
 * @param config - Mobile optimization config
 * @returns Optimized response
 */
export declare const optimizeForMobile: (data: any, config: MobileResponseConfig) => any;
/**
 * 18. Select specific fields from response object
 * @param data - Data object
 * @param fields - Fields to include
 * @returns Filtered object
 */
export declare const selectFields: (data: any, fields: string[]) => any;
/**
 * 19. Limit object depth for mobile responses
 * @param data - Data object
 * @param maxDepth - Maximum nesting depth
 * @param currentDepth - Current depth level
 * @returns Depth-limited object
 */
export declare const limitDepth: (data: any, maxDepth: number, currentDepth?: number) => any;
/**
 * 20. Compress response payload for mobile
 * @param data - Response data
 * @returns Compressed data info
 */
export declare const compressResponse: (data: any) => {
    compressed: string;
    originalSize: number;
    compressedSize: number;
    ratio: number;
};
/**
 * 21. Generate pagination metadata for mobile
 * @param total - Total items count
 * @param page - Current page
 * @param pageSize - Items per page
 * @returns Pagination metadata
 */
export declare const generatePaginationMetadata: (total: number, page: number, pageSize: number) => {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/**
 * 22. Create optimistic update for UI
 * @param entityType - Entity type
 * @param operation - Operation type
 * @param data - Optimistic data
 * @returns Optimistic update object
 */
export declare const createOptimisticUpdate: (entityType: string, operation: "create" | "update" | "delete", data: any) => {
    id: string;
    entityType: string;
    operation: string;
    data: any;
    timestamp: number;
};
/**
 * 23. Rollback optimistic update on failure
 * @param optimisticId - Optimistic update ID
 * @param previousState - Previous state to restore
 * @returns Rollback result
 */
export declare const rollbackOptimisticUpdate: (optimisticId: string, previousState: any) => {
    id: string;
    restored: any;
    timestamp: number;
};
/**
 * 24. Confirm optimistic update with server response
 * @param optimisticId - Optimistic update ID
 * @param serverResponse - Server confirmation
 * @returns Confirmation result
 */
export declare const confirmOptimisticUpdate: (optimisticId: string, serverResponse: any) => {
    id: string;
    confirmed: boolean;
    data: any;
};
/**
 * 25. Detect current network status
 * @returns Network condition information
 */
export declare const detectNetworkStatus: () => NetworkCondition;
/**
 * 26. Determine if network is suitable for sync
 * @param condition - Network condition
 * @param minSpeed - Minimum required speed (Mbps)
 * @returns Whether sync should proceed
 */
export declare const isSyncAppropriate: (condition: NetworkCondition, minSpeed?: number) => boolean;
/**
 * 27. Throttle API requests based on network speed
 * @param condition - Network condition
 * @returns Recommended request delay (ms)
 */
export declare const calculateThrottleDelay: (condition: NetworkCondition) => number;
/**
 * 28. Register background sync task
 * @param tag - Sync tag identifier
 * @param operation - Sync operation
 * @returns Registration result
 */
export declare const registerBackgroundSync: (tag: string, operation: SyncOperation) => {
    registered: boolean;
    tag: string;
};
/**
 * 29. Process background sync queue
 * @param tag - Sync tag
 * @param operations - Operations to process
 * @returns Processing result
 */
export declare const processBackgroundSync: (tag: string, operations: SyncOperation[]) => Promise<{
    processed: number;
    failed: number;
}>;
/**
 * 30. Schedule delayed sync operation
 * @param operation - Sync operation
 * @param delayMs - Delay in milliseconds
 * @returns Scheduled task info
 */
export declare const scheduleDelayedSync: (operation: SyncOperation, delayMs: number) => {
    taskId: string;
    scheduledFor: number;
};
/**
 * 31. Generate mobile auth token with device binding
 * @param userId - User identifier
 * @param deviceId - Device identifier
 * @param scope - Token scope
 * @returns Mobile auth token
 */
export declare const generateMobileAuthToken: (userId: string, deviceId: string, scope: string[]) => MobileAuthToken;
/**
 * 32. Refresh mobile auth token
 * @param refreshToken - Refresh token
 * @param deviceId - Device identifier
 * @returns New auth token
 */
export declare const refreshMobileAuthToken: (refreshToken: string, deviceId: string) => Promise<MobileAuthToken>;
/**
 * 33. Validate mobile device binding
 * @param token - Auth token
 * @param deviceId - Device identifier to verify
 * @returns Validation result
 */
export declare const validateDeviceBinding: (token: MobileAuthToken, deviceId: string) => boolean;
/**
 * 34. Revoke mobile auth token
 * @param token - Token to revoke
 * @returns Revocation result
 */
export declare const revokeMobileAuthToken: (token: string) => Promise<{
    revoked: boolean;
    timestamp: number;
}>;
/**
 * 35. Create push notification payload
 * @param title - Notification title
 * @param body - Notification body
 * @param options - Additional options
 * @returns Push notification payload
 */
export declare const createPushNotification: (title: string, body: string, options?: Partial<PushNotificationPayload>) => PushNotificationPayload;
/**
 * 36. Send push notification to device
 * @param deviceToken - Device push token
 * @param payload - Notification payload
 * @returns Send result
 */
export declare const sendPushNotification: (deviceToken: string, payload: PushNotificationPayload) => Promise<{
    sent: boolean;
    messageId: string;
}>;
/**
 * 37. Subscribe device to push notifications
 * @param deviceId - Device identifier
 * @param pushToken - Push notification token
 * @returns Subscription result
 */
export declare const subscribeToPushNotifications: (deviceId: string, pushToken: string) => Promise<{
    subscribed: boolean;
    deviceId: string;
}>;
/**
 * 38. Unsubscribe device from push notifications
 * @param deviceId - Device identifier
 * @returns Unsubscription result
 */
export declare const unsubscribeFromPushNotifications: (deviceId: string) => Promise<{
    unsubscribed: boolean;
}>;
/**
 * 39. Generate PWA manifest
 * @param config - App configuration
 * @returns PWA manifest object
 */
export declare const generatePwaManifest: (config: {
    name: string;
    shortName: string;
    description: string;
}) => PwaManifest;
/**
 * 40. Check PWA installation status
 * @returns Installation status
 */
export declare const checkPwaInstallation: () => {
    installed: boolean;
    installable: boolean;
    standalone: boolean;
};
/**
 * 41. Trigger PWA install prompt
 * @returns Install prompt result
 */
export declare const triggerPwaInstallPrompt: () => Promise<{
    prompted: boolean;
    outcome: "accepted" | "dismissed" | "unavailable";
}>;
/**
 * 42. Generate service worker cache strategy
 * @param resources - Resources to cache
 * @param strategy - Caching strategy
 * @returns Cache configuration
 */
export declare const generateCacheStrategy: (resources: string[], strategy: "cache-first" | "network-first" | "stale-while-revalidate") => {
    strategy: string;
    resources: string[];
    version: string;
};
/**
 * 43. Update service worker cache
 * @param cacheName - Cache name
 * @param resources - Resources to update
 * @returns Update result
 */
export declare const updateServiceWorkerCache: (cacheName: string, resources: string[]) => Promise<{
    updated: number;
    failed: number;
}>;
/**
 * 44. Clear outdated service worker caches
 * @param currentVersion - Current cache version
 * @returns Cleanup result
 */
export declare const clearOutdatedCaches: (currentVersion: string) => Promise<{
    cleared: string[];
}>;
/**
 * 45. Precache critical resources for offline
 * @param resources - Critical resources to precache
 * @returns Precache result
 */
export declare const precacheCriticalResources: (resources: string[]) => Promise<{
    cached: number;
    failed: string[];
}>;
//# sourceMappingURL=mobile-offline-kit.d.ts.map