/**
 * SAN Failover and Clustering Kit
 *
 * Comprehensive production-ready high availability functions for SAN storage clustering,
 * failover management, distributed consensus, and split-brain prevention.
 *
 * @module san-failover-clustering-kit
 * @category High Availability
 */
/**
 * Node status enumeration
 */
export declare enum NodeStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    DEGRADED = "degraded",
    MAINTENANCE = "maintenance",
    FENCED = "fenced",
    UNKNOWN = "unknown"
}
/**
 * Cluster state enumeration
 */
export declare enum ClusterState {
    HEALTHY = "healthy",
    DEGRADED = "degraded",
    SPLIT_BRAIN = "split_brain",
    NO_QUORUM = "no_quorum",
    FAILING_OVER = "failing_over",
    RECOVERING = "recovering"
}
/**
 * Failover policy types
 */
export declare enum FailoverPolicyType {
    AUTOMATIC = "automatic",
    MANUAL = "manual",
    CONDITIONAL = "conditional"
}
/**
 * Clustering mode
 */
export declare enum ClusteringMode {
    ACTIVE_ACTIVE = "active_active",
    ACTIVE_PASSIVE = "active_passive",
    N_PLUS_ONE = "n_plus_one"
}
/**
 * Load balancing algorithm types
 */
export declare enum LoadBalancingAlgorithm {
    ROUND_ROBIN = "round_robin",
    LEAST_CONNECTIONS = "least_connections",
    WEIGHTED_ROUND_ROBIN = "weighted_round_robin",
    RESOURCE_BASED = "resource_based",
    LATENCY_BASED = "latency_based"
}
/**
 * Consensus algorithm types
 */
export declare enum ConsensusAlgorithm {
    RAFT = "raft",
    PAXOS = "paxos",
    GOSSIP = "gossip",
    MAJORITY_VOTE = "majority_vote"
}
/**
 * Health check result
 */
export interface HealthCheckResult {
    readonly nodeId: string;
    readonly status: NodeStatus;
    readonly timestamp: Date;
    readonly responseTime: number;
    readonly metrics: NodeMetrics;
    readonly lastSuccessfulCheck?: Date;
    readonly consecutiveFailures: number;
}
/**
 * Node metrics for health monitoring
 */
export interface NodeMetrics {
    readonly cpuUsage: number;
    readonly memoryUsage: number;
    readonly diskIOPS: number;
    readonly networkThroughput: number;
    readonly activeConnections: number;
    readonly queueDepth: number;
    readonly errorRate: number;
}
/**
 * Cluster node definition
 */
export interface ClusterNode {
    readonly id: string;
    readonly hostname: string;
    readonly ipAddress: string;
    readonly port: number;
    status: NodeStatus;
    readonly priority: number;
    readonly weight: number;
    readonly roles: string[];
    readonly lastHeartbeat: Date;
    readonly capabilities: Record<string, unknown>;
    metadata: Record<string, unknown>;
}
/**
 * Failover policy configuration
 */
export interface FailoverPolicy {
    readonly type: FailoverPolicyType;
    readonly maxFailoverAttempts: number;
    readonly failoverTimeout: number;
    readonly healthCheckInterval: number;
    readonly healthCheckTimeout: number;
    readonly minHealthyNodes: number;
    readonly requireQuorum: boolean;
    readonly autoFallback: boolean;
    readonly conditions?: FailoverCondition[];
}
/**
 * Failover condition for conditional policies
 */
export interface FailoverCondition {
    readonly metric: string;
    readonly operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    readonly threshold: number;
    readonly duration: number;
}
/**
 * Cluster configuration
 */
export interface ClusterConfig {
    readonly clusterId: string;
    readonly name: string;
    readonly mode: ClusteringMode;
    readonly nodes: ClusterNode[];
    readonly failoverPolicy: FailoverPolicy;
    readonly quorumSize: number;
    readonly consensusAlgorithm: ConsensusAlgorithm;
    readonly loadBalancing: LoadBalancingAlgorithm;
    readonly splitBrainProtection: boolean;
    readonly fencingEnabled: boolean;
}
/**
 * Cluster state representation
 */
