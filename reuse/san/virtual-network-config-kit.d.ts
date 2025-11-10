/**
 * LOC: VN-CONFIG-001
 * File: /reuse/san/virtual-network-config-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @types/sequelize
 *
 * DOWNSTREAM (imported by):
 *   - SAN network configuration services
 *   - Virtual network management controllers
 *   - QoS and bandwidth management components
 */
/**
 * File: /reuse/san/virtual-network-config-kit.ts
 * Locator: WC-SAN-CONFIG-001
 * Purpose: Comprehensive Virtual Network Configuration Management - interface, VLAN, QoS, bandwidth, policies
 *
 * Upstream: Independent utility module for virtual network configuration
 * Downstream: ../backend/san/*, network controllers, configuration services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for network interfaces, VLAN config, QoS, bandwidth allocation, network profiles
 *
 * LLM Context: Enterprise-grade virtual network configuration toolkit for software-defined networks (SDN).
 * Provides network interface configuration, VLAN tagging, QoS policy management, bandwidth allocation,
 * traffic throttling, network profiles, policy enforcement, and port configuration. Essential for SAN infrastructure.
 */
import { Sequelize, Transaction } from 'sequelize';
interface NetworkInterface {
    id: string;
    nodeId: string;
    name: string;
    type: 'physical' | 'virtual' | 'bridge' | 'tunnel';
    macAddress?: string;
    ipAddress?: string;
    ipv6Address?: string;
    subnetMask?: string;
    mtu: number;
    speed: number;
    duplex: 'half' | 'full' | 'auto';
    status: 'up' | 'down' | 'admin-down' | 'testing';
    enabled: boolean;
    metadata: Record<string, any>;
}
interface VLANConfig {
    id: number;
    name: string;
    description?: string;
    priority: number;
    tagged: boolean;
    trunkPorts: string[];
    accessPorts: string[];
    metadata: Record<string, any>;
}
interface QoSPolicy {
    id: string;
    name: string;
    description?: string;
    priority: number;
    bandwidth: number;
    burstSize?: number;
    rules: QoSRule[];
    enabled: boolean;
    metadata: Record<string, any>;
}
interface QoSRule {
    id: string;
    name: string;
    match: TrafficMatch;
    action: TrafficAction;
    priority: number;
}
interface TrafficMatch {
    protocol?: string;
    sourceIP?: string;
    destinationIP?: string;
    sourcePort?: number;
    destinationPort?: number;
    dscp?: number;
    vlanId?: number;
}
interface TrafficAction {
    type: 'allow' | 'deny' | 'mark' | 'shape' | 'police';
    markDSCP?: number;
    rateLimit?: number;
    priority?: number;
}
interface BandwidthAllocation {
    interfaceId: string;
    totalBandwidth: number;
    committed: number;
    burst: number;
    allocations: Map<string, number>;
    reserved: number;
    available: number;
}
interface NetworkProfile {
    id: string;
    name: string;
    description?: string;
    interfaceConfigs: Partial<NetworkInterface>[];
    vlanConfigs: VLANConfig[];
    qosPolicies: QoSPolicy[];
    metadata: Record<string, any>;
}
interface NetworkPolicy {
    id: string;
    name: string;
    type: 'firewall' | 'routing' | 'acl' | 'nat';
    rules: PolicyRule[];
    priority: number;
    enabled: boolean;
}
interface PolicyRule {
    id: string;
    action: 'allow' | 'deny';
    source: string;
    destination: string;
    protocol?: string;
    port?: number;
    priority: number;
}
interface PortMirrorConfig {
    sourcePort: string;
    destinationPort: string;
    direction: 'ingress' | 'egress' | 'both';
    enabled: boolean;
}
interface TrafficShapingConfig {
    maxRate: number;
    minRate: number;
    burstSize: number;
    algorithm: 'token-bucket' | 'leaky-bucket' | 'htb';
}
interface InterfaceStatistics {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
    rxErrors: number;
    txErrors: number;
    rxDropped: number;
    txDropped: number;
    timestamp: Date;
}
/**
 * Sequelize model for Network Interfaces.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkInterface model
 *
 * @example
 * ```typescript
 * const Interface = createNetworkInterfaceModel(sequelize);
 * const iface = await Interface.create({
 *   nodeId: 'node-123',
 *   name: 'eth0',
 *   type: 'physical',
 *   ipAddress: '10.0.1.10',
 *   mtu: 1500,
 *   speed: 10000
 * });
 * ```
 */
