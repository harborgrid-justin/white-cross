/**
 * LOC: EDU-CREDENTIAL-001
 * File: /reuse/education/credential-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend credential services
 *   - Digital badge issuance systems
 *   - Certificate generation modules
 *   - Blockchain verification services
 */
/**
 * File: /reuse/education/credential-management-kit.ts
 * Locator: WC-EDU-CREDENTIAL-001
 * Purpose: Enterprise-grade Credential Management - digital badges, certificates, verifiable credentials, blockchain, micro-credentials, accessibility
 *
 * Upstream: Independent utility module for credential operations
 * Downstream: ../backend/education/*, credential controllers, badge services, verification systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for credential operations for modern SIS platforms
 *
 * LLM Context: Comprehensive credential management utilities for production-ready education applications.
 * Provides digital badge issuance, certificate generation, credential verification, blockchain credentials,
 * micro-credentials, continuing education credits, professional certifications, credential sharing,
 * and full WCAG 2.1 AA accessibility compliance with keyboard navigation support.
 */
import { Sequelize, Transaction } from 'sequelize';
interface DigitalBadgeData {
    badgeName: string;
    badgeDescription: string;
    badgeCategory: 'academic' | 'skill' | 'achievement' | 'participation' | 'leadership' | 'service';
    badgeImageUrl: string;
    criteriaUrl?: string;
    issuerName: string;
    issuerId: string;
    evidenceUrl?: string;
    skills?: string[];
    alignmentTargets?: string[];
    version?: string;
}
interface CertificateData {
    studentId: string;
    certificateType: 'completion' | 'achievement' | 'participation' | 'excellence' | 'professional';
    certificateTitle: string;
    courseName?: string;
    courseCode?: string;
    issueDate: Date;
    signatories: Array<{
        name: string;
        title: string;
        signatureUrl?: string;
    }>;
    sealUrl?: string;
    templateId?: string;
    grade?: string;
    credits?: number;
}
interface CertificationData {
    certificationName: string;
    certificationBody: string;
    certificationLevel?: string;
    issueDate: Date;
    expirationDate?: Date;
    renewalRequired?: boolean;
    renewalPeriod?: number;
    prerequisites?: string[];
    competencies?: string[];
    verificationCode: string;
}
interface MicroCredentialData {
    microCredentialName: string;
    description: string;
    skillsAcquired: string[];
    competencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    assessmentMethod: string;
    durationHours: number;
    stackable?: boolean;
    pathwayId?: string;
    industryRecognition?: string[];
}
interface ContinuingEducationData {
    studentId: string;
    activityName: string;
    provider: string;
    completionDate: Date;
    creditType: 'CEU' | 'CME' | 'CPE' | 'PDH' | 'CLE' | 'other';
    creditHours: number;
    certificateNumber?: string;
    accreditationBody?: string;
    renewalCycle?: string;
}
/**
 * Sequelize model for Credentials with comprehensive tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     Credential:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         credentialType:
 *           type: string
 *           enum: [degree, certificate, badge, certification, micro_credential, continuing_education]
 *         credentialName:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Credential model
 *
 * @example
 * ```typescript
 * const Credential = createCredentialModel(sequelize);
 * const credential = await Credential.create({
 *   studentId: 'STU12345',
 *   credentialType: 'degree',
 *   credentialName: 'Bachelor of Science in Computer Science',
 *   issuingInstitution: 'University of Technology',
 *   issueDate: new Date(),
 *   credentialNumber: 'CRED-2024-001234'
 * });
 * ```
 */
export declare const createCredentialModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        credentialType: string;
        credentialName: string;
        issuingInstitution: string;
        issueDate: Date;
        expirationDate: Date | null;
        credentialNumber: string;
        verificationUrl: string;
        metadata: Record<string, any>;
        isRevoked: boolean;
        revokedDate: Date | null;
        revocationReason: string;
        blockchainHash: string;
        blockchainNetwork: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Digital Badges with Open Badges standard support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DigitalBadge model
 */
export declare const createDigitalBadgeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        credentialId: string;
        badgeName: string;
        badgeDescription: string;
        badgeCategory: string;
        badgeImageUrl: string;
        criteriaUrl: string;
        issuerName: string;
        issuerId: string;
        evidenceUrl: string;
        skills: string[];
        alignmentTargets: string[];
        version: string;
        openBadgeJson: Record<string, any>;
        isPublished: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Certificates with template support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certificate model
 */
