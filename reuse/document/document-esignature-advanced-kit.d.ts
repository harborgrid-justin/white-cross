/**
 * LOC: DOC-ESIG-ADV-001
 * File: /reuse/document/document-esignature-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/passport
 *   - @simplewebauthn/server
 *   - face-api.js
 *   - fingerprint-js
 *   - mediasoup-client
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Advanced e-signature controllers
 *   - Biometric authentication services
 *   - Video signing services
 *   - Witness verification modules
 *   - Healthcare compliance services
 */
/**
 * File: /reuse/document/document-esignature-advanced-kit.ts
 * Locator: WC-UTL-ESIG-ADV-001
 * Purpose: Advanced E-Signature Kit - Biometric signatures, video signing, witness management, exceeding DocuSign capabilities
 *
 * Upstream: @nestjs/common, @simplewebauthn/server, face-api.js, fingerprint-js, mediasoup-client, sequelize, crypto
 * Downstream: E-signature controllers, biometric services, video signing, witness verification, compliance handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, WebAuthn/FIDO2, TensorFlow.js
 * Exports: 48 utility functions for biometric signatures, video signing, witness management, in-person signing, signature pads, voice signatures, FIDO2 authentication
 *
 * LLM Context: Production-grade advanced e-signature utilities for White Cross healthcare platform.
 * Provides biometric signature capture (fingerprint, facial recognition), video signing with liveness detection,
 * witness management and verification, in-person signing workflows, signature pad integration,
 * voice signature analysis, FIDO2/WebAuthn passwordless authentication, multi-factor authentication,
 * anti-spoofing measures, compliance with 21 CFR Part 11, HIPAA, eIDAS, and ESIGN Act.
 * Essential for high-security medical consent, controlled substance prescriptions, and legal healthcare documents.
 */
import { Sequelize } from 'sequelize';
/**
 * Biometric signature types
 */
export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'palm' | 'voice' | 'retina' | 'behavioral';
/**
 * Video signing status
 */
export type VideoSigningStatus = 'pending' | 'in_progress' | 'recording' | 'verifying_liveness' | 'completed' | 'failed' | 'rejected';
/**
 * Witness verification status
 */
export type WitnessStatus = 'pending' | 'invited' | 'joined' | 'verified' | 'attested' | 'rejected' | 'expired';
/**
 * Liveness detection methods
 */
export type LivenessMethod = 'passive' | 'active_blink' | 'active_smile' | 'active_head_turn' | 'challenge_response' | 'depth_sensing';
/**
 * Signature pad technologies
 */
export type SignaturePadType = 'capacitive' | 'resistive' | 'electromagnetic' | 'optical' | 'touch_screen';
/**
 * FIDO2 authenticator types
 */
export type AuthenticatorType = 'platform' | 'cross_platform' | 'security_key' | 'biometric';
/**
 * Biometric signature configuration
 */
export interface BiometricSignatureConfig {
    type: BiometricType;
    qualityThreshold?: number;
    matchingThreshold?: number;
    antiSpoofing?: boolean;
    livenessDetection?: boolean;
    multiModal?: boolean;
    templateFormat?: 'ISO' | 'ANSI' | 'proprietary';
    encryptTemplate?: boolean;
}
/**
 * Biometric capture result
 */
export interface BiometricCaptureResult {
    type: BiometricType;
    template: Buffer;
    quality: number;
    confidence: number;
    livenessScore?: number;
    imageData?: Buffer;
    metadata: {
        captureTime: Date;
        deviceId: string;
        sensorType: string;
        resolution?: string;
        algorithm: string;
    };
}
/**
 * Facial recognition configuration
 */
export interface FacialRecognitionConfig {
    landmarks: boolean;
    expressions: boolean;
    ageGender: boolean;
    livenessDetection: LivenessMethod;
    antiSpoofing: boolean;
    minFaceSize?: number;
    maxFaceCount?: number;
    requireFrontalFace?: boolean;
}
/**
 * Facial recognition result
 */
export interface FacialRecognitionResult {
    detected: boolean;
    faceCount: number;
    confidence: number;
    landmarks?: Array<{
        x: number;
        y: number;
    }>;
    expressions?: Record<string, number>;
    age?: number;
    gender?: 'male' | 'female';
    livenessScore: number;
    spoofingDetected: boolean;
    faceDescriptor: number[];
}
/**
 * Video signing session configuration
 */
export interface VideoSigningConfig {
    recordingRequired: boolean;
    livenessDetection: LivenessMethod[];
    witnessRequired: boolean;
    witnessCount?: number;
    maxDuration?: number;
    minDuration?: number;
    requireAudio: boolean;
    requireIdVerification: boolean;
    recordingQuality?: 'low' | 'medium' | 'high' | 'hd';
    encryptRecording?: boolean;
}
/**
 * Video signing session
 */
export interface VideoSigningSession {
    id: string;
    documentId: string;
    signerId: string;
    status: VideoSigningStatus;
    startedAt?: Date;
    completedAt?: Date;
    recordingUrl?: string;
    recordingDuration?: number;
    livenessResults?: LivenessDetectionResult[];
    idVerificationResult?: IDVerificationResult;
    witnesses?: WitnessInfo[];
    thumbnails?: string[];
}
/**
 * Liveness detection result
 */
export interface LivenessDetectionResult {
    method: LivenessMethod;
    passed: boolean;
    confidence: number;
    timestamp: Date;
    challengeData?: any;
    responseData?: any;
    antiSpoofingScore?: number;
}
/**
 * ID verification result
 */
export interface IDVerificationResult {
    verified: boolean;
    documentType: 'passport' | 'drivers_license' | 'national_id' | 'other';
    documentNumber: string;
    issuer: string;
    expiryDate?: Date;
    extractedData: {
        name?: string;
        dateOfBirth?: Date;
        photo?: Buffer;
    };
    matchScore?: number;
    fraudDetected?: boolean;
}
/**
 * Witness information
 */
export interface WitnessInfo {
    id: string;
    name: string;
    email: string;
    role?: string;
    status: WitnessStatus;
    invitedAt: Date;
    joinedAt?: Date;
    attestedAt?: Date;
    verificationMethod?: string;
    idVerified?: boolean;
    signature?: Buffer;
    ipAddress?: string;
    location?: GeolocationData;
}
/**
 * Witness verification configuration
 */
