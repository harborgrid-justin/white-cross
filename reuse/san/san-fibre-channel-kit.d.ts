/**
 * Fibre Channel SAN Operations Kit
 *
 * Comprehensive set of reusable functions for managing Fibre Channel Storage Area Networks.
 * Includes fabric management, zoning, port configuration, HBA operations, path failover,
 * and topology management.
 *
 * @module san-fibre-channel-kit
 */
/**
 * World Wide Port Name - Unique identifier for FC ports (64-bit)
 */
export type WWPN = string & {
    readonly __brand: 'WWPN';
};
/**
 * World Wide Node Name - Unique identifier for FC nodes (64-bit)
 */
export type WWNN = string & {
    readonly __brand: 'WWNN';
};
/**
 * Fibre Channel port speeds in Gbps
 */
export type FCSpeed = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
/**
 * Port operational states
 */
export declare enum FCPortState {
    Online = "online",
    Offline = "offline",
    Testing = "testing",
    Faulty = "faulty",
    Disabled = "disabled",
    Loopback = "loopback",
    Blocked = "blocked"
}
/**
 * Port types in FC topology
 */
export declare enum FCPortType {
    NPort = "N_Port",// Node port (end device)
    FPort = "F_Port",// Fabric port (switch port connected to N_Port)
    EPort = "E_Port",// Expansion port (inter-switch link)
    GPort = "G_Port",// Generic port (can be E_Port or F_Port)
    LPort = "L_Port",// Loop port
    TLPort = "TL_Port",// Translated loop port
    UPort = "U_Port"
}
/**
 * FC topology types
 */
export declare enum FCTopology {
    PointToPoint = "point-to-point",
    ArbitratedLoop = "arbitrated-loop",
    SwitchedFabric = "switched-fabric"
}
/**
 * Zoning enforcement modes
 */
export declare enum ZoningMode {
    None = "none",
    Soft = "soft",
    Hard = "hard"
}
/**
 * Path state for multipathing
 */
export declare enum PathState {
    Active = "active",
    Standby = "standby",
    Failed = "failed",
    Disabled = "disabled"
}
/**
 * Multipathing policy
 */
export declare enum MultipathPolicy {
    RoundRobin = "round-robin",
    LeastQueue = "least-queue",
    ServiceTime = "service-time",
    ActivePassive = "active-passive"
}
/**
 * Fibre Channel Port representation
 */
export interface FCPort {
    readonly wwpn: WWPN;
    readonly portIndex: number;
    readonly switchId?: string;
    readonly state: FCPortState;
    readonly portType: FCPortType;
    readonly speed: FCSpeed;
    readonly maxSpeed: FCSpeed;
    readonly sfpType?: string;
    readonly connectedWWPN?: WWPN;
    readonly fabricId?: number;
    readonly domainId?: number;
    readonly portAddress?: number;
    readonly rxPower?: number;
    readonly txPower?: number;
    readonly errorCount: number;
    readonly linkFailures: number;
    readonly framesSent: bigint;
    readonly framesReceived: bigint;
    readonly createdAt: Date;
    readonly lastStateChange: Date;
}
/**
 * Fibre Channel Fabric representation
 */
export interface FCFabric {
    readonly fabricId: number;
    readonly fabricName: string;
    readonly principalSwitchWWN: WWNN;
    readonly topology: FCTopology;
    readonly switches: FCSwitch[];
    readonly zones: FCZone[];
    readonly activeZoneSet?: string;
    readonly zoningMode: ZoningMode;
    readonly createdAt: Date;
    readonly lastModified: Date;
}
/**
 * FC Switch representation
 */
export interface FCSwitch {
    readonly switchId: string;
    readonly wwnn: WWNN;
    readonly fabricId: number;
    readonly domainId: number;
    readonly modelName: string;
    readonly firmwareVersion: string;
    readonly ipAddress?: string;
    readonly ports: FCPort[];
    readonly isPrincipal: boolean;
    readonly uptime: number;
    readonly createdAt: Date;
}
/**
 * FC Zone definition
 */
