/**
 * LOC: EDUCT9876543
 * File: /reuse/education/transcript-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Student information system modules
 *   - Registrar services
 *   - Academic records systems
 */
/**
 * File: /reuse/education/transcript-management-kit.ts
 * Locator: WC-EDU-TRANS-001
 * Purpose: Enterprise-grade Transcript Management - official/unofficial transcripts, request processing, electronic delivery, verification, encryption
 *
 * Upstream: Independent utility module for transcript operations
 * Downstream: ../backend/education/*, registrar controllers, student services, transcript processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for transcript operations competing with Ellucian Banner/Colleague
 *
 * LLM Context: Comprehensive transcript management utilities for production-ready education SIS applications.
 * Provides official/unofficial transcript generation, request workflow processing, electronic delivery (PDF/XML),
 * transcript holds management, multiple format support (standard, extended, condensed), digital verification,
 * encryption, watermarking, batch processing, transcript auditing, and compliance with FERPA regulations.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Utility type for required fields in transcript generation
 */
type RequiredTranscriptFields<T> = Required<Pick<T, 'studentId' | 'requestedBy' | 'deliveryMethod'>>;
/**
 * Discriminated union for delivery methods
 */
type DeliveryMethod = {
    type: 'electronic';
    email: string;
    encryptionKey?: string;
} | {
    type: 'mail';
    address: string;
    recipientName: string;
} | {
    type: 'pickup';
    location: string;
    requiresId: boolean;
} | {
    type: 'third_party';
    provider: string;
    credentials: Record<string, string>;
};
interface TranscriptData {
    studentId: string;
    studentName: string;
    studentIdNumber: string;
    dateOfBirth: Date;
    programOfStudy: string;
    degreeAwarded?: string;
    dateAwarded?: Date;
    gpa: number;
    totalCredits: number;
    academicStanding: string;
    enrollmentHistory: EnrollmentPeriod[];
    courses: CourseRecord[];
    honorsAndAwards?: HonorAward[];
    transferCredits?: TransferCredit[];
    metadata?: Record<string, any>;
}
interface CourseRecord {
    termId: string;
    termName: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    grade: string;
    gradePoints: number;
    repeatIndicator?: 'original' | 'repeat';
    includeInGPA: boolean;
    level: 'undergraduate' | 'graduate' | 'professional';
    subject: string;
}
interface EnrollmentPeriod {
    termId: string;
    termName: string;
    startDate: Date;
    endDate: Date;
    enrollmentStatus: 'full_time' | 'part_time' | 'leave' | 'withdrawn';
    creditsEnrolled: number;
    termGPA: number;
    termCredits: number;
    academicStanding: string;
}
interface HonorAward {
    awardName: string;
    awardDate: Date;
    description?: string;
    level: 'institutional' | 'national' | 'international';
}
interface TransferCredit {
    institutionName: string;
    institutionCode?: string;
    courseName: string;
    creditsAwarded: number;
    gradeEquivalent?: string;
    dateEvaluated: Date;
    includeInGPA: boolean;
}
type TranscriptType = 'official' | 'unofficial' | 'enrollment_verification';
type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'on_hold' | 'cancelled' | 'delivered';
type HoldType = 'financial' | 'academic' | 'disciplinary' | 'registration' | 'administrative';
type TranscriptLayout = 'standard' | 'extended' | 'condensed' | 'degree_only';
interface BaseTranscriptFormat {
    layout: TranscriptLayout;
    includeGrades: boolean;
    includeGPA: boolean;
    includeWithdrawnCourses: boolean;
}
interface OfficialTranscriptFormat extends BaseTranscriptFormat {
    includeOfficialSeal: boolean;
    includeSignature: boolean;
    includeWatermark: boolean;
    signatureAuthorityName: string;
    signatureAuthorityTitle: string;
    securityFeatures: string[];
}
interface UnofficialTranscriptFormat extends BaseTranscriptFormat {
    includeWatermark: boolean;
    watermarkText: string;
    restrictedUse: boolean;
}
interface TranscriptRequestData {
    studentId: string;
    requestedBy: string;
    transcriptType: TranscriptType;
    deliveryMethod: DeliveryMethod;
    recipientName?: string;
    recipientOrganization?: string;
    purpose?: string;
    numberOfCopies: number;
    rushProcessing: boolean;
    processingFee: number;
    paymentStatus: 'pending' | 'paid' | 'waived';
    consentProvided: boolean;
    metadata?: Record<string, any>;
}
interface TranscriptHold {
    holdType: HoldType;
    holdReason: string;
    placedBy: string;
    placedAt: Date;
    expectedResolution?: Date;
    contactInfo?: string;
    canOverride: boolean;
    overrideAuthorityLevel: string;
    metadata?: Record<string, any>;
}
interface TranscriptVerification {
    transcriptId: string;
    verificationCode: string;
    verificationUrl: string;
    digitalSignature: string;
    hashValue: string;
    algorithm: 'sha256' | 'sha512' | 'rsa';
    issuedAt: Date;
    expiresAt?: Date;
    verifiedBy?: string;
    verifiedAt?: Date;
    verificationStatus: 'valid' | 'invalid' | 'expired' | 'revoked';
}
interface EncryptionOptions {
    algorithm: 'aes-256-cbc' | 'rsa-4096';
    encryptionKey?: string;
    publicKey?: string;
    includeDecryptionInstructions: boolean;
    passwordProtected: boolean;
    password?: string;
}
interface TranscriptDeliveryResult {
    transcriptId: string;
    deliveryMethod: DeliveryMethod;
    deliveredAt: Date;
    trackingNumber?: string;
    confirmationNumber: string;
    recipientConfirmed: boolean;
    deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced';
    attemptCount: number;
    metadata?: Record<string, any>;
}
interface TranscriptAuditEntry {
    transcriptId: string;
    action: 'created' | 'viewed' | 'printed' | 'emailed' | 'modified' | 'verified';
    performedBy: string;
    performedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    changes?: Record<string, any>;
    complianceNote?: string;
}
interface TranscriptStatistics {
    totalRequests: number;
    officialCount: number;
    unofficialCount: number;
    averageProcessingTime: number;
    electronicDeliveryRate: number;
    holdRate: number;
    verificationRate: number;
    topDestinations: Array<{
        organization: string;
        count: number;
    }>;
    peakRequestPeriods: Array<{
        period: string;
        count: number;
    }>;
}
/**
 * Sequelize model for Transcripts with comprehensive academic record tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Transcript:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         transcriptType:
 *           type: string
 *           enum: [official, unofficial, enrollment_verification]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Transcript model
 *
 * @example
 * ```typescript
 * const Transcript = createTranscriptModel(sequelize);
 * const transcript = await Transcript.create({
 *   studentId: 'STU123456',
 *   transcriptType: 'official',
 *   issuedDate: new Date(),
 *   studentName: 'John Doe',
 *   gpa: 3.75,
 *   totalCredits: 120
 * });
 * ```
 */
