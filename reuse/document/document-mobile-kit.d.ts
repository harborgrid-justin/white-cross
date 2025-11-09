/**
 * LOC: DOC-MOBILE-001
 * File: /reuse/document/document-mobile-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - react-native
 *   - react-native-fs
 *   - react-native-camera
 *   - react-native-biometrics
 *   - sequelize (v6.x)
 *   - @react-native-firebase/messaging
 *   - @react-native-async-storage/async-storage
 *
 * DOWNSTREAM (imported by):
 *   - Mobile document controllers
 *   - React Native document services
 *   - Offline sync services
 *   - Mobile biometric authentication
 *   - Camera capture modules
 */
/**
 * File: /reuse/document/document-mobile-kit.ts
 * Locator: WC-UTL-DOCMOBILE-001
 * Purpose: Mobile Document Management SDK - React Native integration, offline sync, mobile biometric signing, camera capture, push notifications
 *
 * Upstream: @nestjs/common, react-native, react-native-fs, react-native-camera, react-native-biometrics, sequelize, firebase-messaging
 * Downstream: Mobile controllers, RN services, offline sync, biometric auth, camera modules, notification handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, React Native 0.72.x, React Native FS 2.20.x
 * Exports: 38 utility functions for mobile SDK, offline sync, biometric signing, camera capture, push notifications, mobile optimizations
 *
 * LLM Context: Production-grade mobile document management SDK for White Cross healthcare platform.
 * Provides React Native SDK initialization, offline-first document synchronization, mobile biometric signing
 * with Touch ID/Face ID/fingerprint, native camera document capture with OCR, real-time push notifications
 * for document status changes, mobile-specific performance optimizations, background sync, conflict resolution,
 * encrypted local storage, bandwidth-aware transfers, and mobile-first UX patterns. Exceeds DocuSign Mobile
 * capabilities with advanced offline support, native biometric integration, and healthcare-specific mobile workflows.
 */
import { Sequelize } from 'sequelize';
/**
 * Mobile platform types
 */
export type MobilePlatform = 'ios' | 'android' | 'web';
/**
 * Biometric authentication types
 */
export type BiometricType = 'TouchID' | 'FaceID' | 'Fingerprint' | 'Iris' | 'None';
/**
 * Document sync status
 */
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'conflict' | 'error';
/**
 * Network quality indicators
 */
export type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
/**
 * Camera capture mode
 */
export type CaptureMode = 'photo' | 'document' | 'id-card' | 'signature' | 'qr-code';
/**
 * Push notification priority
 */
export type NotificationPriority = 'high' | 'normal' | 'low';
/**
 * Mobile SDK configuration
 */
export interface MobileSDKConfig {
    apiUrl: string;
    apiKey: string;
    platform: MobilePlatform;
    offlineEnabled: boolean;
    biometricsEnabled: boolean;
    cameraEnabled: boolean;
    pushNotificationsEnabled: boolean;
    autoSync: boolean;
    syncInterval?: number;
    maxOfflineDocuments?: number;
    maxFileSize?: number;
    encryptionKey?: string;
    debugMode?: boolean;
}
/**
 * Mobile device information
 */
export interface MobileDeviceInfo {
    deviceId: string;
    platform: MobilePlatform;
    osVersion: string;
    appVersion: string;
    deviceModel: string;
    deviceName?: string;
    screenWidth: number;
    screenHeight: number;
    biometricSupport: BiometricType[];
    cameraAvailable: boolean;
    storageAvailable: number;
    networkQuality: NetworkQuality;
}
/**
 * Offline document configuration
 */
