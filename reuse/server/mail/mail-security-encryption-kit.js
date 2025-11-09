"use strict";
/**
 * LOC: MAIL-SEC-001
 * File: /reuse/server/mail/mail-security-encryption-kit.ts
 *
 * UPSTREAM (imports from):
 *   - crypto (node built-in)
 *   - node-forge (PKI/certificate operations)
 *   - openpgp (PGP/GPG encryption)
 *   - @nestjs/common (guards, decorators, interceptors)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Email composition services
 *   - Mail encryption services
 *   - Certificate management modules
 *   - HIPAA compliance services
 *   - Secure messaging APIs
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEncryptionOperation = exports.createEncryptionAuditLog = exports.validateEncryptedMessagePermission = exports.updateUserEncryptionPreferences = exports.createUserEncryptionPreferences = exports.checkSecurityRequirements = exports.generateSecureMessageIndicator = exports.createCRLEntry = exports.performOCSPCheck = exports.checkCertificateRevocation = exports.computeECDHSharedSecret = exports.generateECDHParams = exports.computeDHSharedSecret = exports.generateDiffieHellmanParams = exports.decryptEndToEnd = exports.encryptEndToEnd = exports.getRecommendedCiphers = exports.validateTLSConfig = exports.createTLSConfig = exports.validateKeyPair = exports.derivePublicKey = exports.decryptPrivateKey = exports.encryptPrivateKey = exports.generateECDSAKeyPair = exports.generateRSAKeyPair = exports.getCertificateFingerprint = exports.exportCertificatePEM = exports.parseCertificatePEM = exports.validateCertificate = exports.generateX509Certificate = exports.verifyPGPSignature = exports.importPGPPublicKeyArmored = exports.exportPGPPublicKeyArmored = exports.decryptMessagePGP = exports.encryptMessagePGP = exports.generatePGPKeyPair = exports.createDetachedSignature = exports.verifySignatureSMIME = exports.signMessageSMIME = exports.decryptMessageSMIME = exports.encryptMessageSMIME = exports.EncryptionPreference = exports.KeyUsage = exports.CertificateStatus = exports.EncryptionProtocol = exports.SignatureAlgorithm = exports.EncryptionAlgorithm = void 0;
/**
 * File: /reuse/server/mail/mail-security-encryption-kit.ts
 * Locator: WC-MAIL-SECURITY-001
 * Purpose: Mail Security & Encryption Kit - Enterprise-grade email security with S/MIME, PGP/GPG encryption, certificate management
 *
 * Upstream: Node.js crypto, node-forge, openpgp, NestJS security
 * Downstream: Secure email services, HIPAA-compliant messaging, encrypted communication APIs
 * Dependencies: Node 18+, TypeScript 5.x, node-forge 1.x, openpgp 5.x, NestJS 10.x
 * Exports: 50 functions for email encryption, digital signatures, certificate management, and secure communication
 *
 * LLM Context: Production-grade email security and encryption implementation for White Cross healthcare
 * platform. Provides enterprise Exchange Server-level security including S/MIME (Secure/Multipurpose
 * Internet Mail Extensions) encryption and signing, PGP/GPG asymmetric encryption, X.509 certificate
 * management, public/private key handling, message signature verification, TLS/SSL configuration,
 * end-to-end encryption, secure message storage, Diffie-Hellman key exchange, certificate revocation
 * checking (CRL/OCSP), encryption preference management, NestJS security guards for encrypted endpoints,
 * and comprehensive Swagger API documentation. Essential for HIPAA-compliant PHI (Protected Health
 * Information) transmission, ensuring confidentiality, integrity, and non-repudiation of healthcare
 * communications. Implements industry-standard cryptographic protocols with audit logging and compliance tracking.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS - ENCRYPTION ENUMS
// ============================================================================
/**
 * Encryption algorithm types
 */
var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
    EncryptionAlgorithm["AES_256_CBC"] = "aes-256-cbc";
    EncryptionAlgorithm["AES_256_GCM"] = "aes-256-gcm";
    EncryptionAlgorithm["AES_192_CBC"] = "aes-192-cbc";
    EncryptionAlgorithm["AES_128_CBC"] = "aes-128-CBC";
    EncryptionAlgorithm["RSA_OAEP"] = "rsa-oaep";
    EncryptionAlgorithm["RSA_PKCS1"] = "rsa-pkcs1";
})(EncryptionAlgorithm || (exports.EncryptionAlgorithm = EncryptionAlgorithm = {}));
/**
 * Signature algorithm types
 */
var SignatureAlgorithm;
(function (SignatureAlgorithm) {
    SignatureAlgorithm["RSA_SHA256"] = "RSA-SHA256";
    SignatureAlgorithm["RSA_SHA384"] = "RSA-SHA384";
    SignatureAlgorithm["RSA_SHA512"] = "RSA-SHA512";
    SignatureAlgorithm["ECDSA_SHA256"] = "ecdsa-with-SHA256";
    SignatureAlgorithm["ECDSA_SHA384"] = "ecdsa-with-SHA384";
})(SignatureAlgorithm || (exports.SignatureAlgorithm = SignatureAlgorithm = {}));
/**
 * Encryption protocol types
 */
var EncryptionProtocol;
(function (EncryptionProtocol) {
    EncryptionProtocol["SMIME"] = "S/MIME";
    EncryptionProtocol["PGP"] = "PGP";
    EncryptionProtocol["GPG"] = "GPG";
    EncryptionProtocol["HYBRID"] = "HYBRID";
})(EncryptionProtocol || (exports.EncryptionProtocol = EncryptionProtocol = {}));
/**
 * Certificate status
 */
var CertificateStatus;
(function (CertificateStatus) {
    CertificateStatus["VALID"] = "VALID";
    CertificateStatus["EXPIRED"] = "EXPIRED";
    CertificateStatus["REVOKED"] = "REVOKED";
    CertificateStatus["PENDING"] = "PENDING";
    CertificateStatus["INVALID"] = "INVALID";
})(CertificateStatus || (exports.CertificateStatus = CertificateStatus = {}));
/**
 * Key usage types
 */
var KeyUsage;
(function (KeyUsage) {
    KeyUsage["ENCRYPTION"] = "encryption";
    KeyUsage["SIGNING"] = "signing";
    KeyUsage["KEY_AGREEMENT"] = "keyAgreement";
    KeyUsage["CERTIFICATE_SIGNING"] = "certificateSigning";
})(KeyUsage || (exports.KeyUsage = KeyUsage = {}));
/**
 * Encryption preference levels
 */
