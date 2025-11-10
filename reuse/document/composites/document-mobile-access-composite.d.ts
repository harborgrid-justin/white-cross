/**
 * LOC: DOCMOBILEACC001
 * File: /reuse/document/composites/document-mobile-access-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-mobile-kit
 *   - ../document-signing-kit
 *   - ../document-rendering-kit
 *   - ../document-cloud-storage-kit
 *   - ../document-annotation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Mobile document controllers
 *   - React Native document services
 *   - Mobile biometric authentication modules
 *   - Offline document sync services
 *   - Mobile rendering engines
 *   - Healthcare mobile apps
 */
/**
 * File: /reuse/document/composites/document-mobile-access-composite.ts
 * Locator: WC-DOCMOBILEACCESS-COMPOSITE-001
 * Purpose: Comprehensive Mobile Document Access Toolkit - Production-ready mobile viewing, signing, offline sync, responsive UI
 *
 * Upstream: Composed from document-mobile-kit, document-signing-kit, document-rendering-kit, document-cloud-storage-kit, document-annotation-kit
 * Downstream: ../backend/*, Mobile document controllers, React Native services, Biometric authentication, Offline sync
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, react-native, crypto
 * Exports: 45 utility functions for mobile document access, offline sync, biometric signing, responsive rendering, mobile annotations
 *
 * LLM Context: Enterprise-grade mobile document access toolkit for White Cross healthcare platform.
 * Provides comprehensive mobile document management including offline-first architecture, biometric authentication
 * for secure document signing, responsive document rendering optimized for mobile devices, real-time synchronization,
 * conflict resolution, mobile-optimized annotations, camera-based document capture, QR code scanning, push notifications,
 * bandwidth-aware transfers, encrypted local storage, and HIPAA-compliant mobile workflows. Composes functions from
 * multiple document kits to provide unified mobile document operations for viewing, signing, annotating, and syncing
 * medical records on iOS and Android devices.
 */
import { Model } from 'sequelize-typescript';
/**
 * Mobile platform enumeration
 */
export declare enum MobilePlatform {
    IOS = "IOS",
    ANDROID = "ANDROID",
    WEB_MOBILE = "WEB_MOBILE",
    TABLET = "TABLET"
}
/**
 * Biometric authentication type
 */
export declare enum BiometricType {
    TOUCH_ID = "TOUCH_ID",
    FACE_ID = "FACE_ID",
    FINGERPRINT = "FINGERPRINT",
    IRIS = "IRIS",
    VOICE = "VOICE",
    NONE = "NONE"
}
/**
 * Document sync status
 */
export declare enum MobileSyncStatus {
    PENDING = "PENDING",
    SYNCING = "SYNCING",
    SYNCED = "SYNCED",
    CONFLICT = "CONFLICT",
    ERROR = "ERROR",
    OFFLINE_QUEUED = "OFFLINE_QUEUED"
}
/**
 * Network quality indicator
 */
export declare enum NetworkQuality {
    EXCELLENT = "EXCELLENT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR",
    OFFLINE = "OFFLINE"
}
/**
 * Mobile rendering mode
 */
export declare enum MobileRenderMode {
    NATIVE = "NATIVE",
    WEBVIEW = "WEBVIEW",
    HYBRID = "HYBRID",
    RESPONSIVE = "RESPONSIVE"
}
/**
 * Touch gesture type
 */
export declare enum TouchGestureType {
    TAP = "TAP",
    DOUBLE_TAP = "DOUBLE_TAP",
    LONG_PRESS = "LONG_PRESS",
    SWIPE = "SWIPE",
    PINCH = "PINCH",
    ROTATE = "ROTATE"
}
/**
 * Mobile device information
 */
export interface MobileDeviceInfo {
    id: string;
    userId: string;
    platform: MobilePlatform;
    osVersion: string;
    appVersion: string;
    deviceModel: string;
    deviceId: string;
    pushToken?: string;
    biometricCapabilities: BiometricType[];
    screenWidth: number;
    screenHeight: number;
    isTablet: boolean;
    metadata?: Record<string, any>;
}
/**
 * Offline document configuration
 */
