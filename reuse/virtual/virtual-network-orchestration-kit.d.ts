/**
 * LOC: VNO4K7L9M2
 * File: /reuse/virtual/virtual-network-orchestration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network orchestration services
 *   - Virtual infrastructure modules
 *   - Cloud networking integrations
 *   - Network topology analyzers
 */
/**
 * File: /reuse/virtual/virtual-network-orchestration-kit.ts
 * Locator: WC-UTL-NET-002
 * Purpose: Virtual Network Orchestration Toolkit - Complete software-defined networking utilities
 *
 * Upstream: Independent utility module for network virtualization operations
 * Downstream: ../backend/*, Network services, Infrastructure modules, Topology analyzers
 * Dependencies: TypeScript 5.x, Node 18+, network libraries, topology engines
 * Exports: 47 utility functions for SDN, virtual networking, firewalls, load balancers, VPN, topology
 *
 * LLM Context: Enterprise-grade virtual network orchestration utilities for White Cross platform.
 * Provides software-defined networking, virtual switches, distributed firewalls, load balancing,
 * VPN management, network topology analysis, health monitoring, and high-availability networking
 * for complex healthcare infrastructure deployments.
 */
/**
 * Virtual network configuration
 */
export interface VirtualNetworkConfig {
    id: string;
    name: string;
    cidr: string;
    gateway?: string;
    dns?: string[];
    mtu?: number;
    vlan?: number;
    tags?: Record<string, string>;
}
/**
 * Virtual switch configuration
 */
export interface VirtualSwitchConfig {
    id: string;
    name: string;
    portCount: number;
    type: 'distributed' | 'standard';
    mtu: number;
    vlanRange?: [number, number];
}
/**
 * Port group definition
 */
export interface PortGroupConfig {
    id: string;
    name: string;
    vlan: number;
    nicTeaming?: 'active-active' | 'active-standby' | 'load-balance';
    security?: PortGroupSecurity;
}
/**
 * Port group security settings
 */
export interface PortGroupSecurity {
    promiscuousMode: boolean;
    macChanges: boolean;
    forgedTransmits: boolean;
}
/**
 * Firewall policy definition
 */
export interface FirewallPolicy {
    id: string;
    name: string;
    direction: 'inbound' | 'outbound' | 'both';
    enabled: boolean;
    rules: FirewallRule[];
    priority?: number;
}
/**
 * Firewall rule configuration
 */
export interface FirewallRule {
    id: string;
    name: string;
    action: 'allow' | 'deny' | 'drop' | 'reject';
    protocol: 'tcp' | 'udp' | 'icmp' | 'all';
    sourceIP?: string;
    destIP?: string;
    sourcePort?: number;
    destPort?: number;
    enabled: boolean;
    logging?: boolean;
}
/**
 * Security group definition
 */
export interface SecurityGroup {
    id: string;
    name: string;
    description?: string;
    rules: SecurityGroupRule[];
    members: string[];
}
/**
 * Security group rule
 */
export interface SecurityGroupRule {
    id: string;
    direction: 'inbound' | 'outbound';
    protocol: string;
    portRange?: [number, number];
    source?: string;
    destination?: string;
}
/**
 * Load balancer configuration
 */
export interface LoadBalancerConfig {
    id: string;
    name: string;
    algorithm: 'round-robin' | 'least-conn' | 'ip-hash' | 'random' | 'weighted';
    healthCheckInterval: number;
    healthCheckTimeout: number;
    maxConnections?: number;
    stickySessions?: boolean;
}
/**
 * Load balancer pool member
 */
export interface PoolMember {
    id: string;
    address: string;
    port: number;
    weight?: number;
    enabled: boolean;
    healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
}
/**
 * VPN connection configuration
 */
export interface VPNConfig {
    id: string;
    name: string;
    type: 'site-to-site' | 'client-to-site' | 'mesh';
    protocol: 'ipsec' | 'wireguard' | 'openvpn' | 'l2tp';
    encryption: 'aes128' | 'aes256' | 'chacha20';
    authentication: 'preshared' | 'certificate' | 'mutual';
    enabled: boolean;
}
/**
 * Network interface configuration
 */
export interface NetworkInterface {
    id: string;
    name: string;
    mac: string;
    ip?: string;
    netmask?: string;
    mtu: number;
    enabled: boolean;
}
/**
 * Network topology node
 */
