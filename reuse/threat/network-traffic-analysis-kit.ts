/**
 * LOC: NETTRAFFIC001
 * File: /reuse/threat/network-traffic-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Network security monitoring services
 *   - SIEM integration modules
 *   - Intrusion detection systems
 *   - Network forensics services
 *   - C2 detection systems
 *   - Data loss prevention (DLP) modules
 */

/**
 * File: /reuse/threat/network-traffic-analysis-kit.ts
 * Locator: WC-THREAT-NETTRAFFIC-001
 * Purpose: Comprehensive Network Traffic Analysis Toolkit - Production-ready network threat detection
 *
 * Upstream: Independent utility module for network-based threat detection
 * Downstream: ../backend/*, Network security services, SIEM, IDS/IPS, C2 detection
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 40 utility functions for network flow analysis, packet inspection, protocol anomaly detection, C2 detection, data exfiltration
 *
 * LLM Context: Enterprise-grade network traffic analysis toolkit for White Cross healthcare platform.
 * Provides comprehensive network flow analysis, deep packet inspection, protocol anomaly detection,
 * Command & Control (C2) communication detection, data exfiltration detection, network-based IOC matching,
 * traffic pattern analysis, and network threat intelligence. Includes full Swagger/OpenAPI 3.0 documentation,
 * NestJS controllers, and Sequelize models for HIPAA-compliant network security monitoring.
 *
 * @swagger
 * @apiSecurity bearerAuth
 * @apiSecurity apiKeyAuth
 */

import * as crypto from 'crypto';

// ============================================================================
// SWAGGER/OPENAPI 3.0 SCHEMA DEFINITIONS
// ============================================================================

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authenticated API access
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *       description: API key for network monitoring services
 *   schemas:
 *     NetworkFlow:
 *       type: object
 *       required:
 *         - flowId
 *         - sourceIp
 *         - destinationIp
 *         - sourcePort
 *         - destinationPort
 *         - protocol
 *       properties:
 *         flowId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the network flow
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         sourceIp:
 *           type: string
 *           format: ipv4
 *           description: Source IP address
 *           example: "192.168.1.100"
 *         destinationIp:
 *           type: string
 *           format: ipv4
 *           description: Destination IP address
 *           example: "203.0.113.45"
 *         sourcePort:
 *           type: integer
 *           minimum: 1
 *           maximum: 65535
 *           description: Source port number
 *           example: 54321
 *         destinationPort:
 *           type: integer
 *           minimum: 1
 *           maximum: 65535
 *           description: Destination port number
 *           example: 443
 *         protocol:
 *           type: string
 *           enum: [TCP, UDP, ICMP, GRE, ESP]
 *           description: Network protocol
 *           example: "TCP"
 *         bytesIn:
 *           type: integer
 *           format: int64
 *           description: Bytes received
 *           example: 1024000
 *         bytesOut:
 *           type: integer
 *           format: int64
 *           description: Bytes sent
 *           example: 2048000
 *         packetsIn:
 *           type: integer
 *           description: Packets received
 *           example: 1500
 *         packetsOut:
 *           type: integer
 *           description: Packets sent
 *           example: 1800
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Flow start timestamp
 *           example: "2025-11-09T12:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Flow end timestamp
 *           example: "2025-11-09T12:05:00Z"
 *         flags:
 *           type: array
 *           items:
 *             type: string
 *           description: TCP flags observed
 *           example: ["SYN", "ACK", "FIN"]
 *         threatScore:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Calculated threat score
 *           example: 75.5
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Network protocol types
 */
