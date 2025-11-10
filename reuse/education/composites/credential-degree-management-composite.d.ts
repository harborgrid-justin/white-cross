/**
 * LOC: EDU-COMP-CRED-001
 * File: /reuse/education/composites/credential-degree-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../credential-management-kit
 *   - ../degree-audit-kit
 *   - ../transcript-management-kit
 *   - ../curriculum-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Registrar office controllers
 *   - Degree conferral services
 *   - Digital badge issuance
 *   - Credential verification systems
 *   - Commencement management
 */
import { Sequelize } from 'sequelize';
export type CredentialType = 'degree' | 'certificate' | 'badge' | 'micro_credential' | 'certification' | 'diploma';
export type DegreeLevel = 'associate' | 'bachelor' | 'master' | 'doctoral' | 'professional';
export type BadgeCategory = 'academic' | 'skill' | 'achievement' | 'participation' | 'leadership';
export interface DegreeConferral {
    conferralId: string;
    studentId: string;
    degreeType: DegreeLevel;
    degreeTitle: string;
    major: string;
    minor?: string;
    concentration?: string;
    honors?: string;
    gpa: number;
    creditsEarned: number;
    conferralDate: Date;
}
export interface DigitalBadge {
    badgeId: string;
    studentId: string;
    badgeName: string;
    badgeDescription: string;
    category: BadgeCategory;
    imageUrl: string;
    criteriaUrl: string;
    issuerName: string;
    issueDate: Date;
    expirationDate?: Date;
    skills: string[];
    evidenceUrl?: string;
    blockchainHash?: string;
    openBadgesCompliant: boolean;
    shareableUrl: string;
}
export interface VerifiableCredential {
    credentialId: string;
    studentId: string;
    credentialType: CredentialType;
    issuer: {
        id: string;
        name: string;
        url: string;
    };
    credentialSubject: {
        id: string;
        name: string;
        achievement: string;
        date: Date;
    };
    issuanceDate: Date;
    expirationDate?: Date;
    proof: {
        type: string;
        created: Date;
        verificationMethod: string;
        signature: string;
    };
    w3cCompliant: boolean;
    jsonLdContext: string[];
}
export interface MicroCredential {
    microCredId: string;
    studentId: string;
    credentialName: string;
    credentialDescription: string;
    competencies: string[];
    assessmentType: string;
    creditsEquivalent?: number;
    stackable: boolean;
    pathwayTo?: string[];
    issueDate: Date;
    validUntil?: Date;
    renewalRequired: boolean;
}
export interface DiplomaProduction {
    diplomaId: string;
    studentId: string;
    degreeConferralId: string;
    diplomaType: 'printed' | 'digital' | 'both';
    templateId: string;
    printStatus: 'pending' | 'printed' | 'shipped' | 'delivered';
    digitalFormat?: 'pdf' | 'blockchain';
    securityFeatures: string[];
    productionDate?: Date;
    trackingNumber?: string;
}
export interface CredentialVerification {
    verificationId: string;
    credentialId: string;
    verificationCode: string;
    verifiedBy: string;
    verificationDate: Date;
    verificationMethod: 'code' | 'qr' | 'blockchain' | 'api';
    status: 'valid' | 'revoked' | 'expired' | 'not_found';
    issuerConfirmed: boolean;
}
export interface BlockchainCredential {
    blockchainId: string;
    credentialId: string;
    studentId: string;
    transactionHash: string;
    blockNumber: number;
    blockchain: 'ethereum' | 'polygon' | 'hyperledger';
    smartContractAddress: string;
    timestampOnChain: Date;
    ipfsHash?: string;
    revocable: boolean;
    revokedAt?: Date;
}
/**
 * Credential & Degree Management Composite Service
 *
 * Provides comprehensive degree conferral, credential issuance, verification, and management.
 */
