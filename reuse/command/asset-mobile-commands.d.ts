/**
 * ASSET MOBILE COMMAND FUNCTIONS
 *
 * Enterprise-grade mobile asset management system providing comprehensive
 * functionality for mobile asset lookup, work orders, inspections, barcode/QR
 * scanning, offline synchronization, push notifications, location services,
 * photo capture, and digital signatures. Competes with IBM Maximo Mobile
 * and ServiceNow Mobile Agent solutions.
 *
 * Features:
 * - Mobile asset lookup and search
 * - Mobile work order management
 * - Mobile inspection forms
 * - Barcode and QR code scanning
 * - Offline data synchronization
 * - Push notifications
 * - GPS location tracking
 * - Photo and document capture
 * - Digital signatures
 * - Mobile reporting and dashboards
 *
 * @module AssetMobileCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createMobileSession,
 *   scanAssetBarcode,
 *   createMobileWorkOrder,
 *   submitMobileInspection,
 *   syncOfflineData,
 *   MobileSessionStatus,
 *   ScanType
 * } from './asset-mobile-commands';
 *
 * // Start mobile session
 * const session = await createMobileSession({
 *   userId: 'user-123',
 *   deviceId: 'mobile-device-456',
 *   platform: 'iOS',
 *   appVersion: '2.1.0'
 * });
 *
 * // Scan asset barcode
 * const asset = await scanAssetBarcode({
 *   sessionId: session.id,
 *   scanType: ScanType.BARCODE,
 *   code: '123456789'
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Mobile Session Status
 */
export declare enum MobileSessionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    EXPIRED = "expired",
    LOGGED_OUT = "logged_out"
}
/**
 * Scan Type
 */
export declare enum ScanType {
    BARCODE = "barcode",
    QR_CODE = "qr_code",
    RFID = "rfid",
    NFC = "nfc"
}
/**
 * Mobile Work Order Status
 */
export declare enum MobileWorkOrderStatus {
    ASSIGNED = "assigned",
    ACCEPTED = "accepted",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    COMPLETED = "completed",
    REJECTED = "rejected"
}
/**
 * Inspection Status
 */
export declare enum InspectionStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
/**
 * Sync Status
 */
export declare enum SyncStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
/**
 * Notification Priority
 */
export declare enum NotificationPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
/**
 * Platform Type
 */
export declare enum PlatformType {
    IOS = "iOS",
    ANDROID = "android",
    WEB = "web"
}
/**
 * Mobile Session Data
 */
export interface MobileSessionData {
    userId: string;
    deviceId: string;
    deviceName?: string;
    platform: PlatformType;
    osVersion?: string;
    appVersion: string;
    pushToken?: string;
}
/**
 * Scan Data
 */