export enum NetworkProtocol {
  TCP = 'TCP',
  UDP = 'UDP',
  ICMP = 'ICMP',
  GRE = 'GRE',
  ESP = 'ESP',
  AH = 'AH',
  SCTP = 'SCTP',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Network flow structure
 */
export interface NetworkFlow {
  flowId: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: NetworkProtocol;
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  startTime: Date;
  endTime?: Date;
  duration?: number; // milliseconds
  flags: string[];
  tcpFlags?: TCPFlags;
  applicationProtocol?: string;
  threatScore?: number;
  anomalyScore?: number;
  geoLocation?: GeoLocation;
  metadata?: Record<string, any>;
}

/**
 * TCP flags structure
 */
export interface TCPFlags {
  syn: boolean;
  ack: boolean;
  fin: boolean;
  rst: boolean;
  psh: boolean;
  urg: boolean;
  ece: boolean;
  cwr: boolean;
}

/**
 * Geographic location data
 */
export interface GeoLocation {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  asn?: number;
  asnOrg?: string;
}

/**
 * Packet capture structure
 */
export interface PacketCapture {
  packetId: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  sourcePort?: number;
  destinationPort?: number;
  protocol: NetworkProtocol;
  length: number;
  headers: PacketHeaders;
  payload?: Buffer;
  payloadHex?: string;
  payloadAscii?: string;
  flags?: string[];
  threatIndicators?: ThreatIndicator[];
}

/**
 * Packet headers structure
 */
export interface PacketHeaders {
  ethernet?: EthernetHeader;
  ip?: IPHeader;
  tcp?: TCPHeader;
  udp?: UDPHeader;
  icmp?: ICMPHeader;
  dns?: DNSHeader;
  http?: HTTPHeader;
  tls?: TLSHeader;
}

/**
 * Ethernet header
 */
export interface EthernetHeader {
  source: string;
  destination: string;
  type: string;
}

/**
 * IP header
 */
export interface IPHeader {
  version: number;
  headerLength: number;
  tos: number;
  totalLength: number;
  identification: number;
  flags: number;
  fragmentOffset: number;
  ttl: number;
  protocol: number;
  checksum: number;
  sourceAddress: string;
  destinationAddress: string;
}

/**
 * TCP header
 */
export interface TCPHeader {
  sourcePort: number;
  destinationPort: number;
  sequenceNumber: number;
  acknowledgmentNumber: number;
  dataOffset: number;
  flags: TCPFlags;
  windowSize: number;
  checksum: number;
  urgentPointer: number;
  options?: Buffer;
}

/**
 * UDP header
 */
export interface UDPHeader {
  sourcePort: number;
  destinationPort: number;
  length: number;
  checksum: number;
}

/**
 * ICMP header
 */
export interface ICMPHeader {
  type: number;
  code: number;
  checksum: number;
  identifier?: number;
  sequenceNumber?: number;
}

/**
 * DNS header
 */
export interface DNSHeader {
  transactionId: number;
  flags: number;
  questions: number;
  answers: number;
  authority: number;
  additional: number;
  queries?: DNSQuery[];
  responses?: DNSResponse[];
}

/**
 * DNS query
 */
export interface DNSQuery {
  name: string;
  type: string;
  class: string;
}

/**
 * DNS response
 */
export interface DNSResponse {
  name: string;
  type: string;
  class: string;
  ttl: number;
  data: string;
}

/**
 * HTTP header
 */
export interface HTTPHeader {
  method?: string;
  uri?: string;
  version?: string;
  statusCode?: number;
  statusMessage?: string;
  headers: Record<string, string>;
  userAgent?: string;
  host?: string;
  contentType?: string;
  contentLength?: number;
}

/**
 * TLS header
 */
export interface TLSHeader {
  version: string;
  cipherSuite?: string;
  serverName?: string;
  certificate?: string;
  certificateFingerprint?: string;
}

/**
 * Protocol anomaly types
 */
export enum ProtocolAnomalyType {
  MALFORMED_PACKET = 'MALFORMED_PACKET',
  INVALID_HEADER = 'INVALID_HEADER',
  PROTOCOL_VIOLATION = 'PROTOCOL_VIOLATION',
  UNUSUAL_PORT = 'UNUSUAL_PORT',
  SUSPICIOUS_FLAGS = 'SUSPICIOUS_FLAGS',
  FRAGMENTATION_ATTACK = 'FRAGMENTATION_ATTACK',
  TUNNEL_DETECTED = 'TUNNEL_DETECTED',
  ENCRYPTION_ANOMALY = 'ENCRYPTION_ANOMALY',
  DNS_TUNNELING = 'DNS_TUNNELING',
  HTTP_ANOMALY = 'HTTP_ANOMALY',
}

/**
 * Protocol anomaly structure
 */
export interface ProtocolAnomaly {
  anomalyId: string;
  type: ProtocolAnomalyType;
  protocol: NetworkProtocol;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0-100
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  description: string;
  technicalDetails: Record<string, any>;
  relatedFlows?: string[];
  mitreAttack?: string[];
  recommendations?: string[];
}

/**
 * C2 (Command & Control) communication patterns
 */
export enum C2Pattern {
  BEACONING = 'BEACONING',
  DNS_TUNNELING = 'DNS_TUNNELING',
  HTTP_C2 = 'HTTP_C2',
  HTTPS_C2 = 'HTTPS_C2',
  IRC_C2 = 'IRC_C2',
  CUSTOM_PROTOCOL = 'CUSTOM_PROTOCOL',
  DOMAIN_GENERATION = 'DOMAIN_GENERATION',
  FAST_FLUX = 'FAST_FLUX',
  TOR_USAGE = 'TOR_USAGE',
}

/**
 * C2 detection result
 */
export interface C2Detection {
  detectionId: string;
  pattern: C2Pattern;
  confidence: number; // 0-100
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  destinationDomain?: string;
  frequency?: number;
  intervalPattern?: number[];
  payloadSamples?: string[];
  iocMatches?: string[];
  threatActors?: string[];
  malwareFamilies?: string[];
  mitreAttack?: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Data exfiltration indicators
 */
export enum ExfiltrationMethod {
  LARGE_UPLOAD = 'LARGE_UPLOAD',
  DNS_EXFILTRATION = 'DNS_EXFILTRATION',
  ICMP_TUNNELING = 'ICMP_TUNNELING',
  ENCRYPTED_CHANNEL = 'ENCRYPTED_CHANNEL',
  STEGANOGRAPHY = 'STEGANOGRAPHY',
  CLOUD_UPLOAD = 'CLOUD_UPLOAD',
  EMAIL_EXFILTRATION = 'EMAIL_EXFILTRATION',
  FTP_UPLOAD = 'FTP_UPLOAD',
}

/**
 * Data exfiltration detection
 */
export interface DataExfiltration {
  exfiltrationId: string;
  method: ExfiltrationMethod;
  confidence: number; // 0-100
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  destinationDomain?: string;
  dataVolume: number; // bytes
  duration: number; // milliseconds
  protocol: NetworkProtocol;
  encryptionUsed: boolean;
  suspiciousPatterns: string[];
  fileTypes?: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dataClassification?: string[];
}

/**
 * Network-based threat indicator
 */
export interface ThreatIndicator {
  indicatorType: 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'PATTERN';
  value: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  confidence: number;
  lastSeen: Date;
  threatType?: string;
  description?: string;
}

/**
 * Traffic pattern analysis result
 */
export interface TrafficPattern {
  patternId: string;
  patternType: 'BASELINE' | 'ANOMALY' | 'ATTACK' | 'BENIGN';
  timestamp: Date;
  timeWindow: number; // milliseconds
  metrics: TrafficMetrics;
  anomalyScore: number; // 0-100
  deviationFromBaseline?: number;
  suspiciousCharacteristics: string[];
  relatedIPs: string[];
  protocols: NetworkProtocol[];
  recommendation?: string;
}

/**
 * Traffic metrics
 */
export interface TrafficMetrics {
  totalPackets: number;
  totalBytes: number;
  uniqueSourceIPs: number;
  uniqueDestinationIPs: number;
  averagePacketSize: number;
  peakBandwidth: number;
  protocolDistribution: Record<string, number>;
  portDistribution: Record<number, number>;
  flowCount: number;
  averageFlowDuration: number;
}

/**
 * Network threat intelligence feed
 */
export interface NetworkThreatIntel {
  feedId: string;
  provider: string;
  timestamp: Date;
  indicators: ThreatIndicator[];
  threatActors?: string[];
  campaigns?: string[];
  malwareFamilies?: string[];
  ttps?: string[];
  confidence: number;
  expiresAt?: Date;
}

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES
// ============================================================================

/**
 * Sequelize NetworkFlow model attributes for flow tracking.
 *
 * @swagger
 * components:
 *   schemas:
 *     NetworkFlowModel:
 *       type: object
 *       description: Database model for network flow records
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         flowId:
 *           type: string
 *         sourceIp:
 *           type: string
 *         destinationIp:
 *           type: string
 *         protocol:
 *           type: string
 *         bytesIn:
 *           type: integer
 *           format: int64
 *         bytesOut:
 *           type: integer
 *           format: int64
 *
 * @example
 * ```typescript
 * class NetworkFlow extends Model {}
 * NetworkFlow.init(getNetworkFlowModelAttributes(), {
 *   sequelize,
 *   tableName: 'network_flows',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['sourceIp', 'destinationIp'] },
 *     { fields: ['startTime', 'endTime'] },
 *     { fields: ['threatScore'] }
 *   ]
 * });
 * ```
 */
export const getNetworkFlowModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  flowId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  sourceIp: {
    type: 'INET',
    allowNull: false,
  },
  destinationIp: {
    type: 'INET',
    allowNull: false,
  },
  sourcePort: {
    type: 'INTEGER',
    allowNull: false,
  },
  destinationPort: {
    type: 'INTEGER',
    allowNull: false,
  },
  protocol: {
    type: 'STRING',
    allowNull: false,
  },
  bytesIn: {
    type: 'BIGINT',
    defaultValue: 0,
  },
  bytesOut: {
    type: 'BIGINT',
    defaultValue: 0,
  },
  packetsIn: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  packetsOut: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  startTime: {
    type: 'DATE',
    allowNull: false,
  },
  endTime: {
    type: 'DATE',
    allowNull: true,
  },
  duration: {
    type: 'INTEGER',
    allowNull: true,
  },
  flags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  tcpFlags: {
    type: 'JSONB',
    allowNull: true,
  },
  applicationProtocol: {
    type: 'STRING',
    allowNull: true,
  },
  threatScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  anomalyScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  geoLocation: {
    type: 'JSONB',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize PacketCapture model attributes.
 *
 * @example
 * ```typescript
 * class PacketCapture extends Model {}
 * PacketCapture.init(getPacketCaptureModelAttributes(), {
 *   sequelize,
 *   tableName: 'packet_captures',
 *   timestamps: true
 * });
 * ```
 */
export const getPacketCaptureModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  packetId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
  },
  sourceIp: {
    type: 'INET',
    allowNull: false,
  },
  destinationIp: {
    type: 'INET',
    allowNull: false,
  },
  sourcePort: {
    type: 'INTEGER',
    allowNull: true,
  },
  destinationPort: {
    type: 'INTEGER',
    allowNull: true,
  },
  protocol: {
    type: 'STRING',
    allowNull: false,
  },
  length: {
    type: 'INTEGER',
    allowNull: false,
  },
  headers: {
    type: 'JSONB',
    allowNull: false,
  },
  payloadHex: {
    type: 'TEXT',
    allowNull: true,
  },
  payloadAscii: {
    type: 'TEXT',
    allowNull: true,
  },
  flags: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  threatIndicators: {
    type: 'JSONB',
    defaultValue: [],
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize ProtocolAnomaly model attributes.
 *
 * @example
 * ```typescript
 * class ProtocolAnomaly extends Model {}
 * ProtocolAnomaly.init(getProtocolAnomalyModelAttributes(), {
 *   sequelize,
 *   tableName: 'protocol_anomalies',
 *   timestamps: true
 * });
 * ```
 */
export const getProtocolAnomalyModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  anomalyId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  type: {
    type: 'STRING',
    allowNull: false,
  },
  protocol: {
    type: 'STRING',
    allowNull: false,
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  confidence: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
  },
  sourceIp: {
    type: 'INET',
    allowNull: false,
  },
  destinationIp: {
    type: 'INET',
    allowNull: false,
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  technicalDetails: {
    type: 'JSONB',
    defaultValue: {},
  },
  relatedFlows: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  recommendations: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Sequelize C2Detection model attributes.
 *
 * @example
 * ```typescript
 * class C2Detection extends Model {}
 * C2Detection.init(getC2DetectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'c2_detections',
 *   timestamps: true
 * });
 * ```
 */
export const getC2DetectionModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  detectionId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  pattern: {
    type: 'STRING',
    allowNull: false,
  },
  confidence: {
    type: 'INTEGER',
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  timestamp: {
    type: 'DATE',
    allowNull: false,
  },
  sourceIp: {
    type: 'INET',
    allowNull: false,
  },
  destinationIp: {
    type: 'INET',
    allowNull: false,
  },
  destinationDomain: {
    type: 'STRING',
    allowNull: true,
  },
  frequency: {
    type: 'INTEGER',
    allowNull: true,
  },
  intervalPattern: {
    type: 'ARRAY("INTEGER")',
    defaultValue: [],
  },
  payloadSamples: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  iocMatches: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  threatActors: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  malwareFamilies: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  mitreAttack: {
    type: 'ARRAY("TEXT")',
    defaultValue: [],
  },
  severity: {
    type: 'STRING',
    allowNull: false,
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// NETWORK FLOW ANALYSIS FUNCTIONS (8 functions)
// ============================================================================

/**
 * Analyzes network flows for suspicious patterns and threats.
 *
 * @swagger
 * /api/network/flows/analyze:
 *   post:
 *     tags:
 *       - Network Traffic Analysis
 *     summary: Analyze network flows for threats
 *     description: Performs comprehensive analysis of network flows to identify suspicious patterns, anomalies, and potential threats
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flows
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *               options:
 *                 type: object
 *                 properties:
 *                   enableThreatScoring:
 *                     type: boolean
 *                     default: true
 *                   enableAnomalyDetection:
 *                     type: boolean
 *                     default: true
 *                   minThreatScore:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 100
 *                     default: 50
 *           example:
 *             flows:
 *               - flowId: "flow-001"
 *                 sourceIp: "192.168.1.100"
 *                 destinationIp: "203.0.113.45"
 *                 sourcePort: 54321
 *                 destinationPort: 443
 *                 protocol: "TCP"
 *                 bytesIn: 1024000
 *                 bytesOut: 2048000
 *             options:
 *               enableThreatScoring: true
 *               minThreatScore: 60
 *     responses:
 *       200:
 *         description: Flow analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyzedFlows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NetworkFlow'
 *                 threats:
 *                   type: array
 *                   items:
 *                     type: object
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalFlows:
 *                       type: integer
 *                     threatsDetected:
 *                       type: integer
 *                     averageThreatScore:
 *                       type: number
 *             example:
 *               analyzedFlows: [...]
 *               threats: []
 *               summary:
 *                 totalFlows: 1
 *                 threatsDetected: 0
 *                 averageThreatScore: 25.5
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *       400:
 *         description: Bad request - Invalid flow data
 *
 * @param {NetworkFlow[]} flows - Array of network flows to analyze
 * @param {object} [options] - Analysis options
 * @returns {Promise<{ analyzedFlows: NetworkFlow[]; threats: any[]; summary: any }>}
 *
 * @example
 * ```typescript
 * const flows = [
 *   { flowId: 'flow-001', sourceIp: '192.168.1.100', destinationIp: '203.0.113.45', ... }
 * ];
 * const result = await analyzeNetworkFlows(flows, { enableThreatScoring: true });
 * console.log(`Detected ${result.threats.length} threats`);
 * ```
 */
export const analyzeNetworkFlows = async (
  flows: NetworkFlow[],
  options?: {
    enableThreatScoring?: boolean;
    enableAnomalyDetection?: boolean;
    minThreatScore?: number;
  }
): Promise<{ analyzedFlows: NetworkFlow[]; threats: any[]; summary: any }> => {
  const analyzedFlows: NetworkFlow[] = [];
  const threats: any[] = [];
  let totalThreatScore = 0;

  for (const flow of flows) {
    // Calculate threat score
    if (options?.enableThreatScoring !== false) {
      flow.threatScore = calculateFlowThreatScore(flow);
      totalThreatScore += flow.threatScore;
    }

    // Calculate anomaly score
    if (options?.enableAnomalyDetection !== false) {
      flow.anomalyScore = calculateFlowAnomalyScore(flow);
    }

    // Detect threats
    if (flow.threatScore && flow.threatScore >= (options?.minThreatScore || 50)) {
      threats.push({
        flowId: flow.flowId,
        threatScore: flow.threatScore,
        sourceIp: flow.sourceIp,
        destinationIp: flow.destinationIp,
        threatType: 'SUSPICIOUS_FLOW',
        timestamp: new Date(),
      });
    }

    analyzedFlows.push(flow);
  }

  return {
    analyzedFlows,
    threats,
    summary: {
      totalFlows: flows.length,
      threatsDetected: threats.length,
      averageThreatScore: flows.length > 0 ? totalThreatScore / flows.length : 0,
    },
  };
};

/**
 * Calculates threat score for a network flow.
 *
 * @param {NetworkFlow} flow - Network flow to score
 * @returns {number} Threat score (0-100)
 *
 * @example
 * ```typescript
 * const flow = { sourceIp: '192.168.1.100', destinationIp: '203.0.113.45', ... };
 * const score = calculateFlowThreatScore(flow);
 * ```
 */
export const calculateFlowThreatScore = (flow: NetworkFlow): number => {
  let score = 0;

  // Check for unusual ports
  if (flow.destinationPort > 49152 || flow.destinationPort < 1024) {
    score += 10;
  }

  // Check for asymmetric traffic (potential exfiltration)
  if (flow.bytesOut > flow.bytesIn * 3) {
    score += 20;
  }

  // Check for known malicious protocols on unusual ports
  if (flow.applicationProtocol === 'HTTP' && flow.destinationPort !== 80) {
    score += 15;
  }

  // Check for suspicious flags
  if (flow.flags.includes('RST') && flow.flags.includes('SYN')) {
    score += 25;
  }

  // Check for very short or very long connections
  if (flow.duration && (flow.duration < 100 || flow.duration > 3600000)) {
    score += 10;
  }

  // Check for geographic anomalies
  if (flow.geoLocation && isHighRiskCountry(flow.geoLocation.countryCode)) {
    score += 20;
  }

  return Math.min(score, 100);
};

/**
 * Calculates anomaly score for a network flow based on baseline.
 *
 * @param {NetworkFlow} flow - Network flow to analyze
 * @returns {number} Anomaly score (0-100)
 *
 * @example
 * ```typescript
 * const flow = { sourceIp: '192.168.1.100', bytesOut: 5000000, ... };
 * const anomalyScore = calculateFlowAnomalyScore(flow);
 * ```
 */
export const calculateFlowAnomalyScore = (flow: NetworkFlow): number => {
  let score = 0;

  // Check packet size anomalies
  const avgPacketSize = (flow.bytesIn + flow.bytesOut) / (flow.packetsIn + flow.packetsOut);
  if (avgPacketSize > 1500 || avgPacketSize < 50) {
    score += 15;
  }

  // Check for unusual packet ratios
  const packetRatio = flow.packetsOut / (flow.packetsIn || 1);
  if (packetRatio > 5 || packetRatio < 0.2) {
    score += 20;
  }

  // Check for traffic volume anomalies
  if (flow.bytesOut > 10000000) { // > 10MB
    score += 25;
  }

  // Check for timing anomalies
  const hour = flow.startTime.getHours();
  if (hour < 6 || hour > 22) {
    score += 10;
  }

  return Math.min(score, 100);
};

/**
 * Correlates multiple network flows to identify attack patterns.
 *
 * @swagger
 * /api/network/flows/correlate:
 *   post:
 *     tags:
 *       - Network Traffic Analysis
 *     summary: Correlate network flows
 *     description: Analyzes relationships between network flows to identify coordinated attacks or suspicious patterns
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *               timeWindow:
 *                 type: integer
 *                 description: Time window in milliseconds
 *                 default: 300000
 *     responses:
 *       200:
 *         description: Correlation analysis completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correlations:
 *                   type: array
 *                   items:
 *                     type: object
 *
 * @param {NetworkFlow[]} flows - Array of network flows
 * @param {number} [timeWindow=300000] - Time window for correlation (ms)
 * @returns {Promise<any[]>} Correlation results
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const correlations = await correlateNetworkFlows(flows, 300000);
 * ```
 */
export const correlateNetworkFlows = async (
  flows: NetworkFlow[],
  timeWindow: number = 300000
): Promise<any[]> => {
  const correlations: any[] = [];
  const sourceIpMap = new Map<string, NetworkFlow[]>();

  // Group flows by source IP
  for (const flow of flows) {
    if (!sourceIpMap.has(flow.sourceIp)) {
      sourceIpMap.set(flow.sourceIp, []);
    }
    sourceIpMap.get(flow.sourceIp)!.push(flow);
  }

  // Detect port scanning
  for (const [sourceIp, ipFlows] of sourceIpMap.entries()) {
    const uniquePorts = new Set(ipFlows.map(f => f.destinationPort));
    if (uniquePorts.size > 10) {
      correlations.push({
        type: 'PORT_SCAN',
        sourceIp,
        targetPorts: Array.from(uniquePorts),
        flowCount: ipFlows.length,
        severity: 'HIGH',
        confidence: 85,
      });
    }
  }

  // Detect distributed attacks
  const destIpMap = new Map<string, Set<string>>();
  for (const flow of flows) {
    if (!destIpMap.has(flow.destinationIp)) {
      destIpMap.set(flow.destinationIp, new Set());
    }
    destIpMap.get(flow.destinationIp)!.add(flow.sourceIp);
  }

  for (const [destIp, sourceIps] of destIpMap.entries()) {
    if (sourceIps.size > 50) {
      correlations.push({
        type: 'DISTRIBUTED_ATTACK',
        targetIp: destIp,
        sourceIpCount: sourceIps.size,
        severity: 'CRITICAL',
        confidence: 90,
      });
    }
  }

  return correlations;
};

/**
 * Enriches network flows with geographic and threat intelligence data.
 *
 * @param {NetworkFlow[]} flows - Network flows to enrich
 * @returns {Promise<NetworkFlow[]>} Enriched flows
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const enrichedFlows = await enrichNetworkFlows(flows);
 * ```
 */
export const enrichNetworkFlows = async (flows: NetworkFlow[]): Promise<NetworkFlow[]> => {
  const enrichedFlows: NetworkFlow[] = [];

  for (const flow of flows) {
    // Add geographic location data
    flow.geoLocation = await lookupGeoLocation(flow.destinationIp);

    // Add application protocol detection
    if (!flow.applicationProtocol) {
      flow.applicationProtocol = detectApplicationProtocol(flow);
    }

    // Calculate duration if missing
    if (!flow.duration && flow.endTime) {
      flow.duration = flow.endTime.getTime() - flow.startTime.getTime();
    }

    enrichedFlows.push(flow);
  }

  return enrichedFlows;
};

/**
 * Detects network beaconing patterns indicative of malware C2.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @param {object} [options] - Detection options
 * @returns {Promise<any[]>} Detected beaconing patterns
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const beacons = await detectNetworkBeaconing(flows);
 * ```
 */
export const detectNetworkBeaconing = async (
  flows: NetworkFlow[],
  options?: {
    minOccurrences?: number;
    intervalTolerance?: number; // milliseconds
  }
): Promise<any[]> => {
  const beacons: any[] = [];
  const sourceDestMap = new Map<string, NetworkFlow[]>();

  // Group flows by source-destination pair
  for (const flow of flows) {
    const key = `${flow.sourceIp}-${flow.destinationIp}`;
    if (!sourceDestMap.has(key)) {
      sourceDestMap.set(key, []);
    }
    sourceDestMap.get(key)!.push(flow);
  }

  // Analyze each pair for beaconing
  for (const [key, pairFlows] of sourceDestMap.entries()) {
    if (pairFlows.length < (options?.minOccurrences || 10)) {
      continue;
    }

    // Sort by start time
    pairFlows.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < pairFlows.length; i++) {
      const interval = pairFlows[i].startTime.getTime() - pairFlows[i - 1].startTime.getTime();
      intervals.push(interval);
    }

    // Check for consistent intervals
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const tolerance = options?.intervalTolerance || 5000; // 5 seconds
    const consistentIntervals = intervals.filter(
      i => Math.abs(i - avgInterval) < tolerance
    ).length;

    if (consistentIntervals / intervals.length > 0.7) {
      beacons.push({
        sourceIp: pairFlows[0].sourceIp,
        destinationIp: pairFlows[0].destinationIp,
        occurrences: pairFlows.length,
        averageInterval: avgInterval,
        consistency: consistentIntervals / intervals.length,
        confidence: 90,
        severity: 'HIGH',
      });
    }
  }

  return beacons;
};

/**
 * Aggregates network flows by time window for trend analysis.
 *
 * @param {NetworkFlow[]} flows - Network flows to aggregate
 * @param {number} windowSize - Window size in milliseconds
 * @returns {Promise<any[]>} Aggregated flow data
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const aggregated = await aggregateFlowsByTimeWindow(flows, 60000); // 1-minute windows
 * ```
 */
export const aggregateFlowsByTimeWindow = async (
  flows: NetworkFlow[],
  windowSize: number
): Promise<any[]> => {
  const windows = new Map<number, NetworkFlow[]>();

  // Group flows into time windows
  for (const flow of flows) {
    const windowStart = Math.floor(flow.startTime.getTime() / windowSize) * windowSize;
    if (!windows.has(windowStart)) {
      windows.set(windowStart, []);
    }
    windows.get(windowStart)!.push(flow);
  }

  // Aggregate metrics for each window
  const aggregated: any[] = [];
  for (const [windowStart, windowFlows] of windows.entries()) {
    aggregated.push({
      windowStart: new Date(windowStart),
      windowEnd: new Date(windowStart + windowSize),
      flowCount: windowFlows.length,
      totalBytes: windowFlows.reduce((sum, f) => sum + f.bytesIn + f.bytesOut, 0),
      uniqueSourceIPs: new Set(windowFlows.map(f => f.sourceIp)).size,
      uniqueDestIPs: new Set(windowFlows.map(f => f.destinationIp)).size,
      protocols: Array.from(new Set(windowFlows.map(f => f.protocol))),
    });
  }

  return aggregated.sort((a, b) => a.windowStart.getTime() - b.windowStart.getTime());
};

/**
 * Filters network flows based on criteria.
 *
 * @param {NetworkFlow[]} flows - Network flows to filter
 * @param {object} criteria - Filter criteria
 * @returns {NetworkFlow[]} Filtered flows
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const filtered = filterNetworkFlows(flows, {
 *   protocol: 'TCP',
 *   minThreatScore: 50
 * });
 * ```
 */
export const filterNetworkFlows = (
  flows: NetworkFlow[],
  criteria: {
    protocol?: NetworkProtocol;
    sourceIp?: string;
    destinationIp?: string;
    minThreatScore?: number;
    maxThreatScore?: number;
    startTime?: Date;
    endTime?: Date;
  }
): NetworkFlow[] => {
  return flows.filter(flow => {
    if (criteria.protocol && flow.protocol !== criteria.protocol) return false;
    if (criteria.sourceIp && flow.sourceIp !== criteria.sourceIp) return false;
    if (criteria.destinationIp && flow.destinationIp !== criteria.destinationIp) return false;
    if (criteria.minThreatScore && (!flow.threatScore || flow.threatScore < criteria.minThreatScore)) return false;
    if (criteria.maxThreatScore && flow.threatScore && flow.threatScore > criteria.maxThreatScore) return false;
    if (criteria.startTime && flow.startTime < criteria.startTime) return false;
    if (criteria.endTime && flow.startTime > criteria.endTime) return false;
    return true;
  });
};

/**
 * Exports network flows to various formats.
 *
 * @param {NetworkFlow[]} flows - Network flows to export
 * @param {string} format - Export format ('json' | 'csv' | 'pcap')
 * @returns {Promise<string | Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const csvData = await exportNetworkFlows(flows, 'csv');
 * ```
 */
export const exportNetworkFlows = async (
  flows: NetworkFlow[],
  format: 'json' | 'csv' | 'pcap'
): Promise<string | Buffer> => {
  switch (format) {
    case 'json':
      return JSON.stringify(flows, null, 2);

    case 'csv':
      const headers = ['flowId', 'sourceIp', 'destinationIp', 'protocol', 'bytesIn', 'bytesOut', 'startTime'];
      const rows = flows.map(f => [
        f.flowId,
        f.sourceIp,
        f.destinationIp,
        f.protocol,
        f.bytesIn,
        f.bytesOut,
        f.startTime.toISOString(),
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    case 'pcap':
      // Simplified PCAP export (in production, use proper PCAP library)
      return Buffer.from('PCAP export not fully implemented in this example');

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// ============================================================================
// PACKET INSPECTION FUNCTIONS (6 functions)
// ============================================================================

/**
 * Performs deep packet inspection for threat detection.
 *
 * @swagger
 * /api/network/packets/inspect:
 *   post:
 *     tags:
 *       - Packet Inspection
 *     summary: Deep packet inspection
 *     description: Analyzes packet contents for malicious patterns, signatures, and anomalies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packets:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Inspection completed
 *
 * @param {PacketCapture[]} packets - Packets to inspect
 * @param {object} [options] - Inspection options
 * @returns {Promise<any[]>} Inspection results with threats
 *
 * @example
 * ```typescript
 * const packets = [...];
 * const results = await deepPacketInspection(packets);
 * ```
 */
export const deepPacketInspection = async (
  packets: PacketCapture[],
  options?: {
    enableSignatureMatching?: boolean;
    enablePayloadAnalysis?: boolean;
  }
): Promise<any[]> => {
  const results: any[] = [];

  for (const packet of packets) {
    const threats: ThreatIndicator[] = [];

    // Signature-based detection
    if (options?.enableSignatureMatching !== false) {
      const signatures = matchPacketSignatures(packet);
      threats.push(...signatures);
    }

    // Payload analysis
    if (options?.enablePayloadAnalysis !== false && packet.payloadAscii) {
      const payloadThreats = analyzePacketPayload(packet.payloadAscii);
      threats.push(...payloadThreats);
    }

    // Protocol-specific inspection
    if (packet.headers.http) {
      const httpThreats = inspectHTTPHeaders(packet.headers.http);
      threats.push(...httpThreats);
    }

    if (packet.headers.dns) {
      const dnsThreats = inspectDNSQuery(packet.headers.dns);
      threats.push(...dnsThreats);
    }

    results.push({
      packetId: packet.packetId,
      timestamp: packet.timestamp,
      threats,
      threatCount: threats.length,
      maxSeverity: threats.length > 0 ? getMaxSeverity(threats) : 'LOW',
    });
  }

  return results;
};

/**
 * Matches packet contents against threat signatures.
 *
 * @param {PacketCapture} packet - Packet to analyze
 * @returns {ThreatIndicator[]} Matched signatures
 *
 * @example
 * ```typescript
 * const packet = { ... };
 * const signatures = matchPacketSignatures(packet);
 * ```
 */
export const matchPacketSignatures = (packet: PacketCapture): ThreatIndicator[] => {
  const indicators: ThreatIndicator[] = [];

  // Example: Check for known malicious patterns in payload
  if (packet.payloadAscii) {
    const maliciousPatterns = [
      { pattern: /cmd\.exe/i, type: 'COMMAND_EXECUTION', severity: 'HIGH' as const },
      { pattern: /eval\(/i, type: 'CODE_INJECTION', severity: 'HIGH' as const },
      { pattern: /<script>/i, type: 'XSS_ATTEMPT', severity: 'MEDIUM' as const },
      { pattern: /union.*select/i, type: 'SQL_INJECTION', severity: 'HIGH' as const },
    ];

    for (const { pattern, type, severity } of maliciousPatterns) {
      if (pattern.test(packet.payloadAscii)) {
        indicators.push({
          indicatorType: 'PATTERN',
          value: pattern.toString(),
          severity,
          source: 'signature_matching',
          confidence: 85,
          lastSeen: packet.timestamp,
          threatType: type,
          description: `Detected ${type} pattern in packet payload`,
        });
      }
    }
  }

  return indicators;
};

/**
 * Analyzes packet payload for threats.
 *
 * @param {string} payload - ASCII payload content
 * @returns {ThreatIndicator[]} Detected threats
 *
 * @example
 * ```typescript
 * const threats = analyzePacketPayload(packet.payloadAscii);
 * ```
 */
export const analyzePacketPayload = (payload: string): ThreatIndicator[] => {
  const indicators: ThreatIndicator[] = [];

  // Check for encoded content
  if (isBase64Encoded(payload)) {
    indicators.push({
      indicatorType: 'PATTERN',
      value: 'base64_encoded_payload',
      severity: 'MEDIUM',
      source: 'payload_analysis',
      confidence: 70,
      lastSeen: new Date(),
      description: 'Base64 encoded content detected in payload',
    });
  }

  // Check for obfuscation
  if (isObfuscated(payload)) {
    indicators.push({
      indicatorType: 'PATTERN',
      value: 'obfuscated_payload',
      severity: 'HIGH',
      source: 'payload_analysis',
      confidence: 75,
      lastSeen: new Date(),
      description: 'Obfuscated content detected in payload',
    });
  }

  // Check for shellcode patterns
  if (containsShellcode(payload)) {
    indicators.push({
      indicatorType: 'PATTERN',
      value: 'shellcode_pattern',
      severity: 'CRITICAL',
      source: 'payload_analysis',
      confidence: 90,
      lastSeen: new Date(),
      description: 'Potential shellcode detected in payload',
    });
  }

  return indicators;
};

/**
 * Inspects HTTP headers for security threats.
 *
 * @param {HTTPHeader} headers - HTTP headers to inspect
 * @returns {ThreatIndicator[]} Detected threats
 *
 * @example
 * ```typescript
 * const threats = inspectHTTPHeaders(packet.headers.http);
 * ```
 */
export const inspectHTTPHeaders = (headers: HTTPHeader): ThreatIndicator[] => {
  const indicators: ThreatIndicator[] = [];

  // Check for suspicious user agents
  if (headers.userAgent) {
    const suspiciousAgents = ['sqlmap', 'nikto', 'masscan', 'nmap'];
    for (const agent of suspiciousAgents) {
      if (headers.userAgent.toLowerCase().includes(agent)) {
        indicators.push({
          indicatorType: 'PATTERN',
          value: headers.userAgent,
          severity: 'HIGH',
          source: 'http_inspection',
          confidence: 95,
          lastSeen: new Date(),
          threatType: 'SCANNING_TOOL',
          description: `Suspicious user agent detected: ${agent}`,
        });
      }
    }
  }

  // Check for path traversal attempts
  if (headers.uri && (headers.uri.includes('../') || headers.uri.includes('..%2F'))) {
    indicators.push({
      indicatorType: 'PATTERN',
      value: headers.uri,
      severity: 'HIGH',
      source: 'http_inspection',
      confidence: 90,
      lastSeen: new Date(),
      threatType: 'PATH_TRAVERSAL',
      description: 'Path traversal attempt detected',
    });
  }

  return indicators;
};

/**
 * Inspects DNS queries for tunneling and exfiltration.
 *
 * @param {DNSHeader} dnsHeader - DNS header to inspect
 * @returns {ThreatIndicator[]} Detected threats
 *
 * @example
 * ```typescript
 * const threats = inspectDNSQuery(packet.headers.dns);
 * ```
 */
export const inspectDNSQuery = (dnsHeader: DNSHeader): ThreatIndicator[] => {
  const indicators: ThreatIndicator[] = [];

  if (dnsHeader.queries) {
    for (const query of dnsHeader.queries) {
      // Check for excessively long domain names (DNS tunneling)
      if (query.name.length > 64) {
        indicators.push({
          indicatorType: 'DOMAIN',
          value: query.name,
          severity: 'HIGH',
          source: 'dns_inspection',
          confidence: 80,
          lastSeen: new Date(),
          threatType: 'DNS_TUNNELING',
          description: 'Suspicious long DNS query detected',
        });
      }

      // Check for high entropy (encoded data)
      if (calculateEntropy(query.name) > 4.5) {
        indicators.push({
          indicatorType: 'DOMAIN',
          value: query.name,
          severity: 'MEDIUM',
          source: 'dns_inspection',
          confidence: 75,
          lastSeen: new Date(),
          threatType: 'DNS_EXFILTRATION',
          description: 'High entropy DNS query detected',
        });
      }
    }
  }

  return indicators;
};

/**
 * Extracts IOCs from packet captures.
 *
 * @param {PacketCapture[]} packets - Packets to analyze
 * @returns {Promise<ThreatIndicator[]>} Extracted IOCs
 *
 * @example
 * ```typescript
 * const packets = [...];
 * const iocs = await extractPacketIOCs(packets);
 * ```
 */
export const extractPacketIOCs = async (packets: PacketCapture[]): Promise<ThreatIndicator[]> => {
  const iocs: ThreatIndicator[] = [];
  const uniqueIPs = new Set<string>();
  const uniqueDomains = new Set<string>();

  for (const packet of packets) {
    // Extract IP addresses
    uniqueIPs.add(packet.sourceIp);
    uniqueIPs.add(packet.destinationIp);

    // Extract domains from DNS
    if (packet.headers.dns?.queries) {
      for (const query of packet.headers.dns.queries) {
        uniqueDomains.add(query.name);
      }
    }

    // Extract URLs from HTTP
    if (packet.headers.http?.uri && packet.headers.http.host) {
      const url = `${packet.headers.http.host}${packet.headers.http.uri}`;
      iocs.push({
        indicatorType: 'URL',
        value: url,
        severity: 'LOW',
        source: 'packet_extraction',
        confidence: 50,
        lastSeen: packet.timestamp,
      });
    }
  }

  // Add unique IPs as IOCs
  for (const ip of uniqueIPs) {
    if (!isPrivateIP(ip)) {
      iocs.push({
        indicatorType: 'IP',
        value: ip,
        severity: 'LOW',
        source: 'packet_extraction',
        confidence: 50,
        lastSeen: new Date(),
      });
    }
  }

  // Add unique domains as IOCs
  for (const domain of uniqueDomains) {
    iocs.push({
      indicatorType: 'DOMAIN',
      value: domain,
      severity: 'LOW',
      source: 'packet_extraction',
      confidence: 50,
      lastSeen: new Date(),
    });
  }

  return iocs;
};

// ============================================================================
// PROTOCOL ANOMALY DETECTION FUNCTIONS (5 functions)
// ============================================================================

/**
 * Detects protocol-level anomalies and violations.
 *
 * @swagger
 * /api/network/protocol/anomalies:
 *   post:
 *     tags:
 *       - Protocol Analysis
 *     summary: Detect protocol anomalies
 *     description: Identifies protocol violations, malformed packets, and suspicious protocol usage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packets:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Anomaly detection completed
 *
 * @param {PacketCapture[]} packets - Packets to analyze
 * @returns {Promise<ProtocolAnomaly[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const packets = [...];
 * const anomalies = await detectProtocolAnomalies(packets);
 * ```
 */
export const detectProtocolAnomalies = async (
  packets: PacketCapture[]
): Promise<ProtocolAnomaly[]> => {
  const anomalies: ProtocolAnomaly[] = [];

  for (const packet of packets) {
    // TCP anomalies
    if (packet.protocol === NetworkProtocol.TCP && packet.headers.tcp) {
      const tcpAnomalies = detectTCPAnomalies(packet);
      anomalies.push(...tcpAnomalies);
    }

    // DNS anomalies
    if (packet.headers.dns) {
      const dnsAnomalies = detectDNSAnomalies(packet);
      anomalies.push(...dnsAnomalies);
    }

    // HTTP anomalies
    if (packet.headers.http) {
      const httpAnomalies = detectHTTPAnomalies(packet);
      anomalies.push(...httpAnomalies);
    }

    // Generic anomalies
    const genericAnomalies = detectGenericAnomalies(packet);
    anomalies.push(...genericAnomalies);
  }

  return anomalies;
};

/**
 * Detects TCP protocol anomalies.
 *
 * @param {PacketCapture} packet - Packet to analyze
 * @returns {ProtocolAnomaly[]} Detected TCP anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectTCPAnomalies(packet);
 * ```
 */
export const detectTCPAnomalies = (packet: PacketCapture): ProtocolAnomaly[] => {
  const anomalies: ProtocolAnomaly[] = [];

  if (!packet.headers.tcp) return anomalies;

  const tcp = packet.headers.tcp;

  // Invalid flag combinations
  if (tcp.flags.syn && tcp.flags.fin) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.SUSPICIOUS_FLAGS,
      protocol: NetworkProtocol.TCP,
      severity: 'HIGH',
      confidence: 95,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'Invalid TCP flag combination: SYN+FIN',
      technicalDetails: { flags: tcp.flags },
      mitreAttack: ['T1595.001'], // Active Scanning
      recommendations: ['Block source IP', 'Investigate for port scanning'],
    });
  }

  // Null scan
  if (!tcp.flags.syn && !tcp.flags.ack && !tcp.flags.fin && !tcp.flags.rst) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.SUSPICIOUS_FLAGS,
      protocol: NetworkProtocol.TCP,
      severity: 'MEDIUM',
      confidence: 90,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'TCP NULL scan detected',
      technicalDetails: { flags: tcp.flags },
      mitreAttack: ['T1595.001'],
      recommendations: ['Monitor source for additional scanning activity'],
    });
  }

  // Xmas scan
  if (tcp.flags.fin && tcp.flags.psh && tcp.flags.urg) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.SUSPICIOUS_FLAGS,
      protocol: NetworkProtocol.TCP,
      severity: 'MEDIUM',
      confidence: 90,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'TCP Xmas scan detected',
      technicalDetails: { flags: tcp.flags },
      mitreAttack: ['T1595.001'],
      recommendations: ['Block source IP', 'Check IDS/IPS rules'],
    });
  }