export declare const createCertificateModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        credentialId: string;
        studentId: string;
        certificateType: string;
        certificateTitle: string;
        courseName: string;
        courseCode: string;
        issueDate: Date;
        signatories: Array<{
            name: string;
            title: string;
            signatureUrl?: string;
        }>;
        sealUrl: string;
        templateId: string;
        grade: string;
        credits: number;
        pdfUrl: string;
        qrCodeUrl: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Professional Certifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certification model
 */
export declare const createCertificationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        credentialId: string;
        certificationName: string;
        certificationBody: string;
        certificationLevel: string;
        issueDate: Date;
        expirationDate: Date | null;
        renewalRequired: boolean;
        renewalPeriod: number;
        prerequisites: string[];
        competencies: string[];
        verificationCode: string;
        renewalStatus: string;
        lastRenewalDate: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Verifiable Credentials (W3C standard).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VerifiableCredential model
 */
export declare const createVerifiableCredentialModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        credentialId: string;
        credentialSubject: Record<string, any>;
        issuer: Record<string, any>;
        issuanceDate: Date;
        expirationDate: Date | null;
        credentialSchema: Record<string, any>;
        proof: Record<string, any>;
        context: string[];
        type: string[];
        vcJson: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Issues a new digital badge to student with Open Badges standard.
 *
 * @param {string} studentId - Student identifier
 * @param {DigitalBadgeData} badgeData - Badge data
 * @param {Model} Credential - Credential model
 * @param {Model} DigitalBadge - DigitalBadge model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Issued badge
 *
 * @example
 * ```typescript
 * const badge = await issueDigitalBadge('STU12345', {
 *   badgeName: 'Python Programming Excellence',
 *   badgeDescription: 'Demonstrated excellence in Python programming',
 *   badgeCategory: 'skill',
 *   badgeImageUrl: 'https://badges.edu/python.png',
 *   issuerName: 'University Tech Department',
 *   issuerId: 'ISSUER-001'
 * }, Credential, DigitalBadge);
 * ```
 */
