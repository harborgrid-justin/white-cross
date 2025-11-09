/**
 * LOC: FORENSIC001
 * File: /reuse/threat/forensic-threat-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/graphql
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Digital forensics services
 *   - Incident response modules
 *   - Evidence management services
 *   - Threat investigation services
 *   - Legal compliance services
 *   - Healthcare security forensics orchestration
 */
/**
 * Forensic evidence types
 */
export declare enum ForensicEvidenceType {
    DISK_IMAGE = "DISK_IMAGE",
    MEMORY_DUMP = "MEMORY_DUMP",
    NETWORK_CAPTURE = "NETWORK_CAPTURE",
    LOG_FILE = "LOG_FILE",
    FILE_SYSTEM = "FILE_SYSTEM",
    DATABASE = "DATABASE",
    EMAIL = "EMAIL",
    MOBILE_DEVICE = "MOBILE_DEVICE",
    CLOUD_DATA = "CLOUD_DATA",
    REGISTRY = "REGISTRY",
    BROWSER_HISTORY = "BROWSER_HISTORY",
    APPLICATION_DATA = "APPLICATION_DATA"
}
/**
 * Forensic investigation status
 */
export declare enum ForensicInvestigationStatus {
    INITIATED = "INITIATED",
    EVIDENCE_COLLECTION = "EVIDENCE_COLLECTION",
    ANALYSIS = "ANALYSIS",
    CORRELATION = "CORRELATION",
    REPORTING = "REPORTING",
    COMPLETED = "COMPLETED",
    SUSPENDED = "SUSPENDED",
    CLOSED = "CLOSED"
}
/**
 * Evidence integrity status
 */
export declare enum EvidenceIntegrityStatus {
    VERIFIED = "VERIFIED",
    COMPROMISED = "COMPROMISED",
    PENDING = "PENDING",
    FAILED = "FAILED"
}
/**
 * Forensic analysis priority
 */
export declare enum ForensicPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Digital evidence record
 */
export interface DigitalEvidence {
    id: string;
    investigationId: string;
    evidenceType: ForensicEvidenceType;
    sourceName: string;
    sourceLocation: string;
    collectedBy: string;
    collectedAt: Date;
    description: string;
    hashMD5: string;
    hashSHA1: string;
    hashSHA256: string;
    fileSize: number;
    encrypted: boolean;
    encryptionMethod?: string;
    integrity: EvidenceIntegrityStatus;
    chainOfCustody: ChainOfCustodyEntry[];
    storageLocation: string;
    retentionPolicy?: string;
    legalHold: boolean;
    tags: string[];
    metadata?: Record<string, any>;
    relatedEvidence: string[];
    analysisResults?: ForensicAnalysisResult[];
}
/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
    timestamp: Date;
    action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'accessed' | 'disposed';
    performedBy: string;
    location: string;
    purpose: string;
    hashVerification?: {
        verified: boolean;
        hashValue: string;
    };
    notes?: string;
}
/**
 * Forensic investigation case
 */
export interface ForensicInvestigation {
    id: string;
    caseNumber: string;
    title: string;
    description: string;
    priority: ForensicPriority;
    status: ForensicInvestigationStatus;
    investigator: string;
    teamMembers: string[];
    initiatedAt: Date;
    targetCompletionDate?: Date;
    completedAt?: Date;
    incidentDate?: Date;
    affectedSystems: string[];
    affectedUsers: string[];
    evidenceCollected: string[];
    timelineEvents: ForensicTimelineEvent[];
    findings: string[];
    recommendations: string[];
    reportGenerated: boolean;
    reportUrl?: string;
    legalInvolvement: boolean;
    complianceFrameworks: string[];
    metadata?: Record<string, any>;
}
/**
 * Forensic timeline event
 */
export interface ForensicTimelineEvent {
    id: string;
    timestamp: Date;
    eventType: string;
    source: string;
    description: string;
    artifact: string;
    significance: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    iocRelated: boolean;
    iocs?: string[];
    correlatedEvents?: string[];
    evidenceId?: string;
    metadata?: Record<string, any>;
}
/**
 * Memory forensics result
 */
