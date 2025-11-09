/**
 * LOC: EDU-COMP-TRANSCRIPT-003
 * File: /reuse/education/composites/transcript-credentials-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../transcript-management-kit
 *   - ../credential-management-kit
 *   - ../student-records-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Registrar controllers
 *   - Transcript services
 *   - Credential processors
 *   - Verification systems
 *   - Document delivery modules
 */
import { Sequelize } from 'sequelize';
export type TranscriptType = 'official' | 'unofficial' | 'enrollment_verification' | 'degree_verification';
export type DeliveryMethod = 'electronic' | 'mail' | 'pickup' | 'third_party';
export type TranscriptFormat = 'pdf' | 'xml' | 'json' | 'paper';
export type CredentialType = 'diploma' | 'certificate' | 'badge' | 'micro_credential';
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'expired';
export interface TranscriptRequest {
    requestId: string;
    studentId: string;
    transcriptType: TranscriptType;
    deliveryMethod: DeliveryMethod;
    format: TranscriptFormat;
    recipientName?: string;
    recipientEmail?: string;
    recipientAddress?: any;
    requestedBy: string;
    requestDate: Date;
    processingStatus: 'pending' | 'processing' | 'completed' | 'on_hold' | 'cancelled';
    deliveryDate?: Date;
    trackingNumber?: string;
}
export interface OfficialTranscript {
    transcriptId: string;
    studentId: string;
    issuedDate: Date;
    format: TranscriptFormat;
    includeGrades: boolean;
    includeGPA: boolean;
    digitalSignature?: string;
    verificationCode: string;
    watermark: boolean;
    encrypted: boolean;
    content: {
        studentInfo: any;
        academicHistory: any[];
        degreeInfo?: any;
        gpa: number;
        totalCredits: number;
    };
}
export interface DigitalCredential {
    credentialId: string;
    studentId: string;
    credentialType: CredentialType;
    issuedDate: Date;
    expirationDate?: Date;
    credentialData: any;
    verificationUrl: string;
    blockchainHash?: string;
    revokedAt?: Date;
    revokedReason?: string;
}
export interface TranscriptHold {
    holdId: string;
    studentId: string;
    holdType: 'financial' | 'academic' | 'disciplinary' | 'registration' | 'administrative';
    holdReason: string;
    placedBy: string;
    placedDate: Date;
    removedBy?: string;
    removedDate?: Date;
    isActive: boolean;
}
export interface VerificationResult {
    verified: boolean;
    verificationId: string;
    documentId: string;
    verifiedAt: Date;
    details: {
        isAuthentic: boolean;
        isUnaltered: boolean;
        issuingInstitution: string;
        issueDate: Date;
        expirationDate?: Date;
    };
    warnings?: string[];
}
/**
 * @swagger
 * components:
 *   schemas:
 *     TranscriptRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         transcriptType:
 *           type: string
 *           enum: [official, unofficial, enrollment_verification, degree_verification]
 */
