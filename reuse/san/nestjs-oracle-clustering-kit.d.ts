/**
 * LOC: NOCL9845P6Q7
 * File: /reuse/san/nestjs-oracle-clustering-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/microservices (v11.1.8)
 *   - redis (v4.x)
 *   - node-cache (v5.x)
 *   - rxjs (v7.8.x)
 *
 * DOWNSTREAM (imported by):
 *   - Services requiring cluster coordination
 *   - Load balancer implementations
 *   - Session management services
 *   - Distributed cache services
 */
import { Subject } from 'rxjs';
/**
 * Cluster node information
 */
export interface ClusterNode {
    id: string;
    name: string;
    host: string;
    port: number;
    state: NodeState;
    role: NodeRole;
    weight: number;
    capacity: number;
    activeConnections: number;
    lastHeartbeat: Date;
    metadata?: Record<string, any>;
}
/**
 * Node state enumeration
 */
export declare enum NodeState {
    INITIALIZING = "INITIALIZING",
    ACTIVE = "ACTIVE",
    DEGRADED = "DEGRADED",
    MAINTENANCE = "MAINTENANCE",
    FAILED = "FAILED",
    DRAINING = "DRAINING"
}
/**
 * Node role enumeration
 */
export declare enum NodeRole {
    MASTER = "MASTER",
    REPLICA = "REPLICA",
    STANDBY = "STANDBY",
    WORKER = "WORKER"
}
/**
 * Load balancing strategy enumeration
 */
export declare enum LoadBalancingStrategy {
    ROUND_ROBIN = "ROUND_ROBIN",
    LEAST_CONNECTIONS = "LEAST_CONNECTIONS",
    WEIGHTED_ROUND_ROBIN = "WEIGHTED_ROUND_ROBIN",
    IP_HASH = "IP_HASH",
    RANDOM = "RANDOM",
    LEAST_RESPONSE_TIME = "LEAST_RESPONSE_TIME"
}
/**
 * Cluster configuration
 */
export interface ClusterConfig {
    clusterId: string;
    clusterName: string;
    nodes: ClusterNode[];
    discoveryInterval: number;
    heartbeatInterval: number;
    healthCheckInterval: number;
    failoverTimeout: number;
    sessionReplication: boolean;
    enableStickySessions: boolean;
}
/**
 * Session replication configuration
 */
export interface SessionReplicationConfig {
    enabled: boolean;
    strategy: 'sync' | 'async';
    replicationFactor: number;
    timeout: number;
    compressionEnabled: boolean;
}
/**
 * Health check result
 */
export interface HealthCheckResult {
    nodeId: string;
    healthy: boolean;
    responseTime: number;
    timestamp: Date;
    checks: Record<string, boolean>;
    error?: Error;
}
/**
 * Failover event
 */
export interface FailoverEvent {
    type: 'AUTOMATIC' | 'MANUAL';
    fromNodeId: string;
    toNodeId: string;
    timestamp: Date;
    reason: string;
    success: boolean;
}
/**
 * Load balancer configuration
 */
export interface LoadBalancerConfig {
    strategy: LoadBalancingStrategy;
    healthCheckEnabled: boolean;
    stickySessionEnabled: boolean;
    stickySessionTTL: number;
    retryAttempts: number;
    retryDelay: number;
}
/**
 * Session data
 */
export interface SessionData {
    sessionId: string;
    userId?: string;
    data: Record<string, any>;
    nodeId: string;
    createdAt: Date;
    lastAccessedAt: Date;
    expiresAt: Date;
}
/**
 * Distributed cache entry
 */
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    ttl?: number;
    nodeId: string;
    version: number;
    timestamp: Date;
}
/**
 * Node discovery configuration
 */
export interface NodeDiscoveryConfig {
    method: 'static' | 'dynamic' | 'dns' | 'multicast';
    discoveryEndpoint?: string;
    discoveryInterval: number;
    registrationTTL: number;
}
/**
 * Cluster metrics
 */
export interface ClusterMetrics {
    totalNodes: number;
    activeNodes: number;
    failedNodes: number;
    totalCapacity: number;
    usedCapacity: number;
    totalSessions: number;
    requestsPerSecond: number;
    averageResponseTime: number;
    timestamp: Date;
}
/**
 * Sticky session mapping
 */