export interface MemoryForensicsResult {
    id: string;
    evidenceId: string;
    memoryDumpPath: string;
    dumpSize: number;
    analysisDate: Date;
    tool: 'volatility' | 'rekall' | 'memoryze' | 'redline' | 'custom';
    operatingSystem: string;
    processes: ProcessInfo[];
    networkConnections: NetworkConnectionInfo[];
    loadedModules: LoadedModuleInfo[];
    registryKeys: RegistryKeyInfo[];
    suspiciousArtifacts: SuspiciousArtifact[];
    injectedCode: InjectedCodeInfo[];
    malwareIndicators: string[];
    timeline: MemoryTimelineEvent[];
    metadata?: Record<string, any>;
}
/**
 * Process information from memory
 */
export interface ProcessInfo {
    pid: number;
    name: string;
    path: string;
    commandLine: string;
    parentPid: number;
    createTime: Date;
    exitTime?: Date;
    threads: number;
    handles: number;
    suspicious: boolean;
    suspicionReasons?: string[];
    hashSHA256?: string;
}
/**
 * Network connection from memory
 */
export interface NetworkConnectionInfo {
    protocol: 'TCP' | 'UDP';
    localAddress: string;
    localPort: number;
    remoteAddress: string;
    remotePort: number;
    state: string;
    pid: number;
    processName: string;
    createTime?: Date;
    suspicious: boolean;
}
/**
 * Loaded module information
 */
export interface LoadedModuleInfo {
    baseAddress: string;
    size: number;
    moduleName: string;
    path: string;
    pid: number;
    processName: string;
    signed: boolean;
    suspicious: boolean;
}
/**
 * Registry key information
 */
export interface RegistryKeyInfo {
    keyPath: string;
    valueName: string;
    valueData: string;
    valueType: string;
    lastWriteTime: Date;
    suspicious: boolean;
}
/**
 * Suspicious artifact
 */
export interface SuspiciousArtifact {
    type: string;
    description: string;
    severity: ForensicPriority;
    location: string;
    indicators: string[];
}
/**
 * Injected code information
 */
export interface InjectedCodeInfo {
    pid: number;
    processName: string;
    injectionType: string;
    baseAddress: string;
    size: number;
    protection: string;
    suspicious: boolean;
}
/**
 * Memory timeline event
 */
export interface MemoryTimelineEvent {
    timestamp: Date;
    eventType: string;
    process: string;
    description: string;
}
/**
 * Disk forensics result
 */
export interface DiskForensicsResult {
    id: string;
    evidenceId: string;
    imagePath: string;
    imageSize: number;
    analysisDate: Date;
    tool: 'autopsy' | 'ftk' | 'encase' | 'sleuthkit' | 'x-ways';
    fileSystem: string;
    partitions: PartitionInfo[];
    filesAnalyzed: number;
    deletedFilesRecovered: number;
    suspiciousFiles: SuspiciousFileInfo[];
    timelineEvents: DiskTimelineEvent[];
    fileCarving: FileCarvingResult[];
    hashMatches: HashMatchResult[];
    metadata?: Record<string, any>;
}
/**
 * Partition information
 */
export interface PartitionInfo {
    partitionNumber: number;
    fileSystem: string;
    size: number;
    startSector: number;
    description: string;
}
/**
 * Suspicious file information
 */
export interface SuspiciousFileInfo {
    path: string;
    fileName: string;
    fileSize: number;
    created: Date;
    modified: Date;
    accessed: Date;
    deleted: boolean;
    hashMD5: string;
    hashSHA256: string;
    fileType: string;
    suspicionReasons: string[];
    malwareScore: number;
    virusTotalResults?: {
        detected: number;
        total: number;
        link: string;
    };
}
/**
 * Disk timeline event
 */
export interface DiskTimelineEvent {
    timestamp: Date;
    eventType: 'created' | 'modified' | 'accessed' | 'deleted' | 'renamed';
    filePath: string;
    description: string;
    user?: string;
}
/**
 * File carving result
 */
export interface FileCarvingResult {
    offset: number;
    fileType: string;
    size: number;
    recovered: boolean;
    outputPath?: string;
    hashSHA256?: string;
}
/**
 * Hash match result
 */
