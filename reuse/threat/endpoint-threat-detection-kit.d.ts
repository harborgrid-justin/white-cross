/**
 * LOC: ENDPOINTEDR001
 * File: /reuse/threat/endpoint-threat-detection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - os (Node.js built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Endpoint security monitoring services
 *   - EDR (Endpoint Detection and Response) modules
 *   - Host-based intrusion detection systems
 *   - Endpoint forensics services
 *   - Process monitoring services
 *   - File integrity monitoring services
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
 *       description: API key for endpoint monitoring services
 *   schemas:
 *     EndpointTelemetry:
 *       type: object
 *       required:
 *         - endpointId
 *         - hostname
 *         - osType
 *         - timestamp
 *       properties:
 *         endpointId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the endpoint
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         hostname:
 *           type: string
 *           description: Endpoint hostname
 *           example: "workstation-001"
 *         osType:
 *           type: string
 *           enum: [Windows, Linux, macOS, Unknown]
 *           description: Operating system type
 *           example: "Windows"
 *         osVersion:
 *           type: string
 *           description: Operating system version
 *           example: "Windows 10 Pro 22H2"
 *         ipAddress:
 *           type: string
 *           format: ipv4
 *           description: Primary IP address
 *           example: "192.168.1.100"
 *         macAddress:
 *           type: string
 *           description: MAC address
 *           example: "00:1A:2B:3C:4D:5E"
 *         cpuUsage:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: CPU usage percentage
 *           example: 45.5
 *         memoryUsage:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Memory usage percentage
 *           example: 65.2
 *         diskUsage:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Disk usage percentage
 *           example: 72.8
 *         processCount:
 *           type: integer
 *           description: Number of running processes
 *           example: 145
 *         networkConnections:
 *           type: integer
 *           description: Number of active network connections
 *           example: 23
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Telemetry collection timestamp
 *           example: "2025-11-09T12:00:00Z"
 *     ProcessBehavior:
 *       type: object
 *       required:
 *         - processId
 *         - processName
 *         - commandLine
 *       properties:
 *         processId:
 *           type: integer
 *           description: Process ID
 *           example: 1234
 *         processName:
 *           type: string
 *           description: Process executable name
 *           example: "powershell.exe"
 *         commandLine:
 *           type: string
 *           description: Full command line
 *           example: "powershell.exe -ExecutionPolicy Bypass -File script.ps1"
 *         parentProcessId:
 *           type: integer
 *           description: Parent process ID
 *           example: 5678
 *         userName:
 *           type: string
 *           description: User running the process
 *           example: "DOMAIN\\user"
 *         suspiciousScore:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Calculated suspicion score
 *           example: 75.5
 */
/**
 * Operating system types
 */
export declare enum OSType {
    WINDOWS = "Windows",
    LINUX = "Linux",
    MACOS = "macOS",
    UNKNOWN = "Unknown"
}
/**
 * Endpoint telemetry data
 */
