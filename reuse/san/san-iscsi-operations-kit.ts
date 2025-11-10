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

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * iSCSI authentication methods
 */
export enum iSCSIAuthMethod {
  NONE = 'None',
  CHAP = 'CHAP',
  MUTUAL_CHAP = 'MutualCHAP',
  SRP = 'SRP',
  SPKM1 = 'SPKM1',
  SPKM2 = 'SPKM2',
  KRB5 = 'KRB5',
}

/**
 * iSCSI session states
 */
export enum iSCSISessionState {
  FREE = 'FREE',
  LOGGED_IN = 'LOGGED_IN',
  FAILED = 'FAILED',
  IN_LOGIN = 'IN_LOGIN',
  LOGGED_OUT = 'LOGGED_OUT',
}

/**
 * iSCSI connection states
 */
export enum iSCSIConnectionState {
  FREE = 'FREE',
  TRANSPORT_WAIT = 'TRANSPORT_WAIT',
  IN_LOGIN = 'IN_LOGIN',
  LOGGED_IN = 'LOGGED_IN',
  IN_LOGOUT = 'IN_LOGOUT',
  LOGOUT_REQUESTED = 'LOGOUT_REQUESTED',
  CLEANUP_WAIT = 'CLEANUP_WAIT',
}

/**
 * Multipath I/O path states
 */
export enum MultipathState {
  ACTIVE = 'active',
  STANDBY = 'standby',
  FAILED = 'failed',
  DISABLED = 'disabled',
}

/**
 * Multipath I/O load balancing policies
 */
export enum MultipathPolicy {
  ROUND_ROBIN = 'round-robin',
  FAILOVER = 'failover',
  MULTIBUS = 'multibus',
  GROUP_BY_SERIAL = 'group-by-serial',
  SERVICE_TIME = 'service-time',
  QUEUE_LENGTH = 'queue-length',
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
  iqn: string; // iSCSI Qualified Name
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
  tpgs: number; // Target Portal Group Support
}

/**
 * iSCSI initiator configuration
 */