export interface StickySessionMapping {
    sessionId: string;
    nodeId: string;
    createdAt: Date;
    expiresAt: Date;
}
/**
 * Node coordination lock
 */
export interface CoordinationLock {
    lockId: string;
    resourceName: string;
    ownerId: string;
    acquiredAt: Date;
    expiresAt: Date;
    renewable: boolean;
}
/**
 * Cluster event types
 */
export declare enum ClusterEventType {
    NODE_JOINED = "NODE_JOINED",
    NODE_LEFT = "NODE_LEFT",
    NODE_FAILED = "NODE_FAILED",
    NODE_RECOVERED = "NODE_RECOVERED",
    MASTER_ELECTED = "MASTER_ELECTED",
    FAILOVER_STARTED = "FAILOVER_STARTED",
    FAILOVER_COMPLETED = "FAILOVER_COMPLETED",
    SESSION_REPLICATED = "SESSION_REPLICATED"
}
/**
 * Cluster event
 */
export interface ClusterEvent {
    type: ClusterEventType;
    nodeId: string;
    timestamp: Date;
    data?: any;
}
/**
 * Initializes cluster configuration.
 *
 * @param {string} clusterId - Unique cluster identifier
 * @param {string} clusterName - Cluster name
 * @param {ClusterNode[]} nodes - Initial cluster nodes
 * @returns {ClusterConfig} Initialized cluster configuration
 *
 * @example
 * ```typescript
 * const config = initializeCluster('cluster-1', 'Production Cluster', [
 *   { id: 'node-1', name: 'Node 1', host: '10.0.1.10', port: 3000, ... },
 *   { id: 'node-2', name: 'Node 2', host: '10.0.1.11', port: 3000, ... }
 * ]);
 * ```
 */
export declare const initializeCluster: (clusterId: string, clusterName: string, nodes: ClusterNode[]) => ClusterConfig;
/**
 * Registers a node in the cluster.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {ClusterNode} node - Node to register
 * @returns {ClusterConfig} Updated cluster configuration
 *
 * @example
 * ```typescript
 * const updatedConfig = registerNode(config, {
 *   id: 'node-3',
 *   name: 'Node 3',
 *   host: '10.0.1.12',
 *   port: 3000,
 *   state: NodeState.ACTIVE,
 *   role: NodeRole.WORKER,
 *   weight: 100,
 *   capacity: 1000,
 *   activeConnections: 0,
 *   lastHeartbeat: new Date()
 * });
 * ```
 */
export declare const registerNode: (config: ClusterConfig, node: ClusterNode) => ClusterConfig;
/**
 * Unregisters a node from the cluster.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {string} nodeId - Node ID to unregister
 * @returns {ClusterConfig} Updated cluster configuration
 *
 * @example
 * ```typescript
 * const updatedConfig = unregisterNode(config, 'node-3');
 * ```
 */
export declare const unregisterNode: (config: ClusterConfig, nodeId: string) => ClusterConfig;
/**
 * Gets active cluster nodes.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {ClusterNode[]} Array of active nodes
 *
 * @example
 * ```typescript
 * const activeNodes = getActiveNodes(config);
 * console.log(`Active nodes: ${activeNodes.length}`);
 * ```
 */
export declare const getActiveNodes: (config: ClusterConfig) => ClusterNode[];
/**
 * Elects a new master node.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {string} [preferredNodeId] - Preferred node ID for master
 * @returns {ClusterNode | null} Elected master node
 *
 * @example
 * ```typescript
 * const master = electMasterNode(config);
 * console.log(`New master: ${master?.id}`);
 * ```
 */
export declare const electMasterNode: (config: ClusterConfig, preferredNodeId?: string) => ClusterNode | null;
/**
 * Broadcasts message to all cluster nodes.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {string} message - Message to broadcast
 * @param {any} [data] - Optional message data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await broadcastToCluster(config, 'CONFIG_UPDATE', { version: '2.0' });
 * ```
 */
export declare const broadcastToCluster: (config: ClusterConfig, message: string, data?: any) => Promise<void>;
/**
 * Discovers cluster nodes using specified method.
 *
 * @param {NodeDiscoveryConfig} config - Discovery configuration
 * @returns {Promise<ClusterNode[]>} Discovered nodes
 *
 * @example
 * ```typescript
 * const nodes = await discoverNodes({
 *   method: 'dns',
 *   discoveryEndpoint: 'cluster.whitecross.local',
 *   discoveryInterval: 30000,
 *   registrationTTL: 60000
 * });
 * ```
 */
