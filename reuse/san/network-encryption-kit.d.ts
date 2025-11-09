/**
 * LOC: NETENCRY123456
 * File: /reuse/san/network-encryption-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network encryption implementations
 *   - VPN tunnel services
 *   - TLS/SSL certificate management
 *   - Network key management systems
 */
import { Sequelize } from 'sequelize';
interface VPNTunnel {
    id: string;
    name: string;
    type: 'ipsec' | 'wireguard' | 'openvpn' | 'ssl_vpn';
    localEndpoint: string;
    remoteEndpoint: string;
    presharedKey?: string;
    certificate?: string;
    privateKey?: string;
    encryptionAlgorithm: string;
    authenticationAlgorithm: string;
    status: 'active' | 'inactive' | 'error';
    metadata: Record<string, any>;
}
interface IPSecConfig {
    phase1: {
        encryptionAlgorithm: string;
        hashAlgorithm: string;
        dhGroup: string;
        lifetime: number;
    };
    phase2: {
        encryptionAlgorithm: string;
        authenticationAlgorithm: string;
        pfsGroup: string;
        lifetime: number;
    };
    presharedKey?: string;
    localSubnet: string;
    remoteSubnet: string;
}
interface TLSCertificate {
    id: string;
    commonName: string;
    subjectAlternativeNames: string[];
    issuer: string;
    serialNumber: string;
    notBefore: Date;
    notAfter: Date;
    publicKey: string;
    privateKey?: string;
    certificateChain: string[];
    thumbprint: string;
    keyUsage: string[];
    extendedKeyUsage: string[];
}
interface EncryptionKey {
    id: string;
    name: string;
    algorithm: string;
    keyMaterial: Buffer;
    iv?: Buffer;
    salt?: Buffer;
    version: number;
    createdAt: Date;
    expiresAt?: Date;
    rotationPolicy?: KeyRotationPolicy;
    enabled: boolean;
}
interface KeyRotationPolicy {
    enabled: boolean;
    rotationIntervalDays: number;
    retainOldVersions: number;
    autoRotate: boolean;
    notifyBeforeDays: number;
}
interface EncryptedData {
    ciphertext: string;
    iv: string;
    authTag?: string;
    algorithm: string;
    keyVersion: number;
    timestamp: Date;
}
interface NetworkProtocol {
    name: string;
    port: number;
    encryption: boolean;
    encryptionType?: 'tls' | 'dtls' | 'ipsec' | 'wireguard';
    minVersion?: string;
    maxVersion?: string;
    cipherSuites?: string[];
}
interface SecureChannel {
    id: string;
    sourceId: string;
    destinationId: string;
    encryptionKey: Buffer;
    sessionKey: Buffer;
    nonce: Buffer;
    established: Date;
    expiresAt: Date;
    algorithm: string;
}
interface DataAtRestConfig {
    enabled: boolean;
    algorithm: string;
    keyId: string;
    encryptionScope: 'full' | 'selective';
    encryptedFields?: string[];
}
interface CertificateSigningRequest {
    commonName: string;
    organization: string;
    organizationalUnit?: string;
    country: string;
    state: string;
    locality: string;
    emailAddress?: string;
    subjectAlternativeNames?: string[];
    keySize: number;
    publicKey?: string;
    privateKey?: string;
}
/**
 * Sequelize model for VPN Tunnels with encryption configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VPNTunnel model
 *
 * @example
 * ```typescript
 * const VPNTunnelModel = createVPNTunnelModel(sequelize);
 * const tunnel = await VPNTunnelModel.create({
 *   name: 'Site-to-Site VPN',
 *   type: 'ipsec',
 *   localEndpoint: '10.0.1.1',
 *   remoteEndpoint: '203.0.113.1',
 *   encryptionAlgorithm: 'AES-256-GCM'
 * });
 * ```
 */
export declare const createVPNTunnelModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        type: string;
        localEndpoint: string;
        remoteEndpoint: string;
        presharedKey: string | null;
        certificate: string | null;
        privateKey: string | null;
        encryptionAlgorithm: string;
        authenticationAlgorithm: string;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for TLS/SSL Certificates with expiration tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certificate model
 *
 * @example
 * ```typescript
 * const CertificateModel = createCertificateModel(sequelize);
 * const cert = await CertificateModel.create({
 *   commonName: '*.example.com',
 *   publicKey: pemEncodedPublicKey,
 *   privateKey: encryptedPrivateKey,
 *   notAfter: new Date('2025-12-31')
 * });
 * ```
 */