export declare const createTranscriptRequestModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        transcriptType: string;
        deliveryMethod: string;
        processingStatus: string;
        requestData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createDigitalCredentialModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        credentialType: string;
        credentialData: Record<string, any>;
        verificationCode: string;
        isRevoked: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare const createTranscriptHoldModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        holdType: string;
        holdReason: string;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare class TranscriptCredentialsCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Generates official transcript with security features.
     * @example
     * ```typescript
     * const transcript = await service.generateOfficialTranscript('STU123', {
     *   includeGrades: true, includeGPA: true, watermark: true, encrypted: true
     * });
     * ```
     */
    generateOfficialTranscript(studentId: string, options: any): Promise<OfficialTranscript>;
    /**
     * 2. Generates unofficial transcript for student access.
     * @example
     * ```typescript
     * const unofficial = await service.generateUnofficialTranscript('STU123');
     * ```
     */
    generateUnofficialTranscript(studentId: string): Promise<any>;
    /**
     * 3. Processes transcript request from submission to delivery.
     * @example
     * ```typescript
     * const request = await service.processTranscriptRequest({
     *   studentId: 'STU123', transcriptType: 'official', deliveryMethod: 'electronic'
     * });
     * ```
     */
    processTranscriptRequest(requestData: Partial<TranscriptRequest>): Promise<TranscriptRequest>;
    /**
     * 4. Delivers transcript electronically via email.
     * @example
     * ```typescript
     * await service.deliverTranscriptElectronically('REQ123', 'recipient@university.edu');
     * ```
     */
    deliverTranscriptElectronically(requestId: string, recipientEmail: string): Promise<any>;
    /**
     * 5. Generates enrollment verification letter.
     * @example
     * ```typescript
     * const verification = await service.generateEnrollmentVerification('STU123', 'FALL2024');
     * ```
     */
    generateEnrollmentVerification(studentId: string, termId: string): Promise<any>;
    /**
     * 6. Generates degree verification letter.
     * @example
     * ```typescript
     * const degreeVerification = await service.generateDegreeVerification('STU123');
     * ```
     */
    generateDegreeVerification(studentId: string): Promise<any>;
    /**
     * 7. Creates custom transcript layouts and formats.
     * @example
     * ```typescript
     * const custom = await service.createCustomTranscriptFormat('STU123', customLayout);
     * ```
     */
    createCustomTranscriptFormat(studentId: string, layout: any): Promise<any>;
    /**
     * 8. Batch generates transcripts for multiple students.
     * @example
     * ```typescript
     * const batch = await service.batchGenerateTranscripts(['STU123', 'STU456']);
     * console.log(`Generated ${batch.length} transcripts`);
     * ```
     */
    batchGenerateTranscripts(studentIds: string[]): Promise<any[]>;
    /**
     * 9. Issues digital credential with blockchain verification.
     * @example
     * ```typescript
     * const credential = await service.issueDigitalCredential('STU123', 'diploma', data);
     * ```
     */
    issueDigitalCredential(studentId: string, credentialType: CredentialType, data: any): Promise<DigitalCredential>;
    /**
     * 10. Verifies digital credential authenticity.
     * @example
     * ```typescript
     * const verification = await service.verifyDigitalCredential('CRED123', 'VERIFICATION_CODE');
     * ```
     */
    verifyDigitalCredential(credentialId: string, verificationCode: string): Promise<VerificationResult>;
    /**
     * 11. Creates blockchain-anchored credentials.
     * @example
     * ```typescript
     * const blockchain = await service.createBlockchainCredential('STU123', credentialData);
     * ```
     */
    createBlockchainCredential(studentId: string, credentialData: any): Promise<any>;
    /**
     * 12. Revokes digital credential with reason tracking.
     * @example
     * ```typescript
     * await service.revokeDigitalCredential('CRED123', 'Duplicate issuance');
     * ```
     */
    revokeDigitalCredential(credentialId: string, reason: string): Promise<any>;
    /**
     * 13. Generates shareable credential links.
     * @example
     * ```typescript
     * const link = await service.generateCredentialShareLink('CRED123');
     * ```
     */
    generateCredentialShareLink(credentialId: string): Promise<string>;
    /**
     * 14. Tracks credential issuance and usage.
     * @example
     * ```typescript
     * const tracking = await service.trackCredentialIssuance('STU123');
     * ```
     */
    trackCredentialIssuance(studentId: string): Promise<any>;
    /**
     * 15. Verifies transcript authenticity with digital signatures.
     * @example
     * ```typescript
     * const verification = await service.verifyTranscriptAuthenticity('TRANS123', signature);
     * ```
     */
    verifyTranscriptAuthenticity(transcriptId: string, signature: string): Promise<VerificationResult>;
    /**
     * 16. Encrypts transcript for secure delivery.
     * @example
     * ```typescript
     * const encrypted = await service.encryptTranscript(transcriptBuffer, publicKey);
     * ```
     */
    encryptTranscript(transcriptData: Buffer, publicKey: string): Promise<Buffer>;
    /**
     * 17. Generates secure verification codes.
     * @example
     * ```typescript
     * const code = await service.generateVerificationCode();
     * console.log(`Verification code: ${code}`);
     * ```
     */
    generateVerificationCode(): Promise<string>;
    /**
     * 18. Validates third-party verification requests.
     * @example
     * ```typescript
     * const valid = await service.validateThirdPartyVerification(requestData);
     * ```
     */
    validateThirdPartyVerification(requestData: any): Promise<boolean>;
    /**
     * 19. Implements digital watermarking on transcripts.
     * @example
     * ```typescript
     * const watermarked = await service.applyDigitalWatermark(transcriptPDF);
     * ```
     */
    applyDigitalWatermark(documentBuffer: Buffer): Promise<Buffer>;
    /**
     * 20. Audits transcript access and distribution.
     * @example
     * ```typescript
     * const audit = await service.auditTranscriptAccess('TRANS123');
     * ```
     */
    auditTranscriptAccess(transcriptId: string): Promise<any>;
    /**
     * 21. Validates FERPA compliance for transcript requests.
     * @example
     * ```typescript
     * const compliant = await service.validateFERPACompliance('REQ123');
     * ```
     */
    validateFERPACompliance(requestId: string): Promise<boolean>;
    /**
     * 22. Places hold on transcript release.
     * @example
     * ```typescript
     * await service.placeTranscriptHold('STU123', 'financial', 'Outstanding balance');
     * ```
     */
    placeTranscriptHold(studentId: string, holdType: string, reason: string): Promise<TranscriptHold>;
    /**
     * 23. Removes hold from student transcript.
     * @example
     * ```typescript
     * await service.removeTranscriptHold('HOLD123', 'Balance paid');
     * ```
     */
    removeTranscriptHold(holdId: string, reason: string): Promise<any>;
    /**
     * 24. Checks for active transcript holds.
     * @example
     * ```typescript
     * const holds = await service.checkTranscriptHolds('STU123');
     * ```
     */
    checkTranscriptHolds(studentId: string): Promise<TranscriptHold[]>;
    /**
     * 25. Notifies student of transcript holds.
     * @example
     * ```typescript
     * await service.notifyStudentOfHolds('STU123');
     * ```
     */
    notifyStudentOfHolds(studentId: string): Promise<any>;
    /**
     * 26. Manages hold clearance workflows.
     * @example
     * ```typescript
     * const clearance = await service.manageHoldClearance('HOLD123');
     * ```
     */
    manageHoldClearance(holdId: string): Promise<any>;
    /**
     * 27. Processes electronic transcript delivery.
     * @example
     * ```typescript
     * await service.processElectronicDelivery('REQ123');
     * ```
     */
    processElectronicDelivery(requestId: string): Promise<any>;
    /**
     * 28. Manages mail delivery of official transcripts.
     * @example
     * ```typescript
     * const tracking = await service.processMailDelivery('REQ123', address);
     * ```
     */
    processMailDelivery(requestId: string, address: any): Promise<any>;
    /**
     * 29. Coordinates third-party delivery services.
     * @example
     * ```typescript
     * await service.coordinateThirdPartyDelivery('REQ123', 'Parchment');
     * ```
     */
    coordinateThirdPartyDelivery(requestId: string, provider: string): Promise<any>;
    /**
     * 30. Tracks transcript delivery status.
     * @example
     * ```typescript
     * const status = await service.trackDeliveryStatus('REQ123');
     * ```
     */
    trackDeliveryStatus(requestId: string): Promise<any>;
    /**
     * 31. Handles transcript pickup scheduling.
     * @example
     * ```typescript
     * const appointment = await service.scheduleTranscriptPickup('REQ123', date);
     * ```
     */
    scheduleTranscriptPickup(requestId: string, pickupDate: Date): Promise<any>;
    /**
     * 32. Manages transcript delivery failures and retries.
     * @example
     * ```typescript
     * await service.handleDeliveryFailure('REQ123', 'Invalid email address');
     * ```
     */
    handleDeliveryFailure(requestId: string, reason: string): Promise<any>;
    /**
     * 33. Generates transcript request analytics.
     * @example
     * ```typescript
     * const analytics = await service.generateTranscriptAnalytics('2024-01', '2024-12');
     * ```
     */
    generateTranscriptAnalytics(startDate: string, endDate: string): Promise<any>;
    /**
     * 34. Reports on credential issuance trends.
     * @example
     * ```typescript
     * const trends = await service.reportCredentialIssuanceTrends('2024');
     * ```
     */
    reportCredentialIssuanceTrends(year: string): Promise<any>;
    /**
     * 35. Tracks verification request volumes.
     * @example
     * ```typescript
     * const volume = await service.trackVerificationRequests('2024-Q4');
     * ```
     */
    trackVerificationRequests(period: string): Promise<any>;
    /**
     * 36. Analyzes hold clearance timelines.
     * @example
     * ```typescript
     * const analysis = await service.analyzeHoldClearanceTimeline('2024');
     * ```
     */
    analyzeHoldClearanceTimeline(year: string): Promise<any>;
    /**
     * 37. Generates compliance audit reports.
     * @example
     * ```typescript
     * const report = await service.generateComplianceAuditReport('2024-Q4');
     * ```
     */
    generateComplianceAuditReport(period: string): Promise<any>;
    /**
     * 38. Creates comprehensive transcript services report.
     * @example
     * ```typescript
     * const report = await service.generateTranscriptServicesReport('2024');
     * console.log('Comprehensive services report generated');
     * ```
     */
    generateTranscriptServicesReport(year: string): Promise<any>;
}
export default TranscriptCredentialsCompositeService;
//# sourceMappingURL=transcript-credentials-composite.d.ts.map