export interface FCZone {
    readonly zoneName: string;
    readonly zoneType: 'wwpn' | 'wwnn' | 'alias' | 'mixed';
    readonly members: Array<WWPN | WWNN | string>;
    readonly description?: string;
    readonly createdAt: Date;
    readonly lastModified: Date;
}
/**
 * FC Zone Set (collection of zones)
 */
export interface FCZoneSet {
    readonly zoneSetName: string;
    readonly zones: FCZone[];
    readonly isActive: boolean;
    readonly fabricId: number;
    readonly createdAt: Date;
    readonly lastActivated?: Date;
}
/**
 * Host Bus Adapter representation
 */
export interface HBA {
    readonly hbaId: string;
    readonly wwnn: WWNN;
    readonly wwpn: WWPN;
    readonly modelName: string;
    readonly driverVersion: string;
    readonly firmwareVersion: string;
    readonly serialNumber: string;
    readonly hostName: string;
    readonly portSpeed: FCSpeed;
    readonly portState: FCPortState;
    readonly linkState: 'up' | 'down';
    readonly topology: FCTopology;
    readonly connectedSwitchWWN?: WWNN;
    readonly connectedPortWWPN?: WWPN;
    readonly createdAt: Date;
}
/**
 * FC Path for multipathing
 */
export interface FCPath {
    readonly pathId: string;
    readonly hbaWWPN: WWPN;
    readonly targetWWPN: WWPN;
    readonly lun: number;
    readonly state: PathState;
    readonly priority: number;
    readonly ioCount: bigint;
    readonly errorCount: number;
    readonly avgLatencyMs: number;
    readonly lastUsed: Date;
}
/**
 * Multipath configuration
 */
export interface MultipathConfig {
    readonly deviceId: string;
    readonly paths: FCPath[];
    readonly policy: MultipathPolicy;
    readonly activePathCount: number;
    readonly totalPathCount: number;
    readonly failoverTime: number;
    readonly loadBalanceEnabled: boolean;
}
/**
 * Fabric topology map
 */
export interface FabricTopology {
    readonly fabricId: number;
    readonly switches: Map<WWNN, FCSwitch>;
    readonly islLinks: ISLLink[];
    readonly edges: TopologyEdge[];
    readonly diameter: number;
}
/**
 * Inter-Switch Link
 */
export interface ISLLink {
    readonly sourceWWNN: WWNN;
    readonly sourcePort: number;
    readonly targetWWNN: WWNN;
    readonly targetPort: number;
    readonly speed: FCSpeed;
    readonly state: FCPortState;
    readonly utilization: number;
}
/**
 * Topology edge for graph representation
 */
export interface TopologyEdge {
    readonly from: WWNN;
    readonly to: WWNN;
    readonly weight: number;
    readonly linkCount: number;
}
/**
 * Port statistics
 */
export interface PortStatistics {
    readonly wwpn: WWPN;
    readonly interval: number;
    readonly framesSent: bigint;
    readonly framesReceived: bigint;
    readonly bytesSent: bigint;
    readonly bytesReceived: bigint;
    readonly errors: PortErrors;
    readonly utilization: number;
    readonly timestamp: Date;
}
/**
 * Port error counters
 */
export interface PortErrors {
    readonly crcErrors: number;
    readonly linkFailures: number;
    readonly lossOfSync: number;
    readonly lossOfSignal: number;
    readonly invalidTxWords: number;
    readonly invalidCRCs: number;
    readonly frameErrors: number;
}
/**
 * Zone validation result
 */
export interface ZoneValidation {
    readonly isValid: boolean;
    readonly errors: string[];
    readonly warnings: string[];
    readonly conflictingZones: string[];
}
/**
 * Fabric event
 */
export interface FabricEvent {
    readonly eventId: string;
    readonly fabricId: number;
    readonly eventType: FabricEventType;
    readonly severity: 'info' | 'warning' | 'error' | 'critical';
    readonly description: string;
    readonly affectedComponent: WWPN | WWNN | string;
    readonly timestamp: Date;
}
/**
 * Fabric event types
 */