export declare const issueDigitalBadge: (studentId: string, badgeData: DigitalBadgeData, Credential: any, DigitalBadge: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves all badges earned by student.
 *
 * @param {string} studentId - Student identifier
 * @param {Model} Credential - Credential model
 * @param {Model} DigitalBadge - DigitalBadge model
 * @returns {Promise<any[]>} Student badges
 *
 * @example
 * ```typescript
 * const badges = await getStudentBadges('STU12345', Credential, DigitalBadge);
 * ```
 */
export declare const getStudentBadges: (studentId: string, Credential: any, DigitalBadge: any) => Promise<any[]>;
/**
 * Generates badge collection display page with ARIA labels.
 *
 * @param {string} studentId - Student identifier
 * @param {Model} Credential - Credential model
 * @param {Model} DigitalBadge - DigitalBadge model
 * @returns {Promise<string>} Accessible HTML
 *
 * @example
 * ```typescript
 * const html = await generateBadgeCollectionPage('STU12345', Credential, DigitalBadge);
 * ```
 */
export declare const generateBadgeCollectionPage: (studentId: string, Credential: any, DigitalBadge: any) => Promise<string>;
/**
 * Validates badge criteria and requirements.
 *
 * @param {string} badgeId - Badge identifier
 * @param {string} studentId - Student identifier
 * @param {Record<string, any>} evidence - Evidence of completion
 * @param {Model} DigitalBadge - DigitalBadge model
 * @returns {Promise<boolean>} Criteria met
 *
 * @example
 * ```typescript
 * const meetsRequirements = await validateBadgeCriteria('badge123', 'STU12345', {
 *   courseCompleted: true,
 *   minimumGrade: 85,
 *   projectSubmitted: true
 * }, DigitalBadge);
 * ```
 */
export declare const validateBadgeCriteria: (badgeId: string, studentId: string, evidence: Record<string, any>, DigitalBadge: any) => Promise<boolean>;
/**
 * Exports badge to Open Badges backpack or platform.
 *
 * @param {string} badgeId - Badge identifier
 * @param {string} backpackUrl - Backpack URL
 * @param {Model} DigitalBadge - DigitalBadge model
 * @returns {Promise<any>} Export result
 *
 * @example
 * ```typescript
 * const result = await exportBadgeToBackpack('badge123', 'https://backpack.openbadges.org', DigitalBadge);
 * ```
 */
export declare const exportBadgeToBackpack: (badgeId: string, backpackUrl: string, DigitalBadge: any) => Promise<any>;
/**
 * Retrieves badge issuer profile and statistics.
 *
 * @param {string} issuerId - Issuer identifier
 * @param {Model} DigitalBadge - DigitalBadge model
 * @returns {Promise<any>} Issuer profile
 *
 * @example
 * ```typescript
 * const issuerProfile = await getBadgeIssuerProfile('ISSUER-001', DigitalBadge);
 * ```
 */
export declare const getBadgeIssuerProfile: (issuerId: string, DigitalBadge: any) => Promise<any>;
/**
 * Creates badge pathway or stacking framework.
 *
 * @param {string} pathwayName - Pathway name
 * @param {string[]} badgeIds - Badge IDs in pathway
 * @param {string} description - Pathway description
 * @returns {Promise<any>} Badge pathway
 *
 * @example
 * ```typescript
 * const pathway = await createBadgePathway('Web Development Mastery', [
 *   'badge-html', 'badge-css', 'badge-js', 'badge-react'
 * ], 'Complete pathway to web development expertise');
 * ```
 */
export declare const createBadgePathway: (pathwayName: string, badgeIds: string[], description: string) => Promise<any>;
/**
 * Generates shareable badge URL with verification.
 *
 * @param {string} badgeId - Badge identifier
 * @param {Model} DigitalBadge - DigitalBadge model
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Shareable URL
 *
 * @example
 * ```typescript
 * const shareUrl = await generateBadgeShareUrl('badge123', DigitalBadge, Credential);
 * ```
 */
export declare const generateBadgeShareUrl: (badgeId: string, DigitalBadge: any, Credential: any) => Promise<string>;
/**
 * Tracks badge display and engagement metrics.
 *
 * @param {string} badgeId - Badge identifier
 * @param {string} eventType - Event type
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackBadgeEngagement('badge123', 'viewed');
 * ```
 */
export declare const trackBadgeEngagement: (badgeId: string, eventType: "viewed" | "shared" | "verified" | "downloaded") => Promise<void>;
/**
 * Generates certificate for course completion.
 *
 * @param {CertificateData} certificateData - Certificate data
 * @param {Model} Credential - Credential model
 * @param {Model} Certificate - Certificate model
 * @returns {Promise<any>} Generated certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateCertificate({
 *   studentId: 'STU12345',
 *   certificateType: 'completion',
 *   certificateTitle: 'Certificate of Completion',
 *   courseName: 'Advanced Data Science',
 *   courseCode: 'CS501',
 *   issueDate: new Date(),
 *   signatories: [
 *     { name: 'Dr. Jane Smith', title: 'Department Chair' },
 *     { name: 'Prof. John Doe', title: 'Course Instructor' }
 *   ]
 * }, Credential, Certificate);
 * ```
 */
export declare const generateCertificate: (certificateData: CertificateData, Credential: any, Certificate: any) => Promise<any>;
/**
 * Renders certificate template with student data.
 *
 * @param {string} certificateId - Certificate identifier
 * @param {string} templateId - Template identifier
 * @param {Model} Certificate - Certificate model
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Rendered HTML
 *
 * @example
 * ```typescript
 * const html = await renderCertificateTemplate('cert123', 'template-formal', Certificate, Credential);
 * ```
 */
export declare const renderCertificateTemplate: (certificateId: string, templateId: string, Certificate: any, Credential: any) => Promise<string>;
/**
 * Exports certificate to PDF with accessibility tags.
 *
 * @param {string} certificateId - Certificate identifier
 * @param {Model} Certificate - Certificate model
 * @returns {Promise<string>} PDF URL
 *
 * @example
 * ```typescript
 * const pdfUrl = await exportCertificateToPDF('cert123', Certificate);
 * ```
 */
export declare const exportCertificateToPDF: (certificateId: string, Certificate: any) => Promise<string>;
/**
 * Adds digital signatures to certificate.
 *
 * @param {string} certificateId - Certificate identifier
 * @param {Array<{ name: string; title: string; signatureUrl: string }>} signatures - Signatures
 * @param {Model} Certificate - Certificate model
 * @returns {Promise<any>} Updated certificate
 *
 * @example
 * ```typescript
 * await addCertificateSignatures('cert123', [
 *   { name: 'Dr. Smith', title: 'President', signatureUrl: 'https://sigs.edu/smith.png' }
 * ], Certificate);
 * ```
 */
export declare const addCertificateSignatures: (certificateId: string, signatures: Array<{
    name: string;
    title: string;
    signatureUrl: string;
}>, Certificate: any) => Promise<any>;
/**
 * Retrieves all certificates for student.
 *
 * @param {string} studentId - Student identifier
 * @param {Model} Certificate - Certificate model
 * @returns {Promise<any[]>} Student certificates
 *
 * @example
 * ```typescript
 * const certificates = await getStudentCertificates('STU12345', Certificate);
 * ```
 */
export declare const getStudentCertificates: (studentId: string, Certificate: any) => Promise<any[]>;
/**
 * Generates certificate verification QR code.
 *
 * @param {string} credentialNumber - Credential number
 * @returns {Promise<string>} QR code URL
 *
 * @example
 * ```typescript
 * const qrCode = await generateCertificateQRCode('CERT-2024-ABC123');
 * ```
 */
export declare const generateCertificateQRCode: (credentialNumber: string) => Promise<string>;
/**
 * Validates certificate authenticity and status.
 *
 * @param {string} credentialNumber - Credential number
 * @param {Model} Credential - Credential model
 * @param {Model} Certificate - Certificate model
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateCertificateAuthenticity('CERT-2024-ABC123', Credential, Certificate);
 * ```
 */
export declare const validateCertificateAuthenticity: (credentialNumber: string, Credential: any, Certificate: any) => Promise<any>;
/**
 * Verifies credential using verification code or number.
 *
 * @param {string} credentialNumber - Credential number
 * @param {string} [verificationCode] - Optional verification code
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyCredential('CERT-2024-ABC123', 'VER-XYZ', Credential);
 * ```
 */
export declare const verifyCredential: (credentialNumber: string, verificationCode: string | undefined, Credential: any) => Promise<any>;
/**
 * Creates public verification page with WCAG compliance.
 *
 * @param {string} credentialNumber - Credential number
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Verification page HTML
 *
 * @example
 * ```typescript
 * const html = await createVerificationPage('CERT-2024-ABC123', Credential);
 * ```
 */
export declare const createVerificationPage: (credentialNumber: string, Credential: any) => Promise<string>;
/**
 * Tracks credential verification attempts.
 *
 * @param {string} credentialNumber - Credential number
 * @param {string} verifierInfo - Verifier information
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackCredentialVerification('CERT-2024-ABC123', 'Employer XYZ');
 * ```
 */
export declare const trackCredentialVerification: (credentialNumber: string, verifierInfo: string) => Promise<void>;
/**
 * Generates blockchain verification proof.
 *
 * @param {string} credentialId - Credential identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Blockchain proof
 *
 * @example
 * ```typescript
 * const proof = await generateBlockchainProof('cred123', Credential);
 * ```
 */
export declare const generateBlockchainProof: (credentialId: string, Credential: any) => Promise<any>;
/**
 * Revokes credential with reason and notification.
 *
 * @param {string} credentialId - Credential identifier
 * @param {string} reason - Revocation reason
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Revoked credential
 *
 * @example
 * ```typescript
 * await revokeCredential('cred123', 'Academic misconduct', Credential);
 * ```
 */
export declare const revokeCredential: (credentialId: string, reason: string, Credential: any) => Promise<any>;
/**
 * Generates accessible verification badge/seal.
 *
 * @param {string} credentialNumber - Credential number
 * @returns {Promise<string>} Verification badge HTML
 *
 * @example
 * ```typescript
 * const badge = await generateVerificationBadge('CERT-2024-ABC123');
 * ```
 */
export declare const generateVerificationBadge: (credentialNumber: string) => Promise<string>;
/**
 * Issues credential to blockchain network.
 *
 * @param {string} credentialId - Credential identifier
 * @param {string} network - Blockchain network
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Blockchain transaction
 *
 * @example
 * ```typescript
 * const tx = await issueCredentialToBlockchain('cred123', 'polygon', Credential);
 * ```
 */
export declare const issueCredentialToBlockchain: (credentialId: string, network: "ethereum" | "polygon" | "binance" | "cardano", Credential: any) => Promise<any>;
/**
 * Retrieves blockchain credential metadata.
 *
 * @param {string} blockchainHash - Blockchain hash
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Blockchain metadata
 *
 * @example
 * ```typescript
 * const metadata = await getBlockchainCredentialMetadata('0xabc...', Credential);
 * ```
 */
export declare const getBlockchainCredentialMetadata: (blockchainHash: string, Credential: any) => Promise<any>;
/**
 * Verifies credential on blockchain network.
 *
 * @param {string} credentialNumber - Credential number
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Blockchain verification result
 *
 * @example
 * ```typescript
 * const result = await verifyBlockchainCredential('CERT-2024-ABC123', Credential);
 * ```
 */
export declare const verifyBlockchainCredential: (credentialNumber: string, Credential: any) => Promise<any>;
/**
 * Generates NFT metadata for credential.
 *
 * @param {string} credentialId - Credential identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} NFT metadata
 *
 * @example
 * ```typescript
 * const nft = await generateCredentialNFT('cred123', Credential);
 * ```
 */
export declare const generateCredentialNFT: (credentialId: string, Credential: any) => Promise<any>;
/**
 * Transfers credential ownership on blockchain.
 *
 * @param {string} credentialId - Credential identifier
 * @param {string} newOwnerId - New owner identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Transfer result
 *
 * @example
 * ```typescript
 * await transferBlockchainCredential('cred123', 'newowner456', Credential);
 * ```
 */
export declare const transferBlockchainCredential: (credentialId: string, newOwnerId: string, Credential: any) => Promise<any>;
/**
 * Issues micro-credential for specific skill or competency.
 *
 * @param {string} studentId - Student identifier
 * @param {MicroCredentialData} microData - Micro-credential data
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Issued micro-credential
 *
 * @example
 * ```typescript
 * const micro = await issueMicroCredential('STU12345', {
 *   microCredentialName: 'Data Analysis with Python',
 *   description: 'Proficiency in data analysis using Python',
 *   skillsAcquired: ['pandas', 'numpy', 'matplotlib', 'data_visualization'],
 *   competencyLevel: 'intermediate',
 *   assessmentMethod: 'Project-based assessment',
 *   durationHours: 40,
 *   stackable: true
 * }, Credential);
 * ```
 */
export declare const issueMicroCredential: (studentId: string, microData: MicroCredentialData, Credential: any) => Promise<any>;
/**
 * Stacks multiple micro-credentials into pathway.
 *
 * @param {string} studentId - Student identifier
 * @param {string[]} microCredentialIds - Micro-credential IDs
 * @param {string} pathwayName - Pathway name
 * @returns {Promise<any>} Stacked credential pathway
 *
 * @example
 * ```typescript
 * const pathway = await stackMicroCredentials('STU12345', [
 *   'micro1', 'micro2', 'micro3'
 * ], 'Full Stack Web Development');
 * ```
 */
export declare const stackMicroCredentials: (studentId: string, microCredentialIds: string[], pathwayName: string) => Promise<any>;
/**
 * Retrieves student micro-credential portfolio.
 *
 * @param {string} studentId - Student identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Micro-credential portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await getMicroCredentialPortfolio('STU12345', Credential);
 * ```
 */
export declare const getMicroCredentialPortfolio: (studentId: string, Credential: any) => Promise<any>;
/**
 * Maps micro-credentials to industry standards.
 *
 * @param {string} microCredentialId - Micro-credential identifier
 * @param {string[]} industryStandards - Industry standard frameworks
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Mapping result
 *
 * @example
 * ```typescript
 * await mapMicroCredentialToIndustry('micro123', [
 *   'IEEE Standard 1484',
 *   'ESCO Skills'
 * ], Credential);
 * ```
 */
export declare const mapMicroCredentialToIndustry: (microCredentialId: string, industryStandards: string[], Credential: any) => Promise<any>;
/**
 * Generates shareable micro-credential badge.
 *
 * @param {string} microCredentialId - Micro-credential identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Badge HTML
 *
 * @example
 * ```typescript
 * const badge = await generateMicroCredentialBadge('micro123', Credential);
 * ```
 */
export declare const generateMicroCredentialBadge: (microCredentialId: string, Credential: any) => Promise<string>;
/**
 * Records continuing education credit completion.
 *
 * @param {ContinuingEducationData} ceData - CE data
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} CE record
 *
 * @example
 * ```typescript
 * const ce = await recordContinuingEducation({
 *   studentId: 'STU12345',
 *   activityName: 'Advanced Pharmacology Update',
 *   provider: 'Medical Education Institute',
 *   completionDate: new Date(),
 *   creditType: 'CME',
 *   creditHours: 15.5,
 *   accreditationBody: 'ACCME'
 * }, Credential);
 * ```
 */
export declare const recordContinuingEducation: (ceData: ContinuingEducationData, Credential: any) => Promise<any>;
/**
 * Calculates total CE credits for professional renewal.
 *
 * @param {string} studentId - Student identifier
 * @param {string} creditType - Credit type
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Credit summary
 *
 * @example
 * ```typescript
 * const summary = await calculateCECredits('STU12345', 'CME',
 *   new Date('2024-01-01'), new Date('2024-12-31'), Credential);
 * ```
 */
export declare const calculateCECredits: (studentId: string, creditType: string, startDate: Date, endDate: Date, Credential: any) => Promise<any>;
/**
 * Generates CE transcript for license renewal.
 *
 * @param {string} studentId - Student identifier
 * @param {string} creditType - Credit type
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Transcript HTML
 *
 * @example
 * ```typescript
 * const transcript = await generateCETranscript('STU12345', 'CME', Credential);
 * ```
 */
export declare const generateCETranscript: (studentId: string, creditType: string, Credential: any) => Promise<string>;
/**
 * Tracks CE renewal deadlines and notifications.
 *
 * @param {string} studentId - Student identifier
 * @param {Model} Credential - Credential model
 * @returns {Promise<any[]>} Upcoming renewals
 *
 * @example
 * ```typescript
 * const renewals = await trackCERenewals('STU12345', Credential);
 * ```
 */
export declare const trackCERenewals: (studentId: string, Credential: any) => Promise<any[]>;
/**
 * Issues professional certification credential.
 *
 * @param {string} studentId - Student identifier
 * @param {CertificationData} certData - Certification data
 * @param {Model} Credential - Credential model
 * @param {Model} Certification - Certification model
 * @returns {Promise<any>} Issued certification
 *
 * @example
 * ```typescript
 * const cert = await issueProfessionalCertification('STU12345', {
 *   certificationName: 'Project Management Professional (PMP)',
 *   certificationBody: 'PMI',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2027-12-31'),
 *   verificationCode: 'PMP-123456'
 * }, Credential, Certification);
 * ```
 */
export declare const issueProfessionalCertification: (studentId: string, certData: CertificationData, Credential: any, Certification: any) => Promise<any>;
/**
 * Processes certification renewal.
 *
 * @param {string} certificationId - Certification identifier
 * @param {Date} newExpirationDate - New expiration date
 * @param {Model} Certification - Certification model
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Renewed certification
 *
 * @example
 * ```typescript
 * await renewCertification('cert123', new Date('2030-12-31'), Certification, Credential);
 * ```
 */
export declare const renewCertification: (certificationId: string, newExpirationDate: Date, Certification: any, Credential: any) => Promise<any>;
/**
 * Retrieves certifications expiring soon.
 *
 * @param {string} studentId - Student identifier
 * @param {number} daysThreshold - Days until expiration
 * @param {Model} Credential - Credential model
 * @param {Model} Certification - Certification model
 * @returns {Promise<any[]>} Expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await getCertificationsExpiringSoon('STU12345', 90, Credential, Certification);
 * ```
 */
export declare const getCertificationsExpiringSoon: (studentId: string, daysThreshold: number, Credential: any, Certification: any) => Promise<any[]>;
/**
 * Validates certification prerequisites and requirements.
 *
 * @param {string} certificationId - Certification identifier
 * @param {string} studentId - Student identifier
 * @param {Model} Certification - Certification model
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateCertificationRequirements('cert123', 'STU12345', Certification);
 * ```
 */
export declare const validateCertificationRequirements: (certificationId: string, studentId: string, Certification: any) => Promise<any>;
/**
 * Generates shareable credential link with expiration.
 *
 * @param {string} credentialId - Credential identifier
 * @param {number} expirationDays - Days until expiration
 * @param {Model} Credential - Credential model
 * @returns {Promise<string>} Share URL
 *
 * @example
 * ```typescript
 * const shareUrl = await shareCredential('cred123', 30, Credential);
 * ```
 */
export declare const shareCredential: (credentialId: string, expirationDays: number, Credential: any) => Promise<string>;
/**
 * Sends credential via email with accessible format.
 *
 * @param {string} credentialId - Credential identifier
 * @param {string} recipientEmail - Recipient email
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Send result
 *
 * @example
 * ```typescript
 * await emailCredential('cred123', 'employer@company.com', Credential);
 * ```
 */
export declare const emailCredential: (credentialId: string, recipientEmail: string, Credential: any) => Promise<any>;
/**
 * Generates QR code for credential sharing.
 *
 * @param {string} credentialNumber - Credential number
 * @returns {Promise<string>} QR code data URL
 *
 * @example
 * ```typescript
 * const qrCode = await generateCredentialQRCode('CERT-2024-ABC123');
 * ```
 */
export declare const generateCredentialQRCode: (credentialNumber: string) => Promise<string>;
/**
 * Creates social media shareable credential post.
 *
 * @param {string} credentialId - Credential identifier
 * @param {string} platform - Social platform
 * @param {Model} Credential - Credential model
 * @returns {Promise<any>} Share content
 *
 * @example
 * ```typescript
 * const post = await shareCredentialToSocialMedia('cred123', 'linkedin', Credential);
 * ```
 */
export declare const shareCredentialToSocialMedia: (credentialId: string, platform: "linkedin" | "twitter" | "facebook", Credential: any) => Promise<any>;
/**
 * Tracks credential share analytics and views.
 *
 * @param {string} shareToken - Share token
 * @param {string} viewerInfo - Viewer information
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackCredentialShare('token123', 'Employer view');
 * ```
 */
export declare const trackCredentialShare: (shareToken: string, viewerInfo: string) => Promise<void>;
/**
 * NestJS Injectable service for Credential Management.
 *
 * @example
 * ```typescript
 * @Controller('credentials')
 * export class CredentialController {
 *   constructor(private readonly credentialService: CredentialManagementService) {}
 *
 *   @Post('badge')
 *   async issueBadge(@Body() badgeData: any) {
 *     return this.credentialService.issueBadge(badgeData);
 *   }
 * }
 * ```
 */
export declare class CredentialManagementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    issueBadge(studentId: string, badgeData: DigitalBadgeData): Promise<any>;
    generateCert(certificateData: CertificateData): Promise<any>;
    verify(credentialNumber: string): Promise<any>;
    shareCredential(credentialId: string, expirationDays?: number): Promise<string>;
}
/**
 * Default export with all credential management utilities.
 */