export declare const createCertificateModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        commonName: string;
        subjectAlternativeNames: string[];
        issuer: string;
        serialNumber: string;
        notBefore: Date;
        notAfter: Date;
        publicKey: string;
        privateKey: string | null;
        certificateChain: string[];
        thumbprint: string;
        autoRenew: boolean;
        enabled: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Encryption Keys with rotation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EncryptionKey model
 *
 * @example
 * ```typescript
 * const EncryptionKeyModel = createEncryptionKeyModel(sequelize);
 * const key = await EncryptionKeyModel.create({
 *   name: 'master-key-v1',
 *   algorithm: 'AES-256-GCM',
 *   keyMaterial: encryptedKeyMaterial,
 *   version: 1
 * });
 * ```
 */
export declare const createEncryptionKeyModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        name: string;
        algorithm: string;
        keyMaterial: Buffer;
        iv: Buffer | null;
        salt: Buffer | null;
        version: number;
        expiresAt: Date | null;
        rotationPolicy: Record<string, any> | null;
        enabled: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Encrypts network traffic payload with authenticated encryption.
 *
 * @param {Buffer | string} data - Data to encrypt
 * @param {EncryptionKey} key - Encryption key
 * @returns {EncryptedData} Encrypted data with metadata
 *
 * @example
 * ```typescript
 * const encrypted = encryptNetworkTraffic(payload, encryptionKey);
 * // Send encrypted.ciphertext over network
 * ```
 */
export declare const encryptNetworkTraffic: (data: Buffer | string, key: EncryptionKey) => EncryptedData;
/**
 * Decrypts network traffic payload with authentication verification.
 *
 * @param {EncryptedData} encryptedData - Encrypted data
 * @param {EncryptionKey} key - Decryption key
 * @returns {Buffer} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = decryptNetworkTraffic(encryptedData, encryptionKey);
 * const payload = decrypted.toString('utf8');
 * ```
 */
export declare const decryptNetworkTraffic: (encryptedData: EncryptedData, key: EncryptionKey) => Buffer;
/**
 * Creates encrypted channel between two network endpoints.
 *
 * @param {string} sourceId - Source endpoint ID
 * @param {string} destinationId - Destination endpoint ID
 * @param {number} lifetimeMinutes - Channel lifetime in minutes
 * @returns {SecureChannel} Secure channel configuration
 *
 * @example
 * ```typescript
 * const channel = createEncryptedChannel('node-1', 'node-2', 60);
 * // Use channel.sessionKey for encrypting traffic
 * ```
 */
export declare const createEncryptedChannel: (sourceId: string, destinationId: string, lifetimeMinutes: number) => SecureChannel;
/**
 * Generates session key for ephemeral encryption.
 *
 * @param {number} keySize - Key size in bytes (16, 24, or 32)
 * @returns {{ key: Buffer; iv: Buffer }} Session key and IV
 *
 * @example
 * ```typescript
 * const session = generateSessionKey(32);
 * // Use session.key and session.iv for encryption
 * ```
 */
export declare const generateSessionKey: (keySize?: number) => {
    key: Buffer;
    iv: Buffer;
};
/**
 * Implements perfect forward secrecy key exchange.
 *
 * @param {Buffer} privateKey - Local private key
 * @param {Buffer} publicKey - Remote public key
 * @returns {Buffer} Shared secret
 *
 * @example
 * ```typescript
 * const sharedSecret = performDiffieHellmanExchange(localPrivate, remotePublic);
 * const derivedKey = deriveEncryptionKey(sharedSecret);
 * ```
 */
export declare const performDiffieHellmanExchange: (privateKey: Buffer, publicKey: Buffer) => Buffer;
/**
 * Creates VPN tunnel configuration.
 *
 * @param {Partial<VPNTunnel>} config - VPN tunnel configuration
 * @returns {VPNTunnel} Created VPN tunnel
 *
 * @example
 * ```typescript
 * const tunnel = createVPNTunnel({
 *   name: 'HQ-to-Branch',
 *   type: 'ipsec',
 *   localEndpoint: '10.0.0.1',
 *   remoteEndpoint: '203.0.113.50',
 *   encryptionAlgorithm: 'AES-256-CBC'
 * });
 * ```
 */