export declare enum FabricEventType {
    PortStateChange = "port-state-change",
    LinkFailure = "link-failure",
    SwitchAdded = "switch-added",
    SwitchRemoved = "switch-removed",
    ZoneChange = "zone-change",
    FabricMerge = "fabric-merge",
    FabricSplit = "fabric-split",
    PathFailover = "path-failover"
}
/**
 * Result type for operations that can fail
 */
export type FCResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
    code?: string;
};
/**
 * Filter criteria for ports
 */
export interface PortFilter {
    readonly state?: FCPortState;
    readonly portType?: FCPortType;
    readonly minSpeed?: FCSpeed;
    readonly fabricId?: number;
    readonly hasErrors?: boolean;
}
/**
 * Port configuration options
 */
export interface PortConfigOptions {
    readonly speed?: FCSpeed;
    readonly state?: FCPortState;
    readonly portType?: FCPortType;
    readonly persistent?: boolean;
}
/**
 * Validates WWPN format (16 hex characters, colon-separated)
 *
 * @param wwpn - World Wide Port Name to validate
 * @returns True if WWPN format is valid
 *
 * @example
 * ```typescript
 * const valid = isValidWWPN('50:00:00:00:00:00:00:01' as WWPN);
 * // Returns: true
 * ```
 */
export declare function isValidWWPN(wwpn: string): wwpn is WWPN;
/**
 * Validates WWNN format (16 hex characters, colon-separated)
 *
 * @param wwnn - World Wide Node Name to validate
 * @returns True if WWNN format is valid
 *
 * @example
 * ```typescript
 * const valid = isValidWWNN('20:00:00:00:00:00:00:01' as WWNN);
 * // Returns: true
 * ```
 */
export declare function isValidWWNN(wwnn: string): wwnn is WWNN;
/**
 * Creates a branded WWPN type from a validated string
 *
 * @param wwpn - WWPN string to convert
 * @returns Branded WWPN type
 * @throws Error if WWPN format is invalid
 */
export declare function createWWPN(wwpn: string): WWPN;
/**
 * Creates a branded WWNN type from a validated string
 *
 * @param wwnn - WWNN string to convert
 * @returns Branded WWNN type
 * @throws Error if WWNN format is invalid
 */
export declare function createWWNN(wwnn: string): WWNN;
/**
 * Creates a new FC fabric configuration
 *
 * @param fabricName - Name of the fabric
 * @param principalSwitchWWN - WWNN of the principal switch
 * @param topology - Fabric topology type
 * @returns New fabric configuration
 *
 * @example
 * ```typescript
 * const fabric = createFabric(
 *   'Production-Fabric-A',
 *   '20:00:00:11:22:33:44:55' as WWNN,
 *   FCTopology.SwitchedFabric
 * );
 * ```
 */
export declare function createFabric(fabricName: string, principalSwitchWWN: WWNN, topology: FCTopology): FCFabric;
/**
 * Adds a switch to an existing fabric
 *
 * @param fabric - Target fabric
 * @param fcSwitch - Switch to add
 * @returns Updated fabric with the new switch
 *
 * @example
 * ```typescript
 * const updatedFabric = addSwitchToFabric(fabric, newSwitch);
 * ```
 */
export declare function addSwitchToFabric(fabric: FCFabric, fcSwitch: FCSwitch): FCFabric;
/**
 * Removes a switch from a fabric
 *
 * @param fabric - Target fabric
 * @param switchWWNN - WWNN of switch to remove
 * @returns Updated fabric without the switch
 */
export declare function removeSwitchFromFabric(fabric: FCFabric, switchWWNN: WWNN): FCFabric;
/**
 * Finds a switch in the fabric by WWNN
 *
 * @param fabric - Fabric to search
 * @param wwnn - Switch WWNN to find
 * @returns Switch if found, undefined otherwise
 */
export declare function findSwitchByWWNN(fabric: FCFabric, wwnn: WWNN): FCSwitch | undefined;
/**
 * Gets all switches in a fabric with a specific domain ID
 *
 * @param fabric - Fabric to search
 * @param domainId - Domain ID to filter by
 * @returns Array of switches with the specified domain ID
 */