export interface HashMatchResult {
    filePath: string;
    hashValue: string;
    hashType: 'MD5' | 'SHA1' | 'SHA256';
    matchSource: string;
    category: 'known_good' | 'known_bad' | 'unknown';
}
/**
 * Network forensics result
 */
export interface NetworkForensicsResult {
    id: string;
    evidenceId: string;
    captureFile: string;
    captureSize: number;
    analysisDate: Date;
    tool: 'wireshark' | 'tcpdump' | 'networkminer' | 'zeek' | 'suricata';
    duration: number;
    packets: number;
    protocols: ProtocolStatistics[];
    conversations: NetworkConversation[];
    suspiciousConnections: SuspiciousConnection[];
    extractedFiles: ExtractedFile[];
    dnsQueries: DNSQuery[];
    httpRequests: HTTPRequest[];
    encryptedTraffic: EncryptedTrafficInfo[];
    indicators: NetworkIndicator[];
    metadata?: Record<string, any>;
}
/**
 * Protocol statistics
 */
export interface ProtocolStatistics {
    protocol: string;
    packetCount: number;
    byteCount: number;
    percentage: number;
}
/**
 * Network conversation
 */
export interface NetworkConversation {
    sourceIP: string;
    sourcePort: number;
    destinationIP: string;
    destinationPort: number;
    protocol: string;
    packets: number;
    bytes: number;
    startTime: Date;
    endTime: Date;
    suspicious: boolean;
}
/**
 * Suspicious network connection
 */
export interface SuspiciousConnection {
    sourceIP: string;
    destinationIP: string;
    destinationPort: number;
    protocol: string;
    reason: string;
    severity: ForensicPriority;
    threatIntel?: {
        category: string;
        confidence: number;
        source: string;
    };
}
/**
 * Extracted file from network capture
 */
export interface ExtractedFile {
    fileName: string;
    fileType: string;
    size: number;
    hashSHA256: string;
    source: string;
    destination: string;
    extractedPath: string;
    malicious: boolean;
}
/**
 * DNS query information
 */
export interface DNSQuery {
    timestamp: Date;
    sourceIP: string;
    queryName: string;
    queryType: string;
    responseIP?: string;
    suspicious: boolean;
}
/**
 * HTTP request information
 */
export interface HTTPRequest {
    timestamp: Date;
    method: string;
    url: string;
    host: string;
    userAgent: string;
    statusCode?: number;
    suspicious: boolean;
}
/**
 * Encrypted traffic information
 */
export interface EncryptedTrafficInfo {
    protocol: string;
    sourceIP: string;
    destinationIP: string;
    bytes: number;
    tlsVersion?: string;
    cipher?: string;
    serverName?: string;
}
/**
 * Network indicator
 */
export interface NetworkIndicator {
    type: 'ip' | 'domain' | 'url' | 'email';
    value: string;
    firstSeen: Date;
    lastSeen: Date;
    occurrences: number;
    threatLevel: ForensicPriority;
}
/**
 * Forensic analysis result
 */
export interface ForensicAnalysisResult {
    id: string;
    evidenceId: string;
    analysisType: 'memory' | 'disk' | 'network' | 'log' | 'malware' | 'timeline' | 'correlation';
    analyst: string;
    startTime: Date;
    endTime: Date;
    toolsUsed: string[];
    findings: string[];
    artifacts: string[];
    iocs: string[];
    recommendations: string[];
    confidence: number;
    metadata?: Record<string, any>;
}
/**
 * Forensic artifact
 */
export interface ForensicArtifact {
    id: string;
    investigationId: string;
    artifactType: string;
    name: string;
    description: string;
    source: string;
    collectedAt: Date;
    data: string | Record<string, any>;
    significance: 'critical' | 'high' | 'medium' | 'low';
    relatedEvidence: string[];
    analysisNotes?: string;
    metadata?: Record<string, any>;
}
/**
 * Forensic report
 */
export interface ForensicReport {
    id: string;
    investigationId: string;
    caseNumber: string;
    reportType: 'preliminary' | 'interim' | 'final' | 'expert_witness';
    title: string;
    generatedBy: string;
    generatedAt: Date;
    executive_summary: string;
    methodology: string;
    findings: ReportFinding[];
    timeline: ForensicTimelineEvent[];
    evidenceList: string[];
    conclusions: string[];
    recommendations: string[];
    appendices: ReportAppendix[];
    legalDisclosure?: string;
    metadata?: Record<string, any>;
}
/**
 * Report finding
 */