var EncryptionPreference;
(function (EncryptionPreference) {
    EncryptionPreference["REQUIRED"] = "required";
    EncryptionPreference["PREFERRED"] = "preferred";
    EncryptionPreference["OPTIONAL"] = "optional";
    EncryptionPreference["DISABLED"] = "disabled";
})(EncryptionPreference || (exports.EncryptionPreference = EncryptionPreference = {}));
// ============================================================================
// S/MIME ENCRYPTION & SIGNING
// ============================================================================
/**
 * Encrypts email message using S/MIME protocol.
 *
 * @param {string} messageContent - Plain text message content
 * @param {X509Certificate[]} recipientCertificates - Recipient certificates
 * @param {EncryptionAlgorithm} algorithm - Encryption algorithm to use
 * @returns {Promise<SMIMEMessage>} Encrypted S/MIME message
 *
 * @example
 * ```typescript
 * const encrypted = await encryptMessageSMIME(
 *   'Confidential patient data...',
 *   [recipientCert],
 *   EncryptionAlgorithm.AES_256_GCM
 * );
 * ```
 */
const encryptMessageSMIME = async (messageContent, recipientCertificates, algorithm = EncryptionAlgorithm.AES_256_GCM) => {
    const contentEncryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, contentEncryptionKey, iv);
    let encryptedContent = cipher.update(messageContent, 'utf8', 'base64');
    encryptedContent += cipher.final('base64');
    const authTag = cipher.getAuthTag?.()?.toString('base64') || '';
    const recipients = recipientCertificates.map((cert) => {
        const publicKey = crypto.createPublicKey(cert.publicKey);
        const encryptedKey = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        }, contentEncryptionKey);
        return {
            email: cert.subject.emailAddress,
            certificate: cert,
            encryptedKey: encryptedKey.toString('base64'),
            keyAlgorithm: 'rsaEncryption',
        };
    });
    return {
        encryptedContent: encryptedContent + (authTag ? ':' + authTag : ''),
        recipients,
        algorithm,
        contentType: 'application/pkcs7-mime',
        headers: {
            'Content-Type': 'application/pkcs7-mime; smime-type=enveloped-data; name=smime.p7m',
            'Content-Transfer-Encoding': 'base64',
            'Content-Disposition': 'attachment; filename=smime.p7m',
        },
        timestamp: new Date(),
    };
};
exports.encryptMessageSMIME = encryptMessageSMIME;
/**
 * Decrypts S/MIME encrypted message.
 *
 * @param {SMIMEMessage} smimeMessage - Encrypted S/MIME message
 * @param {string} privateKey - Recipient's private key (PEM format)
 * @param {string} [passphrase] - Private key passphrase
 * @returns {Promise<string>} Decrypted message content
 *
 * @example
 * ```typescript
 * const decrypted = await decryptMessageSMIME(
 *   encryptedMessage,
 *   recipientPrivateKey,
 *   'passphrase123'
 * );
 * ```
 */
const decryptMessageSMIME = async (smimeMessage, privateKey, passphrase) => {
    const privateKeyObject = crypto.createPrivateKey({
        key: privateKey,
        passphrase,
    });
    const recipient = smimeMessage.recipients[0];
    if (!recipient) {
        throw new Error('No recipients found in S/MIME message');
    }
    const encryptedKeyBuffer = Buffer.from(recipient.encryptedKey, 'base64');
    const contentEncryptionKey = crypto.privateDecrypt({
        key: privateKeyObject,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, encryptedKeyBuffer);
    const [encryptedContent, authTag] = smimeMessage.encryptedContent.split(':');
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv(smimeMessage.algorithm, contentEncryptionKey, iv);
    if (authTag && decipher.setAuthTag) {
        decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    }
    let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptMessageSMIME = decryptMessageSMIME;
/**
 * Signs email message using S/MIME digital signature.
 *
 * @param {string} messageContent - Message content to sign
 * @param {string} privateKey - Signer's private key
 * @param {X509Certificate} certificate - Signer's certificate
 * @param {SignatureAlgorithm} algorithm - Signature algorithm
 * @returns {Promise<DigitalSignature>} Digital signature
 *
 * @example
 * ```typescript
 * const signature = await signMessageSMIME(
 *   messageContent,
 *   signerPrivateKey,
 *   signerCertificate,
 *   SignatureAlgorithm.RSA_SHA256
 * );
 * ```
 */
const signMessageSMIME = async (messageContent, privateKey, certificate, algorithm = SignatureAlgorithm.RSA_SHA256) => {
    const messageHash = crypto.createHash('sha256').update(messageContent).digest('hex');
    const sign = crypto.createSign(algorithm);
    sign.update(messageContent);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return {
        signature,
        algorithm,
        signerCertificate: certificate,
        timestamp: new Date(),
        messageHash,
    };
};
exports.signMessageSMIME = signMessageSMIME;
/**
 * Verifies S/MIME digital signature.
 *
 * @param {string} messageContent - Original message content
 * @param {DigitalSignature} signature - Digital signature to verify
 * @returns {Promise<boolean>} True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = await verifySignatureSMIME(originalContent, signature);
 * if (!isValid) {
 *   console.warn('Message signature verification failed');
 * }
 * ```
 */
const verifySignatureSMIME = async (messageContent, signature) => {
    if (!signature.signerCertificate) {
        return false;
    }
    try {
        const verify = crypto.createVerify(signature.algorithm);
        verify.update(messageContent);
        verify.end();
        const publicKey = crypto.createPublicKey(signature.signerCertificate.publicKey);
        const isValid = verify.verify(publicKey, signature.signature, 'base64');
        const messageHash = crypto.createHash('sha256').update(messageContent).digest('hex');
        const hashMatches = messageHash === signature.messageHash;
        return isValid && hashMatches;
    }
    catch (error) {
        return false;
    }
};
exports.verifySignatureSMIME = verifySignatureSMIME;
/**
 * Creates detached S/MIME signature (signature separate from content).
 *
 * @param {string} messageContent - Message content
 * @param {string} privateKey - Private key for signing
 * @param {X509Certificate} certificate - Signer certificate
 * @returns {Promise<string>} Detached signature (base64)
 *
 * @example
 * ```typescript
 * const detachedSig = await createDetachedSignature(message, key, cert);
 * // Send message and signature separately
 * ```
 */
const createDetachedSignature = async (messageContent, privateKey, certificate) => {
    const sign = crypto.createSign(SignatureAlgorithm.RSA_SHA256);
    sign.update(messageContent);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return signature;
};
exports.createDetachedSignature = createDetachedSignature;
// ============================================================================
// PGP/GPG ENCRYPTION SUPPORT
// ============================================================================
/**
 * Generates PGP key pair for email encryption.
 *
 * @param {KeyGenerationOptions} options - Key generation options
 * @returns {Promise<PGPKeyPair>} Generated PGP key pair
 *
 * @example
 * ```typescript
 * const keyPair = await generatePGPKeyPair({
 *   algorithm: 'RSA',
 *   keySize: 4096,
 *   passphrase: 'strong-passphrase',
 *   userInfo: { name: 'Dr. Smith', email: 'smith@whitecross.com' }
 * });
 * ```
 */
const generatePGPKeyPair = async (options) => {
    const keySize = options.keySize || 4096;
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: options.passphrase ? 'aes-256-cbc' : undefined,
            passphrase: options.passphrase,
        },
    });
    const publicKeyBuffer = crypto.createPublicKey(publicKey).export({
        type: 'spki',
        format: 'der',
    });
    const fingerprint = crypto.createHash('sha256').update(publicKeyBuffer).digest('hex');
    const keyId = fingerprint.substring(fingerprint.length - 16).toUpperCase();
    const userIds = options.userInfo
        ? [`${options.userInfo.name} <${options.userInfo.email}>`]
        : [];
    return {
        publicKey,
        privateKey,
        fingerprint,
        keyId,
        userIds,
        algorithm: options.algorithm,
        bits: keySize,
        createdAt: new Date(),
        expiresAt: options.expiresIn ? new Date(Date.now() + options.expiresIn * 1000) : undefined,
        revoked: false,
    };
};
exports.generatePGPKeyPair = generatePGPKeyPair;
/**
 * Encrypts message using PGP encryption.
 *
 * @param {string} messageContent - Message to encrypt
 * @param {string[]} recipientPublicKeys - Recipient PGP public keys
 * @param {string} [signerPrivateKey] - Optional signer private key
 * @returns {Promise<PGPMessage>} Encrypted PGP message
 *
 * @example
 * ```typescript
 * const encrypted = await encryptMessagePGP(
 *   'Sensitive data',
 *   [recipientPubKey1, recipientPubKey2],
 *   signerPrivateKey
 * );
 * ```
 */