export declare function getSwitchesByDomain(fabric: FCFabric, domainId: number): FCSwitch[];
/**
 * Creates a new FC zone
 *
 * @param zoneName - Name of the zone
 * @param members - Zone members (WWPNs, WWNNs, or aliases)
 * @param zoneType - Type of zone
 * @param description - Optional description
 * @returns New zone configuration
 */
export declare function createZone(zoneName: string, members: Array<WWPN | WWNN | string>, zoneType?: FCZone['zoneType'], description?: string): FCZone;
/**
 * Adds a member to an existing zone
 *
 * @param zone - Target zone
 * @param member - Member to add (WWPN, WWNN, or alias)
 * @returns Updated zone with new member
 */
export declare function addZoneMember(zone: FCZone, member: WWPN | WWNN | string): FCZone;
/**
 * Removes a member from a zone
 *
 * @param zone - Target zone
 * @param member - Member to remove
 * @returns Updated zone without the member
 */
export declare function removeZoneMember(zone: FCZone, member: WWPN | WWNN | string): FCZone;
/**
 * Creates a zone set from multiple zones
 *
 * @param zoneSetName - Name of the zone set
 * @param zones - Array of zones to include
 * @param fabricId - Fabric ID this zone set belongs to
 * @returns New zone set
 */
export declare function createZoneSet(zoneSetName: string, zones: FCZone[], fabricId: number): FCZoneSet;
/**
 * Activates a zone set in a fabric
 *
 * @param fabric - Target fabric
 * @param zoneSetName - Name of zone set to activate
 * @param zoneSet - Zone set to activate
 * @returns Updated fabric with activated zone set
 */
export declare function activateZoneSet(fabric: FCFabric, zoneSetName: string, zoneSet: FCZoneSet): FCFabric;
/**
 * Validates zone configuration for conflicts
 *
 * @param zones - Array of zones to validate
 * @returns Validation result with any errors or warnings
 */
export declare function validateZones(zones: FCZone[]): ZoneValidation;
/**
 * Creates a new FC port configuration
 *
 * @param wwpn - Port WWPN
 * @param portIndex - Physical port index
 * @param maxSpeed - Maximum supported speed
 * @returns New port configuration
 */
export declare function createFCPort(wwpn: WWPN, portIndex: number, maxSpeed: FCSpeed): FCPort;
/**
 * Updates port configuration
 *
 * @param port - Port to update
 * @param options - Configuration options to apply
 * @returns Updated port configuration
 */
export declare function configurePort(port: FCPort, options: PortConfigOptions): FCPort;
/**
 * Enables a port (sets state to Online)
 *
 * @param port - Port to enable
 * @returns Updated port in Online state
 */
export declare function enablePort(port: FCPort): FCPort;
/**
 * Disables a port (sets state to Disabled)
 *
 * @param port - Port to disable
 * @returns Updated port in Disabled state
 */
export declare function disablePort(port: FCPort): FCPort;
/**
 * Filters ports based on specified criteria
 *
 * @param ports - Array of ports to filter
 * @param filter - Filter criteria
 * @returns Filtered array of ports
 */
export declare function filterPorts(ports: FCPort[], filter: PortFilter): FCPort[];
/**
 * Gets port statistics for monitoring
 *
 * @param port - Port to get statistics for
 * @param intervalSeconds - Time interval for statistics
 * @returns Port statistics
 */
export declare function getPortStatistics(port: FCPort, intervalSeconds: number): PortStatistics;
/**
 * Creates a new HBA configuration
 *
 * @param hbaId - Unique HBA identifier
 * @param wwnn - HBA World Wide Node Name
 * @param wwpn - HBA World Wide Port Name
 * @param hostName - Host system name
 * @returns New HBA configuration
 */