export declare const createTranscriptModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        studentName: string;
        studentIdNumber: string;
        dateOfBirth: Date;
        transcriptType: TranscriptType;
        issuedDate: Date;
        programOfStudy: string;
        degreeAwarded: string | null;
        dateAwarded: Date | null;
        gpa: number;
        totalCredits: number;
        academicStanding: string;
        layout: TranscriptLayout;
        includeOfficialSeal: boolean;
        includeSignature: boolean;
        includeWatermark: boolean;
        watermarkText: string;
        signatureAuthorityName: string | null;
        signatureAuthorityTitle: string | null;
        verificationCode: string | null;
        digitalSignature: string | null;
        hashValue: string | null;
        encryptionApplied: boolean;
        pdfPath: string | null;
        xmlData: string | null;
        status: string;
        generatedBy: string;
        generatedAt: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Transcript Requests with workflow and approval tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TranscriptRequest model
 *
 * @example
 * ```typescript
 * const TranscriptRequest = createTranscriptRequestModel(sequelize);
 * const request = await TranscriptRequest.create({
 *   studentId: 'STU123456',
 *   requestedBy: 'student',
 *   transcriptType: 'official',
 *   deliveryMethodType: 'electronic',
 *   numberOfCopies: 1,
 *   processingFee: 10.00
 * });
 * ```
 */