export interface Cluster {
    readonly config: ClusterConfig;
    state: ClusterState;
    readonly activeNodes: ClusterNode[];
    readonly passiveNodes: ClusterNode[];
    readonly fencedNodes: ClusterNode[];
    readonly leader?: ClusterNode;
    readonly term: number;
    readonly lastStateChange: Date;
    readonly votingHistory: VoteRecord[];
}
/**
 * Vote record for consensus
 */
export interface VoteRecord {
    readonly term: number;
    readonly candidateId: string;
    readonly voterId: string;
    readonly timestamp: Date;
    readonly granted: boolean;
}
/**
 * Quorum state
 */
export interface QuorumState {
    readonly hasQuorum: boolean;
    readonly requiredNodes: number;
    readonly activeNodes: number;
    readonly votingNodes: string[];
    readonly timestamp: Date;
}
/**
 * Failover event
 */
export interface FailoverEvent {
    readonly id: string;
    readonly timestamp: Date;
    readonly sourceNodeId: string;
    readonly targetNodeId: string;
    readonly reason: string;
    readonly success: boolean;
    readonly duration: number;
    readonly metadata: Record<string, unknown>;
}
/**
 * Load balancing decision
 */
export interface LoadBalancingDecision {
    readonly selectedNodeId: string;
    readonly algorithm: LoadBalancingAlgorithm;
    readonly score: number;
    readonly alternativeNodes: string[];
    readonly timestamp: Date;
}
/**
 * Performs comprehensive health check on a cluster node
 *
 * @param node - The cluster node to check
 * @param timeout - Health check timeout in milliseconds
 * @returns Health check result with status and metrics
 *
 * @example
 * ```typescript
 * const result = await performNodeHealthCheck(node, 5000);
 * if (result.status === NodeStatus.ONLINE) {
 *   console.log(`Node ${node.id} is healthy`);
 * }
 * ```
 */
export declare function performNodeHealthCheck(node: ClusterNode, timeout?: number): Promise<HealthCheckResult>;
/**
 * Performs health checks on all nodes in a cluster
 *
 * @param cluster - The cluster to check
 * @returns Array of health check results for all nodes
 *
 * @example
 * ```typescript
 * const results = await performClusterHealthCheck(cluster);
 * const unhealthyNodes = results.filter(r => r.status !== NodeStatus.ONLINE);
 * ```
 */
export declare function performClusterHealthCheck(cluster: Cluster): Promise<HealthCheckResult[]>;
/**
 * Monitors node health over time with exponential backoff
 *
 * @param node - Node to monitor
 * @param interval - Check interval in milliseconds
 * @param maxRetries - Maximum consecutive failures before marking offline
 * @param callback - Callback function for health status updates
 * @returns Cleanup function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = monitorNodeHealth(node, 10000, 3, (result) => {
 *   console.log(`Node ${result.nodeId} status: ${result.status}`);
 * });
 * ```
 */
export declare function monitorNodeHealth(node: ClusterNode, interval: number, maxRetries: number, callback: (result: HealthCheckResult) => void): () => void;
/**
 * Calculates aggregate cluster health metrics
 *
 * @param healthResults - Array of health check results
 * @returns Aggregated health metrics across cluster
 *
 * @example
 * ```typescript
 * const results = await performClusterHealthCheck(cluster);
 * const aggregated = calculateAggregateHealth(results);
 * console.log(`Cluster health score: ${aggregated.healthScore}`);
 * ```
 */
export declare function calculateAggregateHealth(healthResults: HealthCheckResult[]): {
    healthScore: number;
    avgResponseTime: number;
    avgCpuUsage: number;
    avgMemoryUsage: number;
    totalActiveConnections: number;
    onlineNodes: number;
    totalNodes: number;
};
/**
 * Determines if a node meets health thresholds
 *
 * @param healthResult - Health check result to evaluate
 * @param thresholds - Threshold configuration
 * @returns True if node meets all health thresholds
 *
 * @example
 * ```typescript
 * const isHealthy = evaluateHealthThresholds(result, {
 *   maxCpuUsage: 90,
 *   maxMemoryUsage: 85,
 *   maxResponseTime: 1000
 * });
 * ```
 */
