/**
 * Fibre Channel SAN Operations Kit
 *
 * Comprehensive set of reusable functions for managing Fibre Channel Storage Area Networks.
 * Includes fabric management, zoning, port configuration, HBA operations, path failover,
 * and topology management.
 *
 * @module san-fibre-channel-kit
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * World Wide Port Name - Unique identifier for FC ports (64-bit)
 */
export type WWPN = string & { readonly __brand: 'WWPN' };

/**
 * World Wide Node Name - Unique identifier for FC nodes (64-bit)
 */
export type WWNN = string & { readonly __brand: 'WWNN' };

/**
 * Fibre Channel port speeds in Gbps
 */
export type FCSpeed = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;

/**
 * Port operational states
 */
export enum FCPortState {
  Online = 'online',
  Offline = 'offline',
  Testing = 'testing',
  Faulty = 'faulty',
  Disabled = 'disabled',
  Loopback = 'loopback',
  Blocked = 'blocked',
}

/**
 * Port types in FC topology
 */
export enum FCPortType {
  NPort = 'N_Port',    // Node port (end device)
  FPort = 'F_Port',    // Fabric port (switch port connected to N_Port)
  EPort = 'E_Port',    // Expansion port (inter-switch link)
  GPort = 'G_Port',    // Generic port (can be E_Port or F_Port)
  LPort = 'L_Port',    // Loop port
  TLPort = 'TL_Port',  // Translated loop port
  UPort = 'U_Port',    // Universal port (unconfigured)
}

/**
 * FC topology types
 */
export enum FCTopology {
  PointToPoint = 'point-to-point',
  ArbitratedLoop = 'arbitrated-loop',
  SwitchedFabric = 'switched-fabric',
}

/**
 * Zoning enforcement modes
 */
export enum ZoningMode {
  None = 'none',
  Soft = 'soft',
  Hard = 'hard',
}

/**
 * Path state for multipathing
 */
export enum PathState {
  Active = 'active',
  Standby = 'standby',
  Failed = 'failed',
  Disabled = 'disabled',
}

/**
 * Multipathing policy
 */
export enum MultipathPolicy {
  RoundRobin = 'round-robin',
  LeastQueue = 'least-queue',
  ServiceTime = 'service-time',
  ActivePassive = 'active-passive',
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
  readonly rxPower?: number;  // dBm
  readonly txPower?: number;  // dBm
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
  readonly uptime: number;  // seconds
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
  readonly failoverTime: number;  // milliseconds
  readonly loadBalanceEnabled: boolean;
}

/**
 * Fabric topology map
 */
export interface FabricTopology {
  readonly fabricId: number;
  readonly switches: Map<WWNN, FCSwitch>;
  readonly islLinks: ISLLink[];  // Inter-Switch Links
  readonly edges: TopologyEdge[];
  readonly diameter: number;  // Maximum hops between any two switches
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
  readonly utilization: number;  // percentage
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
  readonly interval: number;  // seconds
  readonly framesSent: bigint;
  readonly framesReceived: bigint;
  readonly bytesSent: bigint;
  readonly bytesReceived: bigint;
  readonly errors: PortErrors;
  readonly utilization: number;  // percentage
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
export enum FabricEventType {
  PortStateChange = 'port-state-change',
  LinkFailure = 'link-failure',
  SwitchAdded = 'switch-added',
  SwitchRemoved = 'switch-removed',
  ZoneChange = 'zone-change',
  FabricMerge = 'fabric-merge',
  FabricSplit = 'fabric-split',
  PathFailover = 'path-failover',
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type FCResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

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

// ============================================================================
// Validation Functions
// ============================================================================

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
export function isValidWWPN(wwpn: string): wwpn is WWPN {
  const pattern = /^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){7}$/;
  return pattern.test(wwpn);
}

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
export function isValidWWNN(wwnn: string): wwnn is WWNN {
  const pattern = /^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){7}$/;
  return pattern.test(wwnn);
}

/**
 * Creates a branded WWPN type from a validated string
 *
 * @param wwpn - WWPN string to convert
 * @returns Branded WWPN type
 * @throws Error if WWPN format is invalid
 */