export declare const createVPNTunnel: (config: Partial<VPNTunnel>) => VPNTunnel;
/**
 * Generates WireGuard configuration.
 *
 * @param {VPNTunnel} tunnel - VPN tunnel
 * @returns {string} WireGuard configuration file content
 *
 * @example
 * ```typescript
 * const config = generateWireGuardConfig(tunnel);
 * fs.writeFileSync('/etc/wireguard/wg0.conf', config);
 * ```
 */
export declare const generateWireGuardConfig: (tunnel: VPNTunnel) => string;
/**
 * Validates VPN tunnel connectivity.
 *
 * @param {VPNTunnel} tunnel - VPN tunnel to validate
 * @returns {Promise<{ connected: boolean; latency?: number; error?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const status = await validateVPNTunnel(tunnel);
 * if (!status.connected) {
 *   console.error('Tunnel down:', status.error);
 * }
 * ```
 */
export declare const validateVPNTunnel: (tunnel: VPNTunnel) => Promise<{
    connected: boolean;
    latency?: number;
    error?: string;
}>;
/**
 * Rotates VPN tunnel keys.
 *
 * @param {VPNTunnel} tunnel - VPN tunnel
 * @returns {VPNTunnel} Updated tunnel with new keys
 *
 * @example
 * ```typescript
 * const updated = rotateVPNKeys(existingTunnel);
 * await saveTunnel(updated);
 * ```
 */
export declare const rotateVPNKeys: (tunnel: VPNTunnel) => VPNTunnel;
/**
 * Monitors VPN tunnel metrics.
 *
 * @param {VPNTunnel} tunnel - VPN tunnel
 * @returns {{ throughput: number; packetLoss: number; jitter: number }} Tunnel metrics
 *
 * @example
 * ```typescript
 * const metrics = monitorVPNTunnel(tunnel);
 * console.log(`Throughput: ${metrics.throughput} Mbps`);
 * ```
 */
export declare const monitorVPNTunnel: (tunnel: VPNTunnel) => {
    throughput: number;
    packetLoss: number;
    jitter: number;
};
/**
 * Creates IPSec configuration for site-to-site VPN.
 *
 * @param {string} localSubnet - Local subnet CIDR
 * @param {string} remoteSubnet - Remote subnet CIDR
 * @returns {IPSecConfig} IPSec configuration
 *
 * @example
 * ```typescript
 * const config = createIPSecConfig('10.0.0.0/16', '10.1.0.0/16');
 * ```
 */
export declare const createIPSecConfig: (localSubnet: string, remoteSubnet: string) => IPSecConfig;
/**
 * Generates strongSwan IPSec configuration file.
 *
 * @param {IPSecConfig} config - IPSec configuration
 * @param {string} connectionName - Connection name
 * @returns {string} strongSwan configuration
 *
 * @example
 * ```typescript
 * const ipsecConf = generateStrongSwanConfig(config, 'site-to-site');
 * fs.writeFileSync('/etc/ipsec.conf', ipsecConf);
 * ```
 */
export declare const generateStrongSwanConfig: (config: IPSecConfig, connectionName: string) => string;
/**
 * Validates IPSec security association (SA).
 *
 * @param {IPSecConfig} config - IPSec configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateIPSecSA(config);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateIPSecSA: (config: IPSecConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * Negotiates IPSec security parameters.
 *
 * @param {string[]} proposedAlgorithms - Proposed encryption algorithms
 * @param {string[]} supportedAlgorithms - Supported algorithms
 * @returns {string | null} Negotiated algorithm
 *
 * @example
 * ```typescript
 * const algorithm = negotiateIPSecParameters(
 *   ['AES-256-GCM', 'AES-128-GCM'],
 *   ['AES-256-GCM', 'ChaCha20-Poly1305']
 * );
 * ```
 */
export declare const negotiateIPSecParameters: (proposedAlgorithms: string[], supportedAlgorithms: string[]) => string | null;
/**
 * Generates self-signed TLS certificate.
 *
 * @param {CertificateSigningRequest} csr - Certificate signing request
 * @param {number} validityDays - Certificate validity in days
 * @returns {TLSCertificate} Generated certificate
 *
 * @example
 * ```typescript
 * const cert = generateSelfSignedCertificate({
 *   commonName: 'example.com',
 *   organization: 'Example Corp',
 *   country: 'US',
 *   state: 'CA',
 *   locality: 'San Francisco',
 *   keySize: 2048
 * }, 365);
 * ```
 */
