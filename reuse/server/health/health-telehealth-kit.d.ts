/**
 * LOC: HEALTH_TELEHEALTH_001
 * File: /reuse/server/health/health-telehealth-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - uuid
 *   - crypto (Node.js)
 *   - ../authentication-kit
 *   - ../security-encryption-kit
 *
 * DOWNSTREAM (imported by):
 *   - Telehealth services
 *   - Virtual visit controllers
 *   - Video session management
 *   - WebRTC services
 *   - Remote patient monitoring
 *   - Healthcare compliance services
 */
import { z } from 'zod';
/**
 * Virtual visit status enumeration
 */
export declare enum VirtualVisitStatus {
    SCHEDULED = "scheduled",
    IN_WAITING_ROOM = "in_waiting_room",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled",
    TECHNICAL_ISSUE = "technical_issue"
}
/**
 * Visit type enumeration
 */
export declare enum VisitType {
    INITIAL_CONSULTATION = "initial_consultation",
    FOLLOW_UP = "follow_up",
    URGENT_CARE = "urgent_care",
    MENTAL_HEALTH = "mental_health",
    CHRONIC_CARE = "chronic_care",
    POST_OPERATIVE = "post_operative",
    SPECIALIST_CONSULT = "specialist_consult",
    GROUP_THERAPY = "group_therapy"
}
/**
 * Video session status
 */
export declare enum VideoSessionStatus {
    PENDING = "pending",
    ACTIVE = "active",
    PAUSED = "paused",
    ENDED = "ended",
    FAILED = "failed",
    RECONNECTING = "reconnecting"
}
/**
 * Recording status
 */
export declare enum RecordingStatus {
    NOT_STARTED = "not_started",
    RECORDING = "recording",
    PAUSED = "paused",
    STOPPED = "stopped",
    PROCESSING = "processing",
    AVAILABLE = "available",
    FAILED = "failed",
    DELETED = "deleted"
}
/**
 * Consent type
 */
export declare enum ConsentType {
    TELEHEALTH_SERVICES = "telehealth_services",
    VIDEO_RECORDING = "video_recording",
    SCREEN_SHARING = "screen_sharing",
    PHOTO_CAPTURE = "photo_capture",
    DATA_SHARING = "data_sharing",
    INTERPRETER_SERVICES = "interpreter_services"
}
/**
 * Participant role
 */
export declare enum ParticipantRole {
    PATIENT = "patient",
    PROVIDER = "provider",
    INTERPRETER = "interpreter",
    SPECIALIST = "specialist",
    FAMILY_MEMBER = "family_member",
    CAREGIVER = "caregiver",
    STUDENT = "student",
    OBSERVER = "observer"
}
/**
 * Connection quality
 */
export declare enum ConnectionQuality {
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    VERY_POOR = "very_poor",
    DISCONNECTED = "disconnected"
}
/**
 * Interpreter language
 */
export declare enum InterpreterLanguage {
    SPANISH = "spanish",
    MANDARIN = "mandarin",
    FRENCH = "french",
    ARABIC = "arabic",
    VIETNAMESE = "vietnamese",
    KOREAN = "korean",
    RUSSIAN = "russian",
    PORTUGUESE = "portuguese",
    ASL = "asl",// American Sign Language
    OTHER = "other"
}
/**
 * Virtual visit interface
 */