export interface ScanData {
    sessionId: string;
    scanType: ScanType;
    code: string;
    location?: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Mobile Work Order Data
 */
export interface MobileWorkOrderData {
    workOrderId: string;
    assignedTo: string;
    dueDate?: Date;
    priority?: string;
    instructions?: string;
    attachments?: string[];
}
/**
 * Work Order Update Data
 */
export interface WorkOrderUpdateData {
    workOrderId: string;
    status: MobileWorkOrderStatus;
    progress?: number;
    notes?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    photos?: string[];
    signature?: string;
    partsUsed?: PartUsed[];
    laborHours?: number;
}
/**
 * Part Used
 */
export interface PartUsed {
    partId: string;
    partNumber: string;
    quantity: number;
    notes?: string;
}
/**
 * Mobile Inspection Data
 */
export interface MobileInspectionData {
    assetId: string;
    inspectionTemplateId: string;
    inspectedBy: string;
    scheduledDate?: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * Inspection Submission Data
 */
export interface InspectionSubmissionData {
    inspectionId: string;
    responses: InspectionResponse[];
    photos?: string[];
    signature?: string;
    notes?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * Inspection Response
 */
export interface InspectionResponse {
    checkpointId: string;
    response: any;
    passed?: boolean;
    notes?: string;
    photo?: string;
}
/**
 * Offline Data Batch
 */
export interface OfflineDataBatch {
    sessionId: string;
    workOrders?: any[];
    inspections?: any[];
    scans?: any[];
    photos?: any[];
    locations?: any[];
}
/**
 * Push Notification Data
 */
export interface PushNotificationData {
    userId: string;
    title: string;
    message: string;
    priority: NotificationPriority;
    data?: Record<string, any>;
    actionUrl?: string;
}
/**
 * Location Update Data
 */
export interface LocationUpdateData {
    sessionId: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
}
/**
 * Photo Upload Data
 */
export interface PhotoUploadData {
    sessionId: string;
    assetId?: string;
    workOrderId?: string;
    inspectionId?: string;
    photoUrl: string;
    caption?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}
/**
 * Mobile Session Model
 */
export declare class MobileSession extends Model {
    id: string;
    userId: string;
    deviceId: string;
    deviceName?: string;
    platform: PlatformType;
    osVersion?: string;
    appVersion: string;
    status: MobileSessionStatus;
    pushToken?: string;
    sessionToken?: string;
    lastActivity: Date;
    ipAddress?: string;
    offlineMode: boolean;
    lastSyncTime?: Date;
    loggedOutAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    scans?: AssetScan[];
    locations?: LocationTracking[];
}
/**
 * Asset Scan Model
 */
export declare class AssetScan extends Model {
    id: string;
    sessionId: string;
    assetId?: string;
    scanType: ScanType;
    code: string;
    scannedAt: Date;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    metadata?: Record<string, any>;
    successful: boolean;
    createdAt: Date;
    updatedAt: Date;
    session?: MobileSession;
}
/**
 * Mobile Work Order Model
 */
export declare class MobileWorkOrder extends Model {
    id: string;
    workOrderId: string;
    assignedTo: string;
    status: MobileWorkOrderStatus;
    dueDate?: Date;
    priority?: string;
    instructions?: string;
    progress: number;
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    notes?: string;
    photos?: string[];
    signature?: string;
    partsUsed?: PartUsed[];
    laborHours?: number;
    latitude?: number;
    longitude?: number;
    synced: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Mobile Inspection Model
 */
export declare class MobileInspection extends Model {
    id: string;
    assetId: string;
    inspectionTemplateId: string;
    inspectedBy: string;
    status: InspectionStatus;
    scheduledDate?: Date;
    startedAt?: Date;
    completedAt?: Date;
    responses?: InspectionResponse[];
    passed?: boolean;
    score?: number;
    photos?: string[];
    signature?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    synced: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Offline Sync Queue Model
 */
export declare class OfflineSyncQueue extends Model {
    id: string;
    sessionId: string;
    entityType: string;
    entityId: string;
    operation: string;
    data: Record<string, any>;
    status: SyncStatus;
    priority: number;
    retryCount: number;
    maxRetries: number;
    errorMessage?: string;
    syncedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    session?: MobileSession;
}
/**
 * Push Notification Model
 */
export declare class PushNotification extends Model {
    id: string;
    userId: string;
    title: string;
    message: string;
    priority: NotificationPriority;
    status: string;
    data?: Record<string, any>;
    actionUrl?: string;
    scheduledFor?: Date;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    errorMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Location Tracking Model
 */
export declare class LocationTracking extends Model {
    id: string;
    sessionId: string;
    userId: string;
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
    session?: MobileSession;
}
/**
 * Mobile Photo Model
 */
export declare class MobilePhoto extends Model {
    id: string;
    sessionId: string;
    assetId?: string;
    workOrderId?: string;
    inspectionId?: string;
    photoUrl: string;
    thumbnailUrl?: string;
    caption?: string;
    latitude?: number;
    longitude?: number;
    fileSize?: number;
    synced: boolean;
    createdAt: Date;
    updatedAt: Date;
    session?: MobileSession;
}
/**
 * Creates mobile session
 *
 * @param data - Session data
 * @param transaction - Optional database transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createMobileSession({
 *   userId: 'user-123',
 *   deviceId: 'device-456',
 *   deviceName: 'iPhone 13',
 *   platform: PlatformType.IOS,
 *   osVersion: '16.0',
 *   appVersion: '2.1.0',
 *   pushToken: 'fcm-token-xxx'
 * });
 * ```
 */
export declare function createMobileSession(data: MobileSessionData, transaction?: Transaction): Promise<MobileSession>;
/**
 * Updates session activity
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await updateSessionActivity('session-123');
 * ```
 */
export declare function updateSessionActivity(sessionId: string, transaction?: Transaction): Promise<MobileSession>;
/**
 * Ends mobile session
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await endMobileSession('session-123');
 * ```
 */
export declare function endMobileSession(sessionId: string, transaction?: Transaction): Promise<MobileSession>;
/**
 * Gets active sessions for user
 *
 * @param userId - User ID
 * @returns Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveSessions('user-123');
 * ```
 */
export declare function getActiveSessions(userId: string): Promise<MobileSession[]>;
/**
 * Scans asset barcode
 *
 * @param data - Scan data
 * @param transaction - Optional database transaction
 * @returns Scan record and asset data
 *
 * @example
 * ```typescript
 * const result = await scanAssetBarcode({
 *   sessionId: 'session-123',
 *   scanType: ScanType.BARCODE,
 *   code: '123456789',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export declare function scanAssetBarcode(data: ScanData, transaction?: Transaction): Promise<{
    scan: AssetScan;
    asset?: any;
}>;
/**
 * Gets scan history
 *
 * @param sessionId - Session ID
 * @param limit - Maximum scans to return
 * @returns Scan history
 *
 * @example
 * ```typescript
 * const history = await getScanHistory('session-123', 50);
 * ```
 */
export declare function getScanHistory(sessionId: string, limit?: number): Promise<AssetScan[]>;
/**
 * Gets scans by asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Asset scans
 *
 * @example
 * ```typescript
 * const scans = await getScansByAsset('asset-123', startDate, endDate);
 * ```
 */
export declare function getScansByAsset(assetId: string, startDate?: Date, endDate?: Date): Promise<AssetScan[]>;
/**
 * Creates mobile work order
 *
 * @param data - Work order data
 * @param transaction - Optional database transaction
 * @returns Created mobile work order
 *
 * @example
 * ```typescript
 * const wo = await createMobileWorkOrder({
 *   workOrderId: 'wo-123',
 *   assignedTo: 'user-456',
 *   dueDate: new Date('2024-12-31'),
 *   priority: 'high',
 *   instructions: 'Replace worn bearings'
 * });
 * ```
 */
export declare function createMobileWorkOrder(data: MobileWorkOrderData, transaction?: Transaction): Promise<MobileWorkOrder>;
/**
 * Updates mobile work order
 *
 * @param data - Update data
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await updateMobileWorkOrder({
 *   workOrderId: 'wo-123',
 *   status: MobileWorkOrderStatus.COMPLETED,
 *   progress: 100,
 *   notes: 'Work completed successfully',
 *   laborHours: 2.5,
 *   signature: 'data:image/png;base64,...'
 * });
 * ```
 */
export declare function updateMobileWorkOrder(data: WorkOrderUpdateData, transaction?: Transaction): Promise<MobileWorkOrder>;
/**
 * Gets mobile work orders for user
 *
 * @param userId - User ID
 * @param status - Optional status filter
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const workOrders = await getMobileWorkOrders('user-123', MobileWorkOrderStatus.ASSIGNED);
 * ```
 */
export declare function getMobileWorkOrders(userId: string, status?: MobileWorkOrderStatus): Promise<MobileWorkOrder[]>;
/**
 * Creates mobile inspection
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await createMobileInspection({
 *   assetId: 'asset-123',
 *   inspectionTemplateId: 'template-456',
 *   inspectedBy: 'user-789',
 *   scheduledDate: new Date('2024-12-01')
 * });
 * ```
 */
export declare function createMobileInspection(data: MobileInspectionData, transaction?: Transaction): Promise<MobileInspection>;
/**
 * Submits mobile inspection
 *
 * @param data - Submission data
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 *
 * @example
 * ```typescript
 * await submitMobileInspection({
 *   inspectionId: 'inspection-123',
 *   responses: [
 *     { checkpointId: 'cp-1', response: 'pass', passed: true },
 *     { checkpointId: 'cp-2', response: 'fail', passed: false, notes: 'Needs repair' }
 *   ],
 *   photos: ['photo-url-1', 'photo-url-2'],
 *   signature: 'signature-url',
 *   notes: 'Overall condition fair'
 * });
 * ```
 */
export declare function submitMobileInspection(data: InspectionSubmissionData, transaction?: Transaction): Promise<MobileInspection>;
/**
 * Gets mobile inspections
 *
 * @param userId - User ID
 * @param status - Optional status filter
 * @returns Inspections
 *
 * @example
 * ```typescript
 * const inspections = await getMobileInspections('user-123', InspectionStatus.PENDING);
 * ```
 */
export declare function getMobileInspections(userId: string, status?: InspectionStatus): Promise<MobileInspection[]>;
/**
 * Queues offline data for sync
 *
 * @param sessionId - Session ID
 * @param entityType - Entity type
 * @param entityId - Entity ID
 * @param operation - Operation type
 * @param data - Data payload
 * @param transaction - Optional database transaction
 * @returns Queue entry
 *
 * @example
 * ```typescript
 * await queueOfflineSync('session-123', 'work_order', 'wo-456', 'update', { status: 'completed' });
 * ```
 */
export declare function queueOfflineSync(sessionId: string, entityType: string, entityId: string, operation: string, data: Record<string, any>, transaction?: Transaction): Promise<OfflineSyncQueue>;
/**
 * Syncs offline data
 *
 * @param sessionId - Session ID
 * @param batch - Offline data batch
 * @param transaction - Optional database transaction
 * @returns Sync results
 *
 * @example
 * ```typescript
 * const results = await syncOfflineData('session-123', {
 *   sessionId: 'session-123',
 *   workOrders: [...],
 *   inspections: [...],
 *   scans: [...]
 * });
 * ```
 */
export declare function syncOfflineData(sessionId: string, batch: OfflineDataBatch, transaction?: Transaction): Promise<{
    synced: number;
    failed: number;
    errors: any[];
}>;
/**
 * Processes sync queue
 *
 * @param sessionId - Session ID
 * @param transaction - Optional database transaction
 * @returns Processed count
 *
 * @example
 * ```typescript
 * const count = await processSyncQueue('session-123');
 * ```
 */
export declare function processSyncQueue(sessionId: string, transaction?: Transaction): Promise<number>;
/**
 * Sends push notification
 *
 * @param data - Notification data
 * @param transaction - Optional database transaction
 * @returns Created notification
 *
 * @example
 * ```typescript
 * await sendPushNotification({
 *   userId: 'user-123',
 *   title: 'Work Order Due',
 *   message: 'WO-2024-001 is due today',
 *   priority: NotificationPriority.HIGH,
 *   actionUrl: '/work-orders/wo-2024-001'
 * });
 * ```
 */
export declare function sendPushNotification(data: PushNotificationData, transaction?: Transaction): Promise<PushNotification>;
/**
 * Gets notifications for user
 *
 * @param userId - User ID
 * @param unreadOnly - Get unread only
 * @param limit - Maximum notifications
 * @returns Notifications
 *
 * @example
 * ```typescript
 * const notifications = await getNotifications('user-123', true, 50);
 * ```
 */
export declare function getNotifications(userId: string, unreadOnly?: boolean, limit?: number): Promise<PushNotification[]>;
/**
 * Marks notification as read
 *
 * @param notificationId - Notification ID
 * @param transaction - Optional database transaction
 * @returns Updated notification
 *
 * @example
 * ```typescript
 * await markNotificationRead('notification-123');
 * ```
 */
export declare function markNotificationRead(notificationId: string, transaction?: Transaction): Promise<PushNotification>;
/**
 * Updates user location
 *
 * @param data - Location data
 * @param transaction - Optional database transaction
 * @returns Location record
 *
 * @example
 * ```typescript
 * await updateLocation({
 *   sessionId: 'session-123',
 *   latitude: 40.7128,
 *   longitude: -74.0060,
 *   accuracy: 10,
 *   speed: 2.5
 * });
 * ```
 */
export declare function updateLocation(data: LocationUpdateData, transaction?: Transaction): Promise<LocationTracking>;
/**
 * Gets location history
 *
 * @param sessionId - Session ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Location history
 *
 * @example
 * ```typescript
 * const history = await getLocationHistory('session-123', startDate, endDate);
 * ```
 */
export declare function getLocationHistory(sessionId: string, startDate: Date, endDate: Date): Promise<LocationTracking[]>;
/**
 * Uploads mobile photo
 *
 * @param data - Photo data
 * @param transaction - Optional database transaction
 * @returns Photo record
 *
 * @example
 * ```typescript
 * const photo = await uploadMobilePhoto({
 *   sessionId: 'session-123',
 *   workOrderId: 'wo-456',
 *   photoUrl: 's3://bucket/photo.jpg',
 *   caption: 'Before repair',
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export declare function uploadMobilePhoto(data: PhotoUploadData, transaction?: Transaction): Promise<MobilePhoto>;
/**
 * Gets photos for entity
 *
 * @param entityType - Entity type
 * @param entityId - Entity ID
 * @returns Photos
 *
 * @example
 * ```typescript
 * const photos = await getPhotosForEntity('work_order', 'wo-123');
 * ```
 */
export declare function getPhotosForEntity(entityType: string, entityId: string): Promise<MobilePhoto[]>;
/**
 * Creates mobile form
 *
 * @param name - Form name
 * @param formType - Form type
 * @param fields - Form fields
 * @param transaction - Optional database transaction
 * @returns Form definition
 *
 * @example
 * ```typescript
 * await createMobileForm('Safety Inspection', 'inspection', fields);
 * ```
 */
export declare function createMobileForm(name: string, formType: string, fields: Record<string, any>[], transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Gets mobile form by ID
 *
 * @param formId - Form ID
 * @returns Form definition
 *
 * @example
 * ```typescript
 * const form = await getMobileForm('form-123');
 * ```
 */
export declare function getMobileForm(formId: string): Promise<Record<string, any>>;
/**
 * Submits mobile form response
 *
 * @param formId - Form ID
 * @param assetId - Asset ID
 * @param responses - Form responses
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Submission record
 *
 * @example
 * ```typescript
 * await submitMobileForm('form-123', 'asset-456', responses, 'user-789');
 * ```
 */
export declare function submitMobileForm(formId: string, assetId: string, responses: Record<string, any>, userId: string, transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Captures digital signature
 *
 * @param userId - User ID
 * @param documentId - Document ID
 * @param signatureData - Signature image data
 * @param transaction - Optional database transaction
 * @returns Signature record
 *
 * @example
 * ```typescript
 * await captureDigitalSignature('user-123', 'doc-456', base64Data);
 * ```
 */
export declare function captureDigitalSignature(userId: string, documentId: string, signatureData: string, transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Verifies signature
 *
 * @param signatureId - Signature ID
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const valid = await verifySignature('signature-123');
 * ```
 */
export declare function verifySignature(signatureId: string): Promise<boolean>;
/**
 * Records voice note
 *
 * @param assetId - Asset ID
 * @param userId - User ID
 * @param audioData - Audio data
 * @param duration - Duration in seconds
 * @param transaction - Optional database transaction
 * @returns Voice note record
 *
 * @example
 * ```typescript
 * await recordVoiceNote('asset-123', 'user-456', audioBlob, 45);
 * ```
 */
export declare function recordVoiceNote(assetId: string, userId: string, audioData: string, duration: number, transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Gets voice notes for asset
 *
 * @param assetId - Asset ID
 * @returns Voice notes
 *
 * @example
 * ```typescript
 * const notes = await getVoiceNotes('asset-123');
 * ```
 */
export declare function getVoiceNotes(assetId: string): Promise<Record<string, any>[]>;
/**
 * Gets mobile usage analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getMobileAnalytics(new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare function getMobileAnalytics(startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Gets user mobile activity
 *
 * @param userId - User ID
 * @param days - Number of days to analyze
 * @returns Activity report
 *
 * @example
 * ```typescript
 * const activity = await getUserMobileActivity('user-123', 30);
 * ```
 */
export declare function getUserMobileActivity(userId: string, days?: number): Promise<Record<string, any>>;
/**
 * Registers mobile device
 *
 * @param userId - User ID
 * @param deviceInfo - Device information
 * @param transaction - Optional database transaction
 * @returns Device registration
 *
 * @example
 * ```typescript
 * await registerMobileDevice('user-123', deviceInfo);
 * ```
 */
export declare function registerMobileDevice(userId: string, deviceInfo: Record<string, any>, transaction?: Transaction): Promise<Record<string, any>>;
/**
 * Unregisters mobile device
 *
 * @param deviceId - Device ID
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await unregisterMobileDevice('device-123');
 * ```
 */
export declare function unregisterMobileDevice(deviceId: string, transaction?: Transaction): Promise<boolean>;
/**
 * Gets registered mobile devices for user
 *
 * @param userId - User ID
 * @returns Registered devices
 *
 * @example
 * ```typescript
 * const devices = await getRegisteredDevices('user-123');
 * ```
 */
export declare function getRegisteredDevices(userId: string): Promise<Record<string, any>[]>;
declare const _default: {
    MobileSession: typeof MobileSession;
    AssetScan: typeof AssetScan;
    MobileWorkOrder: typeof MobileWorkOrder;
    MobileInspection: typeof MobileInspection;
    OfflineSyncQueue: typeof OfflineSyncQueue;
    PushNotification: typeof PushNotification;
    LocationTracking: typeof LocationTracking;
    MobilePhoto: typeof MobilePhoto;
    createMobileSession: typeof createMobileSession;
    updateSessionActivity: typeof updateSessionActivity;
    endMobileSession: typeof endMobileSession;
    getActiveSessions: typeof getActiveSessions;
    scanAssetBarcode: typeof scanAssetBarcode;
    getScanHistory: typeof getScanHistory;
    getScansByAsset: typeof getScansByAsset;
    createMobileWorkOrder: typeof createMobileWorkOrder;
    updateMobileWorkOrder: typeof updateMobileWorkOrder;
    getMobileWorkOrders: typeof getMobileWorkOrders;
    createMobileInspection: typeof createMobileInspection;
    submitMobileInspection: typeof submitMobileInspection;
    getMobileInspections: typeof getMobileInspections;
    queueOfflineSync: typeof queueOfflineSync;
    syncOfflineData: typeof syncOfflineData;
    processSyncQueue: typeof processSyncQueue;
    sendPushNotification: typeof sendPushNotification;
    getNotifications: typeof getNotifications;
    markNotificationRead: typeof markNotificationRead;
    updateLocation: typeof updateLocation;
    getLocationHistory: typeof getLocationHistory;
    uploadMobilePhoto: typeof uploadMobilePhoto;
    getPhotosForEntity: typeof getPhotosForEntity;
    createMobileForm: typeof createMobileForm;
    getMobileForm: typeof getMobileForm;
    submitMobileForm: typeof submitMobileForm;
    captureDigitalSignature: typeof captureDigitalSignature;
    verifySignature: typeof verifySignature;
    recordVoiceNote: typeof recordVoiceNote;
    getVoiceNotes: typeof getVoiceNotes;
    getMobileAnalytics: typeof getMobileAnalytics;
    getUserMobileActivity: typeof getUserMobileActivity;
    registerMobileDevice: typeof registerMobileDevice;
    unregisterMobileDevice: typeof unregisterMobileDevice;
    getRegisteredDevices: typeof getRegisteredDevices;
};
export default _default;
//# sourceMappingURL=asset-mobile-commands.d.ts.map