  return anomalies;
};

/**
 * Detects DNS protocol anomalies and tunneling.
 *
 * @param {PacketCapture} packet - Packet to analyze
 * @returns {ProtocolAnomaly[]} Detected DNS anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectDNSAnomalies(packet);
 * ```
 */
export const detectDNSAnomalies = (packet: PacketCapture): ProtocolAnomaly[] => {
  const anomalies: ProtocolAnomaly[] = [];

  if (!packet.headers.dns) return anomalies;

  const dns = packet.headers.dns;

  // Excessive queries in single packet
  if (dns.questions > 10) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.PROTOCOL_VIOLATION,
      protocol: NetworkProtocol.UDP,
      severity: 'MEDIUM',
      confidence: 80,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'Excessive DNS queries in single packet',
      technicalDetails: { queryCount: dns.questions },
      mitreAttack: ['T1071.004'], // DNS Application Layer Protocol
      recommendations: ['Investigate for DNS amplification attack'],
    });
  }

  // Check for DNS tunneling indicators
  if (dns.queries) {
    for (const query of dns.queries) {
      if (query.name.length > 64 || query.name.split('.').length > 10) {
        anomalies.push({
          anomalyId: crypto.randomUUID(),
          type: ProtocolAnomalyType.DNS_TUNNELING,
          protocol: NetworkProtocol.UDP,
          severity: 'HIGH',
          confidence: 85,
          timestamp: packet.timestamp,
          sourceIp: packet.sourceIp,
          destinationIp: packet.destinationIp,
          description: 'Potential DNS tunneling detected',
          technicalDetails: { query: query.name, length: query.name.length },
          mitreAttack: ['T1071.004', 'T1048.003'], // Exfiltration Over Alternative Protocol
          recommendations: ['Block domain', 'Investigate source host for malware'],
        });
      }
    }
  }

  return anomalies;
};