export declare function evaluateHealthThresholds(healthResult: HealthCheckResult, thresholds: {
    maxCpuUsage?: number;
    maxMemoryUsage?: number;
    maxResponseTime?: number;
    maxErrorRate?: number;
    minDiskIOPS?: number;
}): boolean;
/**
 * Initiates automatic failover from failed node to healthy node
 *
 * @param cluster - The cluster configuration
 * @param failedNodeId - ID of the failed node
 * @param policy - Failover policy to apply
 * @returns Failover event with result details
 *
 * @example
 * ```typescript
 * const event = await initiateFailover(cluster, 'node-1', policy);
 * if (event.success) {
 *   console.log(`Failed over to node ${event.targetNodeId}`);
 * }
 * ```
 */
export declare function initiateFailover(cluster: Cluster, failedNodeId: string, policy: FailoverPolicy): Promise<FailoverEvent>;
/**
 * Executes the actual failover process between nodes
 *
 * @param cluster - The cluster configuration
 * @param sourceNodeId - Source node ID
 * @param targetNodeId - Target node ID
 * @param timeout - Failover timeout in milliseconds
 *
 * @example
 * ```typescript
 * await executeFailover(cluster, 'node-1', 'node-2', 30000);
 * ```
 */
export declare function executeFailover(cluster: Cluster, sourceNodeId: string, targetNodeId: string, timeout: number): Promise<void>;
/**
 * Selects optimal target node for failover
 *
 * @param cluster - The cluster configuration
 * @param failedNodeId - ID of the failed node
 * @returns Selected target node or undefined if none suitable
 *
 * @example
 * ```typescript
 * const target = selectFailoverTarget(cluster, 'node-1');
 * if (target) {
 *   console.log(`Selected ${target.id} for failover`);
 * }
 * ```
 */
export declare function selectFailoverTarget(cluster: Cluster, failedNodeId: string): ClusterNode | undefined;
/**
 * Validates if failover conditions are met
 *
 * @param healthResult - Health check result
 * @param conditions - Failover conditions to evaluate
 * @returns True if all conditions are met
 *
 * @example
 * ```typescript
 * const shouldFailover = evaluateFailoverConditions(healthResult, [
 *   { metric: 'cpuUsage', operator: 'gt', threshold: 95, duration: 60000 }
 * ]);
 * ```
 */
export declare function evaluateFailoverConditions(healthResult: HealthCheckResult, conditions: FailoverCondition[]): boolean;
/**
 * Performs automatic fallback to original node when healthy
 *
 * @param cluster - The cluster configuration
 * @param originalNodeId - ID of the original node
 * @param policy - Failover policy
 * @returns Failover event with fallback result
 *
 * @example
 * ```typescript
 * const event = await performFallback(cluster, 'node-1', policy);
 * if (event.success) {
 *   console.log('Successfully failed back to original node');
 * }
 * ```
 */
export declare function performFallback(cluster: Cluster, originalNodeId: string, policy: FailoverPolicy): Promise<FailoverEvent>;
/**
 * Calculates failover readiness score for a node
 *
 * @param node - Node to evaluate
 * @param healthResult - Recent health check result
 * @returns Readiness score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateFailoverReadiness(node, healthResult);
 * if (score > 80) {
 *   console.log('Node is ready for failover');
 * }
 * ```
 */
export declare function calculateFailoverReadiness(node: ClusterNode, healthResult: HealthCheckResult): number;
/**
 * Selects optimal node using specified load balancing algorithm
 *
 * @param cluster - The cluster configuration
 * @param algorithm - Load balancing algorithm to use
 * @param healthResults - Recent health check results
 * @returns Load balancing decision with selected node
 *
 * @example
 * ```typescript
 * const decision = selectNodeForRequest(cluster, LoadBalancingAlgorithm.LEAST_CONNECTIONS, healthResults);
 * console.log(`Route request to node ${decision.selectedNodeId}`);
 * ```
 */