export interface EndpointTelemetry {
    endpointId: string;
    hostname: string;
    osType: OSType;
    osVersion: string;
    osBuild?: string;
    ipAddress: string;
    macAddress: string;
    cpuUsage: number;
    memoryUsage: number;
    memoryTotal: number;
    memoryAvailable: number;
    diskUsage: number;
    diskTotal: number;
    diskFree: number;
    processCount: number;
    networkConnections: number;
    uptime: number;
    lastBootTime: Date;
    agentVersion?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Process behavior information
 */
export interface ProcessBehavior {
    processId: number;
    processName: string;
    executablePath: string;
    commandLine: string;
    parentProcessId: number;
    parentProcessName?: string;
    userName: string;
    domain?: string;
    startTime: Date;
    cpuUsage: number;
    memoryUsage: number;
    threadCount: number;
    handleCount: number;
    fileHash?: string;
    digitalSignature?: DigitalSignature;
    networkActivity?: ProcessNetworkActivity;
    fileActivity?: ProcessFileActivity;
    registryActivity?: ProcessRegistryActivity;
    suspiciousScore?: number;
    suspiciousIndicators?: string[];
    mitreAttack?: string[];
}
/**
 * Digital signature information
 */
export interface DigitalSignature {
    isSigned: boolean;
    isValid: boolean;
    issuer?: string;
    subject?: string;
    serialNumber?: string;
    thumbprint?: string;
    validFrom?: Date;
    validTo?: Date;
}
/**
 * Process network activity
 */
export interface ProcessNetworkActivity {
    connections: NetworkConnection[];
    dnsQueries: string[];
    bytesReceived: number;
    bytesSent: number;
}
/**
 * Network connection
 */
export interface NetworkConnection {
    protocol: 'TCP' | 'UDP';
    localAddress: string;
    localPort: number;
    remoteAddress: string;
    remotePort: number;
    state: string;
    timestamp: Date;
}
/**
 * Process file activity
 */
export interface ProcessFileActivity {
    filesRead: string[];
    filesWritten: string[];
    filesDeleted: string[];
    filesRenamed: Array<{
        from: string;
        to: string;
    }>;
    filesExecuted: string[];
}
/**
 * Process registry activity (Windows)
 */
export interface ProcessRegistryActivity {
    keysRead: string[];
    keysWritten: string[];
    keysDeleted: string[];
    valuesModified: Array<{
        key: string;
        value: string;
        data: any;
    }>;
}
/**
 * File integrity monitoring entry
 */
export interface FileIntegrityEntry {
    filePath: string;
    fileName: string;
    fileHash: string;
    hashAlgorithm: 'MD5' | 'SHA1' | 'SHA256';
    fileSize: number;
    permissions: string;
    owner: string;
    group?: string;
    createdTime: Date;
    modifiedTime: Date;
    accessedTime: Date;
    previousHash?: string;
    changeType?: 'CREATED' | 'MODIFIED' | 'DELETED' | 'RENAMED' | 'PERMISSIONS_CHANGED';
    changeTimestamp?: Date;
    isSuspicious?: boolean;
    suspicionReasons?: string[];
}
/**
 * Registry monitoring entry (Windows)
 */
export interface RegistryMonitorEntry {
    registryPath: string;
    keyName: string;
    valueName?: string;
    valueType?: string;
    valueData?: any;
    previousData?: any;
    changeType: 'KEY_CREATED' | 'KEY_DELETED' | 'VALUE_CREATED' | 'VALUE_MODIFIED' | 'VALUE_DELETED';
    changeTimestamp: Date;
    processId?: number;
    processName?: string;
    userName?: string;
    isSuspicious?: boolean;
    suspicionReasons?: string[];
    mitreAttack?: string[];
}
/**
 * Kernel-level event
 */
export interface KernelEvent {
    eventId: string;
    eventType: KernelEventType;
    timestamp: Date;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    processId?: number;
    threadId?: number;
    details: Record<string, any>;
    stackTrace?: string[];
    mitreAttack?: string[];
}
/**
 * Kernel event types
 */
export declare enum KernelEventType {
    DRIVER_LOAD = "DRIVER_LOAD",
    DRIVER_UNLOAD = "DRIVER_UNLOAD",
    KERNEL_MODULE_LOAD = "KERNEL_MODULE_LOAD",
    ROOTKIT_DETECTION = "ROOTKIT_DETECTION",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    KERNEL_MEMORY_ACCESS = "KERNEL_MEMORY_ACCESS",
    SYSTEM_CALL_HOOK = "SYSTEM_CALL_HOOK",
    PROCESS_INJECTION = "PROCESS_INJECTION",
    CODE_INJECTION = "CODE_INJECTION",
    DLL_INJECTION = "DLL_INJECTION"
}
/**
 * Memory analysis result
 */
export interface MemoryAnalysis {
    analysisId: string;
    processId: number;
    processName: string;
    timestamp: Date;
    memoryRegions: MemoryRegion[];
    injectedCode?: InjectedCode[];
    suspiciousStrings?: string[];
    shellcodeDetected?: boolean;
    encryptedRegions?: number;
    executableRegions?: number;
    threatScore: number;
    findings: MemoryFinding[];
}
/**
 * Memory region
 */
export interface MemoryRegion {
    baseAddress: string;
    size: number;
    protection: string;
    type: string;
    state: string;
    isExecutable: boolean;
    isWritable: boolean;
    entropy?: number;
}
/**
 * Injected code detection
 */
export interface InjectedCode {
    address: string;
    size: number;
    type: 'SHELLCODE' | 'DLL' | 'CODE_CAVE' | 'UNKNOWN';
    confidence: number;
    signature?: string;
}
/**
 * Memory finding
 */
export interface MemoryFinding {
    findingType: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    address?: string;
    evidence: string[];
    mitreAttack?: string[];
}
/**
 * Endpoint IOC
 */
export interface EndpointIOC {
    iocType: 'FILE_HASH' | 'FILE_PATH' | 'REGISTRY_KEY' | 'MUTEX' | 'IP_ADDRESS' | 'DOMAIN' | 'PROCESS_NAME';
    value: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    source: string;
    confidence: number;
    lastSeen: Date;
    threatType?: string;
    description?: string;
    metadata?: Record<string, any>;
}
/**
 * Endpoint threat response action
 */
export interface ThreatResponseAction {
    actionId: string;
    actionType: ResponseActionType;
    targetEndpointId: string;
    targetProcessId?: number;
    targetFilePath?: string;
    targetRegistryKey?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    result?: string;
    error?: string;
    timestamp: Date;
    executedBy: string;
    metadata?: Record<string, any>;
}
/**
 * Response action types
 */
export declare enum ResponseActionType {
    KILL_PROCESS = "KILL_PROCESS",
    QUARANTINE_FILE = "QUARANTINE_FILE",
    DELETE_FILE = "DELETE_FILE",
    BLOCK_NETWORK = "BLOCK_NETWORK",
    ISOLATE_ENDPOINT = "ISOLATE_ENDPOINT",
    COLLECT_FORENSICS = "COLLECT_FORENSICS",
    DELETE_REGISTRY_KEY = "DELETE_REGISTRY_KEY",
    RESTORE_FILE = "RESTORE_FILE",
    REBOOT_ENDPOINT = "REBOOT_ENDPOINT"
}
/**
 * Sequelize EndpointTelemetry model attributes.
 *
 * @swagger
 * components:
 *   schemas:
 *     EndpointTelemetryModel:
 *       type: object
 *       description: Database model for endpoint telemetry records
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         endpointId:
 *           type: string
 *         hostname:
 *           type: string
 *         osType:
 *           type: string
 *         cpuUsage:
 *           type: number
 *         memoryUsage:
 *           type: number
 *
 * @example
 * ```typescript
 * class EndpointTelemetry extends Model {}
 * EndpointTelemetry.init(getEndpointTelemetryModelAttributes(), {
 *   sequelize,
 *   tableName: 'endpoint_telemetry',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['endpointId', 'timestamp'] },
 *     { fields: ['hostname'] },
 *     { fields: ['osType'] }
 *   ]
 * });
 * ```
 */
export declare const getEndpointTelemetryModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    endpointId: {
        type: string;
        allowNull: boolean;
    };
    hostname: {
        type: string;
        allowNull: boolean;
    };
    osType: {
        type: string;
        allowNull: boolean;
    };
    osVersion: {
        type: string;
        allowNull: boolean;
    };
    osBuild: {
        type: string;
        allowNull: boolean;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    macAddress: {
        type: string;
        allowNull: boolean;
    };
    cpuUsage: {
        type: string;
        allowNull: boolean;
    };
    memoryUsage: {
        type: string;
        allowNull: boolean;
    };
    memoryTotal: {
        type: string;
        allowNull: boolean;
    };
    memoryAvailable: {
        type: string;
        allowNull: boolean;
    };
    diskUsage: {
        type: string;
        allowNull: boolean;
    };
    diskTotal: {
        type: string;
        allowNull: boolean;
    };
    diskFree: {
        type: string;
        allowNull: boolean;
    };
    processCount: {
        type: string;
        allowNull: boolean;
    };
    networkConnections: {
        type: string;
        allowNull: boolean;
    };
    uptime: {
        type: string;
        allowNull: boolean;
    };
    lastBootTime: {
        type: string;
        allowNull: boolean;
    };
    agentVersion: {
        type: string;
        allowNull: boolean;
    };
    timestamp: {
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
 * Sequelize ProcessBehavior model attributes.
 *
 * @example
 * ```typescript
 * class ProcessBehavior extends Model {}
 * ProcessBehavior.init(getProcessBehaviorModelAttributes(), {
 *   sequelize,
 *   tableName: 'process_behaviors',
 *   timestamps: true
 * });
 * ```
 */
export declare const getProcessBehaviorModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    processId: {
        type: string;
        allowNull: boolean;
    };
    processName: {
        type: string;
        allowNull: boolean;
    };
    executablePath: {
        type: string;
        allowNull: boolean;
    };
    commandLine: {
        type: string;
        allowNull: boolean;
    };
    parentProcessId: {
        type: string;
        allowNull: boolean;
    };
    parentProcessName: {
        type: string;
        allowNull: boolean;
    };
    userName: {
        type: string;
        allowNull: boolean;
    };
    domain: {
        type: string;
        allowNull: boolean;
    };
    startTime: {
        type: string;
        allowNull: boolean;
    };
    cpuUsage: {
        type: string;
        allowNull: boolean;
    };
    memoryUsage: {
        type: string;
        allowNull: boolean;
    };
    threadCount: {
        type: string;
        allowNull: boolean;
    };
    handleCount: {
        type: string;
        allowNull: boolean;
    };
    fileHash: {
        type: string;
        allowNull: boolean;
    };
    digitalSignature: {
        type: string;
        allowNull: boolean;
    };
    networkActivity: {
        type: string;
        allowNull: boolean;
    };
    fileActivity: {
        type: string;
        allowNull: boolean;
    };
    registryActivity: {
        type: string;
        allowNull: boolean;
    };
    suspiciousScore: {
        type: string;
        allowNull: boolean;
    };
    suspiciousIndicators: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
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
 * Sequelize FileIntegrity model attributes.
 *
 * @example
 * ```typescript
 * class FileIntegrity extends Model {}
 * FileIntegrity.init(getFileIntegrityModelAttributes(), {
 *   sequelize,
 *   tableName: 'file_integrity',
 *   timestamps: true
 * });
 * ```
 */
export declare const getFileIntegrityModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    filePath: {
        type: string;
        allowNull: boolean;
    };
    fileName: {
        type: string;
        allowNull: boolean;
    };
    fileHash: {
        type: string;
        allowNull: boolean;
    };
    hashAlgorithm: {
        type: string;
        allowNull: boolean;
    };
    fileSize: {
        type: string;
        allowNull: boolean;
    };
    permissions: {
        type: string;
        allowNull: boolean;
    };
    owner: {
        type: string;
        allowNull: boolean;
    };
    group: {
        type: string;
        allowNull: boolean;
    };
    createdTime: {
        type: string;
        allowNull: boolean;
    };
    modifiedTime: {
        type: string;
        allowNull: boolean;
    };
    accessedTime: {
        type: string;
        allowNull: boolean;
    };
    previousHash: {
        type: string;
        allowNull: boolean;
    };
    changeType: {
        type: string;
        allowNull: boolean;
    };
    changeTimestamp: {
        type: string;
        allowNull: boolean;
    };
    isSuspicious: {
        type: string;
        defaultValue: boolean;
    };
    suspicionReasons: {
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
 * Sequelize RegistryMonitor model attributes.
 *
 * @example
 * ```typescript
 * class RegistryMonitor extends Model {}
 * RegistryMonitor.init(getRegistryMonitorModelAttributes(), {
 *   sequelize,
 *   tableName: 'registry_monitors',
 *   timestamps: true
 * });
 * ```
 */
export declare const getRegistryMonitorModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    registryPath: {
        type: string;
        allowNull: boolean;
    };
    keyName: {
        type: string;
        allowNull: boolean;
    };
    valueName: {
        type: string;
        allowNull: boolean;
    };
    valueType: {
        type: string;
        allowNull: boolean;
    };
    valueData: {
        type: string;
        allowNull: boolean;
    };
    previousData: {
        type: string;
        allowNull: boolean;
    };
    changeType: {
        type: string;
        allowNull: boolean;
    };
    changeTimestamp: {
        type: string;
        allowNull: boolean;
    };
    processId: {
        type: string;
        allowNull: boolean;
    };
    processName: {
        type: string;
        allowNull: boolean;
    };
    userName: {
        type: string;
        allowNull: boolean;
    };
    isSuspicious: {
        type: string;
        defaultValue: boolean;
    };
    suspicionReasons: {
        type: string;
        defaultValue: never[];
    };
    mitreAttack: {
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
 * Collects comprehensive telemetry from an endpoint.
 *
 * @swagger
 * /api/endpoint/telemetry/collect:
 *   post:
 *     tags:
 *       - Endpoint Telemetry
 *     summary: Collect endpoint telemetry
 *     description: Gathers comprehensive system metrics and status information from endpoints
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endpointId
 *             properties:
 *               endpointId:
 *                 type: string
 *                 format: uuid
 *                 description: Endpoint identifier
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               includeProcessList:
 *                 type: boolean
 *                 default: false
 *               includeNetworkConnections:
 *                 type: boolean
 *                 default: false
 *           example:
 *             endpointId: "550e8400-e29b-41d4-a716-446655440000"
 *             includeProcessList: true
 *     responses:
 *       200:
 *         description: Telemetry collected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EndpointTelemetry'
 *             example:
 *               endpointId: "550e8400-e29b-41d4-a716-446655440000"
 *               hostname: "workstation-001"
 *               osType: "Windows"
 *               cpuUsage: 45.5
 *               memoryUsage: 65.2
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Endpoint not found
 *
 * @param {string} endpointId - Endpoint identifier
 * @param {object} [options] - Collection options
 * @returns {Promise<EndpointTelemetry>} Collected telemetry
 *
 * @example
 * ```typescript
 * const telemetry = await collectEndpointTelemetry('endpoint-001', {
 *   includeProcessList: true
 * });
 * console.log(`CPU: ${telemetry.cpuUsage}%, Memory: ${telemetry.memoryUsage}%`);
 * ```
 */
export declare const collectEndpointTelemetry: (endpointId: string, options?: {
    includeProcessList?: boolean;
    includeNetworkConnections?: boolean;
}) => Promise<EndpointTelemetry>;
/**
 * Monitors endpoint health status.
 *
 * @param {EndpointTelemetry} telemetry - Current telemetry data
 * @returns {Promise<any>} Health status
 *
 * @example
 * ```typescript
 * const health = await monitorEndpointHealth(telemetry);
 * if (health.status === 'CRITICAL') {
 *   console.log('Endpoint requires attention:', health.issues);
 * }
 * ```
 */
export declare const monitorEndpointHealth: (telemetry: EndpointTelemetry) => Promise<any>;
/**
 * Aggregates telemetry from multiple endpoints.
 *
 * @param {EndpointTelemetry[]} telemetryData - Array of telemetry
 * @returns {Promise<any>} Aggregated statistics
 *
 * @example
 * ```typescript
 * const telemetryArray = [...];
 * const aggregated = await aggregateEndpointTelemetry(telemetryArray);
 * console.log(`Average CPU: ${aggregated.avgCpuUsage}%`);
 * ```
 */
export declare const aggregateEndpointTelemetry: (telemetryData: EndpointTelemetry[]) => Promise<any>;
/**
 * Detects telemetry anomalies.
 *
 * @param {EndpointTelemetry} current - Current telemetry
 * @param {EndpointTelemetry[]} historical - Historical baseline
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectTelemetryAnomalies(current, historical);
 * ```
 */
export declare const detectTelemetryAnomalies: (current: EndpointTelemetry, historical: EndpointTelemetry[]) => Promise<any[]>;
/**
 * Exports telemetry data for reporting.
 *
 * @param {EndpointTelemetry[]} telemetryData - Telemetry to export
 * @param {string} format - Export format
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const csv = await exportTelemetryData(telemetryArray, 'csv');
 * ```
 */
export declare const exportTelemetryData: (telemetryData: EndpointTelemetry[], format: "json" | "csv" | "xml") => Promise<string>;
/**
 * Validates telemetry data integrity.
 *
 * @param {EndpointTelemetry} telemetry - Telemetry to validate
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTelemetryData(telemetry);
 * if (!validation.isValid) {
 *   console.log('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateTelemetryData: (telemetry: EndpointTelemetry) => Promise<any>;
/**
 * Analyzes process behavior for suspicious activity.
 *
 * @swagger
 * /api/endpoint/process/analyze:
 *   post:
 *     tags:
 *       - Process Analysis
 *     summary: Analyze process behavior
 *     description: Detects suspicious process behaviors including privilege escalation, injection, and malicious patterns
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processes:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProcessBehavior'
 *     responses:
 *       200:
 *         description: Analysis completed
 *
 * @param {ProcessBehavior[]} processes - Processes to analyze
 * @returns {Promise<ProcessBehavior[]>} Analyzed processes with scores
 *
 * @example
 * ```typescript
 * const processes = [...];
 * const analyzed = await analyzeProcessBehavior(processes);
 * const suspicious = analyzed.filter(p => p.suspiciousScore && p.suspiciousScore > 70);
 * ```
 */
export declare const analyzeProcessBehavior: (processes: ProcessBehavior[]) => Promise<ProcessBehavior[]>;
/**
 * Detects process injection attempts.
 *
 * @param {ProcessBehavior[]} processes - Processes to check
 * @returns {Promise<any[]>} Detected injection attempts
 *
 * @example
 * ```typescript
 * const injections = await detectProcessInjection(processes);
 * ```
 */
export declare const detectProcessInjection: (processes: ProcessBehavior[]) => Promise<any[]>;
/**
 * Monitors process creation events.
 *
 * @param {ProcessBehavior} process - Newly created process
 * @param {ProcessBehavior[]} existingProcesses - Current process list
 * @returns {Promise<any>} Creation analysis
 *
 * @example
 * ```typescript
 * const analysis = await monitorProcessCreation(newProcess, allProcesses);
 * ```
 */
export declare const monitorProcessCreation: (process: ProcessBehavior, existingProcesses: ProcessBehavior[]) => Promise<any>;
/**
 * Detects privilege escalation attempts.
 *
 * @param {ProcessBehavior[]} processes - Processes to analyze
 * @returns {Promise<any[]>} Detected escalation attempts
 *
 * @example
 * ```typescript
 * const escalations = await detectPrivilegeEscalation(processes);
 * ```
 */
export declare const detectPrivilegeEscalation: (processes: ProcessBehavior[]) => Promise<any[]>;
/**
 * Correlates processes for attack chain detection.
 *
 * @param {ProcessBehavior[]} processes - Processes to correlate
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Promise<any[]>} Detected attack chains
 *
 * @example
 * ```typescript
 * const chains = await correlateProcesses(processes, 300000);
 * ```
 */
export declare const correlateProcesses: (processes: ProcessBehavior[], timeWindow?: number) => Promise<any[]>;
/**
 * Generates process behavior report.
 *
 * @param {ProcessBehavior[]} processes - Processes to report on
 * @returns {Promise<any>} Behavior report
 *
 * @example
 * ```typescript
 * const report = await generateProcessBehaviorReport(processes);
 * ```
 */
export declare const generateProcessBehaviorReport: (processes: ProcessBehavior[]) => Promise<any>;
/**
 * Monitors file system for unauthorized changes.
 *
 * @swagger
 * /api/endpoint/file-integrity/monitor:
 *   post:
 *     tags:
 *       - File Integrity
 *     summary: Monitor file integrity
 *     description: Detects unauthorized file modifications, creations, and deletions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paths:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Monitoring results
 *
 * @param {string[]} paths - Paths to monitor
 * @param {FileIntegrityEntry[]} [baseline] - Baseline file state
 * @returns {Promise<FileIntegrityEntry[]>} Current file states
 *
 * @example
 * ```typescript
 * const paths = ['/etc', '/usr/bin'];
 * const currentState = await monitorFileIntegrity(paths, baseline);
 * ```
 */
export declare const monitorFileIntegrity: (paths: string[], baseline?: FileIntegrityEntry[]) => Promise<FileIntegrityEntry[]>;
/**
 * Detects suspicious file modifications.
 *
 * @param {FileIntegrityEntry[]} changes - File changes
 * @returns {Promise<FileIntegrityEntry[]>} Suspicious changes
 *
 * @example
 * ```typescript
 * const suspicious = await detectSuspiciousFileChanges(changes);
 * ```
 */
export declare const detectSuspiciousFileChanges: (changes: FileIntegrityEntry[]) => Promise<FileIntegrityEntry[]>;
/**
 * Creates file integrity baseline.
 *
 * @param {string[]} paths - Paths to baseline
 * @returns {Promise<FileIntegrityEntry[]>} Baseline entries
 *
 * @example
 * ```typescript
 * const baseline = await createFileIntegrityBaseline(['/etc', '/usr/bin']);
 * ```
 */
export declare const createFileIntegrityBaseline: (paths: string[]) => Promise<FileIntegrityEntry[]>;
/**
 * Compares current state with baseline.
 *
 * @param {FileIntegrityEntry[]} current - Current state
 * @param {FileIntegrityEntry[]} baseline - Baseline state
 * @returns {Promise<any>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareWithBaseline(current, baseline);
 * ```
 */
export declare const compareWithBaseline: (current: FileIntegrityEntry[], baseline: FileIntegrityEntry[]) => Promise<any>;
/**
 * Generates file integrity report.
 *
 * @param {FileIntegrityEntry[]} entries - File integrity entries
 * @returns {Promise<any>} Integrity report
 *
 * @example
 * ```typescript
 * const report = await generateFileIntegrityReport(entries);
 * ```
 */
export declare const generateFileIntegrityReport: (entries: FileIntegrityEntry[]) => Promise<any>;
/**
 * Monitors Windows registry for suspicious changes.
 *
 * @swagger
 * /api/endpoint/registry/monitor:
 *   post:
 *     tags:
 *       - Registry Monitoring
 *     summary: Monitor Windows registry
 *     description: Detects unauthorized registry modifications commonly used for persistence and privilege escalation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registryPaths:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Monitoring results
 *
 * @param {string[]} registryPaths - Registry paths to monitor
 * @returns {Promise<RegistryMonitorEntry[]>} Registry changes
 *
 * @example
 * ```typescript
 * const paths = ['HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'];
 * const changes = await monitorRegistryChanges(paths);
 * ```
 */
export declare const monitorRegistryChanges: (registryPaths: string[]) => Promise<RegistryMonitorEntry[]>;
/**
 * Detects suspicious registry modifications.
 *
 * @param {RegistryMonitorEntry[]} changes - Registry changes
 * @returns {Promise<RegistryMonitorEntry[]>} Suspicious changes
 *
 * @example
 * ```typescript
 * const suspicious = await detectSuspiciousRegistryChanges(changes);
 * ```
 */
export declare const detectSuspiciousRegistryChanges: (changes: RegistryMonitorEntry[]) => Promise<RegistryMonitorEntry[]>;
/**
 * Monitors registry keys for persistence mechanisms.
 *
 * @returns {Promise<RegistryMonitorEntry[]>} Persistence indicators
 *
 * @example
 * ```typescript
 * const persistence = await monitorRegistryPersistence();
 * ```
 */
export declare const monitorRegistryPersistence: () => Promise<RegistryMonitorEntry[]>;
/**
 * Detects registry-based privilege escalation.
 *
 * @param {RegistryMonitorEntry[]} changes - Registry changes
 * @returns {Promise<any[]>} Detected escalation attempts
 *
 * @example
 * ```typescript
 * const escalations = await detectRegistryPrivilegeEscalation(changes);
 * ```
 */
export declare const detectRegistryPrivilegeEscalation: (changes: RegistryMonitorEntry[]) => Promise<any[]>;
/**
 * Generates registry monitoring report.
 *
 * @param {RegistryMonitorEntry[]} entries - Registry entries
 * @returns {Promise<any>} Registry report
 *
 * @example
 * ```typescript
 * const report = await generateRegistryMonitoringReport(entries);
 * ```
 */
export declare const generateRegistryMonitoringReport: (entries: RegistryMonitorEntry[]) => Promise<any>;
/**
 * Monitors kernel-level events for rootkits and advanced threats.
 *
 * @swagger
 * /api/endpoint/kernel/monitor:
 *   post:
 *     tags:
 *       - Kernel Monitoring
 *     summary: Monitor kernel-level events
 *     description: Detects kernel-level threats including rootkits, driver loads, and privilege escalation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monitorDrivers:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Kernel events detected
 *
 * @param {object} [options] - Monitoring options
 * @returns {Promise<KernelEvent[]>} Detected kernel events
 *
 * @example
 * ```typescript
 * const kernelEvents = await monitorKernelEvents({ monitorDrivers: true });
 * ```
 */
export declare const monitorKernelEvents: (options?: {
    monitorDrivers?: boolean;
    monitorSystemCalls?: boolean;
}) => Promise<KernelEvent[]>;
/**
 * Detects rootkit presence through kernel analysis.
 *
 * @returns {Promise<any[]>} Rootkit detections
 *
 * @example
 * ```typescript
 * const rootkits = await detectRootkit();
 * if (rootkits.length > 0) {
 *   console.log('CRITICAL: Rootkit detected!');
 * }
 * ```
 */
export declare const detectRootkit: () => Promise<any[]>;
/**
 * Monitors driver loading events.
 *
 * @returns {Promise<any[]>} Driver load events
 *
 * @example
 * ```typescript
 * const driverLoads = await monitorDriverLoads();
 * ```
 */
export declare const monitorDriverLoads: () => Promise<any[]>;
/**
 * Detects kernel-level code injection.
 *
 * @returns {Promise<any[]>} Injection detections
 *
 * @example
 * ```typescript
 * const injections = await detectKernelInjection();
 * ```
 */
export declare const detectKernelInjection: () => Promise<any[]>;
/**
 * Monitors system call hooks.
 *
 * @returns {Promise<any[]>} Detected system call hooks
 *
 * @example
 * ```typescript
 * const hooks = await monitorSystemCallHooks();
 * ```
 */
export declare const monitorSystemCallHooks: () => Promise<any[]>;
/**
 * Scans endpoint for Indicators of Compromise (IOCs).
 *
 * @swagger
 * /api/endpoint/ioc/scan:
 *   post:
 *     tags:
 *       - IOC Scanning
 *     summary: Scan endpoint for IOCs
 *     description: Searches endpoint for known threat indicators including file hashes, registry keys, and artifacts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               iocs:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Scan completed
 *
 * @param {EndpointIOC[]} iocs - IOCs to scan for
 * @returns {Promise<any[]>} IOC matches
 *
 * @example
 * ```typescript
 * const iocs = [
 *   { iocType: 'FILE_HASH', value: 'abc123...', severity: 'HIGH' }
 * ];
 * const matches = await scanEndpointIOCs(iocs);
 * ```
 */
export declare const scanEndpointIOCs: (iocs: EndpointIOC[]) => Promise<any[]>;
/**
 * Scans for malicious file hashes.
 *
 * @param {string} targetHash - Hash to search for
 * @returns {Promise<boolean>} True if found
 *
 * @example
 * ```typescript
 * const found = await scanForFileHash('abc123...');
 * ```
 */
export declare const scanForFileHash: (targetHash: string) => Promise<boolean>;
/**
 * Scans running processes for IOCs.
 *
 * @param {EndpointIOC[]} iocs - Process-related IOCs
 * @returns {Promise<any[]>} Matching processes
 *
 * @example
 * ```typescript
 * const matches = await scanProcessIOCs(iocs);
 * ```
 */
export declare const scanProcessIOCs: (iocs: EndpointIOC[]) => Promise<any[]>;
/**
 * Scans file system for IOC artifacts.
 *
 * @param {EndpointIOC[]} iocs - File-related IOCs
 * @returns {Promise<any[]>} Found artifacts
 *
 * @example
 * ```typescript
 * const artifacts = await scanFileSystemIOCs(iocs);
 * ```
 */
export declare const scanFileSystemIOCs: (iocs: EndpointIOC[]) => Promise<any[]>;
/**
 * Enriches endpoint IOCs with local context.
 *
 * @param {EndpointIOC[]} iocs - IOCs to enrich
 * @returns {Promise<EndpointIOC[]>} Enriched IOCs
 *
 * @example
 * ```typescript
 * const enriched = await enrichEndpointIOCs(iocs);
 * ```
 */
export declare const enrichEndpointIOCs: (iocs: EndpointIOC[]) => Promise<EndpointIOC[]>;
/**
 * Performs memory analysis on running processes.
 *
 * @swagger
 * /api/endpoint/memory/analyze:
 *   post:
 *     tags:
 *       - Memory Analysis
 *     summary: Analyze process memory
 *     description: Scans process memory for injected code, shellcode, and malicious artifacts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Analysis completed
 *
 * @param {number} processId - Process to analyze
 * @returns {Promise<MemoryAnalysis>} Memory analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeProcessMemory(1234);
 * if (analysis.shellcodeDetected) {
 *   console.log('WARNING: Shellcode detected!');
 * }
 * ```
 */
export declare const analyzeProcessMemory: (processId: number) => Promise<MemoryAnalysis>;
/**
 * Scans memory for shellcode patterns.
 *
 * @param {number} processId - Process to scan
 * @returns {Promise<any[]>} Detected shellcode
 *
 * @example
 * ```typescript
 * const shellcode = await scanMemoryForShellcode(1234);
 * ```
 */
export declare const scanMemoryForShellcode: (processId: number) => Promise<any[]>;
/**
 * Detects code injection in process memory.
 *
 * @param {number} processId - Process to analyze
 * @returns {Promise<InjectedCode[]>} Detected injections
 *
 * @example
 * ```typescript
 * const injections = await detectMemoryInjection(1234);
 * ```
 */
export declare const detectMemoryInjection: (processId: number) => Promise<InjectedCode[]>;
/**
 * Extracts suspicious strings from process memory.
 *
 * @param {number} processId - Process to analyze
 * @returns {Promise<string[]>} Suspicious strings
 *
 * @example
 * ```typescript
 * const strings = await extractMemoryStrings(1234);
 * ```
 */
export declare const extractMemoryStrings: (processId: number) => Promise<string[]>;
/**
 * Dumps process memory for forensic analysis.
 *
 * @param {number} processId - Process to dump
 * @param {string} outputPath - Where to save dump
 * @returns {Promise<any>} Dump result
 *
 * @example
 * ```typescript
 * const result = await dumpProcessMemory(1234, '/forensics/dump.dmp');
 * ```
 */
export declare const dumpProcessMemory: (processId: number, outputPath: string) => Promise<any>;
/**
 * Executes automated threat response actions.
 *
 * @swagger
 * /api/endpoint/response/execute:
 *   post:
 *     tags:
 *       - Threat Response
 *     summary: Execute threat response
 *     description: Performs automated response actions like process termination, file quarantine, and network isolation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionType:
 *                 type: string
 *                 enum: [KILL_PROCESS, QUARANTINE_FILE, ISOLATE_ENDPOINT]
 *               targetEndpointId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action executed
 *
 * @param {ThreatResponseAction} action - Response action to execute
 * @returns {Promise<ThreatResponseAction>} Action result
 *
 * @example
 * ```typescript
 * const action = {
 *   actionType: ResponseActionType.KILL_PROCESS,
 *   targetEndpointId: 'endpoint-001',
 *   targetProcessId: 1234
 * };
 * const result = await executeThreatResponse(action);
 * ```
 */
export declare const executeThreatResponse: (action: Partial<ThreatResponseAction>) => Promise<ThreatResponseAction>;
/**
 * Quarantines malicious files.
 *
 * @param {string} filePath - File to quarantine
 * @returns {Promise<any>} Quarantine result
 *
 * @example
 * ```typescript
 * await quarantineFile('C:\\malware\\bad.exe');
 * ```
 */
export declare const quarantineFile: (filePath: string) => Promise<any>;
/**
 * Isolates endpoint from network.
 *
 * @param {string} endpointId - Endpoint to isolate
 * @returns {Promise<any>} Isolation result
 *
 * @example
 * ```typescript
 * await isolateEndpoint('endpoint-001');
 * ```
 */
export declare const isolateEndpoint: (endpointId: string) => Promise<any>;
//# sourceMappingURL=endpoint-threat-detection-kit.d.ts.map