export function createWWPN(wwpn: string): WWPN {
  if (!isValidWWPN(wwpn)) {
    throw new Error(`Invalid WWPN format: ${wwpn}`);
  }
  return wwpn as WWPN;
}

/**
 * Creates a branded WWNN type from a validated string
 *
 * @param wwnn - WWNN string to convert
 * @returns Branded WWNN type
 * @throws Error if WWNN format is invalid
 */
export function createWWNN(wwnn: string): WWNN {
  if (!isValidWWNN(wwnn)) {
    throw new Error(`Invalid WWNN format: ${wwnn}`);
  }
  return wwnn as WWNN;
}

// ============================================================================
// Fabric Management Functions
// ============================================================================

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
export function createFabric(
  fabricName: string,
  principalSwitchWWN: WWNN,
  topology: FCTopology
): FCFabric {
  const now = new Date();
  const fabricId = Math.floor(Math.random() * 256); // 0-255

  return {
    fabricId,
    fabricName,
    principalSwitchWWN,
    topology,
    switches: [],
    zones: [],
    activeZoneSet: undefined,
    zoningMode: ZoningMode.None,
    createdAt: now,
    lastModified: now,
  };
}

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
export function addSwitchToFabric(fabric: FCFabric, fcSwitch: FCSwitch): FCFabric {
  // Validate switch doesn't already exist
  const exists = fabric.switches.some(s => s.wwnn === fcSwitch.wwnn);
  if (exists) {
    throw new Error(`Switch with WWNN ${fcSwitch.wwnn} already exists in fabric`);
  }

  // Validate fabric ID matches
  if (fcSwitch.fabricId !== fabric.fabricId) {
    throw new Error(`Switch fabric ID ${fcSwitch.fabricId} does not match fabric ${fabric.fabricId}`);
  }

  return {
    ...fabric,
    switches: [...fabric.switches, fcSwitch],
    lastModified: new Date(),
  };
}

/**
 * Removes a switch from a fabric
 *
 * @param fabric - Target fabric
 * @param switchWWNN - WWNN of switch to remove
 * @returns Updated fabric without the switch
 */
export function removeSwitchFromFabric(fabric: FCFabric, switchWWNN: WWNN): FCFabric {
  const switches = fabric.switches.filter(s => s.wwnn !== switchWWNN);

  if (switches.length === fabric.switches.length) {
    throw new Error(`Switch with WWNN ${switchWWNN} not found in fabric`);
  }

  return {
    ...fabric,
    switches,
    lastModified: new Date(),
  };
}

/**
 * Finds a switch in the fabric by WWNN
 *
 * @param fabric - Fabric to search
 * @param wwnn - Switch WWNN to find
 * @returns Switch if found, undefined otherwise
 */
export function findSwitchByWWNN(fabric: FCFabric, wwnn: WWNN): FCSwitch | undefined {
  return fabric.switches.find(s => s.wwnn === wwnn);
}

/**
 * Gets all switches in a fabric with a specific domain ID
 *
 * @param fabric - Fabric to search
 * @param domainId - Domain ID to filter by
 * @returns Array of switches with the specified domain ID
 */
export function getSwitchesByDomain(fabric: FCFabric, domainId: number): FCSwitch[] {
  if (domainId < 1 || domainId > 239) {
    throw new Error(`Invalid domain ID: ${domainId}. Must be between 1 and 239`);
  }

  return fabric.switches.filter(s => s.domainId === domainId);
}

// ============================================================================
// Zoning Functions
// ============================================================================

/**
 * Creates a new FC zone
 *
 * @param zoneName - Name of the zone
 * @param members - Zone members (WWPNs, WWNNs, or aliases)
 * @param zoneType - Type of zone
 * @param description - Optional description
 * @returns New zone configuration
 */
export function createZone(
  zoneName: string,
  members: Array<WWPN | WWNN | string>,
  zoneType: FCZone['zoneType'] = 'wwpn',
  description?: string
): FCZone {
  if (members.length < 2) {
    throw new Error('Zone must have at least 2 members');
  }

  const now = new Date();
  return {
    zoneName,
    zoneType,
    members: [...members],
    description,
    createdAt: now,
    lastModified: now,
  };
}