export declare const discoverNodes: (config: NodeDiscoveryConfig) => Promise<ClusterNode[]>;
/**
 * Discovers nodes using DNS SRV records.
 *
 * @param {string} dnsEndpoint - DNS endpoint for discovery
 * @returns {Promise<ClusterNode[]>} Discovered nodes
 *
 * @example
 * ```typescript
 * const nodes = await discoverNodesDNS('_http._tcp.cluster.whitecross.local');
 * ```
 */
export declare const discoverNodesDNS: (dnsEndpoint: string) => Promise<ClusterNode[]>;
/**
 * Discovers nodes using multicast.
 *
 * @returns {Promise<ClusterNode[]>} Discovered nodes
 *
 * @example
 * ```typescript
 * const nodes = await discoverNodesMulticast();
 * ```
 */
export declare const discoverNodesMulticast: () => Promise<ClusterNode[]>;
/**
 * Discovers nodes from static configuration.
 *
 * @returns {Promise<ClusterNode[]>} Discovered nodes
 *
 * @example
 * ```typescript
 * const nodes = await discoverNodesStatic();
 * ```
 */
export declare const discoverNodesStatic: () => Promise<ClusterNode[]>;
/**
 * Sends heartbeat from node to cluster.
 *
 * @param {string} nodeId - Node ID
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendHeartbeat('node-1', config);
 * ```
 */
export declare const sendHeartbeat: (nodeId: string, config: ClusterConfig) => Promise<void>;
/**
 * Monitors node heartbeats and detects failures.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {number} timeoutMs - Heartbeat timeout in milliseconds
 * @returns {ClusterNode[]} Nodes that have failed heartbeat
 *
 * @example
 * ```typescript
 * const failedNodes = monitorHeartbeats(config, 15000);
 * failedNodes.forEach(node => handleNodeFailure(node));
 * ```
 */
export declare const monitorHeartbeats: (config: ClusterConfig, timeoutMs: number) => ClusterNode[];
/**
 * Announces node availability to cluster.
 *
 * @param {ClusterNode} node - Node to announce
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await announceNodeAvailability(node, config);
 * ```
 */
export declare const announceNodeAvailability: (node: ClusterNode, config: ClusterConfig) => Promise<void>;
/**
 * Selects next node using load balancing strategy.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @param {LoadBalancingStrategy} strategy - Load balancing strategy
 * @param {string} [clientId] - Client identifier for sticky sessions
 * @returns {ClusterNode | null} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNode(config, LoadBalancingStrategy.LEAST_CONNECTIONS);
 * ```
 */
export declare const selectNode: (config: ClusterConfig, strategy: LoadBalancingStrategy, clientId?: string) => ClusterNode | null;
/**
 * Selects node using round-robin strategy.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeRoundRobin(activeNodes);
 * ```
 */
export declare const selectNodeRoundRobin: (nodes: ClusterNode[]) => ClusterNode;
/**
 * Selects node with least active connections.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeLeastConnections(activeNodes);
 * ```
 */
export declare const selectNodeLeastConnections: (nodes: ClusterNode[]) => ClusterNode;
/**
 * Selects node using weighted round-robin.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeWeightedRoundRobin(activeNodes);
 * ```
 */
export declare const selectNodeWeightedRoundRobin: (nodes: ClusterNode[]) => ClusterNode;
/**
 * Selects node using IP hash for sticky sessions.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @param {string} clientId - Client identifier
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeIPHash(activeNodes, '192.168.1.100');
 * ```
 */
export declare const selectNodeIPHash: (nodes: ClusterNode[], clientId: string) => ClusterNode;
/**
 * Selects random node.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeRandom(activeNodes);
 * ```
 */
export declare const selectNodeRandom: (nodes: ClusterNode[]) => ClusterNode;
/**
 * Selects node with least response time.
 *
 * @param {ClusterNode[]} nodes - Available nodes
 * @returns {ClusterNode} Selected node
 *
 * @example
 * ```typescript
 * const node = selectNodeLeastResponseTime(activeNodes);
 * ```
 */
