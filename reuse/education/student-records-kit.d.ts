/**
 * LOC: EDU-RECORDS-001
 * File: /reuse/education/student-records-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Registrar services
 *   - Records management services
 *   - Compliance reporting modules
 */
/**
 * File: /reuse/education/student-records-kit.ts
 * Locator: WC-EDU-RECORDS-001
 * Purpose: Comprehensive Student Records Management - Ellucian SIS-level records management with FERPA compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node crypto
 * Downstream: ../backend/education/*, Registrar Office, Records Management, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for records management, FERPA compliance, verification, archival, security
 *
 * LLM Context: Enterprise-grade student records management for higher education SIS.
 * Provides comprehensive student records management, FERPA compliance, records request processing,
 * verification services, change of records, transcript management, records holds and locks,
 * records archival and retention, encryption and security, audit logging, electronic signature support,
 * and full compliance with federal education privacy regulations.
 */
import { Sequelize, Transaction } from 'sequelize';
interface AcademicHistory {
    historyId: number;
    studentId: number;
    termId: number;
    academicYear: number;
    creditsAttempted: number;
    creditsEarned: number;
    gpa: number;
    cumulativeGPA: number;
    academicStanding: string;
    deansListStatus: boolean;
    probationStatus: boolean;
    honorsDesignation?: string;
    withdrawalStatus: boolean;
}
interface EducationalRecord {
    recordId: number;
    studentId: number;
    institutionName: string;
    institutionType: 'high-school' | 'college' | 'university' | 'other';
    attendanceStartDate: Date;
    attendanceEndDate?: Date;
    degreeEarned?: string;
    graduationDate?: Date;
    gpa?: number;
    transcriptReceived: boolean;
    verificationStatus: string;
}
interface FERPAConsent {
    consentId: string;
    studentId: number;
    consentType: 'directory-information' | 'educational-records' | 'third-party-disclosure';
    grantedTo?: string;
    purpose: string;
    effectiveDate: Date;
    expirationDate?: Date;
    isActive: boolean;
    revokedDate?: Date;
    revokedBy?: string;
}
interface RecordsRequest {
    requestId: string;
    studentId: number;
    requestType: 'transcript' | 'verification' | 'enrollment-letter' | 'degree-audit' | 'full-records';
    requestDate: Date;
    requestedBy: string;
    recipientName: string;
    recipientAddress: string;
    deliveryMethod: 'mail' | 'electronic' | 'pickup' | 'fax';
    urgency: 'standard' | 'rush' | 'same-day';
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'on-hold';
    processedBy?: string;
    processedDate?: Date;
    trackingNumber?: string;
    fee: number;
    isPaid: boolean;
}
interface TranscriptRequest {
    transcriptId: string;
    studentId: number;
    transcriptType: 'official' | 'unofficial' | 'academic-progress';
    includeGrades: boolean;
    includeDegrees: boolean;
    includeHonors: boolean;
    includeTestScores: boolean;
    recipientName: string;
    recipientEmail?: string;
    deliveryMethod: string;
    requestDate: Date;
    issuedDate?: Date;
    electronicSignature?: string;
    verificationCode?: string;
}
interface RecordsHold {
    holdId: string;
    studentId: number;
    recordType: string;
    holdReason: string;
    placedBy: string;
    placedDate: Date;
    releasedBy?: string;
    releasedDate?: Date;
    isActive: boolean;
    requiresAuthorization: boolean;
}
interface GradeChangeRequest {
    requestId: string;
    studentId: number;
    courseId: number;
    termId: number;
    currentGrade: string;
    proposedGrade: string;
    changeReason: string;
    requestedBy: string;
    requestDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
    status: 'pending' | 'approved' | 'denied';
}
interface DegreeAudit {
    auditId: string;
    studentId: number;
    programId: number;
    degreeType: string;
    auditDate: Date;
    completionPercentage: number;
    creditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    creditsRemaining: number;
    requirementsMet: string[];
    requirementsPending: string[];
    expectedGraduationDate?: Date;
}
export declare class CreateRecordDto {
    studentId: number;
    recordType: string;
    academicYear: number;
    termId: number;
    recordData: Record<string, any>;
    isOfficial: boolean;
    isPermanent: boolean;
    ferpaProtected: boolean;
}
export declare class TranscriptRequestDto {
    studentId: number;
    transcriptType: string;
    recipientName: string;
    recipientEmail?: string;
    deliveryMethod: string;
    includeGrades: boolean;
    includeDegrees: boolean;
}
export declare class FERPAConsentDto {
    studentId: number;
    consentType: string;
    grantedTo?: string;
    purpose: string;
    effectiveDate: Date;
    expirationDate?: Date;
}
export declare class RecordsRequestDto {
    studentId: number;
    requestType: string;
    recipientName: string;
    recipientAddress: string;
    deliveryMethod: string;
    urgency: string;
}
/**
 * Sequelize model for StudentRecord with FERPA compliance and encryption.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentRecord model
 *
 * @example
 * ```typescript
 * const StudentRecord = createStudentRecordModel(sequelize);
 * const record = await StudentRecord.create({
 *   recordId: 'REC-2024-001234',
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { ... },
 *   isOfficial: true,
 *   ferpaProtected: true
 * });
 * ```
 */