export interface ReportFinding {
    findingNumber: number;
    title: string;
    description: string;
    severity: ForensicPriority;
    evidence: string[];
    analysis: string;
    impact: string;
    recommendation: string;
}
/**
 * Report appendix
 */
export interface ReportAppendix {
    title: string;
    content: string;
    type: 'evidence_log' | 'tool_output' | 'timeline' | 'diagram' | 'other';
}
/**
 * Evidence correlation result
 */
export interface EvidenceCorrelation {
    id: string;
    investigationId: string;
    evidenceIds: string[];
    correlationType: 'temporal' | 'network' | 'process' | 'file' | 'user' | 'ioc';
    description: string;
    confidence: number;
    timelineEvents: string[];
    significance: 'critical' | 'high' | 'medium' | 'low';
    findings: string[];
    metadata?: Record<string, any>;
}
/**
 * Collects digital evidence from a source.
 *
 * @param {object} source - Evidence source information
 * @param {string} investigationId - Investigation identifier
 * @param {string} collectedBy - Collector identifier
 * @returns {Promise<DigitalEvidence>} Collected evidence record
 */
export declare function collectDigitalEvidence(source: {
    type: ForensicEvidenceType;
    name: string;
    location: string;
    description: string;
}, investigationId: string, collectedBy: string): Promise<DigitalEvidence>;
/**
 * Preserves evidence integrity with cryptographic hashing.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} evidencePath - Path to evidence file
 * @returns {Promise<object>} Preservation verification result
 */
export declare function preserveEvidenceIntegrity(evidenceId: string, evidencePath: string): Promise<{
    evidenceId: string;
    preserved: boolean;
    hashMD5: string;
    hashSHA1: string;
    hashSHA256: string;
    timestamp: Date;
    writeProtected: boolean;
}>;
/**
 * Creates forensic disk image.
 *
 * @param {string} sourceDisk - Source disk identifier
 * @param {string} outputPath - Output path for image
 * @param {object} options - Imaging options
 * @returns {Promise<object>} Imaging result
 */
export declare function createForensicDiskImage(sourceDisk: string, outputPath: string, options?: {
    compressionEnabled?: boolean;
    verifyAfterImaging?: boolean;
    imageFormat?: 'dd' | 'e01' | 'aff';
}): Promise<{
    success: boolean;
    imagePath: string;
    imageSize: number;
    hashSHA256: string;
    verified: boolean;
    duration: number;
}>;
/**
 * Creates memory dump for forensic analysis.
 *
 * @param {string} targetSystem - Target system identifier
 * @param {string} outputPath - Output path for memory dump
 * @returns {Promise<object>} Memory dump result
 */
export declare function createMemoryDump(targetSystem: string, outputPath: string): Promise<{
    success: boolean;
    dumpPath: string;
    dumpSize: number;
    hashSHA256: string;
    timestamp: Date;
    systemInfo: {
        os: string;
        architecture: string;
        memory: number;
    };
}>;
/**
 * Captures network traffic for forensic analysis.
 *
 * @param {string} networkInterface - Network interface to capture
 * @param {number} duration - Capture duration in seconds
 * @param {string} outputPath - Output path for capture file
 * @returns {Promise<object>} Network capture result
 */
export declare function captureNetworkTraffic(networkInterface: string, duration: number, outputPath: string): Promise<{
    success: boolean;
    capturePath: string;
    captureSize: number;
    packets: number;
    hashSHA256: string;
    startTime: Date;
    endTime: Date;
}>;
/**
 * Records chain of custody transfer.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {object} transfer - Transfer details
 * @returns {Promise<ChainOfCustodyEntry>} Chain of custody entry
 */
export declare function recordChainOfCustody(evidenceId: string, transfer: {
    action: ChainOfCustodyEntry['action'];
    performedBy: string;
    location: string;
    purpose: string;
    hashValue?: string;
}): Promise<ChainOfCustodyEntry>;
/**
 * Verifies evidence integrity in chain of custody.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {string} currentHash - Current hash value
 * @param {string} originalHash - Original hash value
 * @returns {Promise<object>} Verification result
 */