export interface VirtualVisit {
    id: string;
    patientId: string;
    providerId: string;
    visitType: VisitType;
    status: VirtualVisitStatus;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
    timezone: string;
    chiefComplaint?: string;
    visitReason: string;
    visitNotes?: string;
    diagnosisCodes?: string[];
    procedureCodes?: string[];
    sessionId?: string;
    waitingRoomEntryTime?: Date;
    waitingDuration?: number;
    consentGiven: boolean;
    consentTimestamp?: Date;
    recordingConsent: boolean;
    recordingId?: string;
    billingCode?: string;
    billingAmount?: number;
    insuranceClaim?: string;
    encounterId?: string;
    departmentId?: string;
    locationId?: string;
    requiresInterpreter: boolean;
    interpreterLanguage?: InterpreterLanguage;
    interpreterRequestId?: string;
    connectionQuality?: ConnectionQuality;
    patientSatisfactionScore?: number;
    technicalIssues?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Video session interface
 */
export interface VideoSession {
    id: string;
    visitId: string;
    status: VideoSessionStatus;
    roomId: string;
    sessionToken: string;
    encryptionKey: string;
    participants: SessionParticipant[];
    maxParticipants: number;
    screenSharingEnabled: boolean;
    recordingEnabled: boolean;
    chatEnabled: boolean;
    virtualBackgroundEnabled: boolean;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    averageBandwidth?: number;
    averageLatency?: number;
    packetLoss?: number;
    reconnectionAttempts?: number;
    recordingId?: string;
    recordingStartTime?: Date;
    recordingEndTime?: Date;
    encryptedTransport: boolean;
    e2eeEnabled: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Session participant interface
 */
export interface SessionParticipant {
    id: string;
    sessionId: string;
    userId: string;
    role: ParticipantRole;
    joinedAt: Date;
    leftAt?: Date;
    connectionId: string;
    ipAddress: string;
    userAgent: string;
    canShareScreen: boolean;
    canRecord: boolean;
    canChat: boolean;
    canMute: boolean;
    isActive: boolean;
    isMuted: boolean;
    isVideoOff: boolean;
    isSharingScreen: boolean;
    connectionQuality: ConnectionQuality;
    bandwidth?: number;
    latency?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Session recording interface
 */
export interface SessionRecording {
    id: string;
    sessionId: string;
    visitId: string;
    status: RecordingStatus;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    encryptedStoragePath: string;
    storageKeyId: string;
    fileSize?: number;
    format: string;
    consentGiven: boolean;
    consentTimestamp: Date;
    consentDocumentId?: string;
    encryptionAlgorithm: string;
    accessRestricted: boolean;
    authorizedViewers: string[];
    retentionPeriodDays: number;
    expiryDate: Date;
    autoDeleteEnabled: boolean;
    deletedAt?: Date;
    hipaaCompliant: boolean;
    auditLog: AuditEntry[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Waiting room entry interface
 */
export interface WaitingRoomEntry {
    id: string;
    visitId: string;
    patientId: string;
    providerId: string;
    entryTime: Date;
    estimatedWaitTime?: number;
    queuePosition?: number;
    priority: 'routine' | 'urgent' | 'emergency';
    status: 'waiting' | 'notified' | 'admitted' | 'left' | 'cancelled';
    notifiedAt?: Date;
    admittedAt?: Date;
    exitTime?: Date;
    actualWaitTime?: number;
    consentCompleted: boolean;
    formsCompleted: boolean;
    technicalCheckPassed: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Chat message interface
 */
export interface ChatMessage {
    id: string;
    sessionId: string;
    senderId: string;
    senderRole: ParticipantRole;
    encryptedMessage: string;
    iv: string;
    authTag?: string;
    messageType: 'text' | 'file' | 'image' | 'system';
    attachmentId?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentSize?: number;
    sentAt: Date;
    deliveredAt?: Date;
    readAt?: Date;
    readBy: string[];
    flagged: boolean;
    flagReason?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    deletedAt?: Date;
}
/**
 * Telehealth consent interface
 */
export interface TelehealthConsent {
    id: string;
    patientId: string;
    visitId?: string;
    consentType: ConsentType;
    consentGiven: boolean;
    consentText: string;
    electronicSignature: string;
    signedAt: Date;
    ipAddress: string;
    userAgent: string;
    twoFactorVerified: boolean;
    expiresAt?: Date;
    revokedAt?: Date;
    revokedReason?: string;
    consentVersion: string;
    legalGuardianId?: string;
    witnessId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * E-visit (asynchronous) interface
 */
export interface EVisit {
    id: string;
    patientId: string;
    providerId?: string;
    chiefComplaint: string;
    symptoms: string[];
    durationDays: number;
    severity: 'mild' | 'moderate' | 'severe';
    currentMedications?: string[];
    allergies?: string[];
    relevantHistory?: string;
    photos?: string[];
    documents?: string[];
    providerResponse?: string;
    prescriptions?: string[];
    recommendations?: string[];
    followUpRequired: boolean;
    status: 'submitted' | 'in_review' | 'responded' | 'closed';
    submittedAt: Date;
    reviewedAt?: Date;
    respondedAt?: Date;
    closedAt?: Date;
    billingCode?: string;
    billingAmount?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Remote patient monitoring data
 */
export interface RPMData {
    id: string;
    patientId: string;
    deviceId: string;
    dataType: 'vitals' | 'glucose' | 'weight' | 'blood_pressure' | 'heart_rate' | 'oxygen' | 'activity' | 'sleep';
    encryptedData: string;
    iv: string;
    authTag?: string;
    recordedAt: Date;
    transmittedAt: Date;
    deviceModel?: string;
    firmwareVersion?: string;
    alertGenerated: boolean;
    alertSeverity?: 'low' | 'medium' | 'high' | 'critical';
    alertReason?: string;
    reviewed: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
    reviewNotes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Bandwidth quality check result
 */
export interface BandwidthCheckResult {
    id: string;
    userId: string;
    visitId?: string;
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
    packetLoss: number;
    overallQuality: ConnectionQuality;
    videoQualitySupported: 'hd' | 'sd' | 'low' | 'audio_only';
    recommendedAction?: string;
    browser: string;
    os: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    testDuration: number;
    serverLocation: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Interpreter request interface
 */
export interface InterpreterRequest {
    id: string;
    visitId: string;
    language: InterpreterLanguage;
    dialectPreference?: string;
    requestedAt: Date;
    urgency: 'routine' | 'urgent' | 'emergency';
    estimatedDuration: number;
    interpreterId?: string;
    assignedAt?: Date;
    status: 'pending' | 'assigned' | 'active' | 'completed' | 'cancelled';
    joinedAt?: Date;
    leftAt?: Date;
    actualDuration?: number;
    interpreterRating?: number;
    interpreterFeedback?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Telehealth analytics interface
 */
export interface TelehealthAnalytics {
    id: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    totalVisits: number;
    completedVisits: number;
    cancelledVisits: number;
    noShowRate: number;
    averageWaitTime: number;
    averageVisitDuration: number;
    averageConnectionQuality: number;
    technicalIssueRate: number;
    averageSatisfactionScore: number;
    providerUtilization: number;
    averageVisitsPerProvider: number;
    totalRevenue: number;
    averageReimbursement: number;
    consentCompletionRate: number;
    recordingConsentRate: number;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Audit entry interface
 */
export interface AuditEntry {
    timestamp: Date;
    action: string;
    userId: string;
    userRole: string;
    ipAddress?: string;
    details?: Record<string, any>;
}
export declare const VirtualVisitSchema: any;
export declare const BandwidthTestSchema: any;
export declare const ChatMessageSchema: any;
export declare const ConsentSchema: any;
export declare const EVisitSchema: any;
/**
 * 1. Schedules a new virtual visit with HIPAA-compliant data handling.
 *
 * @param {object} visitData - Visit scheduling data
 * @returns {VirtualVisit} The created virtual visit
 *
 * @example
 * ```typescript
 * const visit = await scheduleVirtualVisit({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   visitType: VisitType.FOLLOW_UP,
 *   scheduledStartTime: new Date('2025-01-15T10:00:00Z'),
 *   scheduledEndTime: new Date('2025-01-15T10:30:00Z'),
 *   timezone: 'America/New_York',
 *   visitReason: 'Follow-up diabetes management',
 *   requiresInterpreter: false,
 *   recordingConsent: true
 * });
 * ```
 */
export declare function scheduleVirtualVisit(visitData: z.infer<typeof VirtualVisitSchema>): Promise<VirtualVisit>;
/**
 * 2. Validates provider availability for virtual visit scheduling.
 *
 * @param {string} providerId - Provider user ID
 * @param {Date} startTime - Requested start time
 * @param {Date} endTime - Requested end time
 * @returns {Promise<boolean>} True if provider is available
 *
 * @example
 * ```typescript
 * const isAvailable = await checkProviderAvailability(
 *   'provider-456',
 *   new Date('2025-01-15T10:00:00Z'),
 *   new Date('2025-01-15T10:30:00Z')
 * );
 * if (!isAvailable) {
 *   throw new ConflictException('Provider not available at requested time');
 * }
 * ```
 */
export declare function checkProviderAvailability(providerId: string, startTime: Date, endTime: Date): Promise<boolean>;
/**
 * 3. Sends virtual visit reminder notifications to patient and provider.
 *
 * @param {string} visitId - Virtual visit ID
 * @param {number} minutesBefore - Minutes before visit to send reminder
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * // Send reminder 15 minutes before visit
 * await sendVisitReminder('visit-789', 15);
 * ```
 */
export declare function sendVisitReminder(visitId: string, minutesBefore?: number): Promise<void>;
/**
 * 4. Reschedules an existing virtual visit with audit trail.
 *
 * @param {string} visitId - Visit ID to reschedule
 * @param {Date} newStartTime - New scheduled start time
 * @param {Date} newEndTime - New scheduled end time
 * @param {string} reason - Reason for rescheduling
 * @returns {Promise<VirtualVisit>} Updated visit
 *
 * @example
 * ```typescript
 * const rescheduled = await rescheduleVirtualVisit(
 *   'visit-789',
 *   new Date('2025-01-16T10:00:00Z'),
 *   new Date('2025-01-16T10:30:00Z'),
 *   'Provider emergency - patient agreed to reschedule'
 * );
 * ```
 */
export declare function rescheduleVirtualVisit(visitId: string, newStartTime: Date, newEndTime: Date, reason: string): Promise<VirtualVisit>;
/**
 * 5. Cancels a virtual visit with notification and billing adjustments.
 *
 * @param {string} visitId - Visit ID to cancel
 * @param {string} cancelledBy - User ID who cancelled
 * @param {string} reason - Cancellation reason
 * @returns {Promise<VirtualVisit>} Cancelled visit
 *
 * @example
 * ```typescript
 * const cancelled = await cancelVirtualVisit(
 *   'visit-789',
 *   'patient-123',
 *   'Patient feeling better - no longer needs appointment'
 * );
 * ```
 */
export declare function cancelVirtualVisit(visitId: string, cancelledBy: string, reason: string): Promise<VirtualVisit>;
/**
 * 6. Initializes a secure WebRTC video session with end-to-end encryption.
 *
 * @param {string} visitId - Virtual visit ID
 * @param {number} maxParticipants - Maximum number of participants
 * @returns {Promise<VideoSession>} Created video session
 *
 * @example
 * ```typescript
 * const session = await initializeVideoSession('visit-789', 3);
 * console.log('Join URL:', `https://telehealth.whitecross.com/session/${session.roomId}?token=${session.sessionToken}`);
 * ```
 */
export declare function initializeVideoSession(visitId: string, maxParticipants?: number): Promise<VideoSession>;
/**
 * 7. Adds a participant to a video session with role-based permissions.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} userId - User ID joining
 * @param {ParticipantRole} role - Participant role
 * @param {object} connectionInfo - Connection metadata
 * @returns {Promise<SessionParticipant>} Created participant
 *
 * @example
 * ```typescript
 * const participant = await addSessionParticipant(
 *   'session-123',
 *   'provider-456',
 *   ParticipantRole.PROVIDER,
 *   {
 *     ipAddress: req.ip,
 *     userAgent: req.headers['user-agent'],
 *     connectionId: 'conn-abc123'
 *   }
 * );
 * ```
 */
export declare function addSessionParticipant(sessionId: string, userId: string, role: ParticipantRole, connectionInfo: {
    ipAddress: string;
    userAgent: string;
    connectionId: string;
}): Promise<SessionParticipant>;
/**
 * 8. Monitors and updates video session quality metrics in real-time.
 *
 * @param {string} sessionId - Video session ID
 * @param {object} qualityMetrics - Quality measurements
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateSessionQuality('session-123', {
 *   bandwidth: 2500, // kbps
 *   latency: 45, // ms
 *   packetLoss: 0.5, // percentage
 *   jitter: 10 // ms
 * });
 * ```
 */
export declare function updateSessionQuality(sessionId: string, qualityMetrics: {
    bandwidth: number;
    latency: number;
    packetLoss: number;
    jitter?: number;
}): Promise<void>;
/**
 * 9. Ends a video session and calculates final metrics.
 *
 * @param {string} sessionId - Video session ID
 * @returns {Promise<VideoSession>} Updated session with final metrics
 *
 * @example
 * ```typescript
 * const ended = await endVideoSession('session-123');
 * console.log(`Session duration: ${ended.duration} seconds`);
 * ```
 */
export declare function endVideoSession(sessionId: string): Promise<VideoSession>;
/**
 * 10. Handles session reconnection with automatic quality adjustment.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} participantId - Participant attempting to reconnect
 * @returns {Promise<{ reconnectionToken: string; qualityProfile: string }>}
 *
 * @example
 * ```typescript
 * const { reconnectionToken, qualityProfile } = await handleSessionReconnection(
 *   'session-123',
 *   'participant-456'
 * );
 * // Use reconnectionToken to rejoin with qualityProfile
 * ```
 */
export declare function handleSessionReconnection(sessionId: string, participantId: string): Promise<{
    reconnectionToken: string;
    qualityProfile: string;
}>;
/**
 * 11. Admits patient to virtual waiting room with queue management.
 *
 * @param {string} visitId - Virtual visit ID
 * @param {string} patientId - Patient user ID
 * @param {string} providerId - Provider user ID
 * @returns {Promise<WaitingRoomEntry>} Waiting room entry
 *
 * @example
 * ```typescript
 * const entry = await admitToWaitingRoom('visit-789', 'patient-123', 'provider-456');
 * console.log(`Queue position: ${entry.queuePosition}`);
 * console.log(`Estimated wait: ${entry.estimatedWaitTime} minutes`);
 * ```
 */
export declare function admitToWaitingRoom(visitId: string, patientId: string, providerId: string): Promise<WaitingRoomEntry>;
/**
 * 12. Performs pre-visit technical check (camera, microphone, bandwidth).
 *
 * @param {string} userId - User ID performing check
 * @param {string} waitingRoomEntryId - Waiting room entry ID
 * @returns {Promise<{ passed: boolean; issues: string[] }>}
 *
 * @example
 * ```typescript
 * const { passed, issues } = await performTechnicalCheck('patient-123', 'entry-456');
 * if (!passed) {
 *   console.log('Technical issues:', issues);
 *   // Provide troubleshooting guidance
 * }
 * ```
 */
export declare function performTechnicalCheck(userId: string, waitingRoomEntryId: string): Promise<{
    passed: boolean;
    issues: string[];
}>;
/**
 * 13. Updates waiting room queue position and estimated wait time.
 *
 * @param {string} providerId - Provider user ID
 * @returns {Promise<WaitingRoomEntry[]>} Updated queue
 *
 * @example
 * ```typescript
 * const queue = await updateWaitingRoomQueue('provider-456');
 * // Notify patients of updated positions
 * ```
 */
export declare function updateWaitingRoomQueue(providerId: string): Promise<WaitingRoomEntry[]>;
/**
 * 14. Notifies provider when patient is ready in waiting room.
 *
 * @param {string} waitingRoomEntryId - Waiting room entry ID
 * @param {string} providerId - Provider to notify
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyProviderPatientReady('entry-456', 'provider-789');
 * ```
 */
export declare function notifyProviderPatientReady(waitingRoomEntryId: string, providerId: string): Promise<void>;
/**
 * 15. Admits patient from waiting room to active video session.
 *
 * @param {string} waitingRoomEntryId - Waiting room entry ID
 * @param {string} sessionId - Video session ID
 * @returns {Promise<WaitingRoomEntry>} Updated entry
 *
 * @example
 * ```typescript
 * const admitted = await admitPatientToSession('entry-456', 'session-123');
 * console.log(`Actual wait time: ${admitted.actualWaitTime} seconds`);
 * ```
 */
export declare function admitPatientToSession(waitingRoomEntryId: string, sessionId: string): Promise<WaitingRoomEntry>;
/**
 * 16. Obtains and validates telehealth consent with electronic signature.
 *
 * @param {object} consentData - Consent data
 * @returns {Promise<TelehealthConsent>} Created consent record
 *
 * @example
 * ```typescript
 * const consent = await obtainTelehealthConsent({
 *   patientId: 'patient-123',
 *   visitId: 'visit-789',
 *   consentType: ConsentType.VIDEO_RECORDING,
 *   consentGiven: true,
 *   consentText: 'I consent to video recording...',
 *   electronicSignature: 'John Doe',
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   twoFactorVerified: true
 * });
 * ```
 */
export declare function obtainTelehealthConsent(consentData: z.infer<typeof ConsentSchema> & {
    visitId?: string;
    consentText: string;
}): Promise<TelehealthConsent>;
/**
 * 17. Starts encrypted session recording with HIPAA compliance.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} visitId - Virtual visit ID
 * @param {string} consentDocumentId - Consent document ID
 * @returns {Promise<SessionRecording>} Created recording
 *
 * @example
 * ```typescript
 * const recording = await startSessionRecording(
 *   'session-123',
 *   'visit-789',
 *   'consent-456'
 * );
 * console.log(`Recording ID: ${recording.id}`);
 * ```
 */
export declare function startSessionRecording(sessionId: string, visitId: string, consentDocumentId: string): Promise<SessionRecording>;
/**
 * 18. Stops session recording and initiates encryption processing.
 *
 * @param {string} recordingId - Recording ID
 * @returns {Promise<SessionRecording>} Updated recording
 *
 * @example
 * ```typescript
 * const stopped = await stopSessionRecording('recording-123');
 * console.log(`Recording duration: ${stopped.duration} seconds`);
 * ```
 */
export declare function stopSessionRecording(recordingId: string): Promise<SessionRecording>;
/**
 * 19. Grants access to encrypted recording with audit logging.
 *
 * @param {string} recordingId - Recording ID
 * @param {string} userId - User requesting access
 * @param {string} requestReason - Reason for access
 * @returns {Promise<{ accessToken: string; expiresIn: number }>}
 *
 * @example
 * ```typescript
 * const { accessToken, expiresIn } = await grantRecordingAccess(
 *   'recording-123',
 *   'provider-456',
 *   'Clinical review for care continuity'
 * );
 * // Use accessToken to decrypt and stream recording
 * ```
 */
export declare function grantRecordingAccess(recordingId: string, userId: string, requestReason: string): Promise<{
    accessToken: string;
    expiresIn: number;
}>;
/**
 * 20. Deletes recording after retention period with compliance verification.
 *
 * @param {string} recordingId - Recording ID
 * @param {string} deletedBy - User ID performing deletion
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteRecording('recording-123', 'admin-789');
 * ```
 */
export declare function deleteRecording(recordingId: string, deletedBy: string): Promise<void>;
/**
 * 21. Enables screen sharing with privacy controls.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} participantId - Participant sharing screen
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enableScreenSharing('session-123', 'provider-456');
 * ```
 */
export declare function enableScreenSharing(sessionId: string, participantId: string): Promise<void>;
/**
 * 22. Disables screen sharing.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} participantId - Participant stopping screen share
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await disableScreenSharing('session-123', 'provider-456');
 * ```
 */
export declare function disableScreenSharing(sessionId: string, participantId: string): Promise<void>;
/**
 * 23. Sends encrypted chat message with PHI protection.
 *
 * @param {object} messageData - Message data
 * @returns {Promise<ChatMessage>} Created chat message
 *
 * @example
 * ```typescript
 * const message = await sendEncryptedChatMessage({
 *   sessionId: 'session-123',
 *   senderId: 'provider-456',
 *   message: 'Your blood pressure reading looks good',
 *   messageType: 'text'
 * });
 * ```
 */
export declare function sendEncryptedChatMessage(messageData: z.infer<typeof ChatMessageSchema>): Promise<ChatMessage>;
/**
 * 24. Retrieves and decrypts chat history for session.
 *
 * @param {string} sessionId - Video session ID
 * @param {string} userId - User requesting history
 * @returns {Promise<ChatMessage[]>} Decrypted chat messages
 *
 * @example
 * ```typescript
 * const history = await getChatHistory('session-123', 'provider-456');
 * ```
 */
export declare function getChatHistory(sessionId: string, userId: string): Promise<ChatMessage[]>;
/**
 * 25. Flags inappropriate chat message for moderation.
 *
 * @param {string} messageId - Message ID to flag
 * @param {string} flaggedBy - User ID flagging message
 * @param {string} reason - Flag reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flagChatMessage('message-123', 'provider-456', 'Inappropriate content');
 * ```
 */
export declare function flagChatMessage(messageId: string, flaggedBy: string, reason: string): Promise<void>;
/**
 * 26. Submits asynchronous e-visit request with encrypted attachments.
 *
 * @param {object} evisitData - E-visit data
 * @returns {Promise<EVisit>} Created e-visit
 *
 * @example
 * ```typescript
 * const evisit = await submitEVisit({
 *   patientId: 'patient-123',
 *   chiefComplaint: 'Persistent headache for 3 days',
 *   symptoms: ['headache', 'sensitivity to light', 'nausea'],
 *   durationDays: 3,
 *   severity: 'moderate',
 *   currentMedications: ['Ibuprofen 400mg as needed'],
 *   allergies: ['Penicillin']
 * });
 * ```
 */
export declare function submitEVisit(evisitData: z.infer<typeof EVisitSchema>): Promise<EVisit>;
/**
 * 27. Provider responds to e-visit with recommendations.
 *
 * @param {string} evisitId - E-visit ID
 * @param {string} providerId - Provider user ID
 * @param {object} response - Provider response
 * @returns {Promise<EVisit>} Updated e-visit
 *
 * @example
 * ```typescript
 * const responded = await respondToEVisit('evisit-123', 'provider-456', {
 *   providerResponse: 'Based on your symptoms, this appears to be a migraine...',
 *   prescriptions: ['Sumatriptan 50mg, take as directed'],
 *   recommendations: ['Rest in dark room', 'Stay hydrated', 'Avoid triggers'],
 *   followUpRequired: true
 * });
 * ```
 */
export declare function respondToEVisit(evisitId: string, providerId: string, response: {
    providerResponse: string;
    prescriptions?: string[];
    recommendations?: string[];
    followUpRequired: boolean;
}): Promise<EVisit>;
/**
 * 28. Records encrypted remote patient monitoring data.
 *
 * @param {string} patientId - Patient user ID
 * @param {string} deviceId - Device identifier
 * @param {string} dataType - Type of monitoring data
 * @param {object} data - Health data to encrypt
 * @returns {Promise<RPMData>} Created RPM record
 *
 * @example
 * ```typescript
 * const rpmData = await recordRPMData(
 *   'patient-123',
 *   'device-glucose-001',
 *   'glucose',
 *   {
 *     value: 125,
 *     unit: 'mg/dL',
 *     beforeMeal: true,
 *     notes: 'Fasting measurement'
 *   }
 * );
 * ```
 */
export declare function recordRPMData(patientId: string, deviceId: string, dataType: string, data: Record<string, any>): Promise<RPMData>;
/**
 * 29. Reviews RPM data and adds clinical notes.
 *
 * @param {string} rpmDataId - RPM data ID
 * @param {string} providerId - Provider user ID
 * @param {string} notes - Clinical review notes
 * @returns {Promise<RPMData>} Updated RPM record
 *
 * @example
 * ```typescript
 * await reviewRPMData('rpm-123', 'provider-456', 'Glucose levels well controlled');
 * ```
 */
export declare function reviewRPMData(rpmDataId: string, providerId: string, notes: string): Promise<RPMData>;
/**
 * 30. Generates RPM alert for abnormal readings.
 *
 * @param {string} rpmDataId - RPM data ID
 * @param {string} severity - Alert severity
 * @param {string} reason - Alert reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await generateRPMAlert('rpm-123', 'high', 'Blood glucose critically high: 350 mg/dL');
 * ```
 */
export declare function generateRPMAlert(rpmDataId: string, severity: 'low' | 'medium' | 'high' | 'critical', reason: string): Promise<void>;
/**
 * 31. Generates telehealth billing code based on visit parameters.
 *
 * @param {VirtualVisit} visit - Virtual visit details
 * @returns {Promise<{ billingCode: string; billingAmount: number; description: string }>}
 *
 * @example
 * ```typescript
 * const billing = await generateTelehealthBillingCode(visit);
 * console.log(`CPT Code: ${billing.billingCode}`);
 * console.log(`Amount: $${billing.billingAmount}`);
 * ```
 */
export declare function generateTelehealthBillingCode(visit: VirtualVisit): Promise<{
    billingCode: string;
    billingAmount: number;
    description: string;
}>;
/**
 * 32. Validates insurance coverage for telehealth services.
 *
 * @param {string} patientId - Patient user ID
 * @param {string} billingCode - CPT billing code
 * @returns {Promise<{ covered: boolean; copay: number; coinsurance: number }>}
 *
 * @example
 * ```typescript
 * const coverage = await validateTelehealthCoverage('patient-123', '99213-95');
 * if (coverage.covered) {
 *   console.log(`Patient copay: $${coverage.copay}`);
 * }
 * ```
 */
export declare function validateTelehealthCoverage(patientId: string, billingCode: string): Promise<{
    covered: boolean;
    copay: number;
    coinsurance: number;
}>;
/**
 * 33. Requests interpreter services for virtual visit.
 *
 * @param {string} visitId - Virtual visit ID
 * @param {InterpreterLanguage} language - Required language
 * @param {string} urgency - Request urgency
 * @returns {Promise<InterpreterRequest>} Created interpreter request
 *
 * @example
 * ```typescript
 * const request = await requestInterpreterServices(
 *   'visit-789',
 *   InterpreterLanguage.SPANISH,
 *   'routine'
 * );
 * ```
 */
export declare function requestInterpreterServices(visitId: string, language: InterpreterLanguage, urgency?: 'routine' | 'urgent' | 'emergency'): Promise<InterpreterRequest>;
/**
 * 34. Assigns interpreter to virtual visit.
 *
 * @param {string} requestId - Interpreter request ID
 * @param {string} interpreterId - Interpreter user ID
 * @returns {Promise<InterpreterRequest>} Updated request
 *
 * @example
 * ```typescript
 * await assignInterpreter('request-123', 'interpreter-456');
 * ```
 */
export declare function assignInterpreter(requestId: string, interpreterId: string): Promise<InterpreterRequest>;
/**
 * 35. Rates interpreter service quality.
 *
 * @param {string} requestId - Interpreter request ID
 * @param {number} rating - Rating 1-5
 * @param {string} feedback - Optional feedback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rateInterpreterService('request-123', 5, 'Excellent interpretation, very professional');
 * ```
 */
export declare function rateInterpreterService(requestId: string, rating: number, feedback?: string): Promise<void>;
/**
 * 36. Performs bandwidth quality check before joining session.
 *
 * @param {string} userId - User ID performing check
 * @param {object} testResults - Bandwidth test results
 * @returns {Promise<BandwidthCheckResult>} Check result with recommendations
 *
 * @example
 * ```typescript
 * const check = await performBandwidthCheck('patient-123', {
 *   downloadSpeed: 25.5,
 *   uploadSpeed: 10.2,
 *   latency: 35,
 *   jitter: 5,
 *   packetLoss: 0.2
 * });
 * console.log(`Quality: ${check.overallQuality}`);
 * console.log(`Recommended: ${check.videoQualitySupported}`);
 * ```
 */
export declare function performBandwidthCheck(userId: string, testResults: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
    packetLoss: number;
}): Promise<BandwidthCheckResult>;
/**
 * 37. Monitors session bandwidth in real-time and adjusts quality.
 *
 * @param {string} sessionId - Video session ID
 * @param {number} currentBandwidth - Current bandwidth in kbps
 * @returns {Promise<{ adjustQuality: boolean; recommendedProfile: string }>}
 *
 * @example
 * ```typescript
 * const adjustment = await monitorSessionBandwidth('session-123', 1500);
 * if (adjustment.adjustQuality) {
 *   // Switch to recommendedProfile
 * }
 * ```
 */
export declare function monitorSessionBandwidth(sessionId: string, currentBandwidth: number): Promise<{
    adjustQuality: boolean;
    recommendedProfile: string;
}>;
/**
 * 38. Generates de-identified telehealth analytics report.
 *
 * @param {string} period - Reporting period
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @returns {Promise<TelehealthAnalytics>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateTelehealthAnalytics(
 *   'monthly',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * console.log(`Total visits: ${analytics.totalVisits}`);
 * console.log(`Avg satisfaction: ${analytics.averageSatisfactionScore}`);
 * ```
 */
export declare function generateTelehealthAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly', startDate: Date, endDate: Date): Promise<TelehealthAnalytics>;
/**
 * 39. Collects patient satisfaction survey after visit.
 *
 * @param {string} visitId - Virtual visit ID
 * @param {number} rating - Overall rating 1-5
 * @param {object} feedback - Detailed feedback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await collectPatientSatisfaction('visit-789', 5, {
 *   easeOfUse: 5,
 *   videoQuality: 4,
 *   audioQuality: 5,
 *   providerExperience: 5,
 *   wouldRecommend: true,
 *   comments: 'Excellent experience, very convenient'
 * });
 * ```
 */
export declare function collectPatientSatisfaction(visitId: string, rating: number, feedback: {
    easeOfUse?: number;
    videoQuality?: number;
    audioQuality?: number;
    providerExperience?: number;
    wouldRecommend?: boolean;
    comments?: string;
}): Promise<void>;
/**
 * 40. Generates comprehensive visit summary documentation.
 *
 * @param {string} visitId - Virtual visit ID
 * @returns {Promise<{ summary: string; documentation: string; nextSteps: string[] }>}
 *
 * @example
 * ```typescript
 * const summary = await generateVisitSummary('visit-789');
 * // Send to patient and add to EHR
 * ```
 */
export declare function generateVisitSummary(visitId: string): Promise<{
    summary: string;
    documentation: string;
    nextSteps: string[];
}>;
declare const _default: {
    scheduleVirtualVisit: typeof scheduleVirtualVisit;
    checkProviderAvailability: typeof checkProviderAvailability;
    sendVisitReminder: typeof sendVisitReminder;
    rescheduleVirtualVisit: typeof rescheduleVirtualVisit;
    cancelVirtualVisit: typeof cancelVirtualVisit;
    initializeVideoSession: typeof initializeVideoSession;
    addSessionParticipant: typeof addSessionParticipant;
    updateSessionQuality: typeof updateSessionQuality;
    endVideoSession: typeof endVideoSession;
    handleSessionReconnection: typeof handleSessionReconnection;
    admitToWaitingRoom: typeof admitToWaitingRoom;
    performTechnicalCheck: typeof performTechnicalCheck;
    updateWaitingRoomQueue: typeof updateWaitingRoomQueue;
    notifyProviderPatientReady: typeof notifyProviderPatientReady;
    admitPatientToSession: typeof admitPatientToSession;
    obtainTelehealthConsent: typeof obtainTelehealthConsent;
    startSessionRecording: typeof startSessionRecording;
    stopSessionRecording: typeof stopSessionRecording;
    grantRecordingAccess: typeof grantRecordingAccess;
    deleteRecording: typeof deleteRecording;
    enableScreenSharing: typeof enableScreenSharing;
    disableScreenSharing: typeof disableScreenSharing;
    sendEncryptedChatMessage: typeof sendEncryptedChatMessage;
    getChatHistory: typeof getChatHistory;
    flagChatMessage: typeof flagChatMessage;
    submitEVisit: typeof submitEVisit;
    respondToEVisit: typeof respondToEVisit;
    recordRPMData: typeof recordRPMData;
    reviewRPMData: typeof reviewRPMData;
    generateRPMAlert: typeof generateRPMAlert;
    generateTelehealthBillingCode: typeof generateTelehealthBillingCode;
    validateTelehealthCoverage: typeof validateTelehealthCoverage;
    requestInterpreterServices: typeof requestInterpreterServices;
    assignInterpreter: typeof assignInterpreter;
    rateInterpreterService: typeof rateInterpreterService;
    performBandwidthCheck: typeof performBandwidthCheck;
    monitorSessionBandwidth: typeof monitorSessionBandwidth;
    generateTelehealthAnalytics: typeof generateTelehealthAnalytics;
    collectPatientSatisfaction: typeof collectPatientSatisfaction;
    generateVisitSummary: typeof generateVisitSummary;
};
export default _default;
//# sourceMappingURL=health-telehealth-kit.d.ts.map