export interface TopologyNode {
    id: string;
    name: string;
    type: 'host' | 'router' | 'switch' | 'firewall' | 'lb' | 'vpn-gateway' | 'appliance';
    ip?: string;
    connections: string[];
    metadata?: Record<string, any>;
}
/**
 * Network topology map
 */
export interface NetworkTopology {
    nodes: TopologyNode[];
    edges: Array<{
        source: string;
        target: string;
        latency?: number;
        bandwidth?: number;
    }>;
    timestamp: number;
}
/**
 * Network statistics
 */
export interface NetworkStats {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    errors: number;
    drops: number;
    timestamp: number;
}
/**
 * Health check configuration
 */
export interface HealthCheckConfig {
    interval: number;
    timeout: number;
    unhealthyThreshold: number;
    healthyThreshold: number;
    path?: string;
    method?: 'tcp' | 'http' | 'https' | 'udp';
}
/**
 * Creates a new virtual network with specified CIDR block.
 *
 * @param {VirtualNetworkConfig} config - Virtual network configuration
 * @returns {VirtualNetworkConfig} Created virtual network
 *
 * @example
 * ```typescript
 * const vnet = createVirtualNetwork({
 *   id: 'vnet-001',
 *   name: 'Healthcare-Network',
 *   cidr: '10.0.0.0/16',
 *   dns: ['8.8.8.8', '8.8.4.4']
 * });
 * ```
 */
export declare const createVirtualNetwork: (config: VirtualNetworkConfig) => VirtualNetworkConfig;
/**
 * Configures a virtual switch with NIC teaming and VLAN support.
 *
 * @param {VirtualSwitchConfig} config - Virtual switch configuration
 * @returns {VirtualSwitchConfig} Configured virtual switch
 *
 * @example
 * ```typescript
 * const vswitch = configureVirtualSwitch({
 *   id: 'vswitch-001',
 *   name: 'Primary-VSwitchì',
 *   portCount: 64,
 *   type: 'distributed',
 *   mtu: 9000
 * });
 * ```
 */
export declare const configureVirtualSwitch: (config: VirtualSwitchConfig) => VirtualSwitchConfig;
/**
 * Creates a port group on a virtual switch.
 *
 * @param {PortGroupConfig} config - Port group configuration
 * @returns {PortGroupConfig} Created port group
 *
 * @example
 * ```typescript
 * const portGroup = createPortGroup({
 *   id: 'pg-001',
 *   name: 'Production-PG',
 *   vlan: 100,
 *   nicTeaming: 'active-active'
 * });
 * ```
 */
export declare const createPortGroup: (config: PortGroupConfig) => PortGroupConfig;
/**
 * Attaches a virtual network interface to a port group.
 *
 * @param {NetworkInterface} intf - Network interface configuration
 * @param {string} portGroupId - Port group ID
 * @returns {NetworkInterface} Attached interface
 *
 * @example
 * ```typescript
 * const attached = attachVirtualInterface(
 *   { id: 'vnic-001', name: 'eth0', mac: '00:11:22:33:44:55', mtu: 1500, enabled: true },
 *   'pg-001'
 * );
 * ```
 */
export declare const attachVirtualInterface: (intf: NetworkInterface, portGroupId: string) => NetworkInterface;
/**
 * Detaches a virtual network interface from port group.
 *
 * @param {string} interfaceId - Network interface ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const success = detachVirtualInterface('vnic-001');
 * ```
 */
export declare const detachVirtualInterface: (interfaceId: string) => boolean;
/**
 * Retrieves network statistics for a virtual network.
 *
 * @param {string} networkId - Virtual network ID
 * @returns {NetworkStats} Network statistics
 *
 * @example
 * ```typescript
 * const stats = getVirtualNetworkStats('vnet-001');
 * console.log(`Traffic: ${stats.bytesIn}/${stats.bytesOut} bytes`);
 * ```
 */
export declare const getVirtualNetworkStats: (networkId: string) => NetworkStats;
/**
 * Lists all virtual networks in environment.
 *
 * @returns {VirtualNetworkConfig[]} Array of virtual networks
 *
 * @example
 * ```typescript
 * const networks = listVirtualNetworks();
 * networks.forEach(net => console.log(net.name, net.cidr));
 * ```
 */