export declare function selectNodeForRequest(cluster: Cluster, algorithm: LoadBalancingAlgorithm, healthResults: HealthCheckResult[]): LoadBalancingDecision;
/**
 * Implements round-robin load balancing
 *
 * @param nodes - Available nodes
 * @returns Selected node
 */
export declare function selectRoundRobin(nodes: ClusterNode[]): ClusterNode;
/**
 * Implements least connections load balancing
 *
 * @param nodes - Available nodes
 * @param healthResults - Recent health check results
 * @returns Node with least active connections
 *
 * @example
 * ```typescript
 * const node = selectLeastConnections(nodes, healthResults);
 * console.log(`Selected node with ${node.id}`);
 * ```
 */
export declare function selectLeastConnections(nodes: ClusterNode[], healthResults: HealthCheckResult[]): ClusterNode;
/**
 * Implements weighted round-robin load balancing
 *
 * @param nodes - Available nodes with weights
 * @returns Selected node based on weights
 *
 * @example
 * ```typescript
 * const node = selectWeightedRoundRobin(nodes);
 * console.log(`Selected weighted node ${node.id}`);
 * ```
 */
export declare function selectWeightedRoundRobin(nodes: ClusterNode[]): ClusterNode;
/**
 * Implements resource-based load balancing
 *
 * @param nodes - Available nodes
 * @param healthResults - Recent health check results
 * @returns Node with best resource availability
 *
 * @example
 * ```typescript
 * const node = selectResourceBased(nodes, healthResults);
 * console.log(`Selected node with best resources: ${node.id}`);
 * ```
 */
export declare function selectResourceBased(nodes: ClusterNode[], healthResults: HealthCheckResult[]): ClusterNode;
/**
 * Checks if cluster has sufficient quorum for operations
 *
 * @param cluster - The cluster to check
 * @returns Quorum state with detailed information
 *
 * @example
 * ```typescript
 * const quorumState = checkQuorum(cluster);
 * if (!quorumState.hasQuorum) {
 *   console.log('Cluster does not have quorum');
 * }
 * ```
 */
export declare function checkQuorum(cluster: Cluster): QuorumState;
/**
 * Calculates optimal quorum size for cluster
 *
 * @param totalNodes - Total number of nodes in cluster
 * @param clusterMode - Clustering mode
 * @returns Recommended quorum size
 *
 * @example
 * ```typescript
 * const quorumSize = calculateQuorumSize(5, ClusteringMode.ACTIVE_ACTIVE);
 * console.log(`Recommended quorum size: ${quorumSize}`);
 * ```
 */
export declare function calculateQuorumSize(totalNodes: number, clusterMode: ClusteringMode): number;
/**
 * Updates quorum configuration dynamically
 *
 * @param cluster - The cluster to update
 * @param newQuorumSize - New quorum size
 * @returns Updated cluster configuration
 *
 * @example
 * ```typescript
 * const updated = updateQuorumConfiguration(cluster, 3);
 * console.log(`Quorum updated to ${updated.config.quorumSize}`);
 * ```
 */
export declare function updateQuorumConfiguration(cluster: Cluster, newQuorumSize: number): Cluster;
/**
 * Validates quorum decision across cluster
 *
 * @param cluster - The cluster
 * @param decision - Decision to validate
 * @param votes - Votes from cluster nodes
 * @returns True if decision has quorum approval
 *
 * @example
 * ```typescript
 * const hasApproval = validateQuorumDecision(cluster, 'promote-node-2', votes);
 * if (hasApproval) {
 *   console.log('Decision approved by quorum');
 * }
 * ```
 */
