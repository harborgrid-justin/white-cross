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
/**
 * Network protocol types
 */
export declare enum NetworkProtocol {
    TCP = "TCP",
    UDP = "UDP",
    ICMP = "ICMP",
    GRE = "GRE",
    ESP = "ESP",
    AH = "AH",
    SCTP = "SCTP",
    UNKNOWN = "UNKNOWN"
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
    duration?: number;
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
export declare enum ProtocolAnomalyType {
    MALFORMED_PACKET = "MALFORMED_PACKET",
    INVALID_HEADER = "INVALID_HEADER",
    PROTOCOL_VIOLATION = "PROTOCOL_VIOLATION",
    UNUSUAL_PORT = "UNUSUAL_PORT",
    SUSPICIOUS_FLAGS = "SUSPICIOUS_FLAGS",
    FRAGMENTATION_ATTACK = "FRAGMENTATION_ATTACK",
    TUNNEL_DETECTED = "TUNNEL_DETECTED",
    ENCRYPTION_ANOMALY = "ENCRYPTION_ANOMALY",
    DNS_TUNNELING = "DNS_TUNNELING",
    HTTP_ANOMALY = "HTTP_ANOMALY"
}
/**
 * Protocol anomaly structure
 */
export interface ProtocolAnomaly {
    anomalyId: string;
    type: ProtocolAnomalyType;
    protocol: NetworkProtocol;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
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
export declare enum C2Pattern {
    BEACONING = "BEACONING",
    DNS_TUNNELING = "DNS_TUNNELING",
    HTTP_C2 = "HTTP_C2",
    HTTPS_C2 = "HTTPS_C2",
    IRC_C2 = "IRC_C2",
    CUSTOM_PROTOCOL = "CUSTOM_PROTOCOL",
    DOMAIN_GENERATION = "DOMAIN_GENERATION",
    FAST_FLUX = "FAST_FLUX",
    TOR_USAGE = "TOR_USAGE"
}
/**
 * C2 detection result
 */
export interface C2Detection {
    detectionId: string;
    pattern: C2Pattern;
    confidence: number;
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
export declare enum ExfiltrationMethod {
    LARGE_UPLOAD = "LARGE_UPLOAD",
    DNS_EXFILTRATION = "DNS_EXFILTRATION",
    ICMP_TUNNELING = "ICMP_TUNNELING",
    ENCRYPTED_CHANNEL = "ENCRYPTED_CHANNEL",
    STEGANOGRAPHY = "STEGANOGRAPHY",
    CLOUD_UPLOAD = "CLOUD_UPLOAD",
    EMAIL_EXFILTRATION = "EMAIL_EXFILTRATION",
    FTP_UPLOAD = "FTP_UPLOAD"
}
/**
 * Data exfiltration detection
 */
export interface DataExfiltration {
    exfiltrationId: string;
    method: ExfiltrationMethod;
    confidence: number;
    timestamp: Date;
    sourceIp: string;
    destinationIp: string;
    destinationDomain?: string;
    dataVolume: number;
    duration: number;
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
    timeWindow: number;
    metrics: TrafficMetrics;
    anomalyScore: number;
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
export declare const getNetworkFlowModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    flowId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    sourceIp: {
        type: string;
        allowNull: boolean;
    };
    destinationIp: {
        type: string;
        allowNull: boolean;
    };
    sourcePort: {
        type: string;
        allowNull: boolean;
    };
    destinationPort: {
        type: string;
        allowNull: boolean;
    };
    protocol: {
        type: string;
        allowNull: boolean;
    };
    bytesIn: {
        type: string;
        defaultValue: number;
    };
    bytesOut: {
        type: string;
        defaultValue: number;
    };
    packetsIn: {
        type: string;
        defaultValue: number;
    };
    packetsOut: {
        type: string;
        defaultValue: number;
    };
    startTime: {
        type: string;
        allowNull: boolean;
    };
    endTime: {
        type: string;
        allowNull: boolean;
    };
    duration: {
        type: string;
        allowNull: boolean;
    };
    flags: {
        type: string;
        defaultValue: never[];
    };
    tcpFlags: {
        type: string;
        allowNull: boolean;
    };
    applicationProtocol: {
        type: string;
        allowNull: boolean;
    };
    threatScore: {
        type: string;
        allowNull: boolean;
    };
    anomalyScore: {
        type: string;
        allowNull: boolean;
    };
    geoLocation: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getPacketCaptureModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    packetId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    sourceIp: {
        type: string;
        allowNull: boolean;
    };
    destinationIp: {
        type: string;
        allowNull: boolean;
    };
    sourcePort: {
        type: string;
        allowNull: boolean;
    };
    destinationPort: {
        type: string;
        allowNull: boolean;
    };
    protocol: {
        type: string;
        allowNull: boolean;
    };
    length: {
        type: string;
        allowNull: boolean;
    };
    headers: {
        type: string;
        allowNull: boolean;
    };
    payloadHex: {
        type: string;
        allowNull: boolean;
    };
    payloadAscii: {
        type: string;
        allowNull: boolean;
    };
    flags: {
        type: string;
        defaultValue: never[];
    };
    threatIndicators: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getProtocolAnomalyModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    anomalyId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    type: {
        type: string;
        allowNull: boolean;
    };
    protocol: {
        type: string;
        allowNull: boolean;
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    sourceIp: {
        type: string;
        allowNull: boolean;
    };
    destinationIp: {
        type: string;
        allowNull: boolean;
    };
    description: {
        type: string;
        allowNull: boolean;
    };
    technicalDetails: {
        type: string;
        defaultValue: {};
    };
    relatedFlows: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    recommendations: {
        type: string;
        defaultValue: never[];
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const getC2DetectionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    detectionId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
    };
    pattern: {
        type: string;
        allowNull: boolean;
    };
    confidence: {
        type: string;
        allowNull: boolean;
        validate: {
            min: number;
            max: number;
        };
    };
    timestamp: {
        type: string;
        allowNull: boolean;
    };
    sourceIp: {
        type: string;
        allowNull: boolean;
    };
    destinationIp: {
        type: string;
        allowNull: boolean;
    };
    destinationDomain: {
        type: string;
        allowNull: boolean;
    };
    frequency: {
        type: string;
        allowNull: boolean;
    };
    intervalPattern: {
        type: string;
        defaultValue: never[];
    };
    payloadSamples: {
        type: string;
        defaultValue: never[];
    };
    iocMatches: {
        type: string;
        defaultValue: never[];
    };
    threatActors: {
        type: string;
        defaultValue: never[];
    };
    malwareFamilies: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
        type: string;
        defaultValue: never[];
    };
    severity: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
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
export declare const analyzeNetworkFlows: (flows: NetworkFlow[], options?: {
    enableThreatScoring?: boolean;
    enableAnomalyDetection?: boolean;
    minThreatScore?: number;
}) => Promise<{
    analyzedFlows: NetworkFlow[];
    threats: any[];
    summary: any;
}>;
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
export declare const calculateFlowThreatScore: (flow: NetworkFlow) => number;
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
export declare const calculateFlowAnomalyScore: (flow: NetworkFlow) => number;
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
export declare const correlateNetworkFlows: (flows: NetworkFlow[], timeWindow?: number) => Promise<any[]>;
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
export declare const enrichNetworkFlows: (flows: NetworkFlow[]) => Promise<NetworkFlow[]>;
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
export declare const detectNetworkBeaconing: (flows: NetworkFlow[], options?: {
    minOccurrences?: number;
    intervalTolerance?: number;
}) => Promise<any[]>;
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
export declare const aggregateFlowsByTimeWindow: (flows: NetworkFlow[], windowSize: number) => Promise<any[]>;
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
export declare const filterNetworkFlows: (flows: NetworkFlow[], criteria: {
    protocol?: NetworkProtocol;
    sourceIp?: string;
    destinationIp?: string;
    minThreatScore?: number;
    maxThreatScore?: number;
    startTime?: Date;
    endTime?: Date;
}) => NetworkFlow[];
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
export declare const exportNetworkFlows: (flows: NetworkFlow[], format: "json" | "csv" | "pcap") => Promise<string | Buffer>;
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
export declare const deepPacketInspection: (packets: PacketCapture[], options?: {
    enableSignatureMatching?: boolean;
    enablePayloadAnalysis?: boolean;
}) => Promise<any[]>;
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
export declare const matchPacketSignatures: (packet: PacketCapture) => ThreatIndicator[];
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
export declare const analyzePacketPayload: (payload: string) => ThreatIndicator[];
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
export declare const inspectHTTPHeaders: (headers: HTTPHeader) => ThreatIndicator[];
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
export declare const inspectDNSQuery: (dnsHeader: DNSHeader) => ThreatIndicator[];
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
export declare const extractPacketIOCs: (packets: PacketCapture[]) => Promise<ThreatIndicator[]>;
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
export declare const detectProtocolAnomalies: (packets: PacketCapture[]) => Promise<ProtocolAnomaly[]>;
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
export declare const detectTCPAnomalies: (packet: PacketCapture) => ProtocolAnomaly[];
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
export declare const detectDNSAnomalies: (packet: PacketCapture) => ProtocolAnomaly[];
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
export declare const detectHTTPAnomalies: (packet: PacketCapture) => ProtocolAnomaly[];
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
export declare const detectGenericAnomalies: (packet: PacketCapture) => ProtocolAnomaly[];
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
export declare const detectC2Communication: (flows: NetworkFlow[], packets?: PacketCapture[]) => Promise<C2Detection[]>;
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
export declare const detectBeaconingPattern: (flows: NetworkFlow[]) => Promise<C2Detection[]>;
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
export declare const detectDNSTunneling: (packets: PacketCapture[]) => Promise<C2Detection[]>;
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
export declare const detectHTTPC2: (flows: NetworkFlow[]) => Promise<C2Detection[]>;
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
export declare const detectDomainGeneration: (flows: NetworkFlow[]) => Promise<C2Detection[]>;
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
export declare const checkC2Infrastructure: (ip: string) => Promise<boolean>;
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
export declare const detectDataExfiltration: (flows: NetworkFlow[]) => Promise<DataExfiltration[]>;
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
export declare const detectLargeUploads: (flows: NetworkFlow[]) => DataExfiltration[];
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
export declare const detectEncryptedExfiltration: (flows: NetworkFlow[]) => DataExfiltration[];
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
export declare const detectCloudExfiltration: (flows: NetworkFlow[]) => DataExfiltration[];
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
export declare const analyzeDataTransferPatterns: (flows: NetworkFlow[], baseline?: {
    avgBytesOut: number;
    stdDev: number;
}) => Promise<any[]>;
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
export declare const matchNetworkIOCs: (flows: NetworkFlow[], iocs: ThreatIndicator[]) => Promise<any[]>;
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
export declare const enrichIOCsWithNetworkContext: (iocs: ThreatIndicator[], flows: NetworkFlow[]) => Promise<ThreatIndicator[]>;
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
export declare const createIOCsFromNetworkThreats: (threats: any[]) => ThreatIndicator[];
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
export declare const validateNetworkIOCs: (iocs: ThreatIndicator[], flows: NetworkFlow[]) => Promise<any[]>;
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
export declare const analyzeTrafficPatterns: (flows: NetworkFlow[], options?: {
    timeWindow?: number;
    enableBaseline?: boolean;
}) => Promise<TrafficPattern[]>;
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
export declare const calculateTrafficBaseline: (historicalFlows: NetworkFlow[]) => Promise<any>;
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
export declare const detectTrafficAnomalies: (flows: NetworkFlow[], baseline: any) => Promise<any[]>;
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
export declare const generateTrafficReport: (flows: NetworkFlow[], options?: {
    format?: "json" | "text" | "html";
    includeCharts?: boolean;
}) => Promise<any>;
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
export declare const integrateNetworkThreatIntel: (flows: NetworkFlow[], threatIntel: NetworkThreatIntel[]) => Promise<any[]>;
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
export declare const queryNetworkThreatIntel: (indicators: string[], providers: string[]) => Promise<any[]>;
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
export declare const updateNetworkThreatIntelCache: (newIntel: NetworkThreatIntel[]) => Promise<void>;
//# sourceMappingURL=network-traffic-analysis-kit.d.ts.map