/**
 * Adds a member to an existing zone
 *
 * @param zone - Target zone
 * @param member - Member to add (WWPN, WWNN, or alias)
 * @returns Updated zone with new member
 */
export function addZoneMember(zone: FCZone, member: WWPN | WWNN | string): FCZone {
  if (zone.members.includes(member)) {
    throw new Error(`Member ${member} already exists in zone ${zone.zoneName}`);
  }

  return {
    ...zone,
    members: [...zone.members, member],
    lastModified: new Date(),
  };
}

/**
 * Removes a member from a zone
 *
 * @param zone - Target zone
 * @param member - Member to remove
 * @returns Updated zone without the member
 */
export function removeZoneMember(zone: FCZone, member: WWPN | WWNN | string): FCZone {
  const members = zone.members.filter(m => m !== member);

  if (members.length === zone.members.length) {
    throw new Error(`Member ${member} not found in zone ${zone.zoneName}`);
  }

  if (members.length < 2) {
    throw new Error('Zone must have at least 2 members');
  }

  return {
    ...zone,
    members,
    lastModified: new Date(),
  };
}

/**
 * Creates a zone set from multiple zones
 *
 * @param zoneSetName - Name of the zone set
 * @param zones - Array of zones to include
 * @param fabricId - Fabric ID this zone set belongs to
 * @returns New zone set
 */
export function createZoneSet(
  zoneSetName: string,
  zones: FCZone[],
  fabricId: number
): FCZoneSet {
  if (zones.length === 0) {
    throw new Error('Zone set must contain at least one zone');
  }

  return {
    zoneSetName,
    zones: [...zones],
    isActive: false,
    fabricId,
    createdAt: new Date(),
    lastActivated: undefined,
  };
}

/**
 * Activates a zone set in a fabric
 *
 * @param fabric - Target fabric
 * @param zoneSetName - Name of zone set to activate
 * @param zoneSet - Zone set to activate
 * @returns Updated fabric with activated zone set
 */
export function activateZoneSet(
  fabric: FCFabric,
  zoneSetName: string,
  zoneSet: FCZoneSet
): FCFabric {
  if (zoneSet.fabricId !== fabric.fabricId) {
    throw new Error(`Zone set fabric ID ${zoneSet.fabricId} does not match fabric ${fabric.fabricId}`);
  }

  return {
    ...fabric,
    activeZoneSet: zoneSetName,
    zones: [...zoneSet.zones],
    lastModified: new Date(),
  };
}

/**
 * Validates zone configuration for conflicts
 *
 * @param zones - Array of zones to validate
 * @returns Validation result with any errors or warnings
 */
export function validateZones(zones: FCZone[]): ZoneValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const conflictingZones: string[] = [];
  const memberMap = new Map<string, string[]>();

  // Check for duplicate zone names
  const zoneNames = new Set<string>();
  for (const zone of zones) {
    if (zoneNames.has(zone.zoneName)) {
      errors.push(`Duplicate zone name: ${zone.zoneName}`);
    }
    zoneNames.add(zone.zoneName);

    // Check minimum members
    if (zone.members.length < 2) {
      errors.push(`Zone ${zone.zoneName} has fewer than 2 members`);
    }

    // Track member usage
    for (const member of zone.members) {
      const existingZones = memberMap.get(member) || [];
      existingZones.push(zone.zoneName);
      memberMap.set(member, existingZones);
    }
  }

  // Check for overlapping zones (same members in multiple zones)
  for (const [member, zoneList] of memberMap.entries()) {
    if (zoneList.length > 1) {
      warnings.push(`Member ${member} appears in multiple zones: ${zoneList.join(', ')}`);
      conflictingZones.push(...zoneList);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    conflictingZones: [...new Set(conflictingZones)],
  };
}

// ============================================================================
// Port Configuration Functions
// ============================================================================

/**
 * Creates a new FC port configuration
 *
 * @param wwpn - Port WWPN
 * @param portIndex - Physical port index
 * @param maxSpeed - Maximum supported speed
 * @returns New port configuration
 */