export declare function validateQuorumDecision(cluster: Cluster, decision: string, votes: Map<string, boolean>): boolean;
/**
 * Handles quorum loss scenarios
 *
 * @param cluster - The cluster experiencing quorum loss
 * @returns Recovery actions to take
 *
 * @example
 * ```typescript
 * const actions = handleQuorumLoss(cluster);
 * actions.forEach(action => console.log(`Action: ${action}`));
 * ```
 */
export declare function handleQuorumLoss(cluster: Cluster): string[];
/**
 * Detects potential split-brain condition in cluster
 *
 * @param cluster - The cluster to check
 * @param partitions - Network partition information
 * @returns True if split-brain is detected
 *
 * @example
 * ```typescript
 * const hasSplitBrain = detectSplitBrain(cluster, partitions);
 * if (hasSplitBrain) {
 *   console.log('Split-brain detected!');
 * }
 * ```
 */
export declare function detectSplitBrain(cluster: Cluster, partitions: Map<string, string[]>): boolean;
/**
 * Resolves split-brain condition using fencing
 *
 * @param cluster - The cluster with split-brain
 * @param partitions - Network partition information
 * @returns Resolution actions taken
 *
 * @example
 * ```typescript
 * const actions = resolveSplitBrain(cluster, partitions);
 * console.log(`Resolved split-brain with ${actions.length} actions`);
 * ```
 */
export declare function resolveSplitBrain(cluster: Cluster, partitions: Map<string, string[]>): string[];
/**
 * Fences a node to prevent split-brain
 *
 * @param cluster - The cluster
 * @param nodeId - ID of node to fence
 *
 * @example
 * ```typescript
 * fenceNode(cluster, 'node-3');
 * console.log('Node fenced successfully');
 * ```
 */
export declare function fenceNode(cluster: Cluster, nodeId: string): void;
/**
 * Implements quorum-based arbitration for split-brain prevention
 *
 * @param cluster - The cluster
 * @param partitions - Network partition information
 * @returns Partition that wins arbitration
 *
 * @example
 * ```typescript
 * const winner = implementQuorumArbitration(cluster, partitions);
 * console.log(`Partition ${winner} won arbitration`);
 * ```
 */
export declare function implementQuorumArbitration(cluster: Cluster, partitions: Map<string, string[]>): string | undefined;
/**
 * Elects new cluster leader using consensus algorithm
 *
 * @param cluster - The cluster
 * @param algorithm - Consensus algorithm to use
 * @returns Newly elected leader node
 *
 * @example
 * ```typescript
 * const leader = await electClusterLeader(cluster, ConsensusAlgorithm.RAFT);
 * console.log(`New leader elected: ${leader.id}`);
 * ```
 */
export declare function electClusterLeader(cluster: Cluster, algorithm: ConsensusAlgorithm): Promise<ClusterNode>;
/**
 * Synchronizes cluster state across all nodes
 *
 * @param cluster - The cluster to synchronize
 * @returns Synchronization result
 *
 * @example
 * ```typescript
 * const result = await synchronizeClusterState(cluster);
 * console.log(`Synchronized ${result.nodesSynced} nodes`);
 * ```
 */
export declare function synchronizeClusterState(cluster: Cluster): Promise<{
    nodesSynced: number;
    failures: string[];
}>;
/**
 * Coordinates cluster membership changes
 *
 * @param cluster - The cluster
 * @param operation - Operation type (add/remove)
 * @param nodeId - Node ID to add or remove
 * @returns Updated cluster
 *
 * @example
 * ```typescript
 * const updated = await coordinateMembershipChange(cluster, 'add', 'node-4');
 * console.log(`Cluster now has ${updated.config.nodes.length} nodes`);
 * ```
 */
export declare function coordinateMembershipChange(cluster: Cluster, operation: 'add' | 'remove', nodeId: string): Promise<Cluster>;
/**
 * Manages heartbeat mechanism between cluster nodes
 *
 * @param cluster - The cluster
 * @param interval - Heartbeat interval in milliseconds
 * @param callback - Callback for heartbeat failures
 * @returns Cleanup function to stop heartbeat
 *
 * @example
 * ```typescript
 * const stopHeartbeat = manageHeartbeat(cluster, 5000, (nodeId) => {
 *   console.log(`Heartbeat failed for ${nodeId}`);
 * });
 * ```
 */