export declare const createStudentRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        recordId: string;
        studentId: number;
        recordType: string;
        recordDate: Date;
        academicYear: number;
        termId: number;
        recordData: Record<string, any>;
        recordDataEncrypted: string | null;
        isOfficial: boolean;
        isPermanent: boolean;
        isLocked: boolean;
        ferpaProtected: boolean;
        retentionPeriod: number;
        destructionDate: Date | null;
        encryptionKey: string | null;
        lastAccessedDate: Date | null;
        lastAccessedBy: string | null;
        accessCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for AcademicHistory with comprehensive GPA tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AcademicHistory model
 *
 * @example
 * ```typescript
 * const AcademicHistory = createAcademicHistoryModel(sequelize);
 * const history = await AcademicHistory.create({
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good'
 * });
 * ```
 */
export declare const createAcademicHistoryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        termId: number;
        academicYear: number;
        creditsAttempted: number;
        creditsEarned: number;
        creditsTransfer: number;
        gpa: number;
        cumulativeGPA: number;
        majorGPA: number | null;
        academicStanding: string;
        deansListStatus: boolean;
        presidentsListStatus: boolean;
        probationStatus: boolean;
        suspensionStatus: boolean;
        honorsDesignation: string | null;
        withdrawalStatus: boolean;
        leaveOfAbsence: boolean;
        graduationEligible: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for EducationalRecord for prior institutions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EducationalRecord model
 */
export declare const createEducationalRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        institutionName: string;
        institutionCode: string | null;
        institutionType: string;
        institutionCity: string | null;
        institutionState: string | null;
        institutionCountry: string;
        attendanceStartDate: Date;
        attendanceEndDate: Date | null;
        degreeEarned: string | null;
        majorField: string | null;
        graduationDate: Date | null;
        gpa: number | null;
        gpaScale: number;
        transcriptReceived: boolean;
        transcriptDate: Date | null;
        verificationStatus: string;
        verificationDate: Date | null;
        isPrimary: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new student record with FERPA protection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRecordDto} recordData - Record creation data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created record
 *
 * @example
 * ```typescript
 * const record = await createStudentRecord(sequelize, {
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { courseGrades: [...] },
 *   isOfficial: true,
 *   isPermanent: true,
 *   ferpaProtected: true
 * }, 'registrar123');
 * ```
 */