export function createFCPort(wwpn: WWPN, portIndex: number, maxSpeed: FCSpeed): FCPort {
  const now = new Date();
  return {
    wwpn,
    portIndex,
    state: FCPortState.Offline,
    portType: FCPortType.UPort,
    speed: maxSpeed,
    maxSpeed,
    errorCount: 0,
    linkFailures: 0,
    framesSent: 0n,
    framesReceived: 0n,
    createdAt: now,
    lastStateChange: now,
  };
}

/**
 * Updates port configuration
 *
 * @param port - Port to update
 * @param options - Configuration options to apply
 * @returns Updated port configuration
 */
export function configurePort(port: FCPort, options: PortConfigOptions): FCPort {
  const updates: Partial<FCPort> = {};

  if (options.speed !== undefined) {
    if (options.speed > port.maxSpeed) {
      throw new Error(`Requested speed ${options.speed} exceeds maximum ${port.maxSpeed}`);
    }
    updates.speed = options.speed;
  }

  if (options.state !== undefined) {
    updates.state = options.state;
    updates.lastStateChange = new Date();
  }

  if (options.portType !== undefined) {
    updates.portType = options.portType;
  }

  return { ...port, ...updates };
}

/**
 * Enables a port (sets state to Online)
 *
 * @param port - Port to enable
 * @returns Updated port in Online state
 */
export function enablePort(port: FCPort): FCPort {
  if (port.state === FCPortState.Faulty) {
    throw new Error(`Cannot enable faulty port ${port.wwpn}`);
  }

  return {
    ...port,
    state: FCPortState.Online,
    lastStateChange: new Date(),
  };
}

/**
 * Disables a port (sets state to Disabled)
 *
 * @param port - Port to disable
 * @returns Updated port in Disabled state
 */
export function disablePort(port: FCPort): FCPort {
  return {
    ...port,
    state: FCPortState.Disabled,
    lastStateChange: new Date(),
  };
}

/**
 * Filters ports based on specified criteria
 *
 * @param ports - Array of ports to filter
 * @param filter - Filter criteria
 * @returns Filtered array of ports
 */
export function filterPorts(ports: FCPort[], filter: PortFilter): FCPort[] {
  return ports.filter(port => {
    if (filter.state !== undefined && port.state !== filter.state) {
      return false;
    }
    if (filter.portType !== undefined && port.portType !== filter.portType) {
      return false;
    }
    if (filter.minSpeed !== undefined && port.speed < filter.minSpeed) {
      return false;
    }
    if (filter.fabricId !== undefined && port.fabricId !== filter.fabricId) {
      return false;
    }
    if (filter.hasErrors !== undefined && filter.hasErrors && port.errorCount === 0) {
      return false;
    }
    return true;
  });
}

/**
 * Gets port statistics for monitoring
 *
 * @param port - Port to get statistics for
 * @param intervalSeconds - Time interval for statistics
 * @returns Port statistics
 */
export function getPortStatistics(port: FCPort, intervalSeconds: number): PortStatistics {
  // Calculate approximate bytes from frames (assuming average frame size of 2KB)
  const avgFrameSize = 2048n;

  return {
    wwpn: port.wwpn,
    interval: intervalSeconds,
    framesSent: port.framesSent,
    framesReceived: port.framesReceived,
    bytesSent: port.framesSent * avgFrameSize,
    bytesReceived: port.framesReceived * avgFrameSize,
    errors: {
      crcErrors: Math.floor(port.errorCount * 0.3),
      linkFailures: port.linkFailures,
      lossOfSync: Math.floor(port.errorCount * 0.2),
      lossOfSignal: Math.floor(port.errorCount * 0.1),
      invalidTxWords: Math.floor(port.errorCount * 0.2),
      invalidCRCs: Math.floor(port.errorCount * 0.15),
      frameErrors: Math.floor(port.errorCount * 0.05),
    },
    utilization: calculatePortUtilization(port, intervalSeconds),
    timestamp: new Date(),
  };
}

/**
 * Calculates port utilization percentage
 *
 * @param port - Port to calculate utilization for
 * @param intervalSeconds - Time interval
 * @returns Utilization percentage (0-100)
 */