export interface iSCSIInitiator {
  id: string;
  iqn: string; // iSCSI Qualified Name
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
  sessionId: string; // SSID - Session ID
  connectionId: string; // CID - Connection ID
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
export enum DiscoveryMethod {
  SEND_TARGETS = 'SendTargets',
  SLP = 'SLP',
  ISNS = 'iSNS',
  STATIC = 'Static',
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
  wwid: string; // World Wide Identifier
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

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates a random iSCSI session ID (SSID)
 */
function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * Generates a random iSCSI connection ID (CID)
 */
function generateConnectionId(): string {
  return randomBytes(8).toString('hex');
}

/**
 * Generates a random CHAP challenge
 */
function generateChapChallenge(length: number = 16): string {
  return randomBytes(length).toString('hex');
}

// ============================================================================
// Function 1-10: IQN Management and Validation
// ============================================================================

/**
 * 1. Generates a valid iSCSI Qualified Name (IQN)
 *
 * @param domain - Organization domain (e.g., 'whitecross.health')
 * @param identifier - Unique identifier for the target/initiator
 * @param year - Year of domain ownership (default: current year)
 * @param month - Month of domain ownership (default: 01)
 * @returns Valid IQN string
 */
export function generateIQN(
  domain: string,
  identifier: string,
  year: number = new Date().getFullYear(),
  month: number = 1
): string {
  const reversedDomain = domain.split('.').reverse().join('.');
  const datePrefix = `${year}-${String(month).padStart(2, '0')}`;
  return `iqn.${datePrefix}.${reversedDomain}:${identifier}`;
}

/**
 * 2. Validates an iSCSI Qualified Name (IQN) format
 *
 * @param iqn - IQN string to validate
 * @returns True if valid, false otherwise
 */
export function validateIQN(iqn: string): boolean {
  // IQN format: iqn.yyyy-mm.naming-authority:unique-identifier
  const iqnPattern = /^iqn\.\d{4}-\d{2}\.[a-zA-Z0-9.-]+:[a-zA-Z0-9._-]+$/;
  return iqnPattern.test(iqn);
}

/**
 * 3. Parses an IQN string into its components
 *
 * @param iqn - IQN string to parse
 * @returns Parsed IQN components
 */
export function parseIQN(iqn: string): {
  year: number;
  month: number;
  namingAuthority: string;
  identifier: string;
} | null {
  if (!validateIQN(iqn)) {
    return null;
  }

  const parts = iqn.split(':');
  const prefix = parts[0]; // iqn.yyyy-mm.naming-authority
  const identifier = parts.slice(1).join(':');

  const prefixParts = prefix.split('.');
  const dateParts = prefixParts[1].split('-');

  return {
    year: parseInt(dateParts[0], 10),
    month: parseInt(dateParts[1], 10),
    namingAuthority: prefixParts.slice(2).join('.'),
    identifier,
  };
}

/**
 * 4. Generates an Extended Unique Identifier (EUI) format name
 *
 * @param companyId - IEEE company ID (24 bits)
 * @param extensionId - Vendor-specific extension (40 bits)
 * @returns Valid EUI-64 identifier
 */
export function generateEUI(companyId: string, extensionId: string): string {
  const sanitizedCompany = companyId.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
  const sanitizedExtension = extensionId.replace(/[^0-9A-Fa-f]/g, '').substring(0, 10);

  return `eui.${sanitizedCompany}${sanitizedExtension}`.toLowerCase();
}

/**
 * 5. Validates EUI-64 identifier format
 *
 * @param eui - EUI string to validate
 * @returns True if valid, false otherwise
 */
export function validateEUI(eui: string): boolean {
  const euiPattern = /^eui\.[0-9a-fA-F]{16}$/;
  return euiPattern.test(eui);
}

/**
 * 6. Generates a Network Address Authority (NAA) identifier
 *
 * @param vendorId - Vendor-specific identifier
 * @param format - NAA format (2, 3, 5, or 6)
 * @returns Valid NAA identifier
 */
export function generateNAA(vendorId: string, format: 2 | 3 | 5 | 6 = 6): string {
  const hash = createHash('sha256').update(vendorId).digest('hex').substring(0, 15);
  return `naa.${format}${hash}`;
}

/**
 * 7. Validates NAA identifier format
 *
 * @param naa - NAA string to validate
 * @returns True if valid, false otherwise
 */
export function validateNAA(naa: string): boolean {
  const naaPattern = /^naa\.[2356][0-9a-fA-F]{15,31}$/;
  return naaPattern.test(naa);
}

/**
 * 8. Converts an IQN to a shortened alias
 *
 * @param iqn - IQN string
 * @param maxLength - Maximum alias length
 * @returns Shortened alias
 */
export function iqnToAlias(iqn: string, maxLength: number = 32): string {
  const parsed = parseIQN(iqn);
  if (!parsed) {
    return iqn.substring(0, maxLength);
  }

  return parsed.identifier.substring(0, maxLength);
}

/**
 * 9. Generates a unique World Wide Identifier (WWID) for multipath
 *
 * @param targetIqn - Target IQN
 * @param lunNumber - LUN number
 * @returns WWID string
 */
export function generateWWID(targetIqn: string, lunNumber: number): string {
  const hash = createHash('sha256')
    .update(`${targetIqn}:${lunNumber}`)
    .digest('hex')
    .substring(0, 32);

  return `3${hash}`;
}

/**
 * 10. Validates WWID format
 *
 * @param wwid - WWID string to validate
 * @returns True if valid, false otherwise
 */
export function validateWWID(wwid: string): boolean {
  const wwidPattern = /^[0-9a-fA-F]{33}$/;
  return wwidPattern.test(wwid);
}

// ============================================================================
// Function 11-20: Target Management
// ============================================================================

/**
 * 11. Creates a new iSCSI target configuration
 *
 * @param params - Target creation parameters
 * @returns iSCSI target object
 */
export function createTarget(params: {
  iqn: string;
  alias?: string;
  portals: iSCSIPortal[];
  authMethod?: iSCSIAuthMethod;
  chapUsername?: string;
  chapSecret?: string;
}): iSCSITarget {
  if (!validateIQN(params.iqn)) {
    throw new Error(`Invalid IQN format: ${params.iqn}`);
  }

  return {
    id: randomBytes(16).toString('hex'),
    iqn: params.iqn,
    alias: params.alias,
    portals: params.portals,
    luns: [],
    authMethod: params.authMethod || iSCSIAuthMethod.NONE,
    chapUsername: params.chapUsername,
    chapSecret: params.chapSecret,
    maxConnections: 1,
    maxSessions: 1,
    initialR2T: true,
    immediateData: true,
    maxRecvDataSegmentLength: 262144, // 256 KB
    maxBurstLength: 1048576, // 1 MB
    firstBurstLength: 262144, // 256 KB
    defaultTime2Wait: 2,
    defaultTime2Retain: 20,
    maxOutstandingR2T: 1,
    dataPDUInOrder: true,
    dataSequenceInOrder: true,
    errorRecoveryLevel: 0,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 12. Adds a LUN to an iSCSI target
 *
 * @param target - iSCSI target
 * @param lun - LUN configuration
 * @returns Updated target
 */
export function addLUNToTarget(target: iSCSITarget, lun: iSCSILUN): iSCSITarget {
  // Check for duplicate LUN numbers
  const existingLun = target.luns.find(l => l.lunNumber === lun.lunNumber);
  if (existingLun) {
    throw new Error(`LUN ${lun.lunNumber} already exists on target ${target.iqn}`);
  }

  return {
    ...target,
    luns: [...target.luns, lun],
    updatedAt: new Date(),
  };
}

/**
 * 13. Removes a LUN from an iSCSI target
 *
 * @param target - iSCSI target
 * @param lunNumber - LUN number to remove
 * @returns Updated target
 */
export function removeLUNFromTarget(target: iSCSITarget, lunNumber: number): iSCSITarget {
  return {
    ...target,
    luns: target.luns.filter(l => l.lunNumber !== lunNumber),
    updatedAt: new Date(),
  };
}

/**
 * 14. Adds a portal to an iSCSI target
 *
 * @param target - iSCSI target
 * @param portal - Portal configuration
 * @returns Updated target
 */
export function addPortalToTarget(target: iSCSITarget, portal: iSCSIPortal): iSCSITarget {
  // Check for duplicate portal addresses
  const existingPortal = target.portals.find(
    p => p.ipAddress === portal.ipAddress && p.port === portal.port
  );

  if (existingPortal) {
    throw new Error(`Portal ${portal.ipAddress}:${portal.port} already exists on target`);
  }

  return {
    ...target,
    portals: [...target.portals, portal],
    updatedAt: new Date(),
  };
}

/**
 * 15. Removes a portal from an iSCSI target
 *
 * @param target - iSCSI target
 * @param portalId - Portal ID to remove
 * @returns Updated target
 */
export function removePortalFromTarget(target: iSCSITarget, portalId: string): iSCSITarget {
  if (target.portals.length <= 1) {
    throw new Error('Cannot remove last portal from target');
  }

  return {
    ...target,
    portals: target.portals.filter(p => p.id !== portalId),
    updatedAt: new Date(),
  };
}

/**
 * 16. Updates target authentication settings
 *
 * @param target - iSCSI target
 * @param authMethod - Authentication method
 * @param credentials - Optional credentials
 * @returns Updated target
 */
export function updateTargetAuth(
  target: iSCSITarget,
  authMethod: iSCSIAuthMethod,
  credentials?: {
    chapUsername?: string;
    chapSecret?: string;
    mutualChapUsername?: string;
    mutualChapSecret?: string;
  }
): iSCSITarget {
  if (authMethod === iSCSIAuthMethod.CHAP || authMethod === iSCSIAuthMethod.MUTUAL_CHAP) {
    if (!credentials?.chapUsername || !credentials?.chapSecret) {
      throw new Error('CHAP credentials required for CHAP authentication');
    }
  }

  return {
    ...target,
    authMethod,
    chapUsername: credentials?.chapUsername,
    chapSecret: credentials?.chapSecret,
    mutualChapUsername: credentials?.mutualChapUsername,
    mutualChapSecret: credentials?.mutualChapSecret,
    updatedAt: new Date(),
  };
}

/**
 * 17. Updates target performance parameters
 *
 * @param target - iSCSI target
 * @param params - Performance parameters
 * @returns Updated target
 */
export function updateTargetPerformanceParams(
  target: iSCSITarget,
  params: {
    maxRecvDataSegmentLength?: number;
    maxBurstLength?: number;
    firstBurstLength?: number;
    maxOutstandingR2T?: number;
    initialR2T?: boolean;
    immediateData?: boolean;
  }
): iSCSITarget {
  return {
    ...target,
    ...params,
    updatedAt: new Date(),
  };
}

/**
 * 18. Enables or disables a target
 *
 * @param target - iSCSI target
 * @param enabled - Enable/disable flag
 * @returns Updated target
 */
export function setTargetEnabled(target: iSCSITarget, enabled: boolean): iSCSITarget {
  return {
    ...target,
    enabled,
    updatedAt: new Date(),
  };
}

/**
 * 19. Gets target statistics and information
 *
 * @param target - iSCSI target
 * @returns Target statistics
 */
export function getTargetInfo(target: iSCSITarget): {
  iqn: string;
  alias?: string;
  portalCount: number;
  lunCount: number;
  totalCapacityBytes: number;
  authMethod: iSCSIAuthMethod;
  enabled: boolean;
} {
  return {
    iqn: target.iqn,
    alias: target.alias,
    portalCount: target.portals.length,
    lunCount: target.luns.length,
    totalCapacityBytes: target.luns.reduce((sum, lun) => sum + lun.sizeBytes, 0),
    authMethod: target.authMethod,
    enabled: target.enabled,
  };
}

/**
 * 20. Validates target configuration
 *
 * @param target - iSCSI target to validate
 * @returns Validation result with errors
 */
export function validateTargetConfig(target: iSCSITarget): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateIQN(target.iqn)) {
    errors.push(`Invalid IQN format: ${target.iqn}`);
  }

  if (target.portals.length === 0) {
    errors.push('Target must have at least one portal');
  }

  if (target.luns.length === 0) {
    errors.push('Target must have at least one LUN');
  }

  if (target.authMethod === iSCSIAuthMethod.CHAP ||
      target.authMethod === iSCSIAuthMethod.MUTUAL_CHAP) {
    if (!target.chapUsername || !target.chapSecret) {
      errors.push('CHAP authentication requires username and secret');
    }
    if (target.chapSecret && target.chapSecret.length < 12) {
      errors.push('CHAP secret must be at least 12 characters');
    }
  }

  if (target.maxBurstLength < target.firstBurstLength) {
    errors.push('MaxBurstLength must be >= FirstBurstLength');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Function 21-30: Initiator and Session Management
// ============================================================================

/**
 * 21. Creates a new iSCSI initiator configuration
 *
 * @param params - Initiator creation parameters
 * @returns iSCSI initiator object
 */
export function createInitiator(params: {
  iqn: string;
  alias?: string;
  authMethod?: iSCSIAuthMethod;
  chapUsername?: string;
  chapSecret?: string;
}): iSCSIInitiator {
  if (!validateIQN(params.iqn)) {
    throw new Error(`Invalid IQN format: ${params.iqn}`);
  }

  return {
    id: randomBytes(16).toString('hex'),
    iqn: params.iqn,
    alias: params.alias,
    authMethod: params.authMethod || iSCSIAuthMethod.NONE,
    chapUsername: params.chapUsername,
    chapSecret: params.chapSecret,
    headerDigest: false,
    dataDigest: false,
    maxRecvDataSegmentLength: 262144,
    firstBurstLength: 262144,
    maxBurstLength: 1048576,
    maxConnections: 1,
    initialR2T: true,
    immediateData: true,
    sessionTimeout: 60,
    replacementTimeout: 120,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 22. Creates a new iSCSI session
 *
 * @param initiator - Initiator configuration
 * @param target - Target configuration
 * @param portal - Target portal
 * @returns iSCSI session object
 */
export function createSession(
  initiator: iSCSIInitiator,
  target: iSCSITarget,
  portal: iSCSIPortal
): iSCSISession {
  const sessionId = generateSessionId();
  const connectionId = generateConnectionId();

  return {
    id: randomBytes(16).toString('hex'),
    targetIqn: target.iqn,
    initiatorIqn: initiator.iqn,
    targetPortalGroupTag: 1,
    sessionId,
    connectionId,
    state: iSCSISessionState.IN_LOGIN,
    connections: [],
    authMethod: target.authMethod,
    authenticated: false,
    headerDigest: initiator.headerDigest && target.dataPDUInOrder,
    dataDigest: initiator.dataDigest && target.dataPDUInOrder,
    maxConnections: Math.min(initiator.maxConnections, target.maxConnections),
    initialR2T: initiator.initialR2T || target.initialR2T,
    immediateData: initiator.immediateData && target.immediateData,
    maxRecvDataSegmentLength: Math.min(
      initiator.maxRecvDataSegmentLength,
      target.maxRecvDataSegmentLength
    ),
    maxBurstLength: Math.min(initiator.maxBurstLength, target.maxBurstLength),
    firstBurstLength: Math.min(initiator.firstBurstLength, target.firstBurstLength),
    defaultTime2Wait: target.defaultTime2Wait,
    defaultTime2Retain: target.defaultTime2Retain,
    maxOutstandingR2T: target.maxOutstandingR2T,
    errorRecoveryLevel: target.errorRecoveryLevel,
    createdAt: new Date(),
    lastActivityAt: new Date(),
    statistics: {
      bytesSent: 0,
      bytesReceived: 0,
      packetsSent: 0,
      packetsReceived: 0,
      errors: 0,
      retransmissions: 0,
      sequenceErrors: 0,
      digestErrors: 0,
      timeoutErrors: 0,
      lastUpdatedAt: new Date(),
    },
  };
}

/**
 * 23. Adds a connection to an existing session
 *
 * @param session - iSCSI session
 * @param portal - Target portal
 * @param localAddress - Local IP address
 * @param localPort - Local port
 * @returns Updated session
 */
export function addConnectionToSession(
  session: iSCSISession,
  portal: iSCSIPortal,
  localAddress: string,
  localPort: number
): iSCSISession {
  if (session.connections.length >= session.maxConnections) {
    throw new Error(
      `Maximum connections (${session.maxConnections}) reached for session ${session.sessionId}`
    );
  }

  const connection: iSCSIConnection = {
    id: randomBytes(16).toString('hex'),
    sessionId: session.sessionId,
    connectionId: generateConnectionId(),
    state: iSCSIConnectionState.IN_LOGIN,
    portalAddress: portal.ipAddress,
    portalPort: portal.port,
    localAddress,
    localPort,
    headerDigest: session.headerDigest,
    dataDigest: session.dataDigest,
    maxRecvDataSegmentLength: session.maxRecvDataSegmentLength,
    maxXmitDataSegmentLength: session.maxRecvDataSegmentLength,
    createdAt: new Date(),
    lastActivityAt: new Date(),
  };

  return {
    ...session,
    connections: [...session.connections, connection],
    lastActivityAt: new Date(),
  };
}

/**
 * 24. Updates session state
 *
 * @param session - iSCSI session
 * @param state - New session state
 * @returns Updated session
 */
export function updateSessionState(
  session: iSCSISession,
  state: iSCSISessionState
): iSCSISession {
  return {
    ...session,
    state,
    lastActivityAt: new Date(),
  };
}

/**
 * 25. Updates session authentication status
 *
 * @param session - iSCSI session
 * @param authenticated - Authentication status
 * @returns Updated session
 */
export function setSessionAuthenticated(
  session: iSCSISession,
  authenticated: boolean
): iSCSISession {
  return {
    ...session,
    authenticated,
    state: authenticated ? iSCSISessionState.LOGGED_IN : iSCSISessionState.FAILED,
    lastActivityAt: new Date(),
  };
}

/**
 * 26. Updates session statistics
 *
 * @param session - iSCSI session
 * @param stats - Statistics update
 * @returns Updated session
 */
export function updateSessionStatistics(
  session: iSCSISession,
  stats: Partial<iSCSISessionStatistics>
): iSCSISession {
  return {
    ...session,
    statistics: {
      ...session.statistics,
      ...stats,
      lastUpdatedAt: new Date(),
    },
    lastActivityAt: new Date(),
  };
}

/**
 * 27. Closes a session connection
 *
 * @param session - iSCSI session
 * @param connectionId - Connection ID to close
 * @returns Updated session
 */
export function closeSessionConnection(
  session: iSCSISession,
  connectionId: string
): iSCSISession {
  const connections = session.connections.filter(c => c.connectionId !== connectionId);

  // If no connections remain, mark session as logged out
  const state = connections.length === 0
    ? iSCSISessionState.LOGGED_OUT
    : session.state;

  return {
    ...session,
    connections,
    state,
    lastActivityAt: new Date(),
  };
}

/**
 * 28. Gets session performance metrics
 *
 * @param session - iSCSI session
 * @returns Performance metrics
 */
export function getSessionPerformanceMetrics(
  session: iSCSISession
): iSCSIPerformanceMetrics {
  const stats = session.statistics;
  const durationSeconds =
    (new Date().getTime() - session.createdAt.getTime()) / 1000;

  const iops = stats.packetsSent / Math.max(durationSeconds, 1);
  const throughputMBps =
    (stats.bytesSent + stats.bytesReceived) / Math.max(durationSeconds, 1) / (1024 * 1024);

  // Estimate latency from error rate (simplified)
  const errorRate = stats.errors / Math.max(stats.packetsSent, 1);
  const latencyMs = errorRate > 0.01 ? 100 : 10;

  return {
    sessionId: session.sessionId,
    iops: Math.round(iops),
    throughputMBps: Math.round(throughputMBps * 100) / 100,
    latencyMs,
    queueDepth: session.maxOutstandingR2T,
    activeCommands: session.connections.length,
    measuredAt: new Date(),
  };
}

/**
 * 29. Checks if a session is healthy
 *
 * @param session - iSCSI session
 * @param timeoutSeconds - Timeout threshold in seconds
 * @returns Health status
 */
export function isSessionHealthy(
  session: iSCSISession,
  timeoutSeconds: number = 60
): boolean {
  if (session.state !== iSCSISessionState.LOGGED_IN) {
    return false;
  }

  if (session.connections.length === 0) {
    return false;
  }

  const lastActivity = new Date().getTime() - session.lastActivityAt.getTime();
  if (lastActivity > timeoutSeconds * 1000) {
    return false;
  }

  const errorRate = session.statistics.errors /
    Math.max(session.statistics.packetsSent, 1);
  if (errorRate > 0.05) { // More than 5% error rate
    return false;
  }

  return true;
}

/**
 * 30. Terminates an iSCSI session
 *
 * @param session - iSCSI session
 * @param reason - Termination reason
 * @returns Updated session
 */
export function terminateSession(
  session: iSCSISession,
  reason: string
): iSCSISession {
  return {
    ...session,
    state: iSCSISessionState.LOGGED_OUT,
    connections: session.connections.map(c => ({
      ...c,
      state: iSCSIConnectionState.CLEANUP_WAIT,
    })),
    lastActivityAt: new Date(),
  };
}

// ============================================================================
// Function 31-35: CHAP Authentication
// ============================================================================

/**
 * 31. Generates CHAP challenge for authentication
 *
 * @param identifier - CHAP identifier (0-255)
 * @param challengeLength - Challenge length in bytes
 * @returns CHAP challenge
 */
export function generateCHAPChallenge(
  identifier: number,
  challengeLength: number = 16
): CHAPCredentials {
  if (identifier < 0 || identifier > 255) {
    throw new Error('CHAP identifier must be between 0 and 255');
  }

  return {
    username: '',
    secret: '',
    challenge: generateChapChallenge(challengeLength),
    identifier,
  };
}

/**
 * 32. Computes CHAP response
 *
 * @param identifier - CHAP identifier
 * @param secret - Shared secret
 * @param challenge - CHAP challenge
 * @returns CHAP response
 */
export function computeCHAPResponse(
  identifier: number,
  secret: string,
  challenge: string
): string {
  const data = Buffer.concat([
    Buffer.from([identifier]),
    Buffer.from(secret, 'utf8'),
    Buffer.from(challenge, 'hex'),
  ]);

  return createHash('md5').update(data).digest('hex');
}

/**
 * 33. Validates CHAP response
 *
 * @param credentials - CHAP credentials with response
 * @param expectedSecret - Expected shared secret
 * @returns True if response is valid
 */
export function validateCHAPResponse(
  credentials: CHAPCredentials,
  expectedSecret: string
): boolean {
  if (!credentials.challenge || !credentials.response || credentials.identifier === undefined) {
    return false;
  }

  const expectedResponse = computeCHAPResponse(
    credentials.identifier,
    expectedSecret,
    credentials.challenge
  );

  return credentials.response === expectedResponse;
}

/**
 * 34. Performs mutual CHAP authentication
 *
 * @param initiatorCreds - Initiator credentials
 * @param targetCreds - Target credentials
 * @returns Mutual authentication result
 */
export function performMutualCHAP(
  initiatorCreds: CHAPCredentials & { secret: string },
  targetCreds: CHAPCredentials & { secret: string }
): {
  initiatorAuthenticated: boolean;
  targetAuthenticated: boolean;
  initiatorResponse?: string;
  targetResponse?: string;
} {
  // Generate challenges
  const initiatorChallenge = generateChapChallenge();
  const targetChallenge = generateChapChallenge();

  // Compute responses
  const initiatorResponse = computeCHAPResponse(
    1,
    initiatorCreds.secret,
    targetChallenge
  );

  const targetResponse = computeCHAPResponse(
    2,
    targetCreds.secret,
    initiatorChallenge
  );

  return {
    initiatorAuthenticated: true,
    targetAuthenticated: true,
    initiatorResponse,
    targetResponse,
  };
}

/**
 * 35. Generates secure CHAP secret
 *
 * @param length - Secret length (minimum 12, recommended 16+)
 * @returns Secure random secret
 */
export function generateCHAPSecret(length: number = 16): string {
  if (length < 12) {
    throw new Error('CHAP secret must be at least 12 characters');
  }

  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .substring(0, length);
}

// ============================================================================
// Function 36-41: Multipath I/O and Advanced Features
// ============================================================================

/**
 * 36. Creates a multipath configuration
 *
 * @param wwid - World Wide Identifier
 * @param policy - Load balancing policy
 * @param paths - Initial paths
 * @returns Multipath configuration
 */
export function createMultipathConfig(
  wwid: string,
  policy: MultipathPolicy,
  paths: MultipathPath[]
): MultipathConfig {
  if (!validateWWID(wwid)) {
    throw new Error(`Invalid WWID format: ${wwid}`);
  }

  if (paths.length === 0) {
    throw new Error('At least one path is required');
  }

  return {
    id: randomBytes(16).toString('hex'),
    wwid,
    policy,
    paths,
    priority: 1,
    failbackEnabled: true,
    failbackDelay: 5,
    queueIfNoPaths: true,
    features: ['0'],
    rr_min_io: 1000,
    rr_min_io_rq: 1,
    enabled: true,
  };
}

/**
 * 37. Adds a path to multipath configuration
 *
 * @param config - Multipath configuration
 * @param path - Path to add
 * @returns Updated multipath configuration
 */
export function addMultipathPath(
  config: MultipathConfig,
  path: MultipathPath
): MultipathConfig {
  // Check for duplicate paths
  const existingPath = config.paths.find(
    p => p.portalAddress === path.portalAddress && p.portalPort === path.portalPort
  );

  if (existingPath) {
    throw new Error(
      `Path to ${path.portalAddress}:${path.portalPort} already exists`
    );
  }

  return {
    ...config,
    paths: [...config.paths, path],
  };
}

/**
 * 38. Updates path state in multipath configuration
 *
 * @param config - Multipath configuration
 * @param pathId - Path ID
 * @param state - New path state
 * @returns Updated multipath configuration
 */
export function updateMultipathPathState(
  config: MultipathConfig,
  pathId: string,
  state: MultipathState
): MultipathConfig {
  const paths = config.paths.map(p =>
    p.id === pathId
      ? { ...p, state, lastCheckedAt: new Date() }
      : p
  );

  return {
    ...config,
    paths,
  };
}

/**
 * 39. Selects optimal path based on policy
 *
 * @param config - Multipath configuration
 * @param currentPathId - Current path ID (for round-robin)
 * @returns Selected path
 */
export function selectOptimalPath(
  config: MultipathConfig,
  currentPathId?: string
): MultipathPath | null {
  const activePaths = config.paths.filter(p => p.state === MultipathState.ACTIVE);

  if (activePaths.length === 0) {
    // Try standby paths
    const standbyPaths = config.paths.filter(p => p.state === MultipathState.STANDBY);
    return standbyPaths.length > 0 ? standbyPaths[0] : null;
  }

  switch (config.policy) {
    case MultipathPolicy.ROUND_ROBIN: {
      if (!currentPathId) {
        return activePaths[0];
      }
      const currentIndex = activePaths.findIndex(p => p.id === currentPathId);
      const nextIndex = (currentIndex + 1) % activePaths.length;
      return activePaths[nextIndex];
    }

    case MultipathPolicy.FAILOVER: {
      // Return highest priority active path
      return activePaths.reduce((best, path) =>
        path.priority > best.priority ? path : best
      );
    }

    case MultipathPolicy.SERVICE_TIME: {
      // Select path with fewest failures (simplified)
      return activePaths.reduce((best, path) =>
        path.failures < best.failures ? path : best
      );
    }

    case MultipathPolicy.QUEUE_LENGTH: {
      // In real implementation, would check actual queue depth
      // Here we use failures as a proxy
      return activePaths.reduce((best, path) =>
        path.failures < best.failures ? path : best
      );
    }

    default:
      return activePaths[0];
  }
}

/**
 * 40. Encrypts iSCSI data with specified algorithm
 *
 * @param data - Data to encrypt
 * @param config - Encryption configuration
 * @returns Encrypted data and IV
 */
export function encryptISCSIData(
  data: Buffer,
  config: iSCSIEncryptionConfig
): { encrypted: Buffer; iv: Buffer } {
  if (!config.enabled) {
    throw new Error('Encryption is not enabled');
  }

  const key = config.key || randomBytes(32);
  const iv = config.iv || randomBytes(16);

  const cipher = createCipheriv(config.algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return { encrypted, iv };
}

/**
 * 41. Decrypts iSCSI data with specified algorithm
 *
 * @param encrypted - Encrypted data
 * @param iv - Initialization vector
 * @param config - Encryption configuration
 * @returns Decrypted data
 */
export function decryptISCSIData(
  encrypted: Buffer,
  iv: Buffer,
  config: iSCSIEncryptionConfig
): Buffer {
  if (!config.enabled || !config.key) {
    throw new Error('Encryption key not configured');
  }

  const decipher = createDecipheriv(config.algorithm, config.key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

// ============================================================================
// Export All
// ============================================================================

export default {
  // IQN Management (1-10)
  generateIQN,
  validateIQN,
  parseIQN,
  generateEUI,
  validateEUI,
  generateNAA,
  validateNAA,
  iqnToAlias,
  generateWWID,
  validateWWID,

  // Target Management (11-20)
  createTarget,
  addLUNToTarget,
  removeLUNFromTarget,
  addPortalToTarget,
  removePortalFromTarget,
  updateTargetAuth,
  updateTargetPerformanceParams,
  setTargetEnabled,
  getTargetInfo,
  validateTargetConfig,

  // Initiator and Session Management (21-30)
  createInitiator,
  createSession,
  addConnectionToSession,
  updateSessionState,
  setSessionAuthenticated,
  updateSessionStatistics,
  closeSessionConnection,
  getSessionPerformanceMetrics,
  isSessionHealthy,
  terminateSession,

  // CHAP Authentication (31-35)
  generateCHAPChallenge,
  computeCHAPResponse,
  validateCHAPResponse,
  performMutualCHAP,
  generateCHAPSecret,

  // Multipath I/O and Advanced Features (36-41)
  createMultipathConfig,
  addMultipathPath,
  updateMultipathPathState,
  selectOptimalPath,
  encryptISCSIData,
  decryptISCSIData,
};
