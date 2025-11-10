/**
 * LOC: HEALTH_PATIENT_PORTAL_001
 * File: /reuse/server/health/health-patient-portal-kit.ts
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
 *   - Patient portal services
 *   - Patient authentication controllers
 *   - Medical records services
 *   - Appointment management
 *   - Secure messaging services
 *   - Healthcare compliance services
 */
import { z } from 'zod';
/**
 * Patient authentication status
 */
export declare enum AuthStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    LOCKED = "locked",
    PENDING_VERIFICATION = "pending_verification",
    PENDING_MFA = "pending_mfa",
    PASSWORD_RESET_REQUIRED = "password_reset_required"
}
/**
 * MFA method enumeration
 */
export declare enum MFAMethod {
    SMS = "sms",
    EMAIL = "email",
    AUTHENTICATOR_APP = "authenticator_app",
    SECURITY_QUESTIONS = "security_questions",
    BIOMETRIC = "biometric"
}
/**
 * Medical record type
 */
export declare enum MedicalRecordType {
    ENCOUNTER = "encounter",
    LAB_RESULT = "lab_result",
    IMAGING = "imaging",
    PROCEDURE = "procedure",
    PRESCRIPTION = "prescription",
    IMMUNIZATION = "immunization",
    VITAL_SIGNS = "vital_signs",
    ALLERGY = "allergy",
    PROBLEM_LIST = "problem_list",
    CLINICAL_NOTE = "clinical_note"
}
/**
 * Test result status
 */
export declare enum TestResultStatus {
    PENDING = "pending",
    PRELIMINARY = "preliminary",
    FINAL = "final",
    CORRECTED = "corrected",
    AMENDED = "amended",
    CANCELLED = "cancelled"
}
/**
 * Appointment status
 */
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    ARRIVED = "arrived",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled"
}
/**
 * Message status
 */
export declare enum MessageStatus {
    DRAFT = "draft",
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    REPLIED = "replied",
    ARCHIVED = "archived",
    DELETED = "deleted"
}
/**
 * Message priority
 */
export declare enum MessagePriority {
    ROUTINE = "routine",
    URGENT = "urgent",
    EMERGENCY = "emergency"
}
/**
 * Bill payment status
 */
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    DISPUTED = "disputed"
}
/**
 * Form status
 */
export declare enum FormStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    SUBMITTED = "submitted",
    REVIEWED = "reviewed",
    EXPIRED = "expired"
}
/**
 * Prescription status
 */
export declare enum PrescriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    CANCELLED = "cancelled",
    COMPLETED = "completed",
    REFILL_REQUESTED = "refill_requested",
    REFILL_APPROVED = "refill_approved",
    REFILL_DENIED = "refill_denied"
}
/**
 * Proxy relationship type
 */
export declare enum ProxyRelationship {
    PARENT = "parent",
    GUARDIAN = "guardian",
    CAREGIVER = "caregiver",
    SPOUSE = "spouse",
    POWER_OF_ATTORNEY = "power_of_attorney",
    HEALTHCARE_PROXY = "healthcare_proxy"
}
/**
 * Health data source
 */
export declare enum HealthDataSource {
    PATIENT_ENTERED = "patient_entered",
    WEARABLE_DEVICE = "wearable_device",
    HOME_MONITOR = "home_monitor",
    MOBILE_APP = "mobile_app",
    PATIENT_PORTAL = "patient_portal",
    TELEHEALTH = "telehealth"
}
/**
 * Patient user interface
 */