function calculatePortUtilization(port: FCPort, intervalSeconds: number): number {
  // Maximum theoretical throughput in bytes per second
  const maxThroughput = BigInt(port.speed) * 1_000_000_000n / 8n; // Gbps to bytes/sec

  // Total frames transferred
  const totalFrames = port.framesSent + port.framesReceived;
  const avgFrameSize = 2048n;
  const totalBytes = totalFrames * avgFrameSize;

  // Calculate utilization
  const maxBytes = maxThroughput * BigInt(intervalSeconds);
  if (maxBytes === 0n) return 0;

  const utilization = Number(totalBytes * 100n / maxBytes);
  return Math.min(100, Math.max(0, utilization));
}

// ============================================================================
// HBA Management Functions
// ============================================================================

/**
 * Creates a new HBA configuration
 *
 * @param hbaId - Unique HBA identifier
 * @param wwnn - HBA World Wide Node Name
 * @param wwpn - HBA World Wide Port Name
 * @param hostName - Host system name
 * @returns New HBA configuration
 */
export function createHBA(hbaId: string, wwnn: WWNN, wwpn: WWPN, hostName: string): HBA {
  return {
    hbaId,
    wwnn,
    wwpn,
    modelName: 'Unknown',
    driverVersion: '1.0.0',
    firmwareVersion: '1.0.0',
    serialNumber: '',
    hostName,
    portSpeed: 8,
    portState: FCPortState.Offline,
    linkState: 'down',
    topology: FCTopology.PointToPoint,
    createdAt: new Date(),
  };
}

/**
 * Updates HBA link state
 *
 * @param hba - HBA to update
 * @param linkState - New link state
 * @param connectedSwitchWWN - Optional connected switch WWNN
 * @param connectedPortWWPN - Optional connected port WWPN
 * @returns Updated HBA
 */
export function updateHBALinkState(
  hba: HBA,
  linkState: 'up' | 'down',
  connectedSwitchWWN?: WWNN,
  connectedPortWWPN?: WWPN
): HBA {
  return {
    ...hba,
    linkState,
    portState: linkState === 'up' ? FCPortState.Online : FCPortState.Offline,
    connectedSwitchWWN,
    connectedPortWWPN,
  };
}

/**
 * Gets HBA diagnostics information
 *
 * @param hba - HBA to diagnose
 * @returns Diagnostic information
 */
export function getHBADiagnostics(hba: HBA): {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (hba.linkState === 'down') {
    issues.push('Link is down');
    recommendations.push('Check cable connections and SFP modules');
  }

  if (hba.portState === FCPortState.Faulty) {
    issues.push('Port is in faulty state');
    recommendations.push('Check HBA logs and consider replacing HBA');
  }

  if (hba.portSpeed < 8) {
    recommendations.push(`Port speed is ${hba.portSpeed}Gbps, consider upgrading to 16Gbps or higher`);
  }

  if (!hba.connectedSwitchWWN && hba.linkState === 'up') {
    issues.push('Link up but no switch connection detected');
    recommendations.push('Verify switch port configuration');
  }

  return {
    isHealthy: issues.length === 0,
    issues,
    recommendations,
  };
}

// ============================================================================
// FC Switch Operations
// ============================================================================

/**
 * Creates a new FC switch configuration
 *
 * @param switchId - Unique switch identifier
 * @param wwnn - Switch WWNN
 * @param fabricId - Fabric ID
 * @param domainId - Domain ID (1-239)
 * @returns New switch configuration
 */
export function createFCSwitch(
  switchId: string,
  wwnn: WWNN,
  fabricId: number,
  domainId: number
): FCSwitch {
  if (domainId < 1 || domainId > 239) {
    throw new Error(`Invalid domain ID: ${domainId}. Must be between 1 and 239`);
  }

  return {
    switchId,
    wwnn,
    fabricId,
    domainId,
    modelName: 'Generic FC Switch',
    firmwareVersion: '1.0.0',
    ports: [],
    isPrincipal: false,
    uptime: 0,
    createdAt: new Date(),
  };
}

/**
 * Adds a port to a switch
 *
 * @param fcSwitch - Switch to add port to
 * @param port - Port to add
 * @returns Updated switch with new port
 */