export interface OfflineDocumentConfig {
    documentId: string;
    deviceId: string;
    downloadPriority: number;
    autoSync: boolean;
    syncFrequency?: number;
    retentionDays?: number;
    encryptionKey: string;
    compressionEnabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Mobile sync operation
 */
export interface MobileSyncOperation {
    id: string;
    deviceId: string;
    documentId: string;
    syncType: 'UPLOAD' | 'DOWNLOAD' | 'BIDIRECTIONAL';
    status: MobileSyncStatus;
    startTime: Date;
    endTime?: Date;
    bytesTransferred: number;
    totalBytes: number;
    error?: string;
    conflictResolution?: 'SERVER_WINS' | 'CLIENT_WINS' | 'MANUAL' | 'MERGE';
    metadata?: Record<string, any>;
}
/**
 * Mobile signature request
 */
export interface MobileSignatureRequest {
    documentId: string;
    deviceId: string;
    userId: string;
    biometricType: BiometricType;
    signaturePosition: {
        page: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    timestamp: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Mobile annotation data
 */
export interface MobileAnnotation {
    id: string;
    documentId: string;
    deviceId: string;
    userId: string;
    type: 'TEXT' | 'DRAWING' | 'HIGHLIGHT' | 'VOICE' | 'PHOTO';
    page: number;
    coordinates: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    };
    content: any;
    touchGesture?: TouchGestureType;
    syncStatus: MobileSyncStatus;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Mobile rendering configuration
 */
export interface MobileRenderConfig {
    mode: MobileRenderMode;
    targetWidth: number;
    targetHeight: number;
    dpi: number;
    quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
    enableCaching: boolean;
    enableLazyLoading: boolean;
    enableProgressiveRender: boolean;
    pageRangeStart?: number;
    pageRangeEnd?: number;
    metadata?: Record<string, any>;
}
/**
 * Bandwidth monitor configuration
 */
export interface BandwidthMonitor {
    currentQuality: NetworkQuality;
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    isMetered: boolean;
    adaptiveQuality: boolean;
}
/**
 * Mobile Device Model
 * Stores registered mobile devices for document access
 */
export declare class MobileDeviceModel extends Model {
    id: string;
    userId: string;
    platform: MobilePlatform;
    osVersion: string;
    appVersion: string;
    deviceModel: string;
    deviceId: string;
    pushToken?: string;
    biometricCapabilities: BiometricType[];
    screenWidth: number;
    screenHeight: number;
    isTablet: boolean;
    isActive: boolean;
    lastActiveAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Offline Document Model
 * Stores documents downloaded for offline access
 */
export declare class OfflineDocumentModel extends Model {
    id: string;
    deviceId: string;
    documentId: string;
    downloadPriority: number;
    autoSync: boolean;
    syncFrequency?: number;
    syncStatus: MobileSyncStatus;
    lastSyncAt?: Date;
    encryptionKey: string;
    compressionEnabled: boolean;
    cachedSize?: number;
    expiresAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Mobile Sync Operation Model
 * Tracks synchronization operations for mobile devices
 */
export declare class MobileSyncOperationModel extends Model {
    id: string;
    deviceId: string;
    documentId: string;
    syncType: 'UPLOAD' | 'DOWNLOAD' | 'BIDIRECTIONAL';
    status: MobileSyncStatus;
    startTime: Date;
    endTime?: Date;
    bytesTransferred: number;
    totalBytes: number;
    error?: string;
    conflictResolution?: 'SERVER_WINS' | 'CLIENT_WINS' | 'MANUAL' | 'MERGE';
    metadata?: Record<string, any>;
}
/**
 * Mobile Signature Model
 * Stores biometric signature records from mobile devices
 */
export declare class MobileSignatureModel extends Model {
    id: string;
    documentId: string;
    deviceId: string;
    userId: string;
    biometricType: BiometricType;
    signatureData: string;
    biometricToken: string;
    signaturePosition: {
        page: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    signedAt: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
    ipAddress?: string;
    isValid: boolean;
    metadata?: Record<string, any>;
}
/**
 * Mobile Annotation Model
 * Stores annotations created on mobile devices
 */
export declare class MobileAnnotationModel extends Model {
    id: string;
    documentId: string;
    deviceId: string;
    userId: string;
    type: 'TEXT' | 'DRAWING' | 'HIGHLIGHT' | 'VOICE' | 'PHOTO';
    page: number;
    coordinates: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    };
    content: any;
    touchGesture?: TouchGestureType;
    syncStatus: MobileSyncStatus;
    metadata?: Record<string, any>;
}
/**
 * Registers a new mobile device for document access.
 * Creates device record with biometric capabilities and push notification setup.
 *
 * @param {MobileDeviceInfo} deviceInfo - Device registration information
 * @returns {Promise<string>} Device ID
 *
 * @example
 * ```typescript
 * const deviceId = await registerMobileDevice({
 *   userId: 'user-123',
 *   platform: MobilePlatform.IOS,
 *   osVersion: '16.0',
 *   appVersion: '2.1.0',
 *   deviceModel: 'iPhone 14 Pro',
 *   deviceId: 'unique-device-id',
 *   biometricCapabilities: [BiometricType.FACE_ID],
 *   screenWidth: 1179,
 *   screenHeight: 2556,
 *   isTablet: false
 * });
 * ```
 */
export declare const registerMobileDevice: (deviceInfo: MobileDeviceInfo) => Promise<string>;
/**
 * Configures offline document access for a mobile device.
 * Sets up encryption, compression, and sync settings.
 *
 * @param {OfflineDocumentConfig} config - Offline configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configureOfflineDocument({
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   downloadPriority: 5,
 *   autoSync: true,
 *   syncFrequency: 300,
 *   encryptionKey: 'secure-key',
 *   compressionEnabled: true
 * });
 * ```
 */
export declare const configureOfflineDocument: (config: OfflineDocumentConfig) => Promise<void>;
/**
 * Downloads document for offline access with encryption and compression.
 * Implements bandwidth-aware progressive download.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {BandwidthMonitor} bandwidth - Current bandwidth status
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const syncOp = await downloadDocumentOffline('doc-123', 'device-456', bandwidthMonitor);
 * ```
 */
export declare const downloadDocumentOffline: (documentId: string, deviceId: string, bandwidth: BandwidthMonitor) => Promise<MobileSyncOperation>;
/**
 * Synchronizes offline changes back to server.
 * Handles conflict detection and resolution.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const syncResult = await syncOfflineChanges('doc-123', 'device-456');
 * ```
 */
export declare const syncOfflineChanges: (documentId: string, deviceId: string) => Promise<MobileSyncOperation>;
/**
 * Resolves document synchronization conflicts.
 * Implements conflict resolution strategies.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {'SERVER_WINS' | 'CLIENT_WINS' | 'MERGE'} strategy - Resolution strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveDocumentConflict('doc-123', 'device-456', 'MERGE');
 * ```
 */
export declare const resolveDocumentConflict: (documentId: string, deviceId: string, strategy: "SERVER_WINS" | "CLIENT_WINS" | "MANUAL" | "MERGE") => Promise<void>;
/**
 * Authenticates user with biometric verification.
 * Validates Touch ID, Face ID, or fingerprint.
 *
 * @param {string} deviceId - Device identifier
 * @param {BiometricType} biometricType - Biometric type
 * @param {string} biometricToken - Biometric verification token
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const authenticated = await authenticateWithBiometrics('device-123', BiometricType.FACE_ID, 'token');
 * ```
 */
export declare const authenticateWithBiometrics: (deviceId: string, biometricType: BiometricType, biometricToken: string) => Promise<boolean>;
/**
 * Creates biometric signature on document.
 * Captures signature with biometric authentication proof.
 *
 * @param {MobileSignatureRequest} request - Signature request
 * @returns {Promise<string>} Signature ID
 *
 * @example
 * ```typescript
 * const signatureId = await createBiometricSignature({
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   userId: 'user-789',
 *   biometricType: BiometricType.FACE_ID,
 *   signaturePosition: { page: 1, x: 100, y: 200, width: 150, height: 50 },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createBiometricSignature: (request: MobileSignatureRequest) => Promise<string>;
/**
 * Verifies biometric signature authenticity.
 * Validates signature against biometric authentication.
 *
 * @param {string} signatureId - Signature identifier
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const isValid = await verifyBiometricSignature('sig-123');
 * ```
 */
export declare const verifyBiometricSignature: (signatureId: string) => Promise<boolean>;
/**
 * Renders document optimized for mobile screen.
 * Implements responsive rendering with adaptive quality.
 *
 * @param {string} documentId - Document identifier
 * @param {MobileRenderConfig} config - Rendering configuration
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const rendered = await renderDocumentMobile('doc-123', {
 *   mode: MobileRenderMode.RESPONSIVE,
 *   targetWidth: 375,
 *   targetHeight: 812,
 *   dpi: 163,
 *   quality: 'HIGH',
 *   enableCaching: true,
 *   enableLazyLoading: true,
 *   enableProgressiveRender: true
 * });
 * ```
 */
export declare const renderDocumentMobile: (documentId: string, config: MobileRenderConfig) => Promise<Buffer>;
/**
 * Creates mobile annotation with touch gesture support.
 * Supports text, drawing, highlight, voice, and photo annotations.
 *
 * @param {MobileAnnotation} annotation - Annotation data
 * @returns {Promise<string>} Annotation ID
 *
 * @example
 * ```typescript
 * const annotationId = await createMobileAnnotation({
 *   id: crypto.randomUUID(),
 *   documentId: 'doc-123',
 *   deviceId: 'device-456',
 *   userId: 'user-789',
 *   type: 'DRAWING',
 *   page: 1,
 *   coordinates: { x: 50, y: 100, width: 200, height: 150 },
 *   content: { paths: [...] },
 *   touchGesture: TouchGestureType.SWIPE,
 *   syncStatus: MobileSyncStatus.PENDING,
 *   createdAt: new Date()
 * });
 * ```
 */
export declare const createMobileAnnotation: (annotation: MobileAnnotation) => Promise<string>;
/**
 * Syncs mobile annotations to server.
 * Implements conflict-free annotation synchronization.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<number>} Number of synced annotations
 *
 * @example
 * ```typescript
 * const syncedCount = await syncMobileAnnotations('device-123');
 * ```
 */
export declare const syncMobileAnnotations: (deviceId: string) => Promise<number>;
/**
 * Monitors network bandwidth and adjusts quality.
 * Implements adaptive streaming based on network conditions.
 *
 * @returns {Promise<BandwidthMonitor>}
 *
 * @example
 * ```typescript
 * const bandwidth = await monitorNetworkBandwidth();
 * ```
 */
export declare const monitorNetworkBandwidth: () => Promise<BandwidthMonitor>;
/**
 * Enables progressive document loading for mobile.
 * Loads document pages incrementally based on viewport.
 *
 * @param {string} documentId - Document identifier
 * @param {number} visiblePage - Currently visible page
 * @param {number} preloadCount - Number of pages to preload
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableProgressiveLoading('doc-123', 3, 2);
 * ```
 */
export declare const enableProgressiveLoading: (documentId: string, visiblePage: number, preloadCount?: number) => Promise<void>;
/**
 * Caches document locally with encryption.
 * Implements secure local storage for offline access.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {Buffer} documentData - Document data
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheDocumentLocally('doc-123', 'device-456', buffer, 'encryption-key');
 * ```
 */
export declare const cacheDocumentLocally: (documentId: string, deviceId: string, documentData: Buffer, encryptionKey: string) => Promise<void>;
/**
 * Retrieves cached document from local storage.
 * Decrypts and decompresses cached document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const document = await getCachedDocument('doc-123', 'device-456', 'encryption-key');
 * ```
 */
export declare const getCachedDocument: (documentId: string, deviceId: string, encryptionKey: string) => Promise<Buffer>;
/**
 * Clears offline document cache.
 * Removes cached documents from local storage.
 *
 * @param {string} deviceId - Device identifier
 * @param {string[]} documentIds - Optional specific documents to clear
 * @returns {Promise<number>} Number of cleared documents
 *
 * @example
 * ```typescript
 * const cleared = await clearOfflineCache('device-123', ['doc-1', 'doc-2']);
 * ```
 */
export declare const clearOfflineCache: (deviceId: string, documentIds?: string[]) => Promise<number>;
/**
 * Gets offline document sync status.
 * Returns sync state for all offline documents.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<OfflineDocumentModel[]>}
 *
 * @example
 * ```typescript
 * const statuses = await getOfflineSyncStatus('device-123');
 * ```
 */
export declare const getOfflineSyncStatus: (deviceId: string) => Promise<OfflineDocumentModel[]>;
/**
 * Queues document for background sync.
 * Schedules document for synchronization when network available.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @param {number} priority - Sync priority (1-10)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await queueDocumentForSync('doc-123', 'device-456', 5);
 * ```
 */
export declare const queueDocumentForSync: (documentId: string, deviceId: string, priority: number) => Promise<void>;
/**
 * Performs delta synchronization.
 * Syncs only changed portions of document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ bytesTransferred: number; changeCount: number }>}
 *
 * @example
 * ```typescript
 * const delta = await performDeltaSync('doc-123', 'device-456');
 * ```
 */
export declare const performDeltaSync: (documentId: string, deviceId: string) => Promise<{
    bytesTransferred: number;
    changeCount: number;
}>;
/**
 * Detects offline mode and switches to cached data.
 * Implements automatic offline detection and fallback.
 *
 * @returns {Promise<boolean>} Whether device is offline
 *
 * @example
 * ```typescript
 * const isOffline = await detectOfflineMode();
 * ```
 */
export declare const detectOfflineMode: () => Promise<boolean>;
/**
 * Enables push notifications for document updates.
 * Configures push notifications for mobile devices.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} pushToken - Push notification token
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enablePushNotifications('device-123', 'fcm-token');
 * ```
 */
export declare const enablePushNotifications: (deviceId: string, pushToken: string) => Promise<void>;
/**
 * Sends push notification for document event.
 * Triggers push notification to mobile device.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Record<string, any>} data - Additional data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendDocumentNotification('device-123', 'Document Updated', 'Your document has been signed', { docId: 'doc-123' });
 * ```
 */
export declare const sendDocumentNotification: (deviceId: string, title: string, body: string, data: Record<string, any>) => Promise<void>;
/**
 * Optimizes document for mobile viewing.
 * Reduces file size and optimizes for mobile display.
 *
 * @param {string} documentId - Document identifier
 * @param {MobilePlatform} platform - Target platform
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const optimized = await optimizeDocumentForMobile('doc-123', MobilePlatform.IOS);
 * ```
 */
export declare const optimizeDocumentForMobile: (documentId: string, platform: MobilePlatform) => Promise<Buffer>;
/**
 * Handles touch gestures for document interaction.
 * Processes pinch, zoom, swipe, and tap gestures.
 *
 * @param {TouchGestureType} gestureType - Gesture type
 * @param {Record<string, any>} gestureData - Gesture data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleTouchGesture(TouchGestureType.PINCH, { scale: 1.5, center: { x: 200, y: 300 } });
 * ```
 */
export declare const handleTouchGesture: (gestureType: TouchGestureType, gestureData: Record<string, any>) => Promise<void>;
/**
 * Captures document photo using device camera.
 * Integrates with native camera for document scanning.
 *
 * @param {string} deviceId - Device identifier
 * @param {'photo' | 'document' | 'id-card'} captureMode - Capture mode
 * @returns {Promise<Buffer>}
 *
 * @example
 * ```typescript
 * const photo = await captureDocumentPhoto('device-123', 'document');
 * ```
 */
export declare const captureDocumentPhoto: (deviceId: string, captureMode: "photo" | "document" | "id-card") => Promise<Buffer>;
/**
 * Scans QR code from document.
 * Extracts QR code data from document or camera.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string>}
 *
 * @example
 * ```typescript
 * const qrData = await scanDocumentQRCode('doc-123');
 * ```
 */
export declare const scanDocumentQRCode: (documentId: string) => Promise<string>;
/**
 * Enables offline annotation editing.
 * Allows annotations to be created and edited offline.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableOfflineAnnotations('doc-123', 'device-456');
 * ```
 */
export declare const enableOfflineAnnotations: (documentId: string, deviceId: string) => Promise<void>;
/**
 * Syncs document signatures from mobile device.
 * Uploads pending signatures to server.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<number>} Number of synced signatures
 *
 * @example
 * ```typescript
 * const synced = await syncMobileSignatures('device-123');
 * ```
 */
export declare const syncMobileSignatures: (deviceId: string) => Promise<number>;
/**
 * Gets mobile device capabilities.
 * Returns device features and supported functionalities.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileDeviceModel>}
 *
 * @example
 * ```typescript
 * const capabilities = await getMobileDeviceCapabilities('device-123');
 * ```
 */
export declare const getMobileDeviceCapabilities: (deviceId: string) => Promise<MobileDeviceModel>;
/**
 * Updates device activity timestamp.
 * Tracks last active time for device.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDeviceActivity('device-123');
 * ```
 */
export declare const updateDeviceActivity: (deviceId: string) => Promise<void>;
/**
 * Deactivates mobile device.
 * Removes device access and clears cached data.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateMobileDevice('device-123');
 * ```
 */
export declare const deactivateMobileDevice: (deviceId: string) => Promise<void>;
/**
 * Gets active sync operations for device.
 * Returns all in-progress synchronization operations.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileSyncOperationModel[]>}
 *
 * @example
 * ```typescript
 * const operations = await getActiveSyncOperations('device-123');
 * ```
 */
export declare const getActiveSyncOperations: (deviceId: string) => Promise<MobileSyncOperationModel[]>;
/**
 * Cancels sync operation.
 * Stops in-progress synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelSyncOperation('sync-123');
 * ```
 */
export declare const cancelSyncOperation: (syncOperationId: string) => Promise<void>;
/**
 * Retries failed sync operation.
 * Attempts to resume failed synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<MobileSyncOperation>}
 *
 * @example
 * ```typescript
 * const retried = await retrySyncOperation('sync-123');
 * ```
 */
export declare const retrySyncOperation: (syncOperationId: string) => Promise<MobileSyncOperation>;
/**
 * Calculates sync progress percentage.
 * Returns current progress of synchronization.
 *
 * @param {string} syncOperationId - Sync operation identifier
 * @returns {Promise<number>} Progress percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = await getSyncProgress('sync-123');
 * ```
 */
export declare const getSyncProgress: (syncOperationId: string) => Promise<number>;
/**
 * Gets mobile annotation history.
 * Returns all annotations for a document on device.
 *
 * @param {string} documentId - Document identifier
 * @param {string} deviceId - Device identifier
 * @returns {Promise<MobileAnnotationModel[]>}
 *
 * @example
 * ```typescript
 * const annotations = await getMobileAnnotationHistory('doc-123', 'device-456');
 * ```
 */
export declare const getMobileAnnotationHistory: (documentId: string, deviceId: string) => Promise<MobileAnnotationModel[]>;
/**
 * Deletes mobile annotation.
 * Removes annotation and queues for sync.
 *
 * @param {string} annotationId - Annotation identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteMobileAnnotation('annotation-123');
 * ```
 */
export declare const deleteMobileAnnotation: (annotationId: string) => Promise<void>;
/**
 * Updates mobile annotation.
 * Modifies existing annotation and marks for sync.
 *
 * @param {string} annotationId - Annotation identifier
 * @param {Partial<MobileAnnotation>} updates - Annotation updates
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateMobileAnnotation('annotation-123', { content: { text: 'Updated text' } });
 * ```
 */
export declare const updateMobileAnnotation: (annotationId: string, updates: Partial<MobileAnnotation>) => Promise<void>;
/**
 * Gets device storage usage statistics.
 * Returns storage metrics for offline documents.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ totalSize: number; documentCount: number }>}
 *
 * @example
 * ```typescript
 * const stats = await getDeviceStorageStats('device-123');
 * ```
 */
export declare const getDeviceStorageStats: (deviceId: string) => Promise<{
    totalSize: number;
    documentCount: number;
}>;
/**
 * Validates biometric capabilities for device.
 * Checks if device supports required biometric authentication.
 *
 * @param {string} deviceId - Device identifier
 * @param {BiometricType} requiredType - Required biometric type
 * @returns {Promise<boolean>}
 *
 * @example
 * ```typescript
 * const hasCapability = await validateBiometricCapability('device-123', BiometricType.FACE_ID);
 * ```
 */
export declare const validateBiometricCapability: (deviceId: string, requiredType: BiometricType) => Promise<boolean>;
/**
 * Generates mobile sync report.
 * Creates comprehensive sync statistics and history.
 *
 * @param {string} deviceId - Device identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const report = await generateMobileSyncReport('device-123', startDate, endDate);
 * ```
 */
export declare const generateMobileSyncReport: (deviceId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Mobile Document Access Service
 * Production-ready NestJS service for mobile document operations
 */
export declare class MobileDocumentAccessService {
    /**
     * Registers mobile device and initializes offline capabilities
     */
    registerDevice(deviceInfo: MobileDeviceInfo): Promise<string>;
    /**
     * Downloads document for offline access with bandwidth optimization
     */
    downloadForOffline(documentId: string, deviceId: string, bandwidth: BandwidthMonitor): Promise<MobileSyncOperation>;
    /**
     * Creates biometric signature on mobile device
     */
    signWithBiometrics(request: MobileSignatureRequest): Promise<string>;
    /**
     * Syncs all pending changes from mobile device
     */
    syncDeviceChanges(deviceId: string): Promise<{
        documents: number;
        annotations: number;
        signatures: number;
    }>;
}
declare const _default: {
    MobileDeviceModel: typeof MobileDeviceModel;
    OfflineDocumentModel: typeof OfflineDocumentModel;
    MobileSyncOperationModel: typeof MobileSyncOperationModel;
    MobileSignatureModel: typeof MobileSignatureModel;
    MobileAnnotationModel: typeof MobileAnnotationModel;
    registerMobileDevice: (deviceInfo: MobileDeviceInfo) => Promise<string>;
    configureOfflineDocument: (config: OfflineDocumentConfig) => Promise<void>;
    downloadDocumentOffline: (documentId: string, deviceId: string, bandwidth: BandwidthMonitor) => Promise<MobileSyncOperation>;
    syncOfflineChanges: (documentId: string, deviceId: string) => Promise<MobileSyncOperation>;
    resolveDocumentConflict: (documentId: string, deviceId: string, strategy: "SERVER_WINS" | "CLIENT_WINS" | "MANUAL" | "MERGE") => Promise<void>;
    authenticateWithBiometrics: (deviceId: string, biometricType: BiometricType, biometricToken: string) => Promise<boolean>;
    createBiometricSignature: (request: MobileSignatureRequest) => Promise<string>;
    verifyBiometricSignature: (signatureId: string) => Promise<boolean>;
    renderDocumentMobile: (documentId: string, config: MobileRenderConfig) => Promise<Buffer>;
    createMobileAnnotation: (annotation: MobileAnnotation) => Promise<string>;
    syncMobileAnnotations: (deviceId: string) => Promise<number>;
    monitorNetworkBandwidth: () => Promise<BandwidthMonitor>;
    enableProgressiveLoading: (documentId: string, visiblePage: number, preloadCount?: number) => Promise<void>;
    cacheDocumentLocally: (documentId: string, deviceId: string, documentData: Buffer, encryptionKey: string) => Promise<void>;
    getCachedDocument: (documentId: string, deviceId: string, encryptionKey: string) => Promise<Buffer>;
    clearOfflineCache: (deviceId: string, documentIds?: string[]) => Promise<number>;
    getOfflineSyncStatus: (deviceId: string) => Promise<OfflineDocumentModel[]>;
    queueDocumentForSync: (documentId: string, deviceId: string, priority: number) => Promise<void>;
    performDeltaSync: (documentId: string, deviceId: string) => Promise<{
        bytesTransferred: number;
        changeCount: number;
    }>;
    detectOfflineMode: () => Promise<boolean>;
    enablePushNotifications: (deviceId: string, pushToken: string) => Promise<void>;
    sendDocumentNotification: (deviceId: string, title: string, body: string, data: Record<string, any>) => Promise<void>;
    optimizeDocumentForMobile: (documentId: string, platform: MobilePlatform) => Promise<Buffer>;
    handleTouchGesture: (gestureType: TouchGestureType, gestureData: Record<string, any>) => Promise<void>;
    captureDocumentPhoto: (deviceId: string, captureMode: "photo" | "document" | "id-card") => Promise<Buffer>;
    scanDocumentQRCode: (documentId: string) => Promise<string>;
    enableOfflineAnnotations: (documentId: string, deviceId: string) => Promise<void>;
    syncMobileSignatures: (deviceId: string) => Promise<number>;
    getMobileDeviceCapabilities: (deviceId: string) => Promise<MobileDeviceModel>;
    updateDeviceActivity: (deviceId: string) => Promise<void>;
    deactivateMobileDevice: (deviceId: string) => Promise<void>;
    getActiveSyncOperations: (deviceId: string) => Promise<MobileSyncOperationModel[]>;
    cancelSyncOperation: (syncOperationId: string) => Promise<void>;
    retrySyncOperation: (syncOperationId: string) => Promise<MobileSyncOperation>;
    getSyncProgress: (syncOperationId: string) => Promise<number>;
    getMobileAnnotationHistory: (documentId: string, deviceId: string) => Promise<MobileAnnotationModel[]>;
    deleteMobileAnnotation: (annotationId: string) => Promise<void>;
    updateMobileAnnotation: (annotationId: string, updates: Partial<MobileAnnotation>) => Promise<void>;
    getDeviceStorageStats: (deviceId: string) => Promise<{
        totalSize: number;
        documentCount: number;
    }>;
    validateBiometricCapability: (deviceId: string, requiredType: BiometricType) => Promise<boolean>;
    generateMobileSyncReport: (deviceId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    MobileDocumentAccessService: typeof MobileDocumentAccessService;
};
export default _default;
//# sourceMappingURL=document-mobile-access-composite.d.ts.map