export declare const createNetworkInterfaceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        nodeId: string;
        name: string;
        type: string;
        macAddress: string | null;
        ipAddress: string | null;
        ipv6Address: string | null;
        subnetMask: string | null;
        mtu: number;
        speed: number;
        duplex: string;
        status: string;
        enabled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for VLAN Configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VLANConfig model
 *
 * @example
 * ```typescript
 * const VLAN = createVLANConfigModel(sequelize);
 * const vlan = await VLAN.create({
 *   id: 100,
 *   name: 'Production',
 *   priority: 5,
 *   tagged: true,
 *   trunkPorts: ['eth0', 'eth1']
 * });
 * ```
 */
export declare const createVLANConfigModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        topologyId: string;
        name: string;
        description: string | null;
        priority: number;
        tagged: boolean;
        trunkPorts: string[];
        accessPorts: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for QoS Policies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QoSPolicy model
 *
 * @example
 * ```typescript
 * const QoS = createQoSPolicyModel(sequelize);
 * const policy = await QoS.create({
 *   name: 'Voice-Priority',
 *   priority: 7,
 *   bandwidth: 1000,
 *   rules: [...]
 * });
 * ```
 */
export declare const createQoSPolicyModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        topologyId: string;
        name: string;
        description: string | null;
        priority: number;
        bandwidth: number;
        burstSize: number | null;
        rules: any[];
        enabled: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkInterface>} interfaceData - Interface data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Created interface
 *
 * @example
 * ```typescript
 * const iface = await createNetworkInterface(sequelize, {
 *   nodeId: 'node-123',
 *   name: 'eth0',
 *   type: 'physical',
 *   ipAddress: '10.0.1.10',
 *   mtu: 1500
 * });
 * ```
 */