export function addPortToSwitch(fcSwitch: FCSwitch, port: FCPort): FCSwitch {
  // Validate port doesn't already exist
  const exists = fcSwitch.ports.some(p => p.wwpn === port.wwpn || p.portIndex === port.portIndex);
  if (exists) {
    throw new Error(`Port ${port.wwpn} or index ${port.portIndex} already exists on switch`);
  }

  return {
    ...fcSwitch,
    ports: [...fcSwitch.ports, { ...port, switchId: fcSwitch.switchId, fabricId: fcSwitch.fabricId }],
  };
}

/**
 * Gets all online ports on a switch
 *
 * @param fcSwitch - Switch to query
 * @returns Array of online ports
 */
export function getOnlinePorts(fcSwitch: FCSwitch): FCPort[] {
  return fcSwitch.ports.filter(p => p.state === FCPortState.Online);
}

/**
 * Gets all ISL (Inter-Switch Link) ports
 *
 * @param fcSwitch - Switch to query
 * @returns Array of E_Port type ports
 */
export function getISLPorts(fcSwitch: FCSwitch): FCPort[] {
  return fcSwitch.ports.filter(p => p.portType === FCPortType.EPort);
}

/**
 * Finds a port on a switch by WWPN
 *
 * @param fcSwitch - Switch to search
 * @param wwpn - Port WWPN to find
 * @returns Port if found, undefined otherwise
 */
export function findPortByWWPN(fcSwitch: FCSwitch, wwpn: WWPN): FCPort | undefined {
  return fcSwitch.ports.find(p => p.wwpn === wwpn);
}

// ============================================================================
// Path Failover and Multipathing Functions
// ============================================================================

/**
 * Creates a multipath configuration
 *
 * @param deviceId - Storage device identifier
 * @param policy - Multipathing policy
 * @returns New multipath configuration
 */
export function createMultipathConfig(
  deviceId: string,
  policy: MultipathPolicy
): MultipathConfig {
  return {
    deviceId,
    paths: [],
    policy,
    activePathCount: 0,
    totalPathCount: 0,
    failoverTime: 30000, // 30 seconds default
    loadBalanceEnabled: policy === MultipathPolicy.RoundRobin || policy === MultipathPolicy.LeastQueue,
  };
}

/**
 * Adds a path to multipath configuration
 *
 * @param config - Multipath configuration
 * @param path - Path to add
 * @returns Updated configuration
 */
export function addPathToMultipath(config: MultipathConfig, path: FCPath): MultipathConfig {
  const exists = config.paths.some(p => p.pathId === path.pathId);
  if (exists) {
    throw new Error(`Path ${path.pathId} already exists in multipath configuration`);
  }

  const paths = [...config.paths, path];
  const activePathCount = paths.filter(p => p.state === PathState.Active).length;

  return {
    ...config,
    paths,
    activePathCount,
    totalPathCount: paths.length,
  };
}

/**
 * Performs path failover operation
 *
 * @param config - Multipath configuration
 * @param failedPathId - ID of failed path
 * @returns Updated configuration with failover applied
 */
export function performPathFailover(
  config: MultipathConfig,
  failedPathId: string
): FCResult<MultipathConfig> {
  const failedPath = config.paths.find(p => p.pathId === failedPathId);
  if (!failedPath) {
    return { success: false, error: `Path ${failedPathId} not found`, code: 'PATH_NOT_FOUND' };
  }

  // Find standby path with highest priority
  const standbyPaths = config.paths
    .filter(p => p.state === PathState.Standby)
    .sort((a, b) => b.priority - a.priority);

  if (standbyPaths.length === 0) {
    return { success: false, error: 'No standby paths available for failover', code: 'NO_STANDBY_PATH' };
  }

  const newActivePath = standbyPaths[0];

  const updatedPaths = config.paths.map(p => {
    if (p.pathId === failedPathId) {
      return { ...p, state: PathState.Failed };
    }
    if (p.pathId === newActivePath.pathId) {
      return { ...p, state: PathState.Active, lastUsed: new Date() };
    }
    return p;
  });

  const activePathCount = updatedPaths.filter(p => p.state === PathState.Active).length;

  return {
    success: true,
    data: {
      ...config,
      paths: updatedPaths,
      activePathCount,
    },
  };
}