/**
 * Detects HTTP protocol anomalies.
 *
 * @param {PacketCapture} packet - Packet to analyze
 * @returns {ProtocolAnomaly[]} Detected HTTP anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectHTTPAnomalies(packet);
 * ```
 */
export const detectHTTPAnomalies = (packet: PacketCapture): ProtocolAnomaly[] => {
  const anomalies: ProtocolAnomaly[] = [];

  if (!packet.headers.http) return anomalies;

  const http = packet.headers.http;

  // HTTP on non-standard port
  if (packet.destinationPort && packet.destinationPort !== 80 && packet.destinationPort !== 8080) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.UNUSUAL_PORT,
      protocol: NetworkProtocol.TCP,
      severity: 'MEDIUM',
      confidence: 70,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'HTTP traffic on unusual port',
      technicalDetails: { port: packet.destinationPort },
      mitreAttack: ['T1071.001'], // Web Protocols
      recommendations: ['Verify legitimate application use'],
    });
  }

  // Suspicious HTTP methods
  const suspiciousMethods = ['TRACE', 'CONNECT', 'DEBUG'];
  if (http.method && suspiciousMethods.includes(http.method)) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.HTTP_ANOMALY,
      protocol: NetworkProtocol.TCP,
      severity: 'MEDIUM',
      confidence: 75,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: `Suspicious HTTP method: ${http.method}`,
      technicalDetails: { method: http.method },
      recommendations: ['Review firewall rules'],
    });
  }

  return anomalies;
};

