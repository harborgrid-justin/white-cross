/**
 * SAN iSCSI Operations Kit
 *
 * Comprehensive TypeScript utilities for iSCSI protocol operations including
 * target management, initiator configuration, session handling, multipath I/O,
 * and CHAP authentication.
 *
 * @module san-iscsi-operations-kit
 * @version 1.0.0
 */
/**
 * iSCSI authentication methods
 */
export declare enum iSCSIAuthMethod {
    NONE = "None",
    CHAP = "CHAP",
    MUTUAL_CHAP = "MutualCHAP",
    SRP = "SRP",
    SPKM1 = "SPKM1",
    SPKM2 = "SPKM2",
    KRB5 = "KRB5"
}
/**
 * iSCSI session states
 */
export declare enum iSCSISessionState {
    FREE = "FREE",
    LOGGED_IN = "LOGGED_IN",
    FAILED = "FAILED",
    IN_LOGIN = "IN_LOGIN",
    LOGGED_OUT = "LOGGED_OUT"
}
/**
 * iSCSI connection states
 */
export declare enum iSCSIConnectionState {
    FREE = "FREE",
    TRANSPORT_WAIT = "TRANSPORT_WAIT",
    IN_LOGIN = "IN_LOGIN",
    LOGGED_IN = "LOGGED_IN",
    IN_LOGOUT = "IN_LOGOUT",
    LOGOUT_REQUESTED = "LOGOUT_REQUESTED",
    CLEANUP_WAIT = "CLEANUP_WAIT"
}
/**
 * Multipath I/O path states
 */
export declare enum MultipathState {
    ACTIVE = "active",
    STANDBY = "standby",
    FAILED = "failed",
    DISABLED = "disabled"
}
/**
 * Multipath I/O load balancing policies
 */
export declare enum MultipathPolicy {
    ROUND_ROBIN = "round-robin",
    FAILOVER = "failover",
    MULTIBUS = "multibus",
    GROUP_BY_SERIAL = "group-by-serial",
    SERVICE_TIME = "service-time",
    QUEUE_LENGTH = "queue-length"
}
/**
 * iSCSI portal configuration
 */
