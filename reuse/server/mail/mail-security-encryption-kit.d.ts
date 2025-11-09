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
/**
 * Encryption algorithm types
 */
export declare enum EncryptionAlgorithm {
    AES_256_CBC = "aes-256-cbc",
    AES_256_GCM = "aes-256-gcm",
    AES_192_CBC = "aes-192-cbc",
    AES_128_CBC = "aes-128-CBC",
    RSA_OAEP = "rsa-oaep",
    RSA_PKCS1 = "rsa-pkcs1"
}
/**
 * Signature algorithm types
 */
export declare enum SignatureAlgorithm {
    RSA_SHA256 = "RSA-SHA256",
    RSA_SHA384 = "RSA-SHA384",
    RSA_SHA512 = "RSA-SHA512",
    ECDSA_SHA256 = "ecdsa-with-SHA256",
    ECDSA_SHA384 = "ecdsa-with-SHA384"
}
/**
 * Encryption protocol types
 */
export declare enum EncryptionProtocol {
    SMIME = "S/MIME",
    PGP = "PGP",
    GPG = "GPG",
    HYBRID = "HYBRID"
}
/**
 * Certificate status
 */
export declare enum CertificateStatus {
    VALID = "VALID",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED",
    PENDING = "PENDING",
    INVALID = "INVALID"
}
/**
 * Key usage types
 */
export declare enum KeyUsage {
    ENCRYPTION = "encryption",
    SIGNING = "signing",
    KEY_AGREEMENT = "keyAgreement",
    CERTIFICATE_SIGNING = "certificateSigning"
}
/**
 * Encryption preference levels
 */
export declare enum EncryptionPreference {
    REQUIRED = "required",
    PREFERRED = "preferred",
    OPTIONAL = "optional",
    DISABLED = "disabled"
}
/**
 * S/MIME encrypted message structure
 */
export interface SMIMEMessage {
    encryptedContent: string;
    recipients: SMIMERecipient[];
    algorithm: EncryptionAlgorithm;
    contentType: string;
    boundary?: string;
    headers: Record<string, string>;
    timestamp: Date;
}
/**
 * S/MIME recipient information
 */
export interface SMIMERecipient {
    email: string;
    certificate: X509Certificate;
    encryptedKey: string;
    keyAlgorithm: string;
}
/**
 * X.509 certificate structure
 */
export interface X509Certificate {
    subject: CertificateSubject;
    issuer: CertificateIssuer;
    serialNumber: string;
    notBefore: Date;
    notAfter: Date;
    publicKey: string;
    fingerprint: string;
    signatureAlgorithm: SignatureAlgorithm;
    keyUsage: KeyUsage[];
    subjectAltNames?: string[];
    extensions?: CertificateExtension[];
    pemEncoded: string;
    derEncoded?: Buffer;
}
/**
 * Certificate subject information
 */
export interface CertificateSubject {
    commonName: string;
    emailAddress: string;
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country?: string;
}
/**
 * Certificate issuer information
 */
export interface CertificateIssuer {
    commonName: string;
    organization: string;
    organizationalUnit?: string;
    country?: string;
}
/**
 * Certificate extension
 */
export interface CertificateExtension {
    oid: string;
    critical: boolean;
    value: any;
}
/**
 * PGP key pair
 */
export interface PGPKeyPair {
    publicKey: string;
    privateKey: string;
    fingerprint: string;
    keyId: string;
    userIds: string[];
    algorithm: string;
    bits: number;
    createdAt: Date;
    expiresAt?: Date;
    revoked: boolean;
}
/**
 * PGP encrypted message
 */
export interface PGPMessage {
    encryptedData: string;
    recipientKeyIds: string[];
    signatureKeyId?: string;
    algorithm: string;
    compressionAlgorithm?: string;
    timestamp: Date;
    filename?: string;
}
/**
 * Digital signature
 */
export interface DigitalSignature {
    signature: string;
    algorithm: SignatureAlgorithm;
    signerCertificate?: X509Certificate;
    signerKeyId?: string;
    timestamp: Date;
    messageHash: string;
    valid?: boolean;
}
/**
 * Key pair (RSA/ECDSA)
 */
export interface KeyPair {
    publicKey: string;
    privateKey: string;
    algorithm: string;
    keySize: number;
    format: 'pem' | 'der' | 'jwk';
    passphrase?: string;
    createdAt: Date;
}
/**
 * Encrypted message storage
 */