export declare const listVirtualNetworks: () => VirtualNetworkConfig[];
/**
 * Deletes a virtual network and associated resources.
 *
 * @param {string} networkId - Virtual network ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const deleted = deleteVirtualNetwork('vnet-001');
 * ```
 */
export declare const deleteVirtualNetwork: (networkId: string) => boolean;
/**
 * Creates a network function (NFV) for packet processing.
 *
 * @param {string} name - Function name
 * @param {string} image - Container/VM image URI
 * @param {Record<string, any>} config - Function configuration
 * @returns {Record<string, any>} Network function metadata
 *
 * @example
 * ```typescript
 * const nf = createNetworkFunction(
 *   'packet-inspector',
 *   'registry.example.com/pkt-inspector:latest',
 *   { cpus: 2, memory: 4096 }
 * );
 * ```
 */
export declare const createNetworkFunction: (name: string, image: string, config: Record<string, any>) => Record<string, any>;
/**
 * Deploys a virtual network appliance (firewall, IDS, etc).
 *
 * @param {string} type - Appliance type
 * @param {string} location - Deployment location/network
 * @param {Record<string, any>} config - Appliance configuration
 * @returns {Record<string, any>} Deployed appliance info
 *
 * @example
 * ```typescript
 * const fw = deployVirtualAppliance('firewall', 'vnet-001', {
 *   licensing: 'advanced',
 *   threatLevel: 'high'
 * });
 * ```
 */
export declare const deployVirtualAppliance: (type: string, location: string, config: Record<string, any>) => Record<string, any>;
/**
 * Configures service chaining for network functions.
 *
 * @param {string[]} functionIds - Network function IDs in order
 * @returns {Record<string, any>} Chain configuration
 *
 * @example
 * ```typescript
 * const chain = configureNetworkChaining(['nf-001', 'nf-002', 'nf-003']);
 * ```
 */
export declare const configureNetworkChaining: (functionIds: string[]) => Record<string, any>;
/**
 * Gets health status of a network function.
 *
 * @param {string} functionId - Network function ID
 * @returns {Record<string, any>} Health status
 *
 * @example
 * ```typescript
 * const health = getNetworkFunctionHealth('nf-001');
 * ```
 */
export declare const getNetworkFunctionHealth: (functionId: string) => Record<string, any>;
/**
 * Scales a network function horizontally or vertically.
 *
 * @param {string} functionId - Network function ID
 * @param {string} direction - 'up' or 'down'
 * @returns {Record<string, any>} Scaling result
 *
 * @example
 * ```typescript
 * const result = scaleNetworkFunction('nf-001', 'up');
 * ```
 */
export declare const scaleNetworkFunction: (functionId: string, direction: "up" | "down") => Record<string, any>;
/**
 * Removes a network function from service.
 *
 * @param {string} functionId - Network function ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const removed = removeNetworkFunction('nf-001');
 * ```
 */
export declare const removeNetworkFunction: (functionId: string) => boolean;
/**
 * Validates end-to-end network path connectivity.
 *
 * @param {string} sourceId - Source node ID
 * @param {string} destId - Destination node ID
 * @returns {Record<string, any>} Path validation result
 *
 * @example
 * ```typescript
 * const path = validateNetworkPath('host-001', 'host-002');
 * ```
 */
export declare const validateNetworkPath: (sourceId: string, destId: string) => Record<string, any>;
/**
 * Creates a distributed firewall policy.
 *
 * @param {Omit<FirewallPolicy, 'rules'>} config - Policy configuration
 * @returns {FirewallPolicy} Created policy
 *
 * @example
 * ```typescript
 * const policy = createFirewallPolicy({
 *   id: 'fwp-001',
 *   name: 'Healthcare-Policy',
 *   direction: 'both',
 *   enabled: true
 * });
 * ```
 */
export declare const createFirewallPolicy: (config: Omit<FirewallPolicy, "rules">) => FirewallPolicy;
/**
 * Adds a firewall rule to a policy.
 *
 * @param {string} policyId - Policy ID
 * @param {FirewallRule} rule - Firewall rule
 * @returns {FirewallRule} Added rule
 *
 * @example
 * ```typescript
 * const rule = addFirewallRule('fwp-001', {
 *   id: 'fwr-001',
 *   name: 'Allow-HTTPS',
 *   action: 'allow',
 *   protocol: 'tcp',
 *   destPort: 443,
 *   enabled: true
 * });
 * ```
 */