export declare const selectNodeLeastResponseTime: (nodes: ClusterNode[]) => ClusterNode;
/**
 * Simple string hash function.
 *
 * @param {string} str - String to hash
 * @returns {number} Hash value
 *
 * @example
 * ```typescript
 * const hash = hashString('192.168.1.100');
 * ```
 */
export declare const hashString: (str: string) => number;
/**
 * Replicates session data across cluster nodes.
 *
 * @param {SessionData} session - Session to replicate
 * @param {ClusterConfig} config - Cluster configuration
 * @param {SessionReplicationConfig} replicationConfig - Replication configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replicateSession(sessionData, clusterConfig, {
 *   enabled: true,
 *   strategy: 'async',
 *   replicationFactor: 2,
 *   timeout: 5000,
 *   compressionEnabled: true
 * });
 * ```
 */
export declare const replicateSession: (session: SessionData, config: ClusterConfig, replicationConfig: SessionReplicationConfig) => Promise<void>;
/**
 * Replicates session to specific node.
 *
 * @param {SessionData} session - Session data
 * @param {ClusterNode} node - Target node
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replicateToNode(sessionData, targetNode);
 * ```
 */
export declare const replicateToNode: (session: SessionData, node: ClusterNode) => Promise<void>;
/**
 * Retrieves session from cluster.
 *
 * @param {string} sessionId - Session ID
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<SessionData | null>} Session data or null
 *
 * @example
 * ```typescript
 * const session = await getSessionFromCluster('sess-12345', config);
 * ```
 */
export declare const getSessionFromCluster: (sessionId: string, config: ClusterConfig) => Promise<SessionData | null>;
/**
 * Retrieves session from specific node.
 *
 * @param {string} sessionId - Session ID
 * @param {ClusterNode} node - Node to query
 * @returns {Promise<SessionData | null>} Session data or null
 *
 * @example
 * ```typescript
 * const session = await getSessionFromNode('sess-12345', node);
 * ```
 */
export declare const getSessionFromNode: (sessionId: string, node: ClusterNode) => Promise<SessionData | null>;
/**
 * Invalidates session across cluster.
 *
 * @param {string} sessionId - Session ID to invalidate
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await invalidateSessionCluster('sess-12345', config);
 * ```
 */
export declare const invalidateSessionCluster: (sessionId: string, config: ClusterConfig) => Promise<void>;
/**
 * Sets distributed state value.
 *
 * @param {string} key - State key
 * @param {any} value - State value
 * @param {ClusterConfig} config - Cluster configuration
 * @param {number} [ttl] - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setDistributedState('feature-flags', { newFeature: true }, config, 3600);
 * ```
 */
export declare const setDistributedState: (key: string, value: any, config: ClusterConfig, ttl?: number) => Promise<void>;
/**
 * Gets distributed state value.
 *
 * @param {string} key - State key
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<any>} State value
 *
 * @example
 * ```typescript
 * const featureFlags = await getDistributedState('feature-flags', config);
 * ```
 */
export declare const getDistributedState: (key: string, config: ClusterConfig) => Promise<any>;
/**
 * Deletes distributed state.
 *
 * @param {string} key - State key
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteDistributedState('old-config', config);
 * ```
 */
export declare const deleteDistributedState: (key: string, config: ClusterConfig) => Promise<void>;
/**
 * Performs health check on node.
 *
 * @param {ClusterNode} node - Node to check
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const result = await performHealthCheck(node);
 * if (!result.healthy) {
 *   handleUnhealthyNode(node);
 * }
 * ```
 */
export declare const performHealthCheck: (node: ClusterNode) => Promise<HealthCheckResult>;
/**
 * Performs health checks on all cluster nodes.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<HealthCheckResult[]>} Health check results
 *
 * @example
 * ```typescript
 * const results = await performClusterHealthCheck(config);
 * const unhealthy = results.filter(r => !r.healthy);
 * ```
 */
export declare const performClusterHealthCheck: (config: ClusterConfig) => Promise<HealthCheckResult[]>;
/**
 * Initiates failover from failed node to healthy node.
 *
 * @param {string} failedNodeId - Failed node ID
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<FailoverEvent>} Failover event result
 *
 * @example
 * ```typescript
 * const failover = await initiateFailover('node-2', config);
 * if (failover.success) {
 *   console.log(`Failover to ${failover.toNodeId} completed`);
 * }
 * ```
 */