export declare function verifyEvidenceIntegrity(evidenceId: string, currentHash: string, originalHash: string): Promise<{
    evidenceId: string;
    verified: boolean;
    currentHash: string;
    originalHash: string;
    timestamp: Date;
    status: EvidenceIntegrityStatus;
}>;
/**
 * Generates chain of custody report.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {ChainOfCustodyEntry[]} entries - Chain of custody entries
 * @returns {Promise<object>} Chain of custody report
 */
export declare function generateChainOfCustodyReport(evidenceId: string, entries: ChainOfCustodyEntry[]): Promise<{
    evidenceId: string;
    reportId: string;
    generatedAt: Date;
    totalEntries: number;
    timeline: ChainOfCustodyEntry[];
    integrityVerified: boolean;
    report: string;
}>;
/**
 * Manages evidence storage and retention.
 *
 * @param {string} evidenceId - Evidence identifier
 * @param {object} storage - Storage configuration
 * @returns {Promise<object>} Storage management result
 */
export declare function manageEvidenceStorage(evidenceId: string, storage: {
    location: string;
    retentionPeriod: number;
    encryptionEnabled: boolean;
    backupEnabled: boolean;
}): Promise<{
    evidenceId: string;
    storageLocation: string;
    encrypted: boolean;
    retentionExpiry: Date;
    backupLocations: string[];
}>;
/**
 * Constructs forensic timeline from multiple sources.
 *
 * @param {string} investigationId - Investigation identifier
 * @param {string[]} evidenceIds - Evidence identifiers to include
 * @returns {Promise<ForensicTimelineEvent[]>} Timeline events
 */
export declare function constructForensicTimeline(investigationId: string, evidenceIds: string[]): Promise<ForensicTimelineEvent[]>;
/**
 * Correlates timeline events across evidence sources.
 *
 * @param {ForensicTimelineEvent[]} events - Timeline events
 * @param {number} timeWindow - Time window for correlation in milliseconds
 * @returns {Promise<object[]>} Correlated event groups
 */
export declare function correlateTimelineEvents(events: ForensicTimelineEvent[], timeWindow?: number): Promise<{
    groupId: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    events: ForensicTimelineEvent[];
    correlation: string;
    significance: 'critical' | 'high' | 'medium' | 'low';
}[]>;
/**
 * Identifies timeline anomalies and patterns.
 *
 * @param {ForensicTimelineEvent[]} events - Timeline events
 * @returns {Promise<object[]>} Detected anomalies
 */
export declare function identifyTimelineAnomalies(events: ForensicTimelineEvent[]): Promise<{
    anomalyType: string;
    description: string;
    events: string[];
    significance: ForensicPriority;
    recommendation: string;
}[]>;
/**
 * Visualizes forensic timeline.
 *
 * @param {ForensicTimelineEvent[]} events - Timeline events
 * @param {object} options - Visualization options
 * @returns {Promise<object>} Timeline visualization data
 */
export declare function visualizeForensicTimeline(events: ForensicTimelineEvent[], options?: {
    groupBy?: 'hour' | 'day' | 'source' | 'type';
    highlightIOCs?: boolean;
}): Promise<{
    visualization: string;
    data: {
        timestamp: string;
        events: number;
        critical: number;
    }[];
}>;
/**
 * Analyzes memory dump using Volatility framework.
 *
 * @param {string} memoryDumpPath - Path to memory dump
 * @param {string} profile - Memory profile (OS version)
 * @returns {Promise<MemoryForensicsResult>} Memory analysis results
 */
export declare function analyzeMemoryDump(memoryDumpPath: string, profile?: string): Promise<MemoryForensicsResult>;
/**
 * Extracts running processes from memory.
 *
 * @param {string} memoryDumpPath - Path to memory dump
 * @returns {Promise<ProcessInfo[]>} Process information
 */