export declare class CredentialDegreeManagementCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Audits degree requirements for conferral eligibility.
     *
     * @param {string} studentId - Student identifier
     * @param {string} degreeProgram - Degree program code
     * @returns {Promise<{eligible: boolean; requirements: any; deficiencies: string[]}>} Audit result
     *
     * @example
     * ```typescript
     * const audit = await service.auditDegreeRequirements('STU123456', 'BS-COMP-SCI');
     * if (audit.eligible) {
     *   console.log('Student eligible for graduation');
     * }
     * ```
     */
    auditDegreeRequirements(studentId: string, degreeProgram: string): Promise<{
        eligible: boolean;
        requirements: any;
        deficiencies: string[];
    }>;
    /**
     * 2. Confers degree to graduating student.
     *
     * @param {string} studentId - Student identifier
     * @param {DegreeConferral} conferralData - Conferral data
     * @returns {Promise<DegreeConferral>} Degree conferral record
     *
     * @example
     * ```typescript
     * const degree = await service.conferDegree('STU123456', {
     *   conferralId: 'DEG-001',
     *   studentId: 'STU123456',
     *   degreeType: 'bachelor',
     *   degreeTitle: 'Bachelor of Science',
     *   major: 'Computer Science',
     *   gpa: 3.75,
     *   creditsEarned: 120,
     *   conferralDate: new Date(),
     *   latinHonors: 'magna_cum_laude',
     *   diplomaIssued: false,
     *   verificationCode: 'VER-123456'
     * });
     * ```
     */
    conferDegree(studentId: string, conferralData: DegreeConferral): Promise<DegreeConferral>;
    /**
     * 3. Calculates Latin honors designation.
     *
     * @param {number} gpa - Cumulative GPA
     * @param {string} degreeLevel - Degree level
     * @returns {Promise<string | null>} Latin honors
     *
     * @example
     * ```typescript
     * const honors = await service.calculateLatinHonors(3.85, 'bachelor');
     * console.log(`Latin honors: ${honors}`); // "magna_cum_laude"
     * ```
     */
    calculateLatinHonors(gpa: number, degreeLevel: string): Promise<string | null>;
    /**
     * 4. Processes commencement registration.
     *
     * @param {string} studentId - Student identifier
     * @param {Date} commencementDate - Commencement date
     * @param {object} preferences - Student preferences
     * @returns {Promise<{registered: boolean; ceremonyDetails: any}>} Registration result
     *
     * @example
     * ```typescript
     * await service.registerForCommencement('STU123456', new Date('2024-05-15'), {
     *   guestCount: 4,
     *   namePronounciation: 'JON DOH'
     * });
     * ```
     */
    registerForCommencement(studentId: string, commencementDate: Date, preferences: {
        guestCount: number;
        namePronunciation?: string;
    }): Promise<{
        registered: boolean;
        ceremonyDetails: any;
    }>;
    /**
     * 5. Generates degree completion letter.
     *
     * @param {string} conferralId - Conferral identifier
     * @returns {Promise<Buffer>} Completion letter PDF
     *
     * @example
     * ```typescript
     * const letter = await service.generateDegreeCompletionLetter('DEG-001');
     * ```
     */
    generateDegreeCompletionLetter(conferralId: string): Promise<Buffer>;
    /**
     * 6. Tracks degree conferral statistics.
     *
     * @param {string} academicYear - Academic year
     * @returns {Promise<any>} Conferral statistics
     *
     * @example
     * ```typescript
     * const stats = await service.trackDegreeConferralStats('2023-2024');
     * ```
     */
    trackDegreeConferralStats(academicYear: string): Promise<any>;
    /**
     * 7. Validates degree program completion.
     *
     * @param {string} studentId - Student identifier
     * @param {string} programCode - Program code
     * @returns {Promise<{complete: boolean; missingRequirements: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateProgramCompletion('STU123456', 'BS-COMP-SCI');
     * ```
     */
    validateProgramCompletion(studentId: string, programCode: string): Promise<{
        complete: boolean;
        missingRequirements: string[];
    }>;
    /**
     * 8. Processes degree application.
     *
     * @param {string} studentId - Student identifier
     * @param {string} term - Graduation term
     * @returns {Promise<{applicationId: string; status: string; deadline: Date}>} Application result
     *
     * @example
     * ```typescript
     * const app = await service.applyForDegree('STU123456', 'Spring 2024');
     * ```
     */
    applyForDegree(studentId: string, term: string): Promise<{
        applicationId: string;
        status: string;
        deadline: Date;
    }>;
    /**
     * 9. Issues digital badge to student.
     *
     * @param {string} studentId - Student identifier
     * @param {string} badgeName - Badge name
     * @param {BadgeCategory} category - Badge category
     * @returns {Promise<DigitalBadge>} Digital badge
     *
     * @example
     * ```typescript
     * const badge = await service.issueDigitalBadge('STU123456', 'Python Expert', 'skill');
     * console.log(`Badge URL: ${badge.shareableUrl}`);
     * ```
     */
    issueDigitalBadge(studentId: string, badgeName: string, category: BadgeCategory): Promise<DigitalBadge>;
    /**
     * 10. Creates badge criteria and requirements.
     *
     * @param {string} badgeName - Badge name
     * @param {object} criteria - Badge criteria
     * @returns {Promise<{badgeId: string; criteria: any}>} Badge criteria
     *
     * @example
     * ```typescript
     * await service.createBadgeCriteria('Research Excellence', {
     *   requirements: ['Complete research project', 'Present findings'],
     *   assessment: 'Faculty review'
     * });
     * ```
     */
    createBadgeCriteria(badgeName: string, criteria: {
        requirements: string[];
        assessment: string;
    }): Promise<{
        badgeId: string;
        criteria: any;
    }>;
    /**
     * 11. Generates Open Badges 3.0 JSON.
     *
     * @param {string} badgeId - Badge identifier
     * @returns {Promise<any>} Open Badges JSON
     *
     * @example
     * ```typescript
     * const openBadge = await service.generateOpenBadgeJSON('BADGE-001');
     * ```
     */
    generateOpenBadgeJSON(badgeId: string): Promise<any>;
    /**
     * 12. Shares badge to social media platforms.
     *
     * @param {string} badgeId - Badge identifier
     * @param {string[]} platforms - Social media platforms
     * @returns {Promise<{shared: boolean; urls: string[]}>} Share result
     *
     * @example
     * ```typescript
     * await service.shareBadgeToSocial('BADGE-001', ['linkedin', 'twitter']);
     * ```
     */
    shareBadgeToSocial(badgeId: string, platforms: string[]): Promise<{
        shared: boolean;
        urls: string[];
    }>;
    /**
     * 13. Tracks badge issuance and acceptance.
     *
     * @param {string} badgeId - Badge identifier
     * @returns {Promise<any>} Badge analytics
     *
     * @example
     * ```typescript
     * const analytics = await service.trackBadgeAnalytics('BADGE-001');
     * ```
     */
    trackBadgeAnalytics(badgeId: string): Promise<any>;
    /**
     * 14. Revokes issued badge.
     *
     * @param {string} badgeId - Badge identifier
     * @param {string} reason - Revocation reason
     * @returns {Promise<boolean>} Success status
     *
     * @example
     * ```typescript
     * await service.revokeBadge('BADGE-001', 'Credential requirements not met');
     * ```
     */
    revokeBadge(badgeId: string, reason: string): Promise<boolean>;
    /**
     * 15. Issues W3C Verifiable Credential.
     *
     * @param {string} studentId - Student identifier
     * @param {CredentialType} type - Credential type
     * @param {any} achievement - Achievement details
     * @returns {Promise<VerifiableCredential>} Verifiable credential
     *
     * @example
     * ```typescript
     * const vc = await service.issueVerifiableCredential('STU123456', 'degree', {
     *   degreeTitle: 'Bachelor of Science',
     *   major: 'Computer Science'
     * });
     * ```
     */
    issueVerifiableCredential(studentId: string, type: CredentialType, achievement: any): Promise<VerifiableCredential>;
    /**
     * 16. Records credential on blockchain.
     *
     * @param {string} credentialId - Credential identifier
     * @param {string} blockchain - Blockchain network
     * @returns {Promise<BlockchainCredential>} Blockchain record
     *
     * @example
     * ```typescript
     * const bc = await service.recordOnBlockchain('VC-001', 'polygon');
     * console.log(`Transaction: ${bc.transactionHash}`);
     * ```
     */
    recordOnBlockchain(credentialId: string, blockchain: 'ethereum' | 'polygon' | 'hyperledger'): Promise<BlockchainCredential>;
    /**
     * 17. Verifies blockchain-based credential.
     *
     * @param {string} transactionHash - Transaction hash
     * @returns {Promise<{valid: boolean; credentialData: any}>} Verification result
     *
     * @example
     * ```typescript
     * const verification = await service.verifyBlockchainCredential('0xabc...');
     * ```
     */
    verifyBlockchainCredential(transactionHash: string): Promise<{
        valid: boolean;
        credentialData: any;
    }>;
    /**
     * 18. Generates decentralized identifier (DID).
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{did: string; document: any}>} DID and document
     *
     * @example
     * ```typescript
     * const did = await service.generateDecentralizedIdentifier('STU123456');
     * console.log(`DID: ${did.did}`);
     * ```
     */
    generateDecentralizedIdentifier(studentId: string): Promise<{
        did: string;
        document: any;
    }>;
    /**
     * 19. Creates credential wallet for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{walletId: string; credentials: string[]}>} Wallet info
     *
     * @example
     * ```typescript
     * const wallet = await service.createCredentialWallet('STU123456');
     * ```
     */
    createCredentialWallet(studentId: string): Promise<{
        walletId: string;
        credentials: string[];
    }>;
    /**
     * 20. Exports credential to digital wallet.
     *
     * @param {string} credentialId - Credential identifier
     * @param {string} walletType - Wallet type
     * @returns {Promise<{exported: boolean; qrCode: string}>} Export result
     *
     * @example
     * ```typescript
     * await service.exportToDigitalWallet('VC-001', 'apple_wallet');
     * ```
     */
    exportToDigitalWallet(credentialId: string, walletType: 'apple_wallet' | 'google_pay' | 'blockcerts'): Promise<{
        exported: boolean;
        qrCode: string;
    }>;
    /**
     * 21. Validates credential cryptographic signature.
     *
     * @param {VerifiableCredential} credential - Credential to validate
     * @returns {Promise<{valid: boolean; issuerVerified: boolean}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateCredentialSignature(vcCredential);
     * ```
     */
    validateCredentialSignature(credential: VerifiableCredential): Promise<{
        valid: boolean;
        issuerVerified: boolean;
    }>;
    /**
     * 22. Revokes blockchain credential.
     *
     * @param {string} blockchainId - Blockchain record ID
     * @param {string} reason - Revocation reason
     * @returns {Promise<{revoked: boolean; transactionHash: string}>} Revocation result
     *
     * @example
     * ```typescript
     * await service.revokeBlockchainCredential('BC-001', 'Fraud detected');
     * ```
     */
    revokeBlockchainCredential(blockchainId: string, reason: string): Promise<{
        revoked: boolean;
        transactionHash: string;
    }>;
    /**
     * 23. Issues certificate of completion.
     *
     * @param {string} studentId - Student identifier
     * @param {string} courseName - Course name
     * @param {Date} completionDate - Completion date
     * @returns {Promise<{certificateId: string; url: string}>} Certificate
     *
     * @example
     * ```typescript
     * const cert = await service.issueCertificateOfCompletion(
     *   'STU123456',
     *   'Advanced Data Science',
     *   new Date()
     * );
     * ```
     */
    issueCertificateOfCompletion(studentId: string, courseName: string, completionDate: Date): Promise<{
        certificateId: string;
        url: string;
    }>;
    /**
     * 24. Issues micro-credential for competency.
     *
     * @param {string} studentId - Student identifier
     * @param {MicroCredential} microCredData - Micro-credential data
     * @returns {Promise<MicroCredential>} Micro-credential
     *
     * @example
     * ```typescript
     * const microCred = await service.issueMicroCredential('STU123456', {
     *   microCredId: 'MC-001',
     *   studentId: 'STU123456',
     *   credentialName: 'Data Visualization Specialist',
     *   credentialDescription: 'Proficiency in data visualization tools',
     *   competencies: ['Tableau', 'D3.js', 'Python Matplotlib'],
     *   assessmentType: 'Project-based',
     *   stackable: true,
     *   pathwayTo: ['Data Science Certificate'],
     *   issueDate: new Date(),
     *   renewalRequired: false
     * });
     * ```
     */
    issueMicroCredential(studentId: string, microCredData: MicroCredential): Promise<MicroCredential>;
    /**
     * 25. Creates stackable credential pathway.
     *
     * @param {string} pathwayName - Pathway name
     * @param {string[]} microCredentials - Micro-credential IDs
     * @returns {Promise<{pathwayId: string; credentials: string[]}>} Pathway
     *
     * @example
     * ```typescript
     * await service.createStackablePathway('Data Science Track', [
     *   'MC-001', 'MC-002', 'MC-003'
     * ]);
     * ```
     */
    createStackablePathway(pathwayName: string, microCredentials: string[]): Promise<{
        pathwayId: string;
        credentials: string[];
    }>;
    /**
     * 26. Validates continuing education credits.
     *
     * @param {string} certificateId - Certificate identifier
     * @param {number} ceuHours - CEU hours
     * @returns {Promise<{valid: boolean; approved: boolean}>} Validation result
     *
     * @example
     * ```typescript
     * await service.validateContinuingEducationCredits('CERT-001', 15);
     * ```
     */
    validateContinuingEducationCredits(certificateId: string, ceuHours: number): Promise<{
        valid: boolean;
        approved: boolean;
    }>;
    /**
     * 27. Tracks credential expiration and renewal.
     *
     * @param {string} credentialId - Credential identifier
     * @returns {Promise<{expired: boolean; renewalDue?: Date}>} Expiration status
     *
     * @example
     * ```typescript
     * const status = await service.trackCredentialExpiration('CERT-001');
     * ```
     */
    trackCredentialExpiration(credentialId: string): Promise<{
        expired: boolean;
        renewalDue?: Date;
    }>;
    /**
     * 28. Renews expiring credential.
     *
     * @param {string} credentialId - Credential identifier
     * @param {any} renewalEvidence - Renewal evidence
     * @returns {Promise<{renewed: boolean; newExpirationDate: Date}>} Renewal result
     *
     * @example
     * ```typescript
     * await service.renewCredential('CERT-001', { completedCEU: 15 });
     * ```
     */
    renewCredential(credentialId: string, renewalEvidence: any): Promise<{
        renewed: boolean;
        newExpirationDate: Date;
    }>;
    /**
     * 29. Maps competencies to credentials.
     *
     * @param {string[]} competencies - Competency list
     * @returns {Promise<Array<{credentialId: string; name: string}>>} Matching credentials
     *
     * @example
     * ```typescript
     * const creds = await service.mapCompetenciesToCredentials(['Python', 'Data Science']);
     * ```
     */
    mapCompetenciesToCredentials(competencies: string[]): Promise<Array<{
        credentialId: string;
        name: string;
    }>>;
    /**
     * 30. Generates credential portfolio for student.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<{degrees: any[]; certificates: any[]; badges: any[]}>} Portfolio
     *
     * @example
     * ```typescript
     * const portfolio = await service.generateCredentialPortfolio('STU123456');
     * ```
     */
    generateCredentialPortfolio(studentId: string): Promise<{
        degrees: any[];
        certificates: any[];
        badges: any[];
        microCredentials: any[];
    }>;
    /**
     * 31. Produces physical diploma.
     *
     * @param {string} degreeConferralId - Degree conferral ID
     * @param {string} templateId - Diploma template
     * @returns {Promise<DiplomaProduction>} Production record
     *
     * @example
     * ```typescript
     * const diploma = await service.produceDiploma('DEG-001', 'TEMPLATE-BACHELOR');
     * ```
     */
    produceDiploma(degreeConferralId: string, templateId: string): Promise<DiplomaProduction>;
    /**
     * 32. Generates digital diploma with security features.
     *
     * @param {string} diplomaId - Diploma identifier
     * @returns {Promise<Buffer>} Digital diploma PDF
     *
     * @example
     * ```typescript
     * const pdf = await service.generateDigitalDiploma('DIP-001');
     * ```
     */
    generateDigitalDiploma(diplomaId: string): Promise<Buffer>;
    /**
     * 33. Verifies diploma authenticity.
     *
     * @param {string} verificationCode - Verification code
     * @returns {Promise<CredentialVerification>} Verification result
     *
     * @example
     * ```typescript
     * const verification = await service.verifyDiploma('VER-123456');
     * if (verification.status === 'valid') {
     *   console.log('Diploma is authentic');
     * }
     * ```
     */
    verifyDiploma(verificationCode: string): Promise<CredentialVerification>;
    /**
     * 34. Generates QR code for credential verification.
     *
     * @param {string} credentialId - Credential identifier
     * @returns {Promise<string>} QR code data URL
     *
     * @example
     * ```typescript
     * const qrCode = await service.generateVerificationQRCode('DEG-001');
     * ```
     */
    generateVerificationQRCode(credentialId: string): Promise<string>;
    /**
     * 35. Tracks diploma shipment.
     *
     * @param {string} diplomaId - Diploma identifier
     * @param {string} trackingNumber - Tracking number
     * @returns {Promise<{status: string; location: string; estimatedDelivery: Date}>} Tracking info
     *
     * @example
     * ```typescript
     * const tracking = await service.trackDiplomaShipment('DIP-001', 'TRACK123');
     * ```
     */
    trackDiplomaShipment(diplomaId: string, trackingNumber: string): Promise<{
        status: string;
        location: string;
        estimatedDelivery: Date;
    }>;
    /**
     * 36. Issues replacement diploma.
     *
     * @param {string} originalDiplomaId - Original diploma ID
     * @param {string} reason - Replacement reason
     * @returns {Promise<DiplomaProduction>} Replacement diploma
     *
     * @example
     * ```typescript
     * await service.issueReplacementDiploma('DIP-001', 'Lost in mail');
     * ```
     */
    issueReplacementDiploma(originalDiplomaId: string, reason: string): Promise<DiplomaProduction>;
    /**
     * 37. Creates public verification portal link.
     *
     * @param {string} credentialId - Credential identifier
     * @returns {Promise<string>} Public verification URL
     *
     * @example
     * ```typescript
     * const url = await service.createPublicVerificationLink('DEG-001');
     * console.log(`Verify at: ${url}`);
     * ```
     */
    createPublicVerificationLink(credentialId: string): Promise<string>;
    /**
     * 38. Generates comprehensive credential verification report.
     *
     * @param {string} studentId - Student identifier
     * @returns {Promise<any>} Verification report
     *
     * @example
     * ```typescript
     * const report = await service.generateCredentialVerificationReport('STU123456');
     * ```
     */
    generateCredentialVerificationReport(studentId: string): Promise<any>;
}
export default CredentialDegreeManagementCompositeService;
//# sourceMappingURL=credential-degree-management-composite.d.ts.map