export declare const initiateFailover: (failedNodeId: string, config: ClusterConfig) => Promise<FailoverEvent>;
/**
 * Recovers failed node back into cluster.
 *
 * @param {string} nodeId - Node ID to recover
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<boolean>} True if recovery successful
 *
 * @example
 * ```typescript
 * const recovered = await recoverNode('node-2', config);
 * ```
 */
export declare const recoverNode: (nodeId: string, config: ClusterConfig) => Promise<boolean>;
/**
 * Sets value in distributed cluster cache.
 *
 * @template T
 * @param {string} key - Cache key
 * @param {T} value - Cache value
 * @param {ClusterConfig} config - Cluster configuration
 * @param {number} [ttl] - Time to live in seconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setClusterCache('patient:12345', patientData, config, 3600);
 * ```
 */
export declare const setClusterCache: <T>(key: string, value: T, config: ClusterConfig, ttl?: number) => Promise<void>;
/**
 * Gets value from distributed cluster cache.
 *
 * @template T
 * @param {string} key - Cache key
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<T | null>} Cached value or null
 *
 * @example
 * ```typescript
 * const patient = await getClusterCache<Patient>('patient:12345', config);
 * ```
 */
export declare const getClusterCache: <T>(key: string, config: ClusterConfig) => Promise<T | null>;
/**
 * Invalidates cache entry across cluster.
 *
 * @param {string} key - Cache key
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await invalidateClusterCache('patient:12345', config);
 * ```
 */
export declare const invalidateClusterCache: (key: string, config: ClusterConfig) => Promise<void>;
/**
 * Invalidates cache pattern across cluster.
 *
 * @param {string} pattern - Cache key pattern (supports wildcards)
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await invalidateClusterCachePattern('patient:*', config);
 * ```
 */
export declare const invalidateClusterCachePattern: (pattern: string, config: ClusterConfig) => Promise<void>;
/**
 * Creates sticky session mapping.
 *
 * @param {string} sessionId - Session ID
 * @param {string} nodeId - Node ID
 * @param {number} ttl - Time to live in seconds
 * @returns {StickySessionMapping} Sticky session mapping
 *
 * @example
 * ```typescript
 * const mapping = createStickySession('sess-12345', 'node-1', 3600);
 * ```
 */
export declare const createStickySession: (sessionId: string, nodeId: string, ttl: number) => StickySessionMapping;
/**
 * Gets node for sticky session.
 *
 * @param {string} sessionId - Session ID
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<string | null>} Node ID or null
 *
 * @example
 * ```typescript
 * const nodeId = await getStickySessionNode('sess-12345', config);
 * ```
 */
export declare const getStickySessionNode: (sessionId: string, config: ClusterConfig) => Promise<string | null>;
/**
 * Removes sticky session mapping.
 *
 * @param {string} sessionId - Session ID
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeStickySession('sess-12345', config);
 * ```
 */
export declare const removeStickySession: (sessionId: string, config: ClusterConfig) => Promise<void>;
/**
 * Collects cluster metrics.
 *
 * @param {ClusterConfig} config - Cluster configuration
 * @returns {ClusterMetrics} Cluster metrics
 *
 * @example
 * ```typescript
 * const metrics = getClusterMetrics(config);
 * console.log(`Active nodes: ${metrics.activeNodes}/${metrics.totalNodes}`);
 * ```
 */
export declare const getClusterMetrics: (config: ClusterConfig) => ClusterMetrics;
/**
 * Creates cluster event emitter.
 *
 * @returns {Subject<ClusterEvent>} Event emitter
 *
 * @example
 * ```typescript
 * const eventEmitter = createClusterEventEmitter();
 * eventEmitter.subscribe(event => handleClusterEvent(event));
 * ```
 */
export declare const createClusterEventEmitter: () => Subject<ClusterEvent>;
/**
 * Emits cluster event.
 *
 * @param {Subject<ClusterEvent>} emitter - Event emitter
 * @param {ClusterEventType} type - Event type
 * @param {string} nodeId - Node ID
 * @param {any} [data] - Event data
 * @returns {void}
 *
 * @example
 * ```typescript
 * emitClusterEvent(emitter, ClusterEventType.NODE_JOINED, 'node-3', { role: 'worker' });
 * ```
 */