export declare const generateSelfSignedCertificate: (csr: CertificateSigningRequest, validityDays: number) => TLSCertificate;
/**
 * Creates certificate signing request (CSR).
 *
 * @param {CertificateSigningRequest} request - CSR details
 * @returns {{ csr: string; privateKey: string }} Generated CSR and private key
 *
 * @example
 * ```typescript
 * const { csr, privateKey } = createCertificateSigningRequest({
 *   commonName: '*.example.com',
 *   organization: 'Example Corp',
 *   country: 'US',
 *   state: 'CA',
 *   locality: 'San Francisco',
 *   keySize: 4096
 * });
 * ```
 */
export declare const createCertificateSigningRequest: (request: CertificateSigningRequest) => {
    csr: string;
    privateKey: string;
};
/**
 * Validates TLS certificate expiration and chain.
 *
 * @param {TLSCertificate} certificate - Certificate to validate
 * @returns {{ valid: boolean; daysUntilExpiry: number; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCertificate(cert);
 * if (validation.daysUntilExpiry < 30) {
 *   console.warn('Certificate expiring soon!');
 * }
 * ```
 */
export declare const validateCertificate: (certificate: TLSCertificate) => {
    valid: boolean;
    daysUntilExpiry: number;
    warnings: string[];
};
/**
 * Renews TLS certificate before expiration.
 *
 * @param {TLSCertificate} currentCert - Current certificate
 * @param {number} validityDays - New certificate validity
 * @returns {TLSCertificate} Renewed certificate
 *
 * @example
 * ```typescript
 * const renewed = renewCertificate(expiringSert, 365);
 * await saveCertificate(renewed);
 * ```
 */
export declare const renewCertificate: (currentCert: TLSCertificate, validityDays: number) => TLSCertificate;
/**
 * Exports certificate bundle for deployment.
 *
 * @param {TLSCertificate} certificate - Certificate to export
 * @param {boolean} includePrivateKey - Whether to include private key
 * @returns {{ cert: string; key?: string; chain: string }} Certificate bundle
 *
 * @example
 * ```typescript
 * const bundle = exportCertificateBundle(cert, true);
 * fs.writeFileSync('cert.pem', bundle.cert);
 * fs.writeFileSync('key.pem', bundle.key);
 * ```
 */
export declare const exportCertificateBundle: (certificate: TLSCertificate, includePrivateKey?: boolean) => {
    cert: string;
    key?: string;
    chain: string;
};
/**
 * Imports certificate from PEM format.
 *
 * @param {string} pemCert - PEM encoded certificate
 * @param {string} [pemKey] - PEM encoded private key
 * @returns {TLSCertificate} Imported certificate
 *
 * @example
 * ```typescript
 * const pemCert = fs.readFileSync('cert.pem', 'utf8');
 * const pemKey = fs.readFileSync('key.pem', 'utf8');
 * const cert = importCertificateFromPEM(pemCert, pemKey);
 * ```
 */
export declare const importCertificateFromPEM: (pemCert: string, pemKey?: string) => TLSCertificate;
/**
 * Generates encryption key with specified algorithm.
 *
 * @param {string} algorithm - Encryption algorithm
 * @param {number} keySize - Key size in bits
 * @returns {EncryptionKey} Generated encryption key
 *
 * @example
 * ```typescript
 * const key = generateEncryptionKey('AES-256-GCM', 256);
 * await storeKey(key);
 * ```
 */
export declare const generateEncryptionKey: (algorithm: string, keySize: number) => EncryptionKey;
/**
 * Derives encryption key from password using PBKDF2.
 *
 * @param {string} password - Password
 * @param {Buffer} salt - Salt
 * @param {number} iterations - PBKDF2 iterations
 * @param {number} keyLength - Derived key length in bytes
 * @returns {Promise<Buffer>} Derived key
 *
 * @example
 * ```typescript
 * const salt = crypto.randomBytes(32);
 * const key = await deriveKeyFromPassword('secure-password', salt, 100000, 32);
 * ```
 */