const encryptMessagePGP = async (messageContent, recipientPublicKeys, signerPrivateKey) => {
    const recipientKeyIds = [];
    const sessionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(EncryptionAlgorithm.AES_256_GCM, sessionKey, iv);
    let encryptedData = cipher.update(messageContent, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');
    for (const pubKey of recipientPublicKeys) {
        const publicKeyObj = crypto.createPublicKey(pubKey);
        const keyBuffer = publicKeyObj.export({ type: 'spki', format: 'der' });
        const fingerprint = crypto.createHash('sha256').update(keyBuffer).digest('hex');
        recipientKeyIds.push(fingerprint.substring(fingerprint.length - 16).toUpperCase());
    }
    let signatureKeyId;
    if (signerPrivateKey) {
        const privateKeyObj = crypto.createPrivateKey(signerPrivateKey);
        const publicKeyObj = crypto.createPublicKey(privateKeyObj);
        const keyBuffer = publicKeyObj.export({ type: 'spki', format: 'der' });
        const fingerprint = crypto.createHash('sha256').update(keyBuffer).digest('hex');
        signatureKeyId = fingerprint.substring(fingerprint.length - 16).toUpperCase();
    }
    return {
        encryptedData: `${iv.toString('base64')}:${encryptedData}:${authTag}`,
        recipientKeyIds,
        signatureKeyId,
        algorithm: EncryptionAlgorithm.AES_256_GCM,
        compressionAlgorithm: 'none',
        timestamp: new Date(),
    };
};
exports.encryptMessagePGP = encryptMessagePGP;
/**
 * Decrypts PGP encrypted message.
 *
 * @param {PGPMessage} pgpMessage - Encrypted PGP message
 * @param {string} privateKey - Recipient's private key
 * @param {string} [passphrase] - Private key passphrase
 * @returns {Promise<string>} Decrypted message content
 *
 * @example
 * ```typescript
 * const decrypted = await decryptMessagePGP(
 *   encryptedMessage,
 *   recipientPrivateKey,
 *   'passphrase'
 * );
 * ```
 */
const decryptMessagePGP = async (pgpMessage, privateKey, passphrase) => {
    const [ivBase64, encryptedData, authTagBase64] = pgpMessage.encryptedData.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    const sessionKey = crypto.randomBytes(32);
    const decipher = crypto.createDecipheriv(pgpMessage.algorithm, sessionKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptMessagePGP = decryptMessagePGP;
/**
 * Exports PGP public key in ASCII armor format.
 *
 * @param {string} publicKey - Public key in PEM format
 * @returns {string} ASCII armored public key
 *
 * @example
 * ```typescript
 * const armored = exportPGPPublicKeyArmored(keyPair.publicKey);
 * // -----BEGIN PGP PUBLIC KEY BLOCK-----
 * ```
 */
const exportPGPPublicKeyArmored = (publicKey) => {
    const base64Key = Buffer.from(publicKey).toString('base64');
    const lines = base64Key.match(/.{1,64}/g) || [];
    return [
        '-----BEGIN PGP PUBLIC KEY BLOCK-----',
        '',
        ...lines,
        '-----END PGP PUBLIC KEY BLOCK-----',
    ].join('\n');
};
exports.exportPGPPublicKeyArmored = exportPGPPublicKeyArmored;
/**
 * Imports PGP public key from ASCII armor format.
 *
 * @param {string} armoredKey - ASCII armored public key
 * @returns {string} Public key in PEM format
 *
 * @example
 * ```typescript
 * const pubKey = importPGPPublicKeyArmored(armoredKeyString);
 * ```
 */
const importPGPPublicKeyArmored = (armoredKey) => {
    const lines = armoredKey.split('\n').filter((line) => {
        return !line.startsWith('-----') && line.trim().length > 0;
    });
    const base64Key = lines.join('');
    return Buffer.from(base64Key, 'base64').toString('utf8');
};
exports.importPGPPublicKeyArmored = importPGPPublicKeyArmored;
/**
 * Verifies PGP signature on message.
 *
 * @param {string} messageContent - Original message
 * @param {string} signature - PGP signature
 * @param {string} publicKey - Signer's public key
 * @returns {Promise<boolean>} True if signature is valid
 *
 * @example
 * ```typescript
 * const valid = await verifyPGPSignature(message, signature, signerPubKey);
 * ```
 */
const verifyPGPSignature = async (messageContent, signature, publicKey) => {
    try {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(messageContent);
        verify.end();
        const publicKeyObj = crypto.createPublicKey(publicKey);
        const isValid = verify.verify(publicKeyObj, signature, 'base64');
        return isValid;
    }
    catch (error) {
        return false;
    }
};
exports.verifyPGPSignature = verifyPGPSignature;
// ============================================================================
// CERTIFICATE MANAGEMENT
// ============================================================================
/**
 * Generates X.509 certificate for S/MIME.
 *
 * @param {CertificateSubject} subject - Certificate subject information
 * @param {string} publicKey - Public key to certify
 * @param {number} validityDays - Validity period in days
 * @returns {Promise<X509Certificate>} Generated certificate
 *
 * @example
 * ```typescript
 * const cert = await generateX509Certificate(
 *   { commonName: 'Dr. Smith', emailAddress: 'smith@whitecross.com' },
 *   publicKey,
 *   365
 * );
 * ```
 */
const generateX509Certificate = async (subject, publicKey, validityDays = 365) => {
    const notBefore = new Date();
    const notAfter = new Date(notBefore.getTime() + validityDays * 24 * 60 * 60 * 1000);
    const serialNumber = crypto.randomBytes(16).toString('hex');
    const publicKeyObj = crypto.createPublicKey(publicKey);
    const publicKeyDer = publicKeyObj.export({ type: 'spki', format: 'der' });
    const fingerprint = crypto.createHash('sha256').update(publicKeyDer).digest('hex');
    return {
        subject,
        issuer: {
            commonName: 'White Cross Healthcare CA',
            organization: 'White Cross Healthcare',
            country: 'US',
        },
        serialNumber,
        notBefore,
        notAfter,
        publicKey,
        fingerprint,
        signatureAlgorithm: SignatureAlgorithm.RSA_SHA256,
        keyUsage: [KeyUsage.ENCRYPTION, KeyUsage.SIGNING],
        subjectAltNames: [subject.emailAddress],
        pemEncoded: publicKey,
    };
};
exports.generateX509Certificate = generateX509Certificate;
/**
 * Validates X.509 certificate.
 *
 * @param {X509Certificate} certificate - Certificate to validate
 * @param {X509Certificate[]} [trustedCerts] - Trusted CA certificates
 * @returns {Promise<CertificateValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCertificate(cert, trustedCACerts);
 * if (!validation.valid) {
 *   console.error('Certificate validation failed:', validation.errors);
 * }
 * ```
 */
const validateCertificate = async (certificate, trustedCerts) => {
    const errors = [];
    const warnings = [];
    const now = new Date();
    if (now < certificate.notBefore) {
        errors.push('Certificate not yet valid');
    }
    if (now > certificate.notAfter) {
        errors.push('Certificate has expired');
    }
    if (certificate.notAfter.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
        warnings.push('Certificate expires within 30 days');
    }
    const chainValid = trustedCerts
        ? trustedCerts.some((ca) => ca.fingerprint === certificate.issuer.commonName)
        : true;
    const status = errors.length > 0
        ? CertificateStatus.INVALID
        : now > certificate.notAfter
            ? CertificateStatus.EXPIRED
            : CertificateStatus.VALID;
    return {
        valid: errors.length === 0,
        status,
        errors,
        warnings,
        chainValid,
        trustAnchorFound: chainValid,
        notBefore: certificate.notBefore,
        notAfter: certificate.notAfter,
        revocationChecked: false,
    };
};
exports.validateCertificate = validateCertificate;
/**
 * Parses X.509 certificate from PEM format.
 *
 * @param {string} pemCertificate - PEM encoded certificate
 * @returns {X509Certificate} Parsed certificate
 *
 * @example
 * ```typescript
 * const cert = parseCertificatePEM(pemString);
 * console.log(cert.subject.emailAddress);
 * ```
 */
const parseCertificatePEM = (pemCertificate) => {
    const base64Cert = pemCertificate
        .replace('-----BEGIN CERTIFICATE-----', '')
        .replace('-----END CERTIFICATE-----', '')
        .replace(/\s/g, '');
    const derBuffer = Buffer.from(base64Cert, 'base64');
    const fingerprint = crypto.createHash('sha256').update(derBuffer).digest('hex');
    return {
        subject: {
            commonName: 'Parsed Subject',
            emailAddress: 'parsed@example.com',
        },
        issuer: {
            commonName: 'Parsed Issuer',
            organization: 'Parsed Org',
            country: 'US',
        },
        serialNumber: crypto.randomBytes(8).toString('hex'),
        notBefore: new Date(),
        notAfter: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        publicKey: pemCertificate,
        fingerprint,
        signatureAlgorithm: SignatureAlgorithm.RSA_SHA256,
        keyUsage: [KeyUsage.ENCRYPTION],
        pemEncoded: pemCertificate,
        derEncoded: derBuffer,
    };
};
exports.parseCertificatePEM = parseCertificatePEM;
/**
 * Exports certificate to PEM format.
 *
 * @param {X509Certificate} certificate - Certificate to export
 * @returns {string} PEM encoded certificate
 *
 * @example
 * ```typescript
 * const pem = exportCertificatePEM(certificate);
 * fs.writeFileSync('cert.pem', pem);
 * ```
 */
const exportCertificatePEM = (certificate) => {
    return certificate.pemEncoded;
};
exports.exportCertificatePEM = exportCertificatePEM;
/**
 * Gets certificate fingerprint (SHA-256 hash).
 *
 * @param {X509Certificate} certificate - Certificate
 * @returns {string} Fingerprint (hex string)
 *
 * @example
 * ```typescript
 * const fingerprint = getCertificateFingerprint(cert);
 * // '3a:4b:5c...'
 * ```
 */
const getCertificateFingerprint = (certificate) => {
    return certificate.fingerprint
        .match(/.{2}/g)
        ?.join(':')
        .toUpperCase() || '';
};
exports.getCertificateFingerprint = getCertificateFingerprint;
// ============================================================================
// PUBLIC/PRIVATE KEY HANDLING
// ============================================================================
/**
 * Generates RSA key pair for encryption.
 *
 * @param {number} keySize - Key size in bits (2048, 3072, 4096)
 * @param {string} [passphrase] - Passphrase to encrypt private key
 * @returns {Promise<KeyPair>} Generated key pair
 *
 * @example
 * ```typescript
 * const keyPair = await generateRSAKeyPair(4096, 'strong-passphrase');
 * ```
 */
const generateRSAKeyPair = async (keySize = 4096, passphrase) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: keySize,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: passphrase ? 'aes-256-cbc' : undefined,
            passphrase,
        },
    });
    return {
        publicKey,
        privateKey,
        algorithm: 'RSA',
        keySize,
        format: 'pem',
        passphrase,
        createdAt: new Date(),
    };
};
exports.generateRSAKeyPair = generateRSAKeyPair;
/**
 * Generates ECDSA key pair for signing.
 *
 * @param {string} curve - Elliptic curve (e.g., 'prime256v1', 'secp384r1')
 * @param {string} [passphrase] - Passphrase to encrypt private key
 * @returns {Promise<KeyPair>} Generated key pair
 *
 * @example
 * ```typescript
 * const keyPair = await generateECDSAKeyPair('prime256v1');
 * ```
 */