export declare function extractMemoryProcesses(memoryDumpPath: string): Promise<ProcessInfo[]>;
/**
 * Identifies process injection in memory.
 *
 * @param {string} memoryDumpPath - Path to memory dump
 * @returns {Promise<InjectedCodeInfo[]>} Injected code findings
 */
export declare function identifyProcessInjection(memoryDumpPath: string): Promise<InjectedCodeInfo[]>;
/**
 * Analyzes memory strings for indicators.
 *
 * @param {string} memoryDumpPath - Path to memory dump
 * @param {number} minLength - Minimum string length
 * @returns {Promise<object[]>} Interesting strings found
 */
export declare function analyzeMemoryStrings(memoryDumpPath: string, minLength?: number): Promise<{
    offset: number;
    string: string;
    category: 'url' | 'ip' | 'email' | 'file_path' | 'registry' | 'command' | 'other';
    suspicious: boolean;
}[]>;
/**
 * Analyzes disk image for forensic evidence.
 *
 * @param {string} diskImagePath - Path to disk image
 * @param {object} options - Analysis options
 * @returns {Promise<DiskForensicsResult>} Disk analysis results
 */
export declare function analyzeDiskImage(diskImagePath: string, options?: {
    recoverDeleted?: boolean;
    fileCarving?: boolean;
    hashMatching?: boolean;
}): Promise<DiskForensicsResult>;
/**
 * Recovers deleted files from disk image.
 *
 * @param {string} diskImagePath - Path to disk image
 * @param {string} outputPath - Output path for recovered files
 * @returns {Promise<object[]>} Recovered files
 */
export declare function recoverDeletedFiles(diskImagePath: string, outputPath: string): Promise<{
    originalPath: string;
    recoveredPath: string;
    fileSize: number;
    hashSHA256: string;
    recoveryConfidence: number;
}[]>;
/**
 * Performs file carving on disk image.
 *
 * @param {string} diskImagePath - Path to disk image
 * @param {string[]} fileTypes - File types to carve
 * @returns {Promise<FileCarvingResult[]>} Carved file results
 */
export declare function performFileCarving(diskImagePath: string, fileTypes?: string[]): Promise<FileCarvingResult[]>;
/**
 * Analyzes Master File Table (MFT).
 *
 * @param {string} diskImagePath - Path to disk image
 * @returns {Promise<object>} MFT analysis results
 */
export declare function analyzeMFT(diskImagePath: string): Promise<{
    totalEntries: number;
    activeFiles: number;
    deletedFiles: number;
    timeline: DiskTimelineEvent[];
    anomalies: string[];
}>;
/**
 * Analyzes network packet capture.
 *
 * @param {string} pcapPath - Path to packet capture file
 * @param {object} filters - Analysis filters
 * @returns {Promise<NetworkForensicsResult>} Network analysis results
 */
export declare function analyzeNetworkCapture(pcapPath: string, filters?: {
    protocols?: string[];
    suspiciousOnly?: boolean;
}): Promise<NetworkForensicsResult>;
/**
 * Extracts files from network capture.
 *
 * @param {string} pcapPath - Path to packet capture file
 * @param {string} outputPath - Output path for extracted files
 * @returns {Promise<ExtractedFile[]>} Extracted files
 */
export declare function extractNetworkFiles(pcapPath: string, outputPath: string): Promise<ExtractedFile[]>;
/**
 * Identifies beaconing activity in network traffic.
 *
 * @param {string} pcapPath - Path to packet capture file
 * @returns {Promise<object[]>} Beaconing patterns detected
 */
export declare function identifyBeaconingActivity(pcapPath: string): Promise<{
    sourceIP: string;
    destinationIP: string;
    destinationPort: number;
    interval: number;
    regularity: number;
    beaconCount: number;
    suspicious: boolean;
    confidence: number;
}[]>;
/**
 * Correlates network activity with system events.
 *
 * @param {NetworkForensicsResult} networkData - Network forensics data
 * @param {ForensicTimelineEvent[]} systemEvents - System timeline events
 * @returns {Promise<EvidenceCorrelation[]>} Correlation results
 */
export declare function correlateNetworkAndSystem(networkData: NetworkForensicsResult, systemEvents: ForensicTimelineEvent[]): Promise<EvidenceCorrelation[]>;
/**
 * Analyzes Windows registry artifacts.
 *
 * @param {string} registryPath - Path to registry hive
 * @returns {Promise<object[]>} Registry analysis results
 */