export declare const deriveKeyFromPassword: (password: string, salt: Buffer, iterations?: number, keyLength?: number) => Promise<Buffer>;
/**
 * Wraps encryption key with master key (Key Encryption Key).
 *
 * @param {EncryptionKey} dataKey - Data encryption key to wrap
 * @param {EncryptionKey} masterKey - Master key encryption key
 * @returns {Buffer} Wrapped key
 *
 * @example
 * ```typescript
 * const wrapped = wrapEncryptionKey(dataKey, masterKey);
 * // Store wrapped key securely
 * ```
 */
export declare const wrapEncryptionKey: (dataKey: EncryptionKey, masterKey: EncryptionKey) => Buffer;
/**
 * Unwraps encryption key using master key.
 *
 * @param {Buffer} wrappedKey - Wrapped key
 * @param {EncryptionKey} masterKey - Master key encryption key
 * @returns {Buffer} Unwrapped key material
 *
 * @example
 * ```typescript
 * const unwrapped = unwrapEncryptionKey(wrappedKey, masterKey);
 * const dataKey = { ...keyMetadata, keyMaterial: unwrapped };
 * ```
 */
export declare const unwrapEncryptionKey: (wrappedKey: Buffer, masterKey: EncryptionKey) => Buffer;
/**
 * Creates key hierarchy for multi-tenant encryption.
 *
 * @param {EncryptionKey} rootKey - Root key
 * @param {string} tenantId - Tenant identifier
 * @returns {EncryptionKey} Tenant-specific key
 *
 * @example
 * ```typescript
 * const tenantKey = createKeyHierarchy(rootKey, 'tenant-123');
 * // Use tenantKey for encrypting tenant data
 * ```
 */
export declare const createKeyHierarchy: (rootKey: EncryptionKey, tenantId: string) => EncryptionKey;
/**
 * Creates key rotation policy.
 *
 * @param {number} rotationIntervalDays - Rotation interval
 * @param {boolean} autoRotate - Enable automatic rotation
 * @returns {KeyRotationPolicy} Rotation policy
 *
 * @example
 * ```typescript
 * const policy = createKeyRotationPolicy(90, true);
 * key.rotationPolicy = policy;
 * ```
 */
export declare const createKeyRotationPolicy: (rotationIntervalDays: number, autoRotate?: boolean) => KeyRotationPolicy;
/**
 * Rotates encryption key to new version.
 *
 * @param {EncryptionKey} currentKey - Current key
 * @returns {EncryptionKey} New key version
 *
 * @example
 * ```typescript
 * const newKey = rotateEncryptionKey(oldKey);
 * await reencryptDataWithNewKey(oldKey, newKey);
 * ```
 */
export declare const rotateEncryptionKey: (currentKey: EncryptionKey) => EncryptionKey;
/**
 * Checks if key needs rotation based on policy.
 *
 * @param {EncryptionKey} key - Encryption key
 * @returns {{ needsRotation: boolean; daysUntilRotation: number }} Rotation status
 *
 * @example
 * ```typescript
 * const status = checkKeyRotationStatus(key);
 * if (status.needsRotation) {
 *   await rotateKey(key);
 * }
 * ```
 */
export declare const checkKeyRotationStatus: (key: EncryptionKey) => {
    needsRotation: boolean;
    daysUntilRotation: number;
};
/**
 * Re-encrypts data with new encryption key.
 *
 * @param {EncryptedData} oldEncrypted - Data encrypted with old key
 * @param {EncryptionKey} oldKey - Old encryption key
 * @param {EncryptionKey} newKey - New encryption key
 * @returns {EncryptedData} Data encrypted with new key
 *
 * @example
 * ```typescript
 * const reencrypted = reencryptData(oldData, oldKey, newKey);
 * await saveEncryptedData(reencrypted);
 * ```
 */
export declare const reencryptData: (oldEncrypted: EncryptedData, oldKey: EncryptionKey, newKey: EncryptionKey) => EncryptedData;
/**
 * Configures TLS protocol settings.
 *
 * @param {string} minVersion - Minimum TLS version
 * @param {string[]} cipherSuites - Allowed cipher suites
 * @returns {NetworkProtocol} TLS protocol configuration
 *
 * @example
 * ```typescript
 * const tls = configureTLSProtocol('TLSv1.3', [
 *   'TLS_AES_256_GCM_SHA384',
 *   'TLS_CHACHA20_POLY1305_SHA256'
 * ]);
 * ```
 */