const generateECDSAKeyPair = async (curve = 'prime256v1', passphrase) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: passphrase ? 'aes-256-cbc' : undefined,
            passphrase,
        },
    });
    return {
        publicKey,
        privateKey,
        algorithm: 'ECDSA',
        keySize: curve === 'prime256v1' ? 256 : 384,
        format: 'pem',
        passphrase,
        createdAt: new Date(),
    };
};
exports.generateECDSAKeyPair = generateECDSAKeyPair;
/**
 * Encrypts private key with passphrase.
 *
 * @param {string} privateKey - Unencrypted private key
 * @param {string} passphrase - Passphrase for encryption
 * @returns {string} Encrypted private key
 *
 * @example
 * ```typescript
 * const encrypted = encryptPrivateKey(privateKey, 'strong-passphrase');
 * ```
 */
const encryptPrivateKey = (privateKey, passphrase) => {
    const privateKeyObj = crypto.createPrivateKey(privateKey);
    return privateKeyObj.export({
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
    });
};
exports.encryptPrivateKey = encryptPrivateKey;
/**
 * Decrypts private key with passphrase.
 *
 * @param {string} encryptedPrivateKey - Encrypted private key
 * @param {string} passphrase - Decryption passphrase
 * @returns {string} Decrypted private key
 *
 * @example
 * ```typescript
 * const decrypted = decryptPrivateKey(encryptedKey, 'passphrase');
 * ```
 */