export declare const createNetworkInterface: (sequelize: Sequelize, interfaceData: Partial<NetworkInterface>, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Updates network interface configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {Partial<NetworkInterface>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const updated = await updateInterfaceConfig(sequelize, 'iface-123', {
 *   ipAddress: '10.0.1.20',
 *   mtu: 9000
 * });
 * ```
 */
export declare const updateInterfaceConfig: (sequelize: Sequelize, interfaceId: string, updates: Partial<NetworkInterface>, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Deletes a network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkInterface(sequelize, 'iface-123');
 * ```
 */
export declare const deleteNetworkInterface: (sequelize: Sequelize, interfaceId: string, transaction?: Transaction) => Promise<void>;
/**
 * Validates interface settings.
 *
 * @param {NetworkInterface} iface - Interface to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateInterfaceSettings(iface);
 * if (!result.valid) {
 *   console.error('Configuration errors:', result.errors);
 * }
 * ```
 */
export declare const validateInterfaceSettings: (iface: NetworkInterface) => {
    valid: boolean;
    errors: string[];
};
/**
 * Enables or disables a network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {boolean} enabled - Enable or disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await enableDisableInterface(sequelize, 'iface-123', true);
 * ```
 */
export declare const enableDisableInterface: (sequelize: Sequelize, interfaceId: string, enabled: boolean, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Assigns IP address to an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} ipAddress - IP address
 * @param {string} subnetMask - Subnet mask
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await assignInterfaceIP(sequelize, 'iface-123', '10.0.1.10', '255.255.255.0');
 * ```
 */
export declare const assignInterfaceIP: (sequelize: Sequelize, interfaceId: string, ipAddress: string, subnetMask: string, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Configures interface MTU (Maximum Transmission Unit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} mtu - MTU value (68-9000)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureInterfaceMTU(sequelize, 'iface-123', 9000);
 * ```
 */
export declare const configureInterfaceMTU: (sequelize: Sequelize, interfaceId: string, mtu: number, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Creates a VLAN configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<VLANConfig>} vlanData - VLAN data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Created VLAN
 *
 * @example
 * ```typescript
 * const vlan = await createVLANConfig(sequelize, {
 *   id: 100,
 *   topologyId: 'topo-123',
 *   name: 'Production',
 *   priority: 5
 * });
 * ```
 */
export declare const createVLANConfig: (sequelize: Sequelize, vlanData: Partial<VLANConfig>, transaction?: Transaction) => Promise<VLANConfig>;
/**
 * Updates VLAN tags and configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {Partial<VLANConfig>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await updateVLANTags(sequelize, 100, {
 *   priority: 7,
 *   trunkPorts: ['eth0', 'eth1', 'eth2']
 * });
 * ```
 */
export declare const updateVLANTags: (sequelize: Sequelize, vlanId: number, updates: Partial<VLANConfig>, transaction?: Transaction) => Promise<VLANConfig>;
/**
 * Deletes a VLAN configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteVLANConfig(sequelize, 100);
 * ```
 */
export declare const deleteVLANConfig: (sequelize: Sequelize, vlanId: number, transaction?: Transaction) => Promise<void>;
/**
 * Validates VLAN ID range (1-4094).
 *
 * @param {number} vlanId - VLAN ID to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateVLANRange(100); // true
 * const invalid = validateVLANRange(5000); // false
 * ```
 */
export declare const validateVLANRange: (vlanId: number) => boolean;
/**
 * Assigns priority to VLAN (0-7).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {number} priority - Priority value (0-7)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await assignVLANPriority(sequelize, 100, 7);
 * ```
 */
export declare const assignVLANPriority: (sequelize: Sequelize, vlanId: number, priority: number, transaction?: Transaction) => Promise<VLANConfig>;
/**
 * Configures VLAN trunking on ports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {string[]} trunkPorts - Trunk port interfaces
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await configureVLANTrunking(sequelize, 100, ['eth0', 'eth1']);
 * ```
 */
export declare const configureVLANTrunking: (sequelize: Sequelize, vlanId: number, trunkPorts: string[], transaction?: Transaction) => Promise<VLANConfig>;
/**
 * Validates VLAN membership configuration.
 *
 * @param {VLANConfig} vlan - VLAN configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVLANMembership(vlan);
 * ```
 */
export declare const validateVLANMembership: (vlan: VLANConfig) => {
    valid: boolean;
    errors: string[];
};
/**
 * Creates a QoS policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<QoSPolicy>} policyData - QoS policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<QoSPolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createQoSPolicy(sequelize, {
 *   topologyId: 'topo-123',
 *   name: 'Voice-Priority',
 *   priority: 7,
 *   bandwidth: 1000
 * });
 * ```
 */
export declare const createQoSPolicy: (sequelize: Sequelize, policyData: Partial<QoSPolicy>, transaction?: Transaction) => Promise<QoSPolicy>;
/**
 * Updates QoS rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {QoSRule[]} rules - Updated rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<QoSPolicy>} Updated policy
 *
 * @example
 * ```typescript
 * const policy = await updateQoSRules(sequelize, 'policy-123', [
 *   { id: 'rule-1', name: 'Voice', match: {...}, action: {...}, priority: 7 }
 * ]);
 * ```
 */
export declare const updateQoSRules: (sequelize: Sequelize, policyId: string, rules: QoSRule[], transaction?: Transaction) => Promise<QoSPolicy>;
/**
 * Deletes a QoS policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteQoSPolicy(sequelize, 'policy-123');
 * ```
 */
export declare const deleteQoSPolicy: (sequelize: Sequelize, policyId: string, transaction?: Transaction) => Promise<void>;
/**
 * Applies QoS policy to an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} policyId - QoS policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await applyQoSToInterface(sequelize, 'iface-123', 'policy-123');
 * ```
 */
export declare const applyQoSToInterface: (sequelize: Sequelize, interfaceId: string, policyId: string, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Prioritizes traffic based on DSCP/CoS values.
 *
 * @param {QoSPolicy} policy - QoS policy
 * @param {TrafficMatch} traffic - Traffic to match
 * @returns {number} Priority level (0-7)
 *
 * @example
 * ```typescript
 * const priority = prioritizeTraffic(policy, {
 *   protocol: 'UDP',
 *   destinationPort: 5060
 * });
 * ```
 */
export declare const prioritizeTraffic: (policy: QoSPolicy, traffic: TrafficMatch) => number;
/**
 * Configures traffic shaping parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {TrafficShapingConfig} config - Shaping configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureTrafficShaping(sequelize, 'iface-123', {
 *   maxRate: 1000,
 *   minRate: 100,
 *   burstSize: 1500,
 *   algorithm: 'token-bucket'
 * });
 * ```
 */
export declare const configureTrafficShaping: (sequelize: Sequelize, interfaceId: string, config: TrafficShapingConfig, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Validates QoS configuration.
 *
 * @param {QoSPolicy} policy - QoS policy to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateQoSConfiguration(policy);
 * ```
 */
export declare const validateQoSConfiguration: (policy: QoSPolicy) => {
    valid: boolean;
    errors: string[];
};
/**
 * Allocates bandwidth to an interface or service.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} serviceId - Service identifier
 * @param {number} bandwidth - Bandwidth in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Bandwidth allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateBandwidth(sequelize, 'iface-123', 'service-1', 500);
 * ```
 */
export declare const allocateBandwidth: (sequelize: Sequelize, interfaceId: string, serviceId: string, bandwidth: number, transaction?: Transaction) => Promise<BandwidthAllocation>;
/**
 * Configures bandwidth limit for an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} maxBandwidth - Maximum bandwidth in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureBandwidthLimit(sequelize, 'iface-123', 5000);
 * ```
 */
export declare const configureBandwidthLimit: (sequelize: Sequelize, interfaceId: string, maxBandwidth: number, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Implements traffic throttling/rate limiting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} rate - Throttle rate in Mbps
 * @param {number} burst - Burst size in KB
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await implementTrafficThrottling(sequelize, 'iface-123', 1000, 1500);
 * ```
 */
export declare const implementTrafficThrottling: (sequelize: Sequelize, interfaceId: string, rate: number, burst: number, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Calculates current bandwidth utilization.
 *
 * @param {NetworkInterface} iface - Network interface
 * @param {InterfaceStatistics} stats - Interface statistics
 * @returns {number} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = calculateBandwidthUtilization(iface, stats);
 * console.log(`${utilization}%`);
 * ```
 */
export declare const calculateBandwidthUtilization: (iface: NetworkInterface, stats: InterfaceStatistics) => number;
/**
 * Reserves bandwidth for critical services.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} bandwidth - Bandwidth to reserve in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * const allocation = await reserveBandwidth(sequelize, 'iface-123', 2000);
 * ```
 */
export declare const reserveBandwidth: (sequelize: Sequelize, interfaceId: string, bandwidth: number, transaction?: Transaction) => Promise<BandwidthAllocation>;
/**
 * Releases reserved bandwidth.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} serviceId - Service identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * const allocation = await releaseBandwidth(sequelize, 'iface-123', 'service-1');
 * ```
 */
export declare const releaseBandwidth: (sequelize: Sequelize, interfaceId: string, serviceId: string, transaction?: Transaction) => Promise<BandwidthAllocation>;
/**
 * Validates bandwidth allocation against interface capacity.
 *
 * @param {NetworkInterface} iface - Network interface
 * @param {BandwidthAllocation} allocation - Proposed allocation
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBandwidthAllocation(iface, allocation);
 * ```
 */
export declare const validateBandwidthAllocation: (iface: NetworkInterface, allocation: BandwidthAllocation) => {
    valid: boolean;
    errors: string[];
};
/**
 * Creates a reusable network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkProfile>} profileData - Profile data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Created profile
 *
 * @example
 * ```typescript
 * const profile = await createNetworkProfile(sequelize, {
 *   name: 'Standard-Server',
 *   description: 'Standard server network configuration',
 *   interfaceConfigs: [...],
 *   qosPolicies: [...]
 * });
 * ```
 */
export declare const createNetworkProfile: (sequelize: Sequelize, profileData: Partial<NetworkProfile>, transaction?: Transaction) => Promise<NetworkProfile>;
/**
 * Updates network profile settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} profileId - Profile ID
 * @param {Partial<NetworkProfile>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Updated profile
 *
 * @example
 * ```typescript
 * const profile = await updateNetworkProfile(sequelize, 'profile-123', {
 *   description: 'Updated description'
 * });
 * ```
 */
export declare const updateNetworkProfile: (sequelize: Sequelize, profileId: string, updates: Partial<NetworkProfile>, transaction?: Transaction) => Promise<NetworkProfile>;
/**
 * Deletes a network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} profileId - Profile ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkProfile(sequelize, 'profile-123');
 * ```
 */
export declare const deleteNetworkProfile: (sequelize: Sequelize, profileId: string, transaction?: Transaction) => Promise<void>;
/**
 * Applies network profile to a node.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {string} profileId - Profile ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyNetworkProfile(sequelize, 'node-123', 'profile-123');
 * ```
 */
export declare const applyNetworkProfile: (sequelize: Sequelize, nodeId: string, profileId: string, transaction?: Transaction) => Promise<void>;
/**
 * Validates profile settings.
 *
 * @param {NetworkProfile} profile - Network profile
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateProfileSettings(profile);
 * ```
 */
export declare const validateProfileSettings: (profile: NetworkProfile) => {
    valid: boolean;
    errors: string[];
};
/**
 * Clones an existing network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceProfileId - Source profile ID
 * @param {string} newName - New profile name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Cloned profile
 *
 * @example
 * ```typescript
 * const clone = await cloneNetworkProfile(sequelize, 'profile-123', 'Cloned-Profile');
 * ```
 */
export declare const cloneNetworkProfile: (sequelize: Sequelize, sourceProfileId: string, newName: string, transaction?: Transaction) => Promise<NetworkProfile>;
/**
 * Creates a network policy (firewall, ACL, routing).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkPolicy>} policyData - Policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkPolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createNetworkPolicy(sequelize, {
 *   name: 'DMZ-Firewall',
 *   type: 'firewall',
 *   rules: [...],
 *   priority: 10
 * });
 * ```
 */
export declare const createNetworkPolicy: (sequelize: Sequelize, policyData: Partial<NetworkPolicy>, transaction?: Transaction) => Promise<NetworkPolicy>;
/**
 * Enforces security policy on network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {string[]} nodeIds - Node IDs to apply policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enforceSecurityPolicy(sequelize, 'policy-123', ['node-1', 'node-2']);
 * ```
 */
export declare const enforceSecurityPolicy: (sequelize: Sequelize, policyId: string, nodeIds: string[], transaction?: Transaction) => Promise<void>;
/**
 * Validates policy compliance.
 *
 * @param {NetworkPolicy} policy - Network policy
 * @returns {{ compliant: boolean; violations: string[] }} Compliance result
 *
 * @example
 * ```typescript
 * const result = validatePolicyCompliance(policy);
 * ```
 */
export declare const validatePolicyCompliance: (policy: NetworkPolicy) => {
    compliant: boolean;
    violations: string[];
};
/**
 * Applies firewall rules to network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {PolicyRule[]} rules - Firewall rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyFirewallRules(sequelize, 'node-123', [
 *   { id: 'rule-1', action: 'deny', source: '0.0.0.0/0', destination: '10.0.0.0/8', priority: 1 }
 * ]);
 * ```
 */
export declare const applyFirewallRules: (sequelize: Sequelize, nodeId: string, rules: PolicyRule[], transaction?: Transaction) => Promise<void>;
/**
 * Configures policy priority and order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {number} priority - Priority value
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkPolicy>} Updated policy
 *
 * @example
 * ```typescript
 * const policy = await configurePolicyPriority(sequelize, 'policy-123', 100);
 * ```
 */
export declare const configurePolicyPriority: (sequelize: Sequelize, policyId: string, priority: number, transaction?: Transaction) => Promise<NetworkPolicy>;
/**
 * Configures port mirroring/SPAN.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {PortMirrorConfig} config - Mirror configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configurePortMirroring(sequelize, 'node-123', {
 *   sourcePort: 'eth0',
 *   destinationPort: 'eth1',
 *   direction: 'both',
 *   enabled: true
 * });
 * ```
 */
export declare const configurePortMirroring: (sequelize: Sequelize, nodeId: string, config: PortMirrorConfig, transaction?: Transaction) => Promise<void>;
/**
 * Enables or disables a port.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {boolean} enabled - Enable or disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await enableDisablePort(sequelize, 'iface-123', false);
 * ```
 */
export declare const enableDisablePort: (sequelize: Sequelize, interfaceId: string, enabled: boolean, transaction?: Transaction) => Promise<NetworkInterface>;
/**
 * Validates port configuration.
 *
 * @param {NetworkInterface} port - Port interface
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePortConfiguration(port);
 * ```
 */
export declare const validatePortConfiguration: (port: NetworkInterface) => {
    valid: boolean;
    errors: string[];
};
declare const _default: {
    createNetworkInterfaceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            nodeId: string;
            name: string;
            type: string;
            macAddress: string | null;
            ipAddress: string | null;
            ipv6Address: string | null;
            subnetMask: string | null;
            mtu: number;
            speed: number;
            duplex: string;
            status: string;
            enabled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createVLANConfigModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            topologyId: string;
            name: string;
            description: string | null;
            priority: number;
            tagged: boolean;
            trunkPorts: string[];
            accessPorts: string[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createQoSPolicyModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            topologyId: string;
            name: string;
            description: string | null;
            priority: number;
            bandwidth: number;
            burstSize: number | null;
            rules: any[];
            enabled: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkInterface: (sequelize: Sequelize, interfaceData: Partial<NetworkInterface>, transaction?: Transaction) => Promise<NetworkInterface>;
    updateInterfaceConfig: (sequelize: Sequelize, interfaceId: string, updates: Partial<NetworkInterface>, transaction?: Transaction) => Promise<NetworkInterface>;
    deleteNetworkInterface: (sequelize: Sequelize, interfaceId: string, transaction?: Transaction) => Promise<void>;
    validateInterfaceSettings: (iface: NetworkInterface) => {
        valid: boolean;
        errors: string[];
    };
    enableDisableInterface: (sequelize: Sequelize, interfaceId: string, enabled: boolean, transaction?: Transaction) => Promise<NetworkInterface>;
    assignInterfaceIP: (sequelize: Sequelize, interfaceId: string, ipAddress: string, subnetMask: string, transaction?: Transaction) => Promise<NetworkInterface>;
    configureInterfaceMTU: (sequelize: Sequelize, interfaceId: string, mtu: number, transaction?: Transaction) => Promise<NetworkInterface>;
    createVLANConfig: (sequelize: Sequelize, vlanData: Partial<VLANConfig>, transaction?: Transaction) => Promise<VLANConfig>;
    updateVLANTags: (sequelize: Sequelize, vlanId: number, updates: Partial<VLANConfig>, transaction?: Transaction) => Promise<VLANConfig>;
    deleteVLANConfig: (sequelize: Sequelize, vlanId: number, transaction?: Transaction) => Promise<void>;
    validateVLANRange: (vlanId: number) => boolean;
    assignVLANPriority: (sequelize: Sequelize, vlanId: number, priority: number, transaction?: Transaction) => Promise<VLANConfig>;
    configureVLANTrunking: (sequelize: Sequelize, vlanId: number, trunkPorts: string[], transaction?: Transaction) => Promise<VLANConfig>;
    validateVLANMembership: (vlan: VLANConfig) => {
        valid: boolean;
        errors: string[];
    };
    createQoSPolicy: (sequelize: Sequelize, policyData: Partial<QoSPolicy>, transaction?: Transaction) => Promise<QoSPolicy>;
    updateQoSRules: (sequelize: Sequelize, policyId: string, rules: QoSRule[], transaction?: Transaction) => Promise<QoSPolicy>;
    deleteQoSPolicy: (sequelize: Sequelize, policyId: string, transaction?: Transaction) => Promise<void>;
    applyQoSToInterface: (sequelize: Sequelize, interfaceId: string, policyId: string, transaction?: Transaction) => Promise<NetworkInterface>;
    prioritizeTraffic: (policy: QoSPolicy, traffic: TrafficMatch) => number;
    configureTrafficShaping: (sequelize: Sequelize, interfaceId: string, config: TrafficShapingConfig, transaction?: Transaction) => Promise<NetworkInterface>;
    validateQoSConfiguration: (policy: QoSPolicy) => {
        valid: boolean;
        errors: string[];
    };
    allocateBandwidth: (sequelize: Sequelize, interfaceId: string, serviceId: string, bandwidth: number, transaction?: Transaction) => Promise<BandwidthAllocation>;
    configureBandwidthLimit: (sequelize: Sequelize, interfaceId: string, maxBandwidth: number, transaction?: Transaction) => Promise<NetworkInterface>;
    implementTrafficThrottling: (sequelize: Sequelize, interfaceId: string, rate: number, burst: number, transaction?: Transaction) => Promise<NetworkInterface>;
    calculateBandwidthUtilization: (iface: NetworkInterface, stats: InterfaceStatistics) => number;
    reserveBandwidth: (sequelize: Sequelize, interfaceId: string, bandwidth: number, transaction?: Transaction) => Promise<BandwidthAllocation>;
    releaseBandwidth: (sequelize: Sequelize, interfaceId: string, serviceId: string, transaction?: Transaction) => Promise<BandwidthAllocation>;
    validateBandwidthAllocation: (iface: NetworkInterface, allocation: BandwidthAllocation) => {
        valid: boolean;
        errors: string[];
    };
    createNetworkProfile: (sequelize: Sequelize, profileData: Partial<NetworkProfile>, transaction?: Transaction) => Promise<NetworkProfile>;
    updateNetworkProfile: (sequelize: Sequelize, profileId: string, updates: Partial<NetworkProfile>, transaction?: Transaction) => Promise<NetworkProfile>;
    deleteNetworkProfile: (sequelize: Sequelize, profileId: string, transaction?: Transaction) => Promise<void>;
    applyNetworkProfile: (sequelize: Sequelize, nodeId: string, profileId: string, transaction?: Transaction) => Promise<void>;
    validateProfileSettings: (profile: NetworkProfile) => {
        valid: boolean;
        errors: string[];
    };
    cloneNetworkProfile: (sequelize: Sequelize, sourceProfileId: string, newName: string, transaction?: Transaction) => Promise<NetworkProfile>;
    createNetworkPolicy: (sequelize: Sequelize, policyData: Partial<NetworkPolicy>, transaction?: Transaction) => Promise<NetworkPolicy>;
    enforceSecurityPolicy: (sequelize: Sequelize, policyId: string, nodeIds: string[], transaction?: Transaction) => Promise<void>;
    validatePolicyCompliance: (policy: NetworkPolicy) => {
        compliant: boolean;
        violations: string[];
    };
    applyFirewallRules: (sequelize: Sequelize, nodeId: string, rules: PolicyRule[], transaction?: Transaction) => Promise<void>;
    configurePolicyPriority: (sequelize: Sequelize, policyId: string, priority: number, transaction?: Transaction) => Promise<NetworkPolicy>;
    configurePortMirroring: (sequelize: Sequelize, nodeId: string, config: PortMirrorConfig, transaction?: Transaction) => Promise<void>;
    enableDisablePort: (sequelize: Sequelize, interfaceId: string, enabled: boolean, transaction?: Transaction) => Promise<NetworkInterface>;
    validatePortConfiguration: (port: NetworkInterface) => {
        valid: boolean;
        errors: string[];
    };
};
export default _default;
//# sourceMappingURL=virtual-network-config-kit.d.ts.map