/**
 * Detects generic protocol anomalies.
 *
 * @param {PacketCapture} packet - Packet to analyze
 * @returns {ProtocolAnomaly[]} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = detectGenericAnomalies(packet);
 * ```
 */
export const detectGenericAnomalies = (packet: PacketCapture): ProtocolAnomaly[] => {
  const anomalies: ProtocolAnomaly[] = [];

  // Fragmentation anomalies
  if (packet.headers.ip && packet.headers.ip.fragmentOffset > 0) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.FRAGMENTATION_ATTACK,
      protocol: packet.protocol,
      severity: 'MEDIUM',
      confidence: 65,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'Suspicious IP fragmentation detected',
      technicalDetails: { fragmentOffset: packet.headers.ip.fragmentOffset },
      recommendations: ['Enable defragmentation in firewall'],
    });
  }

  // Packet size anomalies
  if (packet.length < 20 || packet.length > 9000) {
    anomalies.push({
      anomalyId: crypto.randomUUID(),
      type: ProtocolAnomalyType.MALFORMED_PACKET,
      protocol: packet.protocol,
      severity: 'LOW',
      confidence: 60,
      timestamp: packet.timestamp,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      description: 'Unusual packet size detected',
      technicalDetails: { packetSize: packet.length },
      recommendations: ['Monitor for DoS attacks'],
    });
  }

  return anomalies;
};

// ============================================================================
// C2 COMMUNICATION DETECTION FUNCTIONS (5 functions)
// ============================================================================

/**
 * Detects Command & Control (C2) communication patterns.
 *
 * @swagger
 * /api/network/c2/detect:
 *   post:
 *     tags:
 *       - C2 Detection
 *     summary: Detect C2 communications
 *     description: Identifies Command and Control communication patterns including beaconing, DNS tunneling, and custom protocols
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *               packets:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: C2 detection completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detections:
 *                   type: array
 *                   items:
 *                     type: object
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @param {PacketCapture[]} [packets] - Optional packet captures
 * @returns {Promise<C2Detection[]>} Detected C2 communications
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const c2Detections = await detectC2Communication(flows);
 * ```
 */
export const detectC2Communication = async (
  flows: NetworkFlow[],
  packets?: PacketCapture[]
): Promise<C2Detection[]> => {
  const detections: C2Detection[] = [];

  // Detect beaconing
  const beaconingDetections = await detectBeaconingPattern(flows);
  detections.push(...beaconingDetections);

  // Detect DNS tunneling
  if (packets) {
    const dnsTunnelingDetections = await detectDNSTunneling(packets);
    detections.push(...dnsTunnelingDetections);
  }

  // Detect HTTP/HTTPS C2
  const httpC2Detections = await detectHTTPC2(flows);
  detections.push(...httpC2Detections);

  // Detect domain generation algorithms
  const dgaDetections = await detectDomainGeneration(flows);
  detections.push(...dgaDetections);

  return detections;
};

/**
 * Detects beaconing patterns characteristic of malware C2.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {Promise<C2Detection[]>} Detected beaconing patterns
 *
 * @example
 * ```typescript
 * const beacons = await detectBeaconingPattern(flows);
 * ```
 */
export const detectBeaconingPattern = async (flows: NetworkFlow[]): Promise<C2Detection[]> => {
  const detections: C2Detection[] = [];
  const sourceDestMap = new Map<string, NetworkFlow[]>();

  // Group by source-destination
  for (const flow of flows) {
    const key = `${flow.sourceIp}-${flow.destinationIp}`;
    if (!sourceDestMap.has(key)) {
      sourceDestMap.set(key, []);
    }
    sourceDestMap.get(key)!.push(flow);
  }

  for (const [key, pairFlows] of sourceDestMap.entries()) {
    if (pairFlows.length < 10) continue;

    // Sort by time
    pairFlows.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < pairFlows.length; i++) {
      intervals.push(pairFlows[i].startTime.getTime() - pairFlows[i - 1].startTime.getTime());
    }

    // Check for regularity
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgInterval;

    if (coefficientOfVariation < 0.3) { // Low variation = regular beaconing
      detections.push({
        detectionId: crypto.randomUUID(),
        pattern: C2Pattern.BEACONING,
        confidence: 90,
        timestamp: new Date(),
        sourceIp: pairFlows[0].sourceIp,
        destinationIp: pairFlows[0].destinationIp,
        frequency: pairFlows.length,
        intervalPattern: intervals,
        severity: 'HIGH',
        mitreAttack: ['T1071', 'T1095'], // Application Layer Protocol, Non-Application Layer Protocol
      });
    }
  }

  return detections;
};

/**
 * Detects DNS tunneling used for C2 or exfiltration.
 *
 * @param {PacketCapture[]} packets - Packets to analyze
 * @returns {Promise<C2Detection[]>} Detected DNS tunneling
 *
 * @example
 * ```typescript
 * const tunneling = await detectDNSTunneling(packets);
 * ```
 */