export interface EncryptedMessageStorage {
    messageId: string;
    encryptedContent: string;
    encryptionMetadata: EncryptionMetadata;
    iv: string;
    authTag?: string;
    recipientIds: string[];
    senderId: string;
    createdAt: Date;
    expiresAt?: Date;
}
/**
 * Encryption metadata
 */
export interface EncryptionMetadata {
    protocol: EncryptionProtocol;
    algorithm: EncryptionAlgorithm;
    keyId?: string;
    certificateFingerprint?: string;
    signaturePresent: boolean;
    compressionUsed: boolean;
    integrityProtected: boolean;
}
/**
 * TLS/SSL configuration
 */
export interface TLSConfiguration {
    minVersion: string;
    maxVersion?: string;
    ciphers: string[];
    certificatePath: string;
    privateKeyPath: string;
    caPath?: string;
    requireClientCert: boolean;
    rejectUnauthorized: boolean;
    honorCipherOrder: boolean;
}
/**
 * Key exchange parameters (Diffie-Hellman)
 */
export interface KeyExchangeParams {
    prime: string;
    generator: number;
    privateKey: string;
    publicKey: string;
    sharedSecret?: string;
    algorithm: 'DH' | 'ECDH';
}
/**
 * Certificate revocation list entry
 */
export interface CRLEntry {
    serialNumber: string;
    revocationDate: Date;
    reason?: string;
    issuer: string;
}
/**
 * OCSP (Online Certificate Status Protocol) response
 */
export interface OCSPResponse {
    status: 'good' | 'revoked' | 'unknown';
    certificateSerial: string;
    thisUpdate: Date;
    nextUpdate?: Date;
    revocationTime?: Date;
    revocationReason?: string;
}
/**
 * User encryption preferences
 */
export interface UserEncryptionPreferences {
    userId: string;
    email: string;
    encryptionEnabled: boolean;
    preferredProtocol: EncryptionProtocol;
    requireEncryption: EncryptionPreference;
    certificates: X509Certificate[];
    pgpPublicKeys: string[];
    autoDecrypt: boolean;
    signOutgoing: boolean;
    verifyIncoming: boolean;
    updatedAt: Date;
}
/**
 * Secure message indicator
 */
export interface SecureMessageIndicator {
    messageId: string;
    encrypted: boolean;
    signed: boolean;
    signatureValid?: boolean;
    encryptionProtocol?: EncryptionProtocol;
    certificateStatus?: CertificateStatus;
    warnings: string[];
    trustLevel: 'high' | 'medium' | 'low' | 'untrusted';
}
/**
 * Encryption audit log entry
 */