export declare function analyzeRegistryArtifacts(registryPath: string): Promise<{
    hiveName: string;
    keyPath: string;
    suspicious: boolean;
    findings: string[];
    lastModified: Date;
}[]>;
/**
 * Analyzes browser history and artifacts.
 *
 * @param {string} profilePath - Browser profile path
 * @returns {Promise<object>} Browser artifacts
 */
export declare function analyzeBrowserArtifacts(profilePath: string): Promise<{
    browser: string;
    historyEntries: number;
    downloads: {
        url: string;
        path: string;
        timestamp: Date;
        suspicious: boolean;
    }[];
    cookies: number;
    cache: {
        totalItems: number;
        suspiciousUrls: string[];
    };
}>;
/**
 * Analyzes email artifacts.
 *
 * @param {string} mailboxPath - Path to mailbox file
 * @returns {Promise<object[]>} Email analysis results
 */
export declare function analyzeEmailArtifacts(mailboxPath: string): Promise<{
    messageId: string;
    subject: string;
    from: string;
    to: string;
    timestamp: Date;
    attachments: {
        fileName: string;
        hashSHA256: string;
        malicious: boolean;
    }[];
    suspicious: boolean;
    phishingIndicators: string[];
}[]>;
/**
 * Analyzes system logs for forensic evidence.
 *
 * @param {string} logPath - Path to log files
 * @param {string} logType - Type of logs (Windows Event, Syslog, etc.)
 * @returns {Promise<object[]>} Log analysis results
 */
export declare function analyzeSystemLogs(logPath: string, logType: 'windows_event' | 'syslog' | 'application' | 'security'): Promise<{
    timestamp: Date;
    eventId?: number;
    severity: string;
    source: string;
    message: string;
    suspicious: boolean;
    category: string;
}[]>;
/**
 * Generates forensic investigation report.
 *
 * @param {string} investigationId - Investigation identifier
 * @param {object} reportData - Report data
 * @returns {Promise<ForensicReport>} Generated report
 */
export declare function generateForensicReport(investigationId: string, reportData: {
    caseNumber: string;
    reportType: ForensicReport['reportType'];
    investigator: string;
    findings: ReportFinding[];
    conclusions: string[];
    recommendations: string[];
}): Promise<ForensicReport>;
/**
 * Creates executive summary of forensic investigation.
 *
 * @param {ForensicInvestigation} investigation - Investigation data
 * @returns {Promise<string>} Executive summary
 */
export declare function createExecutiveSummary(investigation: ForensicInvestigation): Promise<string>;
/**
 * Generates technical forensic analysis document.
 *
 * @param {string} investigationId - Investigation identifier
 * @param {ForensicAnalysisResult[]} analyses - Analysis results
 * @returns {Promise<string>} Technical document
 */
export declare function generateTechnicalAnalysis(investigationId: string, analyses: ForensicAnalysisResult[]): Promise<string>;
/**
 * Creates forensic timeline report.
 *
 * @param {ForensicTimelineEvent[]} events - Timeline events
 * @returns {Promise<string>} Timeline report
 */
export declare function createTimelineReport(events: ForensicTimelineEvent[]): Promise<string>;
/**
 * Creates new forensic investigation case.
 *
 * @param {object} caseData - Investigation case data
 * @returns {Promise<ForensicInvestigation>} Created investigation
 */
export declare function createForensicInvestigation(caseData: {
    title: string;
    description: string;
    priority: ForensicPriority;
    investigator: string;
    affectedSystems: string[];
}): Promise<ForensicInvestigation>;
/**
 * Updates investigation status and findings.
 *
 * @param {string} investigationId - Investigation identifier
 * @param {object} updates - Investigation updates
 * @returns {Promise<ForensicInvestigation>} Updated investigation
 */
export declare function updateForensicInvestigation(investigationId: string, updates: {
    status?: ForensicInvestigationStatus;
    findings?: string[];
    recommendations?: string[];
}): Promise<ForensicInvestigation>;
/**
 * Closes forensic investigation.
 *
 * @param {string} investigationId - Investigation identifier
 * @param {string} closureNotes - Closure notes
 * @returns {Promise<ForensicInvestigation>} Closed investigation
 */