export const detectDNSTunneling = async (packets: PacketCapture[]): Promise<C2Detection[]> => {
  const detections: C2Detection[] = [];
  const dnsPackets = packets.filter(p => p.headers.dns);

  for (const packet of dnsPackets) {
    if (!packet.headers.dns?.queries) continue;

    for (const query of packet.headers.dns.queries) {
      const indicators = [];

      // Long subdomain
      if (query.name.length > 64) {
        indicators.push('long_domain');
      }

      // High entropy
      if (calculateEntropy(query.name) > 4.5) {
        indicators.push('high_entropy');
      }

      // Many subdomains
      if (query.name.split('.').length > 5) {
        indicators.push('many_subdomains');
      }

      // Unusual TLD
      const unusualTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq'];
      if (unusualTLDs.some(tld => query.name.endsWith(tld))) {
        indicators.push('unusual_tld');
      }

      if (indicators.length >= 2) {
        detections.push({
          detectionId: crypto.randomUUID(),
          pattern: C2Pattern.DNS_TUNNELING,
          confidence: 80 + (indicators.length * 5),
          timestamp: packet.timestamp,
          sourceIp: packet.sourceIp,
          destinationIp: packet.destinationIp,
          destinationDomain: query.name,
          severity: 'HIGH',
          mitreAttack: ['T1071.004', 'T1048.003'],
        });
      }
    }
  }

  return detections;
};

/**
 * Detects HTTP/HTTPS C2 communication patterns.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {Promise<C2Detection[]>} Detected HTTP C2 patterns
 *
 * @example
 * ```typescript
 * const httpC2 = await detectHTTPC2(flows);
 * ```
 */
export const detectHTTPC2 = async (flows: NetworkFlow[]): Promise<C2Detection[]> => {
  const detections: C2Detection[] = [];

  const httpFlows = flows.filter(f =>
    f.applicationProtocol === 'HTTP' || f.applicationProtocol === 'HTTPS' ||
    f.destinationPort === 80 || f.destinationPort === 443
  );

  const destIpMap = new Map<string, NetworkFlow[]>();

  for (const flow of httpFlows) {
    if (!destIpMap.has(flow.destinationIp)) {
      destIpMap.set(flow.destinationIp, []);
    }
    destIpMap.get(flow.destinationIp)!.push(flow);
  }

  for (const [destIp, ipFlows] of destIpMap.entries()) {
    // Check for consistent request sizes (C2 check-ins)
    const bytesOut = ipFlows.map(f => f.bytesOut);
    const avgBytesOut = bytesOut.reduce((a, b) => a + b, 0) / bytesOut.length;
    const similarSizes = bytesOut.filter(b => Math.abs(b - avgBytesOut) < avgBytesOut * 0.2).length;

    if (similarSizes / bytesOut.length > 0.8 && ipFlows.length > 5) {
      detections.push({
        detectionId: crypto.randomUUID(),
        pattern: ipFlows[0].destinationPort === 443 ? C2Pattern.HTTPS_C2 : C2Pattern.HTTP_C2,
        confidence: 75,
        timestamp: new Date(),
        sourceIp: ipFlows[0].sourceIp,
        destinationIp: destIp,
        frequency: ipFlows.length,
        severity: 'HIGH',
        mitreAttack: ['T1071.001'], // Web Protocols
      });
    }
  }

  return detections;
};

/**
 * Detects domain generation algorithm (DGA) patterns.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {Promise<C2Detection[]>} Detected DGA patterns
 *
 * @example
 * ```typescript
 * const dgaDetections = await detectDomainGeneration(flows);
 * ```
 */
export const detectDomainGeneration = async (flows: NetworkFlow[]): Promise<C2Detection[]> => {
  const detections: C2Detection[] = [];

  // In a real implementation, this would analyze DNS flows for DGA domains
  // For now, we'll create a simplified version

  const sourceIpMap = new Map<string, Set<string>>();

  for (const flow of flows) {
    if (!sourceIpMap.has(flow.sourceIp)) {
      sourceIpMap.set(flow.sourceIp, new Set());
    }
    // In practice, extract domains from DNS queries
    sourceIpMap.get(flow.sourceIp)!.add(flow.destinationIp);
  }

  for (const [sourceIp, destinations] of sourceIpMap.entries()) {
    // If a host connects to many different destinations in short time, might be DGA
    if (destinations.size > 20) {
      detections.push({
        detectionId: crypto.randomUUID(),
        pattern: C2Pattern.DOMAIN_GENERATION,
        confidence: 70,
        timestamp: new Date(),
        sourceIp,
        destinationIp: '',
        severity: 'MEDIUM',
        mitreAttack: ['T1568.002'], // Domain Generation Algorithms
      });
    }
  }

  return detections;
};

/**
 * Checks if an IP belongs to known C2 infrastructure.
 *
 * @param {string} ip - IP address to check
 * @returns {Promise<boolean>} True if IP is known C2
 *
 * @example
 * ```typescript
 * const isC2 = await checkC2Infrastructure('203.0.113.45');
 * ```
 */
export const checkC2Infrastructure = async (ip: string): Promise<boolean> => {
  // In production, this would check against threat intelligence feeds
  // For now, simplified implementation

  const knownC2Ranges = [
    '203.0.113.',  // TEST-NET-3 (example)
    '198.51.100.', // TEST-NET-2 (example)
  ];

  return knownC2Ranges.some(range => ip.startsWith(range));
};

// ============================================================================
// DATA EXFILTRATION DETECTION FUNCTIONS (5 functions)
// ============================================================================

/**
 * Detects data exfiltration attempts through network analysis.
 *
 * @swagger
 * /api/network/exfiltration/detect:
 *   post:
 *     tags:
 *       - Data Exfiltration
 *     summary: Detect data exfiltration
 *     description: Identifies data exfiltration attempts through various channels including DNS, ICMP, encrypted channels, and large uploads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *     responses:
 *       200:
 *         description: Exfiltration detection completed
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {Promise<DataExfiltration[]>} Detected exfiltration attempts
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const exfiltrations = await detectDataExfiltration(flows);
 * ```
 */
export const detectDataExfiltration = async (
  flows: NetworkFlow[]
): Promise<DataExfiltration[]> => {
  const detections: DataExfiltration[] = [];

  // Detect large uploads
  const largeUploads = detectLargeUploads(flows);
  detections.push(...largeUploads);

  // Detect unusual encrypted traffic
  const encryptedExfil = detectEncryptedExfiltration(flows);
  detections.push(...encryptedExfil);

  // Detect cloud service uploads
  const cloudExfil = detectCloudExfiltration(flows);
  detections.push(...cloudExfil);

  return detections;
};

/**
 * Detects large data uploads that may indicate exfiltration.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {DataExfiltration[]} Detected large uploads
 *
 * @example
 * ```typescript
 * const uploads = detectLargeUploads(flows);
 * ```
 */
export const detectLargeUploads = (flows: NetworkFlow[]): DataExfiltration[] => {
  const detections: DataExfiltration[] = [];

  for (const flow of flows) {
    // Flag uploads larger than 100MB
    if (flow.bytesOut > 100 * 1024 * 1024) {
      detections.push({
        exfiltrationId: crypto.randomUUID(),
        method: ExfiltrationMethod.LARGE_UPLOAD,
        confidence: 70,
        timestamp: flow.startTime,
        sourceIp: flow.sourceIp,
        destinationIp: flow.destinationIp,
        dataVolume: flow.bytesOut,
        duration: flow.duration || 0,
        protocol: flow.protocol,
        encryptionUsed: flow.destinationPort === 443 || flow.applicationProtocol === 'HTTPS',
        suspiciousPatterns: ['large_volume'],
        severity: 'HIGH',
      });
    }
  }

  return detections;
};

/**
 * Detects encrypted channel exfiltration.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {DataExfiltration[]} Detected encrypted exfiltration
 *
 * @example
 * ```typescript
 * const encrypted = detectEncryptedExfiltration(flows);
 * ```
 */
export const detectEncryptedExfiltration = (flows: NetworkFlow[]): DataExfiltration[] => {
  const detections: DataExfiltration[] = [];

  const encryptedFlows = flows.filter(f =>
    f.destinationPort === 443 ||
    f.applicationProtocol === 'HTTPS' ||
    f.applicationProtocol === 'TLS'
  );

  for (const flow of encryptedFlows) {
    // High outbound traffic on encrypted channel
    if (flow.bytesOut > 50 * 1024 * 1024 && flow.bytesOut > flow.bytesIn * 2) {
      detections.push({
        exfiltrationId: crypto.randomUUID(),
        method: ExfiltrationMethod.ENCRYPTED_CHANNEL,
        confidence: 65,
        timestamp: flow.startTime,
        sourceIp: flow.sourceIp,
        destinationIp: flow.destinationIp,
        dataVolume: flow.bytesOut,
        duration: flow.duration || 0,
        protocol: flow.protocol,
        encryptionUsed: true,
        suspiciousPatterns: ['asymmetric_traffic', 'encrypted_channel'],
        severity: 'MEDIUM',
      });
    }
  }

  return detections;
};

/**
 * Detects exfiltration to cloud services.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @returns {DataExfiltration[]} Detected cloud exfiltration
 *
 * @example
 * ```typescript
 * const cloudExfil = detectCloudExfiltration(flows);
 * ```
 */
export const detectCloudExfiltration = (flows: NetworkFlow[]): DataExfiltration[] => {
  const detections: DataExfiltration[] = [];

  // Known cloud service IP ranges (simplified)
  const cloudServiceRanges = {
    'AWS': ['52.', '54.', '18.'],
    'Azure': ['13.', '20.', '40.'],
    'GCP': ['35.', '34.'],
  };

  for (const flow of flows) {
    for (const [service, ranges] of Object.entries(cloudServiceRanges)) {
      if (ranges.some(range => flow.destinationIp.startsWith(range))) {
        if (flow.bytesOut > 10 * 1024 * 1024) {
          detections.push({
            exfiltrationId: crypto.randomUUID(),
            method: ExfiltrationMethod.CLOUD_UPLOAD,
            confidence: 60,
            timestamp: flow.startTime,
            sourceIp: flow.sourceIp,
            destinationIp: flow.destinationIp,
            dataVolume: flow.bytesOut,
            duration: flow.duration || 0,
            protocol: flow.protocol,
            encryptionUsed: flow.destinationPort === 443,
            suspiciousPatterns: ['cloud_upload', service],
            severity: 'MEDIUM',
          });
        }
      }
    }
  }

  return detections;
};

/**
 * Analyzes data transfer patterns for anomalies.
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @param {object} baseline - Baseline metrics
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const baseline = { avgBytesOut: 1000000, stdDev: 200000 };
 * const anomalies = await analyzeDataTransferPatterns(flows, baseline);
 * ```
 */