export interface OfflineDocumentConfig {
    documentId: string;
    priority: number;
    autoSync: boolean;
    conflictResolution: 'server' | 'client' | 'manual' | 'latest';
    encryptionEnabled: boolean;
    compressionEnabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Sync operation details
 */
export interface SyncOperation {
    operationId: string;
    documentId: string;
    type: 'upload' | 'download' | 'update' | 'delete';
    status: SyncStatus;
    progress: number;
    bytesTransferred: number;
    totalBytes: number;
    startedAt: Date;
    completedAt?: Date;
    error?: string;
    retryCount: number;
    networkQuality: NetworkQuality;
}
/**
 * Conflict resolution data
 */
export interface ConflictResolution {
    documentId: string;
    serverVersion: number;
    clientVersion: number;
    serverModifiedAt: Date;
    clientModifiedAt: Date;
    serverData: Buffer;
    clientData: Buffer;
    resolution: 'server' | 'client' | 'merge' | 'manual';
    resolvedData?: Buffer;
    resolvedBy?: string;
    resolvedAt?: Date;
}
/**
 * Biometric authentication configuration
 */
export interface BiometricAuthConfig {
    promptMessage: string;
    fallbackLabel?: string;
    cancelLabel?: string;
    allowDeviceCredentials?: boolean;
    biometricType?: BiometricType;
    timeout?: number;
}
/**
 * Biometric signature data
 */
export interface BiometricSignature {
    signatureId: string;
    documentId: string;
    userId: string;
    biometricType: BiometricType;
    signatureData: string;
    timestamp: Date;
    deviceId: string;
    location?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    verified: boolean;
    publicKey?: string;
}
/**
 * Camera capture configuration
 */
export interface CameraCaptureConfig {
    mode: CaptureMode;
    quality: number;
    autoFocus: boolean;
    flashMode?: 'on' | 'off' | 'auto';
    aspectRatio?: string;
    orientation?: 'portrait' | 'landscape';
    edgeDetection?: boolean;
    colorCorrection?: boolean;
    ocrEnabled?: boolean;
    maxPages?: number;
}
/**
 * Captured document data
 */
export interface CapturedDocument {
    captureId: string;
    documentType: CaptureMode;
    imageData: string;
    imagePath: string;
    width: number;
    height: number;
    fileSize: number;
    timestamp: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
    ocrText?: string;
    detectedEdges?: Array<{
        x: number;
        y: number;
    }>;
    quality: number;
    metadata?: Record<string, any>;
}
/**
 * Push notification payload
 */
export interface DocumentNotification {
    notificationId: string;
    documentId: string;
    title: string;
    body: string;
    type: 'signature_requested' | 'document_signed' | 'document_updated' | 'sync_complete' | 'approval_needed';
    priority: NotificationPriority;
    data?: Record<string, any>;
    actionButtons?: Array<{
        id: string;
        title: string;
        action: string;
    }>;
    sound?: string;
    badge?: number;
    deepLink?: string;
}
/**
 * Mobile session information
 */
export interface MobileSession {
    sessionId: string;
    userId: string;
    deviceId: string;
    platform: MobilePlatform;
    startedAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    refreshToken: string;
    accessToken: string;
    biometricEnabled: boolean;
    pushToken?: string;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Background sync job
 */
export interface BackgroundSyncJob {
    jobId: string;
    documentIds: string[];
    priority: number;
    scheduledAt: Date;
    status: 'scheduled' | 'running' | 'completed' | 'failed';
    progress: number;
    wifiOnly: boolean;
    batteryThreshold?: number;
    retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
        initialDelay: number;
    };
}
/**
 * Mobile optimization settings
 */
export interface MobileOptimizationSettings {
    enableImageCompression: boolean;
    compressionQuality: number;
    enableLazyLoading: boolean;
    enableCaching: boolean;
    cacheSize: number;
    prefetchEnabled: boolean;
    lowDataMode: boolean;
    batteryOptimization: boolean;
    reducedMotion: boolean;
}
/**
 * Bandwidth monitoring data
 */
export interface BandwidthMonitor {
    currentSpeed: number;
    averageSpeed: number;
    connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
    metered: boolean;
    quality: NetworkQuality;
    latency: number;
    packetLoss: number;
}
/**
 * Mobile device model attributes
 */
export interface MobileDeviceAttributes {
    id: string;
    deviceId: string;
    userId: string;
    platform: string;
    osVersion: string;
    appVersion: string;
    deviceModel: string;
    deviceName?: string;
    pushToken?: string;
    biometricTypes: string[];
    lastSeen: Date;
    isActive: boolean;
    settings?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Offline document model attributes
 */
export interface OfflineDocumentAttributes {
    id: string;
    documentId: string;
    deviceId: string;
    userId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    localPath: string;
    serverVersion: number;
    clientVersion: number;
    status: string;
    syncedAt?: Date;
    modifiedAt: Date;
    encryptedData?: Buffer;
    checksum: string;
    priority: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mobile session model attributes
 */
export interface MobileSessionAttributes {
    id: string;
    sessionId: string;
    userId: string;
    deviceId: string;
    platform: string;
    accessToken: string;
    refreshToken: string;
    biometricEnabled: boolean;
    pushToken?: string;
    ipAddress?: string;
    userAgent?: string;
    startedAt: Date;
    lastActivity: Date;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates MobileDevice model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<MobileDeviceAttributes>>} MobileDevice model
 *
 * @example
 * ```typescript
 * const DeviceModel = createMobileDeviceModel(sequelize);
 * const device = await DeviceModel.create({
 *   deviceId: 'device-uuid',
 *   userId: 'user-uuid',
 *   platform: 'ios',
 *   osVersion: '16.0',
 *   appVersion: '1.0.0',
 *   deviceModel: 'iPhone 14 Pro',
 *   biometricTypes: ['FaceID'],
 *   lastSeen: new Date()
 * });
 * ```
 */
export declare const createMobileDeviceModel: (sequelize: Sequelize) => any;
/**
 * Creates OfflineDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<OfflineDocumentAttributes>>} OfflineDocument model
 *
 * @example
 * ```typescript
 * const OfflineDocModel = createOfflineDocumentModel(sequelize);
 * const doc = await OfflineDocModel.create({
 *   documentId: 'doc-uuid',
 *   deviceId: 'device-uuid',
 *   userId: 'user-uuid',
 *   fileName: 'patient-consent.pdf',
 *   fileSize: 1024000,
 *   mimeType: 'application/pdf',
 *   localPath: '/documents/patient-consent.pdf',
 *   serverVersion: 1,
 *   clientVersion: 1,
 *   status: 'synced',
 *   checksum: 'sha256-hash'
 * });
 * ```
 */
export declare const createOfflineDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates MobileSession model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<MobileSessionAttributes>>} MobileSession model
 *
 * @example
 * ```typescript
 * const SessionModel = createMobileSessionModel(sequelize);
 * const session = await SessionModel.create({
 *   sessionId: 'session-uuid',
 *   userId: 'user-uuid',
 *   deviceId: 'device-uuid',
 *   platform: 'ios',
 *   accessToken: 'access-token',
 *   refreshToken: 'refresh-token',
 *   biometricEnabled: true,
 *   startedAt: new Date(),
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare const createMobileSessionModel: (sequelize: Sequelize) => any;
/**
 * 1. Initializes mobile SDK with configuration.
 *
 * @param {MobileSDKConfig} config - SDK configuration
 * @returns {Promise<{ sdkId: string; initialized: boolean }>} Initialization result
 *
 * @example
 * ```typescript
 * const sdk = await initializeMobileSDK({
 *   apiUrl: 'https://api.whitecross.com',
 *   apiKey: 'your-api-key',
 *   platform: 'ios',
 *   offlineEnabled: true,
 *   biometricsEnabled: true,
 *   cameraEnabled: true,
 *   pushNotificationsEnabled: true,
 *   autoSync: true,
 *   syncInterval: 300000 // 5 minutes
 * });
 * ```
 */
export declare const initializeMobileSDK: (config: MobileSDKConfig) => Promise<{
    sdkId: string;
    initialized: boolean;
}>;
/**
 * 2. Registers mobile device with backend.
 *
 * @param {MobileDeviceInfo} deviceInfo - Device information
 * @param {string} userId - User identifier
 * @returns {Promise<string>} Device registration ID
 *
 * @example
 * ```typescript
 * const deviceId = await registerMobileDevice({
 *   deviceId: 'unique-device-id',
 *   platform: 'ios',
 *   osVersion: '16.0',
 *   appVersion: '1.0.0',
 *   deviceModel: 'iPhone 14 Pro',
 *   biometricSupport: ['FaceID'],
 *   cameraAvailable: true,
 *   storageAvailable: 5000000000,
 *   networkQuality: 'excellent'
 * }, 'user-123');
 * ```
 */
export declare const registerMobileDevice: (deviceInfo: MobileDeviceInfo, userId: string) => Promise<string>;
/**
 * 3. Creates mobile session with authentication.
 *
 * @param {string} userId - User identifier
 * @param {string} deviceId - Device identifier
 * @param {MobilePlatform} platform - Mobile platform
 * @param {boolean} biometricEnabled - Whether biometrics are enabled
 * @returns {Promise<MobileSession>} Mobile session data
 *
 * @example
 * ```typescript
 * const session = await createMobileSession('user-123', 'device-456', 'ios', true);
 * console.log('Access token:', session.accessToken);
 * ```
 */
export declare const createMobileSession: (userId: string, deviceId: string, platform: MobilePlatform, biometricEnabled: boolean) => Promise<MobileSession>;
/**
 * 4. Configures offline storage for documents.
 *
 * @param {number} maxDocuments - Maximum offline documents
 * @param {number} maxStorageBytes - Maximum storage in bytes
 * @param {boolean} encryptionEnabled - Enable encryption
 * @returns {Promise<{ storageId: string; configured: boolean }>} Storage configuration
 *
 * @example
 * ```typescript
 * const storage = await configureOfflineStorage(100, 5000000000, true);
 * console.log('Storage configured:', storage.configured);
 * ```
 */
export declare const configureOfflineStorage: (maxDocuments: number, maxStorageBytes: number, encryptionEnabled: boolean) => Promise<{
    storageId: string;
    configured: boolean;
}>;
/**
 * 5. Initializes network monitoring for adaptive sync.
 *
 * @returns {Promise<BandwidthMonitor>} Network monitoring data
 *
 * @example
 * ```typescript
 * const network = await initializeNetworkMonitoring();
 * console.log('Network quality:', network.quality);
 * console.log('Connection type:', network.connectionType);
 * ```
 */
export declare const initializeNetworkMonitoring: () => Promise<BandwidthMonitor>;
/**
 * 6. Sets up background sync capabilities.
 *
 * @param {number} syncInterval - Sync interval in milliseconds
 * @param {boolean} wifiOnly - Only sync on WiFi
 * @returns {Promise<{ jobId: string; scheduled: boolean }>} Background job info
 *
 * @example
 * ```typescript
 * const bgSync = await setupBackgroundSync(300000, true);
 * console.log('Background sync job:', bgSync.jobId);
 * ```
 */
export declare const setupBackgroundSync: (syncInterval: number, wifiOnly: boolean) => Promise<{
    jobId: string;
    scheduled: boolean;
}>;
/**
 * 7. Downloads document for offline access.
 *
 * @param {string} documentId - Document identifier
 * @param {OfflineDocumentConfig} config - Offline configuration
 * @returns {Promise<{ localPath: string; downloaded: boolean }>} Download result
 *
 * @example
 * ```typescript
 * const result = await downloadDocumentOffline('doc-123', {
 *   documentId: 'doc-123',
 *   priority: 10,
 *   autoSync: true,
 *   conflictResolution: 'server',
 *   encryptionEnabled: true,
 *   compressionEnabled: true
 * });
 * console.log('Downloaded to:', result.localPath);
 * ```
 */
export declare const downloadDocumentOffline: (documentId: string, config: OfflineDocumentConfig) => Promise<{
    localPath: string;
    downloaded: boolean;
}>;
/**
 * 8. Syncs offline changes to server.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<SyncOperation>} Sync operation details
 *
 * @example
 * ```typescript
 * const sync = await syncOfflineChanges('doc-123');
 * console.log('Sync status:', sync.status);
 * console.log('Progress:', sync.progress);
 * ```
 */
export declare const syncOfflineChanges: (documentId: string) => Promise<SyncOperation>;
/**
 * 9. Resolves sync conflicts between client and server.
 *
 * @param {ConflictResolution} conflict - Conflict data
 * @returns {Promise<{ resolved: boolean; resolution: string }>} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = await resolveDocumentConflict({
 *   documentId: 'doc-123',
 *   serverVersion: 2,
 *   clientVersion: 2,
 *   serverModifiedAt: new Date('2024-01-01'),
 *   clientModifiedAt: new Date('2024-01-02'),
 *   serverData: serverBuffer,
 *   clientData: clientBuffer,
 *   resolution: 'latest'
 * });
 * ```
 */
export declare const resolveDocumentConflict: (conflict: ConflictResolution) => Promise<{
    resolved: boolean;
    resolution: string;
}>;
/**
 * 10. Queues document for background sync.
 *
 * @param {string} documentId - Document identifier
 * @param {number} priority - Sync priority (1-10)
 * @returns {Promise<{ queued: boolean; position: number }>} Queue status
 *
 * @example
 * ```typescript
 * const queued = await queueDocumentForSync('doc-123', 10);
 * console.log('Queue position:', queued.position);
 * ```
 */
export declare const queueDocumentForSync: (documentId: string, priority: number) => Promise<{
    queued: boolean;
    position: number;
}>;
/**
 * 11. Removes document from offline storage.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ removed: boolean; freedBytes: number }>} Removal result
 *
 * @example
 * ```typescript
 * const removed = await removeOfflineDocument('doc-123');
 * console.log('Freed storage:', removed.freedBytes);
 * ```
 */
export declare const removeOfflineDocument: (documentId: string) => Promise<{
    removed: boolean;
    freedBytes: number;
}>;
/**
 * 12. Gets sync status for all offline documents.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<SyncOperation[]>} Array of sync operations
 *
 * @example
 * ```typescript
 * const syncStatus = await getOfflineSyncStatus('device-123');
 * syncStatus.forEach(op => {
 *   console.log(`${op.documentId}: ${op.status} (${op.progress}%)`);
 * });
 * ```
 */
export declare const getOfflineSyncStatus: (deviceId: string) => Promise<SyncOperation[]>;
/**
 * 13. Implements delta sync for bandwidth efficiency.
 *
 * @param {string} documentId - Document identifier
 * @param {number} fromVersion - Starting version
 * @returns {Promise<{ delta: Buffer; applied: boolean }>} Delta sync result
 *
 * @example
 * ```typescript
 * const delta = await performDeltaSync('doc-123', 1);
 * console.log('Delta applied:', delta.applied);
 * ```
 */
export declare const performDeltaSync: (documentId: string, fromVersion: number) => Promise<{
    delta: Buffer;
    applied: boolean;
}>;
/**
 * 14. Authenticates user with biometrics.
 *
 * @param {BiometricAuthConfig} config - Biometric authentication config
 * @returns {Promise<{ authenticated: boolean; biometricType: BiometricType }>} Auth result
 *
 * @example
 * ```typescript
 * const auth = await authenticateWithBiometrics({
 *   promptMessage: 'Sign document with Face ID',
 *   fallbackLabel: 'Use passcode',
 *   cancelLabel: 'Cancel',
 *   allowDeviceCredentials: true
 * });
 * console.log('Authenticated:', auth.authenticated);
 * ```
 */
export declare const authenticateWithBiometrics: (config: BiometricAuthConfig) => Promise<{
    authenticated: boolean;
    biometricType: BiometricType;
}>;
/**
 * 15. Creates biometric signature for document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {BiometricType} biometricType - Type of biometric used
 * @returns {Promise<BiometricSignature>} Biometric signature data
 *
 * @example
 * ```typescript
 * const signature = await createBiometricSignature('doc-123', 'user-456', 'FaceID');
 * console.log('Signature ID:', signature.signatureId);
 * console.log('Verified:', signature.verified);
 * ```
 */
export declare const createBiometricSignature: (documentId: string, userId: string, biometricType: BiometricType) => Promise<BiometricSignature>;
/**
 * 16. Verifies biometric signature.
 *
 * @param {BiometricSignature} signature - Biometric signature to verify
 * @returns {Promise<{ valid: boolean; confidence: number }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyBiometricSignature(signature);
 * console.log('Valid:', verification.valid);
 * console.log('Confidence:', verification.confidence);
 * ```
 */
export declare const verifyBiometricSignature: (signature: BiometricSignature) => Promise<{
    valid: boolean;
    confidence: number;
}>;
/**
 * 17. Checks biometric availability on device.
 *
 * @returns {Promise<{ available: boolean; types: BiometricType[] }>} Biometric availability
 *
 * @example
 * ```typescript
 * const biometrics = await checkBiometricAvailability();
 * console.log('Available:', biometrics.available);
 * console.log('Types:', biometrics.types);
 * ```
 */
export declare const checkBiometricAvailability: () => Promise<{
    available: boolean;
    types: BiometricType[];
}>;
/**
 * 18. Generates biometric key pair for signing.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<{ publicKey: string; keyId: string }>} Key pair info
 *
 * @example
 * ```typescript
 * const keys = await generateBiometricKeyPair('user-123');
 * console.log('Public key:', keys.publicKey);
 * ```
 */
export declare const generateBiometricKeyPair: (userId: string) => Promise<{
    publicKey: string;
    keyId: string;
}>;
/**
 * 19. Revokes biometric signature.
 *
 * @param {string} signatureId - Signature identifier
 * @param {string} reason - Revocation reason
 * @returns {Promise<{ revoked: boolean; revokedAt: Date }>} Revocation result
 *
 * @example
 * ```typescript
 * const revoked = await revokeBiometricSignature('sig-123', 'User requested revocation');
 * console.log('Revoked at:', revoked.revokedAt);
 * ```
 */
export declare const revokeBiometricSignature: (signatureId: string, reason: string) => Promise<{
    revoked: boolean;
    revokedAt: Date;
}>;
/**
 * 20. Exports biometric signature for verification.
 *
 * @param {string} signatureId - Signature identifier
 * @returns {Promise<{ exported: string; format: string }>} Exported signature
 *
 * @example
 * ```typescript
 * const exported = await exportBiometricSignature('sig-123');
 * console.log('Format:', exported.format);
 * ```
 */
export declare const exportBiometricSignature: (signatureId: string) => Promise<{
    exported: string;
    format: string;
}>;
/**
 * 21. Captures document with camera.
 *
 * @param {CameraCaptureConfig} config - Camera capture configuration
 * @returns {Promise<CapturedDocument>} Captured document data
 *
 * @example
 * ```typescript
 * const captured = await captureDocumentWithCamera({
 *   mode: 'document',
 *   quality: 0.9,
 *   autoFocus: true,
 *   flashMode: 'auto',
 *   edgeDetection: true,
 *   colorCorrection: true,
 *   ocrEnabled: true
 * });
 * console.log('Captured:', captured.captureId);
 * console.log('OCR text:', captured.ocrText);
 * ```
 */
export declare const captureDocumentWithCamera: (config: CameraCaptureConfig) => Promise<CapturedDocument>;
/**
 * 22. Detects document edges in image.
 *
 * @param {string} imagePath - Path to captured image
 * @returns {Promise<{ edges: Array<{ x: number; y: number }>; confidence: number }>} Edge detection result
 *
 * @example
 * ```typescript
 * const edges = await detectDocumentEdges('/captures/img-123.jpg');
 * console.log('Detected edges:', edges.edges.length);
 * console.log('Confidence:', edges.confidence);
 * ```
 */
export declare const detectDocumentEdges: (imagePath: string) => Promise<{
    edges: Array<{
        x: number;
        y: number;
    }>;
    confidence: number;
}>;
/**
 * 23. Performs OCR on captured document.
 *
 * @param {string} imagePath - Path to document image
 * @param {string} [language] - OCR language (default: 'eng')
 * @returns {Promise<{ text: string; confidence: number; blocks: any[] }>} OCR result
 *
 * @example
 * ```typescript
 * const ocr = await performDocumentOCR('/captures/img-123.jpg', 'eng');
 * console.log('Extracted text:', ocr.text);
 * console.log('Confidence:', ocr.confidence);
 * ```
 */
export declare const performDocumentOCR: (imagePath: string, language?: string) => Promise<{
    text: string;
    confidence: number;
    blocks: any[];
}>;
/**
 * 24. Enhances captured document image quality.
 *
 * @param {string} imagePath - Path to original image
 * @returns {Promise<{ enhancedPath: string; improved: boolean }>} Enhancement result
 *
 * @example
 * ```typescript
 * const enhanced = await enhanceDocumentImage('/captures/img-123.jpg');
 * console.log('Enhanced image:', enhanced.enhancedPath);
 * ```
 */
export declare const enhanceDocumentImage: (imagePath: string) => Promise<{
    enhancedPath: string;
    improved: boolean;
}>;
/**
 * 25. Scans multiple pages into single document.
 *
 * @param {CameraCaptureConfig} config - Capture configuration
 * @param {number} maxPages - Maximum pages to scan
 * @returns {Promise<{ pages: CapturedDocument[]; documentId: string }>} Multi-page scan result
 *
 * @example
 * ```typescript
 * const multiPage = await scanMultiplePages({
 *   mode: 'document',
 *   quality: 0.9,
 *   autoFocus: true,
 *   edgeDetection: true
 * }, 10);
 * console.log('Scanned pages:', multiPage.pages.length);
 * ```
 */
export declare const scanMultiplePages: (config: CameraCaptureConfig, maxPages: number) => Promise<{
    pages: CapturedDocument[];
    documentId: string;
}>;
/**
 * 26. Detects ID card and extracts data.
 *
 * @param {string} imagePath - Path to ID card image
 * @returns {Promise<{ detected: boolean; data: Record<string, string> }>} ID detection result
 *
 * @example
 * ```typescript
 * const idCard = await detectAndExtractIDCard('/captures/id-123.jpg');
 * console.log('Name:', idCard.data.name);
 * console.log('ID Number:', idCard.data.idNumber);
 * ```
 */
export declare const detectAndExtractIDCard: (imagePath: string) => Promise<{
    detected: boolean;
    data: Record<string, string>;
}>;
/**
 * 27. Converts captured image to PDF.
 *
 * @param {string[]} imagePaths - Array of image paths
 * @returns {Promise<{ pdfPath: string; pageCount: number }>} PDF conversion result
 *
 * @example
 * ```typescript
 * const pdf = await convertCapturedImagesToPDF([
 *   '/captures/page1.jpg',
 *   '/captures/page2.jpg'
 * ]);
 * console.log('PDF created:', pdf.pdfPath);
 * ```
 */
export declare const convertCapturedImagesToPDF: (imagePaths: string[]) => Promise<{
    pdfPath: string;
    pageCount: number;
}>;
/**
 * 28. Sends push notification for document event.
 *
 * @param {DocumentNotification} notification - Notification payload
 * @param {string[]} deviceTokens - Target device push tokens
 * @returns {Promise<{ sent: boolean; delivered: number }>} Send result
 *
 * @example
 * ```typescript
 * const sent = await sendDocumentNotification({
 *   notificationId: 'notif-123',
 *   documentId: 'doc-456',
 *   title: 'Signature Required',
 *   body: 'Please sign the patient consent form',
 *   type: 'signature_requested',
 *   priority: 'high',
 *   deepLink: 'whitecross://documents/doc-456'
 * }, ['token1', 'token2']);
 * ```
 */
export declare const sendDocumentNotification: (notification: DocumentNotification, deviceTokens: string[]) => Promise<{
    sent: boolean;
    delivered: number;
}>;
/**
 * 29. Registers device for push notifications.
 *
 * @param {string} deviceId - Device identifier
 * @param {string} pushToken - FCM/APNS token
 * @returns {Promise<{ registered: boolean }>} Registration result
 *
 * @example
 * ```typescript
 * const registered = await registerForPushNotifications('device-123', 'fcm-token-xyz');
 * console.log('Registered:', registered.registered);
 * ```
 */
export declare const registerForPushNotifications: (deviceId: string, pushToken: string) => Promise<{
    registered: boolean;
}>;
/**
 * 30. Handles notification tap/interaction.
 *
 * @param {string} notificationId - Notification identifier
 * @param {string} action - Action taken (opened, dismissed, button clicked)
 * @returns {Promise<{ handled: boolean; deepLink?: string }>} Handle result
 *
 * @example
 * ```typescript
 * const handled = await handleNotificationInteraction('notif-123', 'opened');
 * if (handled.deepLink) {
 *   // Navigate to deepLink
 * }
 * ```
 */
export declare const handleNotificationInteraction: (notificationId: string, action: string) => Promise<{
    handled: boolean;
    deepLink?: string;
}>;
/**
 * 31. Schedules local notification for offline reminder.
 *
 * @param {DocumentNotification} notification - Notification data
 * @param {Date} scheduledTime - When to show notification
 * @returns {Promise<{ scheduled: boolean; notificationId: string }>} Schedule result
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleLocalNotification({
 *   notificationId: 'notif-456',
 *   documentId: 'doc-789',
 *   title: 'Pending Signature',
 *   body: 'Remember to sign the document when online',
 *   type: 'approval_needed',
 *   priority: 'normal'
 * }, new Date(Date.now() + 3600000));
 * ```
 */
export declare const scheduleLocalNotification: (notification: DocumentNotification, scheduledTime: Date) => Promise<{
    scheduled: boolean;
    notificationId: string;
}>;
/**
 * 32. Configures notification preferences.
 *
 * @param {string} userId - User identifier
 * @param {Record<string, boolean>} preferences - Notification preferences
 * @returns {Promise<{ configured: boolean }>} Configuration result
 *
 * @example
 * ```typescript
 * const configured = await configureNotificationPreferences('user-123', {
 *   signatureRequests: true,
 *   documentUpdates: false,
 *   syncComplete: false,
 *   approvalNeeded: true
 * });
 * ```
 */
export declare const configureNotificationPreferences: (userId: string, preferences: Record<string, boolean>) => Promise<{
    configured: boolean;
}>;
/**
 * 33. Gets notification history for device.
 *
 * @param {string} deviceId - Device identifier
 * @param {number} [limit] - Maximum notifications to return
 * @returns {Promise<DocumentNotification[]>} Notification history
 *
 * @example
 * ```typescript
 * const history = await getNotificationHistory('device-123', 50);
 * console.log('Recent notifications:', history.length);
 * ```
 */
export declare const getNotificationHistory: (deviceId: string, limit?: number) => Promise<DocumentNotification[]>;
/**
 * 34. Clears notification badges on device.
 *
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ cleared: boolean }>} Clear result
 *
 * @example
 * ```typescript
 * const cleared = await clearNotificationBadges('device-123');
 * console.log('Badges cleared:', cleared.cleared);
 * ```
 */
export declare const clearNotificationBadges: (deviceId: string) => Promise<{
    cleared: boolean;
}>;
/**
 * 35. Optimizes document for mobile rendering.
 *
 * @param {Buffer} documentBuffer - Original document
 * @param {MobileOptimizationSettings} settings - Optimization settings
 * @returns {Promise<{ optimized: Buffer; originalSize: number; optimizedSize: number }>} Optimization result
 *
 * @example
 * ```typescript
 * const optimized = await optimizeDocumentForMobile(documentBuffer, {
 *   enableImageCompression: true,
 *   compressionQuality: 0.8,
 *   enableLazyLoading: true,
 *   enableCaching: true,
 *   cacheSize: 50000000,
 *   prefetchEnabled: false,
 *   lowDataMode: true,
 *   batteryOptimization: true,
 *   reducedMotion: false
 * });
 * console.log('Size reduced by:', optimized.originalSize - optimized.optimizedSize);
 * ```
 */
export declare const optimizeDocumentForMobile: (documentBuffer: Buffer, settings: MobileOptimizationSettings) => Promise<{
    optimized: Buffer;
    originalSize: number;
    optimizedSize: number;
}>;
/**
 * 36. Implements adaptive quality based on network.
 *
 * @param {NetworkQuality} quality - Current network quality
 * @returns {Promise<{ compressionLevel: number; maxResolution: number }>} Adaptive settings
 *
 * @example
 * ```typescript
 * const adaptive = await adaptQualityToNetwork('poor');
 * console.log('Compression level:', adaptive.compressionLevel);
 * console.log('Max resolution:', adaptive.maxResolution);
 * ```
 */
export declare const adaptQualityToNetwork: (quality: NetworkQuality) => Promise<{
    compressionLevel: number;
    maxResolution: number;
}>;
/**
 * 37. Prefetches documents for offline use.
 *
 * @param {string[]} documentIds - Documents to prefetch
 * @param {number} priority - Prefetch priority
 * @returns {Promise<{ prefetched: number; failed: number }>} Prefetch result
 *
 * @example
 * ```typescript
 * const prefetch = await prefetchDocuments(['doc-1', 'doc-2', 'doc-3'], 8);
 * console.log('Prefetched:', prefetch.prefetched);
 * console.log('Failed:', prefetch.failed);
 * ```
 */
export declare const prefetchDocuments: (documentIds: string[], priority: number) => Promise<{
    prefetched: number;
    failed: number;
}>;
/**
 * 38. Monitors and reports mobile performance metrics.
 *
 * @param {string} sessionId - Session identifier
 * @returns {Promise<{ metrics: Record<string, number> }>} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await monitorMobilePerformance('session-123');
 * console.log('App load time:', performance.metrics.appLoadTime);
 * console.log('Document render time:', performance.metrics.documentRenderTime);
 * console.log('Memory usage:', performance.metrics.memoryUsage);
 * console.log('Battery drain:', performance.metrics.batteryDrain);
 * ```
 */
export declare const monitorMobilePerformance: (sessionId: string) => Promise<{
    metrics: Record<string, number>;
}>;
declare const _default: {
    createMobileDeviceModel: (sequelize: Sequelize) => any;
    createOfflineDocumentModel: (sequelize: Sequelize) => any;
    createMobileSessionModel: (sequelize: Sequelize) => any;
    initializeMobileSDK: (config: MobileSDKConfig) => Promise<{
        sdkId: string;
        initialized: boolean;
    }>;
    registerMobileDevice: (deviceInfo: MobileDeviceInfo, userId: string) => Promise<string>;
    createMobileSession: (userId: string, deviceId: string, platform: MobilePlatform, biometricEnabled: boolean) => Promise<MobileSession>;
    configureOfflineStorage: (maxDocuments: number, maxStorageBytes: number, encryptionEnabled: boolean) => Promise<{
        storageId: string;
        configured: boolean;
    }>;
    initializeNetworkMonitoring: () => Promise<BandwidthMonitor>;
    setupBackgroundSync: (syncInterval: number, wifiOnly: boolean) => Promise<{
        jobId: string;
        scheduled: boolean;
    }>;
    downloadDocumentOffline: (documentId: string, config: OfflineDocumentConfig) => Promise<{
        localPath: string;
        downloaded: boolean;
    }>;
    syncOfflineChanges: (documentId: string) => Promise<SyncOperation>;
    resolveDocumentConflict: (conflict: ConflictResolution) => Promise<{
        resolved: boolean;
        resolution: string;
    }>;
    queueDocumentForSync: (documentId: string, priority: number) => Promise<{
        queued: boolean;
        position: number;
    }>;
    removeOfflineDocument: (documentId: string) => Promise<{
        removed: boolean;
        freedBytes: number;
    }>;
    getOfflineSyncStatus: (deviceId: string) => Promise<SyncOperation[]>;
    performDeltaSync: (documentId: string, fromVersion: number) => Promise<{
        delta: Buffer;
        applied: boolean;
    }>;
    authenticateWithBiometrics: (config: BiometricAuthConfig) => Promise<{
        authenticated: boolean;
        biometricType: BiometricType;
    }>;
    createBiometricSignature: (documentId: string, userId: string, biometricType: BiometricType) => Promise<BiometricSignature>;
    verifyBiometricSignature: (signature: BiometricSignature) => Promise<{
        valid: boolean;
        confidence: number;
    }>;
    checkBiometricAvailability: () => Promise<{
        available: boolean;
        types: BiometricType[];
    }>;
    generateBiometricKeyPair: (userId: string) => Promise<{
        publicKey: string;
        keyId: string;
    }>;
    revokeBiometricSignature: (signatureId: string, reason: string) => Promise<{
        revoked: boolean;
        revokedAt: Date;
    }>;
    exportBiometricSignature: (signatureId: string) => Promise<{
        exported: string;
        format: string;
    }>;
    captureDocumentWithCamera: (config: CameraCaptureConfig) => Promise<CapturedDocument>;
    detectDocumentEdges: (imagePath: string) => Promise<{
        edges: Array<{
            x: number;
            y: number;
        }>;
        confidence: number;
    }>;
    performDocumentOCR: (imagePath: string, language?: string) => Promise<{
        text: string;
        confidence: number;
        blocks: any[];
    }>;
    enhanceDocumentImage: (imagePath: string) => Promise<{
        enhancedPath: string;
        improved: boolean;
    }>;
    scanMultiplePages: (config: CameraCaptureConfig, maxPages: number) => Promise<{
        pages: CapturedDocument[];
        documentId: string;
    }>;
    detectAndExtractIDCard: (imagePath: string) => Promise<{
        detected: boolean;
        data: Record<string, string>;
    }>;
    convertCapturedImagesToPDF: (imagePaths: string[]) => Promise<{
        pdfPath: string;
        pageCount: number;
    }>;
    sendDocumentNotification: (notification: DocumentNotification, deviceTokens: string[]) => Promise<{
        sent: boolean;
        delivered: number;
    }>;
    registerForPushNotifications: (deviceId: string, pushToken: string) => Promise<{
        registered: boolean;
    }>;
    handleNotificationInteraction: (notificationId: string, action: string) => Promise<{
        handled: boolean;
        deepLink?: string;
    }>;
    scheduleLocalNotification: (notification: DocumentNotification, scheduledTime: Date) => Promise<{
        scheduled: boolean;
        notificationId: string;
    }>;
    configureNotificationPreferences: (userId: string, preferences: Record<string, boolean>) => Promise<{
        configured: boolean;
    }>;
    getNotificationHistory: (deviceId: string, limit?: number) => Promise<DocumentNotification[]>;
    clearNotificationBadges: (deviceId: string) => Promise<{
        cleared: boolean;
    }>;
    optimizeDocumentForMobile: (documentBuffer: Buffer, settings: MobileOptimizationSettings) => Promise<{
        optimized: Buffer;
        originalSize: number;
        optimizedSize: number;
    }>;
    adaptQualityToNetwork: (quality: NetworkQuality) => Promise<{
        compressionLevel: number;
        maxResolution: number;
    }>;
    prefetchDocuments: (documentIds: string[], priority: number) => Promise<{
        prefetched: number;
        failed: number;
    }>;
    monitorMobilePerformance: (sessionId: string) => Promise<{
        metrics: Record<string, number>;
    }>;
};
export default _default;
//# sourceMappingURL=document-mobile-kit.d.ts.map