export declare const emitClusterEvent: (emitter: Subject<ClusterEvent>, type: ClusterEventType, nodeId: string, data?: any) => void;
declare const _default: {
    initializeCluster: (clusterId: string, clusterName: string, nodes: ClusterNode[]) => ClusterConfig;
    registerNode: (config: ClusterConfig, node: ClusterNode) => ClusterConfig;
    unregisterNode: (config: ClusterConfig, nodeId: string) => ClusterConfig;
    getActiveNodes: (config: ClusterConfig) => ClusterNode[];
    electMasterNode: (config: ClusterConfig, preferredNodeId?: string) => ClusterNode | null;
    broadcastToCluster: (config: ClusterConfig, message: string, data?: any) => Promise<void>;
    discoverNodes: (config: NodeDiscoveryConfig) => Promise<ClusterNode[]>;
    discoverNodesDNS: (dnsEndpoint: string) => Promise<ClusterNode[]>;
    discoverNodesMulticast: () => Promise<ClusterNode[]>;
    discoverNodesStatic: () => Promise<ClusterNode[]>;
    sendHeartbeat: (nodeId: string, config: ClusterConfig) => Promise<void>;
    monitorHeartbeats: (config: ClusterConfig, timeoutMs: number) => ClusterNode[];
    announceNodeAvailability: (node: ClusterNode, config: ClusterConfig) => Promise<void>;
    selectNode: (config: ClusterConfig, strategy: LoadBalancingStrategy, clientId?: string) => ClusterNode | null;
    selectNodeRoundRobin: (nodes: ClusterNode[]) => ClusterNode;
    selectNodeLeastConnections: (nodes: ClusterNode[]) => ClusterNode;
    selectNodeWeightedRoundRobin: (nodes: ClusterNode[]) => ClusterNode;
    selectNodeIPHash: (nodes: ClusterNode[], clientId: string) => ClusterNode;
    selectNodeRandom: (nodes: ClusterNode[]) => ClusterNode;
    selectNodeLeastResponseTime: (nodes: ClusterNode[]) => ClusterNode;
    replicateSession: (session: SessionData, config: ClusterConfig, replicationConfig: SessionReplicationConfig) => Promise<void>;
    replicateToNode: (session: SessionData, node: ClusterNode) => Promise<void>;
    getSessionFromCluster: (sessionId: string, config: ClusterConfig) => Promise<SessionData | null>;
    getSessionFromNode: (sessionId: string, node: ClusterNode) => Promise<SessionData | null>;
    invalidateSessionCluster: (sessionId: string, config: ClusterConfig) => Promise<void>;
    setDistributedState: (key: string, value: any, config: ClusterConfig, ttl?: number) => Promise<void>;
    getDistributedState: (key: string, config: ClusterConfig) => Promise<any>;
    deleteDistributedState: (key: string, config: ClusterConfig) => Promise<void>;
    performHealthCheck: (node: ClusterNode) => Promise<HealthCheckResult>;
    performClusterHealthCheck: (config: ClusterConfig) => Promise<HealthCheckResult[]>;
    initiateFailover: (failedNodeId: string, config: ClusterConfig) => Promise<FailoverEvent>;
    recoverNode: (nodeId: string, config: ClusterConfig) => Promise<boolean>;
    setClusterCache: <T>(key: string, value: T, config: ClusterConfig, ttl?: number) => Promise<void>;
    getClusterCache: <T>(key: string, config: ClusterConfig) => Promise<T | null>;
    invalidateClusterCache: (key: string, config: ClusterConfig) => Promise<void>;
    invalidateClusterCachePattern: (pattern: string, config: ClusterConfig) => Promise<void>;
    createStickySession: (sessionId: string, nodeId: string, ttl: number) => StickySessionMapping;
    getStickySessionNode: (sessionId: string, config: ClusterConfig) => Promise<string | null>;
    removeStickySession: (sessionId: string, config: ClusterConfig) => Promise<void>;
    getClusterMetrics: (config: ClusterConfig) => ClusterMetrics;
    createClusterEventEmitter: () => Subject<ClusterEvent>;
    emitClusterEvent: (emitter: Subject<ClusterEvent>, type: ClusterEventType, nodeId: string, data?: any) => void;
};
export default _default;
//# sourceMappingURL=nestjs-oracle-clustering-kit.d.ts.map