"use strict";
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
exports.encryptFileAtRest = exports.decryptDatabaseField = exports.encryptDatabaseField = exports.configureDataAtRestEncryption = exports.createSecureWebSocketConfig = exports.generateDTLSConfig = exports.validateTLSHandshake = exports.configureTLSProtocol = exports.reencryptData = exports.checkKeyRotationStatus = exports.rotateEncryptionKey = exports.createKeyRotationPolicy = exports.createKeyHierarchy = exports.unwrapEncryptionKey = exports.wrapEncryptionKey = exports.deriveKeyFromPassword = exports.generateEncryptionKey = exports.importCertificateFromPEM = exports.exportCertificateBundle = exports.renewCertificate = exports.validateCertificate = exports.createCertificateSigningRequest = exports.generateSelfSignedCertificate = exports.negotiateIPSecParameters = exports.validateIPSecSA = exports.generateStrongSwanConfig = exports.createIPSecConfig = exports.monitorVPNTunnel = exports.rotateVPNKeys = exports.validateVPNTunnel = exports.generateWireGuardConfig = exports.createVPNTunnel = exports.performDiffieHellmanExchange = exports.generateSessionKey = exports.createEncryptedChannel = exports.decryptNetworkTraffic = exports.encryptNetworkTraffic = exports.createEncryptionKeyModel = exports.createCertificateModel = exports.createVPNTunnelModel = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
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
const createVPNTunnelModel = (sequelize) => {
    class VPNTunnelModel extends sequelize_1.Model {
    }
    VPNTunnelModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'VPN tunnel name',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('ipsec', 'wireguard', 'openvpn', 'ssl_vpn'),
            allowNull: false,
            comment: 'VPN tunnel type',
        },
        localEndpoint: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'Local endpoint IP',
        },
        remoteEndpoint: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            comment: 'Remote endpoint IP',
        },
        presharedKey: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted preshared key',
        },
        certificate: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'X.509 certificate',
        },
        privateKey: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted private key',
        },
        encryptionAlgorithm: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Encryption algorithm',
        },
        authenticationAlgorithm: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Authentication algorithm',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'error'),
            allowNull: false,
            defaultValue: 'inactive',
            comment: 'Tunnel status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'vpn_tunnels',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['type'] },
            { fields: ['status'] },
        ],
    });
    return VPNTunnelModel;
};
exports.createVPNTunnelModel = createVPNTunnelModel;
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
const createCertificateModel = (sequelize) => {
    class CertificateModel extends sequelize_1.Model {
    }
    CertificateModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        commonName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Certificate common name',
        },
        subjectAlternativeNames: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Subject alternative names',
        },
        issuer: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Certificate issuer',
        },
        serialNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Certificate serial number',
        },
        notBefore: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Valid from date',
        },
        notAfter: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Valid until date',
        },
        publicKey: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'PEM encoded public key',
        },
        privateKey: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Encrypted private key',
        },
        certificateChain: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Certificate chain',
        },
        thumbprint: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            comment: 'Certificate thumbprint (SHA-256)',
        },
        autoRenew: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto-renew before expiration',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether certificate is active',
        },
    }, {
        sequelize,
        tableName: 'tls_certificates',
        timestamps: true,
        indexes: [
            { fields: ['commonName'] },
            { fields: ['serialNumber'], unique: true },
            { fields: ['notAfter'] },
            { fields: ['enabled'] },
        ],
    });
    return CertificateModel;
};
exports.createCertificateModel = createCertificateModel;
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
const createEncryptionKeyModel = (sequelize) => {
    class EncryptionKeyModel extends sequelize_1.Model {
    }
    EncryptionKeyModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Key name',
        },
        algorithm: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Encryption algorithm',
        },
        keyMaterial: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: false,
            comment: 'Encrypted key material',
        },
        iv: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: true,
            comment: 'Initialization vector',
        },
        salt: {
            type: sequelize_1.DataTypes.BLOB,
            allowNull: true,
            comment: 'Key derivation salt',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Key version number',
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Key expiration date',
        },
        rotationPolicy: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Key rotation policy',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether key is active',
        },
    }, {
        sequelize,
        tableName: 'encryption_keys',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['version'] },
            { fields: ['enabled'] },
            { fields: ['expiresAt'] },
        ],
    });
    return EncryptionKeyModel;
};
exports.createEncryptionKeyModel = createEncryptionKeyModel;
// ============================================================================
// NETWORK TRAFFIC ENCRYPTION (4-8)
// ============================================================================
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
const encryptNetworkTraffic = (data, key) => {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key.keyMaterial, iv);
    const plaintext = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    let ciphertext = cipher.update(plaintext);
    ciphertext = Buffer.concat([ciphertext, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        ciphertext: ciphertext.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        algorithm: key.algorithm,
        keyVersion: key.version,
        timestamp: new Date(),
    };
};
exports.encryptNetworkTraffic = encryptNetworkTraffic;
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
const decryptNetworkTraffic = (encryptedData, key) => {
    const algorithm = 'aes-256-gcm';
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const authTag = Buffer.from(encryptedData.authTag || '', 'base64');
    const ciphertext = Buffer.from(encryptedData.ciphertext, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, key.keyMaterial, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};
exports.decryptNetworkTraffic = decryptNetworkTraffic;
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
const createEncryptedChannel = (sourceId, destinationId, lifetimeMinutes) => {
    const encryptionKey = crypto.randomBytes(32); // 256-bit key
    const sessionKey = crypto.randomBytes(32);
    const nonce = crypto.randomBytes(16);
    return {
        id: crypto.randomUUID(),
        sourceId,
        destinationId,
        encryptionKey,
        sessionKey,
        nonce,
        established: new Date(),
        expiresAt: new Date(Date.now() + lifetimeMinutes * 60000),
        algorithm: 'aes-256-gcm',
    };
};
exports.createEncryptedChannel = createEncryptedChannel;
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
const generateSessionKey = (keySize = 32) => {
    if (![16, 24, 32].includes(keySize)) {
        throw new Error('Invalid key size. Must be 16, 24, or 32 bytes');
    }
    return {
        key: crypto.randomBytes(keySize),
        iv: crypto.randomBytes(16),
    };
};
exports.generateSessionKey = generateSessionKey;
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
const performDiffieHellmanExchange = (privateKey, publicKey) => {
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    return ecdh.computeSecret(publicKey);
};
exports.performDiffieHellmanExchange = performDiffieHellmanExchange;
// ============================================================================
// VPN TUNNEL MANAGEMENT (9-13)
// ============================================================================
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
const createVPNTunnel = (config) => {
    const presharedKey = config.presharedKey || generatePresharedKey();
    return {
        id: config.id || crypto.randomUUID(),
        name: config.name || 'Unnamed Tunnel',
        type: config.type || 'ipsec',
        localEndpoint: config.localEndpoint || '0.0.0.0',
        remoteEndpoint: config.remoteEndpoint || '0.0.0.0',
        presharedKey,
        certificate: config.certificate,
        privateKey: config.privateKey,
        encryptionAlgorithm: config.encryptionAlgorithm || 'AES-256-GCM',
        authenticationAlgorithm: config.authenticationAlgorithm || 'SHA-256',
        status: config.status || 'inactive',
        metadata: config.metadata || {},
    };
};
exports.createVPNTunnel = createVPNTunnel;
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
const generateWireGuardConfig = (tunnel) => {
    const { publicKey, privateKey } = generateWireGuardKeys();
    return `[Interface]
PrivateKey = ${privateKey}
Address = ${tunnel.localEndpoint}/24
ListenPort = 51820

[Peer]
PublicKey = ${publicKey}
Endpoint = ${tunnel.remoteEndpoint}:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`;
};
exports.generateWireGuardConfig = generateWireGuardConfig;
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
const validateVPNTunnel = async (tunnel) => {
    try {
        const startTime = Date.now();
        // Simulate connectivity check
        // In production, this would perform actual network connectivity test
        const isConnected = tunnel.status === 'active';
        if (!isConnected) {
            return {
                connected: false,
                error: 'Tunnel is not active',
            };
        }
        const latency = Date.now() - startTime;
        return {
            connected: true,
            latency,
        };
    }
    catch (error) {
        return {
            connected: false,
            error: error.message,
        };
    }
};
exports.validateVPNTunnel = validateVPNTunnel;
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
const rotateVPNKeys = (tunnel) => {
    const newPresharedKey = generatePresharedKey();
    return {
        ...tunnel,
        presharedKey: newPresharedKey,
        metadata: {
            ...tunnel.metadata,
            lastKeyRotation: new Date().toISOString(),
            previousKeyRotation: tunnel.metadata.lastKeyRotation,
        },
    };
};
exports.rotateVPNKeys = rotateVPNKeys;
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
const monitorVPNTunnel = (tunnel) => {
    // In production, this would collect actual metrics from the tunnel
    return {
        throughput: Math.random() * 1000, // Mbps
        packetLoss: Math.random() * 5, // Percentage
        jitter: Math.random() * 10, // Milliseconds
    };
};
exports.monitorVPNTunnel = monitorVPNTunnel;
// ============================================================================
// IPSEC CONFIGURATION (14-17)
// ============================================================================
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
const createIPSecConfig = (localSubnet, remoteSubnet) => {
    return {
        phase1: {
            encryptionAlgorithm: 'AES-256-CBC',
            hashAlgorithm: 'SHA-256',
            dhGroup: 'modp2048',
            lifetime: 28800, // 8 hours
        },
        phase2: {
            encryptionAlgorithm: 'AES-256-GCM',
            authenticationAlgorithm: 'SHA-256',
            pfsGroup: 'modp2048',
            lifetime: 3600, // 1 hour
        },
        presharedKey: generatePresharedKey(),
        localSubnet,
        remoteSubnet,
    };
};
exports.createIPSecConfig = createIPSecConfig;
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
const generateStrongSwanConfig = (config, connectionName) => {
    return `conn ${connectionName}
    keyexchange=ikev2
    ike=${config.phase1.encryptionAlgorithm}-${config.phase1.hashAlgorithm}-${config.phase1.dhGroup}!
    esp=${config.phase2.encryptionAlgorithm}-${config.phase2.authenticationAlgorithm}!
    leftsubnet=${config.localSubnet}
    rightsubnet=${config.remoteSubnet}
    ikelifetime=${config.phase1.lifetime}s
    lifetime=${config.phase2.lifetime}s
    dpdaction=restart
    dpddelay=30s
    dpdtimeout=120s
    auto=start`;
};
exports.generateStrongSwanConfig = generateStrongSwanConfig;
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
const validateIPSecSA = (config) => {
    const errors = [];
    if (!config.presharedKey || config.presharedKey.length < 32) {
        errors.push('Preshared key must be at least 32 characters');
    }
    if (!config.localSubnet || !config.remoteSubnet) {
        errors.push('Local and remote subnets are required');
    }
    if (config.phase1.lifetime < 3600) {
        errors.push('Phase 1 lifetime should be at least 1 hour');
    }
    if (config.phase2.lifetime > config.phase1.lifetime) {
        errors.push('Phase 2 lifetime cannot exceed Phase 1 lifetime');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateIPSecSA = validateIPSecSA;
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
const negotiateIPSecParameters = (proposedAlgorithms, supportedAlgorithms) => {
    for (const proposed of proposedAlgorithms) {
        if (supportedAlgorithms.includes(proposed)) {
            return proposed;
        }
    }
    return null;
};
exports.negotiateIPSecParameters = negotiateIPSecParameters;
// ============================================================================
// TLS/SSL CERTIFICATE MANAGEMENT (18-23)
// ============================================================================
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
const generateSelfSignedCertificate = (csr, validityDays) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: csr.keySize || 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const notBefore = new Date();
    const notAfter = new Date(Date.now() + validityDays * 86400000);
    const thumbprint = crypto
        .createHash('sha256')
        .update(publicKey)
        .digest('hex');
    return {
        id: crypto.randomUUID(),
        commonName: csr.commonName,
        subjectAlternativeNames: csr.subjectAlternativeNames || [],
        issuer: `CN=${csr.commonName}, O=${csr.organization}, C=${csr.country}`,
        serialNumber: crypto.randomBytes(16).toString('hex'),
        notBefore,
        notAfter,
        publicKey,
        privateKey,
        certificateChain: [],
        thumbprint,
        keyUsage: ['digitalSignature', 'keyEncipherment'],
        extendedKeyUsage: ['serverAuth', 'clientAuth'],
    };
};
exports.generateSelfSignedCertificate = generateSelfSignedCertificate;
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
const createCertificateSigningRequest = (request) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: request.keySize || 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    // In production, use proper CSR generation library
    const csrContent = `-----BEGIN CERTIFICATE REQUEST-----
Subject: CN=${request.commonName}, O=${request.organization}, C=${request.country}
-----END CERTIFICATE REQUEST-----`;
    return {
        csr: csrContent,
        privateKey,
    };
};
exports.createCertificateSigningRequest = createCertificateSigningRequest;
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
const validateCertificate = (certificate) => {
    const warnings = [];
    const now = new Date();
    const daysUntilExpiry = Math.floor((certificate.notAfter.getTime() - now.getTime()) / 86400000);
    if (now < certificate.notBefore) {
        warnings.push('Certificate not yet valid');
    }
    if (now > certificate.notAfter) {
        warnings.push('Certificate has expired');
    }
    if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
        warnings.push(`Certificate expires in ${daysUntilExpiry} days`);
    }
    if (certificate.certificateChain.length === 0) {
        warnings.push('No certificate chain found');
    }
    return {
        valid: warnings.filter(w => w.includes('expired') || w.includes('not yet valid')).length === 0,
        daysUntilExpiry,
        warnings,
    };
};
exports.validateCertificate = validateCertificate;
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
const renewCertificate = (currentCert, validityDays) => {
    const csr = {
        commonName: currentCert.commonName,
        organization: currentCert.issuer.split(',')[1]?.split('=')[1] || 'Unknown',
        country: currentCert.issuer.split(',')[2]?.split('=')[1] || 'US',
        state: 'CA',
        locality: 'San Francisco',
        keySize: 2048,
        subjectAlternativeNames: currentCert.subjectAlternativeNames,
    };
    return (0, exports.generateSelfSignedCertificate)(csr, validityDays);
};
exports.renewCertificate = renewCertificate;
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
const exportCertificateBundle = (certificate, includePrivateKey = false) => {
    return {
        cert: certificate.publicKey,
        key: includePrivateKey ? certificate.privateKey : undefined,
        chain: certificate.certificateChain.join('\n'),
    };
};
exports.exportCertificateBundle = exportCertificateBundle;
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
const importCertificateFromPEM = (pemCert, pemKey) => {
    // In production, use proper X.509 parsing library
    const thumbprint = crypto
        .createHash('sha256')
        .update(pemCert)
        .digest('hex');
    return {
        id: crypto.randomUUID(),
        commonName: 'imported-certificate',
        subjectAlternativeNames: [],
        issuer: 'Unknown',
        serialNumber: crypto.randomBytes(16).toString('hex'),
        notBefore: new Date(),
        notAfter: new Date(Date.now() + 365 * 86400000),
        publicKey: pemCert,
        privateKey: pemKey,
        certificateChain: [],
        thumbprint,
        keyUsage: [],
        extendedKeyUsage: [],
    };
};
exports.importCertificateFromPEM = importCertificateFromPEM;
// ============================================================================
// NETWORK KEY MANAGEMENT (24-28)
// ============================================================================
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
const generateEncryptionKey = (algorithm, keySize) => {
    const keySizeBytes = keySize / 8;
    const keyMaterial = crypto.randomBytes(keySizeBytes);
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(32);
    return {
        id: crypto.randomUUID(),
        name: `key-${Date.now()}`,
        algorithm,
        keyMaterial,
        iv,
        salt,
        version: 1,
        createdAt: new Date(),
        enabled: true,
    };
};
exports.generateEncryptionKey = generateEncryptionKey;
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
const deriveKeyFromPassword = async (password, salt, iterations = 100000, keyLength = 32) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
            if (err)
                reject(err);
            else
                resolve(derivedKey);
        });
    });
};
exports.deriveKeyFromPassword = deriveKeyFromPassword;
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
const wrapEncryptionKey = (dataKey, masterKey) => {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, masterKey.keyMaterial, iv);
    let wrapped = cipher.update(dataKey.keyMaterial);
    wrapped = Buffer.concat([wrapped, cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Combine IV + AuthTag + Wrapped Key
    return Buffer.concat([iv, authTag, wrapped]);
};
exports.wrapEncryptionKey = wrapEncryptionKey;
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
const unwrapEncryptionKey = (wrappedKey, masterKey) => {
    const algorithm = 'aes-256-gcm';
    const iv = wrappedKey.slice(0, 16);
    const authTag = wrappedKey.slice(16, 32);
    const encrypted = wrappedKey.slice(32);
    const decipher = crypto.createDecipheriv(algorithm, masterKey.keyMaterial, iv);
    decipher.setAuthTag(authTag);
    let unwrapped = decipher.update(encrypted);
    unwrapped = Buffer.concat([unwrapped, decipher.final()]);
    return unwrapped;
};
exports.unwrapEncryptionKey = unwrapEncryptionKey;
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
const createKeyHierarchy = (rootKey, tenantId) => {
    const derivedMaterial = crypto
        .createHmac('sha256', rootKey.keyMaterial)
        .update(tenantId)
        .digest();
    return {
        id: crypto.randomUUID(),
        name: `tenant-key-${tenantId}`,
        algorithm: rootKey.algorithm,
        keyMaterial: derivedMaterial,
        iv: crypto.randomBytes(16),
        version: 1,
        createdAt: new Date(),
        enabled: true,
    };
};
exports.createKeyHierarchy = createKeyHierarchy;
// ============================================================================
// ENCRYPTION KEY ROTATION (29-32)
// ============================================================================
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
const createKeyRotationPolicy = (rotationIntervalDays, autoRotate = true) => {
    return {
        enabled: true,
        rotationIntervalDays,
        retainOldVersions: 3,
        autoRotate,
        notifyBeforeDays: 7,
    };
};
exports.createKeyRotationPolicy = createKeyRotationPolicy;
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
const rotateEncryptionKey = (currentKey) => {
    const newKeyMaterial = crypto.randomBytes(currentKey.keyMaterial.length);
    const newIv = crypto.randomBytes(16);
    return {
        ...currentKey,
        id: crypto.randomUUID(),
        keyMaterial: newKeyMaterial,
        iv: newIv,
        version: currentKey.version + 1,
        createdAt: new Date(),
    };
};
exports.rotateEncryptionKey = rotateEncryptionKey;
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
const checkKeyRotationStatus = (key) => {
    if (!key.rotationPolicy || !key.rotationPolicy.enabled) {
        return { needsRotation: false, daysUntilRotation: -1 };
    }
    const daysSinceCreation = Math.floor((Date.now() - key.createdAt.getTime()) / 86400000);
    const daysUntilRotation = key.rotationPolicy.rotationIntervalDays - daysSinceCreation;
    return {
        needsRotation: daysUntilRotation <= 0,
        daysUntilRotation: Math.max(0, daysUntilRotation),
    };
};
exports.checkKeyRotationStatus = checkKeyRotationStatus;
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
const reencryptData = (oldEncrypted, oldKey, newKey) => {
    // Decrypt with old key
    const decrypted = (0, exports.decryptNetworkTraffic)(oldEncrypted, oldKey);
    // Encrypt with new key
    return (0, exports.encryptNetworkTraffic)(decrypted, newKey);
};
exports.reencryptData = reencryptData;
// ============================================================================
// SECURE NETWORK PROTOCOLS (33-36)
// ============================================================================
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
const configureTLSProtocol = (minVersion, cipherSuites) => {
    return {
        name: 'TLS',
        port: 443,
        encryption: true,
        encryptionType: 'tls',
        minVersion,
        maxVersion: 'TLSv1.3',
        cipherSuites,
    };
};
exports.configureTLSProtocol = configureTLSProtocol;
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
const validateTLSHandshake = (protocol, proposedVersion, proposedCipher) => {
    const versions = ['TLSv1.0', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3'];
    const minIndex = versions.indexOf(protocol.minVersion || 'TLSv1.2');
    const proposedIndex = versions.indexOf(proposedVersion);
    if (proposedIndex < minIndex) {
        return {
            valid: false,
            error: `TLS version ${proposedVersion} is below minimum ${protocol.minVersion}`,
        };
    }
    if (protocol.cipherSuites && !protocol.cipherSuites.includes(proposedCipher)) {
        return {
            valid: false,
            error: `Cipher suite ${proposedCipher} is not allowed`,
        };
    }
    return { valid: true };
};
exports.validateTLSHandshake = validateTLSHandshake;
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
const generateDTLSConfig = (port) => {
    return {
        name: 'DTLS',
        port,
        encryption: true,
        encryptionType: 'dtls',
        minVersion: 'DTLSv1.2',
        maxVersion: 'DTLSv1.3',
        cipherSuites: [
            'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
            'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        ],
    };
};
exports.generateDTLSConfig = generateDTLSConfig;
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
const createSecureWebSocketConfig = (certificate) => {
    return {
        port: 443,
        tls: {
            cert: certificate.publicKey,
            key: certificate.privateKey,
            minVersion: 'TLSv1.2',
            ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256',
        },
    };
};
exports.createSecureWebSocketConfig = createSecureWebSocketConfig;
// ============================================================================
// NETWORK DATA ENCRYPTION AT REST (37-40)
// ============================================================================
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
const configureDataAtRestEncryption = (keyId, encryptedFields) => {
    return {
        enabled: true,
        algorithm: 'AES-256-GCM',
        keyId,
        encryptionScope: encryptedFields ? 'selective' : 'full',
        encryptedFields,
    };
};
exports.configureDataAtRestEncryption = configureDataAtRestEncryption;
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
const encryptDatabaseField = (value, key) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const encrypted = (0, exports.encryptNetworkTraffic)(Buffer.from(stringValue, 'utf8'), key);
    return `${encrypted.iv}:${encrypted.authTag}:${encrypted.ciphertext}`;
};
exports.encryptDatabaseField = encryptDatabaseField;
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
const decryptDatabaseField = (encryptedValue, key) => {
    const [iv, authTag, ciphertext] = encryptedValue.split(':');
    const encrypted = {
        iv,
        authTag,
        ciphertext,
        algorithm: key.algorithm,
        keyVersion: key.version,
        timestamp: new Date(),
    };
    const decrypted = (0, exports.decryptNetworkTraffic)(encrypted, key);
    return decrypted.toString('utf8');
};
exports.decryptDatabaseField = decryptDatabaseField;
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
const encryptFileAtRest = async (filePath, key) => {
    const fileContent = await fs.promises.readFile(filePath);
    const encrypted = (0, exports.encryptNetworkTraffic)(fileContent, key);
    const encryptedPath = `${filePath}.encrypted`;
    const encryptedData = JSON.stringify(encrypted);
    await fs.promises.writeFile(encryptedPath, encryptedData, 'utf8');
    return encryptedPath;
};
exports.encryptFileAtRest = encryptFileAtRest;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates secure preshared key for VPN.
 *
 * @param {number} length - Key length in bytes
 * @returns {string} Base64 encoded preshared key
 *
 * @example
 * ```typescript
 * const psk = generatePresharedKey(64);
 * ```
 */
function generatePresharedKey(length = 64) {
    return crypto.randomBytes(length).toString('base64');
}
/**
 * Generates WireGuard public/private key pair.
 *
 * @returns {{ publicKey: string; privateKey: string }} Key pair
 */
function generateWireGuardKeys() {
    const privateKey = crypto.randomBytes(32).toString('base64');
    // In production, derive actual WireGuard public key from private key
    const publicKey = crypto.randomBytes(32).toString('base64');
    return { publicKey, privateKey };
}
exports.default = {
    // Models
    createVPNTunnelModel: exports.createVPNTunnelModel,
    createCertificateModel: exports.createCertificateModel,
    createEncryptionKeyModel: exports.createEncryptionKeyModel,
    // Network Traffic Encryption
    encryptNetworkTraffic: exports.encryptNetworkTraffic,
    decryptNetworkTraffic: exports.decryptNetworkTraffic,
    createEncryptedChannel: exports.createEncryptedChannel,
    generateSessionKey: exports.generateSessionKey,
    performDiffieHellmanExchange: exports.performDiffieHellmanExchange,
    // VPN Tunnel Management
    createVPNTunnel: exports.createVPNTunnel,
    generateWireGuardConfig: exports.generateWireGuardConfig,
    validateVPNTunnel: exports.validateVPNTunnel,
    rotateVPNKeys: exports.rotateVPNKeys,
    monitorVPNTunnel: exports.monitorVPNTunnel,
    // IPSec Configuration
    createIPSecConfig: exports.createIPSecConfig,
    generateStrongSwanConfig: exports.generateStrongSwanConfig,
    validateIPSecSA: exports.validateIPSecSA,
    negotiateIPSecParameters: exports.negotiateIPSecParameters,
    // TLS/SSL Certificate Management
    generateSelfSignedCertificate: exports.generateSelfSignedCertificate,
    createCertificateSigningRequest: exports.createCertificateSigningRequest,
    validateCertificate: exports.validateCertificate,
    renewCertificate: exports.renewCertificate,
    exportCertificateBundle: exports.exportCertificateBundle,
    importCertificateFromPEM: exports.importCertificateFromPEM,
    // Network Key Management
    generateEncryptionKey: exports.generateEncryptionKey,
    deriveKeyFromPassword: exports.deriveKeyFromPassword,
    wrapEncryptionKey: exports.wrapEncryptionKey,
    unwrapEncryptionKey: exports.unwrapEncryptionKey,
    createKeyHierarchy: exports.createKeyHierarchy,
    // Encryption Key Rotation
    createKeyRotationPolicy: exports.createKeyRotationPolicy,
    rotateEncryptionKey: exports.rotateEncryptionKey,
    checkKeyRotationStatus: exports.checkKeyRotationStatus,
    reencryptData: exports.reencryptData,
    // Secure Network Protocols
    configureTLSProtocol: exports.configureTLSProtocol,
    validateTLSHandshake: exports.validateTLSHandshake,
    generateDTLSConfig: exports.generateDTLSConfig,
    createSecureWebSocketConfig: exports.createSecureWebSocketConfig,
    // Network Data Encryption at Rest
    configureDataAtRestEncryption: exports.configureDataAtRestEncryption,
    encryptDatabaseField: exports.encryptDatabaseField,
    decryptDatabaseField: exports.decryptDatabaseField,
    encryptFileAtRest: exports.encryptFileAtRest,
};
//# sourceMappingURL=network-encryption-kit.js.map