export declare const addFirewallRule: (policyId: string, rule: FirewallRule) => FirewallRule;
/**
 * Removes a firewall rule from policy.
 *
 * @param {string} policyId - Policy ID
 * @param {string} ruleId - Rule ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const removed = removeFirewallRule('fwp-001', 'fwr-001');
 * ```
 */
export declare const removeFirewallRule: (policyId: string, ruleId: string) => boolean;
/**
 * Evaluates a firewall rule against traffic.
 *
 * @param {FirewallRule} rule - Firewall rule
 * @param {Record<string, any>} packet - Packet data
 * @returns {string} Evaluation result ('allow', 'deny', 'drop')
 *
 * @example
 * ```typescript
 * const result = evaluateFirewallRule(rule, {
 *   sourceIP: '192.168.1.100',
 *   destIP: '10.0.0.1',
 *   protocol: 'tcp',
 *   destPort: 443
 * });
 * ```
 */
export declare const evaluateFirewallRule: (rule: FirewallRule, packet: Record<string, any>) => string;
/**
 * Creates a security group for managing access rules.
 *
 * @param {Omit<SecurityGroup, 'members'>} config - Group configuration
 * @returns {SecurityGroup} Created security group
 *
 * @example
 * ```typescript
 * const sg = createSecurityGroup({
 *   id: 'sg-001',
 *   name: 'Database-Tier',
 *   rules: []
 * });
 * ```
 */
export declare const createSecurityGroup: (config: Omit<SecurityGroup, "members">) => SecurityGroup;
/**
 * Attaches a security group to a resource.
 *
 * @param {string} groupId - Security group ID
 * @param {string} resourceId - Resource ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const attached = attachSecurityGroup('sg-001', 'vm-001');
 * ```
 */
export declare const attachSecurityGroup: (groupId: string, resourceId: string) => boolean;
/**
 * Gets firewall statistics and metrics.
 *
 * @param {string} policyId - Policy ID
 * @returns {Record<string, any>} Firewall statistics
 *
 * @example
 * ```typescript
 * const stats = getFirewallStats('fwp-001');
 * console.log(`Packets inspected: ${stats.packetsInspected}`);
 * ```
 */
export declare const getFirewallStats: (policyId: string) => Record<string, any>;
/**
 * Validates firewall policy configuration for conflicts.
 *
 * @param {FirewallPolicy} policy - Policy to validate
 * @returns {Record<string, any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFirewallConfig(policy);
 * ```
 */
export declare const validateFirewallConfig: (policy: FirewallPolicy) => Record<string, any>;
/**
 * Creates a load balancer instance.
 *
 * @param {LoadBalancerConfig} config - Load balancer configuration
 * @returns {LoadBalancerConfig} Created load balancer
 *
 * @example
 * ```typescript
 * const lb = createLoadBalancer({
 *   id: 'lb-001',
 *   name: 'API-LB',
 *   algorithm: 'least-conn',
 *   healthCheckInterval: 10000,
 *   healthCheckTimeout: 5000
 * });
 * ```
 */
export declare const createLoadBalancer: (config: LoadBalancerConfig) => LoadBalancerConfig;
/**
 * Configures a backend pool for load balancer.
 *
 * @param {string} lbId - Load balancer ID
 * @param {string} poolName - Pool name
 * @param {PoolMember[]} members - Pool members
 * @returns {Record<string, any>} Pool configuration
 *
 * @example
 * ```typescript
 * const pool = configureLoadBalancerPool('lb-001', 'backend-pool', [
 *   { id: 'pm-001', address: '10.0.0.10', port: 8080, weight: 1, enabled: true }
 * ]);
 * ```
 */
export declare const configureLoadBalancerPool: (lbId: string, poolName: string, members: PoolMember[]) => Record<string, any>;
/**
 * Adds a member to load balancer pool.
 *
 * @param {string} poolId - Pool ID
 * @param {PoolMember} member - Pool member configuration
 * @returns {PoolMember} Added member
 *
 * @example
 * ```typescript
 * const member = addPoolMember('pool-001', {
 *   id: 'pm-002',
 *   address: '10.0.0.11',
 *   port: 8080,
 *   weight: 2,
 *   enabled: true
 * });
 * ```
 */
export declare const addPoolMember: (poolId: string, member: PoolMember) => PoolMember;
/**
 * Removes a member from load balancer pool.
 *
 * @param {string} poolId - Pool ID
 * @param {string} memberId - Member ID
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const removed = removePoolMember('pool-001', 'pm-002');
 * ```
 */