export interface EncryptionAuditLog {
    logId: string;
    timestamp: Date;
    userId: string;
    action: 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'key_generation' | 'certificate_issue';
    messageId?: string;
    protocol: EncryptionProtocol;
    algorithm: EncryptionAlgorithm | SignatureAlgorithm;
    success: boolean;
    errorMessage?: string;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Certificate validation result
 */
export interface CertificateValidationResult {
    valid: boolean;
    status: CertificateStatus;
    errors: string[];
    warnings: string[];
    chainValid: boolean;
    trustAnchorFound: boolean;
    notBefore: Date;
    notAfter: Date;
    revocationChecked: boolean;
}
/**
 * Message encryption options
 */
export interface MessageEncryptionOptions {
    protocol: EncryptionProtocol;
    algorithm?: EncryptionAlgorithm;
    signMessage?: boolean;
    includeOriginalHeaders?: boolean;
    compress?: boolean;
    armorOutput?: boolean;
}
/**
 * Key generation options
 */
export interface KeyGenerationOptions {
    algorithm: 'RSA' | 'ECDSA' | 'Ed25519';
    keySize?: number;
    curve?: string;
    passphrase?: string;
    expiresIn?: number;
    userInfo?: {
        name: string;
        email: string;
    };
}
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
export declare const encryptMessageSMIME: (messageContent: string, recipientCertificates: X509Certificate[], algorithm?: EncryptionAlgorithm) => Promise<SMIMEMessage>;
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
export declare const decryptMessageSMIME: (smimeMessage: SMIMEMessage, privateKey: string, passphrase?: string) => Promise<string>;
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
export declare const signMessageSMIME: (messageContent: string, privateKey: string, certificate: X509Certificate, algorithm?: SignatureAlgorithm) => Promise<DigitalSignature>;
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
export declare const verifySignatureSMIME: (messageContent: string, signature: DigitalSignature) => Promise<boolean>;
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
export declare const createDetachedSignature: (messageContent: string, privateKey: string, certificate: X509Certificate) => Promise<string>;
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
export declare const generatePGPKeyPair: (options: KeyGenerationOptions) => Promise<PGPKeyPair>;
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
export declare const encryptMessagePGP: (messageContent: string, recipientPublicKeys: string[], signerPrivateKey?: string) => Promise<PGPMessage>;
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
export declare const decryptMessagePGP: (pgpMessage: PGPMessage, privateKey: string, passphrase?: string) => Promise<string>;
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
export declare const exportPGPPublicKeyArmored: (publicKey: string) => string;
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
export declare const importPGPPublicKeyArmored: (armoredKey: string) => string;
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
export declare const verifyPGPSignature: (messageContent: string, signature: string, publicKey: string) => Promise<boolean>;
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
export declare const generateX509Certificate: (subject: CertificateSubject, publicKey: string, validityDays?: number) => Promise<X509Certificate>;
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
export declare const validateCertificate: (certificate: X509Certificate, trustedCerts?: X509Certificate[]) => Promise<CertificateValidationResult>;
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
export declare const parseCertificatePEM: (pemCertificate: string) => X509Certificate;
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
export declare const exportCertificatePEM: (certificate: X509Certificate) => string;
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
export declare const getCertificateFingerprint: (certificate: X509Certificate) => string;
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
export declare const generateRSAKeyPair: (keySize?: number, passphrase?: string) => Promise<KeyPair>;
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
export declare const generateECDSAKeyPair: (curve?: string, passphrase?: string) => Promise<KeyPair>;
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
export declare const encryptPrivateKey: (privateKey: string, passphrase: string) => string;
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
export declare const decryptPrivateKey: (encryptedPrivateKey: string, passphrase: string) => string;
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
export declare const derivePublicKey: (privateKey: string) => string;
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
export declare const validateKeyPair: (publicKey: string, privateKey: string) => boolean;
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
export declare const createTLSConfig: (options: Partial<TLSConfiguration>) => TLSConfiguration;
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
export declare const validateTLSConfig: (config: TLSConfiguration) => {
    valid: boolean;
    errors: string[];
};
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
export declare const getRecommendedCiphers: () => string[];
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
export declare const encryptEndToEnd: (messageContent: string, recipientPublicKey: string, options: MessageEncryptionOptions) => Promise<EncryptedMessageStorage>;
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
export declare const decryptEndToEnd: (encryptedMessage: EncryptedMessageStorage, recipientPrivateKey: string) => Promise<string>;
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
export declare const generateDiffieHellmanParams: (primeLength?: number) => KeyExchangeParams;
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
export declare const computeDHSharedSecret: (params: KeyExchangeParams, peerPublicKey: string) => string;
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
export declare const generateECDHParams: (curve?: string) => KeyExchangeParams;
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
export declare const computeECDHSharedSecret: (params: KeyExchangeParams, peerPublicKey: string) => string;
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
export declare const checkCertificateRevocation: (certificate: X509Certificate, crlEntries: CRLEntry[]) => boolean;
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
export declare const performOCSPCheck: (certificate: X509Certificate, ocspUrl: string) => Promise<OCSPResponse>;
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
export declare const createCRLEntry: (serialNumber: string, reason: string, issuer: string) => CRLEntry;
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
export declare const generateSecureMessageIndicator: (messageId: string, metadata: EncryptionMetadata, certValidation?: CertificateValidationResult) => SecureMessageIndicator;
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
export declare const checkSecurityRequirements: (indicator: SecureMessageIndicator, requirement: EncryptionPreference) => boolean;
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
export declare const createUserEncryptionPreferences: (userId: string, email: string, preferences?: Partial<UserEncryptionPreferences>) => UserEncryptionPreferences;
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
export declare const updateUserEncryptionPreferences: (current: UserEncryptionPreferences, updates: Partial<UserEncryptionPreferences>) => UserEncryptionPreferences;
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
export declare const validateEncryptedMessagePermission: (senderPrefs: UserEncryptionPreferences, recipientPrefs: UserEncryptionPreferences) => {
    canSend: boolean;
    errors: string[];
};
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
export declare const createEncryptionAuditLog: (entry: Partial<EncryptionAuditLog>) => EncryptionAuditLog;
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
export declare const logEncryptionOperation: (auditLog: EncryptionAuditLog) => Promise<void>;
declare const _default: {
    encryptMessageSMIME: (messageContent: string, recipientCertificates: X509Certificate[], algorithm?: EncryptionAlgorithm) => Promise<SMIMEMessage>;
    decryptMessageSMIME: (smimeMessage: SMIMEMessage, privateKey: string, passphrase?: string) => Promise<string>;
    signMessageSMIME: (messageContent: string, privateKey: string, certificate: X509Certificate, algorithm?: SignatureAlgorithm) => Promise<DigitalSignature>;
    verifySignatureSMIME: (messageContent: string, signature: DigitalSignature) => Promise<boolean>;
    createDetachedSignature: (messageContent: string, privateKey: string, certificate: X509Certificate) => Promise<string>;
    generatePGPKeyPair: (options: KeyGenerationOptions) => Promise<PGPKeyPair>;
    encryptMessagePGP: (messageContent: string, recipientPublicKeys: string[], signerPrivateKey?: string) => Promise<PGPMessage>;
    decryptMessagePGP: (pgpMessage: PGPMessage, privateKey: string, passphrase?: string) => Promise<string>;
    exportPGPPublicKeyArmored: (publicKey: string) => string;
    importPGPPublicKeyArmored: (armoredKey: string) => string;
    verifyPGPSignature: (messageContent: string, signature: string, publicKey: string) => Promise<boolean>;
    generateX509Certificate: (subject: CertificateSubject, publicKey: string, validityDays?: number) => Promise<X509Certificate>;
    validateCertificate: (certificate: X509Certificate, trustedCerts?: X509Certificate[]) => Promise<CertificateValidationResult>;
    parseCertificatePEM: (pemCertificate: string) => X509Certificate;
    exportCertificatePEM: (certificate: X509Certificate) => string;
    getCertificateFingerprint: (certificate: X509Certificate) => string;
    generateRSAKeyPair: (keySize?: number, passphrase?: string) => Promise<KeyPair>;
    generateECDSAKeyPair: (curve?: string, passphrase?: string) => Promise<KeyPair>;
    encryptPrivateKey: (privateKey: string, passphrase: string) => string;
    decryptPrivateKey: (encryptedPrivateKey: string, passphrase: string) => string;
    derivePublicKey: (privateKey: string) => string;
    validateKeyPair: (publicKey: string, privateKey: string) => boolean;
    createTLSConfig: (options: Partial<TLSConfiguration>) => TLSConfiguration;
    validateTLSConfig: (config: TLSConfiguration) => {
        valid: boolean;
        errors: string[];
    };
    getRecommendedCiphers: () => string[];
    encryptEndToEnd: (messageContent: string, recipientPublicKey: string, options: MessageEncryptionOptions) => Promise<EncryptedMessageStorage>;
    decryptEndToEnd: (encryptedMessage: EncryptedMessageStorage, recipientPrivateKey: string) => Promise<string>;
    generateDiffieHellmanParams: (primeLength?: number) => KeyExchangeParams;
    computeDHSharedSecret: (params: KeyExchangeParams, peerPublicKey: string) => string;
    generateECDHParams: (curve?: string) => KeyExchangeParams;
    computeECDHSharedSecret: (params: KeyExchangeParams, peerPublicKey: string) => string;
    checkCertificateRevocation: (certificate: X509Certificate, crlEntries: CRLEntry[]) => boolean;
    performOCSPCheck: (certificate: X509Certificate, ocspUrl: string) => Promise<OCSPResponse>;
    createCRLEntry: (serialNumber: string, reason: string, issuer: string) => CRLEntry;
    generateSecureMessageIndicator: (messageId: string, metadata: EncryptionMetadata, certValidation?: CertificateValidationResult) => SecureMessageIndicator;
    checkSecurityRequirements: (indicator: SecureMessageIndicator, requirement: EncryptionPreference) => boolean;
    createUserEncryptionPreferences: (userId: string, email: string, preferences?: Partial<UserEncryptionPreferences>) => UserEncryptionPreferences;
    updateUserEncryptionPreferences: (current: UserEncryptionPreferences, updates: Partial<UserEncryptionPreferences>) => UserEncryptionPreferences;
    validateEncryptedMessagePermission: (senderPrefs: UserEncryptionPreferences, recipientPrefs: UserEncryptionPreferences) => {
        canSend: boolean;
        errors: string[];
    };
    createEncryptionAuditLog: (entry: Partial<EncryptionAuditLog>) => EncryptionAuditLog;
    logEncryptionOperation: (auditLog: EncryptionAuditLog) => Promise<void>;
};
export default _default;
//# sourceMappingURL=mail-security-encryption-kit.d.ts.map