export declare const configureTLSProtocol: (minVersion: string, cipherSuites: string[]) => NetworkProtocol;
/**
 * Validates TLS handshake parameters.
 *
 * @param {NetworkProtocol} protocol - TLS protocol configuration
 * @param {string} proposedVersion - Proposed TLS version
 * @param {string} proposedCipher - Proposed cipher suite
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTLSHandshake(tlsConfig, 'TLSv1.2', 'TLS_AES_256_GCM_SHA384');
 * ```
 */
export declare const validateTLSHandshake: (protocol: NetworkProtocol, proposedVersion: string, proposedCipher: string) => {
    valid: boolean;
    error?: string;
};
/**
 * Generates DTLS configuration for UDP encryption.
 *
 * @param {number} port - DTLS port
 * @returns {NetworkProtocol} DTLS protocol configuration
 *
 * @example
 * ```typescript
 * const dtls = generateDTLSConfig(4433);
 * // Use for real-time encrypted communication
 * ```
 */
export declare const generateDTLSConfig: (port: number) => NetworkProtocol;
/**
 * Creates secure WebSocket configuration.
 *
 * @param {TLSCertificate} certificate - TLS certificate
 * @returns {{ port: number; tls: any }} WebSocket configuration
 *
 * @example
 * ```typescript
 * const wsConfig = createSecureWebSocketConfig(cert);
 * const wss = new WebSocketServer(wsConfig);
 * ```
 */
export declare const createSecureWebSocketConfig: (certificate: TLSCertificate) => {
    port: number;
    tls: any;
};
/**
 * Configures data at rest encryption.
 *
 * @param {string} keyId - Encryption key ID
 * @param {string[]} [encryptedFields] - Fields to encrypt
 * @returns {DataAtRestConfig} Configuration
 *
 * @example
 * ```typescript
 * const config = configureDataAtRestEncryption('key-123', [
 *   'patientData',
 *   'medicalRecords',
 *   'billingInfo'
 * ]);
 * ```
 */
export declare const configureDataAtRestEncryption: (keyId: string, encryptedFields?: string[]) => DataAtRestConfig;
/**
 * Encrypts database field value.
 *
 * @param {any} value - Field value to encrypt
 * @param {EncryptionKey} key - Encryption key
 * @returns {string} Encrypted value (base64)
 *
 * @example
 * ```typescript
 * const encrypted = encryptDatabaseField(patientSSN, encryptionKey);
 * await db.patients.update({ ssn: encrypted });
 * ```
 */
export declare const encryptDatabaseField: (value: any, key: EncryptionKey) => string;
/**
 * Decrypts database field value.
 *
 * @param {string} encryptedValue - Encrypted value
 * @param {EncryptionKey} key - Decryption key
 * @returns {any} Decrypted value
 *
 * @example
 * ```typescript
 * const decrypted = decryptDatabaseField(patient.ssn, encryptionKey);
 * console.log('SSN:', decrypted);
 * ```
 */
export declare const decryptDatabaseField: (encryptedValue: string, key: EncryptionKey) => any;
/**
 * Encrypts file for secure storage.
 *
 * @param {string} filePath - Path to file
 * @param {EncryptionKey} key - Encryption key
 * @returns {Promise<string>} Path to encrypted file
 *
 * @example
 * ```typescript
 * const encryptedPath = await encryptFileAtRest('/data/sensitive.pdf', key);
 * // Original file is replaced with encrypted version
 * ```
 */