export declare const removePoolMember: (poolId: string, memberId: string) => boolean;
/**
 * Configures health check for pool members.
 *
 * @param {string} poolId - Pool ID
 * @param {HealthCheckConfig} config - Health check configuration
 * @returns {HealthCheckConfig} Configured health check
 *
 * @example
 * ```typescript
 * const hc = configureHealthCheck('pool-001', {
 *   interval: 10000,
 *   timeout: 5000,
 *   unhealthyThreshold: 3,
 *   healthyThreshold: 2,
 *   method: 'http',
 *   path: '/health'
 * });
 * ```
 */
export declare const configureHealthCheck: (poolId: string, config: HealthCheckConfig) => HealthCheckConfig;
/**
 * Sets the load balancing algorithm.
 *
 * @param {string} lbId - Load balancer ID
 * @param {string} algorithm - Algorithm type
 * @returns {Record<string, any>} Configuration result
 *
 * @example
 * ```typescript
 * const result = setLoadBalancingAlgorithm('lb-001', 'least-conn');
 * ```
 */
export declare const setLoadBalancingAlgorithm: (lbId: string, algorithm: string) => Record<string, any>;
/**
 * Gets load balancer metrics and performance data.
 *
 * @param {string} lbId - Load balancer ID
 * @returns {Record<string, any>} Load balancer metrics
 *
 * @example
 * ```typescript
 * const metrics = getLoadBalancerMetrics('lb-001');
 * console.log(`Requests/sec: ${metrics.requestsPerSecond}`);
 * ```
 */
export declare const getLoadBalancerMetrics: (lbId: string) => Record<string, any>;
/**
 * Creates a listener rule for routing traffic.
 *
 * @param {string} lbId - Load balancer ID
 * @param {Record<string, any>} rule - Listener rule
 * @returns {Record<string, any>} Created rule
 *
 * @example
 * ```typescript
 * const rule = createListenerRule('lb-001', {
 *   port: 443,
 *   protocol: 'https',
 *   targetPool: 'pool-001'
 * });
 * ```
 */
export declare const createListenerRule: (lbId: string, rule: Record<string, any>) => Record<string, any>;
/**
 * Validates load balancer configuration.
 *
 * @param {LoadBalancerConfig} config - Configuration to validate
 * @returns {Record<string, any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateLoadBalancerConfig(lbConfig);
 * ```
 */
export declare const validateLoadBalancerConfig: (config: LoadBalancerConfig) => Record<string, any>;
/**
 * Creates a VPN connection between sites.
 *
 * @param {VPNConfig} config - VPN configuration
 * @returns {VPNConfig} Created VPN connection
 *
 * @example
 * ```typescript
 * const vpn = createVPNConnection({
 *   id: 'vpn-001',
 *   name: 'HQ-to-Branch',
 *   type: 'site-to-site',
 *   protocol: 'ipsec',
 *   encryption: 'aes256',
 *   authentication: 'preshared',
 *   enabled: true
 * });
 * ```
 */
export declare const createVPNConnection: (config: VPNConfig) => VPNConfig;
/**
 * Configures IPSec tunnel parameters.
 *
 * @param {string} vpnId - VPN connection ID
 * @param {Record<string, any>} params - IPSec parameters
 * @returns {Record<string, any>} Tunnel configuration
 *
 * @example
 * ```typescript
 * const tunnel = configureIPSecTunnel('vpn-001', {
 *   dhGroup: 'group14',
 *   lifetime: 3600,
 *   rekeying: 'adaptive'
 * });
 * ```
 */
export declare const configureIPSecTunnel: (vpnId: string, params: Record<string, any>) => Record<string, any>;
/**
 * Creates a VPN gateway for client connections.
 *
 * @param {string} name - Gateway name
 * @param {string} network - Network/subnet
 * @param {Record<string, any>} config - Gateway configuration
 * @returns {Record<string, any>} VPN gateway
 *
 * @example
 * ```typescript
 * const gw = createVPNGateway('vpn-gw-001', 'vnet-001', {
 *   maxClients: 100,
 *   protocol: 'wireguard'
 * });
 * ```
 */