export declare const createStudentRecord: (sequelize: Sequelize, recordData: CreateRecordDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a student record with FERPA compliance check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User requesting the record
 * @param {string} [justification] - Justification for access
 * @returns {Promise<any>} Student record
 *
 * @example
 * ```typescript
 * const record = await getStudentRecord(sequelize, 'REC-2024-001', 'advisor123', 'Academic advising');
 * ```
 */
export declare const getStudentRecord: (sequelize: Sequelize, recordId: string, userId: string, justification?: string) => Promise<any>;
/**
 * Updates a student record if not locked.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {Partial<CreateRecordDto>} updateData - Update data
 * @param {string} userId - User updating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated record
 *
 * @example
 * ```typescript
 * const updated = await updateStudentRecord(sequelize, 'REC-2024-001', {
 *   recordData: { updatedField: 'newValue' }
 * }, 'registrar123');
 * ```
 */
export declare const updateStudentRecord: (sequelize: Sequelize, recordId: string, updateData: Partial<CreateRecordDto>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Locks a student record to prevent modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User locking the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockStudentRecord(sequelize, 'REC-2024-001', 'registrar123');
 * ```
 */
export declare const lockStudentRecord: (sequelize: Sequelize, recordId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves all records for a student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<any[]>} Array of records
 *
 * @example
 * ```typescript
 * const records = await getStudentRecords(sequelize, 1, 'academic');
 * ```
 */
export declare const getStudentRecords: (sequelize: Sequelize, studentId: number, recordType?: string) => Promise<any[]>;
/**
 * Creates academic history record for term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AcademicHistory} historyData - Academic history data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Academic history record
 *
 * @example
 * ```typescript
 * const history = await createAcademicHistory(sequelize, {
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good',
 *   deansListStatus: true,
 *   probationStatus: false,
 *   withdrawalStatus: false
 * });
 * ```
 */
export declare const createAcademicHistory: (sequelize: Sequelize, historyData: AcademicHistory, transaction?: Transaction) => Promise<any>;
/**
 * Calculates cumulative GPA for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<number>} Cumulative GPA
 *
 * @example
 * ```typescript
 * const gpa = await calculateCumulativeGPA(sequelize, 1);
 * ```
 */
export declare const calculateCumulativeGPA: (sequelize: Sequelize, studentId: number) => Promise<number>;
/**
 * Adds educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EducationalRecord} educationData - Educational record data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Educational record
 *
 * @example
 * ```typescript
 * const record = await addEducationalRecord(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionType: 'university',
 *   attendanceStartDate: new Date('2020-09-01'),
 *   attendanceEndDate: new Date('2022-05-15'),
 *   degreeEarned: 'Associate of Arts',
 *   graduationDate: new Date('2022-05-15'),
 *   gpa: 3.2,
 *   transcriptReceived: true,
 *   verificationStatus: 'verified'
 * });
 * ```
 */
export declare const addEducationalRecord: (sequelize: Sequelize, educationData: Partial<EducationalRecord>, transaction?: Transaction) => Promise<any>;
/**
 * Verifies educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} recordId - Educational record ID
 * @param {string} userId - User verifying the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await verifyEducationalRecord(sequelize, 1, 'registrar123');
 * ```
 */
export declare const verifyEducationalRecord: (sequelize: Sequelize, recordId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates FERPA consent record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FERPAConsent} consentData - Consent data
 * @param {string} userId - User creating consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consent record
 *
 * @example
 * ```typescript
 * const consent = await createFERPAConsent(sequelize, {
 *   consentId: 'FERPA-2024-001',
 *   studentId: 1,
 *   consentType: 'third-party-disclosure',
 *   grantedTo: 'Parent - John Doe Sr.',
 *   purpose: 'Academic progress disclosure',
 *   effectiveDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   isActive: true
 * }, 'student123');
 * ```
 */
export declare const createFERPAConsent: (sequelize: Sequelize, consentData: FERPAConsent, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates FERPA authorization for record access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} requestedBy - User requesting access
 * @param {string} purpose - Purpose of access
 * @returns {Promise<{ authorized: boolean; reason?: string }>} Authorization status
 *
 * @example
 * ```typescript
 * const auth = await validateFERPAAuthorization(sequelize, 1, 'parent123', 'View grades');
 * ```
 */
export declare const validateFERPAAuthorization: (sequelize: Sequelize, studentId: number, requestedBy: string, purpose: string) => Promise<{
    authorized: boolean;
    reason?: string;
}>;
/**
 * Revokes FERPA consent.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consentId - Consent ID
 * @param {string} userId - User revoking consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFERPAConsent(sequelize, 'FERPA-2024-001', 'student123');
 * ```
 */
export declare const revokeFERPAConsent: (sequelize: Sequelize, consentId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Checks if student has opted out of directory information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<boolean>} Whether student opted out
 *
 * @example
 * ```typescript
 * const optedOut = await checkDirectoryOptOut(sequelize, 1);
 * ```
 */
export declare const checkDirectoryOptOut: (sequelize: Sequelize, studentId: number) => Promise<boolean>;
/**
 * Logs record access for FERPA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {number} studentId - Student ID
 * @param {string} actionType - Type of action
 * @param {string} userId - User performing action
 * @param {Transaction} [transaction] - Optional transaction
 * @param {string} [justification] - Justification for access
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logRecordAccess(sequelize, 'REC-2024-001', 1, 'view', 'advisor123', undefined, 'Academic advising');
 * ```
 */
export declare const logRecordAccess: (sequelize: Sequelize, recordId: string, studentId: number, actionType: string, userId: string, transaction?: Transaction, justification?: string) => Promise<void>;
/**
 * Retrieves FERPA audit log for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<any[]>} Audit log entries
 *
 * @example
 * ```typescript
 * const auditLog = await getFERPAAuditLog(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const getFERPAAuditLog: (sequelize: Sequelize, studentId: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
/**
 * Validates FERPA compliance for record disclosure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} recipientType - Type of recipient
 * @param {string} purpose - Purpose of disclosure
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateRecordDisclosure(sequelize, 1, 'employer', 'Employment verification');
 * ```
 */
export declare const validateRecordDisclosure: (sequelize: Sequelize, studentId: number, recipientType: string, purpose: string) => Promise<{
    compliant: boolean;
    issues: string[];
}>;
/**
 * Generates FERPA compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateFERPAComplianceReport(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const generateFERPAComplianceReport: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Encrypts sensitive record data.
 *
 * @param {string} data - Data to encrypt
 * @returns {{ encrypted: string; key: string }} Encrypted data and key
 *
 * @example
 * ```typescript
 * const { encrypted, key } = encryptRecordData(JSON.stringify(sensitiveData));
 * ```
 */
export declare const encryptRecordData: (data: string) => {
    encrypted: string;
    key: string;
};
/**
 * Decrypts encrypted record data.
 *
 * @param {string} encryptedData - Encrypted data
 * @param {string} keyHex - Encryption key in hex
 * @returns {string} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = decryptRecordData(encrypted, key);
 * ```
 */
export declare const decryptRecordData: (encryptedData: string, keyHex: string) => string;
/**
 * Creates records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsRequest} requestData - Request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records request
 *
 * @example
 * ```typescript
 * const request = await createRecordsRequest(sequelize, {
 *   requestId: 'REQ-2024-001',
 *   studentId: 1,
 *   requestType: 'transcript',
 *   requestDate: new Date(),
 *   requestedBy: 'student123',
 *   recipientName: 'Graduate School',
 *   recipientAddress: '123 University Ave',
 *   deliveryMethod: 'electronic',
 *   urgency: 'standard',
 *   status: 'pending',
 *   fee: 10,
 *   isPaid: false
 * }, 'student123');
 * ```
 */
export declare const createRecordsRequest: (sequelize: Sequelize, requestData: RecordsRequest, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User processing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processRecordsRequest(sequelize, 'REQ-2024-001', 'registrar123');
 * ```
 */
export declare const processRecordsRequest: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Completes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} trackingNumber - Tracking number
 * @param {string} userId - User completing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completeRecordsRequest(sequelize, 'REQ-2024-001', 'TRACK-12345', 'registrar123');
 * ```
 */
export declare const completeRecordsRequest: (sequelize: Sequelize, requestId: string, trackingNumber: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves pending records requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Pending requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingRecordsRequests(sequelize);
 * ```
 */
export declare const getPendingRecordsRequests: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Cancels records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User cancelling request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelRecordsRequest(sequelize, 'REQ-2024-001', 'student123');
 * ```
 */
export declare const cancelRecordsRequest: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates transcript request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TranscriptRequest} transcriptData - Transcript request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transcript request
 *
 * @example
 * ```typescript
 * const transcript = await createTranscriptRequest(sequelize, {
 *   transcriptId: 'TRANS-2024-001',
 *   studentId: 1,
 *   transcriptType: 'official',
 *   includeGrades: true,
 *   includeDegrees: true,
 *   includeHonors: true,
 *   includeTestScores: false,
 *   recipientName: 'Graduate School',
 *   recipientEmail: 'admissions@gradschool.edu',
 *   deliveryMethod: 'electronic',
 *   requestDate: new Date()
 * }, 'student123');
 * ```
 */
export declare const createTranscriptRequest: (sequelize: Sequelize, transcriptData: TranscriptRequest, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates official transcript.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {boolean} includeInProgress - Include in-progress courses
 * @returns {Promise<any>} Transcript data
 *
 * @example
 * ```typescript
 * const transcript = await generateOfficialTranscript(sequelize, 1, true);
 * ```
 */
export declare const generateOfficialTranscript: (sequelize: Sequelize, studentId: number, includeInProgress?: boolean) => Promise<any>;
/**
 * Verifies transcript authenticity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} verificationCode - Verification code
 * @returns {Promise<{ valid: boolean; transcriptData?: any }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyTranscriptAuthenticity(sequelize, 'abc123def456');
 * ```
 */
export declare const verifyTranscriptAuthenticity: (sequelize: Sequelize, verificationCode: string) => Promise<{
    valid: boolean;
    transcriptData?: any;
}>;
/**
 * Generates degree verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} degreeType - Degree type
 * @returns {Promise<any>} Verification letter
 *
 * @example
 * ```typescript
 * const letter = await generateDegreeVerification(sequelize, 1, 'Bachelor of Science');
 * ```
 */
export declare const generateDegreeVerification: (sequelize: Sequelize, studentId: number, degreeType: string) => Promise<any>;
/**
 * Creates enrollment verification for external party.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} verificationPurpose - Purpose of verification
 * @returns {Promise<any>} Enrollment verification
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
export declare const createEnrollmentVerificationLetter: (sequelize: Sequelize, studentId: number, termId: number, verificationPurpose: string) => Promise<any>;
/**
 * Creates grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GradeChangeRequest} changeData - Grade change data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Grade change request
 *
 * @example
 * ```typescript
 * const request = await createGradeChangeRequest(sequelize, {
 *   requestId: 'GC-2024-001',
 *   studentId: 1,
 *   courseId: 101,
 *   termId: 202401,
 *   currentGrade: 'B',
 *   proposedGrade: 'A',
 *   changeReason: 'Grading error - final exam score was incorrectly recorded',
 *   requestedBy: 'professor123',
 *   requestDate: new Date(),
 *   status: 'pending'
 * }, 'professor123');
 * ```
 */
export declare const createGradeChangeRequest: (sequelize: Sequelize, changeData: GradeChangeRequest, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User approving request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveGradeChange(sequelize, 'GC-2024-001', 'dean123');
 * ```
 */
export declare const approveGradeChange: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Places hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records hold
 *
 * @example
 * ```typescript
 * const hold = await placeRecordsHold(sequelize, {
 *   holdId: 'RHOLD-2024-001',
 *   studentId: 1,
 *   recordType: 'transcript',
 *   holdReason: 'Unpaid library fines',
 *   placedBy: 'library123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   requiresAuthorization: true
 * }, 'library123');
 * ```
 */
export declare const placeRecordsHold: (sequelize: Sequelize, holdData: RecordsHold, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Releases hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseRecordsHold(sequelize, 'RHOLD-2024-001', 'library123');
 * ```
 */
export declare const releaseRecordsHold: (sequelize: Sequelize, holdId: string, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Checks for active records holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkRecordsHolds(sequelize, 1, 'transcript');
 * ```
 */
export declare const checkRecordsHolds: (sequelize: Sequelize, studentId: number, recordType?: string) => Promise<{
    hasHolds: boolean;
    holds: any[];
}>;
/**
 * Archives student records for retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} archiveLocation - Archive storage location
 * @param {string} userId - User archiving records
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive summary
 *
 * @example
 * ```typescript
 * const archive = await archiveStudentRecords(sequelize, 1, 's3://archives/2024/', 'registrar123');
 * ```
 */
export declare const archiveStudentRecords: (sequelize: Sequelize, studentId: number, archiveLocation: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves archived records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} archiveId - Archive ID
 * @param {string} userId - User requesting records
 * @returns {Promise<any>} Archived records
 *
 * @example
 * ```typescript
 * const archived = await retrieveArchivedRecords(sequelize, 'ARCH-1-1234567890', 'registrar123');
 * ```
 */
export declare const retrieveArchivedRecords: (sequelize: Sequelize, archiveId: string, userId: string) => Promise<any>;
/**
 * Schedules records for destruction based on retention policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ scheduled: number; records: any[] }>} Destruction schedule
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleRecordsDestruction(sequelize);
 * ```
 */
export declare const scheduleRecordsDestruction: (sequelize: Sequelize, transaction?: Transaction) => Promise<{
    scheduled: number;
    records: any[];
}>;
/**
 * Securely destroys expired records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to destroy
 * @param {string} userId - User authorizing destruction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records destroyed
 *
 * @example
 * ```typescript
 * const destroyed = await destroyExpiredRecords(sequelize, ['REC-2015-001', 'REC-2015-002'], 'registrar123');
 * ```
 */
export declare const destroyExpiredRecords: (sequelize: Sequelize, recordIds: string[], userId: string, transaction?: Transaction) => Promise<number>;
/**
 * Generates records retention report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Retention report
 *
 * @example
 * ```typescript
 * const report = await generateRetentionReport(sequelize);
 * ```
 */
export declare const generateRetentionReport: (sequelize: Sequelize) => Promise<any>;
/**
 * Performs security audit on records access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Security audit report
 *
 * @example
 * ```typescript
 * const audit = await performSecurityAudit(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const performSecurityAudit: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Encrypts batch of student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to encrypt
 * @param {string} userId - User performing encryption
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records encrypted
 *
 * @example
 * ```typescript
 * const encrypted = await encryptStudentRecords(sequelize, ['REC-2024-001', 'REC-2024-002'], 'admin123');
 * ```
 */
export declare const encryptStudentRecords: (sequelize: Sequelize, recordIds: string[], userId: string, transaction?: Transaction) => Promise<number>;
/**
 * Validates records encryption compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ compliant: boolean; unencryptedCount: number; records: any[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateEncryptionCompliance(sequelize);
 * ```
 */
export declare const validateEncryptionCompliance: (sequelize: Sequelize) => Promise<{
    compliant: boolean;
    unencryptedCount: number;
    records: any[];
}>;
/**
 * Creates degree audit for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DegreeAudit} auditData - Degree audit data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Degree audit
 *
 * @example
 * ```typescript
 * const audit = await createDegreeAudit(sequelize, {
 *   auditId: 'AUDIT-2024-001',
 *   studentId: 1,
 *   programId: 101,
 *   degreeType: 'Bachelor of Science',
 *   auditDate: new Date(),
 *   completionPercentage: 75,
 *   creditsRequired: 120,
 *   creditsCompleted: 90,
 *   creditsInProgress: 15,
 *   creditsRemaining: 15,
 *   requirementsMet: ['General Education', 'Major Core'],
 *   requirementsPending: ['Senior Capstone', 'Electives'],
 *   expectedGraduationDate: new Date('2025-05-15')
 * });
 * ```
 */
export declare const createDegreeAudit: (sequelize: Sequelize, auditData: DegreeAudit, transaction?: Transaction) => Promise<any>;
/**
 * Generates comprehensive student history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any>} Comprehensive history report
 *
 * @example
 * ```typescript
 * const history = await generateStudentHistoryReport(sequelize, 1);
 * ```
 */
export declare const generateStudentHistoryReport: (sequelize: Sequelize, studentId: number) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createStudentRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            recordId: string;
            studentId: number;
            recordType: string;
            recordDate: Date;
            academicYear: number;
            termId: number;
            recordData: Record<string, any>;
            recordDataEncrypted: string | null;
            isOfficial: boolean;
            isPermanent: boolean;
            isLocked: boolean;
            ferpaProtected: boolean;
            retentionPeriod: number;
            destructionDate: Date | null;
            encryptionKey: string | null;
            lastAccessedDate: Date | null;
            lastAccessedBy: string | null;
            accessCount: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createAcademicHistoryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentId: number;
            termId: number;
            academicYear: number;
            creditsAttempted: number;
            creditsEarned: number;
            creditsTransfer: number;
            gpa: number;
            cumulativeGPA: number;
            majorGPA: number | null;
            academicStanding: string;
            deansListStatus: boolean;
            presidentsListStatus: boolean;
            probationStatus: boolean;
            suspensionStatus: boolean;
            honorsDesignation: string | null;
            withdrawalStatus: boolean;
            leaveOfAbsence: boolean;
            graduationEligible: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createEducationalRecordModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            studentId: number;
            institutionName: string;
            institutionCode: string | null;
            institutionType: string;
            institutionCity: string | null;
            institutionState: string | null;
            institutionCountry: string;
            attendanceStartDate: Date;
            attendanceEndDate: Date | null;
            degreeEarned: string | null;
            majorField: string | null;
            graduationDate: Date | null;
            gpa: number | null;
            gpaScale: number;
            transcriptReceived: boolean;
            transcriptDate: Date | null;
            verificationStatus: string;
            verificationDate: Date | null;
            isPrimary: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createStudentRecord: (sequelize: Sequelize, recordData: CreateRecordDto, userId: string, transaction?: Transaction) => Promise<any>;
    getStudentRecord: (sequelize: Sequelize, recordId: string, userId: string, justification?: string) => Promise<any>;
    updateStudentRecord: (sequelize: Sequelize, recordId: string, updateData: Partial<CreateRecordDto>, userId: string, transaction?: Transaction) => Promise<any>;
    lockStudentRecord: (sequelize: Sequelize, recordId: string, userId: string, transaction?: Transaction) => Promise<void>;
    getStudentRecords: (sequelize: Sequelize, studentId: number, recordType?: string) => Promise<any[]>;
    createAcademicHistory: (sequelize: Sequelize, historyData: AcademicHistory, transaction?: Transaction) => Promise<any>;
    calculateCumulativeGPA: (sequelize: Sequelize, studentId: number) => Promise<number>;
    addEducationalRecord: (sequelize: Sequelize, educationData: Partial<EducationalRecord>, transaction?: Transaction) => Promise<any>;
    verifyEducationalRecord: (sequelize: Sequelize, recordId: number, userId: string, transaction?: Transaction) => Promise<void>;
    createFERPAConsent: (sequelize: Sequelize, consentData: FERPAConsent, userId: string, transaction?: Transaction) => Promise<any>;
    validateFERPAAuthorization: (sequelize: Sequelize, studentId: number, requestedBy: string, purpose: string) => Promise<{
        authorized: boolean;
        reason?: string;
    }>;
    revokeFERPAConsent: (sequelize: Sequelize, consentId: string, userId: string, transaction?: Transaction) => Promise<void>;
    checkDirectoryOptOut: (sequelize: Sequelize, studentId: number) => Promise<boolean>;
    logRecordAccess: (sequelize: Sequelize, recordId: string, studentId: number, actionType: string, userId: string, transaction?: Transaction, justification?: string) => Promise<void>;
    getFERPAAuditLog: (sequelize: Sequelize, studentId: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
    validateRecordDisclosure: (sequelize: Sequelize, studentId: number, recipientType: string, purpose: string) => Promise<{
        compliant: boolean;
        issues: string[];
    }>;
    generateFERPAComplianceReport: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any>;
    encryptRecordData: (data: string) => {
        encrypted: string;
        key: string;
    };
    decryptRecordData: (encryptedData: string, keyHex: string) => string;
    createRecordsRequest: (sequelize: Sequelize, requestData: RecordsRequest, userId: string, transaction?: Transaction) => Promise<any>;
    processRecordsRequest: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
    completeRecordsRequest: (sequelize: Sequelize, requestId: string, trackingNumber: string, userId: string, transaction?: Transaction) => Promise<void>;
    getPendingRecordsRequests: (sequelize: Sequelize) => Promise<any[]>;
    cancelRecordsRequest: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
    createTranscriptRequest: (sequelize: Sequelize, transcriptData: TranscriptRequest, userId: string, transaction?: Transaction) => Promise<any>;
    generateOfficialTranscript: (sequelize: Sequelize, studentId: number, includeInProgress?: boolean) => Promise<any>;
    verifyTranscriptAuthenticity: (sequelize: Sequelize, verificationCode: string) => Promise<{
        valid: boolean;
        transcriptData?: any;
    }>;
    generateDegreeVerification: (sequelize: Sequelize, studentId: number, degreeType: string) => Promise<any>;
    createEnrollmentVerificationLetter: (sequelize: Sequelize, studentId: number, termId: number, verificationPurpose: string) => Promise<any>;
    createGradeChangeRequest: (sequelize: Sequelize, changeData: GradeChangeRequest, userId: string, transaction?: Transaction) => Promise<any>;
    approveGradeChange: (sequelize: Sequelize, requestId: string, userId: string, transaction?: Transaction) => Promise<void>;
    placeRecordsHold: (sequelize: Sequelize, holdData: RecordsHold, userId: string, transaction?: Transaction) => Promise<any>;
    releaseRecordsHold: (sequelize: Sequelize, holdId: string, userId: string, transaction?: Transaction) => Promise<void>;
    checkRecordsHolds: (sequelize: Sequelize, studentId: number, recordType?: string) => Promise<{
        hasHolds: boolean;
        holds: any[];
    }>;
    archiveStudentRecords: (sequelize: Sequelize, studentId: number, archiveLocation: string, userId: string, transaction?: Transaction) => Promise<any>;
    retrieveArchivedRecords: (sequelize: Sequelize, archiveId: string, userId: string) => Promise<any>;
    scheduleRecordsDestruction: (sequelize: Sequelize, transaction?: Transaction) => Promise<{
        scheduled: number;
        records: any[];
    }>;
    destroyExpiredRecords: (sequelize: Sequelize, recordIds: string[], userId: string, transaction?: Transaction) => Promise<number>;
    generateRetentionReport: (sequelize: Sequelize) => Promise<any>;
    performSecurityAudit: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any>;
    encryptStudentRecords: (sequelize: Sequelize, recordIds: string[], userId: string, transaction?: Transaction) => Promise<number>;
    validateEncryptionCompliance: (sequelize: Sequelize) => Promise<{
        compliant: boolean;
        unencryptedCount: number;
        records: any[];
    }>;
    createDegreeAudit: (sequelize: Sequelize, auditData: DegreeAudit, transaction?: Transaction) => Promise<any>;
    generateStudentHistoryReport: (sequelize: Sequelize, studentId: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=student-records-kit.d.ts.map