export declare const createTranscriptRequestModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        requestedBy: string;
        requestedByRole: string;
        transcriptType: TranscriptType;
        deliveryMethodType: string;
        deliveryMethodData: Record<string, any>;
        recipientName: string | null;
        recipientOrganization: string | null;
        purpose: string | null;
        numberOfCopies: number;
        rushProcessing: boolean;
        processingFee: number;
        paymentStatus: string;
        paymentTransactionId: string | null;
        consentProvided: boolean;
        consentProvidedAt: Date | null;
        status: TranscriptStatus;
        submittedAt: Date;
        processedAt: Date | null;
        completedAt: Date | null;
        deliveredAt: Date | null;
        processedBy: string | null;
        holdType: HoldType | null;
        holdReason: string | null;
        holdPlacedAt: Date | null;
        estimatedCompletionDate: Date | null;
        trackingNumber: string | null;
        confirmationNumber: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Official Transcript tracking with enhanced security.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OfficialTranscript model
 *
 * @example
 * ```typescript
 * const OfficialTranscript = createOfficialTranscriptModel(sequelize);
 * const official = await OfficialTranscript.create({
 *   transcriptId: 'trans-uuid',
 *   requestId: 'req-uuid',
 *   verificationCode: 'VER123456',
 *   securityLevel: 'high'
 * });
 * ```
 */
export declare const createOfficialTranscriptModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        transcriptId: string;
        requestId: string;
        verificationCode: string;
        verificationUrl: string;
        digitalSignature: string;
        hashValue: string;
        hashAlgorithm: string;
        issuedAt: Date;
        expiresAt: Date | null;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        verificationStatus: string;
        verificationAttempts: number;
        lastVerificationAttempt: Date | null;
        securityLevel: string;
        tamperEvident: boolean;
        accessRestricted: boolean;
        accessLog: Record<string, any>[];
        revokedAt: Date | null;
        revokedBy: string | null;
        revocationReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Generate an official transcript with complete security features.
 *
 * @param {TranscriptData} data - Transcript data
 * @param {OfficialTranscriptFormat} format - Transcript format options
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<{ transcript: any; verification: TranscriptVerification }>} Generated transcript and verification
 *
 * @example
 * ```typescript
 * const result = await generateOfficialTranscript(
 *   {
 *     studentId: 'STU123456',
 *     studentName: 'John Doe',
 *     gpa: 3.75,
 *     totalCredits: 120,
 *     // ... other data
 *   },
 *   {
 *     layout: 'standard',
 *     includeOfficialSeal: true,
 *     includeSignature: true,
 *     includeWatermark: true,
 *     signatureAuthorityName: 'Dr. Jane Smith',
 *     signatureAuthorityTitle: 'Registrar'
 *   }
 * );
 * ```
 */
export declare function generateOfficialTranscript<T extends TranscriptData>(data: RequiredTranscriptFields<TranscriptData> & T, format: OfficialTranscriptFormat, transaction?: Transaction): Promise<{
    transcript: any;
    verification: TranscriptVerification;
}>;
/**
 * Generate an unofficial transcript for student viewing.
 *
 * @param {TranscriptData} data - Transcript data
 * @param {UnofficialTranscriptFormat} format - Format options
 * @returns {Promise<any>} Generated unofficial transcript
 *
 * @example
 * ```typescript
 * const transcript = await generateUnofficialTranscript(
 *   studentData,
 *   {
 *     layout: 'standard',
 *     includeWatermark: true,
 *     watermarkText: 'UNOFFICIAL - FOR STUDENT USE ONLY',
 *     restrictedUse: true
 *   }
 * );
 * ```
 */
export declare function generateUnofficialTranscript(data: TranscriptData, format: UnofficialTranscriptFormat): Promise<any>;
/**
 * Generate enrollment verification document.
 *
 * @param {string} studentId - Student identifier
 * @param {string} termId - Term identifier
 * @param {boolean} includeGPA - Include GPA in verification
 * @returns {Promise<any>} Enrollment verification document
 */
export declare function generateEnrollmentVerification(studentId: string, termId: string, includeGPA?: boolean): Promise<any>;
/**
 * Generate transcript in PDF format.
 *
 * @param {any} transcript - Transcript object
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to generated PDF
 */
export declare function generateTranscriptPDF(transcript: any, outputPath: string): Promise<string>;
/**
 * Generate transcript in XML format for electronic exchange.
 *
 * @param {TranscriptData} data - Transcript data
 * @param {string} standard - XML standard ('pesc', 'edexchange', 'custom')
 * @returns {Promise<string>} XML representation
 *
 * @example
 * ```typescript
 * const xml = await generateTranscriptXML(transcriptData, 'pesc');
 * // Returns PESC-compliant XML for transcript exchange
 * ```
 */