/**
 * Selects next path based on multipath policy
 *
 * @param config - Multipath configuration
 * @returns Selected path for I/O operation
 */
export function selectNextPath(config: MultipathConfig): FCPath | undefined {
  const activePaths = config.paths.filter(p => p.state === PathState.Active);

  if (activePaths.length === 0) {
    return undefined;
  }

  switch (config.policy) {
    case MultipathPolicy.RoundRobin:
      return selectRoundRobinPath(activePaths);

    case MultipathPolicy.LeastQueue:
      return selectLeastQueuePath(activePaths);

    case MultipathPolicy.ServiceTime:
      return selectServiceTimePath(activePaths);

    case MultipathPolicy.ActivePassive:
      return selectHighestPriorityPath(activePaths);

    default:
      return activePaths[0];
  }
}

/**
 * Selects path using round-robin algorithm
 */
function selectRoundRobinPath(paths: FCPath[]): FCPath {
  // Find least recently used path
  return paths.reduce((oldest, current) =>
    current.lastUsed < oldest.lastUsed ? current : oldest
  );
}

/**
 * Selects path with least I/O queue depth
 */
function selectLeastQueuePath(paths: FCPath[]): FCPath {
  return paths.reduce((min, current) =>
    current.ioCount < min.ioCount ? current : min
  );
}

/**
 * Selects path with best service time (lowest latency)
 */
function selectServiceTimePath(paths: FCPath[]): FCPath {
  return paths.reduce((best, current) =>
    current.avgLatencyMs < best.avgLatencyMs ? current : best
  );
}

/**
 * Selects path with highest priority
 */
function selectHighestPriorityPath(paths: FCPath[]): FCPath {
  return paths.reduce((highest, current) =>
    current.priority > highest.priority ? current : highest
  );
}

// ============================================================================
// Fabric Topology Management Functions
// ============================================================================

/**
 * Builds fabric topology from fabric configuration
 *
 * @param fabric - Fabric to build topology for
 * @returns Fabric topology graph
 */
export function buildFabricTopology(fabric: FCFabric): FabricTopology {
  const switches = new Map<WWNN, FCSwitch>();
  const islLinks: ISLLink[] = [];
  const edges: TopologyEdge[] = [];

  // Add all switches to map
  for (const sw of fabric.switches) {
    switches.set(sw.wwnn, sw);
  }

  // Build ISL links from E_Port connections
  for (const sw of fabric.switches) {
    for (const port of sw.ports) {
      if (port.portType === FCPortType.EPort && port.connectedWWPN) {
        // Find the connected switch and port
        const connectedSwitch = findSwitchByPortWWPN(fabric, port.connectedWWPN);
        if (connectedSwitch) {
          const connectedPort = connectedSwitch.ports.find(p => p.wwpn === port.connectedWWPN);
          if (connectedPort) {
            islLinks.push({
              sourceWWNN: sw.wwnn,
              sourcePort: port.portIndex,
              targetWWNN: connectedSwitch.wwnn,
              targetPort: connectedPort.portIndex,
              speed: Math.min(port.speed, connectedPort.speed),
              state: port.state === FCPortState.Online && connectedPort.state === FCPortState.Online
                ? FCPortState.Online
                : FCPortState.Offline,
              utilization: (calculatePortUtilization(port, 60) + calculatePortUtilization(connectedPort, 60)) / 2,
            });

            // Add edge for topology graph
            const existingEdge = edges.find(e =>
              (e.from === sw.wwnn && e.to === connectedSwitch.wwnn) ||
              (e.from === connectedSwitch.wwnn && e.to === sw.wwnn)
            );

            if (!existingEdge) {
              edges.push({
                from: sw.wwnn,
                to: connectedSwitch.wwnn,
                weight: 1,
                linkCount: 1,
              });
            } else {
              existingEdge.linkCount++;
            }
          }
        }
      }
    }
  }

  const diameter = calculateFabricDiameter(switches, edges);

  return {
    fabricId: fabric.fabricId,
    switches,
    islLinks,
    edges,
    diameter,
  };
}