export declare function createHBA(hbaId: string, wwnn: WWNN, wwpn: WWPN, hostName: string): HBA;
/**
 * Updates HBA link state
 *
 * @param hba - HBA to update
 * @param linkState - New link state
 * @param connectedSwitchWWN - Optional connected switch WWNN
 * @param connectedPortWWPN - Optional connected port WWPN
 * @returns Updated HBA
 */
export declare function updateHBALinkState(hba: HBA, linkState: 'up' | 'down', connectedSwitchWWN?: WWNN, connectedPortWWPN?: WWPN): HBA;
/**
 * Gets HBA diagnostics information
 *
 * @param hba - HBA to diagnose
 * @returns Diagnostic information
 */
export declare function getHBADiagnostics(hba: HBA): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * Creates a new FC switch configuration
 *
 * @param switchId - Unique switch identifier
 * @param wwnn - Switch WWNN
 * @param fabricId - Fabric ID
 * @param domainId - Domain ID (1-239)
 * @returns New switch configuration
 */
export declare function createFCSwitch(switchId: string, wwnn: WWNN, fabricId: number, domainId: number): FCSwitch;
/**
 * Adds a port to a switch
 *
 * @param fcSwitch - Switch to add port to
 * @param port - Port to add
 * @returns Updated switch with new port
 */
export declare function addPortToSwitch(fcSwitch: FCSwitch, port: FCPort): FCSwitch;
/**
 * Gets all online ports on a switch
 *
 * @param fcSwitch - Switch to query
 * @returns Array of online ports
 */
export declare function getOnlinePorts(fcSwitch: FCSwitch): FCPort[];
/**
 * Gets all ISL (Inter-Switch Link) ports
 *
 * @param fcSwitch - Switch to query
 * @returns Array of E_Port type ports
 */
export declare function getISLPorts(fcSwitch: FCSwitch): FCPort[];
/**
 * Finds a port on a switch by WWPN
 *
 * @param fcSwitch - Switch to search
 * @param wwpn - Port WWPN to find
 * @returns Port if found, undefined otherwise
 */
export declare function findPortByWWPN(fcSwitch: FCSwitch, wwpn: WWPN): FCPort | undefined;
/**
 * Creates a multipath configuration
 *
 * @param deviceId - Storage device identifier
 * @param policy - Multipathing policy
 * @returns New multipath configuration
 */
export declare function createMultipathConfig(deviceId: string, policy: MultipathPolicy): MultipathConfig;
/**
 * Adds a path to multipath configuration
 *
 * @param config - Multipath configuration
 * @param path - Path to add
 * @returns Updated configuration
 */
export declare function addPathToMultipath(config: MultipathConfig, path: FCPath): MultipathConfig;
/**
 * Performs path failover operation
 *
 * @param config - Multipath configuration
 * @param failedPathId - ID of failed path
 * @returns Updated configuration with failover applied
 */
export declare function performPathFailover(config: MultipathConfig, failedPathId: string): FCResult<MultipathConfig>;
/**
 * Selects next path based on multipath policy
 *
 * @param config - Multipath configuration
 * @returns Selected path for I/O operation
 */
export declare function selectNextPath(config: MultipathConfig): FCPath | undefined;
/**
 * Builds fabric topology from fabric configuration
 *
 * @param fabric - Fabric to build topology for
 * @returns Fabric topology graph
 */
export declare function buildFabricTopology(fabric: FCFabric): FabricTopology;
/**
 * Finds the shortest path between two switches in the fabric
 *
 * @param topology - Fabric topology
 * @param sourceWWNN - Source switch WWNN
 * @param targetWWNN - Target switch WWNN
 * @returns Array of WWNNs representing the path, or undefined if no path exists
 */
export declare function findShortestPath(topology: FabricTopology, sourceWWNN: WWNN, targetWWNN: WWNN): WWNN[] | undefined;
/**
 * Detects redundant paths in the fabric topology
 *
 * @param topology - Fabric topology
 * @returns Map of switch pairs to number of redundant paths
 */
export declare function detectRedundantPaths(topology: FabricTopology): Map<string, number>;
//# sourceMappingURL=san-fibre-channel-kit.d.ts.map