export interface PatientUser {
    id: string;
    email: string;
    phoneNumber?: string;
    authStatus: AuthStatus;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender?: string;
    mrn: string;
    passwordHash: string;
    mfaEnabled: boolean;
    mfaMethod?: MFAMethod;
    mfaSecretKey?: string;
    failedLoginAttempts: number;
    lockedUntil?: Date;
    lastLoginAt?: Date;
    lastPasswordChangeAt?: Date;
    passwordExpiresAt?: Date;
    preferredLanguage?: string;
    timezone?: string;
    notificationPreferences?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    termsAcceptedAt?: Date;
    privacyPolicyAcceptedAt?: Date;
    hipaaConsentAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Medical record interface
 */
export interface MedicalRecord {
    id: string;
    patientId: string;
    recordType: MedicalRecordType;
    encryptedData: string;
    iv: string;
    authTag?: string;
    recordDate: Date;
    providerId?: string;
    facilityId?: string;
    departmentId?: string;
    visibleToPatient: boolean;
    requiresProviderRelease: boolean;
    releasedAt?: Date;
    releasedBy?: string;
    documentTitle?: string;
    documentType?: string;
    attachmentUrls?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Test result interface
 */
export interface TestResult {
    id: string;
    patientId: string;
    orderId?: string;
    testName: string;
    testCode: string;
    category: string;
    status: TestResultStatus;
    encryptedResults: string;
    iv: string;
    authTag?: string;
    resultValue?: string;
    resultUnit?: string;
    referenceRange?: string;
    abnormalFlag?: 'high' | 'low' | 'critical' | 'normal';
    providerComments?: string;
    interpretation?: string;
    orderDate: Date;
    collectionDate?: Date;
    resultDate?: Date;
    reviewedDate?: Date;
    orderingProviderId: string;
    performingLabId?: string;
    patientNotified: boolean;
    notifiedAt?: Date;
    viewedByPatient: boolean;
    viewedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Medication interface
 */
export interface Medication {
    id: string;
    patientId: string;
    prescriptionId?: string;
    medicationName: string;
    genericName?: string;
    brandName?: string;
    ndc?: string;
    rxnorm?: string;
    strength?: string;
    dosageForm?: string;
    dosageInstructions: string;
    route?: string;
    prescriberId: string;
    prescribedDate: Date;
    status: PrescriptionStatus;
    startDate?: Date;
    endDate?: Date;
    discontinuedDate?: Date;
    discontinuedReason?: string;
    pharmacyId?: string;
    refillsRemaining?: number;
    lastRefillDate?: Date;
    nextRefillDate?: Date;
    interactionWarnings?: string[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Appointment interface
 */
export interface Appointment {
    id: string;
    patientId: string;
    providerId: string;
    appointmentType: string;
    status: AppointmentStatus;
    scheduledDateTime: Date;
    duration: number;
    timezone: string;
    facilityId?: string;
    departmentId?: string;
    roomNumber?: string;
    isVirtual: boolean;
    virtualMeetingUrl?: string;
    reasonForVisit?: string;
    chiefComplaint?: string;
    appointmentNotes?: string;
    confirmationSentAt?: Date;
    confirmedAt?: Date;
    reminderSentAt?: Date;
    checkedInAt?: Date;
    arrivedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    cancelledBy?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Secure message interface
 */
export interface SecureMessage {
    id: string;
    threadId?: string;
    patientId: string;
    providerId?: string;
    subject: string;
    encryptedBody: string;
    iv: string;
    authTag?: string;
    senderId: string;
    senderType: 'patient' | 'provider' | 'staff';
    recipientId: string;
    recipientType: 'patient' | 'provider' | 'staff';
    status: MessageStatus;
    priority: MessagePriority;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    repliedAt?: Date;
    attachmentIds?: string[];
    hasAttachments: boolean;
    inReplyToId?: string;
    expiresAt?: Date;
    autoDeleteAfterDays?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    deletedAt?: Date;
}
/**
 * Bill/statement interface
 */
export interface Bill {
    id: string;
    patientId: string;
    billNumber: string;
    statementDate: Date;
    dueDate: Date;
    totalAmount: number;
    amountPaid: number;
    amountDue: number;
    services: Array<{
        serviceDate: Date;
        description: string;
        cptCode?: string;
        providerName?: string;
        chargeAmount: number;
        insurancePayment?: number;
        patientResponsibility: number;
    }>;
    insuranceClaims?: Array<{
        claimNumber: string;
        insuranceName: string;
        amountBilled: number;
        amountPaid: number;
        adjustments: number;
    }>;
    paymentStatus: 'unpaid' | 'partial' | 'paid' | 'overdue';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Payment transaction interface
 */
export interface PaymentTransaction {
    id: string;
    billId: string;
    patientId: string;
    amount: number;
    paymentMethod: 'credit_card' | 'debit_card' | 'bank_account' | 'payment_plan';
    status: PaymentStatus;
    cardToken?: string;
    cardLast4?: string;
    cardType?: string;
    transactionId?: string;
    authorizationCode?: string;
    processedAt?: Date;
    failureReason?: string;
    retryCount?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Patient form interface
 */
export interface PatientForm {
    id: string;
    patientId: string;
    formTemplateId: string;
    formType: 'intake' | 'consent' | 'medical_history' | 'symptom_check' | 'survey';
    formTitle: string;
    status: FormStatus;
    encryptedFormData: string;
    iv: string;
    authTag?: string;
    startedAt?: Date;
    completedAt?: Date;
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    requiresSignature: boolean;
    electronicSignature?: string;
    signedAt?: Date;
    ipAddress?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Prescription refill request interface
 */
export interface RefillRequest {
    id: string;
    patientId: string;
    medicationId: string;
    prescriptionId: string;
    requestedAt: Date;
    status: 'pending' | 'approved' | 'denied' | 'completed';
    pharmacyId?: string;
    pharmacyName?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
    reviewNotes?: string;
    approvedAt?: Date;
    denialReason?: string;
    sentToPharmacyAt?: Date;
    readyForPickupAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Educational content interface
 */
export interface EducationalContent {
    id: string;
    title: string;
    category: string;
    contentType: 'article' | 'video' | 'infographic' | 'interactive';
    summary: string;
    content?: string;
    mediaUrl?: string;
    externalUrl?: string;
    conditions?: string[];
    medications?: string[];
    procedures?: string[];
    languages?: string[];
    readingLevel?: 'elementary' | 'middle_school' | 'high_school' | 'college';
    author?: string;
    reviewedBy?: string;
    publishedDate?: Date;
    lastReviewedDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Visit summary (AVS) interface
 */
export interface VisitSummary {
    id: string;
    patientId: string;
    encounterId: string;
    visitDate: Date;
    visitType: string;
    providerId: string;
    facilityId?: string;
    encryptedSummary: string;
    iv: string;
    authTag?: string;
    diagnoses?: Array<{
        icd10Code: string;
        description: string;
        isPrimary: boolean;
    }>;
    medications?: Array<{
        name: string;
        instructions: string;
        isNewPrescription: boolean;
    }>;
    followUpInstructions?: string;
    followUpAppointment?: {
        timeframe: string;
        specialtyNeeded?: string;
    };
    careInstructions?: string[];
    dietRestrictions?: string[];
    activityRestrictions?: string[];
    warningSigns?: string[];
    whenToSeekCare?: string;
    educationalMaterialIds?: string[];
    availableToPatient: boolean;
    releasedAt?: Date;
    viewedByPatient: boolean;
    viewedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Patient-generated health data interface
 */
export interface PatientHealthData {
    id: string;
    patientId: string;
    dataType: 'vitals' | 'symptoms' | 'exercise' | 'nutrition' | 'sleep' | 'mood' | 'glucose' | 'weight';
    dataSource: HealthDataSource;
    deviceId?: string;
    deviceModel?: string;
    encryptedData: string;
    iv: string;
    authTag?: string;
    recordedAt: Date;
    uploadedAt: Date;
    numericValue?: number;
    unit?: string;
    flaggedForReview: boolean;
    reviewedAt?: Date;
    reviewedBy?: string;
    reviewNotes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Proxy access relationship interface
 */
export interface ProxyAccess {
    id: string;
    patientId: string;
    proxyUserId: string;
    relationship: ProxyRelationship;
    relationshipVerified: boolean;
    verificationDocumentId?: string;
    permissions: {
        viewMedicalRecords: boolean;
        viewTestResults: boolean;
        viewMedications: boolean;
        scheduleAppointments: boolean;
        sendMessages: boolean;
        viewBills: boolean;
        makePayments: boolean;
        requestPrescriptionRefills: boolean;
        completeForms: boolean;
        uploadHealthData: boolean;
    };
    status: 'active' | 'inactive' | 'pending' | 'revoked';
    activatedAt?: Date;
    expiresAt?: Date;
    revokedAt?: Date;
    revokedBy?: string;
    revokedReason?: string;
    patientDateOfBirth?: Date;
    autoExpiresWhenPatientTurns18?: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Health record download interface
 */
export interface HealthRecordDownload {
    id: string;
    patientId: string;
    requestedBy: string;
    format: 'ccd' | 'ccda' | 'fhir' | 'pdf' | 'csv';
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
    recordTypes?: MedicalRecordType[];
    status: 'requested' | 'processing' | 'ready' | 'expired' | 'failed';
    requestedAt: Date;
    readyAt?: Date;
    expiresAt?: Date;
    encryptedFileUrl?: string;
    fileSize?: number;
    downloadToken?: string;
    downloadCount: number;
    lastDownloadedAt?: Date;
    errorMessage?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
    id: string;
    patientId: string;
    userId: string;
    userType: 'patient' | 'provider' | 'staff' | 'proxy';
    action: string;
    resourceType: string;
    resourceId: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    success: boolean;
    errorMessage?: string;
    phiAccessed: boolean;
    accessReason?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export declare const PatientRegistrationSchema: any;
export declare const SecureMessageSchema: any;
export declare const AppointmentScheduleSchema: any;
export declare const RefillRequestSchema: any;
export declare const ProxyAccessSchema: any;
/**
 * 1. Registers new patient user with secure password hashing.
 *
 * @param {object} registrationData - Patient registration data
 * @returns {Promise<PatientUser>} Created patient user
 *
 * @example
 * ```typescript
 * const patient = await registerPatient({
 *   email: 'john.doe@example.com',
 *   password: 'SecureP@ssw0rd123!',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1990-05-15'),
 *   phoneNumber: '+1-555-123-4567',
 *   mrn: 'MRN-12345678',
 *   preferredLanguage: 'en',
 *   timezone: 'America/New_York'
 * });
 * ```
 */
export declare function registerPatient(registrationData: z.infer<typeof PatientRegistrationSchema>): Promise<PatientUser>;
/**
 * 2. Authenticates patient with email and password using OAuth2/OpenID Connect flow.
 *
 * @param {string} email - Patient email
 * @param {string} password - Patient password
 * @param {string} ipAddress - Request IP address
 * @returns {Promise<{ accessToken: string; refreshToken: string; mfaRequired: boolean }>}
 *
 * @example
 * ```typescript
 * const auth = await authenticatePatient(
 *   'john.doe@example.com',
 *   'SecureP@ssw0rd123!',
 *   req.ip
 * );
 * if (auth.mfaRequired) {
 *   // Redirect to MFA verification
 * } else {
 *   // Login successful
 *   res.cookie('accessToken', auth.accessToken);
 * }
 * ```
 */
export declare function authenticatePatient(email: string, password: string, ipAddress: string): Promise<{
    accessToken: string;
    refreshToken: string;
    mfaRequired: boolean;
    mfaToken?: string;
}>;
/**
 * 3. Enables multi-factor authentication for patient account.
 *
 * @param {string} patientId - Patient user ID
 * @param {MFAMethod} method - MFA method to enable
 * @returns {Promise<{ secret?: string; qrCode?: string; backupCodes: string[] }>}
 *
 * @example
 * ```typescript
 * const mfa = await enableMFA('patient-123', MFAMethod.AUTHENTICATOR_APP);
 * // Display QR code to patient for scanning with authenticator app
 * console.log('Secret:', mfa.secret);
 * console.log('Backup codes:', mfa.backupCodes);
 * ```
 */
export declare function enableMFA(patientId: string, method: MFAMethod): Promise<{
    secret?: string;
    qrCode?: string;
    backupCodes: string[];
}>;
/**
 * 4. Verifies MFA code during login.
 *
 * @param {string} mfaToken - MFA challenge token
 * @param {string} code - MFA code from user
 * @returns {Promise<{ accessToken: string; refreshToken: string }>}
 *
 * @example
 * ```typescript
 * const tokens = await verifyMFACode(mfaToken, '123456');
 * res.cookie('accessToken', tokens.accessToken);
 * ```
 */
export declare function verifyMFACode(mfaToken: string, code: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
/**
 * 5. Initiates password reset flow with email verification.
 *
 * @param {string} email - Patient email
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await initiatePasswordReset('john.doe@example.com');
 * // Password reset email sent
 * ```
 */
export declare function initiatePasswordReset(email: string): Promise<void>;
/**
 * 6. Retrieves encrypted medical records for patient with access control.
 *
 * @param {string} patientId - Patient user ID
 * @param {string} accessorId - User ID accessing records
 * @param {object} filters - Optional filters
 * @returns {Promise<MedicalRecord[]>} Filtered medical records
 *
 * @example
 * ```typescript
 * const records = await getMedicalRecords('patient-123', 'patient-123', {
 *   recordType: MedicalRecordType.ENCOUNTER,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare function getMedicalRecords(patientId: string, accessorId: string, filters?: {
    recordType?: MedicalRecordType;
    startDate?: Date;
    endDate?: Date;
    providerId?: string;
}): Promise<MedicalRecord[]>;
/**
 * 7. Retrieves and decrypts specific medical record details.
 *
 * @param {string} recordId - Medical record ID
 * @param {string} patientId - Patient user ID
 * @param {string} accessorId - User ID accessing record
 * @returns {Promise<{ record: MedicalRecord; decryptedData: any }>}
 *
 * @example
 * ```typescript
 * const { record, decryptedData } = await getMedicalRecordDetails(
 *   'record-456',
 *   'patient-123',
 *   'patient-123'
 * );
 * console.log(decryptedData);
 * ```
 */
export declare function getMedicalRecordDetails(recordId: string, patientId: string, accessorId: string): Promise<{
    record: MedicalRecord;
    decryptedData: any;
}>;
/**
 * 8. Searches medical records by keyword or diagnosis code.
 *
 * @param {string} patientId - Patient user ID
 * @param {string} searchTerm - Search term
 * @returns {Promise<MedicalRecord[]>} Matching records
 *
 * @example
 * ```typescript
 * const results = await searchMedicalRecords('patient-123', 'diabetes');
 * ```
 */
export declare function searchMedicalRecords(patientId: string, searchTerm: string): Promise<MedicalRecord[]>;
/**
 * 9. Generates timeline view of patient's medical history.
 *
 * @param {string} patientId - Patient user ID
 * @param {Date} startDate - Timeline start date
 * @param {Date} endDate - Timeline end date
 * @returns {Promise<Array<{ date: Date; events: any[] }>>}
 *
 * @example
 * ```typescript
 * const timeline = await getMedicalTimeline(
 *   'patient-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getMedicalTimeline(patientId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    events: any[];
}>>;
/**
 * 10. Shares medical record with external provider (with consent).
 *
 * @param {string} recordId - Medical record ID
 * @param {string} patientId - Patient user ID
 * @param {string} externalProviderId - External provider ID
 * @param {Date} expiresAt - Share expiration date
 * @returns {Promise<{ shareToken: string; shareUrl: string }>}
 *
 * @example
 * ```typescript
 * const share = await shareMedicalRecord(
 *   'record-456',
 *   'patient-123',
 *   'external-provider-789',
 *   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
 * );
 * // Send shareUrl to external provider
 * ```
 */
export declare function shareMedicalRecord(recordId: string, patientId: string, externalProviderId: string, expiresAt: Date): Promise<{
    shareToken: string;
    shareUrl: string;
}>;
/**
 * 11. Retrieves test results with provider annotations.
 *
 * @param {string} patientId - Patient user ID
 * @param {object} filters - Result filters
 * @returns {Promise<TestResult[]>} Test results
 *
 * @example
 * ```typescript
 * const results = await getTestResults('patient-123', {
 *   status: TestResultStatus.FINAL,
 *   category: 'Laboratory',
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function getTestResults(patientId: string, filters?: {
    status?: TestResultStatus;
    category?: string;
    startDate?: Date;
    endDate?: Date;
}): Promise<TestResult[]>;
/**
 * 12. Marks test result as viewed by patient.
 *
 * @param {string} resultId - Test result ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markTestResultViewed('result-789', 'patient-123');
 * ```
 */
export declare function markTestResultViewed(resultId: string, patientId: string): Promise<void>;
/**
 * 13. Generates test result trend analysis for patient.
 *
 * @param {string} patientId - Patient user ID
 * @param {string} testCode - Test code to analyze
 * @param {number} months - Number of months to analyze
 * @returns {Promise<{ values: Array<{ date: Date; value: number; unit: string }>; trend: string }>}
 *
 * @example
 * ```typescript
 * const trend = await getTestResultTrend('patient-123', 'HbA1c', 12);
 * console.log('Trend:', trend.trend); // 'improving', 'stable', 'worsening'
 * ```
 */
export declare function getTestResultTrend(patientId: string, testCode: string, months?: number): Promise<{
    values: Array<{
        date: Date;
        value: number;
        unit: string;
    }>;
    trend: string;
}>;
/**
 * 14. Requests provider explanation for abnormal test result.
 *
 * @param {string} resultId - Test result ID
 * @param {string} patientId - Patient user ID
 * @param {string} question - Patient's question
 * @returns {Promise<{ requestId: string }>}
 *
 * @example
 * ```typescript
 * const request = await requestResultExplanation(
 *   'result-789',
 *   'patient-123',
 *   'What does this high value mean for my health?'
 * );
 * ```
 */
export declare function requestResultExplanation(resultId: string, patientId: string, question: string): Promise<{
    requestId: string;
}>;
/**
 * 15. Downloads test results as PDF for patient records.
 *
 * @param {string[]} resultIds - Test result IDs to download
 * @param {string} patientId - Patient user ID
 * @returns {Promise<{ downloadUrl: string; expiresAt: Date }>}
 *
 * @example
 * ```typescript
 * const download = await downloadTestResults(['result-1', 'result-2'], 'patient-123');
 * // Use downloadUrl to fetch PDF
 * ```
 */
export declare function downloadTestResults(resultIds: string[], patientId: string): Promise<{
    downloadUrl: string;
    expiresAt: Date;
}>;
/**
 * 16. Retrieves patient's current medication list.
 *
 * @param {string} patientId - Patient user ID
 * @param {boolean} activeOnly - Return only active medications
 * @returns {Promise<Medication[]>} Medication list
 *
 * @example
 * ```typescript
 * const medications = await getMedicationList('patient-123', true);
 * ```
 */
export declare function getMedicationList(patientId: string, activeOnly?: boolean): Promise<Medication[]>;
/**
 * 17. Checks for drug-drug interactions in medication list.
 *
 * @param {string} patientId - Patient user ID
 * @returns {Promise<Array<{ medications: string[]; severity: string; description: string }>>}
 *
 * @example
 * ```typescript
 * const interactions = await checkDrugInteractions('patient-123');
 * if (interactions.length > 0) {
 *   console.log('WARNING: Drug interactions detected');
 * }
 * ```
 */
export declare function checkDrugInteractions(patientId: string): Promise<Array<{
    medications: string[];
    severity: string;
    description: string;
}>>;
/**
 * 18. Sets medication reminder preferences.
 *
 * @param {string} medicationId - Medication ID
 * @param {string} patientId - Patient user ID
 * @param {object} reminderSettings - Reminder configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setMedicationReminder('med-123', 'patient-456', {
 *   enabled: true,
 *   times: ['08:00', '20:00'],
 *   method: 'sms',
 *   timezone: 'America/New_York'
 * });
 * ```
 */
export declare function setMedicationReminder(medicationId: string, patientId: string, reminderSettings: {
    enabled: boolean;
    times: string[];
    method: 'email' | 'sms' | 'push';
    timezone: string;
}): Promise<void>;
/**
 * 19. Records medication adherence (taken/missed).
 *
 * @param {string} medicationId - Medication ID
 * @param {string} patientId - Patient user ID
 * @param {boolean} taken - Whether medication was taken
 * @param {Date} scheduledTime - Scheduled time
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordMedicationAdherence('med-123', 'patient-456', true, new Date());
 * ```
 */
export declare function recordMedicationAdherence(medicationId: string, patientId: string, taken: boolean, scheduledTime: Date): Promise<void>;
/**
 * 20. Prints medication list as PDF.
 *
 * @param {string} patientId - Patient user ID
 * @returns {Promise<{ downloadUrl: string }>}
 *
 * @example
 * ```typescript
 * const pdf = await printMedicationList('patient-123');
 * ```
 */
export declare function printMedicationList(patientId: string): Promise<{
    downloadUrl: string;
}>;
/**
 * 21. Searches for available appointment slots.
 *
 * @param {string} providerId - Provider user ID
 * @param {Date} startDate - Search start date
 * @param {Date} endDate - Search end date
 * @param {string} appointmentType - Type of appointment
 * @returns {Promise<Array<{ dateTime: Date; available: boolean; duration: number }>>}
 *
 * @example
 * ```typescript
 * const slots = await searchAvailableSlots(
 *   'provider-456',
 *   new Date('2025-02-01'),
 *   new Date('2025-02-28'),
 *   'Primary Care'
 * );
 * ```
 */
export declare function searchAvailableSlots(providerId: string, startDate: Date, endDate: Date, appointmentType: string): Promise<Array<{
    dateTime: Date;
    available: boolean;
    duration: number;
}>>;
/**
 * 22. Schedules a new appointment for patient.
 *
 * @param {object} appointmentData - Appointment details
 * @returns {Promise<Appointment>} Created appointment
 *
 * @example
 * ```typescript
 * const appointment = await scheduleAppointment({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   appointmentType: 'Follow-up',
 *   scheduledDateTime: new Date('2025-02-15T10:00:00Z'),
 *   duration: 30,
 *   timezone: 'America/New_York',
 *   reasonForVisit: 'Annual physical',
 *   isVirtual: false
 * });
 * ```
 */
export declare function scheduleAppointment(appointmentData: z.infer<typeof AppointmentScheduleSchema>): Promise<Appointment>;
/**
 * 23. Reschedules an existing appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} patientId - Patient user ID
 * @param {Date} newDateTime - New appointment date/time
 * @returns {Promise<Appointment>} Updated appointment
 *
 * @example
 * ```typescript
 * const rescheduled = await rescheduleAppointment(
 *   'apt-789',
 *   'patient-123',
 *   new Date('2025-02-20T14:00:00Z')
 * );
 * ```
 */
export declare function rescheduleAppointment(appointmentId: string, patientId: string, newDateTime: Date): Promise<Appointment>;
/**
 * 24. Cancels an appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} patientId - Patient user ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelAppointment('apt-789', 'patient-123', 'Schedule conflict');
 * ```
 */
export declare function cancelAppointment(appointmentId: string, patientId: string, reason: string): Promise<void>;
/**
 * 25. Confirms appointment attendance.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await confirmAppointment('apt-789', 'patient-123');
 * ```
 */
export declare function confirmAppointment(appointmentId: string, patientId: string): Promise<void>;
/**
 * 26. Sends encrypted secure message to provider.
 *
 * @param {object} messageData - Message details
 * @returns {Promise<SecureMessage>} Created message
 *
 * @example
 * ```typescript
 * const message = await sendSecureMessage({
 *   patientId: 'patient-123',
 *   providerId: 'provider-456',
 *   recipientId: 'provider-456',
 *   subject: 'Question about medication',
 *   body: 'I have a question about my new prescription...',
 *   priority: MessagePriority.ROUTINE
 * });
 * ```
 */
export declare function sendSecureMessage(messageData: z.infer<typeof SecureMessageSchema>): Promise<SecureMessage>;
/**
 * 27. Retrieves patient's message inbox.
 *
 * @param {string} patientId - Patient user ID
 * @param {object} filters - Message filters
 * @returns {Promise<SecureMessage[]>} Messages
 *
 * @example
 * ```typescript
 * const messages = await getMessageInbox('patient-123', {
 *   status: MessageStatus.SENT,
 *   unreadOnly: true
 * });
 * ```
 */
export declare function getMessageInbox(patientId: string, filters?: {
    status?: MessageStatus;
    priority?: MessagePriority;
    unreadOnly?: boolean;
}): Promise<SecureMessage[]>;
/**
 * 28. Marks message as read.
 *
 * @param {string} messageId - Message ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markMessageRead('msg-789', 'patient-123');
 * ```
 */
export declare function markMessageRead(messageId: string, patientId: string): Promise<void>;
/**
 * 29. Archives message thread.
 *
 * @param {string} threadId - Thread ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveMessageThread('thread-456', 'patient-123');
 * ```
 */
export declare function archiveMessageThread(threadId: string, patientId: string): Promise<void>;
/**
 * 30. Deletes message (marks as deleted, doesn't actually delete for compliance).
 *
 * @param {string} messageId - Message ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteMessage('msg-789', 'patient-123');
 * ```
 */
export declare function deleteMessage(messageId: string, patientId: string): Promise<void>;
/**
 * 31. Retrieves patient's billing statements.
 *
 * @param {string} patientId - Patient user ID
 * @param {object} filters - Statement filters
 * @returns {Promise<Bill[]>} Billing statements
 *
 * @example
 * ```typescript
 * const bills = await getBillingStatements('patient-123', {
 *   paymentStatus: 'unpaid',
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function getBillingStatements(patientId: string, filters?: {
    paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'overdue';
    startDate?: Date;
    endDate?: Date;
}): Promise<Bill[]>;
/**
 * 32. Processes payment for bill with PCI-DSS compliance.
 *
 * @param {string} billId - Bill ID
 * @param {string} patientId - Patient user ID
 * @param {number} amount - Payment amount
 * @param {object} paymentMethod - Tokenized payment method
 * @returns {Promise<PaymentTransaction>} Payment transaction
 *
 * @example
 * ```typescript
 * const payment = await processPayment('bill-456', 'patient-123', 150.00, {
 *   cardToken: 'tok_abc123',
 *   cardLast4: '4242',
 *   cardType: 'visa'
 * });
 * ```
 */
export declare function processPayment(billId: string, patientId: string, amount: number, paymentMethod: {
    cardToken: string;
    cardLast4: string;
    cardType: string;
}): Promise<PaymentTransaction>;
/**
 * 33. Sets up payment plan for bill.
 *
 * @param {string} billId - Bill ID
 * @param {string} patientId - Patient user ID
 * @param {object} planDetails - Payment plan details
 * @returns {Promise<{ planId: string; schedule: Array<{ date: Date; amount: number }> }>}
 *
 * @example
 * ```typescript
 * const plan = await setupPaymentPlan('bill-456', 'patient-123', {
 *   numberOfPayments: 6,
 *   frequency: 'monthly',
 *   firstPaymentDate: new Date('2025-02-01')
 * });
 * ```
 */
export declare function setupPaymentPlan(billId: string, patientId: string, planDetails: {
    numberOfPayments: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    firstPaymentDate: Date;
}): Promise<{
    planId: string;
    schedule: Array<{
        date: Date;
        amount: number;
    }>;
}>;
/**
 * 34. Downloads billing statement as PDF.
 *
 * @param {string} billId - Bill ID
 * @param {string} patientId - Patient user ID
 * @returns {Promise<{ downloadUrl: string }>}
 *
 * @example
 * ```typescript
 * const pdf = await downloadBillingStatement('bill-456', 'patient-123');
 * ```
 */
export declare function downloadBillingStatement(billId: string, patientId: string): Promise<{
    downloadUrl: string;
}>;
/**
 * 35. Disputes a billing charge.
 *
 * @param {string} billId - Bill ID
 * @param {string} patientId - Patient user ID
 * @param {object} disputeDetails - Dispute information
 * @returns {Promise<{ disputeId: string }>}
 *
 * @example
 * ```typescript
 * const dispute = await disputeBillingCharge('bill-456', 'patient-123', {
 *   reason: 'Service not received',
 *   details: 'I was charged for a visit I did not attend',
 *   supportingDocuments: ['doc-1', 'doc-2']
 * });
 * ```
 */
export declare function disputeBillingCharge(billId: string, patientId: string, disputeDetails: {
    reason: string;
    details: string;
    supportingDocuments?: string[];
}): Promise<{
    disputeId: string;
}>;
/**
 * 36. Requests health record download in CCD/FHIR format.
 *
 * @param {string} patientId - Patient user ID
 * @param {object} downloadOptions - Download preferences
 * @returns {Promise<HealthRecordDownload>} Download request
 *
 * @example
 * ```typescript
 * const download = await requestHealthRecordDownload('patient-123', {
 *   format: 'ccd',
 *   dateRangeStart: new Date('2020-01-01'),
 *   dateRangeEnd: new Date('2024-12-31'),
 *   recordTypes: [MedicalRecordType.ENCOUNTER, MedicalRecordType.LAB_RESULT]
 * });
 * ```
 */
export declare function requestHealthRecordDownload(patientId: string, downloadOptions: {
    format: 'ccd' | 'ccda' | 'fhir' | 'pdf' | 'csv';
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
    recordTypes?: MedicalRecordType[];
}): Promise<HealthRecordDownload>;
/**
 * 37. Grants proxy access to patient's records.
 *
 * @param {object} proxyData - Proxy access details
 * @returns {Promise<ProxyAccess>} Created proxy access
 *
 * @example
 * ```typescript
 * const proxy = await grantProxyAccess({
 *   patientId: 'patient-123',
 *   proxyUserId: 'parent-456',
 *   relationship: ProxyRelationship.PARENT,
 *   permissions: {
 *     viewMedicalRecords: true,
 *     viewTestResults: true,
 *     viewMedications: true,
 *     scheduleAppointments: true,
 *     sendMessages: true,
 *     viewBills: false,
 *     makePayments: false,
 *     requestPrescriptionRefills: false,
 *     completeForms: true,
 *     uploadHealthData: false
 *   }
 * });
 * ```
 */
export declare function grantProxyAccess(proxyData: z.infer<typeof ProxyAccessSchema>): Promise<ProxyAccess>;
/**
 * 38. Revokes proxy access.
 *
 * @param {string} proxyAccessId - Proxy access ID
 * @param {string} patientId - Patient user ID
 * @param {string} reason - Revocation reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeProxyAccess('proxy-789', 'patient-123', 'No longer needed');
 * ```
 */
export declare function revokeProxyAccess(proxyAccessId: string, patientId: string, reason: string): Promise<void>;
/**
 * 39. Verifies proxy access permissions for action.
 *
 * @param {string} proxyAccessId - Proxy access ID
 * @param {string} requiredPermission - Permission to check
 * @returns {Promise<boolean>} True if permitted
 *
 * @example
 * ```typescript
 * const canSchedule = await verifyProxyPermission('proxy-789', 'scheduleAppointments');
 * if (!canSchedule) {
 *   throw new ForbiddenException('No permission to schedule appointments');
 * }
 * ```
 */
export declare function verifyProxyPermission(proxyAccessId: string, requiredPermission: keyof ProxyAccess['permissions']): Promise<boolean>;
/**
 * 40. Lists all proxy relationships for patient.
 *
 * @param {string} patientId - Patient user ID
 * @returns {Promise<ProxyAccess[]>} Proxy access records
 *
 * @example
 * ```typescript
 * const proxies = await listProxyAccess('patient-123');
 * ```
 */
export declare function listProxyAccess(patientId: string): Promise<ProxyAccess[]>;
/**
 * 41. Submits completed patient form with electronic signature.
 *
 * @param {string} formId - Form ID
 * @param {string} patientId - Patient user ID
 * @param {object} formData - Completed form data
 * @param {string} electronicSignature - Patient signature
 * @returns {Promise<PatientForm>} Submitted form
 *
 * @example
 * ```typescript
 * const form = await submitPatientForm('form-123', 'patient-456', {
 *   medicalHistory: { ... },
 *   currentSymptoms: { ... }
 * }, 'John Doe');
 * ```
 */
export declare function submitPatientForm(formId: string, patientId: string, formData: Record<string, any>, electronicSignature: string): Promise<PatientForm>;
/**
 * 42. Requests prescription refill.
 *
 * @param {object} refillData - Refill request details
 * @returns {Promise<RefillRequest>} Created refill request
 *
 * @example
 * ```typescript
 * const refill = await requestPrescriptionRefill({
 *   patientId: 'patient-123',
 *   medicationId: 'med-456',
 *   prescriptionId: 'rx-789',
 *   pharmacyId: 'pharmacy-001'
 * });
 * ```
 */
export declare function requestPrescriptionRefill(refillData: z.infer<typeof RefillRequestSchema>): Promise<RefillRequest>;
/**
 * 43. Uploads patient-generated health data from wearables/devices.
 *
 * @param {string} patientId - Patient user ID
 * @param {object} healthData - Health data to upload
 * @returns {Promise<PatientHealthData>} Created health data record
 *
 * @example
 * ```typescript
 * const data = await uploadPatientHealthData('patient-123', {
 *   dataType: 'vitals',
 *   dataSource: HealthDataSource.WEARABLE_DEVICE,
 *   deviceId: 'fitbit-001',
 *   data: {
 *     heartRate: 72,
 *     steps: 8543,
 *     sleepHours: 7.5
 *   },
 *   recordedAt: new Date()
 * });
 * ```
 */
export declare function uploadPatientHealthData(patientId: string, healthData: {
    dataType: string;
    dataSource: HealthDataSource;
    deviceId?: string;
    data: Record<string, any>;
    recordedAt: Date;
}): Promise<PatientHealthData>;
declare const _default: {
    registerPatient: typeof registerPatient;
    authenticatePatient: typeof authenticatePatient;
    enableMFA: typeof enableMFA;
    verifyMFACode: typeof verifyMFACode;
    initiatePasswordReset: typeof initiatePasswordReset;
    getMedicalRecords: typeof getMedicalRecords;
    getMedicalRecordDetails: typeof getMedicalRecordDetails;
    searchMedicalRecords: typeof searchMedicalRecords;
    getMedicalTimeline: typeof getMedicalTimeline;
    shareMedicalRecord: typeof shareMedicalRecord;
    getTestResults: typeof getTestResults;
    markTestResultViewed: typeof markTestResultViewed;
    getTestResultTrend: typeof getTestResultTrend;
    requestResultExplanation: typeof requestResultExplanation;
    downloadTestResults: typeof downloadTestResults;
    getMedicationList: typeof getMedicationList;
    checkDrugInteractions: typeof checkDrugInteractions;
    setMedicationReminder: typeof setMedicationReminder;
    recordMedicationAdherence: typeof recordMedicationAdherence;
    printMedicationList: typeof printMedicationList;
    searchAvailableSlots: typeof searchAvailableSlots;
    scheduleAppointment: typeof scheduleAppointment;
    rescheduleAppointment: typeof rescheduleAppointment;
    cancelAppointment: typeof cancelAppointment;
    confirmAppointment: typeof confirmAppointment;
    sendSecureMessage: typeof sendSecureMessage;
    getMessageInbox: typeof getMessageInbox;
    markMessageRead: typeof markMessageRead;
    archiveMessageThread: typeof archiveMessageThread;
    deleteMessage: typeof deleteMessage;
    getBillingStatements: typeof getBillingStatements;
    processPayment: typeof processPayment;
    setupPaymentPlan: typeof setupPaymentPlan;
    downloadBillingStatement: typeof downloadBillingStatement;
    disputeBillingCharge: typeof disputeBillingCharge;
    requestHealthRecordDownload: typeof requestHealthRecordDownload;
    grantProxyAccess: typeof grantProxyAccess;
    revokeProxyAccess: typeof revokeProxyAccess;
    verifyProxyPermission: typeof verifyProxyPermission;
    listProxyAccess: typeof listProxyAccess;
    submitPatientForm: typeof submitPatientForm;
    requestPrescriptionRefill: typeof requestPrescriptionRefill;
    uploadPatientHealthData: typeof uploadPatientHealthData;
};
export default _default;
//# sourceMappingURL=health-patient-portal-kit.d.ts.map