export declare const createVPNGateway: (name: string, network: string, config: Record<string, any>) => Record<string, any>;
/**
 * Attaches VPN client configuration.
 *
 * @param {string} gatewayId - Gateway ID
 * @param {string} clientId - Client ID
 * @param {Record<string, any>} config - Client configuration
 * @returns {boolean} Success status
 *
 * @example
 * ```typescript
 * const attached = attachVPNClient('vpn-gw-001', 'client-001', {
 *   certificate: 'cert.pem',
 *   keyPath: '/etc/vpn/keys'
 * });
 * ```
 */
export declare const attachVPNClient: (gatewayId: string, clientId: string, config: Record<string, any>) => boolean;
/**
 * Rotates VPN credentials and certificates.
 *
 * @param {string} vpnId - VPN connection ID
 * @returns {Record<string, any>} Rotation result
 *
 * @example
 * ```typescript
 * const result = rotateVPNCredentials('vpn-001');
 * ```
 */
export declare const rotateVPNCredentials: (vpnId: string) => Record<string, any>;
/**
 * Gets VPN statistics and connection status.
 *
 * @param {string} vpnId - VPN connection ID
 * @returns {Record<string, any>} VPN statistics
 *
 * @example
 * ```typescript
 * const stats = getVPNStats('vpn-001');
 * console.log(`Connected clients: ${stats.connectedClients}`);
 * ```
 */
export declare const getVPNStats: (vpnId: string) => Record<string, any>;
/**
 * Validates VPN configuration and connectivity.
 *
 * @param {VPNConfig} config - VPN configuration
 * @returns {Record<string, any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVPNConfig(vpnConfig);
 * ```
 */
export declare const validateVPNConfig: (config: VPNConfig) => Record<string, any>;
/**
 * Maps complete network topology with nodes and links.
 *
 * @returns {NetworkTopology} Network topology
 *
 * @example
 * ```typescript
 * const topology = mapNetworkTopology();
 * console.log(`Nodes: ${topology.nodes.length}, Links: ${topology.edges.length}`);
 * ```
 */
export declare const mapNetworkTopology: () => NetworkTopology;
/**
 * Detects loops in network topology.
 *
 * @param {NetworkTopology} topology - Network topology
 * @returns {Array<string[]>} Detected loops (paths)
 *
 * @example
 * ```typescript
 * const loops = detectNetworkLoops(topology);
 * ```
 */
export declare const detectNetworkLoops: (topology: NetworkTopology) => Array<string[]>;
/**
 * Calculates latency between network nodes.
 *
 * @param {string} sourceId - Source node ID
 * @param {string} destId - Destination node ID
 * @returns {number} Latency in milliseconds
 *
 * @example
 * ```typescript
 * const latency = calculateNetworkLatency('host-001', 'host-002');
 * console.log(`Latency: ${latency}ms`);
 * ```
 */
export declare const calculateNetworkLatency: (sourceId: string, destId: string) => number;
/**
 * Discovers network resources via protocol scanning.
 *
 * @param {string} cidr - CIDR block to scan
 * @returns {Record<string, any>[]} Discovered resources
 *
 * @example
 * ```typescript
 * const resources = discoverNetworkResources('10.0.0.0/24');
 * ```
 */
export declare const discoverNetworkResources: (cidr: string) => Record<string, any>[];
/**
 * Validates end-to-end connectivity between all nodes.
 *
 * @param {NetworkTopology} topology - Network topology
 * @returns {Record<string, any>} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNetworkConnectivity(topology);
 * ```
 */
export declare const validateNetworkConnectivity: (topology: NetworkTopology) => Record<string, any>;
/**
 * Optimizes network path for traffic.
 *
 * @param {string} sourceId - Source node ID
 * @param {string} destId - Destination node ID
 * @returns {string[]} Optimized path (node IDs)
 *
 * @example
 * ```typescript
 * const path = optimizeNetworkPath('host-001', 'host-002');
 * ```
 */
export declare const optimizeNetworkPath: (sourceId: string, destId: string) => string[];
/**
 * Generates visual representation of network topology.
 *
 * @param {NetworkTopology} topology - Network topology
 * @returns {string} SVG or DOT format visualization
 *
 * @example
 * ```typescript
 * const viz = getTopologyVisualization(topology);
 * fs.writeFileSync('topology.svg', viz);
 * ```
 */