export declare const encryptFileAtRest: (filePath: string, key: EncryptionKey) => Promise<string>;
declare const _default: {
    createVPNTunnelModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            type: string;
            localEndpoint: string;
            remoteEndpoint: string;
            presharedKey: string | null;
            certificate: string | null;
            privateKey: string | null;
            encryptionAlgorithm: string;
            authenticationAlgorithm: string;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCertificateModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            commonName: string;
            subjectAlternativeNames: string[];
            issuer: string;
            serialNumber: string;
            notBefore: Date;
            notAfter: Date;
            publicKey: string;
            privateKey: string | null;
            certificateChain: string[];
            thumbprint: string;
            autoRenew: boolean;
            enabled: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createEncryptionKeyModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            name: string;
            algorithm: string;
            keyMaterial: Buffer;
            iv: Buffer | null;
            salt: Buffer | null;
            version: number;
            expiresAt: Date | null;
            rotationPolicy: Record<string, any> | null;
            enabled: boolean;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    encryptNetworkTraffic: (data: Buffer | string, key: EncryptionKey) => EncryptedData;
    decryptNetworkTraffic: (encryptedData: EncryptedData, key: EncryptionKey) => Buffer;
    createEncryptedChannel: (sourceId: string, destinationId: string, lifetimeMinutes: number) => SecureChannel;
    generateSessionKey: (keySize?: number) => {
        key: Buffer;
        iv: Buffer;
    };
    performDiffieHellmanExchange: (privateKey: Buffer, publicKey: Buffer) => Buffer;
    createVPNTunnel: (config: Partial<VPNTunnel>) => VPNTunnel;
    generateWireGuardConfig: (tunnel: VPNTunnel) => string;
    validateVPNTunnel: (tunnel: VPNTunnel) => Promise<{
        connected: boolean;
        latency?: number;
        error?: string;
    }>;
    rotateVPNKeys: (tunnel: VPNTunnel) => VPNTunnel;
    monitorVPNTunnel: (tunnel: VPNTunnel) => {
        throughput: number;
        packetLoss: number;
        jitter: number;
    };
    createIPSecConfig: (localSubnet: string, remoteSubnet: string) => IPSecConfig;
    generateStrongSwanConfig: (config: IPSecConfig, connectionName: string) => string;
    validateIPSecSA: (config: IPSecConfig) => {
        valid: boolean;
        errors: string[];
    };
    negotiateIPSecParameters: (proposedAlgorithms: string[], supportedAlgorithms: string[]) => string | null;
    generateSelfSignedCertificate: (csr: CertificateSigningRequest, validityDays: number) => TLSCertificate;
    createCertificateSigningRequest: (request: CertificateSigningRequest) => {
        csr: string;
        privateKey: string;
    };
    validateCertificate: (certificate: TLSCertificate) => {
        valid: boolean;
        daysUntilExpiry: number;
        warnings: string[];
    };
    renewCertificate: (currentCert: TLSCertificate, validityDays: number) => TLSCertificate;
    exportCertificateBundle: (certificate: TLSCertificate, includePrivateKey?: boolean) => {
        cert: string;
        key?: string;
        chain: string;
    };
    importCertificateFromPEM: (pemCert: string, pemKey?: string) => TLSCertificate;
    generateEncryptionKey: (algorithm: string, keySize: number) => EncryptionKey;
    deriveKeyFromPassword: (password: string, salt: Buffer, iterations?: number, keyLength?: number) => Promise<Buffer>;
    wrapEncryptionKey: (dataKey: EncryptionKey, masterKey: EncryptionKey) => Buffer;
    unwrapEncryptionKey: (wrappedKey: Buffer, masterKey: EncryptionKey) => Buffer;
    createKeyHierarchy: (rootKey: EncryptionKey, tenantId: string) => EncryptionKey;
    createKeyRotationPolicy: (rotationIntervalDays: number, autoRotate?: boolean) => KeyRotationPolicy;
    rotateEncryptionKey: (currentKey: EncryptionKey) => EncryptionKey;
    checkKeyRotationStatus: (key: EncryptionKey) => {
        needsRotation: boolean;
        daysUntilRotation: number;
    };
    reencryptData: (oldEncrypted: EncryptedData, oldKey: EncryptionKey, newKey: EncryptionKey) => EncryptedData;
    configureTLSProtocol: (minVersion: string, cipherSuites: string[]) => NetworkProtocol;
    validateTLSHandshake: (protocol: NetworkProtocol, proposedVersion: string, proposedCipher: string) => {
        valid: boolean;
        error?: string;
    };
    generateDTLSConfig: (port: number) => NetworkProtocol;
    createSecureWebSocketConfig: (certificate: TLSCertificate) => {
        port: number;
        tls: any;
    };
    configureDataAtRestEncryption: (keyId: string, encryptedFields?: string[]) => DataAtRestConfig;
    encryptDatabaseField: (value: any, key: EncryptionKey) => string;
    decryptDatabaseField: (encryptedValue: string, key: EncryptionKey) => any;
    encryptFileAtRest: (filePath: string, key: EncryptionKey) => Promise<string>;
};
export default _default;
//# sourceMappingURL=network-encryption-kit.d.ts.map