export declare function generateTranscriptXML(data: TranscriptData, standard?: 'pesc' | 'edexchange' | 'custom'): Promise<string>;
/**
 * Generate multiple transcripts in batch.
 *
 * @param {string[]} studentIds - Array of student IDs
 * @param {TranscriptType} transcriptType - Type of transcript
 * @param {any} format - Format options
 * @returns {Promise<any[]>} Array of generated transcripts
 */
export declare function batchGenerateTranscripts(studentIds: string[], transcriptType: TranscriptType, format: any): Promise<any[]>;
/**
 * Create a new transcript request with validation.
 *
 * @param {TranscriptRequestData} requestData - Request data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<any>} Created request
 *
 * @example
 * ```typescript
 * const request = await createTranscriptRequest({
 *   studentId: 'STU123456',
 *   requestedBy: 'student',
 *   transcriptType: 'official',
 *   deliveryMethod: { type: 'electronic', email: 'student@example.com' },
 *   numberOfCopies: 1,
 *   rushProcessing: false,
 *   processingFee: 10.00,
 *   paymentStatus: 'pending',
 *   consentProvided: true
 * });
 * ```
 */
export declare function createTranscriptRequest(requestData: TranscriptRequestData, transaction?: Transaction): Promise<any>;
/**
 * Process a transcript request through workflow stages.
 *
 * @param {string} requestId - Request identifier
 * @param {string} processedBy - User processing the request
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<any>} Updated request
 */
export declare function processTranscriptRequest(requestId: string, processedBy: string, transaction?: Transaction): Promise<any>;
/**
 * Approve a transcript request.
 *
 * @param {string} requestId - Request identifier
 * @param {string} approvedBy - User approving the request
 * @returns {Promise<any>} Approved request
 */
export declare function approveTranscriptRequest(requestId: string, approvedBy: string): Promise<any>;
/**
 * Cancel a transcript request.
 *
 * @param {string} requestId - Request identifier
 * @param {string} cancelledBy - User cancelling the request
 * @param {string} reason - Cancellation reason
 * @returns {Promise<any>} Cancelled request
 */
export declare function cancelTranscriptRequest(requestId: string, cancelledBy: string, reason: string): Promise<any>;
/**
 * Get transcript request status and tracking information.
 *
 * @param {string} requestId - Request identifier
 * @returns {Promise<any>} Request status and tracking
 */
export declare function getTranscriptRequestStatus(requestId: string): Promise<any>;
/**
 * Deliver transcript electronically via email.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} email - Recipient email
 * @param {EncryptionOptions} [encryption] - Optional encryption
 * @returns {Promise<TranscriptDeliveryResult>} Delivery result
 *
 * @example
 * ```typescript
 * const result = await deliverTranscriptByEmail(
 *   'trans-uuid',
 *   'recipient@university.edu',
 *   {
 *     algorithm: 'aes-256-cbc',
 *     passwordProtected: true,
 *     includeDecryptionInstructions: true
 *   }
 * );
 * ```
 */
export declare function deliverTranscriptByEmail(transcriptId: string, email: string, encryption?: EncryptionOptions): Promise<TranscriptDeliveryResult>;
/**
 * Deliver transcript to third-party service (e.g., Parchment, Credentials Solutions).
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} provider - Third-party provider name
 * @param {Record<string, string>} credentials - Provider credentials
 * @returns {Promise<TranscriptDeliveryResult>} Delivery result
 */
export declare function deliverTranscriptToThirdParty(transcriptId: string, provider: string, credentials: Record<string, string>): Promise<TranscriptDeliveryResult>;
/**
 * Schedule transcript for physical mail delivery.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} address - Mailing address
 * @param {string} recipientName - Recipient name
 * @returns {Promise<TranscriptDeliveryResult>} Delivery result
 */
export declare function scheduleTranscriptMailing(transcriptId: string, address: string, recipientName: string): Promise<TranscriptDeliveryResult>;
/**
 * Track delivery status of transcript.
 *
 * @param {string} trackingNumber - Tracking number
 * @returns {Promise<any>} Delivery tracking information
 */