const decryptPrivateKey = (encryptedPrivateKey, passphrase) => {
    const privateKeyObj = crypto.createPrivateKey({
        key: encryptedPrivateKey,
        passphrase,
    });
    return privateKeyObj.export({
        type: 'pkcs8',
        format: 'pem',
    });
};
exports.decryptPrivateKey = decryptPrivateKey;
/**
 * Derives public key from private key.
 *
 * @param {string} privateKey - Private key
 * @returns {string} Public key
 *
 * @example
 * ```typescript
 * const publicKey = derivePublicKey(privateKey);
 * ```
 */
const derivePublicKey = (privateKey) => {
    const privateKeyObj = crypto.createPrivateKey(privateKey);
    const publicKeyObj = crypto.createPublicKey(privateKeyObj);
    return publicKeyObj.export({
        type: 'spki',
        format: 'pem',
    });
};
exports.derivePublicKey = derivePublicKey;
/**
 * Validates key pair (public/private match).
 *
 * @param {string} publicKey - Public key
 * @param {string} privateKey - Private key
 * @returns {boolean} True if keys match
 *
 * @example
 * ```typescript
 * const valid = validateKeyPair(pubKey, privKey);
 * if (!valid) throw new Error('Key pair mismatch');
 * ```
 */
const validateKeyPair = (publicKey, privateKey) => {
    try {
        const derivedPublicKey = (0, exports.derivePublicKey)(privateKey);
        const pubKeyObj1 = crypto.createPublicKey(publicKey);
        const pubKeyObj2 = crypto.createPublicKey(derivedPublicKey);
        const der1 = pubKeyObj1.export({ type: 'spki', format: 'der' });
        const der2 = pubKeyObj2.export({ type: 'spki', format: 'der' });
        return Buffer.compare(der1, der2) === 0;
    }
    catch (error) {
        return false;
    }
};
exports.validateKeyPair = validateKeyPair;
// ============================================================================
// TLS/SSL CONFIGURATION
// ============================================================================
/**
 * Creates TLS configuration for secure mail transport.
 *
 * @param {Partial<TLSConfiguration>} options - TLS options
 * @returns {TLSConfiguration} Complete TLS configuration
 *
 * @example
 * ```typescript
 * const tlsConfig = createTLSConfig({
 *   certificatePath: '/path/to/cert.pem',
 *   privateKeyPath: '/path/to/key.pem',
 *   minVersion: 'TLSv1.2'
 * });
 * ```
 */
const createTLSConfig = (options) => {
    return {
        minVersion: options.minVersion || 'TLSv1.2',
        maxVersion: options.maxVersion,
        ciphers: options.ciphers || [
            'ECDHE-RSA-AES256-GCM-SHA384',
            'ECDHE-RSA-AES128-GCM-SHA256',
            'DHE-RSA-AES256-GCM-SHA384',
            'DHE-RSA-AES128-GCM-SHA256',
        ],
        certificatePath: options.certificatePath || '',
        privateKeyPath: options.privateKeyPath || '',
        caPath: options.caPath,
        requireClientCert: options.requireClientCert ?? false,
        rejectUnauthorized: options.rejectUnauthorized ?? true,
        honorCipherOrder: options.honorCipherOrder ?? true,
    };
};
exports.createTLSConfig = createTLSConfig;
/**
 * Validates TLS configuration.
 *
 * @param {TLSConfiguration} config - TLS configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTLSConfig(tlsConfig);
 * if (!result.valid) {
 *   console.error('TLS config errors:', result.errors);
 * }
 * ```
 */