/**
 * Finds a switch that has a port with the given WWPN
 */
function findSwitchByPortWWPN(fabric: FCFabric, wwpn: WWPN): FCSwitch | undefined {
  return fabric.switches.find(sw => sw.ports.some(p => p.wwpn === wwpn));
}

/**
 * Calculates the diameter of the fabric (maximum hops between any two switches)
 */
function calculateFabricDiameter(switches: Map<WWNN, FCSwitch>, edges: TopologyEdge[]): number {
  if (switches.size <= 1) return 0;

  // Use Floyd-Warshall algorithm to find shortest paths
  const switchArray = Array.from(switches.keys());
  const n = switchArray.length;
  const dist: number[][] = Array(n).fill(null).map(() => Array(n).fill(Infinity));

  // Initialize distances
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  // Set edge distances
  for (const edge of edges) {
    const fromIdx = switchArray.indexOf(edge.from);
    const toIdx = switchArray.indexOf(edge.to);
    if (fromIdx !== -1 && toIdx !== -1) {
      dist[fromIdx][toIdx] = 1;
      dist[toIdx][fromIdx] = 1;
    }
  }

  // Floyd-Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Find maximum distance
  let maxDist = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dist[i][j] !== Infinity && dist[i][j] > maxDist) {
        maxDist = dist[i][j];
      }
    }
  }

  return maxDist;
}

/**
 * Finds the shortest path between two switches in the fabric
 *
 * @param topology - Fabric topology
 * @param sourceWWNN - Source switch WWNN
 * @param targetWWNN - Target switch WWNN
 * @returns Array of WWNNs representing the path, or undefined if no path exists
 */
export function findShortestPath(
  topology: FabricTopology,
  sourceWWNN: WWNN,
  targetWWNN: WWNN
): WWNN[] | undefined {
  if (sourceWWNN === targetWWNN) {
    return [sourceWWNN];
  }

  const visited = new Set<WWNN>();
  const queue: { wwnn: WWNN; path: WWNN[] }[] = [{ wwnn: sourceWWNN, path: [sourceWWNN] }];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.wwnn === targetWWNN) {
      return current.path;
    }

    if (visited.has(current.wwnn)) {
      continue;
    }

    visited.add(current.wwnn);

    // Find all neighbors
    const neighbors = topology.edges
      .filter(e => e.from === current.wwnn || e.to === current.wwnn)
      .map(e => e.from === current.wwnn ? e.to : e.from);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push({
          wwnn: neighbor,
          path: [...current.path, neighbor],
        });
      }
    }
  }

  return undefined; // No path found
}

/**
 * Detects redundant paths in the fabric topology
 *
 * @param topology - Fabric topology
 * @returns Map of switch pairs to number of redundant paths
 */
export function detectRedundantPaths(topology: FabricTopology): Map<string, number> {
  const redundancy = new Map<string, number>();
  const switches = Array.from(topology.switches.keys());

  for (let i = 0; i < switches.length; i++) {
    for (let j = i + 1; j < switches.length; j++) {
      const source = switches[i];
      const target = switches[j];
      const pathCount = countPathsBetweenSwitches(topology, source, target);

      if (pathCount > 1) {
        const key = `${source}:${target}`;
        redundancy.set(key, pathCount);
      }
    }
  }

  return redundancy;
}

/**
 * Counts the number of paths between two switches
 */
function countPathsBetweenSwitches(topology: FabricTopology, source: WWNN, target: WWNN): number {
  let pathCount = 0;
  const maxDepth = topology.diameter + 2;

  function dfs(current: WWNN, visited: Set<WWNN>, depth: number): void {
    if (depth > maxDepth) return;

    if (current === target) {
      pathCount++;
      return;
    }

    const neighbors = topology.edges
      .filter(e => e.from === current || e.to === current)
      .map(e => e.from === current ? e.to : e.from);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dfs(neighbor, visited, depth + 1);
        visited.delete(neighbor);
      }
    }
  }

  const visited = new Set<WWNN>([source]);
  dfs(source, visited, 0);
  return pathCount;
}