export declare function trackTranscriptDelivery(trackingNumber: string): Promise<any>;
/**
 * Check if student has any holds preventing transcript release.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<TranscriptHold[]>} Array of active holds
 *
 * @example
 * ```typescript
 * const holds = await checkTranscriptHolds('STU123456');
 * if (holds.length > 0) {
 *   console.log('Cannot release transcript - holds present:', holds);
 * }
 * ```
 */
export declare function checkTranscriptHolds(studentId: string): Promise<TranscriptHold[]>;
/**
 * Place a hold on student transcript.
 *
 * @param {string} studentId - Student identifier
 * @param {HoldType} holdType - Type of hold
 * @param {string} reason - Hold reason
 * @param {string} placedBy - User placing the hold
 * @returns {Promise<TranscriptHold>} Created hold
 */
export declare function placeTranscriptHold(studentId: string, holdType: HoldType, reason: string, placedBy: string): Promise<TranscriptHold>;
/**
 * Release/remove a transcript hold.
 *
 * @param {string} studentId - Student identifier
 * @param {HoldType} holdType - Type of hold to release
 * @param {string} releasedBy - User releasing the hold
 * @returns {Promise<void>}
 */
export declare function releaseTranscriptHold(studentId: string, holdType: HoldType, releasedBy: string): Promise<void>;
/**
 * Override a transcript hold with proper authorization.
 *
 * @param {string} studentId - Student identifier
 * @param {HoldType} holdType - Type of hold to override
 * @param {string} overriddenBy - User overriding the hold
 * @param {string} justification - Override justification
 * @returns {Promise<void>}
 */
export declare function overrideTranscriptHold(studentId: string, holdType: HoldType, overriddenBy: string, justification: string): Promise<void>;
/**
 * Format transcript in standard layout.
 *
 * @param {TranscriptData} data - Transcript data
 * @returns {Promise<any>} Formatted transcript
 */
export declare function formatStandardTranscript(data: TranscriptData): Promise<any>;
/**
 * Format transcript in extended layout with detailed course descriptions.
 *
 * @param {TranscriptData} data - Transcript data
 * @returns {Promise<any>} Formatted transcript
 */
export declare function formatExtendedTranscript(data: TranscriptData): Promise<any>;
/**
 * Format transcript in condensed layout.
 *
 * @param {TranscriptData} data - Transcript data
 * @returns {Promise<any>} Formatted transcript
 */
export declare function formatCondensedTranscript(data: TranscriptData): Promise<any>;
/**
 * Format degree-only transcript.
 *
 * @param {TranscriptData} data - Transcript data
 * @returns {Promise<any>} Formatted transcript
 */
export declare function formatDegreeOnlyTranscript(data: TranscriptData): Promise<any>;
/**
 * Apply custom formatting template to transcript.
 *
 * @param {TranscriptData} data - Transcript data
 * @param {any} template - Custom template
 * @returns {Promise<any>} Formatted transcript
 */
export declare function applyCustomTranscriptTemplate(data: TranscriptData, template: any): Promise<any>;
/**
 * Convert transcript between different formats.
 *
 * @param {any} transcript - Transcript to convert
 * @param {TranscriptLayout} targetLayout - Target layout
 * @returns {Promise<any>} Converted transcript
 */
export declare function convertTranscriptFormat(transcript: any, targetLayout: TranscriptLayout): Promise<any>;
/**
 * Verify transcript authenticity using verification code.
 *
 * @param {string} verificationCode - Verification code
 * @returns {Promise<TranscriptVerification>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyTranscriptAuthenticity('VER123456');
 * if (verification.verificationStatus === 'valid') {
 *   console.log('Transcript is authentic');
 * }
 * ```
 */
export declare function verifyTranscriptAuthenticity(verificationCode: string): Promise<TranscriptVerification>;
/**
 * Validate transcript digital signature.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} digitalSignature - Digital signature to validate
 * @returns {Promise<boolean>} Validation result
 */
export declare function validateTranscriptSignature(transcriptId: string, digitalSignature: string): Promise<boolean>;
/**
 * Check transcript hash integrity.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} providedHash - Hash to verify
 * @returns {Promise<boolean>} Hash integrity check result
 */
export declare function checkTranscriptIntegrity(transcriptId: string, providedHash: string): Promise<boolean>;
/**
 * Generate QR code for transcript verification.
 *
 * @param {string} verificationCode - Verification code
 * @returns {Promise<string>} QR code data URL
 */