export declare const getTopologyVisualization: (topology: NetworkTopology) => string;
/**
 * Analyzes network performance characteristics.
 *
 * @param {NetworkTopology} topology - Network topology
 * @returns {Record<string, any>} Performance analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeNetworkPerformance(topology);
 * console.log(`Avg latency: ${analysis.avgLatency}ms`);
 * ```
 */
export declare const analyzeNetworkPerformance: (topology: NetworkTopology) => Record<string, any>;
declare const _default: {
    createVirtualNetwork: (config: VirtualNetworkConfig) => VirtualNetworkConfig;
    configureVirtualSwitch: (config: VirtualSwitchConfig) => VirtualSwitchConfig;
    createPortGroup: (config: PortGroupConfig) => PortGroupConfig;
    attachVirtualInterface: (intf: NetworkInterface, portGroupId: string) => NetworkInterface;
    detachVirtualInterface: (interfaceId: string) => boolean;
    getVirtualNetworkStats: (networkId: string) => NetworkStats;
    listVirtualNetworks: () => VirtualNetworkConfig[];
    deleteVirtualNetwork: (networkId: string) => boolean;
    createNetworkFunction: (name: string, image: string, config: Record<string, any>) => Record<string, any>;
    deployVirtualAppliance: (type: string, location: string, config: Record<string, any>) => Record<string, any>;
    configureNetworkChaining: (functionIds: string[]) => Record<string, any>;
    getNetworkFunctionHealth: (functionId: string) => Record<string, any>;
    scaleNetworkFunction: (functionId: string, direction: "up" | "down") => Record<string, any>;
    removeNetworkFunction: (functionId: string) => boolean;
    validateNetworkPath: (sourceId: string, destId: string) => Record<string, any>;
    createFirewallPolicy: (config: Omit<FirewallPolicy, "rules">) => FirewallPolicy;
    addFirewallRule: (policyId: string, rule: FirewallRule) => FirewallRule;
    removeFirewallRule: (policyId: string, ruleId: string) => boolean;
    evaluateFirewallRule: (rule: FirewallRule, packet: Record<string, any>) => string;
    createSecurityGroup: (config: Omit<SecurityGroup, "members">) => SecurityGroup;
    attachSecurityGroup: (groupId: string, resourceId: string) => boolean;
    getFirewallStats: (policyId: string) => Record<string, any>;
    validateFirewallConfig: (policy: FirewallPolicy) => Record<string, any>;
    createLoadBalancer: (config: LoadBalancerConfig) => LoadBalancerConfig;
    configureLoadBalancerPool: (lbId: string, poolName: string, members: PoolMember[]) => Record<string, any>;
    addPoolMember: (poolId: string, member: PoolMember) => PoolMember;
    removePoolMember: (poolId: string, memberId: string) => boolean;
    configureHealthCheck: (poolId: string, config: HealthCheckConfig) => HealthCheckConfig;
    setLoadBalancingAlgorithm: (lbId: string, algorithm: string) => Record<string, any>;
    getLoadBalancerMetrics: (lbId: string) => Record<string, any>;
    createListenerRule: (lbId: string, rule: Record<string, any>) => Record<string, any>;
    validateLoadBalancerConfig: (config: LoadBalancerConfig) => Record<string, any>;
    createVPNConnection: (config: VPNConfig) => VPNConfig;
    configureIPSecTunnel: (vpnId: string, params: Record<string, any>) => Record<string, any>;
    createVPNGateway: (name: string, network: string, config: Record<string, any>) => Record<string, any>;
    attachVPNClient: (gatewayId: string, clientId: string, config: Record<string, any>) => boolean;
    rotateVPNCredentials: (vpnId: string) => Record<string, any>;
    getVPNStats: (vpnId: string) => Record<string, any>;
    validateVPNConfig: (config: VPNConfig) => Record<string, any>;
    mapNetworkTopology: () => NetworkTopology;
    detectNetworkLoops: (topology: NetworkTopology) => Array<string[]>;
    calculateNetworkLatency: (sourceId: string, destId: string) => number;
    discoverNetworkResources: (cidr: string) => Record<string, any>[];
    validateNetworkConnectivity: (topology: NetworkTopology) => Record<string, any>;
    optimizeNetworkPath: (sourceId: string, destId: string) => string[];
    getTopologyVisualization: (topology: NetworkTopology) => string;
    analyzeNetworkPerformance: (topology: NetworkTopology) => Record<string, any>;
};
export default _default;
//# sourceMappingURL=virtual-network-orchestration-kit.d.ts.map