export declare function closeForensicInvestigation(investigationId: string, closureNotes: string): Promise<ForensicInvestigation>;
/**
 * Sequelize model attributes for DigitalEvidence.
 */
export declare function getDigitalEvidenceModelAttributes(): Record<string, any>;
/**
 * Sequelize model attributes for ForensicInvestigation.
 */
export declare function getForensicInvestigationModelAttributes(): Record<string, any>;
/**
 * Sequelize model attributes for ForensicTimelineEvent.
 */
export declare function getForensicTimelineEventModelAttributes(): Record<string, any>;
/**
 * GraphQL schema for forensic threat analysis.
 */
export declare function getForensicGraphQLSchema(): string;
/**
 * NestJS GraphQL resolver example for forensic queries.
 */
export declare function getForensicGraphQLResolverTemplate(): string;
/**
 * NestJS Controller for Forensic Threat Analysis API.
 */
export declare function defineForensicController(): string;
declare const _default: {
    collectDigitalEvidence: typeof collectDigitalEvidence;
    preserveEvidenceIntegrity: typeof preserveEvidenceIntegrity;
    createForensicDiskImage: typeof createForensicDiskImage;
    createMemoryDump: typeof createMemoryDump;
    captureNetworkTraffic: typeof captureNetworkTraffic;
    recordChainOfCustody: typeof recordChainOfCustody;
    verifyEvidenceIntegrity: typeof verifyEvidenceIntegrity;
    generateChainOfCustodyReport: typeof generateChainOfCustodyReport;
    manageEvidenceStorage: typeof manageEvidenceStorage;
    constructForensicTimeline: typeof constructForensicTimeline;
    correlateTimelineEvents: typeof correlateTimelineEvents;
    identifyTimelineAnomalies: typeof identifyTimelineAnomalies;
    visualizeForensicTimeline: typeof visualizeForensicTimeline;
    analyzeMemoryDump: typeof analyzeMemoryDump;
    extractMemoryProcesses: typeof extractMemoryProcesses;
    identifyProcessInjection: typeof identifyProcessInjection;
    analyzeMemoryStrings: typeof analyzeMemoryStrings;
    analyzeDiskImage: typeof analyzeDiskImage;
    recoverDeletedFiles: typeof recoverDeletedFiles;
    performFileCarving: typeof performFileCarving;
    analyzeMFT: typeof analyzeMFT;
    analyzeNetworkCapture: typeof analyzeNetworkCapture;
    extractNetworkFiles: typeof extractNetworkFiles;
    identifyBeaconingActivity: typeof identifyBeaconingActivity;
    correlateNetworkAndSystem: typeof correlateNetworkAndSystem;
    analyzeRegistryArtifacts: typeof analyzeRegistryArtifacts;
    analyzeBrowserArtifacts: typeof analyzeBrowserArtifacts;
    analyzeEmailArtifacts: typeof analyzeEmailArtifacts;
    analyzeSystemLogs: typeof analyzeSystemLogs;
    generateForensicReport: typeof generateForensicReport;
    createExecutiveSummary: typeof createExecutiveSummary;
    generateTechnicalAnalysis: typeof generateTechnicalAnalysis;
    createTimelineReport: typeof createTimelineReport;
    createForensicInvestigation: typeof createForensicInvestigation;
    updateForensicInvestigation: typeof updateForensicInvestigation;
    closeForensicInvestigation: typeof closeForensicInvestigation;
    getDigitalEvidenceModelAttributes: typeof getDigitalEvidenceModelAttributes;
    getForensicInvestigationModelAttributes: typeof getForensicInvestigationModelAttributes;
    getForensicTimelineEventModelAttributes: typeof getForensicTimelineEventModelAttributes;
    getForensicGraphQLSchema: typeof getForensicGraphQLSchema;
    getForensicGraphQLResolverTemplate: typeof getForensicGraphQLResolverTemplate;
    defineForensicController: typeof defineForensicController;
};
export default _default;
//# sourceMappingURL=forensic-threat-analysis-kit.d.ts.map