export interface WitnessVerificationConfig {
    minWitnesses: number;
    maxWitnesses: number;
    requireIdVerification: boolean;
    requireSignature: boolean;
    requireVideoPresence: boolean;
    allowRemoteWitness: boolean;
    jurisdictionRules?: Record<string, any>;
}
/**
 * In-person signing configuration
 */
export interface InPersonSigningConfig {
    requireNotary: boolean;
    requireWitnesses: boolean;
    witnessCount?: number;
    capturePhoto: boolean;
    captureFingerprint: boolean;
    requireIdScan: boolean;
    locationVerification: boolean;
    deviceBinding: boolean;
}
/**
 * In-person signing session
 */
export interface InPersonSigningSession {
    id: string;
    documentId: string;
    signerId: string;
    notaryId?: string;
    witnesses: WitnessInfo[];
    location: GeolocationData;
    deviceId: string;
    photos?: Buffer[];
    fingerprints?: BiometricCaptureResult[];
    idScans?: Buffer[];
    timestamp: Date;
    completed: boolean;
}
/**
 * Signature pad configuration
 */
export interface SignaturePadConfig {
    padType: SignaturePadType;
    captureVelocity: boolean;
    capturePressure: boolean;
    captureTimestamp: boolean;
    sampleRate?: number;
    minPoints?: number;
    maxPoints?: number;
    biometricData?: boolean;
}
/**
 * Signature pad capture result
 */
export interface SignaturePadCaptureResult {
    points: Array<{
        x: number;
        y: number;
        pressure?: number;
        velocity?: number;
        timestamp?: number;
    }>;
    duration: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    imageData: Buffer;
    biometricData?: {
        averagePressure: number;
        averageVelocity: number;
        accelerationPattern: number[];
        uniquenessScore: number;
    };
}
/**
 * Voice signature configuration
 */
export interface VoiceSignatureConfig {
    language?: string;
    passphrase?: string;
    duration?: number;
    sampleRate?: number;
    channels?: number;
    antiReplay?: boolean;
    livenessDetection?: boolean;
}
/**
 * Voice signature result
 */
export interface VoiceSignatureResult {
    voicePrint: Buffer;
    transcription?: string;
    confidence: number;
    livenessScore?: number;
    replayDetected?: boolean;
    audioQuality: number;
    duration: number;
    features: {
        pitch: number[];
        formants: number[];
        mfcc: number[];
        spectralFeatures: number[];
    };
}
/**
 * FIDO2/WebAuthn configuration
 */
export interface FIDO2Config {
    rpName: string;
    rpId: string;
    origin: string;
    attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
    authenticatorSelection?: {
        authenticatorAttachment?: 'platform' | 'cross-platform';
        requireResidentKey?: boolean;
        userVerification?: 'required' | 'preferred' | 'discouraged';
    };
    timeout?: number;
}
/**
 * FIDO2 registration result
 */
export interface FIDO2RegistrationResult {
    credentialId: string;
    publicKey: Buffer;
    counter: number;
    attestationObject?: Buffer;
    authenticatorType: AuthenticatorType;
    transports?: string[];
    aaguid?: string;
}
/**
 * FIDO2 authentication result
 */
export interface FIDO2AuthenticationResult {
    verified: boolean;
    credentialId: string;
    counter: number;
    userHandle?: string;
    authenticatorData?: Buffer;
    signature?: Buffer;
}
/**
 * Geolocation data
 */
export interface GeolocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
    timestamp: Date;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
    };
}
/**
 * Multi-factor authentication result
 */
export interface MFAResult {
    factors: Array<{
        type: 'biometric' | 'fido2' | 'sms' | 'email' | 'totp' | 'voice';
        verified: boolean;
        timestamp: Date;
        confidence?: number;
    }>;
    overallConfidence: number;
    riskScore: number;
    passed: boolean;
}
/**
 * Signature compliance metadata
 */
export interface SignatureComplianceMetadata {
    regulation: '21CFR11' | 'HIPAA' | 'eIDAS' | 'ESIGN' | 'UETA';
    complianceLevel: 'basic' | 'advanced' | 'qualified';
    authenticationFactors: number;
    biometricFactors: number;
    witnessCount: number;
    notarized: boolean;
    videoRecorded: boolean;
    timestamped: boolean;
    auditTrailComplete: boolean;
}
/**
 * Biometric signature model attributes
 */