declare const _default: {
    createCredentialModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            studentId: string;
            credentialType: string;
            credentialName: string;
            issuingInstitution: string;
            issueDate: Date;
            expirationDate: Date | null;
            credentialNumber: string;
            verificationUrl: string;
            metadata: Record<string, any>;
            isRevoked: boolean;
            revokedDate: Date | null;
            revocationReason: string;
            blockchainHash: string;
            blockchainNetwork: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDigitalBadgeModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            credentialId: string;
            badgeName: string;
            badgeDescription: string;
            badgeCategory: string;
            badgeImageUrl: string;
            criteriaUrl: string;
            issuerName: string;
            issuerId: string;
            evidenceUrl: string;
            skills: string[];
            alignmentTargets: string[];
            version: string;
            openBadgeJson: Record<string, any>;
            isPublished: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCertificateModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            credentialId: string;
            studentId: string;
            certificateType: string;
            certificateTitle: string;
            courseName: string;
            courseCode: string;
            issueDate: Date;
            signatories: Array<{
                name: string;
                title: string;
                signatureUrl?: string;
            }>;
            sealUrl: string;
            templateId: string;
            grade: string;
            credits: number;
            pdfUrl: string;
            qrCodeUrl: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCertificationModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            credentialId: string;
            certificationName: string;
            certificationBody: string;
            certificationLevel: string;
            issueDate: Date;
            expirationDate: Date | null;
            renewalRequired: boolean;
            renewalPeriod: number;
            prerequisites: string[];
            competencies: string[];
            verificationCode: string;
            renewalStatus: string;
            lastRenewalDate: Date | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createVerifiableCredentialModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            credentialId: string;
            credentialSubject: Record<string, any>;
            issuer: Record<string, any>;
            issuanceDate: Date;
            expirationDate: Date | null;
            credentialSchema: Record<string, any>;
            proof: Record<string, any>;
            context: string[];
            type: string[];
            vcJson: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    issueDigitalBadge: (studentId: string, badgeData: DigitalBadgeData, Credential: any, DigitalBadge: any, transaction?: Transaction) => Promise<any>;
    getStudentBadges: (studentId: string, Credential: any, DigitalBadge: any) => Promise<any[]>;
    generateBadgeCollectionPage: (studentId: string, Credential: any, DigitalBadge: any) => Promise<string>;
    validateBadgeCriteria: (badgeId: string, studentId: string, evidence: Record<string, any>, DigitalBadge: any) => Promise<boolean>;
    exportBadgeToBackpack: (badgeId: string, backpackUrl: string, DigitalBadge: any) => Promise<any>;
    getBadgeIssuerProfile: (issuerId: string, DigitalBadge: any) => Promise<any>;
    createBadgePathway: (pathwayName: string, badgeIds: string[], description: string) => Promise<any>;
    generateBadgeShareUrl: (badgeId: string, DigitalBadge: any, Credential: any) => Promise<string>;
    trackBadgeEngagement: (badgeId: string, eventType: "viewed" | "shared" | "verified" | "downloaded") => Promise<void>;
    generateCertificate: (certificateData: CertificateData, Credential: any, Certificate: any) => Promise<any>;
    renderCertificateTemplate: (certificateId: string, templateId: string, Certificate: any, Credential: any) => Promise<string>;
    exportCertificateToPDF: (certificateId: string, Certificate: any) => Promise<string>;
    addCertificateSignatures: (certificateId: string, signatures: Array<{
        name: string;
        title: string;
        signatureUrl: string;
    }>, Certificate: any) => Promise<any>;
    getStudentCertificates: (studentId: string, Certificate: any) => Promise<any[]>;
    generateCertificateQRCode: (credentialNumber: string) => Promise<string>;
    validateCertificateAuthenticity: (credentialNumber: string, Credential: any, Certificate: any) => Promise<any>;
    verifyCredential: (credentialNumber: string, verificationCode: string | undefined, Credential: any) => Promise<any>;
    createVerificationPage: (credentialNumber: string, Credential: any) => Promise<string>;
    trackCredentialVerification: (credentialNumber: string, verifierInfo: string) => Promise<void>;
    generateBlockchainProof: (credentialId: string, Credential: any) => Promise<any>;
    revokeCredential: (credentialId: string, reason: string, Credential: any) => Promise<any>;
    generateVerificationBadge: (credentialNumber: string) => Promise<string>;
    issueCredentialToBlockchain: (credentialId: string, network: "ethereum" | "polygon" | "binance" | "cardano", Credential: any) => Promise<any>;
    getBlockchainCredentialMetadata: (blockchainHash: string, Credential: any) => Promise<any>;
    verifyBlockchainCredential: (credentialNumber: string, Credential: any) => Promise<any>;
    generateCredentialNFT: (credentialId: string, Credential: any) => Promise<any>;
    transferBlockchainCredential: (credentialId: string, newOwnerId: string, Credential: any) => Promise<any>;
    issueMicroCredential: (studentId: string, microData: MicroCredentialData, Credential: any) => Promise<any>;
    stackMicroCredentials: (studentId: string, microCredentialIds: string[], pathwayName: string) => Promise<any>;
    getMicroCredentialPortfolio: (studentId: string, Credential: any) => Promise<any>;
    mapMicroCredentialToIndustry: (microCredentialId: string, industryStandards: string[], Credential: any) => Promise<any>;
    generateMicroCredentialBadge: (microCredentialId: string, Credential: any) => Promise<string>;
    recordContinuingEducation: (ceData: ContinuingEducationData, Credential: any) => Promise<any>;
    calculateCECredits: (studentId: string, creditType: string, startDate: Date, endDate: Date, Credential: any) => Promise<any>;
    generateCETranscript: (studentId: string, creditType: string, Credential: any) => Promise<string>;
    trackCERenewals: (studentId: string, Credential: any) => Promise<any[]>;
    issueProfessionalCertification: (studentId: string, certData: CertificationData, Credential: any, Certification: any) => Promise<any>;
    renewCertification: (certificationId: string, newExpirationDate: Date, Certification: any, Credential: any) => Promise<any>;
    getCertificationsExpiringSoon: (studentId: string, daysThreshold: number, Credential: any, Certification: any) => Promise<any[]>;
    validateCertificationRequirements: (certificationId: string, studentId: string, Certification: any) => Promise<any>;
    shareCredential: (credentialId: string, expirationDays: number, Credential: any) => Promise<string>;
    emailCredential: (credentialId: string, recipientEmail: string, Credential: any) => Promise<any>;
    generateCredentialQRCode: (credentialNumber: string) => Promise<string>;
    shareCredentialToSocialMedia: (credentialId: string, platform: "linkedin" | "twitter" | "facebook", Credential: any) => Promise<any>;
    trackCredentialShare: (shareToken: string, viewerInfo: string) => Promise<void>;
    CredentialManagementService: typeof CredentialManagementService;
};
export default _default;
//# sourceMappingURL=credential-management-kit.d.ts.map