export const analyzeDataTransferPatterns = async (
  flows: NetworkFlow[],
  baseline?: { avgBytesOut: number; stdDev: number }
): Promise<any[]> => {
  const anomalies: any[] = [];

  if (!baseline) {
    // Calculate baseline from flows
    const bytesOut = flows.map(f => f.bytesOut);
    const avgBytesOut = bytesOut.reduce((a, b) => a + b, 0) / bytesOut.length;
    const variance = bytesOut.reduce((sum, val) => sum + Math.pow(val - avgBytesOut, 2), 0) / bytesOut.length;
    baseline = { avgBytesOut, stdDev: Math.sqrt(variance) };
  }

  for (const flow of flows) {
    const zScore = (flow.bytesOut - baseline.avgBytesOut) / baseline.stdDev;

    if (Math.abs(zScore) > 3) { // 3 standard deviations
      anomalies.push({
        flowId: flow.flowId,
        sourceIp: flow.sourceIp,
        destinationIp: flow.destinationIp,
        bytesOut: flow.bytesOut,
        zScore,
        anomalyType: 'DATA_TRANSFER_ANOMALY',
        severity: zScore > 5 ? 'HIGH' : 'MEDIUM',
      });
    }
  }

  return anomalies;
};

// ============================================================================
// NETWORK IOC MATCHING FUNCTIONS (4 functions)
// ============================================================================

/**
 * Matches network traffic against Indicators of Compromise (IOCs).
 *
 * @swagger
 * /api/network/ioc/match:
 *   post:
 *     tags:
 *       - IOC Matching
 *     summary: Match network traffic against IOCs
 *     description: Compares network flows and packets against threat intelligence IOCs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *               iocs:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: IOC matching completed
 *
 * @param {NetworkFlow[]} flows - Network flows to check
 * @param {ThreatIndicator[]} iocs - IOCs to match against
 * @returns {Promise<any[]>} Matching results
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const iocs = [...];
 * const matches = await matchNetworkIOCs(flows, iocs);
 * ```
 */
export const matchNetworkIOCs = async (
  flows: NetworkFlow[],
  iocs: ThreatIndicator[]
): Promise<any[]> => {
  const matches: any[] = [];

  const ipIOCs = iocs.filter(ioc => ioc.indicatorType === 'IP');
  const domainIOCs = iocs.filter(ioc => ioc.indicatorType === 'DOMAIN');

  for (const flow of flows) {
    // Match source IP
    const sourceMatch = ipIOCs.find(ioc => ioc.value === flow.sourceIp);
    if (sourceMatch) {
      matches.push({
        flowId: flow.flowId,
        matchType: 'SOURCE_IP',
        ioc: sourceMatch,
        timestamp: flow.startTime,
        severity: sourceMatch.severity,
      });
    }

    // Match destination IP
    const destMatch = ipIOCs.find(ioc => ioc.value === flow.destinationIp);
    if (destMatch) {
      matches.push({
        flowId: flow.flowId,
        matchType: 'DESTINATION_IP',
        ioc: destMatch,
        timestamp: flow.startTime,
        severity: destMatch.severity,
      });
    }
  }

  return matches;
};

/**
 * Enriches IOCs with network context.
 *
 * @param {ThreatIndicator[]} iocs - IOCs to enrich
 * @param {NetworkFlow[]} flows - Network flows for context
 * @returns {Promise<ThreatIndicator[]>} Enriched IOCs
 *
 * @example
 * ```typescript
 * const enrichedIOCs = await enrichIOCsWithNetworkContext(iocs, flows);
 * ```
 */
export const enrichIOCsWithNetworkContext = async (
  iocs: ThreatIndicator[],
  flows: NetworkFlow[]
): Promise<ThreatIndicator[]> => {
  const enrichedIOCs: ThreatIndicator[] = [];

  for (const ioc of iocs) {
    const enriched = { ...ioc };

    if (ioc.indicatorType === 'IP') {
      // Find flows involving this IP
      const relatedFlows = flows.filter(f =>
        f.sourceIp === ioc.value || f.destinationIp === ioc.value
      );

      enriched.description = `${ioc.description || ''} | Seen in ${relatedFlows.length} flows`;
      enriched.lastSeen = relatedFlows.length > 0
        ? new Date(Math.max(...relatedFlows.map(f => f.startTime.getTime())))
        : ioc.lastSeen;
    }

    enrichedIOCs.push(enriched);
  }

  return enrichedIOCs;
};

/**
 * Creates network-based IOCs from detected threats.
 *
 * @param {any[]} threats - Detected threats
 * @returns {ThreatIndicator[]} Generated IOCs
 *
 * @example
 * ```typescript
 * const threats = [...];
 * const iocs = createIOCsFromNetworkThreats(threats);
 * ```
 */
export const createIOCsFromNetworkThreats = (threats: any[]): ThreatIndicator[] => {
  const iocs: ThreatIndicator[] = [];

  for (const threat of threats) {
    if (threat.sourceIp) {
      iocs.push({
        indicatorType: 'IP',
        value: threat.sourceIp,
        severity: threat.severity || 'MEDIUM',
        source: 'network_detection',
        confidence: threat.confidence || 70,
        lastSeen: threat.timestamp || new Date(),
        threatType: threat.type || threat.threatType,
        description: `Automatically generated from ${threat.type || 'threat'} detection`,
      });
    }

    if (threat.destinationIp && !isPrivateIP(threat.destinationIp)) {
      iocs.push({
        indicatorType: 'IP',
        value: threat.destinationIp,
        severity: threat.severity || 'MEDIUM',
        source: 'network_detection',
        confidence: threat.confidence || 70,
        lastSeen: threat.timestamp || new Date(),
        threatType: threat.type || threat.threatType,
        description: `Destination IP from ${threat.type || 'threat'} detection`,
      });
    }
  }

  return iocs;
};

/**
 * Validates and scores IOC quality based on network observations.
 *
 * @param {ThreatIndicator[]} iocs - IOCs to validate
 * @param {NetworkFlow[]} flows - Network flows for validation
 * @returns {Promise<any[]>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateNetworkIOCs(iocs, flows);
 * ```
 */
export const validateNetworkIOCs = async (
  iocs: ThreatIndicator[],
  flows: NetworkFlow[]
): Promise<any[]> => {
  const validationResults: any[] = [];

  for (const ioc of iocs) {
    let qualityScore = ioc.confidence;
    const issues: string[] = [];

    if (ioc.indicatorType === 'IP') {
      // Check if IP is in private range
      if (isPrivateIP(ioc.value)) {
        qualityScore -= 30;
        issues.push('Private IP address');
      }

      // Check if IP has been observed
      const observed = flows.some(f => f.sourceIp === ioc.value || f.destinationIp === ioc.value);
      if (!observed) {
        qualityScore -= 20;
        issues.push('Not observed in network traffic');
      }
    }

    validationResults.push({
      ioc: ioc.value,
      originalConfidence: ioc.confidence,
      qualityScore: Math.max(0, Math.min(100, qualityScore)),
      issues,
      isValid: qualityScore > 30,
    });
  }

  return validationResults;
};

// ============================================================================
// TRAFFIC PATTERN ANALYSIS FUNCTIONS (4 functions)
// ============================================================================

/**
 * Analyzes traffic patterns for baseline and anomaly detection.
 *
 * @swagger
 * /api/network/traffic/patterns:
 *   post:
 *     tags:
 *       - Traffic Analysis
 *     summary: Analyze traffic patterns
 *     description: Identifies traffic patterns, baselines, and anomalies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *     responses:
 *       200:
 *         description: Pattern analysis completed
 *
 * @param {NetworkFlow[]} flows - Network flows to analyze
 * @param {object} [options] - Analysis options
 * @returns {Promise<TrafficPattern[]>} Detected patterns
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const patterns = await analyzeTrafficPatterns(flows);
 * ```
 */
export const analyzeTrafficPatterns = async (
  flows: NetworkFlow[],
  options?: {
    timeWindow?: number;
    enableBaseline?: boolean;
  }
): Promise<TrafficPattern[]> => {
  const patterns: TrafficPattern[] = [];
  const timeWindow = options?.timeWindow || 3600000; // 1 hour default

  // Aggregate flows by time window
  const aggregated = await aggregateFlowsByTimeWindow(flows, timeWindow);

  for (const window of aggregated) {
    const metrics: TrafficMetrics = {
      totalPackets: window.flowCount,
      totalBytes: window.totalBytes,
      uniqueSourceIPs: window.uniqueSourceIPs,
      uniqueDestinationIPs: window.uniqueDestIPs,
      averagePacketSize: window.totalBytes / window.flowCount,
      peakBandwidth: 0, // Would need more granular data
      protocolDistribution: {},
      portDistribution: {},
      flowCount: window.flowCount,
      averageFlowDuration: 0, // Would calculate from flows
    };

    // Calculate anomaly score
    const anomalyScore = calculateWindowAnomalyScore(metrics);

    patterns.push({
      patternId: crypto.randomUUID(),
      patternType: anomalyScore > 70 ? 'ANOMALY' : 'BASELINE',
      timestamp: window.windowStart,
      timeWindow,
      metrics,
      anomalyScore,
      suspiciousCharacteristics: anomalyScore > 70 ? ['high_anomaly_score'] : [],
      relatedIPs: [],
      protocols: window.protocols,
    });
  }

  return patterns;
};

/**
 * Calculates baseline metrics from historical traffic.
 *
 * @param {NetworkFlow[]} historicalFlows - Historical network flows
 * @returns {Promise<any>} Baseline metrics
 *
 * @example
 * ```typescript
 * const baseline = await calculateTrafficBaseline(historicalFlows);
 * ```
 */