export declare function manageHeartbeat(cluster: Cluster, interval: number, callback: (nodeId: string) => void): () => void;
/**
 * Implements distributed lock for cluster coordination
 *
 * @param cluster - The cluster
 * @param resourceId - Resource to lock
 * @param nodeId - Node requesting lock
 * @param timeout - Lock timeout in milliseconds
 * @returns Lock acquisition result
 *
 * @example
 * ```typescript
 * const lock = await acquireDistributedLock(cluster, 'storage-lun-1', 'node-2', 30000);
 * if (lock.acquired) {
 *   // Perform operations
 *   await releaseLock(lock);
 * }
 * ```
 */
export declare function acquireDistributedLock(cluster: Cluster, resourceId: string, nodeId: string, timeout: number): Promise<{
    acquired: boolean;
    lockId: string;
    expiresAt: Date;
}>;
/**
 * Handles cluster configuration updates
 *
 * @param cluster - The cluster
 * @param updates - Configuration updates to apply
 * @returns Updated cluster
 *
 * @example
 * ```typescript
 * const updated = await updateClusterConfiguration(cluster, {
 *   failoverPolicy: { ...policy, maxFailoverAttempts: 5 }
 * });
 * ```
 */
export declare function updateClusterConfiguration(cluster: Cluster, updates: Partial<ClusterConfig>): Promise<Cluster>;
/**
 * Implements Raft consensus election
 *
 * @param cluster - The cluster
 * @param candidates - Candidate nodes for leadership
 * @returns Elected leader
 *
 * @example
 * ```typescript
 * const leader = await raftElection(cluster, candidates);
 * console.log(`Raft elected: ${leader.id}`);
 * ```
 */
export declare function raftElection(cluster: Cluster, candidates: ClusterNode[]): Promise<ClusterNode>;
/**
 * Implements Paxos consensus election
 *
 * @param cluster - The cluster
 * @param candidates - Candidate nodes
 * @returns Elected leader
 *
 * @example
 * ```typescript
 * const leader = await paxosElection(cluster, candidates);
 * console.log(`Paxos elected: ${leader.id}`);
 * ```
 */
export declare function paxosElection(cluster: Cluster, candidates: ClusterNode[]): Promise<ClusterNode>;
/**
 * Implements majority vote consensus
 *
 * @param cluster - The cluster
 * @param candidates - Candidate nodes
 * @returns Elected leader
 *
 * @example
 * ```typescript
 * const leader = await majorityVoteElection(cluster, candidates);
 * console.log(`Majority vote elected: ${leader.id}`);
 * ```
 */
export declare function majorityVoteElection(cluster: Cluster, candidates: ClusterNode[]): Promise<ClusterNode>;
/**
 * Implements gossip-based leader election
 *
 * @param cluster - The cluster
 * @param candidates - Candidate nodes
 * @returns Elected leader
 *
 * @example
 * ```typescript
 * const leader = await gossipBasedElection(cluster, candidates);
 * console.log(`Gossip elected: ${leader.id}`);
 * ```
 */
export declare function gossipBasedElection(cluster: Cluster, candidates: ClusterNode[]): Promise<ClusterNode>;
/**
 * Captures current cluster state snapshot
 *
 * @param cluster - The cluster
 * @returns Immutable state snapshot
 *
 * @example
 * ```typescript
 * const snapshot = captureClusterSnapshot(cluster);
 * console.log(`Snapshot at ${snapshot.timestamp}`);
 * ```
 */