export interface BiometricSignatureAttributes {
    id: string;
    documentId: string;
    signerId: string;
    signerName: string;
    biometricType: BiometricType;
    template: Buffer;
    quality: number;
    confidence: number;
    livenessScore?: number;
    antiSpoofingPassed: boolean;
    deviceId: string;
    sensorType: string;
    algorithm: string;
    imageData?: Buffer;
    metadata?: Record<string, any>;
    capturedAt: Date;
    verified: boolean;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Video signature model attributes
 */
export interface VideoSignatureAttributes {
    id: string;
    documentId: string;
    signerId: string;
    signerName: string;
    status: VideoSigningStatus;
    recordingUrl?: string;
    recordingDuration?: number;
    recordingHash?: string;
    livenessResults?: Record<string, any>[];
    idVerificationResult?: Record<string, any>;
    witnessIds?: string[];
    startedAt: Date;
    completedAt?: Date;
    thumbnails?: string[];
    metadata?: Record<string, any>;
    complianceData?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Witness verification model attributes
 */
export interface WitnessVerificationAttributes {
    id: string;
    documentId: string;
    videoSignatureId?: string;
    witnessName: string;
    witnessEmail: string;
    witnessRole?: string;
    status: WitnessStatus;
    invitedAt: Date;
    joinedAt?: Date;
    attestedAt?: Date;
    verificationMethod?: string;
    idVerified: boolean;
    idVerificationData?: Record<string, any>;
    signature?: Buffer;
    ipAddress?: string;
    location?: Record<string, any>;
    deviceInfo?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates BiometricSignature model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BiometricSignatureAttributes>>} BiometricSignature model
 *
 * @example
 * ```typescript
 * const BiometricModel = createBiometricSignatureModel(sequelize);
 * const signature = await BiometricModel.create({
 *   documentId: 'doc-uuid',
 *   signerId: 'user-uuid',
 *   signerName: 'Dr. John Doe',
 *   biometricType: 'fingerprint',
 *   template: biometricTemplateBuffer,
 *   quality: 95,
 *   confidence: 98,
 *   capturedAt: new Date()
 * });
 * ```
 */
export declare const createBiometricSignatureModel: (sequelize: Sequelize) => any;
/**
 * Creates VideoSignature model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<VideoSignatureAttributes>>} VideoSignature model
 *
 * @example
 * ```typescript
 * const VideoModel = createVideoSignatureModel(sequelize);
 * const videoSig = await VideoModel.create({
 *   documentId: 'doc-uuid',
 *   signerId: 'user-uuid',
 *   signerName: 'Dr. Jane Smith',
 *   status: 'recording',
 *   startedAt: new Date()
 * });
 * ```
 */
export declare const createVideoSignatureModel: (sequelize: Sequelize) => any;
/**
 * Creates WitnessVerification model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WitnessVerificationAttributes>>} WitnessVerification model
 *
 * @example
 * ```typescript
 * const WitnessModel = createWitnessVerificationModel(sequelize);
 * const witness = await WitnessModel.create({
 *   documentId: 'doc-uuid',
 *   witnessName: 'Mary Johnson',
 *   witnessEmail: 'mary@example.com',
 *   status: 'invited',
 *   invitedAt: new Date()
 * });
 * ```
 */
export declare const createWitnessVerificationModel: (sequelize: Sequelize) => any;
/**
 * 1. Captures fingerprint biometric signature.
 *
 * @param {string} userId - User ID providing fingerprint
 * @param {BiometricSignatureConfig} config - Biometric configuration
 * @returns {Promise<BiometricCaptureResult>} Fingerprint capture result
 *
 * @example
 * ```typescript
 * const fingerprint = await captureFingerprintSignature('user-123', {
 *   type: 'fingerprint',
 *   qualityThreshold: 80,
 *   antiSpoofing: true,
 *   livenessDetection: true
 * });
 * console.log('Quality:', fingerprint.quality);
 * ```
 */
export declare const captureFingerprintSignature: (userId: string, config: BiometricSignatureConfig) => Promise<BiometricCaptureResult>;
/**
 * 2. Captures facial recognition biometric signature.
 *
 * @param {Buffer} imageData - Face image data
 * @param {FacialRecognitionConfig} config - Facial recognition configuration
 * @returns {Promise<FacialRecognitionResult>} Facial recognition result
 *
 * @example
 * ```typescript
 * const faceResult = await captureFacialSignature(faceImageBuffer, {
 *   landmarks: true,
 *   expressions: true,
 *   livenessDetection: 'active_blink',
 *   antiSpoofing: true
 * });
 * if (faceResult.livenessScore > 90) {
 *   console.log('Live face detected');
 * }
 * ```
 */
export declare const captureFacialSignature: (imageData: Buffer, config: FacialRecognitionConfig) => Promise<FacialRecognitionResult>;
/**
 * 3. Performs liveness detection on biometric capture.
 *
 * @param {Buffer} imageData - Biometric image data
 * @param {LivenessMethod} method - Liveness detection method
 * @returns {Promise<LivenessDetectionResult>} Liveness detection result
 *
 * @example
 * ```typescript
 * const liveness = await performLivenessDetection(faceImage, 'active_blink');
 * if (liveness.passed && liveness.confidence > 95) {
 *   console.log('Liveness confirmed');
 * }
 * ```
 */
export declare const performLivenessDetection: (imageData: Buffer, method: LivenessMethod) => Promise<LivenessDetectionResult>;
/**
 * 4. Verifies biometric signature against stored template.
 *
 * @param {Buffer} capturedTemplate - Newly captured biometric template
 * @param {Buffer} storedTemplate - Stored biometric template
 * @param {number} threshold - Match threshold (0-100)
 * @returns {Promise<{ matched: boolean; confidence: number }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyBiometricSignature(
 *   newFingerprint.template,
 *   storedFingerprint.template,
 *   85
 * );
 * console.log('Match confidence:', verification.confidence);
 * ```
 */
export declare const verifyBiometricSignature: (capturedTemplate: Buffer, storedTemplate: Buffer, threshold: number) => Promise<{
    matched: boolean;
    confidence: number;
}>;
/**
 * 5. Performs anti-spoofing detection on biometric capture.
 *
 * @param {BiometricCaptureResult} capture - Biometric capture result
 * @returns {Promise<{ genuine: boolean; spoofingScore: number; threats: string[] }>} Anti-spoofing result
 *
 * @example
 * ```typescript
 * const antiSpoof = await detectBiometricSpoofing(fingerprintCapture);
 * if (!antiSpoof.genuine) {
 *   console.error('Spoofing detected:', antiSpoof.threats);
 * }
 * ```
 */
export declare const detectBiometricSpoofing: (capture: BiometricCaptureResult) => Promise<{
    genuine: boolean;
    spoofingScore: number;
    threats: string[];
}>;
/**
 * 6. Extracts biometric features for signature matching.
 *
 * @param {Buffer} biometricData - Raw biometric data
 * @param {BiometricType} type - Biometric type
 * @returns {Promise<number[]>} Feature vector
 *
 * @example
 * ```typescript
 * const features = await extractBiometricFeatures(fingerprintImage, 'fingerprint');
 * // Store features for matching
 * ```
 */
export declare const extractBiometricFeatures: (biometricData: Buffer, type: BiometricType) => Promise<number[]>;
/**
 * 7. Encrypts biometric template for secure storage.
 *
 * @param {Buffer} template - Biometric template
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<Buffer>} Encrypted template
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBiometricTemplate(
 *   fingerprintTemplate,
 *   process.env.BIOMETRIC_KEY
 * );
 * await saveBiometricToDatabase(encrypted);
 * ```
 */
export declare const encryptBiometricTemplate: (template: Buffer, encryptionKey: string) => Promise<Buffer>;
/**
 * 8. Calculates biometric signature quality score.
 *
 * @param {BiometricCaptureResult} capture - Biometric capture result
 * @returns {number} Quality score (0-100)
 *
 * @example
 * ```typescript
 * const quality = calculateBiometricQuality(fingerprintCapture);
 * if (quality < 80) {
 *   console.log('Please recapture - quality too low');
 * }
 * ```
 */
export declare const calculateBiometricQuality: (capture: BiometricCaptureResult) => number;
/**
 * 9. Initiates video signing session.
 *
 * @param {string} documentId - Document ID to sign
 * @param {string} signerId - User ID of signer
 * @param {VideoSigningConfig} config - Video signing configuration
 * @returns {Promise<VideoSigningSession>} Video signing session
 *
 * @example
 * ```typescript
 * const session = await initiateVideoSigningSession('doc-123', 'user-456', {
 *   recordingRequired: true,
 *   livenessDetection: ['active_blink', 'active_smile'],
 *   witnessRequired: true,
 *   witnessCount: 2,
 *   requireIdVerification: true
 * });
 * console.log('Session ID:', session.id);
 * ```
 */
export declare const initiateVideoSigningSession: (documentId: string, signerId: string, config: VideoSigningConfig) => Promise<VideoSigningSession>;
/**
 * 10. Records video signing session.
 *
 * @param {string} sessionId - Video signing session ID
 * @param {MediaStream} stream - Media stream to record
 * @param {number} duration - Recording duration in seconds
 * @returns {Promise<{ recordingUrl: string; thumbnails: string[]; hash: string }>} Recording result
 *
 * @example
 * ```typescript
 * const recording = await recordVideoSigningSession(
 *   session.id,
 *   mediaStream,
 *   120 // 2 minutes
 * );
 * console.log('Recording URL:', recording.recordingUrl);
 * ```
 */
export declare const recordVideoSigningSession: (sessionId: string, stream: any, // MediaStream type
duration: number) => Promise<{
    recordingUrl: string;
    thumbnails: string[];
    hash: string;
}>;
/**
 * 11. Performs multi-factor liveness detection during video signing.
 *
 * @param {string} sessionId - Video signing session ID
 * @param {LivenessMethod[]} methods - Liveness detection methods to use
 * @returns {Promise<LivenessDetectionResult[]>} Array of liveness results
 *
 * @example
 * ```typescript
 * const livenessResults = await performMultiFactorLiveness(session.id, [
 *   'passive',
 *   'active_blink',
 *   'active_head_turn'
 * ]);
 * const allPassed = livenessResults.every(r => r.passed);
 * ```
 */
export declare const performMultiFactorLiveness: (sessionId: string, methods: LivenessMethod[]) => Promise<LivenessDetectionResult[]>;
/**
 * 12. Verifies identity document during video signing.
 *
 * @param {Buffer} documentImage - ID document image
 * @param {Buffer} selfieImage - Selfie image for comparison
 * @returns {Promise<IDVerificationResult>} ID verification result
 *
 * @example
 * ```typescript
 * const idVerification = await verifyIdentityDocument(
 *   driversLicenseImage,
 *   selfieImage
 * );
 * if (idVerification.verified && idVerification.matchScore > 90) {
 *   console.log('Identity verified');
 * }
 * ```
 */
export declare const verifyIdentityDocument: (documentImage: Buffer, selfieImage: Buffer) => Promise<IDVerificationResult>;
/**
 * 13. Generates video signing audit trail.
 *
 * @param {VideoSigningSession} session - Video signing session
 * @returns {Promise<string>} Audit trail JSON
 *
 * @example
 * ```typescript
 * const auditTrail = await generateVideoSigningAuditTrail(session);
 * await saveAuditTrail(session.id, auditTrail);
 * ```
 */
export declare const generateVideoSigningAuditTrail: (session: VideoSigningSession) => Promise<string>;
/**
 * 14. Encrypts video signing recording.
 *
 * @param {Buffer} videoData - Video recording data
 * @param {string} encryptionKey - Encryption key
 * @returns {Promise<Buffer>} Encrypted video data
 *
 * @example
 * ```typescript
 * const encrypted = await encryptVideoRecording(
 *   videoBuffer,
 *   process.env.VIDEO_ENCRYPTION_KEY
 * );
 * await uploadToSecureStorage(encrypted);
 * ```
 */
export declare const encryptVideoRecording: (videoData: Buffer, encryptionKey: string) => Promise<Buffer>;
/**
 * 15. Validates video signing session compliance.
 *
 * @param {VideoSigningSession} session - Video signing session
 * @param {VideoSigningConfig} config - Video signing configuration
 * @returns {{ compliant: boolean; issues: string[] }} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = validateVideoSigningCompliance(session, config);
 * if (!compliance.compliant) {
 *   console.error('Compliance issues:', compliance.issues);
 * }
 * ```
 */
export declare const validateVideoSigningCompliance: (session: VideoSigningSession, config: VideoSigningConfig) => {
    compliant: boolean;
    issues: string[];
};
/**
 * 16. Generates video thumbnails for signing session.
 *
 * @param {string} videoUrl - Video recording URL
 * @param {number} count - Number of thumbnails to generate
 * @returns {Promise<string[]>} Array of thumbnail URLs
 *
 * @example
 * ```typescript
 * const thumbnails = await generateVideoThumbnails(session.recordingUrl, 3);
 * await saveSessionThumbnails(session.id, thumbnails);
 * ```
 */
export declare const generateVideoThumbnails: (videoUrl: string, count: number) => Promise<string[]>;
/**
 * 17. Invites witness to signing session.
 *
 * @param {string} documentId - Document ID
 * @param {WitnessInfo} witnessInfo - Witness information
 * @returns {Promise<WitnessInfo>} Updated witness info with invitation details
 *
 * @example
 * ```typescript
 * const witness = await inviteWitness('doc-123', {
 *   id: 'witness-001',
 *   name: 'Mary Johnson',
 *   email: 'mary@example.com',
 *   role: 'Notary Public',
 *   status: 'pending'
 * });
 * ```
 */
export declare const inviteWitness: (documentId: string, witnessInfo: Partial<WitnessInfo>) => Promise<WitnessInfo>;
/**
 * 18. Verifies witness identity.
 *
 * @param {string} witnessId - Witness ID
 * @param {IDVerificationResult} idVerification - ID verification result
 * @returns {Promise<WitnessInfo>} Updated witness info
 *
 * @example
 * ```typescript
 * const verifiedWitness = await verifyWitnessIdentity(
 *   witness.id,
 *   idVerificationResult
 * );
 * if (verifiedWitness.idVerified) {
 *   console.log('Witness identity verified');
 * }
 * ```
 */
export declare const verifyWitnessIdentity: (witnessId: string, idVerification: IDVerificationResult) => Promise<WitnessInfo>;
/**
 * 19. Captures witness attestation.
 *
 * @param {string} witnessId - Witness ID
 * @param {string} documentId - Document ID
 * @param {Buffer} signature - Witness signature
 * @returns {Promise<WitnessInfo>} Updated witness info with attestation
 *
 * @example
 * ```typescript
 * const attestedWitness = await captureWitnessAttestation(
 *   witness.id,
 *   'doc-123',
 *   witnessSignatureBuffer
 * );
 * console.log('Attested at:', attestedWitness.attestedAt);
 * ```
 */
export declare const captureWitnessAttestation: (witnessId: string, documentId: string, signature: Buffer) => Promise<WitnessInfo>;
/**
 * 20. Validates witness eligibility for jurisdiction.
 *
 * @param {WitnessInfo} witness - Witness information
 * @param {string} jurisdiction - Legal jurisdiction code (e.g., 'CA', 'NY')
 * @returns {Promise<{ eligible: boolean; reasons?: string[] }>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateWitnessEligibility(witness, 'CA');
 * if (!eligibility.eligible) {
 *   console.error('Witness not eligible:', eligibility.reasons);
 * }
 * ```
 */
export declare const validateWitnessEligibility: (witness: WitnessInfo, jurisdiction: string) => Promise<{
    eligible: boolean;
    reasons?: string[];
}>;
/**
 * 21. Tracks witness location during signing.
 *
 * @param {string} witnessId - Witness ID
 * @param {GeolocationData} location - Geolocation data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackWitnessLocation(witness.id, {
 *   latitude: 37.7749,
 *   longitude: -122.4194,
 *   timestamp: new Date(),
 *   address: {
 *     city: 'San Francisco',
 *     state: 'CA',
 *     country: 'USA'
 *   }
 * });
 * ```
 */
export declare const trackWitnessLocation: (witnessId: string, location: GeolocationData) => Promise<void>;
/**
 * 22. Generates witness certificate.
 *
 * @param {WitnessInfo} witness - Witness information
 * @param {string} documentId - Document ID
 * @returns {Promise<Buffer>} Witness certificate PDF
 *
 * @example
 * ```typescript
 * const certificate = await generateWitnessCertificate(witness, 'doc-123');
 * await saveCertificate(certificate);
 * ```
 */
export declare const generateWitnessCertificate: (witness: WitnessInfo, documentId: string) => Promise<Buffer>;
/**
 * 23. Validates multi-witness consensus.
 *
 * @param {WitnessInfo[]} witnesses - Array of witnesses
 * @param {number} requiredCount - Required number of witnesses
 * @returns {{ valid: boolean; attestedCount: number; issues?: string[] }} Consensus result
 *
 * @example
 * ```typescript
 * const consensus = validateWitnessConsensus(witnesses, 2);
 * if (consensus.valid) {
 *   console.log('Required witnesses attested');
 * }
 * ```
 */
export declare const validateWitnessConsensus: (witnesses: WitnessInfo[], requiredCount: number) => {
    valid: boolean;
    attestedCount: number;
    issues?: string[];
};
/**
 * 24. Initiates in-person signing session.
 *
 * @param {string} documentId - Document ID
 * @param {string} signerId - Signer user ID
 * @param {InPersonSigningConfig} config - In-person signing configuration
 * @returns {Promise<InPersonSigningSession>} In-person signing session
 *
 * @example
 * ```typescript
 * const session = await initiateInPersonSigning('doc-123', 'user-456', {
 *   requireNotary: true,
 *   requireWitnesses: true,
 *   witnessCount: 2,
 *   capturePhoto: true,
 *   captureFingerprint: true,
 *   requireIdScan: true,
 *   locationVerification: true
 * });
 * ```
 */
export declare const initiateInPersonSigning: (documentId: string, signerId: string, config: InPersonSigningConfig) => Promise<InPersonSigningSession>;
/**
 * 25. Captures photo during in-person signing.
 *
 * @param {string} sessionId - In-person signing session ID
 * @param {Buffer} photoData - Photo data
 * @returns {Promise<string>} Photo URL
 *
 * @example
 * ```typescript
 * const photoUrl = await captureInPersonPhoto(session.id, photoBuffer);
 * await updateSession(session.id, { photos: [photoUrl] });
 * ```
 */
export declare const captureInPersonPhoto: (sessionId: string, photoData: Buffer) => Promise<string>;
/**
 * 26. Scans ID document during in-person signing.
 *
 * @param {Buffer} idDocumentImage - ID document image
 * @returns {Promise<IDVerificationResult>} ID scan result
 *
 * @example
 * ```typescript
 * const idScan = await scanIDDocument(idCardImage);
 * if (idScan.verified) {
 *   console.log('ID scanned:', idScan.documentNumber);
 * }
 * ```
 */
export declare const scanIDDocument: (idDocumentImage: Buffer) => Promise<IDVerificationResult>;
/**
 * 27. Verifies location for in-person signing.
 *
 * @param {GeolocationData} location - Current location
 * @param {GeolocationData[]} allowedLocations - List of allowed locations
 * @param {number} radiusMeters - Allowed radius in meters
 * @returns {{ verified: boolean; distance?: number }} Location verification result
 *
 * @example
 * ```typescript
 * const locationCheck = verifyInPersonLocation(
 *   currentLocation,
 *   [officeLocation],
 *   100 // 100 meters radius
 * );
 * ```
 */
export declare const verifyInPersonLocation: (location: GeolocationData, allowedLocations: GeolocationData[], radiusMeters: number) => {
    verified: boolean;
    distance?: number;
};
/**
 * 28. Binds signing session to device.
 *
 * @param {string} sessionId - Session ID
 * @param {string} deviceId - Device identifier
 * @returns {Promise<{ bound: boolean; deviceFingerprint: string }>} Device binding result
 *
 * @example
 * ```typescript
 * const binding = await bindSessionToDevice(session.id, deviceId);
 * console.log('Device fingerprint:', binding.deviceFingerprint);
 * ```
 */
export declare const bindSessionToDevice: (sessionId: string, deviceId: string) => Promise<{
    bound: boolean;
    deviceFingerprint: string;
}>;
/**
 * 29. Validates notary credentials.
 *
 * @param {string} notaryId - Notary user ID
 * @param {string} jurisdiction - Jurisdiction code
 * @returns {Promise<{ valid: boolean; commission: string; expiryDate: Date }>} Notary validation
 *
 * @example
 * ```typescript
 * const notary = await validateNotaryCredentials('notary-123', 'CA');
 * if (notary.valid) {
 *   console.log('Commission expires:', notary.expiryDate);
 * }
 * ```
 */
export declare const validateNotaryCredentials: (notaryId: string, jurisdiction: string) => Promise<{
    valid: boolean;
    commission: string;
    expiryDate: Date;
}>;
/**
 * 30. Completes in-person signing session.
 *
 * @param {InPersonSigningSession} session - In-person signing session
 * @returns {Promise<{ completed: boolean; certificateId: string }>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeInPersonSigning(session);
 * console.log('Certificate ID:', result.certificateId);
 * ```
 */
export declare const completeInPersonSigning: (session: InPersonSigningSession) => Promise<{
    completed: boolean;
    certificateId: string;
}>;
/**
 * 31. Captures signature from signature pad.
 *
 * @param {SignaturePadConfig} config - Signature pad configuration
 * @returns {Promise<SignaturePadCaptureResult>} Signature pad capture result
 *
 * @example
 * ```typescript
 * const signature = await captureSignaturePadData({
 *   padType: 'capacitive',
 *   captureVelocity: true,
 *   capturePressure: true,
 *   biometricData: true
 * });
 * console.log('Signature captured with', signature.points.length, 'points');
 * ```
 */
export declare const captureSignaturePadData: (config: SignaturePadConfig) => Promise<SignaturePadCaptureResult>;
/**
 * 32. Analyzes signature pad biometrics.
 *
 * @param {SignaturePadCaptureResult} capture - Signature pad capture
 * @returns {{ uniqueness: number; consistency: number; genuine: boolean }} Biometric analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeSignaturePadBiometrics(signatureCapture);
 * if (analysis.genuine && analysis.uniqueness > 90) {
 *   console.log('High-quality signature');
 * }
 * ```
 */
export declare const analyzeSignaturePadBiometrics: (capture: SignaturePadCaptureResult) => {
    uniqueness: number;
    consistency: number;
    genuine: boolean;
};
/**
 * 33. Converts signature pad data to image.
 *
 * @param {SignaturePadCaptureResult} capture - Signature pad capture
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Buffer>} Signature image (PNG)
 *
 * @example
 * ```typescript
 * const signatureImage = await convertSignatureToImage(capture, 400, 150);
 * await saveSignatureImage(signatureImage);
 * ```
 */
export declare const convertSignatureToImage: (capture: SignaturePadCaptureResult, width: number, height: number) => Promise<Buffer>;
/**
 * 34. Compares two signature pad captures.
 *
 * @param {SignaturePadCaptureResult} signature1 - First signature
 * @param {SignaturePadCaptureResult} signature2 - Second signature
 * @returns {{ similarity: number; matched: boolean }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareSignaturePadCaptures(
 *   enrollmentSignature,
 *   verificationSignature
 * );
 * if (comparison.matched) {
 *   console.log('Signatures match with', comparison.similarity, '% similarity');
 * }
 * ```
 */
export declare const compareSignaturePadCaptures: (signature1: SignaturePadCaptureResult, signature2: SignaturePadCaptureResult) => {
    similarity: number;
    matched: boolean;
};
/**
 * 35. Validates signature pad capture quality.
 *
 * @param {SignaturePadCaptureResult} capture - Signature pad capture
 * @returns {{ valid: boolean; quality: number; issues?: string[] }} Quality validation
 *
 * @example
 * ```typescript
 * const validation = validateSignaturePadQuality(capture);
 * if (!validation.valid) {
 *   console.error('Quality issues:', validation.issues);
 * }
 * ```
 */
export declare const validateSignaturePadQuality: (capture: SignaturePadCaptureResult) => {
    valid: boolean;
    quality: number;
    issues?: string[];
};
/**
 * 36. Extracts signature pad metadata for compliance.
 *
 * @param {SignaturePadCaptureResult} capture - Signature pad capture
 * @param {SignaturePadConfig} config - Configuration used
 * @returns {Record<string, any>} Compliance metadata
 *
 * @example
 * ```typescript
 * const metadata = extractSignaturePadMetadata(capture, config);
 * await saveComplianceMetadata(metadata);
 * ```
 */
export declare const extractSignaturePadMetadata: (capture: SignaturePadCaptureResult, config: SignaturePadConfig) => Record<string, any>;
/**
 * 37. Captures voice signature.
 *
 * @param {Buffer} audioData - Audio recording data
 * @param {VoiceSignatureConfig} config - Voice signature configuration
 * @returns {Promise<VoiceSignatureResult>} Voice signature result
 *
 * @example
 * ```typescript
 * const voiceSig = await captureVoiceSignature(audioBuffer, {
 *   language: 'en-US',
 *   passphrase: 'I agree to the terms',
 *   duration: 5,
 *   antiReplay: true,
 *   livenessDetection: true
 * });
 * console.log('Transcription:', voiceSig.transcription);
 * ```
 */
export declare const captureVoiceSignature: (audioData: Buffer, config: VoiceSignatureConfig) => Promise<VoiceSignatureResult>;
/**
 * 38. Verifies voice signature against stored voiceprint.
 *
 * @param {Buffer} capturedVoicePrint - Newly captured voiceprint
 * @param {Buffer} storedVoicePrint - Stored voiceprint
 * @returns {Promise<{ matched: boolean; confidence: number }>} Voice verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyVoiceSignature(
 *   newVoiceSig.voicePrint,
 *   storedVoicePrint
 * );
 * if (verification.matched) {
 *   console.log('Voice verified with', verification.confidence, '% confidence');
 * }
 * ```
 */
export declare const verifyVoiceSignature: (capturedVoicePrint: Buffer, storedVoicePrint: Buffer) => Promise<{
    matched: boolean;
    confidence: number;
}>;
/**
 * 39. Detects voice replay attacks.
 *
 * @param {Buffer} audioData - Audio recording data
 * @returns {Promise<{ genuine: boolean; replayScore: number }>} Replay detection result
 *
 * @example
 * ```typescript
 * const replayCheck = await detectVoiceReplay(audioBuffer);
 * if (!replayCheck.genuine) {
 *   console.error('Replay attack detected!');
 * }
 * ```
 */
export declare const detectVoiceReplay: (audioData: Buffer) => Promise<{
    genuine: boolean;
    replayScore: number;
}>;
/**
 * 40. Analyzes voice quality for signature.
 *
 * @param {Buffer} audioData - Audio recording data
 * @returns {{ quality: number; snr: number; clipping: boolean }} Quality analysis
 *
 * @example
 * ```typescript
 * const quality = analyzeVoiceQuality(audioBuffer);
 * if (quality.quality < 70) {
 *   console.log('Please record in a quieter environment');
 * }
 * ```
 */
export declare const analyzeVoiceQuality: (audioData: Buffer) => {
    quality: number;
    snr: number;
    clipping: boolean;
};
/**
 * 41. Transcribes voice signature content.
 *
 * @param {Buffer} audioData - Audio recording data
 * @param {string} language - Language code (e.g., 'en-US')
 * @returns {Promise<{ transcription: string; confidence: number }>} Transcription result
 *
 * @example
 * ```typescript
 * const transcription = await transcribeVoiceSignature(audioBuffer, 'en-US');
 * console.log('User said:', transcription.transcription);
 * ```
 */
export declare const transcribeVoiceSignature: (audioData: Buffer, language: string) => Promise<{
    transcription: string;
    confidence: number;
}>;
/**
 * 42. Validates voice passphrase match.
 *
 * @param {string} transcription - Transcribed text
 * @param {string} expectedPassphrase - Expected passphrase
 * @returns {{ matched: boolean; similarity: number }} Passphrase validation
 *
 * @example
 * ```typescript
 * const validation = validateVoicePassphrase(
 *   transcription,
 *   'I agree to the terms and conditions'
 * );
 * ```
 */
export declare const validateVoicePassphrase: (transcription: string, expectedPassphrase: string) => {
    matched: boolean;
    similarity: number;
};
/**
 * 43. Generates FIDO2 registration challenge.
 *
 * @param {string} userId - User ID
 * @param {FIDO2Config} config - FIDO2 configuration
 * @returns {Promise<{ challenge: string; options: any }>} Registration challenge
 *
 * @example
 * ```typescript
 * const registration = await generateFIDO2Registration('user-123', {
 *   rpName: 'WhiteCross Healthcare',
 *   rpId: 'whitecross.com',
 *   origin: 'https://whitecross.com'
 * });
 * // Send options to client for navigator.credentials.create()
 * ```
 */
export declare const generateFIDO2Registration: (userId: string, config: FIDO2Config) => Promise<{
    challenge: string;
    options: any;
}>;
/**
 * 44. Verifies FIDO2 registration response.
 *
 * @param {any} registrationResponse - Registration response from client
 * @param {string} expectedChallenge - Expected challenge
 * @returns {Promise<FIDO2RegistrationResult>} Registration verification result
 *
 * @example
 * ```typescript
 * const result = await verifyFIDO2Registration(
 *   clientRegistrationResponse,
 *   challenge
 * );
 * // Store result.credentialId and result.publicKey
 * ```
 */
export declare const verifyFIDO2Registration: (registrationResponse: any, expectedChallenge: string) => Promise<FIDO2RegistrationResult>;
/**
 * 45. Generates FIDO2 authentication challenge.
 *
 * @param {string} userId - User ID
 * @param {FIDO2Config} config - FIDO2 configuration
 * @returns {Promise<{ challenge: string; options: any }>} Authentication challenge
 *
 * @example
 * ```typescript
 * const auth = await generateFIDO2Authentication('user-123', config);
 * // Send options to client for navigator.credentials.get()
 * ```
 */
export declare const generateFIDO2Authentication: (userId: string, config: FIDO2Config) => Promise<{
    challenge: string;
    options: any;
}>;
/**
 * 46. Verifies FIDO2 authentication response.
 *
 * @param {any} authResponse - Authentication response from client
 * @param {Buffer} storedPublicKey - Stored public key for credential
 * @param {string} expectedChallenge - Expected challenge
 * @returns {Promise<FIDO2AuthenticationResult>} Authentication verification result
 *
 * @example
 * ```typescript
 * const authResult = await verifyFIDO2Authentication(
 *   clientAuthResponse,
 *   userPublicKey,
 *   challenge
 * );
 * if (authResult.verified) {
 *   console.log('User authenticated with FIDO2');
 * }
 * ```
 */
export declare const verifyFIDO2Authentication: (authResponse: any, storedPublicKey: Buffer, expectedChallenge: string) => Promise<FIDO2AuthenticationResult>;
/**
 * 47. Performs multi-factor authentication combining biometric and FIDO2.
 *
 * @param {string} userId - User ID
 * @param {BiometricCaptureResult} biometric - Biometric capture
 * @param {FIDO2AuthenticationResult} fido2 - FIDO2 authentication result
 * @returns {Promise<MFAResult>} Multi-factor authentication result
 *
 * @example
 * ```typescript
 * const mfaResult = await performMultiFactorAuthentication(
 *   'user-123',
 *   fingerprintCapture,
 *   fido2AuthResult
 * );
 * if (mfaResult.passed && mfaResult.overallConfidence > 95) {
 *   console.log('High-security authentication passed');
 * }
 * ```
 */
export declare const performMultiFactorAuthentication: (userId: string, biometric: BiometricCaptureResult, fido2: FIDO2AuthenticationResult) => Promise<MFAResult>;
/**
 * 48. Generates signature compliance metadata for advanced e-signatures.
 *
 * @param {object} signatureData - Signature data including all authentication factors
 * @returns {SignatureComplianceMetadata} Compliance metadata
 *
 * @example
 * ```typescript
 * const compliance = generateAdvancedSignatureCompliance({
 *   biometric: fingerprintCapture,
 *   video: videoSession,
 *   witnesses: witnessArray,
 *   fido2: fido2Auth,
 *   notarized: true
 * });
 * console.log('Compliance level:', compliance.complianceLevel);
 * console.log('Authentication factors:', compliance.authenticationFactors);
 * ```
 */
export declare const generateAdvancedSignatureCompliance: (signatureData: {
    biometric?: BiometricCaptureResult;
    video?: VideoSigningSession;
    witnesses?: WitnessInfo[];
    fido2?: FIDO2AuthenticationResult;
    notarized?: boolean;
}) => SignatureComplianceMetadata;
declare const _default: {
    createBiometricSignatureModel: (sequelize: Sequelize) => any;
    createVideoSignatureModel: (sequelize: Sequelize) => any;
    createWitnessVerificationModel: (sequelize: Sequelize) => any;
    captureFingerprintSignature: (userId: string, config: BiometricSignatureConfig) => Promise<BiometricCaptureResult>;
    captureFacialSignature: (imageData: Buffer, config: FacialRecognitionConfig) => Promise<FacialRecognitionResult>;
    performLivenessDetection: (imageData: Buffer, method: LivenessMethod) => Promise<LivenessDetectionResult>;
    verifyBiometricSignature: (capturedTemplate: Buffer, storedTemplate: Buffer, threshold: number) => Promise<{
        matched: boolean;
        confidence: number;
    }>;
    detectBiometricSpoofing: (capture: BiometricCaptureResult) => Promise<{
        genuine: boolean;
        spoofingScore: number;
        threats: string[];
    }>;
    extractBiometricFeatures: (biometricData: Buffer, type: BiometricType) => Promise<number[]>;
    encryptBiometricTemplate: (template: Buffer, encryptionKey: string) => Promise<Buffer>;
    calculateBiometricQuality: (capture: BiometricCaptureResult) => number;
    initiateVideoSigningSession: (documentId: string, signerId: string, config: VideoSigningConfig) => Promise<VideoSigningSession>;
    recordVideoSigningSession: (sessionId: string, stream: any, duration: number) => Promise<{
        recordingUrl: string;
        thumbnails: string[];
        hash: string;
    }>;
    performMultiFactorLiveness: (sessionId: string, methods: LivenessMethod[]) => Promise<LivenessDetectionResult[]>;
    verifyIdentityDocument: (documentImage: Buffer, selfieImage: Buffer) => Promise<IDVerificationResult>;
    generateVideoSigningAuditTrail: (session: VideoSigningSession) => Promise<string>;
    encryptVideoRecording: (videoData: Buffer, encryptionKey: string) => Promise<Buffer>;
    validateVideoSigningCompliance: (session: VideoSigningSession, config: VideoSigningConfig) => {
        compliant: boolean;
        issues: string[];
    };
    generateVideoThumbnails: (videoUrl: string, count: number) => Promise<string[]>;
    inviteWitness: (documentId: string, witnessInfo: Partial<WitnessInfo>) => Promise<WitnessInfo>;
    verifyWitnessIdentity: (witnessId: string, idVerification: IDVerificationResult) => Promise<WitnessInfo>;
    captureWitnessAttestation: (witnessId: string, documentId: string, signature: Buffer) => Promise<WitnessInfo>;
    validateWitnessEligibility: (witness: WitnessInfo, jurisdiction: string) => Promise<{
        eligible: boolean;
        reasons?: string[];
    }>;
    trackWitnessLocation: (witnessId: string, location: GeolocationData) => Promise<void>;
    generateWitnessCertificate: (witness: WitnessInfo, documentId: string) => Promise<Buffer>;
    validateWitnessConsensus: (witnesses: WitnessInfo[], requiredCount: number) => {
        valid: boolean;
        attestedCount: number;
        issues?: string[];
    };
    initiateInPersonSigning: (documentId: string, signerId: string, config: InPersonSigningConfig) => Promise<InPersonSigningSession>;
    captureInPersonPhoto: (sessionId: string, photoData: Buffer) => Promise<string>;
    scanIDDocument: (idDocumentImage: Buffer) => Promise<IDVerificationResult>;
    verifyInPersonLocation: (location: GeolocationData, allowedLocations: GeolocationData[], radiusMeters: number) => {
        verified: boolean;
        distance?: number;
    };
    bindSessionToDevice: (sessionId: string, deviceId: string) => Promise<{
        bound: boolean;
        deviceFingerprint: string;
    }>;
    validateNotaryCredentials: (notaryId: string, jurisdiction: string) => Promise<{
        valid: boolean;
        commission: string;
        expiryDate: Date;
    }>;
    completeInPersonSigning: (session: InPersonSigningSession) => Promise<{
        completed: boolean;
        certificateId: string;
    }>;
    captureSignaturePadData: (config: SignaturePadConfig) => Promise<SignaturePadCaptureResult>;
    analyzeSignaturePadBiometrics: (capture: SignaturePadCaptureResult) => {
        uniqueness: number;
        consistency: number;
        genuine: boolean;
    };
    convertSignatureToImage: (capture: SignaturePadCaptureResult, width: number, height: number) => Promise<Buffer>;
    compareSignaturePadCaptures: (signature1: SignaturePadCaptureResult, signature2: SignaturePadCaptureResult) => {
        similarity: number;
        matched: boolean;
    };
    validateSignaturePadQuality: (capture: SignaturePadCaptureResult) => {
        valid: boolean;
        quality: number;
        issues?: string[];
    };
    extractSignaturePadMetadata: (capture: SignaturePadCaptureResult, config: SignaturePadConfig) => Record<string, any>;
    captureVoiceSignature: (audioData: Buffer, config: VoiceSignatureConfig) => Promise<VoiceSignatureResult>;
    verifyVoiceSignature: (capturedVoicePrint: Buffer, storedVoicePrint: Buffer) => Promise<{
        matched: boolean;
        confidence: number;
    }>;
    detectVoiceReplay: (audioData: Buffer) => Promise<{
        genuine: boolean;
        replayScore: number;
    }>;
    analyzeVoiceQuality: (audioData: Buffer) => {
        quality: number;
        snr: number;
        clipping: boolean;
    };
    transcribeVoiceSignature: (audioData: Buffer, language: string) => Promise<{
        transcription: string;
        confidence: number;
    }>;
    validateVoicePassphrase: (transcription: string, expectedPassphrase: string) => {
        matched: boolean;
        similarity: number;
    };
    generateFIDO2Registration: (userId: string, config: FIDO2Config) => Promise<{
        challenge: string;
        options: any;
    }>;
    verifyFIDO2Registration: (registrationResponse: any, expectedChallenge: string) => Promise<FIDO2RegistrationResult>;
    generateFIDO2Authentication: (userId: string, config: FIDO2Config) => Promise<{
        challenge: string;
        options: any;
    }>;
    verifyFIDO2Authentication: (authResponse: any, storedPublicKey: Buffer, expectedChallenge: string) => Promise<FIDO2AuthenticationResult>;
    performMultiFactorAuthentication: (userId: string, biometric: BiometricCaptureResult, fido2: FIDO2AuthenticationResult) => Promise<MFAResult>;
    generateAdvancedSignatureCompliance: (signatureData: {
        biometric?: BiometricCaptureResult;
        video?: VideoSigningSession;
        witnesses?: WitnessInfo[];
        fido2?: FIDO2AuthenticationResult;
        notarized?: boolean;
    }) => SignatureComplianceMetadata;
};
export default _default;
//# sourceMappingURL=document-esignature-advanced-kit.d.ts.map