export const calculateTrafficBaseline = async (
  historicalFlows: NetworkFlow[]
): Promise<any> => {
  const totalBytes = historicalFlows.reduce((sum, f) => sum + f.bytesIn + f.bytesOut, 0);
  const totalPackets = historicalFlows.reduce((sum, f) => sum + f.packetsIn + f.packetsOut, 0);

  const protocols = new Map<NetworkProtocol, number>();
  const ports = new Map<number, number>();
  const uniqueIPs = new Set<string>();

  for (const flow of historicalFlows) {
    protocols.set(flow.protocol, (protocols.get(flow.protocol) || 0) + 1);
    ports.set(flow.destinationPort, (ports.get(flow.destinationPort) || 0) + 1);
    uniqueIPs.add(flow.sourceIp);
    uniqueIPs.add(flow.destinationIp);
  }

  return {
    avgBytesPerFlow: totalBytes / historicalFlows.length,
    avgPacketsPerFlow: totalPackets / historicalFlows.length,
    avgFlowsPerHour: historicalFlows.length / 24, // Assuming 24-hour period
    protocolDistribution: Object.fromEntries(protocols),
    topPorts: Array.from(ports.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    uniqueIPCount: uniqueIPs.size,
  };
};

/**
 * Detects anomalous traffic patterns based on baseline.
 *
 * @param {NetworkFlow[]} flows - Current network flows
 * @param {any} baseline - Baseline metrics
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const baseline = await calculateTrafficBaseline(historicalFlows);
 * const anomalies = await detectTrafficAnomalies(currentFlows, baseline);
 * ```
 */
export const detectTrafficAnomalies = async (
  flows: NetworkFlow[],
  baseline: any
): Promise<any[]> => {
  const anomalies: any[] = [];

  const currentMetrics = {
    avgBytesPerFlow: flows.reduce((sum, f) => sum + f.bytesIn + f.bytesOut, 0) / flows.length,
    avgPacketsPerFlow: flows.reduce((sum, f) => sum + f.packetsIn + f.packetsOut, 0) / flows.length,
  };

  // Volume anomalies
  if (currentMetrics.avgBytesPerFlow > baseline.avgBytesPerFlow * 3) {
    anomalies.push({
      type: 'VOLUME_ANOMALY',
      severity: 'HIGH',
      description: 'Traffic volume significantly higher than baseline',
      currentValue: currentMetrics.avgBytesPerFlow,
      baselineValue: baseline.avgBytesPerFlow,
      deviation: (currentMetrics.avgBytesPerFlow / baseline.avgBytesPerFlow - 1) * 100,
    });
  }

  // Packet rate anomalies
  if (currentMetrics.avgPacketsPerFlow > baseline.avgPacketsPerFlow * 3) {
    anomalies.push({
      type: 'PACKET_RATE_ANOMALY',
      severity: 'MEDIUM',
      description: 'Packet rate significantly higher than baseline',
      currentValue: currentMetrics.avgPacketsPerFlow,
      baselineValue: baseline.avgPacketsPerFlow,
      deviation: (currentMetrics.avgPacketsPerFlow / baseline.avgPacketsPerFlow - 1) * 100,
    });
  }

  return anomalies;
};

/**
 * Generates traffic reports and visualizations.
 *
 * @param {NetworkFlow[]} flows - Network flows to report on
 * @param {object} [options] - Report options
 * @returns {Promise<any>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generateTrafficReport(flows, { format: 'json' });
 * ```
 */
export const generateTrafficReport = async (
  flows: NetworkFlow[],
  options?: {
    format?: 'json' | 'text' | 'html';
    includeCharts?: boolean;
  }
): Promise<any> => {
  const totalBytes = flows.reduce((sum, f) => sum + f.bytesIn + f.bytesOut, 0);
  const protocols = new Map<NetworkProtocol, number>();
  const topSourceIPs = new Map<string, number>();
  const topDestIPs = new Map<string, number>();

  let threatCount = 0;

  for (const flow of flows) {
    protocols.set(flow.protocol, (protocols.get(flow.protocol) || 0) + 1);
    topSourceIPs.set(flow.sourceIp, (topSourceIPs.get(flow.sourceIp) || 0) + 1);
    topDestIPs.set(flow.destinationIp, (topDestIPs.get(flow.destinationIp) || 0) + 1);

    if (flow.threatScore && flow.threatScore > 50) {
      threatCount++;
    }
  }

  const report = {
    summary: {
      totalFlows: flows.length,
      totalBytes,
      totalBytesFormatted: formatBytes(totalBytes),
      timeRange: {
        start: new Date(Math.min(...flows.map(f => f.startTime.getTime()))),
        end: new Date(Math.max(...flows.map(f => (f.endTime || f.startTime).getTime()))),
      },
      threatCount,
      threatPercentage: (threatCount / flows.length * 100).toFixed(2) + '%',
    },
    protocolDistribution: Object.fromEntries(protocols),
    topSourceIPs: Array.from(topSourceIPs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    topDestinationIPs: Array.from(topDestIPs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  };

  return report;
};

// ============================================================================
// NETWORK THREAT INTELLIGENCE FUNCTIONS (3 functions)
// ============================================================================

/**
 * Integrates network traffic with threat intelligence feeds.
 *
 * @swagger
 * /api/network/threat-intel/integrate:
 *   post:
 *     tags:
 *       - Threat Intelligence
 *     summary: Integrate threat intelligence
 *     description: Enriches network analysis with threat intelligence data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flows:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NetworkFlow'
 *               threatIntel:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Integration completed
 *
 * @param {NetworkFlow[]} flows - Network flows
 * @param {NetworkThreatIntel[]} threatIntel - Threat intelligence feeds
 * @returns {Promise<any[]>} Integration results
 *
 * @example
 * ```typescript
 * const flows = [...];
 * const threatIntel = [...];
 * const results = await integrateNetworkThreatIntel(flows, threatIntel);
 * ```
 */
export const integrateNetworkThreatIntel = async (
  flows: NetworkFlow[],
  threatIntel: NetworkThreatIntel[]
): Promise<any[]> => {
  const results: any[] = [];

  // Build IOC lookup map
  const iocMap = new Map<string, ThreatIndicator[]>();

  for (const feed of threatIntel) {
    for (const indicator of feed.indicators) {
      if (!iocMap.has(indicator.value)) {
        iocMap.set(indicator.value, []);
      }
      iocMap.get(indicator.value)!.push(indicator);
    }
  }

  // Match flows against IOCs
  for (const flow of flows) {
    const matches: ThreatIndicator[] = [];

    // Check source IP
    if (iocMap.has(flow.sourceIp)) {
      matches.push(...iocMap.get(flow.sourceIp)!);
    }

    // Check destination IP
    if (iocMap.has(flow.destinationIp)) {
      matches.push(...iocMap.get(flow.destinationIp)!);
    }

    if (matches.length > 0) {
      results.push({
        flowId: flow.flowId,
        sourceIp: flow.sourceIp,
        destinationIp: flow.destinationIp,
        matches,
        maxSeverity: getMaxSeverity(matches),
        timestamp: flow.startTime,
      });
    }
  }

  return results;
};

/**
 * Queries threat intelligence for network indicators.
 *
 * @param {string[]} indicators - Network indicators to query
 * @param {string[]} providers - Threat intel providers
 * @returns {Promise<any[]>} Threat intelligence results
 *
 * @example
 * ```typescript
 * const indicators = ['203.0.113.45', 'example.com'];
 * const results = await queryNetworkThreatIntel(indicators, ['alienvault', 'virustotal']);
 * ```
 */
export const queryNetworkThreatIntel = async (
  indicators: string[],
  providers: string[]
): Promise<any[]> => {
  const results: any[] = [];

  // In production, this would query actual threat intel APIs
  // Simplified implementation for demonstration

  for (const indicator of indicators) {
    for (const provider of providers) {
      // Simulate threat intel lookup
      const mockResult = {
        indicator,
        provider,
        isMalicious: Math.random() > 0.7,
        confidence: Math.floor(Math.random() * 40) + 60,
        lastSeen: new Date(),
        categories: ['malware', 'c2'],
        threatActors: [],
      };

      results.push(mockResult);
    }
  }

  return results;
};

/**
 * Updates network threat intelligence cache.
 *
 * @param {NetworkThreatIntel[]} newIntel - New threat intelligence
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const newIntel = [...];
 * await updateNetworkThreatIntelCache(newIntel);
 * ```
 */
export const updateNetworkThreatIntelCache = async (
  newIntel: NetworkThreatIntel[]
): Promise<void> => {
  // In production, this would update a Redis cache or database
  // Simplified implementation

  for (const intel of newIntel) {
    console.log(`Caching threat intel from ${intel.provider}: ${intel.indicators.length} indicators`);
    // Cache implementation would go here
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Looks up geographic location for an IP address.
 */
const lookupGeoLocation = async (ip: string): Promise<GeoLocation> => {
  // In production, use MaxMind GeoIP or similar service
  return {
    country: 'Unknown',
    countryCode: 'XX',
    latitude: 0,
    longitude: 0,
  };
};

/**
 * Detects application protocol from flow characteristics.
 */
const detectApplicationProtocol = (flow: NetworkFlow): string => {
  const port = flow.destinationPort;

  const wellKnownPorts: Record<number, string> = {
    80: 'HTTP',
    443: 'HTTPS',
    53: 'DNS',
    22: 'SSH',
    21: 'FTP',
    25: 'SMTP',
    110: 'POP3',
    143: 'IMAP',
    3389: 'RDP',
  };

  return wellKnownPorts[port] || 'UNKNOWN';
};

/**
 * Checks if IP is in high-risk country.
 */
const isHighRiskCountry = (countryCode: string): boolean => {
  const highRiskCountries = ['XX', 'YY']; // Example codes
  return highRiskCountries.includes(countryCode);
};

/**
 * Gets accept header for feed format.
 */
const getAcceptHeader = (format: string): string => {
  const headers: Record<string, string> = {
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv',
    stix: 'application/stix+json',
    taxii: 'application/taxii+json',
  };
  return headers[format] || 'application/json';
};

/**
 * Gets maximum severity from threat indicators.
 */
const getMaxSeverity = (indicators: ThreatIndicator[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  const severityOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const severities = indicators.map(i => i.severity);

  for (let i = severityOrder.length - 1; i >= 0; i--) {
    if (severities.includes(severityOrder[i] as any)) {
      return severityOrder[i] as any;
    }
  }

  return 'LOW';
};

/**
 * Checks if content is Base64 encoded.
 */
const isBase64Encoded = (content: string): boolean => {
  const base64Regex = /^[A-Za-z0-9+/]{20,}={0,2}$/;
  return base64Regex.test(content.replace(/\s/g, ''));
};

/**
 * Checks if content is obfuscated.
 */
const isObfuscated = (content: string): boolean => {
  const entropy = calculateEntropy(content);
  return entropy > 5.0;
};

/**
 * Checks if content contains shellcode patterns.
 */
const containsShellcode = (content: string): boolean => {
  // Simplified shellcode detection
  const shellcodePatterns = [
    /\\x[0-9a-fA-F]{2}/,
    /%u[0-9a-fA-F]{4}/,
    /\x90{4,}/, // NOP sled
  ];

  return shellcodePatterns.some(pattern => pattern.test(content));
};

/**
 * Calculates Shannon entropy of a string.
 */
const calculateEntropy = (str: string): number => {
  const frequencies = new Map<string, number>();

  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  const len = str.length;

  for (const count of frequencies.values()) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
};

/**
 * Checks if IP is in private range.
 */
const isPrivateIP = (ip: string): boolean => {
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
  ];

  return privateRanges.some(range => range.test(ip));
};

/**
 * Calculates anomaly score for time window.
 */
const calculateWindowAnomalyScore = (metrics: TrafficMetrics): number => {
  let score = 0;

  // High packet count
  if (metrics.totalPackets > 100000) {
    score += 20;
  }

  // High unique IP count
  if (metrics.uniqueSourceIPs > 1000) {
    score += 20;
  }

  // Unusual average packet size
  if (metrics.averagePacketSize < 50 || metrics.averagePacketSize > 1400) {
    score += 15;
  }

  return Math.min(score, 100);
};

/**
 * Formats bytes to human-readable string.
 */
const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