export declare function captureClusterSnapshot(cluster: Cluster): {
    clusterId: string;
    timestamp: Date;
    state: ClusterState;
    nodes: ReadonlyArray<Readonly<ClusterNode>>;
    leader: Readonly<ClusterNode> | undefined;
    quorumState: QuorumState;
    term: number;
};
/**
 * Restores cluster from state snapshot
 *
 * @param cluster - The cluster to restore
 * @param snapshot - State snapshot to restore from
 * @returns Restored cluster
 *
 * @example
 * ```typescript
 * const restored = restoreClusterFromSnapshot(cluster, snapshot);
 * console.log(`Restored to state from ${snapshot.timestamp}`);
 * ```
 */
export declare function restoreClusterFromSnapshot(cluster: Cluster, snapshot: ReturnType<typeof captureClusterSnapshot>): Cluster;
/**
 * Validates cluster state consistency
 *
 * @param cluster - The cluster to validate
 * @returns Validation result with any inconsistencies found
 *
 * @example
 * ```typescript
 * const validation = validateClusterState(cluster);
 * if (!validation.isValid) {
 *   console.log('Inconsistencies:', validation.issues);
 * }
 * ```
 */
export declare function validateClusterState(cluster: Cluster): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
};
/**
 * Tracks cluster state transitions over time
 *
 * @param cluster - The cluster
 * @param newState - New state to transition to
 * @param reason - Reason for state change
 * @returns State transition record
 *
 * @example
 * ```typescript
 * const transition = trackStateTransition(cluster, ClusterState.DEGRADED, 'Node failure');
 * console.log(`State changed from ${transition.fromState} to ${transition.toState}`);
 * ```
 */
export declare function trackStateTransition(cluster: Cluster, newState: ClusterState, reason: string): {
    transitionId: string;
    timestamp: Date;
    fromState: ClusterState;
    toState: ClusterState;
    reason: string;
    metadata: Record<string, unknown>;
};
/**
 * Configures active-active clustering mode
 *
 * @param cluster - The cluster to configure
 * @param config - Active-active configuration
 * @returns Configured cluster
 *
 * @example
 * ```typescript
 * const configured = configureActiveActive(cluster, {
 *   loadBalancing: LoadBalancingAlgorithm.RESOURCE_BASED,
 *   dataReplication: 'sync'
 * });
 * ```
 */
export declare function configureActiveActive(cluster: Cluster, config: {
    loadBalancing: LoadBalancingAlgorithm;
    dataReplication: 'sync' | 'async';
    conflictResolution: 'timestamp' | 'priority' | 'manual';
}): Cluster;
/**
 * Handles conflict resolution in active-active mode
 *
 * @param conflicts - Array of conflicting operations
 * @param strategy - Resolution strategy
 * @returns Resolved operation
 *
 * @example
 * ```typescript
 * const resolved = resolveActiveActiveConflicts(conflicts, 'timestamp');
 * console.log(`Resolved to operation from ${resolved.nodeId}`);
 * ```
 */
export declare function resolveActiveActiveConflicts<T>(conflicts: Array<{
    nodeId: string;
    timestamp: Date;
    priority: number;
    data: T;
}>, strategy: 'timestamp' | 'priority' | 'manual'): {
    nodeId: string;
    timestamp: Date;
    priority: number;
    data: T;
};
/**
 * Configures active-passive clustering mode
 *
 * @param cluster - The cluster to configure
 * @param activeNodeId - ID of node to make active
 * @returns Configured cluster
 *
 * @example
 * ```typescript
 * const configured = configureActivePassive(cluster, 'node-1');
 * console.log(`Active node: ${configured.activeNodes[0].id}`);
 * ```
 */
export declare function configureActivePassive(cluster: Cluster, activeNodeId: string): Cluster;
/**
 * Promotes passive node to active in active-passive mode
 *
 * @param cluster - The cluster
 * @param passiveNodeId - ID of passive node to promote
 * @returns Updated cluster with promoted node
 *
 * @example
 * ```typescript
 * const updated = promotePassiveNode(cluster, 'node-2');
 * console.log(`Promoted ${passiveNodeId} to active`);
 * ```
 */
export declare function promotePassiveNode(cluster: Cluster, passiveNodeId: string): Cluster;
//# sourceMappingURL=san-failover-clustering-kit.d.ts.map