export interface iSCSIPortal {
    id: string;
    ipAddress: string;
    port: number;
    networkInterface?: string;
    vlanId?: number;
    mtu?: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * iSCSI target configuration
 */
export interface iSCSITarget {
    id: string;
    iqn: string;
    alias?: string;
    portals: iSCSIPortal[];
    luns: iSCSILUN[];
    authMethod: iSCSIAuthMethod;
    chapUsername?: string;
    chapSecret?: string;
    mutualChapUsername?: string;
    mutualChapSecret?: string;
    maxConnections: number;
    maxSessions: number;
    initialR2T: boolean;
    immediateData: boolean;
    maxRecvDataSegmentLength: number;
    maxBurstLength: number;
    firstBurstLength: number;
    defaultTime2Wait: number;
    defaultTime2Retain: number;
    maxOutstandingR2T: number;
    dataPDUInOrder: boolean;
    dataSequenceInOrder: boolean;
    errorRecoveryLevel: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * iSCSI Logical Unit Number configuration
 */
export interface iSCSILUN {
    id: string;
    lunNumber: number;
    devicePath: string;
    sizeBytes: number;
    blockSize: number;
    vendorId: string;
    productId: string;
    productRevision: string;
    serialNumber: string;
    readOnly: boolean;
    writeCache: boolean;
    tpgs: number;
}
/**
 * iSCSI initiator configuration
 */
export interface iSCSIInitiator {
    id: string;
    iqn: string;
    alias?: string;
    authMethod: iSCSIAuthMethod;
    chapUsername?: string;
    chapSecret?: string;
    mutualChapUsername?: string;
    mutualChapSecret?: string;
    headerDigest: boolean;
    dataDigest: boolean;
    maxRecvDataSegmentLength: number;
    firstBurstLength: number;
    maxBurstLength: number;
    maxConnections: number;
    initialR2T: boolean;
    immediateData: boolean;
    sessionTimeout: number;
    replacementTimeout: number;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * iSCSI session information
 */
export interface iSCSISession {
    id: string;
    targetIqn: string;
    initiatorIqn: string;
    targetPortalGroupTag: number;
    sessionId: string;
    connectionId: string;
    state: iSCSISessionState;
    connections: iSCSIConnection[];
    authMethod: iSCSIAuthMethod;
    authenticated: boolean;
    headerDigest: boolean;
    dataDigest: boolean;
    maxConnections: number;
    initialR2T: boolean;
    immediateData: boolean;
    maxRecvDataSegmentLength: number;
    maxBurstLength: number;
    firstBurstLength: number;
    defaultTime2Wait: number;
    defaultTime2Retain: number;
    maxOutstandingR2T: number;
    errorRecoveryLevel: number;
    createdAt: Date;
    lastActivityAt: Date;
    statistics: iSCSISessionStatistics;
}
/**
 * iSCSI connection information
 */
export interface iSCSIConnection {
    id: string;
    sessionId: string;
    connectionId: string;
    state: iSCSIConnectionState;
    portalAddress: string;
    portalPort: number;
    localAddress: string;
    localPort: number;
    headerDigest: boolean;
    dataDigest: boolean;
    maxRecvDataSegmentLength: number;
    maxXmitDataSegmentLength: number;
    createdAt: Date;
    lastActivityAt: Date;
}
/**
 * iSCSI session statistics
 */
export interface iSCSISessionStatistics {
    bytesSent: number;
    bytesReceived: number;
    packetsSent: number;
    packetsReceived: number;
    errors: number;
    retransmissions: number;
    sequenceErrors: number;
    digestErrors: number;
    timeoutErrors: number;
    lastUpdatedAt: Date;
}
/**
 * CHAP authentication credentials
 */
export interface CHAPCredentials {
    username: string;
    secret: string;
    challenge?: string;
    response?: string;
    identifier?: number;
}
/**
 * Discovery method for iSCSI targets
 */
export declare enum DiscoveryMethod {
    SEND_TARGETS = "SendTargets",
    SLP = "SLP",
    ISNS = "iSNS",
    STATIC = "Static"
}
/**
 * iSCSI discovery request
 */
export interface iSCSIDiscoveryRequest {
    method: DiscoveryMethod;
    portalAddress: string;
    portalPort: number;
    authMethod?: iSCSIAuthMethod;
    chapCredentials?: CHAPCredentials;
}
/**
 * iSCSI discovery result
 */
export interface iSCSIDiscoveryResult {
    targetIqn: string;
    targetAlias?: string;
    portals: Array<{
        address: string;
        port: number;
        groupTag: number;
    }>;
}
/**
 * Multipath I/O configuration
 */
export interface MultipathConfig {
    id: string;
    wwid: string;
    alias?: string;
    paths: MultipathPath[];
    policy: MultipathPolicy;
    priority: number;
    failbackEnabled: boolean;
    failbackDelay: number;
    queueIfNoPaths: boolean;
    features: string[];
    hardwareHandler?: string;
    rr_min_io?: number;
    rr_min_io_rq?: number;
    enabled: boolean;
}
/**
 * Multipath I/O path information
 */
export interface MultipathPath {
    id: string;
    deviceName: string;
    state: MultipathState;
    priority: number;
    failures: number;
    portalAddress: string;
    portalPort: number;
    initiatorPort: string;
    targetPort: string;
    lastCheckedAt: Date;
}
/**
 * iSCSI login parameters
 */
export interface iSCSILoginParameters {
    initiatorIqn: string;
    targetIqn: string;
    portalAddress: string;
    portalPort: number;
    authMethod?: iSCSIAuthMethod;
    chapCredentials?: CHAPCredentials;
    headerDigest?: boolean;
    dataDigest?: boolean;
    maxRecvDataSegmentLength?: number;
    sessionType?: 'Normal' | 'Discovery';
}
/**
 * iSCSI encryption configuration
 */
export interface iSCSIEncryptionConfig {
    enabled: boolean;
    algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
    keySize: 256 | 128;
    key?: Buffer;
    iv?: Buffer;
}
/**
 * iSCSI performance metrics
 */
export interface iSCSIPerformanceMetrics {
    sessionId: string;
    iops: number;
    throughputMBps: number;
    latencyMs: number;
    queueDepth: number;
    activeCommands: number;
    measuredAt: Date;
}
/**
 * 1. Generates a valid iSCSI Qualified Name (IQN)
 *
 * @param domain - Organization domain (e.g., 'whitecross.health')
 * @param identifier - Unique identifier for the target/initiator
 * @param year - Year of domain ownership (default: current year)
 * @param month - Month of domain ownership (default: 01)
 * @returns Valid IQN string
 */
export declare function generateIQN(domain: string, identifier: string, year?: number, month?: number): string;
/**
 * 2. Validates an iSCSI Qualified Name (IQN) format
 *
 * @param iqn - IQN string to validate
 * @returns True if valid, false otherwise
 */
export declare function validateIQN(iqn: string): boolean;
/**
 * 3. Parses an IQN string into its components
 *
 * @param iqn - IQN string to parse
 * @returns Parsed IQN components
 */
export declare function parseIQN(iqn: string): {
    year: number;
    month: number;
    namingAuthority: string;
    identifier: string;
} | null;
/**
 * 4. Generates an Extended Unique Identifier (EUI) format name
 *
 * @param companyId - IEEE company ID (24 bits)
 * @param extensionId - Vendor-specific extension (40 bits)
 * @returns Valid EUI-64 identifier
 */
export declare function generateEUI(companyId: string, extensionId: string): string;
/**
 * 5. Validates EUI-64 identifier format
 *
 * @param eui - EUI string to validate
 * @returns True if valid, false otherwise
 */
export declare function validateEUI(eui: string): boolean;
/**
 * 6. Generates a Network Address Authority (NAA) identifier
 *
 * @param vendorId - Vendor-specific identifier
 * @param format - NAA format (2, 3, 5, or 6)
 * @returns Valid NAA identifier
 */
export declare function generateNAA(vendorId: string, format?: 2 | 3 | 5 | 6): string;
/**
 * 7. Validates NAA identifier format
 *
 * @param naa - NAA string to validate
 * @returns True if valid, false otherwise
 */
export declare function validateNAA(naa: string): boolean;
/**
 * 8. Converts an IQN to a shortened alias
 *
 * @param iqn - IQN string
 * @param maxLength - Maximum alias length
 * @returns Shortened alias
 */
export declare function iqnToAlias(iqn: string, maxLength?: number): string;
/**
 * 9. Generates a unique World Wide Identifier (WWID) for multipath
 *
 * @param targetIqn - Target IQN
 * @param lunNumber - LUN number
 * @returns WWID string
 */
export declare function generateWWID(targetIqn: string, lunNumber: number): string;
/**
 * 10. Validates WWID format
 *
 * @param wwid - WWID string to validate
 * @returns True if valid, false otherwise
 */
export declare function validateWWID(wwid: string): boolean;
/**
 * 11. Creates a new iSCSI target configuration
 *
 * @param params - Target creation parameters
 * @returns iSCSI target object
 */
export declare function createTarget(params: {
    iqn: string;
    alias?: string;
    portals: iSCSIPortal[];
    authMethod?: iSCSIAuthMethod;
    chapUsername?: string;
    chapSecret?: string;
}): iSCSITarget;
/**
 * 12. Adds a LUN to an iSCSI target
 *
 * @param target - iSCSI target
 * @param lun - LUN configuration
 * @returns Updated target
 */
export declare function addLUNToTarget(target: iSCSITarget, lun: iSCSILUN): iSCSITarget;
/**
 * 13. Removes a LUN from an iSCSI target
 *
 * @param target - iSCSI target
 * @param lunNumber - LUN number to remove
 * @returns Updated target
 */
export declare function removeLUNFromTarget(target: iSCSITarget, lunNumber: number): iSCSITarget;
/**
 * 14. Adds a portal to an iSCSI target
 *
 * @param target - iSCSI target
 * @param portal - Portal configuration
 * @returns Updated target
 */
export declare function addPortalToTarget(target: iSCSITarget, portal: iSCSIPortal): iSCSITarget;
/**
 * 15. Removes a portal from an iSCSI target
 *
 * @param target - iSCSI target
 * @param portalId - Portal ID to remove
 * @returns Updated target
 */
export declare function removePortalFromTarget(target: iSCSITarget, portalId: string): iSCSITarget;
/**
 * 16. Updates target authentication settings
 *
 * @param target - iSCSI target
 * @param authMethod - Authentication method
 * @param credentials - Optional credentials
 * @returns Updated target
 */
export declare function updateTargetAuth(target: iSCSITarget, authMethod: iSCSIAuthMethod, credentials?: {
    chapUsername?: string;
    chapSecret?: string;
    mutualChapUsername?: string;
    mutualChapSecret?: string;
}): iSCSITarget;
/**
 * 17. Updates target performance parameters
 *
 * @param target - iSCSI target
 * @param params - Performance parameters
 * @returns Updated target
 */
export declare function updateTargetPerformanceParams(target: iSCSITarget, params: {
    maxRecvDataSegmentLength?: number;
    maxBurstLength?: number;
    firstBurstLength?: number;
    maxOutstandingR2T?: number;
    initialR2T?: boolean;
    immediateData?: boolean;
}): iSCSITarget;
/**
 * 18. Enables or disables a target
 *
 * @param target - iSCSI target
 * @param enabled - Enable/disable flag
 * @returns Updated target
 */
export declare function setTargetEnabled(target: iSCSITarget, enabled: boolean): iSCSITarget;
/**
 * 19. Gets target statistics and information
 *
 * @param target - iSCSI target
 * @returns Target statistics
 */
export declare function getTargetInfo(target: iSCSITarget): {
    iqn: string;
    alias?: string;
    portalCount: number;
    lunCount: number;
    totalCapacityBytes: number;
    authMethod: iSCSIAuthMethod;
    enabled: boolean;
};
/**
 * 20. Validates target configuration
 *
 * @param target - iSCSI target to validate
 * @returns Validation result with errors
 */
export declare function validateTargetConfig(target: iSCSITarget): {
    valid: boolean;
    errors: string[];
};
/**
 * 21. Creates a new iSCSI initiator configuration
 *
 * @param params - Initiator creation parameters
 * @returns iSCSI initiator object
 */
export declare function createInitiator(params: {
    iqn: string;
    alias?: string;
    authMethod?: iSCSIAuthMethod;
    chapUsername?: string;
    chapSecret?: string;
}): iSCSIInitiator;
/**
 * 22. Creates a new iSCSI session
 *
 * @param initiator - Initiator configuration
 * @param target - Target configuration
 * @param portal - Target portal
 * @returns iSCSI session object
 */
export declare function createSession(initiator: iSCSIInitiator, target: iSCSITarget, portal: iSCSIPortal): iSCSISession;
/**
 * 23. Adds a connection to an existing session
 *
 * @param session - iSCSI session
 * @param portal - Target portal
 * @param localAddress - Local IP address
 * @param localPort - Local port
 * @returns Updated session
 */
export declare function addConnectionToSession(session: iSCSISession, portal: iSCSIPortal, localAddress: string, localPort: number): iSCSISession;
/**
 * 24. Updates session state
 *
 * @param session - iSCSI session
 * @param state - New session state
 * @returns Updated session
 */
export declare function updateSessionState(session: iSCSISession, state: iSCSISessionState): iSCSISession;
/**
 * 25. Updates session authentication status
 *
 * @param session - iSCSI session
 * @param authenticated - Authentication status
 * @returns Updated session
 */
export declare function setSessionAuthenticated(session: iSCSISession, authenticated: boolean): iSCSISession;
/**
 * 26. Updates session statistics
 *
 * @param session - iSCSI session
 * @param stats - Statistics update
 * @returns Updated session
 */
export declare function updateSessionStatistics(session: iSCSISession, stats: Partial<iSCSISessionStatistics>): iSCSISession;
/**
 * 27. Closes a session connection
 *
 * @param session - iSCSI session
 * @param connectionId - Connection ID to close
 * @returns Updated session
 */
export declare function closeSessionConnection(session: iSCSISession, connectionId: string): iSCSISession;
/**
 * 28. Gets session performance metrics
 *
 * @param session - iSCSI session
 * @returns Performance metrics
 */
export declare function getSessionPerformanceMetrics(session: iSCSISession): iSCSIPerformanceMetrics;
/**
 * 29. Checks if a session is healthy
 *
 * @param session - iSCSI session
 * @param timeoutSeconds - Timeout threshold in seconds
 * @returns Health status
 */
export declare function isSessionHealthy(session: iSCSISession, timeoutSeconds?: number): boolean;
/**
 * 30. Terminates an iSCSI session
 *
 * @param session - iSCSI session
 * @param reason - Termination reason
 * @returns Updated session
 */
export declare function terminateSession(session: iSCSISession, reason: string): iSCSISession;
/**
 * 31. Generates CHAP challenge for authentication
 *
 * @param identifier - CHAP identifier (0-255)
 * @param challengeLength - Challenge length in bytes
 * @returns CHAP challenge
 */
export declare function generateCHAPChallenge(identifier: number, challengeLength?: number): CHAPCredentials;
/**
 * 32. Computes CHAP response
 *
 * @param identifier - CHAP identifier
 * @param secret - Shared secret
 * @param challenge - CHAP challenge
 * @returns CHAP response
 */
export declare function computeCHAPResponse(identifier: number, secret: string, challenge: string): string;
/**
 * 33. Validates CHAP response
 *
 * @param credentials - CHAP credentials with response
 * @param expectedSecret - Expected shared secret
 * @returns True if response is valid
 */
export declare function validateCHAPResponse(credentials: CHAPCredentials, expectedSecret: string): boolean;
/**
 * 34. Performs mutual CHAP authentication
 *
 * @param initiatorCreds - Initiator credentials
 * @param targetCreds - Target credentials
 * @returns Mutual authentication result
 */
export declare function performMutualCHAP(initiatorCreds: CHAPCredentials & {
    secret: string;
}, targetCreds: CHAPCredentials & {
    secret: string;
}): {
    initiatorAuthenticated: boolean;
    targetAuthenticated: boolean;
    initiatorResponse?: string;
    targetResponse?: string;
};
/**
 * 35. Generates secure CHAP secret
 *
 * @param length - Secret length (minimum 12, recommended 16+)
 * @returns Secure random secret
 */
export declare function generateCHAPSecret(length?: number): string;
/**
 * 36. Creates a multipath configuration
 *
 * @param wwid - World Wide Identifier
 * @param policy - Load balancing policy
 * @param paths - Initial paths
 * @returns Multipath configuration
 */
export declare function createMultipathConfig(wwid: string, policy: MultipathPolicy, paths: MultipathPath[]): MultipathConfig;
/**
 * 37. Adds a path to multipath configuration
 *
 * @param config - Multipath configuration
 * @param path - Path to add
 * @returns Updated multipath configuration
 */
export declare function addMultipathPath(config: MultipathConfig, path: MultipathPath): MultipathConfig;
/**
 * 38. Updates path state in multipath configuration
 *
 * @param config - Multipath configuration
 * @param pathId - Path ID
 * @param state - New path state
 * @returns Updated multipath configuration
 */
export declare function updateMultipathPathState(config: MultipathConfig, pathId: string, state: MultipathState): MultipathConfig;
/**
 * 39. Selects optimal path based on policy
 *
 * @param config - Multipath configuration
 * @param currentPathId - Current path ID (for round-robin)
 * @returns Selected path
 */
export declare function selectOptimalPath(config: MultipathConfig, currentPathId?: string): MultipathPath | null;
/**
 * 40. Encrypts iSCSI data with specified algorithm
 *
 * @param data - Data to encrypt
 * @param config - Encryption configuration
 * @returns Encrypted data and IV
 */
export declare function encryptISCSIData(data: Buffer, config: iSCSIEncryptionConfig): {
    encrypted: Buffer;
    iv: Buffer;
};
/**
 * 41. Decrypts iSCSI data with specified algorithm
 *
 * @param encrypted - Encrypted data
 * @param iv - Initialization vector
 * @param config - Encryption configuration
 * @returns Decrypted data
 */
export declare function decryptISCSIData(encrypted: Buffer, iv: Buffer, config: iSCSIEncryptionConfig): Buffer;
declare const _default: {
    generateIQN: typeof generateIQN;
    validateIQN: typeof validateIQN;
    parseIQN: typeof parseIQN;
    generateEUI: typeof generateEUI;
    validateEUI: typeof validateEUI;
    generateNAA: typeof generateNAA;
    validateNAA: typeof validateNAA;
    iqnToAlias: typeof iqnToAlias;
    generateWWID: typeof generateWWID;
    validateWWID: typeof validateWWID;
    createTarget: typeof createTarget;
    addLUNToTarget: typeof addLUNToTarget;
    removeLUNFromTarget: typeof removeLUNFromTarget;
    addPortalToTarget: typeof addPortalToTarget;
    removePortalFromTarget: typeof removePortalFromTarget;
    updateTargetAuth: typeof updateTargetAuth;
    updateTargetPerformanceParams: typeof updateTargetPerformanceParams;
    setTargetEnabled: typeof setTargetEnabled;
    getTargetInfo: typeof getTargetInfo;
    validateTargetConfig: typeof validateTargetConfig;
    createInitiator: typeof createInitiator;
    createSession: typeof createSession;
    addConnectionToSession: typeof addConnectionToSession;
    updateSessionState: typeof updateSessionState;
    setSessionAuthenticated: typeof setSessionAuthenticated;
    updateSessionStatistics: typeof updateSessionStatistics;
    closeSessionConnection: typeof closeSessionConnection;
    getSessionPerformanceMetrics: typeof getSessionPerformanceMetrics;
    isSessionHealthy: typeof isSessionHealthy;
    terminateSession: typeof terminateSession;
    generateCHAPChallenge: typeof generateCHAPChallenge;
    computeCHAPResponse: typeof computeCHAPResponse;
    validateCHAPResponse: typeof validateCHAPResponse;
    performMutualCHAP: typeof performMutualCHAP;
    generateCHAPSecret: typeof generateCHAPSecret;
    createMultipathConfig: typeof createMultipathConfig;
    addMultipathPath: typeof addMultipathPath;
    updateMultipathPathState: typeof updateMultipathPathState;
    selectOptimalPath: typeof selectOptimalPath;
    encryptISCSIData: typeof encryptISCSIData;
    decryptISCSIData: typeof decryptISCSIData;
};
export default _default;
//# sourceMappingURL=san-iscsi-operations-kit.d.ts.map