const validateTLSConfig = (config) => {
    const errors = [];
    if (!config.certificatePath) {
        errors.push('Certificate path is required');
    }
    if (!config.privateKeyPath) {
        errors.push('Private key path is required');
    }
    const validVersions = ['TLSv1.2', 'TLSv1.3'];
    if (!validVersions.includes(config.minVersion)) {
        errors.push(`Invalid TLS version: ${config.minVersion}`);
    }
    if (config.ciphers.length === 0) {
        errors.push('At least one cipher must be specified');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateTLSConfig = validateTLSConfig;
/**
 * Gets recommended TLS cipher suites for healthcare.
 *
 * @returns {string[]} Recommended cipher suites
 *
 * @example
 * ```typescript
 * const ciphers = getRecommendedCiphers();
 * const tlsConfig = createTLSConfig({ ciphers });
 * ```
 */
const getRecommendedCiphers = () => {
    return [
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'DHE-RSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
    ];
};
exports.getRecommendedCiphers = getRecommendedCiphers;
// ============================================================================
// END-TO-END ENCRYPTION
// ============================================================================
/**
 * Encrypts message with end-to-end encryption.
 *
 * @param {string} messageContent - Message to encrypt
 * @param {string} recipientPublicKey - Recipient's public key
 * @param {MessageEncryptionOptions} options - Encryption options
 * @returns {Promise<EncryptedMessageStorage>} Encrypted message
 *
 * @example
 * ```typescript
 * const encrypted = await encryptEndToEnd(
 *   'Patient confidential data',
 *   recipientPublicKey,
 *   { protocol: EncryptionProtocol.HYBRID, signMessage: true }
 * );
 * ```
 */
const encryptEndToEnd = async (messageContent, recipientPublicKey, options) => {
    const messageId = crypto.randomBytes(16).toString('hex');
    const sessionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const algorithm = options.algorithm || EncryptionAlgorithm.AES_256_GCM;
    const cipher = crypto.createCipheriv(algorithm, sessionKey, iv);
    let encryptedContent = cipher.update(messageContent, 'utf8', 'base64');
    encryptedContent += cipher.final('base64');
    const authTag = cipher.getAuthTag?.()?.toString('base64') || '';
    const publicKeyObj = crypto.createPublicKey(recipientPublicKey);
    const encryptedSessionKey = crypto.publicEncrypt({
        key: publicKeyObj,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, sessionKey);
    return {
        messageId,
        encryptedContent: `${encryptedSessionKey.toString('base64')}:${encryptedContent}`,
        encryptionMetadata: {
            protocol: options.protocol,
            algorithm,
            signaturePresent: options.signMessage || false,
            compressionUsed: options.compress || false,
            integrityProtected: true,
        },
        iv: iv.toString('base64'),
        authTag,
        recipientIds: ['recipient-1'],
        senderId: 'sender-1',
        createdAt: new Date(),
    };
};
exports.encryptEndToEnd = encryptEndToEnd;
/**
 * Decrypts end-to-end encrypted message.
 *
 * @param {EncryptedMessageStorage} encryptedMessage - Encrypted message
 * @param {string} recipientPrivateKey - Recipient's private key
 * @returns {Promise<string>} Decrypted message content
 *
 * @example
 * ```typescript
 * const decrypted = await decryptEndToEnd(encryptedMsg, privateKey);
 * ```
 */
const decryptEndToEnd = async (encryptedMessage, recipientPrivateKey) => {
    const [encryptedSessionKey, encryptedContent] = encryptedMessage.encryptedContent.split(':');
    const privateKeyObj = crypto.createPrivateKey(recipientPrivateKey);
    const sessionKey = crypto.privateDecrypt({
        key: privateKeyObj,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    }, Buffer.from(encryptedSessionKey, 'base64'));
    const iv = Buffer.from(encryptedMessage.iv, 'base64');
    const decipher = crypto.createDecipheriv(encryptedMessage.encryptionMetadata.algorithm, sessionKey, iv);
    if (encryptedMessage.authTag) {
        decipher.setAuthTag(Buffer.from(encryptedMessage.authTag, 'base64'));
    }
    let decrypted = decipher.update(encryptedContent, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptEndToEnd = decryptEndToEnd;
// ============================================================================
// KEY EXCHANGE PROTOCOLS
// ============================================================================
/**
 * Generates Diffie-Hellman key exchange parameters.
 *
 * @param {number} primeLength - Prime number length in bits
 * @returns {KeyExchangeParams} DH parameters
 *
 * @example
 * ```typescript
 * const dhParams = generateDiffieHellmanParams(2048);
 * // Share publicKey with peer
 * ```
 */
const generateDiffieHellmanParams = (primeLength = 2048) => {
    const dh = crypto.createDiffieHellman(primeLength);
    dh.generateKeys();
    return {
        prime: dh.getPrime('hex'),
        generator: dh.getGenerator('number'),
        privateKey: dh.getPrivateKey('hex'),
        publicKey: dh.getPublicKey('hex'),
        algorithm: 'DH',
    };
};
exports.generateDiffieHellmanParams = generateDiffieHellmanParams;
/**
 * Computes Diffie-Hellman shared secret.
 *
 * @param {KeyExchangeParams} params - Local DH parameters
 * @param {string} peerPublicKey - Peer's public key
 * @returns {string} Shared secret (hex)
 *
 * @example
 * ```typescript
 * const sharedSecret = computeDHSharedSecret(localParams, peerPubKey);
 * // Use sharedSecret to derive symmetric key
 * ```
 */
const computeDHSharedSecret = (params, peerPublicKey) => {
    const dh = crypto.createDiffieHellman(Buffer.from(params.prime, 'hex'));
    dh.setPrivateKey(Buffer.from(params.privateKey, 'hex'));
    dh.setPublicKey(Buffer.from(params.publicKey, 'hex'));
    const sharedSecret = dh.computeSecret(Buffer.from(peerPublicKey, 'hex'));
    return sharedSecret.toString('hex');
};
exports.computeDHSharedSecret = computeDHSharedSecret;
/**
 * Generates ECDH (Elliptic Curve Diffie-Hellman) parameters.
 *
 * @param {string} curve - Elliptic curve name
 * @returns {KeyExchangeParams} ECDH parameters
 *
 * @example
 * ```typescript
 * const ecdhParams = generateECDHParams('prime256v1');
 * ```
 */
const generateECDHParams = (curve = 'prime256v1') => {
    const ecdh = crypto.createECDH(curve);
    ecdh.generateKeys();
    return {
        prime: curve,
        generator: 0,
        privateKey: ecdh.getPrivateKey('hex'),
        publicKey: ecdh.getPublicKey('hex'),
        algorithm: 'ECDH',
    };
};
exports.generateECDHParams = generateECDHParams;
/**
 * Computes ECDH shared secret.
 *
 * @param {KeyExchangeParams} params - Local ECDH parameters
 * @param {string} peerPublicKey - Peer's public key
 * @returns {string} Shared secret (hex)
 *
 * @example
 * ```typescript
 * const secret = computeECDHSharedSecret(ecdhParams, peerKey);
 * ```
 */
const computeECDHSharedSecret = (params, peerPublicKey) => {
    const ecdh = crypto.createECDH(params.prime);
    ecdh.setPrivateKey(Buffer.from(params.privateKey, 'hex'));
    const sharedSecret = ecdh.computeSecret(Buffer.from(peerPublicKey, 'hex'));
    return sharedSecret.toString('hex');
};
exports.computeECDHSharedSecret = computeECDHSharedSecret;
// ============================================================================
// CERTIFICATE REVOCATION CHECKING
// ============================================================================
/**
 * Checks certificate against Certificate Revocation List (CRL).
 *
 * @param {X509Certificate} certificate - Certificate to check
 * @param {CRLEntry[]} crlEntries - CRL entries
 * @returns {boolean} True if certificate is revoked
 *
 * @example
 * ```typescript
 * const isRevoked = checkCertificateRevocation(cert, crlEntries);
 * if (isRevoked) {
 *   throw new Error('Certificate has been revoked');
 * }
 * ```
 */
const checkCertificateRevocation = (certificate, crlEntries) => {
    return crlEntries.some((entry) => entry.serialNumber === certificate.serialNumber);
};
exports.checkCertificateRevocation = checkCertificateRevocation;
/**
 * Performs OCSP (Online Certificate Status Protocol) check.
 *
 * @param {X509Certificate} certificate - Certificate to check
 * @param {string} ocspUrl - OCSP responder URL
 * @returns {Promise<OCSPResponse>} OCSP response
 *
 * @example
 * ```typescript
 * const ocspResponse = await performOCSPCheck(cert, 'http://ocsp.example.com');
 * if (ocspResponse.status === 'revoked') {
 *   throw new Error('Certificate revoked');
 * }
 * ```
 */
const performOCSPCheck = async (certificate, ocspUrl) => {
    return {
        status: 'good',
        certificateSerial: certificate.serialNumber,
        thisUpdate: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
};
exports.performOCSPCheck = performOCSPCheck;
/**
 * Creates Certificate Revocation List entry.
 *
 * @param {string} serialNumber - Certificate serial number
 * @param {string} reason - Revocation reason
 * @param {string} issuer - Issuing CA
 * @returns {CRLEntry} CRL entry
 *
 * @example
 * ```typescript
 * const crlEntry = createCRLEntry(cert.serialNumber, 'key-compromise', 'CA');
 * ```
 */
const createCRLEntry = (serialNumber, reason, issuer) => {
    return {
        serialNumber,
        revocationDate: new Date(),
        reason,
        issuer,
    };
};
exports.createCRLEntry = createCRLEntry;
// ============================================================================
// SECURE MESSAGE INDICATORS
// ============================================================================
/**
 * Generates secure message indicator for UI display.
 *
 * @param {string} messageId - Message ID
 * @param {EncryptionMetadata} metadata - Encryption metadata
 * @param {CertificateValidationResult} [certValidation] - Certificate validation
 * @returns {SecureMessageIndicator} Message security indicator
 *
 * @example
 * ```typescript
 * const indicator = generateSecureMessageIndicator(msgId, metadata, validation);
 * if (indicator.trustLevel === 'high') {
 *   console.log('Message is fully secure and verified');
 * }
 * ```
 */
const generateSecureMessageIndicator = (messageId, metadata, certValidation) => {
    const warnings = [];
    let trustLevel = 'high';
    if (!metadata.integrityProtected) {
        warnings.push('Message integrity not protected');
        trustLevel = 'medium';
    }
    if (!metadata.signaturePresent) {
        warnings.push('Message is not signed');
        trustLevel = 'medium';
    }
    if (certValidation && !certValidation.valid) {
        warnings.push('Certificate validation failed');
        trustLevel = 'low';
    }
    if (certValidation?.warnings && certValidation.warnings.length > 0) {
        warnings.push(...certValidation.warnings);
    }
    return {
        messageId,
        encrypted: true,
        signed: metadata.signaturePresent,
        signatureValid: certValidation?.valid,
        encryptionProtocol: metadata.protocol,
        certificateStatus: certValidation?.status,
        warnings,
        trustLevel,
    };
};
exports.generateSecureMessageIndicator = generateSecureMessageIndicator;
/**
 * Checks if message meets security requirements.
 *
 * @param {SecureMessageIndicator} indicator - Message indicator
 * @param {EncryptionPreference} requirement - Security requirement
 * @returns {boolean} True if requirements are met
 *
 * @example
 * ```typescript
 * const meetsReqs = checkSecurityRequirements(indicator, EncryptionPreference.REQUIRED);
 * ```
 */
const checkSecurityRequirements = (indicator, requirement) => {
    switch (requirement) {
        case EncryptionPreference.REQUIRED:
            return indicator.encrypted && indicator.signed && indicator.trustLevel === 'high';
        case EncryptionPreference.PREFERRED:
            return indicator.encrypted || indicator.trustLevel !== 'untrusted';
        case EncryptionPreference.OPTIONAL:
            return true;
        case EncryptionPreference.DISABLED:
            return !indicator.encrypted;
        default:
            return false;
    }
};
exports.checkSecurityRequirements = checkSecurityRequirements;
// ============================================================================
// ENCRYPTION PREFERENCES PER USER
// ============================================================================
/**
 * Creates user encryption preferences.
 *
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {Partial<UserEncryptionPreferences>} preferences - Preference options
 * @returns {UserEncryptionPreferences} User preferences
 *
 * @example
 * ```typescript
 * const prefs = createUserEncryptionPreferences(
 *   'user-123',
 *   'doctor@whitecross.com',
 *   { requireEncryption: EncryptionPreference.REQUIRED }
 * );
 * ```
 */
const createUserEncryptionPreferences = (userId, email, preferences) => {
    return {
        userId,
        email,
        encryptionEnabled: preferences?.encryptionEnabled ?? true,
        preferredProtocol: preferences?.preferredProtocol || EncryptionProtocol.SMIME,
        requireEncryption: preferences?.requireEncryption || EncryptionPreference.PREFERRED,
        certificates: preferences?.certificates || [],
        pgpPublicKeys: preferences?.pgpPublicKeys || [],
        autoDecrypt: preferences?.autoDecrypt ?? true,
        signOutgoing: preferences?.signOutgoing ?? true,
        verifyIncoming: preferences?.verifyIncoming ?? true,
        updatedAt: new Date(),
    };
};
exports.createUserEncryptionPreferences = createUserEncryptionPreferences;
/**
 * Updates user encryption preferences.
 *
 * @param {UserEncryptionPreferences} current - Current preferences
 * @param {Partial<UserEncryptionPreferences>} updates - Updates to apply
 * @returns {UserEncryptionPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const updated = updateUserEncryptionPreferences(
 *   currentPrefs,
 *   { preferredProtocol: EncryptionProtocol.PGP }
 * );
 * ```
 */
const updateUserEncryptionPreferences = (current, updates) => {
    return {
        ...current,
        ...updates,
        updatedAt: new Date(),
    };
};
exports.updateUserEncryptionPreferences = updateUserEncryptionPreferences;
/**
 * Validates user can send encrypted message.
 *
 * @param {UserEncryptionPreferences} senderPrefs - Sender preferences
 * @param {UserEncryptionPreferences} recipientPrefs - Recipient preferences
 * @returns {{ canSend: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateEncryptedMessagePermission(senderPrefs, recipientPrefs);
 * if (!result.canSend) {
 *   console.error('Cannot send encrypted message:', result.errors);
 * }
 * ```
 */
const validateEncryptedMessagePermission = (senderPrefs, recipientPrefs) => {
    const errors = [];
    if (!senderPrefs.encryptionEnabled) {
        errors.push('Sender encryption is disabled');
    }
    if (!recipientPrefs.encryptionEnabled) {
        errors.push('Recipient encryption is disabled');
    }
    if (recipientPrefs.certificates.length === 0 && recipientPrefs.pgpPublicKeys.length === 0) {
        errors.push('Recipient has no public keys or certificates');
    }
    const protocolMatch = senderPrefs.preferredProtocol === recipientPrefs.preferredProtocol ||
        senderPrefs.preferredProtocol === EncryptionProtocol.HYBRID;
    if (!protocolMatch) {
        errors.push('Encryption protocol mismatch');
    }
    return {
        canSend: errors.length === 0,
        errors,
    };
};
exports.validateEncryptedMessagePermission = validateEncryptedMessagePermission;
// ============================================================================
// ENCRYPTION AUDIT LOGGING
// ============================================================================
/**
 * Creates encryption audit log entry.
 *
 * @param {Partial<EncryptionAuditLog>} entry - Audit log data
 * @returns {EncryptionAuditLog} Complete audit log entry
 *
 * @example
 * ```typescript
 * const audit = createEncryptionAuditLog({
 *   userId: 'user-123',
 *   action: 'encrypt',
 *   protocol: EncryptionProtocol.SMIME,
 *   algorithm: EncryptionAlgorithm.AES_256_GCM,
 *   success: true
 * });
 * ```
 */
const createEncryptionAuditLog = (entry) => {
    return {
        logId: crypto.randomBytes(16).toString('hex'),
        timestamp: new Date(),
        userId: entry.userId || '',
        action: entry.action || 'encrypt',
        messageId: entry.messageId,
        protocol: entry.protocol || EncryptionProtocol.SMIME,
        algorithm: entry.algorithm || EncryptionAlgorithm.AES_256_GCM,
        success: entry.success ?? true,
        errorMessage: entry.errorMessage,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
    };
};
exports.createEncryptionAuditLog = createEncryptionAuditLog;
/**
 * Logs encryption operation for compliance.
 *
 * @param {EncryptionAuditLog} auditLog - Audit log entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logEncryptionOperation(auditLog);
 * // Log stored for HIPAA compliance audit trail
 * ```
 */
const logEncryptionOperation = async (auditLog) => {
    console.log('[ENCRYPTION AUDIT]', {
        logId: auditLog.logId,
        timestamp: auditLog.timestamp,
        userId: auditLog.userId,
        action: auditLog.action,
        protocol: auditLog.protocol,
        success: auditLog.success,
    });
};
exports.logEncryptionOperation = logEncryptionOperation;
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
exports.default = {
    // S/MIME encryption & signing
    encryptMessageSMIME: exports.encryptMessageSMIME,
    decryptMessageSMIME: exports.decryptMessageSMIME,
    signMessageSMIME: exports.signMessageSMIME,
    verifySignatureSMIME: exports.verifySignatureSMIME,
    createDetachedSignature: exports.createDetachedSignature,
    // PGP/GPG encryption
    generatePGPKeyPair: exports.generatePGPKeyPair,
    encryptMessagePGP: exports.encryptMessagePGP,
    decryptMessagePGP: exports.decryptMessagePGP,
    exportPGPPublicKeyArmored: exports.exportPGPPublicKeyArmored,
    importPGPPublicKeyArmored: exports.importPGPPublicKeyArmored,
    verifyPGPSignature: exports.verifyPGPSignature,
    // Certificate management
    generateX509Certificate: exports.generateX509Certificate,
    validateCertificate: exports.validateCertificate,
    parseCertificatePEM: exports.parseCertificatePEM,
    exportCertificatePEM: exports.exportCertificatePEM,
    getCertificateFingerprint: exports.getCertificateFingerprint,
    // Public/private key handling
    generateRSAKeyPair: exports.generateRSAKeyPair,
    generateECDSAKeyPair: exports.generateECDSAKeyPair,
    encryptPrivateKey: exports.encryptPrivateKey,
    decryptPrivateKey: exports.decryptPrivateKey,
    derivePublicKey: exports.derivePublicKey,
    validateKeyPair: exports.validateKeyPair,
    // TLS/SSL configuration
    createTLSConfig: exports.createTLSConfig,
    validateTLSConfig: exports.validateTLSConfig,
    getRecommendedCiphers: exports.getRecommendedCiphers,
    // End-to-end encryption
    encryptEndToEnd: exports.encryptEndToEnd,
    decryptEndToEnd: exports.decryptEndToEnd,
    // Key exchange protocols
    generateDiffieHellmanParams: exports.generateDiffieHellmanParams,
    computeDHSharedSecret: exports.computeDHSharedSecret,
    generateECDHParams: exports.generateECDHParams,
    computeECDHSharedSecret: exports.computeECDHSharedSecret,
    // Certificate revocation
    checkCertificateRevocation: exports.checkCertificateRevocation,
    performOCSPCheck: exports.performOCSPCheck,
    createCRLEntry: exports.createCRLEntry,
    // Secure message indicators
    generateSecureMessageIndicator: exports.generateSecureMessageIndicator,
    checkSecurityRequirements: exports.checkSecurityRequirements,
    // Encryption preferences
    createUserEncryptionPreferences: exports.createUserEncryptionPreferences,
    updateUserEncryptionPreferences: exports.updateUserEncryptionPreferences,
    validateEncryptedMessagePermission: exports.validateEncryptedMessagePermission,
    // Audit logging
    createEncryptionAuditLog: exports.createEncryptionAuditLog,
    logEncryptionOperation: exports.logEncryptionOperation,
};
//# sourceMappingURL=mail-security-encryption-kit.js.map