export declare function generateVerificationQRCode(verificationCode: string): Promise<string>;
/**
 * Encrypt transcript with specified encryption options.
 *
 * @param {any} transcript - Transcript to encrypt
 * @param {EncryptionOptions} options - Encryption options
 * @returns {Promise<{ encrypted: string; decryptionKey?: string }>} Encrypted data
 *
 * @example
 * ```typescript
 * const result = await encryptTranscript(transcript, {
 *   algorithm: 'aes-256-cbc',
 *   passwordProtected: true,
 *   password: 'secure-password',
 *   includeDecryptionInstructions: true
 * });
 * ```
 */
export declare function encryptTranscript(transcript: any, options: EncryptionOptions): Promise<{
    encrypted: string;
    decryptionKey?: string;
}>;
/**
 * Decrypt transcript using provided key or password.
 *
 * @param {string} encryptedData - Encrypted transcript data
 * @param {string} keyOrPassword - Decryption key or password
 * @returns {Promise<any>} Decrypted transcript
 */
export declare function decryptTranscript(encryptedData: string, keyOrPassword: string): Promise<any>;
/**
 * Apply watermark to transcript PDF.
 *
 * @param {string} pdfPath - Path to PDF file
 * @param {string} watermarkText - Watermark text
 * @param {any} options - Watermark options
 * @returns {Promise<string>} Path to watermarked PDF
 */
export declare function applyTranscriptWatermark(pdfPath: string, watermarkText: string, options?: any): Promise<string>;
/**
 * Add digital signature to transcript.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} signerName - Name of signer
 * @param {string} signerTitle - Title of signer
 * @returns {Promise<string>} Digital signature
 */
export declare function addDigitalSignatureToTranscript(transcriptId: string, signerName: string, signerTitle: string): Promise<string>;
/**
 * Protect transcript PDF with password.
 *
 * @param {string} pdfPath - Path to PDF file
 * @param {string} password - Protection password
 * @returns {Promise<string>} Path to protected PDF
 */
export declare function passwordProtectTranscript(pdfPath: string, password: string): Promise<string>;
/**
 * Retrieve transcript by ID.
 *
 * @param {string} transcriptId - Transcript identifier
 * @returns {Promise<any>} Transcript data
 */
export declare function getTranscriptById(transcriptId: string): Promise<any>;
/**
 * Get all transcripts for a student.
 *
 * @param {string} studentId - Student identifier
 * @param {TranscriptType} [type] - Optional filter by type
 * @returns {Promise<any[]>} Array of transcripts
 */
export declare function getStudentTranscripts(studentId: string, type?: TranscriptType): Promise<any[]>;
/**
 * Search transcripts by criteria.
 *
 * @param {any} criteria - Search criteria
 * @returns {Promise<any[]>} Matching transcripts
 */
export declare function searchTranscripts(criteria: any): Promise<any[]>;
/**
 * Get transcript request history for student.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<any[]>} Request history
 */
export declare function getTranscriptRequestHistory(studentId: string): Promise<any[]>;
/**
 * Get pending transcript requests.
 *
 * @param {any} filters - Optional filters
 * @returns {Promise<any[]>} Pending requests
 */
export declare function getPendingTranscriptRequests(filters?: any): Promise<any[]>;
/**
 * Get transcript statistics for reporting.
 *
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<TranscriptStatistics>} Statistics data
 */
export declare function getTranscriptStatistics(startDate: Date, endDate: Date): Promise<TranscriptStatistics>;
/**
 * Audit transcript access and operations.
 *
 * @param {string} transcriptId - Transcript identifier
 * @param {string} action - Action performed
 * @param {string} performedBy - User performing action
 * @param {any} [metadata] - Additional metadata
 * @returns {Promise<TranscriptAuditEntry>} Audit entry
 */
export declare function auditTranscriptAccess(transcriptId: string, action: 'created' | 'viewed' | 'printed' | 'emailed' | 'modified' | 'verified', performedBy: string, metadata?: any): Promise<TranscriptAuditEntry>;
/**
 * Get audit trail for a transcript.
 *
 * @param {string} transcriptId - Transcript identifier
 * @returns {Promise<TranscriptAuditEntry[]>} Audit trail
 */
export declare function getTranscriptAuditTrail(transcriptId: string): Promise<TranscriptAuditEntry[]>;
export {};
//# sourceMappingURL=transcript-management-kit.d.ts.map